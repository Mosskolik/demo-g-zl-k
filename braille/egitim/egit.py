"""
Hücre bulucu eğitimi (CPU ya da GPU).
  python egit.py --veri <sentetik_klasor> --cikti model.pt --tur 10
Sentetik veri uretici.py ile üretilir (.json: dots, cells [x, y, kod, satır], dot_r, dot_gap).
"""
import argparse, glob, json, math, os, random, time
import numpy as np, cv2, torch
from torch.utils.data import Dataset, DataLoader
from model import NoktaAgi, toplam_kayip, on_isle, yukle


def gauss_ciz(t, pts, sigma):
    h, w = t.shape
    r = int(math.ceil(3 * sigma))
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    for x, y in pts:
        ix, iy = int(round(x)), int(round(y))
        if not (0 <= ix < w and 0 <= iy < h): continue
        g = np.exp(-((xx + ix - x) ** 2 + (yy + iy - y) ** 2) / (2 * sigma ** 2))
        x0, x1, y0, y1 = max(0, ix - r), min(w, ix + r + 1), max(0, iy - r), min(h, iy + r + 1)
        np.maximum(t[y0:y1, x0:x1], g[y0 - (iy - r):y1 - (iy - r), x0 - (ix - r):x1 - (ix - r)], out=t[y0:y1, x0:x1])
        t[iy, ix] = 1.0
    return t


def ayna_kod(k):
    """Yatay aynada sol sütun (1,2,3) ile sağ sütun (4,5,6) yer değiştirir."""
    return ((k & 7) << 3) | ((k >> 3) & 7)


def gercek_etiket(f):
    """Gerçek fotoğraf (Angelina .labeled.csv / BrailleLens LabelMe .json): hücre kutularından nokta ve hücre etiketleri.
    Dönüş: dots, cells (x, y, kod), r, gap, tam_etiketli (Angelina: sayfadaki her hücre etiketli; BrailleLens: değil)."""
    from degerlendir import kutular, nokta_yeri
    bx = kutular(f)
    dots, cells = [], []
    for x1, y1, x2, y2, ns in bx:
        cells.append(((x1 + x2) / 2, (y1 + y2) / 2, sum(1 << (n - 1) for n in ns)))
        dots += [nokta_yeri(x1, y1, x2, y2, n) for n in ns]
    gap = float(np.median([(b[2] - b[0]) / 2 for b in bx])) if bx else 6.0
    tam = os.path.splitext(f)[0].endswith('.labeled')
    return np.array(dots, np.float32).reshape(-1, 2), np.array(cells, np.float32).reshape(-1, 3), 0.3 * gap, gap, tam, bx


class Veri(Dataset):
    def __init__(self, dosyalar, boyut=384, egitim=True):
        self.f = dosyalar; self.S = boyut; self.egitim = egitim

    def __len__(self): return len(self.f)

    def __getitem__(self, i):
        f = self.f[i]
        im = cv2.imread(f, cv2.IMREAD_GRAYSCALE)
        if not self.egitim or random.random() < 0.7:
            im = on_isle(im)
        im = im.astype(np.float32) / 255
        jy = os.path.splitext(f)[0] + '.json'
        j = json.load(open(jy)) if os.path.exists(jy) else {}
        H, W = im.shape
        gecerli = np.ones((H, W), np.float32)  # kaybın hesaplanacağı bölge
        if 'dots' in j:  # sentetik
            dots = np.array(j['dots'], np.float32).reshape(-1, 2)
            cells = np.array(j.get('cells', []), np.float32).reshape(-1, 4)[:, :3].copy()
            r = float(j.get('dot_r', 4)); gap = float(j.get('dot_gap', r * 3))
            sc = random.uniform(0.75, 1.3)
        else:  # gerçek fotoğraf
            dots, cells, r, gap, tam, bx = gercek_etiket(f)
            if not tam:  # her hücre etiketli değil: sadece etiketli kutuların çevresinden öğren
                gecerli[:] = 0
                for x1, y1, x2, y2, _ in bx:
                    dw, dh = (x2 - x1), 0.35 * (y2 - y1)
                    gecerli[max(0, int(y1 - dh)):int(y2 + dh) + 1, max(0, int(x1 - dw)):int(x2 + dw) + 1] = 1
            sc = random.uniform(7, 16) / max(gap, 1e-3)  # nokta aralığını eğitimdeki aralığa getir
        S = self.S
        if self.egitim:
            yeni = (max(8, int(W * sc)), max(8, int(H * sc)))
            im = cv2.resize(im, yeni, interpolation=cv2.INTER_AREA if sc < 1 else cv2.INTER_LINEAR)
            gecerli = cv2.resize(gecerli, yeni, interpolation=cv2.INTER_NEAREST)
            dots = dots * sc; cells[:, :2] *= sc; r *= sc; gap *= sc; H, W = im.shape
            if H < S or W < S:
                pad = ((0, max(0, S - H)), (0, max(0, S - W)))
                im = np.pad(im, pad, mode='reflect'); gecerli = np.pad(gecerli, pad); H, W = im.shape
            x0, y0 = random.randint(0, W - S), random.randint(0, H - S)
            im = im[y0:y0 + S, x0:x0 + S]; gecerli = gecerli[y0:y0 + S, x0:x0 + S]
            dots = dots - [x0, y0]; cells[:, :2] -= [x0, y0]
            im = np.clip((im - 0.5) * random.uniform(0.7, 1.4) + 0.5 + random.uniform(-0.15, 0.15), 0, 1)
            if random.random() < 0.5:  # yatay ayna: ışık yönü korunur, hücre sütunları yer değiştirir
                im = im[:, ::-1].copy(); gecerli = gecerli[:, ::-1].copy()
                dots[:, 0] = S - 1 - dots[:, 0]; cells[:, 0] = S - 1 - cells[:, 0]
                cells[:, 2] = [ayna_kod(int(k)) for k in cells[:, 2]]
        h, w = im.shape
        nokta_h = gauss_ciz(np.zeros((h, w), np.float32), dots, max(1.2, 0.5 * r))
        hucre_h = gauss_ciz(np.zeros((h, w), np.float32), cells[:, :2], max(1.5, 0.45 * gap))
        bit_h = np.zeros((6, h, w), np.float32); maske = np.zeros((1, h, w), np.float32)
        rr = max(1, int(round(0.3 * gap)))
        for x, y, k in cells:
            ix, iy = int(round(x)), int(round(y))
            if not (0 <= ix < w and 0 <= iy < h): continue
            ys, xs = slice(max(0, iy - rr), iy + rr + 1), slice(max(0, ix - rr), ix + rr + 1)
            maske[0, ys, xs] = 1
            for b in range(6): bit_h[b, ys, xs] = (int(k) >> b) & 1
        return (torch.from_numpy(im[None].copy()), torch.from_numpy(nokta_h[None]), torch.from_numpy(hucre_h[None]),
                torch.from_numpy(bit_h), torch.from_numpy(maske), torch.from_numpy(np.ascontiguousarray(gecerli)[None]))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--veri', required=True)
    ap.add_argument('--cikti', default='hucre_modeli.pt'); ap.add_argument('--tur', type=int, default=10)
    ap.add_argument('--batch', type=int, default=8); ap.add_argument('--boyut', type=int, default=384)
    ap.add_argument('--lr', type=float, default=2e-3); ap.add_argument('--baslangic', default='')
    ap.add_argument('--gercek_liste', default='', help='gerçek fotoğrafların yollarını içeren metin dosyası')
    ap.add_argument('--gercek_oran', type=float, default=0.3)
    a = ap.parse_args()
    dev = 'cuda' if torch.cuda.is_available() else 'cpu'
    dosyalar = sorted(glob.glob(os.path.join(a.veri, '*.jpg')))
    gercek = [l.strip() for l in open(a.gercek_liste)] if a.gercek_liste else []
    if gercek:  # gerçek fotoğraflar her turda örneklerin yaklaşık 'gercek_oran' kadarı olsun
        tekrar = max(1, round(a.gercek_oran * len(dosyalar) / ((1 - a.gercek_oran) * len(gercek))))
        dosyalar = dosyalar + gercek * tekrar
        print(f'gerçek fotoğraf: {len(gercek)} × {tekrar}', flush=True)
    dl = DataLoader(Veri(dosyalar, a.boyut), batch_size=a.batch, shuffle=True, num_workers=min(4, os.cpu_count() or 1),
                    drop_last=True, pin_memory=dev == 'cuda', persistent_workers=True)
    model = (yukle(a.baslangic) if a.baslangic else NoktaAgi()).to(dev)
    opt = torch.optim.AdamW(model.parameters(), lr=a.lr, weight_decay=1e-4)
    sched = torch.optim.lr_scheduler.OneCycleLR(opt, max_lr=a.lr, total_steps=a.tur * len(dl))
    scaler = torch.amp.GradScaler(enabled=dev == 'cuda')
    print(f'cihaz={dev} sayfa={len(dosyalar)} parametre={sum(p.numel() for p in model.parameters()) / 1e6:.2f}M', flush=True)
    for ep in range(a.tur):
        model.train(); t0 = time.time(); top = np.zeros(4)
        for x, nh, hh, bh, mk, gc in dl:
            x, nh, hh, bh, mk, gc = (t.to(dev, non_blocking=True) for t in (x, nh, hh, bh, mk, gc))
            with torch.autocast(dev, dtype=torch.float16, enabled=dev == 'cuda'):
                cikti = model(x)
            loss, parca = toplam_kayip(cikti.float(), nh, hh, bh, mk, gc)
            opt.zero_grad(); scaler.scale(loss).backward(); scaler.step(opt); scaler.update(); sched.step()
            top += [loss.item(), *parca]
        top /= len(dl)
        print(f'tur {ep + 1}/{a.tur} kayıp {top[0]:.4f} (nokta {top[1]:.3f} hücre {top[2]:.3f} bit {top[3]:.4f}) {time.time() - t0:.0f} sn', flush=True)
        torch.save(model.state_dict(), a.cikti)


if __name__ == '__main__':
    main()

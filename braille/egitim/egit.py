"""
Nokta bulucu eğitimi (CPU ya da GPU).
  python egit.py --veri <sentetik_klasor> [--gercek <gercek_klasor>] --cikti model.pt --tur 10
Sentetik veri uretici.py ile üretilir. İsteğe bağlı gerçek veri: görüntü + aynı adlı .json ({"dots": [[x,y],...]}).
"""
import argparse, glob, json, math, os, random, time
import numpy as np, cv2, torch
from torch.utils.data import Dataset, DataLoader
from model import NoktaAgi, odak_kaybi


def gauss_hedef(h, w, dots, sigma):
    t = np.zeros((h, w), np.float32)
    r = int(math.ceil(3 * sigma))
    yy, xx = np.mgrid[-r:r + 1, -r:r + 1]
    for x, y in dots:
        ix, iy = int(round(x)), int(round(y))
        if not (0 <= ix < w and 0 <= iy < h): continue
        g = np.exp(-((xx + ix - x) ** 2 + (yy + iy - y) ** 2) / (2 * sigma ** 2))
        x0, x1, y0, y1 = max(0, ix - r), min(w, ix + r + 1), max(0, iy - r), min(h, iy + r + 1)
        sub = g[y0 - (iy - r):y1 - (iy - r), x0 - (ix - r):x1 - (ix - r)]
        np.maximum(t[y0:y1, x0:x1], sub, out=t[y0:y1, x0:x1])
        t[iy, ix] = 1.0
    return t


class Veri(Dataset):
    def __init__(self, dosyalar, boyut=384, egitim=True):
        self.f = dosyalar; self.S = boyut; self.egitim = egitim

    def __len__(self): return len(self.f)

    def __getitem__(self, i):
        f = self.f[i]
        im = cv2.imread(f, cv2.IMREAD_GRAYSCALE).astype(np.float32) / 255
        j = json.load(open(os.path.splitext(f)[0] + '.json'))
        dots = np.array(j['dots'], np.float32).reshape(-1, 2)
        r = float(j.get('dot_r', 4))
        H, W = im.shape
        S = self.S
        if self.egitim:
            # rastgele ölçek + kırpma + kontrast/parlaklık
            sc = random.uniform(0.75, 1.3)
            im = cv2.resize(im, (int(W * sc), int(H * sc))); dots = dots * sc; r *= sc; H, W = im.shape
            if H < S or W < S:
                pad = ((0, max(0, S - H)), (0, max(0, S - W))); im = np.pad(im, pad, mode='reflect'); H, W = im.shape
            x0, y0 = random.randint(0, W - S), random.randint(0, H - S)
            im = im[y0:y0 + S, x0:x0 + S]; dots = dots - [x0, y0]
            im = np.clip((im - 0.5) * random.uniform(0.7, 1.4) + 0.5 + random.uniform(-0.15, 0.15), 0, 1)
            if random.random() < 0.5:  # yatay ayna (ışık yönü korunur)
                im = im[:, ::-1].copy(); dots[:, 0] = S - 1 - dots[:, 0]
        hedef = gauss_hedef(im.shape[0], im.shape[1], dots, sigma=max(1.2, 0.5 * r))
        return torch.from_numpy(im[None].copy()), torch.from_numpy(hedef[None])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--veri', required=True); ap.add_argument('--gercek', default='')
    ap.add_argument('--cikti', default='nokta_modeli.pt'); ap.add_argument('--tur', type=int, default=10)
    ap.add_argument('--batch', type=int, default=8); ap.add_argument('--boyut', type=int, default=384)
    ap.add_argument('--lr', type=float, default=2e-3); ap.add_argument('--baslangic', default='')
    a = ap.parse_args()
    dev = 'cuda' if torch.cuda.is_available() else 'cpu'
    sent = sorted(glob.glob(os.path.join(a.veri, '*.jpg')))
    gercek = sorted(glob.glob(os.path.join(a.gercek, '*.jpg')) + glob.glob(os.path.join(a.gercek, '*.jpeg'))) if a.gercek else []
    dosyalar = sent + gercek * max(1, len(sent) // max(1, 10 * len(gercek))) if gercek else sent  # gerçek veriyi ağırlıklandır
    dl = DataLoader(Veri(dosyalar, a.boyut), batch_size=a.batch, shuffle=True, num_workers=min(4, os.cpu_count() or 1), drop_last=True)
    model = NoktaAgi().to(dev)
    if a.baslangic: model.load_state_dict(torch.load(a.baslangic, map_location=dev))
    opt = torch.optim.AdamW(model.parameters(), lr=a.lr, weight_decay=1e-4)
    sched = torch.optim.lr_scheduler.OneCycleLR(opt, max_lr=a.lr, total_steps=a.tur * len(dl))
    print(f'cihaz={dev} sentetik={len(sent)} gerçek={len(gercek)} parametre={sum(p.numel() for p in model.parameters())/1e6:.2f}M', flush=True)
    for ep in range(a.tur):
        model.train(); t0 = time.time(); top = 0
        for x, y in dl:
            x, y = x.to(dev), y.to(dev)
            loss = odak_kaybi(model(x), y)
            opt.zero_grad(); loss.backward(); opt.step(); sched.step(); top += loss.item()
        print(f'tur {ep + 1}/{a.tur} kayıp {top / len(dl):.4f} ({time.time() - t0:.0f} sn)', flush=True)
        torch.save(model.state_dict(), a.cikti)


if __name__ == '__main__':
    main()

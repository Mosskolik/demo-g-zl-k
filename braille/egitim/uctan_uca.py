"""
Uçtan uca okuma doğruluğu: model noktaları → cozucu → Unicode Braille satırları, gerçek satırlarla karşılaştırılır.
  python uctan_uca.py --model m.pt --sentetik <klasör>          (uretici.py çıktısı; .json 'cells' içerir)
  python uctan_uca.py --model m.pt --gercek <klasör> --gt gt.json (gt.json: {dosya: [satır, ...]})
  --kusursuz : model yerine etiket noktalarını kullan (sadece çözücüyü ölçer)
Ölçü: hücre doğruluğu = 1 − (düzenleme uzaklığı toplamı / gerçek hücre sayısı); boş hücreler (⠀) sayılmaz.
"""
import argparse, glob, json, os
import numpy as np, cv2, torch
from model import on_isle, yukle, hucreler
from cozucu import coz, hucre_satirlari

BOS = '⠀'


def lev(a, b):
    if not a: return len(b)
    if not b: return len(a)
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1]


def sade(s): return s.replace(BOS, '').replace(' ', '')


def karsilastir(gt_satirlar, tahmin_satirlar):
    """Her gerçek satırı en iyi eşleşen tahmin satırıyla eşle (tahmin satırı bir kez kullanılır)."""
    g = [sade(s) for s in gt_satirlar if sade(s)]
    t = [sade(s) for s in tahmin_satirlar if sade(s)]
    kul = set(); hata = 0; top = 0
    for s in g:
        top += len(s)
        en = (len(s), None)
        for i, u in enumerate(t):
            if i in kul: continue
            d = lev(s, u)
            if d < en[0]: en = (d, i)
        if en[1] is not None: kul.add(en[1])
        hata += en[0]
    return hata, top


def gt_sentetik(js):
    cells = js.get('cells', [])
    if not cells: return []
    c = np.array(cells, np.float64)
    out = []
    for li in sorted(set(c[:, 3].astype(int))):
        s = c[c[:, 3] == li]
        out.append(''.join(chr(0x2800 + int(k)) for k in s[np.argsort(s[:, 0]), 2]))
    return out


@torch.no_grad()
def oku(model, gri, olcek=1.0, esik=0.3, on=True):
    """Görüntü → hücreler N×9 (orijinal piksel koordinatında)."""
    if on: gri = on_isle(gri)
    h, w = gri.shape
    im = cv2.resize(gri, (max(8, int(w * olcek) // 16 * 16), max(8, int(h * olcek) // 16 * 16)), interpolation=cv2.INTER_AREA)
    x = torch.from_numpy(im.astype(np.float32)[None, None] / 255)
    hc = hucreler(model(x), esik).numpy()
    hc[:, 0] *= w / im.shape[1]; hc[:, 1] *= h / im.shape[0]
    return hc


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', default=''); ap.add_argument('--sentetik', default=''); ap.add_argument('--gercek', default='')
    ap.add_argument('--gt', default=''); ap.add_argument('--kusursuz', action='store_true')
    ap.add_argument('--olcek', type=float, default=1.0); ap.add_argument('--esik', type=float, default=0.3)
    ap.add_argument('--adet', type=int, default=50)
    a = ap.parse_args()
    model = yukle(a.model) if a.model else None
    H = T = 0; sayfalar = []
    if a.sentetik:
        for f in sorted(glob.glob(os.path.join(a.sentetik, '*.jpg')))[:a.adet]:
            js = json.load(open(f[:-4] + '.json'))
            gt = gt_sentetik(js)
            if a.kusursuz:
                c = np.array(js['cells'], np.float64).reshape(-1, 4)
                hc = np.concatenate([c[:, :2], np.ones((len(c), 1)), [[(int(k) >> b) & 1 for b in range(6)] for k in c[:, 2]]], 1) if len(c) else np.zeros((0, 9))
                satirlar = hucre_satirlari(hc)
            else:
                satirlar = hucre_satirlari(oku(model, cv2.imread(f, cv2.IMREAD_GRAYSCALE), a.olcek, a.esik))
            h, t = karsilastir(gt, satirlar)
            H += h; T += t; sayfalar.append((os.path.basename(f), round(1 - h / max(1, t), 3)))
    if a.gercek:
        gtj = json.load(open(a.gt))
        for ad, satirlar in gtj.items():
            f = os.path.join(a.gercek, ad)
            if not os.path.exists(f): continue
            gri = on_isle(cv2.imread(f, cv2.IMREAD_GRAYSCALE))
            en = None
            for s in (0.5, 0.7, 1.0, 1.4):
                h, t = karsilastir(satirlar, hucre_satirlari(oku(model, gri, s, a.esik, on=False)))
                if en is None or h < en[0]: en = (h, t, s)
            H += en[0]; T += en[1]; sayfalar.append((ad, round(1 - en[0] / max(1, en[1]), 3), en[2]))
    for s in sayfalar: print(*s)
    print(f'TOPLAM hücre doğruluğu: {1 - H / max(1, T):.3f}  ({T} hücre)')


if __name__ == '__main__':
    main()

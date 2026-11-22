"""
Nokta bulucuyu ölçer.
  python degerlendir.py --model model.pt --gercek <klasör> [--sentetik <klasör>]
Gerçek veri: BrailleLens (labelme .json, etiket = nokta numaraları "236") ve Angelina (.labeled.csv: x1;y1;x2;y2;kod, normalize, kod bit maskesi).
Hücre kutularından nokta GT'si türetilir; tahmin noktaları GT'ye eşlenir (yarıçap = 0.3 · hücre içi aralık).
Ayrıca "kutu verildiğinde hücre doğruluğu": GT hücre kutusundaki tahmin noktalarından 6 bitlik kod çıkarılıp karşılaştırılır.
"""
import argparse, glob, json, os
import numpy as np, cv2, torch
from scipy.spatial import cKDTree
from model import NoktaAgi, tepeler


def kutular(f):
    """[(x1,y1,x2,y2, nokta_kümesi)] piksel cinsinden."""
    b = os.path.splitext(f)[0]
    if b.endswith('.labeled'):
        csv = b + '.csv'
    else:
        csv = b + '.labeled.csv' if os.path.exists(b + '.labeled.csv') else ''
    H, W = cv2.imread(f).shape[:2]
    out = []
    if csv and os.path.exists(csv):
        for ln in open(csv):
            p = ln.strip().split(';')
            if len(p) < 5: continue
            x1, y1, x2, y2 = float(p[0]) * W, float(p[1]) * H, float(p[2]) * W, float(p[3]) * H
            k = int(p[4]); out.append((x1, y1, x2, y2, {i + 1 for i in range(6) if k >> i & 1}))
    elif os.path.exists(b + '.json'):
        j = json.load(open(b + '.json'))
        for s in j.get('shapes', []):
            (x1, y1), (x2, y2) = s['points'][:2]
            x1, x2 = sorted((x1, x2)); y1, y2 = sorted((y1, y2))
            out.append((x1, y1, x2, y2, {int(c) for c in str(s['label']) if c in '123456'}))
    return out


def nokta_yeri(x1, y1, x2, y2, n):
    w, h = x2 - x1, y2 - y1
    col = 0 if n <= 3 else 1; row = (n - 1) % 3
    return x1 + w * (0.25 + 0.5 * col), y1 + h * (1 / 6 + row / 3)


@torch.no_grad()
def tahmin(model, gri, olcek, esik):
    h, w = gri.shape
    im = cv2.resize(gri, (int(w * olcek) // 8 * 8, int(h * olcek) // 8 * 8), interpolation=cv2.INTER_AREA)
    x = torch.from_numpy(im.astype(np.float32)[None, None] / 255)
    t = tepeler(model(x), esik=esik).numpy()
    t[:, 0] *= w / im.shape[1]; t[:, 1] *= h / im.shape[0]
    return t


def olc(gt_pts, pr, yaricap):
    if len(pr) == 0: return 0, len(gt_pts), 0
    tr = cKDTree(pr[:, :2]); kul = set(); tp = 0
    for p in gt_pts:
        for d, i in zip(*tr.query(p, k=3, distance_upper_bound=yaricap)):
            if np.isfinite(d) and i not in kul:
                kul.add(i); tp += 1; break
    return tp, len(gt_pts) - tp, len(pr) - tp


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', required=True); ap.add_argument('--gercek', required=True)
    ap.add_argument('--olcekler', default='0.5,0.7,1.0,1.4'); ap.add_argument('--esik', type=float, default=0.3)
    ap.add_argument('--rapor', default='')
    a = ap.parse_args()
    model = NoktaAgi(); model.load_state_dict(torch.load(a.model, map_location='cpu')); model.eval()
    dosyalar = sorted(f for f in glob.glob(os.path.join(a.gercek, '*')) if f.lower().endswith(('.jpg', '.jpeg', '.png')) and kutular(f))
    olcekler = [float(s) for s in a.olcekler.split(',')]
    sonuc = {}
    for f in dosyalar:
        bx = kutular(f)
        gri = cv2.imread(f, cv2.IMREAD_GRAYSCALE)
        gt = np.array([nokta_yeri(*b[:4], n) for b in bx for n in b[4]])
        ara = np.median([(b[2] - b[0]) / 2 for b in bx])  # hücre içi nokta aralığı ≈ kutu genişliği / 2
        en_iyi = None
        for s in olcekler:
            pr = tahmin(model, gri, s, a.esik)
            tp, fn, fp = olc(gt, pr, 0.4 * ara)
            f1 = 2 * tp / max(1, 2 * tp + fn + fp)
            # kutu verildiğinde hücre doğruluğu
            dogru = 0
            if len(pr):
                tr = cKDTree(pr[:, :2])
                for x1, y1, x2, y2, ns in bx:
                    bul = set()
                    for n in range(1, 7):
                        d, _ = tr.query(nokta_yeri(x1, y1, x2, y2, n))
                        if d < 0.4 * ara: bul.add(n)
                    dogru += bul == ns
            r = dict(olcek=s, f1=round(f1, 3), duyarlilik=round(tp / max(1, tp + fn), 3), kesinlik=round(tp / max(1, tp + fp), 3), hucre=round(dogru / len(bx), 3))
            if en_iyi is None or r['f1'] > en_iyi['f1']: en_iyi = r
        sonuc[os.path.basename(f)] = en_iyi
        print(os.path.basename(f)[:40].ljust(40), en_iyi, flush=True)
    ort = {k: round(float(np.mean([v[k] for v in sonuc.values()])), 3) for k in ('f1', 'duyarlilik', 'kesinlik', 'hucre')}
    print('ORTALAMA', ort)
    if a.rapor: json.dump(dict(sayfalar=sonuc, ortalama=ort), open(a.rapor, 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()

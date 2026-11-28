# Klasik görüntü işleme ile Braille okuma prototipi (yapay zekâ yok):
# kabartma noktaları bul → ızgaraya oturt → 2x3 hücreler → Unicode Braille satırları
import sys, json, math
import numpy as np, cv2
from scipy import ndimage

def detect_dots(gray, ink=False):
    g = gray.astype(np.float32)
    g = g - cv2.GaussianBlur(g, (0, 0), 15)          # aydınlatma farklarını gider
    g = (g - g.mean()) / (g.std() + 1e-6)
    if ink:
        resp = -cv2.GaussianBlur(g, (0, 0), 2)         # mürekkep: koyu yuvarlak nokta
    else:
        # kabartma (ışık yukarıdan): noktanın üstü parlak, altı gölgeli → dikey türev deseni
        dy = cv2.Sobel(cv2.GaussianBlur(g, (0, 0), 1.5), cv2.CV_32F, 0, 1, ksize=5)
        resp = -dy                                     # yukarıdan aşağı parlaktan koyuya geçiş
    # nokta boyutunu kestir: farklı ölçeklerde LoG benzeri en güçlü tepki
    best = None
    for s in (1.5, 2.0, 2.5, 3.0, 4.0, 5.0):
        r = cv2.GaussianBlur(resp, (0, 0), s) * s
        mx = ndimage.maximum_filter(r, size=int(3 * s))
        pk = (r == mx) & (r > np.percentile(r, 99.0))
        n = pk.sum()
        score = r[pk].mean() if n else 0
        if best is None or score > best[0]: best = (score, s, r)
    _, s, r = best
    mx = ndimage.maximum_filter(r, size=int(3 * s))
    thr = np.percentile(r, 98.5)
    ys, xs = np.nonzero((r == mx) & (r > thr))
    vals = r[ys, xs]
    # zayıf ve aşırı güçlü (leke) uç değerleri ele: medyanın belli katı altında olanları at
    keep = vals > 0.45 * np.median(vals)
    return np.stack([xs[keep], ys[keep]], 1).astype(np.float32), s

def pitch(pts):
    from scipy.spatial import cKDTree
    t = cKDTree(pts); d, _ = t.query(pts, k=2)
    nn = d[:, 1]; return float(np.median(nn))

def cluster_1d(vals, gap):
    order = np.argsort(vals); groups = []; cur = [order[0]]
    for a, b in zip(order[:-1], order[1:]):
        if vals[b] - vals[a] > gap: groups.append(cur); cur = [b]
        else: cur.append(b)
    groups.append(cur); return groups

def deskew(pts, p):
    # Sayfa eğikse satırlar karışır: -6..6 derece arasında nokta y-izdüşümünü en keskin yapan açıyı bul
    best = (0, 0)
    c = pts.mean(0)
    for a in np.arange(-6, 6.01, 0.2):
        t = math.radians(a); y = (pts[:, 0] - c[0]) * math.sin(t) + (pts[:, 1] - c[1]) * math.cos(t)
        h, _ = np.histogram(y, bins=np.arange(y.min(), y.max() + p / 3, p / 3))
        sc = (h.astype(np.float64) ** 2).sum()
        if sc > best[0]: best = (sc, t)
    t = best[1]; x = (pts[:, 0] - c[0]) * math.cos(t) - (pts[:, 1] - c[1]) * math.sin(t); y = (pts[:, 0] - c[0]) * math.sin(t) + (pts[:, 1] - c[1]) * math.cos(t)
    return np.stack([x, y], 1)

def read_cells(pts):
    if len(pts) < 6: return []
    p = pitch(pts)
    pts = deskew(pts, p)                         # nokta aralığı (hücre içi ~2.5 mm)
    # satırlar: noktaları y'ye göre kümele, sonra 3'lü nokta satırlarını Braille satırına grupla
    rows = cluster_1d(pts[:, 1], 0.45 * p)
    ry = np.array([pts[g, 1].mean() for g in rows])
    order = np.argsort(ry); rows = [rows[i] for i in order]; ry = ry[order]
    # nokta satırı aralığı ~p; Braille satırları arası boşluk daha büyük → 3'lü gruplar
    lines, cur = [], [0]
    for i in range(1, len(rows)):
        if ry[i] - ry[cur[0]] > 2.6 * p: lines.append(cur); cur = [i]
        else: cur.append(i)
    lines.append(cur)
    out = []
    for ln in lines:
        top = ry[ln[0]]
        idx = np.concatenate([rows[i] for i in ln]); P = pts[idx]
        rowpos = np.clip(np.round((P[:, 1] - top) / p), 0, 2).astype(int)
        # sütunlar: x'e göre kümele; hücre içi sütun aralığı ~p, hücreler arası ~2.5p
        cols = cluster_1d(P[:, 0], 0.45 * p)
        cx = np.array([P[g, 0].mean() for g in cols]); o = np.argsort(cx); cols = [cols[i] for i in o]; cx = cx[o]
        cells, i = [], 0
        while i < len(cols):
            left = cx[i]; code = 0
            members = [i]
            if i + 1 < len(cols) and cx[i + 1] - left < 1.5 * p: members.append(i + 1)
            # tek sütunlu hücrede sol mu sağ mı? önceki hücrenin konumundan hücre ızgarasına göre karar ver
            for k, mi in enumerate(members):
                colidx = k
                if len(members) == 1 and cells:
                    prev_left = cells[-1][0]
                    step = (left - prev_left) / (2.5 * p)
                    colidx = 1 if abs(step - round(step)) > 0.25 else 0
                for j in cols[mi]: code |= 1 << ((0 if colidx == 0 else 3) + rowpos[j])
            cells.append((left if (len(members) == 2 or colidx == 0) else left - p, code))
            i += len(members)
        s = ''
        for k, (x, code) in enumerate(cells):
            if k and x - cells[k - 1][0] > 3.6 * p: s += ' ' * max(1, int(round((x - cells[k - 1][0]) / (2.5 * p))) - 1)
            s += chr(0x2800 + code)
        out.append(s)
    return out

if __name__ == '__main__':
    res = {}
    for path in sys.argv[2:]:
        im = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
        ink = 'murekkep' in path
        pts, s = detect_dots(im, ink=ink)
        lines = read_cells(pts)
        res[path.split('/')[-1]] = lines
        print(path.split('/')[-1], len(pts), 'nokta,', len(lines), 'satır')
    json.dump(res, open(sys.argv[1], 'w'), ensure_ascii=False, indent=1)

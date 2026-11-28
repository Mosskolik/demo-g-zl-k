"""
Nokta merkezlerinden Braille satırları (Unicode) çıkarır.
1) Nokta aralığı p (en yakın komşu medyanı)  2) Eğiklik düzeltme  3) Nokta satırlarını Braille satırlarına grupla
4) Her satırda hücre ızgarasını oturt: x = x0 + k·c + j·p (j = 0/1 sütun), c ve x0 tarama ile seçilir.
Tek sütunlu hücreler de (ör. ⠁, ⠈) ızgara sayesinde doğru sütuna yerleşir.
"""
import math
import numpy as np
from scipy.spatial import cKDTree


def nokta_araligi(pts):
    d, _ = cKDTree(pts).query(pts, k=2)
    nn = d[:, 1]
    # en yakın komşu çoğunlukla hücre içi aralık (p); aykırıları at
    return float(np.median(nn[nn < np.percentile(nn, 90)]))


def egiklik(pts, p):
    c = pts.mean(0); best = (-1, 0.0)
    for a in np.arange(-8, 8.01, 0.25):
        t = math.radians(a)
        y = (pts[:, 0] - c[0]) * math.sin(t) + (pts[:, 1] - c[1]) * math.cos(t)
        h, _ = np.histogram(y, bins=np.arange(y.min() - p, y.max() + p, p / 4))
        sc = float((h.astype(np.float64) ** 2).sum())
        if sc > best[0]: best = (sc, t)
    t = best[1]
    x = (pts[:, 0] - c[0]) * math.cos(t) - (pts[:, 1] - c[1]) * math.sin(t)
    y = (pts[:, 0] - c[0]) * math.sin(t) + (pts[:, 1] - c[1]) * math.cos(t)
    return np.stack([x, y], 1)


def kumele(v, bosluk):
    o = np.argsort(v); g = [[o[0]]]
    for a, b in zip(o[:-1], o[1:]):
        if v[b] - v[a] > bosluk: g.append([b])
        else: g[-1].append(b)
    return g


def satir_hucreleri(P, p):
    """P: bir Braille satırının noktaları (x, satır_içi_sıra 0..2). Hücre ızgarasını oturtur."""
    x = P[:, 0]
    en = None
    for c in np.linspace(2.2 * p, 2.9 * p, 15):
        for faz in np.linspace(0, c, 24, endpoint=False):
            u = (x - x.min() - faz) / c          # hücre birimi
            k = np.floor(u); r = (u - k) * c      # hücre içi konum
            # hücre içi konum 0 (sol) ya da p (sağ) olmalı
            d = np.minimum(np.abs(r - 0), np.minimum(np.abs(r - p), np.abs(r - c)))
            s = float((np.minimum(d, 0.5 * p) ** 2).sum())
            if en is None or s < en[0]: en = (s, c, faz)
    _, c, faz = en
    u = (x - x.min() - faz) / c; k = np.floor(u); r = (u - k) * c
    sag = np.abs(r - p) < np.abs(r)
    ust = np.abs(r - c) < np.minimum(np.abs(r), np.abs(r - p))  # bir sonraki hücrenin solu
    k = k + ust; sag = sag & ~ust
    kodlar = {}
    for ki, s, row in zip(k.astype(int), sag, P[:, 1].astype(int)):
        kodlar[ki] = kodlar.get(ki, 0) | (1 << ((3 if s else 0) + row))
    if not kodlar: return ''
    a, b = min(kodlar), max(kodlar)
    return ''.join(chr(0x2800 + kodlar.get(i, 0)) for i in range(a, b + 1))


def coz(pts):
    """pts: Nx2 (veya Nx3, güven sütunu yok sayılır). Dönüş: Unicode Braille satırları (yukarıdan aşağı)."""
    pts = np.asarray(pts, np.float64)[:, :2]
    if len(pts) < 4: return []
    p = nokta_araligi(pts)
    q = egiklik(pts, p)
    rows = kumele(q[:, 1], 0.45 * p)
    ry = np.array([q[g, 1].mean() for g in rows]); o = np.argsort(ry)
    rows = [rows[i] for i in o]; ry = ry[o]
    # nokta satırlarını 3'lü Braille satırlarına grupla: satır başı = en üst nokta satırı
    satirlar, i = [], 0
    while i < len(rows):
        grup = [i]; j = i + 1
        while j < len(rows) and ry[j] - ry[i] < 2.5 * p:
            grup.append(j); j += 1
        satirlar.append(grup); i = j
    out = []
    for grup in satirlar:
        idx = np.concatenate([rows[g] for g in grup])
        top = ry[grup[0]]
        # satırın ilk nokta sırası aslında 2. ya da 3. sıra olabilir (üst noktası olmayan satır): orta sıradan hizala
        rowpos = np.round((q[idx, 1] - top) / p)
        if rowpos.max() <= 1 and len(grup) <= 2 and out:
            pass
        rowpos = np.clip(rowpos, 0, 2)
        P = np.stack([q[idx, 0], rowpos], 1)
        s = satir_hucreleri(P, p)
        if s: out.append(s)
    return out


def parcalari_birlestir(satirlar, q, c, en_bosluk=20, dy_esik=0.35):
    """Aynı hizadaki satır parçalarını birleştirir (kaçan hücre ya da uzun boşluk satırı bölmüş olabilir).
    A'nın sonu ile B'nin başı aynı yükseklikte ve B, A'nın sağında başlıyorsa A+B tek satır olur."""
    satirlar = [list(z) for z in satirlar]
    while True:
        en = None
        for i, A in enumerate(satirlar):
            ax, ay = q[A[-1]]
            for j, B in enumerate(satirlar):
                if i == j: continue
                bx, by = q[B[0]]
                dx = bx - ax
                if dx < 0.4 * c or dx > en_bosluk * c: continue
                if q[B, 0].min() < q[A, 0].max(): continue  # x aralıkları çakışmasın
                # yükseklik: uçlar ve iki parçanın ortalaması birlikte tutmalı
                if abs(by - ay) > dy_esik * c or abs(np.median(q[B, 1]) - np.median(q[A, 1])) > dy_esik * c + 0.02 * dx: continue
                m = dx + 5 * abs(by - ay)
                if en is None or m < en[0]: en = (m, i, j)
        if en is None: return satirlar
        _, i, j = en
        satirlar[i] = satirlar[i] + satirlar[j]
        del satirlar[j]


def hucre_satirlari(h, bit_esik=0.5, guven_ver=False):
    """
    Model hücre çıktısından satırlar. h: N×9 (x, y, güven, p1..p6).
    Her hücre sağındaki en yakın hücreye bağlanır (satır zinciri); eğik ve perspektifli çekimde de çalışır.
    guven_ver=True ise her satır için hücre başına en düşük nokta güveni de döner (emin olunmayan hücreleri işaretlemek için).
    """
    h = np.asarray(h, np.float64)
    if len(h) == 0: return []
    pts = h[:, :2]
    if len(h) == 1:
        satirlar = [[0]]
        c = 1.0
    else:
        d, _ = cKDTree(pts).query(pts, k=2)
        c = float(np.median(d[:, 1]))  # komşu hücre aralığı
        q = egiklik(pts, c) if len(h) > 3 else pts
        n = len(h); sonraki = -np.ones(n, int); onceki_maliyet = {}
        agac = cKDTree(q)
        for i in range(n):
            en = None
            for j in agac.query_ball_point(q[i], 8 * c):
                dx, dy = q[j, 0] - q[i, 0], q[j, 1] - q[i, 1]
                if dx < 0.4 * c or abs(dy) > 0.3 * c + 0.08 * dx: continue
                m = dx + 3 * abs(dy)
                if en is None or m < en[0]: en = (m, j)
            if en is None: continue
            m, j = en
            if j in onceki_maliyet and onceki_maliyet[j][0] <= m: continue
            if j in onceki_maliyet: sonraki[onceki_maliyet[j][1]] = -1
            onceki_maliyet[j] = (m, i); sonraki[i] = j
        bas = [i for i in range(n) if i not in onceki_maliyet]
        satirlar = []
        for b in bas:
            z = [b]; gor = {b}
            while sonraki[z[-1]] >= 0 and sonraki[z[-1]] not in gor:
                z.append(sonraki[z[-1]]); gor.add(z[-1])
            satirlar.append(z)
        satirlar = parcalari_birlestir(satirlar, q, c)
        satirlar.sort(key=lambda z: (np.mean(q[z, 1]), q[z[0], 0]))
        pts = q
    out = []
    for z in satirlar:
        s = ''; g = []
        for k, i in enumerate(z):
            if k:
                bosluk = int(round((pts[i, 0] - pts[z[k - 1], 0]) / c)) - 1
                s += '⠀' * max(0, bosluk); g += [1.0] * max(0, bosluk)
            p = h[i, 3:9]
            s += chr(0x2800 + sum(1 << b for b in range(6) if p[b] > bit_esik))
            g.append(float(np.min(np.abs(p - 0.5)) * 2))
        out.append((s, g) if guven_ver else s)
    return out

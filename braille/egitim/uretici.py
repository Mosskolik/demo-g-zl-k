"""
Sentetik kabartma Türkçe Braille üretici (v2) — model eğitimi için.

Her örnek: telefonla çekilmiş gibi görünen bir Braille sayfası kırpıntısı + ön yüzdeki (kabartma) noktaların
merkez koordinatları. Arka yüzün çökük noktaları (çift taraflı baskı) da çizilir ama ETİKETLENMEZ:
model sadece okunacak yüzün noktalarını bulmayı öğrenmeli.

Çeşitlilik: hücre/nokta aralığı, nokta boyu ve yüksekliği, ışık yönü (çoğunlukla sayfanın üstünden),
kâğıt rengi ve dokusu, gölgeler, perspektif, dönme, bulanıklık, gürültü, JPEG sıkıştırması.
Metin: liblouis tr-g1 / tr-g2 (Türkçe kısaltmasız / kısaltmalı) + rastgele hücreler + sayılar.

Kullanım:  python uretici.py <cikti_klasoru> <adet> [tohum]
Çıktı: NNNNN.jpg + NNNNN.json ({"dots": [[x,y],...], "cells": [[x,y,code],...]})
"""
import json, math, os, random, sys
import numpy as np
import cv2

try:
    import louis
except ImportError:  # Kaggle vb. ortamda liblouis yoksa rastgele hücre kullan
    louis = None

HERE = os.path.dirname(os.path.abspath(__file__))


def load_corpus():
    words = []
    p = os.path.join(HERE, 'derlem.txt')
    if os.path.exists(p):
        for line in open(p, encoding='utf-8'):
            words += [w for w in line.strip().split() if w]
    return words or 'bir iki üç dört beş altı yedi sekiz dokuz on soru cevap kaçtır üçgen kare daire sayı'.split()


CORPUS = load_corpus()
_bj = os.path.join(HERE, 'derlem_braille.json')
BRAILLE_SOZLUK = json.load(open(_bj, encoding='utf-8')) if os.path.exists(_bj) else {}


def cevir(metin, table):
    if louis is not None:
        return louis.translateString(['unicode.dis', table], metin)
    # liblouis yok: önceden çevrilmiş sözcüklerden kur (Kaggle)
    i = 0 if table == 'tr-g1.ctb' else 1
    return '\u2800'.join(BRAILLE_SOZLUK[w][i] for w in metin.split())


def braille_line(rng, max_cells):
    """Bir satırlık Unicode Braille hücre dizisi (boşluk = U+2800)."""
    kind = rng.random()
    if kind < 0.75 and (louis is not None or BRAILLE_SOZLUK):
        words, out = [], ''
        while True:
            w = rng.choice(CORPUS)
            if rng.random() < 0.12: w = str(rng.randint(0, 999))
            if louis is None and w not in BRAILLE_SOZLUK: continue
            cand = ' '.join(words + [w])
            table = 'tr-g1.ctb' if rng.random() < 0.7 else 'tr-g2.ctb'
            try:
                b = cevir(cand, table)
            except Exception:
                b = ''
            if len(b) > max_cells:
                break
            words.append(w); out = b
            if len(words) > 20: break
        if out: return out
    # rastgele hücreler (dil bilgisinden bağımsız okumayı öğrensin)
    n = rng.randint(max(3, max_cells // 3), max_cells)
    s = ''
    for _ in range(n):
        s += '⠀' if rng.random() < 0.15 else chr(0x2800 + rng.randint(1, 63))
    return s


def render_page(rng, out_size=512):
    S = out_size
    # --- sayfa geometrisi (piksel) ---
    cell_w = rng.uniform(16, 42)                # hücre aralığı (6.2 mm)
    dot_gap = cell_w * rng.uniform(0.37, 0.42)  # hücre içi nokta aralığı (2.5 mm)
    line_h = cell_w * rng.uniform(1.5, 1.75)    # satır aralığı (10 mm)
    dot_r = dot_gap * rng.uniform(0.28, 0.4)    # nokta yarıçapı
    W = H = int(S * 1.6)                        # dönüşümden sonra kırpılacak geniş tuval
    margin_x, margin_y = rng.uniform(-cell_w * 2, cell_w * 3), rng.uniform(-line_h, line_h * 2)
    max_cells = int((W - margin_x) / cell_w)
    n_lines = int((H - margin_y) / line_h)
    recto, cells = [], []
    for li in range(n_lines):
        if rng.random() < 0.05: continue  # boş satır
        s = braille_line(rng, max(4, max_cells))
        indent = rng.randint(0, 3) if rng.random() < 0.3 else 0
        for ci, ch in enumerate(s):
            code = ord(ch) - 0x2800
            x0 = margin_x + (ci + indent) * cell_w
            y0 = margin_y + li * line_h
            if code: cells.append((x0 + dot_gap / 2, y0 + dot_gap, code, li))
            for d in range(6):
                if code >> d & 1:
                    col, row = (0 if d < 3 else 1), d % 3
                    recto.append((x0 + col * dot_gap, y0 + row * dot_gap))
    # arka yüz (çift taraflı baskı): satırların arasına kaymış çökük noktalar
    verso = []
    if rng.random() < 0.7:
        # gerçek çift taraflı sayfalarda arka yüz satırı ön yüz satırına çok yakın da düşebilir
        off_y = line_h * rng.uniform(0.15, 0.85); off_x = rng.uniform(0, cell_w)
        yogunluk = rng.uniform(0.35, 0.8)
        for li in range(-1, n_lines):
            for ci in range(max_cells):
                if rng.random() < yogunluk:
                    code = rng.randint(1, 63)
                    for d in range(6):
                        if code >> d & 1:
                            col, row = (1 if d < 3 else 0), d % 3  # arkadan bakınca ayna
                            verso.append((margin_x + off_x + ci * cell_w + col * dot_gap, margin_y + off_y + li * line_h + row * dot_gap))
    # --- yükseklik haritası ---
    hmap = np.zeros((H, W), np.float32)
    def bump(pts, amp_range):
        rr = int(math.ceil(dot_r * 2.2))
        yy, xx = np.mgrid[-rr:rr + 1, -rr:rr + 1].astype(np.float32)
        for (x, y) in pts:
            ix, iy = int(round(x)), int(round(y))
            if ix - rr < 0 or iy - rr < 0 or ix + rr + 1 > W or iy + rr + 1 > H: continue
            amp = rng.uniform(*amp_range); r = dot_r * rng.uniform(0.85, 1.15)
            g = np.exp(-((xx - (x - ix)) ** 2 + (yy - (y - iy)) ** 2) / (2 * (r * 0.62) ** 2))
            hmap[iy - rr:iy + rr + 1, ix - rr:ix + rr + 1] += amp * g
    flas = rng.random() < float(os.environ.get('FLAS_ORAN', '0')) or os.environ.get('FLAS_ZORLA') == '1'  # flaş / önden ışık: gölge yok, nokta kenarları koyu halka
    soluk = (not flas) and rng.random() < 0.3  # aşınmış / az kabarık noktalar
    bump(recto, (0.2, 0.6) if soluk else (0.5, 1.2))
    if rng.random() < 0.05:  # bazen bazı noktalar ezilmiş
        hmap *= 0.7
    bump(verso, (-1.2, -0.3))
    # --- gölgelendirme: ışık çoğunlukla sayfanın üstünden ---
    az = math.radians(rng.gauss(0, 25) if rng.random() < 0.85 else rng.uniform(-120, 120))  # 0 = üstten
    el = math.radians(rng.uniform(80, 89.5) if flas else (rng.uniform(25, 60) if rng.random() < 0.75 else rng.uniform(60, 80)))
    L = np.array([math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)], np.float32)
    k = rng.uniform(2.0, 5.0) * (16 / dot_r) ** 0.5
    gy, gx = np.gradient(hmap * k / max(1.0, dot_r / 4))
    n = np.sqrt(gx * gx + gy * gy + 1)
    shade = (-gx * L[0] - gy * L[1] + L[2]) / n
    shade = shade / L[2]  # düz kâğıt = 1
    if flas:
        # eğimli kenarlar kameraya ışığı daha az yansıtır (halka); nokta tepesi ve kâğıt parlak
        egim = np.sqrt(gx * gx + gy * gy); en = egim.max() + 1e-6
        halka = 1 - rng.uniform(0.2, 0.6) * np.clip(egim / en, 0, 1) ** rng.uniform(1.0, 2.5)  # ince koyu kenar
        w = rng.uniform(0.4, 0.9)
        shade = w * halka + (1 - w) * shade  # biraz yönlü gölge de kalsın
        shade += rng.uniform(0.05, 0.25) * np.clip(hmap / (hmap.max() + 1e-6), 0, 1)  # parlak tepe
    # --- kâğıt ---
    base = np.array([rng.uniform(0.75, 0.98)] * 3, np.float32) * np.array([1, rng.uniform(0.95, 1), rng.uniform(0.85, 1)], np.float32)
    tex = sum(cv2.resize(np.random.default_rng(rng.randint(0, 1 << 30)).standard_normal((max(2, H // s), max(2, W // s))).astype(np.float32), (W, H)) * a
              for s, a in ((1, 0.015), (4, 0.02), (32, 0.03)))
    contrast = rng.uniform(0.35, 1.0) if rng.random() < 0.6 else rng.uniform(0.1, 0.35)
    if flas: contrast = max(contrast, rng.uniform(0.5, 1.0))
    img = (1 + contrast * (shade - 1) + tex)[..., None] * base[None, None, :]
    # yumuşak gölgeler / ışık gradyanı (el, telefon, pencere)
    if rng.random() < 0.6:
        gxv = np.linspace(-1, 1, W)[None, :]; gyv = np.linspace(-1, 1, H)[:, None]
        a, b = rng.uniform(-0.25, 0.25), rng.uniform(-0.25, 0.25)
        img *= (1 + a * gxv + b * gyv)[..., None]
    if rng.random() < 0.3:
        mask = np.zeros((H, W), np.float32)
        cx, cy = rng.uniform(0, W), rng.uniform(0, H)
        cv2.ellipse(mask, (int(cx), int(cy)), (int(rng.uniform(80, 400)), int(rng.uniform(60, 300))), rng.uniform(0, 180), 0, 360, 1, -1)
        mask = cv2.GaussianBlur(mask, (0, 0), rng.uniform(20, 60))
        img *= (1 - rng.uniform(0.2, 0.5) * mask)[..., None]
    # --- kamera: perspektif + dönme, sonra kırp ---
    ang = math.radians(rng.uniform(-8, 8))
    c, s_ = math.cos(ang), math.sin(ang)
    src = np.float32([[0, 0], [W, 0], [W, H], [0, H]])
    jit = lambda: rng.uniform(-0.06, 0.06) * W
    cx0, cy0 = W / 2 + rng.uniform(-W * 0.1, W * 0.1), H / 2 + rng.uniform(-H * 0.1, H * 0.1)
    scale = rng.uniform(0.85, 1.25)
    dst = []
    for (x, y) in src:
        dx, dy = (x - W / 2) * scale, (y - H / 2) * scale
        dst.append([S / 2 + c * dx - s_ * dy + jit() - (cx0 - W / 2), S / 2 + s_ * dx + c * dy + jit() - (cy0 - H / 2)])
    M = cv2.getPerspectiveTransform(src, np.float32(dst))
    bg = np.array([rng.uniform(0.1, 0.6)] * 3, np.float32) * np.array([1, rng.uniform(0.8, 1), rng.uniform(0.6, 1)], np.float32)
    out = cv2.warpPerspective(np.clip(img, 0, 1), M, (S, S), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=tuple(float(v) for v in bg))
    def tp(pts):
        if not pts: return np.zeros((0, 2), np.float32)
        p = cv2.perspectiveTransform(np.float32(pts)[None], M)[0]
        keep = (p[:, 0] >= 0) & (p[:, 0] < S) & (p[:, 1] >= 0) & (p[:, 1] < S)
        return p[keep]
    dots = tp(recto)
    # hücre kodlarını da taşı (eğitimde gerekmez, değerlendirmede işe yarar)
    cell_list = []
    if cells:
        p = cv2.perspectiveTransform(np.float32([c_[:2] for c_ in cells])[None], M)[0]
        for (x, y), (_, _, code, li) in zip(p, cells):
            if 0 <= x < S and 0 <= y < S: cell_list.append([round(float(x), 2), round(float(y), 2), int(code), int(li)])
    # --- foto bozulmaları ---
    if rng.random() < 0.7:
        out = cv2.GaussianBlur(out, (0, 0), rng.uniform(0.3, 1.6))
    if rng.random() < 0.2:  # hareket bulanıklığı
        k = rng.randint(3, 7); ker = np.zeros((k, k), np.float32); ker[k // 2, :] = 1 / k
        rot = cv2.getRotationMatrix2D((k / 2 - 0.5, k / 2 - 0.5), rng.uniform(0, 180), 1)
        out = cv2.filter2D(out, -1, cv2.warpAffine(ker, rot, (k, k)))
    out = out + np.random.default_rng(rng.randint(0, 1 << 30)).normal(0, rng.uniform(0.005, 0.04), out.shape).astype(np.float32)
    if not flas and rng.random() < 0.25:  # aşırı pozlama: kâğıt beyaza yakın, kontrast sıkışık
        out = 1 - (1 - out) * rng.uniform(0.35, 0.7)
    elif rng.random() < 0.15:  # karanlık çekim
        out = out * rng.uniform(0.35, 0.7)
    out = (np.clip(out, 0, 1) * 255).astype(np.uint8)
    return out, dots, cell_list, dot_r * scale, dot_gap * scale


def main():
    out_dir, count = sys.argv[1], int(sys.argv[2])
    seed = int(sys.argv[3]) if len(sys.argv) > 3 else 0
    os.makedirs(out_dir, exist_ok=True)
    for i in range(count):
        rng = random.Random(seed * 1_000_003 + i)
        np.random.seed((seed * 7919 + i) % (2 ** 32))
        img, dots, cells, r, ara = render_page(rng)
        q = rng.randint(40, 95)
        cv2.imwrite(os.path.join(out_dir, f'{seed:02d}_{i:05d}.jpg'), cv2.cvtColor(img, cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, q])
        json.dump({'dots': dots.round(2).tolist(), 'cells': cells, 'dot_r': round(float(r), 2), 'dot_gap': round(float(ara), 2)},
                  open(os.path.join(out_dir, f'{seed:02d}_{i:05d}.json'), 'w'))


if __name__ == '__main__':
    main()

# Türkçe Braille test sayfaları: metin → liblouis tr-g1 → (a) mürekkep baskı, (b) kabartma benzetimi
import louis, json, sys, os, random, math
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
OUT = sys.argv[1]
random.seed(7); np.random.seed(7)
# Test sayfaları: her biri birkaç kısa matematik sorusu (doğru metni biliyoruz)
pages = {
 'tr_sayfa1': ['1. Bir torbada 3 kırmızı ve 5 mavi bilye vardır. Torbadan rastgele bir bilye çekiliyor. Çekilen bilyenin kırmızı olma olasılığı kaçtır?',
               '2. Bir karenin bir kenarı 4 santimetredir. Karenin alanı kaç santimetrekaredir?'],
 'tr_sayfa2': ['3. Ali 12 yaşında, kardeşi ondan 5 yaş küçüktür. Kardeşi kaç yaşındadır?',
               '4. Bir sınıfta 28 öğrenci vardır. Öğrencilerin yarısı kızdır. Sınıfta kaç erkek öğrenci vardır?'],
 'tr_sayfa3': ['5. Üçgenin iç açıları toplamı kaç derecedir?', '6. Bir sayının üç katının dört eksiği on yedidir. Bu sayı kaçtır?',
               '7. Çiğdem pazardan iki kilo şeftali aldı. Ödediği para kaç liradır?'],
}
MAXC = 32  # A4 Braille sayfasında bir satır ~32 hücre
def wrap(text):
    out, cur = [], ''
    for w in text.split(' '):
        t = (cur + ' ' + w).strip()
        if len(louis.translateString(['unicode.dis', 'tr-g1.ctb'], t)) > MAXC and cur: out.append(cur); cur = w
        else: cur = t
    if cur: out.append(cur)
    return out
pages = {k: [l for para in v for l in wrap(para)] for k, v in pages.items()}
DPI = 150; mm = DPI / 25.4
dot_d = 1.5 * mm; dot_gap = 2.5 * mm; cell_w = 6.2 * mm; line_h = 10.0 * mm; margin = 15 * mm
def cells_of(text):
    s = louis.translateString(['unicode.dis', 'tr-g1.ctb'], text)
    return s
def layout(lines):
    rows = [cells_of(l) for l in lines]
    W = int(2 * margin + cell_w * max(len(r) for r in rows)); H = int(2 * margin + line_h * len(rows))
    dots = []
    for li, r in enumerate(rows):
        for ci, ch in enumerate(r):
            code = ord(ch) - 0x2800
            for d in range(6):
                if code >> d & 1:
                    col, row = (0 if d < 3 else 1), d % 3
                    dots.append((margin + ci * cell_w + col * dot_gap, margin + li * line_h + row * dot_gap))
    return rows, W, H, dots
gt = {}
for name, lines in pages.items():
    rows, W, H, dots = layout(lines)
    gt[name] = {'text': lines, 'braille': rows}
    # (a) mürekkep baskı
    im = Image.new('L', (W, H), 255); dr = ImageDraw.Draw(im)
    for x, y in dots: dr.ellipse([x - dot_d/2, y - dot_d/2, x + dot_d/2, y + dot_d/2], fill=0)
    im.convert('RGB').save(f'{OUT}/{name}_murekkep.jpg', quality=92)
    # (b) kabartma: yükseklik haritası + yukarıdan gelen ışıkla gölgelendirme + kâğıt dokusu + bulanıklık + perspektif
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    hmap = np.zeros((H, W), np.float32); r = dot_d / 2
    for x, y in dots:
        x0, x1, y0, y1 = int(x - 2*r), int(x + 2*r) + 1, int(y - 2*r), int(y + 2*r) + 1
        sub = (xx[y0:y1, x0:x1] - x) ** 2 + (yy[y0:y1, x0:x1] - y) ** 2
        hmap[y0:y1, x0:x1] += np.exp(-sub / (2 * (r * 0.6) ** 2))
    gy, gx = np.gradient(hmap * 3.0)
    light = np.array([0.0, -0.8, 0.6]); light /= np.linalg.norm(light)  # ışık sayfanın üst tarafından
    nx, ny, nz = -gx, -gy, np.ones_like(gx); n = np.sqrt(nx**2 + ny**2 + nz**2)
    shade = (nx * light[0] + ny * light[1] + nz * light[2]) / n
    paper = 0.86 + 0.04 * np.random.randn(H, W).astype(np.float32)
    img = np.clip(paper * (0.55 + 0.6 * shade), 0, 1)
    rgb = np.stack([img * 0.98, img * 0.96, img * 0.88], -1)  # krem kâğıt
    pil = Image.fromarray((rgb * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.9))
    # hafif perspektif ve döndürme, telefonla çekilmiş gibi
    pil = pil.rotate(1.8, expand=True, fillcolor=(90, 80, 70))
    w2, h2 = pil.size
    coeffs = (1, 0.03, -10, 0.01, 1, -5, 0.00002, 0.00003)
    pil = pil.transform((w2, h2), Image.PERSPECTIVE, coeffs, Image.BICUBIC, fillcolor=(90, 80, 70))
    pil.save(f'{OUT}/{name}_kabartma.jpg', quality=85)
json.dump(gt, open(f'{OUT}/gt_tr.json', 'w'), ensure_ascii=False, indent=1)
for k, v in gt.items(): print(k, [len(r) for r in v['braille']])

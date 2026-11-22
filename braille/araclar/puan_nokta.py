import json, sys, re, unicodedata, louis
res = json.load(open(sys.argv[1])); gt_tr = json.load(open(sys.argv[2])); gt_real = json.load(open(sys.argv[3]))
def lev(a, b):
    p = list(range(len(b) + 1))
    for i in range(1, len(a) + 1):
        c = [i] + [0] * len(b)
        for j in range(1, len(b) + 1): c[j] = min(p[j] + 1, c[j-1] + 1, p[j-1] + (a[i-1] != b[j-1]))
        p = c
    return p[-1]
cells = lambda s: [c for c in s if 0x2801 <= ord(c) <= 0x283F]
def norm(s): s = unicodedata.normalize('NFC', s).lower().replace('i̇', 'i'); return re.sub(r'\s+', ' ', re.sub(r'[^\w\s]', '', s)).strip()
for f, lines in res.items():
    if f.startswith('tr_'):
        page = '_'.join(f.split('_')[:2]); g = cells(''.join(gt_tr[page]['braille'])); p = cells(''.join(lines))
        text = norm(' '.join(louis.backTranslateString(['unicode.dis', 'tr-g1.ctb'], l.replace(' ', '⠀')) for l in lines))
        truth = norm(' '.join(gt_tr[page]['text']))
        print(f'{f:28} hücre %{100*max(0,1-lev(p,g)/len(g)):5.1f}  Türkçe metin %{100*max(0,1-lev(text,truth)/len(truth)):5.1f} | {text[:60]}')
    elif f in gt_real:
        g = cells(''.join(gt_real[f])); p = cells(''.join(lines))
        print(f'{f[:28]:28} hücre %{100*max(0,1-lev(p,g)/len(g)):5.1f}  ({len(p)}/{len(g)} hücre)')

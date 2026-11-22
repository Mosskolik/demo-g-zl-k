# Türkçe Braille sonuçlarını puanlar: doğrudan metin ve (hücre → liblouis) yolu
import json, sys, louis, unicodedata, re
gt = json.load(open(sys.argv[1])); res = json.load(open(sys.argv[2]))
def norm(s): s = unicodedata.normalize('NFC', s).lower().replace('i̇', 'i'); return re.sub(r'\s+', ' ', re.sub(r'[^\w\s]', '', s)).strip()
def lev(a, b):
    p = list(range(len(b) + 1))
    for i in range(1, len(a) + 1):
        c = [i] + [0] * len(b)
        for j in range(1, len(b) + 1): c[j] = min(p[j] + 1, c[j-1] + 1, p[j-1] + (a[i-1] != b[j-1]))
        p = c
    return p[-1]
rows = {}
for key, v in res.items():
    m, f, pk = key.split('|'); page = f.split('_')[0] + '_' + f.split('_')[1]; kind = 'kabartma' if 'kabartma' in f else 'mürekkep'
    if v.get('status') != 200: continue
    truth = norm(' '.join(gt[page]['text']))
    if pk == 'dogrudan':
        pred = norm(v['text'] or '')
    else:
        lines = [l for l in (v['text'] or '').splitlines() if any(0x2800 <= ord(c) <= 0x283F for c in l)]
        pred = norm(' '.join(louis.backTranslateString(['unicode.dis', 'tr-g1.ctb'], l.replace(' ', '⠀')) for l in lines))
    acc = max(0, 1 - lev(pred, truth) / max(1, len(truth)))
    rows.setdefault((m, pk, kind), []).append(acc)
    print(f'{m[:34]:34} {pk:9} {kind:9} {page}: %{100*acc:5.1f}  | {pred[:70]}')
print('\n=== ÖZET: Türkçe metin doğruluğu (1 - karakter hata oranı) ===')
for (m, pk, kind), a in sorted(rows.items()):
    print(f'{m[:40]:40} {"doğrudan" if pk=="dogrudan" else "hücre+liblouis":15} {kind:9} ortalama %{100*sum(a)/len(a):5.1f} ({len(a)} sayfa)')

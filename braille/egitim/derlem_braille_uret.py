"""derlem.txt'teki her sözcüğün tr-g1 ve tr-g2 Braille karşılığını derlem_braille.json'a yazar (liblouis olmayan ortamlar için, ör. Kaggle)."""
import json, os, louis
HERE = os.path.dirname(os.path.abspath(__file__))
words = sorted({w for line in open(os.path.join(HERE, 'derlem.txt'), encoding='utf-8') for w in line.split()})
out = {}
for w in words:
    try:
        out[w] = [louis.translateString(['unicode.dis', t], w) for t in ('tr-g1.ctb', 'tr-g2.ctb')]
    except Exception:
        pass
for n in range(0, 1000):
    out[str(n)] = [louis.translateString(['unicode.dis', t], str(n)) for t in ('tr-g1.ctb', 'tr-g2.ctb')]
json.dump(out, open(os.path.join(HERE, 'derlem_braille.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print(len(out))

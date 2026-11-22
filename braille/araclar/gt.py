# Gerçek fotoğrafların işaretlemelerinden satır satır Braille (Unicode) cevap anahtarı üretir
import json, glob, os, statistics, sys
K = sys.argv[1]
out = {}
def lines_from_boxes(boxes):  # boxes: (l,t,r,b,code)
    if not boxes: return []
    h = statistics.median([b[3]-b[1] for b in boxes]); w = statistics.median([b[2]-b[0] for b in boxes])
    boxes = sorted(boxes, key=lambda b: (b[1]+b[3])/2)
    rows, cur = [], [boxes[0]]
    for b in boxes[1:]:
        if abs((b[1]+b[3])/2 - statistics.mean([(c[1]+c[3])/2 for c in cur])) < 0.5*h: cur.append(b)
        else: rows.append(cur); cur = [b]
    rows.append(cur)
    lines = []
    for r in rows:
        r = sorted(r, key=lambda b: b[0]); s = ''
        for i, b in enumerate(r):
            if i and b[0] - r[i-1][2] > 0.9*w: s += ' '
            s += chr(0x2800 + b[4])
        lines.append(s)
    return lines
for f in sorted(glob.glob(os.path.join(K, '*.labeled.csv'))):
    boxes = []
    for ln in open(f):
        p = ln.strip().split(';')
        if len(p) == 5: boxes.append(tuple(map(float, p[:4])) + (int(p[4]),))
    out[os.path.basename(f).replace('.csv', '.jpg')] = lines_from_boxes(boxes)
for f in sorted(glob.glob(os.path.join(K, 'bl_*.json'))):
    j = json.load(open(f)); boxes = []
    for sh in j['shapes']:
        (x1, y1), (x2, y2) = sh['points'][0], sh['points'][1]
        lab = str(sh['label']).strip(); code = 0
        if lab != '0':
            for ch in lab:
                if ch.isdigit() and 1 <= int(ch) <= 6: code |= 1 << (int(ch)-1)
        boxes.append((min(x1,x2), min(y1,y2), max(x1,x2), max(y1,y2), code))
    out[os.path.basename(f).replace('.json', '.jpeg')] = lines_from_boxes(boxes)
json.dump(out, open(os.path.join(K, 'gt.json'), 'w'), ensure_ascii=False, indent=1)
for k, v in out.items(): print(k, len(v), 'satır |', v[0][:40] if v else '')

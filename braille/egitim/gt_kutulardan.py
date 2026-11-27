"""
Hücre kutusu etiketli gerçek fotoğraflar için uctan_uca.py'nin beklediği satır GT'sini üretir.
Kutular kusursuz hücre olarak çözücüye verilir; çıkan satırlar GT olur.
  python gt_kutulardan.py <liste.txt> <cikti_gt.json> <kopya_klasoru>
liste.txt: her satırda bir görüntü yolu (Angelina .labeled.jpg ya da LabelMe .json'lu görüntü).
Görüntüler kopya_klasoru'ne düz adla kopyalanır (uctan_uca --gercek <kopya_klasoru> --gt <cikti_gt.json>).
"""
import json, os, shutil, sys
import numpy as np
from degerlendir import kutular
from cozucu import hucre_satirlari

liste, cikti, klasor = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(klasor, exist_ok=True)
gt = {}
for p in open(liste):
    p = p.strip()
    if not p: continue
    bx = kutular(p)
    if len(bx) < 5: continue
    hc = np.array([[(x1 + x2) / 2, (y1 + y2) / 2, 1] + [1.0 if n in ns else 0.0 for n in range(1, 7)] for x1, y1, x2, y2, ns in bx])
    ad = p.replace('/', '__')[-120:]
    shutil.copy(p, os.path.join(klasor, ad))
    gt[ad] = hucre_satirlari(hc)
json.dump(gt, open(cikti, 'w'), ensure_ascii=False)
print(len(gt), 'görüntü,', sum(len(''.join(v).replace('⠀', '')) for v in gt.values()), 'hücre')

"""
Kabartma Braille hücre bulucu — küçük U-Net (kendi kodumuz, lisans sorunu yok).
Girdi: gri tonlu görüntü (1 kanal, 0..1).
Çıktı (8 kanal, aynı boyut, logit):
  0: nokta ısı haritası (her kabarık noktanın merkezi)
  1: hücre ısı haritası (her dolu Braille hücresinin merkezi)
  2..7: hücre merkezinde okunur — 1..6 numaralı noktalar kabarık mı?
Hücreler birbirinden belirgin aralıklı olduğu için satırlara dizmek, tek tek noktaları ızgaraya oturtmaktan çok daha sağlamdır.
"""
import cv2
import torch
import torch.nn as nn
import torch.nn.functional as F

KANAL = 8


def block(cin, cout):
    return nn.Sequential(
        nn.Conv2d(cin, cout, 3, padding=1, bias=False), nn.BatchNorm2d(cout), nn.ReLU(inplace=True),
        nn.Conv2d(cout, cout, 3, padding=1, bias=False), nn.BatchNorm2d(cout), nn.ReLU(inplace=True),
    )


class NoktaAgi(nn.Module):
    def __init__(self, ch=(16, 32, 64, 96, 128), cikis=KANAL):
        super().__init__()
        self.enc = nn.ModuleList()
        cin = 1
        for c in ch:
            self.enc.append(block(cin, c)); cin = c
        self.dec = nn.ModuleList()
        for c in reversed(ch[:-1]):
            self.dec.append(block(cin + c, c)); cin = c
        self.head = nn.Conv2d(cin, cikis, 1)
        with torch.no_grad():
            self.head.bias.zero_(); self.head.bias[:min(2, cikis)] = -4.0  # başta "nokta/hücre yok"

    def forward(self, x):
        skips = []
        for i, b in enumerate(self.enc):
            x = b(x)
            if i < len(self.enc) - 1:
                skips.append(x); x = F.max_pool2d(x, 2)
        for b in self.dec:
            s = skips.pop()
            x = F.interpolate(x, size=s.shape[-2:], mode='bilinear', align_corners=False)
            x = b(torch.cat([x, s], 1))
        return self.head(x)


def yukle(yol):
    """Kayıtlı ağırlıktan doğru biçimde model kurar (eski 1 kanallı nokta modeli de açılır)."""
    sd = torch.load(yol, map_location='cpu')
    seviye = sum(1 for k in sd if k.startswith('enc.') and k.endswith('.0.weight'))
    ch = tuple(sd[f'enc.{i}.0.weight'].shape[0] for i in range(seviye))
    m = NoktaAgi(ch, sd['head.weight'].shape[0]); m.load_state_dict(sd); m.eval()
    return m


def odak_kaybi(logit, hedef, alpha=2, beta=4):
    """CenterNet odak kaybı: hedef = merkezlerde 1 olan Gauss tepeli harita."""
    p = torch.sigmoid(logit).clamp(1e-4, 1 - 1e-4)
    pos = hedef.eq(1).float(); neg = 1 - pos
    pos_loss = -torch.log(p) * (1 - p) ** alpha * pos
    neg_loss = -torch.log(1 - p) * p ** alpha * (1 - hedef) ** beta * neg
    n = pos.sum().clamp(min=1)
    return (pos_loss.sum() + neg_loss.sum()) / n


def toplam_kayip(cikti, nokta_h, hucre_h, bit_h, bit_maske):
    k_nokta = odak_kaybi(cikti[:, 0:1], nokta_h)
    k_hucre = odak_kaybi(cikti[:, 1:2], hucre_h)
    bce = F.binary_cross_entropy_with_logits(cikti[:, 2:8], bit_h, reduction='none')
    k_bit = (bce * bit_maske).sum() / (bit_maske.sum() * 6).clamp(min=1)
    return k_nokta + k_hucre + 4 * k_bit, (k_nokta.item(), k_hucre.item(), k_bit.item())


def tepeler(logit, esik=0.3, pencere=5, kanal=0):
    """Isı haritasından merkezler (x, y, güven). logit: 1×C×H×W."""
    p = torch.sigmoid(logit[:, kanal:kanal + 1])
    mx = F.max_pool2d(p, pencere, 1, pencere // 2)
    m = (p == mx) & (p > esik)
    ys, xs = torch.nonzero(m[0, 0], as_tuple=True)
    return torch.stack([xs.float(), ys.float(), p[0, 0, ys, xs]], 1)


def hucreler(logit, esik=0.3, pencere=7):
    """Hücre merkezleri + 6 nokta olasılığı: N×(x, y, güven, p1..p6)."""
    t = tepeler(logit, esik, pencere, kanal=1)
    if len(t) == 0: return torch.zeros((0, 9))
    xs, ys = t[:, 0].long(), t[:, 1].long()
    bit = torch.sigmoid(logit[0, 2:8, ys, xs]).T
    return torch.cat([t, bit], 1)


def on_isle(gri):
    """Girdi ön işleme (eğitimde ve okumada aynı): yerel kontrast eşitleme (CLAHE). Soluk fotoğraflarda noktaları belirginleştirir."""
    return cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8)).apply(gri)

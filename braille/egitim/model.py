"""
Kabartma Braille nokta bulucu — küçük U-Net (kendi kodumuz, lisans sorunu yok).
Girdi: gri tonlu görüntü (1 kanal, 0..1). Çıktı: aynı boyutta ısı haritası (logit);
her ön yüz kabartma noktasının merkezinde tepe yapar. Hücreler bu noktalardan ızgaraya oturtularak çıkarılır.
"""
import torch
import torch.nn as nn
import torch.nn.functional as F


def block(cin, cout):
    return nn.Sequential(
        nn.Conv2d(cin, cout, 3, padding=1, bias=False), nn.BatchNorm2d(cout), nn.ReLU(inplace=True),
        nn.Conv2d(cout, cout, 3, padding=1, bias=False), nn.BatchNorm2d(cout), nn.ReLU(inplace=True),
    )


class NoktaAgi(nn.Module):
    def __init__(self, ch=(16, 32, 64, 96)):
        super().__init__()
        self.enc = nn.ModuleList()
        cin = 1
        for c in ch:
            self.enc.append(block(cin, c)); cin = c
        self.dec = nn.ModuleList()
        for c_skip, c_out in zip(reversed(ch[:-1]), reversed(ch[:-1])):
            self.dec.append(block(cin + c_skip, c_out)); cin = c_out
        self.head = nn.Conv2d(cin, 1, 1)
        nn.init.constant_(self.head.bias, -4.0)  # başta "nokta yok" (dengesiz sınıf)

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


def odak_kaybi(logit, hedef, alpha=2, beta=4):
    """CenterNet odak kaybı: hedef = noktalarda 1 olan Gauss tepeli harita."""
    p = torch.sigmoid(logit).clamp(1e-4, 1 - 1e-4)
    pos = hedef.eq(1).float(); neg = 1 - pos
    pos_loss = -torch.log(p) * (1 - p) ** alpha * pos
    neg_loss = -torch.log(1 - p) * p ** alpha * (1 - hedef) ** beta * neg
    n = pos.sum().clamp(min=1)
    return (pos_loss.sum() + neg_loss.sum()) / n


def tepeler(logit, esik=0.3, pencere=5):
    """Isı haritasından nokta merkezleri (x, y, güven)."""
    p = torch.sigmoid(logit)
    mx = F.max_pool2d(p, pencere, 1, pencere // 2)
    m = (p == mx) & (p > esik)
    ys, xs = torch.nonzero(m[0, 0], as_tuple=True)
    return torch.stack([xs.float(), ys.float(), p[0, 0, ys, xs]], 1)

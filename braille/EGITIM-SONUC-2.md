# Braille okuma modeli — 2. Kaggle eğitimi sonuçları

*22 Kasım 2026 (20:30–22:58 TR). Sonuç: 2. eğitim 1.'den **kötü** çıktı; uygulamada kullanılacak model **1. eğitimin modeli** olarak kalıyor.*

## Ne denendi
- Sentetik sayfaların ~%22'sine flaş / önden ışık görünümü eklendi (parlak tepe, ince koyu kenar).
- Model 1. eğitimin ağırlıklarından başlayıp 20 tur daha eğitildi (24.000 yeni sayfa).
- Ölçek, etikete bakılmadan otomatik seçildi: önce hücre aralığı ölçülüp görüntü ~34 piksellik hücre aralığına ölçeklendi.

## Karşılaştırma (uçtan uca hücre doğruluğu)

| Test | 1. eğitim | 2. eğitim |
|---|---|---|
| 13 gerçek fotoğraf, otomatik ölçek | **%87,7** | %81,9 |
| 13 gerçek fotoğraf, en iyi ölçek (iyimser) | **%87,4** | %82,9 |
| BrailleLens parlak ışık (4 sayfa) | %74,9 | %55–66 |
| BrailleLens loş ışık (4 sayfa) | **%93,6** | %86–95 |
| Angelina (5 sayfa) | **%91,4** | benzer (%66–99) |
| Sentetik Türkçe (100 sayfa, sabit ölçek) | %89,1 | %87,0 (test seti daha zor) |

## Neden kötüleşti, ne öğrendik
- Eğitim kaybı 1. eğitimin sonundaki 0,59'dan 0,92'ye çıktı: yeni sentetik görünümlerin bir kısmı (çok soluk flaş sayfaları) gerçek fotoğraflara benzemiyor, model bunlara uyum sağlamaya çalışırken gerçek fotoğraflarda geriledi.
- 1. modelle parlak ışıklı bir sayfada yapılan inceleme asıl sorunun ışık değil, **hücrelerin kaçırılması** olduğunu gösterdi: 168 hücrenin 122'si bulundu (%73), bulunan hücrelerin %95'inin noktaları doğru okundu. Kaçan hücreler satırları parçalara bölüyor.

## Sonraki adımlar
1. **Satır parçalarını birleştirme** (çözücüde): aynı hizadaki satır parçaları tek satırda toplanacak. Eğitim gerektirmez.
2. **Hücre kaçırma:** Arka yüz çukurlarının ve satır arası noktaların modeli şaşırttığı sayfalara odaklanılacak; sentetik veride bu durum gerçek fotoğraflara göre ayarlanacak.
3. Gerçek Türkçe Braille fotoğrafları (30–50 sayfa) hâlâ en önemli eksik.

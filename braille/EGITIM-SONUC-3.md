# Braille okuma modeli — 3. Kaggle eğitimi sonuçları

*27 Kasım 2026 (18:54–21:27 TR). Sonuç: 3. eğitim de 1.'den **kötü**; uygulamada kullanılacak model **1. eğitimin modeli** olarak kalıyor.*

## Ne denendi
- Çift taraflı baskı: arka yüz satırı ön yüz satırına her uzaklıkta (0,15–0,85 satır aralığı), daha derin ve daha sık çukurlar (sayfaların %70'i).
- Flaş görünümü %22'den %15'e indirildi; flaş sayfalarında soluk nokta ve aşırı pozlama kapatıldı.
- 1. modelden başlayıp 20 tur eğitim.

## Sonuç (13 gerçek fotoğraf, ölçek otomatik, satır birleştirmeli çözücü)

| Model | Toplam | Parlak ışık (BL) | Loş ışık (BL) | Angelina |
|---|---|---|---|---|
| **1. eğitim** | **%88,4** | %68–88 | %89–98 | %66–99 |
| 2. eğitim | %81,9 | %55–66 | %86–95 | — |
| 3. eğitim | %81,2 | %56–65 | %86–91 | %71–98 |

## Yorum
- 2. ve 3. eğitimin ortak noktası **flaş benzetimi**. İkisi de en çok parlak ışıklı gerçek sayfalarda geriledi. Flaş benzetimi gerçek görünümü yakalamıyor ve modeli bozuyor olabilir.
- **4. eğitim (deney):** Flaş tamamen kapalı, çift taraflı baskı değişikliği açık. Hangi değişikliğin zarar verdiğini ayırmak için yapılıyor.
- Sentetik veriyle yapılan ayarların sınırına geliyoruz. Kalıcı çözüm, **gerçek fotoğraflarla eğitim**: Angelina veri setinin izni ya da gerçek Türkçe Braille fotoğrafları.

## 4. eğitim (deney): flaş kapalı, çift taraflı baskı açık

*27 Kasım 2026, 21:34–00:10 TR.*

| Model | 13 gerçek fotoğraf (otomatik ölçek) | Sentetik Türkçe |
|---|---|---|
| **1. eğitim** | **%88,4** | %89,1 |
| 3. eğitim (flaş %15 + çift taraflı) | %81,2 | %84,7 |
| 4. eğitim (sadece çift taraflı) | %86,2 | %86,5 |
| 1. + 4. modelin ortalaması | %87,7 | — |

**Sonuç:**
- Flaş benzetimi zararlıydı: kapatınca gerçek fotoğraflarda doğruluk %81,2'den %86,2'ye çıktı.
- Çift taraflı baskı değişikliği tek başına bir fayda sağlamadı (%86,2 < %88,4). Kaçırılan hücreler azalmadı.
- İki modelin ortalaması da 1. modeli geçemedi.
- **Uygulamada kullanılacak model: 1. eğitimin modeli + satır birleştirmeli çözücü (%88,4).**
- Sentetik veriyle yapılan ayarlar 1. modelin seviyesinde tıkandı. Sonraki gerçek ilerleme için **gerçek fotoğraflarla eğitim** gerekiyor.

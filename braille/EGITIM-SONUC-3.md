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

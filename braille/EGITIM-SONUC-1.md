# Braille okuma modeli — 1. Kaggle eğitimi sonuçları

*22 Kasım 2026. Uygulamada henüz değişiklik yok; Braille özelliği onay bekliyor.*

## Ne eğitildi
- **Veri:** 24.000 sentetik Türkçe kabartma Braille sayfası (`egitim/uretici.py`): liblouis Türkçe tabloları (tr-g1, tr-g2), değişken ışık, gölge, eğiklik, bulanıklık, arka yüz çukurları, soluk noktalar. **Gerçek fotoğrafla eğitim yapılmadı.**
- **Donanım:** Kaggle, ücretsiz Tesla T4 GPU. Sayfa üretimi 21 dk, eğitim 30 tur (~3,3 saat).
- **İki yöntem karşılaştırıldı:**
  1. *Nokta modeli:* tek tek noktaları bulur (0,39 M parametre).
  2. *Hücre modeli:* hücre merkezini ve hücredeki 6 noktanın hangilerinin kabarık olduğunu birlikte bulur (0,92 M parametre). Hücreler satır zinciriyle birleştirilir (`egitim/cozucu.py`).

## Sonuçlar — uçtan uca okuma (hücre yerleri modele verilmeden)

Ölçü: hücre doğruluğu = 1 − düzenleme uzaklığı / gerçek hücre sayısı.
**Not:** Gerçek fotoğraflarda görüntü ölçeği 4 seçenek arasından en iyi sonucu veren seçildi (iyimser). Uygulamada ölçek, modelin kendi güvenine göre otomatik seçilecek; bu ayrıca ölçülecek.

| Test | Sayfa | Hücre | **Hücre modeli** |
|---|---|---|---|
| Sentetik Türkçe sayfalar (eğitimde görülmemiş) | 100 | 16.486 | **%89,1** (medyan sayfa %96) |
| Gerçek fotoğraflar — Angelina (Rusça, sadece ölçüm) | 5 | 1.508 | **%91,4** — 3 sayfada %98,4–98,9 |
| Gerçek fotoğraflar — BrailleLens zayıf ışık | 4 | 960 | **%93,6** |
| Gerçek fotoğraflar — BrailleLens iyi ışık | 4 | 972 | %74,9 |
| **Tüm gerçek fotoğraflar** | **13** | **3.440** | **%87,4** |

Karşılaştırma (Aşama 0, aynı gerçek fotoğraflar): genel yapay zekâ modelleri %1–21, klasik görüntü işleme ~%5.

Nokta modeli, hücre yerleri hazır verildiğinde bile %81 hücre doğruluğunda kaldı. Bu yüzden **hücre modeliyle devam ediliyor.**

## Zayıf noktalar ve sonraki adımlar (%99 hedefi)
1. **BrailleLens "iyi ışık" sayfaları** (%58–82): yakından ve parlak ışıkta çekilmiş, noktalar büyük ve gölgeler zayıf. Sentetik veriye bu çekim türü eklenecek.
2. **Gerçek Türkçe fotoğraf yok.** %99'u ölçebilmek için 30–50 sayfa gerçek Türkçe Braille fotoğrafı gerekiyor.
3. **Türkçe sözlükle düzeltme:** Modelin her nokta için verdiği güven ile en olası Türkçe sözcük seçilecek.
4. **Emin olmadığında söylemek:** Güveni düşük hücreler işaretlenip kullanıcıdan yeniden çekim istenecek.
5. **Braille matematik gösterimi** (MEB kılavuzu) hâlâ eksik.

Model dosyası: Kaggle not defteri `orbital-braille-hucre` çıktısı (`hucre_modeli.pt`, 3,7 MB).

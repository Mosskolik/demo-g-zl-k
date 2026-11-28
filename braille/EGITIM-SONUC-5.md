# Braille okuma modeli — 5. eğitim: ilk kez gerçek fotoğraflarla

*27–28 Kasım 2026, 00:45–04:53 TR. Sonuç: **büyük ilerleme. 5. model yeni ana model.***

## Ne değişti
- Eğitime ilk kez **gerçek kabartma Braille fotoğrafları** girdi:
  - Angelina Braille Images Dataset: sadece veri setinin kendi **eğitim** listesi (books/train, handwritten/train), 191 fotoğraf. Kaynak deposunda lisans dosyası yok; izin isteği 22 Kasım'da gönderildi, henüz cevap yok. Takımın kararıyla kullanıldı; fotoğraflar Kaggle'da gizli tutuluyor, paylaşılmıyor. Yazar itiraz ederse bu veri çıkarılıp model yeniden eğitilecek.
  - BrailleLens 1–8. sayfalar (iyi ve zayıf ışık, 16 fotoğraf), CC-BY-4.0.
- Her turda örneklerin %30'u gerçek fotoğraf, %70'i sentetik Türkçe sayfa.
- BrailleLens'te her hücre etiketli olmadığı için kayıp sadece etiketli bölgelerde hesaplandı.
- Başlangıç: 1. model. 20 tur, öğrenme hızı 1e-3. Flaş benzetimi kapalı.
- Test fotoğrafları eğitimde **hiç kullanılmadı**: Angelina'nın doğrulama/test listeleri (99 fotoğraf) ve BrailleLens 9–12. sayfalar.

## Sonuçlar (uçtan uca hücre doğruluğu, ölçek otomatik)

| Test seti | 1. model | **5. model** |
|---|---|---|
| 13 gerçek fotoğraf (önceki test seti) | %88,4 | **%92,6** |
| ↳ BrailleLens iyi ışık (4) | %68–88 | **%83–96** |
| ↳ BrailleLens zayıf ışık (4) | %89–98 | **%91–97** |
| Angelina doğrulama + test (99 fotoğraf, 27.712 hücre) | %92,9 | **%95,8** |
| ↳ %99 ve üstü okunan sayfa | 22 / 99 | **54 / 99** |
| ↳ ortanca sayfa | %97,6 | **%99,2** |
| Sentetik Türkçe (100 sayfa) | %89,1 | %86,0 |

- 99 Angelina sayfasının 65'inde 5. model daha iyi, 11'inde daha kötü.
- Otomatik ölçek hedefi 34 pikselden 30 piksele indirildi; iki test setinde de daha iyi.
- Sentetik Türkçe sayfalarda hafif düşüş var. Gerçek fotoğraflara uyum, sentetik görünümden biraz uzaklaştırdı; asıl hedef gerçek fotoğraflar olduğu için kabul edilebilir.

## Karar ve sonraki adım
- **Ana model: 5. model.** Model dosyası Kaggle not defterinin 6. sürüm çıktısında (`hucre_modeli.pt`, 3,7 MB). Angelina verisiyle eğitildiği için depoya konmadı.
- **6. eğitim başlatıldı (05:11 TR):** 5. modelden devam, gerçek fotoğraf oranı %50, 12.000 sentetik sayfa, öğrenme hızı 5e-4. Gerekçe: en büyük kazanç gerçek fotoğraflardan geldi; payını artırmak mantıklı sonraki adım.

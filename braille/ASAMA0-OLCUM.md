# Braille (noktalı alfabe) okuma — Aşama 0 ölçüm sonuçları

*22 Kasım 2026. Amaç: Uygulamanın Braille ile yazılmış kaynakları fotoğraftan okuyup okuyamayacağını, hangi yöntemle okuyabileceğini ölçmek. Uygulamada hiçbir değişiklik yapılmadı.*

## Kısa sonuç

| Yöntem | Mürekkep baskı Braille (Türkçe, sentetik) | Kabartma Braille (Türkçe, sentetik) | Gerçek kabartma fotoğraflar |
|---|---|---|---|
| Genel yapay zekâ modelleri (Gemini, Groq, OpenRouter) — doğrudan okuma | %0–14 | %0–2 | — |
| Genel modeller — önce hücre, sonra liblouis ile Türkçeye çevirme | %0–21 | %10–24 | hücrelerin %1–21'i (ortalama) |
| Klasik görüntü işleme (bizim prototip) + liblouis | **%82–94** | %72–78 (3 sayfanın 2'si), 1 sayfada başarısız | ~%5 |
| Braille'e özel eğitilmiş model (BrailleQwen-2B, sadece İngilizce) — satır satır | — | — | **satır ortalaması %26–69**; bazı satırlar kusursuz |

**Yorum:**
1. Bugün uygulamada kullandığımız genel yapay zekâ modelleri **Braille okuyamıyor**. Gerçek fotoğraflarda olmayan yüzlerce hücre uyduruyorlar. Bu yolla Braille desteği verilemez.
2. **Mürekkeple basılmış** (gören biri için noktaları siyah basılmış) Braille, basit görüntü işleme + liblouis'in Türkçe tablosuyla şimdiden %82–94 doğrulukla okunuyor.
3. **Kabartma** Braille'in gerçek fotoğraflarını okumak için Braille'e özel **eğitilmiş bir nokta/hücre bulucu model** gerekiyor. Bunun mümkün olduğunu iki kanıt gösteriyor: sentetik kabartma görüntülerle eğitilmiş BrailleQwen gerçek fotoğraflarda bazı satırları kusursuz okudu; Angelina Braille Reader yıllardır gerçek fotoğrafları okuyor (ama Türkçe yok, lisansı belirsiz ve modeli artık indirilemiyor).
4. **Türkçe Braille matematik gösterimi** liblouis'te yok: "=" ve "+" geri çevrilirken bozuluyor, "√" tanınmıyor. MEB'in Braille Matematik Kılavuzu internette açık değil; bu kurallar ayrıca eklenmeli.

## Kullanılan kaynaklar

- **Gerçek kabartma fotoğraflar (13 sayfa, 3.200+ işaretli hücre):**
  - [Angelina Braille Images Dataset](https://github.com/IlyaOvodov/AngelinaDataset): 5 sayfa, Rusça; lisans dosyası yok, sadece ölçüm için kullanıldı, depoya eklenmedi.
  - [BrailleLens Annotated Braille Page Dataset](https://huggingface.co/datasets/BrailleLens/Annotated_braille_page_dataset): 8 sayfa, iyi ve zayıf ışıkta, İngilizce; CC-BY-4.0.
- **Türkçe test sayfaları:** Matematik soruları [liblouis](https://liblouis.io) `tr-g1.ctb` (kısaltmasız Türkçe Braille) ile Braille'e çevrildi. Mürekkep baskı ve kabartma benzetimi olarak çizildi (yükseklik haritası, yukarıdan ışık, kâğıt dokusu, eğik çekim). Örnekler `braille/ornek/` klasöründe.
- **Braille'e özel model:** [ai4bharat/BrailleQwen-2B](https://huggingface.co/ai4bharat/BrailleQwen-2B), Apache-2.0, sadece İngilizce (UEB). Bu sunucuda CPU ile çalıştırıldı.

## Ayrıntılı sonuçlar

**Genel modeller, gerçek fotoğraflarda hücre doğruluğu:**
gemini-3.5-flash %21 (5 sayfa) · gemini-3.6-flash %10 · groq qwen3.8 %10 · gemini-3.1-flash-lite %7 · openrouter nemotron %7 · gemini-3.5-flash-lite %1.
Sadece bir sayfada (kısa satırlı, büyük hücreli) %65–80'e çıkıldı. Diğer sayfalarda model 2.000'e varan uydurma hücre yazdı.

**Klasik prototip** (`braille/araclar/nokta.py`): Kabartmada nokta üstte parlak, altta gölgeli görünür. Prototip bu deseni bulup sayfanın eğikliğini düzeltiyor, noktaları 2×3 hücre ızgarasına oturtuyor. Mürekkep baskıda çok iyi çalışıyor. Gerçek fotoğraflarda kâğıt dokusu, arka yüzün noktaları ve düzensiz ışık yüzünden başarısız.

**BrailleQwen-2B (satır satır):** "everyone in the jungle", "darkness", "declared the king", "12" gibi satırları kusursuz okudu. Bazı satırlarda ise kelime uydurdu. Tam sayfada tekrar döngüsüne giriyor; bu, modelin belgesinde bilinen bir zayıflık olarak belirtilmiş.

## Önerilen yol (onay bekliyor)

1. **Mürekkep baskı Braille + Braille dosyası desteği (kısa, güvenilir):** Klasik okuyucu + liblouis Türkçe tablosu uygulamaya eklenir. Hedef doğruluk %95+. Kabartma için ışık yönlendirmesi de eklenir.
2. **Türkçe Braille matematik gösterimi:** MEB'in Braille Matematik Öğretmen Kılavuzu (1.–8. sınıf) edinilip kurallar okuyucuya eklenir. Bu olmadan kesir, üs ve kök okunamaz.
3. **Kabartma fotoğraflar için kendi modelimiz (uzun):** BrailleQwen'in yöntemiyle Türkçe sentetik kabartma sayfalar üretilir (üretici hazır: `braille/araclar/uret_tr.py`). Bunlar ve açık lisanslı gerçek fotoğraflarla (BrailleLens CC-BY-4.0, izin alınırsa Angelina) küçük bir hücre bulucu model eğitilir. Eğitim için ücretsiz GPU kullanılabilir (Kaggle/Colab). Küçük model hem sunucuda hem telefonda (APK içinde) çalışabilir.
4. **Gerçek Türkçe kaynaktan doğrulama:** Bir görme engelliler okulundan ya da öğretmenden 10–20 sayfa gerçek Türkçe Braille matematik fotoğrafı alınmalı. Gerçek doğruluk ancak bunlarla ölçülebilir.

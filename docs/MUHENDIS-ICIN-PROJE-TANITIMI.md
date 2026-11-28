# Sesli Matematik Asistanı — Mühendis için proje tanıtımı

Merhaba,

Biz **Orbital** takımıyız. TEKNOFEST "İnsanlık Yararına Teknoloji" yarışması (lise kategorisi) için **görme engelli lise öğrencilerine yönelik, tamamen sesle kullanılan, ücretsiz bir matematik asistanı** geliştiriyoruz. Aşağıda projenin ne yaptığını, nasıl çalıştığını, hangi teknolojileri kullandığını ve sizin görüşünüzü almak istediğimiz konuları anlattım. Kodun tamamı ekteki zip dosyasında.

---

## 1. Ne yapıyor?

Öğrenci kitabın ya da test kitabının fotoğrafını çekiyor. Asistan:

1. **Sayfayı Türkçe matematik okunuşuyla sesli okuyor.** Örneğin "x kare", "dörtte üç", "karekök içinde x artı bir, kök bitti" gibi. Okunuşta belirsizlik kalmasın diye sınır sözcükleri kullanılıyor.
2. **Sayfanın türünü ayırt ediyor:**
   - **Konu anlatımı sayfası:** konuyu adım adım anlatıyor, ara ara "devam edeyim mi?" diye soruyor.
   - **Soru sayfası:** soruyu **çözüm yolu ya da ipucu vermeden** açıklıyor. Önce genel yapıyı, sonra verilenleri ve isteneni söylüyor; öğrencinin soruyu zihninde canlandırmasını sağlıyor.
3. **Öğrencinin söylediği cevabı kontrol ediyor.** Doğruysa tebrik ediyor; yanlışsa cevabı söylemeden yeniden düşünmeye yönlendiriyor.
4. Öğrenci "çözemedim" derse soruyu **adım adım çözüyor**.
5. **Kesik fotoğrafı** algılıyor ("telefonu biraz sağa kaydır"). Yarım görünen soruyu okumuyor.
6. Her şey **sesle** yönetiliyor. Yaklaşık 30 sesli komut var: "çek", "tekrar et", "şıkları oku", "C şıkkı neydi", "ne isteniyor", "yardım" vb. Ekrandaki butonlar sadece gören yardımcılar (öğretmen, aile) için.

Nihai hedefte görüntünün **Ray-Ban Meta Gen 2** gözlükten gelmesi planlanıyor. Prototipte telefon kamerası kullanılıyor.

---

## 2. Mimari (bugünkü hâli)

```
 Telefon
 ┌──────────────────────────────────────────────┐
 │ Android uygulaması (Java, WebView)           │
 │  └─ Web uygulaması (HTML/JS)                 │
 │      • kamera / galeri                       │
 │      • fotoğraf kalite kontrolü (karanlık,   │
 │        bulanık → sunucuya hiç gönderilmez)   │
 │      • sesli komutları anlama (commands.js)  │
 │      • ses: Android TextToSpeech (tr-TR)     │
 │      • konuşma tanıma: Android               │
 │        SpeechRecognizer (tr-TR)              │
 └───────────────┬──────────────────────────────┘
                 │ HTTPS (fotoğraf JPEG/base64 + mod + konuşma geçmişi)
                 ▼
 Cloudflare Worker (app.matematik-asistani.workers.dev)
   • sadece aktarıcı (reverse proxy). Bazı Türk mobil operatörleri
     *.vercel.app adresine bağlantıyı kestiği için var.
                 │
                 ▼
 Vercel sunucusuz fonksiyonu  /api/chat  (Node.js 20)
   • API anahtarları SADECE burada, Vercel ortam değişkenlerinde
   • öğretmen talimatları (prompts.js), mod seçimi
   • sağlayıcı zinciri: biri hata verirse / kotası dolarsa sıradaki
   • çıktı filtreleri (ipucu ve şık sızıntısı)
                 │
                 ▼
 Bulut yapay zekâ modelleri (ücretsiz katmanlar)
   Google Gemini (3.5 Flash, 3.1 Flash-Lite, 3.5 Flash-Lite, 3.6 Flash)
   → Groq → OpenRouter → Mistral → NVIDIA → Cloudflare Workers AI
```

- **Tarayıcıda veya APK'da hiçbir API anahtarı yok.** Anahtarlar `.env` dosyasında ya da Vercel ortam değişkenlerinde duruyor; `.env` git'e girmiyor.
- **Android uygulaması** web uygulamasını tam ekran WebView'da açıyor ve `window.MatematikAndroid` adlı bir JS köprüsü sağlıyor. `public/js/android-bridge.js`, tarayıcının `speechSynthesis` ve `SpeechRecognition` arayüzlerini bu köprü üzerinden taklit ediyor. Böylece aynı web kodu hem tarayıcıda hem Android'de değişmeden çalışıyor ve web'deki her güncelleme APK'ya anında yansıyor. APK yaklaşık 40 KB; Android 7 ve üstünde çalışıyor.

### İstek modları (`api/chat.js`)

| Mod | Ne yapar | Model ayarı |
|---|---|---|
| `read` | Fotoğrafı okur. Yapılandırılmış JSON döner: tür, kesik mi, kesik kenarlar, yön tarifi, metin, Türkçe okunuş, sorular ve şıklar. | Görüntü girişi, JSON şeması, doğrulama |
| `correct` | "Yanlış okudun, x küp olacak" gibi düzeltmeleri uygular | JSON |
| `explain` | Konu anlatımı | hızlı model |
| `question` | Soruyu ipucusuz açıklar | önce Gemini |
| `check` | Öğrencinin cevabını kontrol eder | düşünme modu açık |
| `solve` | Adım adım çözüm | düşünme modu açık |
| `free` | Serbest soru-cevap | hızlı model |

### Sağlayıcı katmanı (`lib/providers/`)
- `AIProvider` arayüzü: `gemini.js` (Google'ın kendi API'si), `openaiCompat.js` (OpenAI uyumlu API'ler: Groq, OpenRouter, Mistral, NVIDIA, Cloudflare), `ollama.js` (yerel model iskeleti), `mock.js` (anahtarsız deneme).
- `chain.js`: zincirdeki modelleri sırayla dener. Hata, kota (429) ya da geçersiz çıktıda sıradakine geçer.
- `race.js`: yavaş cevapta ikinci bir modeli paralel başlatır ("hedging") ve hangisi önce geçerli cevap verirse onu kullanır.
- Model sırası, gerçek kitap sayfalarıyla yaptığımız bir "yarış" testiyle belirlendi (`scripts/yaris.js`). Sonuçlar: Gemini 3.1 Flash-Lite ve 3.5 Flash %100, Groq / OpenRouter / 3.5 Flash-Lite %96, Cloudflare %82.

### Pedagojik güvenlik katmanı
Görme engelli öğrenci ekranı göremediği için modelin söylediği her şeyi dinliyor. Modelin "yanlışlıkla ipucu vermesi" bu yüzden ciddi bir sorun. İki sunucu filtresi var:
- **İpucu filtresi** (`stripHintSentences`): Çözüm yolu, işlem tarifi, formül adı ya da "cevap … olur" kalıbı içeren cümleleri öğrenciye okunmadan siler. Türkçe ekleri hesaba katan kelime sınırları kullanıyor.
- **Şık sızıntısı filtresi** (`stripOptionLeaks`): Soruda verilmeyen bir şık değeri açıklamada geçerse (rakamla ya da yazıyla, ör. "on üç") o cümleyi siler. `lib/turkceSayi.js` sayıları ve kesirleri Türkçe okunuşa çeviriyor ("altıda beş").
- Talimatlar (`lib/prompts.js`), görme engellilere sözlü matematik anlatımı üzerine yaptığımız literatür taramasına dayanıyor (`docs/arastirma/`). Örnekler: MEB okunuş biçimi, şekil ve grafik betimleme kuralları, Pólya tarzı yönlendirmeyen sorular.

### Ses arayüzü (`public/js/`)
- `speech.js`: Sürekli dinleme. Asistan susunca mikrofon kendiliğinden açılıyor, konuşurken kapanıyor.
- **Yankı koruması:** Mikrofon asistanın kendi sesini duyarsa o metin yok sayılıyor. Böylece "çözemedim" gibi kelimeler asistanın ağzından çıkıp yanlışlıkla çözüm başlatmıyor.
- `commands.js`: sesli komutları anlama (Türkçe varyantlarıyla). `app.js`: ana durum makinesi (sayfa yok → sayfa okundu → soru açık → cevap bekleniyor).
- `quality.js`: telefonda parlaklık ve bulanıklık kontrolü. Kötü fotoğraf sunucuya gitmiyor; bu ücretsiz kotayı da koruyor.

---

## 3. Braille (noktalı alfabe) modülü — geliştirme aşamasında

Öğrencilerin kaynaklarının bir kısmı **kabartma Braille**. Ölçtük: genel yapay zekâ modelleri (Gemini vb.) gerçek kabartma fotoğraflarında hücrelerin sadece %1–21'ini doğru okuyabiliyor ve olmayan hücreler uyduruyor. Bu yüzden **kendi küçük modelimizi** eğitiyoruz:

- **Sentetik veri** (`braille/egitim/uretici.py`): Türkçe metin liblouis'in Türkçe tablolarıyla (tr-g1/tr-g2) Braille'e çevriliyor. Ardından yükseklik haritası, ışık ve gölge, kâğıt dokusu, arka yüz çukurları, perspektif, bulanıklık ve JPEG bozulmalarıyla kabartma sayfa fotoğrafı benzetiliyor. Her noktanın ve hücrenin konumu etiket olarak kaydediliyor.
- **Model** (`model.py`): Kendi yazdığımız küçük bir U-Net (0,92 M parametre, ~3,7 MB). 8 kanallı çıktısı var: nokta ısı haritası, hücre merkezi ısı haritası ve hücre merkezinde 6 noktanın her biri için "kabarık mı" olasılığı (CenterNet tarzı odak kaybı + BCE).
- **Çözücü** (`cozucu.py`): Hücre merkezlerini sağdaki komşuya bağlayarak satır zincirleri kuruyor. Eğik ve perspektifli çekimde de çalışıyor. Hücre aralığından boşlukları çıkarıyor ve Unicode Braille satırları üretiyor. Bu satırlar liblouis ile Türkçe metne çevrilecek.
- **Eğitim:** Kaggle'ın ücretsiz T4 GPU'sunda; 24.000 sentetik sayfa, 30 tur, yaklaşık 3,5 saat.
- **Sonuç (gerçek fotoğrafla hiç eğitilmeden):** 13 gerçek kabartma fotoğrafta (Angelina ve BrailleLens veri setleri) uçtan uca hücre doğruluğu **%87,7**; bazı sayfalarda %98–99. Sentetik Türkçe sayfalarda %89. Asıl hata kaynağı, bazı sayfalarda hücrelerin kaçırılması; bulunan hücrelerin noktaları %95 doğru okunuyor. Ayrıntılar `braille/EGITIM-SONUC-1.md` ve `EGITIM-SONUC-2.md` dosyalarında.
- Hedefimiz %99. Eksiklerimiz: gerçek Türkçe Braille fotoğrafları ve Türkçe Braille matematik gösterimi (MEB kılavuzu).

---

## 4. Sizin görüşünüzü almak istediğimiz asıl konu: API anahtarlarına bağımlılık

Şu an sistem **bulut yapay zekâ servislerinin ücretsiz katmanlarına ve API anahtarlarına** bağlı. Anahtarlar güvenli tutuluyor (sadece sunucuda), ama biz **API anahtarı kullanmayan** bir çözüm istiyoruz. Gerekçelerimiz:
- Ücretsiz kotalar her an değişebiliyor ya da kapanabiliyor. Nitekim GitHub Models 30 Temmuz 2026'da kapandı ve zincirden çıkardık.
- Öğrencinin fotoğrafı ve sesi dış servislere gidiyor (gizlilik).
- İnternet gerekiyor.
- Sunum sırasında kota dolarsa ya da servis yavaşlarsa sistem aksayabilir.

Araştırdığımız seçenekler (`docs/arastirma/Telefonda çalışan görsel dil modeli.md`):
1. **Telefonda çalışan görsel-dil modeli:** Google **Gemma 4 E2B/E4B** (Apache-2.0) + **LiteRT-LM** (Android, Kotlin API). Rakip aday **Qwen3.5-2B/4B** (llama.cpp). Yayımlanan değerlere göre E2B dosyası ~2,6 GB; amiral gemisi telefonda GPU ile ~50 token/s, orta seviye telefonun CPU'sunda ise 2–5 token/s bildirilmiş (doğrulanmalı).
2. **Melez tasarım:** Metni ve formülleri **PaddleOCR** (PP-OCR + PP-FormulaNet, Android SDK var) okusun; okunuş bizim kural tabanlı dönüştürücümüzle üretilsin; açıklama ve çözümü telefondaki küçük model yapsın.
3. **Braille modeli** zaten küçük (3,7 MB). ONNX ya da TFLite'a çevrilip telefonda internetsiz çalıştırılabilir.
4. Ses tarafı zaten telefonda çalışıyor (Android TTS/ASR). Tamamen çevrimdışı alternatifler: sherpa-onnx (Piper Türkçe sesleri), whisper.cpp.

**Sorularımız:**
1. Telefonda çalışan bir model (Gemma 4 E2B / Qwen3.5-2B), lise düzeyi Türkçe matematik sayfasını okuma, açıklama ve çözme kalitesinde bulut modellerine yaklaşabilir mi? Hangi telefon sınıfını hedeflemeliyiz?
2. Melez tasarım (OCR + kural tabanlı okunuş + küçük dil modeli) mi, yoksa tek bir görsel-dil modeli mi daha güvenilir olur?
3. Kendi sunucumuzda açık kaynaklı bir model çalıştırmak (API anahtarı olmadan) mantıklı mı, yoksa maliyet ve bakım yükü çok mu fazla?
4. Bir yarışma prototipi için ara çözüm olarak "telefonda çalışan model, olmazsa bulut" düzeni nasıl kurulmalı?
5. Kodda mimari, güvenlik ya da hata yönetimi açısından gördüğünüz sorunlar neler?

---

## 5. Test ve doğrulama
- `npm test`: Sesli komut ayrıştırma (56 komut), ipucu filtresi (16 kötü / 14 iyi örnek), Türkçe sayı okunuşu, şık sızıntısı ve sağlayıcı zinciri testleri.
- `npm run yaris`: Bütün modelleri gerçek kitap sayfalarıyla yarıştırır.
- `npm run ipucu`: Modellerin ipucu sızdırıp sızdırmadığını ölçer. Gemini'de 0 sızıntı.
- Geliştirme sırasında Playwright ile uçtan uca testler yapıldı (web ve Android köprüsü benzetimi). Bu betikler depoda değil; elle test adımları `TEST.md` dosyasında.
- Braille: `braille/egitim/uctan_uca.py` (sentetik ve gerçek fotoğraflarda hücre doğruluğu).

## 6. Bilinen sınırlamalar
- Bulut servislerine ve ücretsiz kotalara bağımlılık (yukarıda).
- Modelin cevap kontrolünde hata yapma ihtimali. Ayrı bir cevap anahtarı çözücüsü planlandı, henüz eklenmedi.
- Braille modülü uygulamaya henüz eklenmedi. Türkçe Braille matematik gösterimi eksik.
- Ray-Ban Meta gözlük entegrasyonu henüz yok (Meta'nın geliştirici kiti DAT 1.0 kullanılacak).

## 7. Kodu incelemek için önerilen sıra
1. `README.md`: kullanım ve klasör yapısı
2. `api/chat.js`: sunucu, modlar, filtreler
3. `lib/prompts.js`: öğretmen talimatları
4. `lib/providers/chain.js`, `race.js`, `gemini.js`, `openaiCompat.js`: sağlayıcı katmanı
5. `public/js/app.js`, `commands.js`, `speech.js`: istemci akışı
6. `android/app/src/main/java/.../MainActivity.java` ve `public/js/android-bridge.js`: Android köprüsü
7. `braille/egitim/`: Braille modeli (uretici → model → egit → cozucu → uctan_uca)

Çalıştırmak için: Node.js 20+. `.env.example` dosyasını `.env` olarak kopyalayıp bir Gemini anahtarı girin ve `npm run dev` çalıştırın. Anahtarsız denemek için `npm run mock` yeterli.

Zip dosyasında hiçbir API anahtarı, şifre ya da imza anahtarı yok.

Vakit ayırdığınız için çok teşekkür ederiz. Her türlü eleştiri ve öneriye açığız.

Orbital Takımı

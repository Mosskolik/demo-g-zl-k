# 🎓 Sesli Matematik Asistanı

**TEKNOFEST "İnsanlık Yararına Teknoloji" — Lise kategorisi prototipi**

Görme engelli lise öğrencilerinin matematik öğrenmesine yardım eden, sesle konuşulan bir asistan.
Öğrenci kitabın fotoğrafını çeker. Asistan sayfayı Türkçe okunuşuyla sesli okur ("x kare", "dörtte üç", "parantez aç…").
Sayfa konu anlatımıysa konuyu adım adım anlatır. Soruysa ipucu vermeden soruyu açıklar.
Öğrencinin cevabını kontrol eder ve istenirse soruyu adım adım çözer.

> Nihai üründe görüntü **Ray-Ban Meta Gen 2** gözlükten gelecek. Bu prototipte **telefon kamerası** kullanılıyor.

---

## 📱 Nasıl kullanılır? (tamamen sesle — buton gerekmez)

Uygulama **sürekli dinler**: asistan susunca mikrofon kendiliğinden açılır.
Asistan konuşurken mikrofon kapalıdır. Susturmak için ekranın herhangi bir yerine dokunmak yeterli.

1. Linki telefonda aç ve **ekranın herhangi bir yerine dokun**.
   Tarayıcılar ses ve kamerayı ancak bir dokunuştan sonra açar. Bu ilk dokunuşu öğretmen yapabilir.
   Kamera ve mikrofon izni sorulursa **İzin ver**'e bas.
2. Sayfayı telefonun altına koy ve **ekrana dokun** ya da **"çek"** de. Fotoğraf çekilir.
   Fotoğraf karanlık veya bulanıksa asistan sesli uyarır ve fotoğrafı yapay zekâya göndermez.
   Prototipte ekranın **en altındaki "Galeriden görsel ekle"** butonuyla hazır bir görsel de seçebilirsin.
3. Öğrenci görme engelli olduğu için asistan **"doğru okudum mu?" diye sormaz**.
   Emin olmadığı bir yer varsa bunu kendisi söyler, örneğin "İkinci satırdaki üssü net okuyamadım, gerekirse tekrar çek".
   Bir öğretmen veya yardımcı yanlışlık fark ederse istediği an **"yanlış okudun, … olacak"** diyebilir.
4. Sayfanın türüne göre:
   - **Konu anlatımı sayfası:** Asistan hemen konuyu adım adım anlatmaya başlar ve ara ara "Devam edeyim mi?" diye sorar.
     Devam etmesi için **"evet"** ya da **"devam"** de, durması için **"hayır"** de.
   - **Soru sayfası:** Asistan soruyu **çözüm yolu veya ipucu vermeden** okur ve "Senden istenen: …" diye ne istendiğini söyler.
     Öğrenci istediği kadar düşünür. Hazır olunca **"hazırım"** der ve ardından cevabını söyler.
     Doğruysa asistan tebrik eder. Yanlışsa cevabı söylemeden tekrar düşünmeye teşvik eder.
   - Öğrenci **"çözemedim"**, **"cevabı söyle"** ya da **"bilmiyorum"** derse asistan soruyu adım adım çözer ve cevabı açıklar.
5. Komutlar:

| Söyle (veya butona bas / yaz) | Ne olur? |
|---|---|
| **çek** | Fotoğraf çeker |
| **tekrar et** | Son söylediğini tekrarlar |
| **yavaş oku** | Daha yavaş tekrar okur (hız ayarlardan da değişir) |
| **çöz** | Soruyu adım adım çözer |
| **hazırım** | "Cevabını söyle" der ve cevabını dinler |
| **cevabım …** (ör. "cevabım beş") | Cevabı doğrudan kontrol eder. Doğruysa tebrik eder, yanlışsa cevabı söylemeden teşvik eder |
| **çözemedim / cevabı söyle** | Soruyu adım adım çözer ve cevabı açıklar |
| **evet / devam** | Konu anlatımına devam eder |
| **yanlış okudun …** | Sayfayı yanlış okuduysa düzeltir (ör. "yanlış okudun, x küp olacak") |
| **yeni soru** | Baştan başlar |
| **dur** | Susar. Konuşurken ekrana dokunmak da susturur |
| **yardım** | Komutları sesli sayar |
| *başka her şey* | Serbest soru olarak cevaplanır. Konuşma geçmişi korunur |

Öğrenci düşünürken kendi kendine söylediği tek kelimeler (ör. "hmm") yok sayılır ve yapay zekâya gönderilmez.
Bu, ücretsiz istek hakkını korur. Cevap beklenirken söylenen tek kelime ise cevap sayılır.

Ekranın altındaki butonlar ve yazı kutusu, **gören yardımcılar** (öğretmen, aile) ve sesli komutun çalışmadığı durumlar içindir.
Android'de mikrofon her açıldığında telefon kısa bir ses çıkarabilir. Bu normaldir.

---

## 🗂️ Klasör yapısı

```
public/                  ← Telefonda açılan sayfa
  index.html             ← Ekran (büyük dokunma alanı, butonlar, yazı kutusu)
  style.css              ← Yüksek kontrast, büyük yazı
  js/app.js              ← Ana akış ve modlar
  js/speech.js           ← Sesli okuma + konuşma tanıma (tr-TR)
  js/commands.js         ← Sesli komutları anlama
  js/imageSource.js      ← ImageSource: kamera, galeri, (ileride) Meta gözlük
  js/quality.js          ← Karanlık/bulanık fotoğraf kontrolü (telefonda)
  js/feedback.js         ← Titreşim ve bip sesleri
  js/api.js              ← Sunucuya istek; 429'da bekleyip otomatik yeniden dener
api/
  chat.js                ← Vercel sunucu fonksiyonu (API anahtarı SADECE burada)
  health.js              ← Ayar kontrolü: /api/health
lib/
  config.js              ← ⚙️ Model adı ve sağlayıcı seçimi
  prompts.js             ← Yapay zekânın öğretmen talimatları
  providers/             ← AIProvider arayüzü: gemini.js, ollama.js (iskelet), mock.js (deneme)
scripts/
  dev-server.js          ← Yerel test sunucusu
  test-api.js            ← Otomatik testler
```

**Model değiştirmek:** Vercel'de `GEMINI_MODEL` ortam değişkenini ekle (ör. `gemini-3.1-flash-lite`) veya `lib/config.js` dosyasını düzenle.
Varsayılan model `gemini-3.5-flash`. Bu model kullanılamazsa, 30 saniyede cevap vermezse ya da ücretsiz kotası yoksa uygulama sırayla `gemini-3.1-flash-lite` ve `gemini-3.5-flash-lite` modellerini dener.
API anahtarının erişebildiği modellerin listesi: `https://senin-linkin.vercel.app/api/models`.
Google modelleri zamanla kaldırıyor. Hata alırsan önce bu listeye bak.

**Yerel model (Ollama):** `lib/providers/ollama.js` dosyasındaki açıklamaya bak. Bu seçenek sadece yerel testte çalışır.

---

## 💻 Yerel test (kendi bilgisayarında, isteğe bağlı)

Gerekenler: [Node.js](https://nodejs.org) (20 veya üstü). Ek paket kurmaya gerek yok.

1. Bu klasörde `.env.example` dosyasının bir kopyasını oluştur ve adını `.env` yap.
2. `.env` dosyasını aç, `GEMINI_API_KEY=` yazan yerin sonuna anahtarını yapıştır.
   `.env` dosyası `.gitignore`'da olduğu için GitHub'a **yüklenmez**.
3. Terminalde şu komutu çalıştır:
   ```bash
   npm run dev
   ```
4. Tarayıcıda `http://localhost:3000` adresini aç.

Anahtarsız denemek için `npm run mock` kullan (sahte cevaplar gelir). Otomatik testler için `npm test`.

---

## ☁️ GitHub'a yükleme

Kod bu depoda: `mosskolik/demo-g-zl-k`. Vercel'in yayınladığı ana link `main` dalından çıkar.
Bu yüzden değişiklikler bir Pull Request ile `main` dalına birleştirilir (GitHub'da **Merge pull request** butonu).

Kendin değişiklik yaparsan şu komutları sırayla çalıştır:
```bash
git add .
```
```bash
git commit -m "Değişikliğin kısa açıklaması"
```
```bash
git push
```

---

## 🚀 GitHub OLMADAN Vercel'e yükleme (Vercel CLI ile)

GitHub hesabın kullanılamıyorsa kodu doğrudan Vercel'e yükleyebilirsin.
Bu işlem kendi bilgisayarından **bir kez** yapılır. Sonrasında uygulama tamamen Vercel'in bulutunda çalışır,
yani gösterim sırasında bilgisayarının kapalı olması sorun değildir.

1. [nodejs.org](https://nodejs.org) adresinden **LTS** sürümünü indir ve kur. Kurulumda hep **Next**'e basman yeterli.
2. Bu proje klasörünü (zip'ten çıkardığın klasörü) aç.
   Windows'ta klasörün boş bir yerine **Shift + sağ tık → "Terminalde aç"** (veya "PowerShell penceresini burada aç") seç.
3. Vercel'e giriş yapmak için şu komutu çalıştır:
   ```bash
   npx vercel login
   ```
   İlk sorulan "Ok to proceed?" sorusuna **y** yazıp Enter'a bas.
   Açılan tarayıcıda giriş yap. GitHub ile giriş yapamıyorsan **Continue with Email** seç ve e-postana gelen kodu gir.
4. Projeyi yüklemek için şu komutu çalıştır:
   ```bash
   npx vercel
   ```
   Soruları şöyle cevapla:
   - "Set up and deploy?" → **y**
   - "Which scope?" → kendi adını seç ve Enter'a bas
   - "Link to existing project?" → **n**
   - "What's your project's name?" → `matematik-asistani` yaz
   - "In which directory is your code located?" → sadece Enter'a bas
   - Ayarları değiştirmek isteyip istemediğin sorulursa → **n**
5. [vercel.com](https://vercel.com)'da projeyi aç → **Settings → Environment Variables**.
   **Key** kutusuna `GEMINI_API_KEY` yaz, **Value** kutusuna anahtarını yapıştır ve **Save**'e bas.
6. Asıl (herkese açık) yayını yapmak için şu komutu çalıştır:
   ```bash
   npx vercel --prod
   ```
   Komutun sonunda çıkan `https://matematik-asistani-….vercel.app` linki uygulamanın adresidir.

Kodda bir değişiklik olursa son komutu (`npx vercel --prod`) tekrar çalıştırman yeterli.

## 🚀 Vercel'de yayınlama — GitHub ile (bir kez yapılır)

1. [vercel.com](https://vercel.com) adresine git ve **GitHub ile giriş yap**.
2. Sağ üstte **Add New… → Project**'e tıkla.
3. Listede **demo-g-zl-k** deposunu bul ve **Import**'a tıkla.
   - Depo listede yoksa **Adjust GitHub App Permissions**'a tıkla ve bu depoya izin ver.
4. **Framework Preset**: `Other` kalsın. Diğer ayarlara dokunma.
5. **Environment Variables** bölümünü aç ve ortam değişkenini ekle:
   - **Key** (Name): `GEMINI_API_KEY`
   - **Value**: Google AI Studio'dan aldığın anahtarı yapıştır
   - **Add**'e bas.
6. **Deploy**'a tıkla. Yaklaşık 1 dakika bekle.
7. Yayın bitince **Continue to Dashboard → Domains** bölümündeki `https://….vercel.app` linki uygulamanın adresidir.

Bundan sonra `main` dalına gelen her değişiklik **otomatik** olarak yayınlanır.

### Ortam değişkenini sonradan eklemek veya değiştirmek

1. Vercel'de projeyi aç ve **Settings → Environment Variables**'a git.
2. `GEMINI_API_KEY` değişkenini ekle veya düzenle (Production seçili olsun) ve **Save**'e bas.
3. **Deployments** sekmesinde en üstteki yayının yanındaki **⋯** menüsünden **Redeploy**'u seç.
   Değişiklik ancak yeniden yayından sonra geçerli olur.

**Kontrol:** `https://senin-linkin.vercel.app/api/health` adresini aç.
`"apiKeyEklendi": true` görüyorsan anahtar eklenmiş demektir. Anahtarın kendisi bu sayfada asla gösterilmez.

---

## 📲 Telefonda açma ve izinler

- **Android (Chrome):** Linki aç ve ekrana dokun. "Kamerayı kullanmak istiyor" ve "Mikrofonu kullanmak istiyor" sorularına **İzin ver** de.
- **iPhone (Safari):** Linki aç ve ekrana dokun. Kamera iznine **İzin Ver** de.
  - iPhone'da sesli komut bazen çalışmaz. O zaman büyük butonları veya yazı kutusunu kullan.
    Klavyedeki 🎤 (dikte) tuşuyla konuşarak da yazabilirsin.
  - Ses çıkmıyorsa telefonun yan tarafındaki **sessiz modu** kapat ve sesi aç.
- İzni yanlışlıkla reddettiysen:
  - **Chrome:** Adres çubuğundaki 🔒 simgesine dokun → **İzinler** → Kamera/Mikrofon → İzin ver.
  - **iPhone:** **Ayarlar → Safari → Kamera / Mikrofon** → "Sor" veya "İzin Ver".
- **Ekran okuyucu (TalkBack/VoiceOver) kullanıyorsan:** Ayarlar'dan **"Ekran okuyucu kullanıyorum"** seçeneğini aç.
  Böylece uygulama kendi sesini kapatır ve cevapları ekran okuyucun okur. İki ses üst üste binmez.

---

## ❓ Sık karşılaşılan hatalar

| Belirti | Çözüm |
|---|---|
| "Yapay zekâ anahtarı eklenmemiş" | Vercel'de `GEMINI_API_KEY` ekle, sonra **Redeploy** yap (yukarıya bak). |
| "Anahtar geçersiz" | Anahtarı [Google AI Studio](https://aistudio.google.com/apikey)'dan tekrar kopyala. Başında veya sonunda boşluk olmasın. |
| "Çok fazla istek oldu, biraz bekle" | Ücretsiz katmanda dakikada az istek hakkı var. Uygulama kendisi bekleyip tekrar dener. |
| "Bugünkü ücretsiz kullanım hakkı doldu" | Günlük kota doldu. Her gün Türkiye saatiyle yaklaşık 11:00'de (yaz aylarında 10:00'da) yenilenir. Dakikalık sınır ise 1 dakikada yenilenir. İstersen Vercel'de `GEMINI_MODEL` ile başka bir Flash modeli dene. |
| Kamera açılmıyor | Link **https** ile mi açıldı? İzin verildi mi? Olmazsa galeriden yükle. |
| Ses yok | Sessiz modu kapat ve sesi aç. Ekrana bir kez dokunmak gerekir (tarayıcı kuralı). |
| Sesli komut çalışmıyor | Mikrofon iznini kontrol et. Ayarlar'da **Sürekli dinle** açık olsun. iPhone'da olmazsa butonları veya yazı kutusunu kullan. |
| Vercel linki giriş istiyor | Sadece önizleme linkleri giriş ister. Projenin **Domains** bölümündeki ana `….vercel.app` linkini kullan. |
| `/api/health` 404 veriyor | Vercel'de Framework Preset'in `Other` olduğundan emin ol. |

---

## 🔒 Gizlilik ve güvenlik

- API anahtarı yalnızca Vercel sunucusunda durur. Tarayıcı koduna ve GitHub'a hiç girmez.
- Google'ın ücretsiz katmanında gönderilen içerik Google ürünlerini geliştirmek için kullanılabilir.
  Bu yüzden fotoğraflarda **sadece kitap sayfası** olsun, kişisel bilgi veya yüz olmasın.

# Görme engelli kullanıcılar için sesli arayüz (VUI) ve işitsel etkileşim tasarımı (Android, Türkçe, eller serbest matematik asistanı)

Etiketler: **[TAM METİN]**: tam metin indirilip okundu (pdftotext/HTML). **[ÖZET]**: yalnızca özet, arama parçası ya da ikincil özet okundu. İndirilen dosyalar: `/tmp/claude-0/-home-user-demo-g-zl-k/3cc8a036-cee7-56b5-90a7-7dc50a0e0eaf/scratchpad/kaynaklar/vui/`. Alıntılar özgün İngilizce metinden aynen aktarıldı.

## 1. Kör kullanıcıların sesli asistan kullanımı: Abdolrahmani vd. 2018, Branham ve Mukkath Roy 2019, Pradhan vd. 2018, ilgili çalışmalar

### Takeaway
Kör kullanıcılar sesli asistanları oyuncak gibi değil ciddi bir araç olarak kullanıyor. Yine de yaşadıkları sorunlar hep aynı: yavaş ve ayarlanamayan konuşma hızı, katı zaman aşımları, çok uzun ya da gereksiz yanıtlar, tanıma hatasını fark edip düzeltmenin zorluğu, uyandırma sözcüğünün güvenilmezliği ve görsel ipuçlarının (ışık halkası vb.) sesli karşılığının olmaması. Ticari VUI kılavuzları "insan-insan konuşması" metaforuyla kısa yanıtları, kısa listeleri ve earcon kullanmamayı öneriyor. Branham ve Roy'a göre bu öneriler kör kullanıcıları dışlıyor. Kullanıcının hızı, uzunluğu ve liste boyunu anında ayarlayabilmesi gerekiyor.

### Cited Findings
**Abdolrahmani, Kuber, Branham, "Siri Talks at You", ASSETS 2018 [TAM METİN]**, 14 yasal olarak kör yetişkinle yarı yapılandırılmış görüşme, https://userpages.umbc.edu/~rkuber/pubs/assets2018.pdf
- Yöntem: "we interviewed fourteen legally-blind adults with experience of home and/or mobile-based VAPAs". Kullanıcıların sorunları "challenges relating to the input, responses from VAPAs, and control of information presented" başlıklarında toplanıyor. — [Abdolrahmani vd. 2018](https://userpages.umbc.edu/~rkuber/pubs/assets2018.pdf)
- Konuşma hızı: "VAPAs should provide the ability to allow users to customize voice output settings (e.g., speech rate, clarity, and intensity) based on their needs and the nature of the task. Experienced screen reader users are accustomed to speech presented via their devices at a fast rate. However, VAPAs caused frustration when the user was forced to interact at a slower pace than desired." — [Abdolrahmani vd. 2018](https://userpages.umbc.edu/~rkuber/pubs/assets2018.pdf)
- Mahremiyet için hızlı konuşma: "five participants indicated that faster presentation of content would help them preserve their privacy when interacting with VAPAs without headsets... They reasoned that the fast output would sound unintelligible to most sighted passersby." — [Abdolrahmani vd. 2018](https://userpages.umbc.edu/~rkuber/pubs/assets2018.pdf)
- Zaman aşımı: "Four participants found this timeout frustrating, especially when inputting a complex command... there not being enough feedback provided to estimate the time window available, prior to the system timing-out. P6: 'You have to be pretty quick with that one [the calendar], otherwise it'll cut you off.'" Tasarım önerisi: "more time to perform tasks prior to the system timing-out". — [Abdolrahmani vd. 2018](https://userpages.umbc.edu/~rkuber/pubs/assets2018.pdf)
- Ayrıntı düzeyi ve onay: "Six participants shared experiences where feedback was too verbose, unnecessary, irrelevant, or conversely, provided insufficient information." Bir katılımcı, kişinin adını yüksek sesle tekrarlamak yerine Siri'nin yalnızca "OK" diyerek onaylamasını önermiş. Yazarlar: "Control should be afforded to allow users to customize the output, depending on preference and context of use. This may also speed-up the process of being able to detect errors made, and recover from these errors." — [Abdolrahmani vd. 2018](https://userpages.umbc.edu/~rkuber/pubs/assets2018.pdf)
- Uyandırma sözcüğü: "eight participants reported instances of their VAPAs not responding when wakewords were voiced, or conversely were unexpectedly activated... Their experiences had led to them favoring physically-activating Siri, rather than using a wakeword, to ensure that they could stay in control of activation." P14 uyandırma sözcüğünü tamamen kapatmış. TV açıkken yanlış tetiklenme daha sık yaşanıyor. — [Abdolrahmani vd. 2018](https://userpages.umbc.edu/~rkuber/pubs/assets2018.pdf)
- Gürültü ve tanıma hataları: komutlar "particularly in public venues when ambient sounds may mask or interfere with recognition (e.g., when riding on a noisy train)" ortamlarda yanlış anlaşılıyor. Beklenmedik eylemler güveni zedeliyor. Bir katılımcı takvim girişini sesle yapmayı bırakmış, çünkü "he needed to spend too much time checking for errors." Gürültülü ortamlarda katılımcılar çoğunlukla kulaklıklı mikrofon kullanmış. — [Abdolrahmani vd. 2018](https://userpages.umbc.edu/~rkuber/pubs/assets2018.pdf)
- Sonuç: "issues such as identifying and recovering from recognition errors, difficulties with timeouts, presentation of auditory content at a slow speed... disproportionately impact individuals who are blind." — [Abdolrahmani vd. 2018](https://userpages.umbc.edu/~rkuber/pubs/assets2018.pdf)
- Earcon önerisi: "Short bursts of audio (earcons) could be used to bridge the gap between the visual and non-visual representation of notifications and alerts provided by VAPAs." Konuşmaya dayalı karşılıklar ise "may end up overloading the user". Bir katılımcı mikrofonun açık mı kapalı mı olduğunu anlamakta zorlanmış. — [Abdolrahmani vd. 2018](https://userpages.umbc.edu/~rkuber/pubs/assets2018.pdf)

**Branham ve Mukkath Roy, "Reading Between the Guidelines", ASSETS 2019 [ÖZET]**: tam metne ulaşılamadı (ACM 403). Aşağıdakiler ikincil bir özet sitesinden ve arama özetlerinden alındı. DOI 10.1145/3308561.3353797.
- Amazon, Google, Microsoft, Apple ve Alibaba'nın kılavuzlarının (sırasıyla 271/83/42/15/19 sayfa) tematik analizi. Ortak metafor: etkileşim insan-insan konuşması gibi modellenmeli. — [A11y Paradise özeti](https://a11y-paradise.onrender.com/reviews/69bc2ac17346cbd865b95fab)
- Kılavuzların koyduğu sınırlar: "maximum two keywords per turn, three items per list, a 'one-breath test' for utterances, 20-second maximum for list reading". Özete göre kör bireyler konuşmayı "up to 25 syllables per second" hızda anlayabiliyor, görenler için üst sınır yaklaşık 10. Özetteki bu rakamlar birincil kaynakta doğrulanamadı. — [A11y Paradise özeti](https://a11y-paradise.onrender.com/reviews/69bc2ac17346cbd865b95fab)
- Earcon: kılavuzlar dil dışı sesleri caydırıyor. Google'ın bunlar için "mismatch for conversational interfaces" dediği aktarılıyor. Hiçbir satıcının kılavuzunda engelli kullanıcılara özgü bir tavsiye yok. — [A11y Paradise özeti](https://a11y-paradise.onrender.com/reviews/69bc2ac17346cbd865b95fab)
- Üç öneri: (1) yanıt uzunluğu, liste boyu ve konuşma hızı kullanıcı tarafından anında ayarlanabilmeli; (2) özel sesli komutlar ("voice macros") tanımlanabilmeli; (3) konuşma hızı ayarlanabilmeli. — [A11y Paradise özeti](https://a11y-paradise.onrender.com/reviews/69bc2ac17346cbd865b95fab); bibliyografya: [dblp](https://dblp.uni-trier.de/rec/conf/assets/BranhamR19.html)
- Aynı ekibin iConference 2019 posteri ("Beyond being human") da Amazon ve Google kılavuzlarında insan-insan konuşmasının "gold standard" olarak alındığını bildiriyor [ÖZET]. — [IDEALS](https://ideals.illinois.edu/items/110381)

**Pradhan, Mehta, Findlater, "Accessibility Came by Accident", CHI 2018 [ÖZET]**: tam metne ulaşılamadı.
- Hazır akıllı asistanların (ör. Amazon Echo) engelli kullanıcılarca kullanımı iki keşif çalışmasıyla inceleniyor. Abdolrahmani vd. bu çalışmayı şöyle aktarıyor: "a broad range of people with disabilities––and, prominently, people with vision impairments––have already embraced the Amazon Echo platform as a practical accessibility solution". — [dblp](https://dblp1.uni-trier.de/rec/conf/chi/PradhanMF18.html); aktaran [Abdolrahmani vd. 2018](https://userpages.umbc.edu/~rkuber/pubs/assets2018.pdf)

**Vtyurina vd., VERSE, ASSETS 2019 [TAM METİN]**: 53 yasal olarak kör kişiyle anket.
- "virtual assistants are convenient and accessible, but lack the ability to deeply engage with content (e.g., read beyond the first few sentences of an article)... In contrast, screen readers allow for deep engagement... and provide fine-grained navigation & control, but at the cost of reduced walk-up-and-use convenience." Bir katılımcı, ekran okuyucuyla sayfada aşağı inmenin asistanın konuşmasını bitirmesini beklemekten hızlı olduğunu söylemiş. Yazarlar VA'ların sabit oynatma hızına da değiniyor. VERSE'de kullanıcı okumayı kesip "Read section titles" gibi gezinme komutları verebiliyor. — [Vtyurina vd. 2019](https://cs.uwaterloo.ca/~avtyurin/papers/VERSEVtyurinaASSETS2019.pdf)

**Kim, CSUN 2024 [TAM METİN]**
- iPhone kullanan görme engellilerde VoiceOver'ın SUS puanı 52,5±16,11 ("poor"), Seeing AI'ınki 74,50±12,17 ("good"). Kılavuz uzun basma gibi "dinamik" hareketleri ne kadar süre yapılacağıyla birlikte anlatmadığı için kullanıcılar yanlışlıkla uygulama silme ekranına geçmiş. — [Kim 2024](https://par.nsf.gov//servlets/purl/10543242)

**Storer, Judge, Branham, "All in the Same Boat", CHI 2020 [TAM METİN, yalnız özeti kullanıldı]**
- Görme engelli kişiler sesli asistanları "used them more frequently, and learned more proactively about their features". Karma görme yetisine sahip ailelerde asistan kullanımı ilişkiler ve güvenlik açısından ödünleşimler doğuruyor. — [Storer vd. 2020](https://par.nsf.gov/servlets/purl/10156140)

### Inferences
- Matematik asistanında konuşma hızı, yanıt uzunluğu (kısa ya da ayrıntılı) ve zaman aşımı süresi sesli komutla anında değiştirilebilmeli. Örnek komutlar: "daha hızlı", "daha kısa", "bekle". Sessizlik zaman aşımı cömert seçilmeli; öğrenci bir soruyu düşünürken kesilmemeli.
- Sürekli dinleme ya da uyandırma sözcüğü yanlış tetiklenmeye açık. Kontrolü kullanıcıda tutan fiziksel bir tetik de sunulmalı: ses tuşu, ekrana uzun basma ya da kulaklık düğmesi.
- Mikrofonun açık mı kapalı mı olduğu her zaman işitsel ya da dokunsal olarak bildirilmeli. Görsel ışık tek başına yetmez.
- Tanıma hatalarını yakalayabilmek için sistem ne anladığını kısa ve özgün biçimde geri okumalı: "Anladığım: 3x artı 5 eşittir 20". Bu Abdolrahmani'nin hata algılama önerisinden çıkarılan bir sonuç.

### Gaps
- Branham ve Roy (2019) ile Pradhan vd. (2018) için tam metin indirilemedi; ACM DL 403 verdi, açık erişim kopya bulunamadı. Branham bulguları ikincil özete dayanıyor. "25 hece/saniye" rakamı birincil kaynakta doğrulanmadı.
- Okulda ya da sınıf ortamında kör öğrencilerle yapılmış bir VUI çalışması bulunamadı.

## 2. Ekran okuyucu konuşma hızı: tercih edilen ve azami hızlar, ayarlanabilir hız ve ayrıntı düzeyi

### Takeaway
Görme engelli dinleyiciler sentetik konuşmayı görenlerden anlamlı ölçüde daha hızlı anlıyor: ortalama yaklaşık 334 WPM, görenlerde yaklaşık 297 WPM. İnsan konuşması 120–180 WPM aralığında. Deneyimli ekran okuyucu kullanıcıları 500 WPM'e kadar çıkabiliyor. Varsayılan hız insan konuşmasına yakın tutulmalı, ama ayar aralığı geniş, kalıcı ve sesle değiştirilebilir olmalı. Yeni kör olmuş kullanıcılar daha doğal ve yavaş sesleri tercih ediyor.

### Cited Findings
**Bragg, Bennett, Reinecke, Ladner, "A Large Inclusive Study of Human Listening Rates", CHI 2018 [TAM METİN]**: https://wildlab.cs.washington.edu/Publications_files/Bragg_CHI2018.pdf
- Katılımcılar 453 gönüllü: 310 gören, 143 görme engelli (101'i kör). Dinleme hızı, VoiceOver ile farklı hızlarda okunan sorulara verilen doğru yanıtlarla ölçülmüş. — [Bragg vd. 2018](https://wildlab.cs.washington.edu/Publications_files/Bragg_CHI2018.pdf)
- "The mean Listening Rate was 56.8, which corresponds to 309 WPM. Given that people typically speak at a rate of 120-180 WPM, these results suggest that many people, if not most, can understand speech significantly faster than today's conversational agents." — [Bragg vd. 2018](https://wildlab.cs.washington.edu/Publications_files/Bragg_CHI2018.pdf)
- "The mean Listening Rate for visually impaired participants was 60.6 (334 WPM) while for sighted participants it was 55.1 (297 WPM). The difference between these groups is statistically significant (t(451) = 2.4014...)". — [Bragg vd. 2018](https://wildlab.cs.washington.edu/Publications_files/Bragg_CHI2018.pdf)
- "Typical human speaking rate 120-180 WPM corresponds to VoiceOver range 24-38." Ana dili İngilizce olmak dinleme hızını artırıyor ("increasing Listening Rate by 7.78"). Yaş ile görme engeli arasında anlamlı bir etkileşim var: genç görme engelliler en iyi sonucu veriyor. — [Bragg vd. 2018](https://wildlab.cs.washington.edu/Publications_files/Bragg_CHI2018.pdf)
- Literatürden aktarım: "Newly blind people prefer voices and speeds resembling human speech (concatenative synthesis), while experienced screen reader users prefer voices more resilient to distortion at high speeds (formant synthesis), and save time by setting them to high speeds, even reaching 500 words per minute". Kaynak makalenin [10] numaralı atfı, yani ikincil. — [Bragg vd. 2018](https://wildlab.cs.washington.edu/Publications_files/Bragg_CHI2018.pdf)
- "The findings also suggest a need to expand the range of rates available on personal devices." Ölçüm VoiceOver'ın azami hızıyla sınırlıydı ve bazı katılımcılar en yüksek hızda bile tam doğru yanıt verdi. — [Bragg vd. 2018](https://wildlab.cs.washington.edu/Publications_files/Bragg_CHI2018.pdf)
- Genişletilmiş sürüm (TACCESS 2021) 1.409 katılımcıya ulaşmış [ÖZET; PDF indirilemedi]. — [Bragg vd. 2021](https://homes.cs.washington.edu/~dkbragg/papers/Expanding_a_Large_Inclusive_Study.pdf)
- Abdolrahmani vd.: hızlı ekran okuyucu kullanıcıları yavaş asistan konuşmasından rahatsız oluyor ve hızlı konuşmayı mahremiyet aracı olarak da görüyor (ayrıntı Bölüm 1'de). — [Abdolrahmani vd. 2018](https://userpages.umbc.edu/~rkuber/pubs/assets2018.pdf)
- TalkBack'te "Verbosity" ayarı var: "Choose how much TalkBack says... Custom, high, low." Ses ve titreşim altında da "Sound feedback, Sound feedback volume, Voice selection, Audio ducking, Vibration feedback" seçenekleri bulunuyor [TAM METİN]. — [Google TalkBack ayarları](https://support.google.com/accessibility/android/answer/6006589?hl=en)

### Inferences
- Önerilen varsayılan: insan konuşmasına yakın bir hız (Android `TextToSpeech.setSpeechRate(1.0)` civarı). Ayar aralığı en az 0,5×–3× olmalı ve "daha hızlı/daha yavaş" komutu tek adımda yaklaşık %10–15 değiştirmeli. Bu bir uygulama çıkarımı; Bragg'in WPM ölçümleri İngilizce ve VoiceOver Alex sesiyle yapıldı.
- Bragg'e göre ana dil dinleme hızını etkiliyor. Türkçe TTS'in yüksek hızda anlaşılırlığı ayrıca test edilmeli. Matematik ifadeleri (eksi işareti, üs, kesir) yüksek hızda kolayca karışabilir. Formüller düzyazıdan ayrı bir hız ya da duraklama ayarıyla okunabilir.
- Ayrıntı düzeyi için en az iki seviye öneriliyor. "Kısa" sadece sonucu söyler. "Ayrıntılı" adım adım açıklama verir.

### Gaps
- Türkçe sentetik konuşmanın görme engellilerce anlaşılabildiği azami hız üzerine bir çalışma bulunamadı.
- Matematiksel içeriğin yüksek hızda anlaşılırlığını ölçen bir çalışma bu turda bulunamadı.

## 3. Earcon, işitsel ikon ve spearcon: ne zaman yardımcı, kaç ses öğrenilebilir

### Takeaway
Earcon'lar sesli arayüzlerde durum bildirmek için uygun: dinleme başladı, mikrofon kapandı, işlem sürüyor, hata. Kısa olmalı, birbirinden ritim ve tını ile açıkça ayrılmalı, ses şiddeti dar bir aralıkta tutulmalı. Menü ya da liste gezinmesinde soyut earcon'lar konuşmadan yavaş kalırken spearcon'lar (hızlandırılmış konuşma) konuşma kadar hızlı ve doğru. Kör kullanıcılar ekran okuyucu seslerine alışkın. Ticari kılavuzlar earcon'ları caydırsa da araştırmacılar onları öneriyor.

### Cited Findings
**Brewster, Wright, Edwards, "Guidelines for the Creation of Earcons" [TAM METİN]**: https://www.dcs.gla.ac.uk/~stephen/earcon_guidelines.shtml
- Ayırt edicilik: "If listeners must recognise each earcon without reference to any other, i.e. make absolute judgements, then there must be big differences between them." Earcon aileleri önce tını, ses kaydı ve ritimle kurulmalı. — [Brewster vd.](https://www.dcs.gla.ac.uk/~stephen/earcon_guidelines.shtml)
- Ritim ve süre: "Make rhythms as different as possible. Putting different numbers of notes in each rhythm is very effective... do not use notes less than 0.0825 sec. However, if the earcon is very simple (one or two notes) then notes as short as 0.03 sec. can be used. Earcons should be kept as short as possible... Earcons with up to six notes played in one second have been shown to be usable." — [Brewster vd.](https://www.dcs.gla.ac.uk/~stephen/earcon_guidelines.shtml)
- Perde: "no higher than 5kHz... and no lower than 125Hz-150Hz". Mutlak yargı gerekiyorsa yalnızca perdeye dayanılmamalı; "Two or three octaves difference give better recognition." — [Brewster vd.](https://www.dcs.gla.ac.uk/~stephen/earcon_guidelines.shtml)
- Ses şiddeti: "intensity... is the main cause of annoyance due to sound... Earcons should be kept within a narrow range". Önerilen aralık en çok eşiğin 20 dB, en az 10 dB üstü. Dikkat çekmek için yüksek ses yerine ritim ya da perde değişimi öneriliyor. — [Brewster vd.](https://www.dcs.gla.ac.uk/~stephen/earcon_guidelines.shtml)
- Art arda çalınan earcon'lar arasında "use a 0.1 second gap". — [Brewster vd.](https://www.dcs.gla.ac.uk/~stephen/earcon_guidelines.shtml)

**Walker, Nance, Lindsay, "Spearcons", ICAD 2006 [TAM METİN]**: https://typeset.io/pdf/spearcons-speech-based-earcons-improve-navigation-4tteewr1jq.pdf
- "Spearcons are created by speeding up a spoken phrase until it is not recognized as speech... Spearcons and speech-only both led to faster and more accurate menu navigation than auditory icons and hierarchical earcons." Ortalama hedefe ulaşma süresi spearcon'da 3,28 sn, yalnız konuşmada 3,49 sn; fark anlamlı değil (p = .32). Hiyerarşik earcon'lar en yavaşı. — [Walker vd. 2006](https://typeset.io/pdf/spearcons-speech-based-earcons-improve-navigation-4tteewr1jq.pdf)
- "the arbitrary mapping of earcons means that more learning, and potentially more explicit training, is required"; bazı katılımcılar için hiyerarşik earcon'lar eğitimden sonra bile "particularly difficult" oldu. Sınırlama: katılımcılar 9 gören lisans öğrencisi. — [Walker vd. 2006](https://typeset.io/pdf/spearcons-speech-based-earcons-improve-navigation-4tteewr1jq.pdf)
- Spindex (konuşma indeksi) çalışması işitsel menülerde kabulü ve gezinme performansını artırmış [ÖZET; PDF indirildi, ayrıntılı okunmadı]. — [Jeon ve Walker](https://wirelessrerc.gatech.edu/sites/default/files/publications/walker_et_al_-_spindex_improves_auditory_menu_acceptance_and_navigation_performance.pdf)
- Abdolrahmani vd. earcon'ları kör kullanıcıların bildirimleri görenlerle "similar time frame" içinde algılayabilmesinin yolu olarak öneriyor. Branham ve Roy, kılavuzların earcon'ları caydırmasını bir erişilebilirlik engeli sayıyor. — [Abdolrahmani vd. 2018](https://userpages.umbc.edu/~rkuber/pubs/assets2018.pdf); [A11y Paradise özeti](https://a11y-paradise.onrender.com/reviews/69bc2ac17346cbd865b95fab)

### Inferences
- Önerilen küçük earcon seti, 4–6 ses: (1) dinleme başladı, (2) dinleme bitti ya da işleniyor, (3) anlaşılamadı/hata, (4) başarı ya da sonuç hazır, (5) kamera modunda "çerçeve iyi" ya da çekildi. Her biri farklı nota sayısı ve ritimle yapılmalı, süresi yaklaşık 0,5 sn'nin altında kalmalı ve hep aynı ses düzeyinde çalınmalı.
- Seçenek listeleri için earcon yerine konuşma ya da spearcon tercih edilmeli.
- "Kaç ses öğrenilebilir" sorusuna bu turda sayısal bir cevap bulunamadı. Brewster yalnızca mutlak tanıma için büyük farklar gerektiğini söylüyor. Bu yüzden küçük bir set daha güvenli; bu bir çıkarım.

### Gaps
- Kullanıcıların kaç farklı earcon'u güvenilir biçimde öğrenebildiğine dair sayısal bulgu bulunamadı. Brewster'ın CHI'93 ve IJHCS makalelerindeki tanıma oranları okunmadı.
- Spearcon bulguları gören katılımcılara dayanıyor; kör katılımcılı replikasyon bu turda okunmadı.

## 4. Kör kullanıcıların belge fotoğrafı çekmesi için kamera yönlendirme (VizWiz, Jayant vd. 2011, Seeing AI, kenar algılama)

### Takeaway
Yönlendirme olmadan kör kullanıcıların çektiği fotoğrafların önemli kısmı kullanılamıyor: VizWiz'de soruların yaklaşık %28'i cevaplanamaz bulunmuş. Nedenler bulanıklık, yetersiz ışık, lensi kapatan parmak ve çerçeve dışında kalan içerik. Sesli yönlendirme kaliteyi artırıyor. Kullanıcı anketlerinde en çok istenen ipucu "Move Left" türü sözlü talimatlar (118 kişide 55); onları tonlar (29) ve titreşim (28) izliyor. Belge çekimi için işe yarayan desen şu: dört kenarı algıla, eksik kenarı ya da mesafeyi sözlü söyle ("bottom left edge not visible", "too close"), hepsi görününce "hold steady" de, sonra otomatik çek ve ardından bulanıklık kontrolü yap.

### Cited Findings
**Jayant, Ji, White, Bigham, "Supporting Blind Photography", ASSETS 2011 [TAM METİN]**: https://cs.rochester.edu/hci/pubs/pdfs/supporting-blind-photography.pdf
- 118 kişilik anket: 66 tamamen kör, 15 ışık algısı olan, 37 az gören. Arzulanan kamera kullanımlarının başında "document text recognition" geliyor. — [Jayant vd. 2011](https://cs.rochester.edu/hci/pubs/pdfs/supporting-blind-photography.pdf)
- İpucu tercihi: "Phone Vibrations (28), Audio Instructions (e.g., 'Move Left,' 'Move Up') (55), and Audio Tones (Pitch) (29)". Açık uçlu öneriler arasında otomatik çekim de var: "simply having the camera auto-shoot when 'enough' of the desired object is in view (the knfbReader tells the user what percent of the page is in the view-frame...)". Bir katılımcı ne bilgi alacağını seçebileceği farklı modlar istemiş. — [Jayant vd. 2011](https://cs.rochester.edu/hci/pubs/pdfs/supporting-blind-photography.pdf)
- EasySnap'in geri bildirim biçimi: "'Bottom right, 60 percent, slightly angled down.'" Konumlar "top left / top / top right / left / center / right / bottom left / bottom / bottom right" olarak söyleniyor, eğim ivmeölçerle bildiriliyor, yüz yoksa her iki saniyede "Searching" deniyor, işleme hızı 4–5 kare/sn. Nesne modunda geri bildirim her 3 saniyede bir veriliyor. Çekimden sonra pozlama ve netlik kontrol ediliyor. — [Jayant vd. 2011](https://cs.rochester.edu/hci/pubs/pdfs/supporting-blind-photography.pdf)
- Sonuç: 31 bağımsız değerlendiricinin 1.116 karşılaştırmasında "58% of which are better with EasySnap's feedback, 29% are better without feedback, and 12% are neutral". PortraitFramer'ı 15 kör ya da az gören katılımcının hepsi birkaç dakikalık eğitimle başarıyla kullanmış. — [Jayant vd. 2011](https://cs.rochester.edu/hci/pubs/pdfs/supporting-blind-photography.pdf)
- Ayrıntı tercihi kişiden kişiye değişiyor. Bazıları "As much detail as possible is great" demiş, ikisi açık başarı onayı istemiş ("Great, take a photo!"), biri ise mümkün olduğunca az bilgi istemiş. İki katılımcı uygulamanın toplum içinde açık sözlü ipucu vermesinden rahatsız; birisi doğru mesafede bip ve otomatik çekim önermiş. Kullanıcılar kulaklığı genelde tek kulakta takıyor ("one in, one out"). — [Jayant vd. 2011](https://cs.rochester.edu/hci/pubs/pdfs/supporting-blind-photography.pdf)
- Belge modu (EasySnap demo): "document mode is for taking pictures of books, newspaper, and banknotes, which assumes that user is 1 to 3 feet from the document. This mode includes feedback for alignment and rotation." Aynı demoya göre kNFB Reader önerileri arasında birkaç saniye bekliyor. — [White, Ji, Bigham, EasySnap](https://www.cs.rochester.edu/hci/pubs/pdfs/easysnap.pdf)

**Gurari vd., VizWiz Grand Challenge, CVPR 2018 [TAM METİN]**
- 31.000'den fazla görsel soru. "In VizWiz, ∼28% of visual questions are deemed unanswerable by crowd workers", nedenler "blur, inadequate lighting, finger covering the lens, etc." — [Gurari vd. 2018](https://arxiv.org/pdf/1802.08218v4.pdf)

**Vázquez ve Steinfeld, ASSETS 2012 [ÖZET]**
- Konuşma, ton ve sessiz geri bildirim karşılaştırılmış: "audio feedback is valuable. Visually impaired users were not affected by audio feedback in terms of social comfort... we observed trends in favor of speech over tone, including higher ratings for ease of use." — [CMU RI](https://www.ri.cmu.edu/publications/helping-visually-impaired-users-properly-aim-a-camera)

**Cutter ve Manduchi, "Towards Mobile OCR: How to Take a Good Picture of a Document Without Sight", DocEng 2015 [ÖZET]**: tam metin CloudFront tarafından engellendi.
- Deneysel yazılımla sözlü yönlendirmenin OCR'da okunabilir görüntü elde etmeye katkısı incelenmiş. Arama özetine göre 12 kör katılımcıda yönlendirme kullanılabilir görüntü için gereken süreyi anlamlı ölçüde kısaltmış. Bu rakam tam metinde doğrulanmadı. — [researchr](https://researchr.org/publication/CutterM15); [eScholarship](https://escholarship.org/uc/item/9p9902m4)

**Seeing AI belge modu (Chicago Lighthouse eğitim notu, 2019) [TAM METİN]**
- "we need to make sure all four edges of our page are visible... Hold the document... at arm's length while holding your phone close to your chest... it will say things like 'bottom left edge not visible' or 'too close'. Continue to move in the direction it states it can't see. When it can see all four edges it will announce 'hold steady.' Hold still for a few moments while the music plays. Your page is ready when it stops." Okuma sırasında durdurma, ileri ve geri sarma, ayrıca belge hakkında soru sorma ("what is the total?") var. — [Chicago Lighthouse Seeing AI](https://chicagolighthouse.org/wp-content/uploads/2019/09/Seeing-AI-B.pdf)

**Ek çalışmalar**
- Lee vd., ASSETS 2019 [TAM METİN]: elin konumuna dayalı ses-dokunsal geri bildirimle 9 görme engelli katılımcıda nesnenin kadraja girmediği fotoğraf oranı "2% in the vanilla and 8% in the cluttered" ortamda kalmış. — [Lee vd. 2019](https://par.nsf.gov/servlets/purl/10180846)
- Sanketi ve Coughlan, ASSETS (anti-blur) [TAM METİN]: hareket bulanıklığı OCR'ı bozuyor (örnek: "MIOHANICAL"). İvmeölçerdeki sarsıntı bulanıklıkla iyi ilişkili; ileride sesli ya da dokunsal uyarı verilmesi öneriliyor. — [PMC4778956](https://pmc.ncbi.nlm.nih.gov/articles/PMC4778956/)

### Inferences
- Matematik sorusu çekme akışı için önerilen sıra: (1) "Kâğıdı masaya koy, telefonu ortasına yakın tut, yavaşça kaldır"; (2) kenar algılama ve eksik kenarın sözlü bildirimi ("sol alt köşe görünmüyor", "çok yakın", "biraz sağa"), en fazla 1–3 sn aralıkla; (3) dört kenar görününce "sabit tut" ve kısa bir müzik ya da ton; (4) otomatik çekim; (5) bulanıklık veya karanlık kontrolü yapıp gerekirse "bulanık çıktı, tekrar dene"; (6) OCR sonrası kısa özet: "Bir soru buldum: ... Doğru mu?"
- Kişisel tercih farkları büyük. Sözlü talimat, ton ve titreşim modları seçilebilir olmalı; toplum içinde ya da sınıfta sessiz mod (yalnız ton ve titreşim) seçeneği bulunmalı.

### Gaps
- Cutter ve Manduchi'nin tam metni ve sayısal sonuçları okunamadı.
- Seeing AI'ın güncel Android belge modu davranışını anlatan resmi Microsoft belgesi okunmadı; kaynak 2019 tarihli bir eğitim notu.

## 5. Android TalkBack ile uygulama TTS'inin birlikte çalışması, ses odağı ve ducking, yankı (AEC), dokunsal geri bildirim

### Takeaway
Android'de bir uygulamanın kendi TTS'i ile TalkBack'in aynı anda konuşmasını önleyen resmi bir "self-voicing" kılavuzu bulunamadı. Resmi belgelerden çıkan kurallar şunlar. `announceForAccessibility` API 36'da kullanımdan kaldırıldı; anlam UI üzerinden aktarılmalı. Konuşma içeriğinde `CONTENT_TYPE_SPEECH` kullanılmalı. Kısa sesli yanıtlar için `AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK` ya da transient focus istenmeli. AEC yalnızca destekleyen cihazlarda var ve `isAvailable()` ile kontrol edilmeli. TalkBack'in kendi "Audio ducking", "Sound feedback" ve "Vibration feedback" ayarları kullanıcı tarafında bulunuyor.

### Cited Findings
- `announceForAccessibility`: "This method was deprecated in API level 36. Use one of the methods described in the documentation above to semantically describe UI instead of using an announcement, as accessibility services may choose to ignore events dispatched with this method." [TAM METİN] — [Android View API](https://developer.android.com/reference/android/view/View#announceForAccessibility(java.lang.CharSequence))
- Ses odağı: "For example, for apps that play speech, specify CONTENT_TYPE_SPEECH." Seçenekler: "AUDIOFOCUS_GAIN, AUDIOFOCUS_GAIN_TRANSIENT, AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK, or AUDIOFOCUS_GAIN_TRANSIENT_EXCLUSIVE". Android 12 ve sonrasında "The system forces audio playback from an app to fade out when another app requests audio focus." [TAM METİN] — [Android audio focus](https://developer.android.com/media/optimize/audio-focus)
- Otomatik ducking (Android 8+): ikinci uygulama `AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK` istediğinde birinci uygulama kısılıyor. Koşul: birinci uygulamanın içeriği `CONTENT_TYPE_SPEECH` olmamalı. "automatic ducking is not performed when the user is listening to speech content, because the user might miss some of the program. For example, voice guidance for driving directions are not ducked." [TAM METİN] — [Android audio focus](https://developer.android.com/media/optimize/audio-focus)
- AEC: "Acoustic Echo Canceler (AEC) is an audio pre-processor which removes the contribution of the signal received from the remote party from the captured audio signal... To attach the AcousticEchoCanceler to a particular AudioRecord, specify the audio session ID... On some devices, an AEC can be inserted by default in the capture path by the platform according to the MediaRecorder.AudioSource used." `isAvailable()`: "Checks if the device implements acoustic echo cancellation." [TAM METİN] — [Android AcousticEchoCanceler](https://developer.android.com/reference/android/media/audiofx/AcousticEchoCanceler)
- TalkBack kullanıcı ayarları: "Verbosity... Custom, high, low", "Sound feedback, Sound feedback volume, Voice selection, Audio ducking, Vibration feedback On, off" [TAM METİN]. — [Google TalkBack ayarları](https://support.google.com/accessibility/android/answer/6006589?hl=en)
- Geliştirici forumundan (resmi değil) [ÖZET]: TTS `AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK` ile çalarken diğer uygulama bazen kısılıyor, bazen duruyor. STT sırasında focus isteği `LOSS_TRANSIENT` oluşturup tanımayı kesebiliyor. Bazı cihazlarda tanıyıcının bip sesini kapatan ekstralar yok sayılıyor. — [GitHub android/media-samples #116](https://github.com/android/media-samples/issues/116)
- Eski eyes-free-dev tartışması [ÖZET]: kendi sesini kullanan bir uygulamada çift konuşmayı önlemek için erişilebilirlik olaylarını bastırma önerilmiş. Bu, TalkBack kullanıcısı için riskli bir geçici çözüm. — [Google Groups eyes-free-dev](https://groups.google.com/g/eyes-free-dev/c/DN5FXGmyJWg)
- TalkBack'in açık olup olmadığı `AccessibilityManager.isTouchExplorationEnabled` ile tespit edilebiliyor (üçüncü taraf örnek) [ÖZET]. — [GitHub TapTargetView #370](https://www.github.com/KeepSafe/TapTargetView/issues/370)
- Dokunsal: Jayant vd.'de titreşim ipucu 118 kişiden 28'inin tercihi. PortraitFramer'da titreşimlere perde eklenmesi 6 katılımcı tarafından beğenilmiş [TAM METİN]. — [Jayant vd. 2011](https://cs.rochester.edu/hci/pubs/pdfs/supporting-blind-photography.pdf)

### Inferences
- TalkBack açıksa uygulama TTS'i ve TalkBack çakışabilir. Önerilen yaklaşım: uygulamanın ana içeriğini (çözüm anlatımı) kendi TTS'i okusun; butonlar ve durumlar standart erişilebilirlik etiketleriyle TalkBack'e bırakılsın. Erişilebilirlik olaylarını bastırmak yerine, TalkBack açıkken kullanıcıya "uygulama sesi" ile "TalkBack ile oku" arasında seçim sunulmalı. Bu bir çıkarım; Google'dan resmi bir doğrulama bulunamadı.
- Yankı (TTS'in mikrofona girmesi): sürekli dinlemede TTS konuşurken ya tanıma durdurulmalı (yarım çift yönlü) ya da `VOICE_COMMUNICATION` kaynağıyla AEC etkinleştirilip sadece kısa bir "dur" komutu dinlenmeli. AEC her cihazda bulunmadığı için kulaklık kullanımı önerilebilir. Abdolrahmani vd.'deki kullanıcılar zaten gürültüde kulaklık kullanıyordu.
- Uzun bir açıklama sırasında bildirim sesleri kısılmasın, kullanıcı içeriği kaçırmasın diye TTS'e `CONTENT_TYPE_SPEECH` verilmeli. Bu, Android belgesindeki ducking kuralından çıkarılan bir sonuç.

### Gaps
- Google'ın kendi TTS'ini kullanan uygulamalar için TalkBack ile birlikte çalışma kılavuzu bulunamadı.
- Barge-in (kullanıcının TTS'i sözle kesmesi) ve AEC başarımını kör kullanıcılarla ölçen bir çalışma bulunamadı.

## 6. Eller serbest sürekli dinleme, gürültülü sınıf, hatalı tanıma, kısa komutlarda onay, komut keşfedilebilirliği ("yardım"), Türkçe ASR

### Takeaway
Doğrudan kanıt sınırlı. Kör kullanıcılar uyandırma sözcüğünün güvenilmezliğinden ve yanlış tetiklenmeden şikâyetçi; fiziksel tetik tercih ediliyor. Gürültüde tanıma bozuluyor ve hata düzeltme kör kullanıcılar için orantısız bir yük. Türkçe ASR'de sondan eklemeli yapı sözlük dışı kelime sorununu artırıyor; yeni sistemlerde temiz veride WER yaklaşık %4–14. Kısa komutlarda geri okuyarak örtük onay, geri alınamaz eylemlerde açık onay önerilir; bu bir çıkarım.

### Cited Findings
- Uyandırma sözcüğü ve yanlış tetikleme: bkz. Bölüm 1. Sekiz katılımcı tepki vermeme ya da istenmeden etkinleşme yaşamış, bazıları özelliği kapatmış [TAM METİN]. — [Abdolrahmani vd. 2018](https://userpages.umbc.edu/~rkuber/pubs/assets2018.pdf)
- Gürültü: gürültülü ortamda yanlış anlama ve "unexpected action" güveni azaltıyor. Kulaklık mikrofonu "was thought to pick spoken information up more effectively compared to the built-in microphone" [TAM METİN]. — [Abdolrahmani vd. 2018](https://userpages.umbc.edu/~rkuber/pubs/assets2018.pdf)
- Dikte düzeltme yükü (Azenkot ve Lee'den aktarım): "even when using speech input, 80% of participants' time was spent editing the text output by the recognizer" [TAM METİN; ikincil atıf]. — [Abdolrahmani vd. 2018](https://userpages.umbc.edu/~rkuber/pubs/assets2018.pdf)
- Keşfedilebilirlik: VERSE anketinde VA'lar "require minimal to no training" iken ekran okuyucular "having to memorize many keyboard commands or touch gestures" gerektiriyor. VERSE'de kullanıcı okumayı kesip yapısal komutlar verebiliyor ("Read section titles", "Go to web results") [TAM METİN]. — [Vtyurina vd. 2019](https://cs.uwaterloo.ca/~avtyurin/papers/VERSEVtyurinaASSETS2019.pdf)
- Kim (2024): kullanıcı kılavuzları erişilebilir biçimde sunulmadığı ve dinamik hareketlerin süresini anlatmadığı için kullanıcılar hata yapıyor [TAM METİN]. — [Kim 2024](https://par.nsf.gov//servlets/purl/10543242)
- Türkçe ASR [ÖZET; yalnızca arama özetleri, tam metin indirilemedi]: derin öğrenme ve Zemberek dil modeliyle Turkish Speech Corpus'ta WER 8,4 ve CER 2,7; mikrofon korpusunda WER 9,85. — [Görmez, PeerJ CS 2024](https://peerj.com/articles/cs-1981). Whisper ince ayar çalışmasında temel WER test setine göre %4,3–14,2. — [Electronics 2024](https://mdpi-res.com/d_attachment/electronics/electronics-13-04227/article_deploy/electronics-13-04227.pdf). Eski KIT çalışmasında 64K kelimelik sözlükle sözlük dışı oranı yaklaşık %15 tahmin edilmiş. — [KIT ISL](https://isl.anthropomatik.kit.edu/english/878.php)

### Inferences
- Sınıf ortamı için varsayılan mod "bas-konuş" ya da kısa bir tetik (ses tuşu veya kulaklık düğmesi) olmalı; sürekli dinleme isteğe bağlı açılmalı. Dinleme başlayınca ve bitince earcon çalınmalı (Bölüm 3).
- Matematik girdisi için ifade her zaman geri okunmalı ("Anladığım: ikinci dereceden denklem, x kare eksi 5x artı 6 eşittir sıfır"), ardından "Doğru mu?" diye sorulmalı. Sık kullanılan kısa gezinme komutlarında ("tekrar", "dur", "devam") onay istenmemeli; komut yalnızca bir earcon ile kabul edilmeli.
- Komut sözlüğü küçük tutulmalı ve eş anlamlıları kabul etmeli ("tekrar et/tekrarla/bir daha"). "Yardım" komutu bağlama göre en fazla 3–5 komut söylemeli; ilk kullanımda kısa bir sesli tanıtım yapılmalı. "Bekle" ya da uzun bir sessizlik zaman aşımına sayılmamalı.
- Türkçe sayılar ve matematik terimleri ("üssü", "bölü", "karekök") ASR'de sözlük dışı ya da ek hatalarına açık. Android `SpeechRecognizer` için tanıma sonrasında matematiğe özgü bir normalleştirme katmanı ve kısıtlı dilbilgisi düşünülmeli.

### Gaps
- Gürültülü sınıf ortamında kör öğrencilerle sürekli dinleme veya uyandırma sözcüğü üzerine bir çalışma bulunamadı.
- Kısa komutlarda onay stratejilerini (örtük ya da açık) kör kullanıcılarla karşılaştıran bir çalışma bulunamadı.
- Türkçe matematik dikte ya da sesli matematik tanıma doğruluğu üzerine bir kaynak bulunamadı.
- Google'ın Türkçe çevrimdışı ya da çevrimiçi `SpeechRecognizer` doğruluğuna dair resmi bir veri bulunamadı.

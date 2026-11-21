# Matematik şekil, grafik, tablo ve sayı doğrularının görme engelli öğrencilere sözlü betimlenmesi: tam metinden doğrulanmış kurallar, ampirik bulgular ve Türkçe şablonlar

> **Yöntem notu (rapor yazarı için).**
> - Bu oturumda kaynakların çoğu **tam metin olarak okundu**: curl ile indirildi, PDF'ler pdftotext ile metne çevrildi, gerektiğinde sayfa görüntüsü olarak açıldı. Dosyalar şurada: `/tmp/claude-0/-home-user-demo-g-zl-k/3cc8a036-cee7-56b5-90a7-7dc50a0e0eaf/scratchpad/kaynaklar/sekil/`.
> - **[TAM METİN]**: alıntı ya da kural orijinal metinden kelimesi kelimesine aktarıldı. **[ÖZET]**: tam metin okunamadı, bilgi ikincil kaynaktan geliyor. **[YÖNERGE]**: bir kurum ya da standardın tavsiyesi. **[AMPİRİK]**: katılımcılı ya da veriye dayalı çalışma bulgusu. **[ÇIKARIM]**: benim sentezim.
> - **Erişim notu:** `diagramcenter.org` yalnızca HTTP sunuyor. HTTPS sertifikası alan adıyla eşleşmiyor, oturum proxy'si de yalnızca HTTPS destekliyor. web.archive.org bağlantısı da kesildi. Bu yüzden **DIAGRAM Center Image Description Guidelines'ın tam metni, WGBH/NCAM'in kendi sitesindeki birebir kopyasından okundu** (`wgbh.org/ncam-resources/2026-08-19/image-description-guidelines` ve alt sayfaları). Bu sayfalar DIAGRAM içindekiler tablosunun aynısını içeriyor: General Guidelines, Specific Guidelines – Mathematics / Graphs / Tables vb. BANA 2022 de NCAM yönergelerine `http://diagramcenter.org/table-of-contents-2.html#toc` adresinden atıf yapıyor.
> - **Önceki notlarda düzeltilmesi gereken hatalar** (`Görme engellilere sözlü soru anlatımı/sekil_grafik_betimleme.md`):
>   1. NCAM "Math Images" sayfasındaki "proper terms kullanma, öğeleri betimle" örneği **kesir modeli değil, doğru parçası / ışın / doğru cevap seçenekleri** örneği. Kesir modeli kuralı NWEA'da (Şekil 3.34).
>   2. BANA'da "§7.2.4: okuyucunun veri çekmesi gerekiyorsa betimleme" ifadesi 2022 tam metninde **bulunamadı**. Asıl ilgili kural **BANA 1.6** (aşağıda).
>   3. Smarter Balanced için "Do not create sentences when information is missing" ifadesi okunan (Connecticut/Cambium) sürümde **bulunamadı**.
>   4. NSF çalışması artık tam metinden okundu (Q3).

---

## Q1. DIAGRAM Center ve WGBH NCAM yönergeleri matematik görselleri için tam metinde ne diyor?

### Takeaway
DIAGRAM/NCAM'in özü şu: **kavramı açıklama, şeklin parçalarını betimle.** Betimleme kısa, özgül ve doğrusal olmalı (soldan sağa; madde işaretli ya da satır satır). Başlıkta ya da metinde zaten verilen bilgi tekrarlanmaz. Önce özet verilir, sonra ayrıntı ve veri ("drill-down"). Çubuk, çizgi ve pasta grafikleri tabloya çevrilir. Renk ve çizgi stili ancak soru bunlara atıf yapıyorsa söylenir. Koordinat grafiğinde: grafik türü → eksenler (etiket ve aralık) → noktalar madde madde.

### Cited Findings
- [TAM METİN][YÖNERGE] DIAGRAM Mathematics, "1. Graphs": *"State what type of graph is shown. Describe the x-and y-axes and what they represent. Write out the points in bullet form. Depending on how important the data points are to the central teaching point of the figure, the comma between the x- and y-coordinate may be written out as the word comma."* Örnek betimleme: *"A line graph shows the x-axis is labeled Volume in cubic centimeters and goes from 0 to 10. The y-axis is labeled Mass in grams and goes from 0 to 10. … There are 5 points plotted on the line, which rises steadily from left to right. (2, 2). (4, 4). (5, 5). (7, 7). (10, 10)."* — [DIAGRAM Specific Guidelines – Mathematics (WGBH kopyası)](https://www.wgbh.org/ncam-resources/2026-08-21/specific-guidelines-mathematics)
- [TAM METİN][YÖNERGE] DIAGRAM Mathematics, "2. Math Diagrams": *"Break the information into a bulleted list for easier navigation. Spell out abbreviated units for clearer audio pronunciation. Describe the parts of the image rather than explain the concept. That is done in the surrounding text."* Sayı doğrusu örneği: *"Diagram A shows a number line that goes from 0, the start, to 6, the finish. A vector arrow goes from 0 to 4 and is labeled 4 kilometers."* — [DIAGRAM Mathematics](https://www.wgbh.org/ncam-resources/2026-08-21/specific-guidelines-mathematics)
- [TAM METİN][YÖNERGE] DIAGRAM Mathematics, "3. Geometry" (NCAM Example H ile aynı metin): *"Traditional descriptions of math diagrams benefit from descriptions that are brief and specific. Organize the description in a linear fashion, in this case, moving left to right and use bullet points or line breaks to aid in navigation. Notice that the caption has already described how Greg is using the mirror to see the flagpole. The description, then, should focus on what is not included in the caption, i.e., the points and lines. … What they agreed upon was the use of short sentences that focused on the data."* Örnek geometri betimlemesinden: *"Greg's feet are at point G. The mirror is 8 feet to his right at point M. The base of the flag pole is 24 feet to the right of point M and labeled point F. … This is the vertical leg of a right triangle. The hypotenuse connects Greg's eye to point M … A similar triangle is formed from point M …"* — [DIAGRAM Mathematics](https://www.wgbh.org/ncam-resources/2026-08-21/specific-guidelines-mathematics); [NCAM Effective Practices – Standard Diagrams and Illustrations](https://www.wgbh.org/ncam-resources/2026-08-25/effective-practices-for-description-of-science-content-standard-diagrams-and-illustrations)
  - Dikkat: Bu örnek bir **ders kitabı** betimlemesi ve "right triangle", "similar triangle" gibi çıkarımsal terimleri açıkça kullanıyor. Benzerlik sorulan bir değerlendirme sorusunda bu terimler cevabı verir (bkz. Q2).
- [TAM METİN][YÖNERGE] DIAGRAM, denklemler: *"rendering the math in an unambiguous form, using MathML or (for some audiences) LaTeX, which can be then translated into speech in a variety of styles, should be the preferred practice."* Pedagojik not: *"a teacher may want a student to hear "X superscript two" as opposed to "X squared" in order to test comprehension of math notation."* Sesli okumada: *"it is best for the reader to be a subject expert who can read the math in a clear, unambiguous manner."* — [DIAGRAM Mathematics](https://www.wgbh.org/ncam-resources/2026-08-21/specific-guidelines-mathematics)
- [TAM METİN][YÖNERGE] DIAGRAM General Guidelines, bağlam: *"Is it part of an assessment or activity? If so, be sure to describe the specific pieces of information needed to complete the task."* Öz: *"More is NOT better – be succinct. Don't repeat information presented in the main or adjacent texts. … Include color only when it is significant … Avoid introducing new concepts or terms."* Nesnellik: *"Describe only what you see … Don't interpret or analyze the material. Instead, allow readers to form their own opinions."* Genelden özele: *"Start with high-level context, and then drill down to details … Segment content into logical, digestible chunks."* Dil: *"Use active verbs in the present tense. … Apply the same writing style and terminology as the surrounding text. Write out abbreviations and symbols to ensure proper pronunciation by screen readers."* — [DIAGRAM General Guidelines (WGBH kopyası)](https://www.wgbh.org/ncam-resources/2026-08-20/general-guidelines)
- [TAM METİN][YÖNERGE] DIAGRAM General Guidelines, açıklanmamış etiketler: *"In the graph there are numbers in parentheses that are not explained in the caption or the surrounding text. They should not be ignored in the description. Include them but do not guess at or assume their meaning."* — [DIAGRAM General Guidelines](https://www.wgbh.org/ncam-resources/2026-08-20/general-guidelines)
- [TAM METİN][YÖNERGE] DIAGRAM Graphs:
  - Çubuk grafik: *"Bar graphs should be converted into accessible tables. Briefly describe the graph and give a summary if one is immediately apparent. Provide the title and axis labels. It is not necessary to describe the visual attributes of the bars, e.g. dark blue, light blue, unless there is an explicit need such as an exam question referring to the colors."*
  - Çizgi grafik: aynı kural, ek olarak *"It is not necessary to describe the visual attributes of the lines, e.g. solid, dashed, unless there is an explicit need."*
  - Pasta grafik: *"Pie graphs should be converted into accessible tables. … It is helpful to list the numbers from smallest to largest, regardless of how they are presented in the image."*
  - Saçılım grafiği: *"Provide the title and axis labels. Identify the image as a scatter plot and focus on the change of concentration. If it is necessary to be more specific, convert the data into an accessible table."*
  - Küçük sınıflar için: *"using the word "about" and not "approximately" for a lower grade level."*
  — [DIAGRAM Specific Guidelines – Graphs](https://www.wgbh.org/ncam-resources/2026-08-20/specific-guidelines-graphs)
- [TAM METİN][YÖNERGE] NCAM Venn: *"Focus on the data in the Venn diagram, not on its appearance. Provide the data in brief statements. Give a summary if one is immediately apparent. Include the caption only if it is not accessible from elsewhere in the text."* Örnek: *"The Venn diagram shows 2 intersecting circles, one labeled Africa 93 and the other labeled Asia 155. The area of intersection is labeled 70."* — [NCAM Effective Practices – Venn Diagrams](https://www.wgbh.org/ncam-resources/2026-08-11/effective-practices-for-description-of-science-content-within-digital-talking-books-venn-diagrams)
- [TAM METİN][YÖNERGE] NCAM tablolar: *"Tables should be presented as properly marked-up HTML tables, providing independent access to the data. In this case, the caption and the question are included in the description. Describing the table itself would be unnecessarily repetitive."* Karmaşık bir tablo üç ayrı tabloya bölünmüş. Tire ve üst simge gibi işaretler kelimeyle yazılmış: *"This is an example of providing greater clarity as opposed to mimicking the exact visuals of the table."* — [NCAM Effective Practices – Tables](https://www.wgbh.org/ncam-resources/2026-08-11/effective-practices-for-description-of-science-content-within-digital-talking-books-tables)
- [TAM METİN][YÖNERGE] NCAM sesli okunan tablo: *"When the information must be read aloud, it is imperative to balance brevity with clarity."* İki sütunlu tablo liste olarak verilebilir. Çok değişkenli tabloda her satır için yalnızca "var" olan özellikler sayılır, çünkü *"To repeat all of the variables for each rock type would be a burden to the student."* — [NCAM PD – Example Data Table](https://www.wgbh.org/ncam-resources/2026-08-21/professional-development-for-educators-example-data-table)
- [TAM METİN][YÖNERGE] NCAM çizgi grafik (değerlendirme örneği): *"If you are reading it aloud, convert the graph brief bullet points … Better yet, would be to convert the graph into an accessible HTML data table."* Sesli okuma seçeneği aralık aralık ilerliyor: *"0 minutes to 10 minutes. Temperature increases from -20C to 0C. Water is solid. 10 min to 20 min. Temperature holds at 0C. …"* — [NCAM PD – Example Line Graph](https://www.wgbh.org/ncam-resources/2026-08-21/professional-development-for-educators-example-line-graph)
- [TAM METİN][YÖNERGE] NCAM pasta grafik, iki örnek:
  1. Basit pastalar listeye çevrilir: *"Ignore extraneous visual elements such as the pictures of the cat and the dog, the 3D shape of the pie charts and the red lines."*
  2. Soru görsel kalabalığı ayıklama becerisini ölçüyorsa *"if we apply the typical description solution, we will defeat the purpose of the question. Therefore, considering the context, we should include some of the visual clutter in our description."*
  — [NCAM PD – Example Pie Charts](https://www.wgbh.org/ncam-resources/2026-08-21/professional-development-for-educators-example-pie-charts)

### Inferences
- [ÇIKARIM] DIAGRAM/NCAM kuralları **öğretim materyali** için yazılmış. "Summary if immediately apparent" ve "right triangle / similar triangle" gibi yorum içeren ifadeler bir sınav sorusunda cevabı verebilir. Sınavda Q2'deki "cue the answer" kuralları önceliklidir.
- [ÇIKARIM] NCAM'in iki pasta örneği önemli bir ilke ortaya koyuyor: **ölçülen beceri neyse, betimleme o beceriyi öğrencinin yerine yapmamalı.** Görsel ayıklama ölçülüyorsa kalabalık da betimlenir.

### Gaps
- `diagramcenter.org` orijinal sayfaları doğrudan açılamadı. WGBH kopyasının birebir aynı olduğunu varsaydım; içindekiler tablosu ve örnekler önceki arama özetleriyle örtüşüyor.
- DIAGRAM "Specific Guidelines – Tables" sayfasının metni çekildi ama gövde boş geldi (dinamik içerik). Tablo kuralları NCAM Tables ve PD sayfalarından alındı.

---

## Q2. Değerlendirme (sınav) bağlamında: NCAM "Describing Images for Enhanced Assessments", NWEA, Smarter Balanced, BANA ve UK STA cevabı vermeme hakkında ne diyor?

### Takeaway
Tüm kaynaklar ortak bir çizgide buluşuyor. **Betimleme cevaba ipucu vermemeli.** Cevap seçeneklerindeki görseller **aynı üslupta, benzer uzunlukta, benzer sıfat sayısı ve cümle yapısıyla** betimlenmeli. Hiçbir iki seçeneğin betimlemesi aynı olmamalı. Ölçülen kavramın terimi (ör. "doğru parçası") yerine şeklin **öğeleri** söylenmeli. Cevabı vermeden betimlenemeyen sorular için NWEA "visual bias" etiketi verir ve soruyu dokunsal grafik olmadan sınavdan çıkarır. BANA 1.6 dokunsal grafik ister. İngiltere STA'da gözetmen diyagramı yalnızca gösterir: sembol adlarını okumaz, bilgiyi yorumlamaz.

### Cited Findings
**NCAM – Describing Images for Enhanced Assessments**
- [TAM METİN][YÖNERGE] *"4. Test Integrity: Access Without Giving Away the Answer. The goal of any assessment is to measure the student's knowledge of the material and therefore, image descriptions cannot unintentionally point to the correct answer. … it is preferable that images descriptions become part of the test creation process and not a "bolt-on" accommodation … It is vital to check that all images in a test item, including answer choices, are described in as much the same style as possible. This includes using similar types and number of adjectives and comparable length of descriptions to avoid unintentionally signally differences between the images."* — [NCAM, Guidelines for Describing Images for Assessments](https://www.wgbh.org/ncam-resources/2026-08-07/describing-images-for-enhanced-assessments-guidelines-for-describing-images-for-assessments)
- [TAM METİN][YÖNERGE] *"3. Equivalent Does Not Mean Exactly The Same … the student with visual or print disabilities should be given an equivalent experience, i.e., a quick summary, rather than all of the visual details of the image."*
- [TAM METİN][YÖNERGE] *"Since fatigue is a major factor in test performance, it is very important to avoid anything that will further slow down the student."*
- [TAM METİN][YÖNERGE] Öğrenci sınava betimleme üslubunu tanıyarak girmeli: *"the next best option is for the test itself to provide a primer on the image description techniques."*
- [TAM METİN][YÖNERGE] Kalite kontrol: *"Descriptions should be reviewed by someone who has not seen the image, to ensure clarity and effectiveness."* Üç temel soru: *"Why is the image there? Who is the intended audience? If there is no description what will the viewer miss?"*
  — Son dört maddenin kaynağı: [aynı sayfa](https://www.wgbh.org/ncam-resources/2026-08-07/describing-images-for-enhanced-assessments-guidelines-for-describing-images-for-assessments)
- [TAM METİN][YÖNERGE] NCAM **Math Images** (değerlendirme örnekleri) — [NCAM PD – Math Images](https://www.wgbh.org/ncam-resources/2026-08-21/professional-development-for-educators-math-images):
  - **Sayı doğrusu:** *"A number line measures 3.6 to 4.1 The following numbers are labeled: 3.6, 3.7, 3.8, 3.9, 4.0, 4.1. Each of the labeled numbers are separated by three equally spaced marks. There is a dot on the first mark after 3.9"*
  - **Boşluklu denklem:** *"Since the item refers to a "missing symbol," we chose to be literal in our description."* Varyant: *"This equation is missing a symbol: the fraction 3 over 8, blank, the fraction 7 over 16."*
  - **Geometri:** *"the describer should assume that the student has a familiarity with common geometric shapes and concepts such as triangles, cylinders, hexagons … it is not necessary to define a hexagon in this description, furthermore this item is testing the student's knowledge of perimeters and not of hexagons."* Betimleme: *"A hexagon with sides of the following lengths, moving clockwise from the top: 7cm, 5cm, 5cm, 7cm, 5cm, 5cm."*
  - **Doğru parçası seçenekleri (paralel seçenek kuralının en net örneği):** *"The key to this description is to describe each of the four choices as equally as possible without giving away the answer. Obviously, none of the answer choices can be described as a "line segment" since that would instantly reveal the correct answer. Similarly, if geometry terms were used for three of the answer choices (e.g., a line, a ray) but the line segment was described as "a line with dots on each end," that difference would suggest the answer. As a result, all four images should be described without using proper terms but rather by describing their elements."* Seçenekler: *"A line with a dot on both ends. A line with outward pointing arrows on both ends. A line with a dot on the left end and an outward pointing arrow in the right end. A line without dots or arrows on either end."*
  - **Çark (spinner):** renkler, soru bunları gerektirdiği için verilmiş: *"A spinner is divided into 8 even sections. … The colors are in the following order moving clockwise from the top: Pink, Blue, Green, Pink, Pink, Green, Pink, Blue."*

**NWEA Image Description Guidelines for Assessments (2021, NCAM ile birlikte)** — [NWEA PDF](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf)
- [TAM METİN][YÖNERGE] Integrity and Fairness, Asset Image: *"a. Make sure the image description contains all the vital information students need to access and answer the question. b. Make sure the image description does not cue the answer. c. Make sure the image description reflects the distractors in the item."*
- [TAM METİN][YÖNERGE] Answer Option Images: *"a. Keep image descriptions of answer options consistent in length, language complexity, and sentence structure. b. Respect the rationales behind the answer options … c. Make sure the image descriptions for answer options are unique within the item; no two image descriptions in an item may be identical. d. Be cognizant of how multiple image descriptions in the answer options may add to the cognitive load."*
- [TAM METİN][YÖNERGE] Brevity / ortak özellikler: *"if an item presents four similar graphs in the answer options, first give an overarching description of the characteristics that are shared between the graphs … Then, within each answer option, describe only the unique characteristics of each graph."*
- [TAM METİN][YÖNERGE] Dil: *"Avoid vision-centric language, such as "U-shaped" … Use simple, grade-appropriate, subject-related language. Where possible, use language that is in the item itself."* Drill-down: *"Start with the title, give a brief summary of the image, and then provide specific data or descriptions, if necessary."*
- [TAM METİN][YÖNERGE] Visual bias ölçütleri:
  - *"If the image description gives away the answer to the item and there is no other way to describe the image appropriately, then the item has visual bias and should not be included in assessments for students who are blind."*
  - *"When the descriptions of two or more answer options are identical and cannot be reworded clearly to make them different, the item has visual bias."*
  - *"If the image needs so much description that students would be unable to keep track of the information … the image has visual bias."*
- [TAM METİN][YÖNERGE] Dokunsal grafikle birlikte: *"the descriptions will need less detail … should succinctly describe the shape and parts to act as a guide as students navigate the tactile graphic."*
- [TAM METİN][YÖNERGE] Biçim:
  - *"When an image can be succinctly described within 150 characters, use alt text"*. Daha uzunsa longdesc kullanılır, kısa bir alt metinle birlikte ("A diagram", "A graph").
  - *"Remember to end each line with a period so the screen reader will pause."*
  - *"Instead of using a hyphen or en-dash between numbers to show a range … use the word "to" or "through"."*
  - *"For negative numbers, use the word "negative" … use the word "positive" in instances where there are both negative and positive numbers in the same item."*
  - *"Space out letters used to name shapes … "Triangle A B C""*; *"Spell out symbols (e.g., write π as "pi")"*.
  - Birimler: metin yalnızca "cm" kullanıyorsa betimleme de "cm" kullanır; betimleme ile soru metni okunuşta tutarlı olmalı.
- [TAM METİN][YÖNERGE] NWEA "Visual Bias in Math Item Types": aşağıdakiler kör öğrenciye yönelik sınava dokunsal destek olmadan konmamalı:
  - geoboard, üç ya da daha fazla eğrili grafik, takip edilecek veri miktarı büyük olan sorular
  - kare sayarak çevre ya da alan bulma
  - **denk kesirleri hizalamayla gösteren sayı doğruları**
  - döndürme ve dönüşüm, açınımdan cisim, kesit alma, şekil birleştirme, şekil eşleme
  - görsel uzunluk karşılaştırma
  - **0'dan başlayıp tam sayıda biten cetvel ölçümü** (*"the image description would immediately cue the answer"*)

**BANA Guidelines and Standards for Tactile Graphics (2022)** — [BANA 2022 PDF](https://www.brailleauthority.org/sites/default/files/tg/Tactile%20Graphics%20Standards%20and%20Guidelines%202022_a11y.pdf)
- [TAM METİN][YÖNERGE] **1.6:** *"If there are questions asked about an image that cannot be described without giving away the answer, a tactile graphic should be included."*
- [TAM METİN][YÖNERGE] **1.7:** *"Graphs should be presented as a tactile graphic rather than presenting the data as a list. Tactile representations provide a clearer comparison of information, as in a pie chart or a plotted line graph, rather than comparing only numbers."* NCAM/DIAGRAM'ın "tabloya çevir" önerisiyle **gerilim içinde**. BANA dokunsal üretim açısından yazıyor.
- [TAM METİN][YÖNERGE] **1.4:** *"Some complex diagrams will never provide meaningful tactile information."*
- [TAM METİN][YÖNERGE] **1.8 Karar ağacı** (sayfa görüntüsünden okundu):
  1. "Is the information a repeat of facts in the text?" Evet ise grafik üretme.
  2. "Would the information be more meaningful in text form?" Evet ise grafik üretme.
  3. "Does the graphic require the reader to use visual discrimination or visual perception?" Evet ise grafik üretme.
  4. "Does the reader need the information from a map, figure, or graph to participate in discussions, answer questions, complete a task?" Evet ise grafik üret.
- [TAM METİN][YÖNERGE] **2.15:** *"When writing transcriber's notes, use vocabulary appropriate to the grade level and subject matter of the text. Use terminology from surrounding text. … Example: If the surrounding text calls the graphic a circle graph, do not refer to it using another term, such as pie chart."*
- [TAM METİN][YÖNERGE] **5.4.1:** betimleme *"should be as brief as possible using the vocabulary appropriate to the grade level and subject matter of the text."*
- [TAM METİN][YÖNERGE] **9.6.2:** *"The transcriber's or producer's note, the image description, and the text from the original material should not be repetitive or verbose, yet must provide sufficient information for the tactile to be understood on its own."*
- [TAM METİN][YÖNERGE] **2.12:** *"If the reader is required to measure a line or an object, the line or object should not be lengthened or enlarged … If the reader is required to measure an angle, the rays should be drawn long enough for ease of measurement with a braille protractor."*

**Smarter Balanced Read Aloud Guidelines (Connecticut/Cambium sürümü)** — [Smarter Balanced Read Aloud Guidelines PDF](https://ct.portal.cambiumast.com/content/contentresources/en/Smarter-Balanced-Read-Aloud-Guidelines.pdf)
- [TAM METİN][YÖNERGE] *"Before describing an image or graphic, the human reader should determine whether the details of the picture are necessary to understanding and responding to the item(s). … Typically, diagrams are imperative to student understanding and should be read in a logical order. Describe the image/graphic/diagram as concisely as possible following a logical progression. … Read the title or caption, if available. Any text that appears in the body of the image/graphic/diagram may be read to a student. … Often the reader moves top to bottom, left to right in a clockwise direction, or general to specific."*
- [TAM METİN][YÖNERGE] *"Do not paraphrase, interpret, define, or translate any items, words, or instructions as this would be a violation of test security."*; *"Avoid gesturing, head movements, or any verbal or non-verbal emphasis on words not otherwise emphasized in text."*
- [TAM METİN][YÖNERGE] Tablo: *"Read title. Total up the columns and rows. Read column/row headings. Read cell values."* Örnek: *"The title of the table is Results from School Walk-a-Thon. The table has 2 columns and 4 rows. From left to right, the column headings read … From left to right the first row reads thirty, one hundred twelve. The second row reads …"*
- [TAM METİN][YÖNERGE] Sembollerin okunuşu (Tablo 4):
  - "∥" → *"line segment AB is parallel to line segment CD"*
  - "⊥" → *"perpendicular to"*
  - "≅" → *"angle A B C is congruent to angle D E F"*
  - koordinat → *"'A' (pause) negative three comma negative four"*
  - ölçü birimi kısaltmaları tam okunur: *"10 cm needs to be read as "ten centimeters.""*
- [TAM METİN][YÖNERGE] Öğrenci betiği: *"Sometimes there may be something about a word or phrase that might give you a hint if I read it out loud. In those cases, I will skip the word, point to it on screen … and continue to read."*

**İngiltere STA – KS2 matematik braille sürümü uygulama yönergesi (2025)** — [STA, Administering the braille version, Paper 2](https://assets.publishing.service.gov.uk/media/682de4b6c054883884bff3ab/2025_KS2_mathematics_administering_braille_Paper2_reasoning.pdf)
- [TAM METİN][YÖNERGE] *"If reading to a pupil, you may read words and numbers, but not mathematical symbols. This is to ensure pupils are not given an unfair advantage by having the function inadvertently explained by reading its name."*
- [TAM METİN][YÖNERGE] *"At a pupil's request, you may point to parts of the test paper such as charts, diagrams, statements and equations, but you must not explain the information or help the pupil by interpreting it."*
- [TAM METİN][YÖNERGE] *"You must not explain any subject-specific terminology."* Örnek: *"Question: What does 'quadrilateral' or '>' or '<' mean? Answer: I can't tell you…"*
- [TAM METİN][YÖNERGE] Diyagramlar sözlü betimlenmiyor. Braille dokunsal diyagramlar *"on opposite pages"* veriliyor, gerektiğinde model ya da yedek diyagram kopyası ekleniyor. Gözetmene verilen talimat yönlendirme ile sınırlı: *"Make sure the pupil finds the diagram with the four labelled points on the opposite page."* — [STA braille transcript Paper 2](https://assets.publishing.service.gov.uk/media/682de3d6baff3dab9977517f/2025_KS2_mathematics_braille_transcript_Paper2_reasoning.pdf). Büyük puntolu (MLP) kâğıtlar 18/24/36/48 punto ve uyarlanabilir Word biçiminde veriliyor. — [GOV.UK, KS2 2025 mathematics modified materials](https://www.gov.uk/government/publications/key-stage-2-tests-2025-mathematics-test-modified-materials/modified-large-print-adaptation-guidance)

### Inferences
- [ÇIKARIM] **Kaynaklar arasında açık bir çatışma var: sembol adlarını okumak.**
  - Smarter Balanced "∥"yi "parallel to", "≅"yi "congruent to" diye okutuyor.
  - STA matematiksel sembollerin adının okunmasını yasaklıyor, çünkü işlevi açıklamış olur.
  - Uygulama önerisi: sembolün **anlamı ölçülüyorsa** (ör. "∥ ne demek?") sembol adı söylenmez. Okunması gerekiyorsa tarafsız bir betimleme kullanılabilir: "iki dikey kısa çizgi işareti". Anlamı ölçülmüyorsa okunur.
- [ÇIKARIM] Sesli sınav uygulaması (sınav okuyucusu, TTS) için **dört katmanlı karar sırası**:
  1. Görsel gerekli mi? (Smarter Balanced, NWEA "validity")
  2. Ölçülen beceri ne? Betimleme bu beceriyi öğrencinin yerine yapmamalı (NWEA, NCAM pasta örneği, BANA 1.6).
  3. Seçenekler paralel ve benzersiz mi? (NCAM, NWEA)
  4. Hâlâ ipucu veriyor ya da çok uzunsa: dokunsal grafik ekle ya da soruyu sözlü forma uygun değil diye işaretle (NWEA visual bias, BANA 1.6).

### Gaps
- PARCC/NAEP'e özgü matematik görsel betimleme metni aranmadı (kapsam dışı bırakıldı).
- Smarter Balanced'ın resmi "Guidelines for Image Description / Accessibility Guidelines" ekinin (Appendix) tam metni okunmadı. Yalnızca CT read-aloud sürümü okundu.
- STA'nın braille/MLP üretiminde "not drawn accurately" notunu nasıl aktardığına dair metin bulunamadı. Transkriptte bu ifade geçmiyor.

---

## Q3. NSF destekli uzman geometri betimleme çalışması (par.nsf.gov/servlets/purl/10348278): tam metin

### Takeaway
Doore, Dimmel, Xi ve Giudice'nin (PME-NA 2021) 5 sayfalık **ön çalışmasında**, 4 deneyimli matematik öğretmeni 5 geometri diyagramını görsel erişimi olan ve olmayan öğrenciler için betimledi. Görsel erişimi olmayan öğrenci için **yaklaşık iki kat daha fazla kelime** kullandılar. Yazarlar bu sonucu "double-edged" (iki ucu keskin) olarak niteliyor: daha uzun betimleme daha iyi zihinsel temsil sağlar mı, sorusu açık kalıyor. Makale kodladığı uzamsal kategorilerin **sıklıklarını raporlamıyor**, yalnızca kelime sayısı tanımlayıcıları veriyor.

### Cited Findings
- [TAM METİN] **Künye:** Doore, S. A. (Colby College), Dimmel, J. K. (University of Maine), Xi, R. (Bowdoin College), Giudice, N. A. (University of Maine). "Embedding Expert Knowledge: A Case Study on Developing an Accessible Diagrammatic Interface." *Proceedings of the 43rd Annual Meeting of PME-NA*, Philadelphia, ss. 1759–1763. NSF Award No. 1822800 ("A Remote Multimodal Learning Environment to Increase Graphical Information Access for Blind and Visually Impaired Students"). — [par.nsf.gov PDF](https://par.nsf.gov/servlets/purl/10348278)
- [TAM METİN][AMPİRİK] **Amaç (özetten):** *"examined the language used by instructional experts to describe geometry images to students with and without access to a visual instructional image. Specifically, we investigated expert descriptions of geometry diagrams for 1) spatial information, 2) instructional concept information, and 3) overall description structure (e.g., length, vocabulary, image part/whole order/relationships). We found that experts used nearly twice as many words to describe diagrams in the no visual access condition. We consider the double-edged nature of this result."*
- [TAM METİN] **Kuramsal çerçeve:** diyagramlar sistemik işlevsel dilbilim açısından ele alınıyor: *"diagrams are mathematical texts that use spatial (e.g., orientation, size, position) and graphical (e.g., strokes, congruence markings, labels) resources systemically to communicate mathematical concepts, properties, and relationships (Dimmel & Herbst, 2015)."* Yani eşlik (tick) işaretleri ve etiketler "grafiksel kaynak" olarak tanımlanıyor.
- [TAM METİN] **Uyaranlar:** 5 yatay dijital diyagram. *"congruence (images 1, 2, 3, and 5), parallelism (images 3 and 5), perpendicularity (images 2 and 3), segment-angle relationships (images 1 and 2), and incidence relationships (each image)."* Image 3 "proof without words" (Pisagor kareleri a², b², c²). Image 4 "a primitive example of a coordinate geometry diagram". Şekil 1'in görüntüsünden: Image 1 kesişen iki çember, Image 2 yüksekliği ve dik açı işareti olan ikizkenar üçgen, Image 5 bir kesenle kesilen paralel doğrular. (Bu görsel tanım benim okumam.)
- [TAM METİN] **Protokol, dört soru:** *"How would you describe this image to a student in your class?"*; *"How would you describe the image to a student who you are talking to over a phone or who was listening to a podcast, who cannot see the image?"*; *"What are the most significant mathematical concepts, relationships, or features that need to be described in this image?"*; *"How would you convey the mathematical concepts, relationships, or features to a student … who cannot see the image …?"* Uzmanlar etkilenmesin diye görme yetersizliğinden bilinçli olarak söz edilmemiş.
- [TAM METİN][AMPİRİK] **Katılımcılar ve analiz:**
  - *"Four experienced mathematics teachers (university or secondary; 1/F, 3/M; mean age: 45.8; mean years of experience: 12.3)"*, uzaktan, yaklaşık 30 dakikalık ses kaydı.
  - 80 betimleme (4 uzman × 5 diyagram × 4 soru).
  - NLP hattı ve Cognitive Discourse Analysis (CODA, Tenbrink 2015) temelli anotasyon. Segment tanımı: *"one coherent statement about a single item/space/topic."*
- [TAM METİN][AMPİRİK] **Kelime sayıları (Şekil 2, sayfa görüntüsünden okundu; n = toplam kelime, M = uzman başına ortalama):**

  | Diyagram | Görsel erişim n (M) | Görsel erişim yok n (M) | Kelime/cümle (görsel / yok) |
  |---|---|---|---|
  | 1 (çemberler) | 293 (73.25) | 605 (151.25) | 21.4 / 34.2 |
  | 2 (üçgen, yükseklik) | 395 (98.75) | 560 (186.66) | 21.4 / 25.8 |
  | 3 (Pisagor) | 1127 (108) | 1880 (470) | 23.8 / 21.47 |
  | 4 (koordinat) | 482 (120) | 412 (103) | 14.27 / 23.25 |
  | 5 (paralel + kesen) | 468 (117) | 1382 (345) | 25.05 / 20.4 |

  [ÇIKARIM, benim hesabım] Toplam 2765 kelimeye karşı 4839 kelime, yani yaklaşık 1,75 kat. Diyagram 4'te (koordinat) görsel erişim olmayan koşulda **daha az** kelime kullanılmış. "Nearly twice / sometimes as many as double" genellemesi tüm diyagramlar için geçerli değil. Not: Diyagram 3 ve 2'de tablodaki M değerleri n/4 ile tutarsız (ör. 1880/4 ≠ 470). Kaynak tablo olduğu gibi aktarıldı.
- [TAM METİN][AMPİRİK] Yorum: *"instructional experts used approximately two times the number of total words (n) in the non-visual access condition, including more unique words … This may suggest sighted instructional experts are using different description strategies (e.g., longer descriptions, a larger more diverse vocabulary set, etc.)."*
- [TAM METİN] **"Double-edged" ve açık soru:** *"A critical question raised by these results is: Do longer, more detailed natural language descriptions of diagrams result in more effective mental representations and conceptual comprehension for BVI students?"*
- [TAM METİN] **Öneriler / gelecek çalışma:** *"developing a controlled vocabulary to eventually generate automated descriptions for diagrams to be incorporated into a remote multimodal learning system that uses haptic, auditory, and NL supports."* Makale uygulamaya dönük bir betimleme kuralı önermiyor.

### Inferences
- [ÇIKARIM] Bu bir **vaka çalışması**: n=4 ve öğrenci sonucu ölçülmemiş. Yalnızca "görenler, görmeyen dinleyici için betimlemeyi kendiliğinden uzatıyor" bulgusunu destekler. Uzunluğun yararı ya da zararı test edilmemiş. Emerson ve Anderson'ın (2018) NCAM ile extended koşullarının eşit sonuç vermesi (Q4) aynı soruya ampirik olarak "uzatmak ek fayda getirmedi" yönünde kısmi bir cevaptır.
- [ÇIKARIM] Uzmanların diyagramlarda eşlik, paralellik ve dikliği "temel ilişkiler" olarak seçmesi bir şeye işaret ediyor: betimlemede **işaretlerin (tick, ok, dik açı kutusu) nasıl sözelleştirileceği** temel tasarım kararı. Ancak makale bunun kuralını vermiyor.

### Gaps
- Uzamsal bilgi kategorilerinin (orientation, size, position, part/whole order) sıklıkları ve uzman betimlemelerinden örnek alıntılar makalede **yok**. Daha kapsamlı bir dergi makalesi bulunamadı.

---

## Q4. Emerson ve Anderson (2018, JVIB) ile Rosenblum ve ark. (2020, JVIB): tam metinden kesin bulgular

### Takeaway
Emerson ve Anderson'da (2018a) 44 görme engelli öğrenci dinlediği matematik sayfalarındaki görsellere ilişkin soruları, NCAM tipi betimlemeyle yaklaşık **iki kat** daha iyi cevapladı. Oranlar: kontrol %15,1, kısa %13,6, NCAM %28,8, genişletilmiş %28,6. **Ancak tavan düşük kaldı** ve NCAM'in ötesinde uzatmak fayda getirmedi. Rosenblum ve ark. (2020) 10 TVI'nin (görme engelliler öğretmeni) betimlemelerinin NCAM "altın standart" anahtar öğelerinin **ortalama yalnızca yaklaşık yarısını** içerdiğini (%20–73 arası) ve öğretmenler arasında büyük fark olduğunu gösterdi.

### Cited Findings
**Wall Emerson, R. ve Anderson, D. L. (2018a). "Using Description to Convey Mathematics Content in Visual Images to Students Who Are Visually Impaired." JVIB 112(2), 157–168** — [ERIC tam metin PDF](https://files.eric.ed.gov/fulltext/EJ1175990.pdf)
- [TAM METİN][AMPİRİK] **Yöntem:**
  - 5., 8. ve 11. sınıf Common Core uyumlu ders kitaplarından 11 görsel kategorisi seçildi.
  - Her örnek dört betimleme düzeyinde hazırlandı:
    - **control**: yalnızca "image" kelimesi
    - **terse**: *"there is a line graph"* gibi
    - **NCAM**: *"the current standard protocol for image descriptions as developed by the National Center for Accessible Media"*
    - **extended**: *"any element of the image that the description creator deemed potentially useful to a student"*
  - Betimlemeleri Benetech eğitimli, sertifikalı bir TVI yazdı. Metinler JAWS ve MathML ile seslendirildi.
- [TAM METİN][AMPİRİK] **Katılımcılar ve uygulama:**
  - 44 öğrenci: 25 braille kullanıcısı, 19 az gören; 10–21 yaş, ortalama 16,02; 5. sınıf düzeyinde 3, 8. sınıfta 15, 11. sınıfta 26 öğrenci.
  - Her parça *"never more than half a page in length and never more than 150 seconds long (average length = 50.5 seconds)"*.
  - Deney sayısı: kontrol 148, terse 147, NCAM 151, extended 155.
  - *"No question required mathematical calculations"*: sorular yalnızca görseldeki bilgiyi soruyordu.
- [TAM METİN][AMPİRİK] **Koşullara göre doğru oranı:** *"There was a significant difference in correct answers across description categories, χ2(3) = 17.66, p = 0.001. Students averaged 15.1% correct for the control condition, 13.6% for the terse condition, 28.8% for the NCAM condition, and 28.6% for the extended condition."*
- [TAM METİN][AMPİRİK] **Kategoriye göre doğru oranı (Tablo 5):**

  | Kategori | Doğru oranı |
  |---|---|
  | Sayı doğrusu | 41,0% |
  | Çizgi grafik | 32,8% |
  | Tablo | 32,0% |
  | Şekil | 22,6% |
  | Çubuk grafik | 22,2% |
  | Işın diyagramı | 19,2% |
  | Soruya özgü görsel | 15,1% |
  | Harita | 14,1% |
  | Pasta grafik | 14,0% |
  | Denklem | 5,7% |

  Kategoriler arası fark: χ²(9)=28,43, p=0,001.
- [TAM METİN][AMPİRİK] Öğrenci görüşleri: *"Too much and not enough information were both cited as bad aspects of the descriptions."* En çok istenen destek (Tablo 6): *"Explaining formatting (on page and in graphs)"* (9), ardından ses netliği (7), insan sesi (6), braille sürümü (4), dokunsal grafik (3), *"More lead-in to upcoming graphs"* (1). 24 öğrenci her şeyin betimlenmesini istedi, 13'ü istemedi.
- [TAM METİN][AMPİRİK] Sonuç: *"Descriptions of visual images can communicate important math information, but there are images for which no level of description is sufficient. … Materials should be provided in several formats simultaneously."* Sınırlılıklar: yalnızca üç okul, soruların güçlükleri birbirine eşitlenmemiş.

**Wall Emerson ve Anderson (2018b). "What Mathematical Images Are in a Typical Mathematics Textbook?" JVIB 112(1), 20–32** — [ERIC tam metin PDF](https://files.eric.ed.gov/fulltext/EJ1171951.pdf)
- [TAM METİN][AMPİRİK] *"The second most common area of image categories often contained large amounts of math content but were difficult to describe succinctly or might have been described without including important mathematical information. This grouping included tables, line graphs, and images specifically related to a single question. … Less common image categories such as models, line diagrams, pictures of calculator keys, and number lines lend themselves easily to description."*

**Rosenblum, L. P., Cheng, L., Zebehazy, K., Wall Emerson, R. ve Beal, C. R. (2020). "Teachers' Descriptions of Mathematics Graphics for Students with Visual Impairments: A Preliminary Investigation." JVIB 114(3), 231–236** — [ERIC tam metin PDF](https://files.eric.ed.gov/fulltext/EJ1255993.pdf)
- [TAM METİN][AMPİRİK] **Yöntem:**
  - 10 TVI (hepsi beyaz kadın; 8'i gezici; deneyim 4–25 yıl, ortalama 13,5) 12 matematik grafiğini iki varsayımsal öğrenci için sesli betimledi: sınıf düzeyinde braille okuru ve az gören basılı okur.
  - Altın standart: dördüncü yazarın NCAM yönergeleriyle (Rothberg & Gould 2010) hazırladığı betimlemeler, "anahtar öğe"lere ayrıldı.
  - Örnek, 6 anahtar öğe: *"There is a bar graph titled Lengths of Five White Sharks. Five blue bars labeled A, B, C, D, and E show the lengths of five white sharks in meters. A is 2.5, B is 3, C is 4, D is 5.5, and E is 6.5."*
  - Grafik başına ortalama 11,3 anahtar öğe (4–20). Puanlama öğe başına 0 / 0,25 / 0,5 / 0,75 / 1.
- [TAM METİN][AMPİRİK] **Bulgular:**
  - *"Across all 12 descriptions, only about half of the key elements in the NCAM descriptions were included in the descriptions provided by the teachers."*
  - Öğretmen ortalamaları %20,40 ile %72,91 arasında (Tablo 1). Fark anlamlı: F(9,220)=12,86, p<.001.
  - *"There was no difference in the inclusion of key elements in the descriptions provided for print readers or braille readers."*
  - Keşif önerisi: braille okuru için grafik başına 4,97, basılı okur için 4,47.
  - Soru kullanımı düşük: 4 öğretmen hiç soru sormadı, soruların %82'si 2 öğretmenden geldi, üst düzey soru yok.
  - Zorluk puanı: braille için 2,75, basılı için 2,35. *"Each of the 12 graphics was rated as very easy by at least one teacher, whereas others rated the same graphic as very difficult."*
  - NCAM'e aşinalık: yalnızca 1 öğretmen sık başvuruyordu, 3'ü incelemişti, 4'ü duymuş ama incelememişti, 2'si hiç duymamıştı. 4 öğretmen BANA'ya atıf yaptı.
- [TAM METİN] Öğretmen talebi: *"one page with quick pointers on descriptions to help keep [me] on track for do's and don'ts."* Sınırlılıklar: küçük örneklem, varsayımsal öğrenci, betimlemelerin etkisi öğrencide ölçülmedi.

### Inferences
- [ÇIKARIM] Bu iki çalışma, standart ve kontrol listesine dayalı bir **şablon** yaklaşımını güçlü biçimde destekliyor. Gerekçeleri:
  1. NCAM düzeyi betimleme "image / grafik var" düzeyinin yaklaşık iki katı başarı getiriyor.
  2. NCAM'in ötesine uzatmak ek fayda getirmiyor (%28,8'e karşı %28,6).
  3. İnsan betimleyiciler kendiliğinden anahtar öğelerin yalnızca yaklaşık yarısını söylüyor ve kendi aralarında çok farklılaşıyor.
- [ÇIKARIM] Öğrencilerin "biçimi açıkla" ve "grafiğe giriş" talebi NCAM'in "primer" önerisiyle örtüşüyor. Betimlemeye **yapı bildirimiyle** başlamak gerekir ("Bir tablo: 2 sütun, 4 satır", "Bir koordinat düzlemi…").
- [ÇIKARIM] Denklem (%5,7) ve pasta grafik (%14) düşük çıktı. Denklemler düzyazı betimleme yerine yapılandırılmış matematik okuma (MathML benzeri tutarlı okuma kuralları) ile verilmeli. Pasta grafik tablo ya da liste olarak verilmeli.

### Gaps
- Emerson ve Anderson'da betimleme koşullarının kelime uzunlukları raporlanmamış. Kategori × koşul kırılımı da yok.
- Rosenblum ve ark.'nın 12 grafiğinin tam listesi ve NCAM metinleri makalede yok.

---

## Q5. Belirli öğeler için kesin kurallar: dik açı işareti, eşlik çizgileri, paralel oklar, açı yayları, etiketler, "ölçekli değildir", koordinat, grafikler, sayı doğrusu, Venn, kesir modeli, paralel cevap seçenekleri

### Takeaway
Bulunan **açık kurallar**:
- koordinat düzlemi (NWEA, ayrıntılı)
- çubuk, çizgi, pasta, saçılım, çetele (NWEA, DIAGRAM)
- sayı doğrusu (NCAM, NWEA)
- Venn (NCAM, NWEA)
- kesir modeli (NWEA)
- paralel doğru ve kesen açıları (NWEA)
- çember ve "not drawn to scale" (NWEA)
- seçenek paralelliği (NCAM, NWEA)

**Bulunamayanlar:** Eşlik çizgisi (tick mark), paralellik oku ve açı yayının sözlü okunuşuna dair okunan hiçbir kaynakta (DIAGRAM, NCAM, NWEA, BANA, Smarter Balanced, STA) **açık bir kural yok.** BANA bunları yalnızca dokunsal üretim açısından ele alıyor. NWEA örnekleri dik açı işaretini ve paralelliği yorumlanmış haliyle söylüyor ("forming a right angle", "parallel lines c and d"), çünkü bu bilgiler ölçülen beceri değil, verilmiş bilgi.

### Cited Findings
**Geometri: şekiller, açılar, işaretler**
- [TAM METİN][YÖNERGE] NWEA 2-D, hesaplama soruları: *"a. State the name of the shape and then give more detailed information, such as measurements and labels. b. Make sure the students have all the information they need to solve the problem."* Örnek, **dik açı işareti sözelleştirilmiş**: *"The diagram shows a triangle with a base of 12.5 centimeters. A line runs from the vertex opposite the base to the base, forming a right angle with the base. The line is labeled with a question mark."* — [NWEA](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf) (Şekil 3.27)
- [TAM METİN][YÖNERGE] NWEA Şekil 3.28: *"The diagram shows a right triangle. • One leg (the height) is labeled 11. • One leg (the base) is not labeled. • One leg (the hypotenuse) is labeled x. • The angle opposite the height is 30 degrees."* Kaynakta hata var: hipotenüs "leg" olarak yazılmış. Örnek kopyalanırken düzeltilmeli. — [NWEA](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf)
- [TAM METİN][YÖNERGE] NWEA, şekil tanıma soruları: *"Describe the shape using side and/or angle details."* Seçenekler: *"A shape with 3 sides. All sides are the same length." / "A shape with 4 sides. All sides are the same length." …* Şeklin adı verilmiyor. Eşit kenarlar olgu olarak söyleniyor. — [NWEA](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf) (Şekil 3.26)
- [TAM METİN][YÖNERGE] NWEA 3-D tanıma: *"Describe the shape using the definition of the shape or a close equivalent."* Örnek: *"A shape like a can that has a round flat bottom, a round flat top, and one curved side that is a rectangle."* — [NWEA](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf)
- [TAM METİN][YÖNERGE] NWEA **"not drawn to scale"** ve çember: *"a. Repeat the plain text to set up the description as needed. b. Whenever the diagram includes "not drawn to scale," pay particular attention to the actual measurements provided. c. If terms such as "chord" may be a barrier to some students, include a description explaining the term. d. Describe the line segments and then the arc they form."* Örnek: *"Line segment F H is the diameter of a circle with center N. Chord K L is a line segment that goes from point K on the circle to point L on the circle. • Chord K L intersects diameter F H at point G. • Angle F G L intercepts arc F L, which measures 110°."* — [NWEA](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf) (Şekil 3.31)
  - Not: Kural "betimlemeye 'ölçekli değildir' cümlesini koy" demiyor, "verilen ölçülere özellikle dikkat et" diyor. "Not drawn to scale" şekil üzerindeki bir metin olduğu için Smarter Balanced'ın "Any text that appears in the body of the image … may be read" kuralı gereği okunur.
- [TAM METİN][YÖNERGE] NWEA, **paralel doğrular ve kesen**: *"a. Describe each parallel line and the angles created by the intersecting line(s), starting with the upper-left angle and moving clockwise. b. Use the term "blank" to describe the angles that are not labeled in the image, but only if they are related to the skill being assessed … c. … If it is [too long or complex], the item has visual bias."* Örnek: *"The diagram shows parallel lines c and d are intersected by horizontal line h. Four angles are created at each point where line h intersects the two parallel lines. Two angles are labeled. • Where line h intersects line c, the lower-left angle is labeled Y. • Where line h intersects line d, the lower-right angle is labeled 50°."* — [NWEA](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf) (Şekil 3.33)
- [TAM METİN][YÖNERGE] NWEA çember içine çizilmiş şekil: *"A circle is inscribed with Triangle A B C, so the vertices of the triangle are on the circle. Segment A C is a diameter of the circle. Angle C A B is 62°."* Derece sembolü seçeneklerde de geçtiği için korunmuş. — [NWEA](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf) (Şekil 3.32)
- [TAM METİN][YÖNERGE] NCAM altıgen örneği: tutarlı bir başlangıç noktası ve yön kullanılıyor: *"moving clockwise from the top"*. — [NCAM PD – Math Images](https://www.wgbh.org/ncam-resources/2026-08-21/professional-development-for-educators-math-images)
- [TAM METİN][YÖNERGE] BANA (dokunsal): *"When an angle shows a measurement by means of an arc with an arrowhead, the arrowhead should be omitted. The diagram is read more easily if the kind of line used to show measurement is different from the kind of line used for the structure (e.g., dashed versus solid)."* (6.11). *"in braille, the degree symbol may be omitted altogether and a transcriber's note inserted stating that in print the angles are shown in degrees."* (6.11.1.7). Etiketler şekil dışına, 1/8 inç uzağa (6.11.1.5). — [BANA 2022](https://www.brailleauthority.org/sites/default/files/tg/Tactile%20Graphics%20Standards%20and%20Guidelines%202022_a11y.pdf)
- [TAM METİN][YÖNERGE] Harf etiketleri: NWEA *"Triangle A B C," not "Triangle ABC"*. Smarter Balanced: *"triangle A B C is similar to triangle D E F"*. — [NWEA](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf); [Smarter Balanced Read Aloud](https://ct.portal.cambiumast.com/content/contentresources/en/Smarter-Balanced-Read-Aloud-Guidelines.pdf)
- [TAM METİN][AMPİRİK/kuramsal] Doore ve ark.: "congruence markings, labels" diyagramın **grafiksel kaynaklarıdır** ve kavram ile ilişki iletirler. — [par.nsf.gov](https://par.nsf.gov/servlets/purl/10348278)

**Koordinat düzlemi (NWEA)** — [NWEA](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf)
- [TAM METİN][YÖNERGE] Şekiller: *"a. Tell students that the figure is on a coordinate plane. b. Introduce the type of figure or shape. … c. Describe the points on the graph by naming the coordinates for each apex of the figure."* Örnek: *"Triangle T U V is on a coordinate plane. Point T is at negative 5 comma 0. Point U is at negative 2 comma 0. Point V is at negative 2 comma negative 4."*
- [TAM METİN][YÖNERGE] Doğrular: *"b. Describe the number of lines and the shape of each line. c. Describe the slope of each line (positive, negative, etc.). If these terms would cue the answer, consider using phrases such as "decreases from left to right" or "increases from left to right." d. Describe the x- and y-intercepts, from left to right, by giving their coordinates. If the line crosses an axis between grid lines or between integer values, consider giving the integer coordinates of an additional point on the line."* Taralı bölgeli doğrularda ek olarak: *"whether each line is "solid" or "dashed"" … "Describe the shaded area in relation to each line, using language such as "to the right/left of the line" or "above/below the line.""*
- [TAM METİN][YÖNERGE] Noktalar: *"a. Tell students there is a coordinate plane and give a brief description of it to help orient students who may be just starting … b. Use the origin as the point of reference (instead of the axes) to describe the points. c. If there are more than three points, provide a bulleted list with one introductory sentence. d. If a point is on an axis, say it is "on" the axis. Do not say "0 units.""* Örnek: *"Point N: starting at the origin, it is 3 units right and 3 units up. … Point P: starting at the origin, it is 3 units right and on the x-axis."*
- [TAM METİN][YÖNERGE] Parçalı fonksiyon: *"Describe the endpoints (open or closed circles, arrows, etc.), give the coordinates … If the graph shows more than three lines, reduce the cognitive overload by summarizing the trend and giving the left- and right-most step coordinates."* Parabol ve mutlak değer: *"4-quadrant coordinate plane"*. Şeklin adı ipucu veriyorsa "curve" denir.
- [TAM METİN][YÖNERGE] Vektörler: *"goes from (coordinates) to (coordinates)"*, bağlı ya da bağlı olmadığı belirtilir. Trigonometri: *"Name the function, as long as it does not cue the answer. … Give the minimum and maximum values … the number of complete cycles."*

**Grafikler (NWEA)** — [NWEA](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf)
- [TAM METİN][YÖNERGE] Çubuk ve çizgi grafik, veri etiketli çizgiye düşüyorsa:
  - *"a. Briefly describe the chart and give a summary if one is immediately apparent. b. Describe the title and axis labels. Include number ranges … c. Give the number of bars or lines. d. Give the data points in a bulleted list."*
  - Sınıf düzeyine göre eksen dili: alt sınıflarda *"bottom"/"side"*, 4. sınıf ve üstünde *"horizontal axis" / "x-axis"*.
- [TAM METİN][YÖNERGE] Veri çizgiler arasına düşüyorsa:
  - *"i. When students do not need an exact number to answer the question, you may provide the nearest labeled number. ii. When reading the graph is the skill being assessed, explain the position of where the data point or bar lands by using language such as "halfway between 4 and 6." iii. When calculation with the graph data is the skill being assessed, you may provide the exact values or … describe the end position in relation to surrounding numbers."*
  - Örnek: *"Number of Students is on the vertical axis and has lines marking every 10 students, from 0 to 70. … Winter. Grade 4, halfway between 20 and 30. Grade 5, between 10 and 20, close to the line for 20."*
- [TAM METİN][YÖNERGE] Farklı çizgi türleri: *"Describe the shape of each line and/or the trend for each graph."* Örnek: *"A straight line starts at (0, 500) and slopes up to (10, 1,500)."*; *"curves up as the value increases, quickly at first and then more slowly"*.
- [TAM METİN][YÖNERGE] Daire grafiği: *"a. Give the title of the graph and describe how it is divided. b. When the graph is divided into unequal parts, describe the parts from largest to smallest using a bulleted list. c. It is not necessary to describe the colors."* **Çatışma:** DIAGRAM pasta grafikte *"from smallest to largest"* diyor. ([DIAGRAM Graphs](https://www.wgbh.org/ncam-resources/2026-08-20/specific-guidelines-graphs))
- [TAM METİN][YÖNERGE] Saçılım: *"Describe the correlation by telling students if the points are clustered ("one area, tightly grouped"), if they show a trend, or if they are spread out."* En iyi uyum doğrusu *"by stating how many of the points are above, on, and below the line, or by giving the slope. How you describe the line of best fit depends on the skill being assessed."*
- [TAM METİN][YÖNERGE] Çetele: okuma ölçülüyorsa *"Use descriptive language and avoid providing totals. Group tally marks by fives (e.g., describe 13 tally marks as "2 groups of 5 and 1 group of 3")."* Veriyle hesap ölçülüyorsa: *"Provide the total amount of tally marks in numerals."*
- [TAM METİN][YÖNERGE] Resim grafiği: anahtar betimlenir, *"One car picture equals one car."* Yüzlük tablo: *"Give the number range. State which numbers are circled or shaded."*
- [TAM METİN][YÖNERGE] Kutu grafiği: *"This item asks for the median, so the image description cannot state it outright."* Ortanca yerine *"A line divides the box at 21 books."* ifadesi kullanılıyor.

**Sayı doğrusu**
- [TAM METİN][YÖNERGE] NWEA kesirler:
  - *"b. When fractions are the skill being assessed, describe the number line as being divided into equal parts (e.g., "Marks divide the space between each number into 3 equal parts."). c. When fractions are not the skill being assessed, give the divisions between integers in fractions (e.g., "… into thirds."). d. When describing points at a positive number, use the smaller positive number as the anchor (e.g., "The point is at the second mark to the right of 2."). e. … negative number, use the larger negative number as the anchor."*
  - Örnek: *"The number line goes from 0 to 1. Marks divide the space between each number into 4 equal parts. A point is at the third mark to the right of 0."*
  — [NWEA](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf)
- [TAM METİN][YÖNERGE] NWEA eşitsizlik:
  - *"Use the terms "filled-in circle" and "open circle" … Refer to the ray or line segment using the phrase "the number line is shaded." … specify "negative" and "positive" before each mentioned number."*
  - Örnek: *"The number line goes from negative 4 to positive 2 and has 1 shaded section. At negative 4, there is a filled-in circle. At positive 2, there is an open circle. Between negative 4 and positive 2, the number line is shaded."*
  — [NWEA](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf)
- [TAM METİN][YÖNERGE] NWEA nokta grafiği (line plot): *"From left to right, list the number of marks at each point, first stating the number of marks and then stating the number on the number line."* Atlayarak sayma: *"An arrow on a number line skips once, going from negative 8 to negative 6."* — [NWEA](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf)
- [TAM METİN][YÖNERGE] NCAM: etiketli sayılar, aralarındaki eşit aralıklı çentik sayısı ve noktanın konumu ("first mark after 3.9") verilir. Noktanın değeri söylenmez. — [NCAM PD – Math Images](https://www.wgbh.org/ncam-resources/2026-08-21/professional-development-for-educators-math-images)

**Venn ve kesir modeli**
- [TAM METİN][YÖNERGE] NWEA Venn: *"a. Give an overall description of the Venn diagram, focusing on the data, not on the appearance. b. List the contents of each circle and then the area of overlap … c. Provide the data in brief statements."* Taralı Venn: *"Describe the shaded area first so students know what to listen for."* Seçenekler aynı veriyi farklı taramayla gösteriyorsa: *"focus on the differences between the images."* — [NWEA](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf)
- [TAM METİN][YÖNERGE] NWEA kesir modeli: *"a. Describe the shape. b. Describe how the shape is divided. c. Give the number of shaded parts."* Örnek seçenekler: *"A circle is divided into 5 equal parts. 1 part is shaded." … "A circle is divided into 2 equal parts. 1 part is shaded."* Kesir adı söylenmiyor. Eşit olmayan parçalar ayırt edilemiyorsa (ör. "A rectangle is cut into 4 unequal parts" iki seçenekte aynıysa) soru visual bias sayılıyor. — [NWEA](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf)

**Tablo**
- [TAM METİN][YÖNERGE] Sıra: başlık → satır ve sütun sayısı → sütun başlıkları → satır satır değerler. — [Smarter Balanced Read Aloud](https://ct.portal.cambiumast.com/content/contentresources/en/Smarter-Balanced-Read-Aloud-Guidelines.pdf)
- [TAM METİN][YÖNERGE] Erişilebilir HTML tablo tercih edilir. Soru ve başlık zaten tabloyu tanıtıyorsa tablo ayrıca betimlenmez. — [NCAM Tables](https://www.wgbh.org/ncam-resources/2026-08-11/effective-practices-for-description-of-science-content-within-digital-talking-books-tables)

### Inferences
- [ÇIKARIM] **İşaretlerin sözelleştirilmesi için önerilen kural.** Kaynakta yok. NCAM'in "proper terms yerine öğeleri betimle" ve NWEA'nın "cue the answer" ilkelerinden türetildi:
  - (a) İşaretin anlamı **sorulan şey ise** işaret görsel olarak tarif edilir: "AB ve AC kenarlarının her birinin üzerinde birer kısa çizgi var", "B köşesinde küçük bir kare işareti var", "iki doğrunun üzerinde aynı yöne bakan birer ok işareti var".
  - (b) İşaret **verilen bilgi ise** ve soru başka bir şeyi ölçüyorsa, anlamıyla söylenir. NWEA 3.27 ve 3.33 böyle yapıyor: "AB ve AC eşit uzunlukta (eşlik işaretli)", "B'de dik açı var", "c ve d doğruları paralel".
  - (c) Tek bir soruda iki yaklaşım karıştırılmaz.
- [ÇIKARIM] **"Ölçekli değildir"** ibaresi şekil üzerindeyse betimlemenin **başında** söylenmeli. Görünüme dayalı ifadeler ("uzun kenar", "geniş açı") hiç kullanılmamalı. Yalnızca etiketlenmiş ölçüler verilmeli.
- [ÇIKARIM] Etiketlenmemiş bir öğenin yalnızca görünümden çıkarılan özelliği (ör. "neredeyse dik görünen açı") hiçbir zaman söylenmemeli. DIAGRAM: "Describe only what you see… Don't interpret".
- [ÇIKARIM] **Pasta grafik sırası:** DIAGRAM ve NWEA çatışıyor. Sınavda, büyüklük sıralaması sorulan şeyse sıralı liste cevabı verir. Bu durumda NCAM spinner ve Smarter Balanced örneklerindeki gibi **"saat yönünde, en üstten başlayarak"** sıra kullanılmalı ve dilim değerleri ancak etiket olarak yazılıysa okunmalı.

### Gaps
- Eşlik çizgisi, paralellik oku, açı yayı ve çoklu yay (eş açı) işaretlerinin sözlü okunuşuna dair **hiçbir kaynakta açık kural bulunamadı**. Yukarıdaki öneri bir çıkarım.
- Saat kadranı yönelimi ("C noktası saat 3 yönünde") hiçbir matematik betimleme yönergesinde geçmiyor. Kaynakların kullandığı yön dili "clockwise from the top", "upper-left", "from left to right".
- Türkçe matematik betimleme yönergesi ya da Türkçe ampirik çalışma bu araştırmada aranmadı/bulunmadı.

---

## Q6. Her şekil türü için somut Türkçe betimleme şablonları (sınav güvenli)

### Takeaway
Aşağıdaki şablonlar yukarıdaki tam metin kurallarının **Türkçeye uyarlanmış [ÇIKARIM] sentezidir**. Her şablonun dayandığı kural köşeli parantezle belirtildi.

Türkçeye özgü üç uyarlama önemli:
1. **Ondalık virgül çakışması.** Türkçede "2,5" ondalık sayıdır. NWEA'nın "3 comma negative 7" kalıbı doğrudan çevrilemez. Koordinatlarda "x … , y …" ya da "noktalı virgül" kalıbı önerilir.
2. Harf adları ekran okuyucuda "A B C" gibi boşluklu yazılmalı.
3. "Negatif / pozitif" kelimeleri eksi işaretinin yerine kullanılmalı.

### Cited Findings
- [TAM METİN][YÖNERGE] Kaynak kurallar: harfleri boşluklu yaz; "negative" kelimesini kullan; aralıklarda tire yerine "to" kullan; satır sonuna nokta koy; birimleri soru metniyle tutarlı oku. — [NWEA](https://www.nwea.org/uploads/2022/11/Image-Description-Guidelines-for-Assessments_NWEA_2021.pdf). Kısaltmaları tam oku (*"10 cm … "ten centimeters""*). — [Smarter Balanced Read Aloud](https://ct.portal.cambiumast.com/content/contentresources/en/Smarter-Balanced-Read-Aloud-Guidelines.pdf). *"Write out abbreviations and symbols"*. — [DIAGRAM General Guidelines](https://www.wgbh.org/ncam-resources/2026-08-20/general-guidelines)

### Inferences
**[ÇIKARIM] Genel iskelet (tüm türler).** Sıra: drill-down (DIAGRAM/NCAM/NWEA) + yapı bildirimi (Emerson ve Anderson, Tablo 6) + "kavramı açıklama" (DIAGRAM).
1. Kısa tanıtım: "Bir şekil." / "Bir grafik." Soruda adı nasıl geçiyorsa o kelimeyle (NWEA alt text, BANA 2.15).
2. Başlık ya da şekil üzerindeki notlar, "Şekil ölçekli değildir" dahil.
3. Yapı ve özet: kaç öğe var, nasıl düzenlenmiş.
4. Ayrıntılar madde madde, sabit yönde: soldan sağa, yukarıdan aşağıya ya da en üstten başlayarak saat yönünde.
5. Bilinmeyenler ve boşluklar, sorunun kendi kelimesiyle ("soru işareti", "boşluk", "x").

**1. Düzlem geometri: hesaplama sorusu** [NWEA 3.27/3.28; NCAM altıgen]
> "Bir şekil. Şekil üzerinde 'ölçekli değildir' yazıyor. Bir A B C üçgeni.
> • A köşesi üstte, B köşesi sol altta, C köşesi sağ altta.
> • B C kenarının üzerinde 12 santimetre yazıyor.
> • A köşesinden B C kenarına bir doğru parçası iniyor ve B C kenarıyla dik açı yapıyor. Bu doğru parçasının üzerinde soru işareti var.
> • A C kenarının üzerinde 10 santimetre yazıyor."

**2. Geometri: işaretin anlamı ölçülüyorsa (literal sürüm)** [NCAM "proper terms yerine öğeler"; NWEA "cue the answer"]
> "Bir A B C üçgeni. A B kenarının ortasında bir kısa çizgi var. A C kenarının ortasında bir kısa çizgi var. B C kenarında çizgi yok. B köşesinin içinde küçük bir kare işareti var."

Eşlik ölçülmüyorsa yorumlu sürüm kullanılır: "A B ve A C kenarları eşit uzunlukta işaretlenmiş. B açısı dik açı olarak işaretlenmiş."

**3. Paralel doğrular ve kesen** [NWEA 3.33: sol üst açıdan başla, saat yönünde; yalnızca etiketli açılar]
> "Bir şekil. c ve d doğruları paralel. Yatay h doğrusu bu iki doğruyu kesiyor ve her kesişim noktasında dört açı oluşuyor. İki açı etiketli.
> • h doğrusunun c doğrusunu kestiği yerde sol alttaki açının içinde Y yazıyor.
> • h doğrusunun d doğrusunu kestiği yerde sağ alttaki açının içinde 50 derece yazıyor."

Paralellik soruluyorsa "paralel" demek yerine işaret tarif edilir: "c ve d doğrularının her birinin üzerinde aynı yöne bakan birer ok işareti var."

**4. Şekil tanıma seçenekleri (paralel seçenekler)** [NWEA 3.26; NCAM doğru parçası]
> "A seçeneği: 4 kenarlı bir şekil. Bütün kenarlar aynı uzunlukta.
> B seçeneği: 4 kenarlı bir şekil. Karşılıklı kenarlar aynı uzunlukta.
> …"

Seçeneklerde aynı cümle kalıbı, aynı sayıda sıfat ve benzer uzunluk kullanılır. Şeklin adı hiçbir seçenekte söylenmez. İki betimleme aynı çıkıyorsa soru sözlü forma uygun değildir: dokunsal grafik gerekir.

**5. Çember** [NWEA 3.31/3.32]
> "N merkezli bir çember. F H doğru parçası çemberin çapı. K L kirişi, çember üzerindeki K noktasından çember üzerindeki L noktasına giden bir doğru parçası.
> • K L kirişi, F H çapını G noktasında kesiyor.
> • F G L açısı F L yayını görüyor. F L yayının ölçüsü 110 derece."

**6. Koordinat düzlemi: çokgen** [NWEA 3.13; Türkçe ondalık uyarlaması]
> "Bir koordinat düzlemi. Üzerinde T U V üçgeni var.
> • T noktası: x eşittir negatif 5, y eşittir 0.
> • U noktası: x eşittir negatif 2, y eşittir 0.
> • V noktası: x eşittir negatif 2, y eşittir negatif 4."

Alternatif kalıp: "T noktası, negatif 5 noktalı virgül 0." "Virgül" kelimesi ondalık sayılarla karışacağı için kullanılmamalı.

**7. Koordinat düzlemi: noktalar** [NWEA 3.20: başlangıç noktası referans; eksendeyse "üzerinde"; 3'ten fazla nokta için liste]
> "Bir koordinat düzlemi: yatay x ekseni ve dikey y ekseni, ikisi başlangıç noktasında kesişiyor. Beş nokta var: M, N, P, Q ve R.
> • M noktası: başlangıç noktasından y ekseni üzerinde 3 birim yukarıda.
> • N noktası: başlangıç noktasından 3 birim sağda ve 3 birim yukarıda.
> • P noktası: başlangıç noktasından 3 birim sağda, x ekseni üzerinde."

**8. Koordinat düzlemi: doğru** [NWEA 3.14: eğim terimi cevabı veriyorsa "soldan sağa artıyor/azalıyor"]
> "Bir koordinat düzleminde düz bir doğru var. Doğru soldan sağa doğru alçalıyor. y eksenini x eşittir 0, y eşittir 4 noktasında, x eksenini x eşittir 5, y eşittir 0 noktasında kesiyor."

Eşitsizlik grafiğinde ek bilgi: "Doğru kesikli çizgi. Doğrunun sağında kalan bölge taralı."

**9. Çubuk grafik** [NWEA 3.2/3.3; DIAGRAM Graphs; renk yalnızca gerekirse]
> "Bir grafik. Yatay çubuk grafiğin başlığı: Okula Geliş Yolları. Dikey eksende geliş yolları, yatay eksende öğrenci sayısı var, 0'dan 10'a kadar. 5 çubuk var.
> • Bisiklet, 4 öğrenci.
> • Otobüs, 8 öğrenci.
> …"

Grafik okuma becerisi ölçülüyorsa değer verilmez, konum söylenir: "Kış, 4. sınıf: 20 ile 30'un tam ortasında. 5. sınıf: 10 ile 20 arasında, 20 çizgisine yakın." Alt sınıflarda eksen yerine "altta" ve "yanda" denir.

**10. Çizgi grafik** [NWEA 3.4; NCAM line graph]
> "Bir grafik. Yatay eksen Aylar, 0'dan 10'a kadar. Dikey eksen Taraftar sayısı, 0'dan 3 bin 500'e kadar. Düz bir çizgi x eşittir 0, y eşittir 500 noktasından başlıyor ve x eşittir 10, y eşittir 1 bin 500 noktasına kadar yükseliyor."

Seçeneklerde ortak eksen cümlesi seçeneklerden önce bir kez söylenir. Her seçenekte yalnızca çizginin farkı söylenir.

**11. Daire (pasta) grafiği** [NWEA 3.5 / DIAGRAM; sıralamanın ipucu vermemesi için çıkarım]
> "Bir grafik. Daire grafiğinin başlığı: 4. Sınıfların En Sevdiği Dersler. Daire 4 eşit olmayan parçaya bölünmüş. En üstten başlayarak saat yönünde parçalar: Matematik yüzde 40, Okuma yüzde 25, …"

Büyüklük sırası soruda ölçülmüyorsa NWEA'daki gibi büyükten küçüğe liste de kullanılabilir.

**12. Tablo** [Smarter Balanced tablo örneği; NCAM]
> "Bir tablo. Başlığı: Okul Yürüyüşü Sonuçları. Tabloda 2 sütun ve 4 satır var. Soldan sağa sütun başlıkları: Öğrenci Sayısı, Yürünen Kilometre. Birinci satır: 30, 112. İkinci satır: 46, 214. …"

Uzun tablolarda her değerin önüne başlık tekrarlanabilir: "Öğrenci sayısı 30, kilometre 112."

**13. Sayı doğrusu** [NCAM; NWEA kesir ve çapa kuralları]
> "Bir sayı doğrusu. 0'dan 2'ye kadar gidiyor. Etiketli sayılar: 0, 1, 2. Her iki sayı arasındaki aralık çizgilerle 3 eşit parçaya bölünmüş. Bir nokta, 1'in sağındaki ikinci çizgide."

Kesir becerisi ölçülmüyorsa "üçte birlere bölünmüş" denebilir. Noktanın değeri hiçbir zaman söylenmez. Negatif sayılarda çapa büyük olan negatif sayıdır: "negatif 1'in solundaki ikinci çizgide".

**14. Eşitsizlik sayı doğrusu** [NWEA 3.41]
> "Bir sayı doğrusu. Negatif 4'ten pozitif 2'ye kadar gidiyor ve 1 taralı bölümü var. Negatif 4'te içi dolu bir daire var. Pozitif 2'de içi boş bir daire var. Negatif 4 ile pozitif 2 arası taralı."

**15. Venn şeması** [NCAM Venn; NWEA 3.48–3.50]
> "Bir Venn şeması. Kesişen 2 daire var: biri Boya Kalemi, diğeri Keçeli Kalem etiketli. Yalnızca Boya Kalemi bölgesinde 4, yalnızca Keçeli Kalem bölgesinde 7, ortak bölgede 18 yazıyor."

Taralı soru: önce "Taralı bölge ortak bölgedir" denir, sonra veriler.

**16. Kesir modeli** [NWEA 3.34]
> "A seçeneği: Bir daire 5 eşit parçaya bölünmüş. 1 parça taralı.
> B seçeneği: Bir daire 4 eşit parçaya bölünmüş. 1 parça taralı."

"Beşte bir" gibi kesir adı söylenmez. Parçalar eşit değilse ve seçenekler ayırt edilemiyorsa dokunsal model gerekir.

**17. Çetele** [NWEA 3.9/3.10]
- Okuma ölçülüyorsa: "Futbol: 5'li 2 grup ve 3'lü 1 grup." Toplam söylenmez.
- Hesap ölçülüyorsa: "Futbol: 13 çizgi."

**18. Denklem ve boşluk** [NCAM "missing symbol"; Smarter Balanced "box"]
> "Bu denklemde bir sembol eksik: 8'de 3 kesri, boşluk, 16'da 7 kesri."

Soru "kutu" diyorsa betimleme de "kutu" der. Sembolün anlamı ölçülüyorsa sembol adı okunmaz (STA).

**Sözlü uygulama kuralları** (insan okuyucu ya da TTS) [Smarter Balanced, STA, NCAM]:
- Vurgu, jest ve ses tonu değişikliği yapılmaz.
- Öğrenci isterse betimleme aynen tekrar edilir. Yorumlanmaz, başka sözcüklerle anlatılmaz.
- Konu terimleri ("dörtgen", "kiriş") açıklanmaz. NWEA istisnası: terim hedef beceri değilse ve öğrenci için engel oluşturuyorsa kısa açıklama eklenebilir.
- Seçenek betimlemeleri, betimlemeyi görmemiş birine okutularak kalite kontrolünden geçirilir.

### Gaps
- Bu Türkçe şablonların Türk görme engelli öğrencilerle ampirik testi yok. Koordinat okuma kalıbı ("x eşittir …, y eşittir …" ile "noktalı virgül") için de kaynak ya da kullanıcı testi bulunamadı. Türkçe ekran okuyucuların (ör. NVDA Türkçe sentezleyici) "2,5" ve "(3; −7)" okumasının pilotla doğrulanması gerekir.
- MEB'in ya da ÖSYM/MEB sınavlarındaki görme engelli okuyucu-işaretleyici uygulama yönergelerinin şekil betimleme hükümleri bu araştırma kapsamında aranmadı.

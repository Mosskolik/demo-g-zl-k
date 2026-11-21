# Speaking Mathematics Aloud Unambiguously for Blind Listeners (MathSpeak / ClearSpeak / SimpleSpeak) and Adapting the Rules to Turkish

> Method note: The research environment blocked direct page fetches to jsesd.github.io and www.ets.org (DNS not allowed in the sandbox), and GitHub API access to daisy/MathCAT was not enabled. Everything below therefore comes from web-search snippets of the primary sources, not from full-text reading. Exact quotes are marked as quotes only where the search snippet gave the wording. Per-construct statistics from the ETS and JSESD papers could not be extracted; they are listed as gaps. Turkish conventions are explicitly tagged **[DOCUMENTED]** or **[INFERRED]**.

## 1. What are the core rules of MathSpeak, ClearSpeak and SimpleSpeak, and how do they mark structure?

### Takeaway
All three styles are designed so that speech is unambiguous. They differ in *how* they mark boundaries. **MathSpeak** (gh/Nemeth-derived) uses explicit, braille-like start/end tokens ("StartFraction ... Over ... EndFraction", "Superscript ... Baseline", "StartRoot ... EndRoot") at three verbosity levels. **SimpleSpeak** uses lighter bracketing words ("fraction ... over ... end fraction", "super ... end super", "end root", "end absolute value"). **ClearSpeak** (ETS) uses natural phrasing ("the fraction with numerator ... and denominator ...", "raised to the power", "the square root of"). It speaks simple fractions as words ("one half") and relies on pauses rather than end-words in many cases. The key design principle across all three: **use a short, natural form when the structure is simple, and an explicit start/end form only when the structure is complex.**

### Cited Findings

**MathSpeak (gh LLC, Nemeth-based)**
- MathSpeak has three verbosity levels: verbose, brief and superbrief. Brief and superbrief are faster, and superbrief accepts possible information loss. — [MathSpeak Settings Tutorial](https://www.seewritehear.com/accessible-mathml/mathspeak/examples/settings-tutorial/)
- Fractions: verbose "StartFraction ... Over ... EndFraction", brief "StartFrac ... Over ... EndFrac", superbrief "Frac ... Over ... EndFrac". Nested fractions add nesting tokens (for example "NestFrac" in superbrief). — [MathSpeak Grammar Rules: Fractions](https://www.seewritehear.com/accessible-mathml/mathspeak/examples/grammar-rules/?rule=fractions)
- Roots: verbose/brief "StartRoot ... EndRoot", superbrief "Root ... EndRoot" (example: "Root m plus n EndRoot"). — [MathSpeak Grammar Rules: Radicals](https://www.seewritehear.com/accessible-mathml/mathspeak/examples/grammar-rules/?verbosity=all&rule=radicals)
- Scripts: verbose "Superscript" and "Subscript", with "Baseline" to return to the main line. Brief/superbrief use "Sup"/"Sub", and superbrief shortens "Baseline" to "Base" (example: "x Sub a Base Sup b"). — [MathSpeak Grammar Rules: Scripts](https://www.seewritehear.com/accessible-mathml/mathspeak/examples/grammar-rules/?verbosity=all&rule=scripts); [gh MathSpeak scripts (verbose)](http://www.gh-mathspeak.com/examples/grammar-rules/index.php?rule=scripts&verbosity=v)
- MathSpeak fraction rules map onto Nemeth Code fraction rules (a "gh Nemeth Rule Viewer" pairs each Nemeth rule with its speech). — [gh Nemeth Rule Viewer: Rule 12, Fractions](https://www.seewritehear.com/accessible-mathml/mathspeak/examples/NemethBook/?rule=12&title=Fractions)
- Soiffer (2025) says MathSpeak follows Nemeth Code closely but produces speech that listeners find unfamiliar. — [Soiffer, "A Comparison of Different Styles of Speech for Mathematics" (CSUN JTPD)](https://scholarworks.calstate.edu/concern/publications/3b591k538); [PDF](https://scholarworks.calstate.edu/downloads/5t34sv64c)

**SimpleSpeak (MathPlayer/MathCAT)**
- In the ETS study, SimpleSpeak fractions were spoken as "fraction [numerator] over [denominator] end fraction", and exponents used "super ... end super". Students objected to the word "super". — [Frankel et al. 2016, ETS RR-16-23 (ERIC full text)](https://files.eric.ed.gov/fulltext/ED570857.pdf)
- In MathCAT, SimpleSpeak marks ends where ClearSpeak does not. √(x+1) → "the square root of x plus 1, end root"; |x−1| → "...end absolute value"; a + b/c + d → "a plus b over c, plus d" (with a pause). — [daisy/MathCAT Issue #973](https://github.com/daisy/MathCAT/issues/973)

**ClearSpeak (ETS: Frankel, Brownstein, Soiffer)**
- ClearSpeak has a default speech rule for each structure plus optional "preferences" (for example Fraction preferences such as OverEndFrac, Exponent_Auto default). — [ClearSpeak Rules and Preferences (ETS, Brownstein, Soiffer, Frankel), hosted by MathCAT](https://daisy.github.io/MathCAT/ClearSpeakRulesAndPreferences.docx)
- In the ETS study, ClearSpeak complex fractions were "fraction with numerator [numerator] and denominator [denominator]". Exponents used "raised to the power" instead of SimpleSpeak's "sup ... end sup" or MathSpeak's "sup ... base". — [ETS RR-16-23 (ERIC)](https://files.eric.ed.gov/fulltext/ED570857.pdf)
- ClearSpeak test outputs for simple fractions include "One half", "12 over 32" and "One half over one third". Fractions are not closed with "end fraction" by default; boundaries are carried by pauses. — [SRE issue #230: Handling of fractions with ClearSpeak](https://github.com/Speech-Rule-Engine/speech-rule-engine/issues/230); [ClearSpeak mfrac tests](https://samimaattacelia.github.io/Tests/ClearSpeak/mfrac.html)
- MathCAT's ClearSpeak implementation wraps complex exponents with "raised to the exponent ... end exponent" (implementation detail, not necessarily the ETS spec). — [MathCAT ClearSpeak_Rules.yaml (mirror)](https://rust-digger.code-maven.com/src/mathcat-0.6.6/Rules/Languages/en/ClearSpeak_Rules.yaml)
- MathCAT root preferences: Auto, PosNegSqRoot, RootEnd, PosNegSqRootEnd. With "RootEnd", √x is "square root of x end root". — [DeepWiki: MathCAT for end users](https://deepwiki.com/daisy/MathCAT/2.1-for-end-users); [MathCAT user guide](https://daisy.github.io/MathCAT/users.html)
- **Known weakness of ClearSpeak Auto:** |x−1| is spoken "the absolute value of x minus 1" with no closing phrase. a + b/c + d is spoken "a plus b over c plus d" with no pause, so it sounds like a + b/(c+d). The issue proposes a pause after a simple fraction followed by an operator. Most users never change the AbsoluteValue/Roots preferences, so this difference, carried only by pause, is easy to miss. — [daisy/MathCAT Issue #973](https://github.com/daisy/MathCAT/issues/973)
- Conflicting description: a Microsoft (Murray Sargent) blog says both ClearSpeak and MathSpeak prefer "start fraction ... over ... end fraction" for compound fractions. That does not match the ETS report's "fraction with numerator ... and denominator ..." wording. Treat the ETS report as authoritative for ClearSpeak. — [Sargent, "Speaking Subscripts, Superscripts, and Fractions"](https://learn.microsoft.com/en-us/archive/blogs/murrays/speaking-subscripts-superscripts-and-fractions); vs. [ETS RR-16-23](https://files.eric.ed.gov/fulltext/ED570857.pdf)

**Human test-reader conventions (ETS)**
- For algebra or notation items, the reader may first read the whole question silently before reading it aloud. Simple numeric fractions are read as fractions ("five sixths"). A negative number is read "negative five", while a subtraction sign is "minus". Expressions with multiple operations are read exactly as they appear. If there is any question where a fraction ends, say "end fraction". — [ETS Guidelines for Test Readers](https://www.ets.org/disabilities/resources/test-reader-guidelines.html); [ETS Guidelines PDF](https://www.eu.ets.org/pdfs/disabilities/guidelines-for-test-reader.pdf)
- U.S. state read-aloud guidance (Texas): second and third powers are read "squared"/"cubed", and higher powers "to the fifth power". — [Texas Guidelines for Reading Aloud Various Types of Test Questions](https://txassessmentdocs.atlassian.net/wiki/spaces/ODCCM/pages/3053224128/Guidelines+for+Reading+Aloud+Various+Types+of+Test+Questions)

### Inferences
- **Synthesized rule set (English reference forms)** drawn from the three styles above, for the report writer:

| Construct | Simple case (concise) | Complex case (explicit) |
|---|---|---|
| Numeric fraction 3/4 | "three fourths" (ClearSpeak) | — |
| Fraction with simple parts x/2 | "x over 2" (ClearSpeak/SimpleSpeak) | — |
| Fraction (x+1)/2 | — | "the fraction with numerator x plus 1 and denominator 2" (ClearSpeak); "fraction x plus 1 over 2 end fraction" (SimpleSpeak); "StartFraction x plus 1 Over 2 EndFraction" (MathSpeak) |
| x² , x³ | "x squared", "x cubed" | — |
| x^n | "x to the n-th power" / "x raised to the n power" | x^(n+1): "x raised to the exponent n plus 1, end exponent" (MathCAT ClearSpeak); "x Superscript n plus 1 Baseline" (MathSpeak) |
| √x | "the square root of x" | √(x+1): "the square root of x plus 1, end root" (SimpleSpeak); "StartRoot x plus 1 EndRoot" (MathSpeak) |
| \|x−1\| | — | "the absolute value of x minus 1, end absolute value" (SimpleSpeak). ClearSpeak Auto omits the end and is ambiguous. |
| a + b/c + d | — | "a plus b over c, [pause] plus d" (pause required) |

- The reference forms suggest the end marker is only needed when the scope of an operator is longer than a single token. Short atoms ("x squared", "x over 2") need no end word.

### Gaps
- Could not read the full ClearSpeak Rules and Preferences document (.docx) or the current MathCAT English rule YAML files to quote every default (for example "the quantity" for parentheses, the function-application rules, inequalities). Source access was blocked.
- No search snippet confirmed ClearSpeak's exact default wording for parentheses ("open paren"/"the quantity") or for function notation.

## 2. What did ETS and JSESD studies find about comprehension, ambiguity and listener burden?

### Takeaway
Explicit structure rules dramatically reduce ambiguity. With MathSpeak, near-perfect identification; without it, chance level (Isaacson et al. 2014). In a head-to-head test, blind students identified expressions more accurately with ClearSpeak's natural-but-structured style and rated it clearer than both MathSpeak and SimpleSpeak, and ClearSpeak narrowed the blind/low-vision gap (ETS RR-16-23). Prosody (pauses, rate) was tested as a supplement to words, not a replacement (ETS RR-16-33). Per-item numbers could not be extracted.

### Cited Findings
- Isaacson, Schleppenbach & Lloyd (2014), JSESD 14(1): tested MathSpeak's ability to disambiguate spoken math. 20 expressions, each with at least four possible interpretations when spoken in everyday terms, covered fractions, exponents, absolute values and square roots. Participants were tested in groups and heard synthetic speech with and without MathSpeak rules. — [JSESD repository record](https://repository.rit.edu/jsesd/vol14/iss1/3/); [JSESD web article](https://jsesd.github.io/web-articles/JSESD-Volume-14/1015-Isaacson/)
- Results: scores with MathSpeak ranged 16–20/20, and without MathSpeak 2–13/20, with no overlap. Performance with MathSpeak was near perfect, and without it not different from chance. The authors say MathSpeak rules "appear to be easy to learn". Participants are described as students with print disabilities (low vision / visual impairment), so the blind vs. low-vision split is unconfirmed. — [JSESD repository record](https://repository.rit.edu/jsesd/vol14/iss1/3/)
- A related MathSpeak paper developed an algorithm for "improving quality and information processing capacity of MathSpeak synthetic speech renderings". This points to concern with listener burden from verbose markers. — [Disability and Rehabilitation: Assistive Technology 5(2)](https://www.tandfonline.com/doi/full/10.3109/17483100903387226)
- Frankel, Brownstein, Soiffer & Hansen (2016), ETS RR-16-23, compared a ClearSpeak prototype with MathSpeak and SimpleSpeak. Mean scores on each measure were notably higher for ClearSpeak, for students overall and for blind and low-vision groups separately. The blind/low-vision gap was relatively small for ClearSpeak and much larger for the other two styles. — [ETS RR-16-23 (ERIC full text)](https://files.eric.ed.gov/fulltext/ED570857.pdf); [Wiley](https://onlinelibrary.wiley.com/doi/full/10.1002/ets2.12103); [ERIC record EJ1124729](https://eric.ed.gov/?id=EJ1124729)
- Sixteen blind students rated ClearSpeak statistically significantly better than SimpleSpeak and MathSpeak, both for perceived clarity and for correct identification of expressions (as summarized by Soiffer). Soiffer also notes the ClearSpeak study did not control for Nemeth fluency when comparing with MathSpeak, and calls for that comparison. — [Soiffer 2025 (CSUN JTPD)](https://scholarworks.calstate.edu/downloads/5t34sv64c)
- Frankel & Brownstein (2016), ETS RR-16-33, evaluated prosodic and lexical cues within ClearSpeak. The prosodic toolkit was reduced to pauses and speech-rate changes. One test was whether uniform vs. graduated-length pauses, with or without spoken lexical cues, help blind/VI listeners tell apart nesting levels of parentheses. Results fed refinements of ClearSpeak in MathPlayer. — [ETS RR-16-33 (ERIC full text)](https://files.eric.ed.gov/fulltext/EJ1124730.pdf); [Wiley](https://onlinelibrary.wiley.com/doi/full/10.1002/ets2.12119); [ERIC record](https://eric.ed.gov/?id=EJ1124730)
- Frankel et al. (2017), ETS RR (MathML audio): in a separate pilot, students solved math problems as well as, and in some cases slightly better than, with their usual format when using ClearSpeak. — [ETS 2017, Expanding Audio Access... (ERIC)](https://files.eric.ed.gov/fulltext/EJ1168599.pdf); [Wiley](https://onlinelibrary.wiley.com/doi/full/10.1002/ets2.12132)
- Turkey: an Ankara University thesis compared computer-based audio reading with a live human reader for MEB TEOG Turkish and mathematics tests for visually impaired students. It found no significant performance difference and concluded that computer audio reading can be used in exams. It also introduced a "Bilgisayar Ortamında Sesli Test Uygulama Aracı". — [Ankara Üniversitesi DSpace](https://dspace.ankara.edu.tr/server/api/core/bitstreams/7f26295a-a6ce-4435-9012-5672d13becef/content)
- Speech-rate tolerance: in a study of ultra-fast speech, synthetic speech was understood worst by sighted and best by blind listeners. Removing pauses helped only at a few rates. — [ICPhS 2007, Comprehension of ultra-fast speech](https://icphs2007.de/conference/Papers/1186/1186.pdf)

### Inferences
- The evidence points to two needs. Structure markers are essential, given that without them performance was at chance. Natural wording reduces burden and improves accuracy relative to token-heavy MathSpeak, at least for non-Nemeth-fluent students. A hybrid that is natural by default and explicit for complex parts is best supported.
- Pauses alone are fragile (MathCAT #973). The ETS work tested pauses *together with* lexical cues, which suggests lexical end markers should not be dropped for complex scope.

### Gaps
- Per-construct accuracy (fractions vs. exponents vs. roots vs. absolute value) in Isaacson et al. 2014 was not extractable.
- The exact results of RR-16-33 (whether graduated pauses or lexical cues helped more) could not be retrieved; full text was blocked.
- No study found that measures **memory load / recall** directly (for example, working-memory span for long spoken expressions). Claims about memory are inferences.

## 3. Which techniques reduce ambiguity without overloading memory?

### Takeaway
The documented techniques fall into five groups. (1) Simple-vs-complex switching: words for simple fractions, an explicit frame only for complex ones. (2) Natural operator words that put the operator before its operand ("the square root of ...", "the absolute value of ..."). (3) Lexical end markers only when scope is longer than one token. (4) Pauses at boundaries as a supplement. (5) Reading the whole item first (human readers) and offering navigation/repeat. "Saying structure first" (for example "a fraction: numerator ..., denominator ...") is the ClearSpeak complex-fraction pattern.

### Cited Findings
- ClearSpeak speaks simple fractions as ordinary words ("one half", "12 over 32") and reserves "the fraction with numerator ... and denominator ..." for complex fractions. — [ETS RR-16-23](https://files.eric.ed.gov/fulltext/ED570857.pdf); [SRE issue #230](https://github.com/Speech-Rule-Engine/speech-rule-engine/issues/230)
- MathSpeak verbosity levels (verbose/brief/superbrief) let experienced users trade explicitness for speed. — [MathSpeak Settings Tutorial](https://www.seewritehear.com/accessible-mathml/mathspeak/examples/settings-tutorial/)
- Pauses and speech-rate changes were the prosodic cues tested, alone and combined with lexical cues, for parenthesis nesting. — [ETS RR-16-33](https://files.eric.ed.gov/fulltext/EJ1124730.pdf)
- A pause after a simple fraction that is followed by an operator ("a plus b over c, [pause] plus d") is proposed to separate b/c + d from b/(c+d). — [daisy/MathCAT Issue #973](https://github.com/daisy/MathCAT/issues/973)
- Human readers should silently pre-read notation-heavy items, read expressions exactly as written, and say "end fraction" if the fraction end is unclear. — [ETS Test Reader Guidelines](https://www.ets.org/disabilities/resources/test-reader-guidelines.html)
- Navigable, customizable TTS (exploring sub-expressions) is a parallel ETS/MathPlayer line of work. — [Navigable, Customizable TTS for Algebra (Academia)](https://www.academia.edu/101947607/Navigable_Customizable_TTS_for_Algebra)
- Prosody models for synthesized MathML speech are an active research area. — [Towards a Prosodic Model for Synthesized Speech of Mathematical Expressions in MathML (ACM DSAI 2020)](https://dl.acm.org/doi/fullHtml/10.1145/3439231.3440617)

### Inferences
Practical rule checklist for an LLM/TTS tutor, synthesized from the above:
1. Read the whole problem first. Give the structure up front for long expressions: "Bu denklemin sol tarafında bir kesir, sağ tarafında 5 var."
2. Use simple forms for atoms: "x kare", "x bölü 2", "üçte iki".
3. Use an explicit frame for complex parts. Name the structure first, then the parts, then close it: "pay x artı bir, payda iki olan kesir" or "kesir: pay x artı bir; payda iki; kesir bitti".
4. Put an end marker on every operator whose scope is longer than one token: "kök bitti", "üs bitti", "mutlak değer bitti", "parantez kapandı".
5. Pause at every structural boundary (SSML `<break>` about 300–500 ms). Treat the pause as an addition to the words, never a replacement.
6. Distinguish negative from minus ("negatif beş" vs "eksi"), following the ETS negative/minus rule.
7. Limit nesting depth per sentence. For depth above 2, name inner parts ("A dediğimiz ifade...") and offer to repeat.
8. Offer repetition and sub-part navigation ("payı tekrar et") instead of one long monologue. This last point is inferred from the navigable-TTS line of work and not directly tested for memory.

### Gaps
- No quantitative evidence found on the "say structure first" ordering versus an inline frame for recall.
- No study found that tests "the whole quantity" phrasing directly.

## 4. Are there Turkish conventions for reading math aloud, and what Turkish-specific ambiguities exist?

### Takeaway
No standardized Turkish spoken-math specification (a Turkish MathSpeak/ClearSpeak) was found. MEB has a Braille Matematik Öğretmen Kılavuzu (braille symbols, grades 1–8), and Turkish educational sites document everyday readings ("2 üssü 5", "2 üzeri 5", "2'nin 5'inci kuvveti", "x'in karekökü"). A Turkish math-speech rule set must therefore be **adapted, not adopted**. Turkish word order (operand before operator: "x'in karekökü", genitive-possessive) moves the scope problem to the *start* of the phrase. This makes explicit openers ("karekök içinde ...") or closers ("... kök bitti") especially important.

### Cited Findings
- **[DOCUMENTED]** Exponents: the base is read first, then "üssü" or "üzeri", then the exponent ("2 üssü 5", "2 üzeri 5"). Also "2'nin 5'inci kuvveti". — [Doping Hafıza, Üslü İfadeler](https://www.dopinghafiza.com/ders/tyt-matematik/uslu-ifadeler)
- **[DOCUMENTED]** Roots: √x is read "x'in karekökü (ikinci dereceden kökü)". If no degree is written, the degree is 2. — [Derspresso, Köklü İfade](https://www.derspresso.com.tr/matematik/koklu-ifade/tanim); [Ortaokul Matematik, Kareköklü ifadeler](https://www.ortaokulmatematik.com/2022/03/karekoklu-ifadeler.html)
- **[DOCUMENTED, weak source]** "÷" and "/" are read "bölü"/"bölme". — [Open English, İngilizce Matematik Sembolleri ve Türkçeleri](https://www.openenglish.com.tr/blog/ingilizce-matematik-sembolleri-ve-turkceleri/)
- **[DOCUMENTED]** MEB published Turkey's first "Braille Matematik Öğretmen Kılavuzu". It has 4 sections covering grades 1–8 outcomes, with braille notation, sample problems, Braille equivalents of terms and symbols, and standardization of küptaş and abacus use. Braille math signs were adapted to Turkish in 1951. — [MEB haber](https://www.meb.gov.tr/quotbraille-matematik-kilavuzuquot-gorme-engelli-ogrencilere-isik-olacak/haber/14975/tr); [MEB ÖRGM](https://orgm.meb.gov.tr/www/ampquotbraille-matematik-kilavuzuampquot-gorme-engelli-ogrencilere-isik-olacak/icerik/966); [AA](https://www.aa.com.tr/tr/egitim/braille-matematik-kilavuzu-gorme-engelli-ogrencilere-isik-olacak/967958)
- **[DOCUMENTED]** Dijital Matematik (dijitalmatematik.org) provides MEB-based content for visually impaired users in audio and text. Math is authored in Word so that screen readers can voice it, and there is an audio training set on reading and writing math in Word with a screen reader. Access requires verified membership. — [Dijital Matematik, Proje Hakkında](https://www.dijitalmatematik.org/hakkinda)
- **[DOCUMENTED]** A Turkish audio lecture archive for visually impaired students reportedly pre-edits how formulas are read in lessons that contain them. No rules are published. — [ruyalar.net haber](https://ruyalar.net/gorme-engelli-ogrenciler-icin-hazirlanan-sesli-ders-arsivi-genisletildi-icerikler-ucretsiz-dinlenebiliyor/)
- **[DOCUMENTED]** Turkish TTS for the visually impaired exists, for example a syllable-based synthesizer from Gazi Üniversitesi. It does not address formulas. — [Bilişim Teknolojileri Dergisi 5(3), 2012](https://dergipark.org.tr/tr/download/article-file/75311)
- **[DOCUMENTED]** Turkish studies report visually impaired learners have misconceptions and gaps in variable, unknown, equation, equality, inequality and function concepts (Aktaş & Argün), which argues for careful spoken presentation of these constructs. — reported in search snippets of DergiPark articles; exact article URL not verified (candidates: [DergiPark 1144990](https://dergipark.org.tr/tr/download/article-file/1144990), [DergiPark 2870793](https://dergipark.org.tr/en/download/article-file/2870793))
- **[DOCUMENTED]** Turkey's central exams have exempted visually impaired students from some math questions, which Yıldırım & Çakmak criticize. — search snippet; exact URL among [DergiPark 4183980](https://dergipark.org.tr/en/download/article-file/4183980) / [DergiPark 1144990](https://dergipark.org.tr/tr/download/article-file/1144990) (not verified which)

### Inferences
**[INFERRED] Turkish-specific ambiguities** (linguistic analysis, not from a source):
- **"x artı bir bölü iki"** is ambiguous between (x+1)/2 and x + 1/2, exactly like English "x plus one over two". "Bölü" is an infix like "over".
- **Turkish fraction words reverse the order:** "üçte iki" = 2/3 (denominator first, as a locative "3'te 2"). This is natural for numeric fractions but has no clean extension to algebraic ones ("(x+1)'de 2"?), so use "pay/payda" for anything non-numeric.
- **Postfix operators (genitive-possessive):** "x artı birin karekökü" can mean √(x+1) or x + √1. The scope start is unmarked because the operator comes last. The same applies to "x eksi birin mutlak değeri", "a artı b'nin karesi" ((a+b)² vs a + b²) and "2x'in sinüsü".
- **"Eksi"** is used for both negative and subtraction ("eksi beş" = −5; "x eksi beş" = x − 5). "−2²" vs "(−2)²" then become hard to tell apart by ear. Turkish has "negatif" available.
- **"Üzeri" scope:** "2 üzeri x artı 1" can mean 2^(x+1) or 2^x + 1.
- **Number-suffix fusion in TTS:** "2'nin", "5'inci" and "x'in" depend on correct apostrophe-suffix handling by TTS (for example "iks'in"). Letter names (x = "iks", y = "ye", f = "fe" or "ef") vary between speakers and could be misheard.
- **Inequalities:** common school readings are "küçüktür", "büyüktür", "küçük eşittir", "büyük eşittir". No source was found to verify a standard.

**[INFERRED] Proposed Turkish spoken forms** (adapting ClearSpeak's concise default and SimpleSpeak/MathSpeak explicit end markers):

| Expression | Concise (simple) | Explicit (complex) |
|---|---|---|
| 2/3 | "üçte iki" | — |
| x/2 | "x bölü iki" | — |
| (x+1)/2 | — | "pay x artı bir, payda iki olan kesir" or "kesir başlıyor: pay x artı bir; payda iki; kesir bitti" |
| x + 1/2 | — | "x artı, [duraklama] ikide bir" (numeric fraction word) |
| a + b/c + d | — | "a artı, b bölü c, [duraklama] artı d" |
| x² / x³ | "x kare" / "x küp" | — |
| 2^x | "2 üssü x" | — |
| 2^(x+1) | — | "2 üssü, parantez içinde x artı bir, üs bitti" or "2'nin x artı birinci kuvveti" |
| 2^x + 1 | — | "2 üssü x, [duraklama] artı bir" |
| √x | "karekök x" / "x'in karekökü" | — |
| √(x+1) | — | "karekök içinde x artı bir, kök bitti" (opener before content, which resolves the postfix scope problem) |
| √x + 1 | — | "karekök x, [duraklama] artı bir" |
| ∛8 | "sekizin küpkökü" | — |
| (a+b)² | — | "parantez aç a artı b parantez kapat, kare" or "a artı b'nin tamamının karesi" |
| \|x−1\| | — | "mutlak değer içinde x eksi bir, mutlak değer bitti" |
| −5 vs 3 − 5 | "negatif beş" | "üç eksi beş" |
| f(x) = 2x + 1 | "f x eşittir iki x artı bir" | f(x+1): "f, parantez içinde x artı bir, parantez kapandı" |
| x ≤ 3 | "x küçük eşittir üç" | — |
| 2(x+3) = 14 | — | "iki çarpı parantez aç x artı üç parantez kapat, eşittir on dört" |

- Rule of thumb for Turkish: because the operator is postfix in natural Turkish ("...'in karekökü", "...'in mutlak değeri", "...'in karesi"), **use a prefix opener ("karekök içinde", "mutlak değer içinde", "parantez aç") whenever the operand has more than one term**, and close it. For single-term operands, natural postfix forms are fine ("x'in karekökü", "x kare").

### Gaps
- The MEB Braille Matematik Öğretmen Kılavuzu full text, and any spoken-reading guidance in it, could not be retrieved. Whether it prescribes spoken forms such as "parantez aç/kapa" is unknown.
- No YÖK Tez or DergiPark study was found that specifies or evaluates Turkish spoken-math rules (MathML → Turkish speech). The searches were limited and YÖK Tez was not directly queried due to access limits.
- Whether MathCAT or Speech Rule Engine ship a Turkish locale was not verified (GitHub API blocked). SRE has a localisation framework. — [SRE Localisation docs](https://speech-rule-engine.github.io/sre-l10n/yaml.html)
- How NVDA/JAWS/Word read OMML equations in Turkish (the basis of Dijital Matematik's approach) was not found.
- All proposed Turkish forms above are **inferred** and untested with Turkish blind listeners. They should be validated with users (for example a small Isaacson-style identification test of 20 ambiguous items).

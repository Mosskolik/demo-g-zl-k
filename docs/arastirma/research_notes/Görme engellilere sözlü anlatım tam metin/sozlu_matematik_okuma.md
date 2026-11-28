# Speaking Mathematics Aloud Unambiguously: Full-Text Verified Rulebook (MathSpeak / ClearSpeak / SimpleSpeak, ETS) and Turkish Conventions

> **Method note (read first).** Unlike the earlier notes (`../Görme engellilere sözlü soru anlatımı/sozlu_matematik_okuma.md`), which relied on search snippets, this file was built by **downloading and reading the full texts**. Sources read in full: Isaacson et al. 2014 (JSESD), ETS RR-16-23, ETS RR-16-33, the ETS "ClearSpeak Rules and Preferences" document (.docx, 2015), the ETS Guidelines for a Test Reader (PDF), the MathSpeak grammar-rule pages (seewritehear.com, rendered with a headless browser), the MathCAT 0.7.8 source package (rule files and English test files with expected speech strings), the Speech Rule Engine 4.1.5 npm package (locale list), the MEB 2026–2027 7th-grade mathematics textbooks (Books 1 and 2, from the EBA CDN), an MEB ODM worksheet, the Ankara University open-course notes, and two DergiPark articles (Aktaş & Argün 2020; Yıldırım & Çakmak 2024).
>
> **Tags:** **[TAM METİN]** means I read the primary full text and the quote is exact. **[ÖZET]** means the claim rests on an abstract, secondary page or search summary. Turkish material is also tagged **[BELGELENMİŞ]** (documented practice) or **[ÖNERİ]** (my proposal, not documented anywhere).
>
> **Limits:** Running SRE/MathCAT code locally to generate fresh outputs was blocked by the sandbox. The MathCAT speech strings below are the expected outputs written in its own test files, which are not live runs. GitHub (daisy/MathCAT) was not reachable, so the published crate on crates.io was used instead. The MEB "Braille Matematik Öğretmen Kılavuzu" PDF could not be downloaded (the server was unreachable).
>
> **Corrections to the earlier notes** (important for the report writer):
> 1. **Isaacson et al. (2014) participants were NOT print-disabled students.** They were **28 sighted undergraduate education majors** (18 F, 10 M). The earlier notes were wrong on this point.
> 2. **ETS RR-16-23 N = 16 recruited, 15 analysed (7 blind, 8 low vision).** The earlier notes said "sixteen blind students", which is wrong.
> 3. **RR-16-33 result:** lexical "end root" beat pauses and speed changes, a significant difference. Pauses alone did **not** compensate. The earlier notes left this as a gap.
> 4. **ClearSpeak's default complex-fraction wording is confirmed** as "the fraction with numerator … and denominator …". The Microsoft-blog claim that ClearSpeak uses "start fraction … end fraction" is wrong for ClearSpeak.
> 5. **Turkish MEB textbook (2026–27, 7th grade) prescribes "eksi" for negative numbers.** It does not use "negatif beş". See Q5.

---

## Q1. Exact spoken forms by construct in MathSpeak, ClearSpeak, SimpleSpeak, plus the ETS human-reader rules

### Takeaway
All three styles mark boundaries in different ways. **MathSpeak** uses a symbol-mapped begin/end token for every structure ("StartFraction … Over … EndFraction", "StartRoot … EndRoot", "Superscript … Baseline"), with nesting-depth tokens and three verbosity levels. **SimpleSpeak** speaks simple things simply and adds begin/end words ("fraction … over … end fraction", "end root") only when the content is complex. **ClearSpeak** speaks the way a classroom teacher would ("the fraction with numerator … and denominator …", "x to the fifth power", "the square root of …"). Its *default* has **no end words** for roots and absolute value. End words are optional *preferences* (RootEnd, AbsEnd, EndFrac, GeneralEndFrac, OverEndFrac). The ETS human-reader guideline matches ClearSpeak: "negative" vs "minus", "a fraction with numerator … and denominator …", "end fraction" if unclear, and "quantity … end quantity" or "paren … close paren".

### Cited Findings

**A. ClearSpeak (ETS: Brownstein, Soiffer & Frankel 2015, "ClearSpeak Rules and Preferences") [TAM METİN]** — [ClearSpeak Rules and Preferences (.docx)](https://daisy.github.io/MathCAT/ClearSpeakRulesAndPreferences.docx)
- **Definition of "simple expression"** (this definition drives every rule): "A number that is an integer, a decimal, or a fraction that is spoken as an ordinal"; "A letter, two juxtaposed letters (e.g., x, y, z, xy, yz, etc.), the negative of a letter, or the negative of two juxtaposed letters"; a number followed by a letter or letter pair (e.g., 2x, 2xy); "A function (including trigonometric and logarithmic functions) with an argument that is a simple expression."
- **Fractions (Fraction_Auto):**
  - "Fractions with integer numerators from 1 to 19 and integer denominators from 1 to 10 speak as common fractions (e.g., -halves, -thirds, -fourths)."
  - Simple fractions: "Speech: [numerator] over [denominator]".
  - Non-simple numerator or denominator: "Speech: the fraction with numerator [numerator] and denominator [denominator]".
  - Mixed numbers: "[whole number portion] and [fractional portion]".
  - Preferences: Ordinal, Over, FracOver ("the fraction [num] over [den]"), General, EndFrac, GeneralEndFrac ("The fraction with numerator … and denominator … end fraction"), OverEndFrac ("[num] over [den] end fraction"), Per ("[num] per [den]").
- **Exponents (Exponent_Auto):**
  - "Exponent 2 — Speech: [base] squared"; "Exponent 3 — Speech: [base] cubed".
  - "All other positive integer exponents and exponents that are single letters — Speech: [base] to the [exponent–ordinal] power".
  - "Exponent 0 and all negative integer exponents — Speech: [base] to the [exponent] power".
  - "All other exponents (including integers with a decimal point, such as 2.0) — Speech: [base] raised to the [exponent] power".
  - Nested exponents of any other form: "[base] raised to the exponent [exponent] power, end exponent".
  - Preferences: Ordinal ("[base] to the [exponent-ordinal]"), OrdinalPower, AfterPower ("[base] raised to the power [exponent]").
- **Roots (Roots_Auto):** "the square root of [expression under square root sign]"; "the cube root of …"; "the [index ordinal] root of …". Preferences: PosNegSqRoot ("The positive square root of …" / "The negative square root of …"); RootEnd ("'end root' is spoken after the expression under the root sign"); PosNegSqRootEnd.
- **Absolute value (AbsoluteValue_Auto):** "The absolute value of [expression]". A matrix inside bars is "The determinant of [matrix]". Preferences: **AbsEnd** ("The absolute value of [expression] end absolute value"), Cardinality ("The cardinality of …"), Determinant.
- **Functions (Functions_Auto):** an expression is recognized as a function if "The name is f, g, h, F, G, H, or any of these letters with adornments", or if the name is an identifier and the argument is a number, identifier or comma list. Speech examples: "f of x"; "f of, open paren, x comma y, close paren"; "f inverse of x"; "f squared of x"; "the fourth power of f of x"; composition "f of, g of x". With preference None, "a(0) will speak as 'a times 0'."
- **Trigonometry (Trig_Auto):**
  - Simple argument: "sine x", "cosine x", "tangent x", "secant x", "cosecant x", "cotangent x".
  - Other arguments: "the sine of, open paren, x plus y, close paren".
  - Powers: "sine squared x"; "sine squared of, open paren, 2x plus 1, close paren"; "the fourth power of sine x".
  - Inverse: "the inverse sine of x" (preferences TrigInverse "sine inverse of x"; ArcTrig "arcsine x").
  - Hyperbolic: "the hyperbolic sine of x".
- **Logarithms (Log_Auto):** "log x" (simple argument); "the log of, open paren, x plus y, close paren"; log_b: "the log, base b, of x"; ln: "l n x" / "l n of, open paren, x plus y, close paren". Preference LnAsNaturalLog: "natural log x" / "the natural log of, open paren, x plus y, close paren".
- **Implied times (ImpliedTimes_Auto):** "Implied times indicated via parentheses or brackets speaks as 'times'"; "Implied times indicated by absolute value speaks as 'times'"; "Implied times indicated via juxtaposition does not speak as 'times'."
- **Parentheses (Paren_Auto):**
  - Parentheses are not spoken when "The expression enclosed in parentheses or brackets is simple … and there is no exponent following the expression", or when the enclosed item is a positive number, a single letter or an ordinal fraction followed by an exponent.
  - "Otherwise, parentheses and brackets enclosing an expression are spoken."
  - **SpeakNestingLevel:** "open paren … close paren"; nested once: "open second paren, … close second paren"; nested twice: "open third paren …".
  - **CoordPoint:** "The point with coordinates, [first coordinate] comma …".
- **Intervals (Paren_Interval preference):**
  - "The interval from c to d, not including c or d"
  - "The interval from c to d, including c, but not including d"
  - "… not including c, but including d"
  - "The interval from c to d, including c and d"
  - "The interval from negative infinity to d, not including d"
  - The document itself prints "The interval from c to infinity, not including d" (an apparent typo for c).
- **Sets (Sets_Auto):**
  - "The set of all [entry before bar] such that [entry after bar]"
  - "The set [entry 1] comma [entry 2] comma …"
  - "The empty set"
  - Named sets: "the real numbers", "the integers", "the rational numbers", "the natural numbers"; ℝ² is "r–two".
- **Symbols:**
  - × and · are "times" (preferences "by", "cross", "dot").
  - Ellipses are "dot dot dot" (preference "and so on" / "and so on up to").
  - A vertical line is "divides"; inside set brackets it is "such that" (preference "given").
  - ∈ inside set brackets is "in"; elsewhere it is "is a member of" (preferences "element of", "belongs").
- **Capital letters (Caps_Auto):** "capital letters are spoken in a pitch that is 30 percent higher than the pitch at which lowercase letters are spoken". Preference SayCaps: "'B' speaks as 'Cap b'".
- **Note:** the ClearSpeak document has **no separate rule for inequalities or for unary minus**. Those come from the symbol tables (see MathCAT below: "negative 2", "is less than").

**B. ClearSpeak master-expression examples (ETS RR-16-23, Appendix D) [TAM METİN]** — [ETS RR-16-23 (ERIC full text)](https://files.eric.ed.gov/fulltext/ED570857.pdf)
- 1/2 is "One half"; 12/32 is "12 over 32"; 2x/3y is "2x over 3y"; (x+y)/2 is "The fraction with numerator x plus y, and denominator 2".
- (x+y)/(x−y) + 2/3 is "The fraction with numerator x plus y, and denominator x minus y, plus two thirds".
- EndFrac preference: "The fraction with numerator x plus y, and denominator x minus y, end fraction, plus two thirds".
- Functions in fractions: f(x)/g(x) is "f of x over g of x"; f(x+1)/g(x) is "the fraction with numerator f of, open paren, x plus 1, close paren, and denominator g of x".
- Trig and log in fractions: sin x/cos x is "sine x over cosine x"; log₁₀x/log₅y is "the log base 10 of x over the log base 5 of y".
- Nested: "1 plus the continued fraction with numerator 1 and denominator 1 plus the fraction with numerator 1 and denominator 1 plus …".

**C. MathSpeak (gh / SeeWriteHear grammar rules) [TAM METİN]**
- **Fractions** (verbose / brief / superbrief): "Start Fraction / Start Frac / Frac", "Over", "End Fraction / End Frac / End Frac".
  - Nested once: "Start Start Fraction … Over Over … End End Fraction" (superbrief "Nest Frac … Nest Over … Nest End Frac").
  - Example: "a minus StartFraction b plus c Over d minus e EndFraction times f".
  - Numeric fractions, rule 7.4: "The numerator must be an integer in the range of 1 to 9 the denominator must be an integer in the range of 1 to 99 … The fraction is pronounced naturally, such as one-half or two-thirds."
  - Source: [MathSpeak Grammar Rules, Ch. 7 Fractions](https://www.seewritehear.com/accessible-mathml/mathspeak/examples/grammar-rules/?verbosity=all&rule=fractions)
- **Radicals:** "Start Root … End Root" (superbrief "Root … End Root"); index: "RootIndex 3 StartRoot x EndRoot"; nested: "NestedStartRoot StartRoot x plus 1 EndRoot plus StartRoot y plus 1 EndRoot NestedEndRoot". — [MathSpeak Ch. 9 Radicals](https://www.seewritehear.com/accessible-mathml/mathspeak/examples/grammar-rules/?verbosity=all&rule=radicals)
- **Scripts:**
  - Rule 8.1: "Exponents that are 2 or 3 are interpreted as 'squared' and 'cubed' respectively."
  - Rule 8.3: "The initiated script level is continued until a new level is stated". Examples: "x Superscript m plus n Baseline equals x Superscript m Baseline x Superscript n"; brief "x Sup m plus n Base".
  - Level words: "Baseline / Base"; "Superscript / Sup (pronounced 'soup')"; "Subscript / Sub".
  - Source: [MathSpeak Ch. 8 Scripts](https://www.seewritehear.com/accessible-mathml/mathspeak/examples/grammar-rules/?verbosity=all&rule=scripts)
- **Negative vs minus:**
  - Rule 1.2 (numbers_NEG1): "Minus / hyphen symbols that are used as a negative sign should be interpreted as such". Examples: "negative y", "3 minus negative 2", "negative 32". — [MathSpeak Ch. 1 Numbers](https://www.seewritehear.com/accessible-mathml/mathspeak/examples/grammar-rules/?verbosity=v&rule=numbers)
  - Rule 5.1: "The hyphen / minus / negative sign is interpreted depending on the context": "negative 1", "y minus 1". — [MathSpeak Ch. 5 Symbols](https://www.seewritehear.com/accessible-mathml/mathspeak/examples/grammar-rules/?verbosity=v&rule=symbols)
- **Functions:** "sine x", "cosine y", "log Subscript b Baseline x". Rule 12.2: "the natural logarithm of x would be spoken as 'l n space x.'" — [MathSpeak Ch. 12 Functions](https://www.seewritehear.com/accessible-mathml/mathspeak/examples/grammar-rules/?verbosity=v&rule=functions)
- Inequality wording in MathSpeak examples is "greater-than" ("comma x greater-than 0"). — [MathSpeak Ch. 9](https://www.seewritehear.com/accessible-mathml/mathspeak/examples/grammar-rules/?verbosity=all&rule=radicals)
- Speech Rule Engine 4.1.5 also contains MathSpeak tokens "StartAbsoluteValue"/"EndAbsoluteValue" (seen in its `en.json`; not run). — [speech-rule-engine 4.1.5 tarball](https://registry.npmjs.org/speech-rule-engine/-/speech-rule-engine-4.1.5.tgz)

**D. SimpleSpeak and ClearSpeak as implemented in MathCAT 0.7.8 (expected strings from MathCAT's English test files) [TAM METİN, test expectations not live runs]** — [MathCAT 0.7.8 crate](https://static.crates.io/crates/mathcat/mathcat-0.7.8.crate) (files `tests/Languages/en/...`; crate page: [crates.io/crates/mathcat](https://crates.io/crates/mathcat))
- Absolute value (`mtable.rs`): |x| is "the absolute value of x" in **both** SimpleSpeak and ClearSpeak.
  - ClearSpeak Verbose + AbsEnd: "the absolute value of x, end absolute value".
  - |x+1| in ClearSpeak default: **"the absolute value of x plus 1"**, with no end marker. That makes |x+1| and |x|+1 sound identical in the default.
  - With AbsEnd: "absolute value of x plus 1, end absolute value".
- Roots in SimpleSpeak (`functions.rs`, `mfrac.rs`):
  - √a√b = √(ab) is "the square root of eigh; times the square root of b; is equal to, the square root of eigh b, end root". No "end root" after single-token radicands; "end root" after the multi-token radicand.
  - "fraction, x plus, the square root of 1 over y; end root; over, x minus y, end fraction".
  - ClearSpeak RootEnd: "the square root of x, end root"; "the positive square root of x, end root".
- Fractions: "fraction, x plus y, over, x minus y, end fraction" (SimpleSpeak); "the fraction with numerator; x plus y; and denominator x minus y; end fraction" (ClearSpeak GeneralEndFrac).
- Exponents:
  - "3 raised to the exponent, open paren x plus 1, close paren squared, end exponent"
  - "3 to the negative 2 power" / "3 raised to the power negative 2" / "x to the negative 2"
  - "e raised to the exponent, negative 1 half x to the second power, end exponent"
- Negative sign: "2 plus negative 2"; "negative 2 x, plus 1"; "negative x minus y".
- Inequalities and sets (`ClearSpeak/sets.rs`): "the set of all x in the integers such that 2 is less than x is less than 7"; "the set of all x such that x is greater than 2".
- Intervals: "the open interval from c to d"; "the closed interval from c to d"; "the closed open interval from c to d"; "the open closed interval from c to d".
- Logs: "the log base b, of x"; "the log of, open paren x plus y, close paren"; "the l n of, open paren x plus y, close paren". Trig: "sine squared of x"; "inverse sine of x".

**E. ETS Guidelines for a Test Reader (2002), section "Mathematics Reading" [TAM METİN]** — [ETS Guidelines for a Test Reader (PDF)](https://www.eu.ets.org/pdfs/disabilities/guidelines-for-test-reader.pdf)
- "Mathematical expressions must be read precisely and with care to avoid misrepresentation for a test taker who has no visual reference. For math items involving algebraic expressions or other mathematical notation, it may be preferable for the reader to silently read the entire question before reading it aloud to the test-taker. Use technically-correct yet simple terms, and be consistent in the treatment of similar expressions."
- (a) "xy should be read as 'x y,' unless it is part of a complex expression or this reading is otherwise unclear, in which case read it as 'x times y.'"
- (b) "Capital and lower-case letters should be differentiated … R - 2y = 6 should be read as 'Capital R minus two y equals six.'"
- (c) "Simple numerical fractions should be read as fractions: e.g., [5/6] should be read as 'five sixths.' However, similar letter expressions can be read as one letter 'over' another: e.g., [a/b] should be read as 'a over b.'"
- (d) "To prevent confusion, complicated fractions (those that contain other mathematical operations) should be read in terms of their numerators and denominators: e.g., [(b+d)/c] should be read as 'a fraction with numerator b plus d and denominator c.' If there is any question as to where the fraction ends, say 'end fraction.'"
- (e) "Negative numbers should be read as 'negative.' e.g., -5 should be read as 'negative five,' not 'minus five.' When a subtraction operation is involved, read the sign as 'minus,' e.g.: x - 5 should be read as 'x minus five.'"
- (f) "Expressions containing multiple mathematical operations should be read exactly as they appear. Expressions containing parentheses or brackets can be read in any of the following three ways: quantity, close quantity / paren, close paren (or bracket, close bracket) / left paren, right paren … If you use the term 'quantity,' in complicated expressions, announce where enclosed portions end by saying 'end quantity.'"
  - Example: "(2x - 6y) - 10 could be read as 'The quantity two x minus six y, close quantity, minus ten;' as 'paren, two x minus six y, close paren, minus ten;' or as 'left paren, two x minus six y, right paren, minus ten.'"
  - "a × b2 could be read as 'a times the square of b.'"
  - "Use pauses to audibly group sections of an expression together. z + (-a) could be read as 'z plus [PAUSE] paren negative a close paren.'"
- (g) Equations: "If the equation is numbered, read its number first. Give the meaning of each letter or symbol. Read the equation."
- General reader rules: "Do not try to solve problems or determine the correct answer as you read because this may result in an unconscious pause or change in inflection that could be misleading"; "try to respond to the test taker's questions by repeating the item".

**F. Earlier secondary claims kept, not re-verified here [ÖZET]**
- Texas read-aloud guidance: "squared/cubed", "to the fifth power". — [Texas Guidelines for Reading Aloud](https://txassessmentdocs.atlassian.net/wiki/spaces/ODCCM/pages/3053224128/Guidelines+for+Reading+Aloud+Various+Types+of+Test+Questions)
- MathCAT issue proposing a pause in "a plus b over c, [pause] plus d". — [daisy/MathCAT Issue #973](https://github.com/daisy/MathCAT/issues/973) (GitHub not reachable this session; the abs-value part is confirmed by the MathCAT tests above)

### Inferences
- **Synthesized English reference table** (verified forms only):

| Construct | MathSpeak (verbose) | SimpleSpeak (MathCAT) | ClearSpeak default | ETS human reader |
|---|---|---|---|---|
| 5/6 | five-sixths | 5 sixths | five sixths | "five sixths" |
| a/b | StartFraction a Over b EndFraction | a over b | a over b | "a over b" |
| (b+d)/c | StartFraction b plus d Over c EndFraction | fraction, b plus d, over c, end fraction | the fraction with numerator b plus d and denominator c | "a fraction with numerator b plus d and denominator c" (+ "end fraction" if unclear) |
| x² / x³ | x squared / x cubed | x squared / x cubed | x squared / x cubed | "x squared" |
| x⁵ | x Superscript 5 | x to the fifth | x to the 5th power | — |
| x^(n+1) | x Superscript n plus 1 Baseline | (raised to the …, end exponent) | x raised to the n plus 1 power | — |
| √(x+1) | StartRoot x plus 1 EndRoot | the square root of x plus 1, end root | the square root of x plus 1 (no end; RootEnd adds "end root") | — |
| \|x+1\| | StartAbsoluteValue x plus 1 EndAbsoluteValue (SRE) | (see note) | the absolute value of x plus 1 (no end; AbsEnd adds "end absolute value") | — |
| −5 | negative 5 | negative 5 | negative 5 | "negative five" |
| x − 5 | x minus 5 | x minus 5 | x minus 5 | "x minus five" |
| f(x) | f left-parenthesis x right-parenthesis | f of x | f of x | — |
| (2x−6y)−10 | left-parenthesis … right-parenthesis | open … close | open paren … close paren | quantity … close quantity / paren … close paren |
| x < 7 | x less-than 7 | x is less than 7 | x is less than 7 | — |
| log_b x | log Subscript b Baseline x | — | the log, base b, of x | — |
| sin(x+y) | sine left-parenthesis … | — | the sine of, open paren, x plus y, close paren | — |
| [c, d) | — | — | the interval from c to d, including c, but not including d (Interval pref.) | — |
| {x \| x>2} | — | — | the set of all x such that x is greater than 2 | — |

- Note: the SimpleSpeak abs-value form for a multi-term argument was not in the extracted test strings. The 2016 issue claim that SimpleSpeak says "end absolute value" is unverified.
- **Key design fact:** ClearSpeak's *default* removes end words for roots and absolute value, in order to reduce memory load. RR-16-33 then showed that "end root" was **more accurate** than pause-based replacements (Q2). For a high-stakes, audio-only Turkish setting, the evidence favors **turning end words ON whenever the scope is not a single simple token**.

### Gaps
- The ClearSpeak .docx sample expressions are embedded MathType objects, so the visual expression for each sample was lost in text extraction. The rule wording is exact.
- No ClearSpeak rule text for inequalities was found. Their wording comes from symbol tables (MathCAT shows "is less than", "is greater than").

---

## Q2. Evidence: Isaacson et al. 2014, ETS RR-16-23, ETS RR-16-33 (exact designs, items, scores)

### Takeaway
(1) Isaacson et al. (2014): with MathSpeak end-markers, 28 **sighted** education majors identified 18.93/20 expressions, against 8.07/20 (chance) without them, after only 4 minutes of training. (2) RR-16-23: 15 blind or low-vision Algebra students decoded ClearSpeak best (mean 0.89, against 0.70 for SimpleSpeak and 0.56 for MathSpeak). The advantage was largest for complex exponents and fractions. (3) RR-16-33: 22 blind or low-vision students identified a radicand's scope best with lexical **"end root"** (82–95% correct), compared with long pauses (50–68%) and speed-up (59–86%). The authors conclude "neither prosodic treatment succeeded in compensating for the absence of explicit lexical end-markers." Uniform pauses plus "second/third paren" nesting words were slightly preferred for nested parentheses. For long expressions, wording and prosody made no difference, and students wanted **navigation**.

### Cited Findings

**Isaacson, Schleppenbach & Lloyd (2014), JSESD 14(1) [TAM METİN]** — [JSESD full text](https://jsesd.github.io/web-articles/JSESD-Volume-14/1015-Isaacson/); [RIT repository record](https://repository.rit.edu/jsesd/vol14/iss1/3/)
- Motivating example: "'The square root of a plus b.' This utterance is ambiguous … MathSpeak would render the first expression above as: 'start root a end root plus b' and the second as 'start root a plus b end root.'"
- **Participants:** "Twenty-eight undergraduate education majors solicited from a block course on educational psychology and special education served as participants. The gender composition consisted of 18 females and 10 males." **These were not blind participants.**
- **Items:** "Twenty mathematical expressions with at least four possible interpretations when spoken in typical everyday mathematical terminology were developed for mathematical constructs of fractions, exponents, absolute values, and square roots. Five expressions for each construct were developed."
  - Two versions per item differed only in variables (p, q, r, s, t vs. v, w, x, y, z).
  - Synthetic voice: "the Cepstral voice of William".
  - The task was a four-choice identification, circling the expression just heard.
  - **The exact 20 expressions are not printed in the article.**
- **Training:** "Each training session lasted approximately four minutes." The order was counterbalanced.
- **Results:** "mean number of correctly interpreted expression collapsed over gender for MathSpeak was 18.93 and was 8.07 without MathSpeak. The distribution of scores … did not overlap (range with MathSpeak: 16 to 20; without MathSpeak: 2 to 13) … performance without MathSpeak did not differ from chance."
  - Main effects: rendering type F(1,48) = 197.689, p < .001; gender F(1,48) = 6.970, p = .011 (females 13.17, males 15.00).
  - Note: df = 48 is inconsistent with N = 28 as reported. This is flagged as a reporting oddity.
- **Discussion:** "MathSpeak rules appear to be easy to learn." The authors concede that untested MathSpeak rules are only "likely" to be similarly effective, and they attribute the gender effect to an artifact.
- **No per-construct scores** (fractions vs. exponents vs. absolute value vs. roots) are reported.

**Frankel, Brownstein, Soiffer & Hansen (2016), ETS RR-16-23 [TAM METİN]** — [ERIC full text](https://files.eric.ed.gov/fulltext/ED570857.pdf); DOI [10.1002/ets2.12103](https://onlinelibrary.wiley.com/doi/full/10.1002/ets2.12103)
- **N:** "Sixteen students with visual disabilities (blindness or low vision) who were taking or had completed Algebra 1 participated". Table 1: blind 8, low vision 8. One blind student did not finish, so the analysed N = 15 (7 blind, 8 low vision). Two schools for the blind; $25 gift cards; study conducted March 2012.
- **Design:** three parallel sections (clones) in three styles, with order and clone assignment counterbalanced (6/5/5 students per order). Prerecorded audio (Microsoft Anna, edited for mispronunciations) on MP3 players. There were 7 math statements per section with 8 scored math questions ("Each of the 15 students answered eight math questions for each of the three speech styles").
- **Measures:**
  - Decoding correctness (0/1, "adjusted correct")
  - Favorability (familiarity + understandability, 0–6)
  - Confidence in understanding (−1 to 3)
  - Math confidence (0–5)
  - Section-summary and most/least-helpful style ratings
- **Main results (Table 5):**

| Measure | ClearSpeak | SimpleSpeak | MathSpeak |
|---|---|---|---|
| Decoding, all / blind / LV | 0.89 / 0.91 / 0.88 | 0.70 / 0.78 / 0.64 | 0.56 / 0.67 / 0.46 |
| Favorability (0–6), all | 4.75 | 3.25 | 2.96 |
| Confidence (−1–3), all | 2.64 | 1.87 | 1.64 |
| Math confidence (0–5), all | 3.93 | 2.68 | 1.88 |

- "Because of the small sample, quantitative analysis is descriptive only" (no significance tests). The style most helpful overall was ClearSpeak for "two thirds of the students … none thought it the least helpful … Nearly all students thought MathSpeak was the least helpful."
- **Per-item results (Appendix C), decoding means CS / SS / MS:**
  - C1 5(3x−12)+2x(4x−6): 0.93 / 0.87 / 0.87
  - C2 (2)(4)(5+1)(3): 0.93 / 1.00 / 0.73
  - C3 16x⁹+12x¹³+5x⁷+1 ("biggest exponent"): 1.0 / 1.0 / 0.87
  - C4 sums of fractions with sums in numerators: 0.93 / 0.73 / 0.47
  - C5 fractions plus squared/cubed terms: 1.00 / 0.80 / 0.40
  - C6 x⁹·(y⁵/y²)·(z⁻⁷/z⁻³): 0.43 / 0.20 / 0.17
  - **C7 2^(y+1)+4 (exponent scope): 1.00 / 0.33 / 0.40**. ClearSpeak spoke it as "raised to the [exponent] power", SimpleSpeak as "super [exponent] end super" and MathSpeak as "superscript [exponent] baseline".
- **Exact spoken renditions (Appendix B), with pauses VS/S/M/L:**
  - ClearSpeak: "16 (M) x to the 9th power (L) plus 12 (M) x to the 13th power (L) plus 5 (M) x to the 7th power (L) plus 1"
  - MathSpeak: "16 (VS) x superscript (S) 9 baseline plus 12 …"
  - SimpleSpeak: "16 (S) x to the 9th (S) plus 12 …"
  - ClearSpeak for 5(3x−12)+2x(4x−6): "5 times (L) open parenthesis (M) 3 x (S) minus 12 (M) close parenthesis (L) plus 2x times (L) open parenthesis …"
- **Confound:** the MathSpeak build included an unintended "nested one deep" phrase in 3 of 7 expressions (Questions 26, 36, 46, 47). The authors say this "likely contributed" to MathSpeak's disadvantage, but the disadvantage remained elsewhere.
- **Qualitative findings:**
  - Students liked "raised to"/"power" and disliked "superscript", "baseline" and "super" ("Many stated that they did not know what the latter terms meant").
  - On parentheses, some found "open/close" too terse ("wondered what was being opened or closed"), and more preferred "open parenthesis/close parenthesis" to "left/right parenthesis".
  - On pauses, "students had difficulty understanding how the (intentional) pauses were meant to work".
  - One student: "The numerator and denominator stuff sounds like elementary school. I don't like it. Just use open and close for fractions."
- **Memory load rationale:** "short-term memory can hold 7 ± 2 chunks … only for about 15–30 seconds … an audio rendition should not needlessly contribute to verbal or memory load."
- **Context example:** 1/2 inside a list of fractions "may be preferable" as "The fraction one over two [pause] plus [pause] the fraction three over five …" for consistency. The same notation also changes meaning by context: "f(c) is 'f of c,' while in a multiplication lesson it is 'f times c.'"

**Frankel & Brownstein (2016), ETS RR-16-33 [TAM METİN]** — [ERIC full text](https://files.eric.ed.gov/fulltext/EJ1124730.pdf); DOI [10.1002/ets2.12119](https://onlinelibrary.wiley.com/doi/full/10.1002/ets2.12119)
- **N:** "22 students with visual disabilities (blindness or low vision). Students were aged 14–19 and were in grades 8–12. Ten students were blind, and 12 had low vision." Conducted in late Spring 2013 with Window-Eyes, Word and MathPlayer live TTS. Students could replay freely.
- **Prosodic toolkit:** "we reduced our prosodic tool kit to pauses and rate adjustments". Pitch and volume were dropped because many speech engines supported them inconsistently.
- **RQ1, square-root boundary.** Items were 1+√(x+y)−7 and 1+√(x+y−7). Question: "The expression under the square root is: a. x b. x plus y c. x plus y minus 7 d. I can't tell". Percent correct (Table 1):
  - Extended pauses (2750 ms pause at root end): **50%** (root ends mid-expression) / **68%** (root ends at end)
  - Normal pauses + 125% speed-up under root: **59% / 86%**
  - **"End root": 82% / 95%**
  - Exact speech for 1A: "1 [pause 400] plus [pause 100] the square root of [pause 300] x [pause 25] plus [pause 25] y [pause 2750] minus [pause 100] 7."
  - Statistics: end root vs. speed-up p = .017; end root vs. extended pauses p = .005 (chi-square). Helpfulness ratings: end root rated most helpful (p = .007, p = .010). Confidence differences were not significant.
  - **Authors: "In sum, neither prosodic treatment succeeded in compensating for the absence of explicit lexical end-markers."** Also: "End language appears to be more helpful than prosody for identifying boundaries of square roots."
  - As a result, end language is "available as a ClearSpeak preference for fractions, square roots, absolute value, matrices, and vectors", plus "a single preference setting that allows authors to set end language as the preference for all applicable structures at once."
  - Student quotes: "If the software is going to start an expression with a beginning root, then it needs to end it by saying 'end root.'"; "The long pause is not helpful. It wastes time and I have to keep the numbers in my head."; "Didn't know if the pause meant the root ended … It wasn't explained what the pause meant." Two students said "end root" is unnecessary when the root ends the expression.
- **RQ2, nested parentheses.** Item: 2((x+1)(x+3)−4((x−1)(x+2)−3)). Four treatments: uniform vs. graduated pauses, each with or without "open/close second paren" ("nth language"). No parsing question; students gave ranks and helpfulness ratings.
  - Mean ranks (lower is better): 2A uniform, no nth 2.64; **2B uniform + nth 2.00**; 2C graduated, no nth 2.64; 2D graduated + nth 2.59.
  - Helpfulness: 1.5 / 1.68 / 1.32 / 1.55.
  - Uniform beat graduated (mean rank 2.318 vs 2.614, p = .014). Nth language was more helpful under uniform pauses (p = .006).
  - Objection: "I mixed up the actual numbers with the parentheses numbers."
  - Conclusion: "some support was found for retaining uniform pauses and adding nth language to multiply-nested parentheses."
- **RQ3, implied times and parentheses** in long algebraic fractions, such as (3x−2)(x²+4)(2x+3)/…, under 4 treatments (parentheses spoken or not; 400 vs 800 ms pauses around "times"; 125% speed-up). Correctness was 0.81 / 0.81 / 0.88 / 0.82: "no statistical significance in any of these comparisons." "Without the ability to navigate the expressions, students just wanted to write them down."
- **Conclusions:**
  - "this study provided support for end language to delimit the scope of radicals and, perhaps by extension, similar language for other structures … (exponents, absolute values, fractions), and less support for uses of extended pauses or speeded-up speech to signal scope."
  - "navigation is necessary to understanding it purely through audio, and a full read-through of an expression in context may serve primarily to provide a rough idea."

**Related prior work cited inside RR-16-33 [ÖZET via RR-16-33]**
- Gellenbeck & Stefik (2009): pauses "were very useful for disambiguating", but with sighted computer-science students and without testing pause lengths.
- Karshmer, Gupta & Pontelli (2007): lexical indicators are "highly effective for disambiguation but add burdens to working memory." — cited in [RR-16-33](https://files.eric.ed.gov/fulltext/EJ1124730.pdf)

### Inferences
- The three studies agree. **Explicit lexical boundary words are what disambiguate.** Natural, classroom-familiar *vocabulary* ("power", "the fraction with numerator…") improves decoding and acceptance compared with symbol-mapping jargon ("superscript", "baseline", "nested one deep"). **Pauses help mainly as breathers.** They are not reliable boundary signals for untrained listeners.
- The best-supported hybrid: **classroom words + end words when the scope is longer than one simple token + uniform short pauses + interactive navigation or repeat.**
- Caveats: the samples are tiny (15 and 22), the analyses are descriptive or chi-square, the Isaacson sample was sighted, and RR-16-23 had a MathSpeak confound.

### Gaps
- Isaacson's 20 item texts and per-construct scores are not published in the article.
- No study tested end words for exponents or absolute value directly. RR-16-33 tested only roots and extrapolates to the rest.
- No study tested Turkish speech.

---

## Q3. Tools: MathCAT (speech, navigation, verbosity, languages) and Speech Rule Engine (locales). Is there Turkish?

### Takeaway
**Neither MathCAT nor Speech Rule Engine has a Turkish locale.** MathCAT 0.7.8 (crates.io, updated 2026-11-16) ships speech rules for de, el, en, es, fi, fr, hu, id, nb, pl, pt, ru, sv, vi, zh (+ test locale "zz"). SRE 4.1.5 ships af, ca, da, de, en, es, fr, hi, it, ko, nb, nn, sv (+ Nemeth/Euro braille). MathCAT is built into NVDA and JAWS. A Turkish NVDA or JAWS user therefore gets either English or another locale's rules for MathML, or the screen reader's raw symbol reading. I found no documentation of a Turkish math speech rule set.

### Cited Findings
- MathCAT 0.7.8 `Rules/Languages/` directories: de, el, en, es, fi, fr, hu, id, nb, pl, pt, ru, sv, vi, zh, zz. **No `tr`.** [TAM METİN] — [MathCAT 0.7.8 crate](https://static.crates.io/crates/mathcat/mathcat-0.7.8.crate); [crates.io/crates/mathcat](https://crates.io/crates/mathcat)
- Speech Rule Engine 4.1.5 `lib/mathmaps/`: af, base, ca, da, de, en, es, euro, fr, hi, it, ko, nb, nemeth, nn, sv. **No `tr`.** [TAM METİN] — [speech-rule-engine 4.1.5](https://registry.npmjs.org/speech-rule-engine/-/speech-rule-engine-4.1.5.tgz)
- **MathCAT user guide** [TAM METİN] — [MathCAT User Guide](https://daisy.github.io/MathCAT/users.html)
  - "In screen readers NVDA and JAWS, MathCAT comes built-in."
  - Speech styles: "[ClearSpeak.] Expressions are spoken approximately like a teacher would have said them in a classroom. SimpleSpeak. Expressions are spoken more concicely. The reading is sometimes ambiguous."
  - Verbosity: "Terse. 'Extra' words such as 'the' and 'of' in 'the square root of x' have been removed. [Medium.] … Verbose. Everything is read out. The readout is unambiguous."
  - Disability setting: "[Blindness.] The readout is unambiguous. Low vision. The readout is shorter."
  - MathRate (1–1000%) and "Pause factor: [1], can be adjusted between 0 and 10."
  - Navigation: "activate the navigation mode by pressing Space … NVDA-key+Alt+M". Modes: "[Enhanced mode.] Move between mathematically meaningful parts of an expression (e.g. numerator, denominator, exponents, expressions within parentheses). Simple mode … Character mode".
  - Keys: arrows move or zoom (Up = zoom out, Down = zoom in); Home/End; Space reads the current part; Enter is "Where am I"; number keys set or jump to place markers; Backspace moves back. "Speech after move mode: [Read.] … Describe. Gives an overview of the selected expression."
  - The language list in the guide does not include Turkish.
- MathCAT `Rules/prefs.yaml`: `Verbosity: Medium # Terse, Medium, Verbose`; `MathSpeak: Verbose # Brief, SuperBrief`; `NavVerbosity: Medium`. [TAM METİN] — [MathCAT 0.7.8 crate](https://static.crates.io/crates/mathcat/mathcat-0.7.8.crate)
- RR-16-33 notes that ClearSpeak prosody and navigation were integrated into Window-Eyes and NVDA via MathPlayer. — [RR-16-33](https://files.eric.ed.gov/fulltext/EJ1124730.pdf)
- An NVDA add-on "Access8Math" has a Turkish-language store page. I could not load its content, so its Turkish math-speech support is **unverified** [ÖZET]. — [NVDA add-on store: Access8Math (tr)](https://addons.nvda-project.org/addons/access8math.tr.html)
- Dijital Matematik (MEB-based audio and text content) authors math in Word so screen readers can voice it [ÖZET, from earlier notes]. — [Dijital Matematik, Hakkında](https://www.dijitalmatematik.org/hakkinda)

### Inferences
- A Turkish project cannot rely on off-the-shelf Turkish TTS math rules. It must either (a) produce its own Turkish spoken strings, for example LLM-generated, following a fixed rulebook (Q5), or (b) contribute a `tr` locale to MathCAT. MathCAT's language folders (ClearSpeak_Rules.yaml, SimpleSpeak_Rules.yaml, unicode.yaml, navigate.yaml, overview.yaml) are a ready template.
- MathCAT's concepts map directly onto a Turkish design: verbosity levels, an "unambiguous" blindness default, enhanced navigation (numerator / denominator / exponent), and "describe/overview" before reading.

### Gaps
- How NVDA or JAWS actually voice MathML or OMML equations when set to Turkish was not tested. Fallback behavior is unknown.
- The Access8Math Turkish localization and its rule content were not verified.

---

## Q4. Turkish documented conventions (MEB textbooks, Braille math, DergiPark evidence)

### Takeaway
**[BELGELENMİŞ]** The current MEB 7th-grade textbooks (2026–2027 edition) **prescribe the spoken forms**:
- negative numbers: "okunurken önce sembol (**eksi**), sonra sayı söylenir", so −5 is "eksi beş", not "negatif beş"
- 5⁴: "**beş üssü dört**" or "**beşin dördüncü kuvveti**"
- (2/3)⁵: "iki bölü üç üssü beş" or "iki bölü üçün beşinci kuvveti"
- a/b: "**a bölü b**"
- inequality signs: "< : **küçüktür**", "> : **büyüktür**", "≤ : **küçük veya eşittir**", "≥ : **büyük veya eşittir**"

The official (2/3)⁵ reading is itself ambiguous by ear with 2/3⁵, which shows the problem directly. Turkish blind learners report exactly these ambiguities: "2 üzeri 2x+1" (where does +1 go?), "2 kare 3" heard as a geometric square, and confusion with the ablative order of "büyüktür". Turkey has **no standard Braille math notation** (Aktaş & Argün 2020). MEB produced a "Braille Matematik Öğretmen Kılavuzu" (grades 1–8), but I could not retrieve its text.

### Cited Findings

**MEB textbooks [TAM METİN, BELGELENMİŞ]**
- **Negative numbers.** MEB Ortaokul Matematik 7, Book 1 (2026–2027), BİLGİ KUTUSU, p. 18 of the PDF: "Doğal başlangıcı olmayan çoklukları göstermek için doğal sayıların dışında başka sayılara ihtiyaç vardır. Bu sayılar, sayma sayılarının önüne '-' sembolü konularak gösterilir. **Bu sayılar okunurken önce sembol (eksi), sonra sayı söylenir.**" — [MEB Matematik 7, 1. Kitap (EBA CDN PDF)](https://cdn.eba.gov.tr/temel-egitim/yayin/2026-2027/ktp/matematik7-1.pdf); landing pages: [TYMM kitap listesi](https://tymm.meb.gov.tr/ogretim-programlari/ders/ortaokul-matematik-dersi)
  - The same book uses "negatif" as the *concept name* ("Negatif rasyonel sayılarda eksi (–) işareti …"; 47 occurrences) and "eksi (–) işareti" as the *sign name*. **So "negatif" names the category and "eksi" is the spoken reading.** — [same PDF](https://cdn.eba.gov.tr/temel-egitim/yayin/2026-2027/ktp/matematik7-1.pdf)
- **Exponents.** Same book, p. 98: "Üslü ifadelerde kendisiyle tekrarlı çarpılan sayıya taban denir … tabanın sağ üst köşesine yazılan sayıya üs veya kuvvet denir … **5⁴ üslü ifadesi 'beş üssü dört' veya 'beşin dördüncü kuvveti' şeklinde okunur.** • (2/3)⁵ üslü ifadesi '**iki bölü üç üssü beş**' veya '**iki bölü üçün beşinci kuvveti**' şeklinde okunur." — [MEB Matematik 7, 1. Kitap](https://cdn.eba.gov.tr/temel-egitim/yayin/2026-2027/ktp/matematik7-1.pdf)
- **Ratio/division.** MEB Matematik 7, Book 2, p. 41: "Bu oran a : b, a/b şeklinde gösterilir; '**a bölü b**' şeklinde okunur." — [MEB Matematik 7, 2. Kitap](https://cdn.eba.gov.tr/temel-egitim/yayin/2026-2027/ktp/matematik7-2.pdf)
- **Inequalities.** MEB Matematik 7, Book 2, p. 133: "İçinde '< , > , ≤ , ≥' sembollerinden en az birini bulunduran ifadeler eşitsizlik olarak adlandırılır. < : küçüktür > : büyüktür ≤ : küçük veya eşittir ≥ : büyük veya eşittir. Örneğin b < 7 eşitsizliği b'nin 7'den küçük olduğu …" — [MEB Matematik 7, 2. Kitap](https://cdn.eba.gov.tr/temel-egitim/yayin/2026-2027/ktp/matematik7-2.pdf)
  - Note: the textbook says "küçük **veya** eşittir", not the colloquial "küçük eşittir".
- **Absolute value.** MEB Matematik 7, Book 1, p. 36: "Bir sayının, belirlenen bir başlangıç noktasına olan uzaklığına mutlak değer denir." The theme's key-concept list includes "mutlak değer sembolü". No spoken form for |x| is prescribed. — [MEB Matematik 7, 1. Kitap](https://cdn.eba.gov.tr/temel-egitim/yayin/2026-2027/ktp/matematik7-1.pdf)
- **MEB Ordu ÖDM worksheet** "Tam Sayılarda Üslü Nicelikler", p. 2: 2⁴ is labelled "**İki üssü dört**" and "**İkinin dördüncü kuvveti**". It also notes the parenthesis role ("Parantez var mı, yok mu?") for the sign of powers of negatives. — [Ordu ÖDM PDF](https://orduodm.meb.gov.tr/meb_iys_dosyalar/2022_11/08120027_Tam_SayYlarda_Uslu_Nicelikler.pdf)
- **Ankara Üniversitesi open-course notes:** "aⁿ sayısı a'nın n. kuvveti veya a üssü n olarak okunur … 5.5.5=5³ (… 5 üssü 3 veya 5'in 3. kuvveti diye okunur.)" [TAM METİN] — [Ankara Üni. Açık Ders, Üslü İfadeler](https://acikders.ankara.edu.tr/mod/resource/view.php?id=17520)
- **"Üzeri"** does **not** appear as an official reading in the MEB books checked. It does appear in learners' and teachers' everyday speech, for example in the Aktaş & Argün participant quote below and on test-prep sites ([Doping Hafıza, from earlier notes, ÖZET](https://www.dopinghafiza.com/ders/tyt-matematik/uslu-ifadeler)).
- **Square root ("karekök").** The secondary sites from the earlier notes read √x as "x'in karekökü" [ÖZET] ([Derspresso](https://www.derspresso.com.tr/matematik/koklu-ifade/tanim)). The 8th-grade MEB textbook, where roots are taught, was not available at the CDN path tried (HTTP 404), so it is not verified.

**Turkish empirical evidence on spoken-math ambiguity [TAM METİN]** — Aktaş, F. N. & Argün, Z. (2020), *Turkish Journal of Computer and Mathematics Education* 11(1), 128–156, DOI 10.16949/turkbilmat.602095 — [DergiPark PDF](https://dergipark.org.tr/en/download/article-file/994140)
- Six visually impaired adults (≥90% vision loss, at least high-school graduates), in task-based clinical interviews (2 sessions of about 90 minutes each).
- Abstract: "Türkiye'de kabartma yazıda matematiksel dile ait bir standart yer almamaktadır."
- **Exponent scope (Okan):** "Mesela karışan durumlarda üslü ifadede üssün konumu! **2 üzeri 2'de tamam bir sorun yok**, 2 orada duruyor. **Ama 2 üzeri 2x+1 diyor mesela bunu algılamakta. Mesela artı bir nerede yanında mı, sağında mı, solunda mı bunu nasıl ifade edeceğiz?**" The authors interpret this as a need to describe "'üssü ya da üzeri' kelimelerinin yazı dilinde karşılığı".
- **"Kare" misconception (Erdem):** "lise 1'de üslü sayılar anlatılırken, **2 kare 3 diyordu hoca veya 3 kare 5** vs oradaki kareyi ben görsel olarak … hep kare çizip yazıyordum … Kare dediğimiz şeyin üsse küçük bir sembol olarak yazıldığını bilmiyordum. […] mutlak değer diyor ki iki tane çizgi var diyor."
- **Inequality direction (Cem):** for 18a−12 > 12a+30, Cem said it shows "12a+30'un 18a−12'den büyük olduğunu" ("Sonra gelen daha büyüktür"). Şeyda: "18a-12 büyüktür (vurgulu söyler) 12a+30'dan. Ben bunu çok karıştırırdım … Mesela ben '-den' ifadesinin sayıların en sonuna geldiğini hayal ederek yapıyorum."
- **Distributive narration (Şeyda):** a teacher who explains as if writing on a board ("şuraya şunu koyuyoruz") is not understood. What works is: "'2 parantezinde 2x+1 demiştik değil mi, 2'yi alıyoruz parantez içine dağıtıyoruz. Nasıl dağıtıyoruz, 2'yi 2x'le çarpıyoruz 4x, orda 1 ile 2'yi çarpıyoruz 2, 4x+2 oluyor değil mi Şeyda?' dediği zaman ben orda haa bu parantezin içine böyle dağıtılıyormuş diyorum."
- The authors conclude that readers and teachers need a "betimleyici bir dil" (descriptive language) for symbols, equations and operations.
- The article cites **"Braille Matematik Kılavuzu, 2017, s. 13"** for fraction notation in Turkish Braille.

**Exams and readers in Turkey [TAM METİN]** — Yıldırım, H. H. & Çakmak, S. (2024), *Adıyaman Üni. SBE Dergisi* (48), 59–81 — [DergiPark PDF](https://dergipark.org.tr/en/download/article-file/4183980)
- "görme engelli öğrencilere merkezi sınavlarda okuyucu desteği de sunulmaktadır."
- Students report performance depends on "okuyucuların sosyo-kültürel durumlarının, okuma ve telaffuz gibi performanslarının ve uzmanlık alanlarının" (citing Şenel & Kutlu, 2018).
- "okuyucunun matematik kavramlarını doğru ifade etmekte zorlanması … sınav performansını olumsuz bir şekilde etkilemektedir."
- Students are exempted from figure, graph and picture items in central exams. The authors recommend describing figures instead of exempting students, and computer-based exams.
- **No standardized Turkish reader script for math is cited.**

**Turkish Braille math notation**
- MEB news (ÖRGM) [TAM METİN of the news text]: the guide is "4 bölümden oluşan, Cumhuriyet tarihinde ilk olacak 'Braille Matematik Öğretmen Kılavuzu'". It covers "1. sınıftan 8. sınıfa kadar matematik dersi kazanımlarının Braille yazımları, örnek sorular ve çözümleri"; "Terim ve sembollerin Braille alfabesindeki karşılıkları"; "tam, üslü ve köklü sayılar gibi temel kavramlar ile cebirsel ifadeler"; and küptaş kasa and abaküs "standardizasyon". It was prepared by visually impaired education teachers in Ankara, Antalya, İzmir, İstanbul and Eskişehir. — [MEB haber 14975](https://www.meb.gov.tr/quotbraille-matematik-kilavuzuquot-gorme-engelli-ogrencilere-isik-olacak/haber/14975/tr)
- The guide PDF path cited in the literature (`orgm.meb.gov.tr/dosyalar/00001/braille_mat_kilavuzu.pdf`) could not be reached this session (connection failure). Its *spoken-reading* content is unknown. — [cited in Aktaş & Argün 2020](https://dergipark.org.tr/en/download/article-file/994140)
- Duxbury Systems' summary of the Turkish Braille System manual's math chapters [ÖZET, secondary]: operation signs; enclosures; "Unary signs: + and -"; decimal point "written as a comma, is dot 2"; fractions "Turkish uses German-style numeric fractions. Synthetic enclosure: <>"; "Superscript is + … Use synthetic enclosures if there is more than one thing in superscript: <>"; "Radical sign (square root) is % The use may follow German usage"; sets; functions and calculus; geometry. — [Duxbury: Turkish Braille System TOC](https://www.duxburysystems.org/codes/turkish_toc.htm)
  - **Relevance:** Turkish Braille, like Nemeth, marks multi-item exponents with explicit grouping ("synthetic enclosures"). Spoken "üs başla … üs bitti" therefore mirrors what braille readers already do.
- Turkish Braille math signs were adapted in 1951 [ÖZET, from earlier notes]. — [MEB ÖRGM news](https://orgm.meb.gov.tr/www/ampquotbraille-matematik-kilavuzuampquot-gorme-engelli-ogrencilere-isik-olacak/icerik/966)
- MEB's weekly timetable for visually impaired schools lists a "Braille Matematik" course [ÖZET, search summary]. — [ÖRGM haftalık ders çizelgesi](https://orgm.meb.gov.tr/meb_iys_dosyalar/2024_09/27224757_ozelegitimilkokullariveortaokullarihaftalikderscizelgesigormeengelliogrencilericin.pdf)

**Earlier Turkish evidence kept [ÖZET]**
- Ankara University thesis: computer audio reading vs. a live reader on TEOG math found no significant difference. — [Ankara Üniversitesi DSpace](https://dspace.ankara.edu.tr/server/api/core/bitstreams/7f26295a-a6ce-4435-9012-5672d13becef/content)

### Inferences
- **Answer to "negatif beş vs eksi beş":** the MEB curriculum text prescribes **"eksi beş"** for −5. "Negatif" is the category name ("negatif tam sayı"). I found **no MEB textbook passage prescribing "negatif beş"** as a reading. In Turkish school speech, unary and binary minus are therefore both "eksi", unlike the ETS rule ("negative five", "x minus five").
  - Consequence: "eksi iki kare" is ambiguous between −2² = −4 and (−2)² = 4, and "üç eksi eksi beş" becomes the reading of 3 − (−5).
- **The official exponent reading is ambiguous with compound bases.** "iki bölü üç üssü beş" can be heard as (2/3)⁵ or 2/3⁵. The genitive variant ("iki bölü üçün beşinci kuvveti") has the same problem. This is a documented, curriculum-level instance of the scope problem that MathSpeak and ClearSpeak solve with boundary words.
- Turkish word order and the ablative are the source of the inequality-direction confusion. "a büyüktür b" (literal symbol reading) is not natural Turkish; the natural form is "a, b'den büyüktür". Learners like Şeyda mentally re-map "-den". A rulebook should pick one form and keep it consistent.

### Gaps
- The full text of the MEB Braille Matematik Öğretmen Kılavuzu (2017) was not retrieved. Whether it gives *spoken* forms ("parantez aç/kapa", "kök içi") is unknown.
- The 8th-grade (roots) and 9th–12th-grade (functions, logarithms, trig, intervals, sets) MEB textbooks were not checked for "okunur" statements.
- No Turkish experimental study (Isaacson-style) on spoken-math disambiguation was found. YÖK Tez was not searched directly.
- How ÖSYM or MEB exam readers are instructed to read math, and whether a reader script exists, was not found.

---

## Q5. Reasoned Turkish proposal (clearly separated from documented practice)

### Takeaway
**[ÖNERİ]** Use MEB vocabulary as the base ("eksi", "üssü", "bölü", "küçüktür/büyüktür", "karekök", "mutlak değer") so speech matches the classroom. That was the ClearSpeak lesson from RR-16-23. On top of it, add **explicit open/close words whenever an operator's scope is longer than one simple token**, as RR-16-33 and Isaacson 2014 support. Turkish puts operators *after* their operand ("x'in karekökü", "…'in mutlak değeri", "…'in karesi"). The rule is therefore: **for complex operands, use a prefix opener + content + a closer.** For simple operands, keep the natural MEB form. Add uniform short pauses only as breathers, a structure overview first, and repeat or part-by-part navigation.

### Cited Findings (evidence each proposal rests on)
- Classroom-like vocabulary gave the best decoding (0.89 vs 0.56–0.70), and jargon ("superscript", "baseline", "super") was disliked. — [ETS RR-16-23](https://files.eric.ed.gov/fulltext/ED570857.pdf)
- End words beat pauses and speed-ups for scope (82–95% vs 50–86%). — [ETS RR-16-33](https://files.eric.ed.gov/fulltext/EJ1124730.pdf)
- Boundary markers raised identification from chance (8.07/20) to near ceiling (18.93/20) after 4 minutes of training. — [Isaacson et al. 2014](https://jsesd.github.io/web-articles/JSESD-Volume-14/1015-Isaacson/)
- Uniform pauses plus ordinal parenthesis words were preferred for nesting. — [ETS RR-16-33](https://files.eric.ed.gov/fulltext/EJ1124730.pdf)
- ETS readers: pre-read silently, use "end fraction" if unclear, "end quantity" in complex expressions, and pauses for grouping. — [ETS Guidelines](https://www.eu.ets.org/pdfs/disabilities/guidelines-for-test-reader.pdf)
- MEB official spoken forms: eksi, üssü / n'inci kuvveti, bölü, küçüktür / büyüktür / küçük veya eşittir. — [MEB Mat 7-1](https://cdn.eba.gov.tr/temel-egitim/yayin/2026-2027/ktp/matematik7-1.pdf); [MEB Mat 7-2](https://cdn.eba.gov.tr/temel-egitim/yayin/2026-2027/ktp/matematik7-2.pdf)
- Turkish blind learners' confusions: "2 üzeri 2x+1", "2 kare 3", "büyüktür" direction; and their request for descriptive narration. — [Aktaş & Argün 2020](https://dergipark.org.tr/en/download/article-file/994140)
- Navigation and overview ("Describe") are standard in MathCAT. — [MathCAT User Guide](https://daisy.github.io/MathCAT/users.html)

### Inferences — Proposed Turkish rulebook [ÖNERİ, untested with Turkish listeners]

**General rules**
1. **Simple vs. complex.** Adapt ClearSpeak's "simple expression" definition: a number, one letter, a coefficient + letter (2x), or the negative of one of these. Use the natural MEB form for simple operands. Use opener + closer for anything longer.
2. **Closers are mandatory** for root, exponent, absolute value, fraction and parentheses whenever their content is not simple **and** the expression continues after them. They may be dropped when the structure ends the whole expression. Two RR-16-33 students said this, and 1F reached 95%. In exam or homework mode, still keep closers for consistency.
3. **Vocabulary = MEB.** Do not use MathSpeak-style "üst simge / taban çizgisi".
4. **Pauses:** short, uniform pauses (SSML about 250–400 ms) at structure boundaries, as an addition to the words, never a replacement.
5. **Overview first for long items** ("Bu eşitliğin sol tarafında bir kesir, sağ tarafında iki terim var"), then the full reading, then an offer of part-by-part repetition ("payı tekrar et"). This mirrors MathCAT Describe and navigation and RR-16-33 RQ3.
6. **Pre-read and do not solve while reading.** This applies to human readers (ETS).

**Construct table**

| Expression | Documented MEB / common reading | Proposed concise (simple operand) | Proposed explicit (complex operand) |
|---|---|---|---|
| −5 | "eksi beş" (MEB) | "eksi beş" | — |
| 3 − (−5) | — | — | "üç eksi, parantez içinde eksi beş, parantez kapandı" (alternative: "üç eksi, negatif beş") |
| −2² vs (−2)² | — | −2²: "eksi, iki kare" | (−2)²: "parantez içinde eksi iki, parantez kapandı, kare" |
| x − 5 | "x eksi beş" | same | — |
| 2/3 | "üçte iki" (common); "2 bölü 3" (MEB a/b) | "üçte iki" | — |
| x/2 | "x bölü iki" | same | — |
| (x+1)/2 | — | — | "kesir: payı x artı bir; paydası iki; kesir bitti" |
| x + 1/2 | — | "x artı, ikide bir" | — |
| a + b/c + d | — | — | "a artı, b bölü c, artı d" (short pause after "c") |
| x², x³ | "x kare", "x küp" | same | — |
| 5⁴ | "beş üssü dört" / "beşin dördüncü kuvveti" (MEB) | "beş üssü dört" | — |
| 2^(2x+1) | "2 üzeri 2x+1" (ambiguous, documented complaint) | — | "iki üssü, üs başlıyor: iki x artı bir, üs bitti" |
| 2^(2x) + 1 | — | "iki üssü iki x, artı bir" | — |
| (2/3)⁵ | "iki bölü üç üssü beş" (MEB; ambiguous) | — | "parantez içinde iki bölü üç, parantez kapandı, üssü beş" or "üçte ikinin beşinci kuvveti" |
| 2/3⁵ | — | — | "iki bölü, üç üssü beş" |
| √x | "x'in karekökü" / "karekök x" | "karekök x" | — |
| √(x+1) | — | — | "karekök içinde: x artı bir, kök bitti" |
| √x + 1 | — | "karekök x, artı bir" | — |
| ∛8 | "sekizin küpkökü" | "küpkök sekiz" | — |
| \|x\| | ("mutlak değer" concept, MEB) | "mutlak değer x" | — |
| \|x − 1\| | — | — | "mutlak değer içinde: x eksi bir, mutlak değer bitti" |
| 2(x+3) | — | — | "iki çarpı, parantez içinde x artı üç, parantez kapandı" |
| nested ((…)) | — | — | "birinci parantez aç … ikinci parantez aç … ikinci parantez kapandı … birinci parantez kapandı" (RR-16-33 "nth paren") |
| x < 7 | "x küçüktür yedi" (MEB symbol name) | "x, yediden küçüktür" or "x küçüktür yedi" (pick one per product) | — |
| x ≤ 3 | "küçük veya eşittir" (MEB) | "x küçük veya eşittir üç" | — |
| −2 < x < 5 | — | — | "x, eksi ikiden büyük ve beşten küçük" (state the variable first) |
| f(x) | — | "f x" / "f parantez x" | f(x+1): "f, parantez içinde x artı bir, parantez kapandı" |
| log₂ 8 | — | "iki tabanında logaritma sekiz" | log(x+1): "logaritma, parantez içinde x artı bir, parantez kapandı" |
| ln x | — | "l n x" / "doğal logaritma x" | — |
| sin x / sin²x | — | "sinüs x" / "sinüs kare x" | sin(x+y): "sinüs, parantez içinde x artı y, parantez kapandı" |
| x ∈ A | — | "x, A kümesinin elemanıdır" | — |
| {1,2,3} | — | "elemanları bir, iki, üç olan küme" | {x \| x>2}: "x ikiden büyük olmak üzere, x'lerin kümesi" |
| [2, 5) | — | — | "iki dahil, beş hariç, ikiden beşe aralık" (adapting the ClearSpeak Interval preference) |

**Turkish-specific reasoning**
- **Postfix operators.** In "x artı birin karekökü" the listener only learns that a root exists after hearing the operand, and cannot tell where it started. A prefix opener ("karekök içinde…") fixes the start, and the closer ("kök bitti") fixes the end.
- **"Üssü" vs "üzeri".** MEB uses "üssü". "Üzeri" is colloquial and has spatial connotations ("on top of"), which feed the "kare = square shape" misconception. Use "üssü" plus an explicit "üs bitti".
- **"Eksi" for unary minus is the curriculum norm.** Keep "eksi" for consistency with MEB. Disambiguate by structure instead (parenthesis words, or saying the sign before "kare" or "üssü"). Offer "negatif" only as an optional verbosity setting. This deviates from ETS "negative", and that deviation is deliberate because it follows the Turkish classroom.
- **Inequalities:** the MEB symbol names ("küçüktür") produce non-Turkish order ("a küçüktür b"). The natural sentence order "a, b'den küçüktür" is what learners map onto (Şeyda). Recommend the natural order with the comparison word at the end, and test both.
- **TTS pitfalls:** suffix attachment after symbols ("x'in", "2'nin", "5'inci"), and letter names ("iks", "ye", "fe/ef"). Fix them in a lexicon, as RR-16-23 had to edit "thex" and "dwy" out of the TTS output.

**Validation proposal:** replicate Isaacson et al. in Turkish. Use 20 ambiguous items (5 each: kesir, üs, kök, mutlak değer), a four-choice format, MEB-natural reading vs. this rulebook, and blind or low-vision students. Add an RR-16-33-style comparison of "kök bitti" vs. a pause only.

### Gaps
- None of the Turkish proposals has been tested with Turkish blind listeners.
- No documented Turkish spoken forms were found for logarithms, trig, sets or intervals in MEB "okunur" boxes; the relevant high-school books were not checked. The proposals for these rows are mine.
- Whether "pay / payda" framing or "kesir başlıyor … kesir bitti" framing is easier for Turkish students is unknown. One RR-16-23 student disliked "numerator and denominator" as sounding elementary.

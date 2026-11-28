# Working Memory, Auditory Processing and Cognitive Load When Blind Students Process Spoken Math Problems (full-text verification)

> **Method and tags.** I used curl, pdftotext and Playwright, and read the primary full texts myself wherever the network allowed. Each claim carries two tags:
> - **[TAM METİN]**: I read it in the primary full text.
> - **[ÖZET]**: it comes only from an abstract, a search-engine summary or a secondary summary.
>
> Samples are tagged **[KÖR]** (blind or visually impaired participants) or **[GENEL]** (sighted or mixed). Downloaded copies are in `/tmp/claude-0/-home-user-demo-g-zl-k/3cc8a036-cee7-56b5-90a7-7dc50a0e0eaf/scratchpad/kaynaklar/bellek/`.
>
> **Corrections to the earlier notes** (`research_notes/Görme engellilere sözlü soru anlatımı/calisma_bellegi.md`), all checked against full texts:
> 1. **Riga & Kouroupetroglou (2024) is the reverse of what the earlier notes said.** Operators were the *least* forgotten element type, not the hardest to remember.
> 2. **The Beal JOLT paper has a different title.** It is "An Online Math Problem Solving System for Middle School Students who are Blind" (Beal & Shaw 2009). "Working memory and math problem solving by blind middle and high school students: Implications for universal access" is a separate SITE 2008 conference paper (pp. 5011–5016), whose full text I could not reach.
> 3. **The Beal word-count range is inconsistent inside the paper itself.** It is given as 37–85 in one place and 37–87 in another.
> 4. **Abedi & Lord rewrote 20 items, not 69.** Sixty-nine was the pool of released NAEP items they chose from.
> 5. **The Rey et al. (2019) cognitive-load finding needs restating.** The non-significant load effect applies to *learner-paced* segmentation. It is not about "learners who already set their own pace".
> 6. **I could not verify the phrase "small, simple chunks" for Leahy & Sweller (2016).** Only the abstract was reachable (the paper is paywalled).

## Q1. What do the Beal et al. full texts report: word counts, readability, accuracy by problem type, listening counts and length effects?

### Takeaway
[KÖR][TAM METİN] Eleven blind middle-school students solved 32 text-to-speech word problems, 37–85 or 37–87 words long (mean 57). Accuracy was 82% on arithmetic and 59% on fractions. Students played each problem about twice (about 2.07 plays for arithmetic and 2.01 for fractions), with free replay. Averaged across topics, word count did not affect accuracy, replay or errors (0.74 → 0.68 from the shortest to the longest problems). One topic is an exception the authors do not discuss: on fraction multiplication, accuracy fell from 0.90 to 0.27 as problems got longer. The paper reports **no readability statistics, no inferential tests and no high-school data.**

### Cited Findings
- [KÖR][TAM METİN] Problem selection rules: only problems that could be solved from the text alone (no table, graphic or map); at least 20 sighted students had already solved the problem; four problems for each of 8 topics. The arithmetic topics were addition, subtraction, multiplication and division. The fractions topics were identifying numerator or denominator, multiplying fractions, subtracting with like denominators, and adding fractions with unlike denominators (the latter is labelled "Subtract Unlike" in the tables). — [Beal & Shaw 2009, JOLT 5(4), PDF](https://jolt.merlot.org/vol5no4/beal_1209.pdf); [HTML](https://jolt.merlot.org/vol5no4/beal_1209.htm)
- [KÖR][TAM METİN] Length was varied on purpose, because "accessing information via audio might be expected to place considerable demands on working memory." Average length of the 32 problems: **57 words, range 37 to 85** (methods section). The discussion section says "from a low of **37 words to a maximum of 87 words**", so the paper contradicts itself. Example: the four addition problems were **46, 56, 63 and 85 words**. — [JOLT PDF](https://jolt.merlot.org/vol5no4/beal_1209.pdf)
- [KÖR][TAM METİN] Audio setup: Cepstral text-to-speech, converted to mp3. Students used a "play problem" link and could listen "as often as he or she wished". They had up to three answer attempts, with generic audio feedback after a wrong answer ("Check your calculations and try again" / "This is a challenging problem. Try once more."). A Brailler or abacus was allowed; calculators were not. The screen reader was JAWS. Most students needed two sessions to finish the 32 problems. — [JOLT PDF](https://jolt.merlot.org/vol5no4/beal_1209.pdf)
- [KÖR][TAM METİN] Table 1, blind students (N = 11), proportion correct / incorrect attempts / audio plays per problem:

  | Topic | Correct | Incorrect attempts | Plays |
  |---|---|---|---|
  | Addition | .95 | .47 | **2.25** |
  | Subtraction | .92 | .36 | **1.63** |
  | Multiplication | .70 | .91 | 2.18 |
  | Division | .73 | .93 | 2.25 |
  | **Arithmetic overall** | **.82** | .67 | **2.07** |
  | Identify numerator / denominator | .61 | .97 | 2.11 |
  | Multiply fractions | .61 | 1.50 | 2.04 |
  | Subtract, like denominators | .69 | .97 | 1.63 |
  | Unlike denominators | .48 | 2.13 | 2.16 |
  | **Fractions overall** | **.59** | 1.39 | **2.01** |

  Sighted comparison group (overall correct): arithmetic .81, fractions .68. There were 20–70 sighted students per problem (mean 32). — [JOLT PDF](https://jolt.merlot.org/vol5no4/beal_1209.pdf)
- [KÖR][TAM METİN] The authors' reading: "there was no difference in the number of times that blind students listened to arithmetic and fractions problems (roughly, twice per problem)", so the lower fractions score "was due to the more challenging mathematics, rather than some issue with the audio quality". — [JOLT PDF](https://jolt.merlot.org/vol5no4/beal_1209.pdf)
- [KÖR][TAM METİN] Table 2, proportion correct for each topic's four problems, shortest to longest:

  | Topic | 1 (shortest) | 2 | 3 | 4 (longest) |
  |---|---|---|---|---|
  | Addition | 1.00 | .90 | 1.00 | .90 |
  | Subtraction | .90 | .90 | 1.00 | .90 |
  | Multiplication | .72 | .72 | .72 | .63 |
  | Division | .82 | .91 | **.36** | .81 |
  | Numerator / denominator | .45 | .54 | .72 | .72 |
  | **Fraction multiplication** | **.90** | **.81** | **.45** | **.27** |
  | Like denominators | .64 | .56 | .78 | .78 |
  | Unlike denominators | .50 | .40 | .52 | .48 |
  | **Mean across topics** | **.74** | **.71** | **.69** | **.68** |

  The authors: "word count alone did not seem to influence students' success… Problem word count also did not appear to influence the probability that the student would replay the problem or make incorrect answer attempts." No statistical test is reported. — [JOLT PDF](https://jolt.merlot.org/vol5no4/beal_1209.pdf)
- [KÖR][TAM METİN] Limitations the authors name: the blind sample was "a relatively select group" of academically successful students. In the sighted comparison group's district, fewer than 40% of students reached "basic" proficiency. — [JOLT PDF](https://jolt.merlot.org/vol5no4/beal_1209.pdf)
- [KÖR][ÖZET] The SITE 2008 paper (Beal & Shaw, pp. 5011–5016) set out to study problems "varying in text length and grade-level readability", using replay actions as a measure. Its full text could not be reached: the Paths to Literacy page returned a Cloudflare block, and the Arizona PDF link returned a 236-byte HTML page. — [Paths to Literacy](https://www.pathstoliteracy.org/research/working-memory-and-math-problem-solving-blind-middle-and-high-school-students-implications); [Springer reference list](https://rd.springer.com/content/pdf/10.1007%2F978-3-642-31522-0_23.pdf)
- [KÖR][TAM METİN] Follow-up (Beal & Rosenblum, JVIB, abstract read): 29 visually impaired students in grades 4–11 used an iPad app, with 19 TVIs. They completed 984 word problems and solved **80% within three attempts**. Use of hints and "worked-example" videos was **low**. — [ERIC EJ1114434 PDF](https://files.eric.ed.gov/fulltext/EJ1114434.pdf)

### Inferences
- **About two plays per problem is the normal baseline** for blind middle-schoolers on problems of 37–87 words. Make replay free and easy, and do not penalise it.
- "Length doesn't matter" holds only on average. On fraction multiplication, accuracy fell from 0.90 to 0.27 as length grew, and one division item dropped to 0.36. With 11 students and four items per topic, item effects cannot be separated from length effects. A cautious reading: **for content that needs several operations or fractions, longer audio may still hurt.**
- No readability measure was reported, so this source cannot support a readability threshold.
- Hint and video use was low (Beal & Rosenblum). On-demand help is not enough on its own; prompts for help may need to be offered to the student.

### Gaps
- I could not reach the SITE 2008 full text, so any readability or length analysis in it is unknown.
- I found no high-school data or JVIB paper by Beal, Rosenblum and Smith. A JVIB paper under those names does not appear to exist; the closest is Beal & Rosenblum's iPad study.
- No inferential statistics exist for the length effect.

## Q2. Leahy & Sweller (2011, 2016), the transient information effect: what exactly do they recommend?

### Takeaway
[GENEL][ÖZET] Only the abstracts were reachable (Springer and Wiley are paywalled). In 2016, long spoken text was worse than the same text written (the modality effect reversed). The "shorter" spoken text was still not better. Only a further-shortened spoken text beat visual-only (an interaction of modality with text length). I could not verify the exact word counts or the phrase "small, simple chunks".

### Cited Findings
- [GENEL][ÖZET; I read the full abstract on the Springer page via Playwright] Leahy & Sweller 2016, *Instructional Science* 44:107–123. Task: reading a contour map. Experiment 1: "longer audio text information… was inferior to the equivalent longer visual text information demonstrating a reversal of the modality effect due to transient information imposing a heavy working memory load". With the shorter text there was no modality effect; the authors hypothesised that "the shorter text still contained too much auditory information". Experiment 2 shortened the text further and found "a modality by text length interaction in which shorter, audio-visual information was better than visual only information but longer, audio-visual information was worse than visual only information." — [Springer, DOI 10.1007/s11251-015-9362-9](https://doi.org/10.1007/s11251-015-9362-9)
- [GENEL][ÖZET] Leahy & Sweller 2011, *Applied Cognitive Psychology* 25(6):943–951. Experiment 1 had 24 primary-school students learning to read a temperature graph, and audio/visual instruction beat visual-only. The study tested whether complex spoken statements would eliminate or reverse the modality effect. — [Macquarie record](https://researchers.mq.edu.au/en/publications/cognitive-load-theory-and-the-effects-of-transient-information-on/); [Zendy DOI 10.1002/acp.1787](https://zendy.io/title/10.1002/acp.1787)
- [GENEL][ÖZET] A separate study, Singh, Marcus & Ayres (2012, *Appl. Cogn. Psychol.* 26:848–853), tested segmenting spoken versus written text as a fix for the transient information effect. I did not verify its results. — [Search summary; Leahy & Sweller 2011 record](https://researchers.mq.edu.au/en/publications/cognitive-load-theory-and-the-effects-of-transient-information-on/)

### Inferences
- The clearest quantitative-style message: **a spoken text you think is "short enough" may still be too long. Shorten it once more.** This evidence comes from sighted students, with audio plus a visual, on non-math tasks.

### Gaps
- Word counts and slide durations for each condition (reportedly in the 2016 appendix), effect sizes, and the exact recommendation wording were not reachable.

## Q3. Riga & Kouroupetroglou 2024 (MDPI MTI 8(7):57): exact recall thresholds by expression length and modality, and error types

### Takeaway
[KÖR][TAM METİN] Sixteen blind adults heard each expression **once, with no navigation, at default speech rate**. Up to **10 elements**, recall was equally good in all three modalities. From **11 to 35 elements**, audio-only recall was significantly worse than tactile, and worse still than audio plus tactile. At 46 elements everyone did poorly. Errors rose linearly with complexity, steepest for audio (slope 0.570 versus 0.449 tactile and 0.389 audio–tactile). Deletions were by far the most common error. **Operators were the least forgotten**, not the most.

### Cited Findings
- [KÖR][TAM METİN] Participants: 16 blind adults (age 21.25 ± 5.98; 8 women and 8 men; 95–100% vision loss), all braille-literate (15.18 ± 5.77 years) and daily screen-reader users, Greek-speaking. Stimuli: 25 expressions × 3 parallel sets = 75 items, drawn from Raman's AsTER (fractions, roots, sums, integrals, limits and similar). — [Riga & Kouroupetroglou 2024, OA PDF (Semantic Scholar mirror, CC BY)](https://pdfs.semanticscholar.org/9e8d/57260f7579c4e7c015533d31336d6ef3b60d.pdf); [MDPI page](https://www.mdpi.com/2414-4088/8/7/57)
- [KÖR][TAM METİN] Audio condition: MathPlayer with the Acapela Greek voice "Dimitris" at **default speech rate and pitch**; users could change only the volume. "The participants did not have the option to navigate in the MEs." Each stimulus was heard or read **only once** ("not allowed to repeat"), then written down on a braille machine. Mean time per expression: **7.88 s audio**, 46.18 s tactile, 54.06 s audio–tactile. — [OA PDF](https://pdfs.semanticscholar.org/9e8d/57260f7579c4e7c015533d31336d6ef3b60d.pdf)
- [KÖR][TAM METİN] Complexity was defined as C = structural elements + numbers/identifiers + operators. Total recall errors: **5,408 (audio 2,403; tactile 1,606; audio–tactile 1,399)**. In ANOVA, modality, error type and element type each had a significant effect (modality F(2,405) = 10.8; error type F = 111.0; element F = 15.5), with no interactions. Audio had more errors than tactile (p = .022) and than audio–tactile (p = .018). — [OA PDF](https://pdfs.semanticscholar.org/9e8d/57260f7579c4e7c015533d31336d6ef3b60d.pdf)
- [KÖR][TAM METİN] Error types: **deletions (omissions)** were significantly more common than insertions and substitutions. Element types: the sets held 192 identifiers, 163 structures and 103 operators. Mean recall error for operators was **significantly lower** than for identifiers (p < .01) and structures (p < .01). Abstract wording: "operator elements are the hardest to forget". Conclusion: "recall errors in operators are less frequent than in structures and identifiers." — [OA PDF](https://pdfs.semanticscholar.org/9e8d/57260f7579c4e7c015533d31336d6ef3b60d.pdf)
- [KÖR][TAM METİN] Regression RE = a + bC (constant a; slope b with 95% CI):

  | Modality | a | b | 95% CI for b |
  |---|---|---|---|
  | Audio | −4.4 | 0.570 | 0.512–0.628 |
  | Tactile | −4.2 | 0.449 | 0.395–0.503 |
  | Audio–tactile | −3.6 | 0.389 | 0.334–0.444 |

  The relationship was linear, not exponential. — [OA PDF](https://pdfs.semanticscholar.org/9e8d/57260f7579c4e7c015533d31336d6ef3b60d.pdf)
- [KÖR][TAM METİN] Threshold (Table 3): "In expressions of low complexity (**up to 10 items**), the participants performed equally well in all three modalities. Starting from the medium complexity of **11 items and up to 35 items**, participants performed significantly better… in Tactile and especially in Auditory–Tactile Modalities than in Auditory Modality… equally poorly in the high-complexity expression containing **46 items**."
  - Audio versus audio–tactile p-values: 11 elements p = .007; 14 elements p < .001; 26 elements p = .001; 35 elements p = .007.
  - Not every medium level was significant (12 elements p = .088; 19 elements p = .321). — [OA PDF](https://pdfs.semanticscholar.org/9e8d/57260f7579c4e7c015533d31336d6ef3b60d.pdf)
- [KÖR][TAM METİN] Authors' recommendation: "segmenting a math expression into smaller parts will benefit the ability of the blind reader to retain it in memory"; "long MEs should be given to the student in smaller parts". For medium complexity, they consider braille the better choice. They also cite a source saying auditory information stays in short-term memory for about 10–30 s. — [OA PDF](https://pdfs.semanticscholar.org/9e8d/57260f7579c4e7c015533d31336d6ef3b60d.pdf)

### Inferences
- **A working limit for an audio-only, single-hearing expression: about 10 math elements** (numbers, variables, operators and structures such as fractions or roots, counted together). Above that, split it into parts or offer replay or navigation. This comes from blind adults and pure recall with no calculation, so in a problem-*solving* load the limit is probably lower.
- Operators were well remembered while deletions were common. So the risk is **dropping whole parts (numbers or structures)**, not forgetting the operator. Do not introduce numbers in bulk; give each one with its referent.

### Gaps
- There are no age-specific data for children. The effect of replay and navigation was not tested (both were prohibited).

## Q4. Blind people's verbal working-memory advantage and ultra-fast synthetic speech comprehension: exact numbers

### Takeaway
[KÖR] The verbal-memory advantage is consistent but small-sample, with one exception: WISC-IV working memory was about +14 IQ points for blind children (N = 249, two countries). The ultra-fast speech advantage depends on **training and the type of synthesiser**:
- Trained blind adults followed formant synthesis (the voice of the JAWS screen reader, Eloquence) at 17–22 syllables/s, against about 8–9 syl/s for sighted listeners.
- In a large online study, the mean listening rate was 334 words per minute for visually impaired listeners and 297 for sighted listeners, a modest difference.
- The ability did not transfer to compressed natural speech.

### Cited Findings
- [KÖR][TAM METİN, abstract and methods] Rindermann, Ackermann & te Nijenhuis 2020 (*Front. Psychol.*): N = 249 children aged 6–16 in South Africa and Austria. On WISC-IV, blind and visually impaired children had higher working memory than sighted children (r = +0.35; **+14 IQ points for blind, +3 for visually impaired**). Verbal comprehension was **weaker** (r = −0.39, about 13 IQ points lower). The pattern held after controlling for socioeconomic status and ethnicity. Working memory = digit span plus letter–number sequencing. — [Frontiers PDF](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.01571/pdf); [Europe PMC full text PMC7347789](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7347789/fullTextXML)
- [KÖR][ÖZET] Withagen et al. 2013 (*Res. Dev. Disabil.* 34(7)): 10-year-old blind children outperformed sighted children on both short-term memory (digit span forward, name learning, word span) and working memory (listening span, digit span backward). The verbal working-memory advantage was a new finding. I could not get effect sizes. — [TU/e record](https://research.tue.nl/en/publications/short-term-memory-and-working-memory-in-blind-versus-sighted-chil/)
- [KÖR][ÖZET] Rokem & Ahissar 2009 (*Neuropsychologia* 47(3):843–848): congenitally blind adults had better verbal span, speech-in-noise perception and frequency discrimination, but **no advantage on executive tasks (manipulating items held in memory) or math**. The authors attribute the advantage to better initial encoding. — [HUJI record](https://cris.huji.ac.il/en/publications/interactions-of-cognitive-and-auditory-abilities-in-congenitally-/)
- [KÖR][ÖZET] Raz et al. 2007: congenitally blind people recalled 20-word lists in order, with the largest advantage on long ordered sequences. Pasqualotto et al. 2013: congenitally blind people recalled more correct words and made fewer false memories (from a press release). — [HUJI record](https://cris.huji.ac.il/en/publications/superior-serial-memory-in-the-blind-a-case-of-cognitive-compensat/); [QMUL press release](https://www.qmul.ac.uk/news/latest-news/2013/se/congenitally-blind-people-have-more-accurate-memories-research-finds.html)
- [KÖR][TAM METİN] Moos & Trouvain 2007 (ICPhS):
  - Sample: 19 blind listeners (ages 15–37, mean 22; 13 blind from birth; daily formant-synthesis users for an average of 7 years) and 19 sighted listeners.
  - Texts: about 102 words, 209 syllables. The natural baseline speaker read at 3.9–4.5 syl/s.
  - Rates tested: 17–22 syl/s for blind listeners, 9–14 syl/s for sighted listeners. Some blind listeners still understood at 22 syl/s.
  - Formant synthesis was understood **best by blind listeners and worst by sighted listeners**. The ultra-fast skill **did not transfer to compressed natural speech**.
  - Congenitally blind listeners did *worse* on synthesis than those blinded later (r = −0.527, p = .02).
  - Removing pauses barely affected comprehension; it was significant only at 13–14 syl/s.
  - Comprehension was a **subjective** 6-point rating, not a recall test.
  — [Moos & Trouvain ICPhS 2007 PDF](https://icphs2007.de/conference/Papers/1186/1186.pdf)
- [KÖR][TAM METİN] Dietrich, Hertrich & Ackermann 2013 (*BMC Neurosci.*): blind listeners can learn to understand speech at "up to about 22 syllables per second", against about 8 syl/s for sighted listeners. Stimuli were recorded at a normal 4–6 syl/s, then presented at 8 syl/s (moderately fast) and 16 syl/s (ultra-fast). Comprehension was linked to activity in right primary visual cortex. — [Europe PMC full text PMC3847124](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC3847124/fullTextXML); [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3847124)
- [KÖR/GENEL][TAM METİN] Bragg et al. CHI 2018: 453 online volunteers. Mean listening rate was **309 WPM** overall, **334 WPM for visually impaired and 297 WPM for sighted** participants (t(451) = 2.40, p = .017). Typical human speech is 120–180 WPM. Age moderated the visual-impairment advantage, with young visually impaired participants best. The model explained only 12% of variance. Experienced screen-reader users are reported to reach 500 WPM. — [Bragg CHI 2018 PDF](https://wildlab.cs.washington.edu/Publications_files/Bragg_CHI2018.pdf)

### Inferences
- **Default rate:** a normal human rate (about 150–180 WPM, 4–6 syl/s) is a safe default. Experienced users should be able to raise it. The Bragg means suggest many visually impaired users comfortably follow about 300+ WPM with synthetic speech.
- **Do not assume ultra-fast listening.** The 17–22 syl/s figures come from adults with years of daily formant-synthesis use. Natural or neural voices (the usual choice in an app) do not show the same transfer.
- The verbal span advantage does not extend to manipulation, executive or math tasks (Rokem & Ahissar). Blind students may *hold* more, but transforming and calculating still face the same load. Keep the chunking.

### Gaps
- I could not get full texts for Röder et al. 2001, Pasqualotto 2013 or Occelli et al. 2017 (PMC5436932 returned a Europe PMC error and pmc.ncbi gave a bot-check page). Effect sizes are missing.
- No data exist on synthetic speech rates for children with math content.

## Q5. Segmenting and signaling meta-analyses, question-first ordering and linguistic simplification: effect sizes and boundary conditions

### Takeaway
[GENEL] Segmenting has small-to-medium effects (retention d = 0.32, transfer d = 0.36). But **retention gains are not significant when the learner can replay**, and in learner-paced segmentation the cognitive-load reduction was not significant. Signaling has medium effects overall (g = 0.53 / 0.33) but **was ineffective in mathematics** (g = 0.08 / −0.03, 9 studies). Putting the question first raised accuracy from 0.64 to 0.83 (4th graders, reading). Linguistic simplification has a small overall effect but helps weaker groups more (+6.6–6.7%).

### Cited Findings
- [GENEL][TAM METİN] Rey et al. 2019 (*Educ. Psychol. Rev.*): 56 investigations, 88 comparisons. Overall: retention d = 0.32 [0.20, 0.43], transfer d = 0.36 [0.24, 0.48], cognitive load d = 0.23, learning time d = −0.92 (segmented versions take longer).
  - **System-paced** segmentation: retention 0.42, transfer 0.35, cognitive load 0.29 (all significant).
  - **Learner-paced** segmentation: retention 0.19 (p = .10, not significant), transfer 0.45 (significant), cognitive load 0.08 (p = .43, not significant). — [Rey et al. 2019 PDF](https://maria-wirzberger.de/wp-content/uploads/2019/01/Rey2019_Article_AMeta-analysisOfTheSegmentingE.pdf)
- [GENEL][TAM METİN] Rey et al. moderators:
  - **Option to repeat:** with it, retention 0.14 (not significant) and transfer 0.55; without it, retention 0.40 and transfer 0.29. The authors: retention gains were significant "only… when learners were not able to repeat the instructions".
  - **Prior knowledge:** none 0.29; low −0.12 (not significant); **high 0.73**. Contrary to the hypothesis, high-prior-knowledge learners benefited more.
  - **Option to change the order:** with it, retention 0.15 (not significant); without it, 0.32. — [Rey et al. 2019 PDF](https://maria-wirzberger.de/wp-content/uploads/2019/01/Rey2019_Article_AMeta-analysisOfTheSegmentingE.pdf)
- [GENEL][TAM METİN of the Clearing House Unterricht summary; original ÖZET] Schneider, Beege, Nebel & Rey 2018 (*Educ. Res. Rev.* 23:1–24): retention g = 0.53 (139 comparisons), transfer g = 0.33 (70), cognitive load g = 0.25, motivation g = 0.13. Moderators (retention / transfer):

  | Moderator | Retention | Transfer |
  |---|---|---|
  | Primary school | 0.19 | 0.21 |
  | Secondary school | 0.34* | 0.32* |
  | Low prior knowledge | 0.42* | 0.39* |
  | High prior knowledge | 0.67* | 0.55* |
  | **Mathematics (9 / 9 studies)** | **0.08** | **−0.03** |
  | Physics | 0.43* | 0.44* |
  | System-paced | 0.57* | 0.38* |
  | Learner-paced (start / pause / repeat) | 0.53* | 0.30* |

  — [Clearing House Unterricht KR-22 PDF (TUM)](https://www.clearinghouse.edu.tum.de/wp-content/uploads/2018/12/CHU_KR-22_-Schneider_2017_Lernmaterial_Hervorhebungen.pdf); [ResearchGate record](https://www.researchgate.net/publication/321270303_A_meta-analysis_of_how_signaling_affects_learning_with_media)
- [GENEL][TAM METİN] Thevenot, Devidal, Barrouillet & Fayol 2007 (*QJEP* 60(1):43–56):
  - Sample: 72 French fourth-graders (mean age 10;6), selected from 244: 36 high-skilled and 36 lower-skilled.
  - Problems: one-digit numbers in Combine 1, Compare 1 and Compare 2 types. Each child had 12 problems, each appearing once with the question before and once after.
  - **Presentation was visual (reading), segment by segment, self-paced.**
  - Accuracy: **question before .83 versus after .64** (F(1,70) = 47.62, p < .001). Gain was **+.25 for lower-skilled versus +.14 for high-skilled** children. By problem type: Compare 2 +.28, Compare 1 +.18, Combine 1 +.13.
  - With the question first, solving times were shorter (Compare 2 −362 cs, Combine 1 −83 cs).
  - The authors' account: the question acts like a title or advance organizer for the situation model. — [UNIGE open-archive PDF](https://access.archive-ouverte.unige.ch/access/metadata/e9b850e0-fd2d-41d9-959f-26a6aac32608/download); [UNIGE record](https://archive-ouverte.unige.ch/unige:88300)
- [GENEL][TAM METİN] Abedi & Lord 2001 (*Appl. Meas. Educ.* 14(3):219–234):
  - Items: **20 items** were chosen from the 69 released NAEP grade-8 items and rewritten. Two math experts checked that content was equivalent.
  - Rewriting rules: familiar non-math vocabulary; **passive → active**; shorter long noun phrases; conditional clauses split into separate sentences or reordered; relative clauses removed; abstract presentation made concrete.
  - Preference interviews: 63% and then 83% chose the revised version.
  - Test: N = 1,174 eighth-graders. Mean on 10 items was **5.46 original versus 5.62 revised** (difference 0.16, t = 2.95, p = .003, η² = .006).
  - Gains by math class level: low **+6.7%**, average **+6.6%**, honors algebra **−0.8%**. English learners and low-SES students gained more. — [Abedi & Lord 2001 PDF](https://typeset.io/pdf/the-language-factor-in-mathematics-tests-1o16uxplej.pdf)

### Inferences
- In an app, a **replay button already provides part of segmentation's benefit**. Learner-paced segmentation does not reliably lower load, so splitting a problem into sentences is still useful mainly for structure, not as a load reducer.
- Signaling has **no meta-analytic support in math**. Verbal markers such as "first fact…" may be harmless, but do not expect a gain from them. The lexical structure cues tested by ETS (Q6) are the better-supported alternative.
- **Question first** is the strongest ordering evidence: +19 percentage points, more for weaker students and harder problems. It comes from reading, not audio. Because audio cannot be scanned back, the effect plausibly matters at least as much there; this is an inference.
- Linguistic simplification **is not for everyone**. It gave no gain, or a slight loss, for advanced students (honors −0.8%). Offer it as a choice or level setting.

### Gaps
- I could not read the original Schneider 2018 paper; the figures come from a detailed secondary summary.
- No study tested question position in audio or with blind students.

## Q6. Math expression navigation (MathCAT, AudioMath, ETS, StereoMath, Process-Driven Math): measured benefit

### Takeaway
[KÖR][TAM METİN] No controlled test of navigation against no navigation was found. In the ETS pilot (21 blind or low-vision students), spoken math with navigation gave about the same scores as each student's usual braille or print format. Students liked the arrow keys, zoom and mode switching, but did not find "Where Am I" and "Describe" very useful. In the earlier ETS prosody study, a spoken end marker such as "end root" beat long pauses and speed changes. StereoMath has no user-study results yet.

### Cited Findings
- [KÖR][TAM METİN] Frankel & Brownstein, ETS RR-16-33: 22 students (10 blind, 12 low vision; ages 14–19; grades 8–12). Square-root boundary condition, percent correct by expression:

  | Cue | Root continues after | Root at end of expression |
  |---|---|---|
  | Extended pause (2,750 ms) | 50% | 68% |
  | 125% speed-up under the root | 59% | 86% |
  | **Spoken "end root"** | **82%** | **95%** |

  "End root" was significantly better than speed-up (p = .017) and than extended pauses (p = .005). The authors: "neither prosodic treatment succeeded in compensating for the absence of explicit lexical end-markers". The pause values used inside expressions were 25–400 ms. — [ETS RR-16-33 (ERIC PDF)](https://files.eric.ed.gov/fulltext/EJ1124730.pdf)
- [KÖR][TAM METİN] ETS RR-16-33 conclusions:
  - Saying "nth parenthesis" for nested brackets got partial support; graded pause lengths and speed-ups did not, at least without familiarization.
  - With long expressions, students "just wanted to write them down". The authors: "navigation is necessary to understanding it purely through audio", and a single read-through gives "a rough idea".
  - Some students thought the pauses were a computer "stumble"; familiarization might help.
  - Gellenbeck & Stefik 2009 (sighted computer-science students) found that pauses significantly helped tell apart ambiguous expressions. — [ETS RR-16-33](https://files.eric.ed.gov/fulltext/EJ1124730.pdf)
- [KÖR][TAM METİN] Frankel, Brownstein & Soiffer, ETS RR-17-13:
  - Sample: 21 secondary students who were blind or had low vision.
  - Conditions: each student did 16 questions in spoken math (ClearSpeak + NVDA + MathPlayer with navigation) and 16 in their usual format (braille, print or large print). Navigation offered arrow-key chunks, zoom in and out, Character / Simple / Enhanced modes, Where Am I, Read / Describe and place markers.
  - Scores: mean net (spoken minus usual) per question pair 0.125 (SD 2.73). For every student, the difference between formats was **at most 2 of 16 questions**.
  - Preferences: 10% always the usual format; 38% usually the usual format but spoken is OK; 33% equal; 5% always spoken; 14% both together.
  - Navigation features: arrow keys, zoom and mode switching were "very well-liked"; place markers mixed; Where Am I and Describe "did not appear very useful".
  — [ETS RR-17-13 (ERIC PDF)](https://files.eric.ed.gov/fulltext/EJ1168599.pdf); [ETS page](https://www.ets.org/research/policy_research_reports/publications/report/2017/jxpm.html)
- [KÖR][TAM METİN] StereoMath (Ge & Seo, arXiv 2501.01404v2): a design paper (spatial audio, earcons, "spatial nav mode"). Only co-design sessions are reported: "preliminary results look promising… we are in the process of conducting a user study." It cites that blind users spend over 30% longer on navigation in complex interfaces. — [arXiv PDF](https://arxiv.org/pdf/2501.01404v2)
- [KÖR][ÖZET] Process-Driven Math (Gulley 2021): qualitative work with 25 students at three schools for the blind, plus an experimental part with more than 650 students. Students who reported concentration difficulty scored higher with PDM. — [Auburn ETD](https://etd.auburn.edu/handle/10415/7656)
- [Tool][ÖZET, from the earlier notes] MathCAT navigation modes (Enhanced / Simple / Character, zoom, Where Am I, Read / Describe) match the features tested in the ETS pilot. — [MathCAT Navigation Commands](https://nsoiffer.github.io/MathCAT/nav-commands.html)

### Inferences
- **Mark structure boundaries in words** ("end root", "end fraction", "end parenthesis"), not by pause length alone. Use pauses only as natural support; very long pauses (about 2.75 s) can be read as a glitch.
- For long expressions, offer chunk-by-chunk next and back plus zoom (whole expression versus part). Measured benefit amounts to "comparable to braille or print plus liked by students". There is no evidence of superiority.
- "Describe" (summary) and "Where am I" were not valued in practice. A short overview first is still supported by the cognitive argument, but should be optional and short.

### Gaps
- No controlled study of navigation versus linear speech, and no measurement of navigation's effect on word-problem solving.
- AudioMath (Ferreira & Freitas 2005) has no quantitative results in the material I could reach.

---

### Overall quantitative guide (inference; based on the cited findings, not tested together on blind students)

| Parameter | Recommendation | Basis |
|---|---|---|
| Problem length | 37–87 words workable with free replay (middle-school arithmetic); for fractions or multi-step content, shorten and split into steps | Beal & Shaw 2009 (fraction multiplication 0.90 → 0.27); Leahy & Sweller 2016 |
| Expression size | At most about 10 math elements per spoken unit; split larger ones or offer navigation | Riga & Kouroupetroglou 2024 |
| Order | Question first, then the facts; repeat the question before the answer prompt | Thevenot 2007 (+.19; +.25 for weaker students); repetition is an inference |
| Boundaries | Spoken end markers ("end root") over pauses alone | ETS RR-16-33 (95% versus 68%) |
| Replay | Expect about 2 plays; make replay free; replay can stand in for part of segmenting | Beal (2.01–2.07); Rey 2019 |
| Speech rate | Default 150–180 WPM, user-adjustable; many visually impaired users reach 300+ WPM | Bragg 2018; Moos & Trouvain 2007 |
| Language | Active voice, short noun phrases, no conditional or relative clauses, math terms unchanged; offer as a level, not for everyone | Abedi & Lord 2001 |
| Signaling | No proven gain in math; do not over-rely on it | Schneider 2018 (math g = 0.08) |

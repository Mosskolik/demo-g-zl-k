# Two-stage OCR+LLM alternatives to an on-device VLM, and Ray-Ban Meta Gen 2 + offline Turkish speech on Android (state as of 2026-11-09)

Research notes: as of 2026-11-09. Method note: this cloud session could not open developers.meta.com, wearables.developer.meta.com, huggingface.co or vr.org (DNS blocked). The Meta DAT and PaddleOCR facts below were read **directly from the official GitHub repositories**, which I cloned on 2026-11-09: `facebook/meta-wearables-dat-android` (last commit 2026-10-09) and `PaddlePaddle/PaddleOCR` (docs last commit 2026-09-16). Those count as primary sources. Other facts come from search-engine summaries of the cited pages; they are marked "(search summary)" where I could not open the page myself.

---

## A1. Google ML Kit Text Recognition v2: Turkish support and math symbols

### Takeaway
Turkish (`tr`, Latin script) is a fully "Supported" language in ML Kit Text Recognition v2, so plain Turkish textbook prose should OCR well. ML Kit is a general line/word OCR. It has no math-layout model and outputs flat text, so superscripts, √, fractions and other 2-D structure get flattened or lost. Expect it to handle the Turkish words in a question, not the formulas.

### Cited Findings
- ML Kit v2 sorts languages into "Supported", "Experimental" and "Mapped" tiers. Turkish appears in the **Supported** table as `tr` / `Latn`. "Supported" means Google prioritizes these languages and regularly evaluates their performance. — [ML Kit v2 languages](https://developers.google.com/ml-kit/vision/text-recognition/v2/languages) (search summary)
- The v2 API covers Chinese, Devanagari, Japanese, Korean and Latin scripts, and Turkish uses the Latin recognizer (`TextRecognizerOptions.DEFAULT_OPTIONS`). — [ML Kit text recognition v2](https://developers.google.com/ml-kit/vision/text-recognition/v2) (search summary)
- I found no ML Kit documentation on math or superscript handling, and no Turkish accuracy figures. — searched; no hit on developers.google.com
- General OCR background: fractions, roots, exponents and special symbols break standard text-recognition pipelines. — [Roboflow: Recognizing Math Equations](https://blog.roboflow.com/math-equations-computer-vision/). Superscripts and subscripts are a known weak spot of non-math OCR. — [Tutorial on OCR in the math domain](https://www.researchgate.net/publication/333539203_A_Tutorial_on_Optical_Character_Recognition_in_Mathematical_Domain)
- Even with correctly encoded Unicode, flattened equations get misread by screen readers once the superscript/subscript layout is lost. This matters for a blind-user app. — [Penn State Accessibility: Equations](https://accessibility.psu.edu/math/equations/)

### Inferences
- ML Kit returns a hierarchy (TextBlock → Line → Element → Symbol) with bounding boxes. This is standard ML Kit v2 API, but I did not re-verify it in this session. Those boxes are useful for detecting a cut-off page (text touching the image border); see A5.
- Likely failure modes on math: `x²` read as `x2`, `√` dropped or read as `V`, stacked fractions split into two lines with the fraction bar lost, `·`/`×`/`÷` confused. For a math-reading app ML Kit can only be the "Turkish text" half of a two-stage pipeline. Formulas need a dedicated math-OCR model (A2).
- ML Kit is very small and fast (bundled or Play-services model), so it costs almost nothing to run first as a quick page/text-presence check.

### Gaps
- No official statement on ML Kit's math-symbol character set or its accuracy on superscripts. The team should test on 20–30 photographed MEB textbook pages.
- No Turkish CER/WER figures published by Google.

---

## A2. On-device math OCR models that output LaTeX

### Takeaway
As of Nov 2026 the most Android-ready path is PaddleOCR. **PP-OCRv6** (released ~Sept 2026, 1.5M–34.5M params, one model for 50 languages including 46 Latin-script ones) has an official **Android SDK on ONNX Runtime**. Its **PP-FormulaNet / PP-FormulaNet_plus** models output LaTeX and can be exported via paddle2onnx, though they are 224–698 MB and take 0.25–3 s even on a desktop CPU. Pix2Text MFR-1.5 (ONNX, MIT) is the lightest LaTeX option. GOT-OCR 2.0 (580M), UniMERNet (100–325M, 1.5 GB in Paddle format), Nougat and Florence-2 are too heavy, not LaTeX-focused, or have no Android runtime. Surya/Texify have restrictive weight licenses.

### Cited Findings
**PaddleOCR (primary: GitHub docs, commit 2026-09-16)**
- PP-OCRv6 is "the latest generation" with tiny/small/medium tiers aimed at edge/IoT, mobile/desktop and server. The medium/small tiers support 50 languages in one model: Simplified/Traditional Chinese, English, Japanese and **46 Latin-script languages** (tiny supports 49, no Japanese). The dictionary was extended with ~200 diacritical characters. Parameters range from 1.5M to 34.5M. — [PP-OCRv6.en.md](https://github.com/PaddlePaddle/PaddleOCR/blob/main/docs/version3.x/algorithm/PP-OCRv6/PP-OCRv6.en.md)
- PP-OCRv6 recognition weighted accuracy on Paddle's in-house benchmark: medium 83.2, small 81.3, tiny 73.5, PP-OCRv5_mobile 73.7. On the same benchmark the VLMs score Qwen3-VL-235B 74.9, Gemini-3.1-Pro 71.4, GPT-5.5 64.2. Paddle says VLMs "introduce hallucinated corrections based on linguistic priors" while PP-OCRv6 reproduces the visible text faithfully. (This is a vendor benchmark.) — [PP-OCRv6.en.md](https://github.com/PaddlePaddle/PaddleOCR/blob/main/docs/version3.x/algorithm/PP-OCRv6/PP-OCRv6.en.md)
- Official **Android demo/SDK** ("PP-OCRv6 Android Demo"): uses **ONNX Runtime 1.21.1**, SDK separate from the demo, AAR integration, Jetpack Compose. Supported models: PP-OCRv6_small, PP-OCRv6_tiny, PP-OCRv5_mobile (ONNX). Sample benchmark on a OnePlus 7 (GM1900, Android 9), 5 text lines: total pipeline **420 ms** mean (detection 349 ms, recognition 66 ms), cold load 158 ms. — [android_deployment.en.md](https://github.com/PaddlePaddle/PaddleOCR/blob/main/docs/version3.x/inference_deployment/cross_platform/android_deployment.en.md)
- PP-OCRv5 (superseded by v6 for Latin): `latin_PP-OCRv5_mobile_rec` explicitly lists **Turkish (tr)** among its Latin languages, with 84.7% accuracy on its dataset. — [PP-OCRv5_multi_languages.en.md](https://github.com/PaddlePaddle/PaddleOCR/blob/main/docs/version3.x/algorithm/PP-OCRv5/PP-OCRv5_multi_languages.en.md)
- Formula recognition models (PaddleOCR 3.x docs). Columns: En-BLEU / Zh-BLEU / CPU ms (high-performance mode, server CPU) / storage:
  - UniMERNet: 85.91 / 43.50 / 8288 ms / 1530 MB
  - PP-FormulaNet-S: 87.00 / 45.71 / 254 ms / 224 MB
  - PP-FormulaNet-L: 90.36 / 45.78 / 3132 ms / 695 MB
  - PP-FormulaNet_plus-S: 88.71 / 53.32 / 261 ms / 248 MB
  - PP-FormulaNet_plus-M (default): 91.45 / 89.76 / 1616 ms / 592 MB
  - PP-FormulaNet_plus-L: 92.22 / 90.64 / 3126 ms / 698 MB
  - PP-FormulaNet_plus was trained on more diverse data, including "textbooks, exam papers, and mathematics journals."
  - Source: [formula_recognition.en.md](https://github.com/PaddlePaddle/PaddleOCR/blob/main/docs/version3.x/module_usage/formula_recognition.en.md)
- The PP-FormulaNet paper reports smaller parameter counts (S ≈ 58M, L ≈ 179M) than the storage sizes above. The two figures probably measure different things (parameters vs. inference files). — [PP-FormulaNet arXiv 2503.18382](https://arxiv.org/pdf/2503.18382) (search summary)
- PaddleOCR also ships PaddleOCR-VL (0.9B VLM for document parsing), now at versions 1.5 and 1.6. — [PaddleOCR-VL arXiv 2510.14528](https://arxiv.org/pdf/2510.14528); [PaddleOCR-VL-1.5 arXiv 2601.21957](https://arxiv.org/pdf/2601.21957); docs folder `algorithm/PaddleOCR-VL/` contains VL-1.6 files (GitHub).

**Pix2Text**
- Open-source Python tool with "SMALL models" for layout, tables, math formulas (LaTeX) and text. It claims 80+ languages and positions itself as a free Mathpix alternative. — [breezedeus/Pix2Text GitHub](https://github.com/breezedeus/pix2text)
- The default formula model is **MFR-1.5** with the **ONNX** backend (`LatexOCR(model_name='mfr-1.5', model_backend='onnx')`). — [Pix2Text docs: LatexOCR](https://pix2text.readthedocs.io/zh-cn/stable/pix2text/latex_ocr/); [HF breezedeus/pix2text-mfr](https://huggingface.co/breezedeus/pix2text-mfr) (search summary)
- A community project runs MFR-1.5 client-side in the browser with ONNX Runtime Web. This shows the model is portable outside Python, but it is not an Android result. — [Mapaor/pix2text-mfr-web](https://github.com/Mapaor/pix2text-mfr-web)

**UniMERNet**
- Variants: T ≈ 100–107M, S 202M, B 325M parameters. The paper's two tables disagree on T. — [UniMERNet arXiv 2404.15254](https://arxiv.org/pdf/2404.15254) (search summary)

**GOT-OCR 2.0, Florence-2, Surya/Texify, Nougat**
- GOT-OCR 2.0: 580M parameters, Apache-2.0, LaTeX output, ~4 GB VRAM minimum. This comes from a single secondary source. — [aimadetools OCR comparison 2026](https://www.aimadetools.com/blog/best-open-source-ocr-models-2026/) (search summary)
- Florence-2: MIT license, ~770M (large; 1.54 GB weights). It does OCR but **does not output LaTeX**. — [Roboflow Florence-2 OCR](https://blog.roboflow.com/florence-2-ocr/) (search summary)
- Surya: code is Apache-2.0, but the **weights use a modified OpenRAIL-M license with revenue/funding limits**. Surya outputs KaTeX-compatible LaTeX for equations. Texify is **deprecated and folded into Surya** (weights CC BY-SA 4.0, code GPL-3.0). — [datalab-to/surya](https://github.com/VikParuchuri/surya); [VikParuchuri/texify](https://github.com/VikParuchuri/texify) (search summary)
- Nougat: no 2025–2026 Android-deployment evidence found in this session.

### Inferences
- **Recommended two-stage stack for a beginner team:**
  1. ML Kit or PP-OCRv6_small (ONNX) for Turkish text plus line boxes.
  2. Crop the formula regions. PaddleOCR's layout/formula-detection models or a simple heuristic can do this.
  3. Run PP-FormulaNet_plus-S or Pix2Text MFR-1.5 (ONNX Runtime Mobile) on each crop to get LaTeX.
  4. Merge everything into a single Markdown+LaTeX string for the LLM.
- PP-FormulaNet_plus-S (248 MB, ~260 ms per formula on a server CPU) will probably take ~1–3 s per formula on a mid-range phone CPU. That is an extrapolation, not measured. The M/L models (592–698 MB, 1.6–3.1 s on a server CPU) are likely too slow for phones.
- Turkish is explicitly listed for PP-OCRv5 Latin. For PP-OCRv6, "46 Latin-script languages" very probably includes Turkish, but I did not see the language list itself.
- No math-OCR model reads geometry figures or diagrams. Pure OCR loses shapes, labelled angles and graphs (see A4).

### Gaps
- No measured Android latency or RAM for PP-FormulaNet, Pix2Text MFR, UniMERNet or GOT-OCR on phones.
- PP-OCRv6's exact list of 46 Latin languages: Turkish not directly confirmed.
- Pix2Text MFR-1.5 parameter count and license of the weights: Hugging Face was not reachable.
- No TFLite/LiteRT or NCNN ports of these formula models were found; ONNX Runtime looks like the practical route.

---

## A3. Small on-device text LLMs for Turkish plus math reasoning

### Takeaway
As of Nov 2026, the strongest beginner-friendly candidates are:
- **Gemma 4 E2B/E4B** (released 2 Apr 2026, Apache-2.0, official LiteRT-LM Android builds; E2B .litertlm ≈ 2.6 GB)
- **Qwen3-1.7B/4B** (Apache-2.0, Turkish explicitly among 119 trained languages, thinking mode for math)
- **Gemma 3 1B/4B** (superseded by Gemma 4 but well documented; 4B-IT: GSM8K 89.2, MATH 75.6)
- **Phi-4-mini** (3.8B, MIT)

Llama 3.2 3B is the weakest fit: Turkish is not one of its officially supported languages (from general knowledge; not re-verified here). I found no Turkish-specific math benchmark for any of these small models.

### Cited Findings
- **Gemma 3 IT (0-shot)**, from the model card:

  | Size | MATH | GSM8K |
  |---|---|---|
  | 1B | 48.0 | 62.8 |
  | 4B | 75.6 | 89.2 |
  | 12B | 83.8 | 94.4 |

  Source: [Gemma 3 model card](https://ai.google.dev/gemma/docs/core/model_card_3); the [Gemma 3 Technical Report](https://arxiv.org/abs/2503.19786) says Gemma3-4B-IT is competitive with Gemma2-27B-IT. (search summary)
- **Gemma 4** was released 2 Apr 2026. E2B = 2.3B effective params and E4B = 4.5B effective, both with 128K context. — [arXiv 2606.05250](https://arxiv.org/pdf/2606.05250); [Gemma 4 Technical Report arXiv 2607.02770](https://arxiv.org/html/2607.02770v1) (search summary)
- Gemma 4 scores as reported by guides citing the official card, E2B / E4B: AIME 2026 (no tools) 37.5% / 42.5%; MMLU-Pro 60.0% / 69.4%; GPQA-Diamond 43.4% / 58.6%. — [Aurigait Gemma 4 guide](https://aurigait.com/blog/gemma-4-features-benchmarks-guide/); [WaveSpeed](https://wavespeed.ai/blog/posts/what-is-google-gemma-4/) (secondary; verify against the official card)
- Gemma 4 E2B/E4B are published by Google as ready-to-deploy **LiteRT-LM** builds for Android. `litert-community/gemma-4-E2B-it-litert-lm` is 2,588,147,712 bytes, Apache-2.0, not gated. LiteRT-LM has CPU, GPU (OpenCL) and NPU backends. One developer reports ~2–5 tok/s on CPU on mid-range hardware and ~52 tok/s on GPU on a Galaxy S26 Ultra. — [HF litert-community/gemma-4-E4B-it-litert-lm](https://huggingface.co/litert-community/gemma-4-E4B-it-litert-lm); [DEV: Gemma 4 on Android](https://dev.to/samdude/gemma-4-on-android-tricks-for-faster-on-device-inference-3kj5) (search summary; single-blog speeds)
- On supported Android devices, Gemma 4 is also exposed via **Android AICore as Gemini Nano**, which Google recommends for production. — search summary of a Gemma 4 LiteRT-LM model card ([litert-community](https://huggingface.co/litert-community/gemma-4-E4B-it-litert-lm))
- A community Turkish-English legal fine-tune of Gemma 4 E4B exists as a ~3.9 GB 4-bit LiteRT-LM file. This shows Turkish works in the format, but it says nothing about base-model quality. — [AlperKTS/gemma4-e4b-legal-tr-en-litertlm](https://huggingface.co/AlperKTS/gemma4-e4b-legal-tr-en-litertlm)
- **Qwen3** was pre-trained on 36T tokens covering 119 languages and dialects. The official blog lists **Turkish** under the Turkic family. Dense models (incl. 1.7B and 4B) are **Apache-2.0**. Qwen3-4B context: 128K in the technical report vs. 32K in the blog table (conflict). — [Qwen3 Technical Report](https://arxiv.org/abs/2505.09388); [Qwen3 blog](https://qwen.ai/blog?id=qwen3) (search summary)
- The Qwen3 report compares its small models against Gemma-3-1B-IT and Phi-4-mini. I could not extract exact MATH-500 rows. A third-party page reports GSM8K 75.44 for Qwen3-1.7B (unverified). — [Qwen3 Technical Report](https://arxiv.org/abs/2505.09388); [openlaboratory Qwen3 1.7B](https://openlaboratory.com/models/qwen3-1_7b/)
- **Phi-4-mini**: 3.8B, 128K context, ~2.5 GB quantized, MIT license; MMLU ≈ 67–69 (English). — [premai lightweight LLMs 2026](https://www.premai.io/blog/best-lightweight-language-models-worth-running/); [tinyweights 2026 comparison](https://tinyweights.dev/posts/best-small-language-models-2026/) (secondary)
- Turkish evaluation suites exist: **Cetvel** (Turkish benchmark for open models under 70B), TurkishMMLU, TR-MMLU, and an OpenLLM Turkish leaderboard on HF. I could not get per-model scores for the small models. — [Cetvel arXiv 2508.16431](https://arxiv.org/pdf/2508.16431); [Evaluating open-weight LLMs for Turkish domain docs, arXiv 2609.28007](https://arxiv.org/pdf/2609.28007)

### Inferences
- For "explain this Turkish math question aloud", the most defensible order is:
  1. **Gemma 4 E4B** (best quality, official Android tooling; ~3.9 GB at 4-bit)
  2. **Gemma 4 E2B** (~2.6 GB) if RAM or latency is tight
  3. **Qwen3-4B in thinking mode** as the math-heavy alternative. Its thinking mode produces long outputs, which adds latency.
- Gemma 4 E2B/E4B are themselves multimodal (vision input). The "single VLM" option and the "text LLM" option can therefore be the same model family: run the OCR text plus the image through one Gemma 4 model. That reduces the decision to whether OCR is added as a grounding step.
- Feeding OCR-derived LaTeX into the LLM usually beats letting a 2–4B model read numbers from pixels. Small VLMs hallucinate digits, and Paddle's own data shows even large VLMs "correct" visible text.

### Gaps
- No Turkish math-word-problem benchmark (e.g., a Turkish GSM8K) for these small models.
- No verified Gemma 4 E2B/E4B MATH or GSM8K numbers, and no official Turkish quality statement in a source I could open.
- No Qwen3.5 or other late-2026 small models were confirmed in this session.

---

## A4. Two-stage OCR + text LLM vs a single on-device VLM: pros and cons

### Takeaway
A two-stage pipeline gives faithful digits and symbols, an inspectable intermediate text (debuggable, and readable aloud verbatim), and separable components. It loses figures and geometry, adds integration work, and its peak RAM is the sum of OCR models plus the LLM unless they are loaded sequentially. A hybrid is the pragmatic choice: OCR for text and formulas, plus the VLM, or a flag telling the user "this question has a figure".

### Cited Findings
- Dedicated OCR (PP-OCRv6_medium, 34.5M params) beats VLMs including Qwen3-VL-235B and GPT-5.5 on recognition accuracy. VLMs introduce "hallucinated corrections based on linguistic priors". — [PP-OCRv6.en.md](https://github.com/PaddlePaddle/PaddleOCR/blob/main/docs/version3.x/algorithm/PP-OCRv6/PP-OCRv6.en.md)
- Text OCR on a 2019 phone takes ~0.42 s for 5 lines with PP-OCRv6. — [android_deployment.en.md](https://github.com/PaddlePaddle/PaddleOCR/blob/main/docs/version3.x/inference_deployment/cross_platform/android_deployment.en.md)
- Formula OCR model sizes are 224–698 MB, with 0.25–3.1 s per formula on a server CPU. — [formula_recognition.en.md](https://github.com/PaddlePaddle/PaddleOCR/blob/main/docs/version3.x/module_usage/formula_recognition.en.md)
- Florence-2 does OCR without LaTeX, so it cannot rebuild formula structure. — [Roboflow Florence-2 OCR](https://blog.roboflow.com/florence-2-ocr/)
- Small-LLM file sizes: Gemma 4 E2B ≈ 2.6 GB, E4B 4-bit ≈ 3.9 GB, Phi-4-mini ≈ 2.5 GB. — sources in A3

### Inferences
- **RAM budget (estimate):** ML Kit (tens of MB) + PP-OCRv6_small (tens of MB) + PP-FormulaNet_plus-S (~250 MB) + Gemma 4 E2B (~2.6 GB) ≈ 3 GB. That fits 8 GB phones if the OCR models are unloaded before the LLM runs. A single Gemma 4 E2B/E4B used as a VLM is about the same size, so RAM alone does not decide the question.
- **Latency (estimate):** two-stage ≈ 0.5 s text OCR + ~1–3 s per formula + LLM prefill and decode. With several formulas on a page, total time can exceed a single VLM pass. The text, however, can be spoken to the user before the LLM finishes.
- **Lost by pure OCR:** geometry figures, function graphs, tables drawn as images, coloured highlights, and number lines. Mitigation: use PaddleOCR layout detection or the VLM to find "figure" regions, then tell the user "Bu soruda bir şekil var" ("This question has a figure") or describe it with the VLM.
- **Gained by OCR:** exact digits, explicit LaTeX that a TTS front-end can verbalize ("x kare artı 3", i.e. "x squared plus 3"), deterministic text for read-aloud mode with no LLM needed, and easier evaluation (CER/BLEU).

### Gaps
- No head-to-head benchmark of OCR+LLM vs small VLM on Turkish math pages exists. The team will have to build a small test set.

---

## A5. Detecting a cut-off page or partial question

### Takeaway
No library offers a ready "question is cut off" detector. Build it from geometry signals plus semantic checks:
- **Geometry (OCR pipelines):** a text box or formula box touching or very near an image border, the last line truncated, or a missing answer-options pattern (A) B) C) D) E)).
- **Semantics:** question-number sequence gaps, and the LLM/VLM asked to answer "complete or incomplete" in a structured way.

A VLM can be asked directly, but small VLMs are unreliable at this, so combine both kinds of signal.

### Cited Findings
- PP-OCRv6/v5 and ML Kit both return per-line bounding boxes (the PaddleOCR Android SDK exposes `OCRBox` result models). — [PaddleOCR ppocr-android SDK source](https://github.com/PaddlePaddle/PaddleOCR/tree/main/deploy/ppocr-android); [android_deployment.en.md](https://github.com/PaddlePaddle/PaddleOCR/blob/main/docs/version3.x/inference_deployment/cross_platform/android_deployment.en.md)
- The DAT stream gives fixed frame sizes (720×1280 / 504×896 / 360×640). This makes the edge-margin threshold simple to compute for glasses frames. — [DAT camera-streaming skill](https://github.com/facebook/meta-wearables-dat-android/blob/main/plugins/mwdat-android/skills/camera-streaming/SKILL.md)

### Inferences
- Heuristic rules:
  - (a) Any text/formula box within ~2–3% of the frame edge means "possibly cut", so prompt the user: "Biraz geri çekil / sola çevir" ("Step back a bit / turn left").
  - (b) A multiple-choice question whose detected option labels are not contiguous A–E (Turkish tests usually use A–D or A–E) is incomplete.
  - (c) A detected question number with no following options or "?" is incomplete.
  - (d) Unbalanced LaTeX braces, or the formula model's low-confidence tokens at a crop edge.
- VLM approach: prompt for a JSON field `{"complete": bool, "missing_side": "top|bottom|left|right"}` and combine it with the geometry rules. Do not trust it alone.
- For glasses, prefer HIGH-quality frames or the standalone photo capture (A/B below) when checking completeness, because low-res frames make edge text unreadable.

### Gaps
- No published accuracy for any "partial document" detector. This must be validated empirically.

---

## B1. Meta Wearables Device Access Toolkit (DAT): status in Nov 2026, devices, Android capabilities, distribution

### Takeaway
DAT **1.0.0 (Android) shipped 2026-09-24, and 1.0.1 followed on 2026-10-09** (Maven Central `com.meta.wearable:mwdat-*`, no token needed). Meta's FAQ says 1.0 "begins rolling out September 30, 2026" (search summary). Core camera streaming is stable API.

Many features a blind-assist app would want are still marked **Experimental**: standalone high-res photo, audio streaming via the SDK, on-device speech, "Hey Meta, start {app}" voice launch, and glasses button/touch Inputs. Meta's docs say these "can be used for development and beta testing, but cannot be published to production release channels yet."

Public publishing of DAT apps was still described as "coming soon" (search summary of the Meta FAQ). Distribution today is through Developer Center organizations and **release channels to test users**.

Video stream: max **720×1280 at 30 fps over Bluetooth Classic**, adaptive downgrade, never below 15 fps.

### Cited Findings
**Status and versions**
- Changelog: 0.1.0 (2025-10-30, first Android release), 0.2.0 (2025-11-18), 0.3.0 (2025-12-16), 0.4.0 (2026-02-03), 0.5.0 (2026-03-11), 0.6.0 (2026-04-15), 0.7.0 (2026-05-14), 0.8.0 (2026-06-25), 0.9.0 (2026-08-03), **1.0.0 (2026-09-24)**, **1.0.1 (2026-10-09)**. "Features labeled experimental may change between minor releases. They can be built and tested against, though apps using them cannot be published yet." — [CHANGELOG.md](https://github.com/facebook/meta-wearables-dat-android/blob/main/CHANGELOG.md)
- The README still says "The Wearables Device Access Toolkit is in developer preview. Developers can … test on supported AI glasses, and create organizations and release channels to share with test users." This is stale wording that conflicts with the 1.0 tag. — [README.md](https://github.com/facebook/meta-wearables-dat-android/blob/main/README.md)
- Meta FAQ (search summary): "After a year in developer preview, Wearables Device Access Toolkit 1.0 is here … begins rolling out September 30, 2026", and "you'll soon be able to submit your Device Access Toolkit and Web Apps experiences to be published". Developers anywhere can download the SDK, but only those in AI-glasses-supported countries get full capabilities, including the Wearables Developer Center. — [Meta Wearables FAQ](https://developers.meta.com/wearables/faq/) (search summary; page not directly reachable)
- **Superseded:** the original announcement said the preview (late 2025) came "ahead of opening up publishing to general availability in 2026". — [Meta blog: Introducing DAT](https://developers.meta.com/blog/introducing-meta-wearables-device-access-toolkit/); [UploadVR: available to build, not yet to ship](https://www.uploadvr.com/meta-wearables-device-access-toolkit-public-preview/). A Sept 2026 article called publishing still unavailable after Connect 2026. — [vr.org](https://vr.org/articles/meta-glasses-three-tiers-wearables-toolkit-publishing-connect-2026) (search summary)

**Supported devices**
- Mock/SDK device models: `RAYBAN_META`, `OAKLEY_META_HSTN`, `OAKLEY_META_VANGUARD`, `RAYBAN_META_OPTICS`, `META_GLASSES` (0.8.0), plus `META_RAYBAN_DISPLAY` (Display glasses, from 0.4.0). Ray-Ban Meta Optics was added in 0.6.0. — [CHANGELOG.md](https://github.com/facebook/meta-wearables-dat-android/blob/main/CHANGELOG.md)
- Ray-Ban Meta Gen 2 is covered by the `RAYBAN_META` family. I found no separate Gen 1 vs Gen 2 enum.

**Requirements**
- Android 10+ phone with the **Meta AI app** installed. Developer Mode in the Meta AI app for dev builds. Manifest `APPLICATION_ID` from the Wearables Developer Center (placeholder "0" works in Developer Mode). Permissions: BLUETOOTH, BLUETOOTH_CONNECT, INTERNET. An internet connection is needed for registration. — [getting-started SKILL.md](https://github.com/facebook/meta-wearables-dat-android/blob/main/plugins/mwdat-android/skills/getting-started/SKILL.md); [permissions-registration skill](https://github.com/facebook/meta-wearables-dat-android/tree/main/plugins/mwdat-android/skills/permissions-registration)
- Analytics are on by default (opt-out via manifest `ANALYTICS_OPT_OUT`), and so is crash reporting (opt-out `CRASH_REPORTING_OPT_OUT`). Use is subject to the Meta Wearables Developer Terms and Acceptable Use Policy. — [README.md](https://github.com/facebook/meta-wearables-dat-android/blob/main/README.md)

**Camera streaming (stable)**
- API: `Wearables.createSession(AutoDeviceSelector())`, then `session.addCamera(StreamConfiguration(videoQuality, frameRate))`, then `camera.stream.start()`. This replaced `addStream` in 0.9.0 (older code is superseded).
- Resolutions: HIGH **720×1280**, MEDIUM **504×896**, LOW **360×640**.
- Frame rates: **2, 7, 15, 24, 30 fps**. "Lower resolution and frame rate usually produce better visual quality per frame over Bluetooth."
- `PAUSED` state on a single cap-touch tap.
- Source: [camera-streaming SKILL.md](https://github.com/facebook/meta-wearables-dat-android/blob/main/plugins/mwdat-android/skills/camera-streaming/SKILL.md)
- Bandwidth is constrained by **Bluetooth Classic**. Under constraint the SDK first lowers the resolution one step, then lowers fps (e.g. 30→24), but never below 15 fps. — [Meta DAT Android integration docs](https://wearables.developer.meta.com/docs/develop/dat/build-integration-android) (search summary). The earlier preview stated max 720p/30 fps. — [UploadVR](https://www.uploadvr.com/meta-wearables-device-access-toolkit-public-preview/)
- Changelog details:
  - High resolution 720×1280 became requestable (0.5.0).
  - "Improved stream latency, which was degrading over time" (0.4.0).
  - Compressed **HEVC** streaming that bypasses decoding: `StreamConfiguration.compressVideo` (0.6.0).
  - 1.0.1 fixed HEVC frame freezes and stream lag/stutter.
  - In-stream photo: `stream.capturePhoto()` returns `PhotoData` (stable).
  - Source: [CHANGELOG.md](https://github.com/facebook/meta-wearables-dat-android/blob/main/CHANGELOG.md)

**Experimental features (not publishable yet)**
- **Standalone photo capture** `camera.photo.capturePhoto(resolution = PhotoResolution.FULL, quality = PhotoQuality.HIGH)` with transfer-progress events. Stream and Photo compete for the camera, so the stream must be stopped first. — [camera-capture SKILL.md](https://github.com/facebook/meta-wearables-dat-android/blob/main/plugins/mwdat-android/skills/camera-capture/SKILL.md)
- **Audio streaming**: PCM `AudioFrame`s synchronized with video, via `StreamConfiguration.audioCodec = AudioCodec.PCM(sampleRate=16000|44100|48000, channels)`. It requires Camera and Audio Streaming approval in the Developer Center plus `Permission.CAMERA` and `Permission.MICROPHONE`. It is tied to an active camera stream. — [audio-streaming SKILL.md](https://github.com/facebook/meta-wearables-dat-android/blob/main/plugins/mwdat-android/skills/audio-streaming/SKILL.md)
- **Speech**: `session.addSpeech()` gives "on-device recognition", with partial and final `TranscriptionResult`, confidence and a locale flow. Real-glasses recognition does not require Android `RECORD_AUDIO`. — [speech SKILL.md](https://github.com/facebook/meta-wearables-dat-android/blob/main/plugins/mwdat-android/skills/speech/SKILL.md)
- **Voice Invocations**: "Meta AI [can] launch or foreground an app when the wearer says 'Hey Meta, start {app name}'". The spoken app name is configured in the Developer Center, and it needs Voice Invocation approval. It does not need a running session or camera/mic permission. Every invocation must be answered with `sendSuccess` or `sendFailure`. — [voice-invocations SKILL.md](https://github.com/facebook/meta-wearables-dat-android/blob/main/plugins/mwdat-android/skills/voice-invocations/SKILL.md)
- **Inputs**: navigation (Nav, Select, Back), Button, **Capture** button press types, and touchpad Drag events from the glasses. Enabled per app in the Developer Center, with no runtime permission. — [inputs SKILL.md](https://github.com/facebook/meta-wearables-dat-android/blob/main/plugins/mwdat-android/skills/inputs/SKILL.md)
- **Motion** (IMU orientation/acceleration) is experimental (1.0.0). **Display** (Meta Ray-Ban Display only) arrived in 0.7.0. — [CHANGELOG.md](https://github.com/facebook/meta-wearables-dat-android/blob/main/CHANGELOG.md)
- Device state: battery, charging, **don state** (worn or not), hinge, and thermal level. Typed errors include `THERMAL_CRITICAL`, `BATTERY_CRITICAL` and `PEAK_POWER_LIMIT`. — [CHANGELOG.md](https://github.com/facebook/meta-wearables-dat-android/blob/main/CHANGELOG.md)

**Sample apps**
- `samples/CameraAccess`: session → preview → capture/record, which "continu[es] while the app is backgrounded".
- `samples/DisplayAccess`.
- `samples/BirdSpotter`: capture-button photo, ambient audio, IMU, speech Q&A and Display. It runs fully against **MockDeviceKit** (which can also feed the phone camera as fake glasses video).
- Source: [samples/](https://github.com/facebook/meta-wearables-dat-android/tree/main/samples); [BirdSpotter README](https://github.com/facebook/meta-wearables-dat-android/blob/main/samples/BirdSpotter/README.md)
- Community Flutter wrapper: [ChunkyTofuStudios/meta_wearables](https://github.com/ChunkyTofuStudios/meta_wearables).
- AI-coding helpers: the repo ships agent skills and a public docs MCP (`https://mcp.developer.meta.com/wearables`), plus `llms.txt` docs. — [README.md](https://github.com/facebook/meta-wearables-dat-android/blob/main/README.md)

**Ray-Ban Meta Gen 2 hardware**
- 12 MP camera, 3024×4032 stills, 3K video at 30 fps (1440p30 / 1200p60), up to 8 h of typical battery life, and +48 h from the case. — [Meta blog: Ray-Ban Meta (Gen 2) available now](https://www.meta.com/blog/ray-ban-meta-gen-2-now-available-ai-glasses-extended-battery-life-3k-video/); [Android Central](https://www.androidcentral.com/wearables/ray-ban-meta-gen-2); [Tom's Guide review](https://www.tomsguide.com/computing/smart-glasses/ray-ban-meta-gen-2-review) (search summary)
- Third-party apps over DAT get only the Bluetooth stream (max 720×1280), not 3K or 12 MP. Higher resolution goes through the experimental `camera.photo` FULL path.

**Turkey availability (important for a Turkish team)**
- At Connect 2026 Meta said the Ray-Ban Meta, Oakley Meta and Ray-Ban Meta Optics families will launch in **Turkey in Q4 2026**. No exact date or price had been announced. — [Dünya Gazetesi](https://www.dunya.com/foto-galeri/teknoloji/metanin-yapay-zeka-gozlukleri-turkiyeye-geliyor-galeri-841224); [TGRT Haber](https://www.tgrthaber.com/teknoloji/metanin-akilli-gozlukleri-turkiyeye-geliyor-satis-tarihi-belli-oldu-3361358) (search summary)
- Reports conflict on whether Meta AI features fully work in Turkey. One Turkish review describes setup via a US region plus VPN, with English as the most stable command language. — [Technopat review](https://www.technopat.net/sosyal/konu/ray-ban-meta-gen-2-wayfarer.4188221/); [uygulamaakademisi](https://www.uygulamaakademisi.com/ray-ban-meta-gen-2-gorme-engelliler-akilli-gozluk-2026/) (search summary)

### Inferences
- **How frames reach the app:**
  1. Glasses camera → Bluetooth Classic link → Meta AI app / DAT service on the phone → your app's `camera.stream` flow of `VideoFrame`s.
  2. The frames arrive decoded, or as HEVC NALs if `compressVideo` is set.
  3. Convert each frame to a Bitmap or ImageProxy for ML Kit, PaddleOCR or the VLM.
  4. For reading pages, use HIGH at a low fps (2–7 fps) for the best per-frame quality, or `stream.capturePhoto()` once the user is aiming.
- **How audio flows:**
  - Option 1 (experimental): PCM 16 kHz mono via `audioStream`, in sync with video, fed into your own ASR.
  - Option 2 (experimental): the DAT `Speech` module's transcripts.
  - Option 3 (works today, not DAT-specific): the glasses act as a normal Bluetooth headset, so the phone can route TTS output to the glasses speakers and possibly capture the mic via standard Android Bluetooth audio. Not verified in a primary source this session; see Gaps.
- **Triggering:** for a production-publishable app today, the user starts the app from the phone, and the stable API covers sessions plus the stream. "Hey Meta, start …" and Capture-button inputs work for dev/beta testers only.
- **Risk for Turkey:** registration and the Developer Center require an AI-glasses-supported country. Turkey is only just being added (Q4 2026), so the team should confirm Developer Center access from Turkey early.

### Gaps
- No primary statement of the end-to-end stream latency in ms.
- Exact supported locales for the DAT Speech module; Turkish is unknown.
- Whether standard Bluetooth HFP/A2DP mic and speaker routing to a third-party app is the documented audio path. The Meta page "Use device microphones and speakers" exists but could not be opened: [link](https://wearables.developer.meta.com/docs/develop/dat/microphones-and-speakers/).
- Exact date when public (non-beta) publishing opens, and whether Play Store distribution needs Meta review. Not confirmed.
- PhotoResolution FULL pixel dimensions via DAT.

---

## B2. Offline Turkish speech recognition on Android

### Takeaway
Options, best first:
- **whisper.cpp with Whisper small** (or a Turkish fine-tune): the most commonly reported usable offline Turkish option. large-v3 reaches ~7.5% WER on FLEURS-TR but is too big for most phones.
- **Vosk Turkish** (`vosk-model-small-tr-0.3`, 35 MB, Apache-2.0): very light and streaming, but weak (one third-party test: ~34% WER on FLEURS-TR) and outputs no punctuation.
- **Android `SpeechRecognizer.createOnDeviceSpeechRecognizer`** (API 31+): exists and works offline, but whether a Turkish on-device pack exists is unconfirmed. Test on the target devices.

### Cited Findings
- `createOnDeviceSpeechRecognizer` was added in API level 31 and checks whether an on-device recognition service is available. The reference does not list languages. — [Android SpeechRecognizer reference](https://developer.android.com/reference/android/speech/SpeechRecognizer)
- The Android XR guide says SpeechRecognizer is built into Android and "works even when offline" for audio/display glasses. — [Android XR ASR guide](https://developer.android.com/develop/xr/jetpack-xr-sdk/asr) (search summary)
- Google's Speech Recognition & Synthesis app lists Turkish (Turkey) and requires installing voice data per language. — [Wikipedia: Speech Recognition & Synthesis](https://en.wikipedia.org/wiki/Speech_Recognition_%26_Synthesis)
- Vosk `vosk-model-small-tr-0.3`: **35M**, WER "TBD", "Lightweight wideband model for Android and RPi", Apache 2.0. — [Vosk models page](https://alphacephei.com/vosk/models) (search summary). Vosk has an Android library and demo. — [vosk-android-demo](https://github.com/alphacep/vosk-android-demo)
- A third-party vendor benchmark on the FLEURS-TR test reports Vosk-TR (streaming, CPU) at **WER 34.09%, CER 10.31%**. The Vosk version is unspecified, so treat it as unverified. — [alphaneural turkish-stt](https://app.alphaneural.io/models/mihuai/turkish-stt) (search summary)
- An open-source Turkish/English offline voice-notes app found that "whisper.cpp + Whisper small is the only model family with usable Turkish", that NVIDIA Parakeet v3 has no Turkish, and that Vosk's Turkish model is "weak and unpunctuated". — [slvrkskc/offline_voice_notes](https://github.com/slvrkskc/offline_voice_notes) (search summary; developer opinion)
- Whisper large-v3 Turkish: **FLEURS WER 0.075** (vs large-v2 0.083 and Google USM 0.093). — [MDPI Electronics 13(21):4227](https://www.mdpi.com/2079-9292/13/21/4227) (search summary)
- Common Voice Turkish, base Whisper (size unclear): 21.7% WER on 240 clips. Small vendor sample. — [vexascribe Oct 2026](https://vexascribe.com/how-accurate-is-whisper)
- Turkish fine-tunes exist: e.g. whisper-large-v3-turbo-turkish (CV17 WER 18.9) and Sercan/whisper-small-tr. — [selimc/whisper-large-v3-turbo-turkish](https://huggingface.co/selimc/whisper-large-v3-turbo-turkish); [Sercan/whisper-small-tr](https://huggingface.co/Sercan/whisper-small-tr)
- whisper.cpp is a dependency-free C/C++ Whisper port with integer quantization and an Android example. — [whisper.cpp](https://github.com/ggml-org/whisper.cpp)

### Inferences
- Recommended stack:
  - **Commands** ("oku", "tekrar", "sonraki soru", i.e. "read", "repeat", "next question"): Vosk with a restricted grammar, or Android on-device SpeechRecognizer. Low latency.
  - **Free-form questions:** whisper.cpp small or base (q5/q8), which needs ~0.2–0.5 GB of RAM.
- Whisper small on a phone CPU usually runs at or slightly faster than real time on short utterances. This is not measured here. Use VAD and short clips.
- Glasses mic audio (DAT PCM 16 kHz) matches Whisper's 16 kHz input directly.

### Gaps
- No official Whisper tiny/small Turkish WER in a source I opened. The Whisper paper (arXiv 2212.04356) appendix should have FLEURS per-language numbers.
- Turkish availability of Google's on-device recognizer pack is unconfirmed.

---

## B3. Offline Turkish TTS on Android

### Takeaway
There are two offline routes:
1. The system **Google Speech Recognition & Synthesis** engine, through the standard `TextToSpeech` API, with a downloadable Turkish voice. It has the best naturalness and needs zero extra model size, but offline availability depends on the device.
2. **Piper Turkish voices** (`tr_TR` dfki, fahrettin, fettah, all "medium" quality), runnable on Android via the **sherpa-onnx** TTS engine APKs or library.

Math verbalization ("x kare", "karekök", "bölü", i.e. "x squared", "square root", "divided by") has to be done by your own LaTeX-to-Turkish-text step before TTS.

### Cited Findings
- Google's Speech Recognition & Synthesis lists Turkish (Turkey) and requires per-language voice-data installation. — [Wikipedia](https://en.wikipedia.org/wiki/Speech_Recognition_%26_Synthesis)
- Piper's official Turkish voices are **dfki, fahrettin and fettah**, all medium tier. The HF repo history shows fettah added in 2024. — [rhasspy/piper-voices tr_TR](https://huggingface.co/rhasspy/piper-voices/commits/f8b247c49cceeeddfad1e3feaa368c17309f09f7/tr/tr_TR); [Piper voices list](https://tderflinger.github.io/piper-docs/about/voices/download/) (search summary)
- sherpa-onnx publishes Android TTS-engine APKs that bundle each Turkish Piper voice, for arm64-v8a, armeabi-v7a and x86. — [sherpa-onnx TTS engine APKs](https://k2-fsa.github.io/sherpa/onnx/tts/apk-engine.html)
- dfki is described as a male voice with standard Istanbul pronunciation, lightweight and fast. This is a third-party description. — [free.ai DFKI Turkish](https://free.ai/voices/piper-tr-dfki/)

### Inferences
- Use the Android `TextToSpeech` API with `Locale("tr","TR")`, check `isLanguageAvailable` and the voice feature `KEY_FEATURE_NOT_INSTALLED` or network-required flags, and fall back to sherpa-onnx with Piper if no offline Google voice is installed.
- Output to glasses: TTS played through the normal media or communication audio route reaches the glasses speakers when they are the connected Bluetooth audio device. This is inferred and not verified with DAT docs.

### Gaps
- No MOS or listening comparison of the Piper Turkish voices vs Google TTS.
- Coqui XTTS-v2 supports Turkish but is too heavy for phones. Not researched further.

---

## B4. Existing assistive apps for blind users on Meta glasses (reference designs)

### Takeaway
**Be My Eyes "Call a Volunteer"** is built into Meta AI on Ray-Ban Meta and Oakley Meta glasses. It is a first-party Meta partnership, not a DAT app. It launched in the US, CA, UK, IE and AU, then expanded to Meta AI countries (18 in May 2025; ~21 countries per a recent guide). **Turkey is not listed** in any source found. Meta AI's own "describe what I see" and "detailed responses" accessibility features are the other reference point.

### Cited Findings
- Be My Eyes and Meta announced an accessibility partnership. Call a Volunteer started in the US, Canada, UK, Ireland and Australia. — [Be My Eyes news](https://www.bemyeyes.com/news/be-my-eyes-and-meta-announce-accessibility-partnership/)
- In May 2025 Meta said Call a Volunteer would launch "in all 18 countries where Meta AI is supported". — [Meta: Advancing Accessibility (May 2025)](https://about.fb.com/news/2025/05/advancing-accessibility-meta/)
- The Be My Eyes Meta AI Glasses FAQ lists countries including Australia, Austria, Belgium, Brazil, Canada, Denmark, Finland and France, and says others are being scheduled. — [Be My Eyes Meta AI Glasses FAQ](https://support.bemyeyes.com/hc/en-us/articles/29893014835729-Meta-AI-Glasses-FAQ); product page: [Be My Eyes smartglasses](https://www.bemyeyes.com/be-my-eyes-smartglasses/) (search summary)
- A practical review of what works for blind users on Ray-Ban Meta: [discoversight.com](https://discoversight.com/meta-ray-ban-glasses-for-blind-users/). A Turkish article on Gen 2 for the visually impaired: [uygulamaakademisi](https://www.uygulamaakademisi.com/ray-ban-meta-gen-2-gorme-engelliler-akilli-gozluk-2026/)
- Meta's own DAT sample, BirdSpotter, demonstrates the pattern a reading app needs: capture button → photo → processing on the phone → spoken or displayed answer. — [BirdSpotter README](https://github.com/facebook/meta-wearables-dat-android/blob/main/samples/BirdSpotter/README.md)

### Inferences
- The team's app would differ from Be My Eyes by being offline, Turkish-first and math-specific. Be My Eyes and Meta AI need connectivity and may not be available in Turkey.
- UX patterns worth copying: one physical trigger (Capture button, via experimental Inputs), short spoken confirmations, and a human-fallback idea.

### Gaps
- No confirmed third-party DAT-based blind-assist app in production found (publishing is not open). No Seeing AI integration found.

# Candidate small on-device VLMs for a Turkish high-school math assistant for visually impaired students (state as of 2026-11-09)

> **Method note (read first).** In this session `huggingface.co` and `ai.google.dev` could not be reached (DNS blocked by the session's network allowlist), so **no model card could be opened directly**. Every number below comes from web-search extracts of primary pages (HF model cards, arXiv, Google Developers), plus a few secondary pages where noted. Items marked **[PRIOR — not re-verified 2026-11]** come from model cards I knew before this session (2025 releases). Treat them as likely correct but re-check them against the linked card before quoting them in a final report. To verify everything, allow `huggingface.co` and `ai.google.dev` in the session's network settings.
>
> **Big changes since 2025 (as of 2026-11):**
> 1. **Gemma 4** (2026-04-02) replaces Gemma 3n and Gemma 3 4B for on-device use. Its E2B/E4B models are **Apache-2.0**, not the Gemma Terms of Use.
> 2. **Qwen3.5 small** (0.8B/2B/4B/9B, about 2026-03) is natively multimodal under Apache-2.0. It replaces Qwen3-VL-2B/4B (2025-10) and Qwen2.5-VL-3B (2025-01).
> 3. **MiniCPM-V 4.6** (1.3B, about 2026-05) replaces MiniCPM-V 4.5 (8.7B) for phones.
> 4. Microsoft has shipped **no Phi-5**. The newest Phi vision model is Phi-4-reasoning-vision-**15B** (2026-03), which is too large for a phone.
> 5. Liquid AI released LFM2.5-VL-1.6B (2026-01) and reportedly LFM3-VL-2B (late 2026-10; unverified).

## Q1. Candidate overview and benchmark numbers (OCRBench, DocVQA, ChartQA, MathVista, MMMU, MathVerse, multilingual)

### Takeaway
Among the newest models (2026), **Qwen3.5-2B/4B** report the strongest small-model OCR and math-vision scores: OCRBench about 85 and MathVista about 74–85. **Gemma 4 E2B/E4B** report strong document parsing (OmniDocBench 1.5 edit distance 0.29 / 0.18) and MMMU-Pro 44–53. They also have the most mature official Android stack. Everything from 2025 or earlier (Gemma 3n, Gemma 3 4B, Qwen2.5-VL-3B, Qwen3-VL-2B/4B, SmolVLM2, PaliGemma 2, MiniCPM-V 4.5, InternVL3/3.5 small) has been superseded or outscored.

### Cited Findings

**Gemma 4 E2B / E4B — Google, released 2026-04-02 (CURRENT)**
- Family: E2B, E4B, 26B MoE (A4B), 31B dense. A 12B model with unified text, image and audio was added 2026-06-03 (per Wikipedia) — [HF blog "Welcome Gemma 4"](https://huggingface.co/blog/gemma4); [Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/); [Wikipedia](https://en.wikipedia.org/wiki/Gemma_(language_model))
- E2B has 2.3B effective parameters (5.1B with embeddings). E4B has 4.5B effective (8B with embeddings). Both are dense with Per-Layer Embeddings (PLE). Inputs are image, video and **audio** (audio only on the small models). Context is **128K** — [Gemma 4 model card](https://ai.google.dev/gemma/docs/core/model_card_4); [HF google/gemma-4-E2B](https://huggingface.co/google/gemma-4-E2B)
- Technical report dated 2026-06-19 — [arXiv 2607.02770](https://arxiv.org/pdf/2607.02770)
- **MMMU-Pro:** E4B 52.6%, E2B 44.2% (Gemma 3 27B: 49.7%) — [LM Studio Gemma 4 page, which reproduces the official table](https://lmstudio.ai/models/gemma-4); E4B 52.6 also matches [HF gemma-4-E4B-it](https://huggingface.co/google/gemma-4-E4B-it)
- **OmniDocBench 1.5 (edit distance, lower is better):** E4B 0.181, E2B 0.290 (Gemma 3 27B: 0.365) — [LM Studio](https://lmstudio.ai/models/gemma-4)
- **MATH-Vision:** E4B 59.5%, E2B 52.4% (31B: 85.6%, 26B-A4B: 82.4%) — [haotianblog summarising the official table](https://www.haotianblog.com/en/gemma-4-variants-performance-efficiency-en/); [Gemma 4 tech report](https://arxiv.org/pdf/2607.02770)
- **AIME 2026 (no tools):** E4B 42.5%. The Gemma 3 27B reference is listed as 20.8% in one table and 31.0% in another (conflict) — [Gemma 4 tech report](https://arxiv.org/pdf/2607.02770); [wavespeed](https://wavespeed.ai/blog/posts/what-is-google-gemma-4/)
- **MMMLU:** E4B about 76.6, read from a garbled extraction of the tech report table. **Unconfirmed** — [arXiv 2607.02770](https://arxiv.org/pdf/2607.02770)
- No OCRBench, DocVQA, ChartQA or MathVista (testmini) numbers for Gemma 4 E2B/E4B turned up in search. Google's table appears to have moved to OmniDocBench, MMMU-Pro and MATH-Vision — see Gaps.

**Qwen3.5 small (0.8B / 2B / 4B / 9B) — Alibaba, about early 2026-03 (CURRENT)**
- Natively multimodal (vision fused in from pre-training, "early fusion"). Context 262,144 tokens. Claims 201 languages and dialects. License apache-2.0 — [qudata](https://qudata.com/en/news/exploring-qwen35-family/); [LM Studio qwen3.5-2b](https://lmstudio.ai/models/qwen/qwen3.5-2b); [HF Qwen3.5-2B](https://huggingface.co/Qwen/Qwen3.5-2B)
- Small models came out after the 397B flagship (Feb 2026), about early March 2026; the exact date is approximate — [insiderllm](https://insiderllm.com/guides/qwen-3-5-small-models-9b-beats-30b/)
- **Qwen3.5-2B:** OCRBench 84.5 / 85.4, MathVista(mini) 76.7 / 73.9. The two values are presumably thinking vs non-thinking modes; the snippet did not label them — [HF Qwen3.5-2B card](https://huggingface.co/Qwen/Qwen3.5-2B)
- **Qwen3.5-0.8B:** OCRBench 74.5 / 79.1, MathVista 62.2 / 58.6 — [HF Qwen3.5-0.8B README](https://huggingface.co/Qwen/Qwen3.5-0.8B/blob/main/README.md)
- **Qwen3.5-4B:** OCRBench 85.0, MathVista(mini) 85.1. **Qwen3.5-9B:** OCRBench 89.2, MathVista 85.7 — [HF Qwen3.5-9B card](https://huggingface.co/Qwen/Qwen3.5-9B)
- Claim: Qwen3.5-9B beats Qwen3-VL-30B-A3B on 12 of 13 vision tests (third-party summary) — [insiderllm](https://insiderllm.com/guides/qwen-3-5-small-models-9b-beats-30b/)

**Qwen3-VL-2B / 4B — released 2025-10-21 (2B) and 2025-10-15 (4B). SUPERSEDED by Qwen3.5**
- Release dates — [QwenLM/Qwen3-VL GitHub](https://github.com/qwenlm/qwen3-vl); tech report [arXiv 2511.21631](https://arxiv.org/pdf/2511.21631)
- From the comparison table in the Qwen3.5-2B card: Qwen3-VL-4B MathVista(mini) 79.5, OCRBench 80.8; Qwen3-VL-2B MathVista 73.6, OCRBench 79.2 — [HF Qwen3.5-2B](https://huggingface.co/Qwen/Qwen3.5-2B). A third-party blog's "~85% OCRBench" for 4B conflicts with this and is unreliable — [codersera](https://codersera.com/blog/qwen3-vl-4b-vs-qwen3-vl-8b-benchmarks-vram-guide/)
- Model card: [HF Qwen3-VL-4B-Instruct](https://huggingface.co/Qwen/Qwen3-VL-4B-Instruct)

**Qwen2.5-VL-3B — 2025-01. SUPERSEDED (twice)**
- [PRIOR — not re-verified 2026-11] DocVQA 93.9, ChartQA 84.0, OCRBench 797, MathVista 62.3, MMMU 53.1; license "Qwen RESEARCH LICENSE" (non-commercial) for the 3B model, unlike Apache-2.0 for 7B — [HF Qwen2.5-VL-3B-Instruct](https://huggingface.co/Qwen/Qwen2.5-VL-3B-Instruct)

**Gemma 3n E2B / E4B — 2025-06. SUPERSEDED by Gemma 4 E2B/E4B**
- E2B and E4B were trained together, with E2B as a sub-model of E4B ("MatFormer") — [HF Gemma 3n blog mirror](https://hf-2025.pages.dev/blog/gemma3n)
- [PRIOR — not re-verified 2026-11] MobileNet-V5 vision encoder (256/512/768 px inputs); 32K context; about 2 GB / 3 GB runtime memory footprint; text in 140 languages, multimodal understanding in 35 languages; Gemma Terms of Use — [HF google/gemma-3n-E4B-it](https://huggingface.co/google/gemma-3n-E4B-it)
- Vision benchmark numbers (MMMU, DocVQA, ChartQA, MathVista) for 3n did not turn up in search — Gap.

**Gemma 3 4B — 2025-03. SUPERSEDED**
- IT: MMMU 48.8, DocVQA 75.8. PT: ChartQA 75.7, MathVista(testmini) 62.9 (pretrained numbers) — [Gemma 3 model card](https://ai.google.dev/gemma/docs/core/model_card_3?hl=zh-CN); [Gemma 3 tech report arXiv 2503.19786](https://arxiv.org/pdf/2503.19786)

**MiniCPM-V 4.6 (1.3B) — OpenBMB, about 2026-05-11, date unconfirmed (CURRENT, phone-class)**
- 1.3B, the smallest MiniCPM-V; single-image, multi-image and video input; runs on iOS, Android and HarmonyOS — [NYU Shanghai RITS](https://rits.shanghai.nyu.edu/ai/minicpm-v-4-6-a-1-3b-multimodal-model-built-for-phones/); [OpenBMB docs](https://openbmb.cn/docs/en/guides/minicpm-v/minicpm-v-4.6)
- Self-reported: beats Qwen3.5-0.8B on most tasks and reaches "Qwen3.5-2B-level" on OpenCompass, RefCOCO, HallusionBench, MUIRBench and OCRBench. Search returned no exact numbers — [HF openbmb/MiniCPM-V-4.6](https://huggingface.co/openbmb/MiniCPM-V-4.6)
- Spin-off **MiniCPM-OCR 1.0** (1.3B, built on V4.6) reports OCRBench **v2** 54.7 (self-reported) — [fasttoolhub summary](https://www.fasttoolhub.com/en/terms/minicpm-ocr/) (secondary)

**MiniCPM-V 4.5 (8.7B) — 2025-08/09. Too big; SUPERSEDED for phones by 4.6**
- OpenCompass average 77.0 over 8 benchmarks; LLaVA-UHD handles up to 1.8M-pixel images with about 4x fewer visual tokens — [HF openbmb/MiniCPM-V-4_5](https://huggingface.co/openbmb/MiniCPM-V-4_5); [arXiv 2509.18154](https://arxiv.org/pdf/2509.18154). OCRBench 89.0 appears only in a secondary blog — [Medium](https://medium.com/data-science-in-your-pocket/minicpm-v-4-5-best-llm-for-mobiles-94e8b91ac994)

**Phi-4-multimodal-instruct (5.6B) — 2025-02. No small successor**
- 5.6B; the first Phi model with text, audio and vision input — [technologymagazine](https://technologymagazine.com/articles/phi-4-behind-microsofts-smaller-multimodal-ai-models)
- Successor in vision: **Phi-4-reasoning-vision-15B** (2026-03-04), aimed at math and science reasoning and computer use. At 15B it is not phone-class — [MSR blog](https://www.microsoft.com/en-us/research/blog/phi-4-reasoning-vision-and-the-lessons-of-training-a-multimodal-reasoning-model/); [tech report PDF](https://www.microsoft.com/en-us/research/wp-content/uploads/2026/03/Phi-4-reasoning-vision-15B-Tech-Report.pdf)
- No Phi-5 as of mid-2026 — [insiderllm Phi guide](https://insiderllm.com/guides/phi-models-guide/); [frankx](https://www.frankx.ai/blog/phi-analysis-2026). Not checked for 2026-07 to 2026-11.
- [PRIOR — not re-verified 2026-11] Phi-4-MM: MMMU 55.1, DocVQA 93.2, ChartQA 81.4, OCRBench 84.4, MathVista 62.4; **vision modality officially English-only**, while text supports 23 languages including Turkish; MIT license; 128K context — [HF microsoft/Phi-4-multimodal-instruct](https://huggingface.co/microsoft/Phi-4-multimodal-instruct)

**SmolVLM2 (256M / 500M / 2.2B) — HuggingFace, 2025-02. Outclassed**
- SmolVLM2-2.2B: OCRBench 725 (= 72.5), MathVista 51.5 (from Liquid's comparison table) — [HF LiquidAI/LFM2-VL-1.6B](https://huggingface.co/LiquidAI/LFM2-VL-1.6B); [Liquid blog](https://www.liquid.ai/blog/lfm2-vl-efficient-vision-language-models)
- As of 2026-10 there is no SmolVLM3; SmolVLM2-256M is still the smallest widely used instruction VLM — [forasoft (secondary)](https://www.forasoft.com/learn/ai-for-video-engineering/articles-ai/depth-anything-smolvlm-small-on-device-cv)
- [PRIOR] Apache-2.0; mostly English training data.

**Liquid AI LFM2-VL / LFM2.5-VL / LFM3-VL**
- LFM2-VL-1.6B (2025-08): OCRBench 742, MathVista 51.1 — [Liquid blog](https://www.liquid.ai/blog/lfm2-vl-efficient-vision-language-models); [LFM2 tech report arXiv 2511.23404](https://arxiv.org/pdf/2511.23404)
- LFM2.5-VL-1.6B (2026-01) has better multi-image and multilingual vision; no numbers found — [Liquid LFM2.5 blog](https://www.liquid.ai/blog/introducing-lfm2-5-the-next-generation-of-on-device-ai)
- LFM3-VL-2B (late 2026-10, about 1.9B: 1.73B LM + 164M encoder) comes **only from a listicle and is unverified** — [tinyweights](https://tinyweights.dev/posts/best-local-vision-language-models-2026/)

**InternVL3 / 3.5 small — 2025. Superseded by Qwen3.5 in practice**
- InternVL3.5-2B: DocVQA 89.4, InfoVQA 70.8 — [arXiv 2508.18265](https://arxiv.org/html/2508.18265v2). InternVL3-2B: OCRBench 831 — [Liquid blog table](https://www.liquid.ai/blog/lfm2-vl-efficient-vision-language-models); [InternVL3 arXiv 2504.10479](https://arxiv.org/pdf/2504.10479)

**Others**
- PaliGemma 2 (2024-12): [PRIOR] 3B/10B/28B at 224/448/896 px; a fine-tune base, not a chat assistant; Gemma ToU. Obsolete for this use — [HF google/paligemma2-3b-pt-448](https://huggingface.co/google/paligemma2-3b-pt-448)
- Llama: [PRIOR] the smallest Llama vision model is 3.2-11B, and Llama 4 models are MoE ≥109B, so no phone-class Llama VLM exists. The Llama 3.2 AUP denied multimodal-model rights to EU-domiciled entities — [Llama 3.2 AUP](https://www.llama.com/llama3_2/use-policy/)
- Kakao Kanana-2-v-3b is mentioned without detail — [tinyweights](https://tinyweights.dev/posts/best-local-vision-language-models-2026/)

### Inferences
- **On published numbers, Qwen3.5-2B beats every 2025 small VLM** on OCRBench (about 85 vs 72–83) and MathVista (about 74–77 vs 51–79), at about 2B parameters. Qwen3.5-4B (MathVista 85.1) is the strongest at ≤5B.
- Gemma 4 E2B/E4B is hard to compare directly with Qwen because Google reports different benchmarks. Its OmniDocBench 0.181 (E4B) beats Gemma 3 27B, which suggests good page parsing, and its MATH-Vision 52–60 is strong for the size.
- MathVerse numbers for any 2026 small model were not found. Neither were multilingual OCR or VQA numbers (MTVQA, multilingual OCRBench). These matter most for Turkish and should be measured in-house.

### Gaps
- OCRBench, DocVQA, ChartQA and MathVista for Gemma 4 E2B/E4B. MathVerse and MTVQA for every 2026 model. Exact MiniCPM-V 4.6 scores. LFM2.5-VL and LFM3-VL scores. Qwen3.5 image-resolution and token-budget details. Gemma 4 visual-token budget options. All of these were blocked because the HF and ai.google.dev cards could not be fetched.
- No independent (OpenCompass, Open VLM Leaderboard) cross-check of 2026 models was retrieved.

## Q2. Evidence on Turkish quality (generation, and reading ç ğ ı ö ş ü)

### Takeaway
There is **no Turkish VQA or math benchmark that covers small on-device VLMs**. The two Turkish OCR studies show that (i) Turkish-specific characters remain a failure point for open VLMs, with only GPT-4o stable in one study, and (ii) OCR-specialised pipelines (PaddleOCR, HunyuanOCR) lead on Turkish documents and equations. Turkish quality of Gemma 4 or Qwen3.5 small models must be **measured in-house**.

### Cited Findings
- Yılmaz et al., "Benchmarking OCR and VLMs for Turkish Text Recognition" (synthetic, 6,600 images; published in IJDAR/Springer 2026): VLMs beat traditional OCR, and GPT-4o and Qwen2.5-VL performed best. **Images with Turkish-specific characters were hard for all models; only GPT-4o stayed stable.** Handwriting was hard for everyone. Gemma was not named among the tested models — [Springer IJDAR 2026](https://link.springer.com/article/10.1007/s10032-026-00613-6); [preprint](https://www.researchsquare.com/article/rs-7797886/v1)
- **OCRTurk** (arXiv 2602.03693, SIGTURK 2026): 180 Turkish documents (academic articles, theses, slides, non-academic). It evaluated only OCR-specialised systems: DeepSeekOCR, Docling, PaddleOCR, HunyuanOCR, NanonetsOCR2, Nemotron v1.1, OlmOCR2. PaddleOCR was best overall (0.89 unified score on the hard tier) and the only system above average in all four categories. **Equations:** NanonetsOCR2 and PaddleOCR were best (NED, BLEU, CDM). **Turkish Character Score:** HunyuanOCR was best. Slides were hardest — [arXiv 2602.03693](https://arxiv.org/abs/2602.03693); [ACL Anthology SIGTURK](https://aclanthology.org/2026.sigturk-1.16.pdf); [Moonlight review](https://www.themoonlight.io/en/review/ocrturk-a-comprehensive-ocr-benchmark-for-turkish)
- Turkish dish classification with Turkish prompts: Aya Vision 32B was best on TurkishFoods-15 (F1 85.9%); Gemma 3 27B was best on TurkishFoods-25 (76.7%). These are large models, not math — [SAUCIS (DergiPark)](https://dergipark.org.tr/en/pub/saucis/article/1727583)
- TurkBench, a Turkish *text* LLM benchmark (2026-01) — [arXiv 2601.07020](https://arxiv.org/html/2601.07020v1). A Turkish text leaderboard on the Turkish-Gemma card places Gemma-3-27B-it close to Qwen2.5 — [HF ytu-ce-cosmos/Turkish-Gemma-9b-v0.1](https://huggingface.co/ytu-ce-cosmos/Turkish-Gemma-9b-v0.1)
- Qwen3.5 claims 201 languages and dialects with emphasis on low-resource languages. None of the sources found names Turkish explicitly — [qudata](https://qudata.com/en/news/exploring-qwen35-family/)
- [PRIOR — not re-verified] Gemma 3/3n: text in 140 languages, multimodal in 35 — [HF gemma-3n-E4B-it](https://huggingface.co/google/gemma-3n-E4B-it). The Gemma 4 language count was not confirmed in search.
- [PRIOR] Phi-4-multimodal lists Turkish for text, but vision is English-only — [HF Phi-4-multimodal-instruct](https://huggingface.co/microsoft/Phi-4-multimodal-instruct)

### Inferences
- Gemma models historically have the broadest official multilingual coverage, and Gemma 3 27B did well in Turkish-prompt tests. That makes **Gemma 4 E4B a strong prior for fluent Turkish generation**. Qwen leads on OCR and math numbers, but its Turkish generation quality at 2B/4B is unproven.
- The ı/i and ş/s confusions reported for open VLMs are a real risk for a blind user, who cannot visually notice a misread. The app needs a confidence or verification step, for example reading back the transcription, or cross-checking with a Turkish OCR engine (PaddleOCR-class) for text-heavy pages.
- Math notation (exponents, roots, fractions) mostly uses language-independent LaTeX-style output. The Turkish-specific risk sits in word problems and option texts ("A) ... E)").

### Gaps
- No Turkish benchmark covers Gemma 4 E2B/E4B, Qwen3.5-2B/4B or MiniCPM-V 4.6, and I found no community reports specific to these models in Turkish. MTVQA and multilingual OCRBench numbers (which may include Turkish) were not retrieved.

## Q3. Official on-device formats and Android demos

### Takeaway
**Gemma 4 E2B/E4B has the most official Android path**: LiteRT-LM (`.litertlm`), measured on a Galaxy S26 Ultra, plus the Google AI Edge Gallery app and AICore. **MiniCPM-V 4.6** officially supports iOS, Android and HarmonyOS, with edge adaptation paths open-sourced and Ollama integration. **Qwen3.5 small** runs through community and partner formats (GGUF with mmproj, a litert-community `.litertlm` build, MNN, Qualcomm GenieX), with no first-party Qwen Android app confirmed.

### Cited Findings
- Google LiteRT-LM supports Gemma 4 E2B and E4B (larger models "coming soon"). E2B runs in **<1.5 GB** on some devices, using 2-bit and 4-bit weights plus memory-mapped per-layer embeddings — [Google AI Edge: LiteRT-LM Gemma 4](https://developers.google.com/edge/litert-lm/models/gemma-4); [Google Developers Blog](https://developers.googleblog.com/bring-state-of-the-art-agentic-skills-to-the-edge-with-gemma-4/)
- Official Galaxy S26 Ultra figures: model file **2.58 GB (E2B) / 3.65 GB (E4B)**; peak memory on CPU **about 1733 MB / 3283 MB**; on GPU **about 676 MB / 710 MB** — [Google AI Edge LiteRT-LM Gemma 4](https://ai.google.dev/edge/litert-lm/models/gemma-4)
- Both models can be tried in the **Google AI Edge Gallery** app — [Google Developers Blog](https://developers.googleblog.com/bring-state-of-the-art-agentic-skills-to-the-edge-with-gemma-4/). Google worked with Pixel, Qualcomm and MediaTek on them — [Google blog](https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/)
- Third-party RAM estimates (3–8 GB) conflict with each other and likely reflect download sizes or conservative guesses — [cloudinsight](https://cloudinsight.cc/en/blog/gemma-4-hardware-requirements); [gemma4all](https://gemma4all.com/blog/gemma-4-on-phone). Q4 E2B is about 1.5 GB per [aurigait](https://aurigait.com/blog/gemma-4-features-benchmarks-guide/)
- MiniCPM-V 4.6 runs on iOS, Android and HarmonyOS, "with every edge adaptation path open-sourced", and is in Ollama's official library — [OpenBMB docs](https://openbmb.cn/docs/en/guides/minicpm-v/minicpm-v-4.6)
- Qwen3.5-2B as a community `.litertlm` (requires litert-lm ≥0.15) — [HF litert-community/Qwen3.5-2B](https://huggingface.co/litert-community/Qwen3.5-2B). GGUF with `mmproj-BF16.gguf` vision projector — [HF NobodyWho/Qwen_Qwen3.5-2B-GGUF](https://huggingface.co/NobodyWho/Qwen_Qwen3.5-2B-GGUF). 4B GGUF Q4_K_M — [HF bartowski/Qwen_Qwen3.5-4B-GGUF](https://huggingface.co/bartowski/Qwen_Qwen3.5-4B-GGUF). Qualcomm GenieX Chat lists Qwen3.5-2B on Snapdragon NPU, GPU or CPU, Android 12+ — [Qualcomm AI Hub](https://aihub.qualcomm.com/apps/geniex_chat_android)
- Anecdotal: Qwen3.5-4B (2.65 GB) in MNN Chat on a Galaxy S24+ CPU ran at 14.8 tok/s decode with 2.9 GB peak memory — [Reddit snapshot](https://reddit.sentinel-team.org/posts/1s3629q/snapshots/2026-03-27T22%3A19%3A49.793866Z) (single user report)
- Gemma 4 E4B reaches about 38 tok/s decode at int4 on Apple Silicon via MLX (secondary) — [wavespeed](https://wavespeed.ai/blog/posts/what-is-google-gemma-4/)

### Inferences
- For a production Android app, Gemma 4 on LiteRT-LM (GPU backend, under 1 GB peak) has the lowest integration risk. Qwen3.5-2B can run on the same runtime through the community `.litertlm`, which allows a side-by-side A/B test inside one app.
- 4-bit sizes: E2B about 1.5 GB, Qwen3.5-4B GGUF Q4 about 2.6 GB, MiniCPM-V 4.6 (1.3B) under 1 GB, estimated from the parameter count. All of these fit a 6–8 GB mid-range phone.

### Gaps
- Whether Qwen ships any first-party Android demo for Qwen3.5. ExecuTorch `.pte` or MLC builds for these models. Official MiniCPM-V 4.6 memory figures. Gemma 4 measurements on mid-range (non-flagship) Android devices.

## Q4. License terms relevant to a free educational app

### Takeaway
As of 2026-11, the two top candidates are both **Apache-2.0**: Gemma 4 (a change from the Gemma Terms of Use, as of 2026-04-02) and the Qwen3.5 small models. Older models carry restrictions: the Qwen2.5-VL-3B research license is non-commercial, and Gemma 3/3n/PaliGemma 2 are under the Gemma ToU with its prohibited-use policy.

### Cited Findings
- Gemma 4 launched 2026-04-02 under OSI-approved Apache-2.0, replacing the Gemma Terms of Use — [noze.it](https://www.noze.it/en/insights/gemma-new-release/); [machineherald](https://machineherald-io.pages.dev/article/2026-04/03-google-releases-gemma-4-under-apache-20-license-making-its-most-capable-open-models-fully-redistributable-for-the-first-time); [HF blog](https://huggingface.co/blog/gemma4)
- Sources disagree on whether the change is retroactive. One says Gemma 3 and other earlier models keep the custom ToU; others imply all Gemma models switched — [vorplabs](https://vorplabs.com/models/gemma-license) vs news coverage. **Assume Gemma 3/3n remain under the Gemma ToU.**
- The old Gemma ToU had a prohibited-use policy that Google could update unilaterally, plus pass-through obligations — [vorplabs](https://vorplabs.com/models/gemma-license); [mindstudio](https://www.mindstudio.ai/blog/what-is-gemma-4-apache-2-license-commercial-ai-deployment)
- The Qwen3.5 small cards list apache-2.0 — [HF Qwen3.5-2B](https://huggingface.co/Qwen/Qwen3.5-2B); [insiderllm](https://insiderllm.com/guides/qwen-3-5-small-models-9b-beats-30b/)
- [PRIOR — not re-verified] Qwen2.5-VL-3B uses the "Qwen Research License" (non-commercial); Qwen3-VL is Apache-2.0 — [HF Qwen2.5-VL-3B-Instruct](https://huggingface.co/Qwen/Qwen2.5-VL-3B-Instruct)
- [PRIOR — not re-verified] Phi-4-multimodal is MIT — [HF](https://huggingface.co/microsoft/Phi-4-multimodal-instruct). SmolVLM2 is Apache-2.0. Earlier MiniCPM-V releases used the "MiniCPM Model License": free for academic use, with commercial use requiring a registration questionnaire — [OpenBMB/MiniCPM-V GitHub](https://github.com/OpenBMB/MiniCPM-V). Liquid LFM models use Liquid's own "LFM Open License" with a revenue threshold — [Liquid](https://www.liquid.ai/blog/introducing-lfm2-5-the-next-generation-of-on-device-ai). Llama 3.2 vision has the EU-entity restriction — [Llama 3.2 AUP](https://www.llama.com/llama3_2/use-policy/)

### Inferences
- A free Turkish educational app has **no licensing obstacle with Gemma 4 or Qwen3.5** beyond Apache-2.0 attribution and NOTICE requirements. MiniCPM-V 4.6 and LFM need their exact current license checked, since they may require registration or carry thresholds. Avoid Qwen2.5-VL-3B entirely.

### Gaps
- The exact license text for MiniCPM-V 4.6 and LFM2.5-VL / LFM3-VL as of 2026-11. Google's official statement on whether Gemma 3n terms changed.

## Q5. Best 1–2 models for (a) reading Turkish math pages and (b) explaining or solving high-school math in Turkish

### Takeaway
**Primary shortlist (as of 2026-11): Gemma 4 E4B (or E2B on low-RAM phones) and Qwen3.5-4B (or 2B).** Gemma 4 wins on the official Android/LiteRT stack, multilingual heritage and document parsing (OmniDocBench). Qwen3.5 wins on published OCRBench and MathVista. Neither has Turkish-specific evidence, so a small in-house Turkish math-page evaluation must make the final pick. MiniCPM-V 4.6 (1.3B) is the low-end fallback.

### Cited Findings
- Qwen3.5-4B: OCRBench 85.0, MathVista 85.1. Qwen3.5-2B: OCRBench about 85, MathVista about 74–77 — [HF Qwen3.5-9B](https://huggingface.co/Qwen/Qwen3.5-9B); [HF Qwen3.5-2B](https://huggingface.co/Qwen/Qwen3.5-2B)
- Gemma 4 E4B: OmniDocBench 1.5 edit 0.181, MMMU-Pro 52.6, MATH-Vision 59.5, AIME-2026 42.5. On S26 Ultra GPU, peak memory is about 710 MB — [LM Studio](https://lmstudio.ai/models/gemma-4); [arXiv 2607.02770](https://arxiv.org/pdf/2607.02770); [Google AI Edge](https://developers.google.com/edge/litert-lm/models/gemma-4)
- Turkish characters trip up open VLMs; OCR-specialised engines lead on Turkish documents and equations — [IJDAR 2026](https://link.springer.com/article/10.1007/s10032-026-00613-6); [OCRTurk](https://arxiv.org/abs/2602.03693)

### Inferences
- **(a) Reading Turkish math textbook pages:** start with **Qwen3.5-4B** for the highest small-model OCR and math-vision scores, and **Gemma 4 E4B** for document parsing and the mature runtime. A hybrid design can lower the ç/ğ/ı/ö/ş/ü error risk: a Turkish-capable OCR or layout engine for running text, plus the VLM for formulas and figures. Ask for structured output with LaTeX for math and an explicit "A)–E)" list for options.
- **(b) Explaining and solving in Turkish:** **Gemma 4 E4B** is the likely better Turkish writer, given Gemma's multilingual track record and AIME/MATH-Vision scores that are strong for its size. Qwen3.5-4B, with thinking mode, is likely stronger at raw math, but its Turkish fluency at 4B is unverified. Native audio input in Gemma 4 E2B/E4B is a bonus for a blind-user voice interface. The app still needs separate TTS output.
- Superseded and not recommended for new work: Gemma 3n, Gemma 3 4B, PaliGemma 2, Qwen2.5-VL-3B (license too), Qwen3-VL-2B/4B, SmolVLM2, MiniCPM-V 4.5 (size), InternVL3/3.5 small, Phi-4-multimodal (English-only vision, 5.6B).
- Suggested evaluation: 50–100 photographed Turkish MEB/YKS-style pages covering exponents, roots, fractions and option texts. Measure character error rate with Turkish-character accuracy, formula exact-match and answer accuracy, on-device latency, and peak RAM on a mid-range Android phone. Compare Gemma 4 E2B/E4B, Qwen3.5-2B/4B and MiniCPM-V 4.6.

### Gaps
- No direct evidence exists for any candidate on Turkish math pages; the recommendation rests on general benchmarks plus language-coverage priors. Whether a newer Gemma or Qwen small model shipped between 2026-07 and 2026-11 could not be fully ruled out, because search coverage of the latest months was thin. The LFM3-VL-2B (late 2026-10) claim needs verification.

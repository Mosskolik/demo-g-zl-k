# Ücretsiz GPU ile küçük VLM ince ayarı (Türkçe matematik sayfası okuma) ve Android'e aktarım — Kasım 2026 notları

> Method note (read first): The direct-page fetch tool was blocked for every host in this session (docs.unsloth.ai, www.kaggle.com, research.google.com all failed DNS in the sandbox). All findings below come from web-search result snippets/summaries of the cited pages, not from reading the full pages. Treat numbers as "reported by the cited page as of search date 2026-11-09" and re-verify on the primary page before quoting in a final report. Where only third-party sources were found, this is marked.

## 1. Free compute today (Kaggle, Colab, others)

### Takeaway
Kaggle remains the most predictable free option (~30 GPU-h/week, T4x2 or P100, ~12 h sessions); Colab free gives a non-guaranteed T4 with a ~12 h hard cap and undisclosed dynamic limits. Lightning AI's free tier reportedly changed in Sep 2026 from monthly credits to a one-time grant; Hugging Face ZeroGPU is designed for short inference calls and is not a practical training platform.

### Cited Findings
- Kaggle weekly GPU quota is commonly reported as ~30 h/week, shared across P100 and T4 x2; per-session cap ~12 h; an active interactive session counts toward quota even when idle. Kaggle does not appear to publish a firm figure; some sources describe it as "dynamic, 30 h minimum", others as 15–30 h depending on demand (third-party) — [AIMultiple free cloud GPU](https://aimultiple.com/free-cloud-gpu); [Notre Dame course notes on Kaggle](https://www3.nd.edu/~dchiang/teaching/nlp/2023/kaggle.html); [Kaggle knowledge base dump (Nov 2025)](https://huggingface-proxy.pages.dev/datasets/John6666/knowledge_base_md_for_rag_1/blob/93babea0b1c303124af8c062c459fbceea4c3208/kaggle_20251121.md)
- Quota reset time conflicts: one source says Friday 8 pm EDT, another Sunday 00:00 UTC — unverified — same sources as above.
- Kaggle GPU notebooks reportedly upgraded to ~29 GB RAM and 4 CPU cores (late 2025, third-party) — [lilys.ai note](https://lilys.ai/en/notes/google-tpu-20251128/free-kaggle-gpu-29gb-4-cpu-update)
- Official Kaggle doc for this is https://www.kaggle.com/docs/efficient-gpu-usage (could not be fetched in this session).
- Colab free: Google's FAQ says the free tier relies on "dynamic usage limits that sometimes fluctuate" and does not provide guaranteed/unlimited resources; GPU types "vary over time"; limits are not published — [Hivenet guide quoting Colab FAQ](https://www.hivenet.com/post/google-colaboratory-gpu-complete-guide-to-free-cloud-gpu-access-and-limitations); primary: https://research.google.com/colaboratory/faq.html (not fetchable here).
- Colab free: typically a T4, 12-hour hard session cap, plus a ~90-minute idle timeout (third-party) — [Hivenet](https://www.hivenet.com/post/google-colaboratory-gpu-complete-guide-to-free-cloud-gpu-access-and-limitations); [gpuperhour "Free Cloud GPUs in 2026"](https://gpuperhour.com/blog/free-cloud-gpus-and-credits)
- Colab Pro ~$12.67/mo? ("guaranteed T4, 24 h sessions, 500 units") — single third-party claim, likely outdated pricing — [aitoolsatlas](https://aitoolsatlas.ai/tools/google-colab/pricing)
- Lightning AI: older coverage = free tier with 15 credits/month (~80 GPU-h on interruptible machines), credits expire monthly. A Sept-2026 tracker reports restructuring to a one-time grant of up to 30 credits (5 on signup + 25 after adding a card, expiring after 12 months) and higher GPU rates — SUPERSEDES the monthly-15 info if correct (single third-party source) — [UsagePricing change log 2026-09-21](https://www.usagepricing.com/blueprint/activity/lightning-ai-2026-09-21-gpu-rate-card-reprice); older: [getdeploying Lightning AI](https://getdeploying.com/lightning-ai)
- Hugging Face ZeroGPU: shared H200-backed runtime for Gradio Spaces; each `@spaces.GPU` call has a 60 s default duration unless set longer; quota is checked against *requested* duration; daily quota resets 24 h after first use; extra use billed $1 per 10 min from prepaid credits; PRO users can host up to 10 ZeroGPU Spaces; `torch.compile` unsupported (AoT compile with torch ≥2.8 works) — [HF Hub docs: Spaces ZeroGPU](https://huggingface.co/docs/hub/spaces-zerogpu); [HF forum thread](https://discuss.huggingface.co/t/it-seems-use-60-sec-gpu-quota-instead-of-real-time-usage/175130/10)
- PRO ZeroGPU quota multiplier differs across doc versions (x7 vs x8) — [HF docs](https://huggingface.co/docs/hub/spaces-zerogpu)

### Inferences
- Kaggle T4x2 (2×16 GB) or P100 (16 GB) and Colab T4 (16 GB) are all pre-Ampere: no bf16 support on T4/P100, so training runs in fp16; FlashAttention-2 is not available on these GPUs. Unsloth notebooks are designed around the T4.
- For a 2–5k sample LoRA run, one Kaggle week (~30 h) is ample; the binding constraint is the ~12 h session — save checkpoints to /kaggle/working or push to HF Hub regularly.
- ZeroGPU's per-call duration model (seconds-to-minutes) makes it unsuitable for multi-hour fine-tuning; use it to host a demo of the fine-tuned model instead.

### Gaps
- Exact current Kaggle quota/reset and Colab free limits could not be read from primary pages (fetch blocked). No official HF statement that training is prohibited on ZeroGPU was found — only that it is architected for short calls.

## 2. Fine-tuning tools and VRAM/time per model

### Takeaway
Unsloth is the most beginner-friendly path (free Colab/Kaggle notebooks for Gemma 4 E2B/E4B, Gemma 3n, Gemma 3 4B, Qwen2.5-VL, Qwen3-VL, Qwen3.5 small VLMs). For a 2–4B VLM, LoRA fits in ~5–10 GB VRAM, i.e. a free T4. Newer model generations (Gemma 4, Qwen3.5) supersede Gemma 3n / Qwen2.5-VL as the "default" choice in late 2026.

### Cited Findings
- Unsloth notebook catalog lists vision notebooks for: Qwen3-VL (8B) Vision and Vision GSPO/GRPO, Gemma 3n (E4B) Text+Vision+Audio, Qwen2.5-VL, Gemma 3 (4B), ERNIE 4.5 VL (28B) — [Unsloth Notebooks](https://unsloth.ai/docs/get-started/unsloth-notebooks); [Unsloth Qwen3-VL guide](https://unsloth.ai/docs/models/qwen3-vl-how-to-run-and-fine-tune)
- Unsloth supports fine-tuning and RL for Qwen3-VL incl. 30B/235B, video and object detection; two Qwen3-VL (8B) notebooks train free on Colab — [Unsloth Qwen3-VL](https://docs.unsloth.ai/models/qwen3-vl-run-and-fine-tune)
- Gemma 4 (Google DeepMind, Apache 2.0, released ~April 2026): Unsloth guide says Gemma 4 E2B trains on ~8 GB VRAM, E4B ~10 GB; a German translation of the guide lists E2B LoRA 8–10 GB and E4B LoRA 17 GB (conflict — likely QLoRA vs 16-bit LoRA; verify on English page). Loss of 13–15 for E2B/E4B at the start is described as "perfectly normal" (multimodal quirk) — [Unsloth Gemma 4 Fine-tuning Guide](https://unsloth.ai/docs/models/gemma-4/train); [German version](https://unsloth.ai/docs/de/modelle/gemma-4/train)
- Unsloth posted free Colab notebooks for Gemma 4 E4B (Vision + Text), E4B audio, and an "Unsloth Studio" web-UI notebook (April 2026 Reddit post, via snapshot) — [Reddit snapshot 2026-04-09](https://reddit.sentinel-team.org/posts/1sexdhk/snapshots/2026-04-09T16%3A11%3A00.655487Z); third-party walkthrough: [wavect: fine-tune Gemma 4 free on Colab](https://wavect.io/blog/fine-tune-gemma-4-free-unsloth-colab.md)
- Qwen3.5 small models (0.8B, 2B, 4B, 9B) are natively multimodal; Unsloth lists bf16 LoRA VRAM ≈3 GB (0.8B), ≈5 GB (2B), ≈10 GB (4B); free Colab vision notebooks at each size; Unsloth advises against QLoRA (4-bit) for these models; full FT ≈4× LoRA VRAM — [Unsloth Qwen3.5 fine-tune](https://unsloth.ai/docs/models/qwen3.5/fine-tune)
- One review reports OCRBench 79.1 (Qwen3.5-0.8B) and 85.4 (2B) (third-party) — [insiderllm Qwen 3.5 small models](https://insiderllm.com/guides/qwen-3-5-small-models-9b-beats-30b/)
- Unsloth Qwen3-VL-2B-Instruct GGUF exists on HF (base model available for small-scale fine-tuning/export) — [unsloth/Qwen3-VL-2B-Instruct-GGUF](https://huggingface.co/unsloth/Qwen3-VL-2B-Instruct-GGUF)

### Inferences
- Practical shortlist for "Turkish math page → text" on phone: Qwen3.5-2B / Qwen3-VL-2B (strong OCR, GGUF path proven), Gemma 4 E2B (official LiteRT-LM path, see §3), Gemma 3n E2B/E4B (older; LiteRT export problematic). All fit LoRA on a free T4.
- Alternatives to Unsloth (HF TRL `SFTTrainer` + PEFT, LLaMA-Factory, ms-swift) also support Qwen-VL/Gemma VLM LoRA; Unsloth is preferred on T4 for memory/speed and its ready notebooks. (Not separately sourced in this session.)
- Typical starting LoRA settings in Unsloth vision notebooks (from prior knowledge, not re-verified here): r=16, lora_alpha=16, dropout 0, `finetune_vision_layers`/`finetune_language_layers` toggles, lr 2e-4, 1–3 epochs, batch 2 × grad-accum 4. For OCR/format adaptation, enabling vision layers usually helps for unusual inputs (handwriting, photos); text-only layers suffice for output-format changes.

### Gaps
- No sourced wall-clock training time for 2–5k image-text pairs on T4 was found. (Rough inference: with ~1k-token samples, a 2B model LoRA on T4 is on the order of 1–3 s/step at batch 8 → a few hours per epoch for 5k samples; must be measured.)
- No sourced Kaggle-specific Unsloth vision notebooks list (Unsloth historically mirrors notebooks for Kaggle; not verified).
- TRL/PEFT/LLaMA-Factory/ms-swift VLM support lists were not re-verified this session.

## 3. Export path: LoRA → Android on-device format

### Takeaway
Two paths are realistic: (a) merge → GGUF + separate `mmproj` → llama.cpp on Android — proven for Qwen2.5-VL/Qwen3-VL/Gemma 3 vision; (b) Google's `litert-torch` (renamed from ai-edge-torch) `export_hf` → `.litertlm` for LiteRT-LM — officially documented for text fine-tunes (Gemma 270M tutorial) and for Gemma 4 vision (`--task=image_text_to_text --export_vision_encoder`), but vision export of fine-tuned checkpoints has had bugs; Gemma 3n multimodal export of fine-tunes is not reliable. ExecuTorch and MLC are weaker for VLMs.

### Cited Findings
- Official Google tutorial "Deploy a fine-tuned Gemma 270m model with the Google AI Edge stack": convert a fine-tuned HF checkpoint to `.litertlm` with `litert-torch export_hf`, then check quality parity with the `ai-edge-eval` tool (text-only model) — [Google AI Edge: convert and run](https://developers.google.com/edge/litert-lm/tutorials/convert-and-run)
- Google docs: for supported models, `--task=image_text_to_text` and `--export_vision_encoder` export the vision encoder; Gemma 4 (`Gemma4ForConditionalGeneration`) listed as supported — [Convert PyTorch GenAI models](https://developers.google.com/edge/litert/conversion/pytorch/genai); [LiteRT-LM Gemma 4 page](https://developers.google.com/edge/litert-lm/models/gemma-4)
- `export_hf` supports Gemma 4 text + vision but NOT the audio encoder (open issue) — [litert-torch issue #1039](https://github.com/google-ai-edge/litert-torch/issues/1039)
- A Gemma 4 export reportedly worked with pinned `litert-torch==0.9.1`, `litert-lm==0.13.1` — [litert-torch issue #998](https://github.com/google-ai-edge/litert-torch/issues/998)
- Practitioner report: `litert_torch/model_ext/gemma4/vision_exportable.py` was a stub raising `NotImplementedError`; after a local patch (and replacing the Gemma 4 pooler) the vision+text bundle exported and ran on device — [Medium: How I Got a Fine-Tuned Gemma 4 Working on Android](https://medium.com/@amanie.elhajj/how-i-got-a-fine-tuned-gemma-4-working-on-android-51484e6369ed)
- Community pipeline PR: fine-tune Gemma 4 E2B on image rows and convert with image_text_to_text + vision encoder; notes pinned transformers/litert-torch versions couldn't train/export with images because the Gemma 4 image processor imports torchvision; conversion uses 280 soft tokens, max_num_patches 2520 — [DenisovAV/litetune PR #115](https://github.com/DenisovAV/litetune/pull/115)
- Pitfall: a fine-tuned `.litertlm` compiled text-only has no vision encoder section; if the engine config enables vision, the runtime fails on first message — [DEV: My Fine-Tuned Gemma 4 Loaded Fine, Then Broke](https://dev.to/jdshah/my-fine-tuned-gemma-4-loaded-fine-then-broke-on-the-first-message-1nef)
- Gemma 3n: exporting `google/gemma-3n-E4B-it` via `export_hf` loads on device but generates only `<pad>` tokens (ID 0); reporter asks whether fine-tuned 3n can be exported at all — [litert-torch issue #994](https://github.com/google-ai-edge/litert-torch/issues/994). Older (≈2025) LiteRT-LM issue: ai-edge-torch said converting fine-tuned Gemma 3n was not possible at that time — [LiteRT-LM issue #547](https://github.com/google-ai-edge/LiteRT-LM/issues/547) (SUPERSEDED tooling name: ai-edge-torch → litert-torch; status for 3n still unresolved).
- LiteRT-LM repo (inference framework for Android/edge) — [google-ai-edge/LiteRT-LM](https://github.com/google-ai-edge/LiteRT-LM)
- llama.cpp: `mmproj` files are architecture-specific; for listed models use `convert_hf_to_gguf.py --mmproj` to produce the projector; Gemma 3 listed (1B has no vision); Qwen2/2.5-VL mmproj conversion added in PR #13209; run with `-m model.gguf --mmproj mmproj.gguf` — [llama.cpp docs/multimodal.md](https://github.com/ggml-org/llama.cpp/blob/master/docs/multimodal.md); [tools/mtmd README (Debian mirror)](https://sources.debian.org/src/llama.cpp/8064%2Bdfsg-1/tools/mtmd/README.md); [PR #13209](https://github.com/ggml-org/llama.cpp/pull/13209/files)
- Unsloth `model.save_pretrained_gguf("dir", tokenizer, quantization_method="q4_k_m")` (also q8_0, f16) merges LoRA → 16-bit → GGUF; Unsloth's Qwen3-VL guide runs models with a separate `mmproj-F16.gguf` — [Unsloth Saving to GGUF](https://unsloth.ai/docs/basics/inference-and-deployment/saving-to-gguf); [Unsloth Qwen3-VL](https://docs.unsloth.ai/models/qwen3-vl)
- Gemma 3 4B and other VLMs run offline on Android through llama.cpp (tutorial) — [Medium: Run Gemma and VLMs on mobile with llama.cpp](https://farmaker47.medium.com/run-gemma-and-vlms-on-mobile-with-llama-cpp-dbb6e1b19a93)
- ExecuTorch Android demo: vision model listed is LLaVA-1.5 (XNNPACK only); Qwen3 0.6/1.7/4B are text-only; ExecuTorch has a MultiModal runner API for image/audio inputs — [ExecuTorch Llama Android demo](https://docs.pytorch.org/executorch/0.7/llm/llama-demo-android.html)
- MNN + Arm KleidiAI: documented Android path for Qwen2.5-VL-3B-Instruct-MNN — [Arm learning path](https://learn.arm.com/learning-paths/mobile-graphics-and-gaming/vision-llm-inference-on-android-with-kleidiai-and-mnn/)

### Inferences
- Proven for VLMs (fine-tuned): GGUF+mmproj via llama.cpp (Qwen-VL family, Gemma 3). Workable but fragile: LiteRT-LM for Gemma 4 vision (pin versions, check vision encoder bundled). Text-only proven: LiteRT-LM (Gemma 270M, Gemma 3 1B etc.), ExecuTorch (Llama/Qwen3). Not proven: Gemma 3n vision fine-tune → .litertlm; MLC VLM on Android (no evidence found).
- Safe workflow for llama.cpp: save merged 16-bit HF model, run `convert_hf_to_gguf.py` twice (text GGUF + `--mmproj`), quantize text to Q4_K_M, keep mmproj F16/Q8. If only LLM layers were LoRA-tuned, the base model's mmproj can be reused; if vision layers were tuned, regenerate mmproj.

### Gaps
- Whether Unsloth's `save_pretrained_gguf` auto-emits a matching mmproj for fine-tuned VLMs was not confirmed.
- No MLC LLM Android VLM evidence found. Current upstream status of the Gemma 4 `vision_exportable.py` stub not verified.

## 4. Data: datasets, synthetic generation, how many examples, spoken-math labels

### Takeaway
Large English/LaTeX math-OCR sets exist (UniMER-1M Apache-2.0, MathWriting CC BY 4.0, im2latex, CROHME), but no public Turkish math-page OCR dataset was found; closest are YKSBench (visual exam benchmark), OCRTurk (Turkish OCR benchmark incl. equations), and small synthetic Turkish OCR sets. Synthetic rendering of Turkish LaTeX questions + rule-based spoken-math labels is the most practical route.

### Cited Findings
- UniMER dataset (HF `wanderkid/UniMER_Dataset`): Apache-2.0 metadata; UniMER-1M train has 1,061,791 LaTeX–image pairs; HME100K portion must be downloaded manually for copyright reasons — [UniMER Dataset card](https://huggingface.co/datasets/wanderkid/UniMER_Dataset); paper [UniMERNet arXiv 2404.15254](https://arxiv.org/abs/2404.15254v2)
- MathWriting (Google): CC BY 4.0; 230k human-written + 400k synthetic handwritten samples — [MathWriting paper listing](https://fugumt.com/fugumt/paper_check/2404.10690v2_enmode)
- im2latex-100k and CROHME: no license found in this session (gap).
- YKSBench (`metu-yks/yksbench`): visual benchmark based on Turkish university entrance exam questions with visuals incl. math and geometry — [awesome-turkish-language-models](https://github.com/kesimeg/awesome-turkish-language-models)
- OCRTurk: Turkish OCR benchmark of real-world documents incl. figures, tables and equations (arXiv 2602.03693, Feb 2026) — [OCRTurk paper](https://arxiv.org/pdf/2602.03693)
- `emredeveloper/turkish-ocr`: synthetic, 1,000 images with Turkish text (70% handwritten, 30% printed) — [HF dataset](https://huggingface.co/datasets/emredeveloper/turkish-ocr); `sfidan42/turkish-ocr-noise-corpus-v2` (OCR noise corpus) — [HF dataset](https://huggingface.co/datasets/sfidan42/turkish-ocr-noise-corpus-v2)
- Turkish math text (no images), usable as source text for rendering: `ituperceptron/turkish-math-186k` (translated NuminaMath subset) — [HF](https://huggingface.co/datasets/ituperceptron/turkish-math-186k); `barandinho/turkish-math-rlvr` (AMC + MATH-500 translated) — [HF](https://huggingface.co/datasets/barandinho/turkish-math-rlvr); `alibayram/turkish_mmlu` — [HF](https://huggingface.co/datasets/alibayram/turkish_mmlu)
- Spoken-math in Turkish: no official Turkish reading-rule set or Turkish MathSpeak adaptation was found; related accessibility literature notes there is no universal math Braille code and practice varies by language/institution — [Hacettepe: visually impaired students, YKS math tests](https://avesis.hacettepe.edu.tr/yayin/0c5243f1-963e-4c82-bfd2-f307041058e3/determining-materials-and-communication-needs-of-students-with-visual-impairments-in-mathematics-tests-case-of-university-entrance-exam-in-turkiye); [ETS Turkish test reader guidelines](https://www.ets.org/content/ets-org/language-master/tr/home/disabilities/resources/test-reader-guidelines.html)

### Inferences
- Synthetic pipeline: take Turkish question text (translated sets above + hand-written templates mimicking LGS/YKS), render via LaTeX/KaTeX/HTML with several fonts and layouts (A4 page, two-column test booklet, answer options A–E), then augment (Gaussian/motion blur, JPEG compression, perspective warp, shadow/illumination gradients, rotation ±5°, random crops, paper texture, phone-camera noise). Ground truth is known exactly (LaTeX + spoken form), so labels are free and license-clean.
- Spoken-math labels should be generated rule-based from the LaTeX/AST (e.g., SymPy/latex2sympy or a custom parser): `x^2`→"x kare", `x^3`→"x küp", `x^n`→"x üzeri n", `\frac{3}{4}`→"dörtte üç" (Turkish reads denominator first: payda+"-de/-da/-te/-ta" + pay), `\sqrt{x}`→"karekök x", `\le`→"küçük eşit", `-`→"eksi", `\cdot`→"çarpı". Vowel harmony/consonant assimilation for the locative suffix (ikide, üçte, dörtte, beşte, altıda…) must be rule-encoded.
- Mix ~10–20% real photos of Turkish textbook/test pages (self-collected, hand-labelled) into the training set and keep a real-photo-only test set; synthetic-only training tends to overfit to rendering artifacts.
- Example count: commonly cited practice for LoRA format/OCR adaptation is low thousands of examples (1–5k) for format adaptation; broader OCR skill gains need far more. This is NOT sourced here — treat as heuristic and validate with a learning curve (e.g., 500 / 1k / 2k / 5k).

### Gaps
- No sourced guidance on minimum dataset size for VLM LoRA OCR adaptation.
- Licenses for im2latex-100k and CROHME not confirmed; YKSBench license and image format not verified; copyright of ÖSYM/MEB exam questions not researched (likely restrictive — check before using real exam scans for training/redistribution).

## 5. Licensing risk of API-generated labels vs rule-based labels

### Takeaway
Gemini API Additional Terms reportedly forbid using the Services to develop models that compete with Gemini API/AI Studio; free-tier prompts/responses may be used by Google and reviewed by humans. Rule-based/synthetic labels avoid both issues.

### Cited Findings
- Quoted Gemini API Additional Terms: "You may not use the Services to develop models that compete with Gemini API or Google AI Studio. You also may not attempt to extract or replicate the underlying models (e.g., parameter weights)." Another quote words it "compete with the Services (e.g., Gemini API or Google AI Studio)" — secondary quotations only — [Looker community thread](https://community.looker.com/gc/AI-ML/AI-Generated-Data-Ownership-Can-I-publish-data-generated-from/m-p/743664); primary: https://ai.google.dev/gemini-api/terms (not fetched)
- Paid services: Google does not use prompts/responses to improve products (logged for abuse detection only); unpaid use (AI Studio, free quota) is used to develop Google products and may be reviewed by human annotators — [Firebase AI Logic data governance (via search)](https://scriptagc.wasmer.app/https_firebase_google_com/docs/ai-logic/data-governance)

### Inferences
- A narrow on-device Turkish math-reader is arguably not a "competing model", but the clause is broad and undefined; for a published/commercial model, the conservative choice is rule-based labels (from rendered LaTeX) and human verification, using API outputs only for evaluation or not at all. Also avoid sending students' personal photos to the free tier (human review).
- Similar "no competing models" clauses exist in other commercial LLM APIs (not re-verified this session).

### Gaps
- Official current Gemini API terms text could not be fetched; verify exact wording and date.

## 6. Evaluation

### Takeaway
Use several complementary metrics: CER/WER on full-page Turkish text, normalized LaTeX edit distance and BLEU for formulas, CDM (image-based, CVPR 2025) for LaTeX robustness to equivalent forms, plus exact-match on numbers/operators and on spoken-math strings.

### Cited Findings
- CDM (Character Detection Matching, Wang et al., CVPR 2025): renders predicted and ground-truth LaTeX to images and matches characters with spatial position, addressing the fact that one formula has many valid LaTeX strings; F1-style score 2TP/(2TP+FP+FN); ExpRate@CDM = share of perfectly recognized formulas — [CVPR 2025 paper](https://openaccess.thecvf.com/content/CVPR2025/html/Wang_Image_Over_Text_Transforming_Formula_Recognition_Evaluation_with_Character_Detection_CVPR_2025_paper.html); [arXiv 2409.03643](https://arxiv.org/html/2409.03643v2)
- The CDM paper argues BLEU and edit distance rely only on text matching and correlate poorly with human judgment — [arXiv PDF](https://arxiv.org/pdf/2409.03643)
- CDM code lives in the UniMERNet repository — [CatalyzeX](https://catalyzex.com/author/Zhuangcheng%20Gu)

### Inferences
- Suggested eval suite: (1) CER on page text after Unicode/whitespace normalization (keep Turkish ı/İ/ş/ğ distinct — case folding must be Turkish-locale aware); (2) normalized edit distance + CDM on extracted formulas; (3) exact-match on the set of numbers and operators per question (catches "3/4 vs 4/3" errors that CER underweights); (4) exact-match/WER on spoken-math output; (5) on-device latency and peak RAM after quantization (Q4) — re-run the metrics on the quantized GGUF/.litertlm, since quantization can degrade OCR. Google's `ai-edge-eval` can compare HF vs converted LiteRT-LM output parity ([Google tutorial](https://developers.google.com/edge/litert-lm/tutorials/convert-and-run)).

### Gaps
- No sourced CER benchmarks for small VLMs on Turkish math pages; OCRTurk may provide Turkish baselines (not read).

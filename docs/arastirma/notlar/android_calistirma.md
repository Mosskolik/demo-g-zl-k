# Android on-device inference runtimes for small VLMs and the phone hardware they need (as of 2026-11-09)

> Research note, compiled 2026-11-09. **Source-access caveat:** this cloud session could not reach ai.google.dev, developers.google.com, developers.googleblog.com, huggingface.co or docs.pytorch.org (DNS blocked). For those domains the claims below come from search-engine snippets of the named pages, not full-page reads, so the report writer should treat them as "snippet-verified". Pages actually fetched in full: github.com/google-ai-edge/LiteRT-LM, github.com/google-ai-edge/gallery, github.com/alibaba/MNN (MnnLlmChat README). Items marked [SUPERSEDED] are older information replaced by newer releases.

## Q1. Which runtimes support which small VLMs, and does image input work on Android today?

### Takeaway
By November 2026 Google's own stack has moved on. LiteRT-LM (Kotlin API marked "Stable") replaces the MediaPipe LLM Inference API, which is now maintenance-only, and the flagship small multimodal models are **Gemma 4 E2B/E4B**, which supersede Gemma 3n. Image input works on Android today in LiteRT-LM/Gallery, MNN (Qwen3-VL, Gemma 4, SmolVLM, MiniCPM-V-4, FastVLM), Qualcomm Genie/GenieX (Qwen2.5-VL, Qwen3-VL, InternVL3.5 on Snapdragon NPUs), llama.cpp (mmproj/libmtmd), ExecuTorch (LLaVA and a text+vision runner), and ML Kit GenAI Prompt API (Gemini Nano, multimodal prompts).

### Cited Findings
**Google AI Edge: LiteRT-LM (current) and the MediaPipe LLM Inference API (legacy)**
- The LiteRT-LM GitHub README lists cross-platform support (Android, iOS, Web, Desktop, IoT) with GPU and NPU acceleration. It rates the **Kotlin API "✅ Stable" ("best for Android apps and JVM")**, Python and C++ Stable, Swift and JS "Early Preview", Flutter "Community". The feature list says "Support for vision and audio inputs" and "Broad Model Support: Gemma, Llama, Phi-4, Qwen, and more". The latest highlighted version is **v0.19.0** (C API 1.0.0 breaking change; GPU sampling now matches CPU for the same seed). Models named: Gemma 4 E4B (with MTP), Gemma 3n E2B, Gemma 4 12B. — [LiteRT-LM GitHub](https://github.com/google-ai-edge/LiteRT-LM) (fetched 2026-11-09)
- The README never mentions LoRA, and it does not say which models accept vision input. — [LiteRT-LM GitHub](https://github.com/google-ai-edge/LiteRT-LM)
- Model files use the `.litertlm` format (e.g. `gemma-4-E4B-it.litertlm`, HF repo `litert-community/gemma-4-E4B-it-litert-lm`). — [LiteRT-LM GitHub](https://github.com/google-ai-edge/LiteRT-LM)
- [SUPERSEDED] The MediaPipe LLM Inference guide now says the API is in **maintenance-only mode**, with new features going to LiteRT-LM, and Google recommends migrating. The older MediaPipe API did document LoRA support for LLMs. — [MediaPipe LLM Inference guide](https://developers.google.com/edge/mediapipe/solutions/genai/llm_inference) (snippet)
- A real-world migration example: the Capacitor plugin moved to the LiteRT-LM Android package **0.10.0** for `.litertlm` and kept MediaPipe only as a fallback for legacy `.task` files. This is a third-party PR. — [Cap-go/capacitor-llm PR #9](https://gh.r-mj.com/Cap-go/capacitor-llm/pull/9)
- The Gemma 4 model card on the LiteRT-LM site says the models handle images at **variable aspect ratio and resolution**, and that the vision and audio encoders are **loaded only when needed** to save memory. It also says Gemma 4 is available through **Android AICore as Gemini Nano** on supported devices, and calls that "the recommended path for production applications". — [ai.google.dev LiteRT-LM Gemma 4](https://ai.google.dev/edge/litert-lm/models/gemma-4) (snippet)
- [SUPERSEDED by Gemma 4] The Gemma 3n E2B card says images are normalized to 256×256, 512×512 or 768×768 and encoded into **256 tokens each**. — [google/gemma-3n-E2B-it-litert-lm README](https://huggingface.co/google/gemma-3n-E2B-it-litert-lm/blob/refs%2Fpr%2F2/README.md) (snippet)

**Google AI Edge Gallery (reference app)**
- An open-source app that runs models fully offline. Its **"Ask Image"** feature identifies objects, solves visual puzzles and describes images from the camera or gallery. It runs on LiteRT, links to LiteRT-LM, and lets users download models from a built-in list (Hugging Face integration) and "load your own custom models". It needs Android 12+ or iOS 17+, is labeled "experimental Beta", and is on Google Play (`com.google.ai.edge.gallery`), the App Store and GitHub as an APK. — [google-ai-edge/gallery](https://github.com/google-ai-edge/gallery) (fetched 2026-11-09)
- The Gallery now ships Gemma 4 E2B and has an in-app benchmark screen showing TTFT, prefill and decode speed, and peak memory on the user's device. — [codersera blog](https://codersera.com/blog/install-google-ai-edge-gallery-to-run-ai-models-on-your-phone) (secondary, snippet)

**Alibaba MNN / MNN-LLM (MnnLlmChat Android app)**
- Multimodal models listed: **Qwen3-VL (4B, 8B, 30B-A3B), Qwen Omni (3B, 7B), Qwen2-VL (2B, 7B), Qwen-VL-Chat, Gemma 4 multimodal (E2B/E4B; vision 26B-A4B/31B), SmolVLM (incl. video), FastVLM, MiniCPM-V-4, Lingshu-7B**, plus Qwen3.5 text. Supported inputs include images and multiple images per message (v0.7.6), video for smolvlm-video (v0.7.5), and real-time vision in voice chat (v0.8.2). v0.8.3 added Gemma 4 and LFM. Backends are CPU (Arm82 fp16) and OpenCL. **QNN NPU and LoRA are not mentioned.** It is tested only on the OnePlus 13 and Xiaomi 14 Ultra, with a warning that low-end devices may be slow, unstable or fail. — [MNN MnnLlmChat README](https://github.com/alibaba/MNN/blob/master/apps/Android/MnnLlmChat/README.md) (fetched 2026-11-09)
- Qwen2.5-VL is not listed by name in that README. An Arm Learning Path, however, runs **Qwen2.5-VL-3B-Instruct-MNN** on Android with MNN + KleidiAI. — [Arm Learning Path](https://learn.arm.com/learning-paths/mobile-graphics-and-gaming/vision-llm-inference-on-android-with-kleidiai-and-mnn/) (snippet)

**llama.cpp on Android**
- The Snapdragon build docs cover CPU, OpenCL and **Hexagon** backends via CMake presets, with Hexagon DSP libraries for v73, v75, v79 and v81. The Hexagon backend is labeled **"experimental"**. — [llama.cpp hexagon docs (Debian mirror)](https://sources.debian.org/src/llama.cpp/7593%2Bdfsg-3/docs/backend/hexagon/README.md); [llama.rn README](https://cdn.jsdelivr.net/npm/cui-llama.rn@1.12.2/README.md)
- Qualcomm says its Adreno OpenCL backend is optimized on Snapdragon 8 Gen 1/2/3 and Elite. — [Qualcomm developer blog, Nov 2024](https://www.qualcomm.com/developer/blog/2024/11/introducing-new-opn-cl-gpu-backend-llama-cpp-for-qualcomm-adreno-gpu)
- Vision works through an `mmproj` projector file next to the GGUF model (libmtmd / `llama-mtmd-cli`). One community test ran MobileVLM-1.7B on a Snapdragon 888 and found the newer mtmd build "much slower" than an older release. — [llama.rn README](https://cdn.jsdelivr.net/npm/cui-llama.rn@1.12.2/README.md); [llama.cpp discussion #14356](https://github.com/ggml-org/llama.cpp/discussions/14356)

**ExecuTorch (Meta/PyTorch)**
- The Android LLM runner exposes Java APIs callable from Kotlin, shipped in the `executorch-android` AAR, with `LlmModule` as the entry point. Models are declared MODEL_TYPE_TEXT or **MODEL_TYPE_TEXT_VISION** (MODEL_TYPE_MULTIMODAL is an alias), and images and audio go in through dedicated prefill methods. Kotlin examples were added by a PR merged in June 2026. The docs have a versioned page for 1.4. — [ExecuTorch run-on-android](https://docs.pytorch.org/executorch/main/llm/run-on-android.html) (snippet); [ExecuTorch PR #20147](https://github.com/pytorch/executorch/pull/20147)
- The Llama demo app lists **LLaVA-1.5 (XNNPACK only)** as its vision model. My searches did not confirm Gemma 3 or Qwen-VL Android recipes. — [ExecuTorch Llama Android demo](https://pytorch.org/executorch/stable/llm/llama-demo-android.html) (snippet)

**Qualcomm AI Hub / Genie / GenieX**
- AI Hub publishes NPU-optimized VLMs: **Qwen2.5-VL-7B, Qwen3-VL-2B/4B/8B, InternVL3.5-2B/4B**. The **GenieX Chat** Android sample app runs LLMs and VLMs on-device with the GenieX SDK and lists **Gemma-4-E2B-it** as compatible. — [qualcomm/Qwen3-VL-4B-Instruct](https://huggingface.co/qualcomm/Qwen3-VL-4B-Instruct); [AI Hub Qwen3-VL-2B](https://aihub.qualcomm.com/mobile/models/qwen3_vl_2b_instruct); [qualcomm/Intern3.5-VL-2B](https://huggingface.co/qualcomm/Intern3.5-VL-2B); [AI Hub GenieX Chat app](https://aihub.qualcomm.com/apps/geniex_chat_android) (snippets)
- An academic case study on deploying VLMs on a OnePlus 13R exists (arXiv 2507.08505). — [arXiv 2507.08505](https://arxiv.org/html/2507.08505v2) (not read in full)

**ONNX Runtime GenAI**
- It supports Phi-3 Vision, Phi-3.5 Vision and **Phi-4-multimodal**. The int4 Phi-4-multimodal ONNX card documents CUDA and DirectML only and says "CPU support is coming". I found **no official mobile/Android path for Phi-4-multimodal**. — [onnxruntime-genai docs (mintlify mirror)](https://www.mintlify.com/microsoft/onnxruntime-genai/multimodal/phi-vision); [microsoft/Phi-4-multimodal-instruct-onnx](https://www.huggingface.co/microsoft/Phi-4-multimodal-instruct-onnx/blob/main/README.md) (snippets)

**ML Kit GenAI Prompt API (Gemini Nano via AICore)**: covered in Q3. It accepts **image + text** prompts. — [Prompt API get-started](https://developers.google.com/ml-kit/genai/prompt/android/get-started) (snippet)

### Inferences
- **Support matrix** (✅ = sourced; ? = not confirmed in this session):
  - Gemma 4 E2B/E4B (vision): LiteRT-LM ✅, MNN ✅, Qualcomm GenieX ✅ (E2B), AICore as Gemini Nano ✅
  - Gemma 3n E2B/E4B: LiteRT-LM ✅ (now legacy)
  - Qwen3-VL 2B/4B: MNN ✅ (4B, 8B), Qualcomm ✅ (2B/4B/8B)
  - Qwen2.5-VL-3B: MNN ✅ (Arm learning path), llama.cpp ? (not re-verified)
  - SmolVLM / SmolVLM2: MNN ✅
  - MiniCPM-V-4: MNN ✅
  - InternVL3.5: Qualcomm ✅
  - LLaVA-1.5: ExecuTorch ✅
  - Phi-4-multimodal: ONNX GenAI on mobile ✗ (no mobile path found)
- For a Kotlin-first app, LiteRT-LM is the most "official" route for Gemma-family VLMs. MNN has the broadest open VLM catalog on Android.
- Background knowledge, not re-verified in this session: llama.cpp's `libmtmd` (since 2025) supports Gemma 3, Qwen2.5-VL, SmolVLM and others via GGUF + mmproj.

### Gaps
- **MLC LLM:** I found no 2026 sources on Android VLM support. Its status is unknown.
- **MediaTek NeuroPilot / GenAI toolkit:** I found no sources, so VLM support on Dimensity NPUs could not be confirmed.
- Whether the LiteRT-LM Kotlin API exposes image input directly. The README says "vision inputs" in general, and the Gallery app proves it works on Android, but I could not read the Kotlin API docs on ai.google.dev.
- Whether LiteRT-LM supports runtime LoRA. The README is silent and the docs were unreachable.
- ExecuTorch support for Gemma 3 / Qwen-VL / SmolVLM on Android, and the Qualcomm QNN and MediaTek backends for vision models.

## Q2. Measured performance on real phones and minimum RAM

### Takeaway
On 2026 flagships, LiteRT-LM GPU runs Gemma 4 E2B at about 3,800 tok/s prefill and about 52 tok/s decode, with TTFT around 0.3 s. Qualcomm NPU builds of Qwen3-VL-4B decode at about 27–29 tok/s on Snapdragon 8 Elite / 8 Elite Gen 5. Older community numbers for Gemma 3n on Pixel 9 were far lower (≈5–6 tok/s decode, 7.5 s TTFT). Decode speed is bounded by memory bandwidth, so GPU and NPU mainly speed up prefill and image encoding. I found no authoritative per-model minimum-RAM table.

### Cited Findings
- **LiteRT-LM official overview, Samsung S26 Ultra, Gemma 4 E2B:** CPU **557 prefill / 47 decode tok/s**; GPU **3,808 prefill / 52 decode tok/s**; GPU **TTFT 0.3 s**. Gemma 4 E4B on the same phone is listed with 195 and 18 figures. The search summary read these as CPU decode and GPU decode, but the column order is ambiguous, so confirm before using them. — [LiteRT-LM overview](https://developers.google.com/edge/litert-lm/overview) (snippet; mirrors: [developers.google.cn](https://developers.google.cn/edge/litert-lm/overview))
- **Vision latency in the same overview:** a "Text + Vision Latency (ms)" column shows **119 ms on the S26 Ultra GPU** and **49 ms on a "Pixel 11 Pro" TPU**. The model and image size are not clearly defined, so treat these as indicative only. — [LiteRT-LM overview](https://developers.google.com/edge/litert-lm/overview) (snippet)
- The LiteRT-LM blog reports that Gemma 4 E2B **without MTP** decodes at **52 tok/s on the Android GPU backend (OpenCL)** and 56 tok/s on iOS (Metal). MTP (multi-token prediction) is an extra speed-up on top of that. — [Google Developers Blog: "Blazing fast on-device GenAI with LiteRT-LM"](https://developers.googleblog.com/blazing-fast-on-device-genai-with-litert-lm/) (snippet)
- [SUPERSEDED, 2025-era] Community report for **Gemma 3n E2B on a Pixel 9 Pro XL** (Gallery app): first token **7.48 s**, prefill **35.02 tok/s**, decode **5.72 tok/s**. Another user reports about 5–6 tok/s for Gemma-3n-E2B-it-int4. Both are unverified HN comments. — [Hacker News thread 44044199](https://news.ycombinator.com/item?id=44044199)
- [SUPERSEDED] Gemma 3n E2B on a MacBook Pro M3 CPU: 232.5 prefill / 27.6 decode tok/s. This is not a phone baseline. — [gemma-3n-E2B-it-litert-lm card](https://huggingface.co/google/gemma-3n-E2B-it-litert-lm/blob/refs%2Fpr%2F2/README.md) (snippet)
- **Qualcomm AI Hub (vendor-measured, decode tok/s, w4a16 NPU):**
  - **Qwen3-VL-4B** on GENIEX_QAIRT: **29.2 tok/s on 8 Elite Gen 5**, **27.2 on 8 Elite** (4096 ctx). The llama.cpp-based GENIEX_LLAMACPP path gets about 5–22 tok/s depending on context.
  - **Qwen3-VL-8B:** 16.7 (8 Elite Gen 5) and 14.7 (8 Elite).
  - **Qwen2.5-VL-7B** on Genie: 16.6 (8 Elite Gen 5) and about 14.7 (8 Elite) at 2048 ctx.
  - Sources: [qualcomm/Qwen3-VL-4B-Instruct](https://huggingface.co/qualcomm/Qwen3-VL-4B-Instruct); [qualcomm/Qwen3-VL-8B-Instruct](https://huggingface.co/qualcomm/Qwen3-VL-8B-Instruct); [qualcomm/Qwen2.5-VL-7B-Instruct](https://huggingface.co/qualcomm/Qwen2.5-VL-7B-Instruct) (snippets)
- Qualcomm claims "50% higher pre-fill performance" for INT4 models on the upcoming Snapdragon 8 Elite Gen 6 NPU. This is vendor marketing. — [Android Authority](https://androidauthority.com/snapdragon-qualcomm-snapdragon-8-elite-gen-6-npu-3709726) (snippet)
- **Mid-range (Snapdragon 7s Gen 3), MNN, Qwen2.5-1.5B text:** CPU 113 prefill / 12.5 decode tok/s; OpenCL 231 prefill / 12.5 decode tok/s. The poster notes decode is memory-bandwidth bound, so the GPU helps mainly prefill. This is a community Reddit report on a text-only model. — [Reddit snapshot via search](https://reddit.sentinel-team.org/posts/1s3629q/snapshots/2026-03-27T22%3A19%3A49.793866Z) (snippet)
- MNN's own claims (Qwen-7B, Android CPU): prefill 8.6× and 20.5× faster, decode 2.3× and 8.9× faster than llama.cpp and fastllm. GPU: up to 25.3× faster prefill and 7.1× faster decode vs llama.cpp, and 2.8× / 1.7× vs MLC-LLM. — [MNN MnnLlmChat README](https://github.com/alibaba/MNN/blob/master/apps/Android/MnnLlmChat/README.md)
- MediaPipe guidance: prefill and decode speed depend on the model, hardware and max tokens, and vary with device load. — [Google Developers Blog (MediaPipe LLM, 2024)](https://developers.googleblog.com/large-language-models-on-device-with-mediapipe-and-tensorflow-lite/) (snippet)

### Inferences
- Rough RAM guidance (my inference from parameter counts; no sourced table found):
  - A 4-bit 2–4B VLM needs about 1.5–3 GB of weights plus the vision encoder and KV cache.
  - **8 GB RAM is a realistic floor** for E2B / Qwen3-VL-2B-class models. **12 GB+** is safer for E4B, 4B and 7–8B models.
  - Gemma's per-layer-embedding design and on-demand loading of the vision encoder lower peak RAM.
- The jump from about 5.7 tok/s (Gemma 3n, Pixel 9 Pro XL, 2025) to about 52 tok/s (Gemma 4 E2B GPU, S26 Ultra, 2026) reflects both newer hardware and LiteRT-LM GPU/MTP work. The two numbers are not like-for-like.
- With 256 image tokens per image (Gemma 3n) and GPU prefill in the thousands of tok/s, image prefill becomes sub-second on flagships. On CPU-only mid-range phones (≈100–500 tok/s prefill), each image plausibly adds 0.5–3 s.

### Gaps
- No sourced figures for the Pixel 8/9/10 or Samsung S23/S24/S25 with 2026 runtimes, and no vision-encoder timings broken out per device.
- No official minimum-RAM statement per runtime or model. LiteRT-LM peak-memory columns were not readable.
- No MLC LLM, ExecuTorch or MediaTek VLM numbers.

## Q3. Gemini Nano multimodal via AICore / ML Kit GenAI: devices, cost, fine-tuning, limits

### Takeaway
The ML Kit GenAI **Prompt API** (alpha October 2025; docs show `com.google.mlkit:genai-prompt:1.0.0-beta2`) accepts image + text and runs Gemini Nano on-device through AICore. It performs best on the **Pixel 10 (nano-v3)**, and other flagships (Pixel 9, Galaxy Z Fold7, Xiaomi 15, vivo X200/X300) run the older nano-v2. Apps **cannot ship their own model**, and I found no current official per-app LoRA path. It is not a vehicle for a custom fine-tuned VLM.

### Cited Findings
- The Prompt API supports image input with a related text prompt. — [Prompt API get-started](https://developers.google.com/ml-kit/genai/prompt/android/get-started) (snippet); [Android Developers blog post](https://developer.android.com/blog/posts/ml-kit-s-prompt-api-unlock-custom-on-device-gemini-nano-experiences)
- Alpha release announced **October 2025**. The current docs' dependency is `com.google.mlkit:genai-prompt:1.0.0-beta2`. The API runs **only when the app is the top foreground app**. — [Android Developers Blog, Oct 2025](https://android-developers.googleblog.com/2025/10/ml-kit-genai-prompt-api-alpha-release.html); [Prompt API get-started](https://developers.google.cn/ml-kit/genai/prompt/android/get-started?hl=en) (snippets)
- It "performs best on the **Pixel 10** series, which runs the latest Gemini Nano (**nano-v3**)". Other devices, including the Pixel 9 series, **Galaxy Z Fold7, Xiaomi 15** "and others", use the less capable **nano-v2**. — [InfoQ, Nov 2025](https://www.infoq.com/news/2025/11/android-genai-prompt-api); [Android Developers blog](https://developer.android.com/blog/posts/ml-kit-s-prompt-api-unlock-custom-on-device-gemini-nano-experiences)
- The device list in the GenAI overview includes vivo X200T, X200, X200 Pro, X300 and X300 Pro under nano-v2. The full list was truncated in the snippet. — [ML Kit GenAI overview](https://developers.google.com/ml-kit/genai) (snippet)
- The Gemma 4 model card says that on supported Android devices Gemma 4 is available through AICore as Gemini Nano, the "recommended path for production". — [ai.google.dev Gemma 4](https://ai.google.dev/edge/litert-lm/models/gemma-4) (snippet)
- **LoRA (conflicting evidence):**
  - Google's 2023 announcement said AICore "enables LoRA fine tuning with Gemini Nano… app developers create small LoRA adapters based on their own training data". — [Android Developers Blog, Dec 2023](https://android-developers.googleblog.com/2023/12/a-new-foundation-for-ai-on-android.html)
  - A newer write-up says AICore's shared architecture makes per-app LoRA adapters impractical, so the recommended path is automated prompt optimization. — [engineered.at article on Prompt API prompt optimization](https://engineered.at/articles/how-automated-prompt-optimization-unlocks-quality-gains-for-ml-kit-s-genai-prompt-api) (date unconfirmed)
  - I found **no 2026 official docs exposing third-party LoRA in the Prompt API**.
  - A third-party blog says AICore does not load third-party models. — [xckevin blog](https://xckevin.github.io/en/blog/android-aicore-gemini-nano/) (low reliability)

### Inferences
- Cost: I found no fee or pricing in any source. It runs on-device through a system service and appears free to call, but that is unconfirmed.
- For a project that needs a **custom LoRA fine-tuned VLM**, AICore/Prompt API is **not suitable**: you cannot load your own weights, device coverage is limited to recent flagships, and it only runs in the foreground. It is useful as a zero-download fallback for generic image description on supported phones.

### Gaps
- The complete current device list (e.g. Samsung S25/S26, Pixel 8 status). The page was unreachable.
- Quota and rate limits, battery-related throttling, and whether image input works on nano-v2 devices or only nano-v3.
- Official pricing and terms statement.

## Q4. Battery, thermal, model size, and how apps ship large models

### Takeaway
The official Google Play route is **Play for On-device AI (beta) "AI packs"**: up to **1.5 GB per pack (compressed)** and **4 GB total per app version**. Larger models are split across packs or downloaded on first run from your own CDN or Hugging Face, which is the Gallery app's approach. I found no rigorous battery or thermal measurements for VLMs on phones.

### Cited Findings
- AI packs: an individual pack can be up to **1.5 GB compressed**, and the cumulative app size of any version is capped at **4 GB**. Apps over 1 GB must set min SDK ≥ 21. The product is in beta. — [Play for On-device AI (beta)](https://developer.android.com/google/play/on-device-ai) (snippet)
- A developer reports Play validation errors when a Gemma E2B/E4B pack exceeded 1,500 MB, and when the total exceeded 4,000 MB, so models must be split. — [ringringdeven blog, May 2026](https://ringringdeven.blogspot.com/2026/05/delivering-large-llms-via-google-play.html); case study: [Shipping a 584 MB Gemma model through Google Play (ProAndroidDev)](https://proandroiddev.com/shipping-a-584-mb-gemma-model-through-google-play-b4df1825c6b8)
- The AI-pack SDK version varies across sources: 0.1.1-alpha01 in the official docs and 0.2.0-beta01 in a Medium post. Verify in the Play Console. — [search summary of Play docs](https://developer.android.com/google/play/on-device-ai)
- The AI Edge Gallery downloads models from an in-app list or Hugging Face at runtime instead of bundling them. — [google-ai-edge/gallery](https://github.com/google-ai-edge/gallery)
- MNN warns that budget devices may run slowly, be unstable or fail. — [MNN MnnLlmChat README](https://github.com/alibaba/MNN/blob/master/apps/Android/MnnLlmChat/README.md)

### Inferences
- A 4-bit E2B-class `.litertlm` is likely about 1.5–3 GB. That is close to or above a single AI pack, so plan for either multiple packs or a first-run download with resume, checksum and Wi-Fi-only options.
- Sustained decode on phone GPUs and NPUs will throttle thermally on long sessions. Short image-QA turns (one image, ~100–200 output tokens) are the friendliest workload. This is not quantified by any source I found.

### Gaps
- No measured battery drain (mAh or % per query) or thermal-throttling curves for any VLM on Android in the sources I could reach.
- Official `.litertlm` file sizes for Gemma 4 E2B/E4B, since the Hugging Face pages were blocked.

## Q5. Easiest runtime for a beginner Kotlin developer with a custom LoRA fine-tuned VLM

### Takeaway
For a beginner, the lowest-friction path is **LiteRT-LM (Kotlin API, Stable) with a Gemma 4 E2B or Gemma 3n model**: fine-tune with LoRA off-device, **merge the LoRA into the base weights**, convert to `.litertlm`, and copy the Gallery app's integration pattern. The alternative for Qwen/SmolVLM fine-tunes is **llama.cpp (GGUF + mmproj)** through a Kotlin/JNI wrapper, or MNN. Runtime-swappable LoRA on Android is poorly documented for VLMs in every runtime checked.

### Cited Findings
- LiteRT-LM Kotlin API is "✅ Stable, best for Android apps and JVM". The C++ and Python APIs are also stable. — [LiteRT-LM GitHub](https://github.com/google-ai-edge/LiteRT-LM)
- The Gallery is open source, supports Ask Image and loading custom models, and is a working reference app. — [google-ai-edge/gallery](https://github.com/google-ai-edge/gallery)
- The legacy MediaPipe LLM Inference API documented LoRA, but it is now maintenance-only. — [MediaPipe LLM Inference guide](https://developers.google.com/edge/mediapipe/solutions/genai/llm_inference) (snippet)
- ExecuTorch has a Kotlin-callable `LlmModule` with a TEXT_VISION mode and image-prefill methods, and copy-paste Kotlin snippets since a June 2026 PR. Its vision demo is still LLaVA-1.5 on XNNPACK. — [ExecuTorch PR #20147](https://github.com/pytorch/executorch/pull/20147); [ExecuTorch run-on-android](https://docs.pytorch.org/executorch/main/llm/run-on-android.html) (snippet)
- MNN has a full open-source Android chat app with VLMs, but no LoRA mention and only two tested devices. — [MNN MnnLlmChat README](https://github.com/alibaba/MNN/blob/master/apps/Android/MnnLlmChat/README.md)
- llama.cpp vision needs a separate mmproj file, and its NPU (Hexagon) backend is experimental. — [llama.rn README](https://cdn.jsdelivr.net/npm/cui-llama.rn@1.12.2/README.md)

### Inferences
Beginner ranking for a Kotlin app with a custom fine-tuned small VLM (Kasım 2026):
1. **LiteRT-LM + Gemma 4 E2B or Gemma 3n.** Official Kotlin API, Google reference app, GPU/NPU acceleration and AI-pack delivery. Main risk: the conversion tooling for a *fine-tuned multimodal* Gemma to `.litertlm` must be confirmed in the docs I could not reach.
2. **llama.cpp (GGUF) via a JNI wrapper.** The widest model choice (Qwen2.5-VL, SmolVLM, Gemma), and merging a LoRA and converting to GGUF is a well-trodden path. Costs: you handle the native build yourself, and GPU/NPU support on Android is less mature.
3. **MNN.** The best open VLM catalog and speed claims, but documentation is China-centric and LoRA is undocumented.
4. **ExecuTorch.** Its Kotlin API is good, but the VLM model coverage confirmed here is narrow (LLaVA).
5. **Qualcomm Genie/GenieX.** The fastest NPU numbers, but tied to Snapdragon and requires AI Hub compilation.
6. **AICore/Prompt API.** Easiest of all, but it cannot load custom weights.

Merging the LoRA into the base model before conversion is the safest choice for every runtime. It avoids depending on runtime LoRA support, which is undocumented for VLMs.

### Gaps
- An official LiteRT-LM guide for converting a fine-tuned (LoRA-merged) Gemma 3n/4 *with its vision tower* to `.litertlm`. The ai.google.dev docs were unreachable.
- Whether any runtime supports hot-swappable LoRA adapters for VLMs on Android in 2026.
- Integration-effort comparisons from independent developers (time-to-first-demo), for which I found no sources.

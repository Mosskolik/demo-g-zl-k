// =============================================================
// AYARLAR (config)
// Model adını veya yapay zekâ sağlayıcısını buradan değiştirebilirsin.
// Vercel'de kodu değiştirmeden de değiştirebilirsin: aynı isimde bir
// ortam değişkeni (Environment Variable) eklemen yeterli.
// =============================================================

// "a, b ,c" → ['a','b','c'] (boşsa varsayılan)
function list(value, fallback) {
  return String(value || fallback).split(',').map((s) => s.trim()).filter(Boolean);
}

export const config = {
  // Hangi yapay zekâ sağlayıcısı kullanılsın?
  //   "gemini" → Google Gemini + anahtarı eklenmiş diğer ücretsiz sağlayıcılar (zincir)
  //   "ollama" → bilgisayarda çalışan yerel model (ileride)
  //   "mock"   → sahte cevaplar (anahtarsız deneme/test için)
  provider: process.env.AI_PROVIDER || 'gemini',

  gemini: {
    // Görüntü okuyabilen ücretsiz Flash modeli.
    // 7 Kasım 2026 ölçümü: gemini-3.5-flash ~1 sn, gemini-3.1-flash-lite ~0,7 sn.
    // (gemini-flash-latest 45 sn'de cevap vermedi; gemini-2.5-* kaldırıldı.)
    model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
    // Ana model bulunamazsa, çok yavaşsa veya ücretsiz kotası yoksa sırayla bunlar denenir.
    fallbackModels: (process.env.GEMINI_FALLBACK_MODELS || 'gemini-3.1-flash-lite,gemini-3.5-flash-lite')
      .split(',').map((s) => s.trim()).filter(Boolean),
    apiKey: process.env.GEMINI_API_KEY || '',
    // "Düşünme" bütçesi. 0 = düşünmeden hemen cevap ver (çok daha hızlı).
    // Model bu ayarı desteklemezse otomatik olarak ayarsız tekrar denenir.
    thinkingBudget: Number(process.env.GEMINI_THINKING_BUDGET ?? 0),
    // Cevap kontrolü ve çözümde düşünme bütçesi (doğruluk için; biraz yavaşlatır)
    thinkingBudgetHard: Number(process.env.GEMINI_THINKING_BUDGET_HARD ?? 1024),
    // Sayfa okumada kısa düşünme (kesik kenarları dikkatle kontrol etsin; az yavaşlatır)
    thinkingBudgetLight: Number(process.env.GEMINI_THINKING_BUDGET_LIGHT ?? 512),
    // Tek bir modelin cevap vermesi için beklenecek en uzun süre (milisaniye).
    // Süre dolarsa sıradaki (daha hızlı) yedek modele geçilir.
    timeoutMs: Number(process.env.GEMINI_TIMEOUT_MS || 30000),
    // Tüm denemeler için toplam süre sınırı (vercel.json'daki maxDuration'dan kısa olmalı).
    totalTimeoutMs: 110000,
    // Ana model bu kadar sürede cevap vermezse yedek model de aynı anda başlatılır (ilk gelen kazanır)
    hedgeMs: Number(process.env.GEMINI_HEDGE_MS || 8000),
  },

  // ---------------------------------------------------------------
  // EK ÜCRETSİZ SAĞLAYICILAR (hepsi OpenAI uyumlu). Bir sağlayıcı, ANAHTARI EKLENİNCE
  // kendiliğinden devreye girer; anahtar yoksa yok sayılır. Model adları ortam değişkeniyle
  // değiştirilebilir (virgülle birden fazla). Güncel adlar için: /api/models?saglayici=groq
  // ---------------------------------------------------------------
  extra: {
    groq: {
      baseUrl: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY || '',
      models: list(process.env.GROQ_MODELS, 'qwen/qwen3.8-27b'), // 11 Kasım 2026: Groq listesindeki tek görüntü okuyan model
    },
    mistral: {
      baseUrl: 'https://api.mistral.ai/v1',
      apiKey: process.env.MISTRAL_API_KEY || '',
      models: list(process.env.MISTRAL_MODELS, 'mistral-small-latest'),
    },
    nvidia: {
      baseUrl: 'https://integrate.api.nvidia.com/v1',
      apiKey: process.env.NVIDIA_API_KEY || '',
      models: list(process.env.NVIDIA_MODELS, 'google/gemma-4-31b-it'),
    },
    cloudflare: {
      baseUrl: process.env.CLOUDFLARE_ACCOUNT_ID
        ? `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/v1` : '',
      apiKey: process.env.CLOUDFLARE_API_TOKEN || '',
      models: list(process.env.CLOUDFLARE_MODELS, '@cf/google/gemma-4-26b-a4b-it'),
    },
    openrouter: {
      baseUrl: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY || '',
      models: list(process.env.OPENROUTER_MODELS, 'google/gemma-4-31b-it:free'),
    },
  },

  // Denenme sırası (anahtarı olmayanlar atlanır). Girdi bir sağlayıcı ("groq") ya da tek model
  // ("gemini:gemini-3.5-flash") olabilir. 11 Kasım 2026 yarışına göre:
  //   gemini-3.5-flash  okuma 17/17, ~4,5 sn, ama günde 20 istek
  //   groq qwen3.8-27b  okuma 16/17, kontrol 8/8, ~1-3 sn, dakikada 8.000 token (≈ dakikada 1 sayfa)
  //   gemini lite'lar   okuma 14/17, yoğun saatlerde yavaş
  chain: list(process.env.AI_CHAIN, 'gemini:gemini-3.5-flash,groq,gemini,mistral,nvidia,cloudflare,openrouter'),

  ollama: {
    url: process.env.OLLAMA_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'qwen2.5vl',
  },

  // Sunucuya gönderilecek konuşma geçmişinin en fazla kaç mesaj olacağı
  // (çok uzun geçmiş = daha yavaş ve kotayı daha çabuk bitirir).
  maxHistory: 16,
};

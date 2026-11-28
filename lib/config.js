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
    // Her Gemini modelinin günlük ücretsiz hakkı AYRIDIR → yedek modeller toplam hakkı artırır.
    // 21 Kasım 2026 yarışı: 3.1-flash-lite 100 puan (4 sn), 3.5-flash-lite 96, 3.6-flash 83 (günlük hakkı az).
    // (gemini-3-flash-preview fotoğraf okurken zaman aşımına düştü → listede yok)
    fallbackModels: (process.env.GEMINI_FALLBACK_MODELS || 'gemini-3.1-flash-lite,gemini-3.5-flash-lite,gemini-3.6-flash')
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
      // Hesap kimliği gizli değildir (anahtar değil); varsayılan olarak projenin Cloudflare hesabı
      baseUrl: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID || '3528de5bdafcd59e78c6d285179ed453'}/ai/v1`,
      apiKey: process.env.CLOUDFLARE_API_TOKEN || '',
      // 21 Kasım 2026 yarışı: mistral-small-3.1 okuma 14/17, kontrol 4/4, ~14 sn.
      // (gemma-4-26b ve llama-4-scout fotoğraf okurken zaman aşımına düştü → listede yok)
      models: list(process.env.CLOUDFLARE_MODELS, '@cf/mistralai/mistral-small-3.1-24b-instruct'),
    },
    openrouter: {
      baseUrl: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY || '',
      // Ücretsiz (:free) ve görüntü okuyan model; hesapta kredi yoksa günde ~50 istek.
      // 21 Kasım 2026 yarışı: nemotron-3.5-super-vl okuma 16/17, kontrol 4/4, ~6 sn.
      // (Ücretsiz gemma-4 modelleri sürekli sağlayıcı sınırına takıldı → listede yok)
      models: list(process.env.OPENROUTER_MODELS, 'nvidia/nemotron-3.5-super-vl:free'),
      // Düşünen modeller bütün token hakkını düşünmeye harcayıp boş cevap döndürüyordu → düşünmeyi kapat
      extraBody: { reasoning: { enabled: false } },
    },
  },

  // Denenme sırası (anahtarı olmayanlar atlanır). Girdi bir sağlayıcı ("groq") ya da tek model
  // ("gemini:gemini-3.5-flash") olabilir. 21 Kasım 2026 yarışına göre (4 gerçek sayfa, 17 okuma + 4 kontrol):
  //   gemini-3.5-flash       100 puan, ~7,5 sn — en güvenilir okuma, ama günde 20 istek
  //   gemini-3.1-flash-lite  100 puan, ~4 sn
  //   gemini-3.5-flash-lite   96 puan, ~3 sn
  //   groq qwen3.8-27b        96 puan, ~3 sn, dakikada 8.000 token (sık bekletiyor)
  //   openrouter nemotron-vl  96 puan, ~6 sn, günde ~50 istek
  //   gemini-3.6-flash        83 puan (günlük hakkı çok az)
  //   cloudflare mistral-3.1  82 puan, ~9 sn
  // Basit işlerde (soru açıklama, sohbet) gemini-3.5-flash kendiliğinden sona alınır (chain.js).
  chain: list(process.env.AI_CHAIN, 'gemini:gemini-3.5-flash,gemini:gemini-3.1-flash-lite,gemini:gemini-3.5-flash-lite,groq,openrouter,mistral,nvidia,gemini:gemini-3.6-flash,cloudflare'),

  ollama: {
    url: process.env.OLLAMA_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'qwen2.5vl',
  },

  // Sunucuya gönderilecek konuşma geçmişinin en fazla kaç mesaj olacağı
  // (çok uzun geçmiş = daha yavaş ve kotayı daha çabuk bitirir).
  maxHistory: 16,
};

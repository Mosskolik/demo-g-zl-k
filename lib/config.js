// =============================================================
// AYARLAR (config)
// Model adını veya yapay zekâ sağlayıcısını buradan değiştirebilirsin.
// Vercel'de kodu değiştirmeden de değiştirebilirsin: aynı isimde bir
// ortam değişkeni (Environment Variable) eklemen yeterli.
// =============================================================

export const config = {
  // Hangi yapay zekâ sağlayıcısı kullanılsın?
  //   "gemini" → Google Gemini (bulutta, ücretsiz katman)
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
    thinkingBudgetHard: Number(process.env.GEMINI_THINKING_BUDGET_HARD ?? 2048),
    // Sayfa okumada kısa düşünme (kesik kenarları dikkatle kontrol etsin; az yavaşlatır)
    thinkingBudgetLight: Number(process.env.GEMINI_THINKING_BUDGET_LIGHT ?? 512),
    // Tek bir modelin cevap vermesi için beklenecek en uzun süre (milisaniye).
    // Süre dolarsa sıradaki (daha hızlı) yedek modele geçilir.
    timeoutMs: Number(process.env.GEMINI_TIMEOUT_MS || 30000),
    // Tüm denemeler için toplam süre sınırı (vercel.json'daki maxDuration'dan kısa olmalı).
    totalTimeoutMs: 110000,
  },

  ollama: {
    url: process.env.OLLAMA_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'qwen2.5vl',
  },

  // Sunucuya gönderilecek konuşma geçmişinin en fazla kaç mesaj olacağı
  // (çok uzun geçmiş = daha yavaş ve kotayı daha çabuk bitirir).
  maxHistory: 16,
};

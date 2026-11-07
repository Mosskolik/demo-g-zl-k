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
    // "gemini-flash-latest" Google'ın en güncel Flash modeline giden kısayoldur.
    model: process.env.GEMINI_MODEL || 'gemini-flash-latest',
    // Ana model bulunamazsa veya ücretsiz kotası yoksa sırayla bunlar denenir.
    fallbackModels: (process.env.GEMINI_FALLBACK_MODELS || 'gemini-2.5-flash,gemini-2.5-flash-lite')
      .split(',').map((s) => s.trim()).filter(Boolean),
    apiKey: process.env.GEMINI_API_KEY || '',
  },

  ollama: {
    url: process.env.OLLAMA_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'qwen2.5vl',
  },

  // Sunucuya gönderilecek konuşma geçmişinin en fazla kaç mesaj olacağı
  // (çok uzun geçmiş = daha yavaş ve kotayı daha çabuk bitirir).
  maxHistory: 16,
};

// =============================================================
// AIProvider — tüm yapay zekâ sağlayıcılarının uyması gereken "arayüz".
//
// Yeni bir sağlayıcı (ör. Ollama, başka bir bulut modeli) eklemek için
// bu sınıftan türet ve generate() fonksiyonunu yaz. Uygulamanın geri
// kalanı hangi sağlayıcının kullanıldığını bilmez.
// =============================================================

export class AIProvider {
  /** Sağlayıcının kısa adı (ör. "gemini") */
  get name() { return 'base'; }

  /**
   * Modele bir istek gönderir.
   * @param {object} req
   * @param {string} req.system      Sistem talimatı (öğretmen kuralları)
   * @param {{role:'user'|'model', text:string}[]} req.messages  Konuşma geçmişi + son mesaj
   * @param {{mimeType:string, data:string}} [req.image]  Base64 görüntü (son mesaja eklenir)
   * @param {object} [req.jsonSchema] Cevap JSON olmalıysa şeması
   * @returns {Promise<{text:string, model:string}>}
   */
  // eslint-disable-next-line no-unused-vars
  async generate(req) {
    throw new Error('generate() yazılmamış');
  }
}

/**
 * Sağlayıcı hatası. Tarayıcıya anlaşılır bir mesaj göndermek için kullanılır.
 * code: 'RATE_LIMIT' | 'DAILY_LIMIT' | 'BAD_KEY' | 'NO_KEY' | 'OVERLOADED' | 'BLOCKED' | 'UNKNOWN'
 */
export class ProviderError extends Error {
  constructor(code, message, { status = 500, retryAfter = 0 } = {}) {
    super(message);
    this.code = code;
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

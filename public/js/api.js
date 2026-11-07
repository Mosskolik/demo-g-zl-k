// =============================================================
// Sunucuya (/api/chat) istek atar.
// İstek sınırı (429) veya yoğunluk olursa öğrenciye haber verip
// otomatik olarak bekleyip yeniden dener.
// =============================================================

const MAX_RETRIES = 3;
const TIMEOUT_MS = 70_000;

export class ApiError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}

/**
 * @param {object} payload  {mode, image?, pageText?, history?, message?}
 * @param {{onWait?:(seconds:number, attempt:number)=>void}} hooks
 */
export async function askAI(payload, { onWait } = {}) {
  for (let attempt = 1; ; attempt++) {
    if (!navigator.onLine) throw new ApiError('OFFLINE', 'İnternet yok');

    let res, data;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      data = await res.json().catch(() => ({}));
    } catch (err) {
      throw new ApiError(err.name === 'AbortError' ? 'TIMEOUT' : 'OFFLINE', err.message);
    } finally {
      clearTimeout(timer);
    }

    if (res.ok) return data;

    // Dakikalık sınır veya yoğunluk → bekle ve yeniden dene
    const code = data.code || 'UNKNOWN';
    if ((code === 'RATE_LIMIT' || code === 'OVERLOADED') && attempt <= MAX_RETRIES) {
      const wait = Math.min(60, Math.max(5, Number(data.retryAfter) || 15));
      onWait?.(wait, attempt, code);
      await new Promise((r) => setTimeout(r, wait * 1000));
      continue;
    }
    throw new ApiError(code, data.error || `HTTP ${res.status}`);
  }
}

/** Hata kodlarını öğrenciye söylenecek anlaşılır cümlelere çevirir */
export function errorMessage(err) {
  switch (err?.code) {
    case 'OFFLINE': return 'İnternet bağlantısı yok gibi görünüyor. Bağlantını kontrol edip tekrar dene.';
    case 'TIMEOUT': return 'Cevap çok uzun sürdü. Lütfen tekrar dene.';
    case 'RATE_LIMIT': return 'Şu an çok fazla istek oldu. Bir dakika bekleyip tekrar dener misin?';
    case 'DAILY_LIMIT': return 'Bugünkü ücretsiz kullanım hakkı doldu. Yarın tekrar kullanabilirsin.';
    case 'OVERLOADED': return 'Yapay zekâ şu an çok yoğun. Biraz sonra tekrar dene.';
    case 'NO_KEY': return 'Uygulamanın yapay zekâ anahtarı eklenmemiş. Öğretmenine haber ver.';
    case 'BAD_KEY': return 'Uygulamanın yapay zekâ anahtarı geçersiz. Öğretmenine haber ver.';
    case 'BLOCKED': return 'Bu içeriğe cevap veremedim. Başka bir sayfa dene.';
    case 'TOO_LARGE': return 'Görüntü çok büyük. Başka bir fotoğraf dene.';
    default: return 'Bir sorun oldu. Lütfen tekrar dene.';
  }
}

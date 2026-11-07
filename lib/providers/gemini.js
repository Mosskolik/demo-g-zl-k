// =============================================================
// Google Gemini sağlayıcısı (REST API, ek paket gerekmez).
// API anahtarı yalnızca burada, SUNUCUDA kullanılır; tarayıcıya gitmez.
// =============================================================
import { AIProvider, ProviderError } from './AIProvider.js';

const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export class GeminiProvider extends AIProvider {
  constructor({ apiKey, model, fallbackModels = [] }) {
    super();
    this.apiKey = apiKey;
    // Tekrarsız model listesi: önce ana model, sonra yedekler
    this.models = [...new Set([model, ...fallbackModels])];
  }

  get name() { return 'gemini'; }

  async generate({ system, messages, image, jsonSchema }) {
    if (!this.apiKey) {
      throw new ProviderError('NO_KEY', 'GEMINI_API_KEY ortam değişkeni eklenmemiş.', { status: 500 });
    }

    // Konuşmayı Gemini biçimine çevir
    const contents = messages.map((m) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));
    // Görüntüyü son kullanıcı mesajına ekle
    if (image && contents.length) {
      contents[contents.length - 1].parts.unshift({
        inline_data: { mime_type: image.mimeType, data: image.data },
      });
    }

    const body = {
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4096,
        ...(jsonSchema ? { responseMimeType: 'application/json', responseSchema: jsonSchema } : {}),
      },
    };

    let lastError;
    // Modelleri sırayla dene: model yoksa veya ücretsiz kotası yoksa sıradakine geç
    for (const model of this.models) {
      try {
        const text = await this.#call(model, body);
        return { text, model };
      } catch (err) {
        lastError = err;
        if (err.code === 'MODEL_UNAVAILABLE') continue;
        throw err;
      }
    }
    throw new ProviderError('UNKNOWN', 'Hiçbir model kullanılamadı: ' + (lastError?.message || ''), { status: 502 });
  }

  async #call(model, body) {
    const res = await fetch(`${BASE}/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': this.apiKey },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) throw toProviderError(res.status, data, model);

    const cand = data.candidates?.[0];
    const text = (cand?.content?.parts || [])
      .filter((p) => !p.thought && typeof p.text === 'string')
      .map((p) => p.text).join('');
    if (!text) {
      if (data.promptFeedback?.blockReason || cand?.finishReason === 'SAFETY') {
        throw new ProviderError('BLOCKED', 'Model bu içeriğe cevap vermedi.', { status: 422 });
      }
      throw new ProviderError('UNKNOWN', 'Modelden boş cevap geldi.', { status: 502 });
    }
    return text;
  }
}

// Gemini hata cevabını anlaşılır bir ProviderError'a çevirir
function toProviderError(status, data, model) {
  const msg = data?.error?.message || `HTTP ${status}`;
  const details = data?.error?.details || [];

  if (status === 404) {
    return Object.assign(new Error(`Model bulunamadı: ${model}`), { code: 'MODEL_UNAVAILABLE' });
  }
  if (status === 400 && /API key not valid|API_KEY_INVALID/i.test(JSON.stringify(data))) {
    return new ProviderError('BAD_KEY', 'API anahtarı geçersiz.', { status: 401 });
  }
  if (status === 403) {
    return new ProviderError('BAD_KEY', 'API anahtarının bu işleme izni yok.', { status: 401 });
  }
  if (status === 429) {
    // Bu modelin ücretsiz kotası hiç yoksa ("limit: 0") sıradaki modele geç
    if (/limit:\s*0\b/.test(msg)) {
      return Object.assign(new Error(`Ücretsiz kotası olmayan model: ${model}`), { code: 'MODEL_UNAVAILABLE' });
    }
    const retry = details.find((d) => String(d['@type']).includes('RetryInfo'));
    const retryAfter = Math.ceil(parseFloat(retry?.retryDelay || '0')) || 15;
    const daily = JSON.stringify(details).includes('PerDay');
    return new ProviderError(daily ? 'DAILY_LIMIT' : 'RATE_LIMIT', msg, { status: 429, retryAfter: daily ? 0 : retryAfter });
  }
  if (status === 500 || status === 503) {
    return new ProviderError('OVERLOADED', 'Model şu an yoğun.', { status: 503, retryAfter: 5 });
  }
  return new ProviderError('UNKNOWN', msg, { status: 502 });
}

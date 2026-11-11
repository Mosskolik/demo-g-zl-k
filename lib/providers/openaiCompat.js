// =============================================================
// OpenAI uyumlu sağlayıcılar (Groq, Mistral, NVIDIA NIM, OpenRouter, Cloudflare Workers AI…)
// Hepsi aynı "chat/completions" biçimini kullandığı için tek sınıf yeterli.
// Yeni bir sağlayıcı eklemek için lib/config.js'teki `extra` listesine bir satır eklemen yeter.
// API anahtarları yalnızca SUNUCUDA kullanılır; tarayıcıya gitmez.
// =============================================================
import { AIProvider, ProviderError } from './AIProvider.js';
import { raceCandidates } from './race.js';

export class OpenAICompatProvider extends AIProvider {
  /**
   * @param {{name:string, baseUrl:string, apiKey:string, models:string[], timeoutMs?:number, maxTokens?:number}} o
   */
  constructor({ name, baseUrl, apiKey, models, timeoutMs = 30000, maxTokens = 4096 }) {
    super();
    this._name = name;
    this.baseUrl = String(baseUrl || '').replace(/\/$/, '');
    this.apiKey = apiKey;
    this.models = models;
    this.timeoutMs = timeoutMs;
    this.maxTokens = maxTokens;
  }

  get name() { return this._name; }
  get enabled() { return Boolean(this.apiKey && this.baseUrl && this.models.length); }

  candidates({ system, messages, image, jsonSchema, thinking = false, slow = false }) {
    // Bu sağlayıcıların çoğu JSON ŞEMASINI desteklemez; şemayı talimata örnek olarak ekliyoruz
    const sys = jsonSchema
      ? `${system}\n\nSADECE geçerli bir JSON nesnesi yaz (başka hiçbir şey yazma, kod bloğu kullanma). Biçim:\n${JSON.stringify(skeleton(jsonSchema))}`
      : system;
    const msgs = [{ role: 'system', content: sys }];
    messages.forEach((m, i) => {
      const role = m.role === 'model' ? 'assistant' : 'user';
      if (image && i === messages.length - 1) {
        msgs.push({ role, content: [
          { type: 'text', text: m.text },
          { type: 'image_url', image_url: { url: `data:${image.mimeType};base64,${image.data}` } },
        ] });
      } else msgs.push({ role, content: m.text });
    });
    const body = {
      messages: msgs,
      temperature: 0.3,
      max_tokens: this.maxTokens,
      ...(jsonSchema ? { response_format: { type: 'json_object' } } : {}),
    };
    const perModel = thinking || slow ? this.timeoutMs * 1.6 : this.timeoutMs;
    return this.models.map((model) => ({
      id: `${this._name}:${model}`,
      label: `${this._name}:${model}`,
      timeoutMs: perModel,
      run: (signal, timeoutMs) => this.#call(model, body, timeoutMs, signal),
    }));
  }

  async generate(req) {
    return raceCandidates(this.candidates(req), { validate: req.validate });
  }

  /** Sağlayıcının model listesi (model adlarını doğrulamak için) */
  async listModels() {
    const res = await fetch(`${this.baseUrl}/models`, { headers: { Authorization: `Bearer ${this.apiKey}` }, signal: AbortSignal.timeout(15000) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error?.message || data?.errors?.[0]?.message || `HTTP ${res.status}`);
    const list = data.data || data.result || data.models || [];
    return list.map((m) => m.id || m.name).filter(Boolean);
  }

  async #call(model, body, timeoutMs, outerSignal, retried = false) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const onOuter = () => ctrl.abort();
    outerSignal?.addEventListener('abort', onOuter, { once: true });
    let res, data;
    try {
      res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
        body: JSON.stringify({ model, ...body }),
        signal: ctrl.signal,
      });
      data = await res.json().catch(() => ({}));
    } catch (err) {
      if (err.name === 'AbortError') {
        throw Object.assign(new Error(`${Math.round(timeoutMs / 1000)} sn içinde cevap gelmedi`), { code: 'MODEL_TIMEOUT' });
      }
      throw new ProviderError('UNKNOWN', `${this._name} bağlantı hatası: ${err.message}`, { status: 502 });
    } finally {
      clearTimeout(timer);
      outerSignal?.removeEventListener('abort', onOuter);
    }

    const msg = data?.error?.message || data?.errors?.[0]?.message || data?.message || data?.detail || `HTTP ${res.status}`;

    // "response_format" desteklenmiyorsa onsuz bir kez daha dene (talimat zaten JSON istiyor)
    if (res.status === 400 && !retried && body.response_format) {
      const { response_format, ...rest } = body;
      return this.#call(model, rest, timeoutMs, outerSignal, true);
    }
    if (!res.ok) throw this.#toError(res, String(msg), model);

    let text = data.choices?.[0]?.message?.content;
    if (Array.isArray(text)) text = text.map((p) => p.text || '').join('');
    // Bazı modeller düşünme metnini <think>…</think> içinde döndürür: at
    text = String(text || '').replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    if (!text) throw new ProviderError('UNKNOWN', `${this._name}: boş cevap`, { status: 502 });
    return text;
  }

  #toError(res, msg, model) {
    const s = res.status;
    const where = `${this._name}:${model}`;
    if (s === 401 || s === 403) return new ProviderError('BAD_KEY', `${this._name} anahtarı geçersiz ya da izni yok.`, { status: 401 });
    if (s === 429) {
      const daily = /per day|daily|\bday\b|RPD|TPD|quota|neurons/i.test(msg);
      const retryAfter = Math.ceil(parseFloat(res.headers.get('retry-after') || '0')) || 15;
      return new ProviderError(daily ? 'DAILY_LIMIT' : 'RATE_LIMIT', `${where}: ${msg}`, { status: 429, retryAfter: daily ? 0 : retryAfter });
    }
    if (s >= 500) return new ProviderError('OVERLOADED', `${where} şu an yoğun.`, { status: 503, retryAfter: 5 });
    // 400/402/404/413/422: model yok, ücretli, görüntü desteklemiyor, istek çok büyük…
    return Object.assign(new Error(`${where}: ${msg}`), { code: 'MODEL_UNAVAILABLE' });
  }
}

// Gemini biçimindeki şemadan (OBJECT/ARRAY/STRING…) örnek bir JSON iskeleti üretir
function skeleton(s) {
  if (!s || typeof s !== 'object') return '';
  const t = String(s.type || '').toUpperCase();
  if (t === 'OBJECT') return Object.fromEntries(Object.entries(s.properties || {}).map(([k, v]) => [k, skeleton(v)]));
  if (t === 'ARRAY') return [skeleton(s.items)];
  if (t === 'BOOLEAN') return false;
  if (s.enum) return s.enum.join(' | ');
  return '';
}

// =============================================================
// Google Gemini sağlayıcısı (REST API, ek paket gerekmez).
// API anahtarı yalnızca burada, SUNUCUDA kullanılır; tarayıcıya gitmez.
// =============================================================
import { AIProvider, ProviderError } from './AIProvider.js';

const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export class GeminiProvider extends AIProvider {
  constructor({ apiKey, model, fallbackModels = [], thinkingBudget = 0, thinkingBudgetHard = 2048, thinkingBudgetLight = 512, timeoutMs = 30000, totalTimeoutMs = 110000, hedgeMs = 12000 }) {
    super();
    this.apiKey = apiKey;
    this.thinkingBudget = thinkingBudget;
    this.thinkingBudgetHard = thinkingBudgetHard;
    this.thinkingBudgetLight = thinkingBudgetLight;
    this.timeoutMs = timeoutMs;
    this.totalTimeoutMs = totalTimeoutMs;
    this.hedgeMs = hedgeMs;
    // Tekrarsız model listesi: önce ana model, sonra yedekler
    this.models = [...new Set([model, ...fallbackModels])];
  }

  get name() { return 'gemini'; }

  async generate({ system, messages, image, jsonSchema, thinking = false, slow = false, preferFast = false, validate = null }) {
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
        maxOutputTokens: 8192,
        ...(jsonSchema ? { responseMimeType: 'application/json', responseSchema: jsonSchema } : {}),
        // Uzun "düşünme" cevabı çok yavaşlatıyor (60 sn'yi aşıp zaman aşımına düşüyordu)
        // Cevap kontrolü/çözümde ise doğruluk için sınırlı düşünmeye izin ver
        thinkingConfig: { thinkingBudget: thinking === 'hard' ? this.thinkingBudgetHard : thinking === 'light' ? this.thinkingBudgetLight : this.thinkingBudget },
      },
    };

    const deadline = Date.now() + this.totalTimeoutMs;
    // Basit işlerde (açıklama, serbest soru, konu anlatımı) önce hızlı/bol kotalı yedek model;
    // güçlü modelin günlük kotası (ör. 20) sayfa okuma, cevap kontrolü ve çözüme kalsın.
    const order = preferFast && this.models.length > 1 ? [this.models[1], this.models[0], ...this.models.slice(2)] : this.models;
    const perModel = thinking || slow ? this.timeoutMs * 1.6 : this.timeoutMs;
    const RETRY = ['MODEL_UNAVAILABLE', 'MODEL_TIMEOUT', 'OVERLOADED', 'RATE_LIMIT', 'DAILY_LIMIT', 'BAD_OUTPUT'];

    // YEDEKLİ YARIŞ (hedging): ilk model `hedgeMs` içinde cevap vermezse onu beklemeye devam ederken
    // sıradaki modeli de AYNI ANDA başlat; ilk düzgün cevap kazanır, diğeri iptal edilir.
    // Hata gelirse (kota, yoğunluk, bozuk cevap) hemen sıradaki modele geçilir.
    const queue = [...order];
    const errors = [];
    const controllers = new Set();
    let active = 0, done = false, hedged = false;

    const result = await new Promise((resolve, reject) => {
      const finish = () => { if (!done) { done = true; clearTimeout(hedgeTimer); reject(pickError(errors)); } };
      const startNext = () => {
        if (done) return;
        const left = deadline - Date.now();
        const model = left >= 5000 ? queue.shift() : undefined;
        if (!model) { if (active === 0) finish(); return; }
        active++;
        const ctrl = new AbortController();
        controllers.add(ctrl);
        const started = Date.now();
        this.#call(model, body, Math.min(perModel, left), false, ctrl.signal)
          .then((text) => {
            // Cevap bozuksa (ör. yarım kalmış JSON) bu modeli başarısız say
            if (validate && !validate(text)) {
              throw Object.assign(new Error(`Bozuk cevap (${text.length} karakter)`), { code: 'BAD_OUTPUT' });
            }
            if (done) return;
            done = true;
            clearTimeout(hedgeTimer);
            console.log(`[gemini] model=${model} süre=${Date.now() - started}ms tamam${hedged ? ' (yedekli yarış)' : ''}`);
            for (const c of controllers) if (c !== ctrl) c.abort(); // diğer modeli iptal et
            resolve({ text, model });
          })
          .catch((err) => {
            active--;
            controllers.delete(ctrl);
            if (done) return; // kazanan belli oldu, bu iptal edilen model
            console.log(`[gemini] model=${model} süre=${Date.now() - started}ms hata=${err.code || ''} ${err.message}`);
            errors.push(err);
            if (!RETRY.includes(err.code)) { done = true; clearTimeout(hedgeTimer); for (const c of controllers) c.abort(); reject(err); return; }
            startNext();
          });
      };
      const hedgeTimer = setTimeout(() => {
        if (!done && active === 1 && queue.length) { hedged = true; console.log('[gemini] ilk model yavaş, yedek model de başlatıldı'); startNext(); }
      }, this.hedgeMs);
      startNext();
    });
    return result;
  }

  async #call(model, body, timeoutMs, retried = false, outerSignal = null) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const onOuter = () => ctrl.abort();
    outerSignal?.addEventListener('abort', onOuter, { once: true });
    let res, data;
    try {
      res = await fetch(`${BASE}/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': this.apiKey },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      data = await res.json().catch(() => ({}));
    } catch (err) {
      if (err.name === 'AbortError') {
        throw Object.assign(new Error(`${Math.round(timeoutMs / 1000)} sn içinde cevap gelmedi`), { code: 'MODEL_TIMEOUT' });
      }
      throw new ProviderError('UNKNOWN', 'Gemini\'ye bağlanılamadı: ' + err.message, { status: 502 });
    } finally {
      clearTimeout(timer);
      outerSignal?.removeEventListener('abort', onOuter);
    }

    // Model "düşünme" ayarını desteklemiyorsa ayarsız bir kez daha dene
    // (bazı modeller bunu sadece "invalid argument" diye bildiriyor)
    if (res.status === 400 && !retried && body.generationConfig.thinkingConfig) {
      const { thinkingConfig, ...gen } = body.generationConfig;
      return this.#call(model, { ...body, generationConfig: gen }, timeoutMs, true, outerSignal);
    }

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

// Hiçbir model başaramadıysa: en "geçici" hatayı bildir (tarayıcı bekleyip kendisi tekrar dener)
function pickError(errors) {
  for (const code of ['RATE_LIMIT', 'OVERLOADED', 'DAILY_LIMIT']) {
    const e = errors.find((x) => x.code === code);
    if (e) return e;
  }
  const last = errors[errors.length - 1];
  if (errors.some((x) => x.code === 'BAD_OUTPUT')) return new ProviderError('READ_FAILED', 'Modellerin hiçbiri düzgün cevap vermedi.', { status: 502 });
  if (last?.code === 'MODEL_TIMEOUT') return new ProviderError('TIMEOUT', 'Model zamanında cevap vermedi.', { status: 504 });
  return new ProviderError('UNKNOWN', 'Hiçbir model kullanılamadı: ' + (last?.message || ''), { status: 502 });
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

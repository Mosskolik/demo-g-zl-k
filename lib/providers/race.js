// =============================================================
// YEDEKLİ YARIŞ (hedging) — tüm sağlayıcılar için ortak.
//
// "Aday" = bir sağlayıcının bir modeli. Adaylar sırayla denenir:
//  - Bir aday hata verirse (kota, yoğunluk, anahtar yok, bozuk cevap) hemen sıradakine geçilir.
//  - Bir aday `hedgeMs` içinde cevap vermezse o beklenirken sıradaki de AYNI ANDA başlatılır
//    (her `hedgeMs`'de bir tane daha, en fazla 3). İlk düzgün cevap kazanır, diğerleri iptal edilir.
// =============================================================
import { ProviderError } from './AIProvider.js';

/**
 * @param {{id:string, label:string, timeoutMs:number, run:(signal:AbortSignal, timeoutMs:number)=>Promise<string>}[]} candidates
 * @param {{hedgeMs?:number, totalTimeoutMs?:number, validate?:(text:string)=>boolean, maxParallel?:number}} opts
 * @returns {Promise<{text:string, model:string}>}
 */
export function raceCandidates(candidates, { hedgeMs = 8000, totalTimeoutMs = 110000, validate = null, maxParallel = 3 } = {}) {
  const deadline = Date.now() + totalTimeoutMs;
  const queue = [...candidates];
  const errors = [];
  const controllers = new Set();
  let active = 0, done = false, hedged = false;

  return new Promise((resolve, reject) => {
    const stop = () => { done = true; clearInterval(hedgeTimer); };
    const startNext = () => {
      if (done) return;
      const left = deadline - Date.now();
      const cand = left >= 5000 ? queue.shift() : undefined;
      if (!cand) { if (active === 0) { stop(); reject(pickError(errors)); } return; }
      active++;
      const ctrl = new AbortController();
      controllers.add(ctrl);
      const started = Date.now();
      cand.run(ctrl.signal, Math.min(cand.timeoutMs, left))
        .then((text) => {
          // Cevap bozuksa (ör. yarım kalmış JSON) bu adayı başarısız say
          if (validate && !validate(text)) {
            throw Object.assign(new Error(`Bozuk cevap (${text.length} karakter)`), { code: 'BAD_OUTPUT' });
          }
          if (done) return;
          stop();
          console.log(`[yz] model=${cand.label} süre=${Date.now() - started}ms tamam${hedged ? ' (yedekli yarış)' : ''}`);
          for (const c of controllers) if (c !== ctrl) c.abort(); // diğer adayları iptal et
          resolve({ text, model: cand.label });
        })
        .catch((err) => {
          active--;
          controllers.delete(ctrl);
          if (done) return; // kazanan belli oldu; bu, iptal edilen aday
          console.log(`[yz] model=${cand.label} süre=${Date.now() - started}ms hata=${err.code || ''} ${String(err.message).slice(0, 160)}`);
          errors.push(err);
          startNext(); // hata ne olursa olsun sıradaki adayı dene
        });
    };
    const hedgeTimer = setInterval(() => {
      if (done || !queue.length) { clearInterval(hedgeTimer); return; }
      if (active >= 1 && active < maxParallel) {
        hedged = true;
        console.log(`[yz] cevap gecikti, yarışa ${queue[0].label} de katıldı`);
        startNext();
      }
    }, hedgeMs);
    startNext();
  });
}

// Hiçbir aday başaramadıysa: en "geçici" hatayı bildir (tarayıcı bekleyip kendisi tekrar dener)
export function pickError(errors) {
  for (const code of ['RATE_LIMIT', 'OVERLOADED', 'DAILY_LIMIT']) {
    const e = errors.find((x) => x.code === code);
    if (e) return e;
  }
  if (errors.some((x) => x.code === 'BAD_OUTPUT')) return new ProviderError('READ_FAILED', 'Modellerin hiçbiri düzgün cevap vermedi.', { status: 502 });
  if (errors.some((x) => x.code === 'MODEL_TIMEOUT')) return new ProviderError('TIMEOUT', 'Model zamanında cevap vermedi.', { status: 504 });
  const known = errors.find((x) => x instanceof ProviderError); // ör. BAD_KEY, NO_KEY, BLOCKED
  if (known) return known;
  const last = errors[errors.length - 1];
  return new ProviderError('UNKNOWN', 'Hiçbir model kullanılamadı: ' + (last?.message || 'aday yok'), { status: 502 });
}

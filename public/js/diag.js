// =============================================================
// TANI KAYDI — telefonda neler olduğunu geliştiriciye göstermek için.
// Sadece olay türleri, hata kodları ve süreler gönderilir.
// Söylenen cümleler, ses ve fotoğraf GÖNDERİLMEZ.
// Kayıtlar Vercel'in günlüklerinde (logs) ~30 dakika durur.
// =============================================================
const queue = [];
let timer = null;
const sid = Math.random().toString(36).slice(2, 8); // bu açılışa özel rastgele kimlik

export function diag(type, data = {}) {
  queue.push({ t: Math.round(performance.now() / 100) / 10, type, ...data });
  console.log('[tanı]', type, data);
  if (!timer) timer = setTimeout(flush, 3000);
}

function flush() {
  timer = null;
  if (!queue.length) return;
  const body = JSON.stringify({ sid, ua: navigator.userAgent, events: queue.splice(0, 50) });
  try {
    const sent = navigator.sendBeacon?.('/api/log', new Blob([body], { type: 'application/json' }));
    if (!sent) fetch('/api/log', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
  } catch { /* tanı kaydı gönderilemezse uygulama etkilenmez */ }
  if (queue.length) timer = setTimeout(flush, 1000);
}

addEventListener('pagehide', flush);
addEventListener('visibilitychange', () => { diag('gorunurluk', { v: document.visibilityState }); if (document.visibilityState === 'hidden') flush(); });
addEventListener('error', (e) => diag('js-hata', { m: String(e.message).slice(0, 200), f: (e.filename || '').split('/').pop(), l: e.lineno }));
addEventListener('unhandledrejection', (e) => diag('js-hata', { m: String(e.reason?.message || e.reason).slice(0, 200) }));

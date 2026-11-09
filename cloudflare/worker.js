// =============================================================
// Cloudflare Worker — AKTARICI (reverse proxy)
//
// Neden var? Bazı Türk mobil operatörleri "*.vercel.app" adreslerine
// bağlantıyı kesiyor (ERR_CONNECTION_RESET). Bu küçük program
// "*.workers.dev" adresine gelen her isteği olduğu gibi Vercel'deki
// uygulamaya iletir ve cevabı geri getirir. Telefon vercel.app'e hiç
// bağlanmadığı için engel devreye girmez. Uygulamanın kodu değişmez.
// =============================================================
const ORIGIN = 'https://matematik-asistani-eta.vercel.app';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = ORIGIN + url.pathname + url.search;

    const headers = new Headers(request.headers);
    headers.delete('host');

    const init = { method: request.method, headers, redirect: 'manual' };
    if (request.method !== 'GET' && request.method !== 'HEAD') init.body = request.body;

    // Tanı kayıtlarını Cloudflare günlüğüne de yaz (Vercel ücretsiz planı 30 dk, Cloudflare 3 gün saklar).
    // Sadece olay türleri ve hata kodları gelir; konuşma, ses ve fotoğraf yoktur.
    if (url.pathname === '/api/log' && request.method === 'POST') {
      const text = await request.text();
      console.log('[tani] ' + text.slice(0, 4000));
      init.body = text;
    }

    try {
      const res = await fetch(target, init);
      return new Response(res.body, res);
    } catch (err) {
      return new Response('Uygulamaya ulaşılamadı. Biraz sonra tekrar dene.', {
        status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  },
};

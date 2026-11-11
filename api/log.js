// POST /api/log — tarayıcıdan gelen tanı kayıtlarını Vercel günlüğüne yazar (bkz. public/js/diag.js)
export default async function handler(req, res) {
  try {
    let body = req.body;
    if (!body || typeof body !== 'object') {
      const chunks = []; for await (const c of req) chunks.push(c);
      body = JSON.parse(Buffer.concat(chunks).toString('utf8').slice(0, 20000) || '{}');
    }
    const ua = String(body.ua || '').replace(/Mozilla\/5\.0 /, '').slice(0, 120);
    for (const e of (body.events || []).slice(0, 50)) {
      console.log(`[istemci ${String(body.sid).slice(0, 8)}] ${JSON.stringify(e).slice(0, 300)}`);
    }
    console.log(`[istemci ${String(body.sid).slice(0, 8)}] ua=${ua}`);
  } catch { /* yoksay */ }
  res.statusCode = 204;
  res.end();
}

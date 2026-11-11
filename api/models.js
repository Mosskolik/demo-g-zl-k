// GET /api/models — hangi sağlayıcıların devrede olduğunu ve aday (model) sırasını gösterir.
//   /api/models?saglayici=groq  → o sağlayıcının sunduğu model adları (adları doğrulamak için)
// Anahtarları ASLA göstermez.
import { config } from '../lib/config.js';
import { ChainProvider } from '../lib/providers/chain.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  const chain = new ChainProvider(config);
  const q = new URL(req.url, 'http://x').searchParams.get('saglayici');
  const out = {
    sira: config.chain,
    devrede: chain.providers.map((p) => p.name),
    anahtarEklenmemis: Object.keys(chain.all).filter((n) => !chain.all[n].enabled),
    adaylar: chain.candidates({ system: '', messages: [] }).map((c) => c.id),
  };
  if (q === 'gemini' && config.gemini.apiKey) {
    try {
      const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000', { headers: { 'x-goog-api-key': config.gemini.apiKey } });
      const d = await r.json();
      out.modeller = (d.models || []).filter((m) => (m.supportedGenerationMethods || []).includes('generateContent')).map((m) => m.name.replace('models/', ''));
    } catch (e) { out.hata = e.message; }
  } else if (q && chain.all[q]?.enabled && chain.all[q].listModels) {
    try { out.modeller = await chain.all[q].listModels(); } catch (e) { out.hata = String(e.message).slice(0, 200); }
  } else if (q) out.hata = 'Bu sağlayıcı devrede değil (anahtarı eklenmemiş) ya da adı yanlış.';
  res.end(JSON.stringify(out, null, 1));
}

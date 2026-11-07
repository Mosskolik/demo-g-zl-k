// GET /api/models — API anahtarının erişebildiği Gemini modellerini listeler
// (hangi model adının kullanılabileceğini görmek için). Anahtarı GÖSTERMEZ.
import { config } from '../lib/config.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (!config.gemini.apiKey) { res.statusCode = 500; return res.end(JSON.stringify({ error: 'GEMINI_API_KEY yok' })); }
  try {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000', {
      headers: { 'x-goog-api-key': config.gemini.apiKey },
    });
    const data = await r.json();
    const models = (data.models || [])
      .filter((m) => (m.supportedGenerationMethods || []).includes('generateContent'))
      .map((m) => ({ ad: m.name.replace('models/', ''), isim: m.displayName, dusunme: Boolean(m.thinking) }));
    res.end(JSON.stringify({ seciliModel: config.gemini.model, yedekler: config.gemini.fallbackModels, models, hata: data.error?.message }, null, 1));
  } catch (e) {
    res.statusCode = 502; res.end(JSON.stringify({ error: e.message }));
  }
}

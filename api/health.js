// GET /api/health — ayarların doğru olup olmadığını kontrol etmek için.
// Anahtarın KENDİSİNİ asla göstermez, sadece eklenip eklenmediğini söyler.
import { config } from '../lib/config.js';

export default async function handler(req, res) {
  // Tanı: /api/health?bekle=35 → 35 sn bekleyip cevap verir (aradaki bağlantıların zaman sınırını ölçmek için, en fazla 90)
  const wait = Math.min(90, Number(new URL(req.url, 'http://x').searchParams.get('bekle')) || 0);
  if (wait) await new Promise((r) => setTimeout(r, wait * 1000));
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify({
    ok: true,
    provider: config.provider,
    model: config.provider === 'gemini' ? config.gemini.model : config.provider === 'ollama' ? config.ollama.model : 'mock',
    apiKeyEklendi: config.provider !== 'gemini' || Boolean(config.gemini.apiKey),
  }));
}

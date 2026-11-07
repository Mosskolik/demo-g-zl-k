// GET /api/health — ayarların doğru olup olmadığını kontrol etmek için.
// Anahtarın KENDİSİNİ asla göstermez, sadece eklenip eklenmediğini söyler.
import { config } from '../lib/config.js';

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify({
    ok: true,
    provider: config.provider,
    model: config.provider === 'gemini' ? config.gemini.model : config.provider === 'ollama' ? config.ollama.model : 'mock',
    apiKeyEklendi: config.provider !== 'gemini' || Boolean(config.gemini.apiKey),
  }));
}

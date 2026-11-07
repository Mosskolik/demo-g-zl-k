// =============================================================
// Yerel test sunucusu (Vercel hesabı gerekmez, ek paket gerekmez).
// Çalıştırmak için:   npm run dev     → http://localhost:3000
// Anahtarsız deneme:  npm run mock
// .env dosyasındaki ayarları otomatik okur.
// =============================================================
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// .env dosyasını yükle (varsa). Komut satırından verilen ayarlar önceliklidir.
const envFile = path.join(root, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

// Ayarlar .env okunduktan SONRA yüklenmeli
const chat = (await import('../api/chat.js')).default;
const health = (await import('../api/health.js')).default;

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json' };

const PORT = Number(process.env.PORT) || 3000;

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (url.pathname === '/api/chat') return await chat(req, res);
    if (url.pathname === '/api/health') return health(req, res);

    // Statik dosyalar (public klasörü)
    const file = path.join(root, 'public', url.pathname === '/' ? 'index.html' : url.pathname);
    if (!file.startsWith(path.join(root, 'public')) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.statusCode = 404; return res.end('Bulunamadı');
    }
    res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  } catch (e) {
    console.error(e);
    res.statusCode = 500; res.end('Hata');
  }
}).listen(PORT, () => {
  console.log(`Matematik asistanı çalışıyor: http://localhost:${PORT}`);
  console.log(`Sağlayıcı: ${process.env.AI_PROVIDER || 'gemini'}`);
});

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
// api/ klasöründeki her dosya bir uç nokta: /api/chat → api/chat.js
const apiHandlers = {};
for (const f of fs.readdirSync(path.join(root, 'api'))) {
  if (f.endsWith('.js')) apiHandlers['/api/' + f.slice(0, -3)] = (await import('../api/' + f)).default;
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json' };

const PORT = Number(process.env.PORT) || 3000;

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    if (apiHandlers[url.pathname]) return await apiHandlers[url.pathname](req, res);

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

// =============================================================
// Vercel serverless function:  POST /api/chat
// Tarayıcı buraya istek atar; burası yapay zekâyı çağırır.
// API anahtarı sadece burada (sunucuda) kullanılır.
//
// İstek gövdesi (JSON):
//   mode:     "read" | "correct" | "explain" | "question" | "check" | "solve" | "free"
//   image:    (sadece read) base64 JPEG, "data:" öneki olmadan
//   pageText: okunan sayfa metni (read dışındaki modlarda)
//   history:  [{role:"user"|"model", text}]  önceki konuşma
//   message:  öğrencinin son mesajı
// =============================================================
import { config } from '../lib/config.js';
import { getProvider } from '../lib/providers/index.js';
import { ProviderError } from '../lib/providers/AIProvider.js';
import { buildSystem, READ_SCHEMA } from '../lib/prompts.js';

const MODES = ['read', 'correct', 'explain', 'question', 'check', 'solve', 'free'];
const MAX_IMAGE_CHARS = 4_000_000; // ~3 MB görüntü (Vercel sınırı 4,5 MB)

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Sadece POST' });

  let body;
  try {
    body = req.body && typeof req.body === 'object' ? req.body : await readJson(req);
  } catch {
    return send(res, 400, { error: 'Geçersiz istek', code: 'BAD_REQUEST' });
  }

  const { mode, image, pageText = '', history = [], message = '' } = body || {};
  if (!MODES.includes(mode)) return send(res, 400, { error: 'Geçersiz mod', code: 'BAD_REQUEST' });
  if (mode === 'read' && (typeof image !== 'string' || !image)) {
    return send(res, 400, { error: 'Görüntü yok', code: 'BAD_REQUEST' });
  }
  if (image && image.length > MAX_IMAGE_CHARS) {
    return send(res, 413, { error: 'Görüntü çok büyük', code: 'TOO_LARGE' });
  }

  // Konuşma geçmişini temizle ve kısalt
  const messages = (Array.isArray(history) ? history : [])
    .filter((m) => m && typeof m.text === 'string' && m.text.trim())
    .slice(-config.maxHistory)
    .map((m) => ({ role: m.role === 'model' ? 'model' : 'user', text: m.text.slice(0, 4000) }));

  const userText = mode === 'read'
    ? 'Bu fotoğraftaki sayfayı oku.'
    : String(message).slice(0, 2000) || 'Devam et.';
  messages.push({ role: 'user', text: userText });

  // Gemini, konuşmanın kullanıcı mesajıyla başlamasını ister
  while (messages.length && messages[0].role !== 'user') messages.shift();

  const json = mode === 'read' || mode === 'correct';
  try {
    const provider = getProvider();
    const result = await provider.generate({
      system: buildSystem(mode, mode === 'read' ? '' : String(pageText).slice(0, 8000)),
      messages,
      image: mode === 'read' ? { mimeType: 'image/jpeg', data: image } : undefined,
      jsonSchema: json ? READ_SCHEMA : undefined,
      // Cevap kontrolü ve çözümde model önce düşünsün (daha doğru); okumada hızlı olsun
      thinking: mode === 'check' || mode === 'solve' ? 'hard' : (mode === 'read' ? 'light' : false),
      // Tam sayfa fotoğrafını okumak daha uzun sürebilir
      slow: mode === 'read' || mode === 'correct',
      preferFast: mode === 'question' || mode === 'free' || mode === 'explain',
      // Sayfa okumada cevap geçerli JSON değilse (yarım kalmış) sıradaki modeli dene
      validate: json ? isValidPage : null,
    });

    if (json) {
      let page;
      try {
        page = JSON.parse(stripFence(result.text));
      } catch {
        // Cevap yarıda kaldıysa (çok uzun sayfa) bozuk metni öğrenciye okutma
        console.log('[okuma] JSON çözülemedi, uzunluk=' + result.text.length);
        return send(res, 502, { error: 'Sayfa okunamadı', code: 'READ_FAILED' });
      }
      page.okunus = fixSpoken(page.okunus);
      page.ortakOkunus = fixSpoken(page.ortakOkunus);
      if (Array.isArray(page.sorular)) {
        page.sorular.forEach((q) => {
          q.okunus = fixSpoken(q.okunus);
          // Güvenlik ağı: konu adı çözüm yöntemini ima ediyorsa (ör. "Pisagor bağıntısı") söyleme
          if (HINTY.test(q.konu || '')) q.konu = '';
        });
      }
      return send(res, 200, { page, model: result.model });
    }
    let text = fixSpoken(result.text.trim());
    // Cevap kontrolünde model başa [DOĞRU]/[YANLIŞ] etiketi koyar: etiketi ayır, öğrenciye okutma
    let correct;
    if (mode === 'check') {
      const tag = text.match(/^\s*\[(DOĞRU|DOGRU|YANLIŞ|YANLIS)\]\s*/i);
      if (tag) { correct = /^DO/i.test(tag[1]); text = text.slice(tag[0].length); }
      text = text.replace(/\[(DOĞRU|DOGRU|YANLIŞ|YANLIS)\]\s*/gi, '');
    }
    return send(res, 200, { reply: text, correct, model: result.model });
  } catch (err) {
    if (err instanceof ProviderError) {
      if (err.retryAfter) res.setHeader('Retry-After', String(err.retryAfter));
      return send(res, err.status, { error: err.message, code: err.code, retryAfter: err.retryAfter });
    }
    console.error(err);
    return send(res, 500, { error: 'Sunucu hatası', code: 'UNKNOWN' });
  }
}

// Model nadiren İngilizce sayı kelimesi yazıyor ("twelve"): sesli okunacak metinde Türkçeye çevir
const EN_NUM = { zero: 'sıfır', one: 'bir', two: 'iki', three: 'üç', four: 'dört', five: 'beş', six: 'altı', seven: 'yedi',
  eight: 'sekiz', nine: 'dokuz', ten: 'on', eleven: 'on bir', twelve: 'on iki', thirteen: 'on üç', fourteen: 'on dört',
  fifteen: 'on beş', sixteen: 'on altı', seventeen: 'on yedi', eighteen: 'on sekiz', nineteen: 'on dokuz', twenty: 'yirmi' };
const EN_RE = new RegExp(`\\b(${Object.keys(EN_NUM).join('|')})\\b`, 'gi');
// Konu adında çözüm yöntemi ima eden kelimeler (ipucu sayılır)
const HINTY = /pisagor|öklid|teorem|bağıntı|formül|kural|yöntem|özdeşli|kökler (toplamı|çarpımı)|tales|sinüs|kosinüs|çarpanlara ayır/i;
function fixSpoken(t) {
  return typeof t === 'string' ? t.replace(EN_RE, (w) => EN_NUM[w.toLowerCase()]) : t;
}

function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}

// Gövde henüz okunmadıysa (yerel sunucu) JSON olarak oku
async function readJson(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

function isValidPage(t) {
  try {
    const p = JSON.parse(stripFence(t));
    return Boolean(p && typeof p === 'object' && (Array.isArray(p.sorular) || typeof p.tur === 'string'));
  } catch { return false; }
}

function stripFence(t) {
  return t.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
}

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
  // only: karşılaştırma (yarış) için tek bir adayı zorla, ör. "groq" ya da "groq:model-adı"
  const only = typeof body?.only === 'string' && /^[\w.:@/-]{1,100}$/.test(body.only) ? body.only : undefined;
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
      // Soru açıklamasında soruyu birebir doğru aktarmak önemli: 21 Kasım testinde Gemini dışındaki modeller
      // soruyu yanlış aktardı (ör. "küpkök kırk dokuz") → önce bütün Gemini modelleri denensin
      preferProvider: mode === 'question' ? 'gemini' : undefined,
      // Sayfa okumada cevap geçerli JSON değilse (yarım kalmış) sıradaki modeli dene
      // Cevap kontrolünde karar etiketi yoksa (ya da gizli hesap kapanmamışsa) sıradaki modeli dene:
      // etiketsiz bir cevap, gizli hesabı öğrenciye okutabilir.
      validate: json ? isValidPage : (mode === 'check' ? isValidCheck : null),
      only,
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
      // Biçim: <hesap>gizli çözüm</hesap> [DOĞRU|YANLIŞ] öğrenciye söylenecekler
      // Etiketten ÖNCEKİ her şey gizli hesaptır (doğru cevabı içerir!) → asla öğrenciye gitmez.
      const tag = CHECK_TAG.exec(text);
      if (tag) { correct = /^DO/i.test(tag[1]); text = text.slice(tag.index + tag[0].length); }
      text = text.replace(/<hesap>[\s\S]*?<\/hesap>/gi, '').replace(/\[(DOĞRU|DOGRU|YANLIŞ|YANLIS)\]\s*/gi, '').replace(/<\/?hesap>/gi, '').trim();
    }
    // Soru açıklamasında çözüm/ipucu içeren cümleleri öğrenciye okutma (modelden bağımsız güvenlik ağı)
    if (mode === 'question') {
      const { kept, removed } = stripHintSentences(text);
      if (removed.length) console.log(`[aciklama] ipucu cümlesi silindi: ${removed.length} model=${result.model}`);
      text = kept;
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

// ---------- Soru açıklamasında ipucu filtresi ----------
// Öğrenci soruyu KENDİSİ çözecek. Açıklamada şu tür cümleler ipucudur ve silinir:
// işlem/kavram tarifi ("kendisiyle çarpmak demek"), yöntem/formül/kural, işlem adımları ("önce… sonra…"),
// cevap/sonuç, şıkları tekrar okuma.
// Not: JavaScript'te \b Türkçe harfleri (ç, ö, ş…) kelime saymaz → kendi kelime sınırımızı kullanıyoruz.
const L = 'a-zçğıöşüâîû';
const word = (alts) => new RegExp(`(?:^|[^${L}])(?:${alts})(?=$|[^${L}])`);
const HINT_RULES = [
  /formül|teorem|pisagor|öklid|tales|özdeşli|bağıntı|yöntem/,
  word('kural[a-zçğıöşü]*'),
  /kendisiyle|kendisi ile|birden .*kadar|bire kadar|1'den|1 den/,
  // "biz yaparız" ve "sen yaparsan / yapabilirsin" kalıbındaki işlem fiilleri: ekleriz, böleriz, bulursun…
  new RegExp(`[${L}]+(?:arız|eriz|ırız|iriz|uruz|ürüz|arsak|ersek|ırsak|irsek|ursak|ürsek|arsan|ersen|ırsan|irsen|ursan|ürsen|abilirsin|ebilirsin|ursun|ürsün|ırsın|irsin)(?=$|[^${L}])`),
  word('bulunur|hesaplanır|çarpılır|toplanır|bölünür|çıkarılır|sadeleştir[a-zçğıöşü]*|genişlet[a-zçğıöşü]*|eşitle[a-zçğıöşü]*'),
  /payda|yerine koy|yerine yaz|kullanarak|uygulayarak|ters işaret|katsayı|karesini al|karekökünü al|çarpanlarına ayırırken/,
  word('önce|ilk olarak|ilk adım|birinci adım|ikinci adım|ardından|daha sonra|sonra'),
  word('cevap|cevabı|cevabın|doğru şık|sonuç olarak|eşit olur'),
  /sonucu .* olur/,
  new RegExp(`(?:^|[^${L}])[a-e] şıkk`), // şıkları yeniden okuma
];
// Tanım cümlesi + işlem kelimesi = işlemin nasıl yapılacağını tarif ediyor
const DEFINITION = /(demek|demektir|anlamına gel|anlamı|denir|ifade eder)/;
const OPERATION = /(çarp|topla|toplam|böl|çıkar|fark|kuvvet|üs|kare|küp|kök)/;

export function stripHintSentences(text) {
  const sentences = String(text).replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+/).filter(Boolean);
  const kept = [], removed = [];
  for (const sentence of sentences) {
    const low = sentence.toLocaleLowerCase('tr');
    const isHint = HINT_RULES.some((r) => r.test(low)) || (DEFINITION.test(low) && OPERATION.test(low));
    (isHint ? removed : kept).push(sentence);
  }
  // Sadece "Bu soruyu sana açıklayayım." kaldıysa açıklama yok say
  const meaningful = kept.filter((x) => !/açıklayayım/i.test(x));
  return { kept: meaningful.length ? kept.join(' ') : '', removed };
}

function send(res, status, obj) {
  // Cloudflare aktarıcısı 502/504 cevaplarını kendi HTML hata sayfasıyla değiştiriyor ve hata
  // kodu (READ_FAILED, TIMEOUT…) kayboluyor → bunları 500 olarak gönder (kod gövdede kalır).
  res.statusCode = status === 502 || status === 504 ? 500 : status;
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

const CHECK_TAG = /\[(DOĞRU|DOGRU|YANLIŞ|YANLIS)\]\s*/i;
function isValidCheck(t) {
  const tag = CHECK_TAG.exec(t);
  if (!tag) return false;
  const after = t.slice(tag.index + tag[0].length);
  return after.trim().length > 0 && !/<hesap>/i.test(after); // etiketten sonra öğrenciye söylenecek bir şey olmalı
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

// =============================================================
// ANA UYGULAMA — akışı yönetir
//
// Aşamalar (phase):
//   idle        → sayfa yok, fotoğraf bekleniyor
//   correcting  → öğrencinin düzeltmesi bekleniyor
//   explain     → konu anlatımı sürüyor ("devam" bekleniyor)
//   question    → soru anlatıldı; cevap, "çöz" veya serbest soru bekleniyor
//   awaitAnswer → "cevabım" dendi, cevabın kendisi bekleniyor
// =============================================================
import { speaker, listener } from './speech.js';
import { fb, unlockAudio, startThinkingTicks } from './feedback.js';
import { CameraSource, FileSource } from './imageSource.js';
import { checkQuality, detectCutEdges, QUALITY_MESSAGES } from './quality.js';
import { parseCommand, normalize, HELP_TEXT } from './commands.js';
import { askAI, errorMessage } from './api.js';
import { diag } from './diag.js';

// ---------- Ekran öğeleri ----------
const $ = (id) => document.getElementById(id);
const el = {
  start: $('startScreen'), app: $('app'), capture: $('captureArea'), video: $('video'),
  status: $('status'), reply: $('reply'), srLive: $('srLive'),
  talk: $('btnTalk'), repeat: $('btnRepeat'), slow: $('btnSlow'), yes: $('btnYes'),
  solve: $('btnSolve'), answer: $('btnAnswer'), newq: $('btnNew'), stop: $('btnStop'), help: $('btnHelp'),
  form: $('textForm'), input: $('textInput'), file: $('fileInput'),
  rate: $('rate'), rateOut: $('rateOut'), autoListen: $('autoListen'), srMode: $('srMode'),
};

// ---------- Uygulama durumu ----------
const state = {
  phase: 'idle',
  page: null,       // okunan sayfa (bkz. READ_SCHEMA)
  questions: [],    // tam görünen sorular (sırayla sorulur)
  qIndex: 0,        // şu anki soru
  presentToken: 0,  // soru sunumu sırasında başka soruya geçilirse eskisini iptal etmek için
  userStopped: false, // öğrenci "dur" dedi / ekrana dokundu
  history: [],      // [{role, text}] — sayfa hakkındaki konuşma
  busy: false,      // modelden cevap bekleniyor mu?
};

const camera = new CameraSource(el.video);
const files = new FileSource();
let cameraOk = false;

// iPhone'da canlı kamera açılmazsa telefonun kamera uygulamasını açan gizli alan
const camInput = Object.assign(document.createElement('input'), { type: 'file', accept: 'image/*', hidden: true });
camInput.setAttribute('capture', 'environment');
document.body.appendChild(camInput);

// ---------- Ayarlar (tarayıcıda hatırlanır) ----------
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const settings = loadSettings();
el.rate.value = settings.rate; el.rateOut.textContent = Number(settings.rate).toFixed(1);
el.autoListen.checked = settings.autoListen && listener.supported;
el.autoListen.disabled = !listener.supported;
el.srMode.checked = settings.srMode;
speaker.rate = Number(settings.rate);
speaker.muted = settings.srMode;

function loadSettings() {
  const def = { rate: 1.0, autoListen: true, srMode: false }; // sürekli dinleme her cihazda varsayılan
  try { return { ...def, ...JSON.parse(localStorage.getItem('ayarlar') || '{}') }; } catch { return def; }
}
function saveSettings() {
  try {
    localStorage.setItem('ayarlar', JSON.stringify({
      rate: speaker.rate, autoListen: el.autoListen.checked, srMode: el.srMode.checked,
    }));
  } catch { /* gizli sekmede kaydedilemeyebilir, sorun değil */ }
}

// ---------- Konuşma ve ekran yardımcıları ----------
function setStatus(text) { el.status.textContent = text; }

/** Asistanın asıl cevabı: ekrana büyük yazar, sesli okur, gerekirse dinlemeye geçer */
// (Sürekli dinleme açıksa, okuma bitince mikrofon kendiliğinden açılır — bkz. listenLoop)
async function reply(text) {
  el.reply.textContent = text;
  if (speaker.muted) el.srLive.textContent = text; // ekran okuyucu okusun
  await speaker.say(text);
  listenLoop();
}

/** Kısa bilgi mesajı (tekrar et ile tekrarlanmaz) */
function notice(text) {
  setStatus(text);
  return speaker.say(text, { remember: false });
}

// Sesli okuma çalışmıyorsa (ör. telefonda Türkçe ses paketi yok) görünür uyarı + titreşim
// (Asistanın cevabı ekranda kalır; uyarı ayrı bir şerit olarak en üstte görünür.)
speaker.onBroken = () => {
  fb.error();
  const warn = $('ttsWarn');
  warn.textContent = '⚠️ SESLİ OKUMA ÇALIŞMIYOR: Telefonda Türkçe ses yok. ' +
    'Ayarlar → Sistem → Diller ve giriş → Gelişmiş → Metin okuma çıkışı → ' +
    'Tercih edilen motor: "Google Konuşma Hizmetleri" → ⚙️ → Ses verilerini yükle → Türkçe. ' +
    'Sonra Chrome\'u tamamen kapatıp yeniden aç.';
  warn.hidden = false;
};

let beepBeforeListen = true; // asistan konuştuktan sonra dinlemeye geçerken kısa bip
speaker.onChange = (on) => {
  el.capture.classList.toggle('speaking', on);
  // Asistan konuşurken mikrofonu kapat: yoksa kendi sesini öğrencinin sözü sanar
  if (on) { listener.stop(); beepBeforeListen = true; }
};
listener.onChange = (on) => {
  el.capture.classList.toggle('listening', on);
  el.talk.classList.toggle('listening', on);
  el.talk.textContent = on ? '👂 Dinliyorum…' : '🎤 Konuş';
};

// ---------- Başlangıç ----------
el.start.addEventListener('click', async () => {
  // Ses ve kamera ancak dokunuştan sonra açılabilir
  unlockAudio();
  speaker.unlock();
  el.start.hidden = true;
  el.app.hidden = false;
  requestWakeLock();

  if (!speaker.supported) setStatus('Bu tarayıcı sesli okumayı desteklemiyor. Yazılar ekranda görünecek.');
  diag('basla', {
    sesliOkuma: speaker.supported, sesTanima: listener.supported, ses: speaker.voiceName, sesSayisi: speaker.voiceCount,
    surekliDinle: el.autoListen.checked, ekranOkuyucuModu: speaker.muted, ekran: `${innerWidth}x${innerHeight}`,
  });
  setTimeout(() => diag('sesler', { ses: speaker.voiceName, sesSayisi: speaker.voiceCount, diller: speaker.voiceLangs }), 3000);

  try {
    await camera.start();
    cameraOk = true;
    diag('kamera', { ok: true, w: el.video.videoWidth, h: el.video.videoHeight });
  } catch (err) {
    cameraOk = false;
    diag('kamera', { ok: false, e: err.name || err.code });
    const msg = err.name === 'NotAllowedError'
      ? 'Kamera izni verilmedi. Ekrana dokununca telefonun kamera uygulaması açılacak. İstersen ayarlardan galeriden görsel de yükleyebilirsin.'
      : 'Canlı kamera açılamadı. Ekrana dokununca telefonun kamera uygulaması açılacak.';
    await reply(msg);
  }

  const micNote = listener.supported
    ? 'Seni sürekli dinliyorum; fotoğraf için çek de diyebilirsin. Ben konuşurken susmamı istersen ekrana dokun. Komutları öğrenmek için yardım de.'
    : 'Bu tarayıcıda sesli komut çalışmıyor. Ekrandaki butonları veya yazı kutusunu kullanabilirsin.';
  await reply(
    'Merhaba! Ben matematik asistanınım. Matematik sayfasını telefonun altına koy. ' +
    'Ekranın herhangi bir yerine dokununca fotoğrafını çekerim. ' + micNote,
  );
});

// Ekranın kapanmasını engelle (gösterim sırasında)
async function requestWakeLock() {
  try { await navigator.wakeLock?.request('screen'); } catch { /* desteklenmiyorsa sorun değil */ }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { requestWakeLock(); listenLoop(); } });

// ---------- Fotoğraf çekme ----------
el.capture.addEventListener('click', () => {
  // Konuşurken dokunmak = sustur
  if (speaker.speaking) { state.userStopped = true; speaker.stop(); setStatus('Sustum. Fotoğraf için tekrar dokun.'); return; }
  takePhoto();
});

async function takePhoto() {
  if (state.busy) return notice('Bekle, hâlâ düşünüyorum.');
  listener.stop();
  if (!cameraOk || !camera.ready) { camInput.click(); return; } // yedek: telefonun kamera uygulaması
  try {
    const shot = await camera.capture();
    await processImage(shot, { strict: true });
  } catch {
    camInput.click();
  }
}

camInput.addEventListener('change', async () => {
  const f = camInput.files?.[0]; camInput.value = '';
  if (f) await processImage(await files.captureFile(f), { strict: true });
});

el.file.addEventListener('change', async () => {
  const f = el.file.files?.[0]; el.file.value = '';
  if (!f) return;
  try {
    await processImage(await files.captureFile(f), { strict: false });
  } catch {
    fb.error(); await reply('Bu dosyayı açamadım. Başka bir görsel dene.');
  }
});

/**
 * Görüntüyü kontrol eder ve modele okutur.
 * strict=true → kamera fotoğrafı: kötü kaliteliyse hiç göndermez (kotayı korur)
 * strict=false → galeri: sadece çok karanlıksa uyarır
 */
async function processImage({ canvas, base64 }, { strict }) {
  const q = checkQuality(canvas);
  diag('foto', { kaynak: strict ? 'kamera' : 'galeri', w: canvas.width, h: canvas.height, ...q, kb: Math.round(base64.length * 0.75 / 1024) });
  if (!q.ok && (strict || q.problem === 'dark')) {
    fb.error();
    await reply(QUALITY_MESSAGES[q.problem]);
    return;
  }

  // Yapay zekâdan bağımsız ikinci kontrol: kenarlarda yarım kalmış yazı var mı?
  const pixelCut = detectCutEdges(canvas);
  fb.shutter();
  const res = await callAI({ mode: 'read', image: base64 }, 'Fotoğraf çekildi. Sayfayı okuyorum, biraz bekle.');
  if (!res) return;
  if (res.page) res.page.pikselKesik = pixelCut;
  diag('kenar-kontrol', { piksel: pixelCut.join(',') || '-', model: (res.page?.kesikKenarlar || []).join(',') || '-' });
  handlePage(res.page);
}

/** Model sayfayı okuduktan sonra */
const ORDINALS = ['Birinci', 'İkinci', 'Üçüncü', 'Dördüncü', 'Beşinci', 'Altıncı', 'Yedinci', 'Sekizinci', 'Dokuzuncu', 'Onuncu',
  'On birinci', 'On ikinci', 'On üçüncü', 'On dördüncü', 'On beşinci'];
const ordinal = (i) => ORDINALS[i] || `${i + 1}.`;
// Okunuşun başındaki "Beşinci soru." / "Soru 5:" / "Soru beş." / "5. soru" kalıbı (uygulama numarayı kendisi söyler)
const NUMWORD = '(?:\\d+\\.?|bir|iki|üç|dört|beş|altı|yedi|sekiz|dokuz|on(?: \\S+)?|yirmi(?: \\S+)?|otuz(?: \\S+)?)';
const ORDWORD = '(?:\\S*(?:inci|ıncı|uncu|üncü|nci|ncı|ncu|ncü)|ilk)';
const LEADING_NO = new RegExp(`^\\s*(?:soru\\s+${NUMWORD}|${ORDWORD}\\s+soru|\\d+\\.?\\s+soru)\\s*[.:,]?\\s*`, 'i');
// İlk soruda tüm seçenekleri hatırlat; sonrakilerde kısa tut (asistanın kendi sesi mikrofona
// kaçarsa komut sanılmasın diye komut kelimelerini mümkün olduğunca az söylüyoruz)
const CLOSING_FIRST = 'Acele etme, düşünmek için zamanın var. Hazır olduğunda hazırım de, sonra cevabını söyle. ' +
  'Anlamadığın yer olursa anlamadım de. Çözümü dinlemek istersen bana söylemen yeterli.';
const CLOSING = 'Acele etme. Hazır olduğunda hazırım de.';

/**
 * Model sayfayı okuduktan sonra.
 * @param {object} page  okunan sayfa (bkz. lib/prompts.js READ_SCHEMA)
 * @param {{keepIndex?:boolean}} opts  düzeltmeden sonra aynı soruda kal
 */
/**
 * Kesik kenarlara göre telefonun nasıl hareket ettirileceğini söyler.
 * Cümleyi model değil uygulama kurar: her seferinde aynı, net ve çelişkisiz olsun.
 */
function guidanceFor(sides = []) {
  const s = new Set((sides || []).filter((x) => ['ust', 'alt', 'sol', 'sag'].includes(x)));
  const fit = 'Sayfa kadraja sığmıyor. Telefonu sayfadan biraz uzaklaştır, yani biraz yukarı kaldır.';
  if (!s.size) return fit;
  if ((s.has('sol') && s.has('sag')) || (s.has('ust') && s.has('alt')) || s.size >= 3) return fit;
  const names = { ust: 'üst', alt: 'alt', sol: 'sol', sag: 'sağ' };
  const moves = { sag: 'biraz sağa kaydır', sol: 'biraz sola kaydır', alt: 'biraz kendine doğru çek', ust: 'biraz ileri, sayfanın üstüne doğru it' };
  const list = [...s];
  return `Sayfanın ${list.map((x) => names[x]).join(' ve ')} tarafı kesik. Telefonu ${list.map((x) => moves[x]).join(', sonra ')}.`;
}

/**
 * Model sayfayı okuduktan sonra.
 * @param {object} page  okunan sayfa (bkz. lib/prompts.js READ_SCHEMA)
 * @param {{keepIndex?:boolean}} opts  düzeltmeden sonra aynı soruda kal
 */
async function handlePage(page, { keepIndex = false, ignoreCut = false } = {}) {
  if (!page || page.okunabilir === false) {
    state.phase = state.page ? state.phase : 'idle';
    const guide = page?.kesikKenarlar?.length ? guidanceFor(page.kesikKenarlar) : (page?.not || 'Sayfayı okuyamadım.');
    await reply(guide + ' Sonra tekrar dokun ya da çek de.');
    return;
  }

  // ÇOK ÖNEMLİ: Sayfa tam görünmüyorsa görünen kısımla HİÇBİR ŞEY yapma (okuma, çözme, anlatma).
  // Sadece telefonun nasıl kaydırılacağını söyle ve yeni fotoğrafı bekle.
  // Kesik kenarlar: telefonun piksel kontrolü bir kenar bulduysa onu esas al (daha kesin);
  // bulamadıysa (ör. kenarda masa görünüyor) yapay zekânın söylediğini kullan.
  const cutSides = page.pikselKesik?.length ? page.pikselKesik : (page.kesikKenarlar || []);
  const someCut = Array.isArray(page.sorular) && page.sorular.some((q) => q && q.tam === false);
  if (!ignoreCut && (page.kesik || cutSides.length || someCut)) {
    state.phase = state.page ? state.phase : 'idle';
    state.lastCutPage = page; // öğrenci "yine de devam" derse sadece tam soruları okumak için
    diag('kesik', { kenarlar: cutSides.join(',') || '-', kesikSoru: someCut });
    return reply(`Sayfanın tamamı görünmüyor. ${guidanceFor(cutSides)} Sonra tekrar dokun ya da çek de.`);
  }
  state.lastCutPage = null;

  // Görme engelli öğrenci sayfayı göremediği için "doğru okudum mu?" diye SORMUYORUZ.
  // Asistan emin olmadığı yerleri kendisi söyler.
  const note = page.not ? ` ${page.not}` : '';

  if (page.tur === 'konu') {
    state.page = page; state.questions = []; state.history = [];
    state.phase = 'explain';
    await speaker.say(`Bu bir konu anlatımı sayfası.${note} Konuyu anlatıyorum.`, { remember: false });
    return talk('explain', 'Bu sayfadaki konuyu bana anlatmaya başla.');
  }

  // Soru sayfası: soruları sırayla sor (yarım/kesik sorular ASLA okunmaz)
  let all = Array.isArray(page.sorular) ? page.sorular.filter((q) => q && q.okunus && q.tam !== false) : [];
  if (!all.length && page.okunus) all = [{ no: '1', tam: true, metin: page.metin, okunus: page.okunus }];
  if (!all.length) {
    state.phase = state.page ? state.phase : 'idle';
    return reply('Bu sayfada soru bulamadım. Sayfayı tekrar çekmeyi dene.');
  }

  const prevIndex = state.qIndex;
  state.page = page;
  state.questions = all;
  let intro = all.length > 1 ? `Bu sayfada ${all.length} soru var. Sırayla gideceğiz.` : 'Bu bir soru.';
  if (page.ortakOkunus) intro += ` Önce birkaç soruyu ilgilendiren ortak bilgiyi okuyorum: ${page.ortakOkunus}`;
  return presentQuestion(keepIndex ? Math.min(prevIndex, all.length - 1) : 0, intro + note);
}

/**
 * Soruyu öğrenciye sunar:
 *  1) Soruyu hemen okur (okunuş sayfa okumada hazırlandı).
 *  2) Aynı anda, arka planda o sorunun açıklamasını ister (mode: question).
 *  3) Okuma bitince açıklamayı söyler, sonra "Hazır olduğunda hazırım de."
 * Böylece çok sorulu sayfalarda tek seferde uzun cevap beklenmez.
 */
async function presentQuestion(i, prefix = '') {
  const q = state.questions[i];
  if (!q) return;
  const token = ++state.presentToken;
  state.qIndex = i;
  state.phase = 'question';
  state.userStopped = false;

  // Sayfadaki gerçek numarayı söyle ("Soru 7"); model okunuşa numara eklediyse onu sil (tekrar olmasın)
  let head = q.no ? `Soru ${q.no}. ` : (state.questions.length > 1 ? `${ordinal(i)} soru. ` : '');
  // Öğrenci hangi konuda olduğunu bilsin: "Bu soru ... ünitesinden, ... konusuyla ilgili."
  if (q.unite) head += `Bu soru ${q.unite} ünitesinden${q.konu ? `, ${q.konu} konusuyla ilgili` : ''}. `;
  const body = String(q.okunus).replace(LEADING_NO, '');
  const readText = `${prefix ? prefix + ' ' : ''}${head}${body}`.trim();

  // Açıklamayı arka planda iste (okuma sürerken hazırlanır)
  state.busy = true; // okuma + açıklama bitene kadar mikrofon kapalı
  el.capture.classList.add('busy');
  let settled = false;
  const explainP = askAI({ mode: 'question', message: 'Bu soruyu bana açıkla.', pageText: contextFor(i), history: [] })
    .then((r) => r.reply)
    .catch((err) => { diag('aciklama-hata', { kod: err.code }); return null; })
    .finally(() => { settled = true; });

  el.reply.textContent = readText;
  await speaker.say(readText);
  if (token !== state.presentToken) return; // bu arada başka soruya geçildi

  let stopTicks = null;
  if (!settled && !state.userStopped) {
    notice('Şimdi soruyu açıklıyorum, biraz bekle.');
    stopTicks = startThinkingTicks((m) => { if (!speaker.speaking) notice(m); });
  }
  const explanation = await explainP;
  stopTicks?.();
  state.busy = false;
  el.capture.classList.remove('busy');
  if (token !== state.presentToken) return;

  const closing = state.closingSaid ? CLOSING : CLOSING_FIRST;
  state.closingSaid = true;
  const rest = [explanation, closing].filter(Boolean).join(' ');
  state.history = [
    { role: 'user', text: 'Soruyu bana anlat.' },
    { role: 'model', text: `${body} ${explanation || ''}`.trim() },
  ];
  el.reply.textContent = `${readText} ${rest}`;
  if (speaker.muted) el.srLive.textContent = el.reply.textContent;
  if (!state.userStopped) await speaker.say(rest);
  speaker.lastText = `${readText} ${rest}`; // "tekrar et" tamamını tekrarlasın
  listenLoop();
}

/** Modele gönderilecek bağlam: konu sayfasında tüm metin, soru sayfasında ortak bilgi + o soru */
function contextFor(i) {
  const p = state.page;
  if (!p) return '';
  const q = state.questions?.[i];
  if (!q) return p.metin || '';
  return (p.ortakBilgi ? `Ortak bilgi: ${p.ortakBilgi}\n` : '') +
    (q.unite ? `Ünite: ${q.unite}${q.konu ? ` (konu: ${q.konu})` : ''}\n` : '') + `Soru ${q.no}: ${q.metin}`;
}
function currentContext() { return contextFor(state.qIndex); }

function moreQuestions() {
  return state.questions && state.qIndex < state.questions.length - 1;
}

// ---------- Yapay zekâya istek (bekleme sesleri ve hatalarla birlikte) ----------
async function callAI(payload, waitingText = 'Düşünüyorum.') {
  if (state.busy) { notice('Bekle, hâlâ düşünüyorum.'); return null; }
  state.busy = true;
  el.capture.classList.add('busy');
  fb.thinking();
  notice(waitingText);
  const stopTicks = startThinkingTicks((m) => { if (!speaker.speaking) notice(m); });

  try {
    const res = await askAI(payload, {
      onWait: (sec, attempt, code) => {
        const why = code === 'OVERLOADED' ? 'Yapay zekâ şu an yoğun.' : 'Çok fazla istek oldu.';
        notice(`${why} Biraz bekle, ${sec} saniye sonra kendiliğimden tekrar deneyeceğim.`);
      },
    });
    fb.ready();
    setStatus('Hazır');
    return res;
  } catch (err) {
    console.warn(err);
    fb.error();
    setStatus('Hata');
    await reply(errorMessage(err));
    return null;
  } finally {
    stopTicks();
    state.busy = false;
    el.capture.classList.remove('busy');
  }
}

/** Sayfa bağlamında sohbet modları (explain, question, check, solve, free) */
async function talk(mode, message) {
  const res = await callAI({
    mode,
    message,
    pageText: currentContext(),
    history: state.history,
  });
  if (!res) return;
  state.history.push({ role: 'user', text: message }, { role: 'model', text: res.reply });
  let text = res.reply;
  // Doğru cevaptan veya çözümden sonra, sayfada başka soru varsa nasıl geçileceğini söyle
  // Doğruluğu model [DOĞRU]/[YANLIŞ] etiketiyle bildirir (sunucu ayırır); cümleden tahmin YAPMIYORUZ
  const correct = mode === 'check' && res.correct === true;
  if ((correct || mode === 'solve') && moreQuestions()) text += ' Sıradaki soruya geçmek için sıradaki soru de.';
  else if ((correct || mode === 'solve') && state.questions?.length > 1) text += ' Bu sayfadaki son soruydu. Yeni sayfa için yeni soru de.';
  await reply(text);
}

async function correctPage(correction) {
  const res = await callAI({ mode: 'correct', pageText: state.page?.metin || '', message: 'Öğrencinin düzeltmesi: ' + correction });
  if (res) handlePage(res.page, { keepIndex: true });
}


// ---------- Komutları işleme ----------
/**
 * Duyulan söz, asistanın son söylediklerinin bir parçası mı? (hoparlörden mikrofona kaçan ses)
 * Kısa komutlar ("evet", "hazırım") asistanın cümlelerinde de geçebildiği için sadece
 * 3+ kelimelik ve büyük ölçüde örtüşen sözler yankı sayılır.
 */
function isEcho(raw) {
  const words = normalize(raw).split(' ').filter(Boolean);
  if (!words.length) return false;
  const spoken = ' ' + normalize(speaker.recentSpoken) + ' ';
  // Kısa yankı: asistanın son cümlesinin SON kelimeleriyle birebir aynı ve konuşma biter bitmez duyulduysa
  // (ör. "…hazırım de" → mikrofon "hazırım de" duydu). Öğrencinin kendi "hazırım"ı bununla eşleşmez.
  if (Date.now() - speaker.lastSpeechEndAt < 10000 && spoken.trimEnd().endsWith(' ' + words.join(' '))) return true;
  if (words.length < 3) return false;
  if (spoken.includes(' ' + words.join(' ') + ' ')) return true;
  const spokenWords = new Set(spoken.split(' '));
  const overlap = words.filter((w) => spokenWords.has(w)).length / words.length;
  return overlap >= 0.8 && Date.now() - speaker.lastSpokeAt < 60000;
}

/**
 * @param {string} raw  söylenen veya yazılan metin
 * @param {{voice?:boolean}} opts  voice=true → mikrofondan geldi (gürültü filtresi uygulanır)
 */
async function handleInput(raw, { voice = false } = {}) {
  // YANKI FİLTRESİ: mikrofon asistanın kendi sözünü duyduysa yok say
  if (voice && isEcho(raw)) {
    diag('yanki', { kelime: raw.trim().split(/\s+/).length });
    setStatus('Dinliyorum…');
    return;
  }
  const cmd = parseCommand(raw);
  if (cmd.type === 'empty') return;
  diag('komut', { tur: cmd.type, kaynak: voice ? 'ses' : 'yazi/buton', asama: state.phase, kelime: raw.trim().split(/\s+/).length });
  setStatus('Duyduğum: ' + raw);

  // Cevap bekleniyorsa söylenen şey (komut değilse) öğrencinin cevabıdır
  if (state.phase === 'awaitAnswer' && ['free', 'yes', 'no', 'continue', 'answer'].includes(cmd.type)) {
    const answer = cmd.type === 'answer' ? cmd.arg : raw;
    if (!answer) return reply('Seni dinliyorum. Cevabını söyle.');
    state.phase = 'question';
    return talk('check', 'Öğrencinin cevabı: ' + answer);
  }

  // Öğrenci düşünürken kendi kendine söylediği tek kelimeleri yapay zekâya gönderme
  // (ücretsiz istek hakkını korur). Komutlar ve cevaplar bundan etkilenmez.
  if (voice && cmd.type === 'free' && !['correcting'].includes(state.phase) && raw.trim().split(/\s+/).length < 2) {
    setStatus('Anlamadım: "' + raw + '". Komutlar için yardım de.');
    return;
  }

  // Bekleme aşamalarında söylenen şey doğrudan o işe gider
  if (state.phase === 'correcting' && ['free', 'no'].includes(cmd.type)) {
    return correctPage(cmd.arg || raw);
  }

  switch (cmd.type) {
    case 'stop':
      state.userStopped = true;
      speaker.stop(); listener.stop(); setStatus('Durdum.');
      return;
    case 'capture':
      return takePhoto();
    case 'repeat':
      return speaker.lastText ? reply(speaker.lastText) : notice('Henüz tekrar edecek bir şey söylemedim.');
    case 'slow':
      setRate(Math.max(0.5, speaker.rate - 0.2));
      return speaker.lastText ? reply(speaker.lastText) : notice('Bundan sonra daha yavaş okuyacağım.');
    case 'fast':
      setRate(Math.min(1.6, speaker.rate + 0.2));
      return notice('Bundan sonra daha hızlı okuyacağım.');
    case 'help':
      return reply(HELP_TEXT);
    case 'newq':
      state.presentToken++; state.busy = false;
      state.page = null; state.history = []; state.questions = []; state.qIndex = 0; state.phase = 'idle'; state.closingSaid = false;
      el.reply.textContent = '';
      return reply('Tamam, yeni soruya geçiyoruz. Sayfayı yerleştir ve ekrana dokun ya da çek de.');
    case 'yes':
    case 'continue':
      if (state.phase === 'explainOffer') {
        state.phase = 'explain';
        return talk('explain', 'Bu sayfanın görünen kısmındaki konuyu bana anlatmaya başla.');
      }
      if (state.phase === 'explain') return talk('explain', 'Devam et.');
      // Soru sayfasında "sonraki/devam" → sıradaki soru
      if (cmd.type === 'continue' && state.phase === 'question' && moreQuestions()) return presentQuestion(state.qIndex + 1);
      if (!state.page) return notice('Önce bir sayfanın fotoğrafını çekelim. Ekrana dokun.');
      return talk('free', raw);
    case 'forceContinue':
      // Kesik uyarısından sonra öğrenci isterse: SADECE tam görünen soruları oku
      if (!state.lastCutPage) return notice('Şu an devam edilecek bir sayfa yok.');
      await speaker.say('Tamam. Sadece tam görünen soruları okuyorum. Kenara yakın sorularda okuma hatası olabilir.', { remember: false });
      return handlePage(state.lastCutPage, { ignoreCut: true });
    case 'nextq':
      if (!state.questions?.length) return notice('Şu an soru yok. Bir soru sayfasının fotoğrafını çek.');
      if (!moreQuestions()) return reply('Bu sayfadaki son sorudaydık. Yeni sayfa için yeni soru de.');
      return presentQuestion(state.qIndex + 1);
    case 'prevq':
      if (!state.questions?.length) return notice('Şu an soru yok.');
      if (state.qIndex === 0) return reply('Zaten ilk sorudayız.');
      return presentQuestion(state.qIndex - 1);
    case 'gotoq': {
      if (!state.questions?.length) return notice('Şu an soru yok.');
      const n = state.questions.length;
      // Önce sayfadaki numaraya bak ("yedinci soru" → 7 numaralı soru), yoksa sıraya
      const byNo = state.questions.findIndex((q) => Number(q.no) === cmd.arg + 1);
      if (byNo >= 0) return presentQuestion(byNo);
      if (cmd.arg < 0 || cmd.arg >= n) {
        const nos = state.questions.map((q) => q.no).filter(Boolean).join(', ');
        return reply(`Bu sayfadaki sorular: ${nos || n + ' soru'}. Bunlardan birini söyle.`);
      }
      return presentQuestion(cmd.arg);
    }
    case 'explainAgain':
      if (!state.page) return notice('Önce bir sayfanın fotoğrafını çekelim. Ekrana dokun.');
      if (state.phase === 'awaitAnswer') state.phase = 'question';
      return talk('free', 'Soruyu anlamadım. Bana daha basit ve daha yavaş anlatır mısın? Ama ipucu verme, çözüm yolu söyleme.');
    case 'misread':
      // "yanlış okudun, x küp olacak" → düzelt; sadece "yanlış okudun" → düzeltmeyi sor
      if (!state.page) return notice('Önce bir sayfanın fotoğrafını çekelim.');
      if (cmd.arg) return correctPage(cmd.arg);
      state.phase = 'correcting';
      return reply('Neyi yanlış okudum? Doğrusunu söyle. Ya da yeniden çekmek için ekrana dokun veya çek de.');
    case 'no':
      if (state.phase === 'explain') {
        state.phase = 'question';
        return reply('Tamam, burada duruyorum. Sormak istediğin bir şey varsa sorabilirsin.');
      }
      return state.page ? talk('free', raw) : notice('Önce bir sayfanın fotoğrafını çekelim.');
    case 'solve':
      if (!state.page) return notice('Önce sorunun fotoğrafını çekmelisin. Ekrana dokun.');
      state.phase = 'question';
      return talk('solve', cmd.arg === 'gaveUp'
        ? 'Çözemedim, cevabı söyler misin? (Öğrencinin söylediği: ' + raw + ')'
        : 'Bu soruyu adım adım çöz.');
    case 'ready':
      if (!state.page) return reply('Önce sorunun fotoğrafını çekelim. Ekrana dokun ya da çek de.');
      state.phase = 'awaitAnswer';
      return reply('Tamam, seni dinliyorum. Cevabını söyle.');
    case 'answer':
      if (!state.page) return notice('Önce sorunun fotoğrafını çekmelisin. Ekrana dokun.');
      if (!cmd.arg) { state.phase = 'awaitAnswer'; return reply('Tamam, cevabını söyle.'); }
      state.phase = 'question';
      return talk('check', 'Öğrencinin cevabı: ' + cmd.arg);
    case 'free':
    default:
      return talk('free', cmd.arg || raw);
  }
}

// ---------- Dinleme ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let loopRunning = false;
let emptyListens = 0;

function handsFreeOn() {
  return el.autoListen.checked && listener.supported && !speaker.muted;
}

/**
 * SÜREKLİ DİNLEME (eller serbest): asistan susunca mikrofon kendiliğinden açılır,
 * söylenen her şey işlenir, sonra tekrar dinlenir. Buton gerekmez.
 * Asistan konuşurken veya düşünürken mikrofon kapalıdır.
 */
async function listenLoop() {
  if (loopRunning || !handsFreeOn()) return;
  loopRunning = true;
  let fails = 0;
  try {
    while (handsFreeOn()) {
      if (speaker.speaking || state.busy || document.visibilityState !== 'visible') { await sleep(250); continue; }
      // Asistan sustuktan hemen sonra dinlemeye başlama: Android'de ses hoparlörden
      // tam bitmeden "bitti" denebiliyor ve mikrofon asistanın kendi sesini duyuyor (yankı).
      if (beepBeforeListen) { await sleep(800); if (speaker.speaking) continue; fb.listen(); beepBeforeListen = false; await sleep(200); }
      setStatus('Dinliyorum…');
      const t0 = Date.now();
      try {
        const text = await listener.listenOnce();
        fails = 0;
        if (text) { emptyListens = 0; await handleInput(text, { voice: true }); }
        else {
          if (++emptyListens % 10 === 0) diag('dinleme-bos', { sayi: emptyListens, ms: Date.now() - t0 });
          if (Date.now() - t0 < 800) await sleep(800); // çok hızlı bittiyse biraz bekle
        }
      } catch (err) {
        diag('dinleme-dongu-hata', { e: err.code, sayi: fails + 1 });
        if (err.code === 'not-allowed' || err.code === 'service-not-allowed') {
          el.autoListen.checked = false; saveSettings(); fb.error();
          await speaker.say('Mikrofon izni verilmedi. Tarayıcı ayarlarından mikrofon iznini aç. O zamana kadar ekrandaki butonlar ve yazı kutusu kullanılabilir.');
          break;
        }
        if (++fails >= 5) {
          fb.error();
          await speaker.say(err.code === 'network'
            ? 'Ses tanıma için internet gerekiyor. Bağlantını kontrol et.'
            : 'Ses tanıma şu an çalışmıyor. Ekrana dokunup sayfayı yeniden açmayı dene.');
          break;
        }
        await sleep(1000 * fails);
      }
    }
  } finally {
    loopRunning = false;
  }
}

/** Sürekli dinleme kapalıyken Konuş butonu: bir kez dinler */
async function listenOnceManual() {
  if (state.busy) return notice('Bekle, hâlâ düşünüyorum.');
  if (!listener.supported) {
    el.input.focus();
    return notice('Bu tarayıcıda sesli komut çalışmıyor. Aşağıdaki kutuya yazabilir ya da klavyedeki mikrofonla söyleyebilirsin.');
  }
  speaker.stop();
  fb.listen();
  setStatus('Dinliyorum…');
  try {
    const text = await listener.listenOnce();
    if (text) await handleInput(text, { voice: true });
    else setStatus('Bir şey duymadım.');
  } catch (err) {
    fb.error();
    setStatus(err.code === 'not-allowed' ? 'Mikrofon izni verilmedi.' : 'Ses tanıma çalışmadı. Tekrar dene ya da yaz.');
  }
}

function setRate(r) {
  speaker.rate = Math.round(r * 10) / 10;
  el.rate.value = speaker.rate;
  el.rateOut.textContent = speaker.rate.toFixed(1);
  saveSettings();
}

// ---------- Butonlar ----------
el.talk.addEventListener('click', () => {
  if (handsFreeOn()) { speaker.stop(); listenLoop(); return; } // zaten dinliyor; konuşuyorsa sustur
  if (listener.active) listener.stop(); else listenOnceManual();
});
el.repeat.addEventListener('click', () => handleInput('tekrar et'));
el.slow.addEventListener('click', () => handleInput('yavaş oku'));
el.yes.addEventListener('click', () => handleInput('evet'));
el.solve.addEventListener('click', () => handleInput('çöz'));
el.answer.addEventListener('click', () => handleInput('cevabım'));
el.newq.addEventListener('click', () => handleInput('yeni soru'));
el.stop.addEventListener('click', () => handleInput('dur'));
el.help.addEventListener('click', () => handleInput('yardım'));

el.form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = el.input.value.trim();
  el.input.value = '';
  if (text) handleInput(text);
});

el.rate.addEventListener('input', () => setRate(Number(el.rate.value)));
el.rate.addEventListener('change', () => speaker.say('Okuma hızı bu şekilde.', { remember: false }));
el.autoListen.addEventListener('change', () => { saveSettings(); if (el.autoListen.checked) listenLoop(); else listener.stop(); });
el.srMode.addEventListener('change', () => {
  speaker.muted = el.srMode.checked;
  if (speaker.muted) { speaker.stop(); listener.stop(); }
  saveSettings();
  listenLoop();
});

// İnternet bağlantısı değişince haber ver
window.addEventListener('offline', () => { fb.error(); notice('İnternet bağlantısı kesildi.'); });
window.addEventListener('online', () => notice('İnternet bağlantısı geri geldi.'));

// =============================================================
// ANA UYGULAMA — akışı yönetir
//
// Aşamalar (phase):
//   idle        → sayfa yok, fotoğraf bekleniyor
//   confirm     → okunan metin söylendi, "Doğru anladım mı?" cevabı bekleniyor
//   correcting  → öğrencinin düzeltmesi bekleniyor
//   explain     → konu anlatımı sürüyor ("devam" bekleniyor)
//   question    → soru anlatıldı; cevap, "çöz" veya serbest soru bekleniyor
//   awaitAnswer → "cevabım" dendi, cevabın kendisi bekleniyor
// =============================================================
import { speaker, listener } from './speech.js';
import { fb, unlockAudio, startThinkingTicks } from './feedback.js';
import { CameraSource, FileSource } from './imageSource.js';
import { checkQuality, QUALITY_MESSAGES } from './quality.js';
import { parseCommand, HELP_TEXT } from './commands.js';
import { askAI, errorMessage } from './api.js';

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
  page: null,       // { metin, okunus, tur, not }
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
  const def = { rate: 1.0, autoListen: !isIOS, srMode: false };
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
async function reply(text, { listenAfter = true } = {}) {
  el.reply.textContent = text;
  if (speaker.muted) el.srLive.textContent = text; // ekran okuyucu okusun
  await speaker.say(text);
  if (listenAfter) maybeAutoListen();
}

/** Kısa bilgi mesajı (tekrar et ile tekrarlanmaz) */
function notice(text) {
  setStatus(text);
  return speaker.say(text, { remember: false });
}

speaker.onChange = (on) => el.capture.classList.toggle('speaking', on);
listener.onChange = (on) => {
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

  try {
    await camera.start();
    cameraOk = true;
  } catch (err) {
    cameraOk = false;
    const msg = err.name === 'NotAllowedError'
      ? 'Kamera izni verilmedi. Ekrana dokununca telefonun kamera uygulaması açılacak. İstersen ayarlardan galeriden görsel de yükleyebilirsin.'
      : 'Canlı kamera açılamadı. Ekrana dokununca telefonun kamera uygulaması açılacak.';
    await reply(msg, { listenAfter: false });
  }

  const micNote = listener.supported ? 'Konuşmak için Konuş butonuna bas.' : 'Bu tarayıcıda sesli komut yok; büyük butonları veya yazmayı kullanabilirsin.';
  await reply(
    'Merhaba! Ben matematik asistanınım. Matematik sayfasını telefonun altına koy ve ekranın üst yarısına dokun, fotoğrafını çekeyim. ' + micNote,
    { listenAfter: true },
  );
});

// Ekranın kapanmasını engelle (gösterim sırasında)
async function requestWakeLock() {
  try { await navigator.wakeLock?.request('screen'); } catch { /* desteklenmiyorsa sorun değil */ }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') requestWakeLock(); });

// ---------- Fotoğraf çekme ----------
el.capture.addEventListener('click', () => {
  // Konuşurken dokunmak = sustur
  if (speaker.speaking) { speaker.stop(); setStatus('Sustum. Fotoğraf için tekrar dokun.'); return; }
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
    fb.error(); await reply('Bu dosyayı açamadım. Başka bir görsel dene.', { listenAfter: false });
  }
});

/**
 * Görüntüyü kontrol eder ve modele okutur.
 * strict=true → kamera fotoğrafı: kötü kaliteliyse hiç göndermez (kotayı korur)
 * strict=false → galeri: sadece çok karanlıksa uyarır
 */
async function processImage({ canvas, base64 }, { strict }) {
  const q = checkQuality(canvas);
  console.log('Fotoğraf kalitesi', q);
  if (!q.ok && (strict || q.problem === 'dark')) {
    fb.error();
    await reply(QUALITY_MESSAGES[q.problem], { listenAfter: false });
    return;
  }

  fb.shutter();
  const res = await callAI({ mode: 'read', image: base64 }, 'Fotoğraf çekildi. Sayfayı okuyorum, biraz bekle.');
  if (!res) return;
  handlePage(res.page);
}

/** Model sayfayı okuduktan sonra */
async function handlePage(page) {
  if (!page || page.okunabilir === false) {
    state.phase = state.page ? state.phase : 'idle';
    await reply((page?.not || 'Sayfayı okuyamadım.') + ' Lütfen tekrar çek.', { listenAfter: false });
    return;
  }
  state.page = page;
  state.history = [];
  state.phase = 'confirm';
  const kind = page.tur === 'konu' ? 'Bu bir konu anlatımı.' : page.tur === 'soru' ? 'Bu bir soru.' : '';
  const note = page.not ? ' Not: ' + page.not : '';
  await reply(`${kind} Okuduğum metin şöyle: ${page.okunus}${note} Doğru anladım mı? Evet ya da hayır de.`);
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
    await reply(errorMessage(err), { listenAfter: false });
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
    pageText: state.page?.metin || '',
    history: state.history,
  });
  if (!res) return;
  state.history.push({ role: 'user', text: message }, { role: 'model', text: res.reply });
  await reply(res.reply);
}

async function correctPage(correction) {
  const res = await callAI({ mode: 'correct', pageText: state.page?.metin || '', message: 'Öğrencinin düzeltmesi: ' + correction });
  if (res) handlePage(res.page);
}

// Onaydan sonra moda göre başla
function proceed() {
  if (state.page?.tur === 'konu') {
    state.phase = 'explain';
    return talk('explain', 'Konuyu bana anlatmaya başla.');
  }
  state.phase = 'question';
  return talk('question', 'Soruyu bana anlat.');
}

// ---------- Komutları işleme ----------
async function handleInput(raw) {
  const cmd = parseCommand(raw);
  if (cmd.type === 'empty') return;
  setStatus('Duyduğum: ' + raw);

  // Bekleme aşamalarında söylenen şey doğrudan o işe gider
  if (state.phase === 'correcting' && ['free', 'no'].includes(cmd.type)) {
    return correctPage(cmd.arg || raw);
  }
  if (state.phase === 'awaitAnswer' && cmd.type === 'free') {
    state.phase = 'question';
    return talk('check', 'Öğrencinin cevabı: ' + raw);
  }

  switch (cmd.type) {
    case 'stop':
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
      state.page = null; state.history = []; state.phase = 'idle';
      el.reply.textContent = '';
      return reply('Tamam, yeni soruya geçiyoruz. Sayfayı yerleştir ve ekrana dokun ya da çek de.', { listenAfter: false });
    case 'yes':
    case 'continue':
      if (state.phase === 'confirm') return proceed();
      if (state.phase === 'explain') return talk('explain', 'Devam et.');
      if (!state.page) return notice('Önce bir sayfanın fotoğrafını çekelim. Ekrana dokun.');
      return talk('free', raw);
    case 'no':
      if (state.phase === 'confirm') {
        if (cmd.arg) return correctPage(cmd.arg);
        state.phase = 'correcting';
        return reply('Neyi yanlış okudum? Doğrusunu söyle. Ya da yeniden çekmek için ekrana dokun.');
      }
      return state.page ? talk('free', raw) : notice('Önce bir sayfanın fotoğrafını çekelim.');
    case 'solve':
      if (!state.page) return notice('Önce sorunun fotoğrafını çekmelisin. Ekrana dokun.');
      state.phase = 'question';
      return talk('solve', 'Bu soruyu adım adım çöz.');
    case 'answer':
      if (!state.page) return notice('Önce sorunun fotoğrafını çekmelisin. Ekrana dokun.');
      if (!cmd.arg) { state.phase = 'awaitAnswer'; return reply('Tamam, cevabını söyle.'); }
      state.phase = 'question';
      return talk('check', 'Öğrencinin cevabı: ' + cmd.arg);
    case 'free':
    default:
      if (state.phase === 'confirm') state.phase = 'question'; // onay vermeden soru sordu
      return talk('free', cmd.arg || raw);
  }
}

// ---------- Dinleme ----------
async function listen() {
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
    if (text) await handleInput(text);
    else setStatus('Bir şey duymadım. Konuş butonuna tekrar bas.');
  } catch (err) {
    fb.error();
    if (err.code === 'not-allowed' || err.code === 'service-not-allowed') {
      el.autoListen.checked = false; saveSettings();
      await reply('Mikrofon izni verilmedi. Butonları kullanabilir ya da yazabilirsin. İzni tarayıcı ayarlarından açabilirsin.', { listenAfter: false });
    } else if (err.code === 'network') {
      await reply('Ses tanıma için internet gerekiyor. Bağlantını kontrol et.', { listenAfter: false });
    } else {
      setStatus('Ses tanıma çalışmadı. Tekrar dene ya da yaz.');
    }
  }
}

function maybeAutoListen() {
  if (el.autoListen.checked && listener.supported && !state.busy && !speaker.muted && document.visibilityState === 'visible') {
    listen();
  }
}

function setRate(r) {
  speaker.rate = Math.round(r * 10) / 10;
  el.rate.value = speaker.rate;
  el.rateOut.textContent = speaker.rate.toFixed(1);
  saveSettings();
}

// ---------- Butonlar ----------
el.talk.addEventListener('click', () => (listener.active ? listener.stop() : listen()));
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
el.autoListen.addEventListener('change', saveSettings);
el.srMode.addEventListener('change', () => {
  speaker.muted = el.srMode.checked;
  if (speaker.muted) speaker.stop();
  saveSettings();
});

// İnternet bağlantısı değişince haber ver
window.addEventListener('offline', () => { fb.error(); notice('İnternet bağlantısı kesildi.'); });
window.addEventListener('online', () => notice('İnternet bağlantısı geri geldi.'));

// =============================================================
// Titreşim ve kısa bip sesleri (ekrana bakmadan ne olduğunu anlamak için)
// Not: iPhone tarayıcıları titreşimi desteklemez; orada sadece ses olur.
// =============================================================

let audioCtx = null;

export function unlockAudio() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch { /* ses yoksa sorun değil */ }
}

export function vibrate(pattern) {
  try { navigator.vibrate?.(pattern); } catch { /* desteklenmiyor */ }
}

/** Kısa bir bip sesi çalar */
export function beep(freq = 660, ms = 120, volume = 0.15) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + ms / 1000);
    osc.stop(audioCtx.currentTime + ms / 1000 + 0.02);
  } catch { /* yoksay */ }
}

// Hazır geri bildirimler
export const fb = {
  shutter() { vibrate(80); beep(900, 80); },               // fotoğraf çekildi
  thinking() { vibrate([40, 60, 40]); },                     // düşünüyorum
  ready() { vibrate([60, 40, 120]); beep(880, 90); setTimeout(() => beep(1175, 120), 110); }, // hazır
  listen() { vibrate(40); beep(520, 100); },                 // dinliyorum
  error() { vibrate([200, 100, 200]); beep(220, 300, 0.2); },// hata
};

/**
 * Model düşünürken sessiz kalmamak için düzenli "tık" sesi + ara ara sözlü bilgi.
 * @param {(msg:string)=>void} sayFn  sözlü mesaj fonksiyonu
 * @returns {()=>void} durdurma fonksiyonu
 */
export function startThinkingTicks(sayFn) {
  let n = 0;
  const id = setInterval(() => {
    n++;
    if (n % 6 === 0) sayFn('Hâlâ düşünüyorum, biraz daha bekle.');
    else beep(440, 60, 0.08);
  }, 2500);
  return () => clearInterval(id);
}

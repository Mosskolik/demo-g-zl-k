// =============================================================
// SES: sesli okuma (konuşma sentezi) ve konuşma tanıma — Web Speech API, tr-TR
// =============================================================

const synth = window.speechSynthesis;
let trVoice = null;

// Türkçe sesi bul (sesler tarayıcıda geç yüklenebilir)
function pickVoice() {
  const voices = synth?.getVoices() || [];
  trVoice = voices.find((v) => v.lang === 'tr-TR' && v.localService)
    || voices.find((v) => v.lang?.toLowerCase().startsWith('tr')) || null;
}
if (synth) {
  pickVoice();
  synth.addEventListener?.('voiceschanged', pickVoice);
}

export const speaker = {
  rate: 1.0,
  muted: false,       // ekran okuyucu modunda uygulama kendi sesini kapatır
  speaking: false,
  lastText: '',
  _token: 0,

  get supported() { return Boolean(synth); },

  /** iPhone'da ilk dokunuşta sesi "açmak" için boş okuma yapılır */
  unlock() {
    if (!synth) return;
    const u = new SpeechSynthesisUtterance(' ');
    u.lang = 'tr-TR'; u.volume = 0;
    synth.speak(u);
  },

  /**
   * Metni sesli okur. Uzun metinler cümlelere bölünür (Chrome uzun metni yarıda kesebiliyor).
   * Okuma bitince çözülen bir Promise döner.
   * @param {string} text
   * @param {{rate?:number, remember?:boolean}} [opts]
   */
  say(text, { rate, remember = true } = {}) {
    if (!text) return Promise.resolve();
    if (remember) this.lastText = text;
    this.stop();
    if (!synth || this.muted) return Promise.resolve();

    const token = ++this._token;
    const parts = splitSentences(text);
    this.speaking = true;
    this.onChange?.(true);

    return new Promise((resolve) => {
      let i = 0;
      const next = () => {
        if (token !== this._token) return resolve(); // durduruldu
        if (i >= parts.length) {
          this.speaking = false; this.onChange?.(false);
          return resolve();
        }
        const u = new SpeechSynthesisUtterance(parts[i++]);
        u.lang = 'tr-TR';
        if (trVoice) u.voice = trVoice;
        u.rate = rate || this.rate;
        u.onend = next;
        u.onerror = next;
        synth.speak(u);
      };
      next();
    });
  },

  stop() {
    this._token++;
    if (synth && (synth.speaking || synth.pending)) synth.cancel();
    if (this.speaking) { this.speaking = false; this.onChange?.(false); }
  },
};

function splitSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?…:;])\s+/)
    .flatMap((s) => (s.length > 220 ? s.split(/(?<=,)\s+/) : [s]))
    .map((s) => s.trim())
    .filter(Boolean);
}

// ------------------------------------------------------------
// Konuşma tanıma
// ------------------------------------------------------------
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const listener = {
  get supported() { return Boolean(Recognition); },
  active: false,
  _rec: null,

  /**
   * Bir kez dinler, söyleneni döndürür.
   * @returns {Promise<string>} söylenen metin (boş = bir şey duyulmadı)
   * Hata olursa Error fırlatır: err.code = 'not-allowed' | 'no-speech' | 'network' | ...
   */
  listenOnce() {
    if (!Recognition) return Promise.reject(Object.assign(new Error('Desteklenmiyor'), { code: 'unsupported' }));
    this.stop();
    return new Promise((resolve, reject) => {
      const rec = new Recognition();
      this._rec = rec;
      rec.lang = 'tr-TR';
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.continuous = false;
      let result = '';
      let failed = null;

      rec.onstart = () => { this.active = true; this.onChange?.(true); };
      rec.onresult = (e) => { result = e.results[0]?.[0]?.transcript || ''; };
      rec.onerror = (e) => { failed = e.error; };
      rec.onend = () => {
        this.active = false; this.onChange?.(false); this._rec = null;
        if (failed && failed !== 'no-speech' && failed !== 'aborted') {
          reject(Object.assign(new Error(failed), { code: failed }));
        } else resolve(result.trim());
      };
      try { rec.start(); } catch (err) { reject(Object.assign(err, { code: 'start-failed' })); }
    });
  },

  stop() {
    try { this._rec?.abort(); } catch { /* yoksay */ }
  },
};

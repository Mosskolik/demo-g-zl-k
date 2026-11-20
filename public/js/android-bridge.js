// =============================================================
// ANDROID KÖPRÜSÜ (sadece Android uygulamasının içinde çalışır)
//
// Android uygulaması sayfayı bir WebView içinde açar. WebView'da tarayıcının
// ses özellikleri (speechSynthesis, SpeechRecognition) YOKTUR. Bu dosya,
// uygulamanın verdiği yerel köprüyü (window.MatematikAndroid) kullanarak bu
// ikisinin aynısını taklit eder. Böylece uygulamanın geri kalanı hiç değişmeden
// telefonun kendi Türkçe sesini ve konuşma tanımasını kullanır.
//
// Normal tarayıcıda window.MatematikAndroid yoktur → bu dosya hiçbir şey yapmaz.
// Bilerek eski JavaScript ile yazıldı (her WebView sürümünde çalışsın).
// =============================================================
(function () {
  var A = window.MatematikAndroid;
  if (!A) return;
  window.__androidApp = true;

  var seq = 0;
  var utterances = {}; // id → SpeechSynthesisUtterance taklidi
  var recognizers = {}; // id → SpeechRecognition taklidi

  function call(fn, ev) { try { if (typeof fn === 'function') fn(ev); } catch (e) { setTimeout(function () { throw e; }); } }
  function fire(obj, type, ev) {
    ev = ev || {};
    ev.type = type; ev.target = obj;
    call(obj['on' + type], ev);
    var list = (obj._listeners && obj._listeners[type]) || [];
    for (var i = 0; i < list.length; i++) call(list[i], ev);
  }
  function addListener(type, fn) {
    this._listeners = this._listeners || {};
    (this._listeners[type] = this._listeners[type] || []).push(fn);
  }
  function removeListener(type, fn) {
    var list = (this._listeners && this._listeners[type]) || [];
    var i = list.indexOf(fn); if (i >= 0) list.splice(i, 1);
  }

  // ---------------- Sesli okuma ----------------
  var info = { ready: false, tr: false };
  function readInfo() { try { info = JSON.parse(A.ttsInfo()); } catch (e) { /* yoksay */ } }
  readInfo();

  function voiceList() {
    if (!info.ready || !info.tr) return [];
    return [{ name: 'Android Türkçe ses' + (info.engine ? ' (' + info.engine + ')' : ''), lang: 'tr-TR', localService: true, default: true, voiceURI: 'android-tr' }];
  }

  function Utterance(text) {
    this.text = text == null ? '' : String(text);
    this.lang = 'tr-TR'; this.rate = 1; this.pitch = 1; this.volume = 1; this.voice = null;
    this.onstart = null; this.onend = null; this.onerror = null; this.onboundary = null;
  }
  Utterance.prototype.addEventListener = addListener;
  Utterance.prototype.removeEventListener = removeListener;

  var queue = [];
  var current = null;

  var synth = {
    speaking: false, pending: false, paused: false, onvoiceschanged: null,
    addEventListener: addListener, removeEventListener: removeListener,
    getVoices: function () { return voiceList(); },
    speak: function (u) {
      queue.push(u);
      synth.pending = queue.length > 0 && synth.speaking;
      if (!current) next();
    },
    cancel: function () {
      var q = queue; queue = [];
      var c = current; current = null;
      synth.speaking = false; synth.pending = false;
      try { A.stopSpeaking(); } catch (e) { /* yoksay */ }
      if (c) fire(c, 'error', { error: 'interrupted' });
      for (var i = 0; i < q.length; i++) fire(q[i], 'error', { error: 'canceled' });
    },
    pause: function () {}, resume: function () {},
  };

  function next() {
    current = queue.shift() || null;
    synth.pending = queue.length > 0;
    if (!current) { synth.speaking = false; return; }
    var u = current;
    // Sessiz "kilit açma" okuması (iPhone için) → hemen bitti say
    if (!u.text.trim() || u.volume === 0) {
      current = null;
      setTimeout(function () { fire(u, 'start'); fire(u, 'end'); next(); }, 0);
      return;
    }
    synth.speaking = true;
    var id = 'u' + (++seq);
    u._id = id; utterances[id] = u;
    try { A.speak(id, u.text, Number(u.rate) || 1); } catch (e) { onTts({ id: id, k: 'error', error: 'synthesis-failed' }); }
  }

  function onTts(ev) {
    var u = utterances[ev.id];
    if (!u) return;
    if (ev.k === 'start') { fire(u, 'start'); return; }
    delete utterances[ev.id];
    if (current !== u) return; // iptal edilmiş (cancel zaten haber verdi)
    current = null;
    if (ev.k === 'end') fire(u, 'end');
    else fire(u, 'error', { error: ev.error || 'synthesis-failed' });
    next();
  }

  // ---------------- Konuşma tanıma ----------------
  function Recognition() {
    this.lang = 'tr-TR'; this.continuous = false; this.interimResults = false; this.maxAlternatives = 1;
    this.onstart = null; this.onresult = null; this.onerror = null; this.onend = null;
    this.onaudiostart = null; this.onspeechstart = null; this.onspeechend = null; this.onnomatch = null;
    this._id = null;
  }
  Recognition.prototype.addEventListener = addListener;
  Recognition.prototype.removeEventListener = removeListener;
  Recognition.prototype.start = function () {
    if (this._id) { var err = new Error('Zaten dinliyor'); err.name = 'InvalidStateError'; throw err; }
    var id = 'r' + (++seq);
    this._id = id; recognizers[id] = this;
    try { A.startListening(id, this.lang || 'tr-TR'); } catch (e) { onRec({ id: id, k: 'error', error: 'service-not-allowed' }); onRec({ id: id, k: 'end' }); }
  };
  Recognition.prototype.stop = function () { if (this._id) try { A.stopListening(this._id); } catch (e) { /* yoksay */ } };
  Recognition.prototype.abort = function () { if (this._id) try { A.abortListening(this._id); } catch (e) { /* yoksay */ } };

  function onRec(ev) {
    var r = recognizers[ev.id];
    if (!r) return;
    if (ev.k === 'start') { fire(r, 'start'); fire(r, 'audiostart'); return; }
    if (ev.k === 'speechstart') { fire(r, 'speechstart'); return; }
    if (ev.k === 'result') {
      var alt = { transcript: String(ev.text || ''), confidence: Number(ev.confidence) || 0.9 };
      var res = [alt]; res.isFinal = true; res.item = function (i) { return res[i]; };
      var results = [res]; results.item = function (i) { return results[i]; };
      fire(r, 'result', { results: results, resultIndex: 0 });
      return;
    }
    if (ev.k === 'error') { fire(r, 'error', { error: ev.error || 'aborted', message: ev.message || '' }); return; }
    if (ev.k === 'end') {
      delete recognizers[ev.id];
      r._id = null;
      fire(r, 'end');
    }
  }

  // Yerel taraf olayları buraya gönderir: window.__androidBridge.emit({...})
  window.__androidBridge = {
    emit: function (ev) {
      if (!ev) return;
      if (ev.t === 'tts') onTts(ev);
      else if (ev.t === 'rec') onRec(ev);
      else if (ev.t === 'voices') { readInfo(); fire(synth, 'voiceschanged'); }
    },
  };

  function define(name, value) {
    try { Object.defineProperty(window, name, { value: value, configurable: true, writable: true }); } catch (e) { window[name] = value; }
  }
  define('speechSynthesis', synth);
  define('SpeechSynthesisUtterance', Utterance);
  define('SpeechRecognition', Recognition);
  define('webkitSpeechRecognition', Recognition);
})();

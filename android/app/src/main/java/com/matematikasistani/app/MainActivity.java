package com.matematikasistani.app;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * Sesli Matematik Asistanı — Android uygulaması.
 *
 * Uygulamanın kendisi internetteki web uygulamasıdır (her güncelleme anında gelir).
 * Bu sınıf onu tam ekran açar ve WebView'da bulunmayan şeyleri telefonun kendi
 * özellikleriyle sağlar:
 *   - Sesli okuma: Android TextToSpeech (Türkçe)
 *   - Konuşma tanıma: Android SpeechRecognizer (tr-TR)
 *   - Kamera / mikrofon izinleri, galeriden görsel seçme
 *   - Ekranın kapanmaması, internet yoksa sesli uyarı
 * Sayfa tarafındaki karşılığı: public/js/android-bridge.js
 *
 * İleride: Meta Ray-Ban gözlük SDK'sı ve telefonda çalışan model buraya eklenecek.
 */
public class MainActivity extends Activity {

    static final String HOST = "app.matematik-asistani.workers.dev";
    static final String START_URL = "https://" + HOST + "/?kaynak=android";
    static final String OFFLINE_URL = "file:///android_asset/offline.html";
    static final String GOOGLE_TTS = "com.google.android.tts";

    static final int REQ_START_PERMS = 1;
    static final int REQ_WEB_PERMS = 2;
    static final int REQ_FILE = 10;

    final Handler main = new Handler(Looper.getMainLooper());
    WebView web;

    // Sesli okuma
    TextToSpeech tts;
    volatile boolean ttsReady = false;
    volatile boolean ttsTurkish = false;
    volatile String ttsEngine = "";
    boolean triedGoogleTts = false;
    boolean ttsSettingsOpened = false;
    final List<String[]> pendingSpeak = new ArrayList<>();

    // Konuşma tanıma
    SpeechRecognizer recognizer;
    String recId = null;

    // Web izinleri ve dosya seçimi
    PermissionRequest pendingWebPermission;
    ValueCallback<Uri[]> fileCallback;

    // İnternet yoksa
    int offlineCount = 0;
    final Runnable retryRunnable = this::retryLoad;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Gösterim/kullanım sırasında ekran kararmasın
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        web = new WebView(this);
        web.setBackgroundColor(Color.BLACK);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(true);
        s.setUserAgentString(s.getUserAgentString() + " MatematikAsistaniAndroid/" + BuildConfigVersion.NAME);

        web.addJavascriptInterface(new Bridge(), "MatematikAndroid");
        web.setWebViewClient(new Client());
        web.setWebChromeClient(new Chrome());

        initTts(null);

        // Kamera ve mikrofon iznini baştan iste; cevap gelince sayfayı aç
        List<String> need = new ArrayList<>();
        if (!has(Manifest.permission.CAMERA)) need.add(Manifest.permission.CAMERA);
        if (!has(Manifest.permission.RECORD_AUDIO)) need.add(Manifest.permission.RECORD_AUDIO);
        if (need.isEmpty()) web.loadUrl(START_URL);
        else requestPermissions(need.toArray(new String[0]), REQ_START_PERMS);
    }

    boolean has(String perm) {
        return checkSelfPermission(perm) == PackageManager.PERMISSION_GRANTED;
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] perms, int[] results) {
        super.onRequestPermissionsResult(code, perms, results);
        if (code == REQ_START_PERMS) {
            web.loadUrl(START_URL);
        } else if (code == REQ_WEB_PERMS && pendingWebPermission != null) {
            grantWebPermission(pendingWebPermission, false);
            pendingWebPermission = null;
        }
    }

    // ------------------------------------------------------------------
    // Sayfaya olay gönderme (window.__androidBridge.emit)
    // ------------------------------------------------------------------
    void emit(JSONObject o) {
        final String js = "window.__androidBridge&&window.__androidBridge.emit(" + o.toString() + ")";
        main.post(() -> { if (web != null) web.evaluateJavascript(js, null); });
    }

    static JSONObject obj(String... kv) {
        JSONObject o = new JSONObject();
        try {
            for (int i = 0; i + 1 < kv.length; i += 2) if (kv[i + 1] != null) o.put(kv[i], kv[i + 1]);
        } catch (JSONException ignored) { }
        return o;
    }

    // ------------------------------------------------------------------
    // SESLİ OKUMA
    // ------------------------------------------------------------------
    void initTts(String engine) {
        ttsReady = false;
        ttsEngine = engine == null ? "" : engine;
        TextToSpeech.OnInitListener onInit = status -> main.post(() -> onTtsInit(status));
        tts = engine == null ? new TextToSpeech(this, onInit) : new TextToSpeech(this, onInit, engine);
    }

    void onTtsInit(int status) {
        if (tts == null) return;
        boolean ok = status == TextToSpeech.SUCCESS;
        int lang = ok ? tts.setLanguage(new Locale("tr", "TR")) : TextToSpeech.LANG_NOT_SUPPORTED;
        ttsTurkish = ok && lang >= TextToSpeech.LANG_AVAILABLE;
        if (ttsEngine.isEmpty() && ok && tts.getDefaultEngine() != null) ttsEngine = tts.getDefaultEngine();

        // Varsayılan ses motorunda Türkçe yoksa (ör. bazı Samsung'lar) Google'ın motorunu dene
        if (!ttsTurkish && !triedGoogleTts && !GOOGLE_TTS.equals(ttsEngine) && googleTtsInstalled()) {
            triedGoogleTts = true;
            tts.shutdown();
            initTts(GOOGLE_TTS);
            return;
        }
        if (ok) {
            tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                @Override public void onStart(String id) { emit(obj("t", "tts", "k", "start", "id", id)); }
                @Override public void onDone(String id) { emit(obj("t", "tts", "k", "end", "id", id)); }
                @Override public void onError(String id) { emit(obj("t", "tts", "k", "error", "id", id, "error", "synthesis-failed")); }
                @Override public void onError(String id, int code) { emit(obj("t", "tts", "k", "error", "id", id, "error", "synthesis-failed")); }
                @Override public void onStop(String id, boolean interrupted) { /* sayfa zaten iptal etti */ }
            });
        }
        ttsReady = true;
        emit(obj("t", "voices"));
        List<String[]> waiting = new ArrayList<>(pendingSpeak);
        pendingSpeak.clear();
        for (String[] p : waiting) speakNow(p[0], p[1], Float.parseFloat(p[2]));
    }

    boolean googleTtsInstalled() {
        try {
            getPackageManager().getPackageInfo(GOOGLE_TTS, 0);
            return true;
        } catch (PackageManager.NameNotFoundException e) {
            return false;
        }
    }

    void speakNow(String id, String text, float rate) {
        if (!ttsReady) { pendingSpeak.add(new String[]{id, text, String.valueOf(rate)}); return; }
        if (tts == null || !ttsTurkish) {
            emit(obj("t", "tts", "k", "error", "id", id, "error", "language-unavailable"));
            return;
        }
        tts.setSpeechRate(Math.max(0.3f, Math.min(3f, rate)));
        Bundle params = new Bundle();
        params.putString(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, id);
        int r = tts.speak(text, TextToSpeech.QUEUE_ADD, params, id);
        if (r != TextToSpeech.SUCCESS) emit(obj("t", "tts", "k", "error", "id", id, "error", "synthesis-failed"));
    }

    void openTtsSettings() {
        if (ttsSettingsOpened) return;
        ttsSettingsOpened = true;
        Intent i = new Intent(TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA);
        if (googleTtsInstalled()) i.setPackage(GOOGLE_TTS);
        try {
            startActivity(i);
        } catch (ActivityNotFoundException e) {
            try { startActivity(new Intent("com.android.settings.TTS_SETTINGS")); } catch (Exception ignored) { }
        }
    }

    // ------------------------------------------------------------------
    // KONUŞMA TANIMA
    // ------------------------------------------------------------------
    void startListening(String id, String lang) {
        // Önceki dinleme hâlâ açıksa kapat
        if (recId != null) {
            String prev = recId;
            recId = null;
            if (recognizer != null) recognizer.cancel();
            emit(obj("t", "rec", "k", "error", "id", prev, "error", "aborted"));
            emit(obj("t", "rec", "k", "end", "id", prev));
        }
        if (!has(Manifest.permission.RECORD_AUDIO)) { failRec(id, "not-allowed"); return; }
        if (!SpeechRecognizer.isRecognitionAvailable(this)) { failRec(id, "service-not-allowed"); return; }
        if (recognizer == null) {
            recognizer = SpeechRecognizer.createSpeechRecognizer(this);
            recognizer.setRecognitionListener(new Listener());
        }
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, lang);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, lang);
        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
        intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);
        intent.putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, getPackageName());
        recId = id;
        try {
            recognizer.startListening(intent);
        } catch (Exception e) {
            recId = null;
            failRec(id, "aborted");
        }
    }

    void failRec(String id, String error) {
        emit(obj("t", "rec", "k", "error", "id", id, "error", error));
        emit(obj("t", "rec", "k", "end", "id", id));
    }

    void endRec() {
        String id = recId;
        recId = null;
        if (id != null) emit(obj("t", "rec", "k", "end", "id", id));
    }

    class Listener implements RecognitionListener {
        @Override public void onReadyForSpeech(Bundle b) { if (recId != null) emit(obj("t", "rec", "k", "start", "id", recId)); }
        @Override public void onBeginningOfSpeech() { if (recId != null) emit(obj("t", "rec", "k", "speechstart", "id", recId)); }
        @Override public void onRmsChanged(float v) { }
        @Override public void onBufferReceived(byte[] b) { }
        @Override public void onEndOfSpeech() { }
        @Override public void onPartialResults(Bundle b) { }
        @Override public void onEvent(int t, Bundle b) { }

        @Override public void onResults(Bundle b) {
            if (recId == null) return;
            ArrayList<String> list = b.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
            float[] conf = b.getFloatArray(SpeechRecognizer.CONFIDENCE_SCORES);
            String text = list != null && !list.isEmpty() ? list.get(0) : "";
            String c = conf != null && conf.length > 0 ? String.valueOf(conf[0]) : "0.9";
            if (!text.isEmpty()) emit(obj("t", "rec", "k", "result", "id", recId, "text", text, "confidence", c));
            endRec();
        }

        @Override public void onError(int code) {
            if (recId == null) return;
            String e;
            switch (code) {
                case SpeechRecognizer.ERROR_NO_MATCH:
                case SpeechRecognizer.ERROR_SPEECH_TIMEOUT: e = "no-speech"; break;
                case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS: e = "not-allowed"; break;
                case SpeechRecognizer.ERROR_AUDIO: e = "audio-capture"; break;
                case SpeechRecognizer.ERROR_CLIENT: e = "aborted"; break;
                case SpeechRecognizer.ERROR_RECOGNIZER_BUSY:
                    e = "aborted";
                    // Takılmış tanıyıcıyı yeniden oluştur
                    main.post(() -> { if (recognizer != null && recId == null) { recognizer.destroy(); recognizer = null; } });
                    break;
                case SpeechRecognizer.ERROR_LANGUAGE_NOT_SUPPORTED: // Android 12+
                case SpeechRecognizer.ERROR_LANGUAGE_UNAVAILABLE: e = "language-not-supported"; break;
                default: e = "network"; // ağ, sunucu, çok fazla istek…
            }
            emit(obj("t", "rec", "k", "error", "id", recId, "error", e, "message", "kod " + code));
            endRec();
        }
    }

    // ------------------------------------------------------------------
    // SAYFANIN ÇAĞIRDIĞI KÖPRÜ (window.MatematikAndroid)
    // Bu metotlar arka plandaki bir iş parçacığında çağrılır → ana iş parçacığına aktarılır.
    // ------------------------------------------------------------------
    class Bridge {
        @JavascriptInterface public void speak(String id, String text, double rate) { main.post(() -> speakNow(id, text, (float) rate)); }
        @JavascriptInterface public void stopSpeaking() { main.post(() -> { pendingSpeak.clear(); if (tts != null) tts.stop(); }); }
        @JavascriptInterface public String ttsInfo() {
            JSONObject o = new JSONObject();
            try {
                o.put("ready", ttsReady);
                o.put("tr", ttsTurkish);
                o.put("engine", ttsEngine);
            } catch (JSONException ignored) { }
            return o.toString();
        }
        @JavascriptInterface public void openTtsSettings() { main.post(MainActivity.this::openTtsSettings); }
        @JavascriptInterface public void startListening(String id, String lang) { main.post(() -> MainActivity.this.startListening(id, lang == null ? "tr-TR" : lang)); }
        @JavascriptInterface public void stopListening(String id) { main.post(() -> { if (id.equals(recId) && recognizer != null) recognizer.stopListening(); }); }
        @JavascriptInterface public void abortListening(String id) {
            main.post(() -> {
                if (!id.equals(recId)) return;
                if (recognizer != null) recognizer.cancel();
                emit(obj("t", "rec", "k", "error", "id", id, "error", "aborted"));
                endRec();
            });
        }
        @JavascriptInterface public void vibrate(String json) { main.post(() -> vibrateNow(json)); }
        @JavascriptInterface public void retry() { main.post(MainActivity.this::retryLoad); }
        @JavascriptInterface public String appVersion() { return BuildConfigVersion.NAME; }
    }

    // Titreşim: sayfadan gelen desen (ör. 80 ya da [40,60,40]) → telefonun titreşim motoru
    void vibrateNow(String json) {
        try {
            long[] timings;
            String t = json == null ? "" : json.trim();
            if (t.startsWith("[")) {
                org.json.JSONArray a = new org.json.JSONArray(t);
                timings = new long[a.length() + 1];
                timings[0] = 0; // hemen başla
                for (int i = 0; i < a.length(); i++) timings[i + 1] = Math.max(0, Math.min(2000, a.optLong(i)));
            } else {
                timings = new long[]{0, Math.max(0, Math.min(2000, Long.parseLong(t.isEmpty() ? "0" : t)))};
            }
            android.os.Vibrator v = (android.os.Vibrator) getSystemService(VIBRATOR_SERVICE);
            if (v == null || !v.hasVibrator()) return;
            if (timings.length < 2 || (timings.length == 2 && timings[1] == 0)) { v.cancel(); return; }
            if (Build.VERSION.SDK_INT >= 26) v.vibrate(android.os.VibrationEffect.createWaveform(timings, -1));
            else v.vibrate(timings, -1);
        } catch (Exception ignored) { }
    }

    // ------------------------------------------------------------------
    // Sayfa yükleme, internet yoksa uyarı
    // ------------------------------------------------------------------
    class Client extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
            Uri u = req.getUrl();
            if (HOST.equals(u.getHost()) || "file".equals(u.getScheme())) return false;
            // Başka siteler uygulamanın içinde açılmaz, telefonun tarayıcısında açılır
            try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) { }
            return true;
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest req, WebResourceError err) {
            if (req.isForMainFrame()) showOffline();
        }

        @Override
        public void onReceivedHttpError(WebView view, WebResourceRequest req, WebResourceResponse res) {
            if (req.isForMainFrame() && res.getStatusCode() >= 500) showOffline();
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            if (url != null && url.startsWith("https://" + HOST)) offlineCount = 0;
        }
    }

    void showOffline() {
        offlineCount++;
        web.loadUrl(OFFLINE_URL);
        // Sesli uyarı: sadece ilk seferde ve sonra arada bir (sürekli konuşmasın)
        if (offlineCount == 1 || offlineCount % 8 == 0) {
            speakNow("offline" + offlineCount, "İnternet bağlantısı yok. Bağlantı gelince kendiliğinden açılacağım.", 1f);
        }
        main.removeCallbacks(retryRunnable);
        main.postDelayed(retryRunnable, 8000);
    }

    void retryLoad() {
        main.removeCallbacks(retryRunnable);
        web.loadUrl(START_URL);
    }

    // ------------------------------------------------------------------
    // Kamera/mikrofon izni (sayfa istediğinde) ve galeriden görsel seçme
    // ------------------------------------------------------------------
    class Chrome extends WebChromeClient {
        @Override
        public void onPermissionRequest(PermissionRequest request) {
            if (!request.getOrigin().toString().contains(HOST)) { request.deny(); return; }
            List<String> need = new ArrayList<>();
            for (String r : request.getResources()) {
                if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(r) && !has(Manifest.permission.CAMERA)) need.add(Manifest.permission.CAMERA);
                if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r) && !has(Manifest.permission.RECORD_AUDIO)) need.add(Manifest.permission.RECORD_AUDIO);
            }
            if (need.isEmpty()) { grantWebPermission(request, true); return; }
            if (pendingWebPermission != null) pendingWebPermission.deny();
            pendingWebPermission = request;
            requestPermissions(need.toArray(new String[0]), REQ_WEB_PERMS);
        }

        @Override
        public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
            if (fileCallback != null) fileCallback.onReceiveValue(null);
            fileCallback = callback;
            Intent pick = new Intent(Intent.ACTION_GET_CONTENT);
            pick.addCategory(Intent.CATEGORY_OPENABLE);
            pick.setType("image/*");
            try {
                startActivityForResult(Intent.createChooser(pick, "Görsel seç"), REQ_FILE);
                return true;
            } catch (ActivityNotFoundException e) {
                fileCallback = null;
                return false;
            }
        }
    }

    void grantWebPermission(PermissionRequest request, boolean all) {
        List<String> ok = new ArrayList<>();
        for (String r : request.getResources()) {
            if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(r) && has(Manifest.permission.CAMERA)) ok.add(r);
            if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(r) && has(Manifest.permission.RECORD_AUDIO)) ok.add(r);
        }
        if (ok.isEmpty()) request.deny();
        else request.grant(ok.toArray(new String[0]));
    }

    @Override
    protected void onActivityResult(int code, int result, Intent data) {
        super.onActivityResult(code, result, data);
        if (code != REQ_FILE || fileCallback == null) return;
        Uri[] uris = null;
        if (result == RESULT_OK && data != null) {
            if (data.getData() != null) uris = new Uri[]{data.getData()};
            else if (data.getClipData() != null && data.getClipData().getItemCount() > 0) uris = new Uri[]{data.getClipData().getItemAt(0).getUri()};
        }
        fileCallback.onReceiveValue(uris);
        fileCallback = null;
    }

    // ------------------------------------------------------------------
    // Yaşam döngüsü
    // ------------------------------------------------------------------
    @Override
    protected void onPause() {
        super.onPause();
        // Uygulamadan çıkınca konuşmayı ve dinlemeyi durdur (gizlilik)
        if (tts != null) tts.stop();
        if (recId != null && recognizer != null) {
            recognizer.cancel();
            String id = recId;
            emit(obj("t", "rec", "k", "error", "id", id, "error", "aborted"));
            endRec();
        }
        if (web != null) web.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) web.onResume();
    }

    @Override
    protected void onDestroy() {
        main.removeCallbacksAndMessages(null);
        if (tts != null) { tts.shutdown(); tts = null; }
        if (recognizer != null) { recognizer.destroy(); recognizer = null; }
        if (web != null) { web.destroy(); web = null; }
        super.onDestroy();
    }
}

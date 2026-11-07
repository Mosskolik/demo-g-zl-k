// =============================================================
// ImageSource — görüntü kaynağı "arayüzü"
//
// Şu an iki kaynak var: telefon kamerası ve galeriden dosya.
// İleride Ray-Ban Meta gözlük SDK'sı için MetaGlassesSource doldurulacak.
// Uygulamanın geri kalanı yalnızca capture() fonksiyonunu kullanır.
// =============================================================

const MAX_SIDE = 1280;     // gönderilen görüntünün en uzun kenarı (piksel)
const JPEG_QUALITY = 0.85;

/**
 * Tüm kaynakların ortak arayüzü.
 * capture() → { canvas, base64 }  (base64: "data:" öneki olmadan JPEG)
 */
export class ImageSource {
  get name() { return 'base'; }
  async start() {}
  async capture() { throw new Error('capture() yazılmamış'); }
  stop() {}
}

// ------------------------------------------------------------
// Telefon kamerası (arka kamera)
// ------------------------------------------------------------
export class CameraSource extends ImageSource {
  constructor(videoEl) {
    super();
    this.video = videoEl;
    this.stream = null;
  }
  get name() { return 'camera'; }
  get ready() { return Boolean(this.stream && this.video.videoWidth); }

  async start() {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw Object.assign(new Error('Kamera desteklenmiyor'), { code: 'unsupported' });
    }
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: false,
    });
    this.video.srcObject = this.stream;
    await this.video.play().catch(() => {});
    // Videonun ilk kareyi vermesini bekle
    if (!this.video.videoWidth) {
      await new Promise((r) => { this.video.onloadedmetadata = r; setTimeout(r, 2000); });
    }
  }

  async capture() {
    if (!this.ready) throw Object.assign(new Error('Kamera hazır değil'), { code: 'not-ready' });
    return toResult(this.video, this.video.videoWidth, this.video.videoHeight);
  }

  stop() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
  }
}

// ------------------------------------------------------------
// Galeriden (veya iPhone'da kamera uygulamasından) seçilen dosya
// ------------------------------------------------------------
export class FileSource extends ImageSource {
  get name() { return 'file'; }

  /** @param {File} file */
  async captureFile(file) {
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return toResult(img, img.naturalWidth, img.naturalHeight);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

// ------------------------------------------------------------
// Ray-Ban Meta gözlük — İSKELET (ileride)
// Meta'nın "Wearables Device Access Toolkit" SDK'sı mobil uygulamalar
// (Android/iOS) içindir. Web'den bağlanmak için büyük olasılıkla bir
// yerel köprü uygulaması gerekecek; o köprü görüntüyü buraya iletecek.
// ------------------------------------------------------------
export class MetaGlassesSource extends ImageSource {
  get name() { return 'meta-glasses'; }
  async start() {
    // TODO: Gözlüğe bağlan (SDK / köprü uygulaması)
    throw Object.assign(new Error('Meta gözlük desteği henüz eklenmedi'), { code: 'unsupported' });
  }
  async capture() {
    // TODO: Gözlükten tek kare al, toResult(...) ile aynı biçimde döndür
    throw Object.assign(new Error('Meta gözlük desteği henüz eklenmedi'), { code: 'unsupported' });
  }
}

// Görüntüyü küçültüp JPEG base64'e çevirir (daha hızlı gönderim, daha az kota)
function toResult(source, w, h) {
  const scale = Math.min(1, MAX_SIDE / Math.max(w, h));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height);
  const base64 = canvas.toDataURL('image/jpeg', JPEG_QUALITY).split(',')[1];
  return { canvas, base64 };
}

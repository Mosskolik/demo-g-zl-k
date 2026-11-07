// =============================================================
// Fotoğraf kalitesi kontrolü — telefonda yapılır, internete istek atmaz.
// Karanlık, aşırı parlak veya bulanık fotoğrafları modele göndermeden eler
// (ücretsiz kotayı boşa harcamamak için).
// =============================================================

const SIZE = 320; // analiz için küçültülmüş genişlik

// Eşik değerleri (gerekirse buradan ayarla)
export const THRESHOLDS = {
  dark: 45,       // ortalama parlaklık bunun altındaysa → karanlık
  bright: 245,    // bunun üstündeyse VE ayrıntı yoksa → çok parlak / yansıma
  blur: 40,       // kenar keskinliği (Laplace varyansı) bunun altındaysa → bulanık
};

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {{ok:boolean, problem?:'dark'|'bright'|'blur', brightness:number, sharpness:number}}
 */
export function checkQuality(canvas) {
  const scale = SIZE / canvas.width;
  const w = SIZE;
  const h = Math.max(1, Math.round(canvas.height * scale));
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(canvas, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  // Gri tonlamaya çevir ve ortalama parlaklığı bul
  const gray = new Float32Array(w * h);
  let sum = 0;
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    gray[j] = g; sum += g;
  }
  const brightness = sum / gray.length;

  // Laplace filtresi: keskin kenar çoksa varyans yüksek, bulanıksa düşük
  let lsum = 0, lsq = 0, n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const lap = gray[i - w] + gray[i + w] + gray[i - 1] + gray[i + 1] - 4 * gray[i];
      lsum += lap; lsq += lap * lap; n++;
    }
  }
  const mean = lsum / n;
  const sharpness = lsq / n - mean * mean;

  let problem;
  if (brightness < THRESHOLDS.dark) problem = 'dark';
  else if (brightness > THRESHOLDS.bright && sharpness < THRESHOLDS.blur * 3) problem = 'bright'; // beyaz kâğıt tek başına sorun değil
  else if (sharpness < THRESHOLDS.blur) problem = 'blur';
  return { ok: !problem, problem, brightness: Math.round(brightness), sharpness: Math.round(sharpness) };
}

export const QUALITY_MESSAGES = {
  dark: 'Görüntü çok karanlık. Daha aydınlık bir yere geç ve tekrar dene.',
  bright: 'Görüntü çok parlak, yansıma olabilir. Telefonu biraz eğ ve tekrar dene.',
  blur: 'Görüntü bulanık. Telefonu sayfanın yaklaşık otuz santim üstünde sabit tut ve tekrar dokun.',
};

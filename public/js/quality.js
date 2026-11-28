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

/**
 * KESİK KENAR TESPİTİ (piksel ile, internete istek atmadan).
 * Fikir: Fotoğrafın en dış şeridinde zemin AÇIK renkliyse (kâğıt) ve bu şeritte
 * birbirinden ayrı birkaç koyu "mürekkep" lekesi varsa, yazı o kenardan taşmış (kesilmiş) demektir.
 * Şerit koyuysa (masa, zemin) kâğıdın kenarı görünüyor demektir → kesik değil.
 * @param {HTMLCanvasElement} canvas
 * @returns {string[]} kesik görünen kenarlar: 'ust' | 'alt' | 'sol' | 'sag'
 */
export function detectCutEdges(canvas) {
  const W = 640;
  const scale = W / canvas.width;
  const H = Math.max(1, Math.round(canvas.height * scale));
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(canvas, 0, 0, W, H);
  const { data } = ctx.getImageData(0, 0, W, H);
  const lum = (x, y) => { const i = (y * W + x) * 4; return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]; };

  // side: hangi kenar; along: kenar boyunca uzunluk; depth: şerit kalınlığı
  const sides = [];
  const check = (name, along, depth, px) => {
    const vals = [];
    for (let a = 0; a < along; a++) for (let d = 0; d < depth; d++) vals.push(px(a, d));
    vals.sort((p, q) => p - q);
    const median = vals[Math.floor(vals.length / 2)];
    if (median < 150) return; // zemin koyu: kâğıdın kenarı görünüyor → kesik değil
    const inkLimit = median - 90;
    // Kenar boyunca her konumda şeritte mürekkep var mı?
    const marks = [];
    for (let a = 0; a < along; a++) {
      let ink = false;
      for (let d = 0; d < depth && !ink; d++) if (px(a, d) < inkLimit) ink = true;
      marks.push(ink);
    }
    // Ayrı mürekkep kümelerini say (harf/satır boyutunda olanlar; büyük gölgeler sayılmaz)
    let clusters = 0, run = 0;
    const maxRun = Math.max(6, Math.round(along * 0.08));
    for (let a = 0; a <= along; a++) {
      if (a < along && marks[a]) { run++; continue; }
      if (run >= 1 && run <= maxRun) clusters++;
      run = 0;
    }
    if (clusters >= 3) sides.push(name);
  };
  const dx = Math.max(3, Math.round(W * 0.012));
  const dy = Math.max(3, Math.round(H * 0.012));
  check('sol', H, dx, (a, d) => lum(d, a));
  check('sag', H, dx, (a, d) => lum(W - 1 - d, a));
  check('ust', W, dy, (a, d) => lum(a, d));
  check('alt', W, dy, (a, d) => lum(a, H - 1 - d));
  return sides;
}

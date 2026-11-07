// =============================================================
// Sesli/yazılı komutları anlar.
// Tanınmayan her şey "serbest soru" olarak modele gönderilir.
// =============================================================

/** Türkçe küçük harfe çevirir, noktalama işaretlerini atar */
export function normalize(text) {
  return String(text)
    .toLocaleLowerCase('tr-TR')
    .replace(/[.,!?;:"'’()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @param {string} raw  söylenen/yazılan metin
 * @returns {{type:string, arg?:string}}
 *   type: capture | repeat | slow | fast | solve | answer | newq | stop | yes | no | continue | help | free
 */
export function parseCommand(raw) {
  const t = normalize(raw);
  const words = t.split(' ');
  const first = words[0] || '';
  const only = (...opts) => opts.includes(t);

  if (!t) return { type: 'empty' };

  // "cevabım 5", "cevap b şıkkı", "benim cevabım 12"
  const ans = t.match(/^(?:benim )?(?:cevabım|cevap|yanıtım|yanıt)(?: şu)?\s*(.*)$/);
  if (ans) return { type: 'answer', arg: ans[1].trim() };

  if (only('dur', 'sus', 'kes', 'yeter', 'dur lütfen', 'sus lütfen', 'tamam dur')) return { type: 'stop' };
  if (only('çek', 'fotoğraf çek', 'resim çek', 'foto çek', 'çek lütfen', 'fotoğraf')) return { type: 'capture' };
  if (only('tekrar et', 'tekrar', 'tekrarla', 'tekrar oku', 'bir daha', 'bir daha oku', 'yeniden oku', 'tekrar söyle')) return { type: 'repeat' };
  if (only('yavaş oku', 'yavaş', 'daha yavaş', 'yavaş söyle', 'yavaş konuş', 'yavaşla')) return { type: 'slow' };
  if (only('hızlı oku', 'hızlı', 'daha hızlı', 'hızlı konuş', 'hızlan')) return { type: 'fast' };
  if (first.startsWith('çöz') && words.length <= 4) return { type: 'solve' };       // çöz, çözer misin, çözümü söyle
  if (only('yeni soru', 'yeni', 'başka soru', 'yeni sayfa', 'baştan başla', 'sıfırla')) return { type: 'newq' };
  if (only('yardım', 'komutlar', 'ne diyebilirim', 'yardım et')) return { type: 'help' };
  if (only('devam', 'devam et', 'devam edebilirsin', 'sonraki', 'devam edin')) return { type: 'continue' };

  // Evet / hayır (okunan metni onaylarken)
  if (/^(evet|doğru|tamam|aynen|doğru anladın|evet doğru|olur)$/.test(t)) return { type: 'yes' };
  const no = t.match(/^(hayır|yanlış|değil|yanlış anladın|hayır yanlış)\s*(.*)$/);
  if (no) return { type: 'no', arg: no[2].trim() };

  return { type: 'free', arg: raw.trim() };
}

export const HELP_TEXT =
  'Kullanabileceğin komutlar şunlar. ' +
  'Çek: fotoğraf çeker. Ekranın üst yarısına dokunarak da çekebilirsin. ' +
  'Tekrar et: son söylediğimi tekrarlar. ' +
  'Yavaş oku: daha yavaş okur. ' +
  'Çöz: soruyu adım adım çözer. ' +
  'Cevabım, ve ardından cevabın: cevabını kontrol eder. ' +
  'Yeni soru: baştan başlar. ' +
  'Dur: susar. ' +
  'Bunların dışında ne sorarsan soru olarak cevaplarım.';

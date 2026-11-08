// =============================================================
// Sesli/yazılı komutları anlar.
// Tanınmayan her şey "serbest soru" olarak modele gönderilir.
// =============================================================

// Türkçe sayı ve sıra sayısı → rakam ("on ikinci" → 12, "yirmi bir" → 21, "7" → 7, "ilk" → 1)
const UNITS = { bir: 1, iki: 2, üç: 3, dört: 4, beş: 5, altı: 6, yedi: 7, sekiz: 8, dokuz: 9 };
const TENS = { on: 10, yirmi: 20, otuz: 30, kırk: 40, elli: 50 };
const ORD_UNITS = { birinci: 1, ikinci: 2, üçüncü: 3, dördüncü: 4, beşinci: 5, altıncı: 6, yedinci: 7, sekizinci: 8, dokuzuncu: 9 };
const ORD_TENS = { onuncu: 10, yirminci: 20, otuzuncu: 30, kırkıncı: 40, ellinci: 50 };
export function turkishNumber(text) {
  const w = String(text).trim().split(/\s+/);
  if (w.length === 1 && /^\d+$/.test(w[0])) return Number(w[0]);
  if (w.length === 1 && w[0] === 'ilk') return 1;
  let total = 0;
  for (let i = 0; i < w.length; i++) {
    const x = w[i];
    if (x in TENS && i === 0) total += TENS[x];
    else if (x in ORD_TENS && i === 0 && w.length === 1) total += ORD_TENS[x];
    else if (x in UNITS && i === w.length - 1) total += UNITS[x];
    else if (x in ORD_UNITS && i === w.length - 1) total += ORD_UNITS[x];
    else return 0;
  }
  return total;
}

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
 *   type: ready | misread | forceContinue | nextq | prevq | gotoq | explainAgain | capture | repeat | slow | fast | solve | answer | newq | stop | yes | no | continue | help | free
 */
export function parseCommand(raw) {
  const t = normalize(raw);
  const words = t.split(' ');
  const first = words[0] || '';
  const only = (...opts) => opts.includes(t);

  if (!t) return { type: 'empty' };

  // "hazırım" → öğrenci cevap vermeye hazır (cevap kalıbından ÖNCE kontrol edilmeli)
  if (/^(hazırım|hazır|ben hazırım|tamam hazırım|evet hazırım|hazırım cevap vereceğim|cevap vereceğim|cevaplayacağım|cevabı söyleyeceğim)$/.test(t)) return { type: 'ready' };

  // "çözemedim", "cevabı söyle", "bilmiyorum" → çözümü ve cevabı anlat (cevap kalıbından ÖNCE)
  // Sadece KISA ve net isteklerde (en fazla 5 kelime): uzun bir cümlenin içinde geçmesi yetmez.
  // (Asistanın kendi sesi mikrofona kaçarsa "…çözemedim de, birlikte çözeriz" yanlışlıkla çözüm başlatmasın.)
  if (words.length <= 5 && /^(?:ben |hocam |tamam )?(çözemedim|çözemiyorum|yapamadım|yapamıyorum|bilmiyorum|bulamadım|pes ediyorum|cevabı söyle|cevabı ver|cevabı nedir|cevabı ne|cevap ne|cevap nedir|doğru cevap ne|cevabı açıkla|nasıl çözülür)/.test(t)) {
    return { type: 'solve', arg: 'gaveUp' };
  }

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

  // Kesik uyarısına rağmen devam (sadece tam görünen sorular okunur)
  if (/^(yine de devam( et)?|devam et yine de|yine de oku|olsun devam( et)?)$/.test(t)) return { type: 'forceContinue' };

  // Sorular arasında gezinme
  if (/^(sıradaki|sonraki|diğer|öbür|bir sonraki)( soru)?(ya|yu)?( geç| geçelim| oku)?$/.test(t) || /^(sıradaki|sonraki) soruya geç/.test(t)) return { type: 'nextq' };
  if (/^(önceki|bir önceki)( soru)?(ya|yu)?( geç| dön| oku)?$/.test(t)) return { type: 'prevq' };
  // "yedinci soru", "on ikinci soru", "12. soru", "soru on iki", "ilk soru", "son soru"
  const nth = t.match(/^(.+?) soru(?:ya|yu)?(?: geç| oku| dön)?$/) || t.match(/^soru (.+?)(?:ya|ye|yı|yi| geç)?$/);
  if (nth) {
    if (nth[1] === 'son') return { type: 'gotoq', arg: -2 }; // -2 = son soru
    const n = turkishNumber(nth[1]);
    if (n) return { type: 'gotoq', arg: n - 1 };
  }

  // "anlamadım" → soruyu daha basit anlat (ipucusuz)
  if (/^(anlamadım|anlayamadım|anlamadım tekrar anlat|daha basit anlat|basit anlat|tekrar anlat|açıkla|açıklar mısın|soruyu anlamadım|ne demek istiyor)$/.test(t)) return { type: 'explainAgain' };

  // "yanlış okudun", "yanlış okumuşsun, x küp olacak" → okumayı düzelt
  const mis = t.match(/^(?:hayır )?(?:yanlış okudun|yanlış okumuşsun|yanlış anladın|öyle yazmıyor|yanlış)(?: olmuş)?\s*(.*)$/);
  if (mis && /okudun|okumuşsun|anladın|yazmıyor/.test(t)) return { type: 'misread', arg: mis[1].trim() };

  // Evet / hayır
  if (/^(evet|doğru|tamam|aynen|doğru anladın|evet doğru|olur)$/.test(t)) return { type: 'yes' };
  const no = t.match(/^(hayır|yanlış|değil|yanlış anladın|hayır yanlış)\s*(.*)$/);
  if (no) return { type: 'no', arg: no[2].trim() };

  return { type: 'free', arg: raw.trim() };
}

export const HELP_TEXT =
  'Kullanabileceğin komutlar şunlar. ' +
  'Çek: fotoğraf çeker. Ekranın herhangi bir yerine dokunarak da çekebilirsin. Ben konuşurken dokunursan susarım. ' +
  'Tekrar et: son söylediğimi tekrarlar. ' +
  'Yavaş oku: daha yavaş okur. ' +
  'Çöz, ya da çözemedim, cevabı söyle: soruyu adım adım çözer ve cevabı açıklarım. ' +
  'Hazırım: cevabını vermeye hazır olduğunu söyler; sonra cevabını söylersin, ben kontrol ederim. ' +
  'Ya da doğrudan cevabım deyip cevabını söyleyebilirsin. ' +
  'Evet ya da devam: konu anlatımında devam ederim. ' +
  'Yanlış okudun: sayfayı yanlış okuduysam düzeltirim; örneğin yanlış okudun, x küp olacak. ' +
  'Sıradaki soru, önceki soru ya da üçüncü soru: sayfadaki sorular arasında gezersin. ' +
  'Anlamadım: soruyu daha basit anlatırım. ' +
  'Yine de devam: sayfa kesik dediğimde, sadece tam görünen soruları okurum. ' +
  'Yeni soru: yeni bir sayfanın fotoğrafını çekersin. ' +
  'Dur: susar. ' +
  'Bunların dışında ne sorarsan soru olarak cevaplarım.';

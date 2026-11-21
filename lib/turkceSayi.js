// =============================================================
// Sayıları Türkçe okunuşa çevirir: 13 → "on üç", -4 → "eksi dört", 5/6 → "altıda beş", 2,5 → "iki virgül beş".
// Soru açıklamasında şıklardaki değerlerin (yani olası cevapların) sızıp sızmadığını kontrol etmek için kullanılır.
// =============================================================
const BIR = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ON = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];

/** 0 ≤ n < 1.000.000.000 tam sayı → Türkçe okunuş */
export function sayiOku(n) {
  n = Math.trunc(Number(n));
  if (!Number.isFinite(n)) return '';
  if (n < 0) return 'eksi ' + sayiOku(-n);
  if (n === 0) return 'sıfır';
  const parts = [];
  const millions = Math.floor(n / 1e6);
  const thousands = Math.floor((n % 1e6) / 1000);
  const rest = n % 1000;
  if (millions) parts.push(uc(millions), 'milyon');
  if (thousands) parts.push(thousands === 1 ? '' : uc(thousands), 'bin');
  if (rest) parts.push(uc(rest));
  return parts.filter(Boolean).join(' ');
}

function uc(n) { // 1..999
  const y = Math.floor(n / 100), o = Math.floor((n % 100) / 10), b = n % 10;
  return [y ? (y === 1 ? 'yüz' : `${BIR[y]} yüz`) : '', ON[o], BIR[b]].filter(Boolean).join(' ');
}

// Bulunma eki (-de/-da/-te/-ta): "altıda", "üçte", "sekizde", "kırkta"
const LOC = { bir: 'birde', iki: 'ikide', üç: 'üçte', dört: 'dörtte', beş: 'beşte', altı: 'altıda', yedi: 'yedide',
  sekiz: 'sekizde', dokuz: 'dokuzda', on: 'onda', yirmi: 'yirmide', otuz: 'otuzda', kırk: 'kırkta', elli: 'ellide',
  altmış: 'altmışta', yetmiş: 'yetmişte', seksen: 'seksende', doksan: 'doksanda', yüz: 'yüzde', bin: 'binde', milyon: 'milyonda' };

/** a/b → "b'de a" ("altıda beş") */
export function kesirOku(pay, payda) {
  const d = sayiOku(Math.abs(payda)).split(' ');
  d[d.length - 1] = LOC[d[d.length - 1]] || d[d.length - 1];
  const neg = (pay < 0) !== (payda < 0) ? 'eksi ' : '';
  return `${neg}${d.join(' ')} ${sayiOku(Math.abs(pay))}`;
}

/**
 * Bir değer metninin ("13", "-4", "5/6", "2,5") olası Türkçe okunuşları.
 * Okunamayan (ifade, harf içeren) değerler için boş liste.
 */
export function okunuslar(deger) {
  const t = String(deger).trim().replace(/[−–]/g, '-').replace(/\s+/g, '');
  let m;
  if ((m = t.match(/^(-?\d+)\/(-?\d+)$/))) {
    const a = Number(m[1]), b = Number(m[2]);
    return b ? [kesirOku(a, b), `${sayiOku(a)} bölü ${sayiOku(b)}`] : [];
  }
  if ((m = t.match(/^(-?\d+)[.,](\d+)$/))) {
    return [`${sayiOku(Number(m[1]))} virgül ${m[2].split('').map((c) => sayiOku(Number(c))).join(' ')}`,
      `${sayiOku(Number(m[1]))} virgül ${sayiOku(Number(m[2]))}`];
  }
  if (/^-?\d+$/.test(t)) return [sayiOku(Number(t))];
  return [];
}

// =============================================================
// İPUCU TESTİ:  npm run ipucu   (ya da: node scripts/ipucu-testi.js --sadece gemini)
// Her model için 9 gerçek soruda "soruyu açıklama" cevabını ister ve şunları kontrol eder:
//   - cevap sızdı mı (sorunun doğru cevabı açıklamada geçiyor mu)
//   - çözüm yolu / işlem tarifi / formül var mı (sunucu filtresinden SONRA)
// Öğrenci soruyu kendisi çözmeli; açıklama sadece soruyu anlatmalı. Aday başına 9 istek harcar.
// =============================================================
const arg = (name, def) => { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : def; };
const BASE = arg('url', 'https://app.matematik-asistani.workers.dev').replace(/\/$/, '');
const ONLY = arg('sadece', '');

// [ünite, soru metni, doğru cevabı yakalayan ifade]
const SORULAR = [
  ['Denklemler ve Eşitsizlikler', '1. 3x - 7 = 11 denkleminin çözümü kaçtır? A) 4 B) 5 C) 6 D) 7', /(^|\s)(altı|6)(\s|\.|,|$)/i],
  ['Sayılar ve Cebir', '2. (a + b)² ifadesinin açılımı hangisidir? A) a² + b² B) a² + 2ab + b² C) a² - b² D) 2a + 2b', /iki a b|2ab/i],
  ['Sayılar ve Cebir', '3. √49 + √16 işleminin sonucu kaçtır? A) 9 B) 10 C) 11 D) 13', /on bir|(^|\s)11(\s|\.|$)|yedi.*dört/i],
  ['Sayılar ve Cebir', '5. x² - 9 ifadesinin çarpanlarına ayrılmış hâli hangisidir? A) (x-3)² B) (x+3)(x-3) C) (x+9)(x-1) D) x(x-9)', /x artı üç.*x eksi üç|\(x\s*\+\s*3\)/i],
  ['Sayılar ve Cebir', '7. 2/3 + 1/6 işleminin sonucu kaçtır? A) 1/2 B) 3/4 C) 5/6 D) 1', /altıda beş|5\/6|altıda dört/i],
  ['Fonksiyonlar', '9. f(x) = 2x + 1 ise f(3) kaçtır? A) 5 B) 6 C) 7 D) 8', /(^|\s)(yedi|7)(\s|\.|,|$)/i],
  ['Sayma ve Olasılık', '11. 5! (5 faktöriyel) kaçtır? A) 25 B) 60 C) 100 D) 120', /yüz yirmi|120/i],
  ['Geometri', '12. Kenar uzunluğu 4 cm olan karenin alanı kaç cm²dir? A) 8 B) 12 C) 16 D) 20', /on altı|(^|\s)16(\s|\.|$)/i],
  ['Üçgenler', '7. [ŞEKİL: Bir dik üçgen. A köşesi sol altta, B sağ altta, C A\'nın tam üstünde. A\'da dik açı. AB üzerinde 12 cm, AC üzerinde 5 cm.] |AB| = 12 cm ve |AC| = 5 cm olduğuna göre |BC| kaç cm\'dir? A) 11 B) 13 C) 15 D) 17', /on üç|(^|\s)13(\s|\.|$)|yüz altmış dokuz|169/i],
];
const IPUCU = /formül|teorem|pisagor|yöntem|kendisiyle|birden .*kadar|buluruz|bulursun|bulunur|çarparız|toplarız|önce|sonra|cevap|yerine koy|payda|katsayı/i;

const health = await (await fetch(BASE + '/api/models')).json();
let ids = health.adaylar || [];
if (ONLY) ids = ids.filter((c) => c.startsWith(ONLY));
console.log(`Site: ${BASE}\nAdaylar: ${ids.join(', ')}\n`);
const rows = [];
for (const id of ids) {
  let sizan = 0, ipucu = 0, hata = 0;
  for (const [unite, metin, cevap] of SORULAR) {
    const pageText = `Ünite: ${unite}\nSoru ${metin}`;
    let reply = '', err = '';
    for (let a = 0; a < 3; a++) {
      const r = await fetch(BASE + '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'question', message: 'Bu soruyu bana açıkla.', pageText, history: [], only: id }), signal: AbortSignal.timeout(125000) })
        .catch((e) => ({ ok: false, json: async () => ({ code: e.name }) }));
      const d = await r.json().catch(() => ({}));
      if (r.ok) { reply = d.reply || ''; err = ''; break; }
      err = d.code || 'HATA';
      if (!/RATE_LIMIT|OVERLOADED/.test(err)) break;
      await new Promise((s) => setTimeout(s, 15000));
    }
    if (err) { hata++; console.log(`  ${id} | ${metin.slice(0, 30)}… → ${err}`); continue; }
    const s = cevap.test(reply.replace(/[A-E] şıkkı[^.]*\./g, '')), h = IPUCU.test(reply);
    if (s) sizan++; if (h) ipucu++;
    console.log(`  ${id} | ${metin.slice(0, 30)}… → ${s ? 'CEVAP SIZDI ' : ''}${h ? 'İPUCU: ' + reply.match(IPUCU)[0] : ''}${!s && !h ? 'temiz' : ''}`);
    if (s || h) console.log(`      "${reply}"`);
  }
  rows.push([id, sizan, ipucu, hata]);
}
console.log('\n=== SONUÇ (9 soru) ===\nAday | Cevap sızdı | İpucu | Hata');
for (const r of rows) console.log(r.join(' | '));
process.exit(rows.some((r) => r[1] || r[2]) ? 1 : 0);

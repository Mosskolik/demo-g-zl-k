// =============================================================
// YARIŞ — sağlayıcıları/modelleri aynı Türkçe matematik sayfalarıyla karşılaştırır.
//
// Kullanım:
//   node scripts/yaris.js                         → yayındaki sitede, tüm adaylar
//   node scripts/yaris.js --url http://localhost:3000
//   node scripts/yaris.js --sadece groq           → sadece adı "groq" ile başlayan adaylar
//
// Her aday için 9 istek harcar: 4 sayfa okuma + 4 cevap kontrolü + 1 soru açıklama.
// Anahtarlar sunucudadır; bu betik sadece /api/chat'e "only" parametresiyle istek atar.
// =============================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'tests', 'yaris');
const arg = (name, def) => { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : def; };
const BASE = arg('url', 'https://app.matematik-asistani.workers.dev').replace(/\/$/, '');
const ONLY = arg('sadece', '');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function post(body) {
  const t = Date.now();
  try {
    const r = await fetch(BASE + '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(125000) });
    const d = await r.json().catch(() => ({}));
    return { ok: r.ok, ms: Date.now() - t, ...d };
  } catch (e) { return { ok: false, ms: Date.now() - t, code: 'AG', error: e.message }; }
}
const img = (f) => fs.readFileSync(path.join(dir, f)).toString('base64');
const norm = (s) => String(s || '').replace(/[−–]/g, '-').replace(/\s+/g, ' ').toLocaleLowerCase('tr-TR');
const qByNo = (page, no) => (page?.sorular || []).find((q) => String(q.no).replace(/\D/g, '') === String(no));

// ---- Okuma testleri: [dosya, kontroller] ; her kontrol (page) → true/false
const READS = [
  ['sayfa.jpg', [
    ['4 soru bulundu', (p) => (p.sorular || []).length === 4],
    ['soru 5 şıkları', (p) => ['2x', '5x', '3'].every((x) => norm(qByNo(p, 5)?.metin).includes(x))],
    ['soru 6 şıkları (2,4,8,16)', (p) => ['16', '8', '4'].every((x) => norm(qByNo(p, 6)?.metin).includes(x))],
    ['soru 7 uzunluklar (12, 5) ve şıklar', (p) => ['12', '5', '13', '17'].every((x) => norm(qByNo(p, 7)?.metin).includes(x))],
    ['soru 8 bilyeler (3 kırmızı, 5 mavi)', (p) => /3\s*kırmızı/.test(norm(qByNo(p, 8)?.metin)) && /5\s*mavi/.test(norm(qByNo(p, 8)?.metin))],
    ['kesik demedi', (p) => !p.kesik && !(p.sorular || []).some((q) => q.tam === false)],
    ['okunuşta sembol yok', (p) => !(p.sorular || []).some((q) => /[²³√⁵⁻$\\]/.test(q.okunus || ''))],
    ['ünite bilgisi var', (p) => (p.sorular || []).every((q) => (q.unite || '').length > 2)],
  ]],
  ['buyuk.jpg', [
    ['12 soru bulundu', (p) => (p.sorular || []).length === 12],
    ['Türkçe harfler (çözümü, üçgenin, iç açıları)', (p) => norm(qByNo(p, 1)?.metin).includes('çözümü') && norm(qByNo(p, 6)?.metin).includes('üçgenin iç açıları')],
    ['soru 11 faktöriyel şıkları', (p) => ['25', '60', '100', '120'].every((x) => norm(qByNo(p, 11)?.metin).includes(x))],
    ['soru 7 kesirler', (p) => /2\s*\/\s*3|\\frac\{2\}\{3\}|⅔/.test(norm(qByNo(p, 7)?.metin))],
  ]],
  ['kesik.jpg', [
    ['yarım soruyu (8) fark etti', (p) => { const q = qByNo(p, 8); return q ? q.tam === false : true; }],
    ['tam soruları (5,6,7) tam saydı', (p) => [5, 6, 7].every((n) => qByNo(p, n) && qByNo(p, n).tam !== false)],
    ['alt kenarı kesik buldu', (p) => p.kesik === true || (p.kesikKenarlar || []).includes('alt') || (p.sorular || []).some((q) => q.tam === false)],
  ]],
  ['acikkitap.jpg', [
    ['3 soru bulundu', (p) => (p.sorular || []).length === 3],
    ['karşı sayfa yüzünden kesik demedi', (p) => !(p.sorular || []).some((q) => q.tam === false)],
  ]],
];

// ---- Cevap kontrolü testleri: [soru bağlamı, öğrencinin cevabı, doğru mu]
const Q7 = "Ünite: Üçgenler (konu: dik üçgen)\nSoru 7: [ŞEKİL: A köşesi dik açı olan ABC dik üçgeni] ABC dik üçgeninde |AB| = 12 cm ve |AC| = 5 cm olduğuna göre, |BC| kaç cm'dir? A) 11 B) 13 C) 15 D) 17";
const Q5 = 'Ünite: Sayılar ve Cebir (konu: cebirsel ifadeler)\nSoru 5: (2x + 3)(x − 1) ifadesinin eşiti aşağıdakilerden hangisidir? A) 2x² + x − 3 B) 2x² − x − 3 C) 2x² + 5x − 3 D) 2x² + x + 3';
const Q8 = 'Ünite: Olasılık\nSoru 8: Bir torbada 3 kırmızı ve 5 mavi bilye vardır. Torbadan rastgele bir bilye çekildiğinde, bu bilyenin kırmızı olma olasılığı kaçtır? A) 3/8 B) 5/8 C) 3/5 D) 1/3';
const CHECKS = [[Q7, 'on üç', true], [Q7, 'D şıkkı', false], [Q5, 'A şıkkı', true], [Q8, 'beşte üç', false]];
// Açıklamada ipucu sızıntısı: yöntem adı, cevap ya da ara sonuç geçmemeli
const LEAK = /pisagor|on üç|\b13\b|karelerinin toplam|kareleri toplam|144|169|\b25\b/i;

async function runCandidate(id) {
  const r = { id, okuma: 0, okumaToplam: 0, kontrol: 0, ipucu: null, sure: [], hata: {}, eksik: [] };
  const fail = (x) => { const k = x.code || x.error || 'HATA'; r.hata[k] = (r.hata[k] || 0) + 1; };
  for (const [file, checks] of READS) {
    r.okumaToplam += checks.length;
    const x = await post({ mode: 'read', image: img(file), only: id });
    if (!x.ok || !x.page) { fail(x); r.eksik.push(`${file}: ${x.code || 'cevap yok'}`); await sleep(2500); continue; }
    r.sure.push(x.ms);
    for (const [name, fn] of checks) { let ok = false; try { ok = Boolean(fn(x.page)); } catch { ok = false; } if (ok) r.okuma++; else r.eksik.push(`${file}: ${name}`); }
    await sleep(2500);
  }
  for (const [ctx, answer, expected] of CHECKS) {
    const x = await post({ mode: 'check', message: 'Öğrencinin cevabı: ' + answer, pageText: ctx, history: [], only: id });
    if (!x.ok) { fail(x); r.eksik.push(`kontrol "${answer}": ${x.code || 'cevap yok'}`); }
    else { r.sure.push(x.ms); if (x.correct === expected) r.kontrol++; else r.eksik.push(`kontrol "${answer}": ${x.correct} dedi (beklenen ${expected})`); }
    await sleep(2500);
  }
  const x = await post({ mode: 'question', message: 'Bu soruyu bana açıkla.', pageText: Q7, history: [], only: id });
  if (!x.ok) fail(x); else { r.sure.push(x.ms); r.ipucu = LEAK.test(x.reply || ''); if (r.ipucu) r.eksik.push('açıklamada ipucu: ' + (x.reply.match(LEAK) || [''])[0]); }
  return r;
}

const info = await (await fetch(BASE + '/api/models')).json();
let ids = info.adaylar || [];
if (ONLY) ids = ids.filter((c) => c.startsWith(ONLY));
console.log(`Site: ${BASE}\nDevrede: ${(info.devrede || []).join(', ')}\nAdaylar: ${ids.join(', ') || '(yok)'}\n`);
const results = [];
for (const id of ids) {
  process.stdout.write(`▶ ${id} … `);
  const r = await runCandidate(id);
  r.puan = Math.round(100 * (0.6 * (r.okuma / r.okumaToplam) + 0.3 * (r.kontrol / CHECKS.length) + 0.1 * (r.ipucu === false ? 1 : 0)));
  r.ortSure = r.sure.length ? Math.round(r.sure.reduce((a, b) => a + b, 0) / r.sure.length / 100) / 10 : null;
  results.push(r);
  console.log(`puan ${r.puan}`);
}
results.sort((a, b) => b.puan - a.puan || (a.ortSure ?? 999) - (b.ortSure ?? 999));
console.log('\n=== SONUÇ (puan = %60 okuma + %30 cevap kontrolü + %10 ipucu vermeme) ===');
console.log('Sıra | Aday | Puan | Okuma | Kontrol | İpucu | Ort. süre | Hatalar');
results.forEach((r, i) => console.log(`${i + 1} | ${r.id} | ${r.puan} | ${r.okuma}/${r.okumaToplam} | ${r.kontrol}/${CHECKS.length} | ${r.ipucu === null ? '?' : r.ipucu ? 'VERDİ' : 'vermedi'} | ${r.ortSure ?? '-'} sn | ${Object.entries(r.hata).map(([k, v]) => `${k}×${v}`).join(' ') || '-'}`));
console.log('\n=== Kaçırılanlar ===');
results.forEach((r) => { if (r.eksik.length) console.log(`${r.id}:\n  - ${r.eksik.join('\n  - ')}`); });

// =============================================================
// Basit otomatik testler:  npm test
// Gerçek yapay zekâ çağırmaz (mock kullanır), anahtar gerekmez.
// =============================================================
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';

process.env.AI_PROVIDER = 'mock';
const { parseCommand } = await import('../public/js/commands.js');
const chat = (await import('../api/chat.js')).default;

// --- Komut tanıma ---
const cases = [
  ['Çek', 'capture'], ['fotoğraf çek', 'capture'], ['Tekrar et', 'repeat'], ['yavaş oku', 'slow'],
  ['Çöz', 'solve'], ['çözer misin', 'solve'], ['Cevabım 5', 'answer'], ['yeni soru', 'newq'],
  ['Dur!', 'stop'], ['evet', 'yes'], ['hayır x küp olacak', 'no'], ['devam et', 'continue'],
  ['Hazırım', 'ready'], ['ben hazırım', 'ready'], ['cevap vereceğim', 'ready'], ['çözemedim', 'solve'], ['cevabı söyle', 'solve'], ['bilmiyorum cevabı söyler misin', 'solve'], ['cevap ne', 'solve'], ['yanlış okudun x küp olacak', 'misread'], ['yanlış okudun', 'misread'], ['hayır', 'no'], ['sıradaki soru', 'nextq'], ['sonraki soru', 'nextq'], ['sıradaki', 'nextq'], ['önceki soru', 'prevq'], ['üçüncü soru', 'gotoq'], ['2. soru', 'gotoq'], ['anlamadım', 'explainAgain'], ['Çekirdek nedir', 'free'], ['Kökler toplamı nasıl bulunur?', 'free'],
];
for (const [text, type] of cases) assert.equal(parseCommand(text).type, type, `"${text}" → ${type}`);
assert.equal(parseCommand('cevabım B şıkkı').arg, 'b şıkkı');
assert.equal(parseCommand('üçüncü soru').arg, 2);
assert.equal(parseCommand('2. soru').arg, 1);
console.log(`✓ ${cases.length} komut doğru tanındı`);

// --- API (sahte istek/cevap ile) ---
async function call(body) {
  const req = Readable.from([Buffer.from(JSON.stringify(body))]);
  req.method = 'POST';
  let status = 200, out = '';
  const res = { setHeader() {}, set statusCode(s) { status = s; }, end(s) { out = s; } };
  await chat(req, res);
  return { status, data: JSON.parse(out) };
}

let r = await call({ mode: 'read', image: 'aGVsbG8=' });
assert.equal(r.status, 200); assert.equal(r.data.page.tur, 'soru'); assert.equal(r.data.page.sorular.length, 3);
console.log('✓ read modu');

r = await call({ mode: 'check', pageText: 'x^2-5x+6=0', message: 'Öğrencinin cevabı: 5' });
assert.equal(r.status, 200); assert.match(r.data.reply, /Tebrik/);
console.log('✓ check modu');

r = await call({ mode: 'yanlis' });
assert.equal(r.status, 400);
console.log('✓ geçersiz mod reddedildi');

r = await call({ mode: 'read' });
assert.equal(r.status, 400);
console.log('✓ görüntüsüz okuma reddedildi');

console.log('\nTüm testler geçti.');

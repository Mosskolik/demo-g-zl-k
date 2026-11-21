// =============================================================
// Basit otomatik testler:  npm test
// Gerçek yapay zekâ çağırmaz (mock kullanır), anahtar gerekmez.
// =============================================================
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';

process.env.AI_PROVIDER = 'mock';
const { parseCommand } = await import('../public/js/commands.js');
const chatModule = await import('../api/chat.js');
const chat = chatModule.default;
const { stripHintSentences, stripOptionLeaks } = chatModule;
const { sayiOku, kesirOku, okunuslar } = await import('../lib/turkceSayi.js');

// --- Komut tanıma ---
const cases = [
  ['Çek', 'capture'], ['fotoğraf çek', 'capture'], ['Tekrar et', 'repeat'], ['yavaş oku', 'slow'],
  ['Çöz', 'solve'], ['çözer misin', 'solve'], ['Cevabım 5', 'answer'], ['yeni soru', 'newq'],
  ['Dur!', 'stop'], ['evet', 'yes'], ['hayır x küp olacak', 'no'], ['devam et', 'continue'],
  ['Hazırım', 'ready'], ['ben hazırım', 'ready'], ['cevap vereceğim', 'ready'], ['çözemedim', 'solve'], ['cevabı söyle', 'solve'], ['bilmiyorum cevabı söyler misin', 'solve'], ['cevap ne', 'solve'], ['yanlış okudun x küp olacak', 'misread'], ['yanlış okudun', 'misread'], ['hayır', 'no'], ['sıradaki soru', 'nextq'], ['sonraki soru', 'nextq'], ['sıradaki', 'nextq'], ['önceki soru', 'prevq'], ['üçüncü soru', 'gotoq'], ['2. soru', 'gotoq'], ['anlamadım', 'explainAgain'], ['on ikinci soru', 'gotoq'], ['yirmi birinci soru', 'gotoq'], ['soru on iki', 'gotoq'], ['ilk soru', 'gotoq'], ['son soru', 'gotoq'], ['şıkları oku', 'options'], ['şıklar neydi', 'options'], ['c şıkkı neydi', 'option'], ['be şıkkını oku', 'option'], ['soruyu tekrar oku', 'stem'], ['verilenler neydi', 'givens'], ['şekli tekrar anlat', 'givens'], ['ne isteniyor', 'asked'], ['ipucu ver', 'hint'], ['nasıl başlayayım', 'hint'], ['b şıkkı', 'free'], ['Çekirdek nedir', 'free'], ['bu soru zor', 'free'], ['Kökler toplamı nasıl bulunur?', 'free'],
];
for (const [text, type] of cases) assert.equal(parseCommand(text).type, type, `"${text}" → ${type}`);
assert.equal(parseCommand('cevabım B şıkkı').arg, 'b şıkkı');
assert.equal(parseCommand('üçüncü soru').arg, 2);
assert.equal(parseCommand('2. soru').arg, 1);
assert.equal(parseCommand('on ikinci soru').arg, 11);
assert.equal(parseCommand('yirmi birinci soru').arg, 20);
assert.equal(parseCommand('soru on iki').arg, 11);
assert.equal(parseCommand('son soru').arg, -2);
assert.equal(parseCommand('onuncu soru').arg, 9);
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
assert.equal(r.status, 200); assert.match(r.data.reply, /^Tebrik/); assert.equal(r.data.correct, true);
r = await call({ mode: 'check', pageText: 'x^2-5x+6=0', message: 'Öğrencinin cevabı: altı' });
assert.equal(r.data.correct, false); assert.doesNotMatch(r.data.reply, /YANLIŞ\]/);
assert.doesNotMatch(r.data.reply, /hesap|Kökler 2 ve 3/, 'gizli hesap öğrenciye gitmemeli');
console.log('✓ check modu');

r = await call({ mode: 'yanlis' });
assert.equal(r.status, 400);
console.log('✓ geçersiz mod reddedildi');

r = await call({ mode: 'read' });
assert.equal(r.status, 400);
console.log('✓ görüntüsüz okuma reddedildi');

// --- Soru açıklamasında ipucu filtresi (öğrenci soruyu kendisi çözmeli) ---
const hintBad = ['Önce iki tarafa yedi ekleriz.', 'Sonra üçe böleriz.', 'x eşittir altı buluruz.', 'Cevap C şıkkı.',
  'Kenarları çarparsan alanı bulursun.', 'Bunu Pisagor ile çözebilirsin.', 'Buradaki kare, ifadenin kendisiyle çarpılması demek.',
  'Faktöriyel, birden o sayıya kadar çarpım demek.', 'Paydaları eşitlersen toplayabilirsin.', 'Fonksiyon kuralında x yerine üç koy.',
  'Bu işlemin sonucu on bir olur.', 'A şıkkı beş, B şıkkı altı.', 'Kökler toplamı katsayılarla bulunur.', 'İlk olarak parantezi açalım.', 'Sonuç bir kesirli sayı olacak.', 'Cevap negatif bir sayı çıkar.'];
const hintGood = ['Soruda bir dik üçgen var.', 'A köşesi sol altta, B köşesi sağ altta.', '|AB|, A ile B arasındaki uzunluk diye okunur.',
  'Verilenler şunlar: üç x eksi yedi eşittir on bir.', 'Senden istenen: denklemin çözümünün kaç olduğu.',
  'Senden istenen: bu toplama işleminin sonucunu bulman.', 'Senden istenen: ifadenin çarpanlarına ayrılmış hâlinin hangi şıkta olduğu.',
  'Verilenler şunlar: torbada üç kırmızı ve beş mavi bilye var.', 'Senden istenen: karenin alanının kaç santimetrekare olduğu.',
  'Bu ifade üç parçadan oluşuyor.', 'Payında x artı bir, paydasında iki var.', 'Parantezin tamamının karesi alınmış.',
  'Birinci parça: iki x artı üç.', 'Senden istenen: bir sayı; şıklardan birini seçeceksin.'];
for (const b of hintBad) assert.equal(stripHintSentences(`Bu soruyu sana açıklayayım. ${b} Verilenler şunlar: bir ifade.`).removed.length, 1, `silinmeli: ${b}`);
for (const g of hintGood) assert.equal(stripHintSentences(`Bu soruyu sana açıklayayım. ${g}`).removed.length, 0, `kalmalı: ${g}`);
assert.equal(stripHintSentences('Bu soruyu sana açıklayayım. Pisagor ile bulursun.').kept, '', 'geriye sadece giriş kalırsa açıklama okunmaz');
console.log(`✓ soru açıklaması ipucu filtresi (${hintBad.length} ipucu silindi, ${hintGood.length} temiz cümle kaldı)`);

// --- Türkçe sayı okunuşu ---
assert.equal(sayiOku(13), 'on üç'); assert.equal(sayiOku(120), 'yüz yirmi'); assert.equal(sayiOku(1999), 'bin dokuz yüz doksan dokuz');
assert.equal(sayiOku(-4), 'eksi dört'); assert.equal(kesirOku(5, 6), 'altıda beş'); assert.equal(kesirOku(3, 40), 'kırkta üç');
assert.deepEqual(okunuslar('2x+1'), []);
console.log('✓ Türkçe sayı okunuşu');

// --- Şık değeri sızıntı filtresi: soruda verilmeyen şık değeri açıklamada geçerse cümle silinir ---
const sayfa7 = 'Ünite: Üçgenler\nSoru 7: |AB| = 12 cm ve |AC| = 5 cm olduğuna göre |BC| kaç cm dir? A) 11 B) 13 C) 15 D) 17';
assert.equal(stripOptionLeaks('Bu soruyu sana açıklayayım. Kenar on üç santimetre olur. Senden istenen: B C uzunluğu.', sayfa7).removed.length, 1);
assert.equal(stripOptionLeaks('Bu soruyu sana açıklayayım. A ile B arası on iki santimetre, A ile C arası beş santimetre.', sayfa7).removed.length, 0);
assert.equal(stripOptionLeaks('Bu soruyu sana açıklayayım. Uzunluk 13 cm çıkar.', sayfa7).removed.length, 1);
const kesirSoru = 'Soru 7: 2/3 + 1/6 işleminin sonucu kaçtır? A) 1/2 B) 3/4 C) 5/6 D) 1';
assert.equal(stripOptionLeaks('Bu soruyu sana açıklayayım. Birinci parça üçte iki, ikinci parça altıda bir.', kesirSoru).removed.length, 0);
assert.equal(stripOptionLeaks('Bu soruyu sana açıklayayım. Toplam altıda beş olur.', kesirSoru).removed.length, 1);
console.log('✓ şık değeri sızıntı filtresi');

console.log('\nTüm testler geçti.');

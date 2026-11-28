// Türkçe Braille test sayfalarını modellere sorar; ham cevapları kaydeder (puanlama Python'da)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const [DIR, OUTF, modelsArg] = process.argv.slice(2);
const SECRET = process.env.BRAILLE_PROBE_SECRET;
const imgs = ['tr_sayfa1_murekkep.jpg', 'tr_sayfa1_kabartma.jpg', 'tr_sayfa2_murekkep.jpg', 'tr_sayfa2_kabartma.jpg', 'tr_sayfa3_murekkep.jpg', 'tr_sayfa3_kabartma.jpg'];
const P = {
  dogrudan: `This image shows a page of Turkish Braille (Türkçe Braille, uncontracted / kısaltmasız, 6-dot).
Read the Braille and write the Turkish text it encodes, line by line, with correct Turkish letters (ç, ğ, ı, ö, ş, ü) and digits.
Output only the Turkish text, nothing else.`,
  hucre: `This image shows a page of 6-dot Braille.
Transcribe EVERY Braille cell exactly as Unicode Braille Patterns (U+2800 to U+283F), one output line per Braille line,
top to bottom, cells left to right, with a normal space where there is a gap between words.
Do not translate, do not explain. Output only the Braille lines.`,
};
const results = existsSync(OUTF) ? JSON.parse(readFileSync(OUTF, 'utf8')) : {};
const models = modelsArg.split(',');
await Promise.all(models.map(async (m) => {
  const list = /3\.5-flash$|3\.6-flash/.test(m) ? ['tr_sayfa1_murekkep.jpg', 'tr_sayfa1_kabartma.jpg'] : imgs;
  for (const f of list) for (const [pk, prompt] of Object.entries(P)) {
    const key = `${m}|${f}|${pk}`; if (results[key]?.text) continue;
    const image = readFileSync(`${DIR}/${f}`).toString('base64');
    let d = {};
    for (let a = 0; a < 3; a++) {
      const r = await fetch('https://matematik-asistani-eta.vercel.app/api/bprobe', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: SECRET, model: m, prompt, image }) }).catch((e) => ({ status: 0, json: async () => ({ e: e.message }) }));
      d = await r.json().catch(() => ({})); d.status = r.status;
      if (r.status === 429 || r.status >= 500) { await new Promise((s) => setTimeout(s, 20000)); continue; }
      break;
    }
    results[key] = { status: d.status, ms: d.ms, err: d.err || d.e, text: d.text };
    console.log(`${m} | ${f} | ${pk} | durum ${d.status} ${d.err ? String(d.err).slice(0, 60) : ''}`);
    writeFileSync(OUTF, JSON.stringify(results, null, 1));
  }
}));

// Gerçek kabartma Braille fotoğraflarında hücre okuma doğruluğu (dilden bağımsız)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
const [K, OUTF, modelsArg] = process.argv.slice(2);
const SECRET = process.env.BRAILLE_PROBE_SECRET;
const gt = JSON.parse(readFileSync(`${K}/gt.json`, 'utf8'));
const files = Object.keys(gt);
const few = files.filter((f, i) => [0, 3, 5, 9, 12].includes(i)); // düşük kotalı modeller için 5 fotoğraf
const PROMPT = `This photo shows a page of embossed 6-dot Braille (raised dots, no ink).
Transcribe EVERY Braille cell you see, exactly, as Unicode Braille Patterns (U+2800 to U+283F).
Write one output line per Braille line, top to bottom, cells left to right. Put a normal space where there is a gap between words.
Do not translate, do not explain, do not add anything else. Output only the Braille lines.
Ignore dots pressed in from the other side of the paper (dents rather than bumps).`;
const lev = (a, b) => { const m = a.length, n = b.length; let p = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) { const c = [i]; for (let j = 1; j <= n; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; } return p[n]; };
const cells = (s) => [...String(s)].filter((ch) => ch.codePointAt(0) >= 0x2800 && ch.codePointAt(0) <= 0x283F && ch !== '⠀');
const results = existsSync(OUTF) ? JSON.parse(readFileSync(OUTF, 'utf8')) : {};
const models = modelsArg.split(',');
await Promise.all(models.map(async (m) => {
  const list = /3\.5-flash$|3\.6-flash/.test(m) ? few : files;
  for (const f of list) {
    const key = `${m}|${f}`; if (results[key]?.text) continue;
    const image = readFileSync(`${K}/${f}`).toString('base64');
    let d = {};
    for (let a = 0; a < 3; a++) {
      const r = await fetch('https://matematik-asistani-eta.vercel.app/api/bprobe', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: SECRET, model: m, prompt: PROMPT, image }) }).catch((e) => ({ status: 0, json: async () => ({ e: e.message }) }));
      d = await r.json().catch(() => ({})); d.status = r.status;
      if (r.status === 429 || r.status >= 500) { await new Promise((s) => setTimeout(s, 20000)); continue; }
      break;
    }
    const g = cells(gt[f].join('')), p = cells(d.text || '');
    const cer = g.length ? lev(p, g) / g.length : 1;
    results[key] = { status: d.status, ms: d.ms, err: d.err || d.e, text: d.text, gtCells: g.length, predCells: p.length, acc: Math.max(0, 1 - cer) };
    console.log(`${m} | ${f.slice(0, 28)} | durum ${d.status} | doğruluk %${(100 * Math.max(0, 1 - cer)).toFixed(1)} | hücre ${p.length}/${g.length} ${d.err ? '| ' + String(d.err).slice(0, 80) : ''}`);
    writeFileSync(OUTF, JSON.stringify(results, null, 1));
  }
}));
console.log('\n=== ÖZET (hücre doğruluğu = 1 - düzenleme mesafesi / doğru hücre sayısı) ===');
for (const m of models) {
  const rs = Object.entries(results).filter(([k]) => k.startsWith(m + '|')).map(([, v]) => v);
  const ok = rs.filter((r) => r.status === 200);
  const avg = ok.length ? ok.reduce((s, r) => s + r.acc, 0) / ok.length : 0;
  console.log(`${m}: ortalama %${(100 * avg).toFixed(1)} (${ok.length}/${rs.length} cevap)`);
}

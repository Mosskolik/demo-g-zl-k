// Gemini sağlayıcısının yedekli yarış (hedging) ve hata mantığı testleri — sahte fetch ile, kota harcamaz.
import assert from 'node:assert/strict';
import { GeminiProvider } from '../lib/providers/gemini.js';

const ok = (t) => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: t }] } }] }), { status: 200 });
const quota = () => new Response(JSON.stringify({ error: { message: 'Quota exceeded', details: [{ '@type': 'type.googleapis.com/google.rpc.QuotaFailure', violations: [{ quotaId: 'GenerateRequestsPerDayPerProjectPerModel-FreeTier' }] }] } }), { status: 429 });
const never = (signal) => new Promise((_, rej) => signal.addEventListener('abort', () => rej(Object.assign(new Error('x'), { name: 'AbortError' }))));
const later = (ms, r, signal) => new Promise((res, rej) => { const t = setTimeout(() => res(r), ms); signal.addEventListener('abort', () => { clearTimeout(t); rej(Object.assign(new Error('x'), { name: 'AbortError' })); }); });
const req = { system: 's', messages: [{ role: 'user', text: 'hi' }] };
const mk = (o = {}) => new GeminiProvider({ apiKey: 'k', model: 'a', fallbackModels: ['b', 'c'], hedgeMs: 200, timeoutMs: 1500, ...o });
const quiet = console.log; console.log = () => {};
let calls;
const route = (map) => { calls = []; globalThis.fetch = (url, o) => { const m = url.split('/models/')[1].split(':')[0]; calls.push(m); return map[m](o.signal); }; };

try {
  // 1) Ana model hızlı → yedek hiç çağrılmaz
  route({ a: (s) => later(50, ok('A'), s), b: (s) => later(50, ok('B'), s) });
  let r = await mk().generate(req);
  assert.equal(r.model, 'a'); assert.deepEqual(calls, ['a']);

  // 2) Ana model yavaş → 200 ms sonra yedek de başlar, yedek kazanır, ana iptal edilir
  route({ a: (s) => never(s), b: (s) => later(100, ok('B'), s) });
  let t0 = Date.now(); r = await mk().generate(req);
  assert.equal(r.model, 'b'); assert.ok(Date.now() - t0 < 1000, 'yedek hızlı kazanmalı');

  // 3) Ana modelin kotası dolu → hemen yedeğe geçer (yarış beklemeden)
  route({ a: () => Promise.resolve(quota()), b: (s) => later(50, ok('B'), s) });
  t0 = Date.now(); r = await mk().generate(req);
  assert.equal(r.model, 'b'); assert.ok(Date.now() - t0 < 200);

  // 4) Ana model bozuk cevap (validate) → yedek
  route({ a: (s) => later(30, ok('{"yarım'), s), b: (s) => later(30, ok('{"tur":"soru"}'), s) });
  r = await mk().generate({ ...req, validate: (t) => { try { JSON.parse(t); return true; } catch { return false; } } });
  assert.equal(r.model, 'b');

  // 5) Hiçbiri cevap vermiyor → TIMEOUT
  route({ a: (s) => never(s), b: (s) => never(s), c: (s) => never(s) });
  await assert.rejects(mk({ totalTimeoutMs: 8000 }).generate(req), (e) => e.code === 'TIMEOUT');

  // 6) Hepsinin günlük kotası dolu → DAILY_LIMIT
  route({ a: () => Promise.resolve(quota()), b: () => Promise.resolve(quota()), c: () => Promise.resolve(quota()) });
  await assert.rejects(mk().generate(req), (e) => e.code === 'DAILY_LIMIT');
} finally { console.log = quiet; }
console.log('✓ Gemini yedekli yarış ve hata mantığı (6 durum)');

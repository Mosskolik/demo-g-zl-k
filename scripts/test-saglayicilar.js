// OpenAI uyumlu sağlayıcı ve zincir testleri — sahte fetch ile, anahtar ve kota gerektirmez.
import assert from 'node:assert/strict';
import { OpenAICompatProvider } from '../lib/providers/openaiCompat.js';
import { ChainProvider } from '../lib/providers/chain.js';

const quiet = console.log; console.log = () => {};
const json = (status, obj, headers = {}) => new Response(JSON.stringify(obj), { status, headers });
const okOA = (t) => json(200, { choices: [{ message: { content: t } }] });
const okGem = (t) => json(200, { candidates: [{ content: { parts: [{ text: t }] } }] });
const req = { system: 'sistem', messages: [{ role: 'user', text: 'oku' }], image: { mimeType: 'image/jpeg', data: 'QUJD' }, jsonSchema: { type: 'OBJECT', properties: { tur: { type: 'STRING', enum: ['konu', 'soru'] }, sorular: { type: 'ARRAY', items: { type: 'OBJECT', properties: { no: { type: 'STRING' }, tam: { type: 'BOOLEAN' } } } } } } };

try {
  // 1) İstek biçimi: Bearer anahtar, görüntü data URL, JSON iskeleti talimatta, <think> atılır
  let sent;
  globalThis.fetch = async (url, o) => { sent = { url, headers: o.headers, body: JSON.parse(o.body) }; return okOA('<think>düşün</think>{"tur":"soru","sorular":[]}'); };
  const p = new OpenAICompatProvider({ name: 'groq', baseUrl: 'https://x/v1/', apiKey: 'K', models: ['m1'] });
  let r = await p.generate(req);
  assert.equal(r.text, '{"tur":"soru","sorular":[]}'); assert.equal(r.model, 'groq:m1');
  assert.equal(sent.url, 'https://x/v1/chat/completions'); assert.equal(sent.headers.Authorization, 'Bearer K');
  assert.equal(sent.body.model, 'm1'); assert.deepEqual(sent.body.response_format, { type: 'json_object' });
  assert.match(sent.body.messages[0].content, /"sorular":\[\{"no":"","tam":false\}\]/);
  assert.equal(sent.body.messages[1].content[1].image_url.url, 'data:image/jpeg;base64,QUJD');

  // 2) response_format desteklenmiyorsa (400) onsuz tekrar dener
  let n = 0;
  globalThis.fetch = async (url, o) => { n++; return JSON.parse(o.body).response_format ? json(400, { error: { message: 'response_format not supported' } }) : okOA('{"tur":"konu"}'); };
  r = await p.generate(req); assert.equal(n, 2); assert.equal(r.text, '{"tur":"konu"}');

  // 3) Hata eşleme: 429 günlük → DAILY_LIMIT, 429 dakikalık → RATE_LIMIT (+retry-after), 401 → BAD_KEY
  globalThis.fetch = async () => json(429, { error: { message: 'Rate limit reached: requests per day (RPD)' } });
  await assert.rejects(p.generate(req), (e) => e.code === 'DAILY_LIMIT');
  globalThis.fetch = async () => json(429, { error: { message: 'Too many requests per minute' } }, { 'retry-after': '7' });
  await assert.rejects(p.generate(req), (e) => e.code === 'RATE_LIMIT' && e.retryAfter === 7);
  globalThis.fetch = async () => json(401, { error: { message: 'bad key' } });
  await assert.rejects(p.generate(req), (e) => e.code === 'BAD_KEY');

  // 4) Zincir: anahtarı olan sağlayıcılar sırayla; Gemini kotası doluysa Groq'a geçer
  const cfg = {
    gemini: { apiKey: 'G', model: 'g1', fallbackModels: [], hedgeMs: 200, timeoutMs: 1500, totalTimeoutMs: 8000 },
    extra: {
      groq: { baseUrl: 'https://groq/v1', apiKey: 'K', models: ['q1'] },
      mistral: { baseUrl: 'https://mistral/v1', apiKey: '', models: ['s1'] }, // anahtar yok → devre dışı
    },
    chain: ['gemini', 'groq', 'mistral'],
  };
  const chain = new ChainProvider(cfg);
  assert.deepEqual(chain.providers.map((x) => x.name).sort(), ['gemini', 'groq']);
  assert.deepEqual(chain.candidates(req).map((c) => c.id), ['gemini:g1', 'groq:q1']);
  const calls = [];
  globalThis.fetch = async (url) => {
    if (url.includes('googleapis')) { calls.push('gemini'); return json(429, { error: { message: 'Quota', details: [{ violations: [{ quotaId: 'PerDay' }] }] } }); }
    calls.push('groq'); return okOA('{"tur":"soru","sorular":[]}');
  };
  r = await chain.generate(req);
  assert.equal(r.model, 'groq:q1'); assert.deepEqual(calls, ['gemini', 'groq']);

  // 5) only: tek adayı zorla (yarış betiği için); olmayan aday → hata
  calls.length = 0;
  r = await chain.generate({ ...req, only: 'groq' });
  assert.deepEqual(calls, ['groq']);
  await assert.rejects(chain.generate({ ...req, only: 'yok' }), (e) => e.status === 400);

  // 6) Sıra AI_CHAIN'e göre değişir
  const chain2 = new ChainProvider({ ...cfg, chain: ['groq', 'gemini'] });
  assert.deepEqual(chain2.candidates(req).map((c) => c.id), ['groq:q1', 'gemini:g1']);

  // 6b) Model düzeyinde sıra + basit işlerde güçlü Gemini modeli sona
  const cfg3 = { ...cfg, gemini: { ...cfg.gemini, model: 'guclu', fallbackModels: ['lite'] }, chain: ['gemini:guclu', 'groq', 'gemini'] };
  const chain3 = new ChainProvider(cfg3);
  assert.deepEqual(chain3.candidates(req).map((c) => c.id), ['gemini:guclu', 'groq:q1', 'gemini:lite']);
  assert.deepEqual(chain3.candidates({ ...req, preferFast: true }).map((c) => c.id), ['groq:q1', 'gemini:lite', 'gemini:guclu']);

  // 7) Hiç anahtar yoksa NO_KEY
  const none = new ChainProvider({ gemini: { ...cfg.gemini, apiKey: '' }, extra: {}, chain: ['gemini'] });
  await assert.rejects(none.generate(req), (e) => e.code === 'NO_KEY');
} finally { console.log = quiet; }
console.log('✓ OpenAI uyumlu sağlayıcı ve zincir (8 durum)');

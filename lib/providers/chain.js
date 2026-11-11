// =============================================================
// ZİNCİR — birden fazla ücretsiz sağlayıcıyı tek bir sağlayıcı gibi kullanır.
//
// Anahtarı eklenmiş her sağlayıcının modelleri sıraya dizilir (AI_CHAIN sırasıyla) ve
// yedekli yarışla denenir: biri kota doldurursa, yavaşsa ya da hata verirse sıradaki devreye girer.
// Böylece toplam günlük ücretsiz hak, sağlayıcıların haklarının toplamı olur.
// =============================================================
import { AIProvider, ProviderError } from './AIProvider.js';
import { raceCandidates } from './race.js';
import { GeminiProvider } from './gemini.js';
import { OpenAICompatProvider } from './openaiCompat.js';

export class ChainProvider extends AIProvider {
  constructor(config) {
    super();
    this.config = config;
    const all = { gemini: new GeminiProvider(config.gemini) };
    for (const [name, c] of Object.entries(config.extra)) all[name] = new OpenAICompatProvider({ name, ...c });
    this.all = all;
    // Sıra: AI_CHAIN'de yazanlar önce, yazmayanlar sonda
    const names = [...new Set([...config.chain, ...Object.keys(all)])].filter((n) => all[n]);
    this.providers = names.map((n) => all[n]).filter((p) => p.enabled);
  }

  get name() { return 'zincir'; }

  /** Bu istek için tüm adaylar. only = "groq" ya da "groq:model-adı" → sadece o aday(lar) */
  candidates(req) {
    let list = this.providers.flatMap((p) => p.candidates(req));
    if (req.only) list = list.filter((c) => c.id === req.only || c.id.startsWith(req.only + ':'));
    return list;
  }

  async generate(req) {
    if (!this.providers.length) {
      throw new ProviderError('NO_KEY', 'Hiçbir yapay zekâ anahtarı eklenmemiş (ör. GEMINI_API_KEY).', { status: 500 });
    }
    const list = this.candidates(req);
    if (!list.length) throw new ProviderError('UNKNOWN', `Böyle bir aday yok: ${req.only}`, { status: 400 });
    return raceCandidates(list, {
      hedgeMs: this.config.gemini.hedgeMs,
      totalTimeoutMs: this.config.gemini.totalTimeoutMs,
      validate: req.validate,
    });
  }
}

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
    this.providers = Object.values(all).filter((p) => p.enabled);
  }

  get name() { return 'zincir'; }

  /**
   * Bu istek için tüm adaylar, AI_CHAIN sırasıyla.
   * AI_CHAIN girdileri sağlayıcı adı ("groq") ya da tek bir model ("gemini:gemini-3.5-flash") olabilir.
   * only = "groq" ya da "groq:model-adı" → sadece o aday(lar) (yarış betiği için).
   */
  candidates(req) {
    const entries = this.config.chain;
    const rank = (id) => {
      const i = entries.findIndex((e) => id === e || id.startsWith(e + ':'));
      return i < 0 ? entries.length : i;
    };
    // Basit işlerde (soru açıklama, serbest soru, konu anlatımı) güçlü Gemini modelini SONA al:
    // günlük hakkı az (ör. 20); sayfa okuma, cevap kontrolü ve çözüme kalsın.
    const strong = `gemini:${this.config.gemini.model}`;
    const key = (c) => (req.preferFast && c.id === strong ? Infinity : rank(c.id));
    let list = this.providers.flatMap((p) => p.candidates({ ...req, preferFast: false }))
      .map((c, i) => ({ c, i })).sort((a, b) => key(a.c) - key(b.c) || a.i - b.i).map((x) => x.c);
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

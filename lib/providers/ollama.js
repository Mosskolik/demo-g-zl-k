// =============================================================
// Ollama sağlayıcısı — İSKELET (ileride yerel model için)
//
// Ollama, bilgisayarında yapay zekâ modeli çalıştıran ücretsiz bir programdır.
// Kullanmak için:
//   1) https://ollama.com adresinden Ollama'yı kur
//   2) Terminalde:  ollama pull qwen2.5vl
//   3) .env dosyasına:  AI_PROVIDER=ollama
//   4) npm run dev  ile yerel sunucuyu başlat
//
// DİKKAT: Vercel bulutta çalıştığı için senin bilgisayarındaki Ollama'ya
// ulaşamaz. Bu sağlayıcı yalnızca yerel testte (npm run dev) veya Ollama'yı
// internete açık bir sunucuda çalıştırırsan işe yarar.
// =============================================================
import { AIProvider, ProviderError } from './AIProvider.js';

export class OllamaProvider extends AIProvider {
  constructor({ url, model }) {
    super();
    this.url = url.replace(/\/$/, '');
    this.model = model;
  }

  get name() { return 'ollama'; }

  async generate({ system, messages, image, jsonSchema }) {
    // Ollama'nın /api/chat biçimi: [{role, content, images:[base64]}]
    const msgs = [{ role: 'system', content: system }];
    messages.forEach((m, i) => {
      const msg = { role: m.role === 'model' ? 'assistant' : 'user', content: m.text };
      if (image && i === messages.length - 1) msg.images = [image.data];
      msgs.push(msg);
    });

    let res;
    try {
      res = await fetch(`${this.url}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages: msgs,
          stream: false,
          // Ollama JSON şemasını "format" alanında kabul eder
          ...(jsonSchema ? { format: toJsonSchema(jsonSchema) } : {}),
          options: { temperature: 0.3 },
        }),
      });
    } catch {
      throw new ProviderError('UNKNOWN', `Ollama'ya bağlanılamadı (${this.url}). Ollama açık mı?`, { status: 502 });
    }
    if (!res.ok) throw new ProviderError('UNKNOWN', `Ollama hatası: HTTP ${res.status}`, { status: 502 });
    const data = await res.json();
    return { text: data.message?.content || '', model: this.model };
  }
}

// Gemini şemasındaki büyük harfli tipleri (OBJECT, STRING) standart JSON Schema'ya çevirir
function toJsonSchema(s) {
  if (Array.isArray(s)) return s.map(toJsonSchema);
  if (s && typeof s === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(s)) out[k] = k === 'type' ? String(v).toLowerCase() : toJsonSchema(v);
    return out;
  }
  return s;
}

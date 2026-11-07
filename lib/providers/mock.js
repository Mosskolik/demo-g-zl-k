// =============================================================
// Sahte (mock) sağlayıcı — API anahtarı olmadan uygulamayı denemek için.
// Gerçek yapay zekâ çağırmaz, hazır cevaplar döner.
// Açmak için: AI_PROVIDER=mock
// =============================================================
import { AIProvider } from './AIProvider.js';

export class MockProvider extends AIProvider {
  get name() { return 'mock'; }

  async generate({ messages, jsonSchema }) {
    await new Promise((r) => setTimeout(r, 800)); // düşünüyormuş gibi bekle
    const last = messages[messages.length - 1]?.text || '';

    if (jsonSchema) {
      // Sayfa okuma cevabı
      return {
        model: 'mock',
        text: JSON.stringify({
          okunabilir: true,
          tur: 'soru',
          metin: 'Soru: x^2 - 5x + 6 = 0 denkleminin kökleri toplamı kaçtır? A) 5 B) 6 C) -5 D) 1',
          okunus: 'Soru şöyle: x kare eksi beş x artı altı eşittir sıfır denkleminin kökleri toplamı kaçtır? Seçenekler: A, beş. B, altı. C, eksi beş. D, bir.',
          not: '',
        }),
      };
    }
    if (/Öğrencinin cevabı/i.test(last)) {
      return { model: 'mock', text: /5|beş/i.test(last)
        ? 'Tebrikler, doğru! Çok güzel düşündün.'
        : 'Bu cevap doğru değil ama yaklaştın. Denklemin katsayılarını bir daha düşün. Hazır olunca yeni cevabını söyle.' };
    }
    if (/çöz/i.test(last)) { // çöz veya çözemedim
      return { model: 'mock', text: 'Birinci adım: Denklem x kare eksi beş x artı altı eşittir sıfır. İkinci adım: Çarpanlarına ayırırız: parantez aç x eksi iki parantez kapa, çarpı parantez aç x eksi üç parantez kapa. Üçüncü adım: Kökler iki ve üç. Toplamları beş. Cevap A şıkkı.' };
    }
    return { model: 'mock', text: 'Bu bir deneme cevabıdır. Sorduğun şey: ' + last.slice(0, 120) };
  }
}

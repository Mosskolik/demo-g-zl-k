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
      const kesik = process.env.MOCK_KESIK === '1';
      return {
        model: 'mock',
        text: JSON.stringify({
          okunabilir: true,
          tur: process.env.MOCK_TUR || 'soru', // MOCK_TUR=konu → konu anlatımı sayfası gibi davranır
          kesik,
          kesikKenarlar: kesik ? ['alt'] : [],
          yonlendirme: kesik ? 'Sayfanın alt kısmı kesik. Telefonu biraz yukarı kaldır.' : '',
          metin: 'Soru 1: x^2 - 5x + 6 = 0 köklerin toplamı? A) 5 B) 6  Soru 2: 2 + 3 = ? A) 5 B) 6',
          okunus: 'Üslü ifadeler konusu.',
          ortakBilgi: '', ortakOkunus: '',
          sorular: [
            { no: '1', tam: true, unite: 'Denklemler ve Eşitsizlikler', konu: 'ikinci dereceden denklemler', metin: 'x^2 - 5x + 6 = 0 köklerin toplamı? A) 5 B) 6', okunus: 'x kare eksi beş x artı altı eşittir sıfır denkleminin kökleri toplamı kaçtır? A şıkkı: beş. B şıkkı: altı.' },
            { no: '2', tam: true, metin: '2 + 3 = ? A) 5 B) 6', okunus: 'İki artı üç kaçtır? A şıkkı: beş. B şıkkı: altı.' },
            { no: '3', tam: !kesik, metin: '...', okunus: 'Üçüncü soru metni.' },
          ],
          not: '',
        }),
      };
    }
    if (/Bu soruyu bana açıkla/.test(last)) {
      return { model: 'mock', text: 'Bu soruyu sana açıklayayım. Verilenler şunlar: bir denklem. Senden istenen: kökler toplamı.' };
    }
    if (/konuyu bana anlat|Devam et/i.test(last)) {
      return { model: 'mock', text: 'İkinci dereceden denklemler, en büyük üssü iki olan denklemlerdir. Genel hâli a x kare artı b x artı c eşittir sıfır. Devam edeyim mi?' };
    }
    if (/Öğrencinin cevabı/i.test(last)) {
      return { model: 'mock', text: /5|beş/i.test(last)
        ? '<hesap>Kökler 2 ve 3, toplam 5. Öğrenci 5 dedi.</hesap>\n[DOĞRU]\nTebrikler, doğru! Çok güzel düşündün.'
        : '<hesap>Kökler 2 ve 3, toplam 5. Öğrenci başka dedi.</hesap>\n[YANLIŞ]\nHarika bir çaba, ama bu doğru cevap değil. Tekrar düşün, hazır olduğunda yine hazırım de.' };
    }
    if (/^(Bu soruyu adım adım çöz|Çözemedim, cevabı söyler misin)/.test(last)) { // sadece çözüm modu istekleri
      return { model: 'mock', text: 'Birinci adım: Denklem x kare eksi beş x artı altı eşittir sıfır. İkinci adım: Çarpanlarına ayırırız: parantez aç x eksi iki parantez kapa, çarpı parantez aç x eksi üç parantez kapa. Üçüncü adım: Kökler iki ve üç. Toplamları beş. Cevap A şıkkı.' };
    }
    return { model: 'mock', text: 'Bu bir deneme cevabıdır. Sorduğun şey: ' + last.slice(0, 120) };
  }
}

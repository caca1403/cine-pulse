import { renderIcons } from '../services/icons.js';
import { hasCompletedProductTour, completeProductTour, isProfileSetupComplete } from '../services/storage.js';

const TOUR_STEPS = [
  {
    icon: 'sparkles',
    eyebrow: 'CinePulse rehberi',
    title: 'İzlemeye hazır bir ana ekran',
    text: 'Ana sayfadaki satırları yatay kaydırarak yapımları gez. Arama simgesinden dizi veya film adını yazdığında sonuçlar anında görünür.',
    hint: 'Mobilde alt menüden Diziler, Filmler, Keşfet ve Listem’e geçebilirsin.'
  },
  {
    icon: 'clapperboard',
    eyebrow: 'Fragman önizleme',
    title: 'Karttan fragmana bak',
    text: 'Telefonda bir içerik kartına kısa süre basılı tut; fragman ekranın alt kısmında açılır. Bilgisayarda kartın üzerine gelmen yeterli.',
    hint: 'Önizlemeyi sağ üstteki çarpıdan kapatabilir, ses simgesinden sesi açabilirsin.'
  },
  {
    icon: 'list-plus',
    eyebrow: 'Kişisel liste',
    title: 'Listem senin kontrolünde',
    text: 'İçerik detayındaki artı düğmesiyle yapımları Listem’e ekle. Listem sayfasından kaydettiğin yapımları açabilir veya kaldırabilirsin.',
    hint: 'İzleme ilerlemen de aynı tarayıcıda otomatik hatırlanır.'
  },
  {
    icon: 'users-round',
    eyebrow: 'Birlikte Seç',
    title: 'Arkadaşınla aynı odada izle',
    text: 'Üstteki Birlikte Seç düğmesinden oda oluştur veya altı haneli kodla bir odaya katıl. Moderatör içerik ve kaynak seçer; odada emoji ve sohbet de kullanabilirsin.',
    hint: 'Oynatıcıdaki “Odaya dön” düğmesindeki rozet yeni sohbet mesajlarını gösterir.'
  },
  {
    icon: 'monitor-play',
    eyebrow: 'Oynatıcı',
    title: 'Kontroller elinin altında',
    text: 'İçeriği açınca ekrana bir kez dokunarak kontrolleri göster. Zaman çubuğundan sarabilir, kaynakları değiştirebilir, altyazı ve ses seçebilirsin.',
    hint: 'Tam ekran, ses ve parlaklık ayarları her cihazda sana ait kalır.'
  }
];

export function checkAndShowProductTour() {
  if (!isProfileSetupComplete() || hasCompletedProductTour()) return;
  if (document.getElementById('cinepulse-product-tour')) return;

  let activeStep = 0;
  const previousOverflow = document.body.style.overflow;
  const overlay = document.createElement('section');
  overlay.id = 'cinepulse-product-tour';
  overlay.className = 'product-tour-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'CinePulse kullanım rehberi');

  const closeTour = () => {
    completeProductTour();
    document.body.style.overflow = previousOverflow;
    overlay.classList.add('is-leaving');
    window.setTimeout(() => overlay.remove(), 180);
  };

  const render = () => {
    const step = TOUR_STEPS[activeStep];
    overlay.innerHTML = `
      <div class="product-tour-card">
        <button class="product-tour-skip" type="button" aria-label="Rehberi kapat">Geç <i data-lucide="x"></i></button>
        <div class="product-tour-icon"><i data-lucide="${step.icon}"></i></div>
        <p class="product-tour-eyebrow">${step.eyebrow}</p>
        <h2>${step.title}</h2>
        <p class="product-tour-text">${step.text}</p>
        <div class="product-tour-hint"><i data-lucide="lightbulb"></i><span>${step.hint}</span></div>
        <div class="product-tour-footer">
          <div class="product-tour-progress" aria-label="Adım ${activeStep + 1} / ${TOUR_STEPS.length}">
            ${TOUR_STEPS.map((_, index) => `<span class="${index === activeStep ? 'is-active' : ''}"></span>`).join('')}
          </div>
          <div class="product-tour-actions">
            ${activeStep > 0 ? '<button class="product-tour-back" type="button">Geri</button>' : ''}
            <button class="product-tour-next" type="button">${activeStep === TOUR_STEPS.length - 1 ? 'Hazırım' : 'Devam'} <i data-lucide="arrow-right"></i></button>
          </div>
        </div>
      </div>
    `;
    renderIcons(overlay);
    overlay.querySelector('.product-tour-skip')?.addEventListener('click', closeTour);
    overlay.querySelector('.product-tour-back')?.addEventListener('click', () => {
      activeStep = Math.max(0, activeStep - 1);
      render();
    });
    overlay.querySelector('.product-tour-next')?.addEventListener('click', () => {
      if (activeStep >= TOUR_STEPS.length - 1) closeTour();
      else {
        activeStep += 1;
        render();
      }
    });
  };

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  render();
}

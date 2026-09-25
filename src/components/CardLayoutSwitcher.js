import { getUserSettings, saveUserSettings } from '../services/storage.js';
import { upgradeLandscapeBackdrops } from './MediaCard.js';

const readyLayoutImages = new Set();

function getLayoutSource(img, layout) {
  return layout === 'landscape' ? (img.dataset.backdropSrc || img.src) : (img.dataset.posterSrc || img.src);
}

function applyLayoutImages(layout) {
  const isLandscape = layout === 'landscape';
  const images = document.querySelectorAll('.card-poster-img');
  
  images.forEach(img => {
    const nextSrc = isLandscape ? (img.dataset.backdropSrc || img.src) : (img.dataset.posterSrc || img.src);
    if (!nextSrc || img.src === nextSrc) return;

    img.src = nextSrc;
    img.dataset.activeLayout = layout;
  });
}

export function renderCardLayoutSwitcher() {
  const currentLayout = getUserSettings().cardLayout === 'landscape' ? 'landscape' : 'portrait';
  return `
    <div class="card-layout-switcher" id="card-layout-switcher" role="group" aria-label="Kart görünümü">
      <span class="card-layout-switcher-label">Kart Görünümü</span>
      <div class="card-layout-switcher-options">
        <button class="card-layout-option ${currentLayout === 'portrait' ? 'active' : ''}" data-layout="portrait" aria-pressed="${currentLayout === 'portrait'}">
          <i data-lucide="rectangle-vertical"></i><span>Dikey</span>
        </button>
        <button class="card-layout-option ${currentLayout === 'landscape' ? 'active' : ''}" data-layout="landscape" aria-pressed="${currentLayout === 'landscape'}">
          <i data-lucide="rectangle-horizontal"></i><span>Yatay</span>
        </button>
      </div>
    </div>
  `;
}

export function attachCardLayoutSwitcherEvents(container = document) {
  const switcher = container.querySelector('#card-layout-switcher');
  if (!switcher) return;

  const buttons = [...switcher.querySelectorAll('.card-layout-option')];

  // Silently warm opposite artwork in background during browser idle time
  const warmBackgroundArtwork = () => {
    if (!switcher.isConnected) return;
    upgradeLandscapeBackdrops(document, false);
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(warmBackgroundArtwork, { timeout: 1000 });
  } else {
    setTimeout(warmBackgroundArtwork, 300);
  }

  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const layout = button.dataset.layout === 'landscape' ? 'landscape' : 'portrait';
      const isLandscape = layout === 'landscape';
      const activeLayout = document.documentElement.classList.contains('cards-landscape') ? 'landscape' : 'portrait';
      if (layout === activeLayout) return;

      // 1. INSTANT DOM class toggle (0ms latency)
      document.documentElement.classList.toggle('cards-landscape', isLandscape);

      // 2. INSTANT button state update
      buttons.forEach(option => {
        const isActive = option.dataset.layout === layout;
        option.classList.toggle('active', isActive);
        option.setAttribute('aria-pressed', String(isActive));
      });

      // 3. INSTANT image source swap for all visible cards
      applyLayoutImages(layout);

      // 4. Save setting immediately
      saveUserSettings({ cardLayout: layout });

      // 5. Trigger immediate fanart / backdrop resolution for landscape
      if (isLandscape) {
        upgradeLandscapeBackdrops(document, true);
      }
    });
  });
}

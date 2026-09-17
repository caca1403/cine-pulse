import { getUserSettings, saveUserSettings } from '../services/storage.js';

const layoutImageCache = new Map();
const readyLayoutImages = new Set();
let layoutChangeToken = 0;

function preloadLayoutImage(url) {
  if (!url) return Promise.resolve(false);
  if (layoutImageCache.has(url)) return layoutImageCache.get(url);

  const request = new Promise(resolve => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = async () => {
      try { await image.decode(); } catch (_) {}
      readyLayoutImages.add(url);
      resolve(true);
    };
    image.onerror = () => {
      layoutImageCache.delete(url);
      resolve(false);
    };
    image.src = url;
  });
  layoutImageCache.set(url, request);
  return request;
}

function getLayoutSource(img, layout) {
  return layout === 'landscape' ? img.dataset.backdropSrc : img.dataset.posterSrc;
}

function getNearbyCardImages() {
  const preloadBoundary = window.innerHeight + 900;
  return [...document.querySelectorAll('.card-poster-img')].filter(img => {
    const rect = img.getBoundingClientRect();
    return rect.bottom > -300 && rect.top < preloadBoundary;
  });
}

function warmLayoutImages(layout) {
  return Promise.all(getNearbyCardImages().map(img => preloadLayoutImage(getLayoutSource(img, layout))));
}

function applyLayoutImages(layout) {
  document.querySelectorAll('.card-poster-img').forEach(img => {
    const nextSrc = getLayoutSource(img, layout);
    if (!nextSrc || img.src === nextSrc) return;
    if (!readyLayoutImages.has(nextSrc)) {
      img.classList.add('card-image-pending');
      img.addEventListener('load', () => img.classList.remove('card-image-pending'), { once: true });
    } else {
      img.classList.remove('card-image-pending');
    }
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

  // Warm the opposite artwork shortly after the cards become visible. Pointer
  // intent also starts the request before the user completes the click.
  const currentLayout = getUserSettings().cardLayout === 'landscape' ? 'landscape' : 'portrait';
  const oppositeLayout = currentLayout === 'landscape' ? 'portrait' : 'landscape';
  const warmOpposite = () => {
    if (switcher.isConnected) warmLayoutImages(oppositeLayout);
  };
  if (window.innerWidth > 768) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(warmOpposite, { timeout: 1400 });
    } else {
      window.setTimeout(warmOpposite, 450);
    }
  }

  buttons.forEach(button => {
    const requestedLayout = button.dataset.layout === 'landscape' ? 'landscape' : 'portrait';
    button.addEventListener('pointerenter', () => {
      if (switcher.isConnected) warmLayoutImages(requestedLayout);
    }, { passive: true });
    button.addEventListener('focus', () => {
      if (switcher.isConnected) warmLayoutImages(requestedLayout);
    }, { passive: true });

    button.addEventListener('click', async () => {
      const layout = button.dataset.layout === 'landscape' ? 'landscape' : 'portrait';
      const activeLayout = document.documentElement.classList.contains('cards-landscape') ? 'landscape' : 'portrait';
      if (layout === activeLayout || switcher.classList.contains('is-switching')) return;

      const token = ++layoutChangeToken;
      switcher.classList.add('is-switching');
      buttons.forEach(option => { option.disabled = true; });

      // Mobile taps must not wait for a batch of image downloads or a full-page
      // view-transition snapshot. Pending artwork loads in its new frame.
      const isMobile = window.innerWidth <= 768;
      if (!isMobile) {
        await Promise.race([
          warmLayoutImages(layout),
          new Promise(resolve => window.setTimeout(resolve, 1200))
        ]);
      }
      if (token !== layoutChangeToken || !switcher.isConnected) return;

      const commitLayout = () => {
        applyLayoutImages(layout);
        document.documentElement.classList.toggle('cards-landscape', layout === 'landscape');

        buttons.forEach(option => {
          const isActive = option.dataset.layout === layout;
          option.classList.toggle('active', isActive);
          option.setAttribute('aria-pressed', String(isActive));
        });
      };

      if (isMobile) {
        commitLayout();
      } else if (typeof document.startViewTransition === 'function') {
        const transition = document.startViewTransition(commitLayout);
        try { await transition.finished; } catch (_) {}
      } else {
        document.documentElement.classList.add('card-layout-changing');
        commitLayout();
        await new Promise(resolve => window.setTimeout(resolve, 280));
        document.documentElement.classList.remove('card-layout-changing');
      }

      saveUserSettings({ cardLayout: layout });
      switcher.classList.remove('is-switching');
      buttons.forEach(option => { option.disabled = false; });
    });
  });
}

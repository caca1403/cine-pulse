import { renderSiteLogo } from './components/BrandLogo.js';
import { resolveEntryHash } from './services/entryRoute.js';
import { applyPerfMode } from './services/performanceMode.js';
// Ilk boyamadan once agir efektleri kis (yazilimsal cizimde kasmayi onler).
applyPerfMode();
import './styles/navigation.css';
import './styles/collection.css';
import './styles/profile.css';
import { renderIcons } from './services/icons.js';
/* ==========================================================================
   CinePulse Pro - Main Application Router & Entry Point
   ========================================================================== */

import { renderNavbar, attachNavbarEvents } from './components/Navbar.js';
import { renderHomeView, clearHomeCache, cleanupHomeView } from './views/HomeView.js';
// Non-home views and first-run modals are loaded on demand (code splitting).
const loadView = {
  detail: () => import('./views/DetailView.js'),
  library: () => import('./views/LibraryView.js'),
  downloads: () => import('./views/DownloadsView.js'),
  discover: () => import('./views/DiscoverView.js'),
  popular: () => import('./views/PopularListView.js'),
  showcase: () => import('./views/ShowcaseView.js'),
  livetv: () => import('./views/LiveTvView.js'),
  drama: () => import('./views/DramaView.js')
};
import { trackScrollState, flushScrollState, restoreAllScrollState } from './services/scrollManager.js';
import { getUserSettings } from './services/storage.js';
import { renderCardLayoutSwitcher, placeCardLayoutSwitcher, attachCardLayoutSwitcherEvents } from './components/CardLayoutSwitcher.js';
import { openDecisionRoomModal } from './components/DecisionRoomModal.js';
import { initTraktAutoSync } from './services/traktService.js';
import { getWatchHistory, saveWatchProgress, saveBatchWatchProgress } from './services/storage.js';
import { initPlatformBridge, isNativeAndroidApp, isNativeAndroid, isAppPlatform, isDesktopApp, isWebPlatform } from './services/platformBridge.js';

// Platform Köprüsünü Çalıştır:
// Ortam tespitine göre Web, Android veya Desktop modüllerini dinamik yükler.
initPlatformBridge();

// Disable browser default scroll jump on SPA hash changes
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const app = document.getElementById('app');
document.body.classList.add('cine-discovery-theme');
document.documentElement.classList.toggle('cards-landscape', getUserSettings().cardLayout === 'landscape');

if (isNativeAndroidApp() && typeof navigator !== 'undefined' && navigator.onLine === false && window.location.hash !== '#downloads') {
  window.location.hash = '#downloads';
}

// Record scroll position continuously
window.addEventListener('scroll', () => {
  trackScrollState();
}, { passive: true });
window.addEventListener('pagehide', flushScrollState);

let routeGeneration = 0;
async function renderRoute() {
  const generation = ++routeGeneration;
  cleanupHomeView();
  flushScrollState();
  const hash = resolveEntryHash(window.location.hash, isAppPlatform(), new URLSearchParams(window.location.search).has('oda'));
  const isLanding = hash === '#showcase';
  document.body.classList.toggle('cp-landing-active', isLanding);
  document.title = isLanding ? 'CinePulse — Keşfet, Seç, Devam Et' : 'CinePulse - Modern Sinema & Dizi Platformu';
  let viewName = 'home';
  let params = {};

  if (hash.startsWith('#detail')) {
    viewName = 'detail';
    if (hash.includes('?')) {
      const queryStr = hash.split('?')[1] || '';
      const urlParams = new URLSearchParams(queryStr);
      params.type = urlParams.get('type') || 'tv';
      params.id = urlParams.get('id');
    } else if (hash.includes('/')) {
      const parts = hash.split('/');
      if (parts.length >= 3) {
        params.type = parts[1] || 'tv';
        params.id = parts[2];
      } else if (parts.length === 2) {
        params.type = 'tv';
        params.id = parts[1];
      }
    }
  } else if (hash === '#series') {
    viewName = 'series';
  } else if (hash === '#cartoons') {
    viewName = 'cartoons';
  } else if (hash === '#movies') {
    viewName = 'movies';
  } else if (hash === '#anime') {
    viewName = 'anime';
  } else if (hash === '#documentary') {
    viewName = 'documentary';
  } else if (hash === '#livetv') {
    // Canli TV yalnizca uygulamada (APK/EXE); webden gelinirse tanitima yonlendir
    if (!isAppPlatform()) {
      try {
        sessionStorage.setItem('cp_livetv_web_block', '1');
      } catch (_) {}
      window.location.replace('#showcase');
      return;
    }
    viewName = 'livetv';
  } else if (hash === '#discover') {
    viewName = 'discover';
  } else if (hash === '#library') {
    viewName = 'library';
  } else if (hash === '#showcase') {
    viewName = 'showcase';
  } else if (hash === '#downloads') {
    if (!isNativeAndroidApp()) {
      window.location.replace('#library');
      return;
    }
    viewName = 'downloads';
  } else if (hash.startsWith('#dramas')) {
    viewName = 'dramas';
    if (hash.includes('?')) {
      const queryStr = hash.split('?')[1] || '';
      const urlParams = new URLSearchParams(queryStr);
      params.slug = urlParams.get('slug');
      params.q = urlParams.get('q');
    }
  }

  window.__popularListCleanup?.();
  window.__popularListCleanup = null;
  window.__discoverCleanup?.();
  window.__discoverCleanup = null;

  // Clean up any running live TV stream or video before routing or unmounting DOM
  if (window.__LiveTvController && typeof window.__LiveTvController.cleanup === 'function') {
    window.__LiveTvController.cleanup();
  }
  document.querySelectorAll('video, audio').forEach(el => {
    try {
      el.pause();
      el.removeAttribute('src');
      el.load();
    } catch (_) {}
  });

  // Render Navbar for regular application views
  const navbarHTML = renderNavbar(viewName);
  const cardViews = new Set(['home', 'series', 'cartoons', 'movies', 'anime', 'documentary', 'discover', 'library']);
  const cardLayoutSwitcherHTML = cardViews.has(viewName) ? renderCardLayoutSwitcher() : '';

  if (viewName === 'home' || viewName === 'detail') {
    app.innerHTML = `${navbarHTML}<main class="route-loading" aria-live="polite"><div class="spin-loader"></div><span>İçerikler yükleniyor...</span></main>`;
    attachNavbarEvents();
    renderIcons(app);
  }

  let viewResult = null;
  if (viewName === 'home') {
    viewResult = await renderHomeView();
  } else if (viewName === 'detail') {
    const { renderDetailView } = await loadView.detail();
    viewResult = await renderDetailView(params.type, params.id);
  } else if (['series', 'cartoons', 'movies', 'anime', 'documentary'].includes(viewName)) {
    const listTypes = { series: 'tv', cartoons: 'cartoon', movies: 'movie', anime: 'anime', documentary: 'documentary' };
    const { renderPopularListView } = await loadView.popular();
    viewResult = await renderPopularListView(listTypes[viewName]);
  } else if (viewName === 'livetv') {
    const { renderLiveTvView } = await loadView.livetv();
    viewResult = renderLiveTvView();
  } else if (viewName === 'discover') {
    const { renderDiscoverView } = await loadView.discover();
    viewResult = await renderDiscoverView('tv');
  } else if (viewName === 'library') {
    const { renderLibraryView } = await loadView.library();
    viewResult = renderLibraryView();
  } else if (viewName === 'showcase') {
    const { renderShowcaseView } = await loadView.showcase();
    viewResult = renderShowcaseView();
  } else if (viewName === 'downloads') {
    const { renderDownloadsView } = await loadView.downloads();
    viewResult = renderDownloadsView();
  } else if (viewName === 'dramas') {
    const { renderDramaView } = await loadView.drama();
    viewResult = await renderDramaView(params.slug, params.q);
  }

  if (generation !== routeGeneration) return;
  if (isLanding) {
    app.innerHTML = viewResult.html;
    viewResult.init?.(app);
    window.scrollTo(0, 0);
    return;
  }
  app.innerHTML = `
    ${navbarHTML}
    ${cardLayoutSwitcherHTML}
    <main style="min-height: 85vh;">
      ${viewResult ? viewResult.html : '<h2>Sayfa Bulunamadı</h2>'}
    </main>
    
    <footer style="padding: 3rem 0; background: var(--bg-surface); border-top: 1px solid var(--border-color); margin-top: 5rem;">
      <div class="container" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
          ${renderSiteLogo('cp-footer-logo')}
          <span>Cine<span class="brand-highlight">Pulse</span></span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted);">
          Sunucusuz & Üyeliksiz Dizi & Film İzleme Platformu • Yerel Önbellek & JSON Aktarım Destekli
        </div>
      </div>
    </footer>
  `;

  // Attach navbar events
  attachNavbarEvents();
  placeCardLayoutSwitcher(app);
  attachCardLayoutSwitcherEvents(app);

  // Initialize view scripts & icons
  if (viewResult && viewResult.init) {
    viewResult.init(app);
  }

  if (window.lucide) {
    renderIcons();
  }

  // Restore horizontal and vertical scroll positions
  restoreAllScrollState(hash);
  scheduleProductGuides();
}

// Router Event Listeners
async function route() {
  const generation = routeGeneration + 1;
  try {
    await renderRoute();
  } catch (error) {
    if (generation !== routeGeneration) return;
    console.error('[Router] Sayfa yüklenemedi:', error);
    app.innerHTML = `${renderNavbar('home')}<main class="container" role="alert" style="padding:6rem 1rem"><p>Sayfa yüklenemedi. Yeniden deneyebilirsin.</p><button class="btn btn-primary" id="btn-route-retry">Yeniden Dene</button></main>`;
    attachNavbarEvents();
    app.querySelector('#btn-route-retry')?.addEventListener('click', route);
    renderIcons(app);
  }
}

window.addEventListener('hashchange', route);

// Keep saved videos one tap away when connectivity drops. `navigator.onLine`
// is used as a signal; downloaded playback itself remains available locally.
// Module scripts run after parsing, so one initial route is enough.
route();

// A shared room is intentionally ephemeral: the URL only identifies the live
// WebRTC rendezvous and no room record is created on the application server.
setTimeout(async () => {
  try {
    // Do this small URL check before importing the WebRTC code. It keeps the
    // room transport out of every normal page load.
    const roomCode = String(new URL(window.location.href).searchParams.get('oda') || '').replace(/\D/g, '');
    if (!/^\d{6}$/.test(roomCode)) return;
    openDecisionRoomModal({ roomCode });
  } catch (_) {}
}, 700);

// Defer profile setup and the product guide until the visitor enters the app.
let productGuidesScheduled = false;
function scheduleProductGuides() {
  if (productGuidesScheduled) return;
  productGuidesScheduled = true;
  setTimeout(async () => {
    if (document.body.classList.contains('cp-landing-active')) { productGuidesScheduled = false; return; }
    try {
      const { checkAndShowProfileOnboarding } = await import('./components/ProfileOnboardingModal.js');
      if (!document.body.classList.contains('cp-landing-active')) checkAndShowProfileOnboarding();
    } catch (_) {}
  }, 400);
  setTimeout(async () => {
    if (document.body.classList.contains('cp-landing-active')) return;
    try {
      const { checkAndShowProductTour } = await import('./components/ProductTour.js');
      if (!document.body.classList.contains('cp-landing-active')) checkAndShowProductTour();
    } catch (_) {}
  }, 1200);
}

// Keep Trakt synced on launch, after connecting, and when returning to the app.
const traktStorageMethods = { getWatchHistory, saveWatchProgress, saveBatchWatchProgress };
window.addEventListener('cinepulse_trakt_auth_changed', (event) => {
  if (event.detail?.connected) initTraktAutoSync(traktStorageMethods);
});
initTraktAutoSync(traktStorageMethods);

// Data change event listeners (Only reload whole route when backup data is imported or cleared)
const onExternalDataImport = (e) => {
  if (e && e.detail && (e.detail.action === 'import' || e.detail.cleared)) {
    route();
  }
};
window.addEventListener('sineflix_data_changed', onExternalDataImport);
window.addEventListener('cinepulse_data_changed', onExternalDataImport);

// Seamless Profile Switch Handler (Zero full page reload)
window.addEventListener('sineflix_profile_changed', async () => {
  clearHomeCache();
  await route();
});
window.addEventListener('storage', (event) => {
  if (event.key !== 'sineflix_user_settings_v1') return;
  const settings = getUserSettings();
  document.documentElement.classList.toggle('cards-landscape', settings.cardLayout === 'landscape');
  clearHomeCache();
  route();
});

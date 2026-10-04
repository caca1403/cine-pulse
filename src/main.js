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
  livetv: () => import('./views/LiveTvView.js'),
  admin: () => import('./views/AdminView.js'),
  drama: () => import('./views/DramaView.js')
};
import { trackScrollState, flushScrollState, restoreAllScrollState } from './services/scrollManager.js';
import { getUserSettings } from './services/storage.js';
import { renderCardLayoutSwitcher, attachCardLayoutSwitcherEvents } from './components/CardLayoutSwitcher.js';
import { grantAdminEntry, isAdminRouteAllowed } from './services/adminAccess.js';
import { openDecisionRoomModal } from './components/DecisionRoomModal.js';
import { initTraktAutoSync } from './services/traktService.js';
import { getWatchHistory, saveWatchProgress, saveBatchWatchProgress } from './services/storage.js';
import { initPlatformBridge, isNativeAndroidApp, isNativeAndroid } from './services/platformBridge.js';

// Platform Köprüsünü Çalıştır:
// Ortam tespitine göre Web veya Android platform modüllerini dinamik (lazy) yükler.
initPlatformBridge();

// Disable browser default scroll jump on SPA hash changes
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Private admin entry: Ctrl + Alt + Shift + F10. Kept at the application root
// so it is registered exactly once and works from every regular view.
window.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.altKey && event.shiftKey && event.key === 'F10') {
    event.preventDefault();
    event.stopImmediatePropagation();
    grantAdminEntry();
    window.location.hash = '#admin';
  }
}, true);

const app = document.getElementById('app');
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
async function route() {
  const generation = ++routeGeneration;
  cleanupHomeView();
  flushScrollState();
  const hash = window.location.hash || '#home';
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
    viewName = 'livetv';
  } else if (hash === '#discover') {
    viewName = 'discover';
  } else if (hash === '#library') {
    viewName = 'library';
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
  } else if (hash === '#admin') {
    // Access grants live only in module memory. Typing #admin or forging a
    // sessionStorage key can never open the authentication screen/dashboard.
    if (!isAdminRouteAllowed()) {
      window.location.replace('#home');
      return;
    }
    viewName = 'admin';
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

  // Dedicated Full-Screen Admin Screen (NO NAVBAR, NO BOTTOM DOCK, NO FOOTER)
  if (viewName === 'admin') {
    const { renderAdminView } = await loadView.admin();
    const viewResult = await renderAdminView();
    if (generation !== routeGeneration) return;
    app.innerHTML = `
      <div class="admin-standalone-wrapper" style="min-height: 100vh; background: #07090e; display: flex; flex-direction: column; width: 100%;">
        ${viewResult ? viewResult.html : ''}
      </div>
    `;
    if (viewResult && typeof viewResult.init === 'function') {
      viewResult.init(app);
    }
    renderIcons();
    return;
  }

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
  } else if (viewName === 'downloads') {
    const { renderDownloadsView } = await loadView.downloads();
    viewResult = renderDownloadsView();
  } else if (viewName === 'dramas') {
    const { renderDramaView } = await loadView.drama();
    viewResult = await renderDramaView(params.slug, params.q);
  }

  if (generation !== routeGeneration) return;
  app.innerHTML = `
    ${navbarHTML}
    ${cardLayoutSwitcherHTML}
    <main style="min-height: 85vh;">
      ${viewResult ? viewResult.html : '<h2>Sayfa Bulunamadı</h2>'}
    </main>
    
    <footer style="padding: 3rem 0; background: var(--bg-surface); border-top: 1px solid var(--border-color); margin-top: 5rem;">
      <div class="container" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem;">
          <div class="brand-logo-icon" style="width: 28px; height: 28px; border-radius: 8px;">
            <i data-lucide="clapperboard" style="width:15px; height:15px; color:#fff;"></i>
          </div>
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
}

// Router Event Listeners
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

// Check if first-time visitor needs to create their personal profile
setTimeout(async () => {
  try {
    const { checkAndShowProfileOnboarding } = await import('./components/ProfileOnboardingModal.js');
    checkAndShowProfileOnboarding();
  } catch (_) {}
}, 400);

// Profile setup is completed before this guide; it then explains the core
// parts of the product once and stores completion locally.
setTimeout(async () => {
  try {
    const { checkAndShowProductTour } = await import('./components/ProductTour.js');
    checkAndShowProductTour();
  } catch (_) {}
}, 1200);

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
window.addEventListener('cinepulse_admin_state_changed', route);
window.addEventListener('storage', (event) => {
  if (event.key !== 'sineflix_user_settings_v1') return;
  const settings = getUserSettings();
  document.documentElement.classList.toggle('cards-landscape', settings.cardLayout === 'landscape');
  clearHomeCache();
  route();
});

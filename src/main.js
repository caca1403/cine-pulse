import { renderIcons } from './services/icons.js';
/* ==========================================================================
   CinePulse Pro - Main Application Router & Entry Point
   ========================================================================== */

import { renderNavbar, attachNavbarEvents } from './components/Navbar.js';
import { renderHomeView, clearHomeCache, cleanupHomeView } from './views/HomeView.js';
import { renderDetailView } from './views/DetailView.js';
import { renderLibraryView } from './views/LibraryView.js';
import { renderDiscoverView } from './views/DiscoverView.js';
import { renderPopularListView } from './views/PopularListView.js';
import { renderLiveTvView } from './views/LiveTvView.js';
import { renderAdminView } from './views/AdminView.js';
import { renderDramaView } from './views/DramaView.js';
import { checkAndShowProfileOnboarding } from './components/ProfileOnboardingModal.js';
import { checkAndShowProductTour } from './components/ProductTour.js';
import { trackScrollState, flushScrollState, restoreAllScrollState } from './services/scrollManager.js';
import { initPwa } from './services/pwaManager.js';
import { getUserSettings } from './services/storage.js';
import { renderCardLayoutSwitcher, attachCardLayoutSwitcherEvents } from './components/CardLayoutSwitcher.js';
import { grantAdminEntry, isAdminRouteAllowed } from './services/adminAccess.js';
import { openDecisionRoomModal } from './components/DecisionRoomModal.js';
import { initTraktAutoSync } from './services/traktService.js';
import { getWatchHistory, saveWatchProgress } from './services/storage.js';

// Disable browser default scroll jump on SPA hash changes
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Register PWA Service Worker for Mobile Web App capabilities.
// Explicitly check for a new worker on every launch: mobile browsers otherwise
// may keep a previous JavaScript bundle for up to a day after deployment.
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    const workerBuild = '20260920-mobile-preview-2';
    const reloadMarker = `cinepulse-sw-reloaded-${workerBuild}`;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (sessionStorage.getItem(reloadMarker)) return;
      sessionStorage.setItem(reloadMarker, '1');
      window.location.reload();
    });
    navigator.serviceWorker.register(`/sw.js?build=${workerBuild}`, { updateViaCache: 'none' })
      .then((registration) => registration.update())
      .catch(() => {});
  });
}

// Initialize PWA installation events
initPwa();

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
    viewResult = await renderDetailView(params.type, params.id);
  } else if (viewName === 'series') {
    viewResult = await renderPopularListView('tv');
  } else if (viewName === 'cartoons') {
    viewResult = await renderPopularListView('cartoon');
  } else if (viewName === 'movies') {
    viewResult = await renderPopularListView('movie');
  } else if (viewName === 'anime') {
    viewResult = await renderPopularListView('anime');
  } else if (viewName === 'documentary') {
    viewResult = await renderPopularListView('documentary');
  } else if (viewName === 'livetv') {
    viewResult = renderLiveTvView();
  } else if (viewName === 'discover') {
    viewResult = await renderDiscoverView('tv');
  } else if (viewName === 'library') {
    viewResult = renderLibraryView();
  } else if (viewName === 'dramas') {
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
setTimeout(() => {
  checkAndShowProfileOnboarding();
}, 400);

// Profile setup is completed before this guide; it then explains the core
// parts of the product once and stores completion locally.
setTimeout(() => {
  checkAndShowProductTour();
}, 1200);

// Initialize background Trakt auto-sync if user has enabled it
initTraktAutoSync({ getWatchHistory, saveWatchProgress });

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

/* ==========================================================================
   Client-Side Security Shield & Anti-Inspection Guard
   Blocks right-click, DevTools shortcuts, view-source, and unauthorized probing.
   ========================================================================== */
(() => {
  // 1. Disable Right Click Context Menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  }, { capture: true });

  // 2. Admin & DevTools Key Guard
  window.addEventListener('keydown', (e) => {
    const keyStr = (e.key || '').toLowerCase();

    // Block F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }

    // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S
    if (e.ctrlKey || e.metaKey) {
      const k = keyStr;
      if (
        (e.shiftKey && (k === 'i' || k === 'j' || k === 'c')) ||
        k === 'u' ||
        k === 's'
      ) {
        e.preventDefault();
        return false;
      }
    }
  }, true);

  // 3. Prevent Drag & Drop Source Inspection
  document.addEventListener('dragstart', (e) => e.preventDefault());
})();

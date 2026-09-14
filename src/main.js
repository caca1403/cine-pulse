/* ==========================================================================
   CinePulse Pro - Main Application Router & Entry Point
   ========================================================================== */

import { renderNavbar, attachNavbarEvents } from './components/Navbar.js';
import { renderHomeView, clearHomeCache } from './views/HomeView.js';
import { renderDetailView } from './views/DetailView.js';
import { renderLibraryView } from './views/LibraryView.js';
import { renderDiscoverView } from './views/DiscoverView.js';
import { renderPopularListView } from './views/PopularListView.js';
import { renderLiveTvView } from './views/LiveTvView.js';
import { renderAdminView } from './views/AdminView.js';
import { checkAndShowProfileOnboarding } from './components/ProfileOnboardingModal.js';
import { saveAllScrollState, restoreAllScrollState } from './services/scrollManager.js';
import { initPwa } from './services/pwaManager.js';

// Disable browser default scroll jump on SPA hash changes
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Register PWA Service Worker for Mobile Web App capabilities
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// Initialize PWA installation events
initPwa();

const app = document.getElementById('app');

// Record scroll position continuously
window.addEventListener('scroll', () => {
  saveAllScrollState();
}, { passive: true });

async function route() {
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
  } else if (hash === '#admin') {
    viewName = 'admin';
  }

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
    app.innerHTML = `
      <div class="admin-standalone-wrapper" style="min-height: 100vh; background: #07090e; display: flex; flex-direction: column; width: 100%;">
        ${viewResult ? viewResult.html : ''}
      </div>
    `;
    if (viewResult && typeof viewResult.init === 'function') {
      viewResult.init(app);
    }
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // Render Navbar for regular application views
  const navbarHTML = renderNavbar(viewName);

  let viewResult = null;
  if (viewName === 'home') {
    viewResult = await renderHomeView();
  } else if (viewName === 'detail') {
    viewResult = await renderDetailView(params.type, params.id);
  } else if (viewName === 'series') {
    viewResult = await renderPopularListView('tv');
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
  }

  app.innerHTML = `
    ${navbarHTML}
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

  // Initialize view scripts & icons
  if (viewResult && viewResult.init) {
    viewResult.init(app);
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Restore horizontal and vertical scroll positions
  restoreAllScrollState(hash);
}

// Router Event Listeners
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);

// Immediate execution for module script execution
route();

// Check if first-time visitor needs to create their personal profile
setTimeout(() => {
  checkAndShowProfileOnboarding();
}, 400);

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
  document.addEventListener('keydown', (e) => {
    // Secret Admin Shortcuts: Alt+A OR Ctrl+Alt+A OR Ctrl+Shift+A
    const isAltA = e.altKey && (e.key === 'a' || e.key === 'A' || e.code === 'KeyA');
    const isCtrlShiftA = (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A' || e.code === 'KeyA');
    if (isAltA || isCtrlShiftA) {
      e.preventDefault();
      e.stopPropagation();
      sessionStorage.setItem('cinepulse_admin_unlocked', 'true');
      window.location.hash = '#admin';
      return false;
    }

    // Block F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }

    // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S
    if (e.ctrlKey || e.metaKey) {
      const k = (e.key || '').toLowerCase();
      if (
        (e.shiftKey && (k === 'i' || k === 'j' || k === 'c')) ||
        k === 'u' ||
        k === 's'
      ) {
        e.preventDefault();
        return false;
      }
    }
  }, { capture: true });

  // 3. Prevent Drag & Drop Source Inspection
  document.addEventListener('dragstart', (e) => e.preventDefault());
})();

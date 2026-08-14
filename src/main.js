/* ==========================================================================
   DiziBol Pro - Main Application Router & Entry Point
   ========================================================================== */

import { renderNavbar, attachNavbarEvents } from './components/Navbar.js';
import { renderHomeView } from './views/HomeView.js';
import { renderDetailView } from './views/DetailView.js';
import { renderLibraryView } from './views/LibraryView.js';
import { renderDiscoverView } from './views/DiscoverView.js';
import { renderPopularListView } from './views/PopularListView.js';
import { renderLiveTvView } from './views/LiveTvView.js';

const app = document.getElementById('app');

async function route() {
  const hash = window.location.hash || '#home';
  let viewName = 'home';
  let params = {};

  if (hash.startsWith('#detail')) {
    viewName = 'detail';
    const queryStr = hash.split('?')[1] || '';
    const urlParams = new URLSearchParams(queryStr);
    params.type = urlParams.get('type') || 'tv';
    params.id = urlParams.get('id');
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
  }

  // Render Navbar
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

  // Scroll to top on route change
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Router Event Listeners
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);

// Immediate execution for module script execution
route();

// Data change event listener (for auto UI refresh when JSON backup is loaded)
window.addEventListener('dizibol_data_changed', () => {
  route();
});

/* ==========================================================================
   DiziBol Pro - Library & Watch History View
   Displays cached watch history, favorites, watchlist, and JSON Backup trigger
   ========================================================================== */

import { getWatchHistory, getFavorites, getWatchlist, exportDataAsJSON } from '../services/storage.js';
import { renderMediaCard, attachMediaCardEvents } from '../components/MediaCard.js';
import { openDataManagerModal } from '../components/DataManagerModal.js';

export function renderLibraryView() {
  const history = getWatchHistory();
  const favorites = getFavorites();
  const watchlist = getWatchlist();

  const html = `
    <div class="library-view" style="padding-top: 6rem;">
      <div class="container">
        <!-- Header & Action Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 2.2rem; display: flex; align-items: center; gap: 0.75rem;">
              <i data-lucide="bookmark" style="color: var(--primary)"></i> Kitaplığım & İzleme Geçmişi
            </h1>
            <p style="color: var(--text-muted); font-size: 0.95rem;">Tüm verileriniz yerel tarayıcı hafızanızda güvende.</p>
          </div>

          <div style="display: flex; gap: 0.8rem;">
            <button id="lib-export-btn" class="btn-backup">
              <i data-lucide="download"></i> JSON İndir (Yedekle)
            </button>
            <button id="lib-data-modal-btn" class="btn-secondary" style="padding: 0.5rem 1rem;">
              <i data-lucide="settings"></i> Veri Yönetimi
            </button>
          </div>
        </div>

        <!-- Section Tabs: Geçmiş, Favoriler, Listem -->
        <div class="season-bar" id="library-tabs">
          <button class="season-btn active" data-tab="history">İzleme Geçmişi (${history.length})</button>
          <button class="season-btn" data-tab="favorites">Favorilerim (${favorites.length})</button>
          <button class="season-btn" data-tab="watchlist">İzleme Listesi (${watchlist.length})</button>
        </div>

        <!-- Tab 1: History Grid -->
        <div class="tab-content" id="tab-history">
          ${history.length === 0 ? `
            <div style="padding: 4rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md);">
              <i data-lucide="clock" style="width: 48px; height: 48px; opacity: 0.4; margin-bottom: 1rem;"></i>
              <h3>Henüz izleme geçmişiniz yok.</h3>
              <p style="font-size: 0.9rem; margin-top: 0.5rem;">Dizi veya film izlemeye başladığınızda burada otomatik görünecektir.</p>
            </div>
          ` : `
            <div class="media-grid">
              ${history.map(item => renderMediaCard(item)).join('')}
            </div>
          `}
        </div>

        <!-- Tab 2: Favorites Grid -->
        <div class="tab-content hidden" id="tab-favorites">
          ${favorites.length === 0 ? `
            <div style="padding: 4rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md);">
              <i data-lucide="heart" style="width: 48px; height: 48px; opacity: 0.4; margin-bottom: 1rem;"></i>
              <h3>Favorilerinize henüz yapım eklemediniz.</h3>
            </div>
          ` : `
            <div class="media-grid">
              ${favorites.map(item => renderMediaCard(item)).join('')}
            </div>
          `}
        </div>

        <!-- Tab 3: Watchlist Grid -->
        <div class="tab-content hidden" id="tab-watchlist">
          ${watchlist.length === 0 ? `
            <div style="padding: 4rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md);">
              <i data-lucide="plus-circle" style="width: 48px; height: 48px; opacity: 0.4; margin-bottom: 1rem;"></i>
              <h3>İzleme listeniz boş.</h3>
            </div>
          ` : `
            <div class="media-grid">
              ${watchlist.map(item => renderMediaCard(item)).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  return {
    html,
    init: (container) => {
      if (!container) return;

      // Tab switching handlers
      const tabs = container.querySelectorAll('#library-tabs .season-btn');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const target = tab.getAttribute('data-tab');
          container.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));
          const activeContent = container.querySelector(`#tab-${target}`);
          if (activeContent) activeContent.classList.remove('hidden');
        });
      });

      // Export JSON Button Handler
      const exportBtn = container.querySelector('#lib-export-btn');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => exportDataAsJSON());
      }

      // Open Data Manager Modal Handler
      const dataModalBtn = container.querySelector('#lib-data-modal-btn');
      if (dataModalBtn) {
        dataModalBtn.addEventListener('click', () => openDataManagerModal());
      }

      attachMediaCardEvents(container);
    }
  };
}

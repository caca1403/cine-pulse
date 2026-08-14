/* ==========================================================================
   CinePulse Studio - Library & Watch Analytics View
   Displays in-progress continue watching, completed watch history,
   user watch time statistics, favorites, watchlist, and JSON Data Management.
   ========================================================================== */

import { getWatchHistory, getContinueWatchingList, getCompletedWatchList, getFavorites, getWatchlist, getTotalWatchStats, exportDataAsJSON } from '../services/storage.js';
import { renderMediaCard, attachMediaCardEvents } from '../components/MediaCard.js';
import { openDataManagerModal } from '../components/DataManagerModal.js';

export function renderLibraryView() {
  const continueHistory = getContinueWatchingList();
  const completedHistory = getCompletedWatchList();
  const allHistory = getWatchHistory();
  const favorites = getFavorites();
  const watchlist = getWatchlist();
  const stats = getTotalWatchStats();

  const html = `
    <div class="library-view" style="padding-top: 6rem; padding-bottom: 5rem;">
      <div class="container">
        
        <!-- Header & Action Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 2.2rem; display: flex; align-items: center; gap: 0.75rem; font-weight: 800; letter-spacing: -0.02em;">
              <i data-lucide="bookmark" style="color: var(--primary)"></i> Kitaplığım & İzleme İstatistikleri
            </h1>
            <p style="color: var(--text-muted); font-size: 0.95rem;">İzleme geçmişiniz ve tercihleriniz yerel tarayıcı hafızanızda saklanır.</p>
          </div>

          <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
            <button id="lib-export-btn" class="btn-backup" style="padding: 0.55rem 1.1rem; border-radius: var(--radius-full);">
              <i data-lucide="download"></i> JSON İndir (Yedekle)
            </button>
            <button id="lib-data-modal-btn" class="btn-secondary" style="padding: 0.55rem 1.1rem; border-radius: var(--radius-full);">
              <i data-lucide="settings"></i> Veri Yönetimi
            </button>
          </div>
        </div>

        <!-- User Watch Analytics Stats Row -->
        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2.5rem;">
          
          <div class="stat-card" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.02)); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1.2rem; backdrop-filter: blur(10px);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(245, 158, 11, 0.15); display: flex; align-items: center; justify-content: center; color: #fbbf24; flex-shrink: 0;">
              <i data-lucide="clock" style="width: 24px; height: 24px;"></i>
            </div>
            <div>
              <div style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: #fbbf24; letter-spacing: 0.05em;">Toplam İzleme Süresi</div>
              <div style="font-size: 1.35rem; font-weight: 800; color: #fff; margin-top: 0.2rem;">${stats.formattedTotalTime}</div>
            </div>
          </div>

          <div class="stat-card" style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(56, 189, 248, 0.02)); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1.2rem; backdrop-filter: blur(10px);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(56, 189, 248, 0.15); display: flex; align-items: center; justify-content: center; color: #38bdf8; flex-shrink: 0;">
              <i data-lucide="tv-2" style="width: 24px; height: 24px;"></i>
            </div>
            <div>
              <div style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: #38bdf8; letter-spacing: 0.05em;">İzlenen Bölüm</div>
              <div style="font-size: 1.35rem; font-weight: 800; color: #fff; margin-top: 0.2rem;">${stats.episodesCount} Bölüm</div>
            </div>
          </div>

          <div class="stat-card" style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.02)); border: 1px solid rgba(168, 85, 247, 0.25); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1.2rem; backdrop-filter: blur(10px);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(168, 85, 247, 0.15); display: flex; align-items: center; justify-content: center; color: #c084fc; flex-shrink: 0;">
              <i data-lucide="film" style="width: 24px; height: 24px;"></i>
            </div>
            <div>
              <div style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: #c084fc; letter-spacing: 0.05em;">İzlenen Film</div>
              <div style="font-size: 1.35rem; font-weight: 800; color: #fff; margin-top: 0.2rem;">${stats.moviesCount} Film</div>
            </div>
          </div>

          <div class="stat-card" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.02)); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-lg); padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1.2rem; backdrop-filter: blur(10px);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(239, 68, 68, 0.15); display: flex; align-items: center; justify-content: center; color: #f87171; flex-shrink: 0;">
              <i data-lucide="heart" style="width: 24px; height: 24px;"></i>
            </div>
            <div>
              <div style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: #f87171; letter-spacing: 0.05em;">Favori & Listem</div>
              <div style="font-size: 1.35rem; font-weight: 800; color: #fff; margin-top: 0.2rem;">${favorites.length + watchlist.length} Yapım</div>
            </div>
          </div>

        </div>

        <!-- Section Tabs: Devam Et, Tamamlananlar, Favoriler, Listem, Tüm Bölümler -->
        <div class="season-bar" id="library-tabs" style="margin-bottom: 2rem;">
          <button class="season-btn active" data-tab="continue">İzlemeye Devam Et (${continueHistory.length})</button>
          <button class="season-btn" data-tab="completed">Tamamlananlar (${completedHistory.length})</button>
          <button class="season-btn" data-tab="favorites">Favorilerim (${favorites.length})</button>
          <button class="season-btn" data-tab="watchlist">İzleme Listesi (${watchlist.length})</button>
          <button class="season-btn" data-tab="all-episodes">Tüm Bölüm Geçmişi (${allHistory.length})</button>
        </div>

        <!-- Tab 1: Continue Watching (In-Progress Only) -->
        <div class="tab-content" id="tab-continue">
          ${continueHistory.length === 0 ? `
            <div style="padding: 4rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md);">
              <i data-lucide="clock" style="width: 48px; height: 48px; opacity: 0.4; margin-bottom: 1rem;"></i>
              <h3>Yarım kalan içerik yok.</h3>
              <p style="font-size: 0.9rem; margin-top: 0.5rem;">Dizi veya film izlemeye başladığınızda burada otomatik görünecektir.</p>
            </div>
          ` : `
            <div class="media-grid">
              ${continueHistory.map(item => renderMediaCard(item)).join('')}
            </div>
          `}
        </div>

        <!-- Tab 2: Completed / Finished Watch List -->
        <div class="tab-content hidden" id="tab-completed">
          ${completedHistory.length === 0 ? `
            <div style="padding: 4rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md);">
              <i data-lucide="check-circle-2" style="width: 48px; height: 48px; opacity: 0.4; margin-bottom: 1rem; color: #10b981;"></i>
              <h3>Henüz tamamlanmış içerik bulunmuyor.</h3>
              <p style="font-size: 0.9rem; margin-top: 0.5rem;">İzlediğiniz filmler ve bitirdiğiniz diziler burada listelenir.</p>
            </div>
          ` : `
            <div class="media-grid">
              ${completedHistory.map(item => renderMediaCard(item)).join('')}
            </div>
          `}
        </div>

        <!-- Tab 3: Favorites Grid -->
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

        <!-- Tab 4: Watchlist Grid -->
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

        <!-- Tab 5: All Episodes Breakdown -->
        <div class="tab-content hidden" id="tab-all-episodes">
          ${allHistory.length === 0 ? `
            <div style="padding: 4rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md);">
              <i data-lucide="list-checks" style="width: 48px; height: 48px; opacity: 0.4; margin-bottom: 1rem;"></i>
              <h3>Bölüm geçmişi boş.</h3>
            </div>
          ` : `
            <div class="media-grid">
              ${allHistory.map(item => renderMediaCard(item)).join('')}
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

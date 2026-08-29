/* ==========================================================================
   CinePulse Studio - Library & Watch Analytics View
   Displays in-progress continue watching, completed watch history,
   user watch time statistics, favorites, watchlist, and JSON Data Management.
   Features live search, type filters (Dizi/Film/Anime), multi-criteria sorting,
   and touch-friendly deletion controls.
   ========================================================================== */

import {
  getWatchHistory,
  getContinueWatchingList,
  getCompletedWatchList,
  getFavorites,
  getWatchlist,
  getTotalWatchStats,
  exportDataAsJSON,
  importDataFromJSON,
  removeEpisodeFromHistory,
  removeSeriesFromHistory,
  removeFavorite,
  removeWatchlist,
  clearCompletedHistory,
  clearAllWatchHistory
} from '../services/storage.js';
import { renderMediaCard, attachMediaCardEvents, determineMediaType } from '../components/MediaCard.js';
import { openDataManagerModal } from '../components/DataManagerModal.js';
import { showToast } from '../components/Toast.js';

function renderLibraryCard(item, tabType) {
  const resolvedType = determineMediaType(item);
  return `
    <div class="continue-card-wrapper library-card-item" 
         data-id="${item.id}" 
         data-season="${item.season || 1}" 
         data-episode="${item.episode || 1}" 
         data-tab="${tabType}"
         data-type="${resolvedType}"
         data-title="${encodeURIComponent(item.title || item.name || 'İçerik')}"
         data-rating="${item.vote_average || item.voteAverage || item.rating || 0}"
         data-year="${(item.release_date || item.first_air_date || item.year || '2024').substring(0, 4)}">
      ${renderMediaCard({ ...item, type: resolvedType }, { isContinueSection: tabType === 'continue' })}
      <button class="btn-delete-history btn-lib-delete" title="Listeden / Geçmişten Sil" aria-label="Sil">
        <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
      </button>
    </div>
  `;
}

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
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.8rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 2.2rem; display: flex; align-items: center; gap: 0.75rem; font-weight: 800; letter-spacing: -0.02em;">
              <i data-lucide="bookmark" style="color: var(--primary)"></i> Kitaplığım & İstatistikler
            </h1>
            <p style="color: var(--text-muted); font-size: 0.95rem;">İzleme geçmişiniz, bitirdikleriniz ve tercihleriniz yerel tarayıcı hafızanızda güvendedir.</p>
          </div>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
            <button id="lib-export-btn" class="btn-backup" style="padding: 0.55rem 1.1rem; border-radius: var(--radius-full);">
              <i data-lucide="download"></i> JSON İndir (Yedekle)
            </button>
            <button id="lib-import-btn" class="btn-secondary" style="padding: 0.55rem 1.1rem; border-radius: var(--radius-full); background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.35); color: #10b981;">
              <i data-lucide="upload"></i> JSON Yükle (Aktar)
            </button>
            <input type="file" id="lib-file-input" accept=".json,application/json,text/plain" style="display: none;" />
            <button id="lib-data-modal-btn" class="btn-secondary" style="padding: 0.55rem 1.1rem; border-radius: var(--radius-full);">
              <i data-lucide="settings"></i> Veri Yönetimi
            </button>
          </div>
        </div>

        <!-- User Watch Analytics Stats Row -->
        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2.2rem;">
          
          <div class="stat-card" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.02)); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: var(--radius-lg); padding: 1.2rem 1.4rem; display: flex; align-items: center; gap: 1.1rem; backdrop-filter: blur(10px);">
            <div style="width: 46px; height: 46px; border-radius: 12px; background: rgba(245, 158, 11, 0.15); display: flex; align-items: center; justify-content: center; color: #fbbf24; flex-shrink: 0;">
              <i data-lucide="clock" style="width: 22px; height: 22px;"></i>
            </div>
            <div>
              <div style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; color: #fbbf24; letter-spacing: 0.05em;">Toplam İzleme Süresi</div>
              <div id="stat-total-time" style="font-size: 1.35rem; font-weight: 800; color: #fff; margin-top: 0.15rem;">${stats.formattedTotalTime}</div>
            </div>
          </div>

          <div class="stat-card" style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(56, 189, 248, 0.02)); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: var(--radius-lg); padding: 1.2rem 1.4rem; display: flex; align-items: center; gap: 1.1rem; backdrop-filter: blur(10px);">
            <div style="width: 46px; height: 46px; border-radius: 12px; background: rgba(56, 189, 248, 0.15); display: flex; align-items: center; justify-content: center; color: #38bdf8; flex-shrink: 0;">
              <i data-lucide="tv-2" style="width: 22px; height: 22px;"></i>
            </div>
            <div>
              <div style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; color: #38bdf8; letter-spacing: 0.05em;">İzlenen Bölüm</div>
              <div id="stat-episodes-count" style="font-size: 1.35rem; font-weight: 800; color: #fff; margin-top: 0.15rem;">${stats.episodesCount} Bölüm</div>
            </div>
          </div>

          <div class="stat-card" style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(168, 85, 247, 0.02)); border: 1px solid rgba(168, 85, 247, 0.25); border-radius: var(--radius-lg); padding: 1.2rem 1.4rem; display: flex; align-items: center; gap: 1.1rem; backdrop-filter: blur(10px);">
            <div style="width: 46px; height: 46px; border-radius: 12px; background: rgba(168, 85, 247, 0.15); display: flex; align-items: center; justify-content: center; color: #c084fc; flex-shrink: 0;">
              <i data-lucide="film" style="width: 22px; height: 22px;"></i>
            </div>
            <div>
              <div style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; color: #c084fc; letter-spacing: 0.05em;">İzlenen Film</div>
              <div id="stat-movies-count" style="font-size: 1.35rem; font-weight: 800; color: #fff; margin-top: 0.15rem;">${stats.moviesCount} Film</div>
            </div>
          </div>

          <div class="stat-card" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(239, 68, 68, 0.02)); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-lg); padding: 1.2rem 1.4rem; display: flex; align-items: center; gap: 1.1rem; backdrop-filter: blur(10px);">
            <div style="width: 46px; height: 46px; border-radius: 12px; background: rgba(239, 68, 68, 0.15); display: flex; align-items: center; justify-content: center; color: #f87171; flex-shrink: 0;">
              <i data-lucide="heart" style="width: 22px; height: 22px;"></i>
            </div>
            <div>
              <div style="font-size: 0.78rem; text-transform: uppercase; font-weight: 700; color: #f87171; letter-spacing: 0.05em;">Favori & Listem</div>
              <div id="stat-favs-count" style="font-size: 1.35rem; font-weight: 800; color: #fff; margin-top: 0.15rem;">${favorites.length + watchlist.length} Yapım</div>
            </div>
          </div>

        </div>

        <!-- Section Tabs: Devam Et, Tamamlananlar, Favoriler, Listem, Tüm Bölümler -->
        <div class="library-segmented-nav-track" id="library-tabs">
          <button class="lib-nav-tab active" data-tab="continue">
            <i data-lucide="clock"></i>
            <span>Devam Et</span>
            <span class="lib-tab-badge" id="tab-count-continue">${continueHistory.length}</span>
          </button>
          <button class="lib-nav-tab" data-tab="completed">
            <i data-lucide="check-circle-2"></i>
            <span>Tamamlananlar</span>
            <span class="lib-tab-badge" id="tab-count-completed">${completedHistory.length}</span>
          </button>
          <button class="lib-nav-tab" data-tab="favorites">
            <i data-lucide="heart"></i>
            <span>Favorilerim</span>
            <span class="lib-tab-badge" id="tab-count-favorites">${favorites.length}</span>
          </button>
          <button class="lib-nav-tab" data-tab="watchlist">
            <i data-lucide="plus-circle"></i>
            <span>İzleme Listesi</span>
            <span class="lib-tab-badge" id="tab-count-watchlist">${watchlist.length}</span>
          </button>
          <button class="lib-nav-tab" data-tab="all-episodes">
            <i data-lucide="list-checks"></i>
            <span>Bölüm Geçmişi</span>
            <span class="lib-tab-badge" id="tab-count-all-episodes">${allHistory.length}</span>
          </button>
        </div>

        <!-- Library Luxury Toolbar Deck (Search, Type Filters, Sort & Batch Actions) -->
        <div class="library-toolbar-deck">
          <div class="library-toolbar-top-row">
            <!-- Search Pill -->
            <div class="library-search-wrapper">
              <i data-lucide="search" class="library-search-icon"></i>
              <input type="text" id="lib-search-input" class="library-search-input" placeholder="Kitaplıkta ara..." autocomplete="off" />
              <i data-lucide="x" id="lib-search-clear" class="library-search-clear" title="Temizle"></i>
            </div>

            <!-- Sort Select Pill -->
            <div class="library-sort-pill-wrap">
              <i data-lucide="arrow-down-up" class="library-sort-icon"></i>
              <select id="lib-sort-select" class="library-sort-select" aria-label="Sırala">
                <option value="recent">Son Eklenen</option>
                <option value="rating-desc">En Yüksek IMDb</option>
                <option value="title-asc">İsim (A-Z)</option>
                <option value="year-desc">Yıla Göre</option>
              </select>
            </div>

            <button id="lib-batch-clear-btn" class="btn-lib-clear-batch hidden" title="Bu listedeki tüm kayıtları temizle">
              <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
              <span>Temizle</span>
            </button>
          </div>

          <!-- Horizontal Smooth Scrollable Filter Segment (Never Wraps!) -->
          <div class="library-filter-segment-track" id="lib-type-filters">
            <button class="lib-segment-btn active" data-filter="all">Tümü</button>
            <button class="lib-segment-btn" data-filter="movie">🎬 Filmler</button>
            <button class="lib-segment-btn" data-filter="tv">📺 Diziler</button>
            <button class="lib-segment-btn" data-filter="anime">🎌 Animeler</button>
          </div>
        </div>

        <!-- Tab 1: Continue Watching (In-Progress Only) -->
        <div class="tab-content" id="tab-continue">
          ${continueHistory.length === 0 ? `
            <div class="library-empty-state" style="padding: 4rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed rgba(255,255,255,0.08);">
              <i data-lucide="clock" style="width: 48px; height: 48px; opacity: 0.4; margin-bottom: 1rem; color: #fbbf24;"></i>
              <h3 style="color:#fff; font-size:1.15rem;">Yarım kalan içerik yok.</h3>
              <p style="font-size: 0.9rem; margin-top: 0.5rem;">Dizi veya film izlemeye başladığınızda kaldığınız dakika burada otomatik listelenir.</p>
            </div>
          ` : `
            <div class="media-grid" id="grid-continue">
              ${continueHistory.map(item => renderLibraryCard(item, 'continue')).join('')}
            </div>
          `}
        </div>

        <!-- Tab 2: Completed / Finished Watch List -->
        <div class="tab-content hidden" id="tab-completed">
          ${completedHistory.length === 0 ? `
            <div class="library-empty-state" style="padding: 4rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed rgba(255,255,255,0.08);">
              <i data-lucide="check-circle-2" style="width: 48px; height: 48px; opacity: 0.4; margin-bottom: 1rem; color: #10b981;"></i>
              <h3 style="color:#fff; font-size:1.15rem;">Henüz tamamlanmış içerik bulunmuyor.</h3>
              <p style="font-size: 0.9rem; margin-top: 0.5rem;">İzleyip bitirdiğiniz filmler ve tüm sezonlarını tamamladığınız diziler burada listelenir.</p>
            </div>
          ` : `
            <div class="media-grid" id="grid-completed">
              ${completedHistory.map(item => renderLibraryCard(item, 'completed')).join('')}
            </div>
          `}
        </div>

        <!-- Tab 3: Favorites Grid -->
        <div class="tab-content hidden" id="tab-favorites">
          ${favorites.length === 0 ? `
            <div class="library-empty-state" style="padding: 4rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed rgba(255,255,255,0.08);">
              <i data-lucide="heart" style="width: 48px; height: 48px; opacity: 0.4; margin-bottom: 1rem; color: #f87171;"></i>
              <h3 style="color:#fff; font-size:1.15rem;">Favorilerinize henüz yapım eklemediniz.</h3>
              <p style="font-size: 0.9rem; margin-top: 0.5rem;">Beğendiğiniz dizi ve filmleri favorilere ekleyerek bu alandan hızlıca erişebilirsiniz.</p>
            </div>
          ` : `
            <div class="media-grid" id="grid-favorites">
              ${favorites.map(item => renderLibraryCard(item, 'favorites')).join('')}
            </div>
          `}
        </div>

        <!-- Tab 4: Watchlist Grid -->
        <div class="tab-content hidden" id="tab-watchlist">
          ${watchlist.length === 0 ? `
            <div class="library-empty-state" style="padding: 4rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed rgba(255,255,255,0.08);">
              <i data-lucide="plus-circle" style="width: 48px; height: 48px; opacity: 0.4; margin-bottom: 1rem; color: #38bdf8;"></i>
              <h3 style="color:#fff; font-size:1.15rem;">İzleme listeniz boş.</h3>
              <p style="font-size: 0.9rem; margin-top: 0.5rem;">Daha sonra izlemek istediğiniz içerikleri listenize ekleyebilirsiniz.</p>
            </div>
          ` : `
            <div class="media-grid" id="grid-watchlist">
              ${watchlist.map(item => renderLibraryCard(item, 'watchlist')).join('')}
            </div>
          `}
        </div>

        <!-- Tab 5: All Episodes Breakdown -->
        <div class="tab-content hidden" id="tab-all-episodes">
          ${allHistory.length === 0 ? `
            <div class="library-empty-state" style="padding: 4rem; text-align: center; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed rgba(255,255,255,0.08);">
              <i data-lucide="list-checks" style="width: 48px; height: 48px; opacity: 0.4; margin-bottom: 1rem; color: #c084fc;"></i>
              <h3 style="color:#fff; font-size:1.15rem;">Bölüm geçmişi boş.</h3>
              <p style="font-size: 0.9rem; margin-top: 0.5rem;">Oynatılan veya tek tek işaretlenen tüm bölümler burada saklanır.</p>
            </div>
          ` : `
            <div class="media-grid" id="grid-all-episodes">
              ${allHistory.map(item => renderLibraryCard(item, 'all-episodes')).join('')}
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

      let currentTab = 'continue';
      let currentTypeFilter = 'all';
      let currentSort = 'recent';
      let searchQuery = '';

      const searchInput = container.querySelector('#lib-search-input');
      const searchClear = container.querySelector('#lib-search-clear');
      const sortSelect = container.querySelector('#lib-sort-select');
      const batchClearBtn = container.querySelector('#lib-batch-clear-btn');

      // Filter and Sort Engine for Active Tab
      const applyFilterAndSort = () => {
        const activeContent = container.querySelector(`#tab-${currentTab}`);
        if (!activeContent) return;

        const grid = activeContent.querySelector('.media-grid');
        if (!grid) return;

        const cards = Array.from(grid.querySelectorAll('.library-card-item'));
        let visibleCount = 0;

        cards.forEach(card => {
          const title = decodeURIComponent(card.getAttribute('data-title') || '').toLowerCase();
          const type = card.getAttribute('data-type') || 'movie';

          const matchesSearch = !searchQuery || title.includes(searchQuery.toLowerCase());
          const matchesType = currentTypeFilter === 'all' || type === currentTypeFilter;

          if (matchesSearch && matchesType) {
            card.style.display = '';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        // Sort visible cards inside the DOM
        const visibleCards = cards.filter(c => c.style.display !== 'none');
        visibleCards.sort((a, b) => {
          if (currentSort === 'rating-desc') {
            const rA = parseFloat(a.getAttribute('data-rating') || '0');
            const rB = parseFloat(b.getAttribute('data-rating') || '0');
            return rB - rA;
          } else if (currentSort === 'title-asc') {
            const tA = decodeURIComponent(a.getAttribute('data-title') || '');
            const tB = decodeURIComponent(b.getAttribute('data-title') || '');
            return tA.localeCompare(tB, 'tr');
          } else if (currentSort === 'year-desc') {
            const yA = parseInt(a.getAttribute('data-year') || '0', 10);
            const yB = parseInt(b.getAttribute('data-year') || '0', 10);
            return yB - yA;
          }
          return 0; // Default recent order
        });

        visibleCards.forEach(card => grid.appendChild(card));

        // Update Batch Clear button visibility
        if (batchClearBtn) {
          if (currentTab === 'completed' || currentTab === 'all-episodes' || currentTab === 'continue') {
            batchClearBtn.classList.remove('hidden');
            const labelSpan = batchClearBtn.querySelector('span');
            if (labelSpan) {
              if (currentTab === 'completed') labelSpan.textContent = 'Tamamlananları Temizle';
              else if (currentTab === 'continue') labelSpan.textContent = 'Devam Listesini Temizle';
              else labelSpan.textContent = 'Tüm Geçmişi Temizle';
            }
          } else {
            batchClearBtn.classList.add('hidden');
          }
        }
      };

      // Tab switching handlers
      const tabs = container.querySelectorAll('#library-tabs .lib-nav-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          currentTab = tab.getAttribute('data-tab');
          container.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));
          const activeContent = container.querySelector(`#tab-${currentTab}`);
          if (activeContent) activeContent.classList.remove('hidden');

          applyFilterAndSort();
        });
      });

      // Search input handler
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          searchQuery = e.target.value.trim();
          if (searchClear) {
            searchClear.style.display = searchQuery ? 'block' : 'none';
          }
          applyFilterAndSort();
        });
      }

      if (searchClear) {
        searchClear.addEventListener('click', () => {
          if (searchInput) {
            searchInput.value = '';
            searchQuery = '';
            searchClear.style.display = 'none';
            applyFilterAndSort();
            searchInput.focus();
          }
        });
      }

      // Type Filter Segment handler
      const filterPills = container.querySelectorAll('#lib-type-filters .lib-segment-btn');
      filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
          filterPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          currentTypeFilter = pill.getAttribute('data-filter') || 'all';
          applyFilterAndSort();
        });
      });

      // Sorting handler
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          currentSort = e.target.value;
          applyFilterAndSort();
        });
      }

      // Batch Clear Button Handler
      if (batchClearBtn) {
        batchClearBtn.addEventListener('click', () => {
          let confirmMsg = 'Bu listedeki tüm kayıtları silmek istediğinize emin misiniz?';
          if (currentTab === 'completed') {
            confirmMsg = 'Tamamlananlar listesindeki tüm kayıtlar temizlensin mi?';
          } else if (currentTab === 'continue') {
            confirmMsg = 'İzlemeye devam et listesindeki tüm yarım kalanlar temizlensin mi?';
          } else if (currentTab === 'all-episodes') {
            confirmMsg = 'Tüm bölüm izleme geçmişiniz sıfırlansın mı?';
          }

          if (window.confirm(confirmMsg)) {
            if (currentTab === 'completed') {
              clearCompletedHistory();
            } else if (currentTab === 'continue') {
              clearCompletedHistory();
            } else if (currentTab === 'all-episodes') {
              clearAllWatchHistory();
            }

            showToast('✓ Liste başarıyla temizlendi.', 'success');
            
            // Refresh stats & tab counts
            const updatedStats = getTotalWatchStats();
            const elTime = container.querySelector('#stat-total-time');
            const elEp = container.querySelector('#stat-episodes-count');
            const elMov = container.querySelector('#stat-movies-count');
            const elFav = container.querySelector('#stat-favs-count');
            if (elTime) elTime.textContent = updatedStats.formattedTotalTime;
            if (elEp) elEp.textContent = `${updatedStats.episodesCount} Bölüm`;
            if (elMov) elMov.textContent = `${updatedStats.moviesCount} Film`;
            if (elFav) elFav.textContent = `${getFavorites().length + getWatchlist().length} Yapım`;

            const activeContent = container.querySelector(`#tab-${currentTab}`);
            if (activeContent) {
              const grid = activeContent.querySelector('.media-grid');
              if (grid) grid.innerHTML = '';
            }

            const cCont = container.querySelector('#tab-count-continue');
            const cComp = container.querySelector('#tab-count-completed');
            const cAll = container.querySelector('#tab-count-all-episodes');
            if (cCont) cCont.textContent = getContinueWatchingList().length;
            if (cComp) cComp.textContent = getCompletedWatchList().length;
            if (cAll) cAll.textContent = getWatchHistory().length;
          }
        });
      }

      // Export JSON Button Handler
      const exportBtn = container.querySelector('#lib-export-btn');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => exportDataAsJSON());
      }

      // Quick Import JSON Button Handler
      const importBtn = container.querySelector('#lib-import-btn');
      const fileInput = container.querySelector('#lib-file-input');
      if (importBtn && fileInput) {
        importBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
              const res = importDataFromJSON(event.target.result, 'merge');
              if (res.success) {
                showToast(`✓ Yedek başarıyla yüklendi! (${res.countHistory} izleme, ${res.countFavs} favori aktarıldı)`, 'success');
              } else {
                showToast(`Yükleme hatası: ${res.message || res.error}`, 'error');
              }
            };
            reader.onerror = () => showToast('Dosya okunamadı.', 'error');
            reader.readAsText(file);
          }
        });
      }

      // Open Data Manager Modal Handler
      const dataModalBtn = container.querySelector('#lib-data-modal-btn');
      if (dataModalBtn) {
        dataModalBtn.addEventListener('click', () => openDataManagerModal());
      }

      // Safe Item & Episode Deletion with Confirmation
      container.querySelectorAll('.btn-lib-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const wrapper = btn.closest('.library-card-item');
          if (!wrapper) return;

          const id = wrapper.getAttribute('data-id');
          const season = parseInt(wrapper.getAttribute('data-season') || '1', 10);
          const episode = parseInt(wrapper.getAttribute('data-episode') || '1', 10);
          const tab = wrapper.getAttribute('data-tab');
          const title = decodeURIComponent(wrapper.getAttribute('data-title') || 'İçerik');

          let confirmMsg = `"${title}" kaydını silmek istediğinize emin misiniz?`;
          if (tab === 'all-episodes') {
            confirmMsg = `"${title}" (Sezon ${season}, Bölüm ${episode}) izleme geçmişinizden silinsin mi?`;
          } else if (tab === 'continue') {
            confirmMsg = `"${title}" devam et listesinden kaldırılsın mı?`;
          } else if (tab === 'completed') {
            confirmMsg = `"${title}" tamamlananlar geçmişinden silinsin mi?`;
          } else if (tab === 'favorites') {
            confirmMsg = `"${title}" favorilerinizden kaldırılsın mı?`;
          } else if (tab === 'watchlist') {
            confirmMsg = `"${title}" izleme listenizden kaldırılsın mı?`;
          }

          if (window.confirm(confirmMsg)) {
            if (tab === 'all-episodes') {
              removeEpisodeFromHistory(id, season, episode);
            } else if (tab === 'continue' || tab === 'completed') {
              removeSeriesFromHistory(id);
            } else if (tab === 'favorites') {
              removeFavorite(id);
            } else if (tab === 'watchlist') {
              removeWatchlist(id);
            }

            showToast('✓ Kayıt başarıyla silindi.', 'success');

            wrapper.style.transition = 'all 0.28s ease-out';
            wrapper.style.transform = 'scale(0.85)';
            wrapper.style.opacity = '0';
            setTimeout(() => {
              wrapper.remove();

              // Refresh stats & tab counts dynamically
              const updatedStats = getTotalWatchStats();
              const elTime = container.querySelector('#stat-total-time');
              const elEp = container.querySelector('#stat-episodes-count');
              const elMov = container.querySelector('#stat-movies-count');
              const elFav = container.querySelector('#stat-favs-count');
              if (elTime) elTime.textContent = updatedStats.formattedTotalTime;
              if (elEp) elEp.textContent = `${updatedStats.episodesCount} Bölüm`;
              if (elMov) elMov.textContent = `${updatedStats.moviesCount} Film`;
              if (elFav) elFav.textContent = `${getFavorites().length + getWatchlist().length} Yapım`;

              const cCont = container.querySelector('#tab-count-continue');
              const cComp = container.querySelector('#tab-count-completed');
              const cFav = container.querySelector('#tab-count-favorites');
              const cWatch = container.querySelector('#tab-count-watchlist');
              const cAll = container.querySelector('#tab-count-all-episodes');
              if (cCont) cCont.textContent = getContinueWatchingList().length;
              if (cComp) cComp.textContent = getCompletedWatchList().length;
              if (cFav) cFav.textContent = getFavorites().length;
              if (cWatch) cWatch.textContent = getWatchlist().length;
              if (cAll) cAll.textContent = getWatchHistory().length;
            }, 300);
          }
        });
      });

      attachMediaCardEvents(container);
      if (window.lucide) window.lucide.createIcons();
    }
  };
}

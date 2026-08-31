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
  const allHistory = getWatchHistory();
  const favorites = getFavorites();
  const watchlist = getWatchlist();
  const stats = getTotalWatchStats();

  const countContinue = getContinueWatchingList().length;
  const countCompleted = getCompletedWatchList().length;

  const html = `
    <div class="library-view">
      <div class="container">
        
        <!-- Header & Action Group -->
        <div class="library-header-row">
          <div>
            <h1 class="library-header-title">
              <i data-lucide="bookmark" style="color: var(--primary)"></i> Kitaplığım & İstatistikler
            </h1>
            <p class="library-header-sub">İzleme geçmişiniz, bitirdikleriniz ve tercihleriniz yerel tarayıcı hafızanızda güvendedir.</p>
          </div>

          <div class="library-action-group">
            <button id="lib-data-modal-btn" class="btn-secondary" style="padding: 0.48rem 1.1rem; border-radius: var(--radius-full); font-size: 0.84rem; display: inline-flex; align-items: center; gap: 0.45rem;">
              <i data-lucide="database" style="width: 15px; height: 15px; color: var(--primary);"></i>
              <span>Veri & Yedek</span>
            </button>
            <input type="file" id="lib-file-input" accept=".json,application/json,text/plain" style="display: none;" />
          </div>
        </div>

        <!-- User Watch Analytics Stats Row -->
        <div class="stats-grid">
          
          <div class="stat-card" style="border-color: rgba(245, 158, 11, 0.25);">
            <div class="stat-card-icon" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24;">
              <i data-lucide="clock"></i>
            </div>
            <div>
              <div class="stat-card-label" style="color: #fbbf24;">Toplam İzleme Süresi</div>
              <div id="stat-total-time" class="stat-card-val">${stats.formattedTotalTime}</div>
            </div>
          </div>

          <div class="stat-card" style="border-color: rgba(56, 189, 248, 0.25);">
            <div class="stat-card-icon" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">
              <i data-lucide="tv-2"></i>
            </div>
            <div>
              <div class="stat-card-label" style="color: #38bdf8;">İzlenen Bölüm</div>
              <div id="stat-episodes-count" class="stat-card-val">${stats.episodesCount} Bölüm</div>
            </div>
          </div>

          <div class="stat-card" style="border-color: rgba(168, 85, 247, 0.25);">
            <div class="stat-card-icon" style="background: rgba(168, 85, 247, 0.15); color: #c084fc;">
              <i data-lucide="film"></i>
            </div>
            <div>
              <div class="stat-card-label" style="color: #c084fc;">İzlenen Film</div>
              <div id="stat-movies-count" class="stat-card-val">${stats.moviesCount} Film</div>
            </div>
          </div>

          <div class="stat-card" style="border-color: rgba(239, 68, 68, 0.25);">
            <div class="stat-card-icon" style="background: rgba(239, 68, 68, 0.15); color: #f87171;">
              <i data-lucide="heart"></i>
            </div>
            <div>
              <div class="stat-card-label" style="color: #f87171;">Favori & Listem</div>
              <div id="stat-favs-count" class="stat-card-val">${favorites.length + watchlist.length} Yapım</div>
            </div>
          </div>

        </div>

        <!-- Section Tabs: Devam Et, Tamamlananlar, Favoriler, Listem, Tüm Bölümler -->
        <div class="library-segmented-nav-track" id="library-tabs">
          <button class="lib-nav-tab active" data-tab="continue">
            <i data-lucide="clock"></i>
            <span>Devam Et</span>
            <span class="lib-tab-badge" id="tab-count-continue">${countContinue}</span>
          </button>
          <button class="lib-nav-tab" data-tab="completed">
            <i data-lucide="check-circle-2"></i>
            <span>Tamamlananlar</span>
            <span class="lib-tab-badge" id="tab-count-completed">${countCompleted}</span>
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
          <!-- Search Pill -->
          <div class="library-search-wrapper">
            <i data-lucide="search" class="library-search-icon"></i>
            <input type="text" id="lib-search-input" class="library-search-input" placeholder="Kitaplıkta ara..." autocomplete="off" />
            <i data-lucide="x" id="lib-search-clear" class="library-search-clear" title="Temizle"></i>
          </div>

          <!-- Horizontal Smooth Scrollable Filter Segment (Never Wraps!) -->
          <div class="library-filter-segment-track" id="lib-type-filters">
            <button class="lib-segment-btn active" data-filter="all">Tümü</button>
            <button class="lib-segment-btn" data-filter="movie">🎬 Filmler</button>
            <button class="lib-segment-btn" data-filter="tv">📺 Diziler</button>
            <button class="lib-segment-btn" data-filter="anime">🎌 Animeler</button>
          </div>

          <div style="display: flex; align-items: center; gap: 0.6rem;">
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
        </div>

        <!-- Tab 1: Continue Watching (In-Progress Only) -->
        <div class="tab-content" id="tab-continue"></div>

        <!-- Tab 2: Completed / Finished Watch List -->
        <div class="tab-content hidden" id="tab-completed"></div>

        <!-- Tab 3: Favorites Grid -->
        <div class="tab-content hidden" id="tab-favorites"></div>

        <!-- Tab 4: Watchlist Grid -->
        <div class="tab-content hidden" id="tab-watchlist"></div>

        <!-- Tab 5: All Episodes Breakdown -->
        <div class="tab-content hidden" id="tab-all-episodes"></div>
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

      // Tab data provider
      const getTabData = (tab) => {
        if (tab === 'continue') return getContinueWatchingList();
        if (tab === 'completed') return getCompletedWatchList();
        if (tab === 'favorites') return getFavorites();
        if (tab === 'watchlist') return getWatchlist();
        if (tab === 'all-episodes') return getWatchHistory();
        return [];
      };

      const getEmptyState = (tab) => {
        if (tab === 'continue') {
          return `
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap">
                <i data-lucide="clock" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">Yarım kalan içerik yok</h3>
              <p class="empty-state-desc">Dizi veya film izlemeye başladığınızda kaldığınız dakika burada otomatik olarak saklanır.</p>
              <a href="#discover" class="btn-primary empty-state-action-btn">
                <i data-lucide="compass" style="width: 16px; height: 16px;"></i>
                <span>Keşfet'e Göz At</span>
              </a>
            </div>
          `;
        } else if (tab === 'completed') {
          return `
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap" style="background: rgba(16, 185, 129, 0.12); border-color: rgba(16, 185, 129, 0.3); color: #34d399;">
                <i data-lucide="check-circle-2" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">Henüz tamamlanmış içerik yok</h3>
              <p class="empty-state-desc">İzleyip bitirdiğiniz filmler ve tüm sezonlarını tamamladığınız diziler burada listelenir.</p>
              <a href="#movies" class="btn-primary empty-state-action-btn">
                <i data-lucide="film" style="width: 16px; height: 16px;"></i>
                <span>Popüler Filmleri İncele</span>
              </a>
            </div>
          `;
        } else if (tab === 'favorites') {
          return `
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap" style="background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.3); color: #f87171;">
                <i data-lucide="heart" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">Favorilerinize henüz yapım eklemediniz</h3>
              <p class="empty-state-desc">Beğendiğiniz dizi ve filmleri detay sayfasından veya kartlardan favorilere ekleyebilirsiniz.</p>
              <a href="#series" class="btn-primary empty-state-action-btn">
                <i data-lucide="tv" style="width: 16px; height: 16px;"></i>
                <span>Trend Dizilere Bak</span>
              </a>
            </div>
          `;
        } else if (tab === 'watchlist') {
          return `
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap" style="background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.3); color: #38bdf8;">
                <i data-lucide="plus-circle" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">İzleme listeniz henüz boş</h3>
              <p class="empty-state-desc">Daha sonra izlemek istediğiniz içerikleri listenize kaydedip buradan hızlıca ulaşabilirsiniz.</p>
              <a href="#discover" class="btn-primary empty-state-action-btn">
                <i data-lucide="compass" style="width: 16px; height: 16px;"></i>
                <span>İçerik Keşfet</span>
              </a>
            </div>
          `;
        } else {
          return `
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap" style="background: rgba(168, 85, 247, 0.12); border-color: rgba(168, 85, 247, 0.3); color: #c084fc;">
                <i data-lucide="list-checks" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">Bölüm geçmişi boş</h3>
              <p class="empty-state-desc">Oynatılan veya tek tek işaretlenen tüm bölümler burada kaydedilir.</p>
              <a href="#home" class="btn-primary empty-state-action-btn">
                <i data-lucide="home" style="width: 16px; height: 16px;"></i>
                <span>Ana Sayfaya Dön</span>
              </a>
            </div>
          `;
        }
      };

      // Render Active Tab Content with pagination/batching
      let tabLimit = 36;

      const renderActiveTabContent = () => {
        const activeContent = container.querySelector(`#tab-${currentTab}`);
        if (!activeContent) return;

        let rawItems = getTabData(currentTab);

        // Filter items in memory (fast and instantaneous)
        let filtered = rawItems.filter(item => {
          const title = (item.title || item.name || '').toLowerCase();
          const type = determineMediaType(item);
          const matchesSearch = !searchQuery || title.includes(searchQuery.toLowerCase());
          const matchesType = currentTypeFilter === 'all' || type === currentTypeFilter;
          return matchesSearch && matchesType;
        });

        // Sort items in memory
        if (currentSort === 'rating-desc') {
          filtered.sort((a, b) => {
            const rA = parseFloat(a.vote_average || a.voteAverage || a.rating || 0);
            const rB = parseFloat(b.vote_average || b.voteAverage || b.rating || 0);
            return rB - rA;
          });
        } else if (currentSort === 'title-asc') {
          filtered.sort((a, b) => {
            const tA = (a.title || a.name || '');
            const tB = (b.title || b.name || '');
            return tA.localeCompare(tB, 'tr');
          });
        } else if (currentSort === 'year-desc') {
          filtered.sort((a, b) => {
            const yA = parseInt((a.release_date || a.first_air_date || a.year || '0').substring(0, 4), 10);
            const yB = parseInt((b.release_date || b.first_air_date || b.year || '0').substring(0, 4), 10);
            return yB - yA;
          });
        }

        if (filtered.length === 0) {
          activeContent.innerHTML = getEmptyState(currentTab);
        } else {
          const visibleChunk = filtered.slice(0, tabLimit);
          const hasMore = filtered.length > tabLimit;

          activeContent.innerHTML = `
            <div class="media-grid" id="grid-${currentTab}">
              ${visibleChunk.map(item => renderLibraryCard(item, currentTab)).join('')}
            </div>
            ${hasMore ? `
              <div style="text-align: center; margin: 2rem 0 1rem;">
                <button id="btn-lib-load-more" class="btn-secondary" style="padding: 0.6rem 1.8rem; border-radius: var(--radius-full); font-size: 0.88rem;">
                  <span>Daha Fazla Göster (${filtered.length - tabLimit} içerik daha)</span>
                </button>
              </div>
            ` : ''}
          `;

          const loadMoreBtn = activeContent.querySelector('#btn-lib-load-more');
          if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
              tabLimit += 36;
              renderActiveTabContent();
            });
          }

          // Re-bind delete buttons inside this rendered tab
          bindDeleteButtons(activeContent);
        }

        // Update Batch Clear button visibility
        if (batchClearBtn) {
          if (currentTab === 'completed' || currentTab === 'all-episodes' || currentTab === 'continue') {
            batchClearBtn.classList.remove('hidden');
            const labelSpan = batchClearBtn.querySelector('span');
            if (labelSpan) {
              labelSpan.textContent = 'Temizle';
            }
            if (currentTab === 'completed') batchClearBtn.title = 'Tamamlananlar listesini temizle';
            else if (currentTab === 'continue') batchClearBtn.title = 'İzlemeye devam et listesini temizle';
            else batchClearBtn.title = 'Bölüm izleme geçmişini temizle';
          } else {
            batchClearBtn.classList.add('hidden');
          }
        }

        if (window.lucide) window.lucide.createIcons();
      };

      // Filter and Sort Engine for Active Tab
      const applyFilterAndSort = () => {
        tabLimit = 36;
        renderActiveTabContent();
      };

      // Tab switching handlers
      const tabs = container.querySelectorAll('#library-tabs .lib-nav-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          const targetTab = tab.getAttribute('data-tab');
          if (currentTab === targetTab) return;

          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          currentTab = targetTab;
          container.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));
          const activeContent = container.querySelector(`#tab-${currentTab}`);
          if (activeContent) activeContent.classList.remove('hidden');

          tabLimit = 36;
          renderActiveTabContent();
        });
      });

      // Helper to bind delete buttons per rendered tab
      const bindDeleteButtons = (scopeEl) => {
        if (!scopeEl) return;
        scopeEl.querySelectorAll('.btn-lib-delete').forEach(btn => {
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
      };

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

            const cCont = container.querySelector('#tab-count-continue');
            const cComp = container.querySelector('#tab-count-completed');
            const cAll = container.querySelector('#tab-count-all-episodes');
            if (cCont) cCont.textContent = getContinueWatchingList().length;
            if (cComp) cComp.textContent = getCompletedWatchList().length;
            if (cAll) cAll.textContent = getWatchHistory().length;

            renderActiveTabContent();
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
                renderActiveTabContent();
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

      // Initial active tab render
      renderActiveTabContent();
      attachMediaCardEvents(container);
      if (window.lucide) window.lucide.createIcons();
    }
  };
}

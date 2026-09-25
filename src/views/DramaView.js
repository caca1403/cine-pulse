/* ==========================================================================
   CinePulse Studio - Kısa Diziler & Mini Series (Reels / DramaBox / ShortMax)
   Dedicated Hub for Non-TMDB Micro Dramas, Turkish Dubbed & Subtitled Series
   Features instant live search, category filtering, episode explorer, and direct playback.
   ========================================================================== */

import { renderIcons } from '../services/icons.js';
import {
  fetchTrendingDramas,
  fetchDramaCatalog,
  fetchDramaDetails
} from '../services/dramaDizilerimScraper.js';
import { openPlayerModal } from '../components/openPlayer.js';
import { isMediaWatched, markEpisodeWatched } from '../services/storage.js';
import { showToast } from '../components/Toast.js';

export async function renderDramaView(initialSlug = null, initialQuery = '') {
  let activeTab = initialQuery ? 'search' : 'trending';
  let currentSearchQuery = initialQuery || '';
  let currentPage = 1;
  let hasMore = true;
  let isLoading = true;
  let dramasList = [];
  let selectedDrama = null;
  let activeEpisodeFilter = '';

  const CATEGORY_TABS = [
    { id: 'trending', label: 'Trendler', icon: 'flame', query: '' },
    { id: 'all', label: 'Tüm Katalog', icon: 'layers', query: '' },
    { id: 'dubbed', label: 'Türkçe Dublaj', icon: 'sparkles', query: 'dublaj' },
    { id: 'patron', label: 'CEO & Patron', icon: 'briefcase', query: 'patron' },
    { id: 'kurt', label: 'Kurt & Alfa', icon: 'moon', query: 'kurt' },
    { id: 'intikam', label: 'İntikam & Aşk', icon: 'heart-crack', query: 'intikam' },
    { id: 'milyarder', label: 'Milyarder', icon: 'crown', query: 'milyarder' },
    { id: 'evlilik', label: 'Yasak Aşk & Evlilik', icon: 'ring', query: 'evlilik' }
  ];

  const initialHTML = `
    <div class="drama-view-container" id="drama-view-root">
      <!-- Ambient Glow Elements -->
      <div class="drama-ambient-glow glow-primary"></div>
      <div class="drama-ambient-glow glow-secondary"></div>

      <!-- Hero Header Section -->
      <header class="drama-hero-header">
        <div class="drama-hero-content">
          <div class="drama-hero-badge">
            <i data-lucide="sparkles" style="width: 14px; height: 14px; color: #c084fc;"></i>
            <span>ÖZEL MİNİ DİZİ &amp; REELS KÜTÜPHANESİ</span>
            <span class="drama-vip-pill">DDZ VIP</span>
          </div>
          <h1 class="drama-hero-title">Kısa Diziler &amp; Mini Seriler</h1>
          <p class="drama-hero-subtitle">
            DramaBox, ReelShort, ShortMax ve FlexTV orijinal yapımları. TMDB'de bulunmayan tüm mini bölümler, 
            <strong style="color: #e9d5ff;">Türkçe Dublaj</strong> ve <strong style="color: #e9d5ff;">Altyazı</strong> desteğiyle burada!
          </p>

          <!-- Dedicated Specialized Search Box -->
          <div class="drama-search-wrapper">
            <div class="drama-search-box">
              <i data-lucide="search" class="drama-search-icon"></i>
              <input 
                type="text" 
                id="drama-search-input" 
                class="drama-search-input" 
                placeholder="Kısa dizi adı veya konu ara... (Örn: Patron, Kurt Kızı, Milyarder, Dublaj)" 
                value="${currentSearchQuery.replace(/"/g, '&quot;')}"
                autocomplete="off"
              />
              <button id="btn-drama-search-clear" class="btn-drama-search-clear ${currentSearchQuery ? '' : 'hidden'}" title="Temizle">
                <i data-lucide="x" style="width: 16px; height: 16px;"></i>
              </button>
            </div>
            <div id="drama-search-feedback" class="drama-search-feedback"></div>
          </div>

          <!-- Category Quick Filter Chips -->
          <div class="drama-category-chips" id="drama-category-chips">
            ${CATEGORY_TABS.map(tab => `
              <button 
                class="drama-chip ${activeTab === tab.id ? 'active' : ''}" 
                data-tab-id="${tab.id}"
                data-tab-query="${tab.query}"
              >
                <i data-lucide="${tab.icon}" style="width: 14px; height: 14px;"></i>
                <span>${tab.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </header>

      <!-- Main Content Area: Grid / Loader -->
      <section class="drama-catalog-section">
        <div class="drama-section-header">
          <div class="drama-section-title-wrap">
            <h2 id="drama-section-title" class="drama-section-title">
              <i data-lucide="flame" style="width: 20px; height: 20px; color: #f43f5e;"></i>
              <span>Trend Kısa Diziler</span>
            </h2>
            <span id="drama-counter-badge" class="drama-counter-badge">Yükleniyor...</span>
          </div>
        </div>

        <div id="drama-cards-grid" class="drama-cards-grid">
          <!-- Skeletons initially rendered -->
          ${Array.from({ length: 12 }).map(() => `
            <div class="drama-card-skeleton">
              <div class="skeleton-poster"></div>
              <div class="skeleton-title"></div>
            </div>
          `).join('')}
        </div>

        <!-- Load More / Pagination Button -->
        <div id="drama-load-more-wrap" class="drama-load-more-wrap hidden">
          <button id="btn-drama-load-more" class="btn-drama-load-more">
            <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i>
            <span>Daha Fazla Dizi Yükle</span>
          </button>
        </div>
      </section>

      <!-- Drama Detail Modal / Drawer -->
      <div id="drama-detail-modal" class="drama-modal-backdrop hidden">
        <div class="drama-modal-dialog" id="drama-modal-dialog">
          <!-- Will be dynamically injected when a drama is opened -->
        </div>
      </div>
    </div>
  `;

  return {
    html: initialHTML,
    init: async (container) => {
      const root = container.querySelector('#drama-view-root');
      if (!root) return;

      const searchInput = root.querySelector('#drama-search-input');
      const searchClearBtn = root.querySelector('#btn-drama-search-clear');
      const searchFeedback = root.querySelector('#drama-search-feedback');
      const categoryChips = root.querySelectorAll('.drama-chip');
      const sectionTitle = root.querySelector('#drama-section-title');
      const counterBadge = root.querySelector('#drama-counter-badge');
      const cardsGrid = root.querySelector('#drama-cards-grid');
      const loadMoreWrap = root.querySelector('#drama-load-more-wrap');
      const loadMoreBtn = root.querySelector('#btn-drama-load-more');
      const detailModal = root.querySelector('#drama-detail-modal');
      const modalDialog = root.querySelector('#drama-modal-dialog');

      let searchDebounceTimer = null;

      async function fetchDramasData(isAppend = false) {
        isLoading = true;
        if (!isAppend) {
          cardsGrid.innerHTML = Array.from({ length: 12 }).map(() => `
            <div class="drama-card-skeleton">
              <div class="skeleton-poster"></div>
              <div class="skeleton-title"></div>
            </div>
          `).join('');
          counterBadge.textContent = 'Yükleniyor...';
        }

        try {
          let results = [];
          if (currentSearchQuery && currentSearchQuery.trim().length >= 2) {
            results = await fetchDramaCatalog({ query: currentSearchQuery.trim() });
            sectionTitle.innerHTML = `
              <i data-lucide="search" style="width: 20px; height: 20px; color: #a855f7;"></i>
              <span>"${currentSearchQuery}" İçin Arama Sonuçları</span>
            `;
            loadMoreWrap.classList.add('hidden');
          } else {
            const currentTabConfig = CATEGORY_TABS.find(t => t.id === activeTab) || CATEGORY_TABS[0];
            if (activeTab === 'trending') {
              results = await fetchTrendingDramas();
              sectionTitle.innerHTML = `
                <i data-lucide="flame" style="width: 20px; height: 20px; color: #f43f5e;"></i>
                <span>Trend Kısa Diziler</span>
              `;
              loadMoreWrap.classList.add('hidden');
            } else if (activeTab === 'all') {
              results = await fetchDramaCatalog({ page: currentPage });
              sectionTitle.innerHTML = `
                <i data-lucide="layers" style="width: 20px; height: 20px; color: #3b82f6;"></i>
                <span>Tüm Kısa Diziler Kataloğu (Sayfa ${currentPage})</span>
              `;
              loadMoreWrap.classList.toggle('hidden', results.length === 0);
            } else if (currentTabConfig.query) {
              results = await fetchDramaCatalog({ query: currentTabConfig.query });
              sectionTitle.innerHTML = `
                <i data-lucide="${currentTabConfig.icon}" style="width: 20px; height: 20px; color: #c084fc;"></i>
                <span>${currentTabConfig.label} Serileri</span>
              `;
              loadMoreWrap.classList.add('hidden');
            }
          }

          if (isAppend) {
            dramasList = [...dramasList, ...results];
          } else {
            dramasList = results;
          }

          renderCards();
        } catch (err) {
          console.error('[DramaView] Error fetching dramas:', err);
          cardsGrid.innerHTML = `
            <div class="drama-empty-state">
              <i data-lucide="alert-circle" style="width: 44px; height: 44px; color: #ef4444;"></i>
              <h3>Diziler yüklenirken bir sorun oluştu</h3>
              <p>Lütfen internet bağlantınızı kontrol edip tekrar deneyin.</p>
              <button class="btn-primary" id="btn-drama-retry">Tekrar Dene</button>
            </div>
          `;
          root.querySelector('#btn-drama-retry')?.addEventListener('click', () => fetchDramasData(false));
          renderIcons(cardsGrid);
        } finally {
          isLoading = false;
        }
      }

      function renderCards() {
        if (!dramasList || dramasList.length === 0) {
          cardsGrid.innerHTML = `
            <div class="drama-empty-state">
              <i data-lucide="film" style="width: 48px; height: 48px; color: #94a3b8;"></i>
              <h3>Eşleşen Kısa Dizi Bulunamadı</h3>
              <p>Farklı bir anahtar kelime ile arama yapabilir veya Trend kategorisine göz atabilirsiniz.</p>
            </div>
          `;
          counterBadge.textContent = '0 Dizi';
          renderIcons(cardsGrid);
          return;
        }

        counterBadge.textContent = `${dramasList.length} Dizi`;

        cardsGrid.innerHTML = dramasList.map((drama, idx) => {
          const isDub = drama.isDubbed || drama.title.toLowerCase().includes('dublaj');
          const cleanPoster = drama.poster || '';
          return `
            <article class="drama-card" data-slug="${drama.slug}" tabindex="0" role="button" aria-label="${drama.title}">
              <div class="drama-card-poster-wrap">
                ${cleanPoster ? `
                  <img 
                    src="${cleanPoster}" 
                    alt="${drama.title}" 
                    class="drama-card-poster" 
                    loading="lazy" 
                    decoding="async"
                    onerror="this.onerror=null;this.classList.add('broken-img');"
                  />
                ` : `
                  <div class="drama-card-fallback-poster">
                    <i data-lucide="clapperboard" style="width: 32px; height: 32px; color: #a855f7;"></i>
                  </div>
                `}

                <div class="drama-card-gradient"></div>

                <!-- Badges -->
                <div class="drama-card-badges">
                  <span class="drama-badge-pill ${isDub ? 'badge-dub' : 'badge-sub'}">
                    ${isDub ? '🇹🇷 DUBLAJ' : 'TR ALTYAZI'}
                  </span>
                  <span class="drama-badge-pill badge-type">MİNİ DİZİ</span>
                </div>

                <!-- Hover Play Glow Icon -->
                <div class="drama-card-play-action">
                  <div class="drama-play-btn-circle">
                    <i data-lucide="play" style="width: 22px; height: 22px; color: #fff; margin-left: 2px;"></i>
                  </div>
                </div>
              </div>

              <div class="drama-card-info">
                <h3 class="drama-card-title" title="${drama.title}">${drama.title}</h3>
                <div class="drama-card-meta">
                  <span>Reels Series</span>
                  <span>•</span>
                  <span>1080p HD</span>
                </div>
              </div>
            </article>
          `;
        }).join('');

        renderIcons(cardsGrid);

        // Attach card click handlers
        cardsGrid.querySelectorAll('.drama-card').forEach(card => {
          card.addEventListener('click', () => {
            const slug = card.getAttribute('data-slug');
            if (slug) openDramaDetail(slug);
          });
          card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const slug = card.getAttribute('data-slug');
              if (slug) openDramaDetail(slug);
            }
          });
        });
      }

      async function openDramaDetail(slug) {
        if (!slug) return;
        selectedDrama = null;
        detailModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        modalDialog.innerHTML = `
          <div class="drama-detail-loading">
            <div class="spin-loader"></div>
            <span>Dizi bilgileri ve bölümler yükleniyor...</span>
          </div>
        `;
        renderIcons(modalDialog);

        try {
          const details = await fetchDramaDetails(slug);
          if (!details) {
            modalDialog.innerHTML = `
              <div class="drama-empty-state">
                <i data-lucide="alert-circle" style="width: 38px; height: 38px; color: #ef4444;"></i>
                <h3>Dizi bilgisi alınamadı</h3>
                <button class="btn-primary" id="btn-close-drama-modal">Kapat</button>
              </div>
            `;
            root.querySelector('#btn-close-drama-modal')?.addEventListener('click', closeDramaDetail);
            renderIcons(modalDialog);
            return;
          }

          selectedDrama = details;
          renderDramaDetailModal();
        } catch (err) {
          console.error('[DramaView] Error opening drama detail:', err);
          closeDramaDetail();
          showToast('Dizi detayları yüklenemedi.', 'error');
        }
      }

      function renderDramaDetailModal() {
        if (!selectedDrama) return;

        const { slug, title, poster, description, episodes = [], isDubbed } = selectedDrama;
        const totalEps = episodes.length;

        // Filter episodes based on activeEpisodeFilter
        const filteredEpisodes = activeEpisodeFilter
          ? episodes.filter(ep => ep.title.toLowerCase().includes(activeEpisodeFilter) || String(ep.episode).includes(activeEpisodeFilter))
          : episodes;

        modalDialog.innerHTML = `
          <button class="drama-modal-close-btn" id="btn-close-drama-modal" title="Kapat">
            <i data-lucide="x" style="width: 20px; height: 20px;"></i>
          </button>

          <div class="drama-detail-hero">
            <div class="drama-detail-backdrop-blur" style="background-image: url('${poster || ''}');"></div>
            <div class="drama-detail-hero-content">
              <div class="drama-detail-poster-wrap">
                <img src="${poster || ''}" alt="${title}" class="drama-detail-poster" />
              </div>
              <div class="drama-detail-info">
                <div class="drama-detail-badges">
                  <span class="drama-badge-pill ${isDubbed ? 'badge-dub' : 'badge-sub'}">
                    ${isDubbed ? '🇹🇷 TÜRKÇE DUBLAJ' : 'TR ALTYAZI'}
                  </span>
                  <span class="drama-badge-pill badge-type">MİNİ DİZİ</span>
                  <span class="drama-badge-pill badge-ep-count">${totalEps} BÖLÜM</span>
                  <span class="drama-badge-pill badge-server">DDZ VIP HLS</span>
                </div>
                <h2 class="drama-detail-title">${title}</h2>
                <p class="drama-detail-desc">${description || 'Bu kısa dizi için henüz özet girilmedi.'}</p>
                <div class="drama-detail-actions">
                  <button class="btn-primary drama-btn-play-all" id="btn-play-drama-start">
                    <i data-lucide="play" style="width: 18px; height: 18px; fill: currentColor;"></i>
                    <span>1. Bölümden Başla</span>
                  </button>
                  <button class="btn-secondary" id="btn-share-drama" title="Bağlantıyı Kopyala">
                    <i data-lucide="share-2" style="width: 16px; height: 16px;"></i>
                    <span>Paylaş</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Episode Explorer Section -->
          <div class="drama-episodes-explorer">
            <div class="drama-episodes-toolbar">
              <div class="drama-episodes-title-wrap">
                <h3>Bölümler (${totalEps})</h3>
                <span class="drama-episodes-sub">Bölüme tıklayarak reklamsız izleyin</span>
              </div>
              <div class="drama-episodes-filter-box">
                <i data-lucide="search" style="width: 15px; height: 15px; color: #94a3b8;"></i>
                <input 
                  type="text" 
                  id="drama-ep-filter-input" 
                  placeholder="Bölüm ara... (Örn: 25)" 
                  value="${activeEpisodeFilter}"
                />
              </div>
            </div>

            <div class="drama-episodes-grid" id="drama-episodes-grid">
              ${filteredEpisodes.map(ep => {
                const watched = isMediaWatched(`ddz_${slug}`, ep.season, ep.episode);
                return `
                  <button 
                    class="drama-ep-card ${watched ? 'is-watched' : ''}" 
                    data-season="${ep.season}" 
                    data-episode="${ep.episode}"
                  >
                    <div class="drama-ep-thumb-wrap">
                      ${ep.thumb ? `
                        <img src="${ep.thumb}" alt="${ep.title}" loading="lazy" />
                      ` : `
                        <div class="drama-ep-fallback-thumb">
                          <i data-lucide="play" style="width: 16px; height: 16px; color: #c084fc;"></i>
                        </div>
                      `}
                      <span class="drama-ep-num-pill">${ep.episode}</span>
                      ${watched ? `<div class="drama-ep-watched-tag"><i data-lucide="check" style="width: 12px; height: 12px;"></i></div>` : ''}
                    </div>
                    <div class="drama-ep-title-wrap">
                      <span class="drama-ep-name">${ep.title}</span>
                      <span class="drama-ep-action-hint">İzle</span>
                    </div>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `;

        renderIcons(modalDialog);

        // Attach events inside modal
        modalDialog.querySelector('#btn-close-drama-modal')?.addEventListener('click', closeDramaDetail);
        modalDialog.querySelector('#btn-play-drama-start')?.addEventListener('click', () => {
          if (episodes.length > 0) playDramaEpisode(episodes[0].season, episodes[0].episode);
        });

        modalDialog.querySelector('#btn-share-drama')?.addEventListener('click', () => {
          const shareUrl = `${window.location.origin}${window.location.pathname}#dramas?slug=${slug}`;
          navigator.clipboard?.writeText(shareUrl).then(() => {
            showToast('Dizi bağlantısı panoya kopyalandı!', 'success');
          }).catch(() => {
            showToast(`Bağlantı: ${shareUrl}`, 'info');
          });
        });

        const epFilterInput = modalDialog.querySelector('#drama-ep-filter-input');
        if (epFilterInput) {
          epFilterInput.addEventListener('input', (e) => {
            activeEpisodeFilter = e.target.value.toLowerCase().trim();
            renderDramaDetailModal();
            modalDialog.querySelector('#drama-ep-filter-input')?.focus();
          });
        }

        modalDialog.querySelectorAll('.drama-ep-card').forEach(btn => {
          btn.addEventListener('click', () => {
            const season = parseInt(btn.getAttribute('data-season'), 10) || 1;
            const episode = parseInt(btn.getAttribute('data-episode'), 10) || 1;
            playDramaEpisode(season, episode);
          });
        });
      }

      function closeDramaDetail() {
        detailModal.classList.add('hidden');
        document.body.style.overflow = '';
        selectedDrama = null;
        activeEpisodeFilter = '';
      }

      detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) closeDramaDetail();
      });

      function playDramaEpisode(season = 1, episode = 1) {
        if (!selectedDrama) return;
        const { slug, title, poster, description, episodes = [] } = selectedDrama;
        const episodeArtwork = episodes.find(ep => ep.season === season && ep.episode === episode)?.thumb || '';

        openPlayerModal({
          type: 'tv',
          tmdbId: `ddz_${slug}`,
          title: `${title} - B${episode}`,
          seriesTitle: title,
          season,
          episode,
          posterPath: poster,
          backdropPath: poster,
          playerVariant: 'short-drama',
          seriesOverview: description || '',
          episodeArtworkPath: episodeArtwork || poster,
          shortDramaEpisodes: episodes,
          maxEpisodes: episodes.length,
          seasonsList: [{ season_number: season, episode_count: episodes.length }]
        });
      }

      // Search Events
      searchInput?.addEventListener('input', (e) => {
        const val = e.target.value;
        searchClearBtn.classList.toggle('hidden', !val);
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
          currentSearchQuery = val.trim();
          currentPage = 1;
          activeTab = currentSearchQuery ? 'search' : 'trending';
          categoryChips.forEach(chip => chip.classList.toggle('active', !currentSearchQuery && chip.getAttribute('data-tab-id') === 'trending'));
          fetchDramasData(false);
        }, 350);
      });

      searchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          clearTimeout(searchDebounceTimer);
          currentSearchQuery = searchInput.value.trim();
          currentPage = 1;
          fetchDramasData(false);
        }
      });

      searchClearBtn?.addEventListener('click', () => {
        searchInput.value = '';
        searchClearBtn.classList.add('hidden');
        currentSearchQuery = '';
        activeTab = 'trending';
        categoryChips.forEach(chip => chip.classList.toggle('active', chip.getAttribute('data-tab-id') === 'trending'));
        fetchDramasData(false);
      });

      // Category Chips Event
      categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
          const tabId = chip.getAttribute('data-tab-id');
          if (activeTab === tabId && !currentSearchQuery) return;

          activeTab = tabId;
          currentSearchQuery = '';
          if (searchInput) searchInput.value = '';
          searchClearBtn?.classList.add('hidden');
          currentPage = 1;

          categoryChips.forEach(c => c.classList.toggle('active', c === chip));
          fetchDramasData(false);
        });
      });

      // Load More Event
      loadMoreBtn?.addEventListener('click', () => {
        currentPage++;
        fetchDramasData(true);
      });

      // Initial Data Load
      await fetchDramasData(false);

      // If initialSlug provided in hash, open it directly!
      if (initialSlug) {
        openDramaDetail(initialSlug);
      }
    }
  };
}

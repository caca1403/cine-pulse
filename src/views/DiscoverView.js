/* ==========================================================================
   CinePulse Studio - Ultra-Customized Advanced Discover View
   Features multi-filters: Type (TV/Movie), Genre, Sorting, Min IMDb Rating, Year.
   ========================================================================== */

import {
  fetchDiscoverMedia,
  GENRE_MAP_TV,
  GENRE_MAP_MOVIE
} from '../services/tmdbApi.js';
import { renderMediaCard, attachMediaCardEvents } from '../components/MediaCard.js';

const discoverCache = {
  currentType: 'tv',
  currentGenreId: null,
  currentSortBy: 'popularity.desc',
  currentMinRating: 0,
  currentPage: 1,
  allItems: [],
  isExhausted: false
};

export async function renderDiscoverView(initialType = 'tv') {
  if (initialType && initialType !== discoverCache.currentType && discoverCache.allItems.length === 0) {
    discoverCache.currentType = initialType;
  }

  let currentType = discoverCache.currentType;
  let currentGenreId = discoverCache.currentGenreId;
  let currentSortBy = discoverCache.currentSortBy;
  let currentMinRating = discoverCache.currentMinRating;
  let isLoading = false;

  const tvGenres = [
    { id: null, name: 'Tüm Türler' },
    { id: GENRE_MAP_TV.MYSTERY, name: '🩸 Korku & Gerilim' },
    { id: GENRE_MAP_TV.ACTION_ADVENTURE, name: '💥 Aksiyon & Macera' },
    { id: GENRE_MAP_TV.SCI_FI_FANTASY, name: '🚀 Bilim Kurgu & Fantastik' },
    { id: GENRE_MAP_TV.DRAMA, name: '🎭 Dram' },
    { id: GENRE_MAP_TV.COMEDY, name: '😂 Komedi' },
    { id: GENRE_MAP_TV.CRIME, name: '🕵️ Suç & Polisiye' },
    { id: GENRE_MAP_TV.ANIMATION, name: '🎌 Animasyon & Anime' },
    { id: GENRE_MAP_TV.DOCUMENTARY, name: '🌍 Belgesel' },
    { id: GENRE_MAP_TV.FAMILY, name: '👨‍👩‍👧‍👦 Aile & Gençlik' },
    { id: GENRE_MAP_TV.WAR_POLITICS, name: '⚔️ Savaş & Politika' },
    { id: GENRE_MAP_TV.WESTERN, name: '🤠 Western' }
  ];

  const movieGenres = [
    { id: null, name: 'Tüm Türler' },
    { id: GENRE_MAP_MOVIE.HORROR, name: '🩸 Korku' },
    { id: GENRE_MAP_MOVIE.THRILLER, name: '⚡ Gerilim' },
    { id: GENRE_MAP_MOVIE.ACTION, name: '💥 Aksiyon' },
    { id: GENRE_MAP_MOVIE.ADVENTURE, name: '🗺️ Macera' },
    { id: GENRE_MAP_MOVIE.SCI_FI, name: '🚀 Bilim Kurgu' },
    { id: GENRE_MAP_MOVIE.FANTASY, name: '🧙‍♂️ Fantastik' },
    { id: GENRE_MAP_MOVIE.DRAMA, name: '🎭 Dram' },
    { id: GENRE_MAP_MOVIE.COMEDY, name: '😂 Komedi' },
    { id: GENRE_MAP_MOVIE.CRIME, name: '🕵️ Suç' },
    { id: GENRE_MAP_MOVIE.ANIMATION, name: '🎌 Animasyon' },
    { id: GENRE_MAP_MOVIE.MYSTERY, name: '🔍 Gizem' },
    { id: GENRE_MAP_MOVIE.ROMANCE, name: '💖 Romantik' },
    { id: GENRE_MAP_MOVIE.DOCUMENTARY, name: '🌍 Belgesel' },
    { id: GENRE_MAP_MOVIE.HISTORY, name: '🏰 Tarih & Savaş' },
    { id: GENRE_MAP_MOVIE.FAMILY, name: '👨‍👩‍👧‍👦 Aile' },
    { id: GENRE_MAP_MOVIE.MUSIC, name: '🎵 Müzikal' },
    { id: GENRE_MAP_MOVIE.WESTERN, name: '🤠 Western' }
  ];

  const getActiveGenres = () => currentType === 'movie' ? movieGenres : tvGenres;
  const hasCachedItems = discoverCache.allItems.length > 0;
  const initialCardsHTML = hasCachedItems
    ? discoverCache.allItems.map(item => renderMediaCard(item)).join('')
    : '<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">İçerikler yükleniyor...</div>';

  const html = `
    <div class="discover-view" style="padding-top: 6.5rem; padding-bottom: 5rem;">
      <div class="container">
        
        <!-- Header Banner -->
        <div class="discover-header-card glass-panel" style="padding: 2rem; border-radius: var(--radius-lg); margin-bottom: 2rem; background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(20, 184, 166, 0.08) 100%); border: 1px solid var(--border-light);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
            <div>
              <h1 style="font-size: 2.2rem; font-weight: 800; display: flex; align-items: center; gap: 0.75rem; color: #fff;">
                <i data-lucide="compass" style="color: var(--primary)"></i> Özelleştirilebilir Sinema Filtresi
              </h1>
              <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.35rem;">
                Türe, IMDb puanına ve çıkış yılına göre nokta atışı arama yapın
              </p>
            </div>
          </div>
        </div>

        <!-- Filter Controls Container -->
        <div class="discover-controls-wrap glass-panel" style="padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 2rem; border: 1px solid var(--border-color);">
          
          <!-- Type Filter Tabs Segmented Track (Apple TV+ Capsule) -->
          <div class="discover-segmented-deck">
            <button id="discover-type-tv" class="discover-type-tab ${currentType === 'tv' ? 'active' : ''}">
              <i data-lucide="tv-2" style="width:16px; height:16px;"></i> Diziler
            </button>
            <button id="discover-type-movie" class="discover-type-tab ${currentType === 'movie' ? 'active' : ''}">
              <i data-lucide="clapperboard" style="width:16px; height:16px;"></i> Filmler
            </button>
            <button id="discover-type-anime" class="discover-type-tab ${currentType === 'anime' ? 'active' : ''}">
              <i data-lucide="sparkles" style="width:16px; height:16px;"></i> Anime
            </button>
            <button id="discover-type-doc" class="discover-type-tab ${currentType === 'documentary' ? 'active' : ''}">
              <i data-lucide="globe" style="width:16px; height:16px;"></i> Belgesel
            </button>
          </div>

          <!-- Secondary Filters Row -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.2rem; align-items: end;">
            
            <!-- Sort Filter -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="arrow-down-up" style="width:12px; height:12px;"></i> Sıralama Ölçütü
              </label>
              <select id="discover-sort-select" class="discover-filter-select">
                <option value="popularity.desc" ${currentSortBy === 'popularity.desc' ? 'selected' : ''}>🔥 En Popülerler (Trend)</option>
                <option value="vote_average.desc" ${currentSortBy === 'vote_average.desc' ? 'selected' : ''}>⭐ En Yüksek IMDb Puanı</option>
                <option value="vote_count.desc" ${currentSortBy === 'vote_count.desc' ? 'selected' : ''}>👥 En Çok Oylananlar</option>
                <option value="first_air_date.desc" ${currentSortBy === 'first_air_date.desc' ? 'selected' : ''}>📅 En Yeniler (Vizyon / Çıkış)</option>
              </select>
            </div>

            <!-- Min IMDb Rating Slider/Select -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="star" style="width:12px; height:12px;"></i> Minimum IMDb Puanı
              </label>
              <select id="discover-rating-select" class="discover-filter-select">
                <option value="0" ${currentMinRating === 0 ? 'selected' : ''}>Tümü (Puan Sınırı Yok)</option>
                <option value="8.0" ${currentMinRating === 8.0 ? 'selected' : ''}>⭐ 8.0 ve Üzeri (Başyapıtlar)</option>
                <option value="7.5" ${currentMinRating === 7.5 ? 'selected' : ''}>⭐ 7.5 ve Üzeri (Çok Yüksek)</option>
                <option value="7.0" ${currentMinRating === 7.0 ? 'selected' : ''}>⭐ 7.0 ve Üzeri (Çok İyi)</option>
                <option value="6.0" ${currentMinRating === 6.0 ? 'selected' : ''}>⭐ 6.0 ve Üzeri (İyi)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Quick Genre Pills Filter Bar -->
        <div id="discover-genre-bar" class="genre-pills-bar" style="display: flex; gap: 0.6rem; overflow-x: auto; padding-bottom: 1.2rem; margin-bottom: 2rem; scrollbar-width: none;">
          <!-- Dynamically populated -->
        </div>

        <!-- Results Grid -->
        <div class="media-grid" id="discover-media-grid">
          ${initialCardsHTML}
        </div>

        <!-- Scroll Sentinel / Loader -->
        <div id="discover-sentinel" style="height: 60px; display: flex; align-items: center; justify-content: center; margin-top: 2rem; color: var(--text-muted);">
          <i data-lucide="loader-2" class="spin-loader" style="width: 28px; height: 28px; display: none;"></i>
        </div>

      </div>
    </div>
  `;

  return {
    html,
    init: (container) => {
      if (!container) return;

      const tvBtn = container.querySelector('#discover-type-tv');
      const movieBtn = container.querySelector('#discover-type-movie');
      const animeBtn = container.querySelector('#discover-type-anime');
      const docBtn = container.querySelector('#discover-type-doc');
      const sortSelect = container.querySelector('#discover-sort-select');
      const ratingSelect = container.querySelector('#discover-rating-select');
      const genreBar = container.querySelector('#discover-genre-bar');
      const grid = container.querySelector('#discover-media-grid');
      const sentinel = container.querySelector('#discover-sentinel');
      const spinner = sentinel ? sentinel.querySelector('.spin-loader') : null;

      const renderGenreBar = () => {
        const activeGenres = getActiveGenres();
        genreBar.innerHTML = activeGenres.map(g => `
          <button class="genre-pill-btn ${currentGenreId === g.id ? 'active' : ''}" data-genre-id="${g.id || ''}">
            ${g.name}
          </button>
        `).join('');

        genreBar.querySelectorAll('.genre-pill-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const gid = btn.dataset.genreId ? parseInt(btn.dataset.genreId, 10) : null;
            if (currentGenreId === gid) return;
            currentGenreId = gid;
            genreBar.querySelectorAll('.genre-pill-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            resetAndFetch();
          });
        });
      };

      const fetchContent = async () => {
        if (isLoading || discoverCache.isExhausted) return;
        isLoading = true;

        if (spinner) spinner.style.display = 'block';

        const pageToFetch = discoverCache.currentPage || 1;

        try {
          const effectiveType = (currentType === 'anime' || currentType === 'documentary') ? 'tv' : currentType;
          const isAnime = currentType === 'anime';
          const isDoc = currentType === 'documentary';

          let effectiveSort = currentSortBy;
          if (currentSortBy === 'first_air_date.desc' && effectiveType === 'movie') {
            effectiveSort = 'primary_release_date.desc';
          }

          const results = await fetchDiscoverMedia({
            type: effectiveType,
            genreId: currentGenreId,
            page: pageToFetch,
            sortBy: effectiveSort,
            minRating: currentMinRating,
            isAnime,
            isDoc
          });

          if (spinner) spinner.style.display = 'none';

          if (!results || results.length === 0) {
            if (pageToFetch === 1) {
              grid.innerHTML = `<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">Bu filtre kriterlerine uygun içerik bulunamadı.</div>`;
            }
            discoverCache.isExhausted = true;
            return;
          }

          discoverCache.allItems = [...discoverCache.allItems, ...results];
          discoverCache.currentType = currentType;
          discoverCache.currentGenreId = currentGenreId;
          discoverCache.currentSortBy = currentSortBy;
          discoverCache.currentMinRating = currentMinRating;

          const newCardsHTML = results.map(item => renderMediaCard(item)).join('');
          if (pageToFetch === 1) {
            grid.innerHTML = newCardsHTML;
          } else {
            grid.insertAdjacentHTML('beforeend', newCardsHTML);
          }
          if (window.lucide) window.lucide.createIcons();
          attachMediaCardEvents(grid);

          discoverCache.currentPage = pageToFetch + 1;

          // Auto-fill if initial page doesn't cause overflow
          setTimeout(() => {
            if (document.documentElement.scrollHeight <= window.innerHeight + 400 && !discoverCache.isExhausted && !isLoading) {
              fetchContent();
            }
          }, 200);
        } catch (err) {
          console.error('Discover fetch error:', err);
          if (spinner) spinner.style.display = 'none';
          if (pageToFetch === 1 && (!discoverCache.allItems || discoverCache.allItems.length === 0)) {
            grid.innerHTML = `
              <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
                <p style="margin-bottom: 0.75rem;">İçerikler getirilirken bir sorun oluştu.</p>
                <button id="btn-retry-discover" class="btn-secondary" style="padding: 0.5rem 1.2rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                  <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
                  <span>Tekrar Dene</span>
                </button>
              </div>
            `;
            if (window.lucide) window.lucide.createIcons();
            grid.querySelector('#btn-retry-discover')?.addEventListener('click', () => {
              resetAndFetch();
            });
          }
        } finally {
          isLoading = false;
        }
      };

      const resetAndFetch = () => {
        discoverCache.currentPage = 1;
        discoverCache.allItems = [];
        discoverCache.isExhausted = false;
        grid.innerHTML = `<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">Yükleniyor...</div>`;
        fetchContent();
      };

      // Initial Render
      renderGenreBar();
      if (!hasCachedItems) {
        fetchContent();
      }

      // 1. Infinite scroll observer
      if (sentinel && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            fetchContent();
          }
        }, { rootMargin: '0px 0px 600px 0px' });
        observer.observe(sentinel);
      }

      // 2. High-performance scroll listener fallback for all mobile & desktop browsers
      const handleWindowScroll = () => {
        if (isLoading || discoverCache.isExhausted) return;
        const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const windowHeight = window.innerHeight;
        const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

        if (scrollY + windowHeight >= docHeight - 700) {
          fetchContent();
        }
      };

      window.addEventListener('scroll', handleWindowScroll, { passive: true });
      window.addEventListener('touchmove', handleWindowScroll, { passive: true });

      // Filter listeners
      const setType = (newType) => {
        if (currentType === newType) return;
        currentType = newType;
        currentGenreId = null;
        [tvBtn, movieBtn, animeBtn, docBtn].forEach(b => b?.classList.remove('active'));
        if (newType === 'tv') tvBtn?.classList.add('active');
        if (newType === 'movie') movieBtn?.classList.add('active');
        if (newType === 'anime') animeBtn?.classList.add('active');
        if (newType === 'documentary') docBtn?.classList.add('active');
        renderGenreBar();
        resetAndFetch();
      };

      if (tvBtn) tvBtn.addEventListener('click', () => setType('tv'));
      if (movieBtn) movieBtn.addEventListener('click', () => setType('movie'));
      if (animeBtn) animeBtn.addEventListener('click', () => setType('anime'));
      if (docBtn) docBtn.addEventListener('click', () => setType('documentary'));

      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          currentSortBy = e.target.value;
          resetAndFetch();
        });
      }

      if (ratingSelect) {
        ratingSelect.addEventListener('change', (e) => {
          currentMinRating = parseFloat(e.target.value);
          resetAndFetch();
        });
      }
    }
  };
}

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

export async function renderDiscoverView(initialType = 'tv') {
  let currentType = initialType; // 'tv', 'movie', 'anime', 'documentary'
  let currentGenreId = null;
  let currentSortBy = 'popularity.desc';
  let currentMinRating = 0;
  let currentPage = 1;
  let allItems = [];
  let isLoading = false;
  let isExhausted = false;

  const tvGenres = [
    { id: null, name: 'Tüm Türler' },
    { id: GENRE_MAP_TV.ACTION_ADVENTURE, name: 'Aksiyon & Macera' },
    { id: GENRE_MAP_TV.ANIMATION, name: 'Animasyon & Anime' },
    { id: GENRE_MAP_TV.COMEDY, name: 'Komedi' },
    { id: GENRE_MAP_TV.CRIME, name: 'Suç & Polisiye' },
    { id: GENRE_MAP_TV.DOCUMENTARY, name: 'Belgesel' },
    { id: GENRE_MAP_TV.DRAMA, name: 'Dram' },
    { id: GENRE_MAP_TV.SCI_FI_FANTASY, name: 'Bilim Kurgu & Fantastik' },
    { id: GENRE_MAP_TV.MYSTERY, name: 'Gizem & Gerilim' }
  ];

  const movieGenres = [
    { id: null, name: 'Tüm Türler' },
    { id: GENRE_MAP_MOVIE.ACTION, name: 'Aksiyon' },
    { id: GENRE_MAP_MOVIE.ADVENTURE, name: 'Macera' },
    { id: GENRE_MAP_MOVIE.ANIMATION, name: 'Animasyon' },
    { id: GENRE_MAP_MOVIE.COMEDY, name: 'Komedi' },
    { id: GENRE_MAP_MOVIE.CRIME, name: 'Suç' },
    { id: GENRE_MAP_MOVIE.DRAMA, name: 'Dram' },
    { id: GENRE_MAP_MOVIE.HORROR, name: 'Korku' },
    { id: GENRE_MAP_MOVIE.SCI_FI, name: 'Bilim Kurgu' },
    { id: GENRE_MAP_MOVIE.THRILLER, name: 'Gerilim' },
    { id: GENRE_MAP_MOVIE.ROMANCE, name: 'Romantik' }
  ];

  const getActiveGenres = () => currentType === 'movie' ? movieGenres : tvGenres;

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
              <p style="color: var(--text-sub); margin-top: 0.4rem; font-size: 0.95rem;">
                Tür, IMDb puanı ve sıralama kriterlerine göre binlerce dizi ve filmi anında filtreleyin.
              </p>
            </div>

            <!-- Content Type Switcher (Dizi / Film / Anime / Belgesel) -->
            <div style="display: flex; background: rgba(0, 0, 0, 0.4); padding: 0.35rem; border-radius: var(--radius-full); border: 1px solid var(--border-color); flex-wrap: wrap; gap: 0.25rem;">
              <button class="type-switch-btn ${currentType === 'tv' ? 'active' : ''}" id="discover-type-tv" style="padding: 0.6rem 1.2rem; font-weight: 700; font-size: 0.85rem; border-radius: var(--radius-full);">
                <i data-lucide="tv-2" style="width: 15px; height: 15px;"></i> Diziler
              </button>
              <button class="type-switch-btn ${currentType === 'movie' ? 'active' : ''}" id="discover-type-movie" style="padding: 0.6rem 1.2rem; font-weight: 700; font-size: 0.85rem; border-radius: var(--radius-full);">
                <i data-lucide="clapperboard" style="width: 15px; height: 15px;"></i> Filmler
              </button>
              <button class="type-switch-btn ${currentType === 'anime' ? 'active' : ''}" id="discover-type-anime" style="padding: 0.6rem 1.2rem; font-weight: 700; font-size: 0.85rem; border-radius: var(--radius-full);">
                <i data-lucide="sparkles" style="width: 15px; height: 15px;"></i> Anime
              </button>
              <button class="type-switch-btn ${currentType === 'documentary' ? 'active' : ''}" id="discover-type-doc" style="padding: 0.6rem 1.2rem; font-weight: 700; font-size: 0.85rem; border-radius: var(--radius-full);">
                <i data-lucide="globe" style="width: 15px; height: 15px;"></i> Belgesel
              </button>
            </div>
          </div>

          <!-- Advanced Filters Row -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.2rem; margin-top: 1.8rem; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.1);">
            
            <!-- Sort By Select -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="arrow-down-up" style="width:12px; height:12px;"></i> Sıralama Ölçütü
              </label>
              <select id="discover-sort-select" class="discover-filter-select">
                <option value="popularity.desc">🔥 En Popülerler (Trend)</option>
                <option value="vote_average.desc">⭐ En Yüksek IMDb Puanı</option>
                <option value="vote_count.desc">👥 En Çok Oylananlar</option>
                <option value="first_air_date.desc">📅 En Yeniler (Vizyon / Çıkış)</option>
              </select>
            </div>

            <!-- Min IMDb Rating Slider/Select -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="star" style="width:12px; height:12px;"></i> Minimum IMDb Puanı
              </label>
              <select id="discover-rating-select" class="discover-filter-select">
                <option value="0">Tümü (Puan Sınırı Yok)</option>
                <option value="8.0">⭐ 8.0 ve Üzeri (Başyapıtlar)</option>
                <option value="7.5">⭐ 7.5 ve Üzeri (Çok Yüksek)</option>
                <option value="7.0">⭐ 7.0 ve Üzeri (Çok İyi)</option>
                <option value="6.0">⭐ 6.0 ve Üzeri (İyi)</option>
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
          <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">İçerikler yükleniyor...</div>
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
        if (isLoading || isExhausted) return;
        isLoading = true;

        if (spinner) spinner.style.display = 'block';

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
            page: currentPage,
            sortBy: effectiveSort,
            minRating: currentMinRating,
            isAnime,
            isDoc
          });

          if (spinner) spinner.style.display = 'none';

          if (!results || results.length === 0) {
            if (currentPage === 1) {
              grid.innerHTML = `<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">Bu filtre kriterlerine uygun içerik bulunamadı.</div>`;
            }
            isExhausted = true;
            return;
          }

          allItems = [...allItems, ...results];
          const newCardsHTML = results.map(item => renderMediaCard(item)).join('');
          if (currentPage === 1) {
            grid.innerHTML = newCardsHTML;
          } else {
            grid.insertAdjacentHTML('beforeend', newCardsHTML);
          }
          if (window.lucide) window.lucide.createIcons();
          attachMediaCardEvents(grid);

          currentPage += 1;
        } catch (err) {
          console.error('Discover fetch error:', err);
          if (spinner) spinner.style.display = 'none';
        } finally {
          isLoading = false;
        }
      };

      const resetAndFetch = () => {
        currentPage = 1;
        allItems = [];
        isExhausted = false;
        grid.innerHTML = `<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">Yükleniyor...</div>`;
        fetchContent();
      };

      // Initial Render
      renderGenreBar();
      fetchContent();

      // Infinite scroll observer
      if (sentinel) {
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            fetchContent();
          }
        }, { rootMargin: '0px 0px 400px 0px' });
        observer.observe(sentinel);
      }

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

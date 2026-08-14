/* ==========================================================================
   CinePulse Studio - Ultra-Customized Advanced Discover View
   Features multi-filters: Type (TV/Movie), Genre, Sorting, Min IMDb Rating, Year.
   ========================================================================== */

import {
  fetchByGenre,
  GENRE_MAP_TV,
  GENRE_MAP_MOVIE,
  fetchPopularSeries,
  fetchPopularMovies,
  fetchTopRated
} from '../services/tmdbApi.js';
import { renderMediaCard, attachMediaCardEvents } from '../components/MediaCard.js';

export async function renderDiscoverView(initialType = 'tv') {
  let currentType = initialType; // 'tv' or 'movie'
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

  const getActiveGenres = () => currentType === 'tv' ? tvGenres : movieGenres;

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

            <!-- Content Type Switcher (Dizi / Film) -->
            <div style="display: flex; background: rgba(0, 0, 0, 0.4); padding: 0.35rem; border-radius: var(--radius-full); border: 1px solid var(--border-color);">
              <button class="type-switch-btn ${currentType === 'tv' ? 'active' : ''}" id="discover-type-tv" style="padding: 0.6rem 1.6rem; font-weight: 700; font-size: 0.9rem; border-radius: var(--radius-full);">
                <i data-lucide="tv-2" style="width: 16px; height: 16px;"></i> Diziler
              </button>
              <button class="type-switch-btn ${currentType === 'movie' ? 'active' : ''}" id="discover-type-movie" style="padding: 0.6rem 1.6rem; font-weight: 700; font-size: 0.9rem; border-radius: var(--radius-full);">
                <i data-lucide="clapperboard" style="width: 16px; height: 16px;"></i> Filmler
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
                <option value="vote_count.desc">👑 Tüm Zamanların En Çok Oy Alanları</option>
                <option value="vote_average.desc">⭐ En Yüksek IMDb Puanlılar</option>
                <option value="first_air_date.desc">✨ En Yeni Yayınlananlar</option>
              </select>
            </div>

            <!-- Min Rating Select -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="star" style="width:12px; height:12px; color: #fbbf24;"></i> Asgari IMDb Puanı
              </label>
              <select id="discover-rating-select" class="discover-filter-select">
                <option value="0">Tüm Puanlar (Fark Etmez)</option>
                <option value="8.5">🏆 8.5 ve Üzeri (Kült Efsaneler)</option>
                <option value="8.0">⭐ 8.0 ve Üzeri (Çok Yüksek Puanlı)</option>
                <option value="7.5">🌟 7.5 ve Üzeri (Harika Seçimler)</option>
                <option value="7.0">👍 7.0 ve Üzeri (Kaliteli Yapımlar)</option>
                <option value="6.0">🎬 6.0 ve Üzeri (Ortalama Üstü)</option>
              </select>
            </div>

          </div>
        </div>

        <!-- Dynamic Genre Bar -->
        <div class="discover-genre-scroll-wrapper" style="margin-bottom: 2rem;">
          <div class="season-bar" id="discover-genre-bar">
            <!-- Genre pills injected via JS -->
          </div>
        </div>

        <!-- Media Grid -->
        <div class="media-grid" id="discover-grid">
          <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">İçerikler filtreleniyor...</div>
        </div>

        <!-- Scroll Sentinel -->
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

      const genreBar = container.querySelector('#discover-genre-bar');
      const grid = container.querySelector('#discover-grid');
      const sentinel = container.querySelector('#discover-sentinel');
      const spinner = sentinel ? sentinel.querySelector('.spin-loader') : null;
      const tvBtn = container.querySelector('#discover-type-tv');
      const movieBtn = container.querySelector('#discover-type-movie');
      const sortSelect = container.querySelector('#discover-sort-select');
      const ratingSelect = container.querySelector('#discover-rating-select');

      const renderGenreBar = () => {
        if (!genreBar) return;
        const genres = getActiveGenres();
        genreBar.innerHTML = genres.map(g => `
          <button class="season-btn ${g.id === currentGenreId ? 'active' : ''}" data-genre="${g.id || ''}">
            ${g.name}
          </button>
        `).join('');

        genreBar.querySelectorAll('.season-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            genreBar.querySelectorAll('.season-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const attr = btn.getAttribute('data-genre');
            currentGenreId = attr ? parseInt(attr, 10) : null;
            resetAndFetch();
          });
        });
      };

      const fetchContent = async () => {
        if (isLoading || isExhausted) return;
        isLoading = true;

        if (spinner) spinner.style.display = 'block';

        try {
          let results = [];
          if (currentGenreId) {
            results = await fetchByGenre(currentType, currentGenreId, currentPage, currentSortBy);
          } else {
            if (currentSortBy === 'vote_average.desc') {
              results = await fetchTopRated(currentType, currentPage);
            } else if (currentSortBy === 'first_air_date.desc' || currentSortBy === 'primary_release_date.desc') {
              results = await fetchByGenre(currentType, null, currentPage, 'primary_release_date.desc');
            } else {
              results = currentType === 'tv' ? await fetchPopularSeries(currentPage) : await fetchPopularMovies(currentPage);
            }
          }

          // Min rating filter
          if (currentMinRating > 0) {
            results = results.filter(item => (item.vote_average || 0) >= currentMinRating);
          }

          if (spinner) spinner.style.display = 'none';

          if (!results || results.length === 0) {
            if (currentPage === 1) {
              grid.innerHTML = `<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">Bu filtre kriterlerine uygun içerik bulunamadı.</div>`;
            }
            isExhausted = true;
            return;
          }

          allItems = [...allItems, ...results];
          grid.innerHTML = allItems.map(item => renderMediaCard(item)).join('');
          if (window.lucide) window.lucide.createIcons();
          attachMediaCardEvents(container);

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
      if (tvBtn && movieBtn) {
        tvBtn.addEventListener('click', () => {
          if (currentType === 'tv') return;
          currentType = 'tv';
          currentGenreId = null;
          tvBtn.classList.add('active');
          movieBtn.classList.remove('active');
          renderGenreBar();
          resetAndFetch();
        });

        movieBtn.addEventListener('click', () => {
          if (currentType === 'movie') return;
          currentType = 'movie';
          currentGenreId = null;
          movieBtn.classList.add('active');
          tvBtn.classList.remove('active');
          renderGenreBar();
          resetAndFetch();
        });
      }

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

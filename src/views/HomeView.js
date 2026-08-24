/* ==========================================================================
   CinePulse Studio - Home View
   - "Haftanın Öne Çıkanları" spotlight grid at top
   - Infinite-loading horizontal rails with full horizontal scroll position memory
   ========================================================================== */

import {
  fetchTrending, fetchPopularSeries, fetchPopularMovies, fetchTopRated,
} from '../services/tmdbApi.js';
import { getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_POSTER_FALLBACK } from '../services/tmdbApi.js';
import { renderHeroSlider, attachHeroSliderEvents } from '../components/HeroSlider.js';
import { renderMediaCard, attachMediaCardEvents } from '../components/MediaCard.js';
import { showToast } from '../components/Toast.js';
import { railScrollMemory } from '../services/scrollManager.js';

// Cache home TMDB data & rail state across navigations
let homeDataCache = null;
const railExtraItemsCache = new Map();

// Rail state for infinite horizontal scrolling
const railState = {
  'rail-popular-tv':     { page: 1, loading: false, exhausted: false, fetcher: fetchPopularSeries },
  'rail-popular-movies': { page: 1, loading: false, exhausted: false, fetcher: fetchPopularMovies },
  'rail-top-tv':         { page: 1, loading: false, exhausted: false, fetcher: (p) => fetchTopRated('tv', p) },
  'rail-top-movies':     { page: 1, loading: false, exhausted: false, fetcher: (p) => fetchTopRated('movie', p) }
};

/* --------------------------------------------------------------------------
   "Haftanın Öne Çıkanları" spotlight — large feature + mini grid
-------------------------------------------------------------------------- */
function renderWeeklySpotlight(tvItems = [], movieItems = []) {
  const combined = [];
  for (let i = 0; i < Math.max(tvItems.length, movieItems.length); i++) {
    if (tvItems[i])    combined.push({ ...tvItems[i],    media_type: 'tv'    });
    if (movieItems[i]) combined.push({ ...movieItems[i], media_type: 'movie' });
  }
  const top7 = combined.slice(0, 7);
  if (top7.length === 0) return '';

  const hero = top7[0];
  const heroBackdrop = getImageUrl(hero.backdrop_path, TMDB_IMAGE_SIZES.BACKDROP_LARGE);
  const heroPoster   = getImageUrl(hero.poster_path,   TMDB_IMAGE_SIZES.POSTER_MEDIUM);
  const heroTitle    = hero.title || hero.name || '';
  const heroYear     = (hero.release_date || hero.first_air_date || '').substring(0, 4);
  const heroRating   = hero.vote_average ? hero.vote_average.toFixed(1) : '';
  const heroType     = hero.media_type === 'tv' ? 'DİZİ' : 'FİLM';
  const heroOverview = (hero.overview || '').slice(0, 180) + (hero.overview?.length > 180 ? '…' : '');

  const miniCards = top7.slice(1).map(item => {
    const poster  = getImageUrl(item.poster_path, TMDB_IMAGE_SIZES.POSTER_SMALL);
    const title   = item.title || item.name || '';
    const year    = (item.release_date || item.first_air_date || '').substring(0, 4);
    const rating  = item.vote_average ? item.vote_average.toFixed(1) : '';
    const type    = item.media_type === 'tv' ? 'DİZİ' : 'FİLM';
    return `
      <div class="spotlight-mini" data-id="${item.id}" data-type="${item.media_type || (item.first_air_date ? 'tv' : 'movie')}">
        <div class="spotlight-mini-poster-wrap">
          <img src="${poster}" alt="${title}" loading="lazy" onerror="this.src='${SINEFLIX_POSTER_FALLBACK}'" />
          <div class="spotlight-mini-overlay">
            <i data-lucide="play" style="fill:#fff;width:20px;height:20px;"></i>
          </div>
        </div>
        <div class="spotlight-mini-info">
          <span class="spotlight-mini-title">${title}</span>
          <span class="spotlight-mini-meta">
            <span class="spotlight-mini-type">${type}</span>
            ${year ? `<span>${year}</span>` : ''}
            ${rating ? `<span class="spotlight-mini-rating"><i data-lucide="star" style="width:10px;height:10px;fill:#fbbf24;color:#fbbf24;"></i>${rating}</span>` : ''}
          </span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <section class="weekly-spotlight-section">
      <div class="container">
        <div class="rail-header" style="margin-bottom:1.2rem;">
          <h2 class="rail-title">
            <span class="rail-icon-pill" style="--rail-color: #f59e0b;">
              <i data-lucide="flame" style="width:15px;height:15px;"></i>
            </span>
            Haftanın Öne Çıkanları
          </h2>
        </div>

        <div class="weekly-spotlight-grid">
          <!-- Large hero card -->
          <div class="spotlight-hero" data-id="${hero.id}" data-type="${hero.media_type || (hero.first_air_date ? 'tv' : 'movie')}">
            <div class="spotlight-hero-bg" style="background-image:url('${heroBackdrop}')"></div>
            <div class="spotlight-hero-overlay"></div>
            <div class="spotlight-hero-content">
              <div class="spotlight-hero-meta">
                <span class="spotlight-hero-type">${heroType}</span>
                ${heroYear ? `<span class="spotlight-hero-year">${heroYear}</span>` : ''}
                ${heroRating ? `<span class="spotlight-hero-rating"><i data-lucide="star" style="width:12px;height:12px;fill:#fbbf24;color:#fbbf24;"></i>${heroRating}</span>` : ''}
              </div>
              <h3 class="spotlight-hero-title">${heroTitle}</h3>
              ${heroOverview ? `<p class="spotlight-hero-overview">${heroOverview}</p>` : ''}
              <button class="spotlight-hero-btn">
                <i data-lucide="play" style="fill:#fff;width:16px;height:16px;"></i>
                Şimdi İzle
              </button>
            </div>
          </div>

          <!-- 6 mini cards grid -->
          <div class="spotlight-mini-grid">
            ${miniCards}
          </div>
        </div>
      </div>
    </section>
  `;
}

/* --------------------------------------------------------------------------
   Horizontal rail with infinite loading & extra cached cards
-------------------------------------------------------------------------- */
function renderInfiniteRail({ id, icon, title, accent, items }) {
  if (!items || items.length === 0) return '';
  const extraItems = railExtraItemsCache.get(id) || [];
  const allRailItems = [...items, ...extraItems];
  const cards = allRailItems.map(item => renderMediaCard(item)).join('');
  return `
    <section class="rail-section">
      <div class="container">
        <div class="rail-header">
          <h2 class="rail-title">
            <span class="rail-icon-pill" style="--rail-color: ${accent};">
              <i data-lucide="${icon}" style="width:15px;height:15px;"></i>
            </span>
            ${title}
          </h2>
        </div>
        <div class="card-rail" id="${id}">
          ${cards}
          <div class="rail-sentinel" data-rail="${id}"></div>
        </div>
      </div>
    </section>
  `;
}

/* --------------------------------------------------------------------------
   Continue Watching rail
-------------------------------------------------------------------------- */
function renderContinueWatchingSection(watchHistory) {
  if (!watchHistory || watchHistory.length === 0) return '';
  const cards = watchHistory.map(item => `
    <div class="continue-card-wrapper" data-id="${item.id}" data-season="${item.season || 1}" data-episode="${item.episode || 1}">
      ${renderMediaCard(item)}
      <button class="btn-delete-history" title="Geçmişten Kaldır" aria-label="Kaldır">
        <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
      </button>
    </div>
  `).join('');

  return `
    <section class="rail-section">
      <div class="container">
        <div class="rail-header">
          <h2 class="rail-title">
            <span class="rail-icon-pill" style="--rail-color: var(--primary);">
              <i data-lucide="history" style="width:15px;height:15px;"></i>
            </span>
            İzlemeye Devam Et
          </h2>
        </div>
        <div class="card-rail continue-rail" id="continue-watching-rail">
          ${cards}
        </div>
      </div>
    </section>
  `;
}

/* --------------------------------------------------------------------------
   Rail state for infinite horizontal scrolling
-------------------------------------------------------------------------- */
function initInfiniteRails(container) {
  const sentinels = container.querySelectorAll('.rail-sentinel');
  if (sentinels.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(async (entry) => {
      if (!entry.isIntersecting) return;

      const railId = entry.target.getAttribute('data-rail');
      const state  = railState[railId];
      if (!state || state.loading || state.exhausted) return;

      state.loading = true;
      state.page   += 1;

      // Show spinner before sentinel
      const spinner = document.createElement('div');
      spinner.className = 'rail-loader';
      spinner.innerHTML = `<i data-lucide="loader-2" class="spin-loader" style="width:22px;height:22px;color:var(--text-muted);"></i>`;
      entry.target.before(spinner);
      if (window.lucide) window.lucide.createIcons();

      try {
        const newItems = await state.fetcher(state.page);
        spinner.remove();

        if (!newItems || newItems.length === 0) {
          state.exhausted = true;
          return;
        }

        // Cache extra items for this rail
        const prevExtra = railExtraItemsCache.get(railId) || [];
        railExtraItemsCache.set(railId, [...prevExtra, ...newItems]);

        const rail = document.getElementById(railId);
        if (!rail) return;

        newItems.forEach(item => {
          const div = document.createElement('div');
          div.innerHTML = renderMediaCard(item);
          const card = div.firstElementChild;
          if (card) {
            rail.insertBefore(card, entry.target);
            card.addEventListener('click', () => {
              const id   = card.getAttribute('data-id');
              const type = card.getAttribute('data-type');
              window.location.hash = `#detail?type=${type}&id=${id}`;
            });
          }
        });

        if (window.lucide) window.lucide.createIcons();

      } catch (err) {
        spinner.remove();
        console.error('Rail load error:', err);
      }

      state.loading = false;
    });
  }, { root: null, rootMargin: '0px 300px 0px 0px', threshold: 0.1 });

  sentinels.forEach(s => observer.observe(s));
}

/* --------------------------------------------------------------------------
   Main render
-------------------------------------------------------------------------- */
export async function renderHomeView() {
  let trending, trendingTV, trendingMovies, popularTV, popularMovies, topRatedTV, topRatedMovies;

  if (homeDataCache) {
    ({ trending, trendingTV, trendingMovies, popularTV, popularMovies, topRatedTV, topRatedMovies } = homeDataCache);
  } else {
    [
      trending,
      trendingTV,
      trendingMovies,
      popularTV,
      popularMovies,
      topRatedTV,
      topRatedMovies
    ] = await Promise.all([
      fetchTrending('all',   'week', 1),
      fetchTrending('tv',    'week', 1),
      fetchTrending('movie', 'week', 1),
      fetchPopularSeries(1),
      fetchPopularMovies(1),
      fetchTopRated('tv',    1),
      fetchTopRated('movie', 1)
    ]);
    homeDataCache = { trending, trendingTV, trendingMovies, popularTV, popularMovies, topRatedTV, topRatedMovies };
  }

  const watchHistory = getUnifiedContinueWatching();
  const heroHTML = renderHeroSlider(trending);

  // Register infinite loaders without resetting page count
  if (!railState['rail-popular-tv']) railState['rail-popular-tv'] = { page: 1, loading: false, exhausted: false, fetcher: fetchPopularSeries };
  if (!railState['rail-popular-movies']) railState['rail-popular-movies'] = { page: 1, loading: false, exhausted: false, fetcher: fetchPopularMovies };
  if (!railState['rail-top-tv']) railState['rail-top-tv'] = { page: 1, loading: false, exhausted: false, fetcher: (p) => fetchTopRated('tv', p) };
  if (!railState['rail-top-movies']) railState['rail-top-movies'] = { page: 1, loading: false, exhausted: false, fetcher: (p) => fetchTopRated('movie', p) };
  Object.values(railState).forEach(s => { s.loading = false; });

  const viewHTML = `
    <div class="home-view">
      ${heroHTML}

      ${renderContinueWatchingSection(watchHistory)}

      ${renderWeeklySpotlight(trendingTV, trendingMovies)}

      ${renderInfiniteRail({
        id:    'rail-popular-tv',
        icon:  'tv-2',
        title: 'Popüler Diziler',
        accent:'#14b8a6',
        items: popularTV
      })}

      ${renderInfiniteRail({
        id:    'rail-popular-movies',
        icon:  'clapperboard',
        title: 'Popüler Filmler',
        accent:'#a78bfa',
        items: popularMovies
      })}

      ${renderInfiniteRail({
        id:    'rail-top-tv',
        icon:  'star',
        title: 'En Yüksek Puanlı Diziler',
        accent:'#fbbf24',
        items: topRatedTV
      })}

      ${renderInfiniteRail({
        id:    'rail-top-movies',
        icon:  'award',
        title: 'En Yüksek Puanlı Filmler',
        accent:'#34d399',
        items: topRatedMovies
      })}
    </div>
  `;

  return {
    html: viewHTML,
    init: (container) => {
      if (trending.length > 0) attachHeroSliderEvents(trending);
      attachMediaCardEvents(container);

      // Restore and track horizontal scroll position for each rail
      container.querySelectorAll('.card-rail').forEach(rail => {
        const railId = rail.id;

        // Restore saved horizontal scroll position
        if (railId) {
          let savedLeft = railScrollMemory.get(railId);
          if (typeof savedLeft !== 'number') {
            try {
              const stored = sessionStorage.getItem(`cinepulse_rail_${railId}`);
              if (stored) savedLeft = parseFloat(stored);
            } catch (_) {}
          }

          if (typeof savedLeft === 'number' && savedLeft > 0) {
            rail.scrollLeft = savedLeft;
            requestAnimationFrame(() => {
              rail.scrollLeft = savedLeft;
            });
          }

          // Continuously record horizontal scroll
          rail.addEventListener('scroll', () => {
            railScrollMemory.set(railId, rail.scrollLeft);
            try {
              sessionStorage.setItem(`cinepulse_rail_${railId}`, rail.scrollLeft);
            } catch (_) {}
          }, { passive: true });
        }

        // Wheel → horizontal scroll
        rail.addEventListener('wheel', (e) => {
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
          e.preventDefault();
          rail.scrollBy({ left: e.deltaY * 2.5, behavior: 'smooth' });
        }, { passive: false });
      });

      // Spotlight hero click
      container.querySelectorAll('.spotlight-hero, .spotlight-mini').forEach(el => {
        el.addEventListener('click', () => {
          const id   = el.getAttribute('data-id');
          const type = el.getAttribute('data-type');
          if (id && type) window.location.hash = `#detail?type=${type}&id=${id}`;
        });
      });

      // Spotlight hero play button
      container.querySelector('.spotlight-hero-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const hero = container.querySelector('.spotlight-hero');
        if (hero) {
          const id   = hero.getAttribute('data-id');
          const type = hero.getAttribute('data-type');
          window.location.hash = `#detail?type=${type}&id=${id}`;
        }
      });

      // Infinite scroll
      initInfiniteRails(container);

      // Delete from continue watching
      container.querySelectorAll('.btn-delete-history').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const wrapper = btn.closest('.continue-card-wrapper');
          if (!wrapper) return;
          const id = wrapper.getAttribute('data-id');
          removeSeriesFromHistory(id);
          showToast('İçerik izleme geçmişinden kaldırıldı.', 'info');
          wrapper.style.transition = 'all 0.28s ease-out';
          wrapper.style.transform  = 'scale(0.85)';
          wrapper.style.opacity    = '0';
          setTimeout(() => {
            wrapper.remove();
            const rail = container.querySelector('#continue-watching-rail');
            if (rail && rail.children.length === 0) {
              rail.closest('.rail-section')?.remove();
            }
          }, 300);
        });
      });
    }
  };
}

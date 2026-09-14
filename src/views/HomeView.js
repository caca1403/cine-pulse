/* ==========================================================================
   CinePulse Studio - Home View
   - Dynamic Hero Slider
   - Infinite-loading horizontal rails with full horizontal scroll position memory
   - Dedicated Kids Mode support
   ========================================================================== */

import {
  fetchTrending, fetchPopularSeries, fetchPopularMovies, fetchTopRated, fetchPopularAnime, fetchPopularDocumentaries,
  fetchKidsPopularSeries, fetchKidsPopularMovies, fetchKidsAdventures
} from '../services/tmdbApi.js';
import { getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_POSTER_FALLBACK } from '../services/tmdbApi.js';
import { getUnifiedContinueWatching, removeSeriesFromHistory, isKidProfileActive, filterForActiveProfile } from '../services/storage.js';
import { renderHeroSlider, attachHeroSliderEvents } from '../components/HeroSlider.js';
import { renderMediaCard, attachMediaCardEvents } from '../components/MediaCard.js';
import { showToast } from '../components/Toast.js';
import { railScrollMemory } from '../services/scrollManager.js';

// Cache home TMDB data & rail state across navigations
let homeDataCache = null;
const railExtraItemsCache = new Map();

export function clearHomeCache() {
  homeDataCache = null;
  railExtraItemsCache.clear();
  Object.keys(railState).forEach(k => {
    railState[k].page = 1;
    railState[k].loading = false;
    railState[k].exhausted = false;
  });
}

// Rail state for infinite horizontal scrolling
const railState = {
  'rail-popular-tv':     { page: 1, loading: false, exhausted: false, fetcher: fetchPopularSeries },
  'rail-popular-movies': { page: 1, loading: false, exhausted: false, fetcher: fetchPopularMovies },
  'rail-top-tv':         { page: 1, loading: false, exhausted: false, fetcher: (p) => fetchTopRated('tv', p) },
  'rail-top-movies':     { page: 1, loading: false, exhausted: false, fetcher: (p) => fetchTopRated('movie', p) },
  'rail-anime':          { page: 1, loading: false, exhausted: false, fetcher: fetchPopularAnime },
  'rail-documentary':    { page: 1, loading: false, exhausted: false, fetcher: fetchPopularDocumentaries }
};



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
      ${renderMediaCard(item, { isContinueSection: true })}
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
  const isKid = isKidProfileActive();
  let trending, popularTV, popularMovies, topRatedTV, topRatedMovies, animeItems, docItems, kidsAdventures;

  if (homeDataCache && homeDataCache.isKid === isKid) {
    ({ trending, popularTV, popularMovies, topRatedTV, topRatedMovies, animeItems, docItems, kidsAdventures } = homeDataCache);
  } else {
    if (isKid) {
      [
        trending,
        popularTV,
        popularMovies,
        kidsAdventures,
        animeItems,
        docItems
      ] = await Promise.all([
        fetchTrending('all', 'week', 1),
        fetchKidsPopularSeries(1),
        fetchKidsPopularMovies(1),
        fetchKidsAdventures(1),
        fetchPopularAnime(1),
        fetchPopularDocumentaries(1)
      ]);
      homeDataCache = { isKid: true, trending, popularTV, popularMovies, kidsAdventures, animeItems, docItems };
    } else {
      [
        trending,
        popularTV,
        popularMovies,
        topRatedTV,
        topRatedMovies,
        animeItems,
        docItems
      ] = await Promise.all([
        fetchTrending('all',   'week', 1),
        fetchPopularSeries(1),
        fetchPopularMovies(1),
        fetchTopRated('tv',    1),
        fetchTopRated('movie', 1),
        fetchPopularAnime(1),
        fetchPopularDocumentaries(1)
      ]);
      homeDataCache = { isKid: false, trending, popularTV, popularMovies, topRatedTV, topRatedMovies, animeItems, docItems };
    }
  }

  const rawWatchHistory = getUnifiedContinueWatching();
  const watchHistory = filterForActiveProfile(rawWatchHistory);
  
  // Kids mode: use kids-specific content for hero (not filtered trending which lets adult content through)
  let heroItems;
  if (isKid) {
    const kidsHeroPool = [...(popularMovies || []), ...(popularTV || [])].filter(i => i.backdrop_path);
    heroItems = kidsHeroPool.slice(0, 10);
  } else {
    heroItems = trending;
  }
  const heroHTML = renderHeroSlider(heroItems);

  // Register infinite loaders without resetting page count
  if (isKid) {
    if (!railState['rail-kids-series']) railState['rail-kids-series'] = { page: 1, loading: false, exhausted: false, fetcher: fetchKidsPopularSeries };
    if (!railState['rail-kids-movies']) railState['rail-kids-movies'] = { page: 1, loading: false, exhausted: false, fetcher: fetchKidsPopularMovies };
    if (!railState['rail-kids-adventures']) railState['rail-kids-adventures'] = { page: 1, loading: false, exhausted: false, fetcher: fetchKidsAdventures };
  } else {
    if (!railState['rail-popular-tv']) railState['rail-popular-tv'] = { page: 1, loading: false, exhausted: false, fetcher: fetchPopularSeries };
    if (!railState['rail-popular-movies']) railState['rail-popular-movies'] = { page: 1, loading: false, exhausted: false, fetcher: fetchPopularMovies };
    if (!railState['rail-top-tv']) railState['rail-top-tv'] = { page: 1, loading: false, exhausted: false, fetcher: (p) => fetchTopRated('tv', p) };
    if (!railState['rail-top-movies']) railState['rail-top-movies'] = { page: 1, loading: false, exhausted: false, fetcher: (p) => fetchTopRated('movie', p) };
  }
  if (!railState['rail-anime']) railState['rail-anime'] = { page: 1, loading: false, exhausted: false, fetcher: fetchPopularAnime };
  if (!railState['rail-documentary']) railState['rail-documentary'] = { page: 1, loading: false, exhausted: false, fetcher: fetchPopularDocumentaries };
  Object.values(railState).forEach(s => { s.loading = false; });

  let railsHTML = '';
  if (isKid) {
    railsHTML = `
      ${renderInfiniteRail({
        id:    'rail-kids-movies',
        icon:  'sparkles',
        title: '🎈 En Çok Sevilen Animasyon & Çocuk Filmleri',
        accent:'#ec4899',
        items: popularMovies
      })}

      ${renderInfiniteRail({
        id:    'rail-kids-series',
        icon:  'tv',
        title: '🌟 Eğlenceli Çizgi Diziler & Maceralar',
        accent:'#f59e0b',
        items: popularTV
      })}

      ${kidsAdventures && kidsAdventures.length > 0 ? renderInfiniteRail({
        id:    'rail-kids-adventures',
        icon:  'compass',
        title: '⭐ Aile ve Fantastik Sinema Kuşağı',
        accent:'#38bdf8',
        items: kidsAdventures
      }) : ''}

      ${animeItems && animeItems.length > 0 ? renderInfiniteRail({
        id:    'rail-anime',
        icon:  'smile',
        title: '🎌 Çocuk & Genç Anime Dünyası',
        accent:'#a855f7',
        items: animeItems
      }) : ''}

      ${docItems && docItems.length > 0 ? renderInfiniteRail({
        id:    'rail-documentary',
        icon:  'globe',
        title: '🐾 Sevimli Hayvanlar & Doğa Alemi',
        accent:'#10b981',
        items: docItems
      }) : ''}
    `;
  } else {
    railsHTML = `
      ${renderInfiniteRail({
        id:    'rail-popular-tv',
        icon:  'tv-2',
        title: 'Trend Diziler & Yapımlar',
        accent:'#14b8a6',
        items: popularTV
      })}

      ${renderInfiniteRail({
        id:    'rail-popular-movies',
        icon:  'clapperboard',
        title: 'Vizyondaki Popüler Filmler',
        accent:'#a78bfa',
        items: popularMovies
      })}

      ${renderInfiniteRail({
        id:    'rail-top-movies',
        icon:  'award',
        title: '⭐ Sinema Tarihinin Başyapıtları (IMDb 8.5+)',
        accent:'#fbbf24',
        items: topRatedMovies
      })}

      ${renderInfiniteRail({
        id:    'rail-top-tv',
        icon:  'star',
        title: 'Kült & En Yüksek Puanlı Diziler',
        accent:'#34d399',
        items: topRatedTV
      })}

      ${animeItems && animeItems.length > 0 ? renderInfiniteRail({
        id:    'rail-anime',
        icon:  'sparkles',
        title: '🎌 Popüler Anime Evreni (TR Dublaj & Altyazı)',
        accent:'#ec4899',
        items: animeItems
      }) : ''}

      ${docItems && docItems.length > 0 ? renderInfiniteRail({
        id:    'rail-documentary',
        icon:  'globe',
        title: '🌍 İlham Veren Kült Belgeseller',
        accent:'#38bdf8',
        items: docItems
      }) : ''}
    `;
  }

  const viewHTML = `
    <div class="home-view ${isKid ? 'is-kids-mode' : ''}">
      ${heroHTML}

      ${renderContinueWatchingSection(watchHistory)}

      ${railsHTML}
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

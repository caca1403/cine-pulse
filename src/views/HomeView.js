import { renderIcons } from '../services/icons.js';
/* ==========================================================================
   CinePulse Studio - Home View
   - Dynamic Hero Slider
   - Infinite-loading horizontal rails with full horizontal scroll position memory
   - Dedicated Kids Mode support
   ========================================================================== */

import {
  fetchTrending, fetchPopularSeries, fetchPopularMovies, fetchTopRated, fetchPopularAnime, fetchPopularDocumentaries,
  fetchKidsPopularSeries, fetchKidsPopularMovies, fetchKidsAdventures, fetchKidsDocumentaries, fetchKidsAnime,
  fetchKidsAnimationSeries, fetchKidsClassicCartoonSeries,
  fetchAdultAnimationSeries, fetchCartoonSeries
} from '../services/tmdbApi.js';
import { getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_POSTER_FALLBACK } from '../services/tmdbApi.js';
import { getUnifiedContinueWatching, removeSeriesFromHistory, isKidProfileActive, filterForActiveProfile, isItemKidSafe } from '../services/storage.js';
import { renderHeroSlider, attachHeroSliderEvents, stopHeroSlider } from '../components/HeroSlider.js';
import { renderMediaCard, attachMediaCardEvents } from '../components/MediaCard.js';
import { showToast } from '../components/Toast.js';
import { railScrollMemory } from '../services/scrollManager.js';

// Cache home TMDB data & rail state across navigations
let homeDataCache = null;
let homeSecondaryPending = null;
let homeCacheGeneration = 0;
const railExtraItemsCache = new Map();
const activeRailObservers = new Set();
const HOME_CACHE_TTL_MS = 10 * 60 * 1000;

export function cleanupHomeView() {
  stopHeroSlider();
  for (const observer of activeRailObservers) observer.disconnect();
  activeRailObservers.clear();
}

function getPersistentHomeCache(isKid) {
  try {
    const raw = sessionStorage.getItem(`cinepulse_home_fast_v7_${isKid ? 'kids' : 'adult'}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > HOME_CACHE_TTL_MS) return null;
    return parsed.data?.isKid === isKid ? parsed.data : null;
  } catch (_) {
    return null;
  }
}

function persistHomeCache(data) {
  try {
    sessionStorage.setItem(`cinepulse_home_fast_v7_${data.isKid ? 'kids' : 'adult'}`, JSON.stringify({
      savedAt: Date.now(),
      data
    }));
  } catch (_) {}
}

export function clearHomeCache() {
  homeDataCache = null;
  homeSecondaryPending = null;
  homeCacheGeneration++;
  try {
    sessionStorage.removeItem('cinepulse_home_fast_v2_kids');
    sessionStorage.removeItem('cinepulse_home_fast_v2_adult');
    sessionStorage.removeItem('cinepulse_home_fast_v3_kids');
    sessionStorage.removeItem('cinepulse_home_fast_v3_adult');
    sessionStorage.removeItem('cinepulse_home_fast_v4_kids');
    sessionStorage.removeItem('cinepulse_home_fast_v4_adult');
    sessionStorage.removeItem('cinepulse_home_fast_v5_kids');
    sessionStorage.removeItem('cinepulse_home_fast_v5_adult');
    sessionStorage.removeItem('cinepulse_home_fast_v6_kids');
    sessionStorage.removeItem('cinepulse_home_fast_v6_adult');
    sessionStorage.removeItem('cinepulse_home_fast_v7_kids');
    sessionStorage.removeItem('cinepulse_home_fast_v7_adult');
  } catch (_) {}
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
  'rail-adult-animation':{ page: 1, loading: false, exhausted: false, fetcher: fetchAdultAnimationSeries },
  'rail-cartoon-series':  { page: 1, loading: false, exhausted: false, fetcher: fetchCartoonSeries },
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
  // Display top 24 most recent in-progress items on the home rail (all remain accessible in Library)
  const displayItems = watchHistory.slice(0, 24);
  const cards = displayItems.map(item => `
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

  sentinels.forEach(sentinel => {
    const railId = sentinel.getAttribute('data-rail');
    const rail = document.getElementById(railId);
    if (!rail) return;

    const loadMore = async () => {
      const state = railState[railId];
      if (!state || state.loading || state.exhausted) return;

      state.loading = true;
      const spinner = document.createElement('div');
      spinner.className = 'rail-loader';
      spinner.innerHTML = `<i data-lucide="loader-2" class="spin-loader" style="width:22px;height:22px;color:var(--text-muted);"></i>`;
      sentinel.before(spinner);
      renderIcons(spinner);

      try {
        const seenIds = new Set(
          Array.from(rail.querySelectorAll('.media-card[data-id]'))
            .map(card => String(card.getAttribute('data-id')))
            .filter(Boolean)
        );
        let newItems = [];

        for (let attempt = 0; attempt < 4 && newItems.length === 0; attempt += 1) {
          state.page += 1;
          const fetchedItems = await state.fetcher(state.page);
          if (!fetchedItems || fetchedItems.length === 0) {
            state.exhausted = true;
            break;
          }
          newItems = fetchedItems.filter(item => {
            const id = String(item?.id || '');
            if (!id || seenIds.has(id)) return false;
            seenIds.add(id);
            return true;
          });
        }
        spinner.remove();

        if (newItems.length === 0 || !rail.isConnected) {
          state.loading = false;
          return;
        }

        const prevExtra = railExtraItemsCache.get(railId) || [];
        railExtraItemsCache.set(railId, [...prevExtra, ...newItems]);

        newItems.forEach(item => {
          const div = document.createElement('div');
          div.innerHTML = renderMediaCard(item);
          const card = div.firstElementChild;
          if (card) {
            rail.insertBefore(card, sentinel);
            card.addEventListener('click', () => {
              const id   = card.getAttribute('data-id');
              const type = card.getAttribute('data-type');
              window.location.hash = `#detail?type=${type}&id=${id}`;
            });
          }
        });

        renderIcons(rail);
      } catch (err) {
        spinner.remove();
        console.error('Rail load error:', err);
      }

      state.loading = false;
    };

    // 1. Scroll listener on the horizontal container
    rail.addEventListener('scroll', () => {
      if (rail.scrollWidth - (rail.scrollLeft + rail.clientWidth) < 600) {
        loadMore();
      }
    }, { passive: true });

    // 2. IntersectionObserver with root = rail
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) loadMore();
      });
    }, { root: rail, rootMargin: '0px 400px 0px 0px', threshold: 0 });
    obs.observe(sentinel);
    activeRailObservers.add(obs);
  });
}

/* --------------------------------------------------------------------------
   Main render
-------------------------------------------------------------------------- */
export async function renderHomeView() {
  const cacheGeneration = homeCacheGeneration;
  const isKid = isKidProfileActive();
  let trending, popularTV, popularMovies, topRatedTV, topRatedMovies, animeItems, docItems, kidsAdventures, adultAnimationItems, cartoonSeriesItems, kidsAnimationItems, kidsClassicCartoonItems;

  if (!homeDataCache) homeDataCache = getPersistentHomeCache(isKid);

  let secondaryReady = null;
  let secondarySettled = false;
  let primarySettled = false;
  if (homeDataCache && homeDataCache.isKid === isKid) {
    ({ trending, popularTV, popularMovies, topRatedTV, topRatedMovies, animeItems, docItems, kidsAdventures, adultAnimationItems, cartoonSeriesItems, kidsAnimationItems, kidsClassicCartoonItems } = homeDataCache);
    secondaryReady = homeSecondaryPending;
    secondarySettled = !secondaryReady;
  } else if (isKid) {
    secondaryReady = Promise.all([
      fetchKidsAdventures(1), fetchKidsAnime(1),
      fetchKidsAnimationSeries(1), fetchKidsClassicCartoonSeries(1)
    ]).then(results => {
      if (cacheGeneration !== homeCacheGeneration) return;
      [kidsAdventures, animeItems, kidsAnimationItems, kidsClassicCartoonItems] = results;
      homeDataCache = { isKid: true, trending, popularTV, popularMovies, kidsAdventures, animeItems, kidsAnimationItems, kidsClassicCartoonItems };
      if (primarySettled) persistHomeCache(homeDataCache);
      secondarySettled = true;
    }).catch(() => { secondarySettled = true; });
    homeSecondaryPending = secondaryReady;
    secondaryReady.then(() => { if (homeSecondaryPending === secondaryReady) homeSecondaryPending = null; });
    [popularTV, popularMovies] = await Promise.all([
      fetchKidsPopularSeries(1), fetchKidsPopularMovies(1)
    ]);
    trending = [...(popularMovies || []), ...(popularTV || [])]
      .filter(item => item.backdrop_path && isItemKidSafe(item)).slice(0, 10);
    if (cacheGeneration !== homeCacheGeneration) return null;
    if (!secondarySettled) homeDataCache = { isKid: true, trending, popularTV, popularMovies };
  } else {
    secondaryReady = Promise.all([
      fetchTopRated('tv', 1), fetchTopRated('movie', 1),
      fetchPopularAnime(1), fetchPopularDocumentaries(1),
      fetchAdultAnimationSeries(1), fetchCartoonSeries(1)
    ]).then(results => {
      if (cacheGeneration !== homeCacheGeneration) return;
      [topRatedTV, topRatedMovies, animeItems, docItems, adultAnimationItems, cartoonSeriesItems] = results;
      homeDataCache = { isKid: false, trending, popularTV, popularMovies, topRatedTV, topRatedMovies, animeItems, docItems, adultAnimationItems, cartoonSeriesItems };
      if (primarySettled) persistHomeCache(homeDataCache);
      secondarySettled = true;
    }).catch(() => { secondarySettled = true; });
    homeSecondaryPending = secondaryReady;
    secondaryReady.then(() => { if (homeSecondaryPending === secondaryReady) homeSecondaryPending = null; });
    [trending, popularTV, popularMovies] = await Promise.all([
      fetchTrending('all', 'week', 1),
      fetchPopularSeries(1), fetchPopularMovies(1)
    ]);
    if (cacheGeneration !== homeCacheGeneration) return null;
    if (!secondarySettled) homeDataCache = { isKid: false, trending, popularTV, popularMovies };
  }
  primarySettled = true;
  if (secondarySettled && homeDataCache) persistHomeCache(homeDataCache);
  const secondaryInInitialHTML = secondarySettled;

  const rawWatchHistory = getUnifiedContinueWatching();
  const watchHistory = filterForActiveProfile(rawWatchHistory);
  
  // Kids mode: use kids-specific content for hero (strictly filtered for safe kids items)
  let heroItems;
  if (isKid) {
    const kidsHeroPool = [...(popularMovies || []), ...(popularTV || [])].filter(i => i.backdrop_path && isItemKidSafe(i));
    heroItems = kidsHeroPool.slice(0, 10);
  } else {
    heroItems = trending;
  }
  const heroHTML = renderHeroSlider(heroItems);

  // Register infinite loaders without resetting page count
  if (isKid) {
    if (!railState['rail-kids-animation']) railState['rail-kids-animation'] = { page: 1, loading: false, exhausted: false, fetcher: fetchKidsAnimationSeries };
    if (!railState['rail-kids-classics']) railState['rail-kids-classics'] = { page: 1, loading: false, exhausted: false, fetcher: fetchKidsClassicCartoonSeries };
    if (!railState['rail-kids-movies']) railState['rail-kids-movies'] = { page: 1, loading: false, exhausted: false, fetcher: fetchKidsPopularMovies };
    if (!railState['rail-kids-adventures']) railState['rail-kids-adventures'] = { page: 1, loading: false, exhausted: false, fetcher: fetchKidsAdventures };
    if (!railState['rail-anime']) railState['rail-anime'] = { page: 1, loading: false, exhausted: false, fetcher: fetchKidsAnime };
  } else {
    if (!railState['rail-popular-tv']) railState['rail-popular-tv'] = { page: 1, loading: false, exhausted: false, fetcher: fetchPopularSeries };
    if (!railState['rail-popular-movies']) railState['rail-popular-movies'] = { page: 1, loading: false, exhausted: false, fetcher: fetchPopularMovies };
    if (!railState['rail-top-tv']) railState['rail-top-tv'] = { page: 1, loading: false, exhausted: false, fetcher: (p) => fetchTopRated('tv', p) };
    if (!railState['rail-top-movies']) railState['rail-top-movies'] = { page: 1, loading: false, exhausted: false, fetcher: (p) => fetchTopRated('movie', p) };
    if (!railState['rail-anime']) railState['rail-anime'] = { page: 1, loading: false, exhausted: false, fetcher: fetchPopularAnime };
    if (!railState['rail-adult-animation']) railState['rail-adult-animation'] = { page: 1, loading: false, exhausted: false, fetcher: fetchAdultAnimationSeries };
    if (!railState['rail-cartoon-series']) railState['rail-cartoon-series'] = { page: 1, loading: false, exhausted: false, fetcher: fetchCartoonSeries };
  }
  if (!isKid) {
    if (!railState['rail-documentary']) railState['rail-documentary'] = { page: 1, loading: false, exhausted: false, fetcher: fetchPopularDocumentaries };
  }
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

      ${kidsAnimationItems && kidsAnimationItems.length > 0 ? renderInfiniteRail({
        id:    'rail-kids-animation',
        icon:  'sparkles',
        title: 'Çocuk Animasyonları & Yeni Çizgi Diziler',
        accent:'#fb7185',
        items: kidsAnimationItems
      }) : ''}

      ${kidsClassicCartoonItems && kidsClassicCartoonItems.length > 0 ? renderInfiniteRail({
        id:    'rail-kids-classics',
        icon:  'palette',
        title: 'Çizgi Dizi Dünyası & Unutulmaz Klasikler',
        accent:'#38bdf8',
        items: kidsClassicCartoonItems
      }) : ''}

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

      ${adultAnimationItems && adultAnimationItems.length > 0 ? renderInfiniteRail({
        id:    'rail-adult-animation',
        icon:  'sparkles',
        title: 'Yetişkin Animasyonları & Çizgi Diziler',
        accent:'#fb7185',
        items: adultAnimationItems
      }) : ''}

      ${cartoonSeriesItems && cartoonSeriesItems.length > 0 ? renderInfiniteRail({
        id:    'rail-cartoon-series',
        icon:  'wand-sparkles',
        title: 'Çizgi Dizi Dünyası & Unutulmaz Klasikler',
        accent:'#38bdf8',
        items: cartoonSeriesItems
      }) : ''}

      ${renderInfiniteRail({
        id:    'rail-popular-movies',
        icon:  'clapperboard',
        title: 'Tüm Zamanların En Popüler Filmleri',
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
      const sliderItems = (heroItems && heroItems.length > 0) ? heroItems : trending;
      if (sliderItems && sliderItems.length > 0) attachHeroSliderEvents(sliderItems);
      attachMediaCardEvents(container);

      const attachRailScrolling = (root) => {
      root.querySelectorAll('.card-rail').forEach(rail => {
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
          }, { passive: true });
        }

        // Wheel → horizontal scroll
        rail.addEventListener('wheel', (e) => {
          if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
          e.preventDefault();
          rail.scrollBy({ left: e.deltaY * 2.5, behavior: 'smooth' });
        }, { passive: false });
      });
      };
      attachRailScrolling(container);

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
      if (secondaryReady && !secondaryInInitialHTML) {
        const homeView = container.querySelector('.home-view');
        secondaryReady.then(() => {
          ({ topRatedTV, topRatedMovies, animeItems, docItems, kidsAdventures, adultAnimationItems, cartoonSeriesItems, kidsAnimationItems, kidsClassicCartoonItems } = homeDataCache || {});
          if (!homeView?.isConnected || !(window.location.hash || '#home').startsWith('#home')) return;
          const extra = document.createElement('div');
          extra.className = 'home-more-rails';
          extra.innerHTML = isKid ? `
            ${renderInfiniteRail({ id: 'rail-kids-animation', icon: 'sparkles', title: 'Çocuk Animasyonları & Yeni Çizgi Diziler', accent: '#fb7185', items: kidsAnimationItems })}
            ${renderInfiniteRail({ id: 'rail-kids-classics', icon: 'palette', title: 'Çizgi Dizi Dünyası & Unutulmaz Klasikler', accent: '#38bdf8', items: kidsClassicCartoonItems })}
            ${renderInfiniteRail({ id: 'rail-kids-adventures', icon: 'compass', title: '⭐ Aile ve Fantastik Sinema Kuşağı', accent: '#38bdf8', items: kidsAdventures })}
            ${renderInfiniteRail({ id: 'rail-anime', icon: 'smile', title: '🎌 Çocuk & Genç Anime Dünyası', accent: '#a855f7', items: animeItems })}
          ` : `
            ${renderInfiniteRail({ id: 'rail-adult-animation', icon: 'sparkles', title: 'Yetişkin Animasyonları & Çizgi Diziler', accent: '#fb7185', items: adultAnimationItems })}
            ${renderInfiniteRail({ id: 'rail-cartoon-series', icon: 'wand-sparkles', title: 'Çizgi Dizi Dünyası & Unutulmaz Klasikler', accent: '#38bdf8', items: cartoonSeriesItems })}
            ${renderInfiniteRail({ id: 'rail-top-movies', icon: 'award', title: '⭐ Sinema Tarihinin Başyapıtları (IMDb 8.5+)', accent: '#fbbf24', items: topRatedMovies })}
            ${renderInfiniteRail({ id: 'rail-top-tv', icon: 'star', title: 'Kült & En Yüksek Puanlı Diziler', accent: '#34d399', items: topRatedTV })}
            ${renderInfiniteRail({ id: 'rail-anime', icon: 'sparkles', title: '🎌 Popüler Anime Evreni (TR Dublaj & Altyazı)', accent: '#ec4899', items: animeItems })}
            ${renderInfiniteRail({ id: 'rail-documentary', icon: 'globe', title: '🌍 İlham Veren Kült Belgeseller', accent: '#38bdf8', items: docItems })}
          `;
          homeView.append(extra);
          renderIcons(extra);
          attachRailScrolling(extra);
          initInfiniteRails(extra);
        });
      }

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

      // Live-update Continue Watching section when Trakt sync completes (NO page refresh needed)
      const liveUpdateContinueWatching = () => {
        if (!(window.location.hash || '#home').startsWith('#home')) return;
        const homeView = container.querySelector('.home-view');
        if (!homeView?.isConnected) return;

        console.log('[HomeView] Live-updating Continue Watching rail after data change...');
        const freshList = filterForActiveProfile(getUnifiedContinueWatching());
        const existingSection = container.querySelector('#continue-watching-rail')?.closest('.rail-section');
        
        if (freshList && freshList.length > 0) {
          const displayItems = freshList.slice(0, 24);
          const cards = displayItems.map(item => `
            <div class="continue-card-wrapper" data-id="${item.id}" data-season="${item.season || 1}" data-episode="${item.episode || 1}">
              ${renderMediaCard(item, { isContinueSection: true })}
              <button class="btn-delete-history" title="Geçmişten Kaldır" aria-label="Kaldır">
                <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
              </button>
            </div>
          `).join('');

          if (existingSection) {
            // Update existing rail
            const rail = existingSection.querySelector('#continue-watching-rail');
            if (rail) rail.innerHTML = cards;
          } else {
            // Create new rail section and insert after hero
            const sectionHTML = `
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
            const heroSection = homeView.querySelector('.hero-slider-section') || homeView.querySelector('.rail-section');
            if (heroSection) {
              heroSection.insertAdjacentHTML('afterend', sectionHTML);
            } else {
              homeView.insertAdjacentHTML('afterbegin', sectionHTML);
            }
          }

          // Re-attach events on updated cards
          renderIcons(container);
          attachMediaCardEvents(container);
          container.querySelectorAll('.btn-delete-history').forEach(btn => {
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              const wrapper = btn.closest('.continue-card-wrapper');
              if (!wrapper) return;
              const deleteId = wrapper.getAttribute('data-id');
              removeSeriesFromHistory(deleteId);
              showToast('İçerik izleme geçmişinden kaldırıldı.', 'info');
              wrapper.style.transition = 'all 0.28s ease-out';
              wrapper.style.transform  = 'scale(0.85)';
              wrapper.style.opacity    = '0';
              setTimeout(() => {
                wrapper.remove();
                const railEl = container.querySelector('#continue-watching-rail');
                if (railEl && railEl.children.length === 0) {
                  railEl.closest('.rail-section')?.remove();
                }
              }, 300);
            });
          });
          console.log('[HomeView] Continue Watching rail updated with', freshList.length, 'items');
        } else if (existingSection) {
          existingSection.remove();
        }
      };

      window.addEventListener('cinepulse_data_changed', liveUpdateContinueWatching);
      window.addEventListener('sineflix_data_changed', liveUpdateContinueWatching);
    }
  };
}

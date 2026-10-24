import { renderIcons } from '../services/kabuk/icons.js';
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
  fetchAdultAnimationSeries, fetchCartoonSeries, fetchRecommendations, fetchUpcoming
} from '../services/icerik/tmdbApi.js';
import { getUnifiedContinueWatching, removeSeriesFromHistory, isKidProfileActive, filterForActiveProfile, isItemKidSafe, getFavorites } from '../services/altyapi/storage.js';
import { renderHeroSlider, attachHeroSliderEvents, stopHeroSlider } from '../components/HeroSlider.js';
import { renderMediaCard, attachMediaCardEvents } from '../components/MediaCard.js';
import { showToast } from '../components/Toast.js';
import { collectWithin } from '../services/kabuk/startupBudget.js';
import { railScrollMemory } from '../services/kabuk/scrollManager.js';
import { tohumSec, onbellekAnahtari, cacheOku, cacheYaz, satirBasligi, KISISSEL_SATIR_TIPI } from '../services/icerik/personalRails.js';
import { zamanRail } from '../services/kesif/zamanRail.js';
import { isP2pAvailable } from '../services/dogrudan/p2pService.js';

// Cache home TMDB data & rail state across navigations
let homeDataCache = null;
let homeSecondaryPending = null;
let homeCacheGeneration = 0;
const railExtraItemsCache = new Map();
const activeRailObservers = new Set();
const railInitialQueues = new Map();
const HOME_CACHE_TTL_MS = 10 * 60 * 1000;
/* Disk önbelleği (localStorage): uygulama kapanıp açılsa da ana sayfa ANINDA
   içerikle gelir. ÖLÇÜM (2026-10-18): yavaş ağda ilk açılış boş kalıyordu
   (sessionStorage her açılışta sıfırlanıyor). 6 saat taze sayılır; arka planda
   yine tazelenir (stale-while-revalidate). */
const HOME_DISK_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function cleanupHomeView() {
  stopHeroSlider();
  for (const observer of activeRailObservers) observer.disconnect();
  activeRailObservers.clear();
}

function getPersistentHomeCache(isKid) {
  try {
    const raw = localStorage.getItem(`cinepulse_home_fast_v7_${isKid ? 'kids' : 'adult'}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > HOME_DISK_TTL_MS) return null;
    return parsed.data?.isKid === isKid ? parsed.data : null;
  } catch (_) {
    return null;
  }
}

function hasPrimaryContent(data) {
  return Boolean(data && ((data.trending || []).length > 0 || (data.popularTV || []).length > 0 || (data.popularMovies || []).length > 0));
}

function persistHomeCache(data) {
  // Bos birincil veriyi onbellege yazma (hero/populer railler kaybolur ve 10 dk duzelmez).
  if (!hasPrimaryContent(data)) return;
  try {
    localStorage.setItem(`cinepulse_home_fast_v7_${data.isKid ? 'kids' : 'adult'}`, JSON.stringify({
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
    localStorage.removeItem('cinepulse_home_fast_v7_kids');
    localStorage.removeItem('cinepulse_home_fast_v7_adult');
  } catch (_) {}
  railExtraItemsCache.clear();
  railInitialQueues.clear();
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
/* İlk boyamada satır başına gösterilen kart sayısı. KANIT (cihaz, apk48):
   8 kart ile satırlar "çok az card" görünüyordu (kullanıcı 2026-10-17). TMDB
   ilk sayfa zaten 20 kayıt döndürüyor; hepsini göster, kaydırmada sonraki
   sayfa gelsin. */
const RAIL_ILK_ADET = 20;

function renderInfiniteRail({ id, icon, title, accent, items }) {
  if (!items || items.length === 0) return '';
  const extraItems = railExtraItemsCache.get(id) || [];
  const primaryItems = items.slice(0, RAIL_ILK_ADET);
  const allRailItems = [...primaryItems, ...extraItems];
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
  const displayItems = watchHistory.slice(0, 12);
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

        // Fill the rest of the API's first page before requesting page 2.
        const initialQueue = railInitialQueues.get(railId) || [];
        if (initialQueue.length > 0) {
          newItems = initialQueue.splice(0, 8);
          railInitialQueues.set(railId, initialQueue);
        }

        for (let attempt = 0; initialQueue.length === 0 && attempt < 4 && newItems.length === 0; attempt += 1) {
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


    // 2. IntersectionObserver with root = rail
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const state = railState[railId];
        const hasQueuedItems = (railInitialQueues.get(railId)?.length || 0) > 0;
        if (entry.isIntersecting && (hasQueuedItems || (state && !state.exhausted))) loadMore();
      });
    }, { root: rail, rootMargin: '0px 100px 0px 0px', threshold: 0 });
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

  // "Yakında" verisi: 6 saatlik personalRails önbellek deseniyle (localStorage),
  // ağ hatasında rail sessizce çözülür (kullanıcıya hata gösterilmez).
  // Trending ile eşzamanlı çalışmak için burada (await'suz) başlatılır;
  // HTML oluşturulmadan önce await edilir.
  const yakindaYukle = (async () => {
    try {
      const anahtar = `cinepulse_zaman_yakinda_${isKid ? 'kids' : 'adult'}`;
      const depo = typeof localStorage !== 'undefined' ? localStorage : null;
      let gelen = cacheOku(depo, anahtar);
      if (!gelen) {
        gelen = await fetchUpcoming(1);
        if (gelen && gelen.length) cacheYaz(depo, anahtar, gelen);
      }
      return gelen || [];
    } catch (_) {
      return [];
    }
  })();

  let trending, popularTV, popularMovies, topRatedTV, topRatedMovies, animeItems, docItems, kidsAdventures, adultAnimationItems, cartoonSeriesItems, kidsAnimationItems, kidsClassicCartoonItems;

  if (!homeDataCache) homeDataCache = getPersistentHomeCache(isKid);
  // Zehirlenmis (bos birincil verili) onbellegi kullanma, yeniden cek.
  if (homeDataCache && !hasPrimaryContent(homeDataCache)) {
    homeDataCache = null;
    try {
      sessionStorage.removeItem(`cinepulse_home_fast_v7_${isKid ? 'kids' : 'adult'}`);
    } catch (_) {}
  }

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
    [popularTV, popularMovies] = await collectWithin([
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
    [trending, popularTV, popularMovies] = await collectWithin([
      fetchTrending('all', 'week', 1),
      fetchPopularSeries(1), fetchPopularMovies(1)
    ]);
    if (cacheGeneration !== homeCacheGeneration) return null;
    if (!secondarySettled) homeDataCache = { isKid: false, trending, popularTV, popularMovies };
  }
  primarySettled = true;
  if (secondarySettled && homeDataCache) persistHomeCache(homeDataCache);
  const secondaryInInitialHTML = secondarySettled;

  const yakindaHam = await yakindaYukle;
  const simdi = Date.now();

  // "Bugün & Bu Hafta": trending (film+dizi karışımı) içinden bugün/bu hafta
  // yayında olanlar; boşsa rail çizilmez. Çocuk profilinde kidSafe süzülür.
  const gunlukHavuz = [...(trending || []), ...(popularMovies || []), ...(popularTV || [])];
  const gunluk = zamanRail(isKid ? gunlukHavuz.filter(i => i && isItemKidSafe(i)) : gunlukHavuz, simdi);
  const gunlukOge = [...gunluk.bugun, ...gunluk.buHafta];

  // "Yakında": TMDB upcoming/on_the_air içinden gelecek tarihli olanlar;
  // çocuk profilinde kidSafe süzülür, boşsa rail çizilmez.
  const yakindaOge = zamanRail(isKid ? (yakindaHam || []).filter(i => i && isItemKidSafe(i)) : (yakindaHam || []), simdi).yakinda;

  const rawWatchHistory = getUnifiedContinueWatching();
  const watchHistory = filterForActiveProfile(rawWatchHistory);
  
  // Kids mode: use kids-specific content for hero (strictly filtered for safe kids items)
  let heroItems;
  if (isKid) {
    const kidsHeroPool = [...(popularMovies || []), ...(popularTV || [])].filter(i => i.backdrop_path && isItemKidSafe(i));
    heroItems = kidsHeroPool.slice(0, 10);
  } else {
    const trendingPool = Array.isArray(trending) ? trending : [];
    const fallbackPool = [...(popularMovies || []), ...(popularTV || [])].filter(i => i && i.backdrop_path);
    heroItems = (trendingPool.length > 0 ? trendingPool : fallbackPool).slice(0, 10);
  }

  // Keep first paint light, then append the remaining page-one results only
  // as each rail approaches the viewport.
  const baseRailItems = isKid ? {
    'rail-kids-movies': popularMovies,
    'rail-kids-animation': kidsAnimationItems,
    'rail-kids-classics': kidsClassicCartoonItems,
    'rail-kids-adventures': kidsAdventures,
    'rail-anime': animeItems
  } : {
    'rail-popular-tv': popularTV,
    'rail-adult-animation': adultAnimationItems,
    'rail-cartoon-series': cartoonSeriesItems,
    'rail-popular-movies': popularMovies,
    'rail-top-movies': topRatedMovies,
    'rail-top-tv': topRatedTV,
    'rail-anime': animeItems,
    'rail-documentary': docItems
  };
  for (const [id, items] of Object.entries(baseRailItems)) {
    const rest = (items || []).slice(RAIL_ILK_ADET);
    if (rest.length) railInitialQueues.set(id, rest);
    else railInitialQueues.delete(id);
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
      ${gunlukOge.length > 0 ? renderInfiniteRail({
        id:    'rail-bugun-buhafta',
        icon:  'clock',
        title: 'Bugün & Bu Hafta',
        accent:'#22d3ee',
        items: gunlukOge
      }) : ''}

      ${yakindaOge.length > 0 ? renderInfiniteRail({
        id:    'rail-yakinda',
        icon:  'calendar',
        title: 'Yakında',
        accent:'#f472b6',
        items: yakindaOge
      }) : ''}

      ${renderInfiniteRail({
        id:    'rail-kids-movies',
        icon:  'sparkles',
        title: 'Animasyon ve Çocuk Filmleri',
        accent:'#ec4899',
        items: popularMovies
      })}

      ${kidsAnimationItems && kidsAnimationItems.length > 0 ? renderInfiniteRail({
        id:    'rail-kids-animation',
        icon:  'sparkles',
        title: 'Çocuk Animasyonları',
        accent:'#fb7185',
        items: kidsAnimationItems
      }) : ''}

      ${kidsClassicCartoonItems && kidsClassicCartoonItems.length > 0 ? renderInfiniteRail({
        id:    'rail-kids-classics',
        icon:  'palette',
        title: 'Klasik Çizgi Diziler',
        accent:'#38bdf8',
        items: kidsClassicCartoonItems
      }) : ''}

      ${kidsAdventures && kidsAdventures.length > 0 ? renderInfiniteRail({
        id:    'rail-kids-adventures',
        icon:  'compass',
        title: 'Aile ve Fantastik Filmler',
        accent:'#38bdf8',
        items: kidsAdventures
      }) : ''}

      ${animeItems && animeItems.length > 0 ? renderInfiniteRail({
        id:    'rail-anime',
        icon:  'smile',
        title: 'Çocuk ve Genç Animeleri',
        accent:'#a855f7',
        items: animeItems
      }) : ''}
    `;
  } else {
    railsHTML = `
      ${gunlukOge.length > 0 ? renderInfiniteRail({
        id:    'rail-bugun-buhafta',
        icon:  'clock',
        title: 'Bugün & Bu Hafta',
        accent:'#22d3ee',
        items: gunlukOge
      }) : ''}

      ${yakindaOge.length > 0 ? renderInfiniteRail({
        id:    'rail-yakinda',
        icon:  'calendar',
        title: 'Yakında',
        accent:'#f472b6',
        items: yakindaOge
      }) : ''}

      ${renderInfiniteRail({
        id:    'rail-popular-tv',
        icon:  'tv-2',
        title: 'Popüler Diziler',
        accent:'#14b8a6',
        items: popularTV
      })}

      ${adultAnimationItems && adultAnimationItems.length > 0 ? renderInfiniteRail({
        id:    'rail-adult-animation',
        icon:  'sparkles',
        title: 'Yetişkin Animasyon',
        accent:'#fb7185',
        items: adultAnimationItems
      }) : ''}

      ${cartoonSeriesItems && cartoonSeriesItems.length > 0 ? renderInfiniteRail({
        id:    'rail-cartoon-series',
        icon:  'wand-2',
        title: 'Klasik Çizgi Diziler',
        accent:'#38bdf8',
        items: cartoonSeriesItems
      }) : ''}

      ${renderInfiniteRail({
        id:    'rail-popular-movies',
        icon:  'clapperboard',
        title: 'Popüler Filmler',
        accent:'#a78bfa',
        items: popularMovies
      })}

      ${renderInfiniteRail({
        id:    'rail-top-movies',
        icon:  'award',
        title: 'En Yüksek Puanlı Filmler',
        accent:'#dfff76',
        items: topRatedMovies
      })}

      ${renderInfiniteRail({
        id:    'rail-top-tv',
        icon:  'star',
        title: 'En Yüksek Puanlı Diziler',
        accent:'#34d399',
        items: topRatedTV
      })}

      ${animeItems && animeItems.length > 0 ? renderInfiniteRail({
        id:    'rail-anime',
        icon:  'sparkles',
        title: 'Popüler Anime',
        accent:'#ec4899',
        items: animeItems
      }) : ''}

      ${docItems && docItems.length > 0 ? renderInfiniteRail({
        id:    'rail-documentary',
        icon:  'globe',
        title: 'Popüler Belgeseller',
        accent:'#38bdf8',
        items: docItems
      }) : ''}
    `;
  }

  const viewHTML = `
    <div class="home-view ${isKid ? 'is-kids-mode' : ''}">
      ${!hasPrimaryContent({ trending, popularTV, popularMovies }) ? '<div class="container" role="status" style="padding:5rem 1rem 2rem"><p>İçerik servisine ulaşılamadı. Bağlantını kontrol edip yeniden deneyebilirsin.</p><button class="btn btn-primary" id="btn-home-retry">Yeniden Dene</button></div>' : ''}
      ${heroHTML || '<div class="home-hero-spacer" style="height:84px;flex:none;"></div>'}

      ${isP2pAvailable() ? `<div class="container p2p-launch-row">
        <button id="btn-p2p-launch" class="p2p-launch-btn" type="button">🛰 P2P ile Oynat</button>
        <span class="p2p-launch-hint">magnet adresiyle reklamsız yerel oynatma — yalnızca masaüstü</span>
      </div>` : ''}

      ${renderContinueWatchingSection(watchHistory)}

      ${railsHTML}
    </div>
  `;

  return {
    html: viewHTML,
    init: (container) => {
      container.querySelector('#btn-home-retry')?.addEventListener('click', () => {
        clearHomeCache();
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      });
      container.querySelector('#btn-p2p-launch')?.addEventListener('click', async () => {
        const { openP2pModal } = await import('../components/P2pModal.js');
        openP2pModal();
      });
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
            // Let the browser handle wheel momentum directly. Repeated smooth
            // scrollBy animations stack up and stutter on low-power devices.
            e.preventDefault();
            rail.scrollLeft += e.deltaY;
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
            ${renderInfiniteRail({ id: 'rail-kids-animation', icon: 'sparkles', title: 'Çocuk Animasyonları', accent: '#fb7185', items: kidsAnimationItems })}
            ${renderInfiniteRail({ id: 'rail-kids-classics', icon: 'palette', title: 'Klasik Çizgi Diziler', accent: '#38bdf8', items: kidsClassicCartoonItems })}
            ${renderInfiniteRail({ id: 'rail-kids-adventures', icon: 'compass', title: 'Aile ve Fantastik Filmler', accent: '#38bdf8', items: kidsAdventures })}
            ${renderInfiniteRail({ id: 'rail-anime', icon: 'smile', title: 'Çocuk ve Genç Animeleri', accent: '#a855f7', items: animeItems })}
          ` : `
            ${renderInfiniteRail({ id: 'rail-adult-animation', icon: 'sparkles', title: 'Yetişkin Animasyon', accent: '#fb7185', items: adultAnimationItems })}
            ${renderInfiniteRail({ id: 'rail-cartoon-series', icon: 'wand-2', title: 'Klasik Çizgi Diziler', accent: '#38bdf8', items: cartoonSeriesItems })}
            ${renderInfiniteRail({ id: 'rail-top-movies', icon: 'award', title: 'En Yüksek Puanlı Filmler', accent: '#dfff76', items: topRatedMovies })}
            ${renderInfiniteRail({ id: 'rail-top-tv', icon: 'star', title: 'En Yüksek Puanlı Diziler', accent: '#34d399', items: topRatedTV })}
            ${renderInfiniteRail({ id: 'rail-anime', icon: 'sparkles', title: 'Popüler Anime', accent: '#ec4899', items: animeItems })}
            ${renderInfiniteRail({ id: 'rail-documentary', icon: 'globe', title: 'Popüler Belgeseller', accent: '#38bdf8', items: docItems })}
          `;
          homeView.append(extra);
          renderIcons(extra);
          attachMediaCardEvents(extra);
          attachRailScrolling(extra);
          initInfiniteRails(extra);
        });
      }

      // Kişisel satır: "Çünkü {ad} izledin" (Netflix Öneri #1 — personalRails.js SAF çekirdeği).
      // Tohum = en son izlenen 1 yapıt; öneriler 6 saatlik localStorage önbellekten gelir,
      // yoksa tek TMDB recommendations isteğiyle çekilir. Ana Sayfa'yı asla kırmaz.
      (async () => {
        try {
          const tohumlar = tohumSec(watchHistory, getFavorites(), { maks: 2 });
          if (tohumlar.length === 0) return;
          const tohum = tohumlar[0];
          const anahtar = onbellekAnahtari(KISISSEL_SATIR_TIPI, tohum);
          const depo = typeof localStorage !== 'undefined' ? localStorage : null;
          let ogeler = cacheOku(depo, anahtar);
          if (!ogeler) {
            ogeler = await fetchRecommendations(tohum.tur, tohum.tmdbId);
            if (ogeler && ogeler.length > 0) cacheYaz(depo, anahtar, ogeler);
          }
          if (!ogeler || ogeler.length === 0) return;
          if (!container.isConnected || !(window.location.hash || '#home').startsWith('#home')) return;
          const temiz = filterForActiveProfile(ogeler).slice(0, 18);
          if (temiz.length < 4) return;
          const holder = document.createElement('div');
          holder.innerHTML = renderInfiniteRail({
            id: 'rail-personal-cunku',
            icon: 'sparkles',
            title: satirBasligi(tohum.ad),
            accent: '#f472b6',
            items: temiz
          });
          const anchor = container.querySelector('#continue-watching-rail')?.closest('.rail-section');
          if (anchor) anchor.after(holder);
          else container.querySelector('.home-view')?.prepend(holder);
          renderIcons(holder);
          attachMediaCardEvents(holder);
          attachRailScrolling(holder);
        } catch (_) { /* kişisel satır opsiyoneldir */ }
      })();

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

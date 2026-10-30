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
  fetchAdultAnimationSeries, fetchCartoonSeries
} from '../services/icerik/tmdbApi.js';
import { getUnifiedContinueWatching, getGroupedWatchHistory, removeSeriesFromHistory, isKidProfileActive, filterForActiveProfile, isItemKidSafe, getFavorites, getWatchlist, getCompletedWatchList } from '../services/altyapi/storage.js';
import { renderHeroSlider, attachHeroSliderEvents, stopHeroSlider } from '../components/HeroSlider.js';
import { renderMediaCard, attachMediaCardEvents } from '../components/MediaCard.js';
import { showToast } from '../components/Toast.js';
import { collectWithin } from '../services/kabuk/startupBudget.js';
import { railScrollMemory } from '../services/kabuk/scrollManager.js';
import { isP2pAvailable } from '../services/dogrudan/p2pService.js';
import { modeliHazirla2, gosterimKaydet, tiklamaKaydet } from '../services/kisisel/kisiselMotor.js';
import { profilKur, profilSirala, ozetMetni } from '../services/kisisel/zevkProfili.js';
import { fetchPersonalizedRows } from '../services/kisisel/recommendationEngine.js';
import '../styles/home-polish.css';

// Cache home TMDB data & rail state across navigations
let homeDataCache = null;
let homeSecondaryPending = null;
let homeCacheGeneration = 0;
const railExtraItemsCache = new Map();
const activeRailObservers = new Set();
const railInitialQueues = new Map();
/* G2: rail'ler ilk görünürde kart kart stagger ile belirir (cp-fade-up).
   Sayfa düzeyinde router animasyonuna dokununmadan, tek gözlemci yeter. */
let railAnimObserver = null;
const HOME_CACHE_TTL_MS = 10 * 60 * 1000;
/* Disk önbelleği (localStorage): uygulama kapanıp açılsa da ana sayfa ANINDA
   içerikle gelir; öneri ve katalog havuzu en geç 10 dakikada yenilenir. */
const HOME_DISK_TTL_MS = HOME_CACHE_TTL_MS;
let homeDataCacheSavedAt = 0;

export function cleanupHomeView() {
  stopHeroSlider();
  for (const observer of activeRailObservers) observer.disconnect();
  activeRailObservers.clear();
  if (railAnimObserver) {
    railAnimObserver.disconnect();
    railAnimObserver = null;
  }
}

function getPersistentHomeCache(isKid) {
  try {
    const raw = localStorage.getItem(`cinepulse_home_fast_v7_${isKid ? 'kids' : 'adult'}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > HOME_DISK_TTL_MS) return null;
    homeDataCacheSavedAt = parsed.savedAt;
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
    const savedAt = Date.now();
    localStorage.setItem(`cinepulse_home_fast_v7_${data.isKid ? 'kids' : 'adult'}`, JSON.stringify({
      savedAt,
      data
    }));
    homeDataCacheSavedAt = savedAt;
  } catch (_) {}
}

export function clearHomeCache() {
  homeDataCache = null;
  homeDataCacheSavedAt = 0;
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

/* G2: Bir kapsayıcıdaki rail bölümlerini ilk-görünür stagger animasyonuna
   bağlar (idempotent — [data-rail-anim] işaretli bölüm yeniden işlenmez).
   Görünür olunca `rail-gorunur` eklenir; CSS cp-fade-up'ı --cp-i gecikmesiyle
   kartlara uygular. reduced-motion'da CSS gizleme kuralını hiç koymaz. */
function railAnimasyonuBagla(kok) {
  if (!kok || !('IntersectionObserver' in window)) return;
  if (!railAnimObserver) {
    railAnimObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        railAnimObserver.unobserve(entry.target);
        entry.target.classList.add('rail-gorunur');
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -6% 0px' });
  }
  kok.querySelectorAll('.rail-section:not([data-rail-anim])').forEach(bolum => {
    bolum.setAttribute('data-rail-anim', '1');
    bolum.querySelectorAll('.card-rail > *').forEach((kart, i) => {
      kart.style.setProperty('--cp-i', String(Math.min(i, 12)));
    });
    railAnimObserver.observe(bolum);
  });
}

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
   "Benim kanalım · şimdi" şeridi
   Kanal programı cihaz içi sinyallerden (geçmiş/favori/liste) SENKRON kurulur:
   ağ yok, ilk boyamayı geciktirmez. Program boşsa şerit hiç çizilmez.
-------------------------------------------------------------------------- */
/** Metni HTML'e kaçırır (HomeView yerel yardımcısı). */
function kanalEsc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* --------------------------------------------------------------------------
   Main render
-------------------------------------------------------------------------- */
export async function renderHomeView() {
  const isKid = isKidProfileActive();
  if (homeDataCache && Date.now() - homeDataCacheSavedAt > HOME_CACHE_TTL_MS) {
    homeDataCache = null;
    homeDataCacheSavedAt = 0;
    homeSecondaryPending = null;
    homeCacheGeneration++;
  }
  const cacheGeneration = homeCacheGeneration;

  let trending, popularTV, popularMovies, topRatedTV, topRatedMovies, animeItems, docItems, kidsAdventures, adultAnimationItems, cartoonSeriesItems, kidsAnimationItems, kidsClassicCartoonItems;

  if (!homeDataCache) homeDataCache = getPersistentHomeCache(isKid);
  // Zehirlenmis (bos birincil verili) onbellegi kullanma, yeniden cek.
  if (homeDataCache && !hasPrimaryContent(homeDataCache)) {
    homeDataCache = null;
    homeDataCacheSavedAt = 0;
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
      homeDataCacheSavedAt = Date.now();
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
    if (!secondarySettled) {
      homeDataCache = { isKid: true, trending, popularTV, popularMovies };
      homeDataCacheSavedAt = Date.now();
    }
  } else {
    secondaryReady = Promise.all([
      fetchTopRated('tv', 1), fetchTopRated('movie', 1),
      fetchPopularAnime(1), fetchPopularDocumentaries(1),
      fetchAdultAnimationSeries(1), fetchCartoonSeries(1)
    ]).then(results => {
      if (cacheGeneration !== homeCacheGeneration) return;
      [topRatedTV, topRatedMovies, animeItems, docItems, adultAnimationItems, cartoonSeriesItems] = results;
      homeDataCache = { isKid: false, trending, popularTV, popularMovies, topRatedTV, topRatedMovies, animeItems, docItems, adultAnimationItems, cartoonSeriesItems };
      homeDataCacheSavedAt = Date.now();
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
    if (!secondarySettled) {
      homeDataCache = { isKid: false, trending, popularTV, popularMovies };
      homeDataCacheSavedAt = Date.now();
    }
  }
  primarySettled = true;
  if (secondarySettled && homeDataCache) persistHomeCache(homeDataCache);
  const secondaryInInitialHTML = secondarySettled;

  const rawWatchHistory = getUnifiedContinueWatching();
  const watchHistory = filterForActiveProfile(rawWatchHistory);
  // TAM geçmiş (tamamlananlar dâhil, yapıt başına tek kayıt): yedekten/önbellekten
  // dönen "bitti" işaretleri Ana Sayfa'yı BESLER (kullanıcı isteği 2026-10-30).
  // "İzlemeye devam et" rail'i bilerek bundan DEĞİL, devam listesinden çizilir.
  const gecmisGrupTam = filterForActiveProfile(getGroupedWatchHistory() || []);
  const evrenselFavoriler = filterForActiveProfile(getFavorites() || []);
  const evrenselListe = filterForActiveProfile(getWatchlist() || []);

  /* ── ZEVK PROFİLİ ─────────────────────────────────────────────────────
     Kullanıcının BİLEREK verdiği sinyaller (favoriler, izleme listesi,
     bitirdikleri + önbellek/yedekten geri gelen "bitti" işaretleri) tek bir
     tür ağırlığına indirgenir ve Ana Sayfa'nın TAMAMINI etkiler:
       · hero seçimi, · her satırın iç sıralaması, · kendi verisinden 3 satır.
     Profil boşsa hiçbir sıralama değişmez (sahte kişiselleştirme yok).      */
  const zamanliFavoriler = evrenselFavoriler
    .map((f) => ({ ...f, lastWatchedAt: Number(f.lastWatchedAt) || Number(f.addedAt) || 0 }));
  const tamamlananlar = filterForActiveProfile(getCompletedWatchList() || []);
  const zevk = isKid
    ? profilKur({ favoriler: [], watchlist: [], tamamlanan: [], gecmis: [] })
    : profilKur({
      favoriler: zamanliFavoriler,
      watchlist: evrenselListe,
      tamamlanan: tamamlananlar,
      gecmis: gecmisGrupTam
    });
  const zevkOzet = isKid ? '' : ozetMetni(zevk);

  // Kids mode: use kids-specific content for hero (strictly filtered for safe kids items)
  let heroItems;
  if (isKid) {
    const kidsHeroPool = [...(popularMovies || []), ...(popularTV || [])].filter(i => i.backdrop_path && isItemKidSafe(i));
    heroItems = kidsHeroPool.slice(0, 10);
  } else {
    const trendingPool = Array.isArray(trending) ? trending : [];
    const fallbackPool = [...(popularMovies || []), ...(popularTV || [])].filter(i => i && i.backdrop_path);
    // Hero de zevk profiline göre: en sevdiğin türler öne çıkar (profil boşsa sıra aynı).
    const heroHavuz = (trendingPool.length > 0 ? trendingPool : fallbackPool).filter(i => i && i.backdrop_path);
    const siraliHero = zevk.bos ? heroHavuz : profilSirala(heroHavuz, zevk, { esik: 0.2 });
    heroItems = (siraliHero.length > 0 ? siraliHero : fallbackPool).slice(0, 10);
  }

  /* Her satırın içi de zevk profiline göre sıralanır: "Popüler Diziler" bile
     senin en çok sevdiğin türleri önce gösterir. Profil boşsa sıra korunur.
     (Satırlar bu değişkenlerden çizildiği için sıralama burada uygulanır.) */
  if (!isKid && !zevk.bos) {
    const sirala = (liste) => (Array.isArray(liste) && liste.length > 4
      ? profilSirala(liste, zevk, { esik: 0.15 })
      : liste);
    popularTV = sirala(popularTV);
    popularMovies = sirala(popularMovies);
    topRatedTV = sirala(topRatedTV);
    topRatedMovies = sirala(topRatedMovies);
    animeItems = sirala(animeItems);
    docItems = sirala(docItems);
    adultAnimationItems = sirala(adultAnimationItems);
    cartoonSeriesItems = sirala(cartoonSeriesItems);
  }

  /* Her satırın içi de zevk profiline göre sıralanır: "Popüler Diziler" bile
     senin en çok sevdiğin türleri önce gösterir. Profil boşsa sıra korunur.
     (Satırlar bu değişkenlerden çizildiği için sıralama burada uygulanır.) */
  if (!isKid && !zevk.bos) {
    const sirala = (liste) => (Array.isArray(liste) && liste.length > 4
      ? profilSirala(liste, zevk, { esik: 0.15 })
      : liste);
    popularTV = sirala(popularTV);
    popularMovies = sirala(popularMovies);
    topRatedTV = sirala(topRatedTV);
    topRatedMovies = sirala(topRatedMovies);
    animeItems = sirala(animeItems);
    docItems = sirala(docItems);
    adultAnimationItems = sirala(adultAnimationItems);
    cartoonSeriesItems = sirala(cartoonSeriesItems);
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
      ${heroHTML || '<div class="home-hero-spacer" style="height:84px;flex:none;"></div>'}
      ${!hasPrimaryContent({ trending, popularTV, popularMovies }) ? '<div class="container" role="status" style="padding:5rem 1rem 2rem"><p>İçerik servisine ulaşılamadı. Bağlantını kontrol edip yeniden deneyebilirsin.</p><button class="btn btn-primary" id="btn-home-retry">Yeniden Dene</button></div>' : ''}

      ${isP2pAvailable() ? `<div class="container p2p-launch-row">
        <button id="btn-p2p-launch" class="p2p-launch-btn" type="button">🛰 P2P ile Oynat</button>
        <span class="p2p-launch-hint">magnet adresiyle reklamsız yerel oynatma — yalnızca masaüstü</span>
      </div>` : ''}

      ${renderContinueWatchingSection(watchHistory)}

      ${zevkOzet ? `<div class="container zevk-serit" role="note" aria-label="Zevk profilin">
        <span class="zevk-serit-etiket"><i data-lucide="fingerprint" style="width:14px;height:14px;"></i> Zevk profilin</span>
        <span class="zevk-serit-ozet">${kanalEsc(zevkOzet)}</span>
        <span class="zevk-serit-turler">
          ${zevk.turSira.slice(0, 4).map((t) => `<em style="--zevk:${Math.round(40 + t.agirlik * 60)}%">${kanalEsc(t.ad)}</em>`).join('')}
        </span>
      </div>` : ''}

      <div id="ml-rail-slot"></div>

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
      railAnimasyonuBagla(root);
      root.querySelectorAll('.card-rail').forEach(rail => {
        const railId = rail.id;

        // Kenar maskesi yalnız raf taşıyorsa (sığan raf soluklaşmasın).
        if (rail.scrollWidth > rail.clientWidth + 4) rail.classList.add('rail-edge-mask');

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

      /* ── Kişisel öneriler: çoklu tohum + görülmemiş aday üretimi ──────── */
      (async () => {
        try {
          const slot = container.querySelector('#ml-rail-slot');
          if (!slot) return;
          const tabanHavuz = [
            ...(trending || []), ...(popularTV || []), ...(popularMovies || []),
            ...(topRatedTV || []), ...(topRatedMovies || []), ...(animeItems || []),
            ...(docItems || []), ...(isKid ? [...(kidsAdventures || []), ...(kidsAnimationItems || [])] : [])
          ].filter((x) => x && x.id != null && (!isKid || isItemKidSafe(x)));
          const model = await modeliHazirla2({ ekKayitlar: tabanHavuz });
          if (!container.isConnected || !(window.location.hash || '#home').startsWith('#home')) return;
          const rows = await fetchPersonalizedRows({
            gecmis: gecmisGrupTam,
            tamamlanan: tamamlananlar,
            favoriler: evrenselFavoriler,
            watchlist: evrenselListe,
            model,
            fallbackAdaylar: tabanHavuz,
            adet: 40,
            isKid,
            guvenliMi: isItemKidSafe
          });
          if (!container.isConnected || !(window.location.hash || '#home').startsWith('#home')) return;
          const rail = (id, icon, title, accent, items) => {
            if (!Array.isArray(items) || items.length < 10) return '';
            const shown = items.slice(0, 40);
            return `
              <section class="rail-section reco-row" id="${id}">
                <div class="container">
                  <div class="rail-header">
                    <h2 class="rail-title">
                      <span class="rail-icon-pill" style="--rail-color:${accent}">
                        <i data-lucide="${icon}" aria-hidden="true"></i>
                      </span>
                      ${title}
                    </h2>
                    <span class="reco-row-count">${shown.length} yeni başlık</span>
                  </div>
                  <div class="card-rail" id="${id}-cards">
                    ${shown.map((oge) => renderMediaCard(oge)).join('')}
                  </div>
                </div>
              </section>
            `;
          };
          slot.innerHTML = [
            rail('rail-ml-films', 'clapperboard', 'Sana özel filmler', '#dfff76', rows.sanaOzelFilmler),
            rail('rail-ml-series', 'tv-2', 'Sana özel diziler', '#34d399', rows.sanaOzelDiziler),
            gecmisGrupTam.length
              ? rail('rail-reco-tamamladiklarindan', 'check-check', 'Bitirdiklerinden sonra', '#a78bfa', rows.tamamladiklarindanSonra)
              : '',
            evrenselFavoriler.length
              ? rail('rail-reco-favoriler', 'heart', 'Favorilerine yakın', '#f472b6', rows.favorilerineGore)
              : ''
          ].join('');
          if (!slot.innerHTML) {
            slot.innerHTML = '<div class="container" role="status"><p>Şu an zevkine uygun yeni yapım bulamadık. Biraz daha içerik izledikçe öneriler gelişir.</p></div>';
            return;
          }
          renderIcons(slot);
          attachMediaCardEvents(slot);
          attachRailScrolling(slot);
          slot.querySelectorAll('.rail-section[id]').forEach((section) => {
            const source = section.id === 'rail-reco-tamamladiklarindan'
              ? 'tamamlanan'
              : section.id === 'rail-reco-favoriler' ? 'favoriler' : 'ana';
            const cards = [...section.querySelectorAll('.media-card[data-id]')];
            const record = (card) => gosterimKaydet([{
              id: card.getAttribute('data-id'),
              type: card.getAttribute('data-type') || card.getAttribute('data-mediatype') || ''
            }], source);
            if (typeof IntersectionObserver !== 'function') {
              cards.slice(0, 5).forEach(record);
              return;
            }
            const timers = new Map();
            const observer = new IntersectionObserver((entries) => {
              for (const entry of entries) {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                  if (timers.has(entry.target)) continue;
                  timers.set(entry.target, setTimeout(() => {
                    if (entry.target.isConnected) record(entry.target);
                    timers.delete(entry.target);
                    observer.unobserve(entry.target);
                  }, 900));
                } else {
                  const timer = timers.get(entry.target);
                  if (timer) clearTimeout(timer);
                  timers.delete(entry.target);
                }
              }
            }, { threshold: 0.5 });
            cards.forEach((card) => observer.observe(card));
            const disconnect = observer.disconnect.bind(observer);
            observer.disconnect = () => {
              timers.forEach(clearTimeout);
              timers.clear();
              disconnect();
            };
            activeRailObservers.add(observer);
          });
        } catch (error) {
          console.error('[Ana sayfa önerileri] Öneriler yüklenemedi.', error);
          const slot = container.querySelector('#ml-rail-slot');
          if (slot) slot.innerHTML = '<div class="container" role="status"><p>Öneriler şu anda yüklenemedi. Ana sayfadaki diğer içerikler kullanılabilir.</p></div>';
        }
      })();

      // Kart açma = pozitif sınıf: sıralayıcı hangi kartın ilgi çektiğini öğrenir.
      container.addEventListener('click', (e) => {
        const kart = e.target && typeof e.target.closest === 'function'
          ? e.target.closest('#ml-rail-slot .media-card[data-id]')
          : null;
        if (!kart) return;
        const source = kart.closest('#rail-reco-tamamladiklarindan')
          ? 'tamamlanan'
          : kart.closest('#rail-reco-favoriler') ? 'favoriler' : 'ana';
        tiklamaKaydet({
          id: kart.getAttribute('data-id'),
          type: kart.getAttribute('data-type') || kart.getAttribute('data-mediatype') || ''
        }, source);
      }, { capture: true });
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

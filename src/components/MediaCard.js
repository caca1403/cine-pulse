import { renderIcons } from '../services/icons.js';
/* ==========================================================================
   CinePulse Studio - Media Card Component
   Ultra-sleek, borderless luxury cards with floating gold star rating badge,
   clean typography, smart type detection, and smooth responsive hover animations.
   ========================================================================== */

import { getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_POSTER_FALLBACK, hasNonLatinCharacters } from '../services/tmdbApi.js';
import { getMediaProgress, getLastWatchedEpisode, formatSecondsToTime, formatRemainingTime, isRegisteredAnimeId, registerAnimeId, getUserSettings, KNOWN_ANIME_KEYWORDS as STORAGE_ANIME_KEYWORDS } from '../services/storage.js';
import { openPlayerModal } from './openPlayer.js';
import { showToast } from './Toast.js';
import { saveAllScrollState } from '../services/scrollManager.js';
import { getBestBackdrop } from '../services/fanartService.js';

const KNOWN_ANIME_KEYWORDS = STORAGE_ANIME_KEYWORDS || [
  'anime', 'kimetsu', 'yaiba', 'iblis keser', 'demon slayer', 'naruto', 'boruto', 'shingeki', 'titan'
];

function hasJapaneseCharacters(text) {
  if (!text) return false;
  return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(text);
}

export function isAnimeItem(item) {
  if (!item) return false;
  if (item.isAnime === true || item.type === 'anime' || item.media_type === 'anime') return true;
  if (item.id && isRegisteredAnimeId(item.id)) return true;

  const genreIds = item.genre_ids || (Array.isArray(item.genres) ? item.genres.map(g => (typeof g === 'object' ? g.id : g)) : []);
  const hasAnimationGenre = genreIds.some(id => Number(id) === 16);
  const isJapanese = item.original_language === 'ja' || (Array.isArray(item.origin_country) && item.origin_country.includes('JP'));

  // 1. Animation genre + Japanese origin or language
  if (hasAnimationGenre && isJapanese) {
    if (item.id) registerAnimeId(item.id);
    return true;
  }
  if (hasAnimationGenre && (item.origin_country?.includes('JP') || item.original_language === 'ja')) {
    if (item.id) registerAnimeId(item.id);
    return true;
  }

  // 2. Japanese original language with animation or Japanese script
  if (item.original_language === 'ja' && (hasAnimationGenre || hasJapaneseCharacters(item.original_name || item.original_title || item.title || item.name))) {
    if (item.id) registerAnimeId(item.id);
    return true;
  }

  // 3. Explicit anime genre name
  if (Array.isArray(item.genres)) {
    const genreNames = item.genres.map(g => (typeof g === 'object' ? g.name : String(g))).filter(Boolean);
    if (genreNames.some(n => /anime/i.test(n))) {
      if (item.id) registerAnimeId(item.id);
      return true;
    }
  }

  // 4. Scraper IDs
  if (typeof item.id === 'string' && (item.id.startsWith('ta_') || item.id.startsWith('acx_') || item.id.startsWith('tra_'))) {
    registerAnimeId(item.id);
    return true;
  }

  // 5. Known keywords
  const rawTitle = (item.title || item.name || item.original_title || item.original_name || '').toLowerCase();
  for (const kw of KNOWN_ANIME_KEYWORDS) {
    if (rawTitle.includes(kw)) {
      if (item.id) registerAnimeId(item.id);
      return true;
    }
  }

  return false;
}


export function isSeriesItem(item) {
  if (!item) return false;
  if (
    item.first_air_date ||
    item.number_of_seasons ||
    item.episodesCount ||
    (Array.isArray(item.seasons) && item.seasons.length > 0)
  ) {
    return true;
  }
  if (item.type === 'tv' || item.media_type === 'tv') {
    return true;
  }
  if (item.type === 'movie' || item.media_type === 'movie' || (item.release_date && !item.first_air_date)) {
    return false;
  }
  return false;
}

export function determineMediaType(item) {
  if (!item) return 'movie';

  // 1. Anime Detection
  if (item.isAnime || item.type === 'anime' || isAnimeItem(item) || (item.id && isRegisteredAnimeId(item.id))) {
    return 'anime';
  }

  // 2. Documentary Detection
  if (item.type === 'documentary' || item.media_type === 'documentary') {
    return 'documentary';
  }
  const genreIds = item.genre_ids || (Array.isArray(item.genres) ? item.genres.map(g => (typeof g === 'object' ? g.id : g)) : []);
  if (genreIds.some(id => Number(id) === 99)) {
    return 'documentary';
  }

  // 3. Explicit Movie Check (Do NOT misclassify movies with progress timestamps)
  if (item.type === 'movie' || item.media_type === 'movie') {
    return 'movie';
  }

  // 4. Explicit TV Check
  if (item.type === 'tv' || item.media_type === 'tv') {
    return 'tv';
  }

  // 5. Smart Inference
  if (isSeriesItem(item)) {
    return 'tv';
  }

  return 'movie';
}

export function renderMediaCard(item, options = {}) {
  const id = item.id;
  const mediaType = determineMediaType(item);
  const isAnime = Boolean(item.isAnime || mediaType === 'anime' || isAnimeItem(item) || (item.id && isRegisteredAnimeId(item.id)));
  const isSeries = Boolean(item.isSeries !== undefined ? item.isSeries : isSeriesItem(item));
  const effectivePlayerType = isSeries ? 'tv' : 'movie';

  let rawTitle = item.title || item.name || '';
  if (!rawTitle || hasNonLatinCharacters(rawTitle)) {
    rawTitle = item.title_en || item.name_en || item.original_name || item.original_title || rawTitle || 'İsimsiz İçerik';
  }
  const title = rawTitle;
  const posterPath = item.poster_path || item.posterPath || item.poster || '';
  const backdropPath = item.backdrop_path || item.backdropPath || item.backdrop || '';
  const posterUrl = getImageUrl(posterPath, TMDB_IMAGE_SIZES.POSTER_MEDIUM);
  const fallbackLandscapeUrl = backdropPath
    ? getImageUrl(backdropPath, TMDB_IMAGE_SIZES.BACKDROP_LARGE)
    : posterUrl;
  const settings = getUserSettings();
  const usesLandscapeCards = settings.cardLayout === 'landscape';
  const cardImageUrl = usesLandscapeCards ? fallbackLandscapeUrl : posterUrl;
  
  // Real rating or empty
  let rawRating = item.vote_average ?? item.voteAverage ?? item.rating;
  let rating = rawRating ? Number(rawRating).toFixed(1) : '';
  if (rating === '0.0') rating = '';

  const rawDate = item.release_date || item.first_air_date || (item.year ? String(item.year) : '');
  const year = rawDate ? String(rawDate).substring(0, 4) : '';

  let progressPercent = item.progressPercent || 0;
  let season = item.season || 1;
  let episode = item.episode || 1;
  let currentTime = item.currentTime || 0;
  let isCompleted = item.completed || false;
  let isContinue = false;

  if (options.isContinueSection || (item.currentTime > 0 && !isCompleted) || (item.progressPercent > 0 && !isCompleted)) {
    isContinue = true;
  } else {
    const prog = options.skipProgressLookup ? null : getMediaProgress(id, season, episode);
    if (prog) {
      isCompleted = prog.completed || false;
      if (!isCompleted && prog.duration > 0 && prog.currentTime > 15) {
        isContinue = true;
        progressPercent = Math.min(100, Math.round((prog.currentTime / prog.duration) * 100));
        currentTime = prog.currentTime;
        if (isSeries) {
          season = prog.season || 1;
          episode = prog.episode || 1;
        }
      }
    }
  }

  // Type Tag Labels & Styles
  let typeLabel = 'FİLM';
  let typeClass = 'type-movie';
  let detailedTypeLabel = 'Film';

  if (isAnime) {
    typeLabel = isSeries ? 'ANİME DİZİSİ' : 'ANİME FİLMİ';
    typeClass = 'type-anime';
    detailedTypeLabel = isSeries ? 'Anime Dizisi' : 'Anime Filmi';
  } else if (mediaType === 'tv' || isSeries) {
    typeLabel = 'DİZİ';
    typeClass = 'type-tv';
    detailedTypeLabel = 'Dizi';
  } else if (mediaType === 'documentary') {
    typeLabel = 'BELGESEL';
    typeClass = 'type-doc';
    detailedTypeLabel = 'Belgesel';
  }

  const originalTitle = item.original_title || item.original_name || '';
  const encodedTitle = encodeURIComponent(title);
  const encodedOrigTitle = encodeURIComponent(originalTitle);
  const encodedPoster = encodeURIComponent(posterPath || '');
  const encodedBackdrop = encodeURIComponent(backdropPath || '');
  const type = effectivePlayerType;

  return `
    <div class="media-card" 
      data-id="${id}" 
      data-type="${type}" 
      data-isanime="${isAnime ? 'true' : 'false'}"
      data-title="${encodedTitle}" 
      data-originaltitle="${encodedOrigTitle}"
      data-poster="${encodedPoster}"
      data-backdrop="${encodedBackdrop}"
      data-overview="${encodeURIComponent(item.overview || '')}"
      data-year="${year}"
      data-rating="${rating}"
      data-tmdbid="${id}"
      data-mediatype="${mediaType === 'tv' || isSeries ? 'tv' : 'movie'}"
      data-isseries="${isSeries ? 'true' : 'false'}"
      data-season="${season}" 
      data-episode="${episode}" 
      data-currenttime="${currentTime}"
      data-iscontinue="${isContinue ? 'true' : 'false'}"
      tabindex="0"
      role="button"
      aria-label="${title}">
      
      <div class="card-poster-wrapper ${!backdropPath ? 'card-fanart-portrait-fallback' : ''}">
        <img 
          src="${cardImageUrl}"
          data-poster-src="${posterUrl}"
          data-backdrop-src="${fallbackLandscapeUrl}"
          alt="${title}" 
          class="card-poster-img" 
          loading="lazy" 
          decoding="async"
          onerror="this.onerror=null;this.src='${SINEFLIX_POSTER_FALLBACK}'"
        />
        <img class="card-fanart-logo" alt="" aria-hidden="true" />
        
        <div class="card-glass-glow"></div>

        <!-- Top meta strip: year + rating over poster -->
        ${(year || rating) ? `
          <div class="card-top-strip">
            ${year ? `<span class="card-top-year">${year}</span>` : `<span></span>`}
            ${rating ? `<span class="card-top-rating"><i data-lucide="star" style="width:10px;height:10px;fill:#f59e0b;stroke:#f59e0b;"></i>${rating}</span>` : ''}
          </div>
        ` : ''}

        <!-- Hover Quick Play Overlay -->
        <div class="card-hover-overlay">
          <div class="card-play-btn-circle">
            <i data-lucide="play" style="width:20px;height:20px;fill:currentColor;margin-left:2px;"></i>
          </div>
          <span class="card-hover-title">${title}</span>
          <span class="card-hover-action-text">${isContinue ? 'İzlemeye Devam Et' : 'İncele & Oynat'}</span>
        </div>

        <!-- Bottom Cinematic Gradient Overlay with Title & Meta (Apple TV / Stremio Vurgusu) -->
        <div class="card-bottom-cinematic-overlay">
          <h3 class="card-cinematic-title" title="${title}">${title}</h3>
          <div class="card-cinematic-meta">
            <span class="card-cinematic-type">${detailedTypeLabel}</span>
            ${year ? `<span class="card-cinematic-dot">•</span><span class="card-cinematic-year">${year}</span>` : ''}
          </div>
        </div>

        <!-- Progress Bar at bottom if watch in progress -->
        ${progressPercent > 0 && !isCompleted ? `
          <div class="card-progress-bar-bg">
            <div class="card-progress-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
        ` : ''}
      </div>

      <!-- Watch status strip: OUTSIDE the poster, full card width, attached right below the poster -->
      ${isCompleted ? `
        <div class="card-watch-status card-watch-status--done">
          <i data-lucide="check-circle" style="width:11px;height:11px;stroke-width:2.5;flex-shrink:0;"></i>
          <span>İzlendi</span>
        </div>
      ` : isContinue && isSeries ? `
        <div class="card-watch-status card-watch-status--continue">
          <i data-lucide="play" style="width:10px;height:10px;fill:currentColor;flex-shrink:0;"></i>
          <span>S${season} B${episode} devam ediyor</span>
        </div>
      ` : isContinue && !isSeries && progressPercent > 0 ? `
        <div class="card-watch-status card-watch-status--continue">
          <i data-lucide="play" style="width:10px;height:10px;fill:currentColor;flex-shrink:0;"></i>
          <span>%${progressPercent} izlendi</span>
        </div>
      ` : ''}

      <div class="card-info">
        <h3 class="card-title" title="${title}">${title}</h3>
        <div class="card-meta">
          <span class="card-type-tag ${typeClass}">${typeLabel}</span>
          ${year ? `<span class="card-year-tag">${year}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

export function attachMediaCardEvents(container) {
  if (!container) return;
  // Card artwork is supplied by the primary TMDB response. Avoid issuing a
  // second artwork/logo lookup for every card in the home rails.
  if (container._hasMediaEventsDelegated) return;
  container._hasMediaEventsDelegated = true;
  let suppressCardNavigationUntil = 0;

  container.addEventListener('click', (e) => {
    if (Date.now() < suppressCardNavigationUntil) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // Don't trigger card navigation if delete button or other child button clicked
    if (e.target.closest('.btn-lib-delete') || e.target.closest('.btn-delete-history')) {
      return;
    }
    const card = e.target.closest('.media-card');
    if (!card) return;

    e.preventDefault();
    const id = card.getAttribute('data-id');
    const type = card.getAttribute('data-type');
    const isAnime = card.getAttribute('data-isanime') === 'true' || type === 'anime' || isRegisteredAnimeId(id);
    const season = parseInt(card.getAttribute('data-season') || '1', 10);
    const episode = parseInt(card.getAttribute('data-episode') || '1', 10);
    const currentTime = parseFloat(card.getAttribute('data-currenttime') || '0');
    const title = decodeURIComponent(card.getAttribute('data-title') || '');
    const originalTitle = decodeURIComponent(card.getAttribute('data-originaltitle') || '');
    const posterPath = card.getAttribute('data-poster') || '';
    const backdropPath = card.getAttribute('data-backdrop') || '';
    const isContinue = card.getAttribute('data-iscontinue') === 'true';
    const isSeriesAttr = card.getAttribute('data-isseries');
    const mediaTypeAttr = card.getAttribute('data-mediatype');

    const isSeriesCard = isSeriesAttr !== null
      ? isSeriesAttr === 'true'
      : (mediaTypeAttr === 'tv' || type === 'tv');

  if (isContinue) {
      (async () => {
        try {
          await openPlayerModal({
            type: isAnime ? 'anime' : (isSeriesCard ? 'tv' : 'movie'),
            isAnime,
            isSeries: isSeriesCard,
            tmdbId: id,
            title: isSeriesCard ? `${title} - S${season}E${episode}` : title,
            seriesTitle: title,
            originalTitle: originalTitle || title,
            season: isSeriesCard ? season : undefined,
            episode: isSeriesCard ? episode : undefined,
            posterPath,
            backdropPath,
            currentTime
          });
        } catch (err) {
          console.error('[MediaCard] Devam et oynatılamadı:', err);
          showToast('İçerik açılırken bir sorun oluştu, lütfen tekrar deneyin.', 'error');
        }
      })();
    } else {
      saveAllScrollState();
      window.location.hash = `#detail?type=${isAnime ? 'anime' : type}&id=${id}`;
    }
  });


}

let fanartObserver = null;

function getFanartObserver() {
  if (fanartObserver) return fanartObserver;
  if (!('IntersectionObserver' in window)) return null;
  fanartObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      fanartObserver.unobserve(entry.target);
      loadLandscapeArtwork(entry.target);
    });
  }, { rootMargin: '150px 0px' });
  return fanartObserver;
}

async function loadLandscapeArtwork(card) {
  if (!card || card.dataset.fanartState === 'loaded' || card.dataset.fanartState === 'loading') return;
  card.dataset.fanartState = 'loading';
  const img = card.querySelector('.card-poster-img');
  if (!img) return;

  try {
    const artwork = await getBestBackdrop(card.dataset.tmdbid, card.dataset.mediatype || 'movie');
    if (!card.isConnected) return;

    if (!artwork?.image && !artwork?.logo) {
      card.dataset.fanartState = 'empty';
      return;
    }

    if (artwork.image) {
      img.dataset.backdropSrc = artwork.image;
      const isLandscape = getUserSettings().cardLayout === 'landscape' || document.documentElement.classList.contains('cards-landscape');
      if (isLandscape) {
        img.src = artwork.image;
      }
    }

    const logoEl = card.querySelector('.card-fanart-logo');
    if (logoEl && artwork.logo) {
      logoEl.src = artwork.logo;
      const wrapper = card.querySelector('.card-poster-wrapper');
      wrapper?.classList.remove('card-fanart-placeholder');
      wrapper?.classList.toggle('card-fanart-composite', true);
    }

    card.dataset.fanartState = 'loaded';
  } catch (_) {
    card.dataset.fanartState = 'empty';
  }
}

export function upgradeLandscapeBackdrops(container = document, forceImmediate = false) {
  const isLandscape = getUserSettings().cardLayout === 'landscape' || document.documentElement.classList.contains('cards-landscape');
  if (!isLandscape) return;

  const root = (container && container.querySelectorAll) ? container : document;
  const cards = root.querySelectorAll('.media-card[data-tmdbid]:not([data-fanart-state="loaded"])');
  if (!cards.length) return;

  if (forceImmediate) {
    cards.forEach(card => loadLandscapeArtwork(card));
    return;
  }

  const observer = getFanartObserver();
  if (!observer) {
    cards.forEach(card => loadLandscapeArtwork(card));
    return;
  }
  cards.forEach(card => observer.observe(card));
}

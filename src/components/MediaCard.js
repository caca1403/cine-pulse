/* ==========================================================================
   CinePulse Studio - Media Card Component
   Ultra-sleek, borderless luxury cards with floating gold star rating badge,
   clean typography, smart type detection, and smooth responsive hover animations.
   ========================================================================== */

import { getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_POSTER_FALLBACK, hasNonLatinCharacters } from '../services/tmdbApi.js';
import { getMediaProgress, getLastWatchedEpisode, formatSecondsToTime, formatRemainingTime } from '../services/storage.js';
import { openPlayerModal } from './PlayerModal.js';
import { saveAllScrollState } from '../services/scrollManager.js';

export function isAnimeItem(item) {
  if (!item) return false;
  if (item.type === 'anime' || item.media_type === 'anime' || item.isAnime) return true;

  const genreIds = item.genre_ids || (Array.isArray(item.genres) ? item.genres.map(g => (typeof g === 'object' ? g.id : g)) : []);
  const hasAnimationGenre = genreIds.some(id => Number(id) === 16);
  const isJapanese = item.original_language === 'ja' || (Array.isArray(item.origin_country) && item.origin_country.includes('JP'));

  if (hasAnimationGenre && isJapanese) return true;

  if (Array.isArray(item.genres)) {
    const genreNames = item.genres.map(g => (typeof g === 'object' ? g.name : String(g))).filter(Boolean);
    if (genreNames.some(n => /anime/i.test(n))) return true;
  }

  if (typeof item.id === 'string' && (item.id.startsWith('ta_') || item.id.startsWith('acx_') || item.id.startsWith('tra_'))) {
    return true;
  }

  const rawTitle = (item.title || item.name || item.original_title || item.original_name || '').toLowerCase();
  if (rawTitle.includes('anime')) return true;

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
  if (isAnimeItem(item)) {
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
  const isAnime = isAnimeItem(item) || mediaType === 'anime';
  const isSeries = isSeriesItem(item);
  const effectivePlayerType = isSeries ? 'tv' : 'movie';

  let rawTitle = item.title || item.name || '';
  if (!rawTitle || hasNonLatinCharacters(rawTitle)) {
    rawTitle = item.title_en || item.name_en || item.original_name || item.original_title || rawTitle || 'İsimsiz İçerik';
  }
  const title = rawTitle;
  const posterPath = item.poster_path || item.posterPath || item.poster || '';
  const backdropPath = item.backdrop_path || item.backdropPath || item.backdrop || '';
  const posterUrl = getImageUrl(posterPath, TMDB_IMAGE_SIZES.POSTER_MEDIUM);
  
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
    const prog = getMediaProgress(id, season, episode);
    if (prog) {
      isCompleted = prog.completed || false;
      if (!isCompleted && prog.duration > 0 && prog.currentTime > 15) {
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
    typeLabel = 'ANİME';
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

  const encodedTitle = encodeURIComponent(title);
  const encodedPoster = encodeURIComponent(posterPath || '');
  const encodedBackdrop = encodeURIComponent(backdropPath || '');

  return `
    <div class="media-card" 
      data-id="${id}" 
      data-type="${type}" 
      data-title="${encodedTitle}" 
      data-poster="${encodedPoster}"
      data-backdrop="${encodedBackdrop}"
      data-season="${season}" 
      data-episode="${episode}" 
      data-currenttime="${currentTime}"
      data-iscontinue="${isContinue ? 'true' : 'false'}"
      tabindex="0"
      role="button"
      aria-label="${title}">
      
      <div class="card-poster-wrapper">
        <img 
          src="${posterUrl}" 
          alt="${title}" 
          class="card-poster-img" 
          loading="lazy" 
          decoding="async"
          onerror="this.onerror=null;this.src='${SINEFLIX_POSTER_FALLBACK}'"
        />
        
        <div class="card-glass-glow"></div>

        <!-- Left Status Pill (Completed / In-Progress) -->
        ${isCompleted ? `
          <div class="card-status-badge card-status-completed" title="Tamamlandı">
            <i data-lucide="check" style="width:10px;height:10px;stroke-width:3;"></i>
            <span>İZLENDİ</span>
          </div>
        ` : (isContinue && type === 'tv' ? `
          <div class="card-status-badge card-status-continue" title="Kaldığın Bölüm">
            <i data-lucide="clock" style="width:10px;height:10px;"></i>
            <span>S${season} B${episode}</span>
          </div>
        ` : '')}

        <!-- Rating Pill Floating Top Right -->
        ${rating ? `
          <div class="card-rating-pill">
            <i data-lucide="star" style="width:11px;height:11px;fill:#f59e0b;stroke:#f59e0b;"></i>
            <span>${rating}</span>
          </div>
        ` : ''}

        <!-- Hover Quick Play Overlay -->
        <div class="card-hover-overlay">
          <div class="card-play-btn-circle">
            <i data-lucide="play" style="width:20px;height:20px;fill:currentColor;margin-left:2px;"></i>
          </div>
          <span class="card-hover-action-text">${isContinue ? 'İzlemeye Devam Et' : 'İncele & Oynat'}</span>
        </div>

        <!-- Progress Bar at bottom if watch in progress -->
        ${progressPercent > 0 && !isCompleted ? `
          <div class="card-progress-bar-bg">
            <div class="card-progress-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
        ` : ''}
      </div>

      <div class="card-info">
        <h3 class="card-title" title="${title}">${title}</h3>
        <div class="card-meta">
          <span class="card-type-tag ${typeClass}">${typeLabel}</span>
          ${isContinue && type === 'tv' ? `<span class="card-episode-tag">S${season} B${episode}</span>` : ''}
          ${year ? `<span class="card-year-tag">${year}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

export function attachMediaCardEvents(container) {
  if (!container || container._hasMediaEventsDelegated) return;
  container._hasMediaEventsDelegated = true;

  container.addEventListener('click', (e) => {
    // Don't trigger card navigation if delete button or other child button clicked
    if (e.target.closest('.btn-lib-delete') || e.target.closest('.btn-delete-history')) {
      return;
    }
    const card = e.target.closest('.media-card');
    if (!card) return;

    e.preventDefault();
    const id = card.getAttribute('data-id');
    const type = card.getAttribute('data-type');
    const season = parseInt(card.getAttribute('data-season') || '1', 10);
    const episode = parseInt(card.getAttribute('data-episode') || '1', 10);
    const currentTime = parseFloat(card.getAttribute('data-currenttime') || '0');
    const title = decodeURIComponent(card.getAttribute('data-title') || '');
    const posterPath = card.getAttribute('data-poster') || '';
    const backdropPath = card.getAttribute('data-backdrop') || '';
    const isContinue = card.getAttribute('data-iscontinue') === 'true';

    if (isContinue && (card.closest('#continue-watching-rail') || card.closest('.continue-card-wrapper') || currentTime > 0)) {
      openPlayerModal({
        type,
        tmdbId: id,
        title: type === 'tv' ? `${title} - S${season}E${episode}` : title,
        seriesTitle: title,
        season,
        episode,
        posterPath,
        backdropPath,
        currentTime
      });
    } else {
      saveAllScrollState();
      window.location.hash = `#detail?type=${type}&id=${id}`;
    }
  });
}

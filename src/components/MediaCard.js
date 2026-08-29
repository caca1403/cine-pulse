/* ==========================================================================
   CinePulse Studio - Media Card Component
   Ultra-sleek, borderless luxury cards with floating gold star rating badge,
   clean typography, smart type detection, and smooth responsive hover animations.
   ========================================================================== */

import { getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_POSTER_FALLBACK } from '../services/tmdbApi.js';
import { getMediaProgress, getLastWatchedEpisode, formatSecondsToTime, formatRemainingTime } from '../services/storage.js';
import { openPlayerModal } from './PlayerModal.js';
import { saveAllScrollState } from '../services/scrollManager.js';

export function determineMediaType(item) {
  if (!item) return 'movie';
  if (item.type === 'tv' || item.type === 'anime' || item.type === 'documentary') {
    return item.type;
  }
  // Smart detection if type wasn't explicitly saved
  if (
    item.first_air_date ||
    item.media_type === 'tv' ||
    (item.season && Number(item.season) > 0) ||
    (item.episode && Number(item.episode) > 0) ||
    item.number_of_seasons ||
    item.episodesCount ||
    (!item.title && item.name)
  ) {
    return 'tv';
  }
  return 'movie';
}

export function renderMediaCard(item, options = {}) {
  const id = item.id;
  const type = determineMediaType(item);
  const title = item.title || item.name || 'İsimsiz İçerik';
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
        if (type === 'tv') {
          season = prog.season || 1;
          episode = prog.episode || 1;
        }
      }
    }
  }

  // Type Tag Labels & Styles
  let typeLabel = 'FİLM';
  let typeClass = 'type-movie';
  if (type === 'tv') {
    typeLabel = 'DİZİ';
    typeClass = 'type-tv';
  } else if (type === 'anime') {
    typeLabel = 'ANİME';
    typeClass = 'type-anime';
  } else if (type === 'documentary') {
    typeLabel = 'BELGESEL';
    typeClass = 'type-doc';
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
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
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
            <i data-lucide="star" style="width:11px;height:11px;fill:#fbbf24;color:#fbbf24;"></i>
            <span>${rating}</span>
          </div>
        ` : ''}

        <!-- Hover Overlay -->
        <div class="card-hover-overlay">
          <div class="card-play-btn-circle">
            <i data-lucide="play" style="fill:#fff;stroke:#fff;width:20px;height:20px;margin-left:2px;"></i>
          </div>
          <span class="card-hover-action-text">${isContinue ? 'Kaldığın Yerden İzle' : 'Detay ve İzle'}</span>
        </div>

        <!-- Progress Bar if Continue Watching -->
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
  if (!container) return;
  container.querySelectorAll('.media-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger card navigation if delete button or other child button clicked
      if (e.target.closest('.btn-lib-delete') || e.target.closest('.btn-delete-history')) {
        return;
      }
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
  });
}

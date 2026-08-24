/* ==========================================================================
   CinePulse Studio - Media Card Component
   Ultra-sleek, borderless luxury cards with floating gold star rating badge,
   clean typography, and smooth responsive hover animations.
   ========================================================================== */

import { getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_POSTER_FALLBACK } from '../services/tmdbApi.js';
import { getMediaProgress, getLastWatchedEpisode, formatSecondsToTime, formatRemainingTime } from '../services/storage.js';
import { openPlayerModal } from './PlayerModal.js';
import { saveAllScrollState } from '../services/scrollManager.js';

export function renderMediaCard(item, options = {}) {
  const id = item.id;
  const type = item.type || (item.first_air_date || item.media_type === 'tv' ? 'tv' : 'movie');
  const title = item.title || item.name || 'İsimsiz İçerik';
  const posterPath = item.poster_path || item.posterPath;
  const posterUrl = getImageUrl(posterPath, TMDB_IMAGE_SIZES.POSTER_MEDIUM);
  const rating = item.vote_average ? Number(item.vote_average).toFixed(1) : (item.voteAverage ? Number(item.voteAverage).toFixed(1) : (item.rating ? Number(item.rating).toFixed(1) : '7.8'));
  const year = (item.release_date || item.first_air_date || '').substring(0, 4) || (item.year ? String(item.year) : '2024');

  let progressPercent = item.progressPercent || 0;
  let season = item.season || 1;
  let episode = item.episode || 1;
  let currentTime = item.currentTime || 0;
  let isCompleted = item.completed || false;
  let isContinue = false;

  if (options.isContinueSection || item.currentTime > 0 || item.progressPercent > 0) {
    isContinue = true;
  } else {
    const prog = getMediaProgress(id, type);
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

  const encodedTitle = encodeURIComponent(title);
  const encodedPoster = encodeURIComponent(posterPath || '');
  const encodedBackdrop = encodeURIComponent(item.backdrop_path || item.backdropPath || '');

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
          onerror="this.onerror=null;this.src='${SINEFLIX_POSTER_FALLBACK}'"
        />
        
        <div class="card-glass-glow"></div>

        <!-- Rating Pill Floating Top Right -->
        ${rating && rating !== '0.0' ? `
          <div class="card-rating-pill">
            <i data-lucide="star" style="width:11px;height:11px;fill:#fbbf24;color:#fbbf24;"></i>
            <span>${rating}</span>
          </div>
        ` : ''}

        <!-- Hover Overlay -->
        <div class="card-hover-overlay">
          <div class="card-play-btn-circle">
            <i data-lucide="play" style="fill:#fff;stroke:#fff;width:22px;height:22px;margin-left:3px;"></i>
          </div>
          <span class="card-hover-action-text">${isContinue ? 'İzlemeye Devam Et' : 'İzle'}</span>
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
          <span class="card-type-tag">${type === 'tv' ? 'DİZİ' : 'FİLM'}</span>
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

/* ==========================================================================
   CinePulse Studio - Media Card Component
   Ultra-sleek, borderless luxury cards with floating gold star rating badge,
   clean typography, and smooth responsive hover animations.
   ========================================================================== */

import { getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_POSTER_FALLBACK } from '../services/tmdbApi.js';
import { getMediaProgress, getLastWatchedEpisode, formatSecondsToTime, formatRemainingTime } from '../services/storage.js';
import { openPlayerModal } from './PlayerModal.js';

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
  let effectiveDuration = item.duration || (type === 'movie' ? 6600 : 3000);

  if (progressPercent > 0 || item.currentTime > 0 || item.completed) {
    isContinue = true;
  } else {
    if (type === 'tv') {
      const lastWatched = getLastWatchedEpisode(id);
      if (lastWatched) {
        progressPercent = lastWatched.progressPercent || 0;
        season = lastWatched.season || 1;
        episode = lastWatched.episode || 1;
        currentTime = lastWatched.currentTime || 0;
        isCompleted = lastWatched.completed || false;
        effectiveDuration = lastWatched.duration || 3000;
        isContinue = true;
      }
    } else {
      const progress = getMediaProgress(id, 1, 1);
      if (progress) {
        progressPercent = progress.progressPercent || 0;
        currentTime = progress.currentTime || 0;
        isCompleted = progress.completed || false;
        effectiveDuration = progress.duration || 6600;
        isContinue = true;
      }
    }
  }

  let subtitleText = year;
  const timeStr = formatSecondsToTime(currentTime);

  if (item.subtitle) {
    subtitleText = item.subtitle;
  } else if (isContinue) {
    if (isCompleted) {
      subtitleText = `${year} • ✓ İzlendi`;
    } else if (type === 'tv') {
      subtitleText = `${year} • S${season} B${episode}`;
    } else {
      subtitleText = `${year} • ${timeStr || 'İzleniyor'}`;
    }
  }

  const progressBarHTML = progressPercent > 0 ? `
    <div class="card-progress-bar">
      <div class="card-progress-fill" style="width: ${progressPercent}%; background: ${isCompleted ? 'var(--accent-green)' : '#f59e0b'};"></div>
    </div>
  ` : '';

  return `
    <div class="media-card" 
         data-id="${id}" 
         data-type="${type}" 
         data-season="${season}" 
         data-episode="${episode}" 
         data-currenttime="${currentTime}"
         data-title="${encodeURIComponent(title)}"
         data-poster="${posterPath || ''}"
         data-backdrop="${item.backdropPath || item.backdrop_path || ''}"
         data-iscontinue="${isContinue ? 'true' : 'false'}">
      <div class="card-poster-wrapper">
        <img class="card-poster" src="${posterUrl}" alt="${title}" loading="lazy" onerror="this.onerror=null; this.src='${SINEFLIX_POSTER_FALLBACK}';" />
        
        <!-- Floating Rating Badge (Top Right) -->
        <div class="card-rating-badge">
          <svg class="star-icon" viewBox="0 0 24 24" width="12" height="12" fill="#fbbf24" style="flex-shrink: 0;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
          <span>${rating}</span>
        </div>

        <div class="card-overlay">
          <div class="card-play-btn">
            <i data-lucide="play" style="fill: currentColor; margin-left: 2px;"></i>
          </div>
        </div>

        ${progressBarHTML}
      </div>

      <div class="card-info">
        <h3 class="card-title" title="${title}">${title}</h3>
        <div class="card-meta">
          <span class="card-year">${subtitleText}</span>
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
        const currentHash = window.location.hash || '#home';
        if (!currentHash.startsWith('#detail') && window.scrollY > 0) {
          try {
            sessionStorage.setItem(`cinepulse_scroll_${currentHash}`, String(window.scrollY));
          } catch (_) {}
        }
        window.location.hash = `#detail?type=${type}&id=${id}`;
      }
    });
  });
}

/* ==========================================================================
   CinePulse Studio - Media Card Component
   Renders poster, title, IMDb rating, resolution badges, watch progress bar,
   remaining time badge, and handles direct click-to-play with saved timestamp.
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
  const rating = item.vote_average ? Number(item.vote_average).toFixed(1) : (item.voteAverage ? Number(item.voteAverage).toFixed(1) : '8.5');
  const year = (item.release_date || item.first_air_date || '').substring(0, 4) || '2024';

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

  let episodeInfoStr = '';
  const timeStr = formatSecondsToTime(currentTime);
  const remTimeStr = (currentTime > 0 && !isCompleted) ? formatRemainingTime(currentTime, effectiveDuration) : '';

  if (item.subtitle) {
    episodeInfoStr = item.subtitle;
  } else if (isContinue) {
    if (isCompleted) {
      episodeInfoStr = '✓ İzlendi';
    } else if (type === 'tv') {
      episodeInfoStr = `S${season} B${episode}${timeStr ? ' • ' + timeStr : ''}${remTimeStr ? ' • ' + remTimeStr : ''}`;
    } else {
      episodeInfoStr = `Kaldığın: ${timeStr || 'İzleniyor'}${remTimeStr ? ' • ' + remTimeStr : ''}`;
    }
  } else {
    episodeInfoStr = `${year} • ${type === 'tv' ? 'Dizi' : 'Film'}`;
  }

  const progressBarHTML = progressPercent > 0 ? `
    <div class="card-progress-bar">
      <div class="card-progress-fill" style="width: ${progressPercent}%; background: ${isCompleted ? 'var(--accent-green)' : 'var(--secondary-gradient)'};"></div>
    </div>
  ` : '';

  let statusBadgeHTML = '';
  if (isCompleted) {
    statusBadgeHTML = `
      <div class="card-status-overlay">
        <span class="card-status-badge watched">
          <i data-lucide="check-circle-2" style="width:12px; height:12px;"></i>
          <span>İZLENDİ</span>
        </span>
      </div>
    `;
  } else if (timeStr) {
    statusBadgeHTML = `
      <div class="card-status-overlay">
        <span class="card-status-badge in-progress" title="${remTimeStr || timeStr}">
          <i data-lucide="clock" style="width:11px; height:11px;"></i>
          <span>${timeStr}</span>
        </span>
      </div>
    `;
  }

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
        
        <!-- Top Row Badges (Rating on Left, Type on Right) -->
        <div class="card-badges">
          <span class="card-rating-badge">
            <i data-lucide="star" style="width:11px; height:11px; fill:#fbbf24; color:#fbbf24;"></i>
            <span>${rating}</span>
          </span>
          <span class="card-type-badge">${type === 'tv' ? 'DİZİ' : 'FİLM'}</span>
        </div>

        <!-- Bottom Status Badge (Watched or Remaining Time) -->
        ${statusBadgeHTML}

        <div class="card-overlay">
          <div class="card-play-btn">
            <i data-lucide="play" style="fill: currentColor; margin-left: 2px;"></i>
          </div>
        </div>

        ${progressBarHTML}
      </div>

      <div class="card-info">
        <div class="card-title" title="${title}">${title}</div>
        <div class="card-meta">
          <span class="card-subtitle-text" style="${timeStr ? 'color: #fbbf24; font-weight: 600;' : ''}">${episodeInfoStr}</span>
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

      if (isContinue && (card.closest('#continue-watching-rail') || currentTime > 0)) {
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
        window.location.hash = `#detail?type=${type}&id=${id}`;
      }
    });
  });
}

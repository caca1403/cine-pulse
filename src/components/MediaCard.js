/* ==========================================================================
   CinePulse Studio - Media Card Component
   Renders poster, title, IMDb rating, resolution badges, watch progress bar,
   and handles direct click-to-play with saved timestamp (Kaldığın Yerden Devam Et).
   ========================================================================== */

import { getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_POSTER_FALLBACK } from '../services/tmdbApi.js';
import { getMediaProgress, getLastWatchedEpisode, formatSecondsToTime } from '../services/storage.js';
import { openPlayerModal } from './PlayerModal.js';

export function renderMediaCard(item, options = {}) {
  const id = item.id;
  const type = item.type || (item.first_air_date || item.media_type === 'tv' ? 'tv' : 'movie');
  const title = item.title || item.name || 'İsimsiz İçerik';
  const posterPath = item.poster_path || item.posterPath;
  const posterUrl = getImageUrl(posterPath, TMDB_IMAGE_SIZES.POSTER_MEDIUM);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : (item.voteAverage || '8.5');
  const year = (item.release_date || item.first_air_date || '').substring(0, 4) || '2024';

  let progressPercent = item.progressPercent || 0;
  let season = item.season || 1;
  let episode = item.episode || 1;
  let currentTime = item.currentTime || 0;
  let isContinue = false;

  if (progressPercent > 0 || item.currentTime > 0) {
    isContinue = true;
  } else {
    if (type === 'tv') {
      const lastWatched = getLastWatchedEpisode(id);
      if (lastWatched) {
        progressPercent = lastWatched.progressPercent || 0;
        season = lastWatched.season || 1;
        episode = lastWatched.episode || 1;
        currentTime = lastWatched.currentTime || 0;
        isContinue = true;
      }
    } else {
      const progress = getMediaProgress(id, 1, 1);
      if (progress) {
        progressPercent = progress.progressPercent || 0;
        currentTime = progress.currentTime || 0;
        isContinue = true;
      }
    }
  }

  let episodeInfoStr = '';
  const timeStr = formatSecondsToTime(currentTime);

  if (isContinue) {
    if (type === 'tv') {
      episodeInfoStr = `S${season} B${episode}${timeStr ? ' • ' + timeStr : ''}`;
    } else {
      episodeInfoStr = `Kaldığın: ${timeStr || 'İzleniyor'}`;
    }
  } else {
    episodeInfoStr = `${year} • ${type === 'tv' ? 'Dizi' : 'Film'}`;
  }

  const progressBarHTML = progressPercent > 0 ? `
    <div class="card-progress-bar">
      <div class="card-progress-fill" style="width: ${progressPercent}%"></div>
    </div>
  ` : '';

  const timeBadgeHTML = timeStr ? `
    <span class="card-time-badge">
      <i data-lucide="clock" style="width:10px; height:10px;"></i>
      <span>${timeStr}</span>
    </span>
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
        
        <div class="card-badges">
          <span class="card-rating-badge">
            <i data-lucide="star" style="width:11px; height:11px; fill:#fbbf24; color:#fbbf24;"></i>
            <span>${rating}</span>
          </span>
          ${timeBadgeHTML}
          <span class="card-type-badge">${type === 'tv' ? 'DİZİ' : 'FİLM'}</span>
        </div>

        <div class="card-overlay">
          <div class="card-play-btn">
            <i data-lucide="play" style="fill: currentColor; margin-left: 2px;"></i>
          </div>
        </div>

        ${progressBarHTML}
      </div>

      <div class="card-info">
        <div class="card-title">${title}</div>
        <div class="card-meta">
          <span style="${timeStr ? 'color: #fbbf24; font-weight: 700;' : ''}">${episodeInfoStr}</span>
          <span style="color: var(--accent-cyan); font-weight: 600;">1080p HD</span>
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

      // If clicked from Continue Watching rail or card has saved watch history, open player directly
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

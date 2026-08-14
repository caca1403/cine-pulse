/* ==========================================================================
   SineFlix Pro - Media Detail View
   Displays full TMDB metadata, backdrop banner, season/episode list or play movie button
   ========================================================================== */

import { fetchMediaDetails, getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_ACTOR_FALLBACK, SINEFLIX_POSTER_FALLBACK } from '../services/tmdbApi.js';
import { isFavorite, toggleFavorite, isWatchlist, toggleWatchlist, getLastWatchedEpisode, getMediaProgress, formatSecondsToTime } from '../services/storage.js';
import { renderSeasonSelector } from '../components/SeasonSelector.js';
import { renderMediaCard, attachMediaCardEvents } from '../components/MediaCard.js';
import { openPlayerModal } from '../components/PlayerModal.js';
import { showToast } from '../components/Toast.js';

export async function renderDetailView(type = 'tv', id) {
  const media = await fetchMediaDetails(type, id);
  if (!media) {
    return {
      html: `<div class="container" style="padding: 10rem 0; text-align: center;"><h2>İçerik bulunamadı.</h2></div>`,
      init: () => {}
    };
  }

  const title = media.title || media.name || 'Detay';
  const originalTitle = media.original_title || media.original_name || '';
  const backdropUrl = getImageUrl(media.backdrop_path, TMDB_IMAGE_SIZES.BACKDROP_ORIGINAL);
  const posterUrl = getImageUrl(media.poster_path, TMDB_IMAGE_SIZES.POSTER_MEDIUM);
  const rating = media.vote_average ? media.vote_average.toFixed(1) : '8.5';
  const year = (media.first_air_date || media.release_date || '').substring(0, 4);
  const overview = media.overview || 'Bu yapım için henüz Türkçe özet bulunmuyor.';
  const genres = media.genres || [];

  const inFav = isFavorite(id);
  const inWatch = isWatchlist(id);

  // Watch history progress for hero button
  const lastWatchedEp = type === 'tv' ? getLastWatchedEpisode(id) : null;
  const movieProgress = type === 'movie' ? getMediaProgress(id, 1, 1) : null;

  let playButtonLabel = type === 'movie' ? 'Filmi İzle (1080p HD)' : '1. Sezon 1. Bölümü İzle';
  if (type === 'tv' && lastWatchedEp) {
    const timeStr = formatSecondsToTime(lastWatchedEp.currentTime);
    playButtonLabel = `Kaldığın Yerden Devam Et (S${lastWatchedEp.season} B${lastWatchedEp.episode}${timeStr ? ' • ' + timeStr : ''})`;
  } else if (type === 'movie' && movieProgress && movieProgress.currentTime > 0) {
    const timeStr = formatSecondsToTime(movieProgress.currentTime);
    playButtonLabel = `Kaldığın Yerden Devam Et (${timeStr})`;
  }

  // Cast list (max 7 actors)
  const castList = media.credits && media.credits.cast ? media.credits.cast.slice(0, 7) : [];

  let seasonSelectorObj = null;
  if (type === 'tv' && media.seasons) {
    seasonSelectorObj = await renderSeasonSelector({
      tvId: id,
      seriesTitle: title,
      seriesOverview: overview,
      seasons: media.seasons,
      posterPath: media.poster_path,
      backdropPath: media.backdrop_path
    });
  }

  const recommendations = media.recommendations ? media.recommendations.results.slice(0, 6) : [];

  const html = `
    <div class="detail-view">
      <div class="detail-header">
        <div class="detail-backdrop" style="background-image: url('${backdropUrl}')"></div>

        <div class="container" style="position: relative; z-index: 2;">
          <div class="detail-content">
            <img class="detail-poster" src="${posterUrl}" alt="${title}" onerror="this.onerror=null; this.src='${SINEFLIX_POSTER_FALLBACK}';" />

            <div class="detail-info">
              <div class="hero-badge-row">
                <span class="badge badge-primary">${type === 'tv' ? 'DİZİ' : 'FİLM'}</span>
                <span class="badge badge-rating">
                  <i data-lucide="star" style="width:14px; height:14px; fill: currentColor"></i> ${rating} IMDb
                </span>
                <span class="badge">${year}</span>
                ${media.episode_run_time && media.episode_run_time.length > 0 ? `<span class="badge">${media.episode_run_time[0]} DK / BÖLÜM</span>` : ''}
              </div>

              <h1 class="detail-title">${title}</h1>
              ${originalTitle && originalTitle !== title ? `<div style="font-size: 1.1rem; color: var(--text-muted); margin-top: -0.5rem; font-style: italic;">${originalTitle}</div>` : ''}

              <div class="detail-genres">
                ${genres.map(g => `<span class="detail-genre-tag">${g.name}</span>`).join('')}
              </div>

              <p style="font-size: 1rem; color: var(--text-sub); line-height: 1.6; max-width: 800px;">${overview}</p>

              <!-- Oyuncular (Clean Flex Chips) -->
              ${castList.length > 0 ? `
                <div style="margin-top: 0.8rem;">
                  <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">Oyuncular</div>
                  <div style="display: flex; flex-wrap: wrap; gap: 0.6rem; align-items: center;">
                    ${castList.map(actor => {
                      const actorPic = actor.profile_path ? getImageUrl(actor.profile_path, TMDB_IMAGE_SIZES.POSTER_SMALL) : SINEFLIX_ACTOR_FALLBACK;
                      return `
                        <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.06); backdrop-filter: blur(10px); padding: 0.3rem 0.8rem 0.3rem 0.3rem; border-radius: var(--radius-full); border: 1px solid var(--border-color); font-size: 0.82rem; font-weight: 500;">
                          <img src="${actorPic}" alt="${actor.name}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover;" onerror="this.onerror=null; this.src='${SINEFLIX_ACTOR_FALLBACK}';" />
                          <span>${actor.name}</span>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              ` : ''}

              <div class="hero-actions" style="margin-top: 1.5rem;">
                ${type === 'movie' ? `
                  <button class="btn-primary" id="btn-play-movie">
                    <i data-lucide="play" style="fill: currentColor"></i>
                    <span>${playButtonLabel}</span>
                  </button>
                ` : `
                  <button class="btn-primary" id="btn-resume-series">
                    <i data-lucide="play" style="fill: currentColor"></i>
                    <span>${playButtonLabel}</span>
                  </button>
                `}

                <button class="btn-secondary" id="btn-toggle-fav">
                  <i data-lucide="heart" style="${inFav ? 'fill: var(--primary); color: var(--primary)' : ''}"></i>
                  <span>${inFav ? 'Favorilerimde' : 'Favorilere Ekle'}</span>
                </button>

                <button class="btn-secondary" id="btn-toggle-watchlist">
                  <i data-lucide="${inWatch ? 'check' : 'plus'}"></i>
                  <span>${inWatch ? 'Listemde' : 'İzleme Listeme Ekle'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="section" style="padding-top: 2rem;">
        <div class="container">
          ${type === 'tv' && seasonSelectorObj ? seasonSelectorObj.html : ''}

          ${recommendations.length > 0 ? `
            <div style="margin-top: 4rem;">
              <h2 class="section-title" style="margin-bottom: 1.5rem;">
                <i data-lucide="thumbs-up"></i> Benzer Önerilen Yapımlar
              </h2>
              <div class="media-grid">
                ${recommendations.map(item => renderMediaCard(item)).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </section>
    </div>
  `;

  return {
    html,
    init: (container) => {
      if (!container) return;

      if (seasonSelectorObj) seasonSelectorObj.init(container);

      const playMovieBtn = container.querySelector('#btn-play-movie');
      if (playMovieBtn) {
        playMovieBtn.addEventListener('click', () => {
          const progress = getMediaProgress(id, 1, 1);
          openPlayerModal({
            type: 'movie',
            tmdbId: id,
            title: title,
            seriesTitle: title,
            originalTitle: originalTitle,
            posterPath: media.poster_path,
            backdropPath: media.backdrop_path,
            currentTime: progress ? progress.currentTime : 0
          });
        });
      }

      const resumeSeriesBtn = container.querySelector('#btn-resume-series');
      if (resumeSeriesBtn) {
        resumeSeriesBtn.addEventListener('click', () => {
          const lastWatched = getLastWatchedEpisode(id);
          const seasonNum = lastWatched ? lastWatched.season : 1;
          const episodeNum = lastWatched ? lastWatched.episode : 1;
          const currentTime = lastWatched ? lastWatched.currentTime : 0;

          openPlayerModal({
            type: 'tv',
            tmdbId: id,
            title: `${title} - S${seasonNum}E${episodeNum}`,
            seriesTitle: title,
            originalTitle: originalTitle,
            season: seasonNum,
            episode: episodeNum,
            posterPath: media.poster_path,
            backdropPath: media.backdrop_path,
            currentTime
          });
        });
      }

      const favBtn = container.querySelector('#btn-toggle-fav');
      if (favBtn) {
        favBtn.addEventListener('click', () => {
          const added = toggleFavorite(media);
          showToast(added ? 'Favorilere eklendi!' : 'Favorilerden çıkarıldı.', added ? 'success' : 'info');
          const icon = favBtn.querySelector('i');
          const text = favBtn.querySelector('span');
          if (icon && text) {
            icon.style.fill = added ? 'var(--primary)' : 'none';
            icon.style.color = added ? 'var(--primary)' : 'currentColor';
            text.textContent = added ? 'Favorilerimde' : 'Favorilere Ekle';
          }
        });
      }

      const watchBtn = container.querySelector('#btn-toggle-watchlist');
      if (watchBtn) {
        watchBtn.addEventListener('click', () => {
          const added = toggleWatchlist(media);
          showToast(added ? 'İzleme listesine eklendi!' : 'İzleme listesinden çıkarıldı.', added ? 'success' : 'info');
          const icon = watchBtn.querySelector('i');
          const text = watchBtn.querySelector('span');
          if (icon && text) {
            icon.setAttribute('data-lucide', added ? 'check' : 'plus');
            if (window.lucide) window.lucide.createIcons();
            text.textContent = added ? 'Listemde' : 'İzleme Listeme Ekle';
          }
        });
      }

      const recGrid = container.querySelector('.media-grid');
      if (recGrid) attachMediaCardEvents(recGrid);
    }
  };
}

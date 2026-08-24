/* ==========================================================================
   CinePulse Studio - Media Detail View
   Displays full TMDB metadata, backdrop banner, season/episode list or play movie button
   Supports seamless navigation for Movies, TV Shows, Anime, and Documentaries.
   Includes movie runtime, bulk series mark-watched, season selectors, and halfway in-progress states.
   ========================================================================== */

import { fetchMediaDetails, getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_ACTOR_FALLBACK, SINEFLIX_POSTER_FALLBACK } from '../services/tmdbApi.js';
import { isFavorite, toggleFavorite, isWatchlist, toggleWatchlist, getLastWatchedEpisode, getMediaProgress, formatSecondsToTime, isMediaWatched, toggleEpisodeWatched, markAllEpisodesWatched, isEntireSeriesWatched, setMediaHalfway } from '../services/storage.js';
import { renderSeasonSelector } from '../components/SeasonSelector.js';
import { renderMediaCard, attachMediaCardEvents } from '../components/MediaCard.js';
import { openPlayerModal } from '../components/PlayerModal.js';
import { showToast } from '../components/Toast.js';

function formatMediaRuntime(minutes) {
  if (!minutes || minutes <= 0) return '';
  const hrs = Math.floor(minutes / 60);
  const remMin = minutes % 60;
  if (hrs > 0) {
    return `${hrs} sa ${remMin > 0 ? remMin + ' dk' : ''} (${minutes} dk)`;
  }
  return `${minutes} dk`;
}

export async function renderDetailView(type = 'tv', id) {
  // Normalize type: Anime/Doc series are 'tv', Anime/Doc films are 'movie'
  let normalizedType = (type === 'movie') ? 'movie' : 'tv';
  let media = await fetchMediaDetails(normalizedType, id);
  if (!media) {
    // If not found with initial type, try the alternative type
    normalizedType = normalizedType === 'tv' ? 'movie' : 'tv';
    media = await fetchMediaDetails(normalizedType, id);
  }

  if (!media) {
    return {
      html: `<div class="container" style="padding: 10rem 0; text-align: center;"><h2>İçerik bulunamadı.</h2></div>`,
      init: () => {}
    };
  }

  const isSeries = !!(media.seasons && media.seasons.length > 0) || normalizedType === 'tv';
  const effectiveType = isSeries ? 'tv' : 'movie';

  const title = media.title || media.name || 'Detay';
  const originalTitle = media.original_title || media.original_name || '';
  const backdropUrl = getImageUrl(media.backdrop_path, TMDB_IMAGE_SIZES.BACKDROP_ORIGINAL);
  const posterUrl = getImageUrl(media.poster_path, TMDB_IMAGE_SIZES.POSTER_MEDIUM);
  const rating = media.vote_average ? media.vote_average.toFixed(1) : '8.5';
  const year = (media.first_air_date || media.release_date || '').substring(0, 4);
  const overview = media.overview || 'Bu yapım için henüz Türkçe özet bulunmuyor.';
  const genres = media.genres || [];
  const movieDurationSec = media.runtime ? (media.runtime * 60) : 6600;

  const inFav = isFavorite(id);
  const inWatch = isWatchlist(id);

  // Watch history progress for hero button
  const lastWatchedEp = effectiveType === 'tv' ? getLastWatchedEpisode(id) : null;
  const movieProgress = effectiveType === 'movie' ? getMediaProgress(id, 1, 1) : null;
  
  // Status flags
  const isMovieWatched = effectiveType === 'movie' ? isMediaWatched(id, 1, 1) : false;
  const isSeriesAllWatched = effectiveType === 'tv' ? isEntireSeriesWatched(id, media.seasons || []) : false;
  const isCurrentWatched = effectiveType === 'movie' ? isMovieWatched : isSeriesAllWatched;

  let playButtonLabel = effectiveType === 'movie' ? 'Filmi İzle' : '1. Sezon 1. Bölümü İzle';
  if (effectiveType === 'tv' && lastWatchedEp) {
    const timeStr = formatSecondsToTime(lastWatchedEp.currentTime);
    playButtonLabel = `Kaldığın Yerden Devam Et (S${lastWatchedEp.season} B${lastWatchedEp.episode}${timeStr ? ' • ' + timeStr : ''})`;
  } else if (effectiveType === 'movie' && movieProgress && movieProgress.currentTime > 0) {
    const timeStr = formatSecondsToTime(movieProgress.currentTime);
    playButtonLabel = `Kaldığın Yerden Devam Et (${timeStr})`;
  }

  // Cast list (max 7 actors)
  const castList = media.credits && media.credits.cast ? media.credits.cast.slice(0, 7) : [];

  let seasonSelectorObj = null;
  if (effectiveType === 'tv' && media.seasons) {
    seasonSelectorObj = await renderSeasonSelector({
      tvId: id,
      seriesTitle: title,
      originalTitle: originalTitle,
      seriesOverview: overview,
      seasons: media.seasons,
      posterPath: media.poster_path,
      backdropPath: media.backdrop_path
    });
  }

  const recommendations = media.recommendations ? media.recommendations.results.slice(0, 6) : [];

  const watchedBtnLabel = effectiveType === 'movie'
    ? (isMovieWatched ? 'Film İzlendi' : 'İzlendi Olarak İşaretle')
    : (isSeriesAllWatched ? 'Tüm Sezonlar İzlendi' : 'Tümünü İzlendi İşaretle');

  const runtimeBadgeHTML = media.runtime ? `
    <span class="badge" style="background: rgba(245, 158, 11, 0.18); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem;">
      <i data-lucide="clock" style="width:13px; height:13px"></i>
      <span>${formatMediaRuntime(media.runtime)}</span>
    </span>
  ` : '';

  const html = `
    <div class="detail-view">
      <div class="detail-hero-banner">
        <div class="detail-backdrop-img" style="background-image: url('${backdropUrl}')"></div>
        <div class="detail-backdrop-gradient"></div>

        <div class="detail-container">
          <button class="detail-back-btn" id="btn-detail-back" title="Önceki Sayfaya Geri Dön">
            <i data-lucide="arrow-left"></i>
            <span>Geri Dön</span>
          </button>
          <div class="detail-layout">
            <!-- Poster Card -->
            <div class="detail-poster-col">
              <img class="detail-poster-img" src="${posterUrl}" alt="${title}" onerror="this.onerror=null; this.src='${SINEFLIX_POSTER_FALLBACK}';" />
            </div>

            <!-- Content Details -->
            <div class="detail-info-col">
              <div class="detail-badge-deck">
                <span class="badge badge-primary">${effectiveType === 'tv' ? 'DİZİ / SERİ' : 'FİLM'}</span>
                <span class="badge badge-rating">
                  <i data-lucide="star" style="width:14px; height:14px; fill: currentColor"></i> ${rating} IMDb
                </span>
                <span class="badge">${year}</span>
                ${runtimeBadgeHTML}
                ${media.number_of_seasons ? `<span class="badge">${media.number_of_seasons} Sezon</span>` : ''}
                ${media.number_of_episodes ? `<span class="badge">${media.number_of_episodes} Bölüm</span>` : ''}
                ${!media.runtime && media.episode_run_time && media.episode_run_time.length > 0 ? `<span class="badge">${media.episode_run_time[0]} dk / bölüm</span>` : ''}
              </div>

              <h1 class="detail-heading-title">${title}</h1>
              ${originalTitle && originalTitle !== title ? `<div class="detail-orig-title">${originalTitle}</div>` : ''}

              <div class="detail-genre-row">
                ${genres.map(g => `<span class="detail-genre-chip">${g.name}</span>`).join('')}
              </div>

              <div class="detail-storyline-wrapper">
                <p class="detail-storyline truncated" id="detail-storyline-text">${overview}</p>
                ${overview.length > 120 ? '<button class="btn-storyline-expand" id="btn-expand-storyline"><span>Devamını Oku</span><i data-lucide="chevron-down" style="width:14px;height:14px"></i></button>' : ''}
              </div>

              <!-- Oyuncular (Horizontal Smooth Carousel) -->
              ${castList.length > 0 ? `
                <div class="detail-cast-block">
                  <div class="detail-cast-label">Oyuncular</div>
                  <div class="detail-cast-rail">
                    ${castList.map(actor => {
                      const actorPic = actor.profile_path ? getImageUrl(actor.profile_path, TMDB_IMAGE_SIZES.POSTER_SMALL) : SINEFLIX_ACTOR_FALLBACK;
                      return `
                        <div class="detail-actor-pill">
                          <img src="${actorPic}" alt="${actor.name}" class="detail-actor-avatar" onerror="this.onerror=null; this.src='${SINEFLIX_ACTOR_FALLBACK}';" />
                          <span class="detail-actor-name">${actor.name}</span>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Modern Hero Action Deck -->
              <div class="detail-action-deck">
                ${effectiveType === 'movie' ? `
                  <button class="btn-play-primary" id="btn-play-movie">
                    <i data-lucide="play" style="fill: currentColor; width: 22px; height: 22px;"></i>
                    <span>${playButtonLabel}</span>
                  </button>
                ` : `
                  <button class="btn-play-primary" id="btn-resume-series">
                    <i data-lucide="play" style="fill: currentColor; width: 22px; height: 22px;"></i>
                    <span>${playButtonLabel}</span>
                  </button>
                `}

                <!-- Compact Quick Action Tiles Grid -->
                <div class="detail-action-subgrid">
                  <button class="btn-action-tile ${inFav ? 'active-fav' : ''}" id="btn-toggle-fav">
                    <i data-lucide="heart" style="${inFav ? 'fill: var(--primary); color: var(--primary)' : ''}"></i>
                    <span>${inFav ? 'Favorilerimde' : 'Favori'}</span>
                  </button>

                  <button class="btn-action-tile ${inWatch ? 'active-watch' : ''}" id="btn-toggle-watchlist">
                    <i data-lucide="${inWatch ? 'check' : 'plus'}"></i>
                    <span>${inWatch ? 'Listemde' : 'Listem'}</span>
                  </button>

                  <button class="btn-action-tile ${isCurrentWatched ? 'active-watched' : ''}" id="btn-toggle-watched-detail">
                    <i data-lucide="${isCurrentWatched ? 'check-circle-2' : 'check'}"></i>
                    <span>${watchedBtnLabel}</span>
                  </button>

                  <button class="btn-action-tile" id="btn-mark-halfway-detail" title="Kaldığım Yer (Yarıda Bırakıldı)">
                    <i data-lucide="clock" style="color: #fbbf24;"></i>
                    <span>⏳ Yarıda Bırak</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="section" style="padding-top: 2rem;">
        <div class="container">
          ${effectiveType === 'tv' && seasonSelectorObj ? seasonSelectorObj.html : ''}

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

      const backBtn = container.querySelector('#btn-detail-back');
      if (backBtn) {
        backBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.hash = '#home';
          }
        });
      }

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
            duration: movieDurationSec,
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
            currentTime,
            seasonsList: media.seasons || []
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

      // Mark Watched Detail Action
      const watchedDetailBtn = container.querySelector('#btn-toggle-watched-detail');
      if (watchedDetailBtn) {
        watchedDetailBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (effectiveType === 'movie') {
            const updated = toggleEpisodeWatched(id, 1, 1, {
              title: title,
              posterPath: media.poster_path,
              backdropPath: media.backdrop_path,
              type: 'movie',
              duration: movieDurationSec
            });
            const nowWatched = updated.completed;
            showToast(nowWatched ? '✓ Film izlendi olarak işaretlendi!' : 'Film izlendi işareti kaldırıldı.', nowWatched ? 'success' : 'info');
            
            if (nowWatched) {
              watchedDetailBtn.classList.add('btn-watched-active');
            } else {
              watchedDetailBtn.classList.remove('btn-watched-active');
            }
            watchedDetailBtn.innerHTML = `
              <i data-lucide="${nowWatched ? 'check-circle-2' : 'check'}"></i>
              <span>${nowWatched ? 'Film İzlendi' : 'İzlendi Olarak İşaretle'}</span>
            `;
            if (window.lucide) window.lucide.createIcons();
          } else {
            // TV / Anime / Doc Series Bulk Watched
            const currentAllWatched = isEntireSeriesWatched(id, media.seasons || []);
            const targetState = !currentAllWatched;

            markAllEpisodesWatched(id, media.seasons || [], targetState, {
              title: title,
              posterPath: media.poster_path,
              backdropPath: media.backdrop_path,
              type: 'tv'
            });

            showToast(targetState ? '✓ Dizinin tüm bölümleri izlendi olarak işaretlendi!' : 'Tüm bölümler izlenmedi yapıldı.', targetState ? 'success' : 'info');

            if (targetState) {
              watchedDetailBtn.classList.add('btn-watched-active');
            } else {
              watchedDetailBtn.classList.remove('btn-watched-active');
            }
            watchedDetailBtn.innerHTML = `
              <i data-lucide="${targetState ? 'check-circle-2' : 'check'}"></i>
              <span>${targetState ? 'Tüm Sezonlar İzlendi' : 'Tümünü İzlendi İşaretle'}</span>
            `;
            if (window.lucide) window.lucide.createIcons();

            // Update all episode cards in DOM
            container.querySelectorAll('.episode-card').forEach(card => {
              const badgeEl = card.querySelector('.badge-watched-status');
              const btnEl = card.querySelector('.btn-mark-ep-watched');
              if (badgeEl) {
                badgeEl.innerHTML = `<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ`;
                badgeEl.style.background = 'var(--accent-green)';
                badgeEl.style.color = '#fff';
                badgeEl.style.display = targetState ? 'inline-flex' : 'none';
              }
              if (btnEl) {
                if (targetState) {
                  btnEl.classList.add('watched');
                  btnEl.style.background = '#10b981';
                  btnEl.style.borderColor = '#10b981';
                } else {
                  btnEl.classList.remove('watched');
                  btnEl.style.background = 'rgba(0,0,0,0.65)';
                  btnEl.style.borderColor = 'rgba(255,255,255,0.3)';
                }
              }
            });
            if (window.lucide) window.lucide.createIcons();
          }
        });
      }

      // Halfway in-progress button handler
      const halfwayBtn = container.querySelector('#btn-mark-halfway-detail');
      if (halfwayBtn) {
        halfwayBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (effectiveType === 'movie') {
            const halfwayTime = Math.round(movieDurationSec * 0.5);
            const timeStr = formatSecondsToTime(halfwayTime);
            setMediaHalfway(id, 1, 1, halfwayTime, {
              title: title,
              posterPath: media.poster_path,
              backdropPath: media.backdrop_path,
              type: 'movie',
              duration: movieDurationSec
            });
            showToast(`⏳ Film ${timeStr} dakikasında yarıda bırakıldı olarak işaretlendi!`, 'info');
            const playBtnSpan = container.querySelector('#btn-play-movie span');
            if (playBtnSpan) playBtnSpan.textContent = `Kaldığın Yerden Devam Et (${timeStr})`;
          } else {
            const seasonNum = lastWatchedEp ? lastWatchedEp.season : 1;
            const epNum = lastWatchedEp ? lastWatchedEp.episode : 1;
            setMediaHalfway(id, seasonNum, epNum, 1200, {
              title: title,
              posterPath: media.poster_path,
              backdropPath: media.backdrop_path,
              type: 'tv',
              duration: 3000
            });
            showToast(`⏳ S${seasonNum} B${epNum} 20. dakikada yarıda bırakıldı olarak işaretlendi!`, 'info');
            const resumeBtnSpan = container.querySelector('#btn-resume-series span');
            if (resumeBtnSpan) resumeBtnSpan.textContent = `Kaldığın Yerden Devam Et (S${seasonNum} B${epNum} • 20:00)`;
          }
        });
      }

      // Storyline expand/collapse
      const expandBtn = container.querySelector('#btn-expand-storyline');
      const storylineEl = container.querySelector('#detail-storyline-text');
      if (expandBtn && storylineEl) {
        expandBtn.addEventListener('click', () => {
          const isExpanded = !storylineEl.classList.contains('truncated');
          storylineEl.classList.toggle('truncated');
          const span = expandBtn.querySelector('span');
          const icon = expandBtn.querySelector('i');
          if (span) span.textContent = isExpanded ? 'Devamını Oku' : 'Daralt';
          if (icon) icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        });
      }

      const recGrid = container.querySelector('.media-grid');
      if (recGrid) attachMediaCardEvents(recGrid);
    }
  };
}

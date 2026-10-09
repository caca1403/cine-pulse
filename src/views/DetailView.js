import { renderIcons } from '../services/icons.js';
/* ==========================================================================
   CinePulse Studio - Media Detail View
   Displays full TMDB metadata, backdrop banner, season/episode list or play movie button
   Supports seamless navigation for Movies, TV Shows, Anime, and Documentaries.
   Includes movie runtime, bulk series mark-watched, season selectors, and halfway in-progress states.
   ========================================================================== */

import { fetchMediaDetails, getImageUrl, TMDB_IMAGE_SIZES, SINEFLIX_ACTOR_FALLBACK, SINEFLIX_POSTER_FALLBACK, generateCinematicOverview } from '../services/tmdbApi.js';
import { isFavorite, toggleFavorite, isWatchlist, toggleWatchlist, getLastWatchedEpisode, getMediaProgress, formatSecondsToTime, isMediaWatched, toggleEpisodeWatched, markAllEpisodesWatched, isEntireSeriesWatched, setMediaHalfway, registerAnimeId, isRegisteredAnimeId } from '../services/storage.js';
import { renderSeasonSelector } from '../components/SeasonSelector.js';
import { renderMediaCard, attachMediaCardEvents, isAnimeItem } from '../components/MediaCard.js';
import { openPlayerModal } from '../components/openPlayer.js';
import { openCastExplorerModal } from '../components/CastExplorerModal.js';
import { showToast } from '../components/Toast.js';
import { getNextEpisodeInfo } from '../services/tvmazeService.js';

const DECISION_ROOM_AUTOPLAY_KEY = 'cinepulse.decision-room.autoplay';

function consumeDecisionRoomAutoplay(type, id) {
  try {
    const pending = JSON.parse(sessionStorage.getItem(DECISION_ROOM_AUTOPLAY_KEY) || 'null');
    sessionStorage.removeItem(DECISION_ROOM_AUTOPLAY_KEY);
    return (
      pending
      && String(pending.id) === String(id)
      && pending.type === type
      && Date.now() - Number(pending.createdAt || 0) < 15000
    ) ? pending : null;
  } catch (_) {
    return null;
  }
}

function formatMediaRuntime(minutes) {
  if (!minutes || minutes <= 0) return '';
  const hrs = Math.floor(minutes / 60);
  const remMin = minutes % 60;
  if (hrs > 0) {
    return `${hrs} sa ${remMin > 0 ? remMin + ' dk' : ''} (${minutes} dk)`;
  }
  return `${minutes} dk`;
}

export async function renderDetailView(typeOrObj = 'tv', maybeId) {
  const type = (typeof typeOrObj === 'object' && typeOrObj !== null) ? (typeOrObj.type || 'tv') : (typeOrObj || 'tv');
  const id = (typeof typeOrObj === 'object' && typeOrObj !== null) ? typeOrObj.id : maybeId;
  let normalizedType = (type === 'series' || type === 'tv' || type === 'anime') ? 'tv' : ((type === 'movie') ? 'movie' : 'tv');
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
  const isAnime = isAnimeItem(media) || type === 'anime' || normalizedType === 'anime' || isRegisteredAnimeId(id);
  if (isAnime) registerAnimeId(id);

  const title = media.title || media.name || 'Detay';
  const originalTitle = media.original_title || media.original_name || '';
  const backdropUrl = getImageUrl(media.backdrop_path, TMDB_IMAGE_SIZES.BACKDROP_ORIGINAL);
  const posterUrl = getImageUrl(media.poster_path, TMDB_IMAGE_SIZES.POSTER_MEDIUM);
  const rating = media.vote_average ? media.vote_average.toFixed(1) : '8.5';
  const year = (media.first_air_date || media.release_date || '').substring(0, 4);
  const overview = (media.overview && media.overview.trim().length > 15) ? media.overview : generateCinematicOverview(media, effectiveType);
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
    playButtonLabel = `Devam Et <span class="play-btn-subinfo">S${lastWatchedEp.season} B${lastWatchedEp.episode}${timeStr ? ' • ' + timeStr : ''}</span>`;
  } else if (effectiveType === 'movie' && movieProgress && movieProgress.currentTime > 0) {
    const timeStr = formatSecondsToTime(movieProgress.currentTime);
    playButtonLabel = `Devam Et <span class="play-btn-subinfo">${timeStr}</span>`;
  }

  // Director & Creator details (Pentagram / MUBI Editorial Standard)
  const directors = media.credits?.crew ? media.credits.crew.filter(c => c.job === 'Director').map(d => d.name) : [];
  const creators = media.created_by ? media.created_by.map(c => c.name) : [];
  const directorName = directors.length > 0 ? directors.slice(0, 2).join(', ') : (creators.length > 0 ? creators.slice(0, 2).join(', ') : '');

  // Letterboxd 5-Star score calculation
  const starScore = (parseFloat(rating) / 2).toFixed(1);
  const starCount = Math.floor(starScore);
  const hasHalf = (starScore % 1) >= 0.4;
  const letterboxdStars = '★'.repeat(Math.min(5, starCount)) + (hasHalf && starCount < 5 ? '½' : '');

  // Full Cast list (up to 24 actors for dedicated cast tab)
  const fullCastList = media.credits && media.credits.cast ? media.credits.cast.slice(0, 24) : [];

  let seasonSelectorObj = null;
  let spoilerFreeEnabled = false;
  if (effectiveType === 'tv' && media.seasons) {
    seasonSelectorObj = await renderSeasonSelector({
      tvId: id,
      seriesTitle: title,
      originalTitle: originalTitle,
      seriesOverview: overview,
      seasons: media.seasons,
      posterPath: media.poster_path,
      backdropPath: media.backdrop_path,
      isAnime,
      spoilerFree: spoilerFreeEnabled
    });
  }

  const recommendations = media.recommendations ? media.recommendations.results.slice(0, 6) : [];

  const watchedBtnLabel = effectiveType === 'movie'
    ? (isMovieWatched ? 'Film İzlendi' : 'İzlendi Olarak İşaretle')
    : (isSeriesAllWatched ? 'Tüm Sezonlar İzlendi' : 'Tümünü İzlendi İşaretle');

  const runtimeMetaHTML = media.runtime ? `
    <span>${formatMediaRuntime(media.runtime)}</span>
  ` : '';

  const heroTypeLabel = isAnime
    ? (isSeries ? 'ANİME DİZİSİ' : 'ANİME FİLMİ')
    : (effectiveType === 'tv' ? 'DİZİ' : 'FİLM');

  // Extract YouTube trailers for the Netflix-style trailers preview strip (Image 2)
  const allVideos = (media.videos?.results || []).filter(v => v.site === 'YouTube');
  allVideos.sort((a, b) => {
    const typeOrder = { 'Trailer': 1, 'Teaser': 2, 'Clip': 3, 'Behind the Scenes': 4 };
    return (typeOrder[a.type] || 9) - (typeOrder[b.type] || 9);
  });
  const heroTrailers = allVideos.filter((video, index, videos) => video.key && videos.findIndex(item => item.key === video.key) === index).slice(0, 12);
  const trailerSearches = [
    { label: 'Resmi fragman ara', query: `${originalTitle || title} official trailer` },
    { label: 'Türkçe fragman ara', query: `${title} Türkçe fragman` },
    { label: 'Tanıtım ve teaser ara', query: `${originalTitle || title} official teaser` },
    { label: 'Klipleri ara', query: `${originalTitle || title} official clip` }
  ].slice(0, Math.max(0, 4 - heroTrailers.length));

  const html = `
    <div class="detail-view">
      <div class="detail-hero-banner">
        <div class="detail-backdrop-img" style="background-image: url('${backdropUrl}')"></div>
        <div class="detail-backdrop-gradient"></div>

        <div class="detail-container">
          <!-- Top Back Action -->
          <button class="detail-back-btn" id="btn-detail-back" title="Önceki Sayfaya Geri Dön">
            <i data-lucide="arrow-left" style="width:16px;height:16px;"></i>
            <span>Geri Dön</span>
          </button>
          
          <div class="detail-hero-content">
            <!-- Left/Center Primary Info Column (Netflix Mulan Layout) -->
            <div class="detail-info-col">
              
              <!-- Giant Cinematic Title (Image 2 Mulan style) -->
              <h1 class="detail-heading-title">${title}</h1>

              <!-- Editorial Subtitle (Original Title & Creator / Director) -->
              <div class="detail-editorial-sub">
                ${originalTitle && originalTitle !== title ? `<span class="detail-orig-name">${originalTitle}</span>` : ''}
                ${directorName ? `
                  <span class="detail-director-pill">
                    <strong style="color: var(--primary);">${effectiveType === 'tv' ? 'YARATICI' : 'YÖNETMEN'}:</strong> ${directorName}
                  </span>
                ` : ''}
              </div>

              <!-- Rich Storyline / Overview (Longer, comfortable breathing room, no premature clamp) -->
              <div class="detail-storyline-wrapper">
                <p class="detail-storyline ${overview.length > 550 ? 'truncated' : ''}" id="detail-storyline-text">${overview}</p>
                ${overview.length > 550 ? '<button class="btn-storyline-expand" id="btn-expand-storyline"><span>Devamını Oku</span><i data-lucide="chevron-down" style="width:14px;height:14px"></i></button>' : ''}
              </div>

              <!-- Clean Metadata Line (Directly under story, matching Netflix Mulan) -->
              <div class="detail-meta-line">
                <span class="detail-meta-rating">
                  <i data-lucide="star" style="width:14px; height:14px; fill: #dfff76; color: #dfff76;"></i> ${rating}
                </span>
                <span>${year}</span>
                ${genres.length > 0 ? `<span>${genres.slice(0, 3).map(g => g.name).join(' • ')}</span>` : ''}
                ${runtimeMetaHTML}
                ${media.number_of_seasons ? `<span>${media.number_of_seasons} Sezon</span>` : ''}
                ${media.number_of_episodes ? `<span>${media.number_of_episodes} Bölüm</span>` : ''}
                <span class="detail-meta-type">${heroTypeLabel}</span>
              </div>

              <!-- Hero Actions (Play + Secondary Options) -->
              <div class="detail-action-deck">
                <div class="detail-action-main-row">
                  ${effectiveType === 'movie' ? `
                    <button class="btn-play-primary" id="btn-play-movie">
                      <i data-lucide="play" style="fill: currentColor; width: 20px; height: 20px;"></i>
                      <span>${playButtonLabel}</span>
                    </button>
                  ` : `
                    <button class="btn-play-primary" id="btn-resume-series">
                      <i data-lucide="play" style="fill: currentColor; width: 20px; height: 20px;"></i>
                      <span>${playButtonLabel}</span>
                    </button>
                  `}

                  <button class="btn-action-tile ${inWatch ? 'active-watch' : ''}" id="btn-toggle-watchlist">
                    <i data-lucide="${inWatch ? 'check' : 'plus'}"></i>
                    <span>${inWatch ? 'Listemde' : 'Listem'}</span>
                  </button>

                  <button class="btn-action-tile ${inFav ? 'active-fav' : ''}" id="btn-toggle-fav">
                    <i data-lucide="heart" style="${inFav ? 'fill: var(--primary); color: var(--primary)' : ''}"></i>
                    <span>${inFav ? 'Favorilerimde' : 'Favori'}</span>
                  </button>

                  <button class="btn-action-tile ${isCurrentWatched ? 'active-watched' : ''}" id="btn-toggle-watched-detail">
                    <i data-lucide="${isCurrentWatched ? 'check-circle-2' : 'check'}"></i>
                    <span>${watchedBtnLabel}</span>
                  </button>

                  <button class="btn-action-tile" id="btn-mark-halfway-detail" title="Kaldığım Yer">
                    <i data-lucide="clock" style="color: #dfff76;"></i>
                    <span>Yarıda Bırak</span>
                  </button>
                </div>

                ${effectiveType === 'tv' ? `
                  <div class="detail-spoiler-inline-row">
                    <label class="spoiler-discovery-pill">
                      <input id="detail-spoiler-free-toggle" type="checkbox" />
                      <i data-lucide="shield-check"></i>
                      <span>Spoilersız Keşfet</span>
                    </label>
                  </div>
                ` : ''}
              </div>

              ${(heroTrailers.length > 0 || trailerSearches.length > 0) ? `
                <a class="detail-trailer-link" id="btn-watch-trailer" href="#tab-pane-trailers">
                  <i data-lucide="play-circle" style="width: 15px; height: 15px;"></i>
                  Fragmanlara göz at <span aria-hidden="true">↗</span>
                </a>
              ` : ''}

            </div>

          </div>
        </div>
      </div>

      <!-- Netflix Sub-Navigation Tabs Bar (Images 3 & 4) -->
      <div class="netflix-detail-tabs-bar">
        <div class="container">
          <div class="netflix-tabs-track">
            ${effectiveType === 'tv' && seasonSelectorObj ? `
              <button class="netflix-tab-btn active" data-tab="episodes">
                <span>BÖLÜMLER</span>
              </button>
            ` : ''}

            <button class="netflix-tab-btn ${effectiveType === 'movie' ? 'active' : ''}" data-tab="cast">
              <span>OYUNCULAR</span>
            </button>

            <button class="netflix-tab-btn" data-tab="overview">
              <span>GENEL BAKIŞ</span>
            </button>

            <button class="netflix-tab-btn" data-tab="trailers">
              <span>FRAGMANLAR</span>
            </button>

            ${recommendations.length > 0 ? `
              <button class="netflix-tab-btn" data-tab="recommendations">
                <span>BENZERLERİ</span>
              </button>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Netflix Tab Content Panes -->
      <div class="netflix-tab-content-area">
        <div class="container">

          ${effectiveType === 'tv' && seasonSelectorObj ? `
            <!-- Tab Pane: Episodes (Image 3) -->
            <div class="netflix-tab-pane active" id="tab-pane-episodes">
              ${seasonSelectorObj.html}
            </div>
          ` : ''}

          <!-- Tab Pane: Dedicated Cast Grid (Image 4) -->
          <div class="netflix-tab-pane ${effectiveType === 'movie' ? 'active' : ''}" id="tab-pane-cast">
            <div class="netflix-pane-header">
              <div class="netflix-pane-title-group">
                <h2 class="netflix-pane-title">
                  <i data-lucide="users" style="color: #dfff76; width: 20px; height: 20px;"></i>
                  <span>Oyuncu Kadrosu & Karakterler</span>
                </h2>
                <p class="netflix-pane-subtitle">Karakteri canlandıran oyuncular ve filmografileri</p>
              </div>
              <span class="netflix-pane-count-pill">${fullCastList.length} Oyuncu</span>
            </div>

            ${fullCastList.length > 0 ? `
              <div class="netflix-cast-grid">
                ${fullCastList.map((actor, idx) => {
                  const actorPic = actor.profile_path ? getImageUrl(actor.profile_path, TMDB_IMAGE_SIZES.POSTER_MEDIUM) : SINEFLIX_ACTOR_FALLBACK;
                  const character = actor.character ? actor.character.split('/')[0].trim() : '';
                  const score = ((actor.popularity ? Math.min(9.9, Math.max(6.5, (actor.popularity / 3.5) + 6.0)) : 8.5)).toFixed(1);
                  const isExtra = idx >= 12;
                  return `
                    <div class="netflix-cast-card ${isExtra ? 'cast-card-hidden' : ''}" data-person-id="${actor.id}" data-person-name="${actor.name}" title="${actor.name}${character ? ' (' + character + ')' : ''} • Filmografiyi Gör">
                      <div class="netflix-cast-photo-wrap">
                        <img src="${actorPic}" alt="${actor.name}" loading="lazy" onerror="this.onerror=null; this.src='${SINEFLIX_ACTOR_FALLBACK}';" />
                        <div class="netflix-cast-card-hover">
                          <i data-lucide="sparkles" style="width:20px;height:20px;color:#fff;"></i>
                          <span>Filmografi</span>
                        </div>
                      </div>
                      <div class="netflix-cast-info">
                        <h4 class="netflix-cast-name">${actor.name}</h4>
                        ${character ? `<p class="netflix-cast-character">As ${character}</p>` : ''}
                        <div class="netflix-cast-rating">
                          <i data-lucide="star" style="width:11px;height:11px;fill:#dfff76;stroke:#dfff76;"></i>
                          <span>${score} / 10</span>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>

              ${fullCastList.length > 12 ? `
                <div style="text-align: center; margin: 2.5rem 0 1rem;">
                  <button class="btn-netflix-show-more" id="btn-show-more-cast">
                    <span>Tüm Oyuncuları Göster (${fullCastList.length})</span>
                    <i data-lucide="chevron-down" style="width:16px;height:16px;"></i>
                  </button>
                </div>
              ` : ''}
            ` : `
              <div class="netflix-empty-tab-state">
                <i data-lucide="user-x" style="width:40px;height:40px;color:#666;"></i>
                <p>Bu yapım için oyuncu bilgisi bulunamadı.</p>
              </div>
            `}
          </div>

          <!-- Tab Pane: Overview & Technical Details -->
          <div class="netflix-tab-pane" id="tab-pane-overview">
            <div class="netflix-overview-pane-grid">
              <div class="netflix-overview-main-col">
                <h3 class="netflix-subheading">Özet & Hikaye</h3>
                <p class="netflix-full-overview">${overview || 'Bu içerik için henüz özet eklenmedi.'}</p>
              </div>

              <div class="netflix-overview-specs-col">
                <h3 class="netflix-subheading">Teknik Detaylar</h3>
                <div class="netflix-specs-table">
                  ${originalTitle ? `
                    <div class="spec-row">
                      <span class="spec-label">Orijinal Başlık</span>
                      <span class="spec-val">${originalTitle}</span>
                    </div>
                  ` : ''}
                  ${directorName ? `
                    <div class="spec-row">
                      <span class="spec-label">${effectiveType === 'tv' ? 'Yaratıcı' : 'Yönetmen'}</span>
                      <span class="spec-val">${directorName}</span>
                    </div>
                  ` : ''}
                  ${media.release_date || media.first_air_date ? `
                    <div class="spec-row">
                      <span class="spec-label">Yayın Tarihi</span>
                      <span class="spec-val">${media.release_date || media.first_air_date}</span>
                    </div>
                  ` : ''}
                  ${media.status ? `
                    <div class="spec-row">
                      <span class="spec-label">Yayın Durumu</span>
                      <span class="spec-val">${media.status}</span>
                    </div>
                  ` : ''}
                  ${media.runtime ? `
                    <div class="spec-row">
                      <span class="spec-label">Film Süresi</span>
                      <span class="spec-val">${formatMediaRuntime(media.runtime)}</span>
                    </div>
                  ` : ''}
                  ${media.number_of_seasons ? `
                    <div class="spec-row">
                      <span class="spec-label">Toplam Sezon</span>
                      <span class="spec-val">${media.number_of_seasons} Sezon</span>
                    </div>
                  ` : ''}
                  ${media.number_of_episodes ? `
                    <div class="spec-row">
                      <span class="spec-label">Toplam Bölüm</span>
                      <span class="spec-val">${media.number_of_episodes} Bölüm</span>
                    </div>
                  ` : ''}
                  <div class="spec-row">
                    <span class="spec-label">IMDb Puanı</span>
                    <span class="spec-val" style="color: #dfff76; font-weight: 750;">★ ${rating} / 10</span>
                  </div>
                  <div class="spec-row">
                    <span class="spec-label">Letterboxd</span>
                    <span class="spec-val" style="color: #00e054; font-weight: 750;">${letterboxdStars} (${starScore})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab Pane: Trailers & Clips -->
          <div class="netflix-tab-pane" id="tab-pane-trailers">
            <div class="netflix-pane-header">
              <div class="netflix-pane-title-group">
                <h2 class="netflix-pane-title">
                  <i data-lucide="youtube" style="color: #dfff76; width: 20px; height: 20px;"></i>
                  <span>Resmi Fragmanlar & Klipler</span>
                </h2>
                <p class="netflix-pane-subtitle">Resmi Türkçe ve orijinal tanıtım fragmanları</p>
              </div>
            </div>

            <div class="netflix-trailers-showcase">
              ${heroTrailers.map((t, idx) => `
                <div class="hero-trailer-expand-card netflix-pane-trailer-card" data-video-key="${t.key}" data-video-title="${t.name || ('Fragman ' + (idx + 1))}" data-video-type="${t.type || 'Fragman'}">
                  <div class="trailer-compact-view">
                    <img src="https://img.youtube.com/vi/${t.key}/mqdefault.jpg" alt="${t.name || 'Trailer'}" loading="lazy" />
                    <div class="trailer-thumb-overlay">
                      <div class="trailer-play-chip">
                        <i data-lucide="play" style="width: 14px; height: 14px; fill: currentColor;"></i>
                      </div>
                      <span class="trailer-compact-name">${t.name || ('Fragman ' + (idx + 1))}</span>
                    </div>
                  </div>
                  <div class="trailer-expanded-view">
                    <div class="trailer-expanded-player"></div>
                    <div class="trailer-expanded-info">
                      <div class="trailer-expanded-header">
                        <span class="trailer-expanded-tag">${t.type || 'RESMİ FRAGMAN'}</span>
                        <button class="trailer-expanded-close" title="Fragmanı kapat" aria-label="Fragmanı kapat" type="button">
                          <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                        </button>
                      </div>
                      <h4 class="trailer-expanded-title">${t.name || `${title} Fragman`}</h4>
                      <div class="trailer-expanded-meta">
                        <span>HD 1080p</span>
                        <span>•</span>
                        <span>YouTube</span>
                      </div>
                      <p class="trailer-expanded-desc">${(overview || '').substring(0, 110)}...</p>
                    </div>
                  </div>
                </div>
              `).join('')}
              ${trailerSearches.map(search => `
                <a class="trailer-search-card" href="https://www.youtube.com/results?search_query=${encodeURIComponent(search.query)}" target="_blank" rel="noopener noreferrer" aria-label="${search.label}: YouTube'da aç">
                  <i data-lucide="search" aria-hidden="true"></i>
                  <span>${search.label}</span>
                  <small>YouTube'da aç ↗</small>
                </a>
              `).join('')}
            </div>
          </div>

          ${recommendations.length > 0 ? `
            <!-- Tab Pane: More Like This (Image 3 / 4) -->
            <div class="netflix-tab-pane" id="tab-pane-recommendations">
              <div class="netflix-pane-header">
                <div class="netflix-pane-title-group">
                  <h2 class="netflix-pane-title">
                    <i data-lucide="thumbs-up" style="color: #dfff76; width: 20px; height: 20px;"></i>
                    <span>Benzer Önerilen Yapımlar</span>
                  </h2>
                  <p class="netflix-pane-subtitle">Bu yapımı seven izleyicilerin en çok beğendiği diğer içerikler</p>
                </div>
              </div>
              <div class="media-grid">
                ${recommendations.map(item => renderMediaCard(item)).join('')}
              </div>
            </div>
          ` : ''}

        </div>
      </div>
    </div>
  `;

  return {
    html,
    init: (container) => {
      if (!container) return;
      let decisionRoomAutoplay = consumeDecisionRoomAutoplay(effectiveType, id);

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
      const spoilerToggle = container.querySelector('#detail-spoiler-free-toggle');
      if (spoilerToggle) {
        spoilerToggle.checked = spoilerFreeEnabled;
        spoilerToggle.addEventListener('change', () => {
          spoilerFreeEnabled = spoilerToggle.checked;
          seasonSelectorObj?.setSpoilerSafe(spoilerFreeEnabled);
          showToast(spoilerFreeEnabled ? 'Spoilersız keşif açıldı. Sonraki bölüm detayları gizlendi.' : 'Spoilersız keşif kapatıldı.', 'info');
        });
      }

      const playMovieBtn = container.querySelector('#btn-play-movie');
      const openMovie = async () => {
        if (!playMovieBtn || playMovieBtn.disabled) return;
          playMovieBtn.disabled = true;
          const origHTML = playMovieBtn.innerHTML;
          playMovieBtn.innerHTML = `<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>`;
          renderIcons();
          try {
            const progress = getMediaProgress(id, 1, 1);
            await openPlayerModal({
              type: isAnime ? 'anime' : 'movie',
              isAnime,
              tmdbId: id,
              title: title,
              seriesTitle: title,
              originalTitle: originalTitle,
              posterPath: media.poster_path,
              backdropPath: media.backdrop_path,
              duration: movieDurationSec,
              currentTime: progress ? progress.currentTime : 0,
              roomSync: decisionRoomAutoplay ? { roomCode: decisionRoomAutoplay.roomCode, mediaId: id, type: effectiveType, season: 1, episode: 1, initialSync: decisionRoomAutoplay.initialSync || null } : null
            });
          } catch (err) {
            console.error('[CinePulse] Film oynatılamadı:', err);
            showToast('Film açılırken hata oluştu, lütfen tekrar deneyin.', 'error');
          } finally {
            playMovieBtn.disabled = false;
            playMovieBtn.innerHTML = origHTML;
            renderIcons();
          }
      };
      if (playMovieBtn) {
        playMovieBtn.addEventListener('click', openMovie);
      }

      const resumeSeriesBtn = container.querySelector('#btn-resume-series');
      const openSeries = async () => {
        if (!resumeSeriesBtn || resumeSeriesBtn.disabled) return;
          resumeSeriesBtn.disabled = true;
          const origHTML = resumeSeriesBtn.innerHTML;
          resumeSeriesBtn.innerHTML = `<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>`;
          renderIcons();
          try {
            const selectedByRoom = decisionRoomAutoplay;
            decisionRoomAutoplay = null;
            const lastWatched = getLastWatchedEpisode(id);
            const seasonNum = selectedByRoom?.season || (lastWatched ? lastWatched.season : 1);
            const episodeNum = selectedByRoom?.episode || (lastWatched ? lastWatched.episode : 1);
            const currentTime = selectedByRoom ? 0 : (lastWatched ? lastWatched.currentTime : 0);
            await openPlayerModal({
              type: isAnime ? 'anime' : 'tv',
              isAnime,
              tmdbId: id,
              title: `${title} - S${seasonNum}E${episodeNum}`,
              seriesTitle: title,
              originalTitle: originalTitle,
              season: seasonNum,
              episode: episodeNum,
              posterPath: media.poster_path,
              backdropPath: media.backdrop_path,
              currentTime,
              seasonsList: media.seasons || [],
              roomSync: selectedByRoom ? { roomCode: selectedByRoom.roomCode, mediaId: id, type: effectiveType, season: seasonNum, episode: episodeNum, initialSync: selectedByRoom.initialSync || null } : null
            });
          } catch (err) {
            console.error('[CinePulse] Dizi oynatılamadı:', err);
            showToast('İçerik açılırken hata oluştu, lütfen tekrar deneyin.', 'error');
          } finally {
            resumeSeriesBtn.disabled = false;
            resumeSeriesBtn.innerHTML = origHTML;
            renderIcons();
          }
      };
      if (resumeSeriesBtn) {
        resumeSeriesBtn.addEventListener('click', event => {
          event.preventDefault();
          openSeries();
        });
      }

      // Moderatör “Birlikte Aç” dediğinde her cihaz detay sayfasına uğramadan
      // doğrudan kendi oynatıcısını açar. Olay sessionStorage'da tek kullanımlık
      // tutulur; normal detay ziyaretleri otomatik oynatılmaz.
      if (decisionRoomAutoplay) {
        // Programatik .click(), bazı mobil tarayıcılarda etkileşim olarak
        // değerlendirilmediği için hiç çalışmayabiliyor. Oynatıcı akışını
        // doğrudan çağırmak, oda sahibi içeriği açtığı anda her cihazda
        // pencerenin kesin açılmasını sağlar.
        window.setTimeout(() => {
          if (effectiveType === 'movie') openMovie();
          else openSeries();
        }, 0);
      }

      const trailerBtn = container.querySelector('#btn-watch-trailer');
      if (trailerBtn) {
        trailerBtn.addEventListener('click', event => {
          event.preventDefault();
          container.querySelectorAll('.netflix-tab-btn').forEach(button => button.classList.toggle('active', button.dataset.tab === 'trailers'));
          container.querySelectorAll('.netflix-tab-pane').forEach(pane => pane.classList.toggle('active', pane.id === 'tab-pane-trailers'));
          renderIcons(container.querySelector('#tab-pane-trailers'));
          container.querySelector('#tab-pane-trailers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }

      // Inline Horizontal Expanding Trailer Cards (No Modal, expands sideways!)
      container.querySelectorAll('.hero-trailer-expand-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('.trailer-expanded-close')) {
            e.stopPropagation();
            card.classList.remove('is-expanded');
            const playerBox = card.querySelector('.trailer-expanded-player');
            if (playerBox) playerBox.innerHTML = '';
            return;
          }

          if (card.classList.contains('is-expanded')) return;

          // Collapse any other open trailer card first
          container.querySelectorAll('.hero-trailer-expand-card.is-expanded').forEach(other => {
            other.classList.remove('is-expanded');
            const otherPlayer = other.querySelector('.trailer-expanded-player');
            if (otherPlayer) otherPlayer.innerHTML = '';
          });

          const videoKey = card.getAttribute('data-video-key');
          if (!videoKey) return;

          card.classList.add('is-expanded');
          const playerBox = card.querySelector('.trailer-expanded-player');
          if (playerBox) {
            playerBox.innerHTML = `
              <iframe 
                src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoKey)}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&playsinline=1"
                frameborder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowfullscreen
                class="trailer-inline-iframe"
                title="${title} Fragman">
              </iframe>
            `;
          }
          renderIcons();
        });
      });

      const favBtn = container.querySelector('#btn-toggle-fav');
      if (favBtn) {
        favBtn.addEventListener('click', () => {
          const added = toggleFavorite({ ...media, type: isAnime ? 'anime' : effectiveType, isAnime, media_type: effectiveType });
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
          const added = toggleWatchlist({ ...media, type: isAnime ? 'anime' : effectiveType, isAnime, media_type: effectiveType });
          showToast(added ? 'İzleme listesine eklendi!' : 'İzleme listesinden çıkarıldı.', added ? 'success' : 'info');
          const icon = watchBtn.querySelector('i');
          const text = watchBtn.querySelector('span');
          if (icon && text) {
            icon.setAttribute('data-lucide', added ? 'check' : 'plus');
            renderIcons();
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
            renderIcons();
          } else {
            // TV / Anime / Doc Series Bulk Watched
            const currentAllWatched = isEntireSeriesWatched(id, media.seasons || []);
            const targetState = !currentAllWatched;

            markAllEpisodesWatched(id, media.seasons || [], targetState, {
              title: title,
              posterPath: media.poster_path,
              backdropPath: media.backdrop_path,
              type: isAnime ? 'anime' : 'tv',
              isAnime
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
            renderIcons();

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

            const seasonAllBtn = container.querySelector('#btn-mark-season-all');
            if (seasonAllBtn) {
              const span = seasonAllBtn.querySelector('span');
              const icon = seasonAllBtn.querySelector('i');
              if (span) span.textContent = targetState ? 'Bu Sezon İzlendi' : 'Bu Sezonu İzlendi İşaretle';
              if (icon) icon.setAttribute('data-lucide', targetState ? 'check-circle-2' : 'check-check');
              if (targetState) {
                seasonAllBtn.style.background = 'rgba(16, 185, 129, 0.2)';
                seasonAllBtn.style.borderColor = '#10b981';
                seasonAllBtn.style.color = '#10b981';
              } else {
                seasonAllBtn.style.background = '';
                seasonAllBtn.style.borderColor = '';
                seasonAllBtn.style.color = '';
              }
            }

            renderIcons();
          }
        });
      }

      // Real-time synchronization on Detail View without page refresh
      const onDetailDataChanged = (e) => {
        if (e && e.detail && e.detail.isProgressUpdate && document.getElementById('player-modal')) return;
        const isMovieWatched = effectiveType === 'movie' ? isMediaWatched(id, 1, 1) : false;
        const isSeriesAllWatched = effectiveType === 'tv' ? isEntireSeriesWatched(id, media.seasons || []) : false;
        const isWatched = effectiveType === 'movie' ? isMovieWatched : isSeriesAllWatched;

        if (watchedDetailBtn) {
          if (isWatched) {
            watchedDetailBtn.classList.add('btn-watched-active');
          } else {
            watchedDetailBtn.classList.remove('btn-watched-active');
          }
          const label = effectiveType === 'movie'
            ? (isWatched ? 'Film İzlendi' : 'İzlendi Olarak İşaretle')
            : (isWatched ? 'Tüm Sezonlar İzlendi' : 'Tümünü İzlendi İşaretle');

          watchedDetailBtn.innerHTML = `
            <i data-lucide="${isWatched ? 'check-circle-2' : 'check'}"></i>
            <span>${label}</span>
          `;
        }

        const playMovieBtn = container.querySelector('#btn-play-movie');
        if (playMovieBtn && effectiveType === 'movie') {
          const mp = getMediaProgress(id, 1, 1);
          if (mp && mp.currentTime > 0 && !mp.completed) {
            const timeStr = formatSecondsToTime(mp.currentTime);
            playMovieBtn.innerHTML = `<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">${timeStr}</span></span>`;
          }
        }

        const resumeBtn = container.querySelector('#btn-resume-series');
        if (resumeBtn && effectiveType === 'tv') {
          const lastWatched = getLastWatchedEpisode(id);
          if (lastWatched) {
            const timeStr = formatSecondsToTime(lastWatched.currentTime);
            resumeBtn.innerHTML = `<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">S${lastWatched.season} B${lastWatched.episode}${timeStr ? ' • ' + timeStr : ''}</span></span>`;
          }
        }

        renderIcons();
      };

      window.addEventListener('sineflix_data_changed', onDetailDataChanged);

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
              type: isAnime ? 'anime' : 'movie',
              isAnime,
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
              type: isAnime ? 'anime' : 'tv',
              isAnime,
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

      // Netflix Sub-Navigation Tabs Switching (Images 3 & 4)
      const tabBtns = container.querySelectorAll('.netflix-tab-btn');
      const tabPanes = container.querySelectorAll('.netflix-tab-pane');
      tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const target = btn.getAttribute('data-tab');
          if (target !== 'trailers') {
            container.querySelectorAll('#tab-pane-trailers .hero-trailer-expand-card.is-expanded').forEach(card => {
              card.classList.remove('is-expanded');
              card.querySelector('.trailer-expanded-player').innerHTML = '';
            });
          }
          tabBtns.forEach(b => b.classList.remove('active'));
          tabPanes.forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          const targetPane = container.querySelector(`#tab-pane-${target}`);
          if (targetPane) {
            targetPane.classList.add('active');
            renderIcons(targetPane);
          }
        });
      });

      // Netflix Cast Grid Cards Click -> Open Filmography Explorer
      container.querySelectorAll('.netflix-cast-card').forEach(card => {
        card.addEventListener('click', (e) => {
          e.preventDefault();
          const personId = card.getAttribute('data-person-id');
          const personName = card.getAttribute('data-person-name');
          if (personId) {
            openCastExplorerModal(personId, personName);
          }
        });
      });

      // Show More Cast Members Toggle
      const showMoreCastBtn = container.querySelector('#btn-show-more-cast');
      if (showMoreCastBtn) {
        showMoreCastBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const hiddenCards = container.querySelectorAll('.netflix-cast-card.cast-card-hidden');
          hiddenCards.forEach(c => c.classList.remove('cast-card-hidden'));
          showMoreCastBtn.style.display = 'none';
          renderIcons();
        });
      }

      // Pane Trailer Card Click
      const paneTrailerBtn = container.querySelector('#btn-pane-play-trailer');
      if (paneTrailerBtn) {
        paneTrailerBtn.addEventListener('click', () => {
          const trailerBtn = container.querySelector('#btn-watch-trailer');
          if (trailerBtn) trailerBtn.click();
        });
      }

      // TVmaze yayın takvimi: "Yeni bölüm S3 B5 • 3 gün sonra" rozeti (progresif, bloklamaz)
      const nextEpisodeBadge = container.querySelector('#detail-next-episode-badge');
      if (nextEpisodeBadge && effectiveType === 'tv') {
        (async () => {
          try {
            const info = await getNextEpisodeInfo({
              imdbId: media.external_ids?.imdb_id,
              title: originalTitle || title,
              year
            });
            if (!info?.nextEpisode || !nextEpisodeBadge.isConnected) return;

            const epLabel = info.nextLabel || '';
            const dateLabel = info.nextAirdateLabel || '';
            if (!epLabel && !dateLabel) return;
            if (dateLabel === 'Yayınlandı') return; // geçmiş bölüm bilgisini gösterme

            const badgeText = [epLabel ? `Yeni bölüm ${epLabel}` : 'Yeni bölüm', dateLabel]
              .filter(Boolean)
              .join(' • ');
            nextEpisodeBadge.innerHTML = `<i data-lucide="calendar-clock" style="width:13px; height:13px"></i><span>${badgeText}</span>`;
            nextEpisodeBadge.title = `Sonraki bölüm: ${epLabel || '-'}${info.nextEpisode.name ? ' — ' + info.nextEpisode.name : ''}${dateLabel ? ' • ' + dateLabel : ''} (Kaynak: TVmaze)`;
            nextEpisodeBadge.style.display = 'inline-flex';
            renderIcons(nextEpisodeBadge);
          } catch (_) {
            // Takvim bilgisi opsiyoneldir; hata durumunda rozet gizli kalır
          }
        })();
      }

      const recGrid = container.querySelector('.media-grid');
      if (recGrid) attachMediaCardEvents(recGrid);
    }
  };
}

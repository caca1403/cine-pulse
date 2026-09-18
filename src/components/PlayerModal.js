import { createPlayerScope, renderPlayerIcons } from './playerLifecycle.js';
/* ==========================================================================
   CinePulse Studio - Ultra-Luxury Cinematic Video Player Modal Component
   Exceeds Netflix, Amazon Prime & Apple TV+ Standards.
   Features:
   - Ambient Glow Aura Backdrop & Glassmorphism Floating Top Bar
   - Sliding Dubbed (🇹🇷) / Subtitled (💬) Segmented Switcher
   - Live VIP Server Selector Chips with Ping Dots & Glow Highlights
   - Netflix-Style In-Player Season & Episode Selector Drawer
   - Seamless In-Place Episode Switching with 0ms Reload
   - Desktop Pro Keyboard Shortcuts (F, N, P, E, M, Space, Arrows, Esc)
   - Mobile-First 100dvh Edge-to-Edge Responsive Touch Ergonomics
   - Real Browser Fullscreen & Theater Cinema Mode
   - Watched & Halfway Progress Bookmarking with Auto-Sync
   ========================================================================== */

import { getStreamingServers, getStreamingServersProgressive } from '../services/providerAggregator.js';
import { resolveDirectStream } from '../services/streamExtractors.js';
import {
  saveWatchProgress,
  getMediaProgress,
  formatSecondsToTime,
  isMediaWatched,
  toggleEpisodeWatched,
  markEpisodeWatched,
  markMediaWatched,
  registerAnimeId,
  isRegisteredAnimeId,
  isAnimeRecord
} from '../services/storage.js';
import { showToast } from './Toast.js';
import { translateToTurkish } from '../services/tmdbApi.js';

const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';

let activeModalClose = null;
let activeProgressInterval = null;
let originalWindowOpen = null;
let activeHlsInstance = null;
let activeAudioHlsInstance = null;

export async function openPlayerModal({
  type = 'tv',
  isAnime = false,
  tmdbId,
  title = '',
  seriesTitle = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  posterPath = '',
  backdropPath = '',
  currentTime = 0,
  duration = 0,
  seasonsList = [],
  maxEpisodes = 0
}) {
  const modalContainer = document.getElementById('player-modal');
  if (!modalContainer) return;

  activeModalClose?.();
  let closed = false;
  let discoveryGeneration = 0;
  let playbackScope = createPlayerScope();
  const modalScope = createPlayerScope();
  const { setTimeout, clearTimeout, setInterval, clearInterval } = modalScope;
  function disposePlayback() {
    const video = modalContainer.querySelector('#hls-video-player');
    video?._persistProgress?.(true);
    playbackScope.dispose();
    playbackScope = createPlayerScope();
    for (const instance of [activeHlsInstance, activeAudioHlsInstance]) {
      try { instance?.destroy(); } catch (_) {}
    }
    activeHlsInstance = activeAudioHlsInstance = null;
    try { destroyTorrentStream(); } catch (_) {}
    modalContainer.querySelectorAll('video, audio').forEach(media => {
      try {
        media.pause();
        media.removeAttribute('src');
        while (media.firstChild) media.removeChild(media.firstChild);
        media.load();
      } catch (_) {}
    });
    modalContainer.querySelectorAll('iframe').forEach(iframe => {
      try {
        iframe.src = 'about:blank';
        iframe.remove();
      } catch (_) {}
    });
  }

  // Intercept Pop-Up, Tab hijacks & Gambling Ads in Parent Window
  if (!originalWindowOpen) originalWindowOpen = window.open;
  window.open = function (url, target, features) {
    if (typeof url === 'string') {
      const allowed = ['api.themoviedb.org', 'image.tmdb.org'];
      if (allowed.some(a => url.startsWith(a))) {
        return originalWindowOpen.call(window, url, target, features);
      }
    }
    console.warn('CinePulse Anti-Ad Shield: Engellendi ->', url);
    return {
      closed: true,
      focus: () => {},
      blur: () => {},
      close: () => {},
      location: { href: '' }
    };
  };

  // Prevent embedded malicious iframes from redirecting the parent window
  window.onbeforeunload = function(e) {
    if (document.getElementById('player-modal') && !document.getElementById('player-modal').classList.contains('hidden')) {
      // If user is actively watching, prevent unwanted iframe page unloads/redirects
      return;
    }
  };

  let currentSeason = Number(season) || 1;
  let currentEpisode = Number(episode) || 1;
  let currentSeasonsList = Array.isArray(seasonsList) ? seasonsList : [];
  let currentMaxEpisodes = Number(maxEpisodes) || 0;
  let drawerSeason = currentSeason;
  let drawerEpisodesCache = new Map();
  let isDrawerOpen = false;
  let isShortcutsOpen = false;

  let effectiveIsAnime = Boolean(
    isAnime ||
    type === 'anime' ||
    (tmdbId && isRegisteredAnimeId(tmdbId)) ||
    isAnimeRecord({ id: tmdbId, title, seriesTitle, originalTitle })
  );
  if (effectiveIsAnime && tmdbId) {
    registerAnimeId(tmdbId);
  }

  const isSeries = type === 'tv' || (type !== 'movie' && (Boolean(season) || Boolean(episode) || (Array.isArray(seasonsList) && seasonsList.length > 0) || currentSeason > 0));

  const rawSeries = seriesTitle || title || '';
  const cleanSeriesName = rawSeries
    .replace(/\s*-\s*S\d+E\d+.*$/i, '')
    .replace(/\s*-\s*S\d+.*$/i, '')
    .replace(/\s*-\s*\d+\.\s*Sezon.*$/i, '')
    .replace(/\s*:\s*.*$/, '')
    .replace(/\s*\(\d{4}\).*/, '')
    .trim();

  let mediaOverview = '';
  let currentEpisodeOverview = '';
  let mediaGenres = [];
  let movieDirector = '';
  let movieCast = [];
  let movieRuntime = 0;
  let movieReleaseYear = '';
  let movieVoteAverage = 0;
  let movieSimilar = [];
  let isSourcesPopoverOpen = false;

  // Async fetch TMDB metadata (seasons, missing poster/backdrop, movie details & cast/similar)
  if (tmdbId) {
    const isMovie = (!isSeries && type === 'movie');
    const tmdbEndpoint = isMovie 
      ? `https://api.themoviedb.org/3/movie/${tmdbId}?append_to_response=credits,similar,recommendations&api_key=${TMDB_API_KEY}&language=tr-TR`
      : `https://api.themoviedb.org/3/tv/${tmdbId}?append_to_response=credits&api_key=${TMDB_API_KEY}&language=tr-TR`;

    fetch(tmdbEndpoint)
      .then(res => res.json())
      .then(data => {
        if (!closed && data) {
          if (!posterPath && data.poster_path) posterPath = data.poster_path;
          if (!backdropPath && data.backdrop_path) backdropPath = data.backdrop_path;
          if (data.overview) mediaOverview = data.overview;
          if (Array.isArray(data.genres)) mediaGenres = data.genres.map(g => g.name);

          if (isMovie) {
            if (data.runtime) movieRuntime = data.runtime;
            if (data.release_date) movieReleaseYear = data.release_date.substring(0, 4);
            if (data.vote_average) movieVoteAverage = Number(data.vote_average.toFixed(1));
            
            // Extract director
            if (data.credits && Array.isArray(data.credits.crew)) {
              const dir = data.credits.crew.find(c => c.job === 'Director');
              if (dir) movieDirector = dir.name;
            }
            // Extract cast
            if (data.credits && Array.isArray(data.credits.cast)) {
              movieCast = data.credits.cast.slice(0, 10);
            }
            // Extract similar or recommendations
            const recs = (data.recommendations?.results?.length > 0)
              ? data.recommendations.results
              : (data.similar?.results || []);
            movieSimilar = recs.filter(m => m.poster_path).slice(0, 12);

            renderMovieInfoSection();
          }

          updateHeroMetaUI();

          const isJp = data.original_language === 'ja' || (Array.isArray(data.origin_country) && data.origin_country.includes('JP'));
          const hasAnim = Array.isArray(data.genres) && data.genres.some(g => g.id === 16 || /anim/i.test(g.name));
          if (isJp && hasAnim) {
            effectiveIsAnime = true;
            registerAnimeId(tmdbId);
          }
          if (isSeries && data.seasons && currentSeasonsList.length === 0) {
            currentSeasonsList = data.seasons.filter(s => s.season_number > 0);
            updateNavButtons();
            if (isDrawerOpen) renderDrawerContent();
          }
        }
      })
      .catch(() => {});
  }

  const existingRecord = getMediaProgress(tmdbId, currentSeason, currentEpisode);
  let initialTime = currentTime || (existingRecord ? existingRecord.currentTime : 0);
  let isWatched = isMediaWatched(tmdbId, currentSeason, currentEpisode);
  const estimatedDuration = duration > 0 ? duration : (type === 'movie' ? 6600 : 3000);
  let simulatedCurrentTime = initialTime;
  let isSwitchingEpisode = false;

  const updateWatchedUI = (watched) => {
    [document.getElementById('btn-toggle-watched-player'), document.getElementById('btn-toggle-watched-mobile')].forEach(btn => {
      if (!btn) return;
      const span = btn.querySelector('span');
      const icon = btn.querySelector('[data-lucide]');
      if (span) span.textContent = watched ? 'İzlendi' : 'İzlendi Yap';
      if (icon) icon.setAttribute('data-lucide', watched ? 'check-circle-2' : 'check');
      if (watched) btn.classList.add('watched-active');
      else btn.classList.remove('watched-active');
    });

    const btnToggleList = document.getElementById('btn-toggle-list');
    if (btnToggleList) {
      const span = btnToggleList.querySelector('#list-action-label');
      const icon = btnToggleList.querySelector('[data-lucide]');
      if (span) span.textContent = watched ? 'İzlendi' : 'Listeme Ekle';
      if (icon) icon.setAttribute('data-lucide', watched ? 'check-circle-2' : 'plus');
      if (watched) btnToggleList.classList.add('watched-active');
      else btnToggleList.classList.remove('watched-active');
    }

    if (isSeries) {
      const carouselContainer = document.getElementById('dizisol-episodes-carousel');
      if (carouselContainer) {
        const card = carouselContainer.querySelector(`.dizisol-ep-card[data-season="${currentSeason}"][data-episode="${currentEpisode}"]`);
        if (card) {
          card.classList.toggle('is-watched-card', watched);
          const watchBtn = card.querySelector('.dizisol-ep-watch-toggle');
          if (watchBtn) {
            watchBtn.classList.toggle('is-watched', watched);
            watchBtn.setAttribute('title', watched ? 'İzlendi (Kaldırmak için tıkla)' : 'İzlendi Olarak İşaretle');
            watchBtn.innerHTML = `
              <i data-lucide="${watched ? 'check-circle-2' : 'eye'}" style="width: 13px; height: 13px;"></i>
              <span class="ep-watch-text">${watched ? 'İzlendi' : 'İşaretle'}</span>
            `;
          }
          const titleEl = card.querySelector('.dizisol-ep-title');
          if (titleEl) {
            const baseTitle = titleEl.getAttribute('data-base-title') || titleEl.textContent.replace(/\s*✓.*$/, '');
            titleEl.textContent = `${baseTitle}${watched ? ' ✓' : ''}`;
          }
        }
      }
    }
    const btnList = document.getElementById('btn-toggle-list');
    if (btnList) renderPlayerIcons(btnList);
  };

  let lastProgressSaveTimestamp = 0;
  const persistCurrentProgress = (curTime, durTime, forceCompleted = null, immediate = false) => {
    if (!tmdbId) return;
    const cur = Math.max(0, Math.round(curTime ?? simulatedCurrentTime ?? 0));
    const dur = Math.max(0, Math.round(durTime || estimatedDuration || 0));
    simulatedCurrentTime = cur;

    const now = Date.now();
    // Throttle progress saves to localStorage to at most once per 15s during playback
    if (!immediate && (now - lastProgressSaveTimestamp < 15000)) return;
    lastProgressSaveTimestamp = now;

    const progressPercent = dur > 0 ? Math.min(100, Math.round((cur / dur) * 100)) : 0;
    const completedStatus = (forceCompleted !== null) ? forceCompleted : (isWatched || progressPercent >= 90);
    if (completedStatus && !isWatched) {
      isWatched = true;
      updateWatchedUI(true);
    }

    saveWatchProgress({
      id: tmdbId,
      title: cleanSeriesName,
      posterPath,
      backdropPath,
      type: effectiveIsAnime ? 'anime' : (isSeries ? 'tv' : 'movie'),
      isAnime: effectiveIsAnime,
      isSeries: isSeries,
      season: currentSeason,
      episode: currentEpisode,
      currentTime: cur,
      duration: dur > 0 ? dur : estimatedDuration,
      completed: completedStatus
    });
  };

  function startWatchProgressLoop() {
    if (activeProgressInterval) clearInterval(activeProgressInterval);
    activeProgressInterval = setInterval(() => {
      const videoEl = document.getElementById('hls-video-player');
      if (videoEl && !isNaN(videoEl.currentTime)) {
        if (!videoEl.paused && !videoEl.seeking) {
          persistCurrentProgress(videoEl.currentTime, videoEl.duration, null, false);
        }
      } else {
        if (document.visibilityState === 'visible' && hasPlayerStartedPlaying) {
          simulatedCurrentTime += 15;
          persistCurrentProgress(simulatedCurrentTime, estimatedDuration, null, false);
        }
      }
    }, 15000);
  }

  const handleGlobalPageUnload = () => {
    const videoEl = document.getElementById('hls-video-player');
    if (videoEl && typeof videoEl._persistProgress === 'function') {
      videoEl._persistProgress(true);
    } else {
      persistCurrentProgress(simulatedCurrentTime, estimatedDuration, null, true);
    }
  };
  window.addEventListener('pagehide', handleGlobalPageUnload);
  window.addEventListener('beforeunload', handleGlobalPageUnload);

  let currentCategory = 'dubbed'; // Her zaman dublaj ile başla
  let activeServers = [];
  let currentServerIndex = 0;
  let categorizedServers = { dubbed: [], subtitled: [] };
  let isSearching = true;
  let hasPlayerStartedPlaying = false;
  let currentImdbId = null; // Resolved asynchronously when available

  function getSeasonEpisodeCount(sNum) {
    const sObj = currentSeasonsList.find(s => s.season_number === sNum);
    if (sObj && sObj.episode_count) return sObj.episode_count;
    if (currentMaxEpisodes > 0 && sNum === currentSeason) return currentMaxEpisodes;
    return 0;
  }

  function getDisplayTitle() {
    return isSeries
      ? `${cleanSeriesName} • S${currentSeason} B${currentEpisode}`
      : cleanSeriesName;
  }

  function getStreamSafeUrl(srv) {
    if (!srv) return '';
    if (typeof srv.getUrl === 'function') {
      try {
        const u = srv.getUrl();
        if (u) return u;
      } catch (_) {}
    }
    return srv.streamUrl || srv.url || srv.originalEmbedUrl || '';
  }

  function updateHeroMetaUI() {
    const genresEl = document.getElementById('dizisol-genre-chips');
    if (genresEl && Array.isArray(mediaGenres) && mediaGenres.length > 0) {
      genresEl.innerHTML = mediaGenres.map(g => `<span class="dizisol-genre-chip">${g}</span>`).join('');
    }
    const overviewEl = document.getElementById('dizisol-overview');
    if (overviewEl) {
      if (isSeries) {
        if (currentEpisodeOverview) {
          overviewEl.textContent = currentEpisodeOverview;
        }
      } else if (mediaOverview) {
        overviewEl.textContent = mediaOverview;
      }
    }
    const epBadge = document.querySelector('.dizisol-ep-badge');
    if (epBadge) {
      if (isSeries) {
        epBadge.textContent = `Sezon ${currentSeason} • Bölüm ${currentEpisode}`;
      } else {
        const runtimeText = movieRuntime ? `${Math.floor(movieRuntime / 60)}s ${movieRuntime % 60}dk` : '';
        const yearText = movieReleaseYear || '';
        epBadge.textContent = ['Film', yearText, runtimeText].filter(Boolean).join(' • ');
      }
    }
  }

  function renderMovieInfoSection() {
    if (isSeries) return;
    const movieSection = document.getElementById('dizisol-movie-section');
    if (!movieSection) return;

    const runtimeFormatted = movieRuntime ? `${Math.floor(movieRuntime / 60)} sa ${movieRuntime % 60} dk` : '';
    const castHTML = (movieCast && movieCast.length > 0)
      ? movieCast.map(actor => {
          const profileImg = actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://image.tmdb.org/t/p/w185/null';
          return `
            <div class="player-movie-cast-chip" title="${actor.name} (${actor.character || ''})">
              <img src="${profileImg}" alt="${actor.name}" class="player-cast-avatar" onerror="this.onerror=null; this.style.display='none';" />
              <div class="player-cast-meta">
                <span class="player-cast-name">${actor.name}</span>
                ${actor.character ? `<span class="player-cast-role">${actor.character}</span>` : ''}
              </div>
            </div>
          `;
        }).join('')
      : '';

    const similarHTML = (movieSimilar && movieSimilar.length > 0)
      ? movieSimilar.map(sim => {
          const poster = sim.poster_path ? `https://image.tmdb.org/t/p/w342${sim.poster_path}` : '';
          const rating = sim.vote_average ? sim.vote_average.toFixed(1) : '';
          const year = (sim.release_date || '').substring(0, 4);
          return `
            <div class="player-sim-card" data-sim-id="${sim.id}" data-sim-title="${sim.title || ''}" title="${sim.title || ''} • İzle">
              <div class="player-sim-poster-box">
                ${poster ? `<img src="${poster}" alt="${sim.title || ''}" class="player-sim-poster" loading="lazy" />` : ''}
                <div class="player-sim-play-hover">
                  <i data-lucide="play" style="width:24px;height:24px;fill:#fff;color:#fff;"></i>
                </div>
                ${rating ? `<span class="player-sim-badge">★ ${rating}</span>` : ''}
              </div>
              <div class="player-sim-info">
                <span class="player-sim-title">${sim.title || ''}</span>
                ${year ? `<span class="player-sim-year">${year}</span>` : ''}
              </div>
            </div>
          `;
        }).join('')
      : '';

    movieSection.innerHTML = `
      <!-- Movie Quick Meta Pills Bar -->
      <div class="player-movie-meta-bar">
        ${movieDirector ? `
          <div class="player-movie-director-tag">
            <span class="meta-tag-label">YÖNETMEN:</span>
            <span class="meta-tag-val">${movieDirector}</span>
          </div>
        ` : ''}
        ${runtimeFormatted ? `
          <div class="player-movie-pill">
            <i data-lucide="clock" style="width:13px;height:13px;color:#f59e0b"></i>
            <span>${runtimeFormatted}</span>
          </div>
        ` : ''}
        ${movieVoteAverage > 0 ? `
          <div class="player-movie-pill highlight">
            <i data-lucide="star" style="width:13px;height:13px;color:#eab308;fill:#eab308"></i>
            <span>${movieVoteAverage} / 10</span>
          </div>
        ` : ''}
        ${movieReleaseYear ? `
          <div class="player-movie-pill">
            <i data-lucide="calendar" style="width:13px;height:13px;color:#60a5fa"></i>
            <span>${movieReleaseYear}</span>
          </div>
        ` : ''}
      </div>

      <!-- Cast Chips Rail -->
      ${castHTML ? `
        <div class="player-movie-block">
          <div class="player-movie-block-header">
            <h4>OYUNCULAR & EKİP</h4>
          </div>
          <div class="player-movie-cast-rail">
            ${castHTML}
          </div>
        </div>
      ` : ''}

      <!-- Similar Movies Rail -->
      ${similarHTML ? `
        <div class="player-movie-block">
          <div class="player-movie-block-header">
            <h4>BENZER FİLMLER & ÖNERİLER</h4>
            <span class="player-sim-count">${movieSimilar.length} Film</span>
          </div>
          <div class="player-sim-carousel">
            ${similarHTML}
          </div>
        </div>
      ` : ''}
    `;

    // Attach click listeners on similar movies to open in player!
    movieSection.querySelectorAll('.player-sim-card').forEach(card => {
      card.addEventListener('click', () => {
        const nextId = card.getAttribute('data-sim-id');
        const nextTitle = card.getAttribute('data-sim-title');
        if (nextId) {
          openPlayerModal({
            type: 'movie',
            tmdbId: parseInt(nextId, 10),
            title: nextTitle,
            currentTime: 0
          });
        }
      });
    });

    renderPlayerIcons(movieSection);
  }

  async function updateEpisodeOverview(seasonNum, epNum) {
    if (!isSeries || !tmdbId) return;
    const overviewEl = document.getElementById('dizisol-overview');

    // 1. Check if season episodes are cached
    let episodes = drawerEpisodesCache.get(seasonNum);
    if (!episodes || episodes.length === 0) {
      episodes = await fetchSeasonEpisodes(seasonNum);
    }

    if (closed || seasonNum !== currentSeason || epNum !== currentEpisode) return;
    const ep = episodes ? episodes.find(e => e.episode_number === epNum) : null;

    if (ep && ep.overview && ep.overview.trim().length > 0) {
      currentEpisodeOverview = ep.overview.trim();
      if (overviewEl) overviewEl.textContent = currentEpisodeOverview;
      return;
    }

    // 2. If Turkish overview is empty in TMDB, fetch English overview and translate to Turkish
    try {
      const enRes = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNum}/episode/${epNum}?api_key=${TMDB_API_KEY}&language=en-US`);
      if (enRes && enRes.ok) {
        const enData = await enRes.json();
        if (enData && enData.overview && enData.overview.trim().length > 0) {
          const translated = await translateToTurkish(enData.overview.trim());
          if (closed || seasonNum !== currentSeason || epNum !== currentEpisode) return;
          if (translated && translated.trim()) {
            currentEpisodeOverview = translated.trim();
            if (overviewEl) overviewEl.textContent = currentEpisodeOverview;
            return;
          }
        }
      }
    } catch (_) {}

    // Fallback if no specific overview found
    if (ep && ep.name && !ep.name.toLowerCase().includes('bölüm')) {
      if (overviewEl) overviewEl.textContent = `${ep.name} - Bölüm özeti hazırlanıyor...`;
    } else if (mediaOverview) {
      if (overviewEl) overviewEl.textContent = mediaOverview;
    }
  }

  function getActiveServerName() {
    const srv = activeServers[currentServerIndex];
    if (!srv) return isSearching ? 'Kaynak aranıyor...' : 'Kaynak Bulunamadı';
    return srv.displayName || srv.name || 'Sunucu';
  }

  function updateActiveSourceLabel() {
    const label = document.getElementById('active-source-chip-label');
    if (label) {
      label.textContent = `Kaynak: ${getActiveServerName()} (Değiştir)`;
    }
    if (isSourcesPopoverOpen) {
      renderSourcesPopoverList();
    }
  }

  function toggleSourcesPopover(forceState) {
    const pop = document.getElementById('player-sources-popover');
    if (!pop) return;
    isSourcesPopoverOpen = (typeof forceState === 'boolean') ? forceState : !isSourcesPopoverOpen;
    if (isSourcesPopoverOpen) {
      pop.classList.remove('hidden');
      renderSourcesPopoverList();
    } else {
      pop.classList.add('hidden');
    }
  }

  function renderSourcesPopoverList() {
    const listEl = document.getElementById('sources-popover-list');
    if (!listEl) return;
    if (!activeServers || activeServers.length === 0) {
      listEl.innerHTML = `<p class="sources-empty-text">Henüz yayın hattı bulunamadı veya taranıyor...</p>`;
      return;
    }

    listEl.innerHTML = activeServers.map((srv, idx) => {
      const isActive = idx === currentServerIndex;
      const isFailed = Boolean(srv.failed);
      let statusDot = 'dot-amber';
      let statusTag = '<span class="source-ready-tag">Hazır</span>';

      if (isFailed) {
        statusDot = 'dot-red';
        statusTag = `<span class="source-failed-tag"><i data-lucide="alert-triangle" style="width:12px;height:12px"></i> ${srv.failReason || 'Yanıt Vermedi'}</span>`;
      } else if (isActive) {
        statusDot = 'dot-green';
        statusTag = `<span class="source-active-tag">🟢 Oynatılıyor</span>`;
      }

      return `
        <div class="source-list-item ${isActive ? 'active' : ''} ${isFailed ? 'failed' : ''}" data-index="${idx}">
          <div class="source-item-left">
            <span class="server-status-dot ${statusDot}"></span>
            <span class="source-item-name">${srv.displayName || srv.name}</span>
            <span class="source-item-badge">${srv.quality || '1080p'}</span>
          </div>
          <div class="source-item-right">
            ${statusTag}
          </div>
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('.source-list-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const idx = parseInt(item.getAttribute('data-index'), 10);
        if (idx === currentServerIndex) return;
        currentServerIndex = idx;
        failoverCountInSession = 0;
        toggleSourcesPopover(false);
        updateActiveSourceLabel();
        updatePlayerContainer();
      });
    });

    renderPlayerIcons(listEl);
  }

  // Alias to prevent any ReferenceError
  const renderSourcesPopoverContent = renderSourcesPopoverList;

  let failoverCountInSession = 0;
  let lastFailoverTimestamp = 0;

  function showInPlayerError(reason = 'Yayın yanıt vermedi') {
    const wrapper = document.getElementById('player-iframe-wrapper');
    if (!wrapper) return;

    if (activeHlsInstance) {
      try { activeHlsInstance.destroy(); } catch (_) {}
      activeHlsInstance = null;
    }
    if (activeAudioHlsInstance) {
      try { activeAudioHlsInstance.destroy(); } catch (_) {}
      activeAudioHlsInstance = null;
    }

    const currentSrv = activeServers[currentServerIndex];
    const nextIndex = activeServers.findIndex((s, idx) => idx > currentServerIndex && !s.failed);
    const hasNext = nextIndex !== -1;
    const hasSubtitled = currentCategory === 'dubbed' && (categorizedServers.subtitled?.length > 0);

    wrapper.innerHTML = `
      <div class="player-error-view" style="display:flex;align-items:center;justify-content:center;height:100%;text-align:center;padding:2rem;">
        <div class="player-error-card" style="background:rgba(20,24,35,0.92);backdrop-filter:blur(16px);padding:2rem;border-radius:16px;border:1px solid rgba(255,255,255,0.12);max-width:460px;box-shadow:0 20px 40px rgba(0,0,0,0.6);">
          <i data-lucide="alert-circle" style="width:44px;height:44px;color:#f59e0b;margin-bottom:1rem;"></i>
          <h3 style="color:#fff;font-size:1.15rem;margin-bottom:0.5rem;">${currentSrv?.displayName || currentSrv?.name || 'Seçili Kaynak'} Yanıt Vermedi</h3>
          <p style="color:#94a3b8;font-size:0.85rem;line-height:1.5;margin-bottom:1.25rem;">
            ${reason}. Alternatif yayın hatlarından birine geçiş yapabilir veya diğer dildeki kaynakları deneyebilirsiniz.
          </p>
          <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;">
            ${hasNext ? `<button class="btn-primary" id="btn-err-try-next" style="padding:0.55rem 1.1rem;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.4rem;"><i data-lucide="skip-forward" style="width:14px;height:14px"></i> Sıradaki Kaynağa Geç (${activeServers[nextIndex].displayName || 'Alternatif'})</button>` : ''}
            <button class="btn-secondary" id="btn-err-open-sources" style="padding:0.55rem 1.1rem;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.4rem;"><i data-lucide="layers" style="width:14px;height:14px"></i> Tüm Kaynaklar (${activeServers.length})</button>
            ${hasSubtitled ? `<button class="btn-secondary" id="btn-err-switch-sub" style="padding:0.55rem 1.1rem;font-size:0.85rem;display:inline-flex;align-items:center;gap:0.4rem;color:#f59e0b;"><i data-lucide="message-square" style="width:14px;height:14px"></i> 💬 Altyazılıya Geç</button>` : ''}
          </div>
        </div>
      </div>
    `;
    renderPlayerIcons(wrapper);

    document.getElementById('btn-err-try-next')?.addEventListener('click', () => {
      if (hasNext) {
        failoverCountInSession = 0;
        currentServerIndex = nextIndex;
        updateActiveSourceLabel();
        updatePlayerContainer();
      }
    });

    document.getElementById('btn-err-open-sources')?.addEventListener('click', () => {
      toggleSourcesPopover(true);
    });

    document.getElementById('btn-err-switch-sub')?.addEventListener('click', () => {
      failoverCountInSession = 0;
      const tabSub = document.getElementById('tab-subtitled');
      if (tabSub) tabSub.click();
    });
  }

  function triggerAutoFailover(reason = 'Bağlantı yanıt vermedi') {
    if (closed) return;
    // Zaman aşımı (timeout) kaynaklı otomatik kaynak atlamaları devre dışı
    if (reason && /zaman aşımı|timeout/i.test(reason)) {
      console.warn(`[PlayerModal] Zaman aşımı kaynaklı failover engellendi: ${reason}`);
      return;
    }

    // Rate-limit failover to prevent rapid flickering loop (max 1 per 2.5s)
    const now = Date.now();
    if (now - lastFailoverTimestamp < 2500) {
      console.warn(`[PlayerModal] Failover throttled to prevent loop: ${reason}`);
      return;
    }
    lastFailoverTimestamp = now;

    const currentSrv = activeServers[currentServerIndex];
    if (currentSrv) {
      currentSrv.failed = true;
      currentSrv.failReason = reason;
      console.warn(`[PlayerModal] Server failed: ${currentSrv.name} (${reason})`);
    }

    // Allow trying alternative non-failed servers up to 3 times or until activeServers exhausted
    failoverCountInSession++;
    const maxFailovers = Math.max(3, activeServers.length - 1);
    if (failoverCountInSession > maxFailovers) {
      console.warn('[PlayerModal] Max automatic failover reached. Showing in-player options.');
      showInPlayerError(reason);
      return;
    }

    // Find next available non-failed server in active category
    const nextIndex = activeServers.findIndex((s, idx) => idx > currentServerIndex && !s.failed);
    if (nextIndex !== -1) {
      const nextSrv = activeServers[nextIndex];
      showToast(`⚠️ ${currentSrv?.displayName || currentSrv?.name || 'Mevcut kaynak'} yanıt vermedi. ${nextSrv.displayName || nextSrv.name} deneniyor...`, 'warning');
      currentServerIndex = nextIndex;
      updateActiveSourceLabel();
      updatePlayerContainer();
      return;
    }

    // If no next server yet, but discovery is still actively searching:
    if (isDiscoveryActive) {
      console.log('[PlayerModal] Active server failed but discovery is still running; waiting for incoming streams...');
      showToast('⚠️ Seçili hat yanıt vermedi, alternatif hatlar taranıyor...', 'info');
      const wrapper = document.getElementById('player-iframe-wrapper');
      if (wrapper) {
        wrapper.innerHTML = `
          <div class="player-loading-overlay">
            <div class="player-loader-core">
              <div class="player-loader-spinner"></div>
              <i data-lucide="play" class="player-loader-icon"></i>
            </div>
            <div class="player-loader-text">
              <h3>${cleanSeriesName}</h3>
              <p class="player-loader-sub">Alternatif Yayın Hatları Taranıyor...</p>
              <p class="player-loader-hint">Bir önceki hat yanıt vermedi, yeni kaynak bağlanıyor...</p>
            </div>
          </div>
        `;
        renderPlayerIcons(wrapper);
      }
      return;
    }

    // No next server in current category -> show in-player error (do NOT auto-switch tabs silently!)
    showInPlayerError(reason);
  }

  function renderServerPills() {
    return '';
  }

  function resolveEffectiveSubtitles(srv) {
    const list = [];
    if (Array.isArray(srv?.subtitles) && srv.subtitles.length > 0) {
      list.push(...srv.subtitles);
    }
    const pool = [...(activeServers || []), ...(categorizedServers?.subtitled || []), ...(categorizedServers?.dubbed || [])];
    const found = pool.find(s => Array.isArray(s.subtitles) && s.subtitles.length > 0);
    if (found && Array.isArray(found.subtitles) && found.subtitles.length > 0) {
      found.subtitles.forEach(s => {
        if (!list.some(x => x.src === s.src || (x.label && x.label === s.label))) {
          list.push(s);
        }
      });
    }

    // Always provide OpenSubtitles Turkish WebVTT support for dubbed and direct streams
    const subUrl = (type === 'movie')
      ? `/api/subtitles?imdbId=${tmdbId}&type=movie`
      : `/api/subtitles?imdbId=${tmdbId}&season=${currentSeason}&episode=${currentEpisode}&type=tv`;

    const hasOpenSub = list.some(s => (s.label || '').toLowerCase().includes('opensubtitles') || s.src?.includes('/api/subtitles'));
    if (!hasOpenSub) {
      list.push({ label: 'OpenSubtitles (Türkçe)', src: subUrl });
    }

    return list;
  }

  function attachSubtitleControls(videoEl, srv) {
    if (!videoEl) return;

    const subs = resolveEffectiveSubtitles(srv);
    const defaultSubIdx = (currentCategory === 'subtitled' && subs.length > 0) ? 0 : -1;

    const initSubtitles = () => {
      try {
        const textTracks = videoEl.textTracks;
        if (textTracks && textTracks.length > 0) {
          for (let i = 0; i < textTracks.length; i++) {
            if (defaultSubIdx >= 0 && i === defaultSubIdx) {
              textTracks[i].mode = 'showing';
            } else {
              textTracks[i].mode = 'disabled';
            }
          }
        }
      } catch (_) {}
    };

    if (videoEl.readyState >= 1) {
      initSubtitles();
    } else {
      videoEl.addEventListener('loadedmetadata', initSubtitles, { once: true });
      videoEl.addEventListener('canplay', initSubtitles, { once: true });
    }
  }

  function syncSubtitlesToActivePlayer() {
    const videoEl = document.getElementById('hls-video-player');
    if (!videoEl) return;

    const srv = activeServers[currentServerIndex];
    if (!srv) return;

    const subs = resolveEffectiveSubtitles(srv);
    if (!subs || subs.length === 0) return;

    // Check if tracks are already mounted
    if (videoEl.querySelectorAll('track').length === 0) {
      subs.forEach((sub, idx) => {
        let safeSrc = sub.src;
        if (safeSrc && safeSrc.startsWith('http')) {
          safeSrc = `/api/proxy?url=${encodeURIComponent(safeSrc)}`;
        }
        const track = document.createElement('track');
        track.kind = 'subtitles';
        track.label = sub.label || 'Altyazı';
        track.src = safeSrc;
        track.srclang = (sub.label || '').toLowerCase().includes('türk') ? 'tr' : 'en';
        if (currentCategory === 'subtitled' && idx === 0) track.default = true;
        videoEl.appendChild(track);
      });
    }

    attachSubtitleControls(videoEl, srv);
  }

  function renderPlayerContent() {
    if ((isSearching || isDiscoveryActive) && (!activeServers || activeServers.length === 0)) {
      return `
        <div class="player-loading-overlay">
          <div class="player-loader-core">
            <div class="player-loader-spinner"></div>
            <i data-lucide="play" class="player-loader-icon"></i>
          </div>
          <div class="player-loader-text">
            <h3>${cleanSeriesName}</h3>
            <p class="player-loader-sub">${currentCategory === 'subtitled' ? '💬 Türkçe Altyazılı' : '🇹🇷 Türkçe Dublaj'} Yayınlar Aranıyor...</p>
            <p class="player-loader-hint">Türkiye ve küresel CDN hatları taranıyor...</p>
          </div>
        </div>
      `;
    }

    if (currentCategory === 'dubbed' && (!activeServers || activeServers.length === 0)) {
      return `
        <div class="player-not-found-container">
          <div class="not-found-icon-wrap">
            <i data-lucide="volume-x" style="width: 38px; height: 38px; color: #f59e0b;"></i>
          </div>
          <h3>Türkçe Dublaj Henüz Mevcut Değil</h3>
          <p>
            "${cleanSeriesName}" yapımı için resmi veya aktif Türkçe Dublaj akışı bulunamadı. Türkçe Altyazılı yüksek kaliteli (1080p / 4K) kaynaklardan hemen izleyebilirsiniz.
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
            <button id="btn-switch-subtitled-fallback" class="btn-primary btn-switch-category-fallback">
              <i data-lucide="repeat" style="width: 16px; height: 16px;"></i>
              <span>💬 Türkçe Altyazılı Sunucuları Aç (${categorizedServers.subtitled?.length || 0} Hat Aktif)</span>
            </button>
            <button id="btn-retry-discovery" class="btn-secondary" style="padding: 0.55rem 1.1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
              <span>Yeniden Tara</span>
            </button>
          </div>
        </div>
      `;
    }

    if (!activeServers || activeServers.length === 0) {
      return `
        <div class="player-not-found-container">
          <div class="not-found-icon-wrap">
            <i data-lucide="video-off" style="width: 38px; height: 38px; color: #ef4444;"></i>
          </div>
          <h3>Aktif Yayın Kaynağı Bulunamadı</h3>
          <p>
            "${cleanSeriesName}" içeriği için seçili sunucularda anlık sinyal alınamadı.
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
            <button id="btn-retry-discovery" class="btn-primary" style="padding: 0.55rem 1.2rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="refresh-cw" style="width: 15px; height: 15px;"></i>
              <span>Tekrar Tara</span>
            </button>
            <button id="btn-switch-subtitled-fallback" class="btn-secondary" style="padding: 0.55rem 1.1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="repeat" style="width: 14px; height: 14px;"></i>
              <span>${currentCategory === 'dubbed' ? '💬 Altyazılıya Geç' : '🇹🇷 Dublaja Geç'}</span>
            </button>
          </div>
        </div>
      `;
    }

    const srv = activeServers[currentServerIndex];
    if (!srv || srv.notFound) {
      return `
        <div class="player-not-found-container">
          <div class="not-found-icon-wrap">
            <i data-lucide="video-off" style="width: 38px; height: 38px; color: #ef4444;"></i>
          </div>
          <h3>${currentCategory === 'dubbed' ? 'Dublaj Sunucularda Bulunamadı' : 'Altyazılı Sunucularda Bulunamadı'}</h3>
          <p>
            "${cleanSeriesName}" içeriği seçili kategorideki aktif depolarda yer almamaktadır.
          </p>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center;">
            <button id="btn-switch-subtitled-fallback" class="btn-primary btn-switch-category-fallback">
              <i data-lucide="repeat" style="width: 16px; height: 16px;"></i>
              <span>${currentCategory === 'dubbed' ? '💬 Türkçe Altyazılı VidAPI & VIP Sunuculara Geç' : '🇹🇷 Türkçe Dublaj Sunucularına Geç'}</span>
            </button>
            <button id="btn-retry-discovery" class="btn-secondary" style="padding: 0.55rem 1.1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
              <span>Yeniden Tara</span>
            </button>
          </div>
        </div>
      `;
    }

    const isDirectPlayable = Boolean(
      srv.isDirectVideo ||
      srv.isHls ||
      (srv.streamUrl && !srv.streamUrl.startsWith('magnet:') && (srv.streamUrl.includes('.m3u8') || srv.streamUrl.includes('.mp4') || srv.streamUrl.includes('.mkv') || srv.streamUrl.includes(':4000/torrent/')))
    );

    if (isDirectPlayable) {
      const streamUrl = getStreamSafeUrl(srv);

      // Dual-Audio Toggle Bar (shown when hybrid dubbed audio is available and separate from main video)
      const isSameStream = srv.dubbedAudioUrl && (streamUrl === srv.dubbedAudioUrl);
      const hasDubbedAudio = srv.dubbedAudioUrl && srv.dubbedAudioUrl.length > 5 && !isSameStream;
      const dualAudioBarHTML = hasDubbedAudio ? `
        <div class="dual-audio-bar" id="dual-audio-bar">
          <div class="dual-audio-label">
            <i data-lucide="headphones" style="width: 14px; height: 14px; color: #f59e0b;"></i>
            <span>Ses Kaynağı:</span>
          </div>
          <div class="dual-audio-toggle">
            <button id="btn-audio-original" class="dual-audio-btn ${currentCategory === 'subtitled' ? 'active' : ''}" title="Orijinal Ses">
              <span>🇬🇧 Orijinal</span>
            </button>
            <button id="btn-audio-dubbed" class="dual-audio-btn ${currentCategory === 'dubbed' ? 'active' : ''}" title="Türkçe Dublaj Sesi">
              <span>🇹🇷 TR Dublaj</span>
            </button>
          </div>
          <span class="dual-audio-source-name" title="${srv.dubbedAudioName || ''}">
            Ses: ${srv.dubbedAudioName || 'TR Dublaj'}
          </span>
        </div>
      ` : '';

      // Resolve effective subtitles (check current srv, then fallback to any available subtitles in active servers)
      const effectiveSubtitles = resolveEffectiveSubtitles(srv);

      // Default active subtitle index: if in 'subtitled' mode, default to 0 (Turkish); if in 'dubbed', default to -1 (off)
      const defaultSubIndex = (currentCategory === 'subtitled' && effectiveSubtitles.length > 0) ? 0 : -1;

      const tracksHTML = effectiveSubtitles.map((sub, idx) => {
        let safeSrc = sub.src;
        if (safeSrc && safeSrc.startsWith('http')) {
          safeSrc = `/api/proxy?url=${encodeURIComponent(safeSrc)}`;
        }
        const isTr = (sub.label || '').toLowerCase().includes('türk') || (sub.label || '').toLowerCase().includes('tr');
        return `
          <track 
            kind="subtitles" 
            label="${sub.label || 'Altyazı'}" 
            src="${safeSrc}" 
            srclang="${isTr ? 'tr' : 'en'}" 
            ${idx === defaultSubIndex ? 'default' : ''}>
        `;
      }).join('');

      // Hidden dubbed audio element for dual-audio sync (offscreen, not display:none to allow playback)
      const dubbedAudioHTML = hasDubbedAudio ? `
        <video id="dubbed-audio-source" style="position: absolute; left: -9999px; top: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none;" preload="auto"></video>
      ` : '';

      return `
        <div class="direct-video-wrapper" id="direct-video-wrapper">
          <!-- Cinema Ambient Glow Layer (YouTube Style) -->
          <div class="player-ambient-glow" id="player-ambient-glow">
            <canvas id="player-ambient-canvas" class="player-ambient-canvas"></canvas>
          </div>

          ${dualAudioBarHTML}
          <video 
            id="hls-video-player" 
            autoplay 
            playsinline
            webkit-playsinline
            crossorigin="anonymous"
            preload="auto">
            ${tracksHTML}
          </video>
          ${dubbedAudioHTML}
          <!-- Screen Lock / Unlock Overlay Buttons -->
          <button class="custom-screen-lock-btn" id="custom-btn-screen-lock" title="Ekranı Kilitle">
            <i data-lucide="unlock" style="width: 16px; height: 16px;"></i>
          </button>
          <button class="custom-screen-unlock-badge hidden" id="custom-btn-screen-unlock" title="Kilidi Aç">
            <i data-lucide="lock" style="width: 15px; height: 15px; color: #fbbf24;"></i>
            <span>Ekran Kilitli • Dokunarak Aç</span>
          </button>

          <!-- Center Click Ripple Animation -->
          <div class="custom-center-play-indicator" id="custom-center-play-indicator">
            <i data-lucide="play" style="width: 32px; height: 32px;"></i>
          </div>

          <!-- Mobile Gesture HUD (Brightness / Volume Visualizer) -->
          <div class="custom-gesture-hud hidden" id="custom-gesture-hud">
            <div class="gesture-hud-icon-wrap" id="gesture-hud-icon-wrap">
              <i data-lucide="sun" id="gesture-hud-icon" style="width: 24px; height: 24px;"></i>
            </div>
            <span class="gesture-hud-text" id="gesture-hud-text">%100</span>
            <div class="gesture-hud-bar">
              <div class="gesture-hud-fill" id="gesture-hud-fill" style="height: 100%;"></div>
            </div>
          </div>

          <!-- Sleep Curtain (Active when sleep timer fires) -->
          <div class="custom-sleep-curtain hidden" id="custom-sleep-curtain">
            <div class="sleep-curtain-box">
              <i data-lucide="moon" style="width: 44px; height: 44px; color: #c084fc;"></i>
              <h3>Uyku Modu Aktif 🌙</h3>
              <p>Zamanlayıcı süresi doldu ve yayın duraklatıldı. Devam etmek için ekrana dokunun.</p>
            </div>
          </div>

          <!-- Skip Intro Button (Appears around 0:10 - 1:30) -->
          <button class="custom-skip-intro-btn hidden" id="custom-btn-skip-intro" title="Jeneriği Atla">
            <i data-lucide="fast-forward" style="width: 15px; height: 15px;"></i>
            <span>İntroyu Atla</span>
          </button>

          <!-- Auto Next Episode Binge Countdown Card (Netflix-Style) -->
          <div class="custom-binge-card hidden" id="custom-binge-card">
            <div class="binge-card-body">
              <span class="binge-card-tag">SONRAKİ BÖLÜM</span>
              <span class="binge-card-title" id="binge-card-title">${cleanSeriesName} • Bölüm ${currentEpisode + 1}</span>
              <span class="binge-card-sub"><b id="binge-sec-num">5</b> saniye içinde başlıyor...</span>
            </div>
            <button class="binge-card-jump-btn" id="binge-card-jump-btn">
              <i data-lucide="play" style="width: 14px; height: 14px;"></i>
              <span>Hemen Geç</span>
            </button>
            <button class="binge-card-close-btn" id="binge-card-close-btn" title="Kapat">
              <i data-lucide="x" style="width: 13px; height: 13px;"></i>
            </button>
          </div>

          <!-- Bottom Custom Control Bar -->
          <div class="custom-player-controls" id="custom-player-controls">
            <!-- Timeline Scrubber -->
            <div class="custom-timeline-container" id="custom-timeline-container">
              <div class="custom-timeline-bg">
                <div class="custom-timeline-buffered" id="custom-timeline-buffered"></div>
                <div class="custom-timeline-played" id="custom-timeline-played"></div>
              </div>
              <div class="custom-timeline-thumb" id="custom-timeline-thumb"></div>
              <div class="custom-timeline-tooltip" id="custom-timeline-tooltip">0:00</div>
            </div>

            <!-- Controls Row -->
            <div class="custom-controls-row">
              <div class="custom-controls-left">
                <button class="custom-ctrl-btn custom-ctrl-btn-skip" id="custom-btn-rewind-10" title="10 Saniye Geri (←)">
                  <i data-lucide="rotate-ccw" style="width: 19px; height: 19px;"></i>
                  <span class="custom-btn-badge-10">10</span>
                </button>
                <button class="custom-ctrl-btn" id="custom-btn-play" title="Oynat / Duraklat (Space)">
                  <i data-lucide="pause" style="width: 20px; height: 20px;"></i>
                </button>
                <button class="custom-ctrl-btn custom-ctrl-btn-skip" id="custom-btn-forward-10" title="10 Saniye İleri (→)">
                  <i data-lucide="rotate-cw" style="width: 19px; height: 19px;"></i>
                  <span class="custom-btn-badge-10">10</span>
                </button>
                <div class="custom-time-display" id="custom-time-display">0:00 / 0:00</div>
              </div>

              <div class="custom-controls-right">
                <!-- Brightness Slider Wrap (Vertical Popover Upwards) -->
                <div class="custom-slider-popup-wrap custom-brightness-wrap" id="custom-brightness-wrap" title="Parlaklık Ayarı">
                  <button class="custom-ctrl-btn" id="custom-btn-brightness" title="Parlaklık Aç / Kıs">
                    <i data-lucide="sun" style="width: 19px; height: 19px; color: #fbbf24;"></i>
                  </button>
                  <div class="custom-vertical-slider-popover" id="custom-brightness-popover">
                    <span class="custom-slider-val-badge" id="custom-brightness-badge">%100</span>
                    <div class="custom-vertical-track-wrap">
                      <input type="range" class="custom-vertical-slider" id="custom-brightness-slider" min="30" max="150" step="5" value="100" />
                    </div>
                  </div>
                </div>

                <!-- Volume Wrap (Vertical Popover Upwards) -->
                <div class="custom-slider-popup-wrap custom-volume-wrap" id="custom-volume-wrap" title="Ses Seviyesi">
                  <button class="custom-ctrl-btn" id="custom-btn-volume" title="Ses">
                    <i data-lucide="volume-2" style="width: 20px; height: 20px;"></i>
                  </button>
                  <div class="custom-vertical-slider-popover" id="custom-volume-popover">
                    <span class="custom-slider-val-badge" id="custom-volume-badge">%100</span>
                    <div class="custom-vertical-track-wrap">
                      <input type="range" class="custom-vertical-slider" id="custom-volume-slider" min="0" max="1" step="0.05" value="1" />
                    </div>
                  </div>
                </div>

                <!-- Sleep Timer Button -->
                <button class="custom-ctrl-btn" id="custom-btn-sleep" title="Uyku Zamanlayıcısı (Sleep Timer)">
                  <i data-lucide="moon" style="width: 19px; height: 19px; color: #c084fc;"></i>
                </button>

                <!-- Fullscreen Button -->
                <button class="custom-ctrl-btn" id="custom-btn-fullscreen" title="Tam Ekran (F)">
                  <i data-lucide="maximize" style="width: 20px; height: 20px;"></i>
                </button>

                <!-- Three-Dots Button (⋮) -->
                <button class="custom-ctrl-btn" id="custom-btn-more" title="Seçenekler">
                  <i data-lucide="more-vertical" style="width: 20px; height: 20px;"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Three-Dots Context Menu -->
          <div class="custom-player-menu hidden" id="custom-player-menu">
            <!-- Main View -->
            <div class="custom-menu-view" id="custom-menu-main">
              <!-- Item 1: Ses Kanalları -->
              <div class="custom-menu-item" id="custom-menu-item-audio">
                <div class="custom-menu-item-icon">
                  <i data-lucide="headphones" style="width: 17px; height: 17px; color: #f59e0b;"></i>
                </div>
                <div class="custom-menu-item-body">
                  <span class="custom-menu-item-title">Ses Kanalları</span>
                  <span class="custom-menu-item-sub" id="custom-menu-active-audio">${currentCategory === 'dubbed' ? 'Türkçe Dublaj' : 'Orijinal Ses'}</span>
                </div>
                <i data-lucide="chevron-right" style="width: 15px; height: 15px; color: #94a3b8;"></i>
              </div>

              <!-- Item 2: Altyazılar -->
              <div class="custom-menu-item" id="custom-menu-item-subs">
                <div class="custom-menu-item-icon">
                  <i data-lucide="subtitles" style="width: 17px; height: 17px; color: #60a5fa;"></i>
                </div>
                <div class="custom-menu-item-body">
                  <span class="custom-menu-item-title">Altyazılar</span>
                  <span class="custom-menu-item-sub" id="custom-menu-active-sub">Kapalı</span>
                </div>
                <i data-lucide="chevron-right" style="width: 15px; height: 15px; color: #94a3b8;"></i>
              </div>

              <!-- Item 3: Oynatma hızı -->
              <div class="custom-menu-item" id="custom-menu-item-speed">
                <div class="custom-menu-item-icon">
                  <i data-lucide="gauge" style="width: 17px; height: 17px; color: #a78bfa;"></i>
                </div>
                <div class="custom-menu-item-body">
                  <span class="custom-menu-item-title">Oynatma hızı</span>
                  <span class="custom-menu-item-sub" id="custom-menu-active-speed">Normal</span>
                </div>
                <i data-lucide="chevron-right" style="width: 15px; height: 15px; color: #94a3b8;"></i>
              </div>

              <!-- Item 4: Parlaklık -->
              <div class="custom-menu-item" id="custom-menu-item-brightness-menu">
                <div class="custom-menu-item-icon">
                  <i data-lucide="sun" style="width: 17px; height: 17px; color: #fbbf24;"></i>
                </div>
                <div class="custom-menu-item-body">
                  <span class="custom-menu-item-title">Parlaklık</span>
                  <span class="custom-menu-item-sub" id="custom-menu-active-brightness">%100</span>
                </div>
                <i data-lucide="chevron-right" style="width: 15px; height: 15px; color: #94a3b8;"></i>
              </div>

              <!-- Item 5: Pencere içinde pencere -->
              <div class="custom-menu-item" id="custom-menu-item-pip">
                <div class="custom-menu-item-icon">
                  <i data-lucide="picture-in-picture-2" style="width: 17px; height: 17px; color: #34d399;"></i>
                </div>
                <div class="custom-menu-item-body">
                  <span class="custom-menu-item-title">Pencere içinde pencere</span>
                </div>
              </div>

              <!-- Item 6: Uyku Zamanlayıcısı -->
              <div class="custom-menu-item" id="custom-menu-item-sleep-menu">
                <div class="custom-menu-item-icon">
                  <i data-lucide="moon" style="width: 17px; height: 17px; color: #c084fc;"></i>
                </div>
                <div class="custom-menu-item-body">
                  <span class="custom-menu-item-title">Uyku Zamanlayıcısı</span>
                  <span class="custom-menu-item-sub" id="custom-menu-active-sleep">Kapalı</span>
                </div>
                <i data-lucide="chevron-right" style="width: 15px; height: 15px; color: #94a3b8;"></i>
              </div>
            </div>

            <!-- Submenu View -->
            <div class="custom-menu-view hidden" id="custom-menu-subview">
              <div class="custom-menu-back-header" id="custom-menu-back-btn">
                <i data-lucide="chevron-left" style="width: 15px; height: 15px;"></i>
                <span id="custom-menu-subview-title">Geri</span>
              </div>
              <div class="custom-menu-options-list" id="custom-menu-options-list"></div>
            </div>
          </div>
        </div>
      `;
    }

    const finalIframeUrl = getStreamSafeUrl(srv);
    const iframeName = (srv.displayName || srv.name || 'Kaynak').replace(/[^a-z0-9]/gi, '_');
    return `
      <iframe 
        id="video-iframe"
        name="player_${iframeName}"
        src="${finalIframeUrl}" 
        allowfullscreen="true"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        loading="eager"
        allow="autoplay *; encrypted-media *; fullscreen *; picture-in-picture *; accelerometer *; gyroscope *; clipboard-write *"
        style="width:100%;height:100%;border:none;display:block;background:#000;">
      </iframe>
    `;
  }

  function renderFooterNavButtonsHTML() {
    if (!isSeries) return '';

    const currentSeasonEpCount = getSeasonEpisodeCount(currentSeason);
    const hasNextSeason = currentSeasonsList.some(s => s.season_number === currentSeason + 1);

    let nextBtnHTML = '';
    if (currentSeasonEpCount > 0) {
      if (currentEpisode < currentSeasonEpCount) {
        nextBtnHTML = `
          <button id="btn-next-episode" class="btn-primary btn-nav-episode btn-nav-next" data-action="next-ep">
            <span>Sonraki Bölüm (B${currentEpisode + 1})</span>
            <i data-lucide="chevron-right" style="width: 15px; height: 15px;"></i>
          </button>
        `;
      } else if (hasNextSeason) {
        nextBtnHTML = `
          <button id="btn-next-episode" class="btn-primary btn-nav-episode btn-nav-next-season" data-action="next-season">
            <span>Sonraki Sezon (S${currentSeason + 1} B1)</span>
            <i data-lucide="fast-forward" style="width: 15px; height: 15px;"></i>
          </button>
        `;
      } else {
        nextBtnHTML = `
          <span class="badge-series-finished">
            <i data-lucide="check-check" style="width: 14px; height: 14px;"></i>
            <span>Dizi Tamamlandı</span>
          </span>
        `;
      }
    } else {
      if (hasNextSeason) {
        nextBtnHTML = `
          <button id="btn-next-episode" class="btn-primary btn-nav-episode btn-nav-next-season" data-action="next-season">
            <span>Sonraki Sezon (S${currentSeason + 1} B1)</span>
            <i data-lucide="fast-forward" style="width: 15px; height: 15px;"></i>
          </button>
        `;
      } else {
        nextBtnHTML = `
          <span class="badge-series-finished">
            <i data-lucide="check-check" style="width: 14px; height: 14px;"></i>
            <span>Dizi Tamamlandı</span>
          </span>
        `;
      }
    }

    let prevBtnHTML = '';
    if (currentEpisode > 1) {
      prevBtnHTML = `
        <button id="btn-prev-episode" class="btn-secondary btn-nav-episode btn-nav-prev" data-action="prev-ep">
          <i data-lucide="chevron-left" style="width: 15px; height: 15px;"></i>
          <span>Önceki Bölüm (B${currentEpisode - 1})</span>
        </button>
      `;
    } else if (currentSeason > 1) {
      const prevSeasonCount = getSeasonEpisodeCount(currentSeason - 1) || 1;
      prevBtnHTML = `
        <button id="btn-prev-episode" class="btn-secondary btn-nav-episode btn-nav-prev-season" data-action="prev-season" data-prev-season="${currentSeason - 1}" data-prev-ep="${prevSeasonCount}">
          <i data-lucide="rewind" style="width: 15px; height: 15px;"></i>
          <span>Önceki Sezon (S${currentSeason - 1} B${prevSeasonCount})</span>
        </button>
      `;
    }

    return `${prevBtnHTML} ${nextBtnHTML}`;
  }

  function updateNavButtons() {
    const navGroup = document.getElementById('player-nav-btn-group');
    if (navGroup) {
      navGroup.innerHTML = renderFooterNavButtonsHTML();
      attachFooterNavEvents();
      renderPlayerIcons(modalContainer);
    }
  }

  // --- RENDER COMPLETE DIZISOL-STYLE CINEMA MODAL SHELL ---
  modalContainer.innerHTML = `
    <!-- Ambient Backdrop Aura Glow -->
    <div class="player-ambient-backdrop" ${backdropPath ? `style="background-image: url('${backdropPath}');"` : ''}></div>
    
    <div class="modal-content player-modal-content" id="cinema-modal-box">
      
      <!-- Top Cinematic Glassmorphism Bar -->
      <div class="player-cinema-bar">
        
        <!-- Left: Close Button, Title & Indicators -->
        <div class="player-header-left">
          <button id="player-close-btn" class="btn-player-close" title="Kapat (ESC)">
            <i data-lucide="arrow-left" class="icon-mobile-back" style="width: 18px; height: 18px;"></i>
            <i data-lucide="x" class="icon-desktop-close" style="width: 18px; height: 18px;"></i>
          </button>
          
          <div class="player-title-box">
            <span id="player-modal-title" class="player-header-title">${cleanSeriesName}</span>
            ${initialTime > 5 ? `
              <span id="player-resume-time-badge" class="player-resume-badge" title="Kaldığın Süre">
                <i data-lucide="clock" style="width: 11px; height: 11px;"></i>
                <span>${formatSecondsToTime(initialTime)}</span>
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Center: Dubbed / Subtitled Segmented Toggle -->
        <div class="player-header-toggle">
          <button id="tab-dubbed" class="cinema-tab-btn ${currentCategory === 'dubbed' ? 'active' : ''}">
            <span class="tab-flag">🇹🇷</span>
            <span>Dublaj</span>
          </button>
          <button id="tab-subtitled" class="cinema-tab-btn ${currentCategory === 'subtitled' ? 'active' : ''}">
            <span class="tab-flag">💬</span>
            <span>Altyazılı</span>
          </button>
        </div>

        <!-- Right: Action Icons (Shortcuts, Fullscreen, External) -->
        <div class="player-header-right">
          <button id="btn-player-shortcuts" class="btn-player-tool desktop-only-tool" title="Klavye Kısayolları (?)">
            <i data-lucide="keyboard" style="width: 16px; height: 16px;"></i>
          </button>

          <button id="btn-player-fullscreen" class="btn-player-tool" title="Tam Ekran / Sinema Modu (F)">
            <i data-lucide="maximize-2" style="width: 16px; height: 16px;"></i>
          </button>

          <a id="player-popout-btn" href="#" target="_blank" class="btn-player-tool desktop-only-tool" title="Harici Pencerede Aç">
            <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
          </a>
        </div>
      </div>

      <!-- Center Player Video Container -->
      <div class="player-stage-wrapper">
        <div class="player-iframe-container" id="player-iframe-wrapper">
          ${renderPlayerContent()}
        </div>

        <!-- Keyboard Shortcuts Help Popover -->
        <div class="shortcuts-popover hidden" id="player-shortcuts-popover">
          <div class="shortcuts-header">
            <h4><i data-lucide="keyboard" style="width: 16px; height: 16px; color: var(--primary);"></i> Klavye Kısayolları</h4>
            <button id="btn-close-shortcuts" class="btn-close-drawer"><i data-lucide="x" style="width: 14px; height: 14px;"></i></button>
          </div>
          <div class="shortcuts-grid">
            <div class="shortcut-item"><kbd>F</kbd><span>Tam Ekran / Sinema Modu</span></div>
            <div class="shortcut-item"><kbd>Space</kbd> / <kbd>K</kbd><span>Oynat / Duraklat</span></div>
            <div class="shortcut-item"><kbd>→</kbd> / <kbd>←</kbd><span>10 Saniye İleri / Geri</span></div>
            <div class="shortcut-item"><kbd>N</kbd><span>Sonraki Bölüm</span></div>
            <div class="shortcut-item"><kbd>P</kbd><span>Önceki Bölüm</span></div>
            <div class="shortcut-item"><kbd>M</kbd><span>Sesi Aç / Kapat</span></div>
            <div class="shortcut-item"><kbd>ESC</kbd><span>Oynatıcıyı Kapat</span></div>
          </div>
        </div>
      </div>

      <!-- Dizisol Cinema Body (Title, Genres, Overview & Carousel) -->
      <div class="dizisol-cinema-body">
        <div class="dizisol-meta-top">
          <div class="dizisol-meta-left">
            <h1 class="dizisol-title">${cleanSeriesName}</h1>
            <div class="dizisol-sub-row">
              <span class="dizisol-ep-badge">${type === 'tv' ? `Sezon ${currentSeason} • Bölüm ${currentEpisode}` : 'Film'}</span>
            </div>
          </div>
          <div class="dizisol-meta-actions">
            <button id="btn-player-theater" class="btn-dizisol-action action-icon-btn" title="Sinema Modu (Genişlet)">
              <i data-lucide="tv" style="width:16px;height:16px"></i>
              <span class="action-btn-text">Sinema</span>
            </button>
            <button id="btn-report-issue" class="btn-dizisol-action action-icon-btn" title="Hata Bildir">
              <i data-lucide="flag" style="width:16px;height:16px"></i>
              <span class="action-btn-text">Hata Bildir</span>
            </button>
            <button id="btn-open-sources-drawer" class="btn-dizisol-action action-icon-btn active-source-action" title="Yayın Hatları & Sunucular">
              <i data-lucide="server" style="width:16px;height:16px;color:#10b981"></i>
              <span class="action-btn-text" id="active-source-chip-label">Kaynak: ${getActiveServerName()}</span>
            </button>
            <button id="btn-toggle-list" class="btn-dizisol-action action-pill-btn ${isWatched ? 'watched-active' : ''}" title="Listeme Ekle / İzlendi">
              <i data-lucide="${isWatched ? 'check-circle-2' : 'plus'}" style="width:15px;height:15px"></i>
              <span id="list-action-label">${isWatched ? 'İzlendi' : 'Listeme Ekle'}</span>
            </button>
          </div>
        </div>

        <div class="dizisol-genre-chips" id="dizisol-genre-chips">
          ${mediaGenres.map(g => `<span class="dizisol-genre-chip">${g}</span>`).join('')}
        </div>

        <p class="dizisol-overview" id="dizisol-overview">
          ${isSeries ? (currentEpisodeOverview || 'Bölüm özeti hazırlanıyor...') : (mediaOverview || 'İçerik bilgileri hazırlanıyor...')}
        </p>

        <!-- SEZONLAR SECTION (Only for TV Series) -->
        ${isSeries ? `
          <div class="dizisol-seasons-section">
            <div class="dizisol-seasons-header">
              <h4>SEZONLAR</h4>
              <span class="dizisol-episodes-count" id="dizisol-episodes-total">Bölümler Yükleniyor...</span>
            </div>
            
            <!-- Season Tabs -->
            <div class="dizisol-season-tabs-rail">
              <div class="dizisol-season-tabs" id="dizisol-season-tabs">
                <!-- Injected dynamically -->
              </div>
            </div>

            <!-- Episodes Carousel -->
            <div class="dizisol-carousel-wrapper">
              <button class="carousel-nav-btn left" id="btn-carousel-left" title="Önceki Bölümler">
                <i data-lucide="chevron-left" style="width:20px;height:20px"></i>
              </button>
              <div class="dizisol-episodes-carousel" id="dizisol-episodes-carousel">
                <div class="drawer-loading">
                  <div class="drawer-spinner"></div>
                  <p>Bölümler hazırlanıyor...</p>
                </div>
              </div>
              <button class="carousel-nav-btn right" id="btn-carousel-right" title="Sonraki Bölümler">
                <i data-lucide="chevron-right" style="width:20px;height:20px"></i>
              </button>
            </div>
            <div class="dizisol-carousel-scroll-track" id="dizisol-carousel-scroll-track">
              <div class="dizisol-carousel-scroll-thumb" id="dizisol-carousel-scroll-thumb"></div>
            </div>
          </div>
        ` : `
          <!-- FILM BILGI, EKIP VE BENZER FILMLER (Only for Movies) -->
          <div class="dizisol-movie-section" id="dizisol-movie-section">
            <div class="drawer-loading" style="display:flex;align-items:center;gap:0.75rem;padding:1.5rem;color:#94a3b8;">
              <div class="drawer-spinner" style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.2);border-top-color:#e50914;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
              <p style="margin:0;font-size:0.85rem;">Film detayları ve benzer öneriler hazırlanıyor...</p>
            </div>
          </div>
        `}
      </div>

      <!-- Modern Footer Action Bar -->
      <div class="player-footer-bar">
        <div class="player-footer-left">
          <button id="btn-halfway-player" class="btn-footer-pill" title="Kaldığım Yeri Kaydet (20. dk)">
            <i data-lucide="clock" style="width: 14px; height: 14px; color: #fbbf24;"></i>
            <span>⏳ Yarıda Bırak</span>
          </button>
          <span class="player-status-badge">
            <i data-lucide="shield-check" style="width: 13px; height: 13px; color: #10b981;"></i>
            <span>Akıllı Güven Koruması Aktif</span>
          </span>
        </div>
        <div id="player-nav-btn-group" class="player-footer-right player-nav-btn-row">
          ${renderFooterNavButtonsHTML()}
        </div>
      </div>
    </div>

    <!-- Floating Glassmorphism Source Selector Modal -->
    <div class="player-sources-popover hidden" id="player-sources-popover">
      <div class="sources-popover-backdrop" id="sources-popover-backdrop"></div>
      <div class="sources-popover-content">
        <div class="sources-popover-header">
          <div class="sources-header-title">
            <i data-lucide="layers" style="width:16px;height:16px;color:#f59e0b"></i>
            <h4>Yayın Hatları & Sunucular</h4>
          </div>
          <button class="btn-close-popover" id="btn-close-sources-popover">
            <i data-lucide="x" style="width:16px;height:16px"></i>
          </button>
        </div>
        <div class="sources-popover-body">
          <p class="sources-popover-info">
            Yayınlar güven sıralamasına göre otomatik açılır. Herhangi bir hat yanıt vermezse sistem sıradaki hatta kesintisiz geçiş yapar.
          </p>
          <div class="sources-list" id="sources-popover-list">
            <!-- Rendered sources -->
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  renderPlayerIcons(modalContainer);

  // --- DRAWER CONTROLS & SEASON EPISODE FETCHING ---
  async function fetchSeasonEpisodes(sNum) {
    if (drawerEpisodesCache.has(sNum)) {
      return drawerEpisodesCache.get(sNum);
    }
    if (!tmdbId) return [];

    try {
      const res = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/season/${sNum}?api_key=${TMDB_API_KEY}&language=tr-TR`);
      if (res && res.ok) {
        const data = await res.json();
        const eps = data.episodes || [];
        drawerEpisodesCache.set(sNum, eps);
        return eps;
      }
    } catch (e) {}
    return [];
  }

  async function renderDrawerContent() {
    const tabsContainer = document.getElementById('dizisol-season-tabs');
    const carouselContainer = document.getElementById('dizisol-episodes-carousel');
    const totalCountEl = document.getElementById('dizisol-episodes-total');

    // Render Season Tabs
    const seasons = currentSeasonsList.length > 0
      ? currentSeasonsList
      : Array.from({ length: 5 }, (_, i) => ({ season_number: i + 1, name: `${i + 1}. Sezon` }));

    const seasonPillsHTML = seasons.map(s => {
      const seriesBaseName = cleanSeriesName || 'Sezon';
      const displayName = s.name && !s.name.toLowerCase().includes('sezon')
        ? s.name
        : (s.season_number === 1 ? seriesBaseName : `${seriesBaseName} ${s.season_number}`);

      return `
        <button class="dizisol-season-tab ${s.season_number === drawerSeason ? 'active' : ''}" data-season="${s.season_number}">
          ${displayName}
        </button>
      `;
    }).join('');

    if (tabsContainer) {
      tabsContainer.innerHTML = seasonPillsHTML;
      tabsContainer.querySelectorAll('.dizisol-season-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          const s = parseInt(btn.getAttribute('data-season'), 10);
          drawerSeason = s;
          btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          renderDrawerContent();
        });
      });

      const activeTab = tabsContainer.querySelector('.dizisol-season-tab.active');
      if (activeTab) {
        setTimeout(() => {
          activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 120);
      }

      // PC Mouse wheel horizontal scroll & drag
      const rail = document.querySelector('.dizisol-season-tabs-rail') || tabsContainer;
      if (rail && !rail._hasWheel) {
        rail._hasWheel = true;
        rail.addEventListener('wheel', (e) => {
          if (e.deltaY !== 0 && rail.scrollWidth > rail.clientWidth) {
            e.preventDefault();
            rail.scrollLeft += e.deltaY;
          }
        }, { passive: false });

        let isDown = false;
        let startX = 0;
        let scrollLeftPos = 0;
        let hasDragged = false;

        rail.addEventListener('mousedown', (e) => {
          if (e.button !== 0) return;
          isDown = true;
          hasDragged = false;
          startX = e.pageX - rail.offsetLeft;
          scrollLeftPos = rail.scrollLeft;
        });

        modalScope.on(window, 'mousemove', (e) => {
          if (!isDown) return;
          const x = e.pageX - rail.offsetLeft;
          const walk = (x - startX) * 1.5;
          if (Math.abs(walk) > 4) hasDragged = true;
          rail.scrollLeft = scrollLeftPos - walk;
        });

        modalScope.on(window, 'mouseup', () => {
          if (!isDown) return;
          isDown = false;
          setTimeout(() => { hasDragged = false; }, 50);
        });

        rail.addEventListener('click', (e) => {
          if (hasDragged) {
            e.preventDefault();
            e.stopPropagation();
          }
        }, true);
      }
    }

    const loadingHTML = `
      <div class="drawer-loading" style="display:flex;align-items:center;gap:0.75rem;padding:1.5rem;color:#94a3b8;">
        <div class="drawer-spinner" style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.2);border-top-color:#e50914;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
        <p style="margin:0;font-size:0.85rem;">Bölümler yükleniyor...</p>
      </div>
    `;

    if (carouselContainer) carouselContainer.innerHTML = loadingHTML;

    const requestedSeason = drawerSeason;
    const episodes = await fetchSeasonEpisodes(requestedSeason);
    if (closed || requestedSeason !== drawerSeason) return;
    const count = (episodes && episodes.length > 0) ? episodes.length : (getSeasonEpisodeCount(drawerSeason) || 12);
    if (totalCountEl) totalCountEl.textContent = `${count} Bölüm`;

    let carouselCardsHTML = '';

    if (!episodes || episodes.length === 0) {
      const arr = Array.from({ length: count }, (_, i) => i + 1);
      carouselCardsHTML = arr.map(epNum => {
        const isCurrent = drawerSeason === currentSeason && epNum === currentEpisode;
        const epWatched = isMediaWatched(tmdbId, drawerSeason, epNum);
        return `
          <div class="dizisol-ep-card ${isCurrent ? 'playing' : ''} ${epWatched ? 'is-watched-card' : ''}" data-season="${drawerSeason}" data-episode="${epNum}">
            <div class="dizisol-ep-thumb-box">
              <div class="ep-thumb-fallback" style="display:flex;align-items:center;justify-content:center;height:100%;color:#475569;"><i data-lucide="film" style="width:24px;height:24px"></i></div>
              <span class="dizisol-ep-badge-num ${isCurrent ? 'active' : ''}">${epNum}. Bölüm</span>
              <button class="dizisol-ep-watch-toggle ${epWatched ? 'is-watched' : ''}" data-season="${drawerSeason}" data-episode="${epNum}" title="${epWatched ? 'İzlendi (Kaldırmak için tıkla)' : 'İzlendi Olarak İşaretle'}">
                <i data-lucide="${epWatched ? 'check-circle-2' : 'eye'}" style="width: 13px; height: 13px;"></i>
                <span class="ep-watch-text">${epWatched ? 'İzlendi' : 'İşaretle'}</span>
              </button>
              ${isCurrent ? `
                <div class="dizisol-ep-play-circle">
                  <i data-lucide="play" style="width:16px;height:16px;fill:#fff;color:#fff;margin-left:2px;"></i>
                </div>
              ` : `
                <div class="dizisol-ep-play-overlay">
                  <i data-lucide="play" style="width:28px;height:28px;"></i>
                </div>
              `}
            </div>
            <div class="dizisol-ep-info">
              <h5 class="dizisol-ep-title" data-base-title="${epNum}. Bölüm" title="${epNum}. Bölüm">${epNum}. Bölüm ${epWatched ? '✓' : ''}</h5>
            </div>
          </div>
        `;
      }).join('');
    } else {
      carouselCardsHTML = episodes.map(ep => {
        const epNum = ep.episode_number;
        const isCurrent = drawerSeason === currentSeason && epNum === currentEpisode;
        const epWatched = isMediaWatched(tmdbId, drawerSeason, epNum);
        const stillUrl = ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : '';
        const durationText = ep.runtime ? `${ep.runtime}dk` : '';
        const airDateText = ep.air_date ? ep.air_date.substring(0, 7) : '';

        return `
          <div class="dizisol-ep-card ${isCurrent ? 'playing' : ''} ${epWatched ? 'is-watched-card' : ''}" data-season="${drawerSeason}" data-episode="${epNum}">
            <div class="dizisol-ep-thumb-box">
              ${stillUrl ? `<img src="${stillUrl}" alt="B${epNum}" loading="lazy" />` : `<div class="ep-thumb-fallback" style="display:flex;align-items:center;justify-content:center;height:100%;color:#475569;"><i data-lucide="film" style="width:24px;height:24px"></i></div>`}
              <span class="dizisol-ep-badge-num ${isCurrent ? 'active' : ''}">${epNum}. Bölüm</span>
              <button class="dizisol-ep-watch-toggle ${epWatched ? 'is-watched' : ''}" data-season="${drawerSeason}" data-episode="${epNum}" title="${epWatched ? 'İzlendi (Kaldırmak için tıkla)' : 'İzlendi Olarak İşaretle'}">
                <i data-lucide="${epWatched ? 'check-circle-2' : 'eye'}" style="width: 13px; height: 13px;"></i>
                <span class="ep-watch-text">${epWatched ? 'İzlendi' : 'İşaretle'}</span>
              </button>
              ${durationText ? `<span class="dizisol-ep-duration">${durationText}</span>` : ''}
              ${isCurrent ? `
                <div class="dizisol-ep-play-circle">
                  <i data-lucide="play" style="width:16px;height:16px;fill:#fff;color:#fff;margin-left:2px;"></i>
                </div>
              ` : `
                <div class="dizisol-ep-play-overlay">
                  <i data-lucide="play" style="width:28px;height:28px;"></i>
                </div>
              `}
            </div>
            <div class="dizisol-ep-info">
              <h5 class="dizisol-ep-title" data-base-title="${ep.name || `${epNum}. Bölüm`}" title="${ep.name || `${epNum}. Bölüm`}">${ep.name || `${epNum}. Bölüm`}${epWatched ? ' ✓' : ''}</h5>
              ${airDateText ? `<span class="dizisol-ep-date">${airDateText}</span>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    if (carouselContainer) {
      carouselContainer.innerHTML = carouselCardsHTML;

      // Attach Watch Toggle Event Listeners to each Episode Card
      carouselContainer.querySelectorAll('.dizisol-ep-watch-toggle').forEach(watchBtn => {
        watchBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          ev.preventDefault();
          const s = parseInt(watchBtn.getAttribute('data-season'), 10);
          const e = parseInt(watchBtn.getAttribute('data-episode'), 10);
          const res = toggleEpisodeWatched(tmdbId, s, e, {
            title: cleanSeriesName,
            posterPath,
            backdropPath,
            type: effectiveIsAnime ? 'anime' : 'tv',
            isAnime: effectiveIsAnime,
            isSeries: true
          });
          const nowWatched = res.completed;
          watchBtn.classList.toggle('is-watched', nowWatched);
          watchBtn.setAttribute('title', nowWatched ? 'İzlendi (Kaldırmak için tıkla)' : 'İzlendi Olarak İşaretle');
          watchBtn.innerHTML = `
            <i data-lucide="${nowWatched ? 'check-circle-2' : 'eye'}" style="width: 13px; height: 13px;"></i>
            <span class="ep-watch-text">${nowWatched ? 'İzlendi' : 'İşaretle'}</span>
          `;
          renderPlayerIcons(watchBtn);

          const card = watchBtn.closest('.dizisol-ep-card');
          if (card) {
            card.classList.toggle('is-watched-card', nowWatched);
            const titleEl = card.querySelector('.dizisol-ep-title');
            if (titleEl) {
              const baseTitle = titleEl.getAttribute('data-base-title') || titleEl.textContent.replace(/\s*✓.*$/, '');
              titleEl.textContent = `${baseTitle}${nowWatched ? ' ✓' : ''}`;
            }
          }

          if (s === currentSeason && e === currentEpisode) {
            isWatched = nowWatched;
            updateWatchedUI(nowWatched);
          }

          showToast(nowWatched ? `✓ S${s} B${e} izlendi olarak işaretlendi.` : `S${s} B${e} izlendi işareti kaldırıldı.`, 'info');
        });
      });

      carouselContainer.querySelectorAll('.dizisol-ep-card').forEach(card => {
        card.addEventListener('click', (ev) => {
          if (ev.target.closest('.dizisol-ep-watch-toggle')) return;
          const s = parseInt(card.getAttribute('data-season'), 10);
          const e = parseInt(card.getAttribute('data-episode'), 10);
          if (s === currentSeason && e === currentEpisode) return;
          switchEpisodeInPlayer(s, e);
        });
      });

      // Smoothly center the active episode card
      const playingCard = carouselContainer.querySelector('.dizisol-ep-card.playing');
      if (playingCard) {
        setTimeout(() => {
          playingCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 150);
      }

      // Scrollbar Thumb Movement Sync
      const updateScrollThumb = () => {
        const maxScroll = carouselContainer.scrollWidth - carouselContainer.clientWidth;
        const thumb = document.getElementById('dizisol-carousel-scroll-thumb');
        if (thumb && maxScroll > 0) {
          const ratio = carouselContainer.scrollLeft / maxScroll;
          thumb.style.transform = `translateX(${ratio * 150}%)`;
        }
      };
      carouselContainer.removeEventListener('scroll', updateScrollThumb);
      carouselContainer.onscroll = updateScrollThumb;
    }

    // Attach Carousel Left & Right Arrows
    const btnLeft = document.getElementById('btn-carousel-left');
    const btnRight = document.getElementById('btn-carousel-right');
    if (btnLeft && carouselContainer) {
      btnLeft.onclick = () => carouselContainer.scrollBy({ left: -360, behavior: 'smooth' });
    }
    if (btnRight && carouselContainer) {
      btnRight.onclick = () => carouselContainer.scrollBy({ left: 360, behavior: 'smooth' });
    }

    renderPlayerIcons(modalContainer);
  }

  // Trigger initial drawer & mobile episode rail rendering for TV & Anime series, or movie info section
  if (isSeries) {
    renderDrawerContent();
    updateEpisodeOverview(currentSeason, currentEpisode);
  } else {
    renderMovieInfoSection();
  }
  async function renderQuickEpisodesRail() {
    const rail = document.getElementById('player-quick-episodes-rail');
    const countText = document.getElementById('quick-ep-count-text');
    if (!rail) return;

    rail.innerHTML = `
      <div class="quick-ep-loading">
        <div class="quick-ep-spinner"></div>
        <span>Bölümler yükleniyor...</span>
      </div>
    `;

    const requestedSeason = currentSeason;
    const episodes = await fetchSeasonEpisodes(requestedSeason);
    if (closed || requestedSeason !== currentSeason) return;
    const count = (episodes && episodes.length > 0) ? episodes.length : (getSeasonEpisodeCount(currentSeason) || 12);
    if (countText) countText.textContent = `${count} Bölüm`;

    if (!episodes || episodes.length === 0) {
      rail.innerHTML = Array.from({ length: count }, (_, i) => i + 1).map(epNum => {
        const isCurrent = epNum === currentEpisode;
        const epWatched = isMediaWatched(tmdbId, currentSeason, epNum);
        return `
          <div class="quick-ep-card ${isCurrent ? 'active' : ''}" data-season="${currentSeason}" data-episode="${epNum}">
            <div class="quick-ep-pill">
              <span class="quick-ep-num">B${epNum}</span>
              ${isCurrent ? '<span class="quick-ep-now">Oynatılıyor</span>' : ''}
              ${epWatched && !isCurrent ? '<i data-lucide="check" class="quick-ep-watched"></i>' : ''}
            </div>
          </div>
        `;
      }).join('');
    } else {
      rail.innerHTML = episodes.map(ep => {
        const epNum = ep.episode_number;
        const isCurrent = epNum === currentEpisode;
        const epWatched = isMediaWatched(tmdbId, currentSeason, epNum);
        const stillUrl = ep.still_path ? `https://image.tmdb.org/t/p/w200${ep.still_path}` : '';
        return `
          <div class="quick-ep-card ${isCurrent ? 'active' : ''}" data-season="${currentSeason}" data-episode="${epNum}">
            ${stillUrl ? `<div class="quick-ep-thumb"><img src="${stillUrl}" alt="B${epNum}" loading="lazy" /></div>` : ''}
            <div class="quick-ep-info">
              <div class="quick-ep-title-row">
                <span class="quick-ep-num">B${epNum}</span>
                <span class="quick-ep-name">${ep.name || `${epNum}. Bölüm`}</span>
              </div>
              ${isCurrent ? '<span class="quick-ep-now">Oynatılıyor</span>' : (epWatched ? '<span class="quick-ep-watched-label">İzlendi</span>' : '')}
            </div>
          </div>
        `;
      }).join('');
    }

    rail.querySelectorAll('.quick-ep-card').forEach(card => {
      card.addEventListener('click', () => {
        const s = parseInt(card.getAttribute('data-season'), 10);
        const e = parseInt(card.getAttribute('data-episode'), 10);
        if (s === currentSeason && e === currentEpisode) return;
        switchEpisodeInPlayer(s, e);
      });
    });

    renderPlayerIcons(modalContainer);

    // Auto-scroll active card into view
    const activeCard = rail.querySelector('.quick-ep-card.active');
    if (activeCard) {
      setTimeout(() => {
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }, 100);
    }
  }

  function toggleDrawer(forceState) {
    const drawer = document.getElementById('player-episode-drawer');
    if (!drawer) return;
    isDrawerOpen = (typeof forceState === 'boolean') ? forceState : !isDrawerOpen;
    if (isDrawerOpen) {
      drawer.classList.remove('hidden');
      drawerSeason = currentSeason;
      renderDrawerContent();
    } else {
      drawer.classList.add('hidden');
    }
  }

  const btnToggleDrawer = document.getElementById('btn-toggle-drawer');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const btnDrawerMobile = document.getElementById('btn-drawer-trigger-mobile');
  if (btnToggleDrawer) btnToggleDrawer.addEventListener('click', () => toggleDrawer());
  if (btnCloseDrawer) btnCloseDrawer.addEventListener('click', () => toggleDrawer(false));
  if (btnDrawerMobile) btnDrawerMobile.addEventListener('click', () => toggleDrawer());

  // --- SHORTCUTS POPOVER ---
  function toggleShortcuts(forceState) {
    const pop = document.getElementById('player-shortcuts-popover');
    if (!pop) return;
    isShortcutsOpen = (typeof forceState === 'boolean') ? forceState : !isShortcutsOpen;
    if (isShortcutsOpen) {
      pop.classList.remove('hidden');
    } else {
      pop.classList.add('hidden');
    }
  }

  const btnShortcuts = document.getElementById('btn-player-shortcuts');
  const btnCloseShortcuts = document.getElementById('btn-close-shortcuts');
  if (btnShortcuts) btnShortcuts.addEventListener('click', () => toggleShortcuts());
  if (btnCloseShortcuts) btnCloseShortcuts.addEventListener('click', () => toggleShortcuts(false));

  // --- FULLSCREEN TOGGLE ---
  const btnFullscreen = document.getElementById('btn-player-fullscreen');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      const modalBox = document.getElementById('cinema-modal-box') || document.documentElement;
      const iframeEl = document.getElementById('video-iframe');
      const videoEl = document.getElementById('hls-video-player');
      const target = iframeEl || videoEl || modalBox;
      if (!document.fullscreenElement) {
        if (target && target.requestFullscreen) {
          target.requestFullscreen().catch(() => modalBox.requestFullscreen().catch(() => {}));
        } else if (target && target.webkitRequestFullscreen) {
          target.webkitRequestFullscreen();
        } else if (modalBox.requestFullscreen) {
          modalBox.requestFullscreen().catch(() => {});
        }
      } else {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    });
  }

  function attachFooterNavEvents() {
    const prevEpBtn = document.getElementById('btn-prev-episode');
    if (prevEpBtn) {
      prevEpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = prevEpBtn.getAttribute('data-action');
        if (action === 'prev-ep' && currentEpisode > 1) {
          switchEpisodeInPlayer(currentSeason, currentEpisode - 1);
        } else if (action === 'prev-season') {
          const prevS = parseInt(prevEpBtn.getAttribute('data-prev-season'), 10) || 1;
          const prevE = parseInt(prevEpBtn.getAttribute('data-prev-ep'), 10) || 1;
          switchEpisodeInPlayer(prevS, prevE);
        }
      });
    }

    const nextEpBtn = document.getElementById('btn-next-episode');
    if (nextEpBtn) {
      nextEpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        markEpisodeWatched(tmdbId, currentSeason, currentEpisode, true, {
          title: cleanSeriesName,
          posterPath,
          backdropPath,
          type: effectiveIsAnime ? 'anime' : (isSeries ? 'tv' : 'movie'),
          isAnime: effectiveIsAnime,
          duration: estimatedDuration
        });
        const action = nextEpBtn.getAttribute('data-action');
        if (action === 'next-season') {
          switchEpisodeInPlayer(currentSeason + 1, 1);
        } else {
          switchEpisodeInPlayer(currentSeason, currentEpisode + 1);
        }
      });
    }
  }

  attachFooterNavEvents();

  const handleToggleWatched = () => {
    isWatched = !isWatched;
    if (isSeries) {
      markEpisodeWatched(tmdbId, currentSeason, currentEpisode, isWatched, {
        title: cleanSeriesName,
        posterPath,
        backdropPath,
        type: effectiveIsAnime ? 'anime' : 'tv',
        isAnime: effectiveIsAnime,
        duration: estimatedDuration
      });
    } else {
      markMediaWatched(tmdbId, isWatched, {
        title: cleanSeriesName,
        posterPath,
        backdropPath,
        type: effectiveIsAnime ? 'anime' : 'movie',
        isAnime: effectiveIsAnime,
        duration: estimatedDuration
      });
    }

    [document.getElementById('btn-toggle-watched-player'), document.getElementById('btn-toggle-watched-mobile')].forEach(btn => {
      if (!btn) return;
      const span = btn.querySelector('span');
      const icon = btn.querySelector('[data-lucide]');
      if (span) span.textContent = isWatched ? 'İzlendi' : 'İzlendi Yap';
      if (icon) icon.setAttribute('data-lucide', isWatched ? 'check-circle-2' : 'check');
      if (isWatched) {
        btn.classList.add('watched-active');
      } else {
        btn.classList.remove('watched-active');
      }
    });

    showToast(isWatched ? '✓ İzlendi olarak işaretlendi.' : 'İzlendi işareti kaldırıldı.', 'success');
    if (isSeries) renderDrawerContent();
    renderPlayerIcons(modalContainer);
  };

  const handleHalfway = () => {
    saveWatchProgress({
      id: tmdbId,
      title: cleanSeriesName,
      posterPath,
      backdropPath,
      type: effectiveIsAnime ? 'anime' : (isSeries ? 'tv' : 'movie'),
      isAnime: effectiveIsAnime,
      isSeries: isSeries,
      season: currentSeason,
      episode: currentEpisode,
      currentTime: 1200,
      duration: estimatedDuration
    });
    showToast('⏳ 20. dakikada yarıda bırakıldı olarak kaydedildi.', 'info');
  };

  const btnWatchedDesktop = document.getElementById('btn-toggle-watched-player');
  const btnWatchedMobile = document.getElementById('btn-toggle-watched-mobile');
  if (btnWatchedDesktop) btnWatchedDesktop.addEventListener('click', handleToggleWatched);
  if (btnWatchedMobile) btnWatchedMobile.addEventListener('click', handleToggleWatched);

  const btnHalfwayDesktop = document.getElementById('btn-halfway-player');
  const btnHalfwayMobile = document.getElementById('btn-halfway-mobile');
  if (btnHalfwayDesktop) btnHalfwayDesktop.addEventListener('click', handleHalfway);
  if (btnHalfwayMobile) btnHalfwayMobile.addEventListener('click', handleHalfway);

  function updateServerPillsEvents() {
    const toolbar = document.getElementById('player-server-toolbar');
    if (!toolbar) return;
    toolbar.innerHTML = renderServerPills();

    // Enable Horizontal Mouse Wheel Scroll & Touch Drag Support
    if (!toolbar.dataset.scrollAttached) {
      toolbar.dataset.scrollAttached = 'true';
      
      toolbar.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          toolbar.scrollLeft += e.deltaY * 1.5;
        }
      }, { passive: false });

      // Mouse drag-to-scroll
      let isDown = false;
      let startX;
      let scrollLeft;

      toolbar.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - toolbar.offsetLeft;
        scrollLeft = toolbar.scrollLeft;
      });
      toolbar.addEventListener('mouseleave', () => {
        isDown = false;
      });
      toolbar.addEventListener('mouseup', () => {
        isDown = false;
      });
      toolbar.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - toolbar.offsetLeft;
        const walk = (x - startX) * 2;
        toolbar.scrollLeft = scrollLeft - walk;
      });
    }

    toolbar.querySelectorAll('.server-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        if (idx === currentServerIndex) return;

        currentServerIndex = idx;
        toolbar.querySelectorAll('.server-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Scroll active button into view smoothly
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        updatePlayerContainer();
      });
    });
  }

  function initCustomPlayerControls(videoEl, srv) {
    if (!videoEl) return;
    const wrapper = document.getElementById('direct-video-wrapper') || videoEl.closest('.direct-video-wrapper');
    if (!wrapper) return;

    const { on, setTimeout, clearTimeout, setInterval, clearInterval } = playbackScope;

    const playBtn = wrapper.querySelector('#custom-btn-play');
    const timeDisplay = wrapper.querySelector('#custom-time-display');
    const timelineContainer = wrapper.querySelector('#custom-timeline-container');
    const playedBar = wrapper.querySelector('#custom-timeline-played');
    const bufferedBar = wrapper.querySelector('#custom-timeline-buffered');
    const thumb = wrapper.querySelector('#custom-timeline-thumb');
    const tooltip = wrapper.querySelector('#custom-timeline-tooltip');
    const volWrap = wrapper.querySelector('#custom-volume-wrap');
    const volBtn = wrapper.querySelector('#custom-btn-volume');
    const volSlider = wrapper.querySelector('#custom-volume-slider');
    const volBadge = wrapper.querySelector('#custom-volume-badge');
    const volPopover = wrapper.querySelector('#custom-volume-popover');

    const fsBtn = wrapper.querySelector('#custom-btn-fullscreen');
    const moreBtn = wrapper.querySelector('#custom-btn-more');
    const menu = wrapper.querySelector('#custom-player-menu');
    const mainView = wrapper.querySelector('#custom-menu-main');
    const subview = wrapper.querySelector('#custom-menu-subview');
    const subviewTitle = wrapper.querySelector('#custom-menu-subview-title');
    const subviewList = wrapper.querySelector('#custom-menu-options-list');
    const backBtn = wrapper.querySelector('#custom-menu-back-btn');
    const centerIndicator = wrapper.querySelector('#custom-center-play-indicator');

    const rewindBtn = wrapper.querySelector('#custom-btn-rewind-10');
    const forwardBtn = wrapper.querySelector('#custom-btn-forward-10');

    const brightWrap = wrapper.querySelector('#custom-brightness-wrap');
    const brightBtn = wrapper.querySelector('#custom-btn-brightness');
    const brightSlider = wrapper.querySelector('#custom-brightness-slider');
    const brightBadge = wrapper.querySelector('#custom-brightness-badge');
    const brightPopover = wrapper.querySelector('#custom-brightness-popover');

    // Faz 2 Elements
    const lockBtn = wrapper.querySelector('#custom-btn-screen-lock');
    const unlockBadge = wrapper.querySelector('#custom-btn-screen-unlock');
    const skipIntroBtn = wrapper.querySelector('#custom-btn-skip-intro');
    const bingeCard = wrapper.querySelector('#custom-binge-card');
    const bingeSecNum = wrapper.querySelector('#binge-sec-num');
    const bingeJumpBtn = wrapper.querySelector('#binge-card-jump-btn');
    const bingeCloseBtn = wrapper.querySelector('#binge-card-close-btn');
    const sleepBtn = wrapper.querySelector('#custom-btn-sleep');
    const itemSleepMenu = wrapper.querySelector('#custom-menu-item-sleep-menu');
    const activeSleepBadge = wrapper.querySelector('#custom-menu-active-sleep');
    const sleepCurtain = wrapper.querySelector('#custom-sleep-curtain');
    const gestureHud = wrapper.querySelector('#custom-gesture-hud');
    let gestureIcon = wrapper.querySelector('#gesture-hud-icon');
    const gestureText = wrapper.querySelector('#gesture-hud-text');
    const gestureFill = wrapper.querySelector('#gesture-hud-fill');

    // Cinema Ambient Mode Glow (Pure CSS GPU-free smooth ambient glow)
    const ambientBox = wrapper.querySelector('#player-ambient-glow');
    const ambientCanvas = wrapper.querySelector('#player-ambient-canvas');
    if (ambientCanvas) ambientCanvas.style.display = 'none';
    if (ambientBox) ambientBox.style.background = 'radial-gradient(circle at center, rgba(245, 158, 11, 0.16) 0%, rgba(20, 184, 166, 0.08) 50%, transparent 75%)';

    // Screen Lock State
    let isScreenLocked = false;
    if (lockBtn) {
      lockBtn.onclick = (e) => {
        e.stopPropagation();
        isScreenLocked = true;
        wrapper.classList.add('is-screen-locked');
        if (unlockBadge) unlockBadge.classList.remove('hidden');
        closeOpenControlPopovers();
        wrapper.classList.add('hide-controls');
        showToast('🔒 Ekran kilitlendi. Dokunmalar korumalı.', 'info');
      };
    }

    if (unlockBadge) {
      unlockBadge.onclick = (e) => {
        e.stopPropagation();
        isScreenLocked = false;
        wrapper.classList.remove('is-screen-locked');
        unlockBadge.classList.add('hidden');
        resetHideTimer();
        showToast('🔓 Ekran kilidi açıldı.', 'success');
      };
    }

    // Skip Intro State
    let hasSkippedIntro = false;
    if (skipIntroBtn) {
      skipIntroBtn.onclick = (e) => {
        e.stopPropagation();
        hasSkippedIntro = true;
        skipIntroBtn.classList.add('hidden');
        const cur = videoEl.currentTime || 0;
        const target = Math.max(cur + 80, 85);
        videoEl.currentTime = Math.min(videoEl.duration || target, target);
        showToast('⚡ İntro başarıyla atlandı!', 'success');
      };
    }

    // Binge Next Episode Countdown State
    let bingeTimer = null;
    let bingeDismissed = false;
    let bingeCountdown = 5;

    const triggerNextEpisode = () => {
      if (bingeTimer) {
        clearInterval(bingeTimer);
        bingeTimer = null;
      }
      if (bingeCard) bingeCard.classList.add('hidden');
      const nextBtn = document.getElementById('btn-next-episode');
      if (nextBtn) {
        showToast('Sonraki bölüme geçiliyor...', 'info');
        nextBtn.click();
      }
    };

    if (bingeJumpBtn) {
      bingeJumpBtn.onclick = (e) => {
        e.stopPropagation();
        triggerNextEpisode();
      };
    }

    if (bingeCloseBtn) {
      bingeCloseBtn.onclick = (e) => {
        e.stopPropagation();
        bingeDismissed = true;
        if (bingeTimer) {
          clearInterval(bingeTimer);
          bingeTimer = null;
        }
        if (bingeCard) bingeCard.classList.add('hidden');
      };
    }

    // 1. Play / Pause & Skip Control
    const updatePlayState = () => {
      const isPaused = videoEl.paused;
      if (playBtn && playBtn.dataset.paused !== String(isPaused)) {
        playBtn.dataset.paused = String(isPaused);
        playBtn.innerHTML = `<i data-lucide="${isPaused ? 'play' : 'pause'}" style="width: 20px; height: 20px;"></i>`;
        renderPlayerIcons(playBtn);
      }
      if (isPaused) {
        wrapper.classList.remove('hide-controls');
      }
    };

    const togglePlay = () => {
      if (videoEl.paused) {
        videoEl.play().catch(() => {});
        showCenterAnimation('play');
      } else {
        videoEl.pause();
        showCenterAnimation('pause');
      }
    };

    const skipTime = (seconds) => {
      const cur = videoEl.currentTime || 0;
      const dur = videoEl.duration || Infinity;
      const target = Math.max(0, Math.min(dur, cur + seconds));
      videoEl.currentTime = target;
      showCenterAnimation(seconds > 0 ? 'rotate-cw' : 'rotate-ccw');
      showToast(seconds > 0 ? '⏩ +10 saniye' : '⏪ -10 saniye', 'info');
    };

    if (rewindBtn) rewindBtn.onclick = (e) => { e.stopPropagation(); skipTime(-10); };
    if (forwardBtn) forwardBtn.onclick = (e) => { e.stopPropagation(); skipTime(10); };

    // Brightness Control
    let currentBrightness = 100;
    const setBrightness = (pct) => {
      currentBrightness = Math.max(30, Math.min(150, pct));
      videoEl.style.filter = `brightness(${currentBrightness / 100})`;
      if (brightSlider) brightSlider.value = currentBrightness;
      if (brightBadge) brightBadge.textContent = `%${currentBrightness}`;
      const brightMenuSub = wrapper.querySelector('#custom-menu-active-brightness');
      if (brightMenuSub) brightMenuSub.textContent = `%${currentBrightness}`;
    };

    if (brightPopover) {
      brightPopover.onclick = (e) => e.stopPropagation();
      brightPopover.ontouchstart = (e) => e.stopPropagation();
    }

    if (brightSlider) {
      brightSlider.oninput = (e) => {
        e.stopPropagation();
        resetPopoverHideTimer();
        setBrightness(parseInt(brightSlider.value, 10));
      };
    }
    if (brightBtn) {
      brightBtn.onclick = (e) => {
        e.stopPropagation();
        if (brightWrap) {
          const isOpen = brightWrap.classList.contains('is-open');
          if (volWrap) volWrap.classList.remove('is-open');
          if (isOpen) {
            brightWrap.classList.remove('is-open');
            resetHideTimer();
          } else {
            brightWrap.classList.add('is-open');
            resetPopoverHideTimer();
          }
        }
      };
    }

    const showCenterAnimation = (iconName) => {
      if (!centerIndicator) return;
      centerIndicator.innerHTML = `<i data-lucide="${iconName}" style="width: 32px; height: 32px;"></i>`;
      renderPlayerIcons(centerIndicator);
      centerIndicator.classList.add('animate');
      setTimeout(() => centerIndicator.classList.remove('animate'), 350);
    };

    if (playBtn) playBtn.onclick = (e) => { e.stopPropagation(); togglePlay(); };
    videoEl.onclick = (e) => {
      if (isScreenLocked) return;
      const hadOpen = (brightWrap && brightWrap.classList.contains('is-open')) ||
                      (volWrap && volWrap.classList.contains('is-open')) ||
                      (menu && !menu.classList.contains('hidden'));
      if (hadOpen) {
        closeOpenControlPopovers();
        return;
      }
      // A tap on the video reveals controls through pointerdown. Pausing here
      // made every ordinary mobile tap look like playback had frozen.
      if (e.pointerType === 'touch' || window.matchMedia('(pointer: coarse)').matches) return;
      togglePlay();
    };

    on(videoEl, 'play', () => {
      updatePlayState();
      resetHideTimer();
    });
    on(videoEl, 'playing', () => resetHideTimer());
    on(videoEl, 'pause', () => {
      updatePlayState();
      handleVideoProgressUpdate(true);
    });
    on(videoEl, 'ended', () => {
      updatePlayState();
      persistCurrentProgress(videoEl.duration || videoEl.currentTime, videoEl.duration, true, true);
    });
    on(videoEl, 'seeked', () => {
      handleVideoProgressUpdate(true);
    });

    const handleVideoProgressUpdate = (force = false) => {
      if (!videoEl) return;
      const cur = videoEl.currentTime;
      const dur = videoEl.duration;
      if (isNaN(cur) || cur < 0) return;
      persistCurrentProgress(cur, dur, null, force);
    };
    videoEl._persistProgress = handleVideoProgressUpdate;

    // 2. Timeline and Time Update
    const updateTimeAndTimeline = () => {
      const cur = videoEl.currentTime || 0;
      const dur = videoEl.duration || 0;
      simulatedCurrentTime = Math.round(cur);

      if (timeDisplay) {
        timeDisplay.textContent = `${formatSecondsToTime(cur)} / ${formatSecondsToTime(dur)}`;
      }
      if (dur > 0) {
        const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
        if (playedBar) playedBar.style.width = `${pct}%`;
        if (thumb) thumb.style.left = `${pct}%`;

        if (videoEl.buffered && videoEl.buffered.length > 0) {
          for (let i = videoEl.buffered.length - 1; i >= 0; i--) {
            if (videoEl.buffered.start(i) <= cur) {
              const bufEnd = videoEl.buffered.end(i);
              const bufPct = Math.min(100, (bufEnd / dur) * 100);
              if (bufferedBar) bufferedBar.style.width = `${bufPct}%`;
              break;
            }
          }
        }
      }

      // Skip intro trigger
      if (skipIntroBtn) {
        if (cur >= 10 && cur <= 90 && !hasSkippedIntro) {
          skipIntroBtn.classList.remove('hidden');
        } else {
          skipIntroBtn.classList.add('hidden');
        }
      }

      // Binge Watch Next Episode countdown trigger
      if (bingeCard && isSeries && dur > 70) {
        const remaining = dur - cur;
        if (remaining <= 40 && remaining > 3 && !bingeDismissed && !bingeTimer) {
          bingeCard.classList.remove('hidden');
          renderPlayerIcons(bingeCard);
          bingeCountdown = 5;
          if (bingeSecNum) bingeSecNum.textContent = bingeCountdown;
          bingeTimer = setInterval(() => {
            bingeCountdown--;
            if (bingeSecNum) bingeSecNum.textContent = bingeCountdown;
            if (bingeCountdown <= 0) {
              clearInterval(bingeTimer);
              bingeTimer = null;
              triggerNextEpisode();
            }
          }, 1000);
        }
      }
    };

    on(videoEl, 'timeupdate', updateTimeAndTimeline);
    on(videoEl, 'durationchange', updateTimeAndTimeline);
    on(videoEl, 'loadedmetadata', updateTimeAndTimeline);
    on(videoEl, 'canplay', updateTimeAndTimeline);
    on(videoEl, 'progress', updateTimeAndTimeline);

    // Commit one seek per drag, avoiding a decoder/network restart per mousemove.
    if (timelineContainer) {
      let pendingSeek = null;
      const previewSeek = (e) => {
        const rect = timelineContainer.getBoundingClientRect();
        if (!rect.width || !Number.isFinite(videoEl.duration) || videoEl.duration <= 0) return;
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        pendingSeek = ratio * videoEl.duration;
        if (thumb) thumb.style.left = `${ratio * 100}%`;
        if (playedBar) playedBar.style.width = `${ratio * 100}%`;
      };
      on(timelineContainer, 'pointerdown', (e) => {
        if (e.button !== 0 || isScreenLocked) return;
        e.preventDefault();
        timelineContainer.setPointerCapture(e.pointerId);
        previewSeek(e);
      });
      on(timelineContainer, 'pointermove', (e) => {
        if (timelineContainer.hasPointerCapture(e.pointerId)) previewSeek(e);
        if (!tooltip) return;
        const rect = timelineContainer.getBoundingClientRect();
        if (!rect.width) return;
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        tooltip.textContent = formatSecondsToTime(ratio * (videoEl.duration || 0));
        tooltip.style.left = `${ratio * 100}%`;
      });
      on(timelineContainer, 'pointerup', (e) => {
        if (pendingSeek !== null) videoEl.currentTime = pendingSeek;
        pendingSeek = null;
        if (timelineContainer.hasPointerCapture(e.pointerId)) timelineContainer.releasePointerCapture(e.pointerId);
        resetHideTimer();
      });
      on(timelineContainer, 'pointercancel', () => {
        pendingSeek = null;
        updateTimeAndTimeline();
        resetHideTimer();
      });
    }

    // 3. Volume Control
    const updateVolumeUI = () => {
      const vol = videoEl.muted ? 0 : videoEl.volume;
      if (volSlider) volSlider.value = vol;
      if (volBadge) volBadge.textContent = videoEl.muted ? '%0' : `%${Math.round(vol * 100)}`;
      if (volBtn) {
        let iconName = 'volume-2';
        if (videoEl.muted || vol === 0) iconName = 'volume-x';
        else if (vol < 0.5) iconName = 'volume-1';
        volBtn.innerHTML = `<i data-lucide="${iconName}" style="width: 20px; height: 20px;"></i>`;
        renderPlayerIcons(volBtn);
      }
    };

    if (volPopover) {
      volPopover.onclick = (e) => e.stopPropagation();
      volPopover.ontouchstart = (e) => e.stopPropagation();
    }

    if (volBtn) {
      volBtn.onclick = (e) => {
        e.stopPropagation();
        if (volWrap) {
          const isOpen = volWrap.classList.contains('is-open');
          if (brightWrap) brightWrap.classList.remove('is-open');
          const isTouch = window.matchMedia('(pointer: coarse)').matches;
          if (isTouch) {
            if (isOpen) {
              volWrap.classList.remove('is-open');
              resetHideTimer();
            } else {
              volWrap.classList.add('is-open');
              resetPopoverHideTimer();
            }
          } else {
            videoEl.muted = !videoEl.muted;
            updateVolumeUI();
          }
        } else {
          videoEl.muted = !videoEl.muted;
          updateVolumeUI();
        }
      };
    }

    if (volSlider) {
      volSlider.oninput = (e) => {
        e.stopPropagation();
        resetPopoverHideTimer();
        videoEl.volume = parseFloat(volSlider.value);
        videoEl.muted = false;
        updateVolumeUI();
      };
    }

    // 4. Fullscreen & Video Gestures (Double click left: -10s, right: +10s, middle: fullscreen)
    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        if (wrapper.requestFullscreen) wrapper.requestFullscreen();
        else if (wrapper.webkitRequestFullscreen) wrapper.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    };

    if (fsBtn) fsBtn.onclick = (e) => { e.stopPropagation(); toggleFullscreen(); };
    videoEl.ondblclick = (e) => {
      e.stopPropagation();
      const rect = videoEl.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX < rect.width * 0.35) {
        skipTime(-10);
      } else if (clickX > rect.width * 0.65) {
        skipTime(10);
      } else {
        toggleFullscreen();
      }
    };

    on(document, 'fullscreenchange', () => {
      resetHideTimer();
      const isFs = !!document.fullscreenElement;
      if (fsBtn) {
        fsBtn.innerHTML = `<i data-lucide="${isFs ? 'minimize' : 'maximize'}" style="width: 20px; height: 20px;"></i>`;
        renderPlayerIcons(fsBtn);
      }
    });

    // 5. Inactivity Auto-hide Controls & Popovers
    let hideTimeout = null;
    let popoverHideTimeout = null;

    const closeOpenControlPopovers = (restart = true) => {
      if (brightWrap) brightWrap.classList.remove('is-open');
      if (volWrap) volWrap.classList.remove('is-open');
      if (menu) menu.classList.add('hidden');
      if (popoverHideTimeout) {
        clearTimeout(popoverHideTimeout);
        popoverHideTimeout = null;
      }
      if (restart) resetHideTimer();
    };

    const resetPopoverHideTimer = () => {
      resetHideTimer();
      if (hideTimeout) clearTimeout(hideTimeout);
      if (popoverHideTimeout) clearTimeout(popoverHideTimeout);
      popoverHideTimeout = setTimeout(() => {
        closeOpenControlPopovers();
      }, 3500);
    };

    const modalBox = document.getElementById('cinema-modal-box');

    const resetHideTimer = () => {
      if (isScreenLocked) {
        wrapper.classList.add('hide-controls');
        if (modalBox) modalBox.classList.add('hide-controls');
        return;
      }
      wrapper.classList.remove('hide-controls');
      if (modalBox) modalBox.classList.remove('hide-controls');
      if (hideTimeout) clearTimeout(hideTimeout);
      if (!videoEl.paused && !videoEl.ended) {
        hideTimeout = setTimeout(() => {
          if (!videoEl.paused) {
            wrapper.classList.add('hide-controls');
            if (modalBox) modalBox.classList.add('hide-controls');
            closeOpenControlPopovers(false);
          }
        }, 3000);
      }
    };

    let lastPointerReset = 0;
    const throttledResetTimer = () => {
      const now = Date.now();
      if (now - lastPointerReset < 300) return;
      lastPointerReset = now;
      resetHideTimer();
    };
    on(wrapper, 'pointerenter', (e) => {
      if (e.pointerType === 'mouse') throttledResetTimer();
    });
    on(wrapper, 'pointerdown', throttledResetTimer);
    on(modalContainer, 'focusin', resetHideTimer);
    on(wrapper, 'mouseleave', () => {
      if (!videoEl.paused) {
        wrapper.classList.add('hide-controls');
        if (modalBox) modalBox.classList.add('hide-controls');
        closeOpenControlPopovers(false);
      }
    });

    // 6. Three-Dots Menu Toggle & Navigation
    if (moreBtn && menu) {
      moreBtn.onclick = (e) => {
        e.stopPropagation();
        const willOpen = menu.classList.contains('hidden');
        if (willOpen) {
          showMainMenu();
          menu.classList.remove('hidden');
          wrapper.classList.remove('hide-controls');
          resetPopoverHideTimer();
        } else {
          closeOpenControlPopovers();
        }
      };

      on(document, 'click', (e) => {
        if (!wrapper.contains(e.target) || (!menu.contains(e.target) && !moreBtn.contains(e.target))) {
          menu.classList.add('hidden');
        }
        if (brightWrap && !brightWrap.contains(e.target)) {
          brightWrap.classList.remove('is-open');
        }
        if (volWrap && !volWrap.contains(e.target)) {
          volWrap.classList.remove('is-open');
        }
      });
    }

    const showMainMenu = () => {
      if (mainView) mainView.classList.remove('hidden');
      if (subview) subview.classList.add('hidden');
      updateMenuLabels();
    };

    const showSubView = (title, itemsHtml) => {
      if (mainView) mainView.classList.add('hidden');
      if (subview) subview.classList.remove('hidden');
      if (subviewTitle) subviewTitle.textContent = title;
      if (subviewList) {
        subviewList.innerHTML = itemsHtml;
        renderPlayerIcons(subviewList);
      }
      renderPlayerIcons(backBtn);
    };

    if (backBtn) {
      backBtn.onclick = (e) => {
        e.stopPropagation();
        showMainMenu();
      };
    }

    const updateMenuLabels = () => {
      const audioSub = wrapper.querySelector('#custom-menu-active-audio');
      if (audioSub) {
        if (activeHlsInstance && activeHlsInstance.audioTracks && activeHlsInstance.audioTracks.length > 1) {
          const act = activeHlsInstance.audioTracks[activeHlsInstance.audioTrack];
          let label = act ? (act.name || act.lang || `Ses ${activeHlsInstance.audioTrack + 1}`) : 'Otomatik';
          if (/tr|turk/i.test(label)) label = 'Türkçe Dublaj';
          else if (/en|eng|orig/i.test(label)) label = 'Orijinal (İngilizce)';
          audioSub.textContent = label;
        } else if (videoEl._currentAudioTrack) {
          audioSub.textContent = videoEl._currentAudioTrack === 'dubbed' ? 'Türkçe Dublaj' : 'Orijinal Ses';
        } else {
          audioSub.textContent = currentCategory === 'dubbed' ? 'Türkçe Dublaj' : 'Orijinal Ses';
        }
      }

      const subLabelEl = wrapper.querySelector('#custom-menu-active-sub');
      if (subLabelEl) {
        let activeSub = 'Kapalı';
        const tracks = videoEl.textTracks;
        if (tracks && tracks.length > 0) {
          for (let i = 0; i < tracks.length; i++) {
            if (tracks[i].mode === 'showing') {
              activeSub = tracks[i].label || 'Türkçe';
              break;
            }
          }
        }
        subLabelEl.textContent = activeSub;
      }

      const speedLabelEl = wrapper.querySelector('#custom-menu-active-speed');
      if (speedLabelEl) {
        const rate = videoEl.playbackRate || 1;
        speedLabelEl.textContent = rate === 1 ? 'Normal' : `${rate}x`;
      }

      const brightLabelEl = wrapper.querySelector('#custom-menu-active-brightness');
      if (brightLabelEl) {
        brightLabelEl.textContent = `%${currentBrightness}`;
      }
    };

    // ITEM 1: SES KANALLARI CLICK (STRICTLY VIDEO AUDIO TRACKS ONLY)
    const itemAudio = wrapper.querySelector('#custom-menu-item-audio');
    if (itemAudio) {
      itemAudio.onclick = (e) => {
        e.stopPropagation();
        renderAudioSubmenu();
      };
    }

    const renderAudioSubmenu = () => {
      let html = '';

      // Mode A: HLS Multi-Audio Track inside the active stream
      if (activeHlsInstance && activeHlsInstance.audioTracks && activeHlsInstance.audioTracks.length > 1) {
        html += `<p style="color:#94a3b8;font-size:10.5px;font-weight:700;text-transform:uppercase;margin:2px 0 6px 6px;">VİDEO SES KANALLARI</p>`;
        activeHlsInstance.audioTracks.forEach((t, idx) => {
          const isAct = activeHlsInstance.audioTrack === idx;
          let label = t.name || t.lang || `Kanal ${idx + 1}`;
          if (/tr|turk/i.test(label) || /tr|turk/i.test(t.lang || '')) {
            label = '🇹🇷 Türkçe Dublaj';
          } else if (/en|eng|orig/i.test(label) || /en|eng/i.test(t.lang || '')) {
            label = '🇬🇧 Orijinal (İngilizce)';
          }
          html += `
            <div class="custom-menu-opt-row ${isAct ? 'active' : ''}" data-hls-track="${idx}">
              <span>${label}</span>
              ${isAct ? '<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>' : ''}
            </div>
          `;
        });
      } else if (videoEl._setAudioTrack) {
        // Mode B: Dual-Audio Synchronized Stream (Dubbed audio channel + Original video sound)
        const cur = videoEl._currentAudioTrack || 'dubbed';
        html += `<p style="color:#94a3b8;font-size:10.5px;font-weight:700;text-transform:uppercase;margin:2px 0 6px 6px;">VİDEO SES KANALLARI</p>`;
        html += `
          <div class="custom-menu-opt-row ${cur === 'dubbed' ? 'active' : ''}" data-dual-track="dubbed">
            <span>🇹🇷 Türkçe Dublaj</span>
            ${cur === 'dubbed' ? '<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>' : ''}
          </div>
          <div class="custom-menu-opt-row ${cur === 'original' ? 'active' : ''}" data-dual-track="original">
            <span>🇬🇧 Orijinal Ses</span>
            ${cur === 'original' ? '<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>' : ''}
          </div>
        `;
      } else {
        // Mode C: Single Audio Channel on this video
        html += `<p style="color:#94a3b8;font-size:10.5px;font-weight:700;text-transform:uppercase;margin:2px 0 6px 6px;">VİDEO SES KANALLARI</p>`;
        html += `
          <div class="custom-menu-opt-row active" style="cursor:default;">
            <span>${currentCategory === 'dubbed' ? '🇹🇷 Türkçe Dublaj (Tek Kanal)' : '🇬🇧 Orijinal Ses (Tek Kanal)'}</span>
            <i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>
          </div>
          <p style="color:#64748b;font-size:11px;margin:10px 6px 4px;line-height:1.4;">
            Bu videoda yalnızca tek bir ses kanalı mevcuttur.
          </p>
        `;
      }

      showSubView('Ses Kanalları', html);

      if (subviewList) {
        // Switch HLS audio track directly
        subviewList.querySelectorAll('[data-hls-track]').forEach(el => {
          el.onclick = (ev) => {
            ev.stopPropagation();
            const trackIdx = parseInt(el.getAttribute('data-hls-track'), 10);
            if (activeHlsInstance) {
              activeHlsInstance.audioTrack = trackIdx;
              const track = activeHlsInstance.audioTracks[trackIdx];
              const name = track?.name || track?.lang || `Kanal ${trackIdx + 1}`;
              showToast(`✓ Ses kanalı değiştirildi: ${name}`, 'success');
            }
            showMainMenu();
          };
        });

        // Switch dual-audio track directly
        subviewList.querySelectorAll('[data-dual-track]').forEach(el => {
          el.onclick = (ev) => {
            ev.stopPropagation();
            const track = el.getAttribute('data-dual-track');
            if (videoEl._setAudioTrack) {
              videoEl._setAudioTrack(track);
            }
            showMainMenu();
          };
        });
      }
    };

    // ITEM 2: ALTYAZILAR CLICK
    const itemSubs = wrapper.querySelector('#custom-menu-item-subs');
    if (itemSubs) {
      itemSubs.onclick = (e) => {
        e.stopPropagation();
        renderSubsSubmenu();
      };
    }

    const renderSubsSubmenu = () => {
      const tracks = videoEl.textTracks;
      let activeIdx = -1;
      if (tracks) {
        for (let i = 0; i < tracks.length; i++) {
          if (tracks[i].mode === 'showing') {
            activeIdx = i;
            break;
          }
        }
      }

      let html = `
        <div class="custom-menu-opt-row ${activeIdx === -1 ? 'active' : ''}" data-sub-idx="-1">
          <span>Kapalı</span>
          ${activeIdx === -1 ? '<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>' : ''}
        </div>
      `;

      if (tracks && tracks.length > 0) {
        for (let i = 0; i < tracks.length; i++) {
          const t = tracks[i];
          const isAct = activeIdx === i;
          html += `
            <div class="custom-menu-opt-row ${isAct ? 'active' : ''}" data-sub-idx="${i}">
              <span>${t.label || `Altyazı ${i + 1}`}</span>
              ${isAct ? '<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>' : ''}
            </div>
          `;
        }
      }

      showSubView('Altyazılar', html);

      if (subviewList) {
        subviewList.querySelectorAll('[data-sub-idx]').forEach(el => {
          el.onclick = (ev) => {
            ev.stopPropagation();
            const idx = parseInt(el.getAttribute('data-sub-idx'), 10);
            if (tracks) {
              for (let i = 0; i < tracks.length; i++) {
                tracks[i].mode = (i === idx) ? 'showing' : 'disabled';
              }
            }
            showToast(idx === -1 ? 'Altyazı kapatıldı' : `✓ Altyazı: ${tracks[idx]?.label || 'Açık'}`, 'info');
            const activeSubSpan = wrapper.querySelector('#custom-menu-active-sub');
            if (activeSubSpan) {
              activeSubSpan.textContent = idx === -1 ? 'Kapalı' : (tracks[idx]?.label || 'Açık');
            }
            showMainMenu();
          };
        });
      }
    };

    // ITEM 3: OYNATMA HIZI CLICK
    const itemSpeed = wrapper.querySelector('#custom-menu-item-speed');
    if (itemSpeed) {
      itemSpeed.onclick = (e) => {
        e.stopPropagation();
        renderSpeedSubmenu();
      };
    }

    const renderSpeedSubmenu = () => {
      const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
      const curSpeed = videoEl.playbackRate || 1;
      let html = '';
      speeds.forEach(sp => {
        const isAct = curSpeed === sp;
        html += `
          <div class="custom-menu-opt-row ${isAct ? 'active' : ''}" data-speed="${sp}">
            <span>${sp === 1 ? 'Normal (1x)' : `${sp}x`}</span>
            ${isAct ? '<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>' : ''}
          </div>
        `;
      });

      showSubView('Oynatma hızı', html);

      if (subviewList) {
        subviewList.querySelectorAll('[data-speed]').forEach(el => {
          el.onclick = (ev) => {
            ev.stopPropagation();
            const sp = parseFloat(el.getAttribute('data-speed'));
            videoEl.playbackRate = sp;
            showToast(`Oynatma Hızı: ${sp === 1 ? 'Normal' : `${sp}x`}`, 'info');
            showMainMenu();
          };
        });
      }
    };

    // ITEM 4: PARLAKLIK CLICK
    const itemBrightnessMenu = wrapper.querySelector('#custom-menu-item-brightness-menu');
    if (itemBrightnessMenu) {
      itemBrightnessMenu.onclick = (e) => {
        e.stopPropagation();
        renderBrightnessSubmenu();
      };
    }

    const renderBrightnessSubmenu = () => {
      const presets = [
        { label: '%50 (Gece Modu)', val: 50 },
        { label: '%75 (Kısık)', val: 75 },
        { label: '%100 (Normal)', val: 100 },
        { label: '%125 (Canlı)', val: 125 },
        { label: '%150 (Maksimum)', val: 150 }
      ];
      let html = '';
      presets.forEach(p => {
        const isAct = currentBrightness === p.val;
        html += `
          <div class="custom-menu-opt-row ${isAct ? 'active' : ''}" data-brightness="${p.val}">
            <span>${p.label}</span>
            ${isAct ? '<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>' : ''}
          </div>
        `;
      });

      showSubView('Parlaklık', html);

      if (subviewList) {
        subviewList.querySelectorAll('[data-brightness]').forEach(el => {
          el.onclick = (ev) => {
            ev.stopPropagation();
            const val = parseInt(el.getAttribute('data-brightness'), 10);
            setBrightness(val);
            showToast(`Parlaklık: %${val}`, 'info');
            showMainMenu();
          };
        });
      }
    };

    // ITEM 5: PENCERE İÇİNDE PENCERE CLICK
    const itemPip = wrapper.querySelector('#custom-menu-item-pip');
    if (itemPip) {
      itemPip.onclick = async (e) => {
        e.stopPropagation();
        menu.classList.add('hidden');
        try {
          if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
          } else if (videoEl.requestPictureInPicture) {
            await videoEl.requestPictureInPicture();
          }
        } catch (_) {
          showToast('Pencere içinde pencere desteklenmiyor.', 'error');
        }
      };
    }

    // ITEM 6: UYKU ZAMANLAYICISI (SLEEP TIMER)
    let sleepTimerTimeout = null;
    let sleepEndedHandler = null;
    let activeSleepLabel = 'Kapalı';

    const triggerSleepMode = () => {
      videoEl.pause();
      if (sleepCurtain) {
        sleepCurtain.classList.remove('hidden');
        renderPlayerIcons(sleepCurtain);
      }
      showToast('🌙 Uyku Modu: Süre doldu, yayın duraklatıldı.', 'info');
      clearSleepTimer();
    };

    const clearSleepTimer = () => {
      if (sleepEndedHandler) {
        videoEl.removeEventListener('ended', sleepEndedHandler);
        sleepEndedHandler = null;
      }
      if (sleepTimerTimeout) {
        clearTimeout(sleepTimerTimeout);
        sleepTimerTimeout = null;
      }
      activeSleepLabel = 'Kapalı';
      if (activeSleepBadge) activeSleepBadge.textContent = activeSleepLabel;
      if (sleepBtn) sleepBtn.style.color = '#c084fc';
    };

    const setSleepTimer = (minutes, label) => {
      clearSleepTimer();
      activeSleepLabel = label;
      if (activeSleepBadge) activeSleepBadge.textContent = activeSleepLabel;
      if (sleepBtn) sleepBtn.style.color = '#a855f7';

      if (minutes === 'end-of-episode') {
        showToast('🌙 Uyku Zamanlayıcısı: Bölüm bitince yayın durdurulacak.', 'info');
        const onEnded = () => {
          videoEl.removeEventListener('ended', onEnded);
          triggerSleepMode();
        };
        sleepEndedHandler = onEnded;
        on(videoEl, 'ended', onEnded);
        return;
      }

      const totalSeconds = minutes * 60;
      showToast(`🌙 Uyku Zamanlayıcısı: ${label} sonra kapatılacak.`, 'success');

      sleepTimerTimeout = setTimeout(() => {
        triggerSleepMode();
      }, totalSeconds * 1000);
    };

    if (sleepCurtain) {
      sleepCurtain.onclick = (e) => {
        e.stopPropagation();
        sleepCurtain.classList.add('hidden');
        videoEl.play().catch(() => {});
      };
    }

    const renderSleepSubmenu = () => {
      const presets = [
        { label: 'Kapalı (İptal Et)', val: 0 },
        { label: '15 Dakika', val: 15 },
        { label: '30 Dakika', val: 30 },
        { label: '45 Dakika', val: 45 },
        { label: '60 Dakika (1 Saat)', val: 60 },
        { label: 'Bölüm Bitince', val: 'end-of-episode' }
      ];

      let html = '';
      presets.forEach(p => {
        const isAct = (p.val === 0 && activeSleepLabel === 'Kapalı') || activeSleepLabel === p.label;
        html += `
          <div class="custom-menu-opt-row ${isAct ? 'active' : ''}" data-sleep-val="${p.val}" data-sleep-label="${p.label}">
            <span>${p.label}</span>
            ${isAct ? '<i data-lucide="check" style="width:14px;height:14px;color:#10b981;"></i>' : ''}
          </div>
        `;
      });

      showSubView('Uyku Zamanlayıcısı', html);

      if (subviewList) {
        subviewList.querySelectorAll('[data-sleep-val]').forEach(el => {
          el.onclick = (ev) => {
            ev.stopPropagation();
            const val = el.getAttribute('data-sleep-val');
            const lbl = el.getAttribute('data-sleep-label');
            if (val === '0') {
              clearSleepTimer();
              showToast('Uyku zamanlayıcısı kapatıldı', 'info');
            } else if (val === 'end-of-episode') {
              setSleepTimer('end-of-episode', 'Bölüm Bitince');
            } else {
              setSleepTimer(parseInt(val, 10), lbl);
            }
            showMainMenu();
          };
        });
      }
    };

    if (itemSleepMenu) {
      itemSleepMenu.onclick = (e) => {
        e.stopPropagation();
        renderSleepSubmenu();
      };
    }

    if (sleepBtn) {
      sleepBtn.onclick = (e) => {
        e.stopPropagation();
        if (menu.classList.contains('hidden')) {
          closeOpenControlPopovers();
          menu.classList.remove('hidden');
          renderSleepSubmenu();
        } else {
          closeOpenControlPopovers();
        }
      };
    }

    // 7. Touch Gestures on Mobile / Tablet (Brightness, Volume, Double-Tap Skip)
    let gestureHideTimeout = null;
    const showGestureHud = (iconName, text, fillPct) => {
      if (!gestureHud) return;
      if (gestureIcon && gestureIcon.getAttribute('data-lucide') !== iconName) {
        gestureIcon.setAttribute('data-lucide', iconName);
        renderPlayerIcons(gestureHud);
        gestureIcon = wrapper.querySelector('#gesture-hud-icon');
      }
      if (gestureText) gestureText.textContent = text;
      if (gestureFill) gestureFill.style.height = `${Math.max(0, Math.min(100, fillPct))}%`;

      gestureHud.classList.remove('hidden');
      if (gestureHideTimeout) clearTimeout(gestureHideTimeout);
      gestureHideTimeout = setTimeout(() => {
        gestureHud.classList.add('hidden');
      }, 700);
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let activeSwipeType = null; // 'brightness' | 'volume' | null
    let swipeInitialVal = 0;
    let lastTapTimestamp = 0;

    on(wrapper, 'touchstart', (e) => {
      if (isScreenLocked) return;
      if (e.touches.length !== 1) return;
      const target = e.target;
      if (target.closest('.custom-player-controls') || target.closest('.custom-player-menu') || target.closest('.custom-skip-intro-btn') || target.closest('.custom-binge-card') || target.closest('.custom-screen-lock-btn') || target.closest('.custom-screen-unlock-badge') || target.closest('.custom-sleep-curtain')) {
        return;
      }

      const touch = e.touches[0];
      const rect = wrapper.getBoundingClientRect();
      const relativeX = touch.clientX - rect.left;
      const now = Date.now();

      // Double-tap skip detection (YouTube style)
      if (now - lastTapTimestamp < 320) {
        lastTapTimestamp = 0;
        e.preventDefault();
        if (relativeX < rect.width * 0.4) {
          skipTime(-10);
        } else if (relativeX > rect.width * 0.6) {
          skipTime(10);
        } else {
          togglePlay();
        }
        activeSwipeType = null;
        resetHideTimer();
        return;
      }
      lastTapTimestamp = now;

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      activeSwipeType = null;
    }, { passive: false });

    on(wrapper, 'touchmove', (e) => {
      if (isScreenLocked) return;
      if (e.touches.length !== 1) return;
      const target = e.target;
      if (target.closest('.custom-player-controls') || target.closest('.custom-player-menu') || target.closest('.custom-skip-intro-btn') || target.closest('.custom-binge-card') || target.closest('.custom-screen-lock-btn') || target.closest('.custom-screen-unlock-badge')) {
        return;
      }

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touchStartY - touch.clientY; // positive = swipe up
      const rect = wrapper.getBoundingClientRect();

      // Vertical swipe detection
      if (!activeSwipeType && Math.abs(deltaY) > 12 && Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
        const relativeX = touchStartX - rect.left;
        if (relativeX < rect.width * 0.5) {
          activeSwipeType = 'brightness';
          swipeInitialVal = currentBrightness;
        } else {
          activeSwipeType = 'volume';
          swipeInitialVal = videoEl.muted ? 0 : videoEl.volume;
        }
      }

      if (activeSwipeType) {
        e.preventDefault();
        const sensitivity = 0.8;
        const progressDelta = (deltaY / (rect.height * sensitivity));

        if (activeSwipeType === 'brightness') {
          const newBright = Math.max(30, Math.min(150, Math.round(swipeInitialVal + progressDelta * 100)));
          setBrightness(newBright);
          showGestureHud('sun', `%${newBright}`, ((newBright - 30) / 120) * 100);
        } else if (activeSwipeType === 'volume') {
          const newVol = Math.max(0, Math.min(1, swipeInitialVal + progressDelta));
          videoEl.volume = newVol;
          videoEl.muted = false;
          updateVolumeUI();
          showGestureHud(newVol === 0 ? 'volume-x' : (newVol < 0.5 ? 'volume-1' : 'volume-2'), `%${Math.round(newVol * 100)}`, newVol * 100);
        }
      }
    }, { passive: false });

    on(wrapper, 'touchend', () => {
      activeSwipeType = null;
    }, { passive: true });

    // Keyboard controls handler
    const handleKeydown = (e) => {
      if (isScreenLocked) return;
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
      if (!modalContainer || modalContainer.classList.contains('hidden')) return;

      if (e.code === 'ArrowUp') {
        e.preventDefault();
        videoEl.volume = Math.min(1, videoEl.volume + 0.1);
        videoEl.muted = false;
        updateVolumeUI();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        videoEl.volume = Math.max(0, videoEl.volume - 0.1);
        updateVolumeUI();
      }
    };

    on(window, 'keydown', handleKeydown);

    // Initial UI state setup
    updatePlayState();
    resetHideTimer();
    updateVolumeUI();
    updateTimeAndTimeline();
    updateMenuLabels();
    renderPlayerIcons(wrapper);
  }

  async function updatePlayerContainer() {
    if (closed) return;
    disposePlayback();
    const wrapper = document.getElementById('player-iframe-wrapper');
    if (!wrapper) return;

    if (activeHlsInstance) {
      try { activeHlsInstance.destroy(); } catch (_) {}
      activeHlsInstance = null;
    }

    let srv = activeServers[currentServerIndex];
    // Note: DiziBal streams are now resolved server-side in dizibalScraper.js
    // No client-side resolveDirectStream needed here

    wrapper.innerHTML = renderPlayerContent();
    renderPlayerIcons(wrapper);

    const popoutBtn = document.getElementById('player-popout-btn');
    if (popoutBtn) {
      popoutBtn.href = getStreamSafeUrl(srv) || '#';
    }

    const switchVipDirectBtn = document.getElementById('btn-switch-vip-direct');
    if (switchVipDirectBtn) {
      switchVipDirectBtn.addEventListener('click', () => {
        // Find first non-torrent direct stream
        const directIdx = activeServers.findIndex(s => s && (s.isDirectVideo || s.isHls || (s.streamUrl && !s.streamUrl.startsWith('magnet:')) && !s.isTorrent));
        if (directIdx !== -1 && directIdx !== currentServerIndex) {
          currentServerIndex = directIdx;
          failoverCountInSession = 0;
          updateActiveSourceLabel();
          updatePlayerContainer();
        } else {
          const tabDub = document.getElementById('tab-dubbed');
          if (tabDub) tabDub.click();
        }
      });
    }





    const fallbackBtn = document.getElementById('btn-switch-subtitled-fallback');
    if (fallbackBtn) {
      fallbackBtn.addEventListener('click', () => {
        if (currentCategory === 'dubbed') {
          const tabSub = document.getElementById('tab-subtitled');
          if (tabSub) tabSub.click();
        } else {
          const tabDub = document.getElementById('tab-dubbed');
          if (tabDub) tabDub.click();
        }
      });
    }

    const retryBtn = document.getElementById('btn-retry-discovery');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        startServerDiscovery();
      });
    }

    const isDirectPlayable = Boolean(
      srv?.isDirectVideo ||
      srv?.isHls ||
      (srv?.streamUrl && !srv.streamUrl.startsWith('magnet:') && (srv.streamUrl.includes('.m3u8') || srv.streamUrl.includes('.txt') || srv.streamUrl.includes('.mp4') || srv.streamUrl.includes('.mkv') || srv.streamUrl.includes(':4000/torrent/')))
    );

    if (isDirectPlayable) {
      if (activeHlsInstance) {
        try { activeHlsInstance.destroy(); } catch (_) {}
        activeHlsInstance = null;
      }
      if (activeAudioHlsInstance) {
        try { activeAudioHlsInstance.destroy(); } catch (_) {}
        activeAudioHlsInstance = null;
      }

      const videoEl = document.getElementById('hls-video-player');
      const streamUrl = getStreamSafeUrl(srv);

      if (videoEl && streamUrl) {
        const isHlsStream = streamUrl.includes('.m3u8') || streamUrl.includes('.txt') || srv.isHls;

        if (isHlsStream && window.Hls && Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            maxBufferLength: 10,
            maxMaxBufferLength: 20,
            startPosition: -1,
            backBufferLength: 15,
            highBufferWatchdogPeriod: 1,
            nudgeOffset: 0.1,
            nudgeMaxRetry: 5
          });
          activeHlsInstance = hls;

          const applySafeSeek = () => {
            if (initialTime > 0) {
              const dur = videoEl.duration;
              if (dur && isFinite(dur) && dur > 10) {
                if (initialTime >= dur - 15) {
                  videoEl.currentTime = 0;
                  return;
                }
              }
              videoEl.currentTime = initialTime;
            }
          };

          hls.loadSource(streamUrl);
          hls.attachMedia(videoEl);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            applySafeSeek();
            const playPromise = videoEl.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                videoEl.muted = true;
                videoEl.play().catch(() => {});
              });
            }
          });
          hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, () => {
            const audioSub = document.querySelector('#custom-menu-active-audio');
            if (audioSub && hls.audioTracks && hls.audioTracks.length > 1) {
              const act = hls.audioTracks[hls.audioTrack];
              let label = act ? (act.name || act.lang || `Ses ${hls.audioTrack + 1}`) : 'Otomatik';
              if (/tr|turk/i.test(label)) label = 'Türkçe Dublaj';
              else if (/en|eng|orig/i.test(label)) label = 'Orijinal (İngilizce)';
              audioSub.textContent = label;
            }
          });
          playbackScope.on(videoEl, 'loadedmetadata', applySafeSeek, { once: true });

          let networkErrorCount = 0;
          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              if (data.response && data.response.code >= 400) {
                try { hls.destroy(); } catch (_) {}
                activeHlsInstance = null;
                triggerAutoFailover(`Sunucu Hatası (HTTP ${data.response.code})`);
                return;
              }
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  networkErrorCount++;
                  if (networkErrorCount > 2) {
                    try { hls.destroy(); } catch (_) {}
                    activeHlsInstance = null;
                    triggerAutoFailover('Ağ Hatası (Bağlantı koptu)');
                  } else {
                    hls.startLoad();
                  }
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError();
                  break;
                default:
                  try { hls.destroy(); } catch (_) {}
                  activeHlsInstance = null;
                  triggerAutoFailover('Oynatma Hatası');
                  break;
              }
            }
          });
        } else if (isHlsStream && videoEl.canPlayType('application/vnd.apple.mpegurl')) {
          // iOS Safari Native HLS Engine
          videoEl.src = streamUrl;
          const startIosPlayback = () => {
            if (initialTime > 0) {
              const dur = videoEl.duration;
              if (dur && isFinite(dur) && dur > 10 && initialTime >= dur - 15) {
                videoEl.currentTime = 0;
              } else {
                videoEl.currentTime = initialTime;
              }
            }
            const pp = videoEl.play();
            if (pp !== undefined) {
              pp.catch(() => {
                videoEl.muted = true;
                videoEl.play().catch(() => {});
              });
            }
          };
          playbackScope.on(videoEl, 'loadedmetadata', startIosPlayback, { once: true });
          playbackScope.on(videoEl, 'canplay', startIosPlayback, { once: true });
          startIosPlayback();
          playbackScope.on(videoEl, 'error', () => {
            triggerAutoFailover('iOS Oynatıcı Hatası');
          });
        } else {
          videoEl.src = streamUrl;

          const startDirectPlayback = () => {
            if (initialTime > 0) {
              const dur = videoEl.duration;
              if (dur && isFinite(dur) && dur > 10 && initialTime >= dur - 15) {
                videoEl.currentTime = 0;
              } else {
                videoEl.currentTime = initialTime;
              }
            }
            const playPromise = videoEl.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // If browser autoplay policy blocks audio, start muted so video plays immediately
                videoEl.muted = true;
                videoEl.play().catch(() => {});
              });
            }
          };

          playbackScope.on(videoEl, 'loadedmetadata', startDirectPlayback, { once: true });
          playbackScope.on(videoEl, 'canplay', startDirectPlayback, { once: true });
          startDirectPlayback();

          playbackScope.on(videoEl, 'error', () => {
            triggerAutoFailover('Video Oynatma Hatası');
          });
        }

        // Unmute on first user interaction if muted by browser autoplay policy
        const unmuteOnUserInteraction = () => {
          if (videoEl && videoEl.muted) {
            videoEl.muted = false;
          }
        };
        playbackScope.on(videoEl, 'click', unmuteOnUserInteraction, { once: true });
        const controlsBar = document.getElementById('custom-player-controls');
        if (controlsBar) playbackScope.on(controlsBar, 'click', unmuteOnUserInteraction, { once: true });

        // ============ Dual-Audio Synchronization Engine ============
        const dubbedAudioEl = document.getElementById('dubbed-audio-source');
        const btnOriginal = document.getElementById('btn-audio-original');
        const btnDubbed = document.getElementById('btn-audio-dubbed');

        if (dubbedAudioEl && srv.dubbedAudioUrl) {
          let currentAudioTrack = currentCategory === 'dubbed' ? 'dubbed' : 'original';
          let audioHlsInitialized = false;

          const ensureDubbedAudioLoaded = () => {
            if (audioHlsInitialized || !dubbedAudioEl || !srv.dubbedAudioUrl) return;
            audioHlsInitialized = true;
            const dubbedUrl = srv.dubbedAudioUrl;
            const isAudioHls = dubbedUrl.includes('.m3u8') || srv.dubbedAudioIsHls;

            if (isAudioHls && window.Hls && Hls.isSupported()) {
              const audioHls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                maxBufferLength: 6,
                maxMaxBufferLength: 12
              });
              activeAudioHlsInstance = audioHls;
              audioHls.loadSource(dubbedUrl);
              audioHls.attachMedia(dubbedAudioEl);
            } else {
              dubbedAudioEl.src = dubbedUrl;
            }
          };

          const setAudioTrack = (track, silent = false) => {
            currentAudioTrack = track;
            videoEl._currentAudioTrack = track;
            if (track === 'dubbed') {
              if (btnDubbed) btnDubbed.classList.add('active');
              if (btnOriginal) btnOriginal.classList.remove('active');

              // If the main video itself is already the dubbed stream, just unmute videoEl!
              if (!dubbedAudioEl || (srv.streamUrl === srv.dubbedAudioUrl)) {
                videoEl.muted = false;
                if (!silent) showToast('🇹🇷 Türkçe Dublaj sesi aktif.', 'success');
                return;
              }

              ensureDubbedAudioLoaded();
              videoEl.muted = true;
              dubbedAudioEl.muted = false;
              dubbedAudioEl.volume = videoEl.volume;
              if (videoEl.currentTime > 0 && Math.abs(dubbedAudioEl.currentTime - videoEl.currentTime) > 0.3) {
                try { dubbedAudioEl.currentTime = videoEl.currentTime; } catch (_) {}
              }
              if (!videoEl.paused) {
                dubbedAudioEl.play().catch(() => {
                  videoEl.muted = false;
                });
              }
              if (!silent) showToast('🇹🇷 Türkçe Dublaj sesi aktif edildi.', 'success');
            } else {
              if (btnOriginal) btnOriginal.classList.add('active');
              if (btnDubbed) btnDubbed.classList.remove('active');
              videoEl.muted = false;
              if (dubbedAudioEl) {
                dubbedAudioEl.muted = true;
                try { dubbedAudioEl.pause(); } catch (_) {}
              }
              if (!silent) showToast('🇬🇧 Orijinal ses aktif edildi.', 'info');
            }
          };

          videoEl._setAudioTrack = setAudioTrack;
          videoEl._currentAudioTrack = currentAudioTrack;

          if (btnOriginal) {
            btnOriginal.onclick = (e) => { e.stopPropagation(); setAudioTrack('original'); };
          }
          if (btnDubbed) {
            btnDubbed.onclick = (e) => { e.stopPropagation(); setAudioTrack('dubbed'); };
          }

          // Initial track setting matching the user's active category
          const initialTrack = currentCategory === 'dubbed' ? 'dubbed' : 'original';
          setAudioTrack(initialTrack, true);

          playbackScope.on(videoEl, 'canplay', () => {
            if (currentAudioTrack === 'dubbed') {
              if (Math.abs(dubbedAudioEl.currentTime - videoEl.currentTime) > 0.3) {
                try { dubbedAudioEl.currentTime = videoEl.currentTime; } catch (_) {}
              }
              if (!videoEl.paused) dubbedAudioEl.play().catch(() => {});
            }
          }, { once: true });

          playbackScope.on(videoEl, 'play', () => {
            if (currentAudioTrack === 'dubbed') {
              dubbedAudioEl.currentTime = videoEl.currentTime;
              dubbedAudioEl.play().catch(() => {});
            }
          });

          playbackScope.on(videoEl, 'pause', () => {
            if (currentAudioTrack === 'dubbed') {
              dubbedAudioEl.pause();
            }
          });

          playbackScope.on(videoEl, 'seeking', () => {
            if (currentAudioTrack === 'dubbed') {
              dubbedAudioEl.currentTime = videoEl.currentTime;
            }
          });

          playbackScope.on(videoEl, 'seeked', () => {
            if (currentAudioTrack === 'dubbed') {
              dubbedAudioEl.currentTime = videoEl.currentTime;
              if (!videoEl.paused) dubbedAudioEl.play().catch(() => {});
            }
          });

          playbackScope.on(videoEl, 'waiting', () => {
            if (currentAudioTrack === 'dubbed') {
              dubbedAudioEl.pause();
            }
          });

          playbackScope.on(videoEl, 'playing', () => {
            if (currentAudioTrack === 'dubbed') {
              if (Math.abs(dubbedAudioEl.currentTime - videoEl.currentTime) > 0.25) {
                dubbedAudioEl.currentTime = videoEl.currentTime;
              }
              dubbedAudioEl.play().catch(() => {});
            }
          });

          playbackScope.on(videoEl, 'volumechange', () => {
            if (currentAudioTrack === 'dubbed') {
              dubbedAudioEl.volume = videoEl.volume;
              dubbedAudioEl.muted = videoEl.muted;
            }
          });

          playbackScope.on(videoEl, 'timeupdate', () => {
            if (currentAudioTrack === 'dubbed' && !videoEl.paused) {
              const diff = Math.abs(dubbedAudioEl.currentTime - videoEl.currentTime);
              if (diff > 0.3) {
                dubbedAudioEl.currentTime = videoEl.currentTime;
              }
            }
          });
        }

        // ============ Subtitle Control Engine for Torrent, Sinewix & Direct Streams ============
        attachSubtitleControls(videoEl, srv);
        initCustomPlayerControls(videoEl, srv);
      }
    }
  }

  function showDubbedFoundBanner(stream) {
    if (document.getElementById('dubbed-found-banner')) return;
    const wrapper = document.getElementById('player-iframe-wrapper');
    if (!wrapper) return;

    const banner = document.createElement('div');
    banner.id = 'dubbed-found-banner';
    banner.className = 'dubbed-found-banner';
    banner.innerHTML = `
      <div class="dubbed-found-text">
        <i data-lucide="sparkles" style="width: 15px; height: 15px; color: #f59e0b;"></i>
        <span>🇹🇷 Türkçe Dublaj Yayını Bulundu! (${stream.displayName || '1080p'})</span>
      </div>
      <button class="dubbed-found-btn" id="btn-switch-to-new-dubbed">
        <span>Dublaja Geç</span>
        <i data-lucide="arrow-right" style="width: 13px; height: 13px;"></i>
      </button>
      <button class="dubbed-found-close" id="btn-close-dubbed-banner" title="Kapat">
        <i data-lucide="x" style="width: 14px; height: 14px;"></i>
      </button>
    `;

    wrapper.appendChild(banner);
    renderPlayerIcons(banner);

    document.getElementById('btn-switch-to-new-dubbed')?.addEventListener('click', (e) => {
      e.stopPropagation();
      banner.remove();
      const tabDub = document.getElementById('tab-dubbed');
      if (tabDub) tabDub.click();
    });

    document.getElementById('btn-close-dubbed-banner')?.addEventListener('click', (e) => {
      e.stopPropagation();
      banner.remove();
    });
  }

  let isDiscoveryActive = false;
  let hasShownDubbedAlert = false;

  function startServerDiscovery({ isEpisodeSwitch = false } = {}) {
    const generation = ++discoveryGeneration;
    let sourceRefreshFrame = 0;
    isSearching = true;
    isDiscoveryActive = true;
    hasPlayerStartedPlaying = false;
    hasShownDubbedAlert = false;
    failoverCountInSession = 0;
    categorizedServers = { dubbed: [], subtitled: [] };
    activeServers = [];

    updateServerPillsEvents();
    updatePlayerContainer();

    getStreamingServersProgressive({
      type,
      tmdbId,
      title: cleanSeriesName,
      seriesTitle: cleanSeriesName,
      originalTitle,
      season: currentSeason,
      episode: currentEpisode,
      onUpdate: ({ dubbed = [], subtitled = [], isComplete = false, newStream = null, isDubbedStream = false }) => {
        if (closed || generation !== discoveryGeneration) return;
        categorizedServers = { dubbed, subtitled };
        isDiscoveryActive = !isComplete;

        // One-time non-intrusive alert if user is watching subtitled and a dubbed stream is discovered
        if (currentCategory === 'subtitled' && isDubbedStream && newStream && !hasShownDubbedAlert && hasPlayerStartedPlaying) {
          hasShownDubbedAlert = true;
          showDubbedFoundBanner(newStream);
        }

        // Play the first available source in the user's SELECTED category immediately.
        // NEVER auto-flip category while discovery is actively searching!
        if (!hasPlayerStartedPlaying) {
          if (categorizedServers[currentCategory]?.length > 0) {
            hasPlayerStartedPlaying = true;
            isSearching = false;
            activeServers = categorizedServers[currentCategory];
            currentServerIndex = 0;
            updateServerPillsEvents();
            updateActiveSourceLabel();
            renderSourcesPopoverList();
            updatePlayerContainer();
            return;
          }

          // If all providers finished and the chosen category is completely empty:
          if (isComplete) {
            isSearching = false;
            const fallbackCategory = currentCategory === 'dubbed' ? 'subtitled' : 'dubbed';
            if (categorizedServers[fallbackCategory]?.length > 0) {
              currentCategory = fallbackCategory;
              document.getElementById('tab-dubbed')?.classList.toggle('active', currentCategory === 'dubbed');
              document.getElementById('tab-subtitled')?.classList.toggle('active', currentCategory === 'subtitled');
              hasPlayerStartedPlaying = true;
              activeServers = categorizedServers[currentCategory];
              currentServerIndex = 0;
              updateServerPillsEvents();
              updateActiveSourceLabel();
              renderSourcesPopoverList();
              updatePlayerContainer();
              showToast(currentCategory === 'dubbed' 
                ? 'ℹ️ Altyazılı yayın bulunamadı, Türkçe Dublaj açıldı.' 
                : 'ℹ️ Dublaj bulunamadı, Altyazılı yayın açıldı.', 'info');
              return;
            }

            updateServerPillsEvents();
            updateActiveSourceLabel();
            renderSourcesPopoverList();
            updatePlayerContainer();
            return;
          }
        }

        // While playing or waiting: update activeServers for currentCategory
        activeServers = categorizedServers[currentCategory] || [];
        const currentPlayingSrv = activeServers[currentServerIndex];
        if (currentPlayingSrv && hasPlayerStartedPlaying) {
          const reIndex = activeServers.findIndex(s => (s.id && s.id === currentPlayingSrv.id) || (s.url && s.url === currentPlayingSrv.url));
          if (reIndex !== -1) {
            currentServerIndex = reIndex;
          }
        }

        // If player was waiting on an empty category and streams just arrived:
        if (!hasPlayerStartedPlaying && activeServers.length > 0) {
          hasPlayerStartedPlaying = true;
          isSearching = false;
          currentServerIndex = 0;
          updateServerPillsEvents();
          updateActiveSourceLabel();
          renderSourcesPopoverList();
          updatePlayerContainer();
          return;
        }

        // If error view or loader is visible and non-failed streams are now available:
        const isErrorOrWaiting = Boolean(document.querySelector('.player-error-view') || document.querySelector('.player-loading-overlay'));
        if (isErrorOrWaiting && activeServers.length > 0) {
          const freshIdx = activeServers.findIndex(s => !s.failed);
          if (freshIdx !== -1 && (freshIdx !== currentServerIndex || activeServers[currentServerIndex]?.failed)) {
            console.log('[PlayerModal] Resuming playback from newly arrived server:', activeServers[freshIdx].name);
            currentServerIndex = freshIdx;
            failoverCountInSession = 0;
            updateServerPillsEvents();
            updateActiveSourceLabel();
            renderSourcesPopoverList();
            updatePlayerContainer();
            return;
          }
        }

        if (!sourceRefreshFrame) {
          sourceRefreshFrame = requestAnimationFrame(() => {
            sourceRefreshFrame = 0;
            if (closed || generation !== discoveryGeneration) return;
            updateActiveSourceLabel();
            renderSourcesPopoverList();
            syncSubtitlesToActivePlayer();
          });
        }
      }
    });
  }

  // Initial Progressive Server Discovery
  startServerDiscovery();
  if (type === 'tv') renderDrawerContent();
  startWatchProgressLoop();

  // In-Place Episode Switching
  async function switchEpisodeInPlayer(newSeason, newEpisode) {
    if (isSwitchingEpisode) return;
    isSwitchingEpisode = true;

    disposePlayback();
    currentSeason = newSeason;
    currentEpisode = newEpisode;

    const titleEl = document.getElementById('player-modal-title');
    if (titleEl) titleEl.textContent = getDisplayTitle();

    const resumeBadge = document.getElementById('player-resume-time-badge');
    if (resumeBadge) resumeBadge.remove();

    const wrapper = document.getElementById('player-iframe-wrapper');
    if (wrapper) {
      wrapper.innerHTML = `
        <div class="player-loading-overlay">
          <div class="player-loader-core">
            <div class="player-loader-spinner"></div>
            <i data-lucide="play" class="player-loader-icon"></i>
          </div>
          <div class="player-loader-text">
            <h3>${cleanSeriesName}</h3>
            <p class="player-loader-sub">Sezon ${currentSeason} • Bölüm ${currentEpisode} Yükleniyor...</p>
            <p class="player-loader-hint">Yeni bölüm akış hatları taranıyor...</p>
          </div>
        </div>
      `;
      renderPlayerIcons(modalContainer);
    }


    const newRecord = getMediaProgress(tmdbId, currentSeason, currentEpisode);
    initialTime = newRecord ? newRecord.currentTime : 0;
    isWatched = isMediaWatched(tmdbId, currentSeason, currentEpisode);
    simulatedCurrentTime = initialTime;
    lastProgressSaveTimestamp = 0;
    startServerDiscovery({ isEpisodeSwitch: true });

    updateWatchedUI(isWatched);
    updateNavButtons();
    if (isSeries) {
      renderDrawerContent();
      updateEpisodeOverview(newSeason, newEpisode);
    }

    startWatchProgressLoop();
    renderPlayerIcons(modalContainer);
    isSwitchingEpisode = false;
  }

  // Dubbed / Subtitled Segmented Toggle Click Handlers
  const tabDubbed = document.getElementById('tab-dubbed');
  const tabSubtitled = document.getElementById('tab-subtitled');

  if (tabDubbed) {
    tabDubbed.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (currentCategory === 'dubbed') return;
      currentCategory = 'dubbed';
      failoverCountInSession = 0;
      try { localStorage.setItem('cp_preferred_category', 'dubbed'); } catch (_) {}
      tabSubtitled.classList.remove('active');
      tabDubbed.classList.add('active');
      disposePlayback();
      activeServers = categorizedServers['dubbed'] || [];
      currentServerIndex = 0;
      hasPlayerStartedPlaying = activeServers.length > 0;
      updateServerPillsEvents();
      updateActiveSourceLabel();
      renderSourcesPopoverList();
      updatePlayerContainer();
      showToast('🇹🇷 Türkçe Dublaj sunucularına geçildi.', 'info');
    });
  }

  if (tabSubtitled) {
    tabSubtitled.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (currentCategory === 'subtitled') return;
      currentCategory = 'subtitled';
      failoverCountInSession = 0;
      try { localStorage.setItem('cp_preferred_category', 'subtitled'); } catch (_) {}
      tabDubbed.classList.remove('active');
      tabSubtitled.classList.add('active');
      disposePlayback();
      activeServers = categorizedServers['subtitled'] || [];
      currentServerIndex = 0;
      hasPlayerStartedPlaying = activeServers.length > 0;
      updateServerPillsEvents();
      updateActiveSourceLabel();
      renderSourcesPopoverList();
      updatePlayerContainer();
      showToast('💬 Türkçe Altyazılı VIP sunucularına geçildi.', 'info');
    });
  }

  // Dizisol Cinema Action Buttons Event Listeners
  const btnOpenSources = document.getElementById('btn-open-sources-drawer');
  const btnCloseSources = document.getElementById('btn-close-sources-popover');
  const backdropSources = document.getElementById('sources-popover-backdrop');
  if (btnOpenSources) {
    btnOpenSources.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSourcesPopover();
    });
  }
  if (btnCloseSources) {
    btnCloseSources.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSourcesPopover(false);
    });
  }
  if (backdropSources) {
    backdropSources.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSourcesPopover(false);
    });
  }

  const btnTheater = document.getElementById('btn-player-theater');
  if (btnTheater) {
    btnTheater.addEventListener('click', () => {
      const box = document.getElementById('cinema-modal-box');
      if (box) {
        box.classList.toggle('theater-mode');
        btnTheater.classList.toggle('active');
        const isTheater = box.classList.contains('theater-mode');
        const span = btnTheater.querySelector('span');
        const icon = btnTheater.querySelector('[data-lucide]');
        if (span) span.textContent = isTheater ? 'Genişletildi' : 'Sinema';
        if (icon) icon.setAttribute('data-lucide', isTheater ? 'minimize-2' : 'tv');
        renderPlayerIcons(modalContainer);

        // On mobile, entering cinema mode also triggers native full-screen video if available
        const isMobile = window.innerWidth <= 768;
        const videoEl = document.getElementById('hls-video-player') || document.querySelector('#player-iframe-wrapper video');
        if (isMobile && videoEl && isTheater) {
          if (videoEl.webkitEnterFullscreen) {
            videoEl.webkitEnterFullscreen();
          } else if (videoEl.requestFullscreen) {
            videoEl.requestFullscreen().catch(() => {});
          }
        }

        if (isTheater) {
          const stage = document.querySelector('.player-stage-wrapper');
          if (stage) stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        showToast(isTheater ? '🎥 Sinema Modu (Genişletilmiş Sahne) Aktif Edildi.' : 'Normal Görünüme Dönüldü.', 'info');
      }
    });
  }

  const overviewEl = document.getElementById('dizisol-overview');
  if (overviewEl) {
    overviewEl.addEventListener('click', () => {
      overviewEl.classList.toggle('expanded');
    });
  }

  const btnReportIssue = document.getElementById('btn-report-issue');
  if (btnReportIssue) {
    btnReportIssue.addEventListener('click', () => {
      const cur = activeServers[currentServerIndex];
      showToast(`✅ Bildirim alındı: ${cur?.name || 'Yayın'} için sistem hata kaydı oluşturuldu. Sıradaki kaynağa geçiliyor...`, 'success');
      triggerAutoFailover('Kullanıcı hata bildirdi');
    });
  }

  const btnToggleList = document.getElementById('btn-toggle-list');
  if (btnToggleList) {
    btnToggleList.addEventListener('click', handleToggleWatched);
  }

  // Close Modal Cleanly
  const closeBtn = document.getElementById('player-close-btn');
  const closeModal = () => {
    if (closed) return;
    closed = true;
    discoveryGeneration++;
    if (!modalContainer.querySelector('#hls-video-player')) {
      persistCurrentProgress(simulatedCurrentTime, estimatedDuration, null, true);
    }
    disposePlayback();
    modalScope.dispose();
    activeModalClose = null;
    clearInterval(activeProgressInterval);

    window.removeEventListener('pagehide', handleGlobalPageUnload);
    window.removeEventListener('beforeunload', handleGlobalPageUnload);
    if (activeHlsInstance) {
      try { activeHlsInstance.destroy(); } catch (_) {}
      activeHlsInstance = null;
    }
    if (activeAudioHlsInstance) {
      try { activeAudioHlsInstance.destroy(); } catch (_) {}
      activeAudioHlsInstance = null;
    }
    if (originalWindowOpen) {
      window.open = originalWindowOpen;
      originalWindowOpen = null;
    }

    // Stop and mute all video & audio elements inside modal immediately
    try {
      const mediaElements = modalContainer.querySelectorAll('video, audio');
      mediaElements.forEach(m => {
        try {
          m.pause();
          m.removeAttribute('src');
          m.load();
        } catch (_) {}
      });
    } catch (_) {}

    // Clean up iframes
    const iframes = modalContainer.querySelectorAll('iframe');
    iframes.forEach(f => {
      try {
        f.src = 'about:blank';
        f.remove();
      } catch (_) {}
    });

    modalContainer.classList.add('hidden');
    modalContainer.innerHTML = '';
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleKeydown);
  };

  activeModalClose = closeModal;
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    });
  }

  modalContainer.onclick = (e) => {
    if (e.target === modalContainer) closeModal();
  };

  // Keyboard Shortcuts Handler
  const handleKeydown = (e) => {
    // Ignore keydown if user is typing in an input
    if (document.activeElement?.isContentEditable || ['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase())) {
      return;
    }

    if (document.activeElement?.tagName === 'BUTTON' && (e.code === 'Space' || e.key === 'Enter')) return;
    if (modalContainer.querySelector('.is-screen-locked') && e.key !== 'Escape') return;
    if (e.key === 'Escape') {
      if (isSourcesPopoverOpen) {
        toggleSourcesPopover(false);
      } else if (isShortcutsOpen) {
        toggleShortcuts(false);
      } else if (isDrawerOpen) {
        toggleDrawer(false);
      } else {
        closeModal();
      }
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      const modalBox = document.getElementById('cinema-modal-box') || document.documentElement;
      if (!document.fullscreenElement) {
        modalBox.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    } else if (e.key === 'e' || e.key === 'E' || e.key === 'b' || e.key === 'B') {
      if (isSeries) {
        e.preventDefault();
        toggleDrawer();
      }
    } else if (e.key === '?' || e.key === '/') {
      e.preventDefault();
      toggleShortcuts();
    } else if (e.key === 'n' || e.key === 'N') {
      const nextBtn = document.getElementById('btn-next-episode');
      if (nextBtn) nextBtn.click();
    } else if (e.key === 'p' || e.key === 'P') {
      const prevBtn = document.getElementById('btn-prev-episode');
      if (prevBtn) prevBtn.click();
    } else if (e.code === 'Space' || e.key === 'k' || e.key === 'K') {
      const videoEl = document.getElementById('hls-video-player');
      if (videoEl) {
        e.preventDefault();
        if (videoEl.paused) videoEl.play().catch(() => {});
        else videoEl.pause();
      }
    } else if (e.key === 'ArrowRight') {
      const videoEl = document.getElementById('hls-video-player');
      if (videoEl) {
        e.preventDefault();
        videoEl.currentTime = Math.min(videoEl.duration || 99999, videoEl.currentTime + 10);
      }
    } else if (e.key === 'ArrowLeft') {
      const videoEl = document.getElementById('hls-video-player');
      if (videoEl) {
        e.preventDefault();
        videoEl.currentTime = Math.max(0, videoEl.currentTime - 10);
      }
    } else if (e.key === 'm' || e.key === 'M') {
      const videoEl = document.getElementById('hls-video-player');
      if (videoEl) {
        e.preventDefault();
        videoEl.muted = !videoEl.muted;
        showToast(videoEl.muted ? '🔇 Ses kapatıldı' : '🔊 Ses açıldı', 'info');
      }
    }
  };

  document.addEventListener('keydown', handleKeydown);
}

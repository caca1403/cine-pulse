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

const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';

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

  // Intercept Pop-Up & Gambling Ads in Parent Window
  if (!originalWindowOpen) originalWindowOpen = window.open;
  window.open = function (url, target, features) {
    if (typeof url === 'string') {
      const allowed = ['vlc://', 'api.themoviedb.org', 'image.tmdb.org'];
      if (allowed.some(a => url.startsWith(a))) {
        return originalWindowOpen.call(window, url, target, features);
      }
    }
    console.warn('CinePulse Anti-Ad Shield: Engellendi ->', url);
    return {
      closed: false,
      focus: () => {},
      blur: () => {},
      close: () => {},
      location: { href: '' }
    };
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

  // Async fetch TMDB metadata (seasons, missing poster/backdrop, anime check)
  if (tmdbId) {
    const tmdbEndpoint = (!isSeries && type === 'movie') ? `https://api.themoviedb.org/3/movie/${tmdbId}` : `https://api.themoviedb.org/3/tv/${tmdbId}`;
    fetch(`${tmdbEndpoint}?api_key=${TMDB_API_KEY}&language=tr-TR`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (!posterPath && data.poster_path) posterPath = data.poster_path;
          if (!backdropPath && data.backdrop_path) backdropPath = data.backdrop_path;
          if (data.overview) mediaOverview = data.overview;
          if (Array.isArray(data.genres)) mediaGenres = data.genres.map(g => g.name);
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

  let mediaOverview = '';
  let mediaGenres = [];
  let isSourcesPopoverOpen = false;

  const existingRecord = getMediaProgress(tmdbId, currentSeason, currentEpisode);
  let initialTime = currentTime || (existingRecord ? existingRecord.currentTime : 0);
  let isWatched = isMediaWatched(tmdbId, currentSeason, currentEpisode);
  const estimatedDuration = duration > 0 ? duration : (type === 'movie' ? 6600 : 3000);
  let simulatedCurrentTime = initialTime;
  let isSwitchingEpisode = false;

  let currentCategory = 'dubbed';
  let activeServers = [];
  let currentServerIndex = 0;
  let categorizedServers = { dubbed: [], subtitled: [] };
  let isSearching = true;
  let countdownTimer = null;
  let countdownSeconds = 10;
  let hasPlayerStartedPlaying = false;

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
    if (overviewEl && mediaOverview) {
      overviewEl.textContent = mediaOverview;
    }
    const epBadge = document.querySelector('.dizisol-ep-badge');
    if (epBadge) {
      epBadge.textContent = isSeries ? `Sezon ${currentSeason} • Bölüm ${currentEpisode}` : 'Film';
    }
  }

  function getActiveServerName() {
    const srv = activeServers[currentServerIndex];
    if (!srv) return isSearching ? `Taranıyor (${countdownSeconds}s)...` : 'Kaynak Bulunamadı';
    return srv.displayName || srv.name || 'Sunucu';
  }

  function updateActiveSourceLabel() {
    const label = document.getElementById('active-source-chip-label');
    if (label) {
      label.textContent = `Kaynak: ${getActiveServerName()} (Değiştir)`;
    }
    renderSourcesPopoverList();
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
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index'), 10);
        if (idx === currentServerIndex) return;
        currentServerIndex = idx;
        toggleSourcesPopover(false);
        updateActiveSourceLabel();
        updatePlayerContainer();
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  function triggerAutoFailover(reason = 'Bağlantı yanıt vermedi') {
    const currentSrv = activeServers[currentServerIndex];
    if (currentSrv) {
      currentSrv.failed = true;
      currentSrv.failReason = reason;
      console.warn(`[PlayerModal] Server failed: ${currentSrv.name} (${reason}). Auto-failing over...`);
    }

    // Find next available non-failed server in active category
    const nextIndex = activeServers.findIndex((s, idx) => idx > currentServerIndex && !s.failed);
    if (nextIndex !== -1) {
      const nextSrv = activeServers[nextIndex];
      showToast(`⚠️ ${currentSrv?.displayName || currentSrv?.name || 'Mevcut kaynak'} yanıt vermedi (${reason}). ${nextSrv.displayName || nextSrv.name} hattına bağlanılıyor...`, 'warning');
      currentServerIndex = nextIndex;
      updateActiveSourceLabel();
      updatePlayerContainer();
      return;
    }

    // If current category is dubbed and all dubbed servers failed, automatically failover to subtitled!
    if (currentCategory === 'dubbed' && categorizedServers.subtitled?.some(s => !s.failed)) {
      showToast('⚠️ Dublaj hatları yanıt vermedi. Sistem otomatik olarak Türkçe Altyazılı yayına geçiş yaptı.', 'info');
      currentCategory = 'subtitled';
      const tabDub = document.getElementById('tab-dubbed');
      const tabSub = document.getElementById('tab-subtitled');
      if (tabDub && tabSub) {
        tabDub.classList.remove('active');
        tabSub.classList.add('active');
      }
      activeServers = categorizedServers.subtitled;
      currentServerIndex = activeServers.findIndex(s => !s.failed);
      if (currentServerIndex === -1) currentServerIndex = 0;
      updateActiveSourceLabel();
      updatePlayerContainer();
      return;
    }

    // All available servers failed
    showToast('❌ Bu içerik için çalışan bir yayın hattı bulunamadı.', 'error');
    const wrapper = document.getElementById('player-iframe-wrapper');
    if (wrapper) {
      wrapper.innerHTML = `
        <div class="player-error-view" style="display:flex;align-items:center;justify-content:center;height:100%;text-align:center;padding:2rem;">
          <div class="player-error-card" style="background:rgba(20,24,35,0.9);padding:2rem;border-radius:12px;border:1px solid rgba(255,255,255,0.1);max-width:450px;">
            <i data-lucide="alert-triangle" style="width:48px;height:48px;color:#ef4444;margin-bottom:1rem;"></i>
            <h3 style="color:#fff;margin-bottom:0.5rem;">Yayın Başlatılamadı</h3>
            <p style="color:#94a3b8;font-size:0.85rem;line-height:1.5;margin-bottom:1.25rem;">Mevcut sunuculardan yanıt alınamadı. Farklı bir dil sekmesini deneyebilir veya tekrar tarama başlatabilirsiniz.</p>
            <div style="display:flex;gap:0.75rem;justify-content:center;">
              <button class="btn-primary" id="btn-retry-all-streams" style="padding:0.5rem 1rem;font-size:0.82rem;"><i data-lucide="refresh-cw"></i> Tekrar Tara</button>
              <button class="btn-secondary" id="btn-open-failed-sources" style="padding:0.5rem 1rem;font-size:0.82rem;"><i data-lucide="layers"></i> Kaynakları Gör</button>
            </div>
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      document.getElementById('btn-retry-all-streams')?.addEventListener('click', () => startServerDiscovery());
      document.getElementById('btn-open-failed-sources')?.addEventListener('click', () => toggleSourcesPopover(true));
    }
  }

  function renderServerPills() {
    return '';
  }

  function resolveEffectiveSubtitles(srv) {
    if (Array.isArray(srv?.subtitles) && srv.subtitles.length > 0) {
      return srv.subtitles;
    }
    const pool = [...(activeServers || []), ...(categorizedServers?.subtitled || []), ...(categorizedServers?.dubbed || [])];
    const found = pool.find(s => Array.isArray(s.subtitles) && s.subtitles.length > 0);
    if (found && Array.isArray(found.subtitles) && found.subtitles.length > 0) {
      return found.subtitles;
    }
    const subUrl = (type === 'movie')
      ? `/api/subtitles?imdbId=${tmdbId}`
      : `/api/subtitles?imdbId=${tmdbId}&season=${currentSeason}&episode=${currentEpisode}`;
    return [{ label: 'Türkçe', src: subUrl }];
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
            } else if (defaultSubIdx === -1) {
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
    if (isSearching && (!activeServers || activeServers.length === 0)) {
      return `
        <div class="player-loading-overlay">
          <div class="player-loader-core">
            <div class="player-loader-spinner"></div>
            <i data-lucide="play" class="player-loader-icon"></i>
          </div>
          <div class="player-loader-text">
            <h3>${cleanSeriesName}</h3>
            <p class="player-loader-sub">${isSeries ? `Sezon ${currentSeason} • Bölüm ${currentEpisode}` : '4K Ultra HD Film Yayını'} Başlatılıyor...</p>
            <p class="player-loader-hint">Türkiye ve küresel CDN hatları taranıyor... <span class="player-countdown-badge"><span class="server-pulse-dot"></span> Canlı Tarama: ${countdownSeconds}s</span></p>
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

    const isTorrentStream = Boolean(srv.isTorrent || (srv.id && (srv.id.startsWith('cp_global_torrent') || srv.id.startsWith('cp_global_yts') || srv.id.startsWith('yts_'))) || (srv.streamUrl && srv.streamUrl.startsWith('magnet:')));

    if (isTorrentStream) {
      const magnetLink = srv.magnetUrl || (srv.streamUrl?.startsWith('magnet:') ? srv.streamUrl : '');
      const finalEmbedUrl = (srv.embedUrl && srv.embedUrl.startsWith('http'))
        ? srv.embedUrl
        : ((srv.streamUrl && srv.streamUrl.startsWith('http') && !srv.streamUrl.includes(':4000/torrent/'))
            ? srv.streamUrl
            : (tmdbId 
                ? (type === 'movie' 
                    ? `https://vidsrc.mov/embed/movie/${tmdbId}` 
                    : `https://vidsrc.mov/embed/tv/${tmdbId}/${currentSeason}/${currentEpisode}`)
                : ''));

      return `
        <div class="direct-video-wrapper torrent-video-wrapper">
          <div class="torrent-webtor-box" style="position:relative;width:100%;height:100%;overflow:hidden">
            <iframe 
              id="video-iframe" 
              src="${finalEmbedUrl}" 
              style="position:absolute;top:0;left:0;width:100%;height:100%;border:none"
              allowfullscreen="true"
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen">
            </iframe>
          </div>
        </div>
      `;
    }

    if (
      srv.isDirectVideo ||
      srv.isHls ||
      (srv.streamUrl && (srv.streamUrl.includes('.m3u8') || srv.streamUrl.includes('.mp4') || srv.streamUrl.includes('.mkv')))
    ) {
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
            <button id="btn-audio-original" class="dual-audio-btn active" title="Orijinal Ses">
              <span>🇬🇧 Orijinal</span>
            </button>
            <button id="btn-audio-dubbed" class="dual-audio-btn" title="Türkçe Dublaj Sesi">
              <span>🇹🇷 TR Dublaj</span>
            </button>
          </div>
          <span class="dual-audio-source-name" title="${srv.dubbedAudioName || ''}">
            Ses: ${srv.dubbedAudioName || 'TR Dublaj'}
          </span>
        </div>
      ` : '';

      const floatingAudioTip = !hasDubbedAudio ? `
        <div class="floating-audio-chip" id="floating-audio-chip">
          <div class="audio-chip-content">
            <i data-lucide="volume-2" style="width: 13px; height: 13px; color: #f59e0b;"></i>
            <span>Ses Gelmiyor mu? (Dolby AC3)</span>
            <a href="vlc://${streamUrl}" class="btn-audio-mini" title="VLC ile Aç">VLC</a>
            <a href="${streamUrl}" target="_blank" download class="btn-audio-mini" title="İndir">İndir</a>
          </div>
          <button class="btn-audio-chip-close" onclick="document.getElementById('floating-audio-chip')?.remove()">
            <i data-lucide="x" style="width: 12px; height: 12px;"></i>
          </button>
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
        <div class="direct-video-wrapper">
          ${dualAudioBarHTML}
          <video 
            id="hls-video-player" 
            controls 
            autoplay 
            playsinline
            webkit-playsinline
            crossorigin="anonymous"
            preload="auto">
            ${tracksHTML}
          </video>
          ${dubbedAudioHTML}
          ${floatingAudioTip}
        </div>
      `;
    }

    const finalIframeUrl = getStreamSafeUrl(srv);
    const isVidmoly = finalIframeUrl.includes('vidmoly');
    // All third-party video hosts (DP / Alpha Stream, EksenLoad, VidMoly, Rapid) block playback if the parent Vercel referer is leaked.
    // referrerpolicy="no-referrer" prevents hotlink detection and allows DP's player to authenticate stream URLs.
    const iframeReferrerPolicy = 'no-referrer';
    // Sandboxing should ONLY be used for VidMoly to suppress annoying popups.
    // Sandboxing breaks Alpha Stream / DP, EksenLoad, and other embeds by causing infinite loading spinner after preroll ads!
    const sandboxAttr = isVidmoly ? 'sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"' : '';
    return `
      <iframe 
        id="video-iframe" 
        src="${finalIframeUrl}" 
        ${sandboxAttr}
        allowfullscreen="true"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        referrerpolicy="${iframeReferrerPolicy}"
        allow="autoplay *; encrypted-media *; fullscreen *; picture-in-picture *; accelerometer *; gyroscope *; clipboard-write *; payment *; screen-wake-lock *; web-share *">
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
      if (window.lucide) window.lucide.createIcons();
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
            <span class="player-media-badge">${type === 'tv' ? `S${currentSeason} B${currentEpisode}` : '4K UHD'}</span>
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
          ${mediaOverview || 'İçerik bilgileri hazırlanıyor...'}
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
        ` : ''}
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
  if (window.lucide) window.lucide.createIcons();

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
          renderDrawerContent();
        });
      });
    }

    const loadingHTML = `
      <div class="drawer-loading" style="display:flex;align-items:center;gap:0.75rem;padding:1.5rem;color:#94a3b8;">
        <div class="drawer-spinner" style="width:20px;height:20px;border:2px solid rgba(255,255,255,0.2);border-top-color:#e50914;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
        <p style="margin:0;font-size:0.85rem;">Bölümler yükleniyor...</p>
      </div>
    `;

    if (carouselContainer) carouselContainer.innerHTML = loadingHTML;

    const episodes = await fetchSeasonEpisodes(drawerSeason);
    const count = (episodes && episodes.length > 0) ? episodes.length : (getSeasonEpisodeCount(drawerSeason) || 12);
    if (totalCountEl) totalCountEl.textContent = `${count} Bölüm`;

    let carouselCardsHTML = '';

    if (!episodes || episodes.length === 0) {
      const arr = Array.from({ length: count }, (_, i) => i + 1);
      carouselCardsHTML = arr.map(epNum => {
        const isCurrent = drawerSeason === currentSeason && epNum === currentEpisode;
        const epWatched = isMediaWatched(tmdbId, drawerSeason, epNum);
        return `
          <div class="dizisol-ep-card ${isCurrent ? 'playing' : ''}" data-season="${drawerSeason}" data-episode="${epNum}">
            <div class="dizisol-ep-thumb-box">
              <div class="ep-thumb-fallback" style="display:flex;align-items:center;justify-content:center;height:100%;color:#475569;"><i data-lucide="film" style="width:24px;height:24px"></i></div>
              <span class="dizisol-ep-badge-num ${isCurrent ? 'active' : ''}">${epNum}. Bölüm</span>
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
              <h5 class="dizisol-ep-title" title="${epNum}. Bölüm">${epNum}. Bölüm ${epWatched ? '✓' : ''}</h5>
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
          <div class="dizisol-ep-card ${isCurrent ? 'playing' : ''}" data-season="${drawerSeason}" data-episode="${epNum}">
            <div class="dizisol-ep-thumb-box">
              ${stillUrl ? `<img src="${stillUrl}" alt="B${epNum}" loading="lazy" />` : `<div class="ep-thumb-fallback" style="display:flex;align-items:center;justify-content:center;height:100%;color:#475569;"><i data-lucide="film" style="width:24px;height:24px"></i></div>`}
              <span class="dizisol-ep-badge-num ${isCurrent ? 'active' : ''}">${epNum}. Bölüm</span>
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
              <h5 class="dizisol-ep-title" title="${ep.name || `${epNum}. Bölüm`}">${ep.name || `${epNum}. Bölüm`}${epWatched ? ' ✓' : ''}</h5>
              ${airDateText ? `<span class="dizisol-ep-date">${airDateText}</span>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    if (carouselContainer) {
      carouselContainer.innerHTML = carouselCardsHTML;
      carouselContainer.querySelectorAll('.dizisol-ep-card').forEach(card => {
        card.addEventListener('click', () => {
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
      carouselContainer.addEventListener('scroll', updateScrollThumb, { passive: true });
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

    if (window.lucide) window.lucide.createIcons();
  }

  // Trigger initial drawer & mobile episode rail rendering for TV & Anime series
  if (isSeries) {
    renderDrawerContent();
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

    const episodes = await fetchSeasonEpisodes(currentSeason);
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

    if (window.lucide) window.lucide.createIcons();

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
      if (!document.fullscreenElement) {
        modalBox.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
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
      const icon = btn.querySelector('i');
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
    if (window.lucide) window.lucide.createIcons();
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

  async function updatePlayerContainer() {
    const wrapper = document.getElementById('player-iframe-wrapper');
    if (!wrapper) return;

    if (activeHlsInstance) {
      try { activeHlsInstance.destroy(); } catch (_) {}
      activeHlsInstance = null;
    }

    let srv = activeServers[currentServerIndex];

    wrapper.innerHTML = renderPlayerContent();
    if (window.lucide) window.lucide.createIcons();

    const popoutBtn = document.getElementById('player-popout-btn');
    if (popoutBtn) {
      popoutBtn.href = getStreamSafeUrl(srv) || '#';
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

    if (
      srv?.isDirectVideo ||
      srv?.isHls ||
      (srv?.streamUrl && (srv.streamUrl.includes('.m3u8') || srv.streamUrl.includes('.txt') || srv.streamUrl.includes('.mp4') || srv.streamUrl.includes('.mkv')))
    ) {
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
            maxBufferLength: 30,
            maxMaxBufferLength: 60
          });
          activeHlsInstance = hls;

          let hasStartedPlaying = false;
          let hlsWatchdog = setTimeout(() => {
            if (!hasStartedPlaying && videoEl.currentTime === 0) {
              console.warn('[PlayerModal] HLS playback stalled (>15s). Auto-failover triggered.');
              try { hls.destroy(); } catch (_) {}
              activeHlsInstance = null;
              triggerAutoFailover('Yayın zaman aşımı (Başlatılamadı)');
            }
          }, 15000);

          const clearHlsWatchdog = () => {
            hasStartedPlaying = true;
            if (hlsWatchdog) {
              clearTimeout(hlsWatchdog);
              hlsWatchdog = null;
            }
          };

          videoEl.addEventListener('playing', clearHlsWatchdog, { once: true });
          videoEl.addEventListener('timeupdate', clearHlsWatchdog, { once: true });

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
            videoEl.play().catch(() => {});
          });
          videoEl.addEventListener('loadedmetadata', applySafeSeek, { once: true });

          let networkErrorCount = 0;
          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              clearHlsWatchdog();
              if (data.response && (data.response.code >= 400 || data.response.code === 0)) {
                try { hls.destroy(); } catch (_) {}
                activeHlsInstance = null;
                triggerAutoFailover(`Sunucu Hatası (HTTP ${data.response.code})`);
                return;
              }
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  networkErrorCount++;
                  if (networkErrorCount > 1) {
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
          videoEl.addEventListener('loadedmetadata', () => {
            if (initialTime > 0) {
              const dur = videoEl.duration;
              if (dur && isFinite(dur) && dur > 10 && initialTime >= dur - 15) {
                videoEl.currentTime = 0;
              } else {
                videoEl.currentTime = initialTime;
              }
            }
            videoEl.play().catch(() => {});
          });
          videoEl.addEventListener('error', () => {
            triggerAutoFailover('iOS Oynatıcı Hatası');
          });
        } else {
          videoEl.src = streamUrl;

          // 12-second watchdog timer to eliminate dead/stalled stream freezes
          let directStreamWatchdog = setTimeout(() => {
            if (videoEl.readyState < 2) {
              console.warn('[PlayerModal] Direct video stream stalled. Auto-failing over...');
              triggerAutoFailover('Yayın zaman aşımı (Veri alınamadı)');
            }
          }, 12000);

          const clearDirectWatchdog = () => {
            if (directStreamWatchdog) {
              clearTimeout(directStreamWatchdog);
              directStreamWatchdog = null;
            }
          };

          videoEl.addEventListener('loadeddata', clearDirectWatchdog, { once: true });
          videoEl.addEventListener('canplay', clearDirectWatchdog, { once: true });
          videoEl.addEventListener('playing', clearDirectWatchdog, { once: true });

          videoEl.addEventListener('loadedmetadata', () => {
            if (initialTime > 0) {
              const dur = videoEl.duration;
              if (dur && isFinite(dur) && dur > 10 && initialTime >= dur - 15) {
                videoEl.currentTime = 0;
              } else {
                videoEl.currentTime = initialTime;
              }
            }
            videoEl.play().catch(() => {});
          });
          videoEl.addEventListener('error', () => {
            clearDirectWatchdog();
            triggerAutoFailover('Video Oynatma Hatası');
          });
        }

        // ============ Dual-Audio Synchronization Engine ============
        const dubbedAudioEl = document.getElementById('dubbed-audio-source');
        const btnOriginal = document.getElementById('btn-audio-original');
        const btnDubbed = document.getElementById('btn-audio-dubbed');

        if (dubbedAudioEl && srv.dubbedAudioUrl) {
          let currentAudioTrack = 'dubbed';
          const dubbedUrl = srv.dubbedAudioUrl;
          const isAudioHls = dubbedUrl.includes('.m3u8') || srv.dubbedAudioIsHls;

          if (isAudioHls && window.Hls && Hls.isSupported()) {
            const audioHls = new Hls({
              enableWorker: true,
              lowLatencyMode: true
            });
            activeAudioHlsInstance = audioHls;
            audioHls.loadSource(dubbedUrl);
            audioHls.attachMedia(dubbedAudioEl);
          } else {
            dubbedAudioEl.src = dubbedUrl;
          }

          const setAudioTrack = (track, silent = false) => {
            currentAudioTrack = track;
            if (track === 'dubbed') {
              if (btnDubbed) btnDubbed.classList.add('active');
              if (btnOriginal) btnOriginal.classList.remove('active');

              // If the main video itself is already the dubbed stream, just unmute videoEl!
              if (!dubbedAudioEl || (srv.streamUrl === srv.dubbedAudioUrl)) {
                videoEl.muted = false;
                if (!silent) showToast('🇹🇷 Türkçe Dublaj sesi aktif.', 'success');
                return;
              }

              videoEl.muted = true;
              dubbedAudioEl.muted = false;
              dubbedAudioEl.volume = videoEl.volume;
              if (videoEl.currentTime > 0 && Math.abs(dubbedAudioEl.currentTime - videoEl.currentTime) > 0.3) {
                try { dubbedAudioEl.currentTime = videoEl.currentTime; } catch (_) {}
              }
              if (!videoEl.paused) {
                dubbedAudioEl.play().catch(() => {
                  // Fallback: if dubbed audio play failed/blocked, unmute videoEl so sound is never lost
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

          if (btnOriginal) {
            btnOriginal.onclick = () => setAudioTrack('original');
          }
          if (btnDubbed) {
            btnDubbed.onclick = () => setAudioTrack('dubbed');
          }

          // Initial track setting without spamming toast
          setAudioTrack('dubbed', true);

          videoEl.addEventListener('canplay', () => {
            if (currentAudioTrack === 'dubbed') {
              if (Math.abs(dubbedAudioEl.currentTime - videoEl.currentTime) > 0.3) {
                try { dubbedAudioEl.currentTime = videoEl.currentTime; } catch (_) {}
              }
              if (!videoEl.paused) dubbedAudioEl.play().catch(() => {});
            }
          }, { once: true });

          videoEl.addEventListener('play', () => {
            if (currentAudioTrack === 'dubbed') {
              dubbedAudioEl.currentTime = videoEl.currentTime;
              dubbedAudioEl.play().catch(() => {});
            }
          });

          videoEl.addEventListener('pause', () => {
            if (currentAudioTrack === 'dubbed') {
              dubbedAudioEl.pause();
            }
          });

          videoEl.addEventListener('seeking', () => {
            if (currentAudioTrack === 'dubbed') {
              dubbedAudioEl.currentTime = videoEl.currentTime;
            }
          });

          videoEl.addEventListener('seeked', () => {
            if (currentAudioTrack === 'dubbed') {
              dubbedAudioEl.currentTime = videoEl.currentTime;
              if (!videoEl.paused) dubbedAudioEl.play().catch(() => {});
            }
          });

          videoEl.addEventListener('waiting', () => {
            if (currentAudioTrack === 'dubbed') {
              dubbedAudioEl.pause();
            }
          });

          videoEl.addEventListener('playing', () => {
            if (currentAudioTrack === 'dubbed') {
              if (Math.abs(dubbedAudioEl.currentTime - videoEl.currentTime) > 0.25) {
                dubbedAudioEl.currentTime = videoEl.currentTime;
              }
              dubbedAudioEl.play().catch(() => {});
            }
          });

          videoEl.addEventListener('volumechange', () => {
            if (currentAudioTrack === 'dubbed') {
              dubbedAudioEl.volume = videoEl.volume;
              dubbedAudioEl.muted = videoEl.muted;
            }
          });

          videoEl.addEventListener('timeupdate', () => {
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
    if (window.lucide) window.lucide.createIcons();

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

  function startServerDiscovery({ isEpisodeSwitch = false } = {}) {
    if (countdownTimer) clearInterval(countdownTimer);
    countdownSeconds = 10;
    isSearching = true;
    hasPlayerStartedPlaying = false;
    categorizedServers = { dubbed: [], subtitled: [] };
    activeServers = [];

    updateServerPillsEvents();
    updatePlayerContainer();

    const updateCountdownDisplay = () => {
      const hint = document.querySelector('.player-loader-hint');
      if (hint) {
        hint.innerHTML = `Türkiye ve küresel CDN hatları taranıyor... <span class="player-countdown-badge"><span class="server-pulse-dot"></span> Canlı Tarama: ${countdownSeconds}s</span>`;
      }
      const pillLoading = document.querySelector('.server-pill-loading span:last-child');
      if (pillLoading) {
        pillLoading.textContent = `Yayın hatları taranıyor (${countdownSeconds}s)...`;
      }
    };

    updateCountdownDisplay();
    countdownTimer = setInterval(() => {
      countdownSeconds--;
      updateCountdownDisplay();

      // Quick fallback: If 8s passed and no dubbed but subtitled exists, start immediately!
      if (currentCategory === 'dubbed' && !hasPlayerStartedPlaying && categorizedServers.subtitled?.length > 0 && countdownSeconds <= 2) {
        if (!categorizedServers.dubbed || categorizedServers.dubbed.length === 0) {
          clearInterval(countdownTimer);
          countdownTimer = null;
          isSearching = false;
          showToast('💬 Türkçe Dublaj beklenmeden Türkçe Altyazılı oynatıcı anında başlatıldı.', 'info');
          currentCategory = 'subtitled';
          const tabDub = document.getElementById('tab-dubbed');
          const tabSub = document.getElementById('tab-subtitled');
          if (tabDub && tabSub) {
            tabDub.classList.remove('active');
            tabSub.classList.add('active');
          }
          activeServers = categorizedServers['subtitled'] || [];
          currentServerIndex = 0;
          hasPlayerStartedPlaying = true;
          updateServerPillsEvents();
          updatePlayerContainer();
          return;
        }
      }

      // When countdown finishes:
      if (countdownSeconds <= 0) {
        clearInterval(countdownTimer);
        countdownTimer = null;
        isSearching = false;

        // If user is on Dubbed and NO dubbed source was found, automatically redirect to Subtitled
        if (currentCategory === 'dubbed' && (!categorizedServers.dubbed || categorizedServers.dubbed.length === 0)) {
          if (categorizedServers.subtitled && categorizedServers.subtitled.length > 0) {
            showToast('💬 Türkçe Dublaj bulunamadı. Türkçe Altyazılı sunuculara yönlendirildiniz.', 'info');
            currentCategory = 'subtitled';
            const tabDub = document.getElementById('tab-dubbed');
            const tabSub = document.getElementById('tab-subtitled');
            if (tabDub && tabSub) {
              tabDub.classList.remove('active');
              tabSub.classList.add('active');
            }
            activeServers = categorizedServers['subtitled'] || [];
            currentServerIndex = 0;
            updateServerPillsEvents();
            updatePlayerContainer();
          } else {
            updateServerPillsEvents();
            updatePlayerContainer();
          }
        } else {
          updateServerPillsEvents();
          updatePlayerContainer();
        }
      }
    }, 1000);

    getStreamingServersProgressive({
      type,
      tmdbId,
      title: cleanSeriesName,
      seriesTitle: cleanSeriesName,
      originalTitle,
      season: currentSeason,
      episode: currentEpisode,
      onUpdate: ({ dubbed = [], subtitled = [], isComplete = false, newStream = null, isDubbedStream = false }) => {
        categorizedServers = { dubbed, subtitled };

        // Live Dubbed stream alert while user is watching in Subtitled
        if (currentCategory === 'subtitled' && isDubbedStream && newStream) {
          showDubbedFoundBanner(newStream);
          showToast(`🇹🇷 Türkçe Dublaj yayını bulundu: ${newStream.displayName}`, 'success');
        }

        // 1. INSTANT PLAY: If Dubbed stream arrives and we are on Dubbed, launch immediately!
        if (currentCategory === 'dubbed' && dubbed.length > 0 && !hasPlayerStartedPlaying) {
          if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
          }
          hasPlayerStartedPlaying = true;
          isSearching = false;
          activeServers = dubbed;
          currentServerIndex = 0;
          updateActiveSourceLabel();
          updatePlayerContainer();
          return;
        }

        // 2. If user is in subtitled mode and subtitled stream arrives, launch immediately!
        if (currentCategory === 'subtitled' && subtitled.length > 0 && !hasPlayerStartedPlaying) {
          if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
          }
          hasPlayerStartedPlaying = true;
          isSearching = false;
          activeServers = subtitled;
          currentServerIndex = 0;
          updateActiveSourceLabel();
          updatePlayerContainer();
          return;
        }

        // 3. Keep sources popover list and subtitles updated as more servers arrive
        activeServers = categorizedServers[currentCategory] || [];
        updateActiveSourceLabel();
        syncSubtitlesToActivePlayer();

        if (isComplete && activeServers.length === 0) {
          if (currentCategory === 'dubbed' && subtitled.length > 0 && !hasPlayerStartedPlaying) {
            currentCategory = 'subtitled';
            const tabDub = document.getElementById('tab-dubbed');
            const tabSub = document.getElementById('tab-subtitled');
            if (tabDub && tabSub) {
              tabDub.classList.remove('active');
              tabSub.classList.add('active');
            }
            activeServers = subtitled;
            currentServerIndex = 0;
            hasPlayerStartedPlaying = true;
          }
          updateActiveSourceLabel();
          updatePlayerContainer();
        }
      }
    });
  }

  // Initial Progressive Server Discovery
  startServerDiscovery();
  if (type === 'tv') renderDrawerContent();

  // Progress Saving Interval
  clearInterval(activeProgressInterval);
  activeProgressInterval = setInterval(() => {
    simulatedCurrentTime += 5;
    const progressPercent = estimatedDuration > 0 ? Math.round((simulatedCurrentTime / estimatedDuration) * 100) : 0;
    if (progressPercent >= 90 && !isWatched) {
      isWatched = true;
      [document.getElementById('btn-toggle-watched-player'), document.getElementById('btn-toggle-watched-mobile')].forEach(btn => {
        if (!btn) return;
        const span = btn.querySelector('span');
        const icon = btn.querySelector('i');
        if (span) span.textContent = 'İzlendi';
        if (icon) icon.setAttribute('data-lucide', 'check-circle-2');
        btn.classList.add('watched-active');
      });
      if (type === 'tv') renderDrawerContent();
      if (window.lucide) window.lucide.createIcons();
    }
    saveWatchProgress({
      id: tmdbId,
      title: cleanSeriesName,
      posterPath,
      backdropPath,
      type,
      season: currentSeason,
      episode: currentEpisode,
      currentTime: simulatedCurrentTime,
      duration: estimatedDuration,
      completed: isWatched
    });
  }, 5000);

  // In-Place Episode Switching
  async function switchEpisodeInPlayer(newSeason, newEpisode) {
    if (isSwitchingEpisode) return;
    isSwitchingEpisode = true;

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
      if (window.lucide) window.lucide.createIcons();
    }

    startServerDiscovery({ isEpisodeSwitch: true });

    const newRecord = getMediaProgress(tmdbId, currentSeason, currentEpisode);
    initialTime = newRecord ? newRecord.currentTime : 0;
    isWatched = isMediaWatched(tmdbId, currentSeason, currentEpisode);

    [document.getElementById('btn-toggle-watched-player'), document.getElementById('btn-toggle-watched-mobile')].forEach(btn => {
      if (!btn) return;
      const span = btn.querySelector('span');
      const icon = btn.querySelector('i');
      if (span) span.textContent = isWatched ? 'İzlendi' : 'İzlendi Yap';
      if (icon) icon.setAttribute('data-lucide', isWatched ? 'check-circle-2' : 'check');
      if (isWatched) {
        btn.classList.add('watched-active');
      } else {
        btn.classList.remove('watched-active');
      }
    });

    updateNavButtons();
    if (isSeries) renderDrawerContent();

    simulatedCurrentTime = initialTime;
    isSwitchingEpisode = false;
    if (window.lucide) window.lucide.createIcons();

    clearInterval(activeProgressInterval);
    activeProgressInterval = setInterval(() => {
      simulatedCurrentTime += 5;
      const progressPercent = estimatedDuration > 0 ? Math.round((simulatedCurrentTime / estimatedDuration) * 100) : 0;
      if (progressPercent >= 90 && !isWatched) {
        isWatched = true;
        [document.getElementById('btn-toggle-watched-player'), document.getElementById('btn-toggle-watched-mobile')].forEach(btn => {
          if (!btn) return;
          const span = btn.querySelector('span');
          const icon = btn.querySelector('i');
          if (span) span.textContent = 'İzlendi';
          if (icon) icon.setAttribute('data-lucide', 'check-circle-2');
          btn.classList.add('watched-active');
        });
        if (isSeries) renderDrawerContent();
        if (window.lucide) window.lucide.createIcons();
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
        currentTime: simulatedCurrentTime,
        duration: estimatedDuration,
        completed: isWatched
      });
    }, 5000);

    if (window.lucide) window.lucide.createIcons();
    isSwitchingEpisode = false;
  }

  // Dubbed / Subtitled Segmented Toggle Click Handlers
  const tabDubbed = document.getElementById('tab-dubbed');
  const tabSubtitled = document.getElementById('tab-subtitled');

  if (tabDubbed) {
    tabDubbed.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentCategory === 'dubbed') return;
      currentCategory = 'dubbed';
      tabSubtitled.classList.remove('active');
      tabDubbed.classList.add('active');
      activeServers = categorizedServers['dubbed'] || [];
      currentServerIndex = 0;
      updateServerPillsEvents();
      updatePlayerContainer();
      showToast('🇹🇷 Türkçe Dublaj sunucularına geçildi.', 'info');
    });
  }

  if (tabSubtitled) {
    tabSubtitled.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentCategory === 'subtitled') return;
      currentCategory = 'subtitled';
      tabDubbed.classList.remove('active');
      tabSubtitled.classList.add('active');
      activeServers = categorizedServers['subtitled'] || [];
      currentServerIndex = 0;
      updateActiveSourceLabel();
      updatePlayerContainer();
      showToast('💬 Türkçe Altyazılı VIP sunucularına geçildi.', 'info');
    });
  }

  // Dizisol Cinema Action Buttons Event Listeners
  const btnOpenSources = document.getElementById('btn-open-sources-drawer');
  const btnCloseSources = document.getElementById('btn-close-sources-popover');
  const backdropSources = document.getElementById('sources-popover-backdrop');
  if (btnOpenSources) btnOpenSources.addEventListener('click', () => toggleSourcesPopover());
  if (btnCloseSources) btnCloseSources.addEventListener('click', () => toggleSourcesPopover(false));
  if (backdropSources) backdropSources.addEventListener('click', () => toggleSourcesPopover(false));

  const btnTheater = document.getElementById('btn-player-theater');
  if (btnTheater) {
    btnTheater.addEventListener('click', () => {
      const box = document.getElementById('cinema-modal-box');
      if (box) {
        box.classList.toggle('theater-mode');
        btnTheater.classList.toggle('active');
        const isTheater = box.classList.contains('theater-mode');
        const span = btnTheater.querySelector('span');
        const icon = btnTheater.querySelector('i');
        if (span) span.textContent = isTheater ? 'Genişletildi' : 'Sinema';
        if (icon) icon.setAttribute('data-lucide', isTheater ? 'minimize-2' : 'tv');
        if (window.lucide) window.lucide.createIcons();

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
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
    clearInterval(activeProgressInterval);
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

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalContainer.onclick = (e) => {
    if (e.target === modalContainer) closeModal();
  };

  // Keyboard Shortcuts Handler
  const handleKeydown = (e) => {
    // Ignore keydown if user is typing in an input
    if (['input', 'textarea', 'select'].includes(document.activeElement?.tagName?.toLowerCase())) {
      return;
    }

    if (e.key === 'Escape') {
      if (isShortcutsOpen) {
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

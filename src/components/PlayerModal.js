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
  markMediaWatched
} from '../services/storage.js';
import { showToast } from './Toast.js';

const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';

let activeProgressInterval = null;
let originalWindowOpen = null;
let activeHlsInstance = null;

export async function openPlayerModal({
  type = 'tv',
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

  const rawSeries = seriesTitle || title || '';
  const cleanSeriesName = rawSeries
    .replace(/\s*-\s*S\d+E\d+.*$/i, '')
    .replace(/\s*-\s*S\d+.*$/i, '')
    .replace(/\s*-\s*\d+\.\s*Sezon.*$/i, '')
    .replace(/\s*:\s*.*$/, '')
    .replace(/\s*\(\d{4}\).*/, '')
    .trim();

  // Async fetch TMDB metadata (seasons, missing poster/backdrop)
  if (tmdbId) {
    const tmdbEndpoint = type === 'tv' ? `https://api.themoviedb.org/3/tv/${tmdbId}` : `https://api.themoviedb.org/3/movie/${tmdbId}`;
    fetch(`${tmdbEndpoint}?api_key=${TMDB_API_KEY}&language=tr-TR`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (!posterPath && data.poster_path) posterPath = data.poster_path;
          if (!backdropPath && data.backdrop_path) backdropPath = data.backdrop_path;
          if (type === 'tv' && data.seasons && currentSeasonsList.length === 0) {
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
    return type === 'tv'
      ? `${cleanSeriesName} • S${currentSeason} B${currentEpisode}`
      : cleanSeriesName;
  }

  function renderServerPills() {
    if (isSearching && (!activeServers || activeServers.length === 0)) {
      return `
        <div class="server-pill-loading">
          <span class="server-pulse-dot"></span>
          <span>Yayın hatları taranıyor (${countdownSeconds}s)...</span>
        </div>
      `;
    }

    if (!activeServers || activeServers.length === 0) {
      if (currentCategory === 'dubbed') {
        return `
          <div class="server-pill-alert">
            <span class="server-status-dot dot-amber"></span>
            <span>Bu içerikte Türkçe Dublaj akışı bulunamadı. Altyazılı sekmesine geçebilirsiniz.</span>
          </div>
        `;
      }
      return `
        <div class="server-pill-alert">
          <span class="server-status-dot dot-red"></span>
          <span>Aktif yayın hattı bulunamadı.</span>
        </div>
      `;
    }

    return activeServers.map((srv, idx) => `
      <button class="server-btn ${idx === currentServerIndex ? 'active' : ''} ${srv.notFound ? 'not-found-pill' : ''}" data-index="${idx}" title="${srv.name}">
        <span class="server-status-dot ${srv.notFound ? 'dot-red' : (idx === currentServerIndex ? 'dot-green' : 'dot-amber')}"></span>
        <span class="server-name-label">${srv.displayName || srv.name}</span>
      </button>
    `).join('');
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
            <p class="player-loader-sub">${type === 'tv' ? `Sezon ${currentSeason} • Bölüm ${currentEpisode}` : '4K Ultra HD Film Yayını'} Başlatılıyor...</p>
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

    if (
      srv.isDirectVideo ||
      srv.isHls ||
      (srv.streamUrl && (srv.streamUrl.includes('.m3u8') || srv.streamUrl.includes('.mp4') || srv.streamUrl.includes('.mkv')))
    ) {
      const streamUrl = srv.streamUrl || srv.getUrl();
      const floatingAudioTip = `
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
      `;

      let tracksHTML = '';
      if (Array.isArray(srv.subtitles) && srv.subtitles.length > 0) {
        tracksHTML = srv.subtitles.map((sub, idx) => `
          <track kind="subtitles" label="${sub.label || 'Altyazı'}" src="${sub.src}" srclang="${(sub.label || '').toLowerCase().includes('türk') ? 'tr' : 'en'}" ${idx === 0 ? 'default' : ''}>
        `).join('');
      }

      return `
        <div class="direct-video-wrapper">
          <video 
            id="hls-video-player" 
            controls 
            autoplay 
            playsinline
            webkit-playsinline
            preload="auto">
            ${tracksHTML}
          </video>
          ${floatingAudioTip}
        </div>
      `;
    }

    const finalIframeUrl = srv.getUrl() || srv.streamUrl || '';
    const isEksenLoad = finalIframeUrl.includes('eksenload') || finalIframeUrl.includes('vidload') || (srv.name || '').includes('EksenLoad');
    const iframeReferrerPolicy = isEksenLoad ? 'no-referrer' : 'origin';
    return `
      <iframe 
        id="video-iframe" 
        src="${finalIframeUrl}" 
        allowfullscreen="true"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
        referrerpolicy="${iframeReferrerPolicy}"
        allow="autoplay *; encrypted-media *; fullscreen *; picture-in-picture *; accelerometer *; gyroscope *; clipboard-write *; payment *; screen-wake-lock *; web-share *">
      </iframe>
    `;
  }

  function renderFooterNavButtonsHTML() {
    if (type !== 'tv') return '';

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

  // --- RENDER COMPLETE NETFLIX/PRIME LUXURY MODAL SHELL ---
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

        <!-- Right: Action Icons (Drawer on Desktop, Shortcuts, Fullscreen, External) -->
        <div class="player-header-right">
          ${type === 'tv' ? `
            <button id="btn-toggle-drawer" class="btn-player-tool desktop-only-tool" title="Bölümler & Sezonlar Menüsü (E / B)">
              <i data-lucide="layout-grid" style="width: 16px; height: 16px;"></i>
              <span class="tool-label-text">Bölümler</span>
            </button>
          ` : ''}

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

      <!-- VIP Server Pills Carousel Strip -->
      <div class="server-toolbar" id="player-server-toolbar">
        ${renderServerPills()}
      </div>

      <!-- Center Player Video Container with Relative Overlay Drawer -->
      <div class="player-stage-wrapper">
        
        <div class="player-iframe-container" id="player-iframe-wrapper">
          ${renderPlayerContent()}
        </div>

        <!-- Mobile Action Strip (Watched & Halfway right below Video) -->
        <div class="mobile-action-strip">
          <button id="btn-toggle-watched-mobile" class="btn-footer-pill ${isWatched ? 'watched-active' : ''}">
            <i data-lucide="${isWatched ? 'check-circle-2' : 'check'}" style="width: 15px; height: 15px;"></i>
            <span>${isWatched ? 'İzlendi' : 'İzlendi Yap'}</span>
          </button>

          <button id="btn-halfway-mobile" class="btn-footer-pill" title="Kaldığım Yeri Kaydet (20. dk)">
            <i data-lucide="clock" style="width: 14px; height: 14px; color: #fbbf24;"></i>
            <span>⏳ Yarıda Bırak</span>
          </button>
        </div>

        <!-- Mobile Always-Open Horizontal Episodes & Season Selector (Middle Rail) -->
        ${type === 'tv' ? `
          <div class="mobile-episodes-section" id="mobile-episodes-section">
            <div class="mobile-episodes-header">
              <div class="mobile-episodes-title">
                <i data-lucide="layers" style="width: 15px; height: 15px; color: var(--primary);"></i>
                <span>Tüm Bölümler</span>
              </div>
            </div>
            
            <div class="mobile-season-picker-rail">
              <div class="mobile-season-picker" id="mobile-season-picker">
                <!-- Season tabs injected dynamically -->
              </div>
            </div>
            
            <div class="mobile-episodes-rail" id="mobile-episodes-rail">
              <div class="drawer-loading">
                <div class="drawer-spinner"></div>
                <p>Bölümler yükleniyor...</p>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Desktop Netflix-Style In-Player Episode Selector Drawer (Desktop Only) -->
        ${type === 'tv' ? `
          <div class="in-player-drawer hidden" id="player-episode-drawer">
            <div class="drawer-header">
              <div class="drawer-header-left">
                <i data-lucide="film" style="width: 18px; height: 18px; color: var(--primary);"></i>
                <h3>Bölüm Seçici</h3>
              </div>
              <button id="btn-close-drawer" class="btn-close-drawer">
                <i data-lucide="x" style="width: 16px; height: 16px;"></i>
              </button>
            </div>
            
            <!-- Season Switcher Pills inside Drawer -->
            <div class="drawer-season-tabs" id="drawer-season-tabs">
              <!-- Injected dynamically -->
            </div>

            <!-- Episodes List Cards -->
            <div class="drawer-episodes-list" id="drawer-episodes-list">
              <div class="drawer-loading">
                <div class="drawer-spinner"></div>
                <p>Bölümler yükleniyor...</p>
              </div>
            </div>
          </div>
        ` : ''}

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
            <div class="shortcut-item"><kbd>E</kbd> / <kbd>B</kbd><span>Bölümler Menüsü</span></div>
            <div class="shortcut-item"><kbd>M</kbd><span>Sesi Aç / Kapat</span></div>
            <div class="shortcut-item"><kbd>ESC</kbd><span>Oynatıcıyı Kapat</span></div>
          </div>
        </div>

      </div>

      <!-- Modern Footer Action Bar -->
      <div class="player-footer-bar">
        
        <!-- Left: Action Tools (Watched, Halfway) -->
        <div class="player-footer-left">
          <button id="btn-toggle-watched-player" class="btn-footer-pill ${isWatched ? 'watched-active' : ''}">
            <i data-lucide="${isWatched ? 'check-circle-2' : 'check'}" style="width: 15px; height: 15px;"></i>
            <span>${isWatched ? 'İzlendi' : 'İzlendi Yap'}</span>
          </button>

          <button id="btn-halfway-player" class="btn-footer-pill" title="Kaldığım Yeri Kaydet (20. dk)">
            <i data-lucide="clock" style="width: 14px; height: 14px; color: #fbbf24;"></i>
            <span>⏳ Yarıda Bırak</span>
          </button>

          <span class="player-status-badge">
            <i data-lucide="shield-check" style="width: 13px; height: 13px; color: #10b981;"></i>
            <span>Canlı Hat</span>
          </span>
        </div>

        <!-- Right: Next / Previous Navigation Controls -->
        <div id="player-nav-btn-group" class="player-footer-right player-nav-btn-row">
          ${renderFooterNavButtonsHTML()}
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
    const tabsContainer = document.getElementById('drawer-season-tabs');
    const listContainer = document.getElementById('drawer-episodes-list');
    const mobileTabsContainer = document.getElementById('mobile-season-picker');
    const mobileRailContainer = document.getElementById('mobile-episodes-rail');

    // Render Season Pills
    const seasons = currentSeasonsList.length > 0
      ? currentSeasonsList
      : Array.from({ length: 5 }, (_, i) => ({ season_number: i + 1, name: `${i + 1}. Sezon` }));

    const seasonPillsHTML = seasons.map(s => `
      <button class="drawer-season-btn ${s.season_number === drawerSeason ? 'active' : ''}" data-season="${s.season_number}">
        Sezon ${s.season_number}
      </button>
    `).join('');

    if (tabsContainer) tabsContainer.innerHTML = seasonPillsHTML;
    if (mobileTabsContainer) mobileTabsContainer.innerHTML = seasonPillsHTML;

    const bindSeasonClicks = (container) => {
      if (!container) return;
      container.querySelectorAll('.drawer-season-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const s = parseInt(btn.getAttribute('data-season'), 10);
          drawerSeason = s;
          renderDrawerContent();
        });
      });
    };

    bindSeasonClicks(tabsContainer);
    bindSeasonClicks(mobileTabsContainer);

    const loadingHTML = `
      <div class="drawer-loading">
        <div class="drawer-spinner"></div>
        <p>Sezon ${drawerSeason} yükleniyor...</p>
      </div>
    `;

    if (listContainer) listContainer.innerHTML = loadingHTML;
    if (mobileRailContainer) mobileRailContainer.innerHTML = loadingHTML;

    const episodes = await fetchSeasonEpisodes(drawerSeason);

    let desktopEpCardsHTML = '';
    let mobileEpCardsHTML = '';

    if (!episodes || episodes.length === 0) {
      const count = getSeasonEpisodeCount(drawerSeason) || 12;
      const arr = Array.from({ length: count }, (_, i) => i + 1);
      
      desktopEpCardsHTML = arr.map(epNum => {
        const isCurrent = drawerSeason === currentSeason && epNum === currentEpisode;
        const epWatched = isMediaWatched(tmdbId, drawerSeason, epNum);
        return `
          <div class="drawer-ep-card ${isCurrent ? 'playing' : ''}" data-season="${drawerSeason}" data-episode="${epNum}">
            <div class="ep-card-num-box">
              <span class="ep-num-label">${epNum}</span>
              ${isCurrent ? '<i data-lucide="play" class="ep-playing-icon"></i>' : ''}
            </div>
            <div class="ep-card-content">
              <div class="ep-card-title-row">
                <span class="ep-card-title">${drawerSeason}. Sezon ${epNum}. Bölüm</span>
                ${epWatched ? '<span class="ep-watched-chip"><i data-lucide="check" style="width:12px;height:12px"></i> İzlendi</span>' : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');

      mobileEpCardsHTML = arr.map(epNum => {
        const isCurrent = drawerSeason === currentSeason && epNum === currentEpisode;
        const epWatched = isMediaWatched(tmdbId, drawerSeason, epNum);
        return `
          <div class="mobile-ep-card ${isCurrent ? 'playing' : ''}" data-season="${drawerSeason}" data-episode="${epNum}">
            <div class="mobile-ep-thumb">
              <div class="ep-thumb-fallback"><i data-lucide="film" style="width:16px;height:16px"></i></div>
              <span class="mobile-ep-badge">B${epNum}</span>
              ${isCurrent ? '<div class="mobile-ep-playing-tag"><span class="pulse-bar"></span> Oynatılıyor</div>' : ''}
            </div>
            <div class="mobile-ep-info">
              <span class="mobile-ep-name">${epNum}. Bölüm</span>
              <div class="mobile-ep-meta">
                <span>${drawerSeason}. Sezon</span>
                ${epWatched ? '<span class="ep-watched-tag">✓ İzlendi</span>' : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      desktopEpCardsHTML = episodes.map(ep => {
        const epNum = ep.episode_number;
        const isCurrent = drawerSeason === currentSeason && epNum === currentEpisode;
        const epWatched = isMediaWatched(tmdbId, drawerSeason, epNum);
        const stillUrl = ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : '';
        const airDate = ep.air_date ? ep.air_date.substring(0, 4) : '';
        const durationText = ep.runtime ? `${ep.runtime} dk` : '';

        return `
          <div class="drawer-ep-card ${isCurrent ? 'playing' : ''}" data-season="${drawerSeason}" data-episode="${epNum}">
            <div class="ep-card-thumbnail ${!stillUrl ? 'no-thumb' : ''}">
              ${stillUrl ? `<img src="${stillUrl}" alt="Bölüm ${epNum}" loading="lazy" />` : `<div class="ep-thumb-fallback"><i data-lucide="film" style="width:20px;height:20px"></i></div>`}
              <span class="ep-thumb-num">B${epNum}</span>
              ${isCurrent ? '<div class="ep-thumb-playing-badge"><span class="pulse-bar"></span> OYNATILIYOR</div>' : ''}
            </div>
            <div class="ep-card-content">
              <div class="ep-card-title-row">
                <h4 class="ep-card-title">${epNum}. ${ep.name || 'Bölüm'}</h4>
                ${epWatched ? '<span class="ep-watched-chip" title="İzlendi"><i data-lucide="check" style="width:12px;height:12px"></i></span>' : ''}
              </div>
              <div class="ep-card-meta">
                ${durationText ? `<span>${durationText}</span>` : ''}
                ${airDate ? `<span>• ${airDate}</span>` : ''}
              </div>
              <p class="ep-card-overview">${(ep.overview && ep.overview.trim().length > 5) ? ep.overview : `${epNum}. Bölüm — Olayların giderek tırmandığı ve karakterlerin kaderini belirleyecek önemli gelişmelerin yaşandığı soluksuz bir bölüm.`}</p>
            </div>
          </div>
        `;
      }).join('');

      mobileEpCardsHTML = episodes.map(ep => {
        const epNum = ep.episode_number;
        const isCurrent = drawerSeason === currentSeason && epNum === currentEpisode;
        const epWatched = isMediaWatched(tmdbId, drawerSeason, epNum);
        const stillUrl = ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : '';
        const airDate = ep.air_date ? ep.air_date.substring(0, 4) : '';
        const durationText = ep.runtime ? `${ep.runtime} dk` : '';

        return `
          <div class="mobile-ep-card ${isCurrent ? 'playing' : ''}" data-season="${drawerSeason}" data-episode="${epNum}">
            <div class="mobile-ep-thumb">
              ${stillUrl ? `<img src="${stillUrl}" alt="B${epNum}" loading="lazy" />` : `<div class="ep-thumb-fallback"><i data-lucide="film" style="width:16px;height:16px"></i></div>`}
              <span class="mobile-ep-badge">B${epNum}</span>
              ${isCurrent ? '<div class="mobile-ep-playing-tag"><span class="pulse-bar"></span> Oynatılıyor</div>' : ''}
            </div>
            <div class="mobile-ep-info">
              <span class="mobile-ep-name">${ep.name || `${epNum}. Bölüm`}</span>
              <div class="mobile-ep-meta">
                <span>${durationText || airDate || `${drawerSeason}. Sezon`}</span>
                ${epWatched ? '<span class="ep-watched-tag">✓ İzlendi</span>' : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    if (listContainer) {
      listContainer.innerHTML = desktopEpCardsHTML;
      listContainer.querySelectorAll('.drawer-ep-card').forEach(card => {
        card.addEventListener('click', () => {
          const s = parseInt(card.getAttribute('data-season'), 10);
          const e = parseInt(card.getAttribute('data-episode'), 10);
          if (s === currentSeason && e === currentEpisode) return;
          toggleDrawer(false);
          switchEpisodeInPlayer(s, e);
        });
      });
    }

    if (mobileRailContainer) {
      mobileRailContainer.innerHTML = mobileEpCardsHTML;
      mobileRailContainer.querySelectorAll('.mobile-ep-card').forEach(card => {
        card.addEventListener('click', () => {
          const s = parseInt(card.getAttribute('data-season'), 10);
          const e = parseInt(card.getAttribute('data-episode'), 10);
          if (s === currentSeason && e === currentEpisode) return;
          switchEpisodeInPlayer(s, e);
        });
      });

      // Auto-scroll active card into view
      const activeMobileCard = mobileRailContainer.querySelector('.mobile-ep-card.playing');
      if (activeMobileCard) {
        setTimeout(() => {
          activeMobileCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 100);
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  // Trigger initial drawer & mobile episode rail rendering for TV
  if (type === 'tv') {
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
          type,
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
    if (type === 'tv') {
      markEpisodeWatched(tmdbId, currentSeason, currentEpisode, isWatched, {
        title: cleanSeriesName,
        posterPath,
        backdropPath,
        type,
        duration: estimatedDuration
      });
    } else {
      markMediaWatched(tmdbId, isWatched, {
        title: cleanSeriesName,
        posterPath,
        backdropPath,
        type,
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
    if (type === 'tv') renderDrawerContent();
    if (window.lucide) window.lucide.createIcons();
  };

  const handleHalfway = () => {
    saveWatchProgress({
      id: tmdbId,
      title: cleanSeriesName,
      posterPath,
      backdropPath,
      type,
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
      activeHlsInstance.destroy();
      activeHlsInstance = null;
    }

    let srv = activeServers[currentServerIndex];

    // On-the-fly Direct HLS resolution for VidMoly and Alpha Stream embeds
    if (srv && !srv.isDirectVideo && !srv.isHls) {
      const rawUrl = (srv.url || srv.streamUrl || '').toLowerCase();
      if (
        rawUrl.includes('vidmoly') ||
        rawUrl.includes('ag2m4') ||
        rawUrl.includes('agcdn') ||
        rawUrl.includes('liderfilm') ||
        (srv.id && srv.id.startsWith('dbl'))
      ) {
        try {
          const direct = await resolveDirectStream(srv);
          if (direct && (direct.isDirectVideo || direct.isHls)) {
            srv = direct;
            activeServers[currentServerIndex] = direct;
          }
        } catch (_) {}
      }
    }

    wrapper.innerHTML = renderPlayerContent();
    if (window.lucide) window.lucide.createIcons();

    const popoutBtn = document.getElementById('player-popout-btn');
    if (popoutBtn) {
      popoutBtn.href = srv?.streamUrl || srv?.getUrl() || '#';
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
      const videoEl = document.getElementById('hls-video-player');
      const streamUrl = srv.streamUrl || srv.getUrl();
      if (videoEl && streamUrl) {
        const isHlsStream = streamUrl.includes('.m3u8') || streamUrl.includes('.txt') || srv.isHls;

        const fallbackToIframe = () => {
          if (srv.originalEmbedUrl || (srv.url && !srv.url.includes('.m3u8'))) {
            srv.isDirectVideo = false;
            srv.isHls = false;
            srv.streamUrl = srv.originalEmbedUrl || srv.url;
            updatePlayerContainer();
          }
        };

        if (isHlsStream && window.Hls && Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            maxBufferLength: 30,
            maxMaxBufferLength: 60
          });
          activeHlsInstance = hls;
          hls.loadSource(streamUrl);
          hls.attachMedia(videoEl);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (initialTime > 0) videoEl.currentTime = initialTime;
            videoEl.play().catch(() => {});
          });
          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  fallbackToIframe();
                  break;
              }
            }
          });
        } else if (isHlsStream && videoEl.canPlayType('application/vnd.apple.mpegurl')) {
          // iOS Safari Native HLS Engine
          videoEl.src = streamUrl;
          videoEl.addEventListener('loadedmetadata', () => {
            if (initialTime > 0) videoEl.currentTime = initialTime;
            videoEl.play().catch(() => {});
          });
          videoEl.addEventListener('error', () => {
            fallbackToIframe();
          });
        } else {
          videoEl.src = streamUrl;
          if (initialTime > 0) videoEl.currentTime = initialTime;
          videoEl.play().catch(() => {});
          videoEl.addEventListener('error', () => {
            fallbackToIframe();
          });
        }
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

      // When 10s countdown finishes:
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

        if (isComplete) {
          if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
          }
          isSearching = false;

          // If in Dubbed mode and no dubbed stream, auto-switch to subtitled if available
          if (currentCategory === 'dubbed' && (!dubbed || dubbed.length === 0) && subtitled && subtitled.length > 0 && !hasPlayerStartedPlaying) {
            showToast('💬 Türkçe Dublaj bulunamadı. Türkçe Altyazılı sunuculara geçildi.', 'info');
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
            updateServerPillsEvents();
            updatePlayerContainer();
            return;
          }
        }

        // If in Dubbed mode and first Dubbed stream just arrived:
        if (currentCategory === 'dubbed' && dubbed.length > 0 && !hasPlayerStartedPlaying) {
          hasPlayerStartedPlaying = true;
          isSearching = false;
          activeServers = dubbed;
          currentServerIndex = 0;
          updateServerPillsEvents();
          updatePlayerContainer();
        } else {
          activeServers = categorizedServers[currentCategory] || [];
          updateServerPillsEvents();

          // If in subtitled mode and player not started yet:
          if (!hasPlayerStartedPlaying && activeServers.length > 0 && currentCategory === 'subtitled') {
            hasPlayerStartedPlaying = true;
            isSearching = false;
            currentServerIndex = 0;
            updatePlayerContainer();
          } else if (isComplete && activeServers.length === 0) {
            updatePlayerContainer();
          }
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
    if (type === 'tv') renderDrawerContent();

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
      updateServerPillsEvents();
      updatePlayerContainer();
      showToast('💬 Türkçe Altyazılı VidAPI & VIP sunucularına geçildi.', 'info');
    });
  }

  // Close Modal Cleanly
  const closeBtn = document.getElementById('player-close-btn');
  const closeModal = () => {
    clearInterval(activeProgressInterval);
    if (activeHlsInstance) {
      activeHlsInstance.destroy();
      activeHlsInstance = null;
    }
    const iframe = document.getElementById('video-iframe');
    if (iframe) iframe.src = 'about:blank';
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
      if (type === 'tv') {
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

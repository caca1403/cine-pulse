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

import { getStreamingServers } from '../services/providerAggregator.js';
import {
  saveWatchProgress,
  getMediaProgress,
  formatSecondsToTime,
  isMediaWatched,
  toggleEpisodeWatched,
  markEpisodeWatched
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

  // Intercept Pop-Up Gambling Ads in Parent Window
  if (!originalWindowOpen) originalWindowOpen = window.open;
  window.open = function (url, target, features) {
    if (
      url &&
      (url.includes('vidmoly') ||
        url.includes('setplay') ||
        url.includes('fastplay') ||
        url.includes('filemoon') ||
        url.includes('bysejikuar') ||
        url.includes('sibnet') ||
        url.includes('hqq') ||
        url.includes('ag2m4') ||
        url.includes('autoembed') ||
        url.includes('vidlink') ||
        url.includes('smashystream') ||
        url.includes('multiembed') ||
        url.includes('vidmixi') ||
        url.includes('filmmakinesi') ||
        url.includes('rapidrame') ||
        url.includes('playmix'))
    ) {
      return originalWindowOpen.call(window, url, target, features);
    }
    console.warn('CinePulse Anti-Ad Shield: Blocked gambling pop-up redirect ->', url);
    showToast('Bahis/Reklam yönlendirmesi engellendi.', 'info');
    return null;
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

  // Async fetch seasons metadata if TV show lacks them
  if (type === 'tv' && tmdbId && currentSeasonsList.length === 0) {
    fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}&language=tr-TR`)
      .then(res => res.json())
      .then(data => {
        if (data && data.seasons) {
          currentSeasonsList = data.seasons.filter(s => s.season_number > 0);
          updateNavButtons();
          if (isDrawerOpen) renderDrawerContent();
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
    if (!activeServers || activeServers.length === 0) {
      return `
        <div class="server-pill-loading">
          <span class="server-pulse-dot"></span>
          <span>Yayın hatları bağlanıyor...</span>
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
    if (!activeServers || activeServers.length === 0) {
      return `
        <div class="player-loading-overlay">
          <div class="player-loader-core">
            <div class="player-loader-spinner"></div>
            <i data-lucide="play" class="player-loader-icon"></i>
          </div>
          <div class="player-loader-text">
            <h3>${cleanSeriesName}</h3>
            <p class="player-loader-sub">${type === 'tv' ? `Sezon ${currentSeason} • Bölüm ${currentEpisode}` : '4K Ultra HD Film Yayını'} Başlatılıyor...</p>
            <p class="player-loader-hint">Yüksek hızlı Türkiye & Küresel CDN hatları taranıyor, video sinyali çözümleniyor.</p>
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
            "${seriesTitle || title}" içeriği seçili kategorideki aktif depolarda yer almamaktadır.
          </p>
          <button id="btn-switch-subtitled-fallback" class="btn-primary btn-switch-category-fallback">
            <i data-lucide="repeat" style="width: 16px; height: 16px;"></i>
            <span>${currentCategory === 'dubbed' ? '💬 Türkçe Altyazılı VidAPI & VIP Sunuculara Geç' : '🇹🇷 Türkçe Dublaj Sunucularına Geç'}</span>
          </button>
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
      return `
        <div class="direct-video-wrapper">
          <video 
            id="hls-video-player" 
            controls 
            autoplay 
            playsinline
            webkit-playsinline
            preload="auto">
          </video>
          ${floatingAudioTip}
        </div>
      `;
    }

    const finalIframeUrl = srv.getUrl() || srv.streamUrl || '';
    return `
      <iframe 
        id="video-iframe" 
        src="${finalIframeUrl}" 
        allowfullscreen 
        referrerpolicy="no-referrer-when-downgrade"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture; accelerometer; gyroscope; clipboard-write; payment">
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

        <!-- Mobile Always-Open Episodes & Season Selector (Below Player) -->
        ${type === 'tv' ? `
          <div class="mobile-episodes-section" id="mobile-episodes-section">
            <div class="mobile-episodes-header">
              <div class="mobile-episodes-title">
                <i data-lucide="layers" style="width: 15px; height: 15px; color: var(--primary);"></i>
                <span>Tüm Bölümler</span>
              </div>
              <div class="mobile-season-picker" id="mobile-season-picker">
                <!-- Injected dynamically -->
              </div>
            </div>
            
            <div class="mobile-episodes-scroll" id="mobile-episodes-scroll">
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
    const mobileListContainer = document.getElementById('mobile-episodes-scroll');

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
        <p>Sezon ${drawerSeason} bölümleri yükleniyor...</p>
      </div>
    `;

    if (listContainer) listContainer.innerHTML = loadingHTML;
    if (mobileListContainer) mobileListContainer.innerHTML = loadingHTML;

    const episodes = await fetchSeasonEpisodes(drawerSeason);

    let epCardsHTML = '';
    if (!episodes || episodes.length === 0) {
      // Fallback if TMDB is offline or episodes not found
      const count = getSeasonEpisodeCount(drawerSeason) || 12;
      epCardsHTML = Array.from({ length: count }, (_, i) => i + 1).map(epNum => {
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
    } else {
      epCardsHTML = episodes.map(ep => {
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
              <p class="ep-card-overview">${ep.overview || 'Bu bölüm için özet mevcut değil.'}</p>
            </div>
          </div>
        `;
      }).join('');
    }

    if (listContainer) listContainer.innerHTML = epCardsHTML;
    if (mobileListContainer) mobileListContainer.innerHTML = epCardsHTML;

    const bindCardClicks = (container) => {
      if (!container) return;
      container.querySelectorAll('.drawer-ep-card').forEach(card => {
        card.addEventListener('click', () => {
          const s = parseInt(card.getAttribute('data-season'), 10);
          const e = parseInt(card.getAttribute('data-episode'), 10);
          if (s === currentSeason && e === currentEpisode) return;
          toggleDrawer(false);
          switchEpisodeInPlayer(s, e);
        });
      });
    };

    bindCardClicks(listContainer);
    bindCardClicks(mobileListContainer);

    if (window.lucide) window.lucide.createIcons();
  }

  // --- IN-PLAYER QUICK EPISODES RAIL (TV ONLY) ---
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

  function updateServerPillsEvents() {
    const toolbar = document.getElementById('player-server-toolbar');
    if (!toolbar) return;
    toolbar.innerHTML = renderServerPills();

    toolbar.querySelectorAll('.server-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        if (idx === currentServerIndex) return;

        currentServerIndex = idx;
        toolbar.querySelectorAll('.server-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        updatePlayerContainer();
      });
    });
  }

  function updatePlayerContainer() {
    const wrapper = document.getElementById('player-iframe-wrapper');
    if (!wrapper) return;

    if (activeHlsInstance) {
      activeHlsInstance.destroy();
      activeHlsInstance = null;
    }

    wrapper.innerHTML = renderPlayerContent();
    if (window.lucide) window.lucide.createIcons();

    const srv = activeServers[currentServerIndex];
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

    if (
      srv?.isDirectVideo ||
      srv?.isHls ||
      (srv?.streamUrl && (srv.streamUrl.includes('.m3u8') || srv.streamUrl.includes('.mp4') || srv.streamUrl.includes('.mkv')))
    ) {
      const videoEl = document.getElementById('hls-video-player');
      const streamUrl = srv.streamUrl || srv.getUrl();
      if (videoEl && streamUrl) {
        if (window.Hls && Hls.isSupported() && (streamUrl.includes('.m3u8') || srv.isHls)) {
          const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
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
                  break;
              }
            }
          });
        } else {
          videoEl.src = streamUrl;
          if (initialTime > 0) videoEl.currentTime = initialTime;
          videoEl.play().catch(() => {});
        }
      }
    }
  }

  // Initial Fetch of Servers
  categorizedServers = await getStreamingServers({
    type,
    tmdbId,
    title: cleanSeriesName,
    seriesTitle: cleanSeriesName,
    originalTitle,
    season: currentSeason,
    episode: currentEpisode
  });

  if (
    (!categorizedServers.dubbed || categorizedServers.dubbed.length === 0 || categorizedServers.dubbed[0]?.notFound) &&
    categorizedServers.subtitled &&
    categorizedServers.subtitled.length > 0 &&
    !categorizedServers.subtitled[0]?.notFound
  ) {
    currentCategory = 'subtitled';
    const tabDub = document.getElementById('tab-dubbed');
    const tabSub = document.getElementById('tab-subtitled');
    if (tabDub && tabSub) {
      tabDub.classList.remove('active');
      tabSub.classList.add('active');
    }
  }

  activeServers = categorizedServers[currentCategory] || [];
  currentServerIndex = 0;

  updateServerPillsEvents();
  updatePlayerContainer();
  if (type === 'tv') renderQuickEpisodesRail();

  // Progress Saving Interval
  clearInterval(activeProgressInterval);
  activeProgressInterval = setInterval(() => {
    simulatedCurrentTime += 5;
    saveWatchProgress({
      id: tmdbId,
      title: cleanSeriesName,
      posterPath,
      backdropPath,
      type,
      season: currentSeason,
      episode: currentEpisode,
      currentTime: simulatedCurrentTime,
      duration: estimatedDuration
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
            <p class="player-loader-hint">Yeni bölüm akış hatları bağlanıyor...</p>
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    }

    categorizedServers = await getStreamingServers({
      type,
      tmdbId,
      title: cleanSeriesName,
      seriesTitle: cleanSeriesName,
      originalTitle,
      season: currentSeason,
      episode: currentEpisode
    });

    if (
      (!categorizedServers.dubbed || categorizedServers.dubbed.length === 0 || categorizedServers.dubbed[0]?.notFound) &&
      categorizedServers.subtitled &&
      categorizedServers.subtitled.length > 0 &&
      !categorizedServers.subtitled[0]?.notFound
    ) {
      currentCategory = 'subtitled';
      const tabDub = document.getElementById('tab-dubbed');
      const tabSub = document.getElementById('tab-subtitled');
      if (tabDub && tabSub) {
        tabDub.classList.remove('active');
        tabSub.classList.add('active');
      }
    }

    activeServers = categorizedServers[currentCategory] || [];
    currentServerIndex = 0;

    const newRecord = getMediaProgress(tmdbId, currentSeason, currentEpisode);
    initialTime = newRecord ? newRecord.currentTime : 0;
    isWatched = isMediaWatched(tmdbId, currentSeason, currentEpisode);

    updateServerPillsEvents();
    updatePlayerContainer();

    const toggleWatchedPlayerBtn = document.getElementById('btn-toggle-watched-player');
    if (toggleWatchedPlayerBtn) {
      const span = toggleWatchedPlayerBtn.querySelector('span');
      const icon = toggleWatchedPlayerBtn.querySelector('i');
      if (span) span.textContent = isWatched ? 'İzlendi' : 'İzlendi Yap';
      if (icon) icon.setAttribute('data-lucide', isWatched ? 'check-circle-2' : 'check');
      if (isWatched) {
        toggleWatchedPlayerBtn.classList.add('watched-active');
      } else {
        toggleWatchedPlayerBtn.classList.remove('watched-active');
      }
    }

    updateNavButtons();
    if (type === 'tv') renderQuickEpisodesRail();

    simulatedCurrentTime = initialTime;
    isSwitchingEpisode = false;
    if (window.lucide) window.lucide.createIcons();

    clearInterval(activeProgressInterval);
    activeProgressInterval = setInterval(() => {
      simulatedCurrentTime += 5;
      saveWatchProgress({
        id: tmdbId,
        title: cleanSeriesName,
        posterPath,
        backdropPath,
        type,
        season: currentSeason,
        episode: currentEpisode,
        currentTime: simulatedCurrentTime,
        duration: estimatedDuration
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

  // Watched Toggle Inside Player
  const toggleWatchedBtn = document.getElementById('btn-toggle-watched-player');
  if (toggleWatchedBtn) {
    toggleWatchedBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const updated = toggleEpisodeWatched(tmdbId, currentSeason, currentEpisode, {
        title: cleanSeriesName,
        posterPath,
        backdropPath,
        type,
        duration: estimatedDuration
      });

      if (span) span.textContent = isWatched ? 'İzlendi' : 'İzlendi Yap';
      if (icon) icon.setAttribute('data-lucide', isWatched ? 'check-circle-2' : 'check');
      if (isWatched) {
        toggleWatchedBtn.classList.add('watched-active');
        showToast(`✓ S${currentSeason} B${currentEpisode} izlendi olarak kaydedildi!`, 'success');
      } else {
        toggleWatchedBtn.classList.remove('watched-active');
        showToast(`S${currentSeason} B${currentEpisode} izleme listesine geri alındı.`, 'info');
      }
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Halfway Marker Inside Player
  const halfwayBtn = document.getElementById('btn-halfway-player');
  if (halfwayBtn) {
    halfwayBtn.addEventListener('click', (e) => {
      e.preventDefault();
      saveWatchProgress({
        id: tmdbId,
        title: cleanSeriesName,
        posterPath,
        backdropPath,
        type,
        season: currentSeason,
        episode: currentEpisode,
        currentTime: 1200,
        duration: estimatedDuration,
        completed: false
      });
      showToast(`⏳ S${currentSeason} B${currentEpisode} 20. dakikada yarıda bırakıldı!`, 'info');
    });
  }
}

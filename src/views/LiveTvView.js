/* ==========================================================================
   CinePulse Studio - Cinema IPTV Platform (Full-Width Player + Bottom Grid)
   Zero Sidebars — Player takes full top width, Channel catalog flows below.
   100% Native HLS.js Direct Playback — Zero Iframes, Zero Ads
   ========================================================================== */

import { LIVE_TV_CATEGORIES, LIVE_TV_CHANNELS, getChannelBadgeSvg } from '../services/liveTvChannels.js';
import { getRecTvChannelStreamUrl } from '../services/rectvService.js';
import { getChannelEpg } from '../services/epgService.js';
import { showToast } from '../components/Toast.js';

const FAVS_STORAGE_KEY = 'cinepulse_live_favs';

function getFavoriteIds() {
  try {
    const raw = localStorage.getItem(FAVS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveFavoriteIds(ids) {
  try {
    localStorage.setItem(FAVS_STORAGE_KEY, JSON.stringify(ids));
  } catch (_) {}
}

export function renderLiveTvView() {
  let activeCategory = 'all';
  let activeChannel = LIVE_TV_CHANNELS.find(c => c.id === 'ch_trt1') || LIVE_TV_CHANNELS[0];
  let searchQuery = '';
  let activeHls = null;
  let isMuted = false;
  let currentVolume = 1.0;
  let controlsTimeout = null;
  let osdTimeout = null;

  function isFav(id) {
    return getFavoriteIds().includes(id);
  }

  function toggleFav(id) {
    let favorites = getFavoriteIds();
    if (favorites.includes(id)) {
      favorites = favorites.filter(f => f !== id);
      showToast('Favorilerden çıkarıldı', 'info');
    } else {
      favorites.push(id);
      showToast('Favorilere eklendi ⭐', 'success');
    }
    saveFavoriteIds(favorites);
    renderAllViews();
  }

  function getFilteredChannels() {
    return LIVE_TV_CHANNELS.filter(ch => {
      let matchCat = true;
      if (activeCategory === 'favorites') {
        matchCat = isFav(ch.id);
      } else if (activeCategory !== 'all') {
        matchCat = ch.category === activeCategory;
      }
      const matchSearch = !searchQuery || ch.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  function getChannelIndex(ch) {
    return LIVE_TV_CHANNELS.findIndex(c => c.id === ch.id);
  }

  let renderAllViews = () => {};

  const html = `
    <div class="livetv-view-full" id="livetv-root">

      <!-- TOP: Full-Width Cinematic TV Player -->
      <section class="tv-hero-player-section" id="tv-hero-player-section">
        <!-- Layout shift placeholder for smooth Floating PiP -->
        <div class="tv-screen-placeholder" id="tv-screen-placeholder"></div>

        <div class="tv-screen" id="tv-screen" tabindex="0">
          <video id="tv-video" autoplay playsinline webkit-playsinline></video>

          <!-- Floating Mini-Player (PiP) Top Bar -->
          <div class="tv-pip-header" id="tv-pip-header">
            <div class="tv-pip-meta">
              <img class="tv-pip-logo" id="tv-pip-logo" src="${activeChannel.logo}" alt="" onerror="this.onerror=null; this.src='${getChannelBadgeSvg(activeChannel.name, activeChannel.category)}';" />
              <div class="tv-pip-info">
                <span class="tv-pip-name" id="tv-pip-name">${activeChannel.name}</span>
                <span class="tv-pip-epg" id="tv-pip-epg">CANLI YAYIN</span>
              </div>
            </div>
            <div class="tv-pip-actions">
              <button class="tv-pip-btn tv-pip-btn-expand" id="tv-pip-expand" title="Oynatıcıya Dön">
                <i data-lucide="maximize" style="width:13px;height:13px;"></i>
              </button>
              <button class="tv-pip-btn tv-pip-btn-close" id="tv-pip-close" title="Mini Oynatıcıyı Kapat">
                <i data-lucide="x" style="width:13px;height:13px;"></i>
              </button>
            </div>
          </div>

          <!-- Backdrop Click Handler for Toggle Controls -->
          <div class="tv-screen-backdrop" id="tv-screen-backdrop"></div>

          <!-- Minimal Elegant Top Channel Badge (Logo + Name + Number + Live EPG) -->
          <div class="tv-osd-topbar" id="tv-osd-topbar">
            <div class="tv-osd-channel-meta">
              <div class="tv-osd-logo-box">
                <img id="tv-top-logo" class="tv-top-logo" src="${activeChannel.logo}" alt="" onerror="this.onerror=null; this.src='${getChannelBadgeSvg(activeChannel.name, activeChannel.category)}';" />
              </div>
              <div class="tv-osd-text">
                <div class="tv-osd-ch-title">
                  <span id="tv-top-name">${activeChannel.name}</span>
                  <span class="tv-osd-num-tag" id="tv-top-num">CH 01</span>
                </div>
                <div class="tv-top-epg-line" id="tv-top-epg-line">
                  <span class="tv-top-epg-badge">YAYINDA</span>
                  <span class="tv-top-epg-title" id="tv-top-epg-title">Yayın Akışı Yükleniyor...</span>
                  <span class="tv-top-epg-prog" id="tv-top-epg-prog">%0</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Big Center OSD Banner on Channel Switch -->
          <div class="tv-osd-banner hidden" id="tv-osd">
            <img id="tv-osd-logo" class="tv-osd-logo" src="" alt="" />
            <div class="tv-osd-info">
              <div class="tv-osd-name" id="tv-osd-name"></div>
              <div class="tv-osd-meta">
                <span class="tv-osd-live-dot"></span>
                <span>CANLI YAYIN</span>
                <span class="tv-osd-quality" id="tv-osd-quality"></span>
              </div>
              <div class="tv-osd-epg-sub" id="tv-osd-epg-sub"></div>
            </div>
            <div class="tv-osd-chnum" id="tv-osd-chnum"></div>
          </div>

          <!-- Loading Spinner -->
          <div class="tv-loading hidden" id="tv-loading">
            <div class="tv-loading-spinner"></div>
            <span class="tv-loading-text">Yayın bağlanıyor...</span>
          </div>

          <!-- Error State with Auto-Reconnect -->
          <div class="tv-error hidden" id="tv-error">
            <div class="tv-error-icon-box">
              <i data-lucide="radio" style="width:36px;height:36px;color:#ef4444;"></i>
            </div>
            <span class="tv-error-msg">Yayın akışı geçici olarak yanıt vermedi</span>
            <div class="tv-error-actions">
              <button class="tv-retry-btn" id="tv-retry-btn">
                <i data-lucide="refresh-cw" style="width:14px;height:14px;"></i> Tekrar Bağlan
              </button>
              <button class="tv-next-btn" id="tv-error-next-btn">Sonraki Kanala Geç</button>
            </div>
          </div>

          <!-- Spacious Sleek Bottom Control Bar -->
          <div class="tv-screen-controls" id="tv-screen-controls">
            <!-- Left: Channel Navigation & Play/Pause & Live Badge -->
            <div class="tv-ctrl-group tv-ctrl-left">
              <button class="tv-ctrl-action-btn" id="tv-btn-prev-ch" title="Önceki Kanal (P-)">
                <i data-lucide="skip-back" style="width:18px;height:18px;"></i>
              </button>
              <button class="tv-ctrl-action-btn tv-play-btn" id="tv-btn-play-pause" title="Oynat / Duraklat (Space)">
                <i data-lucide="pause" style="width:20px;height:20px;"></i>
              </button>
              <button class="tv-ctrl-action-btn" id="tv-btn-next-ch" title="Sonraki Kanal (P+)">
                <i data-lucide="skip-forward" style="width:18px;height:18px;"></i>
              </button>
              <div class="tv-live-sync-indicator" id="tv-btn-sync" title="Canlı Yayına Eşitle">
                <span class="tv-live-sync-dot"></span>
                <span>CANLI</span>
              </div>
            </div>

            <!-- Center: Volume Slider & Mute -->
            <div class="tv-volume-group">
              <button class="tv-ctrl-action-btn" id="tv-btn-mute" title="Sesi Aç/Kapat (M)">
                <i data-lucide="volume-2" style="width:18px;height:18px;"></i>
              </button>
              <div class="tv-volume-slider-box">
                <input type="range" id="tv-volume-slider" class="tv-volume-slider" min="0" max="1" step="0.05" value="1" />
              </div>
            </div>

            <!-- Right: Numpad & Quality & Reload & Fullscreen -->
            <div class="tv-ctrl-group tv-ctrl-right">
              <!-- Numpad Zapper Keypad Button -->
              <button class="tv-ctrl-action-btn tv-numpad-btn" id="tv-btn-numpad" title="Kanal Numarası Tuş Takımı">
                <i data-lucide="hash" style="width:18px;height:18px;"></i>
              </button>

              <!-- HLS Quality / Bitrate Selector Dropdown -->
              <div class="tv-quality-wrapper" id="tv-quality-wrapper">
                <button class="tv-ctrl-action-btn tv-quality-btn" id="tv-btn-quality" title="Yayın Kalitesi / Bitrate">
                  <i data-lucide="settings" style="width:17px;height:17px;"></i>
                  <span class="tv-quality-badge-text" id="tv-quality-badge">AUTO</span>
                </button>
                <div class="tv-quality-menu hidden" id="tv-quality-menu">
                  <div class="tv-quality-menu-header">
                    <i data-lucide="sliders" style="width:13px;height:13px;color:#fbbf24;"></i>
                    <span>Yayın Çözünürlüğü</span>
                  </div>
                  <div class="tv-quality-options" id="tv-quality-options">
                    <button class="tv-quality-opt active" data-level="-1">
                      <i data-lucide="check" style="width:12px;height:12px;"></i>
                      <span>Otomatik (Adaptive)</span>
                    </button>
                  </div>
                </div>
              </div>

              <button class="tv-ctrl-action-btn" id="tv-btn-reload" title="Akışı Yenile (R)">
                <i data-lucide="rotate-cw" style="width:18px;height:18px;"></i>
              </button>
              <button class="tv-ctrl-action-btn" id="tv-btn-fullscreen" title="Tam Ekran (F)">
                <i data-lucide="maximize-2" style="width:18px;height:18px;"></i>
              </button>
            </div>
          </div>

        </div>
      </section>

      <!-- Glowing Numpad HUD Banner (Keyboard 0-9 input feedback) -->
      <div class="tv-numpad-hud hidden" id="tv-numpad-hud">
        <div class="tv-numpad-hud-digits" id="tv-numpad-hud-digits">01</div>
        <div class="tv-numpad-hud-name" id="tv-numpad-hud-name">Kanal Bekleniyor...</div>
      </div>

      <!-- Floating Translucent Numpad Modal (Interactive Touch / Mouse Keypad) -->
      <div class="tv-numpad-modal hidden" id="tv-numpad-modal">
        <div class="tv-numpad-modal-backdrop" id="tv-numpad-modal-backdrop"></div>
        <div class="tv-numpad-pad">
          <div class="tv-numpad-pad-header">
            <div class="tv-numpad-display">
              <span class="tv-numpad-display-tag">KANALA ZIPLA</span>
              <span class="tv-numpad-display-val" id="tv-pad-display-val">--</span>
              <span class="tv-numpad-display-sub" id="tv-pad-display-sub">Numara tuşlayın</span>
            </div>
            <button class="tv-numpad-pad-close" id="tv-numpad-close" title="Kapat">
              <i data-lucide="x" style="width:16px;height:16px;"></i>
            </button>
          </div>
          <div class="tv-numpad-keys">
            <button class="tv-num-key" data-digit="1">1</button>
            <button class="tv-num-key" data-digit="2">2</button>
            <button class="tv-num-key" data-digit="3">3</button>
            <button class="tv-num-key" data-digit="4">4</button>
            <button class="tv-num-key" data-digit="5">5</button>
            <button class="tv-num-key" data-digit="6">6</button>
            <button class="tv-num-key" data-digit="7">7</button>
            <button class="tv-num-key" data-digit="8">8</button>
            <button class="tv-num-key" data-digit="9">9</button>
            <button class="tv-num-key tv-num-key-clear" data-digit="clear">C</button>
            <button class="tv-num-key" data-digit="0">0</button>
            <button class="tv-num-key tv-num-key-ok" data-digit="ok">ZAP ⚡</button>
          </div>
        </div>
      </div>

      <!-- BOTTOM: Channel Switcher & Full Catalog (Mobile & Desktop) -->
      <section class="tv-bottom-catalog-section">

        <!-- Controls & Filter Toolbar -->
        <div class="tv-catalog-toolbar">

          <!-- Category Navigation Pills with Arrows -->
          <div class="tv-cat-nav-container">
            <button class="tv-cat-arrow-btn tv-cat-prev" id="tv-cat-prev" type="button" title="Geri kaydır">
              <i data-lucide="chevron-left" style="width:16px;height:16px;"></i>
            </button>
            <div class="tv-catalog-categories" id="tv-category-strip">
              ${LIVE_TV_CATEGORIES.map(cat => `
                <button class="tv-cat-filter-btn ${cat.id === activeCategory ? 'active' : ''}" data-cat="${cat.id}">
                  <i data-lucide="${cat.icon}" style="width:14px;height:14px;"></i>
                  <span>${cat.name}</span>
                </button>
              `).join('')}
            </div>
            <button class="tv-cat-arrow-btn tv-cat-next" id="tv-cat-next" type="button" title="İleri kaydır">
              <i data-lucide="chevron-right" style="width:16px;height:16px;"></i>
            </button>
          </div>

          <!-- Search & Counter Area -->
          <div class="tv-catalog-search-area">
            <div class="tv-catalog-search-box">
              <i data-lucide="search" class="tv-search-icon"></i>
              <input type="text" id="tv-search" class="tv-search-field" placeholder="Kanal adı ara..." />
              <button class="tv-search-clear-btn hidden" id="tv-search-clear" title="Temizle">
                <i data-lucide="x" style="width:14px;height:14px;"></i>
              </button>
            </div>
            <span class="tv-catalog-count-badge" id="tv-guide-count">73 KANAL</span>
          </div>

        </div>

        <!-- Main Channel Grid (Flows Below Video) -->
        <div class="tv-channel-grid" id="tv-channel-grid">
          <!-- Rendered dynamically -->
        </div>

      </section>

    </div>
  `;

  return {
    html,
    init: (container) => {
      if (!container) return;

      const videoEl = container.querySelector('#tv-video');
      const screenEl = container.querySelector('#tv-screen');
      const heroSection = container.querySelector('#tv-hero-player-section');
      const placeholderEl = container.querySelector('#tv-screen-placeholder');
      const backdropEl = container.querySelector('#tv-screen-backdrop');
      const topBarEl = container.querySelector('#tv-osd-topbar');
      const topLogo = container.querySelector('#tv-top-logo');
      const topName = container.querySelector('#tv-top-name');
      const topNum = container.querySelector('#tv-top-num');
      const topEpgTitle = container.querySelector('#tv-top-epg-title');
      const topEpgProg = container.querySelector('#tv-top-epg-prog');

      // PiP Header Elements
      const pipHeader = container.querySelector('#tv-pip-header');
      const pipLogo = container.querySelector('#tv-pip-logo');
      const pipName = container.querySelector('#tv-pip-name');
      const pipEpg = container.querySelector('#tv-pip-epg');
      const pipExpandBtn = container.querySelector('#tv-pip-expand');
      const pipCloseBtn = container.querySelector('#tv-pip-close');

      const osdEl = container.querySelector('#tv-osd');
      const osdLogo = container.querySelector('#tv-osd-logo');
      const osdName = container.querySelector('#tv-osd-name');
      const osdQuality = container.querySelector('#tv-osd-quality');
      const osdChnum = container.querySelector('#tv-osd-chnum');
      const osdEpgSub = container.querySelector('#tv-osd-epg-sub');

      const loadingEl = container.querySelector('#tv-loading');
      const errorEl = container.querySelector('#tv-error');
      const retryBtn = container.querySelector('#tv-retry-btn');
      const errorNextBtn = container.querySelector('#tv-error-next-btn');

      const playPauseBtn = container.querySelector('#tv-btn-play-pause');
      const prevChBtn = container.querySelector('#tv-btn-prev-ch');
      const nextChBtn = container.querySelector('#tv-btn-next-ch');
      const syncBtn = container.querySelector('#tv-btn-sync');
      const muteBtn = container.querySelector('#tv-btn-mute');
      const volumeSlider = container.querySelector('#tv-volume-slider');
      const reloadBtn = container.querySelector('#tv-btn-reload');
      const fsBtn = container.querySelector('#tv-btn-fullscreen');

      // Quality & Numpad Triggers
      const qualityBtn = container.querySelector('#tv-btn-quality');
      const qualityBadge = container.querySelector('#tv-quality-badge');
      const qualityMenu = container.querySelector('#tv-quality-menu');
      const qualityOptions = container.querySelector('#tv-quality-options');

      const numpadBtn = container.querySelector('#tv-btn-numpad');
      const numpadModal = container.querySelector('#tv-numpad-modal');
      const numpadBackdrop = container.querySelector('#tv-numpad-modal-backdrop');
      const numpadClose = container.querySelector('#tv-numpad-close');
      const padDisplayVal = container.querySelector('#tv-pad-display-val');
      const padDisplaySub = container.querySelector('#tv-pad-display-sub');
      const numpadHud = container.querySelector('#tv-numpad-hud');
      const numpadHudDigits = container.querySelector('#tv-numpad-hud-digits');
      const numpadHudName = container.querySelector('#tv-numpad-hud-name');

      const channelGrid = container.querySelector('#tv-channel-grid');
      const searchInput = container.querySelector('#tv-search');
      const searchClearBtn = container.querySelector('#tv-search-clear');
      const catStrip = container.querySelector('#tv-category-strip');
      const catPrevBtn = container.querySelector('#tv-cat-prev');
      const catNextBtn = container.querySelector('#tv-cat-next');
      const countLabel = container.querySelector('#tv-guide-count');

      // ─── Update UI & Top Bar & EPG ───
      function updateTopBar() {
        const globalIdx = getChannelIndex(activeChannel) + 1;
        const epg = getChannelEpg(activeChannel);

        if (topName) topName.textContent = activeChannel.name;
        if (topNum) topNum.textContent = `CH ${String(globalIdx).padStart(2, '0')}`;
        if (topEpgTitle) topEpgTitle.textContent = `${epg.title} (${epg.timeRange})`;
        if (topEpgProg) topEpgProg.textContent = `%${epg.progress}`;

        if (topLogo) {
          topLogo.src = activeChannel.logo;
          topLogo.onerror = () => {
            topLogo.onerror = null;
            topLogo.src = getChannelBadgeSvg(activeChannel.name, activeChannel.category);
          };
        }

        // PiP info
        if (pipName) pipName.textContent = activeChannel.name;
        if (pipEpg) pipEpg.textContent = `${epg.title} (%${epg.progress})`;
        if (pipLogo) {
          pipLogo.src = activeChannel.logo;
          pipLogo.onerror = () => {
            pipLogo.onerror = null;
            pipLogo.src = getChannelBadgeSvg(activeChannel.name, activeChannel.category);
          };
        }
      }

      // ─── OSD Center Popup Banner with EPG ───
      function showOSD() {
        if (osdTimeout) clearTimeout(osdTimeout);
        const idx = getChannelIndex(activeChannel);
        const epg = getChannelEpg(activeChannel);

        if (osdLogo) {
          osdLogo.src = activeChannel.logo;
          osdLogo.onerror = () => {
            osdLogo.onerror = null;
            osdLogo.src = getChannelBadgeSvg(activeChannel.name, activeChannel.category);
          };
        }
        if (osdName) osdName.textContent = activeChannel.name;
        if (osdQuality) osdQuality.textContent = activeChannel.quality;
        if (osdChnum) osdChnum.textContent = String(idx + 1).padStart(2, '0');
        if (osdEpgSub) osdEpgSub.textContent = `📺 ${epg.title} • %${epg.progress} tamamlandı`;

        osdEl.classList.remove('hidden');
        osdEl.classList.add('tv-osd-show');

        osdTimeout = setTimeout(() => {
          osdEl.classList.remove('tv-osd-show');
          osdEl.classList.add('tv-osd-hide');
          setTimeout(() => {
            osdEl.classList.add('hidden');
            osdEl.classList.remove('tv-osd-hide');
          }, 350);
        }, 2500);
      }

      // ─── Auto-Hiding Controls On Screen ───
      function keepControlsActive() {
        screenEl.classList.add('user-active');
        if (controlsTimeout) clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
          screenEl.classList.remove('user-active');
          if (qualityMenu) qualityMenu.classList.add('hidden');
        }, 3500);
      }

      screenEl.addEventListener('mousemove', keepControlsActive);
      screenEl.addEventListener('touchstart', keepControlsActive, { passive: true });

      // Tap on video toggles controls
      if (backdropEl) {
        backdropEl.addEventListener('click', (e) => {
          e.stopPropagation();
          if (screenEl.classList.contains('user-active')) {
            screenEl.classList.remove('user-active');
            if (controlsTimeout) clearTimeout(controlsTimeout);
            if (qualityMenu) qualityMenu.classList.add('hidden');
          } else {
            keepControlsActive();
          }
        });

        backdropEl.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          if (fsBtn) fsBtn.click();
        });
      }

      // ─── Volume Controls ───
      function updateVolume(val) {
        val = Math.max(0, Math.min(1, val));
        currentVolume = val;
        videoEl.volume = val;
        if (volumeSlider) volumeSlider.value = val;

        if (val === 0) {
          isMuted = true;
          videoEl.muted = true;
          if (muteBtn) muteBtn.innerHTML = '<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>';
        } else {
          isMuted = false;
          videoEl.muted = false;
          if (muteBtn) muteBtn.innerHTML = '<i data-lucide="volume-2" style="width:18px;height:18px;"></i>';
        }
        if (window.lucide) window.lucide.createIcons();
      }

      if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
          updateVolume(parseFloat(e.target.value));
        });
      }

      if (muteBtn) {
        muteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (isMuted) {
            updateVolume(currentVolume || 0.8);
            showToast('Ses açıldı', 'info');
          } else {
            videoEl.muted = true;
            isMuted = true;
            muteBtn.innerHTML = '<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>';
            if (window.lucide) window.lucide.createIcons();
            showToast('Sessize alındı', 'info');
          }
        });
      }

      // ─── Play / Pause Toggle ───
      if (playPauseBtn) {
        playPauseBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (videoEl.paused) {
            videoEl.play();
            playPauseBtn.innerHTML = '<i data-lucide="pause" style="width:18px;height:18px;"></i>';
          } else {
            videoEl.pause();
            playPauseBtn.innerHTML = '<i data-lucide="play" style="width:18px;height:18px;"></i>';
          }
          if (window.lucide) window.lucide.createIcons();
        });
      }

      // ─── Live Sync ───
      if (syncBtn) {
        syncBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (activeHls && videoEl.seekable && videoEl.seekable.length > 0) {
            videoEl.currentTime = videoEl.seekable.end(videoEl.seekable.length - 1);
            videoEl.play();
            showToast('Canlı yayına eşitlendi', 'info');
          } else {
            loadChannel(activeChannel);
          }
        });
      }

      // ─── HLS Quality Selector Engine ───
      function setupQualityMenu(hls) {
        if (!qualityOptions || !qualityBadge) return;

        if (!hls || !hls.levels || hls.levels.length <= 1) {
          qualityBadge.textContent = activeChannel.quality ? activeChannel.quality.split(' ')[0] : 'HD';
          qualityOptions.innerHTML = `
            <button class="tv-quality-opt active" data-level="-1">
              <i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>
              <span>Kaynak Kalite (${activeChannel.quality || '1080p'})</span>
            </button>
          `;
          if (window.lucide) window.lucide.createIcons();
          return;
        }

        const levels = hls.levels;
        const currentLvl = hls.currentLevel;

        let html = `
          <button class="tv-quality-opt ${currentLvl === -1 ? 'active' : ''}" data-level="-1">
            ${currentLvl === -1 ? '<i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>' : '<span style="width:13px;display:inline-block;"></span>'}
            <span>Otomatik (Adaptive)</span>
          </button>
        `;

        levels.forEach((lvl, idx) => {
          const height = lvl.height || (lvl.attrs && lvl.attrs.RESOLUTION ? lvl.attrs.RESOLUTION.height : 720);
          const label = height >= 1080 ? '1080p FHD' : (height >= 720 ? '720p HD' : (height >= 480 ? '480p SD' : `${height}p`));
          const isLvlActive = currentLvl === idx;
          html += `
            <button class="tv-quality-opt ${isLvlActive ? 'active' : ''}" data-level="${idx}">
              ${isLvlActive ? '<i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>' : '<span style="width:13px;display:inline-block;"></span>'}
              <span>${label}</span>
            </button>
          `;
        });

        qualityOptions.innerHTML = html;
        if (currentLvl === -1) {
          qualityBadge.textContent = 'AUTO';
        } else if (levels[currentLvl]) {
          const h = levels[currentLvl].height;
          qualityBadge.textContent = h ? `${h}p` : 'HD';
        }

        qualityOptions.querySelectorAll('.tv-quality-opt').forEach(opt => {
          opt.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetLvl = parseInt(opt.dataset.level, 10);
            if (activeHls) {
              activeHls.currentLevel = targetLvl;
              setupQualityMenu(activeHls);
              if (qualityMenu) qualityMenu.classList.add('hidden');
              const chosenText = opt.querySelector('span').textContent;
              showToast(`Kalite ayarlandı: ${chosenText}`, 'success');
            }
          });
        });

        if (window.lucide) window.lucide.createIcons();
      }

      if (qualityBtn && qualityMenu) {
        qualityBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          qualityMenu.classList.toggle('hidden');
          keepControlsActive();
        });

        document.addEventListener('click', (e) => {
          if (!e.target.closest('#tv-quality-wrapper')) {
            qualityMenu.classList.add('hidden');
          }
        });
      }

      // ─── Sayfa İçi Kayan Mini-Player (Floating Picture-in-Picture on Scroll) ───
      let isPipDismissed = false;

      function handlePipScroll() {
        if (!heroSection || !placeholderEl || !screenEl || document.fullscreenElement) return;

        const rect = heroSection.getBoundingClientRect();
        // If user scrolled down so that top hero player is out of view
        const isOutOfView = rect.bottom < 80;

        if (isOutOfView && videoEl && !videoEl.paused && !isPipDismissed) {
          if (!screenEl.classList.contains('is-floating-pip')) {
            screenEl.classList.add('is-floating-pip');
            placeholderEl.classList.add('is-active');
            updateTopBar();
          }
        } else if (!isOutOfView) {
          if (screenEl.classList.contains('is-floating-pip')) {
            screenEl.classList.remove('is-floating-pip');
            placeholderEl.classList.remove('is-active');
            isPipDismissed = false;
          }
        }
      }

      window.addEventListener('scroll', handlePipScroll, { passive: true });

      if (pipExpandBtn) {
        pipExpandBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (heroSection) {
            heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }

      if (pipCloseBtn) {
        pipCloseBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          isPipDismissed = true;
          screenEl.classList.remove('is-floating-pip');
          placeholderEl.classList.remove('is-active');
        });
      }

      // ─── Kanal Numarası ile Tuş Takımı / Numpad Zapper ───
      let numpadBuffer = '';
      let numpadTimer = null;

      function triggerNumpadZap(channelIdx) {
        if (channelIdx >= 0 && channelIdx < LIVE_TV_CHANNELS.length) {
          const target = LIVE_TV_CHANNELS[channelIdx];
          showToast(`Kanal ${channelIdx + 1}: ${target.name}`, 'info');
          loadChannel(target);
          if (heroSection) heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          showToast(`Kanal ${channelIdx + 1} bulunamadı`, 'warning');
        }
        numpadBuffer = '';
        if (numpadHud) numpadHud.classList.add('hidden');
        if (numpadModal) numpadModal.classList.add('hidden');
      }

      function updateNumpadHud() {
        if (!numpadHud || !numpadHudDigits || !numpadHudName) return;
        const targetNum = parseInt(numpadBuffer, 10);
        const previewCh = LIVE_TV_CHANNELS[targetNum - 1];

        numpadHudDigits.textContent = numpadBuffer.padStart(2, '0');
        numpadHudName.textContent = previewCh ? previewCh.name : 'Geçersiz Kanal';
        numpadHud.classList.remove('hidden');

        if (padDisplayVal) padDisplayVal.textContent = numpadBuffer.padStart(2, '0');
        if (padDisplaySub) padDisplaySub.textContent = previewCh ? previewCh.name : 'Geçersiz Kanal';

        if (numpadTimer) clearTimeout(numpadTimer);
        numpadTimer = setTimeout(() => {
          if (numpadBuffer) {
            triggerNumpadZap(targetNum - 1);
          }
        }, 1300);
      }

      // Open / Close Numpad Modal
      if (numpadBtn && numpadModal) {
        numpadBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          numpadBuffer = '';
          if (padDisplayVal) padDisplayVal.textContent = '--';
          if (padDisplaySub) padDisplaySub.textContent = 'Numara tuşlayın';
          numpadModal.classList.toggle('hidden');
        });
      }

      if (numpadClose) {
        numpadClose.addEventListener('click', () => {
          numpadModal.classList.add('hidden');
          numpadBuffer = '';
        });
      }

      if (numpadBackdrop) {
        numpadBackdrop.addEventListener('click', () => {
          numpadModal.classList.add('hidden');
          numpadBuffer = '';
        });
      }

      if (numpadModal) {
        numpadModal.querySelectorAll('.tv-num-key').forEach(key => {
          key.addEventListener('click', (e) => {
            e.stopPropagation();
            const digit = key.dataset.digit;
            if (digit === 'clear') {
              numpadBuffer = '';
              if (padDisplayVal) padDisplayVal.textContent = '--';
              if (padDisplaySub) padDisplaySub.textContent = 'Numara tuşlayın';
            } else if (digit === 'ok') {
              if (numpadBuffer) {
                const targetNum = parseInt(numpadBuffer, 10);
                triggerNumpadZap(targetNum - 1);
              }
            } else {
              if (numpadBuffer.length >= 2) numpadBuffer = '';
              numpadBuffer += digit;
              updateNumpadHud();
            }
          });
        });
      }

      // ─── HLS Stream Engine with Sequential Cancellation Token ───
      let channelPlaybackToken = 0;

      async function loadChannel(channel) {
        const myToken = ++channelPlaybackToken;
        activeChannel = channel;
        isPipDismissed = false;

        // 1. Immediately HARD STOP and detach previous playback to prevent audio echo
        if (activeHls) {
          try {
            activeHls.stopLoad();
            activeHls.detachMedia();
            activeHls.destroy();
          } catch (_) {}
          activeHls = null;
        }

        if (videoEl) {
          try {
            videoEl.pause();
            videoEl.removeAttribute('src');
            videoEl.load();
          } catch (_) {}
        }

        loadingEl.classList.remove('hidden');
        errorEl.classList.add('hidden');

        // Check if channel is RecTV VIP and refresh authenticated token stream
        if (channel.isTvr && channel.tvrId) {
          try {
            const freshUrl = await getRecTvChannelStreamUrl(channel.tvrId);
            if (channelPlaybackToken !== myToken) return;
            if (freshUrl) {
              channel.streamUrl = freshUrl;
            }
          } catch (_) {}
        }

        if (channelPlaybackToken !== myToken) return;

        updateTopBar();
        showOSD();
        renderAllViews();

        function startHls(url) {
          if (channelPlaybackToken !== myToken) return;

          if (window.Hls && window.Hls.isSupported()) {
            if (activeHls) {
              try {
                activeHls.stopLoad();
                activeHls.detachMedia();
                activeHls.destroy();
              } catch (_) {}
              activeHls = null;
            }

            const hls = new window.Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 30,
              maxBufferLength: 15,
              maxMaxBufferLength: 30,
              liveSyncDurationCount: 3
            });
            activeHls = hls;

            hls.loadSource(url);
            hls.attachMedia(videoEl);

            hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
              if (channelPlaybackToken !== myToken) {
                try {
                  hls.stopLoad();
                  hls.detachMedia();
                  hls.destroy();
                } catch (_) {}
                return;
              }
              loadingEl.classList.add('hidden');
              errorEl.classList.add('hidden');
              setupQualityMenu(hls);
              videoEl.play().catch(() => {});
            });

            hls.on(window.Hls.Events.ERROR, (_, data) => {
              if (channelPlaybackToken !== myToken) return;
              if (data.fatal) {
                console.warn('[LiveTV] Fatal HLS error on:', url, data.type, data.details);
                loadingEl.classList.add('hidden');
                errorEl.classList.remove('hidden');
                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                  setTimeout(() => {
                    if (channelPlaybackToken === myToken && activeHls) {
                      hls.startLoad();
                    }
                  }, 3500);
                }
              }
            });
          } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari iOS/macOS
            videoEl.src = url;
            videoEl.addEventListener('loadedmetadata', () => {
              if (channelPlaybackToken !== myToken) return;
              loadingEl.classList.add('hidden');
              errorEl.classList.add('hidden');
              setupQualityMenu(null);
              videoEl.play().catch(() => {});
            }, { once: true });
            videoEl.addEventListener('error', () => {
              if (channelPlaybackToken !== myToken) return;
              loadingEl.classList.add('hidden');
              errorEl.classList.remove('hidden');
            }, { once: true });
          }
        }

        startHls(channel.streamUrl);
        videoEl.muted = isMuted;
        videoEl.volume = currentVolume;
      }

      // ─── Channel Zapping Engine ───
      function zapChannel(direction) {
        const list = getFilteredChannels();
        if (list.length === 0) return;
        const currentIdx = list.findIndex(c => c.id === activeChannel.id);
        let nextIdx;
        if (direction === 'prev' || direction === 'up') {
          nextIdx = currentIdx <= 0 ? list.length - 1 : currentIdx - 1;
        } else {
          nextIdx = currentIdx >= list.length - 1 ? 0 : currentIdx + 1;
        }
        loadChannel(list[nextIdx]);
      }

      if (prevChBtn) prevChBtn.addEventListener('click', (e) => { e.stopPropagation(); zapChannel('prev'); });
      if (nextChBtn) nextChBtn.addEventListener('click', (e) => { e.stopPropagation(); zapChannel('next'); });
      if (errorNextBtn) errorNextBtn.addEventListener('click', () => zapChannel('next'));
      if (retryBtn) retryBtn.addEventListener('click', () => loadChannel(activeChannel));
      if (reloadBtn) reloadBtn.addEventListener('click', () => {
        showToast('Yayın yeniden yükleniyor...', 'info');
        loadChannel(activeChannel);
      });

      // ─── Main Bottom Channel Grid with Live EPG Bar ───
      function renderBottomChannelGrid() {
        const filtered = getFilteredChannels();
        if (countLabel) countLabel.textContent = `${filtered.length} KANAL`;

        if (filtered.length === 0) {
          channelGrid.innerHTML = `
            <div class="tv-catalog-empty-state">
              <i data-lucide="radio" style="width:40px;height:40px;color:var(--text-muted);"></i>
              <span class="tv-empty-title">Kanal Bulunamadı</span>
              <p class="tv-empty-sub">Arama teriminizi veya kategori filtrenizi değiştirin.</p>
            </div>
          `;
          if (window.lucide) window.lucide.createIcons();
          return;
        }

        channelGrid.innerHTML = filtered.map(ch => {
          const isActive = ch.id === activeChannel.id;
          const isFavorited = isFav(ch.id);
          const globalIdx = getChannelIndex(ch) + 1;
          const fallbackBadge = getChannelBadgeSvg(ch.name, ch.category);
          const epg = getChannelEpg(ch);

          return `
            <div class="tv-grid-card ${isActive ? 'active' : ''}" data-id="${ch.id}">
              <div class="tv-grid-card-top">
                <span class="tv-grid-num">${String(globalIdx).padStart(2, '0')}</span>
                <button class="tv-grid-fav-btn ${isFavorited ? 'is-fav' : ''}" data-favid="${ch.id}" title="${isFavorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}">
                  <i data-lucide="star" style="width:15px;height:15px;${isFavorited ? 'fill:#fbbf24;color:#fbbf24;' : ''}"></i>
                </button>
              </div>

              <div class="tv-grid-logo-box">
                <img class="tv-grid-logo" src="${ch.logo}" alt="${ch.name}" onerror="this.onerror=null; this.src='${fallbackBadge}';" loading="lazy" />
              </div>

              <div class="tv-grid-info">
                <span class="tv-grid-name" title="${ch.name}">${ch.name}</span>
                <div class="tv-grid-meta">
                  <span class="tv-grid-quality">${ch.quality}</span>
                  ${ch.isTvr ? '<span class="tv-grid-vip-tag">VIP</span>' : ''}
                </div>
              </div>

              <!-- Real-Time EPG Schedule Progress -->
              <div class="tv-grid-epg">
                <div class="tv-epg-header">
                  <span class="tv-epg-title" title="${epg.title}">${epg.title}</span>
                  <span class="tv-epg-time">${epg.timeRange}</span>
                </div>
                <div class="tv-epg-bar">
                  <div class="tv-epg-fill" style="width: ${epg.progress}%"></div>
                </div>
                <div class="tv-epg-footer">
                  <span class="tv-epg-pct">%${epg.progress} tamamlandı</span>
                  <span class="tv-epg-rem">${epg.remainingMin} dk kaldı</span>
                </div>
              </div>

              ${isActive ? '<div class="tv-grid-live-indicator"><span class="tv-live-dot"></span> <span>ŞU AN İZLENİYOR</span></div>' : ''}
            </div>
          `;
        }).join('');

        channelGrid.querySelectorAll('.tv-grid-card').forEach(item => {
          item.addEventListener('click', (e) => {
            if (e.target.closest('.tv-grid-fav-btn')) return;
            const ch = LIVE_TV_CHANNELS.find(c => c.id === item.dataset.id);
            if (ch && ch.id !== activeChannel.id) {
              loadChannel(ch);
              if (heroSection) heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        });

        channelGrid.querySelectorAll('.tv-grid-fav-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFav(btn.dataset.favid);
          });
        });

        if (window.lucide) window.lucide.createIcons();
      }

      renderAllViews = () => {
        renderBottomChannelGrid();
        updateTopBar();
        if (window.lucide) window.lucide.createIcons();
      };

      // ─── Search Handlers ───
      if (searchInput) {
        searchInput.addEventListener('input', e => {
          searchQuery = e.target.value.trim();
          if (searchClearBtn) searchClearBtn.classList.toggle('hidden', !searchQuery);
          renderAllViews();
        });
      }

      if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
          searchInput.value = '';
          searchQuery = '';
          searchClearBtn.classList.add('hidden');
          renderAllViews();
        });
      }

      // ─── Category Navigation (Horizontal Native Scroll & Desktop Drag) ───
      if (catStrip) {
        if (catPrevBtn) {
          catPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            catStrip.scrollBy({ left: -220, behavior: 'smooth' });
          });
        }
        if (catNextBtn) {
          catNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            catStrip.scrollBy({ left: 220, behavior: 'smooth' });
          });
        }

        catStrip.addEventListener('wheel', (e) => {
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            catStrip.scrollLeft += e.deltaY;
          }
        }, { passive: false });

        let isMouseDown = false;
        let startX = 0;
        let scrollStart = 0;
        let isDragging = false;

        catStrip.addEventListener('mousedown', (e) => {
          if (e.button !== 0) return;
          isMouseDown = true;
          isDragging = false;
          startX = e.pageX - catStrip.offsetLeft;
          scrollStart = catStrip.scrollLeft;
        });

        window.addEventListener('mousemove', (e) => {
          if (!isMouseDown) return;
          const x = e.pageX - catStrip.offsetLeft;
          const walk = (x - startX) * 1.5;
          if (Math.abs(walk) > 6) {
            isDragging = true;
            catStrip.classList.add('is-dragging');
          }
          catStrip.scrollLeft = scrollStart - walk;
        });

        window.addEventListener('mouseup', () => {
          if (isMouseDown) {
            isMouseDown = false;
            catStrip.classList.remove('is-dragging');
            setTimeout(() => { isDragging = false; }, 50);
          }
        });

        catStrip.querySelectorAll('.tv-cat-filter-btn').forEach(pill => {
          pill.addEventListener('click', (e) => {
            if (isDragging) {
              e.preventDefault();
              return;
            }
            catStrip.querySelectorAll('.tv-cat-filter-btn').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeCategory = pill.dataset.cat;
            pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            renderAllViews();
          });
        });
      }

      // ─── Fullscreen ───
      if (fsBtn) {
        fsBtn.addEventListener('click', () => {
          if (!document.fullscreenElement) {
            screenEl.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
        });
      }

      document.addEventListener('fullscreenchange', () => {
        const isFs = !!document.fullscreenElement;
        screenEl.classList.toggle('is-fullscreen', isFs);
        if (fsBtn) {
          fsBtn.innerHTML = isFs
            ? '<i data-lucide="minimize-2" style="width:18px;height:18px;"></i>'
            : '<i data-lucide="maximize-2" style="width:18px;height:18px;"></i>';
          if (window.lucide) window.lucide.createIcons();
        }
      });

      // ─── Smart Keyboard Remote & Numpad Listener ───
      function handleKeyboard(e) {
        if (document.activeElement === searchInput) return;

        // Numeric Keypad Jump (0-9)
        if (e.key >= '0' && e.key <= '9') {
          if (numpadBuffer.length >= 2) numpadBuffer = '';
          numpadBuffer += e.key;
          updateNumpadHud();
          return;
        }

        if (e.key === 'Enter' && numpadBuffer) {
          e.preventDefault();
          const targetNum = parseInt(numpadBuffer, 10);
          triggerNumpadZap(targetNum - 1);
          return;
        }

        switch (e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            e.preventDefault();
            zapChannel('prev');
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            e.preventDefault();
            zapChannel('next');
            break;
          case 'ArrowRight':
            e.preventDefault();
            updateVolume(currentVolume + 0.05);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            updateVolume(currentVolume - 0.05);
            break;
          case 'm':
          case 'M':
            if (muteBtn) muteBtn.click();
            break;
          case 'f':
          case 'F':
            if (fsBtn) fsBtn.click();
            break;
          case 'r':
          case 'R':
            if (reloadBtn) reloadBtn.click();
            break;
          case ' ':
            e.preventDefault();
            if (playPauseBtn) playPauseBtn.click();
            break;
        }
      }
      document.addEventListener('keydown', handleKeyboard);

      // ─── Dynamic EPG Periodic Auto-Update ───
      const epgInterval = setInterval(() => {
        updateTopBar();
      }, 30000);

      // ─── Global Clean Up & Lifecycle Manager ───
      const stopAllPlayback = () => {
        channelPlaybackToken++;
        clearInterval(epgInterval);
        window.removeEventListener('scroll', handlePipScroll);
        if (activeHls) {
          try {
            activeHls.stopLoad();
            activeHls.detachMedia();
            activeHls.destroy();
          } catch (_) {}
          activeHls = null;
        }
        if (videoEl) {
          try {
            videoEl.pause();
            videoEl.removeAttribute('src');
            videoEl.load();
          } catch (_) {}
        }
        document.removeEventListener('keydown', handleKeyboard);
      };

      window.__LiveTvController = {
        cleanup: stopAllPlayback
      };

      const observer = new MutationObserver(() => {
        if (!document.contains(container)) {
          stopAllPlayback();
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });

      // ─── Initial Start ───
      renderAllViews();
      loadChannel(activeChannel);
      updateVolume(1.0);
    }
  };
}

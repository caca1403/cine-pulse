/* ==========================================================================
   CinePulse Studio - Advanced Interactive Television & IPTV Player
   100% Native HLS.js Direct Playback — Zero Iframes, Zero External Ads
   Full-featured OSD Controls, In-Player Fullscreen Channel Drawer,
   Volume Slider, Quick Channel Carousel, Favorites & Remote Control.
   ========================================================================== */

import { LIVE_TV_CATEGORIES, LIVE_TV_CHANNELS, getChannelBadgeSvg } from '../services/liveTvChannels.js';
import { getRecTvChannelStreamUrl } from '../services/rectvService.js';
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
  let activeHls = null;
  let searchQuery = '';
  let osdTimeout = null;
  let controlsTimeout = null;
  let isMuted = false;
  let currentVolume = 1.0;
  let isDrawerOpen = false;
  let favorites = getFavoriteIds();

  function isFav(channelId) {
    return favorites.includes(channelId);
  }

  function toggleFav(channelId) {
    if (isFav(channelId)) {
      favorites = favorites.filter(id => id !== channelId);
      showToast('Favorilerden çıkarıldı', 'info');
    } else {
      favorites.push(channelId);
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
    <div class="livetv-view" id="livetv-root">

      <!-- Main Layout -->
      <div class="tv-cinema-layout">

        <!-- Player Column -->
        <div class="tv-player-column" id="tv-player-column">

          <!-- Interactive Screen Container -->
          <div class="tv-screen" id="tv-screen" tabindex="0">
            <video id="tv-video" autoplay playsinline webkit-playsinline></video>

            <!-- Screen Click Overlay for Gesture / Toggle -->
            <div class="tv-screen-backdrop" id="tv-screen-backdrop"></div>

            <!-- In-Player Floating Top Bar (Channel Info + Actions) -->
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
                  <div class="tv-osd-ch-sub">
                    <span class="tv-live-pill"><span class="tv-live-dot"></span> CANLI YAYIN</span>
                    <span class="tv-quality-pill" id="tv-top-quality">${activeChannel.quality}</span>
                    ${activeChannel.isTvr ? '<span class="tv-vip-pill">TVR VIP</span>' : ''}
                  </div>
                </div>
              </div>

              <div class="tv-osd-top-actions">
                <button class="tv-icon-btn tv-fav-btn" id="tv-btn-fav-top" title="Favorilere Ekle/Çıkar">
                  <i data-lucide="star" style="width:18px;height:18px;"></i>
                </button>
                <button class="tv-icon-btn tv-drawer-toggle-btn" id="tv-btn-drawer-top" title="Kanal Listesini Aç (C)">
                  <i data-lucide="list-video" style="width:18px;height:18px;"></i>
                  <span class="tv-btn-label">Kanallar</span>
                </button>
              </div>
            </div>

            <!-- Left / Right Zap Arrows (Visible on hover & touch) -->
            <button class="tv-zap-btn tv-zap-prev" id="tv-zap-prev" title="Önceki Kanal (Yukarı Ok / Sol Ok)">
              <i data-lucide="chevron-left" style="width:26px;height:26px;"></i>
              <span class="tv-zap-hint">Önceki</span>
            </button>
            <button class="tv-zap-btn tv-zap-next" id="tv-zap-next" title="Sonraki Kanal (Aşağı Ok / Sağ Ok)">
              <span class="tv-zap-hint">Sonraki</span>
              <i data-lucide="chevron-right" style="width:26px;height:26px;"></i>
            </button>

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

            <!-- IN-PLAYER FULLSCREEN CHANNEL DRAWER (Allows channel switching without leaving fullscreen) -->
            <div class="tv-inplayer-drawer" id="tv-inplayer-drawer">
              <div class="tv-drawer-header">
                <div class="tv-drawer-title">
                  <i data-lucide="tv" style="width:18px;height:18px;color:var(--primary);"></i>
                  <span>Kanal Rehberi</span>
                </div>
                <button class="tv-drawer-close" id="tv-drawer-close" title="Kapat">
                  <i data-lucide="x" style="width:18px;height:18px;"></i>
                </button>
              </div>

              <!-- Drawer Search -->
              <div class="tv-drawer-search">
                <i data-lucide="search" style="width:14px;height:14px;"></i>
                <input type="text" id="tv-drawer-search-input" placeholder="Kanal ara..." />
              </div>

              <!-- Drawer Categories Strip -->
              <div class="tv-drawer-cats" id="tv-drawer-cats">
                ${LIVE_TV_CATEGORIES.map(cat => `
                  <button class="tv-drawer-cat-btn ${cat.id === activeCategory ? 'active' : ''}" data-cat="${cat.id}">
                    <i data-lucide="${cat.icon}" style="width:12px;height:12px;"></i>
                    <span>${cat.name}</span>
                  </button>
                `).join('')}
              </div>

              <!-- Drawer Channel Items List -->
              <div class="tv-drawer-list" id="tv-drawer-list"></div>
            </div>

            <!-- In-Player Bottom Control Bar -->
            <div class="tv-screen-controls" id="tv-screen-controls">
              <!-- Left: Quick Navigation -->
              <div class="tv-ctrl-group">
                <button class="tv-ctrl-action-btn" id="tv-btn-prev-ch" title="Önceki Kanal (P-)">
                  <i data-lucide="skip-back" style="width:16px;height:16px;"></i>
                </button>
                <button class="tv-ctrl-action-btn" id="tv-btn-play-pause" title="Oynat / Duraklat (Space)">
                  <i data-lucide="pause" style="width:18px;height:18px;"></i>
                </button>
                <button class="tv-ctrl-action-btn" id="tv-btn-next-ch" title="Sonraki Kanal (P+)">
                  <i data-lucide="skip-forward" style="width:16px;height:16px;"></i>
                </button>
                <button class="tv-ctrl-action-btn tv-live-sync-btn" id="tv-btn-sync" title="Canlı Yayına Eşitle">
                  <span class="tv-live-sync-dot"></span> CANLI
                </button>
              </div>

              <!-- Center: Volume Slider & Mute -->
              <div class="tv-volume-group">
                <button class="tv-ctrl-action-btn" id="tv-btn-mute" title="Sesi Aç/Kapat (M)">
                  <i data-lucide="volume-2" style="width:18px;height:18px;"></i>
                </button>
                <div class="tv-volume-slider-box">
                  <input type="range" id="tv-volume-slider" class="tv-volume-slider" min="0" max="1" step="0.05" value="1" />
                </div>
                <span class="tv-volume-label" id="tv-volume-label">100%</span>
              </div>

              <!-- Right: Drawer, Reload, PiP, Fullscreen -->
              <div class="tv-ctrl-group tv-ctrl-right">
                <button class="tv-ctrl-action-btn" id="tv-btn-reload" title="Akışı Yenile (R)">
                  <i data-lucide="rotate-cw" style="width:16px;height:16px;"></i>
                </button>
                <button class="tv-ctrl-action-btn tv-btn-channels-drawer" id="tv-btn-open-drawer" title="Kanal Listesi (C)">
                  <i data-lucide="layout-grid" style="width:16px;height:16px;"></i>
                  <span class="tv-ctrl-text">Rehber</span>
                </button>
                <button class="tv-ctrl-action-btn" id="tv-btn-pip" title="Resim İçinde Resim">
                  <i data-lucide="picture-in-picture-2" style="width:16px;height:16px;"></i>
                </button>
                <button class="tv-ctrl-action-btn" id="tv-btn-fullscreen" title="Tam Ekran (F)">
                  <i data-lucide="maximize-2" style="width:18px;height:18px;"></i>
                </button>
              </div>
            </div>

          </div>

          <!-- Mobile & Compact Quick Channel Carousel -->
          <div class="tv-quick-carousel-wrapper">
            <div class="tv-quick-header">
              <div class="tv-quick-title">
                <i data-lucide="zap" style="width:14px;height:14px;color:var(--primary);"></i>
                <span>Hızlı Kanal Değiştir</span>
              </div>
              <span class="tv-quick-hint">Kaydırarak kanal seçin</span>
            </div>
            <div class="tv-quick-strip" id="tv-quick-strip">
              <!-- Rendered dynamically -->
            </div>
          </div>

        </div>

        <!-- Right: Comprehensive Channel Guide Column (For Desktop) -->
        <div class="tv-guide-column" id="tv-guide-column">

          <!-- Search Bar -->
          <div class="tv-guide-search">
            <i data-lucide="search" class="tv-search-icon"></i>
            <input type="text" id="tv-search" class="tv-search-input" placeholder="Kanal adı veya spor/haber ara..." />
            <button class="tv-search-clear hidden" id="tv-search-clear"><i data-lucide="x" style="width:14px;height:14px;"></i></button>
          </div>

          <!-- Category Navigation Pills -->
          <div class="tv-category-wrapper">
            <button class="tv-cat-nav-btn tv-cat-prev" id="tv-cat-prev" type="button" title="Geri kaydır">
              <i data-lucide="chevron-left" style="width:14px;height:14px;"></i>
            </button>
            <div class="tv-category-strip" id="tv-category-strip">
              ${LIVE_TV_CATEGORIES.map(cat => `
                <button class="tv-cat-pill ${cat.id === activeCategory ? 'active' : ''}" data-cat="${cat.id}">
                  <i data-lucide="${cat.icon}" style="width:13px;height:13px;"></i>
                  <span>${cat.name}</span>
                </button>
              `).join('')}
            </div>
            <button class="tv-cat-nav-btn tv-cat-next" id="tv-cat-next" type="button" title="İleri kaydır">
              <i data-lucide="chevron-right" style="width:14px;height:14px;"></i>
            </button>
          </div>

          <!-- Channel Stats & Filter State -->
          <div class="tv-guide-header">
            <span class="tv-guide-count" id="tv-guide-count"></span>
            <div class="tv-remote-shortcuts-hint" title="Kumanda & Klavye Kısayolları">
              <i data-lucide="keyboard" style="width:13px;height:13px;"></i>
              <span>Yön Tuşları: Zap / Ses</span>
            </div>
          </div>

          <!-- Channel List Scroll Area -->
          <div class="tv-channel-list" id="tv-channel-list"></div>

        </div>

      </div>

    </div>
  `;

  return {
    html,
    init: (container) => {
      if (!container) return;

      const videoEl = container.querySelector('#tv-video');
      const screenEl = container.querySelector('#tv-screen');
      const backdropEl = container.querySelector('#tv-screen-backdrop');
      const topBarEl = container.querySelector('#tv-osd-topbar');
      const topLogo = container.querySelector('#tv-top-logo');
      const topName = container.querySelector('#tv-top-name');
      const topNum = container.querySelector('#tv-top-num');
      const topQuality = container.querySelector('#tv-top-quality');
      const topFavBtn = container.querySelector('#tv-btn-fav-top');
      const topDrawerBtn = container.querySelector('#tv-btn-drawer-top');

      const zapPrevBtn = container.querySelector('#tv-zap-prev');
      const zapNextBtn = container.querySelector('#tv-zap-next');
      const osdEl = container.querySelector('#tv-osd');
      const osdLogo = container.querySelector('#tv-osd-logo');
      const osdName = container.querySelector('#tv-osd-name');
      const osdQuality = container.querySelector('#tv-osd-quality');
      const osdChnum = container.querySelector('#tv-osd-chnum');

      const loadingEl = container.querySelector('#tv-loading');
      const errorEl = container.querySelector('#tv-error');
      const retryBtn = container.querySelector('#tv-retry-btn');
      const errorNextBtn = container.querySelector('#tv-error-next-btn');

      const screenControls = container.querySelector('#tv-screen-controls');
      const playPauseBtn = container.querySelector('#tv-btn-play-pause');
      const prevChBtn = container.querySelector('#tv-btn-prev-ch');
      const nextChBtn = container.querySelector('#tv-btn-next-ch');
      const syncBtn = container.querySelector('#tv-btn-sync');
      const muteBtn = container.querySelector('#tv-btn-mute');
      const volumeSlider = container.querySelector('#tv-volume-slider');
      const volumeLabel = container.querySelector('#tv-volume-label');
      const reloadBtn = container.querySelector('#tv-btn-reload');
      const openDrawerBtn = container.querySelector('#tv-btn-open-drawer');
      const pipBtn = container.querySelector('#tv-btn-pip');
      const fsBtn = container.querySelector('#tv-btn-fullscreen');

      const inplayerDrawer = container.querySelector('#tv-inplayer-drawer');
      const drawerCloseBtn = container.querySelector('#tv-drawer-close');
      const drawerSearchInput = container.querySelector('#tv-drawer-search-input');
      const drawerCats = container.querySelector('#tv-drawer-cats');
      const drawerList = container.querySelector('#tv-drawer-list');

      const quickStrip = container.querySelector('#tv-quick-strip');
      const channelList = container.querySelector('#tv-channel-list');
      const searchInput = container.querySelector('#tv-search');
      const searchClearBtn = container.querySelector('#tv-search-clear');
      const catStrip = container.querySelector('#tv-category-strip');
      const catPrevBtn = container.querySelector('#tv-cat-prev');
      const catNextBtn = container.querySelector('#tv-cat-next');
      const countLabel = container.querySelector('#tv-guide-count');

      // ─── Update UI & Top Bar ───
      function updateTopBar() {
        const globalIdx = getChannelIndex(activeChannel) + 1;
        topName.textContent = activeChannel.name;
        topNum.textContent = `CH ${String(globalIdx).padStart(2, '0')}`;
        topQuality.textContent = activeChannel.quality;

        topLogo.src = activeChannel.logo;
        topLogo.onerror = () => {
          topLogo.onerror = null;
          topLogo.src = getChannelBadgeSvg(activeChannel.name, activeChannel.category);
        };

        if (isFav(activeChannel.id)) {
          topFavBtn.classList.add('is-active');
          topFavBtn.innerHTML = '<i data-lucide="star" style="width:18px;height:18px;fill:#fbbf24;color:#fbbf24;"></i>';
        } else {
          topFavBtn.classList.remove('is-active');
          topFavBtn.innerHTML = '<i data-lucide="star" style="width:18px;height:18px;"></i>';
        }

        if (window.lucide) window.lucide.createIcons();
      }

      // ─── OSD Center Popup Banner ───
      function showOSD() {
        if (osdTimeout) clearTimeout(osdTimeout);
        const idx = getChannelIndex(activeChannel);
        osdLogo.src = activeChannel.logo;
        osdLogo.onerror = () => {
          osdLogo.onerror = null;
          osdLogo.src = getChannelBadgeSvg(activeChannel.name, activeChannel.category);
        };
        osdName.textContent = activeChannel.name;
        osdQuality.textContent = activeChannel.quality;
        osdChnum.textContent = String(idx + 1).padStart(2, '0');

        osdEl.classList.remove('hidden');
        osdEl.classList.add('tv-osd-show');

        osdTimeout = setTimeout(() => {
          osdEl.classList.remove('tv-osd-show');
          osdEl.classList.add('tv-osd-hide');
          setTimeout(() => {
            osdEl.classList.add('hidden');
            osdEl.classList.remove('tv-osd-hide');
          }, 350);
        }, 3200);
      }

      // ─── Auto-Hiding Controls On Screen ───
      function keepControlsActive() {
        screenEl.classList.add('user-active');
        if (controlsTimeout) clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
          if (!isDrawerOpen) {
            screenEl.classList.remove('user-active');
          }
        }, 3800);
      }

      screenEl.addEventListener('mousemove', keepControlsActive);
      screenEl.addEventListener('touchstart', keepControlsActive, { passive: true });
      screenEl.addEventListener('click', keepControlsActive);

      // ─── In-Player Drawer Toggle ───
      function setDrawerState(open) {
        isDrawerOpen = open;
        if (open) {
          inplayerDrawer.classList.add('open');
          renderDrawerChannelList();
          keepControlsActive();
          setTimeout(() => drawerSearchInput?.focus(), 150);
        } else {
          inplayerDrawer.classList.remove('open');
          screenEl.focus();
        }
      }

      topDrawerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setDrawerState(!isDrawerOpen);
      });
      openDrawerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setDrawerState(!isDrawerOpen);
      });
      drawerCloseBtn.addEventListener('click', () => setDrawerState(false));

      // ─── Volume Controls ───
      function updateVolume(val) {
        val = Math.max(0, Math.min(1, val));
        currentVolume = val;
        videoEl.volume = val;
        volumeSlider.value = val;
        const pct = Math.round(val * 100);
        volumeLabel.textContent = `${pct}%`;

        if (val === 0) {
          isMuted = true;
          videoEl.muted = true;
          muteBtn.innerHTML = '<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>';
        } else {
          isMuted = false;
          videoEl.muted = false;
          muteBtn.innerHTML = '<i data-lucide="volume-2" style="width:18px;height:18px;"></i>';
        }
        if (window.lucide) window.lucide.createIcons();
      }

      volumeSlider.addEventListener('input', (e) => {
        updateVolume(parseFloat(e.target.value));
      });

      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMuted) {
          updateVolume(currentVolume || 0.8);
          showToast('Ses açıldı', 'info');
        } else {
          videoEl.muted = true;
          isMuted = true;
          muteBtn.innerHTML = '<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>';
          volumeLabel.textContent = '0%';
          if (window.lucide) window.lucide.createIcons();
          showToast('Sessize alındı', 'info');
        }
      });

      // ─── Play / Pause Toggle ───
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

      // ─── Live Sync ───
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

      // ─── Favorite Toggle ───
      topFavBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFav(activeChannel.id);
      });

      // ─── HLS Stream Engine ───
      async function loadChannel(channel) {
        activeChannel = channel;

        if (activeHls) {
          activeHls.destroy();
          activeHls = null;
        }

        loadingEl.classList.remove('hidden');
        errorEl.classList.add('hidden');

        // Check if channel is RecTV VIP and refresh authenticated token stream
        if (channel.isTvr && channel.tvrId) {
          try {
            const freshUrl = await getRecTvChannelStreamUrl(channel.tvrId);
            if (freshUrl) {
              channel.streamUrl = freshUrl;
            }
          } catch (_) {}
        }

        updateTopBar();
        showOSD();
        renderAllViews();

        function startHls(url) {
          if (window.Hls && window.Hls.isSupported()) {
            if (activeHls) activeHls.destroy();

            const hls = new window.Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 60,
              maxBufferLength: 20,
              maxMaxBufferLength: 40,
              liveSyncDurationCount: 3
            });
            activeHls = hls;
            hls.loadSource(url);
            hls.attachMedia(videoEl);

            hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
              loadingEl.classList.add('hidden');
              errorEl.classList.add('hidden');
              videoEl.play().catch(() => {});
            });

            hls.on(window.Hls.Events.ERROR, (_, data) => {
              if (data.fatal) {
                console.warn('[LiveTV] Fatal HLS error on:', url, data.type, data.details);
                loadingEl.classList.add('hidden');
                errorEl.classList.remove('hidden');
                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                  setTimeout(() => hls.startLoad(), 3500);
                }
              }
            });
          } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari iOS/macOS
            videoEl.src = url;
            videoEl.addEventListener('loadedmetadata', () => {
              loadingEl.classList.add('hidden');
              errorEl.classList.add('hidden');
              videoEl.play().catch(() => {});
            }, { once: true });
            videoEl.addEventListener('error', () => {
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

      zapPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); zapChannel('prev'); });
      zapNextBtn.addEventListener('click', (e) => { e.stopPropagation(); zapChannel('next'); });
      prevChBtn.addEventListener('click', (e) => { e.stopPropagation(); zapChannel('prev'); });
      nextChBtn.addEventListener('click', (e) => { e.stopPropagation(); zapChannel('next'); });
      errorNextBtn.addEventListener('click', () => zapChannel('next'));
      retryBtn.addEventListener('click', () => loadChannel(activeChannel));
      reloadBtn.addEventListener('click', () => {
        showToast('Yayın yeniden yükleniyor...', 'info');
        loadChannel(activeChannel);
      });

      // ─── In-Player Drawer Channel List ───
      function renderDrawerChannelList() {
        const query = (drawerSearchInput.value || '').trim().toLowerCase();
        const filtered = LIVE_TV_CHANNELS.filter(ch => {
          let matchCat = true;
          if (activeCategory === 'favorites') {
            matchCat = isFav(ch.id);
          } else if (activeCategory !== 'all') {
            matchCat = ch.category === activeCategory;
          }
          const matchSearch = !query || ch.name.toLowerCase().includes(query);
          return matchCat && matchSearch;
        });

        if (filtered.length === 0) {
          drawerList.innerHTML = `
            <div class="tv-drawer-empty">
              <i data-lucide="radio" style="width:24px;height:24px;color:var(--text-muted);"></i>
              <span>Kanal bulunamadı</span>
            </div>
          `;
          if (window.lucide) window.lucide.createIcons();
          return;
        }

        drawerList.innerHTML = filtered.map(ch => {
          const isActive = ch.id === activeChannel.id;
          const isFavorited = isFav(ch.id);
          const fallbackBadge = getChannelBadgeSvg(ch.name, ch.category);
          return `
            <div class="tv-drawer-item ${isActive ? 'active' : ''}" data-id="${ch.id}">
              <img class="tv-drawer-item-logo" src="${ch.logo}" alt="${ch.name}" onerror="this.onerror=null; this.src='${fallbackBadge}';" loading="lazy" />
              <div class="tv-drawer-item-info">
                <span class="tv-drawer-item-name">${ch.name}</span>
                <div class="tv-drawer-item-tags">
                  <span class="tv-drawer-tag-quality">${ch.quality}</span>
                  ${ch.isTvr ? '<span class="tv-drawer-tag-vip">TVR VIP</span>' : ''}
                </div>
              </div>
              <button class="tv-drawer-fav-btn ${isFavorited ? 'is-fav' : ''}" data-favid="${ch.id}" title="Favori">
                <i data-lucide="star" style="width:14px;height:14px;${isFavorited ? 'fill:#fbbf24;color:#fbbf24;' : ''}"></i>
              </button>
              ${isActive ? '<span class="tv-drawer-live-badge"><span class="tv-live-dot"></span></span>' : ''}
            </div>
          `;
        }).join('');

        // Item click
        drawerList.querySelectorAll('.tv-drawer-item').forEach(item => {
          item.addEventListener('click', (e) => {
            if (e.target.closest('.tv-drawer-fav-btn')) return;
            const ch = LIVE_TV_CHANNELS.find(c => c.id === item.dataset.id);
            if (ch) {
              loadChannel(ch);
              setDrawerState(false);
            }
          });
        });

        // Fav click in drawer
        drawerList.querySelectorAll('.tv-drawer-fav-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFav(btn.dataset.favid);
          });
        });

        // Scroll active item into view
        const activeItem = drawerList.querySelector('.tv-drawer-item.active');
        if (activeItem) {
          activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        if (window.lucide) window.lucide.createIcons();
      }

      drawerSearchInput.addEventListener('input', () => renderDrawerChannelList());

      drawerCats.querySelectorAll('.tv-drawer-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          drawerCats.querySelectorAll('.tv-drawer-cat-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeCategory = btn.dataset.cat;
          // Sync desktop cat pill
          catStrip.querySelectorAll('.tv-cat-pill').forEach(p => {
            p.classList.toggle('active', p.dataset.cat === activeCategory);
          });
          renderAllViews();
        });
      });

      // ─── Mobile Quick Channel Strip ───
      function renderQuickCarousel() {
        const filtered = getFilteredChannels();
        if (filtered.length === 0) {
          quickStrip.innerHTML = '<span class="tv-quick-empty">Kanal yok</span>';
          return;
        }

        quickStrip.innerHTML = filtered.map(ch => {
          const isActive = ch.id === activeChannel.id;
          const fallbackBadge = getChannelBadgeSvg(ch.name, ch.category);
          return `
            <button class="tv-quick-card ${isActive ? 'active' : ''}" data-id="${ch.id}">
              <img class="tv-quick-logo" src="${ch.logo}" alt="${ch.name}" onerror="this.onerror=null; this.src='${fallbackBadge}';" loading="lazy" />
              <span class="tv-quick-name">${ch.name}</span>
              ${isActive ? '<span class="tv-quick-dot"></span>' : ''}
            </button>
          `;
        }).join('');

        quickStrip.querySelectorAll('.tv-quick-card').forEach(btn => {
          btn.addEventListener('click', () => {
            const ch = LIVE_TV_CHANNELS.find(c => c.id === btn.dataset.id);
            if (ch && ch.id !== activeChannel.id) loadChannel(ch);
          });
        });

        const activeCard = quickStrip.querySelector('.tv-quick-card.active');
        if (activeCard) {
          setTimeout(() => activeCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }), 50);
        }
      }

      // ─── Main Desktop Channel Guide List ───
      function renderMainChannelList() {
        const filtered = getFilteredChannels();
        countLabel.textContent = `${filtered.length} KANAL`;

        if (filtered.length === 0) {
          channelList.innerHTML = `
            <div class="tv-empty-state">
              <i data-lucide="radio" style="width:32px;height:32px;color:var(--text-muted);"></i>
              <span class="tv-empty-title">Kanal Bulunamadı</span>
              <p class="tv-empty-sub">Arama kriterlerinizi veya kategori filtrenizi değiştirin.</p>
            </div>
          `;
          if (window.lucide) window.lucide.createIcons();
          return;
        }

        channelList.innerHTML = filtered.map(ch => {
          const isActive = ch.id === activeChannel.id;
          const isFavorited = isFav(ch.id);
          const globalIdx = getChannelIndex(ch) + 1;
          const fallbackBadge = getChannelBadgeSvg(ch.name, ch.category);
          return `
            <div class="tv-channel-item ${isActive ? 'active' : ''}" data-id="${ch.id}">
              <span class="tv-ch-num">${String(globalIdx).padStart(2, '0')}</span>
              <div class="tv-ch-logo-wrapper">
                <img class="tv-ch-logo" src="${ch.logo}" alt="${ch.name}" onerror="this.onerror=null; this.src='${fallbackBadge}';" loading="lazy" />
              </div>
              <div class="tv-ch-info">
                <div class="tv-ch-name-row">
                  <span class="tv-ch-name">${ch.name}</span>
                  ${ch.isTvr ? '<span class="tv-ch-vip-badge">VIP</span>' : ''}
                </div>
                <div class="tv-ch-meta-row">
                  <span class="tv-ch-quality">${ch.quality}</span>
                  <span class="tv-ch-cat-tag">${ch.category.toUpperCase()}</span>
                </div>
              </div>
              <button class="tv-ch-fav-btn ${isFavorited ? 'is-fav' : ''}" data-favid="${ch.id}" title="${isFavorited ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}">
                <i data-lucide="star" style="width:16px;height:16px;${isFavorited ? 'fill:#fbbf24;color:#fbbf24;' : ''}"></i>
              </button>
              ${isActive ? '<span class="tv-ch-live-indicator"><span class="tv-live-dot"></span></span>' : ''}
            </div>
          `;
        }).join('');

        channelList.querySelectorAll('.tv-channel-item').forEach(item => {
          item.addEventListener('click', (e) => {
            if (e.target.closest('.tv-ch-fav-btn')) return;
            const ch = LIVE_TV_CHANNELS.find(c => c.id === item.dataset.id);
            if (ch && ch.id !== activeChannel.id) loadChannel(ch);
          });
        });

        channelList.querySelectorAll('.tv-ch-fav-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFav(btn.dataset.favid);
          });
        });

        const activeEl = channelList.querySelector('.tv-channel-item.active');
        if (activeEl) {
          setTimeout(() => activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
        }

        if (window.lucide) window.lucide.createIcons();
      }

      renderAllViews = () => {
        renderMainChannelList();
        renderQuickCarousel();
        if (isDrawerOpen) renderDrawerChannelList();
        updateTopBar();
      };

      // ─── Search Handlers ───
      searchInput.addEventListener('input', e => {
        searchQuery = e.target.value.trim();
        searchClearBtn.classList.toggle('hidden', !searchQuery);
        renderAllViews();
      });

      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClearBtn.classList.add('hidden');
        renderAllViews();
      });

      // ─── Category Navigation ───
      if (catPrevBtn) {
        catPrevBtn.addEventListener('click', () => catStrip.scrollBy({ left: -140, behavior: 'smooth' }));
      }
      if (catNextBtn) {
        catNextBtn.addEventListener('click', () => catStrip.scrollBy({ left: 140, behavior: 'smooth' }));
      }

      catStrip.querySelectorAll('.tv-cat-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          catStrip.querySelectorAll('.tv-cat-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          activeCategory = pill.dataset.cat;
          // Sync drawer cat buttons
          drawerCats.querySelectorAll('.tv-drawer-cat-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.cat === activeCategory);
          });
          pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          renderAllViews();
        });
      });

      // ─── PiP & Fullscreen ───
      pipBtn.addEventListener('click', async () => {
        try {
          if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
          } else if (videoEl.requestPictureInPicture) {
            await videoEl.requestPictureInPicture();
          }
        } catch (e) {
          showToast('PiP desteklenmiyor', 'error');
        }
      });

      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          screenEl.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });

      document.addEventListener('fullscreenchange', () => {
        const isFs = !!document.fullscreenElement;
        screenEl.classList.toggle('is-fullscreen', isFs);
        fsBtn.innerHTML = isFs
          ? '<i data-lucide="minimize-2" style="width:18px;height:18px;"></i>'
          : '<i data-lucide="maximize-2" style="width:18px;height:18px;"></i>';
        if (window.lucide) window.lucide.createIcons();
      });

      // ─── Smart Keyboard Remote ───
      function handleKeyboard(e) {
        if (document.activeElement === searchInput || document.activeElement === drawerSearchInput) return;

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
            muteBtn.click();
            break;
          case 'f':
          case 'F':
            fsBtn.click();
            break;
          case 'c':
          case 'C':
          case 'l':
          case 'L':
            setDrawerState(!isDrawerOpen);
            break;
          case 'r':
          case 'R':
            reloadBtn.click();
            break;
          case ' ':
            e.preventDefault();
            playPauseBtn.click();
            break;
          case 'Escape':
            if (isDrawerOpen) setDrawerState(false);
            break;
        }
      }
      document.addEventListener('keydown', handleKeyboard);

      // Clean up on navigation
      const observer = new MutationObserver(() => {
        if (!document.contains(container)) {
          if (activeHls) { activeHls.destroy(); activeHls = null; }
          document.removeEventListener('keydown', handleKeyboard);
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

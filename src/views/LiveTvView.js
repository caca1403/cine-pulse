/* ==========================================================================
   CinePulse Studio - Native Television Experience
   Direct HLS.js m3u8 playback — zero iframes, zero external sites.
   Real TV channel zapping with OSD overlay & keyboard remote control.
   ========================================================================== */

import { LIVE_TV_CATEGORIES, LIVE_TV_CHANNELS } from '../services/liveTvChannels.js';
import { showToast } from '../components/Toast.js';

export function renderLiveTvView() {
  let activeCategory = 'all';
  let activeChannel = LIVE_TV_CHANNELS.find(c => c.id === 'ch_trt1') || LIVE_TV_CHANNELS[0];
  let activeHls = null;
  let searchQuery = '';
  let osdTimeout = null;
  let isMuted = false;

  function getFilteredChannels() {
    return LIVE_TV_CHANNELS.filter(ch => {
      const matchCat = activeCategory === 'all' || ch.category === activeCategory;
      const matchSearch = !searchQuery || ch.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  function getChannelIndex(ch) {
    return LIVE_TV_CHANNELS.findIndex(c => c.id === ch.id);
  }

  const html = `
    <div class="livetv-view">

      <!-- TV Cinema Player -->
      <div class="tv-cinema-layout">

        <!-- Left: Video Player -->
        <div class="tv-player-column">
          <div class="tv-screen" id="tv-screen">
            <video id="tv-video" autoplay playsinline webkit-playsinline></video>

            <!-- OSD Channel Banner (fades in/out) -->
            <div class="tv-osd-banner hidden" id="tv-osd">
              <div class="tv-osd-left">
                <img id="tv-osd-logo" class="tv-osd-logo" src="" alt="" />
                <div class="tv-osd-info">
                  <div class="tv-osd-name" id="tv-osd-name"></div>
                  <div class="tv-osd-meta">
                    <span class="tv-osd-live-dot"></span>
                    <span>CANLI</span>
                    <span class="tv-osd-quality" id="tv-osd-quality"></span>
                  </div>
                </div>
              </div>
              <div class="tv-osd-chnum" id="tv-osd-chnum"></div>
            </div>

            <!-- Loading Spinner -->
            <div class="tv-loading hidden" id="tv-loading">
              <div class="tv-loading-spinner"></div>
              <span>Kanal yükleniyor...</span>
            </div>

            <!-- Error State -->
            <div class="tv-error hidden" id="tv-error">
              <i data-lucide="wifi-off" style="width:32px;height:32px;color:#ef4444;"></i>
              <span>Yayın akışına bağlanılamadı</span>
              <button class="tv-retry-btn" id="tv-retry-btn">Tekrar Dene</button>
            </div>
          </div>

          <!-- Player Controls Bar -->
          <div class="tv-controls-bar">
            <div class="tv-controls-left">
              <img id="tv-ctrl-logo" class="tv-ctrl-logo" src="${activeChannel.logo}" alt="" onerror="this.style.display='none'" />
              <div class="tv-ctrl-info">
                <div class="tv-ctrl-name" id="tv-ctrl-name">${activeChannel.name}</div>
                <div class="tv-ctrl-badges">
                  <span class="tv-ctrl-live"><span class="tv-live-dot"></span> CANLI</span>
                  <span class="tv-ctrl-quality" id="tv-ctrl-quality">${activeChannel.quality}</span>
                </div>
              </div>
            </div>
            <div class="tv-controls-right">
              <button class="tv-ctrl-btn" id="tv-btn-mute" title="Sessize Al (M)">
                <i data-lucide="volume-2" style="width:16px;height:16px;"></i>
              </button>
              <button class="tv-ctrl-btn" id="tv-btn-pip" title="Resim İçinde Resim">
                <i data-lucide="picture-in-picture-2" style="width:16px;height:16px;"></i>
              </button>
              <button class="tv-ctrl-btn" id="tv-btn-fullscreen" title="Tam Ekran (F)">
                <i data-lucide="maximize-2" style="width:16px;height:16px;"></i>
              </button>
              <a id="tv-btn-vlc" href="vlc://${activeChannel.streamUrl}" class="tv-ctrl-btn" title="VLC ile Aç">
                <i data-lucide="external-link" style="width:16px;height:16px;"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Right: Channel Guide -->
        <div class="tv-guide-column">
          <!-- Search -->
          <div class="tv-guide-search">
            <i data-lucide="search" style="width:14px;height:14px;color:var(--text-muted);position:absolute;left:0.85rem;top:50%;transform:translateY(-50%);"></i>
            <input type="text" id="tv-search" class="tv-search-input" placeholder="Kanal ara..." />
          </div>

          <!-- Category Pills -->
          <div class="tv-category-strip" id="tv-category-strip">
            ${LIVE_TV_CATEGORIES.map(cat => `
              <button class="tv-cat-pill ${cat.id === activeCategory ? 'active' : ''}" data-cat="${cat.id}">
                <i data-lucide="${cat.icon}" style="width:12px;height:12px;"></i>
                <span>${cat.name}</span>
              </button>
            `).join('')}
          </div>

          <!-- Channel Count -->
          <div class="tv-guide-header">
            <span class="tv-guide-count" id="tv-guide-count"></span>
          </div>

          <!-- Channel List -->
          <div class="tv-channel-list" id="tv-channel-list">
          </div>
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
      const osdEl = container.querySelector('#tv-osd');
      const osdLogo = container.querySelector('#tv-osd-logo');
      const osdName = container.querySelector('#tv-osd-name');
      const osdQuality = container.querySelector('#tv-osd-quality');
      const osdChnum = container.querySelector('#tv-osd-chnum');
      const loadingEl = container.querySelector('#tv-loading');
      const errorEl = container.querySelector('#tv-error');
      const retryBtn = container.querySelector('#tv-retry-btn');
      const ctrlLogo = container.querySelector('#tv-ctrl-logo');
      const ctrlName = container.querySelector('#tv-ctrl-name');
      const ctrlQuality = container.querySelector('#tv-ctrl-quality');
      const channelList = container.querySelector('#tv-channel-list');
      const searchInput = container.querySelector('#tv-search');
      const catStrip = container.querySelector('#tv-category-strip');
      const countLabel = container.querySelector('#tv-guide-count');
      const muteBtn = container.querySelector('#tv-btn-mute');
      const pipBtn = container.querySelector('#tv-btn-pip');
      const fsBtn = container.querySelector('#tv-btn-fullscreen');
      const vlcBtn = container.querySelector('#tv-btn-vlc');

      // ─── OSD Banner ───
      function showOSD() {
        if (osdTimeout) clearTimeout(osdTimeout);
        const idx = getChannelIndex(activeChannel);
        osdLogo.src = activeChannel.logo;
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
          }, 400);
        }, 4000);
      }

      // ─── HLS Playback Engine ───
      function loadChannel(channel) {
        activeChannel = channel;

        // Destroy previous HLS instance
        if (activeHls) {
          activeHls.destroy();
          activeHls = null;
        }

        // Update control bar
        ctrlLogo.src = channel.logo;
        ctrlLogo.style.display = '';
        ctrlName.textContent = channel.name;
        ctrlQuality.textContent = channel.quality;
        vlcBtn.href = `vlc://${channel.streamUrl}`;

        // Show loading, hide error
        loadingEl.classList.remove('hidden');
        errorEl.classList.add('hidden');

        // Show OSD overlay
        showOSD();

        // Start HLS
        if (window.Hls && window.Hls.isSupported()) {
          const hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
            maxBufferLength: 30,
            maxMaxBufferLength: 60
          });
          activeHls = hls;
          hls.loadSource(channel.streamUrl);
          hls.attachMedia(videoEl);

          hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
            loadingEl.classList.add('hidden');
            videoEl.play().catch(() => {});
          });

          hls.on(window.Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              loadingEl.classList.add('hidden');
              errorEl.classList.remove('hidden');
              console.warn('[LiveTV] Fatal HLS error:', data.type, data.details);
              if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                setTimeout(() => hls.startLoad(), 3000);
              }
            }
          });
        } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari native HLS
          videoEl.src = channel.streamUrl;
          videoEl.addEventListener('loadedmetadata', () => {
            loadingEl.classList.add('hidden');
            videoEl.play().catch(() => {});
          }, { once: true });
          videoEl.addEventListener('error', () => {
            loadingEl.classList.add('hidden');
            errorEl.classList.remove('hidden');
          }, { once: true });
        }

        // Apply mute state
        videoEl.muted = isMuted;

        // Re-render channel list to highlight active
        renderChannelList();
        if (window.lucide) window.lucide.createIcons();
      }

      // ─── Channel List Rendering ───
      function renderChannelList() {
        const filtered = getFilteredChannels();
        countLabel.textContent = `${filtered.length} kanal`;

        if (filtered.length === 0) {
          channelList.innerHTML = `
            <div class="tv-empty-state">
              <i data-lucide="radio" style="width:28px;height:28px;color:var(--text-muted);"></i>
              <span>Kanal bulunamadı</span>
            </div>
          `;
          if (window.lucide) window.lucide.createIcons();
          return;
        }

        channelList.innerHTML = filtered.map(ch => {
          const isActive = ch.id === activeChannel.id;
          const globalIdx = getChannelIndex(ch) + 1;
          return `
            <button class="tv-channel-item ${isActive ? 'active' : ''}" data-id="${ch.id}">
              <span class="tv-ch-num">${String(globalIdx).padStart(2, '0')}</span>
              <img class="tv-ch-logo" src="${ch.logo}" alt="${ch.name}" onerror="this.style.display='none'" />
              <div class="tv-ch-info">
                <span class="tv-ch-name">${ch.name}</span>
                <span class="tv-ch-quality">${ch.quality}</span>
              </div>
              ${isActive ? '<span class="tv-ch-live-indicator"><span class="tv-live-dot"></span></span>' : ''}
            </button>
          `;
        }).join('');

        // Click handlers
        channelList.querySelectorAll('.tv-channel-item').forEach(btn => {
          btn.addEventListener('click', () => {
            const ch = LIVE_TV_CHANNELS.find(c => c.id === btn.dataset.id);
            if (ch && ch.id !== activeChannel.id) loadChannel(ch);
          });
        });

        // Scroll active into view
        const activeEl = channelList.querySelector('.tv-channel-item.active');
        if (activeEl) {
          setTimeout(() => activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
        }

        if (window.lucide) window.lucide.createIcons();
      }

      // ─── Channel Zapping (Up/Down) ───
      function zapChannel(direction) {
        const allChannels = getFilteredChannels();
        if (allChannels.length === 0) return;
        const currentIdx = allChannels.findIndex(c => c.id === activeChannel.id);
        let nextIdx;
        if (direction === 'up') {
          nextIdx = currentIdx <= 0 ? allChannels.length - 1 : currentIdx - 1;
        } else {
          nextIdx = currentIdx >= allChannels.length - 1 ? 0 : currentIdx + 1;
        }
        loadChannel(allChannels[nextIdx]);
      }

      // ─── Event Handlers ───

      // Search
      searchInput.addEventListener('input', e => {
        searchQuery = e.target.value.trim();
        renderChannelList();
      });

      // Category pills
      catStrip.querySelectorAll('.tv-cat-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          catStrip.querySelectorAll('.tv-cat-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          activeCategory = pill.dataset.cat;
          renderChannelList();
        });
      });

      // Retry on error
      retryBtn.addEventListener('click', () => loadChannel(activeChannel));

      // Mute toggle
      muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        videoEl.muted = isMuted;
        muteBtn.innerHTML = isMuted
          ? '<i data-lucide="volume-x" style="width:16px;height:16px;"></i>'
          : '<i data-lucide="volume-2" style="width:16px;height:16px;"></i>';
        if (window.lucide) window.lucide.createIcons();
        showToast(isMuted ? 'Ses kapatıldı' : 'Ses açıldı', 'info');
      });

      // PiP
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

      // Fullscreen
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          screenEl.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });

      // Keyboard remote
      function handleKeyboard(e) {
        // Don't capture if user is typing in search
        if (document.activeElement === searchInput) return;

        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            zapChannel('up');
            break;
          case 'ArrowDown':
            e.preventDefault();
            zapChannel('down');
            break;
          case 'm':
          case 'M':
            muteBtn.click();
            break;
          case 'f':
          case 'F':
            fsBtn.click();
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

      // ─── Initial Load ───
      renderChannelList();
      loadChannel(activeChannel);
      if (window.lucide) window.lucide.createIcons();
    }
  };
}

/* ==========================================================================
   CinePulse Studio - Live TV Cinema Hub (Canlı TV)
   Featuring Sports (beIN Sports, S Sport, TRT Spor, A Spor), National Channels,
   News, and Documentary Live streams with Hls.js hardware playback.
   ========================================================================== */

import { LIVE_TV_CATEGORIES, LIVE_TV_CHANNELS } from '../services/liveTvChannels.js';

export function renderLiveTvView() {
  let activeCategory = 'sports';
  let activeChannel = LIVE_TV_CHANNELS.find(c => c.id === 'ch_bein1') || LIVE_TV_CHANNELS[0];
  let activeHls = null;
  let searchQuery = '';

  const html = `
    <div class="livetv-view container" style="padding-top: 1.5rem; padding-bottom: 3rem;">
      
      <!-- Top Title & Stats Banner -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 class="section-title" style="font-size: 2rem; margin-bottom: 0.3rem; display: flex; align-items: center; gap: 0.75rem;">
            <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 12px #ef4444; animation: pulse 1.5s infinite;"></span>
            <span>Canlı TV & Spor Stüdyosu</span>
          </h1>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            beIN Sports, S Sport, TRT Spor, Ulusal ve Belgesel kanallarını 1080p kesintisiz canlı izleyin.
          </p>
        </div>

        <!-- Live Search Input -->
        <div style="position: relative; width: 100%; max-width: 320px;">
          <i data-lucide="search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--text-muted);"></i>
          <input 
            type="text" 
            id="livetv-search-input" 
            placeholder="Kanal veya spor ara..." 
            style="width: 100%; padding: 0.65rem 1rem 0.65rem 2.5rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: var(--radius-full); color: #fff; font-size: 0.9rem; outline: none;">
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="filter-pill-bar" id="livetv-category-pills" style="margin-bottom: 1.5rem; display: flex; gap: 0.5rem; overflow-x: auto; padding-bottom: 0.5rem;">
        ${LIVE_TV_CATEGORIES.map(cat => `
          <button class="filter-pill ${cat.id === activeCategory ? 'active' : ''}" data-category="${cat.id}" style="border-radius: var(--radius-full); padding: 0.5rem 1.2rem; white-space: nowrap; font-size: 0.88rem; font-weight: 600; cursor: pointer;">
            <i data-lucide="${cat.icon}" style="width: 14px; height: 14px; margin-right: 0.35rem; vertical-align: middle;"></i>
            <span>${cat.name}</span>
          </button>
        `).join('')}
      </div>

      <!-- Main Live TV Cinema Layout (Player on Left/Top, Channels on Right) -->
      <div class="livetv-grid-layout" style="display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem; min-height: 580px;">
        
        <!-- Left: Cinema Player Screen -->
        <div class="livetv-player-pane" style="display: flex; flex-direction: column; background: rgba(10, 14, 22, 0.95); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-xl);">
          
          <!-- Video Frame Container -->
          <div class="livetv-player-screen" id="livetv-player-screen" style="position: relative; width: 100%; aspect-ratio: 16/9; background: #000; display: flex; align-items: center; justify-content: center;">
            <div style="color: var(--text-muted); font-size: 0.95rem;">Yayın yükleniyor...</div>
          </div>

          <!-- Bottom Channel Control Bar -->
          <div class="livetv-control-bar" style="padding: 1.2rem 1.5rem; background: rgba(15, 23, 42, 0.6); border-top: 1px solid rgba(255, 255, 255, 0.06); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <img id="livetv-active-logo" src="${activeChannel.logo}" alt="${activeChannel.name}" style="width: 48px; height: 48px; object-fit: contain; background: rgba(255, 255, 255, 0.06); border-radius: 10px; padding: 6px; border: 1px solid rgba(255, 255, 255, 0.1);" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=100&auto=format&fit=crop&q=60';" />
              <div>
                <h2 id="livetv-active-title" style="font-size: 1.25rem; font-weight: 700; color: #fff; margin: 0 0 0.2rem 0;">${activeChannel.name}</h2>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span id="livetv-active-badge" class="badge badge-primary" style="font-size: 0.72rem;">${activeChannel.badge}</span>
                  <span class="badge" style="font-size: 0.72rem; background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3);">
                    <i data-lucide="activity" style="width: 10px; height: 10px; margin-right: 2px;"></i> CANLI HD
                  </span>
                </div>
              </div>
            </div>

            <!-- Popout / External Action -->
            <div style="display: flex; gap: 0.5rem;">
              <a id="livetv-popout-btn" href="${activeChannel.streamUrl}" target="_blank" class="btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
                <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
                <span>Harici Aç</span>
              </a>
            </div>
          </div>

          <!-- Dolby / Audio Codec Helper Toolbar -->
          <div style="padding: 0.75rem 1.5rem; background: rgba(234, 179, 8, 0.05); border-top: 1px solid rgba(234, 179, 8, 0.15); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; font-size: 0.8rem; color: #fef08a;">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <i data-lucide="volume-2" style="width: 14px; height: 14px; color: #eab308;"></i>
              <span>Ses alamıyorsanız VLC Player veya harici sekmede açabilirsiniz:</span>
            </div>
            <div style="display: flex; gap: 0.4rem;">
              <a id="livetv-vlc-btn" href="vlc://${activeChannel.streamUrl}" class="btn-primary" style="padding: 0.25rem 0.65rem; font-size: 0.74rem; background: #eab308; color: #000; border: none; border-radius: 4px; font-weight: bold; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
                <i data-lucide="play" style="width: 11px; height: 11px;"></i> VLC
              </a>
            </div>
          </div>

        </div>

        <!-- Right: Scrollable Channel Directory -->
        <div class="livetv-channel-list-pane" style="background: rgba(10, 14, 22, 0.9); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-lg); padding: 1rem; display: flex; flex-direction: column; max-height: 680px;">
          
          <div style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: space-between;">
            <span>Kanallar</span>
            <span id="livetv-channel-count" style="font-size: 0.78rem; color: var(--text-muted);"></span>
          </div>

          <!-- Channel List Scroll Area -->
          <div id="livetv-channel-scroll" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; padding-right: 4px;">
          </div>
        </div>

      </div>

    </div>
  `;

  return {
    html,
    init: (container) => {
      if (!container) return;

      const playerScreen = container.querySelector('#livetv-player-screen');
      const channelScroll = container.querySelector('#livetv-channel-scroll');
      const searchInput = container.querySelector('#livetv-search-input');
      const categoryPills = container.querySelectorAll('.filter-pill');
      const activeLogo = container.querySelector('#livetv-active-logo');
      const activeTitle = container.querySelector('#livetv-active-title');
      const activeBadge = container.querySelector('#livetv-active-badge');
      const popoutBtn = container.querySelector('#livetv-popout-btn');
      const vlcBtn = container.querySelector('#livetv-vlc-btn');
      const countLabel = container.querySelector('#livetv-channel-count');

      function getFilteredChannels() {
        return LIVE_TV_CHANNELS.filter(ch => {
          const matchCategory = activeCategory === 'all' || ch.category === activeCategory;
          const matchSearch = !searchQuery || ch.name.toLowerCase().includes(searchQuery.toLowerCase()) || ch.badge.toLowerCase().includes(searchQuery.toLowerCase());
          return matchCategory && matchSearch;
        });
      }

      function loadChannelStream(channel) {
        activeChannel = channel;

        if (activeHls) {
          activeHls.destroy();
          activeHls = null;
        }

        activeLogo.src = channel.logo;
        activeTitle.textContent = channel.name;
        activeBadge.textContent = channel.badge;
        popoutBtn.href = channel.streamUrl;
        vlcBtn.href = `vlc://${channel.streamUrl}`;

        if (channel.isHls) {
          playerScreen.innerHTML = `
            <video 
              id="livetv-hls-video" 
              controls 
              autoplay 
              style="width: 100%; height: 100%; object-fit: contain; background: #000;">
            </video>
          `;

          const videoEl = playerScreen.querySelector('#livetv-hls-video');
          if (window.Hls && window.Hls.isSupported()) {
            const hls = new window.Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90
            });
            activeHls = hls;
            hls.loadSource(channel.streamUrl);
            hls.attachMedia(videoEl);
            hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
              videoEl.play().catch(() => {});
            });
            hls.on(window.Hls.Events.ERROR, (_, data) => {
              if (data.fatal) {
                console.warn('[LiveTV Hls Error]', data);
              }
            });
          } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
            videoEl.src = channel.streamUrl;
            videoEl.play().catch(() => {});
          }
        } else {
          playerScreen.innerHTML = `
            <iframe 
              src="${channel.streamUrl}" 
              style="width: 100%; height: 100%; border: none;" 
              allowfullscreen 
              referrerpolicy="no-referrer">
            </iframe>
          `;
        }

        renderChannelList();
        if (window.lucide) window.lucide.createIcons();
      }

      function renderChannelList() {
        const filtered = getFilteredChannels();
        countLabel.textContent = `${filtered.length} Kanal`;

        if (filtered.length === 0) {
          channelScroll.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
              Bu kategoride kanal bulunamadı.
            </div>
          `;
          return;
        }

        channelScroll.innerHTML = filtered.map(ch => {
          const isActive = ch.id === activeChannel.id;
          return `
            <button class="livetv-channel-btn ${isActive ? 'active' : ''}" data-id="${ch.id}" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0.85rem; border-radius: 10px; background: ${isActive ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)'}; border: 1px solid ${isActive ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.06)'}; text-align: left; cursor: pointer; transition: all 0.2s ease;">
              <img src="${ch.logo}" alt="${ch.name}" style="width: 32px; height: 32px; object-fit: contain; background: rgba(255,255,255,0.06); border-radius: 6px; padding: 3px; flex-shrink: 0;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=80&auto=format&fit=crop&q=60';" />
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 700; font-size: 0.88rem; color: ${isActive ? '#fbbf24' : '#fff'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${ch.name}</div>
                <div style="font-size: 0.72rem; color: var(--text-muted);">${ch.badge}</div>
              </div>
              <span style="width: 6px; height: 6px; border-radius: 50%; background: ${isActive ? '#34d399' : 'rgba(255,255,255,0.2)'}; box-shadow: ${isActive ? '0 0 8px #34d399' : 'none'};"></span>
            </button>
          `;
        }).join('');

        channelScroll.querySelectorAll('.livetv-channel-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const chId = btn.getAttribute('data-id');
            const target = LIVE_TV_CHANNELS.find(c => c.id === chId);
            if (target) loadChannelStream(target);
          });
        });
      }

      // Search Handler
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderChannelList();
      });

      // Category Pill Click Handlers
      categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
          categoryPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          activeCategory = pill.getAttribute('data-category');
          renderChannelList();
        });
      });

      // Initial Load
      renderChannelList();
      loadChannelStream(activeChannel);

      if (window.lucide) window.lucide.createIcons();
    }
  };
}

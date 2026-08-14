/* ==========================================================================
   SineFlix Pro - Video Player Modal Component
   Giant Widescreen Theater Mode Player with Instant-Open Modal Architecture,
   Memory Caching, and Live Reverse-Engineered Stream Sources.
   Features seamless in-place episode switching without modal closure,
   interactive watched status toggles, and live video streaming.
   ========================================================================== */

import { getStreamingServers } from '../services/providerAggregator.js';
import { saveWatchProgress, getMediaProgress, formatSecondsToTime, isMediaWatched, toggleEpisodeWatched, markEpisodeWatched } from '../services/storage.js';
import { showToast } from './Toast.js';

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
  duration = 0
}) {
  const modalContainer = document.getElementById('player-modal');
  if (!modalContainer) return;

  // Intercept Pop-Up Gambling Ads in Parent Window
  if (!originalWindowOpen) originalWindowOpen = window.open;
  window.open = function (url, target, features) {
    if (url && (url.includes('vidmoly') || url.includes('setplay') || url.includes('fastplay') || url.includes('filemoon') || url.includes('bysejikuar') || url.includes('sibnet') || url.includes('hqq') || url.includes('ag2m4') || url.includes('autoembed') || url.includes('vidlink') || url.includes('smashystream') || url.includes('multiembed') || url.includes('vidmixi'))) {
      return originalWindowOpen.call(window, url, target, features);
    }
    console.warn('SineFlix Anti-Ad Shield: Blocked gambling pop-up redirect ->', url);
    showToast('Bahis/Reklam yönlendirmesi engellendi.', 'info');
    return null;
  };

  let currentSeason = Number(season) || 1;
  let currentEpisode = Number(episode) || 1;

  const rawSeries = seriesTitle || title || '';
  const cleanSeriesName = rawSeries
    .replace(/\s*-\s*S\d+E\d+.*$/i, '')
    .replace(/\s*-\s*S\d+.*$/i, '')
    .replace(/\s*-\s*\d+\.\s*Sezon.*$/i, '')
    .replace(/\s*:\s*.*$/, '')
    .replace(/\s*\(\d{4}\).*/, '')
    .trim();

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

  function getDisplayTitle() {
    return type === 'tv'
      ? `${cleanSeriesName} - S${currentSeason}E${currentEpisode}`
      : cleanSeriesName;
  }

  function renderServerPills() {
    if (!activeServers || activeServers.length === 0) {
      return `
        <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.82rem; padding: 0.2rem 0.5rem;">
          <span style="width: 13px; height: 13px; border: 2px solid rgba(245, 158, 11, 0.3); border-top-color: var(--primary); border-radius: 50%; display: inline-block; animation: spin 0.6s linear infinite;"></span>
          <span>Yayın sunucuları hazırlanıyor...</span>
        </div>
      `;
    }

    return activeServers.map((srv, idx) => `
      <button class="server-btn ${idx === currentServerIndex ? 'active' : ''} ${srv.notFound ? 'not-found-pill' : ''}" data-index="${idx}" style="border-radius: var(--radius-full); padding: 0.45rem 1rem;">
        <span style="width: 7px; height: 7px; border-radius: 50%; background: ${srv.notFound ? '#ef4444' : (idx === currentServerIndex ? '#34d399' : '#64748b')}; box-shadow: ${idx === currentServerIndex && !srv.notFound ? '0 0 10px #34d399' : 'none'};"></span>
        <span style="font-weight: 600;">${srv.name}</span>
        <span style="font-size: 0.68rem; font-weight: 700; opacity: 0.9; background: ${srv.notFound ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.12)'}; padding: 0.15rem 0.45rem; border-radius: 4px;">${srv.badge}</span>
      </button>
    `).join('');
  }

  function renderPlayerContent() {
    if (!activeServers || activeServers.length === 0) {
      return `
        <div class="player-loading-overlay" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 480px; background: rgba(8, 11, 18, 0.98); border-radius: 12px; gap: 1.2rem; text-align: center; padding: 2rem; animation: fadeIn 0.2s ease;">
          <div style="position: relative; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: 0; border: 3px solid rgba(245, 158, 11, 0.15); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.75s linear infinite;"></div>
            <i data-lucide="play" style="width: 26px; height: 26px; color: var(--primary); fill: var(--primary);"></i>
          </div>
          <div>
            <h3 style="font-size: 1.4rem; font-weight: 800; color: #f8fafc; margin-bottom: 0.35rem;">${cleanSeriesName}</h3>
            <p style="font-size: 0.95rem; color: #38bdf8; font-weight: 700; margin-bottom: 0.4rem;">
              ${type === 'tv' ? `Sezon ${currentSeason} • Bölüm ${currentEpisode}` : 'Film Yayını'} Başlatılıyor...
            </p>
            <p style="font-size: 0.82rem; color: var(--text-muted); max-width: 420px; margin: 0 auto; line-height: 1.5;">
              Yüksek hızlı Türkiye ve VIP depoları taranıyor, video akış hattı bağlanıyor.
            </p>
          </div>
        </div>
      `;
    }

    const srv = activeServers[currentServerIndex];
    if (!srv || srv.notFound) {
      return `
        <div class="player-not-found-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 2.5rem; background: rgba(11, 15, 25, 0.98); border-radius: 12px;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.35); display: flex; align-items: center; justify-content: center; margin-bottom: 1.3rem;">
            <i data-lucide="video-off" style="width: 36px; height: 36px; color: #ef4444;"></i>
          </div>
          <h3 style="font-size: 1.45rem; font-weight: 700; color: #f8fafc; margin-bottom: 0.6rem;">Dublaj Sunucularda Bu İçerik Bulunamadı</h3>
          <p style="font-size: 0.95rem; color: #94a3b8; max-width: 500px; margin-bottom: 1.6rem; line-height: 1.6;">
            "${seriesTitle || title}" içeriği aktif dublaj sunucularında yer almamaktadır.
          </p>
          <button id="btn-switch-subtitled-fallback" class="btn-primary" style="padding: 0.75rem 1.8rem; font-size: 0.95rem; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 8px; font-weight: 600; cursor: pointer;">
            <span>💬 Türkçe Altyazılı Sunuculara Geç (1080p Full HD)</span>
            <i data-lucide="arrow-right" style="margin-left: 0.4rem;"></i>
          </button>
        </div>
      `;
    }

    if (srv.isDirectVideo || srv.isHls || (srv.streamUrl && (srv.streamUrl.includes('.m3u8') || srv.streamUrl.includes('.mp4') || srv.streamUrl.includes('.mkv')))) {
      const streamUrl = srv.streamUrl || srv.getUrl();
      const warningBanner = `
        <div class="player-audio-warning" style="margin-top: 10px; padding: 10px 14px; background: rgba(234, 179, 8, 0.08); border: 1px solid rgba(234, 179, 8, 0.25); border-radius: 8px; color: #fef08a; display: flex; flex-direction: column; gap: 6px; text-align: left; animation: fadeIn 0.4s ease;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px;">
            <div style="display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.88rem;">
              <i data-lucide="volume-2" style="width: 16px; height: 16px; color: #eab308;"></i>
              <span>Ses Gelmiyor mu? (Tarayıcı Dolby AC3 / Ses Formatı)</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <a href="vlc://${streamUrl}" class="btn-primary" style="padding: 0.3rem 0.75rem; font-size: 0.75rem; background: #eab308; color: #000; border: none; border-radius: 4px; font-weight: bold; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; cursor: pointer;">
                <i data-lucide="play" style="width: 12px; height: 12px;"></i> VLC ile Aç
              </a>
              <a href="${streamUrl}" target="_blank" download class="btn-secondary" style="padding: 0.3rem 0.75rem; font-size: 0.75rem; border-color: rgba(255,255,255,0.2); color: #fff; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; cursor: pointer;">
                <i data-lucide="download" style="width: 12px; height: 12px;"></i> İndir
              </a>
            </div>
          </div>
          <p style="margin: 0; color: #94a3b8; font-size: 0.76rem; line-height: 1.3;">
            Bazı yayınlar yüksek kaliteli Dolby (AC-3/DTS) çok kanallı ses barındırır. Tarayıcınızda ses çıkmazsa videoyu <strong>VLC Player</strong> ile açabilir veya diğer sunucu seçeneklerini deneyebilirsiniz.
          </p>
        </div>
      `;
      return `
        <div style="display: flex; flex-direction: column; height: 100%; width: 100%;">
          <div style="flex: 1; min-height: 0; position: relative;">
            <video 
              id="hls-video-player" 
              controls 
              autoplay 
              style="width: 100%; height: 100%; object-fit: contain; background: #000; border-radius: 8px;">
            </video>
          </div>
          ${warningBanner}
        </div>
      `;
    }

    return `
      <iframe 
        id="video-iframe" 
        src="${srv.getUrl()}" 
        allowfullscreen 
        referrerpolicy="no-referrer-when-downgrade"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture; accelerometer; gyroscope; clipboard-write; payment">
      </iframe>
    `;
  }

  function renderFooterNavButtonsHTML() {
    if (type !== 'tv') return '';
    return `
      ${currentEpisode > 1 ? `
        <button id="btn-prev-episode" class="btn-secondary" style="padding: 0.45rem 1.1rem; font-size: 0.85rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
          <i data-lucide="chevron-left" style="width: 14px; height: 14px;"></i>
          <span>Önceki Bölüm (B${currentEpisode - 1})</span>
        </button>
      ` : ''}

      <button id="btn-next-episode" class="btn-primary" style="padding: 0.45rem 1.3rem; font-size: 0.85rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
        <span>Sonraki Bölüm (B${currentEpisode + 1})</span>
        <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
      </button>
    `;
  }

  // 1. INSTANT MODAL OPEN (0ms)
  modalContainer.innerHTML = `
    <div class="modal-content player-modal-content" style="background: #000; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: var(--radius-lg); box-shadow: 0 30px 90px rgba(0, 0, 0, 0.98); overflow: hidden; display: flex; flex-direction: column;">
      
      <!-- Minimalist Cinema Player Bar -->
      <div class="player-cinema-bar" style="display: flex; align-items: center; justify-content: space-between; padding: 0.8rem 1.5rem; background: rgba(10, 14, 22, 0.96); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); flex-wrap: wrap; gap: 0.8rem; z-index: 10;">
        
        <!-- Left: Title -->
        <div style="display: flex; align-items: center; gap: 0.75rem; min-width: 0;">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <i data-lucide="play" style="width: 14px; height: 14px; color: var(--primary); fill: var(--primary);"></i>
          </div>
          <span id="player-modal-title" style="font-weight: 700; font-size: 1.05rem; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 320px;">${getDisplayTitle()}</span>
          ${initialTime > 5 ? `
            <span id="player-resume-time-badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.3rem; flex-shrink: 0;">
              <i data-lucide="clock" style="width: 12px; height: 12px;"></i>
              <span>Kaldığın Dakika: ${formatSecondsToTime(initialTime)}</span>
            </span>
          ` : ''}
        </div>

        <!-- Center: Dubbed / Subtitled Segmented Toggle -->
        <div style="display: flex; background: rgba(255, 255, 255, 0.05); padding: 0.25rem; border-radius: var(--radius-full); border: 1px solid rgba(255, 255, 255, 0.08);">
          <button id="tab-dubbed" class="cinema-tab-btn ${currentCategory === 'dubbed' ? 'active' : ''}">
            🇹🇷 Dublaj
          </button>
          <button id="tab-subtitled" class="cinema-tab-btn ${currentCategory === 'subtitled' ? 'active' : ''}">
            💬 Altyazılı
          </button>
        </div>

        <!-- Right: Actions & Close -->
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <a id="player-popout-btn" href="#" target="_blank" class="btn-action-icon" title="Harici Pencerede Aç" style="width: 34px; height: 34px; border-radius: 8px;">
            <i data-lucide="external-link" style="width:15px; height:15px"></i>
          </a>

          <button id="player-close-btn" class="btn-action-icon" title="Kapat" style="width: 34px; height: 34px; border-radius: 8px; background: rgba(239, 68, 68, 0.15); color: #ef4444; border-color: rgba(239, 68, 68, 0.3);">
            <i data-lucide="x" style="width: 18px; height: 18px;"></i>
          </button>
        </div>
      </div>

      <!-- Server Pills Strip -->
      <div class="server-toolbar" id="player-server-toolbar" style="padding: 0.5rem 1.5rem; background: rgba(6, 8, 14, 0.98); border-bottom: 1px solid rgba(255, 255, 255, 0.06); gap: 0.5rem;">
        ${renderServerPills()}
      </div>

      <!-- Player Frame Container -->
      <div class="player-iframe-container" id="player-iframe-wrapper">
        ${renderPlayerContent()}
      </div>

      <!-- Footer Controls -->
      <div class="player-footer-bar" style="background: rgba(10, 14, 22, 0.96); padding: 0.7rem 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.8rem;">
        
        <!-- Left: Status & Watched & Halfway Toggle -->
        <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
          <button id="btn-toggle-watched-player" class="btn-secondary" style="padding: 0.4rem 0.9rem; font-size: 0.82rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer; ${isWatched ? 'background: rgba(16, 185, 129, 0.2); border-color: #10b981; color: #10b981; font-weight: 700;' : ''}">
            <i data-lucide="${isWatched ? 'check-circle-2' : 'check'}" style="width: 14px; height: 14px;"></i>
            <span>${isWatched ? 'İzlendi' : 'İzlendi Olarak İşaretle'}</span>
          </button>

          <button id="btn-halfway-player" class="btn-secondary" title="Kaldığım Yeri Kaydet" style="padding: 0.4rem 0.9rem; font-size: 0.82rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
            <i data-lucide="clock" style="width: 13px; height: 13px; color: #fbbf24;"></i>
            <span>⏳ Yarıda Bırak</span>
          </button>

          <span style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem;">
            <i data-lucide="shield-check" style="width: 14px; height: 14px; color: var(--secondary);"></i> Canlı akış sunucu ağı bağlantısı aktif.
          </span>
        </div>

        <!-- Right: Prev / Next Navigation for Series & Anime -->
        <div id="player-nav-btn-group" style="display: flex; align-items: center; gap: 0.5rem;">
          ${renderFooterNavButtonsHTML()}
        </div>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (window.lucide) window.lucide.createIcons();

  function attachFooterNavEvents() {
    const prevEpBtn = document.getElementById('btn-prev-episode');
    if (prevEpBtn) {
      prevEpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentEpisode > 1) {
          switchEpisodeInPlayer(currentSeason, currentEpisode - 1);
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
        switchEpisodeInPlayer(currentSeason, currentEpisode + 1);
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

    const switchSubBtn = document.getElementById('btn-switch-subtitled-fallback');
    if (switchSubBtn) {
      switchSubBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentCategory = 'subtitled';
        activeServers = categorizedServers['subtitled'] || [];
        currentServerIndex = 0;
        document.getElementById('tab-dubbed')?.classList.remove('active');
        document.getElementById('tab-subtitled')?.classList.add('active');
        updateServerPillsEvents();
        updatePlayerContainer();
      });
    }

    if (srv && (srv.isDirectVideo || srv.isHls || (srv.streamUrl && (srv.streamUrl.includes('.m3u8') || srv.streamUrl.includes('.mp4') || srv.streamUrl.includes('.mkv'))))) {
      initHlsPlayer(srv.streamUrl || srv.getUrl());
    }
  }

  function initHlsPlayer(streamUrl) {
    if (activeHlsInstance) {
      activeHlsInstance.destroy();
      activeHlsInstance = null;
    }

    const video = document.getElementById('hls-video-player');
    if (!video) return;

    video.addEventListener('timeupdate', () => {
      if (video.currentTime > 0) {
        simulatedCurrentTime = Math.round(video.currentTime);
        saveWatchProgress({
          id: tmdbId,
          title: cleanSeriesName,
          posterPath,
          backdropPath,
          type,
          season: currentSeason,
          episode: currentEpisode,
          currentTime: Math.round(video.currentTime),
          duration: Math.round(video.duration || estimatedDuration)
        });
      }
    });

    const srv = activeServers[currentServerIndex];
    const isHlsStream = streamUrl.includes('.m3u8') || streamUrl.includes('master.txt') || (srv && srv.isHls);

    if (isHlsStream) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        if (initialTime > 5) video.currentTime = initialTime;
        video.play().catch(() => {});
      } else {
        const attachHls = () => {
          if (window.Hls && window.Hls.isSupported()) {
            const hlsConfig = {
              startPosition: initialTime > 5 ? Math.round(initialTime) : -1,
              enableWorker: true,
              lowLatencyMode: true
            };
            const hls = new window.Hls(hlsConfig);
            activeHlsInstance = hls;
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
              if (initialTime > 5) {
                const timeFormatted = formatSecondsToTime(initialTime);
                showToast(`Kaldığınız ${timeFormatted} dakikasından devam ediliyor...`, 'info');
              }
              video.play().catch(() => {});
            });
            hls.on(window.Hls.Events.ERROR, (event, data) => {
              if (data.fatal) {
                switch (data.type) {
                  case window.Hls.ErrorTypes.NETWORK_ERROR:
                    hls.startLoad();
                    break;
                  case window.Hls.ErrorTypes.MEDIA_ERROR:
                    hls.recoverMediaError();
                    break;
                  default:
                    hls.destroy();
                    break;
                }
              }
            });
          }
        };

        if (window.Hls) {
          attachHls();
        } else {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
          script.onload = attachHls;
          document.head.appendChild(script);
        }
      }
    } else {
      video.src = streamUrl;
      if (initialTime > 5) video.currentTime = initialTime;
      video.play().catch(() => {});
    }
  }

  async function switchEpisodeInPlayer(newSeason, newEpisode) {
    if (isSwitchingEpisode) return;
    isSwitchingEpisode = true;

    const prevBtn = document.getElementById('btn-prev-episode');
    const nextBtn = document.getElementById('btn-next-episode');
    if (prevBtn) {
      prevBtn.disabled = true;
      prevBtn.style.opacity = '0.6';
    }
    if (nextBtn) {
      nextBtn.disabled = true;
      nextBtn.style.opacity = '0.6';
      if (newEpisode > currentEpisode) {
        nextBtn.innerHTML = `
          <span style="width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; display: inline-block; animation: spin 0.6s linear infinite;"></span>
          <span>Bölüm ${newEpisode} Yükleniyor...</span>
        `;
      }
    }

    if (activeHlsInstance) {
      activeHlsInstance.destroy();
      activeHlsInstance = null;
    }
    clearInterval(activeProgressInterval);

    currentSeason = newSeason;
    currentEpisode = newEpisode;

    const titleEl = document.getElementById('player-modal-title');
    if (titleEl) titleEl.textContent = getDisplayTitle();

    const timeBadge = document.getElementById('player-resume-time-badge');
    if (timeBadge) timeBadge.style.display = 'none';

    // Show loading skeleton inside player
    activeServers = [];
    updateServerPillsEvents();
    updatePlayerContainer();

    // Fetch new episode
    categorizedServers = await getStreamingServers({
      type,
      tmdbId,
      title: cleanSeriesName,
      seriesTitle: cleanSeriesName,
      originalTitle,
      season: currentSeason,
      episode: currentEpisode
    });

    if ((!categorizedServers.dubbed || categorizedServers.dubbed.length === 0 || categorizedServers.dubbed[0]?.notFound) && categorizedServers.subtitled && categorizedServers.subtitled.length > 0 && !categorizedServers.subtitled[0]?.notFound) {
      currentCategory = 'subtitled';
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
      if (span) span.textContent = isWatched ? 'İzlendi' : 'İzlendi Olarak İşaretle';
      if (icon) icon.setAttribute('data-lucide', isWatched ? 'check-circle-2' : 'check');
      if (isWatched) {
        toggleWatchedPlayerBtn.style.background = 'rgba(16, 185, 129, 0.2)';
        toggleWatchedPlayerBtn.style.borderColor = '#10b981';
        toggleWatchedPlayerBtn.style.color = '#10b981';
      } else {
        toggleWatchedPlayerBtn.style.background = '';
        toggleWatchedPlayerBtn.style.borderColor = '';
        toggleWatchedPlayerBtn.style.color = '';
      }
    }

    const navGroup = document.getElementById('player-nav-btn-group');
    if (navGroup) {
      navGroup.innerHTML = renderFooterNavButtonsHTML();
      attachFooterNavEvents();
    }

    simulatedCurrentTime = initialTime;
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

  // 2. Tab switcher (Dubbed vs Subtitled)
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

  // Close modal handler
  const closeBtn = document.getElementById('player-close-btn');
  const closeModal = () => {
    if (activeHlsInstance) {
      activeHlsInstance.destroy();
      activeHlsInstance = null;
    }
    clearInterval(activeProgressInterval);
    if (originalWindowOpen) window.open = originalWindowOpen;
    modalContainer.classList.add('hidden');
    modalContainer.innerHTML = '';
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();
  });

  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  // Watched button toggle
  const toggleWatchedPlayerBtn = document.getElementById('btn-toggle-watched-player');
  if (toggleWatchedPlayerBtn) {
    toggleWatchedPlayerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const updated = toggleEpisodeWatched(tmdbId, currentSeason, currentEpisode, {
        title: cleanSeriesName,
        posterPath,
        backdropPath,
        type,
        duration: estimatedDuration
      });
      isWatched = updated.completed;
      showToast(isWatched ? '✓ İzlendi olarak işaretlendi!' : 'İzlendi işareti kaldırıldı.', isWatched ? 'success' : 'info');
      
      const span = toggleWatchedPlayerBtn.querySelector('span');
      const icon = toggleWatchedPlayerBtn.querySelector('i');
      if (span) span.textContent = isWatched ? 'İzlendi' : 'İzlendi Olarak İşaretle';
      if (icon) icon.setAttribute('data-lucide', isWatched ? 'check-circle-2' : 'check');
      if (isWatched) {
        toggleWatchedPlayerBtn.style.background = 'rgba(16, 185, 129, 0.2)';
        toggleWatchedPlayerBtn.style.borderColor = '#10b981';
        toggleWatchedPlayerBtn.style.color = '#10b981';
      } else {
        toggleWatchedPlayerBtn.style.background = '';
        toggleWatchedPlayerBtn.style.borderColor = '';
        toggleWatchedPlayerBtn.style.color = '';
      }
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Halfway button toggle
  const halfwayPlayerBtn = document.getElementById('btn-halfway-player');
  if (halfwayPlayerBtn) {
    halfwayPlayerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentSec = simulatedCurrentTime > 5 ? simulatedCurrentTime : Math.round(estimatedDuration * 0.5);
      saveWatchProgress({
        id: tmdbId,
        title: cleanSeriesName,
        posterPath,
        backdropPath,
        type,
        season: currentSeason,
        episode: currentEpisode,
        currentTime: currentSec,
        duration: estimatedDuration,
        completed: false
      });
      showToast(`⏳ ${formatSecondsToTime(currentSec)} dakikasında yarıda bırakıldı kaydedildi!`, 'info');
    });
  }

  // 3. ASYNC BACKGROUND STREAM RESOLUTION (Non-blocking)
  getStreamingServers({
    type,
    tmdbId,
    title: cleanSeriesName,
    seriesTitle: cleanSeriesName,
    originalTitle,
    season: currentSeason,
    episode: currentEpisode
  }).then(resolved => {
    categorizedServers = resolved;
    if ((!categorizedServers.dubbed || categorizedServers.dubbed.length === 0 || categorizedServers.dubbed[0]?.notFound) && categorizedServers.subtitled && categorizedServers.subtitled.length > 0 && !categorizedServers.subtitled[0]?.notFound) {
      currentCategory = 'subtitled';
      document.getElementById('tab-dubbed')?.classList.remove('active');
      document.getElementById('tab-subtitled')?.classList.add('active');
    }
    activeServers = categorizedServers[currentCategory] || [];
    currentServerIndex = 0;

    updateServerPillsEvents();
    updatePlayerContainer();

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
  });
}

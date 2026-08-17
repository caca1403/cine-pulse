/* ==========================================================================
   CinePulse Studio - Video Player Modal Component
   Giant Widescreen Theater Mode Player with Instant-Open Modal Architecture,
   Memory Caching, and Live Reverse-Engineered Stream Sources.
   Features seamless in-place episode switching, smart next/prev season detection,
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
  duration = 0,
  seasonsList = [],
  maxEpisodes = 0
}) {
  const modalContainer = document.getElementById('player-modal');
  if (!modalContainer) return;

  // Intercept Pop-Up Gambling Ads in Parent Window
  if (!originalWindowOpen) originalWindowOpen = window.open;
  window.open = function (url, target, features) {
    if (url && (url.includes('vidmoly') || url.includes('setplay') || url.includes('fastplay') || url.includes('filemoon') || url.includes('bysejikuar') || url.includes('sibnet') || url.includes('hqq') || url.includes('ag2m4') || url.includes('autoembed') || url.includes('vidlink') || url.includes('smashystream') || url.includes('multiembed') || url.includes('vidmixi') || url.includes('filmmakinesi') || url.includes('rapidrame') || url.includes('playmix'))) {
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

  const rawSeries = seriesTitle || title || '';
  const cleanSeriesName = rawSeries
    .replace(/\s*-\s*S\d+E\d+.*$/i, '')
    .replace(/\s*-\s*S\d+.*$/i, '')
    .replace(/\s*-\s*\d+\.\s*Sezon.*$/i, '')
    .replace(/\s*:\s*.*$/, '')
    .replace(/\s*\(\d{4}\).*/, '')
    .trim();

  // If seasonsList is empty and it's a TV show with tmdbId, attempt fast async fetch of season info
  if (type === 'tv' && tmdbId && currentSeasonsList.length === 0) {
    fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=tr-TR`)
      .then(res => res.json())
      .then(data => {
        if (data && data.seasons) {
          currentSeasonsList = data.seasons.filter(s => s.season_number > 0);
          updateNavButtons();
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
    return 0; // Unknown
  }

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
      <button class="server-btn ${idx === currentServerIndex ? 'active' : ''} ${srv.notFound ? 'not-found-pill' : ''}" data-index="${idx}">
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

    const finalIframeUrl = (srv.getUrl() || '').replace(/play\.liderfilm\.[a-z]+/i, 'x.ag2m4.cfd');
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
    
    // Determine whether next episode exists
    let nextBtnHTML = '';
    if (currentSeasonEpCount > 0 && currentEpisode < currentSeasonEpCount) {
      nextBtnHTML = `
        <button id="btn-next-episode" class="btn-primary" data-action="next-ep" style="padding: 0.45rem 1.2rem; font-size: 0.85rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
          <span>Sonraki Bölüm (B${currentEpisode + 1})</span>
          <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
        </button>
      `;
    } else if (currentSeasonEpCount > 0 && currentEpisode >= currentSeasonEpCount && hasNextSeason) {
      nextBtnHTML = `
        <button id="btn-next-episode" class="btn-primary" data-action="next-season" style="padding: 0.45rem 1.2rem; font-size: 0.85rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer; background: linear-gradient(135deg, #10b981, #059669);">
          <span>Sonraki Sezon (S${currentSeason + 1} B1)</span>
          <i data-lucide="fast-forward" style="width: 14px; height: 14px;"></i>
        </button>
      `;
    } else if (currentSeasonEpCount > 0 && currentEpisode >= currentSeasonEpCount && !hasNextSeason) {
      nextBtnHTML = `
        <span style="padding: 0.45rem 1rem; font-size: 0.82rem; border-radius: var(--radius-full); background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); color: #10b981; font-weight: 700; display: inline-flex; align-items: center; gap: 0.35rem;">
          <i data-lucide="check-check" style="width: 14px; height: 14px;"></i>
          <span>Son Bölüm (Dizi Tamamlandı)</span>
        </span>
      `;
    } else {
      // If episode count is unknown, still allow next episode
      nextBtnHTML = `
        <button id="btn-next-episode" class="btn-primary" data-action="next-ep" style="padding: 0.45rem 1.2rem; font-size: 0.85rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
          <span>Sonraki Bölüm (B${currentEpisode + 1})</span>
          <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
        </button>
      `;
    }

    let prevBtnHTML = '';
    if (currentEpisode > 1) {
      prevBtnHTML = `
        <button id="btn-prev-episode" class="btn-secondary" data-action="prev-ep" style="padding: 0.45rem 1.1rem; font-size: 0.85rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
          <i data-lucide="chevron-left" style="width: 14px; height: 14px;"></i>
          <span>Önceki Bölüm (B${currentEpisode - 1})</span>
        </button>
      `;
    } else if (currentSeason > 1) {
      const prevSeasonCount = getSeasonEpisodeCount(currentSeason - 1) || 1;
      prevBtnHTML = `
        <button id="btn-prev-episode" class="btn-secondary" data-action="prev-season" data-prev-season="${currentSeason - 1}" data-prev-ep="${prevSeasonCount}" style="padding: 0.45rem 1.1rem; font-size: 0.85rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
          <i data-lucide="rewind" style="width: 14px; height: 14px;"></i>
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

  // 1. INSTANT MODAL OPEN (0ms)
  modalContainer.innerHTML = `
    <div class="modal-content player-modal-content">
      
      <!-- Cinema Player Bar -->
      <div class="player-cinema-bar">
        
        <!-- Left: Title -->
        <div class="player-header-left">
          <div class="player-header-icon">
            <i data-lucide="play" style="width: 13px; height: 13px; color: var(--primary); fill: var(--primary);"></i>
          </div>
          <span id="player-modal-title" class="player-header-title">${getDisplayTitle()}</span>
          ${initialTime > 5 ? `
            <span id="player-resume-time-badge" class="player-header-badge">
              <i data-lucide="clock" style="width: 11px; height: 11px;"></i>
              <span>${formatSecondsToTime(initialTime)}</span>
            </span>
          ` : ''}
        </div>

        <!-- Center: Dubbed / Subtitled Segmented Toggle -->
        <div class="player-header-toggle">
          <button id="tab-dubbed" class="cinema-tab-btn ${currentCategory === 'dubbed' ? 'active' : ''}">
            🇹🇷 Dublaj
          </button>
          <button id="tab-subtitled" class="cinema-tab-btn ${currentCategory === 'subtitled' ? 'active' : ''}">
            💬 Altyazılı
          </button>
        </div>

        <!-- Right: Actions & Close -->
        <div class="player-header-right">
          <a id="player-popout-btn" href="#" target="_blank" class="btn-action-icon" title="Harici Pencerede Aç">
            <i data-lucide="external-link" style="width:14px; height:14px"></i>
          </a>

          <button id="player-close-btn" class="btn-action-icon btn-player-close" title="Kapat">
            <i data-lucide="x" style="width: 17px; height: 17px;"></i>
          </button>
        </div>
      </div>

      <!-- Server Pills Strip -->
      <div class="server-toolbar" id="player-server-toolbar">
        ${renderServerPills()}
      </div>

      <!-- Player Frame Container -->
      <div class="player-iframe-container" id="player-iframe-wrapper">
        ${renderPlayerContent()}
      </div>

      <!-- Footer Controls -->
      <div class="player-footer-bar">
        
        <!-- Left: Status & Watched & Halfway Toggle -->
        <div class="player-footer-left">
          <button id="btn-toggle-watched-player" class="btn-secondary btn-footer-action ${isWatched ? 'watched-active' : ''}">
            <i data-lucide="${isWatched ? 'check-circle-2' : 'check'}" style="width: 14px; height: 14px;"></i>
            <span>${isWatched ? 'İzlendi' : 'İzlendi Olarak İşaretle'}</span>
          </button>

          <button id="btn-halfway-player" class="btn-secondary btn-footer-action" title="Kaldığım Yeri Kaydet">
            <i data-lucide="clock" style="width: 13px; height: 13px; color: #fbbf24;"></i>
            <span>⏳ Yarıda Bırak</span>
          </button>

          <span class="player-status-indicator">
            <i data-lucide="shield-check" style="width: 13px; height: 13px; color: var(--secondary);"></i> Canlı akış aktif.
          </span>
        </div>

        <!-- Right: Prev / Next Navigation for Series & Anime -->
        <div id="player-nav-btn-group" class="player-footer-right">
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
        const tabSub = document.getElementById('tab-subtitled');
        if (tabSub) tabSub.click();
      });
    }

    if (srv?.isDirectVideo || srv?.isHls || (srv?.streamUrl && (srv.streamUrl.includes('.m3u8') || srv.streamUrl.includes('.mp4') || srv.streamUrl.includes('.mkv')))) {
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

  // Initial Fetch of Servers concurrently
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
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 480px; background: rgba(8, 11, 18, 0.98); border-radius: 12px; gap: 1.2rem; text-align: center; padding: 2rem;">
          <div style="width: 52px; height: 52px; border: 3px solid rgba(245, 158, 11, 0.2); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.6s linear infinite;"></div>
          <p style="font-size: 1.1rem; color: #fff; font-weight: 700;">Sezon ${currentSeason} • Bölüm ${currentEpisode} Yükleniyor...</p>
        </div>
      `;
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
        toggleWatchedPlayerBtn.classList.add('watched-active');
      } else {
        toggleWatchedPlayerBtn.classList.remove('watched-active');
      }
    }

    updateNavButtons();

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

  // Dubbed / Subtitled Tabs
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
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalContainer.onclick = (e) => {
    if (e.target === modalContainer) closeModal();
  };

  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleKeydown);
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

      isWatched = updated.completed;
      const span = toggleWatchedBtn.querySelector('span');
      const icon = toggleWatchedBtn.querySelector('i');
      if (span) span.textContent = isWatched ? 'İzlendi' : 'İzlendi Olarak İşaretle';
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

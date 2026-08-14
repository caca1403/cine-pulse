/* ==========================================================================
   SineFlix Pro - Video Player Modal Component
   Giant Widescreen Theater Mode Player with Live Reverse-Engineered
   SezonlukDizi, Dizipal & Sinewix Android API Sources.
   ========================================================================== */

import { getStreamingServers } from '../services/providerAggregator.js';
import { saveWatchProgress, getMediaProgress, formatSecondsToTime } from '../services/storage.js';
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
  currentTime = 0
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

  const rawSeries = seriesTitle || title || '';
  const cleanSeriesName = rawSeries
    .replace(/\s*-\s*S\d+E\d+.*$/i, '')
    .replace(/\s*-\s*S\d+.*$/i, '')
    .replace(/\s*-\s*\d+\.\s*Sezon.*$/i, '')
    .replace(/\s*:\s*.*$/, '')
    .replace(/\s*\(\d{4}\).*/, '')
    .trim();

  const displayTitle = type === 'tv' 
    ? `${cleanSeriesName} - S${season}E${episode}`
    : cleanSeriesName;

  showToast(
    type === 'movie'
      ? 'Yüksek hızlı film depoları taranıyor...'
      : 'Yüksek hızlı dizi kaynakları taranıyor...',
    'info'
  );

  const categorizedServers = await getStreamingServers({ 
    type, 
    tmdbId, 
    title: cleanSeriesName, 
    seriesTitle: cleanSeriesName, 
    originalTitle, 
    season, 
    episode 
  });
  
  let currentCategory = 'dubbed'; // Default to Türkçe Dublaj
  if ((!categorizedServers.dubbed || categorizedServers.dubbed.length === 0 || categorizedServers.dubbed[0]?.notFound) && categorizedServers.subtitled && categorizedServers.subtitled.length > 0 && !categorizedServers.subtitled[0]?.notFound) {
    currentCategory = 'subtitled';
  }
  let activeServers = categorizedServers[currentCategory] || [];
  let currentServerIndex = 0;

  const existingRecord = getMediaProgress(tmdbId, season, episode);
  let initialTime = currentTime || (existingRecord ? existingRecord.currentTime : 0);

  function renderServerPills() {
    return activeServers.map((srv, idx) => `
      <button class="server-btn ${idx === currentServerIndex ? 'active' : ''} ${srv.notFound ? 'not-found-pill' : ''}" data-index="${idx}" style="border-radius: var(--radius-full); padding: 0.45rem 1rem;">
        <span style="width: 7px; height: 7px; border-radius: 50%; background: ${srv.notFound ? '#ef4444' : (idx === currentServerIndex ? '#34d399' : '#64748b')}; box-shadow: ${idx === currentServerIndex && !srv.notFound ? '0 0 10px #34d399' : 'none'};"></span>
        <span style="font-weight: 600;">${srv.name}</span>
        <span style="font-size: 0.68rem; font-weight: 700; opacity: 0.9; background: ${srv.notFound ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.12)'}; padding: 0.15rem 0.45rem; border-radius: 4px;">${srv.badge}</span>
      </button>
    `).join('');
  }

  function renderPlayerContent() {
    const srv = activeServers[currentServerIndex];
    if (srv.notFound) {
      return `
        <div class="player-not-found-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 2.5rem; background: rgba(11, 15, 25, 0.98); border-radius: 12px;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.35); display: flex; align-items: center; justify-content: center; margin-bottom: 1.3rem;">
            <i data-lucide="video-off" style="width: 36px; height: 36px; color: #ef4444;"></i>
          </div>
          <h3 style="font-size: 1.45rem; font-weight: 700; color: #f8fafc; margin-bottom: 0.6rem;">Dublaj Sunucularda Bu İçerik Bulunamadı</h3>
          <p style="font-size: 0.95rem; color: #94a3b8; max-width: 500px; margin-bottom: 1.6rem; line-height: 1.6;">
            "${seriesTitle || title}" içeriği aktif dublaj sunucularında yer almamaktadır veya kaldırılmıştır.
          </p>
          <button id="btn-switch-subtitled-fallback" class="btn-primary" style="padding: 0.75rem 1.8rem; font-size: 0.95rem; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 8px; font-weight: 600; cursor: pointer;">
            <span>💬 Türkçe Altyazılı Sunuculara Geç (1080p Full HD)</span>
            <i data-lucide="arrow-right" style="margin-left: 0.4rem;"></i>
          </button>
        </div>
      `;
    }

    if (srv.isExternalPopout) {
      return `
        <div class="player-popout-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 2.5rem; background: radial-gradient(circle at center, rgba(30, 41, 59, 0.6) 0%, rgba(10, 14, 22, 0.98) 100%); border-radius: 12px;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.2)); border: 2px solid rgba(245, 158, 11, 0.5); display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem; box-shadow: 0 0 30px rgba(245, 158, 11, 0.2);">
            <i data-lucide="external-link" style="width: 40px; height: 40px; color: var(--primary);"></i>
          </div>
          <h3 style="font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 0.8rem; letter-spacing: -0.5px;">Pichive 1080p Ultra HD Oynatıcı</h3>
          <p style="font-size: 0.95rem; color: #94a3b8; max-width: 520px; margin-bottom: 1.8rem; line-height: 1.6;">
            Pichive sunucusu harici koruma kullandığı için videonuz <strong>tam ekran yeni sekmede</strong> açılır. İzleme durumunuz ve kaldığınız yer sitemize otomatik kaydedilmeye devam eder.
          </p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
            <a href="${srv.getUrl()}" target="_blank" rel="noreferrer" id="btn-open-pichive-tab" class="btn-primary" style="padding: 0.9rem 2.2rem; font-size: 1rem; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 10px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 10px 25px rgba(245, 158, 11, 0.35); cursor: pointer;">
              <i data-lucide="play" style="width: 18px; height: 18px; fill: #000; color: #000;"></i>
              <span style="color: #000;">Pichive Oynatıcıyı Yeni Sekmede Başlat</span>
            </a>
          </div>
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

  modalContainer.innerHTML = `
    <div class="modal-content player-modal-content" style="background: #000; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: var(--radius-lg); box-shadow: 0 30px 90px rgba(0, 0, 0, 0.98); overflow: hidden; display: flex; flex-direction: column;">
      
      <!-- Minimalist Cinema Player Bar -->
      <div class="player-cinema-bar" style="display: flex; align-items: center; justify-content: space-between; padding: 0.8rem 1.5rem; background: rgba(10, 14, 22, 0.96); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); flex-wrap: wrap; gap: 0.8rem; z-index: 10;">
        
        <!-- Left: Title -->
        <div style="display: flex; align-items: center; gap: 0.75rem; min-width: 0;">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <i data-lucide="play" style="width: 14px; height: 14px; color: var(--primary); fill: var(--primary);"></i>
          </div>
          <span style="font-weight: 700; font-size: 1.05rem; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 320px;">${displayTitle}</span>
          ${initialTime > 5 ? `
            <span style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.3rem; flex-shrink: 0;">
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
          <a id="player-popout-btn" href="${activeServers[currentServerIndex].streamUrl || activeServers[currentServerIndex].getUrl() || '#'}" target="_blank" class="btn-action-icon" title="Harici Pencerede Aç" style="width: 34px; height: 34px; border-radius: 8px;">
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

      <!-- Footer Controls (Next episode / Status) -->
      <div class="player-footer-bar" style="background: rgba(10, 14, 22, 0.96); padding: 0.7rem 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem;">
          <i data-lucide="shield-check" style="width: 14px; height: 14px; color: var(--secondary);"></i> Canlı akış sunucu ağı bağlantısı aktif.
        </span>

        ${type === 'tv' ? `
          <button id="btn-next-episode" class="btn-primary" style="padding: 0.45rem 1.3rem; font-size: 0.85rem; border-radius: var(--radius-full);">
            <span>Sonraki Bölüm</span>
            <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
          </button>
        ` : ''}
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (window.lucide) window.lucide.createIcons();

  function initHlsPlayer(streamUrl) {
    if (activeHlsInstance) {
      activeHlsInstance.destroy();
      activeHlsInstance = null;
    }

    const video = document.getElementById('hls-video-player');
    if (!video) return;

    video.removeAttribute('src');

    let hasSeeked = false;
    const applyNativeSeek = () => {
      if (!hasSeeked && initialTime > 5 && video.duration && initialTime < (video.duration - 10)) {
        hasSeeked = true;
        try {
          video.currentTime = initialTime;
          const timeFormatted = formatSecondsToTime(initialTime);
          showToast(`Kaldığınız ${timeFormatted} dakikasından devam ediliyor...`, 'info');
        } catch (err) {
          console.warn('Seek error:', err);
        }
      }
    };

    video.addEventListener('playing', applyNativeSeek, { once: true });

    video.addEventListener('timeupdate', () => {
      if (video.currentTime > 2 && video.duration > 0) {
        saveWatchProgress({
          id: tmdbId,
          title: cleanSeriesName,
          posterPath,
          backdropPath,
          type,
          season,
          episode,
          currentTime: Math.round(video.currentTime),
          duration: Math.round(video.duration)
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

        if (!window.Hls) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
          script.onload = attachHls;
          document.head.appendChild(script);
        } else {
          attachHls();
        }
      }
    } else {
      video.src = streamUrl;
      if (initialTime > 5) video.currentTime = initialTime;
      video.play().catch(() => {});
    }
  }

  function updatePlayerContainer() {
    const iframeWrapper = document.getElementById('player-iframe-wrapper');
    if (iframeWrapper) {
      iframeWrapper.innerHTML = renderPlayerContent();
      if (window.lucide) window.lucide.createIcons();

      const srv = activeServers[currentServerIndex];
      if (srv && (srv.isHls || srv.isDirectVideo) && srv.streamUrl) {
        initHlsPlayer(srv.streamUrl);
      }

      const switchBtn = document.getElementById('btn-switch-subtitled-fallback');
      if (switchBtn) {
        switchBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const subtitledBtn = document.getElementById('tab-subtitled');
          if (subtitledBtn) subtitledBtn.click();
        });
      }
    }
  }

  function updateServerPillsEvents() {
    const toolbar = document.getElementById('player-server-toolbar');
    if (!toolbar) return;
    toolbar.innerHTML = renderServerPills();

    toolbar.querySelectorAll('.server-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toolbar.querySelectorAll('.server-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const srvIdx = parseInt(btn.getAttribute('data-index'), 10);
        currentServerIndex = srvIdx;
        
        updatePlayerContainer();

        const popoutBtn = document.getElementById('player-popout-btn');
        const srv = activeServers[srvIdx];
        const targetUrl = srv.streamUrl || srv.getUrl();
        if (popoutBtn) popoutBtn.href = targetUrl || '#';

        if (!srv.notFound) {
          showToast(`${srv.name} sunucusuna geçildi.`, 'info');
        }
      });
    });
  }

  updateServerPillsEvents();
  updatePlayerContainer();

  // Category Tab Switches
  const dubbedBtn = document.getElementById('tab-dubbed');
  const subtitledBtn = document.getElementById('tab-subtitled');

  if (dubbedBtn && subtitledBtn) {
    dubbedBtn.addEventListener('click', (e) => {
      e.preventDefault();
      currentCategory = 'dubbed';
      activeServers = categorizedServers.dubbed;
      currentServerIndex = 0;
      dubbedBtn.classList.add('active');
      subtitledBtn.classList.remove('active');
      
      updateServerPillsEvents();
      updatePlayerContainer();
    });

    subtitledBtn.addEventListener('click', (e) => {
      e.preventDefault();
      currentCategory = 'subtitled';
      activeServers = categorizedServers.subtitled;
      currentServerIndex = 0;
      subtitledBtn.classList.add('active');
      dubbedBtn.classList.remove('active');
      
      updateServerPillsEvents();
      updatePlayerContainer();
      showToast('💬 Türkçe Altyazılı VidAPI & VIP sunucularına geçildi.', 'info');
    });
  }

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

  const nextEpBtn = document.getElementById('btn-next-episode');
  if (nextEpBtn) {
    nextEpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
      openPlayerModal({
        type,
        tmdbId,
        title: `${seriesTitle || title} - S${season}E${episode + 1}`,
        seriesTitle,
        season,
        episode: episode + 1,
        posterPath,
        backdropPath,
        currentTime: 0
      });
    });
  }

  let simulatedCurrentTime = initialTime;
  const estimatedDuration = 2700;

  clearInterval(activeProgressInterval);
  activeProgressInterval = setInterval(() => {
    simulatedCurrentTime += 5;
    saveWatchProgress({
      id: tmdbId,
      title: cleanSeriesName,
      posterPath,
      backdropPath,
      type,
      season,
      episode,
      currentTime: simulatedCurrentTime,
      duration: estimatedDuration
    });
  }, 5000);
}

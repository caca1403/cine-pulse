import { disposeLiveMedia } from '../services/livePlayback.js';
import Hls from 'hls.js';
import { renderIcons } from '../services/icons.js';
import { createPlayerScope } from '../components/playerLifecycle.js';
/* ==========================================================================
   CinePulse Studio - Cinema IPTV Platform (Full-Width Player + Bottom Grid)
   Zero Sidebars — Player takes full top width, Channel catalog flows below.
   100% Native HLS.js Direct Playback — Zero Iframes, Zero Ads
   ========================================================================== */

import { LIVE_TV_CATEGORIES, LIVE_TV_CHANNELS, getChannelBadgeSvg } from '../services/liveTvChannels.js';
import {
  getCachedCanliChannels, refreshCanliChannels, toLiveChannels as toCanliLiveChannels,
  normalizeCanliName
} from '../services/canliTvChannels.js';
import { fetchRecTvLiveChannels, getRecTvChannelStreamUrl } from '../services/rectvService.js';

const TVR_LIVE_CACHE_KEY = 'cp_tvr_live_v1';
const TVR_LIVE_TTL_MS = 12 * 60 * 60 * 1000;

function readTvrLiveCache() {
  try {
    const raw = localStorage.getItem(TVR_LIVE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.channels)) return null;
    if (Date.now() - (parsed.savedAt || 0) > TVR_LIVE_TTL_MS) return null;
    return parsed.channels;
  } catch (_) {
    return null;
  }
}

function toTvrLiveChannels(list) {
  const out = [];
  for (const ch of list || []) {
    if (!ch || (!ch.tvrId && !ch.id)) continue;
    const tvrId = String(ch.tvrId || ch.id || '').replace(/^tvr_ch_/, '');
    if (!tvrId || !ch.name) continue;
    out.push({
      id: `tvr_live_${tvrId}`,
      name: ch.name,
      logo: ch.logo || '',
      category: ch.category || 'national',
      tvrId,
      isTvr: true,
      officialLiveId: `tvr:${tvrId}`,
      streamUrl: ch.streamUrl || '',
      quality: ch.quality || '1080p TVR'
    });
  }
  return out;
}
import {
  getCachedIptvChannels, refreshIptvChannels, toLiveChannels as toIptvLiveChannels,
  sortByPopularity, resolveLocalLogo
} from '../services/iptvOrgChannels.js';
import { getChannelEpg, initEpgService, stopEpgService } from '../services/epgService.js';
import { showToast } from '../components/Toast.js';
import { isKidProfileActive } from '../services/storage.js';
import { apiUrl } from '../services/apiOrigin.js';
import { getAltSources, getPreferredSourceKey, setPreferredSourceKey, getRelayOrigin, setRelayOrigin, getTsBases, getTsBaseIdx, setTsBaseIdx } from '../services/xtreamAltSources.js';

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
  const isKid = isKidProfileActive();
  const normalizeChannelName = name => String(name || '')
    .toLocaleUpperCase('tr-TR')
    .replace(/\b(?:HD|FHD|4K|KANALI)\b/g, '')
    .replace(/[^A-ZÇĞİÖŞÜ0-9]/g, '');
  function toProxiedLiveUrl(url) {
    if (!url) return '';
    if (url.startsWith('/api/') || url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) return url;
    let ref = '';
    try {
      if (url.includes('trt')) ref = 'https://www.trt1.com.tr/';
      else if (url.includes('atv')) ref = 'https://www.atv.com.tr/';
      else if (url.includes('showtv')) ref = 'https://www.showtv.com.tr/';
      else if (url.includes('kanald') || url.includes('teve2') || url.includes('dreamturk')) ref = 'https://www.kanald.com.tr/';
      else if (url.includes('startv') || url.includes('ntv') || url.includes('kralpop')) ref = 'https://www.startv.com.tr/';
      else if (url.includes('nowtv')) ref = 'https://www.nowtv.com.tr/';
      else if (url.includes('tv8')) ref = 'https://www.tv8.com.tr/';
      else if (url.includes('dmax')) ref = 'https://www.dmax.com.tr/';
      else if (url.includes('tlc')) ref = 'https://www.tlctv.com.tr/';
      else ref = `${new URL(url).origin}/`;
    } catch (_) {
      ref = '';
    }
    return `/api/hls_proxy?url=${encodeURIComponent(url)}&ref=${encodeURIComponent(ref)}&live=1`;
  }

  // Omurga: LIVE_TV_CHANNELS (dogrudan CDN / resmi akislar) + iptv-org (tamamlayici)
  const curatedBase = (LIVE_TV_CHANNELS || []).map(c => ({
    ...c,
    streamUrl: toProxiedLiveUrl(c.streamUrl),
    logo: resolveLocalLogo(c.name) || c.logo || getChannelBadgeSvg(c.name, c.category)
  }));
  const curatedNames = new Set(curatedBase.map((c) => normalizeCanliName(c.name)));

  const iptvInitial = toIptvLiveChannels(getCachedIptvChannels())
    .filter(c => !curatedNames.has(normalizeCanliName(c.name)))
    .map(c => ({ ...c, streamUrl: toProxiedLiveUrl(c.streamUrl) }));
  const iptvNames = new Set([
    ...curatedNames,
    ...iptvInitial.map((c) => normalizeCanliName(c.name))
  ]);
  const kidOk = (c) => !isKid || c.category === 'kids';
  const tvrInitial = isKid ? [] : toTvrLiveChannels(readTvrLiveCache());
  const tvrFresh = tvrInitial.filter((c) => !iptvNames.has(normalizeCanliName(c.name)));
  const allChannels = [
    ...curatedBase.filter(kidOk),
    ...iptvInitial.filter(kidOk),
    ...tvrFresh.filter(kidOk)
  ];
  const EMPTY_CH = { id: 'ctv_loading', name: 'Kanallar yükleniyor...', logo: '', category: 'canlitv', streamUrl: '', quality: 'HD' };
  const visibleCategories = [
    ...LIVE_TV_CATEGORIES,
    { id: 'canlitv', name: 'CanlıTV', icon: 'radio-tower' }
  ];
  const channelsPool = isKid
    ? allChannels.filter(c => c.category === 'kids')
    : allChannels;

  let activeCategory = isKid ? 'kids' : 'all';
  let activeChannel = channelsPool[0] || { ...EMPTY_CH };
  let searchQuery = '';
  let activeHls = null;
  let activeMpegts = null;
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
    const list = channelsPool.filter(ch => {
      let matchCat = true;
      if (activeCategory === 'favorites') {
        matchCat = isFav(ch.id);
      } else if (activeCategory !== 'all') {
        matchCat = ch.category === activeCategory;
      }
      const matchSearch = !searchQuery || ch.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
    // "Tumu"nde Turkiye populerligine gore sirala
    return activeCategory === 'all' ? sortByPopularity(list) : list;
  }

  function getChannelIndex(ch) {
    return channelsPool.findIndex(c => c.id === ch.id);
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
                    <i data-lucide="sliders" style="width:13px;height:13px;color:#dfff76;"></i>
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

              <!-- Alternatif Kaynak Seçici (aynı kanal, birden fazla panel) -->
              <div class="tv-quality-wrapper" id="tv-source-wrapper">
                <button class="tv-ctrl-action-btn tv-quality-btn" id="tv-btn-source" title="Alternatif Kaynak Seç">
                  <i data-lucide="layers" style="width:17px;height:17px;"></i>
                  <span class="tv-quality-badge-text" id="tv-source-badge">SRC 1</span>
                </button>
                <div class="tv-quality-menu hidden" id="tv-source-menu">
                  <div class="tv-quality-menu-header">
                    <i data-lucide="layers" style="width:13px;height:13px;color:#38bdf8;"></i>
                    <span>Yayın Kaynağı</span>
                  </div>
                  <div class="tv-quality-options" id="tv-source-options"></div>
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
              ${visibleCategories.map(cat => `
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
      initEpgService();
      const scope = createPlayerScope();
      const { setTimeout, clearTimeout, setInterval, clearInterval } = scope;

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

      // Alternatif kaynak seçici
      const srcBtn = container.querySelector('#tv-btn-source');
      const srcBadge = container.querySelector('#tv-source-badge');
      const srcMenu = container.querySelector('#tv-source-menu');
      const srcOptions = container.querySelector('#tv-source-options');
      const srcWrapper = container.querySelector('#tv-source-wrapper');
      let srcList = [];
      let srcIdx = 0;

      function buildSrcList(channel) {
        const alts = getAltSources(channel);
        srcList = [{ key: 'default', label: `Varsayılan Yayın (${channel.quality || 'HD'})`, url: channel.streamUrl, isDefault: true }, ...alts];
        const pref = getPreferredSourceKey(channel.id);
        const pi = pref ? srcList.findIndex(s => s.key === pref) : -1;
        const hasAlts = alts.length > 0;
        if (srcWrapper) srcWrapper.style.display = hasAlts ? '' : 'none';
        srcIdx = pi >= 0 ? pi : 0;
        renderSrcMenu();
      }

      function renderSrcMenu() {
        if (!srcOptions || !srcBadge) return;
        if (srcBadge) srcBadge.textContent = srcList.length > 1 ? `SRC ${srcIdx + 1}/${srcList.length}` : 'SRC 1';
        srcOptions.innerHTML = srcList.map((s, i) => `
          <button class="tv-quality-opt ${i === srcIdx ? 'active' : ''}" data-src="${i}">
            ${i === srcIdx ? '<i data-lucide="check" style="width:12px;height:12px;"></i>' : '<span style="width:13px;display:inline-block;"></span>'}
            <span>${s.label}</span>
          </button>
        `).join('') + `
          <button class="tv-quality-opt" data-relay="1" title="Panel kaynakları için ev relay adresi">
            <span style="width:13px;display:inline-block;">🔧</span>
            <span>Relay: ${getRelayOrigin() ? '✅ ayarlı' : '❌ yok (dokun)'}</span>
          </button>
        `;
        srcOptions.querySelectorAll('[data-src]').forEach(opt => {
          opt.addEventListener('click', (e) => {
            e.stopPropagation();
            const i = parseInt(opt.dataset.src, 10);
            if (i !== srcIdx) {
              setPreferredSourceKey(activeChannel.id, srcList[i].key);
              loadChannel(activeChannel, i);
              showToast(`Kaynak değişti: ${srcList[i].label}`, 'success');
            }
            if (srcMenu) srcMenu.classList.add('hidden');
          });
        });
        const relayBtn = srcOptions.querySelector('[data-relay]');
        if (relayBtn) {
          relayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const cur = getRelayOrigin();
            const next = window.prompt('Ev relay adresi (cloudflared https URL):', cur || 'https://');
            if (next === null) return;
            setRelayOrigin(next);
            showToast(next.trim() ? `Relay kaydedildi: ${next.trim()}` : 'Relay temizlendi', 'success');
            loadChannel(activeChannel);
            if (srcMenu) srcMenu.classList.add('hidden');
          });
        }
        renderIcons();
      }

      if (srcBtn && srcMenu) {
        srcBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          srcMenu.classList.toggle('hidden');
          keepControlsActive();
        });
        scope.on(document, 'click', (e) => {
          if (!e.target.closest('#tv-source-wrapper')) srcMenu.classList.add('hidden');
        });
      }

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

      // Localhost'ta goreli path'ler vite proxy ile :4000'e gider; apiUrl()
      // localhost'u bile production'a goturur, o yuzden localde relative kal.
      function locApi(path) {
        if (!path || /^https?:\/\//i.test(path)) return path;
        if (typeof window !== 'undefined') {
          const host = window.location?.hostname || '';
          if (host === 'localhost' || host === '127.0.0.1') return path;
        }
        return apiUrl(path);
      }

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

      // ─── Real-Time EPG Updates Across All Cards & Player ───
      function refreshAllEpgDisplays() {
        updateTopBar();
        if (channelGrid) {
          const cards = channelGrid.querySelectorAll('.tv-grid-card');
          cards.forEach(card => {
            const chId = card.getAttribute('data-id');
            const ch = allChannels.find(c => c.id === chId);
            if (!ch) return;
            const epg = getChannelEpg(ch);
            
            const titleEl = card.querySelector('.tv-epg-title');
            const timeEl = card.querySelector('.tv-epg-time');
            const fillEl = card.querySelector('.tv-epg-bar-fill');
            const pctEl = card.querySelector('.tv-epg-pct');

            if (titleEl && titleEl.textContent !== epg.title) {
              titleEl.textContent = epg.title;
              titleEl.title = epg.title;
            }
            if (timeEl && timeEl.textContent !== epg.timeRange) {
              timeEl.textContent = epg.timeRange;
            }
            if (fillEl) {
              fillEl.style.width = `${epg.progress}%`;
            }
            if (pctEl && pctEl.textContent !== `%${epg.progress}`) {
              pctEl.textContent = `%${epg.progress}`;
            }
          });
        }
      }

      const onEpgUpdated = () => {
        refreshAllEpgDisplays();
      };
      scope.on(window, 'epg-updated', onEpgUpdated);

      // Continuous real-time ticker (every 20s) ensuring EPG progress and active titles never go stale
      let epgInterval = setInterval(() => {
        if (!document.body.contains(container)) {
          clearInterval(epgInterval);
          window.removeEventListener('epg-updated', onEpgUpdated);
          return;
        }
        refreshAllEpgDisplays();
      }, 20000);

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
          if (typeof srcMenu !== 'undefined' && srcMenu) srcMenu.classList.add('hidden');
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
            if (typeof srcMenu !== 'undefined' && srcMenu) srcMenu.classList.add('hidden');
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
        renderIcons();
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
            renderIcons();
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
          renderIcons();
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
              <i data-lucide="check" style="width:13px;height:13px;color:#dfff76;"></i>
              <span>Kaynak Kalite (${activeChannel.quality || '1080p'})</span>
            </button>
          `;
          renderIcons();
          return;
        }

        const levels = hls.levels;
        const currentLvl = hls.currentLevel;

        let html = `
          <button class="tv-quality-opt ${currentLvl === -1 ? 'active' : ''}" data-level="-1">
            ${currentLvl === -1 ? '<i data-lucide="check" style="width:13px;height:13px;color:#dfff76;"></i>' : '<span style="width:13px;display:inline-block;"></span>'}
            <span>Otomatik (Adaptive)</span>
          </button>
        `;

        levels.forEach((lvl, idx) => {
          const height = lvl.height || (lvl.attrs && lvl.attrs.RESOLUTION ? lvl.attrs.RESOLUTION.height : 720);
          const label = height >= 1080 ? '1080p FHD' : (height >= 720 ? '720p HD' : (height >= 480 ? '480p SD' : `${height}p`));
          const isLvlActive = currentLvl === idx;
          html += `
            <button class="tv-quality-opt ${isLvlActive ? 'active' : ''}" data-level="${idx}">
              ${isLvlActive ? '<i data-lucide="check" style="width:13px;height:13px;color:#dfff76;"></i>' : '<span style="width:13px;display:inline-block;"></span>'}
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

        renderIcons();
      }

      if (qualityBtn && qualityMenu) {
        qualityBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          qualityMenu.classList.toggle('hidden');
          keepControlsActive();
        });

        scope.on(document, 'click', (e) => {
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

      scope.on(window, 'scroll', handlePipScroll, { passive: true });

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
        if (channelIdx >= 0 && channelIdx < allChannels.length) {
          const target = allChannels[channelIdx];
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
        const previewCh = allChannels[targetNum - 1];

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

      function stopCurrentMedia() {
        const hls = activeHls;
        const mpegts = activeMpegts;
        activeHls = null;
        activeMpegts = null;
        disposeLiveMedia({ video: videoEl, hls, mpegts, frames: container.querySelectorAll('#tv-embed-player') });
      }

      async function loadChannel(channel, forceSrcIdx = -1) {
        const myToken = ++channelPlaybackToken;
        activeChannel = channel;
        isPipDismissed = false;
        stopCurrentMedia();
        let embeddedPlayback = false;
        let lastPlaybackError = '';
        for (const control of [playPauseBtn, muteBtn, container.querySelector('#tv-btn-quality')]) { if (control) control.style.display = ''; }

        // Alternatif kaynak listesini kur (tercih + varsayılan)
        // TVR: akis URL'sini oynatmadan hemen once coz (tarayici WebCrypto,
        // 2 dk cache; imza taze kalir). Basarisizsa hata goster, listede kalir.
        if (channel.isTvr && !channel.streamUrl) {
          try {
            if (loadingEl) loadingEl.classList.remove('hidden');
            if (errorEl) errorEl.classList.add('hidden');
          } catch (_) {}
          const fresh = await getRecTvChannelStreamUrl(channel.tvrId, { forceRefresh: true }).catch(() => null);
          if (channelPlaybackToken !== myToken) return;
          if (fresh) {
            channel.streamUrl = fresh;
          } else {
            try {
              if (loadingEl) loadingEl.classList.add('hidden');
              if (errorEl) errorEl.classList.remove('hidden');
            } catch (_) {}
            return;
          }
        }
        buildSrcList(channel);
        if (forceSrcIdx >= 0 && forceSrcIdx < srcList.length) srcIdx = forceSrcIdx;
        const useAlt = srcIdx > 0;
        renderSrcMenu();

        // Update the zap UI immediately. Rebuilding the entire catalog here
        // made every switch feel delayed before playback even started.
        updateTopBar();
        showOSD();
        updateActiveChannelCard();

        loadingEl.classList.remove('hidden');
        errorEl.classList.add('hidden');

        // A parsed playlist is not proof that its segments are playable.
        // Keep the loading state until the browser has actual video data.
        const onVideoReady = () => {
          if (channelPlaybackToken !== myToken) return;
          loadingEl.classList.add('hidden');
          errorEl.classList.add('hidden');
        };
        videoEl.addEventListener('loadeddata', onVideoReady, { once: true });
        setTimeout(() => {
          videoEl.removeEventListener('loadeddata', onVideoReady);
          // 20sn'de görüntü yoksa hata ekranı yerine denenmemiş kaynağa geç
          if (channelPlaybackToken === myToken && videoEl.readyState < 2 && !embeddedPlayback) advanceOrError();
        }, 20000);

        let freshStreamAttempted = false;
        let officialRefreshAttempts = 0;
        let directNetworkRetryCount = 0;
        let proxyFallbackAttempted = false;
        let mediaRecoveryAttempted = false;
        let resolutionGeneration = 0;
        const triedSrc = new Set();
        const triedBases = new Set();
        triedBases.add(getTsBaseIdx());
        async function tryFreshOfficialStream(failedUrl, forceRefresh = true) {
          if (!channel.officialLiveId) return false;
          // TVR: WebCrypto ile taze cozum (proxy'li m3u8 doner)
          if (String(channel.officialLiveId).startsWith('tvr:')) {
            try {
              const tvrId = String(channel.officialLiveId).slice(4);
              const fresh = await getRecTvChannelStreamUrl(tvrId, { forceRefresh }).catch(() => null);
              if (fresh && fresh !== failedUrl) {
                channel.streamUrl = fresh;
                startHls(fresh);
                return true;
              }
            } catch (_) {}
            return false;
          }
          if (forceRefresh && officialRefreshAttempts >= 2) return false;
          if (forceRefresh) officialRefreshAttempts += 1;
          const resolutionRun = ++resolutionGeneration;
          freshStreamAttempted = true;
          loadingEl.classList.remove('hidden');
          errorEl.classList.add('hidden');
          try {
            const resolver = locApi(`/api/live_tv_stream?channel=${encodeURIComponent(channel.officialLiveId)}&playerId=${encodeURIComponent(channel.playerId || '')}&json=1&refresh=${forceRefresh ? 1 : 0}&_=${Date.now()}`);
            const response = await fetch(resolver, { cache: 'no-store', headers: { Accept: 'application/json' } });
            if (!response.ok) {
              const failure = await response.json().catch(() => null);
              lastPlaybackError = failure?.error || 'Yayın kaynağı şu anda yanıt vermiyor';
              throw new Error(lastPlaybackError);
            }
            const data = await response.json();
            if (channelPlaybackToken !== myToken || resolutionRun !== resolutionGeneration) return true;
            if (data.kind === 'external' && /^https:\/\//.test(data.externalUrl || '')) {
              stopCurrentMedia();
              resolutionGeneration++;
              embeddedPlayback = true;
              const panel = document.createElement('div');
              panel.id = 'tv-embed-player';
              panel.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:2';
              const link = document.createElement('a');
              link.href = data.externalUrl;
              link.target = '_blank';
              link.rel = 'noopener noreferrer';
              link.textContent = `${channel.name} resmî canlı yayınını aç`;
              link.className = 'btn btn-primary';
              panel.appendChild(link);
              screenEl.appendChild(panel);
              loadingEl.classList.add('hidden');
              errorEl.classList.add('hidden');
              return true;
            }
            if ((data.kind === 'embed' && /^https:\/\//.test(data.embedUrl || '')) || (data.kind === 'youtube' && /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}\?/.test(data.embedUrl || ''))) {
              stopCurrentMedia();
              resolutionGeneration++;
              embeddedPlayback = true;
              for (const control of [playPauseBtn, muteBtn, container.querySelector('#tv-btn-quality')]) { if (control) control.style.display = 'none'; }
              const frame = document.createElement('iframe');
              frame.id = 'tv-embed-player';
              frame.title = `${channel.name} canlı yayını`;
              frame.allow = 'autoplay; fullscreen; picture-in-picture';
              frame.allowFullscreen = true;
              frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;z-index:1';
              frame.src = data.embedUrl;
              screenEl.appendChild(frame);
              loadingEl.classList.add('hidden');
              errorEl.classList.add('hidden');
              setupQualityMenu(null);
              return true;
            }
            const chosenPath = data?.proxiedUrl || data?.url || '';
            if (channelPlaybackToken !== myToken || resolutionRun !== resolutionGeneration) return true;
            const freshUrl = chosenPath ? locApi(chosenPath) : '';
            if (!freshUrl) throw new Error('Live stream URL missing');
            channel.streamUrl = freshUrl;
            if (freshUrl !== failedUrl || forceRefresh) {
              startHls(freshUrl);
              return true;
            }
          } catch (error) {
            if (channelPlaybackToken !== myToken || resolutionRun !== resolutionGeneration) return true;
            console.warn('[LiveTV] Official stream refresh failed:', channel.name, error?.message || error);
          }
          return false;
        }

        function showPlaybackError() {
          if (channelPlaybackToken !== myToken) return;
          loadingEl.classList.add('hidden');
          errorEl.classList.remove('hidden');
          const message = errorEl.querySelector('.tv-error-msg');
          if (message) message.textContent = lastPlaybackError || 'Yayın akışı geçici olarak yanıt vermedi';
        }

        // Denenmemiş sonraki kaynağa geç; kaynaklar biterse baz değiştir
        // (relay -> worker -> direct); bazlar da biterse hata göster.
        function advanceOrError() {
          if (channelPlaybackToken !== myToken) return;
          const next = srcList.findIndex((_, i) => !triedSrc.has(i));
          if (next >= 0) {
            srcIdx = next;
            renderSrcMenu();
            loadingEl.classList.remove('hidden');
            errorEl.classList.add('hidden');
            showToast(`Alternatif kaynağa geçiliyor: ${srcList[next].label}`, 'info');
            playSrc(next);
            return;
          }
          const bases = getTsBases();
          const nb = bases.findIndex((_, i) => !triedBases.has(i));
          if (nb >= 0) {
            triedBases.add(nb);
            setTsBaseIdx(nb);
            buildSrcList(channel);
            triedSrc.clear();
            const baseName = !bases[nb] ? 'doğrudan' : (bases[nb].includes('workers.dev') ? 'yedek ağ' : `relay ${nb + 1}`);
            loadingEl.classList.remove('hidden');
            errorEl.classList.add('hidden');
            showToast(`Ağ değişti (${baseName}), tekrar deneniyor...`, 'info');
            playSrc(srcIdx);
            return;
          }
          showPlaybackError();
        }

        function tryProxyFallback(failedUrl) {
          if (proxyFallbackAttempted || !/^https?:\/\//i.test(failedUrl)) return false;
          proxyFallbackAttempted = true;
          const ref = `${new URL(failedUrl).origin}/`;
          // Canli TV: tum segmentler proxy'den gecsin (CORS'suz CDN + yonlendirme zinciri)
          const proxiedUrl = locApi(`/api/hls_proxy?url=${encodeURIComponent(failedUrl)}&ref=${encodeURIComponent(ref)}&live=1`);
          channel.streamUrl = proxiedUrl;
          startHls(proxiedUrl);
          return true;
        }

        // mpegts.js CDN yükleyici (Xtream düz MPEG-TS kaynakları için, MSE transmux)
        function loadMpegtsLib() {
          if (window.mpegts) return Promise.resolve(window.mpegts);
          if (window.__mpegtsPromise) return window.__mpegtsPromise;
          window.__mpegtsPromise = new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/mpegts.js@1.7.3/dist/mpegts.min.js';
            s.onload = () => (window.mpegts ? resolve(window.mpegts) : reject(new Error('mpegts missing')));
            s.onerror = () => reject(new Error('mpegts load failed'));
            document.head.appendChild(s);
          });
          return window.__mpegtsPromise;
        }

        function playSrc(i) {
          resolutionGeneration++;
          const s = srcList[i];
          if (!s) {
            advanceOrError();
            return;
          }
          triedSrc.add(i);
          if (s.isTs) startTs(s.url);
          else startHls(s.url);
        }

        function startTs(url) {
          if (channelPlaybackToken !== myToken) return;
          // Yerel geliştirmede göreli proxy (localhost:4000) kullanılır; çünkü
          // apiUrl() localhost'u bile production proxy'ye yönlendirir ve panel
          // Cloudflare'ı Vercel IP'lerini engeller. Üretimde göreli URL yine
          // aynı origin'e gider ve zarifçe sonraki kaynağa geçilir.
          const host = (typeof window !== 'undefined' && window.location?.hostname) || '';
          const isLocalDev = host === 'localhost' || host === '127.0.0.1';
          url = isLocalDev ? url : apiUrl(url);
          loadMpegtsLib().then((mpegts) => {
            if (channelPlaybackToken !== myToken) return;
            if (!mpegts.isSupported()) {
              showPlaybackError();
              return;
            }
            stopCurrentMedia();
            try {
              const player = mpegts.createPlayer({ type: 'mpegts', isLive: true, url });
              activeMpegts = player;
              player.attachMediaElement(videoEl);
              player.load();
              player.play().catch(() => {});
              setupQualityMenu(null);
              player.on(mpegts.Events.ERROR, () => {
                if (channelPlaybackToken !== myToken) return;
                console.warn('[LiveTV] mpegts error on:', url);
                advanceOrError();
              });
            } catch (_) {
              showPlaybackError();
            }
          }).catch(() => {
            if (channelPlaybackToken === myToken) showPlaybackError();
          });
        }

        function startHls(url) {
          if (channelPlaybackToken !== myToken) return;
          url = locApi(url);
          resolutionGeneration++;
          embeddedPlayback = false;
          stopCurrentMedia();
          if (Hls.isSupported()) {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              startLevel: 0,
              capLevelToPlayerSize: true,
              backBufferLength: 10,
              maxBufferLength: 20,
              maxMaxBufferLength: 40,
              liveSyncDurationCount: 3,
              liveMaxLatencyDurationCount: 5,
              manifestLoadingTimeOut: 12000,
              manifestLoadingMaxRetry: 3,
              manifestLoadingRetryDelay: 1000,
              levelLoadingTimeOut: 12000,
              levelLoadingMaxRetry: 3,
              fragLoadingTimeOut: 10000,
              fragLoadingMaxRetry: 3
            });
            activeHls = hls;

            hls.loadSource(url);
            hls.attachMedia(videoEl);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              if (channelPlaybackToken !== myToken || activeHls !== hls) {
                try {
                  hls.stopLoad();
                  hls.detachMedia();
                  hls.destroy();
                } catch (_) {}
                return;
              }
              setupQualityMenu(hls);
              videoEl.play().catch((error) => {
                if (error.name !== 'NotAllowedError' || channelPlaybackToken !== myToken) return;
                isMuted = true;
                videoEl.muted = true;
                if (muteBtn) muteBtn.innerHTML = '<i data-lucide="volume-x" style="width:18px;height:18px;"></i>';
                renderIcons();
                videoEl.play().catch(() => {});
              });
            });

            hls.on(Hls.Events.ERROR, (_, data) => {
              if (channelPlaybackToken !== myToken || activeHls !== hls) return;
              if (data.fatal) {
                console.warn('[LiveTV] Fatal HLS error on:', url, data.type, data.details);
                // Panel (alternatif) kaynakta hata varsa beklemeden sonrakini dene
                if (srcList[srcIdx] && !srcList[srcIdx].isDefault) {
                  advanceOrError();
                  return;
                }
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                  if (channel.officialLiveId) {
                    tryFreshOfficialStream(url).then(recovered => {
                      if (!recovered) advanceOrError();
                    });
                  } else if (!tryProxyFallback(url)) {
                    // Dogrudan tekrar deneme yok: ikinci deneme de ayni
                    // CORS/403'e takilir, vakit kaybi. Hemen proxy.
                    advanceOrError();
                  }
                } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                  if (mediaRecoveryAttempted) {
                    advanceOrError();
                  } else {
                    mediaRecoveryAttempted = true;
                    try {
                      hls.recoverMediaError();
                    } catch (_) {
                      advanceOrError();
                    }
                  }
                } else {
                  advanceOrError();
                }
              }
            });
          } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari iOS/macOS
            videoEl.src = url;
            videoEl.addEventListener('loadedmetadata', () => {
              if (channelPlaybackToken !== myToken) return;
              setupQualityMenu(null);
              videoEl.play().catch((error) => {
                if (error.name !== 'NotAllowedError' || channelPlaybackToken !== myToken) return;
                isMuted = true;
                videoEl.muted = true;
                if (muteBtn) muteBtn.innerHTML = '<i data-lucide="volume-x" style="width:18px;height:18px;"></i>';
                renderIcons();
                videoEl.play().catch(() => {});
              });
            }, { once: true });
            videoEl.addEventListener('error', () => {
              if (channelPlaybackToken !== myToken) return;
              if (!tryProxyFallback(url)) advanceOrError();
            }, { once: true });
          } else {
            advanceOrError();
          }
        }

        let Hls;
        try {
          Hls = (await import('hls.js')).default;
        } catch (_) {
          showPlaybackError();
          return;
        }
        if (channelPlaybackToken !== myToken) return;

        // Official DMAX/TLC playback URLs are signed and short-lived; resolve a fresh URL on every selection.
        // Alternatif kaynak seçiliyse resmi çözümleme atlanır, panel TS'i direkt oynatılır.
        if (channel.officialLiveId && !useAlt) {
          triedSrc.add(srcIdx);
          tryFreshOfficialStream('', false).then(recovered => {
            if (!recovered && channelPlaybackToken === myToken) advanceOrError();
          });
        } else {
          playSrc(srcIdx);
        }
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
      if (retryBtn) retryBtn.addEventListener('click', () => {
        // Tekrar düğmesi sıradaki kaynağı dener (aynı ölü kaynağa takılmaz)
        if (srcList.length > 1) {
          const next = (srcIdx + 1) % srcList.length;
          setPreferredSourceKey(activeChannel.id, srcList[next].key);
          loadChannel(activeChannel, next);
        } else loadChannel(activeChannel);
      });
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
          renderIcons();
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
                  <i data-lucide="star" style="width:15px;height:15px;${isFavorited ? 'fill:#dfff76;color:#dfff76;' : ''}"></i>
                </button>
              </div>

              <div class="tv-grid-logo-box">
                <img class="tv-grid-logo" src="${ch.logo}" alt="${ch.name}" onerror="this.onerror=null; this.src='${fallbackBadge}';" loading="lazy" />
              </div>

              <div class="tv-grid-info">
                <span class="tv-grid-name" title="${ch.name}">${ch.name}</span>
                <div class="tv-grid-meta">
                  <span class="tv-grid-quality">${ch.quality}</span>
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
            const ch = allChannels.find(c => c.id === item.dataset.id);
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

        renderIcons();
      }

      function updateActiveChannelCard() {
        if (!channelGrid) return;
        channelGrid.querySelectorAll('.tv-grid-card').forEach(card => {
          const isActive = card.dataset.id === activeChannel.id;
          card.classList.toggle('active', isActive);

          const existingIndicator = card.querySelector('.tv-grid-live-indicator');
          if (!isActive && existingIndicator) existingIndicator.remove();
          if (isActive && !existingIndicator) {
            const indicator = document.createElement('div');
            indicator.className = 'tv-grid-live-indicator';
            indicator.innerHTML = '<span class="tv-live-dot"></span><span>ŞU AN İZLENİYOR</span>';
            card.appendChild(indicator);
          }
        });
      }

      renderAllViews = () => {
        renderBottomChannelGrid();
        updateTopBar();
        renderIcons();
      };

      // Omurga + yedek listeleri arka planda tazele (gunluk cache); degisirse izgara guncellenir
      {
        const refreshAll = async () => {
          if (!document.contains(container)) return;
          const [iptvFresh, tvrFreshRaw] = await Promise.all([
            refreshIptvChannels().catch(() => null),
            (!isKid ? fetchRecTvLiveChannels().catch(() => null) : Promise.resolve(null))
          ]);
          if (!document.contains(container)) return;
          let changed = false;
          if (iptvFresh && iptvFresh.length > 0) {
            const mapped = toIptvLiveChannels(iptvFresh)
              .filter(kidOk)
              .filter(c => !curatedNames.has(normalizeCanliName(c.name)))
              .map(c => ({ ...c, streamUrl: toProxiedLiveUrl(c.streamUrl) }));
            const before = allChannels.filter((c) => c.iptvOrg).map((c) => c.id).join(',');
            if (before !== mapped.map((c) => c.id).join(',')) {
              for (let i = allChannels.length - 1; i >= 0; i--) {
                if (allChannels[i].iptvOrg) allChannels.splice(i, 1);
              }
              const insertIdx = allChannels.filter(c => !c.iptvOrg && !c.isTvr).length;
              allChannels.splice(insertIdx, 0, ...mapped);
              changed = true;
            }
          }
          // CanliTV kapali (dengesiz) — blogu pasif birakildi.
          if (tvrFreshRaw && tvrFreshRaw.length > 0) {
            try {
              localStorage.setItem(TVR_LIVE_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), channels: tvrFreshRaw }));
            } catch (_) {}
            const known = new Set(allChannels.filter((c) => !c.isTvr).map((c) => normalizeCanliName(c.name)));
            const mapped = toTvrLiveChannels(tvrFreshRaw).filter((c) => kidOk(c) && !known.has(normalizeCanliName(c.name)));
            const before = allChannels.filter((c) => c.isTvr).map((c) => c.id).join(',');
            if (before !== mapped.map((c) => c.id).join(',')) {
              for (let i = allChannels.length - 1; i >= 0; i--) {
                if (allChannels[i].isTvr) allChannels.splice(i, 1);
              }
              allChannels.push(...mapped);
              changed = true;
            }
          }
          const updatedActive = allChannels.find((c) => c.id === activeChannel.id);
          if (updatedActive) activeChannel = { ...activeChannel, logo: updatedActive.logo };
          else if ((!activeChannel.streamUrl || activeChannel.id === 'ctv_loading') && allChannels[0]) {
            activeChannel = allChannels[0];
            try {
              renderAllViews();
            } catch (_) {}
            loadChannel(activeChannel);
            return;
          }
          if (changed) {
            // Cocuk modu havuzu ayri referansta tutuldugu icin esitle
            // (yetiskin modda channelsPool === allChannels, dokunma).
            try {
              if (isKid && channelsPool !== allChannels) {
                channelsPool.length = 0;
                channelsPool.push(...allChannels.filter((c) => c.category === 'kids'));
              }
            } catch (_) {}
            try {
              renderAllViews();
            } catch (_) {}
          }
        };
        refreshAll().catch(() => {});
      }

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

        scope.on(window, 'mousemove', (e) => {
          if (!isMouseDown) return;
          const x = e.pageX - catStrip.offsetLeft;
          const walk = (x - startX) * 1.5;
          if (Math.abs(walk) > 6) {
            isDragging = true;
            catStrip.classList.add('is-dragging');
          }
          catStrip.scrollLeft = scrollStart - walk;
        });

        scope.on(window, 'mouseup', () => {
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

      scope.on(document, 'fullscreenchange', () => {
        const isFs = !!document.fullscreenElement;
        screenEl.classList.toggle('is-fullscreen', isFs);
        if (fsBtn) {
          fsBtn.innerHTML = isFs
            ? '<i data-lucide="minimize-2" style="width:18px;height:18px;"></i>'
            : '<i data-lucide="maximize-2" style="width:18px;height:18px;"></i>';
          renderIcons();
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
      scope.on(document, 'keydown', handleKeyboard);

      // ─── Global Clean Up & Lifecycle Manager ───
      const stopAllPlayback = () => {
        channelPlaybackToken++;
        stopCurrentMedia();
        scope.dispose();
        stopEpgService();
        clearInterval(epgInterval);
        window.removeEventListener('epg-updated', onEpgUpdated);
        window.removeEventListener('scroll', handlePipScroll);
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
      scope.add(() => observer.disconnect());

      // ─── Initial Start ───
      renderAllViews();
      if (activeChannel && activeChannel.streamUrl) loadChannel(activeChannel);
      updateVolume(1.0);

    }
  };
}

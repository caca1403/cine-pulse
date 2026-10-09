import { renderSiteLogo } from './BrandLogo.js';
import { renderIcons } from '../services/icons.js';
import { searchMulti, getImageUrl, TMDB_IMAGE_SIZES } from '../services/tmdbApi.js';
import { openProfileModal } from './ProfileModal.js';
import { openRandomPickerModal } from './RandomPickerModal.js';
import { getActiveProfile } from '../services/storage.js';
import { openNotificationCenterModal, getUnreadNotificationCount } from './NotificationCenterModal.js';
import { openDecisionRoomModal } from './DecisionRoomModal.js';
import { openTraktModal } from './TraktModal.js';
import { isNativeAndroidApp, isAppPlatform } from '../services/platformBridge.js';

const icon = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
const escapeText = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const art = name => `${import.meta.env.BASE_URL}images/discovery/${name}.webp`;

function categoryTile(view, title, subtitle = '') {
  return `<a href="#${view}" class="cp-category cp-category-${view}">
    <img src="${art(view === 'documentary' ? 'documentary' : view)}" alt="" width="480" height="300" decoding="async" />
    <div class="cp-category-copy"><strong>${title}</strong>${subtitle ? `<span>${subtitle}</span>` : ''}</div>
    <span class="cp-tile-arrow">${icon('arrow-up-right')}</span>
  </a>`;
}
function actionTile(iconName, title, subtitle, attributes, extraClass = '', tag = 'button') {
  return `<${tag} ${tag === 'button' ? 'type="button"' : ''} ${attributes} class="cp-tool ${extraClass}">
    <span class="cp-tool-icon">${icon(iconName)}</span><span class="cp-tool-copy"><strong>${title}</strong><small>${subtitle}</small></span>${icon('chevron-right')}
  </${tag}>`;
}

export function renderNavbar(currentView = 'home') {
  const profile = getActiveProfile();
  const isKid = profile.isKid;
  const unread = getUnreadNotificationCount();
  const app = isAppPlatform();
  const offline = isNativeAndroidApp();
  const discoveryActive = ['anime', 'cartoons', 'documentary', 'discover', 'dramas'].includes(currentView);
  const shortcut = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
  const navLink = (view, label) => `<a href="#${view}" class="cp-nav-link ${currentView === view ? 'active' : ''}" ${currentView === view ? 'aria-current="page"' : ''}>${label}</a>`;
  return `
    <nav class="cp-navbar" id="main-navbar" aria-label="Ana gezinme">
      <div class="cp-nav-shell">
        <a href="#home" class="cp-brand" aria-label="CinePulse Ana Sayfa">${renderSiteLogo()}CinePulse</a>
        <div class="cp-primary">
          ${navLink('home', 'Ana Sayfa')}${navLink('movies', isKid ? 'Animasyonlar' : 'Filmler')}${navLink('series', isKid ? 'Çizgi Diziler' : 'Diziler')}
          ${isKid ? navLink('anime', 'Anime') : `<button type="button" class="cp-nav-link cp-discovery-trigger ${discoveryActive ? 'active' : ''}" id="btn-desktop-hub" aria-expanded="false" aria-controls="hub-mega-dropdown">${icon('compass')}<span>Keşfet</span>${icon('chevron-down')}</button>`}
        </div>
        <div class="cp-search search-box">
          ${icon('search')}<input id="nav-search-input" type="search" class="cp-search-input" placeholder="Film, dizi, oyuncu ara…" aria-label="Film, dizi veya oyuncu ara" autocomplete="off" />
          <kbd>${shortcut}</kbd><a href="#discover" class="cp-search-filter" aria-label="Detaylı keşif filtreleri">${icon('sliders-horizontal')}</a>
          <div id="search-overlay" class="search-results-overlay glass-panel hidden"></div>
        </div>
        <div class="cp-nav-actions">
          ${window.CinePulseDesktop?.isDesktop ? `<button type="button" id="btn-desktop-update" class="cp-icon-button" title="GitHub sürüm sayfasını aç" aria-label="GitHub sürüm sayfasını aç">${icon('refresh-cw')}</button>` : ''}
          ${offline && isKid ? `<a href="#downloads" class="cp-nav-action cp-mobile-downloads" aria-label="İndirilenler" title="İndirilenler">${icon('download')}<span>İndirilenler</span></a>` : ''}
          ${app && !isKid ? `<a href="#livetv" class="cp-live ${currentView === 'livetv' ? 'active' : ''}"><span></span>Canlı TV</a>` : ''}
          <a href="#library" class="cp-nav-action ${currentView === 'library' ? 'active' : ''}" title="Listem" aria-label="Listem">${icon('bookmark')}<span>Listem</span></a>
          ${!isKid ? `<button type="button" data-open-decision-room class="cp-nav-action" title="Birlikte seç" aria-label="Birlikte seç">${icon('users-round')}<span>Birlikte</span></button>` : ''}
          <button type="button" id="btn-nav-notifications" class="cp-icon-button cp-bell" aria-label="Bildirimler${unread ? `, ${unread} okunmamış` : ''}" title="Bildirimler">${icon('bell')}<span id="nav-notif-badge" class="cp-notification-dot ${unread ? '' : 'hidden'}">${unread}</span></button>
          <button type="button" id="btn-nav-profile" class="cp-profile" aria-label="Profil: ${escapeText(profile.name)}" title="Profili yönet">${icon(profile.avatar || (isKid ? 'smile' : 'user'))}</button>
        </div>
      </div>
      ${!isKid ? `<span class="cp-menu-pointer" aria-hidden="true"></span><div class="cp-discovery-panel" id="hub-mega-dropdown" aria-label="Keşfet menüsü" inert>
        <div class="cp-discovery-heading"><div><span class="cp-eyebrow">İZLEMEYE DEĞER.</span><h2>Sıradaki hikâyeni bul.</h2><span class="cp-mobile-menu-title">${icon('compass')}Keşfet</span></div><button type="button" class="cp-icon-button" id="btn-close-discovery" aria-label="Keşfet menüsünü kapat">${icon('x')}</button></div>
        <div class="cp-discovery-grid">
          <div class="cp-featured-categories">
            ${categoryTile('movies', 'Filmler', 'Başka dünyalara açıl.')}${categoryTile('series', 'Diziler', 'Bir bölüm daha.')}
          </div>
          <div class="cp-genre-categories">
            ${categoryTile('anime', 'Anime')}${categoryTile('cartoons', 'Çizgi Diziler')}${categoryTile('documentary', 'Belgesel')}${categoryTile('dramas', 'Kısa Diziler', 'Kısa sürede, büyük hikâyeler.')}
          </div>
          <div class="cp-discovery-tools"><h3>Biraz ilham?</h3>
            <div class="cp-mobile-shortcuts">${actionTile('sliders-horizontal', 'Detaylı Keşif', 'Tür, yıl ve puana göre', 'href="#discover"', '', 'a')}</div>
            <div class="cp-personal-tools">
              ${actionTile('users-round', 'Birlikte', 'Beraber karar ver', 'data-open-decision-room')}
              ${actionTile('bookmark', 'Listem', 'Kaydettiklerin burada', 'href="#library"', '', 'a')}
            </div>
            <div class="cp-inspiration-tools">
              ${actionTile('dices', 'Şanslı Çark', 'Seçimi şansa bırak', 'id="btn-hub-random-spin"')}
              ${actionTile('sparkles', 'SÉRA', 'Sana özel öneriler', 'href="https://caca1403.github.io/dizionerisistemi/" target="_blank" rel="noopener noreferrer"', '', 'a')}
            </div>
            ${actionTile('bar-chart-3', 'Trakt.tv', 'İzleme geçmişini eşitle', 'id="btn-hub-trakt"', 'cp-trakt')}
            ${app ? actionTile('radio', 'Canlı TV', 'Canlı yayınları keşfet', 'href="#livetv"', '', 'a') : ''}
            ${offline ? actionTile('download', 'İndirilenler', 'Çevrimdışı izlemeye devam et', 'href="#downloads"', '', 'a') : ''}
          </div>
        </div>
        <div class="cp-discovery-footer"><a href="#discover" class="cp-desktop-discover">${icon('sliders-horizontal')}<strong>Detaylı Keşif</strong><span>Tür, yıl, puan. Tam senlik.</span>${icon('arrow-up-right')}</a>
          <a href="https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk" target="_blank" rel="noopener noreferrer" download="cinepulse.apk">${icon('smartphone')}<span>Android uygulamasını indir</span>${icon('external-link')}</a>
        </div>
      </div>` : ''}
    </nav>
    <div class="cp-menu-backdrop" id="cp-menu-backdrop" hidden></div>
`;
}

let navbarController;
export function attachNavbarEvents() {
  navbarController?.abort();
  navbarController = new AbortController();
  const { signal } = navbarController;
  const updateButton = document.getElementById('btn-desktop-update');
  updateButton?.addEventListener('click', async () => {
    updateButton.disabled = true;
    updateButton.setAttribute('aria-busy', 'true');
    try { await window.CinePulseDesktop.openReleasePage(); }
    finally { updateButton.disabled = false; updateButton.removeAttribute('aria-busy'); }
  }, { signal });
  const navbar = document.getElementById('main-navbar');
  const panel = document.getElementById('hub-mega-dropdown');
  const trigger = document.getElementById('btn-desktop-hub');
  const backdrop = document.getElementById('cp-menu-backdrop');
  let openedBy = trigger;
  function updateHeight() {
    document.documentElement.style.setProperty('--cp-nav-bottom', `${Math.ceil(navbar.getBoundingClientRect().bottom)}px`);
    document.documentElement.style.setProperty('--cp-header-height', `${Math.ceil(navbar.offsetHeight)}px`);
    if (trigger) { const rect = trigger.getBoundingClientRect(); document.documentElement.style.setProperty('--cp-trigger-center', `${rect.left + rect.width / 2}px`); }
  }
  const observer = new ResizeObserver(updateHeight);
  observer.observe(navbar);
  signal.addEventListener('abort', () => observer.disconnect(), { once: true });
  updateHeight();
  function setOpen(open, restoreFocus = false) {
    if (!panel) return;
    panel.inert = !open;
    panel.classList.toggle('open', open);
    trigger?.setAttribute('aria-expanded', String(open));
    backdrop.hidden = !open;
    if (open) document.getElementById('search-overlay')?.classList.add('hidden');
    if (!open && restoreFocus) openedBy?.focus();
  }
  [trigger].forEach(button => button?.addEventListener('click', () => {
    openedBy = button;
    setOpen(!panel?.classList.contains('open'));
  }, { signal }));
  trigger?.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      openedBy = trigger;
      setOpen(true);
      panel?.querySelector('a, button')?.focus();
    }
  }, { signal });
  document.getElementById('btn-close-discovery')?.addEventListener('click', () => setOpen(false, true), { signal });
  backdrop?.addEventListener('click', () => setOpen(false), { signal });
  document.addEventListener('click', e => {
    if (panel?.classList.contains('open') && !panel.contains(e.target) && !trigger?.contains(e.target)) setOpen(false);
    const overlay = document.getElementById('search-overlay');
    if (!e.target.closest('.cp-search')) overlay?.classList.add('hidden');
  }, { signal });
  document.addEventListener('focusin', e => {
    if (panel?.classList.contains('open') && !panel.contains(e.target) && e.target !== trigger) setOpen(false);
  }, { signal });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setOpen(false, true);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      setOpen(false);
      document.getElementById('nav-search-input')?.focus();
    }
  }, { signal });
  panel?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false), { signal }));
  document.getElementById('btn-hub-random-spin')?.addEventListener('click', () => { setOpen(false); openRandomPickerModal(); }, { signal });
  document.getElementById('btn-hub-trakt')?.addEventListener('click', () => { setOpen(false); openTraktModal(); }, { signal });
  document.querySelectorAll('[data-open-decision-room]').forEach(button => button.addEventListener('click', () => { setOpen(false); openDecisionRoomModal(); }, { signal }));
  document.getElementById('btn-nav-notifications')?.addEventListener('click', openNotificationCenterModal, { signal });
  document.getElementById('btn-nav-profile')?.addEventListener('click', openProfileModal, { signal });
  document.getElementById('nav-search-input')?.addEventListener('focus', () => setOpen(false), { signal });
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true, signal });
  window.addEventListener('resize', updateHeight, { passive: true, signal });
  onScroll();
  setupSearchInput('nav-search-input', 'search-overlay', signal);
}
/* ============================================================
   Search Input Handler
============================================================ */
function setupSearchInput(inputId, overlayId, signal) {
  const input = document.getElementById(inputId);
  const overlay = document.getElementById(overlayId);
  let timer = null;
  let searchGeneration = 0;
  signal?.addEventListener('abort', () => { clearTimeout(timer); searchGeneration++; }, { once: true });

  if (!input || !overlay) return;

  input.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    const generation = ++searchGeneration;
    clearTimeout(timer);
    if (query.length < 2) { overlay.classList.add('hidden'); overlay.innerHTML = ''; return; }

    overlay.innerHTML = '<div class="search-no-results" style="display:flex;align-items:center;gap:8px;padding:1rem;color:var(--text-muted);font-size:.85rem;"><span class="tv-loading-spinner" style="width:16px;height:16px;border-width:2px;"></span> Aranıyor...</div>';
    overlay.classList.remove('hidden');

    timer = setTimeout(async () => {
      try {
        const raw = await searchMulti(query);
        if (generation !== searchGeneration || signal?.aborted || !input.isConnected) return;
        const results = Array.isArray(raw) ? raw.slice(0, 8) : (raw?.results?.slice(0, 8) || []);

        const dramaRow = `
          <a href="#dramas?q=${encodeURIComponent(query)}" class="search-item search-item-drama" style="background:linear-gradient(135deg,rgba(88,28,135,.35),rgba(30,27,75,.55));border:1px solid rgba(168,85,247,.3);border-radius:10px;margin-top:6px;padding:.6rem .75rem;">
            <div style="width:36px;height:48px;border-radius:6px;background:rgba(168,85,247,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i data-lucide="sparkles" style="width:18px;height:18px;color:#c084fc;"></i>
            </div>
            <div class="search-item-info">
              <div class="search-item-title" style="color:#f3e8ff;font-weight:750;">Kısa Dizilerde Ara: "${escapeText(query)}"</div>
              <div class="search-item-meta">
                <span class="search-badge" style="background:#a855f7;color:#fff;">Özel Hub</span>
                <span style="color:#c4b5fd;">ReelShort & DramaBox</span>
              </div>
            </div>
          </a>`;

        if (!results.length) {
          overlay.innerHTML = `<div class="search-no-results" style="padding-bottom:.5rem;">TMDB Sonucu Bulunamadı</div>${dramaRow}`;
          overlay.classList.remove('hidden');
          renderIcons(overlay);
          attachClose();
          return;
        }

        const itemsHTML = results.map(item => {
          const isTv = item.media_type === 'tv' || !!item.first_air_date || (!item.release_date && !!item.name);
          const title = escapeText(item.title || item.name || 'İsimsiz');
          const year = (item.release_date || item.first_air_date || '').slice(0, 4);
          const poster = getImageUrl(item.poster_path, TMDB_IMAGE_SIZES.POSTER_SMALL || TMDB_IMAGE_SIZES.POSTER_MEDIUM);
          return `
            <a href="#detail?type=${isTv ? 'tv' : 'movie'}&id=${item.id}" class="search-item">
              <img src="${poster}" alt="${title}" class="search-item-img" onerror="this.src='https://via.placeholder.com/45x68/1e293b/64748b?text=N/A'" />
              <div class="search-item-info">
                <div class="search-item-title">${title}</div>
                <div class="search-item-meta">
                  <span class="search-badge">${isTv ? 'Dizi' : 'Film'}</span>
                  ${year ? `<span>${year}</span>` : ''}
                  <span class="search-rating">★ ${(item.vote_average || 0).toFixed(1)}</span>
                </div>
              </div>
            </a>`;
        }).join('');

        overlay.innerHTML = itemsHTML + dramaRow;
        overlay.classList.remove('hidden');
        renderIcons(overlay);
        attachClose();

        function attachClose() {
          overlay.querySelectorAll('.search-item').forEach(link => {
            link.addEventListener('click', () => {
              overlay.classList.add('hidden');
              input.value = '';
              document.getElementById('mobile-search-row')?.classList.add('hidden');
            });
          });
        }
      } catch (err) {
        if (generation !== searchGeneration || signal?.aborted) return;
        overlay.innerHTML = '<div class="search-no-results">Arama sırasında bir hata oluştu</div>';
      }
    }, 200);
  }, { signal });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { clearTimeout(timer); searchGeneration++; overlay.classList.add('hidden'); input.blur(); }
  }, { signal });
}

import { renderSiteLogo } from './BrandLogo.js';
import { renderIcons } from '../services/kabuk/icons.js';
import {
  searchMulti,
  getImageUrl,
  TMDB_IMAGE_SIZES,
  fetchPopularMovies,
  fetchPopularSeries,
  fetchPopularAnime,
  fetchCartoonSeries,
  fetchPopularDocumentaries,
  fetchTrending,
  fetchDiscoverMedia
} from '../services/icerik/tmdbApi.js';
import { parseDilArama } from '../services/kesif/dilArama.js';
import { openProfileModal } from './ProfileModal.js';
import { openRandomPickerModal } from './RandomPickerModal.js';
import { getActiveProfile } from '../services/altyapi/storage.js';
import { openNotificationCenterModal, getUnreadNotificationCount } from './NotificationCenterModal.js';
import { openDecisionRoomModal } from './DecisionRoomModal.js';
import { openTraktModal } from './TraktModal.js';
import { isNativeAndroidApp, isAppPlatform } from '../services/platform/platformBridge.js';

const icon = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
const escapeText = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const art = name => `${import.meta.env.BASE_URL}images/discovery/${name}.webp`;

/* ── Keşfet kategori görselleri ────────────────────────────────────────────
   Kullanıcı: "keşfette resimler içerikle alakasız". Kategori karoları sabit
   .webp dosyaları gösteriyordu; dosyalar kategorinin kendisiyle ilgisizdi.
   Artık her karo, o kategorinin GERÇEK içeriğinden seçilen bir TMDB sahnesini
   gösterir. Panel ilk açıldığında çekilir ve BİR GÜN önbellekte kalır (her
   açılışta yeniden istek atılmaz). Sabit .webp yalnız ilk kare yer tutucudur. */
const KATEGORI_ONBELLEK = 'cp_kesfet_kategori_v1';
const KATEGORI_OMUR = 24 * 60 * 60 * 1000;

const KATEGORI_KAYNAKLARI = {
  movies: () => fetchPopularMovies(1),
  series: () => fetchPopularSeries(1),
  anime: () => fetchPopularAnime(1),
  cartoons: () => fetchCartoonSeries(1),
  documentary: () => fetchPopularDocumentaries(1),
  dramas: () => fetchTrending('tv', 'week')
};

function kategoriOnbellegi() {
  try {
    const ham = JSON.parse(localStorage.getItem(KATEGORI_ONBELLEK) || '{}');
    if (!ham || typeof ham !== 'object') return {};
    const simdi = Date.now();
    const temiz = {};
    for (const [k, v] of Object.entries(ham)) {
      if (v && typeof v.url === 'string' && v.url && simdi - Number(v.at || 0) < KATEGORI_OMUR) temiz[k] = v;
    }
    return temiz;
  } catch (_) { return {}; }
}

function kategoriOnbelleginiYaz(onbellek) {
  try { localStorage.setItem(KATEGORI_ONBELLEK, JSON.stringify(onbellek)); } catch (_) {}
}

/** Kategoriye o günkü içerikten bir sahne (backdrop) bağlar. */
export async function kesfetKategoriGorselleriniYukle(panel) {
  if (!panel || typeof panel.querySelectorAll !== 'function') return;
  const gorseller = [...panel.querySelectorAll('.cp-category img[data-kategori]')];
  if (!gorseller.length) return;
  const onbellek = kategoriOnbellegi();
  // Önbellekte olan varsa HEMEN uygulanır: ağ beklemeden doğru görsel görünür.
  gorseller.forEach(img => {
    const kayit = onbellek[img.getAttribute('data-kategori') || ''];
    if (kayit?.url) img.src = kayit.url;
  });
  const eksik = [...new Set(gorseller
    .map(img => img.getAttribute('data-kategori') || '')
    .filter(kategori => kategori && !onbellek[kategori]?.url))];
  if (!eksik.length) return;
  // Sırayla (eşzamanlı değil): panel açılışında TMDB anahtarı yorulmasın.
  for (const kategori of eksik) {
    const getir = KATEGORI_KAYNAKLARI[kategori];
    if (!getir) continue;
    try {
      const liste = await getir();
      const uygun = (Array.isArray(liste) ? liste : []).find(x => x?.backdrop_path || x?.poster_path);
      const yol = uygun?.backdrop_path || uygun?.poster_path;
      if (!yol) continue;
      const url = getImageUrl(yol, TMDB_IMAGE_SIZES.BACKDROP_LARGE);
      onbellek[kategori] = { url, at: Date.now() };
      kategoriOnbelleginiYaz(onbellek);
      gorseller
        .filter(img => img.getAttribute('data-kategori') === kategori)
        .forEach(img => { img.src = url; });
    } catch (_) { /* görsel opsiyoneldir: yer tutucu kalır */ }
    await new Promise(cozum => setTimeout(cozum, 120));
  }
}

function categoryTile(view, title, subtitle = '') {
  const kayit = kategoriOnbellegi()[view];
  return `<a href="#${view}" class="cp-category cp-category-${view}">
    <img src="${kayit?.url || art(view)}" data-kategori="${view}" alt="" width="480" height="300" decoding="async" />
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
          <!-- NAVBAR SADELEŞTİRİLDİ (kullanıcı isteği 2026-10-17): üst çubukta
               gereksiz düğme yığılması vardı (Canlı TV, KANALIM, Birlikte,
               İndirilenler). Bu yolların TAMAMI Keşfet panosunda duruyor; üst
               çubukta yalnız günlük kullanılanlar kalır: Listem + bildirim +
               profil. Hiçbir özellik kaybolmadı, yalnız yeri değişti. -->
          <a href="#library" class="cp-nav-action ${currentView === 'library' ? 'active' : ''}" title="Listem" aria-label="Listem">${icon('bookmark')}<span>Listem</span></a>
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
            <!-- TEK IZGARA: eskiden üç ayrı grup (kısayollar / kişisel / ilham)
                 alt alta diziliyordu; panelin altı dağınık görünüyordu. Artık
                 hepsi aynı ölçüde, iki kolonluk tek ızgarada. -->
            <div class="cp-tool-grid">
              ${actionTile('sliders-horizontal', 'Detaylı Keşif', 'Tür, yıl ve puana göre', 'href="#discover"', '', 'a')}
              ${actionTile('users-round', 'Birlikte', 'Beraber karar ver', 'data-open-decision-room')}
              ${actionTile('bookmark', 'Listem', 'Kaydettiklerin burada', 'href="#library"', '', 'a')}
              ${actionTile('dices', 'Şanslı Çark', 'Seçimi şansa bırak', 'id="btn-hub-random-spin"')}
              ${actionTile('sparkles', 'SÉRA', 'Sana özel öneriler', 'href="https://caca1403.github.io/dizionerisistemi/" target="_blank" rel="noopener noreferrer"', '', 'a')}
              ${actionTile('bar-chart-3', 'Trakt.tv', 'İzleme geçmişini eşitle', 'id="btn-hub-trakt"', 'cp-trakt')}

              ${actionTile('clapperboard', 'KANALIM', 'Kişisel yayın akışın', 'href="#kanalim"', '', 'a')}
              ${offline ? actionTile('download', 'İndirilenler', 'Çevrimdışı izlemeye devam et', 'href="#downloads"', '', 'a') : ''}
            </div>
          </div>
        </div>
        <div class="cp-discovery-footer"><a href="https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk" target="_blank" rel="noopener noreferrer" download="cinepulse.apk">${icon('smartphone')}<span>Android uygulamasını indir</span>${icon('external-link')}</a>
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
    if (open) {
      document.getElementById('search-overlay')?.classList.add('hidden');
      // Kategori karoları gerçek içerik görsellerini panel açılınca alır
      // (statik .webp dosyaları kategoriyle ilgisizdi).
      kesfetKategoriGorselleriniYukle(panel);
    }
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
   Yerel afiş yedeği (CP-QUALITY-PACK)
   Kırık afiş eskiden via.placeholder.com'a düşüyordu: kapalı/filtreli
   ağda çalışmaz ve gri "N/A" kutusu çıkar. Yerine baş harfli SVG veri
   adresi kullanılır — ağ bağımlılığı yoktur.
============================================================ */
function basHarfAfisi(baslik) {
  const ham = String(baslik || '').trim().charAt(0).toUpperCase() || '?';
  const harf = ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ham] || ham;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="45" height="68" viewBox="0 0 45 68">'
    + '<rect width="45" height="68" rx="4" fill="#1a212b"/>'
    + `<text x="22.5" y="43" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="700" fill="#8b93a1">${harf}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function yerelAfisYedekleriBagla(kok) {
  kok?.querySelectorAll?.('img.search-item-img').forEach((gorsel) => {
    gorsel.addEventListener('error', () => {
      gorsel.src = basHarfAfisi(gorsel.alt);
    }, { once: true });
  });
}

/* ============================================================
   Doğal-dil arama → TMDB /discover
   Parse başarılıysa keşif isteğiyle birleştirilir; parse null ise
   mevcut searchMulti akışı birebir devam eder.
============================================================ */
async function aramaKesif(dil) {
  return fetchDiscoverMedia({
    type: dil.tur === 'dizi' ? 'tv' : 'movie',
    genreId: dil.turler.length ? dil.turler.join(',') : undefined,
    yearMin: dil.yilMin,
    yearMax: dil.yilMaks
  });
}

function dilAramaCip(dil) {
  const turYazi = dil.tur === 'dizi' ? 'Dizi' : dil.tur === 'film' ? 'Film' : '';
  const yilYazi = dil.yilMin ? `${dil.yilMin}+` : dil.yilMaks ? `${dil.yilMaks}-` : '';
  const metin = ['🎭', ...dil.onayEtiketleri, turYazi, yilYazi].filter(Boolean).join(' · ');
  return `<div class="search-chip" style="display:inline-block;margin:0 0 .6rem 0;padding:.3rem .7rem;border-radius:999px;font-size:.78rem;font-weight:800;border:1px solid rgba(168,85,247,.35);background:rgba(168,85,247,.1);color:#c084fc;">${escapeText(metin)}</div>`;
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
        const dil = parseDilArama(query);
        let sonuclar;
        let dilCip = null;
        if (dil) {
          try {
            sonuclar = await aramaKesif(dil);
            dilCip = dil;
          } catch (_) {
            // Ağ hatasında sessizce normal aramaya düş
            sonuclar = await searchMulti(query);
          }
        } else {
          sonuclar = await searchMulti(query);
        }
        if (generation !== searchGeneration || signal?.aborted || !input.isConnected) return;
        const results = Array.isArray(sonuclar) ? sonuclar.slice(0, 8) : (sonuclar?.results?.slice(0, 8) || []);

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
              <img src="${poster}" alt="${title}" class="search-item-img" loading="lazy" />
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

        overlay.innerHTML = (dilCip ? dilAramaCip(dilCip) : '') + itemsHTML + dramaRow;
        yerelAfisYedekleriBagla(overlay);
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

import { renderIcons } from '../services/icons.js';
/* ==========================================================================
   CinePulse Studio - Next-Gen Luxury Navigation System
   Desktop & Mobile: Unified visionOS Space Hub Command Center & Dynamic Island Dock
   ========================================================================== */

import { searchMulti, getImageUrl, TMDB_IMAGE_SIZES, fetchTrending } from '../services/tmdbApi.js';
import { openProfileModal, triggerProfileSwitchTransition } from './ProfileModal.js';
import { getActiveProfile, setActiveProfile, getProfiles } from '../services/storage.js';
import { openNotificationCenterModal, getUnreadNotificationCount, updateNotificationBellBadge } from './NotificationCenterModal.js';
import { openDecisionRoomModal } from './DecisionRoomModal.js';

export function renderNavbar(currentView = 'home') {
  const activeProfile = getActiveProfile();
  const unreadCount = getUnreadNotificationCount();

  const navbarHTML = `
    <!-- Top Universal Header -->
    <nav class="navbar" id="main-navbar">
      <div class="nav-container">
        <!-- Left: Brand Logo & Desktop Segmented Navigation Track -->
        <div class="nav-left-group">
          <a href="#home" class="nav-brand" id="nav-brand-logo" title="CinePulse Studio">
            <div class="brand-logo-icon">
              <i data-lucide="clapperboard" style="width:18px; height:18px; color:#fff;"></i>
            </div>
            <span class="brand-name">Cine<span class="brand-highlight">Pulse</span></span>
          </a>

          <!-- Desktop Apple-Style Segmented Navigation (Clean & Uncluttered) -->
          <ul class="nav-links desktop-nav-links">
            ${activeProfile.isKid ? `
              <li><a href="#home" class="nav-link ${currentView === 'home' ? 'active' : ''}">Ana Sayfa</a></li>
              <li><a href="#movies" class="nav-link ${currentView === 'movies' ? 'active' : ''}">Animasyonlar</a></li>
              <li><a href="#series" class="nav-link ${currentView === 'series' ? 'active' : ''}">Çizgi Diziler</a></li>
              <li><a href="#anime" class="nav-link ${currentView === 'anime' ? 'active' : ''}">Anime</a></li>
              <li><a href="#library" class="nav-link ${currentView === 'library' ? 'active' : ''}">Listem</a></li>
            ` : `
              <li><a href="#home" class="nav-link ${currentView === 'home' ? 'active' : ''}">Ana Sayfa</a></li>
              <li><a href="#movies" class="nav-link ${currentView === 'movies' ? 'active' : ''}">Filmler</a></li>
              <li><a href="#series" class="nav-link ${currentView === 'series' ? 'active' : ''}">Diziler</a></li>
              <li>
                <a href="#dramas" class="nav-link nav-link-dramas ${currentView === 'dramas' ? 'active' : ''}" title="ReelShort &amp; DramaBox Mini Dizileri">
                  <span>Kısa Dizi</span>
                  <span class="nav-drama-tag">REEL</span>
                </a>
              </li>

              <!-- Desktop Universal Hub Trigger Button -->
              <li>
                <button type="button" id="btn-desktop-hub" class="nav-link nav-link-hub-trigger" title="CinePulse Evreni &amp; Tüm Kategoriler">
                  <i data-lucide="sparkles" style="width: 14px; height: 14px; color: #c084fc;"></i>
                  <span>Evren</span>
                  <span class="nav-hub-badge">HUB</span>
                </button>
              </li>

              <li><a href="#library" class="nav-link ${currentView === 'library' ? 'active' : ''}">Listem</a></li>
            `}
          </ul>
        </div>

        <!-- Right: Actions Cluster (Desktop & Mobile Adaptive) -->
        <div class="nav-actions">
          ${!activeProfile.isKid ? `
            <!-- Live TV Pill (Desktop Only) -->
            <a href="#livetv" class="btn-nav-live desktop-only ${currentView === 'livetv' ? 'active' : ''}" title="Canlı TV Yayınları">
              <span class="live-dot-pulse"></span>
              <span>CANLI</span>
            </a>

            <!-- Birlikte Seç Pill (Desktop Only) -->
            <button data-open-decision-room class="btn-nav-action-pill desktop-only" title="Arkadaşlarınla Anonim Ortak Seçim">
              <i data-lucide="users-round" style="width: 14px; height: 14px;"></i>
              <span>Birlikte</span>
            </button>
          ` : ''}

          <!-- Desktop Search Box (Smooth Expandable) -->
          <div class="search-box desktop-search-box desktop-only">
            <i data-lucide="search" class="search-icon"></i>
            <input type="text" id="nav-search-input" class="search-input" placeholder="Ara..." autocomplete="off" />
            <span class="search-kbd">⌘K</span>
            <div id="search-overlay" class="search-results-overlay glass-panel hidden"></div>
          </div>

          <!-- Notification Bell Button -->
          <button id="btn-nav-notifications" class="btn-action-icon btn-nav-bell" title="Bildirimler">
            <i data-lucide="bell" style="width: 16px; height: 16px;"></i>
            <span id="nav-notif-badge" class="nav-notif-dot ${unreadCount > 0 ? '' : 'hidden'}">${unreadCount}</span>
          </button>

          <!-- Profile Switcher Button (Compact Circular Avatar) -->
          <button id="btn-nav-profile" class="btn-nav-avatar" title="Profil: ${activeProfile.name}">
            <div class="nav-avatar-circle" style="border-color: ${activeProfile.color || '#f59e0b'}; background: ${activeProfile.color || '#f59e0b'}22;">
              <i data-lucide="${activeProfile.avatar || (activeProfile.isKid ? 'smile' : 'user')}" style="width: 16px; height: 16px; color: ${activeProfile.color || '#f59e0b'};"></i>
            </div>
          </button>

          <!-- Mobile Only: Search Trigger Icon -->
          <button id="btn-mobile-search-toggle" class="btn-action-icon mobile-only" aria-label="Arama Yap">
            <i data-lucide="search" style="width: 18px; height: 18px;"></i>
          </button>
        </div>
      </div>

      <!-- Full-Width Mobile Expandable Search Row -->
      <div id="mobile-search-row" class="mobile-search-row glass-panel hidden">
        <div class="mobile-search-input-wrapper">
          <i data-lucide="search" class="search-icon"></i>
          <input type="text" id="mobile-search-input" class="mobile-search-input" placeholder="Dizi, film veya kısa dizi ara..." autocomplete="off" />
          <button id="btn-mobile-search-close" class="btn-icon">
            <i data-lucide="x"></i>
          </button>
        </div>
        <div id="mobile-search-overlay" class="search-results-overlay glass-panel hidden"></div>
      </div>
    </nav>

    <!-- ====================================================================
         Next-Gen Mobile "Dynamic Glass Capsule" Dock
         Ultra Clean 4-Item Layout + Floating Center Glow "✦ EVREN" Orb
         ==================================================================== -->
    <div class="mobile-dynamic-dock" id="mobile-bottom-dock">
      <a href="#home" class="dynamic-dock-item ${currentView === 'home' ? 'active' : ''}">
        <i data-lucide="home"></i>
        <span>Ana Sayfa</span>
      </a>

      <!-- Kısa Dizi with glowing REEL dot -->
      <a href="#dramas" class="dynamic-dock-item dynamic-dock-dramas ${currentView === 'dramas' ? 'active' : ''}" title="Reel Kısa Diziler">
        <div class="dock-icon-rel">
          <i data-lucide="clapperboard"></i>
          <span class="dock-micro-dot"></span>
        </div>
        <span>Kısa Dizi</span>
      </a>

      <!-- Center Super FAB: Glowing Hub Orb -->
      <button class="dynamic-dock-hub-orb" id="btn-open-mobile-hub" aria-label="CinePulse Evreni &amp; Hub">
        <div class="hub-orb-inner">
          <i data-lucide="sparkles" style="width: 20px; height: 20px; color: #fff;"></i>
        </div>
        <span class="hub-orb-label">EVREN</span>
      </button>

      <a href="#discover" class="dynamic-dock-item ${currentView === 'discover' ? 'active' : ''}">
        <i data-lucide="compass"></i>
        <span>Keşfet</span>
      </a>

      <a href="#library" class="dynamic-dock-item ${currentView === 'library' ? 'active' : ''}">
        <i data-lucide="bookmark"></i>
        <span>Listem</span>
      </a>
    </div>

    <!-- ====================================================================
         Universal "CinePulse Evreni" Space Hub Command Center (PC & Mobile)
         Desktop: Floating Acrylic Spatial Modal / Mobile: visionOS Bottom Sheet
         ==================================================================== -->
    <div class="space-hub-backdrop hidden" id="space-hub-backdrop">
      <div class="space-hub-dialog" id="space-hub-dialog">
        <!-- Ambient Radial Aura -->
        <div class="hub-ambient-glow"></div>

        <!-- Mobile Sheet Drag Handle -->
        <div class="hub-sheet-handle-wrap mobile-only-flex">
          <div class="hub-sheet-handle"></div>
        </div>

        <!-- Hub Top Header -->
        <div class="hub-header">
          <div class="hub-header-left">
            <div class="hub-header-icon-box">
              <i data-lucide="sparkles" style="width: 22px; height: 22px; color: #ffffff;"></i>
            </div>
            <div class="hub-header-titles">
              <div class="hub-title-line">
                <h3 class="hub-header-title">CinePulse Evreni</h3>
                <span class="hub-title-badge">STUDIO</span>
              </div>
              <p class="hub-header-sub">Sinema, diziler, canlı yayınlar ve stüdyo araçları</p>
            </div>
          </div>
          <button class="hub-close-btn" id="btn-close-space-hub" aria-label="Kapat (ESC)" title="Kapat (ESC)">
            <i data-lucide="x" style="width: 18px; height: 18px;"></i>
          </button>
        </div>

        <!-- Hub Scrollable Content -->
        <div class="hub-scroll-body">
          <!-- 1. Flagships: Filmler & Diziler (Both Star Giants Together!) -->
          <div class="hub-section-head">
            <span class="hub-section-tag">ANA KATALOG</span>
            <div class="hub-section-line"></div>
          </div>
          <div class="hub-flagships-grid">
            <a href="#movies" class="hub-flagship-card card-film-glow hub-nav-trigger">
              <div class="flagship-glass-tint"></div>
              <div class="flagship-icon-box" style="background: linear-gradient(135deg, #0284c7, #06b6d4);">
                <i data-lucide="film" style="width: 24px; height: 24px; color: #fff;"></i>
              </div>
              <div class="flagship-info">
                <div class="flagship-heading">
                  <span class="flagship-name">Filmler</span>
                  <span class="flagship-badge badge-cyan">4K UHD</span>
                </div>
                <span class="flagship-sub">Yerli &amp; Yabancı Gişe Filmleri</span>
              </div>
              <div class="flagship-arrow-box">
                <i data-lucide="arrow-up-right" style="width: 16px; height: 16px;"></i>
              </div>
            </a>

            <a href="#series" class="hub-flagship-card card-series-glow hub-nav-trigger">
              <div class="flagship-glass-tint"></div>
              <div class="flagship-icon-box" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">
                <i data-lucide="tv" style="width: 24px; height: 24px; color: #fff;"></i>
              </div>
              <div class="flagship-info">
                <div class="flagship-heading">
                  <span class="flagship-name">Diziler</span>
                  <span class="flagship-badge badge-amber">TREND</span>
                </div>
                <span class="flagship-sub">Popüler Yapımlar &amp; Tüm Sezonlar</span>
              </div>
              <div class="flagship-arrow-box">
                <i data-lucide="arrow-up-right" style="width: 16px; height: 16px;"></i>
              </div>
            </a>
          </div>

          <!-- 2. Special Formats: Kısa Diziler & Canlı TV -->
          <div class="hub-section-head">
            <span class="hub-section-tag">ÖZEL YAYINLAR &amp; MİNİ FORMAT</span>
            <div class="hub-section-line"></div>
          </div>
          <div class="hub-specials-grid">
            <a href="#dramas" class="hub-special-card card-dramas-glow hub-nav-trigger">
              <div class="special-icon-box" style="background: linear-gradient(135deg, #7c3aed, #ec4899);">
                <i data-lucide="clapperboard" style="width: 22px; height: 22px; color: #fff;"></i>
              </div>
              <div class="special-info">
                <div class="special-heading">
                  <span class="special-name">Kısa Diziler</span>
                  <span class="special-badge badge-vip">VIP REEL</span>
                </div>
                <span class="special-sub">DramaBox &amp; ReelShort Dikey Dizileri</span>
              </div>
            </a>

            <a href="#livetv" class="hub-special-card card-livetv-glow hub-nav-trigger">
              <div class="special-icon-box" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                <i data-lucide="radio" style="width: 22px; height: 22px; color: #fff;"></i>
              </div>
              <div class="special-info">
                <div class="special-heading">
                  <span class="special-name">Canlı TV</span>
                  <span class="special-badge badge-live"><span class="badge-live-dot"></span>CANLI</span>
                </div>
                <span class="special-sub">30+ Ulusal &amp; Tematik Kanal</span>
              </div>
            </a>
          </div>

          <!-- 3. Curated Genres: Anime, Çizgi Dizi, Belgesel, Gelişmiş Keşfet -->
          <div class="hub-section-head">
            <span class="hub-section-tag">TÜRLER &amp; KOLEKSİYONLAR</span>
            <div class="hub-section-line"></div>
          </div>
          <div class="hub-genres-grid">
            <a href="#anime" class="hub-genre-card hub-nav-trigger">
              <div class="genre-icon-box" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">
                <i data-lucide="sparkles" style="width: 18px; height: 18px;"></i>
              </div>
              <div class="genre-info">
                <span class="genre-name">Anime Dünyası</span>
                <span class="genre-sub">Shonen, Seinen &amp; Filmler</span>
              </div>
            </a>

            <a href="#cartoons" class="hub-genre-card hub-nav-trigger">
              <div class="genre-icon-box" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
                <i data-lucide="palette" style="width: 18px; height: 18px;"></i>
              </div>
              <div class="genre-info">
                <span class="genre-name">Çizgi Diziler</span>
                <span class="genre-sub">Nostalji &amp; Animasyon</span>
              </div>
            </a>

            <a href="#documentary" class="hub-genre-card hub-nav-trigger">
              <div class="genre-icon-box" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">
                <i data-lucide="book-open" style="width: 18px; height: 18px;"></i>
              </div>
              <div class="genre-info">
                <span class="genre-name">Belgesel Kulübü</span>
                <span class="genre-sub">Bilim, Doğa &amp; Tarih</span>
              </div>
            </a>

            <a href="#discover" class="hub-genre-card hub-nav-trigger">
              <div class="genre-icon-box" style="background: rgba(168, 85, 247, 0.15); color: #c084fc;">
                <i data-lucide="sliders-horizontal" style="width: 18px; height: 18px;"></i>
              </div>
              <div class="genre-info">
                <span class="genre-name">Detaylı Keşif</span>
                <span class="genre-sub">Yıl, Tür &amp; Filtreler</span>
              </div>
            </a>
          </div>

          <!-- 4. Interactive Studio Tools: Birlikte Seç & Şanslı Çark -->
          <div class="hub-section-head">
            <span class="hub-section-tag">İNTERAKTİF STÜDYO</span>
            <div class="hub-section-line"></div>
          </div>
          <div class="hub-tools-grid">
            <button type="button" data-open-decision-room class="hub-tool-item tool-decision">
              <div class="tool-icon-box" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">
                <i data-lucide="users-round" style="width: 20px; height: 20px; color: #fff;"></i>
              </div>
              <div class="tool-info">
                <span class="tool-name">Birlikte Seç (Ortak Karar Odası)</span>
                <span class="tool-sub">Arkadaşlarınla anlık oda kur, anonim oy kullan ve ortak filmini seç</span>
              </div>
              <i data-lucide="chevron-right" class="tool-chevron"></i>
            </button>

            <button type="button" id="btn-hub-random-spin" class="hub-tool-item tool-spin">
              <div class="tool-icon-box" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">
                <i data-lucide="dices" style="width: 20px; height: 20px; color: #fff;"></i>
              </div>
              <div class="tool-info">
                <span class="tool-name">Şanslı Çark: "Ne İzlesem?"</span>
                <span class="tool-sub">Kararsız mısın? Tek tıkla rastgele popüler bir yapım başlatsın</span>
              </div>
              <i data-lucide="sparkles" class="tool-chevron" style="color: #fbbf24;"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  return navbarHTML;
}

let attachedScrollHandler = null;
let attachedSearchShortcut = null;
let attachedOutsideSearchClick = false;

export function attachNavbarEvents(onNavigate) {
  const navbar = document.getElementById('main-navbar');
  const mobileSearchRow = document.getElementById('mobile-search-row');
  const mobileSearchToggleBtn = document.getElementById('btn-mobile-search-toggle');
  const mobileSearchCloseBtn = document.getElementById('btn-mobile-search-close');

  if (attachedScrollHandler) window.removeEventListener('scroll', attachedScrollHandler);
  attachedScrollHandler = () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  attachedScrollHandler();
  window.addEventListener('scroll', attachedScrollHandler, { passive: true });

  // Mobile Search Toggle
  if (mobileSearchToggleBtn && mobileSearchRow) {
    mobileSearchToggleBtn.addEventListener('click', () => {
      mobileSearchRow.classList.toggle('hidden');
      if (!mobileSearchRow.classList.contains('hidden')) {
        document.getElementById('mobile-search-input')?.focus();
      }
      renderIcons();
    });
  }

  if (mobileSearchCloseBtn && mobileSearchRow) {
    mobileSearchCloseBtn.addEventListener('click', () => {
      mobileSearchRow.classList.add('hidden');
    });
  }

  const notifBtn = document.getElementById('btn-nav-notifications');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      openNotificationCenterModal();
    });
  }

  const profileBtn = document.getElementById('btn-nav-profile');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      openProfileModal();
    });
  }

  // ====================================================================
  // Universal Space Hub Command Center Event Handlers (PC & Mobile)
  // ====================================================================
  const hubBackdrop = document.getElementById('space-hub-backdrop');
  const hubOpenMobileBtn = document.getElementById('btn-open-mobile-hub');
  const hubOpenDesktopBtn = document.getElementById('btn-desktop-hub');
  const hubCloseBtn = document.getElementById('btn-close-space-hub');

  function openSpaceHub() {
    if (!hubBackdrop) return;
    hubBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    renderIcons(hubBackdrop);
  }

  function closeSpaceHub() {
    if (!hubBackdrop) return;
    hubBackdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (hubOpenMobileBtn) {
    hubOpenMobileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openSpaceHub();
    });
  }

  if (hubOpenDesktopBtn) {
    hubOpenDesktopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openSpaceHub();
    });
  }

  if (hubCloseBtn) {
    hubCloseBtn.addEventListener('click', closeSpaceHub);
  }

  if (hubBackdrop) {
    hubBackdrop.addEventListener('click', (e) => {
      if (e.target === hubBackdrop) closeSpaceHub();
    });

    hubBackdrop.querySelectorAll('.hub-nav-trigger').forEach(trigger => {
      trigger.addEventListener('click', () => {
        closeSpaceHub();
      });
    });
  }

  // Birlikte Seç (Karar Odası) handlers
  document.querySelectorAll('[data-open-decision-room]').forEach((decisionRoomBtn) => {
    decisionRoomBtn.addEventListener('click', () => {
      closeSpaceHub();
      openDecisionRoomModal();
    });
  });

  // Random Title Spinner: "Ne İzlesem?"
  const randomSpinBtn = document.getElementById('btn-hub-random-spin');
  if (randomSpinBtn) {
    randomSpinBtn.addEventListener('click', async () => {
      closeSpaceHub();
      try {
        const randomPage = Math.floor(Math.random() * 3) + 1;
        const res = await fetchTrending('all', 'week', randomPage);
        const items = res?.results?.filter(i => i.poster_path && (i.title || i.name)) || [];
        if (items.length > 0) {
          const picked = items[Math.floor(Math.random() * items.length)];
          const mediaType = picked.media_type === 'tv' ? 'tv' : 'movie';
          window.location.hash = `#detail?type=${mediaType}&id=${picked.id}`;
        } else {
          window.location.hash = '#movies';
        }
      } catch (err) {
        window.location.hash = '#movies';
      }
    });
  }

  // ESC key closes Space Hub
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hubBackdrop && !hubBackdrop.classList.contains('hidden')) {
      closeSpaceHub();
    }
  });

  // Attach search handlers for both Desktop and Mobile search inputs
  setupSearchInput('nav-search-input', 'search-overlay');
  setupSearchInput('mobile-search-input', 'mobile-search-overlay');
  if (!attachedOutsideSearchClick) {
    attachedOutsideSearchClick = true;
    document.addEventListener('click', (event) => {
      for (const [inputId, overlayId] of [
        ['nav-search-input', 'search-overlay'],
        ['mobile-search-input', 'mobile-search-overlay']
      ]) {
        const input = document.getElementById(inputId);
        const overlay = document.getElementById(overlayId);
        if (overlay && !input?.contains(event.target) && !overlay.contains(event.target)) {
          overlay.classList.add('hidden');
        }
      }
    });
  }

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search input
  if (attachedSearchShortcut) document.removeEventListener('keydown', attachedSearchShortcut);
  attachedSearchShortcut = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const isMobile = window.innerWidth <= 992;
      if (isMobile && mobileSearchRow) {
        mobileSearchRow.classList.remove('hidden');
        document.getElementById('mobile-search-input')?.focus();
      } else {
        document.getElementById('nav-search-input')?.focus();
      }
    }
  };
  window.addEventListener('keydown', attachedSearchShortcut);
}

function setupSearchInput(inputId, overlayId) {
  const input = document.getElementById(inputId);
  const overlay = document.getElementById(overlayId);
  let searchTimeout = null;

  if (input && overlay) {
    input.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      clearTimeout(searchTimeout);

      if (query.length < 2) {
        overlay.classList.add('hidden');
        overlay.innerHTML = '';
        return;
      }

      // Show temporary searching indicator
      overlay.innerHTML = '<div class="search-no-results" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:1rem;color:var(--text-muted);font-size:0.85rem;"><span class="tv-loading-spinner" style="width:16px;height:16px;border-width:2px;"></span> Aranıyor...</div>';
      overlay.classList.remove('hidden');

      searchTimeout = setTimeout(async () => {
        try {
          const rawData = await searchMulti(query);
          const results = Array.isArray(rawData) ? rawData.slice(0, 8) : (rawData?.results ? rawData.results.slice(0, 8) : []);

          const dramaSearchItemHTML = `
            <a href="#dramas?q=${encodeURIComponent(query)}" class="search-item search-item-drama" style="background: linear-gradient(135deg, rgba(88, 28, 135, 0.35), rgba(30, 27, 75, 0.55)); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 10px; margin-top: 6px; padding: 0.6rem 0.75rem;">
              <div style="width: 36px; height: 48px; border-radius: 6px; background: rgba(168, 85, 247, 0.25); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i data-lucide="sparkles" style="width: 18px; height: 18px; color: #c084fc;"></i>
              </div>
              <div class="search-item-info">
                <div class="search-item-title" style="color: #f3e8ff; font-weight: 750;">🎭 Kısa Dizilerde Ara: "${query}"</div>
                <div class="search-item-meta">
                  <span class="search-badge" style="background: #a855f7; color: #fff;">Özel Hub</span>
                  <span style="color: #c4b5fd;">ReelShort &amp; DramaBox</span>
                </div>
              </div>
            </a>
          `;

          if (!results || results.length === 0) {
            overlay.innerHTML = `
              <div class="search-no-results" style="padding-bottom: 0.5rem;">TMDB Sonucu Bulunamadı</div>
              ${dramaSearchItemHTML}
            `;
            overlay.classList.remove('hidden');
            renderIcons(overlay);
            attachSearchClickEvents();
            return;
          }

          const tmdbItemsHTML = results.map(item => {
            const isTv = item.media_type === 'tv' || !!item.first_air_date || (!item.release_date && !!item.name);
            const title = item.title || item.name || 'İsimsiz İçerik';
            const year = (item.release_date || item.first_air_date || '').slice(0, 4);
            const poster = getImageUrl(item.poster_path, TMDB_IMAGE_SIZES.POSTER_SMALL || TMDB_IMAGE_SIZES.POSTER_MEDIUM);
            const typeLabel = isTv ? 'Dizi' : 'Film';
            const route = `#detail?type=${isTv ? 'tv' : 'movie'}&id=${item.id}`;

            return `
              <a href="${route}" class="search-item">
                <img src="${poster}" alt="${title}" class="search-item-img" onerror="this.src='https://via.placeholder.com/45x68/1e293b/64748b?text=N/A'" />
                <div class="search-item-info">
                  <div class="search-item-title">${title}</div>
                  <div class="search-item-meta">
                    <span class="search-badge">${typeLabel}</span>
                    ${year ? `<span>${year}</span>` : ''}
                    <span class="search-rating">★ ${(item.vote_average || 0).toFixed(1)}</span>
                  </div>
                </div>
              </a>
            `;
          }).join('');

          overlay.innerHTML = `${tmdbItemsHTML}${dramaSearchItemHTML}`;
          overlay.classList.remove('hidden');
          renderIcons(overlay);
          attachSearchClickEvents();

          function attachSearchClickEvents() {
            overlay.querySelectorAll('.search-item').forEach(link => {
              link.addEventListener('click', () => {
                overlay.classList.add('hidden');
                input.value = '';
                const mobileSearchRow = document.getElementById('mobile-search-row');
                if (mobileSearchRow) mobileSearchRow.classList.add('hidden');
              });
            });
          }
        } catch (err) {
          console.error('[Search Overlay Error]', err);
          overlay.innerHTML = '<div class="search-no-results">Arama sırasında bir hata oluştu</div>';
        }
      }, 200);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        overlay.classList.add('hidden');
        input.blur();
      }
    });
  }
}

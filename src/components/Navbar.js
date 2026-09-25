import { renderIcons } from '../services/icons.js';
/* ==========================================================================
   CinePulse Studio – v3 Navigation
   Desktop : Floating bar  →  [Logo | Links] ————— [Canlı | Birlikte | Listem | Search | Bell | Profile]
   Mobile  : Top bar (Logo + Search + Bell + Profile)  +  Bottom Dock
             Dock: Ana Sayfa | Canlı | ✦Evren | Birlikte | Listem
   Hub     : Mega-dropdown (desktop) / Bottom-sheet (mobile)
             Contains ONLY items NOT in the primary nav:
             Anime, Çizgi, Belgesel, Detaylı Keşif, Şanslı Çark, Kısa Diziler
   ========================================================================== */

import { searchMulti, getImageUrl, TMDB_IMAGE_SIZES } from '../services/tmdbApi.js';
import { openProfileModal } from './ProfileModal.js';
import { openRandomPickerModal } from './RandomPickerModal.js';
import { getActiveProfile } from '../services/storage.js';
import { openNotificationCenterModal, getUnreadNotificationCount } from './NotificationCenterModal.js';
import { openDecisionRoomModal } from './DecisionRoomModal.js';
import { openTraktModal } from './TraktModal.js';
import { isNativeAndroidApp } from '../services/appUpdater.js';

export function renderNavbar(currentView = 'home') {
  const activeProfile = getActiveProfile();
  const unreadCount = getUnreadNotificationCount();
  const isKid = activeProfile.isKid;
  const showOfflineDownloads = isNativeAndroidApp();

  return `
    <!-- ================================================================
         TOP NAVBAR
    ================================================================ -->
    <nav class="navbar" id="main-navbar">
      <div class="nav-container">

        <!-- Left: Brand + Desktop Primary Links -->
        <div class="nav-left-group">
          <a href="#home" class="nav-brand" id="nav-brand-logo" title="CinePulse Studio">
            <div class="brand-logo-icon">
              <i data-lucide="clapperboard" style="width:17px;height:17px;color:#fff;"></i>
            </div>
            <span class="brand-name">Cine<span class="brand-highlight">Pulse</span></span>
          </a>

          <!-- Desktop Primary Nav Links -->
          <ul class="nav-links desktop-nav-links">
            ${isKid ? `
              <li><a href="#home" class="nav-link ${currentView === 'home' ? 'active' : ''}">Ana Sayfa</a></li>
              <li><a href="#movies" class="nav-link ${currentView === 'movies' ? 'active' : ''}">Animasyonlar</a></li>
              <li><a href="#series" class="nav-link ${currentView === 'series' ? 'active' : ''}">Çizgi Diziler</a></li>
              <li><a href="#anime" class="nav-link ${currentView === 'anime' ? 'active' : ''}">Anime</a></li>
            ` : `
              <li><a href="#home" class="nav-link ${currentView === 'home' ? 'active' : ''}">Ana Sayfa</a></li>

              <!-- Evren Hub Trigger – everything else lives here -->
              <li class="nav-hub-li" id="nav-hub-li">
                <button type="button" id="btn-desktop-hub" class="nav-link nav-link-hub-trigger" aria-haspopup="true" aria-expanded="false">
                  <i data-lucide="sparkles" style="width:13px;height:13px;color:#a855f7;"></i>
                  <span>Evren</span>
                  <i data-lucide="chevron-down" class="hub-caret" style="width:11px;height:11px;"></i>
                </button>

                <!-- Mega Dropdown Panel -->
                <div class="hub-mega-dropdown" id="hub-mega-dropdown" role="menu">
                  <div class="hub-mega-inner">

                    <!-- Col 1: Main content -->
                    <div class="hub-mega-col">
                      <div class="hub-mega-section-label">İÇERİK</div>
                      <a href="#movies" class="hub-mega-item hub-nav-trigger">
                        <div class="hub-mega-icon" style="background:rgba(2,132,199,.18);color:#38bdf8;">
                          <i data-lucide="film" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Filmler</div>
                          <div class="hub-mega-item-sub">Yerli & Yabancı Gişe</div>
                        </div>
                        <span class="hub-mega-badge" style="background:rgba(2,132,199,.2);color:#38bdf8;">4K UHD</span>
                      </a>
                      <a href="#series" class="hub-mega-item hub-nav-trigger">
                        <div class="hub-mega-icon" style="background:rgba(245,158,11,.15);color:#f59e0b;">
                          <i data-lucide="tv" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Diziler</div>
                          <div class="hub-mega-item-sub">Popüler & Tüm Sezonlar</div>
                        </div>
                        <span class="hub-mega-badge" style="background:rgba(245,158,11,.15);color:#f59e0b;">TREND</span>
                      </a>
                      <a href="#dramas" class="hub-mega-item hub-nav-trigger">
                        <div class="hub-mega-icon" style="background:rgba(168,85,247,.15);color:#c084fc;">
                          <i data-lucide="clapperboard" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Kısa Diziler</div>
                          <div class="hub-mega-item-sub">DramaBox & ReelShort</div>
                        </div>
                        <span class="hub-mega-badge" style="background:rgba(168,85,247,.15);color:#c084fc;">REEL</span>
                      </a>
                    </div>

                    <!-- Divider -->
                    <div class="hub-mega-divider"></div>

                    <!-- Col 2: Genres -->
                    <div class="hub-mega-col">
                      <div class="hub-mega-section-label">TÜRLER</div>
                      <a href="#anime" class="hub-mega-item hub-nav-trigger">
                        <div class="hub-mega-icon" style="background:rgba(56,189,248,.15);color:#38bdf8;">
                          <i data-lucide="sparkles" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Anime Dünyası</div>
                          <div class="hub-mega-item-sub">Shonen, Seinen</div>
                        </div>
                      </a>
                      <a href="#cartoons" class="hub-mega-item hub-nav-trigger">
                        <div class="hub-mega-icon" style="background:rgba(245,158,11,.15);color:#f59e0b;">
                          <i data-lucide="palette" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Çizgi Diziler</div>
                          <div class="hub-mega-item-sub">Nostalji & Animasyon</div>
                        </div>
                      </a>
                      <a href="#documentary" class="hub-mega-item hub-nav-trigger">
                        <div class="hub-mega-icon" style="background:rgba(16,185,129,.15);color:#10b981;">
                          <i data-lucide="book-open" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Belgesel</div>
                          <div class="hub-mega-item-sub">Bilim, Doğa & Tarih</div>
                        </div>
                      </a>
                      <a href="#discover" class="hub-mega-item hub-nav-trigger">
                        <div class="hub-mega-icon" style="background:rgba(99,102,241,.15);color:#818cf8;">
                          <i data-lucide="sliders-horizontal" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Detaylı Keşif</div>
                          <div class="hub-mega-item-sub">Yıl, Tür & Filtreler</div>
                        </div>
                      </a>
                    </div>

                    <!-- Divider -->
                    <div class="hub-mega-divider"></div>

                    <!-- Col 3: Tools -->
                    <div class="hub-mega-col">
                      <div class="hub-mega-section-label">ARAÇLAR</div>
                      <button type="button" id="btn-hub-random-spin" class="hub-mega-item hub-tool-btn">
                        <div class="hub-mega-icon" style="background:rgba(245,158,11,.15);color:#fbbf24;">
                          <i data-lucide="dices" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Şanslı Çark</div>
                          <div class="hub-mega-item-sub">Rastgele yapım seç</div>
                        </div>
                      </button>
                      <a href="https://caca1403.github.io/dizionerisistemi/" target="_blank" rel="noopener noreferrer" id="btn-hub-series-recommend" class="hub-mega-item hub-tool-btn" aria-label="SÉRA Dizi Öneri Sistemi'ni aç">
                        <div class="hub-mega-icon" style="background:rgba(99,102,241,.15);color:#a5b4fc;">
                          <i data-lucide="wand-2" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">SÉRA Dizi Öneri Sistemi ↗</div>
                          <div class="hub-mega-item-sub">SÉRA uygulamasını aç</div>
                        </div>
                      </a>
                      <button type="button" id="btn-hub-trakt" class="hub-mega-item hub-tool-btn">
                        <div class="hub-mega-icon" style="background:rgba(237,28,36,.15);color:#ed1c24;">
                          <i data-lucide="tv" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Trakt.tv Eşitleme</div>
                          <div class="hub-mega-item-sub">İzleme geçmişi & Scrobble</div>
                        </div>
                      </button>
                      <a href="https://cine-pulse-drab.vercel.app/api/download_apk" download="cinepulse.apk" target="_blank" rel="noopener noreferrer" id="btn-hub-apk" class="hub-mega-item hub-tool-btn" aria-label="CinePulse Android APK İndir">
                        <div class="hub-mega-icon" style="background:rgba(16,185,129,.15);color:#10b981;">
                          <i data-lucide="smartphone" style="width:15px;height:15px;"></i>
                        </div>
                        <div>
                          <div class="hub-mega-item-title">Android APK İndir</div>
                          <div class="hub-mega-item-sub">Telefona doğrudan kur</div>
                        </div>
                      </a>
                    </div>

                  </div>
                </div>
              </li>
            `}
          </ul>
        </div>

        <!-- Right: Primary Actions always visible -->
        <div class="nav-actions">
          ${!isKid ? `
            <!-- Canlı TV – always visible desktop pill -->
            <a href="#livetv" class="btn-nav-live desktop-only ${currentView === 'livetv' ? 'active' : ''}" title="Canlı TV">
              <span class="live-dot-pulse"></span>
              <span>CANLI</span>
            </a>

            <!-- Birlikte – always visible desktop pill -->
            <button data-open-decision-room class="btn-nav-action-pill desktop-only" title="Birlikte Seç">
              <i data-lucide="users-round" style="width:13px;height:13px;"></i>
              <span>Birlikte</span>
            </button>

            <!-- Listem – always visible desktop pill -->
            <a href="#library" class="btn-nav-action-pill desktop-only ${currentView === 'library' ? 'active-pill' : ''}" title="Listem">
              <i data-lucide="bookmark" style="width:13px;height:13px;"></i>
              <span>Listem</span>
            </a>
          ` : `
            <a href="#library" class="btn-nav-action-pill desktop-only ${currentView === 'library' ? 'active-pill' : ''}">
              <i data-lucide="bookmark" style="width:13px;height:13px;"></i>
              <span>Listem</span>
            </a>
          `}

          <!-- Desktop Search Box -->
          <div class="search-box desktop-search-box desktop-only">
            <i data-lucide="search" class="search-icon"></i>
            <input type="text" id="nav-search-input" class="search-input" placeholder="Ara..." autocomplete="off" />
            <span class="search-kbd">⌘K</span>
            <div id="search-overlay" class="search-results-overlay glass-panel hidden"></div>
          </div>

          <!-- Notification Bell -->
          <button id="btn-nav-notifications" class="btn-action-icon btn-nav-bell" title="Bildirimler">
            <i data-lucide="bell" style="width:16px;height:16px;"></i>
            <span id="nav-notif-badge" class="nav-notif-dot ${unreadCount > 0 ? '' : 'hidden'}">${unreadCount}</span>
          </button>

          <!-- Profile Avatar -->
          <button id="btn-nav-profile" class="btn-nav-avatar" title="Profil: ${activeProfile.name}">
            <div class="nav-avatar-circle" style="border-color:${activeProfile.color || '#f59e0b'};background:${activeProfile.color || '#f59e0b'}22;">
              <i data-lucide="${activeProfile.avatar || (isKid ? 'smile' : 'user')}" style="width:15px;height:15px;color:${activeProfile.color || '#f59e0b'};"></i>
            </div>
          </button>

          <!-- Mobile: search toggle -->
          <button id="btn-mobile-search-toggle" class="btn-action-icon mobile-only" aria-label="Ara">
            <i data-lucide="search" style="width:18px;height:18px;"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Expandable Search Row -->
      <div id="mobile-search-row" class="mobile-search-row glass-panel hidden">
        <div class="mobile-search-input-wrapper">
          <i data-lucide="search" class="search-icon"></i>
          <input type="text" id="mobile-search-input" class="mobile-search-input" placeholder="Dizi, film veya kısa dizi ara..." autocomplete="off" />
          <button id="btn-mobile-search-close" class="btn-icon"><i data-lucide="x"></i></button>
        </div>
        <div id="mobile-search-overlay" class="search-results-overlay glass-panel hidden"></div>
      </div>
    </nav>

    <!-- ================================================================
         MOBILE BOTTOM DOCK
         Items: Ana Sayfa | Canlı | ✦Evren | Birlikte | Listem
    ================================================================ -->
    <div class="mobile-dynamic-dock" id="mobile-bottom-dock">
      <a href="#home" class="dynamic-dock-item ${currentView === 'home' ? 'active' : ''}">
        <i data-lucide="home"></i>
        <span>Ana Sayfa</span>
      </a>

      <a href="#livetv" class="dynamic-dock-item dynamic-dock-live ${currentView === 'livetv' ? 'active' : ''}">
        <i data-lucide="radio"></i>
        <span>Canlı</span>
      </a>

      <!-- Center Orb – Evren Hub -->
      <button class="dynamic-dock-hub-orb" id="btn-open-mobile-hub" aria-label="CinePulse Evreni">
        <div class="hub-orb-inner">
          <i data-lucide="sparkles" style="width:20px;height:20px;color:#fff;"></i>
        </div>
      </button>

      <button type="button" data-open-decision-room class="dynamic-dock-item" aria-label="Birlikte İzle">
        <i data-lucide="users-round"></i>
        <span>Birlikte</span>
      </button>

      ${showOfflineDownloads ? `<a href="#downloads" class="dynamic-dock-item ${currentView === 'downloads' ? 'active' : ''}" id="dock-item-downloads">
        <div class="dock-icon-rel">
          <i data-lucide="arrow-down-circle"></i>
          <span class="dock-download-badge" id="dock-downloads-badge" style="display:none;"></span>
        </div>
        <span>İndirilenler</span>
      </a>` : ''}

      <a href="#library" class="dynamic-dock-item ${currentView === 'library' ? 'active' : ''}">
        <i data-lucide="bookmark"></i>
        <span>Listem</span>
      </a>
    </div>

    <!-- ================================================================
         MOBILE HUB BOTTOM SHEET
         (Secondary categories not in the main dock)
    ================================================================ -->
    <div class="mobile-hub-backdrop hidden" id="mobile-hub-backdrop">
      <div class="mobile-hub-sheet" id="mobile-hub-sheet">
        <!-- Drag Handle -->
        <div class="hub-sheet-handle-wrap">
          <div class="hub-sheet-handle"></div>
        </div>

        <!-- Sheet Header -->
        <div class="hub-sheet-header">
          <div class="hub-sheet-header-left">
            <div class="hub-sheet-icon-box">
              <i data-lucide="sparkles" style="width:18px;height:18px;color:#fff;"></i>
            </div>
            <div>
              <div class="hub-sheet-title">CinePulse Evreni</div>
              <div class="hub-sheet-subtitle">Tüm kategoriler & araçlar</div>
            </div>
          </div>
          <button id="btn-close-mobile-hub" class="hub-sheet-close" aria-label="Kapat">
            <i data-lucide="x" style="width:18px;height:18px;"></i>
          </button>
        </div>

        <!-- Sheet Grid -->
        <div class="hub-sheet-body">
          <!-- Row 1: Main content shortcuts (film/dizi still useful for quick access on mobile) -->
          <div class="hub-sheet-section-label">HIZLI ERİŞİM</div>
          <div class="hub-sheet-grid-2">
            <a href="#movies" class="hub-sheet-card hub-nav-trigger" style="--card-color:#0284c7;">
              <i data-lucide="film" style="width:22px;height:22px;"></i>
              <span class="hub-sheet-card-title">Filmler</span>
              <span class="hub-sheet-card-badge">4K UHD</span>
            </a>
            <a href="#series" class="hub-sheet-card hub-nav-trigger" style="--card-color:#f59e0b;">
              <i data-lucide="tv" style="width:22px;height:22px;"></i>
              <span class="hub-sheet-card-title">Diziler</span>
              <span class="hub-sheet-card-badge">TREND</span>
            </a>
            <a href="#dramas" class="hub-sheet-card hub-nav-trigger" style="--card-color:#a855f7;">
              <i data-lucide="clapperboard" style="width:22px;height:22px;"></i>
              <span class="hub-sheet-card-title">Kısa Dizi</span>
              <span class="hub-sheet-card-badge">REEL</span>
            </a>
            <a href="#discover" class="hub-sheet-card hub-nav-trigger" style="--card-color:#6366f1;">
              <i data-lucide="sliders-horizontal" style="width:22px;height:22px;"></i>
              <span class="hub-sheet-card-title">Keşfet</span>
              <span class="hub-sheet-card-badge">FİLTRE</span>
            </a>
          </div>

          <!-- Row 2: Niche categories -->
          <div class="hub-sheet-section-label" style="margin-top:1.1rem;">TÜRLER</div>
          <div class="hub-sheet-grid-3">
            <a href="#anime" class="hub-sheet-chip hub-nav-trigger">
              <i data-lucide="sparkles" style="width:14px;height:14px;color:#38bdf8;"></i>
              Anime
            </a>
            <a href="#cartoons" class="hub-sheet-chip hub-nav-trigger">
              <i data-lucide="palette" style="width:14px;height:14px;color:#f59e0b;"></i>
              Çizgi
            </a>
            <a href="#documentary" class="hub-sheet-chip hub-nav-trigger">
              <i data-lucide="book-open" style="width:14px;height:14px;color:#10b981;"></i>
              Belgesel
            </a>
          </div>

          <!-- Row 3: Tools -->
          <div class="hub-sheet-section-label" style="margin-top:1.1rem;">ARAÇLAR & ÖZEL</div>
          <div class="hub-sheet-tools">
            <button type="button" id="btn-hub-random-spin-mobile" class="hub-sheet-tool-btn">
              <div class="hub-sheet-tool-icon" style="background:linear-gradient(135deg,#f59e0b,#ef4444);">
                <i data-lucide="dices" style="width:18px;height:18px;color:#fff;"></i>
              </div>
              <div class="hub-sheet-tool-text">
                <span class="hub-sheet-tool-title">Şanslı Çark</span>
                <span class="hub-sheet-tool-sub">Rastgele popüler bir yapım seç</span>
              </div>
              <i data-lucide="sparkles" style="width:14px;height:14px;color:#fbbf24;margin-left:auto;flex-shrink:0;"></i>
            </button>
            <a href="https://caca1403.github.io/dizionerisistemi/" target="_blank" rel="noopener noreferrer" id="btn-hub-series-recommend-mobile" class="hub-sheet-tool-btn" aria-label="SÉRA Dizi Öneri Sistemi'ni aç">
              <div class="hub-sheet-tool-icon" style="background:linear-gradient(135deg,#6366f1,#a855f7);">
                <i data-lucide="wand-2" style="width:18px;height:18px;color:#fff;"></i>
              </div>
              <div class="hub-sheet-tool-text">
                <span class="hub-sheet-tool-title">SÉRA Dizi Öneri Sistemi ↗</span>
                <span class="hub-sheet-tool-sub">SÉRA uygulamasını aç</span>
              </div>
            </a>
            <button type="button" id="btn-hub-trakt-mobile" class="hub-sheet-tool-btn">
              <div class="hub-sheet-tool-icon" style="background:linear-gradient(135deg,#ed1c24,#b91c1c);">
                <i data-lucide="tv" style="width:18px;height:18px;color:#fff;"></i>
              </div>
              <div class="hub-sheet-tool-text">
                <span class="hub-sheet-tool-title">Trakt.tv Eşitleme</span>
                <span class="hub-sheet-tool-sub">İzleme geçmişi & Scrobble</span>
              </div>
              <i data-lucide="repeat" style="width:14px;height:14px;color:#ed1c24;margin-left:auto;flex-shrink:0;"></i>
            </button>
            <a href="https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk" download="cinepulse.apk" target="_blank" rel="noopener noreferrer" id="btn-hub-apk-mobile" class="hub-sheet-tool-btn" aria-label="CinePulse Android APK İndir">
              <div class="hub-sheet-tool-icon" style="background:linear-gradient(135deg,#10b981,#059669);">
                <i data-lucide="smartphone" style="width:18px;height:18px;color:#fff;"></i>
              </div>
              <div class="hub-sheet-tool-text">
                <span class="hub-sheet-tool-title">Android APK İndir (Doğrudan)</span>
                <span class="hub-sheet-tool-sub">v1.1.1 • Hızlı sunucu</span>
              </div>
              <i data-lucide="download" style="width:14px;height:14px;color:#10b981;margin-left:auto;flex-shrink:0;"></i>
            </a>
            <a href="./cinepulse.zip" download="cinepulse.zip" target="_blank" rel="noopener noreferrer" class="hub-sheet-tool-btn" style="background:rgba(255,255,255,0.03);border:1px dashed rgba(255,255,255,0.12);">
              <div class="hub-sheet-tool-icon" style="background:rgba(245,158,11,0.15);color:#fbbf24;">
                <i data-lucide="archive" style="width:18px;height:18px;"></i>
              </div>
              <div class="hub-sheet-tool-text">
                <span class="hub-sheet-tool-title">APK Zip Paketi (Chrome %100 Çözümü)</span>
                <span class="hub-sheet-tool-sub">Takılma olmadan anında iner</span>
              </div>
              <i data-lucide="download" style="width:14px;height:14px;color:#fbbf24;margin-left:auto;flex-shrink:0;"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   Event Attachment
   ========================================================================== */
let _scrollHandler = null;
let _searchShortcut = null;
let _outsideSearchAttached = false;

export function attachNavbarEvents(onNavigate) {
  const navbar = document.getElementById('main-navbar');

  /* Scroll glassmorphism */
  if (_scrollHandler) window.removeEventListener('scroll', _scrollHandler);
  _scrollHandler = () => navbar?.classList.toggle('scrolled', window.scrollY > 20);
  _scrollHandler();
  window.addEventListener('scroll', _scrollHandler, { passive: true });

  /* Mobile search toggle */
  const mobileSearchRow = document.getElementById('mobile-search-row');
  document.getElementById('btn-mobile-search-toggle')?.addEventListener('click', () => {
    mobileSearchRow?.classList.toggle('hidden');
    if (!mobileSearchRow?.classList.contains('hidden')) {
      document.getElementById('mobile-search-input')?.focus();
      renderIcons();
    }
  });
  document.getElementById('btn-mobile-search-close')?.addEventListener('click', () => {
    mobileSearchRow?.classList.add('hidden');
  });

  /* Notifications */
  document.getElementById('btn-nav-notifications')?.addEventListener('click', openNotificationCenterModal);

  /* Profile */
  document.getElementById('btn-nav-profile')?.addEventListener('click', openProfileModal);

  /* ============================================================
     DESKTOP HUB – Mega Dropdown (hover + click)
  ============================================================ */
  const hubLi = document.getElementById('nav-hub-li');
  const hubBtn = document.getElementById('btn-desktop-hub');
  const hubDropdown = document.getElementById('hub-mega-dropdown');
  let desktopHubCloseTimer;

  function openDesktopHub() {
    clearTimeout(desktopHubCloseTimer);
    hubBtn?.setAttribute('aria-expanded', 'true');
    hubDropdown?.classList.add('open');
  }
  function closeDesktopHub() {
    clearTimeout(desktopHubCloseTimer);
    hubBtn?.setAttribute('aria-expanded', 'false');
    hubDropdown?.classList.remove('open');
  }
  function scheduleDesktopHubClose() {
    clearTimeout(desktopHubCloseTimer);
    desktopHubCloseTimer = setTimeout(() => {
      if (!hubLi?.matches(':hover') && !hubDropdown?.matches(':hover')) closeDesktopHub();
    }, 350);
  }

  if (hubLi) {
    // Hover behaviour on desktop
    hubLi.addEventListener('mouseenter', openDesktopHub);
    hubLi.addEventListener('mouseleave', scheduleDesktopHubClose);
    hubDropdown?.addEventListener('mouseenter', openDesktopHub);
    hubDropdown?.addEventListener('mouseleave', scheduleDesktopHubClose);

    // Clicking after mouseenter must keep the menu open.
    hubBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      openDesktopHub();
    });

    // Close when clicking a nav-trigger inside
    hubDropdown?.querySelectorAll('.hub-nav-trigger').forEach(el => {
      el.addEventListener('click', closeDesktopHub);
    });

    // ESC closes (use abort on re-render)
    const escHandler = (e) => { if (e.key === 'Escape') closeDesktopHub(); };
    window.addEventListener('keydown', escHandler);

    // Click outside closes (use abort on re-render)
    const outsideHandler = (e) => { if (!hubLi.contains(e.target)) closeDesktopHub(); };
    document.addEventListener('click', outsideHandler);
  }

  /* Desktop hub random spin */
  document.getElementById('btn-hub-random-spin')?.addEventListener('click', async () => {
    closeDesktopHub();
    openRandomPickerModal();
  });
  document.getElementById('btn-hub-series-recommend')?.addEventListener('click', closeDesktopHub);

  /* Desktop hub trakt sync */
  document.getElementById('btn-hub-trakt')?.addEventListener('click', () => {
    closeDesktopHub();
    openTraktModal();
  });

  /* ============================================================
     MOBILE HUB – Bottom Sheet
  ============================================================ */
  const mobileHubBackdrop = document.getElementById('mobile-hub-backdrop');
  const mobileHubSheet = document.getElementById('mobile-hub-sheet');
  let mobileHubCloseTimer;

  function openMobileHub() {
    if (!mobileHubBackdrop) return;
    clearTimeout(mobileHubCloseTimer);
    mobileHubSheet?.classList.remove('sheet-closing');
    mobileHubBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // Icons already rendered when navbar was mounted — no renderIcons call here
  }
  function closeMobileHub() {
    if (!mobileHubBackdrop) return;
    document.body.style.overflow = '';
    mobileHubSheet?.classList.add('sheet-closing');
    clearTimeout(mobileHubCloseTimer);
    mobileHubCloseTimer = setTimeout(() => {
      mobileHubBackdrop.classList.add('hidden');
      mobileHubSheet?.classList.remove('sheet-closing');
    }, 280);
  }

  document.getElementById('btn-open-mobile-hub')?.addEventListener('click', (e) => {
    e.preventDefault();
    openMobileHub();
  }, { once: false }); // event delegated to this specific element after each render
  document.getElementById('btn-close-mobile-hub')?.addEventListener('click', closeMobileHub);

  mobileHubBackdrop?.addEventListener('click', (e) => {
    if (e.target === mobileHubBackdrop) closeMobileHub();
  });

  mobileHubBackdrop?.querySelectorAll('.hub-nav-trigger').forEach(el => {
    el.addEventListener('click', closeMobileHub);
  });

  /* Mobile random spin */
  document.getElementById('btn-hub-random-spin-mobile')?.addEventListener('click', async () => {
    closeMobileHub();
    openRandomPickerModal();
  });
  document.getElementById('btn-hub-series-recommend-mobile')?.addEventListener('click', closeMobileHub);

  /* Mobile hub trakt sync */
  document.getElementById('btn-hub-trakt-mobile')?.addEventListener('click', () => {
    closeMobileHub();
    openTraktModal();
  });

  /* Decision room (all instances) */
  document.querySelectorAll('[data-open-decision-room]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeDesktopHub();
      closeMobileHub();
      openDecisionRoomModal();
    });
  });

  /* ============================================================
     SEARCH
  ============================================================ */
  setupSearchInput('nav-search-input', 'search-overlay');
  setupSearchInput('mobile-search-input', 'mobile-search-overlay');

  if (!_outsideSearchAttached) {
    _outsideSearchAttached = true;
    document.addEventListener('click', (e) => {
      for (const [iId, oId] of [
        ['nav-search-input', 'search-overlay'],
        ['mobile-search-input', 'mobile-search-overlay']
      ]) {
        const input = document.getElementById(iId);
        const overlay = document.getElementById(oId);
        if (overlay && !input?.contains(e.target) && !overlay.contains(e.target)) {
          overlay.classList.add('hidden');
        }
      }
    });
  }

  if (_searchShortcut) document.removeEventListener('keydown', _searchShortcut);
  _searchShortcut = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (window.innerWidth <= 992 && mobileSearchRow) {
        mobileSearchRow.classList.remove('hidden');
        document.getElementById('mobile-search-input')?.focus();
      } else {
        document.getElementById('nav-search-input')?.focus();
      }
    }
  };
  window.addEventListener('keydown', _searchShortcut);
}

/* ============================================================
   Search Input Handler
============================================================ */
function setupSearchInput(inputId, overlayId) {
  const input = document.getElementById(inputId);
  const overlay = document.getElementById(overlayId);
  let timer = null;

  if (!input || !overlay) return;

  input.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    clearTimeout(timer);
    if (query.length < 2) { overlay.classList.add('hidden'); overlay.innerHTML = ''; return; }

    overlay.innerHTML = '<div class="search-no-results" style="display:flex;align-items:center;gap:8px;padding:1rem;color:var(--text-muted);font-size:.85rem;"><span class="tv-loading-spinner" style="width:16px;height:16px;border-width:2px;"></span> Aranıyor...</div>';
    overlay.classList.remove('hidden');

    timer = setTimeout(async () => {
      try {
        const raw = await searchMulti(query);
        const results = Array.isArray(raw) ? raw.slice(0, 8) : (raw?.results?.slice(0, 8) || []);

        const dramaRow = `
          <a href="#dramas?q=${encodeURIComponent(query)}" class="search-item search-item-drama" style="background:linear-gradient(135deg,rgba(88,28,135,.35),rgba(30,27,75,.55));border:1px solid rgba(168,85,247,.3);border-radius:10px;margin-top:6px;padding:.6rem .75rem;">
            <div style="width:36px;height:48px;border-radius:6px;background:rgba(168,85,247,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i data-lucide="sparkles" style="width:18px;height:18px;color:#c084fc;"></i>
            </div>
            <div class="search-item-info">
              <div class="search-item-title" style="color:#f3e8ff;font-weight:750;">🎭 Kısa Dizilerde Ara: "${query}"</div>
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
          const title = item.title || item.name || 'İsimsiz';
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
        overlay.innerHTML = '<div class="search-no-results">Arama sırasında bir hata oluştu</div>';
      }
    }, 200);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { overlay.classList.add('hidden'); input.blur(); }
  });
}

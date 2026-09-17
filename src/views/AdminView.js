import { renderIcons } from '../services/icons.js';
/* ==========================================================================
   CinePulse Studio - Secure Secret Admin Panel (Access Restricted)
   Protected by Master PIN / Passcode. Inaccessible to kids and standard users.
   Provides content curation, keyword/TMDB blocklists, source health & PIN config.
   ========================================================================== */

import {
  verifyAdminPin,
  setAdminPin,
  getBlockedContent,
  addBlockedContent,
  removeBlockedContent,
  getProfiles,
  getUserSettings,
  saveUserSettings
} from '../services/storage.js';
import { clearHomeCache } from './HomeView.js';
import {
  completeAdminAuthentication,
  getAdminPinLockSeconds,
  isAdminAuthenticated,
  lockAdminAccess,
  recordAdminPinFailure
} from '../services/adminAccess.js';

export async function renderAdminView() {
  const isUnlocked = isAdminAuthenticated();
  if (!isUnlocked) {
    return {
      html: `
        <div class="admin-auth-container animate-fade-in">
          <div class="admin-auth-card">
            <div class="admin-shield-icon">
              <i data-lucide="shield-alert" style="width: 38px; height: 38px; color: #f59e0b;"></i>
            </div>
            <h1 style="font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">
              Yönetici Doğrulaması
            </h1>
            <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1.5rem;">
              Bu alan kısıtlıdır. Yönetici PIN kodunuzu girin.
            </p>

            <form id="admin-login-form" style="display: flex; flex-direction: column; gap: 1rem;">
              <div style="position: relative;">
                <input 
                  type="password" 
                  id="admin-pin-input" 
                  class="admin-pin-input" 
                  placeholder="••••" 
                  maxlength="12"
                  autocomplete="off"
                  autofocus
                  required
                />
              </div>

              <div id="admin-login-error" style="color: #ef4444; font-size: 0.85rem; font-weight: 600; display: none;">
                Geçersiz PIN Kodu!
              </div>

              <button type="submit" class="admin-btn-primary">
                <i data-lucide="unlock" style="width: 18px; height: 18px;"></i>
                <span>Giriş Yap</span>
              </button>

              <a href="#home" class="admin-btn-secondary" style="display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none; margin-top: 0.25rem; width: 100%; border-radius: var(--radius-md); padding: 0.75rem; box-sizing: border-box;">
                <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i>
                <span>Ana Ekrana Dön</span>
              </a>
            </form>
          </div>
        </div>
      `,
      init: (container) => {
        const form = container.querySelector('#admin-login-form');
        const input = container.querySelector('#admin-pin-input');
        const errorEl = container.querySelector('#admin-login-error');

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const val = input.value.trim();
          const remainingLock = getAdminPinLockSeconds();
          if (remainingLock > 0) {
            errorEl.textContent = `Çok fazla hatalı deneme. ${remainingLock} saniye sonra tekrar deneyin.`;
            errorEl.style.display = 'block';
            return;
          }
          if (verifyAdminPin(val)) {
            completeAdminAuthentication();
            window.dispatchEvent(new CustomEvent('cinepulse_admin_state_changed'));
          } else {
            const lockSeconds = recordAdminPinFailure();
            errorEl.textContent = lockSeconds > 0
              ? `Çok fazla hatalı deneme. ${lockSeconds} saniye bekleyin.`
              : 'Geçersiz PIN kodu!';
            errorEl.style.display = 'block';
            input.classList.add('admin-input-error');
            setTimeout(() => input.classList.remove('admin-input-error'), 400);
            input.value = '';
          }
        });

        renderIcons(container);
      }
    };
  }

  // Unlocked Admin Dashboard
  const blockedItems = getBlockedContent();
  const profiles = getProfiles();
  const siteSettings = getUserSettings();

  return {
    html: `
      <div class="admin-dashboard container animate-fade-in" style="padding: 2.5rem 1rem; max-width: 1000px; margin: 0 auto; width: 100%;">
        <!-- Header -->
        <div class="admin-dash-header" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.1));">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.8rem; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 999px; color: #f59e0b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
              <i data-lucide="shield-check" style="width: 14px; height: 14px;"></i> Sistem Yöneticisi
            </div>
            <h1 style="font-size: 1.8rem; font-weight: 800; color: #fff;">CinePulse Güvenlik & Kontrol Paneli</h1>
            <p style="font-size: 0.9rem; color: #94a3b8; margin-top: 0.25rem;">
              İçerik filtreleme, uygunsuz başlık kara listesi ve sistem ayarları
            </p>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <a href="#home" class="admin-btn-secondary" style="padding: 0.6rem 1.2rem; display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; cursor: pointer;">
              <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i>
              <span>Ana Ekrana Dön</span>
            </a>
            <button id="admin-lock-btn" class="admin-btn-secondary" style="padding: 0.6rem 1.2rem; display: inline-flex; align-items: center; gap: 0.5rem; cursor: pointer; color: #ef4444; border-color: rgba(239, 68, 68, 0.3);">
              <i data-lucide="lock" style="width: 16px; height: 16px;"></i>
              <span>Paneli Kilitle & Çık</span>
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
          <!-- 1. Blocklist Management Card -->
          <div class="admin-card">
            <div class="admin-card-header">
              <i data-lucide="ban" style="width: 20px; height: 20px; color: #ef4444;"></i>
              <h2 style="font-size: 1.15rem; font-weight: 700; color: #fff;">İçerik Kara Listesi (Filtreleme)</h2>
            </div>
            <p style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 1rem;">
              Buraya eklenen kelimeleri veya TMDB ID'lerini içeren yapımlar çocuk modundan ve aramalardan otomatik engellenir.
            </p>

            <form id="admin-add-block-form" style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
              <input 
                type="text" 
                id="admin-block-input" 
                placeholder="Yasaklanacak kelime veya ID..." 
                class="admin-input-small"
                required
              />
              <button type="submit" class="admin-btn-accent" style="white-space: nowrap;">
                <i data-lucide="plus" style="width: 16px; height: 16px;"></i> Engelle
              </button>
            </form>

            <div id="admin-block-list" class="admin-tags-container">
              ${blockedItems.map(item => `
                <div class="admin-tag-item">
                  <span>${item}</span>
                  <button type="button" class="admin-tag-del-btn" data-entry="${item}" title="Engeli Kaldır">
                    <i data-lucide="x" style="width: 12px; height: 12px;"></i>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 2. Source Engines Health Card -->
          <div class="admin-card">
            <div class="admin-card-header">
              <i data-lucide="cpu" style="width: 20px; height: 20px; color: #10b981;"></i>
              <h2 style="font-size: 1.15rem; font-weight: 700; color: #fff;">Aktif Stream Motorları</h2>
            </div>
            <p style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 1rem;">
              Platformun video kaynak motorları ve çalışma durumları:
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div class="admin-engine-row">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span class="status-indicator-dot online"></span>
                  <div>
                    <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">Kids VIP Engine (1080p MP4)</div>
                    <div style="font-size: 0.75rem; color: #94a3b8;">Çizgi filmler & animasyonlar için anonim doğrudan CDN</div>
                  </div>
                </div>
                <span class="admin-badge-active">Aktif</span>
              </div>

              <div class="admin-engine-row">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span class="status-indicator-dot online"></span>
                  <div>
                    <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">TVR VIP Engine (1080p HLS)</div>
                    <div style="font-size: 0.75rem; color: #94a3b8;">Diziler ve filmler için anlık 0ms HLS akışları</div>
                  </div>
                </div>
                <span class="admin-badge-active">Aktif</span>
              </div>

              <div class="admin-engine-row">
                <div style="display: flex; align-items: center; gap: 0.6rem;">
                  <span class="status-indicator-dot online"></span>
                  <div>
                    <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">Dizipal & Dizisol Hibrit</div>
                    <div style="font-size: 0.75rem; color: #94a3b8;">AlphaStream ve yerel ters proxy altyapısı</div>
                  </div>
                </div>
                <span class="admin-badge-active">Aktif</span>
              </div>
            </div>
          </div>

          <!-- 3. Security & PIN Change Card -->
          <div class="admin-card">
            <div class="admin-card-header">
              <i data-lucide="key" style="width: 20px; height: 20px; color: #3b82f6;"></i>
              <h2 style="font-size: 1.15rem; font-weight: 700; color: #fff;">Yönetici PIN Kodunu Değiştir</h2>
            </div>
            <p style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 1rem;">
              Admin paneline giriş için kullanılan PIN kodunu güvenliğiniz için güncelleyin.
            </p>

            <form id="admin-change-pin-form" style="display: flex; flex-direction: column; gap: 0.75rem;">
              <input 
                type="password" 
                id="admin-new-pin" 
                placeholder="Yeni PIN (En az 4 hane)..." 
                class="admin-input-small"
                minlength="4"
                maxlength="16"
                required
              />
              <button type="submit" class="admin-btn-secondary" style="justify-content: center;">
                <i data-lucide="check" style="width: 16px; height: 16px;"></i> PIN Kodunu Kaydet
              </button>
            </form>
          </div>

          <!-- 4. System & Cache Utilities Card -->
          <div class="admin-card">
            <div class="admin-card-header">
              <i data-lucide="sliders-horizontal" style="width: 20px; height: 20px; color: #a78bfa;"></i>
              <h2 style="font-size: 1.15rem; font-weight: 700; color: #fff;">Tüm Profilleri Etkileyen Kontroller</h2>
            </div>
            <p style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 1rem;">
              Bu tarayıcıdaki tüm profiller için kart ve fragman davranışını tek yerden yönetin.
            </p>
            <label class="admin-engine-row" style="cursor:pointer;">
              <span>Yatay kart görünümü</span>
              <input id="admin-setting-landscape" type="checkbox" ${siteSettings.cardLayout === 'landscape' ? 'checked' : ''} />
            </label>
            <label class="admin-engine-row" style="cursor:pointer; margin-top:.65rem;">
              <span>Kart üstü fragman önizlemesi</span>
              <input id="admin-setting-hover" type="checkbox" ${siteSettings.hoverPreviewsEnabled !== false ? 'checked' : ''} />
            </label>
            <label class="admin-engine-row" style="cursor:pointer; margin-top:.65rem;">
              <span>Fragmanları aç</span>
              <input id="admin-setting-trailers" type="checkbox" ${siteSettings.trailersEnabled !== false ? 'checked' : ''} />
            </label>
            <label class="admin-engine-row" style="cursor:pointer; margin-top:.65rem;">
              <span>Sonraki bölümü otomatik oynat</span>
              <input id="admin-setting-autoplay-next" type="checkbox" ${siteSettings.autoplayNext !== false ? 'checked' : ''} />
            </label>
            <label class="admin-engine-row" style="cursor:pointer; margin-top:.65rem;">
              <span>Altyazılar varsayılan olarak açık</span>
              <input id="admin-setting-subtitles" type="checkbox" ${siteSettings.subtitlesEnabled !== false ? 'checked' : ''} />
            </label>
            <label class="admin-engine-row" style="cursor:pointer; margin-top:.65rem;">
              <span>Varsayılan oynatma kalitesi</span>
              <select id="admin-setting-resolution" class="admin-input-small" style="width:auto;min-width:110px;">
                ${['720p', '1080p', '2160p'].map(value => `<option value="${value}" ${siteSettings.preferredResolution === value ? 'selected' : ''}>${value}</option>`).join('')}
              </select>
            </label>
            <button id="admin-save-site-settings" class="admin-btn-accent" style="width:100%;justify-content:center;margin-top:1rem;">
              <i data-lucide="save" style="width:16px;height:16px;"></i> Kontrolleri Uygula
            </button>
          </div>

          <!-- 5. System & Cache Utilities Card -->
          <div class="admin-card">
            <div class="admin-card-header">
              <i data-lucide="trash-2" style="width: 20px; height: 20px; color: #ec4899;"></i>
              <h2 style="font-size: 1.15rem; font-weight: 700; color: #fff;">Sistem & Önbellek Temizliği</h2>
            </div>
            <p style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 1.25rem;">
              Eski önbellek verilerini temizleyerek tüm akışların ve ana sayfa listelerinin en taze haliyle yüklenmesini sağlar.
            </p>

            <button id="admin-clear-cache-btn" class="admin-btn-secondary" style="width: 100%; justify-content: center; color: #f43f5e; border-color: rgba(244,63,94,0.3);">
              <i data-lucide="refresh-cw" style="width: 16px; height: 16px;"></i>
              <span>Önbelleği Sıfırla & Sayfayı Yenile</span>
            </button>
          </div>
        </div>
      </div>
    `,
    init: (container) => {
      // Lock button
      const lockBtn = container.querySelector('#admin-lock-btn');
      if (lockBtn) {
        lockBtn.addEventListener('click', () => {
          lockAdminAccess();
          window.location.hash = '#home';
        });
      }

      const saveSiteSettingsBtn = container.querySelector('#admin-save-site-settings');
      if (saveSiteSettingsBtn) {
        saveSiteSettingsBtn.addEventListener('click', () => {
          const landscape = container.querySelector('#admin-setting-landscape')?.checked === true;
          const hoverPreviewsEnabled = container.querySelector('#admin-setting-hover')?.checked === true;
          const trailersEnabled = container.querySelector('#admin-setting-trailers')?.checked === true;
          const autoplayNext = container.querySelector('#admin-setting-autoplay-next')?.checked === true;
          const subtitlesEnabled = container.querySelector('#admin-setting-subtitles')?.checked === true;
          const preferredResolution = container.querySelector('#admin-setting-resolution')?.value || '1080p';
          saveUserSettings({
            cardLayout: landscape ? 'landscape' : 'portrait',
            hoverPreviewsEnabled,
            trailersEnabled,
            autoplayNext,
            subtitlesEnabled,
            preferredResolution
          });
          document.documentElement.classList.toggle('cards-landscape', landscape);
          alert('Tüm profil kontrolleri uygulandı.');
        });
      }

      // Add blocked content
      const addForm = container.querySelector('#admin-add-block-form');
      const addInput = container.querySelector('#admin-block-input');
      if (addForm && addInput) {
        addForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const val = addInput.value.trim();
          if (val) {
            addBlockedContent(val);
            clearHomeCache();
            window.location.reload();
          }
        });
      }

      // Remove blocked content
      container.querySelectorAll('.admin-tag-del-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const entry = btn.getAttribute('data-entry');
          if (entry) {
            removeBlockedContent(entry);
            clearHomeCache();
            window.location.reload();
          }
        });
      });

      // Change PIN
      const pinForm = container.querySelector('#admin-change-pin-form');
      const newPinInput = container.querySelector('#admin-new-pin');
      if (pinForm && newPinInput) {
        pinForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const p = newPinInput.value.trim();
          if (p.length >= 4) {
            setAdminPin(p);
            alert('Yönetici PIN kodu başarıyla güncellendi!');
            newPinInput.value = '';
          }
        });
      }

      // Clear cache
      const clearCacheBtn = container.querySelector('#admin-clear-cache-btn');
      if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', () => {
          sessionStorage.clear();
          clearHomeCache();
          alert('Sistem önbelleği başarıyla temizlendi.');
          window.location.reload();
        });
      }

      renderIcons(container);
    }
  };
}

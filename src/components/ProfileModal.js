import { renderSiteLogo, getProfileAccent } from './BrandLogo.js';
import { renderIcons } from '../services/icons.js';
/* ==========================================================================
   CinePulse Studio - "Kim İzliyor?" Çoklu Profil Yönetimi Modal
   Allows switching between user profiles, kids mode, and managing
   isolated watch histories and watchlists.
   ========================================================================== */

import { getProfiles, getActiveProfile, setActiveProfile, addProfile, deleteProfile, saveProfiles } from '../services/storage.js';
import { showToast } from './Toast.js';
import { openDataManagerModal } from './DataManagerModal.js';
import { openTraktModal } from './TraktModal.js';
import { isNativeAndroidApp, checkForAppUpdates, promptAppInstall } from '../services/platformBridge.js';

let activeProfileModal = null;
let profileEvents;
let previousProfileFocus;
const escapeProfileText = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

export function openProfileModal() {
  closeProfileModal();
  previousProfileFocus = document.activeElement;
  profileEvents = new AbortController();

  const modalContainer = document.createElement('div');
  modalContainer.id = 'profile-modal-root';
  modalContainer.className = 'profile-backdrop';
  modalContainer.setAttribute('role', 'dialog');
  modalContainer.setAttribute('aria-modal', 'true');
  modalContainer.setAttribute('aria-labelledby', 'cp-profile-heading');
  document.body.appendChild(modalContainer);
  activeProfileModal = modalContainer;

  let isManaging = false;

  const renderModalContent = (viewState = 'select') => {
    const profiles = getProfiles();
    const active = getActiveProfile();

    if (viewState === 'select') {
      modalContainer.innerHTML = `
        <div class="profile-dialog netflix-profile-dialog">
          <button class="profile-close-btn" id="btn-close-profile-modal" title="Kapat">
            <i data-lucide="x" style="width: 22px; height: 22px;"></i>
          </button>

          <div class="profile-brand-header">
            ${renderSiteLogo()}
            <span class="brand-name">Cine<span class="brand-highlight">Pulse</span></span>
          </div>

          <div class="profile-top-title">
            <span class="cp-eyebrow">SANA AİT BİR SİNEMA DENEYİMİ.</span>
            <h2 class="profile-main-heading" id="cp-profile-heading">Kim izliyor?</h2>
            <p>Profilini seç, hikâyene devam et.</p>
          </div>

          <!-- Profiles Grid -->
          <div class="profile-cards-grid netflix-cards-grid">
            ${profiles.map(p => {
              const isAct = p.id === active.id;
              const canDelete = p.id !== 'prof_1';
              const pColor = getProfileAccent(p.color);
              return `
                <div class="profile-card-wrapper">
                  <button type="button" aria-label="${escapeProfileText(p.name)} profilini ${isManaging ? 'düzenle' : 'seç'}" aria-pressed="${isAct}" class="profile-card netflix-card ${isAct ? 'is-active' : ''} ${isManaging ? 'is-managing-mode' : ''}" data-profile-id="${p.id}">
                    <div class="profile-avatar-wrap netflix-avatar-square ${p.isKid ? 'is-kid-square' : ''}" style="--profile-accent: ${pColor};">
                      <i data-lucide="${p.isKid ? 'smile' : (p.avatar || 'smile')}" class="netflix-smile-icon"></i>
                      ${p.isKid ? `<div class="netflix-kids-bottom-banner">ÇOCUK</div>` : ''}
                      
                      ${isAct && !isManaging ? `
                        <div class="profile-active-check" title="Aktif Profil">
                          <i data-lucide="check" style="width: 14px; height: 14px; stroke-width: 3;"></i>
                        </div>
                      ` : ''}

                      ${isManaging ? `
                        <div class="netflix-avatar-manage-overlay">
                          <i data-lucide="pencil" style="width: 28px; height: 28px; color: #fff;"></i>
                        </div>
                      ` : ''}
                    </div>
                    <span class="profile-name netflix-profile-name">${escapeProfileText(p.name)}</span>
                  </button>

                  ${isManaging && canDelete ? `
                    <button class="btn-delete-profile netflix-delete-btn" data-delete-id="${p.id}" title="Profili Sil">
                      <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                    </button>
                  ` : ''}
                </div>
              `;
            }).join('')}

            <!-- Add Profile Card -->
            <div class="profile-card-wrapper">
              <button type="button" class="profile-card netflix-card profile-card-add" id="btn-show-add-profile" aria-label="Yeni profil ekle">
                <div class="profile-avatar-wrap netflix-avatar-square netflix-avatar-add">
                  <i data-lucide="plus-circle" style="width: 52px; height: 52px; color: #808080; stroke-width: 1.5;"></i>
                </div>
                <span class="profile-name netflix-profile-name">Profil Ekle</span>
              </button>
            </div>
          </div>

          <!-- Netflix Manage Profiles Button -->
          <div class="netflix-manage-action-bar">
            <button class="btn-netflix-manage ${isManaging ? 'is-active-done' : ''}" id="btn-toggle-manage-profiles">
              ${isManaging ? 'Tamamlandı' : 'Profilleri Yönet'}
            </button>
          </div>

          <!-- Bottom Management Bar -->
          <div class="profile-footer-bar netflix-footer-subbar">
            <button class="btn-manage-profiles" id="btn-modal-open-trakt" title="Trakt.tv Senkronizasyonu">
              <i data-lucide="tv" style="width: 14px; height: 14px; color: #ed1c24;"></i>
              <span>Trakt.tv</span>
            </button>
            <button class="btn-manage-profiles" id="btn-modal-open-backup" title="Yedekleme & Veri Yönetimi">
              <i data-lucide="hard-drive-download" style="width: 14px; height: 14px; color: #38bdf8;"></i>
              <span>Veri & Yedek</span>
            </button>
            ${isNativeAndroidApp() ? `
              <button class="btn-manage-profiles" id="btn-modal-check-update" title="Güncellemeleri Denetle">
                <i data-lucide="refresh-cw" style="width: 14px; height: 14px; color: #10b981;"></i>
                <span>Güncelleme</span>
              </button>
            ` : `
              <a class="btn-manage-profiles" id="btn-modal-apk-download" href="https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk" download="cinepulse.apk" target="_blank" rel="noopener noreferrer" title="Android APK İndir" style="text-decoration: none;">
                <i data-lucide="smartphone" style="width: 14px; height: 14px; color: #10b981;"></i>
                <span>Android APK</span>
              </a>
              <button class="btn-manage-profiles" id="btn-modal-pwa-install" title="CinePulse Web Uygulamasını Yükle">
                <i data-lucide="download" style="width: 14px; height: 14px; color: #dfff76;"></i>
                <span>Web Uygulaması</span>
              </button>
            `}
          </div>
        </div>
      `;
    } else if (viewState === 'add') {
      modalContainer.innerHTML = `
        <div class="profile-dialog profile-dialog-small">
          <button class="profile-close-btn" id="btn-cancel-add-profile" title="Geri">
            <i data-lucide="arrow-left" style="width: 20px; height: 20px;"></i>
          </button>

          <div class="profile-top-title">
            <h2 id="cp-profile-heading">Yeni profil oluştur</h2>
            <p>Kişiselleştirilmiş izleme geçmişi için yeni bir profil ekleyin.</p>
          </div>

          <form id="form-add-profile" class="profile-add-form">
            <div class="profile-input-group">
              <label for="new-profile-name">Profil adı</label>
              <input type="text" id="new-profile-name" placeholder="Örn: Ayşe, Sinema Odası" required maxlength="20" autofocus />
            </div>

            <div class="profile-kid-toggle-row">
              <div class="kid-toggle-info">
                <span class="kid-toggle-title">Çocuk Profili 🎈</span>
                <span class="kid-toggle-sub">Sadece animasyonlar, çocuk dizileri ve güvenli kanallar gösterilir.</span>
              </div>
              <label class="switch-toggle">
                <input type="checkbox" id="new-profile-kid-check" />
                <span class="slider-round"></span>
              </label>
            </div>

            <div class="profile-color-picker-row">
              <label>Profil Rengi</label>
              <div class="profile-colors-wrap">
                ${['#dfff76', '#38bdf8', '#ec4899', '#10b981', '#a855f7', '#ef4444'].map((c, i) => `
                  <button type="button" class="color-dot ${i === 0 ? 'active' : ''}" data-color="${c}" style="background: ${c};"></button>
                `).join('')}
              </div>
            </div>

            <div class="profile-form-actions">
              <button type="button" class="btn-secondary" id="btn-back-to-profiles">İptal</button>
              <button type="submit" class="btn-primary">Kaydet & Oluştur</button>
            </div>
          </form>
        </div>
      `;
    }

    renderIcons(modalContainer);
    (modalContainer.querySelector('#new-profile-name') || modalContainer.querySelector('#btn-close-profile-modal'))?.focus();

    // --- SELECT VIEW EVENTS ---
    const closeBtn = modalContainer.querySelector('#btn-close-profile-modal');
    if (closeBtn) closeBtn.onclick = () => closeProfileModal();

    const addCardBtn = modalContainer.querySelector('#btn-show-add-profile');
    if (addCardBtn) addCardBtn.onclick = () => renderModalContent('add');

    const toggleManageBtn = modalContainer.querySelector('#btn-toggle-manage-profiles');
    if (toggleManageBtn) {
      toggleManageBtn.onclick = () => {
        isManaging = !isManaging;
        renderModalContent('select');
      };
    }

    // Delete profile buttons
    modalContainer.querySelectorAll('.btn-delete-profile').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const deleteId = btn.getAttribute('data-delete-id');
        const profileToDelete = getProfiles().find(p => p.id === deleteId);
        if (!profileToDelete) return;

        if (!confirm(`"${profileToDelete.name}" profilini silmek istediğinize emin misiniz?`)) return;

        const success = deleteProfile(deleteId);
        if (success) {
          showToast(`"${profileToDelete.name}" profili silindi.`, 'info');
          renderModalContent('select');
        } else {
          showToast('Bu profil silinemez.', 'error');
        }
      };
    });

    // Trakt, Backup and PWA Buttons inside modal
    const traktBtn = modalContainer.querySelector('#btn-modal-open-trakt');
    if (traktBtn) {
      traktBtn.onclick = () => {
        closeProfileModal();
        openTraktModal();
      };
    }

    const backupBtn = modalContainer.querySelector('#btn-modal-open-backup');
    if (backupBtn) {
      backupBtn.onclick = () => {
        closeProfileModal();
        openDataManagerModal();
      };
    }

    const pwaBtn = modalContainer.querySelector('#btn-modal-pwa-install');
    if (pwaBtn) {
      pwaBtn.onclick = () => {
        promptAppInstall();
      };
    }

    const checkUpdateBtn = modalContainer.querySelector('#btn-modal-check-update');
    if (checkUpdateBtn) {
      checkUpdateBtn.onclick = () => {
        checkForAppUpdates({ manual: true });
      };
    }

    // Profile Click Handlers
    modalContainer.querySelectorAll('.profile-card[data-profile-id]').forEach(card => {
      card.onclick = () => {
        const pId = card.getAttribute('data-profile-id');
        if (!pId) return;

        if (isManaging) {
          // If in manage mode, allow user to rename or delete
          const p = getProfiles().find(x => x.id === pId);
          if (!p) return;
          const newName = prompt(`"${p.name}" profilinin yeni adını girin:`, p.name);
          if (newName && newName.trim() && newName.trim() !== p.name) {
            p.name = newName.trim();
            saveProfiles(getProfiles());
            showToast('Profil güncellendi.', 'info');
            renderModalContent('select');
          }
          return;
        }

        const p = getProfiles().find(x => x.id === pId);
        setActiveProfile(pId);
        closeProfileModal();
        triggerProfileSwitchTransition(p);
      };
    });

    // --- ADD VIEW EVENTS ---
    // Back arrow button (top-left)
    const cancelAddBtn = modalContainer.querySelector('#btn-cancel-add-profile');
    if (cancelAddBtn) cancelAddBtn.onclick = () => renderModalContent('select');

    // İptal button (bottom)
    const backBtn = modalContainer.querySelector('#btn-back-to-profiles');
    if (backBtn) backBtn.onclick = () => renderModalContent('select');

    // Form Add Profile
    const form = modalContainer.querySelector('#form-add-profile');
    if (form) {
      let selectedColor = '#dfff76';
      form.querySelectorAll('.color-dot').forEach(dot => {
        dot.onclick = () => {
          form.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
          dot.classList.add('active');
          selectedColor = dot.getAttribute('data-color');
        };
      });

      form.onsubmit = (e) => {
        e.preventDefault();
        const nameInput = form.querySelector('#new-profile-name');
        const kidCheck = form.querySelector('#new-profile-kid-check');
        const name = nameInput ? nameInput.value.trim() : '';
        const isKid = kidCheck ? kidCheck.checked : false;

        if (name) {
          const newP = addProfile({
            name,
            isKid,
            avatar: isKid ? 'smile' : 'user',
            color: selectedColor
          });
          setActiveProfile(newP.id);
          closeProfileModal();
          triggerProfileSwitchTransition(newP);
        }
      };
    }
  };

  renderModalContent('select');

  modalContainer.onclick = (e) => {
    if (e.target === modalContainer) closeProfileModal();
  };

  const handleKeys = e => {
    if (e.key === 'Escape') closeProfileModal();
    if (e.key === 'Tab') {
      const focusable = [...modalContainer.querySelectorAll('button,a[href],input,select')].filter(el => !el.disabled && el.getClientRects().length);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
  };
  window.addEventListener('keydown', handleKeys, { signal: profileEvents.signal });
}

export function closeProfileModal() {
  profileEvents?.abort();
  if (activeProfileModal) {
    try { activeProfileModal.remove(); } catch (_) {}
    activeProfileModal = null;
    if (previousProfileFocus?.isConnected) previousProfileFocus.focus();
    previousProfileFocus = null;
  }
}

/**
 * Silky 60fps glass transition curtain when switching profiles
 * Re-renders SPA view without full page reload!
 */
export function triggerProfileSwitchTransition(profile) {
  const existing = document.getElementById('profile-switch-curtain');
  if (existing) existing.remove();

  const curtain = document.createElement('div');
  curtain.id = 'profile-switch-curtain';
  curtain.className = 'profile-switch-curtain is-entering';
  curtain.innerHTML = `
    <div class="profile-switch-card">
      <div class="profile-switch-avatar" style="border-color: ${getProfileAccent(profile?.color)}; background: ${getProfileAccent(profile?.color)}22;">
        <i data-lucide="${profile?.avatar || (profile?.isKid ? 'smile' : 'user')}" style="width: 50px; height: 50px; color: ${getProfileAccent(profile?.color)};"></i>
      </div>
      <h2 class="profile-switch-name">${escapeProfileText(profile?.name || 'Profil')}</h2>
      <p class="profile-switch-subtitle">
        ${profile?.isKid ? '🎈 Güvenli Çocuk Moduna Geçiliyor...' : '✨ Profiline Geçiliyor...'}
      </p>
      <div class="profile-switch-progress-bar">
        <div class="profile-switch-progress-fill"></div>
      </div>
    </div>
  `;
  document.body.appendChild(curtain);
  renderIcons(curtain);

  // Notify router & views to reload data for the new profile
  window.dispatchEvent(new CustomEvent('sineflix_profile_changed', { detail: { profile } }));

  // Silky smooth dismissal after view renders
  setTimeout(() => {
    curtain.classList.remove('is-entering');
    curtain.classList.add('is-leaving');
    setTimeout(() => {
      curtain.remove();
    }, 450);
  }, 600);
}

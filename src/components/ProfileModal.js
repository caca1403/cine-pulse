import { renderIcons } from '../services/icons.js';
/* ==========================================================================
   CinePulse Studio - "Kim İzliyor?" Çoklu Profil Yönetimi Modal
   Allows switching between user profiles, kids mode, and managing
   isolated watch histories and watchlists.
   ========================================================================== */

import { getProfiles, getActiveProfile, setActiveProfile, addProfile, deleteProfile } from '../services/storage.js';
import { showToast } from './Toast.js';
import { openDataManagerModal } from './DataManagerModal.js';
import { promptInstall } from '../services/pwaManager.js';

let activeProfileModal = null;

export function openProfileModal() {
  closeProfileModal();

  const modalContainer = document.createElement('div');
  modalContainer.id = 'profile-modal-root';
  modalContainer.className = 'profile-backdrop';
  document.body.appendChild(modalContainer);
  activeProfileModal = modalContainer;

  const renderModalContent = (viewState = 'select') => {
    const profiles = getProfiles();
    const active = getActiveProfile();

    if (viewState === 'select') {
      modalContainer.innerHTML = `
        <div class="profile-dialog">
          <button class="profile-close-btn" id="btn-close-profile-modal" title="Kapat">
            <i data-lucide="x" style="width: 20px; height: 20px;"></i>
          </button>

          <div class="profile-top-title">
            <h2>Kim İzliyor?</h2>
            <p>Kaldığınız yerden devam etmek için kendi profilinizi seçin.</p>
          </div>

          <!-- Profiles Grid -->
          <div class="profile-cards-grid">
            ${profiles.map(p => {
              const isAct = p.id === active.id;
              const canDelete = p.id !== 'prof_1';
              return `
                <div class="profile-card-wrapper">
                  <div class="profile-card ${isAct ? 'is-active' : ''}" data-profile-id="${p.id}">
                    <div class="profile-avatar-wrap" style="border-color: ${p.color || '#f59e0b'}; background: ${p.color || '#f59e0b'}22;">
                      <i data-lucide="${p.avatar || 'user'}" style="width: 44px; height: 44px; color: ${p.color || '#f59e0b'};"></i>
                      ${isAct ? `
                        <div class="profile-active-check">
                          <i data-lucide="check" style="width: 14px; height: 14px;"></i>
                        </div>
                      ` : ''}
                    </div>
                    <span class="profile-name">${p.name}</span>
                    ${p.isKid ? `<span class="profile-kid-badge">Çocuk</span>` : ''}
                  </div>
                  ${canDelete ? `
                    <button class="btn-delete-profile" data-delete-id="${p.id}" title="Profili Sil">
                      <i data-lucide="trash-2" style="width: 13px; height: 13px;"></i>
                    </button>
                  ` : ''}
                </div>
              `;
            }).join('')}

            <!-- Add Profile Card -->
            <div class="profile-card-wrapper">
              <div class="profile-card profile-card-add" id="btn-show-add-profile">
                <div class="profile-avatar-wrap add-wrap">
                  <i data-lucide="plus" style="width: 38px; height: 38px; color: #94a3b8;"></i>
                </div>
                <span class="profile-name">Profil Ekle</span>
              </div>
            </div>
          </div>

          <!-- Featured Drama & Reels Hub Transition Button -->
          <a href="#dramas" class="profile-drama-hub-btn" id="btn-modal-open-dramas" title="Kısa Diziler ve Reels Dünyası">
            <div class="drama-hub-icon-wrap">
              <i data-lucide="sparkles" style="width: 22px; height: 22px; color: #c084fc;"></i>
            </div>
            <div class="drama-hub-text">
              <div class="drama-hub-title">
                <span>🎭 Kısa Diziler &amp; Reels</span>
                <span class="drama-hub-badge">ÖZEL KÜTÜPHANE</span>
              </div>
              <span class="drama-hub-sub">DramaBox, ReelShort ve ShortMax dizileri (TMDB dışı)</span>
            </div>
            <i data-lucide="chevron-right" style="width: 18px; height: 18px; color: #a855f7; margin-left: auto;"></i>
          </a>

          <!-- Bottom Management Bar -->
          <div class="profile-footer-bar">
            <button class="btn-manage-profiles" id="btn-modal-open-backup" title="Yedekleme & Veri Yönetimi">
              <i data-lucide="hard-drive-download" style="width: 15px; height: 15px;"></i>
              <span>Veri & Yedek</span>
            </button>
            <button class="btn-manage-profiles" id="btn-modal-pwa-install" title="CinePulse Uygulamasını Yükle">
              <i data-lucide="download" style="width: 15px; height: 15px;"></i>
              <span>Uygulamayı Yükle</span>
            </button>
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
            <h2>Yeni Profil Oluştur</h2>
            <p>Kişiselleştirilmiş izleme geçmişi için yeni bir profil ekleyin.</p>
          </div>

          <form id="form-add-profile" class="profile-add-form">
            <div class="profile-input-group">
              <label>Profil Adı</label>
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
                ${['#f59e0b', '#38bdf8', '#ec4899', '#10b981', '#a855f7', '#ef4444'].map((c, i) => `
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

    // --- SELECT VIEW EVENTS ---
    const closeBtn = modalContainer.querySelector('#btn-close-profile-modal');
    if (closeBtn) closeBtn.onclick = () => closeProfileModal();

    const addCardBtn = modalContainer.querySelector('#btn-show-add-profile');
    if (addCardBtn) addCardBtn.onclick = () => renderModalContent('add');

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

    // Drama Hub Button inside modal
    const dramasBtn = modalContainer.querySelector('#btn-modal-open-dramas');
    if (dramasBtn) {
      dramasBtn.onclick = () => {
        closeProfileModal();
      };
    }

    // Backup and PWA Buttons inside modal
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
        promptInstall();
      };
    }

    // Profile Click Handlers
    modalContainer.querySelectorAll('.profile-card[data-profile-id]').forEach(card => {
      card.onclick = () => {
        const pId = card.getAttribute('data-profile-id');
        if (pId) {
          const p = getProfiles().find(x => x.id === pId);
          setActiveProfile(pId);
          closeProfileModal();
          triggerProfileSwitchTransition(p);
        }
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
      let selectedColor = '#f59e0b';
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

  const handleEsc = (e) => {
    if (e.key === 'Escape') {
      closeProfileModal();
      window.removeEventListener('keydown', handleEsc);
    }
  };
  window.addEventListener('keydown', handleEsc);
}

export function closeProfileModal() {
  if (activeProfileModal) {
    try { activeProfileModal.remove(); } catch (_) {}
    activeProfileModal = null;
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
      <div class="profile-switch-avatar" style="border-color: ${profile?.color || '#f59e0b'}; background: ${profile?.color || '#f59e0b'}22;">
        <i data-lucide="${profile?.avatar || (profile?.isKid ? 'smile' : 'user')}" style="width: 50px; height: 50px; color: ${profile?.color || '#f59e0b'};"></i>
      </div>
      <h2 class="profile-switch-name">${profile?.name || 'Profil'}</h2>
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

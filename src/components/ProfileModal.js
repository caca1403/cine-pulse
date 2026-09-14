/* ==========================================================================
   CinePulse Studio - "Kim İzliyor?" Çoklu Profil Yönetimi Modal
   Allows switching between user profiles, kids mode, and managing
   isolated watch histories and watchlists.
   ========================================================================== */

import { getProfiles, getActiveProfile, setActiveProfile, addProfile, deleteProfile } from '../services/storage.js';
import { showToast } from './Toast.js';

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
              return `
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
              `;
            }).join('')}

            <!-- Add Profile Card -->
            <div class="profile-card profile-card-add" id="btn-show-add-profile">
              <div class="profile-avatar-wrap add-wrap">
                <i data-lucide="plus" style="width: 38px; height: 38px; color: #94a3b8;"></i>
              </div>
              <span class="profile-name">Profil Ekle</span>
            </div>
          </div>

          <!-- Bottom Management Bar -->
          <div class="profile-footer-bar">
            <button class="btn-manage-profiles" id="btn-toggle-manage">
              <i data-lucide="settings" style="width: 15px; height: 15px;"></i>
              <span>Profilleri Yönet</span>
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

    if (window.lucide) window.lucide.createIcons({ el: modalContainer });

    // Events
    const closeBtn = modalContainer.querySelector('#btn-close-profile-modal');
    if (closeBtn) closeBtn.onclick = () => closeProfileModal();

    const addCardBtn = modalContainer.querySelector('#btn-show-add-profile');
    if (addCardBtn) addCardBtn.onclick = () => renderModalContent('add');

    const backBtn = modalContainer.querySelector('#btn-cancel-add-profile') || modalContainer.querySelector('#btn-back-to-profiles');
    if (backBtn) backBtn.onclick = () => renderModalContent('select');

    // Profile Click Handlers
    modalContainer.querySelectorAll('.profile-card[data-profile-id]').forEach(card => {
      card.onclick = () => {
        const pId = card.getAttribute('data-profile-id');
        if (pId) {
          setActiveProfile(pId);
          const p = getProfiles().find(x => x.id === pId);
          showToast(`👤 "${p?.name || 'Profil'}" profiline geçiş yapıldı!`, 'success');
          closeProfileModal();
          // Reload page state / hash to re-render views with new profile isolation
          window.dispatchEvent(new CustomEvent('sineflix_data_changed', { detail: { key: 'profile_switch' } }));
        }
      };
    });

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
            avatar: isKid ? 'baby' : 'user',
            color: selectedColor
          });
          setActiveProfile(newP.id);
          showToast(`✓ "${name}" profili oluşturuldu!`, 'success');
          closeProfileModal();
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

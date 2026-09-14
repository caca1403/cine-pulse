/* ==========================================================================
   CinePulse Studio - Profile Onboarding Modal
   Shown to first-time visitors so every user sets their own profile name & avatar,
   preventing hardcoded default names like 'Çağatay' across random visitors.
   ========================================================================== */

import { isProfileSetupComplete, completeProfileSetup } from '../services/storage.js';

const AVATAR_OPTIONS = [
  { id: 'user-circle', icon: 'user', label: 'Klasik', color: '#f59e0b' },
  { id: 'clapperboard', icon: 'clapperboard', label: 'Sinema', color: '#ec4899' },
  { id: 'film', icon: 'film', label: 'Yıldız', color: '#8b5cf6' },
  { id: 'sparkles', icon: 'sparkles', label: 'Sihirli', color: '#10b981' },
  { id: 'tv', icon: 'tv', label: 'Dizi Kolik', color: '#3b82f6' },
  { id: 'baby', icon: 'baby', label: 'Çocuk', color: '#38bdf8' },
  { id: 'smile', icon: 'smile', label: 'Neşeli', color: '#eab308' },
  { id: 'flame', icon: 'flame', label: 'Ateşli', color: '#ef4444' }
];

export function checkAndShowProfileOnboarding() {
  if (isProfileSetupComplete()) return;
  if (document.getElementById('profile-onboarding-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'profile-onboarding-overlay';
  overlay.className = 'onboarding-overlay';
  overlay.innerHTML = `
    <div class="onboarding-modal-card animate-scale-in">
      <div class="onboarding-header">
        <div class="brand-logo-icon" style="width: 48px; height: 48px; border-radius: 12px; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--accent-primary, #6366f1), var(--accent-secondary, #ec4899));">
          <i data-lucide="clapperboard" style="width: 24px; height: 24px; color: #fff;"></i>
        </div>
        <h2 style="font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">CinePulse'a Hoş Geldiniz!</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted, #94a3b8); max-width: 340px; margin: 0 auto;">
          Kişiselleştirilmiş dizi & film deneyiminiz için profilinizi belirleyin.
        </p>
      </div>

      <form id="onboarding-form" style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #cbd5e1; margin-bottom: 0.5rem; text-align: left;">
            Profil Adınız
          </label>
          <input 
            type="text" 
            id="onboarding-name-input" 
            class="onboarding-input"
            placeholder="Örn: Kendi Adınız..." 
            maxlength="24"
            required
            autocomplete="off"
            autofocus
          />
        </div>

        <div>
          <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #cbd5e1; margin-bottom: 0.65rem; text-align: left;">
            Avatarınızı Seçin
          </label>
          <div class="onboarding-avatars-grid">
            ${AVATAR_OPTIONS.map((av, idx) => `
              <button 
                type="button" 
                class="onboarding-avatar-btn ${idx === 0 ? 'selected' : ''}" 
                data-avatar="${av.id}"
                data-color="${av.color}"
                style="--av-color: ${av.color};"
                title="${av.label}"
              >
                <i data-lucide="${av.icon}" style="width: 20px; height: 20px;"></i>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="onboarding-kids-toggle">
          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; user-select: none;">
            <div style="text-align: left;">
              <div style="font-size: 0.9rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 0.4rem;">
                <i data-lucide="baby" style="width: 16px; height: 16px; color: #38bdf8;"></i> Çocuk Profili
              </div>
              <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">
                Yalnızca çocuklara uygun güvenli animasyon ve çizgi filmleri gösterir.
              </div>
            </div>
            <input type="checkbox" id="onboarding-is-kid" class="custom-toggle-checkbox" style="width: 20px; height: 20px; accent-color: #38bdf8; cursor: pointer;" />
          </label>
        </div>

        <button type="submit" class="onboarding-submit-btn">
          <span>İzlemeye Başla</span>
          <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  if (window.lucide) {
    window.lucide.createIcons({ root: overlay });
  }

  // Handle avatar selections
  let selectedAvatar = AVATAR_OPTIONS[0].id;
  let selectedColor = AVATAR_OPTIONS[0].color;

  overlay.querySelectorAll('.onboarding-avatar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      overlay.querySelectorAll('.onboarding-avatar-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedAvatar = btn.getAttribute('data-avatar');
      selectedColor = btn.getAttribute('data-color');
    });
  });

  // Handle form submission
  const form = overlay.querySelector('#onboarding-form');
  const input = overlay.querySelector('#onboarding-name-input');
  const isKidCheckbox = overlay.querySelector('#onboarding-is-kid');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawName = input.value.trim();
    if (!rawName) return;

    completeProfileSetup({
      name: rawName,
      avatar: selectedAvatar,
      color: selectedColor,
      isKid: isKidCheckbox.checked
    });

    overlay.classList.add('animate-fade-out');
    setTimeout(() => {
      overlay.remove();
      window.location.reload();
    }, 280);
  });
}

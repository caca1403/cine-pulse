import { renderSiteLogo, getProfileAccent } from './BrandLogo.js';
import { renderIcons } from '../services/kabuk/icons.js';
/* ==========================================================================
   CinePulse Studio - "Kim İzliyor?" Çoklu Profil Yönetimi Modal
   Allows switching between user profiles, kids mode, and managing
   isolated watch histories and watchlists.
   ========================================================================== */

import { getProfiles, getActiveProfile, setActiveProfile, addProfile, deleteProfile, saveProfiles, setProfileYasKademesi, getProfileYasKademesi, pinBelirle, pinKaldir, profilAc } from '../services/altyapi/storage.js';
import { pinGecerliMi, pinNormalize, pinAktifMi, pinKilitDurumu, PIN_HATA_ESIGI, PIN_KILIT_MS, YAS_KADEMELERI } from '../services/altyapi/profil-pin.js';
import { showToast } from './Toast.js';
import { openDataManagerModal } from './DataManagerModal.js';
import { openTraktModal } from './TraktModal.js';
import { isNativeAndroidApp, checkForAppUpdates, promptAppInstall } from '../services/platform/platformBridge.js';

let activeProfileModal = null;
let profileEvents;
let previousProfileFocus;
// PIN deneme sayacı bellekte tutulur (localStorage'a YAZMAZ).
let pinHataSayisi = 0;
let pinKilitBitis = 0;
let pinSayacTimer = null;
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

  const renderModalContent = (viewState = 'select', ctx = {}) => {
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
                    <span class="profile-name netflix-profile-name">${escapeProfileText(p.name)}${p.pinHash && pinAktifMi() ? ' 🔒' : ''}</span>
                  </button>

                  ${isManaging ? `
                    <div class="profile-manage-row" style="display:flex;flex-direction:column;align-items:center;gap:5px;margin-top:6px;">
                      ${canDelete ? `
                        <button class="btn-delete-profile netflix-delete-btn" data-delete-id="${p.id}" title="Profili Sil">
                          <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                        </button>
                      ` : ''}
                      ${pinAktifMi() ? `
                        <button class="btn-manage-profiles" data-pin-ayar-id="${p.id}" title="Profil PIN'i belirle veya değiştir" style="min-height:28px;padding:2px 10px;font-size:11px;">
                          <i data-lucide="${p.pinHash ? 'key-round' : 'lock'}" style="width: 12px; height: 12px;"></i>
                          <span>${p.pinHash ? 'PIN Değiştir' : 'PIN Belirle'}</span>
                        </button>
                        ${p.pinHash ? `
                          <button class="btn-manage-profiles" data-pin-kaldir-id="${p.id}" title="Profil PIN'ini kaldır" style="min-height:28px;padding:2px 10px;font-size:11px;">
                            <i data-lucide="lock-open" style="width: 12px; height: 12px;"></i>
                            <span>PIN Kaldır</span>
                          </button>
                        ` : ''}
                      ` : ''}
                      ${p.isKid ? `
                        <div style="display:flex;gap:4px;" role="group" aria-label="Yaş kademesi">
                          ${YAS_KADEMELERI.map(k => `
                            <button type="button" class="btn-manage-profiles ${getProfileYasKademesi(p) === k ? 'is-active-done' : ''}" data-kademe="${k}" data-kademe-id="${p.id}" title="${k === 'cocuk' ? 'Yalnız kid-safe içerik' : k === 'genclik' ? 'Süzgeç yok (normal mod)' : 'Süzgeç yok'}" style="min-height:26px;padding:2px 7px;font-size:10px;">
                              <span>${k === 'cocuk' ? 'Çocuk' : k === 'genclik' ? 'Gençlik' : 'Yetişkin'}</span>
                            </button>
                          `).join('')}
                        </div>
                      ` : ''}
                    </div>
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
            <button class="btn-manage-profiles" id="btn-modal-open-debrid" title="VEGA Ayarları">
              <i data-lucide="zap" style="width: 14px; height: 14px; color: #dfff76;"></i>
              <span>VEGA</span>
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

            <div class="profile-color-picker-row" id="new-profile-kademe-row" style="display:none;">
              <label>Yaş Kademesi</label>
              <div style="display:flex;gap:10px;flex-wrap:wrap;">
                <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;"><input type="radio" name="new-profile-kademe" value="cocuk" checked /> Çocuk (yalnız kid-safe)</label>
                <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;"><input type="radio" name="new-profile-kademe" value="genclik" /> Gençlik (süzgeç yok)</label>
                <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;"><input type="radio" name="new-profile-kademe" value="yetiskin" /> Yetişkin</label>
              </div>
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
    } else if (viewState === 'pin') {
      // PIN sorma katmanı: 4-6 hane; yanlışta toast + 3 hatada 30 sn kilit.
      const { profile, baslik, sonraki } = ctx;
      modalContainer.innerHTML = `
        <div class="profile-dialog profile-dialog-small">
          <button class="profile-close-btn" id="btn-pin-geri" title="Geri">
            <i data-lucide="arrow-left" style="width: 20px; height: 20px;"></i>
          </button>

          <div class="profile-top-title">
            <h2 id="cp-profile-heading">${escapeProfileText(baslik || 'Profil PIN\'i')}</h2>
            <p>"${escapeProfileText(profile?.name || '')}" — bu, bu cihazdaki yerel bir eşiştir; kriptografik koruma değildir.</p>
          </div>

          <form id="form-pin-gir" class="profile-add-form">
            <div class="profile-input-group">
              <label for="pin-gir-input">4-6 hane PIN</label>
              <input type="password" inputmode="numeric" autocomplete="off" maxlength="6" id="pin-gir-input" placeholder="••••" />
            </div>
            <p id="pin-hata-metni" role="alert" style="color:#f87171;min-height:18px;font-size:13px;margin:0 0 8px;"></p>
            <div class="profile-form-actions">
              <button type="button" class="btn-secondary" id="btn-pin-vazgec">Vazgeç</button>
              <button type="submit" class="btn-primary" id="btn-pin-gonder">Aç</button>
            </div>
          </form>
        </div>
      `;
    } else if (viewState === 'pin-ayar') {
      // İki adımlı PIN belirleme: PIN + tekrarı; eşleşmezse hata.
      const prof = getProfiles().find(x => x.id === ctx.profileId);
      if (!prof) { renderModalContent('select'); return; }
      modalContainer.innerHTML = `
        <div class="profile-dialog profile-dialog-small">
          <button class="profile-close-btn" id="btn-pin-geri" title="Geri">
            <i data-lucide="arrow-left" style="width: 20px; height: 20px;"></i>
          </button>

          <div class="profile-top-title">
            <h2 id="cp-profile-heading">${prof.pinHash ? 'PIN Değiştir' : 'Profil PIN\'i Belirle'}</h2>
            <p>"${escapeProfileText(prof.name)}" — bu, bu cihazdaki yerel bir eşiştir; kriptografik koruma değildir.</p>
          </div>

          <form id="form-pin-ayar" class="profile-add-form">
            <div class="profile-input-group">
              <label for="pin-ayar-1">Yeni PIN (4-6 hane)</label>
              <input type="password" inputmode="numeric" autocomplete="off" maxlength="6" id="pin-ayar-1" />
            </div>
            <div class="profile-input-group">
              <label for="pin-ayar-2">PIN'i tekrar girin</label>
              <input type="password" inputmode="numeric" autocomplete="off" maxlength="6" id="pin-ayar-2" />
            </div>
            <p id="pin-ayar-hata" role="alert" style="color:#f87171;min-height:18px;font-size:13px;margin:0 0 8px;"></p>
            <div class="profile-form-actions">
              <button type="button" class="btn-secondary" id="btn-pin-ayar-vazgec">İptal</button>
              <button type="submit" class="btn-primary">Kaydet</button>
            </div>
          </form>
        </div>
      `;
    }

    renderIcons(modalContainer);
    (modalContainer.querySelector('#new-profile-name') || modalContainer.querySelector('#pin-gir-input') || modalContainer.querySelector('#pin-ayar-1') || modalContainer.querySelector('#btn-close-profile-modal'))?.focus();

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

    // PIN ayar satırı (isteğe bağlı; çocuk profili şartı yok)
    modalContainer.querySelectorAll('[data-pin-ayar-id]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        renderModalContent('pin-ayar', { profileId: btn.getAttribute('data-pin-ayar-id') });
      };
    });
    modalContainer.querySelectorAll('[data-pin-kaldir-id]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        if (!confirm('Bu profilin PIN\'i kaldırılsın mı?')) return;
        pinKaldir(btn.getAttribute('data-pin-kaldir-id'));
        showToast('Profil PIN\'i kaldırıldı.', 'info');
        renderModalContent('select');
      };
    });

    // Yaş kademesi seçici (çocuk profilleri)
    modalContainer.querySelectorAll('[data-kademe-id]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const ok = setProfileYasKademesi(btn.getAttribute('data-kademe-id'), btn.getAttribute('data-kademe'));
        if (ok) {
          showToast('Yaş kademesi güncellendi.', 'info');
          renderModalContent('select');
        } else {
          showToast('Geçersiz yaş kademesi.', 'error');
        }
      };
    });

    // --- PIN GATE (sorma) VIEW EVENTS ---
    const pinForm = modalContainer.querySelector('#form-pin-gir');
    if (pinForm) {
      const geriBtn = () => { pinHataSayisi = 0; pinKilitBitis = 0; renderModalContent('select'); };
      modalContainer.querySelector('#btn-pin-geri').onclick = geriBtn;
      modalContainer.querySelector('#btn-pin-vazgec').onclick = geriBtn;
      const pinInput = modalContainer.querySelector('#pin-gir-input');
      const hataEl = modalContainer.querySelector('#pin-hata-metni');
      const gonderBtn = modalContainer.querySelector('#btn-pin-gonder');

      const kilitSonlandir = () => {
        clearInterval(pinSayacTimer); pinSayacTimer = null;
        pinHataSayisi = 0; pinKilitBitis = 0;
        pinInput.disabled = false; gonderBtn.disabled = false;
        hataEl.textContent = '';
        pinInput.focus();
      };
      const kilitBaslat = () => {
        pinKilitBitis = Date.now() + PIN_KILIT_MS;
        pinInput.disabled = true; gonderBtn.disabled = true;
        clearInterval(pinSayacTimer);
        const tik = () => {
          const { kilitli, kalanMs } = pinKilitDurumu(pinHataSayisi, pinKilitBitis - PIN_KILIT_MS, Date.now());
          if (!kilitli) { kilitSonlandir(); return; }
          hataEl.textContent = `Çok fazla hatalı deneme. ${Math.ceil(kalanMs / 1000)} saniye sonra tekrar deneyin.`;
        };
        tik();
        pinSayacTimer = setInterval(tik, 500);
      };

      pinForm.onsubmit = async (e) => {
        e.preventDefault();
        if (Date.now() < pinKilitBitis) return;
        const girilen = pinNormalize(pinInput.value);
        if (!pinGecerliMi(girilen)) { hataEl.textContent = 'PIN 4-6 hane olmalıdır.'; return; }
        const ok = await profilAc(ctx.profile.id, girilen);
        if (ok) {
          pinHataSayisi = 0; pinKilitBitis = 0;
          clearInterval(pinSayacTimer); pinSayacTimer = null;
          const devam = ctx.sonraki;
          ctx.sonraki = null; // tekrar tetiklenmesin
          devam?.();
          return;
        }
        pinHataSayisi += 1;
        pinInput.value = '';
        showToast('PIN hatalı.', 'error');
        if (pinHataSayisi >= PIN_HATA_ESIGI) kilitBaslat();
        else hataEl.textContent = `Hatalı PIN. ${PIN_HATA_ESIGI - pinHataSayisi} deneme hakkınız kaldı.`;
      };
    }

    // --- PIN AYAR (belirle/değiştir) VIEW EVENTS ---
    const pinAyarForm = modalContainer.querySelector('#form-pin-ayar');
    if (pinAyarForm) {
      const geri = () => renderModalContent('select');
      modalContainer.querySelector('#btn-pin-geri').onclick = geri;
      modalContainer.querySelector('#btn-pin-ayar-vazgec').onclick = geri;
      const hataEl = modalContainer.querySelector('#pin-ayar-hata');
      pinAyarForm.onsubmit = async (e) => {
        e.preventDefault();
        const a = pinNormalize(pinAyarForm.querySelector('#pin-ayar-1').value);
        const b = pinNormalize(pinAyarForm.querySelector('#pin-ayar-2').value);
        if (!pinGecerliMi(a)) { hataEl.textContent = 'PIN 4-6 hane olmalıdır.'; return; }
        if (a !== b) { hataEl.textContent = 'PIN\'ler eşleşmiyor.'; return; }
        const ok = await pinBelirle(ctx.profileId, a);
        if (!ok) { hataEl.textContent = 'PIN kaydedilemedi.'; return; }
        showToast('Profil PIN\'i kaydedildi.', 'info');
        renderModalContent('select');
      };
    }

    // Trakt, Backup and PWA Buttons inside modal
    const traktBtn = modalContainer.querySelector('#btn-modal-open-trakt');
    if (traktBtn) {
      traktBtn.onclick = () => {
        closeProfileModal();
        openTraktModal();
      };
    }

    const debridBtn = modalContainer.querySelector('#btn-modal-open-debrid');
    if (debridBtn) {
      debridBtn.onclick = async () => {
        closeProfileModal();
        const { openDebridModal } = await import('./DebridModal.js');
        openDebridModal();
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
        if (!p) return;
        const aktif = getActiveProfile();
        const gec = () => {
          setActiveProfile(pId);
          closeProfileModal();
          triggerProfileSwitchTransition(p);
        };
        // PIN'li AÇIK profilden çıkış + PIN'li HEDEFE giriş: ikisi de PIN ister.
        const cikisPinli = pinAktifMi() && aktif && aktif.id !== pId && aktif.pinHash;
        const hedefPinli = pinAktifMi() && p.pinHash && p.id !== aktif?.id;
        if (!cikisPinli && !hedefPinli) { gec(); return; }
        renderModalContent('pin', {
          profile: cikisPinli ? aktif : p,
          baslik: cikisPinli ? 'Profil Değiştirme PIN\'i' : 'Profil PIN\'i',
          sonraki: cikisPinli && hedefPinli
            ? () => renderModalContent('pin', { profile: p, baslik: 'Profil PIN\'i', sonraki: gec })
            : gec
        });
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

      // Çocuk toggle'ı açıkken yaş kademesi seçici görünür.
      const kidCheck = form.querySelector('#new-profile-kid-check');
      const kademeRow = form.querySelector('#new-profile-kademe-row');
      if (kidCheck && kademeRow) {
        kidCheck.onchange = () => { kademeRow.style.display = kidCheck.checked ? '' : 'none'; };
      }

      form.onsubmit = (e) => {
        e.preventDefault();
        const nameInput = form.querySelector('#new-profile-name');
        const kidCheckEl = form.querySelector('#new-profile-kid-check');
        const name = nameInput ? nameInput.value.trim() : '';
        const isKid = kidCheckEl ? kidCheckEl.checked : false;

        if (name) {
          const newP = addProfile({
            name,
            isKid,
            avatar: isKid ? 'smile' : 'user',
            color: selectedColor
          });
          if (isKid) {
            const kademe = form.querySelector('input[name="new-profile-kademe"]:checked')?.value;
            if (kademe) setProfileYasKademesi(newP.id, kademe);
          }
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
  if (pinSayacTimer) { clearInterval(pinSayacTimer); pinSayacTimer = null; }
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

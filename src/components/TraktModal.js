import { renderIcons } from '../services/icons.js';
import { showToast } from './Toast.js';
import * as traktService from '../services/traktService.js';
import {
  getWatchHistory,
  saveWatchProgress,
  getWatchlist,
  toggleWatchlist,
  isWatchlist,
  cleanTraktImportedHistory
} from '../services/storage.js';

let activeEscListener = null;

export function openTraktModal() {
  let modalContainer = document.getElementById('trakt-modal');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'trakt-modal';
    modalContainer.className = 'modal-backdrop';
    document.body.appendChild(modalContainer);
  }

  const render = (viewState = 'main', stateData = {}) => {
    const isConnected = traktService.isTraktConnected();
    const user = traktService.getStoredUser();
    const settings = traktService.getTraktSettings();
    const lastSyncTime = traktService.getLastSyncTime();

    let lastSyncStr = 'Henüz yapılmadı';
    if (lastSyncTime) {
      const d = new Date(lastSyncTime);
      lastSyncStr = `${d.toLocaleDateString('tr-TR')} ${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
    }

    if (viewState === 'connecting') {
      const { userCode, verificationUrl, expiresIn } = stateData;
      modalContainer.innerHTML = `
        <div class="data-modal-content trakt-dialog">
          <div class="data-modal-header" style="border-bottom: 1px solid rgba(237, 28, 36, 0.2);">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="trakt-logo-badge">
                <i data-lucide="tv" style="width: 18px; height: 18px; color: #ed1c24;"></i>
              </div>
              <h2 class="data-modal-title" style="color: #fff;">Trakt.tv Cihaz Aktivasyonu</h2>
            </div>
            <button id="trakt-close-btn" class="btn-modal-close" title="Kapat (ESC)">
              <i data-lucide="x" style="width: 18px; height: 18px;"></i>
            </button>
          </div>

          <div class="data-modal-body" style="text-align: center; padding: 2rem 1.5rem;">
            <div class="trakt-pulse-loader">
              <div class="trakt-pulse-circle"></div>
              <i data-lucide="smartphone" style="width: 32px; height: 32px; color: #ed1c24;"></i>
            </div>

            <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin: 1rem 0 0.5rem;">
              Aktivasyon Kodunuz
            </h3>
            <p style="font-size: 0.88rem; color: #94a3b8; max-width: 380px; margin: 0 auto 1.5rem;">
              Aşağıdaki kodu kopyalayıp Trakt onay sayfasında girerek CinePulse'ı yetkilendirin:
            </p>

            <div class="trakt-code-display" id="btn-copy-trakt-code" title="Kodu Kopyala">
              <span class="trakt-code-text">${userCode || '---- ----'}</span>
              <button class="trakt-code-copy-icon">
                <i data-lucide="copy" style="width: 16px; height: 16px;"></i>
              </button>
            </div>

            <div style="display: flex; gap: 0.8rem; justify-content: center; margin-top: 1.8rem; flex-wrap: wrap;">
              <a href="${verificationUrl || 'https://trakt.tv/activate'}" target="_blank" rel="noopener noreferrer" class="btn-primary trakt-btn-glow" style="padding: 0.75rem 1.6rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
                <span>trakt.tv/activate Sayfasını Aç</span>
              </a>
              <button id="btn-cancel-trakt-poll" class="btn-secondary" style="padding: 0.75rem 1.4rem;">
                İptal Et
              </button>
            </div>

            <div class="trakt-waiting-status" style="margin-top: 1.8rem; font-size: 0.82rem; color: #64748b; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <span class="trakt-dot-ping"></span>
              <span id="trakt-poll-status-text">Trakt onayınız bekleniyor...</span>
            </div>
          </div>
        </div>
      `;
    } else {
      // Main View
      modalContainer.innerHTML = `
        <div class="data-modal-content trakt-dialog">
          <div class="data-modal-header" style="border-bottom: 1px solid rgba(237, 28, 36, 0.2);">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div class="trakt-logo-badge">
                <i data-lucide="tv" style="width: 18px; height: 18px; color: #ed1c24;"></i>
              </div>
              <h2 class="data-modal-title" style="color: #fff;">Trakt.tv Entegrasyonu</h2>
            </div>
            <button id="trakt-close-btn" class="btn-modal-close" title="Kapat (ESC)">
              <i data-lucide="x" style="width: 18px; height: 18px;"></i>
            </button>
          </div>

          <div class="data-modal-body" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem;">
            ${!isConnected ? `
              <!-- Not Connected Hero -->
              <div class="trakt-hero-banner">
                <div class="trakt-hero-info">
                  <span class="trakt-pill-tag">Buluşma Noktası</span>
                  <h3 class="trakt-hero-title">İzlediklerini Trakt ile Otomatik Eşitle</h3>
                  <p class="trakt-hero-sub">
                    CinePulse üzerinden izlediğin dizi ve filmler anında Trakt profiline işlensin.
                    Watchlist ve izleme geçmişin tüm cihazlarında senkron kalsın.
                  </p>
                </div>
              </div>

              <!-- Feature Grid -->
              <div class="trakt-features-grid">
                <div class="trakt-feature-item">
                  <div class="trakt-feat-icon" style="background: rgba(237, 28, 36, 0.15); color: #ed1c24;">
                    <i data-lucide="play-circle" style="width: 20px; height: 20px;"></i>
                  </div>
                  <div>
                    <div class="trakt-feat-title">Canlı Scrobble</div>
                    <div class="trakt-feat-desc">İzlediğin içerik oynatılırken anında Trakt'ta görünür.</div>
                  </div>
                </div>

                <div class="trakt-feature-item">
                  <div class="trakt-feat-icon" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">
                    <i data-lucide="refresh-cw" style="width: 20px; height: 20px;"></i>
                  </div>
                  <div>
                    <div class="trakt-feat-title">Çift Yönlü Senkron</div>
                    <div class="trakt-feat-desc">Trakt izleme listen ve geçmişin CinePulse ile eşitlenir.</div>
                  </div>
                </div>

                <div class="trakt-feature-item">
                  <div class="trakt-feat-icon" style="background: rgba(34, 197, 94, 0.15); color: #22c55e;">
                    <i data-lucide="shield-check" style="width: 20px; height: 20px;"></i>
                  </div>
                  <div>
                    <div class="trakt-feat-title">Şifresiz Güvenli Bağlantı</div>
                    <div class="trakt-feat-desc">Aktivasyon koduyla resmi Trakt sayfasından tek tıkla bağlanın.</div>
                  </div>
                </div>
              </div>

              <!-- Connect Button -->
              <button id="btn-start-trakt-connect" class="btn-primary trakt-btn-glow" style="margin-top: 0.5rem; justify-content: center; padding: 0.85rem 1.5rem; font-size: 0.95rem;">
                <i data-lucide="link" style="width: 18px; height: 18px;"></i>
                <span>Trakt.tv Hesabını Bağla</span>
              </button>
            ` : `
              <!-- Connected Profile Card -->
              <div class="trakt-profile-card">
                <div class="trakt-profile-avatar-wrap">
                  ${user?.images?.avatar?.full ? `
                    <img src="${user.images.avatar.full}" class="trakt-avatar-img" alt="${user.username}" />
                  ` : `
                    <div class="trakt-avatar-placeholder">
                      <i data-lucide="user" style="width: 26px; height: 26px; color: #ed1c24;"></i>
                    </div>
                  `}
                  <div class="trakt-status-dot-active" title="Bağlı"></div>
                </div>

                <div class="trakt-profile-details">
                  <div class="trakt-profile-header-row">
                    <span class="trakt-username">${user?.name || user?.username || 'Trakt Kullanıcısı'}</span>
                    ${user?.vip ? `<span class="trakt-vip-badge">VIP</span>` : ''}
                    <span class="trakt-connected-badge">BAĞLI</span>
                  </div>
                  <div class="trakt-profile-meta">
                    <span>@${user?.username || 'trakt'}</span>
                    <span>•</span>
                    <span>Son Eşitleme: <strong>${lastSyncStr}</strong></span>
                  </div>
                </div>
              </div>

              <!-- Action & Sync Panel -->
              <div class="backup-card" style="border: 1px solid rgba(237, 28, 36, 0.2); background: rgba(237, 28, 36, 0.04);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                  <h3 class="backup-card-title" style="color: #fff; margin: 0; font-size: 0.95rem;">
                    <i data-lucide="upload-cloud" style="color: #ed1c24;"></i>
                    <span>CinePulse Geçmişini Trakt'a Yükle</span>
                  </h3>
                  <button id="btn-trakt-sync-now" class="btn-primary trakt-btn-glow" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
                    <i data-lucide="refresh-cw" id="trakt-sync-icon" style="width: 14px; height: 14px;"></i>
                    <span>Şimdi Yükle</span>
                  </button>
                </div>
                <p style="font-size: 0.82rem; color: #94a3b8; margin: 0; line-height: 1.5;">
                  CinePulse'da izlediğin tüm dizi bölümlerini ve filmleri (düzeltilmiş dizi/sezon/bölüm şemasıyla) doğrudan Trakt profiline aktarır.
                </p>
                <div id="trakt-sync-result" style="display: none; margin-top: 0.8rem; padding: 0.6rem 0.8rem; border-radius: 8px; font-size: 0.8rem; background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3); color: #4ade80;"></div>
              </div>

              <!-- Clean corrupted Trakt imports Panel -->
              <div class="backup-card" style="border: 1px solid rgba(239, 68, 68, 0.25); background: rgba(239, 68, 68, 0.05); display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; gap: 10px;">
                <div>
                  <div style="font-size: 0.85rem; font-weight: 600; color: #f87171;">Hatalı Trakt Kayıtlarını Temizle</div>
                  <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">Önceki aktarımda CinePulse'a giren sahte/bozuk kayıtları tek tıkla kaldırır.</div>
                </div>
                <button id="btn-clean-trakt-history" class="btn-secondary" style="color: #f87171; border-color: rgba(239, 68, 68, 0.4); padding: 0.45rem 0.9rem; font-size: 0.8rem; flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px;">
                  <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                  <span>Temizle</span>
                </button>
              </div>

              <!-- Settings Controls -->
              <div class="trakt-settings-list">
                <div class="trakt-setting-row">
                  <div>
                    <div class="trakt-setting-title">Otomatik Scrobble (Canlı Takip)</div>
                    <div class="trakt-setting-sub">Oynatıcı açıkken içeriğin izleme durumunu Trakt'a anlık bildirir.</div>
                  </div>
                  <label class="switch-toggle">
                    <input type="checkbox" id="trakt-toggle-scrobble" ${settings.autoScrobble ? 'checked' : ''} />
                    <span class="slider-round"></span>
                  </label>
                </div>
              </div>

              <!-- Footer Actions -->
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 0.75rem; border-top: 1px solid rgba(255, 255, 255, 0.08);">
                <button id="btn-trakt-disconnect" style="color: #ef4444; background: none; border: none; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 0.4rem 0;">
                  <i data-lucide="log-out" style="width: 15px; height: 15px;"></i>
                  <span>Trakt Bağlantısını Kes</span>
                </button>

                <button id="trakt-close-footer-btn" class="btn-secondary" style="padding: 0.5rem 1.2rem; font-size: 0.85rem;">
                  Tamam
                </button>
              </div>
            `}
          </div>
        </div>
      `;
    }

    modalContainer.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    renderIcons(modalContainer);
    bindEvents(viewState, stateData);
  };

  const closeModal = () => {
    traktService.cancelDeviceAuth();
    modalContainer.classList.add('hidden');
    modalContainer.innerHTML = '';
    document.body.style.overflow = '';
    if (activeEscListener) {
      window.removeEventListener('keydown', activeEscListener);
      activeEscListener = null;
    }
  };

  const bindEvents = (viewState) => {
    const closeBtn = document.getElementById('trakt-close-btn');
    const closeFooterBtn = document.getElementById('trakt-close-footer-btn');

    if (closeBtn) closeBtn.onclick = closeModal;
    if (closeFooterBtn) closeFooterBtn.onclick = closeModal;

    modalContainer.onclick = (e) => {
      if (e.target === modalContainer) closeModal();
    };

    if (activeEscListener) window.removeEventListener('keydown', activeEscListener);
    activeEscListener = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', activeEscListener);

    if (viewState === 'connecting') {
      const copyBtn = document.getElementById('btn-copy-trakt-code');
      if (copyBtn) {
        copyBtn.onclick = () => {
          const code = copyBtn.querySelector('.trakt-code-text')?.textContent;
          if (code) {
            navigator.clipboard.writeText(code).then(() => {
              showToast('Aktivasyon kodu kopyalandı!', 'success');
            }).catch(() => {
              showToast(`Kod: ${code}`, 'info');
            });
          }
        };
      }

      const cancelBtn = document.getElementById('btn-cancel-trakt-poll');
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          traktService.cancelDeviceAuth();
          render('main');
        };
      }
    } else {
      // Connect Button
      const connectBtn = document.getElementById('btn-start-trakt-connect');
      if (connectBtn) {
        connectBtn.onclick = async () => {
          connectBtn.disabled = true;
          connectBtn.innerHTML = `<span>Kod alınıyor...</span>`;
          try {
            const data = await traktService.getDeviceCode();
            render('connecting', {
              userCode: data.user_code,
              verificationUrl: data.verification_url,
              expiresIn: data.expires_in
            });

            // Start polling
            traktService.pollDeviceToken(data.device_code, data.interval, (statusUpdate) => {
              const statusEl = document.getElementById('trakt-poll-status-text');
              if (statusEl) statusEl.textContent = statusUpdate.message;
            }).then(() => {
              showToast('Trakt.tv başarıyla bağlandı!', 'success');
              render('main');
            }).catch(err => {
              if (err.message !== 'Auth polling cancelled') {
                showToast(`Bağlantı hatası: ${err.message}`, 'error');
                render('main');
              }
            });

          } catch (err) {
            showToast(`Trakt bağlantı başlatılamadı: ${err.message}`, 'error');
            render('main');
          }
        };
      }

      // Push to Trakt Button
      const syncBtn = document.getElementById('btn-trakt-sync-now');
      if (syncBtn) {
        syncBtn.onclick = async () => {
          const icon = document.getElementById('trakt-sync-icon');
          const resultBox = document.getElementById('trakt-sync-result');
          syncBtn.disabled = true;
          if (icon) icon.classList.add('trakt-spin');

          try {
            const res = await traktService.performFullSync({
              getWatchHistory
            });

            if (resultBox) {
              resultBox.style.display = 'block';
              resultBox.innerHTML = `
                ✓ <strong>Trakt'a aktarım tamamlandı!</strong><br/>
                • ${res.pushedMoviesCount} film Trakt profiline işlendi<br/>
                • ${res.pushedEpisodesCount} dizi bölümü Trakt profiline işlendi
              `;
            }
            showToast('CinePulse izleme geçmişin Trakt\'a başarıyla aktarıldı!', 'success');
            setTimeout(() => render('main'), 2500);
          } catch (err) {
            showToast(`Aktarım hatası: ${err.message}`, 'error');
          } finally {
            syncBtn.disabled = false;
            if (icon) icon.classList.remove('trakt-spin');
          }
        };
      }

      // Clean Corrupted Trakt Records Button
      const cleanBtn = document.getElementById('btn-clean-trakt-history');
      if (cleanBtn) {
        cleanBtn.onclick = () => {
          const removed = cleanTraktImportedHistory();
          showToast(`${removed} adet hatalı Trakt kaydı geçmişten temizlendi!`, 'success');
          render('main');
        };
      }

      // Scrobble Toggle
      const scrobbleToggle = document.getElementById('trakt-toggle-scrobble');
      if (scrobbleToggle) {
        scrobbleToggle.onchange = (e) => {
          traktService.saveTraktSettings({ autoScrobble: e.target.checked });
          showToast(e.target.checked ? 'Otomatik Scrobble açıldı' : 'Otomatik Scrobble kapatıldı', 'info');
        };
      }

      // Disconnect Button
      const disconnectBtn = document.getElementById('btn-trakt-disconnect');
      if (disconnectBtn) {
        disconnectBtn.onclick = () => {
          if (confirm('Trakt.tv bağlantısını kesmek istediğinize emin misiniz?')) {
            traktService.disconnectTrakt();
            showToast('Trakt.tv bağlantısı kesildi', 'info');
            render('main');
          }
        };
      }
    }
  };

  render('main');
}

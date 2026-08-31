/* ==========================================================================
   SineFlix Pro - Data Manager Modal (JSON Backup & Restore System)
   Allows users to export watch history & settings to JSON, or import from another device.
   ========================================================================== */

import { exportDataAsJSON, importDataFromJSON, getStorageStats, clearAllData } from '../services/storage.js';
import { showToast } from './Toast.js';

export function openDataManagerModal() {
  const modalContainer = document.getElementById('data-modal');
  if (!modalContainer) return;

  const stats = getStorageStats();

  modalContainer.innerHTML = `
    <div class="data-modal-content">
      <div class="data-modal-header">
        <h2 class="data-modal-title">
          <i data-lucide="hard-drive" style="color: var(--secondary); flex-shrink: 0; width: 20px; height: 20px;"></i>
          <span>Yerel Önbellek & Yedek</span>
        </h2>
        <button id="data-close-btn" class="btn-modal-close" title="Kapat (ESC)" aria-label="Kapat">
          <i data-lucide="x" style="width: 18px; height: 18px;"></i>
        </button>
      </div>

      <div class="data-modal-body">
        <!-- Export Section -->
        <div class="backup-card">
          <h3 class="backup-card-title" style="color: var(--accent-cyan);">
            <i data-lucide="download"></i> JSON İndir (Yedekle)
          </h3>
          <p style="font-size: 0.88rem; color: var(--text-sub); line-height: 1.6; margin: 0;">
            Tüm izleme geçmişinizi, kaldığınız saniyeleri ve favorilerinizi <strong>.json</strong> olarak cihazınıza indirin.
          </p>

          <div class="backup-stats-box">
            <div style="font-weight: 600; color: #cbd5e1;">Mevcut Durum:</div>
            <div>• İzlenen İçerik Sayısı: <strong>${stats.historyCount}</strong> adet</div>
            <div>• Favorilerim Sayısı: <strong>${stats.favoritesCount}</strong> adet</div>
            <div>• Kullanılan Hafıza: ~${stats.kb} KB</div>
          </div>

          <button id="btn-export-json" class="btn-primary" style="margin-top: auto; justify-content: center;">
            <i data-lucide="file-json"></i>
            <span>JSON Yedeği İndir</span>
          </button>
        </div>

        <!-- Import Section -->
        <div class="backup-card">
          <h3 class="backup-card-title" style="color: var(--accent-green);">
            <i data-lucide="upload"></i> JSON Yükle (Aktar)
          </h3>
          <p style="font-size: 0.88rem; color: var(--text-sub); line-height: 1.6; margin: 0;">
            Başka bir cihazdan indirilen <strong>.json</strong> yedek dosyasını buraya sürükleyip anında senkronize edin.
          </p>

          <div class="dropzone" id="json-dropzone">
            <i data-lucide="folder-open" style="width: 36px; height: 36px; color: var(--secondary); margin-bottom: 0.4rem;"></i>
            <div style="font-size: 0.88rem; font-weight: 600;">JSON Dosyası Seçin veya Sürükleyin</div>
            <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 0.2rem;">.json uzantılı yedek dosyası</div>
            <input type="file" id="json-file-input" accept=".json" style="display: none;" />
          </div>

          <div style="display: flex; gap: 1rem; align-items: center; font-size: 0.82rem; flex-wrap: wrap;">
            <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
              <input type="radio" name="import-mode" value="merge" checked />
              <span>Birleştir</span>
            </label>
            <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
              <input type="radio" name="import-mode" value="replace" />
              <span>Üzerine yaz</span>
            </label>
          </div>
        </div>
      </div>

      <div class="data-modal-footer">
        <button id="btn-clear-all-data" style="color: var(--primary); font-size: 0.86rem; font-weight: 600; display: flex; align-items: center; gap: 0.45rem; background: none; border: none; cursor: pointer; padding: 0.4rem 0;">
          <i data-lucide="trash-2" style="width:15px; height:15px"></i>
          <span>Tüm İzleme Geçmişini Sıfırla</span>
        </button>

        <button id="data-close-footer-btn" class="btn-secondary" style="padding: 0.55rem 1.4rem;">
          Kapat
        </button>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  if (window.lucide) window.lucide.createIcons();

  const closeBtn = document.getElementById('data-close-btn');
  const closeFooterBtn = document.getElementById('data-close-footer-btn');

  let activeEscListener = null;
  const closeModal = () => {
    modalContainer.classList.add('hidden');
    modalContainer.innerHTML = '';
    document.body.style.overflow = '';
    if (activeEscListener) {
      window.removeEventListener('keydown', activeEscListener);
      activeEscListener = null;
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeModal);

  modalContainer.onclick = (e) => {
    if (e.target === modalContainer) closeModal();
  };

  activeEscListener = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  window.addEventListener('keydown', activeEscListener);

  const exportBtn = document.getElementById('btn-export-json');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportDataAsJSON();
      showToast('JSON yedek dosyası indirildi!', 'success');
    });
  }

  const dropzone = document.getElementById('json-dropzone');
  const fileInput = document.getElementById('json-file-input');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'var(--accent-green)';
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.style.borderColor = 'rgba(99, 102, 241, 0.4)';
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.style.borderColor = 'rgba(99, 102, 241, 0.4)';
      if (e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    });
  }

  function handleFileSelect(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const modeRadio = document.querySelector('input[name="import-mode"]:checked');
        const mode = modeRadio ? modeRadio.value : 'merge';
        
        const result = importDataFromJSON(event.target.result, mode);
        if (result.success) {
          showToast(`✓ Yedek yüklendi! (${result.countHistory} izleme kaydı, ${result.countFavs} favori aktarıldı)`, 'success');
          closeModal();
        } else {
          showToast(`Yükleme hatası: ${result.message || result.error}`, 'error');
        }
      } catch (err) {
        showToast(`Yedek dosyası işlenirken hata oluştu: ${err.message}`, 'error');
      }
    };
    reader.onerror = () => {
      showToast('Dosya okunamadı.', 'error');
    };
    reader.readAsText(file);
  }

  const clearBtn = document.getElementById('btn-clear-all-data');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Tüm izleme geçmişinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
        clearAllData();
        showToast('Tüm yerel veriler temizlendi.', 'info');
        closeModal();
      }
    });
  }
}

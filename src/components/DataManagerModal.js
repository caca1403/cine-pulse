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
    <div class="modal-content" style="max-width: 750px;">
      <div class="data-modal-header" style="background: rgba(20, 26, 40, 0.95); padding: 1.4rem 2rem; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
        <h2 style="font-size: 1.4rem; display: flex; align-items: center; gap: 0.75rem;">
          <i data-lucide="hard-drive" style="color: var(--secondary)"></i>
          <span>Yerel Önbellek & Cihazlar Arası Aktarım</span>
        </h2>
        <button id="data-close-btn" class="btn-icon">
          <i data-lucide="x"></i>
        </button>
      </div>

      <div class="data-modal-body" style="padding: 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.8rem; overflow-y: auto;">
        <!-- Export Section -->
        <div class="backup-card" style="background: var(--bg-card); border-radius: var(--radius-md); padding: 1.8rem; border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 1.2rem;">
          <h3 style="font-size: 1.15rem; display: flex; align-items: center; gap: 0.6rem; color: var(--accent-cyan);">
            <i data-lucide="download"></i> JSON İndir (Yedekle)
          </h3>
          <p style="font-size: 0.88rem; color: var(--text-sub); line-height: 1.6;">
            Tüm izleme geçmişinizi, kaldığınız saniyeleri ve favorilerinizi <strong>.json</strong> olarak cihazınıza indirin.
          </p>

          <div style="font-size: 0.82rem; background: rgba(255,255,255,0.04); padding: 1rem; border-radius: var(--radius-sm); color: var(--text-muted); display: flex; flex-direction: column; gap: 0.3rem;">
            <div><strong>Mevcut Durum:</strong></div>
            <div>• İzlenen İçerik Sayısı: ${stats.historyCount} adet</div>
            <div>• Favorilerim Sayısı: ${stats.favoritesCount} adet</div>
            <div>• Kullanılan Hafıza: ~${stats.kb} KB</div>
          </div>

          <button id="btn-export-json" class="btn-primary" style="margin-top: auto; justify-content: center;">
            <i data-lucide="file-json"></i>
            <span>JSON Yedeği İndir</span>
          </button>
        </div>

        <!-- Import Section -->
        <div class="backup-card" style="background: var(--bg-card); border-radius: var(--radius-md); padding: 1.8rem; border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 1.2rem;">
          <h3 style="font-size: 1.15rem; display: flex; align-items: center; gap: 0.6rem; color: var(--accent-green);">
            <i data-lucide="upload"></i> JSON Yükle (Aktar)
          </h3>
          <p style="font-size: 0.88rem; color: var(--text-sub); line-height: 1.6;">
            Başka bir cihazdan indirilen <strong>.json</strong> yedek dosyasını buraya sürükleyip anında senkronize edin.
          </p>

          <div class="dropzone" id="json-dropzone">
            <i data-lucide="folder-open" style="width: 40px; height: 40px; color: var(--secondary); margin-bottom: 0.5rem;"></i>
            <div style="font-size: 0.9rem; font-weight: 600;">JSON Dosyası Seçin veya Sürükleyin</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.3rem;">.json uzantılı yedek dosyası</div>
            <input type="file" id="json-file-input" accept=".json" style="display: none;" />
          </div>

          <div style="display: flex; gap: 0.8rem; align-items: center; font-size: 0.82rem;">
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

      <div style="padding: 1.2rem 2rem; border-top: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
        <button id="btn-clear-all-data" style="color: var(--primary); font-size: 0.88rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
          <i data-lucide="trash-2" style="width:16px; height:16px"></i>
          <span>Tüm İzleme Geçmişini Sıfırla</span>
        </button>

        <button id="data-close-footer-btn" class="btn-secondary" style="padding: 0.6rem 1.4rem;">
          Kapat
        </button>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();

  const closeBtn = document.getElementById('data-close-btn');
  const closeFooterBtn = document.getElementById('data-close-footer-btn');

  const closeModal = () => {
    modalContainer.classList.add('hidden');
    modalContainer.innerHTML = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeModal);

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
    if (!file.name.endsWith('.json')) {
      showToast('Lütfen geçerli bir .json yedek dosyası seçiniz.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const modeRadio = document.querySelector('input[name="import-mode"]:checked');
      const mode = modeRadio ? modeRadio.value : 'merge';
      
      const result = importDataFromJSON(event.target.result, mode);
      if (result.success) {
        showToast(`Yedek yüklendi! (${result.countHistory} içerik aktarıldı)`, 'success');
        closeModal();
        window.dispatchEvent(new CustomEvent('sineflix_data_changed', { detail: { action: 'import' } }));
      } else {
        showToast(`Yükleme hatası: ${result.error}`, 'error');
      }
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

/* ==========================================================================
   CinePulse Studio - VEGA ayar penceresi (Faz-1)
   Başlık yıldız kodu: "VEGA". Sağlayıcı ibaresi yalnız API anahtarı
   form etiketinde kullanılır; diğer tüm metinlerde VEGA geçer.
   Anahtar yalnız localStorage'da durur, ağa yalnızca api.real-debrid.com'a
   Authorization başlığıyla gider.
   ========================================================================== */

import { renderIcons } from '../services/icons.js';
import { showToast } from './Toast.js';
import {
  getDebridKey,
  setDebridKey,
  clearDebridKey,
  maskDebridKey,
  validateDebridKey,
  getAccountStatus,
} from '../services/debridService.js';

let activeRoot = null;
let activeEsc = null;
let showKey = false;

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (ch) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[ch]));

export function openDebridModal() {
  closeDebridModal();
  showKey = false;

  const root = document.createElement('div');
  root.id = 'debrid-modal';
  root.className = 'modal-backdrop';
  document.body.appendChild(root);
  activeRoot = root;

  const render = (state = {}) => {
    const stored = getDebridKey();
    const hasKey = stored.length > 0;
    const { testing = false, status = null, error = '' } = state;
    const visibleValue = showKey ? esc(stored) : '';
    const masked = hasKey ? esc(maskDebridKey(stored)) : '';

    root.innerHTML = `
      <div class="data-modal-content" style="max-width: 520px;">
        <div class="data-modal-header" style="border-bottom: 1px solid rgba(223,255,118,0.2);">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:rgba(223,255,118,0.12);border:1px solid rgba(223,255,118,0.3);">
              <i data-lucide="zap" style="width:18px;height:18px;color:#dfff76;"></i>
            </div>
            <h2 class="data-modal-title" style="color:#fff;">VEGA</h2>
          </div>
          <button id="debrid-close-btn" class="btn-modal-close" title="Kapat (ESC)">
            <i data-lucide="x" style="width:18px;height:18px;"></i>
          </button>
        </div>

        <div class="data-modal-body" style="padding:1.5rem;display:flex;flex-direction:column;gap:1.1rem;">
          <p style="font-size:0.82rem;color:#94a3b8;margin:0;line-height:1.55;">
            VEGA, kendi ücretli hesabınızın anahtarıyla anında hazır dosyaları çözer.
            Anahtar yalnızca bu cihazda saklanır, başka yere gönderilmez.
          </p>

          <div>
            <label for="debrid-key-input" style="display:block;font-size:0.82rem;font-weight:600;color:#e2e8f0;margin-bottom:6px;">
              Real-Debrid API Anahtarı
            </label>
            <div style="display:flex;gap:8px;">
              <input
                id="debrid-key-input"
                type="${showKey ? 'text' : 'password'}"
                placeholder="${hasKey ? `Kayıtlı: ${masked}` : 'API anahtarını yapıştırın'}"
                value="${visibleValue}"
                autocomplete="off"
                spellcheck="false"
                style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);border-radius:10px;color:#fff;padding:0.65rem 0.8rem;font-size:0.85rem;outline:none;"
              />
              <button id="debrid-toggle-show" class="btn-secondary" title="${showKey ? 'Gizle' : 'Göster'}" style="padding:0.6rem 0.8rem;">
                <i data-lucide="${showKey ? 'eye-off' : 'eye'}" style="width:16px;height:16px;"></i>
              </button>
            </div>
            ${hasKey && !showKey ? `<div style="font-size:0.75rem;color:#64748b;margin-top:6px;">Kayıtlı anahtar: <strong style="color:#94a3b8;">${masked}</strong> (görmek için göz simgesine dokunun)</div>` : ''}
          </div>

          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button id="debrid-save-btn" class="btn-primary" style="flex:1;justify-content:center;padding:0.7rem 1rem;font-size:0.87rem;">
              <i data-lucide="save" style="width:15px;height:15px;"></i><span>Kaydet</span>
            </button>
            <button id="debrid-test-btn" class="btn-secondary" ${testing || !hasKey && !showKey ? '' : ''} style="flex:1;justify-content:center;padding:0.7rem 1rem;font-size:0.87rem;" ${testing ? 'disabled' : ''}>
              <i data-lucide="activity" style="width:15px;height:15px;"></i><span>${testing ? 'Denetleniyor…' : 'Hesabı Test Et'}</span>
            </button>
            ${hasKey ? `
            <button id="debrid-clear-btn" class="btn-secondary" style="padding:0.7rem 0.9rem;color:#f87171;border-color:rgba(239,68,68,0.4);">
              <i data-lucide="trash-2" style="width:15px;height:15px;"></i>
            </button>` : ''}
          </div>

          ${error ? `
          <div style="font-size:0.82rem;color:#fca5a5;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:0.65rem 0.85rem;">
            ${esc(error)}
          </div>` : ''}

          ${status ? `
          <div class="backup-card" style="border:1px solid rgba(223,255,118,0.25);background:rgba(223,255,118,0.05);padding:0.9rem 1rem;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <span style="width:9px;height:9px;border-radius:50%;background:${status.isPremium ? '#4ade80' : '#fbbf24'};display:inline-block;"></span>
              <strong style="font-size:0.88rem;color:#fff;">${esc(status.username)} • ${esc(status.accountType)}</strong>
              <span style="font-size:0.7rem;font-weight:700;color:${status.isPremium ? '#4ade80' : '#fbbf24'};border:1px solid currentColor;border-radius:99px;padding:1px 8px;">${status.isPremium ? 'AKTİF' : 'SINIRLI'}</span>
            </div>
            <div style="display:flex;gap:14px;flex-wrap:wrap;font-size:0.78rem;color:#94a3b8;">
              <span>Bitiş: <strong style="color:#e2e8f0;">${esc(status.expirationText)}</strong></span>
              <span>Puan: <strong style="color:#e2e8f0;">${esc(status.points)}</strong></span>
              <span>Kısıtlı host: <strong style="color:#e2e8f0;">${esc(Object.keys(status.traffic || {}).length)}</strong></span>
            </div>
          </div>` : `
          <div style="font-size:0.76rem;color:#64748b;line-height:1.5;">
            Hesap durumu kartı burada görünür: geçerlilik, bitiş tarihi ve kısıtlı host limitleri.
          </div>`}

          <div style="display:flex;justify-content:flex-end;padding-top:4px;">
            <button id="debrid-ok-btn" class="btn-secondary" style="padding:0.55rem 1.3rem;">Tamam</button>
          </div>
        </div>
      </div>
    `;

    renderIcons(root);
    bind(state);
  };

  const bind = (state = {}) => {
    const closeBtn = root.querySelector('#debrid-close-btn');
    const okBtn = root.querySelector('#debrid-ok-btn');
    if (closeBtn) closeBtn.onclick = closeDebridModal;
    if (okBtn) okBtn.onclick = closeDebridModal;
    root.onclick = (e) => { if (e.target === root) closeDebridModal(); };

    const input = root.querySelector('#debrid-key-input');
    const toggle = root.querySelector('#debrid-toggle-show');
    if (toggle) {
      toggle.onclick = () => {
        showKey = !showKey;
        render(state);
        const next = root.querySelector('#debrid-key-input');
        if (next && showKey) { next.focus(); next.select(); }
      };
    }

    const saveBtn = root.querySelector('#debrid-save-btn');
    if (saveBtn) {
      saveBtn.onclick = () => {
        const v = (input?.value || '').trim() || getDebridKey();
        if (!v) {
          showToast('Önce anahtarınızı girin.', 'error');
          return;
        }
        try {
          setDebridKey(v);
          showToast('VEGA anahtarı kaydedildi.', 'success');
          showKey = false;
          render({});
        } catch (err) {
          showToast(err?.message || 'Anahtar kaydedilemedi.', 'error');
        }
      };
    }

    const clearBtn = root.querySelector('#debrid-clear-btn');
    if (clearBtn) {
      clearBtn.onclick = () => {
        if (!confirm('VEGA anahtarını bu cihazdan silmek istiyor musunuz?')) return;
        clearDebridKey();
        showToast('VEGA anahtarı silindi.', 'info');
        showKey = false;
        render({});
      };
    }

    const testBtn = root.querySelector('#debrid-test-btn');
    if (testBtn) {
      testBtn.onclick = async () => {
        const key = (input?.value || '').trim() || getDebridKey();
        if (!key) {
          showToast('Önce anahtarınızı girin veya kaydedin.', 'error');
          return;
        }
        render({ testing: true });
        try {
          const check = await validateDebridKey(key);
          if (!check?.valid) throw new Error('Anahtar doğrulanamadı.');
          const status = await getAccountStatus(key);
          if ((input?.value || '').trim()) {
            try { setDebridKey(key); } catch (_) { /* test yine de kartı gösterir */ }
          }
          showKey = false;
          showToast('VEGA hesabı doğrulandı.', 'success');
          render({ status });
        } catch (err) {
          render({ error: err?.message || 'Hesap denetlenemedi.' });
        }
      };
    }
  };

  if (activeEsc) window.removeEventListener('keydown', activeEsc);
  activeEsc = (e) => { if (e.key === 'Escape') closeDebridModal(); };
  window.addEventListener('keydown', activeEsc);
  document.body.style.overflow = 'hidden';

  render({});
}

export function closeDebridModal() {
  if (activeEsc) {
    try { window.removeEventListener('keydown', activeEsc); } catch (_) {}
    activeEsc = null;
  }
  if (activeRoot) {
    try { activeRoot.remove(); } catch (_) {}
    activeRoot = null;
  }
  try {
    if (!document.querySelector('.modal-backdrop') && !document.getElementById('profile-modal-root')) {
      document.body.style.overflow = '';
    }
  } catch (_) {}
}

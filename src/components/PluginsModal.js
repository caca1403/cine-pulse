import { renderIcons } from '../services/icons.js';
import { listPlugins, setPluginEnabled } from '../services/pluginCatalog.js';
import { showToast } from './Toast.js';

let activeModal = null;
let modalEvents = null;

const escapeText = (v) => String(v ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

const PLUGIN_CSS = `
.plugins-modal-overlay{position:fixed;inset:0;z-index:1200;display:flex;align-items:center;justify-content:center;background:rgba(2,6,16,.72);backdrop-filter:blur(10px);padding:1rem;}
.plugins-modal-card{width:min(640px,100%);max-height:min(82vh,760px);display:flex;flex-direction:column;overflow:hidden;border-radius:20px;background:linear-gradient(160deg,#141a2b,#0b0f1c);border:1px solid rgba(255,255,255,.1);color:#eef2ff;}
.plugins-modal-head{display:flex;justify-content:space-between;gap:1rem;padding:1.2rem 1.3rem .8rem;}
.plugins-modal-head h2{margin:.2rem 0 .3rem;font-size:1.25rem;}
.plugins-modal-head h2 small{font-size:.8rem;color:#94a3b8;font-weight:600;}
.plugins-modal-head p{margin:0;font-size:.82rem;color:#94a3b8;}
.plugins-modal-search{display:flex;align-items:center;gap:.5rem;margin:0 1.3rem .7rem;padding:.55rem .8rem;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);}
.plugins-modal-search input{flex:1;background:transparent;border:0;outline:0;color:#fff;font-size:.9rem;}
.plugins-modal-list{overflow-y:auto;padding:0 1.3rem 1.3rem;display:flex;flex-direction:column;gap:.55rem;}
.plugin-row{display:flex;align-items:center;gap:.8rem;padding:.7rem .8rem;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);}
.plugin-row.is-off{opacity:.62;}
.plugin-row-id{min-width:96px;display:flex;flex-direction:column;}
.plugin-alias{font-weight:800;font-size:.95rem;color:#dfff76;}
.plugin-row-info{flex:1;min-width:0;}
.plugin-kinds{display:flex;gap:.3rem;flex-wrap:wrap;margin-bottom:.2rem;}
.plugin-kinds span{font-size:.68rem;font-weight:700;padding:.1rem .5rem;border-radius:9999px;background:rgba(223,255,118,.12);color:#dfff76;border:1px solid rgba(223,255,118,.25);}
.plugin-row-info p{margin:0;font-size:.78rem;color:#b6c2d8;}
.plugin-warn{display:flex;gap:.35rem;align-items:flex-start;margin-top:.3rem !important;font-size:.72rem !important;color:#fbbf24 !important;}
.plugin-warn svg{flex:none;margin-top:1px;}
.plugin-toggle{position:relative;width:46px;height:26px;flex:none;border-radius:9999px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.1);cursor:pointer;transition:background .18s;}
.plugin-toggle-knob{position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#94a3b8;transition:left .18s,background .18s;}
.plugin-toggle[aria-checked="true"]{background:rgba(223,255,118,.35);border-color:rgba(223,255,118,.6);}
.plugin-toggle[aria-checked="true"] .plugin-toggle-knob{left:22px;background:#dfff76;}
.plugins-empty{padding:2rem;text-align:center;color:#94a3b8;}
`;

function ensureCss() {
  try {
    if (document.getElementById('plugins-modal-css')) return;
    const st = document.createElement('style');
    st.id = 'plugins-modal-css';
    st.textContent = PLUGIN_CSS;
    document.head.appendChild(st);
  } catch (_) {}
}

export function openPluginsModal() {
  closePluginsModal();
  ensureCss();
  modalEvents = new AbortController();
  const { signal } = modalEvents;

  const root = document.createElement('div');
  root.id = 'plugins-modal-root';
  root.className = 'modal-overlay plugins-modal-overlay';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  document.body.appendChild(root);
  activeModal = root;

  const render = (filter = '') => {
    const plugins = listPlugins();
    const q = filter.trim().toLocaleLowerCase('tr-TR');
    const shown = plugins.filter((p) => !q
      || (p.alias || '').toLocaleLowerCase('tr-TR').includes(q)
      || (p.id || '').toLocaleLowerCase('tr-TR').includes(q));
    const onCount = plugins.filter((p) => p.enabled).length;
    root.innerHTML = `
      <div class="modal-card plugins-modal-card" role="document">
        <div class="plugins-modal-head">
          <div>
            <span class="cp-eyebrow">KAYNAK YONETIMI</span>
            <h2>Eklentiler <small>(${onCount}/${plugins.length} açık)</small></h2>
            <p>Kapalı eklenti taranmaz, listede görünmez. Değişiklik yeni aramalarda geçerlidir.</p>
          </div>
          <button type="button" class="modal-close" id="btn-close-plugins" aria-label="Kapat">
            <i data-lucide="x" style="width:20px;height:20px;"></i>
          </button>
        </div>
        <div class="plugins-modal-search">
          <i data-lucide="search" style="width:15px;height:15px;"></i>
          <input id="plugins-search" type="search" placeholder="Eklenti ara… (örn. Orion)" value="${escapeText(filter)}" aria-label="Eklenti ara" />
        </div>
        <div class="plugins-modal-list">
          ${shown.map((p) => `
            <div class="plugin-row ${p.enabled ? 'is-on' : 'is-off'}" data-plugin="${escapeText(p.id)}">
              <div class="plugin-row-id">
                <span class="plugin-alias">${escapeText(p.alias || p.id)}</span>
              </div>
              <div class="plugin-row-info">
                <div class="plugin-kinds">${(p.kinds || []).map((k) => `<span>${escapeText(k)}</span>`).join('')}</div>
                <p>${escapeText(p.desc || '')}</p>
                ${p.warn ? `<p class="plugin-warn"><i data-lucide="triangle-alert" style="width:12px;height:12px;"></i><span>${escapeText(p.warn)}</span></p>` : ''}
              </div>
              <button type="button" class="plugin-toggle" role="switch" aria-checked="${p.enabled}" aria-label="${escapeText(p.alias || p.id)} ${p.enabled ? 'kapat' : 'aç'}" data-toggle="${escapeText(p.id)}">
                <span class="plugin-toggle-knob"></span>
              </button>
            </div>
          `).join('') || '<div class="plugins-empty">Eşleşen eklenti yok.</div>'}
        </div>
      </div>
    `;
    renderIcons(root);
    root.querySelector('#btn-close-plugins')?.addEventListener('click', closePluginsModal, { signal });
    const search = root.querySelector('#plugins-search');
    let timer = null;
    search?.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => render(search.value), 180);
    }, { signal });
    root.querySelectorAll('[data-toggle]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.toggle;
        const row = root.querySelector(`[data-plugin="${CSS.escape(id)}"]`);
        const nowOn = btn.getAttribute('aria-checked') !== 'true';
        btn.disabled = true;
        const ok = await setPluginEnabled(id, nowOn).catch(() => false);
        btn.disabled = false;
        if (!ok) {
          showToast('Eklenti durumu kaydedilemedi.', 'error');
          return;
        }
        btn.setAttribute('aria-checked', String(nowOn));
        row?.classList.toggle('is-on', nowOn);
        row?.classList.toggle('is-off', !nowOn);
        btn.setAttribute('aria-label', `${id} ${nowOn ? 'kapat' : 'aç'}`);
        const head = root.querySelector('.plugins-modal-head small');
        if (head) {
          const all = listPlugins();
          head.textContent = `(${all.filter((p) => p.enabled).length}/${all.length} açık)`;
        }
        showToast(nowOn ? 'Eklenti açıldı.' : 'Eklenti kapatıldı.', nowOn ? 'success' : 'info');
      }, { signal });
    });
  };

  root.addEventListener('click', (e) => {
    if (e.target === root) closePluginsModal();
  }, { signal });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePluginsModal();
  }, { signal });

  render('');
}

export function closePluginsModal() {
  try { modalEvents?.abort(); } catch (_) {}
  modalEvents = null;
  if (activeModal) {
    try { activeModal.remove(); } catch (_) {}
    activeModal = null;
  }
}

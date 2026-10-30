/* ==========================================================================
   CinePulse Studio — Oynatma & Ağ ayarları (#8)
   --------------------------------------------------------------------------
   Sihirbaz yalnız masaüstünde ve yalnız ilk açılışta; bu pencereler o
   tercihleri HER platformda ve HER ZAMAN düzenlenebilir kılar:
     · Ağ modu (Oto / Yavaş bağlantı / Normal) — agHizi.js geçersiz kılmaları
     · hls.js tampon boyutu (cp_buffer_size_mb, 8–512 MB)
     · Kaldığın yerden devam (cp_resume_playback)
     · Varsayılan altyazı dili (cp_default_sub_lang)
   ========================================================================== */

import { agModu, agModunuUygula } from '../services/kabuk/agHizi.js';
import { normalizeBufferMb } from '../services/altyapi/storage.js';
import { isNativeAndroidApp } from '../services/platform/platformBridge.js';
import { biometrikHazir, kilitAcik, kilitAyarla, biometrikDogrula } from '../services/kabuk/uygulamaKilidi.js';
import '../styles/p2p.css'; /* p2p-backdrop/p2p-card yeniden kullanılır */

let activeModal = null;

export function closeOynatmaAyarModal() {
  if (activeModal) {
    activeModal.remove();
    activeModal = null;
  }
}

const oku = (anahtar, varsayilan) => {
  try { return localStorage.getItem(anahtar) ?? varsayilan; } catch { return varsayilan; }
};

export function openOynatmaAyarModal() {
  closeOynatmaAyarModal();
  const root = document.createElement('div');
  root.id = 'oynatma-ayar-modal-root';
  root.className = 'p2p-backdrop';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Oynatma ve Ağ Ayarları');

  const ag = agModu();
  const tampon = normalizeBufferMb(oku('cp_buffer_size_mb', null));
  const devam = oku('cp_resume_playback', null) !== 'false';
  const dil = oku('cp_default_sub_lang', 'tr');
  // #7: simge teması (yalnız Android — launcher takma adları orada var).
  const tema = oku('cp_tema_simge', 'klasik');
  const temaDugme = (ad, renk, etiket) => `<button type="button" data-tema="${ad}" title="${etiket}"
    style="width:38px;height:38px;border-radius:12px;cursor:pointer;background:${renk};border:2px solid ${tema === ad ? '#dfff76' : 'rgba(148,163,184,0.35)'};"></button>`;

  root.innerHTML = `
    <div class="p2p-card" style="max-width:420px;">
      <button class="p2p-close" type="button" aria-label="Kapat">✕</button>
      <h3 class="p2p-title">⚙️ Oynatma & Ağ</h3>

      <label style="display:block;margin:10px 0 4px;font-size:.8rem;color:#e2e8f0;font-weight:700;">Ağ Modu</label>
      <select id="oa-ag-modu" class="p2p-input" style="rows:1;">
        <option value="oto" ${ag === 'oto' ? 'selected' : ''}>Otomatik (ölçülür)</option>
        <option value="yavas" ${ag === 'yavas' ? 'selected' : ''}>Yavaş bağlantı (agresif tampon, uzun zaman aşımları)</option>
        <option value="normal" ${ag === 'normal' ? 'selected' : ''}>Normal (yavaş modu kapat)</option>
      </select>

      <label style="display:block;margin:10px 0 4px;font-size:.8rem;color:#e2e8f0;font-weight:700;">Tampon Boyutu (MB)</label>
      <input id="oa-tampon" type="number" min="8" max="512" step="8" value="${tampon}" class="p2p-input" />

      <label style="display:flex;align-items:center;gap:8px;margin:12px 0;font-size:.8rem;color:#e2e8f0;">
        <input type="checkbox" id="oa-devam" ${devam ? 'checked' : ''} />
        <span>Kaldığın yerden devam et</span>
      </label>

      <label style="display:block;margin:6px 0 4px;font-size:.8rem;color:#e2e8f0;font-weight:700;">Varsayılan Altyazı Dili</label>
      <select id="oa-dil" class="p2p-input" style="rows:1;">
        <option value="tr" ${dil === 'tr' ? 'selected' : ''}>Türkçe</option>
        <option value="en" ${dil === 'en' ? 'selected' : ''}>İngilizce</option>
        <option value="de" ${dil === 'de' ? 'selected' : ''}>Almanca</option>
        <option value="es" ${dil === 'es' ? 'selected' : ''}>İspanyolca</option>
        <option value="fr" ${dil === 'fr' ? 'selected' : ''}>Fransızca</option>
        <option value="ar" ${dil === 'ar' ? 'selected' : ''}>Arapça</option>
      </select>

      ${isNativeAndroidApp() ? `
        <label style="display:block;margin:12px 0 4px;font-size:.8rem;color:#e2e8f0;font-weight:700;">Uygulama Simge Teması</label>
        <div id="oa-temalar" style="display:flex;gap:8px;align-items:center;">
          ${temaDugme('klasik', 'linear-gradient(135deg,#f59e0b,#b45309)', 'Klasik')}
          ${temaDugme('kizil', 'linear-gradient(135deg,#ef4444,#7f1d1d)', 'Kızıl')}
          ${temaDugme('okyanus', 'linear-gradient(135deg,#3b82f6,#1e3a8a)', 'Okyanus')}
          ${temaDugme('orman', 'linear-gradient(135deg,#22c55e,#14532d)', 'Orman')}
          ${temaDugme('mor', 'linear-gradient(135deg,#a855f7,#581c87)', 'Mor')}
        </div>
      ` : ''}

      ${isNativeAndroidApp() && (biometrikHazir() || kilitAcik()) ? `
        <label style="display:flex;align-items:center;gap:8px;margin:12px 0;font-size:.8rem;color:#e2e8f0;">
          <input type="checkbox" id="oa-kilit" ${kilitAcik() ? 'checked' : ''} />
          <span>🔒 Uygulama kilidi (açılışta parmak izi / ekran kilidi)</span>
        </label>
      ` : ''}

      <div id="oa-durum" class="p2p-status" role="status" aria-live="polite" style="margin-top:10px;font-size:.74rem;color:#94a3b8;">
        Değişiklikler anında kaydedilir; tampon bir sonraki oynatmada etkili olur.
      </div>
    </div>
  `;
  document.body.appendChild(root);
  activeModal = root;

  root.querySelector('.p2p-close').addEventListener('click', closeOynatmaAyarModal);
  root.addEventListener('click', (e) => { if (e.target === root) closeOynatmaAyarModal(); });

  const durum = (metin) => { const el = root.querySelector('#oa-durum'); if (el) el.textContent = metin; };

  root.querySelector('#oa-ag-modu').addEventListener('change', (e) => {
    try { localStorage.setItem('cp_ag_modu', e.target.value); } catch {}
    agModunuUygula();
    durum(e.target.value === 'yavas'
      ? '🐢 Yavaş ağ modu açıldı: tarama tavanları ve zaman aşımları büyür.'
      : e.target.value === 'normal'
        ? '⚡ Yavaş ağ modu kapatıldı.'
        : '🤖 Otomatik ölçüm aktif.');
  });
  root.querySelector('#oa-tampon').addEventListener('change', (e) => {
    const mb = normalizeBufferMb(e.target.value);
    e.target.value = mb;
    try { localStorage.setItem('cp_buffer_size_mb', String(mb)); } catch {}
    durum(`Tampon: ${mb} MB (bir sonraki oynatmada).`);
  });
  root.querySelector('#oa-devam').addEventListener('change', (e) => {
    try { localStorage.setItem('cp_resume_playback', e.target.checked ? 'true' : 'false'); } catch {}
  });
  root.querySelector('#oa-dil').addEventListener('change', (e) => {
    try { localStorage.setItem('cp_default_sub_lang', e.target.value); } catch {}
  });

  // #12: kilit satırı yalnız cihaz hazırsa basıldı (ölü ayar yok).
  const kilitSatir = root.querySelector('#oa-kilit');
  if (kilitSatir) {
    kilitSatir.addEventListener('change', async (e) => {
      if (e.target.checked) {
        durum('Kilidi açmak için cihaz kilidini doğrula…');
        const ok = await biometrikDogrula();
        if (ok) {
          kilitAyarla(true);
          durum('🔒 Uygulama kilidi açık — çıkışta ve 30 sn arka plandan sonra sorulur.');
        } else {
          e.target.checked = false;
          durum('Doğrulama tamamlanmadı — kilit açılmadı.');
        }
      } else {
        kilitAyarla(false);
        durum('Uygulama kilidi kapatıldı.');
      }
    });
  }

  // #7: simge teması seçimi — köprü uygular, localStorage arayüz durumu tutar.
  root.querySelectorAll('[data-tema]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ad = btn.getAttribute('data-tema');
      const sonuc = window.CinePulseNative?.setThemeIcon?.(ad);
      if (sonuc === 'OK') {
        try { localStorage.setItem('cp_tema_simge', ad); } catch {}
        root.querySelectorAll('[data-tema]').forEach(b => {
          b.style.borderColor = b === btn ? '#dfff76' : 'rgba(148,163,184,0.35)';
        });
        durum('🎨 Simge teması güncellendi — başlatıcıda birkaç saniyeye yansır.');
      } else {
        durum('Simge teması uygulanamadı.');
      }
    });
  });
}

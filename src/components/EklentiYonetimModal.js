/* ==========================================================================
   CinePulse Studio — Eklenti yönetimi penceresi
   Oynatma & Ağ ayarlarından AYRIDIR (kullanıcı 2026-10-25: "aynı yere koyma,
   anlaşılmıyor"). Kayıtlı eklentiler listelenir; Torrentio tek dokunuşla
   eklenir/kaldırılır; adresten yeni eklenti eklenir.
   ========================================================================== */

import { eklentileriGetir, eklentiEkle, eklentiKaldir, eklentiTabani } from '../services/dogrudan/eklentiServisi.js';
import { ekKaynakDusur } from '../services/kaynak/kaynakOnbellek.js';
import '../styles/p2p.css'; /* p2p-backdrop/p2p-card yeniden kullanılır */

let activeModal = null;

export function closeEklentiYonetimModal() {
  if (activeModal) {
    activeModal.remove();
    activeModal = null;
  }
}

export function openEklentiYonetimModal() {
  closeEklentiYonetimModal();
  const root = document.createElement('div');
  root.id = 'eklenti-yonetim-modal-root';
  root.className = 'p2p-backdrop';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Eklenti Yönetimi');

  const satir = (e) => `
        <div style="display:flex;align-items:center;gap:6px;font-size:.78rem;color:#cbd5e1;padding:.3rem 0;">
          <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${(e.ad || e.url).replace(/</g, '&lt;')}${e.aile && e.aile !== 'stremio' ? ' <span style="color:#64748b;font-size:.68rem;">· ' + e.aile + (e.aile === 'nuvio-depo' && Array.isArray(e.scrapers) ? ' · ' + e.scrapers.length + ' scraper' : '') + (e.aile === 'cloudstream-repo' ? ' · ' + (Number(e.eklentiSayisi) || 1) + ' eklenti · ' + (Number(e.saglayiciSayisi) || 0) + ' sağlayıcı' : '') + '</span>' : ''}</span>
          <button type="button" data-ek-sil="${e.url}" style="cursor:pointer;background:transparent;border:1px solid rgba(244,63,94,0.4);color:#f43f5e;border-radius:6px;padding:.15rem .5rem;font-size:.7rem;">Kaldır</button>
        </div>`;
  const listeHTML = (l) => (l.length ? l.map(satir).join('') : '<div style="font-size:.75rem;color:#64748b;">Kayıtlı eklenti yok.</div>');

  root.innerHTML = `
    <div class="p2p-card">
      <button class="p2p-close" type="button" aria-label="Kapat">✕</button>
      <h2 class="p2p-title" style="font-size:1.05rem;">🔌 Eklenti Yönetimi</h2>
      <p class="p2p-sub" style="font-size:.78rem;">Stremio/Nuvio eklenti (manifest) veya XURL bağlantısını yapıştır; uygulama adresi tanırlar. Nuvio eklenti deposu bağlantısı (scrapers listesi içeren manifest.json) da eklenir; sağlayıcı JS'leri uygulama içi motor koşar. Bulunan yayınlar, oynatıcıdaki kaynak listesinin altındaki "Eklentiler" bölümünde eklentinin adıyla listelenir. CloudStream depo (repo.json/plugins.json) ve .cs3/.apk bağlantıları Android sürümünde eklenebilir; eklentiler uygulamanın yerli CloudStream katmanında koşar.</p>
      <div id="ey-liste" style="display:flex;flex-direction:column;gap:2px;margin-bottom:10px;">
        ${listeHTML(eklentileriGetir())}
      </div>
      <div style="display:flex;gap:6px;">
        <input id="ey-url" class="p2p-input" placeholder="Eklenti / manifest / XURL bağlantısını yapıştırın" style="flex:1;min-width:0;font-size:.78rem;" />
        <button type="button" id="ey-ekle" class="btn-secondary" style="padding:.45rem .8rem;border-radius:8px;font-size:.78rem;white-space:nowrap;">Ekle</button>
      </div>
      <div id="ey-durum" style="margin-top:10px;min-height:1.1rem;font-size:.74rem;color:#94a3b8;"></div>
    </div>
  `;
  document.body.appendChild(root);
  activeModal = root;

  const durum = (metin) => { const el = root.querySelector('#ey-durum'); if (el) el.textContent = metin; };
  root.querySelector('.p2p-close').addEventListener('click', closeEklentiYonetimModal);
  root.addEventListener('click', (e) => { if (e.target === root) closeEklentiYonetimModal(); });

  // Sabit Torrentio tanıtım satığı kaldırıldı (kullanıcı 2026-10-29: "gözükmesin").
  // Torrentio artık yalnızca kullanıcı bağlantıyı yapıştırınca eklenir;
  // TR-öncelikli adres: https://torrentio.strem.fun/language=turkish/manifest.json
  const baglaSil = () => {
    root.querySelectorAll('[data-ek-sil]').forEach(b => {
      b.onclick = () => {
        const silinen = b.getAttribute('data-ek-sil');
        eklentiKaldir(silinen);
        // Önbellek temizliği ANINDA: o eklentinin satırları tarama önbelleğinden
        // ve açık kaynak listelerinden düşer (kullanıcı 2026-10-29).
        try { ekKaynakDusur(eklentiTabani(silinen)); } catch (_) {}
        yenileListe(); durum('Eklenti kaldırıldı.');
      };
    });
  };

  const yenileListe = () => {
    root.querySelector('#ey-liste').innerHTML = listeHTML(eklentileriGetir());
    baglaSil();
  };

  const ekle = async (url) => {
    durum('Eklenti deneniyor…');
    const son = await eklentiEkle(url);
    if (son.ok) {
      durum(`✓ ${son.ad} eklendi.`);
      const input = root.querySelector('#ey-url'); if (input) input.value = '';
      yenileListe();
    } else durum('✕ ' + son.hata);
  };

  root.querySelector('#ey-ekle').addEventListener('click', () => {
    const v = root.querySelector('#ey-url').value.trim();
    if (v) ekle(v);
  });
  root.querySelector('#ey-url').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); const v = e.target.value.trim(); if (v) ekle(v); }
  });

  baglaSil();
}

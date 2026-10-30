/* ==========================================================================
   CinePulse Studio — Paylaşım penceresi (yol haritası #15)
   --------------------------------------------------------------------------
   Detay sayfasındaki içerik için web biçimli adres üretir (karşı tarafta
   uygulama şart değil), panoya kopyalar ve QR kodu gösterir (telefonla
   okutup detaya düşmek için). QR yerel üretilir — adres üçüncü tarafa gitmez.
   ========================================================================== */

import qrcode from 'qrcode-generator';
import { showToast } from './Toast.js';
import '../styles/p2p.css';

let activeModal = null;

export function closePaylasModal() {
  if (activeModal) {
    activeModal.remove();
    activeModal = null;
  }
}

function qrSvg(adres) {
  const qr = qrcode(0, 'M');
  qr.addData(adres);
  qr.make();
  return qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
}

export async function openPaylasModal({ type, id, title = '' } = {}) {
  closePaylasModal();
  const { paylasimAdresi } = await import('../services/kabuk/derinBaglanti.js');
  const adres = paylasimAdresi(type, id);
  if (!adres) {
    showToast('Paylaşım web adresi yapılandırılmamış (VITE_SITE_ADRESI).', 'info');
    return;
  }

  const root = document.createElement('div');
  root.id = 'paylas-modal-root';
  root.className = 'p2p-backdrop';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'İçeriği paylaş');
  root.innerHTML = `
    <div class="p2p-card" style="max-width:360px;text-align:center;">
      <button class="p2p-close" type="button" aria-label="Kapat">✕</button>
      <h3 class="p2p-title">🔗 ${title ? `“${title.replace(/</g, '&lt;').slice(0, 60)}”` : 'Paylaş'}</h3>
      <div id="paylas-qr" style="background:#fff;border-radius:12px;padding:10px;margin:8px auto;width:200px;height:200px;display:flex;align-items:center;justify-content:center;"></div>
      <input class="p2p-input" id="paylas-adres" readonly value="${adres.replace(/"/g, '&quot;')}" style="font-size:0.72rem;text-align:center;" aria-label="Paylaşım adresi" />
      <div style="display:flex;gap:8px;justify-content:center;margin-top:10px;flex-wrap:wrap;">
        <button type="button" class="btn-primary" id="paylas-kopyala" style="padding:0.5rem 1rem;border-radius:10px;font-weight:700;">Bağlantıyı Kopyala</button>
      </div>
      <p style="font-size:0.7rem;color:#94a3b8;margin-top:8px;">QR’ı telefonla okutan kişi web adresinden detay sayfasına düşer.</p>
    </div>
  `;
  document.body.appendChild(root);
  activeModal = root;
  root.querySelector('#paylas-qr').innerHTML = qrSvg(adres);

  root.querySelector('.p2p-close').addEventListener('click', closePaylasModal);
  root.addEventListener('click', (e) => { if (e.target === root) closePaylasModal(); });

  root.querySelector('#paylas-kopyala').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(adres);
      showToast('🔗 Paylaşım bağlantısı kopyalandı.', 'success');
    } catch {
      const input = root.querySelector('#paylas-adres');
      input.select();
      showToast('Bağlantıyı seçtik — kopyalamak için uzun basın.', 'info');
    }
  });

  // Sistem paylaşma menüsü varsa öner (WhatsApp vb. doğrudan çıkar).
  if (navigator.share) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-secondary';
    btn.style.cssText = 'padding:0.5rem 1rem;border-radius:10px;';
    btn.textContent = 'Cihazla Paylaş…';
    btn.onclick = () => { navigator.share({ title: 'CinePulse', text: title, url: adres }).catch(() => {}); };
    root.querySelector('#paylas-kopyala').parentElement.appendChild(btn);
  }
}

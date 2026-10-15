import { showToast } from './Toast.js';
import { openPlayerModal } from './PlayerModal.js';
import {
  buildPlayUrl,
  extractInfoHash,
  getP2pConsent,
  isP2pAvailable,
  pollTorrentStatus,
  setP2pConsent,
} from '../services/p2pService.js';
import '../styles/p2p.css';
/* ==========================================================================
   CinePulse Studio — P2P oynatıcı penceresi (F1, yalnız masaüstü)
   Motor sunucuda (:4000 WebTorrent); bu pencere üretici tarafıdır:
   magnet al → onay al → eş durumunu yokla → hazır olunca PlayerModal'a
   doğrudan satır olarak ver. Katalog içermez; kullanıcı kendi adresini getirir.
   ========================================================================== */

let activeModal = null;
let activeAbort = null;

export function closeP2pModal() {
  if (activeAbort) {
    try { activeAbort.abort(); } catch (_) {}
    activeAbort = null;
  }
  if (activeModal) {
    activeModal.remove();
    activeModal = null;
  }
}

export function openP2pModal() {
  closeP2pModal();
  if (!isP2pAvailable()) {
    showToast('P2P oynatma yalnızca masaüstü uygulamasında çalışır.', 'error');
    return;
  }

  const previousFocus = document.activeElement;
  const root = document.createElement('div');
  root.id = 'p2p-modal-root';
  root.className = 'p2p-backdrop';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'P2P ile Oynat');
  root.innerHTML = `
    <div class="p2p-card">
      <button class="p2p-close" type="button" aria-label="Kapat">✕</button>
      <h3 class="p2p-title">🛰 P2P ile Oynat</h3>
      <p class="p2p-sub">Bir magnet adresi yapıştır; yerel motor eşleri bulduğunda film tarayıcı oynatıcıda, reklam ve yönlendirme olmadan açılır.</p>

      <label class="p2p-consent" id="p2p-consent-row">
        <input type="checkbox" id="p2p-consent-check" ${getP2pConsent() ? 'checked' : ''} />
        <span>P2P ağlarından veri çekmek ülkende kısıtlı olabilir; yalnızca erişim hakkın olan içerikleri oynatırım. Sorumluluk bana ait.</span>
      </label>

      <textarea id="p2p-magnet-input" class="p2p-input" rows="3" spellcheck="false"
        placeholder="magnet:?xt=urn:btih:…"></textarea>
      <button id="p2p-start-btn" class="p2p-primary" type="button" disabled>Bağlan</button>

      <div id="p2p-status" class="p2p-status" role="status" aria-live="polite" hidden></div>
    </div>
  `;
  document.body.appendChild(root);
  activeModal = root;
  root.querySelector('#p2p-magnet-input').focus();

  const consentRow = root.querySelector('#p2p-consent-row');
  const consentCheck = root.querySelector('#p2p-consent-check');
  const input = root.querySelector('#p2p-magnet-input');
  const startBtn = root.querySelector('#p2p-start-btn');
  const statusBox = root.querySelector('#p2p-status');

  const syncStartEnabled = () => {
    startBtn.disabled = !consentCheck.checked || !input.value.trim();
  };
  const syncConsentVisibility = () => {
    consentRow.hidden = getP2pConsent() && consentCheck.checked;
  };
  syncConsentVisibility();
  syncStartEnabled();

  consentCheck.addEventListener('change', () => {
    if (consentCheck.checked) setP2pConsent(true);
    syncConsentVisibility();
    syncStartEnabled();
  });
  input.addEventListener('input', syncStartEnabled);

  const setStatus = (html, extraClass = '') => {
    statusBox.hidden = false;
    statusBox.className = `p2p-status ${extraClass}`;
    statusBox.innerHTML = html;
  };

  const chips = (status) => `
    <div class="p2p-chips">
      <span class="p2p-chip">Eş: <strong>${status.peers || 0}</strong></span>
      ${status.speed ? `<span class="p2p-chip">İniş: <strong>${status.speed}</strong></span>` : ''}
      ${status.progress ? `<span class="p2p-chip">İlerleme: <strong>${status.progress}</strong></span>` : ''}
    </div>`;

  const renderReady = (status) => {
    if (!status.playable) {
      setStatus(`
        ${chips(status)}
        <p class="p2p-file">${status.videoFile || status.name || 'Dosya'} (${status.sizeMb ? status.sizeMb + ' MB' : 'boyut bilinmiyor'})</p>
        <p class="p2p-warn">Bu dosya tarayıcı oynatıcının açamadığı bir kaptan (${(status.videoFile || '').split('.').pop()?.toUpperCase() || 'bilinmeyen'})). Aynı filmin <strong>mp4</strong> veya <strong>webm</strong> dağıtımını dene — MPV motoru geldiğinde bu kısıt kalkacak.</p>
      `, 'warn');
      return;
    }
    setStatus(`
      ${chips(status)}
      <p class="p2p-file">${status.videoFile || status.name || 'Video'} (${status.sizeMb ? status.sizeMb + ' MB' : 'boyut bilinmiyor'})</p>
      <button id="p2p-play-btn" class="p2p-primary" type="button">▶ Oynat</button>
    `, 'ready');
    statusBox.querySelector('#p2p-play-btn')?.addEventListener('click', () => {
      const hash = currentHash;
      closeP2pModal();
      openPlayerModal({
        type: 'movie',
        title: status.name || status.videoFile || 'P2P Akışı',
        directPlaybackUrl: buildPlayUrl(hash),
        directMediaKind: 'file',
        directMediaLabel: 'Yerel P2P Akışı',
      });
    });
  };

  let currentHash = '';

  startBtn.addEventListener('click', async () => {
    const parsed = extractInfoHash(input.value);
    if (!parsed.ok) {
      showToast(parsed.reason, 'error');
      return;
    }
    currentHash = parsed.hash;
    startBtn.disabled = true;
    input.disabled = true;
    setStatus(`<div class="p2p-chips"><span class="p2p-chip pulse">Eş aranıyor…</span></div><p class="p2p-note">Tohum bulunursa kendiliğinden hazır olacak. Bu adım dakikalar alabilir; pencereyi kapatırsan arama durur.</p>`, 'searching');

    activeAbort = new AbortController();
    const final = await pollTorrentStatus(currentHash, {
      signal: activeAbort.signal,
      onUpdate: (status) => {
        setStatus(`${chips(status)}<p class="p2p-note">${status.message || 'Bağlanılıyor…'}</p>`, status.state);
      },
    });
    if (final.state === 'cancelled') return;
    activeAbort = null;
    if (final.state === 'ready') {
      renderReady(final);
      startBtn.disabled = false;
      input.disabled = false;
      syncStartEnabled();
      return;
    }
    if (final.state === 'timeout') {
      setStatus(`<p class="p2p-warn">Eş bulunamadı — bu dosyada tohum (seed) kalmamış olabilir. Başka bir magnet adresiyle dene.</p>`, 'warn');
    } else if (final.state === 'error') {
      setStatus(`<p class="p2p-warn">${final.message || 'Motor hatası.'} Masaüstü uygulamasını yeniden başlatmayı dene.</p>`, 'warn');
    }
    startBtn.disabled = false;
    input.disabled = false;
    syncStartEnabled();
  });

  const closeAndRestore = () => {
    closeP2pModal();
    try { previousFocus?.focus(); } catch (_) {}
  };
  root.querySelector('.p2p-close').addEventListener('click', closeAndRestore);
  root.addEventListener('mousedown', (event) => {
    if (event.target === root) closeAndRestore();
  });
  const onKey = (event) => {
    if (event.key === 'Escape') {
      document.removeEventListener('keydown', onKey);
      closeAndRestore();
    }
  };
  document.addEventListener('keydown', onKey);
}

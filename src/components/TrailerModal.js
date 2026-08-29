/* ==========================================================================
   CinePulse Studio - Cinematic Trailer Modal Component
   Ultra-responsive YouTube trailer player with glassmorphic backdrop,
   auto-play, keyboard ESC escape handler, and mobile-optimized controls.
   ========================================================================== */

let activeEscListener = null;

export function openTrailerModal({ title = 'Fragman', trailerInfo }) {
  const modalContainer = document.getElementById('trailer-modal');
  if (!modalContainer) return;

  if (!trailerInfo || !trailerInfo.embedUrl) {
    alert('Bu yapım için resmi fragman bulunamadı.');
    return;
  }

  const trailerName = trailerInfo.name || 'Resmi Tanıtım';

  modalContainer.innerHTML = `
    <div class="trailer-modal-overlay">
      <div class="trailer-modal-dialog">
        
        <!-- Header Bar -->
        <div class="trailer-header">
          <div class="trailer-header-left">
            <span class="trailer-badge">
              <i data-lucide="youtube" style="width: 14px; height: 14px; fill: #ef4444; color: #ef4444;"></i>
              <span>FRAGMAN</span>
            </span>
            <h3 class="trailer-title" title="${title} • ${trailerName}">
              ${title} <span class="trailer-subname">• ${trailerName}</span>
            </h3>
          </div>

          <div class="trailer-header-actions">
            ${trailerInfo.watchUrl ? `
              <a href="${trailerInfo.watchUrl}" target="_blank" rel="noopener noreferrer" class="btn-trailer-yt" title="YouTube'da Aç">
                <i data-lucide="external-link" style="width: 13px; height: 13px;"></i>
                <span class="btn-yt-text">YouTube</span>
              </a>
            ` : ''}
            <button id="btn-close-trailer" class="btn-trailer-close" title="Kapat (ESC)">
              <i data-lucide="x" style="width: 18px; height: 18px;"></i>
            </button>
          </div>
        </div>

        <!-- Video Player Frame (Strict 16:9 Responsive Aspect Ratio) -->
        <div class="trailer-video-wrapper">
          <iframe 
            src="${trailerInfo.embedUrl}" 
            title="${title} Fragman" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen 
            class="trailer-iframe"
          ></iframe>
        </div>

      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  if (window.lucide) window.lucide.createIcons();

  const closeModal = () => {
    modalContainer.innerHTML = '';
    modalContainer.classList.add('hidden');
    document.body.style.overflow = '';
    if (activeEscListener) {
      window.removeEventListener('keydown', activeEscListener);
      activeEscListener = null;
    }
  };

  const closeBtn = modalContainer.querySelector('#btn-close-trailer');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  const overlay = modalContainer.querySelector('.trailer-modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  activeEscListener = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  window.addEventListener('keydown', activeEscListener);
}

/* ==========================================================================
   CinePulse Studio - Cinematic Trailer Modal Component
   Ultra-responsive YouTube trailer player with glassmorphic backdrop,
   auto-play, keyboard ESC escape handler, and clean controls.
   ========================================================================== */

let activeEscListener = null;

export function openTrailerModal({ title = 'Fragman', trailerInfo }) {
  const modalContainer = document.getElementById('trailer-modal');
  if (!modalContainer) return;

  if (!trailerInfo || !trailerInfo.embedUrl) {
    alert('Bu yapım için resmi fragman bulunamadı.');
    return;
  }

  modalContainer.innerHTML = `
    <div class="trailer-modal-overlay" style="position: fixed; inset: 0; z-index: 9999; background: rgba(5, 7, 13, 0.88); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); display: flex; align-items: center; justify-content: center; padding: 1.5rem; animation: fadeIn 0.25s ease-out;">
      <div class="trailer-modal-dialog" style="width: 100%; max-width: 960px; background: #0b0f19; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: var(--radius-lg, 16px); overflow: hidden; box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(245, 158, 11, 0.15); animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);">
        
        <!-- Header Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 1rem 1.5rem; background: rgba(15, 23, 42, 0.85); border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
          <div style="display: flex; align-items: center; gap: 0.75rem; min-width: 0;">
            <span class="badge" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: 700; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 6px; display: inline-flex; align-items: center; gap: 0.3rem;">
              <i data-lucide="youtube" style="width: 14px; height: 14px;"></i>
              <span>YOUTUBE FRAGMAN</span>
            </span>
            <h3 style="font-size: 1.05rem; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0;">
              ${title} • ${trailerInfo.name || 'Resmi Tanıtım'}
            </h3>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;">
            ${trailerInfo.watchUrl ? `
              <a href="${trailerInfo.watchUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="padding: 0.35rem 0.8rem; font-size: 0.8rem; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;" title="YouTube'da Aç">
                <i data-lucide="external-link" style="width: 13px; height: 13px;"></i>
                <span>YouTube</span>
              </a>
            ` : ''}
            <button id="btn-close-trailer" style="width: 34px; height: 34px; border-radius: 50%; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="x" style="width: 18px; height: 18px;"></i>
            </button>
          </div>
        </div>

        <!-- Video Player Frame (16:9 Aspect Ratio) -->
        <div style="position: relative; width: 100%; padding-top: 56.25%; background: #000;">
          <iframe 
            src="${trailerInfo.embedUrl}" 
            title="${title} Fragman" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
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

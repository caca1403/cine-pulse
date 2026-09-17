/* ==========================================================================
   CinePulse Studio - Scroll & State Manager
   Centralized, robust scroll recording & instant restoration
   No circular dependencies.
   ========================================================================== */

export const scrollMemory = new Map();
export const railScrollMemory = new Map();

let pendingScrollSave = null;
let lastRecordedHash = null;

function rememberScroll() {
  const currentHash = window.location.hash || '#home';
  if (currentHash.startsWith('#detail')) return;
  lastRecordedHash = currentHash;
  if (window.scrollY > 0) scrollMemory.set(currentHash, window.scrollY);
}

export function trackScrollState() {
  rememberScroll();
  if (pendingScrollSave !== null) return;
  pendingScrollSave = window.setTimeout(() => {
    pendingScrollSave = null;
    flushScrollState();
  }, 300);
}

export function flushScrollState() {
  if (pendingScrollSave !== null) {
    clearTimeout(pendingScrollSave);
    pendingScrollSave = null;
  }
  if ((window.location.hash || '#home') === lastRecordedHash) rememberScroll();
  for (const [hash, position] of scrollMemory) {
    if (position > 0) {
      try { sessionStorage.setItem(`cinepulse_scroll_${hash}`, String(position)); } catch (_) {}
    }
  }
  for (const [id, left] of railScrollMemory) {
    try { sessionStorage.setItem(`cinepulse_rail_${id}`, String(left)); } catch (_) {}
  }
}

export const saveAllScrollState = flushScrollState;

export function restoreAllScrollState(hash = window.location.hash || '#home') {
  if (hash.startsWith('#detail')) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }

  // 1. Restore all horizontal rails scrollLeft
  document.querySelectorAll('.card-rail').forEach(rail => {
    if (rail.id) {
      let savedLeft = railScrollMemory.get(rail.id);
      if (typeof savedLeft !== 'number') {
        try {
          const stored = sessionStorage.getItem(`cinepulse_rail_${rail.id}`);
          if (stored) savedLeft = parseFloat(stored);
        } catch (_) {}
      }
      if (typeof savedLeft === 'number' && savedLeft > 0) {
        rail.scrollLeft = savedLeft;
        requestAnimationFrame(() => {
          rail.scrollLeft = savedLeft;
        });
      }
    }
  });

  // 2. Restore vertical page scroll position
  let savedY = scrollMemory.get(hash);
  if (typeof savedY !== 'number') {
    try {
      const stored = sessionStorage.getItem(`cinepulse_scroll_${hash}`);
      if (stored) savedY = parseFloat(stored);
    } catch (_) {}
  }

  if (typeof savedY === 'number' && savedY > 0) {
    const attemptScroll = (count = 0) => {
      window.scrollTo({ top: savedY, behavior: 'instant' });
      if (count < 15 && document.body.scrollHeight < savedY + window.innerHeight) {
        setTimeout(() => attemptScroll(count + 1), 60);
      }
    };
    requestAnimationFrame(() => attemptScroll(0));
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

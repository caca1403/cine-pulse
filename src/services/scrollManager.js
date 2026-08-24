/* ==========================================================================
   CinePulse Studio - Scroll & State Manager
   Centralized, robust scroll recording & instant restoration
   No circular dependencies.
   ========================================================================== */

export const scrollMemory = new Map();
export const railScrollMemory = new Map();

export function saveAllScrollState() {
  const currentHash = window.location.hash || '#home';
  if (!currentHash.startsWith('#detail')) {
    if (window.scrollY > 0) {
      scrollMemory.set(currentHash, window.scrollY);
      try {
        sessionStorage.setItem(`cinepulse_scroll_${currentHash}`, String(window.scrollY));
      } catch (_) {}
    }
    document.querySelectorAll('.card-rail').forEach(rail => {
      if (rail.id) {
        railScrollMemory.set(rail.id, rail.scrollLeft);
        try {
          sessionStorage.setItem(`cinepulse_rail_${rail.id}`, String(rail.scrollLeft));
        } catch (_) {}
      }
    });
  }
}

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

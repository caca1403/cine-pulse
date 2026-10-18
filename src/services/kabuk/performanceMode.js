/* ==========================================================================
   CinePulse Studio - Performans Modu (lowfx)
   Yazilimsal cizimde (wine / GPU'suz / SwiftShader / llvmpipe) backdrop-blur
   ve bulaniklik katmanlari her karede CPU'yu gomer. Bu mod agir efektleri
   kapatir; yerlesim ve islev aynen korunur.
   Secim: localStorage 'cp_lowfx_mode' = 'auto' (varsayilan) | 'on' | 'off'.
   ========================================================================== */

const KEY = 'cp_lowfx_mode';

export function detectSoftwareRendering() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl', { failIfMajorPerformanceCaveat: true })
      || c.getContext('experimental-webgl');
    // failIfMajorPerformanceCaveat ile context ACILAMAZSA -> yazilim.
    if (!gl) return true;
    let renderer = '';
    try {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      renderer = String(ext
        ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER) || '');
    } catch (_) {}
    return /swiftshader|llvmpipe|softpipe|software|basic render|angle \(google.*(basic|swiftshader)/i.test(renderer);
  } catch (_) {
    return false;
  }
}

export function resolvePerfMode() {
  let pref = 'auto';
  try {
    pref = localStorage.getItem(KEY) || 'auto';
  } catch (_) {}
  if (pref === 'on') return true;
  if (pref === 'off') return false;
  return detectSoftwareRendering();
}

export function applyPerfMode() {
  const on = resolvePerfMode();
  try {
    document.documentElement.classList.toggle('lowfx', on);
  } catch (_) {}
  return on;
}

export function setPerfMode(pref) {
  try {
    localStorage.setItem(KEY, pref === 'off' ? 'off' : pref === 'on' ? 'on' : 'auto');
  } catch (_) {}
  return applyPerfMode();
}

/* ==========================================================================
   Masaüstü gizli WebView (Electron) çözümleyicisi

   Android'de gizli WebView (NativePageResolver) Cloudflare'ın JS challenge'ını
   çözüyor. Masaüstünde aynı işi Electron'ın GİZLİ BrowserWindow'ı yapıyor:
   `ghostWin` — penceresi görünmez, medya indirmez, gerçek kullanıcı IP'siyle
   sayfayı açar ve çözülmüş HTML'i + cookie'leri döner.

   Bu modül yalnızca köprüyü sarar; asıl işi main.cjs yapar
   (ipcMain → 'cinepulse:ghost-resolve').

   Web (tarayıcı) ortamında çalışmaz; sessizce null döner.
   ========================================================================== */

let bekleyen = new Map();
let sira = 0;
let kuruldu = false;

/* TEK MOTOR disiplini: Electron'da tek gizli BrowserWindow var. İşleri sıraya
   sokar, aynı adresi isteyenleri tek çağrıya birleştirir ve "meşgul mi?"
   sorusuna yanıt verir (androidWebViewResolver ile aynı sözleşme). */
let motorKuyrugu = Promise.resolve();
let motorMesgul = 0;
const ucarida = new Map();

function tekMotor(is) {
  const gorev = motorKuyrugu.then(() => {
    motorMesgul += 1;
    return Promise.resolve().then(is).finally(() => { motorMesgul = Math.max(0, motorMesgul - 1); });
  });
  motorKuyrugu = gorev.then(() => {}, () => {});
  return gorev;
}

/** Masaüstünde gizli pencere şu an bir sayfa mı çözüyor? (pahalı turları
 *  atlamak isteyen sağlayıcılar için — orion.js `tarayiciMotoruBos`). */
export function resolverMesgulMu() {
  return motorMesgul > 0;
}

function kopru() {
  try {
    return (typeof window !== 'undefined' && window.CinePulseDesktop) || null;
  } catch (_) {
    return null;
  }
}

/** Bu ortamda gizli WebView var mı? */
export function hasNativeWebViewResolver() {
  const k = kopru();
  try {
    return Boolean(k && typeof k.ghostResolve === 'function' && k.isDesktop);
  } catch (_) {
    return false;
  }
}

/**
 * Sayfayı gizli pencerede açar ve çözülmüş HTML'i döner.
 * @returns {Promise<{html:string,text:string,cookies:Array,finalUrl:string}|null>}
 */
export async function resolvePageInNativeWebView(url, { timeoutMs = 22000, _siradaMi = false } = {}) {
  const k = kopru();
  if (!k || typeof k.ghostResolve !== 'function') return null;

  // Electron'da TEK gizli pencere var (main.cjs → ghostWin): aynı anda ikinci
  // bir loadURL birincinin sayfasını ezer ve iki taraf da çöp HTML görür.
  // Android'deki gibi sıraya sok + aynı adresi paylaş — masaüstü de TEK motor.
  if (!_siradaMi) {
    const anahtar = String(url || '');
    const devamEden = ucarida.get(anahtar);
    if (devamEden) return devamEden;
    const is = tekMotor(() => resolvePageInNativeWebView(url, { timeoutMs, _siradaMi: true }));
    ucarida.set(anahtar, is);
    is.finally(() => ucarida.delete(anahtar)).catch(() => {});
    return is;
  }

  if (!kuruldu) {
    kuruldu = true;
    try {
      window.__cinepulseWebViewResolve = (id, json) => {
        const kayit = bekleyen.get(id);
        if (!kayit) return;
        bekleyen.delete(id);
        clearTimeout(kayit.zaman);
        let veri = null;
        try { veri = typeof json === 'string' ? JSON.parse(json) : json; } catch (_) { veri = null; }
        kayit.coz(veri || { ok: false, challenge: true });
      };
    } catch (_) { /* renderer dışı */ }
  }

  const id = `d${++sira}`;
  return new Promise((coz) => {
    let bitti = false;
    const zaman = setTimeout(() => {
      if (bitti) return;
      bitti = true;
      bekleyen.delete(id);
      coz(null);
    }, Math.max(12000, timeoutMs + 4000));
    bekleyen.set(id, { coz, zaman });

    try {
      // main.cjs `ghostResolve(url, { timeout, waitAfterLoad })` bekliyor;
      // yalnız timeoutMs göndermek masaüstünde hep 30 sn'lik varsayılana
      // düşüyordu (tek motor sırası bunu bekliyordu → tüm liste yavaşlıyordu).
      const tavan = Math.max(6000, Math.min(28000, Math.round(timeoutMs)));
      Promise.resolve(k.ghostResolve(url, { timeoutMs: tavan, timeout: tavan, waitAfterLoad: 1200 }))
        .then((r) => {
          if (bitti) return;
          bitti = true;
          bekleyen.delete(id);
          clearTimeout(zaman);
          coz(r && r.ok ? r : null);
        })
        .catch(() => {
          if (bitti) return;
          bitti = true;
          bekleyen.delete(id);
          clearTimeout(zaman);
          coz(null);
        });
    } catch (_) {
      bitti = true;
      bekleyen.delete(id);
      clearTimeout(zaman);
      coz(null);
    }
  });
}

/** Yanıt hâlâ Cloudflare engel sayfası mı? */
export function looksBlocked(sonuc) {
  if (!sonuc) return true;
  const govde = String(sonuc.text || sonuc.html || '');
  if (govde.length < 1200) return true;
  const ilk = govde.slice(0, 4000).toLowerCase();
  return ilk.includes('just a moment')
      || ilk.includes('attention required')
      || ilk.includes('cf-browser-verification')
      || ilk.includes('enable javascript and cookies')
      || ilk.includes('checking your browser');
}
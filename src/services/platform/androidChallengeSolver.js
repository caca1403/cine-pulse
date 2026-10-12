/* ==========================================================================
   CinePulse Studio - Android Challenge Solver (sadece native APK'da kullanilir)
   Cloudflare "Just a moment" yiyen siteler (HDFC, Pichive, FullHD) icin:
   - Gizli iframe gercek WebView icinde challenge'i cozer (cookie WebView
     deposuna duser; cross-origin HTML okunamaz, o yuzden icerik degil
     cookie hedeflenir).
   - @capacitor/core icindeki CapacitorCookies ile cf_clearance okunur,
     ayni UA + Cookie ile CapacitorHttp istekleri gecer.
   - Eklenti yoksa / hata olursa sessizce null doner, mevcut davranis korunur.
   ========================================================================== */

const SOLVER_CACHE = new Map(); // origin -> { cookies, savedAt, solving }
const COOKIE_TTL_MS = 45 * 60 * 1000;
const CF_MARKERS = ['just a moment', 'challenge-platform', 'cf-chl', 'verifying you are human'];

function isNative() {
  try {
    return Boolean(window.Capacitor?.isNativePlatform?.());
  } catch (_) {
    return false;
  }
}

function deviceUA() {
  try {
    return navigator.userAgent || '';
  } catch (_) {
    return '';
  }
}

async function readCookies(url) {
  try {
    const mod = await import('@capacitor/core');
    const api = mod?.CapacitorCookies;
    if (!api || typeof api.getCookies !== 'function') return '';
    const res = await api.getCookies({ url });
    const pairs = [];
    const push = (k, v) => { if (k && v !== undefined) pairs.push(`${k}=${v}`); };
    if (Array.isArray(res)) res.forEach((c) => push(c?.key || c?.name, c?.value));
    else if (res && typeof res === 'object') {
      const list = res.cookies || res.value || res;
      if (Array.isArray(list)) list.forEach((c) => push(c?.key || c?.name, c?.value));
      else Object.entries(list).forEach(([k, v]) => push(k, typeof v === 'string' ? v : v?.value));
    }
    return pairs.join('; ');
  } catch (_) {
    return '';
  }
}

function hasClearance(cookieHeader) {
  return /(?:^|;\s*)(cf_clearance|__cf_bm)=/.test(cookieHeader || '');
}

async function solveInWebView(url, timeoutMs = 25000) {
  const { resolvePageInNativeWebView, looksBlocked } = await import('./androidWebViewResolver.js');
  const result = await resolvePageInNativeWebView(url, { timeoutMs });
  return result && !looksBlocked(result) ? result : null;
}

/**
 * Origin icin gecerli challenge cookie'sini dondurur (yoksa cozmeyi dener).
 * Her zaman string doner; bos string = cozumsuz devam et.
 */
export async function ensureChallengeCookies(origin, { timeoutMs = 25000 } = {}) {
  try {
    if (!isNative() || typeof document === 'undefined' || !origin) return '';
    const key = String(origin).replace(/\/$/, '');
    const cached = SOLVER_CACHE.get(key);
    if (cached && cached.cookies && Date.now() - cached.savedAt < COOKIE_TTL_MS) {
      return cached.cookies;
    }
    if (cached?.solving) {
      const waitUntil = Date.now() + Math.min(timeoutMs, 15000);
      while (Date.now() < waitUntil) {
        await new Promise((r) => setTimeout(r, 800));
        const cur = SOLVER_CACHE.get(key);
        if (cur && !cur.solving && cur.cookies) return cur.cookies;
      }
      return '';
    }
    SOLVER_CACHE.set(key, { cookies: '', savedAt: 0, solving: true });
    try {
      let cookies = await readCookies(key + '/');
      if (!hasClearance(cookies)) {
        await solveInWebView(key + '/', timeoutMs);
        // Challenge cozumu + cookie yazimi icin kisa ek bekleme.
        for (let i = 0; i < 6; i++) {
          await new Promise((r) => setTimeout(r, 1000));
          cookies = await readCookies(key + '/');
          if (hasClearance(cookies)) break;
        }
      }
      SOLVER_CACHE.set(key, { cookies: cookies || '', savedAt: Date.now(), solving: false });
      return cookies || '';
    } catch (_) {
      SOLVER_CACHE.set(key, { cookies: '', savedAt: 0, solving: false });
      return '';
    }
  } catch (_) {
    return '';
  }
}

/** Challenge cozumu gecmis mi (en azindan clearance var mi)? */
export async function hasChallengeSession(origin) {
  const cookies = await ensureChallengeCookies(origin, { timeoutMs: 8000 });
  return hasClearance(cookies);
}

/**
 * Cloudstream-istemci okuma: cozumu oturumun cookie + cihaz UA'si ile
 * CapacitorHttp uzerinden okunabilir metin dondurur (iframe ici okunamaz,
 * native HTTP okunabilir). Masaustu disi / eklentisiz ortamda null.
 */
export async function fetchTextWithSession(url, { method = 'GET', body = null, headers = {}, referer = '', timeoutMs = 12000 } = {}) {
  try {
    if (!isNative()) return null;
    const mod = await import('@capacitor/core');
    const http = mod?.CapacitorHttp;
    if (!http) return null;
    let origin = '';
    try { origin = new URL(url).origin; } catch (_) { return null; }
    const cookies = await ensureChallengeCookies(origin, { timeoutMs: 20000 });
    const finalHeaders = {
      'User-Agent': deviceUA(),
      Accept: 'text/html,application/json,application/xhtml+xml,*/*;q=0.8',
      ...(referer ? { Referer: referer } : {}),
      ...(cookies ? { Cookie: cookies } : {}),
      ...headers,
    };
    const m = String(method || 'GET').toUpperCase();
    const opts = { url, headers: finalHeaders, responseType: 'text', connectTimeout: 6000, readTimeout: timeoutMs };
    let res = null;
    if (m === 'POST') {
      const data = body == null ? '' : (typeof body === 'string' ? body : JSON.stringify(body));
      if (!finalHeaders['Content-Type']) finalHeaders['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      res = await http.post({ ...opts, data, headers: finalHeaders });
    } else {
      res = await http.get(opts);
    }
    const text = typeof res?.data === 'string' ? res.data : '';
    if (!text || looksLikeChallenge(text)) return null;
    return { text, status: res?.status || 0, cookies };
  } catch (_) {
    return null;
  }
}

export function looksLikeChallenge(text) {
  try {
    const low = String(text || '').toLowerCase().slice(0, 6000);
    return CF_MARKERS.some((m) => low.includes(m));
  } catch (_) {
    return false;
  }
}

export function getDeviceUA() {
  return deviceUA();
}

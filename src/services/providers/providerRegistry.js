/* ==========================================================================
   CinePulse - Mini Provider Sistemi (Cloudstream mantığı, kendi tarzımızla)
   Yeni kaynak eklemek = src/services/providers/ altına 1 dosya + 1 satır.
   Ağır iş (Cloudflare, şifreli JS, m3u8) backend'de (/api/proxy, /api/hls_proxy,
   /api/hdfc_stream) çözülür. Frontend sadece arama -> iframe -> stream çözer.
   ========================================================================== */

const providers = [];

// Kayit aninda kalici durumu uygula: aggregator henuz yuklenmemis olsa bile
// EXE/web yeniden acilisinda eklenti ac/kapa korunur (Cloudstream eksigi).
let bootStateCache = null;
let bootStateRead = false;
function getBootState() {
  if (bootStateRead) return bootStateCache;
  bootStateRead = true;
  bootStateCache = readLocalProviderState();
  return bootStateCache;
}

export function registerProvider(def) {
  if (!def || !def.id || typeof def.fetchSources !== 'function') {
    console.warn('[providers] Geçersiz provider:', def?.id);
    return;
  }
  if (providers.some((p) => p.id === def.id)) return;
  const remembered = getBootState()?.[def.id];
  const enabled = typeof remembered === 'boolean'
    ? remembered
    : (def.enabled !== false);
  providers.push({ ...def, enabled, priority: def.priority ?? 20 });
  providers.sort((a, b) => (a.priority ?? 20) - (b.priority ?? 20));
}

export function getProviders() {
  return providers.filter((p) => p.enabled !== false);
}

// Cloudstream tarzi eklenti yonetimi, eksigi kapatilarak: durum kalicidir.
// EXE'de userData magazasina, web/APK'da localStorage'a yazilir.
const PROVIDER_STATE_KEY = 'cinepulse_providers_v1';

function readLocalProviderState() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(PROVIDER_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function writeLocalProviderState(state) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(PROVIDER_STATE_KEY, JSON.stringify(state));
  } catch (_) {}
}

export function getProviderState() {
  const state = {};
  for (const p of providers) state[p.id] = p.enabled !== false;
  return state;
}

export function applyProviderState(state) {
  if (!state || typeof state !== 'object') return;
  for (const p of providers) {
    if (typeof state[p.id] === 'boolean') p.enabled = state[p.id];
  }
}

export async function persistProviderState() {
  const state = getProviderState();
  writeLocalProviderState(state);
  try {
    const bridge = typeof window !== 'undefined' ? window.CinePulseDesktop : null;
    if (bridge && typeof bridge.storeSet === 'function') {
      await bridge.storeSet('providers', state);
    }
  } catch (_) {}
}

// EXE acilisinda userData'daki eklenti durumunu yukler (web'de localStorage).
export async function loadPersistedProviderState() {
  try {
    const bridge = typeof window !== 'undefined' ? window.CinePulseDesktop : null;
    if (bridge && typeof bridge.storeGet === 'function') {
      const remote = await bridge.storeGet('providers', null);
      if (remote && typeof remote === 'object') {
        applyProviderState(remote);
        writeLocalProviderState(remote);
        return remote;
      }
    }
  } catch (_) {}
  const local = readLocalProviderState();
  if (local) applyProviderState(local);
  return local;
}

export async function setProviderEnabled(id, on) {
  const p = providers.find((x) => x.id === id);
  if (!p) return false;
  p.enabled = on !== false;
  await persistProviderState();
  return true;
}

// ---- Ortak yardımcılar (tüm provider'lar kullansın) ----

export function toSlug(str) {
  if (!str) return '';
  return str.toLowerCase().trim()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/\s*-\s*S\d+E\d+.*$/i, '')
    .replace(/\s*-\s*Bölüm\s*\d+.*$/i, '')
    .replace(/\s*\(\d{4}\).*/, '')
    .trim();
}

// Dinamik import için apiUrl'i lazy yükle (circular import yok)
async function getApiUrl() {
  const m = await import('../apiOrigin.js');
  return m.apiUrl;
}

// HTML siteler için: önce direkt, olmazsa /api/proxy üzerinden çek.
// Cloudflare'lı siteler backend'siz çalışmaz — bu beklenen davranış.
export async function fetchHtml(url, referer = '') {
  try {
    const direct = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
        ...(referer ? { Referer: referer } : {})
      },
      signal: AbortSignal.timeout(6000)
    });
    if (direct.ok) {
      const t = await direct.text();
      if (t && t.length > 500) return t;
    }
  } catch (_) {}
  try {
    const apiUrl = await getApiUrl();
    const proxyUrl = apiUrl(`/api/proxy?url=${encodeURIComponent(url)}${referer ? `&ref=${encodeURIComponent(referer)}` : ''}`);
    const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(9000) });
    if (res.ok) return await res.text();
  } catch (_) {}
  // EXE son basamak: gizli WebView (ghost) + gizli iframe 403 merdiveni.
  // Cloudflare challenge'i gercek tarayici cozer, cookie session'a duser.
  try {
    const { stealthFetchHtml } = await import('../platform/desktopResolver.js');
    const stealth = await stealthFetchHtml(url, referer);
    if (stealth && stealth.length > 500) return stealth;
  } catch (_) {}
  return '';
}

export function extractIframes(html) {
  if (!html) return [];
  const out = [];
  const re = /<iframe[^>]+(?:data-src|src)=["']([^"']+)["']/gi;
  let m;
  while ((m = re.exec(html))) {
    let u = m[1];
    if (u.startsWith('//')) u = 'https:' + u;
    if (u.startsWith('http') && !out.includes(u)) out.push(u);
  }
  return out;
}

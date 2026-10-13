/* ==========================================================================
   CinePulse - Turk Canli TV kaynaklari (istemci tarafi)
   Kaynaklar sunucu tarafinda cozulur (/api/live_sources):
     kral   → GitHub raw .m3u_plus  (1860+ kanal, canli TS + HLS)
     turhan → Fixbet/Inatt kanallari (domain.php ile cozulen m3u8)
   Neden sunucudan? Dropbox CORS vermiyor, yayinlar Cloudflare korumali;
   cozumleme kullanici/Vercel IP'siyle yapilirsa engel kalkiyor.

   Varsayilan kaynak "ilk acilan" ilke: acilista hepsi denenir, yanit veren
   kaynaklar hiz sirasiyla one alinir ve secim kalici olarak saklanir.
   ========================================================================== */

import { apiUrl, isNativeCapacitor, isLocalDevHost } from './apiOrigin.js';
// _liveSources.js saf (Node-only API icermeyen) bir modul: ayni M3U ayristirici
// hem sunucuda hem tarayicida calisir. Boylece sunucu endpoint'i yoksa bile
// GitHub raw (CORS acik) uzerinden Kral listesi dogrudan alinabilir.
import { KRAL_M3U_ENDPOINT, parseKralChannels } from '../../api/_liveSources.js';

const LS_KEY = 'cp_live_sources_v1';
const ORDER_KEY = 'cp_live_source_order_v1';
const DEFAULT_KEY = 'cp_live_source_default_v1';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;   // 6 saat
const STALE_TTL_MS = 48 * 60 * 60 * 1000;  // ag hatasi payi: 48 saat

export const LIVE_SOURCES = [
  { id: 'kral', label: 'Pulsar 1', icon: 'tv' },
  { id: 'izlego', label: 'Pulsar 3', icon: 'globe' },
  { id: 'turhan', label: 'Pulsar 2', icon: 'radio-tower' }
];

// Görünür etiket tek yerden: sunucu tarafı (api/_liveSources.js) bu üç kaynağı
// "Pulsar 1/2/3"e çevirdi — istemci AYNI adı kullanır (gerçek kaynak adları yalnız
// kod yorumlarında kalır). id sabittir; etiket HER ZAMAN id'den üretilir, yoksa
// eski localStorage önbelleklerindeki adlar ekrana sızabilirdi.
const YAYIN_ETIKETI = { kral: 'Pulsar 1', turhan: 'Pulsar 2', izlego: 'Pulsar 3' };
function gorunurEtiket(id, eskiLabel) {
  return YAYIN_ETIKETI[id] || eskiLabel || id;
}

// Relative API yolunu platformun dogru origin'ine cevirir.
// Desktop -> yerel sidecar, APK -> Vercel, web -> ayni origin.
function sourcesEndpoint() {
  const path = '/api/live_sources';
  if (typeof window !== 'undefined' && isLocalDevHost()) return path;
  if (typeof window !== 'undefined' && !isNativeCapacitor()) {
    // Web (vercel/github.io): ayni origin yeterli.
    const host = window.location?.hostname || '';
    if (host) return path;
  }
  return apiUrl(path);
}

function readStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_) {
    return {};
  }
}

// localStorage kotası dolduğunda düşen kaynaklar burada tutulur; böylece
// oturum boyunca liste boş kalmaz (bir sonraki açılışta tekrar denenir).
let memoryCache = {};

/**
 * Onbelleğe yazmadan once listeyi budak (payload ~518 KB → ~300 KB).
 * Budanan alanlar oynatma/EPG akisinda hic kullanilmaz:
 *   logo  → yerel /tv-logos eslesmesi ya da SVG rozet kullanilir; 1800 uzak
 *           logo istegi yapmak hem yavas hem de localStorage'i dolduruyor.
 *   headers → yalnizca #EXTVLCOPT tasiyan ~50 kanalda dolu.
 */
function slimChannels(channels) {
  const out = new Array(channels.length);
  for (let i = 0; i < channels.length; i++) {
    const c = channels[i];
    const h = c.headers;
    const hasHeaders = h && (h.ua || h.ref || h.origin);
    out[i] = {
      name: c.name,
      streamUrl: c.streamUrl,
      tvgId: c.tvgId || '',
      category: c.category || 'national',
      quality: c.quality || 'HD',
      isTs: c.isTs === true
    };
    if (hasHeaders) out[i].headers = h;
  }
  return out;
}

function writeSource(id, entry) {
  try {
    const store = readStore();
    store[id] = { ...entry, channels: slimChannels(entry.channels) };
    localStorage.setItem(LS_KEY, JSON.stringify(store));
    return true;
  } catch (_) {
    // Kota doldu: veriyi bellekte tutmaya devam et (gecici bellek onbellegi).
    memoryCache[id] = { ...entry, savedAt: entry.savedAt || Date.now() };
    return false;
  }
}

function pruneStore() {
  try {
    const store = readStore();
    const now = Date.now();
    for (const id of Object.keys(store)) {
      const e = store[id];
      if (!e || !e.savedAt || now - e.savedAt > STALE_TTL_MS) delete store[id];
    }
    localStorage.setItem(LS_KEY, JSON.stringify(store));
  } catch (_) {}
}

/** Onbellekten anlik okuma (acilis ekraninda beklemeden boyamak icin). */
export function getCachedSource(id) {
  const entry = readStore()[id] || memoryCache[id];
  if (!entry || !Array.isArray(entry.channels) || !entry.channels.length) return null;
  const age = Date.now() - (entry.savedAt || 0);
  return {
    id,
    label: gorunurEtiket(id, entry.label),
    channels: entry.channels,
    count: entry.channels.length,
    savedAt: entry.savedAt,
    stale: age > CACHE_TTL_MS
  };
}

export function getAllCachedSources() {
  return LIVE_SOURCES.map((s) => getCachedSource(s.id)).filter(Boolean);
}

/**
 * Kaynaklari tazeler. Oncelik sirasi:
 *   1) sunucu endpoint'i (sidecar / Vercel) — hepsini tek istekte cozer
 *   2) endpoint yoksa/hataysa Kral M3U'su dogrudan GitHub raw'dan (CORS acik)
 *   3) hicbiri yoksa onbellekten duser (ag hatasi payi)
 * Donus: gercekten calisan kaynaklar.
 */
export async function refreshLiveSources({ force = false } = {}) {
  pruneStore();
  const store = readStore();
  const now = Date.now();
  const allFresh = LIVE_SOURCES.every((s) => {
    const e = store[s.id];
    return e && Array.isArray(e.channels) && e.channels.length && now - (e.savedAt || 0) < CACHE_TTL_MS;
  });
  if (!force && allFresh) return orderSources(getAllCachedSources());

  let payload = null;
  try {
    const res = await fetch(sourcesEndpoint(), {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(45000)
    });
    if (res.ok) payload = await res.json().catch(() => null);
  } catch (_) {
    payload = null;
  }

  const sources = Array.isArray(payload?.sources) ? payload.sources : [];
  const gotIds = new Set();
  for (const s of sources) {
    if (!s || !s.ok || !Array.isArray(s.channels) || !s.channels.length) continue;
    gotIds.add(s.id);
    writeSource(s.id, {
      label: gorunurEtiket(s.id, s.label),
      channels: s.channels,
      savedAt: Number(payload?.savedAt) || Date.now()
    });
  }

  // Yedek yol: sunucu kral listesini vermediyse dogrudan GitHub raw'dan cek.
  // (Turhan CORS kapali oldugu icin yalnizca sunucudan gelebilir.)
  if (!gotIds.has('kral')) {
    const direct = await fetchKralDirect().catch(() => null);
    if (direct && direct.length) {
      writeSource('kral', { label: 'Pulsar 1', channels: direct, savedAt: Date.now() });
    }
  }

  return orderSources(getAllCachedSources());
}

/** GitHub raw M3U'yu dogrudan cek (CORS acik, sunucuya gerek yok). */
async function fetchKralDirect() {
  const res = await fetch(KRAL_M3U_ENDPOINT, {
    signal: AbortSignal.timeout(30000)
  });
  if (!res.ok) throw new Error(`M3U HTTP ${res.status}`);
  const text = await res.text();
  const channels = parseKralChannels(text);
  if (!channels.length) throw new Error('M3U ayrıştırılamadı');
  return channels;
}

function orderSources(sources) {
  const registryOrder = new Map(LIVE_SOURCES.map((s, i) => [s.id, i]));
  return [...sources].sort((a, b) => {
    // Onbellek sirasi = son calisan sirasi (default secimi), yoksa kayit sirasi.
    const oa = getSourceOrder().indexOf(a.id);
    const ob = getSourceOrder().indexOf(b.id);
    const ia = oa === -1 ? 999 : oa;
    const ib = ob === -1 ? 999 : ob;
    if (ia !== ib) return ia - ib;
    const ra = registryOrder.has(a.id) ? registryOrder.get(a.id) : 99;
    const rb = registryOrder.has(b.id) ? registryOrder.get(b.id) : 99;
    return ra - rb;
  });
}

function getSourceOrder() {
  try {
    const raw = localStorage.getItem(ORDER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function setSourceOrder(ids) {
  try { localStorage.setItem(ORDER_KEY, JSON.stringify(ids)); } catch (_) {}
}

/** Calisan ilk kaynak varsayilan olur (kullanicinin istegi). */
export function getDefaultSourceId(sources) {
  const list = sources && sources.length ? sources : getAllCachedSources();
  let saved = '';
  try { saved = localStorage.getItem(DEFAULT_KEY) || ''; } catch (_) {}
  if (saved && list.some((s) => s.id === saved)) return saved;
  const first = list[0];
  return first ? first.id : LIVE_SOURCES[0].id;
}

export function setDefaultSourceId(id) {
  try { localStorage.setItem(DEFAULT_KEY, String(id || '')); } catch (_) {}
}

/**
 * Kaynaklari sirayla dener, ilk acilani default yapar. Donus:
 *   { order: [id,...], defaultId, sources: [...] }
 */
export async function probeLiveSources() {
  const sources = await refreshLiveSources();
  const order = sources.map((s) => s.id);
  setSourceOrder(order);
  const defaultId = order.length ? order[0] : getDefaultSourceId(sources);
  setDefaultSourceId(defaultId);
  return { order, defaultId, sources };
}

/**
 * Varsayilan kaynaktan tum kanallari tek listede dondurur.
 *
 * Ayni kanal M3U listesinde cogu kez birden fazla adresle geciyor (orn. BeIN
 * Sports 4K 11 farkli adresle). Bunlarin cogu zaman degil, cogu zaman biri
 * olu/olu (bazen HLS, bazen TS). Bu yuzden ilk adres "Varsayilan Yayin"
 * olur, kalanlar altStreams'e konur; oynatici mevcut kaynak degistirme
 * zincirini (srcList/advanceOrError) kullanarak onlari otomatik dener.
 *
 * 1800+ kanalda her biri icin uzaktan logo istemek pahali oldugu icin logo
 * yalnizca yerel eslesme (/tv-logos) varsa kullanilir, yoksa SVG rozet.
 */
/**
 * Kanal listesini duzenler.
 *  - Turkce kanallar one
 *  - ayni adi tasiyan kanallar tekillestirilir (en cok yedekli kaynak secilir)
 *  - uluslararasi kanallar listenin sonuna atilir; arayuzde varsayilan olarak
 *    gizlidir (showInternational=false)
 */
export function buildChannels(sources, { resolveLogo, maxAlt = 6, maxTurkish = 500, showInternational = false } = {}) {
  const out = [];
  const byName = new Map();
  for (const src of sources || []) {
    for (const ch of src.channels || []) {
      if (!ch || !ch.name || !ch.streamUrl) continue;
      // Teknik yedek yayınlar aynı kanalın farklı akışları; kullanıcıya
      // gereksiz gürültü olarak görünüyor ("BeIN Sports FEED1").
      if (/\bFEED\s*\d*\b|\bBACKUP\b|\bYEDEK\s*\d*\b|\bTEST\b|\bDEMO\b/i.test(ch.name)) continue;
      const key = normalizeName(ch.name);
      if (!key) continue;
      const existing = byName.get(key);
      if (!existing) {
        const channel = {
          id: `${src.id}_${stableId(ch.name, ch.streamUrl)}`,
          srcKey: src.id,
          srcLabel: gorunurEtiket(src.id, src.label),
          name: ch.name,
          logo: (typeof resolveLogo === 'function' && resolveLogo(ch.name)) || '',
          category: ch.category || 'national',
          quality: ch.quality || 'HD',
          tvgId: ch.tvgId || '',
          group: ch.group || '',
          region: ch.region === 'INT' ? 'INT' : 'TR',
          streamUrl: ch.streamUrl,
          isTs: ch.isTs === true,
          headers: ch.headers || null,
          altStreams: []
        };
        byName.set(key, channel);
        out.push(channel);
        continue;
      }
      if (existing.altStreams.length >= maxAlt) continue;
      if (ch.streamUrl === existing.streamUrl) continue;
      if (existing.altStreams.some((a) => a.url === ch.streamUrl)) continue;
      existing.altStreams.push({
        url: ch.streamUrl,
        isTs: ch.isTs === true,
        headers: ch.headers || null
      });
    }
  }
  // ── Liste düzeni ────────────────────────────────────────────────
  // 1) Türkçe kanallar önce, uluslararasılar sona
  // 2) Türkçe olan maxTurkish kadar kesilir (varsayılan 500). 1834 kanallık
  //    Kral listesinin yarısı Alman kanalıydı; kullanıcı bunları görmek
  //    istemiyor ve liste gereksiz uzun yükleniyordu.
  // 3) Uluslararası kanallar YALNIZCA showInternational istenirse döner.
  const trList = out.filter((c) => c.region !== 'INT');
  const intList = out.filter((c) => c.region === 'INT');
  // Sıralama: kullanıcı "Türkçe kanallara odaklan" dediğinde en çok
  // izlenenler önce gelsin. Ulusal → haber → sinema/çocuk → spor.
  const KATEGORI_ONCELIK = { national: 0, news: 1, movie: 2, series: 2, kids: 3, sports: 4, music: 5, doc: 6, other: 7 };
  trList.sort((a, b) => {
    const pa = KATEGORI_ONCELIK[a.category] ?? 7;
    const pb = KATEGORI_ONCELIK[b.category] ?? 7;
    if (pa !== pb) return pa - pb;
    return String(a.name).localeCompare(String(b.name), 'tr');
  });

  const kesilmis = trList.length > maxTurkish ? trList.slice(0, maxTurkish) : trList;
  // showInternational yalnızca ayrıca istendiğinde uluslararasılar eklenir.
  return showInternational ? kesilmis.concat(intList) : kesilmis;
}

function normalizeName(name) {
  return String(name || '')
    .toLocaleUpperCase('tr-TR')
    .replace(/\b(?:HD|FHD|4K|UHD|SD|KANALI|KANAL)\b/g, '')
    .replace(/[^A-ZÇĞİÖŞÜ0-9]/g, '');
}

// Ayni isimli kanal farkli kaynaklarda olabilir; id cakismasini kirmak icin
// yayin adresinin kisa bir ozeti ekleniyor (localStorage anahtari olarak da
// kullaniliyor: sadece harf/rakam/alt cizgi).
function stableId(name, url) {
  const s = `${name}|${url || ''}`;
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

/**
 * Kanal sagligi denetimi.
 *
 * NEDEN SUNUCUDA DEGIL, ISTEMCIDE: oynatma daima /api/hls_proxy uzerinden
 * gider, yani yayin "sunucudan" (Vercel) degil oynaticinin bulundugu agdan
 * gelir. Masaustunde sidecar = kullanicinin ev IP'si, APK'da Vercel. Bu
 * yuzden saglik testi de AYNI proxy uzerinden, istemciden yapilmalidir;
 * sunucudan test edip "olu" demesi yanlis olurdu (datacenter IP'leri cok
 * yayini goremiyor).
 *
 * Liste kirpik oldugu icin (M3U'da olu kanallar cok) denetim su ise yarar:
 * calisanlar one, olu olanlar sona gider; kullanici one ucuzca oynatabilir
 * olanlari gorur. Yalnizca sinirli sayida kanal (varsayilan 48) denenir,
 * cunku her deneme gercek bir yayin baglantisi acar.
 *
 * @param channels  denenecek kanallar (oncelik sirali gelmeli)
 * @param makeUrl   (channel) => yayin URL'i (LiveTvView toProxiedLiveUrl)
 * @returns { alive:Set, dead:Set, tested:number }
 */
export async function probeChannels(channels, makeUrl, {
  limit = 48, concurrency = 6, timeout = 7000
} = {}) {
  const alive = new Set();
  const dead = new Set();
  const targets = (channels || []).filter(c => c && c.streamUrl).slice(0, limit);
  let cursor = 0;
  let tested = 0;

  async function worker() {
    while (cursor < targets.length) {
      const ch = targets[cursor++];
      const url = makeUrl(ch);
      if (!url) { dead.add(ch.streamUrl); continue; }
      tested++;
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), timeout);
        let ok = false;
        try {
          const res = await fetch(url, {
            method: 'GET',
            signal: ctrl.signal,
            headers: { Range: 'bytes=0-8191' },
            cache: 'no-store'
          });
          if (res.ok && res.body) {
            // Canlı akış SONUMSUZdur: arrayBuffer() tamamen beklerdi. Yalnızca
            // ilk paketi okuyup akışı kapatıyoruz.
            const reader = res.body.getReader();
            try {
              const { value } = await reader.read();
              if (value && value.length > 0) {
                // TS: 0x47 senkron baytı. HLS: "#EXTM3U".
                ok = value[0] === 0x47
                  || new TextDecoder().decode(value.subarray(0, 7)) === '#EXTM3U';
              }
            } finally {
              // cancel() reddeden bir promise döner; await + try/catch şart.
              try { await reader.cancel(); } catch (_) {}
            }
          } else {
            // Hata gövdesi de (403/404 HTML sayfaları) okunmazsa bağlantı
            // tarayıcının havuzunda asılı kalır; 36 denetimde havuz tükenirdi.
            try { if (res.body) await res.body.cancel(); } catch (_) {}
          }
        } finally {
          clearTimeout(timer);
        }
        if (ok) alive.add(ch.streamUrl); else dead.add(ch.streamUrl);
      } catch (_) {
        dead.add(ch.streamUrl);
      }
    }
  }

  const workers = [];
  const n = Math.max(1, Math.min(concurrency, targets.length));
  for (let i = 0; i < n; i++) workers.push(worker());
  await Promise.all(workers);
  return { alive, dead, tested };
}

export function clearLiveSourceCache() {
  memoryCache = {};
  try {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(ORDER_KEY);
    localStorage.removeItem(DEFAULT_KEY);
  } catch (_) {}
}
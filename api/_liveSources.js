/* ==========================================================================
   CinePulse - Canli TV kaynak cozuculari (server-side, ortak modul)
   Hem Vercel (api/[...all].js) hem yerel sidecar (server/mediaServer.js)
   bu modulu import eder; boylece APK (Vercel) ve masaustu (sidecar)
   ayni cozumleyiciyi kullanir.

   Kaynaklar:
     kral   → GitHub raw'da duran .m3u_plus (1860+ kanal). CORS acik.
     turhan → Dropbox'ta duran HTML sayfasi (kanal listesi) + domain.php
              ile yayin adresi cozumlemesi. CORS kapali → sunucu uzerinden.
   ========================================================================== */

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const KRAL_UA = 'Dalvik/2.1.0 (Linux; U; Android 13)';

export const LIVE_SOURCE_IDS = ['kral', 'turhan'];

const KRAL_M3U_URL =
  'https://raw.githubusercontent.com/Kral-Turk/Kral-Turk-TV/refs/heads/main/TURK_TV.m3u_plus';
const TURHAN_PAGE_URL =
  'https://www.dropbox.com/scl/fi/vuxzapfsdgqhiyrcey4u0/s-n-rs-z-canl-TV.html?rlkey=w04hpznj5je0v8hb79i3vof80&st=lrx6rly9&dl=1';
const TURHAN_DOMAIN_URL = 'https://data-reality.com/domain.php';

// GitHub raw CORS verir (ACAO: *) → tarayici dogrudan M3U'yu cekebilir.
// Sunucu endpoint'i (Vercel/sidecar) devrede degilse ya da hata verirse bu
// yol APK'yi kurtarir; bu yuzden modul tarayicida da kullanilabilir kalmali
// (Node-only API icermiyor).
export const KRAL_M3U_ENDPOINT = KRAL_M3U_URL;

// ---------------------------------------------------------------- yardimci
export function normalizeCanliName(name) {
  return String(name || '')
    .toLocaleUpperCase('tr-TR')
    .replace(/\b(?:HD|FHD|4K|KANALI)\b/g, '')
    .replace(/[^A-ZÇĞİÖŞÜ0-9]/g, '');
}

export function isSafeStreamUrl(raw) {
  try {
    const parsed = new URL(String(raw));
    const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    if (!host || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) return false;
    if (host === '::1' || host === '::' || host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80:')) return false;
    const p = host.split('.').map(Number);
    if (p.length === 4 && p.every((n) => Number.isInteger(n) && n >= 0 && n <= 255)) {
      if (p[0] === 10 || p[0] === 127 || p[0] === 0
        || (p[0] === 169 && p[1] === 254)
        || (p[0] === 172 && p[1] >= 16 && p[1] <= 31)
        || (p[0] === 192 && p[1] === 168)
        || (p[0] === 100 && p[1] >= 64 && p[1] <= 127)) return false;
    }
    return true;
  } catch (_) {
    return false;
  }
}

async function fetchText(url, { timeout = 20000, userAgent = BROWSER_UA, extraHeaders = null } = {}) {
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), timeout) : null;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': userAgent, 'Accept': '*/*', ...(extraHeaders || {}) },
      redirect: 'follow',
      signal: ctrl ? ctrl.signal : undefined
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// ------------------------------------------------- .m3u / .m3u_plus parser
/**
 * #EXTINF satirindaki tirnakli alanlari temizleyip sondaki parcayi isim alir;
 * boylece "tvg-...=\"a,b\"" gibi virgollu degerler ismi bozmaz.
 * #EXTVLCOPT ile gelen http-user-agent / referrer / origin bilgileri
 * kanala tasinir (IPTV listelerinde olmazsa olmaz; cogu kaynak UA ister).
 */
export function parseM3uPlus(text) {
  const out = [];
  if (!text || typeof text !== 'string' || !text.includes('#EXTINF')) return out;
  const lines = text.split(/\r?\n/);
  let pending = null;
  let opts = {};
  for (const rawLine of lines) {
    const line = (rawLine || '').trim();
    if (!line) continue;
    if (line.startsWith('#EXTINF')) {
      const attrs = {};
      const attrRe = /([\w-]+)="([^"]*)"/g;
      let m;
      while ((m = attrRe.exec(line))) attrs[m[1].toLowerCase()] = m[2];
      const dequoted = line.replace(/"[^"]*"/g, '""');
      const name = (dequoted.split(',').slice(1).join(',') || '').trim();
      pending = {
        name: name || 'Kanal',
        logo: attrs['tvg-logo'] || '',
        tvgId: attrs['tvg-id'] || '',
        group: String(attrs['group-title'] || '').trim()
      };
      opts = {};
    } else if (line.toUpperCase().startsWith('#EXTVLCOPT:')) {
      // '#EXTVLCOPT:' = 11 karakter; 12'sinden kesmek anahtarin basindaki
      // 'h' yi koparir ve hicbir kanal UA/ref tasimaz.
      const kv = line.slice(11);
      const eq = kv.indexOf('=');
      if (eq > 0) {
        const k = kv.slice(0, eq).trim().toLowerCase();
        const v = kv.slice(eq + 1).trim();
        if (k === 'http-user-agent') opts.ua = v;
        else if (k === 'http-referrer' || k === 'http-referer') opts.ref = v;
        else if (k === 'http-origin') opts.origin = v;
      }
    } else if (line.startsWith('#')) {
      continue;
    } else if (pending) {
      if (/^https?:\/\//i.test(line)) {
        out.push({ ...pending, url: line, ua: opts.ua || '', ref: opts.ref || '', origin: opts.origin || '' });
      }
      pending = null;
      opts = {};
    }
  }
  return out;
}

// ------------------------------------------------------ kategori esleme
const SPORT_RE = /spor|sport|bein\s*sports?|futbol|basket|tenis|voleybol|formula\s*1|f1\b|nba|galatasaray|fenerbah|besiktas|trabzonspor|basaksehir/i;
const NEWS_RE = /haber|news|nachrichten|ntv\s*24|canal\s*24|haberturk|a\s*haber|bbc|cnn|sky\s*news/i;
const KIDS_RE = /çocuk|cocuk|kids?|kinder|animasyon|animation|cartoon|nickelodeon|disney|toon|baby|mini(?:ka|a)/i;
const DOC_RE = /belgesel|doku|documentar|docuseries|discovery\s*channel|nat\s*geo|wild|history\s*channel|animal|yaşam|yasam/i;
const MUSIC_RE = /müzik|muzik|music|musik|melodi|power\s*türk|power\s*turk|klip|mqtv/i;
const VOD_RE = /\b(vod|movie|movies|film|filmer|sinema\s+filmi|2\.?\s*filmi)\b|\.mkv\b|\.mp4\b|720p\s*izle|film\s+izle/i;

// Kral listesinin group-title'lari Turkce/Ingilizce/Almanca karisik; kategori
// etiketinden turetiliyor. EPG'nin GENRE_SCHEDULES anahtarlariyla birebir
// eslesmeli (national/news/sports/doc/kids/music), aksi halde 'national' fallback.
export function mapGroupToCategory(group) {
  const g = String(group || '');
  if (SPORT_RE.test(g)) return 'sports';
  if (NEWS_RE.test(g)) return 'news';
  if (KIDS_RE.test(g)) return 'kids';
  if (DOC_RE.test(g)) return 'doc';
  if (MUSIC_RE.test(g)) return 'music';
  return 'national';
}

function qualityOf(name, url) {
  const blob = `${name} ${url}`;
  if (/2160|4K|UHD/i.test(blob)) return '4K';
  if (/1440/i.test(blob)) return '1440p';
  if (/1080|FHD|UHD/i.test(blob)) return '1080p FHD';
  if (/720|HD/i.test(blob)) return '720p HD';
  if (/576|480|SD/i.test(blob)) return 'SD';
  return 'HD';
}

// Ad temizleme: ayni kanal farkli kaynaklarda "TRT 1 HD", "TRT 1", "TRT1" gibi
// gorunuyor; dedup'in calismasi icin normalize ediyoruz.
function cleanName(name) {
  return String(name || '')
    .replace(/\s*[\[(][^\])]*[\])]\s*$/g, '')
    .replace(/\s+(?:FHD|UHD|SD|HEVC|H265|H264|ORANJ|BAYRAK)\b.*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// --------------------------------------------------- Kral M3U kaynagi
// Saf (saf/veri) fonksiyon: metin → kanal. Sunucu ve tarayici ayni fonksiyonu
// kullanir, boylece iki yol da ayni sonucu (ve ayni filtreleri) uretir.
export function parseKralChannels(text) {
  const parsed = parseM3uPlus(text);
  const channels = [];
  const seenUrls = new Set();
  for (const entry of parsed) {
    if (!isSafeStreamUrl(entry.url)) continue;
    if (seenUrls.has(entry.url)) continue;
    const name = cleanName(entry.name);
    if (!name) continue;
    // Film/dizi deposu degil, yayin kanalizasyonu istiyoruz.
    if (VOD_RE.test(entry.name) && !/\b(kanal|channel|tv)\b/i.test(entry.name)) continue;
    seenUrls.add(entry.url);
    channels.push({
      name,
      streamUrl: entry.url,
      logo: entry.logo || '',
      tvgId: entry.tvgId || '',
      group: entry.group,
      category: mapGroupToCategory(entry.group),
      quality: qualityOf(entry.name, entry.url),
      isTs: !/\.m3u8(\?|$)/i.test(entry.url),
      headers: { ua: entry.ua, ref: entry.ref, origin: entry.origin }
    });
  }
  return channels;
}

export async function fetchKralChannels() {
  const text = await fetchText(KRAL_M3U_URL, { userAgent: BROWSER_UA, timeout: 25000 });
  return parseKralChannels(text);
}

// ------------------------------------------------ Turhan / Fixbet kaynagi
// Sayfa kartlari:
//   <div class="card" onclick="openChannel('https://fixbettv84.com/channel.html?id=trt1')">
//     <div class="channel-name">TRT 1</div>
//     <div class="site-tag">Fixbet TV</div>
// Yayin adresi sayfada gomulu degil: once data-reality.com/domain.php'den
// baseurl aliniyor, sonra {baseurl}{id}/mono.m3u8 uretiliyor.
export function parseTurhanPage(html) {
  const out = [];
  if (!html || !html.includes('channel.html')) return out;
  const cardRe = /<div class="card"[^>]*onclick="openChannel\('([^']+)'\)"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
  let m;
  while ((m = cardRe.exec(html))) {
    const pageUrl = m[1];
    const inner = m[2] || '';
    // Not: inner, site-tag'in KAPANIS </div>'ini icermez (cartin kapanisiyla
    // birlikte regexin sonuna kadar yenir) → etiket icin kapanis aranmaz.
    const nameMatch = inner.match(/class="channel-name"[^>]*>([^<]*)/);
    const tagMatch = inner.match(/class="site-tag"[^>]*>([^<]*)/);
    const name = (nameMatch ? nameMatch[1] : '').trim();
    const tag = (tagMatch ? tagMatch[1] : '').trim();
    if (!name || !pageUrl) continue;
    let site = '';
    let id = '';
    try {
      const u = new URL(pageUrl);
      site = u.hostname.replace(/^www\./, '');
      id = new URL(pageUrl).searchParams.get('id') || '';
    } catch (_) {}
    if (!id) continue;
    out.push({ name, pageUrl, site, id, tag });
  }
  return out;
}

let turhanBaseCache = { url: '', at: 0 };
const TURHAN_BASE_TTL_MS = 10 * 60 * 1000;

export async function resolveTurhanBase() {
  const now = Date.now();
  if (turhanBaseCache.url && now - turhanBaseCache.at < TURHAN_BASE_TTL_MS) {
    return turhanBaseCache.url;
  }
  const text = await fetchText(TURHAN_DOMAIN_URL, { timeout: 12000 });
  let base = '';
  try {
    base = String(JSON.parse(text).baseurl || '');
  } catch (_) {
    base = '';
  }
  if (!/^https?:\/\//i.test(base)) throw new Error('Turhan base url alinamadi');
  if (!base.endsWith('/')) base += '/';
  turhanBaseCache = { url: base, at: now };
  return base;
}

export async function fetchTurhanChannels() {
  const html = await fetchText(TURHAN_PAGE_URL, { timeout: 25000 });
  const entries = parseTurhanPage(html);
  if (!entries.length) throw new Error('Turhan sayfasi okunamadi (HTML degismis olabilir)');
  // baseurl tek istekle cozulur, tum kanallar paylasir.
  let base = '';
  try {
    base = await resolveTurhanBase();
  } catch (_) {
    base = '';
  }
  const seen = new Set();
  const channels = [];
  for (const e of entries) {
    const name = cleanName(e.name);
    if (!name || seen.has(name)) continue;
    const streamUrl = base ? `${base}${e.id}/mono.m3u8` : '';
    if (base && !isSafeStreamUrl(streamUrl)) continue;
    seen.add(name);
    channels.push({
      name,
      streamUrl,
      tvgId: e.id,
      group: e.tag || '',
      category: 'national',
      quality: 'HD',
      isTs: false,
      site: e.site,
      headers: { ref: e.pageUrl ? new URL(e.pageUrl).origin + '/' : '' }
    });
  }
  return channels;
}

// ------------------------------------------------------------- genel API
const FETCHERS = {
  kral: { label: 'Kral TV (M3U Plus)', fn: fetchKralChannels },
  turhan: { label: 'Turhan TV (Fixbet)', fn: fetchTurhanChannels }
};

export function isLiveSourceId(id) {
  return Object.prototype.hasOwnProperty.call(FETCHERS, String(id || ''));
}

export function listLiveSources() {
  return LIVE_SOURCE_IDS.map((id) => ({ id, label: FETCHERS[id].label }));
}

/**
 * Tek kaynagi cozer. Hata olursa { ok:false, error } doner — cagiran taraf
 * "bu kaynak calismiyor" diye listeden cikarip siradakiyle dener.
 *
 * SUNUCU TARAFI ONBELLEK: Kral listesi ~1 MB GitHub raw'dan, Turhan sayfasi
 * Dropbox'tan cekiliyor (olcum: ilk istek ~11 sn). Onbellek olmadan her
 * istek ayni agyi tekrar tekrar tarardi; Vercel'de bu fonksiyon zaman
 * asimiyla (10 sn) sonlanabiliyordu. 30 dk onbellek + ucus halinde (thundering
 * herd) koruma: es zamanli istekler ayni promise'i paylasir.
 */
const SOURCE_TTL_MS = 30 * 60 * 1000;
const sourceCache = new Map();     // id -> { at, data }
const sourceInflight = new Map();  // id -> Promise

export async function fetchLiveSourceChannels(id) {
  const key = String(id || '').toLowerCase();
  const entry = FETCHERS[key];
  if (!entry) throw new Error(`Bilinmeyen kaynak: ${id}`);

  const hit = sourceCache.get(key);
  if (hit && Date.now() - hit.at < SOURCE_TTL_MS) {
    return { ...hit.data, cached: true };
  }
  const pending = sourceInflight.get(key);
  if (pending) return pending;

  const task = entry.fn()
    .then((channels) => {
      const data = { id: key, label: entry.label, channels, count: channels.length };
      sourceCache.set(key, { at: Date.now(), data });
      if (sourceCache.size > 20) {
        // Bellek sinirini koru: en eski kayitlari dusur.
        const oldest = [...sourceCache.entries()].sort((a, b) => a[1].at - b[1].at);
        for (const [k] of oldest.slice(0, sourceCache.size - 20)) sourceCache.delete(k);
      }
      return data;
    })
    .finally(() => sourceInflight.delete(key));

  sourceInflight.set(key, task);
  return task;
}

/**
 * Tum kaynaklari sirayla dener, CALISANLARI dondurur (failover sirasi).
 * "Ilk acilan kaynak" varsayilani bu sirayla belirlenir.
 */
export async function fetchAllLiveSources() {
  const results = await Promise.all(
    LIVE_SOURCE_IDS.map(async (id) => {
      try {
        const r = await fetchLiveSourceChannels(id);
        return { ...r, ok: true };
      } catch (error) {
        return { id, label: FETCHERS[id].label, channels: [], count: 0, ok: false, error: String(error?.message || error) };
      }
    })
  );
  return results;
}
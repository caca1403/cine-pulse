/**
 * Starfire — Kısa dizi alternatif kaynak scraper (kahraman hat)
 * Kullanıcı 2026-10-31: "drama dizilerimden sonra alternatif olarak bunu ekle"
 *
 * CANLI ANALİZ (2026-10-31, node probe'ları ile doğrulanmış yapı):
 *   - Watch: /watch/{slug}/{sezon}/{bolum}  (/watch/{slug} = 1/1)
 *   - Sayfa, içine gömülü kaçışlı JSON taşır: externalSources{"dublaj":[...],"altyazi":[...]}
 *     her kaynak: { "type":"hls", "url":"https://...m3u8" (doğrudan) VEYA
 *     "resolve_url":"/media/...?expires&viewer&signature" (oturum çerezli çözümleme),
 *     "subtitle_url":"/hk/{id}/s?expires&signature", "primary":bool }
 *   - Doğrudan CDN URL'leri (b-cdn.net vb.) Referer: shortizle.com ile 200 verir.
 *   - resolve_url uçları XSRF-TOKEN çerezi ile {type:'hls',url} JSON'u döner; çerezsiz 403.
 *   - Bölüm bağlantıları: /watch/{slug}/{s}/{e} (tüm HTML'e dağılmış, <a> şart değil).
 *   - Poster: kaçışlı JSON "thumbnailUrl":["https://.../storage/posters/....jpg"]
 *   - Arama: /search?q= (kart bağlantıları /icerik/{slug})
 *
 * KURAL (kullanıcı 2026-10-31): arayüzde gerçek site adı asla görünmez — kaynak
 * satırları 'Starfire' kahraman kod adıyla üretilir (sourceLabels: source
 * 'Shortizle' → alias 'Starfire').
 */
import { apiUrl } from '../altyapi/apiOrigin.js';

const BASE_URL = 'https://shortizle.com';

const PLAYER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/** Kaçışlı JSON-HTML metninde alan okuma regex'i ("key\":\"...\/...\" ve "key":"..."). */
function escapedField(name) {
  return new RegExp(`${name}\\\\*":\\\\*"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)\\\\*"`);
}
function unescapeJsonPiece(raw) {
  try { return JSON.parse(`"${raw}"`); } catch (_) { return String(raw).replace(/\\\//g, '/'); }
}

/* Node/test ortamında oturum çerezlerini elle taşı (WebView'de tarayıcı
   çerez kovası /api/proxy üzerinden aynı kökene bağlanır). */
let oturumCerezi = '';

async function fetchSafe(pathOrUrl, opts = {}) {
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${BASE_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeout || 14000);
  const headers = {
    'User-Agent': PLAYER_UA,
    'Accept': 'text/html,application/xhtml+xml,application/json,*/*',
    'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
    ...(opts.headers || {})
  };
  if (oturumCerezi && !headers.Cookie) headers.Cookie = oturumCerezi;
  try {
    const isDesktop = typeof window !== 'undefined' && window.CinePulseDesktop?.isDesktop === true;
    const requestUrl = isDesktop
      ? apiUrl(`/api/proxy?url=${encodeURIComponent(url)}&ref=${encodeURIComponent(headers.Referer || `${BASE_URL}/`)}`)
      : url;
    const res = await fetch(requestUrl, { signal: controller.signal, ...opts, headers });
    // Set-Cookie'yi yakala (yalnız Node tarafında görünür; tarayıcıda şeffaf)
    try {
      const sc = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : [];
      for (const c of sc) {
        const pair = String(c).split(';')[0];
        if (pair.includes('=')) {
          const k = pair.split('=')[0];
          oturumCerezi = oturumCerezi ? oturumCerezi.split('; ').filter(p => p.split('=')[0] !== k).concat(pair).join('; ') : pair;
        }
      }
    } catch (_) {}
    clearTimeout(timeout);
    return res.ok ? res : null;
  } catch (_) {
    clearTimeout(timeout);
    return null;
  }
}

function cleanText(raw) {
  return String(raw || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function mutlaklastir(p) {
  if (!p) return '';
  if (/^https?:/i.test(p)) return p;
  if (p.startsWith('//')) return 'https:' + p;
  return `${BASE_URL}${p.startsWith('/') ? '' : '/'}${p}`;
}

/** Poster URL'ini temizle (Next.js /_next/image?url=... → orijinal) */
export function cleanImageUrl(raw) {
  if (!raw) return '';
  let url = String(raw).trim();
  if (url.includes('/_next/image?')) {
    try {
      const m = url.match(/[?&]url=([^&]+)/);
      if (m && m[1]) {
        const decoded = decodeURIComponent(m[1]);
        if (/^https?:\/\//.test(decoded)) return decoded;
      }
    } catch (_) {}
  }
  return mutlaklastir(url);
}

/* ── Arama ──────────────────────────────────────────────────────────────── */
export async function searchShortizle(query, page = 1) {
  if (!query || query.trim().length < 2) return [];
  const q = encodeURIComponent(query.trim());
  const res = await fetchSafe(`/search?q=${q}${page > 1 ? `&page=${page}` : ''}`);
  if (!res) return [];
  const html = await res.text().catch(() => '');
  if (!html) return [];

  const results = [];
  // Kart: <a href="/icerik/{slug}"> ... <img alt> ... başlık
  const cardRegex = /<a[^>]+href=["'](?:https?:\/\/shortizle\.com)?\/icerik\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = cardRegex.exec(html)) !== null) {
    const slug = m[1];
    const inner = m[2];
    const img = inner.match(/<img[^>]+(?:data-src|src)=["']([^"']+)["']/i);
    const titleM = inner.match(/alt=["']([^"']+)["']/i) || inner.match(/<h[2-6][^>]*>([\s\S]*?)<\/h[2-6]>/i);
    const title = cleanText(titleM ? titleM[1] : '') || slug;
    const poster = img ? cleanImageUrl(img[1].replace(/&amp;/g, '&')) : '';
    if (!results.some(r => r.slug === slug)) {
      results.push({ slug, title, poster, isDubbed: /dublaj/i.test(title), url: `${BASE_URL}/icerik/${slug}` });
    }
  }
  return results;
}

/* ── Watch sayfası + kaynak ayrıştırma ──────────────────────────────────── */
async function watchSayfaGetir(slug, season = 1, episode = 1) {
  const res = await fetchSafe(`/watch/${encodeURIComponent(slug)}/${season}/${episode}`);
  if (!res) return null;
  const html = await res.text().catch(() => '');
  return html || null;
}

/** externalSources bloklarından {dublaj:[], altyazi:[]} kaynak setini çıkarır. */
function kaynaklariAyikla(html) {
  const out = { dublaj: [], altyazi: [] };
  const blokRe = /\\?"(dublaj|altyazi|altyazili|subtitles?)\\?":\s*\[([\s\S]*?)\]\s*(?=,|})/g;
  let b;
  while ((b = blokRe.exec(html)) !== null) {
    const key = /dublaj/i.test(b[1]) ? 'dublaj' : 'altyazi';
    const items = b[2].split(/\},\s*\{/);
    for (const raw of items) {
      const it = /^\{/.test(raw) ? raw : `{${raw}}`;
      if (!/hls/i.test(it)) continue;
      const urlM = it.match(escapedField('url'));
      const resM = it.match(escapedField('resolve_url'));
      const subM = it.match(escapedField('subtitle_url'));
      const direct = urlM ? unescapeJsonPiece(urlM[1]) : '';
      const resolvePath = resM ? unescapeJsonPiece(resM[1]) : '';
      if (!/^https?:/.test(direct) && !resolvePath.startsWith('/')) continue;
      out[key].push({
        directUrl: /^https?:/.test(direct) ? direct : '',
        resolvePath: resolvePath.startsWith('/') ? resolvePath : '',
        subtitlePath: subM ? unescapeJsonPiece(subM[1]) : '',
        primary: /primary\\*":\s*\\*?true/.test(it)
      });
    }
  }
  return out;
}

/* ── Stream Çıkarma ─────────────────────────────────────────────────────── */
/**
 * Starfire watch sayfasından oynatılabilir HLS bulur.
 * 1) Doğrudan CDN URL'i → Referer: shortizle.com ile oynatılır.
 * 2) resolve_url → oturum çerezli GET → {type:'hls', url}.
 * Her aday #EXTM3U olarak CANLI doğrulanır — ölü adres oynatıcıya gitmez.
 * @returns {{streamUrl:string,isHls:boolean,headers:object,subtitles:Array}|null}
 */
export async function fetchShortizleStream(slug, season = 1, episode = 1, opts = {}) {
  const wantDub = opts.isDub !== false;   // varsayılan: dublaj hattı
  const html = await watchSayfaGetir(slug, season, episode);
  if (!html) return null;

  const set = kaynaklariAyikla(html);
  const havuz = [...(wantDub ? set.dublaj : set.altyazi), ...(wantDub ? set.altyazi : set.dublaj)];
  // primary önce, sonra doğrudan URL'liler önce
  havuz.sort((a, b) => (b.directUrl ? 1 : 0) - (a.directUrl ? 1 : 0) || (b.primary ? 1 : 0) - (a.primary ? 1 : 0));

  for (const src of havuz) {
    let streamUrl = '';
    if (src.directUrl) {
      streamUrl = src.directUrl;
    } else if (src.resolvePath) {
      const res = await fetchSafe(mutlaklastir(src.resolvePath), { headers: { Referer: `${BASE_URL}/` } });
      if (!res) continue;
      const data = await res.json().catch(() => null);
      const u = data?.url || '';
      if (!/^https?:/.test(u)) continue;   // gateway_bootstrap akışı bilinçli olarak denemez
      streamUrl = u;
    }
    if (!streamUrl) continue;

    // Kanıt ilkesi: manifest gerçekten #EXTM3U dönmüyorsa bu hat satır olmaz
    const check = await fetchSafe(streamUrl, { headers: { Referer: `${BASE_URL}/`, Origin: BASE_URL } });
    if (!check) continue;
    const body = await check.text().catch(() => '');
    if (!/#EXTM3U/.test(body.slice(0, 64))) continue;

    // Altyazı ucu yalnız GERÇEK WebVTT dönerse listelenir (ölü altyazı yok)
    const subtitles = [];
    if (src.subtitlePath) {
      const subRes = await fetchSafe(mutlaklastir(src.subtitlePath), { headers: { Referer: `${BASE_URL}/` } });
      if (subRes) {
        const subBody = await subRes.text().catch(() => '');
        const ct = subRes.headers.get('content-type') || '';
        if (/WEBVTT/i.test(subBody.slice(0, 32)) || /text\/vtt/i.test(ct)) {
          const u = mutlaklastir(src.subtitlePath);
          subtitles.push({ url: u, src: u, label: 'Türkçe', language: 'tr', headers: { Referer: `${BASE_URL}/`, 'User-Agent': PLAYER_UA } });
        }
      }
    }

    return {
      streamUrl,
      isHls: true,
      headers: { Referer: `${BASE_URL}/`, Origin: BASE_URL, 'User-Agent': PLAYER_UA },
      subtitles
    };
  }
  return null;
}

/* ── Detay + Bölüm Listesi ──────────────────────────────────────────────── */
export async function fetchShortizleDetails(slug) {
  if (!slug) return null;
  const html = await watchSayfaGetir(slug, 1, 1);
  if (!html) return null;

  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  let title = cleanText(titleMatch ? titleMatch[1] : '') || slug;
  title = title.replace(/\s*\d+\s*\.?\s*(?:bölüm|sezon)\b[\s\S]*$/i, '').trim() || title;

  // Poster: kaçışlı JSON thumbnailUrl ya da og:image
  let poster = '';
  const posterM = html.match(escapedField('thumbnailUrl')) ||
                  html.match(/<meta\s+(?:property="og:image"|name="twitter:image")\s+content="([^"]+)"/i);
  if (posterM) poster = cleanImageUrl(unescapeJsonPiece(posterM[1]).split(',')[0].trim());

  // Açıklama: meta og:description (sitede gerçek özet meta'da taşıyor)
  let description = '';
  const metaDesc = html.match(/<meta\s+(?:property=["']og:description["']|name=["']description["'])\s+content=["']([^"']+)["']/i);
  if (metaDesc) description = cleanText(metaDesc[1]);

  // Bölümler: /watch/{slug}/{s}/{e} desenleri tüm HTML'de (JSON içi dahil)
  const episodes = [];
  const epRe = /\/watch\/[a-zA-Z0-9_-]+\/(\d+)\/(\d+)/g;
  let em;
  while ((em = epRe.exec(html)) !== null) {
    const s = parseInt(em[1], 10) || 1;
    const e = parseInt(em[2], 10) || 1;
    if (!episodes.some(ep => ep.season === s && ep.episode === e)) {
      episodes.push({ season: s, episode: e, title: `Bölüm ${e}`, thumb: '' });
    }
  }
  episodes.sort((a, b) => (a.season - b.season) || (a.episode - b.episode));

  return {
    slug,
    title,
    poster,
    description,
    isDubbed: /dublaj/i.test(title),
    totalEpisodes: episodes.length,
    episodes
  };
}

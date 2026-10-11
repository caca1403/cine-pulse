import { akilliGet, cihazGet, cihazPost, nativeHttpAktifMi } from './nativeHttp.js';

/* ==========================================================================
   CinePulse — sinemacc.com kaziyicisi (film odakli)

   Akis (canli dogrulanmis 2026-10-11):
     /film-arsivi/      -> /film/<slug> listesi
     /film/<slug>/      -> detay sayfasi; oynatici iframe'i BASE64 kodlanmis
     base64 cozme       -> https://player.filmizle.in/video/<ID>
     POST /player/index.php?data=<ID>&do=getVideo
                        -> { hls, securedLink: "https://.../master.m3u8?md5=..&expires=.." }

   ONEMLI: player.filmizle.in, /video/<ID> sayfasini YALNIZCA dogru Referer
   ile veriyor; referersiz istek 404 donuyor. Tarayici bir iframe acarken
   Referer'i kendi adresimiz olarak gonderir, bu yuzden gomulu oynatici
   kurulumu (dizi77'deki gibi) burada calismaz.

   Bunun yerine FirePlayer'in kullandigi API dogrudan cagrilir ve icinden
   DOGRUDAN HLS adresi alinir; boylece kırılgan iframe'e hic gerek kalmaz.
   API'ye gonderilen `r` parametresi de sayfanin document.referrer'idir, yani
   sitenin adresidir — proxy uzerinden dogru degerle post edilir.
   ========================================================================== */

const BASE = 'https://sinemacc.com';
const PLAYER = 'https://player.filmizle.in';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function proxyUrl(url, ref) {
  try {
    const r = `${new URL(url).origin}/`;
    return `/api/proxy?url=${encodeURIComponent(url)}&ref=${encodeURIComponent(ref || r)}`;
  } catch (_) {
    return url;
  }
}

// Engel sayfasi mi, yoksa gercek icerik mi?
function isBlockedBody(body) {
  if (!body || body.length < 2000) return true;
  const low = body.slice(0, 4000).toLowerCase();
  return low.includes('attention required') || low.includes('just a moment')
      || low.includes('cf-browser-verification');
}

async function getHtml(url, timeout = 13000) {
  // 0) Cihazin kendi IP'sinden dogrudan istek (CapacitorHttp).
  // En hizli yol: WebView/proxy yok, sunucu yok, Referer serbest.
  if (nativeHttpAktifMi()) {
    const r = await cihazGet(url, { timeout: Math.min(timeout, 10000) });
    if (r.ok && r.text && !isBlockedBody(r.text)) return r.text;
  }

  // 1) Cihaz WebView'i (CF engelinde, Orion deseni)
  try {
    const wv = await import('./platform/androidWebViewResolver.js');
    if (wv.hasNativeWebViewResolver()) {
      const hit = await wv.resolvePageInNativeWebView(url, { timeoutMs: Math.max(14000, timeout + 6000) });
      if (hit && !wv.looksBlocked(hit)) {
        const raw = String(hit.text || '').trim();
        const body = (raw.startsWith('{') || raw.startsWith('[')) ? raw : (hit.html || raw);
        if (body && !isBlockedBody(body)) return body;
      }
    }
  } catch (_) {}

  // 2) CF Worker gateway
  try {
    const res = await fetch(`https://wild-credit-e1ae.cagatayca07.workers.dev?url=${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(Math.max(9000, timeout))
    }).catch(() => null);
    if (res && res.ok) {
      const body = await res.text();
      if (!isBlockedBody(body)) return body;
    }
  } catch (_) {}

  // 3) Uygulama proxy'si
  try {
    const res = await fetch(proxyUrl(url), {
      signal: AbortSignal.timeout(timeout),
      headers: { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }
    });
    if (!res.ok) return '';
    const body = await res.text();
    return isBlockedBody(body) ? '' : body;
  } catch (_) {
    return '';
  }
}

function normalize(str) {
  return String(str || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '');
}

// iframe src'leri arasinda BASE64 kodlanmis oynatici adresi var.
function decodeEmbed(html) {
  const re = /src="([A-Za-z0-9+/]{40,}={0,2})"/g;
  let m;
  while ((m = re.exec(html))) {
    try {
      const decoded = atob(m[1]);
      if (/^https?:\/\//i.test(decoded)) return decoded;
    } catch (_) {}
  }
  return '';
}

function titleFromSlug(slug) {
  const cleaned = slug.replace(/-(19|20)\d{2}$/, '');
  return cleaned.split('-').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ');
}

export async function searchSinemacc(query, isSeries = false) {
  if (isSeries) return [];
  if (!query || String(query).trim().length < 2) return [];

  const html = await getHtml(`${BASE}/film-arsivi/`);
  if (!html) return [];

  const seen = new Set();
  const all = [];
  const re = /href="https:\/\/sinemacc\.com\/film\/([a-z0-9-]+)\/"/g;
  let m;
  while ((m = re.exec(html))) {
    const slug = m[1];
    if (seen.has(slug)) continue;
    seen.add(slug);
    all.push({ id: slug, title: titleFromSlug(slug), url: `${BASE}/film/${slug}/`, isSeries: false });
  }

  const q = normalize(query);
  const hit = q ? all.filter((r) => normalize(r.title).includes(q)) : [];
  return (hit.length ? hit : all).slice(0, 60);
}

/**
 * FirePlayer API'sinden DOGRUDAN HLS adresi alir.
 *   POST /player/index.php?data=<ID>&do=getVideo
 *   govde: hash=<ID>&r=<document.referrer>
 * Donus: { hls, securedLink, videoImage }
 */
async function resolveDirectHls(playerUrl) {
  const id = (playerUrl.match(/\/video\/([A-Za-z0-9_-]{8,80})/) || [])[1];
  if (!id) return null;

  const api = `${PLAYER}/player/index.php?data=${encodeURIComponent(id)}&do=getVideo`;
  const body = `hash=${encodeURIComponent(id)}&r=${encodeURIComponent(`${BASE}/`)}`;

  // Önce cihazin kendi IP'sinden (Referer serbest yazılabilir, Vercel'e çıkmaz).
  if (nativeHttpAktifMi()) {
    const r = await cihazPost(api, body, { ref: `${BASE}/`, timeout: 12000 });
    if (r.ok && r.text && r.text.trim().startsWith('{')) return r.text;
  }

  // Sonra uygulama proxy'si (Referer'ı sunucu tarafında basar). Web'de
  // tarayıcı bu POST'u dogrudan yapamaz — referer'i kendi adresi olurdu.
  let text = '';
  try {
    const res = await fetch(proxyUrl(api, `${BASE}/`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body,
      signal: AbortSignal.timeout(15000)
    });
    if (res.ok) text = await res.text();
  } catch (_) {}

  if (!text.trim().startsWith('{')) {
    // Cihazda yerel sidecar yoksa WebView üzerinden dene.
    try {
      const wv = await import('./platform/androidWebViewResolver.js');
      if (wv.hasNativeWebViewResolver()) {
        const hit = await wv.resolvePageInNativeWebView(api, {
          timeoutMs: 18000,
          method: 'POST',
          body
        });
        if (hit && hit.text && String(hit.text).trim().startsWith('{')) text = String(hit.text);
      }
    } catch (_) {}
  }

  if (!text.trim().startsWith('{')) return null;
  try {
    const data = JSON.parse(text);
    const link = data.securedLink || (data.hls ? data.videoSource : '') || '';
    if (!link || !/\.m3u8|\.txt/.test(link)) return null;
    return { link, poster: data.videoImage || '' };
  } catch (_) {
    return null;
  }
}

export async function fetchSinemaccSources({ title = '', titles = [] } = {}) {
  const cands = [...new Set([...titles, title].filter((t) => t && String(t).trim().length > 1))];
  if (!cands.length) return [];

  const results = await searchSinemacc(cands[0], false);
  if (!results.length) return [];

  const nq = normalize(cands[0]);
  const match = results.find((r) => normalize(r.title) === nq)
    || results.find((r) => normalize(r.title).includes(nq) || nq.includes(normalize(r.title)))
    || results[0];

  const html = await getHtml(match.url);
  if (!html) return [];
  const embed = decodeEmbed(html);
  if (!embed) return [];

  const hls = await resolveDirectHls(embed);
  if (!hls) return [];

  // HLS adresi Referer kontrolu yapabiliyor; proxy uzerinden gecirip
  // refereri player adresine sabitliyoruz.
  const playUrl = `/api/hls_proxy?url=${encodeURIComponent(hls.link)}&ref=${encodeURIComponent(`${PLAYER}/`)}`;

  return [{
    id: `smc_${match.id}`,
    title: `sinemacc • ${match.title}`,
    displayName: `sinemacc ${match.title}`,
    badge: '🎬 1080p HLS',
    source: 'sinemacc',
    type: 'hls',
    isHls: true,
    isHlsStream: true,
    category: 'dubbed',
    url: playUrl,
    streamUrl: playUrl,
    rawStreamUrl: hls.link,
    poster: hls.poster,
    quality: '1080p',
    pageUrl: match.url
  }];
}
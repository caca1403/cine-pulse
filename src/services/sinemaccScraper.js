/* ==========================================================================
   CinePulse — sinemacc.com kaziyicisi (film odakli)

   Akis (canli dogrulanmis 2026-10-11):
     /film-arsivi/                  -> /film/<slug> listesi
     /film/<slug>/                  -> detay sayfasi; oynatici iframe'i
                                      BASE64 kodlanmis olarak geliyor:
                                      aHR0cHM6Ly9wbGF5ZXIu... -> https URL

   Direkt m3u8 yok; oynatici player.filmizle.in adresinde JS ile yukleniyor.
   Bu yuzden BASE64 cozulup IFRAME dondurulur; uygulama gomulu oynatici
   cercevesinde acar.
   ========================================================================== */

const BASE = 'https://sinemacc.com';

function proxyUrl(url, ref) {
  try {
    const r = `${new URL(url).origin}/`;
    return `/api/proxy?url=${encodeURIComponent(url)}&ref=${encodeURIComponent(ref || r)}`;
  } catch (_) {
    return url;
  }
}

async function getHtml(url, timeout = 13000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' }
    });
    if (!res.ok) return '';
    return await res.text();
  } catch (_) {
    return '';
  } finally {
    clearTimeout(timer);
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
// https://...base64...  ->  atob -> https://player.filmizle.in/video/<hash>
function decodeEmbed(html) {
  const re = /src="([A-Za-z0-9+/]{40,}={0,2})"/g;
  let m;
  while ((m = re.exec(html))) {
    try {
      const decoded = atob(m[1]);
      if (/^https?:\/\//i.test(decoded)) return decoded;
    } catch (_) {}
  }
  const plain = html.match(/<iframe[^>]*src="(https?:\/\/(?!sinemacc\.com\/?)[^"]+)"/i);
  return plain ? plain[1] : '';
}

function titleFromSlug(slug) {
  const cleaned = slug.replace(/-(19|20)\d{2}$/, '');
  return cleaned.split('-').map(w => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ');
}

export async function searchSinemacc(query, isSeries = false) {
  if (isSeries) return [];
  if (!query || String(query).trim().length < 2) return [];

  const html = await getHtml(proxyUrl(`${BASE}/film-arsivi/`, `${BASE}/`), 15000);
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
  const hit = q ? all.filter(r => normalize(r.title).includes(q)) : [];
  return (hit.length ? hit : all).slice(0, 60);
}

export async function fetchSinemaccSources({ title = '', titles = [], year = null } = {}) {
  const cands = [...new Set([...titles, title].filter(t => t && String(t).trim().length > 1))];
  if (!cands.length) return [];

  const results = await searchSinemacc(cands[0], false);
  if (!results.length) return [];

  const nq = normalize(cands[0]);
  const match = results.find(r => normalize(r.title) === nq)
    || results.find(r => normalize(r.title).includes(nq) || nq.includes(normalize(r.title)))
    || results[0];

  const html = await getHtml(proxyUrl(match.url, `${BASE}/`), 14000);
  if (!html) return [];
  const embed = decodeEmbed(html);
  if (!embed) return [];

  return [{
    id: `smc_${match.id}`,
    title: `sinemacc • ${match.title}`,
    displayName: `sinemacc ${match.title}`,
    badge: '🎬 1080p gömülü',
    source: 'sinemacc',
    type: 'embed',
    isIframe: true,
    category: 'dubbed',
    url: embed,
    streamUrl: embed,
    embedUrl: embed,
    rawStreamUrl: embed,
    quality: '1080p',
    pageUrl: match.url
  }];
}
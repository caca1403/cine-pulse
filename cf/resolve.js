// api/resolve.py + api/providers/canlitv.py portu — Canlı TV kanal listesi ve
// kanal yayın adresi. Eklenti/sağlayıcı katmanı söküldüğü için bu portta artık
// yalnız ctv yolu vardır; python/worker-relay dalları workerd'da çalışmaz.
const FULL_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const proxied = (raw, ref) => `/api/hls_proxy?url=${encodeURIComponent(raw)}&ref=${encodeURIComponent(ref)}`;

async function fetchText(url, referer = '', timeout = 7000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeout);
  try {
    const r = await fetch(url, {
      redirect: 'follow',
      signal: ac.signal,
      headers: {
        'User-Agent': FULL_UA,
        ...(referer ? { Referer: referer } : {}),
        'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
      },
    });
    if (!r.ok) return '';
    return await r.text();
  } catch {
    return '';
  } finally {
    clearTimeout(t);
  }
}

async function fetchJson(url, referer = '', timeout = 7000) {
  const t = await fetchText(url, referer, timeout);
  if (!t) return null;
  try { return JSON.parse(t); } catch { return null; }
}

// ── CanliTV ─────────────────────────────────────────────────────────────────
const CTV_BASE = 'https://www.canlitv.you';
const CTV_REF = `${CTV_BASE}/`;
const KAT_MAP = { genel: 'national', haber: 'news', spor: 'sports', belgesel: 'doc', cocuk: 'kids' };
const LIST_TTL = 12 * 3600 * 1000;
const listCache = { at: 0, data: [] };

async function ctvListChannels() {
  const now = Date.now();
  if (listCache.data.length && now - listCache.at < LIST_TTL) return listCache.data;
  let html = '';
  for (let attempt = 0; attempt < 3; attempt++) {
    html = await fetchText(`${CTV_BASE}/televizyonlar`, CTV_REF, 12000);
    if (html && html.includes("<li class='ft_")) break;
  }
  const out = [];
  if (html) {
    for (const li of html.match(/<li class='ft_[\s\S]*?<\/li>/g) || []) {
      let m = li.match(/<a href="(\/[^"]+)"[^>]*title="([^"]*canl[^"]*)"[^>]*>([^<]+)<\/a>/i);
      let href; let name;
      if (m) { href = m[1]; name = (m[3] || '').trim() || (m[2] || '').trim(); }
      else {
        m = li.match(/<a href="(\/[^"]+)"[^>]*>([^<]{2,50})<\/a>/);
        if (!m) continue;
        href = m[1]; name = m[2].trim();
      }
      if (!href || href.split('/').pop().includes('.') || href.startsWith('/blog')) continue;
      if (href === '/tr' || href === '/tr/') continue;
      if (['/rating', '/yayin-akisi', '/favoriler', '/kameralar', '/televizyonlar', '/online', '-kanallari'].some((x) => href.includes(x))) continue;
      const katM = li.match(/data-kat="([^"]+)"/);
      const kat = katM ? katM[1] : '';
      const imgM = li.match(/<img[^>]*src="([^"]+)"/);
      const idM = li.match(/\bft_(\d+)\b/);
      name = name.replace(/\s+/g, ' ').trim();
      if (!name || name.length > 60) continue;
      out.push({
        slug: href.replace(/^\/+/, '').replace(/\/+$/, ''),
        playerId: idM ? idM[1] : '',
        name,
        category: KAT_MAP[kat] || 'canlitv',
        group: kat,
        logo: imgM
          ? (imgM[1].startsWith('http') ? imgM[1] : `${CTV_BASE}/${imgM[1].replace(/^\/?/, '')}`)
          : (idM ? `${CTV_BASE}/kanal/logo/100/${idM[1]}.jpg` : ''),
      });
    }
  }
  const seen = new Set();
  const uniq = out.filter((c) => (seen.has(c.slug) ? false : (seen.add(c.slug), true)));
  if (uniq.length) { listCache.at = now; listCache.data = uniq; }
  return uniq;
}

async function ctvResolveChannel(slug, playerId = '') {
  slug = String(slug || '').trim().replace(/^\/+|\/+$/g, '');
  if (!/^[a-z0-9-]+$/.test(slug)) return { success: false, error: 'Gecersiz kanal' };
  const pageUrl = `${CTV_BASE}/${slug}`;
  let pid = /^\d{1,8}$/.test(String(playerId)) ? String(playerId) : '';
  if (!pid) pid = (listCache.data.find((c) => c.slug === slug) || {}).playerId || '';
  if (!pid) {
    const html = await fetchText(pageUrl, CTV_REF, 6000);
    const m = html.match(/\/player\/index\.php\?id=(\d+)|online\.php\?sayfa=(\d+)/);
    if (!m) return { success: false, error: 'Player bulunamadi' };
    pid = m[1] || m[2];
  }
  const phtml = await fetchText(`${CTV_BASE}/player/index.php?id=${pid}&mobile=0`, pageUrl, 6000);
  if (!phtml) return { success: false, error: 'Player erisimi yok' };
  const youtube = phtml.match(/https:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (youtube) {
    const embed = `https://www.youtube.com/embed/${youtube[1]}?autoplay=1&playsinline=1&rel=0`;
    return { success: true, kind: 'youtube', embedUrl: embed, streams: [{ provider: 'CanliTV', embedUrl: embed }], movieUrl: pageUrl };
  }
  const iframe = phtml.match(/<iframe[^>]+src=["'](https:\/\/[^"']+)/);
  if (iframe) {
    const embed = iframe[1].replace(/&amp;/g, '&');
    return { success: true, kind: 'embed', embedUrl: embed, streams: [{ provider: 'CanliTV', embedUrl: embed }], movieUrl: pageUrl };
  }
  const watch = phtml.match(/<a[^>]+href=["'](https:\/\/[^"']+)["'][^>]+title=["'][^"']*canlı yayını/);
  if (watch && !watch[1].includes('tabii.com/')) {
    return { success: true, kind: 'external', externalUrl: watch[1], streams: [], movieUrl: pageUrl };
  }
  const fm = phtml.match(/file["']?\s*[:=]\s*["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/);
  let raw; let ref = CTV_REF; let kind = 'hls';
  if (fm) raw = fm[1].replace(/&amp;/g, '&');
  else if (/tabii\.com\/tr\/watch\/live\/trt1(?:["'/]|$)/.test(phtml)) {
    raw = 'https://tv-trt1.medya.trt.com.tr/master.m3u8';
    ref = 'https://www.trt1.com.tr/';
    kind = 'tabii-public';
  } else return { success: false, error: 'Bu kanal dogrudan yayin vermiyor' };
  const stream = `${proxied(raw, ref)}&live=1`;
  return {
    success: true,
    kind,
    streams: [{ provider: 'CanliTV', streamUrl: stream, rawStreamUrl: raw, embedUrl: pageUrl, subtitles: [] }],
    streamUrl: stream,
    rawStreamUrl: raw,
    movieUrl: pageUrl,
    subtitles: [],
    provider: 'CTV',
  };
}

// ── /api/resolve node-stili giris (python dispatch'in web görümünün portu) ──
export default async function handler(req, res) {
  const url = new URL(req.url, 'http://x');
  const p = Object.fromEntries(url.searchParams.entries());
  if (p.titles && typeof p.titles === 'string') { try { p.titles = JSON.parse(p.titles); } catch { p.titles = p.titles.split(','); } }
  const prov = String(p.provider || '').toLowerCase().trim();
  let result;
  try {
    if (prov === 'ctv' || prov === 'canlitv' || prov === 'canli') {
      result = p.slug ? await ctvResolveChannel(p.slug, p.playerId) : { success: true, channels: await ctvListChannels() };
    } else {
      result = { success: false, error: `provider ${prov || '?'} web portunda yok` };
    }
  } catch (err) {
    result = { success: false, error: String(err && err.message || err) };
  }
  res.setHeader('Cache-Control', 'no-store');
  res.json(result);
}

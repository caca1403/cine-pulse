// api/resolve.py + api/providers/{canlitv,dizisol}.py portu (web'in kullandığı
// iki sağlayıcı: ctv, dzs). python/worker-relay dalları workerd'da çalışmaz;
// buraya yalnızca web'in gerçekten çağırdak yollar taşındı.
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

// ── Dizisol ─────────────────────────────────────────────────────────────────
const DS_API = 'https://dizisol.com/api';
const DS_REF = 'https://dizisol.com/';
const DS_BLOCKED = ['pichive', 'hotlinger', 'recaptcha', 'media.cm', 'cloudvideo.tv',
  'vidoza.net', 'voe.sx', 'bysejikuar', 'filemoon', 'hdfilmdelisi', 'play.liderfilm'];

const dsValid = (url) => {
  if (!url || typeof url !== 'string') return false;
  const u = url.toLowerCase();
  if (!u.startsWith('http://') && !u.startsWith('https://') && !u.startsWith('/api/')) return false;
  return !DS_BLOCKED.some((b) => u.includes(b));
};
const dsProxyStream = (raw) => proxied(raw.startsWith('/api/') ? `https://dizisol.com${raw}` : raw, DS_REF);
const dsProxySub = (raw) => (raw && typeof raw === 'string' ? (raw.includes('dizisol.com') ? proxied(raw, DS_REF) : raw) : '');

function dsSubs(...objs) {
  const out = [];
  for (const o of objs) {
    if (!o || typeof o !== 'object') continue;
    if (o.subtitleTr) out.push({ label: 'Türkçe (DS)', src: dsProxySub(o.subtitleTr) });
    if (o.subtitleEn) out.push({ label: 'English (DS)', src: dsProxySub(o.subtitleEn) });
  }
  const seen = new Set();
  return out.filter((s) => (s.src && !seen.has(s.src) ? (seen.add(s.src), true) : false));
}

function dsCandidates(title, originalTitle, titles) {
  const cands = [];
  for (const t of [title, originalTitle, ...(Array.isArray(titles) ? titles : [])]) {
    if (t && typeof t === 'string' && t.trim() && !cands.includes(t.trim())) cands.push(t.trim());
  }
  return cands;
}

async function dsResolveTmdb(cands, want) {
  for (const q of cands) {
    const data = await fetchJson(`${DS_API}/movies/search?q=${encodeURIComponent(q)}`, DS_REF, 5000);
    if (!Array.isArray(data)) continue;
    for (const r of data) {
      if (r && typeof r === 'object' && r.type === want && r.tmdbId) return parseInt(r.tmdbId, 10);
    }
  }
  return null;
}

function dsBuildStreams(items, tag, season = null, episode = null) {
  return items.map((it, i) => {
    let label = i ? `DS ${it.provider} 1080p` : 'DS 1080p (HLS)';
    if (season !== null) label = i ? `${label} (S${season}B${episode})` : `DS 1080p (S${season}B${episode})`;
    return {
      provider: `DS ${it.provider}`,
      streamUrl: dsProxyStream(it.url),
      rawStreamUrl: it.url.startsWith('http') ? it.url : `https://dizisol.com${it.url}`,
      embedUrl: it.url,
      subtitles: it.subs || [],
      tag: `${tag}_${String(it.provider).toLowerCase().replace(/ /g, '')}_${i}`,
    };
  });
}

function dsFinalize(streams, pageUrl) {
  if (!streams.length) return null;
  const first = streams[0];
  return {
    success: true,
    streams,
    streamUrl: first.streamUrl,
    rawStreamUrl: first.rawStreamUrl,
    movieUrl: pageUrl,
    embedUrl: first.embedUrl || '',
    subtitles: first.subtitles || [],
  };
}

async function dsResolveMovie(p) {
  let tid = p.tmdbId ? parseInt(p.tmdbId, 10) : await dsResolveTmdb(dsCandidates(p.title, p.originalTitle, p.titles?.length ? p.titles : []), 'movie');
  if (!tid) return { success: false, error: 'TMDB match not found' };
  const data = await fetchJson(`${DS_API}/movies/by-tmdb/${tid}`, DS_REF, 6000);
  if (!data) return { success: false, error: 'Detail not found' };
  const items = []; const seen = new Set();
  if (dsValid(data.m3u8Url)) { seen.add(data.m3u8Url); items.push({ url: data.m3u8Url, provider: 'VIP', subs: dsSubs(data) }); }
  for (const s of data.sources || []) {
    if (!s || typeof s !== 'object' || !dsValid(s.m3u8Url) || seen.has(s.m3u8Url)) continue;
    seen.add(s.m3u8Url);
    items.push({ url: s.m3u8Url, provider: (s.provider || 'VIP').toUpperCase(), subs: dsSubs(s, data) });
  }
  if (!items.length) return { success: false, error: 'No playable source' };
  const fin = dsFinalize(dsBuildStreams(items, `mov_${tid}`), `dizisol:movie:${tid}`);
  return fin ? { ...fin, provider: 'DS' } : { success: false, error: 'No playable source' };
}

async function dsResolveEpisode(p) {
  const s = parseInt(p.season || '1', 10) || 1;
  const e = parseInt(p.episode || '1', 10) || 1;
  let tid = p.tmdbId ? parseInt(p.tmdbId, 10) : await dsResolveTmdb(dsCandidates(p.title, p.originalTitle, p.titles?.length ? p.titles : []), 'tv');
  if (!tid) return { success: false, error: 'TMDB match not found' };
  const eps = await fetchJson(`${DS_API}/movies/by-tmdb/${tid}/episodes`, DS_REF, 6000);
  if (!Array.isArray(eps)) return { success: false, error: 'Episodes not found' };
  const target = eps.find((x) => x && typeof x === 'object'
    && parseInt(x.season || 0, 10) === s && parseInt(x.episode || 0, 10) === e);
  if (!target) return { success: false, error: 'Episode not found' };
  const items = []; const seen = new Set();
  if (dsValid(target.m3u8Url)) { seen.add(target.m3u8Url); items.push({ url: target.m3u8Url, provider: 'VIP', subs: dsSubs(target) }); }
  for (const so of target.sources || []) {
    if (!so || typeof so !== 'object' || !dsValid(so.m3u8Url) || seen.has(so.m3u8Url)) continue;
    seen.add(so.m3u8Url);
    items.push({ url: so.m3u8Url, provider: (so.provider || 'VIP').toUpperCase(), subs: dsSubs(so, target) });
  }
  if (!items.length) return { success: false, error: 'No playable source' };
  const fin = dsFinalize(dsBuildStreams(items, `tv_${tid}`, s, e), `dizisol:tv:${tid}:s${s}e${e}`);
  return fin ? { ...fin, provider: 'DS' } : { success: false, error: 'No playable source' };
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
    } else if (prov === 'dzs' || prov === 'dizisol' || prov === 'ds') {
      result = p.type === 'movie'
        ? await dsResolveMovie(p)
        : await dsResolveEpisode(p);
    } else {
      result = { success: false, error: `provider ${prov || '?'} web portunda yok` };
    }
  } catch (err) {
    result = { success: false, error: String(err && err.message || err) };
  }
  res.setHeader('Cache-Control', 'no-store');
  res.json(result);
}

/* ==========================================================================
   CinePulse - iptv-org omurga listesi (TR)
   Yillarca ayakta, toplulukca dogrulanan liste; gunluk cache.
   Kaynak: https://iptv-org.github.io/iptv/countries/tr.m3u
   Oynatma mevcut failover'dan gecer (direkt -> proxy).
   ========================================================================== */

const LIST_URL = 'https://iptv-org.github.io/iptv/countries/tr.m3u';
const LS_KEY = 'cp_iptvorg_tr_v1';
const TTL_MS = 24 * 60 * 60 * 1000;

const GROUP_MAP = {
  General: 'national',
  Entertainment: 'national',
  Movies: 'national',
  Undefined: 'national',
  News: 'news',
  Sports: 'sports',
  Documentary: 'doc',
  Kids: 'kids',
  Animation: 'kids',
  Music: 'music'
};

function readCache() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.channels)) return null;
    if (Date.now() - (parsed.savedAt || 0) > TTL_MS) return null;
    return parsed.channels;
  } catch (_) {
    return null;
  }
}

function writeCache(channels) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ savedAt: Date.now(), channels }));
  } catch (_) {}
}

export function parseIptvOrg(text) {
  const out = [];
  if (!text || typeof text !== 'string' || !text.includes('#EXTINF')) return out;
  const lines = text.split(/\r?\n/);
  let pending = null;
  for (const rawLine of lines) {
    const line = (rawLine || '').trim();
    if (!line) continue;
    if (line.startsWith('#EXTINF')) {
      const attrs = {};
      const attrRe = /([\w-]+)="([^"]*)"/g;
      let m;
      while ((m = attrRe.exec(line))) attrs[m[1].toLowerCase()] = m[2];
      // Tirnakli alanlarin icindeki virgulller ismi bozar (orn. user-agent);
      // once tirnakli kisimlari temizleyip sondaki parcayi isim al.
      const dequoted = line.replace(/"[^"]*"/g, '""');
      const name = (dequoted.split(',').slice(1).join(',') || '').trim();
      const groups = String(attrs['group-title'] || 'Undefined').split(';').map((g) => g.trim());
      pending = {
        name: name || 'Kanal',
        logo: attrs['tvg-logo'] || '',
        tvgId: attrs['tvg-id'] || '',
        group: groups[0] || 'Undefined'
      };
    } else if (pending && !line.startsWith('#')) {
      if (/^https?:\/\//i.test(line)) out.push({ ...pending, url: line });
      pending = null;
    }
  }
  return out;
}

function qualityOf(name, url) {
  const blob = `${name} ${url}`;
  if (/2160|4K/i.test(blob)) return '4K';
  if (/1440/i.test(blob)) return '1440p';
  if (/1080/i.test(blob)) return '1080p FHD';
  if (/720/i.test(blob)) return '720p HD';
  if (/576|480/i.test(blob)) return 'SD';
  return 'HD';
}

function cleanName(name) {
  return String(name || '')
    .replace(/\s*\(\d+p\)|\s*\[Not 24\/7\]|\s*\[Geo-blocked\]|\s*\(Turkiye\)/gi, '')
    .trim();
}

const ADULT_RE = /(porn|porno|erotik|erotic|adult|xxx|[^a-z]sex[^a-z]|playboy|babes|brazzers|\+18|18\+|gece\s*kusa|fantasy\s*xxx)/i;

// Turkce olmayan / yabanci yayinlar (isim icerigiyle eslesir)
const NON_TR_NAMES = [
  'almahriah', 'al-rafidain', 'al-zahra', 'mekameleen', 'elsharq',
  'qaf tv', 'luys tv', 'aras tv', 'persiana', 'rtg int', 'alvin channel',
  '4u tv', 'bein'
];

function isUnwanted(name, url) {
  const blob = `${name} ${url}`;
  if (ADULT_RE.test(blob)) return true;
  // Calismayan / bolge kilitli isaretliler
  if (/\[not 24\/7\]|\[geo-blocked\]/i.test(name)) return true;
  const low = String(name || '').toLowerCase();
  // Not: Turkce locale I->ı yapar (beIN->beın), o yuzden ASCII kucultme.
  return NON_TR_NAMES.some((n) => low.includes(n));
}

export function proxiedLogo(url) {
  if (!url || /^\/(tv-logos|assets)\//.test(url) || url.startsWith('data:')) return url;
  if (!/^https?:\/\//i.test(url)) return url;
  return `/api/img_proxy?url=${encodeURIComponent(url)}`;
}

export function toLiveChannels(rawList) {
  const out = [];
  let i = 0;
  for (const c of rawList || []) {
    if (!c || !c.url || !c.url.startsWith('http')) continue;
    const name = cleanName(c.name);
    if (!name || isUnwanted(name, c.url)) continue;
    out.push({
      id: `iptv_${i++}`,
      name,
      logo: resolveLocalLogo(name) || proxiedLogo(c.logo),
      tvgId: c.tvgId || '',
      group: c.group || '',
      category: GROUP_MAP[c.group] || 'canlitv',
      streamUrl: c.url,
      quality: qualityOf(c.name, c.url),
      iptvOrg: true
    });
  }
  return out;
}

// "Tumu" sirasinda Turkiye izlenme sirasina gore editor siralamasi
// (canli reyting verisi degil; genel bilinirlik + ulusal once).
const POPULARITY_RANK = [
  'trt1', 'atv', 'showtv', 'kanald', 'startv', 'nowtv', 'tv8', 'kanal7',
  'trtspor', 'aspor', 'trthaber', 'cnnturk', 'ntv', 'haberturk', 'ahaber',
  'halktv', 'tele1', 'showturk', 'eurod', 'teve2', 'tv360',
  'trtbelgesel', 'tgrthaber', 'tgrtbelgesel', 'beyaztv', 'tv85'
];
function rankOf(name) {
  const n = normalizeCanliNameLocal(name);
  const idx = POPULARITY_RANK.findIndex((r) => n === r || n.startsWith(r));
  return idx === -1 ? 999 : idx;
}

function normalizeCanliNameLocal(name) {
  return String(name || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/[^a-zçğıöşü0-9]/g, '');
}

// Yerel logo dosyalari (/tv-logos/*, %100 guvenilir) — isim eslesirse
// uzak logodan once bunlar kullanilir.
const LOCAL_LOGO_BASE = '/tv-logos/';
const LOCAL_LOGO_MAP = {
  trt1: 'trt-1.png', atv: 'atv.png', showtv: 'show-tv.png', nowtv: 'now-tv.png',
  startv: 'star-tv.png', kanald: 'kanal-d.png', tv8: 'tv8.png', cnbce: 'cnbc-e.png',
  a2: 'a2.png', kanal7: 'kanal-7.png', beyaztv: 'beyaz-tv.png', teve2: 'teve2.png',
  tv360: 'tv-360.png', ahaber: 'a-haber.png', aspor: 'a-spor.png', ntv: 'ntv.png',
  haberturk: 'haberturk.png', halktv: 'halk-tv.png', tele1: 'tele1.png',
  tv100: 'tv100.png', bloomberght: 'bloomberg-ht.png', tv24: 'tv24.png',
  ulketv: 'ulke-tv.png', trtspor: 'trt-spor.png', trtsporyildiz: 'trt-spor-yildiz.png',
  trthaber: 'trt-haber.png', trtbelgesel: 'trt-belgesel.png', trtcocuk: 'trt-cocuk.png',
  trtmuzik: 'trt-muzik.png', tlc: 'tlc.png', dmax: 'dmax.png', fbtv: 'fb-tv.png',
  kralpop: 'kral-pop.png', powerturk: 'powerturk.png', minikacocuk: 'minika-cocuk.png',
  minikago: 'minika-go.png', ssport: 's-sport-1.png', ssport1: 's-sport-1.png',
  ssport2: 's-sport-2.png', trtspor2: 'trt-spor-yildiz.png', kanald: 'kanal-d.png',
  showturk: 'show-tv.png', eurod: 'tv-360.png', kanald2: 'kanal-d.png'
};

export function resolveLocalLogo(name) {
  const key = normalizeCanliNameLocal(name);
  const file = LOCAL_LOGO_MAP[key];
  return file ? LOCAL_LOGO_BASE + file : '';
}

export function getCachedIptvChannels() {
  return readCache() || [];
}

export function sortByPopularity(channels) {
  return [...(channels || [])].sort((a, b) => {
    const ra = rankOf(a.name);
    const rb = rankOf(b.name);
    if (ra !== rb) return ra - rb;
    return String(a.name || '').localeCompare(String(b.name || ''), 'tr');
  });
}

export async function refreshIptvChannels() {
  // GitHub raw CORS acik (ACAO:*), direkt cek; olmazsa proxy.
  let text = '';
  try {
    const res = await fetch(LIST_URL, { signal: AbortSignal.timeout(20000) }).catch(() => null);
    if (res && res.ok) text = await res.text().catch(() => '');
  } catch (_) {}
  if (!text || !text.includes('#EXTINF')) {
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(LIST_URL)}`;
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(20000) }).catch(() => null);
      if (res && res.ok) text = await res.text().catch(() => '');
    } catch (_) {}
  }
  const parsed = parseIptvOrg(text);
  if (parsed.length === 0) return null;
  writeCache(parsed);
  return parsed;
}

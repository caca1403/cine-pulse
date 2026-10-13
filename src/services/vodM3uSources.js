/* ==========================================================================
   CinePulse — toplu film (VOD) M3U kaynaklari

   GitHub raw'da duran iki katalog:
     jetfilm   (6683 kayit)  https://raw.githubusercontent.com/patr0nq/flmS/...
     filmmodu  (9874 kayit)
   Bunlar CANLI YAYIN DEGIL; tekil film dosyalari (pixeldrain/imgsapi).
   Bu yuzden Canlı TV listesine KARIŞTIRILMAZ — film katalogu olarak kullanilir.

   #EXTVLCOPT ile gelen http-referrer / http-user-agent bilgileri KORUNUR:
   Bu basliklar olmadan cogu baglanti 403 donuyor. Tarayici bunlari forbidden
   header oldugu icdi gonderemez; bu yuzden yayin URL'ine &ua= &ref= olarak
   eklenir ve /api/hls_proxy uzerinden oynatilir.
   ========================================================================== */

import { apiUrl, isLocalDevHost } from './apiOrigin.js';

export const VOD_M3U_SOURCES = [
  { id: 'jetfilm', label: 'Pulsar 1', kinds: ['film'],
    url: 'https://raw.githubusercontent.com/patr0nq/flmS/refs/heads/main/jetfilm_tum.m3u' },
  { id: 'filmmodu', label: 'Pulsar 2', kinds: ['film'],
    url: 'https://raw.githubusercontent.com/patr0nq/flmS/refs/heads/main/filmmodu_tum.m3u' },
  // Depoda şu an boş (8 bayt, yalnızca "#EXTM3U"). Yine de kayıtlı tutuluyor:
  // sahibi doldurduğu anda kod değişmeden otomatik çalışmaya başlar.
  { id: 'filmmakinesi', label: 'Pulsar 3', kinds: ['film'],
    url: 'https://raw.githubusercontent.com/patr0nq/flmS/refs/heads/main/filmmakinesi_tum.m3u' },
  { id: 'fhdfi', label: 'Pulsar 4', kinds: ['film'],
    url: 'https://raw.githubusercontent.com/patr0nq/flmS/refs/heads/main/fhdfi_tum.m3u' }
];

// DİZİ notu: Bu M3U dosyalarının içinde yalnızca film türleri var
// (Aksiyon / Aile / Animasyon / 4K Filmler). Dizi tarafı jetfilm sitesinin
// kendi /diziler sayfasından geliyor ve zaten 'jet' eklentisinde çalışıyor.

const LS_KEY = 'cp_vod_m3u_v1';
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const PARSE_CACHE = new Map();

function endpoint() {
  if (typeof window !== 'undefined' && isLocalDevHost()) return '/api/live_sources?src=all';
  return apiUrl('/api/live_sources?src=all');
}

function readStore() {
  try {
    const p = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    return p && typeof p === 'object' ? p : {};
  } catch (_) {
    return {};
  }
}

function writeStore(id, entry) {
  try {
    const s = readStore();
    s[id] = entry;
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch (_) {}
}

export function getCachedVodSource(id) {
  const e = readStore()[id];
  if (!e || !Array.isArray(e.items) || !e.items.length) return null;
  return { id, items: e.items, savedAt: e.savedAt };
}

export function getAllCachedVodItems() {
  return VOD_M3U_SOURCES.flatMap((s) => getCachedVodSource(s.id)?.items || []);
}

/** M3U metnini film kayitlarina cevirir. */
export function parseVodM3u(text) {
  const out = [];
  if (!text || !text.includes('#EXTINF')) return out;
  let name = '';
  let logo = '';
  let group = '';
  let ua = '';
  let ref = '';
  const seen = new Set();
  for (const raw of String(text).split(/\r?\n/)) {
    const line = (raw || '').trim();
    if (!line) continue;
    if (line.startsWith('#EXTINF')) {
      const attrs = {};
      const re = /([\w-]+)="([^"]*)"/g;
      let m;
      while ((m = re.exec(line))) attrs[m[1].toLowerCase()] = m[2];
      const dequoted = line.replace(/"[^"]*"/g, '""');
      name = (dequoted.split(',').slice(1).join(',') || '').trim();
      logo = attrs['tvg-logo'] || '';
      group = attrs['group-title'] || '';
      ua = '';
      ref = '';
    } else if (line.toUpperCase().startsWith('#EXTVLCOPT:')) {
      const kv = line.slice(11);
      const eq = kv.indexOf('=');
      if (eq > 0) {
        const k = kv.slice(0, eq).trim().toLowerCase();
        const v = kv.slice(eq + 1).trim();
        if (k === 'http-user-agent') ua = v;
        else if (k === 'http-referrer' || k === 'http-referer') ref = v;
      }
    } else if (!line.startsWith('#') && /^https?:\/\//i.test(line)) {
      // Başlıktaki kalite parantezini at: "Finestkind (Türkçe Altyazılı - 2160p)"
      const clean = name.replace(/\s*\([^)]*\)\s*$/, '').trim() || name;
      if (clean && !seen.has(clean.toLocaleLowerCase('tr-TR'))) {
        seen.add(clean.toLocaleLowerCase('tr-TR'));
        out.push({ title: clean, logo, group, url: line, ua, ref });
      }
    }
  }
  return out;
}

/** Bir kaynağın listesini getirir (bellek → ağ). Boş kaynaklar sessizce atlanır. */
export async function loadVodSource(id) {
  const src = VOD_M3U_SOURCES.find((s) => s.id === id);
  if (!src) return [];
  if (PARSE_CACHE.has(id)) return PARSE_CACHE.get(id);

  const cached = getCachedVodSource(id);
  if (cached && Date.now() - (cached.savedAt || 0) < CACHE_TTL_MS) {
    PARSE_CACHE.set(id, cached.items);
    return cached.items;
  }

  // Önce doğrudan GitHub raw (CORS acik, hizli); olmazsa sunucu uzerinden.
  let items = [];
  try {
    const res = await fetch(src.url, { signal: AbortSignal.timeout(35000) });
    if (res.ok) items = parseVodM3u(await res.text());
  } catch (_) {}
  if (!items.length) {
    try {
      const res = await fetch(endpoint(), { signal: AbortSignal.timeout(45000) });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        const s = (data?.sources || []).find((x) => x.id === id);
        items = (s?.channels || []).map((c) => ({
          title: String(c.name || '').replace(/\s*\([^)]*\)\s*$/, '').trim(),
          logo: c.logo || '',
          group: c.group || '',
          url: c.streamUrl,
          ua: c.headers?.ua || '',
          ref: c.headers?.ref || ''
        }));
      }
    } catch (_) {}
  }
  if (!items.length) {
    const prev = getCachedVodSource(id);
    if (prev) return prev.items;
    return [];
  }
  writeStore(id, { items, savedAt: Date.now() });
  PARSE_CACHE.set(id, items);
  return items;
}

function norm(s) {
  return String(s || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/\b(izle|full|hd|türkçe|altyazılı|dublaj|1080p|720p|480p|2160p|4k)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, '');
}

// Başlıktaki yılı ayır: katalogda yıl varsa eşleşmeyi güçlendirir
// ("Barbie (2023)" ile "Barbie ve Stacie" birbirine karışmasın).
function yilOf(title) {
  return (String(title || '').match(/(19|20)\d{2}/) || [null])[0];
}

/**
 * Film arar.
 *
 * Önceden sadece `includes` bakılıyordu; bu yüzden "Barbie" aramasında
 * "Barbie: Fındıkkıran Balesinde" ve "Barbie and Stacie to the Rescue"
 * gibi TAMAMEN FARKLI filmler dönüyordu. Şimdi:
 *   - birebir aynı ad        → en yüksek puan
 *   - yıl da tutuyorsa       → güçlü eşleşme
 *   - sadece kelime içerirse  → düşük puan ve sona atılır
 */
export async function searchVodMovie(query, year = null) {
  const q = norm(query);
  if (!q) return [];
  const all = getAllCachedVodItems();
  const pool = all.length ? all : (await Promise.all(VOD_M3U_SOURCES.map((s) => loadVodSource(s.id)))).flat();

  const istenenYil = year || yilOf(query);
  const skorlu = [];
  for (const it of pool) {
    const n = norm(it.title);
    if (!n || !n.includes(q)) continue;

    // Uzun başlıklar genelde BAŞKA filmlerdir: "Barbie" aramasında
    // "Barbie: Fındıkkıran Balesinde", "Barbie and Stacie to the Rescue"
    // gibi tamamen alakasız kayıtlar geliyordu. Sorgu adı kadar uzun
    // olmayan başlıkları eliyoruz.
    const tolerans = q.length * 1.8 + 10;
    if (n !== q && n.length > tolerans) continue;

    let puan;
    if (n === q) puan = 100;
    else if (n.startsWith(q)) puan = 70;
    else puan = 40;
    // Aranan yıl belliyse yalnızca o yılı kabul et; değilse yılı olan
    // kayıtları öne al (yılsız katalog girdileri geride kalsın).
    if (istenenYil) {
      const y = yilOf(it.title);
      if (y === istenenYil) puan += 60;
      else if (y) continue;
      else puan -= 15;
    } else if (yilOf(it.title)) {
      puan += 10;
    }
    skorlu.push({ it, puan });
  }

  skorlu.sort((a, b) => b.puan - a.puan);
  return skorlu.slice(0, 30).map(({ it }) => ({
    id: it.title,
    title: it.title,
    poster: it.logo,
    type: 'movie',
    year: yilOf(it.title),
    _vod: it
  }));
}

/** Bulunan filmi oynatılabilir yayına çevirir. */
export async function fetchVodSources({ title = '', titles = [], year = null } = {}) {
  const cands = [...new Set([...titles, title].filter(Boolean))];
  for (const c of cands) {
    // Yıl birlikte veriliyorsa aynı yılın kaydı tercih edilir; katalogdaki
    // benzer adlı farklı filmler elenir.
    const found = await searchVodMovie(c, year);
    if (found.length) {
      return found.slice(0, 8).map((it, i) => {
        const v = it._vod;
        let url = `/api/hls_proxy?url=${encodeURIComponent(v.url)}&live=1`;
        if (v.ref) url += `&ref=${encodeURIComponent(v.ref)}`;
        if (v.ua) url += `&ua=${encodeURIComponent(v.ua)}`;
        return {
          id: `vod_${i}_${it.id}`,
          title: `${it.title} (${v.group || 'VOD'})`,
          displayName: it.title,
          badge: '🎬 VOD dosya',
          source: 'vod-m3u',
          type: 'direct',
          category: 'dubbed',
          url,
          streamUrl: url,
          rawStreamUrl: v.url,
          quality: /2160|4K/i.test(v.title) ? '4K' : '1080p',
          isDirectFile: true
        };
      });
    }
  }
  return [];
}
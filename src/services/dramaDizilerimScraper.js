/* ==========================================================================
   CinePulse Studio - DramaDizilerim Scraper (Kısa Dizi / Short Drama VIP)
   Extracts Turkish Dubbed & Subtitled Short Dramas (FlexTV, NetShort, DramaBox, etc.)
   Features 100% CORS-Free Direct 1080p HLS Streams & Multi-audio support.
   ========================================================================== */

const BASE_URL = 'https://dramadizilerim.com';
const PLAYER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function toTurkishSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/* ── Kimlik kapısı ("2000 se 2000") ─────────────────────────────────────────
   Kısa dizi markaları kısa adlar taşır (Kral, Aşk, Bad, Lulu…); aramanın
   kırpık/İÇEREN (substring) eşleşmeleri NORMAL dizi sorgularında başka
   yapımın bölümlerini döndürüyordu (canlı ölçüm 2026-10: q=Kral → 48 kart:
   "Kraliçenin Kanı", "Kralın Hekim Gelini"… → "Kral" hedefinde yanlış
   eşleşme). YIL KAPISI: canlı ölçümde kart/search HTML'inde hiçbir yıl
   alanı yok (ld+json genel şablon; year|yayın tarihi 0 isabet), alt yazı
   enjeksiyonu da içermiyor → kaynak yıl taşımıyorsa tek güvenli kapı
   birebir başlıktır. Substring/inner eşleşme her halükârda YETERLİ değildir. */

const IDENTITY_NOISE = new Set([
  'hd', 'full', 'vip', 'izle', 'seyret', 'film', 'dizi', 'anime', 'turkce',
  'dublaj', 'dublajli', 'dublaji', 'altyazili', 'altyazi', 'sezon', 'bolum',
  'fragman', 'filmi', 'dizisi'
]);

/** Türkçe karakter duyarsız, noktalama→boşluk, çoklu boşluk→tek, gürültü
 *  kelimeler atılmış tam eşleştirme anahtarı. */
export function identityKey(value) {
  if (!value) return '';
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[ğüşıöçĞÜŞİÖÇ]/g, ch => ({
      ğ: 'g', ü: 'u', ş: 's', ı: 'i', ö: 'o', ç: 'c',
      Ğ: 'g', Ü: 'u', Ş: 's', İ: 'i', Ö: 'o', Ç: 'c'
    }[ch]))
    .replace(/['’ʼ`]/g, '')          // kesme işareti kelimeyi bölmez: Kraliçe'nin ≡ Kralicenin
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    // Tek harf ek artıkları ("Aşk-ı" → "i") ve yıl süsleri anahtar dışında;
    // yıl doğrulaması ±1 kuralıyla shortDramaIdentityMatch içinde yapılır.
    .filter(w => w && w.length > 1 && !IDENTITY_NOISE.has(w) && !/^(?:19|20)\d{2}$/.test(w))
    .join(' ');
}

/** Başlık/metni içindeki 19xx/20xx yılı (kaynak yıl alanı yaymıyorsa null). */
export function extractYearFromText(value) {
  const m = String(value || '').match(/\b(?:19|20)\d{2}\b/);
  return m ? parseInt(m[0], 10) : null;
}

/** KAPI: normalize TAM eşleşme şart; hedef yılı biliniyorsa adayda yıl
 *  varsa ±1 içinde olmalı (kaynakta yıl alanı olmadığı için adayda yıl
 *  yoksa birebir başlık eşleşmesi tek geçerli kapı olarak kalır). */
export function shortDramaIdentityMatch(candidate, targetTitles, targetYear = null) {
  const candKey = identityKey(candidate);
  if (!candKey) return false;
  const titles = (Array.isArray(targetTitles) ? targetTitles : [targetTitles]).filter(Boolean);
  const candYear = extractYearFromText(candidate);
  // Yıl hedefte bilinuyorsa (parametre veya hedef başlığındaki yıl) adayda
  // yıl varsa ±1 içinde olmalı; adayda yıl yoksa kaynak yıl alanı
  // taşımadığından (canlı ölçüm) birebir başlık tek geçerli kapıdır.
  const knownYears = [Number(targetYear) || null, ...titles.map(extractYearFromText)].filter(Boolean);
  if (candYear && knownYears.length && !knownYears.some(y => Math.abs(candYear - y) <= 1)) return false;
  return titles.some(t => identityKey(t) === candKey);
}

async function fetchSafe(pathUrl, options = {}) {
  const isBrowser = typeof window !== 'undefined';
  let targetUrl = pathUrl;

  if (isBrowser) {
    if (pathUrl.startsWith('http')) {
      try {
        const u = new URL(pathUrl);
        targetUrl = `/api/ddz${u.pathname}${u.search}`;
      } catch (_) {
        targetUrl = pathUrl;
      }
    } else {
      targetUrl = `/api/ddz${pathUrl.startsWith('/') ? '' : '/'}${pathUrl}`;
    }
  } else {
    if (!targetUrl.startsWith('http')) {
      targetUrl = `${BASE_URL}${targetUrl.startsWith('/') ? '' : '/'}${targetUrl}`;
    }
  }

  try {
    const res = await fetch(targetUrl, {
      ...options,
      headers: {
        'User-Agent': PLAYER_UA,
        'Referer': BASE_URL,
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(options.timeout || 6000)
    }).catch(() => null);

    if (res && res.ok) return res;
  } catch (_) {}

  return null;
}

export function extractCleanImageUrl(raw) {
  if (!raw) return '';
  try {
    if (raw.includes('image_proxy.php?url=')) {
      const match = raw.match(/url=([^&]+)/);
      if (match) {
        return decodeURIComponent(match[1]);
      }
    }
  } catch (_) {}
  return raw;
}

function cleanDramaTitle(rawTitle, fallback = '') {
  if (!rawTitle) return fallback;
  return rawTitle
    .replace(/<[^>]+>/g, '')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+poster$/i, '')
    .trim();
}

/**
 * Searches DramaDizilerim for candidate short dramas.
 * The site paginates search results, so `page` selects which result page to read.
 */
export async function searchDramaDizilerim(query, page = 1) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];

  const cleanQuery = query.trim();
  const pageNumber = Math.max(1, Number(page) || 1);
  const searchPath = `/search?q=${encodeURIComponent(cleanQuery)}${pageNumber > 1 ? `&page=${pageNumber}` : ''}`;
  const res = await fetchSafe(searchPath, { timeout: pageNumber > 1 ? 11000 : 6000 });
  if (!res) {
    if (pageNumber > 1) throw new Error(`Arama sonuçları yüklenemedi (sayfa ${pageNumber})`);
    return [];
  }

  const html = await res.text().catch(() => '');
  if (!html) return [];

  const results = [];
  const cardRegex = /<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = cardRegex.exec(html)) !== null) {
    const slug = match[1];
    const inner = match[2];
    const titleMatch = inner.match(/alt=["']([^"']+)["']/i) || inner.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i);
    const title = cleanDramaTitle(titleMatch ? titleMatch[1] : null, slug);
    const imgMatch = inner.match(/src=["']([^"']+)["']/i);
    const poster = imgMatch ? extractCleanImageUrl(imgMatch[1].replace(/&amp;/g, '&')) : '';
    const isDubbed = title.toLowerCase().includes('dublaj');

    if (!results.some(r => r.slug === slug)) {
      results.push({
        title,
        slug,
        poster,
        isDubbed,
        url: `${BASE_URL}/dizi/${slug}`
      });
    }
  }

  return results;
}

/**
 * Fetches trending dramas from frontpage
 */
export async function fetchTrendingDramas() {
  const res = await fetchSafe('/');
  if (!res) return [];

  const html = await res.text().catch(() => '');
  if (!html) return [];

  const cards = [];
  const cardRegex = /<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = cardRegex.exec(html)) !== null) {
    const slug = match[1];
    const inner = match[2];
    const imgMatch = inner.match(/src=["']([^"']+)["']/i);
    const titleMatch = inner.match(/alt=["']([^"']+)["']/i) || inner.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i);
    const title = cleanDramaTitle(titleMatch ? titleMatch[1] : null, slug);
    const poster = imgMatch ? extractCleanImageUrl(imgMatch[1].replace(/&amp;/g, '&')) : '';
    const isDubbed = title.toLowerCase().includes('dublaj');

    if (!cards.some(c => c.slug === slug)) {
      cards.push({
        slug,
        title,
        poster,
        isDubbed,
        badge: isDubbed ? '🇹🇷 DUBLAJ' : 'TR ALTYAZI',
        url: `${BASE_URL}/dizi/${slug}`
      });
    }
  }

  return cards;
}

/**
 * Fetches drama catalog with pagination and optional query
 */
export async function fetchDramaCatalog({ page = 1, query = '' } = {}) {
  if (query && query.trim().length >= 2) {
    return searchDramaDizilerim(query, page);
  }

  const path = `/dizi?page=${page}`;
  const res = await fetchSafe(path, { timeout: 11000 });
  if (!res) throw new Error(`Kısa dizi kataloğu yüklenemedi (sayfa ${page})`);

  const html = await res.text().catch(() => '');
  if (!html) return [];

  const cards = [];
  const cardRegex = /<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = cardRegex.exec(html)) !== null) {
    const slug = match[1];
    const inner = match[2];
    const imgMatch = inner.match(/src=["']([^"']+)["']/i);
    const titleMatch = inner.match(/alt=["']([^"']+)["']/i) || inner.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i);
    const title = cleanDramaTitle(titleMatch ? titleMatch[1] : null, slug);
    const poster = imgMatch ? extractCleanImageUrl(imgMatch[1].replace(/&amp;/g, '&')) : '';
    const isDubbed = title.toLowerCase().includes('dublaj');

    if (!cards.some(c => c.slug === slug)) {
      cards.push({
        slug,
        title,
        poster,
        isDubbed,
        badge: isDubbed ? '🇹🇷 DUBLAJ' : 'TR ALTYAZI',
        url: `${BASE_URL}/dizi/${slug}`
      });
    }
  }

  return cards;
}

/**
 * Fetches drama detail page, synopsis, and episode list
 */
export async function fetchDramaDetails(slug) {
  if (!slug) return null;

  const res = await fetchSafe(`/dizi/${slug}`);
  if (!res) return null;

  const html = await res.text().catch(() => '');
  if (!html) return null;

  const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const title = cleanDramaTitle(titleMatch ? titleMatch[1] : null, slug);

  // Extract complete, untruncated drama synopsis
  let description = '';
  const pMatches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  const candidateParagraphs = pMatches
    .map(m => m[1].replace(/<[^>]+>/g, '').replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim())
    .filter(text => {
      if (text.length < 25) return false;
      const lower = text.toLowerCase();
      if (
        lower.includes('çerez') ||
        lower.includes('cookie') ||
        lower.includes('reklam') ||
        lower.includes('tüm hakları') ||
        lower.includes('bildirim') ||
        lower.includes('yapay zeka') ||
        lower.includes('bize bildirin') ||
        lower.includes('aradığınız dizi')
      ) {
        return false;
      }
      return true;
    });

  if (candidateParagraphs.length > 0) {
    // Sort by length to pick the most informative synopsis paragraph
    candidateParagraphs.sort((a, b) => b.length - a.length);
    description = candidateParagraphs[0];
  }

  if (!description || description.length < 25) {
    const metaDesc = html.match(/<meta\s+(?:property=["']og:description["']|name=["']description["'])\s+content=["']([^"']+)["']/i) ||
                     html.match(/<meta\s+content=["']([^"']+)["']\s+(?:property=["']og:description["']|name=["']description["'])/i);
    if (metaDesc && metaDesc[1] && metaDesc[1].trim().length > 15) {
      const cleanMeta = metaDesc[1].replace(/<[^>]+>/g, '').replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();
      if (!cleanMeta.toLowerCase().includes('aradığınız dizi')) {
        description = cleanMeta;
      }
    }
  }

  if (!description || description.includes('Bu dizi için konu özeti henüz eklenmedi')) {
    description = `${title} - Tüm bölümleri yüksek kalitede, kesintisiz ve donmadan Türkçe dublaj ve altyazı seçenekleriyle CinePulse Kısa Dizi Evreni'nde izleyin.`;
  }

  const posterMatch = html.match(/<div class=["'][^"']*poster[^"']*["'][^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["']/i) ||
                      html.match(/<img[^>]+class=["'][^"']*spotlight[^"']*["'][^>]+src=["']([^"']+)["']/i);
  const poster = posterMatch ? extractCleanImageUrl(posterMatch[1].replace(/&amp;/g, '&')) : '';

  const epRegex = /<a[^>]+href=["'](?:\/izle\/|https:\/\/dramadizilerim\.com\/izle\/)([a-zA-Z0-9_-]+)\?s=(\d+)&e=(\d+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const episodes = [];
  let epMatch;

  while ((epMatch = epRegex.exec(html)) !== null) {
    const s = parseInt(epMatch[2], 10) || 1;
    const e = parseInt(epMatch[3], 10) || 1;
    const inner = epMatch[4];
    const epTitleMatch = inner.match(/class=["']wp-enum["']>([^<]+)</i) || inner.match(/alt=["']([^"']+)["']/i);
    const epTitle = epTitleMatch ? epTitleMatch[1].trim() : `Bölüm ${e}`;
    const thumbMatch = inner.match(/src=["']([^"']+)["']/i);
    const thumb = thumbMatch ? extractCleanImageUrl(thumbMatch[1].replace(/&amp;/g, '&')) : '';

    if (!episodes.some(ep => ep.season === s && ep.episode === e)) {
      episodes.push({ season: s, episode: e, title: epTitle, thumb });
    }
  }

  // Sort episodes by season and episode number
  episodes.sort((a, b) => (a.season - b.season) || (a.episode - b.episode));

  return {
    slug,
    title,
    poster,
    description,
    isDubbed: title.toLowerCase().includes('dublaj'),
    totalEpisodes: episodes.length,
    episodes
  };
}

/**
 * Directly extracts direct HLS stream for a drama episode
 */
export async function fetchDramaEpisodeStream(slug, season = 1, episode = 1) {
  const watchPath = `/izle/${slug}?s=${season}&e=${episode}`;
  const watchRes = await fetchSafe(watchPath);
  if (!watchRes) return null;

  const watchHtml = await watchRes.text().catch(() => '');
  if (!watchHtml) return null;

  const embedMatch = watchHtml.match(/(?:data-src|src)=["']([^"']*embed\.php[^"']*)["']/i);
  if (!embedMatch) return null;

  let embedUrl = embedMatch[1].replace(/&amp;/g, '&');
  if (!embedUrl.startsWith('http')) {
    embedUrl = `${BASE_URL}${embedUrl.startsWith('/') ? '' : '/'}${embedUrl}`;
  }

  const embedRes = await fetchSafe(embedUrl, {
    headers: { 'Referer': `${BASE_URL}${watchPath}` }
  });
  if (!embedRes) return null;

  const embedHtml = await embedRes.text().catch(() => '');
  if (!embedHtml) return null;

  const sourceMatch = embedHtml.match(/let\s+source\s*=\s*["']([^"']+)["']/);
  let rawUrl = (sourceMatch && sourceMatch[1].startsWith('http')) ? sourceMatch[1] : null;

  if (!rawUrl) {
    const directMedia = embedHtml.match(/https?:\/\/[^"'\s\\]+\.(?:m3u8|mp4)[^"'\s\\]*/);
    if (directMedia) rawUrl = directMedia[0];
  }

  if (rawUrl) {
    return {
      streamUrl: rawUrl,
      isHls: rawUrl.includes('.m3u8') || rawUrl.includes('mpegurl')
    };
  }

  return null;
}

/* ── Altyazı (kit.js "5. Altyazı" sözleşmesiyle birebir aynı şekil) ─────────
   Canlı ölçüm (2026-10, 4 bölüm / 3 marka dramabox+netshort+reelshort): bu
   sitede altyazı kanalının TEK kaynağı embed.php'nin sunucu-tarafı
   `window._captionUrl` enjeksiyonudur; örneklerin tamamında boş kaldı
   (sunucu teşhis yorumu: "[DEBUG-SUB] netshortSubtitles count: 0" /
   "first subtitle url: NONE") ve dönen m3u8'lerde #EXT-X-MEDIA:TYPE=SUBTITLES
   grubu yok — altyazılar videoya gömülü (hardsub). ESKİ ARIZA: scraper hiç
   `subtitles` üretmiyordu; oynatıcı da sahte/ölü bir tek-altyazı şeridi
   gösteriyordu ("altyazılar çalışmıyor"). KURAL: erişilemeyen veya HTML
   dönen altyazı ASLA listelenmez — ya gerçekten WebVTT/SRT dönen uç eklenir
   ya da alan boş bırakılır (ölü kaynak yok). */

/** embed.php HTML'inden `window._captionUrl/_captionLabel/_captionLang`
 *  üçlüsünü kit.js `tracksAltyazilari` sözleşmesiyle çıkarır (url+src+label+
 *  language+headers), göreli adresi mutlaklaştırır. Boş/eksikse []. */
export function extractCaptionTracks(embedHtml) {
  const html = String(embedHtml || '');
  const raw = html.match(/window\._captionUrl\s*=\s*["']([^"']*)["']/);
  if (!raw || !raw[1].trim()) return [];
  let url = raw[1].trim();
  if (url.startsWith('//')) url = 'https:' + url;
  else if (!/^https?:\/\//i.test(url)) url = `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  const label = (html.match(/window\._captionLabel\s*=\s*["']([^"']*)["']/) || [])[1] || 'Türkçe';
  const language = (html.match(/window\._captionLang\s*=\s*["']([^"']*)["']/) || [])[1] || 'tr';
  return [{
    url,
    src: url,
    label,
    language,
    headers: { Referer: `${BASE_URL}/`, 'User-Agent': PLAYER_UA, Accept: '*/*' }
  }];
}

/** Gerçek WebVTT/SRT mi? (HTML/XML/kimlik-avı yanıtlarını reddeder.) */
export function looksLikeCaption(text, contentType = '') {
  if (/text\/html/i.test(String(contentType || ''))) return false;
  const head = String(text || '').replace(/^\uFEFF/, '').trimStart().slice(0, 4000);
  if (!head || /^\s*(?:<!doctype|<html|<\?xml|<script)/i.test(head)) return false;
  if (/^WEBVTT/i.test(head)) return true;
  return /\d{2}:\d{2}:\d{2}[.,]\d{3}\s*-->/.test(head);
}

/** Canlı doğrulama: yalnız gerçekten VTT/SRT dönen uçları listeler. */
async function verifyCaptionTracks(tracks) {
  const alive = [];
  for (const track of tracks || []) {
    const res = await fetchSafe(track.url, { headers: track.headers, timeout: 7000 }).catch(() => null);
    if (!res || !res.ok) continue;
    const ct = (typeof res.headers?.get === 'function' ? res.headers.get('content-type') : '') || '';
    const body = await res.text().catch(() => '');
    if (looksLikeCaption(body, ct)) alive.push(track);
  }
  return alive;
}

/**
 * Extracts direct HLS / MP4 stream from DramaDizilerim for a given series and episode
 */
export async function fetchDramaDizilerimEpisodeSources({
  titles = [],
  seriesTitle = '',
  title = '',
  originalTitle = '',
  year = null,
  season = 1,
  episode = 1,
  isDub = true
} = {}) {
  const allTitles = [...new Set([...titles, seriesTitle, title, originalTitle])]
    .filter(t => t && typeof t === 'string' && t.trim().length > 1);
  if (allTitles.length === 0) return [];

  const targetYear = Number(year) || null;
  const seasonNum = parseInt(season, 10) || 1;
  const episodeNum = parseInt(episode, 10) || 1;

  let matchedSlug = null;
  let matchedItem = null;

  // 1. Direct slug test — site bilinmeyen slug'larda 404 dönüyor (ölçüldü),
  //    yayın sayfası başlığı aşağıda ayrıca kimlik denetiminden geçer.
  for (const t of allTitles) {
    const s = toTurkishSlug(t);
    if (!s) continue;
    const testPath = `/izle/${s}?s=${seasonNum}&e=${episodeNum}`;
    const headCheck = await fetchSafe(testPath, { method: 'HEAD', timeout: 3500 });
    if (headCheck && headCheck.ok) {
      matchedSlug = s;
      break;
    }
  }

  // 2. Search by titles if direct slug didn't match — KAPI: normalize tam
  //    eşleşme şart. Eski 0.75 benzerlik eşiği ve içeren/içerilen (substring)
  //    yedek eşleştirme kaldırıldı; kısa dizi markaları kısa ad taşıdığı için
  //    substring NORMAL dizi sorgularında başka yapımı döndürüyordu.
  if (!matchedSlug) {
    for (const t of allTitles) {
      const searchResults = await searchDramaDizilerim(t);
      const best = searchResults.find(r =>
        shortDramaIdentityMatch(r.title, allTitles, targetYear) ||
        (!!identityKey(r.slug) && allTitles.some(x => identityKey(x) === identityKey(r.slug)))
      );
      if (best) {
        matchedSlug = best.slug;
        matchedItem = best;
        break;
      }
    }
  }

  if (!matchedSlug) return [];

  // 3. Fetch watch page
  const watchPath = `/izle/${matchedSlug}?s=${seasonNum}&e=${episodeNum}`;
  const watchRes = await fetchSafe(watchPath);
  if (!watchRes) return [];

  const watchHtml = await watchRes.text().catch(() => '');
  if (!watchHtml) return [];

  // 3b. Kimlik denetimi: izleme sayfasının başlığı ("Ad N. Bölüm Full HD
  //     İzle | Drama Dizilerim") hedefle birebir eşleşmezse tek kaynak bile
  //     listelenmez — "2000 se 2000".
  const watchTitleRaw = (watchHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '';
  const watchTitle = cleanDramaTitle(watchTitleRaw)
    .replace(/\s*\d+\s*\.?\s*(?:b[oö]l[uü]m|sezon)\b[\s\S]*$/i, '')
    .replace(/\s*[|\-–]\s*Drama\s*Dizilerim[\s\S]*$/i, '')
    .trim();
  if (watchTitle && !shortDramaIdentityMatch(watchTitle, allTitles, targetYear)) return [];

  // 4. Extract embed.php URL from data-src or src
  const embedMatch = watchHtml.match(/(?:data-src|src)=["']([^"']*embed\.php[^"']*)["']/i);
  if (!embedMatch) return [];

  let embedUrl = embedMatch[1].replace(/&amp;/g, '&');
  if (!embedUrl.startsWith('http')) {
    embedUrl = `${BASE_URL}${embedUrl.startsWith('/') ? '' : '/'}${embedUrl}`;
  }

  // 5. Fetch embed player HTML
  const embedRes = await fetchSafe(embedUrl, {
    headers: { 'Referer': `${BASE_URL}${watchPath}` }
  });
  if (!embedRes) return [];

  const embedHtml = await embedRes.text().catch(() => '');
  if (!embedHtml) return [];

  const streams = [];

  // 6. Direct let source = "..." stream extraction
  const sourceMatch = embedHtml.match(/let\s+source\s*=\s*["']([^"']+)["']/);
  let rawUrl = (sourceMatch && sourceMatch[1].startsWith('http')) ? sourceMatch[1] : null;

  if (!rawUrl) {
    const directMedia = embedHtml.match(/https?:\/\/[^"'\s\\]+\.(?:m3u8|mp4)[^"'\s\\]*/);
    if (directMedia) rawUrl = directMedia[0];
  }

  if (rawUrl) {
    const isM3U8 = rawUrl.includes('.m3u8') || rawUrl.includes('mpegurl');
    const titleText = (matchedItem?.title || matchedSlug).toLowerCase();
    const sourceIsDub = titleText.includes('dublaj') || isDub === true;

    const label = sourceIsDub
      ? `🇹🇷 DDZ VIP S${seasonNum}E${episodeNum} (TR Dublaj)`
      : `⚡ DDZ VIP S${seasonNum}E${episodeNum} (TR Altyazı)`;

    // Yalnız canlı doğrulanmış (gerçek VTT/SRT dönen) altyazılar listelenir;
    // HTML/erişilemez uç hiçbir koşulda altyazı olarak gösterilmez.
    const subtitles = await verifyCaptionTracks(extractCaptionTracks(embedHtml));

    streams.push({
      id: `ddz_ep_${matchedSlug}_${seasonNum}_${episodeNum}`,
      name: label,
      displayName: label,
      badge: '🎭 DDZ VIP',
      source: 'DDZ VIP',
      url: rawUrl,
      streamUrl: rawUrl,
      rawStreamUrl: rawUrl,
      quality: '1080p HD',
      isHls: isM3U8,
      isDirectVideo: true,
      priority: 2,
      subtitles,
      getUrl: () => rawUrl
    });
  }

  return streams;
}

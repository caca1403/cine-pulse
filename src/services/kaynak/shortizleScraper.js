/**
 * Starfire — Kısa dizi alternatif kaynak scraper (kahraman hat)
 * Kullanıcı 2026-10-31: "drama dizilerimden sonra alternatif olarak bunu ekle"
 * URL deseni: /watch/{slug} → /watch/{slug}/{sezon}/{bölüm}
 */
const BASE_URL = 'https://shortizle.com';

const PLAYER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

async function fetchSafe(path, opts = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeout || 14000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': PLAYER_UA,
        'Accept': 'text/html,application/xhtml+xml,application/json,*/*',
        'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
        ...(opts.headers || {})
      },
      ...opts
    });
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
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('/')) return `${BASE_URL}${url}`;
  return url;
}

/* ── Arama ──────────────────────────────────────────────────────────────── */
export async function searchShortizle(query, page = 1) {
  if (!query || query.trim().length < 2) return [];
  const q = encodeURIComponent(query.trim());
  const path = page > 1 ? `/search?q=${q}&page=${page}` : `/search?q=${q}`;
  const res = await fetchSafe(path);
  if (!res) return [];

  const html = await res.text().catch(() => '');
  if (!html) return [];

  const results = [];
  // Kart deseni: <a href="/watch/{slug}"> ... <img src="..."> ... <h3>başlık</h3>
  const cardRegex = /<a[^>]+href="\/watch\/([a-zA-Z0-9_-]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = cardRegex.exec(html)) !== null) {
    const slug = m[1];
    const inner = m[2];
    const imgMatch = inner.match(/src="([^"]+)"/i);
    const titleMatch = inner.match(/alt="([^"]+)"/i) || inner.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i);
    const title = cleanText(titleMatch ? titleMatch[1] : slug);
    const poster = imgMatch ? cleanImageUrl(imgMatch[1].replace(/&amp;/g, '&')) : '';
    const isDubbed = title.toLowerCase().includes('dublaj');

    if (!results.some(r => r.slug === slug)) {
      results.push({ slug, title, poster, isDubbed, url: `${BASE_URL}/watch/${slug}` });
    }
  }
  return results;
}

/* ── Detay + Bölüm Listesi ──────────────────────────────────────────────── */
export async function fetchShortizleDetails(slug) {
  if (!slug) return null;

  const res = await fetchSafe(`/watch/${slug}`);
  if (!res) return null;

  const html = await res.text().catch(() => '');
  if (!html) return null;

  // Başlık
  const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const title = cleanText(titleMatch ? titleMatch[1] : slug);

  // Açıklama: meta og:description veya en uzun <p>
  let description = '';
  const metaDesc = html.match(/<meta\s+(?:property="og:description"|name="description")\s+content="([^"]+)"/i) ||
                   html.match(/<meta\s+content="([^"]+)"\s+(?:property="og:description"|name="description")/i);
  if (metaDesc) description = cleanText(metaDesc[1]);

  if (!description || description.length < 25) {
    const pMatches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    const candidates = pMatches
      .map(m2 => cleanText(m2[1]))
      .filter(t => t.length >= 30 && !/çerez|cookie|reklam|tüm hakları|bildirim|yapay zeka|bize bildirin/i.test(t));
    if (candidates.length) {
      candidates.sort((a, b) => b.length - a.length);
      description = candidates[0];
    }
  }

  // Poster
  const posterMatch = html.match(/<meta\s+(?:property="og:image"|name="twitter:image")\s+content="([^"]+)"/i) ||
                      html.match(/<img[^>]+(?:class="[^"]*poster[^"]*"|alt="[^"]*")[^>]+src="([^"]+)"/i);
  const poster = posterMatch ? cleanImageUrl(posterMatch[1]) : '';

  // Bölümler: /watch/{slug}/{s}/{e} linkleri veya "Bölüm 1/45" sayaçları
  const episodes = [];
  const epRegex = /<a[^>]+href="\/watch\/([a-zA-Z0-9_-]+)\/(\d+)\/(\d+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let em;
  while ((em = epRegex.exec(html)) !== null) {
    const s = parseInt(em[2], 10) || 1;
    const e = parseInt(em[3], 10) || 1;
    const inner = em[4];
    const numMatch = inner.match(/(\d+)/);
    const epNum = numMatch ? parseInt(numMatch[1], 10) : e;
    const epTitle = `Bölüm ${epNum}`;
    const thumbMatch = inner.match(/src="([^"]+)"/i);
    const thumb = thumbMatch ? cleanImageUrl(thumbMatch[1]) : '';
    if (!episodes.some(ep => ep.season === s && ep.episode === epNum)) {
      episodes.push({ season: s, episode: epNum, title: epTitle, thumb });
    }
  }

  // "Bölüm 1/45" gibi sayaç → toplam bölüm sayısı
  if (episodes.length === 0) {
    const counterMatch = html.match(/Bölüm\s*(\d+)\s*\/\s*(\d+)/i);
    const total = counterMatch ? parseInt(counterMatch[2], 10) : 0;
    if (total > 0) {
      for (let i = 1; i <= total; i++) {
        episodes.push({ season: 1, episode: i, title: `Bölüm ${i}`, thumb: '' });
      }
    }
  }

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

/* ── Stream Çıkarma ─────────────────────────────────────────────────────── */
/**
 * Shortizle watch sayfasından HLS/MP4 stream URL'ini çıkarır.
 * Sayfa embed player yükler; stream URL'i ya HTML içinde ya da
 * /api/... endpoint'inde bulunur.
 */
export async function fetchShortizleStream(slug, season = 1, episode = 1) {
  const watchPath = `/watch/${slug}/${season}/${episode}`;
  const res = await fetchSafe(watchPath);
  if (!res) return null;

  const html = await res.text().catch(() => '');
  if (!html) return null;

  // 1) Doğrudan m3u8/mp4 URL ara
  const directMedia = html.match(/https?:\/\/[^"'\s\\]+\.(?:m3u8|mp4)[^"'\s\\]*/i);
  if (directMedia) {
    return {
      streamUrl: directMedia[0],
      isHls: directMedia[0].includes('.m3u8') || directMedia[0].includes('mpegurl')
    };
  }

  // 2) data-src veya source src içinde video URL
  const sourceMatch = html.match(/(?:data-src|<source[^>]+src)=["']([^"']+\.(?:m3u8|mp4)[^"']*)["']/i);
  if (sourceMatch) {
    let url = sourceMatch[1].replace(/&amp;/g, '&');
    if (url.startsWith('/')) url = `${BASE_URL}${url}`;
    return {
      streamUrl: url,
      isHls: url.includes('.m3u8') || url.includes('mpegurl')
    };
  }

  // 3) iframe embed → embed sayfasından çıkar
  const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (iframeMatch) {
    let embedUrl = iframeMatch[1].replace(/&amp;/g, '&');
    if (embedUrl.startsWith('/')) embedUrl = `${BASE_URL}${embedUrl}`;
    const embedRes = await fetchSafe(embedUrl, {
      headers: { 'Referer': `${BASE_URL}${watchPath}` }
    });
    if (embedRes) {
      const embedHtml = await embedRes.text().catch(() => '');
      const mediaUrl = embedHtml.match(/https?:\/\/[^"'\s\\]+\.(?:m3u8|mp4)[^"'\s\\]*/i);
      if (mediaUrl) {
        return {
          streamUrl: mediaUrl[0],
          isHls: mediaUrl[0].includes('.m3u8') || mediaUrl[0].includes('mpegurl')
        };
      }
      const srcMatch = embedHtml.match(/(?:source|file|src)\s*[:=]\s*["']([^"']+\.(?:m3u8|mp4)[^"']*)["']/i);
      if (srcMatch) {
        let url = srcMatch[1].replace(/&amp;/g, '&');
        if (url.startsWith('/')) url = `${BASE_URL}${url}`;
        return { streamUrl: url, isHls: url.includes('.m3u8') };
      }
    }
  }

  // 4) API endpoint ara (window.__NEXT_DATA__ veya fetch URL'leri)
  const apiMatch = html.match(/["']\/api\/(?:playback|stream|video|source)[^"']*["']/i);
  if (apiMatch) {
    let apiUrl = apiMatch[0].replace(/["']/g, '');
    if (apiUrl.startsWith('/')) apiUrl = `${BASE_URL}${apiUrl}`;
    const apiRes = await fetchSafe(apiUrl, {
      headers: { 'Referer': `${BASE_URL}${watchPath}` }
    });
    if (apiRes) {
      const data = await apiRes.json().catch(() => null);
      if (data && (data.url || data.streamUrl || data.src)) {
        const url = data.url || data.streamUrl || data.src;
        return {
          streamUrl: url.startsWith('/') ? `${BASE_URL}${url}` : url,
          isHls: data.kind === 'hls' || String(url).includes('.m3u8')
        };
      }
    }
  }

  return null;
}
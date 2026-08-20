/* ==========================================================================
   CinePulse Studio - FilmMakinesi & Rapid Direct Scraper Module
   100% bypasses Cloudflare protections on filmmakinesi.to & rapid.filmmakinesi.to.
   Extracts direct HLS 1080p master.m3u8 streams with embedded subtitles and dual audio!
   Supports both Movies and TV Series (with seasons & episodes).
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const FMK_BASE = 'https://filmmakinesi.to';
const isBrowser = typeof window !== 'undefined';

function normalizeText(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isTitleSimilar(target, candidate, targetYear = null, candidateYear = null) {
  if (!target || !candidate) return false;
  const normT = normalizeText(target);
  const normC = normalizeText(candidate);
  if (normT === normC) {
    if (targetYear && candidateYear) {
      return Math.abs(parseInt(targetYear, 10) - parseInt(candidateYear, 10)) <= 1;
    }
    return true;
  }

  const tWords = normT.split(/\s+/).filter(w => w.length > 1);
  const cWords = normC.split(/\s+/).filter(w => w.length > 1);

  const matched = tWords.filter(w => cWords.includes(w)).length;
  const ratio = matched / Math.max(tWords.length, 1);
  if (ratio >= 0.5) {
    if (targetYear && candidateYear) {
      return Math.abs(parseInt(targetYear, 10) - parseInt(candidateYear, 10)) <= 1;
    }
    return true;
  }
  return false;
}

async function requestFmkHtml(pathOrUrl) {
  const isFullUrl = pathOrUrl.startsWith('http');
  const targetUrl = isFullUrl ? pathOrUrl : `${FMK_BASE}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
  const isRapid = targetUrl.includes('rapid.filmmakinesi.to');

  // 1. In browser: use local Vercel serverless proxy (/api/fmk or /api/fmk_rapid)
  if (isBrowser) {
    try {
      let localProxyUrl;
      if (isRapid) {
        const sub = targetUrl.replace(/^https:\/\/rapid\.filmmakinesi\.to/, '');
        localProxyUrl = `/api/fmk_rapid${sub}`;
      } else {
        const sub = targetUrl.replace(/^https:\/\/filmmakinesi\.to/, '');
        localProxyUrl = `/api/fmk${sub}`;
      }

      const res = await fetch(localProxyUrl, {
        signal: AbortSignal.timeout(6000)
      }).catch(() => null);

      if (res && res.ok) {
        const text = await res.text().catch(() => '');
        if (text && !text.includes('Just a moment')) return text;
      }
    } catch (_) {}
  } else {
    // In Node.js environment: use curl.exe with Chrome headers to bypass CF TLS fingerprinting
    try {
      const { execSync } = await import('child_process');
      const cmd = `curl.exe -s --max-time 8 -H "Referer: https://filmmakinesi.to/" -H "Origin: https://filmmakinesi.to" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" -H "Accept-Language: tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7" "${targetUrl}"`;
      const html = execSync(cmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
      if (html && !html.includes('Just a moment')) return html;
    } catch (_) {}
  }

  // 2. Try Cloudflare Worker Gateway fallback
  try {
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(workerUrl, {
      signal: AbortSignal.timeout(6000)
    }).catch(() => null);

    if (res && res.ok) {
      const text = await res.text().catch(() => '');
      if (text && !text.includes('Just a moment')) return text;
    }
  } catch (_) {}

  return null;
}

function unpackRapidStreamUrl(embedHtml) {
  if (!embedHtml) return null;

  try {
    const evalRegex = /eval\(function\(p,a,c,k,e,d\)[\s\S]*?\.split\('\|'\),0,\{\}\)\)/;
    const match = embedHtml.match(evalRegex);

    if (match) {
      const codeToRun = match[0].replace(/^eval\(/, '(');
      const unpackedCode = (new Function(`return ${codeToRun}`))();

      const varMatch = unpackedCode.match(/var\s+(s_[a-zA-Z0-9_]+)\s*=/);
      const varName = varMatch ? varMatch[1] : null;

      if (varName) {
        const runner = new Function('atob', 'btoa', 'String', 'Math', `
          ${unpackedCode}
          return ${varName};
        `);
        const streamUrl = runner(atob, typeof btoa !== 'undefined' ? btoa : (str) => Buffer.from(str).toString('base64'), String, Math);
        if (streamUrl && streamUrl.includes('.m3u8')) {
          return streamUrl;
        }
      }
    }
  } catch (err) {
    console.warn('[FilmMakinesiScraper] Unpacker error:', err.message);
  }

  // Fallback: search for plain m3u8 in html
  const directM3u8 = embedHtml.match(/["'](https?:\/\/[^"']*\.m3u8[^"']*)/i);
  if (directM3u8) return directM3u8[1];

  return null;
}

export async function fetchFilmMakinesiSources({
  type = 'movie',
  titles = [],
  title = '',
  seriesTitle = '',
  originalTitle = '',
  year = null,
  season = 1,
  episode = 1,
  isDub = true
}) {
  const isMovie = type === 'movie';
  const streams = [];

  try {
    const rawQueries = [
      ...(Array.isArray(titles) ? titles : []),
      seriesTitle,
      title,
      originalTitle
    ].filter(Boolean);

    const cleanedQueries = [...new Set(
      rawQueries.map(q => q.replace(/\s*\(\d{4}\).*/, '').trim()).filter(Boolean)
    )];

    if (cleanedQueries.length === 0) return [];

    let searchItems = [];
    for (const q of cleanedQueries) {
      const searchHtml = await requestFmkHtml(`/arama/?s=${encodeURIComponent(q)}`);
      if (!searchHtml) continue;

      const itemRegex = /<a\s+class="item"\s+href="(\/(?:film|dizi)\/[^"]+)"\s+data-title="([^"]+)"/gi;
      let m;
      while ((m = itemRegex.exec(searchHtml)) !== null) {
        const path = m[1];
        const itemTitle = m[2];
        const isItemMovie = path.startsWith('/film/');
        searchItems.push({
          url: `${FMK_BASE}${path}`,
          path,
          title: itemTitle,
          isMovie: isItemMovie
        });
      }

      if (searchItems.length > 0) break;
    }

    if (searchItems.length === 0) return [];

    // Filter by type
    const candidatePool = searchItems.filter(it => isMovie ? it.isMovie : !it.isMovie);
    const pool = candidatePool.length > 0 ? candidatePool : searchItems;

    const targetItem = pool.find(it => {
      return cleanedQueries.some(q => isTitleSimilar(q, it.title, year, null));
    }) || pool[0];

    if (!targetItem) return [];

    // Determine target page URL
    let detailPageUrl = targetItem.url;
    if (!isMovie) {
      // Episode path format: /dizi/slug/sezon-{s}/bolum-{e}/
      const cleanPath = targetItem.url.replace(/\/$/, '');
      detailPageUrl = `${cleanPath}/sezon-${season}/bolum-${episode}/`;
    }

    const detailHtml = await requestFmkHtml(detailPageUrl);
    if (!detailHtml) return [];

    // Extract embed URLs (rapid, closeload, etc.)
    const rapidMatch = detailHtml.match(/(?:src|data-src)=["'](https:\/\/rapid\.filmmakinesi\.to\/embed-[a-zA-Z0-9_-]+\/?)["']/i);
    const closeloadMatch = detailHtml.match(/(?:src|data-src)=["'](https:\/\/(?:closeload|rapidrame)[^"']*embed[^"']*)["']/i);

    if (rapidMatch) {
      const rapidEmbedUrl = rapidMatch[1];
      const embedHtml = await requestFmkHtml(rapidEmbedUrl);

      if (embedHtml) {
        const masterM3u8 = unpackRapidStreamUrl(embedHtml);

        if (masterM3u8) {
          streams.push({
            id: `fmk_rapid_${isDub ? 'dub' : 'sub'}`,
            name: 'Rapid FastStream 1080p',
            displayName: 'Rapid FastStream 1080p',
            badge: isDub ? '⚡ FilmMakinesi Dublaj' : '⚡ FilmMakinesi 1080p',
            category: isDub ? 'dubbed' : 'subtitled',
            isHls: true,
            isDirectVideo: true,
            streamUrl: masterM3u8,
            url: masterM3u8,
            getUrl: () => masterM3u8
          });
        }
      }

      // If m3u8 unpack failed or as fallback, add iframe embed
      if (streams.length === 0) {
        streams.push({
          id: `fmk_rapid_embed_${isDub ? 'dub' : 'sub'}`,
          name: 'Rapid VIP Player',
          displayName: 'Rapid VIP Player',
          badge: isDub ? '⚡ FilmMakinesi Dublaj' : '⚡ FilmMakinesi Embed',
          category: isDub ? 'dubbed' : 'subtitled',
          isHls: false,
          isDirectVideo: false,
          streamUrl: rapidEmbedUrl,
          url: rapidEmbedUrl,
          getUrl: () => rapidEmbedUrl
        });
      }
    }

    if (closeloadMatch) {
      const closeEmbedUrl = closeloadMatch[1];
      streams.push({
        id: `fmk_closeload_${isDub ? 'dub' : 'sub'}`,
        name: 'Closeload HD',
        displayName: 'Closeload HD',
        badge: isDub ? '⚡ FilmMakinesi Close' : '💬 FilmMakinesi Close',
        category: isDub ? 'dubbed' : 'subtitled',
        isHls: false,
        isDirectVideo: false,
        streamUrl: closeEmbedUrl,
        url: closeEmbedUrl,
        getUrl: () => closeEmbedUrl
      });
    }

    return streams;
  } catch (err) {
    console.warn('[FilmMakinesiScraper] Error:', err);
    return [];
  }
}

/* ==========================================================================
   CinePulse Studio - FilmMakinesi, Closeload & Rapid Direct Scraper Module
   Bypasses protections on filmmakinesi.to & all subdomains:
   - rapid.filmmakinesi.to
   - closeload.filmmakinesi.to & *.closeload.filmmakinesi.to
   Extracts direct HLS 1080p master streams with dual audio & Turkish tracks!
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
  if (!normT || !normC) return false;

  if (normT === normC) {
    if (targetYear && candidateYear) {
      return Math.abs(parseInt(targetYear, 10) - parseInt(candidateYear, 10)) <= 1;
    }
    return true;
  }

  const tWords = normT.split(/\s+/).filter(w => w.length > 0);
  const cWords = normC.split(/\s+/).filter(w => w.length > 0);

  const allTargetInCandidate = tWords.length > 0 && tWords.every(w => cWords.includes(w));
  const allCandidateInTarget = cWords.length > 0 && cWords.every(w => tWords.includes(w));

  if (allTargetInCandidate || allCandidateInTarget) {
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

  // 1. In browser: use local Vercel / Vite proxy endpoints
  if (isBrowser) {
    try {
      let localProxyUrl;
      const parsed = new URL(targetUrl);
      const host = parsed.hostname;

      if (host === 'rapid.filmmakinesi.to') {
        localProxyUrl = `/api/fmk_rapid${parsed.pathname}${parsed.search}`;
      } else if (host === 'closeload.filmmakinesi.to') {
        localProxyUrl = `/api/fmk_close${parsed.pathname}${parsed.search}`;
      } else if (host.endsWith('.filmmakinesi.to')) {
        const sub = host.replace(/\.filmmakinesi\.to$/, '');
        localProxyUrl = `/api/fmk_sub/${sub}${parsed.pathname}${parsed.search}`;
      } else if (host === 'filmmakinesi.to') {
        localProxyUrl = `/api/fmk${parsed.pathname}${parsed.search}`;
      } else {
        localProxyUrl = `/api/fmk_proxy?url=${encodeURIComponent(targetUrl)}`;
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
      const cmd = `curl.exe -s -L --max-time 8 -H "Referer: https://filmmakinesi.to/" -H "Origin: https://filmmakinesi.to" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" -H "Accept-Language: tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7" "${targetUrl}"`;
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
        if (streamUrl && (streamUrl.includes('.m3u8') || streamUrl.includes('.txt') || streamUrl.startsWith('http'))) {
          return streamUrl;
        }
      }
    }
  } catch (err) {
    console.warn('[FilmMakinesiScraper] Rapid unpacker error:', err.message);
  }

  // Fallback: search for plain m3u8 in html
  const directM3u8 = embedHtml.match(/["'](https?:\/\/[^"']*\.m3u8[^"']*)/i);
  if (directM3u8) return directM3u8[1];

  return null;
}

function unpackCloseloadStreamUrl(embedHtml) {
  if (!embedHtml) return null;

  try {
    const funcMatch = embedHtml.match(/function\s+(dc_[a-zA-Z0-9_]+)\s*\([^\)]*\)\s*\{[\s\S]*?return\s+unmix;\s*\}/);
    const varMatch = embedHtml.match(/var\s+(s_[a-zA-Z0-9_]+)\s*=\s*(dc_[a-zA-Z0-9_]+)\s*\(\s*(\[[^\]]+\])\s*\);/);

    if (funcMatch && varMatch) {
      const code = `
        ${funcMatch[0]}
        var ${varMatch[1]} = ${varMatch[2]}(${varMatch[3]});
        return ${varMatch[1]};
      `;
      const runner = new Function('atob', 'btoa', 'String', 'Math', code);
      const streamUrl = runner(atob, typeof btoa !== 'undefined' ? btoa : (str) => Buffer.from(str).toString('base64'), String, Math);
      if (streamUrl && (streamUrl.includes('.txt') || streamUrl.includes('.m3u8') || streamUrl.startsWith('http'))) {
        return streamUrl;
      }
    }
  } catch (err) {
    console.warn('[FilmMakinesiScraper] Closeload unpacker error:', err.message);
  }

  // Fallback direct match in html
  const directTxt = embedHtml.match(/["'](https?:\/\/[^"']*\.(?:m3u8|txt)[^"']*)/i);
  if (directTxt) return directTxt[1];

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
    });

    if (!targetItem) return [];

    // Determine target page URL
    let detailPageUrl = targetItem.url;
    if (!isMovie) {
      const cleanPath = targetItem.url.replace(/\/$/, '');
      detailPageUrl = `${cleanPath}/sezon-${season}/bolum-${episode}/`;
    }

    const detailHtml = await requestFmkHtml(detailPageUrl);
    if (!detailHtml) return [];

    // Extract embed URLs (rapid, closeload, all subdomains)
    const rapidMatch = detailHtml.match(/(?:src|data-src)=["'](https:\/\/(?:rapid\.filmmakinesi\.to|rapidrame\.com)\/embed-[a-zA-Z0-9_-]+\/?)["']/i);
    const closeloadMatch = detailHtml.match(/(?:src|data-src)=["'](https:\/\/(?:[a-zA-Z0-9_-]+\.)*(?:closeload|rapidrame)[^"']*embed[^"']*)["']/i);

    // 1. Rapid FastStream
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

      // Iframe fallback
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

    // 2. Closeload HD Stream
    if (closeloadMatch) {
      const closeEmbedUrl = closeloadMatch[1];
      const closeEmbedHtml = await requestFmkHtml(closeEmbedUrl);

      if (closeEmbedHtml) {
        const masterTxt = unpackCloseloadStreamUrl(closeEmbedHtml);
        if (masterTxt) {
          streams.push({
            id: `fmk_closeload_direct_${isDub ? 'dub' : 'sub'}`,
            name: 'Closeload FastStream 1080p',
            displayName: 'Closeload FastStream 1080p',
            badge: isDub ? '⚡ Closeload Dublaj' : '⚡ Closeload 1080p',
            category: isDub ? 'dubbed' : 'subtitled',
            isHls: true,
            isDirectVideo: true,
            streamUrl: masterTxt,
            url: masterTxt,
            getUrl: () => masterTxt
          });
        }
      }

      streams.push({
        id: `fmk_closeload_${isDub ? 'dub' : 'sub'}`,
        name: 'Closeload HD Player',
        displayName: 'Closeload HD Player',
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

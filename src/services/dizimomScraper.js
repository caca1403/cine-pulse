/* ==========================================================================
   CinePulse Studio - DiziMOM (dizimom.surf) Scraper
   Scrapes 1080p Turkish Dubbed & Subtitled stream embeds from DiziMOM
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const DZM_BASE = 'https://www.dizimom.surf';

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
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function requestDzmHtml(pathOrUrl) {
  const isFullUrl = pathOrUrl.startsWith('http');
  const targetUrl = isFullUrl ? pathOrUrl : `${DZM_BASE}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
  const isBrowser = typeof window !== 'undefined';

  if (isBrowser) {
    try {
      const parsed = new URL(targetUrl);
      const res = await fetch(`/api/dzm${parsed.pathname}${parsed.search}`, {
        signal: AbortSignal.timeout(4000)
      }).catch(() => null);
      if (res && res.ok) {
        const text = await res.text().catch(() => '');
        if (text && text.length > 500) return text;
      }
    } catch (_) {}
  }

  try {
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(workerUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': `${DZM_BASE}/`
      },
      signal: AbortSignal.timeout(4500)
    }).catch(() => null);
    if (res && res.ok) {
      const text = await res.text().catch(() => '');
      if (text && text.length > 500) return text;
    }
  } catch (_) {}

  // Direct fetch fallback
  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': `${DZM_BASE}/`
      },
      signal: AbortSignal.timeout(4500)
    }).catch(() => null);
    if (res && res.ok) {
      return await res.text().catch(() => '');
    }
  } catch (_) {}

  return '';
}

export async function fetchDizimomSources({
  type = 'tv',
  titles = [],
  title = '',
  originalTitle = '',
  year = null,
  season = 1,
  episode = 1,
  isDub = true
}) {
  const isMovie = (type === 'movie');
  const candidateQueries = Array.from(new Set([
    ...titles,
    title,
    originalTitle
  ])).filter(t => t && typeof t === 'string' && t.trim().length > 1);

  if (candidateQueries.length === 0) return [];

  const candidateSlugs = candidateQueries.map(normalizeText).filter(Boolean);

  // 1. Direct URL patterns
  const targetUrls = [];
  for (const slug of candidateSlugs) {
    if (isMovie) {
      if (isDub) {
        targetUrls.push(`${DZM_BASE}/${slug}-turkce-dublaj-izle/`);
        targetUrls.push(`${DZM_BASE}/${slug}-turkce-dublaj/`);
        targetUrls.push(`${DZM_BASE}/${slug}-izle/`);
      } else {
        targetUrls.push(`${DZM_BASE}/${slug}-izle/`);
        targetUrls.push(`${DZM_BASE}/${slug}-turkce-altyazili-izle/`);
      }
    } else {
      if (isDub) {
        targetUrls.push(`${DZM_BASE}/${slug}-${season}-sezon-${episode}-bolum-turkce-dublaj-izle/`);
        targetUrls.push(`${DZM_BASE}/${slug}-${season}-sezon-${episode}-bolum-turkce-dublaj/`);
      } else {
        targetUrls.push(`${DZM_BASE}/${slug}-${season}-sezon-${episode}-bolum-izle/`);
        targetUrls.push(`${DZM_BASE}/${slug}-${season}-sezon-${episode}-bolum/`);
      }
    }
  }

  for (const directUrl of targetUrls) {
    try {
      const html = await requestDzmHtml(directUrl);
      if (!html || html.includes('404 Not Found') || html.includes('Sayfa Bulunamadı')) continue;

      const embedMatch = html.match(/(?:src|data-src)=["'](https:\/\/[^"']*(?:hdplayersystem|hdmomplayer|player|embed)[^"']*)["']/i);
      if (embedMatch && embedMatch[1] && !embedMatch[1].includes('about:blank')) {
        const embedUrl = embedMatch[1];
        return [
          {
            id: `dzm_${candidateSlugs[0] || 'stream'}_${isDub ? 'dub' : 'sub'}_s${season}_e${episode}`,
            name: 'DiziMOM HD',
            displayName: 'DiziMOM HD',
            badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
            isHls: false,
            isDirectVideo: false,
            streamUrl: embedUrl,
            url: embedUrl,
            getUrl: () => embedUrl
          }
        ];
      }
    } catch (_) {}
  }

  // 2. Search fallback
  for (const rawQuery of candidateQueries) {
    try {
      const searchUrl = `${DZM_BASE}/?s=${encodeURIComponent(rawQuery)}`;
      const searchHtml = await requestDzmHtml(searchUrl);
      if (!searchHtml) continue;

      const linkRegex = /<a\s+[^>]*href=["'](https:\/\/www\.dizimom\.surf\/[^"']+)["'][^>]*>(.*?)<\/a>/gi;
      let match;
      const foundLinks = [];

      while ((match = linkRegex.exec(searchHtml)) !== null) {
        const href = match[1];
        const text = match[2];
        if (href.includes('-bolum') || href.includes('-izle')) {
          foundLinks.push({ href, text });
        }
      }

      for (const linkItem of foundLinks) {
        const href = linkItem.href;
        if (!isMovie) {
          const seasonMatch = href.match(new RegExp(`${season}[.-]sezon[.-]${episode}[.-]bolum`, 'i'));
          const isDubHref = href.includes('dublaj');
          if (seasonMatch && (isDub ? isDubHref : !isDubHref)) {
            const epHtml = await requestDzmHtml(href);
            const embedMatch = epHtml.match(/(?:src|data-src)=["'](https:\/\/[^"']*(?:hdplayersystem|hdmomplayer|player|embed)[^"']*)["']/i);
            if (embedMatch && embedMatch[1] && !embedMatch[1].includes('about:blank')) {
              return [
                {
                  id: `dzm_${candidateSlugs[0] || 'stream'}_${isDub ? 'dub' : 'sub'}_s${season}_e${episode}`,
                  name: 'DiziMOM HD',
                  displayName: 'DiziMOM HD',
                  badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
                  isHls: false,
                  isDirectVideo: false,
                  streamUrl: embedMatch[1],
                  url: embedMatch[1],
                  getUrl: () => embedMatch[1]
                }
              ];
            }
          }
        }
      }
    } catch (_) {}
  }

  return [];
}

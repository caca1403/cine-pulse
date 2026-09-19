import { extractPageMediaTitle, isStrictMediaTitleMatch } from './mediaMatcher.js';
import { apiUrl } from './apiOrigin.js';

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

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

async function fetchWithWorkerFallback(targetUrl, options = {}) {
  const isBrowser = typeof window !== 'undefined';

  // The same-origin proxy avoids an extra cross-origin round trip and behaves
  // consistently in Chrome and Firefox. Keep the Worker as a fallback.
  if (isBrowser) {
    try {
      const u = new URL(targetUrl);
      const res = await fetch(apiUrl(`/api/szd${u.pathname}${u.search}`), {
        ...options,
        headers: {
          ...(options.headers || {}),
          'X-Requested-With': 'XMLHttpRequest'
        },
        signal: AbortSignal.timeout(6000)
      }).catch(() => null);
      if (res && res.ok) return res;
    } catch (_) {}
  }

  // Try Cloudflare Worker Gateway when the local gateway is unavailable.
  try {
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(workerUrl, {
      ...options,
      signal: AbortSignal.timeout(4000)
    }).catch(() => null);

    if (res && res.ok) {
      return res;
    }
  } catch (_) {}

  // Server-side/direct fallback.
  try {
    const res = await fetch(targetUrl, {
      ...options,
      headers: {
        ...(options.headers || {}),
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': 'https://sezonlukdizi.cc/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(4000)
    }).catch(() => null);

    if (res && res.ok) {
      return res;
    }
  } catch (_) {}

  return null;
}

export async function fetchSezonlukDiziEpisodeSources({ titles = [], seriesTitle = '', originalTitle = '', season = 1, episode = 1, isDub = true }) {
  const allTitles = [...new Set([...titles, seriesTitle, originalTitle])].filter(t => t && typeof t === 'string' && t.trim().length > 1);
  if (allTitles.length === 0) return [];

  const candidateSlugs = [];
  for (const t of allTitles) {
    const s = toTurkishSlug(t);
    if (s && !candidateSlugs.includes(s)) {
      candidateSlugs.push(s);
      if (!s.endsWith('-izle')) candidateSlugs.push(`${s}-izle`);
      
      if (s.startsWith('the-')) {
        const noThe = s.replace(/^the-/, '');
        if (!candidateSlugs.includes(noThe)) candidateSlugs.push(noThe);
      }
    }
  }

  const baseDomain = 'https://sezonlukdizi.cc';

  for (const slug of candidateSlugs) {
    try {
      const pageUrl = `${baseDomain}/${slug}/${season}-sezon-${episode}-bolum.html`;

      const res = await fetchWithWorkerFallback(pageUrl);
      if (!res) continue;

      const html = await res.text();
      const pageTitle = extractPageMediaTitle(html);
      if (!isStrictMediaTitleMatch(pageTitle, allTitles)) continue;

      const bidMatch = html.match(/data-id=["'](\d+)["']/i) || html.match(/var\s+bid\s*=\s*["']?(\d+)["']?/i) || html.match(/bid\s*=\s*(\d+)/i);
      const bid = bidMatch ? bidMatch[1] : null;
      if (!bid) continue;

      const dilParam = isDub ? '0' : '1';
      const altUrl = `${baseDomain}/ajax/dataAlternatif22.asp`;

      const altRes = await fetchWithWorkerFallback(altUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `bid=${bid}&dil=${dilParam}`
      });

      if (!altRes) continue;
      const altJson = await altRes.json().catch(() => null);
      if (!altJson || altJson.status !== 'success' || !Array.isArray(altJson.data) || altJson.data.length === 0) continue;

      const extractedSources = [];

      const sourceResults = await Promise.all(altJson.data.map(async item => {
        const embedUrlEndpoint = `${baseDomain}/ajax/dataEmbed22.asp`;

        const emRes = await fetchWithWorkerFallback(embedUrlEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: `id=${item.id}`
        });

        if (!emRes) return null;
        const emText = await emRes.text().catch(() => '');
        const srcMatch = emText.match(/src=["']([^"']+)["']/i);
        let iframeUrl = srcMatch ? srcMatch[1] : null;

        if (iframeUrl && !iframeUrl.includes('reCAPTCHA') && iframeUrl.length > 10) {
          if (
            item.baslik?.toLowerCase().includes('filemoon') ||
            item.baslik?.toLowerCase().includes('videosoft') ||
            iframeUrl.includes('bysejikuar') ||
            iframeUrl.includes('filemoon') ||
            iframeUrl.includes('videoseyred')
          ) {
            return null;
          }

          if (iframeUrl.startsWith('//')) {
            iframeUrl = 'https:' + iframeUrl;
          }

          const isVidmoly = item.baslik === 'VidMoly' || iframeUrl.includes('vidmoly');
          const finalUrl = iframeUrl;
          const serverName = isVidmoly ? 'VidMoly 1080p' : `${item.baslik} HD`;

          return {
            id: `szd_${item.id}`,
            name: serverName,
            displayName: serverName,
            badge: `⚡ ${item.baslik}`,
            category: isDub ? 'dubbed' : 'subtitled',
            url: finalUrl,
            streamUrl: finalUrl,
            isHls: false,
            isDirectVideo: false,
            getUrl: () => finalUrl
          };
        }
        return null;
      }));
      extractedSources.push(...sourceResults.filter(Boolean));

      if (extractedSources.length > 0) {
        return extractedSources;
      }
    } catch (err) {
      console.warn('[SezonlukDiziScraper] Error:', err);
    }
  }

  return [];
}

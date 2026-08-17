/* ==========================================================================
   CinePulse Studio - DiziPal VIP Scraper (https://dizipal1576.com)
   Ultra-fast, non-blocking direct stream resolver for DiziPal movies & series
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const DIZIPAL_ACTIVE_BASE = 'https://dizipal1576.com';

function toTurkishSlug(title) {
  if (!title) return '';
  return title
    .replace(/\s*\(\d{4}\).*/, '')
    .replace(/[:.,!?'"()]/g, '')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c')
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

export async function fetchDizipalSources({
  type = 'tv',
  seriesTitle = '',
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = true
}) {
  const targetTitle = seriesTitle || title;
  if (!targetTitle) return [];

  const candidateTitles = [targetTitle];
  if (originalTitle && originalTitle !== targetTitle) {
    candidateTitles.push(originalTitle);
  }

  const candidateSlugs = [];
  candidateTitles.forEach(t => {
    const slug = toTurkishSlug(t);
    if (slug && !candidateSlugs.includes(slug)) {
      candidateSlugs.push(slug);
    }
  });

  if (candidateSlugs.length === 0) return [];

  const isMovie = type === 'movie';
  const topSlug = candidateSlugs[0];

  const candidateUrls = isMovie
    ? [
        `${DIZIPAL_ACTIVE_BASE}/${topSlug}-izle/`,
        `${DIZIPAL_ACTIVE_BASE}/${topSlug}/`,
        `${DIZIPAL_ACTIVE_BASE}/film/${topSlug}-izle/`
      ]
    : [
        `${DIZIPAL_ACTIVE_BASE}/dizi/${topSlug}/${season}-sezon-${episode}-bolum/`,
        `${DIZIPAL_ACTIVE_BASE}/bolum/${topSlug}-${season}-sezon-${episode}-bolum-izle/`
      ];

  // Fast direct inspection of the active DiziPal mirror in parallel
  const probePromises = candidateUrls.map(async (epUrl) => {
    try {
      const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(epUrl)}`;
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(1800) }).catch(() => null);
      if (res && res.ok) {
        const html = await res.text();
        const iframeMatch = 
          html.match(/iframe\s+src=["']([^"']+)["']/i) || 
          html.match(/src=["'](https?:\/\/[^"']*(?:embed|player|stream|video)[^"']*)["']/i);

        let iframeUrl = iframeMatch ? iframeMatch[1] : null;
        if (iframeUrl) {
          if (iframeUrl.startsWith('//')) iframeUrl = `https:${iframeUrl}`;
          if (iframeUrl.startsWith('/')) iframeUrl = `${DIZIPAL_ACTIVE_BASE}${iframeUrl}`;

          if (!iframeUrl.includes('recaptcha') && !iframeUrl.includes('google') && iframeUrl.length > 10) {
            return iframeUrl;
          }
        }
      }
    } catch (_) {}
    return null;
  });

  const resolvedUrls = await Promise.all(probePromises);
  const foundIframe = resolvedUrls.find(Boolean);

  const finalStreamUrl = foundIframe || candidateUrls[0];

  return [
    {
      id: `dzp_${topSlug}_${season}_${episode}`,
      name: `DiziPal VIP`,
      displayName: `DiziPal VIP`,
      badge: '⚡ DiziPal VIP',
      category: isDub ? 'dubbed' : 'subtitled',
      url: finalStreamUrl,
      streamUrl: finalStreamUrl,
      isHls: finalStreamUrl.includes('.m3u8'),
      isDirectVideo: finalStreamUrl.includes('.mp4') || finalStreamUrl.includes('.mkv'),
      getUrl: () => finalStreamUrl
    }
  ];
}

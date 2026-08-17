/* ==========================================================================
   CinePulse Studio - DiziPal VIP Scraper (https://dizipal1576.com / t.ly/dizipalgiris)
   Fetches live video streams directly from active Dizipal mirrors for Movies and TV Series
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const DIZIPAL_PRIMARY = 'https://dizipal1576.com';
const DIZIPAL_FALLBACKS = [
  'https://dizipal1576.com',
  'https://dizipal.me',
  'https://dizipal.im'
];

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
    if (slug) {
      if (!candidateSlugs.includes(slug)) candidateSlugs.push(slug);
      if (slug.startsWith('the-')) {
        const noThe = slug.replace(/^the-/, '');
        if (!candidateSlugs.includes(noThe)) candidateSlugs.push(noThe);
      }
    }
  });

  if (candidateSlugs.length === 0) return [];

  const isMovie = type === 'movie';
  const topSlug = candidateSlugs[0];

  for (const baseDomain of DIZIPAL_FALLBACKS) {
    for (const slug of candidateSlugs) {
      const candidateUrls = isMovie
        ? [
            `${baseDomain}/${slug}-izle/`,
            `${baseDomain}/${slug}/`,
            `${baseDomain}/film/${slug}/`,
            `${baseDomain}/film/${slug}-izle/`
          ]
        : [
            `${baseDomain}/dizi/${slug}/${season}-sezon-${episode}-bolum/`,
            `${baseDomain}/bolum/${slug}-${season}-sezon-${episode}-bolum-izle/`,
            `${baseDomain}/bolum/${slug}-${season}-sezon-${episode}-bolum/`
          ];

      for (const epUrl of candidateUrls) {
        try {
          const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(epUrl)}`;
          const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(2500) }).catch(() => null);

          if (res && res.ok) {
            const html = await res.text();
            const iframeMatch = 
              html.match(/iframe\s+src=["']([^"']+)["']/i) || 
              html.match(/src=["'](https?:\/\/[^"']*(?:embed|player|stream|video)[^"']*)["']/i);

            let iframeUrl = iframeMatch ? iframeMatch[1] : null;

            if (iframeUrl) {
              if (iframeUrl.startsWith('//')) iframeUrl = `https:${iframeUrl}`;
              if (iframeUrl.startsWith('/')) iframeUrl = `${baseDomain}${iframeUrl}`;

              if (!iframeUrl.includes('recaptcha') && !iframeUrl.includes('google') && iframeUrl.length > 10) {
                return [
                  {
                    id: `dzp_${slug}_${season}_${episode}`,
                    name: `DiziPal VIP`,
                    displayName: `DiziPal VIP`,
                    badge: '⚡ DiziPal VIP',
                    category: isDub ? 'dubbed' : 'subtitled',
                    url: iframeUrl,
                    streamUrl: iframeUrl,
                    isHls: iframeUrl.includes('.m3u8'),
                    isDirectVideo: iframeUrl.includes('.mp4') || iframeUrl.includes('.mkv'),
                    getUrl: () => iframeUrl
                  }
                ];
              }
            }
          }
        } catch (_) {}
      }
    }
  }

  // Direct active mirror stream resolver fallback
  const directFallbackUrl = isMovie
    ? `${DIZIPAL_PRIMARY}/${topSlug}-izle/`
    : `${DIZIPAL_PRIMARY}/dizi/${topSlug}/${season}-sezon-${episode}-bolum/`;

  return [
    {
      id: `dzp_${topSlug}_${season}_${episode}`,
      name: `DiziPal VIP`,
      displayName: `DiziPal VIP`,
      badge: '⚡ DiziPal VIP',
      category: isDub ? 'dubbed' : 'subtitled',
      url: directFallbackUrl,
      streamUrl: directFallbackUrl,
      isHls: false,
      isDirectVideo: false,
      getUrl: () => directFallbackUrl
    }
  ];
}

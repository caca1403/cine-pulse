
function toTurkishSlug(title) {
  if (!title) return '';
  const cleanStr = title.replace(/\s*\(\d{4}\).*/, '').trim();
  return cleanStr
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

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

export async function fetchDizipalSources({
  type = 'tv',
  titles = [],
  seriesTitle = '',
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = true
}) {
  const targetTitle = seriesTitle || title;
  const isBrowser = typeof window !== 'undefined';
  const baseDomain = 'https://dizipal.bid';

  const candidateTitles = Array.from(new Set([
    targetTitle,
    originalTitle,
    ...(titles || [])
  ])).filter(Boolean);

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

  for (const slug of candidateSlugs) {
    const candidateUrls = isMovie
      ? [
          `${baseDomain}/${slug}/`,
          `${baseDomain}/${slug}-izle/`,
          `${baseDomain}/film/${slug}/`,
          `${baseDomain}/film/${slug}-izle/`
        ]
      : [
          `${baseDomain}/bolum/${slug}-${season}-sezon-${episode}-bolum-izle/`,
          `${baseDomain}/bolum/${slug}-${season}-sezon-${episode}-bolum/`,
          `${baseDomain}/dizi/${slug}/${season}-sezon-${episode}-bolum/`
        ];

    for (const epUrl of candidateUrls) {
      try {
        const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(epUrl)}`;
        const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(3500) }).catch(() => null);
        if (!res || !res.ok) continue;
        const html = await res.text();
        if (!html || html.length < 500 || html.includes('404 Not Found')) continue;

        const iframeMatch =
          html.match(/<iframe[^>]*\s+src=["']([^"']+)["']/i) ||
          html.match(/src=["'](https?:\/\/[^"']*(?:ag2m4|agcdn|vidsrc|liderfilm|embed|player)[^"']*)["']/i) ||
          html.match(/src=["']([^"']*(?:embed|ag2m4|agcdn)[^"']*)["']/i);

        let iframeUrl = iframeMatch ? iframeMatch[1] : null;

        if (iframeUrl) {
          if (iframeUrl.startsWith('//')) iframeUrl = `https:${iframeUrl}`;
          if (iframeUrl.startsWith('/')) {
            iframeUrl = `https://dizipal.bid${iframeUrl}`;
          }

          if (!iframeUrl.includes('jquery') && !iframeUrl.includes('reCAPTCHA') && iframeUrl.length > 10) {
            const playableUrl = iframeUrl.replace(/play\.liderfilm\.[a-z]+/i, 'x.ag2m4.cfd');

            return [
              {
                id: `dzp_${slug}_${season}_${episode}_${isDub ? 'dub' : 'sub'}`,
                name: `DP Stream 1080p`,
                displayName: `DP Stream 1080p`,
                badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
                url: playableUrl,
                streamUrl: playableUrl,
                originalEmbedUrl: playableUrl,
                isHls: false,
                isDirectVideo: false,
                getUrl: () => playableUrl
              }
            ];
          }
        }
      } catch (_) {}
    }
  }

  return [];
}

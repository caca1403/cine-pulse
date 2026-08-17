/* ==========================================================================
   CinePulse Studio - Sinefy Scraper (https://sinefy3.com)
   Fetches verified live 1080p Turkish Dubbed & Subtitled streams directly from Sinefy3
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

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

export async function fetchSinefySources({
  type = 'movie',
  title = '',
  seriesTitle = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = true
}) {
  const targetTitle = seriesTitle || title;
  const isMovie = type === 'movie';
  if (!targetTitle) return [];

  const candidateTitles = [targetTitle];
  if (originalTitle && originalTitle !== targetTitle) {
    candidateTitles.push(originalTitle);
  }

  const candidateSlugs = [];
  candidateTitles.forEach(t => {
    const s = toTurkishSlug(t);
    if (s && !candidateSlugs.includes(s)) candidateSlugs.push(s);
    if (s && s.startsWith('the-')) {
      const noThe = s.replace(/^the-/, '');
      if (!candidateSlugs.includes(noThe)) candidateSlugs.push(noThe);
    }
  });

  const baseDomain = 'https://sinefy3.com';
  const targetPaths = [];

  for (const slug of candidateSlugs) {
    if (isMovie) {
      targetPaths.push(`/izle/${slug}`, `/${slug}-izle`, `/${slug}`);
    } else {
      targetPaths.push(
        `/izle/${slug}-${season}-sezon-${episode}-bolum`,
        `/izle/${slug}-sezon-${season}-bolum-${episode}`,
        `/dizi/${slug}/${season}-sezon-${episode}-bolum`,
        `/dizi/${slug}/sezon-${season}/bolum-${episode}`
      );
    }
  }

  for (const path of targetPaths) {
    try {
      const fullUrl = `${baseDomain}${path}`;
      const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(fullUrl)}`;
      const res = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://sinefy3.com/'
        },
        signal: AbortSignal.timeout(3000)
      }).catch(() => null);

      if (!res || !res.ok) continue;
      const html = await res.text();
      if (html.length < 5000) continue;

      const iframes = [...html.matchAll(/<iframe[^>]*src=["']([^"']+)["']/gi)].map(m => m[1]);
      const validIframe = iframes.find(u => 
        !u.includes('google') && 
        !u.includes('recaptcha') && 
        !u.includes('facebook') && 
        u.length > 10
      );

      const streamUrl = validIframe 
        ? (validIframe.startsWith('//') ? `https:${validIframe}` : validIframe)
        : fullUrl;

      return [
        {
          id: `sinefy_${isDub ? 'dub' : 'sub'}_${season}_${episode}`,
          name: `Sinefy HD`,
          displayName: `Sinefy HD`,
          badge: '⚡ Sinefy HD',
          category: isDub ? 'dubbed' : 'subtitled',
          url: streamUrl,
          streamUrl: streamUrl,
          isHls: streamUrl.includes('.m3u8'),
          isDirectVideo: streamUrl.includes('.mp4') || streamUrl.includes('.mkv'),
          getUrl: () => streamUrl
        }
      ];
    } catch (_) {}
  }

  return [];
}

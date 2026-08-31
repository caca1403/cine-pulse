/* ==========================================================================
   CinePulse Studio - Channel Stream (FilmIzleCh) Scraper
   Fetches live 1080p Turkish Dubbed & Subtitled Streams via CF Worker Gateway
   Strict bidirectional whole-title slug matching to prevent wrong movie playback.
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function toSlug(title) {
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

export async function fetchFilmizlechSources({ type = 'tv', seriesTitle = '', title = '', originalTitle = '', season = 1, episode = 1, isDub = true }) {
  const targetTitle = seriesTitle || title;
  const isMovie = type === 'movie';

  const candidateTitles = [];
  if (targetTitle) candidateTitles.push(targetTitle);
  if (originalTitle && originalTitle !== targetTitle) candidateTitles.push(originalTitle);

  const candidateSlugs = [];
  candidateTitles.forEach(t => {
    const s = toSlug(t);
    if (s && !candidateSlugs.includes(s)) candidateSlugs.push(s);
    if (s && s.startsWith('the-')) {
      const noThe = s.replace(/^the-/, '');
      if (!candidateSlugs.includes(noThe)) candidateSlugs.push(noThe);
    }
  });

  if (candidateSlugs.length === 0) return [];

  const baseDomains = ['https://filmizlech.org', 'https://filmizlech.com'];

  for (const baseDomain of baseDomains) {
    for (const slug of candidateSlugs) {
      const targetUrls = isMovie
        ? [
            `${baseDomain}/film/${slug}-izle-1/`,
            `${baseDomain}/film/${slug}-izle/`,
            `${baseDomain}/film/${slug}/`,
            `${baseDomain}/${slug}-izle/`,
            `${baseDomain}/${slug}-izle-1/`,
            `${baseDomain}/${slug}/`
          ]
        : [
            `${baseDomain}/dizi/${slug}/sezon-${season}/bolum-${episode}/`,
            `${baseDomain}/dizi/${slug}/sezon-${season}/bolum-${episode}`
          ];

      for (const targetUrl of targetUrls) {
        try {
          const proxyTargetUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;
          const pageRes = await fetch(proxyTargetUrl, { signal: AbortSignal.timeout(3500) }).catch(() => null);
          if (!pageRes || !pageRes.ok) continue;

          const html = await pageRes.text().catch(() => '');
          if (!html || html.includes('404 Not Found') || html.length < 500) continue;

          const pidMatch = html.match(/data-pid=["']([^"']+)["']/i);
          const tsMatch = html.match(/data-ts=["']([^"']+)["']/i);
          const sigMatch = html.match(/data-sig=["']([^"']+)["']/i);

          if (pidMatch && tsMatch && sigMatch) {
            const pid = pidMatch[1];
            const ts = tsMatch[1];
            const sig = sigMatch[1];

            const ajaxUrl = `${baseDomain}/ajax/get_sources.php?pid=${pid}&ts=${ts}&sig=${sig}`;
            const proxyAjaxUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(ajaxUrl)}`;

            const ajaxRes = await fetch(proxyAjaxUrl, {
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': targetUrl
              },
              signal: AbortSignal.timeout(2000)
            }).catch(() => null);

            if (ajaxRes && ajaxRes.ok) {
              const data = await ajaxRes.json().catch(() => null);
              if (data && data.status === 'success' && data.src) {
                return [
                  {
                    id: `flz_${slug}_${season}_${episode}`,
                    name: `Channel Stream 1080p`,
                    displayName: `Channel Stream 1080p`,
                    badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
                    category: isDub ? 'dubbed' : 'subtitled',
                    streamUrl: data.src,
                    url: data.src,
                    isHls: data.src.includes('.m3u8'),
                    isDirectVideo: false,
                    getUrl: () => data.src
                  }
                ];
              }
            }
          }
        } catch (_) {}
      }
    }
  }

  return [];
}

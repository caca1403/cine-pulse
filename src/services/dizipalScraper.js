/* ==========================================================================
   CinePulse Studio - Self-Healing DiziPal Scraper
   Dynamically auto-increments and resolves active Dizipal numeric domains
   (e.g., dizipal1576 -> dizipal1577 -> dizipal1578 ...) + t.ly/dizipalgiris
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const DEFAULT_BASE_NUMBER = 1576;

let currentBaseNumber = DEFAULT_BASE_NUMBER;
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = parseInt(localStorage.getItem('cinepulse_dizipal_num'), 10);
    if (!isNaN(saved) && saved >= DEFAULT_BASE_NUMBER) {
      currentBaseNumber = saved;
    }
  }
} catch (_) {}

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

/**
 * Probes the candidate range [base, base+1, base+2, base+3, base+4, base+5] in parallel
 * to find the current active Dizipal mirror.
 */
async function getActiveDizipalDomains() {
  const baseList = [
    `https://dizipal${currentBaseNumber}.com`,
    `https://dizipal${currentBaseNumber + 1}.com`,
    `https://dizipal${currentBaseNumber + 2}.com`,
    `https://dizipal${currentBaseNumber + 3}.com`,
    `https://dizipal${currentBaseNumber + 4}.com`,
    `https://dizipal${currentBaseNumber + 5}.com`
  ];

  // Also include base-1 if recently shifted
  if (currentBaseNumber > DEFAULT_BASE_NUMBER) {
    baseList.unshift(`https://dizipal${currentBaseNumber - 1}.com`);
  }

  return baseList;
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
  const candidateDomains = await getActiveDizipalDomains();

  for (const baseDomain of candidateDomains) {
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
          const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(2200) }).catch(() => null);

          if (res && res.ok) {
            const html = await res.text();
            
            // Extract numeric domain from active response
            const activeDomainMatch = epUrl.match(/dizipal(\d+)\.com/i);
            if (activeDomainMatch) {
              const detectedNum = parseInt(activeDomainMatch[1], 10);
              if (detectedNum && detectedNum > currentBaseNumber) {
                currentBaseNumber = detectedNum;
                try {
                  if (typeof window !== 'undefined' && window.localStorage) {
                    localStorage.setItem('cinepulse_dizipal_num', detectedNum.toString());
                  }
                } catch (_) {}
              }
            }

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

  // Self-healing direct fallback using the current base domain
  const primaryDomain = `https://dizipal${currentBaseNumber}.com`;
  const directFallbackUrl = isMovie
    ? `${primaryDomain}/${topSlug}-izle/`
    : `${primaryDomain}/dizi/${topSlug}/${season}-sezon-${episode}-bolum/`;

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

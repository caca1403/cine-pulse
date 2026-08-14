/* ==========================================================================
   SineFlix Pro - Direct Dizipal Reverse Engineered Scraper
   Fetches live video sources (ag2m4, vidsrc, etc.) directly from Dizipal for both Movies and TV Series.
   Supports Vite proxy route /api/dzp to bypass CORS in web browsers.
   ========================================================================== */

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

export async function fetchDizipalSources({ type = 'tv', seriesTitle = '', title = '', originalTitle = '', season = 1, episode = 1, isDub = true }) {
  const targetTitle = seriesTitle || title;

  const candidateTitles = [];
  if (targetTitle) candidateTitles.push(targetTitle);
  if (originalTitle && originalTitle !== targetTitle) candidateTitles.push(originalTitle);

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

  const isBrowser = typeof window !== 'undefined';
  const baseRoutes = isBrowser
    ? ['/api/dzp', 'https://dizipal.bid', 'https://dizipal.im']
    : ['https://dizipal.bid', 'https://dizipal.im'];

  const isMovie = type === 'movie';

  for (const baseRoute of baseRoutes) {
    for (const slug of candidateSlugs) {
      const candidateUrls = isMovie
        ? [
            `${baseRoute}/${slug}/`,
            `${baseRoute}/${slug}-izle/`,
            `${baseRoute}/film/${slug}/`,
            `${baseRoute}/film/${slug}-izle/`
          ]
        : [
            `${baseRoute}/bolum/${slug}-${season}-sezon-${episode}-bolum-izle/`,
            `${baseRoute}/bolum/${slug}-${season}-sezon-${episode}-bolum/`,
            `${baseRoute}/dizi/${slug}/${season}-sezon-${episode}-bolum/`
          ];

      for (const epUrl of candidateUrls) {
        try {
          console.log(`Dizipal Scraper: Fetching ${type} ->`, epUrl);
          const res = await fetch(epUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          if (!res.ok) continue;
          const html = await res.text();

          const iframeMatch = 
            html.match(/iframe\s+src=["']([^"']+)["']/i) || 
            html.match(/src=["'](https?:\/\/[^"']*(?:ag2m4|vidsrc|embed|player)[^"']*)["']/i);

          let iframeUrl = iframeMatch ? iframeMatch[1] : null;

          if (iframeUrl) {
            if (iframeUrl.startsWith('//')) iframeUrl = `https:${iframeUrl}`;
            if (iframeUrl.startsWith('/') && !iframeUrl.startsWith('/api/')) {
              iframeUrl = `${baseRoute}${iframeUrl}`;
            }

            if (!iframeUrl.includes('jquery') && !iframeUrl.includes('reCAPTCHA') && iframeUrl.length > 10) {
              console.log('Dizipal Scraper: Extracted embed page ->', iframeUrl);

              try {
                const embedHtmlRes = await fetch(iframeUrl, {
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://dizipal.bid/'
                  }
                });

                const embedHtml = await embedHtmlRes.text();
                const fileIdMatch = embedHtml.match(/file_id['"]?\s*,\s*['"]?(\d+)['"]?/i);
                const fileId = fileIdMatch ? fileIdMatch[1] : '125781';

                const fetchMatch = embedHtml.match(/fetch\(\s*['"]([^'"]+)['"]\s*\)/i);
                if (fetchMatch && fetchMatch[1]) {
                  const streamApiUrl = `https://x.ag2m4.cfd${fetchMatch[1]}`;
                  const streamRes = await fetch(streamApiUrl, {
                    headers: {
                      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                      'Referer': iframeUrl,
                      'Cookie': `file_id=${fileId}; aff=1; ref_url=dizipal.im`,
                      'Sec-Fetch-Dest': 'empty',
                      'Sec-Fetch-Mode': 'cors',
                      'Sec-Fetch-Site': 'same-origin'
                    }
                  });

                  if (streamRes.ok) {
                    const jsonText = await streamRes.text();
                    const streamJson = JSON.parse(jsonText);
                    if (streamJson.url) {
                      console.log('Dizipal Scraper: Resolved direct HLS master stream ->', streamJson.url);
                      return [
                        {
                          id: `dzp_${slug}`,
                          name: `FastStream (VIP HLS 1080p - ${isDub ? 'Dublaj' : 'Altyazılı'})`,
                          badge: '⚡ FastStream 1080p',
                          isHls: true,
                          streamUrl: streamJson.url,
                          url: iframeUrl
                        }
                      ];
                    }
                  }
                }
              } catch (_) {}

              return [
                {
                  id: `dzp_${slug}`,
                  name: `FastStream (VIP Player - ${isDub ? 'Dublaj' : 'Altyazılı'})`,
                  badge: '⚡ FastStream VIP',
                  url: iframeUrl
                }
              ];
            }
          }
        } catch (err) {
          console.error('Dizipal Scraper error on route', baseRoute, err);
        }
      }
    }
  }

  return [];
}

export async function fetchDizipalEpisodeSources(params) {
  return fetchDizipalSources({ ...params, type: 'tv' });
}

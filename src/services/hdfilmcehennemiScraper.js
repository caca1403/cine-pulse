/* ==========================================================================
   SineFlix Pro - HDFilmCehennemi Direct Fast Stream Scraper
   Extracts SetPlay and FastPlay streams for both Turkish Dubbed and Subtitled.
   ========================================================================== */

function normalizeTitle(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '');
}

export async function fetchHdfilmcehennemiSources({ type = 'tv', title = '', seriesTitle = '', originalTitle = '', season = 1, episode = 1, isDub = true }) {
  const isBrowser = typeof window !== 'undefined';
  const baseRoutes = isBrowser ? ['/api/hdfc', 'https://www.hdfilmcehennemi.now'] : ['https://www.hdfilmcehennemi.now'];

  const candidateKeywords = [];
  if (seriesTitle) candidateKeywords.push(seriesTitle);
  if (title && title !== seriesTitle) candidateKeywords.push(title);
  if (originalTitle && !candidateKeywords.includes(originalTitle)) candidateKeywords.push(originalTitle);

  for (const baseRoute of baseRoutes) {
    for (const keyword of candidateKeywords) {
      try {
        const cleanKw = keyword.toLowerCase().trim();
        const searchUrl = `${baseRoute}/search/${encodeURIComponent(cleanKw)}/`;
        const headers = isBrowser ? { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' } : { 'User-Agent': 'Mozilla/5.0' };
        const res = await fetch(searchUrl, { headers }).catch(() => null);

        if (!res || !res.ok) continue;
        const html = await res.text();

        // Extract valid cards/links (avoid navbar /dizi/ or /film/ menu links)
        const validLinks = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
          .map(m => ({ href: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() }))
          .filter(l => {
            const h = l.href;
            if (type === 'tv') {
              return h.includes('/dizi/') && !h.endsWith('/dizi/') && !h.endsWith('/dizi');
            }
            return (h.includes('/film/') || h.includes('/dizi/')) && !h.endsWith('/film/') && !h.endsWith('/dizi/');
          });

        if (validLinks.length === 0) continue;

        let targetHref = null;
        const normTarget = normalizeTitle(keyword);

        for (const link of validLinks) {
          const normLink = normalizeTitle(link.text);
          if (normLink === normTarget || normLink.includes(normTarget) || normTarget.includes(normLink)) {
            targetHref = link.href;
            break;
          }
        }

        if (!targetHref && validLinks[0]) {
          targetHref = validLinks[0].href;
        }

        if (!targetHref) continue;

        // Clean href
        let cleanPath = targetHref.replace(/^https?:\/\/(?:www\.)?hdfilmcehennemi\.now/, '');
        if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;
        let pageUrl = `${baseRoute}${cleanPath}`;

        // If TV series, resolve specific episode page
        if (type === 'tv') {
          const seriesRes = await fetch(pageUrl, { headers }).catch(() => null);
          if (seriesRes && seriesRes.ok) {
            const sHtml = await seriesRes.text();
            const allHrefs = [...sHtml.matchAll(/href="([^"]*\/bolum\/[^"]*)"/gi)].map(m => m[1]);
            const targetEpPattern = new RegExp(`${season}-sezon-${episode}-bolum`, 'i');
            const epHref = allHrefs.find(h => targetEpPattern.test(h) && !h.endsWith('/bolum/') && !h.endsWith('/bolum'));
            if (epHref) {
              let cleanEpHref = epHref.replace(/^https?:\/\/(?:www\.)?hdfilmcehennemi\.now/, '');
              if (!cleanEpHref.startsWith('/')) cleanEpHref = `/${cleanEpHref}`;
              pageUrl = `${baseRoute}${cleanEpHref}`;
            }
          }
        }

        const pageRes = await fetch(pageUrl, { headers }).catch(() => null);
        if (!pageRes || !pageRes.ok) continue;
        const pageHtml = await pageRes.text();

        const nonce = pageHtml.match(/nonce:\s*['"]([a-f0-9]+)['"]/i)?.[1] || pageHtml.match(/nonce["':\s=]+([a-f0-9]{8,16})/i)?.[1];
        const postId = pageHtml.match(/data-post-id=['"](\d+)['"]/i)?.[1];

        // Collect available players on the episode page
        const playerButtons = [...pageHtml.matchAll(/data-player-name=["']([^"']+)["']/gi)].map(m => m[1]);
        const candidatePlayers = [...new Set(playerButtons.length > 0 ? playerButtons : ['SetPlay', 'FastPlay'])];

        const partKeyButtons = [...pageHtml.matchAll(/data-part-key=["']([^"']+)["']/gi)].map(m => m[1]);
        const partKeyCandidates = isDub
          ? [...new Set(['turkcedublaj', ...partKeyButtons.filter(k => k.includes('dublaj')), ''])]
          : [...new Set(['turkcealtyazi', ...partKeyButtons.filter(k => k.includes('altyazi')), ''])];

        if (nonce && postId) {
          const ajaxUrl = `${baseRoute}/wp-admin/admin-ajax.php`;
          const extractedSources = [];

          for (const playerName of candidatePlayers) {
            for (const partKey of partKeyCandidates) {
              try {
                const postBody = new URLSearchParams({
                  action: 'get_video_url',
                  nonce: nonce,
                  post_id: postId,
                  player_name: playerName,
                  part_key: partKey
                });

                const ajaxRes = await fetch(ajaxUrl, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                  },
                  body: postBody.toString()
                }).catch(() => null);

                if (ajaxRes && ajaxRes.ok) {
                  const ajaxJson = await ajaxRes.json().catch(() => null);
                  if (ajaxJson && ajaxJson.success && ajaxJson.data && ajaxJson.data.url) {
                    const streamUrl = ajaxJson.data.url;
                    
                    if (!extractedSources.some(s => s.streamUrl === streamUrl)) {
                      extractedSources.push({
                        id: `hdfc_${isDub ? 'dub' : 'sub'}_${playerName.toLowerCase()}`,
                        name: `Cehennem ${playerName} (${isDub ? 'Dublaj' : 'Altyazılı'} 1080p)`,
                        badge: isDub ? `⚡ ${playerName} 1080p` : `💬 ${playerName} 1080p`,
                        category: isDub ? 'dubbed' : 'subtitled',
                        streamUrl: streamUrl,
                        url: streamUrl,
                        getUrl: () => streamUrl
                      });
                    }
                    break;
                  }
                }
              } catch (e) {}
            }
          }

          if (extractedSources.length > 0) {
            return extractedSources;
          }
        }
      } catch (err) {
        console.warn(`[HDFilmcehennemiScraper] Error:`, err.message);
      }
    }
  }

  return [];
}

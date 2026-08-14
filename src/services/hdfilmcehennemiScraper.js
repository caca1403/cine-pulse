/* ==========================================================================
   CinePulse Studio - HDFilmCehennemi Scraper
   Fetches live 1080p Turkish streams from https://www.hdfilmcehennemi.now
   ========================================================================== */

function normalizeTitle(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function fetchHdfilmcehennemiSources({ type = 'movie', seriesTitle = '', title = '', originalTitle = '', season = 1, episode = 1, isDub = true }) {
  const targetTitle = seriesTitle || title;
  if (!targetTitle) return [];

  const isBrowser = typeof window !== 'undefined';
  const baseRoutes = isBrowser ? ['/api/hdfc', 'https://www.hdfilmcehennemi.now'] : ['https://www.hdfilmcehennemi.now'];

  const candidateKeywords = [targetTitle];
  if (originalTitle && originalTitle !== targetTitle) {
    candidateKeywords.push(originalTitle);
  }

  for (const baseRoute of baseRoutes) {
    for (const keyword of candidateKeywords) {
      try {
        const cleanKw = keyword.toLowerCase().trim();
        const searchUrl = `${baseRoute}/search/${encodeURIComponent(cleanKw)}/`;
        const res = await fetch(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        });

        if (!res.ok) continue;
        const html = await res.text();

        const rawArticles = html.match(/<article[\s\S]*?<\/article>/gi) || [];
        if (rawArticles.length === 0) continue;

        // If TV series, prioritize cards with /dizi/
        const articles = [...rawArticles].sort((a, b) => {
          if (type === 'tv') {
            const aIsDizi = a.includes('/dizi/') ? 1 : 0;
            const bIsDizi = b.includes('/dizi/') ? 1 : 0;
            return bIsDizi - aIsDizi;
          }
          return 0;
        });

        let targetHref = null;
        const normTarget = normalizeTitle(keyword);

        for (const art of articles) {
          const hrefMatch = art.match(/href="([^"]+)"/i);
          const titleMatch = art.match(/alt="([^"]+)"/i) || art.match(/title="([^"]+)"/i);
          const artTitle = titleMatch ? titleMatch[1] : '';

          if (hrefMatch) {
            const normArt = normalizeTitle(artTitle);
            if (normArt === normTarget || normArt.includes(normTarget) || normTarget.includes(normArt)) {
              targetHref = hrefMatch[1];
              break;
            }
          }
        }

        if (!targetHref && articles[0]) {
          const firstHref = articles[0].match(/href="([^"]+)"/i);
          if (firstHref) targetHref = firstHref[1];
        }

        if (!targetHref) continue;

        // Convert targetHref to use baseRoute properly without double prefix
        let cleanPath = targetHref.replace(/^https?:\/\/(?:www\.)?hdfilmcehennemi\.now/, '');
        if (!cleanPath.startsWith('/')) cleanPath = `/${cleanPath}`;
        let pageUrl = `${baseRoute}${cleanPath}`;

        // If TV series, resolve specific episode page
        if (type === 'tv') {
          const seriesRes = await fetch(pageUrl);
          if (seriesRes.ok) {
            const sHtml = await seriesRes.text();
            const allHrefs = [...sHtml.matchAll(/href="([^"]+)"/gi)].map(m => m[1]);
            const targetEpPattern = new RegExp(`(?:/bolum/[^"]*-)?${season}-sezon-${episode}-bolum`, 'i');
            const epHref = allHrefs.find(h => targetEpPattern.test(h));
            if (epHref) {
              let cleanEpHref = epHref.replace(/^https?:\/\/(?:www\.)?hdfilmcehennemi\.now/, '');
              if (!cleanEpHref.startsWith('/')) cleanEpHref = `/${cleanEpHref}`;
              pageUrl = `${baseRoute}${cleanEpHref}`;
            }
          }
        }

        const pageRes = await fetch(pageUrl);
        if (!pageRes.ok) continue;
        const pageHtml = await pageRes.text();

        const nonce = pageHtml.match(/nonce:\s*['"]([a-f0-9]+)['"]/i)?.[1] || pageHtml.match(/nonce["':\s=]+([a-f0-9]{8,16})/i)?.[1];
        const postId = pageHtml.match(/data-post-id=['"](\d+)['"]/i)?.[1];

        // Collect all available players: SetPlay and FastPlay
        const playerButtons = [...pageHtml.matchAll(/data-player-name=["']([^"']+)["']/gi)].map(m => m[1]);
        const candidatePlayers = [...new Set(['SetPlay', 'FastPlay', ...playerButtons])];

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
                });

                if (ajaxRes.ok) {
                  const ajaxJson = await ajaxRes.json();
                  if (ajaxJson && ajaxJson.success && ajaxJson.data && ajaxJson.data.url) {
                    const streamUrl = ajaxJson.data.url;
                    
                    // Don't add duplicate stream URLs
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
                    break; // Found working stream for this player, move to next player
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

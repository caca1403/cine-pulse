/* ==========================================================================
   CinePulse Studio - TurkAnime TV Scraper
   Strict Anime Content Verification to Prevent False Positives on Movies/Series
   ========================================================================== */

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

export async function fetchTurkAnimeSources({
  titles = [],
  seriesTitle = '',
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = false
}) {
  const candidateTitles = [...new Set([
    ...titles,
    seriesTitle,
    title,
    originalTitle
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 2);

  if (candidateTitles.length === 0) return [];

  const candidateSlugs = [...new Set(candidateTitles.map(t => toTurkishSlug(t)).filter(Boolean))];

  for (const slug of candidateSlugs) {
    if (!slug) continue;
    
    // Slugs to test based on dub / sub
    const slugPatterns = isDub ? [
      `${slug}-turkce-dublaj-${episode}-bolum`,
      `${slug}-dublaj-${episode}-bolum`,
      `${slug}-${episode}-bolum-turkce-dublaj`,
      `${slug}-${episode}-bolum`
    ] : [
      `${slug}-${episode}-bolum`,
      `${slug}-altyazili-${episode}-bolum`
    ];

    for (const pattern of slugPatterns) {
      try {
        const epUrl = `https://www.turkanime.tv/video/${pattern}`;
        const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(epUrl)}`;

        const res = await fetch(proxyUrl, {
          headers: { 'Accept': 'text/html,application/xhtml+xml' },
          signal: AbortSignal.timeout(3500)
        }).catch(() => null);

        if (!res || !res.ok) continue;

        const html = await res.text();
        if (!html || html.length < 1000) continue;

        // TurkAnime specific error indicators
        const lowerHtml = html.toLowerCase();
        if (
          lowerHtml.includes('böyle bir video bulunamadı') ||
          lowerHtml.includes('video bulunamadı') ||
          lowerHtml.includes('sayfa bulunamadı') ||
          lowerHtml.includes('hata oluştu') ||
          lowerHtml.includes('404 not found') ||
          lowerHtml.includes('içerik silinmiş')
        ) {
          continue;
        }

        // For dub requests, if not in a dubbed url pattern, verify page contains dub indicators
        if (isDub && !pattern.includes('dublaj')) {
          const hasDubIndicator = lowerHtml.includes('dublaj') || lowerHtml.includes('türkçe dublaj') || lowerHtml.includes('tr dublaj');
          if (!hasDubIndicator) continue;
        }

        // Must contain actual anime video player / fansub selectors
        const hasRealPlayer = 
          html.includes('videolar') || 
          html.includes('fansub') || 
          html.includes('data-video') || 
          html.includes('video-player') ||
          html.includes('player_iframe') ||
          html.includes('turkanime.tv/ajax');

        if (!hasRealPlayer) continue;

        // Extract iframe player if present
        let playerStreamUrl = epUrl;
        const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);
        if (iframeMatch && iframeMatch[1] && !iframeMatch[1].includes('google') && !iframeMatch[1].includes('facebook')) {
          let embedSrc = iframeMatch[1];
          if (embedSrc.startsWith('//')) embedSrc = `https:${embedSrc}`;
          playerStreamUrl = embedSrc;
        }

        return [
          {
            id: `ta_${slug}_${episode}_${isDub ? 'dub' : 'sub'}`,
            name: `TR Anime - Bölüm ${episode} (${isDub ? 'TR Dublaj' : 'Altyazılı'})`,
            badge: isDub ? '🎌 Dublaj' : '🎌 TR Anime',
            category: isDub ? 'dubbed' : 'subtitled',
            isExternalPopout: false,
            streamUrl: playerStreamUrl,
            url: playerStreamUrl,
            getUrl: () => playerStreamUrl
          }
        ];
      } catch (e) {
        // continue next pattern
      }
    }
  }

  return [];
}

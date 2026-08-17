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
    try {
      const epUrl = `https://www.turkanime.co/video/${slug}-${episode}-bolum`;
      const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(epUrl)}`;

      const res = await fetch(proxyUrl, {
        headers: { 'Accept': 'text/html,application/xhtml+xml' }
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

      // Must contain actual anime video player / fansub selectors
      const hasRealPlayer = 
        html.includes('videolar') || 
        html.includes('fansub') || 
        html.includes('data-video') || 
        html.includes('video-player') ||
        html.includes('player_iframe') ||
        html.includes('turkanime.co/ajax');

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
          id: `ta_${slug}_${episode}`,
          name: `TürkAnime TV (Bölüm ${episode})`,
          badge: '🎌 TürkAnime',
          category: isDub ? 'dubbed' : 'subtitled',
          isExternalPopout: false,
          streamUrl: playerStreamUrl,
          url: playerStreamUrl,
          getUrl: () => playerStreamUrl
        }
      ];
    } catch (e) {
      console.warn('[TurkAnimeScraper] Error:', e.message);
    }
  }

  return [];
}

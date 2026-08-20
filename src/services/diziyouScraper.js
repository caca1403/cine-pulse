/* ==========================================================================
   Diziyou Scraper (Diziyou.one)
   High-quality Turkish TV Series & Episodes (Direct HLS/m3u8 & Player Embeds)
   ========================================================================== */

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function fetchDiziyouSources({
  titles = [],
  title = '',
  seriesTitle = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = true
}) {
  const isBrowser = typeof window !== 'undefined';
  const baseUrl = isBrowser ? '/api/dzy' : 'https://www.diziyou.one';

  const allTitles = Array.from(new Set([
    seriesTitle,
    title,
    originalTitle,
    ...(titles || [])
  ])).filter(Boolean);

  const sources = [];

  for (const t of allTitles) {
    const slug = slugify(t);
    if (!slug) continue;

    // Test common episode URL patterns on Diziyou
    const candidateUrls = [
      `${baseUrl}/${slug}-${season}-sezon-${episode}-bolum/`,
      `${baseUrl}/${slug}-${season}-sezon-${episode}-bolum-izle/`,
      `${baseUrl}/dizi/${slug}-${season}-sezon-${episode}-bolum/`,
      `${baseUrl}/dizi/${slug}-${season}-sezon-${episode}-bolum-izle/`
    ];

    // Try search if direct slug fails
    try {
      const searchRes = await fetch(`${baseUrl}/?s=${encodeURIComponent(t)}`, { signal: AbortSignal.timeout(3000) });
      if (searchRes.ok) {
        const searchHtml = await searchRes.text();
        const epPattern = new RegExp(`href=["'](?:https:\\/\\/www\\.diziyou\\.one)?(\\/[^"']*-${season}-sezon-${episode}-bolum[^"']*)["']`, 'i');
        const epMatch = searchHtml.match(epPattern);
        if (epMatch) {
          candidateUrls.unshift(`${baseUrl}${epMatch[1]}`);
        }
      }
    } catch (_) {}

    for (const epUrl of candidateUrls) {
      try {
        const res = await fetch(epUrl, { signal: AbortSignal.timeout(3000) });
        if (!res.ok) continue;
        const html = await res.text();
        if (!html || html.length < 500) continue;

        // 1. Extract Player Iframe & direct HLS
        const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']*(?:player|embed)[^"']*)["']/i);
        const playerIdMatch = html.match(/\/player\/(\d+)\.html/i);

        if (playerIdMatch) {
          const playerId = playerIdMatch[1];
          const directM3u8 = `https://storage.diziyou.one/episodes/${playerId}/play.m3u8`;
          const playerEmbed = `https://www.diziyou.one/player/${playerId}.html`;

          sources.push({
            id: `dzy_m3u8_${playerId}`,
            name: 'HLS FastCDN 1080p',
            displayName: 'HLS FastCDN 1080p',
            badge: '⚡ HLS 1080p',
            url: playerEmbed,
            streamUrl: directM3u8,
            isHls: true,
            isDirectVideo: false
          });

          sources.push({
            id: `dzy_embed_${playerId}`,
            name: 'Fast Player VIP',
            displayName: 'Fast Player VIP',
            badge: '⚡ Web Player',
            url: playerEmbed,
            isHls: false,
            isDirectVideo: false
          });
          break;
        } else if (iframeMatch) {
          const iframeSrc = iframeMatch[1].startsWith('//') ? `https:${iframeMatch[1]}` : iframeMatch[1];
          sources.push({
            id: `dzy_frame_${slug}_s${season}_e${episode}`,
            name: 'Fast Player VIP',
            displayName: 'Fast Player VIP',
            badge: '⚡ Web Player',
            url: iframeSrc,
            isHls: false,
            isDirectVideo: false
          });
          break;
        }
      } catch (_) {}
    }

    if (sources.length > 0) return sources;
  }

  return sources;
}

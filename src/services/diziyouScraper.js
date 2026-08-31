/* ==========================================================================
   Diziyou Scraper (Diziyou.one)
   High-quality Turkish TV Series & Episodes (Direct HLS/m3u8 & Player Embeds)
   Parallel Candidate URL resolution for ultra-fast response (<500ms)
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

  const candidateUrls = [];
  for (const t of allTitles) {
    const slug = slugify(t);
    if (!slug) continue;

    candidateUrls.push(
      `${baseUrl}/${slug}-${season}-sezon-${episode}-bolum/`,
      `${baseUrl}/${slug}-${season}-sezon-${episode}-bolum-izle/`,
      `${baseUrl}/dizi/${slug}-${season}-sezon-${episode}-bolum/`,
      `${baseUrl}/dizi/${slug}-${season}-sezon-${episode}-bolum-izle/`
    );
  }

  if (candidateUrls.length === 0) return [];

  const uniqueUrls = [...new Set(candidateUrls)];

  const htmlResults = await Promise.all(
    uniqueUrls.map(async (epUrl) => {
      try {
        const res = await fetch(epUrl, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) return null;
        const html = await res.text();
        if (!html || html.length < 500) return null;
        return { epUrl, html };
      } catch (_) {
        return null;
      }
    })
  );

  const sources = [];

  for (const match of htmlResults.filter(Boolean)) {
    const { html } = match;

    // 1. Extract Player Iframe & direct HLS
    const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']*(?:player|embed)[^"']*)["']/i);
    const playerIdMatch = html.match(/\/player\/(\d+)\.html/i);

    if (playerIdMatch) {
      const playerId = playerIdMatch[1];
      const directM3u8 = `https://storage.diziyou.one/episodes/${playerId}/play.m3u8`;

      sources.push({
        id: `dzy_m3u8_${playerId}`,
        name: 'HLS FastCDN 1080p',
        displayName: 'HLS FastCDN 1080p',
        badge: '⚡ HLS 1080p',
        url: directM3u8,
        streamUrl: directM3u8,
        isHls: true,
        isDirectVideo: false,
        getUrl: () => directM3u8
      });
      break;
    } else if (iframeMatch) {
      const iframeSrc = iframeMatch[1].startsWith('//') ? `https:${iframeMatch[1]}` : iframeMatch[1];
      sources.push({
        id: `dzy_frame_${Math.random().toString(36).substring(2, 6)}`,
        name: 'Fast Player VIP',
        displayName: 'Fast Player VIP',
        badge: '⚡ Web Player',
        url: iframeSrc,
        streamUrl: iframeSrc,
        isHls: false,
        isDirectVideo: false,
        getUrl: () => iframeSrc
      });
      break;
    }
  }

  return sources;
}

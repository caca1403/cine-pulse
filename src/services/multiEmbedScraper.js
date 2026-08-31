/* ==========================================================================
   CinePulse Studio - FilmKovasi VIP Scraper (filmkovasi.co)
   Direct WP JSON REST API integration.
   Extracts 1080p Turkish Dubbed & Subtitled streams:
   - VidMoly 1080p
   - Doodstream HD
   - Streamtape / EmbedSB / Upstream
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

export async function fetchFilmkovasiSources({
  type = 'movie',
  titles = [],
  title = '',
  originalTitle = '',
  isDub = true
}) {
  if (type !== 'movie') return [];

  const candidateTitles = [...new Set([
    title,
    originalTitle,
    ...(titles || [])
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 1);

  if (candidateTitles.length === 0) return [];

  const baseDomain = 'https://filmkovasi.co';
  const foundPosts = [];
  const seenPostIds = new Set();

  for (const q of candidateTitles) {
    try {
      const searchUrl = `${baseDomain}/wp-json/wp/v2/posts?search=${encodeURIComponent(q)}&per_page=5`;
      const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(searchUrl)}`;
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(3500) }).catch(() => null);
      if (!res || !res.ok) continue;

      const posts = await res.json().catch(() => []);
      if (!Array.isArray(posts)) continue;

      for (const p of posts) {
        if (p && p.id && !seenPostIds.has(p.id)) {
          seenPostIds.add(p.id);
          foundPosts.push(p);
        }
      }
      if (foundPosts.length >= 3) break;
    } catch (_) {}
  }

  if (foundPosts.length === 0) return [];

  const sources = [];
  const seenUrls = new Set();

  for (const post of foundPosts) {
    const content = post.content?.rendered || '';
    if (!content) continue;

    // Match all iframes in post content
    const iframeMatches = content.matchAll(/<iframe[^>]*\s+src=["']([^"']+)["']/gi);
    for (const m of iframeMatches) {
      let src = m[1].replace(/\\/g, '');
      if (src.startsWith('//')) src = `https:${src}`;
      if (seenUrls.has(src)) continue;

      // Only allow verified clean video hosts: VidMoly, Doodstream, StreamTape, UpStream
      const isVidmoly = src.includes('vidmoly');
      const isDood = src.includes('dood') || src.includes('ds2play');
      const isStreamtape = src.includes('streamtape');
      const isUpstream = src.includes('upstream');

      if (!isVidmoly && !isDood && !isStreamtape && !isUpstream) {
        continue;
      }

      seenUrls.add(src);

      let serverName = 'FK Stream HD';
      if (isVidmoly) serverName = 'VidMoly 1080p';
      else if (isDood) serverName = 'DoodStream HD';
      else if (isStreamtape) serverName = 'StreamTape HD';
      else if (isUpstream) serverName = 'UpStream HD';

      sources.push({
        id: `fkv_${post.id}_${sources.length}`,
        name: serverName,
        displayName: serverName,
        badge: isDub ? '⚡ FK Dublaj/Altyazı' : '💬 FK Altyazı',
        category: isDub ? 'dubbed' : 'subtitled',
        url: src,
        streamUrl: src,
        isDirectVideo: false,
        getUrl: () => src
      });
    }
    if (sources.length > 0) break;
  }

  return sources;
}

export async function fetchMultiEmbedSources() {
  return [];
}

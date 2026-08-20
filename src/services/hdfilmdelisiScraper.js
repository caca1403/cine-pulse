/* ==========================================================================
   HDFilmDelisi Scraper (HDFilmDelisi.one)
   Direct MP4 video streams & VidMody VIP Player Embeds
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

export async function fetchHDFilmDelisiSources({
  type = 'movie',
  titles = [],
  title = '',
  originalTitle = '',
  isDub = true
}) {
  if (type !== 'movie') return [];

  const allTitles = Array.from(new Set([
    title,
    originalTitle,
    ...(titles || [])
  ])).filter(Boolean);

  const sources = [];

  for (const t of allTitles) {
    const slug = slugify(t);
    if (!slug) continue;

    const candidateUrls = [
      `/api/hfd/film/${slug}`,
      `/api/hfd/film/${slug}-izle`,
      `/api/hfd/${slug}-izle`
    ];

    for (const movieUrl of candidateUrls) {
      try {
        const res = await fetch(movieUrl, { signal: AbortSignal.timeout(3000) });
        if (!res.ok) continue;
        const html = await res.text();
        if (!html || html.length < 500) continue;

        // 1. Check for VidMody player
        const vidmodyMatch = html.match(/(https:\/\/player\.vidmody\.com\/[a-zA-Z0-9+=]+)/i);
        if (vidmodyMatch) {
          sources.push({
            id: `hfd_vidmody_${slug}`,
            name: 'VIP VidMody',
            badge: '⚡ VidMody 1080p',
            url: vidmodyMatch[1],
            isHls: false,
            isDirectVideo: false
          });
        }

        // 2. Check for JSON-LD direct MP4
        const jsonLdMatch = html.match(/<script id="jsonld-video"[^>]*>([\s\S]*?)<\/script>/i);
        if (jsonLdMatch) {
          try {
            const data = JSON.parse(jsonLdMatch[1]);
            if (data.contentUrl && data.contentUrl.endsWith('.mp4')) {
              sources.push({
                id: `hfd_direct_mp4_${slug}`,
                name: 'VIP Direct MP4',
                badge: '⚡ MP4 Hızlı',
                url: data.contentUrl,
                streamUrl: data.contentUrl,
                isHls: false,
                isDirectVideo: true
              });
            }
            if (data.embedUrl && !sources.some(s => s.url === data.embedUrl)) {
              sources.push({
                id: `hfd_embed_${slug}`,
                name: 'VIP Hat 7',
                badge: '⚡ VIP Web',
                url: data.embedUrl,
                isHls: false,
                isDirectVideo: false
              });
            }
          } catch (_) {}
        }

        if (sources.length > 0) break;
      } catch (_) {}
    }

    if (sources.length > 0) break;
  }

  return sources;
}

/* ==========================================================================
   HDFilmIzle Scraper (HDFilmIzle.vip)
   Fetches Vidrame, VidMoly & Rapidame Turkish Dubbed & Subtitled Streams
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

export async function fetchHDFilmizleSources({
  type = 'movie',
  titles = [],
  title = '',
  originalTitle = '',
  isDub = true
}) {
  if (type !== 'movie') return [];

  const isBrowser = typeof window !== 'undefined';
  const baseUrl = isBrowser ? '/api/hdi' : 'https://www.hdfilmizle.vip';

  const allTitles = Array.from(new Set([
    title,
    originalTitle,
    ...(titles || [])
  ])).filter(Boolean);

  const sources = [];

  for (const t of allTitles) {
    const slug = slugify(t);
    if (!slug) continue;

    const candidatePaths = [
      `/${slug}/`,
      `/${slug}-izle/`,
      `/${slug}-hd/`,
      `/${slug}-2026/`,
      `/${slug}-2025/`,
      `/${slug}-2024/`,
      `/${slug}-2023/`
    ];

    for (const path of candidatePaths) {
      try {
        const targetUrl = `${baseUrl}${path}`;
        const res = await fetch(targetUrl, { signal: AbortSignal.timeout(3000) });
        if (!res.ok) continue;
        const html = await res.text();
        if (!html || html.length < 500 || html.includes('404 Not Found')) continue;

        // 1. Check for parts JSON
        const partsMatch = html.match(/let\s+parts\s*=\s*(\[[\s\S]*?\]);/i);
        if (partsMatch) {
          try {
            const parts = JSON.parse(partsMatch[1]);
            for (const part of parts) {
              const lang = (part.lang || '').toLowerCase();
              const isDual = lang.includes('dual') || lang.includes('tr-en');
              const isTr = lang.includes('tr') || lang.includes('dublaj');
              const isSub = lang.includes('sub') || lang.includes('altyazi') || lang.includes('en');

              const matchesLang = isDub ? (isTr || isDual) : (isSub || isDual);
              if (!matchesLang) continue;

              let playerUrl = '';
              if (part.data) {
                const srcMatch = part.data.match(/src=["']([^"']+)["']/i);
                if (srcMatch) playerUrl = srcMatch[1].replace(/\\/g, '');
              }

              if (playerUrl) {
                const name = part.name || 'Vidrame';
                sources.push({
                  id: `hdi_${part.id || slug}`,
                  name: `${name} 1080p`,
                  displayName: `${name} 1080p`,
                  badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
                  url: playerUrl,
                  isHls: playerUrl.includes('.m3u8'),
                  isDirectVideo: false
                });
              }
            }
          } catch (_) {}
        }

        // 2. Direct iframe data-src
        const dataSrcMatch = html.match(/data-src=["'](https?:\/\/(?:vidrame|vidmoly|rapidame|closeload|stream)[^"']+)["']/i);
        if (dataSrcMatch && sources.length === 0) {
          const streamUrl = dataSrcMatch[1];
          sources.push({
            id: `hdi_direct_${slug}`,
            name: streamUrl.includes('vidrame') ? 'Vidrame Pro' : 'VidMoly 1080p',
            displayName: streamUrl.includes('vidrame') ? 'Vidrame Pro' : 'VidMoly 1080p',
            badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
            url: streamUrl,
            isHls: streamUrl.includes('.m3u8'),
            isDirectVideo: false
          });
        }

        if (sources.length > 0) return sources;
      } catch (_) {}
    }
  }

  return sources;
}

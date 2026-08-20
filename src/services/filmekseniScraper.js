/* ==========================================================================
   FilmEkseni Scraper (FilmEkseni.vip)
   High-quality Turkish Dubbed & Subtitled Movies & VIP Players
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

export async function fetchFilmEkseniSources({
  type = 'movie',
  titles = [],
  title = '',
  originalTitle = '',
  isDub = true
}) {
  if (type !== 'movie') return [];

  const isBrowser = typeof window !== 'undefined';
  const baseUrl = isBrowser ? '/api/fex' : 'https://filmekseni.vip';

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
      `${baseUrl}/${slug}-izle/`,
      `${baseUrl}/${slug}-izle-hd/`,
      `${baseUrl}/${slug}/`,
      `${baseUrl}/${slug}-2024-izle/`,
      `${baseUrl}/${slug}-2025-izle/`,
      `${baseUrl}/${slug}-2026-izle/`
    ];

    for (const movieUrl of candidateUrls) {
      try {
        const res = await fetch(movieUrl, { signal: AbortSignal.timeout(3000) });
        if (!res.ok) continue;
        const html = await res.text();
        if (!html || html.length < 500 || html.includes('404 Not Found')) continue;

        // Check for videoPlayerData JSON
        const vDataMatch = html.match(/videoPlayerData\(([\s\S]*?)\),\s*defaultLang/i) || html.match(/videoPlayerData\(([\s\S]*?)\)/i);
        if (vDataMatch) {
          try {
            const rawJsonStr = vDataMatch[1].trim();
            let parsedData = null;
            if (rawJsonStr.startsWith("JSON.parse('")) {
              const unescaped = rawJsonStr.slice(12, -2).replace(/\\u0022/g, '"').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
              parsedData = JSON.parse(unescaped);
            } else {
              parsedData = JSON.parse(rawJsonStr);
            }

            if (parsedData) {
              const items = isDub ? (parsedData.dual || parsedData.tr || parsedData.dublaj || []) : (parsedData.sub || parsedData.altyazi || parsedData.en || []);
              for (const item of items) {
                if (item.link) {
                  let playerUrl = `https://eksenload.top/eplayer/${item.link}`;
                  if (item.template) {
                    try {
                      const decodedTemplate = atob(item.template);
                      const srcMatch = decodedTemplate.match(/data-src=["']([^"']+)["']/i) || decodedTemplate.match(/src=["']([^"']+)["']/i);
                      if (srcMatch) {
                        playerUrl = srcMatch[1].replace('{url}', item.link).replace('{slug}', item.slug || slug);
                        if (playerUrl.startsWith('//')) playerUrl = `https:${playerUrl}`;
                      }
                    } catch (_) {}
                  }

                  const hostName = item.service_name || (playerUrl.includes('eksenload') ? 'EksenLoad VIP' : 'Eksen Player 1080p');
                  sources.push({
                    id: `fex_${item.service_slug || 'vip'}_${item.link}`,
                    name: `${hostName}`,
                    displayName: `${hostName}`,
                    badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
                    url: playerUrl,
                    isHls: false,
                    isDirectVideo: false
                  });
                }
              }
            }
          } catch (_) {}
        }

        // Direct iframes fallback
        if (sources.length === 0) {
          const iframes = html.match(/<iframe[^>]+src=["']([^"']*(?:eksenload|vidmoly|fembed|streamtape|snwix)[^"']*)["']/gi) || [];
          for (const ifr of iframes) {
            const src = (ifr.match(/src=["']([^"']+)["']/i) || [])[1];
            if (src) {
              const name = src.includes('vidmoly') ? 'VidMoly 1080p' : 'EksenLoad VIP';
              sources.push({
                id: `fex_iframe_${slug}_${Math.random().toString(36).substring(2, 6)}`,
                name: name,
                displayName: name,
                badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
                url: src.startsWith('//') ? `https:${src}` : src,
                isHls: false,
                isDirectVideo: false
              });
            }
          }
        }

        if (sources.length > 0) return sources;
      } catch (_) {}
    }
  }

  return sources;
}

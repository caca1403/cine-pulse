import { extractVidmolyStream } from './streamExtractors.js';

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

  const candidateUrls = [];
  for (const t of allTitles) {
    const slug = slugify(t);
    if (!slug) continue;

    candidateUrls.push(
      `${baseUrl}/${slug}-izle/`,
      `${baseUrl}/hd-${slug}-izle/`,
      `${baseUrl}/${slug}/`,
      `${baseUrl}/hd-${slug}/`,
      `${baseUrl}/${slug}-izle-hd/`,
      `${baseUrl}/${slug}-2024-izle/`,
      `${baseUrl}/${slug}-2025-izle/`
    );
  }

  if (candidateUrls.length === 0) return [];

  const uniqueUrls = [...new Set(candidateUrls)];

  // Fetch all candidate URLs in parallel
  const htmlResults = await Promise.all(
    uniqueUrls.map(async (movieUrl) => {
      try {
        const res = await fetch(movieUrl, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) return null;
        const html = await res.text();
        if (!html || html.length < 500 || html.includes('404 Not Found')) return null;
        return { movieUrl, html };
      } catch (_) {
        return null;
      }
    })
  );

  const sources = [];

  for (const match of htmlResults.filter(Boolean)) {
    const { html, movieUrl } = match;

    // Check for videoPlayerData JSON
    let parsedData = null;
    const jsonParseMatch = html.match(/videoPlayerData\(JSON\.parse\('([\s\S]*?)'\)/i)
      || html.match(/JSON\.parse\('(\{\\u0022[\s\S]*?\})'\)/i);

    if (jsonParseMatch) {
      try {
        const unescaped = jsonParseMatch[1]
          .replace(/\\u0022/g, '"')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
        parsedData = JSON.parse(unescaped);
      } catch (_) {}
    }

    if (!parsedData) {
      const rawMatch = html.match(/videoPlayerData\((\{[\s\S]*?\}),\s*(?:['"][a-z]+['"]|defaultLang)/i);
      if (rawMatch) {
        try {
          parsedData = JSON.parse(rawMatch[1]);
        } catch (_) {}
      }
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
                playerUrl = srcMatch[1].replace('{url}', item.link).replace('{slug}', item.slug || 'movie');
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
            streamUrl: playerUrl,
            isHls: false,
            isDirectVideo: false,
            getUrl: () => playerUrl
          });
        }
      }
    }

    // Direct iframes fallback
    if (sources.length === 0) {
      const iframes = html.match(/<iframe[^>]+src=["']([^"']*(?:eksenload|vidmoly|fembed|streamtape|snwix)[^"']*)["']/gi) || [];
      for (const ifr of iframes) {
        const src = (ifr.match(/src=["']([^"']+)["']/i) || [])[1];
        if (src) {
          const isVidmoly = src.includes('vidmoly');
          const fullSrc = src.startsWith('//') ? `https:${src}` : src;

          let direct = null;
          if (isVidmoly) {
            try {
              direct = await extractVidmolyStream(fullSrc);
            } catch (_) {}
          }

          const isDirect = !!(direct && direct.url);
          const finalUrl = direct?.url || fullSrc;
          const name = isVidmoly
            ? (isDirect ? 'VidMoly Direct 1080p' : 'VidMoly 1080p')
            : 'EksenLoad VIP';

          sources.push({
            id: `fex_iframe_${Math.random().toString(36).substring(2, 6)}`,
            name: name,
            displayName: name,
            badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
            url: finalUrl,
            streamUrl: finalUrl,
            isHls: isDirect || finalUrl.includes('.m3u8'),
            isDirectVideo: isDirect,
            getUrl: () => finalUrl
          });
        }
      }
    }

    if (sources.length > 0) return sources;
  }

  return sources;
}

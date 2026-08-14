/* ==========================================================================
   CinePulse Studio - FilmMakinesi Scraper
   Extracts high-speed 1080p Rapid (rapidrame) and CloseLoad streams from
   FilmMakinesi.to via CF Worker Gateway and reverse-engineered Dean Edwards
   deobfuscation.
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function toTurkishSlug(title) {
  if (!title) return '';
  const cleanStr = title.replace(/\s*\(\d{4}\).*/, '').trim();
  return cleanStr
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

function decodeRapidOrClose(packedScript) {
  if (!packedScript || typeof packedScript !== 'string') return null;
  try {
    const splitStrMatch = packedScript.match(/'(\|result[\s\S]*?join)'\.split\('\|'\)/);
    if (!splitStrMatch) return null;
    const dict = splitStrMatch[1].split('|');

    function e(c) {
      const a = 62;
      return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36));
    }

    const allTokensMatch = packedScript.match(/\[("(?:[0-9a-zA-Z]+|==)",?\s*)+\]/);
    if (!allTokensMatch) return null;

    const rawTokens = JSON.parse(allTokensMatch[0]);
    const resolvedStrings = rawTokens.map(token => {
      if (token === '==') return '==';
      for (let c = 0; c < dict.length; c++) {
        if (e(c) === token) return dict[c];
      }
      return token;
    });

    let value_parts = resolvedStrings.join('');
    let result = atob(value_parts);
    result = result.replace(/[a-zA-Z]/g, function(c) {
      let base = c.charCodeAt(0), offset = (base <= 90) ? 65 : 97;
      return String.fromCharCode((base - offset + 13) % 26 + offset);
    });
    result = result.replace(/[a-zA-Z]/g, function(c) {
      let base = c.charCodeAt(0), offset = (base <= 90) ? 65 : 97;
      return String.fromCharCode((base - offset + 10) % 26 + offset);
    });
    result = result.replace(/[a-zA-Z]/g, function(c) {
      let base = c.charCodeAt(0), offset = (base <= 90) ? 65 : 97;
      return String.fromCharCode((base - offset + 9) % 26 + offset);
    });
    result = atob(result);
    let acc = 78;
    let unmix = '';
    for (let i = 0; i < result.length; i++) {
      let charCode = result.charCodeAt(i);
      acc = (acc + 19) % 256;
      let plain = charCode ^ acc;
      acc = (acc + charCode) % 256;
      unmix += String.fromCharCode(plain);
    }
    return unmix;
  } catch (_) {
    return null;
  }
}

export async function fetchFilmMakinesiSources({
  type = 'tv',
  seriesTitle = '',
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = true
}) {
  const targetTitle = seriesTitle || title;
  const isMovie = type === 'movie';

  const candidateTitles = [];
  if (targetTitle) candidateTitles.push(targetTitle);
  if (originalTitle && originalTitle !== targetTitle) candidateTitles.push(originalTitle);

  const candidateSlugs = [];
  candidateTitles.forEach(t => {
    const slug = toTurkishSlug(t);
    if (slug) {
      if (!candidateSlugs.includes(slug)) candidateSlugs.push(slug);
      if (slug.startsWith('the-')) {
        const noThe = slug.replace(/^the-/, '');
        if (!candidateSlugs.includes(noThe)) candidateSlugs.push(noThe);
      }
    }
  });

  if (candidateSlugs.length === 0) return [];

  const baseDomains = ['https://filmmakinesi.to', 'https://filmmakinesi.net'];
  const sources = [];

  for (const baseDomain of baseDomains) {
    if (sources.length > 0) break;

    // Generate Direct candidate URLs
    const candidateUrls = [];
    for (const slug of candidateSlugs) {
      if (isMovie) {
        candidateUrls.push(
          `${baseDomain}/${slug}-izle-fm1/`,
          `${baseDomain}/${slug}-izle/`,
          `${baseDomain}/${slug}/`,
          `${baseDomain}/${slug}-fm1/`,
          `${baseDomain}/film/${slug}-izle/`,
          `${baseDomain}/film/${slug}/`
        );
      } else {
        candidateUrls.push(
          `${baseDomain}/dizi/${slug}-izle-2022-fm1/sezon-${season}/bolum-${episode}/`,
          `${baseDomain}/dizi/${slug}-izle-2023-fm14/sezon-${season}/bolum-${episode}/`,
          `${baseDomain}/dizi/${slug}-izle-2024-fmxrpu/sezon-${season}/bolum-${episode}/`,
          `${baseDomain}/dizi/${slug}-izle-fm1/sezon-${season}/bolum-${episode}/`,
          `${baseDomain}/dizi/${slug}-izle/sezon-${season}/bolum-${episode}/`,
          `${baseDomain}/dizi/${slug}/sezon-${season}/bolum-${episode}/`,
          `${baseDomain}/dizi/${slug}-2026/sezon-${season}/bolum-${episode}/`,
          `${baseDomain}/dizi/${slug}-2024/sezon-${season}/bolum-${episode}/`
        );
      }
    }

    for (const testUrl of candidateUrls) {
      try {
        const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(testUrl)}`;
        const res = await fetch(proxyUrl, {
          headers: { 'Referer': baseDomain }
        }).catch(() => null);

        if (!res || !res.ok) continue;
        const html = await res.text();
        if (html.includes('404 - Sayfa Bulunamadı') || html.includes('Mevcut Değil')) continue;

        // Extract video-parts data-video_url
        const videoUrls = [...html.matchAll(/data-video_url="([^"]+)"/gi)].map(m => m[1]);
        const iframes = [...html.matchAll(/<iframe[^>]*src="([^"]+)"/gi)].map(m => m[1]);
        const allEmbeds = [...new Set([...videoUrls, ...iframes])].filter(u => 
          !u.includes('youtube.com') && !u.includes('google.com') && !u.includes('recaptcha')
        );

        for (const embedUrl of allEmbeds) {
          try {
            const isRapid = embedUrl.includes('rapid');
            const isClose = embedUrl.includes('closeload');
            const embedProxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(embedUrl)}`;
            const eRes = await fetch(embedProxyUrl, {
              headers: { 'Referer': testUrl }
            }).catch(() => null);

            let directStreamUrl = null;
            if (eRes && eRes.ok) {
              const eHtml = await eRes.text();
              directStreamUrl = decodeRapidOrClose(eHtml) || eHtml.match(/https?:\/\/[^"'\s]*(?:\.m3u8|master\.txt)[^"'\s]*/i)?.[0];
            }

            const finalStreamUrl = directStreamUrl || embedUrl;
            const isHls = finalStreamUrl.includes('.m3u8') || finalStreamUrl.includes('master.txt');

            if (isRapid) {
              sources.push({
                id: `fmk_rapid_${season}_${episode}`,
                name: `Rapid Stream (${isDub ? 'Dublaj 1080p' : 'Altyazılı 1080p'})`,
                badge: '⚡ Rapid 1080p',
                category: isDub ? 'dubbed' : 'subtitled',
                streamUrl: finalStreamUrl,
                url: finalStreamUrl,
                isHls,
                getUrl: () => finalStreamUrl
              });
            } else if (isClose) {
              sources.push({
                id: `fmk_close_${season}_${episode}`,
                name: `CloseLoad (${isDub ? 'Dublaj 1080p' : 'Altyazılı 1080p'})`,
                badge: '⚡ CloseLoad 1080p',
                category: isDub ? 'dubbed' : 'subtitled',
                streamUrl: finalStreamUrl,
                url: finalStreamUrl,
                isHls,
                getUrl: () => finalStreamUrl
              });
            } else if (finalStreamUrl) {
              sources.push({
                id: `fmk_stream_${season}_${episode}`,
                name: `FilmMakinesi (${isDub ? 'Dublaj' : 'Altyazılı'} 1080p)`,
                badge: '⚡ FMK 1080p',
                category: isDub ? 'dubbed' : 'subtitled',
                streamUrl: finalStreamUrl,
                url: finalStreamUrl,
                isHls,
                getUrl: () => finalStreamUrl
              });
            }
          } catch (_) {}
        }

        if (sources.length > 0) break;
      } catch (_) {}
    }
  }

  return sources;
}

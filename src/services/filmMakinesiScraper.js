/* ==========================================================================
   CinePulse Studio - FilmMakinesi (Rapid & CloseLoad) Scraper
   Fetches live 1080p DUAL (Turkish Dubbed & Subtitled) Rapid and CloseLoad
   streams from FilmMakinesi.to with high-speed concurrent matching.
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

  const baseDomain = 'https://filmmakinesi.to';
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

  // Concurrent URL check for ultra-fast < 400ms discovery
  const fetchPromises = candidateUrls.map(async (testUrl) => {
    try {
      const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(testUrl)}`;
      const res = await fetch(proxyUrl, {
        headers: { 'Referer': baseDomain }
      });
      if (!res.ok) return null;
      const html = await res.text();
      if (html.includes('404 - Sayfa Bulunamadı') || html.includes('Mevcut Değil') || html.length < 5000) {
        return null;
      }
      return { testUrl, html };
    } catch {
      return null;
    }
  });

  const responses = await Promise.all(fetchPromises);
  const matched = responses.find(r => r !== null);
  if (!matched) return [];

  const html = matched.html;
  const videoUrls = [...html.matchAll(/data-video_url="([^"]+)"/gi)].map(m => m[1]);
  const iframes = [...html.matchAll(/<iframe[^>]*src="([^"]+)"/gi)].map(m => m[1]);
  const allEmbeds = [...new Set([...videoUrls, ...iframes])].filter(u => 
    !u.includes('youtube.com') && !u.includes('google.com') && !u.includes('recaptcha') && u.length > 10
  );

  const sources = [];

  for (const embedUrl of allEmbeds) {
    const isRapid = embedUrl.includes('rapid');
    const isClose = embedUrl.includes('closeload');

    if (isRapid) {
      sources.push({
        id: `fmk_rapid_${isDub ? 'dub' : 'sub'}_${season}_${episode}`,
        name: `Rapid Stream (${isDub ? 'Dublaj 1080p' : 'Altyazılı 1080p'})`,
        badge: '⚡ Rapid 1080p',
        category: isDub ? 'dubbed' : 'subtitled',
        streamUrl: embedUrl,
        url: embedUrl,
        getUrl: () => embedUrl
      });
    } else if (isClose) {
      sources.push({
        id: `fmk_close_${isDub ? 'dub' : 'sub'}_${season}_${episode}`,
        name: `CloseLoad (${isDub ? 'Dublaj 1080p' : 'Altyazılı 1080p'})`,
        badge: '⚡ CloseLoad 1080p',
        category: isDub ? 'dubbed' : 'subtitled',
        streamUrl: embedUrl,
        url: embedUrl,
        getUrl: () => embedUrl
      });
    } else {
      sources.push({
        id: `fmk_stream_${isDub ? 'dub' : 'sub'}_${season}_${episode}`,
        name: `FilmMakinesi (${isDub ? 'Dublaj 1080p' : 'Altyazılı 1080p'})`,
        badge: '⚡ FMK 1080p',
        category: isDub ? 'dubbed' : 'subtitled',
        streamUrl: embedUrl,
        url: embedUrl,
        getUrl: () => embedUrl
      });
    }
  }

  return sources;
}

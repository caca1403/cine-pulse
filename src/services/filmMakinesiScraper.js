/* ==========================================================================
   CinePulse Studio - FilmMakinesi (Rapid & CloseLoad) Scraper
   Fetches live DUAL (Turkish Dubbed & Subtitled) Rapid and CloseLoad
   streams from FilmMakinesi with high-speed multi-proxy fallback.
   ========================================================================== */

const PROXIES = [
  (u) => `https://wild-credit-e1ae.cagatayca07.workers.dev?url=${encodeURIComponent(u)}`,
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`
];

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

  const baseDomains = ['https://filmmakinesi.to', 'https://filmmakinesi.org', 'https://filmmakinesi.net'];
  const candidateUrls = [];

  for (const baseDomain of baseDomains) {
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
  }

  // Fast concurrent probe
  const fetchPromises = candidateUrls.slice(0, 12).map(async (testUrl) => {
    for (const getProxyUrl of PROXIES) {
      try {
        const proxyUrl = getProxyUrl(testUrl);
        const res = await fetch(proxyUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        if (!res.ok) continue;
        const html = await res.text();
        if (html.includes('404 - Sayfa Bulunamadı') || html.includes('Mevcut Değil') || html.includes('Just a moment') || html.length < 2000) {
          continue;
        }
        return { testUrl, html };
      } catch {
        continue;
      }
    }
    return null;
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
        name: `Rapid Stream (${isDub ? 'Dublaj' : 'Altyazılı'})`,
        badge: '⚡ Rapid',
        category: isDub ? 'dubbed' : 'subtitled',
        streamUrl: embedUrl,
        url: embedUrl,
        getUrl: () => embedUrl
      });
    } else if (isClose) {
      sources.push({
        id: `fmk_close_${isDub ? 'dub' : 'sub'}_${season}_${episode}`,
        name: `CloseLoad (${isDub ? 'Dublaj' : 'Altyazılı'})`,
        badge: '⚡ CloseLoad',
        category: isDub ? 'dubbed' : 'subtitled',
        streamUrl: embedUrl,
        url: embedUrl,
        getUrl: () => embedUrl
      });
    } else {
      sources.push({
        id: `fmk_stream_${isDub ? 'dub' : 'sub'}_${season}_${episode}`,
        name: `FilmMakinesi (${isDub ? 'Dublaj' : 'Altyazılı'})`,
        badge: '⚡ FMK',
        category: isDub ? 'dubbed' : 'subtitled',
        streamUrl: embedUrl,
        url: embedUrl,
        getUrl: () => embedUrl
      });
    }
  }

  return sources;
}

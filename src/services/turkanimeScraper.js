const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function toTurkishSlug(title) {
  if (!title) return '';
  return title
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

export async function fetchTurkAnimeSources({ titles = [], seriesTitle = '', title = '', originalTitle = '', season = 1, episode = 1, isDub = false }) {
  const candidateTitles = [...new Set([
    ...titles,
    seriesTitle,
    title,
    originalTitle
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 1);

  if (candidateTitles.length === 0) return [];

  const candidateSlugs = [...new Set(candidateTitles.map(t => toTurkishSlug(t)).filter(Boolean))];

  for (const slug of candidateSlugs) {
    if (!slug) continue;
    try {
      const epUrl = `https://www.turkanime.co/video/${slug}-${episode}-bolum`;
      const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(epUrl)}`;

      const res = await fetch(proxyUrl).catch(() => null);
      if (!res || !res.ok) continue;

      const html = await res.text();
      if (html.includes('Bulunamadı') || html.includes('404') || html.length < 500) continue;

      return [
        {
          id: `ta_${slug}_${episode}`,
          name: `TürkAnime TV (${slug} - Bölüm ${episode})`,
          badge: '🎌 TürkAnime',
          category: isDub ? 'dubbed' : 'subtitled',
          isExternalPopout: true,
          streamUrl: epUrl,
          url: epUrl,
          getUrl: () => epUrl
        }
      ];
    } catch (e) {
      console.warn('[TurkAnimeScraper] Error:', e.message);
    }
  }

  return [];
}

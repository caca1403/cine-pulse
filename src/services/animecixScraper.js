/* ==========================================================================
   CinePulse Studio - AnimeciX Dedicated Scraper
   Fetches AnimeciX official streams (Configured for popup mode to bypass SAMEORIGIN)
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function toSlug(text) {
  if (!text) return '';
  return text
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

export async function fetchAnimecixSources({ titles = [], seriesTitle = '', title = '', originalTitle = '', season = 1, episode = 1, isDub = false }) {
  const candidateQueries = [...new Set([
    ...titles,
    seriesTitle,
    title,
    originalTitle
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 1);

  if (candidateQueries.length === 0) return [];

  for (const q of candidateQueries) {
    try {
      const searchUrl = `https://animecix.net/secure/search/${encodeURIComponent(q)}`;
      const proxySearchUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(searchUrl)}`;

      const res = await fetch(proxySearchUrl).catch(() => null);
      if (!res || !res.ok) continue;

      const data = await res.json().catch(() => null);
      const results = data && data.results ? data.results : [];
      if (results.length === 0) continue;

      // Best match
      const match = results[0];
      const animeName = match.name || match.name_english || match.name_romanji || q;
      const slug = toSlug(animeName);

      // Episode watch URL
      const watchUrl = `https://animecix.net/titles/${match.id}/${slug}/episode/${episode}`;

      return [
        {
          id: `acx_${match.id}_${episode}`,
          name: `AnimeciX VIP (${animeName} 1080p)`,
          badge: '⚡ AnimeciX',
          category: isDub ? 'dubbed' : 'subtitled',
          isExternalPopout: true, // Opens in external popout so iframe never breaks
          streamUrl: watchUrl,
          url: watchUrl,
          getUrl: () => watchUrl
        }
      ];
    } catch (e) {
      console.warn('[AnimecixScraper] Error:', e.message);
    }
  }

  return [];
}

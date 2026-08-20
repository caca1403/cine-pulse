/* ==========================================================================
   CinePulse Studio - Perfect SezonlukDizi Scraper Module
   Flawlessly extracts VidMoly, Sibnet, Netu, and other active streams.
   Uses /api/szd Vercel proxy to eliminate CORS.
   ========================================================================== */

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

export async function fetchSezonlukDiziEpisodeSources({ titles = [], seriesTitle = '', originalTitle = '', season = 1, episode = 1, isDub = true }) {
  const isBrowser = typeof window !== 'undefined';
  const apiBase = isBrowser ? '/api/szd' : 'https://sezonlukdizi.cc';

  const allTitles = [...new Set([...titles, seriesTitle, originalTitle])].filter(t => t && typeof t === 'string' && t.trim().length > 1);
  if (allTitles.length === 0) return [];

  const candidateSlugs = [];
  for (const t of allTitles) {
    const s = toTurkishSlug(t);
    if (s && !candidateSlugs.includes(s)) {
      candidateSlugs.push(s);
      if (!s.endsWith('-izle')) candidateSlugs.push(`${s}-izle`);
      
      if (s.startsWith('the-')) {
        const noThe = s.replace(/^the-/, '');
        if (!candidateSlugs.includes(noThe)) candidateSlugs.push(noThe);
      }
    }
  }

  for (const slug of candidateSlugs) {
    try {
      const pageUrl = `${apiBase}/${slug}/${season}-sezon-${episode}-bolum.html`;

      const res = await fetch(pageUrl, {
        headers: isBrowser ? {} : {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://sezonlukdizi.cc/'
        },
        signal: AbortSignal.timeout(4000)
      }).catch(() => null);

      if (!res || !res.ok) continue;
      const html = await res.text();

      const bidMatch = html.match(/data-id=["'](\d+)["']/i) || html.match(/var\s+bid\s*=\s*["']?(\d+)["']?/i) || html.match(/bid\s*=\s*(\d+)/i);
      const bid = bidMatch ? bidMatch[1] : null;
      if (!bid) continue;

      const dilParam = isDub ? '0' : '1';
      const altUrl = `${apiBase}/ajax/dataAlternatif22.asp`;

      const altRes = await fetch(altUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
          ...(isBrowser ? {} : {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Referer': 'https://sezonlukdizi.cc/'
          })
        },
        body: `bid=${bid}&dil=${dilParam}`,
        signal: AbortSignal.timeout(4000)
      }).catch(() => null);

      if (!altRes || !altRes.ok) continue;
      const altJson = await altRes.json().catch(() => null);
      if (!altJson || altJson.status !== 'success' || !Array.isArray(altJson.data) || altJson.data.length === 0) continue;

      const extractedSources = [];

      for (const item of altJson.data) {
        const embedUrlEndpoint = `${apiBase}/ajax/dataEmbed22.asp`;

        const emRes = await fetch(embedUrlEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            ...(isBrowser ? {} : {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              'Referer': 'https://sezonlukdizi.cc/'
            })
          },
          body: `id=${item.id}`,
          signal: AbortSignal.timeout(4000)
        }).catch(() => null);

        if (!emRes || !emRes.ok) continue;
        const emText = await emRes.text().catch(() => '');
        const srcMatch = emText.match(/src=["']([^"']+)["']/i);
        let iframeUrl = srcMatch ? srcMatch[1] : null;

        if (iframeUrl && !iframeUrl.includes('reCAPTCHA') && iframeUrl.length > 10) {
          if (
            item.baslik?.toLowerCase().includes('filemoon') ||
            iframeUrl.includes('bysejikuar') ||
            iframeUrl.includes('filemoon')
          ) {
            continue;
          }

          if (iframeUrl.startsWith('//')) {
            iframeUrl = 'https:' + iframeUrl;
          }

          const serverName = item.baslik === 'VidMoly' ? 'VidMoly 1080p' : `${item.baslik} HD`;

          extractedSources.push({
            id: `szd_${item.id}`,
            name: serverName,
            displayName: serverName,
            badge: `⚡ ${item.baslik}`,
            category: isDub ? 'dubbed' : 'subtitled',
            url: iframeUrl,
            streamUrl: iframeUrl,
            getUrl: () => iframeUrl
          });
        }
      }

      if (extractedSources.length > 0) {
        return extractedSources;
      }
    } catch (err) {
      console.warn('[SezonlukDiziScraper] Error:', err);
    }
  }

  return [];
}

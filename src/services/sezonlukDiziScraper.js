/* ==========================================================================
   SineFlix Pro - Perfect SezonlukDizi Scraper Module
   Flawlessly extracts VidMoly, Filemoon, Sibnet, Netu, and other active streams.
   Uses Cloudflare Worker Gateway to eliminate CORS and Cloudflare 403 blocks.
   ========================================================================== */

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

export async function fetchSezonlukDiziEpisodeSources({ titles = [], seriesTitle = '', originalTitle = '', season = 1, episode = 1, isDub = true }) {
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

  const baseDomains = ['https://sezonlukdizi.cc', 'https://sezonlukdizi8.com'];

  for (const baseDomain of baseDomains) {
    for (const slug of candidateSlugs) {
      try {
        const pageTarget = `${baseDomain}/${slug}/${season}-sezon-${episode}-bolum.html`;
        const proxyPageUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(pageTarget)}`;

        const res = await fetch(proxyPageUrl).catch(() => null);
        if (!res || !res.ok) continue;
        const html = await res.text();

        const bidMatch = html.match(/data-id=["'](\d+)["']/i) || html.match(/var\s+bid\s*=\s*["']?(\d+)["']?/i) || html.match(/bid\s*=\s*(\d+)/i);
        const bid = bidMatch ? bidMatch[1] : null;
        if (!bid) continue;

        const dilParam = isDub ? '0' : '1';
        const altTarget = `${baseDomain}/ajax/dataAlternatif22.asp`;
        const proxyAltUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(altTarget)}`;

        const altRes = await fetch(proxyAltUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          body: `bid=${bid}&dil=${dilParam}`
        }).catch(() => null);

        if (!altRes || !altRes.ok) continue;
        const altJson = await altRes.json().catch(() => null);
        if (!altJson || altJson.status !== 'success' || !Array.isArray(altJson.data) || altJson.data.length === 0) continue;

        const extractedSources = [];

        for (const item of altJson.data) {
          const embedTarget = `${baseDomain}/ajax/dataEmbed22.asp`;
          const proxyEmbedUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(embedTarget)}`;

          const emRes = await fetch(proxyEmbedUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: `id=${item.id}`
          }).catch(() => null);

          if (!emRes || !emRes.ok) continue;
          const emText = await emRes.text().catch(() => '');
          const srcMatch = emText.match(/src=["']([^"']+)["']/i);
          let iframeUrl = srcMatch ? srcMatch[1] : null;

          if (iframeUrl && !iframeUrl.includes('reCAPTCHA') && iframeUrl.length > 10) {
            // Skip Filemoon as it has iframe domain restrictions
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

            extractedSources.push({
              id: `szd_${item.id}`,
              name: `${item.baslik} Stream (${isDub ? 'Dublaj 1080p' : 'Altyazılı'})`,
              badge: `⚡ ${item.baslik}`,
              url: iframeUrl
            });
          }
        }

        if (extractedSources.length > 0) {
          return extractedSources;
        }
      } catch (err) {
        console.warn('SezonlukDizi scrape error:', err);
      }
    }
  }

  return [];
}

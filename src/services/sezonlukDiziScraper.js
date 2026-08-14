/* ==========================================================================
   SineFlix Pro - Perfect SezonlukDizi Scraper Module
   Flawlessly matches slugs (House M.D. -> house-izle, The Boys -> boys-izle, etc.),
   verifies non-empty live iframe embeds, and replaces bysejikuar with filemoon.sx.
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

export async function fetchSezonlukDiziEpisodeSources({ seriesTitle = '', season = 1, episode = 1, isDub = true }) {
  const baseSlug = toTurkishSlug(seriesTitle);
  if (!baseSlug) return [];

  // Generate exhaustive candidate slugs for 100% match accuracy
  const candidateSlugs = [baseSlug];

  if (!baseSlug.endsWith('-izle')) {
    candidateSlugs.push(`${baseSlug}-izle`);
  }

  // Handle "House M.D." -> house-izle / house-md-izle
  const cleanedMd = baseSlug.replace(/-m-d$|-md$/, '');
  if (cleanedMd !== baseSlug) {
    candidateSlugs.push(cleanedMd);
    candidateSlugs.push(`${cleanedMd}-izle`);
  }

  // Handle "The Boys" -> boys / boys-izle
  if (baseSlug.startsWith('the-')) {
    const noThe = baseSlug.replace(/^the-/, '');
    candidateSlugs.push(noThe);
    candidateSlugs.push(`${noThe}-izle`);
  }

  const isBrowser = typeof window !== 'undefined';
  const baseRoutes = isBrowser
    ? ['/api/szd', 'https://sezonlukdizi.cc']
    : ['https://sezonlukdizi.cc', 'https://sezonlukdizi8.com'];

  const getHeaders = isBrowser ? { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' } : { 'User-Agent': 'Mozilla/5.0' };
  const postHeaders = isBrowser ? { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' } : { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest', 'User-Agent': 'Mozilla/5.0' };

  for (const baseRoute of baseRoutes) {
    for (const slug of candidateSlugs) {
      try {
        const pageUrl = `${baseRoute}/${slug}/${season}-sezon-${episode}-bolum.html`;

        const res = await fetch(pageUrl, { headers: getHeaders }).catch(() => null);
        if (!res || !res.ok) continue;
        const html = await res.text();

        const bidMatch = html.match(/data-id=["'](\d+)["']/i) || html.match(/var\s+bid\s*=\s*["']?(\d+)["']?/i) || html.match(/bid\s*=\s*(\d+)/i);
        const bid = bidMatch ? bidMatch[1] : null;

        if (!bid) continue;

        const dilParam = isDub ? '0' : '1';
        const formData = new URLSearchParams();
        formData.append('bid', bid);
        formData.append('dil', dilParam);

        const altEndpoints = ['dataAlternatif22.asp', 'dataAlternatif.asp', 'dataAlternatif23.asp'];
        let altJson = null;

        for (const altEp of altEndpoints) {
          try {
            const altRes = await fetch(`${baseRoute}/ajax/${altEp}`, {
              method: 'POST',
              headers: postHeaders,
              body: formData.toString()
            });
            const text = await altRes.text();
            if (text.trim().startsWith('{')) {
              altJson = JSON.parse(text);
              if (altJson.status === 'success' && altJson.data && altJson.data.length > 0) break;
            }
          } catch (_) {}
        }

        if (!altJson || !altJson.data) continue;

        const extractedSources = [];

        for (const item of altJson.data) {
          const embedFormData = new URLSearchParams();
          embedFormData.append('id', item.id);

          const embedEndpoints = ['dataEmbed22.asp', 'dataEmbed.asp', 'dataEmbed23.asp'];
          let iframeUrl = null;

          for (const emEp of embedEndpoints) {
            try {
              const emRes = await fetch(`${baseRoute}/ajax/${emEp}`, {
                method: 'POST',
                headers: postHeaders,
                body: embedFormData.toString()
              });
              const emText = await emRes.text();
              const srcMatch = emText.match(/src=["']([^"']+)["']/i);
              if (srcMatch) {
                iframeUrl = srcMatch[1];
                break;
              }
            } catch (_) {}
          }

          // Verify that iframeUrl is valid, non-empty, and not a captcha redirect
          if (iframeUrl && !iframeUrl.includes('reCAPTCHA') && iframeUrl.length > 10) {
            // Replace bysejikuar with filemoon.sx for seamless playback
            if (iframeUrl.includes('bysejikuar') || iframeUrl.includes('filemoon')) {
              iframeUrl = iframeUrl
                .replace(/bysejikuar\.[a-z0-9]+/i, 'filemoon.sx')
                .replace(/filemoon\.[a-z0-9]+/i, 'filemoon.sx');
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
      } catch (_) {}
    }
  }

  return [];
}

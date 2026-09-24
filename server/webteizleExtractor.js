/**
 * Webteizle Stream Extractor
 * Uses system curl for clean TLS negotiation with Webteizle & Cloudflare
 */

import { execFile } from 'child_process';
import util from 'util';

const execFileAsync = util.promisify(execFile);

function normalizeTitle(t) {
  if (!t) return '';
  return t
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(text) {
  return normalizeTitle(text).replace(/\s+/g, '-');
}

async function curlRequest(args, timeout = 10000) {
  try {
    const fullArgs = ['-4', '--compressed', '--connect-timeout', '5', '--max-time', '8', ...args];
    const { stdout } = await execFileAsync('curl', fullArgs, { timeout: timeout + 2000 });
    return stdout;
  } catch (err) {
    return '';
  }
}

export async function resolveWebteizleStreams({
  type = 'movie',
  title = '',
  originalTitle = '',
  titles = [],
  season = 1,
  episode = 1,
  isDub = false
} = {}) {
  // Webteizle is exclusively a movie streaming site
  if (type && type !== 'movie') return [];
  const candidateQueries = [...new Set([
    title,
    originalTitle,
    ...titles
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 1);

  if (candidateQueries.length === 0) return [];

  const streams = [];
  const seenEmbeds = new Set();
  const dilPaths = isDub ? ['dublaj', 'altyazi'] : ['altyazi', 'dublaj'];

  for (const q of candidateQueries) {
    const slug = slugify(q);
    if (!slug) continue;

    for (const dilPath of dilPaths) {
      const watchUrl = `https://webteizle.info/izle/${dilPath}/${slug}`;

      const html = await curlRequest([
        '-sL', watchUrl,
        '-H', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        '-H', 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      ]);

      if (!html || !html.includes('data-id')) continue;

      const idMatch = html.match(/id=["']dilsec["'][^>]*data-id=["'](\d+)["']/i) || html.match(/data-id=["'](\d+)["']/i);
      if (!idMatch || !idMatch[1]) continue;
      const filmId = idMatch[1];
      const dilCode = dilPath === 'altyazi' ? 1 : 0;

      const altPayload = `filmid=${filmId}&dil=${dilCode}&s=&b=&bot=0`;
      const altJsonText = await curlRequest([
        '-sL', '-X', 'POST', 'https://webteizle.info/ajax/dataAlternatif3.asp',
        '-H', 'Content-Type: application/x-www-form-urlencoded',
        '-H', 'X-Requested-With: XMLHttpRequest',
        '-H', `Referer: ${watchUrl}`,
        '-d', altPayload
      ]);

      let altData = null;
      try {
        altData = JSON.parse(altJsonText);
      } catch (_) {}

      if (!altData || altData.status !== 'success' || !Array.isArray(altData.data)) continue;

      for (const alt of altData.data) {
        if (!alt || !alt.id) continue;

        const embedHtml = await curlRequest([
          '-sL', '-X', 'POST', 'https://webteizle.info/ajax/dataEmbed.asp',
          '-H', 'Content-Type: application/x-www-form-urlencoded',
          '-H', 'X-Requested-With: XMLHttpRequest',
          '-H', `Referer: ${watchUrl}`,
          '-d', `id=${alt.id}`
        ]);

        if (!embedHtml) continue;

        let playerUrl = null;
        const vidmolyMatch = embedHtml.match(/vidmoly\(['"]([^'"]+)['"]/i);
        const okruMatch = embedHtml.match(/okru\(['"]([^'"]+)['"]/i);
        const filemoonMatch = embedHtml.match(/filemoon\(['"]([^'"]+)['"]/i);
        const pixelMatch = embedHtml.match(/pixel\(['"]([^'"]+)['"]/i);
        const iframeSrc = embedHtml.match(/<iframe[^>]+src=["']([^"']+)["']/i);

        if (vidmolyMatch && vidmolyMatch[1]) {
          playerUrl = `https://vidmoly.to/embed-${vidmolyMatch[1]}.html`;
        } else if (filemoonMatch && filemoonMatch[1]) {
          playerUrl = `https://bysezoxexe.com/e/${filemoonMatch[1]}`;
        } else if (pixelMatch && pixelMatch[1]) {
          playerUrl = `https://pixeldrain.com/u/${pixelMatch[1].split('|')[0]}`;
        } else if (okruMatch && okruMatch[1]) {
          playerUrl = `https://ok.ru/videoembed/${okruMatch[1]}`;
        } else if (iframeSrc && iframeSrc[1] && !iframeSrc[1].includes('reCAPTCHADATA')) {
          playerUrl = iframeSrc[1].startsWith('//') ? `https:${iframeSrc[1]}` : iframeSrc[1];
        }

        if (playerUrl && !seenEmbeds.has(playerUrl)) {
          seenEmbeds.add(playerUrl);
          const providerName = alt.baslik || 'Webteizle';

          streams.push({
            id: `webteizle_${alt.id}`,
            name: `Webteizle - ${providerName} (${dilPath === 'dublaj' ? 'Dublaj' : 'Altyazılı'})`,
            displayName: `Webteizle ${providerName}`,
            badge: `🎬 ${providerName} 1080p`,
            source: 'Webteizle',
            url: playerUrl,
            streamUrl: playerUrl,
            quality: '1080p',
            isIframe: true,
            category: dilPath === 'dublaj' ? 'dubbed' : 'subtitled',
            type: 'embed'
          });
        }
      }

      if (streams.length > 0) break;
    }

    if (streams.length > 0) break;
  }

  return streams;
}

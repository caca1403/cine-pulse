/**
 * Vercel Serverless Function: Webteizle VIP Stream Resolver
 * Resolves 1080p movie streams (VidMoly, FileMoon, Netu, etc.)
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

async function curlRequest(args, timeout = 9000) {
  try {
    const fullArgs = ['-4', '--connect-timeout', '4', '--max-time', '7', ...args];
    const { stdout, stderr } = await execFileAsync('curl', fullArgs, { timeout: timeout + 1500 });
    return { stdout, stderr, ok: true };
  } catch (err) {
    return { stdout: '', stderr: err.message, ok: false, code: err.code };
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const urlObj = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const title = urlObj.searchParams.get('title') || urlObj.searchParams.get('query') || '';
  const originalTitle = urlObj.searchParams.get('originalTitle') || '';
  const type = urlObj.searchParams.get('type') || 'movie';
  const isDub = urlObj.searchParams.get('isDub') === 'true' || urlObj.searchParams.get('dub') === '1';

  // Webteizle only hosts movies
  if (type && type !== 'movie') {
    return res.status(200).json({ success: true, streams: [] });
  }

  const titlesParam = urlObj.searchParams.get('titles') || '';
  const extraTitles = titlesParam ? titlesParam.split(',').map(t => t.trim()) : [];
  const candidateQueries = [...new Set([title, originalTitle, ...extraTitles])].filter(t => t && typeof t === 'string' && t.trim().length > 1);
  if (candidateQueries.length === 0) {
    return res.status(200).json({ success: true, streams: [] });
  }

  const streams = [];
  const seenEmbeds = new Set();
  const dilPaths = isDub ? ['dublaj', 'altyazi'] : ['altyazi', 'dublaj'];

  for (const q of candidateQueries) {
    const slug = slugify(q);
    if (!slug) continue;

    for (const dilPath of dilPaths) {
      const watchUrl = `https://webteizle.info/izle/${dilPath}/${slug}`;

      const pageRes = await curlRequest([
        '-sL', watchUrl,
        '-H', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        '-H', 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      ]);
      const html = pageRes.stdout || '';

      globalThis._lastWtzDebug = {
        watchUrl,
        curlOk: pageRes.ok,
        curlStderr: pageRes.stderr,
        curlCode: pageRes.code,
        htmlLen: html.length,
        hasDataId: html.includes('data-id'),
        preview: html.slice(0, 200)
      };

      if (!html || !html.includes('data-id')) continue;

      const idMatch = html.match(/id=["']dilsec["'][^>]*data-id=["'](\d+)["']/i);
      if (!idMatch || !idMatch[1]) continue;
      const filmId = idMatch[1];
      const dilCode = dilPath === 'altyazi' ? 1 : 0;

      const altPayload = `filmid=${filmId}&dil=${dilCode}&s=&b=&bot=0`;
      const altRes = await curlRequest([
        '-sL', '-X', 'POST', 'https://webteizle.info/ajax/dataAlternatif3.asp',
        '-H', 'Content-Type: application/x-www-form-urlencoded',
        '-H', 'X-Requested-With: XMLHttpRequest',
        '-H', `Referer: ${watchUrl}`,
        '-d', altPayload
      ]);
      const altJsonText = altRes.stdout || '';

      if (globalThis._lastWtzDebug) {
        globalThis._lastWtzDebug.altJsonText = altJsonText.slice(0, 200);
        globalThis._lastWtzDebug.altOk = altRes.ok;
        globalThis._lastWtzDebug.altStderr = altRes.stderr;
      }

      let altData = null;
      try {
        altData = JSON.parse(altJsonText);
      } catch (_) {}

      if (!altData || altData.status !== 'success' || !Array.isArray(altData.data)) continue;

      for (const alt of altData.data) {
        if (!alt || !alt.id) continue;

        const embedRes = await curlRequest([
          '-sL', '-X', 'POST', 'https://webteizle.info/ajax/dataEmbed.asp',
          '-H', 'Content-Type: application/x-www-form-urlencoded',
          '-H', 'X-Requested-With: XMLHttpRequest',
          '-H', `Referer: ${watchUrl}`,
          '-d', `id=${alt.id}`
        ]);
        const embedHtml = embedRes.stdout || '';

        if (globalThis._lastWtzDebug) {
          globalThis._lastWtzDebug.embedSample = {
            altId: alt.id,
            baslik: alt.baslik,
            htmlLen: embedHtml.length,
            preview: embedHtml.slice(0, 150)
          };
        }

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

  return res.status(200).json({ success: true, streams, debug: globalThis._lastWtzDebug || {} });
}

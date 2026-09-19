import { guardNodeRequest, isSafePublicUrl } from './_security.js';
import { Readable } from 'stream';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  const isMediaSegment = /hls_proxy|live_tv_stream/.test(req.url || '');
  if (guardNodeRequest(req, res, { limit: isMediaSegment ? 900 : 180, bucket: isMediaSegment ? 'media' : 'proxy' })) return;

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Parse path: e.g. /api/hdfc/search/Deadpool/ or /api/szd/ajax/dataAlternatif22.asp
  const urlObj = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname; // e.g. /api/hdfc/search/Deadpool/
  const search = urlObj.search || '';

  let targetUrl = '';
  let customHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  if (pathname.startsWith('/api/img_proxy')) {
    const rawTarget = urlObj.searchParams.get('url') || '';
    if (!rawTarget) return res.status(400).send('Missing url');
    try {
      const decodedTarget = decodeURIComponent(rawTarget);
      if (!isSafePublicUrl(decodedTarget)) return res.status(403).send('Target blocked');
      const imgRes = await fetch(decodedTarget, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      });
      if (!imgRes.ok) {
        return res.status(imgRes.status).send('Image fetch failed');
      }
      res.setHeader('Content-Type', imgRes.headers.get('content-type') || 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
      const arrayBuffer = await imgRes.arrayBuffer();
      return res.status(200).send(Buffer.from(arrayBuffer));
    } catch (err) {
      return res.status(500).send('Proxy error: ' + err.message);
    }
  }

  if (pathname.startsWith('/api/live_tv_stream')) {
    const channel = (urlObj.searchParams.get('channel') || '').toLowerCase();
    try {
      let pageUrl = '';
      let refUrl = '';
      if (channel === 'dmax') {
        pageUrl = 'https://www.dmax.com.tr/canli-izle';
        refUrl = 'https://www.dmax.com.tr/';
      } else if (channel === 'tlc') {
        pageUrl = 'https://www.tlctv.com.tr/canli-izle';
        refUrl = 'https://www.tlctv.com.tr/';
      } else {
        return res.status(400).json({ error: 'Unsupported channel' });
      }

      const now = Date.now();
      if (globalThis._liveTvCache && globalThis._liveTvCache[channel] && globalThis._liveTvCache[channel].exp > now) {
        return res.redirect(302, globalThis._liveTvCache[channel].url);
      }

      const pageRes = await fetch(pageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        }
      });
      const html = await pageRes.text();
      const m = html.match(/daionUrl\s*:\s*['"]([^'"]+)['"]/);
      if (!m || !m[1]) {
        return res.status(502).json({ error: 'Failed to extract live stream URL' });
      }
      const daionUrl = m[1];
      const proxiedUrl = `/api/hls_proxy?url=${encodeURIComponent(daionUrl)}&ref=${encodeURIComponent(refUrl)}`;

      if (!globalThis._liveTvCache) globalThis._liveTvCache = {};
      globalThis._liveTvCache[channel] = {
        url: proxiedUrl,
        exp: now + 5 * 60 * 1000 // Cache for 5 minutes
      };

      return res.redirect(302, proxiedUrl);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // RecTV / TVR Authenticated API Proxy (Enforces okhttp/4.12.0 User-Agent)
  if (pathname.startsWith('/api/rtv')) {
    const sub = pathname.replace(/^\/api\/rtv/, '');
    const upstreamUrl = `https://a.prectv70.lol/api${sub}${search}`;
    const forwardHeaders = {};
    for (const [k, v] of Object.entries(req.headers || {})) {
      const lk = k.toLowerCase();
      if (lk === 'host' || lk === 'origin' || lk === 'referer' || lk === 'user-agent') continue;
      forwardHeaders[k] = v;
    }
    forwardHeaders['user-agent'] = 'okhttp/4.12.0';

    try {
      // Read raw body — Vercel may pre-parse req.body or leave it as a stream
      let rawBody = undefined;
      if (req.method === 'POST' || req.method === 'PUT') {
        if (req.body !== undefined && req.body !== null) {
          // Vercel pre-parsed body (object or string)
          rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        } else {
          // Read raw stream (body parser disabled or not triggered)
          rawBody = await new Promise((resolve, reject) => {
            const chunks = [];
            req.on('data', chunk => chunks.push(chunk));
            req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
            req.on('error', reject);
          });
        }
      }

      const upstreamRes = await fetch(upstreamUrl, {
        method: req.method,
        headers: forwardHeaders,
        body: rawBody || undefined
      });
      const data = await upstreamRes.text();
      res.setHeader('Content-Type', upstreamRes.headers.get('content-type') || 'application/json');
      return res.status(upstreamRes.status).send(data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // DiziBal AlphaStream (ag2m4) server-side HLS extractor
  // Fetches x.ag2m4.cfd embed page and extracts the real m3u8 URL
  if (pathname.startsWith('/api/dzb_stream')) {
    const srcCode = urlObj.searchParams.get('code') || '';
    if (!srcCode) return res.status(400).json({ error: 'Missing code param' });

    try {
      const embedUrl = `https://x.ag2m4.cfd/embed-${srcCode}.html`;
      const embedRes = await fetch(embedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://dizibal.org/',
          'Origin': 'https://dizibal.org'
        },
        signal: AbortSignal.timeout(6000)
      });

      if (!embedRes.ok) {
        return res.status(embedRes.status).json({ error: 'Embed page fetch failed' });
      }

      const html = await embedRes.text();

      // Extract cookies from HTML
      const cookieMatches = [...html.matchAll(/\$\.cookie\(['"]([^'"]+)['"],\s*['"]([^'"]+)['"]/g)];
      const cookieHeader = cookieMatches.map(m => `${m[1]}=${m[2]}`).join('; ');

      // Extract /dl?op=get_stream&view_id=...&hash=... endpoint
      const dlMatch = html.match(/fetch\(['"](\/dl\?op=get_stream[^'"]+)['"]\)/i);
      if (!dlMatch) {
        return res.status(404).json({ error: 'Stream endpoint not found in embed page' });
      }

      const dlEndpoint = `https://x.ag2m4.cfd${dlMatch[1]}`;
      const dlRes = await fetch(dlEndpoint, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': embedUrl,
          'Origin': 'https://x.ag2m4.cfd',
          'Cookie': cookieHeader,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': '*/*'
        },
        signal: AbortSignal.timeout(7000)
      });

      if (!dlRes.ok) {
        return res.status(dlRes.status).json({ error: 'DL endpoint failed' });
      }

      const dlJson = await dlRes.json().catch(() => null);
      if (!dlJson || !dlJson.url) {
        return res.status(404).json({ error: 'No stream URL in response' });
      }

      let m3u8Url = dlJson.url;
      if (m3u8Url.startsWith('//')) m3u8Url = `https:${m3u8Url}`;

      // Proxy the HLS stream to avoid CDN Referer checks
      const proxiedUrl = `/api/hls_proxy?url=${encodeURIComponent(m3u8Url)}&ref=${encodeURIComponent('https://x.ag2m4.cfd/')}`;

      // Extract subtitles if present
      const subtitles = [];
      const subMatch = html.match(/"subtitle"\s*:\s*"([^"]+)"/i);
      if (subMatch && subMatch[1]) {
        const parts = subMatch[1].split(',');
        for (const p of parts) {
          const langMatch = p.match(/\[(.*?)\](.*)/);
          if (langMatch) {
            subtitles.push({ label: langMatch[1], src: langMatch[2] });
          }
        }
      }

      return res.status(200).json({
        success: true,
        streamUrl: proxiedUrl,
        rawUrl: m3u8Url,
        isHls: true,
        subtitles
      });
    } catch (err) {
      console.error('[dzb_stream] Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  if (pathname.startsWith('/api/hls_proxy')) {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
      return res.status(200).end();
    }

    const rawTarget = urlObj.searchParams.get('url') || '';
    let ref = urlObj.searchParams.get('ref') || '';
    if (!rawTarget) {
      return res.status(400).send('Missing url param');
    }

    try {
      const decodedTarget = decodeURIComponent(rawTarget);
      if (!isSafePublicUrl(decodedTarget)) return res.status(403).send('Target blocked');

      if (!ref) {
        if (decodedTarget.includes('dizisol.com')) {
          ref = 'https://dizisol.com/';
        } else if (decodedTarget.includes('ag2m4') || decodedTarget.includes('uk-traffic-076') || decodedTarget.includes('dizibal')) {
          ref = 'https://x.ag2m4.cfd/';
        } else if (decodedTarget.includes('prectv') || decodedTarget.includes('mariuannastluisborg') || decodedTarget.includes('moveonjoy')) {
          ref = 'https://a.prectv70.lol/';
        } else if (decodedTarget.includes('hdfilmcehennemi')) {
          ref = 'https://hdfilmcehennemi.mobi/';
        } else if (decodedTarget.includes('meatort') || decodedTarget.includes('lookmovie')) {
          ref = 'https://lookmovie2.la/';
        } else if (decodedTarget.includes('4astras') || decodedTarget.includes('saf45sfa') || decodedTarget.includes('4sa') || decodedTarget.includes('7862564') || decodedTarget.includes('959565') || decodedTarget.includes('45464654')) {
          ref = '';
        }
      }

      let targetOrigin = '';
      try {
        if (ref) targetOrigin = new URL(ref).origin;
      } catch (_) {}

      const isRecTv = decodedTarget.includes('prectv') || 
                      decodedTarget.includes('mariuannastluisborg') || 
                      decodedTarget.includes('moveonjoy') || 
                      (ref && ref.includes('prectv'));
      const ua = isRecTv ? 'okhttp/4.12.0' : (req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

      const upstreamHeaders = {
        'User-Agent': ua
      };
      if (req.headers.range) {
        upstreamHeaders['Range'] = req.headers.range;
      }
      if (ref) {
        upstreamHeaders['Referer'] = ref;
        if (targetOrigin && !isRecTv && !ref.includes('ag2m4')) {
          upstreamHeaders['Origin'] = targetOrigin;
        }
      }

      const upstreamRes = await fetch(decodedTarget, {
        headers: upstreamHeaders
      });

      const contentType = upstreamRes.headers.get('content-type') || '';
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
      res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');

      const lowerTarget = decodedTarget.toLowerCase();
      const lowerCt = contentType.toLowerCase();
      const isSegment = (
        lowerTarget.includes('/ts') || 
        lowerTarget.includes('ts?') || 
        lowerTarget.includes('.ts') || 
        lowerTarget.includes('seg-') ||
        lowerTarget.includes('/seg') ||
        lowerTarget.includes('.jpg') || 
        lowerTarget.includes('.png') || 
        lowerCt.includes('mp2t') || 
        lowerCt.includes('video/')
      );

      const isPlaylist = !isSegment && (
        lowerTarget.includes('.m3u8') || 
        lowerTarget.includes('/play') ||
        lowerTarget.includes('m3u8?') ||
        lowerCt.includes('mpegurl') || 
        lowerCt.includes('application/x-mpegurl') || 
        lowerCt.includes('text/plain')
      );

      if (isPlaylist) {
        const text = await upstreamRes.text();
        const baseOrigin = new URL(decodedTarget).origin;

        const rewritten = text.split('\n').map(line => {
          let currentLine = line;
          const trimmed = currentLine.trim();
          if (!trimmed) return line;

          if (trimmed.includes('URI="')) {
            currentLine = currentLine.replace(/URI="([^"]+)"/g, (m, u) => {
              let fullU;
              if (u.startsWith('http')) fullU = u;
              else if (u.startsWith('/')) fullU = `${baseOrigin}${u}`;
              else {
                const urlPath = new URL(decodedTarget).pathname;
                const lastSlash = urlPath.lastIndexOf('/');
                const dir = lastSlash !== -1 ? urlPath.substring(0, lastSlash + 1) : '/';
                fullU = `${baseOrigin}${dir}${u}`;
              }

              const childRef = fullU.includes('dizisol.com') ? 'https://dizisol.com/' : (fullU.includes('ag2m4') || fullU.includes('uk-traffic-076') ? 'https://x.ag2m4.cfd/' : ref);
              return `URI="/api/hls_proxy?url=${encodeURIComponent(fullU)}&ref=${encodeURIComponent(childRef)}"`;
            });
          }

          if (trimmed.startsWith('#')) return currentLine;

          let fullLineUrl;
          if (trimmed.startsWith('http')) {
            fullLineUrl = trimmed;
          } else if (trimmed.startsWith('/')) {
            fullLineUrl = `${baseOrigin}${trimmed}`;
          } else {
            const urlPath = new URL(decodedTarget).pathname;
            const lastSlash = urlPath.lastIndexOf('/');
            const dir = lastSlash !== -1 ? urlPath.substring(0, lastSlash + 1) : '/';
            fullLineUrl = `${baseOrigin}${dir}${trimmed}`;
          }

          // Direct CDN bypass for video segments and sub-playlists with open CORS
          // Bypasses proxy for 10x faster playback (<200ms start)
          const needsProxy = /(?:uk-traffic-076|ag2m4|playmix|hdfilmcehennemi)/i.test(fullLineUrl);
          if (
            !needsProxy && (
            /\.(ts|jpg|jpeg|png|m4s|mp4)($|\?)/i.test(fullLineUrl) ||
            fullLineUrl.includes('dizisol.com/ts') ||
            fullLineUrl.includes('/ts?') ||
            fullLineUrl.includes('/ts/') ||
            fullLineUrl.includes('?seg=') ||
            fullLineUrl.includes('&seg=') ||
            fullLineUrl.includes('/seg-') ||
            fullLineUrl.includes('/thumbnail-') ||
            fullLineUrl.includes('nodedatastream.top') ||
            fullLineUrl.includes('storagegridlink.top') ||
            (
              !fullLineUrl.includes('uk-traffic-076.com') &&
              !fullLineUrl.includes('ag2m4') &&
              (
                fullLineUrl.includes('superadjacentsoddenly.xyz') ||
                fullLineUrl.includes('cdnimages') ||
                fullLineUrl.includes('vidmixi.com/m3u') ||
                fullLineUrl.includes('pics/hls2')
              )
            ))
          ) {
            return fullLineUrl;
          }

          const childRef = fullLineUrl.includes('dizisol.com') ? 'https://dizisol.com/' : (fullLineUrl.includes('ag2m4') || fullLineUrl.includes('uk-traffic-076') ? 'https://x.ag2m4.cfd/' : ref);
          return `/api/hls_proxy?url=${encodeURIComponent(fullLineUrl)}&ref=${encodeURIComponent(childRef)}`;
        }).join('\n');

        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        return res.status(upstreamRes.status).send(rewritten);
      } else {
        // Stream TS/video bytes immediately; buffering a complete 6-10 second
        // segment made TVR channel startup feel unnecessarily slow.
        res.statusCode = upstreamRes.status;
        const isMkv = contentType.includes('matroska') || decodedTarget.includes('.mkv');
        res.setHeader('Content-Type', isMkv ? 'video/mp4' : (contentType || 'video/mp4'));
        res.setHeader('Accept-Ranges', upstreamRes.headers.get('accept-ranges') || 'bytes');
        const contentLength = upstreamRes.headers.get('content-length');
        if (contentLength) res.setHeader('Content-Length', contentLength);
        const contentRange = upstreamRes.headers.get('content-range');
        if (contentRange) res.setHeader('Content-Range', contentRange);
        if (!upstreamRes.body) return res.end();
        await new Promise((resolve, reject) => {
          const stream = Readable.fromWeb(upstreamRes.body);
          stream.on('error', reject);
          res.on('finish', resolve);
          stream.pipe(res);
        });
        return;
      }
    } catch (err) {
      console.error('HLS Proxy Error:', err);
      return res.status(500).send(err.message);
    }
  }

  if (pathname.startsWith('/api/dzm_video')) {
    const hash = urlObj.searchParams.get('hash') || urlObj.searchParams.get('data') || '';
    if (!hash) {
      return res.status(400).json({ error: 'Missing hash' });
    }

    try {
      const postUrl = `https://hdplayersystem.com/player/index.php?data=${hash}&do=getVideo`;
      const form = new URLSearchParams();
      form.append('hash', hash);
      form.append('r', 'https://www.dizimom.surf/');

      const upstreamRes = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.dizimom.surf/',
          'Origin': 'https://hdplayersystem.com',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: form.toString()
      });

      if (upstreamRes.ok) {
        const data = await upstreamRes.json().catch(() => null);
        const originalSecured = data?.securedLink || data?.videoSource;
        if (originalSecured) {
          const proxiedHls = `/api/hls_proxy?url=${encodeURIComponent(originalSecured)}&ref=https://hdplayersystem.com/`;
          return res.status(200).json({
            success: true,
            streamUrl: proxiedHls,
            rawUrl: originalSecured,
            isHls: true
          });
        }
      }
      return res.status(404).json({ error: 'Video not found or upstream error' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (pathname.startsWith('/api/hdfc')) {
    const subPath = pathname.replace(/^\/api\/hdfc/, '');
    targetUrl = `https://www.hdfilmcehennemi.now${subPath}${search}`;
    customHeaders['Referer'] = 'https://www.hdfilmcehennemi.now/';
    customHeaders['Origin'] = 'https://www.hdfilmcehennemi.now';
  } else if (pathname.startsWith('/api/fin')) {
    const subPath = pathname.replace(/^\/api\/fin/, '');
    targetUrl = `https://filmizle.now${subPath}${search}`;
    customHeaders['Referer'] = 'https://filmizle.now/';
    customHeaders['Origin'] = 'https://filmizle.now';
    if (req.headers['x-csrf-token']) customHeaders['X-CSRF-TOKEN'] = req.headers['x-csrf-token'];
    if (req.headers['cookie']) customHeaders['Cookie'] = req.headers['cookie'];
  } else if (pathname.startsWith('/api/vidmixi')) {
    const subPath = pathname.replace(/^\/api\/vidmixi/, '');
    targetUrl = `https://vidmixi.com${subPath}${search}`;
    customHeaders['Referer'] = 'https://filmizle.now/';
  } else if (pathname.startsWith('/api/szd')) {
    const pathParam = urlObj.searchParams.get('path');
    const subPath = pathParam
      ? (pathParam.startsWith('/') ? pathParam : `/${pathParam}`)
      : pathname.replace(/^\/api\/szd/, '');
    const cleanSearch = search ? search.replace(/[?&]path=[^&]*/g, '').replace(/^&/, '?') : '';
    targetUrl = `https://sezonlukdizi.cc${subPath}${cleanSearch}`;
    customHeaders['Referer'] = 'https://sezonlukdizi.cc/';
    customHeaders['Origin'] = 'https://sezonlukdizi.cc';
    customHeaders['X-Requested-With'] = 'XMLHttpRequest';
    if (req.method === 'POST') {
      customHeaders['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      // SezonlukDizi's AJAX endpoints require the session cookie issued by
      // the episode page. Vercel does not keep cookies between proxy calls,
      // so obtain a short-lived session cookie before forwarding the POST.
      if (!req.headers.cookie) {
        try {
          const sessionRes = await fetch('https://sezonlukdizi.cc/', {
            headers: { 'User-Agent': customHeaders['User-Agent'] }
          });
          const setCookie = sessionRes.headers.get('set-cookie');
          if (setCookie) customHeaders['Cookie'] = setCookie.split(';')[0];
        } catch (_) {}
      }
    }
  } else if (pathname.startsWith('/api/dbl')) {
    const subPath = pathname.replace(/^\/api\/dbl/, '');
    targetUrl = `https://dizibal.org/api${subPath}${search}`;
    customHeaders['Referer'] = 'https://dizibal.org/';
  } else if (pathname.startsWith('/api/rtv')) {
    const subPath = pathname.replace(/^\/api\/rtv/, '');
    targetUrl = `https://a.prectv70.lol/api${subPath}${search}`;
    customHeaders['User-Agent'] = 'okhttp/4.12.0';
    if (req.headers['authorization']) customHeaders['Authorization'] = req.headers['authorization'];
    if (req.headers['x-timestamp']) customHeaders['X-Timestamp'] = req.headers['x-timestamp'];
    if (req.headers['x-nonce']) customHeaders['X-Nonce'] = req.headers['x-nonce'];
    if (req.headers['x-signature']) customHeaders['X-Signature'] = req.headers['x-signature'];
    if (req.headers['x-app-version']) customHeaders['X-App-Version'] = req.headers['x-app-version'];
    if (req.headers['x-client-id']) customHeaders['X-Client-Id'] = req.headers['x-client-id'];
    if (req.headers['content-type']) customHeaders['Content-Type'] = req.headers['content-type'];
  } else if (pathname.startsWith('/api/dzp')) {
    const subPath = pathname.replace(/^\/api\/dzp/, '');
    targetUrl = `https://dizipal1229.com${subPath}${search}`;
  } else if (pathname.startsWith('/api/flz')) {
    const subPath = pathname.replace(/^\/api\/flz/, '');
    targetUrl = `https://filmizlech.com${subPath}${search}`;
    customHeaders['Referer'] = 'https://filmizlech.com/';
  } else if (pathname.startsWith('/api/snx')) {
    const pathParam = urlObj.searchParams.get('path');
    const subPath = pathParam ? (pathParam.startsWith('/') ? pathParam : '/' + pathParam) : pathname.replace(/^\/api\/snx/, '');
    const cleanSearch = search ? search.replace(/[?&]path=[^&]*/g, '').replace(/^&/, '?') : '';
    targetUrl = `https://ydfvfdizipanel.ru/public/api${subPath}${cleanSearch}`;
    customHeaders['hash256'] = 'f4d4bc98a3fc4600e7f2c2bab7533f1f03d8a70ff03c256bb11dc57050536bd0';
    customHeaders['signature'] = '308202c3308201aba0030201020204075cec01300d06092a864886f70d01010b050030123110300e0603550403130753696e65776978301e170d3231303932313233333334395a170d3436303931353233333334395a30123110300e0603550403130753696e6577697830820122300d06092a864886f70d01010105000382010f003082010a0282010100b0a2a1bc5c3f16f19c3b2456cfd0a6128ced9f5e2e2c4cca1a100e17b07b86256258f372e76a95a17e9e4a1c048e364835723a95e8ef6d5bdfb5694b50277c65a64f7b012fdf164e5dc93629561f6ca29b7dc82ebb3d6f3c8e8fc6795847fe331ad4a13ed6c059a83804c43d3747526d769580f3a4153752eb22dac66dd15f1582caa43305dc49f55ac7b1b89013e654d2ca8c94c30956659674cc673256c04208f09118bae14cdd72d78f9ee2aece958084a8c2e315deff45726d4fc1f18ec39569ff1abe4f36a8d01090e5f68c07c28763513b88208bcac1a6e1941f6fd8bfdd52f832098ddb2154c8f565bc5d58c7106a19e03787e75c7f34997000e3bcf30203010001a321301f301d0603551d0e04160414b545fc18e74a791d9402b53940ae38b96e9e209c300d06092a864886f70d01010b05000382010100a8a64d9e7c8b5db102af15d3caf94ff8d3e9be9008bb0021117ca2f0762e68583354b126a041bb1fb6e6308e421e4b5a71f779cde63e5d2fc5976bff966c3c4034e852c077d8e74458fbae2ec1db74b1f4082e188bf8ef7c42a44e3fbfb693bb00ee2a727096b42360ddce1bdcd3536f50c8693bcc62a7b7204bcefe2ecf1f7c820bcd63e1d7a6acc8bf6163086915fc5f607cf51bc7a8635f98bb4c65a8f24b7b5a82c7b06868f565cb0d6ac4775c4aac777536ddd1a565f990fd8cbe539185fa7aab610b7855a687a00f4e55536d72873444552c50fd10727dbf298a9be6ed6ae62148dd1de365f3729915dd31975e28a472d752ac14db3db548405cc31e1e';
    customHeaders['packagename'] = 'com.sinewix';
    customHeaders['User-Agent'] = 'EasyPlex (Android 14; SM-A546B; Samsung Galaxy A54 5G; tr)';
    customHeaders['Accept'] = 'application/json';
  } else if (pathname.startsWith('/api/dzy')) {
    const pathParam = urlObj.searchParams.get('path');
    const subPath = pathParam ? (pathParam.startsWith('/') ? pathParam : '/' + pathParam) : pathname.replace(/^\/api\/dzy/, '');
    const cleanSearch = search ? search.replace(/[?&]path=[^&]*/g, '').replace(/^&/, '?') : '';
    targetUrl = `https://www.diziyou.one${subPath}${cleanSearch}`;
    customHeaders['Referer'] = 'https://www.diziyou.one/';
    customHeaders['Origin'] = 'https://www.diziyou.one';
    customHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
  } else if (pathname.startsWith('/api/fex')) {
    const subPath = pathname.replace(/^\/api\/fex/, '');
    targetUrl = `https://filmekseni.vip${subPath}${search}`;
    customHeaders['Referer'] = 'https://filmekseni.vip/';
    customHeaders['Origin'] = 'https://filmekseni.vip';
  } else if (pathname.startsWith('/api/hfd')) {
    const subPath = pathname.replace(/^\/api\/hfd/, '');
    targetUrl = `https://hdfilmdelisi.one${subPath}${search}`;
    customHeaders['Referer'] = 'https://hdfilmdelisi.one/';
    customHeaders['Origin'] = 'https://hdfilmdelisi.one';
  } else if (pathname.startsWith('/api/dzl')) {
    const subPath = pathname.replace(/^\/api\/dzl/, '');
    targetUrl = `https://dizilla.now${subPath}${search}`;
    customHeaders['Referer'] = 'https://dizilla.now/';
    customHeaders['Origin'] = 'https://dizilla.now';
  } else if (pathname.startsWith('/api/hdi')) {
    const subPath = pathname.replace(/^\/api\/hdi/, '');
    targetUrl = `https://www.hdfilmizle.vip${subPath}${search}`;
    customHeaders['Referer'] = 'https://www.hdfilmizle.vip/';
    customHeaders['Origin'] = 'https://www.hdfilmizle.vip';
  } else if (pathname.startsWith('/api/jet')) {
    const subPath = pathname.replace(/^\/api\/jet/, '');
    const cleanSub = subPath.startsWith('/') ? subPath : (subPath ? '/' + subPath : '');
    targetUrl = `https://jetfilmizle.now${cleanSub}${search}`;
    customHeaders['Referer'] = 'https://jetfilmizle.now/';
    customHeaders['Origin'] = 'https://jetfilmizle.now';
    customHeaders['X-Requested-With'] = 'XMLHttpRequest';
    if (req.method === 'POST') {
      customHeaders['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    }
  } else if (pathname.startsWith('/api/ddz')) {
    const subPath = pathname.replace(/^\/api\/ddz/, '');
    const cleanSub = subPath.startsWith('/') ? subPath : (subPath ? '/' + subPath : '');
    targetUrl = `https://dramadizilerim.com${cleanSub}${search}`;
    customHeaders['Referer'] = 'https://dramadizilerim.com/';
    customHeaders['Origin'] = 'https://dramadizilerim.com';
  } else if (pathname.startsWith('/api/dzs')) {
    const subPath = pathname.replace(/^\/api\/dzs/, '');
    targetUrl = `https://dizisol.com/api${subPath}${search}`;
    customHeaders['Referer'] = 'https://dizisol.com/';
    customHeaders['Origin'] = 'https://dizisol.com';
  } else if (pathname.startsWith('/api/dzb')) {
    const subPath = pathname.replace(/^\/api\/dzb/, '');
    targetUrl = `https://dizibal.org/api${subPath}${search}`;
    customHeaders['Referer'] = 'https://dizibal.org/';
    customHeaders['Origin'] = 'https://dizibal.org';
  } else if (pathname.startsWith('/api/dzyo')) {
    const subPath = pathname.replace(/^\/api\/dzyo/, '');
    targetUrl = `https://www.diziyo.so${subPath}${search}`;
    customHeaders['Referer'] = req.headers['x-dzyo-referer'] || 'https://www.diziyo.so/';
    customHeaders['Origin'] = 'https://www.diziyo.so';
    if (req.headers['cookie']) customHeaders['Cookie'] = req.headers['cookie'];
    if (req.headers['x-dzyo-cookie']) customHeaders['Cookie'] = req.headers['x-dzyo-cookie'];
  } else if (pathname.startsWith('/api/dzr')) {
    const subPath = pathname.replace(/^\/api\/dzr/, '');
    targetUrl = `https://diziroll.club${subPath}${search}`;
    customHeaders['Referer'] = 'https://diziroll.club/';
    customHeaders['Origin'] = 'https://diziroll.club';
  } else if (pathname.startsWith('/api/fmk_rapid')) {
    const subPath = pathname.replace(/^\/api\/fmk_rapid/, '');
    targetUrl = `https://rapid.filmmakinesi.to${subPath}${search}`;
    customHeaders['Referer'] = 'https://filmmakinesi.to/';
    customHeaders['Origin'] = 'https://filmmakinesi.to';
    customHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  } else if (pathname.startsWith('/api/fmk')) {
    const subPath = pathname.replace(/^\/api\/fmk/, '');
    targetUrl = `https://filmmakinesi.to${subPath}${search}`;
    customHeaders['Referer'] = 'https://filmmakinesi.to/';
    customHeaders['Origin'] = 'https://filmmakinesi.to';
    customHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  } else if (pathname.startsWith('/api/dzm')) {
    const subPath = pathname.replace(/^\/api\/dzm/, '');
    targetUrl = `https://www.dizimom.surf${subPath}${search}`;
    customHeaders['Referer'] = 'https://www.dizimom.surf/';
    customHeaders['Origin'] = 'https://www.dizimom.surf';
    customHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  } else if (pathname.startsWith('/api/hdp')) {
    const subPath = pathname.replace(/^\/api\/hdp/, '');
    targetUrl = `https://hdplayersystem.com${subPath}${search}`;
    customHeaders['Referer'] = 'https://www.dizimom.surf/';
    customHeaders['Origin'] = 'https://hdplayersystem.com';
    customHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    if (req.method === 'POST') {
      customHeaders['X-Requested-With'] = 'XMLHttpRequest';
      customHeaders['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    }
  } else if (pathname.startsWith('/api/hdm')) {
    const subPath = pathname.replace(/^\/api\/hdm/, '');
    targetUrl = `https://hdmomplayer.com${subPath}${search}`;
    customHeaders['Referer'] = 'https://www.dizimom.surf/';
    customHeaders['Origin'] = 'https://hdmomplayer.com';
    customHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    if (req.method === 'POST') {
      customHeaders['X-Requested-With'] = 'XMLHttpRequest';
      customHeaders['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    }
  } else if (pathname.startsWith('/api/fmk_close')) {
    const subPath = pathname.replace(/^\/api\/fmk_close/, '');
    targetUrl = `https://closeload.filmmakinesi.to${subPath}${search}`;
    customHeaders['Referer'] = 'https://filmmakinesi.to/';
    customHeaders['Origin'] = 'https://filmmakinesi.to';
    customHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  } else if (pathname.startsWith('/api/fmk_sub/')) {
    const subMatch = pathname.match(/^\/api\/fmk_sub\/([a-zA-Z0-9_-]+)(.*)/);
    const sub = subMatch ? subMatch[1] : '';
    const subPath = subMatch ? subMatch[2] : '';
    const host = sub ? `${sub}.filmmakinesi.to` : 'filmmakinesi.to';
    targetUrl = `https://${host}${subPath}${search}`;
    customHeaders['Referer'] = 'https://filmmakinesi.to/';
    customHeaders['Origin'] = 'https://filmmakinesi.to';
  } else if (pathname.startsWith('/api/fmk_proxy')) {
    const rawTarget = urlObj.searchParams.get('url') || '';
    if (!rawTarget) return res.status(400).send('Missing url param');
    targetUrl = decodeURIComponent(rawTarget);
    if (!isSafePublicUrl(targetUrl)) return res.status(403).send('Target blocked');
    customHeaders['Referer'] = 'https://filmmakinesi.to/';
    customHeaders['Origin'] = 'https://filmmakinesi.to';
  } else if (pathname.startsWith('/api/kvip') || pathname.startsWith('/api/czm')) {
    const subPath = pathname.replace(/^\/api\/(kvip|czm)/, '');
    targetUrl = `https://cizgimax.online${subPath}${search}`;
    customHeaders['Referer'] = 'https://cizgimax.online/';
    customHeaders['Origin'] = 'https://cizgimax.online';
    customHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
    if (req.method === 'POST' || req.headers['x-requested-with'] || pathname.includes('/suggest') || pathname.includes('/search')) {
      customHeaders['X-Requested-With'] = 'XMLHttpRequest';
      customHeaders['Accept'] = 'application/json, text/javascript, */*; q=0.01';
    }
  } else if (pathname.startsWith('/api/sibnet')) {
    const subPath = pathname.replace(/^\/api\/sibnet/, '');
    targetUrl = `https://video.sibnet.ru${subPath}${search}`;
    customHeaders['Referer'] = 'https://video.sibnet.ru/';
    customHeaders['Origin'] = 'https://video.sibnet.ru';
    customHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
  } else if (pathname.startsWith('/api/dzs')) {
    const pathParam = urlObj.searchParams.get('path');
    const subPath = pathParam ? (pathParam.startsWith('/') ? pathParam : '/' + pathParam) : pathname.replace(/^\/api\/dzs/, '');
    const cleanSearch = search ? search.replace(/[?&]path=[^&]*/g, '').replace(/^&/, '?') : '';
    targetUrl = `https://dizisol.com/api${subPath}${cleanSearch}`;
    customHeaders['Referer'] = 'https://dizisol.com/';
    customHeaders['Origin'] = 'https://dizisol.com';
    customHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
  } else if (pathname.startsWith('/api/ybd')) {
    const pathParam = urlObj.searchParams.get('path');
    const subPath = pathParam ? (pathParam.startsWith('/') ? pathParam : '/' + pathParam) : pathname.replace(/^\/api\/ybd/, '');
    const cleanSearch = search ? search.replace(/[?&]path=[^&]*/g, '').replace(/^&/, '?') : '';
    targetUrl = `https://yabancidizi.news${subPath}${cleanSearch}`;
    customHeaders['Referer'] = 'https://yabancidizi.news/';
    customHeaders['Origin'] = 'https://yabancidizi.news';
    customHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
    if (req.method === 'POST' || req.headers['x-requested-with'] || pathname.includes('/search') || cleanSearch.includes('qr=')) {
      customHeaders['X-Requested-With'] = 'XMLHttpRequest';
      customHeaders['Accept'] = 'application/json, text/javascript, */*; q=0.01';
    }
  } else if (pathname.startsWith('/api/rtv')) {
    const subPath = pathname.replace(/^\/api\/rtv/, '');
    targetUrl = `https://a.prectv70.lol/api${subPath}${search}`;
    customHeaders['User-Agent'] = 'okhttp/4.12.0';
    if (req.headers['x-timestamp']) customHeaders['X-Timestamp'] = req.headers['x-timestamp'];
    if (req.headers['x-nonce']) customHeaders['X-Nonce'] = req.headers['x-nonce'];
    if (req.headers['x-signature']) customHeaders['X-Signature'] = req.headers['x-signature'];
    if (req.headers['x-app-version']) customHeaders['X-App-Version'] = req.headers['x-app-version'];
    if (req.headers['x-client-id']) customHeaders['X-Client-Id'] = req.headers['x-client-id'];
    if (req.headers['authorization']) customHeaders['Authorization'] = req.headers['authorization'];
    if (req.headers['content-type']) customHeaders['Content-Type'] = req.headers['content-type'];
  } else if (pathname.startsWith('/api/proxy')) {
    const rawTarget = urlObj.searchParams.get('url') || '';
    if (!rawTarget) return res.status(400).send('Missing url param');
    targetUrl = decodeURIComponent(rawTarget);
    if (!isSafePublicUrl(targetUrl)) return res.status(403).send('Target blocked');

    let targetOrigin = '';
    try { targetOrigin = new URL(targetUrl).origin + '/'; } catch (_) {}

    let ref = urlObj.searchParams.get('ref') || req.headers['x-proxy-referer'];
    if (!ref) {
      if (targetUrl.includes('ag2m4') || targetUrl.includes('dizibal')) {
        ref = 'https://dizibal.org/';
      } else if (targetUrl.includes('vidmoly')) {
        ref = 'https://vidmoly.net/';
      } else {
        ref = targetOrigin;
      }
    }
    if (ref) customHeaders['Referer'] = decodeURIComponent(ref);
    if (targetOrigin) customHeaders['Origin'] = new URL(targetUrl).origin;

    customHeaders['User-Agent'] = req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
    if (req.headers['x-hdf-nonce']) customHeaders['X-HDF-Nonce'] = req.headers['x-hdf-nonce'];
    if (req.headers['x-requested-with']) customHeaders['X-Requested-With'] = req.headers['x-requested-with'];

  } else if (pathname.startsWith('/api/subtitles')) {
    // WebVTT Subtitle Proxy & Multi-Source OpenSubtitles resolver for Vercel
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Content-Type', 'text/vtt; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const tmdbIdParam = urlObj.searchParams.get('imdbId') || urlObj.searchParams.get('tmdbId');
    const directUrl = urlObj.searchParams.get('url');
    const titleParam = urlObj.searchParams.get('title') || urlObj.searchParams.get('q');
    const season = urlObj.searchParams.get('season');
    const episode = urlObj.searchParams.get('episode');
    const mediaType = urlObj.searchParams.get('type') || (season ? 'tv' : 'movie');

    let downloadUrl = directUrl;

    function secToVttTime(seconds) {
      if (isNaN(seconds) || seconds < 0) seconds = 0;
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);
      const ms = Math.floor((seconds % 1) * 1000);
      const pad = (num, size = 2) => String(num).padStart(size, '0');
      return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(ms, 3)}`;
    }

    function microDvdToVtt(subText) {
      const lines = subText.split(/\r?\n/);
      let fps = 23.976;
      const cues = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const fpsMatch = trimmed.match(/^\{(\d+)\}\{(\d+)\}([0-9.]+)$/);
        if (fpsMatch && Number(fpsMatch[3]) > 10 && Number(fpsMatch[3]) < 120) {
          fps = parseFloat(fpsMatch[3]);
          continue;
        }

        const match = trimmed.match(/^\{(\d+)\}\{(\d+)\}(.*)$/);
        if (match) {
          const startFrame = parseInt(match[1], 10);
          const endFrame = parseInt(match[2], 10);
          let cueText = match[3];

          cueText = cueText
            .replace(/\{Y:i\}/gi, '<i>')
            .replace(/\{\/Y:i\}/gi, '</i>')
            .replace(/\{Y:b\}/gi, '<b>')
            .replace(/\{\/Y:b\}/gi, '</b>')
            .replace(/\{[^}]+\}/g, '')
            .replace(/<\/?c[^>]*>/gi, '')
            .replace(/\|/g, '\n')
            .trim();

          if (!cueText) continue;

          const startTime = secToVttTime(startFrame / fps);
          const endTime = secToVttTime(endFrame / fps);
          cues.push(`${startTime} --> ${endTime}\n${cueText}`);
        }
      }

      return 'WEBVTT\n\n' + cues.join('\n\n') + '\n';
    }

    function convertToWebVtt(rawText) {
      let text = (rawText || '').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
      if (text.startsWith('WEBVTT')) return text;
      if (/^\{\d+\}\{\d+\}/m.test(text)) {
        return microDvdToVtt(text);
      }
      text = text.replace(/.*(?:OpenSubtitles|osdb\.link|ai\.OpenSubtitles|VIP\s*üyelik).*\n?/gi, '');
      text = text.replace(/(\d{1,2}:\d{2}:\d{2})[,.](\d{3})/g, '$1.$2');
      text = text.replace(/(?:^|\n)(\d):(\d{2}:\d{2}\.\d{3})/g, '\n0$1:$2');
      return 'WEBVTT\n\n' + text.trim() + '\n';
    }

    if (!downloadUrl && (tmdbIdParam || titleParam)) {
      try {
        let resolvedImdb = tmdbIdParam && String(tmdbIdParam).startsWith('tt') ? tmdbIdParam : null;
        let resolvedTitle = titleParam ? decodeURIComponent(titleParam) : null;

        // 1. Resolve TMDB ID -> IMDB ID & Title
        const rawTmdb = tmdbIdParam && !String(tmdbIdParam).startsWith('tt') ? tmdbIdParam : null;
        if (rawTmdb && (!resolvedImdb || !resolvedTitle)) {
          const TMDB_KEYS = ['4e44d9029b1270a757cddc766a1bcb63', '844dba0bfd8f3a4f3799f6130ef9e335'];
          for (const key of TMDB_KEYS) {
            try {
              if (!resolvedImdb) {
                const extRes = await fetch(
                  `https://api.themoviedb.org/3/${mediaType}/${rawTmdb}/external_ids?api_key=${key}`,
                  { signal: AbortSignal.timeout(3000) }
                );
                if (extRes.ok) {
                  const extData = await extRes.json();
                  if (extData.imdb_id) resolvedImdb = extData.imdb_id;
                }
              }
              if (!resolvedTitle) {
                const detRes = await fetch(
                  `https://api.themoviedb.org/3/${mediaType}/${rawTmdb}?api_key=${key}`,
                  { signal: AbortSignal.timeout(3000) }
                );
                if (detRes.ok) {
                  const detData = await detRes.json();
                  resolvedTitle = detData.name || detData.title || detData.original_name || detData.original_title;
                }
              }
              if (resolvedImdb) break;
            } catch (_) {}
          }
        }

        // Step A: Stremio OpenSubtitles v3 (Fastest, pre-converted UTF-8 SRT)
        if (resolvedImdb) {
          try {
            const stremioUrl = (season && episode)
              ? `https://opensubtitles-v3.strem.io/subtitles/series/${resolvedImdb}:${season}:${episode}.json`
              : `https://opensubtitles-v3.strem.io/subtitles/movie/${resolvedImdb}.json`;

            const sRes = await fetch(stremioUrl, { signal: AbortSignal.timeout(3500) });
            if (sRes.ok) {
              const sData = await sRes.json();
              const trSubs = (sData.subtitles || []).filter(s => s && s.lang === 'tur' && s.url);
              if (trSubs.length > 0) {
                trSubs.sort((a, b) => {
                  const aSrt = (a.subtitleFileName || '').endsWith('.srt') ? 10 : 0;
                  const bSrt = (b.subtitleFileName || '').endsWith('.srt') ? 10 : 0;
                  return bSrt - aSrt;
                });
                downloadUrl = trSubs[0].url;
              }
            }
          } catch (_) {}
        }

        // Step B: Fallback to rest.opensubtitles.org
        if (!downloadUrl) {
          const cleanImdb = resolvedImdb ? String(resolvedImdb).replace(/^tt/, '') : null;
          let osCandidates = [];

          async function fetchOs(url) {
            let curr = url;
            for (let attempt = 0; attempt < 3; attempt++) {
              const r = await fetch(curr, {
                headers: { 'User-Agent': 'TemporaryUserAgent', 'Accept': 'application/json' },
                redirect: 'manual',
                signal: AbortSignal.timeout(4000)
              });
              if (r.status >= 300 && r.status < 400) {
                let loc = r.headers.get('location');
                if (loc) {
                  if (loc.startsWith('https://_/')) loc = loc.replace('https://_/', 'https://rest.opensubtitles.org/');
                  else if (loc.startsWith('/')) loc = 'https://rest.opensubtitles.org' + loc;
                  curr = loc;
                  continue;
                }
              }
              if (r.ok) return await r.json();
              return null;
            }
          }

          if (cleanImdb && !cleanImdb.match(/^[0-9]{1,4}$/)) {
            const osUrl = (season && episode)
              ? `https://rest.opensubtitles.org/search/episode-${episode}/imdbid-${cleanImdb}/season-${season}/sublanguageid-tur`
              : `https://rest.opensubtitles.org/search/imdbid-${cleanImdb}/sublanguageid-tur`;
            try {
              const list = await fetchOs(osUrl);
              if (Array.isArray(list) && list.length > 0) osCandidates.push(...list);
            } catch (_) {}
          }

          if (osCandidates.length === 0 && resolvedTitle) {
            const cleanQ = encodeURIComponent(resolvedTitle.replace(/[^\w\s]/gi, ' ').trim().toLowerCase()).replace(/%20/g, '+');
            if (cleanQ) {
              const qUrl = (season && episode)
                ? `https://rest.opensubtitles.org/search/episode-${episode}/query-${cleanQ}/season-${season}/sublanguageid-tur`
                : `https://rest.opensubtitles.org/search/query-${cleanQ}/sublanguageid-tur`;
              try {
                const list = await fetchOs(qUrl);
                if (Array.isArray(list) && list.length > 0) osCandidates.push(...list);
              } catch (_) {}
            }
          }

          const validCandidates = osCandidates.filter(c => c && c.SubDownloadLink);
          if (validCandidates.length > 0) {
            validCandidates.sort((a, b) => {
              const aSrt = (a.SubFormat || '').toLowerCase() === 'srt' ? 25 : 0;
              const bSrt = (b.SubFormat || '').toLowerCase() === 'srt' ? 25 : 0;
              const aForced = a.SubForeignPartsOnly === '1' ? -40 : 0;
              const bForced = b.SubForeignPartsOnly === '1' ? -40 : 0;
              const aCD = /cd\s*[2-9]/i.test(a.SubFileName || '') ? -20 : 0;
              const bCD = /cd\s*[2-9]/i.test(b.SubFileName || '') ? -20 : 0;
              const aDl = parseInt(a.SubDownloadsCnt || 0, 10);
              const bDl = parseInt(b.SubDownloadsCnt || 0, 10);
              return (bSrt + bForced + bCD + Math.min(bDl / 500, 15)) - (aSrt + aForced + aCD + Math.min(aDl / 500, 15));
            });
            downloadUrl = validCandidates[0].SubDownloadLink;
          }
        }
      } catch (_) {}
    }

    if (!downloadUrl) {
      return res.status(200).send('WEBVTT\n\n');
    }

    if (!isSafePublicUrl(downloadUrl)) return res.status(403).send('WEBVTT\n\n');

    try {
      const zlib = await import('zlib');
      const subRes = await fetch(downloadUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Referer': downloadUrl },
        signal: AbortSignal.timeout(7000)
      });
      const arrayBuf = await subRes.arrayBuffer();
      let rawBuffer = Buffer.from(arrayBuf);
      if (rawBuffer.length > 2 && rawBuffer[0] === 0x1f && rawBuffer[1] === 0x8b) {
        try {
          rawBuffer = zlib.gunzipSync(rawBuffer);
        } catch (_) {}
      }

      // Check encoding: If invalid UTF-8 bytes are detected (\uFFFD), decode as windows-1254 (Turkish ANSI)
      let text = '';
      const utf8Candidate = rawBuffer.toString('utf-8');
      if (utf8Candidate.includes('\uFFFD')) {
        try {
          text = new TextDecoder('windows-1254').decode(rawBuffer);
        } catch (_) {
          text = utf8Candidate;
        }
      } else {
        text = utf8Candidate;
      }

      const vttOutput = convertToWebVtt(text);
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=86400');
      return res.status(200).send(vttOutput);
    } catch (_) {
      return res.status(200).send('WEBVTT\n\n');
    }
  } else {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    let body = undefined;
    if (req.method === 'POST') {
      if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
        customHeaders['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      }
      if (Buffer.isBuffer(req.body)) {
        body = req.body.toString('utf-8');
      } else if (typeof req.body === 'object' && req.body !== null) {
        body = new URLSearchParams(req.body).toString();
      } else {
        body = req.body;
      }
    }

    let upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers: customHeaders,
      body: body
    }).catch(() => null);

    if (pathname.startsWith('/api/snx')) {
      const isBlocked = !upstreamRes || !upstreamRes.ok || (upstreamRes.headers.get('content-type') || '').includes('text/html');
      if (isBlocked) {
        const workerUrl = `https://wild-credit-e1ae.cagatayca07.workers.dev?url=${encodeURIComponent(targetUrl)}`;
        const workerRes = await fetch(workerUrl, {
          method: req.method,
          headers: customHeaders,
          body: body
        }).catch(() => null);
        if (workerRes && workerRes.ok) {
          upstreamRes = workerRes;
        }
      }
    }

    if (!upstreamRes) {
      return res.status(502).json({ error: 'Upstream fetch failed' });
    }

    // Forward Set-Cookie headers if any
    const setCookies = upstreamRes.headers.getSetCookie ? upstreamRes.headers.getSetCookie() : [upstreamRes.headers.get('set-cookie')];
    if (setCookies && setCookies.filter(Boolean).length > 0) {
      res.setHeader('Set-Cookie', setCookies.filter(Boolean));
    }

    const contentType = upstreamRes.headers.get('content-type') || 'text/html';
    res.setHeader('Content-Type', contentType);

    const buffer = await upstreamRes.arrayBuffer();
    return res.status(upstreamRes.status).send(Buffer.from(buffer));
  } catch (err) {
    console.error('Universal Proxy Error:', err);
    return res.status(500).json({ error: err.message });
  }
}

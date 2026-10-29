import { resolveCanliChannel } from './_canlitv.js';
import { guardNodeRequest, isSafePublicUrl } from './_security.js';
import { anonimJson, anonimGerekliMu } from './_anonim.js';
import { fetchLiveSourceChannels, fetchAllLiveSources, listLiveSources, isLiveSourceId } from './_liveSources.js';
import { Readable } from 'stream';
import downloadApk from './download_apk.js';

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

  // /api/webteizle_stream KALDIRILDI: istemci tarafı (webteizleScraper.js) ve
  // 'wtz' eklenti anahtarı silindi; uç hiç çağrılmıyordu (grep=0, canlı 404).

  if (pathname === '/api/download_apk' || pathname === '/cinepulse.apk') {
    return downloadApk(req, res);
  }

  let targetUrl = '';
  let customHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  // ---- Canli TV kaynaklari (Kral M3U / Turhan TV) ---------------------
  // CORS kapali listeler (Dropbox) ve Cloudflare korumali yayinlar sadece
  // sunucudan cozulebiliyor; APK da Vercel'i gectigi icin burasi ortak nokta.
  if (pathname.startsWith('/api/live_sources')) {
    const src = String(urlObj.searchParams.get('src') || 'all').toLowerCase();
    const wantAll = !src || src === 'all';
    if (!wantAll && !isLiveSourceId(src)) {
      return res.status(400).json({ error: 'Bilinmeyen kaynak', sources: listLiveSources() });
    }
    try {
      const results = wantAll ? await fetchAllLiveSources() : [await fetchLiveSourceChannels(src)];
      const payload = {
        savedAt: Date.now(),
        sources: (results || []).map((r) => ({
          id: r.id,
          label: r.label,
          ok: r.ok !== false,
          count: r.count || (r.channels || []).length,
          error: r.error || '',
          channels: r.channels || []
        }))
      };
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=900, s-maxage=1800, stale-while-revalidate=86400');
      return res.status(200).send(JSON.stringify(payload));
    } catch (error) {
      return res.status(502).json({ error: String(error?.message || error), sources: [] });
    }
  }

  if (pathname.startsWith('/api/img_proxy')) {
    const rawTarget = urlObj.searchParams.get('url') || '';
    if (!rawTarget) return res.status(400).send('Missing url');
    try {
    const decodedTarget = rawTarget;
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
    // CanliTV (canlitv.you) kanallari: channel=ctv:<slug> -> taze imzali m3u8'e 302
    if (channel.startsWith('ctv:')) {
      const slug = channel.slice(4).replace(/[^a-z0-9-]/g, '');
      if (!slug) return res.status(400).json({ error: 'Missing slug' });
      try {
        const result = await resolveCanliChannel(slug, urlObj.searchParams.get('playerId'), urlObj.searchParams.get('refresh') === '1');
        if (urlObj.searchParams.get('json') === '1') return res.json(result);
        return res.redirect(302, (result.proxiedUrl || result.embedUrl || result.externalUrl));
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    }
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
      const forceRefresh = urlObj.searchParams.get('refresh') === '1';
      if (!forceRefresh && globalThis._liveTvCache && globalThis._liveTvCache[channel] && globalThis._liveTvCache[channel].exp > now) {
        const cached = globalThis._liveTvCache[channel];
        const wantsJson = urlObj.searchParams.get('json') === '1';
        if (wantsJson) return res.json({ url: cached.url, proxiedUrl: cached.proxiedUrl, raw: cached.raw });
        return res.redirect(302, cached.proxiedUrl || cached.url);
      }

      // Full browser-like headers to bypass Cloudflare protection on DMAX/TLC sites
      const pageRes = await fetch(pageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
          'Referer': refUrl,
          'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'upgrade-insecure-requests': '1'
        }
      });
      if (!pageRes?.ok) {
        return res.status(502).json({ error: 'Official channel page unavailable', httpStatus: pageRes.status });
      }
      const html = await pageRes.text();
      const escapedHtml = html.replace(/\\\//g, '/').replace(/\\u0026/gi, '&').replace(/&amp;/gi, '&');
      const channelName = channel === 'dmax' ? 'dmax' : 'tlc';
      const daionMatch = escapedHtml.match(/daionUrl\s*:\s*['"](https?:\/\/[^'"]+)['"]/i);
      const candidates = [...escapedHtml.matchAll(/https?:\/\/[^\s'"<>\\]+?\.m3u8(?:\?[^\s'"<>\\]*)?/gi)].map(match => match[0]);
      const daionUrl = (daionMatch?.[1] || candidates.find(value => {
        try {
          const parsed = new URL(value);
          return parsed.hostname.endsWith('daioncdn.net') && parsed.pathname.toLowerCase().includes(`/${channelName}/`);
        } catch (_) { return false; }
      }) || '').replace(/\\\//g, '/').replace(/\\u0026/gi, '&');
      if (!daionUrl) {
        return res.status(502).json({ error: 'Failed to extract live stream URL', httpStatus: pageRes.status });
      }
      try {
        const parsedStreamUrl = new URL(daionUrl);
        if (!isSafePublicUrl(daionUrl) || !parsedStreamUrl.hostname.endsWith('daioncdn.net') || !parsedStreamUrl.pathname.toLowerCase().includes(`/${channelName}/`)) {
          return res.status(502).json({ error: 'Official stream URL validation failed' });
        }
      } catch (_) {
        return res.status(502).json({ error: 'Official stream URL validation failed' });
      }
      const proxiedUrl = `/api/hls_proxy?url=${encodeURIComponent(daionUrl)}&ref=${encodeURIComponent(refUrl)}`;

      if (!globalThis._liveTvCache) globalThis._liveTvCache = {};
      globalThis._liveTvCache[channel] = {
        url: daionUrl,
        proxiedUrl: proxiedUrl,
        raw: daionUrl,
        exp: now + 15 * 60 * 1000 // Signed playback URLs remain valid for multiple hours; cache for 15m
      };

      const wantsJson = urlObj.searchParams.get('json') === '1';
      res.setHeader('Cache-Control', 'no-store, max-age=0');
      if (wantsJson) return res.json({ url: daionUrl, proxiedUrl, raw: daionUrl });
      return res.redirect(302, daionUrl);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // RecTV / TVR Authenticated API Proxy (Enforces okhttp/4.12.0 User-Agent)

  // DiziBal AlphaStream (ag2m4) server-side HLS extractor
  // Fetches x.ag2m4.cfd embed page and extracts the real m3u8 URL
  if (pathname.startsWith('/api/hls_proxy')) {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
      return res.status(200).end();
    }

    const rawTarget = urlObj.searchParams.get('url') || '';
    let ref = urlObj.searchParams.get('ref') || '';
    const rawXSp = urlObj.searchParams.get('xsp') || '';
    const forceMediaDownload = urlObj.searchParams.get('download') === '1';
    if (!rawTarget) {
      return res.status(400).send('Missing url param');
    }

    try {
      const decodedTarget = rawTarget;
      if (!isSafePublicUrl(decodedTarget)) return res.status(403).send('Target blocked');

      if (!ref) {
        if (decodedTarget.includes('dizisol.com')) {
          ref = 'https://dizisol.com/';
        } else if (decodedTarget.includes('daioncdn.net') || decodedTarget.includes('dmax')) {
          ref = 'https://www.dmax.com.tr/';
        } else if (decodedTarget.includes('tlctv') || decodedTarget.includes('/tlc/')) {
          ref = 'https://www.tlctv.com.tr/';
        } else if (decodedTarget.includes('ag2m4') || decodedTarget.includes('uk-traffic-076') || decodedTarget.includes('dizibal')) {
          ref = 'https://x.ag2m4.cfd/';
        } else if (decodedTarget.includes('prectv') || decodedTarget.includes('mariuannastluisborg') || decodedTarget.includes('moveonjoy')) {
          ref = 'https://a.prectv70.lol/';
        } else if (decodedTarget.includes('hdfilmcehennemi')) {
          ref = 'https://hdfilmcehennemi.mobi/';
        } else if (decodedTarget.includes('fastplay.mom') || decodedTarget.includes('fastplay.')) {
          ref = 'https://fastplay.mom/';
        } else if (decodedTarget.includes('meatort') || decodedTarget.includes('lookmovie')) {
          ref = 'https://lookmovie2.la/';
        } else if (decodedTarget.includes('4astras') || decodedTarget.includes('saf45sfa') || decodedTarget.includes('4sa') || decodedTarget.includes('7862564') || decodedTarget.includes('959565') || decodedTarget.includes('45464654')) {
          ref = '';
        }
      }

      const isRecTv = decodedTarget.includes('prectv') || 
                      decodedTarget.includes('mariuannastluisborg') || 
                      decodedTarget.includes('moveonjoy') || 
                      (ref && ref.includes('prectv'));
      // M3U listelerindeki #EXTVLCOPT:http-user-agent degerleri kanalla
      // gelir (?ua=). Tarayici hls.js/mpegts.js'in User-Agent'ini degistire-
      // medigi icin (forbidden header) proxy tarafinda uygulanmasi gerekir.
      const forcedUa = String(urlObj.searchParams.get('ua') || '').slice(0, 400);
      const ua = forcedUa
        || (isRecTv ? 'okhttp/4.12.0' : (req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'));

      const upstreamHeaders = {
        'User-Agent': ua
      };
      if (rawXSp) {
        upstreamHeaders['X-Sp'] = rawXSp;
      }
      if (req.headers.range) {
        upstreamHeaders['Range'] = req.headers.range;
      }
      if (ref) {
        upstreamHeaders['Referer'] = ref;
        // Media CDNs reject Origin; Referer is sufficient.
      }
      const forcedOrigin = String(urlObj.searchParams.get('origin') || '').slice(0, 400);
      if (forcedOrigin) upstreamHeaders['Origin'] = forcedOrigin;

      const upstreamRes = await fetch(decodedTarget, {
        headers: upstreamHeaders
      });

      const contentType = upstreamRes.headers.get('content-type') || '';
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization, X-Sp');
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

      const isPlaylist = !forceMediaDownload && !isSegment && (
        lowerTarget.includes('.m3u8') || 
        lowerTarget.includes('/play') ||
        lowerTarget.includes('m3u8?') ||
        lowerCt.includes('mpegurl') || 
        lowerCt.includes('application/x-mpegurl') || 
        lowerCt.includes('text/plain')
      );

      if (isPlaylist) {
        const text = await upstreamRes.text();
        if (!upstreamRes.ok || !text.trimStart().startsWith('#EXTM3U')) {
          return res.status(upstreamRes.ok ? 502 : upstreamRes.status).send('Live playlist unavailable');
        }
        // Upstream yonlendirme yaparsa goreceli URL'ler SON adrese gore cozulur.
        const finalUpstreamUrl = (upstreamRes.url && upstreamRes.url.startsWith('http')) ? upstreamRes.url : decodedTarget;
        const baseOrigin = new URL(finalUpstreamUrl).origin;

        const forceProxyAll = urlObj.searchParams.get('live') === '1';
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
                const urlPath = new URL(finalUpstreamUrl).pathname;
                const lastSlash = urlPath.lastIndexOf('/');
                const dir = lastSlash !== -1 ? urlPath.substring(0, lastSlash + 1) : '/';
                fullU = `${baseOrigin}${dir}${u}`;
              }

              const childRef = fullU.includes('dizisol.com') ? 'https://dizisol.com/' : (fullU.includes('ag2m4') || fullU.includes('uk-traffic-076') ? 'https://x.ag2m4.cfd/' : (fullU.includes('fastplay.mom') ? 'https://fastplay.mom/' : ref));
              const xspParam = rawXSp ? `&xsp=${encodeURIComponent(rawXSp)}` : '';
              return `URI="/api/hls_proxy?url=${encodeURIComponent(fullU)}&ref=${encodeURIComponent(childRef)}${forceProxyAll ? '&live=1' : ''}${xspParam}"`;
            });
          }

          if (trimmed.startsWith('#')) return currentLine;

          let fullLineUrl;
          if (trimmed.startsWith('http')) {
            fullLineUrl = trimmed;
          } else if (trimmed.startsWith('/')) {
            fullLineUrl = `${baseOrigin}${trimmed}`;
          } else {
            const urlPath = new URL(finalUpstreamUrl).pathname;
            const lastSlash = urlPath.lastIndexOf('/');
            const dir = lastSlash !== -1 ? urlPath.substring(0, lastSlash + 1) : '/';
            fullLineUrl = `${baseOrigin}${dir}${trimmed}`;
          }

          // Dizisol URL analizi (test edildi):
          // - s5.dizisol.com/play? ve /m3u8? → Referer zorunlu → proxy'den geç
          // - s5.dizisol.com/ts? → Access-Control-Allow-Origin: * → bypass et (hız)
          const isDizisolPlaylist = fullLineUrl.includes('dizisol.com') &&
            !fullLineUrl.includes('/ts?') && !fullLineUrl.includes('/ts/');
          // Direct CDN bypass for video segments and sub-playlists with open CORS
          // Bypasses proxy for 10x faster playback (<200ms start)
          // Canli TV (live=1): segmentler CORS'suz CDN'lerde dogrudan oynayamaz,
          // hepsi proxy'den gecmeli. VOD bypass kurallari burada uygulanmaz.
          const needsProxy = forceProxyAll || isDizisolPlaylist || /(?:hdfilmizle\.best|hdfilmcehennemi|prectv|dmax|tlc|daioncdn|fastplay\.mom)/i.test(ref) || /(?:uk-traffic-076|ag2m4|playmix|hdfilmcehennemi|rapidrame|mariuannastluisborg|moveonjoy|daioncdn)/i.test(fullLineUrl);
          if (
            !needsProxy &&
            (
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

          const childRef = fullLineUrl.includes('dizisol.com') ? 'https://dizisol.com/' : (fullLineUrl.includes('ag2m4') || fullLineUrl.includes('uk-traffic-076') ? 'https://x.ag2m4.cfd/' : (fullLineUrl.includes('fastplay.mom') ? 'https://fastplay.mom/' : ref));
          // Version the HDF transport cache key after correcting its MIME type;
          // otherwise CDN-cached image/png responses linger for a full day.
          const hdfTransportVersion = /\.cfd\/hdfilm\//i.test(fullLineUrl)
            && /\.(?:png|jpg)(?:$|\?)/i.test(fullLineUrl)
            ? '&hdf_ts=2'
            : '';
          const xspParam = rawXSp ? `&xsp=${encodeURIComponent(rawXSp)}` : '';
          return `/api/hls_proxy?url=${encodeURIComponent(fullLineUrl)}&ref=${encodeURIComponent(childRef)}${hdfTransportVersion}${forceProxyAll ? '&live=1' : ''}${xspParam}`;
        }).join('\n');

        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        return res.status(upstreamRes.status).send(rewritten);
      } else {
        // Stream TS/video bytes immediately; buffering a complete 6-10 second
        // segment made TVR channel startup feel unnecessarily slow.
        res.statusCode = upstreamRes.status;
        const isMkv = contentType.includes('matroska') || decodedTarget.includes('.mkv');
        // HDF intentionally disguises MPEG-TS chunks as .png files. Keeping
        // the upstream image MIME type makes some mobile media stacks reject
        // otherwise valid HLS data.
        const isHdfTransportStream = /\.cfd\/hdfilm\//i.test(decodedTarget)
          && /\.(?:png|jpg)(?:$|\?)/i.test(decodedTarget);
        // Preserve the established SWX response behavior. The source has been
        // consumed as a progressive MP4-compatible stream in this player for
        // months, and changing the advertised container caused regressions.
        res.setHeader('Content-Type', isMkv ? 'video/mp4' : (isHdfTransportStream ? 'video/mp2t' : (contentType || 'video/mp4')));
        // HDF's VOD segments are immutable, but its CDN requires the original
        // site Referer. Cache the already-authorized proxy response at Vercel
        // so repeat playback does not pay for a full upstream fetch per chunk.
        if (/\.cfd\/hdfilm\//i.test(decodedTarget)) {
          res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
        }
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

  // MKV → video/mp4 byte-pass-through proxy (Vercel / serverless uyumlu)
  // Vercel'de ffmpeg çalışmadığından remux yapılamaz; bunun yerine MKV
  // dosyaları Content-Type: video/mp4 ile doğrudan proxylenir. H.264+AAC
  // içeren MKV'ler bu şekilde modern tarayıcılarda sorunsuz oynatılır.

  if (pathname.startsWith('/api/dml')) {
    // Kısa dizi (Dora) — arama ve bölüm uçları aynı kalıpla geçer.
    const subPath = pathname.replace(/^\/api\/dml/, '');
    const cleanSub = subPath.startsWith('/') ? subPath : (subPath ? '/' + subPath : '');
    targetUrl = `https://dramalar.com${cleanSub}${search}`;
    customHeaders['Referer'] = 'https://dramalar.com/';
    customHeaders['Origin'] = 'https://dramalar.com';
  } else if (pathname.startsWith('/api/ddz')) {
    const subPath = pathname.replace(/^\/api\/ddz/, '');
    const cleanSub = subPath.startsWith('/') ? subPath : (subPath ? '/' + subPath : '');
    targetUrl = `https://dramadizilerim.com${cleanSub}${search}`;
    customHeaders['Referer'] = 'https://dramadizilerim.com/';
    customHeaders['Origin'] = 'https://dramadizilerim.com';
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
    // Keep the upstream request browser-like. Several media hosts (including
    // FastPlay) reject an injected Origin header with 403; Referer is enough.

    customHeaders['User-Agent'] = req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
    if (req.headers['x-hdf-nonce']) customHeaders['X-HDF-Nonce'] = req.headers['x-hdf-nonce'];
    if (req.headers['x-requested-with']) customHeaders['X-Requested-With'] = req.headers['x-requested-with'];

  } else if (pathname.startsWith('/api/subtitles')) {
    // WebVTT Altyazı Vekili + OpenSubtitles Çözücüsü (çok katmanlı)
    // ------------------------------------------------------------------
    // Katmanlar (dil başına): 1) strem.io OpenSubtitles v3 (imdb; UTF-8
    // hazır, en hızlı) 2) rest.opensubtitles.org (imdb veya başlık sorgusu).
    // dil=tr|en dili seçer (varsayılan tr). mod=ara indirileni DÜŞÜRMEDEN
    // aday listesini JSON döner: oynatıcı hangi dilin GERÇEKTEN var olduğunu
    // bilir ve track etiketini ona göre dürüst yazar (kullanıcı kuralı:
    // doğrulanamayan iddia yok).
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Content-Type', 'text/vtt; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const dilKodu = String(urlObj.searchParams.get('dil') || 'tr').toLowerCase() === 'en' ? 'eng' : 'tur';
    const modAra = String(urlObj.searchParams.get('mod') || '').toLowerCase() === 'ara';
    if (modAra) res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const tmdbIdParam = urlObj.searchParams.get('imdbId') || urlObj.searchParams.get('tmdbId');
    const directUrl = urlObj.searchParams.get('url');
    const titleParam = urlObj.searchParams.get('title') || urlObj.searchParams.get('q');
    const season = urlObj.searchParams.get('season');
    const episode = urlObj.searchParams.get('episode');
    const mediaType = urlObj.searchParams.get('type') || (season ? 'tv' : 'movie');

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

    // ── Kimlik çözümleme: imdb doğrudan gelir ya da TMDB external_ids/başlık ──
    let resolvedImdb = tmdbIdParam && String(tmdbIdParam).startsWith('tt') ? tmdbIdParam : null;
    let resolvedTitle = titleParam ? decodeURIComponent(titleParam) : null;

    const rawTmdb = tmdbIdParam && !String(tmdbIdParam).startsWith('tt') ? tmdbIdParam : null;
    if (rawTmdb && (!resolvedImdb || !resolvedTitle)) {
      const TMDB_KEYS = (process.env.CP_TMDB_KEYS ? process.env.CP_TMDB_KEYS.split(',').map((k) => k.trim()).filter(Boolean) : ['4e44d9029b1270a757cddc766a1bcb63', '844dba0bfd8f3a4f3799f6130ef9e335']);
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

    // Başlık-only istek: TMDB arama ile imdb çözülmeye çalışılır — imdb'siz
    // içerikte de OpenSubtitles'ın tamamı (strem v3) görülebilir.
    if (!resolvedImdb && resolvedTitle) {
      const TMDB_KEYS_ARA = (process.env.CP_TMDB_KEYS ? process.env.CP_TMDB_KEYS.split(',').map((k) => k.trim()).filter(Boolean) : ['4e44d9029b1270a757cddc766a1bcb63', '844dba0bfd8f3a4f3799f6130ef9e335']);
      for (const key of TMDB_KEYS_ARA) {
        try {
          const sRes = await fetch(
            `https://api.themoviedb.org/3/search/${mediaType}?query=${encodeURIComponent(resolvedTitle)}&api_key=${key}`,
            { signal: AbortSignal.timeout(3000) }
          );
          if (sRes.ok) {
            const sData = await sRes.json();
            const ilk = (sData.results || [])[0];
            if (ilk) {
              const extRes = await fetch(
                `https://api.themoviedb.org/3/${mediaType}/${ilk.id}/external_ids?api_key=${key}`,
                { signal: AbortSignal.timeout(3000) }
              );
              if (extRes.ok) {
                const extData = await extRes.json();
                if (extData.imdb_id) resolvedImdb = extData.imdb_id;
              }
            }
          }
          if (resolvedImdb) break;
        } catch (_) {}
      }
    }

    // ── Dil için indirilebilir altyazı adresi (yoksa null). v3 → rest zinciri. ──
    async function indirilebilirAdres(langCode) {
      let downloadUrl = null;

      // 1) Stremio OpenSubtitles v3 (hızlı, UTF-8'e çevrilmiş SRT)
      if (resolvedImdb) {
        try {
          const stremioUrl = (season && episode)
            ? `https://opensubtitles-v3.strem.io/subtitles/series/${resolvedImdb}:${season}:${episode}.json`
            : `https://opensubtitles-v3.strem.io/subtitles/movie/${resolvedImdb}.json`;

          const sRes = await fetch(stremioUrl, { signal: AbortSignal.timeout(3500) });
          if (sRes.ok) {
            const sData = await sRes.json();
            const sec = (sData.subtitles || []).filter(s => s && s.lang === langCode && s.url);
            if (sec.length > 0) {
              sec.sort((a, b) => {
                const aSrt = (a.subtitleFileName || '').endsWith('.srt') ? 10 : 0;
                const bSrt = (b.subtitleFileName || '').endsWith('.srt') ? 10 : 0;
                return bSrt - aSrt;
              });
              downloadUrl = sec[0].url;
            }
          }
        } catch (_) {}
      }

      // 2) rest.opensubtitles.org (imdb veya başlık sorgusu; güvenli yönlendirme + sıralama)
      if (!downloadUrl) {
        const cleanImdb = resolvedImdb ? String(resolvedImdb).replace(/^tt/, '') : null;
        let osCandidates = [];

        async function fetchOs(url) {
          let curr = url;
          for (let attempt = 0; attempt < 3; attempt++) {
            const r = await fetch(curr, {
              // 'TemporaryUserAgent' rest API'de 403 yiyordu (ölçüldü 2026-10-30).
              headers: { 'User-Agent': 'CinePulseStudio v1.1 (https://cinepulse.app)', 'Accept': 'application/json' },
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
            if (r.ok) {
              // Anubis anti-bot challenge HTML'i JSON sanılıp altyazı diye
              // servis edilmesin (ölçüldü: worker IP'lerine challenge dönüyor).
              const metin = await r.text();
              if (/^\s*[\[{]/.test(metin)) { try { return JSON.parse(metin); } catch (_) {} }
              return null;
            }
            return null;
          }
        }

        if (cleanImdb && !cleanImdb.match(/^[0-9]{1,4}$/)) {
          const osUrl = (season && episode)
            ? `https://rest.opensubtitles.org/search/episode-${episode}/imdbid-${cleanImdb}/season-${season}/sublanguageid-${langCode}`
            : `https://rest.opensubtitles.org/search/imdbid-${cleanImdb}/sublanguageid-${langCode}`;
          try {
            const list = await fetchOs(osUrl);
            if (Array.isArray(list) && list.length > 0) osCandidates.push(...list);
          } catch (_) {}
        }

        if (osCandidates.length === 0 && resolvedTitle) {
          const cleanQ = encodeURIComponent(resolvedTitle.replace(/[^\w\s]/gi, ' ').trim().toLowerCase()).replace(/%20/g, '+');
          if (cleanQ) {
            const qUrl = (season && episode)
              ? `https://rest.opensubtitles.org/search/episode-${episode}/query-${cleanQ}/season-${season}/sublanguageid-${langCode}`
              : `https://rest.opensubtitles.org/search/query-${cleanQ}/sublanguageid-${langCode}`;
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

      return downloadUrl;
    }

    // ── mod=ara: indirmeden aday listesi (etiket dürüstlüğü için) ──
    if (modAra) {
      if (!resolvedImdb && !resolvedTitle) return res.status(200).json({ altyazilar: [] });
      let araSonuc = [];
      try {
        const [trUrl, enUrl] = await Promise.all([indirilebilirAdres('tur'), indirilebilirAdres('eng')]);
        const temel = `${urlObj.origin}${pathname}`;
        const vttUrl = (dil) => {
          const p = new URLSearchParams();
          if (resolvedImdb) p.set('imdbId', resolvedImdb);
          else if (rawTmdb) p.set('tmdbId', rawTmdb);
          if (resolvedTitle) p.set('title', resolvedTitle);
          if (season && episode) { p.set('season', season); p.set('episode', episode); }
          p.set('type', mediaType);
          p.set('dil', dil);
          return `${temel}?${p.toString()}`;
        };
        if (trUrl) araSonuc.push({ dil: 'tr', etiket: 'OpenSubtitles (Türkçe)', bulundu: true, vttUrl: vttUrl('tr') });
        if (enUrl) araSonuc.push({ dil: 'en', etiket: 'OpenSubtitles (İngilizce)', bulundu: true, vttUrl: vttUrl('en') });
      } catch (_) {}
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      return res.status(200).json({ altyazilar: araSonuc });
    }

    let downloadUrl = directUrl;
    if (!downloadUrl && (tmdbIdParam || titleParam)) {
      try { downloadUrl = await indirilebilirAdres(dilKodu); } catch (_) {}
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

      // Kodlama denetimi: geçersiz UTF-8 baytı (\uFFFD) görülürse windows-1254
      // (Türkçe ANSI) olarak çöz — aksi halde TR altyazılar Türkçesiz görünür.
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
    if (pathname.startsWith('/api/proxy') && req.headers.range) {
      customHeaders['Range'] = req.headers.range;
    }
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

    if (!upstreamRes) {
      return res.status(502).json({ error: 'Upstream fetch failed' });
    }

    // Forward Set-Cookie headers if any
    const setCookies = upstreamRes.headers.getSetCookie ? upstreamRes.headers.getSetCookie() : [upstreamRes.headers.get('set-cookie')];
    if (setCookies && setCookies.filter(Boolean).length > 0) {
      res.setHeader('Set-Cookie', setCookies.filter(Boolean));
    }

    const upstreamContentType = upstreamRes.headers.get('content-type') || '';
    // The SWX CDN returns MKV files as application/octet-stream. Our proxy
    // URL has no file extension, so browsers otherwise cannot identify the
    // media container and leave the <video> element stuck at metadata.
    const contentType = /\.mkv(?:$|[?#])/i.test(targetUrl)
      // SWX's progressive server sends a Matroska file with no usable MIME.
      // The native video element performs container sniffing when it is served
      // as a video stream; its Matroska MIME path is rejected before decoding
      // on several Chromium builds.
      ? 'video/mp4'
      : (upstreamContentType || 'text/html');
    res.setHeader('Content-Type', contentType);

    if (pathname.startsWith('/api/proxy')) {
      res.statusCode = upstreamRes.status;
      res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
      for (const header of ['content-length', 'content-range', 'accept-ranges']) {
        const value = upstreamRes.headers.get(header);
        if (value && (header !== 'content-length' || !upstreamRes.headers.get('content-encoding'))) res.setHeader(header, value);
      }
      if (!upstreamRes.body || req.method === 'HEAD') return res.end();
      await new Promise((resolve, reject) => {
        const stream = Readable.fromWeb(upstreamRes.body);
        stream.on('error', reject);
        res.on('finish', resolve);
        res.on('close', () => { stream.destroy(); resolve(); });
        stream.pipe(res);
      });
      return;
    }

    const buffer = await upstreamRes.arrayBuffer();
    // ANONİMLİK (site adı sızıntısı): upstream'in JSON gövdesindeki
    // name/source/badge/label değerleri kod adıyla yazılır (Atlas/Luna…).
    // Alan adları, sırası ve HTTP durumu AYNEN kalır → istemci parse'ı bozulmaz.
    if ((contentType || '').includes('json') && anonimGerekliMu(targetUrl)) {
      return res.status(upstreamRes.status).send(Buffer.from(anonimJson(Buffer.from(buffer).toString('utf-8')), 'utf-8'));
    }
    return res.status(upstreamRes.status).send(Buffer.from(buffer));
  } catch (err) {
    console.error('Universal Proxy Error:', err);
    return res.status(500).json({ error: err.message });
  }
}

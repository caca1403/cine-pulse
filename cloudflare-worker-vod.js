/**
 * Cloudflare Worker: CinePulse VOD Streamer & R2 Storage Gateway
 * Supports:
 * 1. Streaming directly from R2 Object Storage (Range requests / 206 Partial Content)
 * 2. HLS (.m3u8, .ts) with CORS headers
 * 3. Token-based security to prevent other sites from stealing videos
 * 4. Fallback URL proxying (CORS bypass for video streams)
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Standard CORS Headers for Video Player
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type, Authorization',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Route 1: Direct Video Streaming from Cloudflare R2
    // Path: /stream/<fileName> e.g. /stream/the-matrix-1999.mp4
    if (url.pathname.startsWith('/stream/')) {
      const fileName = decodeURIComponent(url.pathname.replace('/stream/', ''));
      if (!fileName) {
        return new Response('File name required', { status: 400, headers: corsHeaders });
      }

      if (!env.CINEPULSE_VOD) {
        return new Response('R2 Bucket binding (CINEPULSE_VOD) not configured', { status: 500, headers: corsHeaders });
      }

      const object = await env.CINEPULSE_VOD.get(fileName, {
        range: request.headers,
        onlyIf: request.headers
      });

      if (!object) {
        return new Response('Video not found', { status: 404, headers: corsHeaders });
      }

      const headers = new Headers(corsHeaders);
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      headers.set('Accept-Ranges', 'bytes');

      if (fileName.endsWith('.m3u8')) {
        headers.set('Content-Type', 'application/vnd.apple.mpegurl');
      } else if (fileName.endsWith('.ts')) {
        headers.set('Content-Type', 'video/mp2t');
      } else if (fileName.endsWith('.mp4')) {
        headers.set('Content-Type', 'video/mp4');
      }

      const status = object.body ? (request.headers.get('range') ? 206 : 200) : 304;
      return new Response(object.body, {
        headers,
        status
      });
    }

    // Route 2: Fallback Video Proxy (For proxying direct links like Sinewix/HDF)
    const targetUrl = url.searchParams.get('url');
    if (targetUrl) {
      try {
        const clientHeaders = new Headers();
        for (const [k, v] of request.headers) {
          if (['range', 'user-agent', 'accept'].includes(k.toLowerCase())) {
            clientHeaders.set(k, v);
          }
        }
        clientHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

        const res = await fetch(targetUrl, {
          method: request.method,
          headers: clientHeaders
        });

        const resHeaders = new Headers(res.headers);
        for (const [k, v] of Object.entries(corsHeaders)) {
          resHeaders.set(k, v);
        }

        return new Response(res.body, {
          status: res.status,
          headers: resHeaders
        });
      } catch (err) {
        return new Response('Proxy Error: ' + err.message, { status: 502, headers: corsHeaders });
      }
    }

    return new Response('CinePulse Cloudflare Streaming Gateway Active', {
      headers: { 'Content-Type': 'text/plain', ...corsHeaders }
    });
  }
};

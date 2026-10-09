import { defineConfig } from 'vite';
import dns from 'node:dns';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { dramaDevProxy } from './server/dramaDevProxy.js';

dns.setDefaultResultOrder('ipv4first');

const __viteDir = path.dirname(fileURLToPath(import.meta.url));
const PY_BIN = process.env.PYTHON_BIN || (process.platform === 'win32' ? 'python' : 'python3');

// Local'de :4000 (mediaServer) yoksa vite proxy ECONNREFUSED doner ve
// tum python cozuculer (CloseLoad/Rapidrame/SetPlay/FastPlay/SezonlukDizi)
// local'de bos kalir. Bu middleware once :4000'i yoklar; cevap yoksa
// ayni python script'lerini vite icinden calistirir (npm run server sartsiz).
let _sidecarUp = null;
let _sidecarCheckedAt = 0;
async function sidecarUp() {
  if (_sidecarUp !== null && Date.now() - _sidecarCheckedAt < 15000) return _sidecarUp;
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 800);
    const r = await fetch('http://127.0.0.1:4000/health', { signal: ctl.signal }).catch(() => null);
    clearTimeout(t);
    _sidecarUp = Boolean(r && r.ok);
  } catch (_) {
    _sidecarUp = false;
  }
  _sidecarCheckedAt = Date.now();
  return _sidecarUp;
}

function runPy(script, args, timeoutMs) {
  return new Promise((resolve) => {
    execFile(PY_BIN, [script, ...args], { timeout: timeoutMs }, (err, stdout) => {
      if (err || !stdout) return resolve(null);
      try {
        resolve(JSON.parse(stdout.trim()));
      } catch (_) {
        resolve(null);
      }
    });
  });
}

function epgDevPlugin() {
  return {
    name: 'epg-dev-plugin',
    configureServer(server) {
      server.middlewares.use(dramaDevProxy);
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/epg')) {
          try {
            const epgHandler = (await import('./api/epg.js')).default;
            const resWrapper = {
              setHeader: (k, v) => res.setHeader(k, v),
              status: (code) => {
                res.statusCode = code;
                return {
                  json: (data) => {
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    res.end(JSON.stringify(data));
                  },
                  end: () => res.end()
                };
              }
            };
            return await epgHandler(req, resWrapper);
          } catch (err) {
            console.error('Vite EPG Dev Middleware Error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }
        if (req.url && req.url.startsWith('/api/fanart')) {
          try {
            const fanartHandler = (await import('./api/fanart.js')).default;
            const resWrapper = {
              setHeader: (k, v) => res.setHeader(k, v),
              status: (code) => {
                res.statusCode = code;
                return {
                  json: (data) => {
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    res.end(JSON.stringify(data));
                  },
                  end: () => res.end()
                };
              }
            };
            return await fanartHandler(req, resWrapper);
          } catch (err) {
            console.error('Vite Fanart Dev Middleware Error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }
        // Python cozuculer fallback'i: :4000 yoksa vite icinden calistir.
        if (req.url && req.url.startsWith('/api/webteizle_stream')) {
          try {
            if (await sidecarUp()) return next();
            const wtzHandler = (await import('./api/webteizle_stream.js')).default;
            const resWrapper = {
              setHeader: (k, v) => res.setHeader(k, v),
              status: (code) => {
                res.statusCode = code;
                return {
                  json: (data) => {
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    res.end(JSON.stringify(data));
                  },
                  send: (data) => res.end(typeof data === 'string' ? data : JSON.stringify(data)),
                  end: () => res.end()
                };
              }
            };
            return await wtzHandler({ ...req, headers: { ...(req.headers || {}), host: 'localhost:3000' } }, resWrapper);
          } catch (err) {
            console.error('Vite WTZ Middleware Error:', err?.message);
            return next();
          }
        }
        // SezonlukDizi proxy fallback'i (klasik sayfa+AJAX akisi local'de calissin).
        if (req.url && (req.url.startsWith('/api/szd') || req.url.startsWith('/szd'))) {
          try {
            if (await sidecarUp()) return next();
            const u = new URL(req.url, 'http://localhost:3000');
            const pathParam = u.searchParams.get('path');
            const subPath = pathParam
              ? (pathParam.startsWith('/') ? pathParam : `/${pathParam}`)
              : req.url.split('?')[0].replace(/^(\/api)?\/szd/, '');
            const cleanSearch = u.search ? u.search.replace(/[?&]path=[^&]*/g, '').replace(/^&/, '?') : '';
            const targetUrl = `https://sezonlukdizi.cc${subPath}${cleanSearch}`;
            const fwdHeaders = {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              'Referer': 'https://sezonlukdizi.cc/',
              'Origin': 'https://sezonlukdizi.cc',
              'X-Requested-With': 'XMLHttpRequest'
            };
            let body;
            if (req.method === 'POST') {
              fwdHeaders['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
              body = await new Promise((resolve) => {
                const chunks = [];
                req.on('data', (c) => chunks.push(c));
                req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
                req.on('error', () => resolve(''));
              });
              try {
                const ctl = new AbortController();
                const t = setTimeout(() => ctl.abort(), 5000);
                const sessionRes = await fetch('https://sezonlukdizi.cc/', {
                  headers: { 'User-Agent': fwdHeaders['User-Agent'] },
                  signal: ctl.signal
                }).catch(() => null);
                clearTimeout(t);
                const setCookie = sessionRes?.headers.get('set-cookie');
                if (setCookie) fwdHeaders['Cookie'] = setCookie.split(';')[0];
              } catch (_) {}
            }
            const ctl = new AbortController();
            const t = setTimeout(() => ctl.abort(), 10000);
            const upstreamRes = await fetch(targetUrl, {
              method: req.method, headers: fwdHeaders, body: body || undefined, signal: ctl.signal
            }).catch(() => null);
            clearTimeout(t);
            if (!upstreamRes) {
              res.statusCode = 502;
              res.end(JSON.stringify({ error: 'upstream unreachable' }));
              return;
            }
            res.statusCode = upstreamRes.status;
            res.setHeader('Content-Type', upstreamRes.headers.get('content-type') || 'text/html; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            const data = await upstreamRes.text().catch(() => '');
            res.end(data);
            return;
          } catch (err) {
            console.error('Vite SZD Middleware Error:', err?.message);
            return next();
          }
        }
        if (req.url && (req.url.startsWith('/api/resolve') || req.url.startsWith('/api/hdfc_stream'))) {
          try {
            if (await sidecarUp()) return next();
            const u = new URL(req.url, 'http://localhost:3000');
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.setHeader('Access-Control-Allow-Origin', '*');
            if (req.url.startsWith('/api/resolve')) {
              const g = (k, d = '') => u.searchParams.get(k) ?? d;
              const pyArgs = [
                g('provider'), g('title') || g('query'), g('originalTitle'),
                g('season', '1'), g('episode', '1'), g('type', 'movie'),
                g('tmdbId') || 'null', g('imdbId') || 'null', g('isDub') || 'null',
                g('slug') || 'null'
              ];
              // Aday basliklar (t0..t5) argv'ye sigmaz; env ile gec.
              const titles = [];
              for (let i = 0; i < 6; i++) {
                const t = u.searchParams.get(`t${i}`);
                if (t) titles.push(t);
              }
              const { execFile: _ef } = await import('node:child_process');
              const data = await new Promise((resolve) => {
                _ef(PY_BIN, [path.join(__viteDir, 'api', 'resolve.py'), ...pyArgs], {
                  timeout: 45000,
                  env: { ...process.env, CP_TITLES: JSON.stringify(titles) }
                }, (err, stdout) => {
                  if (err || !stdout) return resolve(null);
                  try { resolve(JSON.parse(stdout.trim())); } catch (_) { resolve(null); }
                });
              });
              res.statusCode = 200;
              res.end(JSON.stringify(data || { success: false, error: 'Resolution failed' }));
              return;
            }
            const data = await runPy(path.join(__viteDir, 'server', 'hdfc_extractor.py'), [
              u.searchParams.get('query') || u.searchParams.get('title') || '',
              u.searchParams.get('originalTitle') || '',
              u.searchParams.get('season') || '1',
              u.searchParams.get('episode') || '1',
              u.searchParams.get('type') || ''
            ], 60000);
            res.statusCode = 200;
            res.end(JSON.stringify(data || { success: false, error: 'Extraction failed' }));
            return;
          } catch (err) {
            console.error('Vite Py Fallback Error:', err?.message);
            return next();
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [epgDevPlugin()],
  // bittorrent-tracker'ın tarayıcı istemcisi, Node ortamını ayırt etmek için
  // global nesneleri kullanır. Vite 5 bunları otomatik eklemez.
  define: {
    global: 'globalThis'
  },
  base: './',
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/ddz': {
        target: 'https://dramadizilerim.com',
        changeOrigin: true,
        secure: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Referer: 'https://dramadizilerim.com/'
        },
        rewrite: (path) => path.replace(/^\/api\/ddz/, '') || '/'
      },
      '/api/dml': {
        target: 'https://dramalar.com',
        changeOrigin: true,
        secure: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Referer: 'https://dramalar.com/'
        },
        rewrite: (path) => path.replace(/^\/api\/dml/, '') || '/'
      },
      '/api/subtitles': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/subtitles/, '/subtitles')
      },
      '/api/proxy': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/proxy/, '/proxy')
      },
      '/api/hls_proxy': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/hls_proxy/, '/hls_proxy')
      },
      '/api/live_tv_stream': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/live_tv_stream/, '/live_tv_stream')
      },
      '/api/hdfc_stream': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/hdfc_stream/, '/hdfc_stream')
      },
      '/api/dzb_stream': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/dzb_stream/, '/api/dzb_stream')
      },
      '/api/webteizle_stream': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/webteizle_stream/, '/api/webteizle_stream')
      },
      '/api/resolve': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/resolve/, '/resolve')
      },
      '/api/img_proxy': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/img_proxy/, '/img_proxy')
      },
      '/api/szd': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/szd/, '/szd')
      },
      '/api/rtv': {
        target: 'https://a.prectv70.lol',
        changeOrigin: true,
        secure: false,
        headers: {
          'User-Agent': 'okhttp/4.12.0'
        },
        rewrite: (path) => path.replace(/^\/api\/rtv/, '/api')
      },
      '/api/dzb': {
        target: 'https://dizibal.org/api',
        changeOrigin: true,
        secure: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://dizibal.org/'
        },
        rewrite: (path) => path.replace(/^\/api\/dzb/, '')
      },
      '/api/dbl': {
        target: 'https://dizibal.org/api',
        changeOrigin: true,
        secure: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://dizibal.org/'
        },
        rewrite: (path) => path.replace(/^\/api\/dbl/, '')
      },
      '/api/dzs': {
        target: 'https://dizisol.com/api',
        changeOrigin: true,
        secure: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://dizisol.com/'
        },
        rewrite: (path) => path.replace(/^\/api\/dzs/, '')
      },
      '/api/snx': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/snx/, '/api/snx')
      },
      '/api/dzy': {
        target: 'https://www.diziyou.one',
        changeOrigin: true,
        secure: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': 'https://www.diziyou.one/'
        },
        rewrite: (path) => path.replace(/^\/api\/dzy/, '')
      },
      '/api/dzyo': {
        target: 'https://www.diziyo.so',
        changeOrigin: true,
        secure: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': 'https://www.diziyo.so/'
        },
        rewrite: (path) => path.replace(/^\/api\/dzyo/, '')
      },
      '/api/kvip': {
        target: 'https://cizgimax.online',
        changeOrigin: true,
        secure: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://cizgimax.online/'
        },
        rewrite: (path) => path.replace(/^\/api\/kvip/, '')
      },
      '/api/sibnet': {
        target: 'https://video.sibnet.ru',
        changeOrigin: true,
        secure: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://video.sibnet.ru/'
        },
        rewrite: (path) => path.replace(/^\/api\/sibnet/, '')
      },
      '/torrent': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      },
      '/api/torrent': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/torrent/, '/torrent')
      }
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/hls.js/')) return 'vendor-hls';
          if (id.includes('/@capacitor/')) return 'vendor-capacitor';
          if (id.includes('/lucide/')) return 'vendor-icons';
          return undefined;
        }
      }
    }
  },
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none'
  }
});

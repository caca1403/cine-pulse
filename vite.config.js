import { defineConfig } from 'vite';

function epgDevPlugin() {
  return {
    name: 'epg-dev-plugin',
    configureServer(server) {
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
      '/api/subtitles': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/subtitles/, '/subtitles')
      },
      '/api/proxy': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/proxy/, '/proxy')
      },
      '/api/hls_proxy': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/hls_proxy/, '/hls_proxy')
      },
      '/api/live_tv_stream': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/live_tv_stream/, '/live_tv_stream')
      },
      '/api/hdfc_stream': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/hdfc_stream/, '/hdfc_stream')
      },
      '/api/dzb_stream': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/dzb_stream/, '/api/dzb_stream')
      },
      '/api/szd': {
        target: 'https://sezonlukdizi.cc',
        changeOrigin: true,
        secure: false,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://sezonlukdizi.cc/'
        },
        rewrite: (path) => path.replace(/^\/api\/szd/, '')
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
    cssMinify: true
  },
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none'
  }
});

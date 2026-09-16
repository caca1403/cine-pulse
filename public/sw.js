// CinePulse Service Worker for PWA Offline Caching & Instant Loading
const CACHE_NAME = 'cinepulse-v1.0.8';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Do not cache API requests or video streams
  if (
    url.includes('/api/') ||
    url.includes('.m3u8') ||
    url.includes('.ts') ||
    url.includes('.mp4') ||
    url.includes('themoviedb.org') ||
    url.includes('workers.dev')
  ) {
    return;
  }

  // Network-first with cache fallback for SPA assets
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200 && event.request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

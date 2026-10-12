import { apiUrl } from '../apiOrigin.js';

let installed = false;

export function androidRequestUrl(input, base = window.location.href) {
  const url = new URL(typeof input === 'string' ? input : input.url || String(input), base);
  const localOrigin = window.CinePulseNative?.getApiOrigin?.();
  if (localOrigin && url.href.startsWith(`${localOrigin}/api/`)) return url.href;
  const isAppApi = url.pathname.startsWith('/api/') &&
    (url.origin === window.location.origin || url.hostname === 'cine-pulse-drab.vercel.app');
  if (isAppApi) return apiUrl(`${url.pathname}${url.search}`);
  // Legacy worker URLs encode the actual upstream; native transport uses that upstream.
  if (url.hostname === 'wild-credit-e1ae.cagatayca07.workers.dev' && url.searchParams.has('url')) {
    const target = new URL(url.searchParams.get('url'));
    if (!/^https?:$/.test(target.protocol)) throw new TypeError('Invalid upstream URL');
    return target.href;
  }
  if (url.hostname.endsWith('.vercel.app')) throw new TypeError('APK Vercel bağlantısı kapalı');
  return url.href;
}

export function installAndroidTransport() {
  if (installed) return;
  // Geçit (NativeMediaGateway) onCreate'te başlar; yine de JS köprüsü
  // geç yüklenirse diye kısa süre beklenir. Bu sürede kurulamazsa HATA
  // VERİLİR — sessizce eski davranışa düşülmez, yoksa Vercel'e istek
  // gidebilir. installAndroidTransport() çağıranı (androidPlatform)
  // bu hatayı yakalayıp tekrar dener.
  if (!window.CinePulseNative?.getApiOrigin?.()) throw new Error('Yerel Android ağ servisi kullanılamıyor');
  const origin = window.CinePulseNative.getApiOrigin();
  if (!origin) throw new Error('Yerel Android ağ servisi henüz hazır değil');
  const browserFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const url = androidRequestUrl(input);
    const request = new Request(url, input instanceof Request ? input : undefined);
    const method = String(init.method || request.method).toUpperCase();
    const signal = init.signal || request.signal;
    signal?.throwIfAborted();
    const localOrigin = window.CinePulseNative.getApiOrigin();
    if (url.startsWith(`${localOrigin}/api/live_sources`)) {
      const { fetchAllLiveSources, fetchLiveSourceChannels } = await import('../../../api/_liveSources.js');
      const source = new URL(url).searchParams.get('src');
      const sources = source && source !== 'all' ? [{ ...await fetchLiveSourceChannels(source), ok: true }] : await fetchAllLiveSources();
      return Response.json({ sources, savedAt: Date.now() });
    }
    const headers = Object.fromEntries(new Headers(init.headers || request.headers));
    const body = init.body ?? (method === 'GET' || method === 'HEAD' ? undefined : await request.text());
    let target = url;
    if (/^https?:\/\//i.test(url) && !url.startsWith(`${localOrigin}/`)) {
      const query = new URLSearchParams({ url, headers: JSON.stringify(headers), ref: headers.Referer || headers.referer || '' });
      target = `${localOrigin}/api/proxy?${query}`;
    }
    const response = await browserFetch(target, { ...init, method, headers: init.headers || request.headers,
      body, signal, credentials: 'omit' });
    const upstream = response.headers.get('X-Upstream-URL');
    if (upstream) Object.defineProperty(response, 'url', { value: upstream });
    return response;
  };
  installed = true;
}

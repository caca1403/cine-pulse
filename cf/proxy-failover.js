/* ==========================================================================
   CinePulse — WEB PROXY YEDEK ALAN KATMANI (Cloudflare Worker)
   --------------------------------------------------------------------------
   Çekirdekler alan adını alanlar.js'ten alır ve mutlak adrese istek atar; bu
   istek (`/api/proxy?url=...`) worker tarafından sunucudan çekilir. Site aynası
   düştüğünde worker 5xx döndürüyordu ve sağlayıcı o içerikte 0 kaynak veriyordu.
   Vekil (vekil.js) tarayıcıda aynı işi alanlar.js `alanYedekAdresleri` ile
   yapıyor; web gateway'in de aynı mantığı uygulaması için burada da aynı
   fonksiyon kullanılır (tek kaynak: alanlar.js aday havuzu).

   Yalnız GET ve yalnız `/api/proxy` için: POST gövdeleri yeniden oynatılamaz,
   medya akışları (/api/hls_proxy) ise bu katmandan GEÇMEZ.
   ========================================================================== */

import { alanYedekAdresleri, alanYedekOnayla } from '../src/providers/alanlar.js';

const PROXY_YOLU = /^\/api\/proxy\/?$/;

/**
 * Başarısız proxy yanıtını yedek alan adlarıyla yeniden dener.
 * @param {Response} cevap        normal akıştan gelen yanıt
 * @param {Request} request       istemci isteği (GET)
 * @param {URL} url               istek adresi
 * @param {(istek: Request) => Promise<Response>} yenidenDene  normal akışı tekrar çalıştırır
 * @returns {Promise<Response>}   yedek çalışırsa onun yanıtı, yoksa ilk yanıt
 */
export async function proxyYedekDene(cevap, request, url, yenidenDene) {
  try {
    if (!PROXY_YOLU.test(url.pathname)) return cevap;
    if (!request || request.method !== 'GET') return cevap;
    if (cevap && cevap.status < 500) return cevap;

    const hamHedef = url.searchParams.get('url') || '';
    if (!hamHedef) return cevap;
    // api/[...all].js hedefi decodeURIComponent ile açıyor; çift kodlama
    // yapmamak için burada da aynı biçimi kullanıyoruz.
    let hedef;
    try { hedef = decodeURIComponent(hamHedef); } catch (_) { hedef = hamHedef; }

    const yedekler = alanYedekAdresleri(hedef).slice(0, 3);
    for (const yedek of yedekler) {
      try {
        const yeniUrl = new URL(url.href);
        yeniUrl.searchParams.set('url', yedek.url);
        const yeniIstek = new Request(yeniUrl.toString(), request);
        const yedekCevap = await yenidenDene(yeniIstek);
        if (yedekCevap && yedekCevap.status < 500) {
          alanYedekOnayla(yedek.kod, yedek.url);
          return yedekCevap;
        }
      } catch (_) { /* sıradaki aday */ }
    }
  } catch (_) { /* teşhis katmanı ana akışı bozmaz */ }
  return cevap;
}

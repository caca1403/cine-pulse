/* ==========================================================================
   İSTEMCİ KİMLİĞİ — başlık tutarlılığı (Cloudflare parmak izi)

   İKİ DERS (ikisi de ölçüldü):
   1) Cloudflare `cf_clearance` çerezini UA'ya bağlar; HTTP katmanı ile gizli
      WebView AYNI UA'yı kullanmazsa challenge her istekte yeniden sorulur.
   2) SAFSATA BAŞLIK DAHA KÖTÜDÜR: bu modüle `Sec-Fetch-*` eklendiğinde ve
      WebView'in "…; wv)" UA'sı gönderildiğinde Türkçe sitelerin çoğu isteği
      bot sayıp boş döndü — daha önce gözüken kaynaklar kayboldu. Gerçek bir
      tarayıcı taklidi yapmak yerine, çalışan düz profili sabit tutuyoruz.

   KekikStream bu işi `curl_cffi(impersonate=...)` ile (TLS parmak izi)
   çözüyor; Android'de TLS parmak izini değiştiremiyoruz, o yüzden başlık
   küçümsenmeyecek kadar sade tutulur: UA + Accept + Accept-Language.
   ========================================================================== */

const PROFIL_UA = 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';

/** HTTP katmanının UA'sı. Gizli WebView de aynı profili kullanacak şekilde
 *  sabitlenir (challenge'ı çözen ile kullanan aynı kimlik olsun). */
export function tarayiciUA() {
  return PROFIL_UA;
}

/** UA ile tutarlı, SADİCE gerekli başlıklar. */
export function tarayiciBasliklari(ek = {}) {
  return {
    'User-Agent': PROFIL_UA,
    Accept: '*/*',
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    ...ek,
  };
}

/* ==========================================================================
   Şifreli oynatıcı çözücü

   TÜRKÇE OYNATICILARIN ÇOK YAYGIN KALIBI
   ---------------------------------------
   Sayfa gerçek oynatıcıyı düz metin olarak göSTERMEZ; şifreli gömer:

     <script>
       function b64rev(s){ return atob(s.split('').reverse().join('')) }
       var KEY  = b64rev("CR3bmhTQWJGSylGeTRmdxU1Mq10SCBFS");
       var DATA = b64rev("98mcYBDcK90NyZ0UaFXMtFEVv…");
       // ['A','dct','enc','Utf8','toString','replace'] → 'Adct' = AES
       CryptoJS.AES.decrypt(DATA, KEY).toString("enc".Utf8)
             .replace("?aztsdxdevfqwea", "")
       document.write( … )
     </script>

   Bu yüzden sayfanın HTML'inde ne m3u8 ne iframe ne video etiketi bulunur ve
   hiçbir jenerik kalıp onu yakalayamaz — çözülmemiş bir gömülü oynatıcı
   ekranda POSTER olarak kalır. (dizi77 / "Corvus" bu kalıbı kullanır.)

   Burada CryptoJS ile BİREBİR aynı şifre çözülür. Kendi AES uygulamamız
   yerine kütüphaneyi kullanıyoruz çünkü CryptoJS'in EvpKDF türetmesi
   (MD5 tabanlı, tuzlu) elle yazılınca sessizce yanlış sonuç veriyor.
   ========================================================================== */

// Use the same vendored algorithms through an ESM entry in Node and Vite.
import CryptoJS from '../vendor/crypto-js.js';

/**
 * Ters çevrilmiş base64 → bayt dizisi (sayfadaki b64rev ile aynı).
 *
 * DİKKAT: Burada varsayılan `.toString()` KULLANILMAZ — o UTF-8'e çevirir ve
 * 127 üstü baytları bozar, şifreli yük çözülemez. Tarayıcıdaki `atob()`
 * latin1 (bayt=bayt) döndürdüğü için `CryptoJS.enc.Latin1` kullanılır.
 */
function tersCoz(metin) {
  const ters = String(metin).split('').reverse().join('');
  try {
    return CryptoJS.enc.Base64.parse(ters).toString(CryptoJS.enc.Latin1);
  } catch (_) {
    return '';
  }
}


/**
 * Sayfadaki şifreli oynatıcı HTML'ini çözer.
 * @param {string} html  ham sayfa kaynağı
 * @returns {string} gerçek oynatıcı HTML'i, ya da bulunamadıysa boş dize
 */
export function sifreliOynaticiCoz(html) {
  if (!html || typeof html !== 'string') return '';
  if (!/document\s*\.\s*write|CryptoJS/.test(html)) return '';

  // Çözücü fonksiyonun adı siteye göre değişir (_00560339, _x, atob…),
  // bu yüzden ada değil biçime bakıyoruz: çağrı içinde uzun bir base64 yükü.
  const gomuler = [...html.matchAll(/[A-Za-z_$][\w$]*\s*\(\s*['"]([A-Za-z0-9+/=]{16,})['"]\s*\)/g)]
    .map((m) => m[1]);
  if (gomuler.length < 2) return '';

  // Şifreli veri uzundur, parola kısadır.
  const sirali = gomuler
    .map((g) => ({ g, duz: tersCoz(g) }))
    .filter((x) => x.duz)
    .sort((a, b) => b.g.length - a.g.length);
  if (sirali.length < 2) return '';

  const veri = sirali[0];
  const parola = sirali[sirali.length - 1].duz;

  // Şifreli yük bazen birden çok kez sarmalanır (ör. parolanın kendisi de
  // şifreli). İki kez çözmeyi de dene.
  for (let deneme = 0; deneme < 2; deneme++) {
    let duz = '';
    try {
      duz = CryptoJS.AES.decrypt(veri.duz, parola).toString();
    } catch (_) {
      duz = '';
    }
    if (!duz) {
      // Parola da şifreliyse: sıradaki adayı parola olarak dene.
      veri.duz = duz || veri.duz;
      continue;
    }

    // Çoğu yerde çıktı bir hex katmanı daha sarar.
    // crypto-js 4.x'te varsayılan toString() HEX döner; açıkça UTF-8 istenir.
    const duzHex = CryptoJS.enc.Hex.parse(duz).toString(CryptoJS.enc.Utf8);
    if (duzHex && /<[a-z!]/i.test(duzHex)) duz = duzHex;

    if (!/<[a-z!]/i.test(duz)) continue;

    // Yer tutucu dizesi boşaltılır: ?aztsdxdevfqwea → ""
    const dizeler = html.match(/\[\s*("[^"]{2,}"\s*,?\s*)+\]/g) || [];
    for (const dizi of dizeler) {
      const parcalar = dizi.match(/"([^"]*)"/g).map((x) => x.slice(1, -1)).join('');
      if (parcalar && duz.includes(parcalar)) duz = duz.split(parcalar).join('');
    }
    return duz;
  }
  return '';
}

/**
 * Şifreli oynatıcı sayfasını izleyerek gerçek oynatıcı HTML'ini getirir.
 * Sayfa doğrudan okunabiliyorsa aynen döner (şifre yoksa erken çıkış).
 * @returns {Promise<string>} oynatıcı HTML'i ya da boş dize
 */
export async function sifreliOynaticiCozUrl(getir, url) {
  const ham = await getir(url);
  if (!ham) return '';
  if (!/document\s*\.\s*write/.test(ham)) return ham;
  const duz = sifreliOynaticiCoz(ham);
  return duz || '';
}
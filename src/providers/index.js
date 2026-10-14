/* ==========================================================================
   CinePulse sağlayıcı kaydı ("bizim dilimiz")

   MİMARİ (Nuvio / CloudStream / KekikStream düzeni):
     Her sağlayıcı üç adımdan oluşur ve İZOLE bir dosyada yaşar:
       search()  → içerik adayları
       load()    → oynatılabilir kaynaklar (doğrudan m3u8/mp4)
       play()    → oynatıcı girdisi (proxy + başlık)

   OYNATICI KURALI: oynatıcının tek işi içeriği ONAYLAMAK (doğrulama +
   şifre çözme + doğrudan yayın). iframe ile açılan bir kaynak HİÇ
   listelenmez — "açılmıyor" demekle aynıdır.

   Yeni sağlayıcı eklemek: bir dosya yaz, `KAYIT`'a bir satır ekle.
   Kimse başka bir dosyaya dokunmaz. (Eski üst üste yığılma böyle bitti.)
   ========================================================================== */

/**
 * id → () => import('./dosya.js')
 * Dosya şu arayüzü verir:
 *   export const kimlik = { id, alias, mediaTypes }
 *   export async function coz(args) → { sources, trace }
 *   export default { apiVersion, id, name, mediaTypes, resolve(args) }
 */
export const KAYIT = {
  hdfc: () => import('./orion.js'),
  anizium: () => import('./aria.js'),
  animecix: () => import('./tera.js'),
  dzs: () => import('./atlas.js'),
  dizi77: () => import('./corvus.js'),
  /* Patron eklentilerinden taşınan siteler — arayüzde yalnız yıldız kod
     adlarıyla görünürler (site adları hiçbir arayüz metninde geçmez). */
  jet: () => import('./nimbus.js'),        // Nimbus
  sinemacc: () => import('./halcyon.js'),  // Halcyon
  hdfd: () => import('./bellatrix.js'),    // Bellatrix
  d4kh: () => import('./betelgeuse.js'),   // Betelgeuse
  asy: () => import('./aquila.js'),        // Aquila (anime)
  slc: () => import('./lyra.js'),          // Lyra
  dyu: () => import('./echo.js'),          // Echo — Diziyou (doğru slot; dzy ayrı bir siteydi)
  dzp: () => import('./muhlif.js'),        // Muhlif
  czgx: () => import('./lumen.js'),        // Lumen (çizgi film)
  fhdf: () => import('./sirius.js'),       // Sirius (CF — cihazda gizli tarayıcıyla çözülür)
  fm: () => import('./arcturus.js'),       // Arcturus (CF — cihazda gizli tarayıcıyla çözülür)
  dzb: () => import('./nero.js'),          // Nero (doğrudan HLS + VTT altyazı, ~1,5 sn)
  fxs: () => import('./vela.js'),          // Vela (eski fxs köprüsü — hatlar cihazda doğrudan çözülür)
  blgx: () => import('./perseus.js'),      // Perseus (belgesel; doğrudan mp4, gömülü slotlar elenir)
  arhv: () => import('./arsiv.js'),        // Deneb (arşiv; doğrudan mp4, kimlik kapılı — çizgi/belgesel/klasik)
  szd: () => import('./sezon.js'),         // Vega (dizi/animasyon/belgesel havuzu; oynatıcı gizli WebView'da çözülür)
  // k666 (666Film) bilinçli olarak YOK: adres zinciri ölü/BTK engelli → ölü kaynak listeler.
  // dizibox bilinçli olarak YOK: CF 403 + oynatıcıları yalnız gömülü (iframe) → kural gereği listelenemez.
};

/** Kayıtlı sağlayıcı kimlikleri. */
export function kayitliKimlikler() {
  return Object.keys(KAYIT);
}

/** Sağlayıcı modülünü yükle (yoksa null). */
export async function saglayiciYukle(id) {
  const yukle = KAYIT[id];
  if (!yukle) return null;
  try { return await yukle(); } catch (_) { return null; }
}

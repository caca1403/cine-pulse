/* ==========================================================================
   CinePulse — yanıt gövdesi anonimleştirici (API hijyeni)

   Kural: kullanıcıya görünen hiçbir metinde gerçek site adı yoktur.
   Bu modül YALNIZ JSON gövdelerin name/source/badge/label/provider/site
   ALAN DEĞERLERİNİ kod adıyla değiştirir; alan adlarını, sırasını, durum
   kodunu veya başka hiçbir alanı değiştirmez (istemci parse'ı bozulmaz).
   HTML/ikili içerğe dokunulmaz (istemci o gövdeleri yapı olarak kullanıyor).
   ========================================================================== */

const ANAHTARLAR = ['name', 'source', 'badge', 'label', 'provider', 'siteName', 'site'];

// alan değerinde geçen gerçek site izleri → kod adı (src/providers KAYIT +
// pluginCatalog ALIASES ile birebir aynı adlar)
const IZLER = [
  { re: /dizisol/i, ad: 'Atlas' },
  { re: /sezonluk\s*dizi/i, ad: 'Luna' },
  { re: /jet\s*film|jetfilmizle|filmizle\.now/i, ad: 'Nimbus' },
  { re: /dizibal/i, ad: 'Nero' },
  { re: /kral[\s-]*tv|kral-tv/i, ad: 'Pulsar' },
  { re: /turhan|fixbet/i, ad: 'Pulsar' },
  { re: /izlego/i, ad: 'Pulsar' }
];

function temizle(metin) {
  const s = String(metin || '');
  let out = s;
  for (const { re, ad } of IZLER) {
    if (re.test(out)) out = out.replace(re, ad);
  }
  return out;
}

/** JSON gövdedeki kullanıcıya görünen alan değerlerini kod adına çevirir.
 *  Parse edilemeyen içerik olduğu gibi döner (akışı asla kırmaz). */
export function anonimJson(govde) {
  let veri;
  try { veri = JSON.parse(govde); } catch (_) { return govde; }
  let degisti = false;
  const dolas = (dugum) => {
    if (Array.isArray(dugum)) { for (const x of dugum) dolas(x); return; }
    if (!dugum || typeof dugum !== 'object') return;
    for (const [k, v] of Object.entries(dugum)) {
      if (typeof v === 'string' && ANAHTARLAR.includes(k)) {
        const yenisi = temizle(v);
        if (yenisi !== v) { dugum[k] = yenisi; degisti = true; }
      } else if (v && typeof v === 'object') {
        dolas(v);
      }
    }
  };
  dolas(veri);
  return degisti ? JSON.stringify(veri) : govde;
}

/** Bu üst adres için anonimleştirme gerekiyor mu? (yalnız JSON yanıtlar) */
export function anonimGerekliMu(url) {
  return /dizisol|sezonlukdizi|jetfilmizle|filmizle\.now|dizibal/i.test(String(url || ''));
}

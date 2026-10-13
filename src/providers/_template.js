/* ==========================================================================
   YENİ KAYNAK ŞABLONU — kopyala, doldur, kaydet. Hepsi bu.

   1) Bu dosyayı kopyala:  src/providers/ornekSite.js
   2) Aşağıdaki 3 boşluğu doldur: KİMLİK, ara(), yayın()
   3) src/providers/index.js → KAYIT'a tek satır ekle:
        ornek: () => import('./ornekSite.js'),
      ve src/services/pluginCatalog.js → PLUGIN_DEFS'e:
        { id: 'ornek', kinds: ['film', 'dizi'], desc: '...' }
      (inventory.js kendi listesini KAYIT'tan türetir; başka dosya değişmez.)

   SÖZLEŞME (kit.js): coz(args) → { sources, trace }
     sources[] = kaynak({ id, ad, url, kategori, headers, altyazilar, kalite })
     url DOĞRUDAN yayın olmalı (m3u8/mp4/mkv). IFRAME ASLA döndürülmez:
     gömülü kaynak "açılmıyor" demekle aynıdır → o aday atlanır.
   Ağ: istek()/gonder() cihazın kendi IP'sini kullanır (kit.js → akilliGet);
   sidecar'a (/api/resolve) bağımlılık YOKTUR. Yanında .json flow akışı da
   yazılabilir (providerRuntime/flow.js) — şablonun altındaki NOT'a bak.
   ========================================================================== */

import {
  izleyici, istek, kaynak, anchorlar, mutlak, koken, medyaMi, m3u8eCevir,
  temizBaslik, slugla, baslikEslesir, alanAdiCoz,
} from './kit.js';

/* ── 1. KİMLİK ────────────────────────────────────────────────────────── */
export const kimlik = { id: 'ornek', alias: 'Nomad', mediaTypes: ['movie', 'tv'] };

const BILINEN_ADRESLER = ['https://ornek-site.com'];

/* ── 2. ADIM 1: ara() — başlıktan içerik sayfasının adresini bul ───────── */
async function ara(basliklar, { trace } = {}) {
  const taban = await alanAdiCoz('ornek', BILINEN_ADRESLER, { trace }); // siteurl.txt anahtarı
  if (!taban) return '';
  for (const baslik of basliklar) {
    // Sitenin arama desenini buraya yaz: /search?q= · /?s= · /ara/{slug}
    const html = await istek(`${taban}/ara/${encodeURIComponent(slugla(baslik))}`, { ref: `${taban}/`, trace });
    if (!html) continue;
    // Sonuç linklerini süz: site desenine göre regex'i daralt.
    const aday = anchorlar(html, taban).find((a) => baslikEslesir(baslik, [a.metin]) && /\/(film|dizi)\//.test(a.url));
    if (aday) { trace?.koy('arama', { sayfa: aday.url }); return aday.url; }
  }
  return '';
}

/* ── 3. ADIM 2-3: yayın() — sayfadaki DOĞRUDAN akışı çıkar ────────────── */
async function yayın(sayfaUrl, { trace } = {}) {
  const html = await istek(sayfaUrl, { ref: koken(sayfaUrl) + '/', trace });
  const out = [];
  if (!html) return out;
  for (const m of html.matchAll(/["'](https?:[^"']+\.(?:m3u8|mp4|mkv)[^"']*)["']/gi)) {
    const u = m3u8eCevir(mutlak(m[1], sayfaUrl));
    // KURAL: doğrudan medya değilse (iframe/sayfa adresi) ADAY ÇÖPTÜR.
    if (!medyaMi(u)) continue;
    out.push(kaynak({
      id: `ornek_${out.length}`,
      ad: 'Örnek Site',
      url: u,
      kategori: /dublaj|dub/i.test(u) ? 'dubbed' : 'subtitled',
      headers: { Referer: `${koken(sayfaUrl)}/` },
      kalite: '1080p',
    }));
  }
  trace?.koy('yayin', { n: out.length });
  return out;
}

/* ── 4. GİRİŞ NOKTASI: coz() — aggregator bunu çağırır ────────────────── */
export async function coz({ type = 'movie', title = '', originalTitle = '', titles = [], season = 1, episode = 1 } = {}) {
  const trace = izleyici();
  const adaylar = [...new Set([temizBaslik(title), temizBaslik(originalTitle), ...(titles || []).map(temizBaslik)].filter(Boolean))];
  const sayfa = await ara(adaylar, { trace });
  const sources = sayfa ? await yayın(`${sayfa}/${type === 'movie' ? '' : `${(+season || 1)-0}-${(+episode || 1)}`}`.replace(/\/$/, ''), { trace }) : [];
  trace.koy('sonuc', { n: sources.length });
  return { sources, trace: trace.ozet() };
}

export default { apiVersion: 1, id: kimlik.id, name: kimlik.alias, mediaTypes: kimlik.mediaTypes, async resolve(a) { return (await coz(a)).sources; } };

/* NOT — şablon yeterince basit değilse (çok adımlı AES/imza zinciri):
   site akışını JSON olarak yazıp providerRuntime/flow.js motoruna verebilirsin
   (request → links → select → extract → emit). Örnek sözleşme: flow.js'nin başı.
   Akış yetmezse (Cloudflare challenge, gizli tarayıcı gerekiyorsa) orion.js /
   lyra.js en güncel örneklerdir: istek(..., { webView: true }) ile çözülür. */

/* ==========================================================================
   ECHO — Diziyou  (sıfırdan, kit sözleşmesi; Patron akışının kendi dilimizde
   yeniden yazılmışı)

   Adımlar:
     1. Alan adı: siteurl.txt (diziyou) → bilinen adres        [kit.alanAdiCoz]
     2. Başlık: TMDB meta (tr/orijinal) — arama anahtarları
     3. Arama:  /wp-admin/admin-ajax.php  POST action=data_fetch → HTML liste
     4. Dizi:   "{slug}-{sezon}-sezon-{bolum}-bolum" bağlantısı
     5. Yayın:  iframe#diziyouPlayer → /player/{id}.html →
                storage.{alan}/episodes/{id}[_tr]/play.m3u8
     6. Referer = site kökü, UA = okhttp/4.9.2. iframe YAYIN DEĞİLDİR;
        yalnızca depodaki doğrudan m3u8 listelenir.
   ========================================================================== */

import {
  istek, gonder, izleyici, anchorlar, mutlak, m3u8eCevir, medyaMi,
  kaynak, temizBaslik, baslikEslesir, alanAdiCoz, tmdbMeta, adPuan, yilUyar,
} from './kit.js';

const BILINEN = ['https://www.diziyou.one'];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const PLAYER_UA = 'okhttp/4.9.2';

/* Slot düzeltmesi: bu sürücü Diziyou'yu çözüyor ve envanterdeki gerçek
   slotu `dyu`'dur. `dzy` AYRI bir sitenin (diziyo.so) slotuydu — yanlış
   oturulan o yer boşaltıldı. Site film barındırmıyor → yalnız `tv`. */
export const kimlik = { id: 'dyu', alias: 'Echo', mediaTypes: ['tv'] };

/** admin-ajax HTML'inden içerik adayları: href + görünen metin. */
function aramaAdaylari(ham, taban) {
  return anchorlar(ham, taban)
    .filter((a) => a.metin && !/\.(webp|jpe?g|png)$/i.test(a.url) && !/\/wp-content\//.test(a.url));
}

/** Arama listesinden doğru içeriği seç: birebir eşleşme önce, sonra kapsama. */
function icerikSec(adaylar, arananlar, isFilm, yil = null) {
  const tam = adaylar.filter((a) => arananlar.some((t) => t && baslikEslesir(t, [a.metin]) &&
    a.metin.toLowerCase().trim() === t.toLowerCase().trim()));
  // Sağlam kısmî: tam veya "hedef …" öneşek (adPuan≥4). İçeren taraf (puan 2)
  // ASLA kabul edilmez — kısa ad kapsaması yanlış yapım getiriyordu.
  const kism = adaylar.filter((a) => arananlar.some((t) => t && adPuan(a.metin, [t]) >= 4));
  const havuz = (tam.length ? tam : kism).filter((a) => yilUyar(yil, a.metin));
  if (!havuz.length) return '';
  if (isFilm) {
    const f = havuz.find((a) => /-film\b|\/film\//i.test(a.url));
    if (f) return f.url;
  }
  return havuz[0].url;
}

/** Dizi sayfasından istenen sezon/bölüm bağlantısını bul. */
function bolumLinku(ham, taban, sezon, bolum) {
  const a = anchorlar(ham, taban);
  const kaliplar = [
    new RegExp(`(?<![0-9])-${sezon}-sezon-${bolum}-bolum`),
    new RegExp(`/sezon-${sezon}/bolum-${bolum}(/|$)`),
    new RegExp(`(?<![0-9])-${sezon}x${bolum}(-|$|/)`),
  ];
  for (const p of kaliplar) {
    const m = a.find((x) => p.test(x.url));
    if (m) return m.url;
  }
  for (const x of a) {
    const s = x.metin.match(/(\d+)\.\s*sezon/i);
    const e = x.metin.match(/(\d+)\.\s*b[oö]l[uü]m/i);
    if (s && e && +s[1] === sezon && +e[1] === bolum) return x.url;
  }
  return '';
}

/** Yayın sayfasından depodaki doğrudan m3u8'leri üret (iframe asla dönmez). */
function depoyuCoz(sayfaHtml, base, trace, etiket) {
  const fm = String(sayfaHtml).match(/<iframe[^>]+id=["']diziyouPlayer["'][^>]*?src=["']([^"']+)["']/i)
    || String(sayfaHtml).match(/<iframe[^>]+src=["']([^"']+)["'][^>]+id=["']diziyouPlayer["']/i);
  if (!fm) { trace.koy('oynatici', { bulundu: false }); return []; }
  const src = mutlak(fm[1], base);
  const parca = src.split('/').pop().split('?')[0];
  const kimlikNo = parca.replace(/\.html?$/i, '');
  if (!kimlikNo) return [];
  let depo;
  try {
    const u = new URL(base);
    depo = `${u.protocol}//storage.${u.hostname.replace(/^www\./, '')}`;
  } catch (_) { depo = base.replace('www.', 'storage.'); }

  const dub = /id=["']turkceDublaj["']/i.test(sayfaHtml);
  const altyazi = /id=["']turkceAltyazili["']/i.test(sayfaHtml);
  const liste = [];
  const ekle = (ad, yol, kategori) => {
    const u = m3u8eCevir(`${depo}/episodes/${yol}/play.m3u8`);
    if (!medyaMi(u)) return;
    liste.push(kaynak({
      id: `dyu_${kategori}_${kimlikNo}`,
      ad: `Echo ${ad}`,
      url: u,
      kategori,
      headers: { Referer: `${base}/`, 'User-Agent': PLAYER_UA, Accept: '*/*' },
      kalite: '1080p',
    }));
  };
  if (altyazi || (!altyazi && !dub)) ekle('Altyazı', kimlikNo, 'subtitled');
  if (dub) ekle('Dublaj', `${kimlikNo}_tr`, 'dubbed');
  trace.koy('oynatici', { bulundu: true, id: kimlikNo, n: liste.length, kaynak: etiket || '' });
  return liste;
}

/** Nuvio `load()` eşdeğeri. */
export async function coz({ type = 'tv', title = '', originalTitle = '', titles = [], year = null, season = 1, episode = 1, tmdbId = null, signal = null } = {}) {
  const trace = izleyici();
  const isFilm = type === 'movie';
  const s = +season || 1, e = +episode || 1;

  const base = await alanAdiCoz('diziyou', BILINEN, { trace, ua: UA });
  if (!base) return { sources: [], trace: trace.ozet() };

  // — 1. arama anahtarları: verilen başlıklar, gerekirse TMDB'nin TR adı
  const verilen = [...new Set([title, originalTitle, ...titles].map(temizBaslik).filter(Boolean))];
  let anahtarlar = [...verilen];
  const kısa = [...new Set(verilen.map((t) => t.split(/\s+/).slice(0, 2).join(' ')).filter((t) => t.length > 3))];
  anahtarlar = [...new Set([...anahtarlar, ...kısa])];

  // — 2. arama (POST admin-ajax) — ilk eşleşmede dur.
  //    TMDB meta (4-8 sn'lik soğuk vergi) YALNIZ verilen başlıklarla arama
  //    boş dönerse çağrılır; sıcak akışta hiç devreye girmez.
  let icerikUrl = '';
  const ara = async (sorgular) => {
    for (const q of sorgular) {
      if (icerikUrl) return;
      const ham = await gonder(`${base}/wp-admin/admin-ajax.php`, `action=data_fetch&keyword=${encodeURIComponent(q)}`,
        { ref: `${base}/`, headers: { 'User-Agent': UA }, timeout: 8000, trace, signal });
      const adaylar = aramaAdaylari(ham, base);
      trace.koy('arama', { q: q.slice(0, 30), sonuc: adaylar.length });
      icerikUrl = icerikSec(adaylar, [q, ...anahtarlar], isFilm, year);
    }
  };
  await ara([...anahtarlar]);
  if (!icerikUrl && tmdbId) {
    const meta = await tmdbMeta(tmdbId, isFilm ? 'movie' : 'tv', { trace });
    const ek = [meta?.tr, meta?.orj].filter((t) => t && !anahtarlar.includes(t));
    if (ek.length) await ara(ek);
  }
  if (!icerikUrl) { trace.koy('sonuc', { n: 0, neden: 'arama' }); return { sources: [], trace: trace.ozet() }; }
  icerikUrl = mutlak(icerikUrl, base);

  // — 3. dizi: bölüm sayfasına in
  let hedef = icerikUrl;
  if (!isFilm) {
    const diziHtml = await istek(hedef, { ref: `${base}/`, headers: { 'User-Agent': UA }, timeout: 9000, trace, signal });
    const bl = diziHtml ? bolumLinku(diziHtml, hedef, s, e) : '';
    if (bl) hedef = mutlak(bl, hedef);
    else {
      // tahmin: kalıp denemesi (bölüm listesi kapalıysa)
      const tahmin = `${hedef.replace(/\/$/, '')}-${s}-sezon-${e}-bolum/`;
      const t = await istek(tahmin, { ref: `${base}/`, headers: { 'User-Agent': UA }, timeout: 6000, trace, webView: false, signal });
      // Tahmin URL yalnız oynatıcı iziyle kabul edilmez (denetim matrisi #3):
      // sayfa başlığı hedef yapımlardan birini doğrulamalı.
      const tb = t ? ((t.match(/<title>([^<]*)</i) || [])[1] || '') : '';
      if (t && /diziyouPlayer/i.test(t) && verilen.some((ad2) => baslikEslesir(ad2, [tb]))) hedef = tahmin;
      else { trace.koy('sonuc', { n: 0, neden: `bolum-bulunamadi S${s}E${e}` }); return { sources: [], trace: trace.ozet() }; }
    }
    trace.koy('bolum', { hedef });
  }

  // — 4. yayın sayfası → depo m3u8'leri
  const epHtml = await istek(hedef, { ref: `${base}/`, headers: { 'User-Agent': UA }, timeout: 9000, trace, signal });
  const sources = epHtml ? depoyuCoz(epHtml, base, trace, hedef) : [];
  trace.koy('sonuc', { n: sources.length });
  return { sources, trace: trace.ozet() };
}

export default { apiVersion: 1, id: kimlik.id, name: kimlik.alias, mediaTypes: kimlik.mediaTypes, async resolve(a) { return (await coz(a)).sources; } };

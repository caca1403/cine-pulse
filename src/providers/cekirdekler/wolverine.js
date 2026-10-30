/* ==========================================================================
   CinePulse — "Wolverine" çekirdeği (birinci taraf, dizi)
   --------------------------------------------------------------------------
   bir WordPress sitindeki dizi bölümlerini bulur ve oynatıcının DÜZ
   `storage.<site>/episodes/<kayit>/play.m3u8` adreslerini üretir. iframe adresi
   DÖNDÜRMEZ — iframe'den yalnız yayın kimliği numarasi çıkarılır.

   Nereden geldi: upstream "patronDiziyou" eklentisinin akışı; bağımlılıksız
   olduğu için (cheerio/crypto-js kullanmıyordu) birebir çevrildi, sonra:
     • kendi gömülü TMDB anahtarı yerine uygulamanın ANAHTAR HAVUZU kullanılıyor
       (aynı sabit anahtarı kullanmak kotasını tüketiyordu),
     • alan adı sitemizin haritasından (ALANLAR) alınıyor; canlı liste yalnız
       harita işe yaramazsa yedek olarak denenıyor,
     • her yayına dil işareti konuyor (Altyazı / Dublaj) — işaret olmazsa
       derleyici yayını yanlış sekmeye atıyor.

   Site tarafında iki dil şablonu var: `turkceDublaj` ve `turkceAltyazili`
   başlıkları. Hangisi görünüyorsa o yayın üretilir; ikisi de yoksa tek yayın
   altyazılı varsayılır (yanlış sekmesi ihtimali yerine çalışması tercih edildi).
   ========================================================================== */

import { ALANLAR } from '../alanlar.js';
import { aktifAnahtar, siradakiAnahtar } from '../../services/icerik/tmdbApi.js';

const KOD = 'Wolverine';
const SÜRÜM = '1.0.0';
const ETİKET = `[${KOD} v${SÜRÜM}]`;

/** Site adresi değişebiliyor: harita → (yedek) canlı liste. */
const CANLI_LISTE = 'https://raw.githubusercontent.com/patr0nq/veriler/refs/heads/main/siteurl.txt';
const SABLON_ADRES = 'https://www.diziyou.one';

const SAYFA_BAŞLIK = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
};

function zamanAşımı(ms) {
  try {
    return typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
      ? AbortSignal.timeout(ms)
      : undefined;
  } catch (_) {
    return undefined;
  }
}

function birleştir(adres, taban) {
  if (!adres) return '';
  if (/^https?:/i.test(adres)) return adres;
  if (adres.startsWith('//')) return `https:${adres}`;
  return `${String(taban).replace(/\/$/, '')}/${String(adres).replace(/^\//, '')}`;
}

async function metinAl(adres, seçenekler = {}) {
  try {
    const yanıt = await fetch(adres, {
      ...seçenekler,
      headers: { ...SAYFA_BAŞLIK, ...(seçenekler.headers || {}) },
      signal: zamanAşımı(seçenekler.timeoutMs || 9000),
    });
    if (!yanıt.ok) return '';            // 404 = içerik yok; diğerleri de burada boş döner
    return await yanıt.text();
  } catch (hata) {
    console.log(`${ETİKET} istek başarısız (${new URL(adres).pathname}): ${String(hata?.message || hata).slice(0, 50)}`);
    return '';
  }
}

/** TMDB'den başlığın Türkçe/ORİJİNAL biçimini ve yılını alır.
 *  Anahtar havuzu kullanılır; 429'da sıradaki anahtarla bir kez denenır. */
async function başlıklarıAl(tmdbId) {
  for (let deneme = 0; deneme < 2; deneme++) {
    const anahtar = deneme ? siradakiAnahtar() : aktifAnahtar();
    try {
      const yanıt = await fetch(
        `https://api.themoviedb.org/3/tv/${encodeURIComponent(tmdbId)}?api_key=${anahtar}&language=tr-TR`,
        { signal: zamanAşımı(7000) }
      );
      if (yanıt.status === 429 || yanıt.status === 401) continue;
      if (!yanıt.ok) return null;
      const veri = await yanıt.json();
      const tr = String(veri?.name || veri?.original_name || '').trim();
      const orijinal = String(veri?.original_name || tr).trim();
      if (!tr && !orijinal) return null;
      return {
        tr,
        orijinal,
        kısa: tr.split(' ').slice(0, 2).join(' '),
        yıl: parseInt(String(veri?.first_air_date || '').slice(0, 4), 10) || null,
      };
    } catch (_) { /* sıradaki anahtar / sessiz düşüş */ }
  }
  return null;
}

/** Alan adı harita degeriyle gelmiyorsa, yukarı akışın canlı listesinden oku. */
async function tabanAdresiBul() {
  const harita = String(ALANLAR?.[KOD] || '').trim();
  if (harita && /^https?:\/\//i.test(harita)) return harita.replace(/\/$/, '');
  try {
    const liste = await fetch(CANLI_LISTE, { signal: zamanAşımı(6000) });
    if (liste.ok) {
      const satır = (await liste.text()).split('\n')
        .map(s => s.trim())
        .find(s => /^diziyou:/i.test(s));
      const adres = satır ? satır.split(':').slice(1).join(':').trim().replace(/\/$/, '') : '';
      if (/^https?:\/\//i.test(adres)) return adres;
    }
  } catch (_) { /* listeye ulaşılamaz */ }
  return SABLON_ADRES;
}

const arındır = metin => String(metin || '')
  .toLowerCase()
  .replace(/&amp;/g, '&').replace(/&#0?39;/g, "'").replace(/&quot;/g, '"')
  .replace(/[^a-z0-9ğüşöçı]/g, '');

/** Adresin son parçasından dizi gövdesini (slug) ayıklar:
 *  "breaking-bad-5-sezon-16-bolum" -> "breaking-bad" */
function gövdeyiAyır(adres) {
  const son = String(adres).split('/').filter(Boolean).pop() || '';
  return son.replace(/-?\d{1,2}-sezon-\d{1,3}-bolum\/?$/i, '').replace(/-+$/, '');
}

/** Sitenin arama sayfası BÖLÜM bağlantılarını doğrudan listeliyor:
 *  https://<site>/<gövde>-<sezon>-sezon-<bölüm>-bolum/
 *  (Ölçüldü: eski `admin-ajax.php?action=data_fetch` ucu 59 bayt boş dönüyor,
 *   `/?s=<sorgu>` ise sonuçları HTML içinde veriyor.) */
function aramaSonuçları(html, taban) {
  const desen = /href=["']([^"']*[-/]\d{1,2}-sezon-\d{1,3}-bolum[^"']*)["']/gi;
  const görülen = new Set();
  const çıkan = [];
  let eş;
  while ((eş = desen.exec(html)) !== null) {
    const adres = birleştir(eş[1], taban);
    const son = adres.split('/').filter(Boolean).pop() || '';
    const sayılar = son.match(/(\d{1,2})-sezon-(\d{1,3})-bolum/i);
    if (!sayılar) continue;
    const imza = `${sayılar[1]}x${sayılar[2]}`;
    if (görülen.has(imza)) continue;
    görülen.add(imza);
    çıkan.push({
      adres,
      sezon: Number(sayılar[1]),
      bölüm: Number(sayılar[2]),
      gövde: gövdeyiAyır(adres),
    });
    if (çıkan.length >= 500) break;
  }
  return çıkan;
}

/** Slug aranan başlıkla ne kadar uyuşuyor? tam = 2, kök/ek = 1, yok = 0.
 *  (Arama "Stranger Things" için türevi "stranger-things-tales-from-85" de
 *  döndürüyor; tam uyuşma onu elemeli.) */
function gövdeUyar(gövde, aranan) {
  const g = arındır(gövde), a = arındır(aranan);
  if (!g || !a) return 0;
  if (g === a) return 2;
  if (g.startsWith(a) || g.includes(a) || a.startsWith(g)) return 1;
  return 0;
}

/** Bölüm adresini HEAD ile doğrular; olmazsa dizi sayfasındaki listeden arar. */
async function bölümAdresiBul(aday, taban, sezon, bölüm) {
  try {
    const yanıt = await fetch(aday, {
      method: 'HEAD',
      headers: { ...SAYFA_BAŞLIK, Referer: `${taban}/` },
      signal: zamanAşımı(7000),
    });
    if (yanıt.ok) return aday;
  } catch (_) { /* dizi sayfasına düş */ }

  const gövde = gövdeyiAyır(aday);
  const şablonlar = [
    `${taban}/${gövde}/`,
    `${taban}/dizi/${gövde}/`,
  ];
  for (const şablon of şablonlar) {
    const html = await metinAl(şablon, { headers: { Referer: `${taban}/` } });
    if (!html) continue;
    const kalıplar = [
      new RegExp(`href=["']([^"']+-${sezon}-sezon-${bölüm}-bolum[^"']*)["']`, 'i'),
      new RegExp(`href=["']([^"']*/sezon-${sezon}/bolum-${bölüm}[/"'][^"']*)["']`, 'i'),
    ];
    for (const kalıp of kalıplar) {
      const eş = html.match(kalıp);
      if (eş?.[1]) return birleştir(eş[1], taban);
    }
  }
  console.log(`${ETİKET} S${sezon}E${bölüm} sayfası bulunamadı`);
  return '';
}

/** Bölüm sayfasından DÜZ m3u8 adresleri üretir (iframe adresi döndürülmez). */
function yayınlariÇıkar(html, bölümAdresi, taban) {
  const iframe = html.match(/<iframe[^>]+id=["']diziyouPlayer["'][^>]+src=["']([^"']+)["']/i)
    || html.match(/<iframe[^>]+src=["']([^"']+)["'][^>]+id=["']diziyouPlayer["']/i)
    || html.match(/<iframe[^>]+src=["']([^"']*(?:embed|diziyou)[^"']*)["']/i);
  if (!iframe) {
    console.log(`${ETİKET} oynatıcı bulunamadı`);
    return [];
  }
  const parçalar = String(iframe[1]).split('/').filter(Boolean);
  const kayıt = String(parçalar.pop() || '').split('.html')[0];
  if (!kayıt) return [];

  let kök;
  try {
    const u = new URL(taban);
    kök = `${u.protocol}//storage.${u.hostname.replace(/^www\./, '')}`;
  } catch (_) {
    kök = String(taban).replace(/\//g, '').replace(/^https?:?/, 'https://storage.');
  }
  const referer = `${String(taban).replace(/\/$/, '')}/`;
  const dublajVar = /id=["']turkceDublaj["']/i.test(html);
  const altyazıVar = /id=["']turkceAltyazili["']/i.test(html);

  const çıktılar = [];
  const ekle = (ek, dil) => çıktılar.push({
    name: KOD,
    url: `${kök}/episodes/${kayıt}${ek}/play.m3u8`,
    // Dil işareti bilerek etikette: derleyici altyazı işaretini görmezse
    // yayını dublaj sekmesine atıyor.
    title: `${dil} 1080p`,
    quality: '1080p',
    format: 'm3u8',
    headers: { Referer: referer, Origin: new URL(referer).origin },
  });

  if (altyazıVar || !dublajVar) ekle('', 'Altyazı');
  if (dublajVar) ekle('_tr', 'Dublaj');
  return çıktılar;
}

/**
 * @param {string} kimlik sayısal TMDB numarası (kayıt `kimlik:'tmdb'`)
 * @param {string} tur    'tv' | 'series' (dizi kaynağıdır)
 */
async function getStreams(kimlik, tur = 'tv', season = 1, episode = 1) {
  const tmdbId = String(kimlik ?? '').trim();
  if (!/^\d{1,9}$/.test(tmdbId)) return [];          // IMDb numarasiyla arama yapamaz
  if (tur === 'movie') return [];                    // dizi kaynağı

  const başlıklar = await başlıklarıAl(tmdbId);
  if (!başlıklar) {
    console.log(`${ETİKET} TMDB başlığı alınamadı (kota?)`);
    return [];
  }

  const taban = await tabanAdresiBul();
  const sorgular = [...new Set([başlıklar.tr, başlıklar.orijinal, başlıklar.kısa]
    .filter(s => s && s.length > 1))];

  const sezon = Number(season) || 1;
  const bölüm = Number(episode) || 1;

  let hedef = '';
  for (const sorgu of sorgular) {
    const sayfa = await metinAl(`${taban}/?s=${encodeURIComponent(sorgu)}`, {
      headers: { Referer: `${taban}/` },
      timeoutMs: 9000,
    });
    if (!sayfa) continue;
    const adaylar = aramaSonuçları(sayfa, taban);
    if (!adaylar.length) continue;
    // Tam slug esleşmesi once gelir: "Stranger Things" aramasi siteyi
    // "stranger-things-tales-from-85" gibi turevlerle de dolduruyor.
    const puanlı = adaylar
      .map(a => ({ ...a, puan: Math.max(...sorgular.map(s => gövdeUyar(a.gövde, s))) }))
      .filter(a => a.puan > 0)
      .sort((x, y) => y.puan - x.puan);
    const isabet = puanlı.find(a => a.sezon === sezon && a.bölüm === bölüm);
    if (isabet) { hedef = isabet.adres; break; }
    // Dizi bulundu ama bu bolum arama listesinde yok: slug'dan uret ve dogrula.
    if (puanlı.length) {
      hedef = `${taban}/${puanlı[0].gövde}-${sezon}-sezon-${bölüm}-bolum/`;
      break;
    }
  }
  if (!hedef) {
    console.log(`${ETİKET} katalogda bulunamadı`);
    return [];
  }

  const bölümAdresi = await bölümAdresiBul(hedef, taban, sezon, bölüm);
  const sayfa = await metinAl(bölümAdresi, { headers: { Referer: `${taban}/` } });
  if (!sayfa) {
    console.log(`${ETİKET} bölüm sayfası alınamadı`);
    return [];
  }
  const çıktılar = yayınlariÇıkar(sayfa, bölümAdresi, taban);
  console.log(`${ETİKET} ${çıktılar.length} yayın · S${sezon}E${bölüm}`);
  return çıktılar;
}

// Vendor çekirdekleriyle aynı kayıt mekanizması.
if (typeof globalThis !== 'undefined') globalThis.getStreams = getStreams;
if (typeof global !== 'undefined') global.getStreams = getStreams;
if (typeof window !== 'undefined') window.getStreams = getStreams;
if (typeof module !== 'undefined' && module.exports) {
  try { module.exports = { getStreams }; } catch (_) { /* ESM'de yok sayılır */ }
}

export { getStreams };
export default getStreams;

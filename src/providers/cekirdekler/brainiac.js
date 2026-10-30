/* ==========================================================================
   CinePulse — "Brainiac" çekirdeği (birinci taraf) — DiziYou ailesi
   --------------------------------------------------------------------------
   Ölçülen zincir (2026-10-29, Node'da uçtan uca doğrulandı):
     • Arama:  GET {site}/?s=<metin> → bölüm bağlantıları
       `/{slug}-{S}-sezon-{E}-bolum/` (dizi sayfası: `/{slug}/`)
     • Bölüm:  bölüm sayfasında `<iframe src="{site}/player/{id}.html">`
     • Dublaj: aynı bölümün Türkçe dublaj oynatıcısı `{id}_tr.html` yolundadır;
       medya dosyası da `storage…/episodes/{id}_tr/play.m3u8` olarak AYRIDIR.
       (Yani TR dublaj kanıtı DOSYA YOLU düzeyindedir; master'da ayrı AUDIO
       etiketi yoktur — bu yüzden etiket "TR Dublaj" olarak, gerekçesiyle yazılır.)
     • Master: `#EXTM3U` + varyant listesi; oynatma için Referer = site şart.
   ========================================================================== */

import { tmdbBilgi, adayBasliklar, sadeles, yilUyar } from '../ortakCekirdek.js';

const AD = 'Brainiac';
const SITE = 'https://www.diziyou.one';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function oku(url, { ref = SITE + '/', ms = 12000 } = {}) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html,*/*', Referer: ref },
      signal: typeof AbortSignal?.timeout === 'function' ? AbortSignal.timeout(ms) : undefined,
    });
    return r.ok ? await r.text() : '';
  } catch (_) {
    return '';
  }
}

const norm = (s) => sadeles(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const slugla = (s) => sadeles(String(s || '')).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const ONBELLEK = new Map();
const ONBELLEK_MS = 15 * 60 * 1000;

export async function getStreams(kimlik, tur = 'tv', sezon = 1, bolum = 1) {
  // Bu çekirdek YALNIZ dizi verir (film kataloğu yok).
  if (tur !== 'tv') return [];
  const kim = (kimlik && typeof kimlik === 'object') ? (kimlik.tmdbId || kimlik.id || kimlik.imdbId || '') : kimlik;
  const bilgi = await tmdbBilgi(kim, tur);
  const adaylar = bilgi ? adayBasliklar(bilgi) : [];
  if (!adaylar.length) return [];

  const anahtar = `tv:${bilgi?.baslik || kim}:${+sezon || 1}:${+bolum || 1}`;
  const hazir = ONBELLEK.get(anahtar);
  if (hazir && Date.now() - hazir.t < ONBELLEK_MS) return hazir.sonuc;

  const s = +sezon || 1;
  const b = +bolum || 1;

  /* 1) arama → DİZİ SLUG ADAYLARI
        Dizi sayfası çoğu zaman numara ekli olur ("breaking-bad2") ve bölüm
        bağlantıları "breaking-bad-5-sezon-16-bolum" biçiminde gelir. Tek bir
        tahmin yerine aday listesi kurulur, bölüm sayfasında oynatıcı bulan
        ilk aday kullanılır (ölçüldü 2026-10-29: tahmin "breaking-bad" yanlıştı). */
  const slugAdaylari = [];
  for (const soru of adaylar.slice(0, 2)) {
    const html = await oku(`${SITE}/?s=${encodeURIComponent(soru)}`);
    if (!html) continue;
    const yollar = [...new Set([...html.matchAll(/href="(?:https?:\/\/www\.diziyou\.one)?\/([a-z0-9-]+)\//g)].map((m) => m[1]))]
      .filter((y) => !/^(search|category|tag|page|feed|wp-|dizi|film|player)/.test(y));
    for (const yol of yollar) {
      const temel = yol.replace(/-\d+-sezon-\d+-bolum$/, '');
      const bAd = norm(temel);
      const esles = adaylar.some((a) => { const n = norm(a); return n && (bAd.includes(n) || n.includes(bAd)); });
      if (!esles) continue;
      const yilEs = temel.match(/(?:^|-)((?:19|20)\d{2})(?:-|$)/);
      if (bilgi?.yil && yilEs && !yilUyar(Number(yilEs[1]), bilgi.yil)) continue;
      if (!slugAdaylari.includes(temel)) slugAdaylari.push(temel);
      // Numara ekli dizi sayfası ("breaking-bad2") genelde doğru olanıdır: öne al.
      if (!slugAdaylari.includes(yol.replace(/-\d+-sezon-\d+-bolum$/, ''))) slugAdaylari.push(yol);
    }
    if (slugAdaylari.length) break;
  }
  // Tam başlık eşleşmesi olan adaylar önce denenir (kısa liste)
  const denenecekSluglar = slugAdaylari.slice(0, 4);

  /* 2) bölüm sayfası → oynatıcı id (ilk oynatıcı bulan aday kazanır) */
  let oynaticiId = '';
  let bolumUrl = '';
  for (const slug of denenecekSluglar) {
    const adayUrl = `${SITE}/${slug}-${s}-sezon-${b}-bolum/`;
    const bolumHtml = await oku(adayUrl, { ref: `${SITE}/${slug}/` });
    if (!bolumHtml) continue;
    const pid = (bolumHtml.match(/\/player\/(\d+)(?:_tr)?\.html/) || [])[1];
    if (!pid) continue;
    oynaticiId = pid;
    bolumUrl = adayUrl;
    break;
  }
  if (!oynaticiId) return [];

  /* 3) TR dublaj ve orijinal oynatıcı: dosya yolları AYRI.
        `_tr` yolu varsa Türkçe dublajdır (kanıt: ayrı medya dosyası). */
  const adaylarOynatici = [
    { id: `${oynaticiId}_tr`, dublaj: true },
    { id: oynaticiId, dublaj: false },
  ];
  const sonuc = [];
  for (const o of adaylarOynatici) {
    const plyUrl = `${SITE}/player/${o.id}.html`;
    const ply = await oku(plyUrl, { ref: bolumUrl });
    if (!ply) continue;
    const master = (ply.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/) || [])[0] || '';
    if (!master) continue;
    const m = await oku(master, { ref: plyUrl, ms: 9000 });
    if (!/#EXTM3U/.test(m)) continue;
    const yuk = (m.match(/RESOLUTION=\d+x(\d+)/g) || []).map((x) => Number((x.match(/x(\d+)/) || [])[1])).filter(Boolean);
    const h = yuk.length ? Math.max(...yuk) : 1080;
    const kalite = h >= 2000 ? '4K' : h >= 1000 ? '1080p' : h >= 700 ? '720p' : h >= 400 ? '480p' : '360p';
    const sesler = [...m.matchAll(/TYPE=AUDIO[^\n]*NAME="([^"]+)"/g)].map((x) => x[1]);
    sonuc.push({
      name: AD,
      title: `${AD} · ${kalite} · ${o.dublaj ? 'TR Dublaj' : 'Orijinal'}${sesler.length > 1 ? ` · ${sesler.length} Ses` : ''}`,
      url: master,
      quality: kalite,
      format: 'm3u8',
      isM3u8: true,
      // `_tr` medya yolu TR dublaj kanıtıdır; master'da ayrı AUDIO etiketi yok.
      diller: o.dublaj ? ['tr'] : [],
      trSes: o.dublaj === true,
      dilDurumu: o.dublaj ? 'dublaj' : 'orijinal',
      headers: { 'User-Agent': UA, Referer: `${SITE}/` },
      proxyGerekmez: true, // storage CDN'i Referer/hotlink korumalı
    });
  }

  if (sonuc.length) ONBELLEK.set(anahtar, { t: Date.now(), sonuc });
  if (ONBELLEK.size > 200) ONBELLEK.delete(ONBELLEK.keys().next().value);
  return sonuc;
}

if (typeof globalThis !== 'undefined') {
  globalThis.getStreams = getStreams;
  globalThis.__cpBrainiac = getStreams;
}
export default getStreams;

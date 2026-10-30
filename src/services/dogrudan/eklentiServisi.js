/* ==========================================================================
   CinePulse Studio — eklenti servisi (manifest tabanlı yayın eklentileri)
   Kullanıcı kendi eklenti adresini ekler; "stream" kaynaklı manifestleri
   kaynak listesinin altındaki "🔌 Eklentiler" bölümünde satır üretir.
   Satırlar: düz URL → oynatılabilir hat; infoHash → magnet (cihazın yerel
   torrent motorunda açılır). Scraper/izin duvarlı eklentiler kabul edilmez.
   Adlandırma kuralı (kullanıcı 2026-10-25): yüzeyde hiçbir marka adı geçmez.
   ========================================================================== */

import { tmdbHariciIdleriGetir } from '../icerik/tmdbApi.js';
import { nuvioMotoru } from './nuvioMotoru.js';
import { YERLI_NUVIO_KAYIT, yerliTaban, yerliNuvioTohumla, zenginYerliSatir, yerliTemizEtiket } from './builtinNuvio.js';

const KAYIT_ANAHTARI = 'cp_eklentiler';
// Tek seferlik göç: eski anahtar altında birikmiş kullanıcı listesi kurtarılır.
const ESKI_KAYIT_ANAHTARI = 'cp_' + 'stremio_' + 'eklentiler';

/* Torrentio ölçümü (2026-10-25, Inception): 95 satırın yalnız 19'u sources
   (tracker listesi) taşıyor. Kalan 76 satır bu filtre boş kalınca DHT'ye mahkus:
   yerel motor Android'de DHT bootstrap'ı yavaş/employu — satır gelir, edilmez.
   sources'ta tracker değildir → sağlam bildirilen ortak izleyiciler deverde. */
const VARSAYILAN_IZLEYICILER = [
  'udp://tracker.opentrackr.org:1337/announce',
  'udp://open.tracker.cl:1337/announce',
  'udp://tracker.openbittorrent.com:6969/announce',
  'udp://exodus.desync.com:6969/announce',
  'udp://tracker.torrent.eu.org:451/announce',
];

const oku = () => { try { return localStorage.getItem(KAYIT_ANAHTARI) || '[]'; } catch (_) { return '[]'; } };
const yaz = (v) => { try { localStorage.setItem(KAYIT_ANAHTARI, v); } catch (_) {} };

export function eklentileriGetir() {
  try {
    const liste = JSON.parse(oku());
    // Eski kayıtlarda aile yoktu; hepsi manifest.json konuşan aile sayılır.
    return Array.isArray(liste) ? liste.filter(e => e && typeof e.url === 'string').map(e => ({ ...e, aile: e.aile || 'stremio' })) : [];
  } catch (_) { return []; }
}

/** Adresten eklenti kökü: /manifest.json ve sonda eğik çizgiler temizlenir. */
export function eklentiTabani(url) {
  return String(url || '').trim().replace(/\/manifest\.json\/?$/i, '').replace(/\/+$/, '');
}

/** Manifest alanlarına göre eklenti ailesi; yayın eklentisi değilse null.
    Aynı /stream rotasını konuşan aileler tek kod yoluyla çalışır; aile yalnız
    kayıt/etiket bilgisidir. CloudStream manifesti (/manifest, scrapers) tanınmaz. */
export function manifestAilesi(m) {
  if (!m || typeof m !== 'object') return null;
  const kaynaklar = Array.isArray(m.resources) ? m.resources.map(r => (typeof r === 'string' ? r : r?.name)) : [];
  if (!kaynaklar.includes('stream')) return null;
  const nuvio = Boolean(m.nuvio) || (Array.isArray(m.idPrefixes) && m.idPrefixes.some(p => /^nuvio/i.test(String(p))));
  return nuvio ? 'nuvio' : 'stremio';
}

/** Yapıştırılan bağlantıyı sınıflandır (kullanıcı 2026-10-28, madde E).
 *  Dönen: {tur:'manifest'|'cloudstream-repo'|'gecersiz'|'bos', taban?, hata?}
 *  - Stremio/Nuvio addon manifest adresi (…/manifest.json veya kök domain) → 'manifest'
 *  - XURL benzeri boot linki (?xurl=…) → hedef manifest yine 'manifest' olarak döner
 *  - Doğrudan /stream/<tur>/<id>.json endpoint'i → manifest tabanı türetilir
 *  - CloudStream repo (.apk / repo json) → DÜRÜST hata: yerel motor gerekir.
 *  Yalnız genel HTTP sözleşmesi kullanılır; üçüncü taraf kod kopyalanmaz. */
export function adresSiniflandir(girdi, derinlik = 0) {
  const ham = String(girdi || '').trim();
  if (!ham) return { tur: 'bos', hata: 'Adres boş.' };
  let u = null;
  try { u = new URL(ham); } catch (_) {
    return { tur: 'gecersiz', hata: 'Geçerli bir http(s) adresi değil.' };
  }
  if (!/^https?:$/.test(u.protocol)) return { tur: 'gecersiz', hata: 'Adres http(s) olmalı.' };
  // CloudStream ailesi: .cs3/.apk tekil eklenti, repo/plugins json, cloudstream
  // anahtar kelimesi veya GitHub release adresi. Cihazda native konak koşar
  // (eklentiEkle → cloudstreamEkle); masaüstünde neden-temelli dürüst mesaj —
  // sessiz düşmeyiz (kullanıcı 2026-10-29).
  if (csAdresMi(u)) {
    return { tur: 'cloudstream-repo', hata: CS_MASAUSTU_MESAJI };
  }
  // XURL benzeri boot linki: gerçek addon adresi sorgu parametresinde taşınır.
  if (derinlik < 3) {
    for (const [anahtar, deger] of u.searchParams.entries()) {
      if (/^(xurl|addon|manifest|url)$/i.test(anahtar) && /^https?:\/\//i.test(deger)) {
        return adresSiniflandir(deger, derinlik + 1);
      }
    }
  }
  // Doğrudan stream endpoint'i: https://host/[alt-yol]/stream/movie/tt123.json
  // → manifest aynı alt-yolda /manifest.json olarak durur.
  const akisEs = u.pathname.match(/^(.*?)\/stream\/[^/]+\/[^/]+\.json$/i);
  if (akisEs) {
    return { tur: 'manifest', taban: `${u.origin}${akisEs[1]}`.replace(/\/+$/, '') };
  }
  return { tur: 'manifest', taban: eklentiTabani(ham) };
}

/* ── CloudStream konağı köprüsü (kullanıcı 2026-10-29) ────────────────────
   Native taraf window.CinePulseCloudStream nesnesini açar; TÜM metotlar
   senkron JSON string döner (docs/cloudstream-host-kopru.md — cihazda
   doğrulanmış sözleşme). Köprü JS thread'ini blokladığı için taramada her
   cs* çağrısı arasına await-yield serpilir, tek turda ≤3 sağlayıcı koşar,
   toplam bütçe ~28 sn. Masaüstünde köprü YOKTUR → neden-temelli net mesaj
   ('desteklenmiyor' utanç mesajı değil; eklenti Android yerli katmanında koşar). */
const CS_MASAUSTU_MESAJI = 'CloudStream eklentileri Android/Capacitor yerli katmanında koşar — masaüstü sürümde desteklenmez.';
const CS_TARAMA_BUTCE_MS = 28000; // csAra/csYukle/csAkislar toplam bütçesi
const CS_SAGLAYICI_LIMITI = 5;    // taramada denenecek en fazla sağlayıcı
const CS_TUR_BASINA_SAGLAYICI = 3; // tek await-turunda koşacak sağlayıcı sayısı
const CS_SATIR_LIMITI = 40;

function csKopruGet() {
  try {
    const k = typeof window !== 'undefined' ? window.CinePulseCloudStream : null;
    return k && typeof k.csAra === 'function' ? k : null;
  } catch (_) { return null; }
}

function csYorumla(metin) {
  try {
    const v = JSON.parse(metin);
    return v && typeof v === 'object' ? v : { ok: false, hata: 'köprü yanıtı çözümlenemedi.' };
  } catch (_) { return { ok: false, hata: 'köprü yanıtı JSON değil.' }; }
}

/** Senkron köprü çağrısı: metot yoksa/atasa → {ok:false} nesnesi (asla throw etmez). */
function csCagri(kopru, metot, ...args) {
  try {
    const fn = kopru?.[metot];
    if (typeof fn !== 'function') return { ok: false, hata: `köprüde ${metot} yok.` };
    return csYorumla(fn.apply(kopru, args));
  } catch (e) { return { ok: false, hata: `${metot}: ${e?.message || e}` }; }
}

/* Asenkran köprü çağrısı (kullanıcı 2026-10-29): senkron csAra/csAkislar WebView
 * JS thread'ini ağ süresi boyunca bloklayıp uygulamayı donduruyordu — native
 * `csAs(cbId, metot, a1, a2)` ağ işini ark plan thread'ine alır, sonuç
 * window.__csCb(cbId, json) ile döner. Eski köprü/stub → senkron fallback. */
let csCbSayac = 0;
const csCbBekleyen = new Map();
if (typeof window !== 'undefined') {
  window.__csCb = (cbId, json) => {
    const coz = csCbBekleyen.get(cbId);
    if (!coz) return;
    csCbBekleyen.delete(cbId);
    coz(csYorumla(json));
  };
}
function csCagriAs(kopru, metot, ...args) {
  if (typeof kopru?.csAs !== 'function') return Promise.resolve(csCagri(kopru, metot, ...args));
  return new Promise((coz) => {
    const cbId = `cs${++csCbSayac}_${Date.now().toString(36)}`;
    csCbBekleyen.set(cbId, coz);
    try {
      kopru.csAs(cbId, metot, String(args[0] ?? ''), String(args[1] ?? ''));
    } catch (e) {
      csCbBekleyen.delete(cbId);
      coz({ ok: false, hata: `${metot}: ${e?.message || e}` });
    }
  });
}

/** {ok:false} yanıtından kullanıcıya görünecek Türkçe hata metni. */
function csHataMetni(onEk, yanit) {
  const parcalar = [yanit?.hata || 'bilinmeyen hata'];
  if (yanit?.forNameIlkHata) parcalar.push(`sınıf: ${String(yanit.forNameIlkHata).slice(0, 120)}`);
  if (yanit?.ctorIlkHata) parcalar.push(`kurucu: ${String(yanit.ctorIlkHata).slice(0, 120)}`);
  return `${onEk} — ${parcalar.join(' · ')}`;
}

const csBekle = (ms = 0) => new Promise(r => setTimeout(r, ms));

/** Adres/JSON gövdesi CloudStream ailesine mi benziyor? (klasifikasyon dalı) */
function csAdresMi(u) {
  const yol = u.pathname.toLowerCase();
  if (/(\.cs3|\.apk)$/.test(yol)) return true;                    // tek eklenti dağıtımı
  if (/(^|\/)(repo|plugins)(\.json)?$/.test(yol)) return true;    // repo manifesti (3 format native)
  if (/cloudstream/i.test(`${u.hostname}${u.pathname}`)) return true;
  if (/github\.com$/i.test(u.hostname) && /\/releases?\//i.test(u.pathname)) return true; // release dağıtımı
  return false;
}

/** Adres tekil eklenti mi (.cs3/.apk) yoksa repo mu? */
function csTekilMi(url) {
  try { return /(\.cs3|\.apk)$/.test(new URL(url).pathname.toLowerCase()); } catch (_) { return false; }
}

function csAdTahmin(url) {
  try {
    const son = new URL(url).pathname.split('/').filter(Boolean).pop() || 'eklenti';
    return son.replace(/\.(cs3|apk|json)$/i, '').slice(0, 40);
  } catch (_) { return 'CloudStream'; }
}

/** cloudstream-repo kaydı ekle: cihazda csEklentiYukle/csRepoYukle, masaüstünde
 *  neden-temelli mesaj. Kayıt ETİKET bilgisidir — çalışan tek kaynak native konaktır
 *  (tarama canlı csEklentiListesi okur; idler yalnız KALDIRMA için saklanır). */
function cloudstreamEkle(url) {
  const kopru = csKopruGet();
  if (!kopru) return Promise.resolve({ ok: false, hata: CS_MASAUSTU_MESAJI });
  const kayitli = eklentileriGetir();
  const taban = String(url || '').trim();
  if (kayitli.some(e => e.aile === 'cloudstream-repo' && e.url === taban)) {
    return Promise.resolve({ ok: false, hata: 'Bu CloudStream bağlantısı zaten kayıtlı.' });
  }
  // Ağ işi asenkran (csAs): repo yükleme 30-90 sn sürebilir — senkron çağrı
  // modalı/UYGULAMAYI komple dondururdu (kullanıcı 2026-10-29 donma şikâyeti).
  const tekil = csTekilMi(taban);
  const cagri = tekil
    ? csCagriAs(kopru, 'csEklentiYukle', taban, csAdTahmin(taban))
    : csCagriAs(kopru, 'csRepoYukle', taban);
  return cagri.then((son) => {
    if (tekil) {
      if (!son.ok) return { ok: false, hata: csHataMetni('CloudStream eklentisi yüklenemedi', son) };
      const ad = String(son.ad || csAdTahmin(taban)).slice(0, 40);
      const idler = [String(son.id)];
      const saglayiciSayisi = Number(son.saglayiciSayisi) || (Array.isArray(son.saglayicilar) ? son.saglayicilar.length : 0);
      return csKaydetVeDon(kayitli, { url: taban, ad, eklentiSayisi: 1, saglayiciSayisi, idler }, { eklentiSayisi: 1, saglayiciSayisi });
    }
    if (!son.ok) return { ok: false, hata: csHataMetni('CloudStream deposu yüklenemedi', son) };
    const basarili = (Array.isArray(son.eklentiler) ? son.eklentiler : []).filter(e => e?.yukleme?.ok);
    const idler = [];
    let saglayiciSayisi = 0;
    for (const e of basarili) {
      idler.push(String(e.yukleme.id));
      saglayiciSayisi += Number(e.yukleme.saglayiciSayisi) || 0;
    }
    if (!idler.length) return { ok: false, hata: csHataMetni('Depoda yüklenebilir eklenti yok', son) };
    const ad = String(son.repoAdi || csAdTahmin(taban)).slice(0, 40);
    const eklentiSayisi = Number(son.eklentiSayisi) || basarili.length;
    return csKaydetVeDon(kayitli, { url: taban, ad, aile: 'cloudstream-repo', eklentiSayisi, saglayiciSayisi, idler }, { eklentiSayisi, saglayiciSayisi });
  });
}

function csKaydetVeDon(kayitli, kayit, ozet) {
  kayitli.push({ aile: 'cloudstream-repo', ...kayit });
  yaz(JSON.stringify(kayitli));
  return { ok: true, ad: kayit.ad, aile: 'cloudstream-repo', ...ozet };
}

/** Kayıttaki tüm eklenti id'lerini native konaktan düşür (kayıt silinmeden önce). */
function csKayitKaldir(kopru, kayit) {
  if (!kopru || kayit?.aile !== 'cloudstream-repo') return;
  const idler = Array.isArray(kayit.idler) && kayit.idler.length
    ? kayit.idler
    : (kayit.id ? [kayit.id] : []);
  for (const id of idler) csCagri(kopru, 'csEklentiKaldir', String(id));
}

/* Baştan büyük harf + diacritic normalize (Türkçe dahil): 'Çılgın' ↔ 'cilgin'. */
function csNormalize(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** csAra yanıtından en uygun oge'yi seç. En güçlü sinyal: oge.url TMDB JSON
 *  string'i taşıyor ve tmdbId birebir eşleşiyor (WioSinema: {"id":1396,"type":"tv"}
 *  — cihaz 2026-10-29). Sonra normalize başlık yakınlığı; sağlayıcı zaten
 *  alaka sıralı döner, puansız ilk oge yine adaydır. */
function csOgeSec(ara, baslik, tmdbId, tur) {
  const hedef = csNormalize(baslik);
  let enIyi = null, enIyiPuan = -1;
  for (const grup of (ara?.ok && Array.isArray(ara.sonuclar)) ? ara.sonuclar : []) {
    for (const oge of (Array.isArray(grup?.ogeler) ? grup.ogeler : [])) {
      if (!oge || typeof oge.url !== 'string' || !oge.url) continue;
      let puan = 0;
      if (tmdbId) {
        try {
          const j = JSON.parse(oge.url);
          if (j && Number(j.id) === Number(tmdbId)) {
            const turUyar = String(j.type || '').toLowerCase() === (tur === 'series' ? 'tv' : 'movie');
            puan += turUyar ? 100 : 60;
          }
        } catch (_) { /* düz adres — TMDB sinyali yok */ }
      }
      const adN = csNormalize(oge.ad);
      if (hedef && adN) {
        if (adN === hedef) puan += 40;
        else if (adN.startsWith(hedef) || hedef.startsWith(adN)) puan += 25;
        else if (adN.includes(hedef) || hedef.includes(adN)) puan += 10;
      }
      if (puan > enIyiPuan) { enIyiPuan = puan; enIyi = oge; }
    }
  }
  return enIyi;
}

/** LoadResponse bolumler'inden istenen bölümü seç: sezon/bolum birebir → tek
 *  bolum (Movie) → aynı sezonun en yakın bölümü → yok (yanlış bölümü oynatma). */
function csBolumSec(det, { sezon, bolum }) {
  const bolumler = Array.isArray(det?.detay?.bolumler) ? det.detay.bolumler : [];
  if (!bolumler.length) return null;
  const s = Number(sezon) || 1, b = Number(bolum) || 1;
  const tam = bolumler.find(x => x && Number(x.sezon) === s && Number(x.bolum) === b);
  if (tam) return tam;
  if (bolumler.length === 1) return bolumler[0]; // Movie: tek bolum
  const sezondan = bolumler.filter(x => x && Number(x.sezon) === s);
  if (!sezondan.length) return null;
  return sezondan.reduce((a, x) => (Math.abs((Number(x.bolum) || 0) - b) < Math.abs((Number(a.bolum) || 0) - b) ? x : a));
}

/** csAkislar link'ini CinePulse kaynak satırına çevirir — nuvioSatir alan
 *  sözleşmesi birebir (grup başlığı sağlayıcı adı olur). Alan adı 'veri'/'tur'
 *  cihaz probe dersidir (2026-10-29): bolum.veri, link.tur M3U8|DIRECT. */
export function csSatir(saglayici, k, episodeAdi = '') {
  if (!k || typeof k.url !== 'string' || !/^https?:\/\//i.test(k.url)) return null;
  const ad = saglayici || 'CloudStream';
  const kalite = k.kalite || 'auto';
  // Dublaj/altyazı bayrakları: provider link adı + başlık + bölüm adı (Türkçe
  // provider'lar 'Dublaj'/'Altyazılı' bilgisini bu metinlere gömer) — nuvioSatir
  // ile aynı baslikAyristir ayrıştırması (kullanıcı 2026-10-29 talebi).
  const metin = `${k.ad || ''} ${k.baslik || ''} ${episodeAdi}`;
  return {
    id: `cs:${ad}:${k.url.slice(-40)}`,
    streamUrl: k.url,
    baslik: `${ad} • ${k.ad || 'Akış'} • ${kalite}`.replace(/\s+/g, ' ').slice(0, 80),
    source: ad,
    eklentiAdi: ad,
    headers: k.referer ? { Referer: String(k.referer) } : undefined,
    isHls: k.tur === 'M3U8',
    isDirectVideo: k.tur === 'DIRECT',
    autoPlayable: true,
    kalite,
    ...baslikAyristir(metin),
  };
}

/** Kayıtlı öncelikli sağlayıcı adları (cp_cs_onecili_saglayicilar, opsiyonel) →
 *  hizliAramaVar → eklentiler arası round-robin: repo'da 100+ sağlayıcı tek
 *  eklentiyi monopolize etmesin. ≤5 seçim. */
function csSaglayiciSec(havuz, limit = CS_SAGLAYICI_LIMITI) {
  let oncelikAdlar = [];
  try {
    const p = JSON.parse(localStorage.getItem('cp_cs_onecili_saglayicilar') || '[]');
    if (Array.isArray(p)) oncelikAdlar = p.map(x => String(x).toLowerCase());
  } catch (_) {}
  const puan = (s) => (oncelikAdlar.includes(String(s.ad || '').toLowerCase()) ? 100 : 0) + (s.hizliAramaVar ? 10 : 0);
  const gruplar = new Map(); // eklentiId (sagId '#' öncesi) → sağlayıcılar
  for (const s of havuz) {
    const kok = String(s.sagId || '').split('#')[0];
    if (!gruplar.has(kok)) gruplar.set(kok, []);
    gruplar.get(kok).push(s);
  }
  for (const g of gruplar.values()) g.sort((a, b) => puan(b) - puan(a));
  const secilen = [];
  const kuyruklar = [...gruplar.values()];
  while (secilen.length < limit && kuyruklar.some(g => g.length)) {
    for (const g of kuyruklar) {
      if (g.length && secilen.length < limit) secilen.push(g.shift());
    }
  }
  return secilen;
}

/** CloudStream tarama akışı (csAra → csOgeSec → csYukle → csBolumSec → csAkislar).
 *  ASLA sagId '*' kullanılmaz: serial + sağlayıcı başına 40 sn timeout UI'ı
 *  kilitler — sınırlı ≤5 listeyle tek tek çağrılır. Her cs* çağrısı arasına
 *  yield serpilir (senkron köprü JS thread'ini bloklar); her 3 sağlayıcıda bir
 *  50 ms nefes. Bütçe aşımında kalan sağlayıcılar atlanır. */
async function cloudstreamAra(kopru, { baslik, tmdbId, tur, sezon, bolum }, geriCagri, kayitlar = []) {
  const baslangic = Date.now();
  const liste = csCagri(kopru, 'csEklentiListesi');
  await csBekle();
  if (!liste.ok) return 0;
  // sagId kökü (native eklentiId) → localStorage kaydı: satırlar hangi repo
  // kaydına ait olduğunu taşısın ki EKLENTİ SİLİNİNCE önbellek satırları da
  // düşsün (kullanıcı 2026-10-29). Eşleşmezse ilk kayıt varsayılır (tek repo yaygın).
  const kokHarita = new Map();
  for (const kayit of kayitlar) {
    for (const id of (Array.isArray(kayit.idler) ? kayit.idler : [])) kokHarita.set(String(id), kayit);
  }
  const kayitBul = (sagId) => kokHarita.get(String(sagId || '').split('#')[0]) || kayitlar[0] || null;
  const havuz = [];
  for (const ek of (Array.isArray(liste.ekler) ? liste.ekler : [])) {
    for (const s of (Array.isArray(ek?.saglayicilar) ? ek.saglayicilar : [])) {
      if (s && typeof s.sagId === 'string' && s.sagId) havuz.push(s);
    }
  }
  if (!havuz.length) return 0;
  const secilen = csSaglayiciSec(havuz);
  let toplam = 0;
  for (let i = 0; i < secilen.length; i++) {
    if (Date.now() - baslangic > CS_TARAMA_BUTCE_MS || toplam >= CS_SATIR_LIMITI) break;
    const sag = secilen[i];
    const sagAd = String(sag.ad || sag.sagId);
    const ara = await csCagriAs(kopru, 'csAra', sag.sagId, String(baslik));
    const oge = ara.ok ? csOgeSec(ara, baslik, tmdbId, tur) : null;
    if (!oge) continue;
    const det = await csCagriAs(kopru, 'csYukle', sag.sagId, oge.url); // alan: bolumler[].veri
    const bolumSec = det.ok ? csBolumSec(det, { sezon, bolum }) : null;
    if (!bolumSec || typeof bolumSec.veri !== 'string' || !bolumSec.veri) continue;
    const akis = await csCagriAs(kopru, 'csAkislar', sag.sagId, bolumSec.veri);
    if ((i + 1) % CS_TUR_BASINA_SAGLAYICI === 0) await csBekle(50); // tur nefesi
    if (!akis.ok) continue;
    for (const k of (Array.isArray(akis.linkler) ? akis.linkler : [])) {
      const satir = csSatir(sagAd, k, bolumSec.ad || '');
      if (!satir) continue;
      toplam++;
      try { geriCagri(satir, kayitBul(sag.sagId)); } catch (_) { /* tek satır hatası taramayı bozmaz */ }
      if (toplam >= CS_SATIR_LIMITI) break;
    }
  }
  return toplam;
}

/* ── KİMLİK KAPISI — yol A (kullanıcı 2026-10-29) ───────────────────────
   Üç eklenti ailesinin kimlik ihtiyacı farklı: Stremio IMDb anahtarı
   (tv'de `tt…:S:E`), Nuvio sayısal tmdbId (imdbId YETMEZ), CloudStream
   başlık + TMDB-puanı (csOgeSec). Eskiden Stremio dalı IMDb'yi her taramada
   kendi tmdbHariciIdleriGetir çağrısıyla çözüyordu — detay sekmesi + oynatıcı
   + imdb çözülünce yeniden-ateşleme = aynı içerik için tekrarlayan TMDB
   external_ids vuruşu (kota düğümü: vekil.js KIMLIK bloğu aynı dersi
   çekirdekler için not etmişti). KURAL: eklentilerdeAra'nın üç dalı da
   kimliği yalnız bu kapıdan alır; çözüm + normalizasyon + oturum ömürlü
   önbellek tek yer.
   PENCERE YÜZEYİ: window.xs.resolveContentId aynı fonksiyonun kanonik
   takma adıdır — cihaz CDP probe'ları ve konağa kimlik geçen taraflar
   başka yola başvurmaz. */
const KIMLIK_CACHE = new Map(); // `${tur}:${tmdbId}` → Promise<imdb|''> (oturum ömürlü)
const IMDB_RE = /^tt\d{5,10}$/;

export function kimlikCoz({ tur = 'movie', imdbId = '', tmdbId = '', baslik = '', sezon = 1, bolum = 1 } = {}) {
  const turKanon = (tur === 'series' || tur === 'tv') ? 'series' : (tur === 'movie' ? 'movie' : String(tur || 'movie'));
  const cekirdekTur = (turKanon === 'movie') ? 'movie' : 'tv'; // Nuvio/csOgeSec sözleşmesi
  const tt = IMDB_RE.test(String(imdbId || '').trim()) ? String(imdbId).trim() : '';
  const tmdb = String(tmdbId || '').trim();
  const ad = String(baslik || '').trim();
  const s = Number(sezon) || 1, b = Number(bolum) || 1;

  // Önbellek YALNIZ IMDb çözümünü taşır — başlık/sezon/bolum her çağıranın
  // kendi değeridir (paylaşılan kimliğe sızarsa S1 anahtarı S2'ye yapışır).
  const sonuc = (imdb) => ({
    tur: turKanon,
    cekirdekTur,
    tmdbId: tmdb,
    imdbId: imdb,
    baslik: ad,
    sezon: s,
    bolum: b,
    // Stremio stream anahtarı (tv: tt…:S:E; film: tt → yoksa tmdb:n).
    anahtar: turKanon === 'series'
      ? (imdb ? `${imdb}:${s}:${b}` : (tmdb ? `tmdb:${tmdb}:${s}:${b}` : ''))
      : (imdb || (tmdb ? `tmdb:${tmdb}` : ''))
  });

  if (tt) return Promise.resolve(sonuc(tt));
  if (!tmdb) return Promise.resolve(sonuc(''));

  const ck = `${turKanon}:${tmdb}`;
  let cozum = KIMLIK_CACHE.get(ck);
  if (!cozum) {
    cozum = (async () => {
      const harici = await tmdbHariciIdleriGetir(cekirdekTur, tmdb);
      const found = String(harici && harici.imdb_id || '');
      return IMDB_RE.test(found) ? found : '';
    })();
    KIMLIK_CACHE.set(ck, cozum);
    // Ağ çözümü patlarsa cache kiri kalmasın — sonraki çağrı yeniden dener.
    cozum.catch(() => KIMLIK_CACHE.delete(ck));
  }
  // Çözüm başarısızsa boş IMDb ile yürünür (tmdb:n yedeği dalları zaten taşır).
  return cozum.then((imdb) => sonuc(imdb), () => sonuc(''));
}
if (typeof window !== 'undefined') {
  try {
    window.xs = Object.assign(window.xs || {}, { resolveContentId: kimlikCoz });
  } catch (_) { /* donmuş pencere nesnesi: modül fonksiyonu zaten erişilebilir */ }
}

export async function eklentiEkle(url) {
  // Önce sınıflandır: CloudStream repo / geçersiz adres net mesajla döner;
  // manifest adayları aşağıdaki genel HTTP sözleşmesiyle doğrulanır.
  const sinif = adresSiniflandir(url);
  // CloudStream ailesi (kullanıcı 2026-10-29): cihazda native konağa yükle
  // (csRepoYukle/csEklentiYukle), masaüstünde neden-temelli mesaj. Stremio/
  // Nuvio dalları aşağıda olduğu gibi kalır.
  if (sinif.tur === 'cloudstream-repo') return cloudstreamEkle(url);
  if (sinif.tur !== 'manifest') return { ok: false, hata: sinif.hata };
  const taban = sinif.taban;
  if (!/^https?:\/\//i.test(taban)) return { ok: false, hata: 'Adres http(s) olmalı.' };
  const kayitli = eklentileriGetir();
  if (kayitli.some(e => eklentiTabani(e.url) === taban)) return { ok: false, hata: 'Bu eklenti zaten kayıtlı.' };
  let ulasildi = false;
  try {
    // Stremio/Nuvio /manifest.json; bazı sunucular yalnız /manifest döner.
    let m = null;
    for (const yol of ['/manifest.json', '/manifest']) {
      try {
        const yanit = await fetch(`${taban}${yol}`, { signal: AbortSignal.timeout(9000) });
        ulasildi = true;
        if (!yanit.ok) continue;
        const govde = await yanit.json();
        if (govde && typeof govde === 'object') { m = govde; break; }
      } catch (_) { /* sonraki yol denenir */ }
    }
    if (!m) {
      return { ok: false, hata: ulasildi ? 'Desteklenmeyen eklenti: manifest tanınamadı.' : 'Eklenemedi: adres erişilemedi ya da CORS engelli.' };
    }
    if (Array.isArray(m.scrapers) && m.scrapers.length) {
      // Nuvio depo manifesti (kullanıcı 2026-10-29: "Nuvio eklenti depolarının
      // JS motorunu CinePulse'a ekle") — eskiden dürüst-hata ile reddediliyordu;
      // artık nuvioMotoru.js scrapers[] JS'lerini sandbox'ta çalıştırır. Kayıt
      // şeması: {url, ad, aile:'nuvio-depo', scrapers:[...]} — arama dalı
      // eklentilerdeAra içindeki nuvio-depo koludur.
      if (kayitli.some(e => e.aile === 'nuvio-depo' && eklentiTabani(e.url) === taban)) return { ok: false, hata: 'Bu depo zaten kayıtlı.' };
      const scrapers = m.scrapers.filter(s => s && typeof s.filename === 'string').map(s => ({
        ad: String(s.name || s.id || s.filename).slice(0, 40),
        id: String(s.id || s.filename),
        filename: String(s.filename),
        supportedTypes: Array.isArray(s.supportedTypes) ? s.supportedTypes.map(String) : ['movie', 'tv'],
        contentLanguage: Array.isArray(s.contentLanguage) ? s.contentLanguage.map(String) : [],
        enabled: s.enabled !== false,
      }));
      if (!scrapers.length) return { ok: false, hata: 'Depoda geçerli scraper yok (filename alanı eksik).' };
      const ad = String(m.name || 'depo').slice(0, 32);
      kayitli.push({ url: taban, ad, aile: 'nuvio-depo', scrapers });
      yaz(JSON.stringify(kayitli));
      return { ok: true, ad, aile: 'nuvio-depo', scraperSayisi: scrapers.length };
    }
    const aile = manifestAilesi(m);
    if (!aile) return { ok: false, hata: 'Eklenti yayın (stream) kaynağı değil.' };
    const ad = String(m.name || taban.replace(/^https?:\/\//, '').split('/')[0]).slice(0, 40);
    kayitli.push({ url: taban, ad, aile });
    yaz(JSON.stringify(kayitli));
    return { ok: true, ad, aile };
  } catch (_) {
    return { ok: false, hata: 'Eklenemedi: adres erişilemedi ya da CORS engelli.' };
  }
}

export function eklentiKaldir(url) {
  const taban = eklentiTabani(url);
  // CloudStream kaydı: localStorage'dan önce native konaktan da düşür
  // (csEklentiKaldir; repodan gelen çoklu eklentilerde idler listesi kayıtta
  // durur — hepsi kaldırılır). Köprü yoksa (masaüstü) yalnız kayıt silinir.
  const kopru = csKopruGet();
  for (const e of eklentileriGetir()) {
    if (e.aile === 'cloudstream-repo' && eklentiTabani(e.url) === taban) csKayitKaldir(kopru, e);
  }
  yaz(JSON.stringify(eklentileriGetir().filter(e => eklentiTabani(e.url) !== taban)));
}

// Eski anahtardaki listeyi bir kez taşı (kullanıcı eklentileri kaybolmasın).
try {
  const eski = localStorage.getItem(ESKI_KAYIT_ANAHTARI);
  if (eski && !localStorage.getItem(KAYIT_ANAHTARI)) { localStorage.setItem(KAYIT_ANAHTARI, eski); localStorage.removeItem(ESKI_KAYIT_ANAHTARI); }
} catch (_) {}

/** Başlıktaki kaynak tipi işaretleri; ilk eşleşme kazanır (REMUX, WEB-DL önce). */
const KAYNAK_TIPLERI = [
  ['REMUX', /remux/i],
  ['BluRay', /blu-?ray|bd-?rip|br-?rip/i],
  ['WEB-DL', /web[- .]?dl/i],
  ['WEBRip', /web[- .]?rip/i],
  ['HDRip', /hd-?rip/i],
  ['DVDRip', /dvd-?rip/i],
  ['HDTV', /hdtv/i],
  ['CAM', /(?:^|[^a-z0-9])cam(?:[^a-z0-9]|$)/i],
];

/** Torrentio/CloudStream başlığından boyut, seeder, sağlayıcı, dil ve kaynak tipi.
    İşaretler (💾 👤 ⚙) opsiyoneldir; yoksa o alan null/0 döner. */
export function baslikAyristir(baslik) {
  let metin = String(baslik || '');
  // YERLİ/Nuvio meta listeleri başlığa "… | ses: Hindi, Telugu | altyazi: English"
  // olarak gömülür. Bunlar TR ALTYAZI KANITI DEĞİLDİR; "altyazi:" kelimesi
  // /altyaz/ ipucuna takılıp her satıra sahte "TR Altyazı" rozeti basıyordu
  // (kullanıcı 2026-10-29: "TR Altyazı + ORİJİNAL aynı satırda"). Meta
  // bölümleri ayrıştırmadan ÖNCE atılır; sayı özeti zaten satır başlığında.
  metin = metin.replace(/\|\s*ses:\s*[^|]*/gi, ' ').replace(/\|\s*altyazi:\s*[^|]*/gi, ' ');
  metin = metin.replace(/\b(?:ses|altyazi):\s*[^|]*/gi, ' ');
  // "8.85 GB" / "2,1 GB" — 💾 şart değil, birim şart (CloudStream "1080p | 2.1 GB").
  const boyutEslesme = metin.match(/(\d+(?:[.,]\d+)?)\s*(TB|GB|MB)(?![a-z0-9])/i);
  let boyut = null;
  let boyutBayt = 0;
  if (boyutEslesme) {
    const sayi = Number(boyutEslesme[1].replace(',', '.'));
    const birim = boyutEslesme[2].toUpperCase();
    if (Number.isFinite(sayi) && sayi > 0) {
      boyut = `${boyutEslesme[1].replace(',', '.')} ${birim}`;
      boyutBayt = Math.round(sayi * (birim === 'TB' ? 1e12 : birim === 'MB' ? 1e6 : 1e9));
    }
  }
  const seederEslesme = metin.match(/👤\uFE0F?\s*([\d.,]+)/u);
  const seeders = seederEslesme ? Number(seederEslesme[1].replace(/[.,]/g, '')) || 0 : 0;
  // ⚙ ThePirateBay — yalnız harf/rakam/nokta; sonraki emojiye taşmaz.
  const saglayiciEslesme = metin.match(/⚙\uFE0F?\s*([\p{L}\p{N}][\p{L}\p{N} ._-]{0,39})/u);
  const saglayici = saglayiciEslesme ? saglayiciEslesme[1].trim() || null : null;
  // Dil token'ları (kullanıcı 2026-10-28, madde 5): başlıktaki TÜM regional-indicator
  // bayrak çiftleri toplanır (Torrentio/CloudStream başlığı API verisidir; kartta
  // birebir bayrak olarak gösterilir). Bayrak → ülke koduna çevrilir; 🇹🇷 → 'tr'
  // olduğu için eski 'tr' tüketimi (kaynakListesi.dilEtiketleri) bozulmaz.
  // DUAL/SUB/TR kelime ipuçları korunur; mükerrerler silinir; sıra başlıktaki sıradır.
  const dilGirisleri = [];
  for (const bayrak of metin.matchAll(/[\u{1F1E6}-\u{1F1FF}]{2}/gu)) {
    const kod = [...bayrak[0]]
      .map(karakter => String.fromCharCode(karakter.codePointAt(0) - 0x1F1E6 + 65))
      .join('')
      .toLowerCase();
    dilGirisleri.push({ kod, sira: bayrak.index });
  }
  const dualEs = metin.match(/\bdual\b/i);
  if (dualEs) dilGirisleri.push({ kod: 'dual', sira: dualEs.index });
  const trEs = metin.match(/(?:^|[^\p{L}])tr(?:$|[^\p{L}])/iu) || metin.match(/t[üu]rk[çc]e|dublaj|turkish/i);
  if (trEs) dilGirisleri.push({ kod: 'tr', sira: trEs.index });
  const subEs = metin.match(/(?:^|[^\p{L}])sub(?:s|title|titles|bed)?(?:$|[^\p{L}])/iu) || metin.match(/altyaz/i);
  if (subEs) dilGirisleri.push({ kod: 'altyazi', sira: subEs.index });
  const gorulenDil = new Set();
  const diller = dilGirisleri
    .sort((a, b) => a.sira - b.sira)
    .filter(g => !gorulenDil.has(g.kod) && gorulenDil.add(g.kod))
    .map(g => g.kod);
  const kaynakEslesme = KAYNAK_TIPLERI.find(([, desen]) => desen.test(metin));
  return { boyut, boyutBayt, seeders, saglayici, diller, kaynakTipi: kaynakEslesme ? kaynakEslesme[0] : null };
}

/** Tek manifest satırını kaynak satırına çevirir; oynatılamayan satır → null. */
export function satirDonustur(satir, eklenti, sira) {
  if (!satir || typeof satir !== 'object') return null;
  let adres = '';
  if (typeof satir.url === 'string' && satir.url) {
    adres = satir.url;
  } else if (typeof satir.infoHash === 'string' && satir.infoHash) {
    const ad = encodeURIComponent(satir.name || satir.title || 'torrent');
    // ÖLÇÜLEN EKSİK (2026-10-25): eklenti satırları yalnız infoHash verir;
    // izleyici (tracker) listesi satırın "sources" alanında gelir. Aktarılmazsa
    // torrent yalnız DHT'ye kalıyor ve çoğu satır hiç bağlanmıyordu
    // ("satırlar geliyor ama oynatılmıyor").
    const izleyiciler = (Array.isArray(satir.sources) && satir.sources.length
      ? satir.sources
      : VARSAYILAN_IZLEYICILER.map((t) => 'tracker:' + t))
      .filter(x => typeof x === 'string' && x.startsWith('tracker:'))
      .map(x => x.slice('tracker:'.length).trim())
      .filter(Boolean)
      .map(t => `&tr=${encodeURIComponent(t)}`)
      .join('');
    adres = `magnet:?xt=urn:btih:${satir.infoHash}&dn=${ad}${satir.fileIdx != null ? `&fi=${Number(satir.fileIdx) || 0}` : ''}${izleyiciler}`;
  } else if (satir.behaviorHints?.proxyUrl && /^https?:\/\//i.test(satir.behaviorHints.proxyUrl)) {
    try {
      const u = new URL(satir.behaviorHints.proxyUrl);
      adres = u.searchParams.get('url') || u.searchParams.get('gcsUrl') || '';
    } catch (_) { /* çözülemeyen proxy adresi atlanır */ }
  }
  // Yalnız harici sayfa adresi (externalUrl) varsa: tarayıcı oynatıcı yok → elenir.
  if (!adres && typeof satir.externalUrl === 'string' && satir.externalUrl) adres = '';
  if (!adres) return null;

  const istekBasliklari = satir.behaviorHints?.proxyHeaders?.request;
  const basliklar = istekBasliklari && typeof istekBasliklari === 'object'
    ? { ...(istekBasliklari['User-Agent'] ? { 'User-Agent': istekBasliklari['User-Agent'] } : {}), ...(istekBasliklari.Referer ? { Referer: istekBasliklari.Referer } : {}) }
    : undefined;
  const hamBaslik = String(satir.title || satir.name || '');
  const baslik = hamBaslik.replace(/\s+/g, ' ').slice(0, 80);
  return {
    id: `eklenti:${sira}:${String(satir.name || '').length}:${baslik.slice(0, 12)}`,
    streamUrl: adres,
    baslik,
    source: 'Eklenti',
    eklentiAdi: eklenti?.ad || 'Eklenti',
    headers: basliklar,
    isHls: /\.m3u8(\?|#|$)/i.test(adres),
    isDirectVideo: true,
    autoPlayable: !adres.startsWith('magnet:'),
    kalite: /2160|4k/i.test(baslik) ? '4K' : /1080/i.test(baslik) ? '1080p' : /720/i.test(baslik) ? '720p' : 'auto',
    // İşaretler başlığın 80 karakterden sonrasında da olabilir → ham başlıktan ayrıştır.
    // Ham başlık KIRPILMADAN taşınır: dil/ses/altyazı listeleri 80 karakterden
    // sonra geliyor; kırpılmış başlıktan sayı okumak "2 Ses" gibi YANLIŞ özet
    // üretiyordu (kullanıcı 2026-10-29: "Breaking Bad'de 23 dublaj vardı").
    hamBaslik,
    ...baslikAyristir(hamBaslik)
  };
}

/** Kayıtlı tüm eklentilerde yayın arar; satırlar geldikçe geri çağrıyla verilir.
 *  ek param (kullanıcı 2026-10-29): baslik — CloudStream dalı csAra sorgusunu
 *  başlıktan kurar; geçilmezse o dal console.warn ile ATLANIR (imza additive,
 *  mevcut çağrıcılar bozulmaz).
 *  KİMLİK (yol A, kullanıcı 2026-10-29): üç dal da kimliği kimlikCoz kapısından
 *  alır — TMDB→IMDb çözümü burada TEK KEZ yapılır, dallar tekrar sormaz. */
export async function eklentilerdeAra(girdi, geriCagri) {
  const kayitli = eklentilerdeGetirHazir();
  // YERLİ sağlayıcılar kayıttan bağımsızdır (kullanıcı 2026-10-29): boş eklenti
  // listesi yerli taramayı DURDURMAZ.
  const kim = await kimlikCoz(girdi || {});
  let toplam = 0;
  // CLOUDSTREAM DALI (kullanıcı 2026-10-29): cloudstream-repo kayıtları native
  // konakta (window.CinePulseCloudStream) koşar — kayıt yalnız etikettir, canlı
  // sağlayıcı listesi köprüden okunur. Masaüstünde köprü yok → sessiz atlanır
  // (ekleme sırasında neden-temelli mesaj zaten verilmiştir). Başlıksız csAra
  // sorgusu kurulamaz → tmdbId dalındaki nuvio uyarısıyla aynı dürüstlük.
  const csKayitlari = kayitli.filter(e => e.aile === 'cloudstream-repo');
  if (csKayitlari.length) {
    const kopru = csKopruGet();
    if (!kopru) {
      console.warn('[cloudstream] köprü yok — cloudstream-repo kayıtları atlandı (yalnız Android/Capacitor yerli katmanında koşar).');
    } else if (!kim.baslik) {
      console.warn('[cloudstream] başlık geçilmedi — cloudstream taraması atlandı (csAra sorgu olarak başlık ister).');
    } else {
      try {
        toplam += await cloudstreamAra(kopru, { baslik: kim.baslik, tmdbId: kim.tmdbId, tur: kim.tur, sezon: kim.sezon, bolum: kim.bolum }, geriCagri, csKayitlari);
      } catch (e) { console.warn('[cloudstream] tarama hatası:', e?.message || e); }
    }
  }
  // YERLİ NUVİO DALI (kullanıcı 2026-10-29: "video boltu direkt çalıp
  // cinepulse'a ekleyelim … önemli olan türkçe dublaj"): APK'yla paketlenmiş
  // TR dublaj + çok sunuculu scraper'lar — eklenti kaydı gerektirmez,
  // kayıtlı nuvio-depo dalından ÖNCE koşar ki Türkçe satırlar erken aksın.
  // satirKimligi düşüşümü PlayerModal'da: kullanıcı aynı depoyu eklenti olarak
  // de kaydettiyse satırlar üst üste binmez.
  if (kim.tmdbId) {
    const motorY = await nuvioMotorGet();
    if (motorY) {
      try {
        await yerliNuvioTohumla(motorY);
        const kayitY = { ...YERLI_NUVIO_KAYIT, url: yerliTaban() };
        // SAĞLAYICI BAŞINA TEK ZENGİN SATIR (kullanıcı 2026-10-29: "birebir o
        // eklentidekini istiyorum — bir tane kaynak, o da 23 dublaj ve altyazı"):
        // motor sunucu/dil başına satır akıtıyor; biz başlığında en tam ses/
        // altyazı listesi taşıyanı seçip diğerlerini ayıklıyoruz.
        const adayHavuzu = new Map();
        const { hatalar } = await motorY.depodaAra(yerliTaban(), kayitY, {
          tmdbId: kim.tmdbId, mediaType: kim.cekirdekTur, sezon: kim.sezon, bolum: kim.bolum,
        }, (s, scraper) => {
          const satir = nuvioSatir(s, scraper, kayitY);
          if (!satir) return;
          // ETİKET (kullanıcı 2026-10-29: "global cine pulse adıyla koy o
          // ikisini"): yerli PopWatch/VidBolt ayrı başlık açmaz — tek
          // "CinePulse" grubunda toplanır. Kayıtlı depolarda scraper-adı
          // kuralı bozulmadan durur.
          satir.eklentiAdi = 'CinePulse';
          satir.source = 'CinePulse';
          const sag = String(scraper?.ad || scraper?.name || 'Yerli');
          satir.baslik = satir.baslik ? `${sag} · ${satir.baslik}` : sag;
          if (!adayHavuzu.has(sag)) adayHavuzu.set(sag, []);
          adayHavuzu.get(sag).push(satir);
        });
        for (const [sag, havuz] of adayHavuzu) {
          const secim = zenginYerliSatir(havuz);
          if (!secim) continue;
          // TEK ZENGİN SATIR — ham ses/altyazı liste duvarı yerine temiz
          // özet (kullanıcı 2026-10-29: "23 dublaj + 23 altyazı çıkıyordu,
          // birebir eklentideki gibi; şu anki saçmalığı kaldır"). diller
          // bayrakları nuvioSatir'de ham başlıktan ÇOKTAN hesaplandı; yalnız
          // görünen başlık değişir, oynatma verisi (url/baslikAyristir) aynı.
          secim.hamBaslik = secim.hamBaslik || secim.baslik;
          // Havuzun en iyi sayımı (seçilen sunucu dil listesi taşımıyorsa yedek)
          let havuzSes = 0, havuzAltyazi = 0, havuzKalite = '';
          for (const h of havuz) {
            const b = String(h.hamBaslik || h.baslik || '');
            const sn = b.match(/ses:\s*([^|]+)/i);
            const an = b.match(/altyazi:\s*([^|]+)/i);
            const kn = b.match(/(\d{3,4})p/i);
            if (sn) havuzSes = Math.max(havuzSes, String(sn[1]).split(',').filter(x => x.trim()).length + (Number((sn[1].match(/\+(\d+)/) || [])[1]) || 0));
            if (an) havuzAltyazi = Math.max(havuzAltyazi, String(an[1]).split(',').filter(x => x.trim()).length + (Number((an[1].match(/\+(\d+)/) || [])[1]) || 0));
            if (kn && Number(kn[1]) > Number(havuzKalite)) havuzKalite = kn[1];
          }
          secim.baslik = yerliTemizEtiket(sag, secim.hamBaslik, { sesN: havuzSes, altyaziN: havuzAltyazi, kalite: havuzKalite });
          secim.yerliTek = true; // satırda ham dil listesi gösterilmesin
          toplam++;
          try { geriCagri(secim, kayitY); } catch (_) { /* tek satır hatası taramayı bozmaz */ }
        }
        for (const h of (hatalar || []).slice(0, 6)) console.warn('[yerli-nuvio]', h);
      } catch (e) { console.warn('[yerli-nuvio] tarama hatası:', e?.message || e); }
    }
  } else if (kayitli.some(e => e.aile === 'nuvio-depo')) {
    console.warn('[nuvio] tmdbId yok — nuvio-depo kayıtları atlandı (Nuvio getStreams tmdbId ister, imdbId yetmez).');
  }
  // NUVO DEPO DALI (kullanıcı 2026-10-29): scrapers[] JS'leri nuvioMotoru
  // sandbox'ında koşar. Nuvio sözleşmesi tmdbId ister — tmdbId yoksa bu kayıtlar
  // ATLANIR (imdbId yetmez), sessiz değil console.warn ile. Ayrı motor örneği
  // fetch'i vekilden (kopruFetch) alır: WebView'da düz fetch sitelerin CORS'unda
  // patlar; vekil istekleri /api proxy'den geçirir. Vekil importu dinamik:
  // eklentiServisi → vekil → (ileride geri) döngı riski + soL yükleme bedeli yok.
  const nuvioKayitlari = kayitli.filter(e => e.aile === 'nuvio-depo');
  if (nuvioKayitlari.length) {
    if (!kim.tmdbId) {
      console.warn('[nuvio] tmdbId yok — nuvio-depo kayıtları atlandı (Nuvio getStreams tmdbId ister, imdbId yetmez).');
    } else {
      const motor = await nuvioMotorGet();
      if (motor) {
        await Promise.allSettled(nuvioKayitlari.map(async (ek) => {
          const { hatalar } = await motor.depodaAra(ek.url, ek, {
            tmdbId: kim.tmdbId, mediaType: kim.cekirdekTur, sezon: kim.sezon, bolum: kim.bolum,
          }, (s, scraper) => {
            const satir = nuvioSatir(s, scraper, ek);
            if (satir) { toplam++; try { geriCagri(satir, ek); } catch (_) {} }
          });
          for (const h of hatalar) console.warn('[nuvio]', ek.ad, '—', h);
        }));
      }
    }
  }
  const stremioKayitlari = kayitli.filter(e => e.aile !== 'nuvio-depo' && e.aile !== 'cloudstream-repo');
  if (!stremioKayitlari.length) return toplam;
  // Kimlik kapısı yukarıda çözüldü: imdb varsa o, yoksa tmdb:n yedeği — anahtar
  // biçimi (tv: tt…:S:E) kim.anahtar'da tek yerde üretilir.
  if (!kim.anahtar) return toplam;
  const kategori = kim.tur === 'series' ? 'series' : 'movie';
  const anahtar = kim.anahtar;
  await Promise.allSettled(stremioKayitlari.map(async (ek, i) => {
    const adres = `${eklentiTabani(ek.url)}/stream/${kategori}/${encodeURIComponent(anahtar)}.json`;
    const yanit = await fetch(adres, { signal: AbortSignal.timeout(10000) });
    if (!yanit.ok) return;
    const veri = await yanit.json().catch(() => null);
    for (const s of (veri?.streams || []).slice(0, 12)) {
      const satir = satirDonustur(s, ek, i);
      if (satir) {
        toplam++;
        try { geriCagri(satir, ek); } catch (_) { /* tek satır hatası taramayı bozmaz */ }
      }
    }
  }));
  return toplam;
}

/* Nuvio motoru tek örneği: fetch'i vekilin kopruFetch'i ile kurulur (CORS
   köprüsü + CF challenge). Vekile ulaşılamazsa (test/Node) natif fetch'e düşer
   — nuvioMotoru fetchImpl'siz de çalışır. */
let NUVIO_MOTOR = null;
let NUVIO_KURULUM = null;
function nuvioMotorGet() {
  if (NUVIO_MOTOR) return Promise.resolve(NUVIO_MOTOR);
  if (!NUVIO_KURULUM) {
    // Node/test ortamı (window yok): köprü rotaları (/api/…) burada çözülmez —
    // vekilin kendi sözleşmesi gibi natif fetch'e düş (vekil.js:273 notu).
    const pencereVar = typeof window !== 'undefined';
    NUVIO_KURULUM = pencereVar
      ? import('../../providers/vekil.js')
        .then(({ kopruFetch }) => { NUVIO_MOTOR = nuvioMotoru({ fetchImpl: kopruFetch }); return NUVIO_MOTOR; })
        .catch(() => {
          try { NUVIO_MOTOR = nuvioMotoru({}); } catch (_) { NUVIO_MOTOR = null; }
          return NUVIO_MOTOR;
        })
      : (async () => {
          try { NUVIO_MOTOR = nuvioMotoru({}); } catch (_) { NUVIO_MOTOR = null; }
          return NUVIO_MOTOR;
        })();
  }
  return NUVIO_KURULUM;
}

/** Nuvio satır ham nesnesini CinePulse kaynak satırına çevirir (satirDonustur
    sözleşmesi). HER SCRAPER KENDİ ADIYLA grup olur: source ve eklentiAdi =
    scraper adı — kaynakListesi grup başlığını eklentiAdi'nden alır (kullanıcı
    isteği, 2026-10-29). */
function nuvioSatir(s, scraper, ek) {
  if (!s || !s.url) return null;
  const ad = scraper?.ad || ek?.ad || 'Nuvio';
  const ham = String(s.hamBaslik || s.baslik || ad).replace(/\s+/g, ' ');
  // TR SES/ALTYAZI KANITI sağlayıcının kendi master listesinden okunur
  // ("ses: … Turkish …" / "altyazi: … Turkish …"). Bu, doğrulanmış veridir
  // (m3u8 EXT-X-MEDIA satırı) — bayrak rozeti ve "dublaj en üstte" sıralaması
  // buna dayanır. Uydurma yok: yalnız listede Turkish geçiyorsa işaretlenir.
  const sesListe = (ham.match(/ses:\s*([^|]+)/i) || [])[1] || '';
  const altyaziListe = (ham.match(/altyazi:\s*([^|]+)/i) || [])[1] || '';
  const trSesKanit = /\bt[uü]rk(?:ish|çe|ce)?\b/i.test(sesListe);
  const trAltyaziKanit = /\bt[uü]rk(?:ish|çe|ce)?\b/i.test(altyaziListe);
  const ayrilan = baslikAyristir(ham);
  const diller = Array.isArray(ayrilan.diller) ? [...ayrilan.diller] : [];
  if (trSesKanit && !diller.includes('tr')) diller.push('tr');
  if (!trSesKanit && trAltyaziKanit && !diller.includes('altyazi')) diller.push('altyazi');
  return {
    id: `nuvio:${scraper?.id || ad}:${s.url.slice(-40)}`,
    streamUrl: s.url,
    baslik: s.baslik || ad,
    // KIRPILMAMIŞ başlık korunur — ses/altyazı listeleri 80 karakterden sonra
    // geliyor; kırpık başlıktan sayı okumak yanlış "2 Ses" özeti üretiyordu.
    hamBaslik: ham,
    source: ad,
    eklentiAdi: ad,
    headers: s.headers,
    isHls: s.isHls,
    isDirectVideo: true,
    autoPlayable: true,
    kalite: s.kalite || 'auto',
    ...ayrilan,
    diller,
    ...(trSesKanit ? { trSes: true, isDual: true, dilDurumu: 'dublaj' } : {}),
    ...(!trSesKanit && trAltyaziKanit ? { trAltyazi: true } : {}),
  };
}

function eklentilerdeGetirHazir() { return eklentileriGetir(); }

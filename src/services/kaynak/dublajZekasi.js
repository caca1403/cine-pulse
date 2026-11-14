/* ==========================================================================
   DUBLAJ ZEKÂSI — uygulama entegrasyon katmanı
   --------------------------------------------------------------------------
   `dublajSicili.js` saf motor, `multiDubEndgame.js` yıldızlı arşiv adaptörleri.
   Bu modül ikisini UYGULAMAYA bağlar:
     · sicili depodan yükler (kalıcı) + paketlenmiş tohumu bir kez aktarır,
     · kaynak listesini TR dublaj siciline göre sıralar,
     · oynatma başarı/başarısızlığını sicile geri besler (kendini onarma),
     · arka planda yıldız arşivini tarayıp sicili zenginleştirir.

   TASARIM: hepsi "best effort". Ağ yoksa, depo doluysa, modül yüklenemezse
   uygulama davranışı DEĞİŞMEZ — dublaj zekâsı yalnız sıralamayı iyileştirir.
   ========================================================================== */

import {
  sicilBos, sicilYukle, sicilKaydet, sicileGoreSirala, kaynakPuani, kanitIsle,
  oynatmaBasarili, oynatmaBasarisiz, sicilIpucu, taramaSirasi,
  tohumdanSicil, siciliKirp, sicilOzeti, icerikAnahtari,
} from '../dogrudan/dublajSicili.js';
import { yildizArsiviTara, yildizKaynakMi } from '../dogrudan/multiDubEndgame.js';
import { hostHashla } from '../dogrudan/dublajArsivi.js';

/* ── Yıldız sağlayıcı host'ları (tohum eşlemesi için) ─────────────────────── */
/* Tohum (public/dublaj-arsivi/arsiv.json) host'ları HASH'lenmiş taşır. Hangi
   hash'in hangi yıldız kaynağa ait olduğunu bulmak için aday host biçimlerini
   hash'leyip arşivde ararız — böylece elle eşleme yanlışlığı olmaz. */
const YILDIZ_HOST_ADAYLARI = {
  'star:hdfc': ['www.hdfilmcehennemi.nl', 'hdfilmcehennemi.nl'],
  'star:selcukflix': ['selcukflix.app', 'www.selcukflix.app'],
  'star:dizilla': ['dizilla.la', 'www.dizilla.la', 'dizilla.now'],
  'star:filmmakinesi': ['filmmakinesi.to', 'www.filmmakinesi.to'],
};

/**
 * Tohumdaki hash'lenmiş `kaynakKok` değerlerinden yıldız sağlayıcı eşlemesi
 * üretir. Eşleşmeyen kok atlanır (uydurma yok).
 * @param {Array} kayitlar arsiv.json kayıtları
 * @returns {Object<string,string>} hash → 'star:xxx'
 */
export function tohumKokKodlari(kayitlar) {
  const kumede = new Set((Array.isArray(kayitlar) ? kayitlar : [])
    .map((k) => String(k?.kaynakKok || '')).filter(Boolean));
  const harita = {};
  for (const [kod, hostlar] of Object.entries(YILDIZ_HOST_ADAYLARI)) {
    for (const host of hostlar) {
      const h = hostHashla(host);
      if (kumede.has(h)) { harita[h] = kod; break; }
    }
  }
  return harita;
}

/* ── Depo (cihazda kalır) ─────────────────────────────────────────────────── */

const TOHUM_YUKLENDI_ANAHTARI = 'cp_dublaj_tohum_v1';

function depoAl() {
  try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch (_) { return null; }
}

/** Süreç içi tekil sicil (her çağrıda yeniden ayrıştırma yok). */
let SICIL = null;
let tohumDenendi = false;

/** Sicili döndürür (gerekirse depodan yükler). */
/**
 * Sağlayıcı öneklerini kayıt tablosundan yükler. Çağıran: uygulama açılışı
 * (dublaj zekâsı kurulumu). Ağ hatası olursa sessizce döner — önek listesi
 * olmadan da sıralama çalışır (yalnız kaba eşleşme).
 * @returns {Promise<number>} yüklenen önek sayısı
 */
export async function onekleriYukle() {
  try {
    const { KAYIT } = await import('../../providers/kayit.js');
    const onekler = [...KAYIT.values()].map((k) => k.onek).filter(Boolean);
    saglayiciOnekleriniAyarla(onekler);
    return onekler.length;
  } catch (_) { return 0; }
}

/** Sicili döndürür (gerekirse depodan yükler). */
export function sicil() {
  if (!SICIL) SICIL = sicilYukle(depoAl());
  return SICIL;
}

/** Değişiklikleri depoya yazar (sığ tutarak). */
export function sicilKaydetSimdi() {
  const s = sicil();
  siciliKirp(s, { enFazlaIcerik: 4000 });
  return sicilKaydet(depoAl(), s);
}

/** Test/teşhis: bellekteki sicili sıfırlar. */
export function siciliSifirla() {
  SICIL = sicilBos();
  tohumDenendi = false;
}

/* ── Tohum: paketle gelen ölçümleri bir kez aktar ─────────────────────────── */

/**
 * Paketle gelen TR dublaj kanıt tohumunu (`public/dublaj-tohum.json`) sicile
 * aktarır. Tohum `tools/dublaj-tohum-derle.mjs` ile canlı m3u8 ölçümlerinden
 * üretilir: her kayıt (içerik, sağlayıcı, gerçek `tr` ses kanıtı) taşır.
 *
 * İki kaynak denenir, sırayla:
 *   1) `/dublaj-tohum.json` — doğrudan sağlayıcı alanlı, tercih edilen biçim.
 *   2) `/dublaj-arsivi/arsiv.json` — eski hash'lenmiş arşiv (geriye uyum);
 *      sağlayıcı çoğu zaman çözülemez → `arsiv:tohum` toplayıcısına yazılır ve
 *      İÇERİK kanıtı olarak `icerikOnseli` tarafından kullanılır.
 *
 * Başarısız olursa sessizce döner; bir sonraki açılışta yeniden denenir.
 * @returns {Promise<number>} aktarılan kayıt sayısı
 */
export async function tohumuYukle({ fetchFn = globalThis.fetch, zorla = false } = {}) {
  const d = depoAl();
  if (!zorla && d?.getItem?.(TOHUM_YUKLENDI_ANAHTARI)) return 0;
  if (!zorla && tohumDenendi) return 0;
  tohumDenendi = true;
  const simdi = Date.now();
  const zamanAsimi = () => (AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined);

  /* 1) Doğrudan biçim: kayıtlar `saglayici` alanını taşır. */
  try {
    const y = await fetchFn('/dublaj-tohum.json', { signal: zamanAsimi() });
    if (y && y.ok) {
      const tohum = await y.json();
      let n = 0;
      for (const k of Array.isArray(tohum?.kayitlar) ? tohum.kayitlar : []) {
        if (!k?.saglayici || !String(k?.tmdbId ?? '').trim()) continue;
        const r = kanitIsle(sicil(), {
          tmdbTip: k.tmdbTip,
          tmdbId: k.tmdbId,
          sezon: k.sezon,
          bolum: k.bolum,
          saglayici: k.saglayici,
          dilDurumu: k.dilDurumu,
          kanit: k.kanit,
          diller: k.diller,
          sonGorulme: Number(k.sonGorulme) || simdi,
        });
        if (r.durum !== 'korundu') n += 1;
      }
      if (n > 0) { sicilKaydetSimdi(); d?.setItem?.(TOHUM_YUKLENDI_ANAHTARI, String(simdi)); }
      return n;
    }
  } catch (_) { /* ikinci kaynağa düş */ }

  /* 2) Geriye uyum: hash'lenmiş eski arşiv. */
  try {
    const y = await fetchFn('/dublaj-arsivi/arsiv.json', { signal: zamanAsimi() });
    if (!y || !y.ok) return 0;
    const tohum = await y.json();
    const kokKodlari = tohumKokKodlari(tohum?.kayitlar);
    const n = tohumdanSicil(sicil(), tohum, { kokKodlari, simdi });
    if (n > 0) { sicilKaydetSimdi(); d?.setItem?.(TOHUM_YUKLENDI_ANAHTARI, String(simdi)); }
    return n;
  } catch (_) { return 0; }
}

/* ── Sıralama ─────────────────────────────────────────────────────────────── */

/* Kayıt tablosundaki sağlayıcı önekleri (en uzun eşleşme için, uzun→kısa).
   ÖLÇÜLEN HATA (2026-11-14): kaba `^([a-z0-9]+_)` kalıbı `sp_hulk_...` id'sinden
   yalnız `sp_` çıkarıyordu; sicildeki anahtar `sp_hulk_` olduğu için hiçbir
   kaynak eşleşmiyor ve sıralama sessizce etkisiz kalıyordu. Önek listesi
   KAYIT tablosundan gelir; tablo yoksa (test/çevrimdışı) sabit yedeğe düşülür. */
let ONEKLER = null;
function onekListesi() {
  if (ONEKLER) return ONEKLER;
  const kume = new Set();
  try {
    /* KAYIT'ı import etmek modül yüklenirken bir ağ isteği (aria anahtarı)
       tetikleyebilir; dublajZekasi zaten uygulama bağlamında yükleniyor.
       Bu yüzden dinamik değil, üst düzey import kullanılmıyor: `onekListesi`
       yalnız gerektiğinde çağrılır ve hata sessizce yedeğe düşer. */
    const kayit = globalThis.__cpKayitOnekleri;
    if (Array.isArray(kayit)) for (const o of kayit) kume.add(String(o));
  } catch (_) { /* yedek aşağıda */ }
  ONEKLER = [...kume].filter(Boolean).sort((a, b) => b.length - a.length);
  return ONEKLER;
}

/** Kayıt tablosundan gelen önek listesini kaydeder (uygulama açılışında çağrılır). */
export function saglayiciOnekleriniAyarla(onekler) {
  ONEKLER = null;
  try {
    globalThis.__cpKayitOnekleri = [...(Array.isArray(onekler) ? onekler : [])]
      .map((o) => String(o || '')).filter((o) => o.length >= 3);
  } catch (_) { /* yok sayılır */ }
  return onekListesi();
}

/** Kaynağın sağlayıcı anahtarı: yıldız kaynakları `star:*`, çekirdekler önekiyle. */
export function saglayiciAnahtari(kaynak) {
  const id = String(kaynak?.id || kaynak?.source || '').toLowerCase();
  if (yildizKaynakMi(id)) return id;
  /* EN UZUN önek eşleşmesi: `sp_hulk_` > `sp_`. Böylece sicildeki sağlayıcı
     anahtarı ile kaynak id'si aynı aileyi gösterir. */
  for (const onek of onekListesi()) {
    if (id.startsWith(onek)) return onek;
  }
  // Önek bilinmiyorsa (yeni çekirdek): ilk '_' sonrasına kadar al — en azından
  // sabit bir anahtar üretilsin, uydurma sağlayıcı atfı yapılmaz.
  const m = id.match(/^([a-z0-9]+_[a-z0-9]+_)/);
  if (m) return m[1];
  const m2 = id.match(/^([a-z0-9]+_)/);
  return m2 ? m2[1] : id.slice(0, 24);
}

/**
 * Kaynak listesini TR dublaj zekâsına göre sıralar. Girdi DEĞİŞTİRİLMEZ.
 * Sicil boşsa liste aynen döner (ilk açılışta davranış değişmez).
 */
export function dublajaGoreSirala(liste, icerik) {
  const dizi = Array.isArray(liste) ? liste : [];
  const s = sicil();
  if (!s || !Object.keys(s.icerikler || {}).length) return dizi;
  const adaylar = dizi.map((k) => ({
    ...k,
    saglayici: k.saglayici || saglayiciAnahtari(k),
  }));
  const sirali = sicileGoreSirala(adaylar, s, icerik, { simdi: Date.now() });
  // `saglayici` ek alanını dışa sızdırma (tüketici sözleşmesi değişmesin).
  return sirali.map(({ saglayici, ...kalan }) => kalan);
}

/** İçerik anahtarı kısayolu (aggregator'ın cacheKey'i ile aynı biçimde değil,
 *  TMDB tabanlı standart anahtar). */
export function icerikAnahtariOlustur({ type, tmdbId, season, episode }) {
  return icerikAnahtari({
    tmdbTip: type, tmdbId, sezon: season, bolum: episode,
  });
}

/* ── Oynatma geri bildirimi (kendini onarma) ──────────────────────────────── */

/**
 * Oynatma sonucunu sicile yazar. Hata durumunda bile fırlatmaz.
 * @param {{basarili: boolean, icerik: string, kaynak: object}} olay
 */
export function oynatmaGeriBildir({ basarili, icerik, kaynak, simdi = Date.now() }) {
  try {
    const saglayici = saglayiciAnahtari(kaynak);
    if (!icerik || !saglayici) return false;
    const fn = basarili ? oynatmaBasarili : oynatmaBasarisiz;
    fn(sicil(), { icerik, saglayici, simdi });
    sicilKaydetSimdi();
    return true;
  } catch (_) { return false; }
}

/* ── Arka plan zenginleştirme ─────────────────────────────────────────────── */

/** Aynı içerik için kısa süre içinde tekrar tarama yapılmasın. */
const sonTaramalar = new Map();
const TARAMA_COOLDOWN_MS = 10 * 60 * 1000;

/**
 * Yıldız arşivini arka planda tarar; sonucu sicile yazar. Oynatmayı BLOKLAMAZ.
 * @returns {Promise<{atlandi?: boolean, adaySayisi?: number}>}
 */
export async function arkaPlandaZenginlestir(hedef, { fetchFn = null, zorla = false } = {}) {
  try {
    let aktifFetch = fetchFn;
    if (!aktifFetch) {
      if (typeof window !== 'undefined') {
        try {
          const { kopruFetch } = await import('../../providers/vekil.js');
          aktifFetch = kopruFetch;
        } catch (_) {
          aktifFetch = globalThis.fetch;
        }
      } else {
        aktifFetch = globalThis.fetch;
      }
    }
    const icerik = icerikAnahtariOlustur({
      type: hedef?.tmdbTip || hedef?.type,
      tmdbId: hedef?.tmdbId || hedef?.id,
      season: hedef?.sezon ?? hedef?.season,
      episode: hedef?.bolum ?? hedef?.episode,
    });
    const onceki = sonTaramalar.get(icerik) || 0;
    if (!zorla && Date.now() - onceki < TARAMA_COOLDOWN_MS) return { atlandi: true };
    sonTaramalar.set(icerik, Date.now());
    const r = await yildizArsiviTara({
      baslik: hedef?.baslik || hedef?.title,
      orijinalBaslik: hedef?.orijinalBaslik || hedef?.originalTitle,
      imdb: hedef?.imdb || hedef?.imdbId,
      yil: hedef?.yil || hedef?.year,
      tmdbTip: hedef?.tmdbTip || hedef?.type,
      tmdbId: hedef?.tmdbId || hedef?.id,
      simdi: Date.now(),
    }, { fetchFn: aktifFetch, sicil: sicil() });
    if (r.adaylar.length) sicilKaydetSimdi();
    return { adaySayisi: r.adaylar.length, eslesen: r.eslesen.length, kaynakDurumu: r.kaynakDurumu };
  } catch (_) { return { atlandi: true, hata: true }; }
}

/* ── Teşhis ───────────────────────────────────────────────────────────────── */

/** Sicil + ipuçlarını tek nesnede döndürür (ayar/teşhis ekranı için). */
export function dublajZekaDurumu(icerik) {
  const s = sicil();
  return {
    ozet: sicilOzeti(s),
    ipuclari: icerik ? sicilIpucu(s, icerik, { simdi: Date.now(), limit: 8 }) : [],
  };
}

/** Sağlayıcı arama sırasını TR dublaj önseline göre düzenler. */
export function akilliTaramaSirasi(saglayicilar) {
  return taramaSirasi(sicil(), saglayicilar);
}

export { kaynakPuani };

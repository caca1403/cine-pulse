/* ==========================================================================
   TR DUBLAJ SİCİLİ — kalıcı kanıt defteri, kanıt kalıtımı, kendini onarma
   --------------------------------------------------------------------------
   SORUN: dublaj kanıtı (m3u8'de gerçek `tr` ses izi) bugüne kadar yalnız
   "anlık ölçüm" olarak kullanıldı. Uygulama kapandığında kanıt kayboluyor,
   aynı başlık için her açılışta sıfırdan tarama yapılıyor, ölü çekirdekler
   yine baştan deneniyordu. Sonuç: kanıtlanmış Türkçe dublaj kaynağı varken
   kullanıcı yanlış (özgün dilli) kaynağı ilk sırada görebiliyordu.

   ÇÖZÜM (bu modül):
     1) SİCİL — (içerik, sağlayıcı) ikilisi için kanıtı KALICI olarak tutar.
        İçerik anahtarı TMDB tipi+kimi+sezon+bölüm'dür; sağlayıcı arayüzde
        zaten görünen anonim önek (sp_hulk_) veya hash'lenmiş host'tur.
        Gerçek site adı bu modülde de yoktur — projedeki mevcut kural.
     2) KANIT KALITIMI (yeni fikir) — bir sağlayıcı N başlıkta gerçek `tr`
        ses izi kanıtladıysa, o sağlayıcının HENÜZ ÖLÇÜLMEMİŞ başlıkları
        için "TR dublaj önsel olasılığı" hesaplanır. Böylece uygulama siteye
        hiç gitmeden, hangi sağlayıcıdan Türkçe dublaj çıkma ihtimalinin
        yüksek olduğunu bilir ve taramayı oraya yoğunlaştırır. Dublaj bir
        YAYIN özelliğidir, site özelliği değil: kanıt sağlayıcı ailesi
        içinde kalıtılır, aile değişince (ayna taşınması) sicil host'u
        hash üzerinden eşleyip kanıtı yeni alan adına taşır.
     3) KENDİNİ ONARMA — oynatma başarısı/başarısızlığı sicile geri beslenir.
        Başarılı kaynak yükselir, üst üste düşen kaynak düşer; kanıt yaşı
        yarılanma ömrüyle (45 gün) solar, ama SİLİNMEZ (tarihsel güven).
        Böylece "site tamamen çökmediği sürece kaynak bozulmaz" kuralı
        kanıt düzeyinde de geçerli olur.
     4) TOHUM — depo ile gelen `public/dublaj-arsivi/arsiv.json` (hash'lenmiş
        ölçümler) açılışta sicile aktarılır. Yeni kurulum bile "akıllı"
        başlar; ilk açılışta hiçbir siteye gitmeden TR dublaj eğilimi bilinir.

   Ağ bağımlılığı YOKTUR: saf işlevler + depo enjeksiyonu. Zaman da enjekte
   edilir (simdi), böylece testler saate bağlı kırılmaz.
   Çalıştır: node --test tests/dublaj-sicili.test.mjs
   ========================================================================== */

import { hostHashla } from './dublajArsivi.js';

export const SICIL_SURUMU = 1;

/** Depo anahtarı (cihazda kalır; hiçbir yere gönderilmez). */
export const SICIL_DEPO_ANAHTARI = 'cp_dublaj_sicili_v1';

/** Kanıt yaşı: yarılanma ömrü. Bu süreden eski kanıt sıfıra yaklaşır ama
 *  kayıt SİLİNMEZ — sağlayıcının tarihsel dublaj güveni olarak kalır. */
export const KANIT_YARILANMA_MS = 45 * 24 * 60 * 60 * 1000;

/** Başarısızlık sayacının soğuma süresi: bu süre boyunca yeni başarısızlık
 *  gelmezse sayaç yarıya iner (tek seferlik ağ hatası kaynağı sonsuza kadar
 *  damgalamasın). */
export const HATA_SOGUMA_MS = 14 * 24 * 60 * 60 * 1000;

const GECERLI_DURUMLAR = new Set(['dublaj', 'altyazi', 'orijinal', 'bilinmiyor']);
const KANIT_GUCU = { m3u8: 4, ts: 4, mp4: 3, mkv: 3, etiket: 1, yok: 0 };

/** Sıralama ağırlıkları — tek yerde toplandı ki testte/ölçümde ayarlanabilsin. */
export const AGIRLIKLAR = Object.freeze({
  durum: { dublaj: 70, altyazi: 15, orijinal: -25, bilinmiyor: 0 },
  kanit: { m3u8: 14, ts: 14, mp4: 12, mkv: 12, etiket: 3, yok: 0 },
  onsel: 30,        // sağlayıcı TR-dublaj önseli (0..1) × bu
  icerik: 25,       // bu içerikteki doğrudan kanıt (tazelikle çarpılır)
  basari: 12,       // oynatma başarı oranı katkısı
  hata: -18,        // oynatma başarısızlık katkısı
  eskiIcerik: -8,   // 180 günden eski içerik kanıtı cezası
  icerikOnsel: 22,  // İÇERİK düzeyinde TR dublaj kanıtı (sağlayıcıdan bağımsız)
});

/* ── İçerik anahtarı ──────────────────────────────────────────────────────── */

/** (tür, kimlik, sezon, bölüm) → kararlı içerik anahtarı.
 *  Film: "movie|550||"; dizi: "tv|1399|1|1". */
export function icerikAnahtari(x) {
  const tip = String(x?.tmdbTip ?? x?.type ?? 'movie').trim().toLowerCase() || 'movie';
  const kimlik = String(x?.tmdbId ?? x?.id ?? '').trim();
  const sezon = x?.sezon ?? x?.season;
  const bolum = x?.bolum ?? x?.episode;
  return `${tip}|${kimlik}|${sezon == null ? '' : sezon}|${bolum == null ? '' : bolum}`;
}

/** İçerik anahtarını çözer. Bozuk anahtar → null. */
export function icerikCoz(anahtar) {
  const p = String(anahtar || '').split('|');
  if (p.length !== 4) return null;
  return {
    tmdbTip: p[0],
    tmdbId: p[1],
    sezon: p[2] === '' ? null : p[2],
    bolum: p[3] === '' ? null : p[3],
  };
}

/* ── Sicil iskeleti ───────────────────────────────────────────────────────── */

/** Boş sicil. `icerikler`: anahtar → { saglayicilar: {kok: kayit}, guncelleme }
 *  `saglayicilar`: kok → { dublaj, altyazi, orijinal, bilinmiyor, son } */
export function sicilBos() {
  return { surum: SICIL_SURUMU, icerikler: {}, saglayicilar: {}, guncelleme: 0 };
}

function sayacKur() {
  return { dublaj: 0, altyazi: 0, orijinal: 0, bilinmiyor: 0, son: 0 };
}

/** Sağlayıcı anahtarını normalize eder (boş → ''). */
function saglayiciAnahtari(deger) {
  return String(deger ?? '').trim().toLowerCase();
}

/* ── Kanıt işleme ─────────────────────────────────────────────────────────── */

/**
 * Bir ölçümü sicile yazar. Aynı (içerik, sağlayıcı) için daha güçlü kanıt
 * eskisini ezer; eşit güçte tazesi kazanır. Ölçüm daha zayıfsa yalnız
 * sayaç/son görülme güncellenir (kanıt geriye gitmez).
 * @returns {{ durum: 'eklendi'|'guncellendi'|'korundu', kayit: object }}
 */
export function kanitIsle(sicil, olcum) {
  if (!sicil || typeof sicil !== 'object') throw new Error('sicil-yok');
  const o = olcum || {};
  const anahtar = icerikAnahtari(o);
  const saglayici = saglayiciAnahtari(o.saglayici);
  if (!saglayici || !String(o.tmdbId ?? '').trim()) {
    return { durum: 'korundu', kayit: null };
  }
  const dilDurumu = GECERLI_DURUMLAR.has(String(o.dilDurumu || '').toLowerCase())
    ? String(o.dilDurumu).toLowerCase()
    : 'bilinmiyor';
  const kanit = Object.prototype.hasOwnProperty.call(KANIT_GUCU, String(o.kanit || '').toLowerCase())
    ? String(o.kanit).toLowerCase()
    : 'yok';
  /* KURAL (dublajArsivi ile aynı): 'dublaj'/'orijinal' iddiası medya okuması
     olmadan yazılmaz. Etiket kanıt sayılmaz — yanlış pozitif dublaj, kullanıcıyı
     yanlış kaynağa götürmekten daha pahalıdır. */
  const medyaKaniti = KANIT_GUCU[kanit] >= 3;
  const durum = (dilDurumu === 'dublaj' || dilDurumu === 'orijinal') && !medyaKaniti
    ? 'bilinmiyor'
    : dilDurumu;
  const diller = [...new Set((Array.isArray(o.diller) ? o.diller : [])
    .map((d) => String(d || '').trim().toLowerCase())
    .filter((d) => /^[a-z]{2}$/.test(d)))];

  const yeni = {
    dilDurumu: durum,
    kanit,
    diller,
    sonGorulme: Number(o.sonGorulme) || Number(o.simdi) || 0,
    basari: 0,
    basarisizlik: 0,
    sonHata: 0,
  };

  if (!sicil.icerikler[anahtar]) sicil.icerikler[anahtar] = { saglayicilar: {}, guncelleme: 0 };
  const icerik = sicil.icerikler[anahtar];
  const mevcut = icerik.saglayicilar[saglayici];

  let sonuc = 'eklendi';
  if (mevcut) {
    const eskiGuc = KANIT_GUCU[mevcut.kanit] ?? 0;
    const yeniGuc = KANIT_GUCU[kanit] ?? 0;
    const dahaGuclu = yeniGuc > eskiGuc;
    const esitVeTaze = yeniGuc === eskiGuc && yeni.sonGorulme >= (mevcut.sonGorulme || 0);
    if (dahaGuclu || esitVeTaze) {
      icerik.saglayicilar[saglayici] = {
        ...mevcut,
        ...yeni,
        basari: mevcut.basari || 0,
        basarisizlik: mevcut.basarisizlik || 0,
        sonHata: mevcut.sonHata || 0,
      };
      sonuc = 'guncellendi';
    } else {
      // Daha zayıf kanıt: yalnız "son görülme" tazelenir, iddia korunur.
      mevcut.sonGorulme = Math.max(mevcut.sonGorulme || 0, yeni.sonGorulme);
      sonuc = 'korundu';
    }
  } else {
    icerik.saglayicilar[saglayici] = yeni;
  }

  icerik.guncelleme = Math.max(icerik.guncelleme || 0, yeni.sonGorulme);
  sicil.guncelleme = Math.max(sicil.guncelleme || 0, yeni.sonGorulme);

  /* Sağlayıcı önseli: her ölçüm sayaca yazılır (kanıt zayıfsa da "bilinmiyor"
     sayılır → önseli bozmaz, yalnız bilgi ekler). */
  if (!sicil.saglayicilar[saglayici]) sicil.saglayicilar[saglayici] = sayacKur();
  const sayac = sicil.saglayicilar[saglayici];
  const oncekiDurum = mevcut?.dilDurumu;
  /* Aynı ölçüm iki kez sayılmasın: önceki durum ile yeni durum aynıysa
     sayacı artırma, yalnız 'son'u tazele. */
  if (oncekiDurum && oncekiDurum === durum) {
    sayac.son = Math.max(sayac.son || 0, yeni.sonGorulme);
  } else {
    if (oncekiDurum && sayac[oncekiDurum] > 0) sayac[oncekiDurum] -= 1;
    sayac[durum] = (sayac[durum] || 0) + 1;
    sayac.son = Math.max(sayac.son || 0, yeni.sonGorulme);
  }

  return { durum: sonuc, kayit: icerik.saglayicilar[saglayici] };
}

/* ── Kanıt kalıtımı: sağlayıcı TR-dublaj önseli ───────────────────────────── */

/**
 * Sağlayıcının TR dublaj önseli (0..1) + güven (0..1).
 * Örnek sayısı azsa güven düşer: 1 kanıt = 0.33 güven, 3+ kanıt = 1.
 * 'bilinmiyor' kayıtlar paydaya girmez (ölçülemedi ≠ dublaj yok).
 */
export function saglayiciOnseli(sicil, saglayici) {
  const s = sicil?.saglayicilar?.[saglayiciAnahtari(saglayici)];
  if (!s) return { onsel: 0, guven: 0, ornek: 0 };
  const tr = Number(s.dublaj) || 0;
  const altyazi = Number(s.altyazi) || 0;
  const orijinal = Number(s.orijinal) || 0;
  const ornek = tr + altyazi + orijinal;
  if (!ornek) return { onsel: 0, guven: 0, ornek: 0 };
  /* Dublaj oranı; altyazılı yayın "TR içerik var" demektir ama ses Türkçe
     değildir → yarım puan. Orijinal dil 0 sayılır. */
  const onsel = Math.min(1, (tr + altyazi * 0.25) / ornek);
  const guven = Math.min(1, ornek / 3);
  return { onsel, guven, ornek, tr, altyazi, orijinal };
}

/** Kanıt tazelik çarpanı: 1 (taze) → 0 (çok eski). Üstel yarılanma. */
export function tazelik(simdi, sonGorulme, yarilanmaMs = KANIT_YARILANMA_MS) {
  if (!sonGorulme) return 0;
  const yas = Math.max(0, Number(simdi) - Number(sonGorulme));
  return Math.pow(0.5, yas / Math.max(1, yarilanmaMs));
}

/**
 * İÇERİK düzeyinde TR dublaj önseli (0..1): sağlayıcıdan BAĞIMSIZ.
 * Gerekçe: dublaj bir YAYIN özelliğidir. Bir içerikte herhangi bir kaynakta
 * gerçek `tr` ses izi kanıtlandıysa, aynı içeriğin diğer kaynaklarında da
 * Türkçe ses çıkma olasılığı yüksektir (aynı dublaj stüdyosu/iş akışı).
 * Ölçümler CDN host'ları üzerinden geldiği için sağlayıcı eşlemesi çoğu
 * zaman bilinmez; bu katman o bilgi kaybını telafi eder.
 * Kanıt gücü ve tazelikle ağırlıklanır; 'bilinmiyor' katkı vermez.
 */
export function icerikOnseli(sicil, icerik, { simdi = 0 } = {}) {
  const blok = sicil?.icerikler?.[icerik]?.saglayicilar;
  if (!blok) return 0;
  let en = 0;
  for (const kayit of Object.values(blok)) {
    const guc = KANIT_GUCU[kayit?.kanit] ?? 0;
    if (guc < 3) continue; // etiket kanıt sayılmaz
    const t = tazelik(simdi, kayit.sonGorulme);
    if (t <= 0) continue;
    let deger = 0;
    if (kayit.dilDurumu === 'dublaj') deger = 1;
    else if (kayit.dilDurumu === 'altyazi') deger = 0.15;
    if (deger <= 0) continue;
    en = Math.max(en, deger * (0.4 + 0.6 * t));
  }
  return Math.min(1, en);
}

/** Oynatma başarı oranı (Laplace düzeltmeli; kayıtsız → 0.5 nötr). */
export function basariOrani(kayit) {
  const b = Number(kayit?.basari) || 0;
  const h = Number(kayit?.basarisizlik) || 0;
  return (b + 1) / (b + h + 2);
}

/* ── Puanlama ─────────────────────────────────────────────────────────────── */

/**
 * Tek bir kaynağın TR dublaj puanı. Büyük = daha iyi. Ağa gitmez.
 * @param {object} sicil
 * @param {{saglayici?: string, dilDurumu?: string, kanit?: string}} aday
 * @param {string} icerik  icerikAnahtari çıktısı
 * @param {{simdi?: number}} [secenek]
 */
export function kaynakPuani(sicil, aday, icerik, secenek = {}) {
  const simdi = Number(secenek.simdi) || 0;
  const saglayici = saglayiciAnahtari(aday?.saglayici);
  let puan = 0;

  /* 1) Akışın kendi beyanı (varsa) — en zayıf sinyal, etiket olabilir. */
  const beyan = String(aday?.dilDurumu || '').toLowerCase();
  if (beyan && AGIRLIKLAR.durum[beyan] != null) puan += AGIRLIKLAR.durum[beyan] * 0.25;

  /* 2) Sağlayıcı önseli (kalıtım) — siteye hiç gitmeden bilgi verir. */
  const onsel = saglayiciOnseli(sicil, saglayici);
  puan += AGIRLIKLAR.onsel * onsel.onsel * onsel.guven;

  /* 2b) İÇERİK önseli — bu içerikte herhangi bir kaynakta TR ses kanıtı
     varsa, aynı içeriğin tüm kaynakları bundan faydalanır. */
  puan += AGIRLIKLAR.icerikOnsel * icerikOnseli(sicil, icerik, { simdi });

  /* 3) Bu içeriğe özel doğrudan kanıt — en güçlü sinyal. */
  const kayit = saglayici ? sicil?.icerikler?.[icerik]?.saglayicilar?.[saglayici] : null;
  if (kayit) {
    const guc = KANIT_GUCU[kayit.kanit] ?? 0;
    const t = tazelik(simdi, kayit.sonGorulme);
    const durumKat = AGIRLIKLAR.durum[kayit.dilDurumu] ?? 0;
    puan += durumKat * (0.35 + 0.65 * t);
    puan += AGIRLIKLAR.kanit[kayit.kanit] ?? 0;
    puan += AGIRLIKLAR.icerik * t * Math.min(1, guc / 3);
    if (t < 0.25) puan += AGIRLIKLAR.eskiIcerik;
    /* 4) Oynatma geçmişi: bu kaynak gerçekten oynadı mı? */
    const oran = basariOrani(kayit);
    puan += oran >= 0.5 ? AGIRLIKLAR.basari * (oran - 0.5) * 2 : AGIRLIKLAR.hata * (0.5 - oran) * 2;
  }
  return puan;
}

/**
 * TR dublaj KADEMESİ — sıralamanın tek karar ekseni.
 *   0 = kanıtlı Türkçe dublaj (veya çok güvenilir sağlayıcı önseli)
 *   1 = nötr / bilinmiyor / altyazılı
 *   2 = kanıtlı özgün dil (Türkçe yok)
 *
 * NEDEN PUAN DEĞİL KADEME (2026-11-14 ölçülen kusur): saf puan sıralaması
 * kanıtlı 480p kaynağı kanıtlı 1080p'nin önüne geçirebiliyordu; yani dublaj
 * uğruna KALİTE sırası bozuluyordu. Kademe bölümlemesi kalite sırasını
 * kademe içinde AYNEN korur: dublajlılar öne, gerisi kendi kalite sırasıyla.
 *
 * @returns {0|1|2}
 */
export function dublajKademesi(sicil, aday, icerik, { simdi = 0 } = {}) {
  const saglayici = saglayiciAnahtari(aday?.saglayici);
  const kayit = saglayici ? sicil?.icerikler?.[icerik]?.saglayicilar?.[saglayici] : null;

  if (kayit) {
    const guc = KANIT_GUCU[kayit.kanit] ?? 0;
    const t = tazelik(simdi, kayit.sonGorulme);
    /* Taze medya kanıtı kesin hüküm verir. Eski/zayıf kanıt kademe belirlemez
       (yanlış tarafa itmek, hiç dokunmamaktan kötüdür). */
    if (guc >= 3 && t >= 0.35) {
      if (kayit.dilDurumu === 'dublaj') return 0;
      if (kayit.dilDurumu === 'orijinal') return 2;
      return 1; // altyazı / bilinmiyor → nötr
    }
  }

  /* İçerikte BAŞKA bir kaynakta kanıt varsa bu kaynağı öne almıyoruz: o bilgi
     `sicilIpucu` ile taranacak sağlayıcıyı seçmek için kullanılır. Sıralamada
     kesin hüküm yalnız KENDİ kanıtıyla verilir (yanlış öne alma riski yok). */
  return 1;
}

/**
 * Kaynak listesini TR dublaj siciline göre KADEMELİ yeniden sıralar.
 * Kademe içinde giriş sırası (yani çağıranın kalite sıralaması) KORUNUR —
 * kararlı bölümleme. Girdi dizisi değiştirilmez.
 * @param {Array} liste
 * @param {object} sicil
 * @param {string} icerik
 * @param {{simdi?: number, kademe?: Function}} [secenek]
 */
export function sicileGoreSirala(liste, sicil, icerik, secenek = {}) {
  const dizi = Array.isArray(liste) ? liste : [];
  if (dizi.length < 2) return dizi.slice();
  const simdi = Number(secenek.simdi) || 0;
  const kademeAl = typeof secenek.kademe === 'function'
    ? secenek.kademe
    : (aday) => dublajKademesi(sicil, aday, icerik, { simdi });
  /* Üç kova + kararlı yerleştirme: O(n) ve kademe içi sıra birebir korunur. */
  const kovalar = [[], [], []];
  for (const aday of dizi) {
    const k = kademeAl(aday);
    const guvenli = k === 0 || k === 2 ? k : 1;
    kovalar[guvenli].push(aday);
  }
  return [...kovalar[0], ...kovalar[1], ...kovalar[2]];
}

/**
 * Tarama sırasını akıllı hâle getirir: TR dublaj önseli yüksek sağlayıcılar
 * öne alınır. Amaç siteye gitme sayısını azaltmak — "siteye çoğu zaman gerek
 * kalmadan" hedefi. Ölçümsüz sağlayıcılar nötr kalır (0.5), düşük önseli
 * olanların ARDINA düşmez (kanıtsızlık ceza değildir).
 * @param {Array<string>} saglayicilar
 */
export function taramaSirasi(sicil, saglayicilar) {
  const dizi = Array.isArray(saglayicilar) ? saglayicilar : [];
  const simdi = 0; // önsel tazeliği sağlayıcı sayacında tutulmuyor; sabit sıra
  return dizi
    .map((kod, i) => {
      const o = saglayiciOnseli(sicil, kod);
      const deger = o.ornek ? o.onsel * o.guven : 0.5; // kanıtsız → nötr
      return { kod, i, deger };
    })
    .sort((a, b) => (b.deger - a.deger) || (a.i - b.i))
    .map((x) => x.kod);
}

/** Belirli içerik için TR dublaj çıkması en olası sağlayıcılar (ipucu). */
export function sicilIpucu(sicil, icerik, { limit = 8, simdi = 0 } = {}) {
  const icerikKayit = sicil?.icerikler?.[icerik]?.saglayicilar || {};
  const kodlar = new Set([...Object.keys(icerikKayit), ...Object.keys(sicil?.saglayicilar || {})]);
  return [...kodlar]
    .map((kod) => {
      const kayit = icerikKayit[kod];
      const onsel = saglayiciOnseli(sicil, kod);
      const dogrudan = kayit ? tazelik(simdi, kayit.sonGorulme) * (kayit.dilDurumu === 'dublaj' ? 1 : 0) : 0;
      /* Oynatma geçmişi de güce girer: tanı ekranı gerçek sıralamayı yansıtsın
         (aksi hâlde "kanıt var" görünen bir kaynak sürekli hata alsa bile
         ipucunda önde kalırdı). */
      const oran = kayit ? basariOrani(kayit) : 0.5;
      const basariKatki = oran >= 0.5 ? (oran - 0.5) * 2 * 20 : -(0.5 - oran) * 2 * 20;
      return {
        saglayici: kod,
        guc: dogrudan * 100 + onsel.onsel * onsel.guven * 50 + basariKatki,
        dogrudan,
        onsel: onsel.onsel,
        basariOrani: Number(oran.toFixed(3)),
      };
    })
    .filter((x) => x.guc > 0)
    .sort((a, b) => b.guc - a.guc)
    .slice(0, Math.max(1, limit));
}

/* ── Kendini onarma: oynatma geri bildirimi ───────────────────────────────── */

function kayitBul(sicil, icerik, saglayici, { olustur = false } = {}) {
  const kok = saglayiciAnahtari(saglayici);
  if (!kok) return null;
  const icerikKayit = sicil?.icerikler?.[icerik];
  if (!icerikKayit) {
    if (!olustur) return null;
    sicil.icerikler[icerik] = { saglayicilar: {}, guncelleme: 0 };
  }
  const hedef = sicil.icerikler[icerik];
  if (!hedef.saglayicilar[kok]) {
    if (!olustur) return null;
    hedef.saglayicilar[kok] = {
      dilDurumu: 'bilinmiyor', kanit: 'yok', diller: [],
      sonGorulme: 0, basari: 0, basarisizlik: 0, sonHata: 0,
    };
  }
  return hedef.saglayicilar[kok];
}

/** Oynatma başarılı: kaynağı güçlendir. Başarısızlık sayacı soğur. */
export function oynatmaBasarili(sicil, { icerik, saglayici, simdi = 0 }) {
  const kayit = kayitBul(sicil, icerik, saglayici, { olustur: true });
  if (!kayit) return null;
  kayit.basari = (Number(kayit.basari) || 0) + 1;
  if (simdi - (Number(kayit.sonHata) || 0) > HATA_SOGUMA_MS) {
    kayit.basarisizlik = Math.floor((Number(kayit.basarisizlik) || 0) / 2);
  }
  if (!kayit.sonGorulme) kayit.sonGorulme = simdi;
  sicil.guncelleme = Math.max(sicil.guncelleme || 0, simdi);
  return kayit;
}

/** Oynatma başarısız: kaynağı zayıflat (silmez — geçici ağ hatası olabilir). */
export function oynatmaBasarisiz(sicil, { icerik, saglayici, simdi = 0 }) {
  const kayit = kayitBul(sicil, icerik, saglayici, { olustur: true });
  if (!kayit) return null;
  if (simdi - (Number(kayit.sonHata) || 0) > HATA_SOGUMA_MS) {
    kayit.basarisizlik = Math.floor((Number(kayit.basarisizlik) || 0) / 2);
  }
  kayit.basarisizlik = (Number(kayit.basarisizlik) || 0) + 1;
  kayit.sonHata = simdi;
  sicil.guncelleme = Math.max(sicil.guncelleme || 0, simdi);
  return kayit;
}

/* ── Tohum (paketle gelen ölçümler) ───────────────────────────────────────── */

/**
 * `public/dublaj-arsivi/arsiv.json` biçimindeki tohumu sicile aktarır.
 * Tohumda sağlayıcı adı YOKTUR; yalnız hash'lenmiş `kaynakKok` vardır.
 * `kokKodlari` (hash → sağlayıcı öneki) eşlemesi çağıran tarafından verilir
 * (bkz. `tohumKokKodlari`). Eşleşmeyen kok atlanır — uydurma yapılmaz.
 * @returns {number} aktarılan kayıt sayısı
 */
export function tohumdanSicil(sicil, tohum, { kokKodlari = {}, simdi = 0 } = {}) {
  const kayitlar = Array.isArray(tohum?.kayitlar) ? tohum.kayitlar : [];
  let n = 0;
  for (const k of kayitlar) {
    /* Eşlenemeyen kok ATILMAZ: tohum ölçümleri çoğunlukla CDN host'ları
       üzerinden geldiği için sağlayıcı bilinmez, ama İÇERİK kanıtı değerlidir.
       Bunlar tek bir toplayıcı anahtar altında tutulur; `icerikOnseli` bu
       kanıtı sağlayıcıdan bağımsız kullanır (uydurma sağlayıcı atfı yok). */
    const saglayici = kokKodlari[k?.kaynakKok] || 'arsiv:tohum';
    if (!String(k?.tmdbId ?? '').trim()) continue;
    const sonuc = kanitIsle(sicil, {
      tmdbTip: k.tmdbTip,
      tmdbId: k.tmdbId,
      sezon: k.sezon,
      bolum: k.bolum,
      saglayici,
      dilDurumu: k.dilDurumu,
      kanit: k.kanit,
      diller: k.diller,
      /* Tohumda zaman yok: ölçüm dosyasının üretilme tarihi kullanılır,
         o da yoksa 'simdi' → kanıt taze sayılır (ilk kurulum için doğru). */
      sonGorulme: Date.parse(tohum?.uretilmeTarihi || '') || simdi,
    });
    if (sonuc.durum !== 'korundu') n += 1;
  }
  return n;
}

/* ── Birleştirme / özet ───────────────────────────────────────────────────── */

/** İki sicili birleştirir (sıra bağımsız, daha güçlü kanıt kazanır). */
export function sicilBirlestir(a, b) {
  const sonuc = JSON.parse(JSON.stringify(a || sicilBos()));
  const kaynak = b || sicilBos();
  for (const [icerik, blok] of Object.entries(kaynak.icerikler || {})) {
    for (const [saglayici, kayit] of Object.entries(blok.saglayicilar || {})) {
      kanitIsle(sonuc, {
        ...icerikCoz(icerik),
        saglayici,
        dilDurumu: kayit.dilDurumu,
        kanit: kayit.kanit,
        diller: kayit.diller,
        sonGorulme: kayit.sonGorulme,
      });
      const hedef = kayitBul(sonuc, icerik, saglayici, { olustur: true });
      if (hedef) {
        hedef.basari = Math.max(Number(hedef.basari) || 0, Number(kayit.basari) || 0);
        hedef.basarisizlik = Math.max(Number(hedef.basarisizlik) || 0, Number(kayit.basarisizlik) || 0);
        if (Number(kayit.sonHata) > (Number(hedef.sonHata) || 0)) hedef.sonHata = kayit.sonHata;
      }
    }
  }
  for (const [saglayici, sayac] of Object.entries(kaynak.saglayicilar || {})) {
    if (!sonuc.saglayicilar[saglayici]) sonuc.saglayicilar[saglayici] = sayacKur();
    const hedef = sonuc.saglayicilar[saglayici];
    for (const alan of ['dublaj', 'altyazi', 'orijinal', 'bilinmiyor']) {
      hedef[alan] = Math.max(Number(hedef[alan]) || 0, Number(sayac[alan]) || 0);
    }
    hedef.son = Math.max(Number(hedef.son) || 0, Number(sayac.son) || 0);
  }
  sonuc.guncelleme = Math.max(Number(a?.guncelleme) || 0, Number(b?.guncelleme) || 0);
  return sonuc;
}

/** Sicil özeti: sayaçlar (teşhis ekranı ve testler için). */
export function sicilOzeti(sicil) {
  const icerikler = Object.entries(sicil?.icerikler || {});
  let kanitliIcerik = 0;
  let trDublajKaydi = 0;
  let kaynakSayisi = 0;
  for (const [, blok] of icerikler) {
    let varMi = false;
    for (const kayit of Object.values(blok.saglayicilar || {})) {
      kaynakSayisi += 1;
      if (kayit.dilDurumu === 'dublaj') { trDublajKaydi += 1; varMi = true; }
    }
    if (varMi) kanitliIcerik += 1;
  }
  return {
    surum: sicil?.surum || SICIL_SURUMU,
    icerikSayisi: icerikler.length,
    trDublajliIcerik: kanitliIcerik,
    trDublajKaydi,
    kaynakSayisi,
    saglayiciSayisi: Object.keys(sicil?.saglayicilar || {}).length,
    guncelleme: Number(sicil?.guncelleme) || 0,
  };
}

/* ── Depo katmanı (cihazda kalır) ─────────────────────────────────────────── */

/** Depodan sicili okur; bozuk/eski sürüm → boş sicil (asla fırlatmaz). */
export function sicilYukle(depo) {
  try {
    const ham = depo?.getItem?.(SICIL_DEPO_ANAHTARI);
    if (!ham) return sicilBos();
    const veri = JSON.parse(ham);
    if (!veri || veri.surum !== SICIL_SURUMU || typeof veri.icerikler !== 'object') return sicilBos();
    if (!veri.saglayicilar || typeof veri.saglayicilar !== 'object') veri.saglayicilar = {};
    return veri;
  } catch (_) {
    return sicilBos();
  }
}

/** Sicili depoya yazar. Depo yoksa/dolduysa sessizce başarısız olur. */
export function sicilKaydet(depo, sicil) {
  try {
    depo?.setItem?.(SICIL_DEPO_ANAHTARI, JSON.stringify(sicil));
    return true;
  } catch (_) {
    return false;
  }
}

/** Sicili sığ tutar: en eski kanıtları atarak kayıt sayısını sınırlar.
 *  (localStorage 5 MB sınırı — APK'da binlerce bölüm birikebilir.) */
export function siciliKirp(sicil, { enFazlaIcerik = 4000 } = {}) {
  const girisler = Object.entries(sicil?.icerikler || {});
  if (girisler.length <= enFazlaIcerik) return sicil;
  const sirali = girisler.sort((a, b) => (Number(b[1].guncelleme) || 0) - (Number(a[1].guncelleme) || 0));
  sicil.icerikler = Object.fromEntries(sirali.slice(0, enFazlaIcerik));
  return sicil;
}

/* ==========================================================================
   CinePulse Studio — KAYNAK DOĞRULAMA KAPISI
   --------------------------------------------------------------------------
   Kullanıcı talebi (2026-11-17): "bütün kaynakların gözükmesi değil gerçekten
   açıldığına emin ol" + "çıkan her kaynak çalışacak".

   Ölçülen kanıt (canlı site, Stranger Things S1E1): 6 kaynak gerçekten
   açılıyordu (master m3u8 → varyan → 741 parça / 49,4 dk); 7 kaynak ölüydü
   (Star-Lord http-429, Green-Arrow /play?id= embed'leri http-403/500 ve HTML
   gövde). Aynı ölçümde YANLIŞ BÖLÜM de yakalandı (30,9 dk'lık animasyon
   türevi) — süre sapması burada elenir.

   KURAL ÖZETİ
     akış (doğrudan URL)  → fetch + gövde kanıtı (#EXTM3U / video / ftyp)
     master playlist      → ilk varyan çözülür, parça + toplam süre ölçülür
     gömülü oynatıcı      → embedCozucu ile iç akış çözülür, o akış doğrulanır
     çözülen gömülü akış  → KAYNAĞA YAZILIR (url/streamUrl/isM3u8/format)

   KANIT SEVİYELERİ
     ok:true                     → 'oynatilir' kutusu
     belirsiz:true               → 'belirsiz' kutusu (listede sona düşer)
     ikisi de yok                → 'olu' kutusu (listeye GİRMEZ)

   İKİ AŞAMALI BAŞLIK KANITI (ölçüldü 2026-11-17)
     s6.dizisol.com/play ucu Origin/Referer olmadan 403 veriyor; aynı istek
     Origin: https://dizisol.com ile geçiyor. Başlık taşımayan bir probe
     ÇALIŞAN kaynağı "ölü" sanardı — kullanıcı talebinin tam tersi. Bu yüzden
     kaynağın kendi başlıkları ilk denemede gönderilir; başlıksız 401/403
     gelirse Origin/Referer türetilip bir kez daha denenir.

   GARANTİ: bu modül ASLA throw etmez — her hata bir `sebep` olur.
   ========================================================================== */

/** Tarayıcı UA'sı: bazı CDN'ler boş UA'yı 403 ile reddediyor. */
const VARSAYILAN_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/** Doğrudan oynatılabilir uzantı (gömülü sayfa DEĞİL). */
const AKIS_UZANTISI = /\.(m3u8|mp4|mkv|webm|m4s|mpd|ts|mov)([?&#]|$)/i;

/** Gömülü oynatıcı yolu: /play?id=, /embed/, /iframe… (çekirdekler bunu
 *  işaretliyor; işaretsiz eski kayıtlar için yedek sezgi). */
const GOMULU_YOLU = /\/(?:play|embed|oynat|iframe|watch|media)(?:[?/]|$)/i;

const VARSAYILAN_MS = 6000;
const GOMULU_MS = 12000;      // sayfa + (2. katman) + iç akış
const VARSAYILAN_BUTCE_MS = 12000;
const ESZAMANLI = 6;

/* ── yardımcılar ──────────────────────────────────────────────────────── */

function sayi(deger) {
  const n = Number(deger);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Sözleşmedeki `ms` değerine göre gömülü dal bütçesi. Gömülü dal iki-üç
 *  istek yapar; akış dalından cömert olmalı (aksi hâlde embed kaynakları
 *  yapay olarak "ölü" sayılırdı). */
function gomuluButcesi(ms) {
  return Math.max(250, Math.min(GOMULU_MS, Math.round(ms * 2)));
}

/** Promise'i süreyle yarıştırır. Sahte/ağ fetch'leri sinyali yok saysa bile
 *  kapı kilitlenmez. */
function zamanli(is, ms) {
  return new Promise((coz) => {
    let bitti = false;
    const zaman = setTimeout(() => {
      if (bitti) return;
      bitti = true;
      coz({ zamanAsimi: true });
    }, Math.max(1, ms));
    Promise.resolve()
      .then(is)
      .then(
        (deger) => { if (bitti) return; bitti = true; clearTimeout(zaman); coz({ deger }); },
        (hata) => { if (bitti) return; bitti = true; clearTimeout(zaman); coz({ hata }); }
      );
  });
}

function basliklariKur(kaynakBasliklari) {
  const sonuc = { 'User-Agent': VARSAYILAN_UA, Accept: '*/*' };
  if (kaynakBasliklari && typeof kaynakBasliklari === 'object') {
    for (const [ad, deger] of Object.entries(kaynakBasliklari)) {
      if (deger == null || ad == null) continue;
      sonuc[String(ad)] = String(deger);
    }
  }
  return sonuc;
}

function basliktaVar(basliklar, ad) {
  const hedef = String(ad).toLowerCase();
  return Object.keys(basliklar || {}).some(k => k.toLowerCase() === hedef);
}

/** Adresten Origin + Referer türetir (dizisol ölçümü: Origin şart). */
function turetilmisBasliklar(adres) {
  try {
    const u = new URL(String(adres));
    if (!/^https?:$/.test(u.protocol)) return {};
    return { Origin: u.origin, Referer: `${u.origin}/` };
  } catch (_) {
    return {};
  }
}

/** İki adres aynı yayın alanından mı? (host eşit ya da alt alan adı).
 *  Gömülü sayfadan çözülen akış farklı bir siteye çıkıyorsa bu bir reklam /
 *  yanlış eşleşme sinyalidir → belirsiz kalır, ölü ilan edilmez. */
function ayniAlandanMi(sayfaAdresi, akisAdresi) {
  try {
    const a = new URL(String(sayfaAdresi)).hostname.toLowerCase().replace(/^www\./, '');
    const b = new URL(String(akisAdresi)).hostname.toLowerCase().replace(/^www\./, '');
    if (!a || !b) return false;
    if (a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`)) return true;
    if (/dizisol|vidmixi|hdfilmdelisi|filmekseni/i.test(a) && /(?:^|\.)(?:vixolity\.com|vidmixi\.com|cdnimg\d+\.shop|haccodavayup\.shop|pictureupfans\.site)$/i.test(b)) {
      return true;
    }
    return false;
  } catch (_) {
    return false;
  }
}

/** `#EXTINF:4.000,` sürelerinin toplamı (saniye) + parça sayısı. */
function playlistOlc(metin) {
  const satirlar = String(metin || '').split(/\r?\n/);
  let parca = 0;
  let toplamSn = 0;
  for (const satir of satirlar) {
    const m = satir.match(/^#EXTINF:\s*([0-9]*\.?[0-9]+)/i);
    if (!m) continue;
    parca += 1;
    toplamSn += Number(m[1]) || 0;
  }
  return { parca, toplamSn, vodMu: /#EXT-X-ENDLIST/i.test(String(metin || '')) };
}

/** Master playlist'in İLK varyan adresini mutlaklaştırır. */
function ilkVaryan(metin, tabanAdres) {
  const satirlar = String(metin || '').split(/\r?\n/);
  for (let i = 0; i < satirlar.length; i++) {
    if (!/^#EXT-X-STREAM-INF/i.test(satirlar[i].trim())) continue;
    for (let j = i + 1; j < satirlar.length; j++) {
      const aday = satirlar[j].trim();
      if (!aday || aday.startsWith('#')) continue;
      try { return new URL(aday, tabanAdres).toString(); } catch (_) { return aday; }
    }
  }
  return '';
}

function icerikTipi(yanit) {
  try {
    const deger = yanit?.headers?.get?.('content-type');
    return String(deger || '').toLowerCase();
  } catch (_) {
    return '';
  }
}

/** `ftyp` imzası: mp4/mov ailesi (sunucu yanlış content-type verse de kanıt). */
function ftypImzasiMi(tampon) {
  try {
    const b = new Uint8Array(tampon);
    if (b.length < 12) return false;
    return b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70; // 'ftyp'
  } catch (_) {
    return false;
  }
}

/* ── tek istek ────────────────────────────────────────────────────────── */

/** fetch + zaman aşımı. Dönüş: { yanit } | { zamanAsimi:true } | { hata }. */
async function istekYap(fetchFn, adres, basliklar, ms) {
  let denetleyici = null;
  try {
    if (typeof AbortController === 'function') denetleyici = new AbortController();
    const yarisma = zamanli(
      () => fetchFn(adres, {
        headers: basliklar,
        signal: denetleyici ? denetleyici.signal : undefined,
      }),
      ms
    );
    const sonuc = await yarisma;
    if (sonuc?.zamanAsimi) {
      try { denetleyici?.abort?.(); } catch (_) {}
      return { zamanAsimi: true };
    }
    if (sonuc?.hata) return { hata: sonuc.hata };
    return { yanit: sonuc?.deger };
  } catch (hata) {
    return { hata };
  }
}

/* ── AKIŞ DALI ────────────────────────────────────────────────────────── */

/** Doğrudan akış adresini doğrular. Dönüş sözleşmesi: { ok, sebep, ... }. */
async function akisDogrula(adres, { fetchFn, ms, beklenenSureDk, basliklar }) {
  const govdeMs = Math.max(1, Math.round(ms * 0.6));
  const deneme = await istekYap(fetchFn, adres, basliklar, ms);
  if (deneme.zamanAsimi) return { ok: false, sebep: 'zaman-asimi', belirsiz: true };
  if (deneme.hata) {
    // Ağ hatası: kaynak ölü DEĞİL, sadece şu an ölçülemedi.
    return { ok: false, sebep: 'ag-hatasi', belirsiz: true, hata: String(deneme.hata?.message || deneme.hata).slice(0, 160) };
  }
  const yanit = deneme.yanit;
  if (!yanit || typeof yanit !== 'object') return { ok: false, sebep: 'yanit-yok', belirsiz: true };

  const kod = Number(yanit.status) || 0;
  if (kod === 429) return { ok: false, sebep: 'http-429', belirsiz: true };       // meşgul ≠ ölü
  if (kod === 408) return { ok: false, sebep: 'http-408', belirsiz: true };
  if (kod >= 500) return { ok: false, sebep: `http-${kod}` };                     // sunucu kalıcı hata
  if (kod === 401 || kod === 403 || kod === 404 || kod === 410) {
    return { ok: false, sebep: `http-${kod}` };
  }
  if (kod && (kod < 200 || kod >= 300)) return { ok: false, sebep: `http-${kod}`, belirsiz: true };

  const tip = icerikTipi(yanit);
  // HLS/M3U8 içerik tipi gövdeyi okumayı gerektirir (parça + süre kanıtı).
  // Yalnız GERÇEK video ikilileri gövde okunmadan kabul edilir.
  if (/^video\//.test(tip) && !/mpegurl/i.test(tip)) {
    return { ok: true, sebep: 'akis', akis: adres, icerikTipi: tip };
  }
  if (/^image\//.test(tip)) return { ok: false, sebep: 'govde-tanimasiz' }; // poster yerine akış

  // Gövde okuması da süreyle yarışır (yavaş/akan gövde kapıyı kilitlemesin).
  let metin = '';
  if (typeof yanit.text === 'function') {
    const okuma = await zamanli(() => yanit.text(), govdeMs);
    if (okuma?.zamanAsimi) return { ok: false, sebep: 'zaman-asimi', belirsiz: true };
    if (!okuma?.hata) metin = typeof okuma?.deger === 'string' ? okuma.deger : '';
  }

  const kirpik = metin.slice(0, 4096);
  if (/#EXTM3U/i.test(kirpik)) {
    // MASTER: süre/parça bilgisi varyanda. Master'ın kendisi geçerli kanıt;
    // varyan alınamazsa süre bilinmez ama kaynak yine oynatılabilir.
    const varyan = ilkVaryan(metin, adres);
    if (varyan) {
      const icDeneme = await istekYap(fetchFn, varyan, basliklar, ms);
      if (icDeneme.yanit && Number(icDeneme.yanit.status) >= 200 && Number(icDeneme.yanit.status) < 300) {
        let icMetin = '';
        if (typeof icDeneme.yanit.text === 'function') {
          const okuma = await zamanli(() => icDeneme.yanit.text(), govdeMs);
          if (!okuma?.hata) icMetin = typeof okuma?.deger === 'string' ? okuma.deger : '';
        }
        if (/#EXTM3U/i.test(icMetin.slice(0, 4096))) {
          return sureKontrolu({ ok: true, sebep: 'akis', akis: adres }, playlistOlc(icMetin), beklenenSureDk);
        }
      } else if (icDeneme.zamanAsimi) {
        // Master kanıtı var, varyan ölçülemedi → kaynak yaşıyor, süre bilinmiyor.
        return { ok: true, sebep: 'akis', akis: adres, sureBilinmiyor: true };
      }
    }
    return sureKontrolu({ ok: true, sebep: 'akis', akis: adres }, playlistOlc(metin), beklenenSureDk);
  }

  // m3u8 değil: ftyp imzası mp4/mov kanıtıdır.
  if (/^video\//.test(tip) || /\bmp4\b|\bmkv\b|\bwebm\b/i.test(tip)) {
    return { ok: true, sebep: 'akis', akis: adres, icerikTipi: tip };
  }
  if (typeof yanit.arrayBuffer === 'function' && !metin) {
    const ikili = await zamanli(() => yanit.arrayBuffer(), govdeMs);
    if (!ikili?.hata && ftypImzasiMi(ikili?.deger)) {
      return { ok: true, sebep: 'akis', akis: adres };
    }
  }

  // HTML / düz metin / boş gövde: oynatıcı bunu açamaz.
  return { ok: false, sebep: 'govde-tanimasiz' };
}

/** Süre ölçüldüyse ve beklenen süre verildiyse %25 tolerans uygula. */
function sureKontrolu(temel, olcum, beklenenSureDk) {
  const parca = olcum?.parca || 0;
  let sureDk;
  // Toplam süre yalnız VOD kanıtıdır (#EXT-X-ENDLIST yoksa canlı yayın —
  // süre uydurmak yanlış bölümü elerdi).
  if (parca > 0 && olcum?.vodMu) sureDk = Math.round((olcum.toplamSn / 60) * 10) / 10;
  const sonuc = { ...temel };
  if (parca > 0) sonuc.parca = parca;
  if (sureDk != null) sonuc.sureDk = sureDk;
  const beklenen = sayi(beklenenSureDk);
  if (beklenen && sureDk != null) {
    const sapma = Math.abs(sureDk - beklenen) / beklenen;
    if (sapma > 0.25) {
      return { ok: false, sebep: 'sure-sapmasi', parca: sonuc.parca, sureDk, akis: temel.akis };
    }
  }
  return sonuc;
}

/* ── GÖMÜLÜ DAL ───────────────────────────────────────────────────────── */

let _embedModul;
async function embedModulu() {
  if (_embedModul !== undefined) return _embedModul;
  try {
    _embedModul = await import('./embedCozucu.js');
  } catch (_) {
    // Paralel ajanın modülü henüz yoksa kapı çöker değil, belirsiz döner.
    _embedModul = null;
  }
  return _embedModul;
}

/** Kaynak gömülü oynatıcı mı? Önce RESMİ işaret; çağıran bir sezgi
 *  fonksiyonu verdiyse o YETKİLİDİR (test/ölçüm enjeksiyonu), yoksa yol
 *  deseni + paralel modülün gomuluMu'su kullanılır. */
async function gomuluKontrol(kaynak, adres, { gomuluMu }) {
  if (kaynak?.type === 'embed' || kaynak?.isIframe === true || kaynak?.gomulu === true) return true;
  if (typeof gomuluMu === 'function') {
    try { return Boolean(gomuluMu(adres)); } catch (_) { /* sezgi hatası kapıyı bozmaz */ }
  }
  if (GOMULU_YOLU.test(String(adres || ''))) return true;
  if (AKIS_UZANTISI.test(String(adres || ''))) return false;
  const modul = await embedModulu();
  if (modul && typeof modul.gomuluMu === 'function') {
    try { return Boolean(modul.gomuluMu(adres)); } catch (_) { return false; }
  }
  return false;
}

/** Çözülen akışı kaynağa yazar: yayıncı/tüketici tek alanı okur. */
function cozulmusAkisiYaz(kaynak, akis, sayfaAdresi, ekBasliklar = null) {
  if (!kaynak || !akis) return;
  const oncekiUrl = String(kaynak.url || kaynak.streamUrl || '');
  try {
    kaynak.url = akis;
    kaynak.streamUrl = akis;
    kaynak.isM3u8 = /\.m3u8([?&#]|$)/i.test(akis) || /\/(?:vs|list|mp|hls|playlist)\//i.test(akis) || /mpegurl/i.test(String(kaynak.mimeType || ''));
    kaynak.format = kaynak.isM3u8 ? 'm3u8' : 'mp4';
    kaynak.isDirectVideo = true;
    kaynak.isIframe = false;
    kaynak.type = kaynak.isM3u8 ? 'm3u8' : 'video';
    kaynak.gomulu = false;
    kaynak.dogrulandi = true;
    kaynak.dogrulanamadi = false;
    if (ekBasliklar && typeof ekBasliklar === 'object') {
      kaynak.headers = { ...(kaynak.headers || {}), ...ekBasliklar };
    }
    // Orijinal sayfa referans olarak kalır (yeniden çözüm / teşhis için).
    if (!kaynak.embedSayfa && sayfaAdresi) kaynak.embedSayfa = sayfaAdresi;
    if (!kaynak.hamAdres && oncekiUrl) kaynak.hamAdres = oncekiUrl;
  } catch (_) { /* dondurulmuş nesne → yazma başarısız, kapı yine çalışır */ }
}

async function gomuluDogrula(kaynak, adres, { fetchFn, ms, beklenenSureDk, embedCoz, basliklar }) {
  const sayfaAdresi = String(kaynak?.embedSayfa || kaynak?.isIframeAdresi || adres || '');
  const butce = gomuluButcesi(ms);
  const uaBasliklari = basliklariKur(kaynak?.headers);

  let cozucu = embedCoz;
  if (typeof cozucu !== 'function') {
    const modul = await embedModulu();
    cozucu = modul && typeof modul.embedCoz === 'function' ? modul.embedCoz : null;
  }
  if (typeof cozucu !== 'function') {
    // Çözücü yok: gömülü sayfayı ölü ilan etmek YANLIŞ olurdu.
    return { ok: false, sebep: 'gomulu-cozucu-yok', belirsiz: true, gomulu: true };
  }

  const cozum = await zamanli(
    () => cozucu(sayfaAdresi, {
      fetchFn,
      ref: uaBasliklari.Referer || uaBasliklari.referer || turetilmisBasliklar(sayfaAdresi).Referer,
      ms: butce,
      headers: uaBasliklari,
    }),
    butce
  );

  if (cozum?.zamanAsimi) return { ok: false, sebep: 'zaman-asimi', belirsiz: true, gomulu: true, gomuluCozulemedi: true };
  if (cozum?.hata) {
    return { ok: false, sebep: 'gomulu-hata', belirsiz: true, gomulu: true, gomuluCozulemedi: true, hata: String(cozum.hata?.message || cozum.hata).slice(0, 160) };
  }
  const sonuc = cozum?.deger;
  if (!sonuc || typeof sonuc !== 'object') {
    return { ok: false, sebep: 'gomulu-cozulemedi', belirsiz: true, gomulu: true, gomuluCozulemedi: true };
  }
  if (sonuc.durum === 'olu') {
    return { ok: false, sebep: sonuc.sebep || 'gomulu-olu', gomulu: true };
  }
  if (sonuc.durum !== 'akis' || !sonuc.akis) {
    // Çözücü sayfayı açamadı / desen bulamadı → kanıt yok, kaynak listede
    // kalabilir ama işaretsiz (aggregator bunları listeye koymaz).
    return { ok: false, sebep: 'gomulu-cozulemedi', belirsiz: true, gomulu: true, gomuluCozulemedi: true };
  }

  // YABANCI AKIŞ KORUMASI: sayfadan çözülen adres başka siteye çıkıyorsa
  // yanlış eşleşme/reklam riski var → belirsiz (ölü değil).
  if (!ayniAlandanMi(sayfaAdresi, sonuc.akis)) {
    return { ok: false, sebep: 'gomulu-yabanci-akis', belirsiz: true, gomulu: true, gomuluCozulemedi: true, akis: sonuc.akis };
  }

  const ic = await akisDogrula(sonuc.akis, {
    fetchFn,
    ms,
    beklenenSureDk,
    basliklar: { ...uaBasliklari, ...(sonuc.headers || {}) },
  });

  if (ic.ok) {
    cozulmusAkisiYaz(kaynak, sonuc.akis, sayfaAdresi, sonuc.headers);
    return { ...ic, sebep: 'gomulu-akis', gomulu: true };
  }
  // Yanlış bölüm: süre sapması KESİN eleme kanıtıdır (yanlış içerik).
  if (ic.sebep === 'sure-sapmasi') return { ...ic, gomulu: true };
  // İç akış doğrulanamadı: sayfa çözüldü ama kanıt yok → belirsiz.
  return { ...ic, sebep: ic.sebep || 'gomulu-cozulemedi', belirsiz: true, gomulu: true, gomuluCozulemedi: true };
}

/* ── GENEL API ────────────────────────────────────────────────────────── */

function kaynakAdresi(kaynak) {
  return String(kaynak?.streamUrl || kaynak?.url || kaynak?.embedUrl || kaynak?.embedSayfa || '').trim();
}

/**
 * Tek kaynağı doğrular. ASLA throw etmez.
 * @returns {{ok:boolean, sebep:string, belirsiz?:boolean, parca?:number, sureDk?:number, akis?:string}}
 */
export async function kaynakDogrula(kaynak, { fetchFn, ms = VARSAYILAN_MS, beklenenSureDk = null, embedCoz, gomuluMu } = {}) {
  const sure = sayi(ms) || VARSAYILAN_MS;
  try {
    if (!kaynak || typeof kaynak !== 'object') {
      return { ok: false, sebep: 'kaynak-yok', belirsiz: true };
    }
    const adres = kaynakAdresi(kaynak);
    if (!adres) return { ok: false, sebep: 'adres-yok', belirsiz: true };

    const f = typeof fetchFn === 'function' ? fetchFn : globalThis.fetch;
    if (typeof f !== 'function') return { ok: false, sebep: 'fetch-yok', belirsiz: true };

    const gomulu = await gomuluKontrol(kaynak, adres, { gomuluMu });
    if (gomulu) {
      return await gomuluDogrula(kaynak, adres, { fetchFn: f, ms: sure, beklenenSureDk, embedCoz, basliklar: kaynak?.headers });
    }

    // AKIŞ DALI — iki aşamalı başlık kanıtı.
    const temelBasliklar = basliklariKur(kaynak?.headers);
    let sonuc = await akisDogrula(adres, { fetchFn: f, ms: sure, beklenenSureDk, basliklar: temelBasliklar });

    const yenidenDenenebilir = sonuc?.sebep === 'http-401' || sonuc?.sebep === 'http-403';
    const originYok = !basliktaVar(temelBasliklar, 'origin') && !basliktaVar(temelBasliklar, 'referer');
    if (yenidenDenenebilir && originYok) {
      const ek = turetilmisBasliklar(adres);
      if (ek.Origin) {
        const ikinci = { ...temelBasliklar, ...ek };
        sonuc = await akisDogrula(adres, { fetchFn: f, ms: sure, beklenenSureDk, basliklar: ikinci });
        if (sonuc?.ok) {
          sonuc = { ...sonuc, basliklarla: true };
          /* TÜRETİLMİŞ BAŞLIKLA AÇILDIYSADIR. Tarayıcı bu başlıkları kendisi
             gönderemez (Referer/Origin yasaklı başlıklar) → satır ÇIPLAK kalırsa
             kullanıcı "listede var ama açılmıyor" görür. İşaret, agregatördeki
             yeniden-sarmalama bloğuna taşınır (kapiUygula → oynatmaAdresi). */
          try {
            kaynak.baslikTuretildi = true;
            if (!kaynak.headers || typeof kaynak.headers !== 'object' || !Object.keys(kaynak.headers).length) {
              kaynak.headers = ek;
            }
          } catch (_) { /* dondurulmuş nesne: işaret düşer, kapı yine çalışır */ }
        }
      }
    }
    return sonuc;
  } catch (hata) {
    // Sözleşme: buraya düşen her şey bir sebep olur, çağıran çökmez.
    return { ok: false, sebep: 'beklenmeyen-hata', belirsiz: true, hata: String(hata?.message || hata).slice(0, 160) };
  }
}

/**
 * Kaynak listesini üç kutuya ayırır. Oynatılır öne, belirsiz sona, ölü hiç.
 * Eşzamanlılık ≤ 6, toplam bütçe varsayılan 12 sn; bütçe bitince kalanlar
 * "belirsiz" olur (bütçe aşımı ÖLÜM KANITI DEĞİLDİR).
 */
export async function dogrulanmislariAyir(kaynaklar, secenekler = {}) {
  const liste = Array.isArray(kaynaklar) ? kaynaklar.filter(k => k && typeof k === 'object') : [];
  const {
    fetchFn,
    ms = VARSAYILAN_MS,
    butceMs = VARSAYILAN_BUTCE_MS,
    beklenenSureDk = null,
    embedCoz,
    gomuluMu,
    eszamanli = ESZAMANLI,
  } = secenekler || {};
  const oynatilir = [];
  const belirsiz = [];
  const olu = [];
  if (!liste.length) return { oynatilir, belirsiz, olu };

  const bitis = Date.now() + (sayi(butceMs) || VARSAYILAN_BUTCE_MS);
  const kayitlar = new Array(liste.length);
  let imlec = 0;

  const isci = async () => {
    while (imlec < liste.length) {
      const i = imlec++;
      const kaynak = liste[i];
      if (Date.now() >= bitis) {
        kayitlar[i] = { konum: i, kaynak, sonuc: { ok: false, sebep: 'butce-asim', belirsiz: true } };
        continue;
      }
      const kalan = Math.max(150, Math.min(sayi(ms) || VARSAYILAN_MS, bitis - Date.now()));
      const sonuc = await kaynakDogrula(kaynak, { fetchFn, ms: kalan, beklenenSureDk, embedCoz, gomuluMu });
      kayitlar[i] = { konum: i, kaynak, sonuc: sonuc || { ok: false, sebep: 'sonuc-yok', belirsiz: true } };
    }
  };

  const havuz = Math.max(1, Math.min(ESZAMANLI, Number(eszamanli) || ESZAMANLI, liste.length));
  const isler = Array.from({ length: havuz }, isci);
  await Promise.allSettled(isler);

  for (const kayit of kayitlar) {
    if (!kayit) continue;
    const { kaynak, sonuc } = kayit;
    try {
      if (sonuc.ok) {
        kaynak.dogrulandi = true;
        oynatilir.push(kaynak);
      } else if (sonuc.belirsiz) {
        kaynak.dogrulandi = false;
        // Gömülü sayfa çözülemedi: yayıncı bunları listeye koymaz ama
        // fail-open için saklar (ölü kanıtı yok, yalnız kanıtsız).
        if (sonuc.gomuluCozulemedi || sonuc.sebep === 'gomulu-cozulemedi' || sonuc.sebep === 'gomulu-cozucu-yok') {
          kaynak.gomuluCozulemedi = true;
        }
        belirsiz.push(kaynak);
      } else {
        kaynak.dogrulandi = false;
        olu.push(kaynak);
      }
    } catch (_) {
      belirsiz.push(kaynak);
    }
  }

  return { oynatilir, belirsiz, olu };
}

export default { kaynakDogrula, dogrulanmislariAyir };

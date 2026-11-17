/* ==========================================================================
   CinePulse Studio — GÖMÜLÜ OYNATICI ÇÖZÜCÜ (gömülü sayfa → gerçek akış)
   --------------------------------------------------------------------------
   Kullanıcı talebi (2026-11-17): "çıkan her kaynak çalışacak" + "m3u8 olup da
   oynatılamaması bizim hatamız oluyor". /play?id=..., /embed/... gibi satırlar
   oynatıcıya AKIŞ olarak yazılamaz; ama sayfalarının içinde gerçek bir HLS/MP4
   varsa adresi BURADAN çıkarılır. KaynakDogrulayıcı bu modülü tembel (lazy)
   yükler: çözülen adres kendi başlıklarıyla doğrulanır (gövde + parça + süre),
   kanıt gelirse kaynağın url/streamUrl alanı GERÇEK akışla değiştirilir.

   AKIŞ ŞEMASI (kapı ile sözleşme — bkz. kaynakDogrulayici.js gomuluDogrula)
     { durum: 'akis', akis }        → iç akış doğrulanacak
     { durum: 'olu', sebep }        → KESİN ölüm kanıtı (403/404/410) → sicil
     { durum: 'yok', sebep }        → kanıt yok → BELİRSİZ (kaynak öldürülmez)
     { hata }                       → beklenmeyen → belirsiz

   ARANAN DESENLER (ölçülen gerçek yayıncı biçimleri)
     1) Düz adres:            https://cdn/x/master.m3u8?token=…
     2) Oyuncu ayarı:         file:"…", src:"…", sources:[{file:"…"}]
     3) JSON API gövdesi:     {"play_url":"…"}  (hosted-API oynatıcıları)
     4) Base64:               atob("aHR0cHM…")  /  ?url=<base64>
     5) Dean Edwards packer:  eval(function(p,a,c,k,e,d){…})
     6) İframe sıçraması:     aynı alan adında ikinci katman (≤ 2 katman)

   SINIRLAR
     · Akışı DOĞRULAMAZ — bunu kapı yapar (yanlış bölüm/süre sapması orada).
     · Yabancı alana sıçramaz: iframe sıçraması yalnız aynı alan adında; çözülen
       akış sayfanın alan adında değilse kapı 'gomulu-yabanci-akis' der.
     · 5xx / 429 / zaman aşımı ÖLÜM KANITI DEĞİLDİR → 'yok'.
   ======================================================================== */

const VARSAYILAN_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/** Doğrudan oynatılabilir uzantı (bunlar gömülü sayfa DEĞİLDİR). */
const AKIS_UZANTI = /\.(m3u8|mpd|mp4|mkv|webm|m4v|m4s|mov|ts)([?&#]|$)/i;

/** Gömülü oynatıcı yolu — kapının yedek sezgisi de aynı deseni kullanır. */
const GOMULU_YOLU = /\/(?:play|embed|oynat|iframe|watch|player|media)(?:[?/]|$)/i;
const GOMULU_SORGU = /[?&](?:id|v|hash|video|src|url|code)=/i;

/** Oyuncu ayarlarında geçen anahtar adları (file/url/src/…). */
const AYAR_ANAHTARI = /["']?(?:file|url|src|source|sources|video_url|videoUrl|playbackUrl|play_url|streamUrl|stream_url|embed|link)["']?\s*[:=]\s*/gi;

/** Akış OLMAYAN uzantılar — aday listesinde elenir (reklam/asset gürültüsü). */
const ASSET_DESENI = /\.(?:js|css|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|html?)(\?|#|$)/i;

/** Reklam/ölçüm ağları: bunlardan çıkan .mp4 promo videosudur, film değildir. */
const REKLAM_AGI = /(^|\.)(?:doubleclick|googlesyndication|googletagmanager|google-analytics|facebook|fbcdn|tiktokcdn|adsafeprotected|amazon-adsystem|taboola|outbrain)\./i;

/** Sıçranacak iframe/iframe-benzeri hedefler. */
const IFRAME_DESENI = /<iframe[^>]{0,400}?src\s*=\s*["']([^"']{8,600})["']/gi;

const MAKS_CEK = 24;          // tek sayfada çözülecek maksimum ham aday
const MAKS_GOVDE = 1_500_000; // 1,5 MB'tan uzun gövdeyi tarama (regex bombası)

/* ── yardımcılar ──────────────────────────────────────────────────────── */

function metneCevir(v) {
  return v == null ? '' : String(v);
}

function basliklariKur(sayfaAdresi, ref, verilen) {
  const sonuc = {
    'User-Agent': VARSAYILAN_UA,
    Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
    'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
  };
  try {
    const u = new URL(String(sayfaAdresi));
    if (/^https?:$/.test(u.protocol)) {
      sonuc.Origin = u.origin;
      sonuc.Referer = `${u.origin}/`;
    }
  } catch (_) { /* geçersiz adres → başlıksız denenir */ }
  if (ref) sonuc.Referer = String(ref);
  const v = verilen && typeof verilen === 'object' ? verilen : {};
  const yasak = new Set(['host', 'connection', 'content-length', 'accept-encoding', 'cookie']);
  for (const [ad, deger] of Object.entries(v)) {
    if (deger == null || ad == null) continue;
    if (yasak.has(String(ad).toLowerCase())) continue;
    sonuc[String(ad)] = String(deger);
  }
  return sonuc;
}

/** base64 → metin (Unicode güvenli); çözemezse ''. */
function b64Coz(kod) {
  const temiz = metneCevir(kod).replace(/\s+/g, '');
  if (temiz.length < 16 || temiz.length % 4 === 1) return '';
  try {
    const atoba = globalThis.atob;
    if (typeof atoba !== 'function') return '';
    const ikili = atoba(temiz);
    try {
      const baytlar = Uint8Array.from(ikili, (c) => c.charCodeAt(0));
      const metin = new TextDecoder('utf-8', { fatal: false }).decode(baytlar);
      if (metin) return metin;
    } catch (_) { /* eski ortam → ham ikili yeter */ }
    return ikili;
  } catch (_) {
    return '';
  }
}

/** Dean Edwards packer'ını çözer: eval(function(p,a,c,k,e,d){…}('<p>',62,N,'a|b|c'…)).
 *  Taban dönüşü packer'ın kendi `e` fonksiyonuyla BİREBİR olmalı (62 tabanda
 *  Number.toString() çöker — ölçülen hata), yoksa sözlük yanlış çözülür.
 *  Yalnız ADAY ÇIKARMA için kullanılır — gelen kod ASLA çalıştırılmaz. */
function tabanCevir(sayi, taban) {
  if (taban <= 36) return sayi.toString(taban);
  const kalan = sayi % taban;
  const ust = sayi < taban ? '' : tabanCevir(Math.floor(sayi / taban), taban);
  return ust + (kalan > 35 ? String.fromCharCode(kalan + 29) : kalan.toString(36));
}

function packerKurtar(metin) {
  const m = /eval\(function\(p,a,c,k,e,[dr]?\)\{[\s\S]{0,4000}?\}\('([^']*)',(\d+),(\d+),'([^']*)'\.split\('\|'\)/.exec(metin);
  if (!m) return '';
  const p = m[1];
  const taban = Number(m[2]) || 62;
  const sayac = Number(m[3]) || 0;
  const anahtarlar = metneCevir(m[4]).split('|');
  const harita = new Map();
  const uct = Math.min(anahtarlar.length, sayac);
  for (let i = 0; i < uct; i += 1) {
    if (anahtarlar[i]) harita.set(tabanCevir(i, taban), anahtarlar[i]);
  }
  if (!harita.size) return '';
  return p.replace(/[0-9a-zA-Z]+/g, (sozcuk) => harita.get(sozcuk) || sozcuk);
}

/** Kaçış temizliği: JSON içindeki \/ ve %3a// biçimlerini düz metne çevirir. */
function kacaslariCoz(metin) {
  return metneCevir(metin)
    .replace(/\\{1,3}\//g, '/')          // \/, \/, \\\/ → /
    .replace(/\\u002f/gi, '/')
    .replace(/%3a\/\//gi, '://')
    .replace(/https%3a%2f%2f/gi, 'https://')
    .replace(/http%3a%2f%2f/gi, 'http://')
    .replace(/%26/gi, '&')
    .replace(/\\u0026/gi, '&');
}

function mutlak(adres, temel) {
  try {
    return new URL(String(adres), String(temel)).href;
  } catch (_) {
    return '';
  }
}

/** Promise'i süreyle yarıştırır: enjekte edilen (sinyali yok sayan) fetch'lerde
 *  bile modül bütçesini aşmaz — kapı kilitleyici olmaz. */
function sureYarisi(soz, ms) {
  return new Promise((cozum) => {
    let bitti = false;
    const kapat = () => { if (bitti) return true; bitti = true; clearTimeout(zaman); return false; };
    const zaman = setTimeout(() => { if (!kapat()) cozum({ zamanAsimi: true }); }, Math.max(1, ms));
    Promise.resolve(soz).then(
      (deger) => { if (!kapat()) cozum({ deger }); },
      (hata) => { if (!kapat()) cozum({ hata }); },
    );
  });
}

function alanAdi(adres) {
  try {
    return new URL(String(adres)).hostname.toLowerCase().replace(/^www\./, '');
  } catch (_) {
    return '';
  }
}

function ayniAlanMi(a, b) {
  const x = alanAdi(a);
  const y = alanAdi(b);
  if (!x || !y) return false;
  return x === y || x.endsWith(`.${y}`) || y.endsWith(`.${x}`);
}

/** Kesin RED: yol segmenti fragman/tanıtım — oynatılsa bile YANLIŞ içerik. */
const TANITIM_DESENI = /(?:^|[/._-])(?:trailer|fragman|promo|teaser|recap)(?:[/._-]|$)/i;

/** Kalite ipucuna göre sıralama puanı: master/1080p/720p tercih edilir. */
function onemPuani(adres) {
  const u = String(adres).toLowerCase();
  let p = 0;
  if (/\.m3u8(\?|#|$)/i.test(u)) p += 60;
  else if (/\.mpd(\?|#|$)/i.test(u)) p += 40;
  else if (/\.(?:mp4|mkv|webm|m4v)(\?|#|$)/i.test(u)) p += 20;
  if (/master|index|playlist/i.test(u)) p += 8;
  if (/1080/i.test(u)) p += 4;
  else if (/720/i.test(u)) p += 3;
  else if (/480/i.test(u)) p += 1;
  if (/tr|dub|turk/i.test(u)) p += 2;
  if (/(?:^|[/.-])(?:ads?|promo|trailer|teaser|spot|logo|intro)(?:[/.?_-]|$)/i.test(u)) p -= 40;
  return p;
}

/** Ham metinden akış adayı çıkarır (mutlak, sıralı, tekilleştirilmiş). */
export function akisAdaylari(metin, temelAdres) {
  const ham = kacaslariCoz(metin).slice(0, MAKS_GOVDE);
  const bulunan = new Set();
  const topla = (aday) => {
    const s = metneCevir(aday).trim().replace(/[),.;'"]+$/, '');
    if (!s || s.length > 900) return;
    if (/^(?:data|blob|javascript):/i.test(s)) return;
    const u = /^https?:\/\//i.test(s) ? s : mutlak(s, temelAdres);
    if (!u || !/^https?:\/\//i.test(u)) return;
    if (REKLAM_AGI.test(u)) return;
    if (!AKIS_UZANTI.test(u) && !/\/(?:vs|stream|hls|media|video|playback)\/[^/?#]+(?:\?|$)/i.test(u)) return;
    if (ASSET_DESENI.test(u.split('?')[0]) && !AKIS_UZANTI.test(u)) return;
    if (TANITIM_DESENI.test(u.split('?')[0])) return;   // fragman/promo: oynasa da yanlış içerik
    bulunan.add(u);
  };

  // 1) düz (ve yarı-kaçışlı) tam adresler
  for (const m of ham.matchAll(/https?:\/\/[^\s"'<>\\)\]{}]+?\.(?:m3u8|mpd|mp4|mkv|webm|m4v)(?:\?[^\s"'<>\\)\]{}]*)?/gi)) {
    topla(m[0]);
  }
  // 2) oyuncu ayarları: file:"…", src="…", "url": "…" (uzantısız meşru HLS de)
  for (const m of ham.matchAll(new RegExp(AYAR_ANAHTARI.source, 'gi'))) {
    const sonrasi = ham.slice(m.index + m[0].length, m.index + m[0].length + 900);
    const t = /^\s*\[?\s*\{?\s*["']?(?:file|url|src|src720|src1080|label)?["']?\s*[:=]?\s*["']([^"'\s\\]{10,800})["']/.exec(sonrasi);
    if (t) topla(t[1]);
    const d = /^\s*["']?(https?:\/\/[^"'\s\\,}\]]{10,800})["']?/.exec(sonrasi);
    if (d) topla(d[1]);
  }
  // 3) base64: atob("…"), ?url=<base64>, /base64/…
  for (const m of ham.matchAll(/atob\(\s*["']([A-Za-z0-9+/=]{16,2000})["']/g)) {
    const ic = b64Coz(m[1]);
    if (ic && ic.length < MAKS_GOVDE) for (const u of akisAdaylari(ic, temelAdres)) bulunan.add(u);
  }
  for (const m of ham.matchAll(/[?&](?:url|src|link|u|data|code)=([A-Za-z0-9+/=%_-]{20,1200})/g)) {
    const ham2 = (() => { try { return decodeURIComponent(m[1]); } catch (_) { return m[1]; } })();
    const acik = /^https?:\/\//i.test(ham2) ? ham2 : b64Coz(ham2.replace(/[-_]/g, (c) => (c === '-' ? '+' : '/')));
    if (/^https?:\/\//i.test(acik)) topla(acik);
  }
  // 4) Dean Edwards packer
  const pak = packerKurtar(ham);
  if (pak && pak.length < MAKS_GOVDE) for (const u of akisAdaylari(pak, temelAdres)) bulunan.add(u);

  const liste = [...bulunan]
    .filter((u) => !temelAdres || u !== String(temelAdres))
    .map((u) => ({ u, p: onemPuani(u) }))
    .sort((a, b) => b.p - a.p || a.u.length - b.u.length)
    .slice(0, MAKS_CEK)
    .map((x) => x.u);
  return liste;
}

/** JSON gövdesini alan adlarını derinlemesine gezerek dener (hosted-API oynatıcılar). */
function jsonAkisiBul(govde, temelAdres) {
  const metin = govde.trim();
  if (!metin || (metin[0] !== '{' && metin[0] !== '[')) return '';
  let veri;
  try { veri = JSON.parse(metin); } catch (_) { return ''; }
  const onemli = /^(?:play_?url|stream_?url|video_?url|file|url|src|sources|link|m3u8|hls|iframe)$/i;
  const kuyruk = [[veri, 0]];
  const adaylar = [];
  while (kuyruk.length) {
    const [dagim, derinlik] = kuyruk.pop();
    if (derinlik > 6) continue;
    if (typeof dagim === 'string') {
      if (AKIS_UZANTI.test(dagim) || /^https?:\/\//i.test(dagim)) adaylar.push(dagim);
      continue;
    }
    if (Array.isArray(dagim)) {
      for (const v of dagim) kuyruk.push([v, derinlik + 1]);
      continue;
    }
    if (dagim && typeof dagim === 'object') {
      for (const [ad, v] of Object.entries(dagim)) {
        if (typeof v === 'string' && onemli.test(ad)) adaylar.push(v);
        else if (v && typeof v === 'object') kuyruk.push([v, derinlik + 1]);
      }
    }
  }
  const temiz = akisAdaylari(
    adaylar.map((a) => `"${kacaslariCoz(a).replace(/"/g, '')}"`).join(' '),
    temelAdres,
  );
  return temiz[0] || '';
}

/** Gövdedeki aynı-alan iframe hedeflerini döndürür (sıçrama katmanı).
 *  ÖLÇÜLEN DERS (2026-11-17): ilk sürüm yalnız /play|/embed|/watch desenli
 *  hedefleri sıçratıyordu; oynatıcı sayfaları `/oynatici/2`, `/v/9` gibi
 *  rastgele yollar kullanıyor ve çözüm HEMEN ilk katta duruyordu. Kural
 *  doğru yerde sıkı: AYNI ALAN ADI (yabancı siteye sıçranmaz), asset değil. */
function sicramaHedefleri(govde, sayfaAdresi) {
  const sonuc = [];
  const gorulen = new Set();
  const sayfaYolu = (() => { try { return new URL(String(sayfaAdresi)).pathname; } catch (_) { return ''; } })();
  for (const m of kacaslariCoz(govde).matchAll(new RegExp(IFRAME_DESENI.source, 'gi'))) {
    const u = mutlak(m[1], sayfaAdresi);
    if (!u || gorulen.has(u) || !/^https?:\/\//i.test(u)) continue;
    if (!ayniAlanMi(u, sayfaAdresi)) continue;         // yabancı siteye sıçramıyoruz
    const yol = u.split('?')[0];
    if (ASSET_DESENI.test(yol)) continue;              // .js/.png/… iframe değildir
    if (yol === sayfaYolu) continue;                   // kendini yeniden yükleme
    if (/^#/.test(m[1])) continue;
    gorulen.add(u);
    sonuc.push(u);
  }
  return sonuc;
}

/** Kapının yedek sezgisi: adres gömülü oynatıcı mı? */
export function gomuluMu(adres) {
  const u = metneCevir(adres);
  if (!u || AKIS_UZANTI.test(u)) return false;
  return GOMULU_YOLU.test(u) || GOMULU_SORGU.test(u);
}

/**
 * Gömülü oynatıcı sayfasından gerçek akış adresini çıkarır. ASLA throw etmez.
 * @param {string} sayfaAdresi
 * @param {{fetchFn?:Function, ref?:string, ms?:number, headers?:object, derinlik?:number}} [secenekler]
 * @returns {Promise<{durum:'akis'|'olu'|'yok', akis?:string, sebep?:string, hata?:string, katman?:number}>}
 */
export async function embedCoz(sayfaAdresi, secenekler = {}) {
  const t0 = Date.now();
  const f = typeof secenekler.fetchFn === 'function' ? secenekler.fetchFn : globalThis.fetch;
  if (typeof f !== 'function') return { durum: 'yok', sebep: 'fetch-yok' };
  const butce = Math.max(400, Number(secenekler.ms) || 6000);
  const derinlik = Math.max(0, Math.min(2, Number(secenekler.derinlik ?? 2)));
  let hedef = metneCevir(sayfaAdresi).trim();
  if (!/^https?:\/\//i.test(hedef)) return { durum: 'olu', sebep: 'adres-bozuk', katman: 0 };

  const solEslesme = /[?&]id=sol(\d{6,10})(?:-s(\d+)-e(\d+))?(?:[&#]|$)/i.exec(hedef);
  if (solEslesme) {
    const imdb = `tt${solEslesme[1]}`;
    const akis = solEslesme[2] && solEslesme[3]
      ? `https://ha.vixolity.com/vs/${imdb}/s${Number(solEslesme[2])}/e${String(Number(solEslesme[3])).padStart(2, '0')}`
      : `https://ha.vixolity.com/vs/${imdb}`;
    return {
      durum: 'akis',
      akis,
      katman: 0,
      headers: { Referer: 'https://hdfilmdelisi.one/', Origin: 'https://hdfilmdelisi.one' },
    };
  }
  const mixiEslesme = /(?:load-mixi\.[^/]+\/play\?[^#]*?\bid=(?:vidmixi(?:%3A|:))?|vidmixi\.com\/embed\/)([a-f0-9]{16,64})/i.exec(hedef);
  if (mixiEslesme) {
    try {
      const hash = mixiEslesme[1];
      const r = await f(`https://vidmixi.com/embed/${hash}`, {
        headers: { 'User-Agent': VARSAYILAN_UA, Referer: 'https://fullhdfilmizle.now/' },
      });
      if (r && r.ok) {
        const html = await r.text();
        const bm = html.match(/bePlayer\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]/);
        if (bm) {
          const { beplayerCoz } = await import('../../providers/cekirdekler/nova.js');
          const coz = await beplayerCoz(bm[2], bm[1]);
          if (coz?.video_location && /^https?:\/\//i.test(coz.video_location)) {
            return {
              durum: 'akis',
              akis: coz.video_location,
              katman: 1,
              headers: { Referer: 'https://vidmixi.com/', Origin: 'https://vidmixi.com' },
            };
          }
        }
      }
    } catch (_) { /* normal akışa düş */ }
  }

  const gezilen = new Set();
  for (let katman = 0; katman <= derinlik; katman += 1) {
    if (!hedef || gezilen.has(hedef)) break;
    gezilen.add(hedef);
    const kalan = butce - (Date.now() - t0);
    if (kalan < 300) return { durum: 'yok', sebep: 'butce-bitti', katman };

    let yanit;
    const signal = typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
      ? AbortSignal.timeout(kalan)
      : undefined;
    const atis = await sureYarisi(f(hedef, {
      headers: basliklariKur(hedef, secenekler.ref, secenekler.headers),
      redirect: 'follow',
      ...(signal ? { signal } : {}),
    }), kalan);
    if (atis.zamanAsimi) return { durum: 'yok', sebep: 'zaman-asimi', katman };
    if (atis.hata) {
      // Ağ hatası / zaman aşımı: ölüm kanıtı değil.
      return { durum: 'yok', sebep: 'ag-hatasi', hata: metneCevir(atis.hata?.message || atis.hata).slice(0, 160), katman };
    }
    yanit = atis.deger;

    const kod = Number(yanit?.status) || 0;
    // KESİN ölüm: kimlik/erişim/yok kanıtı. (429 ve 5xx → belirsiz.)
    if (kod === 401 || kod === 403 || kod === 404 || kod === 410) {
      return { durum: 'olu', sebep: `http-${kod}`, katman };
    }
    if (!yanit?.ok) return { durum: 'yok', sebep: kod ? `http-${kod}` : 'yanit-yok', katman };

    let govde = '';
    const govdeAtis = await sureYarisi(Promise.resolve().then(() => yanit.text()), Math.max(200, butce - (Date.now() - t0)));
    if (!govdeAtis.zamanAsimi && !govdeAtis.hata) govde = metneCevir(govdeAtis.deger);
    if (!govde.trim()) return { durum: 'yok', sebep: govdeAtis.zamanAsimi ? 'govde-zaman-asimi' : 'govde-bos', katman };

    // sayfa kendisi bir oynatıcı ayarı JSON'u olabilir
    const akis = jsonAkisiBul(govde, hedef) || akisAdaylari(govde, hedef)[0] || '';
    if (akis) return { durum: 'akis', akis, katman };

    const sicrayacak = sicramaHedefleri(govde, hedef).find((u) => !gezilen.has(u));
    if (!sicrayacak) return { durum: 'yok', sebep: 'desen-yok', katman };
    hedef = sicrayacak;
  }
  return { durum: 'yok', sebep: 'derinlik-bitti' };
}

export default { embedCoz, gomuluMu, akisAdaylari };

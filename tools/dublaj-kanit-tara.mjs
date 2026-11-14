#!/usr/bin/env node
/* ==========================================================================
   CinePulse — CANLI TR dublaj KANIT tarayıcısı
   --------------------------------------------------------------------------
   NE YAPAR: Çekirdekleri Node'da çalıştırır (cekirdek-test.mjs ile aynı vekil
   taklidi), her kaynak akış URL'sini `akisanDilKaniti` ile OKUR ve yalnız
   ÖLÇÜLEN kanıtı yazar: dilDurumu + kanit (m3u8|ts|mp4|mkv|yok) + diller.
   Etiket ("Dublaj / Altyazılı") KANIT DEĞİLDİR; ayrı `etiket` alanında durur.

   NEDEN AYRI ARAÇ: cekirdek-test.mjs örnek URL'leri 110 karaktere KISALTIR;
   kısaltılmış adres ağda geçersizdir (imzalı/tokenlı akışlar bozulur).
   Bu araç tam URL'yi ve kaynağın kendi başlıklarını (Referer/Origin/Cookie…)
   kullanır — üretimdeki `akisanDilKaniti` çağrısıyla aynı sözleşme.

   KİPLER (tek dosya, tekrar çalıştırılabilir):
     · Üst süreç: her çekirdek×başlık için AYRI Node çocuk süreci açar
       (vendor çekirdekleri global fetch/localStorage kirletir; izolasyon şart).
     · Çocuk süreç (--isci): tek çekirdeği çalıştırır, akışları yoklar,
       sonucu işaretli tek satır JSON olarak basar.

   KULLANIM:
     node tools/dublaj-kanit-tara.mjs                     # varsayılan 26 çekirdek
     node tools/dublaj-kanit-tara.mjs --cekirdekler hulk,dizisol
     node tools/dublaj-kanit-tara.mjs --cikti notlar/x.json --paralel 3
     node tools/dublaj-kanit-tara.mjs --ms 8000 --kaynak-limit 10
     node tools/dublaj-kanit-tara.mjs --isci hulk.js 550 movie   (iç kullanım)

   NOT: Bu makinede IPv6 çıkışı kırık; Node 18+ varsayılan DNS sırası
   `verbatim` olduğundan fetch'ler IPv6'ya gidip zaman aşımına düşebilir.
   Araç bunu kendi içinde düzeltir (dns.setDefaultResultOrder('ipv4first')),
   yine de dış çağrılarda NODE_OPTIONS="--dns-result-order=ipv4first" önerilir.
   ========================================================================== */
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
require('node:dns').setDefaultResultOrder('ipv4first'); // IPv6 kırık: IPv4 önce

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROTALAR = JSON.parse(readFileSync(path.join(KOK, 'android/app/src/main/assets/native-routes.json'), 'utf8'));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/* ── Köprü rotası çözümü ───────────────────────────────────────────────────
   `rota` alanı: çekirdeğin akışı hangi YEREL KÖPRÜ ROTASINDAN istediğidir
   (native-routes.json anahtarı: fhdf, dzs, fhd…). Vendor çekirdekleri bazen
   köprüyü atlayıp alan adına DOĞRUDAN gider; o durumda rota "dogrudan"
   yazılır (uydurma köprü kodu üretilmez). Çözüm sırası:
     1) çekirdeğin /api/<kod>/… çağrıları (en kesin kanıt),
     2) istek/akış host'u → rota taban host'u (ayna ve üst alan adı dahil). */
const ROTA_HOST = new Map();
function hostEkle(host, kod) {
  const h = String(host || '').toLowerCase();
  if (!h) return;
  if (!ROTA_HOST.has(h)) ROTA_HOST.set(h, kod);
  // Üst alan adı eşleşmesi: s8.dizisol.com → dizisol.com (ayna CDN'leri için).
  const parca = h.split('.');
  if (parca.length > 2) {
    const ust = parca.slice(-2).join('.');
    if (!ROTA_HOST.has(ust)) ROTA_HOST.set(ust, kod);
    if (parca.length > 3) {
      const ust3 = parca.slice(-3).join('.'); // .com.tr gibi çift uzantılar
      if (!ROTA_HOST.has(ust3)) ROTA_HOST.set(ust3, kod);
    }
  }
}
for (const [kod, konf] of Object.entries(ROTALAR)) {
  for (const adres of [konf?.base, ...(Array.isArray(konf?.mirrors) ? konf.mirrors : [])]) {
    try { hostEkle(new URL(adres).host, kod); } catch (_) { /* yoksay */ }
  }
}
/** Bir host için rota kodu: tam eşleşme → üst alan adı eşleşmesi. */
function rotadanHost(host) {
  const h = String(host || '').toLowerCase();
  if (!h) return '';
  if (ROTA_HOST.has(h)) return ROTA_HOST.get(h);
  const parca = h.split('.');
  for (let i = 1; i < parca.length - 1; i++) {
    const aday = parca.slice(i).join('.');
    if (ROTA_HOST.has(aday)) return ROTA_HOST.get(aday);
  }
  return '';
}

/* Öntanımlı çekirdek listesi (2026-11-13 taramasında canlı çıkanlar). */
const VARSAYILAN_CEKIRDEKLER = [
  'hulk', 'dizisol', 'shazam', 'starLord', 'phyla', 'hawkeye', 'lukeCage',
  'darkseid', 'cyborg', 'constantine', 'daredevil', 'beastBoy', 'blackPanther',
  'aquaman', 'aqualad', 'catWoman', 'ironMan', 'loki', 'nova', 'raven',
  'superman', 'winterSoldier', 'doctorStrange', 'falcon', 'huntress', 'blackAdam',
];
/* Ölçüm başlıkları: movie 550 (Fight Club) + tv 1399 S1B1 (Game of Thrones). */
const VARSAYILAN_BASLIKLAR = [
  { tmdbTip: 'movie', tmdbId: '550', sezon: null, bolum: null },
  { tmdbTip: 'tv', tmdbId: '1399', sezon: 1, bolum: 1 },
];

const arg = (ad, varsayilan = null) => {
  const i = process.argv.indexOf(ad);
  return i > -1 && process.argv[i + 1] !== undefined ? process.argv[i + 1] : varsayilan;
};
const argSayi = (ad, varsayilan) => {
  const n = Number.parseInt(arg(ad, ''), 10);
  return Number.isFinite(n) && n > 0 ? n : varsayilan;
};

const ISARET = '__KANIT_SONUC__';

/* ── Vekil taklidi (cekirdek-test.mjs ile aynı sözleşme) ─────────────────── */
/** globalThis.fetch'i sarar: /api/<kod>/<yol> → native-routes base+mirrors.
    Ayrıca GÖRÜLEN host'ları ve rota kodlarını toplar (rota alanı için). */
function vekilKur() {
  const gercekFetch = globalThis.fetch;
  const gorulen = { hostlar: [], rotalar: [], istek: 0 };
  globalThis.fetch = async (girdi, secenekler = {}) => {
    let hedef = String((girdi && girdi.url) || girdi);
    const basliklar = { 'User-Agent': UA, ...(secenekler.headers || {}) };
    const es = hedef.match(/^\/api\/([a-zA-Z0-9_-]+)(\/[^?]*)?(\?.*)?$/);
    if (es && es[1] !== 'proxy' && ROTALAR[es[1]]) {
      const konf = ROTALAR[es[1]];
      gorulen.istek += 1;
      gorulen.rotalar.push(es[1]);
      const adaylar = [konf.base, ...(Array.isArray(konf.mirrors) ? konf.mirrors : [])]
        .filter(u => typeof u === 'string' && /^https?:\/\//i.test(u));
      if (konf.referer) basliklar.Referer = konf.referer;
      Object.assign(basliklar, konf.headers || {});
      for (let i = 0; i < adaylar.length; i += 1) {
        const denemeHedef = adaylar[i] + (es[2] || '') + (es[3] || '');
        try {
          // eslint-disable-next-line no-await-in-loop
          const deneme = await gercekFetch(denemeHedef, { ...secenekler, headers: basliklar, redirect: 'follow' });
          if (deneme.status < 500) return deneme;
          if (i === adaylar.length - 1) return deneme;
        } catch (_) {
          if (i === adaylar.length - 1) throw _;
        }
      }
    }
    try {
      const u = new URL(hedef, 'http://127.0.0.1');
      gorulen.istek += 1;
      if (!gorulen.hostlar.includes(u.host)) gorulen.hostlar.push(u.host);
    } catch (_) { /* göreli/geçersiz adres */ }
    return gercekFetch(hedef, { ...secenekler, headers: basliklar, redirect: 'follow' });
  };
  return gorulen;
}

/* ── Tek akış yoklaması ───────────────────────────────────────────────────── */
/** Kaynağın başlıklarıyla fetch; son HTTP durumunu/hatasını kayda geçirir. */
const TEKRAR_DURUMLARI = new Set([403, 429, 503, 530]);
function baslikliFetch(kaynak, iz) {
  const ek = kaynak?.headers && typeof kaynak.headers === 'object' ? kaynak.headers : {};
  const istek = (u, o) => globalThis.fetch(u, {
    ...o,
    headers: { ...UA_BASLIK, ...ek, ...(o.headers || {}) },
  });
  return async (u, o = {}) => {
    iz.sonDurum = null;
    try {
      let y = await istek(u, o);
      // CDN'ler geçici 403/429/530 dönebiliyor (örnek: token'lı worker
      // adresleri; ölçüldü 2026-11-14). Tek tekrar, ölçümü 'yok'a düşürmesin.
      if (TEKRAR_DURUMLARI.has(y.status)) {
        await new Promise(c => setTimeout(c, 1200));
        y = await istek(u, o);
      }
      iz.sonDurum = y.status;
      iz.sonTip = String(y.headers?.get?.('content-type') || '');
      return y;
    } catch (h) {
      iz.hata = String(h?.message || h);
      throw h;
    }
  };
}
const UA_BASLIK = { 'User-Agent': UA };

/** Master m3u8 metninden EXT-X-MEDIA ses/altyazı gruplarını okur. */
function medyaGruplari(metin) {
  const ses = [];
  const altyazi = [];
  for (const ham of String(metin || '').split(/\r?\n/)) {
    const s = ham.trim();
    if (!s.startsWith('#EXT-X-MEDIA:')) continue;
    const tip = (s.match(/TYPE=([A-Z]+)/) || [])[1];
    const dil = (s.match(/LANGUAGE="([^"]*)"/) || s.match(/LANGUAGE=([^,]+)/) || [])[1] || '';
    const ad = (s.match(/NAME="([^"]*)"/) || s.match(/NAME=([^,]+)/) || [])[1] || '';
    if (tip === 'AUDIO') ses.push(`${dil}${ad ? `:${ad}` : ''}`);
    else if (tip === 'SUBTITLES') altyazi.push(`${dil}${ad ? `:${ad}` : ''}`);
  }
  return { ses, altyazi };
}

/** Bir akış adresini ölçer: dil kanıtı + kanıt gücü + kısa not.
    Akış başına TOPLAM bütçe `ms`dir (katmanlar birbirini bekleyip 2-3 katına
    çıkmasın): her katman kalan süreyle sınırlanır. */
async function akisiOlc(kaynak, adres, { ms }) {
  const sonTarih = Date.now() + ms;
  const kalan = () => Math.max(500, sonTarih - Date.now());
  const iz = { sonDurum: null, sonTip: '', hata: '', asamalar: [] };
  const fetchImpl = baslikliFetch(kaynak, iz);
  const dbg = (s) => { if (process.env.KANIT_DEBUG) console.error(`[aşama] ${s} ${process.env.KANIT_DEBUG === 'tam' ? adres : adres.slice(0, 50)}`); };
  let kanit = null;
  let kaynakKatman = '';

  // 1) Master'ı oku: 256 KB'lık ilk dilim hem EXT-X-MEDIA gruplarını (rapor
  //    için) verir hem "playlist mi?" sorusunu UZANTIDAN DEĞİL İÇERİKTEN
  //    yanıtlar (ölçüldü: hulk akışı .m3u8 uzantısız ama master playlist).
  let gruplar = null;
  let playlistMi = /\.m3u8(?:\?|#|$)/i.test(adres);
  dbg('1-başla');
  try {
    const y = await fetchImpl(adres, {
      signal: AbortSignal.timeout(kalan()),
      headers: { Range: 'bytes=0-262143' },
    });
    if (y) {
      iz.asamalar.push(`master HTTP ${y.status}`);
      if (y.ok) {
        const buf = new Uint8Array(await y.arrayBuffer());
        const metin = new TextDecoder().decode(buf.subarray(0, Math.min(buf.length, 65536)));
        if (/#EXTM3U|#EXT-X-|#EXTINF/i.test(metin)) {
          playlistMi = true;
          gruplar = medyaGruplari(metin);
        }
      }
    }
  } catch (_) { iz.asamalar.push('master okunamadı'); }

  // 2) Üretim kanıt okuyucusu (m3u8 → EXT-X-MEDIA, yoksa segman baytı).
  dbg('2-başla');
  try {
    const { akisanDilKaniti } = await import('../src/services/dogrudan/dublajArsivi.js');
    kanit = await akisanDilKaniti(adres, { fetchImpl, ms: kalan() });
  } catch (h) {
    if (process.env.KANIT_DEBUG) console.error(`[kaçak] ${h?.stack || h}`);
    iz.asamalar.push(`kanıt okuyucu: ${h?.name === 'TimeoutError' ? 'zaman aşımı' : (h?.message || h)}`);
    kanit = null;
  }
  if (kanit && kanit.dilDurumu !== 'bilinmiyor') kaynakKatman = 'akisanDilKaniti';

  // 3) Kanıt yoksa ve playlist ise daha derin kazı (üretimdeki sesDokumuKesfet
  //    yolu: varyant playlist → init/segman baytı, 256 KB).
  dbg('3-başla');
  if ((!kanit || kanit.kanit === 'yok') && playlistMi && kalan() > 1500) {
    try {
      const { sesDokumuKesfet } = await import('../src/services/dogrudan/dublajKestirme.js');
      const dokum = await sesDokumuKesfet(adres, { ms: kalan(), fetchImpl, oncelik: true });
      if (dokum && dokum.kanitlanabilir) {
        kanit = {
          dilDurumu: dokum.trMi ? 'dublaj' : (dokum.trAltyaziMi ? 'altyazi' : (dokum.diller.length ? 'orijinal' : 'bilinmiyor')),
          kanit: 'm3u8',
          diller: dokum.diller,
        };
        kaynakKatman = 'sesDokumuKesfet';
      }
    } catch (h) {
      iz.asamalar.push(`derin kazı: ${h?.message || h}`);
    }
  }

  // 4) Not: hangi katman + HTTP durumu / ağ hatası / ses grubu (kanıt UYDURULMAZ).
  dbg('4-başla');
  const parcalar = [];
  if (kaynakKatman) parcalar.push(kaynakKatman);
  if (iz.sonDurum != null) parcalar.push(`HTTP ${iz.sonDurum}${iz.sonTip ? ` ${iz.sonTip.split(';')[0]}` : ''}`);
  if (iz.hata) parcalar.push(`ağ: ${iz.hata.slice(0, 80)}`);
  for (const a of iz.asamalar) if (!/^master HTTP 200/.test(a)) parcalar.push(a);
  if (gruplar && gruplar.ses.length) parcalar.push(`EXT-X-MEDIA ses: ${gruplar.ses.join('|')}`);
  if (gruplar && gruplar.altyazi.length) parcalar.push(`altyazı: ${gruplar.altyazi.join('|')}`);
  // Kanıt çıkmadıysa NEDEN çıkmadığını ölçülen veriyle yaz (tahmin değil).
  const kanitYok = !kanit || kanit.kanit === 'yok';
  if (kanitYok) {
    if (playlistMi && gruplar && !gruplar.ses.length) parcalar.push('master EXT-X-MEDIA ses bildirimi yok (gömülü ses)');
    if (/mp2t/i.test(iz.sonTip)) parcalar.push('segman TS okundu, ISO-639 dil tanımlayıcısı yok');
    if (/text\/html/i.test(iz.sonTip)) parcalar.push('HTML yanıt (embed/hata sayfası)');
  }
  if (!parcalar.length) parcalar.push(kanit ? 'kanıt okundu' : 'kanıt okunamadı');

  return {
    dilDurumu: kanit?.dilDurumu || 'bilinmiyor',
    kanit: kanit?.kanit && kanit.kanit !== 'yok' ? kanit.kanit : 'yok',
    diller: [...new Set(kanit?.diller || [])],
    not: parcalar.join(' · '),
    gruplar,
  };
}

/* ── Çocuk süreç: tek çekirdek × tek başlık ──────────────────────────────── */
async function isciCalistir(dosya, kimlik, tur, sezon, bolum, secenekler) {
  const gorulen = vekilKur();
  const mod = await import(path.join(KOK, 'src/providers/cekirdekler', dosya));
  const fn = mod.getStreams
    || (typeof mod.default === 'function' ? mod.default : mod.default?.getStreams)
    || (typeof globalThis.getStreams === 'function' ? globalThis.getStreams : null);
  if (typeof fn !== 'function') return { cekirdek: dosya, hata: 'getStreams yok', kayitlar: [] };

  const t0 = Date.now();
  let liste = [];
  let hata = '';
  try {
    const sonuc = await Promise.race([
      fn(kimlik, tur, Number(sezon) || 1, Number(bolum) || 1),
      new Promise((_, reddet) => setTimeout(() => reddet(new Error('çekirdek bütçesi aşıldı')), secenekler.cekirdekButceMs)),
    ]);
    liste = Array.isArray(sonuc) ? sonuc : [];
  } catch (h) {
    hata = String(h?.message || h);
  }
  const cekirdekSureMs = Date.now() - t0;

  // Tam URL'ler (kısaltma YOK) + yinelenenleri ele.
  const kaynaklar = [];
  const gorulenAdres = new Set();
  for (const x of liste) {
    const adres = String(x?.streamUrl || x?.url || x?.embedUrl || '').trim();
    if (!/^https?:\/\//i.test(adres) || gorulenAdres.has(adres)) continue;
    gorulenAdres.add(adres);
    kaynaklar.push(x);
    if (kaynaklar.length >= secenekler.kaynakLimit) break;
  }

  // Rota: önce çekirdeğin /api/<kod> çağrıları, sonra host eşleşmesi.
  let rota = '';
  if (gorulen.rotalar.length) {
    const sayac = new Map();
    for (const k of gorulen.rotalar) sayac.set(k, (sayac.get(k) || 0) + 1);
    rota = [...sayac.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }
  if (!rota) for (const host of gorulen.hostlar) { rota = rotadanHost(host); if (rota) break; }

  // Yoklamalar: küçük eşzamanlılık havuzu (sunucuları boğmadan).
  const kayitlar = [];
  let imlec = 0;
  async function isci() {
    for (;;) {
      const i = imlec;
      imlec += 1;
      if (i >= kaynaklar.length) return;
      const kaynak = kaynaklar[i];
      const adres = String(kaynak.streamUrl || kaynak.url || kaynak.embedUrl || '').trim();
      const bas = Date.now();
      let olcum;
      try {
        olcum = await akisiOlc(kaynak, adres, secenekler);
      } catch (h) {
        if (process.env.KANIT_DEBUG) console.error(`[ayrıntı] ${dosya} ${adres.slice(0, 60)}: ${h?.stack || h}`);
        olcum = { dilDurumu: 'bilinmiyor', kanit: 'yok', diller: [], not: `ölçüm hatası: ${String(h?.message || h).slice(0, 80)}`, gruplar: null };
      }
      let yol = '';
      let akisRota = rota;
      try {
        const u = new URL(adres);
        yol = u.pathname;
        if (!akisRota) akisRota = rotadanHost(u.host);
      } catch (_) { /* yoksay */ }
      // Köprü rotası hiç kullanılmadıysa uydurma kod yazma: "dogrudan".
      if (!akisRota) akisRota = 'dogrudan';
      kayitlar.push({
        cekirdek: dosya,
        tmdbTip: tur,
        tmdbId: String(kimlik),
        sezon: tur === 'movie' ? null : Number(sezon),
        bolum: tur === 'movie' ? null : Number(bolum),
        rota: akisRota,
        yol,
        dilDurumu: olcum.dilDurumu,
        kanit: olcum.kanit,
        diller: olcum.diller,
        sureMs: Date.now() - bas,
        // Etiket KANIT DEĞİL: çekirdeğin kendi başlığı (ayrı alan).
        etiket: String(kaynak.title || kaynak.name || kaynak.displayName || '').slice(0, 120),
        // EXT-X-MEDIA ses grubu var mı? (dl.m3u8 tipi master'lar için)
        sesGrubu: olcum.gruplar && olcum.gruplar.ses.length
          ? { var: true, diller: olcum.gruplar.ses }
          : { var: false, diller: [] },
        not: olcum.not || (olcum.dilDurumu === 'bilinmiyor' ? 'kanıt yok' : ''),
      });
    }
  }
  await Promise.all(Array.from({ length: Math.min(3, kaynaklar.length) }, () => isci()));

  return { cekirdek: dosya, kimlik, tur, sezon, bolum, cekirdekSureMs, adet: liste.length, rota, kayitlar, hata };
}

/* ── Üst süreç: çocukları yönet, JSON'u yaz ──────────────────────────────── */
function cocukCalistir(cekirdek, baslik, secenekler) {
  const args = [
    fileURLToPath(import.meta.url), '--isci', cekirdek,
    baslik.tmdbId, baslik.tmdbTip,
    String(baslik.sezon ?? 1), String(baslik.bolum ?? 1),
    '--ms', String(secenekler.ms), '--kaynak-limit', String(secenekler.kaynakLimit),
    '--cekirdek-butce', String(secenekler.cekirdekButceMs),
  ];
  return new Promise((coz) => {
    const child = spawn(process.execPath, args, {
      cwd: KOK,
      env: { ...process.env, NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --dns-result-order=ipv4first`.trim() },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let tampon = '';
    let hataTamponu = '';
    const zamanlayici = setTimeout(() => { child.kill('SIGKILL'); }, secenekler.cekirdekButceMs + 120_000);
    child.stdout.on('data', (d) => { tampon += d.toString('utf8'); });
    child.stderr.on('data', (d) => { hataTamponu += d.toString('utf8'); });
    child.on('close', (kod) => {
      clearTimeout(zamanlayici);
      const satir = tampon.split(/\r?\n/).filter(s => s.startsWith(ISARET)).pop();
      if (!satir) {
        coz({
          cekirdek, hata: `çocuk süreç sonuç üretmedi (kod ${kod}) ${hataTamponu.slice(-200)}`,
          kayitlar: [],
        });
        return;
      }
      try { coz(JSON.parse(satir.slice(ISARET.length))); }
      catch (h) { coz({ cekirdek, hata: `JSON çözülemedi: ${h?.message}`, kayitlar: [] }); }
    });
    child.on('error', (h) => { clearTimeout(zamanlayici); coz({ cekirdek, hata: String(h?.message || h), kayitlar: [] }); });
  });
}

/** Küçük eşzamanlılık kapısı. */
class Kap {
  constructor(boy) { this.boy = boy; this.aktif = 0; this.bekleyen = []; }
  async al() { while (this.aktif >= this.boy) await new Promise(c => this.bekleyen.push(c)); this.aktif += 1; }
  birak() { this.aktif -= 1; const c = this.bekleyen.shift(); if (c) c(); }
}

async function ana() {
  const secenekler = {
    ms: argSayi('--ms', 8000),
    kaynakLimit: argSayi('--kaynak-limit', 10),
    cekirdekButceMs: argSayi('--cekirdek-butce', 90_000),
  };
  const cikti = path.resolve(KOK, arg('--cikti', 'notlar/dublaj-kanit-2026-11-14.json'));
  const paralel = argSayi('--paralel', 3);
  const cekirdekler = (arg('--cekirdekler', VARSAYILAN_CEKIRDEKLER.join(',')) || '')
    .split(',').map(s => s.trim()).filter(Boolean)
    .map(s => (s.endsWith('.js') ? s : `${s}.js`));

  console.error(`başlıyor: ${cekirdekler.length} çekirdek × ${VARSAYILAN_BASLIKLAR.length} başlık · paralel ${paralel} · ms ${secenekler.ms}`);
  const isler = [];
  for (const cekirdek of cekirdekler) for (const baslik of VARSAYILAN_BASLIKLAR) isler.push({ cekirdek, baslik });

  const kap = new Kap(paralel);
  const sonuclar = [];
  let sira = 0;
  await Promise.all(isler.map(async (is) => {
    await kap.al();
    try {
      const s = await cocukCalistir(is.cekirdek, is.baslik, secenekler);
      sonuclar.push(s);
      sira += 1;
      const tr = (s.kayitlar || []).filter(k => k.diller.includes('tr')).length;
      console.error(`[${sira}/${isler.length}] ${is.cekirdek} ${is.baslik.tmdbTip}/${is.baslik.tmdbId} → akış ${s.kayitlar?.length || 0}, trSes ${tr}${s.hata ? ` · hata: ${s.hata.slice(0, 60)}` : ''}`);
    } finally { kap.birak(); }
  }));

  // Kayıt sırası: çekirdek adı + başlık (deterministik, tekrar çalıştırmada diff temiz).
  const kayitlar = sonuclar
    .flatMap(s => s.kayitlar || []);
  kayitlar.sort((a, b) => (`${a.cekirdek}|${a.tmdbTip}|${a.sezon ?? ''}|${a.yol}`)
    .localeCompare(`${b.cekirdek}|${b.tmdbTip}|${b.sezon ?? ''}|${b.yol}`, 'tr'));

  const trKanit = kayitlar.filter(k => k.diller.includes('tr') && k.kanit !== 'yok').length;
  const belge = {
    olcum: arg('--olcum', '2026-11-14'),
    ozet: {
      cekirdekSayisi: cekirdekler.length,
      denenenBaslik: isler.length,
      akisSayisi: kayitlar.length,
      trSesKanitli: trKanit,
      durumlar: kayitlar.reduce((a, k) => { a[k.dilDurumu] = (a[k.dilDurumu] || 0) + 1; return a; }, {}),
      kanitlar: kayitlar.reduce((a, k) => { a[k.kanit] = (a[k.kanit] || 0) + 1; return a; }, {}),
      cekirdekDurumu: sonuclar.map(s => ({
        cekirdek: s.cekirdek,
        tmdbTip: s.tur, tmdbId: s.kimlik,
        akis: (s.kayitlar || []).length,
        trSes: (s.kayitlar || []).filter(k => k.diller.includes('tr')).length,
        hata: s.hata || '',
      })),
    },
    kayitlar,
  };
  mkdirSync(path.dirname(cikti), { recursive: true });
  writeFileSync(cikti, `${JSON.stringify(belge, null, 2)}\n`, 'utf8');
  console.error(`bitti: ${kayitlar.length} ölçüm, ${trKanit} gerçek TR ses kanıtı → ${cikti}`);
  process.exit(0);
}

/* ── Giriş noktası ───────────────────────────────────────────────────────── */
const isciMi = process.argv.includes('--isci');
if (isciMi) {
  const i = process.argv.indexOf('--isci');
  const [, dosya, kimlik, tur = 'movie', sezon = '1', bolum = '1'] = process.argv.slice(i);
  const secenekler = {
    ms: argSayi('--ms', 8000),
    kaynakLimit: argSayi('--kaynak-limit', 10),
    cekirdekButceMs: argSayi('--cekirdek-butce', 90_000),
  };
  process.on('unhandledRejection', () => { /* vendor çekirdekleri sinyal reddi bırakır */ });
  process.on('uncaughtException', (h) => {
    console.log(`${ISARET}${JSON.stringify({ cekirdek: dosya, hata: String(h?.message || h), kayitlar: [] })}`);
    process.exit(0);
  });
  isciCalistir(dosya, kimlik, tur, sezon, bolum, secenekler)
    .then(s => { console.log(`${ISARET}${JSON.stringify(s)}`); process.exit(0); })
    .catch(h => {
      console.log(`${ISARET}${JSON.stringify({ cekirdek: dosya, hata: String(h?.stack || h), kayitlar: [] })}`);
      process.exit(0);
    });
} else {
  ana().catch(h => { console.error(`araç hatası: ${h?.stack || h}`); process.exit(1); });
}

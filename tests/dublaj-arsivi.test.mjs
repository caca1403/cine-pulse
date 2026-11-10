/* ==========================================================================
   DUBLAJ ARŞİVİ — çekirdek modül testleri (ağsız)
   --------------------------------------------------------------------------
   - Sahte fetch ile m3u8 metni/baytı verilir; dublajKestirme okuyucuları
     (m3u8SesDokumu / baytSesDilleri) YENİDEN KULLANILIR.
   - Kullanıcı kuralı: kanıt olmadan 'orijinal' YAZILMAZ (ağ hatası →
     'bilinmiyor'). Gerçek site adı/hero kod adı kayıtta ALAN OLARAK YOKTUR;
     yalnız hash'lenmiş host/adres özeti taşınır.
   - Çalıştır: node --test tests/dublaj-arsivi.test.mjs
   ========================================================================== */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  akisanDilKaniti, kanitKaydet, arsivEkle, arsOzeti, arsivBirlestir,
  dilDurumuKiyasla, kanitGucu, hostHashla, girisAnahtari,
} from '../src/services/dogrudan/dublajArsivi.js';

/* ── Sahte fetch yardımcıları ─────────────────────────────────────────────── */
function httpYanit(deger, ok = true, status = 200) {
  const bayt = typeof deger === 'string' ? new TextEncoder().encode(deger) : deger;
  return {
    ok, status,
    text: async () => (typeof deger === 'string' ? deger : new TextDecoder().decode(bayt)),
    arrayBuffer: async () => bayt.buffer.slice(bayt.byteOffset, bayt.byteOffset + bayt.byteLength),
  };
}
/** anahtar-ile eşleşen sahte fetch; eşleşmezse 404. */
function safteFetch(harita) {
  return async (girdi) => {
    const url = String(typeof girdi === 'string' ? girdi : (girdi && girdi.url) || '');
    for (const [anahtar, deger] of Object.entries(harita)) {
      if (url.includes(anahtar)) {
        if (deger instanceof Error) throw deger;
        return httpYanit(deger);
      }
    }
    return httpYanit('bulunamadi', false, 404);
  };
}

/* ── Sentetik MPEG-TS (dublajKestirme.test.mjs deseni) ────────────────────── */
function paket(pid, payload) {
  const p = new Uint8Array(188).fill(0xff);
  p[0] = 0x47;
  p[1] = 0x40 | ((pid >> 8) & 0x1f);
  p[2] = pid & 0xff;
  p[3] = 0x10;
  p.set(payload, 4);
  return p;
}
function tsUret(diller) {
  const pat = paket(0, [0x00, 0x00, 0xb0, 0x0f, 0x00, 0x01, 0xc1,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x01, 0x1f & ((0x1000 >> 8) | 0x10), 0x1000 & 0xff,
    0x00, 0x00, 0x00, 0x00]);
  const esler = [[0x1b, 0x0100, null], ...diller.map((iso, i) => [0x0f, 0x0101 + i, iso])]
    .flatMap(([t, p, iso]) => {
      if (!iso) return [t, 0xe0 | ((p >> 8) & 0x1f), p & 0xff, 0xf0, 0x00];
      return [t, 0xe0 | ((p >> 8) & 0x1f), p & 0xff, 0xf0, 0x05,
        0x0a, 0x03, ...iso.split('').map(c => c.charCodeAt(0))];
    });
  const len = 6 + esler.length + 4;
  const pmt = paket(0x1000, [0x00, 0x02, 0x30 | ((len >> 8) & 0x0f), len & 0xff,
    0x00, 0x01, 0xf0, 0x01, 0xf0, 0x00, ...esler, 0x00, 0x00, 0x00, 0x00]);
  const out = new Uint8Array(pat.length + pmt.length);
  out.set(pat, 0); out.set(pmt, 188);
  return out;
}

const TR_MASTER = `#EXTM3U
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="a",LANGUAGE="tur",NAME="Turkish",DEFAULT=YES,URI="a/index.m3u8"
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="a",LANGUAGE="eng",NAME="English",URI="b/index.m3u8"
#EXT-X-STREAM-INF:BANDWIDTH=3000000,AUDIO="a"
720p/index.m3u8`;

const EN_MASTER = `#EXTM3U
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="a",LANGUAGE="eng",NAME="English",DEFAULT=YES,URI="a/index.m3u8"
#EXT-X-STREAM-INF:BANDWIDTH=3000000,AUDIO="a"
720p/index.m3u8`;

const SES_YOK_MASTER = `#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=3000000,CODECS="avc1.64001f,mp4a.40.2"
720p/index.m3u8`;

/* ── 1) Sahte fetch → m3u8 TR ses → dilDurumu 'dublaj' ────────────────────── */
test('master m3u8 TR ses kanıtı → dilDurumu dublaj, kanit m3u8', async () => {
  const f = safteFetch({ 'master.m3u8': TR_MASTER });
  const sonuc = await akisanDilKaniti('https://cdn.test/a/master.m3u8', { fetchImpl: f });
  assert.equal(sonuc.dilDurumu, 'dublaj');
  assert.equal(sonuc.kanit, 'm3u8');
  assert.ok(sonuc.diller.includes('tr'));
});

/* ── 2) Master'da dil yok → ilk segmentin ilk 64 KB'ı kazınır (TS) ───────── */
test('muxed master → ilk segment 64KB TS okunur → dublaj, kanit ts', async () => {
  const ts = tsUret(['eng', 'tur']);
  const f = safteFetch({
    'master.m3u8': SES_YOK_MASTER,
    '720p/index.m3u8': '#EXTM3U\n#EXTINF:4,\nseg1.ts\n',
    '720p/seg1.ts': ts,
  });
  const sonuc = await akisanDilKaniti('https://cdn.test/a/master.m3u8', { fetchImpl: f });
  assert.equal(sonuc.dilDurumu, 'dublaj');
  assert.equal(sonuc.kanit, 'ts');
  assert.ok(sonuc.diller.includes('tr'));
});

/* ── 3) Ağ hatası / 404 → ASLA 'orijinal' ─────────────────────────────────── */
test('ağ hatası → bilinmiyor; kanıt olmadan orijinal YAZILMAZ', async () => {
  const hataF = safteFetch({ 'x.m3u8': new Error('zaman asimi') });
  const s1 = await akisanDilKaniti('https://cdn.test/x.m3u8', { fetchImpl: hataF, ms: 50 });
  assert.equal(s1.dilDurumu, 'bilinmiyor');
  assert.equal(s1.kanit, 'yok');

  const f404 = safteFetch({});
  const s2 = await akisanDilKaniti('https://cdn.test/y.m3u8', { fetchImpl: f404 });
  assert.equal(s2.dilDurumu, 'bilinmiyor');
  assert.notEqual(s2.dilDurumu, 'orijinal');

  // HTML/embed sayfası da kanıt değildir
  const fHtml = safteFetch({ 'embed': '<html><body>player</body></html>' });
  const s3 = await akisanDilKaniti('https://cdn.test/embed', { fetchImpl: fHtml });
  assert.equal(s3.dilDurumu, 'bilinmiyor');
});

/* ── 4) Kanıt var, TR yok → DOĞRULANMIŞ orijinal (kanıtla yazılır) ───────── */
test('yalnız EN ses kanıtı → orijinal (kanıtla)', async () => {
  const f = safteFetch({ 'master.m3u8': EN_MASTER });
  const sonuc = await akisanDilKaniti('https://cdn.test/b/master.m3u8', { fetchImpl: f });
  assert.equal(sonuc.dilDurumu, 'orijinal');
  assert.equal(sonuc.kanit, 'm3u8');
});

/* ── 5) kanitKaydet: kanıtsız 'orijinal' girdisi → bilinmiyor ─────────────── */
test('kanitKaydet kanıtsız orijinal girdisini bilinmiyora düşürür', () => {
  const depo = new Map();
  const kayit = kanitKaydet(depo, {
    tmdbTip: 'movie', tmdbId: '155', sezon: null, bolum: null,
    host: 'cdn.test', adres: 'https://cdn.test/v/master.m3u8',
    dilDurumu: 'orijinal', kanit: 'yok', diller: ['en'],
  });
  assert.equal(kayit.dilDurumu, 'bilinmiyor');
  assert.equal(depo.size, 1);
  // etiket tahmini de 'orijinal' kanıtı değildir
  const k2 = kanitKaydet(new Map(), {
    tmdbTip: 'movie', tmdbId: '155', host: 'cdn.test', adres: 'https://cdn.test/v/2.m3u8',
    dilDurumu: 'orijinal', kanit: 'etiket',
  });
  assert.equal(k2.dilDurumu, 'bilinmiyor');
});

/* ── 6) arsivBirlestir: kanıt gücü üstünlüğü (m3u8/ts > etiket) ───────────── */
test('arsivBirlestir aynı anahtarda m3u8 kanıtını etiket tahminine tercih eder', () => {
  const ortak = { tmdbTip: 'movie', tmdbId: '155', sezon: null, bolum: null, host: 'cdn.test', adres: 'https://cdn.test/v/m.m3u8' };
  const guclu = { ...ortak, dilDurumu: 'orijinal', kanit: 'm3u8', diller: ['en'] };
  const zayif = { ...ortak, dilDurumu: 'dublaj', kanit: 'etiket', diller: ['tr'] };

  const birlesik = arsivBirlestir({ kayitlar: [guclu] }, { kayitlar: [zayif] });
  assert.equal(birlesik.kayitlar.length, 1);
  assert.equal(birlesik.kayitlar[0].dilDurumu, 'orijinal');
  assert.equal(birlesik.kayitlar[0].kanit, 'm3u8');

  // sıra bağımsızlığı: zayıf önce gelse de sonuç aynı
  const ters = arsivBirlestir({ kayitlar: [zayif] }, { kayitlar: [guclu] });
  assert.equal(ters.kayitlar[0].dilDurumu, 'orijinal');
  assert.equal(ters.kayitlar[0].kanit, 'm3u8');

  // ts de etiketi ezer
  assert.ok(kanitGucu({ kanit: 'ts' }) > kanitGucu({ kanit: 'etiket' }));
  assert.ok(dilDurumuKiyasla({ kanit: 'm3u8' }, { kanit: 'etiket' }) > 0);
});

/* ── 7) Host her zaman hash'lenir; JSON'da gerçek domain YOK ──────────────── */
test('kaynakKok/adresOzet hash’lenir; kayıt JSON’unda gerçek domain yok', () => {
  const depo = new Map();
  const kayit = kanitKaydet(depo, {
    tmdbTip: 'movie', tmdbId: '155',
    host: 'gercek-site-cdn.example.com',
    adres: 'https://gercek-site-cdn.example.com/hls/master.m3u8?token=abc',
    dilDurumu: 'dublaj', kanit: 'm3u8', diller: ['tr'],
  });
  const json = JSON.stringify(kayit);
  assert.ok(!json.includes('gercek-site-cdn.example.com'), 'gerçek domain kayıtta geçmemeli');
  assert.ok(!json.includes('example.com'));
  assert.ok(!json.includes('token=abc'), 'adres özeti ham adres içermemeli');
  assert.match(kayit.kaynakKok, /^[0-9a-f]{16,}$/, 'kaynakKok hash olmalı');
  assert.match(kayit.adresOzet, /^[0-9a-f]{16,}$/, 'adresOzet hash olmalı');
  // hero kod adı / sağlayıcı adı da alan olamaz
  assert.ok(!('source' in kayit) && !('displayName' in kayit) && !('saglayici' in kayit));
  // aynı host+adres ikinci kez aynı anahtara düşer (üstün kanıt birleştirilir)
  const k2 = kanitKaydet(depo, {
    tmdbTip: 'movie', tmdbId: '155',
    host: 'gercek-site-cdn.example.com',
    adres: 'https://gercek-site-cdn.example.com/hls/master.m3u8?token=abc',
    dilDurumu: 'bilinmiyor', kanit: 'yok',
  });
  assert.equal(depo.size, 1);
  assert.equal(k2.dilDurumu, 'dublaj', 'üstün kanıt korunmalı');
  assert.equal(kayit.kaynakKok, hostHashla('gercek-site-cdn.example.com'));
});

/* ── 8) arsOzeti: tür/sezon/dil kırılımı sayaçları ────────────────────────── */
test('arsOzeti tür, sezon ve dil kırılımını sayar', () => {
  const arsiv = { kayitlar: [
    { tmdbTip: 'movie', tmdbId: '155', sezon: null, bolum: null, dilDurumu: 'dublaj', diller: ['tr'], kanit: 'm3u8', kaynakKok: 'a'.repeat(16), adresOzet: 'b'.repeat(16) },
    { tmdbTip: 'movie', tmdbId: '27205', sezon: null, bolum: null, dilDurumu: 'orijinal', diller: ['en'], kanit: 'm3u8', kaynakKok: 'c'.repeat(16), adresOzet: 'd'.repeat(16) },
    { tmdbTip: 'tv', tmdbId: '1399', sezon: 1, bolum: 1, dilDurumu: 'dublaj', diller: ['tr', 'en'], kanit: 'ts', kaynakKok: 'e'.repeat(16), adresOzet: 'f'.repeat(16) },
    { tmdbTip: 'anime', tmdbId: '1429', sezon: 1, bolum: 3, dilDurumu: 'bilinmiyor', diller: [], kanit: 'yok', kaynakKok: 'g'.repeat(16), adresOzet: 'h'.repeat(16) },
  ] };
  const ozet = arsOzeti(arsiv);
  assert.equal(ozet.toplamKayit, 4);
  assert.equal(ozet.trSesliKayit, 2);
  assert.equal(ozet.turler.movie, 2);
  assert.equal(ozet.turler.tv, 1);
  assert.equal(ozet.turler.anime, 1);
  assert.equal(ozet.sezonlar['1'], 2);
  assert.equal(ozet.durumlar.dublaj, 2);
  assert.equal(ozet.diller.tr, 2);
  assert.equal(ozet.diller.en, 2);
});

/* ── 9) arsivEkle: aynı anahtar tek kayıtta birleşir ──────────────────────── */
test('arsivEkle aynı anahtarı tek kayıtta toplar, anahtar üretimi tutarlı', () => {
  const giris = { tmdbTip: 'tv', tmdbId: '1399', sezon: 2, bolum: 5, host: 'x.example.org', adres: 'https://x.example.org/s.m3u8', dilDurumu: 'dublaj', kanit: 'm3u8', diller: ['tr'] };
  const arsiv = { kayitlar: [] };
  arsivEkle(arsiv, giris);
  arsivEkle(arsiv, { ...giris, dilDurumu: 'bilinmiyor', kanit: 'yok' });
  assert.equal(arsiv.kayitlar.length, 1);
  assert.equal(arsiv.kayitlar[0].dilDurumu, 'dublaj');
  const anahtar = girisAnahtari(arsiv.kayitlar[0]);
  assert.ok(anahtar.includes('tv|1399|2|5|'), 'anahtar tür/id/sezon/bolum içermeli');
  assert.ok(anahtar.includes(hostHashla('x.example.org')));
});

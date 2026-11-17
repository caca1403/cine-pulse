/* ==========================================================================
   Dizisol (Green-Arrow) — GÖMÜLÜ OYNATICI sözleşmesi testi
   --------------------------------------------------------------------------
   KANIT (2026-11-17, gerçek API yanıtı, tmdb 66732 / Stranger Things S1B1):
   sitenin /api/movies/by-tmdb uçları artık DÜZ .m3u8 değil, 10/10 oranda
   `.../play?id=…` gömülü oynatıcı sayfası döndürüyor. Bu adresler HTML
   döndürdüğü için "1080p HLS" diye listelenemez: oynatıcıda (web + APK) ölü
   satır olur. Beklentimiz:
     1) gömülü adres RESMEN işaretli döner (type/format 'embed', isM3u8 false)
     2) hiçbir gömülü satır kalite/dil iddiası taşımaz
     3) gerçek m3u8 gelirse eskisi gibi kanıtla (dublaj/altyazı) listelenir
     4) Eylül-29'dan beri bilinen oynatılamaz biçimler listeye hiç girmez
   Ağ KULLANILMAZ — fetch enjekte edilir.
   ========================================================================== */

import { test } from 'node:test';
import assert from 'node:assert/strict';

const SITE = 'https://dizisol.com';

/* 2026-11-17 canlı yanıtının birebir kısaltılmış kopyası (10 gömülü hat). */
const SADECE_GOMULU = {
  id: 64648,
  m3u8Url: 'https://cortina.dizisol14.workers.dev/play?id=e5xrdjhyfxy8',
  sources: [
    { provider: 'vidrame', isActive: true, m3u8Url: 'https://s6.dizisol.com/play?id=8787c5a7', priority: 1 },
    { provider: 'rapidrame', isActive: true, m3u8Url: 'https://rapid.dizisol1.workers.dev/play?hash=7c45x8vyq354', priority: 2 },
    { provider: 'vidmixi', isActive: true, m3u8Url: 'https://load-mixi.dizisol26.workers.dev/play?id=vidmixi%3A5321b1f1', priority: 3 },
    { provider: 'filmekseni', isActive: true, m3u8Url: 'https://eksen.dizisol104.workers.dev/play?id=l12e33sw7f7ba4zytf4n', priority: 4 },
    { provider: 'hdfilmdelisi', isActive: true, m3u8Url: 'https://s12.dizisol.com/play?id=sol4574334-s1-e01', priority: 5 },
    { provider: 'videoplays', isActive: true, m3u8Url: 'https://videoplays.dizisol89.workers.dev/play?video=3259', priority: 6 },
    { provider: 'dizipal3008', isActive: true, m3u8Url: 'https://pal.dizisol50.workers.dev/play?id=omcibh99gpcb', priority: 7 },
    { provider: 'dizilla', isActive: true, m3u8Url: 'https://four.dizisol63.workers.dev/play?id=https%3A%2F%2Fpichive.online%2Fiframe.php%3Fv%3D91a4c018&p=dizilla', priority: 8 },
    { provider: 'setfilmizle', isActive: true, m3u8Url: 'setfilmizle::abc123', priority: 9 },
    { provider: 'imagestoo', isActive: true, m3u8Url: 'https://imagestoo.picturebox.cloud/embed/x1', priority: 10 },
  ],
};

const GERCEK_M3U8 = [
  '#EXTM3U',
  '#EXT-X-STREAM-INF:BANDWIDTH=4000000,RESOLUTION=1920x1080',
  '1080p/index.m3u8',
  '#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="aao",NAME="Türkçe",LANGUAGE="tr",DEFAULT=YES',
  '#EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="subs",NAME="Altyazı",LANGUAGE="tr"',
  '#EXTINF:9.0,',
  'seg1.ts',
].join('\n');

function yanit(govde, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    async text() { return govde; },
    async json() { return typeof govde === 'string' ? JSON.parse(govde) : govde; },
  };
}

/** fetch'i geçici olarak değiştirir; çekirdeğin hangi adrese ne sorduğunu da kaydeder. */
async function cekecek(getir, fn) {
  const gercek = globalThis.fetch;
  const istenen = [];
  globalThis.fetch = async (url) => {
    const u = String(url);
    istenen.push(u);
    return getir(u);
  };
  try {
    const sonuc = await fn();
    return { sonuc, istenen };
  } finally {
    globalThis.fetch = gercek;
  }
}

const cekirdekYukle = () => import('../src/providers/cekirdekler/dizisol.js');

/* ── 1) Ayraç birimi: ölçülen 10 adresin tamamı gömülü sayılmalı ─────────── */
test('gomuluOynaticiMi: ölçülen tüm /play?... biçimlerini tanır', async () => {
  const { gomuluOynaticiMi } = await cekirdekYukle();
  const olculenler = [
    'https://s6.dizisol.com/play?id=8787c5a7',
    'https://rapid.dizisol1.workers.dev/play?hash=7c45x8vyq354',
    'https://load-mixi.dizisol26.workers.dev/play?id=vidmixi%3A5321b1f1',
    'https://videoplays.dizisol89.workers.dev/play?video=3259',
    'https://four.dizisol63.workers.dev/play?id=https%3A%2F%2Fpichive.online%2Fiframe.php%3Fv%3D91a4&p=dizilla',
    'https://x.com/embed/abc',
    'https://y.com/oynat/abc',
  ];
  for (const u of olculenler) assert.equal(gomuluOynaticiMi(u), true, `gömülü sayılmalı: ${u}`);
});

test('gomuluOynaticiMi: gerçek akış ve uzantısız HLS adresleri gömülü DEĞİLDİR', async () => {
  const { gomuluOynaticiMi } = await cekirdekYukle();
  const akslar = [
    'https://cdn.x.com/a/b/master.m3u8',
    'https://cdn.x.com/a/b/master.m3u8?token=9',
    'https://s26.cdnimg1399.shop/mv/2024/film.mp4',
    'https://cdn.x/api/hls_proxy?url=https%3A%2F%2Fa.m3u8',
    // Eylül ölçümünde #EXTM3U dönen uzantısız hat yolu — gömülü sayılmaz
    'https://s26.cdnimg1399.shop/mv/abc123',
  ];
  for (const u of akslar) assert.equal(gomuluOynaticiMi(u), false, `gömülü sayılmamalı: ${u}`);
});

test('oynatilamazMi: Eylül-29dan beri bilinen biçimler', async () => {
  const { oynatilamazMi } = await cekirdekYukle();
  assert.equal(oynatilamazMi('setfilmizle::abc123'), true);
  assert.equal(oynatilamazMi('https://imagestoo.picturebox.cloud/embed/x1'), true);
  assert.equal(oynatilamazMi('https://s6.dizisol.com/play?id=8787c5a7'), false);
  assert.equal(oynatilamazMi(''), false);
});

/* ── 2) 10/10 gömülü yanıtı: hiçbir satır "HLS/1080p" diye yalan söylemez ── */
test('yalnız gömülü hatlar: satırlar resmi gömülü işaret taşır, kalite iddiası yok', async () => {
  const { getStreams } = await cekirdekYukle();
  const { sonuc } = await cekecek(async (u) => {
    if (u.includes('/api/movies/by-tmdb/')) return yanit(SADECE_GOMULU);
    // Gömülü sayfalar doğrulanMAZ — doğrulama isteği atılırsa da HTML dön
    return yanit('<html><body>player</body></html>');
  }, () => getStreams('66732', 'tv', 1, 1));

  assert.ok(sonuc.length >= 8, `gömülü hatlar listede kalmalı, bulunan: ${sonuc.length}`);
  for (const s of sonuc) {
    assert.equal(s.type, 'embed', `type embed olmalı: ${s.url}`);
    assert.equal(s.format, 'embed', `format embed olmalı: ${s.url}`);
    assert.equal(s.isM3u8, false, `isM3u8 false olmalı: ${s.url}`);
    assert.equal(s.gomulu, true);
    assert.equal(s.quality, 'auto', 'kalite uydurulamaz');
    assert.ok(!/1080p|720p/i.test(s.title), `başlık kalite iddia edemez: ${s.title}`);
    assert.equal(s.headers.Origin, SITE, 'Origin başlığı taşınmalı (WAF şartı)');
    assert.equal(s.headers.Referer, `${SITE}/`);
  }
  // Gömülü satırların hiçbiri oynatıcıya HLS olarak gitmemeli
  assert.ok(sonuc.every((s) => s.isM3u8 !== true));
});

/* ── 3) Oynatılması imkânsız biçimler listeye HİÇ girmemeli ──────────────── */
test('setfilmizle:: ve picturebox satırları listeye girmez', async () => {
  const { getStreams } = await cekirdekYukle();
  const { sonuc } = await cekecek(async (u) => {
    if (u.includes('/api/movies/by-tmdb/')) return yanit(SADECE_GOMULU);
    return yanit('<html></html>');
  }, () => getStreams('66732', 'tv', 1, 1));

  const tumAdres = sonuc.map((s) => String(s.url)).join(' ');
  assert.ok(!/setfilmizle/i.test(tumAdres), 'setfilmizle:: listeye girmemeli');
  assert.ok(!/picturebox/i.test(tumAdres), 'picturebox listeye girmemeli');
});

/* ── 4) Gerçek m3u8 gelirse eski davranış korunur (dublaj/altyazı kanıtı) ── */
test('gerçek akış: dil kanıtı ile listelenir, gömülüler yanında işaretli kalır', async () => {
  const { getStreams } = await cekirdekYukle();
  const karisik = {
    id: 1,
    m3u8Url: 'https://vip.dizisol1.workers.dev/master.m3u8',
    sources: [
      { provider: 'vidmixi', isActive: true, m3u8Url: 'https://load-mixi.dizisol26.workers.dev/play?id=x1', priority: 2 },
    ],
  };
  // Çekirdekte 30 sn'lik anahtar başına önbellek var — diğer testlerle çakışmasın
  // diye bu vakada ayrı TMDB kimliği kullanılır.
  const { sonuc, istenen } = await cekecek(async (u) => {
    if (u.includes('/api/movies/by-tmdb/')) return yanit(karisik);
    if (u.endsWith('master.m3u8')) return yanit(GERCEK_M3U8);
    return yanit('<html></html>');
  }, () => getStreams('71676', 'tv', 2, 3));

  const akis = sonuc.find((s) => s.url.endsWith('master.m3u8'));
  assert.ok(akis, 'gerçek akış listede olmalı');
  assert.equal(akis.isM3u8, true);
  assert.equal(akis.format, 'm3u8');
  assert.equal(akis.trSes, true, 'Türkçe ses kanıtı okunmalı');
  assert.equal(akis.trAltyazi, true, 'Türkçe altyazı kanıtı okunmalı');
  assert.equal(akis.quality, '1080p');

  const gomulu = sonuc.find((s) => s.url.includes('/play?id=x1'));
  assert.ok(gomulu, 'gömülü hat da listede kalmalı (çözüm şansı)');
  assert.equal(gomulu.type, 'embed');

  // Gömülü hat için doğrulama isteği ATILMAMALI (8 sn boşa yanmaz)
  assert.ok(!istenen.some((u) => u.includes('/play?id=x1')),
    'gömülü sayfa doğrulama (dilKaniti) isteği yapılmamalı');
});

/* ── 5) Bozuk/boş API yanıtları: [] döner, fırlatmaz ─────────────────────── */
test('API 500 / boş dönse bile [] döner, hata fırlatmaz', async () => {
  const { getStreams } = await cekirdekYukle();
  for (const getir of [
    async () => yanit('', { ok: false, status: 500 }),
    async () => { throw new Error('aak hatası'); },
  ]) {
    const sonuc = await cekecek(getir, () => getStreams('66732', 'movie', 1, 1));
    assert.ok(Array.isArray(sonuc.sonuc));
    assert.equal(sonuc.sonuc.length, 0);
  }
});

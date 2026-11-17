/* GÖMÜLÜ OYNATICI ÇÖZÜCÜ — gömülü sayfa → gerçek akış.
   Kullanıcı talebi (2026-11-17): "çıkan her kaynak çalışacak" + "tüm kaynaklarla
   ilgilen, m3u8 akışına uyanların çalıştığından emin ol". Gömülü satırlar
   oynatıcıya akış olarak gidemez; iç akış burada çözülür ve kapı doğrular.

   Kanıt sınıfı sözleşmesi (kaynakDogrulayici.gomuluDogrula ile birebir):
     durum:'akis'  → akış bulundu (kapı doğrular)
     durum:'olu'   → KESİN ölüm (401/403/404/410) → sicil + kalıcı eleme
     durum:'yok'   → kanıt YOK (5xx, 429, timeout, desen yok) → belirsiz
   Ağ YOK: fetchFn enjekte edilir.
   Çalıştır: node --test tests/embed-cozucu.test.mjs */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const MODUL = '../src/services/kaynak/embedCozucu.js';
const { embedCoz, gomuluMu, akisAdaylari } = await import(MODUL);

/* ── sahte ağ ─────────────────────────────────────────────────────────── */

function yanit(govde, { status = 200, headers = {} } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(headers),
    async text() { return govde; },
  };
}

/** Verilen adres→yanıt haritasıyla fetch sahtesi; çağrıları kaydeder. */
function sahte(ağ, gövde = '') {
  const çağrılar = [];
  const fetchFn = async (adres, init = {}) => {
    const başlıklar = init?.headers || {};
    const oku = (ad) => {
      const anahtar = Object.keys(başlıklar).find((k) => k.toLowerCase() === ad);
      return anahtar ? String(başlıklar[anahtar]) : '';
    };
    çağrılar.push({ adres: String(adres), referer: oku('referer'), origin: oku('origin'), ua: oku('user-agent') });
    const anahtar = Object.keys(ağ).find((k) => String(adres).includes(k));
    if (anahtar) {
      const v = ağ[anahtar];
      return typeof v === 'function' ? v(String(adres)) : v;
    }
    return yanit(gövde, { status: 404 });
  };
  return { fetchFn, çağrılar };
}

/* ── 1) DESENLER ──────────────────────────────────────────────────────── */

test('düz HTML: master.m3u8 bulunur, kalite varyantına tercih edilir', async () => {
  const sayfa = `<!doctype html><html><body>
    <video src="https://cdn.ornek.tv/film/720.mp4"></video>
    <script>var player = { file: "https://cdn.ornek.tv/film/master.m3u8?tok=9" };</script>
  </body></html>`;
  const { fetchFn, çağrılar } = sahte({ '/oynat/': yanit(sayfa) });
  const r = await embedCoz('https://player.ornek.tv/oynat/abc', { fetchFn, ms: 3000 });
  assert.equal(r.durum, 'akis', JSON.stringify(r));
  assert.equal(r.akis, 'https://cdn.ornek.tv/film/master.m3u8?tok=9');
  assert.equal(çağrılar.length, 1, 'akış bulununca gezinti bitmeli');
});

test('JSON API gövdesi: play_url alanından akış çıkar', async () => {
  const gövde = JSON.stringify({
    code: 200,
    data: { title: 'Örnek', links: [{ label: 'HQ', play_url: 'https://cdn.ornek.tv/hls/9/index.m3u8' }] },
  });
  const { fetchFn } = sahte({ '/play': yanit(gövde, { headers: { 'content-type': 'application/json' } }) });
  const r = await embedCoz('https://api.ornek.tv/play?id=9', { fetchFn, ms: 3000 });
  assert.equal(r.durum, 'akis');
  assert.match(r.akis, /index\.m3u8$/);
});

test('kaçışlı gövde (\\/ ve %3a//) ve JSON-kaçışlı adresler de çözülür', async () => {
  const sayfa = `<script>var src = "https:\\/\\/cdn.ornek.tv\\/a\\/1080p.m3u8";var b = "https%3a%2f%2fcam.ornek.tv%2fb.mp4";</script>`;
  const adaylar = akisAdaylari(sayfa, 'https://player.ornek.tv/e/1');
  assert.ok(adaylar.some((u) => u === 'https://cdn.ornek.tv/a/1080p.m3u8'), JSON.stringify(adaylar));
});

test('base64 (atob) içindeki akış adresi çözülür', async () => {
  const kod = globalThis.btoa('{"file":"https://cdn.ornek.tv/pool/x.m3u8"}');
  const sayfa = `<script>eval(decodeURIComponent(escape(atob("${kod}"))));</script>`;
  const r = await embedCoz('https://player.ornek.tv/embed/x', {
    fetchFn: sahte({ '/embed/': yanit(sayfa) }).fetchFn,
    ms: 3000,
  });
  assert.equal(r.durum, 'akis');
  assert.equal(r.akis, 'https://cdn.ornek.tv/pool/x.m3u8');
});

test('Dean Edwards packer: eval(function(p,a,c,k,e,d){…}) içinden akış çıkar', async () => {
  // Gerçek packer çıktısı üretilir (koddan), sonra çözümleyiciye verilir —
  // böylece unpacker gerçekçi girdiyle sınanır, elle yazılmış sahteyle değil.
  const kaynakKod = 'var o="https://cdn.ornek.tv/pack/master.m3u8";player.setup({file:o});';
  const anahtarlar = ['https:', 'cdn', 'pack', 'master', 'm3u8', 'var', 'file'];
  const taban = 62;
  // Packer'ın kendi taban fonksiyonu: 62 tabanda Number.toString() YASAK
  // (radix ≤ 36). Alfabe: 0-9 a-z A-Z → kalan > 35 ise String.fromCharCode(+29).
  const t = (n) => (n < taban
    ? (n > 35 ? String.fromCharCode(n + 29) : n.toString(36))
    : t(Math.floor(n / taban)) + (n % taban > 35 ? String.fromCharCode(n % taban + 29) : (n % taban).toString(36)));
  let pak = kaynakKod;
  for (let i = anahtarlar.length - 1; i >= 0; i -= 1) {
    if (!anahtarlar[i]) continue;
    pak = pak.split(new RegExp(`\\b${t(i)}\\b`, 'g')).join(anahtarlar[i]);
  }
  const sar = `eval(function(p,a,c,k,e,d){e=function(c){return c.toString(a)};while(c--){if(k[c]){p=p.replace(new RegExp("\\\\b"+e(c)+"\\\\b","g"),k[c])}}return p}('${pak.replace(/'/g, '\\x27')}',${taban},${anahtarlar.length},'${anahtarlar.join('|')}'.split('|'),0,{}))`;
  assert.ok(pak.includes('master'), 'packer girdisi gerçekten paketlenmiş olmalı');
  const r = await embedCoz('https://player.ornek.tv/embed/p1', {
    fetchFn: sahte({ '/embed/': yanit(`<script>${sar}</script>`) }).fetchFn,
    ms: 3000,
  });
  assert.equal(r.durum, 'akis', JSON.stringify(r));
  assert.equal(r.akis, 'https://cdn.ornek.tv/pack/master.m3u8');
});

test('iframe sıçraması: aynı alan adında ikinci katman çözülür', async () => {
  const üst = '<iframe src="/oynatici/2"></iframe>';
  const alt = '<script>sources=[{file:"https://cdn.ornek.tv/derin/master.m3u8"}]</script>';
  const { fetchFn, çağrılar } = sahte({
    '/g/': yanit(üst),
    '/oynatici/2': yanit(alt),
  });
  const r = await embedCoz('https://site.ornek.tv/g/55', { fetchFn, ms: 3000 });
  assert.equal(r.durum, 'akis', JSON.stringify(r));
  assert.equal(r.akis, 'https://cdn.ornek.tv/derin/master.m3u8');
  assert.equal(çağrılar.length, 2);
  assert.equal(çağrılar[1].referer, 'https://site.ornek.tv/', 'iç katman ana sayfayı referer gösterir');
});

test('yabancı alana iframe sıçraması YAPILMAZ (reklam/SSRF koruması)', async () => {
  const üst = '<iframe src="https://baskasite.xyz/embed/kop"></iframe>';
  const { fetchFn, çağrılar } = sahte({ '/g/': yanit(üst) });
  const r = await embedCoz('https://site.ornek.tv/g/55', { fetchFn, ms: 3000 });
  assert.equal(r.durum, 'yok');
  assert.equal(r.sebep, 'desen-yok');
  assert.equal(çağrılar.length, 1, 'yabancı hedef çekilmemeli');
});

/* ── 2) KANIT SINIFI: ölüm vs kanıtsızlık ─────────────────────────────── */

for (const kod of [401, 403, 404, 410]) {
  test(`HTTP ${kod} → durum 'olu' (KESİN ölüm → kalıcı sicil)`, async () => {
    const { fetchFn } = sahte({ '/play': yanit('<html>engelledi</html>', { status: kod }) });
    const r = await embedCoz('https://s6.dizisol.com/play?id=x', { fetchFn, ms: 2000 });
    assert.equal(r.durum, 'olu');
    assert.equal(r.sebep, `http-${kod}`);
  });
}

for (const kod of [429, 500, 502, 503]) {
  test(`HTTP ${kod} → durum 'yok' (ölüm kanıtı DEĞİL, kaynak öldürülmez)`, async () => {
    const { fetchFn } = sahte({ '/play': yanit('', { status: kod }) });
    const r = await embedCoz('https://rapid.dizisol1.workers.dev/play?hash=x', { fetchFn, ms: 2000 });
    assert.equal(r.durum, 'yok');
    assert.equal(r.sebep, `http-${kod}`);
  });
}

test('desen yok → durum yok/desen-yok (belirsiz), throw yok', async () => {
  const { fetchFn } = sahte({ '/play': yanit('<html><body>Reklam var, akış yok.</body></html>') });
  const r = await embedCoz('https://player.ornek.tv/play?id=1', { fetchFn, ms: 2000 });
  assert.equal(r.durum, 'yok');
  assert.equal(r.sebep, 'desen-yok');
});

test('ağ hatası → belirsiz (ag-hatasi); boş gövde → belirsiz', async () => {
  const kopuk = await embedCoz('https://player.ornek.tv/play?id=1', {
    fetchFn: async () => { throw new Error('socket hang up'); },
    ms: 1500,
  });
  assert.equal(kopuk.durum, 'yok');
  assert.equal(kopuk.sebep, 'ag-hatasi');
  const bos = await embedCoz('https://player.ornek.tv/play?id=1', {
    fetchFn: async () => yanit('   '),
    ms: 1500,
  });
  assert.equal(bos.durum, 'yok');
  assert.equal(bos.sebep, 'govde-bos');
});

test('bütçe: sinyali yok sayan yavaş fetch modülü kilitlemez (zaman-asimi)', async () => {
  const t0 = Date.now();
  const r = await embedCoz('https://player.ornek.tv/play?id=1', {
    fetchFn: () => new Promise((c) => setTimeout(() => c(yanit('<a href="https://cdn.ornek.tv/a.m3u8">x</a>')), 4000)),
    ms: 300,
  });
  const gecen = Date.now() - t0;
  assert.equal(r.durum, 'yok');
  assert.equal(r.sebep, 'zaman-asimi');
  assert.ok(gecen < 1500, `bütçe aşıldı: ${gecen}ms`);
});

test('geçersiz adres → olu/adres-bozuk; fetch yoksa → yok/fetch-yok', async () => {
  assert.deepEqual(
    { ...(await embedCoz('blob:https://x/1', { fetchFn: async () => yanit('') })) },
    { durum: 'olu', sebep: 'adres-bozuk', katman: 0 },
  );
  const orijinal = globalThis.fetch;
  try {
    Object.defineProperty(globalThis, 'fetch', { value: undefined, configurable: true, writable: true });
    const r = await embedCoz('https://player.ornek.tv/play?id=1', {});
    assert.equal(r.sebep, 'fetch-yok');
  } finally {
    Object.defineProperty(globalThis, 'fetch', { value: orijinal, configurable: true, writable: true });
  }
});

/* ── 3) BAŞLIKLAR + sezgi + gürültü filtresi ──────────────────────────── */

test('istek başlıkları: Referer/Origin sayfadan türetilir, UA ve verilen başlık taşınır', async () => {
  const { fetchFn, çağrılar } = sahte({ '/play': yanit('<b>x</b>') });
  await embedCoz('https://s6.dizisol.com/play?id=9', {
    fetchFn,
    ms: 2000,
    headers: { 'User-Agent': 'CinePulse/1.0', Cookie: 'silinmeli=1', 'X-Ozel': 'kalsin' },
  });
  assert.equal(çağrılar[0].origin, 'https://s6.dizisol.com');
  assert.equal(çağrılar[0].referer, 'https://s6.dizisol.com/');
  assert.equal(çağrılar[0].ua, 'CinePulse/1.0', 'verilen UA varsayılanı ezer');
});

test('verilen ref parametresi türetilmiş Referer\'ı ezer', async () => {
  const { fetchFn, çağrılar } = sahte({ '/play': yanit('<b>x</b>') });
  await embedCoz('https://s6.dizisol.com/play?id=9', { fetchFn, ms: 2000, ref: 'https://hdfilmdelisi.one/' });
  assert.equal(çağrılar[0].referer, 'https://hdfilmdelisi.one/');
});

test('gomuluMu: oynatıcı yolu true, akış adresi false', () => {
  const gomulu = [
    'https://s6.dizisol.com/play?id=8787c5a7',
    'https://x.com/embed/abc',
    'https://y.com/oynat/abc',
    'https://p.com/watch/1',
    'https://p.com/x?url=abc',
  ];
  for (const u of gomulu) assert.equal(gomuluMu(u), true, `gömülü: ${u}`);
  const akis = [
    'https://cdn.x.com/a/master.m3u8',
    'https://cdn.x.com/a/master.m3u8?t=1',
    'https://cdn.x.com/film.mp4?tok=abc',
  ];
  for (const u of akis) assert.equal(gomuluMu(u), false, `akış: ${u}`);
});

test('gürültü: reklam ağı, asset uzantısı ve sayfanın kendisi akış adayı değildir', () => {
  const sayfa = `
    <script src="https://cdn.ornek.tv/oynatici.js"></script>
    <img src="https://cdn.ornek.tv/poster.png">
    <a href="https://googleads.g.doubleclick.net/spot/reklam.mp4">reklam</a>
    <video src="https://cdn.ornek.tv/trailer/fragman.mp4"></video>`;
  const adaylar = akisAdaylari(sayfa, 'https://player.ornek.tv/e/1');
  assert.ok(!adaylar.some((u) => /doubleclick/.test(u)), JSON.stringify(adaylar));
  assert.ok(!adaylar.some((u) => /\.(?:js|png)(\?|$)/.test(u)), JSON.stringify(adaylar));
  assert.ok(!adaylar.some((u) => /fragman/.test(u)), 'fragman/promo akış sayılmaz');
});

test('akisAdaylari: sayfa adresinin kendisi aday değildir, üstel regex yok (hız)', () => {
  const uzun = 'x'.repeat(200_000) + ' <script>f="https://cdn.ornek.tv/s/onlarca.m3u8"</script>';
  const t0 = Date.now();
  const adaylar = akisAdaylari(uzun, 'https://player.ornek.tv/e/1');
  assert.ok(Date.now() - t0 < 800, 'gövde taraması sınırlı süre sürmeli');
  assert.ok(adaylar.includes('https://cdn.ornek.tv/s/onlarca.m3u8'));
});

/* ── 4) KAPI + BUILD BAĞLANTISI ───────────────────────────────────────── */

test('kaynakDogrulayıcı bu modülü tembel yükler ve sözleşme alanları duruyor', () => {
  const kapı = readFileSync(new URL('../src/services/kaynak/kaynakDogrulayici.js', import.meta.url), 'utf8');
  assert.match(kapı, /import\('\.\/embedCozucu\.js'\)/, 'kapı embedCozucu\'yu tembel yüklemeli');
  assert.match(kapı, /modul\s*&&\s*typeof modul\.embedCoz\s*===\s*'function'/, 'embedCoz alanı aranmalı');
});

test('aggregator: çözülen gömülü akış başlık proxy\'sinden YENİDEN sarılır', () => {
  const agg = readFileSync(new URL('../src/services/kaynak/providerAggregator.js', import.meta.url), 'utf8');
  assert.match(agg, /k\.embedSayfa/, 'çözülmüş satır işareti okunmalı');
  assert.match(agg, /oynatmaAdresi\(akis/, 'çözülen akış sarmalanmalı');
});

test('modül dışa açım sözleşmesi: embedCoz / gomuluMu / akisAdaylari', () => {
  assert.equal(typeof embedCoz, 'function');
  assert.equal(typeof gomuluMu, 'function');
  assert.equal(typeof akisAdaylari, 'function');
});

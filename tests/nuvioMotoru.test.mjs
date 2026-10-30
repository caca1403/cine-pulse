import test from 'node:test';
import assert from 'node:assert/strict';
import { createCipheriv, createHash } from 'node:crypto';

/* Nuvio depo JS motoru testleri (kullanıcı 2026-10-29).
   Ağda 3. taraflara ÇIKAR: t.online etiketli testler patr0n Nuvio deposunun
   gerçek provider'larını gerçek HTTP ile çağırır. Ağ yoksa o testler atlanır. */

globalThis.localStorage = { _m: {}, getItem(k) { return this._m[k] ?? null; }, setItem(k, v) { this._m[k] = String(v); } };

const { nuvioMotoru, nuvioSatiraCevir } = await import('../src/services/dogrudan/nuvioMotoru.js');
const { CryptoJS } = await import('../src/services/dogrudan/nuvioCrypto.js');
const { cheerio } = await import('../src/services/dogrudan/nuvioDom.js');

/* ── CryptoJS altkümesi: Node crypto ile birebir doğrulama ─────────────── */
test('crypto-js shim: AES-256-CBC/Pkcs7 Node crypto ile aynı çıktı', () => {
  const key = createHash('sha256').update('anahtar').digest();
  const iv = Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex');
  const plain = 'Breaking Bad 1x01 — Türkçe karakterli metin: çğıöşü';
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const waFromBytes = (b) => {
    const words = [];
    for (let i = 0; i < b.length; i++) words[i >>> 2] |= b[i] << ((3 - (i & 3)) * 8);
    return CryptoJS.lib.WordArray.create(words, b.length);
  };
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: waFromBytes(ct) },
    waFromBytes(key),
    { iv: waFromBytes(iv), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );
  assert.equal(decrypted.toString(CryptoJS.enc.Utf8), plain);
});

test('crypto-js shim: Hex/Base64/Utf8 round-trip + yanlış anahtar net hata', () => {
  const wa = CryptoJS.enc.Utf8.parse('aBc123 çğüö');
  assert.equal(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Hex.parse(CryptoJS.enc.Hex.stringify(wa))), 'aBc123 çğüö');
  assert.equal(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(CryptoJS.enc.Base64.stringify(wa))), 'aBc123 çğüö');
  assert.throws(() => CryptoJS.MD5('x'), /altkümede yok/);
  const k = CryptoJS.enc.Utf8.parse('0123456789012345');
  const iv = CryptoJS.enc.Hex.parse('00112233445566778899aabbccddeeff');
  const enc = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse('gizli metin verisi'), k, { iv });
  const yanlisAnahtar = CryptoJS.enc.Utf8.parse('5432109876543210');
  assert.throws(() => CryptoJS.AES.decrypt(enc, yanlisAnahtar, { iv }), /Pkcs7/);
});

/* ── cheerio shim'i: sinewix'in kullandığı gerçek desen ────────────────── */
test('cheerio shim: section.facts p / each / text / attr / find / :first', () => {
  const html = `<html><body>
    <section class="facts"><p>Yapım: 1951</p><p>Orijinal Başlık: Breaking Bad</p></section>
    <div id="pembed"><iframe src="https://x.y/embed/1" data-q="1080"></iframe></div>
    <div class="eplister"><ul><li><a href="/bolum-1">Bölüm 1</a></li><li><a href="/bolum-2">Bölüm 2</a></li></ul></div>
  </body></html>`;
  const $ = cheerio.load(html);
  let bulundu = '';
  $('section.facts p').each((_, el) => {
    const t = $(el).text();
    if (t.includes('Orijinal Başlık')) bulundu = t;
  });
  assert.equal(bulundu, 'Orijinal Başlık: Breaking Bad');
  assert.equal($('div#pembed iframe').attr('src'), 'https://x.y/embed/1');
  assert.equal($('div#pembed iframe').attr('data-q'), '1080');
  assert.equal($('div.eplister ul li').length, 2);
  assert.equal($('div.eplister ul li').first().find('a').text(), 'Bölüm 1');
  assert.equal($('li > a').length, 2);
});

/* ── sandbox: modül biçimi, require haritası, XHR shim, timeout ──────────
   Testte provider kodu SAHTE fetchImpl üzerinden verilir — motorun gerçek
   indirme yolu (getIstek → kopruFetch) aynı kod yoluyla test edilir. */
function motorTestKur(kod) {
  return nuvioMotoru({ fetchImpl: async (url) => {
    if (String(url).endsWith('.js')) return new Response(kod, { status: 200 });
    return new Response('', { status: 404 });
  } });
}
test('sandbox: module.exports.getStreams yakalanır, window sızamaz, require haritası çalışır', async () => {
  const kod = `
    var CryptoJS = require('crypto-js').default || require('crypto-js');
    var cheerio = require('cheerio-without-node-native').default || require('cheerio-without-node-native');
    module.exports = {
      config: { id: 'test-sandbox' },
      getStreams: async function (tmdbId, mediaType, season, episode) {
        var dec = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse('SGVsbG8=') );
        var $ = cheerio.load('<b class="t">merhaba</b>');
        if (typeof window !== 'undefined' && window.document) throw new Error('document sizdi!');
        return [{ name: 't', title: dec + ':' + $('b.t').text() + ':' + mediaType + ':' + season + ':' + episode, url: 'https://cdn.test/v.mp4' }];
      }
    };`;
  const motorTest = motorTestKur(kod);
  const sonuc = await motorTest.scraperCagir('sandbox://t-' + Math.random().toString(36).slice(2), { id: 't-' + Math.random().toString(36).slice(2), ad: 't', filename: 't.js' }, { tmdbId: '1396', mediaType: 'tv', sezon: 1, bolum: 1 });
  assert.ok(!sonuc.hata, sonuc.hata);
  assert.equal(sonuc.streams[0].title, 'Hello:merhaba:tv:1:1');
});

test('sandbox: tanınmayan require net hata verir', async () => {
  const motorTest = motorTestKur('require("fs"); module.exports = { getStreams: async () => [] };');
  const sonuc = await motorTest.scraperCagir('sandbox://fs-' + Math.random().toString(36).slice(2), { id: 'fs-' + Math.random().toString(36).slice(2), ad: 'x', filename: 'x.js' }, { tmdbId: '1', mediaType: 'movie' });
  assert.match(sonuc.hata || '', /modül 'fs'/);
});

test('sandbox: getStreams timeout → hata-izole, satır normalizasyonu externalUrl eler', async () => {
  const motorTest = motorTestKur('module.exports = { getStreams: () => new Promise(() => {}) };');
  const sonuc = await motorTest.scraperCagir('sandbox://slow-' + Math.random().toString(36).slice(2), { id: 'slow-' + Math.random().toString(36).slice(2), ad: 'slow', filename: 's.js' }, { tmdbId: '1', mediaType: 'movie' }, 200);
  assert.match(sonuc.hata || '', /timeout/);
  assert.equal(nuvioSatiraCevir({ externalUrl: 'https://site/oynat/1', title: 'iframe' }, { ad: 'x' }), null);
  assert.equal(nuvioSatiraCevir({ url: 'magnet:?xt=1' }, { ad: 'x' }), null);
  const s = nuvioSatiraCevir({ url: 'https://cdn.x/a.m3u8', title: 'Dizipal 1080p Dublaj' }, { ad: 'x' });
  assert.equal(s.isHls, true);
  assert.equal(s.kalite, '1080p');
});

test('XHR shim: natif fetch üstünde GET + başlıklar + onreadystatechange', async () => {
  // Yerel sunucu olmadan ağ bağımsız doğrulama: fetchImpl'i sahteyle kur.
  const xhrKod = `
    module.exports = { getStreams: () => new Promise((resolve) => {
      var x = new XMLHttpRequest();
      x.open('GET', 'https://example.test/api');
      x.setRequestHeader('X-Seq', '1');
      x.timeout = 5000;
      x.onreadystatechange = function () {
        if (x.readyState === 4) resolve([{ url: 'https://cdn.test/x.mp4', title: 'xhr:' + x.responseText + ':rs' + x.status + ':hdr' + (x.getResponseHeader('set-cookie') === null) + ':url' + (x.responseURL === 'https://example.test/api') }]);
      };
      x.send();
    }) };`;
  const sahteMotor = nuvioMotoru({ fetchImpl: async (url) => String(url).endsWith('.js')
    ? new Response(xhrKod, { status: 200 })
    : new Response('CVP', { status: 200, statusText: 'OK', headers: { 'X-Test': '1', 'Set-Cookie': 'a=b' } }) });
  const sonuc = await sahteMotor.scraperCagir('sandbox://xhr-' + Math.random().toString(36).slice(2), { id: 'xhr-' + Math.random().toString(36).slice(2), ad: 'xhr', filename: 'xhr.js' }, { tmdbId: '1', mediaType: 'movie' }, 5000);
  assert.ok(!sonuc.hata, sonuc.hata);
  assert.equal(sonuc.streams[0].title, 'xhr:CVP:rs200:hdrtrue:urltrue');
});

/* depodaAra uçtan uca (sahte depo, ağ yok): manifest → kod → getStreams →
   satır geri çağrısı; eşzamanlı sınır ve hata izolasyonu da bu yolu kullanır. */
test('depodaAra: sahte depo manifestinden satıra uçtan uca', async () => {
  const repoKod = `module.exports = { getStreams: async (id, tur, s, e) => [
      { name: 'x', title: 'Film 1080p Dublaj', url: 'https://cdn.test/a.m3u8' },
      { externalUrl: 'https://site/iframe', title: 'elenmeli' }
    ] };`;
  const bozukKod = 'this is not valid javascript !!!(((';
  const motor = nuvioMotoru({ fetchImpl: async (url) => {
    if (String(url).endsWith('manifest.json')) return new Response(JSON.stringify({
      name: 'Test Deposu', version: '1',
      scrapers: [
        { id: 'ok', name: 'TestOk', filename: 'p/ok.js', supportedTypes: ['tv', 'movie'] },
        { id: 'bozuk', name: 'TestBozuk', filename: 'p/bozuk.js', supportedTypes: ['tv'] },
      ],
    }), { status: 200 });
    if (String(url).endsWith('p/ok.js')) return new Response(repoKod, { status: 200 });
    if (String(url).endsWith('p/bozuk.js')) return new Response(bozukKod, { status: 200 });
    return new Response('', { status: 404 });
  } });
  const kayit = await motor.repoManifesti('https://depo.test');
  const satirlar = [];
  const { satir, hatalar } = await motor.depodaAra('https://depo.test', kayit, { tmdbId: '1396', mediaType: 'tv', sezon: 1, bolum: 1 }, (s) => satirlar.push(s), 5000);
  assert.equal(satir, 1, 'yalnız oynatılabilir satır sayılmalı');
  assert.equal(satirlar.length, 1);
  assert.match(satirlar[0].url, /cdn\.test\/a\.m3u8/);
  assert.equal(satirlar[0].isHls, true);
  assert.equal(hatalar.length, 1, 'bozuk scraper hatası izole edilmeli');
  assert.match(hatalar[0], /TestBozuk/);
});

/* ── CANLI: patr0n Nuvio deposu, gerçek ağ (t.online) ──────────────────── */
let agVar = null;
async function agKontrol() {
  if (agVar === null) {
    try {
      const r = await fetch('https://raw.githubusercontent.com/patr0nq/nuvioaddons/refs/heads/main/manifest.json', { signal: AbortSignal.timeout(8000) });
      agVar = r.ok;
    } catch (_) { agVar = false; }
  }
  return agVar;
}

const REPO = 'https://raw.githubusercontent.com/patr0nq/nuvioaddons/refs/heads/main';

/* CANLI doğrulama (2026-10-29, gerçek ağ çıktısı):
   - patronDiziyou 1396/tv S1E1 → 2 stream, patronMulti → 4 stream (oynatılabilir).
   - patronDizipal: aktif domain (dizipal2140.com) bu ağdan erişilemiyor (000) —
     sağlayıcı hatası değil, site/ağ durumu; satır dönmezse UYARI, kıstas dışı.
   - patronSinewix: site API uçları 404 (depo tarafı bayat) — aynı muamele.
   Kıstas: en az bir provider ≥1 oynatılabilir url (diziyou+multi ile karşılanır). */
test('canlı: depo manifesti + patronDiziyou S1E1 (tmdb 1396) → oynatılabilir satır', { skip: !process.env.CP_ONLINE && 'CP_ONLINE=1 ile koşar (ağ testi)' }, async (t) => {
  if (!await agKontrol()) return t.skip('ağ yok');
  const m = nuvioMotoru({});
  const manifest = await m.repoManifesti(REPO);
  assert.ok(manifest.scrapers.length >= 5, 'manifest scraper listesi beklenenden kısa');
  const t0 = Date.now();
  let oynatilabilir = 0;
  const bilgiler = [];
  for (const adParca of ['patronDiziyou.js', 'patronMulti.js', 'patronDizipal.js', 'patronSinewix.js']) {
    const scraper = manifest.scrapers.find(s => s.filename.endsWith(adParca));
    if (!scraper) continue;
    const sonuc = await m.scraperCagir(REPO, scraper, { tmdbId: '1396', mediaType: 'tv', sezon: 1, bolum: 1 }, 30000);
    const satirlar = sonuc.hata ? [] : sonuc.streams.map(a => nuvioSatiraCevir(a, scraper)).filter(Boolean);
    oynatilabilir += satirlar.length;
    bilgiler.push(`${scraper.ad}: ${Date.now() - t0}ms ${sonuc.hata || satirlar.length + ' satır'}`);
    console.log(`[canlı] ${scraper.ad}:`, sonuc.hata || `${satirlar.length} oynatılabilir satır`);
    if (satirlar[0]) console.log(`[canlı] ${scraper.ad} örnek:`, satirlar[0].url.slice(0, 90), '|', satirlar[0].baslik.slice(0, 50));
  }
  assert.ok(oynatilabilir >= 1, 'hiçbir provider oynatılabilir satır dönmedi — ' + bilgiler.join(' ; '));
});

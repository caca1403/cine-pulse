/* VIXEN çekirdeği — çevrimdışı sözleşme testi (ağ KULLANILMAZ).
   Ölçülen gerçek ustalık (2026-11-17 canlı): ID-anahtarlı /vs/{imdb}[/sN/eEE]
   ucu #EXTM3U döner; TYPE=AUDIO Türkçe + English, TYPE=SUBTITLES Türkçe,
   iki RESOLUTION varyantı. Çekirdek bundan doğru etiketli satırlar üretir. */
import test from 'node:test';
import assert from 'node:assert/strict';

let aktifFetch = async () => { throw new Error('testte ağ kapalı'); };
globalThis.fetch = (g, o) => aktifFetch(g, o);

const { getStreams, manifestIzleri } = await import('../src/providers/cekirdekler/vixen.js');

const MASTER = [
  '#EXTM3U',
  '# Info: HLS8',
  '#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio0",NAME="Türkçe",LANGUAGE="tr",AUTOSELECT=NO,DEFAULT=NO,CHANNELS="2",URI="https://ha.vixolity.com/mm/tt4574334/s1/e01/main_1080/index-a1.gif"',
  '#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio0",NAME="English",LANGUAGE="en",AUTOSELECT=NO,DEFAULT=YES,CHANNELS="2",URI="https://ha.vixolity.com/mm/tt4574334/s1/e01/main_1080/index-a2.gif"',
  '#EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="subs0",NAME="Türkçe",LANGUAGE="tr",AUTOSELECT=NO,DEFAULT=NO,URI="https://ha.vixolity.com/vtt/tt4574334/s1/e01/sub_tr.gif"',
  '#EXT-X-STREAM-INF:BANDWIDTH=5200000,RESOLUTION=1920x960,AUDIO="audio0",SUBTITLES="subs0"',
  'https://ha.vixolity.com/mm/tt4574334/s1/e01/main_1080/index-v1-a2.gif',
  '#EXT-X-STREAM-INF:BANDWIDTH=1200000,RESOLUTION=854x427,AUDIO="audio0",SUBTITLES="subs0"',
  'https://ha.vixolity.com/mm/tt4574334/s1/e01/main_480/index-v1-a2.gif',
].join('\n');

const yanit = (govde, durum = 200) => ({
  ok: durum < 300, status: durum,
  text: async () => govde,
  json: async () => JSON.parse(govde),
  headers: { get: () => null },
});

test('manifestIzleri: Türkçe ses + çift dil + TR altyazı + varyantlar', () => {
  const iz = manifestIzleri(MASTER);
  assert.equal(iz.ses.length, 2);
  assert.ok(iz.ses.some((t) => t.dil === 'tr'));
  assert.ok(iz.ses.some((t) => t.dil === 'en'));
  assert.equal(iz.yazi.length, 1);
  assert.equal(iz.yazi[0].dil, 'tr');
  assert.equal(iz.varyantlar.length, 2);
  assert.equal(iz.varyantlar[0].yukseklik, 960);
});

test('getStreams dizi: sezon sıfırsız / bölüm iki haneli yol + master+varyant satırları', async () => {
  const istenen = [];
  aktifFetch = async (u) => {
    if (String(u).includes('external_ids')) return yanit(JSON.stringify({ imdb_id: 'tt4574334' }));
    istenen.push(String(u));
    if (String(u).includes('/vs/tt4574334/s2/e03')) return yanit(MASTER);
    return yanit('404', 404);
  };
  const satirlar = await getStreams('66732', 'tv', 2, 3);
  assert.ok(istenen.some((u) => u.includes('/vs/tt4574334/s2/e03')), 'yol /s2/e03 biçiminde olmalı (ölçüldü: /s02 404)');
  assert.equal(satirlar.length, 3, 'master + 1080p + 480p');
  const master = satirlar[0];
  assert.match(master.title, /Otomatik/);
  assert.match(master.title, /Dublaj/);
  assert.equal(master.trSes, true);
  assert.equal(master.trAltyazi, true);
  assert.equal(master.ciftSes, true);
  assert.deepEqual(master.diller, ['tr', 'altyazi']);
  assert.equal(master.headers.Referer, 'https://hdfilmdelisi.one/');
  assert.equal(master.format, 'm3u8');
  assert.ok(satirlar.some((s) => s.quality === '1080p' || s.quality === '4K'));
  assert.ok(satirlar.some((s) => s.quality === '480p'));
});

test('getStreams film: tek varyantta /vs/{imdb} yolu, tek satır', async () => {
  aktifFetch = async (u) => {
    if (String(u).includes('themoviedb.org')) return yanit(JSON.stringify({ imdb_id: 'tt1375666' }));
    if (String(u).includes('/vs/tt1375666')) return yanit('#EXTM3U\n#EXT-X-MEDIA:TYPE=AUDIO,LANGUAGE="tr",NAME="Türkçe"\n#EXT-X-STREAM-INF:RESOLUTION=1280x720\nmain/index-v1-a1.gif\n');
    return yanit('404', 404);
  };
  const satirlar = await getStreams('27205', 'movie');
  assert.equal(satirlar.length, 1);
  assert.match(satirlar[0].url, /main\/index-v1-a1\.gif$/);
  assert.equal(satirlar[0].trSes, true);
  assert.match(satirlar[0].title, /720p/);
});

test('getStreams: katalogda yoksa (404) → boş dizi, throw YOK', async () => {
  aktifFetch = async (u) => {
    if (String(u).includes('themoviedb.org') || String(u).includes('external_ids')) return yanit(JSON.stringify({ imdb_id: 'tt0000001' }));
    return yanit('404 Not Found', 404);
  };
  const satirlar = await getStreams('999999', 'movie');
  assert.deepEqual(satirlar, []);
});

test('getStreams: imdb çözülemezse → boş dizi (uydurma istek yok)', async () => {
  aktifFetch = async () => yanit(JSON.stringify({ imdb_id: null }));
  assert.deepEqual(await getStreams('888888', 'tv', 1, 1), []);
});

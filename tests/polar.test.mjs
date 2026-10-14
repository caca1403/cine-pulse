import test from 'node:test';
import assert from 'node:assert/strict';
import { coz, adaySec, sezonBolum } from '../src/providers/polar.js';

// Kutup (belgesel/çocuk) — REST kimlik kapısı + packer + bayt probe sahte sunucuyla.
// Packer kipi sitenin ölçülen sayısıyla birebir aynıdır (e(c)=c sanal varyant,
// sources:[{…}] jwplayer ayarı, \/ kaçışlı).
const AKIS = 'https://cdn.test/storage/media/abc-720.mp4/gomindex.m3u8';
const KURULUM = 'jwplayer("oynatici").setup({sources:[{"file":"https:\\/\\/cdn.test\\/storage\\/media\\/abc-720.mp4\\/gomindex.m3u8","label":"720p","type":"video\\/mp4"}],image:""});';

function paketle(acik) {
  const kws = ['jwplayer', 'setup'];
  let p = acik;
  kws.forEach((w, i) => { p = p.split(w).join(String(i)); });
  return `eval(function(p,a,c,k,e,d){e=function(c){return c};return p}('${p}',10,${kws.length},'${kws.join('|')}'.split('|'),0,{}))`;
}

const post = (id, rendered) => ({ id, title: { rendered }, url: `https://dizi.test/p/${id}` });
const MAVI = [
  post(299793, 'Bluey 2. Sezon 50. Bölüm'),
  post(299797, 'Bluey 2. Sezon 51. Bölüm'),
  post(111, 'Bluey: Sihirli Ksilofon'),
  post(222, 'Bluey 3. Sezon 51. Bölüm'),
];
const IFRAME = JSON.stringify({ success: true, data: '<iframe src="https://player.test/embed/24507.mp4" allowfullscreen></iframe>' });

async function run(args, { posts = MAVI, ajax = IFRAME, paket = `<html><body><script>${paketle(KURULUM)}</script></body></html>`, probe = '#EXTM3U\n#EXT-X-TARGETDURATION:10\n#EXTINF:10,\nseg.ts\n#EXT-X-ENDLIST\n' } = {}) {
  const once = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes('/wp-json/wp/v2/search')) return new Response(JSON.stringify(posts));
    if (url.includes('admin-ajax.php')) return new Response(ajax);
    if (url.includes('/embed/')) return new Response(paket);
    if (url.includes('gomindex.m3u8')) return new Response(probe);
    return new Response(`<html>${'x'.repeat(600)}</html>`);
  };
  try {
    const r = await coz({ signal: AbortSignal.timeout(4000), ...args });
    return { n: r.sources.length, ilk: r.sources[0], trace: r.trace };
  } finally { globalThis.fetch = once; }
}

test('bölüm ayracı: "Ad N. Sezon M. Bölüm" kalıbını çözer; kalıpsız başlık null', () => {
  assert.deepEqual(sezonBolum('Planet Earth II 1. Sezon 6. Bölüm'), { s: 1, e: 6, seri: 'planet earth ii' });
  assert.deepEqual(sezonBolum('Bluey 2. Sezon 51. Bölüm'), { s: 2, e: 51, seri: 'bluey' });
  assert.equal(sezonBolum('Bluey: Sihirli Ksilofon'), null);
});

test('kimlik kapısı: birebir seri + birebir S/E; önek ve yanlış S/E reddedilir', () => {
  assert.equal(adaySec(MAVI, ['Bluey'], 2, 51).postId, 299797);
  assert.equal(adaySec(MAVI, ['Bluey'], 2, 49), null);
  assert.equal(adaySec([post(9, 'Bluey Evreni 2. Sezon 51. Bölüm')], ['Bluey'], 2, 51), null);
  assert.equal(adaySec(MAVI, ['Mavi'], 2, 51), null);
});

test('doğru bölüm: packer + probe zinciri tek doğrulanmış m3u8 üretir', async () => {
  const r = await run({ type: 'tv', title: 'Bluey', originalTitle: 'Bluey', season: 2, episode: 51 });
  assert.equal(r.n, 1, JSON.stringify(r.trace));
  assert.equal(r.ilk.url, AKIS);
  assert.equal(r.ilk.quality, '720p');
  assert.equal(r.ilk.category, 'subtitled');
  assert.equal(r.ilk.headers.Referer, 'https://player.test/');
});

test('yanlış sezon/bölüm: kimlik-yok ile sessiz düşer, oynatıcıya gitmez', async () => {
  const r = await run({ type: 'tv', title: 'Bluey', originalTitle: 'Bluey', season: 7, episode: 1 });
  assert.equal(r.n, 0);
  assert.ok(r.trace.some((x) => x.ad === 'kimlik-yok'));
});

test('canlı doğrulanan elenis: "pocahontas" aramasındaki ilgisiz kart gibi önek/alakasız eşleşme RED', async () => {
  const r = await run(
    { type: 'tv', title: 'Bluey', originalTitle: 'Bluey', season: 2, episode: 51 },
    { posts: [post(5, 'Bluey Evreni 2. Sezon 51. Bölüm')] },
  );
  assert.equal(r.n, 0);
});

test('ölü akış (probe HTML döner) listelenmez', async () => {
  const r = await run(
    { type: 'tv', title: 'Bluey', originalTitle: 'Bluey', season: 2, episode: 51 },
    { probe: '<!DOCTYPE html><html><body>Yayın yok</body></html>' },
  );
  assert.equal(r.n, 0);
  assert.ok(r.trace.some((x) => x.ad === 'akis-yanlis'));
});

test('oynatıcı boşsa (iframe-yok) ve paket sayfası ölüyse (paket-yok) 0 döner', async () => {
  const bos = await run(
    { type: 'tv', title: 'Bluey', originalTitle: 'Bluey', season: 2, episode: 51 },
    { ajax: JSON.stringify({ success: false, data: '' }) },
  );
  assert.equal(bos.n, 0);
  assert.ok(bos.trace.some((x) => x.ad === 'iframe-yok'));
  const olu = await run(
    { type: 'tv', title: 'Bluey', originalTitle: 'Bluey', season: 2, episode: 51 },
    { paket: '' },
  );
  assert.equal(olu.n, 0);
  assert.ok(olu.trace.some((x) => x.ad === 'paket-yok'));
});

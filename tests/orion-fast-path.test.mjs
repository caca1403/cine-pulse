import test from 'node:test';
import assert from 'node:assert/strict';
import { coz } from '../src/providers/orion.js';
import { ciftDilKopyalari } from '../src/services/providerAggregator.js';

test('Orion exact episode resolves without search or repeated episode requests', async () => {
  const previous = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async url => {
    requests.push(String(url));
    if (String(url).includes('siteurl.txt')) return new Response('hdfilmcehennemi:https://provider.example');
    if (String(url).includes('/sezon-1/bolum-1/')) return new Response(
      '<html><h1>Stranger Things</h1><a href="/dizi/stranger-things-izle-3/sezon-1/bolum-1/">Bölüm</a>' +
      '<iframe src="https://player.example/embed/1"></iframe></html>');
    if (String(url) === 'https://player.example/embed/1') return new Response(
      '<script>var stream="https://cdn.example/stranger-things-dual/master.m3u8";</script>');
    throw new Error(`Unexpected request: ${url}`);
  };
  try {
    const result = await coz({ type: 'tv', title: 'Stranger Things', season: 1, episode: 1, tmdbId: 66732 });
    assert.equal(result.sources.length, 1);
    assert.equal(result.sources[0].category, 'dubbed');
    assert.equal(result.sources[0].isDual, true);
    assert.equal(requests.length, 3);
    assert.ok(result.sources.every(s => s.isHls && !s.isIframe));
    assert.ok(result.sources.every(s => s.headers.Referer === 'https://player.example/'));
  } finally { globalThis.fetch = previous; }
});

test('Orion lists every player host as its own source', async () => {
  const previous = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async url => {
    requests.push(String(url));
    const u = String(url);
    if (u.includes('siteurl.txt')) return new Response('hdfilmcehennemi:https://provider.example');
    if (u.includes('/sezon-1/bolum-1/') || u.endsWith('/film/')) return new Response(
      '<html><h1>Stranger Things</h1><iframe src="https://closeload.example/embed/1"></iframe>' +
      '<button class="alternative-link" data-video="77">Rapidrame</button>' +
      '<button class="alternative-link" data-video="88">Vidmo</button></html>');
    if (u.includes('/video/77/')) return new Response(JSON.stringify(
      { data: { html: '<iframe src="https://rapid.example/embed/77"></iframe>' } }));
    if (u.includes('/video/88/')) return new Response(JSON.stringify(
      { data: { html: '<iframe src="https://vidmo.example/embed/88"></iframe>' } }));
    if (u === 'https://closeload.example/embed/1') return new Response(
      '<script>var stream="https://cdn.example/film-closeload.mp4/master.m3u8";</script>');
    if (u === 'https://rapid.example/embed/77') return new Response(
      '<script>var stream="https://cdn.example/film-rapid.mp4/master.m3u8";</script>');
    if (u === 'https://vidmo.example/embed/88') return new Response('<html>çözülemedi</html>');
    throw new Error(`Unexpected request: ${url}`);
  };
  try {
    const result = await coz({ type: 'movie', title: 'Film', tmdbId: 1 });
    assert.equal(result.sources.length, 2, JSON.stringify(result.trace));
    assert.deepEqual(result.sources.map(s => s.url), [
      'https://cdn.example/film-closeload.mp4/master.m3u8',
      'https://cdn.example/film-rapid.mp4/master.m3u8',
    ]);
    assert.notEqual(result.sources[0].id, result.sources[1].id);
  } finally { globalThis.fetch = previous; }
});

test('a dual stream is offered in both language lanes', () => {
  const dub = { id: 'x_dub_1', streamUrl: 'https://cdn.example/film-dual/master.m3u8', category: 'dubbed', isDual: true };
  const plain = { id: 'x_dub_2', streamUrl: 'https://cdn.example/film-tr.mp4', category: 'dubbed' };
  const kopyalar = ciftDilKopyalari([dub, plain], 'subtitled');
  assert.equal(kopyalar.length, 1);
  assert.equal(kopyalar[0].category, 'subtitled');
  assert.equal(kopyalar[0].id, 'x_dub_1_xs');
});


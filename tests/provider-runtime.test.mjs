import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveDirectPlayback } from '../src/services/providerRuntime/playback.js';
import { deviceMediaUrl, unwrapStreamUrl } from '../src/services/providerRuntime/contract.js';
import { runProviderFlow } from '../src/services/providerRuntime/flow.js';
import { checkProviderAdapters } from '../src/services/providerRuntime/inventory.js';
import { probeStream } from '../src/services/providerRuntime/probe.js';

test('every builtin adapter resolves to an existing implementation', async () => {
  assert.deepEqual(await checkProviderAdapters(), []);
});
test('embedded player resolves to direct media with playback headers', async () => {
  const source = await resolveDirectPlayback({ url: 'https://player.test/embed/1', isIframe: true }, {
    extract: async () => ({ url: 'https://cdn.test/master.m3u8', referer: 'https://player.test/', headers: { Authorization: 'fixture' } }),
  });
  assert.equal(source.isIframe, false);
  const target = new URL(source.url, 'https://localhost');
  assert.equal(target.searchParams.get('ref'), 'https://player.test/');
  assert.equal(JSON.parse(target.searchParams.get('headers')).Authorization, 'fixture');
});
test('failed embed is not listed as a working source', async () => {
  const events = [];
  const source = await resolveDirectPlayback({ url: 'https://player.test/embed', isIframe: true }, { extract: async () => null, diagnose: event => events.push(event) });
  assert.equal(source, null);
  assert.equal(events[0].reason, 'direct-media-not-found');
});
test('WebView network capture is an extractor fallback', async () => {
  const source = await resolveDirectPlayback({ url: 'https://player.test/embed', isIframe: true }, {
    extract: async () => null,
    webView: async () => ({ finalUrl: 'https://player.test/embed', streams: [{ url: 'https://cdn.test/movie.mp4' }] }),
  });
  assert.equal(source.rawStreamUrl, 'https://cdn.test/movie.mp4');
  assert.equal(source.isIframe, false);
});
test('media proxy is unwrapped without losing upstream query', () => {
  const upstream = 'https://cdn.test/manifest.m3u8?token=x&lang=tr';
  assert.equal(unwrapStreamUrl(deviceMediaUrl(upstream, { Referer: 'https://provider.test/' })), upstream);
});
test('flow language selects the exact title and emits direct media', async () => {
  const flow = { format: 'cinepulse-flow/1', id: 'fixture', baseUrl: 'https://provider.test', mediaTypes: ['movie'], steps: [
    { op: 'request', url: '{{base}}/search?q={{title:url}}', save: 'page' },
    { op: 'links', from: 'page', save: 'items' },
    { op: 'select', from: 'items', save: 'item' },
    { op: 'extract', url: '{{item.url}}', save: 'media' }, { op: 'emit', from: 'media' },
  ] };
  const sources = await runProviderFlow(flow, { type: 'movie', title: 'Başlangıç' }, {
    request: async url => { assert.ok(url.includes('Ba%C5%9Flang%C4%B1%C3%A7')); return new Response('<a href="/wrong">Başka Film</a><a href="/correct">Başlangıç</a>'); },
    extract: async url => { assert.equal(url, 'https://provider.test/correct'); return { url: 'https://cdn.test/movie.m3u8' }; },
  });
  assert.equal(sources.length, 1);
  assert.equal(sources[0].isIframe, false);
});
test('a successful playlist with a failed segment does not pass transport verification', async () => {
  const result = await probeStream({ url: 'https://cdn.test/master.m3u8' }, {
    fetcher: async url => url.endsWith('.m3u8') ? new Response('#EXTM3U\n#EXTINF:8,\nsegment.ts\n') : new Response('Forbidden', { status: 403 }),
  });
  assert.equal(result.state, 'failed');
  assert.equal(result.reason, 'HTTP 403');
});
test('AES key and first segment are checked as well as the playlist', async () => {
  const targets = [];
  const result = await probeStream({ url: 'https://cdn.test/master.m3u8' }, {
    fetcher: async url => {
      targets.push(url);
      if (url.endsWith('.m3u8')) return new Response('#EXTM3U\n#EXT-X-KEY:METHOD=AES-128,URI="key.bin"\n#EXTINF:8,\nsegment.ts\n');
      return new Response(new Uint8Array(url.endsWith('key.bin') ? 16 : 1024));
    },
  });
  assert.equal(result.state, 'transport-verified');
  assert.deepEqual(result.checks, ['playlist', 'aes-key', 'segment']);
  assert.equal(targets.length, 3);
});

test('bePlayer salted CryptoJS JSON is decoded, including relative subtitles', async () => {
  const { default: CryptoJS } = await import('../src/vendor/crypto-js.js');
  const { extractEmbedStream } = await import('../src/services/embedExtractors.js');
  const formatter = {
    stringify(params) {
      return JSON.stringify({ ct: params.ciphertext.toString(CryptoJS.enc.Base64), iv: params.iv.toString(), s: params.salt.toString() });
    }
  };
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ video_location: 'https://cdn.test/movie.m3u8', strSubtitles: [{ label: 'Türkçe', file: '/sub/tr.vtt' }] }), 'fixture-password', { format: formatter, salt: CryptoJS.enc.Hex.parse('0011223344556677') }).toString();
  const html = `<script>bePlayer('fixture-password','${encrypted}',1);</script>${' '.repeat(600)}`;
  const source = await extractEmbedStream('https://dosyaload.test/embed/1', 'https://dizify.org/', new Set(), Date.now() + 5000, html);
  assert.equal(source?.url, 'https://cdn.test/movie.m3u8');
  assert.equal(source.subtitles[0].src, 'https://dosyaload.test/sub/tr.vtt');
});

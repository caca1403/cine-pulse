import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractVidMoly, pichiveToMaster, extractPichive, scxDecode,
  decodeRapidvidAv, extractRapidvid, extractSubtitles, extractDirectVideo,
} from '../src/services/directStreamExtractor.js';

test('vidmoly file kaynagindan m3u8 cikarir', () => {
  const html = `<script>var player={sources:[{file:"https://vidmoly.to/hls/abc/master.m3u8"}]};</script>`;
  const r = extractVidMoly(html);
  assert.equal(r.videoUrl, 'https://vidmoly.to/hls/abc/master.m3u8');
  assert.equal(r.isHls, true);
});

test('pichive m.php master.m3u8 olur', () => {
  assert.equal(
    pichiveToMaster('https://four.pichive.online/m.php?v=246acb78ec3753ce50ab0e5fd52d75ee'),
    'https://four.pichive.online/master.m3u8?v=246acb78ec3753ce50ab0e5fd52d75ee'
  );
  const r = extractPichive(`<script>window.openPlayer('https://pichive.online/m.php?v=abc123');</script>`);
  assert.equal(r.videoUrl, 'https://pichive.online/master.m3u8?v=abc123');
});

test('scx cozumu python ile birebir (gercek vektor)', () => {
  // Vektor: api/providers/fullhdfilmizlesene.scx_decode ile uretildi.
  assert.equal(
    scxDecode('hOY0jOT6Sf9fFEIwGOGwGJ5bGEXcGZ9oFtTeTqUFDCv=', 7),
    'https://rapidvid.net/e/abc123XYZ'
  );
});

test('rapidvid av tokeni cozulur', () => {
  const html = `<script>av("aHR0cHM6Ly9leGFtcGxlLmNvbS92aWRlby5tM3U4");</script>`;
  const r = extractRapidvid(html);
  assert.equal(r.videoUrl, 'https://example.com/video.m3u8');
  assert.equal(r.isHls, true);
});

test('altyazi parcalari cikarilir', () => {
  const subs = extractSubtitles(`{file:"https://x/y.vtt",label:"Türkçe"}`);
  assert.equal(subs.length, 1);
  assert.equal(subs[0].label, 'Türkçe');
});

test('bos/bot sayfada null doner, dusmez', () => {
  assert.equal(extractDirectVideo(''), null);
  assert.equal(extractDirectVideo('<title>Just a moment...</title>'), null);
});

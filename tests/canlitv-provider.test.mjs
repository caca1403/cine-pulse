import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCanliPlayer, resolveCanliChannel } from '../api/_canlitv.js';

test('HLS preserves the signature query', () => {
 const r=parseCanliPlayer('file: "https://cdn.example.com/live.m3u8?hash=abc&amp;token=x"');
 assert.equal(r.url,'https://cdn.example.com/live.m3u8?hash=abc&token=x');
 assert.equal(r.kind,'hls');
});
test('TRT 1 Tabii route selects the public TRT feed', () => {
 const r=parseCanliPlayer('<a href="https://www.tabii.com/tr/watch/live/trt1?trackId=150002">TRT 1</a>');
 assert.equal(r.kind,'tabii-public');assert.equal(r.referer,'https://www.trt1.com.tr/');
});
test('YouTube live uses the actual video id', () => {
 const r=parseCanliPlayer('<iframe src="https://www.youtube.com/embed/pqq5c6k70kk?autoplay=1"></iframe>');
 assert.equal(r.kind,'youtube');assert.equal(r.videoId,'pqq5c6k70kk');
});
test('external embeds and official watch links have distinct routes', () => {
 assert.equal(parseCanliPlayer('<iframe src="https://radyolar.top/haberturk.html"></iframe>').kind,'embed');
 assert.equal(parseCanliPlayer('<a href="https://www.atv.com.tr/canli-yayin" title="ATV canlı yayını">').kind,'external');
});
test('unsupported source and invalid channel fail explicitly', async () => {
 assert.throws(()=>parseCanliPlayer('<html>no broadcast</html>'),/doğrudan yayın/);
 await assert.rejects(resolveCanliChannel('../admin'),/Invalid channel/);
});

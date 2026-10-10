import test from 'node:test';
import assert from 'node:assert/strict';
import { isSzdEpisodePath, injectSzdPlayerFrame } from '../server/playerFrameInject.js';

const page = `<html><head><title>Breaking Bad 1.Sezon 1.Bolum izle</title><meta name="description" content="${'x'.repeat(400)}"></head><body><header>menu navigasyon alani</header><div id="playerMenu">dil secimi dublaj altyazi menusu</div><div id="embed"><iframe src="https://x/player"></iframe></div><div class="comments">yorumlar tartismalar bolumu</div></body></html>`;

test('bolum yolu taninir', () => {
  assert.equal(isSzdEpisodePath('/breaking-bad/1-sezon-1-bolum.html'), true);
  assert.equal(isSzdEpisodePath('/film/abc.html'), false);
});

test('enjeksiyon base + css + secici ekler, icerigi korur', () => {
  const out = injectSzdPlayerFrame(page, { alternativeId: '608292' });
  // Site-relative adresler yan sunucuya baglanir: AJAX'lar ayni-kaynak olur.
  assert.match(out, /<base href="\/api\/szd\/">/);
  assert.match(out, /data-cinepulse-frame/);
  assert.match(out, /data-cinepulse-isolate/);
  assert.match(out, /608292/);
  assert.match(out, /<div id="embed">/);
  assert.doesNotMatch(out, /<base href="https:\/\/sezonlukdizi\.cc\/">/);
});

test('var olan base etiketi de yan sunucuya yonlendirilir', () => {
  const withBase = page.replace('<head>', '<head><base href="https://sezonlukdizi.cc/">');
  const out = injectSzdPlayerFrame(withBase, { alternativeId: '' });
  assert.match(out, /<base href="\/api\/szd\/">/);
  assert.equal(out.match(/<base /g).length, 1);
});

test('kisa/bos html oldugu gibi doner', () => {
  assert.equal(injectSzdPlayerFrame('', {}), '');
  assert.equal(injectSzdPlayerFrame('abc', {}), 'abc');
});

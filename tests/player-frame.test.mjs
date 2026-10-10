import test from 'node:test';
import assert from 'node:assert/strict';
import { frameUrlFor, sandboxFor, isPageEmbed, getFrameProfile } from '../src/services/playerFrame.js';

test('szd sayfasi oynatici capasina kayar', () => {
  const u = 'https://sezonlukdizi.cc/breaking-bad/1-sezon-1-bolum.html?cpAlternative=1';
  assert.equal(frameUrlFor(u), u + '#embed');
  assert.equal(isPageEmbed(u), true);
});

test('player sayfalari oldugu gibi kalir', () => {
  const u = 'https://four.pichive.online/iframe.php?v=abc';
  assert.equal(frameUrlFor(u), u);
  assert.equal(isPageEmbed(u), false);
  assert.equal(getFrameProfile('https://example.com/x'), null);
});

test('sandbox kacislari kapatir, oynaticicya izin verir', () => {
  const sb = sandboxFor('https://sezonlukdizi.cc/x.html');
  assert.match(sb, /allow-scripts/);
  assert.match(sb, /allow-same-origin/);
  assert.doesNotMatch(sb, /allow-popups/);
  assert.doesNotMatch(sb, /allow-top-navigation/);
  assert.doesNotMatch(sb, /allow-downloads/);
});

test('masaustu sayfa-embed yan sunucu cercevesine doner', async () => {
  const { desktopFrameUrl } = await import('../src/services/playerFrame.js');
  const u = desktopFrameUrl('https://sezonlukdizi.cc/breaking-bad/1-sezon-1-bolum.html?cpAlternative=1');
  assert.equal(u, 'http://127.0.0.1:4000/api/szd/breaking-bad/1-sezon-1-bolum.html?cpAlternative=1&frame=1');
  assert.equal(desktopFrameUrl('https://four.pichive.online/iframe.php?v=x'), 'https://four.pichive.online/iframe.php?v=x');
});

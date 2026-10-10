import test from 'node:test';
import assert from 'node:assert/strict';
import { withEmbedAnchor } from '../src/services/sezonlukDiziScraper.js';

test('sayfa embed URL oyuncuya capalanir', () => {
  const u = 'https://sezonlukdizi.cc/breaking-bad/1-sezon-1-bolum.html?cpAlternative=608292&cpLanguage=1';
  assert.equal(withEmbedAnchor(u), u + '#embed');
});

test('capasi olana dokunulmaz, bos guvenli doner', () => {
  assert.equal(withEmbedAnchor('https://x.cc/a.html#embed'), 'https://x.cc/a.html#embed');
  assert.equal(withEmbedAnchor(''), '');
  assert.equal(withEmbedAnchor(null), null);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveEntryHash } from '../src/services/kabuk/entryRoute.js';

// KULLANICI KARARI (2026-11-18: "sitenin sonuna yazarak #home falan girişi
// de kapat"): web YİNE vitrine kilitli. Elle yazılan #home/#library/#detail
// dahil her web girişi tanıtım sayfasına (#showcase) düşer; uygulama
// rotaları tarayıcıda açılmaz. Oynatma yalnızca paketlerde (EXE/APK).
test('every web entry is locked to the showcase (typed hashes included)', () => {
  assert.equal(resolveEntryHash('', false), '#showcase');
  for (const hash of ['#home', '#library', '#detail?type=tv&id=1396', '#showcase', '#downloads']) {
    assert.equal(resolveEntryHash(hash, false), '#showcase');
  }
});

test('native apps always bypass the web-only introduction', () => {
  assert.equal(resolveEntryHash('', true), '#home');
  assert.equal(resolveEntryHash('#showcase', true), '#home');
  assert.equal(resolveEntryHash('#detail?type=movie&id=157336', true), '#detail?type=movie&id=157336');
});

test('room invitations land on the showcase on web too', () => {
  assert.equal(resolveEntryHash('', false, true), '#showcase');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveEntryHash } from '../src/services/kabuk/entryRoute.js';

// KULLANICI KARARI (2026-11-10: "webde tam oynatma"): web artık vitrine
// kilitli DEĞİL. Ölçüm: tarayıcıda #detail?tipe=movie&id=155 → 27 kaynak +
// HLS ile gerçek oynatma. Vitrin yalnızca açıkça istendiğinde geliyor.
test('plain web visits open the app and explicit links survive (full web playback)', () => {
  assert.equal(resolveEntryHash('', false), '#home');
  for (const hash of ['#home', '#library', '#detail?type=tv&id=1396', '#showcase']) {
    assert.equal(resolveEntryHash(hash, false), hash);
  }
});

test('native apps always bypass the web-only introduction', () => {
  assert.equal(resolveEntryHash('', true), '#home');
  assert.equal(resolveEntryHash('#showcase', true), '#home');
  assert.equal(resolveEntryHash('#detail?type=movie&id=157336', true), '#detail?type=movie&id=157336');
});

test('room invitations retain their content entry point', () => {
  assert.equal(resolveEntryHash('', false, true), '#home');
});

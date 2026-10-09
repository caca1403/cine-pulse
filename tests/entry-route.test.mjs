import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveEntryHash } from '../src/services/entryRoute.js';

test('plain web visits open the landing page and explicit content links survive', () => {
  assert.equal(resolveEntryHash('', false), '#showcase');
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

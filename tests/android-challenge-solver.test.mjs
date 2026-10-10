import test from 'node:test';
import assert from 'node:assert/strict';
import { ensureChallengeCookies, hasChallengeSession, looksLikeChallenge } from '../src/services/platform/androidChallengeSolver.js';

test('challenge HTML tespiti', () => {
  assert.equal(looksLikeChallenge('<title>Just a moment...</title>'), true);
  assert.equal(looksLikeChallenge('challenge-platform'), true);
  assert.equal(looksLikeChallenge('<html><body>Normal sayfa</body></html>'), false);
  assert.equal(looksLikeChallenge(''), false);
});

test('native disi ortamda sessizce bos doner (mevcut davranis korunur)', async () => {
  assert.equal(await ensureChallengeCookies('https://www.hdfilmcehennemi.nl'), '');
  assert.equal(await hasChallengeSession('https://www.hdfilmcehennemi.nl'), false);
});

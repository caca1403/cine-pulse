import test from 'node:test';
import assert from 'node:assert/strict';
import { ensureChallengeCookies, hasChallengeSession, looksLikeChallenge } from '../src/services/platform/androidChallengeSolver.js';

test('challenge HTML tespiti', () => {
  assert.equal(looksLikeChallenge('<title>Just a moment...</title>'), true);
  // 'challenge-platform' YASAKLILAR listesinde (2026-10-29 dersi): Cloudflare
  // bu scripti NORMAL sayfalara da enjekte ediyor → her gerçek sayfa challenge
  // sanılıp reddediliyordu. Yalnız açık challenge metinleri işaret sayılır.
  assert.equal(looksLikeChallenge('<script src="/cdn-cgi/challenge-platform/scripts/jsd/main.js"></script><html><body>gerçek içerik</body></html>'), false, 'challenge-platform tek başına challenge değildir');
  assert.equal(looksLikeChallenge('cf-chl'), true);
  assert.equal(looksLikeChallenge('<html><body>Normal sayfa</body></html>'), false);
  assert.equal(looksLikeChallenge(''), false);
});

test('native disi ortamda sessizce bos doner (mevcut davranis korunur)', async () => {
  assert.equal(await ensureChallengeCookies('https://www.hdfilmcehennemi.nl'), '');
  assert.equal(await hasChallengeSession('https://www.hdfilmcehennemi.nl'), false);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { hasNativeWebViewResolver, resolvePageInNativeWebView, looksBlocked } from '../src/services/platform/androidWebViewResolver.js';

test('masaustu/webde cozumleyici yok sayilir', () => {
  assert.equal(hasNativeWebViewResolver(), false);
});

test('kokpru yoksa null doner (APK disi ortam sessizce gecer)', async () => {
  const result = await resolvePageInNativeWebView('https://example.com/');
  assert.equal(result, null);
});

test('challenge sayfalari engelli sayilir', () => {
  assert.equal(looksBlocked({ challenge: true, html: '<html>x</html>' }), true);
  assert.equal(looksBlocked(null), true);
  assert.equal(looksBlocked({ html: '<html><body>Just a moment...</body></html>' }), true);
  assert.equal(looksBlocked({ html: '<html><body>Enable JavaScript and cookies to continue</body></html>' }), true);
  assert.equal(looksBlocked({ html: `<html><body>${'x'.repeat(3000)}</body></html>` }), false);
});

test('cevap yoksa zaman asimi sessizce null verir', async () => {
  const started = Date.now();
  const result = await resolvePageInNativeWebView('https://example.com/', { timeoutMs: 100 });
  assert.equal(result, null);
  assert.ok(Date.now() - started < 5000);
});
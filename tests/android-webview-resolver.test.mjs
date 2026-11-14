import test from 'node:test';
import assert from 'node:assert/strict';
import { hasNativeWebViewResolver, resolvePageInNativeWebView, looksBlocked } from '../src/services/platform/androidWebViewResolver.js';

test('masaustu/webde cozumleyici yok sayilir', () => {
  assert.equal(hasNativeWebViewResolver(), false);
});

test('Electron gizli Chromium resolver provider köprüsüne bağlanır ve oturum çerezlerini döndürür', async () => {
  const previousWindow = globalThis.window;
  const calls = [];
  globalThis.window = {
    CinePulseDesktop: {
      isDesktop: true,
      ghostResolve: async (url, options) => {
        calls.push({ url, options });
        return {
          ok: true,
          url: 'https://provider.example/episode',
          html: `<html>${'resolved'.repeat(200)}</html>`,
          cookies: [{ name: 'cf_clearance', value: 'session-value', domain: '.provider.example' }]
        };
      }
    }
  };
  try {
    assert.equal(hasNativeWebViewResolver(), true);
    const result = await resolvePageInNativeWebView('https://provider.example/episode', {
      timeoutMs: 8000,
      media: true,
      referer: 'https://provider.example/'
    });
    assert.equal(result.finalUrl, 'https://provider.example/episode');
    assert.equal(result.text, result.html);
    assert.equal(result.cookies[0].name, 'cf_clearance');
    /* ZAMAN KIRILGANLIĞI (2026-11-14 ölçümü): üretim kodu kalan süreyi
       `deadline - Date.now()` ile hesaplıyor; test 8000 beklerken 1 ms geçince
       7999 geliyor ve test rastgele kırılıyordu. Bütçe ARALIK olarak doğrulanır;
       sözleşme "timeout ~8 sn"dir, tam milisaniye değil. */
    assert.equal(calls[0].url, 'https://provider.example/episode');
    assert.equal(calls[0].options.waitAfterLoad, 1000);
    assert.equal(calls[0].options.referer, 'https://provider.example/');
    assert.ok(calls[0].options.timeout <= 8000 && calls[0].options.timeout >= 7900,
      `timeout ~8000 olmalı, gelen: ${calls[0].options.timeout}`);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
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
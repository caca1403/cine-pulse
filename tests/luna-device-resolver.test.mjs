import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPlayerSrcdoc } from '../src/services/lunaDeviceResolver.js';

test('oynatici cercevesi sadece oynatici iframe\'si icerir, site kabugu yok', () => {
  const doc = buildPlayerSrcdoc('https://play.example/embed/abc');
  assert.match(doc, /<!doctype html>/i);
  assert.match(doc, /<iframe src="https:\/\/play\.example\/embed\/abc"/);
  assert.match(doc, /allowfullscreen="true"/);
  // Sayfa kabugu (header/menu/yorum) olmamali.
  assert.doesNotMatch(doc, /<header/i);
  assert.doesNotMatch(doc, /yorum|menu|reklam/i);
});

test('dogrulama cercevesi site origininde acilir (ayni-kaynak AJAX mumkun)', () => {
  const doc = buildPlayerSrcdoc('', { recaptcha: true });
  assert.match(doc, /src="https:\/\/sezonlukdizi\.cc\/ajax\/reCAPTCHADATA\.asp"/);
  assert.doesNotMatch(doc, /Dogrulama tamamlandiginda oynatici otomatik acilir\.[\s\S]*title="Dogrulama"/);
});

test('oynatici adresi tirnak karakterleriyle kacirilir', () => {
  const doc = buildPlayerSrcdoc('https://play.example/e?a=1&b="2"');
  assert.match(doc, /&quot;2&quot;/);
  assert.doesNotMatch(doc, /src="https:\/\/play\.example\/e\?a=1&b="2"/);
});
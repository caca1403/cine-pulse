import test from 'node:test';
import assert from 'node:assert/strict';

/* #15 derin bağlantı çözümlemesi — saf kısım (hash üretimi). */

globalThis.window = { location: { hash: '' } };
globalThis.HashChangeEvent = globalThis.HashChangeEvent || class {};

const { derinAdresCoz, derinBaglantiUygula } = await import('../src/services/kabuk/derinBaglanti.js');

test('cinepulse:// şemalı adres hash’e döner', () => {
  assert.equal(derinAdresCoz('cinepulse://detail/tv/1396'), '#detail/tv/1396');
  assert.equal(derinAdresCoz('cinepulse://library'), '#library');
  assert.equal(derinAdresCoz('cinepulse://dramas?slug=x'), '#dramas?slug=x');
});

test('web paylaşım adresinden hash yakalanır', () => {
  assert.equal(derinAdresCoz('https://cine.example/app/#/detail/movie/550'), '#detail/movie/550');
});

test('geçersiz şema/rota reddedilir', () => {
  assert.equal(derinAdresCoz('https://evil.example/#pwn'), '');
  assert.equal(derinAdresCoz('cinepulse://evil/x'), '');
  assert.equal(derinAdresCoz(''), '');
});

test('uygulama hash’i kurar; aynı hash’te hashchange tetikler', () => {
  let tetiklenen = 0;
  globalThis.window.dispatchEvent = () => { tetiklenen++; };
  assert.equal(derinBaglantiUygula('cinepulse://detail/tv/1396'), true);
  assert.equal(globalThis.window.location.hash, '#detail/tv/1396');
  assert.equal(derinBaglantiUygula('cinepulse://detail/tv/1396'), true);
  assert.equal(tetiklenen, 1); // ikincisi aynı hash → olay
  assert.equal(derinBaglantiUygula('cinepulse://koyvermez'), false);
});

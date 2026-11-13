/* Regresyon — kullanıcı şikâyetleri (2026-11-13):
   (1) "İzlemeye devam et" ilgili yapıtın ilgili kaynağını değil ilk bulduğu
       kaynağı açıyordu.
   (2) Oynatıcı açıkken yan listeden bölüm seçilince kaynak-seç moduna
       düşüyordu; kısayol sorunsuzdu.
   (3) Kısa dizide bölüm bitince/oynatıcı kapanınca bölümlü detay sayfası
       açılmıyordu.
   Kök neden: her açılış/bölüm geçişi keşfi sıfırdan koşup ilk hattı
   seçiyor, son kullanılan sağlayıcı hatırlanmıyordu. Aşağıdaki testler
   kaynak sürekliliği kaydını ve kısa dizi kapanış yönlendirmesini sabitler. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const depo = new Map();
globalThis.window = {
  localStorage: {
    getItem: k => (depo.has(k) ? depo.get(k) : null),
    setItem: (k, v) => depo.set(k, String(v)),
    removeItem: k => depo.delete(k),
  },
  dispatchEvent() {},
  addEventListener() {},
};

const storage = await import('../src/services/altyapi/storage.js');
const PLAYER = readFileSync(new URL('../src/components/PlayerModal.js', import.meta.url), 'utf8');

/* ---------------------------------------------------------------- STORAGE */

test('saveWatchProgress preferredSource alanını kayda yazar ve geri okur', () => {
  const preferredSource = {
    id: 'sp_starlord_abc',
    provider: 'Star-Lord',
    name: 'Star-Lord',
    category: 'dubbed',
    aile: 'Star-Lord',
    at: 1700000000000,
  };
  storage.saveWatchProgress({
    id: 'tt-kaynak-sureklilik',
    title: 'Süreklilik Dizisi',
    type: 'tv',
    isSeries: true,
    season: 2,
    episode: 3,
    currentTime: 120,
    duration: 3000,
    preferredSource,
  });
  const kayit = storage.getMediaProgress('tt-kaynak-sureklilik', 2, 3);
  assert.ok(kayit, 'ilerleme kaydı oluşmalı');
  assert.deepEqual(kayit.preferredSource, preferredSource, 'kaynak tercihi kayıtta aynen durmalı');
});

test('ilerleme güncellemesi kaynak tercihini silmez (kayıt ...rest ile korunur)', () => {
  storage.saveWatchProgress({
    id: 'tt-kaynak-sureklilik',
    title: 'Süreklilik Dizisi',
    type: 'tv',
    isSeries: true,
    season: 2,
    episode: 3,
    currentTime: 240,
    duration: 3000,
  });
  const kayit = storage.getMediaProgress('tt-kaynak-sureklilik', 2, 3);
  assert.ok(kayit.preferredSource, 'yeni yazımda preferredSource korunmalı');
  assert.equal(kayit.preferredSource.aile, 'Star-Lord');
});

test('"İzlemeye devam et" listesi kaynak tercihini taşır', () => {
  const liste = storage.getUnifiedContinueWatching();
  const kayit = liste.find(x => String(x.id) === 'tt-kaynak-sureklilik');
  assert.ok(kayit, 'devam listesinde kayıt bulunmalı');
  assert.ok(kayit.preferredSource, 'devam kartı tıklanınca kaynak tercihi okunabilmeli');
});

/* ---------------------------------------------------------------- PLAYER */

test('PlayerModal: preferredSource opsiyonu ve izleme kaydından türetme', () => {
  assert.ok(PLAYER.includes('preferredSource = null'), 'API preferredSource opsiyonu tanımlı');
  assert.ok(PLAYER.includes('existingRecord?.preferredSource'), 'kayıttan tercih okunur');
  assert.ok(PLAYER.includes('let tercihliKaynak'), 'tercih durumu tutulur');
  assert.ok(PLAYER.includes('function kaynakTercihTarifi'), 'tercih tarifi üretilir');
  assert.ok(PLAYER.includes('function kaynakTerciheUyar'), 'tercih eşleştiricisi var');
});

test('PlayerModal: keşif ilk kaynak yerine önce tercihli aileyi başlatır', () => {
  assert.ok(PLAYER.includes('if (tercihliKaynagiBaslat()) { clearTimeout(fastPlaybackTimer); return; }'),
    'onUpdate autoplay dalında tercih önce denenir');
  const fast = PLAYER.indexOf('const fastPlaybackTimer');
  assert.ok(fast > -1);
  const pencere = PLAYER.slice(fast, fast + 900);
  assert.ok(pencere.includes('if (tercihliKaynagiBaslat()) return;'), '1.8 sn yedek zamanlayıcı da tercihi dener');
  assert.ok(pencere.includes('if (tercihliKaynak) return;'), 'tercih henüz gelmediyse yanlış kategoriye sapmaz');
});

test('PlayerModal: bölüm geçişi son kaynağı taşır (yan liste = kısayol davranışı)', () => {
  const bas = PLAYER.indexOf('async function switchEpisodeInPlayer');
  assert.ok(bas > -1);
  const govde = PLAYER.slice(bas, bas + 4600);
  assert.ok(govde.includes('const oncekiKaynak = kaynakTercihTarifi'), 'geçiş öncesi aktif kaynak tarif edilir');
  assert.ok(govde.includes('if (oncekiKaynak) tercihliKaynak = oncekiKaynak'), 'tercih geçişe taşınır');
  assert.ok(govde.includes('startServerDiscovery({ isEpisodeSwitch: true })'), 'mevcut keşif akışı korunur');
});

test('PlayerModal: kısa dizi bölüm geçişi keşif yerine yeniden açma yolundan gider', () => {
  const bas = PLAYER.indexOf('async function switchEpisodeInPlayer');
  const govde = PLAYER.slice(bas, bas + 2000);
  assert.ok(govde.includes("if (playerVariant === 'short-drama')"), 'kısa dizi dalı var');
  assert.ok(govde.includes('shortDramaEpisodes.find'), 'bölüm meta listesinden seçilir');
  assert.ok(govde.includes('await openPlayerModal('), 'aynı oynatıcı yeniden açılır (kaynak moduna düşmez)');
  assert.ok(govde.includes('preferredSource: tercih'), 'bölüm geçişi kaynak tercihini taşır');
});

test('PlayerModal: kısa dizide kapanış bölümlü detay sayfasına yönlendirir', () => {
  assert.ok(PLAYER.includes('const kisaDiziDetayinaDon = playerVariant === \'short-drama\''), 'kısa dizi bayrağı');
  const bas = PLAYER.indexOf('const closeModal = (secenekler = {}) => {');
  assert.ok(bas > -1, 'closeModal seçenek alır');
  const govde = PLAYER.slice(bas, PLAYER.indexOf('activeModalClose = closeModal'));
  assert.ok(govde.includes("secenekler.yonlendirme !== false"), 'yeniden açılışta yönlendirme bastırılabilir');
  assert.ok(govde.includes('#dramas?slug='), 'bölümlü detay hash\'ine dönülür');
  assert.ok(PLAYER.includes('activeModalClose?.({ yonlendirme: false })'),
    'bölüm geçişinde eski modal kapanışı yönlendirme yapmaz');
});

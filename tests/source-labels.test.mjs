import test from 'node:test';
import assert from 'node:assert/strict';

import { SOURCE_FAMILIES, getSourceFamily, getAnonymousSourceLabel } from '../src/services/sourceLabels.js';

test('her önek tek aileye düşer, kod adları tekrar etmez', () => {
  const onekler = new Map();
  for (const aile of SOURCE_FAMILIES) {
    for (const onek of aile.prefixes) {
      assert.ok(!onekler.has(onek), `önek iki ailede: ${onek} (${onekler.get(onek)} / ${aile.alias})`);
      onekler.set(onek, aile.alias);
    }
  }
  const adlar = SOURCE_FAMILIES.map(f => f.alias);
  assert.equal(new Set(adlar).size, adlar.length, 'tekrar eden kod adı var');
});

test('son satır tarafsız yutucudur; tanınmayan kaynak gerçek bir sitenin adını üstlenmez', () => {
  const son = SOURCE_FAMILIES.at(-1);
  assert.equal(son.alias, 'Nexus');
  assert.deepEqual(son.prefixes, []);
  assert.deepEqual(son.sources, []);
  assert.equal(getSourceFamily({ id: 'yeni_site_1' }).alias, 'Nexus');
  assert.equal(getSourceFamily({ id: '', source: 'BilinmeyenSite' }).alias, 'Nexus');
});

test('temiz sağlayıcı önekleri koddaki hâliyle eşleşir', () => {
  const beklenen = [
    ['jet_3_sunucu', 'Nimbus'],                 // providers/nimbus.js
    ['czgx_cizgi_s1e1_x_0_sub', 'Lumen'],       // providers/lumen.js
    ['sinemacc_5_sunucu', 'Halcyon'],           // providers/halcyon.js (+ smc_ eklenti yolu)
    ['smc_123', 'Halcyon'],
    ['slc_dub_1_0', 'Lyra'],                    // providers/lyra.js
    ['hdfd_sub_2', 'Bellatrix'],                // providers/bellatrix.js
    ['d4kh_film_sunucu_1', 'Betelgeuse'],       // providers/betelgeuse.js
    ['fm_dub_4', 'Arcturus'],                   // providers/arcturus.js
    ['asy_anime_s1e1_ayna_0_sub', 'Aquila'],    // providers/aquila.js
    ['hdfc_dub_1', 'Orion'],                    // providers/orion.js
  ];
  for (const [id, kodAdi] of beklenen) assert.equal(getSourceFamily({ id }).alias, kodAdi, id);
});

test('dzp_ tek aileye (Muhlif) düşer; Nero yalnız dzb_ kullanır', () => {
  assert.equal(getSourceFamily({ id: 'dzp_dub_7' }).alias, 'Muhlif');   // providers/muhlif.js (kimlik.id 'dzp')
  assert.equal(getSourceFamily({ id: 'dzb_tv_s1e1_abcd1234' }).alias, 'Nero'); // dizibalScraper.js
});

test('dyu_ temiz sağlayıcının (Diziyou) slotudur, dzy_ ayrı diziyo.so ailesidir', () => {
  assert.equal(getSourceFamily({ id: 'dyu_m3u8_99' }).alias, 'Echo');
  assert.equal(getSourceFamily({ id: 'dyu_frame_99' }).alias, 'Echo');
  assert.equal(getSourceFamily({ id: 'dzy_player_s1e1_sub' }).alias, 'Mirach');
  assert.equal(getSourceFamily({ id: 'x', source: 'Diziyou' }).alias, 'Echo');
  assert.equal(getSourceFamily({ id: 'x', source: 'Diziyo' }).alias, 'Mirach');
});

test('site sürücüsü önekleri eklenti kimliğiyle birebir aynıdır', () => {
  // id'yi normalizeStream `${eklentiKimligi}_${index}` ile üretir.
  const beklenen = {
    vidy_0: 'Altair', hdps_0: 'Rigel', ksd_0: 'Sadr', pichive_0: 'Antares',
    vidload_0: 'Spica', vixolity_0: 'Almach', tauvideo_0: 'Nunki', pilavyer_0: 'Menkar',
    nxsha_0: 'Adhara', vidmoly_0: 'Zubenelgenubi', sphp_0: 'Alphecca', kwsearch_0: 'Mizar',
    ajax_0: 'Saiph', filmdizi_0: 'Capella', rplayer_0: 'Denebola', vidlk_0: 'Toliman',
  };
  for (const [id, kodAdi] of Object.entries(beklenen)) assert.equal(getSourceFamily({ id }).alias, kodAdi, id);
});

test('aynı ailenin birden çok hattı harfle ayrılır', () => {
  const hatlar = [{ id: 'dyu_frame_2' }, { id: 'dyu_m3u8_1' }];
  assert.deepEqual(hatlar.map(h => getAnonymousSourceLabel(h, hatlar)), ['Echo A', 'Echo B']);
});

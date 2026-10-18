import test from 'node:test';
import assert from 'node:assert/strict';

import { SOURCE_FAMILIES, getSourceFamily, getAnonymousSourceLabel, getAliasForId } from '../src/services/kaynak/sourceLabels.js';

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

test('kısa dizi önekleri kazıyıcıların ürettiği id’lerle eşleşir', () => {
  assert.equal(getSourceFamily({ id: 'dml_12345' }).alias, 'Dora');           // dramalarScraper.js
  assert.equal(getSourceFamily({ id: 'dml_ep_abcd_1_2' }).alias, 'Dora');
  assert.equal(getSourceFamily({ id: 'ddz_netshort_9' }).alias, 'Rhea');      // dramaDizilerimScraper.js
  assert.equal(getSourceFamily({ id: 'x', source: 'DramaDizilerim' }).alias, 'Rhea');
});

test('sökülen sağlayıcıların önekleri defterde yok → tarafsız yutucuya düşer', () => {
  for (const id of ['jet_3_sunucu', 'hdfc_dub_1', 'dzs_dub_1', 'snx_0', 'szd_1', 'dzb_tv_s1e1',
    'dzyf_1', 'kvip_1', 'vod_1', 'torrent_1', 'tvr_1']) {
    assert.equal(getSourceFamily({ id }).alias, 'Nexus', id);
  }
});

test('getAliasForId ham id dönmez, eşleşmeyende Nexus verir', () => {
  assert.equal(getAliasForId('dml'), 'Dora');
  assert.equal(getAliasForId('ddz'), 'Rhea');
  assert.equal(getAliasForId(''), 'Nexus');
  assert.equal(getAliasForId('bilinmeyen'), 'Nexus');
});

test('aynı ailenin birden çok hattı harfle ayrılır', () => {
  const hatlar = [{ id: 'dml_ep_2' }, { id: 'dml_ep_1' }];
  assert.deepEqual(hatlar.map(h => getAnonymousSourceLabel(h, hatlar)), ['Dora B', 'Dora A']);
});

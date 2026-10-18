/* kahraman sağlayıcı katmanı — çevrimdışı sözleşme testleri.
   AĞ YOK: sağlayıcı çekirdekleri `kayitKancasi` ile sahte haritaya bağlanır,
   gerçek 43 kayıt hiç yüklenmez. Kural: gerçek site adı arayüze sızmaz,
   yalnız doğrudan yayın listelenir, bütçe 30 sn'yi aşmaz. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { KAYIT, kayitlar, kodAdi, turDestekler, KAPALI, durumAyarla, durumOzeti } from '../src/providers/kayit.js';
import {
  BUTCE_MS,
  normalizeEt,
  kaynakCoz,
  kaynakTara,
  cekirdekAl,
  kayitKancasi,
  kayitDurumu,
} from '../src/providers/vekil.js';
import { getSourceFamily, getAliasForId, SOURCE_FAMILIES } from '../src/services/kaynak/sourceLabels.js';

/* ── yardımcı: sahte çekirdekler ──────────────────────────────────────── */

let SAYAC = 0;

/** Gerçek KAYIT'e DOKUNMAZ: sahte kayıtları ayrı bir haritada tutar.
 *  Anahtar kahraman kodu biçimindedir (KOD_ADI süzgeci elemesin). */
function sahteyeBagla(davranislar, turler = ['movie', 'tv']) {
  const harita = new Map();
  davranislar.forEach(davranis => {
    SAYAC += 1;
    const harf = String.fromCharCode(64 + SAYAC);
    const id = `Test${harf}`;
    harita.set(id, {
      onek: `sp_test${harf.toLowerCase()}_`,
      dosya: `test${harf}.js`,
      yukle: async () => { globalThis.getStreams = davranis; },
      turler,
    });
  });
  kayitKancasi(harita);
  return [...harita.keys()];
}

function cizgi(tekrar = 3, gecikme = 0) {
  return () => new Promise(res => {
    let n = 0;
    const at = () => {
      n += 1;
      if (n >= tekrar) {
        return res([
          {
            name: 'GizliSite',
            title: 'Ornek Baslik',
            url: 'https://cdn.example.com/a/playlist.m3u8?x=1',
            quality: '1080p',
            format: 'm3u8',
            headers: { Referer: 'https://cdn.example.com/' },
          },
          { name: 'GizliSite', url: 'https://player.example.com/embed/abc', quality: '720p' },
        ]);
      }
      if (gecikme) setTimeout(at, gecikme); else at();
    };
    at();
  });
}

/* ── kayıt bütünlüğü (45 kayıt, hepsi taramaya açık) ── */

test('kayıt: 55 sağlayıcı, kod adları tekil', () => {
  kayitKancasi(null);
  const durum = kayitDurumu();
  assert.equal(durum.toplam, 55, '43 vendor + 12 birinci taraf = 55 kayıt');
  assert.deepEqual(durum.cakisma, [], 'kod adı çakışmamalı');
  assert.ok(durum.film > 0 && durum.dizi > 0);
});

test('kayıt: her kayıt kendi çekirdeğine sahip (55 = 55, indirgeme yok)', () => {
  kayitKancasi(null);
  assert.equal(kayitDurumu().cekirdek, 55, 'çekirdek indirgenmemeli: çekirdek kendi kimliğiyle alan adı sorar');
});

test('kayıt: anahtar = kahraman kodu, dosya adı kahraman adından türetilir', () => {
  kayitKancasi(null);
  const camel = ad => ad.replace(/[-'’ ]/g, ' ').split(/\s+/)
    .filter(Boolean).map((p, i) => (i ? p[0].toUpperCase() + p.slice(1) : p[0].toLowerCase() + p.slice(1))).join('');
  for (const [id, k] of KAYIT) {
    assert.match(id, /^[A-Z][A-Za-z'-]{2,30}$/, `${id} kahraman kodu biçimsiz`);
    assert.equal(kodAdi(id), id, `${id}: anahtar = kahraman kodu olmalı`);
    assert.equal(k.dosya, `${camel(id)}.js`, `${id}: dosya adı kahraman adından türemeli`);
    assert.match(k.onek, /^sp_[a-z0-9]+_$/, `${id} öneki biçimsiz`);
  }
});

test('kayıt: tür süzgeci movie/tv/series doğru çalışır', () => {
  kayitKancasi(null);
  assert.ok(kayitlar('movie').length > 0);
  assert.equal(kayitlar('tv').length, kayitlar('series').length, 'series tv ile aynı havuz');
  const yalnizFilm = [...KAYIT.values()].find(k => k.turler.length === 1 && k.turler[0] === 'movie');
  if (yalnizFilm) assert.equal(turDestekler(yalnizFilm, 'tv'), false);
  // deterministik sıra
  const adlar = kayitlar('movie').map(([ad]) => ad);
  assert.deepEqual(adlar, [...adlar].sort((a, b) => a.localeCompare(b, 'tr')));
});

/* ── sözleşme: normalize ──────────────────────────────────────────────── */

test('normalize: doğrudan yayın geçer, gömülü oynatıcı elenir', () => {
  const kayit = { kodAdi: 'TestNova', onek: 'sp_testnova_' };
  const gecerli = normalizeEt({
    name: 'GizliSite',
    url: 'https://cdn.example.com/x/master.m3u8',
    quality: '720p',
    headers: { Referer: 'https://cdn.example.com/' },
  }, kayit);
  assert.ok(gecerli, 'm3u8 kabul edilmeli');
  assert.equal(gecerli.quality, '720p');
  assert.equal(gecerli.source, 'TestNova');

  for (const kotu of [
    'https://player.example.com/embed/abc',
    'https://site.example.com/izle/123',
    '',
  ]) {
    assert.equal(normalizeEt({ url: kotu }, kayit), null, `elenmeli: ${kotu}`);
  }
});

test('normalize: çıktıda gerçek site adı YOK', () => {
  const kaynak = normalizeEt({
    name: 'HdtFilmizleGizli',
    title: 'Film',
    url: 'https://cdn.example.com/y/master.m3u8',
    quality: '1080p',
  }, { kodAdi: 'TestNova', onek: 'sp_testnova_' });
  const metin = JSON.stringify(kaynak);
  assert.ok(!metin.includes('HdtFilmizleGizli'), 'sağlayıcının kendi adı sızdı');
  assert.match(kaynak.id, /^sp_testnova_/);
});

test('normalize: kalite okuması', () => {
  const k = { kodAdi: 'TestNova', onek: 'sp_testnova_' };
  const oku = q => normalizeEt({ url: 'https://x.example.com/a.m3u8', quality: q }, k)?.quality;
  assert.equal(oku('4K'), '4K');
  assert.equal(oku('2160p'), '4K');
  assert.equal(oku('1080p'), '1080p');
  assert.equal(oku('480p'), '480p');
  assert.equal(oku(''), '1080p', 'bilinmeyen -> 1080p varsayılan');
});

/* ── sözleşme: kaynakCoz ─────────────────────────────────────────────── */

test('kaynakCoz: uçtan uca çalışır ve fetch köprüsü geri konur', async () => {
  const onceki = globalThis.fetch;
  const [id] = sahteyeBagla([cizgi()]);
  try {
    const sonuc = await kaynakCoz({ id, tur: 'movie', tmdbId: '550' });
    assert.equal(sonuc.hata, null);
    assert.equal(sonuc.kaynaklar.length, 1, 'yalnız doğrudan yayın sayılır');
    const izAdlari = sonuc.iz.map(k => k.ad);
    assert.ok(izAdlari.includes('basladi') && izAdlari.includes('yanit') && izAdlari.includes('normalize'));
  } finally {
    kayitKancasi(null);
  }
  assert.equal(globalThis.fetch, onceki, 'fetch köprüsü sökülmeli');
});

test('kaynakCoz: hata fırlatmaz, boş liste döner', async () => {
  const [id] = sahteyeBagla([async () => { throw new Error('SITE 403'); }]);
  try {
    const sonuc = await kaynakCoz({ id, tur: 'movie', tmdbId: '550' });
    assert.equal(sonuc.kaynaklar.length, 0);
    assert.match(sonuc.hata || '', /SITE 403/);
  } finally { kayitKancasi(null); }
});

test('kaynakCoz: desteklenmeyen tür erken elenir (çağrı yapılmaz)', async () => {
  let cagrildi = false;
  const [id] = sahteyeBagla([async () => { cagrildi = true; return []; }], ['movie']);
  try {
    const sonuc = await kaynakCoz({ id, tur: 'tv', tmdbId: '1' });
    assert.equal(sonuc.hata, 'tur-desteklenmiyor');
    assert.equal(cagrildi, false);
  } finally { kayitKancasi(null); }
});

test('kaynakCoz: global izleyici (tüm çekirdekler) temizlenir', async () => {
  const oncekiYukle = globalThis.getStreams;
  const [id] = sahteyeBagla([cizgi()]);
  try {
    await kaynakCoz({ id, tur: 'movie', tmdbId: '1' });
  } finally { kayitKancasi(null); }
  assert.equal(globalThis.getStreams, oncekiYukle, 'getStreams geri konmalı');
});

test('cekirdekAl: yükleme sırasında global izleyici kaçırılmaz', async () => {
  const onceki = globalThis.getStreams;
  const [id] = sahteyeBagla([cizgi()]);
  try {
    const fn = await cekirdekAl(id);
    assert.equal(typeof fn, 'function');
    assert.equal(globalThis.getStreams, onceki);
  } finally { kayitKancasi(null); }
});

/* ── sözleşme: bütçe ──────────────────────────────────────────────────── */

test('bütçe: toplam tarama tavanı 75 sn (cihaz ölçümü)', () => {
  // Eski değer 30 sn'ydi. Cihaz ölçümü: gerçek bir kazı kayıt başına 10-40 sn
  // sürüyor; 30 sn'de 40 kayıttan ~12'si bitiyor, kalanı HİÇ DENEMEDEN
  // kesiliyordu ("her içerikte 7-8 kaynak" şikâyetinin kökü). Tarama
  // ilerlemeli olduğu için uzun bütçe beklemeye yol açmaz.
  assert.equal(BUTCE_MS, 75_000);
});

test('bütçe: sinyal yok sayan sağlayıcı bile zamanında düşer', async () => {
  const [id] = sahteyeBagla([() => new Promise(() => {})]);
  const t0 = Date.now();
  try {
    const sonuc = await kaynakCoz({ id, tur: 'movie', tmdbId: '1', butceMs: 150 });
    const gecen = Date.now() - t0;
    assert.equal(sonuc.kaynaklar.length, 0);
    assert.ok(gecen < 1500, `sert bütçe işlemedi: ${gecen}ms`);
  } finally { kayitKancasi(null); }
});

test('bütçe: dış iptal sinyali sağlayıcıyı düşürür', async () => {
  const ac = new AbortController();
  const [id] = sahteyeBagla([() => new Promise(() => {})]);
  const t0 = Date.now();
  try {
    const is = kaynakCoz({ id, tur: 'movie', tmdbId: '1', signal: ac.signal, butceMs: 800 });
    setTimeout(() => ac.abort(), 50);
    const sonuc = await is;
    assert.equal(sonuc.kaynaklar.length, 0);
    assert.ok(Date.now() - t0 < 2000);
  } finally { kayitKancasi(null); }
});

test('kaynakTara: paralel tarama, yalnız kancadaki kayıtlar taranır', async () => {
  const ids = sahteyeBagla([cizgi(2, 5), cizgi(2, 5), cizgi(2, 5), cizgi(2, 5), cizgi(2, 5)]);
  const t0 = Date.now();
  try {
    const tara = await kaynakTara({ tur: 'movie', tmdbId: '550', butceMs: 4000 });
    const gecen = Date.now() - t0;
    assert.equal(tara.sonuc.size, ids.length);
    assert.ok(gecen < 4000, `ortak bütçe aşıldı: ${gecen}ms`);
    assert.equal(tara.sonuc.get(ids[0]).kaynaklar.length, 1);
  } finally { kayitKancasi(null); }
});

test('kaynakTara: progressive bildirim her sağlayıcıda tetiklenir', async () => {
  sahteyeBagla([cizgi(), cizgi()]);
  let sayac = 0;
  try {
    await kaynakTara({ tur: 'movie', tmdbId: '550', butceMs: 3000, izleyici: () => { sayac += 1; } });
    assert.equal(sayac, 2);
  } finally { kayitKancasi(null); }
});

test('kaynakTara: tüm sağlayıcılar asılı kalsa da bütçe aşılmaz', async () => {
  sahteyeBagla([() => new Promise(() => {}), () => new Promise(() => {})]);
  const t0 = Date.now();
  try {
    const tara = await kaynakTara({ tur: 'movie', tmdbId: '1', butceMs: 300 });
    assert.ok(Date.now() - t0 < 1500, 'ortak bütçe kaçtı');
    assert.equal(tara.izlener.length, 0, 'asılı kalan sağlayıcı sayılmaz');
  } finally { kayitKancasi(null); }
});

/* ── etiket katmanı ───────────────────────────────────────────────────── */

test('etiket: kahraman kaynakları kahraman koduyla etiketlenir', () => {
  const [ad, kayit] = kayitlar('movie')[0];
  const aile = getSourceFamily({ id: `${kayit.onek}abc123` });
  assert.equal(aile.alias, ad);
  assert.equal(getAliasForId(`${kayit.onek}abc123`), ad);
});

test('etiket: kısa dizi hatları korunur', () => {
  assert.equal(getSourceFamily({ id: 'dml_1' }).alias, 'Dora');
  assert.equal(getSourceFamily({ id: 'ddz_1' }).alias, 'Rhea');
});

test('etiket: bilinmeyen id tarafsız yutucuya düşer', () => {
  assert.equal(getSourceFamily({ id: 'bilinmeyen_99' }).alias, 'Nexus');
});

test('etiket: Nexus HER ZAMAN son satırdadır', () => {
  assert.equal(SOURCE_FAMILIES.at(-1).alias, 'Nexus');
  const kodAdlar = SOURCE_FAMILIES.map(a => a.alias);
  assert.equal(new Set(kodAdlar).size, kodAdlar.length, 'aile adları tekil');
});

test('etiket: hiçbir aile gerçek site adı taşımaz', () => {
  const yasak = ['hdfilmizle', 'dizipal', 'animecix', 'anizium', 'selcukflix', 'vixolity'];
  for (const aile of SOURCE_FAMILIES) {
    const metin = `${aile.alias} ${aile.provider}`.toLowerCase();
    for (const y of yasak) assert.ok(!metin.includes(y), `${aile.alias} gerçek site adı taşıyor: ${y}`);
  }
});

test('etiket: kahraman ailelerinin sayısı kayıt sayısına eşit', () => {
  const izl = SOURCE_FAMILIES.filter(a => a.prefixes.some(p => p.startsWith('sp_')));
  assert.equal(izl.length, KAYIT.size);
});

/* ── kısa dizi hattı: BOZULMAMALI (tek kaynağımız) ─────────────────────── */

test('toplayıcı: kısa dizi hatları kahraman katmanına düşmez', () => {
  const kaynak = fs.readFileSync(
    new URL('../src/services/kaynak/providerAggregator.js', import.meta.url), 'utf8');
  assert.match(kaynak, /fetchDramalarEpisodeSources/, 'Dora hattı kaybolmamalı');
  assert.match(kaynak, /fetchDramaDizilerimEpisodeSources/, 'Rhea hattı kaybolmamalı');
  const cagri = kaynak.match(/kisaDizi && fetch\w+\(/g) || [];
  assert.equal(cagri.length, 4, 'dört kısa dizi çağrısının hepsi koruma altında olmalı');
  assert.match(
    kaynak,
    /if \(!kisaDizi && kahramanKatmaniAcikMi\(\)\) \{/,
    'kahraman taraması kısa dizi dışına çıkmalı ve tek anahtardan yönetilmeli'
  );
});

test('etiket: kısa dizi hatları kahraman aileleriyle çakışmaz', () => {
  const kisa = SOURCE_FAMILIES.filter(a => ['Dora', 'Rhea'].includes(a.alias));
  assert.equal(kisa.length, 2);
  const izlAdlar = new Set(SOURCE_FAMILIES.filter(a => a.prefixes.some(p => p.startsWith('sp_'))).map(a => a.alias));
  for (const a of kisa) assert.ok(!izlAdlar.has(a.alias), `${a.alias} çakışıyor`);
});

/* ── vendor bütünlüğü ─────────────────────────────────────────────────── */

const VENDOR = new URL('../src/providers/cekirdekler/', import.meta.url);

test('vendor: her kayıt bir çekirdek dosyasına işaret eder', () => {
  kayitKancasi(null);
  const yoksuz = [];
  for (const [id, k] of KAYIT) {
    if (!fs.existsSync(new URL(k.dosya, VENDOR))) yoksuz.push(`${id}->${k.dosya}`);
  }
  assert.deepEqual(yoksuz, [], 'çekirdek dosyaları eksik');
});

test('vendor: 55 çekirdek (hepsi taramaya açık), obfuscation artığı yok', () => {
  const dosyalar = fs.readdirSync(VENDOR).filter(f => f.endsWith('.js'));
  assert.equal(dosyalar.length, 55, `55 çekirdek beklenir, ${dosyalar.length} bulundu`);
  for (const f of dosyalar) {
    const icerik = fs.readFileSync(new URL(f, VENDOR), 'utf8');
    assert.ok(!/function _0x[0-9a-f]{4,}\s*\(/.test(icerik), `${f}: decoder artığı`);
    assert.ok(icerik.split('\n').length > 60, `${f}: çözülmemiş tek satır`); // amaç: minified tek-satır tespiti; elle yazılmış çekirdek 60+ satır
    assert.match(icerik, /getStreams/, `${f}: API yok`);
  }
});

test('vendor: çekirdekler kahraman koduyla etiketlenebilir (getStreams var)', () => {
  const bir = fs.readFileSync(new URL('shazam.js', VENDOR), 'utf8');
  assert.match(bir, /globalThis\.getStreams|getStreams/);
  assert.match(bir, /#EXTM3U/, 'HLS doğrulaması yerinde olmalı');
});
/* ── canlı ölçüm kapısı (durum / KAPALI) ──────────────────────────────── */

test('durum: her kayıt ölçüm alanı taşır, varsayılan bilinmiyor', () => {
  kayitKancasi(null);
  const ozet = durumOzeti();
  assert.equal(ozet.toplam, 55);
  // Tek kalici 'canli' kayit, OLCUMLU birinci taraf cekirdegidir (Star-Lord:
  // film + dizi kosesinde canli olarak dogrulandi). Vendor kayitlar olcum
  // yapilmadan asla kapali sayilmaz.
  assert.equal(ozet.canli, 28, '28 canlı kayıt');
  assert.equal(ozet.bilinmiyor, 27, '27 henüz ölçülmeyen kayıt');
});

test('durum: kapalı kayıt taramaya girmez', () => {
  const hepsi = kayitlar('movie').length;
  const hedef = kayitlar('movie')[0][0];
  const onceki = KAYIT.get(hedef)?.durum || 'bilinmiyor';
  durumAyarla(hedef, 'kapali');
  try {
    assert.ok(KAPALI.has(hedef));
    assert.ok(!kayitlar('movie').some(([ad]) => ad === hedef), 'kapalı kayıt listeden çıkmalı');
    assert.equal(kayitlar('movie').length, hepsi - 1);
  } finally {
    durumAyarla(hedef, onceki);
  }
  assert.equal(kayitlar('movie').length, hepsi, 'yeniden açınca listeye dönmeli');
});

test('durum: canlı işaretlenen kayıt listede kalır', () => {
  // Havuzda artik yalniz olculmus canli / olculmus kapali kayit var:
  // canli isareti idempotent olmalı ve kapaliya donusmemeli.
  const hedef = kayitlar('tv').find(([ad]) => KAYIT.get(ad)?.durum === 'canli')[0];
  const taban = durumOzeti().canli;
  durumAyarla(hedef, 'canli');
  try {
    assert.equal(durumOzeti().canli, taban, 'canlı işareti sayıyı şişirmemeli');
    assert.ok(kayitlar('tv').some(([ad]) => ad === hedef));
    durumAyarla(hedef, 'bilinmiyor');
    assert.ok(kayitlar('tv').some(([ad]) => ad === hedef), 'bilinmeyen de taramaya girer');
  } finally {
    durumAyarla(hedef, 'canli');
  }
});

test('durum: bilinmeyen kimlik için durumAyarla false döner', () => {
  assert.equal(durumAyarla('YokBoyleKahraman', 'canli'), false);
});

test('Robin slugYap: başlık → site slug’ı (Türkçe ASCII + tire)', async () => {
  const { slugYap } = await import('../src/providers/cekirdekler/robin.js');
  assert.equal(slugYap('Breaking Bad'), 'breaking-bad');
  assert.equal(slugYap('Çukur'), 'cukur');
  assert.equal(slugYap('İstanbullu Gelin!'), 'istanbullu-gelin');
  assert.equal(slugYap(''), '');
});

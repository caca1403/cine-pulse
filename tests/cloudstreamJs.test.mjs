import test from 'node:test';
import assert from 'node:assert/strict';

/* CloudStream JS ↔ native köprü entegrasyonu (kullanıcı 2026-10-29).
   CİHAZ/AĞ GEREKMEZ: window.CinePulseCloudStream sahte-nesnesi, probe'larla
   doğrulanmış GERÇEK şemalarla döner (docs/cloudstream-host-kopru.md):
   senkron JSON string, bolum alanı 'veri', link alanı 'tur' (M3U8|DIRECT),
   WioSinema oge.url'i TMDB JSON string'i ({"id":1396,"type":"tv"}). */

globalThis.localStorage = { _m: {}, getItem(k) { return this._m[k] ?? null; }, setItem(k, v) { this._m[k] = String(v); } };
globalThis.window = { addEventListener() {}, removeEventListener() {} };

const { eklentiEkle, eklentiKaldir, eklentileriGetir, eklentilerdeAra, csSatir } =
  await import('../src/services/dogrudan/eklentiServisi.js');

const KAYIT = 'cp_eklentiler';
const kayitlariSifirla = () => { localStorage._m = {}; };

/* ── Sahte köprü: probe JSON şemalarıyla BİREBİR (cihaz çıktısı) ────────── */
function sahteKopru(asil = {}) {
  const cagrilan = [];
  const kaydet = (metot, args, yanit) => { cagrilan.push({ metot, args }); return JSON.stringify(yanit); };
  const k = {
    _cagrilan: cagrilan,
    csDurum: () => kaydet('csDurum', [], { ok: true, konak: true, apiKokSurum: '4.8.0', yukluEklenti: 1, kayitliSaglayici: 1 }),
    csEklentiYukle: (url, ad) => kaydet('csEklentiYukle', [url, ad], asil.ekle || {
      ok: true, id: 'wio1', ad: ad || 'WioSinema', saglayiciSayisi: 1,
      saglayicilar: [{ sagId: 'wio1#0', ad: 'WioSinema', anaUrl: 'https://wio.example', dil: 'tr', anaSayfaVar: true, hizliAramaVar: true, turler: ['movie', 'tv'] }]
    }),
    csEklentiListesi: () => kaydet('csEklentiListesi', [], asil.liste || {
      ok: true, ekler: [{
        id: 'wio1', ad: 'WioSinema', dosya: 'wiosinema.cs3',
        saglayicilar: [{ sagId: 'wio1#0', ad: 'WioSinema', anaUrl: 'https://wio.example', dil: 'tr', anaSayfaVar: true, hizliAramaVar: true, turler: ['movie', 'tv'] }]
      }]
    }),
    csEklentiKaldir: (id) => kaydet('csEklentiKaldir', [id], asil.kaldir || { ok: true }),
    csRepoYukle: (url) => kaydet('csRepoYukle', [url], asil.repo || {
      ok: true, repoAdi: 'TR Deneme Repo', eklentiSayisi: 2,
      eklentiler: [
        { ad: 'WioSinema', url: 'https://gh.example/WioSinema.cs3', yukleme: { ok: true, id: 'wio1', ad: 'WioSinema', saglayiciSayisi: 1, saglayicilar: [{ sagId: 'wio1#0', ad: 'WioSinema', hizliAramaVar: true }] } },
        { ad: 'Kusurlu', url: 'https://gh.example/kusurlu.cs3', yukleme: { ok: false, hata: 'sınıf bulunamadı', forNameIlkHata: 'com.example.X' } }
      ]
    }),
    csAra: (sagId, sorgu) => kaydet('csAra', [sagId, sorgu], asil.ara || {
      ok: true, sonuclar: [{
        sagId, saglayici: 'WioSinema',
        ogeler: [{ ad: 'Kule', url: '{"id":1396,"type":"tv"}', tur: 'Series', poster: 'https://p.img', yil: 2024, sagId }]
      }]
    }),
    csYukle: (sagId, url) => kaydet('csYukle', [sagId, url], asil.yukle || {
      ok: true, sagId,
      detay: {
        ad: 'Kule', tur: 'Series', bolumSayisi: 2,
        bolumler: [
          { ad: '1. Sezon 1. Bölüm', veri: 'https://site/izle/kule-s1e1', sezon: 1, bolum: 1 },
          { ad: '1. Sezon 2. Bölüm', veri: 'https://site/izle/kule-s1e2', sezon: 1, bolum: 2 }
        ]
      }
    }),
    csAkislar: (sagId, veri) => kaydet('csAkislar', [sagId, veri], asil.akis || {
      ok: true, saglayici: 'WioSinema',
      linkler: [
        { ad: 'HDFilmCehennemi', url: 'https://cdn.example/master.m3u8?tok=9', referer: 'https://ref.example/', kaynak: '', kalite: '1080p', tur: 'M3U8', baslik: 'Kule S01E02 1080p' },
        { ad: 'DirectVid', url: 'https://cdn.example/direct.mp4', referer: '', kaynak: '', kalite: '720p', tur: 'DIRECT', baslik: 'Kule S01E02 720p' }
      ],
      altyazilar: [{ dil: 'tr', url: 'https://subs.example/tr.vtt' }]
    })
  };
  return k;
}

const kopruKur = (k) => { globalThis.window.CinePulseCloudStream = k; };
const kopruKaldir = () => { delete globalThis.window.CinePulseCloudStream; };

/* ── 1) Masaüstü (köprü yok): neden-temelli Türkçe mesaj ────────────────── */
test('masaüstünde cloudstream-repo ekleme net neden-temelli mesajla döner', async () => {
  kayitlariSifirla(); kopruKaldir();
  const son = await eklentiEkle('https://raw.githubusercontent.com/recloudstream/extensions/main/repo.json');
  assert.equal(son.ok, false);
  assert.match(son.hata, /Android\/Capacitor yerli katmanında koşar/);
  assert.match(son.hata, /desteklenmez/);
  assert.doesNotMatch(son.hata, /desteklenmiyor/); // utanç mesajı geri gelmesin
  assert.deepEqual(eklentileriGetir(), []);
});

/* ── 2) Köprü stub'ıyla ekleme akışları ─────────────────────────────────── */
test('repo ekleme: csRepoYukle çağrılır, kısmi başarıda idler+sayılar kayda yazılır', async () => {
  kayitlariSifirla();
  const k = sahteKopru(); kopruKur(k);
  try {
    const son = await eklentiEkle('https://repo.example/repo.json');
    assert.equal(son.ok, true);
    assert.equal(son.aile, 'cloudstream-repo');
    assert.equal(son.ad, 'TR Deneme Repo');
    assert.equal(son.eklentiSayisi, 2);
    assert.equal(son.saglayiciSayisi, 1); // yalnız başarılı yüklemenin sağlayıcıları
    const kayit = eklentileriGetir().find(e => e.aile === 'cloudstream-repo');
    assert.deepEqual(kayit.idler, ['wio1']); // kusurlu eklenti id'siz → listeye girmez
    assert.ok(k._cagrilan.some(c => c.metot === 'csRepoYukle' && c.args[0] === 'https://repo.example/repo.json'));
  } finally { kopruKaldir(); }
});

test('tekil .cs3 ekleme: csEklentiYukle çağrılır, tek id kaydedilir', async () => {
  kayitlariSifirla();
  const k = sahteKopru(); kopruKur(k);
  try {
    const son = await eklentiEkle('https://github.com/Wiojelt/WioSinema/releases/download/v1.2/WioSinema.cs3');
    assert.equal(son.ok, true);
    assert.equal(son.aile, 'cloudstream-repo');
    assert.equal(son.eklentiSayisi, 1);
    const kayit = eklentileriGetir()[0];
    assert.deepEqual(kayit.idler, ['wio1']);
    assert.equal(kayit.saglayiciSayisi, 1);
    const yuk = k._cagrilan.find(c => c.metot === 'csEklentiYukle');
    assert.ok(yuk, 'csEklentiYukle çağrılmalı');
    assert.equal(yuk.args[0], 'https://github.com/Wiojelt/WioSinema/releases/download/v1.2/WioSinema.cs3');
    assert.equal(yuk.args[1], 'WioSinema'); // görünen ad adresten tahmin edildi
  } finally { kopruKaldir(); }
});

test('köprü hatası kullanıcıya Türkçe metinle yansır (forNameIlkHata dahil)', async () => {
  kayitlariSifirla();
  kopruKur(sahteKopru({
    ekle: { ok: false, islem: 'csEklentiYukle', tur: 'java.lang.NoClassDefFoundError', hata: 'com.lagradost.Missing', forNameIlkHata: 'com.lagradost.Missing' }
  }));
  try {
    const son = await eklentiEkle('https://x.example/bad.cs3');
    assert.equal(son.ok, false);
    assert.match(son.hata, /NoClassDefFoundError|com\.lagradost\.Missing/);
    assert.match(son.hata, /sınıf:/);
    assert.deepEqual(eklentileriGetir(), []);
  } finally { kopruKaldir(); }
});

/* ── 3) Kaldırma: csEklentiKaldir(id) her id için + kayıt silme ─────────── */
test('kaldırma repodaki TÜM eklenti idlerini konaktan düşürür', async () => {
  kayitlariSifirla();
  const k = sahteKopru({ repo: {
    ok: true, repoAdi: 'İki Eklentili Repo', eklentiSayisi: 2,
    eklentiler: [
      { ad: 'A', url: 'a.cs3', yukleme: { ok: true, id: 'idA', saglayiciSayisi: 1 } },
      { ad: 'B', url: 'b.cs3', yukleme: { ok: true, id: 'idB', saglayiciSayisi: 2 } }
    ]
  } });
  kopruKur(k);
  try {
    await eklentiEkle('https://repo.example/repo.json');
    assert.deepEqual(eklentileriGetir()[0].idler, ['idA', 'idB']);
    eklentiKaldir('https://repo.example/repo.json');
    const kaldirilan = k._cagrilan.filter(c => c.metot === 'csEklentiKaldir').map(c => c.args[0]);
    assert.deepEqual(kaldirilan, ['idA', 'idB']);
    assert.deepEqual(eklentileriGetir(), []);
  } finally { kopruKaldir(); }
});

/* ── 4) Tarama: csAra → csYukle → csAkislar → satır ────────────────────── */
test('tarama bulutu: sagId listesiyle arar (* ASLA), TMDB-json oge seçer, satır alanları nuvio sözleşmesi', async () => {
  kayitlariSifirla();
  // Tarama dalı kayıt varlığına bakır (kayıt yalnız etiket; konak canlı liste).
  localStorage.setItem(KAYIT, JSON.stringify([
    { url: 'https://repo.example/repo.json', ad: 'Repo', aile: 'cloudstream-repo', eklentiSayisi: 1, saglayiciSayisi: 1, idler: ['wio1'] }
  ]));
  const k = sahteKopru(); kopruKur(k);
  // TMDB uyan oge'nin adı başlıkla ALAKASIZ — TMDB sinyali en güçlüsü olmalı.
  k.csAra = (sagId, sorgu) => { k._cagrilan.push({ metot: 'csAra', args: [sagId, sorgu] }); return JSON.stringify({
    ok: true, sonuclar: [{
      sagId, saglayici: 'WioSinema',
      ogeler: [
        // TMDB sinyali başlık eşleşmesini YENER: başlıkla birebir adlı oge'nin
        // url'i düz; TMDB-json taşıyan oge'nin adı alakasız.
        { ad: 'Kule', url: 'https://site/adsiz', tur: 'Series', sagId },
        { ad: 'Başka Bir Şey', url: '{"id":1396,"type":"tv"}', tur: 'Series', sagId }
      ]
    }]
  }); };
  try {
    const satirlar = [];
    const adet = await eklentilerdeAra(
      { tur: 'series', imdbId: '', tmdbId: 1396, sezon: 1, bolum: 2, baslik: 'Kule' },
      (s) => satirlar.push(s)
    );
    assert.equal(adet, 2);
    assert.equal(satirlar.length, 2);
    // csAra çağrısı: tam sagId + başlık sorgusu — '*' ve boş yasak.
    const ara = k._cagrilan.find(c => c.metot === 'csAra');
    assert.equal(ara.args[0], 'wio1#0');
    assert.equal(ara.args[1], 'Kule');
    assert.ok(!k._cagrilan.some(c => c.metot === 'csAra' && (c.args[0] === '*' || c.args[0] === '')));
    // TMDB-json oge seçildi ve SEZON 2'nin 'veri'siyle akış istendi.
    const yukle = k._cagrilan.find(c => c.metot === 'csYukle');
    assert.equal(yukle.args[1], '{"id":1396,"type":"tv"}');
    const akis = k._cagrilan.find(c => c.metot === 'csAkislar');
    assert.equal(akis.args[1], 'https://site/izle/kule-s1e2');
    // Satır 1: M3U8 + referer + sağlayıcı-grup alanları (nuvioSatir birebir sözleşme).
    const hls = satirlar.find(s => s.isHls);
    assert.equal(hls.streamUrl, 'https://cdn.example/master.m3u8?tok=9');
    assert.equal(hls.isDirectVideo, false);
    assert.equal(hls.source, 'WioSinema');
    assert.equal(hls.eklentiAdi, 'WioSinema');
    assert.equal(hls.baslik, 'WioSinema • HDFilmCehennemi • 1080p');
    assert.equal(hls.kalite, '1080p');
    assert.equal(hls.autoPlayable, true);
    assert.deepEqual(hls.headers, { Referer: 'https://ref.example/' });
    assert.ok(hls.id.startsWith('cs:WioSinema:'));
    // Satır 2: DIRECT; referer boşsa headers yok.
    const dir = satirlar.find(s => s.isDirectVideo);
    assert.equal(dir.isHls, false);
    assert.equal(dir.headers, undefined);
    assert.equal(dir.kalite, '720p');
  } finally { kopruKaldir(); }
});

test('taramada başlık yoksa cloudstream dalı console.warn ile atlanır (csAra hiç çağrılmaz)', async () => {
  kayitlariSifirla();
  const k = sahteKopru(); kopruKur(k);
  const uyari = [];
  const eskiWarn = console.warn; console.warn = (...a) => uyari.push(a.join(' '));
  try {
    await eklentiEkle('https://repo.example/repo.json'); // kayıt: cloudstream-repo
    const adet = await eklentilerdeAra({ tur: 'series', tmdbId: 1396, sezon: 1, bolum: 1 }, () => {});
    assert.equal(adet, 0);
    assert.ok(!k._cagrilan.some(c => c.metot === 'csAra'));
    assert.ok(uyari.some(w => /başlık geçilmedi/.test(w)));
  } finally { console.warn = eskiWarn; kopruKaldir(); }
});

test('masaüstü taraması cloudstream kaydını köprüsüz atlar, çökmez', async () => {
  kayitlariSifirla(); kopruKaldir();
  localStorage.setItem(KAYIT, JSON.stringify([
    { url: 'https://repo.example/repo.json', ad: 'Repo', aile: 'cloudstream-repo', eklentiSayisi: 1, saglayiciSayisi: 1, idler: ['wio1'] }
  ]));
  const uyari = [];
  const eskiWarn = console.warn; console.warn = (...a) => uyari.push(a.join(' '));
  try {
    let satirAdedi = 0;
    const adet = await eklentilerdeAra({ tur: 'movie', tmdbId: 1, baslik: 'Bir Film' }, () => { satirAdedi++; });
    assert.equal(adet, 0);
    assert.equal(satirAdedi, 0);
    assert.ok(uyari.some(w => /köprü yok/.test(w)));
  } finally { console.warn = eskiWarn; }
});

/* ── 4b) Asenkran köprü (csAs): senkron ağır metot HİÇ çağrılmaz ─────────
 * Donma düzeltmesinin kilidi (kullanıcı 2026-10-29): köprüde csAs varsa tüm
 * ağır çağrılar onun üzerinden gider; senkron csAra/csYukle/csAkislar çağrılırsa
 * test patlar — rejresyon olursa donma geri gelir. */
test('csAs destekli köprüde tarama senkron csAra/csYukle/csAkislar çağırmaz', async () => {
  kayitlariSifirla();
  localStorage.setItem(KAYIT, JSON.stringify([
    { url: 'https://repo.example/repo.json', ad: 'Repo', aile: 'cloudstream-repo', eklentiSayisi: 1, saglayiciSayisi: 1, idler: ['wio1'] }
  ]));
  const k = sahteKopru();
  const asCagri = [];
  const yanitlar = { csAra: JSON.parse(k.csAra('wio1#0', 'Kule')), csYukle: JSON.parse(k.csYukle('wio1#0', 'x')), csAkislar: JSON.parse(k.csAkislar('wio1#0', 'x')) };
  for (const m of ['csAra', 'csYukle', 'csAkislar']) {
    k[m] = () => { throw new Error(`senkron ${m} csAs varken çağrılmamalı (DONMA REGRASYONU)`); };
  }
  k.csAs = (cbId, metot, a1, a2) => {
    asCagri.push({ metot, a1, a2 });
    setTimeout(() => window.__csCb(cbId, JSON.stringify(yanitlar[metot])), 1);
  };
  kopruKur(k);
  try {
    const satirlar = [];
    const adet = await eklentilerdeAra(
      { tur: 'series', imdbId: '', tmdbId: 1396, sezon: 1, bolum: 1, baslik: 'Kule' },
      (s) => satirlar.push(s)
    );
    assert.ok(adet >= 1, 'asenkran akış satır üretmeli');
    assert.ok(asCagri.some(c => c.metot === 'csAra'));
    assert.ok(asCagri.some(c => c.metot === 'csYukle'));
    assert.ok(asCagri.some(c => c.metot === 'csAkislar'));
  } finally { kopruKaldir(); }
});

/* ── 5) csSatir kenar durumları ─────────────────────────────────────────── */
test('csSatir: http(s) olmayan adres (magnet/javascript) satır üretmez', () => {
  assert.equal(csSatir('X', { url: 'magnet:?xt=urn:btih:abc', tur: 'DIRECT' }), null);
  assert.equal(csSatir('X', { url: 'javascript:alert(1)', tur: 'DIRECT' }), null);
  assert.equal(csSatir('X', null), null);
  const s = csSatir('X', { url: 'https://cdn/x.mp4', ad: '', kalite: '' });
  assert.equal(s.kalite, 'auto');
  assert.equal(s.headers, undefined);
});

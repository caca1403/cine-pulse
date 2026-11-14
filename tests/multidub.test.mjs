/* ==========================================================================
   MULTIDUBENDGAME + TR DUBLAJ SİCİLİ — ağsız testler
   --------------------------------------------------------------------------
   Kapsam:
     · Adapter ayrıştırıcıları (HDFC JSON kartı, RPC nesnesi, FilmMakinesi HTML)
     · Dublaj beyanı okuma (etiket ≠ kanıt kuralı)
     · Eşleştirme (IMDb önceliği, Türkçe başlık benzerliği, yıl cezası)
     · Sicil: kanıt gücü, kalıtım (önsel), tazelik, kullanıcı geri bildirimi
     · Dayanıklılık: kaynak düşerse diğerleri devam eder, hiçbiri fırlatmaz
   Ağ YOK: tüm fetch'ler sahte. Çalıştır: node --test tests/multidub.test.mjs
   ========================================================================== */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  baslikBenzerligi, sadelestir, htmlCoz, yilCikar, imdbCikar, dublajBeyani,
  hdfcAra, rpcAra, rpcAdayaCevir, filmmakinesiAra, toplaHepsi,
  eslestir, sicileYaz, yildizArsiviTara, yildizKaynakMi, yildizAdi,
  YILDIZ_KAYNAKLAR,
} from '../src/services/dogrudan/multiDubEndgame.js';

import {
  sicilBos, icerikAnahtari, icerikCoz, kanitIsle, saglayiciOnseli, tazelik,
  basariOrani, kaynakPuani, sicileGoreSirala, taramaSirasi, sicilIpucu,
  oynatmaBasarili, oynatmaBasarisiz, sicilBirlestir, sicilOzeti,
  sicilYukle, sicilKaydet, tohumdanSicil, siciliKirp, icerikOnseli, dublajKademesi,
  SICIL_DEPO_ANAHTARI, SICIL_SURUMU,
} from '../src/services/dogrudan/dublajSicili.js';

/* ── Sahte HTTP ───────────────────────────────────────────────────────────── */

function yanit(govde, { ok = true, status = 200 } = {}) {
  const metin = typeof govde === 'string' ? govde : JSON.stringify(govde);
  return {
    ok, status,
    text: async () => metin,
    json: async () => JSON.parse(metin),
  };
}

/** URL'ye göre yanıt üreten sahte fetch. */
function sahteFetch(harita) {
  const cagrilar = [];
  const fn = async (adres, secenek = {}) => {
    const u = String(adres);
    cagrilar.push({ adres: u, secenek });
    for (const [kalip, uretici] of Object.entries(harita)) {
      if (u.includes(kalip)) {
        const deger = typeof uretici === 'function' ? uretici(u, secenek) : uretici;
        if (deger instanceof Error) throw deger;
        return deger;
      }
    }
    return yanit('bulunamadi', { ok: false, status: 404 });
  };
  fn.cagrilar = cagrilar;
  return fn;
}

/* ── Sabit örnek gövdeler ─────────────────────────────────────────────────── */

const HDFC_JSON = {
  query: 'fight club',
  results: [
    '<a href="https://www.hdfilmcehennemi.nl/1-dovus-kulubu-izle-7/" class="search-result" aria-label="Search result" data-router>\n'
    + ' <img data-found="1" src="https://x/poster.webp" alt="D&ouml;v&uuml;ş Kul&uuml;b&uuml; - Fight Club" class=""  />\n'
    + ' <div class="search-result-content"><div class="meta"><span class="year">1999</span>'
    + '<span class="imdb">8.8</span><span class="type">Film</span></div>'
    + '<h4 class="title">D&ouml;v&uuml;ş Kul&uuml;b&uuml; - Fight Club</h4></div>\n</a>',
    '<a href="https://www.hdfilmcehennemi.nl/female-fight-squad/" class="search-result" data-router>\n'
    + ' <img alt="Kadınlar Kulübü - Female Fight Squad" />\n'
    + ' <div class="search-result-content"><div class="meta"><span class="year">2017</span>'
    + '<span class="type">Film</span></div>'
    + '<h4 class="title">Kadınlar Kulübü - Female Fight Squad</h4></div>\n</a>',
  ],
};

const RPC_JSON = {
  ok: true,
  result: [{
    object_name: 'Fight Club',
    object_alternative_name: 'Dövüş Kulübü',
    object_name_alternative: 'Dövüş Kulübü',
    object_related_imdb_id: 'tt0137523',
    object_release_year: 1999,
    object_language: 'Türkçe Dublaj',
    used_slug: 'film/fight-club/izle',
    used_type: 'Movies',
  }, {
    object_name: 'Fight or Flight',
    object_alternative_name: '',
    object_name_alternative: '',
    object_related_imdb_id: 'tt14211634',
    object_release_year: 2025,
    object_language: 'Türkçe Altyazılı',
    used_slug: 'film/fight-or-flight/izle',
    used_type: 'Movies',
  }],
};

const FMK_HTML = `<!DOCTYPE html><html><body>
<div class="col-6"><div class="item-relative">
<a class="item" href="/film/a-place-to-fight-for-izle-2023/" data-title="A Place to Fight For"
   data-score="6.2" data-type="Dram,Romantik" data-country="Fransa">
  <div class="thumbnail-outer"><img alt="A Place to Fight For" class="thumbnail" />
    <div class="item-info"><div>HD</div><div>Dual</div></div></div>
  <div class="item-footer"><div class="title">A Place to Fight For</div>
    <div class="info"><span>2023</span><span>103 Dakika</span></div></div>
</a></div></div>
<div class="col-6"><div class="item-relative">
<a class="item" href="/film/sub-only-izle-2024/" data-title="Sub Only"
   data-score="7.1" data-type="Dram">
  <div class="thumbnail-outer"><img alt="Sub Only" class="thumbnail" />
    <div class="item-info"><div>HD</div><div>Altyazı</div></div></div>
  <div class="item-footer"><div class="title">Sub Only</div>
    <div class="info"><span>2024</span><span>90 Dakika</span></div></div>
</a></div></div>
</body></html>`;

/* ══ YARDIMCILAR ═══════════════════════════════════════════════════════════ */

test('sadelestir: Türkçe karakterleri ASCII yapar', () => {
  assert.equal(sadelestir('Dövüş Kulübü'), 'dovus kulubu');
  assert.equal(sadelestir('ŞİMDİ ĞÜÇÖI'), 'simdi gucoi');
});

test('htmlCoz: yaygın varlıkları çözer', () => {
  assert.equal(htmlCoz('D&ouml;v&uuml;ş'), 'Dövüş');
  assert.equal(htmlCoz('a &amp; b'), 'a & b');
});

test('yilCikar / imdbCikar', () => {
  assert.equal(yilCikar('1999'), 1999);
  assert.equal(yilCikar('29 Ekim 2023'), 2023);
  assert.equal(yilCikar('IMDb 8.8'), null, 'puan yıl sayılmaz');
  assert.equal(imdbCikar('tt0137523'), 'tt0137523');
  assert.equal(imdbCikar('tt123'), '');
});

test('baslikBenzerligi: tam ve kısmi eşleşme', () => {
  assert.equal(baslikBenzerligi('Fight Club', 'Fight Club'), 1);
  assert.ok(baslikBenzerligi('Dövüş Kulübü - Fight Club', 'Fight Club') >= 0.66);
  assert.ok(baslikBenzerligi('Fight Club', 'Titanic') < 0.2);
  assert.equal(baslikBenzerligi('', 'x'), 0);
});

/* ══ DUBLAJ BEYANI ═════════════════════════════════════════════════════════ */

test('dublajBeyani: dublaj > altyazı > orijinal önceliği', () => {
  assert.deepEqual(dublajBeyani('Türkçe Dublaj'), { dilDurumu: 'dublaj', kanit: 'etiket', sinyal: 'dublaj' });
  assert.equal(dublajBeyani('HD Dual').dilDurumu, 'dublaj');
  assert.equal(dublajBeyani('Türkçe Altyazılı').dilDurumu, 'altyazi');
  assert.equal(dublajBeyani('Altyaz').dilDurumu, 'altyazi');
  assert.equal(dublajBeyani('Orijinal Dil').dilDurumu, 'orijinal');
  assert.deepEqual(dublajBeyani('HD 1080p'), { dilDurumu: 'bilinmiyor', kanit: 'yok', sinyal: '' });
  // "Dublaj" ve "Altyazı" birlikte geçerse dublaj kazanır (daha güçlü iddia).
  assert.equal(dublajBeyani('Dublaj & Altyazılı').dilDurumu, 'dublaj');
});

test('dublajBeyani: etiket kanıtı olarak işaretlenir, medya kanıtı DEĞİL', () => {
  const b = dublajBeyani('Türkçe Dublaj');
  assert.equal(b.kanit, 'etiket', 'beyan yalnız etiket kanıtıdır');
});

/* ══ ADAPTÖRLER ════════════════════════════════════════════════════════════ */

test('hdfcAra: JSON kartlarını ayrıştırır', async () => {
  const f = sahteFetch({ '/search/': yanit(HDFC_JSON) });
  const adaylar = await hdfcAra('fight club', { fetchFn: f });
  assert.equal(adaylar.length, 2);
  const ilk = adaylar[0];
  assert.equal(ilk.baslik, 'Dövüş Kulübü - Fight Club', 'HTML varlıkları çözülmüş');
  assert.equal(ilk.yil, 1999);
  assert.equal(ilk.tur, 'movie');
  assert.equal(ilk.kaynak, 'star:hdfc');
  assert.match(ilk.adres, /^https:\/\/www\.hdfilmcehennemi\.nl\//);
  // Arama sorgusu doğru yola ve URL-kodlu biçimde gitmeli.
  assert.match(f.cagrilar[0].adres, /\/search\/\?q=fight%20club/);
});

test('hdfcAra: boş sorguda ağa ÇIKMAZ', async () => {
  const f = sahteFetch({});
  assert.deepEqual(await hdfcAra('', { fetchFn: f }), []);
  assert.equal(f.cagrilar.length, 0);
});

test('hdfcAra: HTTP hatasında boş liste, fırlatma yok', async () => {
  const f = sahteFetch({ '/search/': yanit('', { ok: false, status: 500 }) });
  assert.deepEqual(await hdfcAra('x', { fetchFn: f }), []);
});

test('hdfcAra: ağ istisnası yukarı sızmaz', async () => {
  const f = sahteFetch({ '/search/': new Error('ECONNRESET') });
  await assert.rejects(() => hdfcAra('x', { fetchFn: f }), /ECONNRESET/,
    'adaptör kendi yakalamaz — toplaHepsi yakalar (sözleşme)');
});

test('rpcAdayaCevir: object_language doğrudan beyandır', () => {
  const a = rpcAdayaCevir(RPC_JSON.result[0], 'https://selcukflix.app');
  assert.equal(a.baslik, 'Fight Club');
  assert.equal(a.alt, 'Dövüş Kulübü');
  assert.equal(a.imdb, 'tt0137523');
  assert.equal(a.yil, 1999);
  assert.equal(a.dilDurumu, 'dublaj');
  assert.equal(a.hamDil, 'Türkçe Dublaj');
  assert.equal(a.adres, 'https://selcukflix.app/film/fight-club/izle');
  assert.equal(a.tur, 'movie');
});

test('rpcAdayaCevir: altyazılı yayın dublaj sayılmaz', () => {
  const a = rpcAdayaCevir(RPC_JSON.result[1], 'https://selcukflix.app');
  assert.equal(a.dilDurumu, 'altyazi');
});

test('rpcAra: çalışan action adını bulur ve döndürür', async () => {
  const f = sahteFetch({
    '/api/mj': (u, s) => {
      const govde = JSON.parse(s.body);
      if (govde.action === 'searchContent') return yanit(RPC_JSON);
      return yanit({ ok: false, code: 403, error: 'forbidden-action' }, { ok: false, status: 403 });
    },
  });
  const r = await rpcAra('https://dizilla.la', 'fight club', { fetchFn: f });
  assert.equal(r.action, 'searchContent');
  assert.equal(r.adaylar.length, 2);
});

test('rpcAra: ilk action 403 ise sıradakini dener', async () => {
  let deneme = 0;
  const f = sahteFetch({
    '/api/mj': (u, s) => {
      deneme += 1;
      const govde = JSON.parse(s.body);
      // Yalnız üçüncü action adı başarılı olsun.
      if (govde.action === 'search') return yanit(RPC_JSON);
      return yanit({ ok: false, error: 'forbidden-action' }, { ok: false, status: 403 });
    },
  });
  const r = await rpcAra('https://dizilla.la', 'q', { fetchFn: f });
  assert.equal(r.action, 'search');
  assert.ok(deneme >= 3);
});

test('rpcAra: hatırlanan action ilk sırada denenir', async () => {
  const denemeler = [];
  const f = sahteFetch({
    '/api/mj': (u, s) => {
      const govde = JSON.parse(s.body);
      denemeler.push(govde.action);
      return yanit(RPC_JSON);
    },
  });
  await rpcAra('https://dizilla.la', 'q', { fetchFn: f, denenenAction: 'searchTitles' });
  assert.equal(denemeler[0], 'searchTitles', 'hatırlanan action öne alınmalı');
});

test('filmmakinesiAra: Dual rozeti dublaj, Altyazı rozeti altyazı', async () => {
  const f = sahteFetch({ '/arama/': yanit(FMK_HTML) });
  const adaylar = await filmmakinesiAra('fight', { fetchFn: f });
  assert.equal(adaylar.length, 2);
  const dual = adaylar.find((a) => a.baslik === 'A Place to Fight For');
  const sub = adaylar.find((a) => a.baslik === 'Sub Only');
  assert.equal(dual.dilDurumu, 'dublaj');
  assert.equal(dual.yil, 2023, 'yıl alt bilgi satırından okunur');
  assert.deepEqual(dual.rozetler, ['HD', 'Dual']);
  assert.equal(dual.adres, 'https://filmmakinesi.to/film/a-place-to-fight-for-izle-2023/');
  assert.equal(sub.dilDurumu, 'altyazi');
});

test('filmmakinesiAra: tarayıcı başlıkları gönderilir (403 savunması)', async () => {
  const f = sahteFetch({ '/arama/': yanit(FMK_HTML) });
  await filmmakinesiAra('x', { fetchFn: f });
  const basliklar = f.cagrilar[0].secenek.headers;
  assert.match(basliklar['User-Agent'], /Mozilla/);
  assert.equal(basliklar['Accept-Language'], 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7');
});

/* ══ TOPLAYICI DAYANIKLILIK ════════════════════════════════════════════════ */

test('toplaHepsi: bir kaynak düşse de diğerleri devam eder', async () => {
  const f = sahteFetch({
    '/search/': new Error('HDFC çöktü'),
    'selcukflix.app/api/mj': yanit(RPC_JSON),
    'dizilla.la/api/mj': yanit(RPC_JSON),
    '/arama/': yanit(FMK_HTML),
  });
  const r = await toplaHepsi('fight club', { fetchFn: f });
  assert.equal(r.kaynakDurumu['star:hdfc'].ok, false, 'HDFC hatası raporlanmalı');
  assert.equal(r.kaynakDurumu['star:selcukflix'].ok, true);
  assert.ok(r.adaylar.length >= 4, 'diğer kaynakların adayları toplanmalı');
  assert.ok(r.adaylar.some((a) => a.kaynak === 'star:filmmakinesi'));
});

test('toplaHepsi: TÜM kaynaklar düşse bile fırlatmaz', async () => {
  const f = async () => { throw new Error('ağ yok'); };
  const r = await toplaHepsi('x', { fetchFn: f });
  assert.deepEqual(r.adaylar, [], 'hiçbir kaynak aday üretemez');
  // Her kaynak ya ok:false ya da hata alanıyla raporlanır — sessiz yutma yok.
  for (const [kod, durum] of Object.entries(r.kaynakDurumu)) {
    assert.equal(durum.adet, 0, `${kod} aday üretmemeli`);
    assert.ok(durum.ok === false || durum.hata, `${kod} hatasını raporlamalı`);
  }
});

test('toplaHepsi: kaynak seçimi daraltılabilir', async () => {
  const f = sahteFetch({
    '/search/': yanit(HDFC_JSON),
    '/arama/': yanit(FMK_HTML),
  });
  const r = await toplaHepsi('x', { fetchFn: f, kaynaklar: ['star:hdfc'] });
  assert.deepEqual(Object.keys(r.kaynakDurumu), ['star:hdfc']);
  assert.equal(r.adaylar.every((a) => a.kaynak === 'star:hdfc'), true);
});

/* ══ EŞLEŞTİRME ════════════════════════════════════════════════════════════ */

test('eslestir: IMDb eşleşmesi tam puan alır', () => {
  const adaylar = [
    { baslik: 'Başka Film', imdb: 'tt9999999', yil: 2024, tur: 'movie' },
    { baslik: 'Fight Club', imdb: 'tt0137523', yil: 1999, tur: 'movie' },
  ];
  const s = eslestir(adaylar, { baslik: 'Dövüş Kulübü', orijinalBaslik: 'Fight Club', imdb: 'tt0137523', yil: 1999, tur: 'movie' });
  // 'Başka Film' hem IMDb hem yıl (2024 vs 1999) uyuşmadığı için SERT REDDEDİLİR.
  assert.equal(s.length, 1);
  assert.equal(s[0].imdb, 'tt0137523');
  assert.equal(s[0].eslesmeSkoru, 1);
});

test('eslestir: Türkçe başlık benzerliği ile eşleşir', () => {
  const adaylar = [{ baslik: 'Fight Club', alt: 'Dövüş Kulübü', yil: 1999, tur: 'movie' }];
  const s = eslestir(adaylar, { baslik: 'Dövüş Kulübü', yil: 1999, tur: 'movie' });
  assert.equal(s.length, 1);
  assert.ok(s[0].eslesmeSkoru >= 0.55);
});

test('eslestir: uzak yıl cezalandırılır', () => {
  const adaylar = [{ baslik: 'Fight Club', yil: 1930, tur: 'movie' }];
  const s = eslestir(adaylar, { baslik: 'Fight Club', yil: 1999, tur: 'movie' });
  assert.equal(s.length, 0, '20 yıl fark eşiğin altına düşürmeli');
});

test('eslestir: tür uyuşmazlığı ceza alır', () => {
  const adaylar = [{ baslik: 'Fight Club', yil: 1999, tur: 'tv' }];
  const s = eslestir(adaylar, { baslik: 'Fight Club', yil: 1999, tur: 'movie' });
  assert.equal(s.length, 0);
});

/* ══ SİCİL: İÇERİK ANAHTARI ═══════════════════════════════════════════════ */

test('icerikAnahtari: film ve dizi biçimi, gidiş-dönüş', () => {
  assert.equal(icerikAnahtari({ tmdbTip: 'movie', tmdbId: '550' }), 'movie|550||');
  assert.equal(icerikAnahtari({ tmdbTip: 'tv', tmdbId: '1399', sezon: 1, bolum: 2 }), 'tv|1399|1|2');
  const k = icerikAnahtari({ tmdbTip: 'tv', tmdbId: '1', season: 3, episode: 4 });
  assert.deepEqual(icerikCoz(k), { tmdbTip: 'tv', tmdbId: '1', sezon: '3', bolum: '4' });
  assert.equal(icerikCoz('bozuk'), null);
});

/* ══ SİCİL: KANIT KURALLARI ═══════════════════════════════════════════════ */

test("kanitIsle: etiketle yazılan dublaj iddiası 'bilinmiyor'a düşer", () => {
  const s = sicilBos();
  const r = kanitIsle(s, {
    tmdbTip: 'movie', tmdbId: '550', saglayici: 'star:hdfc',
    dilDurumu: 'dublaj', kanit: 'etiket', sonGorulme: 1000,
  });
  assert.equal(r.kayit.dilDurumu, 'bilinmiyor', 'etiket medya kanıtı değildir');
});

test('kanitIsle: m3u8 kanıtıyla dublaj yazılır', () => {
  const s = sicilBos();
  const r = kanitIsle(s, {
    tmdbTip: 'movie', tmdbId: '550', saglayici: 'star:hdfc',
    dilDurumu: 'dublaj', kanit: 'm3u8', diller: ['tr', 'en'], sonGorulme: 1000,
  });
  assert.equal(r.kayit.dilDurumu, 'dublaj');
  assert.deepEqual(r.kayit.diller, ['tr', 'en']);
});

test('kanitIsle: aynı anahtar iki kez yazılırsa tek kayıt kalır', () => {
  const s = sicilBos();
  for (let i = 0; i < 3; i += 1) {
    kanitIsle(s, { tmdbTip: 'movie', tmdbId: '550', saglayici: 'a', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 1000 + i });
  }
  assert.equal(Object.keys(s.icerikler).length, 1);
  assert.equal(Object.keys(s.icerikler['movie|550||'].saglayicilar).length, 1);
});

test('kanitIsle: daha zayıf kanıt güçlüyü EZMEZ', () => {
  const s = sicilBos();
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '550', saglayici: 'a', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 5000 });
  const r = kanitIsle(s, { tmdbTip: 'movie', tmdbId: '550', saglayici: 'a', dilDurumu: 'bilinmiyor', kanit: 'yok', sonGorulme: 9000 });
  assert.equal(r.durum, 'korundu');
  assert.equal(r.kayit.dilDurumu, 'dublaj');
  assert.equal(r.kayit.sonGorulme, 9000, 'son görülme yine tazelenir');
});

test('kanitIsle: geçersiz durum/kanıt normalize edilir', () => {
  const s = sicilBos();
  const r = kanitIsle(s, {
    tmdbTip: 'movie', tmdbId: '1', saglayici: 'a',
    dilDurumu: 'saçmalık', kanit: 'uydurma', sonGorulme: 1,
  });
  assert.equal(r.kayit.dilDurumu, 'bilinmiyor');
  assert.equal(r.kayit.kanit, 'yok');
});

test('kanitIsle: sağlayıcı veya kimlik yoksa yazmaz', () => {
  const s = sicilBos();
  assert.equal(kanitIsle(s, { tmdbTip: 'movie', tmdbId: '1', saglayici: '' }).kayit, null);
  assert.equal(kanitIsle(s, { tmdbTip: 'movie', tmdbId: '', saglayici: 'a' }).kayit, null);
});

/* ══ SİCİL: KALITIM (ÖNSEL) ═══════════════════════════════════════════════ */

test('saglayiciOnseli: kanıt yoksa önsel 0', () => {
  const s = sicilBos();
  assert.deepEqual(saglayiciOnseli(s, 'x'), { onsel: 0, guven: 0, ornek: 0 });
});

test('saglayiciOnseli: 3 dublaj kanıtı güveni 1 yapar', () => {
  const s = sicilBos();
  for (let i = 0; i < 3; i += 1) {
    kanitIsle(s, { tmdbTip: 'movie', tmdbId: String(i), saglayici: 'a', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 1 });
  }
  const o = saglayiciOnseli(s, 'a');
  assert.equal(o.tr, 3);
  assert.equal(o.onsel, 1);
  assert.equal(o.guven, 1);
});

test('saglayiciOnseli: altyazılı yayın yarım puan, orijinal sıfır', () => {
  const s = sicilBos();
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '1', saglayici: 'a', dilDurumu: 'altyazi', kanit: 'm3u8', sonGorulme: 1 });
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '2', saglayici: 'a', dilDurumu: 'orijinal', kanit: 'm3u8', sonGorulme: 1 });
  const o = saglayiciOnseli(s, 'a');
  assert.equal(o.ornek, 2);
  assert.equal(o.onsel, 0.125, '(0 + 0.25) / 2');
});

test('saglayiciOnseli: bilinmiyor paydaya girmez', () => {
  const s = sicilBos();
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '1', saglayici: 'a', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 1 });
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '2', saglayici: 'a', dilDurumu: 'bilinmiyor', kanit: 'yok', sonGorulme: 1 });
  const o = saglayiciOnseli(s, 'a');
  assert.equal(o.ornek, 1, 'bilinmiyor ornek sayılmaz');
  assert.equal(o.onsel, 1);
});

test('saglayiciOnseli: aynı içerik yeniden ölçülünce sayılmaz (şişme yok)', () => {
  const s = sicilBos();
  for (let i = 0; i < 5; i += 1) {
    kanitIsle(s, { tmdbTip: 'movie', tmdbId: '1', saglayici: 'a', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 1 });
  }
  assert.equal(saglayiciOnseli(s, 'a').ornek, 1);
});

/* ══ SİCİL: TAZELİK / BAŞARI ══════════════════════════════════════════════ */

test('tazelik: yarılanma ömrü doğru', () => {
  const gun = 24 * 60 * 60 * 1000;
  assert.equal(tazelik(45 * gun, 0), 0, 'sonGorulme yoksa 0');
  assert.equal(tazelik(45 * gun, 45 * gun), 1);
  assert.ok(Math.abs(tazelik(gun, 0.999 * gun) - 1) < 0.01, 'yeni ölçüm taze sayılır');
  const yari = tazelik(90 * gun, 45 * gun);
  assert.ok(Math.abs(yari - 0.5) < 0.01, '45 günde yarıya iner');
});

test('basariOrani: Laplace düzeltmesi', () => {
  assert.equal(basariOrani({}), 0.5, 'kayıtsız nötr');
  assert.equal(basariOrani({ basari: 1, basarisizlik: 0 }), 2 / 3);
  assert.equal(basariOrani({ basari: 0, basarisizlik: 1 }), 1 / 3);
});

/* ══ SİCİL: PUANLAMA VE SIRALAMA ══════════════════════════════════════════ */

test('kaynakPuani: TR dublaj kanıtlı kaynak öne geçer', () => {
  const s = sicilBos();
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '550', saglayici: 'iyi', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 1000 });
  const icerik = 'movie|550||';
  const iyi = kaynakPuani(s, { saglayici: 'iyi' }, icerik, { simdi: 1000 });
  const kotu = kaynakPuani(s, { saglayici: 'bilinmeyen' }, icerik, { simdi: 1000 });
  assert.ok(iyi > kotu, `${iyi} > ${kotu}`);
});

test('sicileGoreSirala: dublajlı kaynağı başa alır, KALİTE sırası kademe içinde korunur', () => {
  const s = sicilBos();
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '550', saglayici: 'tr', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 1000 });
  const liste = [
    { id: 'a', saglayici: 'bilinmeyen1' },   // kademe 1
    { id: 'b', saglayici: 'tr' },            // kademe 0
    { id: 'c', saglayici: 'bilinmeyen2' },   // kademe 1
  ];
  const sirali = sicileGoreSirala(liste, s, 'movie|550||', { simdi: 1000 });
  assert.equal(sirali[0].id, 'b', 'dublaj kanıtlı kaynak başa geçer');
  assert.deepEqual(sirali.slice(1).map((x) => x.id), ['a', 'c'], 'kademe içi giriş sırası korunur');
  assert.equal(liste[0].id, 'a', 'girdi dizisi değiştirilmez');
});

test('sicileGoreSirala: KALİTE sırası bozulmaz (ölçülen kusur)', () => {
  /* ÖLÇÜLEN KUSUR (2026-11-14): saf puan sıralaması kanıtlı 480p'yi kanıtlı
     1080p'nin ÖNÜNE geçiriyordu — dublaj uğruna kalite sırası bozuluyordu.
     Kademe bölümlemesi kalite sırasını kademe içinde birebir korumalı. */
  const s = sicilBos();
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '550', saglayici: 'tr480', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 1000 });
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '550', saglayici: 'tr1080', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 1000 });
  // Çağıran kalite sırasıyla verir: 1080p önce, 480p sonra.
  const liste = [
    { id: '1080', saglayici: 'tr1080' },
    { id: '480', saglayici: 'tr480' },
    { id: 'orijinal', saglayici: 'bilinmeyen' },
  ];
  const sirali = sicileGoreSirala(liste, s, 'movie|550||', { simdi: 1000 });
  assert.deepEqual(sirali.map((x) => x.id), ['1080', '480', 'orijinal'],
    'iki dublaj kanıtlı kaynak kalite sırasını KORUMALI');
});

test('sicileGoreSirala: özgün dil kanıtlı kaynak SONA atılır', () => {
  const s = sicilBos();
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '550', saglayici: 'ozgun', dilDurumu: 'orijinal', kanit: 'm3u8', sonGorulme: 1000 });
  const liste = [
    { id: 'ozgun', saglayici: 'ozgun' },
    { id: 'bilinmiyor', saglayici: 'yeni' },
  ];
  const sirali = sicileGoreSirala(liste, s, 'movie|550||', { simdi: 1000 });
  assert.deepEqual(sirali.map((x) => x.id), ['bilinmiyor', 'ozgun']);
});

test('sicileGoreSirala: ESKİ kanıt kademe belirlemez (yanlış tarafa itmez)', () => {
  const s = sicilBos();
  const gun = 24 * 60 * 60 * 1000;
  // 200 gün önce ölçülmüş dublaj kanıtı: tazelik < 0.35 → kademe nötr kalmalı.
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '550', saglayici: 'eski', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 0 });
  const liste = [
    { id: 'a', saglayici: 'yeni1' },
    { id: 'eski', saglayici: 'eski' },
    { id: 'c', saglayici: 'yeni2' },
  ];
  const sirali = sicileGoreSirala(liste, s, 'movie|550||', { simdi: 200 * gun });
  assert.deepEqual(sirali.map((x) => x.id), ['a', 'eski', 'c'], 'eski kanıt sırayı değiştirmemeli');
});

test('sicileGoreSirala: tek/boş listede güvenli', () => {
  assert.deepEqual(sicileGoreSirala([], sicilBos(), 'x'), []);
  assert.equal(sicileGoreSirala([{ id: 1 }], sicilBos(), 'x').length, 1);
  assert.deepEqual(sicileGoreSirala(null, sicilBos(), 'x'), []);
});

test('taramaSirasi: kanıtlı sağlayıcı öne, kanıtsız nötr', () => {
  const s = sicilBos();
  for (let i = 0; i < 3; i += 1) {
    kanitIsle(s, { tmdbTip: 'movie', tmdbId: String(i), saglayici: 'trli', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 1 });
  }
  const sira = taramaSirasi(s, ['bilinmeyen', 'trli', 'baska']);
  assert.equal(sira[0], 'trli', 'TR kanıtlı sağlayıcı ilk sırada');
  assert.equal(sira.length, 3);
});

test('sicilIpucu: doğrudan kanıtlı sağlayıcıyı öne çıkarır', () => {
  const s = sicilBos();
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '550', saglayici: 'x', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 1000 });
  const ipucu = sicilIpucu(s, 'movie|550||', { simdi: 1000 });
  assert.equal(ipucu[0].saglayici, 'x');
  assert.ok(ipucu[0].guc > 0);
});

/* ══ SİCİL: KENDİNİ ONARMA ════════════════════════════════════════════════ */

test('oynatmaBasarisiz: üst üste hata kaynağı düşürür', () => {
  const s = sicilBos();
  const icerik = 'movie|550||';
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '550', saglayici: 'a', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 1000 });
  const once = kaynakPuani(s, { saglayici: 'a' }, icerik, { simdi: 1000 });
  oynatmaBasarisiz(s, { icerik, saglayici: 'a', simdi: 1000 });
  oynatmaBasarisiz(s, { icerik, saglayici: 'a', simdi: 1000 });
  oynatmaBasarisiz(s, { icerik, saglayici: 'a', simdi: 1000 });
  const sonra = kaynakPuani(s, { saglayici: 'a' }, icerik, { simdi: 1000 });
  assert.ok(sonra < once, `başarısızlık puanı düşürmeli: ${sonra} < ${once}`);
  assert.equal(s.icerikler[icerik].saglayicilar.a.basarisizlik, 3);
});

test('oynatmaBasarili: art arda başarı puanı yükseltir', () => {
  const s = sicilBos();
  const icerik = 'movie|550||';
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '550', saglayici: 'a', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 1000 });
  const once = kaynakPuani(s, { saglayici: 'a' }, icerik, { simdi: 1000 });
  for (let i = 0; i < 3; i += 1) oynatmaBasarili(s, { icerik, saglayici: 'a', simdi: 1000 });
  const sonra = kaynakPuani(s, { saglayici: 'a' }, icerik, { simdi: 1000 });
  assert.ok(sonra > once, `başarı puanı yükseltmeli: ${sonra} > ${once}`);
});

test('oynatmaBasarisiz: soğuma sonrası sayaç yarıya iner', () => {
  const s = sicilBos();
  const icerik = 'movie|550||';
  const gun = 24 * 60 * 60 * 1000;
  for (let i = 0; i < 4; i += 1) oynatmaBasarisiz(s, { icerik, saglayici: 'a', simdi: 1000 });
  assert.equal(s.icerikler[icerik].saglayicilar.a.basarisizlik, 4);
  // 15 gün sonra yeni hata: önce yarıya iner, sonra +1.
  oynatmaBasarisiz(s, { icerik, saglayici: 'a', simdi: 1000 + 15 * gun });
  assert.equal(s.icerikler[icerik].saglayicilar.a.basarisizlik, 3, '4/2 + 1');
});

/* ══ SİCİL: BİRLEŞTİRME / ÖZET / DEPO ═════════════════════════════════════ */

test('sicilBirlestir: sıra bağımsız, güçlü kanıt kazanır', () => {
  const a = sicilBos();
  const b = sicilBos();
  kanitIsle(a, { tmdbTip: 'movie', tmdbId: '1', saglayici: 'x', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 100 });
  kanitIsle(b, { tmdbTip: 'movie', tmdbId: '1', saglayici: 'x', dilDurumu: 'bilinmiyor', kanit: 'yok', sonGorulme: 200 });
  kanitIsle(b, { tmdbTip: 'movie', tmdbId: '2', saglayici: 'y', dilDurumu: 'altyazi', kanit: 'm3u8', sonGorulme: 200 });
  const ab = sicilBirlestir(a, b);
  const ba = sicilBirlestir(b, a);
  assert.deepEqual(Object.keys(ab.icerikler).sort(), Object.keys(ba.icerikler).sort());
  assert.equal(ab.icerikler['movie|1||'].saglayicilar.x.dilDurumu, 'dublaj');
  assert.equal(ab.icerikler['movie|1||'].saglayicilar.x.sonGorulme, 200);
});

test('sicilOzeti: sayaçlar', () => {
  const s = sicilBos();
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '1', saglayici: 'a', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 1 });
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '1', saglayici: 'b', dilDurumu: 'orijinal', kanit: 'm3u8', sonGorulme: 1 });
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '2', saglayici: 'a', dilDurumu: 'altyazi', kanit: 'm3u8', sonGorulme: 1 });
  const o = sicilOzeti(s);
  assert.equal(o.icerikSayisi, 2);
  assert.equal(o.trDublajliIcerik, 1);
  assert.equal(o.kaynakSayisi, 3);
  assert.equal(o.saglayiciSayisi, 2);
});

test('sicilYukle/sicilKaydet: gidiş-dönüş ve bozuk veri güvenliği', () => {
  const depo = (() => {
    const m = new Map();
    return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
  })();
  const s = sicilBos();
  kanitIsle(s, { tmdbTip: 'movie', tmdbId: '1', saglayici: 'a', dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 5 });
  assert.equal(sicilKaydet(depo, s), true);
  const geri = sicilYukle(depo);
  assert.equal(sicilOzeti(geri).kaynakSayisi, 1);
  assert.equal(geri.guncelleme, 5);
  // Bozuk JSON → boş sicil, fırlatma yok.
  depo.setItem(SICIL_DEPO_ANAHTARI, '{bozuk');
  assert.equal(sicilOzeti(sicilYukle(depo)).kaynakSayisi, 0);
  // Eski sürüm → boş sicil.
  depo.setItem(SICIL_DEPO_ANAHTARI, JSON.stringify({ surum: 999, icerikler: {} }));
  assert.equal(sicilYukle(depo).surum, SICIL_SURUMU);
});

test('sicilKaydet: kota dolsa da fırlatmaz', () => {
  const depo = { setItem: () => { throw new Error('QuotaExceededError'); } };
  assert.equal(sicilKaydet(depo, sicilBos()), false);
});

test('tohumdanSicil: eşlenen kok sağlayıcıya, eşlenmeyen toplayıcıya yazılır', () => {
  const tohum = {
    uretilmeTarihi: '2026-11-13T16:13:13.401Z',
    kayitlar: [
      { tmdbTip: 'movie', tmdbId: '550', sezon: null, bolum: null, dilDurumu: 'dublaj', kanit: 'm3u8', diller: ['tr'], kaynakKok: 'kokA', adresOzet: 'x' },
      { tmdbTip: 'movie', tmdbId: '551', sezon: null, bolum: null, dilDurumu: 'dublaj', kanit: 'm3u8', diller: ['tr'], kaynakKok: 'eşlenmeyen', adresOzet: 'y' },
    ],
  };
  const s = sicilBos();
  const n = tohumdanSicil(s, tohum, { kokKodlari: { kokA: 'star:hdfc' }, simdi: 999 });
  assert.equal(n, 2, 'hiçbir ölçüm atılmaz');
  // Eşlenen kok doğrudan sağlayıcıya yazılır.
  assert.equal(s.icerikler['movie|550||'].saglayicilar['star:hdfc'].dilDurumu, 'dublaj');
  assert.equal(s.icerikler['movie|550||'].saglayicilar['star:hdfc'].sonGorulme, Date.parse(tohum.uretilmeTarihi));
  // Eşlenmeyen kok İÇERİK kanıtı olarak toplayıcı anahtarda korunur
  // (uydurma sağlayıcı atfı yok; `icerikOnseli` bu kanıtı kullanır).
  assert.equal(s.icerikler['movie|551||'].saglayicilar['arsiv:tohum'].dilDurumu, 'dublaj');
  assert.equal(s.icerikler['movie|551||'].saglayicilar['arsiv:tohum'].kanit, 'm3u8');
});

test('icerikOnseli: içerikteki TR kanıtı sağlayıcıdan bağımsız puan verir', () => {
  const s = sicilBos();
  const simdi = 1000;
  kanitIsle(s, {
    tmdbTip: 'movie', tmdbId: '550', saglayici: 'arsiv:tohum',
    dilDurumu: 'dublaj', kanit: 'm3u8', diller: ['tr'], sonGorulme: simdi,
  });
  const icerik = 'movie|550||';
  assert.ok(icerikOnseli(s, icerik, { simdi }) > 0.9, 'taze kanıt ~1 önsel');
  // Aynı içerikteki BAŞKA bir kaynak da bu önselden faydalanır.
  const baska = kaynakPuani(s, { saglayici: 'tamamen-yeni' }, icerik, { simdi });
  const bosIcerik = kaynakPuani(s, { saglayici: 'tamamen-yeni' }, 'movie|999||', { simdi });
  assert.ok(baska > bosIcerik, `içerik önseli puanı yükseltmeli: ${baska} > ${bosIcerik}`);
});

test('icerikOnseli: eski kanıt söner, etiket kanıt sayılmaz', () => {
  const s = sicilBos();
  const gun = 24 * 60 * 60 * 1000;
  kanitIsle(s, {
    tmdbTip: 'movie', tmdbId: '550', saglayici: 'a',
    dilDurumu: 'dublaj', kanit: 'm3u8', sonGorulme: 0,
  });
  // 180 gün sonra üstel olarak sönmeli.
  assert.ok(icerikOnseli(s, 'movie|550||', { simdi: 180 * gun }) < 0.1);
  // Etiket kanıtı içerik önseline hiç girmez.
  const s2 = sicilBos();
  kanitIsle(s2, {
    tmdbTip: 'movie', tmdbId: '550', saglayici: 'a',
    dilDurumu: 'dublaj', kanit: 'etiket', sonGorulme: 1000,
  });
  assert.equal(icerikOnseli(s2, 'movie|550||', { simdi: 1000 }), 0);
});

test('siciliKirp: en yeni içerikleri tutar', () => {
  const s = sicilBos();
  for (let i = 0; i < 10; i += 1) {
    s.icerikler[`movie|${i}||`] = { saglayicilar: {}, guncelleme: i };
  }
  siciliKirp(s, { enFazlaIcerik: 4 });
  assert.equal(Object.keys(s.icerikler).length, 4);
  assert.deepEqual(Object.keys(s.icerikler).sort(), ['movie|6||', 'movie|7||', 'movie|8||', 'movie|9||']);
});

/* ══ SİCİLE YAZMA + UÇTAN UCA (ağsız) ════════════════════════════════════ */

test('sicileYaz: beyan etiketi sicile yazılır ama dublaj sayılmaz', () => {
  const s = sicilBos();
  const hedef = { tmdbTip: 'movie', tmdbId: '550', simdi: 1000 };
  const adaylar = [{
    kaynak: 'star:filmmakinesi', dilDurumu: 'dublaj', kanit: 'etiket',
  }];
  const r = sicileYaz(s, adaylar, hedef);
  assert.equal(r.yazilan, 1);
  assert.equal(s.icerikler['movie|550||'].saglayicilar['star:filmmakinesi'].dilDurumu, 'bilinmiyor');
  assert.equal(s.icerikler['movie|550||'].saglayicilar['star:filmmakinesi'].kanit, 'etiket',
    'etiket kanıtı korunur (yeniden ölçüm ipucu)');
});

test('yildizArsiviTara: uçtan uca aday + eşleşme + sicil', async () => {
  const f = sahteFetch({
    '/search/': yanit(HDFC_JSON),
    'selcukflix.app/api/mj': yanit(RPC_JSON),
    'dizilla.la/api/mj': yanit(RPC_JSON),
    '/arama/': yanit(FMK_HTML),
  });
  const sicil = sicilBos();
  const r = await yildizArsiviTara({
    baslik: 'Dövüş Kulübü', orijinalBaslik: 'Fight Club', imdb: 'tt0137523',
    yil: 1999, tmdbTip: 'movie', tmdbId: '550', simdi: 1000,
  }, { fetchFn: f, sicil });
  assert.ok(r.adaylar.length >= 4);
  assert.ok(r.eslesen.length >= 2, 'IMDb eşleşmesi en az iki kaynakta olmalı');
  const kaynaklar = new Set(r.eslesen.map((a) => a.kaynak));
  assert.ok(kaynaklar.has('star:selcukflix'));
  assert.ok(kaynaklar.has('star:hdfc'));
  // Yıldız adları arayüzde gerçek alan adı sızdırmaz.
  for (const k of kaynaklar) assert.doesNotMatch(yildizAdi(k), /\.(com|nl|la|app|to)/);
});

test('yildizArsiviTara: sorgu yoksa ağa çıkmaz', async () => {
  const f = sahteFetch({});
  const r = await yildizArsiviTara({ tmdbId: '550' }, { fetchFn: f });
  assert.deepEqual(r.adaylar, []);
  assert.equal(f.cagrilar.length, 0);
});

test('yildizKaynakMi / yildizAdi', () => {
  assert.equal(yildizKaynakMi('star:hdfc'), true);
  assert.equal(yildizKaynakMi('sp_hulk_'), false);
  assert.equal(yildizAdi('star:dizilla'), 'Multidub Dizilla');
  assert.equal(yildizAdi('yok'), 'Multidub');
  assert.equal(YILDIZ_KAYNAKLAR.length, 4);
});

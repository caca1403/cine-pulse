/* OpenSubtitles — tüm kaynaklar altyazı desteği (kullanıcı 2026-10-30)
   Kapsam:
   • İstemci servisi: SRT→VTT, ara-URL üretimi, ara-JSON ayrıştırma (etiket
     dürüstlüğü), birleştirme sırası/tekilleştirme, kaynak-altyazısı ayıklama.
   • Sunucu ucu (api/[...all].js): mod=ara JSON sözleşmesi ve dil=tr|en —
     dış ağ kapalıysa yalnız yapısal sözleşme doğrulanır (boş liste de geçerli). */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  srtToVtt,
  imdbKimligi,
  sunucuAraUrl,
  araJsonAdaylari,
  altyaziBirlestir,
  kaynakAltyaziAdaylari,
  restAramaUrl,
  restSirala
} from '../src/services/icerik/altyaziServisi.js';

test('srtToVtt: SRT zaman damgaları VTT biçimine çevrilir, VTT olduğu gibi geçer', () => {
  const srt = '1\n00:01:09,386 --> 00:01:11,221\nMerhaba <i>dünya</i>\n\n2\n0:02:05,150 --> 00:02:07,150\n<font color="#00FF00">İkinci</font>\n';
  const vtt = srtToVtt(srt);
  assert.match(vtt, /^WEBVTT/);
  assert.match(vtt, /00:01:09\.386 --> 00:01:11\.221/);
  assert.match(vtt, /00:02:05\.150 --> 00:02:07\.150/); // saat eksik tamamlandı
  assert.doesNotMatch(vtt, /<font/);
  const vttGirdi = 'WEBVTT\n\n00:00:01.000 --> 00:00:02.000\nx\n';
  assert.equal(srtToVtt(vttGirdi), vttGirdi);
});

test('imdbKimligi: gömülü tt kimliğini bulur, yoksa boş döner', () => {
  assert.equal(imdbKimligi('tt0903747'), 'tt0903747');
  assert.equal(imdbKimligi('/film/tt1375666-x'), 'tt1375666');
  assert.equal(imdbKimligi('12345'), '');
});

test('sunucuAraUrl: imdb önce gelir, bölüm bilgiyi yalnız tv taşır, mod=ara kurulur', () => {
  const tv = new URL(sunucuAraUrl({
    imdbId: 'tt0903747', tmdbId: '1396', title: 'Breaking Bad',
    type: 'tv', season: 2, episode: 5, temelAdres: 'https://api.test/api/subtitles'
  }));
  assert.equal(tv.searchParams.get('imdbId'), 'tt0903747');
  assert.equal(tv.searchParams.get('tmdbId'), null); // imdb varsa tmdb gereksiz
  assert.equal(tv.searchParams.get('season'), '2');
  assert.equal(tv.searchParams.get('type'), 'tv');
  assert.equal(tv.searchParams.get('mod'), 'ara');

  const film = new URL(sunucuAraUrl({
    tmdbId: '550', title: 'Dövüş Kulübü', type: 'movie', temelAdres: 'https://api.test/api/subtitles'
  }));
  assert.equal(film.searchParams.get('tmdbId'), '550');
  assert.equal(film.searchParams.get('season'), null);
  assert.equal(film.searchParams.get('type'), 'movie');

  const dil = new URL(sunucuAraUrl({ imdbId: 'tt0903747', dil: 'en', temelAdres: 'https://api.test/api/subtitles' }));
  assert.equal(dil.searchParams.get('dil'), 'en');
  assert.equal(dil.searchParams.get('mod'), null); // dil modu ara modu DEĞİLDİR
});

test('araJsonAdaylari: yalnız BULUNAN diller listelenir — etiket uyduramaz', () => {
  const aday = araJsonAdaylari({
    altyazilar: [
      { dil: 'tr', etiket: 'OpenSubtitles (Türkçe)', bulundu: true, vttUrl: 'https://api.test/s?dil=tr' },
      { dil: 'en', etiket: 'OpenSubtitles (İngilizce)', vttUrl: 'https://api.test/s?dil=en' },
      { dil: 'de', etiket: 'Uydurma', bulundu: false, vttUrl: 'https://api.test/s?dil=de' },
      { dil: 'tr', etiket: 'adres yok' }
    ]
  });
  assert.deepEqual(aday.map(a => a.dil), ['tr', 'en']);
  assert.equal(aday[0].etiket, 'OpenSubtitles (Türkçe)');
  assert.equal(aday[1].url, 'https://api.test/s?dil=en');
  assert.deepEqual(araJsonAdaylari(null), []);
});

test('altyaziBirlestir: tekilleştirir, yedek yalnız EKSİK dili tamamlar, TR önce gelir', () => {
  const ana = [
    { dil: 'tr', url: 'A-tr1' },
    { dil: 'tr', url: 'A-tr2' },
    { dil: 'en', url: 'A-en1' }
  ];
  const yedek = [
    { dil: 'tr', url: 'B-tr' }, // ana TR dolu → eklenmez
    { dil: 'en', url: 'A-en1' }, // aynı url → tekilleşir
    { dil: 'tr', url: 'C-tr' }
  ];
  const birlesik = altyaziBirlestir(ana, yedek);
  assert.deepEqual(birlesik.map(a => a.url), ['A-tr1', 'A-tr2', 'A-en1']);

  const eksikEn = altyaziBirlestir(
    [{ dil: 'tr', url: 'A-tr1' }],
    [{ dil: 'tr', url: 'B-tr' }, { dil: 'en', url: 'B-en' }, { dil: 'en', url: 'C-en' }]
  );
  assert.deepEqual(eksikEn.map(a => `${a.dil}:${a.url}`), ['tr:A-tr1', 'en:B-en']);

  const bosAna = altyaziBirlestir([], [{ dil: 'en', url: 'B-en' }, { dil: 'tr', url: 'B-tr' }]);
  assert.deepEqual(bosAna.map(a => a.dil), ['tr', 'en']); // TR sırası korunur
});

test('kaynakAltyaziAdaylari: TR altyaziUrl öne; OS/bağıl/çift satırlar elenir', () => {
  const aday = kaynakAltyaziAdaylari({
    altyaziUrl: 'https://cdn.x/sub_tr.srt',
    subtitles: [
      { label: 'OpenSubtitles (Türkçe)', src: 'https://api.test/api/subtitles?imdbId=tt1' }, // OS — elenir
      { label: 'VİDEO_subs', src: 'https://cdn.y/altyazi.srt' },
      { label: 'bağıl', src: '/api/subtitles?x=1' }, // bağıl — elenir
      { label: 'VİDEO_subs', src: 'https://cdn.y/altyazi.srt' } // çift — elenir
    ]
  });
  assert.equal(aday.length, 2);
  assert.equal(aday[0].etiket, 'Kaynak altyazısı (Türkçe)');
  assert.equal(aday[0].dil, 'tr');
  assert.equal(aday[1].url, 'https://cdn.y/altyazi.srt');
  assert.deepEqual(kaynakAltyaziAdaylari(null), []);
});

test('restAramaUrl: imdb önce; imdb yoksa sorgu; S/E yalnız ikisiyle; dil kodu', () => {
  assert.equal(
    restAramaUrl({ imdbId: 'tt0903747', season: 1, episode: 1, dil: 'tr' }),
    'https://rest.opensubtitles.org/search/imdbid-0903747/season-1/episode-1/sublanguageid-tur'
  );
  assert.equal(
    restAramaUrl({ title: 'Fight Club', dil: 'en' }),
    'https://rest.opensubtitles.org/search/query-fight+club/sublanguageid-eng'
  );
  assert.equal(restAramaUrl({ season: 1, episode: 1 }), ''); // kimlik yok
});

test('restSirala: SRT + çok-indirilen kazanır; forced ve cd2 elenir; EN etiketi doğru', () => {
  const aday = restSirala([
    { SubDownloadLink: 'https://x/forced', SubFormat: 'srt', SubForeignPartsOnly: '1', SubDownloadsCnt: '9000' },
    { SubDownloadLink: 'https://x/cd2', SubFormat: 'srt', SubFileName: 'movie cd2.srt', SubDownloadsCnt: '9000' },
    { SubDownloadLink: 'https://x/iyi', SubFormat: 'srt', SubDownloadsCnt: '5000' },
    { SubDownloadLink: 'https://x/sub', SubFormat: 'sub', SubDownloadsCnt: '99999' },
    { SubDownloadsCnt: '1' } // link yok → elenir
  ], 'en');
  assert.equal(aday.length, 2);
  assert.equal(aday[0].url, 'https://x/iyi');
  assert.equal(aday[0].dil, 'en');
  assert.match(aday[0].etiket, /İngilizce/);
  assert.equal(aday[0].ikili, true);
  assert.deepEqual(restSirala(null, 'tr'), []);
});

/* ── Sunucu ucu: ara JSON sözleşmesi ve dil modu (yerel handler, sahte req/res) ── */
function sahteRes() {
  const res = { headers: {}, statusCode: 200, body: null };
  res.setHeader = (k, v) => { res.headers[String(k).toLowerCase()] = String(v); };
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (o) => { res.body = JSON.stringify(o); };
  res.send = (t) => { res.body = String(t); };
  res.end = () => {};
  return res;
}
const sahteReq = (url) => ({
  method: 'GET',
  url,
  headers: { host: 'api.test', 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) CinePulseTest', 'x-forwarded-for': '203.0.113.9' }
});

test('api /api/subtitles?mod=ara → {altyazilar:[…]} JSON; bulunan satırlar vttUrl+dil taşır', async () => {
  const { default: handler } = await import('../api/[...all].js');
  const res = sahteRes();
  await handler(sahteReq('/api/subtitles?mod=ara&imdbId=tt0903747&season=1&episode=1&type=tv'), res);
  assert.equal(res.statusCode, 200);
  assert.match(res.headers['content-type'], /application\/json/);
  const veri = JSON.parse(res.body);
  assert.ok(Array.isArray(veri.altyazilar));
  for (const a of veri.altyazilar) {
    assert.ok(['tr', 'en'].includes(a.dil), `dil geçersiz: ${a.dil}`);
    assert.ok(a.vttUrl.startsWith('https://api.test/api/subtitles?'), a.vttUrl);
    assert.ok(a.vttUrl.includes(`dil=${a.dil}`), 'vttUrl dil paramını taşımalı');
    assert.ok(a.etiket.includes(a.dil === 'en' ? 'İngilizce' : 'Türkçe'), 'etiket dile göre dürüst olmalı');
  }
});

test('api /api/subtitles dil=en → WebVTT içerik tipi; içerik boş olsa da 200 (ölü iz yok)', async () => {
  const { default: handler } = await import('../api/[...all].js');
  const res = sahteRes();
  await handler(sahteReq('/api/subtitles?imdbId=tt0903747&season=1&episode=1&type=tv&dil=en'), res);
  assert.equal(res.statusCode, 200);
  assert.match(res.headers['content-type'], /text\/vtt/);
  assert.match(String(res.body), /^WEBVTT/);
});

test('api /api/subtitles?mod=ara kimlik yoksa boş liste (uydurma içerik yok)', async () => {
  const { default: handler } = await import('../api/[...all].js');
  const res = sahteRes();
  await handler(sahteReq('/api/subtitles?mod=ara&type=movie'), res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(res.body).altyazilar, []);
});

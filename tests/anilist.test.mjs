/* AniList izleme senkron servisi testleri — ağsız sahte-fetch ile (debrid testi deseni). */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  anilistAuthUrl,
  anilistTokenAl,
  anilistKimligi,
  anilistSorgu,
  anilistDurumu,
  anilistMedyaIdGetir,
  anilistIlerlet,
  anilistScroble,
} from '../src/services/icerik/anilistService.js';

const TOKEN_KEY = 'cp_anilist_token';

function fakeFetch(routes) {
  const seen = [];
  const fn = async (url, opts = {}) => {
    seen.push({ url: String(url), opts });
    for (const r of routes) {
      if (r.match(String(url), opts)) return r.respond(String(url), opts);
    }
    return { ok: false, status: 404, json: async () => ({ error: 'not_found' }) };
  };
  fn.seen = seen;
  return fn;
}

const ok = (data) => ({ ok: true, status: 200, json: async () => data });
const giris = (f, i = 0) => {
  const e = f.seen[i];
  return { ...e, govde: JSON.parse(e.opts.body) };
};

function withMemoryStorage() {
  const mem = new Map();
  const store = {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => { mem.set(k, String(v)); },
    removeItem: (k) => { mem.delete(k); },
  };
  const prev = globalThis.localStorage;
  Object.defineProperty(globalThis, 'localStorage', { value: store, configurable: true, writable: true });
  return () => {
    if (prev === undefined) delete globalThis.localStorage;
    else Object.defineProperty(globalThis, 'localStorage', { value: prev, configurable: true, writable: true });
  };
}

function withFakeFetch(fn) {
  const prev = globalThis.fetch;
  globalThis.fetch = fn;
  return () => { globalThis.fetch = prev; };
}

function tokenVer(access = 'tkn123') {
  localStorage.setItem(TOKEN_KEY, JSON.stringify({ access_token: access, expires_in: 31536000 }));
}

/* 1 — OAuth authorize adresi: secret yoksa anonim (implicit) akış */
test('oauth: anilistAuthUrl secret sizken response_type=token', () => {
  const restore = withMemoryStorage();
  try {
    assert.equal(
      anilistAuthUrl('123'),
      'https://anilist.co/api/v2/oauth/authorize?client_id=123&redirect_uri=&response_type=token'
    );
    localStorage.setItem('cp_anilist_custom_client_secret', 'sir');
    const url = new URL(anilistAuthUrl('123'));
    assert.equal(url.origin + url.pathname, 'https://anilist.co/api/v2/oauth/authorize');
    assert.equal(url.searchParams.get('response_type'), 'code', 'secret girilmişse code akışı');
  } finally {
    restore();
  }
});

/* 2 — token takası: doğru gövde, doğru uç, depolamaya yazım */
test('oauth: anilistTokenAl doğru gövdeyi POST eder ve token depolar', async () => {
  const restore = withMemoryStorage();
  const f = fakeFetch([{
    match: (u, o) => u === 'https://anilist.co/api/v2/oauth/token' && (o.method || 'GET') === 'POST',
    respond: () => ok({ access_token: 'yeni-token', token_type: 'Bearer', expires_in: 31536000 }),
  }]);
  const fetchRestore = withFakeFetch(f);
  try {
    localStorage.setItem('cp_anilist_custom_client_id', '123');
    localStorage.setItem('cp_anilist_custom_client_secret', 'sir');
    const token = await anilistTokenAl('kod-7');
    assert.equal(token.access_token, 'yeni-token');
    const e = giris(f);
    assert.deepStrictEqual(e.govde, {
      grant_type: 'authorization_code',
      client_id: '123',
      client_secret: 'sir',
      redirect_uri: '',
      code: 'kod-7',
    });
    assert.equal(anilistKimligi().bagli, true, 'token localStorage alındı');
  } finally {
    fetchRestore();
    restore();
  }
});

/* 3 — durum haritalama */
test('sozlesme: anilistDurumu Türkçe durumları AniList enumuna çevirir', () => {
  assert.equal(anilistDurumu('watching'), 'WATCHING');
  assert.equal(anilistDurumu('paused'), 'PAUSED');
  assert.equal(anilistDurumu('completed'), 'COMPLETED');
  assert.equal(anilistDurumu('tanimsiz'), 'WATCHING');
});

/* 4 — SaveMediaListEntry mutasyonu doğru status/progress taşır */
test('scrobble: anilistIlerlet SaveMediaListEntry mutasyonunu doldurur', async () => {
  const restore = withMemoryStorage();
  tokenVer();
  const f = fakeFetch([{
    match: (u) => u === 'https://graphql.anilist.co',
    respond: () => ok({ data: { SaveMediaListEntry: { id: 9, status: 'COMPLETED', progress: 5 } } }),
  }]);
  const fetchRestore = withFakeFetch(f);
  try {
    const sonuc = await anilistIlerlet({ idMal: 123, bolum: 5, durum: 'completed' });
    assert.equal(sonuc, true);
    const e = giris(f);
    assert.equal(e.opts.method, 'POST');
    assert.equal(e.opts.headers.Authorization, 'Bearer tkn123');
    assert.match(e.govde.query, /SaveMediaListEntry\(mediaId: \$mediaId, progress: \$progress, status: \$status\)/);
    assert.deepStrictEqual(e.govde.variables, { mediaId: 123, progress: 5, status: 'COMPLETED' });
  } finally {
    fetchRestore();
    restore();
  }
});

/* 5 — anime filmde bölüm yok: progress alanı hiç gönderilmez */
test('scrobble: bölüm 0 ise progress değeri gönderilmez', async () => {
  const restore = withMemoryStorage();
  tokenVer();
  const f = fakeFetch([{ match: (u) => u === 'https://graphql.anilist.co', respond: () => ok({ data: {} }) }]);
  const fetchRestore = withFakeFetch(f);
  try {
    await anilistIlerlet({ idMal: 7, bolum: 0, durum: 'completed' });
    assert.ok(!('progress' in giris(f).govde.variables), 'progress alanı gövdeye hiç konmadı');
  } finally {
    fetchRestore();
    restore();
  }
});

/* 6 — guard: bağlı değilken hiç ağa çıkılmaz */
test('guard: token yokken anilistIlerlet ağa dokunmaz', async () => {
  const restore = withMemoryStorage();
  const f = fakeFetch([{ match: () => true, respond: () => ok({}) }]);
  const fetchRestore = withFakeFetch(f);
  try {
    assert.equal(await anilistIlerlet({ idMal: 1, bolum: 1, durum: 'watching' }), null);
    assert.equal(await anilistSorgu('query {}').catch((e) => e.message), 'AniList hesabı bağlı değil');
    assert.equal(f.seen.length, 0);
  } finally {
    fetchRestore();
    restore();
  }
});

/* 7 — guard: anime olmayan içerikte servis çağrılmaz (Trakt yolu korunur) */
test('guard: anime olmayanda anilistScroble servis çağrısı yapmaz', async () => {
  const restore = withMemoryStorage();
  tokenVer();
  const f = fakeFetch([{ match: () => true, respond: () => ok({}) }]);
  const fetchRestore = withFakeFetch(f);
  try {
    assert.equal(await anilistScroble({ isAnime: false, tmdbId: 999 }, true, false), null);
    assert.equal(f.seen.length, 0);
  } finally {
    fetchRestore();
    restore();
  }
});

/* 8 — tmdbId → mal_id → AniList Media zinciri ve WATCHING yazımı */
test('zincir: anilistScroble TMDB harici kimlikten idMal çözer ve mutasyon gönderir', async () => {
  const restore = withMemoryStorage();
  tokenVer();
  const f = fakeFetch([
    { // TMDB external_ids (anahtar parametreli adres ya da kısmi eşleşme)
      match: (u) => u.includes('api.themoviedb.org/3/tv/999/external_ids'),
      respond: () => ok({ mal_id: 456 }),
    },
    { // Media(idMal) sorgusu — anilistSorgu tüm GraphQL çağrılarını tek uca yapar
      match: (u) => u === 'https://graphql.anilist.co',
      respond: (u, o) => {
        const body = JSON.parse(o.body);
        if (body.query.includes('Media(idMal')) return ok({ data: { Media: { id: 789 } } });
        return ok({ data: { SaveMediaListEntry: { id: 55, status: 'WATCHING', progress: 3 } } });
      },
    },
  ]);
  const fetchRestore = withFakeFetch(f);
  try {
    const sonuc = await anilistScroble({ isAnime: true, tmdbId: 999, episode: 3 }, false, false);
    assert.equal(sonuc, true);
    // seen[0]: TMDB external_ids (GET, gövdesiz) — siyah yeşil değil, yalnız yol
    assert.ok(f.seen[0].url.includes('api.themoviedb.org/3/tv/999/external_ids'));
    // seen[1]: Media sorgusu idMal=456 ile
    const sorgu = giris(f, 1);
    assert.match(sorgu.govde.query, /Media\(idMal: \$idMal, type: ANIME\)/);
    assert.deepStrictEqual(sorgu.govde.variables, { idMal: 456 });
    // seen[2]: SaveMediaListEntry, ön bellekteki mediaId 789 ile
    const mutasyon = giris(f, 2);
    assert.deepStrictEqual(mutasyon.govde.variables, { mediaId: 789, progress: 3, status: 'WATCHING' });
    // idMal doğrudan verilmışse TMDB/Media aramaları tamamen atlanır
    await anilistScroble({ isAnime: true, idMal: 789, episode: 4 }, false, false);
    assert.equal(f.seen.length, 4, 'ön bellek + doğrudan idMal Media sorgusunu tekrarlatmaz');
    assert.deepStrictEqual(giris(f, 3).govde.variables, { mediaId: 789, progress: 4, status: 'WATCHING' });
  } finally {
    fetchRestore();
    restore();
  }
});

/* 9 — mal_id ön bellek: anilistMedyaIdGetir ikinci çağrıda ağa gitmez */
test('onbellek: anilistMedyaIdGetir aynı idMal için tek istek atar', async () => {
  const restore = withMemoryStorage();
  tokenVer();
  let istek = 0;
  const f = fakeFetch([{
    match: (u) => u === 'https://graphql.anilist.co',
    respond: () => { istek += 1; return ok({ data: { Media: { id: 4242 } } }); },
  }]);
  const fetchRestore = withFakeFetch(f);
  try {
    assert.equal(await anilistMedyaIdGetir(31), 4242);
    assert.equal(await anilistMedyaIdGetir(31), 4242);
    assert.equal(istek, 1);
  } finally {
    fetchRestore();
    restore();
  }
});

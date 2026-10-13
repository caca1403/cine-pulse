import test from 'node:test';
import assert from 'node:assert/strict';
import { coz } from '../src/providers/orion.js';

// Kimlik kapısı: TMDB/IMDb verisi elimizdeyken provider sayfasının KENDİ
// tt kodu/yılı birebir eşleşmeden tek yayın bile listelenmemeli.
const SHOW = 'https://provider.example/dizi/kayip-izle-5/';
const EP = `${SHOW}sezon-1/bolum-1/`;
const FILM = 'https://provider.example/kayip-film-izle-3/';
const card = (url, title, year = '') => `<a href="${url}"><img alt="${title}"><span class="year">${year}</span><h4 class="title">${title}</h4></a>`;
const playerPage = (kimlik = '', year = '') => `${kimlik}<span class="year">${year}</span><iframe src="https://player.example/embed/test"></iframe>`;

async function run(args, { search = [], pages = {} } = {}) {
  const previous = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async (input) => {
    const url = String(input);
    requests.push(url);
    if (url.includes('siteurl.txt')) return new Response('hdfilmcehennemi:https://provider.example');
    if (url.includes('/search')) return new Response(JSON.stringify({ results: search }));
    if (url === 'https://player.example/embed/test') return new Response('<script>var stream="https://cdn.example/test-dual/master.m3u8";</script>');
    if (pages[url] !== undefined) return new Response(pages[url]);
    return new Response('not found', { status: 404 });
  };
  try {
    const r = await coz({ type: 'movie', signal: AbortSignal.timeout(4000), ...args });
    return { sources: r.sources.length, trace: r.trace, requests };
  } finally { globalThis.fetch = previous; }
}

test('film: same IMDb id as TMDB is played even when the site year differs', async () => {
  const r = await run({ title: 'Kayıp', imdbId: 'tt0816692', year: 1999 }, {
    search: [card('/kayip-film-izle-3/', 'Kayıp')],
    pages: { [FILM]: playerPage('<a href="https://www.imdb.com/title/tt0816692/">IMDb</a>', '2014') },
  });
  assert.equal(r.sources, 1, JSON.stringify(r.trace));
});

test('film: different IMDb id on the page blocks every source', async () => {
  const r = await run({ title: 'Kayıp', imdbId: 'tt0816692' }, {
    search: [card('/kayip-film-izle-3/', 'Kayıp')],
    pages: { [FILM]: playerPage('<a href="https://www.imdb.com/title/tt9999999/">IMDb</a>') },
  });
  assert.equal(r.sources, 0);
  assert.equal(r.trace.find((x) => x.ad === 'kimlik')?.uydu, false);
});

test('year-only target: page year must equal the TMDB year exactly', async () => {
  const ok = await run({ title: 'Kayıp', year: 2014 }, {
    search: [card('/kayip-film-izle-3/', 'Kayıp')],
    pages: { [FILM]: playerPage('', '2014') },
  });
  assert.equal(ok.sources, 1);
  const no = await run({ title: 'Kayıp', year: 1999 }, {
    search: [card('/kayip-film-izle-3/', 'Kayıp')],
    pages: { [FILM]: playerPage('', '2014') },
  });
  assert.equal(no.sources, 0);
});

test('dizi: episode page without identity inherits the show-page IMDb id (escaped JS form)', async () => {
  const r = await run({ type: 'tv', title: 'Kayıp', season: 1, episode: 1, imdbId: 'tt5979872' }, {
    search: [card('/dizi/kayip-izle-5/', 'Kayıp', '2016')],
    pages: { [EP]: playerPage(), [SHOW]: 'var share="imdb.com\\/title\\/tt5979872\\/";' },
  });
  assert.ok(r.requests.includes(SHOW), 'show page must be consulted for identity');
  assert.equal(r.sources, 1, JSON.stringify(r.trace));
});

test('dizi: show page carrying a different IMDb id blocks the episode', async () => {
  const r = await run({ type: 'tv', title: 'Kayıp', season: 1, episode: 1, imdbId: 'tt5979872' }, {
    search: [card('/dizi/kayip-izle-5/', 'Kayıp', '2016')],
    pages: { [EP]: playerPage(), [SHOW]: 'imdb.com/title/tt1111111/' },
  });
  assert.equal(r.sources, 0);
});

test('page without any identity info stays playable (no false rejection)', async () => {
  const r = await run({ title: 'Kayıp', imdbId: 'tt0816692', year: 2014 }, {
    search: [card('/kayip-film-izle-3/', 'Kayıp')],
    pages: { [FILM]: playerPage() },
  });
  assert.equal(r.sources, 1);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { coz } from '../src/providers/orion.js';

function card(url, title, year = '') {
  // Matches the real card shape: inline SVG makes h4 appear after byte 1000.
  return `<a href="${url}"><img alt="${title}"><div><svg><path d="${'M1 '.repeat(350)}"/></svg><span class="year">${year}</span><h4 class="title">${title}</h4></div></a>`;
}
async function resolve(args, results, { html = false } = {}) {
  const previous = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async input => {
    const url = String(input);
    requests.push(url);
    if (url.includes('siteurl.txt')) return new Response('hdfilmcehennemi:https://provider.example');
    if (url.includes('/search')) return new Response(html ? results.join('') : JSON.stringify({ results }));
    if (url === 'https://player.example/embed/test') return new Response('<script>var stream="https://cdn.example/test-dual/master.m3u8";</script>');
    if (url === args.expected) return new Response('<iframe src="https://player.example/embed/test"></iframe>');
    return new Response('not found', { status: 404 });
  };
  try {
    const result = await coz({ ...args, signal: AbortSignal.timeout(2000) });
    assert.equal(result.sources.length, 1, JSON.stringify(result.trace));
    assert.ok(requests.includes(args.expected));
    return requests;
  } finally { globalThis.fetch = previous; }
}

test('12 Monkeys resolves the translated numbered slug from a long search card', async () => {
  const requests = await resolve({ type: 'tv', title: '12 Maymunlar', originalTitle: '12 Monkeys', season: 1, episode: 1,
    expected: 'https://provider.example/dizi/12-maymun-izle-3/sezon-1/bolum-1/' }, [
    card('/12-maymun-hd-izle-hdf-4/', '12 Maymun - Twelve Monkeys'),
    card('/dizi/12-maymun-izle-3/', '12 Maymun - 12 Monkeys'),
  ]);
  assert.ok(requests.find(u => u.includes('/search')).endsWith('q=12%20Monkeys'), 'original title must be searched before speculative Turkish variants');
});

test('Riverdale keeps the discovered izle-9 suffix and requested episode', async () => {
  await resolve({ type: 'tv', title: 'Riverdale', season: 2, episode: 4,
    expected: 'https://provider.example/dizi/riverdale-izle-9/sezon-2/bolum-4/' }, [card('/dizi/riverdale-izle-9/', 'Riverdale')]);
});

test('film matching preserves titles from long cards with unrelated slugs', async () => {
  await resolve({ type: 'movie', title: 'Yıldızlararası', originalTitle: 'Interstellar',
    expected: 'https://provider.example/1-yildizlar-arasinda-film-izle-hdf-7/' }, [
    card('/1-yildizlar-arasinda-film-izle-hdf-7/', 'Yıldızlar Arasında - Interstellar'),
  ]);
});

test('exact translated title beats a sequel and a same-title series', async () => {
  await resolve({ type: 'movie', title: 'Kara Şövalye', originalTitle: 'The Dark Knight',
    expected: 'https://provider.example/batman-kara-sovalye-hd-film-izle-hdf-hdf-7/' }, [
    card('/batman-kara-sovalye-yukseliyor/', 'Batman Kara Ş&ouml;valye Y&uuml;kseliyor - The Dark Knight Rises'),
    card('/dizi/kara-sovalye/', 'Kara Şövalye - The Dark Knight'),
    card('/batman-kara-sovalye-hd-film-izle-hdf-hdf-7/', 'Batman Kara Ş&ouml;valye - The Dark Knight'),
  ]);
});

test('HTML search responses keep title text rather than href-only placeholders', async () => {
  await resolve({ type: 'movie', title: 'Yıldızlararası', originalTitle: 'Interstellar',
    expected: 'https://provider.example/unpredictable-film-slug/' }, [card('/unpredictable-film-slug/', 'Yıldızlar Arasında - Interstellar')], { html: true });
});

test('same-title live action does not replace an anime with a different release year', async () => {
  await resolve({ type: 'tv', title: 'Cowboy Bebop', year: 1998, season: 1, episode: 1,
    expected: 'https://provider.example/dizi/cowboy-bebop-anime/sezon-1/bolum-1/' }, [
    card('/dizi/cowboy-bebop-3/', 'Cowboy Bebop', 2021),
    card('/dizi/cowboy-bebop-anime/', 'Cowboy Bebop', 1998),
  ]);
});

test('a lone anime card listed under its season year is not dropped by the year tie-breaker', async () => {
  await resolve({ type: 'tv', title: 'Bleach', year: 2004, season: 1, episode: 1,
    expected: 'https://provider.example/dizi/bleach-izle-7/sezon-1/bolum-1/' }, [
    card('/dizi/bleach-izle-7/', 'Bleach', 2018),
  ]);
});

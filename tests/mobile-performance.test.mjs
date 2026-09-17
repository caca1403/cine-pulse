import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const { chromium, devices } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ ...devices['iPhone 13'], serviceWorkers: 'block' });
await page.addInitScript(() => localStorage.setItem('cinepulse_onboarding_completed', 'true'));
const errors = [];
const playerChunks = [];
page.on('pageerror', error => errors.push(error.message));
page.on('request', request => { if (request.url().includes('PlayerModal-')) playerChunks.push(request.url()); });
const items = Array.from({ length: 12 }, (_, index) => ({
  id: 1000 + index, title: `Example ${index}`, name: `Example ${index}`,
  media_type: index % 2 ? 'tv' : 'movie', popularity: 100 - index,
  backdrop_path: `/backdrop${index}.jpg`, poster_path: `/poster${index}.jpg`,
  vote_average: 8, vote_count: 1000, overview: 'A sample film with enough story text to display.',
  release_date: '2025-01-01', first_air_date: '2025-01-01', genre_ids: [18], original_language: 'en'
}));
await page.route('https://fonts.googleapis.com/**', route => route.abort());
await page.route('https://fonts.gstatic.com/**', route => route.abort());
await page.route('https://unpkg.com/lucide@0.344.0', async route => route.fulfill({ contentType: 'text/javascript', body: await readFile('node_modules/lucide/dist/umd/lucide.js') }));
await page.route('https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.min.js', route => route.fulfill({ contentType: 'text/javascript', body: 'window.Hls = {isSupported: () => false};' }));
await page.route('https://image.tmdb.org/**', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="300" height="450" fill="#384150"/></svg>' }));
await page.route('https://api.themoviedb.org/**', async route => {
  const url = new URL(route.request().url());
  const isPrimary = url.pathname.includes('/trending/all/') || (url.pathname.includes('/discover/') && url.searchParams.get('sort_by') === 'vote_count.desc' && !url.searchParams.has('with_genres') && !url.searchParams.has('vote_average.gte'));
  const slow = !isPrimary;
  await new Promise(resolve => setTimeout(resolve, slow ? 1500 : 80));
  await route.fulfill({ contentType: 'application/json', body: JSON.stringify({
    results: items, total_pages: 1, total_results: items.length, genres: [], episodes: [], seasons: [],
    id: 1000, title: 'Example 0', name: 'Example 0', backdrop_path: '/backdrop0.jpg', poster_path: '/poster0.jpg'
  }) });
});
try {
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' });
  await page.locator('.dock-item[href="#library"]').click({ timeout: 5000 });
  await page.waitForSelector('.library-view', { timeout: 5000 });
  await page.waitForTimeout(1700);
  assert.equal(await page.locator('.home-view').count(), 0, 'a late home request must not replace the chosen page');
  await page.locator('.dock-item[href="#home"]').click();
  await page.waitForSelector('.home-view .media-card', { timeout: 12000 });
  assert.equal(playerChunks.length, 0, 'initial view should not download player providers');
  assert.ok(await page.locator('.home-view .media-card').count() >= 12, 'primary rails should render');
  await page.waitForTimeout(1900);
  const secondaryCards = await page.locator('#rail-top-tv .media-card').count();
  assert.ok(secondaryCards > 0, `secondary rails should appear after first paint; ids=${await page.locator('.card-rail').evaluateAll(els => els.map(el => el.id).join(','))}`);
  await page.locator('#btn-mobile-search-toggle').click();
  assert.equal(await page.locator('#mobile-search-row').evaluate(el => el.classList.contains('hidden')), false, 'mobile search must respond');
  await page.locator('#btn-mobile-search-close').click();
  await page.locator('.card-layout-option[data-layout="landscape"]').click();
  assert.equal(await page.locator('html').evaluate(el => el.classList.contains('cards-landscape')), true, 'mobile layout tap commits without waiting for images');
  await page.locator('.dock-item[href="#library"]').click();
  await page.waitForSelector('.library-view', { timeout: 5000 });
  await page.locator('.dock-item[href="#home"]').click();
  await page.waitForSelector('.home-view .media-card', { timeout: 5000 });
  assert.equal(playerChunks.length, 0, 'navigation must not download the player');
  assert.ok(await page.locator('#rail-top-tv .media-card').count() > 0, 'secondary cache survives navigation');
  await page.evaluate(() => { window.location.hash = '#livetv'; });
  await page.waitForSelector('#livetv-root', { timeout: 5000 });
  assert.equal(await page.locator('#tv-video').count(), 1, 'live TV view mounts its player');
  await page.evaluate(() => { window.location.hash = '#discover'; });
  await page.waitForSelector('#discover-media-grid', { timeout: 7000 });
  await page.evaluate(() => { window.location.hash = '#detail?type=movie&id=1000'; });
  await page.waitForSelector('#btn-play-movie', { timeout: 7000 });
  await page.locator('#btn-play-movie').click();
  await page.waitForSelector('#player-modal:not(.hidden)', { timeout: 7000 });
  assert.equal(playerChunks.length, 1, 'player bundle downloads when playback is requested');
  assert.deepEqual(errors, []);
  console.log('PASS: mobile home, staged rails, search, library, live TV, discover, lazy player');
} finally {
  await browser.close();
}

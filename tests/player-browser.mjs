// Run with PLAYWRIGHT_MODULE pointing to an installed playwright/index.mjs.
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
try {
  await page.route('https://player.test/**', route => route.fulfill({ contentType: 'text/html', body: '<div id="player-modal" class="hidden"></div>' }));
  await page.goto('https://player.test/');
  await page.addStyleTag({ content: await readFile('src/styles/main.css', 'utf8') });
  await page.addScriptTag({ content: await readFile('node_modules/lucide/dist/umd/lucide.js', 'utf8') });
  await page.evaluate(() => {
    window.discovery = [];
    window.saved = [];
    window.fetch = async () => ({ ok: true, json: async () => ({ episodes: [], seasons: [] }) });
    const states = new WeakMap();
    const state = video => {
      if (!states.has(video)) states.set(video, { paused: true, currentTime: 0 });
      return states.get(video);
    };
    for (const prop of ['paused', 'currentTime']) Object.defineProperty(HTMLMediaElement.prototype, prop, {
      get() { return state(this)[prop]; }, set(value) { state(this)[prop] = value; }, configurable: true
    });
    Object.defineProperty(HTMLMediaElement.prototype, 'duration', { get() { return 600; }, configurable: true });
    Object.defineProperty(HTMLMediaElement.prototype, 'src', { get() { return ''; }, set() {}, configurable: true });
    HTMLMediaElement.prototype.play = function () { this.paused = false; this.dispatchEvent(new Event('play')); return Promise.resolve(); };
    HTMLMediaElement.prototype.pause = function () { this.paused = true; this.dispatchEvent(new Event('pause')); };
    HTMLMediaElement.prototype.load = function () {};
    const records = [];
    const add = EventTarget.prototype.addEventListener;
    const remove = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.addEventListener = function (type, fn, opts) {
      if (this === window || this === document) records.push({ target: this, type, fn });
      return add.call(this, type, fn, opts);
    };
    EventTarget.prototype.removeEventListener = function (type, fn, opts) {
      const i = records.findIndex(r => r.target === this && r.type === type && r.fn === fn);
      if (i >= 0) records.splice(i, 1);
      return remove.call(this, type, fn, opts);
    };
    window.globalListenerCount = () => records.length;
  });
  const helper = await readFile('src/components/playerLifecycle.js', 'utf8');
  let source = (await readFile('src/components/PlayerModal.js', 'utf8')).replace(/^import[\s\S]*?from\s+['"][^'"]+['"];\s*/gm, '');
  const stubs = `
    const getStreamingServersProgressive = opts => window.discovery.push(opts);
    const getMediaProgress = () => null;
    const isMediaWatched = () => false;
    const isRegisteredAnimeId = () => false;
    const isAnimeRecord = () => false;
    const registerAnimeId = () => {};
    const markEpisodeWatched = () => {};
    const markMediaWatched = () => {};
    const toggleEpisodeWatched = () => {};
    const saveWatchProgress = value => window.saved.push(value);
    const showToast = () => {};
    const translateToTurkish = async text => text;
    const formatSecondsToTime = seconds => String(Math.floor(seconds));
  `;
  await page.addScriptTag({ type: 'module', content: helper.replace(/export /g, '') + stubs + source.replace('export async function', 'async function') + '\nwindow.openTestPlayer = openPlayerModal;' });
  await page.waitForFunction(() => !!window.openTestPlayer);
  const open = () => page.evaluate(async () => {
    await window.openTestPlayer({ type: 'tv', tmdbId: 123, title: 'Regression', maxEpisodes: 3 });
    window.discovery.at(-1).onUpdate({ dubbed: [{ id: 'test', name: 'Test', url: 'https://player.test/video', isDirectVideo: true }] });
    await document.querySelector('video').play();
  });
  await open();
  const listenerCount = await page.evaluate(() => window.globalListenerCount());
  await page.waitForTimeout(3200);
  assert.equal(await page.locator('#direct-video-wrapper').evaluate(el => el.classList.contains('hide-controls')), true, 'autoplay hides controls without mouse movement');
  assert.equal(await page.locator('.player-cinema-bar').evaluate(el => getComputedStyle(el).opacity), '0', 'header hides too');
  assert.equal(await page.locator('#custom-btn-play svg').count(), 1, 'scoped icons render');
  await page.keyboard.press('Space');
  assert.equal(await page.locator('video').evaluate(el => el.paused), true, 'space toggles exactly once');
  await page.keyboard.press('Space');
  assert.equal(await page.locator('video').evaluate(el => el.paused), false);
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('video').evaluate(el => el.currentTime), 10, 'seek shortcut executes once');
  await page.evaluate(() => document.querySelector('#custom-btn-more').click());
  await page.waitForTimeout(6700);
  assert.equal(await page.locator('#direct-video-wrapper').evaluate(el => el.classList.contains('hide-controls')), true, 'popover expiry restarts autohide');
  // Repeated close/open cycles must not grow the global listener set.
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => document.querySelector('#player-close-btn').click());
    assert.equal(await page.evaluate(() => window.globalListenerCount()), 0, 'close releases all global listeners');
    await open();
    assert.equal(await page.evaluate(() => window.globalListenerCount()), listenerCount);
  }
  await page.evaluate(() => {
    const old = window.discovery.at(-1);
    document.querySelector('#btn-next-episode').click();
    old.onUpdate({ dubbed: [{ id: 'stale', url: 'old', isDirectVideo: true }] });
  });
  assert.equal(await page.locator('video').count(), 0, 'old episode discovery cannot start playback');
  await page.evaluate(() => document.querySelector('#player-close-btn').click());
  await page.evaluate(() => window.discovery.at(-1).onUpdate({ dubbed: [{ url: 'late', isDirectVideo: true }] }));
  assert.equal(await page.locator('#player-modal').innerHTML(), '', 'late discovery cannot revive a closed player');
  assert.equal(await page.evaluate(() => window.globalListenerCount()), 0);
  await page.evaluate(async () => {
    await window.openTestPlayer({ type: 'movie', tmdbId: 777, title: 'Fallback test' });
    window.discovery.at(-1).onUpdate({ subtitled: [{ id: 'sub-only', url: 'https://player.test/sub', isDirectVideo: true }] });
  });
  assert.equal(await page.locator('#hls-video-player').count(), 1, 'available alternate stream starts immediately');
  assert.equal(await page.locator('#tab-subtitled').evaluate(el => el.classList.contains('active')), true);
  await page.evaluate(() => document.querySelector('#player-close-btn').click());
  assert.deepEqual(errors, []);
  console.log('PASS: autoplay, header, icons, keyboard, popovers, 20 reopen cycles, episode and close race guards');
} finally {
  await browser.close();
}

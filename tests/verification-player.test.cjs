const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { registerVerificationPlayer, pixelPlayerUrl } = require('../electron/verificationPlayer.cjs');

function fixture() {
  const handlers = new Map();
  const children = new Set();
  const timers = new Map();
  const views = [];
  const sent = [];
  const window = {
    isDestroyed: () => false, getContentSize: () => [1200, 800],
    contentView: { addChildView: v => children.add(v), removeChildView: v => children.delete(v) },
    webContents: { getUserAgent: () => 'Chromium', send: (...args) => sent.push(args) }
  };
  class View {
    constructor(options) {
      this.options = options;
      this.webContents = Object.assign(new EventEmitter(), {
        setUserAgent() {}, setWindowOpenHandler: handler => { this.popupHandler = handler; }, loadURL: async url => { this.url = url; },
        isDestroyed: () => this.destroyed || false, close: () => { this.destroyed = true; },
        executeJavaScript: async script => { (this.scripts ||= []).push(script); return this.playerUrl || ''; }
      });
      views.push(this);
    }
    setBounds(bounds) { this.bounds = bounds; }
    setVisible(visible) { this.visible = visible; }
  }
  registerVerificationPlayer({
    ipcMain: { handle: (name, fn) => handlers.set(name, fn) }, WebContentsView: View,
    webFrameMain: { fromId: () => null }, getWindow: () => window,
    scheduler: { setInterval: fn => { const id = {}; timers.set(id, fn); return id; }, clearInterval: id => timers.delete(id) }
  });
  const call = (name, data, sender = window.webContents) => handlers.get(`cinepulse:verification-player-${name}`)({ sender }, data);
  const open = id => call('open', { requestId: id, url: 'https://sezonlukdizi.cc/test/1-sezon-1-bolum.html', bounds: { x: 50, y: 100, width: 1000, height: 500 } });
  return { call, open, views, timers, children, sent };
}

test('verification keeps the browser and source controls alive after a real player loads', async () => {
  const f = fixture(); f.open('one');
  const view = f.views[0];
  assert.equal(view.options.webPreferences.nodeIntegration, false);
  assert.equal(view.options.webPreferences.partition, 'persist:cinepulse-verification');
  assert.equal(view.visible, true);
  const check = [...f.timers.values()][0];
  view.playerUrl = 'https://sezonlukdizi.cc/ajax/reCAPTCHADATA.asp'; await check();
  assert.equal(f.children.size, 1); assert.equal(f.sent.length, 0);
  view.playerUrl = 'https://challenges.cloudflare.com/widget'; await check();
  assert.equal(f.sent.length, 0);
  view.playerUrl = 'https://vidmoly.net/embed-test.html'; await check();
  assert.deepEqual(f.sent, [['cinepulse:verification-player-resolved', { requestId: 'one', url: view.playerUrl }]]);
  assert.equal(f.children.size, 1); assert.equal(view.destroyed, undefined);
  await check(); assert.equal(f.sent.length, 1);
  f.call('close', 'one');
  assert.equal(f.children.size, 0); assert.equal(f.timers.size, 0); assert.equal(view.destroyed, true);
});

test('late cleanup from a previous source cannot close the new verification view', () => {
  const f = fixture(); f.open('old'); f.open('new'); f.call('close', 'old');
  assert.equal(f.children.size, 1); assert.equal(f.views[1].destroyed, undefined);
  f.call('close', 'new'); assert.equal(f.children.size, 0);
});

test('rejects other renderers, arbitrary pages, and invalid bounds', () => {
  const f = fixture();
  assert.throws(() => f.call('open', { url: 'https://example.com/' }), /Unsupported/);
  assert.throws(() => f.call('open', { url: 'https://sezonlukdizi.cc/test/1-sezon-1-bolum.html' }, {}), /Unsupported/);
  assert.throws(() => f.call('open', { url: 'https://sezonlukdizi.cc/test/1-sezon-1-bolum.html', bounds: { x: NaN } }), /Invalid/);
  assert.equal(f.children.size, 0);
});

test('Pixel player popups and top-level links stay embedded; unrelated links stay blocked', async () => {
  const f = fixture(); f.open('pixel'); const view = f.views[0];
  const destination = 'https://pixeldrain.com/u/zPwt9xke?embed&style=hacker';
  assert.deepEqual(view.popupHandler({url:destination}), {action:'deny'});
  assert.match(view.scripts[0], /embed.replaceChildren\(iframe\)/);
  assert.match(view.scripts[0], /pixeldrain.com\/u\/zPwt9xke/);
  let prevented = false;
  view.webContents.emit('will-navigate', {preventDefault:()=>{prevented=true}}, destination);
  assert.equal(prevented,true); assert.equal(view.scripts.length,2);
  view.popupHandler({url:'https://example.com/advert'});
  assert.equal(view.scripts.length,2); assert.equal(f.children.size,1);
});
test('Pixel route rejects spoofed domains, protocols and non-player paths', () => {
  for (const url of ['http://pixeldrain.com/u/zPwt9xke','https://pixeldrain.com.evil.test/u/zPwt9xke','https://pixeldrain.com/account','https://user:pass@pixeldrain.com/u/zPwt9xke']) assert.equal(pixelPlayerUrl(url),null);
  assert.match(pixelPlayerUrl('https://pixeldrain.com/u/zPwt9xke'), /embed=/);
});

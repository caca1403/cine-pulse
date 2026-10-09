const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { registerVerificationPlayer } = require('../electron/verificationPlayer.cjs');

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
        setUserAgent() {}, setWindowOpenHandler() {}, loadURL: async url => { this.url = url; },
        isDestroyed: () => this.destroyed || false, close: () => { this.destroyed = true; },
        executeJavaScript: async () => this.playerUrl || ''
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

test('verification stays open until a real player replaces the challenge, then closes', async () => {
  const f = fixture(); f.open('one');
  const view = f.views[0];
  assert.equal(view.options.webPreferences.nodeIntegration, false);
  assert.equal(view.options.webPreferences.partition, 'persist:cinepulse');
  const check = [...f.timers.values()][0];
  view.playerUrl = 'https://sezonlukdizi.cc/ajax/reCAPTCHADATA.asp'; await check();
  assert.equal(f.children.size, 1); assert.equal(f.sent.length, 0);
  view.playerUrl = 'https://challenges.cloudflare.com/widget'; await check();
  assert.equal(f.sent.length, 0);
  view.playerUrl = 'https://vidmoly.net/embed-test.html'; await check();
  assert.deepEqual(f.sent, [['cinepulse:verification-player-resolved', { requestId: 'one', url: view.playerUrl }]]);
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

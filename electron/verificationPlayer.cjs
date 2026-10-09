const { isEpisodeFrame, installPlayerFrameLayout } = require('./playerFrame.cjs');

function registerVerificationPlayer({ ipcMain, WebContentsView, webFrameMain, getWindow, scheduler = { setInterval, clearInterval } }) {
  let current = null;
  const close = () => {
    if (!current) return;
    const { window, view, timer } = current;
    current = null;
    scheduler.clearInterval(timer);
    try { window.contentView.removeChildView(view); } catch (_) {}
    try { view.webContents.close(); } catch (_) {}
  };
  const owner = event => {
    const window = getWindow();
    return window && !window.isDestroyed() && event.sender === window.webContents ? window : null;
  };
  const normalizeBounds = (window, bounds) => {
    const [width, height] = window.getContentSize();
    const numbers = ['x', 'y', 'width', 'height'].map(key => Number(bounds?.[key]));
    if (!numbers.every(Number.isFinite)) throw new Error('Invalid player bounds');
    const x = Math.max(0, Math.min(width, Math.round(numbers[0])));
    const y = Math.max(0, Math.min(height, Math.round(numbers[1])));
    return { x, y, width: Math.max(0, Math.min(width - x, Math.round(numbers[2]))), height: Math.max(0, Math.min(height - y, Math.round(numbers[3]))) };
  };
  ipcMain.handle('cinepulse:verification-player-open', (event, { url, bounds, requestId } = {}) => {
    const window = owner(event);
    if (!window || !isEpisodeFrame(url)) throw new Error('Unsupported verification page');
    const initialBounds = normalizeBounds(window, bounds);
    close();
    const view = new WebContentsView({ webPreferences: {
      partition: 'persist:cinepulse', contextIsolation: true, sandbox: true, nodeIntegration: false
    } });
    const contents = view.webContents;
    view.setVisible(false);
    contents.setUserAgent(window.webContents.getUserAgent());
    contents.setWindowOpenHandler(() => ({ action: 'deny' }));
    contents.on('will-navigate', (event, destination) => {
      if (!isEpisodeFrame(destination)) event.preventDefault();
    });
    installPlayerFrameLayout(contents, webFrameMain, { includeMainFrame: true, onLayout: () => {
      if (!contents.isDestroyed()) view.setVisible(true);
    } });
    contents.on('console-message', (_event, _level, message) => {
      if (/turnstile|challenge.*error|error.*challenge/i.test(message)) console.warn('[Luna verification]', message.slice(0, 500));
    });
    view.setBounds(initialBounds);
    window.contentView.addChildView(view);
    const state = { window, view, requestId, checking: false, timer: null };
    current = state;
    state.timer = scheduler.setInterval(async () => {
      if (current !== state || state.checking || contents.isDestroyed()) return;
      state.checking = true;
      try {
        const url = await contents.executeJavaScript(`document.querySelector('#embed iframe')?.src || ''`);
        if (current !== state || !url) return;
        const parsed = new URL(url);
        if (parsed.protocol !== 'https:' || parsed.hostname === 'sezonlukdizi.cc' || parsed.hostname.endsWith('.cloudflare.com')) return;
        if (/filemoon|bysejikuar|bysezoxexe/i.test(parsed.hostname)) return;
        // The site's successful verification callback replaces its challenge
        // iframe with this player. No challenge token is read or fabricated.
        window.webContents.send('cinepulse:verification-player-resolved', { requestId, url: parsed.href });
        close();
      } catch (_) {
        // Page/frame may be navigating; observe again after it finishes.
      } finally { state.checking = false; }
    }, 750);
    contents.loadURL(url).catch(error => console.warn('[Luna verification] Page load:', error.message));
    return { ok: true };
  });
  ipcMain.handle('cinepulse:verification-player-bounds', (event, { bounds, requestId } = {}) => {
    if (owner(event) && current?.requestId === requestId) current.view.setBounds(normalizeBounds(current.window, bounds));
  });
  ipcMain.handle('cinepulse:verification-player-close', (event, requestId) => {
    if (owner(event) && current?.requestId === requestId) close();
  });
  return { close };
}

module.exports = { registerVerificationPlayer };

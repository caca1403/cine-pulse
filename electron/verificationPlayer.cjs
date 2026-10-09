const path = require('node:path');
const { isEpisodeFrame, installPlayerFrameLayout, PLAYER_ONLY_CSS } = require('./playerFrame.cjs');

function pixelPlayerUrl(value) {
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'pixeldrain.com' || parsed.port || parsed.username || parsed.password || !/^\/u\/[A-Za-z0-9]{8}$/.test(parsed.pathname)) return null;
    parsed.searchParams.set('embed', '');
    return parsed.href;
  } catch (_) { return null; }
}

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
      partition: 'persist:cinepulse-verification', contextIsolation: true, sandbox: true, nodeIntegration: false,
      preload: path.join(__dirname, 'verificationPreload.cjs'),
      additionalArguments: [`--cinepulse-player-css=${Buffer.from(PLAYER_ONLY_CSS).toString('base64')}`]
    } });
    const contents = view.webContents;
    // Load the HTTPS page visibly using this Chromium view's default identity.
    // Keep its session separate from background resolver request overrides.
    view.setVisible(true);
    const logBlockedDestination = (kind, destination) => {
      try {
        const parsed = new URL(destination);
        // Avoid logging query strings that may contain session credentials.
        console.info('[Luna navigation]', kind, parsed.origin + parsed.pathname);
      } catch (_) { console.info('[Luna navigation]', kind, 'invalid URL'); }
    };
    const routePixelPlayer = destination => {
      const playerUrl = pixelPlayerUrl(destination);
      if (!playerUrl) return false;
      // User-triggered player navigation stays in the existing browser session.
      // Replace only the player's content; retain the provider's source toolbar.
      contents.executeJavaScript(`(() => {
        const embed = document.querySelector('#embed');
        if (!embed) return false;
        const iframe = document.createElement('iframe');
        iframe.src = ${JSON.stringify(playerUrl)};
        iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
        iframe.allowFullscreen = true;
        iframe.style.cssText = 'width:100%;height:100%;border:0';
        const gate = embed.previousElementSibling;
        if (gate?.matches('div[style*="position: absolute"]')) gate.remove();
        embed.replaceChildren(iframe);
        embed.style.setProperty('display', 'block', 'important');
        return true;
      })()`).catch(error => console.warn('[Luna player] Navigation:', error.message));
      return true;
    };
    contents.setWindowOpenHandler(({ url }) => {
      if (!routePixelPlayer(url)) logBlockedDestination('popup blocked', url);
      return { action: 'deny' };
    });
    contents.on('will-navigate', (event, destination) => {
      if (!isEpisodeFrame(destination)) {
        event.preventDefault();
        if (!routePixelPlayer(destination)) logBlockedDestination('top-level navigation blocked', destination);
      }
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
        if (state.resolvedUrl === parsed.href) return;
        state.resolvedUrl = parsed.href;
        window.webContents.send('cinepulse:verification-player-resolved', { requestId, url: parsed.href });
        // Keep the real browser session and the site's language/source menu
        // mounted while playback continues. Close only on source/modal exit.
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

module.exports = { registerVerificationPlayer, pixelPlayerUrl };

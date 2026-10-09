// Show the provider's player and language/source controls, preserving its scripts.
// This does not interact with or bypass the provider's verification challenge.
const PLAYER_ONLY_CSS = `
html, body { margin:0!important; padding:0!important; overflow:hidden!important; background:#101318!important; }
body * { visibility:hidden!important; }
#embed, #embed *, #playerMenu, #playerMenu * { visibility:visible!important; }
body #playerMenu { position:fixed!important; top:0!important; left:0!important; width:100vw!important; height:40px!important; margin:0!important; z-index:2147483646!important; }
body #embed:not(#embed #embed) { position:fixed!important; top:40px!important; left:0!important; width:100vw!important; height:calc(100vh - 40px)!important; margin:0!important; padding:0!important; border:0!important; z-index:2147483645!important; }
#embed iframe { width:100%!important; height:100%!important; border:0!important; }
`;

function isEpisodeFrame(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname === 'sezonlukdizi.cc' && /\/\d+-sezon-\d+-bolum\.html$/.test(parsed.pathname);
  } catch (_) { return false; }
}

function installPlayerFrameLayout(contents, webFrameMain, { includeMainFrame = false, onLayout = () => {} } = {}) {
  contents.on('did-frame-finish-load', (_event, isMainFrame, processId, routingId) => {
    if (isMainFrame && !includeMainFrame) return;
    const frame = webFrameMain.fromId(processId, routingId);
    if (!frame || !isEpisodeFrame(frame.url)) return;
    frame.executeJavaScript(`(() => {
      if (!document.querySelector('#embed')) return false;
      let style = document.getElementById('cinepulse-player-only');
      if (!style) { style = document.createElement('style'); style.id = 'cinepulse-player-only'; document.head.appendChild(style); }
      style.textContent = ${JSON.stringify(PLAYER_ONLY_CSS)};
      const hideDisabled = () => {
        for (const item of document.querySelectorAll('#alternatif .menu [data-id]')) {
          if (/filemoon/i.test(item.textContent)) item.style.setProperty('display', 'none', 'important');
        }
      };
      hideDisabled();
      const filterObserver = new MutationObserver(hideDisabled);
      filterObserver.observe(document.body, { childList:true, subtree:true });
      const alternative = new URL(location.href).searchParams.get('cpAlternative');
      if (!/^\\d+$/.test(alternative || '')) return;
      // Select the source the user chose in CinePulse through the site's own menu.
      // Challenge widgets remain untouched and require the user's interaction.
      const select = () => {
        const item = [...document.querySelectorAll('#alternatif .menu [data-id]')].find(node => node.dataset.id === alternative);
        if (!item) return false;
        if (!item.classList.contains('selected')) item.click();
        return true;
      };
      if (!select()) {
        const observer = new MutationObserver(() => { if (select()) observer.disconnect(); });
        observer.observe(document.body, { childList:true, subtree:true });
        setTimeout(() => observer.disconnect(), 20000);
      }
    })()`).then(applied => { if (applied !== false) onLayout(); }).catch(error => console.warn('[Player frame] Layout unavailable:', error.message));
  });
}

module.exports = { installPlayerFrameLayout, isEpisodeFrame, PLAYER_ONLY_CSS };

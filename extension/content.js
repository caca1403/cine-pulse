// CinePulse Web Bridge - Content Script
(function() {
  function notifyBridgeReady() {
    window.dispatchEvent(new CustomEvent('CinePulseBridgeReady', {
      detail: { version: '1.0.0', bridge: 'cinepulse-web-bridge' }
    }));
  }

  // Sayfaya global tanım ve köprü fonksiyonlarını enjekte et
  const script = document.createElement('script');
  script.textContent = `
    window.__CINEPULSE_BRIDGE__ = {
      version: '1.0.0',
      active: true,
      setStreamHeaders: function(opts) {
        window.postMessage({ type: 'CINEPULSE_SET_STREAM_HEADERS', ...opts }, '*');
      },
      clearStreamHeaders: function() {
        window.postMessage({ type: 'CINEPULSE_CLEAR_STREAM_HEADERS' }, '*');
      }
    };
    window.dispatchEvent(new CustomEvent('CinePulseBridgeReady', { detail: { version: '1.0.0' } }));
  `;
  (document.head || document.documentElement).appendChild(script);
  script.remove();

  notifyBridgeReady();

  // Web sitesinden gelen mesajları arka plan servisine yönlendir
  window.addEventListener('message', (event) => {
    if (event.source !== window || !event.data) return;
    if (event.data.type === 'CINEPULSE_SET_STREAM_HEADERS' || event.data.type === 'CINEPULSE_CLEAR_STREAM_HEADERS') {
      try {
        chrome.runtime.sendMessage(event.data);
      } catch (err) {
        // Extension context invalidation safe
      }
    }
  });
})();

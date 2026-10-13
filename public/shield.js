/* CinePulse Anti-Redirect & Anti-Ad Shield — eskiden index.html içi inline idi;
   Vercel CSP (script-src self) inline engellediği için web derlemesinde HİÇ çalışmıyordu.
   Aynı-origin harici dosya CSP uyumludur; APK/yerel derlemede de aynı şekilde yüklenir. */
    (function() {
      const BLOCKED_DOMAINS = [
        'moolightlabel.org',
        'moonlightlabel.org',
        'moolightlabel',
        'moonlightlabel',
        'cricketpivot.com',
        'cricketpivot',
        'mo.bohemo',
        'bohemo',
        'newsboydurance.cfd',
        'newsboydurance',
        'vidsrc.in',
        'adsterra',
        'popads',
        'propellerads',
        'clickadu',
        'syndication'
      ];

      function isBlocked(url) {
        if (!url || typeof url !== 'string') return false;
        const lower = url.toLowerCase();
        return BLOCKED_DOMAINS.some(function(d) { return lower.indexOf(d) !== -1; });
      }

      // 1. Permanently override window.open
      const originalOpen = window.open;
      window.open = function(url, target, features) {
        if (isBlocked(url)) {
          console.warn('[CinePulse Shield] Blocked window.open to:', url);
          return null;
        }
        if (!url || typeof url !== 'string' || url === 'about:blank' || url === '') {
          // Prevent blank popups used by ad networks for delayed redirect
          console.warn('[CinePulse Shield] Blocked blank popup hijack');
          return {
            closed: true,
            focus: function() {},
            blur: function() {},
            close: function() {},
            location: { href: '', replace: function() {}, assign: function() {} }
          };
        }
        return originalOpen.apply(this, arguments);
      };

      // 2. Intercept link clicks in capturing phase
      window.addEventListener('click', function(e) {
        try {
          const path = e.composedPath ? e.composedPath() : [];
          for (let i = 0; i < path.length; i++) {
            const el = path[i];
            if (el && el.tagName === 'A') {
              const href = el.getAttribute('href') || el.href || '';
              if (isBlocked(href)) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                console.warn('[CinePulse Shield] Blocked click navigation to:', href);
                return false;
              }
            }
          }
        } catch (_) {}
      }, true);

      // 3. Intercept Modern Navigation API (Prevents window.location redirect to blocked domains)
      if (window.navigation && typeof window.navigation.addEventListener === 'function') {
        window.navigation.addEventListener('navigate', function(e) {
          try {
            const destUrl = e.destination ? e.destination.url : '';
            if (isBlocked(destUrl)) {
              e.preventDefault();
              console.warn('[CinePulse Shield] Prevented page redirect to:', destUrl);
            }
          } catch (_) {}
        });
      }

      // 4. Intercept fetch & XHR to blocked domains
      if (window.fetch) {
        const origFetch = window.fetch;
        window.fetch = function(input, init) {
          const u = typeof input === 'string' ? input : (input && input.url ? input.url : '');
          if (isBlocked(u)) {
            console.warn('[CinePulse Shield] Blocked fetch to:', u);
            return Promise.reject(new Error('Blocked by CinePulse Shield'));
          }
          return origFetch.apply(this, arguments);
        };
      }

      // 5. Intercept malicious postMessage redirects
      window.addEventListener('message', function(e) {
        if (e && e.data && typeof e.data === 'string' && isBlocked(e.data)) {
          e.stopImmediatePropagation();
        }
      }, true);
    })();

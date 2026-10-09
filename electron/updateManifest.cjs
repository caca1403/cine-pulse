const https = require('https');

function fetchUpdateManifest(url, { timeout = 12000, transport = https } = {}) {
  return new Promise((resolve) => {
    let activeRequest;
    let finished = false;
    const finish = (value) => {
      if (finished) return;
      finished = true;
      clearTimeout(deadline);
      activeRequest?.destroy();
      resolve(value);
    };
    const deadline = setTimeout(() => finish(null), timeout);
    const visit = (address, redirects = 0) => {
      try {
        if (new URL(address).protocol !== 'https:') return finish(null);
        activeRequest = transport.get(address, { headers: { 'User-Agent': 'CinePulse-Updater' } }, (res) => {
          if (finished) return res.destroy();
          if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
            res.resume();
            if (!res.headers.location || redirects >= 5) return finish(null);
            return visit(new URL(res.headers.location, address).href, redirects + 1);
          }
          if (res.statusCode !== 200) {
            res.resume();
            return finish(null);
          }
          let body = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => {
            body += chunk;
            if (body.length > 200000) finish(null);
          });
          res.on('error', () => finish(null));
          res.on('aborted', () => finish(null));
          res.on('end', () => {
            try {
              const manifest = JSON.parse(body);
              finish(manifest && !Array.isArray(manifest) && typeof manifest === 'object' ? manifest : null);
            } catch (_) { finish(null); }
          });
        });
        activeRequest.on('error', () => finish(null));
      } catch (_) { finish(null); }
    };
    visit(url);
  });
}

module.exports = { fetchUpdateManifest };

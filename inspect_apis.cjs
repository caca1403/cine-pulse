const https = require('https');

function fetchUrl(url, options = {}) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = https.request({
        hostname: u.hostname,
        port: 443,
        path: u.pathname + u.search,
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
          'Referer': options.referer || `${u.protocol}//${u.hostname}/`,
          ...(options.headers || {})
        },
        timeout: 10000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
      });
      req.on('error', (e) => resolve({ error: e.message }));
      req.on('timeout', () => { req.destroy(); resolve({ error: 'Timeout' }); });
      if (options.body) req.write(options.body);
      req.end();
    } catch(err) {
      resolve({ error: err.message });
    }
  });
}

async function run() {
  console.log('=== 1. HDFILMIZLE.VIP /v/503515/ ===');
  const v1 = await fetchUrl('https://www.hdfilmizle.vip/v/503515/');
  console.log('/v/503515/ status:', v1.status, 'len:', v1.data ? v1.data.length : 0);
  if (v1.data) {
    const iframes = v1.data.match(/<iframe[^>]+src=["']([^"']+)["']/gi) || [];
    console.log('iframes:', iframes);
    const scripts = v1.data.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    scripts.filter(s => s.includes('vpx') || s.includes('player') || s.includes('video') || s.includes('stream')).forEach(s => {
      console.log('vpx script snippet:', s.substring(0, 300));
    });
  }

  console.log('\n=== 2. HDFILMCEHENNEMI.NOW API / SEARCH ===');
  // Check hdfilmcehennemi API or search
  const cehSearch = await fetchUrl('https://www.hdfilmcehennemi.now/?s=avatar');
  console.log('Cehennemi search status:', cehSearch.status);
  const cehTitles = (cehSearch.data || '').match(/<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi) || [];
  console.log('Cehennemi search result links:', cehTitles.slice(0, 10));

  // Check hdfilmcehennemi wp-json
  const cehJson = await fetchUrl('https://www.hdfilmcehennemi.now/wp-json/wp/v2/posts?search=avatar');
  console.log('Cehennemi wp-json status:', cehJson.status, 'len:', cehJson.data ? cehJson.data.length : 0);
  if (cehJson.data && cehJson.data.startsWith('[')) {
    try {
      const posts = JSON.parse(cehJson.data);
      console.log('Cehennemi wp-json posts:', posts.map(p => ({ title: p.title.rendered, link: p.link })));
      if (posts.length > 0) {
        const pPage = await fetchUrl(posts[0].link);
        console.log('Post page status:', pPage.status);
        const iframes = (pPage.data || '').match(/<iframe[^>]+src=["']([^"']+)["']/gi) || [];
        console.log('Post iframes:', iframes);
        const embeds = (pPage.data || '').match(/(https?:\/\/(?:closeload|rapidname|vidmoly|fembed|streamtape|snwix|snwcdn|snw|play|embed|video|storage|rapid|player|vpx|drive)[^"'<>\s]+)/gi) || [];
        console.log('Post embeds:', embeds);
      }
    } catch(e) {
      console.log('Cehennemi parse error:', e.message);
    }
  }
}

run();

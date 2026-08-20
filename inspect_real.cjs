const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        timeout: 10000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });
      req.on('error', (e) => resolve(''));
      req.on('timeout', () => { req.destroy(); resolve(''); });
    } catch(err) {
      resolve('');
    }
  });
}

async function run() {
  console.log('=== HDFILMIZLE.VIP /en-cok-izlenen-filmler-hd-2/ ===');
  const hd = await fetchUrl('https://www.hdfilmizle.vip/en-cok-izlenen-filmler-hd-2/');
  const hdCards = hd.match(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi) || [];
  const hdMovies = [...new Set(hdCards.map(l => (l.match(/href="([^"]+)"/) || [])[1]))].filter(l => l && !l.includes('/yil/') && !l.includes('/kategori/') && !l.includes('/page/') && l !== '/' && !l.includes('robotu'));
  console.log('HDFilmizle actual movies:', hdMovies.slice(0, 10));

  if (hdMovies.length > 0) {
    const mUrl = hdMovies[0].startsWith('http') ? hdMovies[0] : `https://www.hdfilmizle.vip${hdMovies[0]}`;
    const mPage = await fetchUrl(mUrl);
    console.log('HDFilmizle sample movie:', mUrl, 'len:', mPage.length);
    const iframes = mPage.match(/<iframe[^>]+src=["']([^"']+)["']/gi) || [];
    console.log('HDFilmizle movie iframes:', iframes);
    const dataSrc = mPage.match(/data-src=["']([^"']+)["']/gi) || [];
    console.log('HDFilmizle movie data-src:', dataSrc.slice(0, 5));
    const embeds = mPage.match(/(https?:\/\/(?:closeload|rapidname|vidmoly|fembed|streamtape|snwix|snwcdn|snw|play|embed|video|storage|rapid|player|vpx|drive)[^"'<>\s]+)/gi) || [];
    console.log('HDFilmizle movie embeds:', embeds.slice(0, 5));
  }

  console.log('\n=== HDFILMCEHENNEMI.NOW /film-izle-1/ ===');
  const ceh = await fetchUrl('https://www.hdfilmcehennemi.now/film-izle-1/');
  const cehCards = ceh.match(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi) || [];
  const cehMovies = [...new Set(cehCards.map(l => (l.match(/href="([^"]+)"/) || [])[1]))].filter(l => l && !l.includes('/turkce-') && !l.includes('/kategori/') && !l.includes('/page/') && l !== '/' && !l.includes('/film/'));
  console.log('Cehennemi actual movies:', cehMovies.slice(0, 10));

  if (cehMovies.length > 0) {
    const cUrl = cehMovies[0].startsWith('http') ? cehMovies[0] : `https://www.hdfilmcehennemi.now${cehMovies[0]}`;
    const cPage = await fetchUrl(cUrl);
    console.log('Cehennemi sample movie:', cUrl, 'len:', cPage.length);
    const iframes = cPage.match(/<iframe[^>]+src=["']([^"']+)["']/gi) || [];
    console.log('Cehennemi movie iframes:', iframes);
    const dataSrc = cPage.match(/data-src=["']([^"']+)["']/gi) || [];
    console.log('Cehennemi movie data-src:', dataSrc.slice(0, 5));
    const embeds = cPage.match(/(https?:\/\/(?:closeload|rapidname|vidmoly|fembed|streamtape|snwix|snwcdn|snw|play|embed|video|storage|rapid|player|vpx|drive)[^"'<>\s]+)/gi) || [];
    console.log('Cehennemi movie embeds:', embeds.slice(0, 5));
  }
}

run();

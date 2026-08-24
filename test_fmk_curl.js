async function testFmkCurlPages() {
  const { execSync } = await import('child_process');
  
  const pages = [
    'https://filmmakinesi.to/dizi/breaking-bad/sezon-5/bolum-15/',
    'https://filmmakinesi.to/dizi/squid-game/sezon-1/bolum-1/',
    'https://filmmakinesi.to/dizi/lanterns-2026/sezon-1/bolum-1/',
    'https://filmmakinesi.to/film/deadpool-wolverine-turkce-dublaj/'
  ];

  for (const p of pages) {
    console.log('Testing page:', p);
    try {
      const cmd = `curl.exe -s -L --max-time 8 -H "Referer: https://filmmakinesi.to/" -H "Origin: https://filmmakinesi.to" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" -H "Accept-Language: tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7" "${p}"`;
      const html = execSync(cmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
      
      const rapidMatch = html.match(/(?:src|data-src)=["'](https:\/\/(?:rapid\.filmmakinesi\.to|rapidrame\.com)\/embed[^"']*)["']/i);
      const closeloadMatch = html.match(/(?:src|data-src)=["'](https:\/\/(?:closeload|rapidrame)[^"']*embed[^"']*)["']/i);
      const allIframes = html.match(/<iframe[^>]+>/gi) || [];

      console.log('Rapid match:', rapidMatch ? rapidMatch[1] : 'null');
      console.log('Closeload match:', closeloadMatch ? closeloadMatch[1] : 'null');
      console.log('All iframes:', allIframes);
    } catch (err) {
      console.log('Error:', err.message);
    }
  }
}

testFmkCurlPages();

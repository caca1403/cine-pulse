async function testFMKDirect() {
  const urls = [
    'https://filmmakinesi.to',
    'https://filmmakinesi.to/film/baslangic-izle-fm1/',
    'https://filmmakinesi.to/film/inception-izle-fm1/',
    'https://filmmakinesi.film',
    'https://filmmakinesi.org'
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
        },
        signal: AbortSignal.timeout(5000)
      });
      console.log(`Direct: ${u} -> Status: ${res.status}`);
      const text = await res.text();
      console.log('Title:', text.match(/<title>([^<]+)<\/title>/i)?.[1]);
      console.log('HTML Length:', text.length);
      
      // Check for video player iframes, script tokens, and data-video_url
      const iframes = [...text.matchAll(/<iframe[^>]+(?:src|data-src)="([^"]+)"/gi)].map(m => m[1]);
      console.log('Iframes:', iframes);
      const videoUrls = [...text.matchAll(/data-video_url="([^"]+)"/gi)].map(m => m[1]);
      console.log('Video URLs:', videoUrls);
      const scripts = [...text.matchAll(/(https?:\/\/[^"'\s\\]+?(?:closeload|rapidrame|rapidvid|vidmoly)[^"'\s\\]+)/gi)].map(m => m[1]);
      console.log('Player Embeds in scripts:', scripts);
    } catch (e) {
      console.log(`Direct: ${u} -> Error: ${e.message}`);
    }
  }
}

testFMKDirect();

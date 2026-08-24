async function inspectDiziFilmIzle() {
  const res = await fetch('https://dizifilmizle.to/dizi/breaking-bad/sezon-5/bolum-15/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  console.log('HTML length:', html.length);
  // Match all iframes and video player elements
  const iframes = html.match(/<iframe[^>]+>/gi) || [];
  console.log('Iframes:', iframes);
  const dataSources = html.match(/data-(?:src|url|id|frame|video)=["']([^"']+)["']/gi) || [];
  console.log('Data sources:', dataSources);
  const scripts = html.match(/var\s+sources\s*=\s*\[[\s\S]*?\];/gi) || [];
  console.log('Script sources:', scripts);
}

inspectDiziFilmIzle();

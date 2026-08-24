async function testDiziyoEpisode() {
  const url = 'https://www.diziyo.so/dizi/reacher/sezon-1/bolum-1/';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  console.log('Diziyo episode status:', res.status);
  const html = await res.text();
  console.log('Length:', html.length);
  const iframes = html.match(/<iframe[^>]+>/gi) || [];
  console.log('Iframes:', iframes);
  const dataIframes = html.match(/(?:src|data-src|data-frame|data-player)=["']([^"']+)["']/gi) || [];
  console.log('Data iframe sources:', dataIframes);
}

testDiziyoEpisode();

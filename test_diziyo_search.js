async function testDiziyoSearch() {
  const res = await fetch('https://www.diziyo.so/?s=reacher', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  console.log('Diziyo HTML length:', html.length);
  // Match content links in main search container
  const items = html.match(/<a\s+class="[^"]*poster[^"]*"\s+href="([^"]+)"/gi) || [];
  console.log('Poster links:', items);
  const allCards = html.match(/<a\s+[^>]*href=["'](https:\/\/www\.diziyo\.so\/(?:dizi|film)\/[^"']+)["']/gi) || [];
  console.log('Dizi/Film cards:', allCards);
  const hrefs = html.match(/href=["'](https:\/\/www\.diziyo\.so\/[^"']+)["']/gi) || [];
  console.log('All hrefs with reacher:', hrefs.filter(h => h.includes('reacher')));
}

testDiziyoSearch();

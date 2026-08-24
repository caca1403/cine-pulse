async function testAllThree() {
  console.log('--- TESTING DIZIYO, WFILMIZLE & DIZIFILMIZLE ---');

  // 1. Diziyo.so search for Reacher & Breaking Bad
  const dzyRes = await fetch('https://www.diziyo.so/?s=reacher', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  console.log('Diziyo search status:', dzyRes.status);
  const dzyHtml = await dzyRes.text();
  const dzyLinks = dzyHtml.match(/<a[^>]+href=["'](https:\/\/www\.diziyo\.so\/[^"']+)["'][^>]*>(.*?)<\/a>/gi) || [];
  console.log('Diziyo found links:', dzyLinks.slice(0, 5));

  // 2. Wfilmizle search for Inception / Deadpool
  const wfmRes = await fetch('https://www.wfilmizle.pw/?s=deadpool', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  console.log('Wfilmizle search status:', wfmRes.status);
  const wfmHtml = await wfmRes.text();
  const wfmLinks = wfmHtml.match(/<a[^>]+href=["'](https:\/\/www\.wfilmizle\.pw\/[^"']+)["'][^>]*>/gi) || [];
  console.log('Wfilmizle found links:', wfmLinks.slice(0, 5));

  // 3. DiziFilmizle search for Reacher
  const dfiRes = await fetch('https://dizifilmizle.to/?s=reacher', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  console.log('Dizifilmizle search status:', dfiRes.status);
  const dfiHtml = await dfiRes.text();
  const dfiLinks = dfiHtml.match(/<a[^>]+href=["'](https:\/\/dizifilmizle\.to\/(?:dizi|film)\/[^"']+)["'][^>]*>(.*?)<\/a>/gi) || [];
  console.log('Dizifilmizle found links:', dfiLinks.slice(0, 5));
}

testAllThree();

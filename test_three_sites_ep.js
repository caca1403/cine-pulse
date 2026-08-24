async function inspectThreeSites() {
  console.log('--- INSPECTING 3 SITES FOR BREAKING BAD S5 E15 ---');

  // 1. Diziyo.so
  try {
    const res = await fetch('https://www.diziyo.so/breaking-bad-5-sezon-15-bolum-izle-dzy1/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    console.log('Diziyo BB status:', res.status);
    if (res.ok) {
      const text = await res.text();
      const iframes = text.match(/(?:src|data-src|data-frame)=["'](https?:\/\/[^"']*(?:embed|player|video|closeload|rapidrame|playmix|vidmoly|fastplay)[^"']*)["']/gi) || [];
      console.log('Diziyo iframes/sources:', iframes);
    }
  } catch (e) {
    console.log('Diziyo err:', e.message);
  }

  // 2. Wfilmizle.pw (Movie example: Deadpool)
  try {
    const res = await fetch('https://www.wfilmizle.pw/film-ara?q=deadpool', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    console.log('Wfilmizle search status:', res.status);
    if (res.ok) {
      const text = await res.text();
      const links = text.match(/<a[^>]+href=["'](https:\/\/www\.wfilmizle\.pw\/[^"']+)["'][^>]*>/gi) || [];
      console.log('Wfilmizle links:', links.slice(0, 5));
    }
  } catch (e) {
    console.log('Wfilmizle err:', e.message);
  }

  // 3. Dizifilmizle.to
  try {
    const res = await fetch('https://dizifilmizle.to/dizi/breaking-bad/sezon-5/bolum-15/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    console.log('Dizifilmizle BB status:', res.status);
    if (res.ok) {
      const text = await res.text();
      const iframes = text.match(/(?:src|data-src|data-frame)=["'](https?:\/\/[^"']*(?:embed|player|video|closeload|rapidrame|playmix|vidmoly|fastplay)[^"']*)["']/gi) || [];
      console.log('Dizifilmizle iframes/sources:', iframes);
    }
  } catch (e) {
    console.log('Dizifilmizle err:', e.message);
  }
}

inspectThreeSites();

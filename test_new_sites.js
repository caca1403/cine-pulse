async function testNewProviders() {
  console.log('--- TESTING NEW PROVIDERS ---');

  // 1. Diziyo.so
  try {
    const res = await fetch('https://www.diziyo.so/?s=breaking+bad', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log('Diziyo.so status:', res.status);
    const text = await res.text();
    console.log('Diziyo.so length:', text.length);
  } catch (e) {
    console.error('Diziyo.so error:', e.message);
  }

  // 2. Wfilmizle.pw
  try {
    const res = await fetch('https://www.wfilmizle.pw/?s=breaking+bad', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log('Wfilmizle.pw status:', res.status);
    const text = await res.text();
    console.log('Wfilmizle.pw length:', text.length);
  } catch (e) {
    console.error('Wfilmizle.pw error:', e.message);
  }

  // 3. Dizifilmizle.to
  try {
    const res = await fetch('https://dizifilmizle.to/?s=breaking+bad', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log('Dizifilmizle.to status:', res.status);
    const text = await res.text();
    console.log('Dizifilmizle.to length:', text.length);
  } catch (e) {
    console.error('Dizifilmizle.to error:', e.message);
  }
}

testNewProviders();

const CF = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

async function testFMKMirrors() {
  const mirrors = [
    'https://filmmakinesi.to',
    'https://filmmakinesi.sh',
    'https://filmmakinesi.pw',
    'https://filmmakinesi.de',
    'https://filmmakinesi.pro',
    'https://filmmakinesi.net',
    'https://filmmakinesi.co'
  ];

  for (const m of mirrors) {
    try {
      const res = await fetch(`${CF}?url=${encodeURIComponent(m)}`, { signal: AbortSignal.timeout(3000) });
      console.log(`FMK Mirror: ${m} -> Status: ${res.status}`);
      if (res.ok) {
        const text = await res.text();
        console.log(`Title for ${m}:`, text.match(/<title>([^<]+)<\/title>/i)?.[1]);
      }
    } catch (e) {
      console.log(`FMK Mirror: ${m} -> Error: ${e.message}`);
    }
  }
}

testFMKMirrors();

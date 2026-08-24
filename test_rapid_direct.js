async function testRapidCloseloadDirect() {
  console.log('Testing Rapidrame & Closeload Direct Embeds...');
  
  // 1. Rapidrame by TMDB & Season/Episode
  const urls = [
    'https://rapidrame.com/embed/?tmdb=108978&s=1&e=1', // Reacher S1E1
    'https://rapidrame.com/embed/?tmdb=93405&s=1&e=1',  // Squid Game S1E1
    'https://rapidrame.com/embed/?tmdb=1396&s=5&e=15',  // Breaking Bad S5E15
    'https://closeload.com/embed/?tmdb=108978&s=1&e=1',
    'https://closeload.com/embed/?imdb_id=tt10919420'
  ];

  for (const u of urls) {
    try {
      const res = await fetch(u, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://filmmakinesi.to/'
        }
      });
      console.log(u, 'Status:', res.status);
      if (res.ok) {
        const text = await res.text();
        console.log('Length:', text.length, 'Contains iframe/m3u8:', text.includes('.m3u8') || text.includes('iframe') || text.includes('player'));
      }
    } catch (e) {
      console.log(u, 'Error:', e.message);
    }
  }
}

testRapidCloseloadDirect();

async function testFetchWithFullHeaders() {
  const url = 'https://filmmakinesi.to/dizi/lanterns-2026/sezon-1/bolum-1/';
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'Referer': 'https://filmmakinesi.to/'
  };

  const res = await fetch(url, { headers });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Length:', text.length);
  const rapidMatch = text.match(/(?:src|data-src)=["'](https:\/\/(?:rapid\.filmmakinesi\.to|rapidrame\.com)\/embed[^"']*)["']/i);
  console.log('Rapid match:', rapidMatch ? rapidMatch[1] : 'null');
}

testFetchWithFullHeaders();

async function testRapidHls() {
  const masterUrl = 'https://s230.rapidrame.com/hls2/01/00036/mfc3ts6wtlun_,l,n,.urlset/master.m3u8?t=CICrPgie87ImFWYzcVr4L6pwYfXPO4jMMex0RmtRBDc&s=1787268099&e=14400&f=183572&srv=s461&i=0.0&sp=0&n=v0njsip05vhasygo&p1=s230&p2=s230';
  
  const res = await fetch(masterUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://rapid.filmmakinesi.to/'
    }
  });

  console.log('Rapid m3u8 status:', res.status);
  const text = await res.text();
  console.log('Rapid m3u8 content:\n', text.substring(0, 400));
}

testRapidHls();

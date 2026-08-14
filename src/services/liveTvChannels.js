/* ==========================================================================
   CinePulse Studio - Turkish Live TV Channels Data & Streams
   Categorized channels: Spor, Ulusal, Haber, Belgesel, Sinema, Çocuk & Müzik
   Supports direct HLS (.m3u8) feeds and relay embed fallbacks
   ========================================================================== */

export const LIVE_TV_CATEGORIES = [
  { id: 'all', name: 'Tüm Kanallar', icon: 'tv' },
  { id: 'sports', name: 'Spor', icon: 'trophy' },
  { id: 'national', name: 'Ulusal', icon: 'home' },
  { id: 'news', name: 'Haber', icon: 'newspaper' },
  { id: 'doc', name: 'Belgesel', icon: 'compass' },
  { id: 'cinema', name: 'Sinema & Dizi', icon: 'film' },
  { id: 'kids_music', name: 'Çocuk & Müzik', icon: 'music' }
];

export const LIVE_TV_CHANNELS = [
  // --- SPOR (SPORTS) ---
  {
    id: 'ch_bein1',
    name: 'beIN Sports 1 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/BeIN_Sports_1_logo.svg/300px-BeIN_Sports_1_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/bein1.php',
    badge: '⚽ Süper Lig',
    quality: '1080p HD'
  },
  {
    id: 'ch_bein2',
    name: 'beIN Sports 2 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/BeIN_Sports_1_logo.svg/300px-BeIN_Sports_1_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/bein2.php',
    badge: '⚽ Süper Lig',
    quality: '1080p HD'
  },
  {
    id: 'ch_bein3',
    name: 'beIN Sports 3 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/BeIN_Sports_1_logo.svg/300px-BeIN_Sports_1_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/bein3.php',
    badge: '⚽ Spor Extra',
    quality: '1080p HD'
  },
  {
    id: 'ch_bein_haber',
    name: 'beIN Sports Haber HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/BeIN_Sports_1_logo.svg/300px-BeIN_Sports_1_logo.svg.png',
    isHls: true,
    streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8',
    badge: '⚡ Canlı Haber',
    quality: '1080p HD'
  },
  {
    id: 'ch_trtspor',
    name: 'TRT Spor HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/TRT_Spor_logo.svg/300px-TRT_Spor_logo.svg.png',
    isHls: true,
    streamUrl: 'https://tv-trtspor1.medya.trt.com.tr/master.m3u8',
    badge: '🏆 Resmi Yayın',
    quality: '1080p HD'
  },
  {
    id: 'ch_trtspor2',
    name: 'TRT Spor Yıldız HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/TRT_Spor_logo.svg/300px-TRT_Spor_logo.svg.png',
    isHls: true,
    streamUrl: 'https://tv-trtspor2.medya.trt.com.tr/master.m3u8',
    badge: '🏆 Resmi Yayın',
    quality: '1080p HD'
  },
  {
    id: 'ch_aspor',
    name: 'A Spor HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/A_Spor_logo.svg/300px-A_Spor_logo.svg.png',
    isHls: true,
    streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8',
    badge: '⚡ Ziraat Türkiye Kupası',
    quality: '1080p HD'
  },
  {
    id: 'ch_ssport1',
    name: 'S Sport 1 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/S_Sport_logo.svg/300px-S_Sport_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/ssport1.php',
    badge: '🏎️ LaLiga & F1',
    quality: '1080p HD'
  },
  {
    id: 'ch_ssport2',
    name: 'S Sport 2 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/S_Sport_logo.svg/300px-S_Sport_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/ssport2.php',
    badge: '🏀 EuroLeague & NBA',
    quality: '1080p HD'
  },
  {
    id: 'ch_tivibuspor',
    name: 'Tivibu Spor 1 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Tivibu_Spor_logo.png/300px-Tivibu_Spor_logo.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/tivibu1.php',
    badge: '⚽ Serie A',
    quality: '1080p HD'
  },
  {
    id: 'ch_exxenspor',
    name: 'Exxen Spor 1 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Exxen_logo.svg/300px-Exxen_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/exxen1.php',
    badge: '🏆 Şampiyonlar Ligi',
    quality: '1080p HD'
  },

  // --- ULUSAL (NATIONAL) ---
  {
    id: 'ch_atv',
    name: 'ATV HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/ATV_Turkey_logo.svg/300px-ATV_Turkey_logo.svg.png',
    isHls: true,
    streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv_1080p.m3u8',
    badge: '📺 Ulusal HD',
    quality: '1080p HD'
  },
  {
    id: 'ch_trt1',
    name: 'TRT 1 HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/TRT_1_logo.svg/300px-TRT_1_logo.svg.png',
    isHls: true,
    streamUrl: 'https://tv-trt1.medya.trt.com.tr/master.m3u8',
    badge: '📺 Ulusal HD',
    quality: '1080p HD'
  },
  {
    id: 'ch_cnbce',
    name: 'CNBC-e HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/CNBC-e_logo_2024.png/300px-CNBC-e_logo_2024.png',
    isHls: true,
    streamUrl: 'https://hnpsechtsc.turknet.ercdn.net/xpnvudnlsv/cnbc-e/cnbc-e.m3u8',
    badge: '🎬 Dizi & Finans',
    quality: '1080p HD'
  },
  {
    id: 'ch_a2',
    name: 'A2 TV HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/a/a2/A2_logo.png/300px-A2_logo.png',
    isHls: true,
    streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/a2tv/a2tv.m3u8',
    badge: '🎬 Nostalji Diziler',
    quality: '1080p HD'
  },
  {
    id: 'ch_beyaztv',
    name: 'Beyaz TV HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Beyaz_TV_logo.png/300px-Beyaz_TV_logo.png',
    isHls: true,
    streamUrl: 'https://mn-nl.mncdn.com/blutv_beyaztv2/live.m3u8',
    badge: '📺 Ulusal HD',
    quality: '1080p HD'
  },
  {
    id: 'ch_tv360',
    name: 'TV 360 HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/6/6f/360_TV_logo.png/300px-360_TV_logo.png',
    isHls: true,
    streamUrl: 'https://turkmedya-live.ercdn.net/tv360/tv360.m3u8',
    badge: '📺 Yaşam & Dizi',
    quality: '1080p HD'
  },

  // --- HABER (NEWS) ---
  {
    id: 'ch_trthaber',
    name: 'TRT Haber HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/TRT_Haber_logo.svg/300px-TRT_Haber_logo.svg.png',
    isHls: true,
    streamUrl: 'https://tv-trthaber.medya.trt.com.tr/master.m3u8',
    badge: '📰 24 Saat Haber',
    quality: '1080p HD'
  },
  {
    id: 'ch_ahaber',
    name: 'A Haber HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/A_Haber_logo.svg/300px-A_Haber_logo.svg.png',
    isHls: true,
    streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8',
    badge: '📰 Canlı Gündem',
    quality: '1080p HD'
  },
  {
    id: 'ch_bloomberg',
    name: 'Bloomberg HT HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/5/52/Bloomberg_HT_logo.png/300px-Bloomberg_HT_logo.png',
    isHls: true,
    streamUrl: 'https://tv.ensonhaber.com/bloomberght/bloomberght.m3u8',
    badge: '📈 Ekonomi & Finans',
    quality: '1080p HD'
  },
  {
    id: 'ch_tv24',
    name: '24 TV HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/0/05/24_TV_logo.png/300px-24_TV_logo.png',
    isHls: true,
    streamUrl: 'https://tv.ensonhaber.com/tv24/tv24.m3u8',
    badge: '📰 Canlı Yayın',
    quality: '1080p HD'
  },

  // --- BELGESEL (DOCUMENTARY) ---
  {
    id: 'ch_trtbelgesel',
    name: 'TRT Belgesel HD',
    category: 'doc',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/TRT_Belgesel_logo.svg/300px-TRT_Belgesel_logo.svg.png',
    isHls: true,
    streamUrl: 'https://tv-trtbelgesel.medya.trt.com.tr/master.m3u8',
    badge: '🌿 Doğa & Tarih',
    quality: '1080p HD'
  },
  {
    id: 'ch_dmax_live',
    name: 'DMAX TV Canlı HD',
    category: 'doc',
    logo: 'https://img-dmax.mncdn.com/dmaxcomtr_logo.png',
    isHls: false,
    streamUrl: 'https://www.dmax.com.tr/canli-izle',
    badge: '🌿 Macera & Otomobil',
    quality: '1080p HD'
  },
  {
    id: 'ch_tlc_live',
    name: 'TLC TV Canlı HD',
    category: 'doc',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/TLC_Logo.svg/300px-TLC_Logo.svg.png',
    isHls: false,
    streamUrl: 'https://www.tlctv.com.tr/canli-izle',
    badge: '🌿 Yaşam & Realite',
    quality: '1080p HD'
  },
  {
    id: 'ch_ciftcitv',
    name: 'Çiftçi TV HD',
    category: 'doc',
    logo: 'https://live.artidijitalmedya.com/artidijital_ciftcitv/ciftcitv/playlist.m3u8',
    isHls: true,
    streamUrl: 'https://live.artidijitalmedya.com/artidijital_ciftcitv/ciftcitv/playlist.m3u8',
    badge: '🌿 Tarım & Doğa',
    quality: '1080p HD'
  },

  // --- ÇOCUK & MÜZİK (KIDS & MUSIC) ---
  {
    id: 'ch_trtcocuk',
    name: 'TRT Çocuk HD',
    category: 'kids_music',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/TRT_%C3%87ocuk_logo.svg/300px-TRT_%C3%87ocuk_logo.svg.png',
    isHls: true,
    streamUrl: 'https://tv-trtcocuk.medya.trt.com.tr/master.m3u8',
    badge: '👶 Çizgi Film & Eğlence',
    quality: '1080p HD'
  }
];

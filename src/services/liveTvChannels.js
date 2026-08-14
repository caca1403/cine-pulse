/* ==========================================================================
   CinePulse Studio - Complete Turkish Live TV Catalog
   Includes Ulusal, Haber, Spor, Belgesel, Çocuk (Çizgi Film), ve Müzik.
   ========================================================================== */

export const LIVE_TV_CATEGORIES = [
  { id: 'all', name: 'Tüm Kanallar', icon: 'tv' },
  { id: 'national', name: 'Ulusal Kanallar', icon: 'home' },
  { id: 'news', name: 'Haber & Gündem', icon: 'newspaper' },
  { id: 'sports', name: 'Spor Kanalları', icon: 'trophy' },
  { id: 'doc', name: 'Belgesel & Doğa', icon: 'compass' },
  { id: 'kids', name: 'Çocuk & Çizgi Dizi', icon: 'smile' },
  { id: 'music', name: 'Müzik & Gençlik', icon: 'music' }
];

export const LIVE_TV_CHANNELS = [
  // ==========================================
  // --- 📺 ULUSAL (NATIONAL) ---
  // ==========================================
  {
    id: 'ch_trt1',
    name: 'TRT 1 HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/TRT_1_logo.svg/300px-TRT_1_logo.svg.png',
    badge: '📺 Ulusal Resmi HD',
    quality: '1080p Full HD',
    streamUrl: 'https://tv-trt1.medya.trt.com.tr/master.m3u8',
    isHls: true
  },
  {
    id: 'ch_atv',
    name: 'ATV HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/ATV_Turkey_logo.svg/300px-ATV_Turkey_logo.svg.png',
    badge: '📺 Ulusal Canlı HD',
    quality: '1080p Full HD',
    streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv_1080p.m3u8',
    isHls: true
  },
  {
    id: 'ch_showtv',
    name: 'Show TV HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Show_TV_logo.png/300px-Show_TV_logo.png',
    badge: '📺 Popüler Diziler',
    quality: '1080p Full HD',
    streamUrl: 'https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/showtv/showtv.m3u8',
    isHls: true
  },
  {
    id: 'ch_nowtv',
    name: 'NOW TV (FOX) HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/NOW_Turkey_logo.svg/300px-NOW_Turkey_logo.svg.png',
    badge: '📺 Ulusal HD',
    quality: '1080p Full HD',
    streamUrl: 'https://uycyyuuzyh.turknet.ercdn.net/nphindgytw/nowtv/nowtv.m3u8',
    isHls: true
  },
  {
    id: 'ch_startv',
    name: 'Star TV HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/a/a2/Star_TV_logo.png/300px-Star_TV_logo.png',
    badge: '📺 Ulusal HD',
    quality: '1080p Full HD',
    streamUrl: 'https://dygvideo.dygdigital.com/live/hls/startv4puhu/live.m3u8',
    isHls: true
  },
  {
    id: 'ch_kanald',
    name: 'Kanal D HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/6/69/Kanal_D_logo.png/300px-Kanal_D_logo.png',
    badge: '📺 Ulusal HD',
    quality: '1080p Full HD',
    streamUrl: 'https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/kanald/kanald.m3u8',
    isHls: true
  },
  {
    id: 'ch_tv8',
    name: 'TV8 HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/e/e9/TV8_logo.png/300px-TV8_logo.png',
    badge: '📺 Yarışma & Eğlence',
    quality: '1080p HD',
    streamUrl: 'https://rkhubpaomb.turknet.ercdn.net/fwjkgpasof/tv8/tv8_480p.m3u8',
    isHls: true
  },
  {
    id: 'ch_cnbce',
    name: 'CNBC-e HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/CNBC-e_logo_2024.png/300px-CNBC-e_logo_2024.png',
    badge: '🎬 Dizi & Finans',
    quality: '1080p Full HD',
    streamUrl: 'https://hnpsechtsc.turknet.ercdn.net/xpnvudnlsv/cnbc-e/cnbc-e.m3u8',
    isHls: true
  },
  {
    id: 'ch_a2',
    name: 'A2 TV HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/a/a2/A2_logo.png/300px-A2_logo.png',
    badge: '🎬 Nostalji Diziler',
    quality: '1080p Full HD',
    streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/a2tv/a2tv.m3u8',
    isHls: true
  },
  {
    id: 'ch_kanal7',
    name: 'Kanal 7 HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/6/6a/Kanal_7_logo.png/300px-Kanal_7_logo.png',
    badge: '📺 Aile & Dizi',
    quality: '1080p Full HD',
    streamUrl: 'https://kanal7-live.daioncdn.net/kanal7/kanal7.m3u8',
    isHls: true
  },
  {
    id: 'ch_beyaztv',
    name: 'Beyaz TV HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Beyaz_TV_logo.png/300px-Beyaz_TV_logo.png',
    badge: '📺 Ulusal HD',
    quality: '1080p Full HD',
    streamUrl: 'https://beyaztv-live.daioncdn.net/beyaztv/beyaztv.m3u8',
    isHls: true
  },
  {
    id: 'ch_teve2',
    name: 'Teve2 HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/5/52/Teve2_logo.png/300px-Teve2_logo.png',
    badge: '🎬 Eğlence & Dizi',
    quality: '1080p Full HD',
    streamUrl: 'https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/teve2/teve2.m3u8',
    isHls: true
  },
  {
    id: 'ch_tv360',
    name: 'TV 360 HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/6/6f/360_TV_logo.png/300px-360_TV_logo.png',
    badge: '📺 Yaşam & Dizi',
    quality: '1080p Full HD',
    streamUrl: 'https://turkmedya-live.ercdn.net/tv360/tv360.m3u8',
    isHls: true
  },

  // ==========================================
  // --- 📰 HABER (NEWS) ---
  // ==========================================
  {
    id: 'ch_trthaber',
    name: 'TRT Haber HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/TRT_Haber_logo.svg/300px-TRT_Haber_logo.svg.png',
    badge: '📰 24 Saat Haber',
    quality: '1080p Full HD',
    streamUrl: 'https://tv-trthaber.medya.trt.com.tr/master.m3u8',
    isHls: true
  },
  {
    id: 'ch_ahaber',
    name: 'A Haber HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/A_Haber_logo.svg/300px-A_Haber_logo.svg.png',
    badge: '📰 Canlı Gündem',
    quality: '1080p Full HD',
    streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8',
    isHls: true
  },
  {
    id: 'ch_ntv',
    name: 'NTV HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/NTV_logo.svg/300px-NTV_logo.svg.png',
    badge: '📰 Doğru ve Tarafsız',
    quality: '1080p Full HD',
    streamUrl: 'https://dygvideo.dygdigital.com/live/hls/ntv4puhu/live.m3u8',
    isHls: true
  },
  {
    id: 'ch_cnnturk',
    name: 'CNN Türk HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/CNN_Turk_logo.svg/300px-CNN_Turk_logo.svg.png',
    badge: '📰 İlk Bilen Siz Olun',
    quality: '1080p Full HD',
    streamUrl: 'https://www.cnnturk.com/canli-yayin',
    isHls: false
  },
  {
    id: 'ch_haberturk',
    name: 'Habertürk TV HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Habert%C3%BCrk_TV_logo.svg/300px-Habert%C3%BCrk_TV_logo.svg.png',
    badge: '📰 Türkiye\'nin Nabzı',
    quality: '1080p Full HD',
    streamUrl: 'https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/haberturktv/haberturktv.m3u8',
    isHls: true
  },
  {
    id: 'ch_halktv',
    name: 'Halk TV HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Halk_TV_logo.png/300px-Halk_TV_logo.png',
    badge: '📰 Halkın Sesi',
    quality: '1080p Full HD',
    streamUrl: 'https://halktv-live.daioncdn.net/halktv/halktv.m3u8',
    isHls: true
  },
  {
    id: 'ch_tele1',
    name: 'Tele1 HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/5/5c/Tele1_logo.png/300px-Tele1_logo.png',
    badge: '📰 Gerçek Haber',
    quality: '1080p Full HD',
    streamUrl: 'https://tele1-live.ercdn.net/tele1/tele1.m3u8',
    isHls: true
  },
  {
    id: 'ch_tv100',
    name: 'TV 100 HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/a/a4/Tv100_logo.png/300px-Tv100_logo.png',
    badge: '📰 Son Dakika Haber',
    quality: '1080p Full HD',
    streamUrl: 'https://tv.ensonhaber.com/tv100/tv100.m3u8',
    isHls: true
  },
  {
    id: 'ch_bloomberg',
    name: 'Bloomberg HT HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/5/52/Bloomberg_HT_logo.png/300px-Bloomberg_HT_logo.png',
    badge: '📈 Ekonomi & Piyasalar',
    quality: '1080p Full HD',
    streamUrl: 'https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/bloomberght/bloomberght.m3u8',
    isHls: true
  },
  {
    id: 'ch_tv24',
    name: '24 TV HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/0/05/24_TV_logo.png/300px-24_TV_logo.png',
    badge: '📰 Doğrusunu Öğrenin',
    quality: '1080p Full HD',
    streamUrl: 'https://tv.ensonhaber.com/tv24/tv24.m3u8',
    isHls: true
  },
  {
    id: 'ch_ulketv',
    name: 'Ülke TV HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/0/04/%C3%9Clke_TV_logo.png/300px-%C3%9Clke_TV_logo.png',
    badge: '📰 Canlı Gündem',
    quality: '1080p Full HD',
    streamUrl: 'https://livetv.radyotvonline.net/kanal7live/ulketv/playlist.m3u8',
    isHls: true
  },

  // ==========================================
  // --- ⚽ SPOR (SPORTS) ---
  // ==========================================
  {
    id: 'ch_trtspor',
    name: 'TRT Spor HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/TRT_Spor_logo.svg/300px-TRT_Spor_logo.svg.png',
    badge: '🏆 Resmi Canlı Yayın',
    quality: '1080p Full HD',
    streamUrl: 'https://tv-trtspor1.medya.trt.com.tr/master.m3u8',
    isHls: true
  },
  {
    id: 'ch_trtspor2',
    name: 'TRT Spor Yıldız HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/TRT_Spor_logo.svg/300px-TRT_Spor_logo.svg.png',
    badge: '🏆 Voleybol & Olimpiyat',
    quality: '1080p Full HD',
    streamUrl: 'https://tv-trtspor2.medya.trt.com.tr/master.m3u8',
    isHls: true
  },
  {
    id: 'ch_aspor',
    name: 'A Spor HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/A_Spor_logo.svg/300px-A_Spor_logo.svg.png',
    badge: '⚡ Ziraat Türkiye Kupası',
    quality: '1080p Full HD',
    streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8',
    isHls: true
  },
  {
    id: 'ch_sportstv',
    name: 'Sports TV HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/9/90/Sports_TV_logo.png/300px-Sports_TV_logo.png',
    badge: '⚡ Sporun Her Rengi',
    quality: '1080p Full HD',
    streamUrl: 'https://www.canlitv.fun/iframe/sportstv',
    isHls: false
  },
  {
    id: 'ch_fbtv',
    name: 'Fenerbahçe TV (FB TV) HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/a/a2/FB_TV_logo.png/300px-FB_TV_logo.png',
    badge: '🟡🔵 Kulüp TV',
    quality: '1080p Full HD',
    streamUrl: 'https://www.canlitv.fun/iframe/fbtv',
    isHls: false
  },
  {
    id: 'ch_gstv',
    name: 'Galatasaray TV (GS TV) HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/4/4e/GS_TV_logo.png/300px-GS_TV_logo.png',
    badge: '🟡🔴 Kulüp TV',
    quality: '1080p Full HD',
    streamUrl: 'https://www.canlitv.fun/iframe/gstv',
    isHls: false
  },
  {
    id: 'ch_tjktv',
    name: 'TJK TV HD (Canlı Yarış)',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/9/9c/TJK_TV_logo.png/300px-TJK_TV_logo.png',
    badge: '🐎 Canlı Yarış & Spor',
    quality: '1080p Full HD',
    streamUrl: 'https://www.canlitv.fun/iframe/tjk-tv',
    isHls: false
  },

  // ==========================================
  // --- 🌿 BELGESEL (DOCUMENTARY LIVE) ---
  // ==========================================
  {
    id: 'ch_trtbelgesel',
    name: 'TRT Belgesel HD',
    category: 'doc',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/TRT_Belgesel_logo.svg/300px-TRT_Belgesel_logo.svg.png',
    badge: '🌿 Doğa, Bilim & Tarih',
    quality: '1080p Full HD',
    streamUrl: 'https://tv-trtbelgesel-dai.medya.trt.com.tr/master.m3u8',
    isHls: true
  },
  {
    id: 'ch_dmax_live',
    name: 'DMAX TV Canlı HD',
    category: 'doc',
    logo: 'https://img-dmax.mncdn.com/dmaxcomtr_logo.png',
    badge: '🌿 Macera & Otomobil',
    quality: '1080p Full HD',
    streamUrl: 'https://www.dmax.com.tr/canli-izle',
    isHls: false
  },
  {
    id: 'ch_tlc_live',
    name: 'TLC TV Canlı HD',
    category: 'doc',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/TLC_Logo.svg/300px-TLC_Logo.svg.png',
    badge: '🌿 Yaşam & Realite',
    quality: '1080p Full HD',
    streamUrl: 'https://www.tlctv.com.tr/canli-izle',
    isHls: false
  },
  {
    id: 'ch_tgrtbelgesel',
    name: 'TGRT Belgesel HD',
    category: 'doc',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/TRT_Belgesel_logo.svg/300px-TRT_Belgesel_logo.svg.png',
    badge: '🌿 Tarih & Medeniyet',
    quality: '1080p Full HD',
    streamUrl: 'https://b01c02nl.mediatriple.net/videoonlylive/mtsxxkzwwuqtglive/broadcast_5fe462afc6a0e.smil/playlist.m3u8',
    isHls: true
  },
  {
    id: 'ch_ciftcitv',
    name: 'Çiftçi TV HD',
    category: 'doc',
    logo: 'https://live.artidijitalmedya.com/artidijital_ciftcitv/ciftcitv/playlist.m3u8',
    badge: '🌿 Tarım & Doğa',
    quality: '1080p Full HD',
    streamUrl: 'https://live.artidijitalmedya.com/artidijital_ciftcitv/ciftcitv/chunks.m3u8',
    isHls: true
  },

  // ==========================================
  // --- 👶 ÇOCUK & ANİMASYON (KIDS) ---
  // ==========================================
  {
    id: 'ch_trtcocuk',
    name: 'TRT Çocuk HD',
    category: 'kids',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/TRT_%C3%87ocuk_logo.svg/300px-TRT_%C3%87ocuk_logo.svg.png',
    badge: '👶 Çizgi Film & Eğlence',
    quality: '1080p Full HD',
    streamUrl: 'https://tv-trtcocuk.medya.trt.com.tr/master.m3u8',
    isHls: true
  },
  {
    id: 'ch_minikago',
    name: 'Minika GO HD',
    category: 'kids',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Minika_GO_logo.png/300px-Minika_GO_logo.png',
    badge: '👶 Macera & Çizgi Dizi',
    quality: '1080p Full HD',
    streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/minikago/minikago.m3u8',
    isHls: true
  },
  {
    id: 'ch_minikacocuk',
    name: 'Minika Çocuk HD',
    category: 'kids',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/b/b3/Minika_%C3%87ocuk_logo.png/300px-Minika_%C3%87ocuk_logo.png',
    badge: '👶 Okul Öncesi & Çizgi Film',
    quality: '1080p Full HD',
    streamUrl: 'https://www.canlitv.fun/iframe/minika-cocuk',
    isHls: false
  },
  {
    id: 'ch_cartoonnetwork',
    name: 'Cartoon Network TR HD',
    category: 'kids',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Cartoon_Network_2010_logo.svg/300px-Cartoon_Network_2010_logo.svg.png',
    badge: '⚡ Efsane Çizgi Diziler',
    quality: '1080p Full HD',
    streamUrl: 'https://www.canlitv.fun/iframe/cartoon-network',
    isHls: false
  },
  {
    id: 'ch_disneychannel',
    name: 'Disney Channel TR HD',
    category: 'kids',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/2019_Disney_Channel_logo.svg/300px-2019_Disney_Channel_logo.svg.png',
    badge: '✨ Disney Çizgi Filmleri',
    quality: '1080p Full HD',
    streamUrl: 'https://www.canlitv.fun/iframe/disney-channel',
    isHls: false
  },
  {
    id: 'ch_zaroktv',
    name: 'Zarok TV HD',
    category: 'kids',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Zarok_TV_logo.png/300px-Zarok_TV_logo.png',
    badge: '👶 Eğlenceli Çizgi Dizi',
    quality: '1080p Full HD',
    streamUrl: 'https://www.canlitv.fun/iframe/zarok-tv',
    isHls: false
  },

  // ==========================================
  // --- 🎵 MÜZİK & GENÇLİK (MUSIC) ---
  // ==========================================
  {
    id: 'ch_trtmuzik',
    name: 'TRT Müzik HD',
    category: 'music',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/TRT_M%C3%BCzik_logo.svg/300px-TRT_M%C3%BCzik_logo.svg.png',
    badge: '🎵 Canlı Müzik & Konser',
    quality: '1080p Full HD',
    streamUrl: 'https://tv-trtmuzik.medya.trt.com.tr/master_480.m3u8',
    isHls: true
  },
  {
    id: 'ch_kralpop',
    name: 'Kral Pop TV HD',
    category: 'music',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Kral_Pop_TV_logo.png/300px-Kral_Pop_TV_logo.png',
    badge: '🔥 Türkçe Pop Hit',
    quality: '1080p Full HD',
    streamUrl: 'https://www.canlitv.fun/iframe/kral-pop',
    isHls: false
  },
  {
    id: 'ch_powerturk',
    name: 'PowerTürk TV HD',
    category: 'music',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/86/Power_T%C3%BCrk_TV_logo.png/300px-Power_T%C3%BCrk_TV_logo.png',
    badge: '⚡ En Sevilen Klipler',
    quality: '1080p Full HD',
    streamUrl: 'https://www.canlitv.fun/iframe/powerturk',
    isHls: false
  },
  {
    id: 'ch_dreamturk',
    name: 'Dream Türk TV HD',
    category: 'music',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/b/b5/Dream_T%C3%BCrk_logo.png/300px-Dream_T%C3%BCrk_logo.png',
    badge: '🎸 Gençlik & Müzik',
    quality: '1080p Full HD',
    streamUrl: 'https://www.canlitv.fun/iframe/dream-turk',
    isHls: false
  },
  {
    id: 'ch_numberone',
    name: 'Number 1 TV HD',
    category: 'music',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/2/2f/Number_One_TV_logo.png/300px-Number_One_TV_logo.png',
    badge: '🌍 Yabancı Hit Müzik',
    quality: '1080p Full HD',
    streamUrl: 'https://www.canlitv.fun/iframe/number-one-tv',
    isHls: false
  },
  {
    id: 'ch_numberoneturk',
    name: 'Number 1 Türk TV HD',
    category: 'music',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/a/a2/Number_One_T%C3%BCrk_TV_logo.png/300px-Number_One_T%C3%BCrk_TV_logo.png',
    badge: '🎵 Türkçe Müzik Listesi',
    quality: '1080p Full HD',
    streamUrl: 'https://www.canlitv.fun/iframe/number-one-turk',
    isHls: false
  }
];

/* ==========================================================================
   CinePulse Studio - Comprehensive Turkish Live TV Channels Catalog
   Full coverage for: Spor, Ulusal, Haber, Belgesel, Sinema, Çocuk & Müzik
   ========================================================================== */

export const LIVE_TV_CATEGORIES = [
  { id: 'all', name: 'Tüm Kanallar', icon: 'tv' },
  { id: 'sports', name: 'Spor (beIN & S Sport)', icon: 'trophy' },
  { id: 'national', name: 'Ulusal & Popüler', icon: 'home' },
  { id: 'news', name: 'Haber & Gündem', icon: 'newspaper' },
  { id: 'doc', name: 'Belgesel & Doğa', icon: 'compass' },
  { id: 'cinema', name: 'Sinema & Dizi', icon: 'film' },
  { id: 'kids_music', name: 'Çocuk & Müzik', icon: 'music' }
];

export const LIVE_TV_CHANNELS = [
  // ==========================================
  // --- ⚽ SPOR (SPORTS) ---
  // ==========================================
  {
    id: 'ch_bein1',
    name: 'beIN Sports 1 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/BeIN_Sports_1_logo.svg/300px-BeIN_Sports_1_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/bein1.php',
    badge: '⚽ Trendyol Süper Lig',
    quality: '1080p HD'
  },
  {
    id: 'ch_bein2',
    name: 'beIN Sports 2 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/BeIN_Sports_1_logo.svg/300px-BeIN_Sports_1_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/bein2.php',
    badge: '⚽ Trendyol Süper Lig',
    quality: '1080p HD'
  },
  {
    id: 'ch_bein3',
    name: 'beIN Sports 3 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/BeIN_Sports_1_logo.svg/300px-BeIN_Sports_1_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/bein3.php',
    badge: '⚽ Ligue 1 & Bundesliga',
    quality: '1080p HD'
  },
  {
    id: 'ch_bein4',
    name: 'beIN Sports 4 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/BeIN_Sports_1_logo.svg/300px-BeIN_Sports_1_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/bein4.php',
    badge: '⚽ Spor Extra',
    quality: '1080p HD'
  },
  {
    id: 'ch_bein5',
    name: 'beIN Sports 5 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/BeIN_Sports_1_logo.svg/300px-BeIN_Sports_1_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/bein5.php',
    badge: '⚽ Spor Extra 2',
    quality: '1080p HD'
  },
  {
    id: 'ch_bein_haber',
    name: 'beIN Sports Haber HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/BeIN_Sports_1_logo.svg/300px-BeIN_Sports_1_logo.svg.png',
    isHls: true,
    streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8',
    badge: '⚡ Canlı Spor Haber',
    quality: '1080p HD'
  },
  {
    id: 'ch_ssport1',
    name: 'S Sport 1 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/S_Sport_logo.svg/300px-S_Sport_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/ssport1.php',
    badge: '🏎️ LaLiga & Formula 1',
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
    id: 'ch_tivibuspor1',
    name: 'Tivibu Spor 1 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Tivibu_Spor_logo.png/300px-Tivibu_Spor_logo.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/tivibu1.php',
    badge: '⚽ İtalya Serie A & FA Cup',
    quality: '1080p HD'
  },
  {
    id: 'ch_tivibuspor2',
    name: 'Tivibu Spor 2 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Tivibu_Spor_logo.png/300px-Tivibu_Spor_logo.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/tivibu2.php',
    badge: '⚽ Serie A Live',
    quality: '1080p HD'
  },
  {
    id: 'ch_tivibuspor3',
    name: 'Tivibu Spor 3 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Tivibu_Spor_logo.png/300px-Tivibu_Spor_logo.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/tivibu3.php',
    badge: '⚽ Tivibu Canlı',
    quality: '1080p HD'
  },
  {
    id: 'ch_exxenspor1',
    name: 'Exxen Spor 1 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Exxen_logo.svg/300px-Exxen_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/exxen1.php',
    badge: '🏆 UEFA Şampiyonlar Ligi',
    quality: '1080p HD'
  },
  {
    id: 'ch_exxenspor2',
    name: 'Exxen Spor 2 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Exxen_logo.svg/300px-Exxen_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/exxen2.php',
    badge: '🏆 UEFA Avrupa Ligi',
    quality: '1080p HD'
  },
  {
    id: 'ch_exxenspor3',
    name: 'Exxen Spor 3 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Exxen_logo.svg/300px-Exxen_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/exxen3.php',
    badge: '🏆 Konferans Ligi',
    quality: '1080p HD'
  },
  {
    id: 'ch_trtspor',
    name: 'TRT Spor HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/TRT_Spor_logo.svg/300px-TRT_Spor_logo.svg.png',
    isHls: true,
    streamUrl: 'https://tv-trtspor1.medya.trt.com.tr/master.m3u8',
    badge: '🏆 Resmi Canlı Yayın',
    quality: '1080p HD'
  },
  {
    id: 'ch_trtspor2',
    name: 'TRT Spor Yıldız HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/TRT_Spor_logo.svg/300px-TRT_Spor_logo.svg.png',
    isHls: true,
    streamUrl: 'https://tv-trtspor2.medya.trt.com.tr/master.m3u8',
    badge: '🏆 Olimpiyat & Voleybol',
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
    id: 'ch_tv85',
    name: 'TV 8.5 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/8e/TV8.5_logo.png/300px-TV8.5_logo.png',
    isHls: false,
    streamUrl: 'https://www.tv8bucuk.com/canli-yayin',
    badge: '⚽ Şampiyonlar Ligi Özetleri',
    quality: '1080p HD'
  },
  {
    id: 'ch_eurosport1',
    name: 'Eurosport 1 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Eurosport_1_logo_2015.svg/300px-Eurosport_1_logo_2015.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/eurosport1.php',
    badge: '🎾 Grand Slam & Bisiklet',
    quality: '1080p HD'
  },
  {
    id: 'ch_eurosport2',
    name: 'Eurosport 2 HD',
    category: 'sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Eurosport_2_logo_2015.svg/300px-Eurosport_2_logo_2015.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/eurosport2.php',
    badge: '⛷️ Kış Sporları & Motor',
    quality: '1080p HD'
  },

  // ==========================================
  // --- 📺 ULUSAL (NATIONAL & POPULAR) ---
  // ==========================================
  {
    id: 'ch_atv',
    name: 'ATV HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/ATV_Turkey_logo.svg/300px-ATV_Turkey_logo.svg.png',
    isHls: true,
    streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv_1080p.m3u8',
    badge: '📺 Ulusal Canlı HD',
    quality: '1080p HD'
  },
  {
    id: 'ch_trt1',
    name: 'TRT 1 HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/TRT_1_logo.svg/300px-TRT_1_logo.svg.png',
    isHls: true,
    streamUrl: 'https://tv-trt1.medya.trt.com.tr/master.m3u8',
    badge: '📺 Ulusal Resmi HD',
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
    id: 'ch_showtv',
    name: 'Show TV HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Show_TV_logo.png/300px-Show_TV_logo.png',
    isHls: false,
    streamUrl: 'https://www.showtv.com.tr/canli-yayin',
    badge: '📺 Popüler Diziler',
    quality: '1080p HD'
  },
  {
    id: 'ch_nowtv',
    name: 'NOW TV (FOX) HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/NOW_Turkey_logo.svg/300px-NOW_Turkey_logo.svg.png',
    isHls: false,
    streamUrl: 'https://www.nowtv.com.tr/canli-yayin',
    badge: '📺 Ulusal HD',
    quality: '1080p HD'
  },
  {
    id: 'ch_startv',
    name: 'Star TV HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/a/a2/Star_TV_logo.png/300px-Star_TV_logo.png',
    isHls: false,
    streamUrl: 'https://www.startv.com.tr/canli-yayin',
    badge: '📺 Ulusal HD',
    quality: '1080p HD'
  },
  {
    id: 'ch_kanald',
    name: 'Kanal D HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/6/69/Kanal_D_logo.png/300px-Kanal_D_logo.png',
    isHls: false,
    streamUrl: 'https://www.kanald.com.tr/canli-yayin',
    badge: '📺 Ulusal HD',
    quality: '1080p HD'
  },
  {
    id: 'ch_tv8',
    name: 'TV8 HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/e/e9/TV8_logo.png/300px-TV8_logo.png',
    isHls: false,
    streamUrl: 'https://www.tv8.com.tr/canli-yayin',
    badge: '📺 Yarışma & Eğlence',
    quality: '1080p HD'
  },
  {
    id: 'ch_kanal7',
    name: 'Kanal 7 HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/6/6a/Kanal_7_logo.png/300px-Kanal_7_logo.png',
    isHls: false,
    streamUrl: 'https://www.kanal7.com/canli-izle',
    badge: '📺 Aile & Dizi',
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
    id: 'ch_teve2',
    name: 'Teve2 HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/5/52/Teve2_logo.png/300px-Teve2_logo.png',
    isHls: false,
    streamUrl: 'https://www.teve2.com.tr/canli-yayin',
    badge: '🎬 Eğlence & Dizi',
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
  {
    id: 'ch_flashhaber',
    name: 'Flash Haber TV HD',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Flash_TV_logo.png/300px-Flash_TV_logo.png',
    isHls: false,
    streamUrl: 'https://flashhabertv.com.tr/canli-yayin',
    badge: '📺 Eğlence & Haber',
    quality: '1080p HD'
  },

  // ==========================================
  // --- 📰 HABER (NEWS) ---
  // ==========================================
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
    id: 'ch_ntv',
    name: 'NTV HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/NTV_logo.svg/300px-NTV_logo.svg.png',
    isHls: false,
    streamUrl: 'https://www.ntv.com.tr/canli-yayin',
    badge: '📰 Doğru ve Tarafsız',
    quality: '1080p HD'
  },
  {
    id: 'ch_cnnturk',
    name: 'CNN Türk HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/CNN_Turk_logo.svg/300px-CNN_Turk_logo.svg.png',
    isHls: false,
    streamUrl: 'https://www.cnnturk.com/canli-yayin',
    badge: '📰 İlk Bilen Siz Olun',
    quality: '1080p HD'
  },
  {
    id: 'ch_haberturk',
    name: 'Habertürk TV HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Habert%C3%BCrk_TV_logo.svg/300px-Habert%C3%BCrk_TV_logo.svg.png',
    isHls: false,
    streamUrl: 'https://www.haberturk.com/canliyayin',
    badge: '📰 Türkiye\'nin Nabzı',
    quality: '1080p HD'
  },
  {
    id: 'ch_sozcutv',
    name: 'Sözcü TV HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/SZC_TV_logo.svg/300px-SZC_TV_logo.svg.png',
    isHls: false,
    streamUrl: 'https://www.sozcu.com.tr/canli-yayin/sozcu-tv-canli-yayin',
    badge: '📰 Bağımsız Gündem',
    quality: '1080p HD'
  },
  {
    id: 'ch_halktv',
    name: 'Halk TV HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Halk_TV_logo.png/300px-Halk_TV_logo.png',
    isHls: false,
    streamUrl: 'https://halktv.com.tr/canli-yayin',
    badge: '📰 Halkın Sesi',
    quality: '1080p HD'
  },
  {
    id: 'ch_tele1',
    name: 'Tele1 HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/5/5c/Tele1_logo.png/300px-Tele1_logo.png',
    isHls: false,
    streamUrl: 'https://tele1.com.tr/canli-yayin',
    badge: '📰 Gerçek Haber',
    quality: '1080p HD'
  },
  {
    id: 'ch_tv100',
    name: 'TV 100 HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/a/a4/Tv100_logo.png/300px-Tv100_logo.png',
    isHls: false,
    streamUrl: 'https://www.tv100.com/canli-yayin',
    badge: '📰 Son Dakika Haber',
    quality: '1080p HD'
  },
  {
    id: 'ch_bloomberg',
    name: 'Bloomberg HT HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/5/52/Bloomberg_HT_logo.png/300px-Bloomberg_HT_logo.png',
    isHls: true,
    streamUrl: 'https://tv.ensonhaber.com/bloomberght/bloomberght.m3u8',
    badge: '📈 Ekonomi & Piyasalar',
    quality: '1080p HD'
  },
  {
    id: 'ch_tv24',
    name: '24 TV HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/0/05/24_TV_logo.png/300px-24_TV_logo.png',
    isHls: true,
    streamUrl: 'https://tv.ensonhaber.com/tv24/tv24.m3u8',
    badge: '📰 Doğrusunu Öğrenin',
    quality: '1080p HD'
  },
  {
    id: 'ch_ulketv',
    name: 'Ülke TV HD',
    category: 'news',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/0/04/%C3%9Clke_TV_logo.png/300px-%C3%9Clke_TV_logo.png',
    isHls: false,
    streamUrl: 'https://www.ulketv.com.tr/canli-yayin',
    badge: '📰 Canlı Gündem',
    quality: '1080p HD'
  },

  // ==========================================
  // --- 🌿 BELGESEL (DOCUMENTARY LIVE) ---
  // ==========================================
  {
    id: 'ch_trtbelgesel',
    name: 'TRT Belgesel HD',
    category: 'doc',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/TRT_Belgesel_logo.svg/300px-TRT_Belgesel_logo.svg.png',
    isHls: true,
    streamUrl: 'https://tv-trtbelgesel.medya.trt.com.tr/master.m3u8',
    badge: '🌿 Doğa, Bilim & Tarih',
    quality: '1080p HD'
  },
  {
    id: 'ch_natgeo',
    name: 'National Geographic HD',
    category: 'doc',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/National_Geographic_Channel_logo.svg/300px-National_Geographic_Channel_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/natgeo.php',
    badge: '🌿 Vahşi Doğa & Bilim',
    quality: '1080p HD'
  },
  {
    id: 'ch_natgeowild',
    name: 'Nat Geo Wild HD',
    category: 'doc',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Nat_Geo_Wild_2018.svg/300px-Nat_Geo_Wild_2018.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/natgeowild.php',
    badge: '🌿 Vahşi Hayat',
    quality: '1080p HD'
  },
  {
    id: 'ch_discovery',
    name: 'Discovery Channel HD',
    category: 'doc',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Discovery_Channel_2019.svg/300px-Discovery_Channel_2019.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/discovery.php',
    badge: '🌿 Keşif & Macera',
    quality: '1080p HD'
  },
  {
    id: 'ch_animalplanet',
    name: 'Animal Planet HD',
    category: 'doc',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Animal_Planet_2018.svg/300px-Animal_Planet_2018.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/animalplanet.php',
    badge: '🐾 Hayvanlar Alemi',
    quality: '1080p HD'
  },
  {
    id: 'ch_history',
    name: 'History Channel HD',
    category: 'doc',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/History_Logo.svg/300px-History_Logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/history.php',
    badge: '🏛️ Tarih & Gizemler',
    quality: '1080p HD'
  },
  {
    id: 'ch_bbcearth',
    name: 'BBC Earth HD',
    category: 'doc',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/BBC_Earth_logo.svg/300px-BBC_Earth_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/bbcearth.php',
    badge: '🌍 Gezegenimiz',
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

  // ==========================================
  // --- 🎬 SİNEMA & DİZİ (CINEMA & SERIES) ---
  // ==========================================
  {
    id: 'ch_beinmovies_prem',
    name: 'beIN Movies Premiere HD',
    category: 'cinema',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/BeIN_Sports_1_logo.svg/300px-BeIN_Sports_1_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/beinmovies1.php',
    badge: '🎬 Vizyon Filmleri',
    quality: '1080p HD'
  },
  {
    id: 'ch_beinmovies_stars',
    name: 'beIN Movies Stars HD',
    category: 'cinema',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/BeIN_Sports_1_logo.svg/300px-BeIN_Sports_1_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/beinmovies2.php',
    badge: '🎬 Yıldız Filmler',
    quality: '1080p HD'
  },
  {
    id: 'ch_beinmovies_action',
    name: 'beIN Movies Action HD',
    category: 'cinema',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/BeIN_Sports_1_logo.svg/300px-BeIN_Sports_1_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/beinmoviesaction.php',
    badge: '🎬 Aksiyon & Gerilim',
    quality: '1080p HD'
  },
  {
    id: 'ch_sinematv',
    name: 'Sinema TV HD',
    category: 'cinema',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/9/91/Sinema_TV_logo.png/300px-Sinema_TV_logo.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/sinematv.php',
    badge: '🎬 Sinema Keyfi',
    quality: '1080p HD'
  },
  {
    id: 'ch_sinematv_aksiyon',
    name: 'Sinema TV Aksiyon HD',
    category: 'cinema',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/9/91/Sinema_TV_logo.png/300px-Sinema_TV_logo.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/sinematvaksiyon.php',
    badge: '🎬 Aksiyon 1080p',
    quality: '1080p HD'
  },
  {
    id: 'ch_fx',
    name: 'FX TV HD',
    category: 'cinema',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/FX_Logo.svg/300px-FX_Logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/fx.php',
    badge: '🎬 Yabancı Diziler',
    quality: '1080p HD'
  },

  // ==========================================
  // --- 👶 ÇOCUK & 🎵 MÜZİK (KIDS & MUSIC) ---
  // ==========================================
  {
    id: 'ch_trtcocuk',
    name: 'TRT Çocuk HD',
    category: 'kids_music',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/TRT_%C3%87ocuk_logo.svg/300px-TRT_%C3%87ocuk_logo.svg.png',
    isHls: true,
    streamUrl: 'https://tv-trtcocuk.medya.trt.com.tr/master.m3u8',
    badge: '👶 Çizgi Film & Eğlence',
    quality: '1080p HD'
  },
  {
    id: 'ch_cartoon_network',
    name: 'Cartoon Network HD',
    category: 'kids_music',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Cartoon_Network_2010_logo.svg/300px-Cartoon_Network_2010_logo.svg.png',
    isHls: false,
    streamUrl: 'https://vipotv.site/embed/cartoonnetwork.php',
    badge: '👶 Popüler Çizgi Diziler',
    quality: '1080p HD'
  },
  {
    id: 'ch_kralpoptv',
    name: 'Kral Pop TV HD',
    category: 'kids_music',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/85/Kral_Pop_TV_logo.png/300px-Kral_Pop_TV_logo.png',
    isHls: false,
    streamUrl: 'https://www.kralmuzik.com.tr/tv/kral-pop-tv',
    badge: '🎵 Türkçe Pop Müzik',
    quality: '1080p HD'
  },
  {
    id: 'ch_powerturktv',
    name: 'PowerTürk TV HD',
    category: 'kids_music',
    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/5/52/Power_T%C3%BCrk_TV_logo.png/300px-Power_T%C3%BCrk_TV_logo.png',
    isHls: false,
    streamUrl: 'https://www.powerapp.com.tr/tv/powerturktv',
    badge: '🎵 Canlı Müzik Klipleri',
    quality: '1080p HD'
  }
];

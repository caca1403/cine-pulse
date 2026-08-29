/* ==========================================================================
   CinePulse Studio - 100% Native HLS Turkish Live TV Catalog
   All channels use direct m3u8 streams via HLS.js — zero iframes.
   ========================================================================== */

export const LIVE_TV_CATEGORIES = [
  { id: 'all', name: 'Tümü', icon: 'tv' },
  { id: 'national', name: 'Ulusal', icon: 'home' },
  { id: 'news', name: 'Haber', icon: 'newspaper' },
  { id: 'sports', name: 'Spor', icon: 'trophy' },
  { id: 'doc', name: 'Belgesel', icon: 'compass' },
  { id: 'kids', name: 'Çocuk', icon: 'smile' },
  { id: 'music', name: 'Müzik', icon: 'music' }
];

export const LIVE_TV_CHANNELS = [
  // ── ULUSAL ──
  { id: 'ch_trt1',       name: 'TRT 1',         category: 'national', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/TRT_1_logo.svg/300px-TRT_1_logo.svg.png',       quality: '1080p', streamUrl: 'https://tv-trt1.medya.trt.com.tr/master.m3u8' },
  { id: 'ch_atv',        name: 'ATV',            category: 'national', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/ATV_Turkey_logo.svg/300px-ATV_Turkey_logo.svg.png', quality: '1080p', streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv_1080p.m3u8' },
  { id: 'ch_showtv',     name: 'Show TV',        category: 'national', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Show_TV_logo.png/300px-Show_TV_logo.png',             quality: '1080p', streamUrl: 'https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/showtv/showtv.m3u8' },
  { id: 'ch_nowtv',      name: 'NOW TV',         category: 'national', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/NOW_Turkey_logo.svg/300px-NOW_Turkey_logo.svg.png', quality: '1080p', streamUrl: 'https://uycyyuuzyh.turknet.ercdn.net/nphindgytw/nowtv/nowtv.m3u8' },
  { id: 'ch_startv',     name: 'Star TV',        category: 'national', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/a/a2/Star_TV_logo.png/300px-Star_TV_logo.png',             quality: '1080p', streamUrl: 'https://dygvideo.dygdigital.com/live/hls/startv4puhu/live.m3u8' },
  { id: 'ch_kanald',     name: 'Kanal D',        category: 'national', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/6/69/Kanal_D_logo.png/300px-Kanal_D_logo.png',             quality: '1080p', streamUrl: 'https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/kanald/kanald.m3u8' },
  { id: 'ch_tv8',        name: 'TV8',            category: 'national', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/e/e9/TV8_logo.png/300px-TV8_logo.png',                     quality: '480p',  streamUrl: 'https://rkhubpaomb.turknet.ercdn.net/fwjkgpasof/tv8/tv8_480p.m3u8' },
  { id: 'ch_cnbce',      name: 'CNBC-e',         category: 'national', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/CNBC-e_logo_2024.png/300px-CNBC-e_logo_2024.png', quality: '1080p', streamUrl: 'https://hnpsechtsc.turknet.ercdn.net/xpnvudnlsv/cnbc-e/cnbc-e.m3u8' },
  { id: 'ch_a2',         name: 'A2 TV',          category: 'national', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/a/a2/A2_logo.png/300px-A2_logo.png',                       quality: '1080p', streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/a2tv/a2tv.m3u8' },
  { id: 'ch_kanal7',     name: 'Kanal 7',        category: 'national', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/6/6a/Kanal_7_logo.png/300px-Kanal_7_logo.png',             quality: '1080p', streamUrl: 'https://kanal7-live.daioncdn.net/kanal7/kanal7.m3u8' },
  { id: 'ch_beyaztv',    name: 'Beyaz TV',       category: 'national', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Beyaz_TV_logo.png/300px-Beyaz_TV_logo.png',           quality: '1080p', streamUrl: 'https://beyaztv-live.daioncdn.net/beyaztv/beyaztv.m3u8' },
  { id: 'ch_teve2',      name: 'Teve2',          category: 'national', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/5/52/Teve2_logo.png/300px-Teve2_logo.png',                 quality: '1080p', streamUrl: 'https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/teve2/teve2.m3u8' },
  { id: 'ch_tv360',      name: 'TV 360',         category: 'national', logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/6/6f/360_TV_logo.png/300px-360_TV_logo.png',               quality: '1080p', streamUrl: 'https://turkmedya-live.ercdn.net/tv360/tv360.m3u8' },

  // ── HABER ──
  { id: 'ch_trthaber',   name: 'TRT Haber',      category: 'news',     logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/TRT_Haber_logo.svg/300px-TRT_Haber_logo.svg.png', quality: '1080p', streamUrl: 'https://tv-trthaber.medya.trt.com.tr/master.m3u8' },
  { id: 'ch_ahaber',     name: 'A Haber',        category: 'news',     logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/A_Haber_logo.svg/300px-A_Haber_logo.svg.png',     quality: '1080p', streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8' },
  { id: 'ch_ntv',        name: 'NTV',            category: 'news',     logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/NTV_logo.svg/300px-NTV_logo.svg.png',             quality: '1080p', streamUrl: 'https://dygvideo.dygdigital.com/live/hls/ntv4puhu/live.m3u8' },
  { id: 'ch_haberturk',  name: 'Habertürk',      category: 'news',     logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Habert%C3%BCrk_TV_logo.svg/300px-Habert%C3%BCrk_TV_logo.svg.png', quality: '1080p', streamUrl: 'https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/haberturktv/haberturktv.m3u8' },
  { id: 'ch_halktv',     name: 'Halk TV',        category: 'news',     logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Halk_TV_logo.png/300px-Halk_TV_logo.png',             quality: '1080p', streamUrl: 'https://halktv-live.daioncdn.net/halktv/halktv.m3u8' },
  { id: 'ch_tele1',      name: 'Tele1',          category: 'news',     logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/5/5c/Tele1_logo.png/300px-Tele1_logo.png',                 quality: '1080p', streamUrl: 'https://tele1-live.ercdn.net/tele1/tele1.m3u8' },
  { id: 'ch_tv100',      name: 'TV 100',         category: 'news',     logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/a/a4/Tv100_logo.png/300px-Tv100_logo.png',                 quality: '1080p', streamUrl: 'https://tv.ensonhaber.com/tv100/tv100.m3u8' },
  { id: 'ch_bloomberg',  name: 'Bloomberg HT',   category: 'news',     logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/5/52/Bloomberg_HT_logo.png/300px-Bloomberg_HT_logo.png',   quality: '1080p', streamUrl: 'https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/bloomberght/bloomberght.m3u8' },
  { id: 'ch_tv24',       name: '24 TV',          category: 'news',     logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/0/05/24_TV_logo.png/300px-24_TV_logo.png',                 quality: '1080p', streamUrl: 'https://tv.ensonhaber.com/tv24/tv24.m3u8' },
  { id: 'ch_ulketv',     name: 'Ülke TV',        category: 'news',     logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/0/04/%C3%9Clke_TV_logo.png/300px-%C3%9Clke_TV_logo.png',   quality: '1080p', streamUrl: 'https://livetv.radyotvonline.net/kanal7live/ulketv/playlist.m3u8' },

  // ── SPOR ──
  { id: 'ch_trtspor',    name: 'TRT Spor',       category: 'sports',   logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/TRT_Spor_logo.svg/300px-TRT_Spor_logo.svg.png', quality: '1080p', streamUrl: 'https://tv-trtspor1.medya.trt.com.tr/master.m3u8' },
  { id: 'ch_trtspor2',   name: 'TRT Spor Yıldız', category: 'sports',  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/TRT_Spor_logo.svg/300px-TRT_Spor_logo.svg.png', quality: '1080p', streamUrl: 'https://tv-trtspor2.medya.trt.com.tr/master.m3u8' },
  { id: 'ch_aspor',      name: 'A Spor',         category: 'sports',   logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/A_Spor_logo.svg/300px-A_Spor_logo.svg.png',     quality: '1080p', streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8' },

  // ── BELGESEL & YAŞAM ──
  { id: 'ch_dmax',       name: 'DMAX HD',        category: 'doc',      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/DMAX_Logo_2016.svg/300px-DMAX_Logo_2016.svg.png', quality: '720p HD', streamUrl: 'https://dogus-live.daioncdn.net/dmax/dmax_720p.m3u8', fallbackUrl: 'https://dogus-live.daioncdn.net/dmax/dmax.m3u8' },
  { id: 'ch_tlc',        name: 'TLC HD',         category: 'doc',      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/TLC_Logo.svg/300px-TLC_Logo.svg.png',             quality: '720p HD', streamUrl: 'https://dogus-live.daioncdn.net/tlc/tlc_720p.m3u8', fallbackUrl: 'https://dogus-live.daioncdn.net/tlc/tlc.m3u8' },
  { id: 'ch_trtbelgesel', name: 'TRT Belgesel',  category: 'doc',      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/TRT_Belgesel_logo.svg/300px-TRT_Belgesel_logo.svg.png', quality: '1080p', streamUrl: 'https://tv-trtbelgesel-dai.medya.trt.com.tr/master.m3u8' },
  { id: 'ch_tgrtbelgesel', name: 'TGRT Belgesel', category: 'doc',     logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/TRT_Belgesel_logo.svg/300px-TRT_Belgesel_logo.svg.png', quality: '1080p', streamUrl: 'https://b01c02nl.mediatriple.net/videoonlylive/mtsxxkzwwuqtglive/broadcast_5fe462afc6a0e.smil/playlist.m3u8' },
  { id: 'ch_ciftcitv',   name: 'Çiftçi TV',      category: 'doc',      logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/3/30/Kanal_V_logo.png/300px-Kanal_V_logo.png', quality: '720p', streamUrl: 'https://live.artidijitalmedya.com/artidijital_ciftcitv/ciftcitv/chunks.m3u8' },
  { id: 'ch_kanalv',     name: 'Kanal V',        category: 'doc',      logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/3/30/Kanal_V_logo.png/300px-Kanal_V_logo.png', quality: '720p', streamUrl: 'https://live.artidijitalmedya.com/artidijital_kanalv/kanalv/chunks.m3u8' },

  // ── ÇOCUK ──
  { id: 'ch_trtcocuk',   name: 'TRT Çocuk',      category: 'kids',     logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/TRT_%C3%87ocuk_logo.svg/300px-TRT_%C3%87ocuk_logo.svg.png', quality: '1080p', streamUrl: 'https://tv-trtcocuk.medya.trt.com.tr/master.m3u8' },
  { id: 'ch_minikago',   name: 'Minika GO',      category: 'kids',     logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/8/87/Minika_GO_logo.png/300px-Minika_GO_logo.png', quality: '1080p', streamUrl: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/minikago/minikago.m3u8' },

  // ── MÜZİK ──
  { id: 'ch_trtmuzik',   name: 'TRT Müzik',      category: 'music',    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/TRT_M%C3%BCzik_logo.svg/300px-TRT_M%C3%BCzik_logo.svg.png', quality: '480p', streamUrl: 'https://tv-trtmuzik.medya.trt.com.tr/master_480.m3u8' },
  { id: 'ch_tempotv',    name: 'Tempo TV',       category: 'music',    logo: 'https://upload.wikimedia.org/wikipedia/tr/thumb/6/62/Tempo_TV_logo.png/300px-Tempo_TV_logo.png', quality: '720p', streamUrl: 'https://live.artidijitalmedya.com/artidijital_tempotv/tempotv/chunks.m3u8' }
];

import{_ as Le}from"./vendor-capacitor-VGCIBgSg.js";import{a1 as Te,r as M,s as _,ab as Ht}from"./index-BofF-q_g.js";import{c as Ee}from"./playerLifecycle-BycGPIoX.js";function D(r,c){const f=(r||"").replace(/ (HD|4K|TV|Kanalı)/gi,"").trim(),h=f.slice(0,5).toUpperCase(),v={"TRT 1":{bg:"linear-gradient(135deg, #b91c1c, #ef4444)",text:"#ffffff",tag:"TRT 1"},ATV:{bg:"linear-gradient(135deg, #c2410c, #f97316)",text:"#ffffff",tag:"ATV"},"SHOW TV":{bg:"linear-gradient(135deg, #6b21a8, #ec4899)",text:"#ffffff",tag:"SHOW"},"NOW TV":{bg:"linear-gradient(135deg, #991b1b, #ef4444)",text:"#ffffff",tag:"NOW"},"STAR TV":{bg:"linear-gradient(135deg, #b91c1c, #dc2626)",text:"#ffffff",tag:"STAR"},"KANAL D":{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"KANAL D"},TV8:{bg:"linear-gradient(135deg, #ea580c, #f97316)",text:"#ffffff",tag:"TV8"},"CNBC-E":{bg:"linear-gradient(135deg, #047857, #10b981)",text:"#ffffff",tag:"CNBC-E"},"A2 TV":{bg:"linear-gradient(135deg, #991b1b, #ea580c)",text:"#ffffff",tag:"A2"},"KANAL 7":{bg:"linear-gradient(135deg, #0284c7, #38bdf8)",text:"#ffffff",tag:"KANAL 7"},"BEYAZ TV":{bg:"linear-gradient(135deg, #881337, #e11d48)",text:"#ffffff",tag:"BEYAZ"},TEVE2:{bg:"linear-gradient(135deg, #ca8a04, #eab308)",text:"#000000",tag:"TEVE2"},"TV 360":{bg:"linear-gradient(135deg, #581c87, #9333ea)",text:"#ffffff",tag:"360"},"TRT HABER":{bg:"linear-gradient(135deg, #831843, #db2777)",text:"#ffffff",tag:"HABER"},"A HABER":{bg:"linear-gradient(135deg, #991b1b, #f97316)",text:"#ffffff",tag:"A HABER"},NTV:{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"NTV"},HABERTÜRK:{bg:"linear-gradient(135deg, #991b1b, #dc2626)",text:"#ffffff",tag:"HTÜRK"},"HALK TV":{bg:"linear-gradient(135deg, #b91c1c, #ef4444)",text:"#ffffff",tag:"HALK"},"S SPORT 1 HD":{bg:"linear-gradient(135deg, #065f46, #10b981)",text:"#ffffff",tag:"S SPORT 1"},"S SPORT 2 HD":{bg:"linear-gradient(135deg, #047857, #34d399)",text:"#ffffff",tag:"S SPORT 2"},"BEIN SPORTS HABER HD":{bg:"linear-gradient(135deg, #4c1d95, #7c3aed)",text:"#ffffff",tag:"BEIN HABER"},"BEIN SPORTS 3 HD":{bg:"linear-gradient(135deg, #3b0764, #6d28d9)",text:"#ffffff",tag:"BEIN 3"},"SPOR SMART 1 HD":{bg:"linear-gradient(135deg, #c2410c, #f97316)",text:"#ffffff",tag:"SMART 1"},"SPOR SMART 2 HD":{bg:"linear-gradient(135deg, #9a3412, #ea580c)",text:"#ffffff",tag:"SMART 2"},"EURO SPORT 1 HD":{bg:"linear-gradient(135deg, #1e3a8a, #2563eb)",text:"#ffffff",tag:"EURO 1"},"EURO SPORT 2 HD":{bg:"linear-gradient(135deg, #172554, #1d4ed8)",text:"#ffffff",tag:"EURO 2"},"TIVIBU SPOR 1 HD":{bg:"linear-gradient(135deg, #0284c7, #06b6d4)",text:"#ffffff",tag:"TİVİBU 1"},"TIVIBU SPOR 2 HD":{bg:"linear-gradient(135deg, #0369a1, #0284c7)",text:"#ffffff",tag:"TİVİBU 2"},"TIVIBU SPOR 3 HD":{bg:"linear-gradient(135deg, #075985, #0369a1)",text:"#ffffff",tag:"TİVİBU 3"},"FX KANALI HD":{bg:"linear-gradient(135deg, #18181b, #27272a)",text:"#fbbf24",tag:"FX"},"SINEMA TV HD":{bg:"linear-gradient(135deg, #713f12, #a16207)",text:"#fef08a",tag:"SINEMA"},"NATIONAL GEOGRAPHIC HD":{bg:"linear-gradient(135deg, #000000, #18181b)",text:"#fbbf24",tag:"NAT GEO"},"DISCOVERY CHANNEL HD":{bg:"linear-gradient(135deg, #0284c7, #06b6d4)",text:"#ffffff",tag:"DISCOVERY"},"DMAX HD":{bg:"linear-gradient(135deg, #111827, #1f2937)",text:"#38bdf8",tag:"DMAX"},"TLC HD":{bg:"linear-gradient(135deg, #831843, #db2777)",text:"#ffffff",tag:"TLC"},"CARTOON NETWORK":{bg:"linear-gradient(135deg, #000000, #27272a)",text:"#ffffff",tag:"CARTOON"},"NICKELODEON HD":{bg:"linear-gradient(135deg, #ea580c, #f97316)",text:"#ffffff",tag:"NICK"}}[f.toUpperCase()]||{bg:"linear-gradient(135deg, #1e293b, #334155)",text:"#ffffff",tag:h},s=`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${v.bg.includes("#")&&v.bg.match(/#[a-f0-9]{6}/i)?.[0]||"#1e293b"}" />
        <stop offset="100%" stop-color="${v.bg.includes("#")&&v.bg.match(/(#[a-f0-9]{6})/gi)?.[1]||"#334155"}" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#bgGrad)" stroke="rgba(255,255,255,0.18)" stroke-width="2" />
    <text x="50%" y="46%" dominant-baseline="central" text-anchor="middle" fill="${v.text}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="26" letter-spacing="1">${h}</text>
    <rect x="20" y="78" width="80" height="22" rx="11" fill="rgba(0,0,0,0.4)" />
    <text x="50%" y="89" dominant-baseline="central" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="9" letter-spacing="1.2">${v.tag}</text>
  </svg>`;return`data:image/svg+xml;utf8,${encodeURIComponent(s)}`}const qe=[{id:"all",name:"Tüm Kanallar",icon:"tv"},{id:"favorites",name:"⭐ Favorilerim",icon:"star"},{id:"national",name:"Ulusal & Sinema",icon:"home"},{id:"sports",name:"Spor",icon:"trophy"},{id:"news",name:"Haber",icon:"newspaper"},{id:"doc",name:"Belgesel",icon:"compass"},{id:"kids",name:"Çocuk",icon:"smile"},{id:"music",name:"Müzik",icon:"music"}],Ae=[{id:"ch_trt1",name:"TRT 1",category:"national",logo:"/tv-logos/trt-1.png",quality:"1080p FHD",streamUrl:"https://tv-trt1.medya.trt.com.tr/master.m3u8"},{id:"ch_atv",name:"ATV",category:"national",logo:"/tv-logos/atv.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/atv/atv_1080p.m3u8"},{id:"ch_showtv",name:"Show TV",category:"national",logo:"/tv-logos/show-tv.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/showtv/showtv.m3u8"},{id:"ch_nowtv",name:"NOW TV",category:"national",logo:"/tv-logos/now-tv.png",quality:"1080p FHD",streamUrl:"https://uycyyuuzyh.turknet.ercdn.net/nphindgytw/nowtv/nowtv.m3u8"},{id:"ch_startv",name:"Star TV",category:"national",logo:"/tv-logos/star-tv.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/startv4puhu/live.m3u8"},{id:"ch_kanald",name:"Kanal D",category:"national",logo:"/tv-logos/kanal-d.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/kanald/kanald.m3u8"},{id:"ch_tv8",name:"TV8",category:"national",logo:"/tv-logos/tv8.png",quality:"480p",streamUrl:"https://rkhubpaomb.turknet.ercdn.net/fwjkgpasof/tv8/tv8_480p.m3u8"},{id:"ch_cnbce",name:"CNBC-e",category:"national",logo:"/tv-logos/cnbc-e.png",quality:"1080p FHD",streamUrl:"https://hnpsechtsc.turknet.ercdn.net/xpnvudnlsv/cnbc-e/cnbc-e.m3u8"},{id:"ch_a2",name:"A2 TV",category:"national",logo:"/tv-logos/a2.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/a2tv/a2tv.m3u8"},{id:"ch_kanal7",name:"Kanal 7",category:"national",logo:"/tv-logos/kanal-7.png",quality:"1080p FHD",streamUrl:"https://kanal7-live.daioncdn.net/kanal7/kanal7.m3u8"},{id:"ch_beyaztv",name:"Beyaz TV",category:"national",logo:"/tv-logos/beyaz-tv.png",quality:"1080p FHD",streamUrl:"https://beyaztv-live.daioncdn.net/beyaztv/beyaztv.m3u8"},{id:"ch_teve2",name:"Teve2",category:"national",logo:"/tv-logos/teve2.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/teve2/teve2.m3u8"},{id:"ch_tv360",name:"TV 360",category:"national",logo:"/tv-logos/tv-360.png",quality:"1080p FHD",streamUrl:"https://turkmedya-live.ercdn.net/tv360/tv360.m3u8"},{id:"ch_trthaber",name:"TRT Haber",category:"news",logo:"/tv-logos/trt-haber.png",quality:"1080p FHD",streamUrl:"https://tv-trthaber.medya.trt.com.tr/master.m3u8"},{id:"ch_ahaber",name:"A Haber",category:"news",logo:"/tv-logos/a-haber.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/ahaber/ahaber.m3u8"},{id:"ch_ntv",name:"NTV",category:"news",logo:"/tv-logos/ntv.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/ntv4puhu/live.m3u8"},{id:"ch_haberturk",name:"Habertürk",category:"news",logo:"/tv-logos/haberturk.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/haberturktv/haberturktv.m3u8"},{id:"ch_halktv",name:"Halk TV",category:"news",logo:"/tv-logos/halk-tv.png",quality:"1080p FHD",streamUrl:"https://halktv-live.daioncdn.net/halktv/halktv.m3u8"},{id:"ch_tele1",name:"Tele1",category:"news",logo:"/tv-logos/tele1.png",quality:"1080p FHD",streamUrl:"https://tele1-live.ercdn.net/tele1/tele1.m3u8"},{id:"ch_tv100",name:"TV 100",category:"news",logo:"/tv-logos/tv100.png",quality:"1080p FHD",streamUrl:"https://tv.ensonhaber.com/tv100/tv100.m3u8"},{id:"ch_bloomberg",name:"Bloomberg HT",category:"news",logo:"/tv-logos/bloomberg-ht.png",quality:"1080p FHD",streamUrl:"https://rmtftbjlne.turknet.ercdn.net/bpeytmnqyp/bloomberght/bloomberght.m3u8"},{id:"ch_tv24",name:"24 TV",category:"news",logo:"/tv-logos/tv24.png",quality:"1080p FHD",streamUrl:"https://tv.ensonhaber.com/tv24/tv24.m3u8"},{id:"ch_ulketv",name:"Ülke TV",category:"news",logo:"/tv-logos/ulke-tv.png",quality:"1080p FHD",streamUrl:"https://livetv.radyotvonline.net/kanal7live/ulketv/playlist.m3u8"},{id:"ch_trtspor",name:"TRT Spor",category:"sports",logo:"/tv-logos/trt-spor.png",quality:"1080p FHD",streamUrl:"https://tv-trtspor1.medya.trt.com.tr/master.m3u8"},{id:"ch_trtspor2",name:"TRT Spor Yıldız",category:"sports",logo:"/tv-logos/trt-spor-yildiz.png",quality:"1080p FHD",streamUrl:"https://tv-trtspor2.medya.trt.com.tr/master.m3u8"},{id:"ch_aspor",name:"A Spor",category:"sports",logo:"/tv-logos/a-spor.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8"},{id:"ch_dmax",officialLiveId:"dmax",name:"DMAX HD",category:"doc",logo:"/tv-logos/dmax.png",quality:"1080p",streamUrl:"/api/live_tv_stream?channel=dmax"},{id:"ch_tlc",officialLiveId:"tlc",name:"TLC HD",category:"doc",logo:"/tv-logos/tlc.png",quality:"1080p",streamUrl:"/api/live_tv_stream?channel=tlc"},{id:"ch_trtbelgesel",name:"TRT Belgesel",category:"doc",logo:"/tv-logos/trt-belgesel.png",quality:"1080p FHD",streamUrl:"https://tv-trtbelgesel.medya.trt.com.tr/master.m3u8"},{id:"ch_tgrtbelgesel",name:"TGRT Belgesel",category:"doc",logo:D("TGRT Belgesel"),quality:"1080p FHD",streamUrl:"https://b01c02nl.mediatriple.net/videoonlylive/mtsxxkzwwuqtglive/broadcast_5fe462afc6a0e.smil/playlist.m3u8"},{id:"ch_ciftcitv",name:"Çiftçi TV",category:"doc",logo:D("Çiftçi TV"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_ciftcitv/ciftcitv/chunks.m3u8"},{id:"ch_kanalv",name:"Kanal V",category:"doc",logo:D("Kanal V"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_kanalv/kanalv/chunks.m3u8"},{id:"ch_trtcocuk",name:"TRT Çocuk",category:"kids",logo:"/tv-logos/trt-cocuk.png",quality:"1080p FHD",streamUrl:"https://tv-trtcocuk.medya.trt.com.tr/master.m3u8"},{id:"ch_minikago",name:"Minika GO",category:"kids",logo:"/tv-logos/minika-go.png",quality:"1080p FHD",streamUrl:"https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/minikago/minikago.m3u8"},{id:"ch_trtmuzik",name:"TRT Müzik",category:"music",logo:"/tv-logos/trt-muzik.png",quality:"480p",streamUrl:"https://tv-trtmuzik.medya.trt.com.tr/master_480.m3u8"},{id:"ch_kralpop",name:"Kral Pop",category:"music",logo:"/tv-logos/kral-pop.png",quality:"1080p FHD",streamUrl:"https://dygvideo.dygdigital.com/live/hls/kralpoptv/live.m3u8"},{id:"ch_powerturk",name:"Power Türk",category:"music",logo:"/tv-logos/powerturk.png",quality:"1080p FHD",streamUrl:"https://powerlive.daioncdn.net/powerturktv/powerturktv.m3u8"},{id:"ch_dreamturk",name:"Dream Türk",category:"music",logo:"/tv-logos/dream-turk.png",quality:"1080p FHD",streamUrl:"https://ackaxsqacw.turknet.ercdn.net/ozfkfbbjba/dreamturk/dreamturk.m3u8"},{id:"ch_tempotv",name:"Tempo TV",category:"music",logo:D("Tempo TV"),quality:"720p",streamUrl:"https://live.artidijitalmedya.com/artidijital_tempotv/tempotv/chunks.m3u8"}],Lt="cinepulse_epg_live_cache",ye=30*60*1e3;let A=null,ve=0,Rt=!1,rt=null;const Ce={ch_cnbce:[{start:"07:00",end:"10:00",title:"Sabah Piyasaları & Finans"},{start:"10:00",end:"14:00",title:"Piyasa Ekranı & Global Trendler"},{start:"14:00",end:"18:00",title:"Kapanışa Doğru"},{start:"18:00",end:"20:00",title:"The Simpsons"},{start:"20:00",end:"21:00",title:"Mad Men"},{start:"21:00",end:"23:00",title:"Game of Thrones Kuşağı"},{start:"23:00",end:"01:00",title:"Late Night Show"},{start:"01:00",end:"07:00",title:"Gece Finans & Belgesel"}]},ge={sports:[{start:"06:00",end:"09:00",title:"Spor Bülteni & Günün Manşetleri"},{start:"09:00",end:"12:00",title:"Maç Özetleri & Goller Kuşağı"},{start:"12:00",end:"14:00",title:"Öğle Sporu & Transfer Raporu"},{start:"14:00",end:"17:00",title:"Uluslararası Ligler & Analiz"},{start:"17:00",end:"19:00",title:"Maç Önü & Stüdyo Analizi"},{start:"19:00",end:"21:30",title:"Canlı Karşılaşma / Canlı Yayın"},{start:"21:30",end:"23:45",title:"Dev Maç Özel Yayını"},{start:"23:45",end:"02:00",title:"Son Sayfa & Tartışma Programı"},{start:"02:00",end:"06:00",title:"Gecenin Maçları (Tekrar)"}],news:[{start:"06:00",end:"09:00",title:"Güne Başlarken & Sabah Raporu"},{start:"09:00",end:"12:00",title:"Ekonomi ve Politika Gündemi"},{start:"12:00",end:"14:00",title:"Gün Ortası Bülteni"},{start:"14:00",end:"17:00",title:"Sıcak Gelişmeler & Canlı Bağlantılar"},{start:"17:00",end:"19:00",title:"Akşam Bülteni & Manşetler"},{start:"19:00",end:"20:30",title:"Ana Haber Bülteni"},{start:"20:30",end:"23:30",title:"Türkiye'nin Nabzı & Açık Oturum"},{start:"23:30",end:"01:30",title:"Gece Raporu & Dünya Basını"},{start:"01:30",end:"06:00",title:"Gece Bülteni"}],doc:[{start:"06:00",end:"09:00",title:"Vahşi Yaşamın İzinde"},{start:"09:00",end:"12:00",title:"Evrenin Gizemleri ve Uzay"},{start:"12:00",end:"15:00",title:"Mega Yapılar & Mühendislik"},{start:"15:00",end:"18:00",title:"Tarihin Bilinmeyen Sayfaları"},{start:"18:00",end:"20:00",title:"Okyanusların Derinlikleri"},{start:"20:00",end:"22:00",title:"Büyük Kediler: Hayatta Kalma"},{start:"22:00",end:"00:30",title:"Dünyanın En Gizemli Keşifleri"},{start:"00:30",end:"06:00",title:"Gece Belgesel Kuşağı"}],kids:[{start:"06:00",end:"09:00",title:"Sabah Neşesi Çizgi Filmler"},{start:"09:00",end:"12:00",title:"Eğlenceli Maceralar & Kahramanlar"},{start:"12:00",end:"15:00",title:"Sevimli Dostlar & Bilim Zamanı"},{start:"15:00",end:"18:00",title:"Süper Kahramanlar Kuşağı"},{start:"18:00",end:"20:30",title:"Akşam Aile Sineması"},{start:"20:30",end:"22:30",title:"Fantastik Çizgi Dizi"},{start:"22:30",end:"06:00",title:"Gece Masalları"}],music:[{start:"06:00",end:"10:00",title:"Güne Enerjik Başla (Top 20 Pop)"},{start:"10:00",end:"14:00",title:"Hit Müzik & Radyo Şarkıları"},{start:"14:00",end:"18:00",title:"Trendler & En Çok Dinlenenler"},{start:"18:00",end:"21:00",title:"Akşam Ritimleri & Klip Kuşağı"},{start:"21:00",end:"23:30",title:"Canlı Akustik & Popüler Klipler"},{start:"23:30",end:"02:00",title:"Gece Chill & Deep House"},{start:"02:00",end:"06:00",title:"Kesintisiz Gece Müziği"}],national:[{start:"06:00",end:"09:00",title:"Sabah Programı & Magazin"},{start:"09:00",end:"12:00",title:"Gündüz Kuşağı Programı"},{start:"12:00",end:"14:00",title:"Gün Ortası & Yemek Programı"},{start:"14:00",end:"17:00",title:"Popüler Dizi Tekrar Kuşağı"},{start:"17:00",end:"19:00",title:"Yarışma Kuşağı"},{start:"19:00",end:"20:00",title:"Akşam Ana Haber"},{start:"20:00",end:"23:30",title:"Prime Time Sinema / Dizi"},{start:"23:30",end:"02:00",title:"Gece Sineması"},{start:"02:00",end:"06:00",title:"Gece Kuşağı"}]};function fe(r){if(!r||!r.includes(":"))return 0;const[c,f]=r.split(":").map(Number);return(c||0)*60+(f||0)}function De(){try{const r=(typeof window<"u"&&window.sessionStorage?sessionStorage.getItem(Lt):null)||(typeof window<"u"&&window.localStorage?localStorage.getItem(Lt):null);if(!r)return null;const c=JSON.parse(r);if(c&&c.channels&&Date.now()-(c.updatedAt||0)<12*3600*1e3)return c.channels}catch{}return null}function He(r){try{typeof window<"u"&&window.sessionStorage&&sessionStorage.setItem(Lt,JSON.stringify({updatedAt:Date.now(),channels:r})),typeof window<"u"&&window.localStorage&&localStorage.removeItem(Lt)}catch{}}async function me(r=!1){const c=Date.now();if(!r&&A&&c-ve<ye||Rt)return A;Rt=!0;try{let f=null;try{f=await fetch("/api/epg")}catch{}if((!f||!f.ok)&&(f=await fetch("/epg-data.json")),f&&f.ok){const h=await f.json();h&&h.channels&&Object.keys(h.channels).length>0&&(A=h.channels,ve=c,He(h.channels),window.dispatchEvent(new CustomEvent("epg-updated",{detail:{count:Object.keys(h.channels).length}})))}}catch{}finally{Rt=!1}return A}function Re(){if(!A){const r=De();r&&(A=r)}me(),rt===null&&(rt=setInterval(()=>{me(!0)},ye))}function Me(){rt!==null&&(clearInterval(rt),rt=null)}function wt(r){if(!r)return{title:"Canlı Yayın",timeRange:"Canlı Akış",start:"00:00",end:"23:59",progress:50,remainingMin:30,nextTitle:"Yayın Akışı"};const c=Date.now();if(A&&A[r.id]&&A[r.id].length>0){const v=A[r.id];for(let b=0;b<v.length;b++){const p=v[b];if(c>=p.startTs&&c<p.endTs){const E=Math.max(1,(p.endTs-p.startTs)/6e4),F=Math.max(0,(c-p.startTs)/6e4),z=Math.min(100,Math.max(0,Math.round(F/E*100))),Q=Math.max(1,Math.round((p.endTs-c)/6e4)),I=v[b+1];return{title:p.title,timeRange:`${p.start} - ${p.end}`,start:p.start,end:p.end,progress:z,remainingMin:Q,nextTitle:I?I.title:"Sonraki Program"}}}const s=v.find(b=>b.startTs>c);if(s)return{title:s.title,timeRange:`${s.start} - ${s.end}`,start:s.start,end:s.end,progress:5,remainingMin:Math.max(1,Math.round((s.endTs-c)/6e4)),nextTitle:"Yayın Başlamak Üzere"}}const f=new Date,h=f.getHours()*60+f.getMinutes();let n=Ce[r.id];n||(n=ge[r.category]||ge.national);for(let v=0;v<n.length;v++){const s=n[v],b=fe(s.start);let p=fe(s.end);p<=b&&(p+=24*60);let E=h;if(b>p-24*60&&h<b&&h<p%(24*60)&&(E+=24*60),E>=b&&E<p){const F=p-b,z=E-b,Q=Math.min(100,Math.max(0,Math.round(z/F*100))),I=Math.max(1,p-E),G=n[(v+1)%n.length];return{title:s.title,timeRange:`${s.start} - ${s.end}`,start:s.start,end:s.end,progress:Q,remainingMin:I,nextTitle:G?G.title:"Sonraki Program"}}}return{title:`${r.name} Canlı Yayın`,timeRange:"Canlı Akış",start:"00:00",end:"23:59",progress:50,remainingMin:30,nextTitle:"Yayın Akışı Devam Ediyor"}}const be="cinepulse_live_favs";function he(){try{const r=localStorage.getItem(be);return r?JSON.parse(r):[]}catch{return[]}}function _e(r){try{localStorage.setItem(be,JSON.stringify(r))}catch{}}function Ue(){const r=Te(),c=[...Ae],f=r?c.filter(e=>e.category==="kids"):c;let h=r?"kids":"all",n=r?f.find(e=>e.id==="ch_trtcocuk")||f[0]:c.find(e=>e.id==="ch_trt1")||c[0],v="",s=null,b=!1,p=1,E=null,F=null;function z(e){return he().includes(e)}function Q(e){let g=he();g.includes(e)?(g=g.filter(q=>q!==e),_("Favorilerden çıkarıldı","info")):(g.push(e),_("Favorilere eklendi ⭐","success")),_e(g),Y()}function I(){return f.filter(e=>{let g=!0;h==="favorites"?g=z(e.id):h!=="all"&&(g=e.category===h);const q=!v||e.name.toLowerCase().includes(v.toLowerCase());return g&&q})}function G(e){return f.findIndex(g=>g.id===e.id)}let Y=()=>{};return{html:`
    <div class="livetv-view-full" id="livetv-root">

      <!-- TOP: Full-Width Cinematic TV Player -->
      <section class="tv-hero-player-section" id="tv-hero-player-section">
        <!-- Layout shift placeholder for smooth Floating PiP -->
        <div class="tv-screen-placeholder" id="tv-screen-placeholder"></div>

        <div class="tv-screen" id="tv-screen" tabindex="0">
          <video id="tv-video" autoplay playsinline webkit-playsinline></video>

          <!-- Floating Mini-Player (PiP) Top Bar -->
          <div class="tv-pip-header" id="tv-pip-header">
            <div class="tv-pip-meta">
              <img class="tv-pip-logo" id="tv-pip-logo" src="${n.logo}" alt="" onerror="this.onerror=null; this.src='${D(n.name,n.category)}';" />
              <div class="tv-pip-info">
                <span class="tv-pip-name" id="tv-pip-name">${n.name}</span>
                <span class="tv-pip-epg" id="tv-pip-epg">CANLI YAYIN</span>
              </div>
            </div>
            <div class="tv-pip-actions">
              <button class="tv-pip-btn tv-pip-btn-expand" id="tv-pip-expand" title="Oynatıcıya Dön">
                <i data-lucide="maximize" style="width:13px;height:13px;"></i>
              </button>
              <button class="tv-pip-btn tv-pip-btn-close" id="tv-pip-close" title="Mini Oynatıcıyı Kapat">
                <i data-lucide="x" style="width:13px;height:13px;"></i>
              </button>
            </div>
          </div>

          <!-- Backdrop Click Handler for Toggle Controls -->
          <div class="tv-screen-backdrop" id="tv-screen-backdrop"></div>

          <!-- Minimal Elegant Top Channel Badge (Logo + Name + Number + Live EPG) -->
          <div class="tv-osd-topbar" id="tv-osd-topbar">
            <div class="tv-osd-channel-meta">
              <div class="tv-osd-logo-box">
                <img id="tv-top-logo" class="tv-top-logo" src="${n.logo}" alt="" onerror="this.onerror=null; this.src='${D(n.name,n.category)}';" />
              </div>
              <div class="tv-osd-text">
                <div class="tv-osd-ch-title">
                  <span id="tv-top-name">${n.name}</span>
                  <span class="tv-osd-num-tag" id="tv-top-num">CH 01</span>
                </div>
                <div class="tv-top-epg-line" id="tv-top-epg-line">
                  <span class="tv-top-epg-badge">YAYINDA</span>
                  <span class="tv-top-epg-title" id="tv-top-epg-title">Yayın Akışı Yükleniyor...</span>
                  <span class="tv-top-epg-prog" id="tv-top-epg-prog">%0</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Big Center OSD Banner on Channel Switch -->
          <div class="tv-osd-banner hidden" id="tv-osd">
            <img id="tv-osd-logo" class="tv-osd-logo" src="" alt="" />
            <div class="tv-osd-info">
              <div class="tv-osd-name" id="tv-osd-name"></div>
              <div class="tv-osd-meta">
                <span class="tv-osd-live-dot"></span>
                <span>CANLI YAYIN</span>
                <span class="tv-osd-quality" id="tv-osd-quality"></span>
              </div>
              <div class="tv-osd-epg-sub" id="tv-osd-epg-sub"></div>
            </div>
            <div class="tv-osd-chnum" id="tv-osd-chnum"></div>
          </div>

          <!-- Loading Spinner -->
          <div class="tv-loading hidden" id="tv-loading">
            <div class="tv-loading-spinner"></div>
            <span class="tv-loading-text">Yayın bağlanıyor...</span>
          </div>

          <!-- Error State with Auto-Reconnect -->
          <div class="tv-error hidden" id="tv-error">
            <div class="tv-error-icon-box">
              <i data-lucide="radio" style="width:36px;height:36px;color:#ef4444;"></i>
            </div>
            <span class="tv-error-msg">Yayın akışı geçici olarak yanıt vermedi</span>
            <div class="tv-error-actions">
              <button class="tv-retry-btn" id="tv-retry-btn">
                <i data-lucide="refresh-cw" style="width:14px;height:14px;"></i> Tekrar Bağlan
              </button>
              <button class="tv-next-btn" id="tv-error-next-btn">Sonraki Kanala Geç</button>
            </div>
          </div>

          <!-- Spacious Sleek Bottom Control Bar -->
          <div class="tv-screen-controls" id="tv-screen-controls">
            <!-- Left: Channel Navigation & Play/Pause & Live Badge -->
            <div class="tv-ctrl-group tv-ctrl-left">
              <button class="tv-ctrl-action-btn" id="tv-btn-prev-ch" title="Önceki Kanal (P-)">
                <i data-lucide="skip-back" style="width:18px;height:18px;"></i>
              </button>
              <button class="tv-ctrl-action-btn tv-play-btn" id="tv-btn-play-pause" title="Oynat / Duraklat (Space)">
                <i data-lucide="pause" style="width:20px;height:20px;"></i>
              </button>
              <button class="tv-ctrl-action-btn" id="tv-btn-next-ch" title="Sonraki Kanal (P+)">
                <i data-lucide="skip-forward" style="width:18px;height:18px;"></i>
              </button>
              <div class="tv-live-sync-indicator" id="tv-btn-sync" title="Canlı Yayına Eşitle">
                <span class="tv-live-sync-dot"></span>
                <span>CANLI</span>
              </div>
            </div>

            <!-- Center: Volume Slider & Mute -->
            <div class="tv-volume-group">
              <button class="tv-ctrl-action-btn" id="tv-btn-mute" title="Sesi Aç/Kapat (M)">
                <i data-lucide="volume-2" style="width:18px;height:18px;"></i>
              </button>
              <div class="tv-volume-slider-box">
                <input type="range" id="tv-volume-slider" class="tv-volume-slider" min="0" max="1" step="0.05" value="1" />
              </div>
            </div>

            <!-- Right: Numpad & Quality & Reload & Fullscreen -->
            <div class="tv-ctrl-group tv-ctrl-right">
              <!-- Numpad Zapper Keypad Button -->
              <button class="tv-ctrl-action-btn tv-numpad-btn" id="tv-btn-numpad" title="Kanal Numarası Tuş Takımı">
                <i data-lucide="hash" style="width:18px;height:18px;"></i>
              </button>

              <!-- HLS Quality / Bitrate Selector Dropdown -->
              <div class="tv-quality-wrapper" id="tv-quality-wrapper">
                <button class="tv-ctrl-action-btn tv-quality-btn" id="tv-btn-quality" title="Yayın Kalitesi / Bitrate">
                  <i data-lucide="settings" style="width:17px;height:17px;"></i>
                  <span class="tv-quality-badge-text" id="tv-quality-badge">AUTO</span>
                </button>
                <div class="tv-quality-menu hidden" id="tv-quality-menu">
                  <div class="tv-quality-menu-header">
                    <i data-lucide="sliders" style="width:13px;height:13px;color:#fbbf24;"></i>
                    <span>Yayın Çözünürlüğü</span>
                  </div>
                  <div class="tv-quality-options" id="tv-quality-options">
                    <button class="tv-quality-opt active" data-level="-1">
                      <i data-lucide="check" style="width:12px;height:12px;"></i>
                      <span>Otomatik (Adaptive)</span>
                    </button>
                  </div>
                </div>
              </div>

              <button class="tv-ctrl-action-btn" id="tv-btn-reload" title="Akışı Yenile (R)">
                <i data-lucide="rotate-cw" style="width:18px;height:18px;"></i>
              </button>
              <button class="tv-ctrl-action-btn" id="tv-btn-fullscreen" title="Tam Ekran (F)">
                <i data-lucide="maximize-2" style="width:18px;height:18px;"></i>
              </button>
            </div>
          </div>

        </div>
      </section>

      <!-- Glowing Numpad HUD Banner (Keyboard 0-9 input feedback) -->
      <div class="tv-numpad-hud hidden" id="tv-numpad-hud">
        <div class="tv-numpad-hud-digits" id="tv-numpad-hud-digits">01</div>
        <div class="tv-numpad-hud-name" id="tv-numpad-hud-name">Kanal Bekleniyor...</div>
      </div>

      <!-- Floating Translucent Numpad Modal (Interactive Touch / Mouse Keypad) -->
      <div class="tv-numpad-modal hidden" id="tv-numpad-modal">
        <div class="tv-numpad-modal-backdrop" id="tv-numpad-modal-backdrop"></div>
        <div class="tv-numpad-pad">
          <div class="tv-numpad-pad-header">
            <div class="tv-numpad-display">
              <span class="tv-numpad-display-tag">KANALA ZIPLA</span>
              <span class="tv-numpad-display-val" id="tv-pad-display-val">--</span>
              <span class="tv-numpad-display-sub" id="tv-pad-display-sub">Numara tuşlayın</span>
            </div>
            <button class="tv-numpad-pad-close" id="tv-numpad-close" title="Kapat">
              <i data-lucide="x" style="width:16px;height:16px;"></i>
            </button>
          </div>
          <div class="tv-numpad-keys">
            <button class="tv-num-key" data-digit="1">1</button>
            <button class="tv-num-key" data-digit="2">2</button>
            <button class="tv-num-key" data-digit="3">3</button>
            <button class="tv-num-key" data-digit="4">4</button>
            <button class="tv-num-key" data-digit="5">5</button>
            <button class="tv-num-key" data-digit="6">6</button>
            <button class="tv-num-key" data-digit="7">7</button>
            <button class="tv-num-key" data-digit="8">8</button>
            <button class="tv-num-key" data-digit="9">9</button>
            <button class="tv-num-key tv-num-key-clear" data-digit="clear">C</button>
            <button class="tv-num-key" data-digit="0">0</button>
            <button class="tv-num-key tv-num-key-ok" data-digit="ok">ZAP ⚡</button>
          </div>
        </div>
      </div>

      <!-- BOTTOM: Channel Switcher & Full Catalog (Mobile & Desktop) -->
      <section class="tv-bottom-catalog-section">

        <!-- Controls & Filter Toolbar -->
        <div class="tv-catalog-toolbar">

          <!-- Category Navigation Pills with Arrows -->
          <div class="tv-cat-nav-container">
            <button class="tv-cat-arrow-btn tv-cat-prev" id="tv-cat-prev" type="button" title="Geri kaydır">
              <i data-lucide="chevron-left" style="width:16px;height:16px;"></i>
            </button>
            <div class="tv-catalog-categories" id="tv-category-strip">
              ${qe.map(e=>`
                <button class="tv-cat-filter-btn ${e.id===h?"active":""}" data-cat="${e.id}">
                  <i data-lucide="${e.icon}" style="width:14px;height:14px;"></i>
                  <span>${e.name}</span>
                </button>
              `).join("")}
            </div>
            <button class="tv-cat-arrow-btn tv-cat-next" id="tv-cat-next" type="button" title="İleri kaydır">
              <i data-lucide="chevron-right" style="width:16px;height:16px;"></i>
            </button>
          </div>

          <!-- Search & Counter Area -->
          <div class="tv-catalog-search-area">
            <div class="tv-catalog-search-box">
              <i data-lucide="search" class="tv-search-icon"></i>
              <input type="text" id="tv-search" class="tv-search-field" placeholder="Kanal adı ara..." />
              <button class="tv-search-clear-btn hidden" id="tv-search-clear" title="Temizle">
                <i data-lucide="x" style="width:14px;height:14px;"></i>
              </button>
            </div>
            <span class="tv-catalog-count-badge" id="tv-guide-count">73 KANAL</span>
          </div>

        </div>

        <!-- Main Channel Grid (Flows Below Video) -->
        <div class="tv-channel-grid" id="tv-channel-grid">
          <!-- Rendered dynamically -->
        </div>

      </section>

    </div>
  `,init:e=>{if(!e)return;Re();const g=Ee(),{setTimeout:q,clearTimeout:ot,setInterval:ke,clearInterval:Mt}=g,l=e.querySelector("#tv-video"),w=e.querySelector("#tv-screen"),B=e.querySelector("#tv-hero-player-section"),dt=e.querySelector("#tv-screen-placeholder"),Tt=e.querySelector("#tv-screen-backdrop");e.querySelector("#tv-osd-topbar");const J=e.querySelector("#tv-top-logo"),_t=e.querySelector("#tv-top-name"),Bt=e.querySelector("#tv-top-num"),Nt=e.querySelector("#tv-top-epg-title"),Pt=e.querySelector("#tv-top-epg-prog");e.querySelector("#tv-pip-header");const tt=e.querySelector("#tv-pip-logo"),Ot=e.querySelector("#tv-pip-name"),Ut=e.querySelector("#tv-pip-epg"),Ft=e.querySelector("#tv-pip-expand"),It=e.querySelector("#tv-pip-close"),j=e.querySelector("#tv-osd"),et=e.querySelector("#tv-osd-logo"),$t=e.querySelector("#tv-osd-name"),Kt=e.querySelector("#tv-osd-quality"),Vt=e.querySelector("#tv-osd-chnum"),zt=e.querySelector("#tv-osd-epg-sub"),at=e.querySelector("#tv-loading"),ct=e.querySelector("#tv-error"),Gt=e.querySelector("#tv-retry-btn"),Yt=e.querySelector("#tv-error-next-btn"),W=e.querySelector("#tv-btn-play-pause"),jt=e.querySelector("#tv-btn-prev-ch"),Wt=e.querySelector("#tv-btn-next-ch"),Xt=e.querySelector("#tv-btn-sync"),H=e.querySelector("#tv-btn-mute"),pt=e.querySelector("#tv-volume-slider"),ut=e.querySelector("#tv-btn-reload"),N=e.querySelector("#tv-btn-fullscreen"),Zt=e.querySelector("#tv-btn-quality"),vt=e.querySelector("#tv-quality-badge"),R=e.querySelector("#tv-quality-menu"),gt=e.querySelector("#tv-quality-options"),Qt=e.querySelector("#tv-btn-numpad"),P=e.querySelector("#tv-numpad-modal"),Jt=e.querySelector("#tv-numpad-modal-backdrop"),te=e.querySelector("#tv-numpad-close"),X=e.querySelector("#tv-pad-display-val"),Z=e.querySelector("#tv-pad-display-sub"),ft=e.querySelector("#tv-numpad-hud"),ee=e.querySelector("#tv-numpad-hud-digits"),ae=e.querySelector("#tv-numpad-hud-name"),O=e.querySelector("#tv-channel-grid"),mt=e.querySelector("#tv-search"),it=e.querySelector("#tv-search-clear"),L=e.querySelector("#tv-category-strip"),ie=e.querySelector("#tv-cat-prev"),ne=e.querySelector("#tv-cat-next"),se=e.querySelector("#tv-guide-count");function ht(){const t=G(n)+1,a=wt(n);_t&&(_t.textContent=n.name),Bt&&(Bt.textContent=`CH ${String(t).padStart(2,"0")}`),Nt&&(Nt.textContent=`${a.title} (${a.timeRange})`),Pt&&(Pt.textContent=`%${a.progress}`),J&&(J.src=n.logo,J.onerror=()=>{J.onerror=null,J.src=D(n.name,n.category)}),Ot&&(Ot.textContent=n.name),Ut&&(Ut.textContent=`${a.title} (%${a.progress})`),tt&&(tt.src=n.logo,tt.onerror=()=>{tt.onerror=null,tt.src=D(n.name,n.category)})}function le(){ht(),O&&O.querySelectorAll(".tv-grid-card").forEach(a=>{const o=a.getAttribute("data-id"),d=c.find(kt=>kt.id===o);if(!d)return;const i=wt(d),x=a.querySelector(".tv-epg-title"),u=a.querySelector(".tv-epg-time"),C=a.querySelector(".tv-epg-bar-fill"),S=a.querySelector(".tv-epg-pct");x&&x.textContent!==i.title&&(x.textContent=i.title,x.title=i.title),u&&u.textContent!==i.timeRange&&(u.textContent=i.timeRange),C&&(C.style.width=`${i.progress}%`),S&&S.textContent!==`%${i.progress}`&&(S.textContent=`%${i.progress}`)})}const Et=()=>{le()};g.on(window,"epg-updated",Et);let re=ke(()=>{if(!document.body.contains(e)){Mt(re),window.removeEventListener("epg-updated",Et);return}le()},2e4);function xe(){F&&ot(F);const t=G(n),a=wt(n);et&&(et.src=n.logo,et.onerror=()=>{et.onerror=null,et.src=D(n.name,n.category)}),$t&&($t.textContent=n.name),Kt&&(Kt.textContent=n.quality),Vt&&(Vt.textContent=String(t+1).padStart(2,"0")),zt&&(zt.textContent=`📺 ${a.title} • %${a.progress} tamamlandı`),j.classList.remove("hidden"),j.classList.add("tv-osd-show"),F=q(()=>{j.classList.remove("tv-osd-show"),j.classList.add("tv-osd-hide"),q(()=>{j.classList.add("hidden"),j.classList.remove("tv-osd-hide")},350)},2500)}function yt(){w.classList.add("user-active"),E&&ot(E),E=q(()=>{w.classList.remove("user-active"),R&&R.classList.add("hidden")},3500)}w.addEventListener("mousemove",yt),w.addEventListener("touchstart",yt,{passive:!0}),Tt&&(Tt.addEventListener("click",t=>{t.stopPropagation(),w.classList.contains("user-active")?(w.classList.remove("user-active"),E&&ot(E),R&&R.classList.add("hidden")):yt()}),Tt.addEventListener("dblclick",t=>{t.stopPropagation(),N&&N.click()}));function nt(t){t=Math.max(0,Math.min(1,t)),p=t,l.volume=t,pt&&(pt.value=t),t===0?(b=!0,l.muted=!0,H&&(H.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>')):(b=!1,l.muted=!1,H&&(H.innerHTML='<i data-lucide="volume-2" style="width:18px;height:18px;"></i>')),M()}pt&&pt.addEventListener("input",t=>{nt(parseFloat(t.target.value))}),H&&H.addEventListener("click",t=>{t.stopPropagation(),b?(nt(p||.8),_("Ses açıldı","info")):(l.muted=!0,b=!0,H.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>',M(),_("Sessize alındı","info"))}),W&&W.addEventListener("click",t=>{t.stopPropagation(),l.paused?(l.play(),W.innerHTML='<i data-lucide="pause" style="width:18px;height:18px;"></i>'):(l.pause(),W.innerHTML='<i data-lucide="play" style="width:18px;height:18px;"></i>'),M()}),Xt&&Xt.addEventListener("click",t=>{t.stopPropagation(),s&&l.seekable&&l.seekable.length>0?(l.currentTime=l.seekable.end(l.seekable.length-1),l.play(),_("Canlı yayına eşitlendi","info")):$(n)});function qt(t){if(!gt||!vt)return;if(!t||!t.levels||t.levels.length<=1){vt.textContent=n.quality?n.quality.split(" ")[0]:"HD",gt.innerHTML=`
            <button class="tv-quality-opt active" data-level="-1">
              <i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>
              <span>Kaynak Kalite (${n.quality||"1080p"})</span>
            </button>
          `,M();return}const a=t.levels,o=t.currentLevel;let d=`
          <button class="tv-quality-opt ${o===-1?"active":""}" data-level="-1">
            ${o===-1?'<i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
            <span>Otomatik (Adaptive)</span>
          </button>
        `;if(a.forEach((i,x)=>{const u=i.height||(i.attrs&&i.attrs.RESOLUTION?i.attrs.RESOLUTION.height:720),C=u>=1080?"1080p FHD":u>=720?"720p HD":u>=480?"480p SD":`${u}p`,S=o===x;d+=`
            <button class="tv-quality-opt ${S?"active":""}" data-level="${x}">
              ${S?'<i data-lucide="check" style="width:13px;height:13px;color:#fbbf24;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
              <span>${C}</span>
            </button>
          `}),gt.innerHTML=d,o===-1)vt.textContent="AUTO";else if(a[o]){const i=a[o].height;vt.textContent=i?`${i}p`:"HD"}gt.querySelectorAll(".tv-quality-opt").forEach(i=>{i.addEventListener("click",x=>{x.stopPropagation();const u=parseInt(i.dataset.level,10);if(s){s.currentLevel=u,qt(s),R&&R.classList.add("hidden");const C=i.querySelector("span").textContent;_(`Kalite ayarlandı: ${C}`,"success")}})}),M()}Zt&&R&&(Zt.addEventListener("click",t=>{t.stopPropagation(),R.classList.toggle("hidden"),yt()}),g.on(document,"click",t=>{t.target.closest("#tv-quality-wrapper")||R.classList.add("hidden")}));let bt=!1;function oe(){if(!B||!dt||!w||document.fullscreenElement)return;const a=B.getBoundingClientRect().bottom<80;a&&l&&!l.paused&&!bt?w.classList.contains("is-floating-pip")||(w.classList.add("is-floating-pip"),dt.classList.add("is-active"),ht()):a||w.classList.contains("is-floating-pip")&&(w.classList.remove("is-floating-pip"),dt.classList.remove("is-active"),bt=!1)}g.on(window,"scroll",oe,{passive:!0}),Ft&&Ft.addEventListener("click",t=>{t.stopPropagation(),B&&B.scrollIntoView({behavior:"smooth",block:"start"})}),It&&It.addEventListener("click",t=>{t.stopPropagation(),bt=!0,w.classList.remove("is-floating-pip"),dt.classList.remove("is-active")});let k="",At=null;function Ct(t){if(t>=0&&t<c.length){const a=c[t];_(`Kanal ${t+1}: ${a.name}`,"info"),$(a),B&&B.scrollIntoView({behavior:"smooth",block:"start"})}else _(`Kanal ${t+1} bulunamadı`,"warning");k="",ft&&ft.classList.add("hidden"),P&&P.classList.add("hidden")}function de(){if(!ft||!ee||!ae)return;const t=parseInt(k,10),a=c[t-1];ee.textContent=k.padStart(2,"0"),ae.textContent=a?a.name:"Geçersiz Kanal",ft.classList.remove("hidden"),X&&(X.textContent=k.padStart(2,"0")),Z&&(Z.textContent=a?a.name:"Geçersiz Kanal"),At&&ot(At),At=q(()=>{k&&Ct(t-1)},1300)}Qt&&P&&Qt.addEventListener("click",t=>{t.stopPropagation(),k="",X&&(X.textContent="--"),Z&&(Z.textContent="Numara tuşlayın"),P.classList.toggle("hidden")}),te&&te.addEventListener("click",()=>{P.classList.add("hidden"),k=""}),Jt&&Jt.addEventListener("click",()=>{P.classList.add("hidden"),k=""}),P&&P.querySelectorAll(".tv-num-key").forEach(t=>{t.addEventListener("click",a=>{a.stopPropagation();const o=t.dataset.digit;if(o==="clear")k="",X&&(X.textContent="--"),Z&&(Z.textContent="Numara tuşlayın");else if(o==="ok"){if(k){const d=parseInt(k,10);Ct(d-1)}}else k.length>=2&&(k=""),k+=o,de()})});let T=0;async function $(t){const a=++T;if(n=t,bt=!1,ht(),xe(),we(),s){try{s.stopLoad(),s.detachMedia(),s.destroy()}catch{}s=null}if(l)try{l.pause(),l.removeAttribute("src"),l.load()}catch{}at.classList.remove("hidden"),ct.classList.add("hidden");const o=()=>{T===a&&(at.classList.add("hidden"),ct.classList.add("hidden"))};l.addEventListener("loadeddata",o,{once:!0}),q(()=>{l.removeEventListener("loadeddata",o),T===a&&l.readyState<2&&S()},2e4);let d=0,i=0,x=!1,u=!1;async function C(m,y=!0){if(!t.officialLiveId||y&&d>=2)return!1;y&&(d+=1),at.classList.remove("hidden"),ct.classList.add("hidden");try{const U=Ht(`/api/live_tv_stream?channel=${encodeURIComponent(t.officialLiveId)}&json=1&refresh=1&_=${Date.now()}`),V=await fetch(U,{cache:"no-store",headers:{Accept:"application/json"}});if(!V.ok)throw new Error(`Live resolver ${V.status}`);const lt=await V.json(),ue=lt?.proxiedUrl||lt?.url||"",St=ue?Ht(ue):"";if(!St)throw new Error("Live stream URL missing");if(t.streamUrl=St,St!==m||y)return xt(St),!0}catch{}return!1}function S(){T===a&&(at.classList.add("hidden"),ct.classList.remove("hidden"))}function kt(m){if(x||!/^https?:\/\//i.test(m))return!1;x=!0;const y=`${new URL(m).origin}/`,U=`/api/hls_proxy?url=${encodeURIComponent(m)}&ref=${encodeURIComponent(y)}`;return t.streamUrl=U,xt(U),!0}function xt(m){if(T===a)if(m=Ht(m),K.isSupported()){if(s){try{s.stopLoad(),s.detachMedia(),s.destroy()}catch{}s=null}const y=new K({enableWorker:!0,lowLatencyMode:!0,startLevel:0,capLevelToPlayerSize:!0,backBufferLength:10,maxBufferLength:8,maxMaxBufferLength:15,liveSyncDurationCount:2,liveMaxLatencyDurationCount:5,manifestLoadingTimeOut:12e3,manifestLoadingMaxRetry:1,manifestLoadingRetryDelay:350,levelLoadingTimeOut:14e3,levelLoadingMaxRetry:1,fragLoadingTimeOut:12e3});s=y,y.loadSource(m),y.attachMedia(l),y.on(K.Events.MANIFEST_PARSED,()=>{if(T!==a){try{y.stopLoad(),y.detachMedia(),y.destroy()}catch{}return}qt(y),l.play().catch(()=>{})}),y.on(K.Events.ERROR,(U,V)=>{if(!(T!==a||s!==y)&&V.fatal)if(V.type===K.ErrorTypes.NETWORK_ERROR)t.officialLiveId?C(m).then(lt=>{lt||S()}):i<1?(i+=1,at.classList.remove("hidden"),q(()=>{T===a&&s===y&&xt(m)},700)):kt(m)||S();else if(V.type===K.ErrorTypes.MEDIA_ERROR)if(u)S();else{u=!0;try{y.recoverMediaError()}catch{S()}}else S()})}else l.canPlayType("application/vnd.apple.mpegurl")?(l.src=m,l.addEventListener("loadedmetadata",()=>{T===a&&(qt(null),l.play().catch(()=>{}))},{once:!0}),l.addEventListener("error",()=>{T===a&&(kt(m)||S())},{once:!0})):S()}let K;try{K=(await Le(async()=>{const{default:m}=await import("./vendor-hls-BuERnqCp.js");return{default:m}},[],import.meta.url)).default}catch{S();return}T===a&&(t.officialLiveId?C("",!0).then(m=>{m||T!==a||C("",!0).then(y=>{!y&&T===a&&S()})}):xt(t.streamUrl),l.muted=b,l.volume=p)}function st(t){const a=I();if(a.length===0)return;const o=a.findIndex(i=>i.id===n.id);let d;t==="prev"||t==="up"?d=o<=0?a.length-1:o-1:d=o>=a.length-1?0:o+1,$(a[d])}jt&&jt.addEventListener("click",t=>{t.stopPropagation(),st("prev")}),Wt&&Wt.addEventListener("click",t=>{t.stopPropagation(),st("next")}),Yt&&Yt.addEventListener("click",()=>st("next")),Gt&&Gt.addEventListener("click",()=>$(n)),ut&&ut.addEventListener("click",()=>{_("Yayın yeniden yükleniyor...","info"),$(n)});function Se(){const t=I();if(se&&(se.textContent=`${t.length} KANAL`),t.length===0){O.innerHTML=`
            <div class="tv-catalog-empty-state">
              <i data-lucide="radio" style="width:40px;height:40px;color:var(--text-muted);"></i>
              <span class="tv-empty-title">Kanal Bulunamadı</span>
              <p class="tv-empty-sub">Arama teriminizi veya kategori filtrenizi değiştirin.</p>
            </div>
          `,M();return}O.innerHTML=t.map(a=>{const o=a.id===n.id,d=z(a.id),i=G(a)+1,x=D(a.name,a.category),u=wt(a);return`
            <div class="tv-grid-card ${o?"active":""}" data-id="${a.id}">
              <div class="tv-grid-card-top">
                <span class="tv-grid-num">${String(i).padStart(2,"0")}</span>
                <button class="tv-grid-fav-btn ${d?"is-fav":""}" data-favid="${a.id}" title="${d?"Favorilerden Çıkar":"Favorilere Ekle"}">
                  <i data-lucide="star" style="width:15px;height:15px;${d?"fill:#fbbf24;color:#fbbf24;":""}"></i>
                </button>
              </div>

              <div class="tv-grid-logo-box">
                <img class="tv-grid-logo" src="${a.logo}" alt="${a.name}" onerror="this.onerror=null; this.src='${x}';" loading="lazy" />
              </div>

              <div class="tv-grid-info">
                <span class="tv-grid-name" title="${a.name}">${a.name}</span>
                <div class="tv-grid-meta">
                  <span class="tv-grid-quality">${a.quality}</span>
                </div>
              </div>

              <!-- Real-Time EPG Schedule Progress -->
              <div class="tv-grid-epg">
                <div class="tv-epg-header">
                  <span class="tv-epg-title" title="${u.title}">${u.title}</span>
                  <span class="tv-epg-time">${u.timeRange}</span>
                </div>
                <div class="tv-epg-bar">
                  <div class="tv-epg-fill" style="width: ${u.progress}%"></div>
                </div>
                <div class="tv-epg-footer">
                  <span class="tv-epg-pct">%${u.progress} tamamlandı</span>
                  <span class="tv-epg-rem">${u.remainingMin} dk kaldı</span>
                </div>
              </div>

              ${o?'<div class="tv-grid-live-indicator"><span class="tv-live-dot"></span> <span>ŞU AN İZLENİYOR</span></div>':""}
            </div>
          `}).join(""),O.querySelectorAll(".tv-grid-card").forEach(a=>{a.addEventListener("click",o=>{if(o.target.closest(".tv-grid-fav-btn"))return;const d=c.find(i=>i.id===a.dataset.id);d&&d.id!==n.id&&($(d),B&&B.scrollIntoView({behavior:"smooth",block:"start"}))})}),O.querySelectorAll(".tv-grid-fav-btn").forEach(a=>{a.addEventListener("click",o=>{o.stopPropagation(),Q(a.dataset.favid)})}),M()}function we(){O&&O.querySelectorAll(".tv-grid-card").forEach(t=>{const a=t.dataset.id===n.id;t.classList.toggle("active",a);const o=t.querySelector(".tv-grid-live-indicator");if(!a&&o&&o.remove(),a&&!o){const d=document.createElement("div");d.className="tv-grid-live-indicator",d.innerHTML='<span class="tv-live-dot"></span><span>ŞU AN İZLENİYOR</span>',t.appendChild(d)}})}if(Y=()=>{Se(),ht(),M()},mt&&mt.addEventListener("input",t=>{v=t.target.value.trim(),it&&it.classList.toggle("hidden",!v),Y()}),it&&it.addEventListener("click",()=>{mt.value="",v="",it.classList.add("hidden"),Y()}),L){ie&&ie.addEventListener("click",i=>{i.stopPropagation(),L.scrollBy({left:-220,behavior:"smooth"})}),ne&&ne.addEventListener("click",i=>{i.stopPropagation(),L.scrollBy({left:220,behavior:"smooth"})}),L.addEventListener("wheel",i=>{Math.abs(i.deltaY)>Math.abs(i.deltaX)&&(i.preventDefault(),L.scrollLeft+=i.deltaY)},{passive:!1});let t=!1,a=0,o=0,d=!1;L.addEventListener("mousedown",i=>{i.button===0&&(t=!0,d=!1,a=i.pageX-L.offsetLeft,o=L.scrollLeft)}),g.on(window,"mousemove",i=>{if(!t)return;const u=(i.pageX-L.offsetLeft-a)*1.5;Math.abs(u)>6&&(d=!0,L.classList.add("is-dragging")),L.scrollLeft=o-u}),g.on(window,"mouseup",()=>{t&&(t=!1,L.classList.remove("is-dragging"),q(()=>{d=!1},50))}),L.querySelectorAll(".tv-cat-filter-btn").forEach(i=>{i.addEventListener("click",x=>{if(d){x.preventDefault();return}L.querySelectorAll(".tv-cat-filter-btn").forEach(u=>u.classList.remove("active")),i.classList.add("active"),h=i.dataset.cat,i.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"}),Y()})})}N&&N.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen().catch(()=>{}):w.requestFullscreen().catch(()=>{})}),g.on(document,"fullscreenchange",()=>{const t=!!document.fullscreenElement;w.classList.toggle("is-fullscreen",t),N&&(N.innerHTML=t?'<i data-lucide="minimize-2" style="width:18px;height:18px;"></i>':'<i data-lucide="maximize-2" style="width:18px;height:18px;"></i>',M())});function ce(t){if(document.activeElement!==mt){if(t.key>="0"&&t.key<="9"){k.length>=2&&(k=""),k+=t.key,de();return}if(t.key==="Enter"&&k){t.preventDefault();const a=parseInt(k,10);Ct(a-1);return}switch(t.key){case"ArrowUp":case"w":case"W":t.preventDefault(),st("prev");break;case"ArrowDown":case"s":case"S":t.preventDefault(),st("next");break;case"ArrowRight":t.preventDefault(),nt(p+.05);break;case"ArrowLeft":t.preventDefault(),nt(p-.05);break;case"m":case"M":H&&H.click();break;case"f":case"F":N&&N.click();break;case"r":case"R":ut&&ut.click();break;case" ":t.preventDefault(),W&&W.click();break}}}g.on(document,"keydown",ce);const pe=()=>{if(g.dispose(),Me(),T++,Mt(re),window.removeEventListener("epg-updated",Et),window.removeEventListener("scroll",oe),s){try{s.stopLoad(),s.detachMedia(),s.destroy()}catch{}s=null}if(l)try{l.pause(),l.removeAttribute("src"),l.load()}catch{}document.removeEventListener("keydown",ce)};window.__LiveTvController={cleanup:pe};const Dt=new MutationObserver(()=>{document.contains(e)||(pe(),Dt.disconnect())});Dt.observe(document.body,{childList:!0,subtree:!0}),g.add(()=>Dt.disconnect()),Y(),$(n),nt(1)}}}export{Ue as renderLiveTvView};

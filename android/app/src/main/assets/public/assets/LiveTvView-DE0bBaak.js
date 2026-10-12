import{_ as bi}from"./vendor-capacitor-DGWR5Llo.js";import{disposeLiveMedia as wi}from"./livePlayback-BJC2dwwA.js";import"./vendor-hls-BuERnqCp.js";import{a1 as Li,r as M,s as A,ac as Lt,ad as xt}from"./index-BX5i0L1a.js";import{c as xi}from"./playerLifecycle-BycGPIoX.js";import{LIVE_TV_CHANNELS as ki,getChannelBadgeSvg as X,LIVE_TV_CATEGORIES as Si}from"./liveTvChannels-CN5dBfDt.js";import{normalizeCanliName as Xe}from"./canliTvChannels-DiSJZP2N.js";import{getAllCachedSources as Ei,buildChannels as qi,probeLiveSources as Ci,probeChannels as $i}from"./turkishLiveSources-Bz_URic9.js";import{resolveLocalLogo as Je,sortByPopularity as Ti}from"./iptvOrgChannels-BwqVzOlp.js";import{initEpgService as Ai,getChannelEpg as Ht,stopEpgService as _i}from"./epgService-B-QzlaYS.js";import{getTsBaseIdx as Pi,getTsBases as Ri,setPreferredSourceKey as ti,getAltSources as Ii,getPreferredSourceKey as Mi,getRelayOrigin as ei,setRelayOrigin as Bi,setTsBaseIdx as Ni}from"./xtreamAltSources-CwLXZmud.js";import"./_liveSources-CyTpcGzT.js";const ai="cinepulse_live_favs";function ii(){try{const C=localStorage.getItem(ai);return C?JSON.parse(C):[]}catch{return[]}}function Di(C){try{localStorage.setItem(ai,JSON.stringify(C))}catch{}}function E(C){return String(C??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Xi(){const C=Li();function Ut(e){let o=String(e||"");const h=/[?&]url=([^&]+)/.exec(o);if(h)try{o=decodeURIComponent(h[1])}catch{}return/\.m3u8(\?|$)/i.test(o)?!1:/\.(ts|mp4|m4v|mov|flv)(\?|$)/i.test(o)?!0:!/\.[a-z0-9]{2,4}(\?|$)/i.test(o)}function si(e,o){const h=o&&o.ref?String(o.ref):"";if(/^https?:\/\//i.test(h))return h;try{return e.includes("trt")?"https://www.trt1.com.tr/":e.includes("atv")?"https://www.atv.com.tr/":e.includes("showtv")?"https://www.showtv.com.tr/":e.includes("kanald")||e.includes("teve2")||e.includes("dreamturk")?"https://www.kanald.com.tr/":e.includes("startv")||e.includes("ntv")||e.includes("kralpop")?"https://www.startv.com.tr/":e.includes("nowtv")?"https://www.nowtv.com.tr/":e.includes("tv8")?"https://www.tv8.com.tr/":e.includes("dmax")?"https://www.dmax.com.tr/":e.includes("tlc")?"https://www.tlctv.com.tr/":`${new URL(e).origin}/`}catch{return""}}function kt(e,o){if(!e)return"";if(e.startsWith("/api/")||e.startsWith("http://localhost")||e.startsWith("http://127.0.0.1"))return Lt()?xt(e):e;const h=si(e,o),L=[],at=o&&o.ua?String(o.ua):"",ct=o&&o.origin?String(o.origin):"";at&&L.push(`&ua=${encodeURIComponent(at)}`),ct&&L.push(`&origin=${encodeURIComponent(ct)}`);const u=`/api/hls_proxy?url=${encodeURIComponent(e)}&ref=${encodeURIComponent(h)}&live=1${L.join("")}`;return Lt()?xt(u):u}const se=(ki||[]).map(e=>({...e,streamUrl:kt(e.streamUrl),logo:Je(e.name)||e.logo||X(e.name,e.category)})),ni=new Set(se.map(e=>Xe(e.name))),ne=e=>qi(e,{resolveLogo:Je}).filter(o=>!ni.has(Xe(o.name))).map(o=>({...o,logo:o.logo||X(o.name,o.category),streamUrl:kt(o.streamUrl,o.headers)})),re=ne(Ei()),Ot=e=>!C||e.category==="kids",y=[...se.filter(Ot),...re.filter(Ot)],oe="cp_live_health_v1",ri=6*60*60*1e3,le=36,St=new Set;let Kt=!1;const Et=e=>e&&St.has(e.streamUrl)?1:0,oi={id:"ctv_loading",name:"Kanallar yükleniyor...",logo:"",category:"canlitv",streamUrl:"",quality:"HD"},li=[...Si,{id:"canlitv",name:"CanlıTV",icon:"radio-tower"}],H=C?y.filter(e=>e.category==="kids"):y;let J=C?"kids":"all",r=H[0]||{...oi},it="",U=null,Ft=null,tt=!1,lt=1,dt=null,Yt=null;function de(e){return ii().includes(e)}function di(e){let o=ii();o.includes(e)?(o=o.filter(h=>h!==e),A("Favorilerden çıkarıldı","info")):(o.push(e),A("Favorilere eklendi ⭐","success")),Di(o),O()}function ce(){const e=H.filter(h=>{let L=!0;J==="favorites"?L=de(h.id):J!=="all"&&(L=h.category===J);const at=!it||h.name.toLowerCase().includes(it.toLowerCase());return L&&at}),o=J==="all"?Ti(e):e;return St.size?o.slice().sort((h,L)=>Et(h)-Et(L)):o}function zt(e){return H.findIndex(o=>o.id===e.id)}let O=()=>{};return{html:`
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
              <img class="tv-pip-logo" id="tv-pip-logo" src="${E(r.logo)}" alt="" onerror="this.onerror=null; this.src='${X(r.name,r.category)}';" />
              <div class="tv-pip-info">
                <span class="tv-pip-name" id="tv-pip-name">${E(r.name)}</span>
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
                <img id="tv-top-logo" class="tv-top-logo" src="${E(r.logo)}" alt="" onerror="this.onerror=null; this.src='${X(r.name,r.category)}';" />
              </div>
              <div class="tv-osd-text">
                <div class="tv-osd-ch-title">
                  <span id="tv-top-name">${E(r.name)}</span>
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
                    <i data-lucide="sliders" style="width:13px;height:13px;color:#dfff76;"></i>
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

              <!-- Alternatif Kaynak Seçici (aynı kanal, birden fazla panel) -->
              <div class="tv-quality-wrapper" id="tv-source-wrapper">
                <button class="tv-ctrl-action-btn tv-quality-btn" id="tv-btn-source" title="Alternatif Kaynak Seç">
                  <i data-lucide="layers" style="width:17px;height:17px;"></i>
                  <span class="tv-quality-badge-text" id="tv-source-badge">SRC 1</span>
                </button>
                <div class="tv-quality-menu hidden" id="tv-source-menu">
                  <div class="tv-quality-menu-header">
                    <i data-lucide="layers" style="width:13px;height:13px;color:#38bdf8;"></i>
                    <span>Yayın Kaynağı</span>
                  </div>
                  <div class="tv-quality-options" id="tv-source-options"></div>
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
              ${li.map(e=>`
                <button class="tv-cat-filter-btn ${e.id===J?"active":""}" data-cat="${e.id}">
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
  `,init:e=>{if(!e)return;Ai();const o=xi(),{setTimeout:h,clearTimeout:L,setInterval:at,clearInterval:ct}=o,u=e.querySelector("#tv-video"),x=e.querySelector("#tv-screen"),V=e.querySelector("#tv-hero-player-section"),qt=e.querySelector("#tv-screen-placeholder"),Vt=e.querySelector("#tv-screen-backdrop");e.querySelector("#tv-osd-topbar");const ut=e.querySelector("#tv-top-logo"),ue=e.querySelector("#tv-top-name"),pe=e.querySelector("#tv-top-num"),ve=e.querySelector("#tv-top-epg-title"),fe=e.querySelector("#tv-top-epg-prog");e.querySelector("#tv-pip-header");const pt=e.querySelector("#tv-pip-logo"),me=e.querySelector("#tv-pip-name"),ye=e.querySelector("#tv-pip-epg"),ge=e.querySelector("#tv-pip-expand"),he=e.querySelector("#tv-pip-close"),st=e.querySelector("#tv-osd"),vt=e.querySelector("#tv-osd-logo"),be=e.querySelector("#tv-osd-name"),we=e.querySelector("#tv-osd-quality"),Le=e.querySelector("#tv-osd-chnum"),xe=e.querySelector("#tv-osd-epg-sub"),G=e.querySelector("#tv-loading"),K=e.querySelector("#tv-error"),ke=e.querySelector("#tv-retry-btn"),Se=e.querySelector("#tv-error-next-btn"),j=e.querySelector("#tv-btn-play-pause"),Ee=e.querySelector("#tv-btn-prev-ch"),qe=e.querySelector("#tv-btn-next-ch"),Ce=e.querySelector("#tv-btn-sync"),q=e.querySelector("#tv-btn-mute"),Ct=e.querySelector("#tv-volume-slider"),$t=e.querySelector("#tv-btn-reload"),W=e.querySelector("#tv-btn-fullscreen"),$e=e.querySelector("#tv-btn-quality"),Tt=e.querySelector("#tv-quality-badge"),F=e.querySelector("#tv-quality-menu"),At=e.querySelector("#tv-quality-options"),Te=e.querySelector("#tv-btn-source"),Gt=e.querySelector("#tv-source-badge"),_=e.querySelector("#tv-source-menu"),_t=e.querySelector("#tv-source-options"),Ae=e.querySelector("#tv-source-wrapper");let k=[],$=0;const ft=new Map;function _e(t){const a=Ii(t),i=t.isTs===!0||Ut(t.streamUrl),s=(t.altStreams||[]).map((S,I)=>({key:`alt_${I}`,label:`Yedek Yayın ${I+1}`,url:kt(S.url,S.headers),isTs:S.isTs===!0||Ut(S.url)}));k=[{key:"default",label:`Varsayılan Yayın (${t.quality||"HD"})`,url:t.streamUrl,isTs:i,isDefault:!0},...a,...s];const n=Mi(t.id),p=n?k.findIndex(S=>S.key===n):-1,v=a.length>0;Ae&&(Ae.style.display=v?"":"none"),$=p>=0?p:0,jt()}function jt(){if(!_t||!Gt)return;Gt&&(Gt.textContent=k.length>1?`SRC ${$+1}/${k.length}`:"SRC 1"),_t.innerHTML=k.map((a,i)=>`
          <button class="tv-quality-opt ${i===$?"active":""}" data-src="${i}">
            ${i===$?'<i data-lucide="check" style="width:12px;height:12px;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
            <span>${E(a.label)}</span>
          </button>
        `).join("")+`
          <button class="tv-quality-opt" data-relay="1" title="Panel kaynakları için ev relay adresi">
            <span style="width:13px;display:inline-block;">🔧</span>
            <span>Relay: ${ei()?"✅ ayarlı":"❌ yok (dokun)"}</span>
          </button>
        `,_t.querySelectorAll("[data-src]").forEach(a=>{a.addEventListener("click",i=>{i.stopPropagation();const s=parseInt(a.dataset.src,10);s!==$&&(ti(r.id,k[s].key),B(r,s),A(`Kaynak değişti: ${k[s].label}`,"success")),_&&_.classList.add("hidden")})});const t=_t.querySelector("[data-relay]");t&&t.addEventListener("click",a=>{a.stopPropagation();const i=ei(),s=window.prompt("Ev relay adresi (cloudflared https URL):",i||"https://");s!==null&&(Bi(s),A(s.trim()?`Relay kaydedildi: ${s.trim()}`:"Relay temizlendi","success"),B(r),_&&_.classList.add("hidden"))}),M()}Te&&_&&(Te.addEventListener("click",t=>{t.stopPropagation(),_.classList.toggle("hidden"),yt()}),o.on(document,"click",t=>{t.target.closest("#tv-source-wrapper")||_.classList.add("hidden")}));const Pe=e.querySelector("#tv-btn-numpad"),Z=e.querySelector("#tv-numpad-modal"),Re=e.querySelector("#tv-numpad-modal-backdrop"),Ie=e.querySelector("#tv-numpad-close"),nt=e.querySelector("#tv-pad-display-val"),rt=e.querySelector("#tv-pad-display-sub"),Pt=e.querySelector("#tv-numpad-hud"),Me=e.querySelector("#tv-numpad-hud-digits"),Be=e.querySelector("#tv-numpad-hud-name"),Y=e.querySelector("#tv-channel-grid"),Rt=e.querySelector("#tv-search"),mt=e.querySelector("#tv-search-clear"),T=e.querySelector("#tv-category-strip"),Ne=e.querySelector("#tv-cat-prev"),De=e.querySelector("#tv-cat-next"),He=e.querySelector("#tv-guide-count");function It(t){if(!t||/^https?:\/\//i.test(t))return t;if(Lt())return xt(t);if(typeof window<"u"){const a=window.location?.hostname||"";if(a==="localhost"||a==="127.0.0.1")return t}return xt(t)}function Mt(){const t=zt(r)+1,a=Ht(r);ue&&(ue.textContent=r.name),pe&&(pe.textContent=`CH ${String(t).padStart(2,"0")}`),ve&&(ve.textContent=`${a.title} (${a.timeRange})`),fe&&(fe.textContent=`%${a.progress}`),ut&&(ut.src=r.logo,ut.onerror=()=>{ut.onerror=null,ut.src=X(r.name,r.category)}),me&&(me.textContent=r.name),ye&&(ye.textContent=`${a.title} (%${a.progress})`),pt&&(pt.src=r.logo,pt.onerror=()=>{pt.onerror=null,pt.src=X(r.name,r.category)})}function Ue(){Mt(),Y&&Y.querySelectorAll(".tv-grid-card").forEach(a=>{const i=a.getAttribute("data-id"),s=y.find(Nt=>Nt.id===i);if(!s)return;const n=Ht(s),p=a.querySelector(".tv-epg-title"),v=a.querySelector(".tv-epg-time"),S=a.querySelector(".tv-epg-bar-fill"),I=a.querySelector(".tv-epg-pct");p&&p.textContent!==n.title&&(p.textContent=n.title,p.title=n.title),v&&v.textContent!==n.timeRange&&(v.textContent=n.timeRange),S&&(S.style.width=`${n.progress}%`),I&&I.textContent!==`%${n.progress}`&&(I.textContent=`%${n.progress}`)})}const Wt=()=>{Ue()};o.on(window,"epg-updated",Wt);let Oe=at(()=>{if(!document.body.contains(e)){ct(Oe),window.removeEventListener("epg-updated",Wt);return}Ue()},2e4);function ci(){Yt&&L(Yt);const t=zt(r),a=Ht(r);vt&&(vt.src=r.logo,vt.onerror=()=>{vt.onerror=null,vt.src=X(r.name,r.category)}),be&&(be.textContent=r.name),we&&(we.textContent=r.quality),Le&&(Le.textContent=String(t+1).padStart(2,"0")),xe&&(xe.textContent=`📺 ${a.title} • %${a.progress} tamamlandı`),st.classList.remove("hidden"),st.classList.add("tv-osd-show"),Yt=h(()=>{st.classList.remove("tv-osd-show"),st.classList.add("tv-osd-hide"),h(()=>{st.classList.add("hidden"),st.classList.remove("tv-osd-hide")},350)},2500)}function yt(){x.classList.add("user-active"),dt&&L(dt),dt=h(()=>{x.classList.remove("user-active"),F&&F.classList.add("hidden"),typeof _<"u"&&_&&_.classList.add("hidden")},3500)}x.addEventListener("mousemove",yt),x.addEventListener("touchstart",yt,{passive:!0}),Vt&&(Vt.addEventListener("click",t=>{t.stopPropagation(),x.classList.contains("user-active")?(x.classList.remove("user-active"),dt&&L(dt),F&&F.classList.add("hidden"),typeof _<"u"&&_&&_.classList.add("hidden")):yt()}),Vt.addEventListener("dblclick",t=>{t.stopPropagation(),W&&W.click()}));function gt(t){t=Math.max(0,Math.min(1,t)),lt=t,u.volume=t,Ct&&(Ct.value=t),t===0?(tt=!0,u.muted=!0,q&&(q.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>')):(tt=!1,u.muted=!1,q&&(q.innerHTML='<i data-lucide="volume-2" style="width:18px;height:18px;"></i>')),M()}Ct&&Ct.addEventListener("input",t=>{gt(parseFloat(t.target.value))}),q&&q.addEventListener("click",t=>{t.stopPropagation(),tt?(gt(lt||.8),A("Ses açıldı","info")):(u.muted=!0,tt=!0,q.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;color:#ef4444;"></i>',M(),A("Sessize alındı","info"))}),j&&j.addEventListener("click",t=>{t.stopPropagation(),u.paused?(u.play(),j.innerHTML='<i data-lucide="pause" style="width:18px;height:18px;"></i>'):(u.pause(),j.innerHTML='<i data-lucide="play" style="width:18px;height:18px;"></i>'),M()}),Ce&&Ce.addEventListener("click",t=>{t.stopPropagation(),U&&u.seekable&&u.seekable.length>0?(u.currentTime=u.seekable.end(u.seekable.length-1),u.play(),A("Canlı yayına eşitlendi","info")):B(r)});function ht(t){if(!At||!Tt)return;if(!t||!t.levels||t.levels.length<=1){Tt.textContent=r.quality?r.quality.split(" ")[0]:"HD",At.innerHTML=`
            <button class="tv-quality-opt active" data-level="-1">
              <i data-lucide="check" style="width:13px;height:13px;color:#dfff76;"></i>
              <span>Kaynak Kalite (${E(r.quality||"1080p")})</span>
            </button>
          `,M();return}const a=t.levels,i=t.currentLevel;let s=`
          <button class="tv-quality-opt ${i===-1?"active":""}" data-level="-1">
            ${i===-1?'<i data-lucide="check" style="width:13px;height:13px;color:#dfff76;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
            <span>Otomatik (Adaptive)</span>
          </button>
        `;if(a.forEach((n,p)=>{const v=n.height||(n.attrs&&n.attrs.RESOLUTION?n.attrs.RESOLUTION.height:720),S=v>=1080?"1080p FHD":v>=720?"720p HD":v>=480?"480p SD":`${v}p`,I=i===p;s+=`
            <button class="tv-quality-opt ${I?"active":""}" data-level="${p}">
              ${I?'<i data-lucide="check" style="width:13px;height:13px;color:#dfff76;"></i>':'<span style="width:13px;display:inline-block;"></span>'}
              <span>${S}</span>
            </button>
          `}),At.innerHTML=s,i===-1)Tt.textContent="AUTO";else if(a[i]){const n=a[i].height;Tt.textContent=n?`${n}p`:"HD"}At.querySelectorAll(".tv-quality-opt").forEach(n=>{n.addEventListener("click",p=>{p.stopPropagation();const v=parseInt(n.dataset.level,10);if(U){U.currentLevel=v,ht(U),F&&F.classList.add("hidden");const S=n.querySelector("span").textContent;A(`Kalite ayarlandı: ${S}`,"success")}})}),M()}$e&&F&&($e.addEventListener("click",t=>{t.stopPropagation(),F.classList.toggle("hidden"),yt()}),o.on(document,"click",t=>{t.target.closest("#tv-quality-wrapper")||F.classList.add("hidden")}));let Bt=!1;function Ke(){if(!V||!qt||!x||document.fullscreenElement)return;const a=V.getBoundingClientRect().bottom<80;a&&u&&!u.paused&&!Bt?x.classList.contains("is-floating-pip")||(x.classList.add("is-floating-pip"),qt.classList.add("is-active"),Mt()):a||x.classList.contains("is-floating-pip")&&(x.classList.remove("is-floating-pip"),qt.classList.remove("is-active"),Bt=!1)}o.on(window,"scroll",Ke,{passive:!0}),ge&&ge.addEventListener("click",t=>{t.stopPropagation(),V&&V.scrollIntoView({behavior:"smooth",block:"start"})}),he&&he.addEventListener("click",t=>{t.stopPropagation(),Bt=!0,x.classList.remove("is-floating-pip"),qt.classList.remove("is-active")});let b="",Zt=null;function Qt(t){if(t>=0&&t<y.length){const a=y[t];A(`Kanal ${t+1}: ${a.name}`,"info"),B(a),V&&V.scrollIntoView({behavior:"smooth",block:"start"})}else A(`Kanal ${t+1} bulunamadı`,"warning");b="",Pt&&Pt.classList.add("hidden"),Z&&Z.classList.add("hidden")}function Fe(){if(!Pt||!Me||!Be)return;const t=parseInt(b,10),a=y[t-1];Me.textContent=b.padStart(2,"0"),Be.textContent=a?a.name:"Geçersiz Kanal",Pt.classList.remove("hidden"),nt&&(nt.textContent=b.padStart(2,"0")),rt&&(rt.textContent=a?a.name:"Geçersiz Kanal"),Zt&&L(Zt),Zt=h(()=>{b&&Qt(t-1)},1300)}Pe&&Z&&Pe.addEventListener("click",t=>{t.stopPropagation(),b="",nt&&(nt.textContent="--"),rt&&(rt.textContent="Numara tuşlayın"),Z.classList.toggle("hidden")}),Ie&&Ie.addEventListener("click",()=>{Z.classList.add("hidden"),b=""}),Re&&Re.addEventListener("click",()=>{Z.classList.add("hidden"),b=""}),Z&&Z.querySelectorAll(".tv-num-key").forEach(t=>{t.addEventListener("click",a=>{a.stopPropagation();const i=t.dataset.digit;if(i==="clear")b="",nt&&(nt.textContent="--"),rt&&(rt.textContent="Numara tuşlayın");else if(i==="ok"){if(b){const s=parseInt(b,10);Qt(s-1)}}else b.length>=2&&(b=""),b+=i,Fe()})});let g=0;function ot(){const t=U,a=Ft;U=null,Ft=null,wi({video:u,hls:t,mpegts:a,frames:e.querySelectorAll("#tv-embed-player")})}async function B(t,a=-1){const i=++g;r=t,Bt=!1,ot();let s=!1,n="";for(const l of[j,q,e.querySelector("#tv-btn-quality")])l&&(l.style.display="");_e(t),a>=0&&a<k.length&&($=a);const p=$>0;jt(),Mt(),ci(),vi(),G.classList.remove("hidden"),K.classList.add("hidden");const v=()=>{g===i&&(G.classList.add("hidden"),K.classList.add("hidden"))};u.addEventListener("loadeddata",v,{once:!0}),h(()=>{u.removeEventListener("loadeddata",v),g===i&&u.readyState<2&&!s&&P()},11e3);let S=0,I=!1,Nt=!1,Q=0;const Dt=new Set,ee=new Set;ee.add(Pi());async function Ze(l,c=!0){if(!t.officialLiveId||c&&S>=2)return!1;c&&(S+=1);const d=++Q;G.classList.remove("hidden"),K.classList.add("hidden");try{const m=It(`/api/live_tv_stream?channel=${encodeURIComponent(t.officialLiveId)}&playerId=${encodeURIComponent(t.playerId||"")}&json=1&refresh=${c?1:0}&_=${Date.now()}`),f=await fetch(m,{cache:"no-store",headers:{Accept:"application/json"}});if(!f.ok)throw n=(await f.json().catch(()=>null))?.error||"Yayın kaynağı şu anda yanıt vermiyor",new Error(n);const w=await f.json();if(g!==i||d!==Q)return!0;if(w.kind==="external"&&/^https:\/\//.test(w.externalUrl||"")){ot(),Q++,s=!0;const R=document.createElement("div");R.id="tv-embed-player",R.style.cssText="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:2";const z=document.createElement("a");return z.href=w.externalUrl,z.target="_blank",z.rel="noopener noreferrer",z.textContent=`${t.name} resmî canlı yayınını aç`,z.className="btn btn-primary",R.appendChild(z),x.appendChild(R),G.classList.add("hidden"),K.classList.add("hidden"),!0}if(w.kind==="embed"&&/^https:\/\//.test(w.embedUrl||"")||w.kind==="youtube"&&/^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}\?/.test(w.embedUrl||"")){ot(),Q++,s=!0;for(const z of[j,q,e.querySelector("#tv-btn-quality")])z&&(z.style.display="none");const R=document.createElement("iframe");return R.id="tv-embed-player",R.title=`${t.name} canlı yayını`,R.allow="autoplay; fullscreen; picture-in-picture",R.allowFullscreen=!0,R.style.cssText="position:absolute;inset:0;width:100%;height:100%;border:0;z-index:1",R.src=w.embedUrl,x.appendChild(R),G.classList.add("hidden"),K.classList.add("hidden"),ht(null),!0}const N=w?.proxiedUrl||w?.url||"";if(g!==i||d!==Q)return!0;const D=N?It(N):"";if(!D)throw new Error("Live stream URL missing");if(t.streamUrl=D,D!==l||c)return ae(D),!0}catch{if(g!==i||d!==Q)return!0}return!1}function wt(){if(g!==i)return;G.classList.add("hidden"),K.classList.remove("hidden");const l=K.querySelector(".tv-error-msg");l&&(l.textContent=n||"Yayın akışı geçici olarak yanıt vermedi")}function P(){if(g!==i)return;const l=k.findIndex((m,f)=>!Dt.has(f));if(l>=0){$=l,jt(),G.classList.remove("hidden"),K.classList.add("hidden"),A(`Alternatif kaynağa geçiliyor: ${k[l].label}`,"info"),ie(l);return}const c=Ri(),d=c.findIndex((m,f)=>!ee.has(f));if(d>=0){ee.add(d),Ni(d),_e(t),Dt.clear();const m=c[d]?c[d].includes("workers.dev")?"yedek ağ":`relay ${d+1}`:"doğrudan";G.classList.remove("hidden"),K.classList.add("hidden"),A(`Ağ değişti (${m}), tekrar deneniyor...`,"info"),ie($);return}wt()}function Qe(l){if(I||!/^https?:\/\//i.test(l))return!1;I=!0;const c=`${new URL(l).origin}/`,d=It(`/api/hls_proxy?url=${encodeURIComponent(l)}&ref=${encodeURIComponent(c)}&live=1`);return t.streamUrl=d,ae(d),!0}function yi(){return window.mpegts?Promise.resolve(window.mpegts):(window.__mpegtsPromise||(window.__mpegtsPromise=new Promise((l,c)=>{const d=document.createElement("script");d.src="https://cdn.jsdelivr.net/npm/mpegts.js@1.7.3/dist/mpegts.min.js",d.onload=()=>window.mpegts?l(window.mpegts):c(new Error("mpegts missing")),d.onerror=()=>c(new Error("mpegts load failed")),document.head.appendChild(d)})),window.__mpegtsPromise)}async function gi(l){const c=new Map,d=ft.get(l);if(d&&Date.now()-d.at<10*60*1e3)return d.sonuc;try{const m=await fetch(l,{method:"GET",headers:{Range:"bytes=0-2047"},cache:"no-store"});let f;if(m.ok&&m.body){const w=m.body.getReader();try{const{value:N}=await w.read(),D=N?N[0]===71?"#TS":new TextDecoder().decode(N.subarray(0,7)):"";f=!!D&&(D==="#TS"||D==="#EXTM3U")}finally{try{await w.cancel()}catch{}}}else{f=!1;try{m.body&&await m.body.cancel()}catch{}}if(c.set(l,f),ft.set(l,{at:Date.now(),sonuc:f}),ft.size>400){const w=[...ft.entries()].sort((N,D)=>N[1].at-D[1].at).slice(0,120);for(const[N]of w)ft.delete(N)}return f}catch{return!0}}function ie(l){Q++;const c=k[l];if(!c){P();return}Dt.add(l);const d=c.isTs?hi:ae,m=i;if(c.url&&/^https?:|^\/\//i.test(c.url)){gi(c.url).then(f=>{g===m&&(f?d(c.url):P())}).catch(()=>{g===m&&d(c.url)});return}d(c.url)}function hi(l){if(g!==i)return;const c=typeof window<"u"&&window.location?.hostname||"";l=(c==="localhost"||c==="127.0.0.1")&&!Lt()?l:xt(l),yi().then(m=>{if(g===i){if(!m.isSupported()){wt();return}ot();try{const f=m.createPlayer({type:"mpegts",isLive:!0,url:l});Ft=f,f.attachMediaElement(u),f.load(),f.play().catch(()=>{}),ht(null),f.on(m.Events.ERROR,()=>{g===i&&P()})}catch{wt()}}}).catch(()=>{g===i&&wt()})}function ae(l){if(g===i)if(l=It(l),Q++,s=!1,ot(),et.isSupported()){const c=Lt(),d=new et({enableWorker:!0,lowLatencyMode:!0,startLevel:0,capLevelToPlayerSize:!0,backBufferLength:c?20:10,maxBufferLength:c?45:20,maxMaxBufferLength:c?120:40,maxBufferSize:c?120*1024*1024:60*1024*1024,liveSyncDurationCount:3,liveMaxLatencyDurationCount:c?10:5,manifestLoadingTimeOut:2e4,manifestLoadingMaxRetry:c?5:3,manifestLoadingRetryDelay:1500,levelLoadingTimeOut:2e4,levelLoadingMaxRetry:c?5:3,fragLoadingTimeOut:15e3,fragLoadingMaxRetry:c?5:3,xhrSetup:m=>{try{m.withCredentials=!1}catch{}}});U=d,d.loadSource(l),d.attachMedia(u),d.on(et.Events.MANIFEST_PARSED,()=>{if(g!==i||U!==d){try{d.stopLoad(),d.detachMedia(),d.destroy()}catch{}return}ht(d),u.play().catch(m=>{m.name!=="NotAllowedError"||g!==i||(tt=!0,u.muted=!0,q&&(q.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;"></i>'),M(),u.play().catch(()=>{}))})}),d.on(et.Events.ERROR,(m,f)=>{if(!(g!==i||U!==d)&&f.fatal){if(k[$]&&!k[$].isDefault){P();return}if(f.type===et.ErrorTypes.NETWORK_ERROR)t.officialLiveId?Ze(l).then(w=>{w||P()}):Qe(l)||P();else if(f.type===et.ErrorTypes.MEDIA_ERROR)if(Nt)P();else{Nt=!0;try{d.recoverMediaError()}catch{P()}}else P()}})}else u.canPlayType("application/vnd.apple.mpegurl")?(u.src=l,u.addEventListener("loadedmetadata",()=>{g===i&&(ht(null),u.play().catch(c=>{c.name!=="NotAllowedError"||g!==i||(tt=!0,u.muted=!0,q&&(q.innerHTML='<i data-lucide="volume-x" style="width:18px;height:18px;"></i>'),M(),u.play().catch(()=>{}))}))},{once:!0}),u.addEventListener("error",()=>{g===i&&(Qe(l)||P())},{once:!0})):P()}let et;try{et=(await bi(async()=>{const{default:l}=await import("./vendor-hls-BuERnqCp.js");return{default:l}},[],import.meta.url)).default}catch{wt();return}g===i&&(t.officialLiveId&&!p?(Dt.add($),Ze("",!1).then(l=>{!l&&g===i&&P()})):ie($),u.muted=tt,u.volume=lt)}function bt(t){const a=ce();if(a.length===0)return;const i=a.findIndex(n=>n.id===r.id);let s;t==="prev"||t==="up"?s=i<=0?a.length-1:i-1:s=i>=a.length-1?0:i+1,B(a[s])}Ee&&Ee.addEventListener("click",t=>{t.stopPropagation(),bt("prev")}),qe&&qe.addEventListener("click",t=>{t.stopPropagation(),bt("next")}),Se&&Se.addEventListener("click",()=>bt("next")),ke&&ke.addEventListener("click",()=>{if(k.length>1){const t=($+1)%k.length;ti(r.id,k[t].key),B(r,t)}else B(r)}),$t&&$t.addEventListener("click",()=>{A("Yayın yeniden yükleniyor...","info"),B(r)});const Xt=120;let Jt=Xt,Ye="";function ui(t){const a=t.id===r.id,i=de(t.id),s=zt(t)+1,n=X(t.name,t.category),p=Ht(t);return`
            <div class="tv-grid-card ${a?"active":""}" data-id="${E(t.id)}">
              <div class="tv-grid-card-top">
                <span class="tv-grid-num">${String(s).padStart(2,"0")}</span>
                <button class="tv-grid-fav-btn ${i?"is-fav":""}" data-favid="${E(t.id)}" title="${i?"Favorilerden Çıkar":"Favorilere Ekle"}">
                  <i data-lucide="star" style="width:15px;height:15px;${i?"fill:#dfff76;color:#dfff76;":""}"></i>
                </button>
              </div>

              <div class="tv-grid-logo-box">
                <img class="tv-grid-logo" src="${E(t.logo)}" alt="${E(t.name)}" onerror="this.onerror=null; this.src='${n}';" loading="lazy" />
              </div>

              <div class="tv-grid-info">
                <span class="tv-grid-name" title="${E(t.name)}">${E(t.name)}</span>
                <div class="tv-grid-meta">
                  <span class="tv-grid-quality">${E(t.quality)}</span>
                </div>
              </div>

              <!-- Real-Time EPG Schedule Progress -->
              <div class="tv-grid-epg">
                <div class="tv-epg-header">
                  <span class="tv-epg-title" title="${E(p.title)}">${E(p.title)}</span>
                  <span class="tv-epg-time">${E(p.timeRange)}</span>
                </div>
                <div class="tv-epg-bar">
                  <div class="tv-epg-fill" style="width: ${p.progress}%"></div>
                </div>
                <div class="tv-epg-footer">
                  <span class="tv-epg-pct">%${p.progress} tamamlandı</span>
                  <span class="tv-epg-rem">${p.remainingMin} dk kaldı</span>
                </div>
              </div>

              ${a?'<div class="tv-grid-live-indicator"><span class="tv-live-dot"></span> <span>ŞU AN İZLENİYOR</span></div>':""}
            </div>
          `}function pi(){Y.querySelectorAll(".tv-grid-card").forEach(a=>{a.addEventListener("click",i=>{if(i.target.closest(".tv-grid-fav-btn"))return;const s=y.find(n=>n.id===a.dataset.id);s&&s.id!==r.id&&(B(s),V&&V.scrollIntoView({behavior:"smooth",block:"start"}))})}),Y.querySelectorAll(".tv-grid-fav-btn").forEach(a=>{a.addEventListener("click",i=>{i.stopPropagation(),di(a.dataset.favid)})});const t=Y.querySelector("#tv-grid-more");t&&t.addEventListener("click",()=>{Jt+=Xt,ze()})}function ze(){const t=ce();He&&(He.textContent=`${t.length} KANAL`);const a=`${J}|${it}`;if(Ye!==a&&(Ye=a,Jt=Xt),t.length===0){Y.innerHTML=`
            <div class="tv-catalog-empty-state">
              <i data-lucide="radio" style="width:40px;height:40px;color:var(--text-muted);"></i>
              <span class="tv-empty-title">Kanal Bulunamadı</span>
              <p class="tv-empty-sub">Arama teriminizi veya kategori filtrenizi değiştirin.</p>
            </div>
          `,M();return}const i=t.slice(0,Jt),s=t.length-i.length;Y.innerHTML=i.map(ui).join("")+(s>0?`<button id="tv-grid-more" class="tv-grid-more">${s} kanal daha göster <i data-lucide="chevron-down" style="width:16px;height:16px;"></i></button>`:""),pi(),M()}function vi(){Y&&Y.querySelectorAll(".tv-grid-card").forEach(t=>{const a=t.dataset.id===r.id;t.classList.toggle("active",a);const i=t.querySelector(".tv-grid-live-indicator");if(!a&&i&&i.remove(),a&&!i){const s=document.createElement("div");s.className="tv-grid-live-indicator",s.innerHTML='<span class="tv-live-dot"></span><span>ŞU AN İZLENİYOR</span>',t.appendChild(s)}})}O=()=>{ze(),Mt(),M()};function fi(){try{const t=JSON.parse(localStorage.getItem(oe)||"{}");return!t||!t.at||Date.now()-t.at>ri?{dead:[],at:0}:{dead:Array.isArray(t.dead)?t.dead:[],at:t.at}}catch{return{dead:[],at:0}}}function mi(t){try{localStorage.setItem(oe,JSON.stringify({at:Date.now(),dead:t.slice(0,1200)}))}catch{}}function Ve(t){if(!t.length)return;for(const i of t)St.add(i);const a=y.map((i,s)=>({c:i,i:s})).sort((i,s)=>Et(i.c)-Et(s.c)||i.i-s.i).map(i=>i.c);y.length=0,y.push(...a);try{C&&H!==y&&(H.length=0,H.push(...y.filter(i=>i.category==="kids")))}catch{}try{O()}catch{}}function Ge(){if(Kt||!document.contains(e))return;const t=fi();t.at&&Ve(t.dead);const a=y.filter(i=>!St.has(i.streamUrl)).slice(0,le);a.length&&(Kt=!0,$i(a,i=>kt(i.streamUrl,i.headers),{limit:le,concurrency:4,timeout:6e3}).then(i=>{if(!document.contains(e))return;const s=[...i.dead];mi(s),Ve(s),i.tested&&A(`${i.tested} kanal denetlendi · ${i.alive.size} çalışıyor`,"info")}).catch(()=>{}).finally(()=>{Kt=!1}))}if((async()=>{if(!document.contains(e))return;const a=await Ci().catch(()=>null);if(!a||!document.contains(e))return;const i=ne(a.sources).filter(Ot);if(y.filter(p=>p.srcKey).map(p=>p.id).join(",")!==i.map(p=>p.id).join(",")){for(let v=y.length-1;v>=0;v--)y[v].srcKey&&y.splice(v,1);const p=y.filter(v=>!v.srcKey).length;y.splice(p,0,...i);try{C&&H!==y&&(H.length=0,H.push(...y.filter(v=>v.category==="kids")))}catch{}}const n=y.find(p=>p.id===r.id);if(n)r={...r,logo:n.logo};else if((!r.streamUrl||r.id==="ctv_loading")&&y[0]){r=y[0];try{O()}catch{}B(r);return}try{O()}catch{}Ge()})().catch(()=>{}),re.length&&o.setTimeout(()=>Ge(),2500),Rt&&Rt.addEventListener("input",t=>{it=t.target.value.trim(),mt&&mt.classList.toggle("hidden",!it),O()}),mt&&mt.addEventListener("click",()=>{Rt.value="",it="",mt.classList.add("hidden"),O()}),T){Ne&&Ne.addEventListener("click",n=>{n.stopPropagation(),T.scrollBy({left:-220,behavior:"smooth"})}),De&&De.addEventListener("click",n=>{n.stopPropagation(),T.scrollBy({left:220,behavior:"smooth"})}),T.addEventListener("wheel",n=>{Math.abs(n.deltaY)>Math.abs(n.deltaX)&&(n.preventDefault(),T.scrollLeft+=n.deltaY)},{passive:!1});let t=!1,a=0,i=0,s=!1;T.addEventListener("mousedown",n=>{n.button===0&&(t=!0,s=!1,a=n.pageX-T.offsetLeft,i=T.scrollLeft)}),o.on(window,"mousemove",n=>{if(!t)return;const v=(n.pageX-T.offsetLeft-a)*1.5;Math.abs(v)>6&&(s=!0,T.classList.add("is-dragging")),T.scrollLeft=i-v}),o.on(window,"mouseup",()=>{t&&(t=!1,T.classList.remove("is-dragging"),h(()=>{s=!1},50))}),T.querySelectorAll(".tv-cat-filter-btn").forEach(n=>{n.addEventListener("click",p=>{if(s){p.preventDefault();return}T.querySelectorAll(".tv-cat-filter-btn").forEach(v=>v.classList.remove("active")),n.classList.add("active"),J=n.dataset.cat,n.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"}),O()})})}W&&W.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen().catch(()=>{}):x.requestFullscreen().catch(()=>{})}),o.on(document,"fullscreenchange",()=>{const t=!!document.fullscreenElement;x.classList.toggle("is-fullscreen",t),W&&(W.innerHTML=t?'<i data-lucide="minimize-2" style="width:18px;height:18px;"></i>':'<i data-lucide="maximize-2" style="width:18px;height:18px;"></i>',M())});function je(t){if(document.activeElement!==Rt){if(t.key>="0"&&t.key<="9"){b.length>=2&&(b=""),b+=t.key,Fe();return}if(t.key==="Enter"&&b){t.preventDefault();const a=parseInt(b,10);Qt(a-1);return}switch(t.key){case"ArrowUp":case"w":case"W":t.preventDefault(),bt("prev");break;case"ArrowDown":case"s":case"S":t.preventDefault(),bt("next");break;case"ArrowRight":t.preventDefault(),gt(lt+.05);break;case"ArrowLeft":t.preventDefault(),gt(lt-.05);break;case"m":case"M":q&&q.click();break;case"f":case"F":W&&W.click();break;case"r":case"R":$t&&$t.click();break;case" ":t.preventDefault(),j&&j.click();break}}}o.on(document,"keydown",je);const We=()=>{g++,ot(),o.dispose(),_i(),ct(Oe),window.removeEventListener("epg-updated",Wt),window.removeEventListener("scroll",Ke),document.removeEventListener("keydown",je)};window.__LiveTvController={cleanup:We};const te=new MutationObserver(()=>{document.contains(e)||(We(),te.disconnect())});te.observe(document.body,{childList:!0,subtree:!0}),o.add(()=>te.disconnect()),O(),r&&r.streamUrl&&B(r),gt(1)}}}export{Xi as renderLiveTvView};

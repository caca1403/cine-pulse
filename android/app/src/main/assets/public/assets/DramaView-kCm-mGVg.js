import{r as b,s as I,x as ra,o as sa}from"./index-BhQWUMv-.js";import{f as ta,a as la,b as da,c as W}from"./dramalarScraper-xloTrwHs.js";import"./vendor-capacitor-VGCIBgSg.js";import"./mediaMatcher-ChSjM1y_.js";async function ha(U=null,J=""){let d=J?"search":"trending",n=J||"",p=0,z=!0,E=!0,y=[],f=null,x="";const A=[{id:"trending",label:"Trendler",icon:"flame",query:""},{id:"all",label:"Tüm Katalog",icon:"layers",query:""},{id:"dubbed",label:"Türkçe Dublaj",icon:"sparkles",query:"dublaj"},{id:"patron",label:"CEO & Patron",icon:"briefcase",query:"patron"},{id:"kurt",label:"Kurt & Alfa",icon:"moon",query:"kurt"},{id:"intikam",label:"İntikam & Aşk",icon:"heart-crack",query:"intikam"},{id:"milyarder",label:"Milyarder",icon:"crown",query:"milyarder"},{id:"evlilik",label:"Yasak Aşk & Evlilik",icon:"ring",query:"evlilik"}];return{html:`
    <div class="drama-view-container" id="drama-view-root">
      <!-- Ambient Glow Elements -->
      <div class="drama-ambient-glow glow-primary"></div>
      <div class="drama-ambient-glow glow-secondary"></div>

      <!-- Hero Header Section -->
      <header class="drama-hero-header">
        <div class="drama-hero-content">
          <div class="drama-hero-badge">
            <i data-lucide="sparkles" style="width: 14px; height: 14px; color: #c084fc;"></i>
            <span>ÖZEL MİNİ DİZİ &amp; REELS KÜTÜPHANESİ</span>
            <span class="drama-vip-pill">DDZ VIP</span>
          </div>
          <h1 class="drama-hero-title">Kısa Diziler &amp; Mini Seriler</h1>
          <p class="drama-hero-subtitle">
            DramaBox, ReelShort, ShortMax ve FlexTV orijinal yapımları. TMDB'de bulunmayan tüm mini bölümler, 
            <strong style="color: #e9d5ff;">Türkçe Dublaj</strong> ve <strong style="color: #e9d5ff;">Altyazı</strong> desteğiyle burada!
          </p>

          <!-- Dedicated Specialized Search Box -->
          <div class="drama-search-wrapper">
            <div class="drama-search-box">
              <i data-lucide="search" class="drama-search-icon"></i>
              <input 
                type="text" 
                id="drama-search-input" 
                class="drama-search-input" 
                placeholder="Kısa dizi adı veya konu ara... (Örn: Patron, Kurt Kızı, Milyarder, Dublaj)" 
                value="${n.replace(/"/g,"&quot;")}"
                autocomplete="off"
              />
              <button id="btn-drama-search-clear" class="btn-drama-search-clear ${n?"":"hidden"}" title="Temizle">
                <i data-lucide="x" style="width: 16px; height: 16px;"></i>
              </button>
            </div>
            <div id="drama-search-feedback" class="drama-search-feedback"></div>
          </div>

          <!-- Category Quick Filter Chips -->
          <div class="drama-category-chips" id="drama-category-chips">
            ${A.map(w=>`
              <button 
                class="drama-chip ${d===w.id?"active":""}" 
                data-tab-id="${w.id}"
                data-tab-query="${w.query}"
              >
                <i data-lucide="${w.icon}" style="width: 14px; height: 14px;"></i>
                <span>${w.label}</span>
              </button>
            `).join("")}
          </div>
        </div>
      </header>

      <!-- Main Content Area: Grid / Loader -->
      <section class="drama-catalog-section">
        <div class="drama-section-header">
          <div class="drama-section-title-wrap">
            <h2 id="drama-section-title" class="drama-section-title">
              <i data-lucide="flame" style="width: 20px; height: 20px; color: #f43f5e;"></i>
              <span>Trend Kısa Diziler</span>
            </h2>
            <span id="drama-counter-badge" class="drama-counter-badge">Yükleniyor...</span>
          </div>
        </div>

        <div id="drama-cards-grid" class="drama-cards-grid">
          <!-- Skeletons initially rendered -->
          ${Array.from({length:12}).map(()=>`
            <div class="drama-card-skeleton">
              <div class="skeleton-poster"></div>
              <div class="skeleton-title"></div>
            </div>
          `).join("")}
        </div>
        <div id="drama-scroll-sentinel" class="drama-scroll-sentinel" aria-hidden="true"></div>

        <!-- Load More / Pagination Button -->
        <div id="drama-load-more-wrap" class="drama-load-more-wrap hidden">
          <button id="btn-drama-load-more" class="btn-drama-load-more">
            <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i>
            <span>Daha Fazla Dizi Yükle</span>
          </button>
        </div>
      </section>

      <!-- Drama Detail Modal / Drawer -->
      <div id="drama-detail-modal" class="drama-modal-backdrop hidden">
        <div class="drama-modal-dialog" id="drama-modal-dialog">
          <!-- Will be dynamically injected when a drama is opened -->
        </div>
      </div>
    </div>
  `,init:async w=>{const l=w.querySelector("#drama-view-root");if(!l)return;const L=l.querySelector("#drama-search-input"),H=l.querySelector("#btn-drama-search-clear");l.querySelector("#drama-search-feedback");const C=l.querySelectorAll(".drama-chip"),P=l.querySelector("#drama-section-title"),_=l.querySelector("#drama-counter-badge"),h=l.querySelector("#drama-cards-grid"),m=l.querySelector("#drama-load-more-wrap"),M=l.querySelector("#btn-drama-load-more"),B=l.querySelector("#drama-scroll-sentinel"),K=l.querySelector("#drama-detail-modal"),c=l.querySelector("#drama-modal-dialog");let R=null,v=0,k=0,V=0,Y=null;const Z=a=>{V!==a&&(V=a,Y=W({page:a}).catch(()=>null))},Q=async a=>{if(V===a&&Y){const e=await Y;if(e)return e}return W({page:a})},F=()=>{const a=n.trim();return a.length>=2?a:A.find(e=>e.id===d)?.query||""},O=async a=>{const e=F();if(e){const t=await W({query:e,page:a}),o=new Set;return(Array.isArray(t)?t:[]).filter(r=>{const s=(r.slug||"").replace(/^(ddz_|dml_)/,"");return!s||o.has(s)?!1:(o.add(s),!0)})}return Q(a)},D=()=>(d==="trending"||d==="all"||!!F())&&z,T=async()=>{if(E||!D())return;const a=p+1,e=v;E=!0,M.disabled=!0,m.classList.remove("hidden"),m.classList.add("is-loading"),m.classList.remove("is-error"),M.querySelector("span").textContent="Diziler yükleniyor...";let t=!1;try{const o=await O(a);if(e!==v)return;const r=new Set(y.map(u=>u.slug)),s=o.filter(u=>!r.has(u.slug)&&r.add(u.slug));if(p=a,z=s.length>0,t=!0,k=0,z&&!F()&&Z(a+1),s.length){const u=y.length;y.push(...s),X(u)}}catch{if(e!==v)return;k++,k<=2&&setTimeout(()=>{e===v&&T()},k*800);return}finally{if(e!==v)return;E=!1,M.disabled=!1,M.querySelector("span").textContent="Daha Fazla Dizi Yükle",m.classList.remove("is-loading"),m.classList.toggle("is-error",k>2&&D()),m.classList.toggle("hidden",k<=2||!D()),t&&D()&&B.getBoundingClientRect().top<window.innerHeight+800&&setTimeout(T,0)}};new IntersectionObserver(a=>{a.some(e=>e.isIntersecting)&&T()},{rootMargin:"800px 0px"}).observe(B);async function $(){const a=++v;k=0,E=!0,h.innerHTML=Array.from({length:12}).map(()=>`
          <div class="drama-card-skeleton">
            <div class="skeleton-poster"></div>
            <div class="skeleton-title"></div>
          </div>
        `).join(""),_.textContent="Yükleniyor...";try{let e=[];if(n&&n.trim().length>=2)e=await O(1),p=1,P.innerHTML=`
              <i data-lucide="search" style="width: 20px; height: 20px; color: #a855f7;"></i>
              <span>"${n}" İçin Arama Sonuçları</span>
            `,m.classList.toggle("hidden",e.length===0);else{const t=A.find(o=>o.id===d)||A[0];d==="trending"?(Z(1),e=await da(),p=0,P.innerHTML=`
                <i data-lucide="flame" style="width: 20px; height: 20px; color: #f43f5e;"></i>
                <span>Trend Kısa Diziler</span>
              `,m.classList.add("hidden")):d==="all"?(e=await Q(1),p=1,Z(2),P.innerHTML=`
                <i data-lucide="layers" style="width: 20px; height: 20px; color: #3b82f6;"></i>
                <span>Tüm Kısa Diziler Kataloğu (Sayfa ${p})</span>
              `,m.classList.toggle("hidden",e.length===0)):t.query&&(e=await O(1),p=1,P.innerHTML=`
                <i data-lucide="${t.icon}" style="width: 20px; height: 20px; color: #c084fc;"></i>
                <span>${t.label} Serileri</span>
              `,m.classList.toggle("hidden",e.length===0))}if(a!==v)return;y=e,d!=="trending"&&(p=1),z=d==="trending"||e.length>0,m.classList.add("hidden"),X()}catch{if(a!==v)return;h.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="alert-circle" style="width: 44px; height: 44px; color: #ef4444;"></i>
              <h3>Diziler yüklenirken bir sorun oluştu</h3>
              <p>Lütfen internet bağlantınızı kontrol edip tekrar deneyin.</p>
              <button class="btn-primary" id="btn-drama-retry">Tekrar Dene</button>
            </div>
          `,l.querySelector("#btn-drama-retry")?.addEventListener("click",()=>$()),b(h)}finally{a===v&&(E=!1,D()&&B.getBoundingClientRect().top<window.innerHeight+800&&setTimeout(T,0))}}function X(a=0){if(!y||y.length===0){h.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="film" style="width: 48px; height: 48px; color: #94a3b8;"></i>
              <h3>Eşleşen Kısa Dizi Bulunamadı</h3>
              <p>Farklı bir anahtar kelime ile arama yapabilir veya Trend kategorisine göz atabilirsiniz.</p>
            </div>
          `,_.textContent="0 Dizi",b(h);return}_.textContent=`${y.length} Dizi`;const e=y.slice(a).map((t,o)=>{const r=t.isDubbed||t.title.toLowerCase().includes("dublaj"),s=t.poster||"";return`
            <article class="drama-card" data-slug="${t.slug}" tabindex="0" role="button" aria-label="${t.title}">
              <div class="drama-card-poster-wrap">
                ${s?`
                  <img 
                    src="${s}" 
                    alt="${t.title}" 
                    class="drama-card-poster" 
                    loading="lazy" 
                    decoding="async"
                    onerror="this.onerror=null;this.classList.add('broken-img');"
                  />
                `:`
                  <div class="drama-card-fallback-poster">
                    <i data-lucide="clapperboard" style="width: 32px; height: 32px; color: #a855f7;"></i>
                  </div>
                `}

                <div class="drama-card-gradient"></div>

                <!-- Badges -->
                <div class="drama-card-badges">
                  <span class="drama-badge-pill ${r?"badge-dub":"badge-sub"}">
                    ${r?"🇹🇷 DUBLAJ":"TR ALTYAZI"}
                  </span>
                  <span class="drama-badge-pill badge-type">MİNİ DİZİ</span>
                </div>

                <!-- Hover Play Glow Icon -->
                <div class="drama-card-play-action">
                  <div class="drama-play-btn-circle">
                    <i data-lucide="play" style="width: 22px; height: 22px; color: #fff; margin-left: 2px;"></i>
                  </div>
                </div>
              </div>

              <div class="drama-card-info">
                <h3 class="drama-card-title" title="${t.title}">${t.title}</h3>
                <div class="drama-card-meta">
                  <span>Reels Series</span>
                  <span>•</span>
                  <span>1080p HD</span>
                </div>
              </div>
            </article>
          `}).join("");a?h.insertAdjacentHTML("beforeend",e):h.innerHTML=e,b(h)}h.addEventListener("click",a=>{const e=a.target.closest(".drama-card")?.getAttribute("data-slug");e&&G(e)}),h.addEventListener("keydown",a=>{if(a.key!=="Enter"&&a.key!==" ")return;const e=a.target.closest(".drama-card")?.getAttribute("data-slug");e&&(a.preventDefault(),G(e))});async function G(a){if(a){f=null,K.classList.remove("hidden"),document.body.style.overflow="hidden",c.innerHTML=`
          <div class="drama-detail-loading">
            <div class="spin-loader"></div>
            <span>Dizi bilgileri ve bölümler yükleniyor...</span>
          </div>
        `,b(c);try{let e=null;if(a.startsWith("dml_")?e=await ta(a.replace("dml_","")):(e=await la(a),e||(e=await ta(a))),!e){c.innerHTML=`
              <div class="drama-empty-state">
                <i data-lucide="alert-circle" style="width: 38px; height: 38px; color: #ef4444;"></i>
                <h3>Dizi bilgisi alınamadı</h3>
                <button class="btn-primary" id="btn-close-drama-modal">Kapat</button>
              </div>
            `,l.querySelector("#btn-close-drama-modal")?.addEventListener("click",q),b(c);return}f=e,aa()}catch{q(),I("Dizi detayları yüklenemedi.","error")}}}function aa(){if(!f)return;const{slug:a,title:e,poster:t,description:o,episodes:r=[],isDubbed:s}=f,u=r.length,S=x?r.filter(i=>i.title.toLowerCase().includes(x)||String(i.episode).includes(x)):r;c.innerHTML=`
          <button class="drama-modal-close-btn" id="btn-close-drama-modal" title="Kapat">
            <i data-lucide="x" style="width: 20px; height: 20px;"></i>
          </button>

          <div class="drama-detail-hero">
            <div class="drama-detail-backdrop-blur" style="background-image: url('${t||""}');"></div>
            <div class="drama-detail-hero-content">
              <div class="drama-detail-poster-wrap">
                <img src="${t||""}" alt="${e}" class="drama-detail-poster" />
              </div>
              <div class="drama-detail-info">
                <div class="drama-detail-badges">
                  <span class="drama-badge-pill ${s?"badge-dub":"badge-sub"}">
                    ${s?"🇹🇷 TÜRKÇE DUBLAJ":"TR ALTYAZI"}
                  </span>
                  <span class="drama-badge-pill badge-type">MİNİ DİZİ</span>
                  <span class="drama-badge-pill badge-ep-count">${u} BÖLÜM</span>
                  <span class="drama-badge-pill badge-server">DDZ VIP HLS</span>
                </div>
                <h2 class="drama-detail-title">${e}</h2>
                <p class="drama-detail-desc">${o||"Bu kısa dizi için henüz özet girilmedi."}</p>
                <div class="drama-detail-actions">
                  <button class="btn-primary drama-btn-play-all" id="btn-play-drama-start">
                    <i data-lucide="play" style="width: 18px; height: 18px; fill: currentColor;"></i>
                    <span>1. Bölümden Başla</span>
                  </button>
                  <button class="btn-secondary" id="btn-share-drama" title="Bağlantıyı Kopyala">
                    <i data-lucide="share-2" style="width: 16px; height: 16px;"></i>
                    <span>Paylaş</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Episode Explorer Section -->
          <div class="drama-episodes-explorer">
            <div class="drama-episodes-toolbar">
              <div class="drama-episodes-title-wrap">
                <h3>Bölümler (${u})</h3>
                <span class="drama-episodes-sub">Bölüme tıklayarak reklamsız izleyin</span>
              </div>
              <div class="drama-episodes-filter-box">
                <i data-lucide="search" style="width: 15px; height: 15px; color: #94a3b8;"></i>
                <input 
                  type="text" 
                  id="drama-ep-filter-input" 
                  placeholder="Bölüm ara... (Örn: 25)" 
                  value="${x}"
                />
              </div>
            </div>

            <div class="drama-episodes-grid" id="drama-episodes-grid">
              ${S.map(i=>{const g=ra(`ddz_${a}`,i.season,i.episode);return`
                  <button 
                    class="drama-ep-card ${g?"is-watched":""}" 
                    data-season="${i.season}" 
                    data-episode="${i.episode}"
                  >
                    <div class="drama-ep-thumb-wrap">
                      ${i.thumb?`
                        <img src="${i.thumb}" alt="${i.title}" loading="lazy" />
                      `:`
                        <div class="drama-ep-fallback-thumb">
                          <i data-lucide="play" style="width: 16px; height: 16px; color: #c084fc;"></i>
                        </div>
                      `}
                      <span class="drama-ep-num-pill">${i.episode}</span>
                      ${g?'<div class="drama-ep-watched-tag"><i data-lucide="check" style="width: 12px; height: 12px;"></i></div>':""}
                    </div>
                    <div class="drama-ep-title-wrap">
                      <span class="drama-ep-name">${i.title}</span>
                      <span class="drama-ep-action-hint">İzle</span>
                    </div>
                  </button>
                `}).join("")}
            </div>
          </div>
        `,b(c),c.querySelector("#btn-close-drama-modal")?.addEventListener("click",q),c.querySelector("#btn-play-drama-start")?.addEventListener("click",i=>{r.length>0&&ea(r[0].season,r[0].episode,i.currentTarget)}),c.querySelector("#btn-share-drama")?.addEventListener("click",()=>{const i=`${window.location.origin}${window.location.pathname}#dramas?slug=${a}`;navigator.clipboard?.writeText(i).then(()=>{I("Dizi bağlantısı panoya kopyalandı!","success")}).catch(()=>{I(`Bağlantı: ${i}`,"info")})});const j=c.querySelector("#drama-ep-filter-input");j&&j.addEventListener("input",i=>{x=i.target.value.toLowerCase().trim(),aa(),c.querySelector("#drama-ep-filter-input")?.focus()}),c.querySelectorAll(".drama-ep-card").forEach(i=>{i.addEventListener("click",g=>{const N=parseInt(i.getAttribute("data-season"),10)||1,ia=parseInt(i.getAttribute("data-episode"),10)||1;ea(N,ia,g.currentTarget)})})}function q(){K.classList.add("hidden"),document.body.style.overflow="",f=null,x=""}K.addEventListener("click",a=>{a.target===K&&q()});async function ea(a=1,e=1,t=null){if(!f)return;const{slug:o,title:r,poster:s,description:u,episodes:S=[]}=f,j=S.find(g=>g.season===a&&g.episode===e)?.thumb||"",i=t?t.innerHTML:null;t&&(t.disabled=!0,t.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:14px;height:14px"></i> <span>Yükleniyor...</span>',b(t));try{q();const g=o.replace(/^(ddz_|dml_)/,""),N=o.startsWith("dml_")?"dml_":"ddz_";await sa({type:"tv",tmdbId:`${N}${g}`,title:`${r} - B${e}`,seriesTitle:r,season:a,episode:e,posterPath:s,backdropPath:s,playerVariant:"short-drama",seriesOverview:u||"",episodeArtworkPath:j||s,shortDramaEpisodes:S,maxEpisodes:S.length,seasonsList:[{season_number:a,episode_count:S.length}]})}catch{I("Bölüm açılırken bir sorun oluştu, lütfen tekrar deneyin.","error")}finally{t&&i&&(t.disabled=!1,t.innerHTML=i,b(t))}}L?.addEventListener("input",a=>{const e=a.target.value;H.classList.toggle("hidden",!e),clearTimeout(R),R=setTimeout(()=>{n=e.trim(),p=0,d=n?"search":"trending",C.forEach(t=>t.classList.toggle("active",!n&&t.getAttribute("data-tab-id")==="trending")),$()},350)}),L?.addEventListener("keydown",a=>{a.key==="Enter"&&(a.preventDefault(),clearTimeout(R),n=L.value.trim(),p=0,$())}),H?.addEventListener("click",()=>{L.value="",H.classList.add("hidden"),n="",d="trending",C.forEach(a=>a.classList.toggle("active",a.getAttribute("data-tab-id")==="trending")),$()}),C.forEach(a=>{a.addEventListener("click",()=>{const e=a.getAttribute("data-tab-id");d===e&&!n||(d=e,n="",L&&(L.value=""),H?.classList.add("hidden"),p=0,C.forEach(t=>t.classList.toggle("active",t===a)),$())})}),M?.addEventListener("click",T),await $(),D()&&B.getBoundingClientRect().top<window.innerHeight+800&&T(),U&&G(U)}}}export{ha as renderDramaView};

import{r as w,s as R,x as ra,o as sa}from"./index-1v-iW0I5.js";import{f as ta,a as la,b as da,c as W,s as na}from"./dramalarScraper-BUEPBRCz.js";import"./vendor-capacitor-VGCIBgSg.js";async function ha(U=null,J=""){let o=J?"search":"trending",c=J||"",m=0,A=!0,z=!0,f=[],k=null,D="";const C=[{id:"trending",label:"Trendler",icon:"flame",query:""},{id:"all",label:"Tüm Katalog",icon:"layers",query:""},{id:"dubbed",label:"Türkçe Dublaj",icon:"sparkles",query:"dublaj"},{id:"patron",label:"CEO & Patron",icon:"briefcase",query:"patron"},{id:"kurt",label:"Kurt & Alfa",icon:"moon",query:"kurt"},{id:"intikam",label:"İntikam & Aşk",icon:"heart-crack",query:"intikam"},{id:"milyarder",label:"Milyarder",icon:"crown",query:"milyarder"},{id:"evlilik",label:"Yasak Aşk & Evlilik",icon:"ring",query:"evlilik"}];return{html:`
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
                value="${c.replace(/"/g,"&quot;")}"
                autocomplete="off"
              />
              <button id="btn-drama-search-clear" class="btn-drama-search-clear ${c?"":"hidden"}" title="Temizle">
                <i data-lucide="x" style="width: 16px; height: 16px;"></i>
              </button>
            </div>
            <div id="drama-search-feedback" class="drama-search-feedback"></div>
          </div>

          <!-- Category Quick Filter Chips -->
          <div class="drama-category-chips" id="drama-category-chips">
            ${C.map(L=>`
              <button 
                class="drama-chip ${o===L.id?"active":""}" 
                data-tab-id="${L.id}"
                data-tab-query="${L.query}"
              >
                <i data-lucide="${L.icon}" style="width: 14px; height: 14px;"></i>
                <span>${L.label}</span>
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
  `,init:async L=>{const s=L.querySelector("#drama-view-root");if(!s)return;const T=s.querySelector("#drama-search-input"),H=s.querySelector("#btn-drama-search-clear");s.querySelector("#drama-search-feedback");const P=s.querySelectorAll(".drama-chip"),B=s.querySelector("#drama-section-title"),I=s.querySelector("#drama-counter-badge"),g=s.querySelector("#drama-cards-grid"),p=s.querySelector("#drama-load-more-wrap"),M=s.querySelector("#btn-drama-load-more"),K=s.querySelector("#drama-scroll-sentinel"),j=s.querySelector("#drama-detail-modal"),u=s.querySelector("#drama-modal-dialog");let _=null,b=0,x=0,V=0,Y=null;const Z=a=>{V!==a&&(V=a,Y=W({page:a}).catch(()=>null))},Q=async a=>{if(V===a&&Y){const e=await Y;if(e)return e}return W({page:a})},F=()=>{const a=c.trim();return a.length>=2?a:C.find(e=>e.id===o)?.query||""},O=async a=>{const e=F();if(e){const[t,d]=await Promise.allSettled([W({query:e,page:a}),na(e,a)]),r=t.status==="fulfilled"&&Array.isArray(t.value)?t.value:[],l=d.status==="fulfilled"&&Array.isArray(d.value)?d.value.map(h=>({...h,badge:h.title.toLowerCase().includes("dublaj")?"🇹🇷 DUBLAJ":"TR ALTYAZI",isDubbed:h.title.toLowerCase().includes("dublaj")})):[],n=new Set,y=[];for(const h of[...l,...r]){const i=h.slug.replace(/^(ddz_|dml_)/,"");n.has(i)||(n.add(i),y.push(h))}return y}return Q(a)},$=()=>(o==="trending"||o==="all"||!!F())&&A,S=async()=>{if(z||!$())return;const a=m+1,e=b;z=!0,M.disabled=!0,p.classList.remove("hidden"),p.classList.add("is-loading"),p.classList.remove("is-error"),M.querySelector("span").textContent="Diziler yükleniyor...";let t=!1;try{const d=await O(a);if(e!==b)return;const r=new Set(f.map(n=>n.slug)),l=d.filter(n=>!r.has(n.slug)&&r.add(n.slug));if(m=a,A=l.length>0,t=!0,x=0,A&&!F()&&Z(a+1),l.length){const n=f.length;f.push(...l),X(n)}}catch{if(e!==b)return;x++,x<=2&&setTimeout(()=>{e===b&&S()},x*800);return}finally{if(e!==b)return;z=!1,M.disabled=!1,M.querySelector("span").textContent="Daha Fazla Dizi Yükle",p.classList.remove("is-loading"),p.classList.toggle("is-error",x>2&&$()),p.classList.toggle("hidden",x<=2||!$()),t&&$()&&K.getBoundingClientRect().top<window.innerHeight+800&&setTimeout(S,0)}};new IntersectionObserver(a=>{a.some(e=>e.isIntersecting)&&S()},{rootMargin:"800px 0px"}).observe(K);async function E(){const a=++b;x=0,z=!0,g.innerHTML=Array.from({length:12}).map(()=>`
          <div class="drama-card-skeleton">
            <div class="skeleton-poster"></div>
            <div class="skeleton-title"></div>
          </div>
        `).join(""),I.textContent="Yükleniyor...";try{let e=[];if(c&&c.trim().length>=2)e=await O(1),m=1,B.innerHTML=`
              <i data-lucide="search" style="width: 20px; height: 20px; color: #a855f7;"></i>
              <span>"${c}" İçin Arama Sonuçları</span>
            `,p.classList.toggle("hidden",e.length===0);else{const t=C.find(d=>d.id===o)||C[0];o==="trending"?(Z(1),e=await da(),m=0,B.innerHTML=`
                <i data-lucide="flame" style="width: 20px; height: 20px; color: #f43f5e;"></i>
                <span>Trend Kısa Diziler</span>
              `,p.classList.add("hidden")):o==="all"?(e=await Q(1),m=1,Z(2),B.innerHTML=`
                <i data-lucide="layers" style="width: 20px; height: 20px; color: #3b82f6;"></i>
                <span>Tüm Kısa Diziler Kataloğu (Sayfa ${m})</span>
              `,p.classList.toggle("hidden",e.length===0)):t.query&&(e=await O(1),m=1,B.innerHTML=`
                <i data-lucide="${t.icon}" style="width: 20px; height: 20px; color: #c084fc;"></i>
                <span>${t.label} Serileri</span>
              `,p.classList.toggle("hidden",e.length===0))}if(a!==b)return;f=e,o!=="trending"&&(m=1),A=o==="trending"||e.length>0,p.classList.add("hidden"),X()}catch{if(a!==b)return;g.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="alert-circle" style="width: 44px; height: 44px; color: #ef4444;"></i>
              <h3>Diziler yüklenirken bir sorun oluştu</h3>
              <p>Lütfen internet bağlantınızı kontrol edip tekrar deneyin.</p>
              <button class="btn-primary" id="btn-drama-retry">Tekrar Dene</button>
            </div>
          `,s.querySelector("#btn-drama-retry")?.addEventListener("click",()=>E()),w(g)}finally{a===b&&(z=!1,$()&&K.getBoundingClientRect().top<window.innerHeight+800&&setTimeout(S,0))}}function X(a=0){if(!f||f.length===0){g.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="film" style="width: 48px; height: 48px; color: #94a3b8;"></i>
              <h3>Eşleşen Kısa Dizi Bulunamadı</h3>
              <p>Farklı bir anahtar kelime ile arama yapabilir veya Trend kategorisine göz atabilirsiniz.</p>
            </div>
          `,I.textContent="0 Dizi",w(g);return}I.textContent=`${f.length} Dizi`;const e=f.slice(a).map((t,d)=>{const r=t.isDubbed||t.title.toLowerCase().includes("dublaj"),l=t.poster||"";return`
            <article class="drama-card" data-slug="${t.slug}" tabindex="0" role="button" aria-label="${t.title}">
              <div class="drama-card-poster-wrap">
                ${l?`
                  <img 
                    src="${l}" 
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
          `}).join("");a?g.insertAdjacentHTML("beforeend",e):g.innerHTML=e,w(g)}g.addEventListener("click",a=>{const e=a.target.closest(".drama-card")?.getAttribute("data-slug");e&&G(e)}),g.addEventListener("keydown",a=>{if(a.key!=="Enter"&&a.key!==" ")return;const e=a.target.closest(".drama-card")?.getAttribute("data-slug");e&&(a.preventDefault(),G(e))});async function G(a){if(a){k=null,j.classList.remove("hidden"),document.body.style.overflow="hidden",u.innerHTML=`
          <div class="drama-detail-loading">
            <div class="spin-loader"></div>
            <span>Dizi bilgileri ve bölümler yükleniyor...</span>
          </div>
        `,w(u);try{let e=null;if(a.startsWith("dml_")?e=await ta(a.replace("dml_","")):(e=await la(a),e||(e=await ta(a))),!e){u.innerHTML=`
              <div class="drama-empty-state">
                <i data-lucide="alert-circle" style="width: 38px; height: 38px; color: #ef4444;"></i>
                <h3>Dizi bilgisi alınamadı</h3>
                <button class="btn-primary" id="btn-close-drama-modal">Kapat</button>
              </div>
            `,s.querySelector("#btn-close-drama-modal")?.addEventListener("click",q),w(u);return}k=e,aa()}catch{q(),R("Dizi detayları yüklenemedi.","error")}}}function aa(){if(!k)return;const{slug:a,title:e,poster:t,description:d,episodes:r=[],isDubbed:l}=k,n=r.length,y=D?r.filter(i=>i.title.toLowerCase().includes(D)||String(i.episode).includes(D)):r;u.innerHTML=`
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
                  <span class="drama-badge-pill ${l?"badge-dub":"badge-sub"}">
                    ${l?"🇹🇷 TÜRKÇE DUBLAJ":"TR ALTYAZI"}
                  </span>
                  <span class="drama-badge-pill badge-type">MİNİ DİZİ</span>
                  <span class="drama-badge-pill badge-ep-count">${n} BÖLÜM</span>
                  <span class="drama-badge-pill badge-server">DDZ VIP HLS</span>
                </div>
                <h2 class="drama-detail-title">${e}</h2>
                <p class="drama-detail-desc">${d||"Bu kısa dizi için henüz özet girilmedi."}</p>
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
                <h3>Bölümler (${n})</h3>
                <span class="drama-episodes-sub">Bölüme tıklayarak reklamsız izleyin</span>
              </div>
              <div class="drama-episodes-filter-box">
                <i data-lucide="search" style="width: 15px; height: 15px; color: #94a3b8;"></i>
                <input 
                  type="text" 
                  id="drama-ep-filter-input" 
                  placeholder="Bölüm ara... (Örn: 25)" 
                  value="${D}"
                />
              </div>
            </div>

            <div class="drama-episodes-grid" id="drama-episodes-grid">
              ${y.map(i=>{const v=ra(`ddz_${a}`,i.season,i.episode);return`
                  <button 
                    class="drama-ep-card ${v?"is-watched":""}" 
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
                      ${v?'<div class="drama-ep-watched-tag"><i data-lucide="check" style="width: 12px; height: 12px;"></i></div>':""}
                    </div>
                    <div class="drama-ep-title-wrap">
                      <span class="drama-ep-name">${i.title}</span>
                      <span class="drama-ep-action-hint">İzle</span>
                    </div>
                  </button>
                `}).join("")}
            </div>
          </div>
        `,w(u),u.querySelector("#btn-close-drama-modal")?.addEventListener("click",q),u.querySelector("#btn-play-drama-start")?.addEventListener("click",i=>{r.length>0&&ea(r[0].season,r[0].episode,i.currentTarget)}),u.querySelector("#btn-share-drama")?.addEventListener("click",()=>{const i=`${window.location.origin}${window.location.pathname}#dramas?slug=${a}`;navigator.clipboard?.writeText(i).then(()=>{R("Dizi bağlantısı panoya kopyalandı!","success")}).catch(()=>{R(`Bağlantı: ${i}`,"info")})});const h=u.querySelector("#drama-ep-filter-input");h&&h.addEventListener("input",i=>{D=i.target.value.toLowerCase().trim(),aa(),u.querySelector("#drama-ep-filter-input")?.focus()}),u.querySelectorAll(".drama-ep-card").forEach(i=>{i.addEventListener("click",v=>{const N=parseInt(i.getAttribute("data-season"),10)||1,ia=parseInt(i.getAttribute("data-episode"),10)||1;ea(N,ia,v.currentTarget)})})}function q(){j.classList.add("hidden"),document.body.style.overflow="",k=null,D=""}j.addEventListener("click",a=>{a.target===j&&q()});async function ea(a=1,e=1,t=null){if(!k)return;const{slug:d,title:r,poster:l,description:n,episodes:y=[]}=k,h=y.find(v=>v.season===a&&v.episode===e)?.thumb||"",i=t?t.innerHTML:null;t&&(t.disabled=!0,t.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:14px;height:14px"></i> <span>Yükleniyor...</span>',w(t));try{q();const v=d.replace(/^(ddz_|dml_)/,""),N=d.startsWith("dml_")?"dml_":"ddz_";await sa({type:"tv",tmdbId:`${N}${v}`,title:`${r} - B${e}`,seriesTitle:r,season:a,episode:e,posterPath:l,backdropPath:l,playerVariant:"short-drama",seriesOverview:n||"",episodeArtworkPath:h||l,shortDramaEpisodes:y,maxEpisodes:y.length,seasonsList:[{season_number:a,episode_count:y.length}]})}catch{R("Bölüm açılırken bir sorun oluştu, lütfen tekrar deneyin.","error")}finally{t&&i&&(t.disabled=!1,t.innerHTML=i,w(t))}}T?.addEventListener("input",a=>{const e=a.target.value;H.classList.toggle("hidden",!e),clearTimeout(_),_=setTimeout(()=>{c=e.trim(),m=0,o=c?"search":"trending",P.forEach(t=>t.classList.toggle("active",!c&&t.getAttribute("data-tab-id")==="trending")),E()},350)}),T?.addEventListener("keydown",a=>{a.key==="Enter"&&(a.preventDefault(),clearTimeout(_),c=T.value.trim(),m=0,E())}),H?.addEventListener("click",()=>{T.value="",H.classList.add("hidden"),c="",o="trending",P.forEach(a=>a.classList.toggle("active",a.getAttribute("data-tab-id")==="trending")),E()}),P.forEach(a=>{a.addEventListener("click",()=>{const e=a.getAttribute("data-tab-id");o===e&&!c||(o=e,c="",T&&(T.value=""),H?.classList.add("hidden"),m=0,P.forEach(t=>t.classList.toggle("active",t===a)),E())})}),M?.addEventListener("click",S),await E(),$()&&K.getBoundingClientRect().top<window.innerHeight+800&&S(),U&&G(U)}}}export{ha as renderDramaView};

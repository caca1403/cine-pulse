import{r as $,s as N,x as ta,o as ia}from"./index-LKTqiWh4.js";import{f as ra,a as q,b as sa}from"./dramaDizilerimScraper-k681Hg-U.js";import"./vendor-capacitor-VGCIBgSg.js";async function pa(_=null,U=""){let n=U?"search":"trending",d=U||"",h=0,M=!0,T=!0,v=[],b=null,w="";const z=[{id:"trending",label:"Trendler",icon:"flame",query:""},{id:"all",label:"Tüm Katalog",icon:"layers",query:""},{id:"dubbed",label:"Türkçe Dublaj",icon:"sparkles",query:"dublaj"},{id:"patron",label:"CEO & Patron",icon:"briefcase",query:"patron"},{id:"kurt",label:"Kurt & Alfa",icon:"moon",query:"kurt"},{id:"intikam",label:"İntikam & Aşk",icon:"heart-crack",query:"intikam"},{id:"milyarder",label:"Milyarder",icon:"crown",query:"milyarder"},{id:"evlilik",label:"Yasak Aşk & Evlilik",icon:"ring",query:"evlilik"}];return{html:`
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
                value="${d.replace(/"/g,"&quot;")}"
                autocomplete="off"
              />
              <button id="btn-drama-search-clear" class="btn-drama-search-clear ${d?"":"hidden"}" title="Temizle">
                <i data-lucide="x" style="width: 16px; height: 16px;"></i>
              </button>
            </div>
            <div id="drama-search-feedback" class="drama-search-feedback"></div>
          </div>

          <!-- Category Quick Filter Chips -->
          <div class="drama-category-chips" id="drama-category-chips">
            ${z.map(y=>`
              <button 
                class="drama-chip ${n===y.id?"active":""}" 
                data-tab-id="${y.id}"
                data-tab-query="${y.query}"
              >
                <i data-lucide="${y.icon}" style="width: 14px; height: 14px;"></i>
                <span>${y.label}</span>
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
  `,init:async y=>{const s=y.querySelector("#drama-view-root");if(!s)return;const k=s.querySelector("#drama-search-input"),A=s.querySelector("#btn-drama-search-clear");s.querySelector("#drama-search-feedback");const B=s.querySelectorAll(".drama-chip"),C=s.querySelector("#drama-section-title"),I=s.querySelector("#drama-counter-badge"),m=s.querySelector("#drama-cards-grid"),c=s.querySelector("#drama-load-more-wrap"),E=s.querySelector("#btn-drama-load-more"),H=s.querySelector("#drama-scroll-sentinel"),P=s.querySelector("#drama-detail-modal"),o=s.querySelector("#drama-modal-dialog");let R=null,g=0,f=0,V=0,Y=null;const Z=a=>{V!==a&&(V=a,Y=q({page:a}).catch(()=>null))},W=async a=>{if(V===a&&Y){const e=await Y;if(e)return e}return q({page:a})},F=()=>{const a=d.trim();return a.length>=2?a:z.find(e=>e.id===n)?.query||""},aa=a=>{const e=F();return e?q({query:e,page:a}):W(a)},L=()=>(n==="trending"||n==="all"||!!F())&&M,x=async()=>{if(T||!L())return;const a=h+1,e=g;T=!0,E.disabled=!0,c.classList.remove("hidden"),c.classList.add("is-loading"),c.classList.remove("is-error"),E.querySelector("span").textContent="Diziler yükleniyor...";let t=!1;try{const u=await aa(a);if(e!==g)return;const r=new Set(v.map(l=>l.slug)),p=u.filter(l=>!r.has(l.slug)&&r.add(l.slug));if(h=a,M=p.length>0,t=!0,f=0,M&&!F()&&Z(a+1),p.length){const l=v.length;v.push(...p),J(l)}}catch{if(e!==g)return;f++,f<=2&&setTimeout(()=>{e===g&&x()},f*800);return}finally{if(e!==g)return;T=!1,E.disabled=!1,E.querySelector("span").textContent="Daha Fazla Dizi Yükle",c.classList.remove("is-loading"),c.classList.toggle("is-error",f>2&&L()),c.classList.toggle("hidden",f<=2||!L()),t&&L()&&H.getBoundingClientRect().top<window.innerHeight+800&&setTimeout(x,0)}};new IntersectionObserver(a=>{a.some(e=>e.isIntersecting)&&x()},{rootMargin:"800px 0px"}).observe(H);async function D(){const a=++g;f=0,T=!0,m.innerHTML=Array.from({length:12}).map(()=>`
          <div class="drama-card-skeleton">
            <div class="skeleton-poster"></div>
            <div class="skeleton-title"></div>
          </div>
        `).join(""),I.textContent="Yükleniyor...";try{let e=[];if(d&&d.trim().length>=2)e=await q({query:d.trim()}),C.innerHTML=`
              <i data-lucide="search" style="width: 20px; height: 20px; color: #a855f7;"></i>
              <span>"${d}" İçin Arama Sonuçları</span>
            `,c.classList.add("hidden");else{const t=z.find(u=>u.id===n)||z[0];n==="trending"?(Z(1),e=await sa(),h=0,C.innerHTML=`
                <i data-lucide="flame" style="width: 20px; height: 20px; color: #f43f5e;"></i>
                <span>Trend Kısa Diziler</span>
              `,c.classList.add("hidden")):n==="all"?(e=await W(1),h=1,Z(2),C.innerHTML=`
                <i data-lucide="layers" style="width: 20px; height: 20px; color: #3b82f6;"></i>
                <span>Tüm Kısa Diziler Kataloğu (Sayfa ${h})</span>
              `,c.classList.toggle("hidden",e.length===0)):t.query&&(e=await q({query:t.query}),C.innerHTML=`
                <i data-lucide="${t.icon}" style="width: 20px; height: 20px; color: #c084fc;"></i>
                <span>${t.label} Serileri</span>
              `,c.classList.add("hidden"))}if(a!==g)return;v=e,n!=="trending"&&(h=1),M=n==="trending"||e.length>0,c.classList.add("hidden"),J()}catch{if(a!==g)return;m.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="alert-circle" style="width: 44px; height: 44px; color: #ef4444;"></i>
              <h3>Diziler yüklenirken bir sorun oluştu</h3>
              <p>Lütfen internet bağlantınızı kontrol edip tekrar deneyin.</p>
              <button class="btn-primary" id="btn-drama-retry">Tekrar Dene</button>
            </div>
          `,s.querySelector("#btn-drama-retry")?.addEventListener("click",()=>D()),$(m)}finally{a===g&&(T=!1,L()&&H.getBoundingClientRect().top<window.innerHeight+800&&setTimeout(x,0))}}function J(a=0){if(!v||v.length===0){m.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="film" style="width: 48px; height: 48px; color: #94a3b8;"></i>
              <h3>Eşleşen Kısa Dizi Bulunamadı</h3>
              <p>Farklı bir anahtar kelime ile arama yapabilir veya Trend kategorisine göz atabilirsiniz.</p>
            </div>
          `,I.textContent="0 Dizi",$(m);return}I.textContent=`${v.length} Dizi`;const e=v.slice(a).map((t,u)=>{const r=t.isDubbed||t.title.toLowerCase().includes("dublaj"),p=t.poster||"";return`
            <article class="drama-card" data-slug="${t.slug}" tabindex="0" role="button" aria-label="${t.title}">
              <div class="drama-card-poster-wrap">
                ${p?`
                  <img 
                    src="${p}" 
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
          `}).join("");a?m.insertAdjacentHTML("beforeend",e):m.innerHTML=e,$(m)}m.addEventListener("click",a=>{const e=a.target.closest(".drama-card")?.getAttribute("data-slug");e&&O(e)}),m.addEventListener("keydown",a=>{if(a.key!=="Enter"&&a.key!==" ")return;const e=a.target.closest(".drama-card")?.getAttribute("data-slug");e&&(a.preventDefault(),O(e))});async function O(a){if(a){b=null,P.classList.remove("hidden"),document.body.style.overflow="hidden",o.innerHTML=`
          <div class="drama-detail-loading">
            <div class="spin-loader"></div>
            <span>Dizi bilgileri ve bölümler yükleniyor...</span>
          </div>
        `,$(o);try{const e=await ra(a);if(!e){o.innerHTML=`
              <div class="drama-empty-state">
                <i data-lucide="alert-circle" style="width: 38px; height: 38px; color: #ef4444;"></i>
                <h3>Dizi bilgisi alınamadı</h3>
                <button class="btn-primary" id="btn-close-drama-modal">Kapat</button>
              </div>
            `,s.querySelector("#btn-close-drama-modal")?.addEventListener("click",K),$(o);return}b=e,Q()}catch{K(),N("Dizi detayları yüklenemedi.","error")}}}function Q(){if(!b)return;const{slug:a,title:e,poster:t,description:u,episodes:r=[],isDubbed:p}=b,l=r.length,G=w?r.filter(i=>i.title.toLowerCase().includes(w)||String(i.episode).includes(w)):r;o.innerHTML=`
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
                  <span class="drama-badge-pill ${p?"badge-dub":"badge-sub"}">
                    ${p?"🇹🇷 TÜRKÇE DUBLAJ":"TR ALTYAZI"}
                  </span>
                  <span class="drama-badge-pill badge-type">MİNİ DİZİ</span>
                  <span class="drama-badge-pill badge-ep-count">${l} BÖLÜM</span>
                  <span class="drama-badge-pill badge-server">DDZ VIP HLS</span>
                </div>
                <h2 class="drama-detail-title">${e}</h2>
                <p class="drama-detail-desc">${u||"Bu kısa dizi için henüz özet girilmedi."}</p>
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
                <h3>Bölümler (${l})</h3>
                <span class="drama-episodes-sub">Bölüme tıklayarak reklamsız izleyin</span>
              </div>
              <div class="drama-episodes-filter-box">
                <i data-lucide="search" style="width: 15px; height: 15px; color: #94a3b8;"></i>
                <input 
                  type="text" 
                  id="drama-ep-filter-input" 
                  placeholder="Bölüm ara... (Örn: 25)" 
                  value="${w}"
                />
              </div>
            </div>

            <div class="drama-episodes-grid" id="drama-episodes-grid">
              ${G.map(i=>{const j=ta(`ddz_${a}`,i.season,i.episode);return`
                  <button 
                    class="drama-ep-card ${j?"is-watched":""}" 
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
                      ${j?'<div class="drama-ep-watched-tag"><i data-lucide="check" style="width: 12px; height: 12px;"></i></div>':""}
                    </div>
                    <div class="drama-ep-title-wrap">
                      <span class="drama-ep-name">${i.title}</span>
                      <span class="drama-ep-action-hint">İzle</span>
                    </div>
                  </button>
                `}).join("")}
            </div>
          </div>
        `,$(o),o.querySelector("#btn-close-drama-modal")?.addEventListener("click",K),o.querySelector("#btn-play-drama-start")?.addEventListener("click",()=>{r.length>0&&X(r[0].season,r[0].episode)}),o.querySelector("#btn-share-drama")?.addEventListener("click",()=>{const i=`${window.location.origin}${window.location.pathname}#dramas?slug=${a}`;navigator.clipboard?.writeText(i).then(()=>{N("Dizi bağlantısı panoya kopyalandı!","success")}).catch(()=>{N(`Bağlantı: ${i}`,"info")})});const S=o.querySelector("#drama-ep-filter-input");S&&S.addEventListener("input",i=>{w=i.target.value.toLowerCase().trim(),Q(),o.querySelector("#drama-ep-filter-input")?.focus()}),o.querySelectorAll(".drama-ep-card").forEach(i=>{i.addEventListener("click",()=>{const j=parseInt(i.getAttribute("data-season"),10)||1,ea=parseInt(i.getAttribute("data-episode"),10)||1;X(j,ea)})})}function K(){P.classList.add("hidden"),document.body.style.overflow="",b=null,w=""}P.addEventListener("click",a=>{a.target===P&&K()});function X(a=1,e=1){if(!b)return;const{slug:t,title:u,poster:r,description:p,episodes:l=[]}=b,G=l.find(S=>S.season===a&&S.episode===e)?.thumb||"";ia({type:"tv",tmdbId:`ddz_${t}`,title:`${u} - B${e}`,seriesTitle:u,season:a,episode:e,posterPath:r,backdropPath:r,playerVariant:"short-drama",seriesOverview:p||"",episodeArtworkPath:G||r,shortDramaEpisodes:l,maxEpisodes:l.length,seasonsList:[{season_number:a,episode_count:l.length}]})}k?.addEventListener("input",a=>{const e=a.target.value;A.classList.toggle("hidden",!e),clearTimeout(R),R=setTimeout(()=>{d=e.trim(),h=0,n=d?"search":"trending",B.forEach(t=>t.classList.toggle("active",!d&&t.getAttribute("data-tab-id")==="trending")),D()},350)}),k?.addEventListener("keydown",a=>{a.key==="Enter"&&(a.preventDefault(),clearTimeout(R),d=k.value.trim(),h=0,D())}),A?.addEventListener("click",()=>{k.value="",A.classList.add("hidden"),d="",n="trending",B.forEach(a=>a.classList.toggle("active",a.getAttribute("data-tab-id")==="trending")),D()}),B.forEach(a=>{a.addEventListener("click",()=>{const e=a.getAttribute("data-tab-id");n===e&&!d||(n=e,d="",k&&(k.value=""),A?.classList.add("hidden"),h=0,B.forEach(t=>t.classList.toggle("active",t===a)),D())})}),E?.addEventListener("click",x),await D(),L()&&H.getBoundingClientRect().top<window.innerHeight+800&&x(),_&&O(_)}}}export{pa as renderDramaView};

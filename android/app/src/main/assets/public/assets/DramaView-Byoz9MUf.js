import{r as b,s as R,x as ia,o as ra}from"./index-BofF-q_g.js";import{f as sa,a as z,b as da}from"./dramaDizilerimScraper-k681Hg-U.js";import"./vendor-capacitor-VGCIBgSg.js";async function ua(_=null,U=""){let l=U?"search":"trending",d=U||"",m=0,A=!0,S=!0,v=[],f=null,L="";const H=[{id:"trending",label:"Trendler",icon:"flame",query:""},{id:"all",label:"Tüm Katalog",icon:"layers",query:""},{id:"dubbed",label:"Türkçe Dublaj",icon:"sparkles",query:"dublaj"},{id:"patron",label:"CEO & Patron",icon:"briefcase",query:"patron"},{id:"kurt",label:"Kurt & Alfa",icon:"moon",query:"kurt"},{id:"intikam",label:"İntikam & Aşk",icon:"heart-crack",query:"intikam"},{id:"milyarder",label:"Milyarder",icon:"crown",query:"milyarder"},{id:"evlilik",label:"Yasak Aşk & Evlilik",icon:"ring",query:"evlilik"}];return{html:`
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
            ${H.map(w=>`
              <button 
                class="drama-chip ${l===w.id?"active":""}" 
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
  `,init:async w=>{const r=w.querySelector("#drama-view-root");if(!r)return;const x=r.querySelector("#drama-search-input"),C=r.querySelector("#btn-drama-search-clear");r.querySelector("#drama-search-feedback");const P=r.querySelectorAll(".drama-chip"),B=r.querySelector("#drama-section-title"),V=r.querySelector("#drama-counter-badge"),u=r.querySelector("#drama-cards-grid"),c=r.querySelector("#drama-load-more-wrap"),q=r.querySelector("#btn-drama-load-more"),K=r.querySelector("#drama-scroll-sentinel"),j=r.querySelector("#drama-detail-modal"),o=r.querySelector("#drama-modal-dialog");let Y=null,h=0,k=0,Z=0,F=null;const O=a=>{Z!==a&&(Z=a,F=z({page:a}).catch(()=>null))},W=async a=>{if(Z===a&&F){const e=await F;if(e)return e}return z({page:a})},G=()=>{const a=d.trim();return a.length>=2?a:H.find(e=>e.id===l)?.query||""},aa=a=>{const e=G();return e?z({query:e,page:a}):W(a)},D=()=>(l==="trending"||l==="all"||!!G())&&A,T=async()=>{if(S||!D())return;const a=m+1,e=h;S=!0,q.disabled=!0,c.classList.remove("hidden"),c.classList.add("is-loading"),c.classList.remove("is-error"),q.querySelector("span").textContent="Diziler yükleniyor...";let t=!1;try{const g=await aa(a);if(e!==h)return;const s=new Set(v.map(p=>p.slug)),n=g.filter(p=>!s.has(p.slug)&&s.add(p.slug));if(m=a,A=n.length>0,t=!0,k=0,A&&!G()&&O(a+1),n.length){const p=v.length;v.push(...n),J(p)}}catch{if(e!==h)return;k++,k<=2&&setTimeout(()=>{e===h&&T()},k*800);return}finally{if(e!==h)return;S=!1,q.disabled=!1,q.querySelector("span").textContent="Daha Fazla Dizi Yükle",c.classList.remove("is-loading"),c.classList.toggle("is-error",k>2&&D()),c.classList.toggle("hidden",k<=2||!D()),t&&D()&&K.getBoundingClientRect().top<window.innerHeight+800&&setTimeout(T,0)}};new IntersectionObserver(a=>{a.some(e=>e.isIntersecting)&&T()},{rootMargin:"800px 0px"}).observe(K);async function $(){const a=++h;k=0,S=!0,u.innerHTML=Array.from({length:12}).map(()=>`
          <div class="drama-card-skeleton">
            <div class="skeleton-poster"></div>
            <div class="skeleton-title"></div>
          </div>
        `).join(""),V.textContent="Yükleniyor...";try{let e=[];if(d&&d.trim().length>=2)e=await z({query:d.trim()}),B.innerHTML=`
              <i data-lucide="search" style="width: 20px; height: 20px; color: #a855f7;"></i>
              <span>"${d}" İçin Arama Sonuçları</span>
            `,c.classList.add("hidden");else{const t=H.find(g=>g.id===l)||H[0];l==="trending"?(O(1),e=await da(),m=0,B.innerHTML=`
                <i data-lucide="flame" style="width: 20px; height: 20px; color: #f43f5e;"></i>
                <span>Trend Kısa Diziler</span>
              `,c.classList.add("hidden")):l==="all"?(e=await W(1),m=1,O(2),B.innerHTML=`
                <i data-lucide="layers" style="width: 20px; height: 20px; color: #3b82f6;"></i>
                <span>Tüm Kısa Diziler Kataloğu (Sayfa ${m})</span>
              `,c.classList.toggle("hidden",e.length===0)):t.query&&(e=await z({query:t.query}),B.innerHTML=`
                <i data-lucide="${t.icon}" style="width: 20px; height: 20px; color: #c084fc;"></i>
                <span>${t.label} Serileri</span>
              `,c.classList.add("hidden"))}if(a!==h)return;v=e,l!=="trending"&&(m=1),A=l==="trending"||e.length>0,c.classList.add("hidden"),J()}catch{if(a!==h)return;u.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="alert-circle" style="width: 44px; height: 44px; color: #ef4444;"></i>
              <h3>Diziler yüklenirken bir sorun oluştu</h3>
              <p>Lütfen internet bağlantınızı kontrol edip tekrar deneyin.</p>
              <button class="btn-primary" id="btn-drama-retry">Tekrar Dene</button>
            </div>
          `,r.querySelector("#btn-drama-retry")?.addEventListener("click",()=>$()),b(u)}finally{a===h&&(S=!1,D()&&K.getBoundingClientRect().top<window.innerHeight+800&&setTimeout(T,0))}}function J(a=0){if(!v||v.length===0){u.innerHTML=`
            <div class="drama-empty-state">
              <i data-lucide="film" style="width: 48px; height: 48px; color: #94a3b8;"></i>
              <h3>Eşleşen Kısa Dizi Bulunamadı</h3>
              <p>Farklı bir anahtar kelime ile arama yapabilir veya Trend kategorisine göz atabilirsiniz.</p>
            </div>
          `,V.textContent="0 Dizi",b(u);return}V.textContent=`${v.length} Dizi`;const e=v.slice(a).map((t,g)=>{const s=t.isDubbed||t.title.toLowerCase().includes("dublaj"),n=t.poster||"";return`
            <article class="drama-card" data-slug="${t.slug}" tabindex="0" role="button" aria-label="${t.title}">
              <div class="drama-card-poster-wrap">
                ${n?`
                  <img 
                    src="${n}" 
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
                  <span class="drama-badge-pill ${s?"badge-dub":"badge-sub"}">
                    ${s?"🇹🇷 DUBLAJ":"TR ALTYAZI"}
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
          `}).join("");a?u.insertAdjacentHTML("beforeend",e):u.innerHTML=e,b(u)}u.addEventListener("click",a=>{const e=a.target.closest(".drama-card")?.getAttribute("data-slug");e&&N(e)}),u.addEventListener("keydown",a=>{if(a.key!=="Enter"&&a.key!==" ")return;const e=a.target.closest(".drama-card")?.getAttribute("data-slug");e&&(a.preventDefault(),N(e))});async function N(a){if(a){f=null,j.classList.remove("hidden"),document.body.style.overflow="hidden",o.innerHTML=`
          <div class="drama-detail-loading">
            <div class="spin-loader"></div>
            <span>Dizi bilgileri ve bölümler yükleniyor...</span>
          </div>
        `,b(o);try{const e=await sa(a);if(!e){o.innerHTML=`
              <div class="drama-empty-state">
                <i data-lucide="alert-circle" style="width: 38px; height: 38px; color: #ef4444;"></i>
                <h3>Dizi bilgisi alınamadı</h3>
                <button class="btn-primary" id="btn-close-drama-modal">Kapat</button>
              </div>
            `,r.querySelector("#btn-close-drama-modal")?.addEventListener("click",M),b(o);return}f=e,Q()}catch{M(),R("Dizi detayları yüklenemedi.","error")}}}function Q(){if(!f)return;const{slug:a,title:e,poster:t,description:g,episodes:s=[],isDubbed:n}=f,p=s.length,E=L?s.filter(i=>i.title.toLowerCase().includes(L)||String(i.episode).includes(L)):s;o.innerHTML=`
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
                  <span class="drama-badge-pill ${n?"badge-dub":"badge-sub"}">
                    ${n?"🇹🇷 TÜRKÇE DUBLAJ":"TR ALTYAZI"}
                  </span>
                  <span class="drama-badge-pill badge-type">MİNİ DİZİ</span>
                  <span class="drama-badge-pill badge-ep-count">${p} BÖLÜM</span>
                  <span class="drama-badge-pill badge-server">DDZ VIP HLS</span>
                </div>
                <h2 class="drama-detail-title">${e}</h2>
                <p class="drama-detail-desc">${g||"Bu kısa dizi için henüz özet girilmedi."}</p>
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
                <h3>Bölümler (${p})</h3>
                <span class="drama-episodes-sub">Bölüme tıklayarak reklamsız izleyin</span>
              </div>
              <div class="drama-episodes-filter-box">
                <i data-lucide="search" style="width: 15px; height: 15px; color: #94a3b8;"></i>
                <input 
                  type="text" 
                  id="drama-ep-filter-input" 
                  placeholder="Bölüm ara... (Örn: 25)" 
                  value="${L}"
                />
              </div>
            </div>

            <div class="drama-episodes-grid" id="drama-episodes-grid">
              ${E.map(i=>{const y=ia(`ddz_${a}`,i.season,i.episode);return`
                  <button 
                    class="drama-ep-card ${y?"is-watched":""}" 
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
                      ${y?'<div class="drama-ep-watched-tag"><i data-lucide="check" style="width: 12px; height: 12px;"></i></div>':""}
                    </div>
                    <div class="drama-ep-title-wrap">
                      <span class="drama-ep-name">${i.title}</span>
                      <span class="drama-ep-action-hint">İzle</span>
                    </div>
                  </button>
                `}).join("")}
            </div>
          </div>
        `,b(o),o.querySelector("#btn-close-drama-modal")?.addEventListener("click",M),o.querySelector("#btn-play-drama-start")?.addEventListener("click",i=>{s.length>0&&X(s[0].season,s[0].episode,i.currentTarget)}),o.querySelector("#btn-share-drama")?.addEventListener("click",()=>{const i=`${window.location.origin}${window.location.pathname}#dramas?slug=${a}`;navigator.clipboard?.writeText(i).then(()=>{R("Dizi bağlantısı panoya kopyalandı!","success")}).catch(()=>{R(`Bağlantı: ${i}`,"info")})});const I=o.querySelector("#drama-ep-filter-input");I&&I.addEventListener("input",i=>{L=i.target.value.toLowerCase().trim(),Q(),o.querySelector("#drama-ep-filter-input")?.focus()}),o.querySelectorAll(".drama-ep-card").forEach(i=>{i.addEventListener("click",y=>{const ea=parseInt(i.getAttribute("data-season"),10)||1,ta=parseInt(i.getAttribute("data-episode"),10)||1;X(ea,ta,y.currentTarget)})})}function M(){j.classList.add("hidden"),document.body.style.overflow="",f=null,L=""}j.addEventListener("click",a=>{a.target===j&&M()});async function X(a=1,e=1,t=null){if(!f)return;const{slug:g,title:s,poster:n,description:p,episodes:E=[]}=f,I=E.find(y=>y.season===a&&y.episode===e)?.thumb||"",i=t?t.innerHTML:null;t&&(t.disabled=!0,t.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:14px;height:14px"></i> <span>Yükleniyor...</span>',b(t));try{M(),await ra({type:"tv",tmdbId:`ddz_${g}`,title:`${s} - B${e}`,seriesTitle:s,season:a,episode:e,posterPath:n,backdropPath:n,playerVariant:"short-drama",seriesOverview:p||"",episodeArtworkPath:I||n,shortDramaEpisodes:E,maxEpisodes:E.length,seasonsList:[{season_number:a,episode_count:E.length}]})}catch{R("Bölüm açılırken bir sorun oluştu, lütfen tekrar deneyin.","error")}finally{t&&i&&(t.disabled=!1,t.innerHTML=i,b(t))}}x?.addEventListener("input",a=>{const e=a.target.value;C.classList.toggle("hidden",!e),clearTimeout(Y),Y=setTimeout(()=>{d=e.trim(),m=0,l=d?"search":"trending",P.forEach(t=>t.classList.toggle("active",!d&&t.getAttribute("data-tab-id")==="trending")),$()},350)}),x?.addEventListener("keydown",a=>{a.key==="Enter"&&(a.preventDefault(),clearTimeout(Y),d=x.value.trim(),m=0,$())}),C?.addEventListener("click",()=>{x.value="",C.classList.add("hidden"),d="",l="trending",P.forEach(a=>a.classList.toggle("active",a.getAttribute("data-tab-id")==="trending")),$()}),P.forEach(a=>{a.addEventListener("click",()=>{const e=a.getAttribute("data-tab-id");l===e&&!d||(l=e,d="",x&&(x.value=""),C?.classList.add("hidden"),m=0,P.forEach(t=>t.classList.toggle("active",t===a)),$())})}),q?.addEventListener("click",T),await $(),D()&&K.getBoundingClientRect().top<window.innerHeight+800&&T(),_&&N(_)}}}export{ua as renderDramaView};

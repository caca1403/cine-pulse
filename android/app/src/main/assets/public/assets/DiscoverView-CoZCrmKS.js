import{h as G,_ as Q,r as H,j as J,$ as i,a0 as o}from"./index-BhQWUMv-.js";import"./vendor-capacitor-VGCIBgSg.js";const e={currentType:"tv",currentGenreId:null,currentSortBy:"popularity.desc",currentMinRating:0,currentPlatform:null,currentYearRange:"all",currentPage:1,allItems:[],isExhausted:!1};async function te(R="tv"){R&&R!==e.currentType&&e.allItems.length===0&&(e.currentType=R);let a=e.currentType,f=e.currentGenreId,m=e.currentSortBy,u=e.currentMinRating,c=e.currentPlatform,n=e.currentYearRange,b=!1;const q=[{id:null,name:"Tüm Türler"},{id:o.MYSTERY,name:"Korku & Gerilim"},{id:o.ACTION_ADVENTURE,name:"Aksiyon & Macera"},{id:o.SCI_FI_FANTASY,name:"Bilim Kurgu & Fantastik"},{id:o.DRAMA,name:"Dram"},{id:o.COMEDY,name:"Komedi"},{id:o.CRIME,name:"Suç & Polisiye"},{id:o.ANIMATION,name:"Animasyon & Anime"},{id:o.DOCUMENTARY,name:"Belgesel"},{id:o.FAMILY,name:"Aile & Gençlik"},{id:o.WAR_POLITICS,name:"Savaş & Politika"},{id:o.WESTERN,name:"Western"}],z=[{id:null,name:"Tüm Türler"},{id:i.HORROR,name:"Korku"},{id:i.THRILLER,name:"Gerilim"},{id:i.ACTION,name:"Aksiyon"},{id:i.ADVENTURE,name:"Macera"},{id:i.SCI_FI,name:"Bilim Kurgu"},{id:i.FANTASY,name:"Fantastik"},{id:i.DRAMA,name:"Dram"},{id:i.COMEDY,name:"Komedi"},{id:i.CRIME,name:"Suç"},{id:i.ANIMATION,name:"Animasyon"},{id:i.MYSTERY,name:"Gizem"},{id:i.ROMANCE,name:"Romantik"},{id:i.DOCUMENTARY,name:"Belgesel"},{id:i.HISTORY,name:"Tarih & Savaş"},{id:i.FAMILY,name:"Aile"},{id:i.MUSIC,name:"Müzikal"},{id:i.WESTERN,name:"Western"}],K=()=>a==="movie"?z:q,_=e.allItems.length>0,V=_?e.allItems.map(l=>G(l)).join(""):'<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">İçerikler yükleniyor...</div>';return{html:`
    <div class="discover-view" style="padding-top: 6.5rem; padding-bottom: 5rem;">
      <div class="container">
        
        <header class="discover-header-card cp-view-header">
          <div><span class="cp-eyebrow">TAM SENLİK.</span>
            <h1><i data-lucide="compass" aria-hidden="true"></i> Detaylı Keşif</h1>
            <p>Türünü, yılını ve puanını seç. Sıradaki hikâyeni bul.</p>
          </div>
          <div class="cp-view-header-actions"></div>
        </header>

        <!-- Filter Controls Container -->
        <div class="discover-controls-wrap glass-panel" style="padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 2rem; border: 1px solid var(--border-color);">
          
          <!-- Type Filter Tabs Segmented Track (Apple TV+ Capsule) -->
          <div class="discover-segmented-deck">
            <button id="discover-type-tv" class="discover-type-tab ${a==="tv"?"active":""}">
              <i data-lucide="tv" style="width:16px; height:16px;"></i> Diziler
            </button>
            <button id="discover-type-movie" class="discover-type-tab ${a==="movie"?"active":""}">
              <i data-lucide="clapperboard" style="width:16px; height:16px;"></i> Filmler
            </button>
            <button id="discover-type-anime" class="discover-type-tab ${a==="anime"?"active":""}">
              <i data-lucide="sparkles" style="width:16px; height:16px;"></i> Anime
            </button>
            <button id="discover-type-doc" class="discover-type-tab ${a==="documentary"?"active":""}">
              <i data-lucide="globe" style="width:16px; height:16px;"></i> Belgesel
            </button>
          </div>

          <!-- Secondary Filters Row (Mega Filter) -->
          <div class="cp-filter-grid">
            
            <!-- Platform Filter -->
            <div>
              <label for="discover-platform-select" style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="tv" style="width:12px; height:12px;"></i> Yayın Platformu
              </label>
              <select id="discover-platform-select" class="discover-filter-select">
                <option value="" ${c?"":"selected"}>Tüm Platformlar</option>
                <option value="213" ${c==="213"?"selected":""}>Netflix</option>
                <option value="49" ${c==="49"?"selected":""}>HBO / Max</option>
                <option value="2739" ${c==="2739"?"selected":""}>Disney+</option>
                <option value="1024" ${c==="1024"?"selected":""}>Amazon Prime</option>
                <option value="2552" ${c==="2552"?"selected":""}>Apple TV+</option>
              </select>
            </div>

            <!-- Year Range Filter -->
            <div>
              <label for="discover-year-select" style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="calendar" style="width:12px; height:12px;"></i> Çıkış Yılı Aralığı
              </label>
              <select id="discover-year-select" class="discover-filter-select">
                <option value="all" ${n==="all"?"selected":""}>Tüm Yıllar</option>
                <option value="2024-2026" ${n==="2024-2026"?"selected":""}>2024 - 2026 (En Yeniler)</option>
                <option value="2020-2023" ${n==="2020-2023"?"selected":""}>2020 - 2023 (Son Yıllar)</option>
                <option value="2010-2019" ${n==="2010-2019"?"selected":""}>2010 - 2019 (2010'lar)</option>
                <option value="2000-2009" ${n==="2000-2009"?"selected":""}>2000 - 2009 (2000'ler)</option>
                <option value="1990-1999" ${n==="1990-1999"?"selected":""}>1990 - 1999 (90'lar)</option>
                <option value="before-1990" ${n==="before-1990"?"selected":""}>1990 Öncesi (Klasikler)</option>
              </select>
            </div>

            <!-- Sort Filter -->
            <div>
              <label for="discover-sort-select" style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="arrow-down-up" style="width:12px; height:12px;"></i> Sıralama Ölçütü
              </label>
              <select id="discover-sort-select" class="discover-filter-select">
                <option value="popularity.desc" ${m==="popularity.desc"?"selected":""}>En Popülerler (Trend)</option>
                <option value="vote_average.desc" ${m==="vote_average.desc"?"selected":""}>En Yüksek IMDb Puanı</option>
                <option value="vote_count.desc" ${m==="vote_count.desc"?"selected":""}>En Çok Oylananlar</option>
                <option value="first_air_date.desc" ${m==="first_air_date.desc"?"selected":""}>En Yeniler (Vizyon / Çıkış)</option>
              </select>
            </div>

            <!-- Min IMDb Rating Slider/Select -->
            <div>
              <label for="discover-rating-select" style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="star" style="width:12px; height:12px;"></i> Minimum IMDb Puanı
              </label>
              <select id="discover-rating-select" class="discover-filter-select">
                <option value="0" ${u===0?"selected":""}>Tümü (Puan Sınırı Yok)</option>
                <option value="8.0" ${u===8?"selected":""}>8.0 ve Üzeri (Başyapıtlar)</option>
                <option value="7.5" ${u===7.5?"selected":""}>7.5 ve Üzeri (Çok Yüksek)</option>
                <option value="7.0" ${u===7?"selected":""}>7.0 ve Üzeri (Çok İyi)</option>
                <option value="6.0" ${u===6?"selected":""}>6.0 ve Üzeri (İyi)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Quick Genre Pills Filter Bar -->
        <div id="discover-genre-bar" class="genre-pills-bar" style="display: flex; gap: 0.6rem; overflow-x: auto; padding-bottom: 1.2rem; margin-bottom: 2rem; scrollbar-width: none;">
          <!-- Dynamically populated -->
        </div>

        <!-- Results Grid -->
        <div class="media-grid" id="discover-media-grid">
          ${V}
        </div>

        <!-- Scroll Sentinel / Loader -->
        <div id="discover-sentinel" style="height: 60px; display: flex; align-items: center; justify-content: center; margin-top: 2rem; color: var(--text-muted);">
          <i data-lucide="loader-2" class="spin-loader" style="width: 28px; height: 28px; display: none;"></i>
        </div>

      </div>
    </div>
  `,init:l=>{if(!l)return;const E=l.querySelector("#discover-type-tv"),S=l.querySelector("#discover-type-movie"),M=l.querySelector("#discover-type-anime"),k=l.querySelector("#discover-type-doc"),L=l.querySelector("#discover-platform-select"),$=l.querySelector("#discover-year-select"),F=l.querySelector("#discover-sort-select"),D=l.querySelector("#discover-rating-select"),Y=l.querySelector("#discover-genre-bar"),v=l.querySelector("#discover-media-grid"),I=l.querySelector("#discover-sentinel"),s=I?I.querySelector(".spin-loader"):null;L&&L.addEventListener("change",()=>{c=L.value||null,e.currentPlatform=c,p()}),$&&$.addEventListener("change",()=>{n=$.value||"all",e.currentYearRange=n,p()});const P=()=>{const t=K();Y.innerHTML=t.map(r=>`
          <button class="genre-pill-btn ${f===r.id?"active":""}" data-genre-id="${r.id||""}">
            ${r.name}
          </button>
        `).join(""),Y.querySelectorAll(".genre-pill-btn").forEach(r=>{r.addEventListener("click",()=>{const d=r.dataset.genreId?parseInt(r.dataset.genreId,10):null;f!==d&&(f=d,Y.querySelectorAll(".genre-pill-btn").forEach(x=>x.classList.remove("active")),r.classList.add("active"),p())})})};let h=0;const T=async t=>{const r=t||h;if(b||e.isExhausted)return;b=!0,s&&(s.style.display="block");const d=e.currentPage||1;try{const x=a==="anime"||a==="documentary"?"tv":a,j=a==="anime",W=a==="documentary";let N=m;m==="first_air_date.desc"&&x==="movie"&&(N="primary_release_date.desc");let y=null,g=null;n==="2024-2026"?(y=2024,g=2026):n==="2020-2023"?(y=2020,g=2023):n==="2010-2019"?(y=2010,g=2019):n==="2000-2009"?(y=2e3,g=2009):n==="1990-1999"?(y=1990,g=1999):n==="before-1990"&&(y=1940,g=1989);const w=await Q({type:x,genreId:f,page:d,sortBy:N,minRating:u,isAnime:j,isDoc:W,yearMin:y,yearMax:g,withNetworks:c});if(r!==h)return;if(s&&(s.style.display="none"),!w||w.length===0){d===1&&(v.innerHTML='<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted); font-size: 1.05rem;">Bu filtre kriterlerine uygun içerik bulunamadı.</div>'),e.isExhausted=!0;return}e.allItems=[...e.allItems,...w],e.currentType=a,e.currentGenreId=f,e.currentSortBy=m,e.currentMinRating=u;const O=w.map(U=>G(U)).join("");d===1?v.innerHTML=O:v.insertAdjacentHTML("beforeend",O),H(),J(v),e.currentPage=d+1}catch{if(r!==h)return;s&&(s.style.display="none"),d===1&&(!e.allItems||e.allItems.length===0)&&(v.innerHTML=`
              <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
                <p style="margin-bottom: 0.75rem;">İçerikler getirilirken bir sorun oluştu.</p>
                <button id="btn-retry-discover" class="btn-secondary" style="padding: 0.5rem 1.2rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                  <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
                  <span>Tekrar Dene</span>
                </button>
              </div>
            `,H(),v.querySelector("#btn-retry-discover")?.addEventListener("click",()=>{p()}))}finally{r===h&&(b=!1,s&&(s.style.display="none"))}},p=()=>{h++;const t=h;e.currentPage=1,e.allItems=[],e.isExhausted=!1,b=!1,v.innerHTML=`
          <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
            <div class="spin-loader" style="width: 32px; height: 32px; border: 3px solid rgba(223, 255, 118,0.2); border-top-color: #dfff76; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem;"></div>
            <div>İçerikler yükleniyor...</div>
          </div>
        `,s&&(s.style.display="none"),T(t)};P(),_||T();let C=null;I&&"IntersectionObserver"in window&&(C=new IntersectionObserver(t=>{t[0].isIntersecting&&T()},{rootMargin:"0px 0px 600px 0px"}),C.observe(I));const B=()=>{if(b||e.isExhausted)return;const t=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0,r=window.innerHeight,d=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);t+r>=d-700&&T()};window.addEventListener("scroll",B,{passive:!0}),window.__discoverCleanup=()=>{C?.disconnect(),window.removeEventListener("scroll",B)};const A=t=>{a!==t&&(a=t,f=null,[E,S,M,k].forEach(r=>r?.classList.remove("active")),t==="tv"&&E?.classList.add("active"),t==="movie"&&S?.classList.add("active"),t==="anime"&&M?.classList.add("active"),t==="documentary"&&k?.classList.add("active"),P(),p())};E&&E.addEventListener("click",()=>A("tv")),S&&S.addEventListener("click",()=>A("movie")),M&&M.addEventListener("click",()=>A("anime")),k&&k.addEventListener("click",()=>A("documentary")),F&&F.addEventListener("change",t=>{m=t.target.value,p()}),D&&D.addEventListener("change",t=>{u=parseFloat(t.target.value),p()})}}}export{te as renderDiscoverView};

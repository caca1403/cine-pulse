import{h as O,_ as Q,r as z,j as J,$ as i,a0 as o}from"./index-COeBT974.js";import"./vendor-capacitor-VGCIBgSg.js";const e={currentType:"tv",currentGenreId:null,currentSortBy:"popularity.desc",currentMinRating:0,currentPlatform:null,currentYearRange:"all",currentPage:1,allItems:[],isExhausted:!1};async function te(R="tv"){R&&R!==e.currentType&&e.allItems.length===0&&(e.currentType=R);let n=e.currentType,f=e.currentGenreId,m=e.currentSortBy,u=e.currentMinRating,c=e.currentPlatform,a=e.currentYearRange,b=!1;const G=[{id:null,name:"Tüm Türler"},{id:o.MYSTERY,name:"🩸 Korku & Gerilim"},{id:o.ACTION_ADVENTURE,name:"💥 Aksiyon & Macera"},{id:o.SCI_FI_FANTASY,name:"🚀 Bilim Kurgu & Fantastik"},{id:o.DRAMA,name:"🎭 Dram"},{id:o.COMEDY,name:"😂 Komedi"},{id:o.CRIME,name:"🕵️ Suç & Polisiye"},{id:o.ANIMATION,name:"🎌 Animasyon & Anime"},{id:o.DOCUMENTARY,name:"🌍 Belgesel"},{id:o.FAMILY,name:"👨‍👩‍👧‍👦 Aile & Gençlik"},{id:o.WAR_POLITICS,name:"⚔️ Savaş & Politika"},{id:o.WESTERN,name:"🤠 Western"}],q=[{id:null,name:"Tüm Türler"},{id:i.HORROR,name:"🩸 Korku"},{id:i.THRILLER,name:"⚡ Gerilim"},{id:i.ACTION,name:"💥 Aksiyon"},{id:i.ADVENTURE,name:"🗺️ Macera"},{id:i.SCI_FI,name:"🚀 Bilim Kurgu"},{id:i.FANTASY,name:"🧙‍♂️ Fantastik"},{id:i.DRAMA,name:"🎭 Dram"},{id:i.COMEDY,name:"😂 Komedi"},{id:i.CRIME,name:"🕵️ Suç"},{id:i.ANIMATION,name:"🎌 Animasyon"},{id:i.MYSTERY,name:"🔍 Gizem"},{id:i.ROMANCE,name:"💖 Romantik"},{id:i.DOCUMENTARY,name:"🌍 Belgesel"},{id:i.HISTORY,name:"🏰 Tarih & Savaş"},{id:i.FAMILY,name:"👨‍👩‍👧‍👦 Aile"},{id:i.MUSIC,name:"🎵 Müzikal"},{id:i.WESTERN,name:"🤠 Western"}],V=()=>n==="movie"?q:G,F=e.allItems.length>0,j=F?e.allItems.map(l=>O(l)).join(""):'<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">İçerikler yükleniyor...</div>';return{html:`
    <div class="discover-view" style="padding-top: 6.5rem; padding-bottom: 5rem;">
      <div class="container">
        
        <!-- Header Banner -->
        <div class="discover-header-card glass-panel" style="padding: 2rem; border-radius: var(--radius-lg); margin-bottom: 2rem; background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(20, 184, 166, 0.08) 100%); border: 1px solid var(--border-light);">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
            <div>
              <h1 style="font-size: 2.2rem; font-weight: 800; display: flex; align-items: center; gap: 0.75rem; color: #fff;">
                <i data-lucide="compass" style="color: var(--primary)"></i> Özelleştirilebilir Sinema Filtresi
              </h1>
              <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 0.35rem;">
                Platforma, türe, IMDb puanına ve çıkış yılına göre nokta atışı arama yapın
              </p>
            </div>
          </div>
        </div>

        <!-- Filter Controls Container -->
        <div class="discover-controls-wrap glass-panel" style="padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 2rem; border: 1px solid var(--border-color);">
          
          <!-- Type Filter Tabs Segmented Track (Apple TV+ Capsule) -->
          <div class="discover-segmented-deck">
            <button id="discover-type-tv" class="discover-type-tab ${n==="tv"?"active":""}">
              <i data-lucide="tv-2" style="width:16px; height:16px;"></i> Diziler
            </button>
            <button id="discover-type-movie" class="discover-type-tab ${n==="movie"?"active":""}">
              <i data-lucide="clapperboard" style="width:16px; height:16px;"></i> Filmler
            </button>
            <button id="discover-type-anime" class="discover-type-tab ${n==="anime"?"active":""}">
              <i data-lucide="sparkles" style="width:16px; height:16px;"></i> Anime
            </button>
            <button id="discover-type-doc" class="discover-type-tab ${n==="documentary"?"active":""}">
              <i data-lucide="globe" style="width:16px; height:16px;"></i> Belgesel
            </button>
          </div>

          <!-- Secondary Filters Row (Mega Filter) -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 1.2rem; align-items: end;">
            
            <!-- Platform Filter -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="tv" style="width:12px; height:12px;"></i> Yayın Platformu
              </label>
              <select id="discover-platform-select" class="discover-filter-select">
                <option value="" ${c?"":"selected"}>🌐 Tüm Platformlar</option>
                <option value="213" ${c==="213"?"selected":""}>🔴 Netflix</option>
                <option value="49" ${c==="49"?"selected":""}>🟣 HBO / Max</option>
                <option value="2739" ${c==="2739"?"selected":""}>🔵 Disney+</option>
                <option value="1024" ${c==="1024"?"selected":""}>🟡 Amazon Prime</option>
                <option value="2552" ${c==="2552"?"selected":""}>⚪ Apple TV+</option>
              </select>
            </div>

            <!-- Year Range Filter -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="calendar" style="width:12px; height:12px;"></i> Çıkış Yılı Aralığı
              </label>
              <select id="discover-year-select" class="discover-filter-select">
                <option value="all" ${a==="all"?"selected":""}>📅 Tüm Yıllar</option>
                <option value="2024-2026" ${a==="2024-2026"?"selected":""}>✨ 2024 - 2026 (En Yeniler)</option>
                <option value="2020-2023" ${a==="2020-2023"?"selected":""}>🌟 2020 - 2023 (Son Yıllar)</option>
                <option value="2010-2019" ${a==="2010-2019"?"selected":""}>🎬 2010 - 2019 (2010'lar)</option>
                <option value="2000-2009" ${a==="2000-2009"?"selected":""}>📼 2000 - 2009 (2000'ler)</option>
                <option value="1990-1999" ${a==="1990-1999"?"selected":""}>🎞️ 1990 - 1999 (90'lar)</option>
                <option value="before-1990" ${a==="before-1990"?"selected":""}>🏛️ 1990 Öncesi (Klasikler)</option>
              </select>
            </div>

            <!-- Sort Filter -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="arrow-down-up" style="width:12px; height:12px;"></i> Sıralama Ölçütü
              </label>
              <select id="discover-sort-select" class="discover-filter-select">
                <option value="popularity.desc" ${m==="popularity.desc"?"selected":""}>🔥 En Popülerler (Trend)</option>
                <option value="vote_average.desc" ${m==="vote_average.desc"?"selected":""}>⭐ En Yüksek IMDb Puanı</option>
                <option value="vote_count.desc" ${m==="vote_count.desc"?"selected":""}>👥 En Çok Oylananlar</option>
                <option value="first_air_date.desc" ${m==="first_air_date.desc"?"selected":""}>📅 En Yeniler (Vizyon / Çıkış)</option>
              </select>
            </div>

            <!-- Min IMDb Rating Slider/Select -->
            <div>
              <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
                <i data-lucide="star" style="width:12px; height:12px;"></i> Minimum IMDb Puanı
              </label>
              <select id="discover-rating-select" class="discover-filter-select">
                <option value="0" ${u===0?"selected":""}>Tümü (Puan Sınırı Yok)</option>
                <option value="8.0" ${u===8?"selected":""}>⭐ 8.0 ve Üzeri (Başyapıtlar)</option>
                <option value="7.5" ${u===7.5?"selected":""}>⭐ 7.5 ve Üzeri (Çok Yüksek)</option>
                <option value="7.0" ${u===7?"selected":""}>⭐ 7.0 ve Üzeri (Çok İyi)</option>
                <option value="6.0" ${u===6?"selected":""}>⭐ 6.0 ve Üzeri (İyi)</option>
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
          ${j}
        </div>

        <!-- Scroll Sentinel / Loader -->
        <div id="discover-sentinel" style="height: 60px; display: flex; align-items: center; justify-content: center; margin-top: 2rem; color: var(--text-muted);">
          <i data-lucide="loader-2" class="spin-loader" style="width: 28px; height: 28px; display: none;"></i>
        </div>

      </div>
    </div>
  `,init:l=>{if(!l)return;const E=l.querySelector("#discover-type-tv"),S=l.querySelector("#discover-type-movie"),k=l.querySelector("#discover-type-anime"),I=l.querySelector("#discover-type-doc"),L=l.querySelector("#discover-platform-select"),$=l.querySelector("#discover-year-select"),_=l.querySelector("#discover-sort-select"),P=l.querySelector("#discover-rating-select"),Y=l.querySelector("#discover-genre-bar"),p=l.querySelector("#discover-media-grid"),M=l.querySelector("#discover-sentinel"),s=M?M.querySelector(".spin-loader"):null;L&&L.addEventListener("change",()=>{c=L.value||null,e.currentPlatform=c,v()}),$&&$.addEventListener("change",()=>{a=$.value||"all",e.currentYearRange=a,v()});const D=()=>{const t=V();Y.innerHTML=t.map(r=>`
          <button class="genre-pill-btn ${f===r.id?"active":""}" data-genre-id="${r.id||""}">
            ${r.name}
          </button>
        `).join(""),Y.querySelectorAll(".genre-pill-btn").forEach(r=>{r.addEventListener("click",()=>{const d=r.dataset.genreId?parseInt(r.dataset.genreId,10):null;f!==d&&(f=d,Y.querySelectorAll(".genre-pill-btn").forEach(x=>x.classList.remove("active")),r.classList.add("active"),v())})})};let h=0;const T=async t=>{const r=t||h;if(b||e.isExhausted)return;b=!0,s&&(s.style.display="block");const d=e.currentPage||1;try{const x=n==="anime"||n==="documentary"?"tv":n,K=n==="anime",W=n==="documentary";let N=m;m==="first_air_date.desc"&&x==="movie"&&(N="primary_release_date.desc");let g=null,y=null;a==="2024-2026"?(g=2024,y=2026):a==="2020-2023"?(g=2020,y=2023):a==="2010-2019"?(g=2010,y=2019):a==="2000-2009"?(g=2e3,y=2009):a==="1990-1999"?(g=1990,y=1999):a==="before-1990"&&(g=1940,y=1989);const A=await Q({type:x,genreId:f,page:d,sortBy:N,minRating:u,isAnime:K,isDoc:W,yearMin:g,yearMax:y,withNetworks:c});if(r!==h)return;if(s&&(s.style.display="none"),!A||A.length===0){d===1&&(p.innerHTML='<div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted); font-size: 1.05rem;">Bu filtre kriterlerine uygun içerik bulunamadı.</div>'),e.isExhausted=!0;return}e.allItems=[...e.allItems,...A],e.currentType=n,e.currentGenreId=f,e.currentSortBy=m,e.currentMinRating=u;const H=A.map(U=>O(U)).join("");d===1?p.innerHTML=H:p.insertAdjacentHTML("beforeend",H),z(),J(p),e.currentPage=d+1}catch{if(r!==h)return;s&&(s.style.display="none"),d===1&&(!e.allItems||e.allItems.length===0)&&(p.innerHTML=`
              <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
                <p style="margin-bottom: 0.75rem;">İçerikler getirilirken bir sorun oluştu.</p>
                <button id="btn-retry-discover" class="btn-secondary" style="padding: 0.5rem 1.2rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                  <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
                  <span>Tekrar Dene</span>
                </button>
              </div>
            `,z(),p.querySelector("#btn-retry-discover")?.addEventListener("click",()=>{v()}))}finally{r===h&&(b=!1,s&&(s.style.display="none"))}},v=()=>{h++;const t=h;e.currentPage=1,e.allItems=[],e.isExhausted=!1,b=!1,p.innerHTML=`
          <div style="grid-column: 1/-1; padding: 4rem; text-align: center; color: var(--text-muted);">
            <div class="spin-loader" style="width: 32px; height: 32px; border: 3px solid rgba(245,158,11,0.2); border-top-color: #f59e0b; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem;"></div>
            <div>İçerikler yükleniyor...</div>
          </div>
        `,s&&(s.style.display="none"),T(t)};D(),F||T();let C=null;M&&"IntersectionObserver"in window&&(C=new IntersectionObserver(t=>{t[0].isIntersecting&&T()},{rootMargin:"0px 0px 600px 0px"}),C.observe(M));const B=()=>{if(b||e.isExhausted)return;const t=window.scrollY||document.documentElement.scrollTop||document.body.scrollTop||0,r=window.innerHeight,d=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);t+r>=d-700&&T()};window.addEventListener("scroll",B,{passive:!0}),window.__discoverCleanup=()=>{C?.disconnect(),window.removeEventListener("scroll",B)};const w=t=>{n!==t&&(n=t,f=null,[E,S,k,I].forEach(r=>r?.classList.remove("active")),t==="tv"&&E?.classList.add("active"),t==="movie"&&S?.classList.add("active"),t==="anime"&&k?.classList.add("active"),t==="documentary"&&I?.classList.add("active"),D(),v())};E&&E.addEventListener("click",()=>w("tv")),S&&S.addEventListener("click",()=>w("movie")),k&&k.addEventListener("click",()=>w("anime")),I&&I.addEventListener("click",()=>w("documentary")),_&&_.addEventListener("change",t=>{m=t.target.value,v()}),P&&P.addEventListener("change",t=>{u=parseFloat(t.target.value),v()})}}}export{te as renderDiscoverView};

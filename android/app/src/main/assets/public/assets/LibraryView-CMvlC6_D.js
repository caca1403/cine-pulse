import{D as me,c as ee,E as te,F as I,G as D,H as ae,I as K,J as W,K as ie,L as ve,s as S,M as he,N as ge,O as ke,j as M,r as q,P as we,Q as Se,g as ze,R as de,S as O,U as se,V as le,o as $e,h as xe,W as Le,X as _e,Y as Te,Z as Ae}from"./index-COeBT974.js";import{g as Ce,f as ne,a as Ee,b as qe,d as re}from"./offlineManager-D-JM6dtL.js";import"./vendor-capacitor-VGCIBgSg.js";const h=b=>String(b??"").replace(/[&<>"']/g,$=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[$]);function oe(b,$){const L=de(b);return`
    <div class="continue-card-wrapper library-card-item" 
         data-id="${b.id}" 
         data-season="${b.season||1}" 
         data-episode="${b.episode||1}" 
         data-tab="${$}"
         data-type="${L}"
         data-title="${encodeURIComponent(b.title||b.name||"İçerik")}"
         data-rating="${b.vote_average||b.voteAverage||b.rating||0}"
         data-year="${(b.release_date||b.first_air_date||b.year||"2024").substring(0,4)}">
      ${xe({...b,type:L},{isContinueSection:$==="continue"})}
      <button class="btn-delete-history btn-lib-delete" title="Listeden / Geçmişten Sil" aria-label="Sil">
        <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
      </button>
    </div>
  `}function Me(){const b=me();ee();const $=te(),L=I(),G=D(),x=ae(),ce=K().length,pe=W().length;let v="continue";if(typeof window<"u"&&window.sessionStorage)try{const r=window.sessionStorage.getItem("cp_lib_active_tab");r&&["continue","completed","favorites","watchlist","all-episodes",...b?["downloads"]:[]].includes(r)&&(v=r)}catch{}return{html:`
    <div class="library-view">
      <div class="container">
        
        <!-- Header & Action Group -->
        <div class="library-header-row">
          <div>
            <h1 class="library-header-title">
              <i data-lucide="bookmark" style="color: var(--primary)"></i> Kitaplığım & İstatistikler
            </h1>
            <p class="library-header-sub">İzleme geçmişiniz, bitirdikleriniz ve tercihleriniz yerel tarayıcı hafızanızda güvendedir.</p>
          </div>

          <div class="library-action-group">
            <button id="lib-data-modal-btn" class="btn-secondary" style="padding: 0.48rem 1.1rem; border-radius: var(--radius-full); font-size: 0.84rem; display: inline-flex; align-items: center; gap: 0.45rem;">
              <i data-lucide="database" style="width: 15px; height: 15px; color: var(--primary);"></i>
              <span>Veri & Yedek</span>
            </button>
            <input type="file" id="lib-file-input" accept=".json,application/json,text/plain" style="display: none;" />
          </div>
        </div>

        <!-- User Watch Analytics Stats Row -->
        <div class="stats-grid">
          
          <div class="stat-card" style="border-color: rgba(245, 158, 11, 0.25);">
            <div class="stat-card-icon" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24;">
              <i data-lucide="clock"></i>
            </div>
            <div>
              <div class="stat-card-label" style="color: #fbbf24;">Toplam İzleme</div>
              <div id="stat-total-watch" class="stat-card-val">${x.formattedTotal||x.formattedTotalTime||"0 dk"}</div>
            </div>
          </div>

          <div class="stat-card" style="border-color: rgba(59, 130, 246, 0.25);">
            <div class="stat-card-icon" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa;">
              <i data-lucide="tv"></i>
            </div>
            <div>
              <div class="stat-card-label" style="color: #60a5fa;">İzlenen Bölüm</div>
              <div id="stat-eps-count" class="stat-card-val">${x.totalEpisodes??x.episodesCount??0} Bölüm</div>
            </div>
          </div>

          <div class="stat-card" style="border-color: rgba(16, 185, 129, 0.25);">
            <div class="stat-card-icon" style="background: rgba(16, 185, 129, 0.15); color: #34d399;">
              <i data-lucide="film"></i>
            </div>
            <div>
              <div class="stat-card-label" style="color: #34d399;">İzlenen Film</div>
              <div id="stat-movies-count" class="stat-card-val">${x.totalMovies??x.moviesCount??0} Film</div>
            </div>
          </div>

          <div class="stat-card" style="border-color: rgba(239, 68, 68, 0.25);">
            <div class="stat-card-icon" style="background: rgba(239, 68, 68, 0.15); color: #f87171;">
              <i data-lucide="heart"></i>
            </div>
            <div>
              <div class="stat-card-label" style="color: #f87171;">Favori & Listem</div>
              <div id="stat-favs-count" class="stat-card-val">${L.length+G.length} Yapım</div>
            </div>
          </div>

        </div>

        <!-- Section Tabs: Devam Et, Tamamlananlar, Favoriler, Listem, Tüm Bölümler -->
        <div class="library-segmented-nav-track" id="library-tabs">
          <button class="lib-nav-tab ${v==="continue"?"active":""}" data-tab="continue">
            <i data-lucide="clock"></i>
            <span>Devam Et</span>
            <span class="lib-tab-badge" id="tab-count-continue">${ce}</span>
          </button>
          <button class="lib-nav-tab ${v==="completed"?"active":""}" data-tab="completed">
            <i data-lucide="check-circle-2"></i>
            <span>Tamamlananlar</span>
            <span class="lib-tab-badge" id="tab-count-completed">${pe}</span>
          </button>
          <button class="lib-nav-tab ${v==="favorites"?"active":""}" data-tab="favorites">
            <i data-lucide="heart"></i>
            <span>Favorilerim</span>
            <span class="lib-tab-badge" id="tab-count-favorites">${L.length}</span>
          </button>
          <button class="lib-nav-tab ${v==="watchlist"?"active":""}" data-tab="watchlist">
            <i data-lucide="plus-circle"></i>
            <span>İzleme Listesi</span>
            <span class="lib-tab-badge" id="tab-count-watchlist">${G.length}</span>
          </button>
          <button class="lib-nav-tab ${v==="all-episodes"?"active":""}" data-tab="all-episodes">
            <i data-lucide="history"></i>
            <span>İzleme Geçmişi</span>
            <span class="lib-tab-badge" id="tab-count-all-episodes">${$.length}</span>
          </button>
          ${b?`<button class="lib-nav-tab ${v==="downloads"?"active":""}" data-tab="downloads">
            <i data-lucide="download"></i>
            <span>İndirilenler</span>
            <span class="lib-tab-badge" id="tab-count-downloads">0</span>
          </button>`:""}
        </div>

        <!-- Library Luxury Toolbar Deck (Search, Type Filters, Sort & Batch Actions) -->
        <div class="library-toolbar-deck">
          <!-- Search Pill -->
          <div class="library-search-wrapper">
            <i data-lucide="search" class="library-search-icon"></i>
            <input type="text" id="lib-search-input" class="library-search-input" placeholder="Kitaplıkta ara..." autocomplete="off" />
            <i data-lucide="x" id="lib-search-clear" class="library-search-clear" title="Temizle"></i>
          </div>

          <!-- Horizontal Smooth Scrollable Filter Segment (Never Wraps!) -->
          <div class="library-filter-segment-track" id="lib-type-filters">
            <button class="lib-segment-btn active" data-filter="all">Tümü</button>
            <button class="lib-segment-btn" data-filter="movie">🎬 Filmler</button>
            <button class="lib-segment-btn" data-filter="tv">📺 Diziler</button>
            <button class="lib-segment-btn" data-filter="anime">🎌 Animeler</button>
          </div>

          <div style="display: flex; align-items: center; gap: 0.6rem;">
            <!-- Sort Select Pill -->
            <div class="library-sort-pill-wrap">
              <i data-lucide="arrow-down-up" class="library-sort-icon"></i>
              <select id="lib-sort-select" class="library-sort-select" aria-label="Sırala">
                <option value="recent">Son Eklenen</option>
                <option value="rating-desc">En Yüksek IMDb</option>
                <option value="title-asc">İsim (A-Z)</option>
                <option value="year-desc">Yıla Göre</option>
              </select>
            </div>

            <button id="lib-batch-clear-btn" class="btn-lib-clear-batch hidden" title="Bu listedeki tüm kayıtları temizle">
              <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
              <span>Temizle</span>
            </button>
          </div>
        </div>

        <!-- Tab 1: Continue Watching (In-Progress Only) -->
        <div class="tab-content ${v==="continue"?"":"hidden"}" id="tab-continue"></div>

        <!-- Tab 2: Completed / Finished Watch List -->
        <div class="tab-content ${v==="completed"?"":"hidden"}" id="tab-completed"></div>

        <!-- Tab 3: Favorites Grid -->
        <div class="tab-content ${v==="favorites"?"":"hidden"}" id="tab-favorites"></div>

        <!-- Tab 4: Watchlist Grid -->
        <div class="tab-content ${v==="watchlist"?"":"hidden"}" id="tab-watchlist"></div>

        <!-- Tab 5: All Episodes Breakdown -->
        <div class="tab-content ${v==="all-episodes"?"":"hidden"}" id="tab-all-episodes"></div>

        <!-- Tab 6: Offline Downloads -->
        ${b?`<div class="tab-content ${v==="downloads"?"":"hidden"}" id="tab-downloads"></div>`:""}
      </div>
    </div>
  `,init:r=>{if(!r)return;let o=v,H="all",B="recent",_="";const T=r.querySelector("#lib-search-input"),A=r.querySelector("#lib-search-clear"),N=r.querySelector("#lib-sort-select"),g=r.querySelector("#lib-batch-clear-btn");let k=[];const j=async()=>{try{k=(await Ce()).map(s=>({id:s.tmdbId,title:String(s.seriesTitle||s.title).replace(/\s*[·-]\s*\d+\.\s*Sezon\s+\d+\.\s*Bölüm.*$/i,"").trim(),episodeTitle:s.title,poster_path:ze(s.poster),poster_source:s.poster||"",poster_cache_key:s.posterCacheKey||"",backdrop_path:s.backdrop,type:s.type,isSeries:s.type==="tv"||s.season!==null&&s.episode!==null,season:s.season??null,episode:s.episode??null,sizeBytes:s.sizeBytes,mediaKind:s.mediaKind||"file",isDownloaded:!0,key:s.key,downloadedAt:s.downloadedAt}));const m=r.querySelector("#tab-count-downloads");m&&(m.textContent=k.length),o==="downloads"&&w()}catch{}};b&&j();const be=t=>t==="continue"?K():t==="completed"?W():t==="favorites"?I():t==="watchlist"?D():t==="all-episodes"?te():t==="downloads"?k:[],ue=t=>t==="downloads"?`
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap" style="background: rgba(245, 158, 11, 0.12); border-color: rgba(245, 158, 11, 0.3); color: #f59e0b;">
                <i data-lucide="download" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">Henüz indirilmiş içerik yok</h3>
              <p class="empty-state-desc">Oynatıcıdaki "Çevrimdışı İndir" butonuna basarak dizi veya filmleri cihazınıza indirebilir, internetsiz izleyebilirsiniz.</p>
              <a href="#discover" class="btn-primary empty-state-action-btn">
                <i data-lucide="compass" style="width: 16px; height: 16px;"></i>
                <span>İçerik Keşfet</span>
              </a>
            </div>
          `:t==="continue"?`
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap">
                <i data-lucide="clock" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">Yarım kalan içerik yok</h3>
              <p class="empty-state-desc">Dizi veya film izlemeye başladığınızda kaldığınız dakika burada otomatik olarak saklanır.</p>
              <a href="#discover" class="btn-primary empty-state-action-btn">
                <i data-lucide="compass" style="width: 16px; height: 16px;"></i>
                <span>Keşfet'e Göz At</span>
              </a>
            </div>
          `:t==="completed"?`
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap" style="background: rgba(16, 185, 129, 0.12); border-color: rgba(16, 185, 129, 0.3); color: #34d399;">
                <i data-lucide="check-circle-2" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">Henüz tamamlanmış içerik yok</h3>
              <p class="empty-state-desc">İzleyip bitirdiğiniz filmler ve tüm sezonlarını tamamladığınız diziler burada listelenir.</p>
              <a href="#movies" class="btn-primary empty-state-action-btn">
                <i data-lucide="film" style="width: 16px; height: 16px;"></i>
                <span>Popüler Filmleri İncele</span>
              </a>
            </div>
          `:t==="favorites"?`
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap" style="background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.3); color: #f87171;">
                <i data-lucide="heart" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">Favorilerinize henüz yapım eklemediniz</h3>
              <p class="empty-state-desc">Beğendiğiniz dizi ve filmleri detay sayfasından veya kartlardan favorilere ekleyebilirsiniz.</p>
              <a href="#series" class="btn-primary empty-state-action-btn">
                <i data-lucide="tv" style="width: 16px; height: 16px;"></i>
                <span>Trend Dizilere Bak</span>
              </a>
            </div>
          `:t==="watchlist"?`
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap" style="background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.3); color: #38bdf8;">
                <i data-lucide="plus-circle" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">İzleme listeniz henüz boş</h3>
              <p class="empty-state-desc">Daha sonra izlemek istediğiniz içerikleri listenize kaydedip buradan hızlıca ulaşabilirsiniz.</p>
              <a href="#discover" class="btn-primary empty-state-action-btn">
                <i data-lucide="compass" style="width: 16px; height: 16px;"></i>
                <span>İçerik Keşfet</span>
              </a>
            </div>
          `:`
            <div class="library-empty-state">
              <div class="empty-state-icon-wrap" style="background: rgba(168, 85, 247, 0.12); border-color: rgba(168, 85, 247, 0.3); color: #c084fc;">
                <i data-lucide="list-checks" style="width: 32px; height: 32px;"></i>
              </div>
              <h3 class="empty-state-title">Bölüm geçmişi boş</h3>
              <p class="empty-state-desc">Oynatılan veya tek tek işaretlenen tüm bölümler burada kaydedilir.</p>
              <a href="#home" class="btn-primary empty-state-action-btn">
                <i data-lucide="home" style="width: 16px; height: 16px;"></i>
                <span>Ana Sayfaya Dön</span>
              </a>
            </div>
          `;let z=36;const w=()=>{const t=r.querySelector(`#tab-${o}`);if(!t)return;let s=be(o).filter(i=>{const l=(i.title||i.name||"").toLowerCase(),d=de(i);return(!_||l.includes(_.toLowerCase()))&&(H==="all"||d===H)});if(B==="rating-desc"?s.sort((i,l)=>{const d=parseFloat(i.vote_average||i.voteAverage||i.rating||0);return parseFloat(l.vote_average||l.voteAverage||l.rating||0)-d}):B==="title-asc"?s.sort((i,l)=>{const d=i.title||i.name||"",u=l.title||l.name||"";return d.localeCompare(u,"tr")}):B==="year-desc"&&s.sort((i,l)=>{const d=parseInt((i.release_date||i.first_air_date||i.year||"0").substring(0,4),10);return parseInt((l.release_date||l.first_air_date||l.year||"0").substring(0,4),10)-d}),s.length===0)t.innerHTML=ue(o);else if(o==="downloads"){const i=new Map,l=[];s.forEach(e=>{if(e.season!==null&&e.episode!==null){const a=String(e.id);i.has(a)||i.set(a,[]),i.get(a).push(e)}else l.push(e)});const u=[...[...i.values()].map(e=>({id:e[0].id,title:e[0].title,poster_path:e.find(a=>a.poster_path)?.poster_path||O,poster_source:e.find(a=>a.poster_source)?.poster_source||"",poster_cache_key:e.find(a=>a.poster_cache_key)?.poster_cache_key||"",episodes:e.sort((a,n)=>a.season-n.season||a.episode-n.episode),latest:Math.max(...e.map(a=>a.downloadedAt||0))})).map(e=>({...e,cardType:"series"})),...l.map(e=>({...e,cardType:"movie"}))].sort((e,a)=>(a.latest||a.downloadedAt||0)-(e.latest||e.downloadedAt||0));t.innerHTML=`
            <div class="offline-download-list offline-download-poster-grid">
              ${u.map((e,a)=>e.cardType==="series"?`
                <article class="offline-series-card" data-series-index="${a}">
                  <button class="offline-series-toggle" type="button" aria-expanded="false">
                    <span class="offline-series-poster"><img src="${h(e.poster_path||O)}" data-offline-poster-key="${h(e.poster_cache_key)}" data-offline-poster-source="${h(e.poster_source)}" alt="${h(e.title)} afişi" loading="lazy"><span class="offline-series-ready"><i data-lucide="check"></i> İNDİRİLDİ</span></span>
                    <span class="offline-series-summary"><strong>${h(e.title)}</strong><small>${e.episodes.length} bölüm · ${new Set(e.episodes.map(n=>n.season)).size} sezon</small></span>
                    <i data-lucide="chevron-down" class="offline-series-chevron"></i>
                  </button>
                  <div class="offline-series-episodes" hidden>${[...new Set(e.episodes.map(n=>n.season))].sort((n,p)=>n-p).map(n=>`<section class="offline-series-season"><h3>Sezon ${n}</h3>${e.episodes.filter(p=>p.season===n).map(p=>`<article class="offline-series-episode" data-offline-key="${h(p.key)}"><span class="offline-series-episode-no">${String(p.episode).padStart(2,"0")}</span><span class="offline-series-episode-copy"><strong>${h(p.episodeTitle||p.title)}</strong><small>Bölüm ${p.episode} · ${ne(p.sizeBytes)}</small></span><button class="offline-play-btn" type="button" aria-label="Oynat"><i data-lucide="play"></i></button><button class="btn-delete-history btn-lib-delete" title="Cihazdan sil" aria-label="Cihazdan sil"><i data-lucide="trash-2"></i></button></article>`).join("")}</section>`).join("")}</div>
                </article>`:`
                <article class="offline-series-card offline-movie-card" data-offline-key="${h(e.key)}">
                  <span class="offline-series-poster"><img src="${h(e.poster_path||O)}" data-offline-poster-key="${h(e.poster_cache_key)}" data-offline-poster-source="${h(e.poster_source)}" alt="${h(e.title)} afişi" loading="lazy"><span class="offline-series-ready"><i data-lucide="check"></i> İNDİRİLDİ</span></span>
                  <span class="offline-series-summary"><strong>${h(e.title)}</strong><small>Film · ${ne(e.sizeBytes)}</small></span>
                  <div class="offline-movie-actions"><button class="offline-play-btn" type="button"><i data-lucide="play"></i><span>Oynat</span></button><button class="btn-delete-history btn-lib-delete" title="Cihazdan sil" aria-label="Cihazdan sil"><i data-lucide="trash-2"></i></button></div>
                </article>`).join("")}
            </div>`,t.querySelectorAll(".offline-series-poster img").forEach(async e=>{e.addEventListener("error",()=>{e.dataset.fallbackApplied!=="true"&&(e.dataset.fallbackApplied="true",e.src=O)},{once:!0});const a=e.dataset.offlinePosterKey;if(!a)return;const n=await Ee(a,e.dataset.offlinePosterSource||"");n&&e.isConnected&&(e.src=n)});const c=async(e,a)=>{if(!a)return;const n=e.querySelector(".offline-play-btn");n.disabled=!0;try{const p=await qe(a.id,a.season,a.episode);if(!p)throw new Error("İndirilen video dosyası bulunamadı.");await $e({type:a.type==="movie"?"movie":"tv",isSeries:a.season!==null&&a.episode!==null,tmdbId:a.id,title:a.season!==null&&a.episode!==null?a.title.replace(/\s*[·-]\s*\d+\.\s*Sezon\s+\d+\.\s*Bölüm.*$/i,"").trim():a.title,seriesTitle:a.season!==null&&a.episode!==null?a.title.replace(/\s*[·-]\s*\d+\.\s*Sezon\s+\d+\.\s*Bölüm.*$/i,"").trim():"",season:a.season||1,episode:a.episode||1,posterPath:a.poster_path||"",backdropPath:a.backdrop_path||"",offlinePlaybackUrl:p,offlineMediaKind:a.mediaKind})}catch(p){S(p?.message||"İndirilen içerik açılamadı.","error")}finally{n.disabled=!1}},y=async e=>{if(!e||!window.confirm(`“${e.title}” indirilenlerden silinsin mi?`))return;await re(e.id,e.season,e.episode),k=k.filter(n=>String(n.key)!==String(e.key));const a=r.querySelector("#tab-count-downloads");a&&(a.textContent=String(k.length)),w(),S("İndirilen içerik cihazdan silindi.","success")};t.querySelectorAll(".offline-series-card:not(.offline-movie-card)").forEach((e,a)=>{const n=u.filter(f=>f.cardType==="series")[a],p=e.querySelector(".offline-series-toggle"),E=e.querySelector(".offline-series-episodes");p.addEventListener("click",()=>{const f=p.getAttribute("aria-expanded")!=="true";p.setAttribute("aria-expanded",String(f)),E.hidden=!f}),e.querySelectorAll(".offline-series-episode").forEach(f=>{const Z=n.episodes.find(ye=>String(ye.key)===f.dataset.offlineKey);f.querySelector(".offline-play-btn").addEventListener("click",()=>c(f,Z)),f.querySelector(".btn-lib-delete").addEventListener("click",()=>y(Z))})}),t.querySelectorAll(".offline-movie-card").forEach(e=>{const a=l.find(n=>String(n.key)===e.dataset.offlineKey);e.querySelector(".offline-play-btn").addEventListener("click",()=>c(e,a)),e.querySelector(".btn-lib-delete").addEventListener("click",()=>y(a))}),q(t);return}else{const i=s.slice(0,z),l=s.length>z;t.innerHTML=`
            <div class="media-grid" id="grid-${o}">
              ${i.map(e=>oe(e,o)).join("")}
            </div>
            ${l?`
              <div class="lib-load-more-wrap" style="text-align: center; margin: 2rem 0 1rem;">
                <button id="btn-lib-load-more" class="btn-secondary" style="padding: 0.6rem 1.8rem; border-radius: var(--radius-full); font-size: 0.88rem;">
                  <span>Daha Fazla Göster (${s.length-z} içerik daha)</span>
                </button>
                <div class="lib-scroll-sentinel" style="height: 1px; margin-top: 1rem;"></div>
              </div>
            `:""}
          `;const d=t.querySelector(`#grid-${o}`),u=()=>{const e=d.querySelectorAll(".library-card-item").length;if(e>=s.length){const f=t.querySelector(".lib-load-more-wrap");f&&f.remove();return}const a=s.slice(e,e+36);z=e+a.length;const n=a.map(f=>oe(f,o)).join("");d.insertAdjacentHTML("beforeend",n);const p=s.length-z,E=t.querySelector(".lib-load-more-wrap");if(p>0){const f=E?.querySelector("#btn-lib-load-more span");f&&(f.textContent=`Daha Fazla Göster (${p} içerik daha)`)}else E&&E.remove();se(a),U(d),q(d),M(d),le(d)},c=t.querySelector("#btn-lib-load-more");c&&c.addEventListener("click",u);const y=t.querySelector(".lib-scroll-sentinel");y&&"IntersectionObserver"in window&&new IntersectionObserver(a=>{a.some(n=>n.isIntersecting)&&u()},{rootMargin:"400px 0px"}).observe(y),U(t),se(i),M(t),le(t)}if(g)if(o==="completed"||o==="all-episodes"||o==="continue"){g.classList.remove("hidden");const i=g.querySelector("span");i&&(i.textContent="Temizle"),o==="completed"?g.title="Tamamlananlar listesini temizle":o==="continue"?g.title="İzlemeye devam et listesini temizle":g.title="Bölüm izleme geçmişini temizle"}else g.classList.add("hidden");q()},F=()=>{z=36,w()},R=r.querySelectorAll("#library-tabs .lib-nav-tab");R.forEach(t=>{t.addEventListener("click",m=>{m.preventDefault();const s=t.getAttribute("data-tab");if(o===s)return;if(R.forEach(l=>l.classList.remove("active")),t.classList.add("active"),o=s,typeof window<"u"&&window.sessionStorage)try{window.sessionStorage.setItem("cp_lib_active_tab",s)}catch{}r.querySelectorAll(".tab-content").forEach(l=>l.classList.add("hidden"));const i=r.querySelector(`#tab-${o}`);i&&i.classList.remove("hidden"),z=36,w()})});const C=()=>{const t=ae(),m=r.querySelector("#stat-total-watch")||r.querySelector("#stat-total-time"),s=r.querySelector("#stat-eps-count")||r.querySelector("#stat-episodes-count"),i=r.querySelector("#stat-movies-count"),l=r.querySelector("#stat-favs-count");m&&(m.textContent=t.formattedTotal||t.formattedTotalTime||"0 dk"),s&&(s.textContent=`${t.totalEpisodes??t.episodesCount??0} Bölüm`),i&&(i.textContent=`${t.totalMovies??t.moviesCount??0} Film`),l&&(l.textContent=`${I().length+D().length} Yapım`);const d=r.querySelector("#tab-count-continue"),u=r.querySelector("#tab-count-completed"),c=r.querySelector("#tab-count-favorites"),y=r.querySelector("#tab-count-watchlist"),e=r.querySelector("#tab-count-all-episodes");d&&(d.textContent=K().length),u&&(u.textContent=W().length),c&&(c.textContent=I().length),y&&(y.textContent=D().length),e&&(e.textContent=ee().length)},U=t=>{t&&t.querySelectorAll(".btn-lib-delete").forEach(m=>{m.addEventListener("click",s=>{s.stopPropagation();const i=m.closest(".library-card-item");if(!i)return;const l=i.getAttribute("data-id"),d=parseInt(i.getAttribute("data-season")||"1",10),u=parseInt(i.getAttribute("data-episode")||"1",10),c=i.getAttribute("data-tab"),y=decodeURIComponent(i.getAttribute("data-title")||"İçerik");let e=`"${y}" kaydını silmek istediğinize emin misiniz?`;if(c==="all-episodes"?e=`"${y}" (Sezon ${d}, Bölüm ${u}) izleme geçmişinizden silinsin mi?`:c==="continue"?e=`"${y}" devam et listesinden kaldırılsın mı?`:c==="completed"?e=`"${y}" tamamlananlar geçmişinden silinsin mi?`:c==="favorites"?e=`"${y}" favorilerinizden kaldırılsın mı?`:c==="watchlist"?e=`"${y}" izleme listenizden kaldırılsın mı?`:c==="downloads"&&(e=`"${y}" indirilmiş içerik cihazınızdan silinsin mi?`),window.confirm(e)){if(c==="all-episodes")Le(l,d,u);else if(c==="continue"||c==="completed")_e(l);else if(c==="favorites")Te(l);else if(c==="watchlist")Ae(l);else if(c==="downloads"){const a=k.find(n=>String(n.id)===String(l)&&(n.season||1)===d&&(n.episode||1)===u);re(l,a?.season??null,a?.episode??null),k=k.filter(n=>!(n.id===l&&n.season===d&&n.episode===u))}S("✓ Kayıt başarıyla silindi.","success"),i.style.transition="all 0.28s ease-out",i.style.transform="scale(0.85)",i.style.opacity="0",setTimeout(()=>{i.remove(),C()},300)}})})};T&&T.addEventListener("input",t=>{_=t.target.value.trim(),A&&(A.style.display=_?"block":"none"),F()}),A&&A.addEventListener("click",()=>{T&&(T.value="",_="",A.style.display="none",F(),T.focus())});const Y=r.querySelectorAll("#lib-type-filters .lib-segment-btn");Y.forEach(t=>{t.addEventListener("click",()=>{Y.forEach(m=>m.classList.remove("active")),t.classList.add("active"),H=t.getAttribute("data-filter")||"all",F()})}),N&&N.addEventListener("change",t=>{B=t.target.value,F()}),g&&g.addEventListener("click",()=>{let t="Bu listedeki tüm kayıtları silmek istediğinize emin misiniz?";o==="completed"?t="Tamamlananlar listesindeki tüm kayıtlar temizlensin mi?":o==="continue"?t="İzlemeye devam et listesindeki tüm yarım kalanlar temizlensin mi?":o==="all-episodes"&&(t="Tüm bölüm izleme geçmişiniz sıfırlansın mı?"),window.confirm(t)&&(o==="completed"?ie():o==="continue"?ie():o==="all-episodes"&&ve(),S("✓ Liste başarıyla temizlendi.","success"),C(),w())});const J=r.querySelector("#lib-export-btn");J&&J.addEventListener("click",()=>{try{he(),S("JSON yedekleme tamamlandı.","success")}catch(t){S(t?.message||"JSON yedeği kaydedilemedi.","error")}});const V=r.querySelector("#lib-import-btn"),P=r.querySelector("#lib-file-input");V&&P&&(V.addEventListener("click",()=>P.click()),P.addEventListener("change",t=>{if(t.target.files&&t.target.files.length>0){const m=t.target.files[0],s=new FileReader;s.onload=i=>{const l=ge(i.target.result,"merge");l.success?(ke(),C(),w(),M(r),q(),S(`✓ Yedek başarıyla yüklendi! (${l.countHistory} izleme, ${l.countFavs} favori aktarıldı)`,"success")):S(`Yükleme hatası: ${l.message||l.error}`,"error")},s.onerror=()=>S("Dosya okunamadı.","error"),s.readAsText(m)}}));const Q=r.querySelector("#lib-data-modal-btn");Q&&Q.addEventListener("click",()=>we()),w(),M(r),q(),Se().then(()=>{C(),w()}).catch(()=>{});const X=t=>{t&&t.detail&&t.detail.isProgressUpdate&&document.getElementById("player-modal")||(C(),w())};window.addEventListener("sineflix_data_changed",X),window.addEventListener("cinepulse_data_changed",X);const fe=()=>j();window.addEventListener("cinepulse_offline_changed",fe)}}}export{Me as renderLibraryView};

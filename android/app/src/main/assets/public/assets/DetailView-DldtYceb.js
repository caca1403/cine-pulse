import{i as xe,m as Xe,s as K,r as L,f as Je,g as ne,T as re,a as te,S as Qe,t as Ye,b as $e,c as et,o as Se,d as tt,e as fe,h as Le,j as We,k as Ie,l as at,n as it,p as st,q as nt,u as rt,v as lt,w as we,x as He,y as ke,z as se,A as ot,B as ct,C as dt}from"./index-LKTqiWh4.js";import"./vendor-capacitor-VGCIBgSg.js";async function pt({tvId:t,seriesTitle:n,originalTitle:s="",seriesOverview:e="",seasons:u=[],posterPath:a="",backdropPath:h="",isAnime:l=!1,spoilerFree:E=!1}){const v=u.filter(x=>x.season_number>0);v.length===0&&u.length>0&&v.push(u[0]);const $=v.length>0?v[0].season_number:1,Y=v.length>0&&v[0].episode_count||10,H=xe(t,$,Y);let A=!!E,F=null;return{html:`
    <div class="season-selector-wrapper">
      <div class="season-selector-header">
        <div style="display: flex; align-items: center; gap: 0.65rem;">
          <span class="rail-icon-pill" style="--rail-color: #f59e0b; width: 28px; height: 28px;">
            <i data-lucide="layers" style="width: 15px; height: 15px;"></i>
          </span>
          <h2 class="season-selector-title" style="margin: 0;">Sezonlar ve Bölümler</h2>
        </div>

        <!-- Bulk Mark Current Season Watched Button -->
        <button id="btn-mark-season-all" class="btn-secondary" style="padding: 0.45rem 1.1rem; font-size: 0.82rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.45rem; cursor: pointer; ${H?"background: rgba(16, 185, 129, 0.2); border-color: #10b981; color: #10b981;":""}">
          <i data-lucide="${H?"check-circle-2":"check-check"}" style="width: 14px; height: 14px;"></i>
          <span>${H?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"}</span>
        </button>
      </div>

      <!-- Luxury Segmented Season Pills Track with PC Arrows & Scroll Support -->
      <div class="season-tabs-wrapper" style="position: relative; display: flex; align-items: center; margin-bottom: 1.5rem; width: 100%;">
        <button class="season-nav-arrow left" id="btn-season-prev" title="Önceki Sezonlar" aria-label="Geri">
          <i data-lucide="chevron-left" style="width:16px;height:16px;"></i>
        </button>
        <div class="season-pills-track" id="season-tabs-bar">
          ${v.map(x=>`
            <button class="season-pill ${x.season_number===$?"active":""}" data-season="${x.season_number}" data-ep-count="${x.episode_count||10}">
              ${x.name||`${x.season_number}. Sezon`} <span style="opacity: 0.75; font-size: 0.72rem; margin-left: 0.2rem;">(${x.episode_count} Bölüm)</span>
            </button>
          `).join("")}
        </div>
        <button class="season-nav-arrow right" id="btn-season-next" title="Sonraki Sezonlar" aria-label="İleri">
          <i data-lucide="chevron-right" style="width:16px;height:16px;"></i>
        </button>
      </div>

      <div class="episodes-grid" id="episode-grid-container">
        <div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
          <i data-lucide="loader-2" class="spin-loader" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></i>
          <div>Bölümler yükleniyor...</div>
        </div>
      </div>
    </div>
  `,init:x=>{if(!x)return;let r=$,g=Y;const y=()=>{const d=x.querySelector("#btn-mark-season-all");if(!d)return;const B=xe(t,r,g),k=d.querySelector("span"),q=d.querySelector("i");k&&(k.textContent=B?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),q&&q.setAttribute("data-lucide",B?"check-circle-2":"check-check"),B?(d.style.background="rgba(16, 185, 129, 0.2)",d.style.borderColor="#10b981",d.style.color="#10b981"):(d.style.background="",d.style.borderColor="",d.style.color=""),L()};ue(t,n,e,r,x,a,h,s,v,y,l,A);const S=d=>{if(d&&d.detail&&d.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const B=x.querySelector("#episode-grid-container");B&&(B.querySelectorAll(".episode-card").forEach(k=>{const q=parseInt(k.getAttribute("data-season"),10),z=parseInt(k.getAttribute("data-episode"),10),D=te(t,q,z),C=D?D.progressPercent:0,W=D?D.completed||C>=90:!1,Z=D&&!W&&D.currentTime>0,M=k.querySelector(".badge-watched-status"),j=k.querySelector(".btn-mark-ep-watched"),ae=k.querySelector(".card-progress-fill"),ie=k.querySelector(".btn-mark-ep-halfway");M&&(W?(M.innerHTML='<i data-lucide="check" style="width:10px; height:10px"></i> İZLENDİ',M.style.background="var(--accent-green)",M.style.color="#fff",M.style.fontSize="0.68rem",M.style.fontWeight="800",M.style.padding="0.2rem 0.45rem",M.style.borderRadius="4px",M.style.whiteSpace="nowrap",M.style.display="inline-flex"):Z?(M.innerHTML='<i data-lucide="clock" style="width:10px; height:10px"></i> YARIDA',M.style.background="#f59e0b",M.style.color="#000",M.style.fontSize="0.68rem",M.style.fontWeight="850",M.style.padding="0.2rem 0.45rem",M.style.borderRadius="4px",M.style.whiteSpace="nowrap",M.style.display="inline-flex"):M.style.display="none"),j&&(W?(j.classList.add("watched"),j.style.background="#10b981",j.style.borderColor="#10b981",j.title="İzlendi işaretini kaldır"):(j.classList.remove("watched"),j.style.background="rgba(0,0,0,0.65)",j.style.borderColor="rgba(255,255,255,0.3)",j.title="İzlendi olarak işaretle")),ie&&(ie.style.background=Z?"#f59e0b":"rgba(0,0,0,0.65)",ie.style.borderColor=Z?"#f59e0b":"rgba(255,255,255,0.3)"),ae&&(ae.style.width=`${C}%`,ae.style.background=W?"var(--accent-green)":"#fbbf24")}),L()),y()};window.addEventListener("sineflix_data_changed",S),x.querySelectorAll(".season-pill").forEach(d=>{d.addEventListener("click",B=>{B.preventDefault(),x.querySelectorAll(".season-pill").forEach(k=>k.classList.remove("active")),d.classList.add("active"),d.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}),r=parseInt(d.getAttribute("data-season"),10),g=parseInt(d.getAttribute("data-ep-count"),10)||10,ue(t,n,e,r,x,a,h,s,v,y,l,A),y()})});const b=x.querySelector(".season-pill.active");b&&setTimeout(()=>{b.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},120);const m=x.querySelector("#season-tabs-bar"),f=x.querySelector("#btn-season-prev"),T=x.querySelector("#btn-season-next");if(m){f?.addEventListener("click",z=>{z.preventDefault(),m.scrollBy({left:-260,behavior:"smooth"})}),T?.addEventListener("click",z=>{z.preventDefault(),m.scrollBy({left:260,behavior:"smooth"})}),m.addEventListener("wheel",z=>{z.deltaY!==0&&m.scrollWidth>m.clientWidth&&(z.preventDefault(),m.scrollLeft+=z.deltaY)},{passive:!1});let d=!1,B=0,k=0,q=!1;m.addEventListener("mousedown",z=>{z.button===0&&(d=!0,q=!1,m.classList.add("dragging"),B=z.pageX-m.offsetLeft,k=m.scrollLeft)}),window.addEventListener("mousemove",z=>{if(!d)return;const C=(z.pageX-m.offsetLeft-B)*1.5;Math.abs(C)>4&&(q=!0),m.scrollLeft=k-C}),window.addEventListener("mouseup",()=>{d&&(d=!1,m.classList.remove("dragging"),setTimeout(()=>{q=!1},50))}),m.addEventListener("click",z=>{q&&(z.preventDefault(),z.stopPropagation())},!0)}const N=x.querySelector("#btn-mark-season-all");N&&N.addEventListener("click",d=>{d.preventDefault();const k=!xe(t,r,g);Xe(t,r,g,k,{title:n,posterPath:a,backdropPath:h,type:l?"anime":"tv",isAnime:l}),K(k?`${r}. Sezonun tüm bölümleri izlendi!`:`${r}. Sezon izlenmedi olarak işaretlendi.`,k?"success":"info");const q=x.querySelector("#episode-grid-container");q&&(q.querySelectorAll(".episode-card").forEach(z=>{const D=z.querySelector(".badge-watched-status"),C=z.querySelector(".btn-mark-ep-watched");D&&(D.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',D.style.background="var(--accent-green)",D.style.color="#fff",D.style.display=k?"inline-flex":"none"),C&&(k?(C.classList.add("watched"),C.style.background="#10b981",C.style.borderColor="#10b981",C.title="İzlendi işaretini kaldır"):(C.classList.remove("watched"),C.style.background="rgba(0,0,0,0.65)",C.style.borderColor="rgba(255,255,255,0.3)",C.title="İzlendi olarak işaretle"))}),L()),y()}),F=d=>{A=!!d,ue(t,n,e,r,x,a,h,s,v,y,l,A)}},setSpoilerSafe(x){A=!!x,F?.(A)}}}function ut(t){const n=et().filter(s=>String(s?.id)===String(t)&&(Number(s.currentTime)>0||s.completed||Number(s.progressPercent)>0));return n.length?n.reduce((s,e)=>{const u={season:Math.max(1,Number(e.season)||1),episode:Math.max(1,Number(e.episode)||1)};return u.season>s.season||u.season===s.season&&u.episode>s.episode?u:s},{season:1,episode:1}):{season:1,episode:1}}async function ue(t,n,s,e,u,a="",h="",l="",E=[],v=null,$=!1,Y=!1){const H=u.querySelector("#episode-grid-container");if(!H)return;H.innerHTML=`<div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;"><i data-lucide="loader-2" class="spin-loader" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></i><div>${e}. Sezon bölümleri getiriliyor...</div></div>`,L();let A=null;try{A=await Je(t,e)}catch{}if(!A||!A.episodes||A.episodes.length===0){H.innerHTML=`
      <div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
        <p style="margin-bottom: 0.75rem;">Bu sezon için bölüm verisi getirilemedi.</p>
        <button id="btn-retry-season-episodes" class="btn-secondary" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
          <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
          <span>Tekrar Dene</span>
        </button>
      </div>
    `,L(),u.querySelector("#btn-retry-season-episodes")?.addEventListener("click",()=>{ue(t,n,s,e,u,a,h,l,E,v,$,Y)});return}const F=Y?ut(t):null,J=Y?A.episodes.filter(r=>e<F.season||e===F.season&&Number(r.episode_number)<=F.episode+1):A.episodes;if(Y&&J.length===0){H.innerHTML='<div class="spoiler-safe-locked"><i data-lucide="shield-check"></i><strong>Bu sezon spoiler korumasında</strong><span>Önceki sezona ilerledikçe bölüm detayları burada açılır.</span></div>',L();return}const x=Y?`<div class="spoiler-safe-notice"><i data-lucide="shield-check"></i><span>Spoilersız keşif açık · S${F.season} B${F.episode+1} sonrasının detayları gizli.</span></div>`:"";H.innerHTML=x+J.map(r=>{const g=r.episode_number;let y=(r.name||"").trim();y=y.replace(new RegExp(`^(?:${g}\\s*[\\.\\:\\-]\\s*)+(?:Bölüm\\s*[\\:\\-]\\s*)?`,"i"),""),y=y.replace(new RegExp(`^Bölüm\\s*${g}\\s*[\\:\\-]\\s*`,"i"),""),y=y.trim();const S=y?`${g}. Bölüm: ${y}`:`${g}. Bölüm`;let b=r.overview?r.overview.trim():"";(!b||b.length<5)&&(s&&s.length>10?b=`${g}. Bölüm: ${s}`:b=`${n} ${e}. Sezon ${g}. Bölüm Türkçe Dublaj ve Altyazılı yüksek kalitede kesintisiz HD izle.`);const m=b.length>90,f=ne(r.still_path,re.STILL_MEDIUM),T=r.air_date||"",N=r.runtime?`${r.runtime} dk`:"",d=te(t,e,g),B=d?d.progressPercent:0,k=d?d.completed||B>=90:!1,q=d&&!k&&d.currentTime>0,z=B>0?`
      <div class="card-progress-bar">
        <div class="card-progress-fill" style="width: ${B}%; background: ${k?"var(--accent-green)":"#fbbf24"};"></div>
      </div>
    `:"";let D="";return k?D=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.4rem; left: 0.4rem; background: var(--accent-green); color: #fff; z-index: 4; font-size: 0.68rem; font-weight: 800; padding: 0.2rem 0.45rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; line-height: 1; white-space: nowrap;">
          <i data-lucide="check" style="width:10px; height:10px"></i> İZLENDİ
        </span>
      `:q?D=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.4rem; left: 0.4rem; background: #f59e0b; color: #000; font-weight: 850; z-index: 4; font-size: 0.68rem; padding: 0.2rem 0.45rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; line-height: 1; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">
          <i data-lucide="clock" style="width:10px; height:10px"></i> YARIDA
        </span>
      `:D=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.4rem; left: 0.4rem; background: var(--accent-green); color: #fff; display: none; z-index: 4; font-size: 0.68rem; font-weight: 800; padding: 0.2rem 0.45rem; border-radius: 4px; line-height: 1; white-space: nowrap;">
          <i data-lucide="check" style="width:10px; height:10px"></i> İZLENDİ
        </span>
      `,`
      <div class="episode-card" data-tv-id="${t}" data-season="${e}" data-episode="${g}" data-title="${S}">
        <div class="episode-thumb-wrap">
          <img src="${f}" alt="${S}" loading="lazy" onerror="this.onerror=null; this.src='${Qe}';" />
          <span class="episode-number-chip">${e}x${g<10?"0"+g:g}</span>
          ${D}
          
          <div class="episode-play-overlay">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary-gradient); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.6);">
              <i data-lucide="play" style="width: 20px; height: 20px; fill: #fff; color: #fff; margin-left: 2px;"></i>
            </div>
          </div>

          <!-- Top Right Action Controls: Mark Watched & Halfway -->
          <div style="position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 0.35rem; z-index: 5;">
            <button class="btn-mark-ep-halfway" data-tv-id="${t}" data-season="${e}" data-episode="${g}" title="Yarıda Bırakıldı (20. dk)" style="width: 28px; height: 28px; border-radius: 50%; background: ${q?"#f59e0b":"rgba(0,0,0,0.65)"}; border: 1px solid ${q?"#f59e0b":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="clock" style="width: 13px; height: 13px;"></i>
            </button>

            <button class="btn-mark-ep-watched ${k?"watched":""}" data-tv-id="${t}" data-season="${e}" data-episode="${g}" title="${k?"İzlendi işaretini kaldır":"İzlendi olarak işaretle"}" style="width: 28px; height: 28px; border-radius: 50%; background: ${k?"#10b981":"rgba(0,0,0,0.65)"}; border: 1px solid ${k?"#10b981":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="check" style="width: 14px; height: 14px;"></i>
            </button>
          </div>

          ${z}
        </div>

        <div class="episode-info">
          <div class="episode-header-row">
            <span class="episode-title" title="${S}">${S}</span>
            <span class="episode-duration">${N||T}</span>
          </div>
          
          <div class="episode-overview-container">
            <div class="episode-overview ${m?"truncated":""}" data-full="${b}">
              ${b}
            </div>
            ${m?`
              <button class="btn-toggle-overview" style="color: var(--primary); font-weight: 700; font-size: 0.78rem; margin-top: 0.25rem; display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; background: none; border: none; padding: 0;">
                <span>Devamını Oku</span>
                <i data-lucide="chevron-down" style="width: 12px; height: 12px;"></i>
              </button>
            `:""}
          </div>

          <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: auto; padding-top: 0.45rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06);">
            <span>${T}</span>
            <span class="btn-play-episode-trigger" style="color: var(--primary); font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.25rem;">
              <span>Oynat</span>
              <i data-lucide="play" style="width: 11px; height: 11px; fill: currentColor;"></i>
            </span>
          </div>
        </div>
      </div>
    `}).join(""),L(),u.querySelectorAll(".btn-toggle-overview").forEach(r=>{r.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation();const y=r.closest(".episode-overview-container"),S=y?y.querySelector(".episode-overview"):null;if(!S)return;const b=r.querySelector("span"),m=r.querySelector("i");S.classList.contains("truncated")?(S.classList.remove("truncated"),b&&(b.textContent="Daralt"),m&&m.setAttribute("data-lucide","chevron-up")):(S.classList.add("truncated"),b&&(b.textContent="Devamını Oku"),m&&m.setAttribute("data-lucide","chevron-down")),L()})}),H.querySelectorAll(".btn-mark-ep-watched").forEach(r=>{r.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation();const y=parseInt(r.getAttribute("data-season"),10),S=parseInt(r.getAttribute("data-episode"),10),b=r.closest(".episode-card"),f=Ye(t,y,S,{title:n,posterPath:a,backdropPath:h,type:$?"anime":"tv",isAnime:$}).completed;if(K(f?`S${y} B${S} izlendi olarak işaretlendi!`:`S${y} B${S} izlendi işareti kaldırıldı.`,f?"success":"info"),f?(r.classList.add("watched"),r.style.background="#10b981",r.style.borderColor="#10b981",r.title="İzlendi işaretini kaldır"):(r.classList.remove("watched"),r.style.background="rgba(0,0,0,0.65)",r.style.borderColor="rgba(255,255,255,0.3)",r.title="İzlendi olarak işaretle"),b){const T=b.querySelector(".badge-watched-status");T&&(T.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',T.style.background="var(--accent-green)",T.style.color="#fff",T.style.display=f?"inline-flex":"none")}typeof v=="function"&&v(),L()})}),H.querySelectorAll(".btn-mark-ep-halfway").forEach(r=>{r.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation();const y=parseInt(r.getAttribute("data-season"),10),S=parseInt(r.getAttribute("data-episode"),10),b=r.closest(".episode-card");if($e(t,y,S,1200,{title:n,posterPath:a,backdropPath:h,type:$?"anime":"tv",isAnime:$,duration:2700}),r.style.background="#f59e0b",r.style.borderColor="#f59e0b",b){const m=b.querySelector(".badge-watched-status");m&&(m.innerHTML='<i data-lucide="clock" style="width:10px; height:10px"></i> YARIDA',m.style.background="#f59e0b",m.style.color="#000",m.style.fontWeight="850",m.style.padding="0.2rem 0.45rem",m.style.borderRadius="4px",m.style.fontSize="0.68rem",m.style.whiteSpace="nowrap",m.style.display="inline-flex")}K(`S${y} B${S} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info"),L()})}),H.querySelectorAll(".episode-card").forEach(r=>{const g=b=>{if(b&&b.target&&(b.target.closest(".btn-mark-ep-watched")||b.target.closest(".btn-mark-ep-halfway")||b.target.closest(".btn-toggle-overview")))return;b&&(b.preventDefault(),b.stopPropagation());const m=parseInt(r.getAttribute("data-season"),10),f=parseInt(r.getAttribute("data-episode"),10),T=r.getAttribute("data-title"),N=te(t,m,f),d=N?N.currentTime:0;Se({type:$?"anime":"tv",isAnime:$,tmdbId:t,title:`${n} - S${m}E${f}: ${T}`,seriesTitle:n,originalTitle:l||n,season:m,episode:f,posterPath:a,backdropPath:h,currentTime:d,seasonsList:E,maxEpisodes:A.episodes?A.episodes.length:0})};r.addEventListener("click",g);const y=r.querySelector(".episode-thumb-wrap");y&&y.addEventListener("click",g);const S=r.querySelector(".btn-play-episode-trigger");S&&S.addEventListener("click",g)})}let me=null;async function mt(t,n="",s=""){ee();const e=document.createElement("div");e.id="cast-explorer-modal-root",e.className="cast-explorer-backdrop",document.body.appendChild(e),me=e,e.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>
      <div class="cast-explorer-loading">
        <div class="cast-explorer-spinner"></div>
        <span>${n||"Oyuncu"} bilgileri ve filmografisi yükleniyor...</span>
      </div>
    </div>
  `,L(e);const u=e.querySelector("#btn-close-cast-explorer");u&&(u.onclick=()=>ee()),e.onclick=f=>{f.target===e&&ee()};const a=f=>{f.key==="Escape"&&(ee(),window.removeEventListener("keydown",a))};window.addEventListener("keydown",a);const h=await tt(t);if(!h){e.innerHTML=`
      <div class="cast-explorer-dialog">
        <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
          <i data-lucide="x" style="width: 20px; height: 20px;"></i>
        </button>
        <div class="cast-explorer-loading">
          <i data-lucide="alert-circle" style="width: 36px; height: 36px; color: #ef4444;"></i>
          <span>Oyuncu bilgileri alınamadı.</span>
        </div>
      </div>
    `,L(e);return}const l=h.name||n,E=h.profile_path?ne(h.profile_path,re.POSTER_MEDIUM):s||fe,v=h.birthday?h.birthday.substring(0,4):"",$=h.place_of_birth||"",Y=h.known_for_department==="Acting"?"Oyuncu":h.known_for_department==="Directing"?"Yönetmen":h.known_for_department||"Sanatçı",H=h.biography&&h.biography.trim().length>20?h.biography:`${l}, sinema ve televizyon dünyasında yer aldığı yapımlarla tanınan başarılı bir sanatçıdır.`,A=h.combined_credits?.cast||[],F=h.combined_credits?.crew||[],J=[...A,...F],x=new Set,r=[];for(const f of J){if(!f||!f.id)continue;const T=`${f.media_type||"movie"}_${f.id}`;x.has(T)||(x.add(T),f.poster_path&&r.push(f))}r.sort((f,T)=>(T.popularity||0)-(f.popularity||0));const g=r.filter(f=>f.media_type==="movie"||!f.media_type&&f.title).length,y=r.filter(f=>f.media_type==="tv"||!f.media_type&&f.name).length;e.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>

      <!-- Actor Hero Header -->
      <div class="cast-explorer-header">
        <div class="cast-explorer-avatar-box">
          <img src="${E}" alt="${l}" class="cast-explorer-avatar" onerror="this.onerror=null; this.src='${fe}';" />
        </div>
        <div class="cast-explorer-bio-box">
          <div class="cast-explorer-name-row">
            <h2>${l}</h2>
            <span class="cast-explorer-dept-tag">${Y}</span>
          </div>
          <div class="cast-explorer-meta-row">
            ${v?`<span><i data-lucide="calendar" style="width:13px;height:13px;"></i> D: ${v}</span>`:""}
            ${$?`<span><i data-lucide="map-pin" style="width:13px;height:13px;"></i> ${$}</span>`:""}
            <span><i data-lucide="film" style="width:13px;height:13px;"></i> ${r.length} Yapım</span>
          </div>
          <p class="cast-explorer-bio-text">${H}</p>
        </div>
      </div>

      <!-- Filmography Tabs -->
      <div class="cast-explorer-tabs">
        <button class="cast-tab-btn active" data-filter="all">Tümü (${r.length})</button>
        <button class="cast-tab-btn" data-filter="movie">Filmler (${g})</button>
        <button class="cast-tab-btn" data-filter="tv">Diziler (${y})</button>
      </div>

      <!-- Media Cards Grid -->
      <div class="cast-explorer-grid" id="cast-explorer-grid">
        ${r.map(f=>Le(f)).join("")}
      </div>
    </div>
  `,L(e);const S=e.querySelector("#btn-close-cast-explorer");S&&(S.onclick=()=>ee());const b=e.querySelector("#cast-explorer-grid");b&&(We(b),b.addEventListener("click",()=>{setTimeout(()=>ee(),150)}));const m=e.querySelectorAll(".cast-tab-btn");m.forEach(f=>{f.onclick=()=>{m.forEach(d=>d.classList.remove("active")),f.classList.add("active");const T=f.getAttribute("data-filter");let N=r;T==="movie"?N=r.filter(d=>d.media_type==="movie"||!d.media_type&&d.title):T==="tv"&&(N=r.filter(d=>d.media_type==="tv"||!d.media_type&&d.name)),b&&(b.innerHTML=N.length>0?N.map(d=>Le(d)).join(""):'<div class="cast-empty-state">Bu kategoride yapım bulunamadı.</div>',L(b))}})}function ee(){if(me){try{me.remove()}catch{}me=null}}const ft="https://api.tvmaze.com",ht=5500,Oe=30*60*1e3,Ke="cinepulse_tvmaze_cache_v1",le=new Map;function bt(){try{const t=sessionStorage.getItem(Ke);if(!t)return;const n=JSON.parse(t);n&&typeof n=="object"&&Object.entries(n).forEach(([s,e])=>{e?.savedAt&&Date.now()-e.savedAt<Oe&&le.set(s,e)})}catch{}}function yt(){try{const t={};let n=0;for(const[s,e]of le.entries()){if(n++>=80)break;t[s]=e}sessionStorage.setItem(Ke,JSON.stringify(t))}catch{}}function Ee(t){const n=le.get(t);if(n){if(Date.now()-n.savedAt>Oe){le.delete(t);return}return n.data}}function Te(t,n){le.set(t,{savedAt:Date.now(),data:n}),yt()}async function he(t){try{const n=await fetch(`${ft}${t}`,{headers:{Accept:"application/json"},signal:AbortSignal.timeout(ht)});return n.ok?await n.json():null}catch{return null}}function Fe(t){return String(t||"").toLowerCase().replace(/[^a-z0-9çğıöşü ]/gi," ").replace(/\s+/g," ").trim()}function je(t,n){const s=Fe(t),e=Fe(n);return!s||!e?!1:s===e?!0:s.includes(e)||e.includes(s)}function Re(t){return t?{season:t.season??null,number:t.number??null,name:t.name||"",airdate:t.airdate||"",airstamp:t.airstamp||"",runtime:t.runtime||null}:null}function vt(t){switch(t){case"Running":return"Devam ediyor";case"Ended":return"Sonlandı";case"To Be Determined":return"Belirsiz";case"In Development":return"Yapım aşamasında";default:return t||""}}async function gt(t){const n=`lookup:${t}`,s=Ee(n);if(s!==void 0)return s;const e=await he(`/lookup/shows?${t}`);return Te(n,e||null),e||null}async function Ue(t){if(!t)return null;const n=`show:${t}`,s=Ee(n);if(s!==void 0)return s;const e=await he(`/shows/${t}?embed[]=nextepisode&embed[]=previousepisode`),u=e?{tvmazeId:e.id,name:e.name||"",status:e.status||"",statusLabel:vt(e.status),premiered:e.premiered||"",officialSite:e.officialSite||"",thetvdbId:e.externals?.thetvdb??null,imdbId:e.externals?.imdb||"",nextEpisode:Re(e._embedded?.nextepisode),previousEpisode:Re(e._embedded?.previousepisode)}:null;return Te(n,u),u}async function xt(t){const n=String(t||"").trim();if(!n)return null;const s=n.startsWith("tt")?n:`tt${n}`,u=(await gt(`imdb=${encodeURIComponent(s)}`))?.id||null;return u?Ue(u):null}function Ge(t,n){const s=parseInt(String(t?.premiered||"").substring(0,4),10),e=parseInt(String(n||""),10);return!e||!s?0:Math.abs(s-e)}function wt(t,n,s){let e=null,u=1/0;for(const a of t){if(!a||!je(a.name,n))continue;const h=Ge(a,s);if(h>1)continue;const l=h*10+(a.status==="Running"?0:1);l<u&&(u=l,e=a)}return e}async function kt(t,n){const s=String(t||"").trim();if(s.length<2)return null;const e=`search:${s}:${n||""}`,u=Ee(e);if(u!==void 0)return u;let a=null;const h=await he(`/singlesearch/shows?q=${encodeURIComponent(s)}`);if(h&&je(h.name,s)&&Ge(h,n)<=1&&(a=h),!a){const E=await he(`/search/shows?q=${encodeURIComponent(s)}`),v=Array.isArray(E)?E.map($=>$?.show).filter(Boolean):[];a=wt(v,s,n)}const l=a?await Ue(a.id):null;return Te(e,l),l}async function $t({imdbId:t,title:n,year:s}={}){let e=await xt(t);if(e||(e=await kt(n,s)),!e)return null;const u=e.nextEpisode;return{showName:e.name,statusLabel:e.statusLabel,officialSite:e.officialSite,nextEpisode:u,previousEpisode:e.previousEpisode,nextLabel:u?St(u):"",nextAirdateLabel:u?Et(u.airdate,u.airstamp):""}}function St(t){if(!t)return"";const n=t.season!==null&&t.season!==void 0,s=t.number!==null&&t.number!==void 0,e=n&&t.season>=1900;return n&&!e&&s?`S${t.season} B${t.number}`:e&&t.name?t.name:s?`B${t.number}`:t.name||""}const Lt=["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];function Et(t,n){const s=n?new Date(n):t?new Date(`${t}T21:00:00`):null;if(!s||Number.isNaN(s.getTime()))return t||"";const e=new Date,u=l=>new Date(l.getFullYear(),l.getMonth(),l.getDate()).getTime(),a=Math.round((u(s)-u(e))/864e5),h=n?`${String(s.getHours()).padStart(2,"0")}:${String(s.getMinutes()).padStart(2,"0")}`:"";return a<0?"Yayınlandı":a===0?h?`Bugün ${h}`:"Bugün":a===1?h?`Yarın ${h}`:"Yarın":a<=7?`${a} gün sonra`:`${s.getDate()} ${Lt[s.getMonth()]}`}bt();const Ne="cinepulse.decision-room.autoplay";function Tt(t,n){try{const s=JSON.parse(sessionStorage.getItem(Ne)||"null");return sessionStorage.removeItem(Ne),s&&String(s.id)===String(n)&&s.type===t&&Date.now()-Number(s.createdAt||0)<15e3?s:null}catch{return null}}function Pe(t){if(!t||t<=0)return"";const n=Math.floor(t/60),s=t%60;return n>0?`${n} sa ${s>0?s+" dk":""} (${t} dk)`:`${t} dk`}async function Bt(t="tv",n){const s=typeof t=="object"&&t!==null?t.type||"tv":t||"tv",e=typeof t=="object"&&t!==null?t.id:n;let u=s==="series"||s==="tv"||s==="anime"?"tv":s==="movie"?"movie":"tv",a=await Ie(u,e);if(a||(u=u==="tv"?"movie":"tv",a=await Ie(u,e)),!a)return{html:'<div class="container" style="padding: 10rem 0; text-align: center;"><h2>İçerik bulunamadı.</h2></div>',init:()=>{}};const h=!!(a.seasons&&a.seasons.length>0)||u==="tv",l=h?"tv":"movie",E=at(a)||s==="anime"||u==="anime"||it(e);E&&st(e);const v=a.title||a.name||"Detay",$=a.original_title||a.original_name||"",Y=ne(a.backdrop_path,re.BACKDROP_ORIGINAL);ne(a.poster_path,re.POSTER_MEDIUM);const H=a.vote_average?a.vote_average.toFixed(1):"8.5",A=(a.first_air_date||a.release_date||"").substring(0,4),F=a.overview&&a.overview.trim().length>15?a.overview:nt(a,l),J=a.genres||[],x=a.runtime?a.runtime*60:6600,r=rt(e),g=lt(e),y=l==="tv"?we(e):null,S=l==="movie"?te(e,1,1):null,b=l==="movie"?He(e,1,1):!1,m=l==="tv"?ke(e,a.seasons||[]):!1,f=l==="movie"?b:m;let T=l==="movie"?"Filmi İzle":"1. Sezon 1. Bölümü İzle";if(l==="tv"&&y){const i=se(y.currentTime);T=`Devam Et <span class="play-btn-subinfo">S${y.season} B${y.episode}${i?" • "+i:""}</span>`}else l==="movie"&&S&&S.currentTime>0&&(T=`Devam Et <span class="play-btn-subinfo">${se(S.currentTime)}</span>`);const N=a.credits?.crew?a.credits.crew.filter(i=>i.job==="Director").map(i=>i.name):[],d=a.created_by?a.created_by.map(i=>i.name):[],B=N.length>0?N.slice(0,2).join(", "):d.length>0?d.slice(0,2).join(", "):"",k=(parseFloat(H)/2).toFixed(1),q=Math.floor(k),z=k%1>=.4,D="★".repeat(Math.min(5,q))+(z&&q<5?"½":""),C=a.credits&&a.credits.cast?a.credits.cast.slice(0,24):[];let W=null,Z=!1;l==="tv"&&a.seasons&&(W=await pt({tvId:e,seriesTitle:v,originalTitle:$,seriesOverview:F,seasons:a.seasons,posterPath:a.poster_path,backdropPath:a.backdrop_path,isAnime:E,spoilerFree:Z}));const M=a.recommendations?a.recommendations.results.slice(0,6):[],j=l==="movie"?b?"Film İzlendi":"İzlendi Olarak İşaretle":m?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle",ae=a.runtime?`
    <span>${Pe(a.runtime)}</span>
  `:"",ie=E?h?"ANİME DİZİSİ":"ANİME FİLMİ":l==="tv"?"DİZİ":"FİLM",_e=(a.videos?.results||[]).filter(i=>i.site==="YouTube");_e.sort((i,P)=>{const V={Trailer:1,Teaser:2,Clip:3,"Behind the Scenes":4};return(V[i.type]||9)-(V[P.type]||9)});const be=_e.filter((i,P,V)=>i.key&&V.findIndex(U=>U.key===i.key)===P).slice(0,12),ze=[{label:"Resmi fragman ara",query:`${$||v} official trailer`},{label:"Türkçe fragman ara",query:`${v} Türkçe fragman`},{label:"Tanıtım ve teaser ara",query:`${$||v} official teaser`},{label:"Klipleri ara",query:`${$||v} official clip`}].slice(0,Math.max(0,4-be.length));return{html:`
    <div class="detail-view">
      <div class="detail-hero-banner">
        <div class="detail-backdrop-img" style="background-image: url('${Y}')"></div>
        <div class="detail-backdrop-gradient"></div>

        <div class="detail-container">
          <!-- Top Back Action -->
          <button class="detail-back-btn" id="btn-detail-back" title="Önceki Sayfaya Geri Dön">
            <i data-lucide="arrow-left" style="width:16px;height:16px;"></i>
            <span>Geri Dön</span>
          </button>
          
          <div class="detail-hero-content">
            <!-- Left/Center Primary Info Column (Netflix Mulan Layout) -->
            <div class="detail-info-col">
              
              <!-- Giant Cinematic Title (Image 2 Mulan style) -->
              <h1 class="detail-heading-title">${v}</h1>

              <!-- Editorial Subtitle (Original Title & Creator / Director) -->
              <div class="detail-editorial-sub">
                ${$&&$!==v?`<span class="detail-orig-name">${$}</span>`:""}
                ${B?`
                  <span class="detail-director-pill">
                    <strong style="color: var(--primary);">${l==="tv"?"YARATICI":"YÖNETMEN"}:</strong> ${B}
                  </span>
                `:""}
              </div>

              <!-- Rich Storyline / Overview (Longer, comfortable breathing room, no premature clamp) -->
              <div class="detail-storyline-wrapper">
                <p class="detail-storyline ${F.length>550?"truncated":""}" id="detail-storyline-text">${F}</p>
                ${F.length>550?'<button class="btn-storyline-expand" id="btn-expand-storyline"><span>Devamını Oku</span><i data-lucide="chevron-down" style="width:14px;height:14px"></i></button>':""}
              </div>

              <!-- Clean Metadata Line (Directly under story, matching Netflix Mulan) -->
              <div class="detail-meta-line">
                <span class="detail-meta-rating">
                  <i data-lucide="star" style="width:14px; height:14px; fill: #f59e0b; color: #f59e0b;"></i> ${H}
                </span>
                <span>${A}</span>
                ${J.length>0?`<span>${J.slice(0,3).map(i=>i.name).join(" • ")}</span>`:""}
                ${ae}
                ${a.number_of_seasons?`<span>${a.number_of_seasons} Sezon</span>`:""}
                ${a.number_of_episodes?`<span>${a.number_of_episodes} Bölüm</span>`:""}
                <span class="detail-meta-type">${ie}</span>
              </div>

              <!-- Hero Actions (Play + Secondary Options) -->
              <div class="detail-action-deck">
                <div class="detail-action-main-row">
                  ${l==="movie"?`
                    <button class="btn-play-primary" id="btn-play-movie">
                      <i data-lucide="play" style="fill: currentColor; width: 20px; height: 20px;"></i>
                      <span>${T}</span>
                    </button>
                  `:`
                    <button class="btn-play-primary" id="btn-resume-series">
                      <i data-lucide="play" style="fill: currentColor; width: 20px; height: 20px;"></i>
                      <span>${T}</span>
                    </button>
                  `}

                  <button class="btn-action-tile ${g?"active-watch":""}" id="btn-toggle-watchlist">
                    <i data-lucide="${g?"check":"plus"}"></i>
                    <span>${g?"Listemde":"Listem"}</span>
                  </button>

                  <button class="btn-action-tile ${r?"active-fav":""}" id="btn-toggle-fav">
                    <i data-lucide="heart" style="${r?"fill: var(--primary); color: var(--primary)":""}"></i>
                    <span>${r?"Favorilerimde":"Favori"}</span>
                  </button>

                  <button class="btn-action-tile ${f?"active-watched":""}" id="btn-toggle-watched-detail">
                    <i data-lucide="${f?"check-circle-2":"check"}"></i>
                    <span>${j}</span>
                  </button>

                  <button class="btn-action-tile" id="btn-mark-halfway-detail" title="Kaldığım Yer">
                    <i data-lucide="clock" style="color: #fbbf24;"></i>
                    <span>Yarıda Bırak</span>
                  </button>
                </div>

                ${l==="tv"?`
                  <div class="detail-spoiler-inline-row">
                    <label class="spoiler-discovery-pill">
                      <input id="detail-spoiler-free-toggle" type="checkbox" />
                      <i data-lucide="shield-check"></i>
                      <span>Spoilersız Keşfet</span>
                    </label>
                  </div>
                `:""}
              </div>

              ${be.length>0||ze.length>0?`
                <a class="detail-trailer-link" id="btn-watch-trailer" href="#tab-pane-trailers">
                  <i data-lucide="play-circle" style="width: 15px; height: 15px;"></i>
                  Fragmanlara göz at <span aria-hidden="true">↗</span>
                </a>
              `:""}

            </div>

          </div>
        </div>
      </div>

      <!-- Netflix Sub-Navigation Tabs Bar (Images 3 & 4) -->
      <div class="netflix-detail-tabs-bar">
        <div class="container">
          <div class="netflix-tabs-track">
            ${l==="tv"&&W?`
              <button class="netflix-tab-btn active" data-tab="episodes">
                <span>BÖLÜMLER</span>
              </button>
            `:""}

            <button class="netflix-tab-btn ${l==="movie"?"active":""}" data-tab="cast">
              <span>OYUNCULAR</span>
            </button>

            <button class="netflix-tab-btn" data-tab="overview">
              <span>GENEL BAKIŞ</span>
            </button>

            <button class="netflix-tab-btn" data-tab="trailers">
              <span>FRAGMANLAR</span>
            </button>

            ${M.length>0?`
              <button class="netflix-tab-btn" data-tab="recommendations">
                <span>BENZERLERİ</span>
              </button>
            `:""}
          </div>
        </div>
      </div>

      <!-- Netflix Tab Content Panes -->
      <div class="netflix-tab-content-area">
        <div class="container">

          ${l==="tv"&&W?`
            <!-- Tab Pane: Episodes (Image 3) -->
            <div class="netflix-tab-pane active" id="tab-pane-episodes">
              ${W.html}
            </div>
          `:""}

          <!-- Tab Pane: Dedicated Cast Grid (Image 4) -->
          <div class="netflix-tab-pane ${l==="movie"?"active":""}" id="tab-pane-cast">
            <div class="netflix-pane-header">
              <div class="netflix-pane-title-group">
                <h2 class="netflix-pane-title">
                  <i data-lucide="users" style="color: #f59e0b; width: 20px; height: 20px;"></i>
                  <span>Oyuncu Kadrosu & Karakterler</span>
                </h2>
                <p class="netflix-pane-subtitle">Karakteri canlandıran oyuncular ve filmografileri</p>
              </div>
              <span class="netflix-pane-count-pill">${C.length} Oyuncu</span>
            </div>

            ${C.length>0?`
              <div class="netflix-cast-grid">
                ${C.map((i,P)=>{const V=i.profile_path?ne(i.profile_path,re.POSTER_MEDIUM):fe,U=i.character?i.character.split("/")[0].trim():"",G=(i.popularity?Math.min(9.9,Math.max(6.5,i.popularity/3.5+6)):8.5).toFixed(1);return`
                    <div class="netflix-cast-card ${P>=12?"cast-card-hidden":""}" data-person-id="${i.id}" data-person-name="${i.name}" title="${i.name}${U?" ("+U+")":""} • Filmografiyi Gör">
                      <div class="netflix-cast-photo-wrap">
                        <img src="${V}" alt="${i.name}" loading="lazy" onerror="this.onerror=null; this.src='${fe}';" />
                        <div class="netflix-cast-card-hover">
                          <i data-lucide="sparkles" style="width:20px;height:20px;color:#fff;"></i>
                          <span>Filmografi</span>
                        </div>
                      </div>
                      <div class="netflix-cast-info">
                        <h4 class="netflix-cast-name">${i.name}</h4>
                        ${U?`<p class="netflix-cast-character">As ${U}</p>`:""}
                        <div class="netflix-cast-rating">
                          <i data-lucide="star" style="width:11px;height:11px;fill:#f59e0b;stroke:#f59e0b;"></i>
                          <span>${G} / 10</span>
                        </div>
                      </div>
                    </div>
                  `}).join("")}
              </div>

              ${C.length>12?`
                <div style="text-align: center; margin: 2.5rem 0 1rem;">
                  <button class="btn-netflix-show-more" id="btn-show-more-cast">
                    <span>Tüm Oyuncuları Göster (${C.length})</span>
                    <i data-lucide="chevron-down" style="width:16px;height:16px;"></i>
                  </button>
                </div>
              `:""}
            `:`
              <div class="netflix-empty-tab-state">
                <i data-lucide="user-x" style="width:40px;height:40px;color:#666;"></i>
                <p>Bu yapım için oyuncu bilgisi bulunamadı.</p>
              </div>
            `}
          </div>

          <!-- Tab Pane: Overview & Technical Details -->
          <div class="netflix-tab-pane" id="tab-pane-overview">
            <div class="netflix-overview-pane-grid">
              <div class="netflix-overview-main-col">
                <h3 class="netflix-subheading">Özet & Hikaye</h3>
                <p class="netflix-full-overview">${F||"Bu içerik için henüz özet eklenmedi."}</p>
              </div>

              <div class="netflix-overview-specs-col">
                <h3 class="netflix-subheading">Teknik Detaylar</h3>
                <div class="netflix-specs-table">
                  ${$?`
                    <div class="spec-row">
                      <span class="spec-label">Orijinal Başlık</span>
                      <span class="spec-val">${$}</span>
                    </div>
                  `:""}
                  ${B?`
                    <div class="spec-row">
                      <span class="spec-label">${l==="tv"?"Yaratıcı":"Yönetmen"}</span>
                      <span class="spec-val">${B}</span>
                    </div>
                  `:""}
                  ${a.release_date||a.first_air_date?`
                    <div class="spec-row">
                      <span class="spec-label">Yayın Tarihi</span>
                      <span class="spec-val">${a.release_date||a.first_air_date}</span>
                    </div>
                  `:""}
                  ${a.status?`
                    <div class="spec-row">
                      <span class="spec-label">Yayın Durumu</span>
                      <span class="spec-val">${a.status}</span>
                    </div>
                  `:""}
                  ${a.runtime?`
                    <div class="spec-row">
                      <span class="spec-label">Film Süresi</span>
                      <span class="spec-val">${Pe(a.runtime)}</span>
                    </div>
                  `:""}
                  ${a.number_of_seasons?`
                    <div class="spec-row">
                      <span class="spec-label">Toplam Sezon</span>
                      <span class="spec-val">${a.number_of_seasons} Sezon</span>
                    </div>
                  `:""}
                  ${a.number_of_episodes?`
                    <div class="spec-row">
                      <span class="spec-label">Toplam Bölüm</span>
                      <span class="spec-val">${a.number_of_episodes} Bölüm</span>
                    </div>
                  `:""}
                  <div class="spec-row">
                    <span class="spec-label">IMDb Puanı</span>
                    <span class="spec-val" style="color: #fbbf24; font-weight: 750;">★ ${H} / 10</span>
                  </div>
                  <div class="spec-row">
                    <span class="spec-label">Letterboxd</span>
                    <span class="spec-val" style="color: #00e054; font-weight: 750;">${D} (${k})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab Pane: Trailers & Clips -->
          <div class="netflix-tab-pane" id="tab-pane-trailers">
            <div class="netflix-pane-header">
              <div class="netflix-pane-title-group">
                <h2 class="netflix-pane-title">
                  <i data-lucide="youtube" style="color: #f59e0b; width: 20px; height: 20px;"></i>
                  <span>Resmi Fragmanlar & Klipler</span>
                </h2>
                <p class="netflix-pane-subtitle">Resmi Türkçe ve orijinal tanıtım fragmanları</p>
              </div>
            </div>

            <div class="netflix-trailers-showcase">
              ${be.map((i,P)=>`
                <div class="hero-trailer-expand-card netflix-pane-trailer-card" data-video-key="${i.key}" data-video-title="${i.name||"Fragman "+(P+1)}" data-video-type="${i.type||"Fragman"}">
                  <div class="trailer-compact-view">
                    <img src="https://img.youtube.com/vi/${i.key}/mqdefault.jpg" alt="${i.name||"Trailer"}" loading="lazy" />
                    <div class="trailer-thumb-overlay">
                      <div class="trailer-play-chip">
                        <i data-lucide="play" style="width: 14px; height: 14px; fill: currentColor;"></i>
                      </div>
                      <span class="trailer-compact-name">${i.name||"Fragman "+(P+1)}</span>
                    </div>
                  </div>
                  <div class="trailer-expanded-view">
                    <div class="trailer-expanded-player"></div>
                    <div class="trailer-expanded-info">
                      <div class="trailer-expanded-header">
                        <span class="trailer-expanded-tag">${i.type||"RESMİ FRAGMAN"}</span>
                        <button class="trailer-expanded-close" title="Fragmanı kapat" aria-label="Fragmanı kapat" type="button">
                          <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                        </button>
                      </div>
                      <h4 class="trailer-expanded-title">${i.name||`${v} Fragman`}</h4>
                      <div class="trailer-expanded-meta">
                        <span>HD 1080p</span>
                        <span>•</span>
                        <span>YouTube</span>
                      </div>
                      <p class="trailer-expanded-desc">${(F||"").substring(0,110)}...</p>
                    </div>
                  </div>
                </div>
              `).join("")}
              ${ze.map(i=>`
                <a class="trailer-search-card" href="https://www.youtube.com/results?search_query=${encodeURIComponent(i.query)}" target="_blank" rel="noopener noreferrer" aria-label="${i.label}: YouTube'da aç">
                  <i data-lucide="search" aria-hidden="true"></i>
                  <span>${i.label}</span>
                  <small>YouTube'da aç ↗</small>
                </a>
              `).join("")}
            </div>
          </div>

          ${M.length>0?`
            <!-- Tab Pane: More Like This (Image 3 / 4) -->
            <div class="netflix-tab-pane" id="tab-pane-recommendations">
              <div class="netflix-pane-header">
                <div class="netflix-pane-title-group">
                  <h2 class="netflix-pane-title">
                    <i data-lucide="thumbs-up" style="color: #f59e0b; width: 20px; height: 20px;"></i>
                    <span>Benzer Önerilen Yapımlar</span>
                  </h2>
                  <p class="netflix-pane-subtitle">Bu yapımı seven izleyicilerin en çok beğendiği diğer içerikler</p>
                </div>
              </div>
              <div class="media-grid">
                ${M.map(i=>Le(i)).join("")}
              </div>
            </div>
          `:""}

        </div>
      </div>
    </div>
  `,init:i=>{if(!i)return;let P=Tt(l,e);const V=i.querySelector("#btn-detail-back");V&&V.addEventListener("click",o=>{o.preventDefault(),window.history.length>1?window.history.back():window.location.hash="#home"}),W&&W.init(i);const U=i.querySelector("#detail-spoiler-free-toggle");U&&(U.checked=Z,U.addEventListener("change",()=>{Z=U.checked,W?.setSpoilerSafe(Z),K(Z?"Spoilersız keşif açıldı. Sonraki bölüm detayları gizlendi.":"Spoilersız keşif kapatıldı.","info")}));const G=i.querySelector("#btn-play-movie"),ye=async()=>{if(!G||G.disabled)return;G.disabled=!0;const o=G.innerHTML;G.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',L();try{const p=te(e,1,1);await Se({type:E?"anime":"movie",isAnime:E,tmdbId:e,title:v,seriesTitle:v,originalTitle:$,posterPath:a.poster_path,backdropPath:a.backdrop_path,duration:x,currentTime:p?p.currentTime:0,roomSync:P?{roomCode:P.roomCode,mediaId:e,type:l,season:1,episode:1,initialSync:P.initialSync||null}:null})}catch{K("Film açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{G.disabled=!1,G.innerHTML=o,L()}};G&&G.addEventListener("click",ye);const X=i.querySelector("#btn-resume-series"),Me=async()=>{if(!X||X.disabled)return;X.disabled=!0;const o=X.innerHTML;X.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',L();try{const p=P;P=null;const c=we(e),w=p?.season||(c?c.season:1),_=p?.episode||(c?c.episode:1),R=p?0:c?c.currentTime:0;await Se({type:E?"anime":"tv",isAnime:E,tmdbId:e,title:`${v} - S${w}E${_}`,seriesTitle:v,originalTitle:$,season:w,episode:_,posterPath:a.poster_path,backdropPath:a.backdrop_path,currentTime:R,seasonsList:a.seasons||[],roomSync:p?{roomCode:p.roomCode,mediaId:e,type:l,season:w,episode:_,initialSync:p.initialSync||null}:null})}catch{K("İçerik açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{X.disabled=!1,X.innerHTML=o,L()}};X&&X.addEventListener("click",o=>{o.preventDefault(),Me()}),P&&window.setTimeout(()=>{l==="movie"?ye():Me()},0);const Be=i.querySelector("#btn-watch-trailer");Be&&Be.addEventListener("click",o=>{o.preventDefault(),i.querySelectorAll(".netflix-tab-btn").forEach(p=>p.classList.toggle("active",p.dataset.tab==="trailers")),i.querySelectorAll(".netflix-tab-pane").forEach(p=>p.classList.toggle("active",p.id==="tab-pane-trailers")),L(i.querySelector("#tab-pane-trailers")),i.querySelector("#tab-pane-trailers")?.scrollIntoView({behavior:"smooth",block:"start"})}),i.querySelectorAll(".hero-trailer-expand-card").forEach(o=>{o.addEventListener("click",p=>{if(p.target.closest(".trailer-expanded-close")){p.stopPropagation(),o.classList.remove("is-expanded");const _=o.querySelector(".trailer-expanded-player");_&&(_.innerHTML="");return}if(o.classList.contains("is-expanded"))return;i.querySelectorAll(".hero-trailer-expand-card.is-expanded").forEach(_=>{_.classList.remove("is-expanded");const R=_.querySelector(".trailer-expanded-player");R&&(R.innerHTML="")});const c=o.getAttribute("data-video-key");if(!c)return;o.classList.add("is-expanded");const w=o.querySelector(".trailer-expanded-player");w&&(w.innerHTML=`
              <iframe 
                src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(c)}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&playsinline=1"
                frameborder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowfullscreen
                class="trailer-inline-iframe"
                title="${v} Fragman">
              </iframe>
            `),L()})});const oe=i.querySelector("#btn-toggle-fav");oe&&oe.addEventListener("click",()=>{const o=ot({...a,type:E?"anime":l,isAnime:E,media_type:l});K(o?"Favorilere eklendi!":"Favorilerden çıkarıldı.",o?"success":"info");const p=oe.querySelector("i"),c=oe.querySelector("span");p&&c&&(p.style.fill=o?"var(--primary)":"none",p.style.color=o?"var(--primary)":"currentColor",c.textContent=o?"Favorilerimde":"Favorilere Ekle")});const ce=i.querySelector("#btn-toggle-watchlist");ce&&ce.addEventListener("click",()=>{const o=ct({...a,type:E?"anime":l,isAnime:E,media_type:l});K(o?"İzleme listesine eklendi!":"İzleme listesinden çıkarıldı.",o?"success":"info");const p=ce.querySelector("i"),c=ce.querySelector("span");p&&c&&(p.setAttribute("data-lucide",o?"check":"plus"),L(),c.textContent=o?"Listemde":"İzleme Listeme Ekle")});const O=i.querySelector("#btn-toggle-watched-detail");O&&O.addEventListener("click",o=>{if(o.preventDefault(),l==="movie"){const c=Ye(e,1,1,{title:v,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:"movie",duration:x}).completed;K(c?"✓ Film izlendi olarak işaretlendi!":"Film izlendi işareti kaldırıldı.",c?"success":"info"),c?O.classList.add("btn-watched-active"):O.classList.remove("btn-watched-active"),O.innerHTML=`
              <i data-lucide="${c?"check-circle-2":"check"}"></i>
              <span>${c?"Film İzlendi":"İzlendi Olarak İşaretle"}</span>
            `,L()}else{const c=!ke(e,a.seasons||[]);dt(e,a.seasons||[],c,{title:v,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:E?"anime":"tv",isAnime:E}),K(c?"✓ Dizinin tüm bölümleri izlendi olarak işaretlendi!":"Tüm bölümler izlenmedi yapıldı.",c?"success":"info"),c?O.classList.add("btn-watched-active"):O.classList.remove("btn-watched-active"),O.innerHTML=`
              <i data-lucide="${c?"check-circle-2":"check"}"></i>
              <span>${c?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle"}</span>
            `,L(),i.querySelectorAll(".episode-card").forEach(_=>{const R=_.querySelector(".badge-watched-status"),I=_.querySelector(".btn-mark-ep-watched");R&&(R.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',R.style.background="var(--accent-green)",R.style.color="#fff",R.style.display=c?"inline-flex":"none"),I&&(c?(I.classList.add("watched"),I.style.background="#10b981",I.style.borderColor="#10b981"):(I.classList.remove("watched"),I.style.background="rgba(0,0,0,0.65)",I.style.borderColor="rgba(255,255,255,0.3)"))});const w=i.querySelector("#btn-mark-season-all");if(w){const _=w.querySelector("span"),R=w.querySelector("i");_&&(_.textContent=c?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),R&&R.setAttribute("data-lucide",c?"check-circle-2":"check-check"),c?(w.style.background="rgba(16, 185, 129, 0.2)",w.style.borderColor="#10b981",w.style.color="#10b981"):(w.style.background="",w.style.borderColor="",w.style.color="")}L()}});const Ze=o=>{if(o&&o.detail&&o.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const p=l==="movie"?He(e,1,1):!1,c=l==="tv"?ke(e,a.seasons||[]):!1,w=l==="movie"?p:c;if(O){w?O.classList.add("btn-watched-active"):O.classList.remove("btn-watched-active");const I=l==="movie"?w?"Film İzlendi":"İzlendi Olarak İşaretle":w?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle";O.innerHTML=`
            <i data-lucide="${w?"check-circle-2":"check"}"></i>
            <span>${I}</span>
          `}const _=i.querySelector("#btn-play-movie");if(_&&l==="movie"){const I=te(e,1,1);if(I&&I.currentTime>0&&!I.completed){const pe=se(I.currentTime);_.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">${pe}</span></span>`}}const R=i.querySelector("#btn-resume-series");if(R&&l==="tv"){const I=we(e);if(I){const pe=se(I.currentTime);R.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">S${I.season} B${I.episode}${pe?" • "+pe:""}</span></span>`}}L()};window.addEventListener("sineflix_data_changed",Ze);const Ce=i.querySelector("#btn-mark-halfway-detail");Ce&&Ce.addEventListener("click",o=>{if(o.preventDefault(),l==="movie"){const p=Math.round(x*.5),c=se(p);$e(e,1,1,p,{title:v,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:E?"anime":"movie",isAnime:E,duration:x}),K(`⏳ Film ${c} dakikasında yarıda bırakıldı olarak işaretlendi!`,"info");const w=i.querySelector("#btn-play-movie span");w&&(w.textContent=`Kaldığın Yerden Devam Et (${c})`)}else{const p=y?y.season:1,c=y?y.episode:1;$e(e,p,c,1200,{title:v,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:E?"anime":"tv",isAnime:E,duration:3e3}),K(`⏳ S${p} B${c} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info");const w=i.querySelector("#btn-resume-series span");w&&(w.textContent=`Kaldığın Yerden Devam Et (S${p} B${c} • 20:00)`)}});const de=i.querySelector("#btn-expand-storyline"),ve=i.querySelector("#detail-storyline-text");de&&ve&&de.addEventListener("click",()=>{const o=!ve.classList.contains("truncated");ve.classList.toggle("truncated");const p=de.querySelector("span"),c=de.querySelector("i");p&&(p.textContent=o?"Devamını Oku":"Daralt"),c&&(c.style.transform=o?"rotate(0deg)":"rotate(180deg)")});const Ae=i.querySelectorAll(".netflix-tab-btn"),Ve=i.querySelectorAll(".netflix-tab-pane");Ae.forEach(o=>{o.addEventListener("click",p=>{p.preventDefault();const c=o.getAttribute("data-tab");c!=="trailers"&&i.querySelectorAll("#tab-pane-trailers .hero-trailer-expand-card.is-expanded").forEach(_=>{_.classList.remove("is-expanded"),_.querySelector(".trailer-expanded-player").innerHTML=""}),Ae.forEach(_=>_.classList.remove("active")),Ve.forEach(_=>_.classList.remove("active")),o.classList.add("active");const w=i.querySelector(`#tab-pane-${c}`);w&&(w.classList.add("active"),L(w))})}),i.querySelectorAll(".netflix-cast-card").forEach(o=>{o.addEventListener("click",p=>{p.preventDefault();const c=o.getAttribute("data-person-id"),w=o.getAttribute("data-person-name");c&&mt(c,w)})});const ge=i.querySelector("#btn-show-more-cast");ge&&ge.addEventListener("click",o=>{o.preventDefault(),i.querySelectorAll(".netflix-cast-card.cast-card-hidden").forEach(c=>c.classList.remove("cast-card-hidden")),ge.style.display="none",L()});const De=i.querySelector("#btn-pane-play-trailer");De&&De.addEventListener("click",()=>{const o=i.querySelector("#btn-watch-trailer");o&&o.click()});const Q=i.querySelector("#detail-next-episode-badge");Q&&l==="tv"&&(async()=>{try{const o=await $t({imdbId:a.external_ids?.imdb_id,title:$||v,year:A});if(!o?.nextEpisode||!Q.isConnected)return;const p=o.nextLabel||"",c=o.nextAirdateLabel||"";if(!p&&!c||c==="Yayınlandı")return;const w=[p?`Yeni bölüm ${p}`:"Yeni bölüm",c].filter(Boolean).join(" • ");Q.innerHTML=`<i data-lucide="calendar-clock" style="width:13px; height:13px"></i><span>${w}</span>`,Q.title=`Sonraki bölüm: ${p||"-"}${o.nextEpisode.name?" — "+o.nextEpisode.name:""}${c?" • "+c:""} (Kaynak: TVmaze)`,Q.style.display="inline-flex",L(Q)}catch{}})();const qe=i.querySelector(".media-grid");qe&&We(qe)}}}export{Bt as renderDetailView};

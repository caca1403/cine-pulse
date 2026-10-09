import{i as xe,m as Je,s as W,r as $,f as Qe,g as ne,T as re,a as ae,S as et,t as We,b as Se,c as tt,o as $e,d as at,e as me,h as Le,j as Oe,k as Ie,l as it,n as st,p as nt,q as rt,u as lt,v as ot,w as we,x as He,y as ke,z as se,A as ct,B as dt,C as pt}from"./index-BhQWUMv-.js";import"./vendor-capacitor-VGCIBgSg.js";async function ut({tvId:t,seriesTitle:n,originalTitle:s="",seriesOverview:e="",seasons:f=[],posterPath:a="",backdropPath:m="",isAnime:l=!1,spoilerFree:T=!1}){const y=f.filter(g=>g.season_number>0);y.length===0&&f.length>0&&y.push(f[0]);const E=y.length>0?y[0].season_number:1,O=y.length>0&&y[0].episode_count||10,H=xe(t,E,O);let C=!!T,F=null;return{html:`
    <div class="season-selector-wrapper">
      <div class="season-selector-header">
        <div style="display: flex; align-items: center; gap: 0.65rem;">
          <span class="rail-icon-pill" style="--rail-color: #dfff76; width: 28px; height: 28px;">
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
          ${y.map(g=>`
            <button class="season-pill ${g.season_number===E?"active":""}" data-season="${g.season_number}" data-ep-count="${g.episode_count||10}">
              ${g.name||`${g.season_number}. Sezon`} <span style="opacity: 0.75; font-size: 0.72rem; margin-left: 0.2rem;">(${g.episode_count} Bölüm)</span>
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
  `,init:g=>{if(!g)return;let r=E,v=O;const b=()=>{const d=g.querySelector("#btn-mark-season-all");if(!d)return;const _=xe(t,r,v),k=d.querySelector("span"),D=d.querySelector("i");k&&(k.textContent=_?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),D&&D.setAttribute("data-lucide",_?"check-circle-2":"check-check"),_?(d.style.background="rgba(16, 185, 129, 0.2)",d.style.borderColor="#10b981",d.style.color="#10b981"):(d.style.background="",d.style.borderColor="",d.style.color=""),$()};ue(t,n,e,r,g,a,m,s,y,b,l,C);const S=d=>{if(d&&d.detail&&d.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const _=g.querySelector("#episode-grid-container");_&&(_.querySelectorAll(".episode-card").forEach(k=>{const D=parseInt(k.getAttribute("data-season"),10),B=parseInt(k.getAttribute("data-episode"),10),q=ae(t,D,B),z=q?q.progressPercent:0,Y=q?q.completed||z>=90:!1,Z=q&&!Y&&q.currentTime>0,A=k.querySelector(".badge-watched-status"),j=k.querySelector(".btn-mark-ep-watched"),ie=k.querySelector(".card-progress-fill"),Q=k.querySelector(".btn-mark-ep-halfway");A&&(Y?(A.innerHTML='<i data-lucide="check" style="width:10px; height:10px"></i> İZLENDİ',A.style.background="var(--accent-green)",A.style.color="#fff",A.style.fontSize="0.68rem",A.style.fontWeight="800",A.style.padding="0.2rem 0.45rem",A.style.borderRadius="4px",A.style.whiteSpace="nowrap",A.style.display="inline-flex"):Z?(A.innerHTML='<i data-lucide="clock" style="width:10px; height:10px"></i> YARIDA',A.style.background="#dfff76",A.style.color="#000",A.style.fontSize="0.68rem",A.style.fontWeight="850",A.style.padding="0.2rem 0.45rem",A.style.borderRadius="4px",A.style.whiteSpace="nowrap",A.style.display="inline-flex"):A.style.display="none"),j&&(Y?(j.classList.add("watched"),j.style.background="#10b981",j.style.borderColor="#10b981",j.title="İzlendi işaretini kaldır"):(j.classList.remove("watched"),j.style.background="rgba(0,0,0,0.65)",j.style.borderColor="rgba(255,255,255,0.3)",j.title="İzlendi olarak işaretle")),Q&&(Q.classList.toggle("is-halfway",!!Z),Q.style.background=Z?"#dfff76":"rgba(0,0,0,0.65)",Q.style.borderColor=Z?"#dfff76":"rgba(255,255,255,0.3)"),ie&&(ie.style.width=`${z}%`,ie.style.background=Y?"var(--accent-green)":"#dfff76")}),$()),b()};window.addEventListener("sineflix_data_changed",S),g.querySelectorAll(".season-pill").forEach(d=>{d.addEventListener("click",_=>{_.preventDefault(),g.querySelectorAll(".season-pill").forEach(k=>k.classList.remove("active")),d.classList.add("active"),d.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}),r=parseInt(d.getAttribute("data-season"),10),v=parseInt(d.getAttribute("data-ep-count"),10)||10,ue(t,n,e,r,g,a,m,s,y,b,l,C),b()})});const x=g.querySelector(".season-pill.active");x&&setTimeout(()=>{x.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},120);const u=g.querySelector("#season-tabs-bar"),h=g.querySelector("#btn-season-prev"),L=g.querySelector("#btn-season-next");if(u){h?.addEventListener("click",B=>{B.preventDefault(),u.scrollBy({left:-260,behavior:"smooth"})}),L?.addEventListener("click",B=>{B.preventDefault(),u.scrollBy({left:260,behavior:"smooth"})}),u.addEventListener("wheel",B=>{B.deltaY!==0&&u.scrollWidth>u.clientWidth&&(B.preventDefault(),u.scrollLeft+=B.deltaY)},{passive:!1});let d=!1,_=0,k=0,D=!1;u.addEventListener("mousedown",B=>{B.button===0&&(d=!0,D=!1,u.classList.add("dragging"),_=B.pageX-u.offsetLeft,k=u.scrollLeft)}),window.addEventListener("mousemove",B=>{if(!d)return;const z=(B.pageX-u.offsetLeft-_)*1.5;Math.abs(z)>4&&(D=!0),u.scrollLeft=k-z}),window.addEventListener("mouseup",()=>{d&&(d=!1,u.classList.remove("dragging"),setTimeout(()=>{D=!1},50))}),u.addEventListener("click",B=>{D&&(B.preventDefault(),B.stopPropagation())},!0)}const N=g.querySelector("#btn-mark-season-all");N&&N.addEventListener("click",d=>{d.preventDefault();const k=!xe(t,r,v);Je(t,r,v,k,{title:n,posterPath:a,backdropPath:m,type:l?"anime":"tv",isAnime:l}),W(k?`${r}. Sezonun tüm bölümleri izlendi!`:`${r}. Sezon izlenmedi olarak işaretlendi.`,k?"success":"info");const D=g.querySelector("#episode-grid-container");D&&(D.querySelectorAll(".episode-card").forEach(B=>{const q=B.querySelector(".badge-watched-status"),z=B.querySelector(".btn-mark-ep-watched");q&&(q.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',q.style.background="var(--accent-green)",q.style.color="#fff",q.style.display=k?"inline-flex":"none"),z&&(k?(z.classList.add("watched"),z.style.background="#10b981",z.style.borderColor="#10b981",z.title="İzlendi işaretini kaldır"):(z.classList.remove("watched"),z.style.background="rgba(0,0,0,0.65)",z.style.borderColor="rgba(255,255,255,0.3)",z.title="İzlendi olarak işaretle"))}),$()),b()}),F=d=>{C=!!d,ue(t,n,e,r,g,a,m,s,y,b,l,C)}},setSpoilerSafe(g){C=!!g,F?.(C)}}}function ft(t){const n=tt().filter(s=>String(s?.id)===String(t)&&(Number(s.currentTime)>0||s.completed||Number(s.progressPercent)>0));return n.length?n.reduce((s,e)=>{const f={season:Math.max(1,Number(e.season)||1),episode:Math.max(1,Number(e.episode)||1)};return f.season>s.season||f.season===s.season&&f.episode>s.episode?f:s},{season:1,episode:1}):{season:1,episode:1}}function Fe(t){return String(t||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}async function ue(t,n,s,e,f,a="",m="",l="",T=[],y=null,E=!1,O=!1){const H=f.querySelector("#episode-grid-container");if(!H)return;H.innerHTML=`<div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;"><i data-lucide="loader-2" class="spin-loader" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></i><div>${e}. Sezon bölümleri getiriliyor...</div></div>`,$();let C=null;try{C=await Qe(t,e)}catch{}if(!C||!C.episodes||C.episodes.length===0){H.innerHTML=`
      <div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
        <p style="margin-bottom: 0.75rem;">Bu sezon için bölüm verisi getirilemedi.</p>
        <button id="btn-retry-season-episodes" class="btn-secondary" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
          <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
          <span>Tekrar Dene</span>
        </button>
      </div>
    `,$(),f.querySelector("#btn-retry-season-episodes")?.addEventListener("click",()=>{ue(t,n,s,e,f,a,m,l,T,y,E,O)});return}const F=O?ft(t):null,J=O?C.episodes.filter(r=>e<F.season||e===F.season&&Number(r.episode_number)<=F.episode+1):C.episodes;if(O&&J.length===0){H.innerHTML='<div class="spoiler-safe-locked"><i data-lucide="shield-check"></i><strong>Bu sezon spoiler korumasında</strong><span>Önceki sezona ilerledikçe bölüm detayları burada açılır.</span></div>',$();return}const g=O?`<div class="spoiler-safe-notice"><i data-lucide="shield-check"></i><span>Spoilersız keşif açık · S${F.season} B${F.episode+1} sonrasının detayları gizli.</span></div>`:"";H.innerHTML=g+J.map(r=>{const v=r.episode_number;let b=(r.name||"").trim();b=b.replace(new RegExp(`^(?:${v}\\s*[\\.\\:\\-]\\s*)+(?:Bölüm\\s*[\\:\\-]\\s*)?`,"i"),""),b=b.replace(new RegExp(`^Bölüm\\s*${v}\\s*[\\:\\-]\\s*`,"i"),""),b=b.trim();const S=b?`${v}. Bölüm: ${b}`:`${v}. Bölüm`;let x=r.overview?r.overview.trim():"";(!x||x.length<5)&&(s&&s.length>10?x=`${v}. Bölüm: ${s}`:x=`${n} ${e}. Sezon ${v}. Bölüm Türkçe Dublaj ve Altyazılı yüksek kalitede kesintisiz HD izle.`);const u=x.length>90,h=ne(r.still_path,re.STILL_MEDIUM),L=r.air_date||"",N=r.runtime?`${r.runtime} dk`:"",d=ae(t,e,v),_=d?d.progressPercent:0,k=d?d.completed||_>=90:!1,D=d&&!k&&d.currentTime>0,B=_>0?`
      <div class="card-progress-bar">
        <div class="card-progress-fill" style="width: ${_}%; background: ${k?"var(--accent-green)":"#dfff76"};"></div>
      </div>
    `:"";let q="";k?q=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.4rem; left: 0.4rem; background: var(--accent-green); color: #fff; z-index: 4; font-size: 0.68rem; font-weight: 800; padding: 0.2rem 0.45rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; line-height: 1; white-space: nowrap;">
          <i data-lucide="check" style="width:10px; height:10px"></i> İZLENDİ
        </span>
      `:D?q=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.4rem; left: 0.4rem; background: #dfff76; color: #000; font-weight: 850; z-index: 4; font-size: 0.68rem; padding: 0.2rem 0.45rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; line-height: 1; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">
          <i data-lucide="clock" style="width:10px; height:10px"></i> YARIDA
        </span>
      `:q=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.4rem; left: 0.4rem; background: var(--accent-green); color: #fff; display: none; z-index: 4; font-size: 0.68rem; font-weight: 800; padding: 0.2rem 0.45rem; border-radius: 4px; line-height: 1; white-space: nowrap;">
          <i data-lucide="check" style="width:10px; height:10px"></i> İZLENDİ
        </span>
      `;const z=Fe(S),Y=Fe(x);return`
      <div class="episode-card" data-tv-id="${t}" data-season="${e}" data-episode="${v}" data-title="${z}">
        <div class="episode-thumb-wrap">
          <img src="${h}" alt="${z}" loading="lazy" onerror="this.onerror=null; this.src='${et}';" />
          <span class="episode-number-chip">${e}x${v<10?"0"+v:v}</span>
          ${q}
          
          <div class="episode-play-overlay">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary-gradient); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.6);">
              <i data-lucide="play" style="width: 20px; height: 20px; fill: #15200b; color: #15200b; margin-left: 2px;"></i>
            </div>
          </div>

          <!-- Top Right Action Controls: Mark Watched & Halfway -->


          ${B}
        </div>

        <div class="episode-info">
          <div class="episode-header-row">
            <span class="episode-title" title="${z}">${S}</span>
            <span class="episode-duration">${N||L}</span>
          </div>
          
          <div class="episode-overview-container">
            <div class="episode-overview ${u?"truncated":""}" data-full="${Y}">
              ${x}
            </div>
            ${u?`
              <button class="btn-toggle-overview" style="color: var(--primary); font-weight: 700; font-size: 0.78rem; margin-top: 0.25rem; display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; background: none; border: none; padding: 0;">
                <span>Devamını Oku</span>
                <i data-lucide="chevron-down" style="width: 12px; height: 12px;"></i>
              </button>
            `:""}
          </div>

          <div class="episode-footer" style="font-size: 0.76rem; color: var(--text-muted); margin-top: auto; padding-top: 0.45rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06);">
            <span class="episode-airdate">${L}</span>
          <div class="episode-status-actions">
            <button class="btn-mark-ep-halfway ${D?"is-halfway":""}" data-tv-id="${t}" data-season="${e}" data-episode="${v}" title="Yarıda Bırakıldı (20. dk)" aria-label="Bu bölümü yarıda bırakıldı olarak işaretle" style="width: 28px; height: 28px; border-radius: 50%; background: ${D?"#dfff76":"rgba(0,0,0,0.65)"}; border: 1px solid ${D?"#dfff76":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="clock" style="width: 13px; height: 13px;"></i>
            </button>

            <button class="btn-mark-ep-watched ${k?"watched":""}" data-tv-id="${t}" data-season="${e}" data-episode="${v}" title="${k?"İzlendi işaretini kaldır":"İzlendi olarak işaretle"}" aria-label="Bölümün izlendi durumunu değiştir" style="width: 28px; height: 28px; border-radius: 50%; background: ${k?"#10b981":"rgba(0,0,0,0.65)"}; border: 1px solid ${k?"#10b981":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="check" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
            <span class="btn-play-episode-trigger" style="color: var(--primary); font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 0.25rem;">
              <span>Oynat</span>
              <i data-lucide="play" style="width: 11px; height: 11px; fill: currentColor;"></i>
            </span>
          </div>
        </div>
      </div>
    `}).join(""),$(),f.querySelectorAll(".btn-toggle-overview").forEach(r=>{r.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation();const b=r.closest(".episode-overview-container"),S=b?b.querySelector(".episode-overview"):null;if(!S)return;const x=r.querySelector("span"),u=r.querySelector("i");S.classList.contains("truncated")?(S.classList.remove("truncated"),x&&(x.textContent="Daralt"),u&&u.setAttribute("data-lucide","chevron-up")):(S.classList.add("truncated"),x&&(x.textContent="Devamını Oku"),u&&u.setAttribute("data-lucide","chevron-down")),$()})}),H.querySelectorAll(".btn-mark-ep-watched").forEach(r=>{r.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation();const b=parseInt(r.getAttribute("data-season"),10),S=parseInt(r.getAttribute("data-episode"),10),x=r.closest(".episode-card"),h=We(t,b,S,{title:n,posterPath:a,backdropPath:m,type:E?"anime":"tv",isAnime:E}).completed;if(W(h?`S${b} B${S} izlendi olarak işaretlendi!`:`S${b} B${S} izlendi işareti kaldırıldı.`,h?"success":"info"),h?(r.classList.add("watched"),r.style.background="#10b981",r.style.borderColor="#10b981",r.title="İzlendi işaretini kaldır"):(r.classList.remove("watched"),r.style.background="rgba(0,0,0,0.65)",r.style.borderColor="rgba(255,255,255,0.3)",r.title="İzlendi olarak işaretle"),x){const L=x.querySelector(".badge-watched-status");L&&(L.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',L.style.background="var(--accent-green)",L.style.color="#fff",L.style.display=h?"inline-flex":"none")}typeof y=="function"&&y(),$()})}),H.querySelectorAll(".btn-mark-ep-halfway").forEach(r=>{r.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation();const b=parseInt(r.getAttribute("data-season"),10),S=parseInt(r.getAttribute("data-episode"),10),x=r.closest(".episode-card");if(Se(t,b,S,1200,{title:n,posterPath:a,backdropPath:m,type:E?"anime":"tv",isAnime:E,duration:2700}),r.classList.add("is-halfway"),r.style.background="#dfff76",r.style.borderColor="#dfff76",x){const u=x.querySelector(".badge-watched-status");u&&(u.innerHTML='<i data-lucide="clock" style="width:10px; height:10px"></i> YARIDA',u.style.background="#dfff76",u.style.color="#000",u.style.fontWeight="850",u.style.padding="0.2rem 0.45rem",u.style.borderRadius="4px",u.style.fontSize="0.68rem",u.style.whiteSpace="nowrap",u.style.display="inline-flex")}W(`S${b} B${S} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info"),$()})}),H.querySelectorAll(".episode-card").forEach(r=>{let v=!1;const b=async S=>{if(S&&S.target&&(S.target.closest(".btn-mark-ep-watched")||S.target.closest(".btn-mark-ep-halfway")||S.target.closest(".btn-toggle-overview"))||(S&&(S.preventDefault(),S.stopPropagation()),v))return;v=!0;const x=parseInt(r.getAttribute("data-season"),10),u=parseInt(r.getAttribute("data-episode"),10),h=r.getAttribute("data-title")||`${u}. Bölüm`;r.classList.add("is-loading-episode");const L=r.querySelector(".btn-play-episode-trigger"),N=L?L.innerHTML:"";L&&(L.innerHTML='<span>Yükleniyor...</span><i data-lucide="loader-2" class="spin-loader" style="width: 12px; height: 12px;"></i>',$());const d=r.querySelector(".episode-play-overlay i");d&&(d.setAttribute("data-lucide","loader-2"),d.classList.add("spin-loader"),$());try{const _=ae(t,x,u),k=_?_.currentTime:0;await $e({type:E?"anime":"tv",isAnime:E,tmdbId:t,title:`${n} - S${x}E${u}: ${h}`,seriesTitle:n,originalTitle:l||n,season:x,episode:u,posterPath:a,backdropPath:m,currentTime:k,seasonsList:T,maxEpisodes:C.episodes?C.episodes.length:0})}catch{W("Bölüm açılırken bir sorun oluştu, lütfen tekrar deneyin.","error")}finally{v=!1,r.classList.remove("is-loading-episode"),L&&N&&(L.innerHTML=N),d&&(d.setAttribute("data-lucide","play"),d.classList.remove("spin-loader")),$()}};r.addEventListener("click",b)})}let fe=null;async function mt(t,n="",s=""){te();const e=document.createElement("div");e.id="cast-explorer-modal-root",e.className="cast-explorer-backdrop",document.body.appendChild(e),fe=e,e.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>
      <div class="cast-explorer-loading">
        <div class="cast-explorer-spinner"></div>
        <span>${n||"Oyuncu"} bilgileri ve filmografisi yükleniyor...</span>
      </div>
    </div>
  `,$(e);const f=e.querySelector("#btn-close-cast-explorer");f&&(f.onclick=()=>te()),e.onclick=h=>{h.target===e&&te()};const a=h=>{h.key==="Escape"&&(te(),window.removeEventListener("keydown",a))};window.addEventListener("keydown",a);const m=await at(t);if(!m){e.innerHTML=`
      <div class="cast-explorer-dialog">
        <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
          <i data-lucide="x" style="width: 20px; height: 20px;"></i>
        </button>
        <div class="cast-explorer-loading">
          <i data-lucide="alert-circle" style="width: 36px; height: 36px; color: #ef4444;"></i>
          <span>Oyuncu bilgileri alınamadı.</span>
        </div>
      </div>
    `,$(e);return}const l=m.name||n,T=m.profile_path?ne(m.profile_path,re.POSTER_MEDIUM):s||me,y=m.birthday?m.birthday.substring(0,4):"",E=m.place_of_birth||"",O=m.known_for_department==="Acting"?"Oyuncu":m.known_for_department==="Directing"?"Yönetmen":m.known_for_department||"Sanatçı",H=m.biography&&m.biography.trim().length>20?m.biography:`${l}, sinema ve televizyon dünyasında yer aldığı yapımlarla tanınan başarılı bir sanatçıdır.`,C=m.combined_credits?.cast||[],F=m.combined_credits?.crew||[],J=[...C,...F],g=new Set,r=[];for(const h of J){if(!h||!h.id)continue;const L=`${h.media_type||"movie"}_${h.id}`;g.has(L)||(g.add(L),h.poster_path&&r.push(h))}r.sort((h,L)=>(L.popularity||0)-(h.popularity||0));const v=r.filter(h=>h.media_type==="movie"||!h.media_type&&h.title).length,b=r.filter(h=>h.media_type==="tv"||!h.media_type&&h.name).length;e.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>

      <!-- Actor Hero Header -->
      <div class="cast-explorer-header">
        <div class="cast-explorer-avatar-box">
          <img src="${T}" alt="${l}" class="cast-explorer-avatar" onerror="this.onerror=null; this.src='${me}';" />
        </div>
        <div class="cast-explorer-bio-box">
          <div class="cast-explorer-name-row">
            <h2>${l}</h2>
            <span class="cast-explorer-dept-tag">${O}</span>
          </div>
          <div class="cast-explorer-meta-row">
            ${y?`<span><i data-lucide="calendar" style="width:13px;height:13px;"></i> D: ${y}</span>`:""}
            ${E?`<span><i data-lucide="map-pin" style="width:13px;height:13px;"></i> ${E}</span>`:""}
            <span><i data-lucide="film" style="width:13px;height:13px;"></i> ${r.length} Yapım</span>
          </div>
          <p class="cast-explorer-bio-text">${H}</p>
        </div>
      </div>

      <!-- Filmography Tabs -->
      <div class="cast-explorer-tabs">
        <button class="cast-tab-btn active" data-filter="all">Tümü (${r.length})</button>
        <button class="cast-tab-btn" data-filter="movie">Filmler (${v})</button>
        <button class="cast-tab-btn" data-filter="tv">Diziler (${b})</button>
      </div>

      <!-- Media Cards Grid -->
      <div class="cast-explorer-grid" id="cast-explorer-grid">
        ${r.map(h=>Le(h)).join("")}
      </div>
    </div>
  `,$(e);const S=e.querySelector("#btn-close-cast-explorer");S&&(S.onclick=()=>te());const x=e.querySelector("#cast-explorer-grid");x&&(Oe(x),x.addEventListener("click",()=>{setTimeout(()=>te(),150)}));const u=e.querySelectorAll(".cast-tab-btn");u.forEach(h=>{h.onclick=()=>{u.forEach(d=>d.classList.remove("active")),h.classList.add("active");const L=h.getAttribute("data-filter");let N=r;L==="movie"?N=r.filter(d=>d.media_type==="movie"||!d.media_type&&d.title):L==="tv"&&(N=r.filter(d=>d.media_type==="tv"||!d.media_type&&d.name)),x&&(x.innerHTML=N.length>0?N.map(d=>Le(d)).join(""):'<div class="cast-empty-state">Bu kategoride yapım bulunamadı.</div>',$(x))}})}function te(){if(fe){try{fe.remove()}catch{}fe=null}}const ht="https://api.tvmaze.com",yt=5500,Ke=30*60*1e3,je="cinepulse_tvmaze_cache_v1",le=new Map;function bt(){try{const t=sessionStorage.getItem(je);if(!t)return;const n=JSON.parse(t);n&&typeof n=="object"&&Object.entries(n).forEach(([s,e])=>{e?.savedAt&&Date.now()-e.savedAt<Ke&&le.set(s,e)})}catch{}}function vt(){try{const t={};let n=0;for(const[s,e]of le.entries()){if(n++>=80)break;t[s]=e}sessionStorage.setItem(je,JSON.stringify(t))}catch{}}function Ee(t){const n=le.get(t);if(n){if(Date.now()-n.savedAt>Ke){le.delete(t);return}return n.data}}function Te(t,n){le.set(t,{savedAt:Date.now(),data:n}),vt()}async function he(t){try{const n=await fetch(`${ht}${t}`,{headers:{Accept:"application/json"},signal:AbortSignal.timeout(yt)});return n.ok?await n.json():null}catch{return null}}function Re(t){return String(t||"").toLowerCase().replace(/[^a-z0-9çğıöşü ]/gi," ").replace(/\s+/g," ").trim()}function Ue(t,n){const s=Re(t),e=Re(n);return!s||!e?!1:s===e?!0:s.includes(e)||e.includes(s)}function Ne(t){return t?{season:t.season??null,number:t.number??null,name:t.name||"",airdate:t.airdate||"",airstamp:t.airstamp||"",runtime:t.runtime||null}:null}function gt(t){switch(t){case"Running":return"Devam ediyor";case"Ended":return"Sonlandı";case"To Be Determined":return"Belirsiz";case"In Development":return"Yapım aşamasında";default:return t||""}}async function xt(t){const n=`lookup:${t}`,s=Ee(n);if(s!==void 0)return s;const e=await he(`/lookup/shows?${t}`);return Te(n,e||null),e||null}async function Ge(t){if(!t)return null;const n=`show:${t}`,s=Ee(n);if(s!==void 0)return s;const e=await he(`/shows/${t}?embed[]=nextepisode&embed[]=previousepisode`),f=e?{tvmazeId:e.id,name:e.name||"",status:e.status||"",statusLabel:gt(e.status),premiered:e.premiered||"",officialSite:e.officialSite||"",thetvdbId:e.externals?.thetvdb??null,imdbId:e.externals?.imdb||"",nextEpisode:Ne(e._embedded?.nextepisode),previousEpisode:Ne(e._embedded?.previousepisode)}:null;return Te(n,f),f}async function wt(t){const n=String(t||"").trim();if(!n)return null;const s=n.startsWith("tt")?n:`tt${n}`,f=(await xt(`imdb=${encodeURIComponent(s)}`))?.id||null;return f?Ge(f):null}function Ze(t,n){const s=parseInt(String(t?.premiered||"").substring(0,4),10),e=parseInt(String(n||""),10);return!e||!s?0:Math.abs(s-e)}function kt(t,n,s){let e=null,f=1/0;for(const a of t){if(!a||!Ue(a.name,n))continue;const m=Ze(a,s);if(m>1)continue;const l=m*10+(a.status==="Running"?0:1);l<f&&(f=l,e=a)}return e}async function St(t,n){const s=String(t||"").trim();if(s.length<2)return null;const e=`search:${s}:${n||""}`,f=Ee(e);if(f!==void 0)return f;let a=null;const m=await he(`/singlesearch/shows?q=${encodeURIComponent(s)}`);if(m&&Ue(m.name,s)&&Ze(m,n)<=1&&(a=m),!a){const T=await he(`/search/shows?q=${encodeURIComponent(s)}`),y=Array.isArray(T)?T.map(E=>E?.show).filter(Boolean):[];a=kt(y,s,n)}const l=a?await Ge(a.id):null;return Te(e,l),l}async function $t({imdbId:t,title:n,year:s}={}){let e=await wt(t);if(e||(e=await St(n,s)),!e)return null;const f=e.nextEpisode;return{showName:e.name,statusLabel:e.statusLabel,officialSite:e.officialSite,nextEpisode:f,previousEpisode:e.previousEpisode,nextLabel:f?Lt(f):"",nextAirdateLabel:f?Tt(f.airdate,f.airstamp):""}}function Lt(t){if(!t)return"";const n=t.season!==null&&t.season!==void 0,s=t.number!==null&&t.number!==void 0,e=n&&t.season>=1900;return n&&!e&&s?`S${t.season} B${t.number}`:e&&t.name?t.name:s?`B${t.number}`:t.name||""}const Et=["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];function Tt(t,n){const s=n?new Date(n):t?new Date(`${t}T21:00:00`):null;if(!s||Number.isNaN(s.getTime()))return t||"";const e=new Date,f=l=>new Date(l.getFullYear(),l.getMonth(),l.getDate()).getTime(),a=Math.round((f(s)-f(e))/864e5),m=n?`${String(s.getHours()).padStart(2,"0")}:${String(s.getMinutes()).padStart(2,"0")}`:"";return a<0?"Yayınlandı":a===0?m?`Bugün ${m}`:"Bugün":a===1?m?`Yarın ${m}`:"Yarın":a<=7?`${a} gün sonra`:`${s.getDate()} ${Et[s.getMonth()]}`}bt();const Pe="cinepulse.decision-room.autoplay";function _t(t,n){try{const s=JSON.parse(sessionStorage.getItem(Pe)||"null");return sessionStorage.removeItem(Pe),s&&String(s.id)===String(n)&&s.type===t&&Date.now()-Number(s.createdAt||0)<15e3?s:null}catch{return null}}function Ye(t){if(!t||t<=0)return"";const n=Math.floor(t/60),s=t%60;return n>0?`${n} sa ${s>0?s+" dk":""} (${t} dk)`:`${t} dk`}async function At(t="tv",n){const s=typeof t=="object"&&t!==null?t.type||"tv":t||"tv",e=typeof t=="object"&&t!==null?t.id:n;let f=s==="series"||s==="tv"||s==="anime"?"tv":s==="movie"?"movie":"tv",a=await Ie(f,e);if(a||(f=f==="tv"?"movie":"tv",a=await Ie(f,e)),!a)return{html:'<div class="container" style="padding: 10rem 0; text-align: center;"><h2>İçerik bulunamadı.</h2></div>',init:()=>{}};const m=!!(a.seasons&&a.seasons.length>0)||f==="tv",l=m?"tv":"movie",T=it(a)||s==="anime"||f==="anime"||st(e);T&&nt(e);const y=a.title||a.name||"Detay",E=a.original_title||a.original_name||"",O=ne(a.backdrop_path,re.BACKDROP_ORIGINAL);ne(a.poster_path,re.POSTER_MEDIUM);const H=a.vote_average?a.vote_average.toFixed(1):"8.5",C=(a.first_air_date||a.release_date||"").substring(0,4),F=a.overview&&a.overview.trim().length>15?a.overview:rt(a,l),J=a.genres||[],g=a.runtime?a.runtime*60:6600,r=lt(e),v=ot(e),b=l==="tv"?we(e):null,S=l==="movie"?ae(e,1,1):null,x=l==="movie"?He(e,1,1):!1,u=l==="tv"?ke(e,a.seasons||[]):!1,h=l==="movie"?x:u;let L=l==="movie"?"Filmi İzle":"1. Sezon 1. Bölümü İzle";if(l==="tv"&&b){const i=se(b.currentTime);L=`Devam Et <span class="play-btn-subinfo">S${b.season} B${b.episode}${i?" • "+i:""}</span>`}else l==="movie"&&S&&S.currentTime>0&&(L=`Devam Et <span class="play-btn-subinfo">${se(S.currentTime)}</span>`);const N=a.credits?.crew?a.credits.crew.filter(i=>i.job==="Director").map(i=>i.name):[],d=a.created_by?a.created_by.map(i=>i.name):[],_=N.length>0?N.slice(0,2).join(", "):d.length>0?d.slice(0,2).join(", "):"",k=(parseFloat(H)/2).toFixed(1),D=Math.floor(k),B=k%1>=.4,q="★".repeat(Math.min(5,D))+(B&&D<5?"½":""),z=a.credits&&a.credits.cast?a.credits.cast.slice(0,24):[];let Y=null,Z=!1;l==="tv"&&a.seasons&&(Y=await ut({tvId:e,seriesTitle:y,originalTitle:E,seriesOverview:F,seasons:a.seasons,posterPath:a.poster_path,backdropPath:a.backdrop_path,isAnime:T,spoilerFree:Z}));const A=a.recommendations?a.recommendations.results.slice(0,6):[],j=l==="movie"?x?"Film İzlendi":"İzlendi Olarak İşaretle":u?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle",ie=a.runtime?`
    <span>${Ye(a.runtime)}</span>
  `:"",Q=T?m?"ANİME DİZİSİ":"ANİME FİLMİ":l==="tv"?"DİZİ":"FİLM",_e=(a.videos?.results||[]).filter(i=>i.site==="YouTube");_e.sort((i,P)=>{const V={Trailer:1,Teaser:2,Clip:3,"Behind the Scenes":4};return(V[i.type]||9)-(V[P.type]||9)});const ye=_e.filter((i,P,V)=>i.key&&V.findIndex(U=>U.key===i.key)===P).slice(0,12),ze=[{label:"Resmi fragman ara",query:`${E||y} official trailer`},{label:"Türkçe fragman ara",query:`${y} Türkçe fragman`},{label:"Tanıtım ve teaser ara",query:`${E||y} official teaser`},{label:"Klipleri ara",query:`${E||y} official clip`}].slice(0,Math.max(0,4-ye.length));return{html:`
    <div class="detail-view">
      <div class="detail-hero-banner">
        <div class="detail-backdrop-img" style="background-image: url('${O}')"></div>
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
              <h1 class="detail-heading-title">${y}</h1>

              <!-- Editorial Subtitle (Original Title & Creator / Director) -->
              <div class="detail-editorial-sub">
                ${E&&E!==y?`<span class="detail-orig-name">${E}</span>`:""}
                ${_?`
                  <span class="detail-director-pill">
                    <strong style="color: var(--primary);">${l==="tv"?"YARATICI":"YÖNETMEN"}:</strong> ${_}
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
                  <i data-lucide="star" style="width:14px; height:14px; fill: #dfff76; color: #dfff76;"></i> ${H}
                </span>
                <span>${C}</span>
                ${J.length>0?`<span>${J.slice(0,3).map(i=>i.name).join(" • ")}</span>`:""}
                ${ie}
                ${a.number_of_seasons?`<span>${a.number_of_seasons} Sezon</span>`:""}
                ${a.number_of_episodes?`<span>${a.number_of_episodes} Bölüm</span>`:""}
                <span class="detail-meta-type">${Q}</span>
              </div>

              <!-- Hero Actions (Play + Secondary Options) -->
              <div class="detail-action-deck">
                <div class="detail-action-main-row">
                  ${l==="movie"?`
                    <button class="btn-play-primary" id="btn-play-movie">
                      <i data-lucide="play" style="fill: currentColor; width: 20px; height: 20px;"></i>
                      <span>${L}</span>
                    </button>
                  `:`
                    <button class="btn-play-primary" id="btn-resume-series">
                      <i data-lucide="play" style="fill: currentColor; width: 20px; height: 20px;"></i>
                      <span>${L}</span>
                    </button>
                  `}

                  <button class="btn-action-tile ${v?"active-watch":""}" id="btn-toggle-watchlist">
                    <i data-lucide="${v?"check":"plus"}"></i>
                    <span>${v?"Listemde":"Listem"}</span>
                  </button>

                  <button class="btn-action-tile ${r?"active-fav":""}" id="btn-toggle-fav">
                    <i data-lucide="heart" style="${r?"fill: var(--primary); color: var(--primary)":""}"></i>
                    <span>${r?"Favorilerimde":"Favori"}</span>
                  </button>

                  <button class="btn-action-tile ${h?"active-watched":""}" id="btn-toggle-watched-detail">
                    <i data-lucide="${h?"check-circle-2":"check"}"></i>
                    <span>${j}</span>
                  </button>

                  <button class="btn-action-tile" id="btn-mark-halfway-detail" title="Kaldığım Yer">
                    <i data-lucide="clock" style="color: #dfff76;"></i>
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

              ${ye.length>0||ze.length>0?`
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
            ${l==="tv"&&Y?`
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

            ${A.length>0?`
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

          ${l==="tv"&&Y?`
            <!-- Tab Pane: Episodes (Image 3) -->
            <div class="netflix-tab-pane active" id="tab-pane-episodes">
              ${Y.html}
            </div>
          `:""}

          <!-- Tab Pane: Dedicated Cast Grid (Image 4) -->
          <div class="netflix-tab-pane ${l==="movie"?"active":""}" id="tab-pane-cast">
            <div class="netflix-pane-header">
              <div class="netflix-pane-title-group">
                <h2 class="netflix-pane-title">
                  <i data-lucide="users" style="color: #dfff76; width: 20px; height: 20px;"></i>
                  <span>Oyuncu Kadrosu & Karakterler</span>
                </h2>
                <p class="netflix-pane-subtitle">Karakteri canlandıran oyuncular ve filmografileri</p>
              </div>
              <span class="netflix-pane-count-pill">${z.length} Oyuncu</span>
            </div>

            ${z.length>0?`
              <div class="netflix-cast-grid">
                ${z.map((i,P)=>{const V=i.profile_path?ne(i.profile_path,re.POSTER_MEDIUM):me,U=i.character?i.character.split("/")[0].trim():"",G=(i.popularity?Math.min(9.9,Math.max(6.5,i.popularity/3.5+6)):8.5).toFixed(1);return`
                    <div class="netflix-cast-card ${P>=12?"cast-card-hidden":""}" data-person-id="${i.id}" data-person-name="${i.name}" title="${i.name}${U?" ("+U+")":""} • Filmografiyi Gör">
                      <div class="netflix-cast-photo-wrap">
                        <img src="${V}" alt="${i.name}" loading="lazy" onerror="this.onerror=null; this.src='${me}';" />
                        <div class="netflix-cast-card-hover">
                          <i data-lucide="sparkles" style="width:20px;height:20px;color:#fff;"></i>
                          <span>Filmografi</span>
                        </div>
                      </div>
                      <div class="netflix-cast-info">
                        <h4 class="netflix-cast-name">${i.name}</h4>
                        ${U?`<p class="netflix-cast-character">As ${U}</p>`:""}
                        <div class="netflix-cast-rating">
                          <i data-lucide="star" style="width:11px;height:11px;fill:#dfff76;stroke:#dfff76;"></i>
                          <span>${G} / 10</span>
                        </div>
                      </div>
                    </div>
                  `}).join("")}
              </div>

              ${z.length>12?`
                <div style="text-align: center; margin: 2.5rem 0 1rem;">
                  <button class="btn-netflix-show-more" id="btn-show-more-cast">
                    <span>Tüm Oyuncuları Göster (${z.length})</span>
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
                  ${E?`
                    <div class="spec-row">
                      <span class="spec-label">Orijinal Başlık</span>
                      <span class="spec-val">${E}</span>
                    </div>
                  `:""}
                  ${_?`
                    <div class="spec-row">
                      <span class="spec-label">${l==="tv"?"Yaratıcı":"Yönetmen"}</span>
                      <span class="spec-val">${_}</span>
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
                      <span class="spec-val">${Ye(a.runtime)}</span>
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
                    <span class="spec-val" style="color: #dfff76; font-weight: 750;">★ ${H} / 10</span>
                  </div>
                  <div class="spec-row">
                    <span class="spec-label">Letterboxd</span>
                    <span class="spec-val" style="color: #00e054; font-weight: 750;">${q} (${k})</span>
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
                  <i data-lucide="youtube" style="color: #dfff76; width: 20px; height: 20px;"></i>
                  <span>Resmi Fragmanlar & Klipler</span>
                </h2>
                <p class="netflix-pane-subtitle">Resmi Türkçe ve orijinal tanıtım fragmanları</p>
              </div>
            </div>

            <div class="netflix-trailers-showcase">
              ${ye.map((i,P)=>`
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
                      <h4 class="trailer-expanded-title">${i.name||`${y} Fragman`}</h4>
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

          ${A.length>0?`
            <!-- Tab Pane: More Like This (Image 3 / 4) -->
            <div class="netflix-tab-pane" id="tab-pane-recommendations">
              <div class="netflix-pane-header">
                <div class="netflix-pane-title-group">
                  <h2 class="netflix-pane-title">
                    <i data-lucide="thumbs-up" style="color: #dfff76; width: 20px; height: 20px;"></i>
                    <span>Benzer Önerilen Yapımlar</span>
                  </h2>
                  <p class="netflix-pane-subtitle">Bu yapımı seven izleyicilerin en çok beğendiği diğer içerikler</p>
                </div>
              </div>
              <div class="media-grid">
                ${A.map(i=>Le(i)).join("")}
              </div>
            </div>
          `:""}

        </div>
      </div>
    </div>
  `,init:i=>{if(!i)return;let P=_t(l,e);const V=i.querySelector("#btn-detail-back");V&&V.addEventListener("click",o=>{o.preventDefault(),window.history.length>1?window.history.back():window.location.hash="#home"}),Y&&Y.init(i);const U=i.querySelector("#detail-spoiler-free-toggle");U&&(U.checked=Z,U.addEventListener("change",()=>{Z=U.checked,Y?.setSpoilerSafe(Z),W(Z?"Spoilersız keşif açıldı. Sonraki bölüm detayları gizlendi.":"Spoilersız keşif kapatıldı.","info")}));const G=i.querySelector("#btn-play-movie"),be=async()=>{if(!G||G.disabled)return;G.disabled=!0;const o=G.innerHTML;G.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',$();try{const p=ae(e,1,1);await $e({type:T?"anime":"movie",isAnime:T,tmdbId:e,title:y,seriesTitle:y,originalTitle:E,posterPath:a.poster_path,backdropPath:a.backdrop_path,duration:g,currentTime:p?p.currentTime:0,roomSync:P?{roomCode:P.roomCode,mediaId:e,type:l,season:1,episode:1,initialSync:P.initialSync||null}:null})}catch{W("Film açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{G.disabled=!1,G.innerHTML=o,$()}};G&&G.addEventListener("click",be);const X=i.querySelector("#btn-resume-series"),Me=async()=>{if(!X||X.disabled)return;X.disabled=!0;const o=X.innerHTML;X.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',$();try{const p=P;P=null;const c=we(e),w=p?.season||(c?c.season:1),M=p?.episode||(c?c.episode:1),R=p?0:c?c.currentTime:0;await $e({type:T?"anime":"tv",isAnime:T,tmdbId:e,title:`${y} - S${w}E${M}`,seriesTitle:y,originalTitle:E,season:w,episode:M,posterPath:a.poster_path,backdropPath:a.backdrop_path,currentTime:R,seasonsList:a.seasons||[],roomSync:p?{roomCode:p.roomCode,mediaId:e,type:l,season:w,episode:M,initialSync:p.initialSync||null}:null})}catch{W("İçerik açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{X.disabled=!1,X.innerHTML=o,$()}};X&&X.addEventListener("click",o=>{o.preventDefault(),Me()}),P&&window.setTimeout(()=>{l==="movie"?be():Me()},0);const Be=i.querySelector("#btn-watch-trailer");Be&&Be.addEventListener("click",o=>{o.preventDefault(),i.querySelectorAll(".netflix-tab-btn").forEach(p=>p.classList.toggle("active",p.dataset.tab==="trailers")),i.querySelectorAll(".netflix-tab-pane").forEach(p=>p.classList.toggle("active",p.id==="tab-pane-trailers")),$(i.querySelector("#tab-pane-trailers")),i.querySelector("#tab-pane-trailers")?.scrollIntoView({behavior:"smooth",block:"start"})}),i.querySelectorAll(".hero-trailer-expand-card").forEach(o=>{o.addEventListener("click",p=>{if(p.target.closest(".trailer-expanded-close")){p.stopPropagation(),o.classList.remove("is-expanded");const M=o.querySelector(".trailer-expanded-player");M&&(M.innerHTML="");return}if(o.classList.contains("is-expanded"))return;i.querySelectorAll(".hero-trailer-expand-card.is-expanded").forEach(M=>{M.classList.remove("is-expanded");const R=M.querySelector(".trailer-expanded-player");R&&(R.innerHTML="")});const c=o.getAttribute("data-video-key");if(!c)return;o.classList.add("is-expanded");const w=o.querySelector(".trailer-expanded-player");w&&(w.innerHTML=`
              <iframe 
                src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(c)}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&playsinline=1"
                frameborder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowfullscreen
                class="trailer-inline-iframe"
                title="${y} Fragman">
              </iframe>
            `),$()})});const oe=i.querySelector("#btn-toggle-fav");oe&&oe.addEventListener("click",()=>{const o=ct({...a,type:T?"anime":l,isAnime:T,media_type:l});W(o?"Favorilere eklendi!":"Favorilerden çıkarıldı.",o?"success":"info");const p=oe.querySelector("i"),c=oe.querySelector("span");p&&c&&(p.style.fill=o?"var(--primary)":"none",p.style.color=o?"var(--primary)":"currentColor",c.textContent=o?"Favorilerimde":"Favorilere Ekle")});const ce=i.querySelector("#btn-toggle-watchlist");ce&&ce.addEventListener("click",()=>{const o=dt({...a,type:T?"anime":l,isAnime:T,media_type:l});W(o?"İzleme listesine eklendi!":"İzleme listesinden çıkarıldı.",o?"success":"info");const p=ce.querySelector("i"),c=ce.querySelector("span");p&&c&&(p.setAttribute("data-lucide",o?"check":"plus"),$(),c.textContent=o?"Listemde":"İzleme Listeme Ekle")});const K=i.querySelector("#btn-toggle-watched-detail");K&&K.addEventListener("click",o=>{if(o.preventDefault(),l==="movie"){const c=We(e,1,1,{title:y,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:"movie",duration:g}).completed;W(c?"✓ Film izlendi olarak işaretlendi!":"Film izlendi işareti kaldırıldı.",c?"success":"info"),c?K.classList.add("btn-watched-active"):K.classList.remove("btn-watched-active"),K.innerHTML=`
              <i data-lucide="${c?"check-circle-2":"check"}"></i>
              <span>${c?"Film İzlendi":"İzlendi Olarak İşaretle"}</span>
            `,$()}else{const c=!ke(e,a.seasons||[]);pt(e,a.seasons||[],c,{title:y,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:T?"anime":"tv",isAnime:T}),W(c?"✓ Dizinin tüm bölümleri izlendi olarak işaretlendi!":"Tüm bölümler izlenmedi yapıldı.",c?"success":"info"),c?K.classList.add("btn-watched-active"):K.classList.remove("btn-watched-active"),K.innerHTML=`
              <i data-lucide="${c?"check-circle-2":"check"}"></i>
              <span>${c?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle"}</span>
            `,$(),i.querySelectorAll(".episode-card").forEach(M=>{const R=M.querySelector(".badge-watched-status"),I=M.querySelector(".btn-mark-ep-watched");R&&(R.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',R.style.background="var(--accent-green)",R.style.color="#fff",R.style.display=c?"inline-flex":"none"),I&&(c?(I.classList.add("watched"),I.style.background="#10b981",I.style.borderColor="#10b981"):(I.classList.remove("watched"),I.style.background="rgba(0,0,0,0.65)",I.style.borderColor="rgba(255,255,255,0.3)"))});const w=i.querySelector("#btn-mark-season-all");if(w){const M=w.querySelector("span"),R=w.querySelector("i");M&&(M.textContent=c?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),R&&R.setAttribute("data-lucide",c?"check-circle-2":"check-check"),c?(w.style.background="rgba(16, 185, 129, 0.2)",w.style.borderColor="#10b981",w.style.color="#10b981"):(w.style.background="",w.style.borderColor="",w.style.color="")}$()}});const Ve=o=>{if(o&&o.detail&&o.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const p=l==="movie"?He(e,1,1):!1,c=l==="tv"?ke(e,a.seasons||[]):!1,w=l==="movie"?p:c;if(K){w?K.classList.add("btn-watched-active"):K.classList.remove("btn-watched-active");const I=l==="movie"?w?"Film İzlendi":"İzlendi Olarak İşaretle":w?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle";K.innerHTML=`
            <i data-lucide="${w?"check-circle-2":"check"}"></i>
            <span>${I}</span>
          `}const M=i.querySelector("#btn-play-movie");if(M&&l==="movie"){const I=ae(e,1,1);if(I&&I.currentTime>0&&!I.completed){const pe=se(I.currentTime);M.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">${pe}</span></span>`}}const R=i.querySelector("#btn-resume-series");if(R&&l==="tv"){const I=we(e);if(I){const pe=se(I.currentTime);R.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">S${I.season} B${I.episode}${pe?" • "+pe:""}</span></span>`}}$()};window.addEventListener("sineflix_data_changed",Ve);const Ae=i.querySelector("#btn-mark-halfway-detail");Ae&&Ae.addEventListener("click",o=>{if(o.preventDefault(),l==="movie"){const p=Math.round(g*.5),c=se(p);Se(e,1,1,p,{title:y,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:T?"anime":"movie",isAnime:T,duration:g}),W(`⏳ Film ${c} dakikasında yarıda bırakıldı olarak işaretlendi!`,"info");const w=i.querySelector("#btn-play-movie span");w&&(w.textContent=`Kaldığın Yerden Devam Et (${c})`)}else{const p=b?b.season:1,c=b?b.episode:1;Se(e,p,c,1200,{title:y,posterPath:a.poster_path,backdropPath:a.backdrop_path,type:T?"anime":"tv",isAnime:T,duration:3e3}),W(`⏳ S${p} B${c} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info");const w=i.querySelector("#btn-resume-series span");w&&(w.textContent=`Kaldığın Yerden Devam Et (S${p} B${c} • 20:00)`)}});const de=i.querySelector("#btn-expand-storyline"),ve=i.querySelector("#detail-storyline-text");de&&ve&&de.addEventListener("click",()=>{const o=!ve.classList.contains("truncated");ve.classList.toggle("truncated");const p=de.querySelector("span"),c=de.querySelector("i");p&&(p.textContent=o?"Devamını Oku":"Daralt"),c&&(c.style.transform=o?"rotate(0deg)":"rotate(180deg)")});const Ce=i.querySelectorAll(".netflix-tab-btn"),Xe=i.querySelectorAll(".netflix-tab-pane");Ce.forEach(o=>{o.addEventListener("click",p=>{p.preventDefault();const c=o.getAttribute("data-tab");c!=="trailers"&&i.querySelectorAll("#tab-pane-trailers .hero-trailer-expand-card.is-expanded").forEach(M=>{M.classList.remove("is-expanded"),M.querySelector(".trailer-expanded-player").innerHTML=""}),Ce.forEach(M=>M.classList.remove("active")),Xe.forEach(M=>M.classList.remove("active")),o.classList.add("active");const w=i.querySelector(`#tab-pane-${c}`);w&&(w.classList.add("active"),$(w))})}),i.querySelectorAll(".netflix-cast-card").forEach(o=>{o.addEventListener("click",p=>{p.preventDefault();const c=o.getAttribute("data-person-id"),w=o.getAttribute("data-person-name");c&&mt(c,w)})});const ge=i.querySelector("#btn-show-more-cast");ge&&ge.addEventListener("click",o=>{o.preventDefault(),i.querySelectorAll(".netflix-cast-card.cast-card-hidden").forEach(c=>c.classList.remove("cast-card-hidden")),ge.style.display="none",$()});const De=i.querySelector("#btn-pane-play-trailer");De&&De.addEventListener("click",()=>{const o=i.querySelector("#btn-watch-trailer");o&&o.click()});const ee=i.querySelector("#detail-next-episode-badge");ee&&l==="tv"&&(async()=>{try{const o=await $t({imdbId:a.external_ids?.imdb_id,title:E||y,year:C});if(!o?.nextEpisode||!ee.isConnected)return;const p=o.nextLabel||"",c=o.nextAirdateLabel||"";if(!p&&!c||c==="Yayınlandı")return;const w=[p?`Yeni bölüm ${p}`:"Yeni bölüm",c].filter(Boolean).join(" • ");ee.innerHTML=`<i data-lucide="calendar-clock" style="width:13px; height:13px"></i><span>${w}</span>`,ee.title=`Sonraki bölüm: ${p||"-"}${o.nextEpisode.name?" — "+o.nextEpisode.name:""}${c?" • "+c:""} (Kaynak: TVmaze)`,ee.style.display="inline-flex",$(ee)}catch{}})();const qe=i.querySelector(".media-grid");qe&&Oe(qe)}}}export{At as renderDetailView};

import{i as be,m as Ne,s as Y,r as k,f as We,g as le,T as re,a as ae,S as Ye,t as Ie,b as ke,c as Oe,o as we,d as je,e as fe,h as $e,j as Fe,k as qe,l as Ke,n as Ue,p as Ge,q as Ze,u as Ve,v as Xe,w as ge,x as Ce,y as xe,z as se,A as Je,B as Qe,C as et}from"./index-BX5i0L1a.js";import{getNextEpisodeInfo as tt}from"./tvmazeService-npKHscJR.js";import"./vendor-capacitor-DGWR5Llo.js";async function at({tvId:c,seriesTitle:L,originalTitle:m="",seriesOverview:i="",seasons:q=[],posterPath:e="",backdropPath:$="",isAnime:o=!1,spoilerFree:z=!1}){const h=q.filter(y=>y.season_number>0);h.length===0&&q.length>0&&h.push(q[0]);const S=h.length>0?h[0].season_number:1,O=h.length>0&&h[0].episode_count||10,I=be(c,S,O);let C=!!z,F=null;return{html:`
    <div class="season-selector-wrapper">
      <div class="season-selector-header">
        <div style="display: flex; align-items: center; gap: 0.65rem;">
          <span class="rail-icon-pill" style="--rail-color: #dfff76; width: 28px; height: 28px;">
            <i data-lucide="layers" style="width: 15px; height: 15px;"></i>
          </span>
          <h2 class="season-selector-title" style="margin: 0;">Sezonlar ve Bölümler</h2>
        </div>

        <!-- Bulk Mark Current Season Watched Button -->
        <button id="btn-mark-season-all" class="btn-secondary" style="padding: 0.45rem 1.1rem; font-size: 0.82rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.45rem; cursor: pointer; ${I?"background: rgba(16, 185, 129, 0.2); border-color: #10b981; color: #10b981;":""}">
          <i data-lucide="${I?"check-circle-2":"check-check"}" style="width: 14px; height: 14px;"></i>
          <span>${I?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"}</span>
        </button>
      </div>

      <!-- Luxury Segmented Season Pills Track with PC Arrows & Scroll Support -->
      <div class="season-tabs-wrapper" style="position: relative; display: flex; align-items: center; margin-bottom: 1.5rem; width: 100%;">
        <button class="season-nav-arrow left" id="btn-season-prev" title="Önceki Sezonlar" aria-label="Geri">
          <i data-lucide="chevron-left" style="width:16px;height:16px;"></i>
        </button>
        <div class="season-pills-track" id="season-tabs-bar">
          ${h.map(y=>`
            <button class="season-pill ${y.season_number===S?"active":""}" data-season="${y.season_number}" data-ep-count="${y.episode_count||10}">
              ${y.name||`${y.season_number}. Sezon`} <span style="opacity: 0.75; font-size: 0.72rem; margin-left: 0.2rem;">(${y.episode_count} Bölüm)</span>
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
  `,init:y=>{if(!y)return;let a=S,f=O;const u=()=>{const r=y.querySelector("#btn-mark-season-all");if(!r)return;const E=be(c,a,f),g=r.querySelector("span"),A=r.querySelector("i");g&&(g.textContent=E?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),A&&A.setAttribute("data-lucide",E?"check-circle-2":"check-check"),E?(r.style.background="rgba(16, 185, 129, 0.2)",r.style.borderColor="#10b981",r.style.color="#10b981"):(r.style.background="",r.style.borderColor="",r.style.color=""),k()};pe(c,L,i,a,y,e,$,m,h,u,o,C);const x=r=>{if(r&&r.detail&&r.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const E=y.querySelector("#episode-grid-container");E&&(E.querySelectorAll(".episode-card").forEach(g=>{const A=parseInt(g.getAttribute("data-season"),10),B=parseInt(g.getAttribute("data-episode"),10),D=ae(c,A,B),T=D?D.progressPercent:0,W=D?D.completed||T>=90:!1,Z=D&&!W&&D.currentTime>0,M=g.querySelector(".badge-watched-status"),K=g.querySelector(".btn-mark-ep-watched"),ie=g.querySelector(".card-progress-fill"),Q=g.querySelector(".btn-mark-ep-halfway");M&&(W?(M.innerHTML='<i data-lucide="check" style="width:10px; height:10px"></i> İZLENDİ',M.style.background="var(--accent-green)",M.style.color="#fff",M.style.fontSize="0.68rem",M.style.fontWeight="800",M.style.padding="0.2rem 0.45rem",M.style.borderRadius="4px",M.style.whiteSpace="nowrap",M.style.display="inline-flex"):Z?(M.innerHTML='<i data-lucide="clock" style="width:10px; height:10px"></i> YARIDA',M.style.background="#dfff76",M.style.color="#000",M.style.fontSize="0.68rem",M.style.fontWeight="850",M.style.padding="0.2rem 0.45rem",M.style.borderRadius="4px",M.style.whiteSpace="nowrap",M.style.display="inline-flex"):M.style.display="none"),K&&(W?(K.classList.add("watched"),K.style.background="#10b981",K.style.borderColor="#10b981",K.title="İzlendi işaretini kaldır"):(K.classList.remove("watched"),K.style.background="rgba(0,0,0,0.65)",K.style.borderColor="rgba(255,255,255,0.3)",K.title="İzlendi olarak işaretle")),Q&&(Q.classList.toggle("is-halfway",!!Z),Q.style.background=Z?"#dfff76":"rgba(0,0,0,0.65)",Q.style.borderColor=Z?"#dfff76":"rgba(255,255,255,0.3)"),ie&&(ie.style.width=`${T}%`,ie.style.background=W?"var(--accent-green)":"#dfff76")}),k()),u()};window.addEventListener("sineflix_data_changed",x),y.querySelectorAll(".season-pill").forEach(r=>{r.addEventListener("click",E=>{E.preventDefault(),y.querySelectorAll(".season-pill").forEach(g=>g.classList.remove("active")),r.classList.add("active"),r.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"}),a=parseInt(r.getAttribute("data-season"),10),f=parseInt(r.getAttribute("data-ep-count"),10)||10,pe(c,L,i,a,y,e,$,m,h,u,o,C),u()})});const v=y.querySelector(".season-pill.active");v&&setTimeout(()=>{v.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})},120);const d=y.querySelector("#season-tabs-bar"),p=y.querySelector("#btn-season-prev"),w=y.querySelector("#btn-season-next");if(d){p?.addEventListener("click",B=>{B.preventDefault(),d.scrollBy({left:-260,behavior:"smooth"})}),w?.addEventListener("click",B=>{B.preventDefault(),d.scrollBy({left:260,behavior:"smooth"})}),d.addEventListener("wheel",B=>{B.deltaY!==0&&d.scrollWidth>d.clientWidth&&(B.preventDefault(),d.scrollLeft+=B.deltaY)},{passive:!1});let r=!1,E=0,g=0,A=!1;d.addEventListener("mousedown",B=>{B.button===0&&(r=!0,A=!1,d.classList.add("dragging"),E=B.pageX-d.offsetLeft,g=d.scrollLeft)}),window.addEventListener("mousemove",B=>{if(!r)return;const T=(B.pageX-d.offsetLeft-E)*1.5;Math.abs(T)>4&&(A=!0),d.scrollLeft=g-T}),window.addEventListener("mouseup",()=>{r&&(r=!1,d.classList.remove("dragging"),setTimeout(()=>{A=!1},50))}),d.addEventListener("click",B=>{A&&(B.preventDefault(),B.stopPropagation())},!0)}const R=y.querySelector("#btn-mark-season-all");R&&R.addEventListener("click",r=>{r.preventDefault();const g=!be(c,a,f);Ne(c,a,f,g,{title:L,posterPath:e,backdropPath:$,type:o?"anime":"tv",isAnime:o}),Y(g?`${a}. Sezonun tüm bölümleri izlendi!`:`${a}. Sezon izlenmedi olarak işaretlendi.`,g?"success":"info");const A=y.querySelector("#episode-grid-container");A&&(A.querySelectorAll(".episode-card").forEach(B=>{const D=B.querySelector(".badge-watched-status"),T=B.querySelector(".btn-mark-ep-watched");D&&(D.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',D.style.background="var(--accent-green)",D.style.color="#fff",D.style.display=g?"inline-flex":"none"),T&&(g?(T.classList.add("watched"),T.style.background="#10b981",T.style.borderColor="#10b981",T.title="İzlendi işaretini kaldır"):(T.classList.remove("watched"),T.style.background="rgba(0,0,0,0.65)",T.style.borderColor="rgba(255,255,255,0.3)",T.title="İzlendi olarak işaretle"))}),k()),u()}),F=r=>{C=!!r,pe(c,L,i,a,y,e,$,m,h,u,o,C)}},setSpoilerSafe(y){C=!!y,F?.(C)}}}function it(c){const L=Oe().filter(m=>String(m?.id)===String(c)&&(Number(m.currentTime)>0||m.completed||Number(m.progressPercent)>0));return L.length?L.reduce((m,i)=>{const q={season:Math.max(1,Number(i.season)||1),episode:Math.max(1,Number(i.episode)||1)};return q.season>m.season||q.season===m.season&&q.episode>m.episode?q:m},{season:1,episode:1}):{season:1,episode:1}}function Ae(c){return String(c||"").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}async function pe(c,L,m,i,q,e="",$="",o="",z=[],h=null,S=!1,O=!1){const I=q.querySelector("#episode-grid-container");if(!I)return;I.innerHTML=`<div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;"><i data-lucide="loader-2" class="spin-loader" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></i><div>${i}. Sezon bölümleri getiriliyor...</div></div>`,k();let C=null;try{C=await We(c,i)}catch{}if(!C||!C.episodes||C.episodes.length===0){I.innerHTML=`
      <div style="padding: 3rem; text-align: center; color: var(--text-muted); grid-column: 1/-1;">
        <p style="margin-bottom: 0.75rem;">Bu sezon için bölüm verisi getirilemedi.</p>
        <button id="btn-retry-season-episodes" class="btn-secondary" style="padding: 0.45rem 1rem; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 0.35rem; cursor: pointer;">
          <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
          <span>Tekrar Dene</span>
        </button>
      </div>
    `,k(),q.querySelector("#btn-retry-season-episodes")?.addEventListener("click",()=>{pe(c,L,m,i,q,e,$,o,z,h,S,O)});return}const F=O?it(c):null,J=O?C.episodes.filter(a=>i<F.season||i===F.season&&Number(a.episode_number)<=F.episode+1):C.episodes;if(O&&J.length===0){I.innerHTML='<div class="spoiler-safe-locked"><i data-lucide="shield-check"></i><strong>Bu sezon spoiler korumasında</strong><span>Önceki sezona ilerledikçe bölüm detayları burada açılır.</span></div>',k();return}const y=O?`<div class="spoiler-safe-notice"><i data-lucide="shield-check"></i><span>Spoilersız keşif açık · S${F.season} B${F.episode+1} sonrasının detayları gizli.</span></div>`:"";I.innerHTML=y+J.map(a=>{const f=a.episode_number;let u=(a.name||"").trim();u=u.replace(new RegExp(`^(?:${f}\\s*[\\.\\:\\-]\\s*)+(?:Bölüm\\s*[\\:\\-]\\s*)?`,"i"),""),u=u.replace(new RegExp(`^Bölüm\\s*${f}\\s*[\\:\\-]\\s*`,"i"),""),u=u.trim();const x=u?`${f}. Bölüm: ${u}`:`${f}. Bölüm`;let v=a.overview?a.overview.trim():"";(!v||v.length<5)&&(m&&m.length>10?v=`${f}. Bölüm: ${m}`:v=`${L} ${i}. Sezon ${f}. Bölüm Türkçe Dublaj ve Altyazılı yüksek kalitede kesintisiz HD izle.`);const d=v.length>90,p=le(a.still_path,re.STILL_MEDIUM),w=a.air_date||"",R=a.runtime?`${a.runtime} dk`:"",r=ae(c,i,f),E=r?r.progressPercent:0,g=r?r.completed||E>=90:!1,A=r&&!g&&r.currentTime>0,B=E>0?`
      <div class="card-progress-bar">
        <div class="card-progress-fill" style="width: ${E}%; background: ${g?"var(--accent-green)":"#dfff76"};"></div>
      </div>
    `:"";let D="";g?D=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.4rem; left: 0.4rem; background: var(--accent-green); color: #fff; z-index: 4; font-size: 0.68rem; font-weight: 800; padding: 0.2rem 0.45rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; line-height: 1; white-space: nowrap;">
          <i data-lucide="check" style="width:10px; height:10px"></i> İZLENDİ
        </span>
      `:A?D=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.4rem; left: 0.4rem; background: #dfff76; color: #000; font-weight: 850; z-index: 4; font-size: 0.68rem; padding: 0.2rem 0.45rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; line-height: 1; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.5);">
          <i data-lucide="clock" style="width:10px; height:10px"></i> YARIDA
        </span>
      `:D=`
        <span class="badge badge-primary badge-watched-status" style="position: absolute; top: 0.4rem; left: 0.4rem; background: var(--accent-green); color: #fff; display: none; z-index: 4; font-size: 0.68rem; font-weight: 800; padding: 0.2rem 0.45rem; border-radius: 4px; line-height: 1; white-space: nowrap;">
          <i data-lucide="check" style="width:10px; height:10px"></i> İZLENDİ
        </span>
      `;const T=Ae(x),W=Ae(v);return`
      <div class="episode-card" data-tv-id="${c}" data-season="${i}" data-episode="${f}" data-title="${T}">
        <div class="episode-thumb-wrap">
          <img src="${p}" alt="${T}" loading="lazy" onerror="this.onerror=null; this.src='${Ye}';" />
          <span class="episode-number-chip">${i}x${f<10?"0"+f:f}</span>
          ${D}
          
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
            <span class="episode-title" title="${T}">${x}</span>
            <span class="episode-duration">${R||w}</span>
          </div>
          
          <div class="episode-overview-container">
            <div class="episode-overview ${d?"truncated":""}" data-full="${W}">
              ${v}
            </div>
            ${d?`
              <button class="btn-toggle-overview" style="color: var(--primary); font-weight: 700; font-size: 0.78rem; margin-top: 0.25rem; display: inline-flex; align-items: center; gap: 0.2rem; cursor: pointer; background: none; border: none; padding: 0;">
                <span>Devamını Oku</span>
                <i data-lucide="chevron-down" style="width: 12px; height: 12px;"></i>
              </button>
            `:""}
          </div>

          <div class="episode-footer" style="font-size: 0.76rem; color: var(--text-muted); margin-top: auto; padding-top: 0.45rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06);">
            <span class="episode-airdate">${w}</span>
          <div class="episode-status-actions">
            <button class="btn-mark-ep-halfway ${A?"is-halfway":""}" data-tv-id="${c}" data-season="${i}" data-episode="${f}" title="Yarıda Bırakıldı (20. dk)" aria-label="Bu bölümü yarıda bırakıldı olarak işaretle" style="width: 28px; height: 28px; border-radius: 50%; background: ${A?"#dfff76":"rgba(0,0,0,0.65)"}; border: 1px solid ${A?"#dfff76":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
              <i data-lucide="clock" style="width: 13px; height: 13px;"></i>
            </button>

            <button class="btn-mark-ep-watched ${g?"watched":""}" data-tv-id="${c}" data-season="${i}" data-episode="${f}" title="${g?"İzlendi işaretini kaldır":"İzlendi olarak işaretle"}" aria-label="Bölümün izlendi durumunu değiştir" style="width: 28px; height: 28px; border-radius: 50%; background: ${g?"#10b981":"rgba(0,0,0,0.65)"}; border: 1px solid ${g?"#10b981":"rgba(255,255,255,0.3)"}; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
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
    `}).join(""),k(),q.querySelectorAll(".btn-toggle-overview").forEach(a=>{a.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation();const u=a.closest(".episode-overview-container"),x=u?u.querySelector(".episode-overview"):null;if(!x)return;const v=a.querySelector("span"),d=a.querySelector("i");x.classList.contains("truncated")?(x.classList.remove("truncated"),v&&(v.textContent="Daralt"),d&&d.setAttribute("data-lucide","chevron-up")):(x.classList.add("truncated"),v&&(v.textContent="Devamını Oku"),d&&d.setAttribute("data-lucide","chevron-down")),k()})}),I.querySelectorAll(".btn-mark-ep-watched").forEach(a=>{a.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation();const u=parseInt(a.getAttribute("data-season"),10),x=parseInt(a.getAttribute("data-episode"),10),v=a.closest(".episode-card"),p=Ie(c,u,x,{title:L,posterPath:e,backdropPath:$,type:S?"anime":"tv",isAnime:S}).completed;if(Y(p?`S${u} B${x} izlendi olarak işaretlendi!`:`S${u} B${x} izlendi işareti kaldırıldı.`,p?"success":"info"),p?(a.classList.add("watched"),a.style.background="#10b981",a.style.borderColor="#10b981",a.title="İzlendi işaretini kaldır"):(a.classList.remove("watched"),a.style.background="rgba(0,0,0,0.65)",a.style.borderColor="rgba(255,255,255,0.3)",a.title="İzlendi olarak işaretle"),v){const w=v.querySelector(".badge-watched-status");w&&(w.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',w.style.background="var(--accent-green)",w.style.color="#fff",w.style.display=p?"inline-flex":"none")}typeof h=="function"&&h(),k()})}),I.querySelectorAll(".btn-mark-ep-halfway").forEach(a=>{a.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation();const u=parseInt(a.getAttribute("data-season"),10),x=parseInt(a.getAttribute("data-episode"),10),v=a.closest(".episode-card");if(ke(c,u,x,1200,{title:L,posterPath:e,backdropPath:$,type:S?"anime":"tv",isAnime:S,duration:2700}),a.classList.add("is-halfway"),a.style.background="#dfff76",a.style.borderColor="#dfff76",v){const d=v.querySelector(".badge-watched-status");d&&(d.innerHTML='<i data-lucide="clock" style="width:10px; height:10px"></i> YARIDA',d.style.background="#dfff76",d.style.color="#000",d.style.fontWeight="850",d.style.padding="0.2rem 0.45rem",d.style.borderRadius="4px",d.style.fontSize="0.68rem",d.style.whiteSpace="nowrap",d.style.display="inline-flex")}Y(`S${u} B${x} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info"),k()})}),I.querySelectorAll(".episode-card").forEach(a=>{let f=!1;const u=async x=>{if(x&&x.target&&(x.target.closest(".btn-mark-ep-watched")||x.target.closest(".btn-mark-ep-halfway")||x.target.closest(".btn-toggle-overview"))||(x&&(x.preventDefault(),x.stopPropagation()),f))return;f=!0;const v=parseInt(a.getAttribute("data-season"),10),d=parseInt(a.getAttribute("data-episode"),10),p=a.getAttribute("data-title")||`${d}. Bölüm`;a.classList.add("is-loading-episode");const w=a.querySelector(".btn-play-episode-trigger"),R=w?w.innerHTML:"";w&&(w.innerHTML='<span>Yükleniyor...</span><i data-lucide="loader-2" class="spin-loader" style="width: 12px; height: 12px;"></i>',k());const r=a.querySelector(".episode-play-overlay i");r&&(r.setAttribute("data-lucide","loader-2"),r.classList.add("spin-loader"),k());try{const E=ae(c,v,d),g=E?E.currentTime:0;await we({type:S?"anime":"tv",isAnime:S,tmdbId:c,title:`${L} - S${v}E${d}: ${p}`,seriesTitle:L,originalTitle:o||L,season:v,episode:d,posterPath:e,backdropPath:$,currentTime:g,seasonsList:z,maxEpisodes:C.episodes?C.episodes.length:0})}catch{Y("Bölüm açılırken bir sorun oluştu, lütfen tekrar deneyin.","error")}finally{f=!1,a.classList.remove("is-loading-episode"),w&&R&&(w.innerHTML=R),r&&(r.setAttribute("data-lucide","play"),r.classList.remove("spin-loader")),k()}};a.addEventListener("click",u)})}let ue=null;async function st(c,L="",m=""){te();const i=document.createElement("div");i.id="cast-explorer-modal-root",i.className="cast-explorer-backdrop",document.body.appendChild(i),ue=i,i.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>
      <div class="cast-explorer-loading">
        <div class="cast-explorer-spinner"></div>
        <span>${L||"Oyuncu"} bilgileri ve filmografisi yükleniyor...</span>
      </div>
    </div>
  `,k(i);const q=i.querySelector("#btn-close-cast-explorer");q&&(q.onclick=()=>te()),i.onclick=p=>{p.target===i&&te()};const e=p=>{p.key==="Escape"&&(te(),window.removeEventListener("keydown",e))};window.addEventListener("keydown",e);const $=await je(c);if(!$){i.innerHTML=`
      <div class="cast-explorer-dialog">
        <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
          <i data-lucide="x" style="width: 20px; height: 20px;"></i>
        </button>
        <div class="cast-explorer-loading">
          <i data-lucide="alert-circle" style="width: 36px; height: 36px; color: #ef4444;"></i>
          <span>Oyuncu bilgileri alınamadı.</span>
        </div>
      </div>
    `,k(i);return}const o=$.name||L,z=$.profile_path?le($.profile_path,re.POSTER_MEDIUM):m||fe,h=$.birthday?$.birthday.substring(0,4):"",S=$.place_of_birth||"",O=$.known_for_department==="Acting"?"Oyuncu":$.known_for_department==="Directing"?"Yönetmen":$.known_for_department||"Sanatçı",I=$.biography&&$.biography.trim().length>20?$.biography:`${o}, sinema ve televizyon dünyasında yer aldığı yapımlarla tanınan başarılı bir sanatçıdır.`,C=$.combined_credits?.cast||[],F=$.combined_credits?.crew||[],J=[...C,...F],y=new Set,a=[];for(const p of J){if(!p||!p.id)continue;const w=`${p.media_type||"movie"}_${p.id}`;y.has(w)||(y.add(w),p.poster_path&&a.push(p))}a.sort((p,w)=>(w.popularity||0)-(p.popularity||0));const f=a.filter(p=>p.media_type==="movie"||!p.media_type&&p.title).length,u=a.filter(p=>p.media_type==="tv"||!p.media_type&&p.name).length;i.innerHTML=`
    <div class="cast-explorer-dialog">
      <button class="cast-explorer-close-btn" id="btn-close-cast-explorer" title="Kapat">
        <i data-lucide="x" style="width: 20px; height: 20px;"></i>
      </button>

      <!-- Actor Hero Header -->
      <div class="cast-explorer-header">
        <div class="cast-explorer-avatar-box">
          <img src="${z}" alt="${o}" class="cast-explorer-avatar" onerror="this.onerror=null; this.src='${fe}';" />
        </div>
        <div class="cast-explorer-bio-box">
          <div class="cast-explorer-name-row">
            <h2>${o}</h2>
            <span class="cast-explorer-dept-tag">${O}</span>
          </div>
          <div class="cast-explorer-meta-row">
            ${h?`<span><i data-lucide="calendar" style="width:13px;height:13px;"></i> D: ${h}</span>`:""}
            ${S?`<span><i data-lucide="map-pin" style="width:13px;height:13px;"></i> ${S}</span>`:""}
            <span><i data-lucide="film" style="width:13px;height:13px;"></i> ${a.length} Yapım</span>
          </div>
          <p class="cast-explorer-bio-text">${I}</p>
        </div>
      </div>

      <!-- Filmography Tabs -->
      <div class="cast-explorer-tabs">
        <button class="cast-tab-btn active" data-filter="all">Tümü (${a.length})</button>
        <button class="cast-tab-btn" data-filter="movie">Filmler (${f})</button>
        <button class="cast-tab-btn" data-filter="tv">Diziler (${u})</button>
      </div>

      <!-- Media Cards Grid -->
      <div class="cast-explorer-grid" id="cast-explorer-grid">
        ${a.map(p=>$e(p)).join("")}
      </div>
    </div>
  `,k(i);const x=i.querySelector("#btn-close-cast-explorer");x&&(x.onclick=()=>te());const v=i.querySelector("#cast-explorer-grid");v&&(Fe(v),v.addEventListener("click",()=>{setTimeout(()=>te(),150)}));const d=i.querySelectorAll(".cast-tab-btn");d.forEach(p=>{p.onclick=()=>{d.forEach(r=>r.classList.remove("active")),p.classList.add("active");const w=p.getAttribute("data-filter");let R=a;w==="movie"?R=a.filter(r=>r.media_type==="movie"||!r.media_type&&r.title):w==="tv"&&(R=a.filter(r=>r.media_type==="tv"||!r.media_type&&r.name)),v&&(v.innerHTML=R.length>0?R.map(r=>$e(r)).join(""):'<div class="cast-empty-state">Bu kategoride yapım bulunamadı.</div>',k(v))}})}function te(){if(ue){try{ue.remove()}catch{}ue=null}}const De="cinepulse.decision-room.autoplay";function lt(c,L){try{const m=JSON.parse(sessionStorage.getItem(De)||"null");return sessionStorage.removeItem(De),m&&String(m.id)===String(L)&&m.type===c&&Date.now()-Number(m.createdAt||0)<15e3?m:null}catch{return null}}function He(c){if(!c||c<=0)return"";const L=Math.floor(c/60),m=c%60;return L>0?`${L} sa ${m>0?m+" dk":""} (${c} dk)`:`${c} dk`}async function ct(c="tv",L){const m=typeof c=="object"&&c!==null?c.type||"tv":c||"tv",i=typeof c=="object"&&c!==null?c.id:L;let q=m==="series"||m==="tv"||m==="anime"?"tv":m==="movie"?"movie":"tv",e=await qe(q,i);if(e||(q=q==="tv"?"movie":"tv",e=await qe(q,i)),!e)return{html:'<div class="container" style="padding: 10rem 0; text-align: center;"><h2>İçerik bulunamadı.</h2></div>',init:()=>{}};const $=!!(e.seasons&&e.seasons.length>0)||q==="tv",o=$?"tv":"movie",z=Ke(e)||m==="anime"||q==="anime"||Ue(i);z&&Ge(i);const h=e.title||e.name||"Detay",S=e.original_title||e.original_name||"",O=le(e.backdrop_path,re.BACKDROP_ORIGINAL);le(e.poster_path,re.POSTER_MEDIUM);const I=e.vote_average?e.vote_average.toFixed(1):"8.5",C=(e.first_air_date||e.release_date||"").substring(0,4),F=e.overview&&e.overview.trim().length>15?e.overview:Ze(e,o),J=e.genres||[],y=e.runtime?e.runtime*60:6600,a=Ve(i),f=Xe(i),u=o==="tv"?ge(i):null,x=o==="movie"?ae(i,1,1):null,v=o==="movie"?Ce(i,1,1):!1,d=o==="tv"?xe(i,e.seasons||[]):!1,p=o==="movie"?v:d;let w=o==="movie"?"Filmi İzle":"1. Sezon 1. Bölümü İzle";if(o==="tv"&&u){const t=se(u.currentTime);w=`Devam Et <span class="play-btn-subinfo">S${u.season} B${u.episode}${t?" • "+t:""}</span>`}else o==="movie"&&x&&x.currentTime>0&&(w=`Devam Et <span class="play-btn-subinfo">${se(x.currentTime)}</span>`);const R=e.credits?.crew?e.credits.crew.filter(t=>t.job==="Director").map(t=>t.name):[],r=e.created_by?e.created_by.map(t=>t.name):[],E=R.length>0?R.slice(0,2).join(", "):r.length>0?r.slice(0,2).join(", "):"",g=(parseFloat(I)/2).toFixed(1),A=Math.floor(g),B=g%1>=.4,D="★".repeat(Math.min(5,A))+(B&&A<5?"½":""),T=e.credits&&e.credits.cast?e.credits.cast.slice(0,24):[];let W=null,Z=!1;o==="tv"&&e.seasons&&(W=await at({tvId:i,seriesTitle:h,originalTitle:S,seriesOverview:F,seasons:e.seasons,posterPath:e.poster_path,backdropPath:e.backdrop_path,isAnime:z,spoilerFree:Z}));const M=e.recommendations?e.recommendations.results.slice(0,6):[],K=o==="movie"?v?"Film İzlendi":"İzlendi Olarak İşaretle":d?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle",ie=e.runtime?`
    <span>${He(e.runtime)}</span>
  `:"",Q=z?$?"ANİME DİZİSİ":"ANİME FİLMİ":o==="tv"?"DİZİ":"FİLM",Se=(e.videos?.results||[]).filter(t=>t.site==="YouTube");Se.sort((t,N)=>{const V={Trailer:1,Teaser:2,Clip:3,"Behind the Scenes":4};return(V[t.type]||9)-(V[N.type]||9)});const me=Se.filter((t,N,V)=>t.key&&V.findIndex(U=>U.key===t.key)===N).slice(0,12),Le=[{label:"Resmi fragman ara",query:`${S||h} official trailer`},{label:"Türkçe fragman ara",query:`${h} Türkçe fragman`},{label:"Tanıtım ve teaser ara",query:`${S||h} official teaser`},{label:"Klipleri ara",query:`${S||h} official clip`}].slice(0,Math.max(0,4-me.length));return{html:`
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
              <h1 class="detail-heading-title">${h}</h1>

              <!-- Editorial Subtitle (Original Title & Creator / Director) -->
              <div class="detail-editorial-sub">
                ${S&&S!==h?`<span class="detail-orig-name">${S}</span>`:""}
                ${E?`
                  <span class="detail-director-pill">
                    <strong style="color: var(--primary);">${o==="tv"?"YARATICI":"YÖNETMEN"}:</strong> ${E}
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
                  <i data-lucide="star" style="width:14px; height:14px; fill: #dfff76; color: #dfff76;"></i> ${I}
                </span>
                <span>${C}</span>
                ${J.length>0?`<span>${J.slice(0,3).map(t=>t.name).join(" • ")}</span>`:""}
                ${ie}
                ${e.number_of_seasons?`<span>${e.number_of_seasons} Sezon</span>`:""}
                ${e.number_of_episodes?`<span>${e.number_of_episodes} Bölüm</span>`:""}
                <span class="detail-meta-type">${Q}</span>
              </div>

              <!-- Hero Actions (Play + Secondary Options) -->
              <div class="detail-action-deck">
                <div class="detail-action-main-row">
                  ${o==="movie"?`
                    <button class="btn-play-primary" id="btn-play-movie">
                      <i data-lucide="play" style="fill: currentColor; width: 20px; height: 20px;"></i>
                      <span>${w}</span>
                    </button>
                  `:`
                    <button class="btn-play-primary" id="btn-resume-series">
                      <i data-lucide="play" style="fill: currentColor; width: 20px; height: 20px;"></i>
                      <span>${w}</span>
                    </button>
                  `}

                  <button class="btn-action-tile ${f?"active-watch":""}" id="btn-toggle-watchlist">
                    <i data-lucide="${f?"check":"plus"}"></i>
                    <span>${f?"Listemde":"Listem"}</span>
                  </button>

                  <button class="btn-action-tile ${a?"active-fav":""}" id="btn-toggle-fav">
                    <i data-lucide="heart" style="${a?"fill: var(--primary); color: var(--primary)":""}"></i>
                    <span>${a?"Favorilerimde":"Favori"}</span>
                  </button>

                  <button class="btn-action-tile ${p?"active-watched":""}" id="btn-toggle-watched-detail">
                    <i data-lucide="${p?"check-circle-2":"check"}"></i>
                    <span>${K}</span>
                  </button>

                  <button class="btn-action-tile" id="btn-mark-halfway-detail" title="Kaldığım Yer">
                    <i data-lucide="clock" style="color: #dfff76;"></i>
                    <span>Yarıda Bırak</span>
                  </button>
                </div>

                ${o==="tv"?`
                  <div class="detail-spoiler-inline-row">
                    <label class="spoiler-discovery-pill">
                      <input id="detail-spoiler-free-toggle" type="checkbox" />
                      <i data-lucide="shield-check"></i>
                      <span>Spoilersız Keşfet</span>
                    </label>
                  </div>
                `:""}
              </div>

              ${me.length>0||Le.length>0?`
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
            ${o==="tv"&&W?`
              <button class="netflix-tab-btn active" data-tab="episodes">
                <span>BÖLÜMLER</span>
              </button>
            `:""}

            <button class="netflix-tab-btn ${o==="movie"?"active":""}" data-tab="cast">
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

          ${o==="tv"&&W?`
            <!-- Tab Pane: Episodes (Image 3) -->
            <div class="netflix-tab-pane active" id="tab-pane-episodes">
              ${W.html}
            </div>
          `:""}

          <!-- Tab Pane: Dedicated Cast Grid (Image 4) -->
          <div class="netflix-tab-pane ${o==="movie"?"active":""}" id="tab-pane-cast">
            <div class="netflix-pane-header">
              <div class="netflix-pane-title-group">
                <h2 class="netflix-pane-title">
                  <i data-lucide="users" style="color: #dfff76; width: 20px; height: 20px;"></i>
                  <span>Oyuncu Kadrosu & Karakterler</span>
                </h2>
                <p class="netflix-pane-subtitle">Karakteri canlandıran oyuncular ve filmografileri</p>
              </div>
              <span class="netflix-pane-count-pill">${T.length} Oyuncu</span>
            </div>

            ${T.length>0?`
              <div class="netflix-cast-grid">
                ${T.map((t,N)=>{const V=t.profile_path?le(t.profile_path,re.POSTER_MEDIUM):fe,U=t.character?t.character.split("/")[0].trim():"",G=(t.popularity?Math.min(9.9,Math.max(6.5,t.popularity/3.5+6)):8.5).toFixed(1);return`
                    <div class="netflix-cast-card ${N>=12?"cast-card-hidden":""}" data-person-id="${t.id}" data-person-name="${t.name}" title="${t.name}${U?" ("+U+")":""} • Filmografiyi Gör">
                      <div class="netflix-cast-photo-wrap">
                        <img src="${V}" alt="${t.name}" loading="lazy" onerror="this.onerror=null; this.src='${fe}';" />
                        <div class="netflix-cast-card-hover">
                          <i data-lucide="sparkles" style="width:20px;height:20px;color:#fff;"></i>
                          <span>Filmografi</span>
                        </div>
                      </div>
                      <div class="netflix-cast-info">
                        <h4 class="netflix-cast-name">${t.name}</h4>
                        ${U?`<p class="netflix-cast-character">As ${U}</p>`:""}
                        <div class="netflix-cast-rating">
                          <i data-lucide="star" style="width:11px;height:11px;fill:#dfff76;stroke:#dfff76;"></i>
                          <span>${G} / 10</span>
                        </div>
                      </div>
                    </div>
                  `}).join("")}
              </div>

              ${T.length>12?`
                <div style="text-align: center; margin: 2.5rem 0 1rem;">
                  <button class="btn-netflix-show-more" id="btn-show-more-cast">
                    <span>Tüm Oyuncuları Göster (${T.length})</span>
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
                  ${S?`
                    <div class="spec-row">
                      <span class="spec-label">Orijinal Başlık</span>
                      <span class="spec-val">${S}</span>
                    </div>
                  `:""}
                  ${E?`
                    <div class="spec-row">
                      <span class="spec-label">${o==="tv"?"Yaratıcı":"Yönetmen"}</span>
                      <span class="spec-val">${E}</span>
                    </div>
                  `:""}
                  ${e.release_date||e.first_air_date?`
                    <div class="spec-row">
                      <span class="spec-label">Yayın Tarihi</span>
                      <span class="spec-val">${e.release_date||e.first_air_date}</span>
                    </div>
                  `:""}
                  ${e.status?`
                    <div class="spec-row">
                      <span class="spec-label">Yayın Durumu</span>
                      <span class="spec-val">${e.status}</span>
                    </div>
                  `:""}
                  ${e.runtime?`
                    <div class="spec-row">
                      <span class="spec-label">Film Süresi</span>
                      <span class="spec-val">${He(e.runtime)}</span>
                    </div>
                  `:""}
                  ${e.number_of_seasons?`
                    <div class="spec-row">
                      <span class="spec-label">Toplam Sezon</span>
                      <span class="spec-val">${e.number_of_seasons} Sezon</span>
                    </div>
                  `:""}
                  ${e.number_of_episodes?`
                    <div class="spec-row">
                      <span class="spec-label">Toplam Bölüm</span>
                      <span class="spec-val">${e.number_of_episodes} Bölüm</span>
                    </div>
                  `:""}
                  <div class="spec-row">
                    <span class="spec-label">IMDb Puanı</span>
                    <span class="spec-val" style="color: #dfff76; font-weight: 750;">★ ${I} / 10</span>
                  </div>
                  <div class="spec-row">
                    <span class="spec-label">Letterboxd</span>
                    <span class="spec-val" style="color: #00e054; font-weight: 750;">${D} (${g})</span>
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
              ${me.map((t,N)=>`
                <div class="hero-trailer-expand-card netflix-pane-trailer-card" data-video-key="${t.key}" data-video-title="${t.name||"Fragman "+(N+1)}" data-video-type="${t.type||"Fragman"}">
                  <div class="trailer-compact-view">
                    <img src="https://img.youtube.com/vi/${t.key}/mqdefault.jpg" alt="${t.name||"Trailer"}" loading="lazy" />
                    <div class="trailer-thumb-overlay">
                      <div class="trailer-play-chip">
                        <i data-lucide="play" style="width: 14px; height: 14px; fill: currentColor;"></i>
                      </div>
                      <span class="trailer-compact-name">${t.name||"Fragman "+(N+1)}</span>
                    </div>
                  </div>
                  <div class="trailer-expanded-view">
                    <div class="trailer-expanded-player"></div>
                    <div class="trailer-expanded-info">
                      <div class="trailer-expanded-header">
                        <span class="trailer-expanded-tag">${t.type||"RESMİ FRAGMAN"}</span>
                        <button class="trailer-expanded-close" title="Fragmanı kapat" aria-label="Fragmanı kapat" type="button">
                          <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                        </button>
                      </div>
                      <h4 class="trailer-expanded-title">${t.name||`${h} Fragman`}</h4>
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
              ${Le.map(t=>`
                <a class="trailer-search-card" href="https://www.youtube.com/results?search_query=${encodeURIComponent(t.query)}" target="_blank" rel="noopener noreferrer" aria-label="${t.label}: YouTube'da aç">
                  <i data-lucide="search" aria-hidden="true"></i>
                  <span>${t.label}</span>
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
                    <i data-lucide="thumbs-up" style="color: #dfff76; width: 20px; height: 20px;"></i>
                    <span>Benzer Önerilen Yapımlar</span>
                  </h2>
                  <p class="netflix-pane-subtitle">Bu yapımı seven izleyicilerin en çok beğendiği diğer içerikler</p>
                </div>
              </div>
              <div class="media-grid">
                ${M.map(t=>$e(t)).join("")}
              </div>
            </div>
          `:""}

        </div>
      </div>
    </div>
  `,init:t=>{if(!t)return;let N=lt(o,i);const V=t.querySelector("#btn-detail-back");V&&V.addEventListener("click",s=>{s.preventDefault(),window.history.length>1?window.history.back():window.location.hash="#home"}),W&&W.init(t);const U=t.querySelector("#detail-spoiler-free-toggle");U&&(U.checked=Z,U.addEventListener("change",()=>{Z=U.checked,W?.setSpoilerSafe(Z),Y(Z?"Spoilersız keşif açıldı. Sonraki bölüm detayları gizlendi.":"Spoilersız keşif kapatıldı.","info")}));const G=t.querySelector("#btn-play-movie"),he=async()=>{if(!G||G.disabled)return;G.disabled=!0;const s=G.innerHTML;G.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',k();try{const n=ae(i,1,1);await we({type:z?"anime":"movie",isAnime:z,tmdbId:i,title:h,seriesTitle:h,originalTitle:S,posterPath:e.poster_path,backdropPath:e.backdrop_path,duration:y,currentTime:n?n.currentTime:0,roomSync:N?{roomCode:N.roomCode,mediaId:i,type:o,season:1,episode:1,initialSync:N.initialSync||null}:null})}catch{Y("Film açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{G.disabled=!1,G.innerHTML=s,k()}};G&&G.addEventListener("click",he);const X=t.querySelector("#btn-resume-series"),Ee=async()=>{if(!X||X.disabled)return;X.disabled=!0;const s=X.innerHTML;X.innerHTML='<i data-lucide="loader-2" class="spin-loader" style="width:18px;height:18px;fill:currentColor"></i> <span>Yükleniyor...</span>',k();try{const n=N;N=null;const l=ge(i),b=n?.season||(l?l.season:1),_=n?.episode||(l?l.episode:1),P=n?0:l?l.currentTime:0;await we({type:z?"anime":"tv",isAnime:z,tmdbId:i,title:`${h} - S${b}E${_}`,seriesTitle:h,originalTitle:S,season:b,episode:_,posterPath:e.poster_path,backdropPath:e.backdrop_path,currentTime:P,seasonsList:e.seasons||[],roomSync:n?{roomCode:n.roomCode,mediaId:i,type:o,season:b,episode:_,initialSync:n.initialSync||null}:null})}catch{Y("İçerik açılırken hata oluştu, lütfen tekrar deneyin.","error")}finally{X.disabled=!1,X.innerHTML=s,k()}};X&&X.addEventListener("click",s=>{s.preventDefault(),Ee()}),N&&window.setTimeout(()=>{o==="movie"?he():Ee()},0);const Te=t.querySelector("#btn-watch-trailer");Te&&Te.addEventListener("click",s=>{s.preventDefault(),t.querySelectorAll(".netflix-tab-btn").forEach(n=>n.classList.toggle("active",n.dataset.tab==="trailers")),t.querySelectorAll(".netflix-tab-pane").forEach(n=>n.classList.toggle("active",n.id==="tab-pane-trailers")),k(t.querySelector("#tab-pane-trailers")),t.querySelector("#tab-pane-trailers")?.scrollIntoView({behavior:"smooth",block:"start"})}),t.querySelectorAll(".hero-trailer-expand-card").forEach(s=>{s.addEventListener("click",n=>{if(n.target.closest(".trailer-expanded-close")){n.stopPropagation(),s.classList.remove("is-expanded");const _=s.querySelector(".trailer-expanded-player");_&&(_.innerHTML="");return}if(s.classList.contains("is-expanded"))return;t.querySelectorAll(".hero-trailer-expand-card.is-expanded").forEach(_=>{_.classList.remove("is-expanded");const P=_.querySelector(".trailer-expanded-player");P&&(P.innerHTML="")});const l=s.getAttribute("data-video-key");if(!l)return;s.classList.add("is-expanded");const b=s.querySelector(".trailer-expanded-player");b&&(b.innerHTML=`
              <iframe 
                src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(l)}?autoplay=1&mute=0&controls=1&modestbranding=1&rel=0&playsinline=1"
                frameborder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowfullscreen
                class="trailer-inline-iframe"
                title="${h} Fragman">
              </iframe>
            `),k()})});const ne=t.querySelector("#btn-toggle-fav");ne&&ne.addEventListener("click",()=>{const s=Je({...e,type:z?"anime":o,isAnime:z,media_type:o});Y(s?"Favorilere eklendi!":"Favorilerden çıkarıldı.",s?"success":"info");const n=ne.querySelector("i"),l=ne.querySelector("span");n&&l&&(n.style.fill=s?"var(--primary)":"none",n.style.color=s?"var(--primary)":"currentColor",l.textContent=s?"Favorilerimde":"Favorilere Ekle")});const oe=t.querySelector("#btn-toggle-watchlist");oe&&oe.addEventListener("click",()=>{const s=Qe({...e,type:z?"anime":o,isAnime:z,media_type:o});Y(s?"İzleme listesine eklendi!":"İzleme listesinden çıkarıldı.",s?"success":"info");const n=oe.querySelector("i"),l=oe.querySelector("span");n&&l&&(n.setAttribute("data-lucide",s?"check":"plus"),k(),l.textContent=s?"Listemde":"İzleme Listeme Ekle")});const j=t.querySelector("#btn-toggle-watched-detail");j&&j.addEventListener("click",s=>{if(s.preventDefault(),o==="movie"){const l=Ie(i,1,1,{title:h,posterPath:e.poster_path,backdropPath:e.backdrop_path,type:"movie",duration:y}).completed;Y(l?"✓ Film izlendi olarak işaretlendi!":"Film izlendi işareti kaldırıldı.",l?"success":"info"),l?j.classList.add("btn-watched-active"):j.classList.remove("btn-watched-active"),j.innerHTML=`
              <i data-lucide="${l?"check-circle-2":"check"}"></i>
              <span>${l?"Film İzlendi":"İzlendi Olarak İşaretle"}</span>
            `,k()}else{const l=!xe(i,e.seasons||[]);et(i,e.seasons||[],l,{title:h,posterPath:e.poster_path,backdropPath:e.backdrop_path,type:z?"anime":"tv",isAnime:z}),Y(l?"✓ Dizinin tüm bölümleri izlendi olarak işaretlendi!":"Tüm bölümler izlenmedi yapıldı.",l?"success":"info"),l?j.classList.add("btn-watched-active"):j.classList.remove("btn-watched-active"),j.innerHTML=`
              <i data-lucide="${l?"check-circle-2":"check"}"></i>
              <span>${l?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle"}</span>
            `,k(),t.querySelectorAll(".episode-card").forEach(_=>{const P=_.querySelector(".badge-watched-status"),H=_.querySelector(".btn-mark-ep-watched");P&&(P.innerHTML='<i data-lucide="check" style="width:12px; height:12px"></i> İZLENDİ',P.style.background="var(--accent-green)",P.style.color="#fff",P.style.display=l?"inline-flex":"none"),H&&(l?(H.classList.add("watched"),H.style.background="#10b981",H.style.borderColor="#10b981"):(H.classList.remove("watched"),H.style.background="rgba(0,0,0,0.65)",H.style.borderColor="rgba(255,255,255,0.3)"))});const b=t.querySelector("#btn-mark-season-all");if(b){const _=b.querySelector("span"),P=b.querySelector("i");_&&(_.textContent=l?"Bu Sezon İzlendi":"Bu Sezonu İzlendi İşaretle"),P&&P.setAttribute("data-lucide",l?"check-circle-2":"check-check"),l?(b.style.background="rgba(16, 185, 129, 0.2)",b.style.borderColor="#10b981",b.style.color="#10b981"):(b.style.background="",b.style.borderColor="",b.style.color="")}k()}});const Pe=s=>{if(s&&s.detail&&s.detail.isProgressUpdate&&document.getElementById("player-modal"))return;const n=o==="movie"?Ce(i,1,1):!1,l=o==="tv"?xe(i,e.seasons||[]):!1,b=o==="movie"?n:l;if(j){b?j.classList.add("btn-watched-active"):j.classList.remove("btn-watched-active");const H=o==="movie"?b?"Film İzlendi":"İzlendi Olarak İşaretle":b?"Tüm Sezonlar İzlendi":"Tümünü İzlendi İşaretle";j.innerHTML=`
            <i data-lucide="${b?"check-circle-2":"check"}"></i>
            <span>${H}</span>
          `}const _=t.querySelector("#btn-play-movie");if(_&&o==="movie"){const H=ae(i,1,1);if(H&&H.currentTime>0&&!H.completed){const ce=se(H.currentTime);_.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">${ce}</span></span>`}}const P=t.querySelector("#btn-resume-series");if(P&&o==="tv"){const H=ge(i);if(H){const ce=se(H.currentTime);P.innerHTML=`<i data-lucide="play" style="fill:currentColor"></i> <span>Devam Et <span class="play-btn-subinfo">S${H.season} B${H.episode}${ce?" • "+ce:""}</span></span>`}}k()};window.addEventListener("sineflix_data_changed",Pe);const _e=t.querySelector("#btn-mark-halfway-detail");_e&&_e.addEventListener("click",s=>{if(s.preventDefault(),o==="movie"){const n=Math.round(y*.5),l=se(n);ke(i,1,1,n,{title:h,posterPath:e.poster_path,backdropPath:e.backdrop_path,type:z?"anime":"movie",isAnime:z,duration:y}),Y(`⏳ Film ${l} dakikasında yarıda bırakıldı olarak işaretlendi!`,"info");const b=t.querySelector("#btn-play-movie span");b&&(b.textContent=`Kaldığın Yerden Devam Et (${l})`)}else{const n=u?u.season:1,l=u?u.episode:1;ke(i,n,l,1200,{title:h,posterPath:e.poster_path,backdropPath:e.backdrop_path,type:z?"anime":"tv",isAnime:z,duration:3e3}),Y(`⏳ S${n} B${l} 20. dakikada yarıda bırakıldı olarak işaretlendi!`,"info");const b=t.querySelector("#btn-resume-series span");b&&(b.textContent=`Kaldığın Yerden Devam Et (S${n} B${l} • 20:00)`)}});const de=t.querySelector("#btn-expand-storyline"),ye=t.querySelector("#detail-storyline-text");de&&ye&&de.addEventListener("click",()=>{const s=!ye.classList.contains("truncated");ye.classList.toggle("truncated");const n=de.querySelector("span"),l=de.querySelector("i");n&&(n.textContent=s?"Devamını Oku":"Daralt"),l&&(l.style.transform=s?"rotate(0deg)":"rotate(180deg)")});const ze=t.querySelectorAll(".netflix-tab-btn"),Re=t.querySelectorAll(".netflix-tab-pane");ze.forEach(s=>{s.addEventListener("click",n=>{n.preventDefault();const l=s.getAttribute("data-tab");l!=="trailers"&&t.querySelectorAll("#tab-pane-trailers .hero-trailer-expand-card.is-expanded").forEach(_=>{_.classList.remove("is-expanded"),_.querySelector(".trailer-expanded-player").innerHTML=""}),ze.forEach(_=>_.classList.remove("active")),Re.forEach(_=>_.classList.remove("active")),s.classList.add("active");const b=t.querySelector(`#tab-pane-${l}`);b&&(b.classList.add("active"),k(b))})}),t.querySelectorAll(".netflix-cast-card").forEach(s=>{s.addEventListener("click",n=>{n.preventDefault();const l=s.getAttribute("data-person-id"),b=s.getAttribute("data-person-name");l&&st(l,b)})});const ve=t.querySelector("#btn-show-more-cast");ve&&ve.addEventListener("click",s=>{s.preventDefault(),t.querySelectorAll(".netflix-cast-card.cast-card-hidden").forEach(l=>l.classList.remove("cast-card-hidden")),ve.style.display="none",k()});const Be=t.querySelector("#btn-pane-play-trailer");Be&&Be.addEventListener("click",()=>{const s=t.querySelector("#btn-watch-trailer");s&&s.click()});const ee=t.querySelector("#detail-next-episode-badge");ee&&o==="tv"&&(async()=>{try{const s=await tt({imdbId:e.external_ids?.imdb_id,title:S||h,year:C});if(!s?.nextEpisode||!ee.isConnected)return;const n=s.nextLabel||"",l=s.nextAirdateLabel||"";if(!n&&!l||l==="Yayınlandı")return;const b=[n?`Yeni bölüm ${n}`:"Yeni bölüm",l].filter(Boolean).join(" • ");ee.innerHTML=`<i data-lucide="calendar-clock" style="width:13px; height:13px"></i><span>${b}</span>`,ee.title=`Sonraki bölüm: ${n||"-"}${s.nextEpisode.name?" — "+s.nextEpisode.name:""}${l?" • "+l:""} (Kaynak: TVmaze)`,ee.style.display="inline-flex",k(ee)}catch{}})();const Me=t.querySelector(".media-grid");Me&&Fe(Me)}}}export{ct as renderDetailView};

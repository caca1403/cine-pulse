import{a1 as w,j as T,a2 as z,a3 as D,a4 as L,a5 as A,a6 as _,a7 as q,a8 as C,a9 as F,aa as $,h as j,r as B}from"./index-Dw1v7k4x.js";import"./vendor-capacitor-VGCIBgSg.js";const p={};function G(e){const s=w()?`${e}_kids`:e;return(!p[s]||p[s].stale)&&(p[s]={allItems:[],seenIds:new Set,nextPage:1,isExhausted:!1,stale:!1}),p[s]}function O(e){if(w())switch(e){case"movie":return A;case"anime":return L;case"documentary":return D;case"cartoon":return z;default:return z}switch(e){case"movie":return $;case"anime":return F;case"documentary":return C;case"cartoon":return q;default:return _}}async function U(e="tv"){const o=w(),s=o?`${e}_kids`:e;p[s]&&(p[s].stale=!0);const i=G(e),k=o?{tv:["Türkiye’de Popüler Çizgi ve Gençlik Dizileri","monitor-play"],movie:["🎈 Animasyon & Çocuk Filmleri","popcorn"],anime:["Türkiye’de Popüler Çocuk ve Genç Animeleri","cat"],documentary:["🐾 Doğa & Hayvan Belgeselleri","globe"]}:{tv:["Tüm Zamanların En Popüler Dizileri","monitor-play"],cartoon:["Çizgi Dizi Dünyası & Unutulmaz Klasikler","wand-2"],movie:["Tüm Zamanların En Popüler Filmleri","popcorn"],anime:["Türkiye’de En Popüler Animeler","cat"],documentary:["Tüm Zamanların En Çok İzlenen Belgeselleri","globe"]},[K,H]=k[e]||k.tv;return{html:`
    <div class="popular-list-view">
      <div class="container">
        <div class="popular-list-header">
          <h1 class="popular-list-title">
            <span class="rail-icon-pill" style="--rail-color: #dfff76; width: 32px; height: 32px; flex-shrink: 0;">
              <i data-lucide="${H}" style="width: 17px; height: 17px;"></i>
            </span>
            <span>${K}</span>
          </h1>
          <p class="popular-list-sub" id="popular-count-label">${e==="anime"||e==="cartoon"||o&&e==="tv"?"Güncel ilgi, izleyici güveni ve Türkiye popülerlik sinyaline göre sıralanıyor":"Tüm zamanların popülerliğine göre akıcı olarak listeleniyor"}</p>
        </div>

        <div class="media-grid" id="popular-media-grid">
          <div class="popular-loading-placeholder" style="grid-column: 1/-1; padding: 3rem 2rem; text-align: center; color: var(--text-muted);">
            <div class="spin-loader" style="width: 36px; height: 36px; border: 3px solid rgba(223, 255, 118,0.2); border-top-color: #dfff76; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.25rem;"></div>
            <p style="font-size: 1.05rem;">Popüler içerikler hazırlanıyor...</p>
          </div>
        </div>

        <div id="popular-sentinel" style="min-height: 90px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 2rem 0 5rem; color: var(--text-muted);"></div>
      </div>
    </div>
  `,init:f=>{if(!f)return;const l=f.querySelector("#popular-media-grid"),u=f.querySelector("#popular-sentinel");if(!l)return;T(l);let c=!1;const M=O(e),g=()=>{u&&(i.isExhausted?u.innerHTML='<p style="color: var(--text-muted); font-size: 0.9rem;">Tüm popüler içerikler listelendi.</p>':u.innerHTML=`
            <div style="display: flex; align-items: center; gap: 0.6rem; color: var(--text-muted); font-size: 0.9rem;">
              <div class="spin-loader" style="width: 20px; height: 20px; border: 2px solid rgba(223, 255, 118,0.25); border-top-color: #dfff76; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
              <span>Daha fazla içerik akıyor...</span>
            </div>
          `)},P=r=>{if(!r||r.length===0)return;const n=[];for(const a of r)a&&a.id&&!i.seenIds.has(a.id)&&(i.seenIds.add(a.id),n.push(a));if(n.length===0)return;i.allItems.push(...n);const d=n.map(a=>j(a)).join("");l.querySelector(".popular-loading-placeholder")?l.innerHTML=d:l.insertAdjacentHTML("beforeend",d),T(l),B()},m=async(r=3)=>{if(!(c||i.isExhausted)){c=!0,g();try{const n=i.nextPage,d=Array.from({length:r},(t,y)=>n+y);i.nextPage+=r;let x=0;const a=e==="anime"||e==="cartoon"||o&&e==="tv",I=d.map(t=>M(t).catch(()=>[])),E=await Promise.all(I),h=E.flat().filter(Boolean);if(a){const t=e==="cartoon"?"_cartoonScore":"_turkeyPopularityScore";h.sort((y,S)=>(S[t]||0)-(y[t]||0)),x=h.length,P(h)}else for(const t of E)t&&t.length>0&&(x+=t.length,P(t));h.length===0&&(i.isExhausted=!0),g(),requestAnimationFrame(()=>{if(!i.isExhausted&&document.documentElement.scrollHeight<=window.innerHeight+600){c=!1,m(2);return}})}catch{}finally{c=!1,g()}}};m(1);let v=null;u&&"IntersectionObserver"in window&&(v=new IntersectionObserver(r=>{r[0].isIntersecting&&!c&&!i.isExhausted&&m(2)},{rootMargin:"0px 0px 1500px 0px"}),v.observe(u));const b=()=>{if(c||i.isExhausted)return;const r=window.scrollY||0,n=window.innerHeight,d=Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);r+n>=d-1200&&m(2)};window.addEventListener("scroll",b,{passive:!0}),window.__popularListCleanup=()=>{v?.disconnect(),window.removeEventListener("scroll",b)}}}}export{U as renderPopularListView};

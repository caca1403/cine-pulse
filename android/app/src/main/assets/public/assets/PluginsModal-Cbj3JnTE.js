import{r as E,s as x}from"./index-BX5i0L1a.js";import{l as k,s as L}from"./pluginCatalog-DYPQBVm8.js";import"./vendor-capacitor-DGWR5Llo.js";let s=null,d=null;const l=i=>String(i??"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a]),C=`
.plugins-modal-overlay{position:fixed;inset:0;z-index:1200;display:flex;align-items:center;justify-content:center;background:rgba(2,6,16,.72);backdrop-filter:blur(10px);padding:1rem;}
.plugins-modal-card{width:min(640px,100%);max-height:min(82vh,760px);display:flex;flex-direction:column;overflow:hidden;border-radius:20px;background:linear-gradient(160deg,#141a2b,#0b0f1c);border:1px solid rgba(255,255,255,.1);color:#eef2ff;}
.plugins-modal-head{display:flex;justify-content:space-between;gap:1rem;padding:1.2rem 1.3rem .8rem;}
.plugins-modal-head h2{margin:.2rem 0 .3rem;font-size:1.25rem;}
.plugins-modal-head h2 small{font-size:.8rem;color:#94a3b8;font-weight:600;}
.plugins-modal-head p{margin:0;font-size:.82rem;color:#94a3b8;}
.plugins-modal-search{display:flex;align-items:center;gap:.5rem;margin:0 1.3rem .7rem;padding:.55rem .8rem;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);}
.plugins-modal-search input{flex:1;background:transparent;border:0;outline:0;color:#fff;font-size:.9rem;}
.plugins-modal-list{overflow-y:auto;padding:0 1.3rem 1.3rem;display:flex;flex-direction:column;gap:.55rem;}
.plugin-row{display:flex;align-items:center;gap:.8rem;padding:.7rem .8rem;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);}
.plugin-row.is-off{opacity:.62;}
.plugin-row-id{min-width:96px;display:flex;flex-direction:column;}
.plugin-alias{font-weight:800;font-size:.95rem;color:#dfff76;}
.plugin-row-info{flex:1;min-width:0;}
.plugin-kinds{display:flex;gap:.3rem;flex-wrap:wrap;margin-bottom:.2rem;}
.plugin-kinds span{font-size:.68rem;font-weight:700;padding:.1rem .5rem;border-radius:9999px;background:rgba(223,255,118,.12);color:#dfff76;border:1px solid rgba(223,255,118,.25);}
.plugin-row-info p{margin:0;font-size:.78rem;color:#b6c2d8;}
.plugin-warn{display:flex;gap:.35rem;align-items:flex-start;margin-top:.3rem !important;font-size:.72rem !important;color:#fbbf24 !important;}
.plugin-warn svg{flex:none;margin-top:1px;}
.plugin-toggle{position:relative;width:46px;height:26px;flex:none;border-radius:9999px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.1);cursor:pointer;transition:background .18s;}
.plugin-toggle-knob{position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#94a3b8;transition:left .18s,background .18s;}
.plugin-toggle[aria-checked="true"]{background:rgba(223,255,118,.35);border-color:rgba(223,255,118,.6);}
.plugin-toggle[aria-checked="true"] .plugin-toggle-knob{left:22px;background:#dfff76;}
.plugins-empty{padding:2rem;text-align:center;color:#94a3b8;}
`;function z(){try{if(document.getElementById("plugins-modal-css"))return;const i=document.createElement("style");i.id="plugins-modal-css",i.textContent=C,document.head.appendChild(i)}catch{}}function q(){o(),z(),d=new AbortController;const{signal:i}=d,a=document.createElement("div");a.id="plugins-modal-root",a.className="modal-overlay plugins-modal-overlay",a.setAttribute("role","dialog"),a.setAttribute("aria-modal","true"),document.body.appendChild(a),s=a;const p=(n="")=>{const c=k(),g=n.trim().toLocaleLowerCase("tr-TR"),w=c.filter(e=>!g||(e.alias||"").toLocaleLowerCase("tr-TR").includes(g)||(e.id||"").toLocaleLowerCase("tr-TR").includes(g)),y=c.filter(e=>e.enabled).length;a.innerHTML=`
      <div class="modal-card plugins-modal-card" role="document">
        <div class="plugins-modal-head">
          <div>
            <span class="cp-eyebrow">KAYNAK YONETIMI</span>
            <h2>Eklentiler <small>(${y}/${c.length} açık)</small></h2>
            <p>Kapalı eklenti taranmaz, listede görünmez. Değişiklik yeni aramalarda geçerlidir.</p>
          </div>
          <button type="button" class="modal-close" id="btn-close-plugins" aria-label="Kapat">
            <i data-lucide="x" style="width:20px;height:20px;"></i>
          </button>
        </div>
        <div class="plugins-modal-search">
          <i data-lucide="search" style="width:15px;height:15px;"></i>
          <input id="plugins-search" type="search" placeholder="Eklenti ara… (örn. Orion)" value="${l(n)}" aria-label="Eklenti ara" />
        </div>
        <div class="plugins-modal-list">
          ${w.map(e=>`
            <div class="plugin-row ${e.enabled?"is-on":"is-off"}" data-plugin="${l(e.id)}">
              <div class="plugin-row-id">
                <span class="plugin-alias">${l(e.alias||e.id)}</span>
              </div>
              <div class="plugin-row-info">
                <div class="plugin-kinds">${(e.kinds||[]).map(r=>`<span>${l(r)}</span>`).join("")}</div>
                <p>${l(e.desc||"")}</p>
                ${e.warn?`<p class="plugin-warn"><i data-lucide="triangle-alert" style="width:12px;height:12px;"></i><span>${l(e.warn)}</span></p>`:""}
              </div>
              <button type="button" class="plugin-toggle" role="switch" aria-checked="${e.enabled}" aria-label="${l(e.alias||e.id)} ${e.enabled?"kapat":"aç"}" data-toggle="${l(e.id)}">
                <span class="plugin-toggle-knob"></span>
              </button>
            </div>
          `).join("")||'<div class="plugins-empty">Eşleşen eklenti yok.</div>'}
        </div>
      </div>
    `,E(a),a.querySelector("#btn-close-plugins")?.addEventListener("click",o,{signal:i});const u=a.querySelector("#plugins-search");let m=null;u?.addEventListener("input",()=>{clearTimeout(m),m=setTimeout(()=>p(u.value),180)},{signal:i}),a.querySelectorAll("[data-toggle]").forEach(e=>{e.addEventListener("click",async()=>{const r=e.dataset.toggle,f=a.querySelector(`[data-plugin="${CSS.escape(r)}"]`),t=e.getAttribute("aria-checked")!=="true";e.disabled=!0;const v=await L(r,t).catch(()=>!1);if(e.disabled=!1,!v){x("Eklenti durumu kaydedilemedi.","error");return}e.setAttribute("aria-checked",String(t)),f?.classList.toggle("is-on",t),f?.classList.toggle("is-off",!t),e.setAttribute("aria-label",`${r} ${t?"kapat":"aç"}`);const b=a.querySelector(".plugins-modal-head small");if(b){const h=k();b.textContent=`(${h.filter($=>$.enabled).length}/${h.length} açık)`}x(t?"Eklenti açıldı.":"Eklenti kapatıldı.",t?"success":"info")},{signal:i})})};a.addEventListener("click",n=>{n.target===a&&o()},{signal:i}),window.addEventListener("keydown",n=>{n.key==="Escape"&&o()},{signal:i}),p("")}function o(){try{d?.abort()}catch{}if(d=null,s){try{s.remove()}catch{}s=null}}export{o as closePluginsModal,q as openPluginsModal};

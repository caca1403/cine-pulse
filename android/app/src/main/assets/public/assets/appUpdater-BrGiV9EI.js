import{s as m,r as y,D as g}from"./index-D6oEAyiX.js";import{A as x}from"./vendor-capacitor-VGCIBgSg.js";const b="1.1.44",v=154,k="https://cine-pulse-drab.vercel.app/version.json";let c=null,o=0,f=!1;const w=6e4;function E(e,i){if(!e||!i)return!1;const r=n=>String(n).replace(/^v/i,"").split(".").map(d=>parseInt(d,10)||0),[t,a,u]=r(e),[s,l,p]=r(i);return t>s||t===s&&a>l||t===s&&a===l&&u>p}function C(e,i){return!e||!i?!1:Number(e)>Number(i)}function T(e){if(document.getElementById("cinepulse-update-modal"))return;const i=e.downloadUrl||"https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk",r=e.githubDownloadUrl||"https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk",t=document.createElement("div");t.id="cinepulse-update-modal",t.className="cinepulse-modal-overlay",t.style.cssText=`
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: rgba(4, 7, 14, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    animation: fadeInModal 0.25s ease-out;
  `;const a=(e.releaseNotes||"Performans iyileştirmeleri ve hata düzeltmeleri.").split(`
`).filter(Boolean).map(n=>`<li style="margin-bottom: 0.45rem;">${h(n.replace(/^[•\-\*]\s*/,""))}</li>`).join("");t.innerHTML=`
    <div class="cinepulse-update-card" style="
      background: linear-gradient(145deg, rgba(19, 24, 38, 0.98), rgba(13, 17, 26, 0.98));
      border: 1px solid rgba(245, 158, 11, 0.35);
      border-radius: 24px;
      padding: 2.2rem 2rem;
      max-width: 460px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(245, 158, 11, 0.15);
      position: relative;
      text-align: center;
      color: #fff;
    ">
      <!-- Glow Header Icon -->
      <div style="
        width: 64px;
        height: 64px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.1));
        border: 1px solid rgba(245, 158, 11, 0.4);
        margin: 0 auto 1.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #f59e0b;
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.25);
      ">
        <i data-lucide="sparkles" style="width: 30px; height: 30px;"></i>
      </div>

      <div style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.85rem; border-radius: 9999px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); color: #fbbf24; font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.8rem;">
        <span>YENİ GÜNCELLEME MEVCUT</span>
      </div>

      <h2 style="font-size: 1.45rem; font-weight: 800; margin: 0 0 0.5rem; letter-spacing: -0.02em;">
        ${h(e.title||`CinePulse v${e.version}`)}
      </h2>

      <p style="font-size: 0.88rem; color: #94a3b8; margin: 0 0 1.2rem; line-height: 1.5;">
        Daha akıcı oynatıcı ve yeni özellikler içeren resmi CinePulse güncellemesi hazır!
      </p>

      <div style="
        text-align: left;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 14px;
        padding: 1rem 1.2rem;
        margin-bottom: 1.3rem;
        max-height: 140px;
        overflow-y: auto;
      ">
        <div style="font-size: 0.76rem; font-weight: 700; color: #cbd5e1; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.04em;">
          Yenilikler:
        </div>
        <ul style="margin: 0; padding-left: 1.1rem; font-size: 0.84rem; color: #94a3b8; line-height: 1.45;">
          ${a}
        </ul>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 0.65rem;">
        <a id="btn-update-download" href="${i}" download="cinepulse.apk" target="_blank" rel="noopener noreferrer" style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #0b0f19;
          font-weight: 800;
          font-size: 0.95rem;
          padding: 0.85rem 1.6rem;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.35);
          transition: all 0.2s ease;
        ">
          <i data-lucide="download" style="width: 18px; height: 18px; stroke-width: 2.5;"></i>
          <span>Hemen İndir (Güncel APK)</span>
        </a>

        <a id="btn-update-github" href="${r}" target="_blank" rel="noopener noreferrer" style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          font-weight: 600;
          font-size: 0.84rem;
          padding: 0.65rem 1.2rem;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.2s ease;
        ">
          <i data-lucide="external-link" style="width: 15px; height: 15px;"></i>
          <span>GitHub APK (Yedek)</span>
        </a>

        ${e.mandatory?"":`
          <button id="btn-update-later" type="button" style="
            background: transparent;
            border: none;
            color: #64748b;
            font-size: 0.84rem;
            font-weight: 600;
            padding: 0.4rem;
            cursor: pointer;
            transition: color 0.2s ease;
          ">
            Daha Sonra Hatırlat
          </button>
        `}
      </div>

      <div style="margin-top: 1rem; padding: 0.65rem 0.85rem; border-radius: 12px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2); text-align: left; font-size: 0.76rem; color: #fde68a; line-height: 1.4;">
        <div style="font-weight: 700; margin-bottom: 0.2rem; display: flex; align-items: center; gap: 0.35rem; color: #fbbf24;">
          <i data-lucide="info" style="width: 13px; height: 13px;"></i>
          <span>İndirme İpucu</span>
        </div>
        Chrome tarayıcısında <em>"Zararlı dosya olabilir"</em> uyarısı çıkarsa bildirim çubuğunu indirip <strong>"Yine de indir"</strong> butonuna basarak indirmeyi tamamlayabilirsiniz.
      </div>
    </div>
  `,document.body.appendChild(t),y(t);const u=t.querySelector("#btn-update-later");u&&u.addEventListener("click",()=>{t.remove()});const s=n=>{if(m("APK indirmesi başlatılıyor...","info"),g()){if(window.CinePulseNative?.downloadApk)try{window.CinePulseNative.downloadApk(n),m("İndirme bildirimi açıldı. İndirme bitince bildirime dokunup Android kurulum ekranını aç.","success"),t.remove();return}catch{}try{window.open(n,"_system")||(window.location.href=n)}catch{window.location.href=n}}else window.location.assign(n);setTimeout(()=>{try{t.remove()}catch{}},2e3)},l=t.querySelector("#btn-update-download");l&&l.addEventListener("click",n=>{n.preventDefault(),s(i)});const p=t.querySelector("#btn-update-github");p&&p.addEventListener("click",n=>{g()&&(n.preventDefault(),s(r))})}function h(e=""){return String(e).replace(/[&<>'"]/g,i=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[i])}async function N({manual:e=!1}={}){return c||(!e&&Date.now()-o<w?null:(c=_({manual:e}).finally(()=>{c=null}),c))}async function _({manual:e}){try{const i=await fetch(`${k}?_t=${Date.now()}`,{signal:AbortSignal.timeout(6e3),cache:"no-store"});if(!i.ok)throw new Error(`HTTP ${i.status}`);const r=await i.json();if(!r?.version)throw new Error("Sürüm bilgisi eksik");o=Date.now();const t=E(r.version,b),a=C(r.versionCode,v);if(r&&t&&a)return T(r),r;if(e)return m(`✓ CinePulse güncel (v${b})`,"success"),null}catch{return e&&m("Güncelleme sunucusuna erişilemedi.","error"),null}}function S(){if(typeof window>"u"||f)return;f=!0;let e=null,i=0;const r=[0,5e3,15e3,3e4],t=async()=>{if(o&&Date.now()-o<w)return;const a=o;await N({manual:!1}),!o||o===a?i<r.length&&(e=window.setTimeout(t,r[i++])):i=r.length};e=window.setTimeout(t,2500);try{x.addListener("appStateChange",({isActive:a})=>{a&&(e&&window.clearTimeout(e),i=0,e=window.setTimeout(t,1200))})}catch{}document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(e&&window.clearTimeout(e),i=0,e=window.setTimeout(t,1200))})}export{b as CURRENT_APP_VERSION,v as CURRENT_VERSION_CODE,N as checkForAppUpdates,S as initAppUpdater,g as isNativeAndroidApp,T as showUpdateModal};

import{s as d,D as p,r as x}from"./index-C_vjLDiL.js";import{A as h}from"./vendor-capacitor-DGWR5Llo.js";import{p as w}from"./package-r-ky0E_U.js";import{shouldOfferUpdate as v}from"./updatePolicy-CzjE8y1P.js";const k=w.version,C=w.versionCode,E="https://github.com/caca1403/cine-pulse/releases/latest/download/version.json";let s=null,a=0,f=!1;const y=6e4;async function T(){try{const e=window.CinePulseNative?.getInstalledVersion?.();if(e){const t=JSON.parse(e);if(Number(t.versionCode)>0)return t}if(p()){const t=await h.getInfo();return{version:t.version,versionCode:Number(t.build)}}}catch{}return{version:k,versionCode:C}}function _(e){if(document.getElementById("cinepulse-update-modal"))return;const t=e.githubDownloadUrl||e.downloadUrl||"https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk",r=e.githubDownloadUrl||"https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk",i=document.createElement("div");i.id="cinepulse-update-modal",i.className="cinepulse-modal-overlay",i.style.cssText=`
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
  `;const o=(e.releaseNotes||"Performans iyileştirmeleri ve hata düzeltmeleri.").split(`
`).filter(Boolean).map(n=>`<li style="margin-bottom: 0.45rem;">${l(n.replace(/^[•\-\*]\s*/,""))}</li>`).join("");i.innerHTML=`
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
        ${l(e.title||`CinePulse v${e.version}`)}
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
          ${o}
        </ul>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 0.65rem;">
        <a id="btn-update-download" href="${l(t)}" download="cinepulse.apk" target="_blank" rel="noopener noreferrer" style="
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

        <a id="btn-update-github" href="${l(r)}" target="_blank" rel="noopener noreferrer" style="
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
  `,document.body.appendChild(i),x(i);const u=i.querySelector("#btn-update-later");u&&u.addEventListener("click",()=>{i.remove()});const m=n=>{if(d("APK indirmesi başlatılıyor...","info"),p()){if(window.CinePulseNative?.downloadApk)try{window.CinePulseNative.downloadApk(n),d("İndirme bildirimi açıldı. İndirme bitince bildirime dokunup Android kurulum ekranını aç.","success"),i.remove();return}catch{}try{window.open(n,"_system")||(window.location.href=n)}catch{window.location.href=n}}else window.location.assign(n);setTimeout(()=>{try{i.remove()}catch{}},2e3)},g=i.querySelector("#btn-update-download");g&&g.addEventListener("click",n=>{n.preventDefault(),m(t)});const b=i.querySelector("#btn-update-github");b&&b.addEventListener("click",n=>{p()&&(n.preventDefault(),m(r))})}function l(e=""){return String(e).replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t])}async function A({manual:e=!1}={}){return s||(!e&&Date.now()-a<y?null:(s=N({manual:e}).finally(()=>{s=null}),s))}async function N({manual:e}){try{const t=await fetch(`${E}?_t=${Date.now()}`,{signal:AbortSignal.timeout(6e3),cache:"no-store"});if(!t.ok)throw new Error(`HTTP ${t.status}`);const r=await t.json();if(!r?.version)throw new Error("Sürüm bilgisi eksik");a=Date.now();const i=await T();if(v(r,i))return _(r),r;if(e)return d(`✓ CinePulse güncel (v${i.version})`,"success"),null}catch{return e&&d("Güncelleme sunucusuna erişilemedi.","error"),null}}function U(){if(typeof window>"u"||f)return;f=!0;let e=null,t=0;const r=[0,5e3,15e3,3e4],i=async()=>{if(a&&Date.now()-a<y)return;const o=a;await A({manual:!1}),!a||a===o?t<r.length&&(e=window.setTimeout(i,r[t++])):t=r.length};e=window.setTimeout(i,2500);try{h.addListener("appStateChange",({isActive:o})=>{o&&(e&&window.clearTimeout(e),t=0,e=window.setTimeout(i,1200))})}catch{}document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&(e&&window.clearTimeout(e),t=0,e=window.setTimeout(i,1200))})}export{k as CURRENT_APP_VERSION,C as CURRENT_VERSION_CODE,A as checkForAppUpdates,U as initAppUpdater,T as installedAppVersion,p as isNativeAndroidApp,_ as showUpdateModal};

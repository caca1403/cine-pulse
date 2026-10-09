import{s as t}from"./index-BhQWUMv-.js";import"./vendor-capacitor-VGCIBgSg.js";let n=null,i=!1;function d(){return window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0||document.referrer.includes("android-app://")}function p(){if(d()){i=!0,s(!1);return}window.addEventListener("beforeinstallprompt",a=>{a.preventDefault(),n=a,s(!0)}),window.addEventListener("appinstalled",()=>{n=null,i=!0,s(!1),t("CinePulse başarıyla cihazınıza yüklendi!","success")}),window.matchMedia("(display-mode: standalone)").addEventListener("change",a=>{a.matches&&(i=!0,s(!1))}),/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream&&!d()&&setTimeout(()=>{s(!0)},1e3)}function s(e){document.querySelectorAll(".btn-pwa-install").forEach(l=>{e&&!i&&!d()?l.classList.remove("hidden"):l.classList.add("hidden")})}async function m(){if(d()||i){t("CinePulse zaten bir uygulama olarak yüklü.","info");return}if(n){try{n.prompt(),(await n.userChoice).outcome==="accepted"?t("Yükleme başlatıldı...","success"):t("Yükleme iptal edildi.","info"),n=null}catch{}return}/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream?o():r()}function o(){let e=document.getElementById("pwa-ios-modal");e||(e=document.createElement("div"),e.id="pwa-ios-modal",e.className="modal-backdrop pwa-guide-modal",e.innerHTML=`
      <div class="modal-content glass-panel pwa-guide-content">
        <div class="pwa-guide-header">
          <div class="pwa-guide-logo">
            <img src="/icon-192.png" alt="CinePulse" width="48" height="48" style="border-radius: 12px;" />
            <div>
              <h3>CinePulse'ı Yükle</h3>
              <p>iPhone / iPad Ana Ekranınıza Ekleyin</p>
            </div>
          </div>
          <button class="btn-icon pwa-close-btn">&times;</button>
        </div>
        <div class="pwa-guide-steps">
          <div class="pwa-step">
            <span class="step-num">1</span>
            <span>Safari'nin alt menüsündeki <strong>Paylaş</strong> (kare içinden yukarı ok) simgesine dokunun.</span>
          </div>
          <div class="pwa-step">
            <span class="step-num">2</span>
            <span>Açılan menüyü aşağı kaydırıp <strong>"Ana Ekrana Ekle"</strong> seçeneğini seçin.</span>
          </div>
          <div class="pwa-step">
            <span class="step-num">3</span>
            <span>Sağ üstteki <strong>"Ekle"</strong> butonuna dokunarak kurulumu tamamlayın.</span>
          </div>
        </div>
        <button class="btn-primary pwa-done-btn" style="width: 100%; margin-top: 16px;">Anladım</button>
      </div>
    `,document.body.appendChild(e),e.querySelector(".pwa-close-btn").addEventListener("click",()=>{e.classList.add("hidden")}),e.querySelector(".pwa-done-btn").addEventListener("click",()=>{e.classList.add("hidden")}),e.addEventListener("click",a=>{a.target===e&&e.classList.add("hidden")})),e.classList.remove("hidden")}function r(){t('Tarayıcınızın adres çubuğundaki "Yükle / Uygulamayı Yükle" simgesine tıklayarak indirebilirsiniz.',"info",5e3)}export{p as initPwa,d as isPwaMode,m as promptInstall,s as updatePwaButtons};

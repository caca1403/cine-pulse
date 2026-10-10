import { renderIcons } from '../services/icons.js';
import { renderSiteLogo } from '../components/BrandLogo.js';
import { getReleaseInfo } from '../services/releaseManifests.js';
import pkg from '../../package.json';
import '../styles/showcase.css';

const RELEASES = 'https://github.com/caca1403/cine-pulse/releases';
const base = import.meta.env.BASE_URL;
const icon = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
const enter = (label = 'Siteye Gir', extra = '') => `<a class="cp-landing-button cp-landing-primary ${extra}" href="#home">${label}${icon('arrow-up-right')}</a>`;

const benefits = [
  ['compass', 'İzleyecek bir şey bul.', 'Film, dizi, anime ve farklı kategoriler. Arama, yapım detayları ve önerilerle bir sonraki hikâyene karar ver.'],
  ['bookmark', 'Kendi arşivini oluştur.', 'Favorilerini ve izleme listeni tek yerde tut. Bitirdiğin yapımları, sıradaki bölümleri ve yarım kalanları takip et.'],
  ['history', 'Yarım kalan yerden devam et.', 'İzleme ilerlemen bu cihazda saklanır. Geri geldiğinde hangi bölümde veya dakikada kaldığını yeniden arama.'],
  ['sliders-horizontal', 'Deneyimini kendin seç.', 'Dublaj ve altyazılı seçenekleri ayrı gör. Mevcut alternatifler arasında geçiş yap; destekleyen yayınlarda ses, hız ve altyazıyı ayarla.']
];
const comparison = [
  ['Keşif, arama ve yapım detayları', 'Var', 'Var', 'Var'],
  ['Listeler ve izleme ilerlemesi', 'Var', 'Var', 'Var'],
  ['Film / dizi oynatma', 'Kaynağa bağlı', 'Kaynağa bağlı', 'Kaynağa bağlı'],
  ['Canlı TV ve yayın akışı', 'Yok', 'Var', 'Var'],
  ['İndirme ve çevrimdışı kütüphane', 'Yok', 'Yok', 'Desteklenen içeriklerde'],
  ['Uygulama içi gerçek tarayıcıyla doğrulama', 'Yok', 'Destekli yayınlarda', 'Kaynağa bağlı'],
  ['JSON yedekleme ve aktarım', 'Var', 'Var', 'Var']
];
const faqs = [
  ['Siteye girmek için uygulama indirmem gerekiyor mu?', 'Hayır. “Siteye Gir” ile normal CinePulse ekranına geçebilirsin. Keşif, arama, içerik detayları ve listeler tarayıcıda kullanılabilir. Uygulama, ek platform özellikleri isteyenler için bir seçenek.'],
  ['Web sürümünde tam olarak ne eksik?', 'Canlı TV, Android’in indirme / çevrimdışı kütüphanesi ve masaüstündeki gerçek dahili tarayıcıyla doğrulama webde bulunmuyor. Bazı yayınlar da tarayıcının bağlantı ve yerleştirme kuralları nedeniyle açılamayabilir. Webde oynatma seçilen kaynağa bağlıdır.'],
  ['Uygulamada bütün yayınlar kesin çalışıyor mu?', 'Hayır. Masaüstünün yerel medya desteği ve doğrulama alanı bazı bağlantılarda ek imkân sağlar; yine de yayın kaldırılmış, erişime kapalı veya geçici olarak bozuk olabilir. Böyle bir durumda başka bir alternatifi dene.'],
  ['Hesap açmam veya giriş yapmam şart mı?', 'Temel kullanıma hesap açmadan başlayabilirsin. Kişisel profil bu cihazdaki deneyimini düzenler. Trakt bağlantısı ise izleme geçmişi ve listelerini senkronize etmek istediğinde kullanabileceğin isteğe bağlı bir özellik.'],
  ['Listelerim başka cihazda da görünür mü?', 'Yerel listelerin ve ilerlemen kullandığın tarayıcı / cihazda saklanır; kendiliğinden bütün cihazlara taşınmaz. Profildeki JSON yedekleme ve içe aktarma seçeneklerini kullanabilirsin. Trakt bağlantısı desteklediği veriler için ayrı bir senkronizasyon seçeneğidir.'],
  ['Android, EXE, DEB ve AppImage arasından hangisini seçmeliyim?', 'Android telefon veya tablet için APK; Windows için EXE; Debian / Ubuntu tabanlı Linux için DEB; diğer uygun Linux sistemleri için AppImage seç. Mac için bu sürümde bir masaüstü kurulum paketi sunulmuyor; web sürümünü kullanabilirsin.'],
  ['Yeni sürümü nasıl alırım?', 'Tüm kurulum dosyaları resmî GitHub Releases sayfasında yayımlanır. Masaüstündeki güncelleme simgesi bu sayfayı açar; daha yeni sürüm kodu yayımlandığında otomatik denetim de devreye girer. Android APK aynı kalıcı anahtarla imzalanır. Aynı sürüm numarasıyla yenilenen dosyayı yeniden indirip kurman gerekir.'],
  ['Bir yayın açılmadığında ne yapmalıyım?', 'Önce aynı dildeki başka bir yayın seçeneğini dene ve internet bağlantını kontrol et. Webde takılıyorsa platformuna uygun uygulamayı deneyebilirsin. Doğrulama isteyen destekli masaüstü yayınlarında onayı kendin tamamla; bozuk veya kaldırılmış yayınlar için diğer alternatiflere geç.']
];

export function renderShowcaseView() {
  // Derleme-anlik yedek: canli manifest gelene kadar gosterilir.
  // init() calisinca her kart kendi platform manifestinden dogru surume
  // gecer; tek bump butun kartlari ayni surume tasimaz.
  const release = `${RELEASES}/download/v${pkg.version}`;
  const packages = [
    ['monitor', 'Windows', 'EXE kurulum sihirbazı', `${release}/CinePulse-Setup-${pkg.version}.exe`, 'EXE İndir', 'windows'],
    ['smartphone', 'Android', 'Telefon ve tablet için APK', `${RELEASES}/latest/download/cinepulse.apk`, 'APK İndir', 'android'],
    ['package', 'Linux · DEB', 'Debian / Ubuntu tabanlı sistemler', `${release}/CinePulse-${pkg.version}.deb`, 'DEB İndir', 'deb'],
    ['terminal', 'Linux · AppImage', 'Çalıştırma izni ver, uygulamayı aç', `${release}/CinePulse-${pkg.version}.AppImage`, 'AppImage İndir', 'appimage']
  ];
  return {
    html: `<div class="cp-landing">
      <header class="cp-landing-nav">
        <a class="cp-landing-brand" href="#showcase" aria-label="CinePulse tanıtım">${renderSiteLogo('cp-landing-logo')}<span>Cine<span>Pulse</span></span></a>
        <nav aria-label="Tanıtım bölümleri"><button data-landing-section="landing-features">Özellikler</button><button data-landing-section="landing-compare">Web mi, uygulama mı?</button><button data-landing-section="landing-faq">Sık Sorulanlar</button></nav>
        ${enter('Siteye Gir', 'cp-landing-nav-enter')}
      </header>
      <main>
        <section class="cp-landing-hero cp-landing-shell" aria-labelledby="landing-title">
          <div class="cp-landing-hero-copy">
            <a class="cp-landing-version" href="${RELEASES}" target="_blank" rel="noopener noreferrer"><span></span>CINEPULSE STUDIO <b>v${pkg.version}</b>${icon('arrow-up-right')}</a>
            <h1 id="landing-title">Bir sonraki<br>hikâyen.<br><em>Senin ekranın.</em></h1>
            <p class="cp-landing-lead">Film, dizi ve anime keşfinden kişisel kütüphanene.<br class="cp-landing-desktop-break"> Ne izleyeceğini bul, deneyimini kendin seç.</p>
            <div class="cp-landing-actions">${enter()}<button class="cp-landing-button cp-landing-secondary" data-landing-section="landing-downloads">${icon('download')}Uygulamayı İndir</button></div>
            <div class="cp-landing-hero-note">${icon('globe')}Tarayıcıda hemen başla. Uygulama indirmek zorunda değilsin.</div>
          </div>
          <div class="cp-landing-preview" aria-label="CinePulse keşif ve oynatıcı arayüzünü temsil eden tanıtım görseli">
            <div class="cp-landing-preview-top"><span class="cp-landing-window-dots"><i></i><i></i><i></i></span><span>CINEPULSE / KEŞİF</span>${icon('maximize-2')}</div>
            <div class="cp-landing-preview-scene"><img src="${base}images/discovery/movies.webp" alt="Sinema keşfi" fetchpriority="high"><span class="cp-landing-preview-tag">Sıradaki hikâyen</span><span class="cp-landing-preview-play">${icon('play')}</span><div class="cp-landing-preview-caption"><small>KEŞFET · SEÇ · DEVAM ET</small><strong>İzlemenin kendi ritmi var.</strong></div></div>
            <div class="cp-landing-preview-library"><span>Kaldığın yerden</span><span>Kütüphanem ${icon('arrow-right')}</span></div>
            <div class="cp-landing-preview-cards">${[['series','Diziler'],['anime','Anime'],['documentary','Belgeseller']].map(([file,label],i)=>`<div><img src="${base}images/discovery/${file}.webp" alt="" loading="lazy"><span>${label}</span><i style="--progress:${[67,35,82][i]}%"></i></div>`).join('')}</div>
            <div class="cp-landing-source-chip">${icon('layers')}Birden fazla seçenek.<strong>Tek oynatıcı.</strong></div>
          </div>
        </section>
        <div class="cp-landing-platforms cp-landing-shell"><span>NEREDEN İSTERSEN</span><p>${icon('globe')}Web</p><p>${icon('monitor')}Windows</p><p>${icon('terminal')}Linux</p><p>${icon('smartphone')}Android</p></div>
        <section id="landing-features" class="cp-landing-section cp-landing-shell" aria-labelledby="landing-features-title">
          <div class="cp-landing-section-heading"><span class="cp-landing-eyebrow">DENEYİMİN SONUCU</span><h2 id="landing-features-title">Daha az arayış.<br><span>Daha çok kendi listen.</span></h2><p>Sadece bir oynatıcı değil. Ne keşfettiğini, ne izlediğini ve sırada ne olduğunu bir arada tutan bir alan.</p></div>
          <div class="cp-landing-benefits">${benefits.map(([symbol,title,text],i)=>`<article class="cp-landing-benefit"><div>${icon(symbol)}<span>0${i+1}</span></div><h3>${title}</h3><p>${text}</p></article>`).join('')}</div>
        </section>
        <section id="landing-compare" class="cp-landing-section cp-landing-shell" aria-labelledby="landing-compare-title">
          <div class="cp-landing-compare-intro"><div><span class="cp-landing-eyebrow">AYNI CINEPULSE, FARKLI İMKÂNLAR</span><h2 id="landing-compare-title">Webde ne var?<br><span>Uygulamada ne açılıyor?</span></h2></div><p>Tarayıcı hızlı bir başlangıç sunar. Canlı TV, çevrimdışı izleme veya ek oynatma uyumluluğu istiyorsan ihtiyacına uygun uygulamayı seç.</p></div>
          <div class="cp-landing-table-wrap" tabindex="0" role="region" aria-label="Web ve uygulama özellik karşılaştırması"><table class="cp-landing-compare-table"><caption class="cp-landing-sr-only">CinePulse platform özellikleri</caption><thead><tr><th scope="col">Özellik</th><th scope="col">Web<span>Kurulumsuz</span></th><th scope="col">Masaüstü<span>Windows / Linux</span></th><th scope="col">Android<span>Telefon / Tablet</span></th></tr></thead><tbody>${comparison.map(([feature,...values])=>`<tr><th scope="row">${feature}</th>${values.map(value=>`<td><span class="cp-landing-status ${value==='Var'?'is-available':value==='Yok'?'is-unavailable':'is-conditional'}">${icon(value==='Var'?'check':value==='Yok'?'minus':'circle-dot')}${value}</span></td>`).join('')}</tr>`).join('')}</tbody></table></div>
          <div class="cp-landing-web-note">${icon('info')}<p><strong>Webde oynatma neden farklı?</strong> Bazı yayınlar tarayıcının bağlantı veya yerleştirme kurallarına takılabilir. Uygulama daha fazla imkân sunar; her bağlantının çalışacağını garanti etmez. Kullanılabilen yayınlar ve kontroller seçilen kaynağa göre değişir.</p></div>
        </section>
        <section class="cp-landing-start cp-landing-shell" aria-labelledby="landing-start-title"><div><span class="cp-landing-eyebrow">ÜÇ ADIM, KENDİ AKIŞIN</span><h2 id="landing-start-title">Hazırlık yok.<br><span>Keşifle başla.</span></h2>${enter('İçeriklere Git')}</div><ol><li><span>01</span><div><h3>İlgini çekeni bul.</h3><p>Ana sayfadan, aramadan veya kategorilerden ilerle. Diziyse sezon ve bölümünü seç.</p></div></li><li><span>02</span><div><h3>Dilini ve yayınını seç.</h3><p>Dublaj / altyazılı seçenekleri gör. Açılmayan bir bağlantıda diğer alternatife geç.</p></div></li><li><span>03</span><div><h3>Listene ekle, geri dön.</h3><p>Beğendiklerini sakla. Ara verdiğinde kütüphanenden kaldığın yere dön.</p></div></li></ol></section>
        <section class="cp-landing-release cp-landing-shell" aria-labelledby="landing-release-title"><div><span class="cp-landing-eyebrow">v${pkg.version} · BU SÜRÜMÜN ODAĞI</span><h2 id="landing-release-title">Ayrıntılar düzeldi.<br><span>Akış sadeleşti.</span></h2><a href="${RELEASES}" target="_blank" rel="noopener noreferrer">Sürüm notlarını gör ${icon('arrow-up-right')}</a></div><ul><li>${icon('timer')}<div><strong>Daha kontrollü bekleme</strong><p>Kaynak isteklerinde süre sınırları, başarısız yüklemelerde yeniden deneme ve daha açıklayıcı hata dönüşleri.</p></div></li><li>${icon('panel-right')}<div><strong>Daha sade yayın menüsü</strong><p>Tekrarlanan dil ve kalite etiketleri kaldırıldı. Masaüstü yan panelindeki kesilen kaynak listesi düzeltildi.</p></div></li><li>${icon('download')}<div><strong>Güncellemeler tek yerde</strong><p>Windows, Linux ve Android paketleri doğrudan Releases'te. Android sürümleri aynı kalıcı anahtarla imzalanıyor.</p></div></li></ul></section>
        <section id="landing-downloads" class="cp-landing-section cp-landing-shell" aria-labelledby="landing-downloads-title"><div class="cp-landing-section-heading"><span class="cp-landing-eyebrow">DAHA FAZLASINI İSTEYENLERE</span><h2 id="landing-downloads-title">CinePulse'u<br><span>ekranına taşı.</span></h2><p>İşletim sistemine uygun dosyayı seç. Kurulum paketleri resmî GitHub Releases üzerinden doğrudan indirilir; ZIP açman gerekmez.</p></div><div class="cp-landing-downloads">${packages.map(([symbol,title,detail,url,label,platform])=>`<article data-platform-download="${platform}">${icon(symbol)}<h3>${title} <small class="cp-landing-pkgver" data-pkgver></small></h3><p>${detail}</p><a class="cp-landing-button cp-landing-secondary" href="${url}" target="_blank" rel="noopener noreferrer" data-pkgurl>${label}${icon('arrow-down-to-line')}</a></article>`).join('')}</div><div class="cp-landing-download-footer"><span>Platform sürümleri yukarıdaki kartlarda · Android için kalıcı release imzası</span><a href="${RELEASES}" target="_blank" rel="noopener noreferrer">Sürüm notları ve tüm dosyalar ${icon('arrow-up-right')}</a></div></section>
        <section id="landing-faq" class="cp-landing-section cp-landing-shell cp-landing-faq" aria-labelledby="landing-faq-title"><div><span class="cp-landing-eyebrow">AKLINDA KALMASIN</span><h2 id="landing-faq-title">Sık sorulan<br><span>sorular.</span></h2><p>Başlamadan önce neyin nerede çalıştığını bil.</p></div><div class="cp-landing-questions">${faqs.map(([question,answer])=>`<details><summary>${question}${icon('plus')}</summary><p>${answer}</p></details>`).join('')}</div></section>
        <section class="cp-landing-final cp-landing-shell"><span class="cp-landing-eyebrow">ŞİMDİ SIRA SENDE</span><h2>Bu akşamın hikâyesini<br><span>birlikte bulalım.</span></h2><p>Tanıtımı geç, normal CinePulse ekranında keşfe başla.</p>${enter('Siteye Gir ve Keşfet')}<a href="${RELEASES}" target="_blank" rel="noopener noreferrer">Önce uygulamaları görmek istiyorum ${icon('arrow-right')}</a></section>
      </main>
      <footer class="cp-landing-footer cp-landing-shell"><a class="cp-landing-brand" href="#showcase">${renderSiteLogo('cp-landing-logo')}<span>Cine<span>Pulse</span></span></a><span>Senin ekranın. Senin akışın.</span><a href="${RELEASES}" target="_blank" rel="noopener noreferrer">GitHub Releases ${icon('arrow-up-right')}</a></footer>
    </div>`,
    init(container) {
      container.querySelectorAll('[data-landing-section]').forEach(button => {
        button.addEventListener('click', () => container.querySelector(`#${button.dataset.landingSection}`)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }));
      });
      // Canli surumler: her platform kendi manifestinden (APK yukselince
      // masaustu kartlari etkilenmez).
      getReleaseInfo({
        version: pkg.version, versionCode: pkg.versionCode,
        apkUrl: `${RELEASES}/latest/download/cinepulse.apk`,
        desktopVersion: pkg.version, desktopVersionCode: pkg.versionCode,
        windowsUrl: '', debUrl: '', appImageUrl: ''
      }).then((info) => {
        if (!container.isConnected) return;
        const set = (platform, url, ver) => {
          const card = container.querySelector(`[data-platform-download="${platform}"]`);
          if (!card) return;
          const link = card.querySelector('[data-pkgurl]');
          const tag = card.querySelector('[data-pkgver]');
          if (link && url) link.href = url;
          if (tag && ver) tag.textContent = `v${ver}`;
        };
        set('android', info.apk.url, info.apk.version);
        set('windows', info.desktop.windows, info.desktop.version);
        set('deb', info.desktop.deb, info.desktop.version);
        set('appimage', info.desktop.appImage, info.desktop.version);
      }).catch(() => {});
      try {
        if (sessionStorage.getItem('cp_livetv_web_block') === '1') {
          sessionStorage.removeItem('cp_livetv_web_block');
          const note = document.createElement('p');
          note.className = 'cp-landing-live-notice';
          note.textContent = 'Canlı TV, masaüstü ve Android uygulamasında kullanılabilir. Aşağıdan platformunu seçebilirsin.';
          container.querySelector('.cp-landing-hero-copy').append(note);
        }
      } catch (_) {}
      renderIcons(container);
    }
  };
}

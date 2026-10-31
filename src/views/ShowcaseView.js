import { renderIcons } from '../services/kabuk/icons.js';
import { renderSiteLogo } from '../components/BrandLogo.js';
import { getReleaseInfo } from '../services/kabuk/releaseManifests.js';
import pkg from '../../package.json';
import '../styles/showcase.css';

const RELEASES = 'https://github.com/caca1403/cine-pulse/releases';
const base = import.meta.env.BASE_URL;
const icon = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
const enter = () => '';
// Hero scroll-parallax rAF handle'lari; route'a her donusun birikmeyi
// onlemek icin eski scroll duyrucusu burada degisir (init yeniden kosar).
let heroScrollFx = null;
let heroScrollRaf = 0;

const benefits = [
  ['compass', 'İzleyecek bir şey bul.', 'Film, dizi, anime ve kısa diziler. Doğal dil arama ("2020 sonrası aksiyon"), tür/oyuncu/yönetmen filtreleme ve yapım detaylarıyla bir sonraki hikâyene karar ver.'],
  ['sparkles', 'Kişisel öneri motoru.', 'BPR + lojistik sıralayıcı + birlikte izlenme analizi. Zevk profiline göre sıralanan öneriler; favori, liste ve bitirme sinyallerinden öğrenir.'],
  ['users', 'Birlikte izleme kararı ver.', 'Karar Odası ile arkadaşlarınla P2P oylama yap. Sessiz oylama modu, ortak sonuç listesi ve "Herkes izlemek istiyor!" eşleşmesi.'],
  ['bookmark', 'Kendi arşivini oluştur.', 'Favorilerini ve izleme listeni tek yerde tut. Bitirdiğin yapımları, sıradaki bölümleri ve yarım kalanları takip et.'],
  ['history', 'Yarım kalan yerden devam et.', 'İzleme ilerlemen bu cihazda saklanır. Geri geldiğinde hangi bölümde veya dakikada kaldığını yeniden arama.'],
  ['shield-check', 'Spoilersız keşfet.', 'İlerleme sınırının ötesindeki bölüm başlıkları, görselleri ve özetleri otomatik gizlenir. Recap kartı sadece gerçekten izlediğin bölümler için açılır.'],
  ['monitor-play', 'Sahne modu & saf sinema.', 'Tam ekran sinema sahnesi, hover önizleme, kalite çipleri ve oyuncu kadrosu keşfi. Masaüstünde imleçle kart üzerinde önizleme.'],
  ['sliders-horizontal', 'Deneyimini kendin seç.', 'Dublaj ve altyazılı seçenekleri ayrı gör. Çoklu kaynak alternatifleri arasında geçiş yap; destekleyen yayınlarda ses, hız ve altyazıyı ayarla.'],
  ['baby', 'Çocuk modu.', 'PIN korumalı çocuk profili, yaş kademesi filtreleri ve güvenli içerik seçimi. Aile için ayrı bir deneyim.'],
  ['download', 'İndir & çevrimdışı izle.', 'Desteklenen içerikleri cihazına indir, internet olmadan izle. Çevrimdışı kütüphane ile her yerde erişim.'],
  ['plug', 'Eklenti ekosistemi.', 'Stremio, Nuvio ve CloudStream eklenti depolarını CinePulse\'a bağla. Yerel kahraman motorla birlikte çoklu kaynak desteği.'],
  ['zap', 'P2P torrent & debrid.', 'Yerel libtorrent motoru (Android) ve Real-Debrid entegrasyonu ile doğrudan magnet bağlantısı oynatma.']
];
const comparison = [
  ['Keşif, arama ve yapım detayları', 'Var', 'Var'],
  ['Doğal dil arama ("2020 sonrası aksiyon")', 'Var', 'Var'],
  ['Kişisel ML öneri motoru (BPR + CF)', 'Var', 'Var'],
  ['Listeler ve izleme ilerlemesi', 'Var', 'Var'],
  ['Film / dizi / anime / kısa dizi oynatma', 'Kaynağa bağlı', 'Kaynağa bağlı'],
  ['Kısa dizi kaynağı (çoklu kahraman hat)', 'Var', 'Var'],
  ['Karar Odası — birlikte izleme oylaması', 'Var', 'Var'],
  ['Trakt.tv senkronizasyonu', 'Var', 'Var'],
  ['AniList senkronizasyonu', 'Var', 'Var'],
  ['Spoilersız keşfet & recap kartı', 'Var', 'Var'],
  ['Hover önizleme (masaüstü imleç)', 'Var', '—'],
  ['Çocuk modu (PIN + yaş kademesi)', 'Var', 'Var'],
  ['Sahne modu & saf sinema oynatıcı', 'Var', 'Var'],
  ['Çoklu kaynak alternatifleri (dublaj/altyazı)', 'Var', 'Var'],
  ['Kalite çipleri (1080p / 4K / HDR)', 'Var', 'Var'],
  ['P2P torrent oynatma (yerel libtorrent)', '—', 'Var'],
  ['Real-Debrid entegrasyonu', 'Var', 'Var'],
  ['Eklenti sistemi (Stremio / Nuvio / CloudStream)', 'Var', 'Var'],
  ['İndirme ve çevrimdışı kütüphane', 'Desteklenen içeriklerde', 'Desteklenen içeriklerde'],
  ['Canlı TV ve yayın akışı (EPG)', 'Geçici olarak kapalı', 'Geçici olarak kapalı'],
  ['Uygulama içi gerçek tarayıcıyla doğrulama', 'Destekli yayınlarda', 'Kaynağa bağlı'],
  ['JSON yedekleme ve aktarım', 'Var', 'Var'],
  ['Otomatik güncelleme kontrolü', 'Var', 'Var']
];
const faqs = [
  ['Siteye girmek için uygulama indirmem gerekiyor mu?', 'Bu site tanıtım ve indirme merkezidir; oynatma ve keşif uygulamada çalışır. Windows, Linux veya Android paketlerinden birini kurman yeterli.'],
  ['Web sürümünde tam olarak ne eksik?', 'Web artık oynatma sunmuyor — kaynak taraması tarayıcı kurallarına takıldığı için tamamen uygulamaya taşındı. Siteden paketleri indirip kurabilirsin.'],
  ['Uygulamada bütün yayınlar kesin çalışıyor mu?', 'Hayır. Masaüstünün yerel medya desteği ve doğrulama alanı bazı bağlantılarda ek imkân sağlar; yine de yayın kaldırılmış, erişime kapalı veya geçici olarak bozuk olabilir. Böyle bir durumda başka bir alternatifi dene.'],
  ['Hesap açmam veya giriş yapmam şart mı?', 'Temel kullanıma hesap açmadan başlayabilirsin. Kişisel profil bu cihazdaki deneyimini düzenler. Trakt bağlantısı ise izleme geçmişi ve listelerini senkronize etmek istediğinde kullanabileceğin isteğe bağlı bir özellik.'],
  ['Listelerim başka cihazda da görünür mü?', 'Yerel listelerin ve ilerlemen kullandığın tarayıcı / cihazda saklanır; kendiliğinden bütün cihazlara taşınmaz. Profildeki JSON yedekleme ve içe aktarma seçeneklerini kullanabilirsin. Trakt bağlantısı desteklediği veriler için ayrı bir senkronizasyon seçeneğidir.'],
  ['Android, EXE, DEB ve Flatpak arasından hangisini seçmeliyim?', 'Android telefon veya tablet için APK; Windows için EXE; Debian / Ubuntu tabanlı Linux için DEB; Flatpak destekli dağıtımlar (Fedora, elementaryOS vb.) için Flatpak seç. Mac için bu sürümde bir masaüstü kurulum paketi sunulmuyor; web sürümünü kullanabilirsin.'],
  ['Yeni sürümü nasıl alırım?', 'Tüm kurulum dosyaları resmî GitHub Releases sayfasında yayımlanır. Masaüstündeki güncelleme simgesi bu sayfayı açar; daha yeni sürüm kodu yayımlandığında otomatik denetim de devreye girer. Android APK aynı kalıcı anahtarla imzalanır. Aynı sürüm numarasıyla yenilenen dosyayı yeniden indirip kurman gerekir.'],
  ['Bir yayın açılmadığında ne yapmalıyım?', 'Önce aynı dildeki başka bir yayın seçeneğini dene ve internet bağlantını kontrol et. Webde takılıyorsa platformuna uygun uygulamayı deneyebilirsin. Doğrulama isteyen destekli masaüstü yayınlarında onayı kendin tamamla; bozuk veya kaldırılmış yayınlar için diğer alternatiflere geç.']
];

export function renderShowcaseView() {
  // Derleme-anlik yedek: canli manifest gelene kadar gosterilir.
  // init() calisinca her kart kendi platform manifestinden dogru surume
  // gecer; tek bump butun kartlari ayni surume tasimaz.
  // Butonlar surum adi tasimaz — GitHub "latest" varliklarina dogrudan iner
  // ve yeni surum cikinca ayni baglar guncel kalir.
  const son = `${RELEASES}/latest/download`;
  const packages = [
    ['monitor', 'Windows', 'EXE kurulum sihirbazı', `${son}/CinePulse-Setup.exe`, 'EXE İndir', 'windows'],
    ['smartphone', 'Android', 'Telefon ve tablet için APK', `${son}/cinepulse.apk`, 'APK İndir', 'android'],
    ['package', 'Linux · DEB', 'Debian / Ubuntu tabanlı sistemler', `${son}/CinePulse.deb`, 'DEB İndir', 'deb'],
    ['layers', 'Linux · Flatpak', 'Flatpak destekli dağıtımlar (Fedora, elementaryOS vb.)', `${son}/CinePulse.flatpak`, 'Flatpak İndir', 'flatpak']
  ];
  return {
    html: `<div class="cp-landing">
      <header class="cp-landing-nav">
        <a class="cp-landing-brand" href="#showcase" aria-label="CinePulse tanıtım">${renderSiteLogo('cp-landing-logo')}<span>Cine<span>Pulse</span></span></a>
        <nav aria-label="Tanıtım bölümleri"><button data-landing-section="landing-downloads">İndir</button><button data-landing-section="landing-gallery">Arayüz Resimleri</button><button data-landing-section="landing-features">Özellikler</button><button data-landing-section="landing-compare">Masaüstü mü, Android mi?</button><button data-landing-section="landing-license">Lisans</button><button data-landing-section="landing-faq">SSS</button></nav>
      </header>
      <main>
        <section class="cp-landing-hero cp-landing-shell" aria-labelledby="landing-title">
          <div class="cp-landing-hero-copy">
            <a class="cp-landing-version" href="${RELEASES}" target="_blank" rel="noopener noreferrer"><span></span>CINEPULSE STUDIO <b>v${pkg.version}</b>${icon('arrow-up-right')}</a>
            <h1 id="landing-title">Uygulaman<br>hazır.<br><em>İndir, kur, izle.</em></h1>
            <p class="cp-landing-lead">CinePulse resmi tanıtım, galeri ve indirme merkezi.<br class="cp-landing-desktop-break"> Film, dizi, anime ve kısa dizi keşfi, kişisel öneri motoru, birlikte izleme, saf sinema sahnesi ve indirme — hepsi uygulamada.</p>
            <div class="cp-landing-actions"><button class="cp-landing-button" data-landing-section="landing-downloads">${icon('download')}Paketleri İndir</button><button class="cp-landing-button cp-landing-secondary" data-landing-section="landing-gallery">${icon('image')}Arayüzü Gör</button></div>
            <div class="cp-landing-hero-note">${icon('shield-check')}Android APK her sürümde aynı kalıcı anahtarla imzalanır — üzerine güncelleme verilerini silmez.</div>
          </div>
          <div class="cp-landing-preview" aria-label="CinePulse keşif ve oynatıcı arayüzünü temsil eden tanıtım görseli">
            <div class="cp-landing-preview-top"><span class="cp-landing-window-dots"><i></i><i></i><i></i></span><span>CINEPULSE / KEŞİF</span>${icon('maximize-2')}</div>
            <div class="cp-landing-preview-scene"><img src="${base}images/discovery/cover.svg" alt="Sinema ve dizi keşfi" fetchpriority="high"><span class="cp-landing-preview-tag">v${pkg.version} Hazır</span><span class="cp-landing-preview-play">${icon('play')}</span><div class="cp-landing-preview-caption"><small>KEŞFET · SEÇ · DEVAM ET</small><strong>İzlemenin kendi ritmi var.</strong></div></div>
            <div class="cp-landing-preview-library"><span>Kaldığın yerden</span><span>Kütüphanem ${icon('arrow-right')}</span></div>
            <div class="cp-landing-preview-cards">${[['series','Diziler'],['anime','Anime'],['documentary','Belgeseller']].map(([file,label],i)=>`<div><img src="${base}images/discovery/${file}.webp" alt="" loading="lazy"><span>${label}</span><i style="--progress:${[67,35,82][i]}%"></i></div>`).join('')}</div>
            <div class="cp-landing-source-chip">${icon('layers')}Birden fazla seçenek.<strong>Tek oynatıcı.</strong></div>
          </div>
          <div class="cp-landing-hero-stack" aria-hidden="true">${['cartoons', 'dramas', 'series'].map((n, i) => `<i class="cp-landing-stack-${i + 1}" style="--z:${[-60, -30, 0][i]}px"><img src="${base}images/discovery/${n}.webp" alt=""></i>`).join('')}</div>
        </section>
        <div class="cp-landing-platforms cp-landing-shell"><span>DESTEKLENEN PLATFORMLAR</span><p>${icon('monitor')}Windows</p><p>${icon('terminal')}Linux</p><p>${icon('smartphone')}Android</p></div>
        <section id="landing-downloads" class="cp-landing-section cp-landing-shell" aria-labelledby="landing-downloads-title"><div class="cp-landing-section-heading"><span class="cp-landing-eyebrow">PAKETLER · v${pkg.version} (Alpha)</span><h2 id="landing-downloads-title">CinePulse'u<br><span>ekranına taşı.</span></h2><p>İşletim sistemine uygun dosyayı seç. Kurulum paketleri resmî GitHub Releases üzerinden doğrudan indirilir; tüm platformlar v${pkg.version} senkron güncellenir.</p></div><div class="cp-landing-downloads">${packages.map(([symbol,title,detail,url,label,platform])=>`<article data-platform-download="${platform}">${icon(symbol)}<h3>${title} <small class="cp-landing-pkgver" data-pkgver>v${pkg.version}</small></h3><p>${detail}</p><a class="cp-landing-button cp-landing-secondary" href="${url}" target="_blank" rel="noopener noreferrer" data-pkgurl>${label}${icon('arrow-down-to-line')}</a></article>`).join('')}</div><div class="cp-landing-download-footer"><span>Android için kalıcı release imzası (versionCode ${pkg.versionCode}) · Windows 10+ · Debian/Ubuntu · Flatpak</span><a href="${RELEASES}" target="_blank" rel="noopener noreferrer">Sürüm notları ve tüm dosyalar ${icon('arrow-up-right')}</a></div></section>
        <section id="landing-gallery" class="cp-landing-section cp-landing-shell" aria-labelledby="landing-gallery-title">
          <div class="cp-landing-section-heading">
            <span class="cp-landing-eyebrow">UYGULAMA ARAYÜZÜNDEN KARELER</span>
            <h2 id="landing-gallery-title">Her ayrıntısıyla<br><span>modern sinema deneyimi.</span></h2>
            <p>Gelişmiş keşif motorundan saf sinema oynatıcısına, bölüm takibinden kişisel kütüphaneye kadar CinePulse içerisindeki gerçek arayüz kesitleri.</p>
          </div>
          <div class="cp-landing-gallery-grid">
            <article class="cp-landing-gallery-card">
              <div class="cp-landing-gallery-screen">
                <img src="${base}images/discovery/cover.svg" alt="Modern Sinema Oynatıcı Sahnesi" loading="lazy">
                <span class="cp-landing-gallery-badge">${icon('play-circle')} Tam Ekran Oynatıcı</span>
              </div>
              <div class="cp-landing-gallery-body">
                <h3>Saf Sinema & Sahne Modu</h3>
                <p>Dikkat dağıtmayan minimalist tam ekran arayüzü. Dublaj ve altyazı ayrımı, hızlı kaynak değiştirme, otomatik akış pilotu ve kusursuz medya kontrolleri.</p>
              </div>
            </article>
            <article class="cp-landing-gallery-card">
              <div class="cp-landing-gallery-screen">
                <img src="${base}images/discovery/movies.webp" alt="Akıllı Keşif ve Trendler" loading="lazy">
                <span class="cp-landing-gallery-badge">${icon('compass')} Yapım Keşfi</span>
              </div>
              <div class="cp-landing-gallery-body">
                <h3>Zengin Keşif & Filtreleme</h3>
                <p>IMDb / TMDb puanları, trend listeleri, yıl ve tür filtreleri. Film, dizi, anime ve belgeseller arasında kaybolmadan aradığın hikâyeyi anında bul.</p>
              </div>
            </article>
            <article class="cp-landing-gallery-card">
              <div class="cp-landing-gallery-screen">
                <img src="${base}images/discovery/series.webp" alt="Bölüm Takibi ve Sezonlar" loading="lazy">
                <span class="cp-landing-gallery-badge">${icon('check-circle-2')} Bölüm Takibi</span>
              </div>
              <div class="cp-landing-gallery-body">
                <h3>Akıllı Sezon & İzlendi İşaretleme</h3>
                <p>Dizi takibinde nerede kaldığını hatırlama derdine son. Sezonları tek tıkla izlendi işaretle, sonraki bölüme geçişte hiçbir zaman ritmini bozma.</p>
              </div>
            </article>
            <article class="cp-landing-gallery-card">
              <div class="cp-landing-gallery-screen">
                <img src="${base}images/discovery/anime.webp" alt="Kişisel Kütüphane" loading="lazy">
                <span class="cp-landing-gallery-badge">${icon('bookmark')} Kişisel Kitaplık</span>
              </div>
              <div class="cp-landing-gallery-body">
                <h3>Kaldığın Yerden Devam Et</h3>
                <p>Yarım bıraktığın içerikler ilerleme çubuklarıyla saklanır. JSON yedeğiyle tüm listeni cihazlar arasında taşıyabilir veya Trakt ile eşitleyebilirsin.</p>
              </div>
            </article>
          </div>
        </section>
        <section id="landing-features" class="cp-landing-section cp-landing-shell" aria-labelledby="landing-features-title">
          <div class="cp-landing-section-heading"><span class="cp-landing-eyebrow">TÜM ÖZELLİKLER</span><h2 id="landing-features-title">Daha az arayış.<br><span>Daha çok kendi listen.</span></h2><p>Sadece bir oynatıcı değil. Keşiften öneriden birlikte izlemeye, çocuk modundan eklenti ekosistemine kadar her şey tek uygulamada.</p></div>
          <div class="cp-landing-benefits">${benefits.map(([symbol,title,text],i)=>`<article class="cp-landing-benefit"><div>${icon(symbol)}<span>${String(i+1).padStart(2,'0')}</span></div><h3>${title}</h3><p>${text}</p></article>`).join('')}</div>
        </section>
        <section id="landing-compare" class="cp-landing-section cp-landing-shell" aria-labelledby="landing-compare-title">
          <div class="cp-landing-compare-intro"><div><span class="cp-landing-eyebrow">AYNI CINEPULSE, FARKLI İMKÂNLAR</span><h2 id="landing-compare-title">Masaüstünde ne var?<br><span>Android'de ne açılıyor?</span></h2></div><p>Bu site tanıtım ve indirme merkezidir — oynatma uygulamada çalışır. İhtiyacına göre paketi seç.</p></div>
          <div class="cp-landing-table-wrap" tabindex="0" role="region" aria-label="Masaüstü ve Android özellik karşılaştırması"><table class="cp-landing-compare-table"><caption class="cp-landing-sr-only">CinePulse platform özellikleri</caption><thead><tr><th scope="col">Özellik</th><th scope="col">Masaüstü<span>Windows / Linux</span></th><th scope="col">Android<span>Telefon / Tablet</span></th></tr></thead><tbody>${comparison.map(([feature,...values])=>`<tr><th scope="row">${feature}</th>${values.map(value=>`<td><span class="cp-landing-status ${value==='Var'?'is-available':value==='Yok'?'is-unavailable':'is-conditional'}">${icon(value==='Var'?'check':value==='Yok'?'minus':'circle-dot')}${value}</span></td>`).join('')}</tr>`).join('')}</tbody></table></div>
          <div class="cp-landing-web-note">${icon('info')}<p><strong>Web sitesi neden oynatmıyor?</strong> Web yalnızca tanıtım ve indirme merkezidir; kaynak taraması ve oynatma tarayıcı kurallarına takıldığı için uygulamaya taşındı. Tam deneyim için yukarıdaki paketlerden birini kur.</p></div>
        </section>
        <section class="cp-landing-start cp-landing-shell" aria-labelledby="landing-start-title"><div><span class="cp-landing-eyebrow">ÜÇ ADIM, KENDİ AKIŞIN</span><h2 id="landing-start-title">Hazırlık yok.<br><span>Keşifle başla.</span></h2><button class="cp-landing-button cp-landing-secondary" data-landing-section="landing-downloads">${icon('download')}Paketi Kur</button></div><ol><li><span>01</span><div><h3>İlgini çekeni bul.</h3><p>Ana sayfadan, aramadan veya kategorilerden ilerle. Diziyse sezon ve bölümünü seç.</p></div></li><li><span>02</span><div><h3>Dilini ve yayınını seç.</h3><p>Dublaj / altyazılı seçenekleri gör. Açılmayan bir bağlantıda diğer alternatife geç.</p></div></li><li><span>03</span><div><h3>Listene ekle, geri dön.</h3><p>Beğendiklerini sakla. Ara verdiğinde kütüphanenden kaldığın yere dön.</p></div></li></ol></section>
        <section class="cp-landing-release cp-landing-shell" aria-labelledby="landing-release-title"><div><span class="cp-landing-eyebrow">v${pkg.version} · BU SÜRÜMÜN ODAĞI</span><h2 id="landing-release-title">Kaynaklar tazelendi.<br><span>Kurulum seçenekleri çoğaldı.</span></h2><a href="${RELEASES}" target="_blank" rel="noopener noreferrer">Sürüm notlarını gör ${icon('arrow-up-right')}</a></div><ul><li>${icon('timer')}<div><strong>Daha zengin Türkçe dublaj hattı</strong><p>Yeni yıldız kod adlı kaynaklar eklendi; dublaj / altyazı ayrımı gerçek etiketlerle listeleniyor.</p></div></li><li>${icon('panel-right')}<div><strong>İzleme ilerlemesi anında güncelleniyor</strong><p>Sezonu izlendi işaretleme artık uygulamayı kapatmadan görünür; kütüphane ve devam listeleri taze kalıyor.</p></div></li><li>${icon('download')}<div><strong>Flatpak desteği</strong><p>Windows EXE, Android APK, Linux DEB ve yeni Flatpak paketi doğrudan Releases'te. Android sürümleri aynı kalıcı anahtarla imzalanıyor.</p></div></li></ul></section>
        <section id="landing-license" class="cp-landing-section cp-landing-shell" aria-labelledby="landing-license-title">
          <div class="cp-landing-section-heading">
            <span class="cp-landing-eyebrow">YASAL GÜVENCE VE TELİF HAKKI</span>
            <h2 id="landing-license-title">Telif Hakkı ve<br><span>Özel Lisans Bildirimi.</span></h2>
            <p>CinePulse Studio, özgün arayüz mimarisi, marka kimliği ve tescilli kaynak kodlarıyla yasal koruma altındadır.</p>
          </div>
          <div class="cp-landing-license-box">
            <div class="cp-landing-license-icon">${icon('shield-alert')}</div>
            <div class="cp-landing-license-content">
              <div class="cp-landing-license-meta">
                <span class="cp-landing-license-tag lime">PROPRIETARY</span>
                <span class="cp-landing-license-tag">ALL RIGHTS RESERVED</span>
                <span class="cp-landing-license-tag">v${pkg.version}</span>
              </div>
              <h3>Copyright (c) 2024–2026 Çağatay (caca1403)</h3>
              <p>Bu proje ve tüm kaynak kodları özel mülkiyete tabi (Proprietary and Confidential) olup tüm yasal hakları saklıdır. Yazarın açık yazılı izni olmaksızın kaynak kodunun, arayüz bileşenlerinin veya mimarisinin herhangi bir ortamda kısmen veya tamamen kopyalanması, üçüncü şahıslara aktarılması, yetkisiz fork edilmesi, çoğaltılması veya dağıtılması kesinlikle yasaktır.</p>
              <a class="cp-landing-license-link" href="https://github.com/caca1403/cine-pulse/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">${icon('file-text')}Resmi LICENSE Sözleşmesini İncele ${icon('arrow-up-right')}</a>
            </div>
          </div>
        </section>
        <section id="landing-faq" class="cp-landing-section cp-landing-shell cp-landing-faq" aria-labelledby="landing-faq-title"><div><span class="cp-landing-eyebrow">AKLINDA KALMASIN</span><h2 id="landing-faq-title">Sık sorulan<br><span>sorular.</span></h2><p>Başlamadan önce neyin nerede çalıştığını bil.</p></div><div class="cp-landing-questions">${faqs.map(([question,answer])=>`<details><summary>${question}${icon('plus')}</summary><p>${answer}</p></details>`).join('')}</div></section>
        <section class="cp-landing-final cp-landing-shell"><span class="cp-landing-eyebrow">ŞİMDİ SIRA SENDE</span><h2>İndir, kur.<br><span>Bu akşamın hikâyesini bul.</span></h2><p>İşletim sistemine uygun paketi indir ve izlemeye başla.</p><button class="cp-landing-button" data-landing-section="landing-downloads">${icon('download')}Paketleri İndir</button><a href="${RELEASES}" target="_blank" rel="noopener noreferrer">Sürüm notları ve tüm dosyalar ${icon('arrow-right')}</a></section>
      </main>
      <footer class="cp-landing-footer cp-landing-shell">
        <div class="cp-landing-footer-main">
          <a class="cp-landing-brand" href="#showcase">${renderSiteLogo('cp-landing-logo')}<span>Cine<span>Pulse</span></span></a>
          <span class="cp-landing-footer-slogan">Senin ekranın. Senin akışın.</span>
        </div>
        <div class="cp-landing-footer-meta">
          <span class="cp-landing-copyright">© 2024–2026 Çağatay (caca1403) · Tüm Hakları Saklıdır (Proprietary)</span>
          <div class="cp-landing-footer-links">
            <a href="https://github.com/caca1403/cine-pulse/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">Lisans ${icon('file-text')}</a>
            <a href="${RELEASES}" target="_blank" rel="noopener noreferrer">GitHub Releases (v${pkg.version}) ${icon('arrow-up-right')}</a>
          </div>
        </div>
      </footer>
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
        set('flatpak', info.desktop.flatpak, info.desktop.version);
      }).catch(() => {});
      // ---- TANITIM SAHNE EFEKTLERI ----
      // Vanilla CSS + IO + rAF; npm bagimliligi yok. reduced-motion veya
      // coarse-pointer'da hicbiri devreye girmez (icerik statik gorunur),
      // marquee klonu da yapilmaz (ekran okuyucuya cift metin gitmez).
      const root = container.querySelector('.cp-landing');
      if (root && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // D) sonsuz marquee: serit icerigi ikiye kopyala, CSS translateX(-50%) doner.
        const strip = root.querySelector('.cp-landing-platforms');
        if (strip) {
          const group = document.createElement('div');
          group.className = 'cp-landing-marquee-group';
          while (strip.firstChild) group.append(strip.firstChild);
          const copy = group.cloneNode(true);
          copy.setAttribute('aria-hidden', 'true');
          const track = document.createElement('div');
          track.className = 'cp-landing-marquee-track';
          track.append(group, copy);
          strip.append(track);
        }
        // B) scroll-reveal: butun section cocuklari, 60ms stagger (--reveal-i).
        if ('IntersectionObserver' in window) {
          root.querySelectorAll('main section').forEach(section => {
            [...section.children].forEach((el, i) => {
              if (el.matches('.cp-landing-preview, .cp-landing-hero-stack')) return;
              el.classList.add('cp-reveal');
              el.style.setProperty('--reveal-i', Math.min(i, 7));
            });
          });
          const io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add('is-revealed');
              io.unobserve(entry.target);
            });
          }, { threshold: 0.06, rootMargin: '0px 0px -50px 0px' });
          root.querySelectorAll('.cp-reveal').forEach(el => io.observe(el));
        }
        if (matchMedia('(pointer: fine)').matches) {
          // A) hero 3D durusu: mousemove ile max 8deg tilt + 40px one cikma;
          // scroll-parallax tek degiskende (--sp), katmanlar faktorle cogaltir.
          const hero = root.querySelector('.cp-landing-hero');
          const stack = hero?.querySelector('.cp-landing-hero-stack');
          if (hero && stack) {
            const paint = () => {
              root.style.setProperty('--sp', `${Math.max(0, Math.min(scrollY, 900))}px`);
              heroScrollRaf = 0;
            };
            const schedule = () => {
              if (!heroScrollRaf) heroScrollRaf = requestAnimationFrame(paint);
            };
            if (heroScrollFx) removeEventListener('scroll', heroScrollFx);
            heroScrollFx = schedule;
            addEventListener('scroll', schedule, { passive: true });
            paint();
            hero.addEventListener('mousemove', e => {
              const r = hero.getBoundingClientRect();
              const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
              stack.style.setProperty('--sx', `${(0.5 - y) * 8}deg`);
              stack.style.setProperty('--sy', `${(x - 0.5) * 8}deg`);
              stack.style.setProperty('--sz', '40px');
            }, { passive: true });
            hero.addEventListener('mouseleave', () => {
              stack.style.setProperty('--sx', '0deg');
              stack.style.setProperty('--sy', '0deg');
              stack.style.setProperty('--sz', '0px');
            });
          }
          // C) indirme + benefit kartlari: 6deg'e kadar tilt, 24px hover yukselt,
          // isik lekesi --mx/--my custom property'lerini izler.
          root.querySelectorAll('.cp-landing-downloads article, .cp-landing-benefit').forEach(card => {
            card.addEventListener('mousemove', e => {
              const r = card.getBoundingClientRect();
              const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
              card.style.setProperty('--ty', `${(x - 0.5) * 12}deg`);
              card.style.setProperty('--tx', `${(0.5 - y) * 10}deg`);
              card.style.setProperty('--mx', `${x * 100}%`);
              card.style.setProperty('--my', `${y * 100}%`);
            }, { passive: true });
            card.addEventListener('mouseleave', () => {
              card.style.setProperty('--ty', '0deg');
              card.style.setProperty('--tx', '0deg');
            });
          });
        }
      }
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

<div align="center">

<a href="https://cinepulse.cinepulse.workers.dev/">
  <img src="docs/assets/cinepulse-cover.svg" alt="CinePulse — Senin ekranın. Senin akışın." width="100%" />
</a>

### Keşfet. Listene ekle. Kaldığın yerden devam et.

Film, dizi ve anime keşfi; kişisel kütüphane, çevrimdışı indirme ve Windows, Linux ile Android'de oynatma.

**Web · Windows · Linux (DEB / Flatpak) · Android**

[![Site](https://img.shields.io/badge/Web-CinePulse-22c55e?style=for-the-badge)](https://cinepulse.cinepulse.workers.dev/)
[![Release](https://img.shields.io/github/v/release/caca1403/cine-pulse?style=for-the-badge&label=S%C3%BCr%C3%BCm)](https://github.com/caca1403/cine-pulse/releases/latest)
[![Deploy](https://github.com/caca1403/cine-pulse/actions/workflows/cloudflare.yml/badge.svg)](https://github.com/caca1403/cine-pulse/actions)

[![Windows EXE indir](https://img.shields.io/badge/Windows-EXE%20indir-2563eb?style=for-the-badge&logo=windows)](https://github.com/caca1403/cine-pulse/releases/latest/download/CinePulse-Setup.exe)
[![Android APK indir](https://img.shields.io/badge/Android-APK%20indir-3ddc84?style=for-the-badge&logo=android&logoColor=white)](https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk)
[![Linux DEB indir](https://img.shields.io/badge/Linux-DEB%20indir-a855f7?style=for-the-badge&logo=debian)](https://github.com/caca1403/cine-pulse/releases/latest/download/CinePulse.deb)
[![Linux Flatpak indir](https://img.shields.io/badge/Linux-Flatpak%20indir-0f766e?style=for-the-badge&logo=flathub)](https://github.com/caca1403/cine-pulse/releases/latest/download/CinePulse.flatpak)

[Özellikler](#1-nedir) · [İndir](#3-platformunu-seç-ve-indir) · [Kurulum](#4-kurulum-adım-adım) · [Veri güvenliği](#6-verilerin-korunur-mu) · [Mimari](#8-mimari-a→z) · [Geliştirme](#9-geliştirme) · [SSS](#13-sıkça-sorulan-sorular)

</div>

---

## 1. Nedir?

CinePulse; film, dizi ve anime **keşfini**, kişisel **izleme takibini**, **oynatmayı** ve desteklenen yayınlarda **çevrimdışı izlemeyi** bir araya getiren medya uygulamasıdır.

- **Web sitesi:** Tanıtım, platform karşılaştırması, kurulum rehberi, güncel sürüm bilgisi ve doğrudan indirme merkezi.
- **Uygulamalar:** Keşif, arama, yapım ayrıntıları, kişisel kitaplık, oynatma ve platforma göre çevrimdışı indirme.
- Üyelik zorunlu değil; profiller, listeler ve izleme ilerlemesi cihazında saklanır.
- Dublaj ve altyazılı yayın seçenekleri ayrı ayrı listelenir; kaynaklar **yıldız kod adlarıyla** gösterilir.
- Verilerini JSON yedeğiyle başka cihaza taşıyabilirsin; Trakt eşitlemesi isteğe bağlıdır.
- Windows, Linux ve Android paketleri aynı sürüm kaynağından üretilir; Android APK'sı mevcut yayınlarla uyumlu **kalıcı imza anahtarıyla** imzalanır.

<p align="center">
  <img src="docs/assets/view-tour.svg" alt="Keşif turu" height="88" />
  <img src="docs/assets/open-site.svg" alt="Siteyi aç" height="88" />
  <img src="docs/assets/get-app.svg" alt="Uygulamayı indir" height="88" />
</p>

## 2. Özellikler

| Özellik | Deneyim |
| :--- | :--- |
| **Keşif** | Film, dizi, anime, çizgi dizi, belgesel ve kısa diziler; arama, tür/yıl/puan filtreleri, trendler ve yapım ayrıntıları. |
| **Kişisel kitaplık** | Favoriler, daha sonra izle listesi, tamamlanan yapımlar, izleme geçmişi ve kaldığın yerden devam et. |
| **Bölüm takibi** | Sezon/bölüm seçimi, bölümleri ve sezonu izlendi işaretleme, sıradaki bölüme geçiş. |
| **Yayın seçenekleri** | Bulunan dublajlı ve altyazılı alternatifleri ayrı listele; kaynakları sade kod adlarıyla gör. |
| **Oynatıcı** | Destekleyen yayınlarda altyazı, ses ve hız ayarları, ileri/geri sarma, tam ekran ve ilerleme kaydı. |
| **Çevrimdışı kitaplık** | Windows, Linux ve Android uygulamalarında desteklenen doğrudan/HLS yayınları cihaza kaydet; uygulama içindeki İndirilenler'den yönetip çevrimdışı aç. |
| **Profiller ve çocuk profili** | Ayrı kullanım profilleri, çocuk PIN'i ve yaş/tür filtreleri. |
| **Öneri ve eşitleme** | Kişisel öneriler; isteğe bağlı Trakt izleme geçmişi/liste eşitlemesi. |
| **Yedekleme** | JSON olarak dışa aktar, başka kurulumda içe aktar; uygulama güncellemesi yerel verileri silmez. |
| **Canlı TV** | Bu sürümde geçici olarak devre dışı. |

### Platform farkları

| Özellik | Web sitesi | Windows / Linux uygulaması | Android uygulaması |
| :--- | :---: | :---: | :---: |
| Tanıtım, platform karşılaştırması ve indirme bağlantıları | ✓ | — | — |
| Keşif, kitaplık, profiller ve izleme ilerlemesi | — | ✓ | ✓ |
| İçerik oynatma | — | Kaynağa/biçime bağlı | Kaynağa/biçime bağlı |
| Desteklenen içerikleri çevrimdışı indirme | — | ✓ | ✓ |
| Uygulama içi kaynak doğrulama | — | Destekli yayınlarda | Kaynağa bağlı |
| JSON yedekleme ve içe aktarma | — | ✓ | ✓ |
| Cihaza özgü oynatıcı ve sistem kontrolleri | — | Masaüstü klavye/kabuk | Android Media3, geri tuşu |

> Uygulamalar ortak keşif, kitaplık, profil, yedekleme ve çevrimdışı indirme özelliklerini paylaşır. Oynatma motoru ve bazı sistem entegrasyonları işletim sistemine göre değişir; her yayın her platformda çalışmayabilir.

## 3. Platformunu seç ve indir

Bu kaynak ağacının sürümü **v2.0.0** (Android `versionCode 200`). Paketler **[resmî GitHub Releases](https://github.com/caca1403/cine-pulse/releases/latest)** üzerinden indirilir; aşağıdaki indirme düğmeleri en son yayınlanan sabit dosya adlarına gider.

| Platform | Paket | Bağlantı |
| :--- | :--- | :--- |
| **Web** | Kurulumsuz | [Siteyi aç](https://cinepulse.cinepulse.workers.dev/) |
| **Windows** | EXE | [CinePulse-Setup.exe](https://github.com/caca1403/cine-pulse/releases/latest/download/CinePulse-Setup.exe) |
| **Android** | APK | [cinepulse.apk](https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk) |
| **Linux / Debian, Ubuntu** | DEB | [CinePulse.deb](https://github.com/caca1403/cine-pulse/releases/latest/download/CinePulse.deb) |
| **Linux / Flatpak** | Flatpak | [CinePulse.flatpak](https://github.com/caca1403/cine-pulse/releases/latest/download/CinePulse.flatpak) |

> İndirme bağlantıları her zaman **en son başarılı release** dosyasına yönelir. Sürümlü dosyalar, sürüm notları ve yayın durumu [GitHub Releases](https://github.com/caca1403/cine-pulse/releases/latest) sayfasındadır.

- **Android:** APK, release iş akışında mevcut GitHub APK'larıyla aynı sertifika parmak izine sahip olmalıdır; eşleşmiyorsa yayın adımı başarısız olur. Aynı imza, uygulama üstüne güncelleme yapmayı sağlar.
- **Windows:** EXE, Windows kurulum sihirbazıdır. İmzalama sertifikası olmadığı için Windows SmartScreen uyarısı gösterebilir.
- **Flatpak:** Fedora, elementaryOS, Zorin vb. Flatpak destekli dağıtımlar içindir.
- Mac için masaüstü paketi yoktur; web sürümünü kullanabilirsin.

## 4. Kurulum adım adım

<details open>
<summary><b>Windows (EXE)</b></summary>

1. Yukarıdaki **Windows EXE indir** düğmesinden `CinePulse-Setup.exe` dosyasını indir.
2. Kurulum sihirbazını çalıştır (ZIP açmak gerekmez).
3. Masaüstü kısayolundan aç; ilk açılışta keşif ekranı gelir.

</details>

<details>
<summary><b>Android (APK)</b></summary>

1. Yukarıdaki **Android APK indir** düğmesinden `cinepulse.apk` dosyasını telefonuna indir.
2. "Bilinmeyen kaynaklardan yükleme" iznini yalnız bu kurulum için ver.
3. Uygulamayı aç; mevcut kurulum varsa aynı anahtar sayesinde doğrudan güncellenir.

</details>

<details>
<summary><b>Linux · DEB</b></summary>

```bash
sudo dpkg -i CinePulse.deb   # gerekirse: sudo apt-get -f install
```

</details>

<details>
<summary><b>Linux · Flatpak</b></summary>

```bash
flatpak install --user ./CinePulse.flatpak
flatpak run com.cinepulse.studio
```

</details>

<details>
<summary><b>Web</b></summary>

Kurulum yok: [CinePulse web sitesini](https://cinepulse.cinepulse.workers.dev/) aç. Site; uygulamanın görsel tanıtımını, özellik/platform karşılaştırmasını, sık sorulanları, sürüm bilgisini ve çalışan EXE/APK/DEB/Flatpak indirme düğmelerini sunar. İçerik keşfi ve oynatma web sitesinde değil, kurduğun masaüstü veya Android uygulamasında çalışır.

</details>

## 5. İlk kullanım

1. Windows/Linux/Android uygulamasını aç; bir yapım ara. Web sitesi uygulama tanıtımı ve indirme merkezidir.
2. Dizilerde sezon ve bölümü seç.
3. Mevcut dil (dublaj / altyazı) ve yayın seçeneklerinden birini aç.
4. Yapımı listene ekle; daha sonra kütüphanenden devam et.
5. Sezonu bitirdiğinde "Bu Sezonu İzlendi İşaretle" tek dokunuşla tüm bölümleri işaretler.

## 6. Verilerin korunur mu?

**Evet — güncelleme veri kaybı yaşatmaz.** Bu garanti testlerle kilitlidir (`tests/veri-uyumluluk.test.mjs`).

- İlerleme, listeler ve favoriler tarayıcı/cihaz yerel deposunda **JSON** olarak tutulur (`sineflix_*_v1` anahtarları).
- Mimari tamamen yenilense bile bu JSON'un anahtarları ve şekli **birebir aynı kalır**; yeni sürümler eski kayıtları okur, güncellerken ek alanları silmez.
- Tarayıcı verilerini temizlemeden önce **JSON yedek** al (Profil → Yedekleme).
- Farklı cihaza taşınma: JSON dışa aktar → diğer cihazda içe aktar. (Trakt isteğe bağlı senkron alternatifidir.)

## 7. Güncellemeler

- **Web:** `main` dalına her push'ta otomatik yayınlanır; tarayıcıda her zaman güncel sürüm açılır.
- **Masaüstü / Android:** `v*` etiketi ile paketler üretilir; uygulama içi güncelleme simgesi Releases sayfasını açar.
- **İmza:** Android APK'ler aynı kalıcı anahtarla imzalanır; imza uyuşmazlığında yükleme zaten engellenir.
- **Sürüm kaynağı:** `package.json` (`version` + `versionCode`) — manifestler (`public/version.json`, `public/desktop-version.json`) ondan otomatik üretilir.

## 8. Mimari A→Z

```text
Ekranlar / bileşenler (src/views, src/components)
        │
        ▼
Sağlayıcı kayıt defteri (src/providers/kayit.js) ── 55 kayıtlı sağlayıcı
        │
        ├── Birinci taraf çekirdekler (src/providers/cekirdekler/) — yıldız kod adlı, bağımlılıksız
        ├── Ortak çekirdek yardımcıları (ortakCekirdek.js) + kod çözücüleri (kodCozler.js)
        │
        ▼
Kaynak köprüsü (vekil.js) — rota yönlendirme, /api/proxy, cihaz köprü kancaları
        │
        ▼
Platform katmanı (src/services/platform/) · Android gizli-WebView çözümleyici
        │
        ▼
Oynatıcı (oynatici/) · altyazı · ilerleme · depolama (altyapi/storage.js)
```

| Katman | Dizin | Sorumluluk |
| :--- | :--- | :--- |
| **Arayüz** | `src/views/`, `src/components/` | Keşif, detaylar, profiller, açılış ekranı ve oynatıcı. |
| **Sağlayıcılar** | `src/providers/` | Kayıt defteri (`kayit.js`), yıldız kod adlı çekirdekler, köprü ve kod çözücüleri. |
| **Akış motoru** | `src/services/kaynak/`, `src/services/oynatici/` | Süre bütçesi, normalizasyon, akış sağlığı, oynatma. |
| **Depolama** | `src/services/altyapi/storage.js` | İzleme geçmişi, listeler, profiller; eski JSON'la birebir uyumlu. |
| **Platform köprüleri** | `src/services/platform/` | Web / Android / masaüstü ağ, gizli-WebView ve medya çözücü. |
| **Web API** | `api/`, `functions/` | Cloudflare Worker yönlendirmesi ve destekli uçlar. |
| **Masaüstü** | `electron/`, `server/` | Electron kabuğu ve yerel medya servisi. |
| **Android** | `android/` | Capacitor uygulaması, yerel ağ köprüsü ve medya ağ geçidi. |
| **Kalite** | `tests/`, `tools/` | 636 test senaryosu ve cihaz doğrulama araçları. |

**Web:** statik dosyalar Cloudflare Workers Assets üzerinden; `main` push'u depolama + Worker'ı birlikte yayınlar. Vercel gerekmez.

**Masaüstü:** destekli API istekleri yerel medya servisine yönlendirilir.

**Android:** destekli istekler yerel ağ köprüsüne gider; gizli-WebView gerçek Chromium motoruyla doğrulama ve akış yakalama yapar.

## 9. Geliştirme

**Gereksinimler:** Node.js 20+, npm. Android için JDK 21 + Android SDK; masaüstü paketleri için platform derleme araçları; Flatpak için `flatpak` + `flatpak-builder`.

```bash
git clone https://github.com/caca1403/cine-pulse.git
cd cine-pulse
npm ci
npm run dev
```

Yerel medya servisi gerektiğinde ayrı terminalde `npm run server`.

| Komut | Amaç |
| :--- | :--- |
| `npm run build` | Web üretim derlemesi. |
| `npm run preview` | Derlenmiş arayüzü yerelde önizleme. |
| `npm run manifest:sync` | `public/version.json` + `desktop-version.json`'ı `package.json`'dan üret. |
| `node --test tests/*.test.mjs tests/*.test.js tests/*.test.cjs` | Tüm regresyon paketi (636 senaryo; Node.js 20+ gerekir). |
| `npm run test:providers` | Seçilmiş sağlayıcı / platform testleri. |
| `node tools/cekirdek-test.mjs` | Sağlayıcı çekirdeklerini Node üzerinde uçtan uca çalıştırma. |
| `npm run pack:win` | Windows EXE. |
| `npm run pack:deb` / `npm run pack:flatpak` | Linux DEB / Flatpak. |
| `npm run pack:linux` | DEB + Flatpak birlikte. |
| `npm run cap:sync` | Web varlıklarını Android projesine eşitleme. |

### Test paketi

636 test senaryosu; sağlayıcı kayıt defteri, çekirdek çözücüleri, veri uyumluluğu, platform köprüleri, oynatıcı ve dağıtım davranışını kapsar. Cihaz ölçümü için `tools/cihaz-devtest-kur.sh` ve `tools/cihaz-cdp.mjs` kullanılır (ayrıntılı notlar `docs/` altında).

## 10. Sürüm çıkarma (katkı için)

1. `package.json` → `version` + `versionCode` güncelle.
2. `npm run manifest:sync` çalıştır.
3. `node --test tests/*.test.mjs` yeşil olmalı.
4. Tag at: `git tag vX.Y.Z && git push origin vX.Y.Z`.
5. **Release hattı** (Actions) otomatik üretir ve yayınlar: imzalı **APK** (kalıcı anahtar), **EXE**, **DEB**, **Flatpak** + güncelleme manifestleri.

Sürüm etiketi ile `package.json` sürümü **aynı olmalıdır** (sürüm kapısı bunu doğrular).

## 11. İş akışları (CI/CD)

| İş akışı | Tetik | Ürettiği |
| :--- | :--- | :--- |
| **Release CinePulse** | `v*` etiketi | İmzalı APK, EXE, DEB, Flatpak + Release yüklemesi |
| **build-apk** | Manuel | Test APK üretimi |
| **Cloudflare Deploy** | `main` push | Web (Workers Assets + API Worker) |
| **GitHub Pages** | `main` push | Yedek statik sunum |

İmza anahtarları GitHub Secrets'ta tutulur (`ANDROID_KEYSTORE_*`); kaynak koda anahtar koymayın.

## 12. Dağıtım (web)

Kurulum, gizli değişkenler, testler ve geri dönüş adımları: **[Cloudflare dağıtım rehberi](docs/CLOUDFLARE-DEPLOY.md)**.

Sürüm geçmişi: **[Sürüm notları](docs/release-notes.md)** · **[Actions](https://github.com/caca1403/cine-pulse/actions)** · **[Releases](https://github.com/caca1403/cine-pulse/releases)**.

## 13. Sıkça sorulan sorular

**Siteye girmek için uygulama indirmem gerekiyor mu?**
Hayır. Web sitesi tanıtım, platform karşılaştırması, SSS ve indirme merkezidir. Keşif, listeler, oynatma ve çevrimdışı indirme için Windows/Linux/Android uygulamasını kur.

**Uygulamada bütün yayınlar kesin çalışıyor mu?**
Hayır. Yayınlar kaldırılmış, erişime kapalı veya geçici bozuk olabilir; durumda başka alternatifi dene. Kaynaklar yıldız kod adlarıyla listelenir ve "canlı" rozeti yalnızca ölçülmüş kaynaklara verilir.

**İndirdiğim içerikler internetsiz açılır mı?**
Desteklenen doğrudan dosya ve HLS yayınları uygulamanın yerel depolamasına indirilir. İndirmeyi başlatmak ve oynatmak için uygulama içindeki İndirilenler ekranını kullan; her yayın biçimi indirilemez.

**Verilerim güncellemelerde silinir mi?**
Hayır. Yerel JSON biçimi sürümler arası birebir korunur (testlerle kilitli). Yine de düzenli JSON yedek almanı öneririz.

**Android, EXE, DEB ve Flatpak arasından hangisini seçmeliyim?**
Telefon/tablet → APK; Windows → EXE; Debian/Ubuntu → DEB; Fedora, elementaryOS vb. Flatpak'li dağıtımlar → Flatpak.

**Yeni sürümü nasıl alırım?**
Web her zaman günceldir. Masaüstü/Android'de güncelleme simgesi Releases sayfasını açar; APK aynı anahtarla imzalandığı için üzerine kurulum yeterlidir.

**Bir yayın açılmadığında ne yapmalıyım?**
Aynı dildeki başka bir seçeneği dene, internet bağlantını kontrol et; doğrulama isteyen masaüstü yayınlarda onayı kendin tamamla.

## 14. Bilinen sınırlar

- **Tüm kaynaklar doğrulanmış değildir.** Başarılı web dağıtımı, bütün film / dizi yayınlarının oynadığını kanıtlamaz.
- Bazı sağlayıcılar yalnızca belirli platformlarda çalışır (ör. gizli-WebView gerektirenler Android/masaüstünde). Web'de oynatma kaynağa bağlıdır.
- HTTP 403 / 503, doğrulama sayfaları, bölgesel/DNS engelleri ve CORS kısıtları erişimi etkileyebilir.
- Ücretsiz barındırma **sınırsız hizmet garantisi değildir**; Worker kotaları ve sağlayıcı kullanım şartları geçerlidir.
- Web taşınması, daha önce dağıtılmış APK / EXE içindeki adresleri değiştirmez.
- Belgesel ve kısa dizi kapsamı tamamlanmış sayılmamalıdır.

## 15. Güvenlik ve kullanım

- Token, imza anahtarı ve oturum bilgilerini kaynak koda veya issue'lara koyma; CI için GitHub Secrets kullan.
- Güvenlik sorunu bildirirken anahtarları ve kişisel verileri gizle. Yalnızca resmî release paketlerini kullan.
- Eriştiğin içerik için gerekli haklara sahip ol; üçüncü taraf hizmetlerin kullanım koşullarına uy.

## 16. Lisans

Bu depo kaynak kodunun incelenmesi için yayımlanmıştır. Mevcut **[LICENSE](LICENSE)** tüm hakları saklı tutar; proje OSI onaylı bir açık kaynak lisansı altında değildir. Yeniden kullanım, değişiklik, dağıtım veya başka hizmette yayınlama için yazılı izin gerekir.

GitHub'ın kendi koşullarındaki görüntüleme ve fork hakları bundan ayrıdır. Resmî olmayan türevleri açıkça belirt; telif bildirimlerini koru.

**English:** Source-available, not OSI-licensed open source. See `LICENSE`; obtain written permission for reuse or redistribution. Playback availability depends on the source and platform. Production runs on Cloudflare Workers; packages are distributed through GitHub Releases.
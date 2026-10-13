<div align="center">

<a href="https://cinepulse.cinepulse.workers.dev/">
  <img src="docs/assets/cinepulse-cover.svg" alt="CinePulse — Senin ekranın. Senin akışın." width="100%" />
</a>

### Keşfet. Listene ekle. Kaldığın yerden devam et.

Film, dizi ve anime keşfi; kişisel kütüphane ve çok platformlu oynatma deneyimi.

**Web · Windows · Linux · Android**

[![Site](https://img.shields.io/badge/Web-CinePulse-22c55e?style=for-the-badge)](https://cinepulse.cinepulse.workers.dev/)
[![Release](https://img.shields.io/github/v/release/caca1403/cine-pulse?style=for-the-badge&label=S%C3%BCr%C3%BCm)](https://github.com/caca1403/cine-pulse/releases/latest)
[![Deploy](https://github.com/caca1403/cine-pulse/actions/workflows/cloudflare.yml/badge.svg)](https://github.com/caca1403/cine-pulse/actions/workflows/cloudflare.yml)

[Özellikler](#deneyim) · [İndir](#platformunu-seç) · [Kurulum](#geliştirme) · [Mimari](#mimari) · [Dağıtım](#yayın-ve-güncellemeler) · [Sınırlar](#bilinen-sınırlar)

</div>

---

## Deneyim

CinePulse, içerik keşfini ve kişisel izleme takibini tek bir arayüzde birleştirir. Yapımları ara, sezon ve bölümleri incele, listene ekle ve kaldığın noktaya dön.

| Özellik | Deneyim |
| :--- | :--- |
| **Keşif** | Film, dizi, anime, belgesel ve diğer kategoriler; arama, öneriler ve yapım detayları. |
| **Kütüphane** | Favoriler, izleme listesi, tamamlanan yapımlar ve izleme ilerlemesi. |
| **Bölüm takibi** | Sezon / bölüm seçimi ve izlenen bölüm işaretleri. |
| **Yayın seçenekleri** | Mevcut dublaj ve altyazılı alternatifler; yalnız yıldız kod adlarıyla sade kaynak menüsü. |
| **Oynatıcı** | Desteklenen akışlarda altyazı, hız, ses, ileri / geri sarma ve tam ekran. |
| **Profiller** | Ayrı profiller ve çocuk profiline uygun içerik filtreleri. |
| **Trakt** | İsteğe bağlı izleme geçmişi ve liste senkronizasyonu. |
| **Veri aktarımı** | JSON yedekleme ve başka cihazda içe aktarma. |

### Platform farkları

| Özellik | Web | Windows / Linux | Android |
| :--- | :---: | :---: | :---: |
| Keşif, listeler, ilerleme | ✓ | ✓ | ✓ |
| İçerik oynatma | Kaynağa bağlı | Kaynağa bağlı | Kaynağa bağlı |
| Canlı TV / yayın akışı | — | ✓ | ✓ |
| Çevrimdışı indirme | — | — | Desteklenen içeriklerde |
| Uygulama içi tarayıcıyla doğrulama | — | Destekli yayınlarda | Kaynağa bağlı |
| JSON yedekleme | ✓ | ✓ | ✓ |

> Bir kaynağın başka platformda çalışması webde de çalışacağını garanti etmez. Tarayıcı kuralları, sağlayıcı erişimi ve medya biçimi sonucu etkiler.

## Platformunu seç

Paketler **[resmî GitHub Releases](https://github.com/caca1403/cine-pulse/releases/latest)** üzerinden indirilir. Güncel yayımlanmış paket sürümü: **v1.1.71**.

| Platform | Paket | Başlangıç |
| :--- | :--- | :--- |
| **Web** | Kurulumsuz | [Siteyi aç](https://cinepulse.cinepulse.workers.dev/) |
| **Windows** | EXE | [Kurucuyu indir](https://github.com/caca1403/cine-pulse/releases/download/v1.1.71/CinePulse-Setup-1.1.71.exe) |
| **Linux / Debian, Ubuntu** | DEB | [Paketi indir](https://github.com/caca1403/cine-pulse/releases/download/v1.1.71/CinePulse-1.1.71.deb) |
| **Linux / taşınabilir** | AppImage | [AppImage indir](https://github.com/caca1403/cine-pulse/releases/download/v1.1.71/CinePulse-1.1.71.AppImage), çalıştırma izni ver |
| **Android** | APK | [APK indir](https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk) |

Android release paketleri mevcut kalıcı imza anahtarıyla üretilir. İmzası eşleşen yeni paket, mevcut kurulumun üzerine yüklenebilir. Geliştirme / devtest paketleri release ile aynı şey değildir.

### İlk kullanım

1. Siteyi veya uygulamayı aç; bir yapım ara.
2. Dizilerde sezon ve bölümü seç.
3. Mevcut dil ve yayın seçeneklerinden birini aç.
4. Yapımı listene ekle; daha sonra kütüphanenden devam et.

İlerleme ve listeler varsayılan olarak cihazda tutulur. Tarayıcı verilerini silmeden önce JSON yedeğini al. Farklı bir site adresine geçince eski adresin yerel verileri otomatik taşınmaz.

## Mimari

```text
Ekranlar / bileşenler
        │
        ▼
providerAggregator
        │
        ├── Elle yazılmış sağlayıcılar
        ├── Destekli adaptörler / site sürücüleri
        ▼
providerRuntime
  süre bütçesi → normalizasyon → akış kontrolü
        │
        ▼
PlayerModal
  oynatma · altyazı · ilerleme
```

| Katman | Dizin | Sorumluluk |
| :--- | :--- | :--- |
| **Arayüz** | `src/views/`, `src/components/` | Keşif, detaylar, profiller ve oynatıcı. |
| **Sağlayıcılar** | `src/providers/` | Elle yazılmış çözümleyiciler; ortak yardımcılar ve kayıt defteri. |
| **Akış motoru** | `src/services/providerRuntime/` | Süre sınırı, iptal sinyali, normalizasyon ve oynatma kontrolleri. |
| **Servisler** | `src/services/` | Metadata, depolama, altyazı, güncelleme ve kaynak birleştirme. |
| **Platform köprüleri** | `src/services/platform/` | Web, Android ve masaüstü ağ / oynatma farklılıkları. |
| **Web API** | `api/`, `cf/`, `functions/` | Cloudflare Worker yönlendirmesi, API adaptörü ve destekli çözümleyiciler. |
| **Masaüstü** | `electron/`, `server/` | Electron kabuğu ve yerel medya servisi. |
| **Android** | `android/` | Capacitor uygulaması ve yerel platform katmanı. |
| **Kalite / yayın** | `tests/`, `tools/`, `.github/workflows/` | Regresyon testleri, doğrulama araçları ve paket üretimi. |

**Web:** statik dosyalar Cloudflare Workers Assets üzerinden; `/api/*` istekleri Worker üzerinden sunulur. Vercel çalışma zamanı gerektirmez.

**Masaüstü:** uygulama, destekli API isteklerini yerel medya servisine yönlendirir.

**Android:** destekli istekler yerel ağ köprüsüne gider; tarayıcı ile aynı kaynak davranışı beklenmemelidir.

## Geliştirme

**Gereksinimler:** Node.js 20+, npm. Android paketlemesi için JDK 21 ve Android SDK; masaüstü paketlemesi için platformun derleme araçları gerekir. Yerel Python çözümleyicileri kullanılıyorsa ilgili Python bağımlılıkları da kurulmalıdır.

```bash
git clone https://github.com/caca1403/cine-pulse.git
cd cine-pulse
npm ci
npm run dev
```

Yerel medya servisi gerektiğinde ayrı terminalde:

```bash
npm run server
```

| Komut | Amaç |
| :--- | :--- |
| `npm run build` | Web üretim derlemesi. |
| `npm run preview` | Derlenmiş arayüzü yerelde önizleme; uzak API testi yerine geçmez. |
| `npm run test:providers` | Seçilmiş sağlayıcı / platform regresyon testleri. |
| `node --test tests/cloudflare-deployment.test.mjs` | Statik sunum, yönlendirme ve APK indirme davranışı. |
| `node tools/cf-smoke.mjs` | Canlı web dağıtımının temel HTTP kontrolleri. |
| `npm run pack:linux` / `npm run pack:win` | Masaüstü paketleri. |
| `npm run cap:sync` | Web varlıklarını Android projesine eşitleme. |

## Yayın ve güncellemeler

- **Web:** `main` dalına push → Cloudflare dağıtım iş akışı → statik dosyalar ve Worker birlikte yayınlanır.
- **Uygulamalar:** `v*` sürüm etiketi → Android APK, Windows EXE, Linux DEB ve AppImage üretimi.
- **Sürüm bilgisi:** `package.json` ve üretilen güncelleme manifestleri.
- **İndirmeler:** uygulama paketleri GitHub Releases'ten gelir; web sunucusu APK baytlarını tekrar aktarmak yerine yönlendirir.

Kurulum, gizli değişkenler, testler ve geri dönüş adımları: **[Cloudflare dağıtım rehberi](docs/CLOUDFLARE-DEPLOY.md)**.

Sürüm geçmişi: **[Sürüm notları](docs/release-notes.md)** · **[Actions](https://github.com/caca1403/cine-pulse/actions)**.

## Bilinen sınırlar

- **Tüm kaynaklar doğrulanmış değildir.** Başarılı web dağıtımı, bütün film / dizi yayınlarının oynadığını kanıtlamaz.
- Orion'da bazı başlıklarda eksik sonuçlar ve Polaris erişimi araştırılmayı bekliyor. Belgesel ve kısa dizi kapsamı da tamamlanmış sayılmamalıdır.
- Cloudflare web çözümleyici portu şu anda destekli iki eski çözümleme yolunu içerir; bütün Python çözümleyicilerinin birebir portu değildir.
- HTTP 403 / 503, doğrulama sayfaları, bölgesel engeller ve CORS kısıtları erişimi etkileyebilir.
- Ücretsiz barındırma **sınırsız hizmet garantisi değildir**. Worker istek / CPU kotaları ve sağlayıcının kullanım şartları geçerlidir; video vekil trafiği ayrıca izlenmelidir.
- Web taşınması, daha önce dağıtılmış APK / EXE dosyalarının içindeki adresleri değiştirmez.

## Güvenlik ve kullanım

- Token, imza anahtarı ve oturum bilgilerini kaynak koduna veya issue'lara koyma; CI için GitHub Secrets kullan.
- Güvenlik sorunu bildirirken anahtarları ve kişisel verileri gizle. Yalnızca resmî release paketlerini kullan.
- Eriştiğin içerik için gerekli haklara sahip ol; üçüncü taraf hizmetlerin kullanım koşullarına uy.

## Lisans

Bu depo kaynak kodunun incelenmesi için yayımlanmıştır. Mevcut **[LICENSE](LICENSE)** tüm hakları saklı tutar; proje OSI onaylı bir açık kaynak lisansı altında değildir. Yeniden kullanım, değişiklik, dağıtım veya başka hizmette yayınlama için yazılı izin gerekir.

GitHub'ın kendi koşullarındaki görüntüleme ve fork hakları bundan ayrıdır. Resmî olmayan türevleri açıkça belirt; telif bildirimlerini koru.

**English:** Source-available, not OSI-licensed open source. See `LICENSE`; obtain written permission for reuse or redistribution. Playback availability depends on the source and platform. Production runs on Cloudflare Workers; packages are distributed through GitHub Releases.

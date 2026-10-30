## CinePulse v2.0.1 — Alpha & Quick Update Release

CinePulse 2.0.1; v2.0.0 majör mimarisini temel alan, izlenme durumu senkronizasyonunu düzelten ve mevcut kullanıcılara anında güncelleme sağlayan Alpha sürümüdür.

### 🚀 2.0.1 Değişiklikleri
- **İzlenme Durumu Düzeltmesi:** Detay ekranında film/dizi izlenme butonunun tıklandıktan sonra düzeninin bozulması ve ikon-metin kayması giderildi.
- **Güncelleme Bildirimi:** v2.0.0 yüklü cihazların otomatik olarak yeni yayını algılaması için versionCode 201'e yükseltildi.

## CinePulse v2.0.0 — Major Architecture & Multi-Platform Release

CinePulse 2.0.0; Android, masaüstü (Windows & Linux) ve web ekosistemini tek bir çatı altında birleştiren, çekirdek mimarisi ve kullanıcı deneyimi baştan aşağı yenilenmiş majör dönüm noktası sürümüdür.

### 🚀 Öne Çıkan Başlıklar

- **Evrensel Sürüm & Çapraz Platform Eşitliği:**
  - Tüm dağıtımlar (`Android APK`, `Windows EXE`, `Linux DEB`, `Linux Flatpak`) senkronize sürüm döngüsüne (`v2.0.0` / versionCode `200`) kavuşturuldu.
  - Masaüstü sürümlerinde çevrimdışı yerel indirme motoru ve entegre **İndirilenler Kitaplığı** devreye alındı.

- **Güvenlik & Bütünlük (Kalıcı İmza Garantisi):**
  - Android APK yayın hattı, resmî imza sertifikasının SHA-256 parmak izi (`429f0788...`) ile CI/CD seviyesinde kilitlendi.
  - Mevcut kullanıcılar için kesintisiz yerinde güncelleme desteği korunurken, yetkisiz veya yabancı anahtarla derlenen paketlerin dağıtımı engellendi.

- **Akıllı Akış & Medya Motoru:**
  - **Çoklu Kaynak Çözümleme:** Yerli ve küresel sağlayıcılar için gelişmiş akış yakalama, şifreli HLS/DASH işleme ve anında parça düşürme mekanizması.
  - **Ses & Altyazı Bütünlüğü:** Doğrudan doğrulanmış Türkçe ses/altyazı tespiti, otomatik OpenSubtitles TR fallback zinciri ve Anubis korumalı istek köprüsü.
  - **Kalite Rozetleri:** Gerçek akış çözünürlüğüne dayalı kesin kalite etiketlemesi (4K, 2K, 1080p, 720p).

- **Modern Arayüz & Kullanılabilirlik:**
  - Doğal dil ve anlamsal içerik arama motoru.
  - Dinamik "Bugün / Yakında" yayın rafları ve gelişmiş recap kartları.
  - Aile ve ebeveyn denetimi için bağımsız PIN korumalı Çocuk Profili mimarisi.
  - Masaüstünde kaynak seçmeden doğrudan video/ses akışını koklayan hızlı hover önizlemesi.

### 📦 Dağıtım Paketleri

| Platform | Paket Türü | Not |
| :--- | :--- | :--- |
| **Android** | `CinePulse-v2.0.0.apk` | Resmî release anahtarıyla imzalı (armeabi-v7a / arm64-v8a / x86_64 evrensel) |
| **Windows** | `CinePulse-Setup-2.0.0.exe` | NSIS tabanlı 64-bit bağımsız kurulum |
| **Linux (Debian/Ubuntu)** | `CinePulse-2.0.0-amd64.deb` | Native deb paketi |
| **Linux (Universal)** | `CinePulse-2.0.0.flatpak` | Sandbox uyumlu bağımsız Flatpak paketi |

> **Not:** Yayın erişilebilirliği kaynak sağlayıcılarına ve anlık ağ koşullarına bağlıdır. Android sürümü önceki resmî kurulumların üzerine doğrudan güncellenebilir.

## CinePulse v1.1.71

- **Oynatıcı ses düzeltmesi:** Kaynak değiştirildiğinde ya da durdurulduğunda eski yayının sesi birkaç saniye sürükleniyordu; eski akış artık anında serbest bırakılıyor (durdur → bağ kopar → yeni kaynak başlar).
- **Web oynatma:** Betelgeuse yıldızının yayınları aynı-kök, aralık (Range) destekli vekilden geçiriliyor; "listede görünüp 0:00'da takılma" sınıfı hata giderildi.
- Kaynak adlandırması ve gizlilik modeli aynı: arayüzde yalnız kod adları.

**Paketler:** Android APK (aynı imza anahtarı — mevcut kurulumlar güncellenir), Linux DEB, Windows EXE, Linux AppImage.

## CinePulse v1.1.70

- **Yeni içerik türleri:** Belgesel ve Çocuk arşivleri menüde; katalog 19 yıldıza çıktı, defter tek kaynağa indirildi.
- **Canlı TV yıldızları:** Polaris yeniden yayında (film + dizi + 30+ canlı kanal); adres bilgisi artık sağlayıcının kendi ayar servisinden canlı okunur.
- **Oynatıcı tepkiselliği:** kaynak siteler yanıt vermediğinde artık 9. saniyede uyarı + tek otomatik yeniden deneme; boş durumda hangi yıldızların denendiğini özetleyen rehber.
- **Web düzeltmeleri:** tarayıcıda "hiç kaynak yok" sınıfı hatalar — vekil yolu ve çift-tarama korumasıyla giderildi; canlı TV kaynak adları kod adlarına çevrildi.
- **Masaüstü:** "sıfır kaynak" hatası düzeltildi (tüm yıldızlar artık çalışıyordu, masaüstünde hiçbiri görünmüyordu); tek gizli tarayıcı kuyruğu düzeltildi; ikonlar çevrimdışı da görünür.
- **Sağlama:** yayın adresleri açılışta doğrulanır, ölü/4xx hat listelenmez; iptal edilen aramada istekler anında düşer.

**Paketler:** Android APK (aynı imza anahtarı — mevcut kurulumlar güncellenir), Linux DEB, Windows EXE, Linux AppImage.

Yayınların erişilebilirliği kaynağa ve platforma bağlıdır. Bazı kaynaklar yalnızca Android'de açılır: bunlar tarayıcı motoru gerektiren bir güvenlik kontrolü kullanır.

## CinePulse v1.1.68

- **Güncelleme uyarısı düzeltildi.** Aynı sürüm kuruluysa artık uyarı gelmiyor. Daha önce sürüm kodu yanlış hesaplandığı için güncel uygulamada bile sürekli "güncelle" bildirimi çıkıyordu.
- **Yeni kaynaklar taramaya bağlandı.** Yapılandırması olup hiç sorgulanmayan kaynaklar artık gerçekten çalışıyor; menüden açılıp kapatılabiliyorlar.
- **Oynatıcı çözümleme genişletildi:** sıkıştırılmış kod açma, şifreli dizi çözme, `openPlayer` / `FirePlayer` / gömülü oynatıcı verisi, `master.txt` düzeltmesi, Türkçe ses ve altyazı tanıma, kalite etiketi (4K / 2K / 1080p / 720p / 480p).
- **Android'de tüm trafik cihaz üzerinden.** Uygulama proxy'si, canlı TV ve altyazı istekleri yerel geçitten geçiyor; sunucu yalnızca son çare. Bilinmeyen sunucu adreslerine istek atılmıyor.
- **Düzeltmeler:** bePlayer yapılandırmasındaki değişken hatası (tüm kalıp çöküyordu), katman yeniden deneme kuralı (403/429 sonraki katmana, diğer 4xx tek proxy denemesi), sorgu parantez kodlaması, altyazı dil yedeği, gizli WebView kurulumunda tekrar deneme.

**Paketler:** Android APK, Linux DEB, Windows EXE, Linux AppImage.

Yayınların erişilebilirliği kaynağa ve platforma bağlıdır. Bazı kaynaklar yalnızca Android'de açılır: bunlar tarayıcı motoru gerektiren bir güvenlik kontrolü kullanır.

- **Engel sayfası artık zinciri kırmıyor.** Korumalı sitelerde güvenlik sayfası gelse bile uygulama onu içerik sanıp boş liste döndürmüyor; gizli tarayıcı penceresi devreye girip sayfayı gerçekten açıyor. Bu yüzden daha fazla kaynak listede görünüyor.

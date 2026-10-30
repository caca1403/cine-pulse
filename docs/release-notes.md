## CinePulse v2.0.0

- **Yeni sürüm dalı:** Windows EXE, Android APK, Linux DEB ve Flatpak aynı `package.json` sürümünden üretilir; release etiketi `v2.0.0` ve Android sürüm kodu `200` olarak eşleştirilir.
- **APK imza doğrulaması:** yayın hattı, imzalanan APK sertifikasının SHA-256 parmak izini mevcut resmî APK ile karşılaştırır; farklı anahtarla imzalanan paket yayımlanmaz.
- **Platform eşitliği:** masaüstü uygulamasında desteklenen yayınları çevrimdışı indirme ve İndirilenler kitaplığı açılır; web tanıtım sitesi uygulama özellikleri, karşılaştırma, SSS ve sabit indirme düğmelerini sunar.
- **Uygulama deneyimi:** Türkçe kaynak aileleri ve ses/altyazı kanıtı, OpenSubtitles TR yedeği, doğal dil arama, kalite etiketleri, Bugün/Yakında rafları, çocuk profili PIN'i ve masaüstü hover önizlemesi.
- **Kurulum paketleri:** GitHub Actions Android APK, Windows EXE, Linux DEB ve Flatpak dosyalarını tek release'te üretip yayımlar.

Yayın erişilebilirliği kaynak sağlayıcısına, ağ koşullarına ve platforma bağlıdır. APK release sertifikası sabit parmak izi ile doğrulanır; Windows kurulum dosyası kod imzalı değildir.

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

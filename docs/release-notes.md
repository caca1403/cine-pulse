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

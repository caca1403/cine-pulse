## CinePulse v1.1.66

- **Güncelleme uyarısı düzeltildi.** Aynı sürüm kuruluysa artık uyarı gelmiyor. Daha önce sürüm kodu yanlış hesaplandığı için güncel uygulamada bile sürekli "güncelle" bildirimi çıkıyordu.
- **Yeni kaynaklar taramaya bağlandı.** Yapılandırması olup hiç sorgulanmayan kaynaklar artık gerçekten çalışıyor; menüden açılıp kapatılabiliyorlar.
- **Oynatıcı çözümleme genişletildi:** sıkıştırılmış kod açma, şifreli dizi çözme, `openPlayer` / `FirePlayer` / gömülü oynatıcı verisi, `master.txt` düzeltmesi, Türkçe ses ve altyazı tanıma, kalite etiketi (4K / 2K / 1080p / 720p / 480p).
- **Android'de tüm trafik cihaz üzerinden.** Uygulama proxy'si, canlı TV ve altyazı istekleri yerel geçitten geçiyor; sunucu yalnızca son çare. Bilinmeyen sunucu adreslerine istek atılmıyor.
- **Düzeltmeler:** bePlayer yapılandırmasındaki değişken hatası (tüm kalıp çöküyordu), katman yeniden deneme kuralı (403/429 sonraki katmana, diğer 4xx tek proxy denemesi), sorgu parantez kodlaması, altyazı dil yedeği, gizli WebView kurulumunda tekrar deneme.

**Paketler:** Android APK, Linux DEB, Windows EXE, Linux AppImage.

Yayınların erişilebilirliği kaynağa ve platforma bağlıdır. Bazı kaynaklar yalnızca Android'de açılır: bunlar tarayıcı motoru gerektiren bir güvenlik kontrolü kullanır.

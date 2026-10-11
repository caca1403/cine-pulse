## CinePulse v1.1.65

**Masaüstünde artık gizli tarayıcı penceresi çalışıyor.** Bazı kaynaklar kendini bir güvenlik kontrolüyle koruyor; bu kontrolü yalnızca gerçek bir tarayıcı motoru çalıştırabilir. Daha önce bu kontrol sadece Android'de vardı, masaüstünde hiç devreye girmiyordu. Artık hem APK'da hem EXE/DEB'de çalışıyor ve kendi ağınızı kullanıyor (sunucu üzerinden değil).

- **Daha önce açılmayan kaynaklar masaüstünde açılıyor oldu.** Bu turda gizli pencereyle ölçüldü: biri 998 KB, biri 737 KB, biri 212 KB içerikle açıldı. Aynı siteler daha önce her istekte "tarayıcınızı doğrulayın" sayfasına düşüyordu.
- **27 kaynak kayıtlı; 9 tanesi bu sürümde taramaya bağlandı** (toplam kaynak sayısı arttı). Alan adları otomatik takip ediliyor; site adresini değiştirdiğinde uygulama kendiliğinden yenisine geçiyor. Aramalar IMDb numarasıyla yapılıyor — İngilizce başlıklar da doğru içeriğe denk geliyor.
- **Ölü site adresleri artık sessizce boş liste döndürmüyor.** Her açılışta adres denetleniyor; erişilemeyen adres atlanıyor ve nedeni kaydediliyor. (Bir kaynağın adresi ölmüştü, uygulama bunu hiçbir şey olmamış gibi gösteriyordu.)
- **Gizli pencere ölçüm aracı eklendi** (`tools/ghost-test.cjs`): kaynakları tek tek gerçekten açarak başarılı/başarısız sonucunu raporlar.
- **Çözümleme yöntemleri genişletildi:** sıkıştırılmış oynatıcı kodu, şifreli sayfa içeriği, `FirePlayer` / `openPlayer` / `videoPlayerData` gömülü verileri, Türkçe ses ve altyazı hatları, kalite etiketi (4K / 2K / 1080p / 720p / 480p).
- **Düzeltme:** Sayfadaki doğrudan medya taraması bir yazım hatası yüzünden hiç çalışmıyordu; bulunan yayınlar sessizce atılıyordu.
- **Düzeltme:** Sıkıştırılmış kodu açma işlemi ilk kelimeyi yanlış çözüyor, açılan kod bozuluyordu.
- **Düzeltme:** Site araması yapan kaynaklar masaüstü sürümde hiç sorgu göndermiyordu.
- **Düzeltme:** Bir yayın adresi biçimi yanlış dosya adıyla aranıyordu ve hep boş dönüyordu.

**Paketler:** Android APK, Linux DEB, Windows EXE.

Yayınların erişilebilirliği kaynağa ve platforma bağlıdır. Bazı kaynakların adresleri zaman zaman kapanıp yenileniyor; uygulama bunu otomatik takip eder.
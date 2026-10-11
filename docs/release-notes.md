## CinePulse v1.1.60

- **DEB artık "Servis Başlatılamadı" uyarısı vermiyor:** Kurulum `/opt/CinePulse` altına yapıldığı için uygulama oraya yazamıyor ve yerel medya servisi EACCES ile ölüyordu. Medya klasörü artık kullanıcı dizininde (`~/.config/cinepulse-studio/media_storage`) tutuluyor; eski içerik de otomatik taşınıyor.
- **Linux güncellemesi kendini tamamlıyor:** Polkit diyaloğu açılmadığında uygulama hata vermek yerine gerçek bir terminal açıyor ve güncellemeyi orada kuruyor. Kurulum sonrası tek tıkla yeniden başlatma sunuluyor.
- **Güncelleme bildirimi artık kesmiyor:** Her açılışta karşınıza çıkan "Yeni Sürüm Mevcut" penceresi kaldırıldı; sadece menüden istediğinizde soruluyor.
- **Canlı TV 1600+ kanal:** Kral TV (M3U Plus) ve Turhan TV kaynakları eklendi. Çöp ve sık düşen iptv-org ile TVR kaynakları kaldırıldı.
- **Yayınlar artık çalışıyor:** Çoğu kanal düz MPEG-TS yayın veriyor; bunlar artık uygun oynatıcıya yönlendiriliyor. `#EXTVLCOPT` içindeki özel User-Agent değerleri de artık dikkate alınıyor.
- **Ölü yayınlar kendiliğinden eleniyor:** Açılıştan sonra birkaç kanal gerçekten denetleniyor, çalışmayanlar listenin sonuna alınıyor. Sonuç 6 saat saklanıyor, yani liste zamanla kendini iyileştiriyor.
- **Aynı kanal birden çok adresle geçiyorsa** oynatıcı otomatik sıradakini deniyor.
- **Güvenlik:** Uzak yayın listelerinden gelen kanal adları artık güvenli biçimde işleniyor.
- **Paket bilgileri düzeltildi:** Bölüm `video`, lisans `proprietary`; masaüstü girişi doğrulayıcıdan geçiyor.

Yayınların erişilebilirliği kaynağa ve platforma bağlıdır.
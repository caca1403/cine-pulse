CinePulse v1.1.57 — Eklenti yönetimi ve yeni kaynak
- Tüm sayfalarda "Eklentiler" yönetimi: 26 kaynağı gör, ara, aç/kapat; her
  satırda durum uyarısı. Kapalı eklenti taranmaz.
- Yeni kaynak Vela / FilmEkseni (duvarsız API, VidMoly + Eksenload, film ve dizi).
- DiziBal, yeni Pilavyer akışıyla baştan yazıldı (doğrudan m3u8 + altyazı).
- APK + DEB + EXE + AppImage hepsi 1.1.57, aynı imza anahtarı.

CinePulse v1.1.56 — Açılış düzeltmesi
- GPU döngüde çöken sistemlerde uygulama hiç açılmıyordu; artık 3. çöküş
  sonrası otomatik yazılım-render ile yeniden başlıyor, kullanıcı müdahalesi gerekmiyor.
- Masaüstünde sayfa-embed çerçeveler oynatıcı alanı gömülü yükleniyor.
- Orion cihaz-fallback'ı yanlış bazdaki (.mobi oynatıcı hostu) denemeyi bıraktı.
- APK + DEB + EXE + AppImage hepsi 1.1.56, aynı imza anahtarı.

CinePulse v1.1.55 — Tum platformlar tek surum
- APK + DEB + EXE + AppImage hepsi 1.1.55 olarak derlendi, ayni imza anahtari.
- Luna (SezonlukDizi) ve Mira (Webteizle) artik sitede de listeleniyor (Worker gecidi).
- Oynatici cerceveleri sandbox ile kilitlendi (popup/kacis yok).
- Sitedeki indirme kartlari artik her platformun kendi surumunu gosteriyor.
- Masaustu guncelleme bildirimi kendi dosyasini okuyor; APK bump'u masaustunu etkilemiyor.
- Yerel medya servisi (127.0.0.1:4000) port cakismasinda otomatik kurtarir.

Yayın uyumluluğu kaynağa ve platforma bağlıdır.

CinePulse v1.1.53 — Android APK

- Orion (HDFilmCehennemi) Android kaynağı, sunucu egress'i engellendiğinde episode/player bağlantılarını cihazın kendi ağından çözer.
- SezonlukDizi doğrulama akışında reCAPTCHA eşlemesi düzeltildi.
- APK önceki sürümlerle aynı imza anahtarı kullanılarak derlenir. Bu sürüm DEB, EXE ve AppImage'ı güncellemez.

Yayın uyumluluğu kaynağa ve platforma bağlıdır.

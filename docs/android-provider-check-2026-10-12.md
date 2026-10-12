# Android sağlayıcı kontrolü — 12 Ekim 2026

Samsung SM-S931B üzerinde yerel Android HTTP/Python katmanıyla 38 etkin sağlayıcı ve 60 içerik/tür kombinasyonu kontrol edildi. Film: Interstellar. Dizi: Stranger Things S1E3. Anime: Naruto S1E1. Katalogda olmayan bir örnek, sağlayıcının tüm içeriklerinin çalışmadığını göstermez.

Bu rapor medya erişimi kontrolüdür; her bağlantıda görüntü/ses çözme doğrulaması değildir. Ortak başlık/CORS düzeltmesinden sonra, son görünürlük/fallback düzeltmesinden önce alınmıştır.

| Sağlayıcı | Tür | Sonuç | Aday sayısı |
|---|---|---|---:|
| setf | movie | unresolved | 2 |
| dzl | tv | no-match-or-media | 0 |
| hdfc | movie | timeout | 0 |
| hdfc | tv | timeout | 0 |
| setf | tv | timeout | 0 |
| slc | movie | timeout | 0 |
| slc | tv | timeout | 0 |
| fhdf | movie | no-match-or-media | 0 |
| wtz | movie | no-match-or-media | 0 |
| dzs | movie | transport-verified | 9 |
| dzs | tv | transport-verified | 7 |
| fxs | movie | no-match-or-media | 0 |
| snx | movie | no-match-or-media | 0 |
| dzy | tv | no-match-or-media | 0 |
| dzy | movie | no-match-or-media | 0 |
| dzb | movie | no-match-or-media | 0 |
| snx | tv | no-match-or-media | 0 |
| tvr | movie | unresolved | 2 |
| tvr | tv | unresolved | 2 |
| jet | movie | no-match-or-media | 0 |
| dzb | tv | transport-verified | 2 |
| jet | tv | no-match-or-media | 0 |
| fxs | tv | timeout | 0 |
| hdfb | movie | transport-verified | 1 |
| dyu | tv | unresolved | 2 |
| smashy | movie | unresolved | 1 |
| szd | tv | unresolved | 4 |
| animecix | anime | no-match-or-media | 0 |
| anizium | anime | transport-verified | 4 |
| lookmovie | tv | transport-verified | 1 |
| lookmovie | movie | transport-verified | 1 |
| smashy | tv | unresolved | 1 |
| dramalar | tv | no-match-or-media | 0 |
| animetr | anime | unresolved | 12 |
| dramadizilerim | tv | no-match-or-media | 0 |
| torrent | movie | unresolved | 1 |
| kidsvip | movie | no-match-or-media | 0 |
| vodm3u | movie | no-match-or-media | 0 |
| torrent | tv | unresolved | 1 |
| sinemacc | movie | no-match-or-media | 0 |
| k666 | movie | no-match-or-media | 0 |
| kidsvip | tv | no-match-or-media | 0 |
| k666 | tv | no-match-or-media | 0 |
| dizi77 | tv | transport-verified | 1 |
| dzyf | tv | no-match-or-media | 0 |
| dzyf | movie | no-match-or-media | 0 |
| d4kh | movie | no-match-or-media | 0 |
| d4kh | tv | no-match-or-media | 0 |
| dizibox | tv | timeout | 0 |
| twoembed | tv | no-match-or-media | 0 |
| vidlk | movie | no-match-or-media | 0 |
| vidlk | tv | no-match-or-media | 0 |
| fm | movie | timeout | 0 |
| fm | tv | timeout | 0 |
| hdfd | movie | timeout | 0 |
| hdfd | tv | timeout | 0 |
| asy | anime | no-match-or-media | 0 |
| twoembed | movie | timeout | 0 |
| dzp | movie | timeout | 0 |
| dzp | tv | timeout | 0 |

Değişiklikler: imza/yetkilendirme başlıklarını cihaz geçidine taşımak; APK sağlayıcılarını ikinci kayıt filtresiyle elememek; MKV proxy rotasını tanımak; Corvus ve diğer aramalarda ilgisiz ilk içerik/başka bölüm fallbacklerini kaldırmak; Nero uzantısız medya uçlarını tanımak; WebView kayıt ve kuyruk sürelerini ayırmak; doğrudan yayın bulunamazsa eşleşen kaynakları kullanıcı seçimi için korumak.

Üretim uygulamasının imzası yerel anahtarla uyuşmadığı için test APK ayrı com.cinepulse.studio.devtest paketiyle kuruldu; mevcut uygulama silinmedi.

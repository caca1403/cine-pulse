# CinePulse Studio — Özellik Durum Envanteri (v1.1.78, 2026-10-24)

Kod-üzeri salt-okur denetim. Her satır file:satır kanıtlıdır. Hiçbir dosya değişmedi.

YAPI NOTU: v1.1.69 skill notundan bu yana sağlayıcı katmanı değişti: 43 çekirdek
`src/providers/cekirdekler/` (`globalThis.getStreams` tikli mekanizması) +
`src/providers/vekil.js` fetch/sözleşme köprüsü; `providerAggregator` film/dizi/anime
kaynaklarını bu çekirdek havuzundan toplar (kanıt: `src/services/kaynak/providerAggregator.js:50-61`,
`src/providers/vekil.js:1-14`, kaynak tarama `vekil.js:845`, havuz boyu 8 `vekil.js:62`).

## 1. VIEW'LER (12)

| View | Durum | Kanıt |
|---|---|---|
| Home | ✅ | route `src/main.js:252`; hızlı önbellek `HomeView.js:46`; kişisel satır `HomeView.js:643` |
| Discover (filtreli) | ✅ | route `main.js:264`; filtre durumu `DiscoverView.js:15-22` |
| Showcase (tanıtım) | ✅ | route `main.js:273`; web'de varsayılan giriş `src/services/kabuk/entryRoute.js:4` |
| Detail | ✅ | route `main.js:254`; oynatma CTA `DetailView.js:581,621` |
| Library (Listem) | ✅ | route `main.js:270`; offline dalı `LibraryView.js:481` |
| Downloads | ✅ (yalnız Android) | native değilse #library'e çevirir `main.js:202-206`; oynatma `DownloadsView.js:49-53` |
| Drama (Kısa Dizi) | ✅ | route `main.js:279`; kaynaklar `DramaView.js:23-27`; doğrulanmış kategoriler `DramaView.js:43` |
| PopularList (5 tür) | ✅ | `main.js:253-256` (series/cartoons/movies/anime/documentary → `PopularListView`) |
| ChannelView (KANALIM) | ✅ | route `main.js:267`; hub tile `Navbar.js:165` |
| LiveTvView | 🟡 kod canlı, menüden KOPUK | route çalışır `main.js:261`; navbar/hub'da tile YOK (`Navbar.js:158-166`, yorum `Navbar.js:133-137`; tek giriş statik bildirim tıkı `NotificationCenterModal.js:164`) |
| TraktModal | ✅ | hub tığı `Navbar.js:250` |
| DataManagerModal | ✅ | `LibraryView.js` + `ProfileModal.js` içinden açılıyor |

## 2. OYNATICI (PlayerModal, 8024 satır)

| Özellik | Durum | Kanıt |
|---|---|---|
| Resume | ✅ | `PlayerModal.js:542-584` (resumeHedef + 8 denemeli native sarma) |
| İlerleme kaydı | ✅ | `PlayerModal.js:5217` persistCurrentProgress → saveWatchProgress |
| Hız menüsü | ✅ | `PlayerModal.js:6269-6286` (data-speed, 0.75x–2x) |
| Altyazı (web VTT) | ✅ | track ekleme `PlayerModal.js:3283-3287`; stil özelleştirme + kalıcı `PlayerModal.js:5950-5964` |
| Altyazı (native Media3) | ✅ | OpenSubtitles-v3 SRT→VTT `src/services/icerik/altyaziServisi.js:14-30`; tüketim `PlayerModal.js:6845` |
| Kalite SIRASI | ✅ | aggregator yarıçapı: 4K→480p + doğrudan yayın önceliği `providerAggregator.js:200-205` |
| Kalite SEÇİMİ menüsü | 🟡 yok | oynatıcıda kalite değiştirme menüsü yok; `quality` yalnız etiket alanı `PlayerModal.js:1411`; `preferredResolution` ayarı sembolik (`storage.js:1900` kendi yorumu) |
| nextEpisodePolicy | ✅ | import `PlayerModal.js:50`; karar zinciri `PlayerModal.js:5139-5160` (kapat/beklet/otomatik + post-play kartı) |
| Otomatik sonraki düğmesi | ✅ | `PlayerModal.js:4016` (switch) + ayar kaydı `PlayerModal.js:7797` |
| FlowPilot (⚡ Önerilen satırı) | 🟡 kısmi | çekirdek gerçekten bağlı `PlayerModal.js:2951-2956`, tercih `storage.js:18-30`; AMA öğrenme sinyalleri boş: stub'lar `PlayerModal.js:31-35` (`rankSourcesForDevice` sıralamaz, `zekaGuven = () => 0`) |
| Pulsar torrent kataloğu | 💤 | `PlayerModal.js:28` `fetchPulsarCatalogRows = async () => []` — her zaman boş liste (satır bölümü 2634-2668 ölü) |
| Magnet → harici uygulama | ✅ | `PlayerModal.js:2642-2648` (pano + toast) |
| P2P (F1, masaüstü) | ✅ | başlatma `HomeView.js:528-548`; motor bağlayıcı `src/services/dogrudan/p2pService.js:2-11` (:4000 mediaServer WebTorrent) |
| Debrid (Real-Debrid) | 💤 | anahtar modal'la kaydedilir `ProfileModal.js:243-244` — hiçbir kaynak çözücü tüketmiyor (tek import `DebridModal.js`) |
| Watch-party (Karar Odası) senkronu | ✅ | oynatıcı temizleme tarafı `PlayerModal.js:888-922`; transport WebRTC `src/services/altyapi/anonymousDecisionRoom.js:1-16`; autoplay köprüsü `anonymousDecisionRoom.js:54-60` |
| Oynatıcı içi indirme (Android) | ✅ | `PlayerModal.js:2403-2417` startOfflineDownload + progress paneli `PlayerModal.js:4019` |

## 3. KEŞİF

| Özellik | Durum | Kanıt |
|---|---|---|
| "Çünkü bunu izledin" satırı | ✅ | `HomeView.js:643` ← saf çekirdek `src/services/icerik/personalRails.js:1-16` |
| Arama (navbar overlay) | ✅ | `Navbar.js:300-363`; kısa dizi arama `Navbar.js:312` |
| Detaylı Keşif | ✅ | `Navbar.js:158` |
| Rastgele seçici (Şanslı Çark) | ✅ | `Navbar.js:161` + `RandomPickerModal.js` (yalnız hub'dan) |
| Oyuncu gezgini (Cast Explorer) | ✅ | yalnız `DetailView.js` içinden açılıyor |
| Fragman (Trailer) | ✅ | `HeroSlider.js:271` + `tmdbApi.js:1231` (ama `trailersEnabled` okuması yapılıyor — ayarı değiştiren UI yok, bkz §7) |
| Birlikte (Karar Odası) tile | ✅ | `Navbar.js:159`; oda transport `anonymousDecisionRoom.js:10-16` (halka açık WebTorrent tracker'ları, WebRTC data channel) |

## 4. HESAP-ÜSTÜ

| Özellik | Durum | Kanıt |
|---|---|---|
| Profiller (çoklu profil + çocuk) | ✅ | `ProfileModal.js:37-98`; aktif profil `storage.js:296-307` |
| Çocuk güvenliği | ✅ | `isItemKidSafe` `storage.js:321-329`; tüketim `HomeView.js:324,358`, `HeroSlider.js:64,165,379`, `tmdbApi.js:294` |
| Admin PIN/engelli liste YÖNETİMİ | 💤 | `getAdminPin/setAdminPin/verifyAdminPin` `storage.js:210-228`, `addBlockedContent/removeBlockedContent` `storage.js:266-280` — tüketen UI YOK (grep 0) |
| Trakt scrobble | ✅ | `PlayerModal.js:730-734`; uçlar `traktService.js:395-482` |
| Trakt auto-sync | ✅ | başlatma `main.js:406`; zamanlama `traktService.js:66-85`; geçmiş çekme `traktService.js:509` |
| Trakt tam senkron kaydı | ✅ | `traktService.js:959` LAST_SYNC |
| Bildirim merkezi | 🟡 STATİK | 4 adet sabit DEFAULT_NOTIFICATIONS `NotificationCenterModal.js:15-48` (sahte içerik/rezil zaman damgaları); yeni bölüm üreticisi YOK — yalnız okundu-işaretle (`:113-120`) ve yedek importu temizliği `storage.js:2133-2138` |
| Veri yöneticisi (yedek/geri yükle) | ✅ | `storage.js:1934-2000` (exportDataAsJSON; native kayıt yolu) + DataManagerModal |
| Ürün turu | ✅ | `main.js:395-396`; gate `storage.js:170` |
| Profil onboarding | ✅ | `main.js:388-389`; gate `storage.js:161` |
| Kurulum sihirbazı (masaüstü) | 🟡 YARIM | açılış yalnız "sistem eksiği ihtiyacında" `desktopPlatform.js:29-35` (koşul `desktopSetupPolicy.js:7`); AMA yazdığı 5 anahtarın tamamı hiçbir yerden OKUNMUYOR (bkz §7) ve `saveUserSettings` importu çağrısız `SetupWizardModal.js:10` |
| Karar Odası = izleme partisi | ✅ (yukarıda) | oda moderatör/katılımcı senkronu oynatıcıya kadar bağlı |

## 5. OFFLINE — UÇTAN UCA

✅ Zincir kapalı: indirme `PlayerModal.js:2403` → `startOfflineDownload`
(`src/services/kabuk/offlineManager.js:454+`; HLS manşet şablonu + kaynak blob Cache API)
→ liste `getDownloadedMediaList` (`DownloadsView.js:74`, `LibraryView.js:260`)
→ oynatma `getDownloadedPlaybackUrl` (`offlineManager.js:414-443`, blob URL manşet)
→ `openPlayerModal` (`DownloadsView.js:53`, `LibraryView.js:483`).
Player tercih eklentisi: offline > direkt önceliği `PlayerModal.js:114-165,2325`.

## 6. KANALIM (ChannelView) — kuşak/ruh hali/hatırlatıcı

✅ Kuşak motoru GERÇEKTEN bağlı: deterministik program üreticisi
`src/services/canli/channelScheduler.js:1-9` (mulberry32, tm+çevrim içi saat bias'ı)
import `ChannelView.js:25-39`; saniye ticker `kanalSaat.js` `ChannelView.js:40`.
Ruh hali chip'leri ✅ `ChannelView.js:420,685,750` (kalıcı yazım bilinçli YOK — spec: geçici bias `:51`).
Hatırlatıcı ✅ GERÇEK Web Notification: 10 dk öncesi arest `ChannelView.js:605-620`,
izin akışı `:623-635`, anahtar `kanalim_bildirim_v2` okunan-yazılan `:45,508,635`.

## 7. 💤 ÖLÜ ANAHTARLAR (yazılıyor, hiçbir yerden OKUNMUYOR)

| Anahtar | Yazıldığı yer | Durum |
|---|---|---|
| `user_settings.preferredResolution` | `storage.js:1900` (kendi yorumu: "Şimdilik sembolik… YAPMA") | 0 okuma; kalite seçimi yok |
| `user_settings.subtitlesEnabled` | `storage.js:1901` | 0 okuma (altyazı OpenSubtitles yolunda koşar) |
| `user_settings.theme` | `storage.js:1902` | 0 okuma (tema sabit `main.js:31`) |
| `user_settings.hoverPreviewsEnabled` | `storage.js:1903` | 0 okuma |
| `cp_setup_done_v1` | `SetupWizardModal.js:517` | 0 okuma (sihirbaz kapısı bu anahtarı değil `needsDesktopSetup`'ı soruyor) |
| `cp_buffer_size_mb` | `SetupWizardModal.js:544` | 0 okuma |
| `cp_default_sub_lang` | `SetupWizardModal.js:547` | 0 okuma (gerçek dil: Türkçe→İngilizce sabiti `altyaziServisi.js:18`) |
| `cp_auto_next_episode` | `SetupWizardModal.js:550` | 0 okuma (gerçek anahtar `autoplayNext`, `PlayerModal.js:427`) |
| `cp_resume_playback` | `SetupWizardModal.js:553` | 0 okuma |
| `cp_preferred_category` | 5 yerde `PlayerModal.js:2616,2819,5855,7699,7722` | 0 okuma → dublaj/altyazılı kategori hatırlaması ÇALIŞMIYOR |
| `sineflix_debrid_rd_key` | `DebridModal` (`ProfileModal.js:243`) | playback'te hiç tüketilmiyor → eklenti ölü |
| `cinepulse_admin_pin` | `storage.js:226` (varsayılan '1403') | yönetim/doğrulama UI'sı yok |
| `sineflix_notifications_v1` (üretici) | yok | yalnız okundu işaretleme + yedek temizliği → statik |

## 8. EN ŞAŞIRTICI 3 BULGU

1. **Masaüstü kurulum sihirbazı tamamen kapıya çıktı**: 5 kullanışlı tercihi
   (arabellek, altyazı dili, otomatik sonraki, resume) yazar ama HEPSİ ölüdür
   (`SetupWizardModal.js:544-553`); kullanıcının seçimi uygulamayı hiç etkilemez.
2. **`cp_preferred_category` 5 farklı yerde yazılır, bir yerde bile okunmaz**
   (`PlayerModal.js:2616-7722`) — "son seçtiğin dublaj/altyazılı" hafızası sözde var,
   fiilen çalışmıyor; her açılış varsayılan dublaj havuzuyla başlar.
3. **Bildirim merkezi kocaman kukla**: "Yeni bölüm yayında ⚔️" gibi 4 sabit uydurma
   bildirim (`NotificationCenterModal.js:15-48`); hiçbir kod yeni bölüm bildirimi
   üretmez — yazı satırı sayılan `sineflix_notifications_updated` olayı da tüketensizdir.
   Buna karşılık KANALIM'ın kendi hatırlatıcısı gerçek Web Notification ile canlıdır.

Not: `providerAggregator` başlığı ("yalnız kısa dizi çözer, diğer türler boş",
`providerAggregator.js:7-11`) bayat/kafa karıştırıcı: `sp_*` 40+ çekirdek hâlâ
Türk önek listesinde canlı (`providerAggregator.js:50-61`).
Ayrıca `src/providers/cekirdekler/hawkeye.js:4497-4562` satırları kendi
`__NUVIO_DOMAINS_CACHE_V3__` localStorage bağımlılığını taşır (üçüncü parti bundle).

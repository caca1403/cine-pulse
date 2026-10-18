# Netflix Özellik Analizi → CinePulse Taşıma Planı

> **Rol:** kıdemli ürün mühendisi + Netflix UX analisti. **Tarih:** 2026-10-15.
> **Yöntem:** Netflix özellik envanteri katman katman çıkarıldı; her satır CinePulse
> kodundaki **mevcut servis sinyaliyle** eşleştirildi. Kod salt-okur incelendi;
> "CinePulse'ta var" denen her şey `dosya:satır` ile kanıtlandı.
> **Kısıt hatırlatması:** ücretsiz altyapı (CF Workers free tier üstü YOK; istemci-tarafı kazanır) ·
> iframe/ölü site/korsan-ui YOK (yalnız bizim oynatıcı, arayüzde site adı YOK, kod adı) ·
> Android WebView (Web Speech/sesli komut YOK, localStorage sınırlı, arka plan timer kısıtlı) ·
> kimlik kapısı (adPuan/yilUyar) baypas edilemez · Birlikte-izleme moduna dokunulmaz · torrent salt-katalog.

---

## 0. Kısa hüküm

CinePulse, Netflix'in **izleme-öncesi keşif** ve **oynatma** katmanlarının büyük kısmına
zaten sahip (KANALIM, Akış Otopilotu, kaynak zekâsı, indirme, profil+çocuk, karar odası,
Pulsar, Canlı TV/EPG, altyazı özelleştirme, uyku/zamanlayıcı, çift-tık sarma). Asıl
**boşluk**, Netflix'in **kişiselleştirme ve geri-getirme (retention)** halkasında:
"Çünkü bunu izledin" satırları, gerçek "sıradaki bölüm" ayarı + post-play, Top-10
ve gerçek **hatırlatıcı/bildirim** üretimi. Üçü de istemci-tarafı, ücretsiz ve
mevcut servislerin üstüne kurulabilir.

---

## A. ZATEN BİZDE OLANLAR (envanter) — öneri listesinden DÜŞÜLDÜ

Bunlar Netflix'te de var; **bizde zaten var**, bu yüzden aşağıdaki öneri tablosunda
"hedef" olarak yer almazlar, yalnız referans olarak dururlar.

| CinePulse özelliği | Kanıt (dosya:satır) | Netflix karşılığı |
|---|---|---|
| **KANALIM** kişisel kanal + EPG + kuşak/preset/ruh hali + binge | `src/services/channelScheduler.js:234,321,430,600,686,830` · `src/views/ChannelView.js` | Netflix "Play Something"/kişisel akış |
| **Akış Otopilotu** (nedenli kaynak seçimi + "Şimdi oynat") | `src/services/flowPilot.js:13,98` · `src/components/PlayerModal.js:38,2660-2695` | "En iyi oynatma seçeneği" + "Neden önerildi?" (kaynak) |
| **Kaynak sağlığı zekâsı** (cihaz-bazlı sıralama + öğrenme beyni) | `src/services/sourceReliability.js:76,90,116` · `src/services/sourceIntelligence.js:43,65,74` | Netflix altyapı telemetrisi (kullanıcıya görünmez) |
| **Birlikte-izleme / Karar Odası** (senkron + oylama + tepki) | `src/components/DecisionRoomModal.js` · `src/services/anonymousDecisionRoom.js:76,123` | Netflix "Teleparty" tarzı ortak izleme |
| **Profil + Çocuk filtresi** + yönetici PIN + engelli içerik | `src/services/storage.js:118,319,326,362,213,237` · `src/components/ProfileModal.js:5` | Netflix profilleri + Kids + ebeveyn kilidi |
| **İndirme** (HLS/mp4 çevrimdışı, depolama göstergesi, cihaz içi) | `src/services/offlineManager.js:454,372,615,134` · `src/views/DownloadsView.js:15` | Netflix "İndirilenler" |
| **Canlı TV** (M3U, EPG, PiP, kanal favorileri, sağlık ön-kontrolü) | `src/views/LiveTvView.js:19,229,181,465,144` | Netflix Live (farklı lisans modeli) |
| **Pulsar P2P katalog şeridi** (magnet, salt-katalog) | `src/services/pulsarCatalog.js:22` | Netflix'te yok (bizim eklenti) |
| **İzlemeye Devam Et** + kartlarda ilerleme çubuğu | `src/views/HomeView.js:137` · `src/services/storage.js:1366,1648` | Netflix "Continue Watching" |
| **Favoriler + İzleme Listesi** | `src/services/storage.js:1699,1779` | Netflix "Listem" |
| **Trakt çift yönlü senkron/scrobble** | `src/services/traktService.js:395,428,459,913` | Netflix hesap senkronu |
| **Altyazı görünümü özelleştirme** (font/boyut/renk/zemin/konum) | `src/components/PlayerModal.js:5621,5655,5756` | Netflix altyazı görünüm ayarları |
| **Jeneriği atla** + **sonraki bölüm geri sayımı** | `src/components/PlayerModal.js:4514,4561,4577,4904` | Netflix "Skip Intro" + "Next Episode" |
| **Uyku zamanlayıcı / ekran kilidi / hız / çift-tık ±10sn / PiP** | `src/components/PlayerModal.js:6030,5066,5942,6002` | Netflix oynatıcı kontrolleri |
| **Kaynak boş-durum rehberi** (kod adlarıyla, site adı sızmadan) | `src/components/PlayerModal.js:3824` · `src/services/sourceLabels.js:100` | Netflix hata/boş durum UX |
| **Keşif filtreleri** (tür, yıl, puan, sıralama, platform) | `src/views/DiscoverView.js:113-175` | Netflix kategori tarama |
| **Fragman + oyuncu filmografisi + benzer öneriler** | `src/views/DetailView.js:130,289,322,434` · `src/components/HeroSlider.js:259` | Netflix fragman/kadro/benzer |
| **"Ne İzlesem?" çarkı** (tür + min puan + rastgele) | `src/components/RandomPickerModal.js` | Netflix "Play Something" |
| **İzleme geçmişi yönetimi** (bölüm/seri kaldır, rapor) | `src/views/LibraryView.js:173,687` · `src/services/storage.js:995,1041` · `src/components/DataManagerModal.js:106` | Netflix geçmiş temizleme |
| **JSON yedek al / geri yükle / Trakt** | `src/components/DataManagerModal.js:7` | Netflix hesap verisi |
| **Eklenti (kaynak) yönetimi, kapalıyken taranmaz** | `src/services/pluginCatalog.js:42,107` | Netflix içerik kataloğu yönetimi |

> **Not:** Birlikte-izleme ve torrent katalog **ürün kararı olarak donduruldu** — aşağıdaki
> öneriler bu iki alana dokunmaz.

---

## B. NETFLIX ÖZELLİK ENVANTERİ → CinePulse EŞLEŞME TABLOSU

**Değer:** kullanıcı değeri 1-5. **Durum:** ✅ var · 🟡 yarım · ❌ yok.
**Maliyet:** S (≤1 gün) · M (2-4 gün) · L (1-2 hafta) · XL (aylar).
**Engel:** teknik/kaynak/hukuk/altyapı engeli var mı.

| # | Netflix özelliği | Değer | Durum | Maliyet | Engel | Entegrasyon eskizi (dosya + mevcut sinyal) |
|---|---|---|---|---|---|---|
| 1 | **"Çünkü bunu izledin" kişiselleştirilmiş satır** | 5 | ❌ | M | Yok (istemci) | `HomeView.js`'e 2-3 dinamik rail ekle; tohumu `storage.js:1599 getGroupedWatchHistory()` verir, TMDB `/movie\|tv/{id}/recommendations` zaten `tmdbApi.js` üzerinden çekiliyor (`DetailView.js:130`). Sonuç `localStorage`'ta 6 saat cache → CF'siz, istemci-tarafı. |
| 2 | **"Sıradaki bölüm" otomatik geçiş + post-play** | 5 | 🟡 | S | Yok | Geri sayım var (`PlayerModal.js:4904,4577`) ama `storage.js:1875 autoplayNext` ayarı **hiç okunmuyor** (ölü). Ayarı gerçek yap; son bölümde post-play öneri kartı göster (`tmdbApi` recommendations + `storage.js:1041 markEpisodeWatched`). |
| 3 | **Gerçek hatırlatıcı / "yeni bölüm" bildirimi** | 4 | 🟡 | M | Yok (istemci) | `NotificationCenterModal.js:13 DEFAULT_NOTIFICATIONS` **statik**; `getNotifications()` sadece bunu döndürüyor. `storage.js:1779 getWatchlist()` + TMDB `first_air_date`/`next_episode_to_air` ile uygulama açılışında türet (arka plan timer YOK, WebView uyumlu). |
| 4 | **Top 10 / "Bugün Türkiye'de en çok izlenenler"** | 3 | ❌ | S-M | Toplama | Gerçek ülke sıralaması merkezi veri ister (ücretsiz tier dışı). Dürüst istemci vekili: TMDB `trending/day` + `discover` popülerlik → "1-10" rozetli rail; mevcut "Trend" rail'ini numaralı hale getir. Uydurma "ülke sıralaması" YAZMA. |
| 5 | **Hover/odak video önizleme (autoplay previews)** | 2 | 🟡 | L | Veri/WebView | `storage.js:1880 hoverPreviewsEnabled` ayarı var ama **implementasyonu yok**. Mobilde bant genişliği + WebView batarya maliyeti yüksek → aşağıda "önermiyoruz". |
| 6 | **"Skip Recap" (özeti atla)** | 3 | ❌ | M | Veri yok | Bizde "jeneriği atla" zaman-sezgisel (`PlayerModal.js:4893`, 10-90 sn). Gerçek recap işaretçisi için bölüm verisi gerekir; kaynak sağlayıcıdan gelmiyor. |
| 7 | **Oyuncuya göre arama** | 3 | 🟡 | S | Yok | `tmdbApi.js:1243 searchMulti` kişi sonuçlarını **eliyor** (poster_path şartı). `profile_path`'li person sonuçlarını ekle + `CastExplorerModal.js` filmografi akışına bağla. |
| 8 | **Mood / tür / "ruh hali" arama** | 4 | ✅ | — | — | `channelScheduler.js:686 RUH_HALLERI` + `RandomPickerModal.js` + `DiscoverView` tür pill'leri zaten kapsıyor. |
| 9 | **Sesli arama** | 3 | ❌ | — | **YASAK** | Android WebView'de Web Speech yok (kısıt). Önerilmez. |
| 10 | **Download kalite seçimi / veri tasarrufu** | 4 | ❌ | M | Yok | `offlineManager.js:454 startOfflineDownload` kalite parametresi almıyor; `storage.js:1876 preferredResolution` ayarı ölü. Kaynak `qualityRank` (`providerRuntime/playback.js`) sinyaliyle indirilecek varyantı seç. |
| 11 | **Smart Downloads (izlenince sil, sıradakini indir)** | 4 | ❌ | M | Yok | `offlineManager.js:615 deleteOfflineMedia` + `storage.js:1041 markEpisodeWatched` var. "İzlendi → cihazdan sil" + "sıradaki bölümü indir" kuralı; arka plan timer olmadan, oynatma biterken tetikle. |
| 12 | **Profil kilidi (PIN) + yaş kademeleri (Küçük/Genç)** | 4 | 🟡 | M | Yok | Profil var (`storage.js:118,319`) ama kilit yok; yalnız global yönetici PIN'i var (`storage.js:213`). Profil başına PIN + `isItemKidSafe` (`storage.js:326`) üstüne yaş kademesi ekle. |
| 13 | **"Listem" + izleme listesi** | 4 | ✅ | — | — | `storage.js:1779`. |
| 14 | **İzlemeye devam et / kaldığı yer** | 5 | ✅ | — | — | `storage.js:1366,1648` · `HomeView.js:137`. |
| 15 | **Top-10 rozeti / sıralama numarası** | 3 | ❌ | S | — | #4 ile aynı iş; `MediaCard.js`'e sıra numarası katmanı. |
| 16 | **Altyazı/dublaj dil seçimi** | 5 | ✅ | — | — | `PlayerModal.js` dublaj/altyazı sekmeleri (`tab-dubbed`/`tab-subtitled`, ~3653) + `providerRuntime/languages.js`. |
| 17 | **Altyazı görünüm ayarları** | 3 | ✅ | — | — | `PlayerModal.js:5621,5756`. |
| 18 | **Sesli betimleme (audio description) / SDH** | 2 | ❌ | — | Kaynak yok | Sağlayıcı akışlarında AD/SDH parçası yok. |
| 19 | **Jeneriği atla / sonraki bölüm** | 5 | ✅ | — | — | `PlayerModal.js:4514,4561,4577,4904`. (Detay: #2 ile iyileştir.) |
| 20 | **Çift-tık ±10 sn sarma, jest kontrolü** | 4 | ✅ | — | — | `PlayerModal.js:5066` (dblclick), ses/parlaklık swipe (~6250). |
| 21 | **Oynatma hızı / uyku zamanlayıcı / ekran kilidi** | 4 | ✅ | — | — | `PlayerModal.js:5942,6030,5066`. |
| 22 | **PiP (resim içinde resim)** | 3 | ✅ | — | — | `PlayerModal.js:6002` + Canlı TV PiP (`LiveTvView.js:229`). |
| 23 | **Post-play önerileri (bölüm sonu keşif)** | 4 | 🟡 | S | — | Binge kartı var (`PlayerModal.js:4514`); seri değilse/son bölümde öneri göstermiyor. #2'nin parçası. |
| 24 | **Thumbs up/down → öneri öğrenmesi** | 4 | 🟡 | M | — | Favori var (`storage.js:1699`); oda içi yıldız var (`DecisionRoomModal.js:71`). Genel "beğen/beğenme" sinyali yok. Kaynak zekâsı beynine (`sourceIntelligence.js:43`) içerik değil kaynak öğretiyor. |
| 25 | **Satır sıralamasının kişiselleştirilmesi ("My Netflix")** | 3 | ❌ | M | — | `HomeView.js` rail'leri statik TMDB kategorileri (`HomeView.js:93-100`). İzleme geçmişine göre rail sırası/ağırlığı; KANALIM mantığı (`channelScheduler.js`) yeniden kullanılabilir. |
| 26 | **Bildirim merkezi** | 4 | 🟡 | S | — | `NotificationCenterModal.js:13` var ama içerik statik/örnek. |
| 27 | **İzleme geçmişi yönetimi (kaldır/temizle)** | 4 | ✅ | — | — | `LibraryView.js:173,687` · `storage.js:995` · `DataManagerModal.js:106`. |
| 28 | **Veri yedekle/geri yükle** | 3 | ✅ | — | — | `DataManagerModal.js:7`. |
| 29 | **Profil yönetimi (avatar/renk/çocuk)** | 4 | ✅ | — | — | `ProfileModal.js:5` · `storage.js:368`. |
| 30 | **Ebeveyn kilidi + engelli içerik** | 4 | ✅ | — | — | `storage.js:213,237,282`. |
| 31 | **Keşif/kategori taraması + filtre** | 4 | ✅ | — | — | `DiscoverView.js:113-175`. |
| 32 | **Fragman + kadro + benzer** | 4 | ✅ | — | — | `DetailView.js:130,289,322,434`. |
| 33 | **"Play Something" (rastgele)** | 4 | ✅ | — | — | `RandomPickerModal.js`. |
| 34 | **Canlı TV + EPG + kanal favorileri** | 4 | ✅ | — | — | `LiveTvView.js:19,181,465` · `epgService.js`. |
| 35 | **Canlı etkinlik merkezi + hatırlatıcı** | 3 | ❌ | M | Kaynak | Netflix spor/WWE canlı etkinlikleri: bizde kaynak+lisans yok. EPG tabanlı "programa hatırlat" istemci-tarafı yapılabilir. |
| 36 | **Ortak izleme partisi (senkron)** | 5 | ✅ | — | — | `DecisionRoomModal.js` · `anonymousDecisionRoom.js:76,123`. **DOKUNULMAZ.** |
| 37 | **TV/kumanda (D-pad) hızlı-seçim UX** | 3 | 🟡 | L | Platform | `MediaCard.js:231 tabindex` ve Canlı TV ok tuşları (~1934) var; tam uzamsal odak navigasyonu yok. Telefon öncelikli olduğundan düşük öncelik. |
| 38 | **Erişilebilirlik (ekran okuyucu, kontrast)** | 3 | 🟡 | M | — | ARIA etiketleri dağınık mevcut (`aria-label`'lar); odak yönetimi yalnız `ProfileModal.js:349`. Denetim + sistematik etiketleme gerekir. |
| 39 | **Netflix Games / interaktif içerik** | 1 | ❌ | — | Ürün dışı | CinePulse bir medya oynatıcı; oyun motoru yok. Önerilmez. |
| 40 | **Belgesel / kültür içerik satırları** | 3 | ✅ | — | — | `HomeView.js:499` belgesel rail + `Perseus` (belgesel) sağlayıcı (`pluginCatalog.js:70`). |
| 41 | **Cast/AirPlay ile TV'ye gönder** | 2 | ❌ | — | Platform | WebView/native player; ayrı gönderim kanalı yok ve gerekmiyor (native oynatıcı). |

---

## C. ÖNERİ SIRALAMASI — İLK 3 (S/M maliyet, yüksek değer)

### 🥇 Öneri 1 — "Çünkü bunu izledin" kişiselleştirilmiş satırlar (Maliyet: M, Değer: 5/5)

**Neden:** Netflix'in en güçlü retention halkası; bizde ev rail'leri **tamamen statik**
(`HomeView.js:93-100` — popüler/top/anime/belgesel). Halbuki kişisel sinyal **elimizde**:
`storage.js:1599 getGroupedWatchHistory()`, `:1699 getFavorites()`, `:1779 getWatchlist()`.
TMDB `recommendations`/`similar` ucu zaten kullanılıyor (`DetailView.js:130`). Yeni altyapı yok.

**MVP kesiti (yapılır):**
1. `HomeView.js`'e "İzlemeye Devam Et"ten **sonra** 2-3 dinamik rail ekle: en son izlenen
   2-3 yapımdan biri "Çünkü **{başlık}** izledin", biri favori türünden karışım.
2. Tohum seçimini `storage.js` geçmişinden yap (son 30 gün + tamamlanmamış öncelikli).
3. `tmdbApi.js` üzerinden `recommendations` çek; sonucu `localStorage`'ta **6 saat** cache'le
   (CF'siz, istemci-tarafı; yeniden açılışta ağ beklemez).
4. Rail başlığına **gerekçe** yaz ("Çünkü X izledin") — Netflix'in "Neden önerildi?" mantığı;
   mevcut `flowPilot.js` neden-metni üslubuyla tutarlı olsun.
5. Çocuk profili aktifken (`storage.js:319 isKidProfileActive`) rail'i `isItemKidSafe`
   ile süz (`storage.js:326`); kimlik kapıları (`adPuan/yilUyar`) zaten oynatma anında çalışır.

**MVP kesiti (yapılmaz):**
- Merkezi toplama / KNN / ML servisi YOK (ücretsiz tier + istemci-tarafı ilkesi).
- Kişi verisi (PII) sunucuya gönderilmez; tüm hesaplama cihazda.
- Statik rail'ler silinmez, yalnız **dinamik olanlar öne** alınır.
- Ayrı bir "öneri eklentisi" açılmaz; mevcut `ProviderAggregator`/oynatma akışına dokunulmaz.

---

### 🥈 Öneri 2 — "Sıradaki Bölüm" ayarını gerçek yap + post-play ekranı (Maliyet: S, Değer: 5/5)

**Neden:** Geri sayım **zaten var** (`PlayerModal.js:4514,4577,4904`) ama
`storage.js:1875 autoplayNext` ayarı **hiçbir yerde okunmuyor** — kullanıcı kapatırsa bile
çalışmaya devam eder (ölü ayar). Ayrıca seri değilse / son bölümde hiçbir "sırada ne var"
ekranı yok. Netflix'in en çok kullanılan iki mikro-özelliği burada; maliyet S.

**MVP kesiti (yapılır):**
1. `getUserSettings().autoplayNext` değerini oku (`storage.js:1872`); `false` ise
   `bingeTimer` hiç kurulmasın (`PlayerModal.js:4904`).
2. Oynatma biterken (`ended`) **post-play kartı**: seri ise "Sonraki bölüm", son bölüm/film ise
   TMDB `recommendations`'tan 3 öneri (`DetailView.js:130` ile aynı uç).
3. Geri sayımı **iptal edilebilir** yap (kart zaten `bingeCloseBtn`'e sahip, `PlayerModal.js:4596`).
4. `preferredResolution` (`storage.js:1876`) ölü ayarını da kaynak seçimine bağla:
   `providerRuntime/playback.js` kalite sıralamasında önceliği bu ayardan al.
5. Ayar erişimini mevcut ayarlar menüsüne (`SetupWizardModal.js`) küçük bir anahtar olarak ekle.

**MVP kesiti (yapılmaz):**
- Gerçek "skip recap"/intro işaretçisi uydurulmaz (veri yok; mevcut zaman-sezgisel yeterli).
- Arka plan zamanlayıcı kurulmaz (WebView kısıtı); her şey `ended`/`timeupdate` içinde.
- Öneriler oynatıcı içinde kaynak taraması başlatmaz; yalnız TMDB meta + kullanıcı eylemiyle açılır.

---

### 🥉 Öneri 3 — Gerçek hatırlatıcılar + "Yeni ve Yakında" (Maliyet: M, Değer: 4/5)

**Neden:** `NotificationCenterModal.js:13 DEFAULT_NOTIFICATIONS` **tamamen statik** örnek
veri; `getNotifications()` (:55) yalnız onu döndürüyor. Netflix'te bildirim, izleyiciyi geri
getiren ana araçtır. Elimizde sinyal var: `storage.js:1779 getWatchlist()` + TMDB
`first_air_date`/`next_episode_to_air`. Yeni altyapı gerekmez.

**MVP kesiti (yapılır):**
1. Uygulama **açılışında** (arka plan timer YOK) izleme listesindeki yapımları TMDB'den
   tara: yaklaşan çıkış tarihi / yeni bölüm varsa bildirim üret.
2. İzlenen serilerin "sonraki bölüm" tarihini `getGroupedWatchHistory()` (`storage.js:1599`)
   üzerinden türet; "Yeni bölüm yayında" kartı üret.
3. Bildirimleri `localStorage`'ta tut; `getUnreadNotificationCount()` rozetini Navbar'da
   canlı tut (mevcut `NotificationCenterModal.js` rozet akışı).
4. Tek tıkla içeriğe git (zaten `openPlayerModal`/`#detail` bağlı, `NotificationCenterModal.js`).
5. Yeni rail: "Yakında" (izleme listesi + yaklaşan çıkış) — mevcut rail altyapısı (`HomeView.js:106 renderInfiniteRail`).

**MVP kesiti (yapılmaz):**
- Web Push / FCM / arka plan servisi YOK (ücretsiz tier + WebView kısıtı).
- Kullanıcı izni olmadan bildirim yok; tümü cihaz-içi.
- Merkezi bildirim toplama sunucusu yok.
- Bildirim, kaynak sağlayıcı katmanına veya kimlik kapısına dokunmaz.

---

## D. ÖNERMİYORUZ (Netflix'te var, bize uymaz)

| Netflix özelliği | Neden önermiyoruz (tek satır) |
|---|---|
| **Hover/odak video önizleme** | Her kartta video = mobil bant genişliği + WebView batarya maliyeti; `hoverPreviewsEnabled` ayarını canlandırmak yerine gizli tutmak doğru. |
| **Sesli arama** | Android WebView'de Web Speech API yok — kısıt gereği teknik olarak imkânsız. |
| **Gerçek ülke "Top 10" sıralaması** | Merkezi toplama + ölçekli backend ister; ücretsiz tier sınırını aşar (yalnız istemci vekili #4). |
| **Netflix Games / interaktif içerik** | Ürün bir medya oynatıcı; oyun motoru ve içerik hattı yok, ROI negatif. |
| **Netflix Live (spor/WWE) lisanslı etkinlik merkezi** | Kaynak ve yayın hakkı yok; korsan canlı etkinlik kuralımıza da aykırı. |
| **Sesli betimleme (AD) / SDH** | Sağlayıcı akışlarında ses/altyazı parçası yok; içerik işçiliği maliyeti ölçek dışı. |
| **Cast/AirPlay ile TV'ye gönder** | Platform kısıtı + native oynatıcımız zaten tam ekran; ayrı gönderim kanalı gereksiz. |
| **Abonelik/ödeme/hesap katmanı** | CinePulse ürün modeli hesapsız/cihaz-içi; eklenmesi mimariyi ve gizlilik ilkesini bozar. |
| **4K HDR / Dolby Atmos rozetleri** | Kaynak sağlayıcı akışları bunu tutarlı sunmuyor; yanıltıcı rozet = kullanıcı güveni kaybı. |
| **Tam uzamsal D-pad TV navigasyonu (XL)** | Birincil hedef Android telefon; maliyet yüksek, kullanım düşük (mevcut tabindex/ok tuşları yeterli). |
| **Gerçek "Skip Recap"** | Bölüm recap işaretçisi kaynağımızda yok; uydurma zaman aralığı yanlış atlama riski taşır. |
| **Profil aktarımı / cihazlar arası hesap** | Sunucu + kimlik gerektirir; gizlilik ve ücretsiz tier ilkesiyle çelişir. |

---

## E. Belirsizlikler / dikkat notları

- **"aroma arama"** ifadesi büyük olasılıkla "arama" (search) imlası; mood/ruh-hali arama
  olarak yorumlandı ve zaten mevcut (`channelScheduler.js:686`, `RandomPickerModal.js`). Farklı
  kastedildiyse netleştirilmeli.
- Netflix'in bazı özellik adları (ör. "A Story of... wall", "Netflix Live") bölgesel/versiyona
  göre değişir; burada **kararlı bilinen** özellik seti esas alındı. Kesin istatistik/ürün
  iddiası yazılmadı.
- `storage.js` satır numaraları bu analiz anındaki dosyaya aittir (dosya aktif geliştiriliyor).
- `offlineManager.js:454 startOfflineDownload` HLS parça indirmesi destekliyor; kalite
  seçimi eklenirken HLS varyant seçimi `providerRuntime/playback.js qualityRank` ile hizalı olmalı.

---

*Tek yazım hedefi bu dosyadır; kod/uygulama dosyalarına dokunulmadı, commit yapılmadı.*

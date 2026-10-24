# CinePulse Studio — Kullanıcıyı Negatif Etkileyen Noktalar (Kod Denetimi)

> v1.1.78 · 2026-10-24 · Salt okur tarama · ~15 dk bütçe

---

## 🔴 KRİTİK (Kullanıcıyı bloke eden / veri kaybı / güven kıran)

| # | Bulgu | Dosya:Satır | Neden Kötü | Düzeltme Önerisi |
|---|-------|-------------|------------|------------------|
| 1 | **Sağlayıcı başına 30 sn tavanı ihlal ediliyor** — `SAĞLAYICI_TAVANI_MS = 15_000` (vekil.js:98), yavaş ağda 45 sn'ye çıkar ama **toplam tarama bütçesi 75 sn** (vekil.js:51). 43 çekirdek × 15 sn = 645 sn gerekir, havuz 8'lik (vekil.js:62) → **çoğu sağlayıcı hiç denenmeden kesiliyor**. | `src/providers/vekil.js:51,62,98` | Kullanıcı "kaynak az" derken aslında tarama süresi yetmiyor; 31 kayıt hiç denenmiyor. | `BUTCE_MS` ≥ `SAĞLAYICI_TAVANI_MS × (kayıt_sayısı / HAVUZ_BOYU)` kuralı uygula (ör. 43/8 × 15 sn ≈ 81 sn minimum). |
| 2 | **Boş `catch {}` blokları yaygın** — 19 çekirdek dosyasında 100+ kez `} catch {}` (harleyQuinn.js:368, constantine.js:369, spiderMan.js:368, winterSoldier.js:399, ironMan.js:368, blackAdam.js:368, daredevil.js:368, hawkman.js:369, zatanna.js:369, superman.js:388 vb.). Hatalar sessizce yutuluyor, kullanıcı "boş liste" görüyor ama **hata nedeni hiç bilinmiyor**. | `src/providers/cekirdekler/*.js` (çoklu) | Hangi sağlayıcı neden 실패 ettiği izlenemiyor; debug imkansız. | En az `console.warn('[kahraman]', id, hata)` ekle; üretimde log toplayıcıya bağla. |
| 3 | **`fetch` çağrılarında timeout YOK** — `src/services/kaynak/dramaDizilerimScraper.js:107`, `dramalarScraper.js:63`, `providerAggregator.js:225`, `LiveTvView.js:1277,1421`, `turkishLiveSources.js:155,191,767` vb. `AbortSignal.timeout` kullanılmamış; ağ takılırsa **sonsuz bekleme** olur. | `src/services/kaynak/*.js`, `src/views/LiveTvView.js`, `src/services/canli/*.js` | Mobil/WebView'da 3G/köprülü ağda UI donuyor, kullanıcı kilitlenmiş sanıyor. | Tüm `fetch`'e `signal: AbortSignal.timeout(8000..15000)` ekle; `vekil.js:482-500` `iptalSinyali` yardımcısını kullan. |
| 4 | **SetupWizardModal ayarları kaydedilmiyor** — Adım 2'de `opt_buffer_size`, `opt_sub_lang`, `opt_auto_next`, `opt_resume` radio/checkbox `localStorage`'a yazıyor (SetupWizardModal.js:544-553) ama **`getUserSettings()` bu anahtarları okumuyor** (storage.js:1898-1906). Ayarlar UI'da görünüyor ama **oynatıcı davranışını değiştirmiyor**. | `src/components/SetupWizardModal.js:544-553` + `src/services/altyapi/storage.js:1898-1906` | Kullanıcı "otomatik sonraki kapalı" der ama épisode bitince yine geçiyor; "buffer 250 MB" der ama RAM aynı. | `getUserSettings()` default objesine bu 4 anahtarı ekle; `PlayerModal`/`offlineManager` okusunu sağla. |
| 5 | **PlayerModal focus hırsızlığı** — `panel.querySelector('input')?.focus()` (PlayerModal.js:995) sohbet açılırken çalışıyor ama **modal kapatıldığında `previousFocus?.focus()` YOK**. Klavye kullanıcısı odak kaybediyor, `Tab` döngüsü bozuluyor. | `src/components/PlayerModal.js:995` | Erişilebilirlik: screen-reader/klavye kullanıcısı "nerdeyim?" diye kayboluyor. | `openRoomChat` girişinde `previousFocus = document.activeElement` tut; `close`/`hidden` durumunda `previousFocus?.focus()` çağır. |
| 6 | **TraktModal / RandomPickerModal / DecisionRoomModal — focus restore YOK** — Hepsi `modalContainer` oluşturuyor, `closeModal` sadece `remove()` yapıyor (TraktModal.js:277-278, RandomPickerModal.js:333-339, DecisionRoomModal.js:368). `previousFocus` tutulmuyor. | `src/components/TraktModal.js:277`, `src/components/RandomPickerModal.js:333`, `src/components/DecisionRoomModal.js:368` | Modal zinciri (profil → trakt → ayar) sonrası kullanıcı `body`'de kalıyor, önceki butona dönemez. | Her modal `open` anında `previousFocus = document.activeElement`; `close` anında `previousFocus?.focus()`. |
| 7 | **`forEach(async ...)` seri await yanılgısı** — `LibraryView.js:465`, `DownloadsView.js:125` `forEach(async img => { await ... })` yazılmış; **`forEach` promise beklemez**, döngü biter, resimler rastgele yükler, hata yakalanmaz. | `src/views/LibraryView.js:465`, `src/views/DownloadsView.js:125` | Önbellekli afişler yüklenmez, kullanıcı "bozuk görseller" görür; hata sessizce yutulur. | `for (const img of imgs) { await ... }` veya `await Promise.all(imgs.map(async ...))` yap. |
| 8 | **Navbar arama debounce 0 ms** — `setupSearchInput` (Navbar.js:305) `setTimeout(async () => { await searchMulti(query) }, 0)` yazılmış; **her keystroke'ta istek atıyor**. `searchGeneration` koruması var ama network spam oluyor. | `src/components/Navbar.js:305` | TMDB rate-limit (429) yiyecek; kullanıcı yazarken "sonuç yok" yanıp söner. | En az `150-220 ms` debounce (DecisionRoomModal.js:289 örneği gibi). |
| 9 | **PlayerModal boş-durum rehberi tek otomatik deneme** — `updateSourceEmptyGuide` (PlayerModal.js:1944-1950) `otomatikYenilemeYapildi` bayrağıyla **tek sefer** 3 sn sonra `startServerDiscovery()` çağırıyor. İkinci 0 kaynakta **kullanıcı "Tekrar dene" butonuna basmak zorunda**. | `src/components/PlayerModal.js:1944-1950` | Geçici ağ dalgalanmasında (ör. 5 sn) kullanıcı eliyle tıklamak zorunda; "otomatik" söylenip yapmıyor. | `otomatikYenilemeYapildi` sayacı tut (max 2-3); üst üste 0 gelirse dur. |
| 10 | **Canlı TV EPG `setInterval` sızıntısı riski** — `epgService.js:216` `refreshTimer = setInterval(...)` başlatılıyor, `clearInterval` **sadece `stopEpgRefresh` içinde** (epgService.js:224). Bu fonksiyon **hiç çağrılmıyor** (grep: çağrı yok). Sayfa değiştirilse bile interval çalışmaya devam ediyor. | `src/services/canli/epgService.js:216,224` | Bellek/CPU sızıntısı; 10 dk aralıkla fetch yapıyor, kullanıcı fark etmez ama pil/ısınma. | `stopEpgRefresh` `LiveTvView` unmount/`visibilitychange`/`beforeunload` içinde çağrılmalı. |

---

## 🟡 ORTA (Kullanıcı deneyimini bozan / yanlış yönlendiren)

| # | Bulgu | Dosya:Satır | Not |
|---|-------|-------------|-----|
| 1 | **PlayerModal "Bu içerik için kaynak yanıt vermedi" metni** — `getSourceEmptyGuideHtml` (PlayerModal.js:1910-1912) kısa dizide "Dora ve Rhea bu bölüm için oynatılabilir hat vermedi" diyor. **Kod adları (Dora/Rhea) kullanıcıya anlamsız**; "sağlayıcı" demez. | `src/components/PlayerModal.js:1910-1912` | "Kaynak sunucuları yanıt vermedi" gibi soyut ifade tercih edilmeli. |
| 2 | **Navbar arama "TMDB Sonucu Bulunamadı"** — `Navbar.js:326` büyük başlıkla çıkıyor, altında "Kısa Dizilerde Ara" kartı var. Kullanıcı "arama bozulmuş" sanıyor. | `src/components/Navbar.js:326` | "TMDB'de sonuç yok; kısa dizi hub'ında ara" tonu yumuşatılmalı. |
| 3 | **DetailView "İçerik bulunamadı" boş sayfa** — `DetailView.js:84-87` sadece `h2` basıyor; **yeniden dene butonu, arama linki, ana sayfa dönüşü YOK**. | `src/views/DetailView.js:84-87` | Kullanıcı köşeye sıkışır; en az "Ana sayfaya dön" butonu koy. |
| 4 | **Toast container yoksa `showToast` sessizce çıkıyor** — `Toast.js:7-8` `if (!container) return;`. `toast-container` DOM'da yoksa (ör. SSR/ilk render) **hata/bilgi kaybolur**. | `src/components/Toast.js:7-8` | Kritik bildirimler (güncelleme, indirme hatası) kullanıcıya ulaşmaz. | `document.body.appendChild` fallback ile container yarat. |
| 5 | **HeroSlider `trailersEnabled === false` ayarı okunuyor ama `trailersEnabled` default `true`** — `HeroSlider.js:271` kontrol var, `storage.js:1905` default `true`. Kullanıcı "fragman istemiyorum" dese bile **ilk açılışta fragman yüklenmeye başlar** (cache'den önce). | `src/components/HeroSlider.js:271`, `src/services/altyapi/storage.js:1905` | Veri/bantwidth harcanıyor; ayar ikinci açılışta işler. | `getUserSettings()` sync olana kadar `trailersEnabled` okumayı ertele veya default `false` yap. |
| 6 | **Canlı TV `channelScheduler` boş programda `neden` alanı numaralanmamış** — `channelScheduler.js:205` "boş program: boş dizi döner; neden'i dizi üstünde numaralanmayan bir alanda". UI'da "Program verisi yok" yerine **sessiz boş liste** çıkıyor. | `src/services/canli/channelScheduler.js:205` | Kullanıcı "kanallar gelmedi" derken aslında EPG boş. | Boş programda `neden: 'epg-bos'` döndür; `LiveTvView` bunu "EPG henüz hazır değil" olarak göster. |
| 7 | **`cp_kahraman` katman anahtarı (localStorage) dokümante edilmemiş** — `providerAggregator.js:34-42` "gizli modda localStorage yok → varsayılan: açık". Kullanıcı bu anahtarı bilmez, "telefonda kaynak az" derken aslında katman kapalıymış olabilir. | `src/services/kaynak/providerAggregator.js:34-42` | Ayar UI'da görünmüyor; power-user/hata ayıklama için gizli kalıyor. | SetupWizard veya Ayarlar modalına "Hafif tarama modu" toggle'ı ekle. |
| 8 | **`startupBudget.collectWithin` 9 sn sabit** — `startupBudget.js:2` `timeoutMs = 9000`. Yavaş ağda (RTT 3-4 sn) **ilk 3-4 rail dolmadan kesiliyor**; kullanıcı "içerik yok" görüyor. | `src/services/kabuk/startupBudget.js:2` | `HomeView.js:19` bunu kullanıyor; `collectWithin` sonuçları `Promise.allSettled` gibi beklemiyor. | `timeoutMs` ayarlanabilir yap (ör. `localStorage.cp_startup_budget_ms`); yavaş ağda 15-20 sn ver. |
| 9 | **PlayerModal "Otomatik sonraki" toast mesajı karıştırıcı** — `PlayerModal.js:5149` `"Otomatik geçiş kapalı — sonraki bölümü kendin seçebilirsin."` **pozitif cümle gibi yazılmış** ama aslında "kapalı" bildirimi. Kullanıcı "tamam, kapalıymış" derken bir sonraki bölüm otomatik başlamıyor. | `src/components/PlayerModal.js:5149` | Ton: "Otomatik sonraki bölme **kapalı**. İstersen manuel başlat." netleşir. | Mesajı `"Otomatik sonraki bölüm kapalı. Manuel başlatmak için 'Sonraki' butonunu kullan."` yap. |
| 10 | **DecisionRoomModal "Sonuç bulunamadı" iki yerde farklı** — `DecisionRoomModal.js:258` moderatörde, `308` katılımcıda aynı metin ama biri `decision-room-search-status` diğeri de aynı class; **stil tutarsızlığı** olabilir. | `src/components/DecisionRoomModal.js:258,308` | Küçük ama bakım yükü; tek `renderNoResults()` yardımcısi çekilsin. | Ortak `renderSearchStatus(root, message)` fonksiyonu yaz. |

---

## 🟢 DÜŞÜK / İYİLEŞTİRME (Kod kalitesi / bakım)

| # | Bulgu | Dosya:Satır | Not |
|---|-------|-------------|-----|
| 1 | `vekil.js:802` `// eslint-disable-next-line no-await-in-loop` — kimlik fallback döngüsünde kasten `await` içinde; **doğru kullanım**, uyarı bastırılmış. | `src/providers/vekil.js:802` | İyi: kasıtlı seri deneme (IMDB → TMDB). |
| 2 | `vekil.js:73` `yarisla` helper — her sağlayıcı için **yarış koşullu timeout** (Promise.race mantığı). Sağlayıcı sinyal yoksaysa bile adaptör zamanında döner. | `src/providers/vekil.js:715-723` | Güvenli desen; korundu. |
| 3 | `vekil.js:482-500` `iptalSinyali` — `AbortSignal.any` + `AbortSignal.timeout` polyfill ile **hem dış sinyal hem timeout** birleşik. | `src/providers/vekil.js:482-500` | Modern ve sağlam. |
| 4 | `PlayerModal` `source-empty-guide` — **kod adlarıyla** "denendi/kapalı/yanıt vermedi" sayacı (PlayerModal.js:1915-1918). Gerçek site adı sızmıyor. | `src/components/PlayerModal.js:1915-1918` | Kurala uygun. |
| 5 | `offlineManager.js` indirme hatalarında `throw new Error('...')` — **yakalanıp toast'a dönüştürülmüyor** (LibraryView.js:478-482 `button.disabled = true` ama hata mesajı `showToast` yok). | `src/services/kabuk/offlineManager.js:239` | İndirme hatası kullanıcıya "İndirme başarısız" toast'ı olarak gitmeli. |

---

## 📋 ÖZET — 🔴 KRİTİK LİSTESİ (10 adet)

1. **Sağlayıcı tavanı vs toplam bütçe uyuşmazlığı** → `vekil.js:51,62,98` — 31 kayıt hiç denenmiyor.
2. **100+ boş `catch {}`** → `cekirdekler/*.js` — hatalar sessizce yutuluyor.
3. **Fetch timeout eksikliği** → `kaynak/*.js`, `LiveTvView.js`, `canli/*.js` — sonsuz bekleme.
4. **SetupWizard ayarları işlevsiz** → `SetupWizardModal.js:544-553` + `storage.js:1898` — UI'da var, davranış yok.
5. **PlayerModal focus restore yok** → `PlayerModal.js:995` — klavye kullanıcısı odak kaybediyor.
6. **3 Modal focus restore yok** → `TraktModal.js:277`, `RandomPickerModal.js:333`, `DecisionRoomModal.js:368` — modal zinciri sonrası kaybolma.
7. **`forEach(async)` yanılgısı** → `LibraryView.js:465`, `DownloadsView.js:125` — await işlemez, hata yakalanmaz.
8. **Navbar arama 0 ms debounce** → `Navbar.js:305` — TMDB rate-limit riski, UI titreşiyor.
9. **Boş durum tek otomatik deneme** → `PlayerModal.js:1944-1950` — kullanıcı eliyle tıklamak zorunda.
10. **EPG `setInterval` temizlenmiyor** → `epgService.js:216,224` — sayfa kapanınca bile fetch devam ediyor.

---

## 📊 SAYI ÖZETİ

| Şiddet | Adet |
|--------|------|
| 🔴 Kritik | 10 |
| 🟡 Orta | 10 |
| 🟢 Düşük/İyi | 5 (pozitif desenler dahil) |

---

## 🛑 DOĞRULANAMADI / NOT DÜŞÜLEN

- **Canlı TV geçici kapalı** — bilerek karar (yapı notunda), bulgu olarak yazılmadı.
- **Gerçek site adı sızıntısı** — `sourceLabels.js:39` "Nexus" yutucusu var; grep'te ifşa yok.
- **Şarj/pil iddiaları** — "pil" sadece CSS pill (buton) anlamında geçiyor; yanlış vaat yok.
- **`providerRuntime/batch.js`** — dosya mevcut değil (temizlik dalgasında silinmiş); `vekil.js` içinde `havuzIslet` var.
- **Mobil 300 sn duvarı** — tek seferlik iş (indirme) `offlineManager.js` içinde `AbortSignal` ile bölünmüş; 5 dk cache tavanı (PlayerModal.js:7441) makul.

---

> **Sonuç**: En acil 3 öğe: (1) bütçe/tavan dengesi, (2) boş catch blokları, (3) fetch timeout. Bunlar çözülmezse kullanıcı "kaynak yok" derken aslında tarama yarıda kesilmiş / hata gizlenmiş / ağ takılıyor.
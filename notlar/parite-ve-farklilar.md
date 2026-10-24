# CinePulse — Parite ve Farklılaştırıcılar (2026-10-24)

> Kaynaklar: `notlar/durum-envanteri.md` (v1.1.78, birincil), `notlar/netflix-ozellik-analizi.md`, `notlar/ai-cagi-ozellikleri.md`; web: reviews.org subtitle settings (erişim 2026-06-16), dyerbolical.com 2026 showdown (erişim 2026-10-24). Kod değişikliği yok; her "var" iddiası dosya:satır.

## 1. Parite matrisi (Netflix + Prime Video + Disney+ ortak)

| # | Özellik | 3'ünde de var mı? | CinePulse'ta VAR? (dosya:satır) | Eklenmesi mümkün mü? (nasıl + dosya) | Maliyet |
|---|---|---|---|---|---|
| 1 | Profil çokluğu | Evet | ✅ `ProfileModal.js:37-98`; `storage.js:296-307` | — (zaten var) | — |
| 2 | İzlemeye devam et | Evet | ✅ `HomeView.js:137`; `storage.js:1366,1648` | — | — |
| 3 | Listem (izleme listesi) | Evet | ✅ `storage.js:1779` | — | — |
| 4 | İndirme (çevrimdışı) | Evet | ✅ `offlineManager.js:454`; `DownloadsView.js:15` (yalnız Android) | — | — |
| 5 | Intro atlama | Evet | ✅ `PlayerModal.js:4514,4561,4577,4904` | — | — |
| 6 | Rekap atlama | Kısmi (yalnız Prime X-Ray Recaps) | 🟡 zaman-sezgisel var; gerçek recap işareti yok | TMDB episode overview ile "önceki bölüm özeti" kartı; `PlayerModal.js` + `tmdbApi.js` | M |
| 7 | Hover'da fragman önizleme | Evet (web) | ❌ `storage.js:1903` ölü; implementasyon yok | Önermiyoruz (WebView batarya/bant); gizli tut | L |
| 8 | Altyazı/ses özelleştirme | Evet | ✅ `PlayerModal.js:5621,5756,5950-5964` (web); native `:6845` | — | — |
| 9 | Çocuk profili + kontrol | Evet | ✅ temel `storage.js:319,326`; `ProfileModal.js` | Profil başına PIN + yaş kademesi; `storage.js:319-329` + `ProfileModal.js` | M |
| 10 | Bölüm atlatma (sonraki) | Evet | 🟡 `PlayerModal.js:50,5139-5160`; ayar ölü `storage.js:1875` | `autoplayNext` ayarını gerçekten oku; `PlayerModal.js:4904` | S |
| 11 | Kalite seçimi menüsü | Evet | ❌ menü yok; `preferredResolution` ölü `storage.js:1900` | Kalite menüsü + `providerRuntime/playback.js` önceliği; `PlayerModal.js` | M |
| 12 | "Bugün neler var"/yeni rail | Evet | ❌ statik rail'ler; trending yalnız hero'da | "Yakında" rail; `HomeView.js:106` + `tmdbApi.js fetchTrending` | M |
| 13 | Çoklu dil ses (dublaj) | Evet | ✅ `PlayerModal.js` dublaj/altyazı sekmeleri (~3653); `providerRuntime/languages.js` | — | — |
| 14 | X-Ray benzeri yapım bilgisi | Hayır (yalnız Prime) | 🟡 `CastExplorerModal.js`; yalnız `DetailView.js:973` | Oynatıcı içi overlay; `PlayerModal.js` + `CastExplorerModal.js` + `tmdbApi.js` | M-L |
| 15 | Ses/video ayarları | Evet (hız: Disney+'ta yok) | ✅ `PlayerModal.js:6269-6286,5950-5964,6030,5066,6002` | — | — |
| 16 | Resume (kaldığı yer) | Evet | ✅ `PlayerModal.js:542-584` | — | — |
| 17 | Bölüm ilerleme çubuğu | Evet | ✅ `HomeView.js:137` | — | — |
| 18 | İzleme geçmişi (seslendirme) | Evet | ✅ `storage.js:995,1041`; `LibraryView.js:173,687` | — | — |

## 2. Üçünde de olmayıp CinePulse'un olabilecekleri (farklılaştırıcılar)

1. **Çoklu sağlayıcı toplama + kaynak zekâsı** — *Acı:* tek serviste içerik yoksa izleyemeyen kullanıcı. *Mekanizma:* `providerAggregator.js`, `sourceReliability.js`, `sourceIntelligence.js`, `flowPilot.js`.
2. **KANALIM (kişisel kanal + EPG + kuşak + ruh hali)** — *Acı:* "ne izleyeceğimi bilmiyorum" zapping. *Mekanizma:* `channelScheduler.js`, `ChannelView.js`.
3. **Karar Odası (senkron izleme + oylama + tepki)** — *Acı:* uzaktaki arkadaşlarla film seçimi tartışması. *Mekanizma:* `anonymousDecisionRoom.js`, `DecisionRoomModal.js`.
4. **Doğal dil arama** — *Acı:* arama yazmak zorlanan kullanıcı. *Mekanizma:* `services/kesif/dilArama.js`.
5. **P2P katalog (WebTorrent, salt-katalog)** — *Acı:* nadir/merkezi olmayan içerik. *Mekanizma:* `p2pService.js`.
6. **Debrid (Real-Debrid) entegrasyonu** — *Acı:* düşük kalite/buffer. *Mekanizma:* `DebridModal` (şu an ölü; bağlanacak).

## 3. Öneri — ilk 3 iş paketi

**P1 "Çünkü bunu izledin" kişiselleştirilmiş satırlar (M).** Dosyalar: `HomeView.js`, `storage.js` (`getGroupedWatchHistory`, `getFavorites`, `getWatchlist`), `tmdbApi.js`, `personalRails.js`. Kabul: son 30 gün geçmişinden 2-3 dinamik rail + gerekçe metni; 6 saat localStorage cache; çocuk profilinde `isItemKidSafe` süzme. Test: mock geçmiş + TMDB recommendations; cache TTL assert.

**P2 "Sıradaki bölüm" ayarı gerçek + post-play (S).** Dosyalar: `PlayerModal.js` (`ended`/`bingeTimer`), `storage.js` (`autoplayNext`, `preferredResolution`). Kabul: `autoplayNext=false` → bingeTimer kurulmaz; son bölümde 3 öneri kartı; iptal edilebilir geri sayım. Test: ayar toggle → davranış assert; post-play kart render.

**P3 Gerçek hatırlatıcılar + "Yakında" rail (M).** Dosyalar: `NotificationCenterModal.js`, `storage.js` (`getWatchlist`, `getGroupedWatchHistory`), `tmdbApi.js`, `HomeView.js`. Kabul: açılışta watchlist taraması → bildirim üretimi; okunmamış rozet; "Yakında" rail. Test: mock watchlist + TMDB tarihleri → bildirim sayısı assert.

---
*Çıktı ≤180 satır; kod değişikliği yapılmadı.*
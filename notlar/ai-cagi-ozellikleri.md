# AI Çağında CinePulse İçin Öneriler (tarama 2026-10-24)

Kaynak taraması: Netflix, Prime Video, YouTube, Roku ve mood-keşif uygulamaları (Moodvies, CineMood, SentiraX).
Sınıflar: arka uç yok (yalnız localStorage), ücretli GPU/API yok, tek geliştirici, TMDB ücretsiz tier + kendi Cloudflare edge worker'ları.

Öneriler etki×uygulanabilirlik skoruna göre sıralı (max 8).

## 1. Doğal dil arama (NL search) — 5×5 = 25
- **Kullanıcı yararı:** "kız arkadaşımla izleyecek gerilim bul" gibi cümleyle anında filtrelenmiş liste.
- **Nasıl:** Türkçe anahtarları (tür, yıl, puan, "beraber/tek başına") TMDB `/discover` parametrelerine (`with_genres`, `first_air_date`, `vote_average.gte`, `with_keywords`) ve `/search/keyword` ucuna map eden istemci tarafı parser; LLM gerekmez, mevcut `searchMulti` akışına eklenir.
- **Dosya:** `src/components/Navbar.js`, `src/views/DiscoverView.js`, `src/services/icerik/tmdbApi.js`
- **Kanıt:** Roku AI voice search — https://www.theverge.com/news/799564/roku-voice-assistant-ai-update (erişim 2026-10-24)

## 2. Ruh hali keşfi (mood chips) — 4×5 = 20
- **Kullanıcı yararı:** "Bugün hafif bir şey" tek dokunuşla uygun tür/yıl/puan kombinasyonu.
- **Nasıl:** DiscoverView tür sekmelerinin yanına 6-8 mood chip (rahat, gerilim, ağlamalık, aksiyon, aile, gece) eklenir; her chip önceden tanımlı genre+sort+minRating kombinasyonunu `fetchDiscoverMedia`'ya verir; sunucu çağrısı yok, yalnız TMDB discover.
- **Dosya:** `src/views/DiscoverView.js`, `src/services/icerik/tmdbApi.js`
- **Kanıt:** CineMood / Moodvies — https://www.moodvies.ai/ (erişim 2026-10-24)

## 3. Otomatik bölüm/film özeti (recap) — 4×4 = 16
- **Kullanıcı yararı:** "Nerede kalmıştım?" için spoiler'sız önceki bölüm özeti.
- **Nasıl:** TMDB TV episode details (`overview`) + önceki 1-2 bölüm overview'ları localStorage'da birleştirilir; DetailView/PlayerModal'da "Önceki bölüm özeti" kartı; isteğe bağlı edge worker'da ücretsiz LLM ile tek paragraf sentez.
- **Dosya:** `src/views/DetailView.js`, `src/components/PlayerModal.js`, `src/services/icerik/tmdbApi.js`, `src/services/altyapi/storage.js`
- **Kanıt:** Prime Video X-Ray Recaps — https://www.aboutamazon.com/news/entertainment/amazon-prime-video-x-ray-recaps (erişim 2026-10-24)

## 4. İzleme alışkanlığından tahmin (kişisel rail + saat) — 4×4 = 16
- **Kullanıcı yararı:** Akşam saatine ve son izlenenlere göre "muhtemelen bunu izlersin" satırı.
- **Nasıl:** `getGroupedWatchHistory` kayıtlarından saat-günü kovaları (localStorage) çıkarılır; `tohumSec`/`personalRails.js` ile TMDB recommendations çekilir; HomeView'da zaman-duyarlı rail; 6 saat TTL önbellek mevcut.
- **Dosya:** `src/services/icerik/personalRails.js`, `src/services/altyapi/storage.js`, `src/views/HomeView.js`
- **Kanıt:** Netflix AI personalization — https://fortune.com/2026/09/29/how-netflix-is-using-ai-to-personalize-streaming/ (erişim 2026-10-24)

## 5. AI altyazı çeviri (metin) — 4×3 = 12
- **Kullanıcı yararı:** İngilizce altyazıyı Türkçe'ye çevirip aynı VTT zamanlamasıyla oynatma.
- **Nasıl:** `altyaziServisi.js` İngilizce VTT'yi aldıktan sonra cue metinlerini ücretsiz çeviri ucuna (LibreTranslate/MyMemory, edge worker üzerinden) gönderir; çevrilmiş VTT önbelleğe alınır; ses/dublaj üretilmez.
- **Dosya:** `src/services/icerik/altyaziServisi.js`, `src/components/PlayerModal.js`
- **Kanıt:** Netflix AI subtitle localization — https://www.ign.com/articles/netflix-is-now-using-ai-for-subtitle-localization-custom-ads-and-more (erişim 2026-10-24)

## 6. Akıllı bildirim (yeni bölüm + kişisel zaman) — 4×3 = 12
- **Kullanıcı yararı:** Yeni bölüm çıktığında ve kullanıcının izleme saatine yakın push.
- **Nasıl:** `NotificationCenterModal.js` listesi; `storage.js` geçmişinden en sık izleme saatini çıkar; TVMaze `getNextEpisodeInfo` tarihleriyle eşleştir; Electron/Android yerel bildirim API'si (mevcut updatePolicy/appUpdater deseni).
- **Dosya:** `src/components/NotificationCenterModal.js`, `src/services/canli/channelScheduler.js`, `src/services/altyapi/storage.js`
- **Kanıt:** AI in OTT — https://www.vplayed.com/blog/ai-in-ott/ (erişim 2026-10-24)

## 7. Kişisel ses/altyazı tercihi öğrenme — 3×4 = 12
- **Kullanıcı yararı:** Uygulama dublaj/altyazı tercihini ve saatini hatırlayıp otomatik seçer.
- **Nasıl:** `PlayerModal.js` `cp_preferred_category` + izleme saati kovalarından basit frekans modeli (localStorage); kaynak listesi geldiğinde varsayılan kategoriyi seçer; sunucu çağrısı yok.
- **Dosya:** `src/components/PlayerModal.js`, `src/services/altyapi/storage.js`
- **Kanıt:** Netflix personalization — https://fortune.com/2026/09/29/how-netflix-is-using-ai-to-personalize-streaming/ (erişim 2026-10-24)

## 8. Akıllı poster/onarım (TMDB + önbellek) — 2×4 = 8
- **Kullanıcı yararı:** Eksik kapaklarda TMDB backdrop'tan üretilen yerel renk paleti + önbellek.
- **Nasıl:** TMDB poster/backdrop varsa kullan; yoksa `offlineManager.js` poster önbelleği ve istemci tarafı dominant-color çıkarımı; üretici image API kullanılmaz.
- **Dosya:** `src/services/kabuk/offlineManager.js`, `src/services/icerik/tmdbApi.js`
- **Kanıt (kısmi):** AI poster üreticileri — https://www.lovart.ai/blog/5-best-ai-movie-poster-generators-2026 (erişim 2026-10-24)

## Elenenler
- AI dublaj (ses klonlama/TTS): GPU + telif/lisans maliyeti; ücretsiz tier yok.
- Trailer otomatik karşılaştırma: video analizi/GPU gerektirir, kanıtlanmış uygulama yok.
- Akıllı image/poster üretimi (üretici API): ücretli ve telif riski; TMDB zaten kapak sağlıyor.
- On-device LLM (istemci): model boyutu/bellek ve anahtar sızıntısı riski.
- AI clip/hafıza (video kesit): sunucu/GPU + DRM/telif.
- Tam gerçek zamanlı çeviri dublaj: maliyet ve gecikme; metin çeviri yeterli.
- Canlı TV AI (v1.1.78'de kapalı): kapsam dışı bırakıldı.
shortcut: Bu not yalnız tarama ve uygulanabilirlik analizi; kod değişikliği yapılmadı, dosya yolları grep ile doğrulandı.

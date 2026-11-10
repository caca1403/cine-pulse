# Türkçe Dublaj Arşivi — Araştırma Raporu

> Tarih: 2026-11-10. Repo koduna dokunulmadı (yalnız okuma). Her iddia mümkün olduğunca canlı HTTP testiyle doğrulandı; doğrulanamayan satırlar `doğrulanamadı` ile işaretlendi.
> Hedef: "dünyanın en büyük Türkçe dublaj arşivi" = hangi yapımda/hangi sezonda/bölümde hangi Türkçe ses var bilgisinin en büyük **kanıtlı** veri tabanı. Video barındırmak DEĞİL.

## Özet (10 satır)

1. CinePulse'un mevcut güçlü yanı **akışın kendisinden** dil okuması (`dublajKestirme.js`: HLS `#EXT-X-MEDIA`, TS PAT/PMT, MP4 `mdhd`, MKV Language) — bu, hiç kimsenin tek tek doğrulamadığı "kanıtlı" katmandır ve korunmalı.
2. Harici metadata API'leri (OpenSubtitles, TMDB, Trakt, TVmaze, AniList/ANN) **dublaj mevcudiyetini doğrudan vermez**; en fazla "orijinal dil + çevrilmiş başlık + seslendirme kadrosu" verir; TR dublaj bilgisi için dolaylı çıkarım gerekir.
3. OpenSubtitles v6 REST (`api.opensubtitles.com/api/v1/subtitles`) **altyazı** arşividir, dublaj değil; TR altyazı hacmi büyük ama API key + Cloudflare koruması + kota (free ~10 indirme/gün, doğrulanamadı tam sayı) engeli var.
4. Türkiye'ye özgü tek "seslendirme kadrosu" kaynağı **seslendirmekadrolari.com** (Blogger, ~2011'den beri, platform etiketli: Sinema/Netflix/Prime/Disney+/Digitürk/…); makine-okunur API yok, scraping gerekir; telif riski düşük (kadrolar metadata).
5. CloudStream/Nuvio/Stremio Türkçe ekosistemi **scraping tabanlı** (DiziPal/Dizilla/Dizibox/SezonlukDizi vb.); çoğu iframe/redirect + CF koruması; oynatılabilir doğrudan m3u8/mp4 **çoğunlukla hayır**, stabilite düşük; bunlar "kaynak" değil "doğrulama kanıtı" olarak kullanılmalı.
6. "Dünyanın en büyük X arşivi" örnekleri (MyDubList, Dubbing Database/Fandom, Subdl/OpenSubtitles) ortak metodolojisi: **çoklu resmi API + topluluk override + CC BY 4.0 veri + kanıt URL zorunluluğu** — bu desen CinePulse'a kopyalanabilir.
7. Hukuki olarak savunulabilir tasarım: **metadata + dil tespiti + link verme (barındırmama)**; 5651 m.4(2) "bağlantı sağladığı başkasına ait içerikten sorumlu değildir, ancak benimsediği açıkça belli ise sorumludur" — bu yüzden kaynak "benimseme" UI'sı ve doğrudan oynatılabilir stream linki gösterimi risklidir.
8. En büyük kanıtlı TR dublaj arşivi için en değerli varlık: **her satır için `dilDurumu` + `sesDokumu` + `kaynak URL` + `HTTP durumu` + `tarih`**; bu alanlar zaten `dublajKestirme.js` tarafından üretiliyor, kalıcı bir DB'ye yazılması yeterli.
9. "Doğrulanamayan" her satır `doğrulanamadı` olarak kalmalı (kullanıcı kuralı); sessizce "dublaj var" demek yasak.
10. Önerilen ilk adım: **5 hemen eklenebilir madde** (aşağıda) — hepsi mevcut mimariye (providerRuntime/batch/probe/playback) uygun, yeni bağımlılık yok.

---

## 1. Türkçe ses/dublaj veri kaynakları (API'ler)

| Kaynak | Uç (endpoint) | Kimlik | Ücretsiz kota | TR dublaj verisi veriyor mu? | Kanıt URL + HTTP | CinePulse'a nasıl eklenir | Risk |
|---|---|---|---|---|---|---|---|
| OpenSubtitles.com v6 REST | `https://api.opensubtitles.com/api/v1/subtitles?imdb_id=…&languages=tr` (base `api.opensubtitles.com/api/v1`) | `Api-Key` başlığı zorunlu (+ login JWT download için) | Free: günlük indirme düşük (topluluk raporlarında ~10/gün seviyesi, doğrulanamadı tam sayı); 40 req/10sn/IP | **Hayır — altyazı arşivi, dublaj değil.** TR altyazı hacmi büyük; "TR altyazı var" çıkarımı yapılabilir | `curl …/subtitles?imdb_id=tt0133093&languages=tr` → **HTTP 403** `{"message":"You cannot consume this service"}` (keysiz); docs: `opensubtitles.stoplight.io` | `languages=tr` ile TR altyazı var/yok sinyali; metadata zenginleştirme (film adı, yıl). Download endpoint'i kullanıcıya açılmamalı (kota) | Orta (kota, CF) |
| TMDB v3 | `https://api.themoviedb.org/3/movie/{id}` (+ `alternative_titles`, `credits`, `translations`) | API key (header `Authorization: Bearer` veya `api_key` query) | Free tier (rate limit resmi dokümanda; tam sayı doğrulanamadı) | **Kısmen — orijinal `spoken_languages` + `original_language` + TR alternatif başlık.** Dublaj mevcudiyeti vermez | `…/movie/550?api_key=test` → **HTTP 401** `{"status_code":7,...}`; docs sayfası HTTP 200 okundu; `alternative_titles` örneğinde `TR: "Dövüş Klubü"` görüldü | Kimlik/ID çözme (imdb_id↔tmdb_id), TR başlık, orijinal dil; credits ile seslendirme kadrosu (orijinal dil) | Düşük |
| Trakt v2 | `https://api.trakt.tv/shows/{id}?extended=full`, `/episodes/…` | `trakt-api-key` + `trakt-api-version: 2` | Free (client id gerekli; tam kota doğrulanamadı) | **Hayır — dil filtresi bozuk (topluluk raporu), dublaj alanı yok** | `…/shows/game-of-thrones?extended=full` keysiz → **HTTP 403** `Forbidden` | Episode kimlik eşleme (trakt/tvdb/tmdb/imdb id'leri) için iyi; dublaj için değil | Düşük |
| TVmaze | `https://api.tvmaze.com/shows/{id}`, `/episodes/{id}`, `/shows/{id}/episodes` | Yok (açık) | Açık, rate limit belgelenmemiş (doğrulanamadı) | **Hayır — yalnız `language` (orijinal yayın dili) alanı** | `…/shows/1` → **HTTP 200** (`"language":"English"`); `/episodes/1` → **HTTP 200** (dil alanı yok) | Episode rehberi/rehber metadata; dublaj kanıtı değil | Düşük |
| AniList (GraphQL) | `https://graphql.anilist.co` | Yok (rate limit IP bazlı) | ~90 req/dk (topluluk; doğrulanamadı) | **Kısmen — `staff.language`/`languageV2` (seslendirme dili) deprecated, dub kadrosu** | Docs okundu: `Staff.language` ⚠️ DEPRECATED → `languageV2` | Anime dub kadrosu (orijinal seslendirme) için; TR dublaj mevcudiyeti doğrudan yok | Düşük |
| Anime News Network Encyclopedia | `https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime={id}` (rate 1 req/sn; `nodelay` varyantı) | Yok (açık) | 1 req/sn/IP (belgelenmiş) | **Hayır — anime metadata; dublaj alanı doğrulanamadı** | Sayfa HTTP 200 okundu; ToS: kaynak + link zorunlu | Anime kimlik/çeviri metadata; seslendirme kadrosu sınırlı | Düşük |

**Not:** Hiçbir harici API "bu filmde TR dublaj var mı" sorusuna doğrudan cevap vermez. TMDB `spoken_languages` sadece orijinal yapım dilidir. Bu yüzden CinePulse'un **akıştan okuma** yaklaşımı (dublajKestirme.js) bu API'lerin üstünde "kanıt katmanı" olarak kalmalıdır.

---

## 2. Türkiye'ye özel dublaj metadata kaynakları

| Kaynak | Uç / erişim | Kimlik | Ücretsiz kota | TR dublaj verisi | Kanıt URL + HTTP | CinePulse'a nasıl eklenir | Risk |
|---|---|---|---|---|---|---|---|
| seslendirmekadrolari.com | Web (Blogger), kategori URL'leri (`/sgrid/Sinema`, `/sgrid/Netflix` …) | Yok | Açık (HTML) | **Evet — platform etiketli seslendirme kadroları (Sinema/Netflix/Prime/Disney+/Digitürk/TVPlus/iTunes/AppleTV/Tivibu/HBOMAX/FilmBox/D-Smart/TRT/TV/Oyun)** | `https://www.seslendirmekadrolari.com/` → **HTTP 200** (canlı, güncel içerik görüldü) | Scraper (HTML parse) → `{title, platform, cast[]}`; TR dublaj var/yok + kadro kanıtı | Düşük-Orta (scraping, ToS belirsiz) |
| Wikipedia/TR | MediaWiki API: `https://tr.wikipedia.org/w/api.php?action=parse&page=…&prop=text` | Yok | Açık | **Kısmen — film/dizi maddelerinde "Türkçe dublaj" tabloları (seslendirme kadrosu)** | Örnek madde `Zootropolis: Hayvanlar Şehri` içinde "Türkçe dublaj versiyonu" + kadro tablosu görüldü | MediaWiki API ile madde metni çek, tablo parse; seslendirme sanatçısı arşivi | Düşük (CC BY-SA atıf) |
| Beyazperde / Sinemalar / dizisetleri | Web HTML | Yok | Açık | **Kısmen — film/dizi sayfalarında "Türkçe dublaj" etiketi + kadro (seyrek)** | doğrulanamadı (canlı test yapılmadı) | Scraper aday; stabilite düşük | Orta |
| dublaj.org (iddia edilen) | — | — | — | **Doğrulanamadı — alan adı erişilemedi (HTTP 000 / transport error)** | `https://dublaj.org` → **HTTP 000 (erişilemedi)** | Elenmeli (erişilemiyor) | — |
| seslendirme.org | Web | Yok | Açık | **Kısmen — sanatçı biyografileri, stüdyolar, eğitim; makine-okunur değil** | `https://www.seslendirme.org/` → HTTP 200 (webfetch ile görüldü) | Scraper aday (kadrolar değil, genel bilgi) | Düşük |
| sesbankasi.com | Web | Yok | Açık | **Hayır — seslendirme sanatçısı demo/portföy sitesi, dublaj mevcudiyeti arşivi değil** | `https://www.sesbankasi.com/` → HTTP 200 | Kullanılmamalı | Düşük |

**Telif riski özeti:** Seslendirme kadrosu (oyuncu adı ↔ karakter) **metadata/fakt** niteliğinde; telif riski düşük. Ancak film/dizi özetleri, posterler, altyazı dosyaları ve video akışları telifli içerik sayılır — bunlar barındırılmamalı, yalnız link/metadata.

---

## 3. Stabil kaynak / açık sağlayıcı ekosistemi

| Kaynak | Uç / erişim | Kimlik | Ücretsiz kota | Oynatılabilir doğrudan m3u8/mp4 mü? | Kanıt URL + HTTP | CinePulse'a nasıl eklenir | Risk/Stabilite |
|---|---|---|---|---|---|---|---|
| Stremio addons (Türkçe) | Manifest URL'leri (`…/manifest.json`); örnek Dizipal addon: `https://dizipal-stremio-addon.mycodelab.live` | Yok (addon kurulumu) | Açık | **Genelde hayır — çoğu scraping + iframe/redirect; doğrudan m3u8/mp4 nadir** | GitHub repo `aflextr/dizipal-stremio-addon` HTTP 200 okundu; manifest akışı dokümante | Addon manifest'lerini CinePulse providerRuntime'a adaptörle okumak (Nuvio-JS kontratı) | Orta (addon oynaklığı) |
| CloudStream TR providers | Repo JSON: `raw.githubusercontent.com/keyiflerolsun/Kekik-cloudstream/master/repo.json` (ve kraptor, pitipiti) | Yok | Açık | **Hayır — scraping; DiziPal/Dizilla/Dizibox vb. sitelerden iframe/redirect; doğrudan stream çoğunlukla hayır** | Web kaynakları HTTP 200; repo listesi doğrulandı | CS3 (Kotlin/PathClassLoader) yerine **Nuvio-JS kontratı** (mevcut not: cloudstream-eklenti-fizibilite.md) | Orta-Yüksek (keyfi kod riski) |
| Nuvio providers | Manifest URL'leri; `raw.githubusercontent.com/yoruix/nuvio-providers/…/manifest.json` | Yok | Açık | **Kısmen — format alanı m3u8/mp4/mkv; çoğu en provider'lar en/hin/ta/te dilleri, TR yok** | Manifest HTTP 200 okundu; `contentLanguage` listesinde `tr` **bulunamadı** | Nuvio-JS adaptörü (mevcut fizibilite notu) + TR provider'ları için kendi scraper'larımız | Orta |
| Torrentio / Comet / AIOStreams | Public instance'lar + debrid | Debrid (ücretli) for direct | Açık (P2P) | **Hayır — torrent, doğrudan m3u8/mp4 değil; seeders'a bağlı** | Stremio ekosistemi dokümantasyonu HTTP 200 | CinePulse'a **eklenmemeli** (torrent istemcisi yok, telif riski) | Yüksek (telif, seeders) |
| Internet Archive | `archive.org` search + item API (açık) | Yok | Açık | **Kısmen — public domain filmler; TR dublaj içerik az** | `archive.org/details/ogul_movie` örneği görüldü | Metadata zenginleştirme için düşük öncelik | Düşük |
| 1337x / özel TR index'ler | Web scraping | Yok | Açık | **Hayır — torrent index; doğrudan stream yok** | doğrulanamadı (canlı test yok) | Elenmeli | Yüksek |

**Stabilite yorumu:** HTTP-direct scraping addon'ları "her birkaç haftada kırılır" (ElfHosted notu). Bu yüzden CinePulse için en stabil katman **kendi akıştan okuma (dublajKestirme.js)** + **açık API'ler (TMDB/TVmaze)** olmalı; scraping kaynakları yalnız "aday stream" olarak işaretlenmeli.

---

## 4. "Dünyanın en büyük X arşivi" örnekleri ve kopyalanabilir metodoloji

| Proje | Ne yapıyor | Kopyalanabilir metodoloji | Kanıt |
|---|---|---|---|
| MyDubList | Anime dub mevcudiyeti (25+ dil) DB | Çoklu resmi API (MAL/Jikan, AniList, ANN, Kitsu, AnimeSchedule, aniSearch) + topluluk override + CC BY 4.0 + kanıt URL zorunluluğu | `mydublist.com/about` HTTP 200 |
| Dubbing Database (Fandom) | Film/dizi dublaj kadroları wiki | Topluluk katkılı, yapılandırılmış sayfalar; atıf zorunlu | `dubdb.fandom.com` (HTTP 403 — erişim engeli, doğrulanamadı tam içerik) |
| OpenSubtitles / Subdl | Altyazı arşivi + API | API key + kota + hash tabanlı eşleştirme (moviehash) | docs HTTP 200 |
| Plex/Emby | Ses/altyazı izi indeksleme | **Embedded track metadata** (bizim dublajKestirme.js ile aynı) — merkezi DB değil, yerel | forum/support HTTP 200 |
| TVmaze | Episode rehberi + orijinal dil | Açık API, episode-level kimlik; dublaj alanı yok | API HTTP 200 |

**Kopyalanabilir 3 ilke:**
1. **Çoklu kaynak + override:** her kayıtta `kaynaklar[]` ve `override` bayrağı; çelişki durumunda akıştan okuma (kanıt) öncelikli.
2. **Kanıt zorunluluğu:** her `dublaj` iddiası için `kaynak URL + HTTP durumu + tarih` (kullanıcının "doğrulanan olmayan olmayacak" kuralı).
3. **Açık lisans + atıf:** CC BY 4.0 ile veri paylaşımı, kaynak atfı zorunlu (MyDubList modeli).

---

## 5. Hukuki çerçeve (kısa)

- **TR (5651):** İçerik sağlayıcı sunduğu içerikten sorumludur; **bağlantı sağladığı başkasına ait içerikten sorumlu değildir**, ancak sunuş biçiminden içeriği benimsediği ve kullanıcıyı oraya yönlendirmeyi amaçladığı açıkça belli ise genel hükümlere göre sorumludur (m.4(2)). Yer/erişim sağlayıcılar haberdar edilince içeriği yayından kaldırmakla yükümlüdür (m.5).
- **AB (DSM Direktifi 2019/790, DSA):** Barındırma (hosting) sorumluluğu; "link verme" içtihadı (CJEU Svensson/Sanoma): açıkça erişilebilir içeriğe link vermek tek başına telif ihlali sayılmaz; ancak bilinen/belirgin yasadışı içeriğe link vermek sorumluluk doğurabilir.
- **ABD (DMCA 512):** Safe harbor için notice-and-takedown; kullanıcı tarafından yüklenen içerikte iyi niyetli kaldırma; metadata/link-only servisler daha düşük risk.
- **Savunulabilir tasarım:** metadata + dil tespiti + kaynak URL referansı; **video barındırmama**; doğrudan oynatılabilir stream linki göstermememe; "benimseme" UI'sından kaçınma; takedown kanalı; şeffaf atıf.
- **Savunulamaz:** torrent/stream linki toplama ve "oynat" butonu ile sunma; barındırma; altyazı dosyası dağıtım; API kota aşımı için scraping.

---

## HEMEN EKLENEBİLİR 5 ŞEY (somut, mevcut mimariye uygun)

1. **OpenSubtitles TR altyazı sinyali (metadata zenginleştirme):** `api.opensubtitles.com/api/v1/subtitles?imdb_id=…&languages=tr` çağrısı ile `tr` altyazı var/yok → mevcut `dilDurumu`'na `'altyazi'` kanıtı eklenebilir. Kota nedeniyle sadece batch/probe katmanında (mevcut `kopruFetch` + kuyruk) çalıştırılmalı; kullanıcı başına değil.
2. **TMDB kimlik + TR başlık + orijinal dil:** `imdb_id`↔`tmdb_id` çözümleme + `spoken_languages` + `alternative_titles` (TR) → yayın kartlarında "orijinal dil" ve "TR başlık" gösterimi; dublaj iddiası değil, metadata.
3. **TVmaze episode rehberi:** Açık API ile season/episode kimlik ve orijinal dil → "hangi sezon/bölüm" düzeyinde arşiv iskeleti (dublaj kanıtı olmasa da indeks).
4. **seslendirmekadrolari.com scraper (kadrolar):** Platform etiketli seslendirme kadrosu → `{title, platform, cast[]}` tablosu; TR dublaj kanıtı + seslendirme sanatçısı arşivi. HTML parse, CinePulse `providerRuntime` adaptörüyle.
5. **Kalıcı arşiv DB (mevcut alanları yaz):** `dublajKestirme.js`'in ürettiği `dilDurumu`, `diller`, `sesDokumu`, `trSes`, `kaynak URL`, `HTTP durumu`, `tarih` alanlarını kalıcı store'a (mevcut `media_storage`/server) yaz; bu tek başına "en büyük kanıtlı arşiv"i oluşturur çünkü kanıt akışın kendisidir.

---

## ELENENLER (gerekçeli)

- **dublaj.org:** erişilemiyor (HTTP 000) → doğrulanamadı/elenir.
- **Torrentio/Comet/torrent index'ler:** doğrudan stream değil, telif riski yüksek, CinePulse mimarisine (HLS oynatıcı) uymaz.
- **CloudStream CS3 (Kotlin/PathClassLoader):** GPL-3.0 bulaşma + keyfi kod riski + yalnız Android; Nuvio-JS önce (mevcut fizibilite notu).
- **CloudJS:** resmi kontrat yok (doğrulanamadı) → yatırım yapılmamalı.
- **Trakt dil filtresi:** bozuk (topluluk raporu) → dublaj için kullanılamaz.
- **TVmaze/AniList/ANN "dublaj mevcudiyeti":** orijinal dil/kadro verir, TR dublaj var/yok vermez.
- **OpenSubtitles "dublaj":** altyazı arşividir, dublaj değil; kota/CF engeli.
- **sesbankasi.com:** demo/portföy, arşiv değil.

---

## Kaynakça (canlı doğrulanan URL'ler)

- OpenSubtitles docs: https://opensubtitles.stoplight.io/docs/opensubtitles-api (getting started) ; API base `https://api.opensubtitles.com/api/v1` ; test: `…/subtitles?imdb_id=tt0133093&languages=tr` → HTTP 403
- TMDB docs: https://developer.themoviedb.org/reference/movie-alternative-titles ; https://developer.themoviedb.org/reference/movie-details ; test: `…/movie/550?api_key=test` → HTTP 401
- Trakt docs: https://trakt.docs.apiary.io/ ; test: `https://api.trakt.tv/shows/game-of-thrones?extended=full` (keysiz) → HTTP 403
- TVmaze API: https://www.tvmaze.com/api ; test: `https://api.tvmaze.com/shows/1` → HTTP 200 ; `https://api.tvmaze.com/episodes/1` → HTTP 200
- ANN Encyclopedia API: https://www.animenewsnetwork.com/encyclopedia/api.php (HTTP 200 okundu)
- AniList docs: https://docs.anilist.co/reference/object/staff
- seslendirmekadrolari.com: https://www.seslendirmekadrolari.com/ (HTTP 200)
- seslendirme.org: https://www.seslendirme.org/ (HTTP 200)
- MyDubList about: https://mydublist.com/about (HTTP 200)
- Dubbing Database: https://dubdb.fandom.com/wiki/The_Dubbing_Database (HTTP 403)
- Dizipal Stremio addon: https://github.com/aflextr/dizipal-stremio-addon (HTTP 200)
- CloudStream TR repos: topluluk listeleri (HTTP 200 okundu)
- Nuvio providers manifest: https://raw.githubusercontent.com/yoruix/nuvio-providers/refs/heads/main/manifest.json (HTTP 200)
- Internet Archive: https://archive.org/details/ogul_movie (örnek)
- 5651 Kanunu: https://www.mevzuat.gov.tr/… (m.4(2) link sorumluluğu) (HTTP 200 okundu)
- Mevcut repo: `src/services/dogrudan/dublajKestirme.js`, `notlar/cloudstream-eklenti-fizibilite.md`, `notlar/nuvio-uyarlama.md`

**Ara not 3 (final):** Araştırma tamamlandı; rapor dosyaya yazıldı. Repo koduna dokunulmadı.
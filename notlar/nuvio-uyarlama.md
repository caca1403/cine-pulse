# Nuvio Eklentileri — Uyarlama Öncesi Saha Analizi

**Kaynak:** `patr0nq/nuvioaddons` (main) — `manifest.json` + `providers/*.js`
**Yöntem:** Salt-okur. 11 dosya `/tmp/opencode/nuvio/` altına indirildi; repo kaynağı değiştirilmedi.
**Hüküm (özet):** Sözleşme neredeyse **bire bir uyumlu** (`module.exports.getStreams(tmdbId, mediaType, season, episode)`), 11/11 eklenti sonuçta **doğrudan m3u8/mp4** üretiyor (iframe'i kendi içinde çözüyor). Asıl engel ağ/sözleşme değil, **3 runtime bağımlılığı** (cheerio ×4, crypto-js ×2, uzak config/TMDB anahtarı) ve **alan adı mükerrerliği** (5 eklenti mevcut 43 sağlayıcının alan adıyla çakışıyor).

---

## 1. Envanter

- Manifestte **11** scraper var; **11/11** indi, toplam **295.479 bayt (~289 KB)**.
- Depoda `providers/` altında **17** `.js` var; manifestte olmayan **6** dosya (indirilmedi, yayında değil):
  `patron666Film`, `patronDizify`, `patronFilmEkseni`, `patronHDFilmDelisi`, `patronSetfilm`, `patronSinemacx`.
- Hepsi **düz JS** (derlenmiş değil); derleme çıktısı es2020 (banner'lı, `__toCommonJS/__async` yardımcıları var).

| # | Dosya | Bayt | Manifest türü | Dil |
|---|---|---|---|---|
| 1 | patronDizipal.js | 56.506 | movie, tv | tr |
| 2 | patronSelcukFlix.js | 59.172 | movie, tv | tr |
| 3 | patronhdfcehennemi.js | 28.164 | movie, tv | tr |
| 4 | patronFilmMakinesi.js | 26.510 | movie, tv | tr |
| 5 | patrondortkhd.js | 23.124 | movie, tv | en, hi |
| 6 | patronAsyaAnimeleri.js | 19.855 | tv, movie (anime) | tr |
| 7 | patronFullHDFilmizlesene.js | 19.674 | movie, tv* | tr |
| 8 | patronSinewix.js | 18.140 | movie, tv | tr |
| 9 | patronJetFilmizle.js | 16.490 | movie | tr |
| 10 | patronDiziyou.js | 16.056 | movie, tv | tr |
| 11 | patronMulti.js | 11.788 | movie, tv | en, tr |

\* FullHDFilmizlesene kod içinde `mediaType !== "movie"` ise boş döner — **fiilen film-only**.

---

## 2. Eklenti bazında teknik künye

| Eklenti | Alan adı (kaynağı) | Giriş noktası | Dönüş alanları | Runtime bağımlılığı | İçerik / kalite / altyazı | Doğrudan akış? | Alan adı çakışması |
|---|---|---|---|---|---|---|---|
| **patronMulti** | `vidlink.pro` + `vidmody.com` + `enc-dec.app` (sabit) | `module.exports.getStreams` | `url, name, title, quality, subtitles?, headers` | yok (saf `fetch` + regex m3u8 parse) | movie+tv, TR+EN, **kalite varyantları**, altyazı **var** | ✅ vidlink API → m3u8 | ❌ yok |
| **patrondortkhd** | `4khdhub.one` (yedeği var: uzak `domains.json` @ phisher98/TVVVV, anahtar `4khdhub`) | `module.exports.getStreams` | `name, title, url, quality, headers` | `cheerio-without-node-native`, `atob` | movie+tv (yabancı/Hint), kalite var, altyazı yok | ✅ mp4/m3u8/mkv (indirme bağlantıları dâhil); dosya değilse `#.mkv` ekliyor ⚠ | ❌ yok |
| **patronDiziyou** | `www.diziyou.one` (uzak `siteurl.txt` anahtar `diziyou`) | `module.exports.getStreams` | `url, name, quality, language, headers` | **yok** (saf `fetch` + regex) | movie+tv, TR; **dublaj/altyazı `name`de** ("Diziyou - Dublaj" / "…Altyazılı") | ✅ `…/episodes/<id>[/_tr]/play.m3u8` | ❌ yok |
| **patronAsyaAnimeleri** | `asyaanimeleri.top` (sabit) | `module.exports.getStreams` | `name, title, url, quality, headers` | `cheerio`, `atob` | **anime** (tv+movie), TR; kalite var | ✅ sibnet/vidmoly içinden m3u8/mp4 çıkarır | ❌ yok |
| **patronDizipal** | `dizipal2138.com` (yedeği var: uzak `siteurl.txt`, anahtar `dizipal`/`dizipalDiger`) | `module.exports.getStreams(idObj, …)` — obje de kabul eder | `url, name, title, quality, format, subtitles[], headers` | **`crypto-js`** (AES-CBC), CookieJar, `cinemeta` (IMDb), TMDB anahtarı | movie+tv, TR; **dublaj/altyazı ayrımı**, gömülü+harici altyazı | ✅ | ⚠ **dizipal ailesi** (mevcut Winter-Soldier/Iron-Fist/Moon-Knight) |
| **patronSelcukFlix** | `selcukflix.app` (uzak `domains.json` @ ezgegan + fallback + `siteurl.txt`) | `module.exports.getStreams` | `url, name, quality, format, headers`, altyazı denetimi | **`crypto-js`** (AES), `atob`, uzak TMDB anahtar listesi | movie+tv, TR; dublaj/altyazı bayrağı | ✅ (dplayer82/pichive içinden hls) | ⚠ **selcukflix.app = Captain-America** |
| **patronFilmMakinesi** | `filmmakinesi.to` (uzak `siteurl.txt`) | `module.exports.getStreams` | `name, title, url, quality, format, subtitles[], headers` | yok (`fetch`+regex) | movie+tv, TR; dublaj/altyazı, altyazı **var** | ✅ (closeload/rapid içinden m3u8) | ⚠ **filmmakinesi.to = Black-Widow** |
| **patronhdfcehennemi** | `hdfilmcehennemi.nl/.com/.pw` (uzak `siteurl.txt`) | `module.exports.getStreams` | `name, title, url, quality, format, headers, subtitles` | yok (kendi base64 + JS-pack unpacker'ı gömülü) | movie+tv, TR; IMDb çözümü; altyazı **var** | ✅ | ⚠ **hdfilmcehennemi.nl = Luke-Cage** |
| **patronFullHDFilmizlesene** | `www.fullhdfilmizlesene.now` (sabit) | `module.exports.getStreams` | `name/title, url, quality, type` (+`{subtitle}` satırları) | `atob` **veya `Buffer`** (fallback) | **film-only**, TR; sadece altyazısızları döner | ✅ (vidmoxy/turboimgz/trstx/rapidvid/turkeyplayer) | ⚠ **fullhdfilmizlesene.now = Hulk** |
| **patronJetFilmizle** | `jetfilmizle.now` (sabit) | `module.exports.getStreams` | `name, title, url, quality, type, headers` | `cheerio` | **film-only**, TR | ✅ yalnız `videopark` içinden | ❌ yok |
| **patronSinewix** | `ydfvfdizipanel.ru` + sabit API token / sabit `hash256`+`signature` başlıkları | `module.exports.getStreams` | `name, title, url, quality, headers` | `cheerio` | movie+tv, TR | ⚠ Mediafire çözülürse direkt; çözülmezse URL'ye `#.mkv` ekleyip döndürür | ❌ yok |

**Ortak gözlem:** 11/11 eklenti `fetch` kullanır (uygulamanın CORS köprüsüyle doğrudan uyumlu). Hiçbirinde işçi (worker) global'i yok — `env`, `utils`, `proxyFetch`, `pipixel` **hiç geçmiyor**. `console.log` gürültüsü yoğun; Dizipal ayrıca `ROOT.__NUVIO_DEV_LOG_URL__` ile uzak log'a POST edebiliyor (kapatılmalı).

---

## 3. Alan adı çakışma listesi (mükerrer → yeni kod adı gerekmez)

| Nuvio eklentisi | Alan adı | Mevcut çekirdek (kod adı) | Karar |
|---|---|---|---|
| patronSelcukFlix | selcukflix.app | **Captain-America** | Mükerrer — mevcut çekirdeği **yükseltme** adayı |
| patronFilmMakinesi | filmmakinesi.to | **Black-Widow** | Mükerrer — yükseltme adayı |
| patronFullHDFilmizlesene | fullhdfilmizlesene.now | **Hulk** | Mükerrer (film-only) — düşük öncelik |
| patronhdfcehennemi | hdfilmcehennemi.nl/.com/.pw | **Luke-Cage** (.nl) | Mükerrer — yükseltme adayı |
| patronDizipal | dizipal2138.com | Winter-Soldier (2140), Iron-Fist (1590), Moon-Knight (10.com.tr) | **Aynı site ailesi** — mükerrer say; yükseltme adayı |
| patronDiziyou | diziyou.one | — | **Yeni** |
| patrondortkhd | 4khdhub.one | — | **Yeni** |
| patronMulti | vidlink.pro / vidmody.com | — | **Yeni** |
| patronJetFilmizle | jetfilmizle.now | — | **Yeni** |
| patronAsyaAnimeleri | asyaanimeleri.top | — | **Yeni** (anime) |
| patronSinewix | ydfvfdizipanel.ru | — | **Yeni** |

Çakışan 5 eklenti **yeni kod adı gerektirmez**; mevcut kod adının çekirdeğini değiştirmek/iyileştirmek yeterli.

---

## 4. Engeller ve önerilen çözümler

| # | Engel | Nerede | Öneri |
|---|---|---|---|
| 1 | `cheerio-without-node-native` | AsyaAnimeleri, dortkhd, JetFilmizle, Sinewix | Kullanılan seçiciler basit (`div.film-card`, `select.mirror option`, `div#active-player iframe`, `section.facts p`). **Regex + küçük yardımcı** ile yeniden yaz (dosyaların geri kalanı zaten regex). Gerekirse uygulamaya **tek paylaşılan mini DOM ayrıştırıcı** (`globalThis.__cp_html`) enjekte et — her dosyaya kütüphane gömmeye gerek kalmaz. |
| 2 | `require("crypto-js")` (AES-CBC) | Dizipal, SelcukFlix | İki seçenek: (a) **WebCrypto** `crypto.subtle.decrypt('AES-CBC')` + elle PKCS7 sıyırma — Chromium/Node18+/Electron/Capacitor'da hazır; (b) yalnız kullanılan alt kümeyi (AES + Base64/Hex/Utf8) **satır içi ~10 KB** göm. Öneri: (a), şifre çözülemezse (b) yedek. |
| 3 | `atob` | AsyaAnimeleri, dortkhd, FullHDFilmizlesene, SelcukFlix | Electron/Capacitor/Node16+ `atob` hazır — korunur. |
| 4 | `Buffer` | FullHDFilmizlesene (yalnız base64 fallback) | `atob` fallback'iyle değiştir; `Buffer` tamamen kaldırılır. |
| 5 | `require` / `module.exports` / `__toCommonJS` | 5 dosya | Yükleyici **korumalı `module`/`exports`/`require` shim'i** sağlar, sonra `globalThis.getStreams = module.exports.getStreams`. Kaynak düzenlemeden sözleşmeye bağlanır. |
| 6 | Uzak alan/ayar istekleri: `raw.githubusercontent…/siteurl.txt`, `cdn.ezgegan.com/domains.json`, `domains.ezgegan.com/domains`, `phisher98/TVVVV/domains.json` | Dizipal, SelcukFlix, dortkhd, FilmMakinesi, hdfcehennemi, Diziyou | Bizim modelimizle **uyumlu**: `*/domains.json` isteği uygulamada yerel haritadan yanıtlanıyor. Yeni alan adlarını `ALANLAR`'a (veya ikinci yerel haritaya) ekle; `siteurl.txt` biçimi farklı olduğu için bu dalları `globalThis` sabit haritasına çevir. |
| 7 | `enc-dec.app` (vidlink id şifreleme) | patronMulti | Bir yardımcı API; proxy'ye izin vermek yerine **şifreleme mantığını satır içi** taşı (küçük, tek amaçlı) — dış bağımlılık sıfırlanır. |
| 8 | Sabit TMDB API anahtarları (`5003307…` + SelcukFlix'in uzak anahtar listesi) | 9 dosya | Anahtarlar bizim olmadığı için rotasyon/kota riski. **Ağ katmanında `api.themoviedb.org`'u yakalayıp kendi anahtarımız/önbelleğimizle yanıtla** veya başlık çözümünü uygulamaya al. |
| 9 | TMDB→başlık/IMDb çözümü **her eklentinin içinde** | 10 dosya | Sözleşmemiz yalnız `tmdbId` veriyor. Karar: çözümü **uygulama katmanına** taşı (tek önbellek) ve eklentiye opsiyonel `{title, imdbId}` geçir; eklentinin kendi TMDB çağrısı yedek kalsın. AsyaAnimeleri zaten `themoviedb.org` HTML'ini kazıyor — bizim tarafımızda başlık varsa bu hiç çağrılmaz. |
| 10 | Dönüş şekli farkları: bazıları `title`, bazıları yalnız `name`; `format` yerine `type` (`"hls"`); `{subtitle: …}` gibi akış-dışı satırlar | tümü | **Tek adaptör sarmalayıcı**: `name`+`title`→`name`, `type/format`+URL uzantısı→`format`, boş/geçersiz URL'li satırları ayıkla, `{name,url,quality,format,headers}`i zorunlu kıl. |
| 11 | Sahte uzantı hilesi: `.mkv` değilse `#.mkv` ekleme | dortkhd, Sinewix | Doğrudan dosya değilse akışı **ele** (bizim sözleşmemiz iframe/embed kabul etmez). |
| 12 | UI'a gerçek site adı sızması (`"Dizipal"`, `"SelcukFlix"`, `"FilmMakinesi"`, …) | tümü | Adaptörde `name`/`title` alanlarını **kod adıyla** değiştir. |
| 13 | Dev log POST'u (`__NUVIO_DEV_LOG_URL__`) + yoğun `console.log` | Dizipal | Logları sustur / uzak POST dalını çıkar. |

**Sözleşme bağlama:** `getStreams(tmdbId, tur, season, episode)` imzası bire bir aynı (Dizipal ek olarak obje de kabul eder). Yani her eklenti şu kabukla çalışır:
`module.exports.getStreams → adaptör → {name: <kod adı>, url, quality, format, headers}`. Ekstra TMDB→IMDb/ad çözümü uygulamada yapılır, sonuç eklentiye geçirilir.

---

## 5. Öncelik sıralaması (en çok değer katan 10)

| Sıra | Eklenti | Neden | Tür |
|---|---|---|---|
| 1 | **patronMulti** | Yabancı içerik, `vidlink.pro` çok geniş katalog, kalite varyantları + altyazı, bağımsız bağımlılık yok | Yeni site |
| 2 | **patrondortkhd** (4khdhub) | Yabancı film/dizi + yüksek kalite mp4/mkv, katalog çok geniş | Yeni site |
| 3 | **patronDiziyou** | TR dizi, dosya boyutu küçük, **bağımlılıksız**, temiz m3u8, dublaj/altyazı ayrımı | Yeni site |
| 4 | **patronAsyaAnimeleri** | Tek anime kaynağı; anime boşluğunu kapatır | Yeni site (anime) |
| 5 | **patronDizipal** | TR film+dizi, altyazı denetimi ve dublaj ayrımı çok güçlü; mevcut dizipal çekirdeğini yükseltir | Mükerrer (yükseltme) |
| 6 | **patronSelcukFlix** | Captain-America'nın çekirdeğini güçlendirir (altyazı + dublaj + çok kaynak) | Mükerrer (yükseltme) |
| 7 | **patronJetFilmizle** | Yeni TR film sitesi (dar ama tamamlayıcı) | Yeni site |
| 8 | **patronSinewix** | Yeni site + API tabanlı hızlı arama; ancak token/başlık bağımlı | Yeni site |
| 9 | **patronFilmMakinesi** | Black-Widow yedeği/iyileştirmesi; altyazı taşır | Mükerrer (yükseltme) |
| 10 | **patronhdfcehennemi** | Luke-Cage alternatifi; kendi unpacker'ı var | Mükerrer (yükseltme) |

**Elenen:** `patronFullHDFilmizlesene` — film-only ve Hulk ile aynı alan adı; Hulk zaten film+dizi kapsıyor.

---

## 6. Kod adı önerileri (mevcut 43 ile çakışmıyor)

| Eklenti | Öneri | Not |
|---|---|---|
| patronMulti | **Star-Lord** | Vidlink tabanlı çok kaynaklı akış |
| patrondortkhd | **Wolverine** | 4K yabancı arşiv |
| patronDiziyou | **Gambit** | TR dizi, dublaj/altyazı |
| patronAsyaAnimeleri | **Katana** | Anime |
| patronJetFilmizle | **Rogue** | TR film |
| patronSinewix | **Cyclops** | API tabanlı TR film/dizi |
| patronDizipal | — | **Mükerrer**: Winter-Soldier çekirdeğini yükselt |
| patronSelcukFlix | — | **Mükerrer**: Captain-America çekirdeğini yükselt |
| patronFilmMakinesi | — | **Mükerrer**: Black-Widow çekirdeğini yükselt |
| patronhdfcehennemi | — | **Mükerrer**: Luke-Cage çekirdeğini yükselt |

---

## 7. WioKids / TurkSinema (kapsam dışı — tek satır)

İkisi de `patr0nq/nuvioaddons` manifestinde **yok**; ayrı depolar ve **Nuvio JS eklentisi değil, CloudStream `.cs3` (derlenmiş Kotlin)** paketleri: WioKids 10 eklenti, TurkSinema 71 eklenti — hepsi `.cs3`, TurkSinema yalnız CNCVerse Bridge üzerinden çalışır.

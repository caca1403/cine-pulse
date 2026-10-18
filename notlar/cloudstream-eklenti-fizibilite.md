# CloudStream Eklenti Fizibilite — SPIKE (≈20 dk kutu)

**Soru:** CinePulse (vanilla JS + Capacitor APK + Electron) CloudStream 3 eklentilerini (`.cs3` / `.jar`, Kotlin) destekleyebilir mi?
**Yöntem:** Yalnızca okuma — kod yok, commit yok. Resmi CS3 reposu ham kaynakları + dokka + csdocs + TestPlugins şablonu + Nuvio REA raporu (§2, §8) okundu; cihaza kurulum/derleme yapılmadı.
**Hüküm (özet):** Teknik olarak **Android'de mümkün**, ama pahalı ve tek platformlu. Aynı eforla **Nuvio-JS kontratı önce gelir** — saf JS, üç platformda birden çalışır, sandbox edilebilir. CS3 en erken F3'te, Android'e özel opsiyonel spike olarak düşünülmeli.

## 1. CS3 eklenti formatı: jar/dex içeriği + Addon API yüzeyi

**Paket (.cs3) nedir:** Derlenmiş bir **jar/zip**; içinde `classes.dex` + **`manifest.json`** + kaynaklar. Kanıt: `PluginManager.loadPlugin` dosyayı `PathClassLoader(filePath, …)` ile açıp içinden `loader.getResourceAsStream("manifest.json")` okur ve `parseJson<BasePlugin.Manifest>` ile ayrıştırır; başarısız olursa eklenti reddedilir ("No manifest found"). Yani `.cs3` = imzalanması şart olmayan, manifestli dex kabı. Üretimi: TestPlugins şablonunda `ExampleProvider:make` gradle görevi (`cloudstream {…}` bloğu, `version`, `tvTypes`, `language` alanları).

**Dağıtım (repo JSON):** İki katmanlı. Katalog: `{name, description, manifestVersion, pluginLists: [<plugins.json URL'leri>]}`. Eklenti girdisi (`SitePlugin`): `{name, internalName, url, status, version, apiVersion, authors, description, tvTypes, language, iconUrl, fileSize, fileHash}`. Dikkat: bütünlük için `fileHash` (sha256) var, **imza/doğrulama yok**.

**MainAPI yüzeyi (dokka + ham kaynak doğruladı):** `search(query)`, `search(query, page)`, `quickSearch(query)`, `getMainPage(page, request)`, `load(url) → LoadResponse`, `loadLinks(data, isCasting, subtitleCallback, callback) → Boolean`, `getVideoInterceptor`, `fixUrl/fixUrlNull`, `new*SearchResponse / new*LoadResponse / newEpisode` yardımcıları. Özellik bayrakları: `hasMainPage`, `hasQuickSearch`, `supportedTypes`, `lang`, `mainUrl`, `providerType`, zaman aşımı ipuçları (`searchTimeoutMs`, `loadTimeoutMs`, `loadLinksTimeoutMs` …). `ExtractorApi`: `getUrl(url, referer, subtitleCallback, callback)` veya `getUrl(url, referer) → List<ExtractorLink>` + `requiresReferer`. `ExtractorLink` alanları: `source, name, url, referer, quality, headers, extractorData, type (M3U8/DASH/VIDEO…), audioTracks`. Altyazı ayrı callback'le akar (`subtitleCallback: (SubtitleFile) -> Unit`).

**Düzeltme — `getTrackList`:** MainAPI'de bu isimde bir fonksiyon **yok** (dokka üye listesi tarandı). Ses izleri `ExtractorLink.audioTracks: List<AudioFile>` alanında taşınır. Kullanıcının sorusundaki `getTrackList`/`DubController` adları resmi çekirdek API'de doğrulanamadı — muhtemelen topluluk eklentisi iç konvansiyonu veya eski ad; minimum kümeye dahil değil.

### Minimum çekirdek alt küme — arama + stream listesi için

| # | Üye | Zorunlu mu | Not |
|---|---|---|---|
| 1 | `search(query) → List<SearchResponse>` (`name, url`, opsiyonel `posterUrl`) | **EVET** | Giriş noktası; örnek şablon bile gövdesiz stub olarak bunu override eder |
| 2 | `load(url) → LoadResponse` (içinde `data` yükü) | **EVET** | `loadLinks`'e verilecek opak `data` stringini üretir |
| 3 | `loadLinks(data, isCasting, subtitleCallback, callback) → Boolean` | **EVET** | Stream listesi burada akar; callback başına bir `ExtractorLink` |
| 4 | `ExtractorLink{url, quality, headers/referer, type}` | **EVET** | Oynatıcıya yeten 4 alan; `source/name` teşhis için |
| 5 | `app.get / app.post` HTTP + `fixUrl` | **EVET** | Tüm scraper'ların fiili bağımlılığı (nicehttp/okhttp sarmalayıcı) |
| 6 | `TvType` + `new*SearchResponse/new*LoadResponse` kurucuları | **EVET** | Tipler olmadan `LoadResponse` sealed hiyerarşisi serileşemez |
| 7 | `subtitleCallback (SubtitleFile)` | OPSİYONEL | Altyazısız çalışır; sonradan eklenir |
| 8 | `audioTracks` | OPSİYONEL | Çoklu ses izi yoksa boş liste |
| 9 | `quickSearch` | HAYIR | Yazarken-arama; atlanabilir (`hasQuickSearch=false`) |
| 10 | `getMainPage` / `mainPage` | HAYIR | Ana sayfa/keşif; arama-odaklı MVP'de yok |
| 11 | `ExtractorApi.getUrl` ayrı sınıfı | OPSİYONEL | Çoğu eklenti extractor'ı `loadLinks` içinden çağırır; ayrı host şart değil |
| 12 | `getVideoInterceptor` | HAYIR | OkHttp-DataSource özel durumu (ExoPlayer); bizde karşılığı yok |
| 13 | `DubController / SubtitleProvider` ayrı sınıfları | HAYIR | Çekirdekte doğrulanamadı (bkz. düzeltme) |

## 2. Android'de JAR yüklemenin somut maliyeti (DexClassLoader ailesi)

**Yükleyici kanıtı:** `PluginManager` `dalvik.system.PathClassLoader` kullanır (DexClassLoader ile aynı aile; farkı optimize çıktı dizini parametresidir). Akış: indir → `PluginData{internalName, url, isOnline, filePath, version}` kaydet → `PathClassLoader` → manifest parse → sınıf tara (`MainAPI`/`ExtractorApi` alt sınıfları) → `APIHolder.addPluginMapping` ile canlı listeye ekle. `unloadPlugin` + `classLoaders` haritası var ama classloader sızıntısı/çift-yükleme klasik risktir (aynı sınıfın iki sürümü aynı VM'de).

**Capacitor custom plugin iş listesi (Android'e özel, web/Electron'da çalışmaz):**
1. `@PluginMethod search/load/loadLinks` köprüsü — `suspend fun`'ları Capacitor `PluginCall` callback'ine bağlama (coroutine scope + timeout; `loadLinksTimeoutMs` ipucu saygı duyulmalı).
2. Polimorfik tiplerin serileşmesi — `LoadResponse` sealed hiyerarşi (Movie/TvSeries/Anime/Live/Torrent) + `SearchResponse` varyantları; Jackson (`FAIL_ON_UNKNOWN_PROPERTIES=false`) ile JSON'a döküp JS'e geçirme, `data` opaklığını koruma.
3. Çift callback akışı — `loadLinks`'in `subtitleCallback + callback` çiftini JS tarafında toplayıp `onSources`-benzeri progressive beslemeye çevirme.
4. `app.get/post` ağ yığını — eklenti kendi HTTP'sini host process'te yapar; WebView/Capacitor HTTP ile çakışmaz ama izinler (INTERNET zaten var) ve UA/referer zinciri taşınmalı.
5. Yerel test yükü — Android 11+ `MANAGE_EXTERNAL_STORAGE` ("All Files Access") izni gerekir (şablon README'sinde yazılı); `adb` ile `appops set … MANAGE_EXTERNAL_STORAGE allow`.
6. Sürüm eğriltmesi — her eklentinin `apiVersion`'ı host kütüphane sürümüyle eşleşmeli; uyumsuz eklenti `NoSuchMethodException` ile çöker (aşağıda).

**CloudStream-Core kütüphanesi:** Resmi repo kökünde `library/` modülü var (`MainAPI.kt` yolu `library/src/commonMain/…` — KMP yapısı). Lisans **GPL-3.0** (repo kök `LICENSE` doğrulandı) → APK'ya gömmek **copyleft** doğurur; public repo hedefiyle çelişir, hukuk/strateji kararı gerekir. API stabilitesi zayıf: `@Prerelease` ("yalnızca prerelease derlemelerde; stable'da `NoSuchMethodException` ile çöker") ve `@InternalAPI` ("her an değişebilir/kaldırılabilir") annotasyonları ham kaynakta görüldü. Sürüm sayıları: `minSdk 23, compileSdk 37, targetSdk 36, jvmTarget 11` (`gradle/libs.versions.toml`); bizim `android/variables.gradle` `minSdkVersion = 24` → alt sınır uyumlu. Bağımlılık uyarısı: `jackson-module-kotlin` ve `rhino` sürümleri **kasten sabitlenmiş** ("daha yenisi minSdk<26'da çöker"); kütüphaneyi gömmek bu pin'leri bize de bulaştırır.

**Shim boyutu (tahmin, belirsizlik payıyla):** İnce Capacitor köprüsü ~200–400 KB Kotlin + CloudStream `library` ve geçişli bağımlılıkları (ktor, kotlinx-*, ksoup, rhino, jackson, coil…) **birkaç MB** mertebesi. Kesin sayı derlemeden çıkmaz; spike'ta `assembleDebug` + APK Analyzer ile ölçülmeli. Karşılaştırma noktası: Nuvio-JS shim'i saf JS (~50–150 KB) ve sıfır native bağımlılık.

**İmzalı/imzasız jar riski:** İmza zorunluluğu **yok**; yalnız `fileHash` bütünlük kontrolü var (bozulmayı yakalar, kötülüğü yakalamaz). Eklenti host process'te **keyfi kod** çalıştırır (repo uyarısı da aynı: "extensions can execute arbitrary code"). İmzasız üçüncü taraf `.cs3` = kullanıcı verilerine, ağa ve depolamaya tam erişim. Azaltımlar (hepsi efor): repo allowlist + hash pin'leme, `PluginData.isOnline` ayrımı, tehlikeli eklentiye `PROVIDER_STATUS_DOWN`, en güçlüsü süreç-dışı çalıştırma (pratikte yok — ayrı process + AIDL ikinci proje). Bizim "doğrulanmış kaynak" yasasıyla da çelişir: CS3 ekosistemi doğrulanmamış topluluk scraper'larıyla büyür.

## 3. CloudJS durumu: resmi JS eklenti denemesi

**Bulgu: olgun değil — aramada resmi bir "CloudJS" eklenti runtime'ı bulunamadı** (`"CloudJS" cloudstream` sorgusu sıfır sonuç; resmi dokümantasyonun eklenti yolu baştan sona Kotlin + TestPlugins şablonu). Mevcut JS parçaları eklenti host'u değil, **scraper-içi yardımcılar**:
- **Rhino 1.8.1** (kasten pinli, bkz. §2) — video-host obfuscation çözme (`JsUnpacker`, `JsHunter`).
- **`JsInterpreter.kt`** — Rhino'yu değiştirmek için yazılmış saf-Kotlin mini yorumlayıcı; desteklediği alt küme açıkça dokümante (var/let/const, string/array metotları, `Math.*`, `parseInt`, template literal, `if/for/while`, fonksiyonlar) ve **yürütme bütçeli** (zaman + instrüksiyon sayacı; `while(true)` asamaz). Amaç: "kendi deobfuscation senaryolarımız" — genel eklenti sandbox'ı değil.
- **Örnek eklenti:** `ExampleProvider.kt` 20 satır (sınıf + `mainUrl/name/supportedTypes/lang` + boş `search` stub'u) — JS örneği yok.
- Üçüncü taraf not (bağımsız blog, resmi değil): Nuvio TV 0.9.1 kaynağında "CS3-tarzı harici yükleyici" izi geçtiği iddia ediliyor — resmiyet derecesi düşük, kanıt sayılmaz.

**Worker-host planına uyum:** Uymaz — resmi tarafta bağlanacağımız bir JS kontratı yok. Worker içinde CS3-Kotlin çalıştırmanın yolu da yok (JVM gerektirir). Yani "CloudJS'e binelim" seçeneği bugün **sıfırdan bizim yazmamız** anlamına gelir; o eforu doğrudan §4'teki Nuvio-JS kontratına harcamak daha rasyonel (kontrat elimizde, kanıtlı).

## 4. Karşılaştırma: aynı eforla Nuvio-JS kontratı

**Nuvio kontratı (elimizde, `~/İndirilenler/nuvio-rea/INCELEME-RAPORU.md` §2 + §8):** manifest URL'i → `{name, version, description, author, scrapers[]}`; scraper başına 19 alan (`id, filename(JS), supportedTypes/Formats/Platforms, contentLanguage…`); paketleme saf **CommonJS** (`module/exports` sarmalayıcı); native köprüler `__native_fetch` + 14 `__crypto_*` + 9 `__cheerio_*` (+`UrlBridge`, `WasmBridge`); polyfill'ler `fetch, CryptoJS, Buffer, btoa/atob, TextEncoder/Decoder, AbortController, WebAssembly`; sonuç JSON döner; oynatıcıya **doğrudan URL** verilir (yerel proxy kanıtı yok — ktor ölü bağımlılık).

| Boyut | CS3 (.cs3/Kotlin) | Nuvio-JS |
|---|---|---|
| Dil/yükleyici | Kotlin + `PathClassLoader`, manifestli dex | Saf JS (CommonJS), Worker/QuickJS/jsdom'suz tarayıcıda bile koşar |
| Platform | **Yalnız Android** (Electron/web dışı) | **Üç platform** (web + Capacitor + Electron aynı kod) |
| Host köprü | `MainAPI`+`ExtractorApi`+okhttp yığını (büyük yüzey) | `fetch/crypto/cheerio` üçlüsü (dar yüzey; bizde `fetch`+DOM zaten var) |
| Sandbox | Yok (host process'te keyfi kod) | Worker + allowlist + timeout ile kurulabilir |
| Lisans | GPL-3.0 bulaşma riski | Temiz-oda shim; copyleft yok |
| API oynaklığı | `@Prerelease/@InternalAPI`, `apiVersion` eğriltmesi | Kararlı-görünen dar köprü (sürüm bizde) |
| Örnek olgunluğu | `ExampleProvider` + 500'lük topluluk reposu (kanıtlı, ama hukuken kirli) | REA ile decompile-kanıtlı kontrat (şema elimizde) |
| Tahmini MVP eforu | 20–40 sa (native plugin + serileşme + ölçüm + izinler) | 6–10 sa (Worker host + 3 köprü + 1 örnek scraper) |
| Yasa uyumu | Zayıf (doğrulanmamış topluluk kodu) | Güçlü (allowlist'li, imzalı kendi scraper'larımız) |

**Hüküm: Nuvio-JS önce.** Gerekçe: 3–4× daha ucuz, üç platformda çalışır, sandbox'lanabilir, lisans temiz, mevcut `providerRuntime/batch/probe/playback` boru hattına (`coz(args)→{sources,trace}` sözleşmesine) adaptörle oturur. CS3, Android'e özel ikinci fazda bile ancak "kullanıcının kendi sorumluluğunda yüklediği" opsiyonel mod olabilir.

## 5. Öneri: faz planı + şimdi yapma listesi

**F0 — Doğrulama (1–2 sa, dokunuş: `notlar/` + 1 spike dosyası):** Nuvio-JS kontratının bilinmeyen son parçası (`WasmBridge` bağlama adı, `wrapPluginModule` dışı çağrı şekli) için REA oturumu açılıp kapatılır; sonuç bu rapora eklenir. Çıktı: dondurulmuş köprü şeması.
**F1 — Worker host MVP (6–10 sa, dokunuş: `src/services/pluginRuntime/` yeni klasör + 1 örnek scraper):** `Worker` içinde CommonJS sarmalayıcı + `__native_fetch` (AbortController'lı, 30 sn batch bütçesine bağlı) + `__crypto_*` (WebCrypto) + `__cheerio_*` (yerleşik DOMParser/cheerio-lite) köprüleri; `manifest→scraper JS→JSON→normalizeStream` adaptörü; `trace` alanına `family: 'nuvio-js'` etiketi. Web'de doğrula, sonra Capacitor ve Electron'da aynı Worker kodunu koştur.
**F2 — Katalog ve denetim (4–6 sa, dokunuş: `pluginCatalog.js` genişletme):** `PLUGIN_DEFS`'e `kind:'nuvio-js'`, `manifestUrl`, `fileHash pin`, `kapali` bayrağı; `gizli-tara` kapısına hash-politikası; boş-durum rehberine kod-adı satırı. Kullanıcı eklenti URL'i ekleyebilir ama varsayılan kapalı + uyarılı.
**F3 — (Opsiyonel, ertele) CS3-Android spike (20–40 sa, dokunuş: `android/` yeni Capacitor plugin + `library` AAR):** Yalnızca F1–F2 üretimde ve talep kanıtlıysa. İlk iş APK-Analyzer boyut ölçümü + GPL kararı; olumsuzsa kapat.

**Şimdi yapma (net):**
1. `library/`'yi (veya AAR çıktısını) depoya gömme/kopyalama — GPL bulaşmadan hukuk kararı çıkmaz.
2. `DexClassLoader/PathClassLoader` ile imzasız `.cs3` yükleyen hiçbir kodu `main` dalına birleştirme.
3. Electron/web'i kapsayan bir plan olmadan "CS3 desteği" sözü verme — teknik olarak Android-dışı imkânsız.
4. Topluluk `.cs3` depolarını varsayılan kataloga ekleme (keyfi kod + telif riski kullanıcıya patlar).
5. `CloudJS` varsayımına kod yatırma — resmi kontrat bulunana kadar isim olarak bile backlog'a yazma.
6. `getTrackList/DubController` adlarına kodda referans verme — çekirdekte doğrulanmadı; `audioTracks` yeter.

## Kaynaklar

- Repo/kök: https://github.com/recloudstream/cloudstream · LISANS: aynı repoda `LICENSE` (GPL-3.0) · eklenti sistemi notu README'de ("extension-based", kaynak sağlanmaz).
- Ham kaynaklar (okundu): `library/…/MainAPI.kt` (`loadLinks` imzası ~692. satır), `library/…/utils/ExtractorApi.kt` (`ExtractorLink`, `ExtractorApi.getUrl`), `app/…/plugins/PluginManager.kt` (`PathClassLoader` + `manifest.json` parse), `app/…/plugins/RepositoryManager.kt` (`Repository`/`SitePlugin` şemaları), `gradle/libs.versions.toml` (`minSdk 23`, pin yorumları), `library/…/utils/JsInterpreter.kt` (alt küme + bütçe).
- Dokka: `MainAPI` üye listesi (https://recloudstream.github.io/dokka/library/com.lagradost.cloudstream3/-main-a-p-i/index.html) — `search/quickSearch/getMainPage/load/loadLinks` imzaları.
- Csdocs: eklenti geliştirici akışı (gettingstarted → using-plugin-template → create-your-own-providers → create-your-own-json-repository); provider rehberindeki `search/load/loadLinks` 4-parçalı model.
- Şablon: https://github.com/recloudstream/TestPlugins (`ExampleProvider.kt` stub, `cloudstream{}` gradle bloğu, `MANAGE_EXTERNAL_STORAGE` notu).
- Nuvio kontratı: `~/İndirilenler/nuvio-rea/INCELEME-RAPORU.md` §2 (manifest+19 alan+QuickJS köprüleri) ve §8 (`wrapPluginModule` CommonJS, `__native_fetch`/14 `__crypto_*`/9 `__cheerio_*`, polyfill seti).
- Bizim taraf: `android/variables.gradle` (`minSdkVersion = 24`); yapı için `cinepulse-yapi` skill'i (KAYIT/kind/probe/playback boru hattı).

## Sınırlar (20 dk kutunun dürüst artıkları)

- Derleme/kurma/cihaz testi yapılmadı; `.cs3` ikili yapısı `PluginManager` okumasından çıkarıldı, hex-dump doğrulanmadı.
- `apiVersion` uyumluluk matrisi ve `BasePlugin.Manifest`'in tüm opsiyonel alanları okunmadı.
- "CloudJS" için resmi kaynak bulunamadı; olumsuz bulgu web aramasına dayanır (resmi repo+dokümantasyon taraması dahil).
- Boyut ve saat tahminleri aralıktır; spike ölçümü (F3 ilk işi) olmadan kesinleşmez.

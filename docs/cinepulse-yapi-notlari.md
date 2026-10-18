CinePulse Studio — Proje Yapısı (v1.1.69)

GENEL: Yerli ve global kaynaklı hibrit medya merkezi: film/dizi/anime keşfi, kişisel kütüphane, canlı TV ve oynatma. Tek kod tabanı; Web (Vercel), Windows/Linux (Electron) ve Android (Capacitor) olarak dağıtılır. Vite + saf JS (framework yok), hash tabanlı SPA router. Veri yerelde; hesap gerekmez.

KÖK: index.html (anti-reklam & anti-redirect kalkanı, PWA meta etiketleri); vite.config.js (dev proxy: kaynak siteler + :4000 sidecar; Python çözücü dev fallback'i); vercel.json, capacitor.config.json; package.json (dev/build/server/pack:*/cap:sync/test:providers).

src/main.js: Giriş ve router. initPlatformBridge ile platformu belirler (web/android/desktop); hash'e göre görünümü tembel (code-splitting) yükler: #home, #detail, #library, #downloads, #discover, #popular, #livetv, #drama. Profil, Trakt senkronu, kaydırma ve veri olaylarını bağlar.

src/views/: HomeView, DetailView, LibraryView, DownloadsView, DiscoverView, PopularListView, ShowcaseView, LiveTvView, DramaView. src/components/: Navbar, MediaCard, HeroSlider, PlayerModal, Profile*, PluginsModal, TraktModal, SetupWizard, Toast, player lifecycle yardımcıları. src/styles/, vendor/ (crypto-js), devtools/.

src/services/: Motor. 27 *Scraper.js (dizilla, dizibal, dizify, hdfilmcehennemi, fullhdfilmizlesene, webteizle, animecix...); akış: streamExtractors, directStreamExtractor, embedExtractors, encryptedPlayer, globalStreamEngine, livePlayback; altyapı: storage (localStorage + IndexedDB, bekleyen kayıt kuyruğu), tmdbApi (çok anahtarlı rotasyon, TR sıralaması), tvmaze/fanart/trakt, EPG/liveTv/xtream, torrent (webtorrent/p2p), nativeHttp, mediaMatcher, offlineManager, pwaManager, appUpdater, performanceMode, scrollManager.

providerRuntime/: Sağlayıcı sözleşmesi (contract, flow, batch, probe, playback, inventory, diagnostics). services/providers/: Kayıt defteri (providerRegistry, _template, flows/*.json). src/providers/: Gizli adlı yerleşik sağlayıcılar (aria, atlas, corvus, kit, luna, orion, tera, vega). services/platform/: Platform köprüleri ve çözücüler (web/android/desktop, WebView resolver, androidTransport, challengeSolver, deviceCookies).

api/: Vercel serverless ([...all].js yönlendirici, _security, _liveSources, canlı TV, epg, fanart) + api/providers/*.py Python çözücüler (resolve.py, hdfc_stream.py, provider_cli.py). server/: Node sidecar (mediaServer.js: torrent→HTTP, HLS/altyazı proxy, Range stream) + ekstraktörler. electron/: main.cjs, preload, playerFrame, store, updateManifest, verification (gizli WebView ile Cloudflare aşma, GPU watchdog, kurulum sihirbazı). android/: Capacitor (derlenmiş web + java/python).

DESTEK: tools/, scripts/, tests/, deploy/ (relay), docs/, reports/, public/, dist/-release/ (build çıktısı).

VERİ AKIŞI: View → providerAggregator/siteProviders → Scraper/runtime akışı → extractor oynatılabilir bağlantı → PlayerModal platform motoru (HLS.js/torrent). İzleme geçmişi ve ilerleme storage'da; profil başına ayrı ad alanı.

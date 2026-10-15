# mpv-F0 Fizibilite — Oynatıcı Motoru (devralınmış rapor)

> big-pickle dispatch'i 50 dk sessiz takıldı → ebeveyn raporu yazdı (commit'li);
> big-pickle sonra tamamlandı ve bulguları DOĞRULANARAK bu belgeye birleştirildi
> (2026-10-15). Tüm bulgular depo grep'ine veya açık kaynak belgesine dayanır.

## 1. Bugünkü gerçeklik (dosya:kanıt)

- **Electron zaten çocuk süreç doğuruyor**: `electron/main.cjs:232` (:4000 sidecar'ı
  `process.execPath` ile spawn), `runBin` yardımcıları, terminal spawn desenleri
  (`main.cjs:901`). mpv spawn bu kasada **yeni beceri değil, yeni satır**.
- **MKV bugün ölü değil**: `server/mediaServer.js:1803` `/api/mkv_stream` ffmpeg ile
  `-c copy` remux yapıyor → MKV içinde H.264/AAC varsa masaüstü+web bugün çalar.
  Kalan acı: **HEVC/DV video, DTS/Atmos ses, ASS altyazı stilleri** — tarayıcı
  kodek tavanı remux ile aşılamaz; Nuvio'nun 1 numaralı farkı tam burası.
- **P2P motoru** (:4000 WebTorrent + Range/206) F1 ile üretime bağlandı; mpv aynı
  `:4000/torrent/<hash>` URL'ini source'suz yutar — P2P×mpv bedava birleşim.
- **ÖLÜ SÖZ (doğrulandı 2026-10-15)**: `SetupWizardModal.js:523-530` kullanıcıya
  "Harici Oynatıcı: MPV, VLC" seçtiriyor ama `opt_player_mode` HİÇBİR YERDE
  okunmuyor/kaydedilmiyor — tek göründüğü dosya wizard'ın kendisi. Dürüstlük
  kuralımız gereği D1'de ya gerçekten bağlanacak ya silinecek.
- **Remux'un gizli eksiği** (big-pickle bulgusu): `mkv_stream` `-c copy` hattı
  SRT/ASS altyazıları düşürüyor, HEVC'yi `hev1` etiketiyle veriyor (tarayıcı
  yine play etmeyebiliyor) → mpv yolunda remux tamamen kalkacak, ham MKV + gömülü
  ASS doğrudan mpv'ye gidecek.
- Android'de harici uygulama köprüsü **zaten var**: `MainActivity.java:113 openMagnet`
  (ACTION_VIEW deseni) — harici oynatıcı uyandırma altyapısı hazır.
- `electron/playerFrame.cjs` video motoru değil (sağlayıcı sayfa düzeni katmanı) —
  mpv işine karışmaz.
- `electron/preload.cjs:5` `CinePulseDesktop` contextBridge köprüsü — yeni IPC
  kanalları buraya eklenir, mimari hazır.
- electron-builder: win(nsis)+linux(deb) hedefleri var, **extraResources henüz yok**
  — mpv binary'si ilk extraResource olacak (mimaride engel değil, ilk kez yapılacak).

## 2. Masaüstü: mpv'yi nereye/how

**Yöntem A — AYRI SÜREÇ + IPC (ÖNERİLEN)**
- `mpv --idle --force-window --input-ipc-server=<boru> <url>`; boru Windows'ta
  `\\.\pipe\cinepulse-mpv`, Linux'ta `/tmp/cinepulse-mpv.sock`. JSON-lines protokolü:
  `loadfile`, `get/set_property` (pause, time-pos, sub-delay, audio-delay, volume),
  `observe_property` ile durum geri akışı (konum/süre/duraklatma → izleme geçmişi).
- Bizim UI → mpv: preload köprüsüne `mpv:invoke/invokeSync` kanalları; PlayerModal
  kontrolleri `directPlayerHost:'mpv'` bayrağıyla köprüye yönlenir.
- **GÜVENLİK (big-pickle bulgusu, zorunlu)**: mpv IPC'de kimlik doğrulama YOK ve
  `run` komutu keyfi süreç çalıştırıyor → köprü **beyaz liste** ile koşacak
  (`loadfile/set_property/get_property/observe_property` var; `run`/`load-script`
  asla). Socket yolu rastgele; sahiplik deseni `verificationPlayer.cjs:23-27`'den.
- **Lisans: temiz.** mpv GPL; AYRI SÜREÇ çalıştırmak derleyip bağlamak değil —
  "aggregation". GNU GPL FAQ "#MereAggregation" bunu açıkça söylüyor: "pipes,
  sockets and command-line arguments" ayrı programlar arası normal iletişim.
  Kodumuz kapalı kalır; libmpv'yi Node'a bağlamak YASAK (aynı adres alanı = linking).

**Yöntem B — pencere gömme (--wid)**
- `BrowserWindow.getNativeWindowHandle()` → `--wid`. AMA (big-pickle düzeltmesi,
  Node-MPV #106 kanıtı): mpv `--wid`'e verilen **pencerenin tamamını** kaplar —
  bizim kontrollerin üstünde kalır. Gerçek gömme = video alanı için ayrı **çocuk
  pencere** + `SetWindowPos/XMoveResize` FFI + yerleşim zinciri. Yerleşim zincirinin
  hazır kalıbı var: `verificationPlayer.cjs` renderer-rect → main → native-bounds.
- **Windows/Linux-X11'de olur; Wayland ve macOS'ta gömme YOK** (mac hedefimiz yok).
- Sonuç: B sanıldığı gibi kozmetik değil, ayrı bir mühendislik fazı. MVP = A
  (mpv kendi penceresinde, kontrol senkronu IPC ile); B = D2 fazının asıl maliyeti.

**Binary dağıtımı — iki yol (big-pickle ile birlikte netleşti)**
- Ucuz yol: **sistem mpv'si dağıtılmaz** — kuruluysa kullan, yoksa kurulum
  sihirbazının mevcut ffmpeg kanalıyla kullanıcıya öner (`main.cjs:511-618` kalıbı
  hazır: `which` yoksa DEB kurulum akışı). Lisans yükü + boyut = SIFIR.
- Rahat yol: Windows extraResources ile gömülü portabl mpv.exe (zip'i 24-31 MB,
  açılınca ~60-150 MB — gerçek sayı D1'de ölçülür); Linux .deb `depends: ["mpv"]`.
- Karar: D1'de **ucuz yol** (sihirbaz kanalı), ölçüm sonrası gerekirse rahat yol.

## 3. Devir protokolü (PlayerModal → mpv)

1. PlayerModal kaynak seçince: masaüstü + mpv mevcutsa → `desktopMpv.open(url, opts)`
   (preload → main.cjs spawn/yeniden kullan) → mpv penceresi açar, akış başlar.
2. IPC geri akışı: time-pos/duration → mevcut izleme geçmişi + FlowPilot skor
   sinyalleri (bugünkü `saveWatchProgress` hattına bağlanır; P2P'de boşta kalan
   geçmiş açığı burada kapanır).
3. mpv yoksa (binary bulunamadı / kullanıcı kapattı) → bugünkü video tag hattına
   sessiz düşüş. Kullanıcı yarı yolda asla hataya düşmez.
4. HLS de mpv'ye gidebilir (ffmpeg HLS'i yutar) — sorunlu sağlayıcılarda hls.js
   alternatifi olarak ikincil düğme: "mpv ile aç".

Kabul testleri: (a) HEVC+DTS .mkv tek tıkla çalar; (b) ASS altyazı stilleri mpv
ayar dosyasında kalıcı; (c) 20 dk izlenen film izleme geçmişinde yarım görünür;
(d) mpv kapalıyken her şey bugünkü gibi çalışmaya devam eder.

## 4. Android

- **Gömme (libmpv plugin): YAPAMAYIZ** (big-pickle ile kesinleşti — gerekçem
  "pahalı"ydı, "imkânsız" daha doğru): JNI üzerinden GPL-2+ kodu APK'nın TAMAMINI
  GPL kapsamına sokar; Android API 29+ `execve` kısıtı ayrı duvar; +~100 MB.
- **Gerçekçi ve tek yol — harici oynatıcı**: `openMagnet`'teki ACTION_VIEW kalıbıyla
  (`MainActivity:110-137`) `video/*` intent; mpv-Android manifest'i `.mkv`/`video/*`
  filtreliyor, VLC de öyle. Header'lı akış için gateway relay URL'i verilir. 6-10
  saat, APK boyutu değişmez. Telefonda HW-HEVC çoğu cihazda ZATEN var; kapanan
  boşluk ASS stil + DTS. **A1 fazı budur.**
- Dürüst sınır: harici oynatıcı = KANALIM/FlowPilot/ilerleme senkronu orada ölür
  (kullanıcı bilinçli tercih, UI'da böyle yazacak). SetupWizard'daki ölü
  "Harici Oynatıcı" sözü de A1'de gerçeğe döner.

## 5. Elenen alternatifler

- **ExoPlayer/Media3 genişletmeleri**: kodek eklentileri NDK + lisans (DTS patent)
  çıkmazı; ASS hâlâ eksik. Eledik.
- **WASM mpv**: pratik yok (decode tavanı). Eledik.
- **Sadece ffmpeg remux'u büyütmek (transcode)**: CPU/fan, 4K'da ölü. Eledik.

## 6. Faz planı ve tahmin

| Faz | İş | Dokunuş | Saat |
|---|---|---|---|
| D1 | mpv spawn + beyaz-listeli IPC köprüsü + "mpv ile aç" (ayrı pencere) + sihirbaz mpv-yok uyarısı + düşüş yolu + ölü `opt_player_mode` sözünün bağlanması | main.cjs, preload.cjs, P2pModal+PlayerModal küçük bağ, SetupWizardModal | 14-20 |
| D2 | ÇOCUK-PENCERE gömme (--wid + SetWindowPos FFI, X11/Win) + kontrol yansıtma + geçmiş yazma + ass stil şablonu | main.cjs, PlayerModal | 30-40 (ağırlık çoğu FFI'de — big-pickle düzeltmesi) |
| A1 | Android "harici oynatıcıda aç" intent (A2 gömme YOK) | MainActivity.java, PlayerModal | 6-10 |

**İlk sürüm hedefi: D1 tek başına 1.2.x'e girer** — "her dosya çalar" vaadinin
büyük kısmı masaüstünde o an doğuyor; P2P akışı da mpv'ye taşınmış oluyor (ikili
kazanç) ve wizard'daki ölü söz kapanır.

## 7. Yapamayız / riskler (dürüst liste)

- Wayland + macOS'ta gömme pencere; **Android'de libmpv gömme (GPL bulaşması +
  API 29 execve + ~100 MB — kalıcı olarak kapıda)**.
- mpv kurulu olmayan Windows makine: gömülü binary çözünce maliyeti biz taşırız
  (kurulum boyutu +~40-150 MB — gerçek sayı D1'de ölçülecek, kullanıcıya sürüm
  notunda söylenecek).
- Debrid→mpv zinciri Faz-2'de de "anında açılıyor" hissi vermez; o his debrid
  cache-check fazının işi (VEGA Faz-2).
- libmpv Android gömmede GPL3 sürüm betiklerini kullanırsak APK GPL yükümlülüğü
  doğar — kendi LGPL derlememiz şart; bu nedenle A2 ertelendi.

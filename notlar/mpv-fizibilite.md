# mpv-F0 Fizibilite — Oynatıcı Motoru (devralınmış rapor)

> big-pickle dispatch'i 50 dk sonra sözsüz takılınca ebeveyn devraldı (2026-10-15).
> Tüm bulgular depo grep'ine veya açık kaynak belgesine dayanır; "bilmiyorum" işaretli.

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
- **Lisans: temiz.** mpv GPL; AYRI SÜREÇ çalıştırmak derleyip bağlamak değil —
  "aggregation". Kodumuz kapalı kalır, tek yükümlülük mpv'nin kendi lisans metnini
  pakette taşımak. (Libmpv'yi aynı sürece gömmek linking olurdu — yapmıyoruz.)

**Yöntem B — pencere gömme (--wid)**
- `BrowserWindow.getNativeWindowHandle()` → `--wid` mpv'ün video katmanını bizim
  pencereye gömer. **Windows ve Linux/X11'de çalışır; Wayland'da çalışmaz** (wid yok),
  **macOS'ta desteklenmez** — bizde mac hedefi yok, Linux'ta X11/ Wayland ayrımı
  kaçınılmaz: B, A'nın üstüne kozmetik katman, ayrı faz.
- Öneri: MVP = A (mpv kendi penceresinde, UI senkronu IPC ile); B = faz-2 cilası.

**Binary dağıtımı**
- Windows: shinchiro/mpv-winbuild portabl `mpv.exe` → `extraResources`. Boyut: tam
  build ~150 MB, kesik build ~30-60 MB — **gerçek sayıyı ilk entegrasyonda ölçeriz**.
  Alternatif (daha küçük kurulum): ilk kullanımda mpv.io'dan kullanıcı-onaylı
  indirme — OTA indirme desenimiz zaten var, ama "çift tıkla → çalsın" vaadini
  geciktirir; ilk hedef gömülü binary.
- Linux .deb: `build.linux.deb.depends += ["mpv"]` — apt çözer, binary taşımıyoruz.

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

- **Gömme (libmpv plugin)**: NDK + libmpv-shared (LGPL yapılandırma, ffmpeg LGPL
  kodeklerle) + Surface entegrasyonu ≈ 40-60 saat ve lisans dikkat işi
  (mpv-android'ın hazır derleme betikleri GPL-3 sürüm — biz LGPL-shared kendi
  derlememizi yaparız). **Ertelendi, değer/hacim hesabı sonra.**
- **Gerçekçi kazanım — harici oynatıcı**: `openMagnet`'teki ACTION_VIEW kalıbıyla
  `video/*` intent + mpv-android/VLC hedefleme; PlayerModal'a "Harici oynatıcıda aç"
  düğmesi. 6-10 saat, APK boyutu değişmez. Telefonda HW-HEVC çoğu cihazda ZATEN var;
  asıl kapanan boşluk ASS stil + DTS. **Faz-2'de bu.**
- Dürüst sınır: harici oynatıcı = KANALIM/FlowPilot entegrasyonu orada ölür
  (kullanıcı bilinçli tercih, UI'da böyle yazacak).

## 5. Elenen alternatifler

- **ExoPlayer/Media3 genişletmeleri**: kodek eklentileri NDK + lisans (DTS patent)
  çıkmazı; ASS hâlâ eksik. Eledik.
- **WASM mpv**: pratik yok (decode tavanı). Eledik.
- **Sadece ffmpeg remux'u büyütmek (transcode)**: CPU/fan, 4K'da ölü. Eledik.

## 6. Faz planı ve tahmin

| Faz | İş | Dokunuş | Saat |
|---|---|---|---|
| D1 | mpv spawn + IPC köprüsü + "mpv ile aç" menü (ayrı pencere) + düşüş yolu | main.cjs, preload.cjs, P2pModal+PlayerModal küçük bağ, extraResources, deb depends | 14-20 |
| D2 | UI senkron derinleştirme (kontrol yansıtma, geçmiş yazma, ayar dosyası şablonu) + --wid gömme (X11/Win) | PlayerModal, main.cjs | 10-16 |
| A1 | Android "harici oynatıcıda aç" intent | MainActivity.java, PlayerModal | 6-10 |
| A2 | libmpv gömme plugin (LGPL-shared) | yeni capacitor plugin | 40-60 (ERTELENDİ) |

**İlk sürüm hedefi: D1 tek başına 1.2.x'e girer** — "her dosya çalar" vaadinin
%80'i masaüstünde o an doğuyor; P2P akışı da mpv'ye taşınmış oluyor (ikili kazanç).

## 7. Yapamayız / riskler (dürüst liste)

- Wayland + macOS'ta gömme pencere (A planı separate-window olduğu için etkilemez).
- mpv kurulu olmayan Windows makine: gömülü binary çözünce maliyeti biz taşırız
  (kurulum boyutu +~40-150 MB — gerçek sayı D1'de ölçülecek, kullanıcıya sürüm
  notunda söylenecek).
- Debrid→mpv zinciri Faz-2'de de "anında açılıyor" hissi vermez; o his debrid
  cache-check fazının işi (VEGA Faz-2).
- libmpv Android gömmede GPL3 sürüm betiklerini kullanırsak APK GPL yükümlülüğü
  doğar — kendi LGPL derlememiz şart; bu nedenle A2 ertelendi.

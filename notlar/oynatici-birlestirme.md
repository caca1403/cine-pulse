# Rakip oynatma motoru → CinePulse oynatıcı davranışsal birleştirme analizi

Tarih: 2026-10-16  
Kapsam: salt analiz, kod değişikliği yapılmamıştır.  
Rakip kanıt: tek bir proprietary `.so` (libnuvio_engine.so, sha256 bfabdc…6a29) üzerinde Ghidra decompile çıktısı. Büyük (`decon-nuvio_engine_*.md`, ~39 MB) hata dökümü dosyaları **kullanılmadı**. `prepare_stream TAMAM` iddiasına dayanılmadı.

## 1. Kanıt zinciri (dosya:satır)

<|constrain|> # | Kanıt dosyası | Kullanılan satırlar | İşlev |
|---|---|---|---|
| 1 | `~/İndirilenler/nuvio-rea/evidence/decon-capi-create.md` | 164-328 | `nuvio_engine_create` (struct doğrulama + zaman aşımı/worker alanları) |
| 2 | `~/İndirilenler/nuvio-rea/evidence/decon-capi-get_stream_stats.md` | 164-330 | `nuvio_engine_get_stream_stats` (64 byte ad + min boy 40 + min kopya 104) |
| 3 | `~/İndirilenler/nuvio-rea/evidence/decon-capi-add_torrent.md` | 164-289 | `nuvio_engine_add_torrent` (struct min 16 + mode 0/1 dalları) |
| 4 | `~/İndirilenler/nuvio-rea/evidence/decon-capi-status_message.md` | 164-171 | `nuvio_engine_status_message` (0–10 kodları + `"unknown status"`) |
| 5 | `~/İndirilenler/nuvio-rea/evidence/decon-capi-reclaim.md` | 164-172 | `nuvio_engine_reclaim_disk_cache` |
| 6 | `~/İndirilenler/nuvio-rea/evidence/decon-nativePrepareStream.md` | 164-254 | JNI `nativePrepareStream` + `nuvio_engine_stream_request_init_sized(..., 0x20)` + `nuvio_engine_prepare_stream` |

Ghidra çıktısıdır, orijinal kaynak değildir; alan adları/yorumlar yorum niteliğindedir. Semantiği doğrulanmayan yerler **BİLİNMİYOR** olarak işaretlenmiştir.

## 2. Rakibin gözlenebilir motor davranış sözleşmesi (temiz-oda, yalnız şekil)

Kaynak kanıt: yukarıdaki 6 dosya. Kopyalanmadı, davranış ifade edildi.

- **Motor oluşturma** (`decon-capi-create.md:164-328`): param_1 en az `0x38` (56 byte) olmalı; iki null olmayan, boş olmayan string zorunlu (ofs +2 ve +4). `+0xb` alanı 0/1 ise standart, 2 ise çapraz-callback (`+0xc`) dolu olmalı (`:317`). Varsayılan zaman aşımı A = 30000 ms (`:392`), B = 60000 ms (`:398`); boyut ≥ 0x40/0x48 ise istemci değerini alır (`:393-401`). Worker sayısı ≤ 2 (`:410-412`). Opsiyonel 16384 bayt sınırında null-sonlandırılmış ek string (`+0x12`, `:419-447`). Handle boyutu 0x68 (`:450`). Çıktı handle `*param_2`'ye yazılır; hata kodları 0/1/2 (`:201-322`).
- **Hazırlama (prepare)** (`decon-nativePrepareStream.md:195-232`): JNI girisinde iki string parametresi doğrulanır (FUN_00421390). Birincisi boş/sız ise hata döner (prepare yapılmaz). İkinci string (`param_6`) null ise metadata boş; değilse okunur ve hataya düşerse hata (`:233-240`). Başarılı dal: 32 byte'lık istek struct'ı (`nuvio_engine_stream_request_init_sized(..., 0x20)`, `:209`), kaynak string'i, bayrak (`param_5`), isteğe bağlı ikinci string kopyalanır (`:210-223`); sonra `nuvio_engine_prepare_stream(param_3, &istek, &out_handle)` çağrılır (`:225`), dönüş kody ve handle JNI üzerinden Java'ya aktarılır (`:228-231`).
- **Durum kodları** (`decon-capi-status_message.md:164-171`): `0..10` toplam 11 kod; tablo değerleri descentrikt; default `"unknown status"`. Rakibin UI durum makinesi en az 11 duruma iner (`BİLİNMİYOR`: her kodun anlamı).
- **Akış istatistik yoklaması** (`decon-capi-get_stream_stats.md:164-330`): handle üzerinde en az 40 byte'lık istemci struct'ı; 64 byte'lık (`.lVar19 == 0x40` kontrolü, `:220`) null-terminated ve lowercased ad zorunlu (`:217-291`). Başarılıysa engine `0x68` (104) boyuta kadar `memcpy` (`:496-500`). Hata kodları 1/2 (`:398`). **Anlamı BİLİNMEYOR** (hangi alan bw/buffer/peers).
- **Torrent ekleme** (`decon-capi-add_torrent.md:164-289`): struct min 16 byte (`:193`). `+0x10` (ofs 16) == 1 ise byte aralıklı dosya modu (başlangıç `+0x18`? ofs 24, uzunluk `+0x20`? ofs 32) ve `FUN_003d8940` + `FUN_003d9e20` ile eklenir (`:385-406`); değilse fallback magnet/URL string dalı (`+0x8`, `:203-232`). Tekrar: tam alan adları Ghidra çıktısında çözümlenmedi → **BİLİNMEYOR**.
- **Disk önbellek geri alma** (`decon-capi-reclaim.md:164-172`): handle + ikinci param (kullanılmamış görünüyor) + `*param_3 = 0`; handle+0x60 üzerinde `FUN_003dba50` çağırır. A açık API sunar: "disk cache reclaim".

## 3. Bizim oynatıcı mimarisi (dosya:satır)

- `src/services/oynatici/playerFrame.js:14-18`: site profili listesi boş; `frameUrlFor` çoğu URL'de ham adres döner (`:34-45`).
- `src/services/oynatici/playerFrame.js:56-67`: sandbox politikası (popup/top-nav kapalı).
- `src/components/PlayerModal.js:177-189`: `releaseMediaElement` (pause → srcObject/src temizle → load → destroy hls → remove) — Android WebView ses sızıntısı düzeltmesi.
- `src/components/PlayerModal.js:191-221`: `disposePlayback` (nesil artır, progress persist, scope dispose, torrent destroy, iframe src sıfırlama).
- `src/components/PlayerModal.js:2803-2891`: `triggerAutoFailover` (throttle 2500 ms, definitive HTTP hata anında; max 3; dol Discover devam ediyorsa bekle).
- `src/components/PlayerModal.js:6389-6432`: `updatePlayerContainer` (nesne yaşam döngüsü, discovery broadcast, iframe tekrar basma koruması).
- `src/components/PlayerModal.js:6524-6771`: doğrudan oynatma yolu: HLS.js (geniş config `:6538-6566`), MANIFEST_PARSED seek (`:6638-6657`), fatal hata recovery (`:6672-6713`), yerel HLS fallback (`:6714-6740`), direkt mp4 (`:6741-6771`).
- `src/components/PlayerModal.js:6598-6627`: kaynak-spesifik durma sayaçları (FilmMaker 8 sn, DS 15-20 sn).
- `src/components/PlayerModal.js:6783-6879`: çift ses motoru (ana video + dublaj sesi senkronu).
- `src/components/PlayerModal.js:569-665`: odak/oynatma uyumlaştırma (smooth/strict, drift 18 sn eşiği, checkpoint 90 sn).
- `src/services/canli/livePlayback.js:1-11`: çoklu temizleme (hls/mpegts/frames).
- `server/mediaServer.js:1029-1279`: `/hls_proxy` + `/api/hls_proxy` (curl önceliği, playlist rewrite, binary pipe, Range geçişi `:1084-1086`).
- `server/mediaServer.js:492-...`: `/proxy` + `/api/proxy`.
- `api/[...all].js:192-421`: Vercel HLS proxy (curl benzeri playlist rewrite + segment pipe + yerel cache notları `:400-410`).
- `api/[...all].js:449-770`: Vercel genel proxy.
- Notlar: `notlar/p2p-fizibilite.md` (WebTorrent zaten var, üretici eksik), `notlar/mpv-fizibilite.md` (ayrı süreç + IPC beyaz liste).

## 4. Kategori tablosu

### a) Rakipte var, bizde yok (aday davranışlar)

1. **Açık akış durum makinesi (11 kod).** Bizde boolean `hasPlayerStartedPlaying` + `triggerAutoFailover` ve hls.js olayları var; rakibin 0–10 kodlu durum sözleşmesi daha açık. Direkt kopyalama değil; bizde `HTMLMediaElement.readyState`, `Hls.Events` ve buffered hesaplarından kendi enum'umuzu türetebiliriz. Kanıt: `decon-capi-status_message.md:164-171`; bizim taraf `PlayerModal.js:6598-6627,6672-6713`.
2. **Poll tabanlı akış istatistikleri (104 byte buffer).** Bizde `buffered.end` ve timeupdate var, ama tek bir normalize edilmiş poll yapısı yok. Rakibin buffer'ının anlamı **BİLİNMEYOR**, bu nedenle alan-parite iddiası yapılmaz. Kanıt: `decon-capi-get_stream_stats.md:309-316`.
3. **Disk önbellek geri alma API'si.** P2P tarafında WebTorrent 30 dk idle temizlik var (`p2p-fizibilite.md:6`), ama açık reclaim çağrısı yok. Rakipte `reclaim_disk_cache`. Kanıt: `decon-capi-reclaim.md:164-172`.
4. **İki string'li (URL + metadata) hazırlama ve durum kodu ile dışa aktarım.** Bizim `updatePlayerContainer` doğrudan DOM kuruyor; rakipte prepare → status + out handle. Eşdeğer davranış (hata → failover) bizde var, ama status nesnesi yok. Kanıt: `decon-nativePrepareStream.md:195-232,225-231`.

### b) Bizde var, rakipte kanıtta yok (korunacak)

1. **Kaynak keşfi + anonim etiket + failover önceliği** (`PlayerModal.js:2803-2891`, `1629-1647`).
2. **Çift ses senkron motoru** (`PlayerModal.js:6783-6879`).
3. **Oda eşzamanlama (smooth/strict, drift, checkpoint, tepki dock)** (`:569-665`, `:812-837`).
4. **Media Session API + progress/Trakt** (`:753-792`, `:455-507`).
5. **Masaüstü doğrulama penceresi köprüsü** (`:6433-6469`).
6. **Mobil offline gateway/IndexedDB oynatma** (PlayerModal üst bölüm `:107-160`; livePlayback).
7. **Pop-up/top-frame muhafazası** (`playerFrame.js:56-67`, `PlayerModal.js:223-250`).
8. **Adil temizlik** (`releaseMediaElement`, `disposePlayback`) — rakipte kanıtlarda görünmeyen ama kendi tarafımızın güçlü tarafı.

### c) İkisinde de var ama farklı (hangisi iyi?)

| Konu | Rakip (kanıt) | Biz | Değerlendirme |
|---|---|---|---|
| **Proxy/loopback** | Loopback HTTP Range yanıtı (p2p notları BEP-14/DHT; kanıtta "bind/listen on HTTP loopback" string'leri) | `server/mediaServer.js:1029` node proxy + Vercel `api/[...all].js:192` | **İkisi de meşru.** Rakibin loopback'i cihaz-içi akış için; bizim cloud/edge proxy'si referer/origin bypass + playlist rewrite için. yt'de loopback Range, bizim tarafta eksik değil; `server/mediaServer.js` Range geçişi var (`:1084-1086`). Hangisi iyi: **kullanım noktasına göre ikiye ayrılır** (loopback = yerel P2P segmenti, cloud proxy = harici CDN). |
| **Hazırlık/sinyal** | status kodu 0–10 (`status_message.md:164-171`) | `hasPlayerStartedPlaying` + hls olayları (`PlayerModal.js:551,6672`) | **Bizim taraf daha olay-temelli ve test edilebilir**, ama açık enum yok. Birleştirme: kendi 6–8 durumlu enum + HTMLMediaElement mapping. |
| **Sağlık kontrolü** | 104 byte stats poll (`get_stream_stats.md:164-330`) | Kaynak-spesifik sayaçlar (8/15/20 sn) (`PlayerModal.js:6598-6627`) | **Rakip tek bir noktada toplar**, biz dağınık ama daha hedefli. Birleştirme: sayaçları ortak `streamHealth` modülüne çek. |
| **Durma tespiti** | bilinmiyor (kanıtta ölçüm stratejisi yok) | FilmMaker 8 sn / DS 15 sn / HDF 18 sn timeout (`PlayerModal.js:6598-6637`) | **Bizim mevcut strateji ölçülmüş ve kalır**; rakipten transfer edilecek bir şablon yok. |
| **HLS proxy playlist rewrite** | DEĞERLENDİRMEDİ (rakipte kanıt playlist rewrite etmiyor; loopback segment) | curl önceliği + satır satır rewrite (`mediaServer.js:1116-1232`, `api:296-386`) | **Bizim taraf daha zengin**, tarayıcı kısıtlarına (Origin/UA/Range) uygun. Korunur. |
| **Torrent akışı** | Native çekirdek + loopback Range | WebTorrent 1.9.7 sidecar + `:4000/torrent/` Range→206 (p2p-fizibilite:6,7) | **Mimari farklı, ama royalty temiz.** Nuvio'nun native torrent çekirdeği d) kategorisinde. |
| **Temizlik** | `reclaim_disk_cache` açık API | idle 30 dk GC + `disposePlayback` | **Bizde daha UI-odaklı.** reclaim API eklemek küçük ve güvenli. |

### d) Rakipte var ama hedefimiz değil

1. **Loopback Range HTTP sunucusunun proprietary uygulaması.** Kendi gateway/sidecar zaten var; rakibin `.so` içini kopyalamak yasak (`p2p-fizibilite.md:25` dürüst sınır). Kanıt: `decon-capi-*` Ghidra çıktısı.
2. **Torrent çekirdeği (native lib)** ve Android jlibtorrent entegrasyonu henüz hedef değil; planımızda mevcut WebTorrent + Android mevcut gateway var (F2/F3).
3. **Anti-bot/Cloudflare atlatma kodu** (yok denemez; kanıtta string'ler var ama klonlanmayacak). Sınır açıkça konur.
4. **Yorumlanamayan stat buffer (104 byte)** ve status tablosu anlamları (`BİLİNMİYOR`).
5. **GPU/decoder dizeni ve codec tavanı**: Nuvio proprietary; bizim mpv ayrı-süreç yolu `mpv-fizibilite.md` ile planlandı.

## 5. İş paketleri (en fazla 5)

Her paket: iş, dosya, kabul kriteri, test edilebilir mi, risk, bağımlılık.

### IP-1 — Akış sağlık durum enum'u + modül

- İş: `HTMLMediaElement.readyState`, HLS.js olayları, buffered hesabından 6–8 durumlu (`IDLE, CONNECTING, BUFFERING, PLAYING, STALLED, ERROR, ENDED`) enum ve saf fonksiyonlar üret. Nuvio'nun 11 kodlu durumuna davranışsal parite (birebir kod kopyalamadan).
- Dosya: yeni `src/services/oynatici/streamHealth.js` (salt okunur; mevcut `playerFrame.js` pattern'ine uygun); `PlayerModal.js:6598-6627` sayaçları bu modüle taşı.
- Kabul: aynı girdi → aynı durum; 3 sahte senaryo (network error timeout, media error recovery, clock advanced) testte PASS.
- Test edilebilir mi: **Evet** — pure fonksiyon; `tests/stream-health.test.mjs` yazılabilir (node test pattern: `tests/live-playback.test.mjs`).
- Risk: PlayerModal karmaşıklığı; gerileme riski orta. Önce modül + test, sonraki PR'da bağlama.
- Bağımlılık: none (ilk).

### IP-2 — Stall sayacı politikasının konfigüre edilebilir hale getirilmesi

- İş: `6598` (FilmMaker 8 sn), `6607` (DS 15/20 sn), `6628` (HDF 18 sn) sabitleri tek konfig objesine çek.
- Dosya: `src/services/oynatici/playerFrame.js` yanına `stallPolicy.js` veya `PlayerModal.js` içi sabit blok.
- Kabul: tek yerden değiştirilebilir; varsayılanlar değiştirilmez; testte konfig değiştirip zaman aşımı tetiklenebilir.
- Test edilebilir mi: **Evet** (pure policy objesi test edilir).
- Risk: düşük (davranış değişmez).
- Bağımlılık: IP-1 sonrası (tercihen).

### IP-3 — HLS proxy Range uyumluluğu paritesi (edge + node)

- İş: Her iki proxy'de binary segment yanıtında `Accept-Ranges`, `Content-Range`, `Content-Length`, ve istemci `Range` geçişinin garanti edilmesi; playlist segmentleri için tutarlı rewrite. Eksikse ekle.
- Dosya: `server/mediaServer.js:1243-1279`, `api/[...all].js:394-421`.
- Kabul: `Range: bytes=0-999` isteği 206 + `Content-Range` döner; playlist rewrite çıktısı geçerli `.m3u8`.
- Test edilebilir mi: **Kısmen** — integration test (supertest veya fetch) gerekir; pure parse fonksiyonu için unit test.
- Risk: Vercel cache/headers edge case; staging'de kontrol.
- Bağımlılık: yok; bağımsız yapılabilir.

### IP-4 — Açık disk önbellek geri alma API'si (P2P tarafına)

- İş: `reclaimDiskCache()` çağrısı ekle; `server/mediaServer.js`'de idle GC'ye ek olarak manuel tetik. Nuvio'nun reclaim davranışına parite (kendi implementasyonumuz).
- Dosya: `server/mediaServer.js` (mevcut WebTorrent yönetimi), `src/services/kaynak`/`p2p` katmanı (repo'da mevcut p2pService).
- Kabul: çağrılında cache boyutu hedefe düşer; aktif stream bozulmaz.
- Test edilebilir mi: **Kısmen** — birim test (mock cache), E2E gerekir.
- Risk: düşük-orta; yanlış reclaim aktif akışı kesebilir → "protected data" koruması eklenecek (kanıtta "reclaim limited by protected torrent data" string'i).
- Bağımlılık: IP-3'ten bağımsız; P2P F1 ile birlikte.

### IP-5 — mpv ayrı-süreç oynatıcısı D1 (mpv-fizibilite.md)

- İş: mpv binary tespiti + spawn + beyaz-listeli IPC köprüsü + `PlayerModal`'a "mpv ile aç" düşüş yolu; ölü `opt_player_mode` sözünü bağla.
- Dosya: `electron/main.cjs`, `electron/preload.cjs`, `src/components/PlayerModal.js` (küçük bağ), `src/components/SetupWizardModal.js`.
- Kabul: HEVC+DTS MKV mpv'de çalar; mpv kapalıyken bugünkü yol aynen devam eder; beyaz liste `run`/`load-script`'i engeller.
- Test edilebilir mi: **Kısmen** — IPC beyaz liste unit test edilebilir; spawn E2E.
- Risk: orta-yüksek; platform-spesifik.
- Bağımlılık: IP-1/IP-2'den bağımsız; son.

## 6. Açık bilinmeyenler (dürüst liste)

- `status_message` 11 kodun anlamı (`decon-capi-status_message.md` sadece kod + pointer dönüşü veriyor).
- `get_stream_stats` 104 byte buffer'ın alanları ve ad normalleştirme algoritmasının üretici tarafındaki karşılığı.
- `add_torrent` byte-aralıklı dalın tam hedef dosya indeksi (index mi range mi) — Ghidra çıktısı net değil.
- `nativePrepareStream` ikinci string'in (metadata) kullanım amacı.
- Rakibin seek-öncelik (piece priority) stratejisi `BİLİNMEYOR` (p2p notu: kanıt yok).
- Çalışma zamanı performans farkı (ölçüm yok, ham kanıt yok).
- Anti-bot/Cloudflare kod yolları bilinçli olarak analiz edilmedi.

## 7. Korunan sınırlar (guardrails)

- Rakibin `.so` içi kodu/türevi kopyalanmaz; yalnız davranış sözleşmesi temiz-oda not edilir.
- Anti-bot/Cloudflare atlatma kodu klonlanmaz.
- `src/` ve `tests/` bu oturumda değiştirilmemiştir; iş paketleri gelecek oturumlara aittir.

## 8. Kaynak index (kısa)

- Rakip evidence: yukarıdaki 6 dosya (`decon-capi-*`, `decon-nativePrepareStream`).
- Bizim oynatıcı: `src/services/oynatici/playerFrame.js`, `src/components/PlayerModal.js`, `src/services/canli/livePlayback.js`, `server/mediaServer.js`, `api/[...all].js`.
- Fizibilite: `notlar/p2p-fizibilite.md`, `notlar/mpv-fizibilite.md`.
# P2P Motoru — F0 Fizibilite (KAPILI ÖZET)
Tarih: 2026-10-15 · big-pickle F0 oturumu (ses_ec090bd3…) toplanan kanıtları döndürdü, dosya kapanmadan kesildi; özetı kapı (ebeveyn) yazdı. TAM ham kanıt dökümü bu oturumun son mesajında.

## ALTIN BULGU
**Motorun yarısı repoda ZATEN VAR:**
- `server/mediaServer.js` (Electron sidecar :4000): WebTorrent v1.9.7 (MIT) tam kurulu — DHT/uTP/LSD, ~30 tracker, 30dk idle temizlik, `GET /torrent/:infoHash` **Range→206/Content-Range uç-uca hazır** (L1843-1904), `/torrent-check` durum JSON'u.
- `PlayerModal.js` `:4000/torrent/` URL'lerini 4 yerde kabul ediyor (L1118/2863/3117/6529) → oynatıcı hazırlanmış.
- **EKSİK TEK ŞEY: üretici yok** — hiçbir UI `/torrent/<hash>` URL'i üretmiyor (grep: 0 sonuç). Endpoint yetim.
- Android: `NativeMediaGateway` (NanoHTTPD, 127.0.0.1:0 ephemeral + **rastgele token**, Range geçişi, CORS https://localhost) + `DownloadProgressService` (foreground dataSync) + cleartext=true HAZIR — ama torrent çekirdeği YOK.
- `pulsarCatalog.js`: torrent satırları `isCatalogOnly, autoPlayable:false` — sınırım (motor genel, katalog→P2P köprüsü yok) zaten mimaride gömülü. ✓
- Reklam çelişkisi: `SetupWizardModal.js:356` "WebTorrent motoru" diyor — kullanıcıya yarım vaat veriliyor; F1 bunu kapatır.

## TEKNOLOJİ KARARI
- **Masaüstü:** mevcut WebTorrent (MIT, bakım 10/10) kalır. ⚠️ Sürüm kayması: kurulu 1.9.7 / package.json ^1.9.7 / lock'ta 3.0.21 → F1'de tek hedefe sabitlenecek.
- **Android:** jlibtorrent (MIT, FrostWire; arm64 prebuild, SDK24+, 16KB-page ✓, Ekim 2025 sürüm) + mevcut gateway'e rota. Node libtorrent bağlayıcıları: hepsi ölü/üretim-dışı → elendi. GPL'li istemciler (LibreTorrent vb.) paketlenmez (lisans: proprietary).
- WebView-içi P2P (webtorrent browser modu): sadece WebRTC → eş havuzu çok zayıf → ANDROİD YOLU OLMAZ (dürüst sınır).

## FAZ PLANI
- **F1 Masaüstü MVP (14-20s):** üretici bağlantısı (magnet girdisi → engine → :4000/torrent → PlayerModal) + dosya seçimi + durum çipi. Kabul: gerçek seed'li magnet 13sn'de hazır; seek=206; katalog otomatik akıtmıyor (kod incelemesi); cache GC çalışıyor.
- **F2 Android (30-50s):** jlibtorrent native plugin + foreground servis + gateway token'lı stream rotası + pil/veri uyarıları. Cihaz testi zorunlu.
- **F3 UI/cila (10-16s):** onay diyaloğu (Nuvio P2pConsentDialog deseni — IP görünür, dürüstlük kuralımız), cache yönetimi ayarı, i18n, testler.
- Toplam ≈ **55-85 saat**.

## DÜRÜST YAPAMAYIZ LİSTESİ
Nuvio .so kopyalama/türev (yasak); MKV/HEVC altyazı garantisi (P2P çözmez, ayrı sorun); soğuk torrent'te "anında oynat" sözü (durum gösterilir: metadata/yok/buffer); GPL paketleme; katalog→P2P otomatik köprü (kendi kuralımız); iOS (yok, konu dışı).

## RİSKLER / F1 GİRDİSİ
`skipVerification:true` (bozuk parça riski — F1'de ölç), 13sn timeout soğuk torrentlerde düşürür, parça-önceliklendirme ("gerçek izlerken-indir") doğrulanmadı → F1'de ölçülecek, desktop :4000'de token YOK (Android'de var) → F1 hardening: token + Android deseni parite, mobil veri/pil uyarısı UI'ı.

## NUVİO DAVRANIŞ SÖZLEŞMESİ (temiz-oda — yalnız şekil, kod değil)
prepare(handle, magnet|torrent-bytes, fileIndex) → statü+kablık döndürür · poll(event 0x3c0: int,long×3,String×2,int,long,String×2) · statü 7=olay yok · loopback 127.0.0.1 HTTP + Content-Type + Range · LSD(BEP-14)+DTLS. BİLİNMEYEN (RE): seek öncelik stratejisi, port seçimi. Kanıt: evidence/decon-nativePrepareStream.md (90.708 satır), decon-nativePollEvent.md.

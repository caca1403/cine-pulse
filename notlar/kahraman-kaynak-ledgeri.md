# Kahraman kaynak ledger'ı — tek tek durum (ölcüm dayanakli)

Tarih: 2026-10-16 · Dayanak: `tools/kahraman-kopru-olcum.mjs` (köprü taklidi) ve
`tools/kahraman-alan-kontrol.mjs` (alan adi denetimi). Alan adlari bu dosyada
YAZILMAZ; kahraman kodu + ölçülen semptom kullanilir.

## Ölçülen genel resim

| Ölçüm | Sonuç |
|---|---|
| Kayit (vendor + birinci taraf) | 43 + 2 = 45 |
| Alan adi denetimi | 39 diri · 6 HTTP 403 · 0 DNS ölüsü |
| GoT S1E1 tam tarama (vendor 43) | 14 kayıt yayın verdi |
| GoT S1E1 · TEMIZ havuz (15 kayit) | 14 kayit / 21 yayin · **11,0 sn** (oncesi: 41 kayit, 53,2 sn, 19 yayin) |
| Inception (film) · temiz havuz | 12 kayıt deneniyor; Black-Adam + Beast-Boy + Star-Lord(3) doğrulandı |
| Kapaniş | 30 kayıt `durum: 'kapali'` — kod duruyor, taramaya girmiyor; 15 kayıt `canli` |

Temizlik gerekçesi: üç ayrı içerikte (dizi/film) ölçüldü, hiçbiri tek yayın
vermedi. Kendi alan adları diri ama oynatıcı çözümlemeleri bayat; kod silinmedi,
site site port edildiğinde `durum` geri açılır.
| Yukarı akış bundle sürümü | 1.14.620 — CANLI ILE AYNI, yani "yenisi var" yolu yok |
| Yukarı akış config | 43 domain · 0 cookiе · 3 disabled (zaten haritada degil) |

Önemli ders: **site adresleri diri**. Yayın vermeyen kayıtlar sitenin kendi
içinde, oynatıcı çözümleme adımında kaybediyor (eski isaretçi / yeni işaretleme).
Bu nedenle tek makine yaması yok; kaynak bazında yeniden port gerekir. Buna
karşın bağımsız çözücüler (Star-Lord, Wolverine) site kazımadan yayın verdiği
için aynı içeriği hemen oynatilabilir kılıyor.

## Birinci taraf yeniler (ölçüldü, ikisi de CANLI)

- **Star-Lord** — oynatıcı API'sinden düz `.mp4` (360/480/720/1080).
  · GoT S1E1 → 4 yayın · Inception → 3 yayın.
  · BAŞLIKSZ istenir: `Referer` eklenince CDN 429 veriyor (ölçüldü) → vekil
    sarmalama YAPMIYOR (başlık yok → `/api/hls_proxy` gereksiz).
  · Yalnız ALTYAZILI yayın → her yayın etiketi "Altyazı" taşır; işaret olmazsa
    derleyici yayını dublaj sekmesine atıyor.
  · Şifreleme ucu sayısal TMDB ister, IMDb ile `null` döner → kayıtta
    `kimlik: 'tmdb'`. İkinci hat (vidmody) öldü, alınmadı.
- **Wolverine** — katalog aramasından düz `play.m3u8` (Altyazı + Dublaj).
  · Breaking Bad S1E1 → 2 yayın, `#EXTM3U` dogrulandi (HTTP 200).
  · Eski `admin-ajax.php?action=data_fetch` ucu 59 bayt boş dönüyor; arama
    `/?s=<sorgu>` ile yapılıyor ve arama sayfasi bolum adreslerini dogrudan
    listedigi icin ekstra dizi sayfasi turu gereksiz.
  · Turev slug tuzağı: "Stranger Things" → "stranger-things-tales-from-85";
    tam slug eslesmesi önce denenir.

## Olay yeri:vendor kayıtların kaybetme sebepleri (örnekler, ölçülen günlük)

| Kahraman | Ölçülen semptom | Sını | Ne gerektirir |
|---|---|---|---|
| Cyborg | arama + bölüm sayfası 200/187KB, `_vs` sayfada YOK (sadece okunuyor) | işaretleme değişti | sitenin yeni kaynak ucu bulunacak (AJAX ucu 404: denendi) |
| Hawkeye | "Video oynatıcı verisi bulunamadı" (sayfa 200, 118KB) | işaretleme değişti | oynatıcı kalıbı yeniden kazınacak |
| Batman | 45 istek → "Video akışı çözümlenemedi" | akış ucu değişti | uç yeniden bulunacak |
| Zatanna | "Oynatıcı kaynakları boş döndü" | api bos | uç yeniden bulunacak |
| Superman | "Akış endpointi HTTP 404" | uç tasınmış | yeni uç adresi |
| Thor / Flash | "Oynatıcı kaynağı çözümleniyor…" → sessiz | işaretleme | kalıp güncelleme |
| Doctor-Fate | "TAMAMLANDI: 0 aktif ve çalışan akış" | süzüntü hepsini eliyor | doğrulama gevşetme |
| Daredevil / Punisher | İspanyolca/Çekçe başlıkla arıyor, 14-18 sn | aday listesi uzun | aday listesi tr/en ile sınırlandırılabilir (hız kazancı, yayın kazancı değil) |
| Nightwing / Supergirl / Poison-Ivy | "Eşleşen anime bulunamadı" | tür uyumsuz | o içerik kaynakta yok (bozuk değil) |
| Hulk / Black-Widow / Thanos (+3) | alan adı HTTP 403 (denetici başlıksız gitti) | bot koruması | başlık/cerezle yeniden denenecek |
| Scarlet-Witch | haritada adresi `null`'du → `vegapunk` adresi bulundu, artık 4 gerçek istek atıyor | eksik kayitti | ıçerik eşleşmesi izlenecek |

## "Yayın var" ≠ "yayın oynuyor" — dogrulama adimi (YENI ARAC)

`tools/kahraman-yayin-dogrulama.mjs` her yayni ham adresinden ceker, medyanın
gercek imzasina bakar (#EXTM3U / ftyp), HLS ise ilk varyant + segmenti indirir.

Olçüm (GoT S1E1, 20 yayin): **11 kaynak / 12 yayin oynatilabilir** — Aqualad,
Aquaman, Black-Adam, Constantine, Deadpool, Doctor-Fate(3), Falcon, Hawkman,
Thanos. Kalan 4 kaynak: Beast-Boy (4K varyanti zaman asimi), Joker (host 500),
Moon-Knight (host zaman asimi), Shazam ve Star-Lord (**test IP'miz kotaya girdi**:
ayni adrese 116 MB indirme testi yaptik; olcum oncesinde 200/95045b ve 3 yayin
olarak dogrulanmisti).

Kok bulus: oynatici ilk acilista `Range: bytes=0-` gonderiyor; hem Android
`NativeMediaGateway` hem web `server/mediaServer.js` bunu yukariya aynen
iletiyordu ve imzali HLS uclari (dizisol, streamcorecdn, zenoak) 500/timeout
veriyordu → cihazda "kaynak aciliyor, video oynamiyor". Artik `bytes=0-`
iletilmiyor; gercek aralik istekleri (seek) aynen aktarilir.

## Sıradaki iş sırası (öneri)

- [ ] 403 yiyen 6 kaydı başlık + çerezle yeniden dene; 403 sürüyorsa `kapali` işaretle
      (bütçe diri kaynağa kalsın).
- [ ] Cyborg/Hawkeye/Batman/Zatanna/Superman: site site yeni oynatıcı ucu bul
      (`tools/kahraman-kopru-olcum.mjs --kod X` ile tek tek ölç).
- [ ] Nuvio havuzundan cheerio isteyenler (JetFilmizle, AsyaAnimeleri, dortkhd,
      Dizipal, SelcukFlix, Sinewix): düzenli ifadesel ayrıştırma ile bağımlılıksız
      port edilebilir mi diye bak.
- [ ] Aday listesi kısaltma yaması (hız): 41 çekirdeğin çeviri adayları tr/en ile
      sınırlansın → tarama bütçesi diri kayıtlara yarar.
- [ ] Kart logoları: `aktifAnahtar()/siradakiAnahtar()` dışa açıldı; fanart kuyruğu
      bu havuzu kullanacak + 429'da kartlar "sonra tekrar denenecek" kalacak.

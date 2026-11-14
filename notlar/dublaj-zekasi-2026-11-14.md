# TR Dublaj Zekâsı + MultiDubEndgame — 2026-11-14

> **Yürüten:** lead · Oturum: 2026-11-14 02:18–04:25 (Europe/Istanbul)
> **Kullanıcı isteği:** *"her şeyi tam otonom hale getir, türkçe dublaj bir içerik
> varsa onu her yerde sorunsuz izleyebileceğim öyle bir yol bul ki hayatım boyunca
> kolay kolay bozulmasın, siteye bile çoğu zaman gerek kalmayacak hale gelsin"* +
> *"hdfilmcehennemi, selcukflix, dizilla arşivine eriş, yıldızlı kaynak olarak al,
> adı multidubendgame olsun"*

---

## 0. Ortam düzeltmesi — "ağ yok" teşhisi YANLIŞTI

Önceki oturum "sandbox'ta ağ yok, 38 çekirdek onarılamaz" diye raporlamıştı.
**Ölçüm:** IPv6 çıkışı kırık, IPv4 sağlam.

```
$ curl -4 -s -o /dev/null -w "%{http_code}" https://www.google.com   → 200 (6.5s)
$ curl -6 -s -o /dev/null -w "%{http_code}" https://www.google.com   → 000
$ getent ahostsv4 www.google.com                                     → 142.251.156.119
```

Node 18+ DNS sırası `verbatim` olduğu için tüm fetch'ler IPv6'yı deneyip 8 sn'de
düşüyordu. Çözüm: `NODE_OPTIONS="--dns-result-order=ipv4first"`.

**Sonuç:** movie taraması `26/56 canlı` (önceki oturumda 0/56 sanılıyordu).

---

## 1. MultiDubEndgame — 4 yıldızlı arşiv kaynağı (hepsi canlı ölçüldü)

| Kaynak | Uç | Durum | Dublaj sinyali |
|---|---|---|---|
| **HDFC** | `GET /search/?q=` → JSON `{query, results[html]}` | ✅ 200 | Kart metni (zayıf) |
| **Selçukflix** | `POST /api/mj {action:'searchContent'}` | ✅ 200 | `object_language: "Türkçe Dublaj"` (**doğrudan**) |
| **Dizilla** | `POST /api/mj {action:'getBrowseTitles'}` | ✅ 200 | Slug soneki `-turkce-dublaj` |
| **FilmMakinesi** | `GET /arama/?s=` → HTML | ✅ 200 | Kart rozeti `Dual` |

### Ölçülen tuzaklar (hepsi kodda çözüldü)

1. **FilmMakinesi düz curl'e 403 veriyor.** Tam tarayıcı başlıkları
   (`Sec-Fetch-*`, `Accept-Language: tr-TR`, `sec-ch-ua`) ile **200**.
   `tarayiciBasliklari()` bunu kurar.
2. **Dizilla film sitesi DEĞİL** — dizi-only. `/film/*` rotası yok; `kind:"film"`
   her sorguda `total:0`. IMDb kimliği de vermiyor (`imdb` alanı PUAN, kimlik değil).
3. **Dizilla'da arama action'ı `searchContent` DEĞİL.** `getBrowseTitles` ve
   `Origin` + `Referer` **zorunlu** (biri eksikse `403 forbidden`).
4. **Selçukflix ve Dizilla aynı vendor RPC'sini farklı şemayla kullanıyor.**
5. **HDFC `/search?q=` → 301**, doğrusu `/search/?q=` (sondaki eğik çizgi).

### Doğrulama (gerçek ağ, Fight Club / 550)

```
kaynak durumu: hdfc ✅2  selcukflix ✅1  filmmakinesi ✅2  dizilla ✅0 (film yok — doğru)
eşleşen: 3
 - star:selcukflix  | Fight Club              | 1999 | dublaj       | 1
 - star:filmmakinesi| Dövüş Kulübü            | 1999 | dublaj       | 1
 - star:hdfc        | Dövüş Kulübü - Fight Club| 1999 | bilinmiyor  | 0.817
```

---

## 2. TR Dublaj Sicili — "siteye gerek kalmadan" katmanı

`src/services/dogrudan/dublajSicili.js` (553 satır, ağsız, saf işlevler)

### Neden yeni bir katman?

Projede **1147 kayıtlık TR dublaj arşivi vardı ama hiçbir çalışma-anı kodu onu
okumuyordu** — kanıt toplanmış, kullanılmıyordu. Uygulama her açılışta sıfırdan
tarıyordu.

### Dört mekanizma

1. **Kalıcı sicil** — `(içerik, sağlayıcı)` için kanıt cihazda saklanır. Site
   kapansa da bilgi kalır.
2. **Kanıt kalıtımı (önsel)** — bir sağlayıcı N başlıkta gerçek `tr` ses izi
   kanıtladıysa, ölçülmemiş başlıklarında TR dublaj **olasılığı** hesaplanır.
   Dublaj bir *yayın* özelliğidir, site özelliği değil.
3. **İçerik önseli** — bir içerikte *herhangi* bir kaynakta TR ses kanıtı varsa,
   aynı içeriğin tüm kaynakları bundan faydalanır (CDN host'ları yüzünden
   sağlayıcı eşlemesi çoğu zaman bilinmez — bu katman o kaybı telafi eder).
4. **Kendini onarma** — oynatma başarı/başarısızlığı sicile geri beslenir.
   Başarılı kaynak yükselir, hatalı düşer (**silinmez** — geçici ağ hatası
   olabilir). Kanıt 45 gün yarılanma ömrüyle solar. Başarısızlık sayacı 14 gün
   soğumayla yarıya iner.

### Kural: beyan ≠ kanıt

`dublajArsivi.js` ile aynı sözleşme: **`'dublaj'` iddiası yalnız medya okumasıyla
(m3u8/ts/mp4/mkv) yazılır.** Etiket (`Türkçe Dublaj` yazısı) `kanit:'etiket'`
olarak saklanır ama `dilDurumu:'bilinmiyor'`a düşer. Yanlış pozitif dublaj,
kullanıcıyı yanlış kaynağa götürmekten daha pahalıdır.

---

## 3. Sıralama: puan DEĞİL kademe (ölçülen kusur düzeltildi)

İlk uygulama saf puan sıralamasıydı. **Ölçülen kusur:** kanıtlı 480p kaynak,
kanıtlı 1080p'nin önüne geçiyordu — dublaj uğruna **kalite sırası bozuluyordu**.

Çözüm: üç kademe + kararlı bölümleme.

| Kademe | Anlam |
|---|---|
| 0 | Kanıtlı Türkçe dublaj |
| 1 | Nötr / bilinmiyor / altyazı |
| 2 | Kanıtlı özgün dil |

Kademe içinde çağıranın kalite sırası **birebir** korunur.

```
GİRDİ  (kalite): Cyborg 1080p > Star-Lord 720p > Hulk 1080p > Aquaman 480p
SIRALI         : Cyborg 1080p > Hulk 1080p  > Aquaman 480p > Star-Lord 720p
                  └── dublaj kanıtlı (kalite sırası korundu) ──┘  └ kanıtsız sona ┘
```

Eski kanıt (tazelik < 0.35) kademe **belirlemez** — yanlış tarafa itmek, hiç
dokunmamaktan kötüdür.

---

## 4. Canlı kanıt ölçümü (kanit-toplayici teammate)

`tools/dublaj-kanit-tara.mjs` + `notlar/dublaj-kanit-2026-11-14.json`

- 26 çekirdek × 2 başlık (movie 550, tv 1399 S1B1) = 52 deneme
- **74 akış ölçümü, 37'sinde GERÇEK `tr` ses izi** (`EXT-X-MEDIA LANGUAGE=tr`)
- Kanıt tipleri: m3u8 39 · yok 35 (okunan TS segmentlerinde ISO-639 yok → uydurma yapılmadı)
- En güçlü: shazam (6/16), dizisol (5/15), aquaman/catWoman/falcon/ironMan/nova/phyla/superman/winterSoldier (2/2)

`tools/dublaj-tohum-derle.mjs` bunu `public/dublaj-tohum.json`'a derler:
**32 kayıt · 30 dublaj · 21 sağlayıcı**. APK'ya gömülür → ilk açılışta sicil
"akıllı" başlar.

---

## 5. Entegrasyon noktaları

| Dosya | Değişiklik |
|---|---|
| `src/main.js` | Açılışta `onekleriYukle()` + `tohumuYukle()` (1.5 sn sonra, bloklamaz) |
| `src/services/kaynak/providerAggregator.js` | `payload` öncesi kademeli sıralama (hata → sessiz geç) |
| `src/components/PlayerModal.js` | **`rememberWorkingSource`/`rememberFailedSource` boş stub'dı** → gerçek geri bildirim |

**Ölçülen sessiz hata:** bu iki kanca `() => {}` idi; "hangi kaynak gerçekten
oynadı" bilgisi hiçbir yere yazılmıyordu.

**Ölçülen ikinci sessiz hata:** sağlayıcı öneki `^([a-z0-9]+_)` kalıbı
`sp_hulk_abc` id'sinden yalnız `sp_` çıkarıyordu → sicil anahtarı `sp_hulk_`
ile eşleşmiyor → sıralama **sessizce etkisiz**. Çözüm: KAYIT tablosundan gelen
önek listesiyle **en uzun eşleşme**.

---

## 6. Doğrulama

```
node --test tests/            → 816 test · 815 pass · 0 fail · 1 skip
./node_modules/.bin/vite build → ✓ built in 15.22s
npx cap sync android           → ✓ Sync finished
./gradlew :app:assembleDebug   → EXIT=0 · app-debug.apk 83 MB
```

Yeni testler: `tests/multidub.test.mjs` (61) + `tests/dublaj-zekasi.test.mjs` (19).

APK içinde doğrulandı:
```
assets/public/dublaj-tohum.json                    8379 bayt
assets/public/assets/dublajZekasi-BmWgpK9T.js     24938 bayt
```

Yan düzeltmeler (benim değişikliğimden bağımsız, önceden kırıktı):
- `tests/desktop-short-drama-disabled.test.mjs` — 2.0.4 sürümüne güncellenmemiş beklenti
- `tests/android-webview-resolver.test.mjs` — 1 ms'lik zaman kırılganlığı (7999≠8000)
- `android/capacitor.settings.gradle` — `cap sync` CI dual-resolver'ı eziyordu, geri alındı

---

## 7. Açık riskler (dürüst liste)

1. **Dizilla dizi-only.** Filmler için o kaynak hiç sonuç vermez — bu bir hata
   değil, sitenin yapısı (canlı ölçüldü, 9371 slug'lı sitemap'te de film yok).
2. **Tohum yalnız 2 içerik kapsıyor** (550 film, 1399 S1B1). Kapsam
   `tools/dublaj-kanit-tara.mjs --cekirdekler ... ` ile genişletilebilir; her
   çalıştırma yeni kanıt ekler ve tohum yeniden derlenir.
3. **Yıldız arşiv taraması ana akışa bağlı DEĞİL.** `arkaPlandaZenginlestir()`
   hazır ama oynatma yolundan henüz çağrılmıyor — bilinçli: önce sıralama ve
   geri bildirim döngüsünün sahada çalıştığı görülmeli.
4. **XMLHttpRequest dışı ağlarda** (web CORS) Selçukflix/Dizilla RPC'leri
   tarayıcıdan doğrudan çalışmaz; vekil köprüsü gerekir. APK'da sorun yok.

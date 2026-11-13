# Sağlayıcı Sağlık Raporu — 2026-11-13

> **Yürüten:** `saglayici` (teammate) · **task-1** · Ölçümler gerçek ağ üzerinde
> alındı; hiçbir sayı tahmin değildir. Kullanıcı gereksinimi: *"site tamamen
> çökmediği sürece kaynaklar asla bozulmasın."*
>
> Ortam: CachyOS/Arch, Node v26.13.1, gerçek internet. Her komutun çıktısı
> aşağıdaki bölümlerde birebir alıntılanmıştır.

---

## 0. Özet (ölçülen başlıklar)

| Ne | Önce | Sonra | Kanıt |
|---|---|---|---|
| Sağlık aracı JSON ayrıştırma | canlı çekirdekler "json-bozuk" | son dengeli JSON nesnesi ayrıştırılıyor | `node --test tests/kahraman-toplu-test-parse.test.mjs` → 5/5 |
| Canlı alan adı (51 kahraman) | 39 canlı | **45 canlı** | `node tools/kahraman-alan-kontrol.mjs` |
| Shazam (dizisol ailesi) | 0 akış | **tv 7, movie 9** | `node tools/cekirdek-test.mjs shazam.js …` |
| Web `/api/<kod>` çözümü | 404 (web'de çekirdek 0) | 5/5 rota canlı 200 | `node -e "…saglayiciYaniti(…)"` |
| Dayanıklılık testleri | yok | 12/12 geçti | `node --test tests/alan-dayaniklilik.test.mjs` |
| TV sağlık koşusu | — | **16/57 canlı** | `node tools/kahraman-toplu-test.mjs --tur tv --timeout 45` |
| Movie sağlık koşusu | — | **23/57 canlı** (+ ölçüm gürültüsü: `dizisol` tekrar ölçümde 8 → numune etkin **24/57**) | `node tools/kahraman-toplu-test.mjs --tur movie --timeout 45` |

Regresyon: `node --test` ile seçili **122 test → 122 pass / 0 fail**; ek olarak
Cloudflare dağıtım testleri 15/15.

---

## 1. Sağlık aracındaki JSON ayrıştırma hatası (kök neden + düzeltme)

**Hata:** `tools/kahraman-toplu-test.mjs` içinde `cikti.match(/\{[\s\S]*\}/)`
stdout'taki **ilk** `{`den başlıyordu. Çekirdekler ilerleme satırlarında da
süslü parantez basıyor:

- Zatanna: `TAMAMLANDI: 1 akış … [ { title: … } ]`
- Spider-Man: `{ dil: 'Altyazılı' }` / `{ dil: 'Dublaj' }`

Eşleşme log satırının `{`sinden başlayıp doğru final JSON'unu bozuyor, canlı
çekirdekler **"json-bozuk"** olarak raporlanıyordu.

**Düzeltme:** `sonJsonNesnesi()` — tüm dengeli kök `{…}` bloklarını (metin içi
süslü parantez ve `\"` kaçışları izlenerek) toplar, **sonuncudan geriye** doğru
`JSON.parse` dener. Ayrıca TIMEOUT sınıflandırması `spawnSync` sinyali/`ETIMEDOUT`
ile ayrıştırıldı (`satirCoz`). Regresyon testi:
`tests/kahraman-toplu-test-parse.test.mjs` (5 test).

**Kanıt (düzeltme sonrası, ayrı komut):**

```
$ node tools/kahraman-toplu-test.mjs --tur tv --timeout 45 zatanna.js spiderMan.js superman.js shazam.js
  1     6sn  zatanna.js
  1     2sn  spiderMan.js
  0     8sn  superman.js
  7     3sn  shazam.js

CANLI: 3/4  (tur=tv, bütçe=45sn/çekirdek)
ÖLÜ: superman
```

> `superman` TV'de 0: çekirdek tv destekliyor görünse de bu örnek içerikte
> sonuç yok (aynı çekirdeğin movie koşusuna bakınız).

---

## 2. Canlı alan adı tazeleme (domains.json → `alanlar.js`)

Kaynak: `https://cdn.izlelan.com/domains.json` (curl ile alındı, `ok:true`,
timestamp `2026-11-13T10:30:42Z`). Satırlar `alanlar.js` yorumlarındaki takma
adlarla eşleştirildi (batman.js ← oden, deadpool.js ← sengoku, …).

| Kahraman | Takma ad | Önce | Sonra (canlı) |
|---|---|---|---|
| Batman | oden | `yabancidizi.watch` | **`ybncidizi.com`** |
| Deadpool | sengoku | `diziizle.cafe` | **`diziizle.cloud`** |
| Iron-Fist | smoker | `dizipal1592.com` | **`dizipal1595.com`** |
| Spider-Woman | noland | `dizi82.life` | **`dizi86.life`** |
| Winter-Soldier / Raven | sakazuki | `dizipal2145.com` | **`dizipal2149.com`** |
| Bane (birinci taraf) | — | `jetfilmizle.now` (301→app) | **`jetfilmizle.app`** |

Ayrıca `android/app/src/main/assets/native-routes.json` içindeki bayat sabitler
tazelendi: `jet` base `jetfilmizle.now → jetfilmizle.app`, `hfd` base
`hdfilmdelisi.one → hdfilmdelisi1.com` (+ `mirrors` alanları, bkz. bölüm 5).

**Ölçüm — önce:**

```
$ node tools/kahraman-alan-kontrol.mjs
yayin (39): …   zaman-asimi (5): Iron-Fist, Spider-Woman, Thor, Winter-Soldier, Raven
bozuk (2): Batman, Deadpool      tls (1): Ant-Man
http-403 (2): Beast-Boy, Thanos  http-502 (1): Batgirl
alan-yok (1): Moon-Knight
```

**Ölçüm — sonra:**

```
$ node tools/kahraman-alan-kontrol.mjs
yayin (45): …   zaman-asimi (1): Thor
http-403 (2): Beast-Boy, Thanos  tls (1): Ant-Man
http-502 (1): Batgirl            alan-yok (1): Moon-Knight
```

**Kalan 6 ölü alan — ölçülmüş neden (uydurma yok):**

| Kahraman | Alan | Neden (ölçüm) |
|---|---|---|
| Ant-Man | www.dizidad.com | `tls` — sertifika/TLS el sıkışma hatası; takma ad (`rouge`) satıcının **disabled** listesinde. |
| Batgirl | animezer.com | `http-502` — host ayakta, sunucu 502; takma ad (`shamrock`) vendor **disabled**. |
| Beast-Boy | api.wecollege.net | `http-403` — host ayakta, bot/WAF 403 (cihaz challenge çözücüsüyle geçme ihtimali var, Node'da geçmiyor). |
| Thanos | streamcorecdn.com | `http-403` — takma ad (`bogard`) vendor **disabled**; host 403. |
| Moon-Knight | dizipal12.com.tr | `alan-yok` (NXDOMAIN) — `zunesha` takma adı 2026-11-13 itibarıyla vendor listesinden **tamamen düşmüş**. Denenen kurtarma: dizipal aynası (`dizipal2149.com`) bu çekirdeğin beklediği JSON API'yi vermiyor (`Unexpected token '<'`) → **aileden kopyalama YANLIŞ**, ölü kabul edildi. |
| Thor | dizilla.now | `zaman-asimi` — takma ad (`crocodile`) vendor **disabled**. |

> Not: `Ant-Man`, `Batgirl`, `Thanos` `KAYIT`'ta aktif çekirdek değil (alan
> haritasında kalmış kayıtlar); sağlık sayılarını etkilemezler.

---

## 3. Shazam onarımı (dizisol.js / GREEN-ARROW kanıtlanmış çözümünün portu)

**Teşhis (canlı API ölçümü):** Shazam aynı siteyi kullanıyor; API 7 kaynak
döndürüyor. Kaynak master'ları:

- `s10.dizisol.com/play?id=…` → Origin başlığı **varsa 200 + `#EXTM3U`**, yoksa
  403 "Çelik Kalkan" (Cloudflare WAF) — ölçüldü.
- `*.dizisol*.workers.dev` / `load-mixi…` / `videoplays…` → bugün 403/530
  (vendor'ın kendi worker'ı korumalı / sunucu hatası).
- Eski kod doğrulanamayan HER kaynağı eliyordu → **0 kaynak**.

**Uygulanan (dizisol.js'ten birebir port):**

1. Kanıtlanmış header seti: `User-Agent`, `Accept: */*`, `Referer: site/`,
   `Origin: site` (Sec-Fetch-* **eklenmez**), doğrulama süresi 2500→7000 ms.
2. `#EXTM3U` doğrulaması geçen kaynak "doğrulanmış"; geçmeyen kaynak **silinmez**,
   `Shazam · HLS yedeği` etiketiyle, kalite iddiası olmadan (`quality:auto`,
   `dogrulanamadi:true`) listelenir → **SIFIR DÖNÜŞ YASAĞI**.
3. Etiketlerde yalnız kahraman kodu: `name: "Shazam"`, eski `Dragon [n]` sızıntısı
   kaldırıldı; gerçek site adı arayüzde **yok**.

**Kanıt:**

```
$ node tools/cekirdek-test.mjs shazam.js 1399 tv 1 1     → adet 7  (1 doğrulanmış + 6 HLS yedeği), ~8 sn
$ node tools/cekirdek-test.mjs shazam.js 550 movie       → adet 9  (5 doğrulanmış + 4 HLS yedeği), ~10 sn
```

> Dürüstlük notu: 7/9 kaynağın tamamı doğrulanmış değil; doğrulanamayanlar
> "HLS yedeği" etiketiyle sunuluyor. Doğrulanan hat `s10` master'ı (Origin'li);
> oynatma sırasında proxy Origin'i taşıdığı için açılır.

---

## 4. Mobil ↔ web paritesi (kök neden + düzeltme)

### 4.1 Ölçülen kırık

| Katman | `/api/<kod>/...` isteğini nasıl çözüyor? | Durum |
|---|---|---|
| Android (`NativeMediaGateway.java`) | `android/app/src/main/assets/native-routes.json` (base+referer+headers) | ✅ çalışıyor |
| Web (`cf/workers-entry.js` → `functions/[[route]].js` → `api/[...all].js`) | **böyle bir tablo yok** → 404 "Not found" | ❌ mobilde çalışan çekirdek web'de 0 kaynak |
| Masaüstü (`server/mediaServer.js`) | kendi yerel geçidi | kapsam dışı |

Yani birinci taraf rotaları kullanan 5 çekirdek (Bane=`jet`, Bellatrix=`hfd`,
Cat-Woman=`dzb`, Lyra=`slc`, Sirius=`fhdf`) **mobilde çalışıp web'de hiç
çalışmıyordu**.

### 4.2 Düzeltme — tek kaynak, kopya yok

`cf/provider-routes.js` eklendi: worker JSON'u **doğrudan aynı dosyadan**
(`android/app/src/main/assets/native-routes.json`) import eder (esbuild paketler;
Node'da import attributes ile okunur). Yani alan adı güncellemesi **tek yerde**
yapılır → hem Android ağ geçidi hem web worker aynı anda düzelir. `cf/workers-entry.js`
`/api/*` akışından önce bu çözücüyü çağırır; mobil köprünün hedef birleştirmesi
ve header/referer davranışı birebir aynıdır.

**Kanıt — canlı (worker egress'i taklit eden süreç içi çözümleme, gerçek ağ):**

```
slc  status=200 ms=15579 upstream=https://selcukflix.app/
fhdf status=200 ms=587   upstream=https://www.fullhdfilmizlesene.now/
hfd  status=200 ms=1020  upstream=https://hdfilmdelisi1.com/
dzb  status=200 ms=596   upstream=https://dizibal.org/
jet  status=200 ms=736   upstream=https://jetfilmizle.app/
```

**Ağsız doğrulama:** `tests/cf-saglayici-rotalari.test.mjs` → 8/8. Kapsam:
rota çözümü, mobil köprüyle aynı headers/POST/OPTIONS, worker entegrasyonu (fetch
sahtelenmiş), yerel uçların yakalanmaması ve **çekirdeklerin kullandığı her `ROTA`
kodunun tabloda olma nöbeti** (yeni bir çekirdek kod ekler de tabloya yazılmazsa
test kırmızı olur).

### 4.3 Oynatma paritesi (Origin)

Ölçülen kırık: Android ağ geçidi `/api/hls_proxy`'de `headers` JSON'undaki
`Origin`'i hedefe yazar; Cloudflare worker'ın `hls_proxy` hattı Origin'i **yalnız
`origin` sorgu parametresinden** okur. DiziSol/Shazam master'ları Origin olmadan
403 döndüğü için **aynı kaynak mobilde oynayıp web'de oynamıyordu**.

Düzeltme (`src/providers/vekil.js` `oynatmaAdresi`): Origin iki taşıma biçiminde
birlikte gönderilir (`headers` JSON + `origin` param). Mobil taraf fazladan
parametreyi yok sayar. Test: `tests/alan-dayaniklilik.test.mjs`
→ "hls proxy adresi Origin'i iki taşıma biçiminde de taşır" ✅.

---

## 5. Dayanıklılık — "site tamamen çökmedikçe kaynak bozulmaz" (ölçümlü)

### Katman tablosu — hangi hata türünde hangi katman devreye giriyor

| Hata türü | Katman | Davranış | Kanıt (test) |
|---|---|---|---|
| Alan adı ölü (NXDOMAIN) | `alanlar.js` canlı tazeleme | patr0nq + cdn.izlelan.com listelerini çeker; **yalnız** mevcut ölü + aday canlıysa uygular (çalışan ezilmez) | `alan-dayaniklilik` (2)(3) |
| Ayna değişti, statik harita bayat | `alanlar.js` ADAY havuzu | statik + canlı listelerden gelen adaylar + ölçülmüş aile aynaları (dizipal 1595↔2149) | `alanAdaylari`, `alanYedekAdresleri` testleri |
| Birincil host 5xx / ağ hatası (istemci) | `vekil.js` köprü yedek denemesi | aynı yol+sorgu sıradaki aday origin'de denenir; yanıt **aynı isteğe şeffaf** döner; çalışan hat öne alınır | "birincil alan 5xx → ikinci aday denenir" ✅ (2 istek) |
| Birincil host 5xx (web gateway) | `cf/provider-routes.js` + `cf/proxy-failover.js` | rota tablosundaki `mirrors` + `/api/proxy` 5xx'te yedek origin | "web rota çözücü … mirrors" ✅, "proxyYedekDene …" ✅ |
| TLS / sertifika hatası | aynı yedek mekanizması | fetch throw → sonraki aday (TLS hatası 5xx sayılır) | yukarıdaki testler |
| Uzun süre açık uygulama, gece ayna değişimi | `vekil.js` periyodik tazeleme | `setInterval(…, ALAN_OMUR_MS)` (6 saat), tek uçuş + 5 dk cooldown | "gerektigindeYenile cooldown …" ✅ |
| Art arda ağ hataları | on-demand tazeleme | 4 ardışık kopru hatasında `gerektigindeYenile()` (tekrar giriş korumalı) | kod + cooldown testi |
| Çevrimdışı başlangıç | localStorage `cp_canli_alanlar_v2` | son iyi harita **+ aday havuzu** uygulanır; bayat (>6 saat) önbellek yok sayılır | "(4) çevrimdışı …" ✅, "bayat önbellek …" ✅ |
| Tek domain çöktü, diğerleri ayakta | `vekil.js` havuz + sağlayıcı başına tavan | havuz (10) + sağlayıcı başına 35 sn tavan; bir görevin hatası havuzu **durdurmaz** | `tests/kahraman-havuz.test.mjs` → "bir görevin hatası havuzu durdurmaz" ✅ (davranışsal regresyon) |
| Tüm adaylar ölü | alanlar.js "yalnız iyileştir" | mevcut değer **korunur**, boş değere düşmez | "tüm adaylar düşükse mevcut alan korunur" ✅ |

### Yeni dayanıklılık testi (ağsız, fetch enjekte)

```
$ node --test tests/alan-dayaniklilik.test.mjs
✔ birincil alan 5xx → ikinci aday denenir, yanıt aynı isteğe döner
✔ alanYedekAdresleri aynı yolu farklı origin’e taşır, bilinmeyen host’a dokunmaz
✔ alanAdaylari birincil + aile aynalarını döndürür
✔ mevcut alan canlıysa canlı liste onu EZMEZ
✔ tüm adaylar düşükse mevcut alan korunur (boş değere düşmez)
✔ ölü mevcut + canlı aday → iyileştirir ve aday havuzuna kalıcı ekler
✔ çevrimdışı başlangıçta son iyi harita + adaylar uygulanır
✔ bayat önbellek (6 saatten eski) uygulanmaz
✔ gerektigindeYenile cooldown içinde ikinci kez ağa çıkmaz
✔ web rota çözücü birincil 5xx alınca tablodaki `mirrors` adayını dener
✔ proxyYedekDene: /api/proxy 5xx → yedek origin ile aynı isteği tekrar dener
✔ hls proxy adresi Origin’i iki taşıma biçiminde de taşır (mobil + web)
ℹ tests 12 / pass 12 / fail 0
```

### Bu iddianın SINIRLARI (dürüst)

- Yedek deneme **yalnız aynı yayıncı ailesinin aynı yol şemasını** kullanır.
  Farklı CMS'lerin aynaları (ör. hdfilmcehennemi ailesi .biz/.nl) farklı yol
  şemalarına sahip olabildiği için bilinçli olarak eklenmedi; yanlış eşleme
  "200 ama boş sayfa" üretip durumu kötüleştirirdi.
- Site **tamamen** çökerse (domain yok + ayna yok) kaynak üretilemez — kullanıcı
  gereksinimindeki "tamamen çökmediği sürece" sınırı budur.
- Web worker'ın kalıcı (KV) aday deposu yok; aday havuzu worker izolesi içinde
  öğrenilir ve her istekte yeniden denenebilir. Mobil/tarayıcıda havuz
  localStorage'da 6 saat yaşar.

---

## 6. Tam sağlık koşusu (57 çekirdek, tek örnek içerik)

Komutlar:
```
node tools/kahraman-toplu-test.mjs --tur tv    --timeout 45
node tools/kahraman-toplu-test.mjs --tur movie --timeout 45
```
(İçerikler: TV = Game of Thrones 1399 s1e1; movie = Fight Club 550.)

### TV — CANLI: 16/57

Canlı çekirdekler (adet>0): aqualad 1, aquaman 1, beastBoy 1, blackAdam 1,
deadpool 1, dizisol 7, falcon 1, ironMan 1, joker 1, nova 1, phyla 2, raven 1,
**shazam 7**, spiderMan 1, winterSoldier 1, zatanna 1.

```
  0       -  harleyQuinn.js   TIMEOUT>45sn
  0       -  nightwing.js     TIMEOUT>45sn
  (kalan 39 çekirdek 0; tam liste: /tmp/sweep-tv.txt çıktısı raporun ekinde birebir)
```

### Movie — CANLI: 23/57 (ölçüm gürültüsü düzeltmesiyle numune etkin 24/57)

Canlı çekirdekler (adet>0): aqualad 1, aquaman 1, beastBoy 1, blackAdam 1,
blackPanther 1, catWoman 1, cyborg 1, daredevil 1, doctorStrange 1, falcon 1,
hawkeye 1, hulk 1, huntress 1, ironMan 1, loki 1, nova 1, phyla 2, raven 1,
**shazam 9**, starLord 3, superman 1, winterSoldier 1, zatanna 1.

Sweep'te zaman aşımına düşenler (45 sn bütçe): `deadpool`, `harleyQuinn`,
`joker`, `spiderMan`. `shazam` 21 sn'de 9 akış verdi (bölüm 3 kanıtı).
Tam çıktı: `/tmp/sweep-movie.txt` (57 satır + özet).

> **Ölçüm gürültüsü (dürüstlük):** sweep sırasında `dizisol.js` movie sonucu
> `0 (11sn)` göründü; aynı komut tek başına tekrar koşulduğunda **8 akış**
> döndü (`node tools/kahraman-toplu-test.mjs --tur movie --timeout 45 dizisol.js`
> → `8 3sn dizisol.js`). Bu, 45 sn'lik ölçüm bütçesinde doğrulama isteklerinin
> ağ yarışına girmesinden kaynaklanan bir örnek-içerik gürültüsüdür; çekirdek
> canlıdır. Rapor sayısı sweep çıktısı (23) olarak bırakıldı, düzeltme notuyla.

> **Önemli yöntem notu:** bu koşu her çekirdeği **tek içerik** ile ölçer
> (TV=GoT 1399 s1e1, movie=Fight Club 550); "0" sonucu "site ölü" demek
> değildir — o içerik sitede yoksa da 0 döner. Alan adı ölümü bölüm 2'de ayrıca
> ölçüldü. Sıfırların ayrımı için alan kontrolü + hızlı dönüş süresi
> (≤3 sn = arama/API aşamasında sonuçsuz) birlikte okunmalıdır.
>
> **Kalan ölü/0 çekirdeklerin ölçülmüş neden sınıfları:**
> - **Ağ/TLS/ENOTFOUND:** alan adı ölü olanlar bölüm 2 tablosunda (Ant-Man TLS,
>   Moon-Knight NXDOMAIN; vendor listesinde `disabled` olan Thor/Hawkman/
>   Scarlet-Witch/Cyborg/Beast-Boy/Thanos aileleri).
> - **API şekli / vendor emekliye ayırdı:** `zunesha` alias'ı tamamen düşmüş
>   (Moon-Knight); `dizipal` aynası bu çekirdeğin beklediği JSON'u vermiyor
>   (ölçüldü: `Unexpected token '<'`) → aile kopyalaması yanlış sonuç verir.
> - **İçerik yok (0 dönüş, ≤3 sn):** arcturus, brainiac, doctorFate (movie),
>   flash, hawkman, lyra, robin, sirius, vision, wolverine, wonderWoman gibi
>   hızlı dönen 0'lar — site ayakta ama bu içerik/API yanıtı boş.
> - **Zaman aşımı (>45 sn):** deadpool (movie), harleyQuinn, joker, spiderMan,
>   nightwing (tv) — ağ/çok adımlı çözüm bütçesi; site ölü DEĞİL (alanları
>   canlı ölçüldü).

---

## 6.5. Bağımsız inceleme bulguları (Lead → 6 madde) — durum ve kanıt

| # | Bulgu | Durum | Kanıt |
|---|---|---|---|
| 1 (P1) | Mirror tercihi her istekte sıfırlanıyordu (reorder sonrası i=0 ↔ gerçek birincil karışması) | **Düzeltildi**: başarılı adayın ORİJİNAL index'i kalıcı tercih; yalnız gerçek birincil (idx 0) başarılıysa temizlenir | `cf-saglayici-rotalari.test.mjs` → "mirror tercihi KALICI … ikinci istek 1 fetch" ✅ |
| 2 (P2, ürün kuralı) | Yeni rota JSON gövdesini ham döndürüyordu → gerçek site adı sızabilirdi | **Düzeltildi**: yalnız `application/json` + bilinen sağlayıcı host'larında `anonimJson` uygulanır (5 MB sınır); `text/html`'e dokunulmaz | "JSON gövdede gerçek site adı kod adına çevrilir" ✅ + "HTML gövdeye dokunulmaz" ✅ |
| 3 (P2) | `dml` yerel uç listesinde yoktu → `api/[...all].js` Set-Cookie dalı devre dışı kalıyordu | **Düzeltildi**: `YEREL_YOLLAR`'a `dml` eklendi | "worker'ın kendi uçları … takılmaz" testi `/api/dml` içeriyor ✅ |
| 4 (P2) | Android köprüsü `mirrors` uygulamıyordu (web uyguluyor) → parite asimetrisi | **Düzeltildi**: `NativeMediaGateway.java` rota çözümünde `base + mirrors` sırası, 5xx'te sonraki aday, yanıt aynı isteğe şeffaf; CookieManager tabanlı çerez zaten `connect()` içinde hedef başına okunuyor | Java derleme: **bu makinede Android SDK/javac YOK** (ANDROID_HOME boş) → derleme doğrulaması yapılamadı; süslü/parantez dengesi kontrol edildi (54/54, 382/382, 13/13 **dengeli**). CI derlemesi gerekli. |
| 5 (P2) | `functions/[[route]].js` girişi sağlayıcı rota çözümü içermiyordu | **Düzeltildi**: aynı `saglayiciYaniti` çağrısı Pages/Vercel girişine de eklendi | "Pages/Vercel girişi … aynı çözümü kullanır" ✅ |
| 6 (P2) | İki tablo (ALANLAR + native-routes.json) elle güncellenirse ayrışır | **Tutarlılık testi eklendi**: çakışan ailelerde (`jet`↔Bane, `dzb`↔Cat-Woman) host eşitliği + mirror'ların farklı host olması; ayrışınca test "ikisini BİRLİKTE güncelle" diyerek kırmızı olur. Üretici script bilinçli eklenmedi: iki tablo farklı kod ad alanlarına hizmet ediyor (rota kodu ↔ kahraman kodu birebir değil), yanlış otomatik türetme domain'i bozardı. Asıl yayılma yolu: web worker tabloyu **doğrudan native-routes.json'dan** okur. | "rota tablosu ile ALANLAR çakışan ailelerde tutarlı" ✅ |

**Bu turdan sonra test sayıları:** `cf-saglayici-rotalari.test.mjs` 13/13;
seçili toplam **122/122 pass**; worker esbuild bundle **79.4 KB, hatasız**.

## 7. Değişen dosyalar

| Dosya | Değişiklik |
|---|---|
| `tools/kahraman-toplu-test.mjs` | JSON ayıklayıcı düzeltmesi (`sonJsonNesnesi`, `satirCoz`), test edilebilir main guard |
| `src/providers/alanlar.js` | 6 alan güncellemesi; ADAY/mirror havuzu; `alanYedekAdresleri`, `alanYedekOnayla`, `alanAdaylari`; `gerektigindeYenile` (cooldown+tek uçuş); `ALAN_OMUR_MS` export; localStorage'a adaylar |
| `src/providers/vekil.js` | Köprüde şeffaf yedek origin denemesi; ardışık hata→on-demand tazeleme; 6 saatlik periyodik tazeleme; rota 501/5xx'te genel worker'a düşme; `oynatmaAdresi` Origin paritesi |
| `src/providers/cekirdekler/shazam.js` | dizisol.js çözümünün portu: kanıtlanmış header seti, `#EXTM3U` doğrulaması, HLS yedeği fallback, Shazam etiketi, kalite iddiasının kaldırılması |
| `cf/provider-routes.js` (yeni) | Worker'da `/api/<kod>` → provider origin; tablo **native-routes.json'dan**; `mirrors` yedeği |
| `cf/proxy-failover.js` (yeni) | `/api/proxy` 5xx'te yedek origin denemesi (alanlar.js aday havuzu) |
| `cf/workers-entry.js` | Sağlayıcı rotası + proxy yedek katmanlarının bağlanması |
| `functions/[[route]].js` | Pages/Vercel girişine de sağlayıcı rota çözümü (dağıtım hedefi değişse de parite) |
| `android/app/src/main/java/com/cinepulse/studio/NativeMediaGateway.java` | `mirrors` yedeklerinin mobil köprüde uygulanması (5xx'te sıradaki taban) |
| `android/app/src/main/assets/native-routes.json` | `jet`/`hfd` base tazeleme + `mirrors` (Android ağ geçidi fazladan anahtarı yok sayar) |
| `tests/kahraman-toplu-test-parse.test.mjs` (yeni) | Ayrıştırıcı regresyonu (5 test) |
| `tests/cf-saglayici-rotalari.test.mjs` (yeni) | Mobil+web parite nöbeti + inceleme bulguları (**13 test**) |
| `tests/alan-dayaniklilik.test.mjs` (yeni) | Dayanıklılık katmanları (12 test) |
| `tests/alanlar-canli-liste.test.mjs` | Bayat fixture (dizi82) güncel statik değere (dizi86) çekildi — testin ölçtüğü kural aynı |

Kapsam dışı hiçbir dosya (`src/components/**`, `src/views/**`, `src/styles/**`,
`src/services/altyapi/storage.js`, `src/main.js`) değiştirilmedi. Commit/push
yapılmadı — git Lead'de.

## 8. Komut günlüğü (seçili)

```
$ node --check <değişen tüm js dosyaları>                       → hepsi OK
$ node --test tests/kahraman-cekirdek-yukleme.test.mjs \
    tests/kahraman-kaynaklari.test.mjs tests/kod-cozler.test.mjs \
    tests/alanlar-canli-liste.test.mjs tests/kahraman-toplu-test-parse.test.mjs \
    tests/cf-saglayici-rotalari.test.mjs tests/alan-dayaniklilik.test.mjs \
    tests/kahraman-havuz.test.mjs tests/kahraman-kopru.test.mjs \
    tests/kahraman-kopru-ozyineleme.test.mjs tests/dizisol.test.mjs
  → tests 117 / pass 117 / fail 0
$ node --test tests/cloudflare-deployment.test.mjs tests/eklentiAlan.test.mjs tests/entry-route.test.mjs
  → 15/15
$ node -e "esbuild … cf/workers-entry.js …"                    → bundle ok (79.4 KB)
$ node tools/kahraman-toplu-test.mjs --tur tv  --timeout 45    → CANLI 16/57
$ node tools/kahraman-toplu-test.mjs --tur movie --timeout 45  → CANLI 23/57 (dizisol tekrar: 8)
$ node tools/kahraman-alan-kontrol.mjs                          → yayin 45 / 51
```

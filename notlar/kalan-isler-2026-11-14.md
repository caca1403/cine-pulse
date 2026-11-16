# Kalan İşler — 2026-11-14 (17:45, canlı site doğrulaması sonrası)

Bağlam: 11 Kasım'daki liste **büyük ölçüde bitti** (13–14 Kasım oturumları: json-bozuk
kök nedeni test aracıydı, shazam onarıldı, alanlar 39→45 canlı, mobil↔web↔masaüstü
parite, UI hareket planı, oynatıcı bölüm sürtünmesi, dublaj zekâsı + MultiDubEndgame,
v2.0.4→v2.0.7). Bu dosya **yalnız hâlâ açık** olanları ve bugünkü ölçümleri tutar.

## Bugün ölçülenler (kanıt)

| Ölçüm | Komut | Sonuç |
|---|---|---|
| Canlı dağıtım dumanı | `node tools/cf-smoke.mjs` | **6/6 PASS** (`/`, bundle, `/version.json`=2.0.7, hls_proxy OPTIONS 200, SSRF koruması 403, `/cinepulse.apk` 200 + `application/vnd.android.package-archive`) |
| Duman testinin yanlış pozitif hatası | aynı, UA düzeltmesi ÖNCESİ | `/cinepulse.apk` → 302/403 ile **çöküyordu** (kırpılmış `Mozilla/5.0 Chrome/124` UA'yı Kalkan reddediyor) → `tools/cf-smoke.mjs` UA'sı tam Chrome UA yapıldı, şimdi PASS |
| APK indirmesi (canlı) | `curl -A <tam Chrome UA>` | 200, ~21 MB, doğru content-type |
| Sağlayıcı sağlık koşusu (film 550) | `node tools/kahraman-toplu-test.mjs --tur movie --timeout 45` | **CANLI 25/56** (13 Kasım: 23/57) — `dizisol 8`, `shazam`, `zatanna 1`, `starLord 3` vb. |
| Canlı derleme = güncel ağaç | GH Actions | son deploy `14e433c` (17:36) **success**; HEAD = 14e433c (push'lenmiş) |
| Tam test seti (bu HEAD'de) | `node --test tests/` | **816 test · 815 pass · 0 fail · 1 skip** (31 sn) |
| Canlıda ölçüm kancası | `node tools/web-e2e-cdp.mjs --url ...` | **BAŞARISIZ** — bkz. K1 |

## KALAN İŞLER

### K1 — Üretim derlemesinde ölçüm kancası yüklenmiyor (ÖLÇÜM KÖRLÜĞÜ) · ÇÖZÜLDÜ (2026-11-16)
- Kanıt: `VITE_DEVICE_SWEEP=1` ile üretilen derleme üç farklı hedefte denendi
  (canlı site, `vite preview`, statik sunucu) → her başlıkta
  `HATA: window.__cpYildizTara is not a function`; özet `0/4 eşleşme · hata=4`.
- Teşhis: `src/main.js:509` kapısı `import.meta.env?.VITE_DEVICE_SWEEP === '1'`
  çalışma anında **false** kalıyor (derlenen girdi yığınında `VITE_DEVICE_SWEEP`
  enjekte edilmemiş; `deviceSweep-*.js` yığını yalnız `__vite__mapDeps` tablosunda
  duruyor). `src/devtools/deviceSweep.js:29`'daki `ACIK` aynı ifadeyi kullanıyor.
- Neden önemli: `tools/web-e2e-cdp.mjs` (yıldız arşivi + TR dublaj + kaynak sayısı
  ölçümü) **yalnız dev sunucusunda** çalışıyor → dağıtılmış sitede kaynak/playback
  regresyonu ölçülemiyor; 30 başlıklı `web-e2e-sonuc.json` gibi raporlar artık
  canlı için üretilemiyor.
- ONARIM (2026-11-16): kök neden kapının KENDİSİYDİ — `main.js` yalnız env'e
  bakıyordu, `deviceSweep.js` içindeki `ACIK` zaten DEV'i kapsıyordu ama dış kapı
  onu hiç çağırmıyordu. `main.js` kapısı `VITE_DEVICE_SWEEP === '1' || DEV === 'true'`
  yapıldı → vite DEV'de kanca kendini kuruyor. Üretim env'sizse dinamik import
  satırına hiç dokunulmaz (pakete girmez, sızıntı yok).
- Doğrulama yüzeyi: bu ağdan canlı siteye TLS-middlebox engeli olduğu için ölçüm
  YEREL vite DEV + Electron CDP üzerinden AYNI üretim kod yollarıyla yapılıyor:
  `tools/yerel-dogrula.mjs` (veri katmanı) + `tools/yerel-oynatici-dogrula.mjs`
  (arayüz). Kanıt: `notlar/yerel-dogrula-sonuc.json`.

### K2 — Yıldız arşivi (MultiDubEndgame) ana oynatma akışına bağlı DEĞİL · öncelik 1
- Kayıt: `notlar/dublaj-zekasi-2026-11-14.md` §7.3 — `arkaPlandaZenginlestir()` hazır,
  oynatma yolundan çağrılmıyor (bilinçli erteleme). Saha kararı artık verilebilir.
- Eşik: K1 sonrası aynı E2E ile "yıldız kaynakları oynatıcıda görünüyor mu" ölçülür.

### K3 — Web'de (CORS) yıldız RPC'leri vekil üzerinden · öncelik 2
- Selçukflix/Dizilla `POST /api/mj` tarayıcıdan doğrudan çalışmıyor; APK'da sorun yok.
  Worker'da `slc`/`dizilla` rota kodları için `cf/provider-routes.js` üzerinden
  çağrıyı bağla (JSON gövde anonimleştirme kuralına dikkat: `anonimJson`).

### K4 — Dublaj tohumu yalnız 2 içeriği kapsıyor · öncelik 2
- `public/dublaj-tohum.json` = 32 kayıt / 21 sağlayıcı (film 550, tv 1399 S1B1).
- Koşul: `node tools/dublaj-kanit-tara.mjs --cekirdekler <geniş liste>` +
  `node tools/dublaj-tohum-derle.mjs` → bir sonraki APK release'ine gömülsün.
- Not: IPv6 çıkışı bozuk → her ağ koşulunda `NODE_OPTIONS=--dns-result-order=ipv4first`.

### K5 — Sağlayıcı "0"larının ayrımı hâlâ tek içerikle yapılıyor · öncelik 3
- `tools/kahraman-toplu-test.mjs:86` içerik kimliğini **sabitler** (`tv → 1399 s1e1`,
  `movie → 550`) → ölçüm tek örnek. `--icerik <tmdbId[:tip[:s:b]]>` bayrağı ekle.
- 25/56 sayısı tek film (550) örneği. 11-13 raporundaki gibi 3-4 içerikli küçük bir
  panel koş → "site ölü" ile "içerik yok" kesin ayrışsın. Kalıcı domain ölüleri:
  Moon-Knight (NXDOMAIN),
  Thor/Ant-Man/Batgirl/Beast-Boy/Thanos (vendor `disabled` / 403 / TLS).

### K6 — UI "Dizilla hissi" kullanıcı onayı bekliyor · öncelik 3
- Ölçümlü reçete uygulandı (`notlar/_ui-referans-analizi.md`: çift katmanlı negatif
  spread'li gölge, yalnız afiş 1.05, 250 ms `cubic-bezier(.25,.46,.45,.94)`,
  24 px ray aralığı, `main.css` `!important` 1330→1240).
- Yapılacak: yan yana ekran görüntüsü (biz vs dizilla.la) + kullanıcının itiraz
  ettiği spesifik ekranları tek tek kapatmak. Onay yoksa yeni stil katmanı EKLEME.

### K7 — Test pahasına yazılmış iki kırılganlık · öncelik 4
- Embed-timeout testi yükle altında zaman aşımlı flake (7999 vs 8000 ms sınıfı).
- `tools/cf-smoke.mjs` artık tam tarayıcı UA'sı kullanıyor (bu oturumda yapıldı,
  **henüz commit'lenmedi**) — bir sonraki commit'e dahil edilmeli.

## Yapılsın diye bekleyen tek kullanıcı adımı
Yok. Push akışı çalışıyor: `14e433c` push'lanmış ve canlıda (Actions success). Bu
oturumun tek yerel değişikliği `tools/cf-smoke.mjs` (UA düzeltmesi).

---

## 2026-11-16 — Kaynak/Dil yeniden tasarımı (KAYNAKLAR sekmesi → oynatıcı içi)

Özet: KAYNAKLAR sekmesi DetailView'dan kaldırıldı; oynat butonları doğrudan
oynatıcıyı açar, tarama/kaynak/dil üçlüsü artık oynatıcının içinde. Bu oturumda
bulunup düzeltilen GERÇEK kusurlar (hepsi kanıtlı):

1. **Kapsam hataları (closure ReferenceError)** — `PlayerModal.js` içinde beş
   ayrı fonksiyon kapanışta olmayan `videoEl` okuyordu (modülde yalnız
   `videoElemani()` yardımcısı var): `dilDegistir` 1b dalı ÖLÜ koddu,
   `switchSourceCategory` konak-koruması ve `triggerAutoFailover` dil-geçişi
   yutulan ReferenceError atıyordu, harici-oynatıcı üç yolu (HEAD/canlıda da
   var!) konumu hiç alamıyordu. Hepsi `videoElemani()` ile onarıldı.
   Denetim aracı: `tools/kapsam-denet.mjs` (acorn AST) → artık temiz.
2. **`dilDegistir` HLS iz tespiti** — `/tr|tur|türk/` regex'i "Country/Enter"
   gibi yanlış pozitifler üretiyordu; ISO `lang ^tr(-|_|$)` + ad sözcük
   sınırına sıkılaştırıldı. "Zaten hedef kanalda" dalı artık etiketi senkronlar
   (eskiden havuz değiştirip yayını boşuna yeniden yüklerdi).
3. **`izleriOlc` olumsuz-önbellek hatası** — `res.ok`/#EXTM3U doğrulaması
   yoktu; HTML hata sayfası "Türkçe iz yok" olarak KALICI cache'leniyordu.
   Artık geçersiz gövde `{bilinmiyor}` döner ve cache'lenmez.
4. **Çapraz denetim (bağımsız denetçi)** — `tools/yerel-dogrula.mjs` her m3u8'i
   kendi başına 3× okuyup `#EXT-X-MEDIA` izlerini aggregator'ın etiketiyle
   çaprazlar (dublaj→ses izi, altyazı→altyazı izi, izsiz→Özgün; yerli/site
   muafiyeti tahmin değil modülün kendi `yerliKaynakMi`'si). Son tur: 5/5
   içerik kaynak veriyor (33–46 kaynak), 40 bağımsız okuma, **0 uyumsuzluk**,
   2 tek-taraflı varyans (sağlayıcının header'lı isteği TR izi görüyor,
   tarayıcıdan 3 okuma göremiyor — CDN varyantı, etiket kanıtlı).
   Kanıt: `notlar/yerel-dogrula-sonuc.json`.
5. **Arayüz dumanı** — `tools/yerel-oynatici-dogrula.mjs`: detay → OYNAT →
   oynatıcı açılıyor + dil etiketleri + JS hatası sayacı (bkz. son çalışma
   `notlar/yerel-oynatici-sonuc.json`).

Sürüm 2.0.8 (versionCode 208); android asset'leri `npx cap sync` ile senyor.

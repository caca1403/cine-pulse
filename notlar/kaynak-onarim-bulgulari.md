# Kaynak onarım bulguları — vendor çekirdekleri (2026-10-25)

Ölçüm kanıtı: `/tmp/opencode/onarim-baseline.txt` (önce), `/tmp/opencode/onarim-sonrasi.txt`
(birinci onarım sonrası), `/tmp/opencode/onarim-final.txt` (bugünkü PoW/çerez düzeltmeleri
sonrası tam koşum; Breaking Bad S1E1, tv 1396, `tek-sag.mjs`).

## Değişen çekirdekler ve düzeltmeler

| Çekirdek | Op | Ne yapıldı |
|---|---|---|
| Batman, Captain-America, Flash, Thor, Wonder-Woman | `atanmadi-403` | iframe.php kaynakları 403'e takılınca elenme; "403'e atanmadı" etiketiyle ham akış olarak listelendi (cihaz köprüsü çözer) |
| Winter-Soldier | `ws-arama` + `ws-pow` | ajax-search tek deneme + 9 sn sinyal; dizipal `_bc` PoW çözücüsü (`dizipalPowCoz`) `/bolum` kapısına eklendi |
| Raven | `rv-pow` + çerez havuzu + embed çekme | aynı PoW çözücü `sayfaAc` HTTP düşüşünde; çerez havuzu; config'in döndürdüğü tek-geçişlik gömülü oynatıcının hemen çekilip master.m3u8 çıkarılması |
| Loki | `loki-baslik` | IMDb-id araması boşsa başlık araması yedeği; tv sorgusunda film sonucuna düşme kalktı (doğru değil) |
| Harley-Quinn | TDZ fix | `let headers = {...headers}` hatası — `headers2` olarak el ile taşındı |

Codemod: `/tmp/opencode/kaynak-Onarim.mjs` (idempotent; atanmadi/ws-pow/rv-pow/loki-baslik
ops'larını uygular). Bugünkü düzeltmeler (PoW çerez mekanizması) doğrudan dosyaya uygulandı.

## Ölçümler (ham / normalize öğe sayısı, Breaking Bad S1E1)

| Çekirdek | Önce | Birinci onarım sonrası | Final (PoW düzeltmeleri sonrası) |
|---|---|---|---|
| Batman | 0 | 3 (atanmadı) | 3 |
| Captain-America | 0 | 3 (atanmadı) | 3 |
| Flash | 0 | 3 (atanmadı) | 3 |
| Thor | ölçülmedi | 0 | 0 — arama ucu ölmüş (bkz. riskler) |
| Wonder-Woman | ölçülmedi | 0 | 0 — arama eşleşmesi boş (bkz. riskler) |
| Winter-Soldier | 0 | 0 (PoW çözülmedi) | 1 |
| Raven | 0 | 0 (verify 403) | 1 |
| Loki | 0 | 0 (çökme) | 0 — filmekseni kataloğunda dizi yok (bkz. kalan riskler) |
| Harley-Quinn | 0 (TDZ çökme) | 0 (animecix'te Breaking Bad yok) | 0 — aynı |
| Hulk | 0 | 0 | 0 — tasarım: film sitesi, tv türünde boş |
| Aquaman / Cyborg / Ant-Man | 1 | 1 | 1 |
| Moon-Knight | — | 1 | 1 |

## PoW zincirinde bulunan iki gerçek hata (bugün düzeltildi)

1. **Çerez düşürme:** `dizipalPowCoz` sayfadan gelen tüm `Set-Cookie`'leri atıyor, yalnız
   `_bc_ok`'u tutuyordu. Oysa verify'e dönen `_bc_ok` bir JWT; payload'ı `sid`
   (PHPSESSID) ve `iph` (IP hash'i) içeriyor → zincir PHPSESSID'ye bağlı. Çerezsiz
   verify `403 {"ok":false,"e":"s1"}` döndürüyor (Raven'ın gördüğü hata).
   Düzeltme: tüm çerezler toplanıp taşınıyor (Winter-Soldier'da jar, Raven'da
   modül çerez havuzu).
2. **Göreli `j.r`:** verify `"r":"\/bolum\/..."` değeriyle göreli yol döndürüyor;
   Node fetch göreli URL'i reddettiğinden (sessiz catch) sayfa çekme adımı hiç
   çalışmadan null dönüyordu (Winter-Soldier'ın "PoW çözülemedi" loguna rağmen
   verify 200 dönmesinin sebebi). Düzeltme: `new URL(j.r, kok)` ile çözümleme.

Ayrıca Raven'da config POST'u (`/ajax-player-config`) çerezsiz gönderildiğinden
`v` dönmiyordu → çerezli hale getirildi; dönen hızlı-ölür embed linki
(`formationfeed.net/i?v=`, birkaç saniye sonra `410 Gone`) doğrudan medya
olmadığından eleniyordu → embed sayfasından `master.m3u8` çıkarım adımı eklendi.

## Kanıt parçaları

- `wsv2.mjs` koşumu: GET /bolum → PoW (483 ms) → verify 200 `{ok:true}` → sayfa
  yeniden 93.020 byte + `data-cfg` → config POST `{"success":true,"config":{"v":...}}`.
- Winter-Soldier kernel koşumu (`wsr2.txt`): "PoW çözüldü; bölüm sayfası yeniden
  alındı." → embed bulundu → TAMAMLANDI (6.54 s), ham 1 / normalize 1.
- Raven kernel koşumu: verify 200 → sayfa 200 → config 200 → embed 200 → ham 1.

## Kalan riskler / sınırlar

- **Loki/Breaking Bad:** filmekseni kataloğunda dizinin kendisi yok (yalnız
  "El Camino" filmi); akış döndürmesi bu içerik için imkânsız. Çekirdek artık
  çökmeden temiz "eşleşmedi" döndürüyor. Doğrulama için filmekseni'de var olan
  bir dizi (örn. katalogda TVSeries çıkan başlıklar) kullanılmalı.
- **atanmadi ham akışlar** (Batman/CA/Flash/Thor/WW): iframe 403'ü yerel koşumda
  çözemez; cihaz köprüsü (çerez/arama-şifreli katman) çözmeli. "Ham > 0" ampulü
  köprünün atanmadı etiketli öğeyi eklemediğini doğrulamak için gözlenmeli
  ( Batman/CA/Flash normalize 3 → geçiyor).
- **Winter-Soldier HLS doğrulama:** master.m3u8 yerel koşumda CDN 403 döndürebilir
  (IP'e göre); çekirdek yine de adresi hazırlıyor, cihaz çalarken doğrulanır.
- **Thor (dizilla.now):** `/api/bg/searchContent` uç noktamız kalkmış (Next-SPA HTML
  dönüyor, 404 + sayfa) — atanmadi op'ları iframe aşamasına ulaşamadan işlevsiz;
  çekirdeğin arama mimarisi siteye göre yeniden kurgulanmalı (Iron-Fist sınıfı iş).
- **Wonder-Woman (asyawatch.com):** arama HTTP 200 dönüyor ama Breaking Bad için
  eşleşme boş — gövde/eşik incelenmeli (muhtemelen katalog yokluğu ya da
  {"results":[]} yanıt biçimi değişimi; ayrı ölçüm işi).
- **dizipal ayna rotasyonu sık** (2140→2143 ölçümlü); çekirdekler alan haritasından
  çözüyor, kodda sabit yok.
- **Harley-Quinn anime hedefi:** animecix'te canlı-dizi içeriği yok; kayıt için
  farklı bir tür/yeşim gerekir — kapsam dışı bırakıldı.

## Test durumu

`node --test tests/kahraman-cekirdek-yukleme.test.mjs tests/kahraman-kaynaklari.test.mjs
tests/kod-cozler.test.mjs` → 51 test, 0 hata.

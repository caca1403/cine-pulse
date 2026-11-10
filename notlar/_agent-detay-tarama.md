# Agent raporu — Detay sayfası kaynak tarama + canlı geri bildirim

**Depo:** /home/cagatay/İndirilenler/cine-pulse-main (CinePulse, saf JS + Vite, ES module)
**Durum:** Yapıldı, doğrulandı. Commit/push yapılmadı.

## Kapsam (sadece bu dosyalara dokunuldu)

1. `src/views/DetailView.js`
2. `src/components/kaynakListesi.js`
3. `src/styles/kaynak-listesi.css`
4. `tests/kaynak-tarama-geri-bildirim.test.mjs` (yeni test dosyası)

KESİN YASAKTAKILERE DOKUNULMADI: PlayerModal.js, providerAggregator.js, vekil.js, DetailView dışındaki view'lar. Mevcut yorumlar silinmedi (güncellenirler; mevcut `baslat()` çağrıları korundu, çift tarama engellendi).

## 1) Detay açılır açılmaz tarama

`src/views/DetailView.js`:
- `renderDetailView` içinde `kaynakListesiOlustur(...)` döndükten **sonra**, sekme açılmasını beklemeden `kaynakListesi.baslat()` koşulsuz çağrılıyor (current tree: **satır 735**).
- `baslat()` zaten `durum.baslatildi` korumalı (`src/components/kaynakListesi.js` `baslat()`), bu yüzden sekme tıklaması (satır 786), IntersectionObserver (satır 775) ve bölüm değişikliği çağrıları aynı taramayı ikinci kez başlatmaz.
- Eski yanıltan yorum güncellendi (satır 600–609): "Detay açılışında HİÇBİR tarama başlamaz" → "Tarama detay açılışında koşulsuz başlar … çift tarama olmaz". Yorum silinmedi, sadece mevcut davranışla tutarlı hale getirildi.
- Sekme görünürlüğü (IntersectionObserver, `rootMargin: '240px'`) ve kod-splitting davranışı bozulmadı; tüm mevcut `baslat()` çağrıları yerinde kaltı.

## 2) Canlı durum şeridi (geri bildirim)

`src/components/kaynakListesi.js` `cizDurum()` yeniden yazıldı:

- Tarama sırasında (tek satır): `N kaynak bulundu · X sağlayıcı tamamlandı · taranıyor…` (ör. satır 270). Loader-2 spinnerı mevcut stille korunuyor.
- Bitişte: `N kaynak · X sağlayıcı denendi (tamamlandı)` (satır 292; `check` ikonu, mevcut lucide stilinde).
- X hesaplanırken `saglayiciHatasi[].ad` ve `tamamlananSaglayici` **EKRANA YAZILMIYOR**; yalnız farklı sağlayıcı **sayısı** gösterilir. İsimler `durum.saglayiciHatalari` / `durum.tamamlananSaglayicilar` dizisinde sadece sayaç için tutulur.
- Kaynak yoksa: dürüst neden + kullanıcıya rehber (`kaynak-bos` içinde, satır 276–289):
  - `cekirdekYok > 0`: "Kaynak çekirdeği yüklenemedi, içerik taranamadı." / "İnternet bağlantınızı kontrol edin ve tekrar deneyin."
  - `saglayiciHatasi` dolu: "{N} sağlayıcı yanıt vermedi, kaynak bulunamadı." / "Farklı bir bölüm deneyin veya daha sonra tekrar deneyin."
  - Yoksa: "Bu içerik için oynatılabilir kaynak bulunamadı." / "Farklı bir sezon/bölüm deneyin veya daha sonra tekrar deneyin."
- Additive alanlar (`saglayiciHatasi`, `cekirdekYok`, `tamamlananSaglayici`) `onUpdate`'ta yakalanıyor (satır 428); final payload'ta da içeriyor (toplayıcı zaten son `onUpdate(payload)` çağrısında iletiyor). `.catch(() => null)` dalı bozulmadı.

`durum` state'ine eklendi (satır 174–178, sıfırlama satır 345–347):
- `saglayiciHatalari: []`, `tamamlananSaglayicilar: []`, `cekirdekYok: 0`.

## 3) Durum bilgisi erişilebilirliği + CSS

- `.kaynak-durum` zaten `role="status" aria-live="polite"` taşıyordu; korunuyor (yeni satırların okunumu da bu şeritten gidiyor; `aria-live="polite"` testi eklendi).
- `src/styles/kaynak-listesi.css` (yeni renk **icat edilmedi**, sadece mevcut tema değişkenleri):
  - `.kaynak-durum`: `min-height 1.1rem → 1.2rem`, `line-height: 1.4` eklendi (satır 79–82).
  - `.kaynak-sayi` (satır 97–101): inline-flex, gap 0.25rem.
  - `.kaynak-bos-rehber` (satır 103–107): margin 0, font-size 0.78rem, `var(--text-sub)` — mevcut `.kaynak-*` deseniyle uyumlu.

## Doğrulama

- `node node_modules/vite/bin/vite.js build` → **✓ built in 7.71s**, hata yok.
- `node --test tests/kaynak-tarama-geri-bildirim.test.mjs` → **6/6 geçti** (koşulsuz başlat + idempotent, canlı şerit sayaçları, cekirdekYok neden+rehber, saglayiciHatasi sayı+isim-gizlilik, boş varsayılan neden+rehber, aria-live="polite", DetailView kaynak dosyası kontrolü).
- Tüm test paketi: `node --test tests/*.test.mjs tests/*.test.js tests/*.test.cjs` → **668 geçti, 0 başarısız, 1 atlandı** (regresyon yok).
- Isim sızdırılmaması kuralı testlerde doğrulandı (`Sunucu-A/B/C`, `ag-hatasi` gibi kodlar şeritte yok).

## git diff --stat (değişiklik özeti)

```
 src/components/kaynakListesi.js | 70 ++++++++++++++++++++++++++++++++---------
 src/styles/kaynak-listesi.css   | 15 ++++++++-
 src/views/DetailView.js         | 17 ++++++++--
 3 files changed, 83 insertions(+), 19 deletions(-)
```

Not: `git diff --stat` yalnız takip edilen dosyaları gösterir. Yeni test dosyası `tests/kaynak-tarama-geri-bildirim.test.mjs` **izlenmeyen (untracked)** durumda olarak eklendi; commit yapılmadı.

## Satır bazlı değişiklikler (working tree, güncel)

### src/components/kaynakListesi.js
- Satır 174–178: `durum` nesnesine `saglayiciHatalari`, `tamamlananSaglayicilar`, `cekirdekYok` eklendi (yorum dahil).
- Satır 262–293: `cizDurum()` — canlı şerit metinleri (`N kaynak bulundu · X sağlayıcı tamamlandı · taranıyor…` / `N kaynak · X sağlayıcı denendi (tamamlandı)` / neden + rehber).
- Satır 345–347: `tara()` başında yeni sayaçların sıfırlanması.
- Satır 428–441: `onUpdate`'ta additive alanların yakalanması (`saglayiciHatasi` adları, `tamamlananSaglayici`, `cekirdekYok`); yalnız sayaçlar için, ekrana isim yazılmıyor.

### src/views/DetailView.js
- Satır 600–609: KAYNAKLAR sekmesi yorumu güncellendi (tarama detay açılışında koşulsuz başlar).
- Satır 731–736: `kaynakListesi.baslat()` koşulsuz çağrısı + açıklayıcı yorum (`ilk çizimden hemen sonra`).

### src/styles/kaynak-listesi.css
- Satır 79–82: `.kaynak-durum` (`min-height 1.2rem`, `line-height: 1.4`).
- Satır 97–107: `.kaynak-sayi`, `.kaynak-bos-rehber` yeni kuralları.

### tests/kaynak-tarama-geri-bildirim.test.mjs (yeni)
- 6 test: koşulsuz başlat/idempotent, canlı şerit sayaçları, üç boş-kaynak neden+rehber senaryosu, `aria-live="polite"`, DetailView kaynak kontrolü.
- JSDOM yok; hafif fake-DOM + `node:module.registerHooks` ile `.css` import ve gerçek toplayıcı test ortamında susturuldu.

## Notlar

- `DetailView.js` ve `kaynakListesi.js`'de **önceden commit edilmemiş** (bu oturumdan önceki) değişiklikler var (`orijinalBaslik` logo-kullanımı ve `satirEkle` dedup/güncelleme mantığı). Bunlar bu görevin kapsamı dışında; üzerine eklendiler, geri alınmadı.
- `providerAggregator.js`, `vekil.js`, `PlayerModal.js` ve diğer view dosyaları değiştirilmedi.
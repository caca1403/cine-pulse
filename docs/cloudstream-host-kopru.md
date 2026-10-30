# CloudStream3 Eklenti Konağı — Native Köprü Sözleşmesi (kullanıcı 2026-10-29)

Native taraf `window.CinePulseCloudStream` nesnesini açar. **Tüm metotlar senkron
JSON string döner** (binder iş parçacığı; UI bloklanmaz). Aşırı yükleme YOKTUR —
her metot benzersiz addır (JS↔Java köprü kuralı).

## Mimari
- `android/app/cloudstreamApi/kotlin/` → cloudstream **v4.8.0** `library` modülünün
  vendor edilmiş kaynağı (KMP expect/actual Android-tek-modüle indirgendi) +
  ihtiyaç duyulan minimal shim'ler (CloudStreamApp, CommonActivity, DataStore,
  CloudflareKiller, Event, UiText, Plugin, syncproviders stub'ları).
- `com.cinepulse.studio.cloudstream.CloudStreamHost` → DexClassLoader konağı:
  `.cs3` (zip: classes.dex + manifest.json) ve `.apk` yükler; keşif sırası
  manifest.json `pluginClassName` → dex class_defs taraması (BasePlugin/MainAPI
  alt sınıfları). dex dosyaları `filesDir/cloudstream/plugins/` altında
  content-hash id ile saklanır, Android 10+ W^X için salt-okunur + ham dex olarak
  dışa çıkarılır.
- Pluginlerin `load()` çağrısı `APIHolder.allProviders`'a kaydettiği MainAPI
  örnekleri `eklentiId#sağlayıcıIndex` (`sagId`) adresiyle sunulur.
- Hata şeması: `{"ok":false,"islem":"...","tur":"java.lang.NoClassDefFoundError","hata":"<eksik FQN>"}`.

## Metotlar (JS → native)
| metot | açıklama |
|---|---|
| `csDurum()` | `{ok,konak,apiKokSurum,yukluEklenti,kayitliSaglayici}` |
| `csEklentiYukle(url, gorunenAd)` | plugin indir+yükle → `{ok,id,ad,saglayiciSayisi,saglayicilar[]}` |
| `csEklentiListesi()` | `{ok,ekler:[{id,ad,dosya,saglayicilar[]}]}` |
| `csEklentiKaldir(eklentiId)` | beforeUnload + kayıt düşür |
| `csRepoEkle(repoUrl)` | repo.json manifestini indir, **listele** (`eklentiler[]`) |
| `csRepoYukle(repoUrl)` | repo.json + TÜM eklentileri indir-yükle |
| `csSaglayiciAnaSayfalar(sagId)` | `{ok,sayfalar:[{index,ad,veri}]}` |
| `csAnaSayfaIcerik(sagId, sayfaIndex, sayfa)` | `{ok,bolumler:[{baslik,ogeler[]}]}` |
| `csAra(sagId, sorgu)` | sagId `""`/`"*"` → tümü; `{ok,sonuclar:[{sagId,saglayici,ogeler[]}]}` |
| `csYukle(sagId, url)` | LoadResponse → `{ok,detay:{ad,tur,poster,yil,ozet,bolumler:[{ad,veri,sezon,bolum}]}}` |
| `csAkislar(sagId, veriUrl)` | loadLinks → `{ok,linkler:[{ad,url,referer,kaynak,kalite,tur}],altyazilar:[{dil,url}]}` |

`ogeler[]` (SearchResponse): `{ad,url,tur,poster,yil,sagId}`. Oynatma için:
`csYukle` → `bolumler[i].veri` → `csAkislar` → `linkler[j].url` (+`referer`,
`kalite`) → mevcut `CinePulsePlayer.playAt(...)`.

## Eklenti bulma (repo.json)
CloudStream repo manifesti: `{"name":..., "plugins":[{"name","url",...}]}` —
`url` doğrudan .cs3/.apk indirilir. Örnek resmî:
`https://raw.githubusercontent.com/recloudstream/extensions/main/repo.json`;
TR örnek: WioSinema release `WioSinema.cs3`
(`https://github.com/Wiojelt/WioSinema/releases/latest`).

## Binary uyum & doğrulama
- Plugin dex'leri `com.lagradost.cloudstream3.*` API'sine karşı DERLENMİŞTİR;
  konak aynı FQN/imza setini vendor edilen v4.8.0 `library` kaynağından üretir.
- v4.8.0 etiketine karşı DERLENMEMİŞ plugin'lerde üye uyuşmazlığı olursa
  `csAra/csAkislar` hata JSON'unda eksik FQN/desektör döner (yalnız o yol çöker).
- Statik denetim (cihaz gerekmez): `python3 tools/cloudstream/verify_compat.py
  <plugin.cs3> [app-debug.apk]` — WioSinema referans seti **BINARY UYUMLU**
  (referans dökümü: `wiosinema_member_refs.json`).

## Bilinen gap'ler (D3 cihaz testinde izlenecek)
- `YoutubeExtractor` stub (NewPipe bağımlılığı kasten yok) → YouTube linkleri boş.
- `CloudflareKiller` pass-through stub → Cloudflare challenge'lı siteler plugin'in
  kendi çözümüne düşer; gerekirse CinePulseWebView'e bağlanır.
- `AesHelper.cryptoAESHandler` v4.8.0'da bloklamalı; eski plugin'ler SUSPEND çağırır
  → konağa suspend eşleniği eklendi (`cryptoAESHandlerBlocking` + IO sarmalayıcı).
- `syncproviders/*` stub (senkron yok), `DataStore` şifreleme katmansız.
- Plugin kendi UI'ını açarsa (material/NestedScrollView paketli değil) hata JSON
  döner — akış yolları UI'a dokunmaz.

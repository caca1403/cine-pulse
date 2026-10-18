# CinePulse — Yapılacaklar (2026-10-13 gece, kullanıcı durdurdu)

## Ağaç anlık durumu (dokunulmadan bekliyor)
- `src/providers/orion.js` **commit'siz**: fallback'te ORJ slug için slash kalıpları (`/dizi/{slug}/izle-3/`, `/izle/`) + deneme tavanı 8→10. Kullanıcı "şimdilik bu hali kalsın" dedi → commit/push YOK, cihazda bu değişiklik YOK.
- Push'lanmış main: `18b611d` (ORJ-slug slash yedeği, TV) + v1.1.71 (ses fix + Betelgeuse vekili). Telefonda 18b611d'li devtest APK kurulu.

## Araştırmada hatalı olduğum yerler (kabul)
- Sadece 12 Monkeys + Riverdale + Kara Şövalye gibi 3-5 örnekten "kod sağlam, site blokta" hükmü verdim — **genellemeler kanıtsız**.
- "12 Monkeys sitede yok" çıkarımı zayıf: sitenin araması challenge'lı, gerçek listeyi görmeden "yok" denmez.
- Polaris ve diğer yıldızların APK-daki son durumu **hiç ölçülmedi**; kullanıcı "Polaris de çalışmıyor" diyor — doğrulanmadı.
- Tip taraması eksik: kısa dizi hiç ölçülemedi (CDP çöktü), belgesel 2-3 kaynakla zayıf.

## Yapılacaklar (öncelik sırası)
0. **Orion TV: obfüe Rapid embed** (v1.1.72 sonrası kalan tek derin sorun, KANITLI:
   Riverdale S1B1 `hdfilmcehennemi.mobi/video/embed/...` 29KB sayfası gerçek HLS'yi
   `g06 = lir3("...".split("@"))` ile gizliyor (decode: balancehls4.playmix.uno/hls/
   riverdale-s01e01-...-tt5420376-....mp4/master.txt — doğru yayın!) ve `be()` `.txt`
   uzantısını tanımıyor; Interstellar aynı hostta DÜZ m3u8 döndü → site sayfa bazında
   karıştırıyor./close `/video/ID/` uçları cihazda CF 403 (boş). Seçenekler:
   (a) yapısal decoder (kimlikler rastgele, sayfa JS'ini eval = güvenlik riski; edge'de
   sandbox'ta çalıştır + host allowlist), (b) PAHALI_TUR'u yalnız sıfır-yayın durumunda
   ve ağ kilidi kanıtını yeniden ölçerek açmak, (c) close uçlarını edge vekilinden dene.
   Karar kullanıcıyla; tahmini kalıp YAZMAYI.
1. **Tam tip taraması (cihaz)** — film/dizi/anime/belgesel/kısa × en az 3'er örnek; `window.__cpSweep` fire-and-forget + poll (tek uzun evaluate YOK, 300sn duvarı). Hedef: tür başına 15-25 kaynak / 15-25 yıldız. Boş kalan provider'ların tam izi toplanacak. (tvr ARTIK ÇALIŞIYOR: ST+Interstellar 2'şer kaynak, v1.1.72.)
2. **Polaris ( tvr ) araştırması** — ÇÖZÜLDÜ v1.1.72: kök neden RC adresinin TLS'te ölü olması; istemci+edge yedek retry ile cihazda 2+2 kaynak. Kalan: yedek adres rotasyonu RC düştüğünde hâlâ tek sabit yedeğe bağlı.
3. **Orion derin araştırma** — TAMAMLANDI v1.1.72 (100 başlık, tools/orion-title-research.mjs + replay; 72/99 eşleşme, kimlik kapısı cihazda doğrulandı: Cowboy Bebop 2021 live-action reddi + Interstellar tt eşleşmesi). Kalan: arama 429'sız tam pencere + slug kısayolları.
4. **Bekleyen orion.js değişikliğinin ölçümü** — cihazda 5+ başlıkta before/after; işe yarıyorsa commit, yaramıyorsa geri al.
5. **Belgesel kapsamı** — 2-3 → 15+: Perseus'un cihaz-TR-spelling slug sorunu; smashy/torrent gömülü-oynatıcı kaynakları "iframe ruhu" kuralına aykırı, web filtresi doğru davranıyor ama APK'da da elenebilir.
6. **Kısa dizi kaynağı** — hiç ölçülemedi; taramaya dahil et.
7. **Sırada duran (kullanıcıya bağlı):** gizli anahtar rotasyonu checklist'i (RSA, Aria oturum, TMDB/Trakt, worker röle, Nova imzası).

## Cihaz notları (kayıp yaşanmasın)
- CDP forward her kurulum/yeniden başlatmada ölür: `adb forward tcp:9333 localabstract:webview_devtools_remote_$(pidof com.cinepulse.studio.devtest)`.
- Wi-Fi toggle sonrası app restart gerekir. Site aileleri (`.now/.nl/.com` + player `.mobi`) gün içinde dönüşümlü 503/challenge veriyor — sıfır sonuçlar **ham fetch ile çaprazlanmadan** koda yazılmaz.

## Tasima durumu (guncel)
- CF port + python resolver portu pushlandi (60cf662, d59acbd). BEKLEYEN: kullanici CF token+hesap kimligi -> proje kurulumu -> ortam degiskenleri (CP_TMDB_AP, CP_TMDB_KEYS, FANART_AP, CP_RTV_BASE, CP_RTV_RC_KEY, CP_SNX_HASH, CP_SNX_S, CP_SNX_RELAY) -> alan adi -> apiOrigin guncellemesi + 1.1.72 surumu.
- Eski APKlar Vercel adresine yazili; Vercel kotasi fatura döneminde acilabilir (yan umut), degilse eski surumlerde vekailli ozellikler eksik calisir.

## workers.dev tasima (canli)
- cp-probe workers.dev TLS gecisi DOGRULANDI (filtresiz). cinepulse worker deploy: True. Bekleyen: token Account Resources daraltma + workers.dev toggle -> assets upload -> test.
- _canlitv.js worker-safe (child_process/dns lazy).
- Pages (cinepulse-3wl) SW/_worker.js 500 veriyor -Workers-asSETS yonune gecildi, Pages yedek kaldi.

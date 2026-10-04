# Ev Xtream Relay (panel Cloudflare engelini aşmak için)

Panel (`ccgbstreambay2.xyz`) Vercel sunucu IP'lerini Cloudflare ile
engelliyor. Bu yüzden panel kaynakları üretimde/APK'da doğrudan çalışmaz.
Çözüm: yayını ev IP'sinden çıkaran küçük bir relay.

## Hızlı kurulum (bu makinede, tek seferlik + her açılışta)

1. Medya sunucusunu başlat (repo kökü):
   `node server/mediaServer.js`
2. Tunnel'ı aç:
   `bash deploy/home-xtream-relay/run-relay.sh`
3. Ekrana çıkan `https://....trycloudflare.com` adresini kopyala.
4. Uygulamada: **Canlı TV → oynatıcı çubuğu → SRC → Relay** satırına dokun,
   adresi yapıştır. Bu kadar — panel kaynakları artık ev IP'n üzerinden akar.

## Kalıcı kurulum (önerilir)

Quick tunnel adresi her yeniden başlatmada değişir. Sabit adres için
Cloudflare Zero Trust panelinden bir kez **named tunnel** oluşturup
`cloudflared tunnel run <isim>` ile çalıştır; hostname'i uygulamaya bir
kez girmen yeterli. İstersen bu adresi build secret'i yap:
`VITE_XTREAM_RELAY_ORIGIN=https://sab.it/adres` (GitHub Secrets + workflow env).

## Notlar

- Yerel geliştirmede (`localhost`) relay gerekmez; vite zaten `localhost:4000`'i kullanır.
- Relay kapalıyken panel kaynakları zarifçe atlanır, varsayılan yayınlar çalışır.
- Tunnel ücretsizdir; bant genişliği ev upload hızınla sınırlıdır.

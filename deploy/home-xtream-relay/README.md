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

## Kalıcı kurulum — tam otomatik (önerilir, bir kez yapılır)

`setup-named-tunnel.sh` sabit adresli tunnel + systemd servisleri kurar.
Makine yeniden başlasa bile mediaServer ve tunnel kendiliğinden ayağa kalkar;
uygulamaya bir daha adres girmen gerekmez.

```bash
bash deploy/home-xtream-relay/setup-named-tunnel.sh panel.ornek.com
sudo cp deploy/home-xtream-relay/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now cinepulse-mediaserver cloudflared-xtream
```

Sonra sabit adresi bir kez tanımla:

- GitHub → repo Settings → Secrets → Actions:
  `VITE_XTREAM_RELAY_ORIGIN=https://panel.ornek.com`
- Vercel → proje Settings → Environment Variables: aynı değer.

Bundan sonrası otomatik: APK derlemeleri ve Vercel dağıtımları adresi içine
gömülü alır; oynatıcı şu sırayla dener: **ev relay → yedek ağ → doğrudan**.
Biri ölürse diğerine sessizce geçer.

## Hızlı kurulum (geçici adres, deneme için)

## Notlar

- Yerel geliştirmede (`localhost`) relay gerekmez; vite zaten `localhost:4000`'i kullanır.
- Relay kapalıyken panel kaynakları zarifçe atlanır, varsayılan yayınlar çalışır.
- Tunnel ücretsizdir; bant genişliği ev upload hızınla sınırlıdır.

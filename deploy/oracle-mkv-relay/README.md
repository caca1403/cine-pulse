# Oracle MKV Relay

Bu küçük servis Sinewix'ten gelen MKV'yi FFmpeg ile parçalı MP4 olarak aktarır.
Vercel yalnız uygulamayı sunar; video dönüşümü Oracle VM'de kalır.

1. Oracle Cloud'da Always Free Ubuntu VM açın ve güvenlik listesinde TCP `80`, `443` ve `22` portlarını açın.
2. Bu depoyu VM'ye klonlayın ve `deploy/oracle-mkv-relay/.env.example` dosyasını `.env` olarak kopyalayın.
3. `RELAY_HOSTNAME` alanına VM'nin sabit genel IP'sini `IP.sslip.io` biçiminde yazın.
4. VM'de `sudo bash deploy/oracle-mkv-relay/install-oracle-ubuntu.sh` komutunu çalıştırın.
5. Proje kökünde `docker compose -f deploy/oracle-mkv-relay/compose.yaml --env-file deploy/oracle-mkv-relay/.env up -d --build` çalıştırın.
6. Relay adresini Vercel proje ortam değişkeni olarak `VITE_MKV_RELAY_ORIGIN=https://IP.sslip.io` biçiminde ekleyin ve CinePulse'ı yeniden dağıtın.

Kontrol: `https://IP.sslip.io/health` yanıt vermelidir.

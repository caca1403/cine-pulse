#!/usr/bin/env bash
# Ev Xtream relay: mediaServer (127.0.0.1:4000) + Cloudflare quick tunnel.
# Panel Cloudflare'ı Vercel IP'lerini engellediği için yayın ev IP'sinden çıkar.
set -euo pipefail

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "cloudflared kuruluyor..."
  sudo mkdir -p /usr/local/bin
  sudo curl -fsSL -o /usr/local/bin/cloudflared \
    https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
  sudo chmod +x /usr/local/bin/cloudflared
fi

# mediaServer ayakta mı?
if ! curl -sf -m 5 http://127.0.0.1:4000/ >/dev/null; then
  echo "mediaServer çalışmıyor. Önce başlat: node server/mediaServer.js"
  echo "(repo kökünde)"
  exit 1
fi

echo "Tunnel açılıyor... çıkan https URL'yi uygulamaya gir:"
echo "  Canlı TV -> SRC -> Relay (örn. https://xxx.trycloudflare.com)"
echo ""
exec cloudflared tunnel --url http://127.0.0.1:4000

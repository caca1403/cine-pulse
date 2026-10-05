#!/usr/bin/env bash
# Tek seferlik kurulum: named Cloudflare Tunnel (sabit adres) + systemd.
# Gereken: Cloudflare hesabında DNS'i Cloudflare'da olan bir domain.
# Kullanım: ./setup-named-tunnel.sh panel.ornek.com
set -euo pipefail
HOSTNAME="${1:-}"
if [ -z "$HOSTNAME" ]; then
  echo "Kullanım: $0 panel.ornek.com"
  exit 1
fi
if ! command -v cloudflared >/dev/null 2>&1; then
  sudo curl -fsSL -o /usr/local/bin/cloudflared \
    https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
  sudo chmod +x /usr/local/bin/cloudflared
fi
cloudflared tunnel login
cloudflared tunnel create xtream-relay || true
cloudflared tunnel route dns xtream-relay "$HOSTNAME"
TUNNEL_ID="$(cloudflared tunnel list 2>/dev/null | awk '/xtream-relay/ {print $1; exit}')"
sudo mkdir -p /etc/cloudflared
sudo tee /etc/cloudflared/config.yml >/dev/null <<EOF
tunnel: $TUNNEL_ID
credentials-file: /root/.cloudflared/${TUNNEL_ID}.json
ingress:
  - hostname: $HOSTNAME
    service: http://127.0.0.1:4000
  - service: http_status:404
EOF
echo "Tunnel hazır: https://$HOSTNAME"
echo "Sonraki adım:"
echo "  1) sudo cp deploy/home-xtream-relay/*.service /etc/systemd/system/ && sudo systemctl daemon-reload"
echo "  2) sudo systemctl enable --now cinepulse-mediaserver cloudflared-xtream"
echo "  3) GitHub Secrets'a ekle: VITE_XTREAM_RELAY_ORIGIN=https://$HOSTNAME"
echo "  4) Vercel'e de aynı env'i ekle (üretim web için). Bir daha dokunmana gerek yok."

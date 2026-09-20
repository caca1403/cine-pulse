#!/usr/bin/env bash
set -euo pipefail

if [ "${EUID}" -ne 0 ]; then
  echo "Bu komutu Oracle Ubuntu VM'de sudo ile çalıştırın."
  exit 1
fi

apt-get update
apt-get install -y ca-certificates curl git docker.io docker-compose-plugin
systemctl enable --now docker

install -d -m 0755 /opt/cinepulse-mkv-relay
echo "Hazır: proje dosyalarını /opt/cinepulse-mkv-relay içine koyup deploy/oracle-mkv-relay/.env dosyasını oluşturun."

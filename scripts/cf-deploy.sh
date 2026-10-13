#!/usr/bin/env bash
# Cloudflare Pages dogrudan-yukleme paketi: vite derle -> _worker.js (esbuild)
# -> zip + sha256 manifest. Kullanim: bash scripts/cf-deploy.mjs.sh (once token
# degiskenleri: CF_TOKEN, CF_ACCOUNT)
set -euo pipefail
cd "$(dirname "$0")/.."

node node_modules/vite/bin/vite.js build >/tmp/opencode/cf-vite.log 2>&1
echo "vite: $?"

node_modules/.bin/esbuild cf/pages-entry.js --bundle --format=esm --platform=browser --target=esnext \
  --external:stream --external:node:stream --external:util --external:node:util \
  --external:zlib --external:node:zlib --external:node:child_process \
  --external:node:dns --external:node:buffer --external:node:crypto \
  --outfile=dist/_worker.js --minify 2>/tmp/opencode/cf-esbuild.log
echo "esbuild: $? -> $(du -h dist/_worker.js | cut -f1)"

# _worker.js modu varken _routes.json celisme cikarir; paketlemeden cikar.
rm -f dist/_routes.json

python3 - <<'PY'
import hashlib, json, os, zipfile
root = 'dist'
manifest = {}
with zipfile.ZipFile('/tmp/opencode/pages-assets.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for dirpath, _dirs, files in os.walk(root):
        for f in files:
            full = os.path.join(dirpath, f)
            rel = '/' + os.path.relpath(full, root).replace(os.sep, '/')
            data = open(full, 'rb').read()
            manifest[rel] = hashlib.sha256(data).hexdigest()
            z.write(full, rel.lstrip('/'))
json.dump(manifest, open('/tmp/opencode/pages-manifest.json', 'w'))
print(f'zip: {len(manifest)} dosya, {os.path.getsize("/tmp/opencode/pages-assets.zip")//1024} KB')
PY

test -n "${CF_TOKEN:-}" && test -n "${CF_ACCOUNT:-}" || { echo "CF_TOKEN/CF_ACCOUNT yok — paket hazir"; exit 0; }

PROJ="${CF_PROJECT:-cinepulse}"
API="https://api.cloudflare.com/client/v4/accounts/$CF_ACCOUNT/pages/projects"
H="Authorization: Bearer $CF_TOKEN"

curl -sf -X POST "$API" -H "$H" -H 'Content-Type: application/json' \
  -d "{\"name\":\"$PROJ\",\"production_branch\":\"main\"}" >/tmp/opencode/cf-proj.json \
  || { echo "proje olusturma (zaten var olabilir):"; cat /tmp/opencode/cf-proj.json 2>/dev/null; }

curl -s -X PATCH "$API/$PROJ" -H "$H" -H 'Content-Type: application/json' -d '{
  "deployment_configs": {
    "production": { "compatibility_date": "2025-10-01", "compatibility_flags": ["nodejs_compat"] },
    "preview":    { "compatibility_date": "2025-10-01", "compatibility_flags": ["nodejs_compat"] }
  }
}' >/tmp/opencode/cf-cfg.json
grep -o '"success": *true' /tmp/opencode/cf-cfg.json >/dev/null && echo "uyumluluk: nodejs_compat OK" || { echo "UYARI config:"; head -c 300 /tmp/opencode/cf-cfg.json; echo; }

curl -s -X POST "$API/$PROJ/deployments" -H "$H" \
  -F branch=main -F commit-dirty=true -F 'commit-message=cf direct' \
  -F "manifest=</tmp/opencode/pages-manifest.json;type=application/json" \
  -F "assets=</tmp/opencode/pages-assets.zip;type=application/zip" >/tmp/opencode/cf-deploy.json

python3 -c "import json;d=json.load(open('/tmp/opencode/cf-deploy.json'));print('deploy success:',d.get('success'));r=d.get('result') or {};print('url:',r.get('url'));print('errors:',d.get('errors'))"

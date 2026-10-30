#!/usr/bin/env python3
# CloudStream eklenti konağı BINARY-UYUM doğrulayıcısı (kullanıcı 2026-10-29).
#
# Bir CloudStream3 eklenti paketinin (.cs3 = zip/classes.dex veya .apk) dex
# referanslarını döküp, derlenmiş CinePulse APK'sının TÜM dex'lerinde
# (vendor edilen com.lagradost API + NiceHttp + diğer bağımlılıklar merge'li)
# her sınıf/üye/imza'nın tanımlı olup olmadığını doğrular. Cihaz gerekmez.
#
# Kullanım:
#   ./gradlew -PcinepulseDeviceTest=true assembleDebug -x lint
#   python3 tools/cloudstream/verify_compat.py <plugin.cs3|apk> [app-debug.apk]
#
# Örnek referans eklenti (TR): WioSinema
#   https://github.com/Wiojelt/WioSinema/releases/latest → WioSinema.cs3
import json, os, re, subprocess, sys, zipfile, glob

SDK = os.environ.get("ANDROID_HOME", os.path.expanduser("~/android-sdk"))
DEXDUMPS = sorted(glob.glob(os.path.join(SDK, "build-tools", "*", "dexdump")))
if not DEXDUMPS:
    sys.exit("dexdump bulunamadı (ANDROID_HOME?)")
DEXDUMP = DEXDUMPS[-1]

if len(sys.argv) < 2:
    sys.exit("kullanım: verify_compat.py <plugin.cs3|apk> [app.apk]")
PLUGIN, APK = sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else \
    os.path.join(os.path.dirname(__file__), "../../android/app/build/outputs/apk/debug/app-debug.apk")
OUT = "/tmp/cs_verify_refs.json"


def dexdump_bytes(data, tag):
    p = f"/tmp/cs_verify_{tag}.dex"
    with open(p, "wb") as f:
        f.write(data)
    return subprocess.run([DEXDUMP, "-d", p], capture_output=True, text=True, errors="replace").stdout


def extract_plugin_dex(path):
    z = zipfile.ZipFile(path)
    return z.read("classes.dex")


pat = re.compile(r"L(com/lagradost/[A-Za-z0-9_$/]+);\.([A-Za-z0-9_$<>]+):(\([^)]*\)[A-Za-z0-9_$/;\[]+|L[A-Za-z0-9_$/]+;)")
refs = {}
for line in dexdump_bytes(extract_plugin_dex(PLUGIN), "plugin").splitlines():
    if "Lcom/lagradost/" not in line:
        continue
    for m in pat.finditer(line):
        refs.setdefault(m.group(1), set()).add((m.group(2), m.group(3)))
json.dump({k: sorted(v) for k, v in refs.items()}, open(OUT, "w"), indent=1)

defined, classes = set(), set()
z = zipfile.ZipFile(APK)
for n in z.namelist():
    if not re.fullmatch(r"classes\d*\.dex", n):
        continue
    cur, pending = None, None
    for line in dexdump_bytes(z.read(n), "app2").splitlines():
        m = re.search(r"Class descriptor\s+: 'L([^']+);'", line)
        if m:
            cur = m.group(1).replace("/", "."); classes.add(cur); pending = None; continue
        m = re.search(r"^\s+name\s+: '([^']+)'", line)
        if m and cur:
            pending = m.group(1); continue
        m = re.search(r"type\s+: '(\([^)]*\)[A-Za-z0-9_$/;\[]+|L[A-Za-z0-9_$/]+;|[ZBCSIJFDV]+)'", line)
        if m and cur and pending:
            defined.add(f"{cur}|{pending}|{m.group(1)}"); pending = None

OBJECT_METHODS = {"hashCode", "equals", "toString", "finalize", "getClass",
                  "notify", "notifyAll", "wait", "clone"}
eksik_sinif, eksik_uye = [], []
for cls, members in refs.items():
    cdot = cls.replace("/", ".")
    if cdot not in classes:
        eksik_sinif.append(cdot)
    for name, desc in members:
        if cdot in classes and name in OBJECT_METHODS:
            continue  # enum/Object mirası — ART runtime'da çözer
        if f"{cdot}|{name}|{desc}" not in defined:
            eksik_uye.append(f"{cdot}.{name}:{desc}")

print(f"plugin: {PLUGIN}\napk:    {APK}")
print(f"referans sınıf: {len(refs)} | apk sınıf: {len(classes)} | apk üye: {len(defined)}")
print(f"eksik SINIF ({len(eksik_sinif)}): " + (", ".join(eksik_sinif) or "-"))
print(f"eksik ÜYE ({len(eksik_uye)}):")
for u in eksik_uye[:60]:
    print("   ", u)
print("SONUÇ:", "BINARY UYUMLU" if not eksik_sinif and not eksik_uye else "GAP VAR — eksik FQN'leri CloudStreamHost shim'lerine ekleyin")
sys.exit(0 if not eksik_sinif and not eksik_uye else 1)

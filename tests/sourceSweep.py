#!/usr/bin/env python3
"""CinePulse kaynak taramaci - TUM aktif kaynaklari iki platformda test eder.

Kullanim:
    node server/mediaServer.js &
    python3 tests/sourceSweep.py

Platformlar:
  SIDECAR  http://127.0.0.1:4000                      (masaustu / DEB)
  VERCEL   https://cine-pulse-drab.vercel.app          (Android APK + web)

Not: Upstream siteler donemsiz oldugu icin bu bir gecir/kalmaz kapisi
DEGIL, tani aracidir. Regresyonda hangi saglayicinin yandigini gormek
ve platformlar arasindaki farki olcmek icin kullanilir.
"""
import json, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor

SIDECAR = "http://127.0.0.1:4000"
VERCEL = "https://cine-pulse-drab.vercel.app"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")

# (etiket, provider, type, title, season, episode)
# type dogru verilmezse saglayici "series-only"/"movie-only" donup test yaniltici
# sekilde HATA gosterir.
RESOLVE_PROVIDERS = [
    ("HD Film Cehennemi", "hdfc", "movie",  "Yolcu",  0, 0),
    ("Dizisol",           "dzs",  "series", "Kara Sevda", 1, 1),
    ("Sinewix",           "snx",  "movie",  "Yolcu",  0, 0),
    ("Sinewix (dizi)",    "snx",  "series", "Kara Sevda", 1, 1),
    ("Sezonluk Dizi",     "szd",  "series", "Kara Sevda", 1, 1),
    ("Diziyou",           "dyu",  "series", "Kara Sevda", 1, 1),
    ("CanliTV",           "ctv",  "movie",  "",        0, 0),
    ("Set Film",          "setf", "movie",  "Yolcu",  0, 0),
    ("Selcukflix",        "slc",  "movie",  "Yolcu",  0, 0),
    ("FullHD Film",       "fhdf", "movie",  "Yolcu",  0, 0),
    ("Webteizle",         "wtz",  "movie",  "Yolcu",  0, 0),
    ("Dizilla",           "dzl",  "series", "Kara Sevda", 1, 1),
    ("Film Ekseni",       "fxs",  "movie",  "Yolcu",  0, 0),
]

# (etiket, yol sablonu, sidecar'da var mi)
# Bu rotalar YALNIZCA Vercel'de tanimli; sidecar 404 donmesi NORMAL'dir.
SCRAPE_PROVIDERS = [
    ("Dizibu (dzb)",   "/api/dzb?query=%s", False),
    ("DiziOku (dzs)",  "/api/dzs?query=%s", False),
    ("Sinewix (snx)",  "/api/snx?path=%s",  False),
    ("Jet Film",       "/api/jet?path=%s",  False),
    ("KidsVip (kvip)", "/api/kvip?path=%s", False),
    ("RTV",            "/api/rtv?path=%s",  False),
    ("CZM",            "/api/czm?path=%s",  False),
    ("DiziDrop (ddz)", "/api/ddz?path=%s",  False),
    ("Sezonluk Dizi",  "/api/szd?path=%s",  False),
]

UTILITIES = [
    ("EPG",             "/api/epg"),
    ("Fanart",          "/api/fanart?type=movie&tmdbId=550"),
    ("Canli kaynaklar", "/api/live_sources"),
    ("Logo proxy",      "/api/img_proxy?url=https://picsum.photos/48"),
    ("APK indirme",     "/cinepulse.apk"),
    ("Versiyon (apk)",  "/version.json"),
    ("Versiyon (masa)", "/desktop-version.json"),
]


def call(base, path, timeout=45, binary=False):
    url = base + path
    t0 = time.time()
    try:
        p = subprocess.run(["curl", "-s", "-L", "--max-time", str(timeout), "-A", UA,
                            "-o", "/tmp/opencode/srv.bin", "-w", "%{http_code}", url],
                           capture_output=True, text=True, timeout=timeout + 10)
        code = p.stdout.strip()
        ms = int((time.time() - t0) * 1000)
        body = open("/tmp/opencode/srv.bin", "rb").read()
    except Exception:
        return {"code": "timeout", "ms": timeout * 1000, "json": None,
                "bytes": 0, "text": "", "binary": b""}
    js = None
    if not binary:
        try:
            js = json.loads(body.decode("utf-8", "replace"))
        except Exception:
            pass
    return {"code": code, "ms": ms, "json": js, "bytes": len(body),
            "text": body[:200].decode("utf-8", "replace"), "binary": body}


def classify(r, kind):
    """OK / BOŞ / HATA / ÖLÜ döndürür."""
    if r["code"] == "timeout":
        return "ÖLÜ", "zaman aşımı"
    if r["code"] in ("500", "502", "503"):
        return "HATA", f"sunucu {r['code']}"
    if r["code"] == "403":
        return "HATA", "403"
    if r["code"] != "200":
        return "HATA", f"HTTP {r['code']}"

    if kind == "resolve":
        j = r["json"]
        if not isinstance(j, dict):
            return "HATA", "geçersiz JSON"
        if j.get("success") is False or j.get("error"):
            return "HATA", str(j.get("error"))[:60]
        has = any(j.get(k) for k in ("url", "embedUrl", "embed", "externalUrl", "streams", "videoUrl"))
        return ("OK" if has else "BOŞ"), ("yayın döndü" if has else "başarılı ama yayın yok")
    if kind == "scrape":
        j = r["json"]
        if not isinstance(j, dict):
            return "HATA", "geçersiz JSON"
        if j.get("error"):
            return "HATA", str(j["error"])[:60]
        items = j.get("items") or j.get("results") or j.get("data") or []
        n = len(items) if isinstance(items, list) else 0
        return ("OK" if n else "BOŞ"), f"{n} sonuç"
    if kind == "util":
        return "OK", f"{r['bytes']} bayt"
    return "OK", ""


def run_platform(base, name):
    print(f"\n{'='*78}\n  {name}  ({base})\n{'='*78}")
    results = []

    print(f"\n  {'A) ÇÖZÜMLEYİCİLER  /api/resolve':-<62}")
    def do_resolve(item):
        label, prov, rtype, title, season, ep = item
        from urllib.parse import quote
        path = f"/api/resolve?provider={prov}&type={rtype}"
        if title:
            path += f"&title={quote(title)}"
        if rtype == "series":
            path += f"&season={season}&episode={ep}"
        r = call(base, path)
        st, note = classify(r, "resolve")
        results.append((name, "resolve", label, st, note, r["ms"]))
        return st
    with ThreadPoolExecutor(max_workers=4) as ex:
        list(ex.map(do_resolve, RESOLVE_PROVIDERS))

    print(f"\n  {'B) KAZIYICILAR':-<62}")
    def do_scrape(item):
        label, tpl, on_sidecar = item
        from urllib.parse import quote
        if not on_sidecar and base == SIDECAR:
            results.append((name, "scrape", label, "YOK", "bu rota Vercel-only", 0))
            return "YOK"
        r = call(base, tpl % quote("Kara Sevda"))
        st, note = classify(r, "scrape")
        results.append((name, "scrape", label, st, note, r["ms"]))
        return st
    with ThreadPoolExecutor(max_workers=4) as ex:
        list(ex.map(do_scrape, SCRAPE_PROVIDERS))

    print(f"\n  {'C) ALTYAPI':-<62}")
    def do_util(item):
        label, path = item
        r = call(base, path, binary=path.endswith(".apk"))
        st, note = classify(r, "util")
        results.append((name, "util", label, st, note, r["ms"]))
        return st
    with ThreadPoolExecutor(max_workers=4) as ex:
        list(ex.map(do_util, UTILITIES))

    order = {"OK": 0, "BOŞ": 1, "HATA": 2, "ÖLÜ": 3, "YOK": 4}
    for plat, grp, label, st, note, ms in sorted(results, key=lambda x: (x[1], order.get(x[3], 9))):
        icon = {"OK": "✓", "BOŞ": "○", "HATA": "✗", "ÖLÜ": "✖", "YOK": "·"}[st]
        print(f"    {icon} {label:<26} {st:<5} {note:<34} {ms:>6}ms")
    return results


if __name__ == "__main__":
    allr = run_platform(SIDECAR, "MASAÜSTÜ SIDECAR")
    allr += run_platform(VERCEL, "VERCEL (Android/Web)")
    print(f"\n{'='*78}\n  ÖZET\n{'='*78}")
    from collections import Counter
    for plat in ("MASAÜSTÜ SIDECAR", "VERCEL (Android/Web)"):
        c = Counter(r[3] for r in allr if r[0] == plat)
        tot = sum(c.values())
        applicable = tot - c["YOK"]
        print(f"\n  {plat}:  " + "  ".join(f"{k}={c[k]}" for k in ("OK", "BOŞ", "HATA", "ÖLÜ", "YOK")) +
              f"   → uygun {applicable} kaynaktan %{100*c['OK']//max(1,applicable)}")
        bad = [r for r in allr if r[0] == plat and r[3] in ("HATA", "ÖLÜ")]
        if bad:
            print("    sorunlu:", ", ".join(sorted({r[2] for r in bad})))
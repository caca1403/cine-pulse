#!/usr/bin/env python3
"""
EKLENTI TESTI — frontend'in GERCEKTEN kullandigi kod yollariyla.
Her eklentinin kendi origin'ine, uygulamanin proxy'si uzerinden erisilir
(dizibalScraper /api/proxy kullanir; resolve.py provider'lar /api/resolve).

Amaç: Vercel (Android) ve masaustu (sidecar) arasindaki FARKLARI bulmak.
"""
import json, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import quote

VERCEL = "https://cine-pulse-drab.vercel.app"
SIDECAR = "http://127.0.0.1:4000"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36"

# (eklenti, origin_url, content_tip)
PROXIED = [
    ("dzb / Dizibal",  "https://dizibal.org/ara/oneri?q=kara",        "json"),
    ("dyu / Diziyou",  "https://www.diziyou.com/?s=kara",             "html"),
    ("dzy / Diziyo",   "https://www.diziyo.so/?s=kara",               "html"),
    ("dzr / Diziroll", "https://diziroll.club/?s=kara",               "html"),
    ("dzs / Dizisol",  "https://dizisol.com/api/index.php",            "html"),
    ("tvr / ReçTV",    "https://www.prectv70.lol/",                  "html"),
]

# (eklenti, provider, type, title)
RESOLVE = [
    ("hdfc / HDFilmCehennemi", "hdfc", "movie",  "Yolcu"),
    ("setf / SetFilm",         "setf", "movie",  "Yolcu"),
    ("slc  / Selcukflix",      "slc",  "movie",  "Yolcu"),
    ("fhdf / FullHD",          "fhdf", "movie",  "Yolcu"),
    ("wtz  / Webteizle",       "wtz",  "movie",  "Yolcu"),
    ("fxs  / FilmEkseni",      "fxs",  "movie",  "Yolcu"),
    ("snx  / Sinewix",         "snx",  "movie",  "Yolcu"),
    ("dzs  / Dizisol",         "dzs",  "series", "Erkenci Kuş"),
    ("szd  / SezonlukDizi",    "szd",  "series", "Erkenci Kuş"),
    ("dyu  / Diziyou",         "dyu",  "series", "Erkenci Kuş"),
    ("dzl  / Dizilla",         "dzl",  "series", "Erkenci Kuş"),
]


def curl(url, timeout=35):
    t0 = time.time()
    try:
        p = subprocess.run(["curl", "-s", "-L", "--max-time", str(timeout), "-A", UA,
                            "-w", "\n__HTTP__%{http_code}", url],
                           capture_output=True, text=True, timeout=timeout + 8)
        body, _, code = p.stdout.rpartition("\n__HTTP__")
        return code.strip(), body, int((time.time() - t0) * 1000)
    except Exception:
        return "timeout", "", timeout * 1000


def test_origin(base, name, url, kind):
    proxied = f"{base}/api/proxy?url={quote(url, safe='')}&ref={quote('https://' + url.split('/')[2] + '/', safe='')}"
    code, body, ms = curl(proxied)
    if code != "200":
        return f"✗ HTTP {code}", "", ms
    n = len(body)
    if n < 400:
        return f"○ boş ({n}B)", "", ms
    if kind == "json":
        try:
            d = json.loads(body)
            c = sum(len(v) for v in d.values() if isinstance(v, list))
            return f"✓ {c} sonuç", "", ms
        except Exception:
            return "✗ JSON değil", "", ms
    low = body.lower()
    blocked = any(k in low[:3000] for k in ("attention required", "cf-browser-verification", "just a moment"))
    if blocked:
        return "✗ Cloudflare engeli", "", ms
    return f"✓ {n}B HTML", "", ms


def test_resolve(base, name, prov, rtype, title):
    path = f"/api/resolve?provider={prov}&type={rtype}&title={quote(title)}"
    if rtype == "series":
        path += "&season=1&episode=1"
    code, body, ms = curl(base + path, 45)
    if code == "timeout":
        return "✗ zaman aşımı", "", ms
    try:
        d = json.loads(body)
    except Exception:
        return f"✗ JSON değil ({len(body)}B)", "", ms
    if d.get("success"):
        st = d.get("streams") or []
        return f"✓ {len(st)} yayın", "", ms
    err = str(d.get("error"))[:32]
    if d.get("requiresVerification"):
        err += " [doğrulama]"
    return f"✗ {err}", "", ms


def run(base, label):
    print(f"\n{'='*76}\n  {label}\n{'='*76}")
    rows = []
    with ThreadPoolExecutor(max_workers=5) as ex:
        f1 = list(ex.map(lambda a: test_origin(base, *a), PROXIED))
        f2 = list(ex.map(lambda a: test_resolve(base, *a), RESOLVE))
    for (name, _, _), (st, _, ms) in zip(PROXIED, f1):
        rows.append((name, st)); print(f"  {st:<26} {name:<28} {ms:>6}ms")
    print()
    for (name, _, _, _), (st, _, ms) in zip(RESOLVE, f2):
        rows.append((name, st)); print(f"  {st:<26} {name:<28} {ms:>6}ms")
    ok = sum(1 for _, s in rows if s.startswith("✓"))
    print(f"\n  → {ok}/{len(rows)} çalışıyor")
    return rows


a = run(VERCEL, "VERCEL (Android APK)")
b = run(SIDECAR, "SIDECAR (Masaüstü/DEB)")
print(f"\n{'='*76}\n  FARK\n{'='*76}")
for (n1, s1), (n2, s2) in zip(a, b):
    if ("✓" in s1) != ("✓" in s2):
        print(f"  ⚠ {n1:<28} Vercel={s1:<22} Sidecar={s2}")
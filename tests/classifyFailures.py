#!/usr/bin/env python3
"""
Kalan basarisiz kaynaklari SINIFLANDIRIR:
  (a) KOD-DUZELTILEBILIR  -> upstream erisilebilir, kaziyici bozuk
  (b) IP / CF ENGELI      -> Cloudflare "Just a moment" / 403 (WebView katmani gerekir)
  (c) SITE OLU            -> upstream 404/5xx
"""
import subprocess, sys
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import quote

TARGETS = [
    ("hdfc (Vercel)",   "https://cine-pulse-drab.vercel.app/api/resolve?provider=hdfc&type=movie&title=Yolcu", "resolve"),
    ("hdfc (yerel)",    "http://127.0.0.1:4000/api/resolve?provider=hdfc&type=movie&title=Yolcu", "resolve"),
    ("dyu  (Vercel)",   "https://cine-pulse-drab.vercel.app/api/resolve?provider=dyu&type=series&title=Erkenci%20Ku%C5%9F&season=1&episode=1", "resolve"),
    ("dyu  (yerel)",    "http://127.0.0.1:4000/api/resolve?provider=dyu&type=series&title=Erkenci%20Ku%C5%9F&season=1&episode=1", "resolve"),
    ("dzr  origin",     "https://cine-pulse-drab.vercel.app/api/proxy?url=" + quote("https://diziroll.club/", safe='') + "&ref=" + quote("https://diziroll.club/", safe=''), "proxy"),
    ("tvr  origin",     "https://cine-pulse-drab.vercel.app/api/proxy?url=" + quote("https://www.prectv70.lol/", safe='') + "&ref=" + quote("https://www.prectv70.lol/", safe=''), "proxy"),
    ("dzs  origin",     "https://cine-pulse-drab.vercel.app/api/proxy?url=" + quote("https://dizisol.com/", safe='') + "&ref=" + quote("https://dizisol.com/", safe=''), "proxy"),
    ("slc  origin",     "https://cine-pulse-drab.vercel.app/api/proxy?url=" + quote("https://www.selcukflix.com.tr/", safe='') + "&ref=" + quote("https://www.selcukflix.com.tr/", safe=''), "proxy"),
    ("fhdf origin",     "https://cine-pulse-drab.vercel.app/api/proxy?url=" + quote("https://fullhdfilmizlesene.pw/", safe='') + "&ref=" + quote("https://fullhdfilmizlesene.pw/", safe=''), "proxy"),
    ("szd  origin",     "https://cine-pulse-drab.vercel.app/api/proxy?url=" + quote("https://sezonlukdizi.cc/", safe='') + "&ref=" + quote("https://sezonlukdizi.cc/", safe=''), "proxy"),
    ("dzl  origin",     "https://cine-pulse-drab.vercel.app/api/proxy?url=" + quote("https://www.dizilla.com/", safe='') + "&ref=" + quote("https://www.dizilla.com/", safe=''), "proxy"),
    ("snx  origin",     "https://cine-pulse-drab.vercel.app/api/proxy?url=" + quote("https://www.sinewix.com/", safe='') + "&ref=" + quote("https://www.sinewix.com/", safe=''), "proxy"),
]
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36"
CF = ("just a moment", "attention required", "cf-browser-verification",
      "cf_chl_opt", "checking your browser", "enable javascript")


def go(item):
    name, url, kind = item
    try:
        p = subprocess.run(["curl", "-s", "-L", "--max-time", "35", "-A", UA,
                            "-w", "\n__C__%{http_code}", url],
                           capture_output=True, text=True, timeout=45)
        body, _, code = p.stdout.rpartition("\n__C__")
        code = code.strip()
    except Exception:
        return name, "timeout", "—"
    low = body[:6000].lower()
    cf = any(k in low for k in CF)
    if cf or code == "403":
        cls = "(b) IP/CF ENGELI"
    elif code == "404":
        cls = "(c) SITE OLU / yol degismis"
    elif code in ("500", "502", "503"):
        cls = "(c) upstream 5xx"
    elif code == "200":
        if '"success":true' in low or '"success": true' in low:
            cls = "(OK) calisiyor"
        elif '"no playable source"' in low or '"match not found"' in low:
            cls = "(a) KAZIYICI bozuk (upstream erisilebilir)"
        else:
            cls = f"(?) 200 ama beklenmeyen ({len(body)}B)"
    else:
        cls = f"(?) HTTP {code}"
    return name, cls, f"{code} {len(body)}B"


print(f"{'KAYNAK':<18} {'SINIF':<44} DETAY")
print("-" * 84)
with ThreadPoolExecutor(max_workers=5) as ex:
    for n, c, d in ex.map(go, TARGETS):
        print(f"{n:<18} {c:<44} {d}")
#!/usr/bin/env python3
"""SITEDE (Vercel) kaynak dogrulamasi — yerel test degil, canli sunucu."""
import json, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import quote

V = "https://cine-pulse-drab.vercel.app"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36"


import itertools
_SEQ = itertools.count()


def curl(url, timeout=35, binary=False):
    # Her çağrı kendi dosyasına yazmalı: paralel çalışan testler aynı
    # dosyayı paylaşınca gövdeler birbirine karışıyor (yarış koşulu).
    tmp = f"/tmp/opencode/vc-{next(_SEQ)}.bin"
    t0 = time.time()
    try:
        p = subprocess.run(["curl", "-s", "-L", "--max-time", str(timeout), "-A", UA,
                            "-o", tmp, "-w", "%{http_code}", url],
                           capture_output=True, text=True, timeout=timeout + 8)
        code = p.stdout.strip()
        body = open(tmp, "rb").read()
    except Exception:
        return "timeout", b"", timeout * 1000
    finally:
        try:
            import os
            os.unlink(tmp)
        except Exception:
            pass
    return code, body, int((time.time() - t0) * 1000)


def proxy(target, ref=None):
    r = ref or f"{target.split('/')[0]}//{target.split('/')[2]}/"
    return f"{V}/api/proxy?url={quote(target, safe='')}&ref={quote(r, safe='')}"


CASES = []


def add(name, fn):
    CASES.append((name, fn))


# --- Canlı TV kaynakları
def _live_row():
    st, note, ms = _live()
    return st, note, ms


def _one_row(src):
    st, note, ms = _one(src)
    return st, note, ms


def _page_row(p):
    st, note, ms = _page(p)
    return st, note, ms


def _json_row(p, key):
    st, note, ms = _json(p, key)
    return st, note, ms


add("Canlı TV: kaynak listesi", _live_row)
add("Canlı TV: kral (tek kaynak)", lambda: _one_row("kral"))
add("Canlı TV: turhan (tek kaynak)", lambda: _one_row("turhan"))


def _live():
    c, b, ms = curl(f"{V}/api/live_sources")
    if c != "200":
        return "✗", f"HTTP {c}", ms
    d = json.loads(b)
    return "✓", " ".join(f"{s['id']}={s['count']}" for s in d["sources"]), ms


def _one(src):
    c, b, ms = curl(f"{V}/api/live_sources?src={src}")
    if c != "200":
        return "✗", f"HTTP {c}", ms
    d = json.loads(b)
    s = d["sources"][0]
    return ("✓" if s["ok"] else "✗"), f"{s['count']} kanal", ms


# --- origin / eklenti erişimi (sitenin kendi proxy'si üzerinden)
for name, url in [
    ("Dizibal (Nero)", "https://dizibal.org/ara/oneri?q=kara"),
    ("dizi77 diziler", "https://dizi77.life/diziler"),
    ("sinemacc arsiv", "https://sinemacc.com/film-arsivi/"),
    ("jetfilm M3U", "https://raw.githubusercontent.com/patr0nq/flmS/refs/heads/main/jetfilm_tum.m3u"),
    ("filmmodu M3U", "https://raw.githubusercontent.com/patr0nq/flmS/refs/heads/main/filmmodu_tum.m3u"),
]:
    def mk(u=url):
        def f():
            c, b, ms = curl(proxy(u))
            if c != "200":
                return "✗", f"HTTP {c}", ms
            if b[:7] == b"#EXTM3U":
                return "✓", f"M3U · {b.count(b'#EXTINF')} kanal", ms
            low = b[:6000].lower()
            if b"just a moment" in low:
                return "·", "Cloudflare engeli (WebView gerekir)", ms
            return "✓", f"{len(b)} bayt", ms
        return f
    add(name, mk())

# --- çözümleyiciler
for name, prov, ty, title in [
    ("VEGA (setf)", "setf", "movie", "Yolcu"),
    ("ATLAS (dzs)", "dzs", "series", "Erkenci Kuş"),
    ("VELA (fxs)", "fxs", "movie", "Yolcu"),
]:
    def mk(p=prov, t=ty, ti=title):
        def f():
            u = f"{V}/api/resolve?provider={p}&type={t}&title={quote(ti)}"
            if t == "series":
                u += "&season=1&episode=1"
            c, b, ms = curl(u, 45)
            if c != "200":
                return "✗", f"HTTP {c}", ms
            d = json.loads(b)
            if d.get("success"):
                return "✓", f"{len(d.get('streams', []))} yayın", ms
            return "✗", str(d.get("error"))[:30], ms
        return f
    add(name, mk())

# --- web uygulaması
add("Ana sayfa", lambda: _page_row("/"))
add("EPG", lambda: _json_row("/api/epg", "channels"))
add("Sürüm", lambda: _json_row("/version.json", "version"))


def _page(p):
    c, b, ms = curl(V + p)
    return ("✓" if c == "200" and b"<!DOCTYPE" in b[:200] else "✗"), f"{len(b)} bayt", ms


def _json(p, key):
    c, b, ms = curl(V + p)
    try:
        d = json.loads(b)
        v = d.get(key)
        n = len(v) if isinstance(v, (list, dict)) else v
        return ("✓" if c == "200" else "✗"), f"{key}={n}", ms
    except Exception:
        return "✗", f"HTTP {c}", ms


print("=" * 74)
print("  SİTE DOĞRULAMASI —", V)
print("=" * 74)
ok = 0
with ThreadPoolExecutor(max_workers=5) as ex:
    for (name, _), (st, note, ms) in zip(CASES, ex.map(lambda c: c[1](), CASES)):
        if st == "✓":
            ok += 1
        print(f"  {st:<3} {name:<28} {note:<40} {ms:>6}ms")
print(f"\n  → {ok}/{len(CASES)} çalışıyor")
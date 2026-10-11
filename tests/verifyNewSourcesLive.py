#!/usr/bin/env python3
"""CANLI Vercel sunucusunda yeni kaynakların GERÇEKTEN oynatılabilir yayın
verdiğini doğrular. Yerel test değil: her istek production adresine gider.

Kapsam:
  1) Her kaynağın kazıma ucu canlı origin'e ulaşabiliyor mu
  2) sinemacc: film sayfası → base64 → FirePlayer API → doğrudan HLS
  3) film M3U: liste + bir filmin gerçek dosya adresi
  4) sinemacc Vercel'in kendi /api/proxy'si üzerinden POST çözümlemesi
"""
import base64, json, re, subprocess, sys, time, urllib.parse

V = "https://cine-pulse-drab.vercel.app"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

_n = 0


def curl(url, data=None, extra=None, timeout=40):
    global _n
    _n += 1
    out = f"/tmp/opencode/vs-{_n}.bin"
    cmd = ["curl", "-s", "-L", "--max-time", str(timeout), "-A", UA, "-o", out,
           "-w", "%{http_code}", url]
    if data:
        cmd[5:5] = ["-X", "POST", "--data", data]
    for e in (extra or []):
        cmd[5:5] = ["-H", e]
    try:
        p = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout + 10)
        return p.stdout.strip(), open(out, "rb").read()
    except Exception:
        return "timeout", b""


def vproxy(url, ref=None):
    r = ref or f"{urllib.parse.urlparse(url).scheme}://{urllib.parse.urlparse(url).netloc}/"
    return f"{V}/api/proxy?url={urllib.parse.quote(url, safe='')}&ref={urllib.parse.quote(r, safe='')}"


ok = fail = 0


def chk(cond, msg):
    global ok, fail
    if cond:
        ok += 1
        print(f"  ✓ {msg}")
    else:
        fail += 1
        print(f"  ✗ {msg}")


print("=" * 72)
print(f"  CANLI SUNUCU DOĞRULAMASI — {V}")
print("=" * 72)

# ── 1) Kazıma uçları ─────────────────────────────────────────────────────
print("\n═══ 1) Kaynak sayfaları ═══")
code, body = curl(vproxy("https://sinemacc.com/film-arsivi/"))
slugs = sorted(set(re.findall(rb'href="https://sinemacc\.com/film/([a-z0-9-]+)/"', body)))
chk(code == "200" and len(slugs) > 0, f"sinemacc arşiv: HTTP {code}, {len(slugs)} film")

# dizi77: Vercel'in datacenter IP'si Cloudflare'e engellidir (403). Uygulama
# bu kaynagi CF Worker gateway üzerinden okur (bkz. dizi77Scraper), Vercel
# proxy'sini yalnizca son çare olarak dener. Burada UYGULAMANIN YOLU ölçülür.
WORKER = "https://wild-credit-e1ae.cagatayca07.workers.dev"
code_v, _ = curl(vproxy("https://dizi77.life/diziler"), timeout=25)
code, body = curl(f"{WORKER}?url={urllib.parse.quote('https://dizi77.life/diziler', safe='')}")
d77 = sorted(set(re.findall(rb'href="https://dizi77\.life/dizi/([a-z0-9-]+)"', body)))
chk(code == "200" and len(d77) > 0,
    f"dizi77 (CF Worker yolu): HTTP {code}, {len(d77)} dizi")
if code_v != "200":
    print(f"      · Vercel proxy'si: HTTP {code_v} (CF engeli beklenen; çalışma yolu Worker)")

for name, url in [("jetfilm M3U", "https://raw.githubusercontent.com/patr0nq/flmS/refs/heads/main/jetfilm_tum.m3u"),
                  ("filmmodu M3U", "https://raw.githubusercontent.com/patr0nq/flmS/refs/heads/main/filmmodu_tum.m3u")]:
    code, body = curl(vproxy(url))
    n = body.count(b"#EXTINF")
    chk(code == "200" and n > 100, f"{name}: HTTP {code}, {n} kayıt")

# ── 2) sinemacc uçtan uca: film → base64 → API → HLS ────────────────────
print("\n═══ 2) sinemacc: film → oynatıcı → doğrudan HLS ═══")
hls_url = None
if slugs:
    slug = slugs[0].decode()
    code, body = curl(vproxy(f"https://sinemacc.com/film/{slug}/"))
    m = re.search(rb'src="([A-Za-z0-9+/]{40,}={0,2})"', body)
    chk(bool(m), f"detay sayfasında base64 oynatıcı ({slug[:36]})")
    if m:
        embed = base64.b64decode(m.group(1)).decode()
        chk("player.filmizle.in" in embed, f"base64 çözüldü: {embed[:58]}")
        vid = re.search(r"/video/([A-Za-z0-9_-]{8,80})", embed)
        if vid:
            api = f"https://player.filmizle.in/player/index.php?data={vid.group(1)}&do=getVideo"
            payload = f"hash={vid.group(1)}&r={urllib.parse.quote('https://sinemacc.com/', safe='')}"
            # Vercel'in kendi proxy'si üzerinden — uygulamanın yaptığı gibi
            code, body = curl(
                vproxy(api, "https://sinemacc.com/"), payload,
                ["Content-Type: application/x-www-form-urlencoded",
                 "X-Requested-With: XMLHttpRequest"])
            try:
                d = json.loads(body)
                hls_url = d.get("securedLink") or ""
                chk(d.get("hls") is True, f"FirePlayer API JSON döndü (hls={d.get('hls')})")
                chk(".m3u8" in hls_url, f"doğrudan HLS: {hls_url[:66]}")
            except Exception:
                chk(False, f"API JSON döndürmedi: {body[:70]!r}")

# ── 3) HLS manifest gerçekten servis ediliyor mu ────────────────────────
print("\n═══ 3) HLS yayını gerçekten oynatılıyor mu ═══")
if hls_url:
    play = f"{V}/api/hls_proxy?url={urllib.parse.quote(hls_url, safe='')}&ref={urllib.parse.quote('https://player.filmizle.in/', safe='')}"
    code, body = curl(play)
    chk(code == "200", f"uygulama oynatma proxy'si: HTTP {code}")
    chk(body.startswith(b"#EXTM3U"), "geçerli HLS playlist (#EXTM3U)")
    variants = body.count(b"#EXT-X-STREAM-INF")
    print(f"      → {variants} varyant, {len(body)} bayt")
    # Bir alt-playlist ve ilk segment
    sub = re.search(rb'^(?!#)([^\r\n]+\.m3u8)', body, re.M)
    if sub:
        import urllib.parse as up
        nxt = up.urljoin(hls_url, sub.group(1).decode())
        code2, b2 = curl(f"{V}/api/hls_proxy?url={up.quote(nxt, safe='')}&ref={up.quote('https://player.filmizle.in/', safe='')}")
        chk(code2 == "200" and b2.startswith(b"#EXTM3U"), f"alt-playlist açıldı: {sub.group(1).decode()[:50]}")
        seg = re.search(rb'^(?!#)([^\r\n]+\.(?:ts|m4s))', b2, re.M)
        if seg:
            segurl = up.urljoin(nxt, seg.group(1).decode())
            code3, b3 = curl(f"{V}/api/hls_proxy?url={up.quote(segurl, safe='')}&ref={up.quote('https://player.filmizle.in/', safe='')}", timeout=50)
            chk(code3 == "200" and len(b3) > 1000, f"video segmenti indi: {len(b3)} bayt (HTTP {code3})")
else:
    chk(False, "HLS adresi alınamadı")

# ── 3b) dizi77 bolum oynaticisi ─────────────────────────────────────────
print("\n═══ 3b) dizi77: bolum sayfası → oynatıcı ═══")
if d77:
    slug = d77[0].decode()
    ep_url = f"https://dizi77.life/dizi/{slug}/sezon/1/bolum/1"
    code, body = curl(f"{WORKER}?url={urllib.parse.quote(ep_url, safe='')}")
    m = re.search(rb'<iframe[^>]*src="(https?://[^"]+)"', body, re.I)
    chk(code == "200" and len(body) > 10000, f"S1B1 sayfası: HTTP {code}, {len(body)} bayt")
    chk(bool(m), f"oynatıcı iframe bulundu ({slug})")
    if m:
        chk(m.group(1).decode().startswith("https://"), f"iframe: {m.group(1).decode()[:62]}")
        pc, pb = curl(m.group(1).decode(), timeout=25)
        chk(pc == "200", f"oynatıcı sunucusu yanıt veriyor (HTTP {pc}, {len(pb)} bayt)")

# ── 4) film M3U gerçek dosya ───────────────────────────────────────────
print("\n═══ 4) film M3U: gerçek dosya bağlantısı ═══")
code, body = curl(vproxy("https://raw.githubusercontent.com/patr0nq/flmS/refs/heads/main/jetfilm_tum.m3u"))
m = re.search(rb"\n(https?://[^\r\n]+)\n", body)
if m:
    f_url = m.group(1).decode()
    chk(True, f"M3U içinde dosya adresi var: {f_url[:60]}")
else:
    chk(False, "M3U içinde dosya adresi yok")

print("\n" + "=" * 72)
print(f"  SONUÇ: {ok} geçti, {fail} başarısız")
print("=" * 72)
sys.exit(0 if fail == 0 else 1)
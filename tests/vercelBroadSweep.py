#!/usr/bin/env python3
"""VERCEL genis baslik taramasi: her saglayici icin cok sayida baslik.
'No playable source' cogu zaman yanlis test basligindan kaynaklanir
(sezonlukdizi'de oldugu gibi)."""
import json, subprocess, time
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import quote

V = "https://cine-pulse-drab.vercel.app"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36"

MOVIES = ["Yolcu", "Gladiator", "Yeşil Yol", "Esaretin Bedeli", "Inception",
          "The Dark Knight", "Interstellar", "Django Unchained", "Parasıt",
          "Babam ve Oğlum", "Kelebeğin Rüyası", "3 Idiots"]
SERIES = ["Erkenci Kuş", "Kara Sevda", "Bay Yanlış", "İçerde", "Ufak Tefek Cinayetler",
          "Çukur", "Kurt Seyit ve Şura", "Aşk Mantık İntikam", "Şahsiyet",
          "The Walking Dead", "Breaking Bad", "Game of Thrones"]

CASES = [
    ("hdfc", "movie", MOVIES), ("setf", "movie", MOVIES),
    ("slc", "movie", MOVIES), ("fhdf", "movie", MOVIES),
    ("wtz", "movie", MOVIES), ("fxs", "movie", MOVIES),
    ("snx", "movie", MOVIES), ("szd", "series", SERIES),
    ("dzs", "series", SERIES), ("dyu", "series", SERIES),
    ("dzl", "series", SERIES),
]


def probe(prov, rtype, title):
    p = f"/api/resolve?provider={prov}&type={rtype}&title={quote(title)}"
    if rtype == "series":
        p += "&season=1&episode=1"
    try:
        r = subprocess.run(["curl", "-s", "--max-time", "35", "-A", UA, V + p],
                           capture_output=True, text=True, timeout=45)
        d = json.loads(r.stdout)
    except Exception:
        return None
    if d.get("success"):
        return len(d.get("streams") or [])
    return None


print(f"{'PROVIDER':<8} {'BAŞARILI':<10} {'BAŞARISIZ':<10} EN İYİ SONUÇ")
print("-" * 74)
total_ok = 0
with ThreadPoolExecutor(max_workers=6) as ex:
    for prov, rtype, titles in CASES:
        t0 = time.time()
        res = ex.map(lambda t: probe(prov, rtype, t), titles)
        res = list(res)
        ok = sum(1 for x in res if x)
        best = max((x for x in res if x), default=0)
        total_ok += ok
        print(f"{prov:<8} {ok}/{len(titles):<8} {len(titles)-ok:<10} {best} yayın   ({time.time()-t0:.0f}s)")

print(f"\n  → toplam başarılı çözümleme: {total_ok}")
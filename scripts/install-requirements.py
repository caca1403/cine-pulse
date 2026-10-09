#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CinePulse Studio - Otomatik Sistem ve Gereksinim Tanılama Aracı
(Python 3, Medya Motoru, Scraper'lar ve Ağ Kontrolü)
"""

import sys
import os
import subprocess
import urllib.request
import json
import time

def print_header():
    print("=" * 64)
    print("  🎬 CinePulse Studio - Sistem ve Gereksinim Doğrulama")
    print("  Cloudstream (Eklenti/Kaynak) & Nuvio (Native Akış) Motoru")
    print("=" * 64)
    print()

def check_python():
    print("[1/5] Python Sürümü Kontrol Ediliyor...")
    ver = sys.version_info
    print(f"  • Tespit edilen: Python {ver.major}.{ver.minor}.{ver.micro}")
    if ver.major >= 3 and ver.minor >= 8:
        print("  ✓ Python 3 gereksinimi karşılandı.")
        return True
    else:
        print("  ⚠️ Uyarı: Python 3.8 veya daha yeni bir sürüm önerilir.")
        return False

def check_standard_modules():
    print("\n[2/5] Standart Kütüphaneler Doğrulanıyor...")
    modules = ["urllib.request", "urllib.parse", "json", "http.cookiejar", "base64", "re", "subprocess"]
    all_ok = True
    for mod in modules:
        try:
            __import__(mod)
            print(f"  ✓ {mod} hazır")
        except ImportError:
            print(f"  ✗ {mod} eksik!")
            all_ok = False
    return all_ok

def check_sidecar():
    print("\n[3/5] Yerel Medya Motoru (Port 4000) Denetleniyor...")
    try:
        req = urllib.request.Request("http://127.0.0.1:4000/health", headers={"User-Agent": "CinePulseCheck/1.0"})
        t0 = time.time()
        with urllib.request.urlopen(req, timeout=3) as resp:
            elapsed = round((time.time() - t0) * 1000)
            if resp.status == 200:
                print(f"  ✓ Medya sunucusu aktif (127.0.0.1:4000) - Yanıt süresi: {elapsed}ms")
                return True
    except Exception as e:
        print("  ℹ️ Yerel servis şu an kapalı (Masaüstü uygulaması açıldığında otomatik başlatılır).")
        return False

def check_scrapers():
    print("\n[4/5] Yerel Python Çözücüler (Scraper'lar) Test Ediliyor...")
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    py_files = [
        os.path.join(base_dir, "server", "hdfc_extractor.py"),
        os.path.join(base_dir, "api", "providers", "base.py"),
        os.path.join(base_dir, "api", "providers", "sezonlukdizi.py"),
        os.path.join(base_dir, "api", "providers", "sinewix.py")
    ]
    all_exist = True
    for p in py_files:
        rel = os.path.relpath(p, base_dir)
        if os.path.isfile(p):
            print(f"  ✓ {rel} mevcut ve erişilebilir")
        else:
            print(f"  ✗ {rel} bulunamadı!")
            all_exist = False
    return all_exist

def check_network():
    print("\n[5/5] Ağ ve DNS Bağlantısı Test Ediliyor...")
    try:
        req = urllib.request.Request("https://api.themoviedb.org", headers={"User-Agent": "Mozilla/5.0"})
        t0 = time.time()
        with urllib.request.urlopen(req, timeout=4) as resp:
            elapsed = round((time.time() - t0) * 1000)
            print(f"  ✓ TMDB / Ağ erişimi başarılı ({elapsed}ms)")
            return True
    except Exception:
        print("  ⚠️ TMDB bağlantısı gecikmeli (Yerel internet bağlantınızı kontrol edin).")
        return False

def main():
    print_header()
    c1 = check_python()
    c2 = check_standard_modules()
    c3 = check_sidecar()
    c4 = check_scrapers()
    c5 = check_network()

    print("\n" + "=" * 64)
    if c1 and c2 and c4:
        print("  🎉 TEBRİKLER! Tüm temel sistem gereksinimleri eksiksiz hazır.")
        print("  CinePulse uygulamasını başlatıp Kurulum Sihirbazı üzerinden")
        print("  kaynaklarınızı ve oynatıcınızı dilediğiniz gibi yönetebilirsiniz.")
    else:
        print("  ⚠️ Bazı bileşenlerde eksikler tespit edildi.")
        print("  Lütfen yukarıdaki uyarıları inceleyip gerekli adımları tamamlayın.")
    print("=" * 64)

if __name__ == "__main__":
    main()


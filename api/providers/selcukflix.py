"""SelcukFlix ozel resolver (Cloudstream SelcukFlix mantigi).
API: /api/bg/ üzerinden AES-256-CBC sifreli yanitlar.
Sifre anahtari: SHA-256(!!22xx!!90!!) -> Base64 -> ilk 32 bayt, IV: ilk 16 bayt.
Player: Pichive (pichive.online master.m3u8) dogrudan HLS akisi ve altyazilari."""
import sys
import os
import re
import time
import json
import base64
import hashlib
import urllib.parse
import urllib.request
import ssl

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from providers.base import clean_title, proxied, finalize_streams  # noqa: E402

try:
    from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
    from cryptography.hazmat.primitives import padding as crypto_padding
    HAS_CRYPTO = True
except ImportError:
    HAS_CRYPTO = False

BASE = 'https://selcukflix.com'
REF = BASE + '/'
_LAST_DOMAIN_SYNC = 0
_DOMAINS_URL = 'https://raw.githubusercontent.com/manitux-app/cs-plugins/main/domains.json'

# Self-signed cert / ISP bypass context
_SSL_CTX = ssl.create_default_context()
_SSL_CTX.check_hostname = False
_SSL_CTX.verify_mode = ssl.CERT_NONE


def _sync_domain():
    global BASE, REF, _LAST_DOMAIN_SYNC
    now = time.time()
    if now - _LAST_DOMAIN_SYNC < 1800:
        return
    _LAST_DOMAIN_SYNC = now
    try:
        req = urllib.request.Request(_DOMAINS_URL, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=4, context=_SSL_CTX) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            d = data.get('selcukflix') or data.get('SelcukFlix')
            if d and d.startswith('http'):
                BASE = d.rstrip('/')
                REF = BASE + '/'
    except Exception:
        pass

    # Canlı adres: Patron siteurl.txt öncelikli (manitux ölü .com verebiliyor).
    try:
        from .base import resolve_domain
        _canli = resolve_domain('selcukflix', BASE, _DOMAINS_URL)
        if _canli and _canli.startswith('http') and _canli.rstrip('/') != BASE:
            BASE = _canli.rstrip('/')
            REF = BASE + '/'
    except Exception:
        pass


_SLC_KEY = b'9bYMCNQiWsXIYFWYAu7EkdsSbmGBTyUI'
_SLC_IV = b'\x00' * 16


def _decrypt(b64_ciphertext):
    """AES-256-CBC desifreleme. Anahtar: '9bYMCNQiWsXIYFWYAu7EkdsSbmGBTyUI',
    IV: 16 sifir bayti (Patron saglayicisiyla birebir). Onceki SHA-256
    turetmeli anahtar YANLISTI; API yaniti hic cozulemiyordu."""
    if not HAS_CRYPTO or not b64_ciphertext:
        return None
    import re as _re
    try:
        temiz = _re.sub(r'[^A-Za-z0-9+/=]', '', str(b64_ciphertext))
        veri = base64.b64decode(temiz)
        cipher = Cipher(algorithms.AES(_SLC_KEY), modes.CBC(_SLC_IV))
        decryptor = cipher.decryptor()
        raw = decryptor.update(veri) + decryptor.finalize()
        try:
            unpadder = crypto_padding.PKCS7(128).unpadder()
            raw = unpadder.update(raw) + unpadder.finalize()
        except Exception:
            raw = raw.rstrip(b'\x00')
        for kodlama in ('utf-8', 'latin-1'):
            try:
                metin = raw.decode(kodlama).strip()
                if metin:
                    try:
                        return json.loads(metin)
                    except Exception:
                        continue
            except Exception:
                continue
    except Exception:
        return None
    return None


def _api_get(endpoint, params=None):
    """SelcukFlix API cagrisi ve sifreli veri acma.
    NOT: Uç nokta GET'i 405 ile reddediyor ('izinsiz erisim...'). Calisan
    yontem POST + okhttp User-Agent + Origin/Referer + application/json.
    (Patron saglayicisi da ayni sekilde cagiriyor.)"""
    _sync_domain()
    query_str = urllib.parse.urlencode(params or {})
    url = f"{BASE}/api/bg/{endpoint}" + (f"?{query_str}" if query_str else "")
    headers = {
        'User-Agent': 'okhttp/4.9.2',
        'Referer': REF,
        'Origin': BASE,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
    }
    try:
        req = urllib.request.Request(url, data=b'', headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=10, context=_SSL_CTX) as resp:
            raw_text = resp.read().decode('utf-8')
            if 'erisime_engellenmis' in raw_text or raw_text.lstrip().startswith('<'):
                return None
            data = json.loads(raw_text)
            if isinstance(data, dict) and data.get('response'):
                return _decrypt(data['response'])
            return data
    except Exception:
        # POST basarisiz olursa GET'i dene (bazi yansimalar POST'u engeller).
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=8, context=_SSL_CTX) as resp:
                raw_text = resp.read().decode('utf-8')
                data = json.loads(raw_text)
                if isinstance(data, dict) and data.get('response'):
                    return _decrypt(data['response'])
                return data
        except Exception:
            return None


def _pichive_master(url):
    """pichive.online m.php veya video player linkini master.m3u8'e donusturur."""
    if not url:
        return None
    u = url.replace('\\/', '/')
    if 'pichive.online' in u:
        if '/m.php' in u:
            u = u.replace('/m.php?', '/master.m3u8?').replace('/m.php', '/master.m3u8')
    return u


def search(query):
    """Basliga gore icerik listesini arar."""
    data = _api_get('searchContent', {'searchterm': query})
    if isinstance(data, list):
        return data
    if isinstance(data, dict) and isinstance(data.get('items'), list):
        return data['items']
    return []


def _resolve_item(item, is_tv=False, season=1, episode=1):
    slug = item.get('slug') or item.get('used_slug')
    if not slug:
        return []

    streams = []
    # 1. Dizi ise bolum bilgisini al
    if is_tv:
        ep_data = _api_get('getSerieSeasonAndEpisodes', {'slug': slug})
        if isinstance(ep_data, dict) and 'episodes' in ep_data:
            target_ep = None
            for ep in ep_data.get('episodes', []):
                s_num = int(ep.get('season_number') or ep.get('season') or 1)
                e_num = int(ep.get('episode_number') or ep.get('episode') or 1)
                if s_num == season and e_num == episode:
                    target_ep = ep
                    break
            if target_ep and target_ep.get('source_content'):
                src = _pichive_master(target_ep['source_content'])
                if src and src.startswith('http'):
                    streams.append({
                        'provider': 'SelcukFlix',
                        'streamUrl': proxied(src, 'https://pichive.online/'),
                        'rawStreamUrl': src,
                        'embedUrl': f"{BASE}/dizi/{slug}",
                        'isHls': True,
                        'subtitles': []
                    })
    else:
        # Film ise detay verisini al
        detail = _api_get('getContentBySlugParallel', {'slug': slug})
        if isinstance(detail, dict):
            content = detail.get('content') or detail.get('contentItem') or detail
            sources = content.get('source_content') or content.get('sources') or []
            if isinstance(sources, str) and sources.startswith('http'):
                sources = [{'src': sources}]
            elif isinstance(sources, str) and 'pichive' in sources:
                m = re.findall(r'https?://[^\s"\'<>]+\.pichive\.online[^\s"\'<>]*', sources)
                sources = [{'src': u} for u in m]

            for s in sources:
                raw_src = s.get('src') if isinstance(s, dict) else (s if isinstance(s, str) else '')
                m3u8_url = _pichive_master(raw_src)
                if m3u8_url and m3u8_url.startswith('http'):
                    streams.append({
                        'provider': 'SelcukFlix',
                        'streamUrl': proxied(m3u8_url, 'https://pichive.online/'),
                        'rawStreamUrl': m3u8_url,
                        'embedUrl': f"{BASE}/film/{slug}",
                        'isHls': True,
                        'subtitles': []
                    })

    # Yedek: film/dizi sayfasini HTML olarak cekip iframe veya openPlayer yakalama
    if not streams:
        try:
            page_url = f"{BASE}/dizi/{slug}" if is_tv else f"{BASE}/film/{slug}"
            req = urllib.request.Request(page_url, headers={'User-Agent': 'Mozilla/5.0', 'Referer': REF})
            with urllib.request.urlopen(req, timeout=6, context=_SSL_CTX) as resp:
                html = resp.read().decode('utf-8', errors='ignore')
                player_m = re.findall(r'openPlayer\(\s*["\']([^"\']+)["\']', html)
                for p_url in player_m:
                    m3u = _pichive_master(p_url)
                    if m3u and m3u.startswith('http'):
                        streams.append({
                            'provider': 'SelcukFlix',
                            'streamUrl': proxied(m3u, 'https://pichive.online/'),
                            'rawStreamUrl': m3u,
                            'embedUrl': page_url,
                            'isHls': True,
                            'subtitles': []
                        })
        except Exception:
            pass

    return streams


def _candidates(title, original_title, titles):
    out = []
    for t in [title, original_title] + list(titles or []):
        c = clean_title(t or '')
        if c and c not in out:
            out.append(c)
    return out


def resolve_movie(title='', original_title='', titles=None):
    cands = _candidates(title, original_title, titles)
    if not cands:
        return {'success': False, 'error': 'Query required'}
    for q in cands[:3]:
        items = search(q)
        for item in items:
            streams = _resolve_item(item, is_tv=False)
            if streams:
                slug = item.get('slug') or item.get('used_slug')
                return dict(finalize_streams(streams, f"{BASE}/film/{slug}"), provider='SLC')
    return {'success': False, 'error': 'No playable source'}


def resolve_episode(title='', original_title='', titles=None, season=1, episode=1):
    cands = _candidates(title, original_title, titles)
    if not cands:
        return {'success': False, 'error': 'Query required'}
    for q in cands[:3]:
        items = search(q)
        for item in items:
            streams = _resolve_item(item, is_tv=True, season=season, episode=episode)
            if streams:
                slug = item.get('slug') or item.get('used_slug')
                return dict(finalize_streams(streams, f"{BASE}/dizi/{slug}"), provider='SLC')
    return {'success': False, 'error': 'No playable source'}


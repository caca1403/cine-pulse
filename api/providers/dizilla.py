"""Dizilla ozel resolver (Cloudstream Dizilla mantigi, bizim ozel yapiya uyarlandi).
Cloudstream yontemi:
- supportedTypes: TvSeries ONLY (dizi-only). Film icin cagri yapilmaz.
- search(): POST /api/bg/searchContent?searchterm=<q> (bos body, X-Requested-With)
  -> AES-256-CBC sifreli yanit (key: 9bYMCNQiWsXIYFWYAu7EkdsSbmGBTyUI, IV: 16x0)
  -> result[]: {object_id (=seriesId), used_slug, object_name}
- load(url): slug -> seriesId -> POST getSerieSeasonAndEpisodes?seriesId=<id>
  -> seasons[] -> episodes[]: {id (=episodeId), season_no, episode_no, used_slug}
  -> S/E eslesen episodeId secilir (Cloudstream .season-panel a.fep denkliği).
- loadLinks(): POST getEpisodeSources?episodeId=<id>
  -> sources[]: {source_content (iframe), source_name, language_name, quality_name}
  -> iframe src'tan Pichive master.m3u8 cozumu (best-effort) + iframe fallback.
  Ayni kaynak hem Dublaj hem Altyazi sekmesinde gosterilir (cift dil destegi).
Film + dizi ayrimi: SetFilm/SelcukFlix cift tip (Movie+TvSeries) destekler,
Dizilla tek tip (TvSeries) destekler — Cloudstream tvTypes ile birebir.
"""
import sys
import os
import re
import time
import json
import base64
import hashlib
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from providers.base import fetch_html, clean_title, proxied, finalize_streams  # noqa: E402

try:
    from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
    from cryptography.hazmat.primitives import padding as crypto_padding
    HAS_CRYPTO = True
except ImportError:
    HAS_CRYPTO = False

BASE = 'https://dizilla.now'
REF = BASE + '/'
_LAST_DOMAIN_SYNC = 0
_DOMAINS_URL = 'https://raw.githubusercontent.com/manitux-app/cs-plugins/main/domains.json'

# Cloudstream DizillaData.decrypt ile birebir: sabit key, IV = 16 sifir byte.
_DIZ_KEY = b'9bYMCNQiWsXIYFWYAu7EkdsSbmGBTyUI'
_DIZ_IV = b'\x00' * 16


def _sync_domain():
    global BASE, REF, _LAST_DOMAIN_SYNC
    now = time.time()
    if now - _LAST_DOMAIN_SYNC < 1800:
        return
    _LAST_DOMAIN_SYNC = now
    try:
        raw = fetch_html(_DOMAINS_URL, timeout=4)
        if raw:
            data = json.loads(raw)
            d = data.get('dizilla') or data.get('Dizilla')
            if d and d.startswith('http'):
                BASE = d.rstrip('/')
                REF = BASE + '/'
    except Exception:
        pass


def _decrypt(b64_ciphertext):
    if not HAS_CRYPTO or not b64_ciphertext:
        return None
    try:
        cipher = Cipher(algorithms.AES(_DIZ_KEY), modes.CBC(_DIZ_IV))
        decryptor = cipher.decryptor()
        raw = decryptor.update(base64.b64decode(b64_ciphertext)) + decryptor.finalize()
        unpadder = crypto_padding.PKCS7(128).unpadder()
        decrypted = unpadder.update(raw) + unpadder.finalize()
        return json.loads(decrypted.decode('utf-8'))
    except Exception:
        return None


def _api_post_qs(endpoint_qs):
    """Cloudstream request$fetch POST mantigi: query URL'de, body bos,
    X-Requested-With basligi zorunlu."""
    _sync_domain()
    import urllib.request
    import ssl
    url = f"{BASE}/api/bg/{endpoint_qs}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': REF,
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json, text/plain, */*',
    }
    try:
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        req = urllib.request.Request(url, data=b'', headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=8, context=ctx) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if isinstance(data, dict) and data.get('response'):
                return _decrypt(data['response'])
            return data
    except Exception:
        pass
    # Yedek: curl ile ayni istek (CF/WAF dostu)
    try:
        import shutil
        import subprocess
        if shutil.which('curl'):
            out = subprocess.run(
                ['curl', '-4', '-sL', '--compressed', '--connect-timeout', '4', '--max-time', '10',
                 '-A', headers['User-Agent'], '-e', REF,
                 '-H', 'X-Requested-With: XMLHttpRequest', '-H', 'Accept: application/json',
                 '-X', 'POST', '-d', '', url],
                capture_output=True, timeout=13)
            if out.returncode == 0 and out.stdout:
                data = json.loads(out.stdout.decode('utf-8', errors='ignore'))
                if isinstance(data, dict) and data.get('response'):
                    return _decrypt(data['response'])
                return data
    except Exception:
        pass
    # Son basamak: CF Worker gecidi (Vercel IP'si engelliyse; POST destekli).
    try:
        import urllib.request as _urlreq
        import urllib.parse as _urlparse
        gateway = ('https://wild-credit-e1ae.cagatayca07.workers.dev?url='
                   + _urlparse.quote(url, safe=''))
        wreq = _urlreq.Request(
            gateway, data=b'',
            headers={'User-Agent': headers['User-Agent'],
                     'X-Requested-With': 'XMLHttpRequest',
                     'Accept': 'application/json'},
            method='POST')
        with _urlreq.urlopen(wreq, timeout=12) as wresp:
            if wresp.status == 200:
                data = json.loads(wresp.read().decode('utf-8', errors='ignore'))
                if isinstance(data, dict) and data.get('response'):
                    return _decrypt(data['response'])
                return data
    except Exception:
        pass
    return None


def _pichive_master(url):
    if not url:
        return None
    u = url.replace('\\/', '/')
    if '/m.php' in u:
        u = u.replace('/m.php', '/master.m3u8')
    return u


def _resolve_iframe(iframe_url):
    """iframe.php sayfasindan master.m3u8 / file / source2.php cikarma (best-effort).
    Cloudstream DizillaPlayer.resolve ile ayni desenler."""
    if not iframe_url:
        return None
    if iframe_url.startswith('//'):
        iframe_url = 'https:' + iframe_url
    # Direkt m.php ise cevir, sayfa cekmeye gerek yok
    if '/m.php' in iframe_url:
        return _pichive_master(iframe_url)
    html = fetch_html(iframe_url, REF, timeout=7)
    if not html or len(html) < 300:
        return None
    # 1. window.openPlayer('...')
    m = re.search(r'window\.openPlayer\(\s*[\'"]([^\'"]+)[\'"]', html)
    if m:
        cand = m.group(1)
        if cand.startswith('//'):
            cand = 'https:' + cand
        master = _pichive_master(cand)
        if master and master.startswith('http'):
            return master
    # 2. "file":"..."
    for fm in re.finditer(r'"file"\s*:\s*"((?:[^"\\]|\\.)*)"', html):
        cand = fm.group(1).replace('\\/', '/').replace('\\', '')
        if cand.startswith('//'):
            cand = 'https:' + cand
        if 'master.m3u8' in cand or '/m.php' in cand or cand.endswith('.mp4'):
            master = _pichive_master(cand)
            if master and master.startswith('http'):
                return master
    # 3. /source2.php?v=...
    sm = re.search(r'(/source2\.php\?v=[a-zA-Z0-9]+)', html)
    if sm:
        try:
            origin = re.match(r'^(https?://[^/]+)', iframe_url).group(1)
            return origin + sm.group(1)
        except Exception:
            pass
    # 4. Sayfadaki ilk master/m.php linki
    mm = re.search(r'https?://[^\s"\'<>\\]*?(?:/master\.m3u8[^\s"\'<>\\]*|/m\.php[^\s"\'<>\\]*)', html)
    if mm:
        return _pichive_master(mm.group(0))
    return None


def _extract_iframe_src(source_content):
    if not source_content:
        return None
    m = re.search(r'<iframe[^>]+src=["\']([^"\']+)["\']', source_content, re.I)
    if m:
        u = m.group(1)
        if u.startswith('//'):
            u = 'https:' + u
        return u
    m2 = re.search(r'(https?://[^\s"\'<>]+\.pichive\.online[^\s"\'<>]*)', source_content)
    if m2:
        return m2.group(1)
    if source_content.strip().startswith('http'):
        return source_content.strip()
    return None


def search(query):
    _sync_domain()
    data = _api_post_qs(f"searchContent?searchterm={urllib.parse.quote(query or '')}")
    if isinstance(data, dict) and isinstance(data.get('result'), list):
        return data['result']
    if isinstance(data, list):
        return data
    return []


def _seasons(series_id):
    data = _api_post_qs(f"getSerieSeasonAndEpisodes?seriesId={int(series_id)}")
    if isinstance(data, dict) and isinstance(data.get('result'), list):
        return data['result']
    if isinstance(data, list):
        return data
    return []


def _episode_id_for(series_id, season, episode):
    try:
        s_num = int(season)
    except Exception:
        s_num = 1
    try:
        e_num = int(episode)
    except Exception:
        e_num = 1
    for sn in _seasons(series_id):
        try:
            sn_no = int(sn.get('season_no') or 0)
        except Exception:
            continue
        if sn_no != s_num:
            continue
        for ep in sn.get('episodes') or []:
            try:
                en_no = int(ep.get('episode_no') or 0)
            except Exception:
                continue
            if en_no == e_num and ep.get('id'):
                return ep['id']
    # Yedek: ayni sezonun ilk bolumu
    for sn in _seasons(series_id):
        try:
            if int(sn.get('season_no') or 0) == s_num and (sn.get('episodes') or []):
                return (sn['episodes'][0] or {}).get('id')
        except Exception:
            pass
    return None


def _episode_sources(episode_id):
    data = _api_post_qs(f"getEpisodeSources?episodeId={int(episode_id)}")
    if isinstance(data, dict) and isinstance(data.get('result'), list):
        return data['result']
    if isinstance(data, list):
        return data
    return []


# X-Frame-Options: SAMEORIGIN (veya erisimsiz) oldugu olculen host'lar.
# Bunlar capraz-origin gomulemez: tarayici "baglanmayi reddetti" verir.
# Ayrica sunucu IP'sinden Cloudflare 403 yerler, cozumu de uretilemez.
# Bu yuzden ham iframe'leri ASLA kaynak diye listeleme (SetPlay koprusu
# ile ayni ders). Sadece gercekten cozulmus dogrudan medya yayinlanir.
# Olculen duvarlilar: pichive.online, *.pichive.online (four.), dplayer82.site,
# dplayer66.site, sn.dplayer72/74.site, filese.me (fragman hostu, ayrica yonlenir),
# contentx.me (yanitsiz).
_WALLED_IFRAME_HOSTS = (
    'pichive.online',
    'dplayer82.site',
    'dplayer66.site',
    'filese.me',
    'contentx.me',
)


def _is_walled_iframe(url):
    try:
        host = (url.split('//', 1)[1].split('/', 1)[0] if '//' in url else '').lower().split(':')[0]
    except Exception:
        return True
    if not host:
        return True
    if host in _WALLED_IFRAME_HOSTS:
        return True
    if host.endswith('.pichive.online'):
        return True
    # dplayer ailesi: dplayer66.site, sn.dplayer72.site, ...
    if 'dplayer' in host and host.endswith('.site'):
        return True
    return False


def _candidates(title, original_title, titles):
    out = []
    for t in [title, original_title] + list(titles or []):
        c = clean_title(t or '')
        if c and c not in out:
            out.append(c)
    return out


def resolve_episode(title='', original_title='', titles=None, season=1, episode=1):
    cands = _candidates(title, original_title, titles)
    if not cands:
        return {'success': False, 'error': 'Query required'}
    for q in cands[:3]:
        items = search(q)
        for item in items:
            if not isinstance(item, dict):
                continue
            series_id = item.get('object_id')
            slug = item.get('used_slug') or ''
            if not series_id:
                continue
            # Sadece dizi sonuclari (Cloudstream TvSeries filtresi)
            used_type = (item.get('used_type') or '').lower()
            if used_type and used_type not in ('series', 'serie', 'dizi', 'tvseries'):
                continue
            if slug and not slug.startswith('dizi/') and '/dizi' not in slug:
                # Dizilla slug'lari dizi/ ile baslar; film kaydiysa atla
                pass
            ep_id = _episode_id_for(series_id, season, episode)
            if not ep_id:
                continue
            sources = _episode_sources(ep_id)
            if not sources:
                continue
            # Dil basina TEK en iyi kaynak (Cloudstream distinctBy dengi):
            # PUB / PUB+ / PUB++ ayni oynatici ailesinin etiket farkidir,
            # uc ayri buton kafa karistirir. HLS master > duvar-disi iframe.
            best = {}
            for src in sources:
                if not isinstance(src, dict):
                    continue
                # Fragman kaydi bolum kaynagi degildir (yanlis buton olmasin).
                sname = (src.get('source_name') or '').strip()
                if sname.lower().startswith('fragman') or 'fragman' in (src.get('language_name') or '').lower():
                    continue
                iframe = _extract_iframe_src(src.get('source_content') or '')
                if not iframe:
                    continue
                lang = (src.get('language_name') or '').lower()
                label = 'Dublaj' if ('dublaj' in lang or 'dub' in lang) else 'Altyazı'
                master = _resolve_iframe(iframe)
                if master and master.startswith('http'):
                    cand = {
                        'provider': 'Dizilla',
                        'streamUrl': proxied(master, 'https://pichive.online/'),
                        'rawStreamUrl': master,
                        'embedUrl': f"{BASE}/{slug}" if slug else f"{BASE}/",
                        'isHls': True,
                        'subtitles': [],
                        'language': label,
                        'quality': src.get('quality_name') or '1080P',
                    }
                    # HLS her zaman iframe yedegini dover.
                    best[label] = cand
                    continue
                # Cozum uretilemedi: duvarli host iframe'i sunucudan gomulemez
                # (X-Frame-Options: SAMEORIGIN -> "baglanmayi reddetti").
                # ANCAK oynatma sunucuda degil kullanicinin tarayicisinda olur:
                # ev/mobil IP + gercek tarayici challenge'i cogu zaman gecer.
                # Hic kaynak listelememek yerine iframe yedegi birakilir;
                # HLS varsa o kazanir (asagida best[label] ezmesi korunur).
                if _is_walled_iframe(iframe):
                    if label not in best:
                        best[label] = {
                            'provider': 'Dizilla',
                            'streamUrl': iframe,
                            'rawStreamUrl': iframe,
                            'embedUrl': f"{BASE}/{slug}" if slug else f"{BASE}/",
                            'isIframe': True,
                            'subtitles': [],
                            'language': label,
                            'quality': src.get('quality_name') or '1080P',
                        }
                    continue
                # Duvari olculmemis host (hotlinger/playru gibi): dilde
                # henuz HLS yoksa iframe yedegi dilin temsilcisi olur.
                if label not in best:
                    best[label] = {
                        'provider': 'Dizilla',
                        'streamUrl': iframe,
                        'rawStreamUrl': iframe,
                        'embedUrl': f"{BASE}/{slug}" if slug else f"{BASE}/",
                        'isIframe': True,
                        'subtitles': [],
                        'language': label,
                        'quality': src.get('quality_name') or '1080P',
                    }
            streams = [best[k] for k in ('Dublaj', 'Altyazı') if k in best]
            if streams:
                page_url = f"{BASE}/{slug}" if slug else f"{BASE}/"
                return dict(finalize_streams(streams, page_url), provider='DIZ')
    return {'success': False, 'error': 'No playable source'}


def resolve_movie(title='', original_title='', titles=None):
    # Cloudstream Dizilla tvTypes = [TvSeries] ONLY. Film destegi yok.
    return {'success': False, 'error': 'Dizilla is series-only'}

"""Webteizle ozel resolver: slug sayfa -> alternatifler -> embed cozum.
Her player ayri kaynak (VidMoly/Filemoon/Pixel/Okru etiketli, anonim).
Cookie jar ile 3 adimli akis korunur."""
import sys
import os
import re
import time
import http.cookiejar
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from providers.base import FULL_UA, clean_title, finalize_streams  # noqa: E402

BASE = 'https://webteizle.info'
REF = BASE + '/'

# Vercel IP'si engellenirse son basamak: CF Worker gecidi (base.py ile ayni).
CF_WORKER_GATEWAY = 'https://wild-credit-e1ae.cagatayca07.workers.dev'


def _worker_fetch(url, referer, form=None, timeout=8):
    try:
        gateway = CF_WORKER_GATEWAY + '?url=' + urllib.parse.quote(url, safe='')
        headers = {'User-Agent': FULL_UA, 'Accept': '*/*', 'Referer': referer or (BASE + '/')}
        body = None
        if form is not None:
            body = urllib.parse.urlencode(form).encode('utf-8')
            headers['Content-Type'] = 'application/x-www-form-urlencoded'
            headers['X-Requested-With'] = 'XMLHttpRequest'
        req = urllib.request.Request(gateway, data=body, headers=headers,
                                     method='POST' if body is not None else 'GET')
        with urllib.request.urlopen(req, timeout=max(4, min(int(timeout or 8), 15))) as r:
            if r.status != 200:
                return ''
            return r.read().decode('utf-8', errors='ignore')
    except Exception:
        return ''


def _slug(t):
    t = (t or '').lower().strip()
    for a, b in (('ğ', 'g'), ('ü', 'u'), ('ş', 's'), ('ı', 'i'), ('ö', 'o'), ('ç', 'c')):
        t = t.replace(a, b)
    t = re.sub(r'[^\w\s-]', ' ', t)
    return re.sub(r'\s+', '-', t).strip().strip('-')


# SezonlukDizi ile ayni mantik: her player sekmesi ayri anonim kaynak.
# Sitedeki baslik varyasyonlarini kanonik isimlere normalize et.
CANONICAL_PROVIDERS = {
    'vidmoly': 'VidMoly',
    'filemoon': 'Filemoon',
    'pixel': 'Pixel',
    'okru': 'Okru',
    'closeload': 'CloseLoad',
    'close': 'CloseLoad',
    'rapidrame': 'Rapidrame',
    'rapid': 'Rapid',
    'netu': 'Netu',
}


def _canon_provider(raw, fallback='Player'):
    low = re.sub(r'[^a-z0-9]+', '', (raw or '').lower())
    if low in CANONICAL_PROVIDERS:
        return CANONICAL_PROVIDERS[low]
    return (raw or fallback).strip()[:24] or fallback


def _curl_fallback(url, referer, form=None, timeout=8):
    """urllib TLS parmak izi engellenirse (RST/403) sistem curl'u dene."""
    try:
        import shutil
        import subprocess
        if not shutil.which('curl'):
            return ''
        cmd = ['curl', '-4', '-sL', '--compressed',
               '--connect-timeout', '4', '--max-time', str(max(4, min(int(timeout or 8), 12))),
               '-A', FULL_UA, '-e', referer or (BASE + '/')]
        if form is not None:
            cmd += ['-X', 'POST', '--data-raw', urllib.parse.urlencode(form),
                    '-H', 'Content-Type: application/x-www-form-urlencoded',
                    '-H', 'X-Requested-With: XMLHttpRequest']
        cmd.append(url)
        out = subprocess.run(cmd, capture_output=True, timeout=(int(timeout or 8) + 3))
        if out.returncode != 0:
            return ''
        return (out.stdout or b'').decode('utf-8', errors='ignore')
    except Exception:
        return ''


def _opener():
    cj = http.cookiejar.CookieJar()
    return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))


def _get(op, url, referer, timeout=8):
    # curl birincil (hizli), urllib (cookie jar) yedek, worker son basamak
    curled = _curl_fallback(url, referer, timeout=timeout)
    if curled and len(curled) > 200:
        return curled
    try:
        req = urllib.request.Request(url, headers={'User-Agent': FULL_UA, 'Referer': referer,
                                                   'Accept': 'text/html,application/xhtml+xml'})
        with op.open(req, timeout=timeout) as r:
            direct = r.read().decode('utf-8', errors='ignore')
            if direct:
                return direct
    except Exception:
        pass
    if curled:
        return curled
    proxied = _worker_fetch(url, referer, timeout=timeout)
    return proxied if proxied else ''


def _post(op, url, referer, form, timeout=8):
    # curl birincil, urllib yedek, worker son basamak
    curled = _curl_fallback(url, referer, form=form, timeout=timeout)
    if curled:
        return curled
    try:
        body = urllib.parse.urlencode(form).encode('utf-8')
        req = urllib.request.Request(url, data=body, method='POST',
                                     headers={'User-Agent': FULL_UA, 'Referer': referer,
                                              'Content-Type': 'application/x-www-form-urlencoded',
                                              'X-Requested-With': 'XMLHttpRequest'})
        with op.open(req, timeout=timeout) as r:
            return r.read().decode('utf-8', errors='ignore')
    except Exception:
        pass
    return _worker_fetch(url, referer, form=form, timeout=timeout)


def _player_url(embed_html):
    m = re.search(r'''vidmoly\(['"]([^'"]+)['"]''', embed_html, re.I)
    if m:
        return f"https://vidmoly.to/embed-{m.group(1)}.html", 'VidMoly'
    m = re.search(r'''filemoon\(['"]([^'"]+)['"]''', embed_html, re.I)
    if m:
        return f"https://bysezoxexe.com/e/{m.group(1)}", 'Filemoon'
    m = re.search(r'''pixel\(['"]([^'"]+)['"]''', embed_html, re.I)
    if m:
        return f"https://pixeldrain.com/u/{m.group(1).split('|')[0]}", 'Pixel'
    m = re.search(r'''okru\(['"]([^'"]+)['"]''', embed_html, re.I)
    if m:
        return f"https://ok.ru/videoembed/{m.group(1)}", 'Okru'
    m = re.search(r'<iframe[^>]+src=["\']([^"\']+)["\']', embed_html, re.I)
    if m and 'reCAPTCHADATA' not in m.group(1):
        u = m.group(1)
        return (u if u.startswith('http') else 'https:' + u), 'Embed'
    return None, ''


def _try_query(op, query, is_dub):
    slug = _slug(clean_title(query))
    if not slug:
        return []
    for dil in (['dublaj', 'altyazi'] if is_dub else ['altyazi', 'dublaj']):
        watch = f"{BASE}/izle/{dil}/{slug}"
        try:
            html = _get(op, watch, REF + '')
        except Exception:
            continue
        if not html or 'data-id' not in html:
            continue
        m = (re.search(r'id=["\']dilsec["\'][^>]*data-id=["\'](\d+)["\']', html, re.I)
             or re.search(r'data-id=["\'](\d+)["\']', html, re.I))
        if not m:
            continue
        try:
            import json
            alt = json.loads(_post(op, f"{BASE}/ajax/dataAlternatif3.asp", watch,
                                   {'filmid': m.group(1), 'dil': '0' if dil == 'dublaj' else '1',
                                    's': '', 'b': '', 'bot': '0'}))
        except Exception:
            continue
        if not isinstance(alt, dict) or alt.get('status') != 'success':
            continue
        out = []
        for item in (alt.get('data') or [])[:6]:
            if not isinstance(item, dict) or not item.get('id'):
                continue
            try:
                emb = _post(op, f"{BASE}/ajax/dataEmbed.asp", watch, {'id': str(item['id'])})
            except Exception:
                continue
            if not emb:
                continue
            url, kind = _player_url(emb)
            if not url:
                continue
            prov = _canon_provider(item.get('baslik') or kind or 'Player')
            out.append({
                'provider': prov,
                'streamUrl': url,
                'rawStreamUrl': url,
                'embedUrl': url,
                'isIframe': True,
                'subtitles': [],
            })
        if out:
            return out
    return []


def resolve_movie(title='', original_title='', titles=None, want_dub=None):
    cands = [t for t in [title, original_title] + list(titles or []) if t and str(t).strip()]
    if not cands:
        return {'success': False, 'error': 'Query required'}
    for is_dub in ([True, False] if want_dub is None else [bool(want_dub)]):
        op = _opener()
        for q in cands[:3]:
            streams = _try_query(op, q, is_dub)
            if streams:
                return dict(finalize_streams(streams, f"{BASE}/"), provider='WTZ')
    return {'success': False, 'error': 'No playable source'}

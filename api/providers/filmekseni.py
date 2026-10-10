"""FilmEkseni ozel resolver: arama API -> sayfa -> videoPlayerData -> VidMoly/Eksenload.
Site duvarsizdir (CF yok, JSON arama API acik); o yuzden dogrudan backend
cozumu hem hizli hem stabil. VidMoly embed'den master.m3u8 cekilir, VIP
(Eksenload) iframe yedegi birakilir. Hizli vuruslarda 429 attigi icin
istek aralarinda kisa bekleme vardir."""
import sys
import os
import re
import json
import time
import base64
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from providers.base import fetch_html, clean_title, proxied, finalize_streams  # noqa: E402

BASE = 'https://filmekseni.vip'
REF = BASE + '/'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

_API_HEADERS = {'User-Agent': UA, 'Referer': REF, 'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'}


def _norm(t):
    t = (t or '').lower().strip()
    for a, b in (('ğ', 'g'), ('ü', 'u'), ('ş', 's'), ('ı', 'i'), ('ö', 'o'), ('ç', 'c')):
        t = t.replace(a, b)
    return re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9\s]', ' ', t)).strip()


def _api_search(query):
    import urllib.request
    url = BASE + '/api/search?q=' + urllib.parse.quote(query or '')
    for _ in range(2):
        try:
            req = urllib.request.Request(url, headers=_API_HEADERS)
            with urllib.request.urlopen(req, timeout=8) as resp:
                if resp.status == 429:
                    time.sleep(1.2)
                    continue
                data = json.loads(resp.read().decode('utf-8', errors='ignore'))
                if isinstance(data, dict) and isinstance(data.get('data'), list):
                    return data['data']
                return []
        except Exception:
            time.sleep(0.6)
    return []


def _match(items, cands, rtype, year=None):
    out = []
    for it in items or []:
        if not isinstance(it, dict):
            continue
        title = str(it.get('title') or '')
        slug = str(it.get('slug') or '').strip('/')
        ctype = str(it.get('contentableType') or '')
        is_series = 'series' in ctype.lower()
        if (rtype == 'movie' and is_series) or (rtype != 'movie' and not is_series):
            continue
        try:
            item_year = int(it.get('releaseYear') or 0)
        except Exception:
            item_year = 0
        if year and item_year and abs(item_year - int(year)) > 1:
            continue
        if any(_norm(c) and _norm(c) == _norm(title) for c in cands):
            prefix = '' if slug.startswith(('dizi/', 'film/')) or '/' in slug else ('dizi/' if is_series else '')
            out.append({'title': title, 'url': f"{BASE}/{prefix}{slug}/" if prefix else f"{BASE}/{slug}/"})
    return out


def _player_data(html):
    """videoPlayerData(JSON.parse('...')) -> dict. \u0022 kacislari cozulur."""
    try:
        start = html.find("JSON.parse('")
        if start < 0:
            return {}
        start += len("JSON.parse('")
        end = html.find("')", start)
        if end < 0:
            return {}
        return json.loads(html[start:end].encode().decode('unicode_escape'))
    except Exception:
        return {}


def _vidmoly_master(embed_url):
    try:
        html = fetch_html(embed_url, REF, timeout=8)
        if not html:
            return ''
        m = re.search(r'https?://[^\s"\'<>]+\.m3u8[^\s"\'<>]*', html)
        return m.group(0) if m else ''
    except Exception:
        return ''


def _resolve_page(page_url, want_dub=None):
    html = fetch_html(page_url, page_url, timeout=8)
    if not html or len(html) < 1000:
        return []
    data = _player_data(html)
    if not data:
        return []
    streams = []
    subs = []
    for m in re.finditer(r'<track[^>]+src=["\']([^"\']+)["\'][^>]*>', html, re.I):
        lab = re.search(r'label=["\']([^"\']+)["\']', m.group(0), re.I)
        subs.append({'label': lab.group(1) if lab else 'Türkçe', 'src': m.group(1)})
    for _group, players in data.items():
        if not isinstance(players, list):
            continue
        for p in players:
            if not isinstance(p, dict):
                continue
            link = str(p.get('link') or '')
            svc = str(p.get('service_name') or p.get('service_slug') or 'Player')
            tpl = str(p.get('template') or '')
            embed_url = ''
            if tpl:
                try:
                    raw = base64.b64decode(tpl).decode('utf-8', errors='ignore')
                    m = re.search(r'(?:data-src|src)=["\']([^"\']+)["\']', raw)
                    if m:
                        embed_url = m.group(1).replace('{url}', link)
                        if embed_url.startswith('//'):
                            embed_url = 'https:' + embed_url
                except Exception:
                    pass
            if 'vidmoly' in (embed_url + svc).lower() or p.get('service_slug') == 'moly':
                target = embed_url
                if not target and link.startswith('http'):
                    target = link
                if target and 'vidmoly' not in target.lower() and link and not link.startswith('http'):
                    target = f"https://vidmoly.net/embed-{link}.html"
                master = _vidmoly_master(target) if target else ''
                if master:
                    streams.append({
                        'provider': 'FilmEkseni VidMoly',
                        'streamUrl': proxied(master, 'https://vidmoly.net/'),
                        'rawStreamUrl': master,
                        'embedUrl': target,
                        'isHls': True,
                        'subtitles': subs,
                        'tag': 'vidmoly',
                    })
                elif target:
                    streams.append({
                        'provider': 'FilmEkseni VidMoly',
                        'streamUrl': target,
                        'rawStreamUrl': target,
                        'embedUrl': target,
                        'isIframe': True,
                        'subtitles': subs,
                        'tag': 'vidmoly',
                    })
                time.sleep(0.3)
            elif embed_url:
                streams.append({
                    'provider': f"FilmEkseni {svc}",
                    'streamUrl': embed_url,
                    'rawStreamUrl': embed_url,
                    'embedUrl': embed_url,
                    'isIframe': True,
                    'subtitles': subs,
                    'tag': 'eksen',
                })
    return streams


def _candidates(title, original_title, titles):
    out = []
    for t in [title, original_title] + list(titles or []):
        c = clean_title(t or '')
        if c and c not in out:
            out.append(c)
    return out


def resolve_movie(title='', original_title='', titles=None, year=None):
    cands = _candidates(title, original_title, titles)
    if not cands:
        return {'success': False, 'error': 'Query required'}
    for q in cands[:3]:
        for hit in _match(_api_search(q), cands, 'movie', year):
            streams = _resolve_page(hit['url'])
            if streams:
                return dict(finalize_streams(streams, hit['url']), provider='FXS')
        time.sleep(0.4)
    return {'success': False, 'error': 'No playable source'}


def resolve_episode(title='', original_title='', titles=None, season=1, episode=1, year=None):
    cands = _candidates(title, original_title, titles)
    if not cands:
        return {'success': False, 'error': 'Query required'}
    try:
        s_num, e_num = int(season or 1), int(episode or 1)
    except Exception:
        s_num, e_num = 1, 1
    for q in cands[:3]:
        for hit in _match(_api_search(q), cands, 'tv', year):
            base = hit['url'].rstrip('/')
            for ep_url in (f"{base}/sezon-{s_num}/bolum-{e_num}",
                           hit['url']):
                streams = _resolve_page(ep_url)
                if streams:
                    return dict(finalize_streams(streams, ep_url), provider='FXS')
                time.sleep(0.3)
        time.sleep(0.4)
    return {'success': False, 'error': 'No playable source'}

"""CanliTV (canlitv.you) ozel resolver: liste + kanal cozumu.
Zincir: /televizyonlar -> kanal sayfasi -> /player/index.php?id= -> jwplayer m3u8.
Imza (hash) her istekte tazelenir; liste 12 saat cache'lenir."""
import sys
import os
import re
import time
from urllib.parse import urljoin, urlsplit

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from providers.base import fetch_html, proxied, FULL_UA  # noqa: E402

BASE = 'https://www.canlitv.you'
REF = BASE + '/'

KAT_MAP = {
    'genel': 'national',
    'haber': 'news',
    'spor': 'sports',
    'belgesel': 'doc',
    'cocuk': 'kids',
}

_list_cache = {'at': 0, 'data': []}
LIST_TTL = 12 * 3600


def _abs_logo(src):
    if not src:
        return ''
    return urljoin(BASE + '/', src)


def list_channels(force=False):
    now = time.time()
    if not force and _list_cache['data'] and now - _list_cache['at'] < LIST_TTL:
        return _list_cache['data']
    html = ''
    for attempt in range(3):
        html = fetch_html(f"{BASE}/televizyonlar", REF, timeout=12)
        if html and "<li class='ft_" in html:
            break
        time.sleep(2 + attempt * 2)
    out = []
    if html:
        for li in re.findall(r"<li class='ft_.*?</li>", html, re.S):
            m = re.search(r'<a href="(/[^"]+)"[^>]*title="([^"]*canl[^"]*)"[^>]*>([^<]+)</a>', li, re.I)
            if not m:
                m = re.search(r'<a href="(/[^"]+)"[^>]*>([^<]{2,50})</a>', li)
                if not m:
                    continue
                href, name = m.group(1), m.group(2).strip()
            else:
                href, name = m.group(1), m.group(3).strip() or m.group(2).strip()
            if not href or '.' in href.split('/')[-1] or href.startswith('/blog'):
                continue
            if href in ('/tr', '/tr/'):
                continue
            if any(x in href for x in ['/rating', '/yayin-akisi', '/favoriler', '/kameralar',
                                       '/televizyonlar', '/online', '-kanallari']):
                continue
            kat_m = re.search(r'data-kat="([^"]+)"', li)
            kat = kat_m.group(1) if kat_m else ''
            img_m = re.search(r'<img[^>]*src="([^"]+)"', li)
            channel_id = re.search(r'\bft_(\d+)\b', li)
            name = re.sub(r'\s+', ' ', name).strip()
            if not name or len(name) > 60:
                continue
            out.append({
                'slug': urlsplit(href).path.strip('/'),
                'playerId': channel_id.group(1) if channel_id else '',
                'name': name,
                'category': KAT_MAP.get(kat, 'canlitv'),
                'group': kat,
                'logo': _abs_logo(img_m.group(1)) if img_m else (f'{BASE}/kanal/logo/100/{channel_id.group(1)}.jpg' if channel_id else ''),
            })
    seen = set()
    uniq = []
    for c in out:
        if c['slug'] not in seen:
            seen.add(c['slug'])
            uniq.append(c)
    _list_cache['at'] = now
    _list_cache['data'] = uniq
    return uniq


def resolve_channel(slug, player_id=''):
    slug = (slug or '').strip().strip('/')
    if not re.fullmatch(r'[a-z0-9-]+', slug):
        return {'success': False, 'error': 'Gecersiz kanal'}
    page_url = f"{BASE}/{slug}"
    pid = str(player_id) if re.fullmatch(r'\d{1,8}', str(player_id)) else ''
    if not pid:
        pid = next((c.get('playerId', '') for c in _list_cache['data'] if c['slug'] == slug), '')
    if not pid:
        html = fetch_html(page_url, REF, timeout=6)
        m = re.search(r'/player/index\.php\?id=(\d+)|online\.php\?sayfa=(\d+)', html)
        if not m:
            return {'success': False, 'error': 'Player bulunamadi'}
        pid = m.group(1) or m.group(2)
    phtml = fetch_html(f"{BASE}/player/index.php?id={pid}&mobile=0", page_url, timeout=6)
    if not phtml:
        return {'success': False, 'error': 'Player erisimi yok'}
    youtube = re.search(r'https://(?:www\.)?youtube\.com/embed/([a-zA-Z0-9_-]{11})', phtml)
    iframe = re.search(r'<iframe[^>]+src=[\"\'](https://[^\"\']+)', phtml)
    watch = re.search(r'<a[^>]+href=[\"\'](https://[^\"\']+)[\"\'][^>]+title=[\"\'][^\"\']*canlı yayını', phtml)
    if youtube:
        embed = f"https://www.youtube.com/embed/{youtube.group(1)}?autoplay=1&playsinline=1&rel=0"
        return {'success': True, 'kind': 'youtube', 'embedUrl': embed, 'streams': [{'provider': 'CanliTV', 'embedUrl': embed}], 'movieUrl': page_url}
    if iframe:
        embed = iframe.group(1).replace('&amp;', '&')
        return {'success': True, 'kind': 'embed', 'embedUrl': embed, 'streams': [{'provider': 'CanliTV', 'embedUrl': embed}], 'movieUrl': page_url}
    if watch and 'tabii.com/' not in watch.group(1):
        return {'success': True, 'kind': 'external', 'externalUrl': watch.group(1), 'streams': [], 'movieUrl': page_url}
    fm = re.search(r"file[\"']?\s*[:=]\s*[\"'](https?://[^\"']+\.m3u8[^\"']*)[\"']", phtml)
    ref = REF
    kind = 'hls'
    if fm:
        raw = fm.group(1).replace('&amp;', '&')
    elif re.search(r'tabii\.com/tr/watch/live/trt1(?:[?\"\'/]|$)', phtml):
        raw = 'https://tv-trt1.medya.trt.com.tr/master.m3u8'
        ref = 'https://www.trt1.com.tr/'
        kind = 'tabii-public'
    else:
        return {'success': False, 'error': 'Bu kanal dogrudan yayin vermiyor'}
    stream = proxied(raw, ref) + '&live=1'
    return {
        'success': True, 'kind': kind,
        'streams': [{'provider': 'CanliTV', 'streamUrl': stream,
                     'rawStreamUrl': raw, 'embedUrl': page_url, 'subtitles': []}],
        'streamUrl': stream, 'rawStreamUrl': raw,
        'movieUrl': page_url, 'subtitles': [], 'provider': 'CTV',
    }

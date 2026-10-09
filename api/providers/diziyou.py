"""Diziyou ozel resolver: bolum URL adaylari -> baslik eslesme -> player id.
Donus: proxy'li m3u8 + player embed (ayri kaynaklar, kosullu)."""
import sys
import os
import re
import unicodedata

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from providers.base import fetch_html, proxied, finalize_streams, clean_title  # noqa: E402

BASE = 'https://www.diziyou.one'
REF = BASE + '/'
STORE = 'https://storage.diziyou.one'


def _slug(t):
    t = unicodedata.normalize('NFKD', str(t or '')).encode('ascii', 'ignore').decode('ascii')
    t = t.lower().strip()
    t = re.sub(r'[^a-z0-9\s-]', '', t)
    return re.sub(r'-+', '-', re.sub(r'[\s_]+', '-', t)).strip('-')


def _norm(t):
    t = unicodedata.normalize('NFKD', str(t or '')).encode('ascii', 'ignore').decode('ascii')
    return re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9\s]', ' ', t.lower())).strip()


def _title_match(page_title, cands):
    pt = _norm(page_title)
    for c in cands:
        n = _norm(c)
        if n and (n == pt or n in pt):
            return True
    return False


def _page_title(html):
    m = re.search(r'<title>(.*?)</title>', html or '', re.S | re.I)
    return re.sub(r'\s+', ' ', (m.group(1) if m else '')).strip()


def _paths(slug, s_num, ep_num):
    return [
        f"/{slug}-{s_num}-sezon-{ep_num}-bolum/",
        f"/{slug}2-{s_num}-sezon-{ep_num}-bolum/",
        f"/{slug}-{s_num}-sezon-{ep_num}-bolum-izle/",
        f"/dizi/{slug}-{s_num}-sezon-{ep_num}-bolum/",
    ]


def _fetch_page(path):
    html = fetch_html(BASE + path, REF, timeout=8)
    if html and len(html) > 500:
        return html
    return ''


def resolve_episode(title='', original_title='', titles=None, season=1, episode=1):
    s_num, ep_num = int(season or 1), int(episode or 1)
    cands = [t for t in [title, original_title] + list(titles or []) if t and str(t).strip()]
    if not cands:
        return {'success': False, 'error': 'Query required'}
    seen_paths = []
    for t in cands:
        slug = _slug(clean_title(t))
        if not slug:
            continue
        for p in _paths(slug, s_num, ep_num):
            if p not in seen_paths:
                seen_paths.append(p)
    pages = []
    for p in seen_paths[:12]:
        html = _fetch_page(p)
        if html:
            pages.append((BASE + p, html))
    if not pages:
        for q in cands[:2]:
            import urllib.parse
            shtml = fetch_html(f"{BASE}/?s={urllib.parse.quote(q)}", REF, timeout=8)
            if not shtml:
                continue
            rx = re.compile(r'href="([^"]*(?:%d-sezon-%d-bolum|bolum)[^"]*)"' % (s_num, ep_num), re.I)
            for link in [m.group(1) for m in rx.finditer(shtml)][:3]:
                full = link if link.startswith('http') else BASE + (link if link.startswith('/') else '/' + link)
                html = fetch_html(full, REF, timeout=8)
                if html and len(html) > 500:
                    pages.append((full, html))
                    break
            if pages:
                break
    for page_url, html in pages:
        if not _title_match(_page_title(html), cands):
            continue
        pid_m = re.search(r'/player/(\d+)\.html', html, re.I)
        iframe_m = re.search(r'<iframe[^>]+src=["\']([^"\']*(?:player|embed)[^"\']*)["\']', html, re.I)
        streams = []
        if pid_m:
            pid = pid_m.group(1)
            m3u8 = f"{STORE}/episodes/{pid}/play.m3u8"
            streams.append({
                'provider': 'Diziyou',
                'streamUrl': proxied(m3u8, REF),
                'rawStreamUrl': m3u8,
                'embedUrl': m3u8,
                'subtitles': [],
            })
            pembed = f"{BASE}/player/{pid}.html"
            streams.append({
                'provider': 'Diziyou VIP',
                'streamUrl': pembed,
                'rawStreamUrl': pembed,
                'embedUrl': pembed,
                'subtitles': [],
            })
            return dict(finalize_streams(streams, page_url), provider='DYU')
        if iframe_m:
            src = iframe_m.group(1)
            if src.startswith('//'):
                src = 'https:' + src
            streams.append({
                'provider': 'Diziyou VIP',
                'streamUrl': src,
                'rawStreamUrl': src,
                'embedUrl': src,
                'subtitles': [],
            })
            return dict(finalize_streams(streams, page_url), provider='DYU')
    return {'success': False, 'error': 'No playable source'}

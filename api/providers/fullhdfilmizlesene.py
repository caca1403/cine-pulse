"""FullHDFilmizlesene ozel resolver (Cloudstream FullHDFilmizlesene mantigi).
scx = {"atom": {"tt": "...", "sx": {"p": [], "t": [...]}}, "order": 1} desifreleme:
Caesar rotasyon (order mod 26) + Base64 cozumu -> RapidVid / video akisi.
RapidVid: av('...') ve file: '...' uzerinden 1080p master akisi ve altyazilar."""
import sys
import os
import re
import time
import json
import base64
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from providers.base import fetch_html, clean_title, proxied, finalize_streams  # noqa: E402

BASE = 'https://www.fullhdfilmizlesene.now'
REF = BASE + '/'
_LAST_DOMAIN_SYNC = 0
_DOMAINS_URL = 'https://raw.githubusercontent.com/manitux-app/cs-plugins/main/domains.json'


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
            d = data.get('fullhdfilmizlesene') or data.get('FullHDFilmizlesene')
            if d and d.startswith('http'):
                BASE = d.rstrip('/')
                REF = BASE + '/'
    except Exception:
        pass


def scx_decode(t_str, order):
    """ScxDecoder mantigi: Caesar rotasyon (order mod 26) + Base64 cozumu."""
    if not t_str:
        return None
    try:
        order = int(order or 0) % 26
        rotated = []
        for c in t_str:
            if 'a' <= c <= 'z':
                rotated.append(chr((ord(c) - ord('a') - order) % 26 + ord('a')))
            elif 'A' <= c <= 'Z':
                rotated.append(chr((ord(c) - ord('A') - order) % 26 + ord('A')))
            else:
                rotated.append(c)
        rot_str = ''.join(rotated)
        dec = base64.b64decode(rot_str).decode('utf-8', errors='ignore')
        if dec.startswith('//'):
            dec = 'https:' + dec
        return dec
    except Exception:
        return None


def decode_rapidvid_av(token):
    """RapidVid av('...') token cozumu."""
    if not token:
        return None
    try:
        clean = token.replace('+/=', '').replace('K9L', '')
        return base64.b64decode(clean).decode('utf-8', errors='ignore')
    except Exception:
        return None


def resolve_rapidvid(embed_url, page_ref=None):
    """rapidvid.net iframe'ini cozup m3u8 veya direct master.txt akisini cikarir."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Referer': page_ref or REF
        }
        html = fetch_html(embed_url, page_ref or REF, timeout=8)
        if not html:
            return None

        # 1. file: "..." veya src: "..."
        file_m = re.search(r'["\']?file["\']?\s*:\s*["\']([^"\']+)["\']', html)
        video_url = None
        if file_m:
            video_url = file_m.group(1).replace('\\/', '/')

        # 2. av("...") fonksiyon cagrisi
        if not video_url:
            av_m = re.search(r'\bav\(\s*["\']([^"\']+)["\']\s*\)', html)
            if av_m:
                video_url = decode_rapidvid_av(av_m.group(1))

        if not video_url or not video_url.startswith('http'):
            # Dogrudan m3u8 veya master.txt var mi?
            m_txt = re.search(r'https?://[^\s"\'<>]+\.(?:m3u8|txt)(?:\?[^\s"\'<>]*)?', html)
            if m_txt:
                video_url = m_txt.group(0)

        if not video_url or not video_url.startswith('http'):
            return None

        # Altyazilar
        subs = []
        for sm in re.finditer(r'["\']?file["\']?\s*:\s*["\']([^"\']+\.vtt)["\'][^}]*["\']?label["\']?\s*:\s*["\']([^"\']+)["\']', html):
            subs.append({'label': sm.group(2), 'src': sm.group(1).replace('\\/', '/')})

        return {
            'video_url': video_url,
            'is_hls': '.m3u8' in video_url or '.txt' in video_url,
            'subtitles': subs
        }
    except Exception:
        return None


def search(query):
    _sync_domain()
    # Arama URL'i: /arama/{query} veya /?s={query}
    clean_q = re.sub(r'[^a-zA-Z0-9\s]', '', query).strip().replace(' ', '+')
    for endpoint in [f"{BASE}/arama/{clean_q}", f"{BASE}/?s={clean_q}"]:
        html = fetch_html(endpoint, REF, timeout=8)
        if not html:
            continue
        links = []
        for m in re.finditer(r'href=["\'](https://www\.fullhdfilmizlesene\.[a-z]+/film/[^"\']+)["\']', html):
            u = m.group(1)
            if u not in links:
                links.append(u)
        if links:
            return links
    return []


def _resolve_film_page(page_url):
    html = fetch_html(page_url, REF, timeout=8)
    if not html:
        return []

    streams = []
    # scx = {"atom": {"tt": "...", "sx": {"p": [], "t": [...]}}, "order": 1};
    scx_m = re.search(r'\bscx\s*=\s*(\{.*?\})\s*;', html)
    if scx_m:
        try:
            scx_data = json.loads(scx_m.group(1))
            order = scx_data.get('order', 0)
            sx = scx_data.get('atom', {}).get('sx', {})
            t_list = sx.get('t', [])
            p_list = sx.get('p', [])

            for idx, t_val in enumerate(t_list):
                decoded_url = scx_decode(t_val, order)
                if not decoded_url or not decoded_url.startswith('http'):
                    continue

                label = p_list[idx] if idx < len(p_list) else 'FullHDFilm'
                if 'rapidvid' in decoded_url:
                    rv_info = resolve_rapidvid(decoded_url, page_url)
                    if rv_info and rv_info.get('video_url'):
                        v_url = rv_info['video_url']
                        streams.append({
                            'provider': f"FullHDFilm ({label})",
                            'streamUrl': proxied(v_url, 'https://rapidvid.net/'),
                            'rawStreamUrl': v_url,
                            'embedUrl': decoded_url,
                            'isHls': rv_info['is_hls'],
                            'subtitles': rv_info['subtitles']
                        })
                    else:
                        streams.append({
                            'provider': f"FullHDFilm ({label})",
                            'streamUrl': decoded_url,
                            'rawStreamUrl': decoded_url,
                            'embedUrl': decoded_url,
                            'isIframe': True,
                            'subtitles': []
                        })
                else:
                    is_hls = '.m3u8' in decoded_url or '.txt' in decoded_url
                    streams.append({
                        'provider': f"FullHDFilm ({label})",
                        'streamUrl': proxied(decoded_url, REF) if is_hls else decoded_url,
                        'rawStreamUrl': decoded_url,
                        'embedUrl': decoded_url,
                        'isHls': is_hls,
                        'subtitles': []
                    })
        except Exception:
            pass

    # Yedek: iframe'leri tara
    if not streams:
        for im in re.finditer(r'<iframe[^>]+src=["\']([^"\']+)["\']', html):
            i_src = im.group(1)
            if i_src.startswith('//'):
                i_src = 'https:' + i_src
            if 'rapidvid' in i_src or 'player' in i_src:
                rv_info = resolve_rapidvid(i_src, page_url)
                if rv_info and rv_info.get('video_url'):
                    v_url = rv_info['video_url']
                    streams.append({
                        'provider': 'FullHDFilm',
                        'streamUrl': proxied(v_url, 'https://rapidvid.net/'),
                        'rawStreamUrl': v_url,
                        'embedUrl': i_src,
                        'isHls': rv_info['is_hls'],
                        'subtitles': rv_info['subtitles']
                    })
                else:
                    streams.append({
                        'provider': 'FullHDFilm',
                        'streamUrl': i_src,
                        'rawStreamUrl': i_src,
                        'embedUrl': i_src,
                        'isIframe': True,
                        'subtitles': []
                    })

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
        for page_url in search(q):
            streams = _resolve_film_page(page_url)
            if streams:
                return dict(finalize_streams(streams, page_url), provider='FHDF')
    return {'success': False, 'error': 'No playable source'}


def resolve_episode(title='', original_title='', titles=None, season=1, episode=1):
    # FullHDFilmizlesene oncelikle film sitesidir
    return {'success': False, 'error': 'FullHDFilmizlesene is movie-only'}


"""Dizisol ozel resolver: API -> tmdb eslesme -> m3u8 + alternatif player'lar.
Her player ayri kaynak (kosullu: gecerli URL'si olan listelenir)."""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from providers.base import fetch_json, proxied, finalize_streams, FULL_UA  # noqa: E402

API = 'https://dizisol.com/api'
REF = 'https://dizisol.com/'

BLOCKED = ('pichive', 'hotlinger', 'recaptcha', 'media.cm', 'cloudvideo.tv',
           'vidoza.net', 'voe.sx', 'bysejikuar', 'filemoon', 'hdfilmdelisi',
           'play.liderfilm')


def _valid(url):
    if not url or not isinstance(url, str):
        return False
    u = url.lower()
    if not (u.startswith('http://') or u.startswith('https://') or u.startswith('/api/')):
        return False
    return not any(b in u for b in BLOCKED)


def _proxy_stream(raw):
    full = f"https://dizisol.com{raw}" if raw.startswith('/api/') else raw
    return proxied(full, REF)


def _proxy_sub(raw):
    if not raw or not isinstance(raw, str):
        return ''
    if 'dizisol.com' in raw:
        return proxied(raw, REF)
    return raw


def _subs(*objs):
    out = []
    for o in objs:
        if not isinstance(o, dict):
            continue
        tr, en = o.get('subtitleTr'), o.get('subtitleEn')
        if tr:
            out.append({'label': 'Türkçe (DS)', 'src': _proxy_sub(tr)})
        if en:
            out.append({'label': 'English (DS)', 'src': _proxy_sub(en)})
    seen, uniq = set(), []
    for s in out:
        if s['src'] and s['src'] not in seen:
            seen.add(s['src'])
            uniq.append(s)
    return uniq


def _candidates(title, original_title, titles, want):
    cands = []
    for t in [title, original_title] + list(titles or []):
        if t and isinstance(t, str) and t.strip() and t.strip() not in cands:
            cands.append(t.strip())
    return cands


def _resolve_tmdb(cands, want):
    import urllib.parse
    for q in cands:
        try:
            data = fetch_json(f"{API}/movies/search?q={urllib.parse.quote(q)}", REF, timeout=5)
        except Exception:
            continue
        if not isinstance(data, list):
            continue
        for r in data:
            if isinstance(r, dict) and r.get('type') == want and r.get('tmdbId'):
                return int(r['tmdbId'])
    return None


def _build_streams(items, tag, season=None, episode=None):
    streams = []
    for i, it in enumerate(items):
        url = it['url']
        prov = it['provider']
        label = f"DS {prov} 1080p" if i else "DS 1080p (HLS)"
        if season is not None:
            label = f"{label} (S{season}B{episode})" if i else f"DS 1080p (S{season}B{episode})"
        suf = f"{tag}_{prov.lower().replace(' ', '')}_{i}"
        streams.append({
            'provider': f"DS {prov}",
            'streamUrl': _proxy_stream(url),
            'rawStreamUrl': url if url.startswith('http') else f"https://dizisol.com{url}",
            'embedUrl': url,
            'subtitles': it.get('subs', []),
            'tag': suf,
        })
    return streams


def resolve_movie(title='', original_title='', titles=None, tmdb_id=None):
    tid = int(tmdb_id) if tmdb_id else _resolve_tmdb(_candidates(title, original_title, titles, 'movie'), 'movie')
    if not tid:
        return {'success': False, 'error': 'TMDB match not found'}
    data = fetch_json(f"{API}/movies/by-tmdb/{tid}", REF, timeout=6)
    if not data:
        return {'success': False, 'error': 'Detail not found'}
    items, seen = [], set()
    if _valid(data.get('m3u8Url')):
        seen.add(data['m3u8Url'])
        items.append({'url': data['m3u8Url'], 'provider': 'VIP', 'subs': _subs(data)})
    for s in data.get('sources') or []:
        if not isinstance(s, dict) or not _valid(s.get('m3u8Url')) or s['m3u8Url'] in seen:
            continue
        seen.add(s['m3u8Url'])
        items.append({'url': s['m3u8Url'], 'provider': (s.get('provider') or 'VIP').upper(),
                      'subs': _subs(s, data)})
    if not items:
        return {'success': False, 'error': 'No playable source'}
    streams = _build_streams(items, f"mov_{tid}")
    return dict(finalize_streams(streams, f"dizisol:movie:{tid}"), provider='DS')


def resolve_episode(title='', original_title='', titles=None, tmdb_id=None, season=1, episode=1):
    s_num, ep_num = int(season or 1), int(episode or 1)
    tid = int(tmdb_id) if tmdb_id else _resolve_tmdb(_candidates(title, original_title, titles, 'tv'), 'tv')
    if not tid:
        return {'success': False, 'error': 'TMDB match not found'}
    eps = fetch_json(f"{API}/movies/by-tmdb/{tid}/episodes", REF, timeout=6)
    if not isinstance(eps, list):
        return {'success': False, 'error': 'Episodes not found'}
    target = next((e for e in eps if isinstance(e, dict)
                   and int(e.get('season') or 0) == s_num and int(e.get('episode') or 0) == ep_num), None)
    if not target:
        return {'success': False, 'error': 'Episode not found'}
    items, seen = [], set()
    if _valid(target.get('m3u8Url')):
        seen.add(target['m3u8Url'])
        items.append({'url': target['m3u8Url'], 'provider': 'VIP', 'subs': _subs(target)})
    for s in target.get('sources') or []:
        if not isinstance(s, dict) or not _valid(s.get('m3u8Url')) or s['m3u8Url'] in seen:
            continue
        seen.add(s['m3u8Url'])
        items.append({'url': s['m3u8Url'], 'provider': (s.get('provider') or 'VIP').upper(),
                      'subs': _subs(s, target)})
    if not items:
        return {'success': False, 'error': 'No playable source'}
    streams = _build_streams(items, f"tv_{tid}", s_num, ep_num)
    return dict(finalize_streams(streams, f"dizisol:tv:{tid}:s{s_num}e{ep_num}"), provider='DS')

"""Sinewix ozel resolver: panel API -> strict eslesme -> direkt video dosyalari.
Her dosya ayri kaynak (MKV / MP4 / HLS, dublaj-altyazi kosullu)."""
import sys
import os
import re

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from providers.base import fetch_json, proxied, finalize_streams, clean_title  # noqa: E402

API = 'https://ydfvfdizipanel.ru/public/api'
TOKEN = 'EuXs1Y5oXTrDpGte3E2dNDIu82LLjaoCd6om'
REF = 'https://ydfvfdizipanel.ru/'
HEADERS = {
    'hash256': 'f4d4bc98a3fc4600e7f2c2bab7533f1f03d8a70ff03c256bb11dc57050536bd0',
    'signature': '308202c3308201aba0030201020204075cec01300d06092a864886f70d01010b050030123110300e0603550403130753696e65776978301e170d3231303932313233333334395a170d3436303931353233333334395a30123110300e0603550403130753696e6577697830820122300d06092a864886f70d01010105000382010f003082010a0282010100b0a2a1bc5c3f16f19c3b2456cfd0a6128ced9f5e2e2c4cca1a100e17b07b86256258f372e76a95a17e9e4a1c048e364835723a95e8ef6d5bdfb5694b50277c65a64f7b012fdf164e5dc93629561f6ca29b7dc82ebb3d6f3c8e8fc6795847fe331ad4a13ed6c059a83804c43d3747526d769580f3a4153752eb22dac66dd15f1582caa43305dc49f55ac7b1b89013e654d2ca8c94c30956659674cc673256c04208f09118bae14cdd72d78f9ee2aece958084a8c2e315deff45726d4fc1f18ec39569ff1abe4f36a8d01090e5f68c07c28763513b88208bcac1a6e1941f6fd8bfdd52f832098ddb2154c8f565bc5d58c7106a19e03787e75c7f34997000e3bcf30203010001a321301f301d0603551d0e04160414b545fc18e74a791d9402b53940ae38b96e9e209c300d06092a864886f70d01010b05000382010100a8a64d9e7c8b5db102af15d3caf94ff8d3e9be9008bb0021117ca2f0762e68583354b126a041bb1fb6e6308e421e4b5a71f779cde63e5d2fc5976bff966c3c4034e852c077d8e74458fbae2ec1db74b1f4082e188bf8ef7c42a44e3fbfb693bb00ee2a727096b42360ddce1bdcd3536f50c8693bcc62a7b7204bcefe2ecf1f7c820bcd63e1d7a6acc8bf6163086915fc5f607cf51bc7a8635f98bb4c65a8f24b7b5a82c7b06868f565cb0d6ac4775c4aac777536ddd1a565f990fd8cbe539185fa7aab610b7855a687a00f4e55536d72873444552c50fd10727dbf298a9be6ed6ae62148dd1de365f3729915dd31975e28a472d752ac14db3db548405cc31e1e',
    'packagename': 'com.sinewix',
    'User-Agent': 'EasyPlex (Android 14; SM-A546B; Samsung Galaxy A54 5G; tr)',
    'Accept': 'application/json',
}

BLOCKED = ('mediafire.com', 'mega.nz', 'pichive', 'turbobit', 'yadi.sk')


def _get(path):
    import urllib.parse
    return fetch_json(f"{API}{path}", REF, timeout=7,
                      extra_headers=HEADERS)


def _norm(t):
    import unicodedata
    t = unicodedata.normalize('NFKD', (t or '')).encode('ascii', 'ignore').decode('ascii')
    return re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9\s]', ' ', t.lower())).strip()


def _match(query, item, year=None):
    titles = [item.get(k) for k in ('title', 'name', 'original_name', 'original_title')]
    titles = [_norm(t) for t in titles if t]
    q = _norm(query)
    if not q or not titles:
        return False
    hit = any(q == t or q in t or t in q for t in titles)
    if not hit:
        return False
    if year:
        iy = str(item.get('release_date') or item.get('first_air_date') or '')[:4]
        if iy and iy.isdigit() and abs(int(iy) - int(year)) > 1:
            return False
    return True


def _queries(title, original_title, titles):
    out = []
    for t in [title, original_title] + list(titles or []):
        c = clean_title(t or '')
        if c and c not in out:
            out.append(c)
    return out


def _classify(v):
    link = (v.get('link') or v.get('url') or '').strip()
    low = link.lower()
    lang = str(v.get('lang') or '').lower()
    is_sub = 'trsub' in low or '.sub.' in low or 'altyazi' in low or 'sub' in lang
    is_dual = 'dual' in low or 'trdub' in low or 'dual' in lang or 'tr' in lang
    return link, low, is_sub, is_dual


def _proxify(raw):
    low = raw.lower()
    if '.m3u8' in low:
        return proxied(raw, REF)
    if '.mkv' in low:
        import urllib.parse
        return f"/api/mkv_stream?url={urllib.parse.quote(raw)}&ref={urllib.parse.quote(REF)}"
    return proxied(raw, REF)


def _build(video_list, tag, want_dub=None):
    streams = []
    for i, v in enumerate(video_list or []):
        if not isinstance(v, dict):
            continue
        link, low, is_sub, is_dual = _classify(v)
        if not link or not link.startswith('http'):
            continue
        if any(b in low for b in BLOCKED):
            continue
        if want_dub is True and is_sub and not is_dual:
            continue
        if want_dub is False and not is_sub and not is_dual and 'dub' in low:
            continue
        is_mkv = '.mkv' in low
        audio = 'sub' if (is_sub and not is_dual) else ('dub' if ('dub' in low and not is_sub and not is_dual) else 'dual')
        streams.append({
            'provider': 'SWX MKV' if is_mkv else 'SWX',
            'streamUrl': _proxify(link),
            'rawStreamUrl': link,
            'embedUrl': link,
            'subtitles': [],
            'tag': f"{tag}_{i}",
            'isMkv': is_mkv,
            'audio': audio,
        })
    streams.sort(key=lambda s: (0 if not s['isMkv'] else 1))
    return streams


def _find_item(queries, is_movie, year, imdb_id=None, season=1, episode=1):
    import urllib.parse
    direct = None
    if not is_movie and imdb_id:
        d = _get(f"/search/episode-{int(episode or 1)}/imdbid-{urllib.parse.quote(str(imdb_id))}/season-{int(season or 1)}/{TOKEN}")
        if isinstance(d, dict) and (d.get('videos') or d.get('streams') or d.get('seasons') or d.get('data')):
            direct = d
    for q in queries:
        d = _get(f"/search/{urllib.parse.quote(q)}/{TOKEN}")
        items = (d or {}).get('search') or (d or {}).get('data') or []
        if not isinstance(items, list):
            continue
        pool = [it for it in items if isinstance(it, dict) and (
            (it.get('type') in ('movie', 'film')) if is_movie
            else (it.get('type') in ('serie', 'series', 'tv', 'anime')))] or items
        for it in pool:
            if isinstance(it, dict) and _match(q, it, year):
                return it, direct
    return None, direct


def resolve_movie(title='', original_title='', titles=None, year=None, want_dub=None):
    queries = _queries(title, original_title, titles)
    if not queries:
        return {'success': False, 'error': 'Query required'}
    item, _ = _find_item(queries, True, year)
    if not item or not item.get('id'):
        return {'success': False, 'error': 'Match not found'}
    import urllib.parse
    detail = _get(f"/media/detail/{item['id']}/{TOKEN}") or {}
    videos = detail.get('videos') or []
    streams = _build(videos, f"mov_{item['id']}", want_dub)
    if not streams:
        return {'success': False, 'error': 'No playable file'}
    return dict(finalize_streams(streams, f"sinewix:movie:{item['id']}"), provider='SWX')


def resolve_episode(title='', original_title='', titles=None, year=None, season=1, episode=1,
                    imdb_id=None, want_dub=None, is_anime=False):
    queries = _queries(title, original_title, titles)
    if not queries:
        return {'success': False, 'error': 'Query required'}
    s_num, ep_num = int(season or 1), int(episode or 1)
    item, direct = _find_item(queries, False, year, imdb_id, s_num, ep_num)
    videos = []
    if direct:
        videos = direct.get('videos') or direct.get('streams') or direct.get('data') or []
        if isinstance(videos, dict):
            videos = list(videos.values())
    elif item and item.get('id'):
        ep_path = 'animes' if (is_anime or item.get('type') == 'anime') else 'series'
        detail = _get(f"/{ep_path}/show/{item['id']}/{TOKEN}") or {}
        for s in detail.get('seasons') or []:
            if int(s.get('season_number') or 0) == s_num:
                for e in s.get('episodes') or []:
                    if int(e.get('episode_number') or 0) == ep_num:
                        videos = e.get('videos') or []
    if not videos:
        return {'success': False, 'error': 'Episode not found'}
    streams = _build(videos, f"tv_{item.get('id') if item else 'direct'}_s{s_num}e{ep_num}", want_dub)
    if not streams:
        return {'success': False, 'error': 'No playable file'}
    return dict(finalize_streams(streams, f"sinewix:tv:s{s_num}e{ep_num}"), provider='SWX')

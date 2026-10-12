"""Sinewix ozel resolver: panel API -> strict eslesme -> direkt video dosyalari.
Her dosya ayri kaynak (MKV / MP4 / HLS, dublaj-altyazi kosullu)."""
import sys
import os
import re

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from providers.base import fetch_json, proxied, finalize_streams, clean_title  # noqa: E402

API = 'https://ydfvfdizipanel.ru/public/api'
TOKEN = '9iQNC5HQwPlaFuJDkhncJ5XTJ8feGXOJatAA'
REF = 'https://ydfvfdizipanel.ru/'
HEADERS = {
    'hash256': '711bff4afeb47f07ab08a0b07e85d3835e739295e8a6361db77eebd93d96306b',
    'signature': '3082058830820370a00302010202145bbfbba9791db758ad12295636e094ab4b07dc24300d06092a864886f70d01010b05003074310b3009060355040613025553311330110603550408130a43616c69666f726e6961311630140603550407130d4d6f756e7461696e205669657731143012060355040a130b476f6f676c6520496e632e3110300e060355040b1307416e64726f69643110300e06035504031307416e64726f69643020170d3231313231353232303433335a180f32303531313231353232303433335a3074310b3009060355040613025553311330110603550408130a43616c69666f726e6961311630140603550407130d4d6f756e7461696e205669657731143012060355040a130b476f6f676c6520496e632e3110300e060355040b1307416e64726f69643110300e06035504031307416e64726f696430820222300d06092a864886f70d01010105000382020f003082020a0282020100a5106a24bb3f9c0aaf3a2b228f794b5eaf1757ba758b19736a39d1bdc73fc983a7237b8d5ca5156cfa999c1dab3418bbc2be0920e0ee001c8aa4812d1dae75d080f09e91e0abda83ff9a76e8384a4429f4849248069a59505b12ac2c14ba2e4d1a13afcdaf54e508697ff928a9f738e6f4a6fc27409c55329eb149b5ff89c5a2d7c06bf9e62086f955cad17d7be2623ee9d5ec56068eadc23cb0965a13ff97d49fe10ef41afc6eeca36b4ace9582097faff89f590bc831cdb3a69eec5d15b67c3f2cad49e37ed053733e3d2d400c47755b932bdbe15d749fd6ad1dce30ba5e66094dfb6ee6f64cafb807e11b19a990c5d078c6d6701cda0bdeb21e99404ff166074f4c89b04c418f4e7940db5c78647c475bcfb85d4c4e836ee7d7c1d53e9e736b5d96d4b4d8b98209064b729ac6a682d55a6a930e518d849898bb28329ca0aaa133b5e5270a9d5940cac6af4802a57fd971efda91abb602882dd6aa6ce2b236b57b52ee2481498f0cacbcc2c36c238bc84becad7eaaf1125b9a1ca9ded6c79f3f283a52050377809b2a9995d66e1636b0ed426fdd8685c47cb18e82077f4aefcc07887e1dc58b4d64be1632f0e7b4625da6f40c65a8512a6454a4b96963e7f876136e6c0069a519a79ad632078ed965aa12482458060c030ed50db706d854f88cb004630b49285d8af8b471ff8f6070687826412287b50049bcb7d1b6b62ef90203010001a310300e300c0603551d13040530030101ff300d06092a864886f70d01010b0500038202010051c0b7bd793181dc29ca777d3773f928a366c8469ecf2fa3cfb076e8831970d19bb2b96e44e8ccc647cf0696bb824ac61c23d958525d283cab26037b04d58aa79bf92192db843adf5c26a980f081d2f0e14f759fc5ff4c5bb3dce0860299bfe7b349a8155a2efaf731ba25ce796a80c1442c7bf80f8c1a7912ff0b6f6592264315337251a846460194fa594f81f38f9e5233a63201e931ad9cab5bf119f24025613f307194eaa6eb39a83f3c05a49ba34455b1aff7c6839bbb657d9392ffdf397432af6e56ba9534a8b07d7060fe09691c6cf07cb5324f67b3cc0871a8c621d81fe71d71085c55206a4f57e25f774fd4b979b299e8bb076b50fca42fa57da2d519fd35a4a7c0137babaed4345f8031b63b6a71f5e8268f709d658ccd7c2a58849379d25bfa598c3f4a2c3d9b7d89285fefeb7f0ec65137d38b08ce432a15688b624a179e6a4a505ebc3bcdfbc4d4330508ee2d8d0f016924dcec21a6838ef7d834c6f43bde4a5201ed0b3bb4e9bd377b470e36bcf5bc3d56169dbd8e39567aa7dce4d1a8a8a54a5e1aa6fb1a8aab0062669a966f96e15ccce6fe12ea5e6a8b8c8823bdc94988ca39759fd1cc8fd8ae5c3d74db50b174cf7d77655016c075c91d439ed01cc0a9f695c99fad3b5495fb6cb1e01a5fa020cc6022a85c07ec55f9eba89719f86e49d34ab5bd208c5f70cced2b7b7963c014f8404432979b506de29e',
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

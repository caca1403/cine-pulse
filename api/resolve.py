"""CinePulse ozel resolver dagitici (Cloudstream mantigi: site basina modul).
Vercel:  GET /api/resolve?provider=hdfc|dzs|snx|szd&...
Local:   python3 api/resolve.py <provider> <title> <originalTitle> <season> <episode> <type> [tmdbId] [imdbId] [isDub]
"""
import json
import os
import sys
import urllib.parse
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from providers import dizisol, sinewix, sezonlukdizi, diziyou, canlitv, setfilm, webteizle, selcukflix, fullhdfilmizlesene, dizilla, filmekseni  # noqa: E402
import hdfc_stream as _hdfc  # noqa: E402


def _str(v, default=''):
    return v if isinstance(v, str) else default


def dispatch(provider, args):
    provider = (provider or '').lower().strip()
    title = _str(args.get('title') or args.get('query'))
    original = _str(args.get('originalTitle'))
    titles = args.get('titles') or []
    season = int(args.get('season') or 1)
    episode = int(args.get('episode') or 1)
    rtype = _str(args.get('type'), 'movie').lower()
    tmdb_id = args.get('tmdbId')
    imdb_id = args.get('imdbId')
    is_dub_raw = args.get('isDub')
    want_dub = None if is_dub_raw in (None, '') else str(is_dub_raw).lower() in ('1', 'true', 'dub')

    if provider in ('hdfc', 'hdfilmcehennemi'):
        return _hdfc.resolve_hdfc_stream(title, original, season=season, episode=episode,
                                         is_tv=(rtype != 'movie'), titles=titles)
    if provider in ('dzs', 'dizisol', 'ds'):
        if rtype == 'movie':
            return dizisol.resolve_movie(title, original, titles, tmdb_id)
        return dizisol.resolve_episode(title, original, titles, tmdb_id, season, episode)
    if provider in ('snx', 'sinewix', 'swx'):
        if rtype == 'movie':
            return sinewix.resolve_movie(title, original, titles, args.get('year'), want_dub)
        return sinewix.resolve_episode(title, original, titles, args.get('year'), season, episode,
                                       imdb_id, want_dub, is_anime=(rtype == 'anime'))
    if provider in ('szd', 'sezonlukdizi', 'sezonluk'):
        if rtype == 'movie':
            return {'success': False, 'error': 'SezonlukDizi is series-only'}
        return sezonlukdizi.resolve_episode(title, original, titles, season, episode, want_dub)
    if provider in ('dyu', 'diziyou', 'diziyouone'):
        if rtype == 'movie':
            return {'success': False, 'error': 'Diziyou is series-only'}
        return diziyou.resolve_episode(title, original, titles, season, episode)
    if provider in ('ctv', 'canlitv', 'canli'):
        slug = _str(args.get('slug'))
        if slug:
            return canlitv.resolve_channel(slug, _str(args.get('playerId')))
        return {'success': True, 'channels': canlitv.list_channels()}
    if provider in ('setf', 'setfilm', 'setfilmizle'):
        if rtype == 'movie':
            return setfilm.resolve_movie(title, original, titles)
        return setfilm.resolve_episode(title, original, titles, season, episode)
    if provider in ('slc', 'selcuk', 'selcukflix'):
        if rtype == 'movie':
            return selcukflix.resolve_movie(title, original, titles)
        return selcukflix.resolve_episode(title, original, titles, season, episode)
    if provider in ('fhdf', 'fullhd', 'fullhdfilm', 'fullhdfilmizlesene'):
        if rtype != 'movie':
            return {'success': False, 'error': 'FullHDFilmizlesene is movie-only'}
        return fullhdfilmizlesene.resolve_movie(title, original, titles)
    if provider in ('wtz', 'webteizle', 'webteizleinfo'):
        # SezonlukDizi ile ayni mantik: film slug -> alternatif player'lar -> embed.
        if rtype != 'movie':
            return {'success': False, 'error': 'Webteizle is movie-only'}
        return webteizle.resolve_movie(title, original, titles, want_dub)
    if provider in ('dzl', 'dizilla'):
        # Cloudstream Dizilla tvTypes = [TvSeries]: sadece dizi.
        if rtype == 'movie':
            return {'success': False, 'error': 'Dizilla is series-only'}
        return dizilla.resolve_episode(title, original, titles, season, episode)
    if provider in ('fxs', 'filmekseni', 'film ekseni'):
        if rtype == 'movie':
            return filmekseni.resolve_movie(title, original, titles, year=args.get('year'))
        return filmekseni.resolve_episode(title, original, titles, season, episode, year=args.get('year'))
    return {'success': False, 'error': f'Unknown provider: {provider}'}


class handler(BaseHTTPRequestHandler):
    def _send(self, payload):
        ok = bool(payload.get('success'))
        body = json.dumps(payload).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'public, max-age=300' if ok else 'no-store')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)
        g = lambda k, d='': params.get(k, [d])[0]
        titles = []
        for i in range(6):
            t = params.get(f't{i}', [''])[0]
            if t:
                titles.append(t)
        args = {
            'title': g('title') or g('query'), 'originalTitle': g('originalTitle'),
            'titles': titles, 'season': g('season', '1'), 'episode': g('episode', '1'),
            'type': g('type', 'movie'), 'tmdbId': g('tmdbId') or None,
            'imdbId': g('imdbId') or None, 'isDub': g('isDub'),
            'slug': g('slug'), 'playerId': g('playerId'),
            'year': g('year') or None,
        }
        try:
            self._send(dispatch(g('provider'), args))
        except Exception as e:
            self._send({'success': False, 'error': str(e)[:200]})

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()


def main():
    if len(sys.argv) < 3:
        print(json.dumps({'success': False, 'error': 'Usage: resolve.py <provider> <title> ...'}))
        sys.exit(1)
    boolean = lambda v: None if v in (None, '', 'null') else v
    try:
        env_titles = json.loads(os.environ.get('CP_TITLES') or '[]')
    except Exception:
        env_titles = []
    args = {
        'title': sys.argv[2] if len(sys.argv) > 2 else '',
        'originalTitle': sys.argv[3] if len(sys.argv) > 3 else '',
        'season': sys.argv[4] if len(sys.argv) > 4 else '1',
        'episode': sys.argv[5] if len(sys.argv) > 5 else '1',
        'type': sys.argv[6] if len(sys.argv) > 6 else 'movie',
        'tmdbId': boolean(sys.argv[7] if len(sys.argv) > 7 else None),
        'imdbId': boolean(sys.argv[8] if len(sys.argv) > 8 else None),
        'isDub': boolean(sys.argv[9] if len(sys.argv) > 9 else None),
        'slug': sys.argv[10] if len(sys.argv) > 10 and sys.argv[10] not in ('null', '') else '',
        'titles': env_titles if isinstance(env_titles, list) else [],
    }
    try:
        print(json.dumps(dispatch(sys.argv[1], args)))
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)[:200]}))


if __name__ == '__main__':
    main()

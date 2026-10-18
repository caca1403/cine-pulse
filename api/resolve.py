"""CinePulse ozel resolver dagitici (Cloudstream mantigi: site basina modul).
Vercel:  GET /api/resolve?provider=ctv[&slug=...][&playerId=...]
Local:   python3 api/resolve.py <provider> <title> <originalTitle> <season> <episode> <type> [tmdbId] [imdbId] [isDub]
"""
import json
import os
import signal
import sys
import urllib.parse
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from providers import canlitv  # noqa: E402


def _str(v, default=''):
    return v if isinstance(v, str) else default


def dispatch(provider, args):
    """Kaynak çözücü. Eklenti/sağlayıcı katmanı söküldü: film, dizi, anime ve
    çizgi film çözücü modüller kaldırıldı. Bu uç yalnız Canlı TV kanal listesini
    ve seçilen kanalın yayın adresini döndürür."""
    provider = (provider or '').lower().strip()
    if provider in ('ctv', 'canlitv', 'canli'):
        slug = _str(args.get('slug'))
        if slug:
            return canlitv.resolve_channel(slug, _str(args.get('playerId')))
        return {'success': True, 'channels': canlitv.list_channels()}
    return {'success': False, 'error': f'Unknown provider: {provider}'}


class ResolveTimeout(BaseException):
    # BILINCLI OLARAK BaseException: saglayicilarda onlarca "except Exception"
    # bloğu var (base.py'de 17 tane). Exception'dan türetilirse zaman aşımı
    # o bloklarda yutulur ve çözümleme 25-50 saniye daha çalışmaya devam eder.
    # BaseException türevleri except Exception tarafından yakalanmaz.
    pass


# Sistemik süre bütçesi: saglayicilar kendi iclerinde birden fazla SIRALI
# istek atiyor (orn. diziyou 12 aday yol, her biri fetch_html ile ~14sn).
# Upstream yavasladiginda/aralandiginda tek bir cozumleme 25-96 saniyeye
# cikabiliyor ve arayuz kilitleniyordu. SIGALRM ile butun dispatch'e
# tavan koyuyoruz: asilirsa saglayiciya "zaman asimi" doner, ana akis devam eder.
RESOLVE_BUDGET_SEC = float(os.environ.get('CINEPULSE_RESOLVE_BUDGET', '22'))


def _budget_alarm(signum, frame):
    raise ResolveTimeout()


def dispatch_with_budget(provider, args, budget=RESOLVE_BUDGET_SEC):
    if not hasattr(signal, 'SIGALRM'):          # Windows: signals yok
        return dispatch(provider, args)
    prev = None
    try:
        prev = signal.signal(signal.SIGALRM, _budget_alarm)
        signal.alarm(max(1, int(budget)))
    except (ValueError, OSError):
        # Ana thread disinda (orn. Vercel worker) alarm kurulamaz -> normal yol
        return dispatch(provider, args)
    try:
        return dispatch(provider, args)
    except ResolveTimeout:
        return {'success': False, 'error': 'timeout', 'budget': budget}
    finally:
        try:
            signal.alarm(0)
            if prev is not None:
                signal.signal(signal.SIGALRM, prev)
        except (ValueError, OSError):
            pass


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
            self._send(dispatch_with_budget(g('provider'), args))
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
        # NOT: Bütçe sarmalayıcısı şart — CLI yolu masaüstü sidecar'ın kullandığı
        # yol; doğrudan dispatch() çağırmak 25+ saniyelik kilitlenmeye yol açıyordu.
        print(json.dumps(dispatch_with_budget(sys.argv[1], args)))
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)[:200]}))


if __name__ == '__main__':
    main()


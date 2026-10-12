"""APK adapter for the same Python providers used by the CLI and desktop.
All urllib requests (including cookie-jar openers) use the on-device transport.
"""
import io
import json
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from email.message import Message
from urllib.response import addinfourl

_LOCAL = threading.local()
_ORIGIN = None
_ORIGINAL_OPEN = urllib.request.OpenerDirector.open
_INSTALLED = False


class ProviderDeadline(BaseException):
    pass


def _native_open(opener, fullurl, data=None, timeout=20):
    origin = _ORIGIN
    req = fullurl if isinstance(fullurl, urllib.request.Request) else urllib.request.Request(fullurl, data=data)
    target = req.full_url
    if not origin or target.startswith(origin + '/'):
        return _ORIGINAL_OPEN(opener, fullurl, data, timeout)
    parsed = urllib.parse.urlsplit(target)
    if parsed.hostname == 'wild-credit-e1ae.cagatayca07.workers.dev':
        target = urllib.parse.parse_qs(parsed.query).get('url', [''])[0]
        parsed = urllib.parse.urlsplit(target)
    if parsed.scheme not in ('http', 'https') or (parsed.hostname or '').endswith('.vercel.app'):
        raise urllib.error.URLError('Remote relay disabled in APK')
    remaining = getattr(_LOCAL, 'deadline', time.monotonic() + 22) - time.monotonic()
    if remaining <= 0:
        raise ProviderDeadline()
    headers = dict(req.header_items())
    ref = next((v for k, v in headers.items() if k.lower() == 'referer'), '')
    gateway = origin + '/api/proxy?' + urllib.parse.urlencode({'url': target, 'ref': ref})
    proxied = urllib.request.Request(gateway, data=req.data if data is None else data,
                                     headers=headers, method=req.get_method())
    try:
        return _ORIGINAL_OPEN(opener, proxied, timeout=min(float(timeout), remaining))
    except urllib.error.HTTPError as error:
        if error.code not in (403, 503) or req.get_method() != 'GET':
            raise
        ua = next((v for k, v in headers.items() if k.lower() == 'user-agent'), '')
        page_url = origin + '/api/native_page?' + urllib.parse.urlencode({'url': target, 'ua': ua})
        with _ORIGINAL_OPEN(opener, page_url, timeout=min(40, remaining)) as response:
            page = json.load(response)
        if not page.get('ok') or page.get('challenge'):
            raise error
        body = page.get('text', '')
        if not body.strip().startswith(('{', '[')):
            body = page.get('html', '')
        message = Message()
        message['Content-Type'] = 'text/html; charset=utf-8'
        return addinfourl(io.BytesIO(body.encode('utf-8')), message, page.get('finalUrl') or target, 200)


def resolve_json(raw, origin):
    global _ORIGIN, _INSTALLED
    _ORIGIN = origin
    if not _INSTALLED:
        urllib.request.OpenerDirector.open = _native_open
        _INSTALLED = True
    params = json.loads(raw)
    _LOCAL.deadline = time.monotonic() + 35
    from resolve import dispatch
    args = dict(params)
    args['titles'] = [params[f't{i}'] for i in range(6) if params.get(f't{i}')]
    try:
        result = dispatch(params.get('provider', ''), args)
        result['transport'] = 'android-device'
        return json.dumps(result, ensure_ascii=False)
    except ProviderDeadline:
        return json.dumps({'success': False, 'streams': [], 'error': 'timeout'})
    except Exception as error:
        return json.dumps({'success': False, 'streams': [], 'error': type(error).__name__})
    finally:
        _LOCAL.__dict__.clear()

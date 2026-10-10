"""CinePulse ozel resolver altyapisi (Cloudstream mantigi).
Her saglayici: ara -> sayfa -> embed -> stream + altyazi.
Ortak: HTTP, cookie'li POST, Dean-Edwards unpack, HDF tipi decoder'lar.
"""
import base64
import json
import re
import string as _string
import urllib.parse
import urllib.request

FULL_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

# Python urllib'in TLS parmak izi Cloudflare/WAF'larca engellenir (Connection
# reset / 403), oysa sistem curl'u gecer. Agir tum cozuculer buradan gecer,
# o yuzden urllib basarisizsa sessizce curl'e dus (CloseLoad/Rapidrame,
# SetPlay/FastPlay, Webteizle ve SezonlukDizi'nin local'de bos donmesinin
# bir numarali sebebi buydu).
import shutil as _shutil
import subprocess as _subprocess

_HAS_CURL = bool(_shutil.which('curl'))

# Cloudflare Worker gecidi: Vercel datacenter IP'si CF korumali sitelerce
# engellenir (HDFC 403, SZD/WTZ bos doner). Worker egress farkli oldugu icin
# engellenMEYEN sitelerde (sezonlukdizi.cc, webteizle.info dogrulandi) son
# basamak olarak kullanilir. HDFC worker'dan da 403 yer, ona bulasilmaz.
CF_WORKER_GATEWAY = 'https://wild-credit-e1ae.cagatayca07.workers.dev'

_CF_CHALLENGE_MARKERS = ('just a moment', 'challenge-platform', 'cf-chl', '__cf_bm')


def _looks_like_cf_challenge(html):
    try:
        low = (html or '').lower()
        return any(m in low for m in _CF_CHALLENGE_MARKERS)
    except Exception:
        return False


def _worker_fetch(url, referer='', timeout=10, post_data=None):
    """Worker uzerinden GET (post_data yoksa) veya form POST yapar.
    Vercel'den dogrudan erisilemeyen ama worker'dan acilan siteler icin."""
    try:
        gateway = CF_WORKER_GATEWAY + '?url=' + urllib.parse.quote(url, safe='')
        headers = {'User-Agent': FULL_UA, 'Accept': '*/*'}
        if referer:
            headers['Referer'] = referer
        body = None
        if post_data is not None:
            body = post_data.encode('utf-8') if isinstance(post_data, str) else post_data
            headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
            headers['X-Requested-With'] = 'XMLHttpRequest'
        req = urllib.request.Request(gateway, data=body, headers=headers,
                                     method='POST' if body is not None else 'GET')
        with urllib.request.urlopen(req, timeout=max(4, min(int(timeout or 10), 15))) as resp:
            if resp.status != 200:
                return ''
            return resp.read().decode('utf-8', errors='ignore')
    except Exception:
        return ''


def _curl_fetch(url, referer='', timeout=8, post_data=None, extra_headers=None):
    if not _HAS_CURL:
        return ''
    try:
        cmd = ['curl', '-4', '-sL', '--compressed',
               '--connect-timeout', '4', '--max-time', str(max(4, min(int(timeout or 8), 12))),
               '-A', FULL_UA]
        if referer:
            cmd += ['-e', referer]
        for k, v in (extra_headers or {}).items():
            if k.lower() in ('content-type', 'x-requested-with'):
                continue
            cmd += ['-H', f"{k}: {v}"]
        if post_data is not None:
            cmd += ['-X', 'POST', '--data-raw', post_data,
                    '-H', 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8',
                    '-H', 'X-Requested-With: XMLHttpRequest']
        cmd.append(url)
        out = _subprocess.run(cmd, capture_output=True, timeout=(int(timeout or 8) + 3))
        if out.returncode != 0:
            return ''
        return (out.stdout or b'').decode('utf-8', errors='ignore')
    except Exception:
        return ''


def atob(s):
    try:
        s = ''.join(str(s).split())
        s += '=' * (-len(s) % 4)
        return base64.b64decode(s).decode('latin1')
    except Exception:
        return ''


def slugify(value):
    import unicodedata
    normalized = unicodedata.normalize('NFKD', value or '').encode('ascii', 'ignore').decode('ascii').lower()
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', normalized)).strip('-')


def clean_title(raw):
    if not raw:
        return ''
    out = re.sub(r'\s*-\s*S\d+E\d+.*$', '', raw, flags=re.I)
    out = re.sub(r'\s*-\s*S\d+.*$', '', out, flags=re.I)
    out = re.sub(r'\s*-\s*Bölüm\s*\d+.*$', '', out, flags=re.I)
    out = re.sub(r'\s*\(\d{4}\).*$', '', out).strip()
    return out


def fetch_html(url, referer='', timeout=7, extra_headers=None, attempts=2, worker_fallback=True):
    # curl birincil: urllib'in TLS parmak izi CF/WAF'larca yavaslatiliyor
    # (timeout'a kadar bekletip sonra kesiyor), curl 1-3sn'de doner.
    curled = _curl_fetch(url, referer, timeout, extra_headers=extra_headers)
    if curled and len(curled) > 200 and not _looks_like_cf_challenge(curled):
        return curled
    for i in range(max(1, attempts)):
        try:
            headers = {'User-Agent': FULL_UA}
            if referer:
                headers['Referer'] = referer
            if extra_headers:
                headers.update(extra_headers)
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                direct = resp.read().decode('utf-8', errors='ignore')
                if direct and not _looks_like_cf_challenge(direct):
                    return direct
                break
        except Exception:
            if i < attempts - 1:
                try:
                    import time as _t
                    _t.sleep(0.3 + 0.3 * i)
                except Exception:
                    pass
    if curled and not _looks_like_cf_challenge(curled):
        return curled
    # Son basamak: CF Worker gecidi (Vercel IP'si engelliyse, ornegin SZD/WTZ).
    if worker_fallback:
        proxied = _worker_fetch(url, referer, timeout)
        if proxied and len(proxied) > 200 and not _looks_like_cf_challenge(proxied):
            return proxied
    return ''


def fetch_json(url, referer='', timeout=7, extra_headers=None, method='GET', data=None, attempts=2):
    for i in range(max(1, attempts)):
        try:
            headers = {'User-Agent': FULL_UA, 'Accept': 'application/json, text/plain, */*'}
            if referer:
                headers['Referer'] = referer
            if extra_headers:
                headers.update(extra_headers)
            body = None
            if data is not None:
                body = data.encode('utf-8') if isinstance(data, str) else data
            req = urllib.request.Request(url, data=body, headers=headers, method=method)
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.loads(resp.read().decode('utf-8'))
        except Exception:
            if i < attempts - 1:
                try:
                    import time as _t
                    _t.sleep(0.3 + 0.3 * i)
                except Exception:
                    pass
    return None


def post_form(url, referer='', form=None, timeout=7, extra_headers=None, session_cookie=None, attempts=2, worker_fallback=True):
    headers = {
        'User-Agent': FULL_UA,
        'Referer': referer,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    }
    if extra_headers:
        headers.update(extra_headers)
    if session_cookie:
        headers['Cookie'] = session_cookie
    # curl birincil (hizli + CF dostu), urllib yedek
    try:
        ch = dict(headers)
        extra = {k: v for k, v in ch.items()
                 if k.lower() not in ('user-agent', 'referer', 'content-type',
                                      'x-requested-with', 'content-length', 'host')}
        curled = _curl_fetch(url, referer, timeout,
                             post_data=urllib.parse.urlencode(form or {}),
                             extra_headers=extra)
        if curled:
            return curled
    except Exception:
        pass
    for i in range(max(1, attempts)):
        try:
            body = urllib.parse.urlencode(form or {}).encode('utf-8')
            req = urllib.request.Request(url, data=body, headers=headers, method='POST')
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.read().decode('utf-8', errors='ignore')
        except Exception:
            if i < attempts - 1:
                try:
                    import time as _t
                    _t.sleep(0.3 + 0.3 * i)
                except Exception:
                    pass
    # Son basamak: CF Worker gecidi (ajax POST'lar worker'dan da gecer, dogrulandi).
    if worker_fallback:
        proxied = _worker_fetch(url, referer, timeout,
                                post_data=urllib.parse.urlencode(form or {}))
        if proxied:
            return proxied
    return ''


def get_session_cookie(page_url, timeout=6):
    try:
        req = urllib.request.Request(page_url, headers={'User-Agent': FULL_UA})
        with urllib.request.urlopen(req, timeout=min(timeout, 4)) as resp:
            raw = resp.headers.get('Set-Cookie') or ''
            if raw:
                return raw.split(';')[0]
    except Exception:
        pass
    # hizli yedek: curl basliklardan Set-Cookie'yi al
    if _HAS_CURL:
        try:
            out = _subprocess.run(
                ['curl', '-4', '-sI', '--connect-timeout', '3', '--max-time', '5',
                 '-A', FULL_UA, page_url],
                capture_output=True, timeout=7)
            for line in (out.stdout or b'').decode('latin1').splitlines():
                if line.lower().startswith('set-cookie:'):
                    return line.split(':', 1)[1].strip().split(';')[0]
        except Exception:
            pass
    return ''


def decode_hdfc(arr, w601, f82d):
    """Klasik HDF tipi decoder (sabit string'li function govdeli)."""
    try:
        r0yqa = ''.join(arr)
        nkrz = 0
        g8crq = 0
        for h8r in range(len(w601)):
            vo1hk = ord(w601[h8r])
            nkrz = (nkrz * 31 + vo1hk) % 251
            g8crq = (g8crq ^ (vo1hk + h8r)) & 255
        jm6 = (nkrz + g8crq) % 256
        czpfq = (nkrz % 13) + 3
        ajn = ((nkrz * 256 + g8crq) % 65521) + 1
        for h8r in range(len(f82d) - 1, -1, -1):
            kvyuu = f82d[h8r]
            if kvyuu == 'b':
                r0yqa = atob(r0yqa)
            elif kvyuu == 'v':
                r0yqa = r0yqa[::-1]
            else:
                fyt4f = (26 - ((ord(kvyuu) - 64) % 26)) % 26
                res = []
                for ch in r0yqa:
                    c = ord(ch)
                    if 65 <= c <= 90:
                        res.append(chr((c - 65 + fyt4f) % 26 + 65))
                    elif 97 <= c <= 122:
                        res.append(chr((c - 97 + fyt4f) % 26 + 97))
                    else:
                        res.append(ch)
                r0yqa = ''.join(res)
        xshzt = len(r0yqa)
        xz5u = [0] * xshzt
        for h8r in range(xshzt - 1, 0, -1):
            ajn = (ajn * 75 + 74) % 65537
            xz5u[h8r] = ajn % (h8r + 1)
        se2c = list(r0yqa)
        for h8r in range(1, xshzt):
            qu01d = xz5u[h8r]
            se2c[h8r], se2c[qu01d] = se2c[qu01d], se2c[h8r]
        r0yqa = ''.join(se2c)
        xa0i = jm6
        x90xa = []
        for h8r in range(len(r0yqa)):
            vo1hk = ord(r0yqa[h8r])
            xa0i = (xa0i + czpfq) % 256
            x90xa.append(chr(vo1hk ^ xa0i))
            xa0i = (xa0i + vo1hk) % 256
        return ''.join(x90xa)
    except Exception:
        return None


def decode_hdfc_new(arr, b64ch='7', revch='3'):
    """Guncel HDF tipi decoder (splice'li, ayrac+ozel karakter doner)."""
    try:
        y1x = list(arr)
        if len(y1x) < 5:
            return None
        y65 = len(y1x) - 2
        i728 = y65 % 7
        u22 = 8 + (y65 % 5)
        if u22 >= len(y1x) or i728 >= len(y1x):
            return None
        q23 = y1x.pop(u22)
        c4x1 = y1x.pop(i728)
        g9p = ''.join(y1x)
        if len(c4x1) > 4096:
            g9p = atob(g9p)
        c8jbi = 0
        t1f = 0
        for xk3au, ch in enumerate(c4x1):
            py9i = ord(ch)
            c8jbi = (c8jbi * 37 + py9i) % 241
            t1f = (t1f + ((py9i << 1) ^ xk3au)) & 255
        nx1y3 = (c8jbi * 3 + t1f) % 256
        bx9 = (t1f % 11) + 5
        va5tb = ((t1f * 251 + c8jbi) % 65519) + 1
        for ch in reversed(q23):
            if ch == b64ch:
                g9p = atob(g9p)
            elif ch == revch:
                g9p = g9p[::-1]
            else:
                ov7d = (26 - ((ord(ch) - 96) % 26)) % 26
                res = []
                for c in g9p:
                    o = ord(c)
                    if 65 <= o <= 90:
                        res.append(chr((o - 65 + ov7d) % 26 + 65))
                    elif 97 <= o <= 122:
                        res.append(chr((o - 97 + ov7d) % 26 + 97))
                    else:
                        res.append(c)
                g9p = ''.join(res)
        if len(q23) > 2048:
            g9p = g9p[::-1]
        y65 = len(g9p)
        u79x = [0] * y65
        for xk3au in range(y65 - 1, 0, -1):
            va5tb = (va5tb * 97 + 41) % 65519
            u79x[xk3au] = va5tb % (xk3au + 1)
        u7x8j = list(g9p)
        for xk3au in range(1, y65):
            wm3 = u79x[xk3au]
            u7x8j[xk3au], u7x8j[wm3] = u7x8j[wm3], u7x8j[xk3au]
        g9p = ''.join(u7x8j)
        z6q7 = nx1y3
        out = []
        for c in g9p:
            py9i = ord(c)
            z6q7 = (z6q7 * 5 + bx9) % 256
            out.append(chr(py9i ^ z6q7))
            z6q7 = (z6q7 + py9i) % 256
        return ''.join(out)
    except Exception:
        return None


def js_unpack_dean_edwards(packed):
    try:
        m = re.search(r"\}\('(.*)',(\d+),(\d+),'(.*)'\.split\('\|'\),(\d+),\{\}\)\)$", packed.strip(), re.S)
        if not m:
            return None
        p, a, c, keys = m.group(1), int(m.group(2)), int(m.group(3)), m.group(4).split('|')
        chrs = _string.digits + _string.ascii_lowercase

        def enc(n):
            s = ''
            while True:
                d = n % a
                s = (chr(d + 29) if d > 35 else chrs[d]) + s
                n //= a
                if n == 0:
                    break
            return s

        for i in range(c - 1, -1, -1):
            if i < len(keys) and keys[i]:
                p = re.sub(r'\b' + re.escape(enc(i)) + r'\b', keys[i], p)
        return p.replace("\\'", "'")
    except Exception:
        return None


def find_packed_blocks(ehtml):
    blocks = []
    try:
        start = 0
        while len(blocks) < 12:
            i = ehtml.find('eval(function(p,a,c,k,e,d)', start)
            if i < 0:
                break
            k = ehtml.find(',{}))', i)
            if k < 0:
                break
            blocks.append(ehtml[i:k + 5])
            start = k + 5
    except Exception:
        pass
    return blocks


def sources_var_name(ehtml):
    matches = [m for m in re.finditer(r'sources:\s*\[\{file:\s*([a-zA-Z0-9_]+)', ehtml)
               if not ehtml[max(0, ehtml.rfind('\n', 0, m.start())):m.start()].strip().startswith('//')]
    return matches[-1].group(1) if matches else None


def proxied(raw, ref):
    return f"/api/hls_proxy?url={urllib.parse.quote(raw)}&ref={urllib.parse.quote(ref)}"


def finalize_streams(streams, page_url):
    if not streams:
        return None
    first = streams[0]
    return {
        'success': True,
        'streams': streams,
        'streamUrl': first['streamUrl'],
        'rawStreamUrl': first['rawStreamUrl'],
        'movieUrl': page_url,
        'embedUrl': first.get('embedUrl', ''),
        'subtitles': first.get('subtitles', []),
    }

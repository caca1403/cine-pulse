import base64
import json
import re
import urllib.parse
import urllib.request
import unicodedata
import time
from concurrent.futures import ThreadPoolExecutor

_REQUEST_DEADLINE = float("inf")

def _remaining():
    return max(0, _REQUEST_DEADLINE - time.monotonic())

from http.server import BaseHTTPRequestHandler

FULL_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
BASE_URL = 'https://www.hdfilmcehennemi.nl'
# Site sık domain degistirir (.nl CF challenge yerse .mobi/.now dene).
# ISP DNS hijack'ine takilan domain bos doner, siradaki denenir.
BASE_URLS = [
    'https://www.hdfilmcehennemi.nl',
    'https://hdfilmcehennemi.mobi',
    'https://www.hdfilmcehennemi.now',
]

try:
    import shutil as _shutil
    import subprocess as _subprocess
    _HAS_CURL = bool(_shutil.which('curl'))
except Exception:
    _HAS_CURL = False

# Son calisan base ilk denensin (3 domain x N query carpisini azaltir)
_WORKING_BASE = [BASE_URLS[0]]
_DOMAINS_CACHE = {'ts': 0, 'url': None}

def sync_remote_domain():
    """Cloudstream / cs-plugins deposundan dinamik guncel domaini al."""
    import time
    now = time.time()
    if (now - _DOMAINS_CACHE['ts']) < 3600:
        return _DOMAINS_CACHE['url'] or BASE_URLS[0]
    _DOMAINS_CACHE['ts'] = now
    try:
        req = urllib.request.Request(
            'https://raw.githubusercontent.com/manitux-app/cs-plugins/main/domains.json',
            headers={'User-Agent': FULL_UA}
        )
        with urllib.request.urlopen(req, timeout=1) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            dom = data.get('hdfilmcehennemi')
            if dom and dom.startswith('http'):
                clean_dom = dom.rstrip('/')
                _DOMAINS_CACHE['url'] = clean_dom
                _DOMAINS_CACHE['ts'] = now
                if clean_dom not in BASE_URLS:
                    BASE_URLS.insert(0, clean_dom)
                return clean_dom
    except Exception:
        pass
    return BASE_URLS[0]

def _ordered_bases():
    try:
        sync_remote_domain()
    except Exception:
        pass
    bases = list(BASE_URLS)
    w = _WORKING_BASE[0]
    if w in bases:
        bases.remove(w)
        bases.insert(0, w)
    return bases


def _mark_working(base):
    try:
        _WORKING_BASE[0] = base
    except Exception:
        pass


def _curl_fetch(url, referer, timeout=7):
    if not _HAS_CURL:
        return ''
    try:
        cmd = ['curl', '-4', '-sL', '--compressed',
               '--connect-timeout', '2', '--max-time', str(max(0.1, min(float(timeout or 2), _remaining(), 2))),
               '-A', FULL_UA, '-e', referer or (BASE_URL + '/'), url]
        out = _subprocess.run(cmd, capture_output=True, timeout=max(0.1, min(float(timeout or 2), _remaining(), 2)) + 0.2)
        if out.returncode != 0:
            return ''
        return (out.stdout or b'').decode('utf-8', errors='ignore')
    except Exception:
        return ''

def slugify(value):
    normalized = unicodedata.normalize('NFKD', value or '').encode('ascii', 'ignore').decode('ascii').lower()
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', normalized)).strip('-')

def atob(s):
    try:
        return base64.b64decode(s).decode('latin1')
    except Exception:
        return ''

def decode_hdfc(arr, w601, f82d):
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
    """Guncel hdfilmcehennemi.nl embed cozucu.
    site her istekte var-isimlerini, ayraci ve 2 ozel karakteri
    dondurur; algoritma sabit. b64ch/revch decoder govdesinden
    dinamik okunur."""
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
    """Dean Edwards packer cozucu (Rapidrame embed'ler icin). Kuyruktan
    parse eder cunku payload'in ici de quote/parantez icerebilir."""
    try:
        import string as _string
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


def eval_closeload_js(script_content):
    """Anthology ve Cloudstream uyumlu JS cozumleme motoru.
    Node.js araciligiyla atob/btoa pollyfill ile scripti dinamik calistirir."""
    try:
        import subprocess, shutil
        if not shutil.which('node'):
            return None
        m = (re.search(r'var\s+([a-zA-Z0-9_$]+)\s*=\s*[a-zA-Z0-9_$]+\(\[[^\]]+\]\);', script_content) or
             re.search(r'var\s+([a-zA-Z0-9_$]+)\s*=\s*[a-zA-Z0-9_$]+\(\s*"[^"]+"\s*\.split\(', script_content) or
             re.search(r"var\s+([a-zA-Z0-9_$]+)\s*=\s*[a-zA-Z0-9_$]+\(\s*'[^']+'\s*\.split\(", script_content))
        if not m:
            return None
        var_name = m.group(1)
        js_code = (
            'const atob = (typeof globalThis.atob !== "undefined") ? globalThis.atob : (s) => Buffer.from(s, "base64").toString("binary");\n'
            'const btoa = (typeof globalThis.btoa !== "undefined") ? globalThis.btoa : (s) => Buffer.from(s, "binary").toString("base64");\n'
            f'{script_content}\n'
            f'try {{ if (typeof {var_name} !== "undefined") console.log({var_name}); }} catch(e) {{}}\n'
        )
        res = subprocess.run(['node', '-e', js_code], capture_output=True, text=True, timeout=3)
        if res.returncode == 0:
            out = res.stdout.strip()
            if out.startswith('http'):
                return out
    except Exception:
        pass
    return None


def sources_var_name(ehtml):
    matches = [m for m in re.finditer(r'sources:\s*\[\{file:\s*([a-zA-Z0-9_]+)', ehtml)
               if not ehtml[max(0, ehtml.rfind('\n', 0, m.start())):m.start()].strip().startswith('//')]
    return matches[-1].group(1) if matches else None


def find_packed_blocks(ehtml):
    """eval(function(p,a,c,k,e,d)...) blogunu bitis isareti `,{}))` ile
    sinirla; payload icindeki '</script>' parazitlerine takilmaz."""
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


def decode_call_old(u, vname):
    """Eski tip: var <v> = <f>(["a","b",...]) + function govdesindeki 2 sabit."""
    try:
        mc = re.search(r'var\s+' + vname + r'\s*=\s*([a-zA-Z0-9_]+)\(\[([^\]]+)\]\)', u)
        if not mc:
            return None
        dec_name = mc.group(1)
        try:
            arr = json.loads('[' + mc.group(2) + ']')
        except Exception:
            return None
        mf = re.search(r'function\s+' + dec_name + r'\s*\([^)]*\)\s*\{([\s\S]*?)\n\}', u) or \
             re.search(dec_name + r'\s*=\s*function\s*\([^)]*\)\s*\{([\s\S]*?)\n\};', u)
        if not mf:
            return None
        strings = re.findall(r'var\s+[a-zA-Z0-9_]+\s*=\s*["\']([^"\']+)["\']', mf.group(1))
        if len(strings) < 2:
            return None
        return decode_hdfc(arr, strings[0], strings[1])
    except Exception:
        return None


def decode_from_unpacked(u, vname):
    try:
        mc = re.search(r'var\s+' + vname + r'\s*=\s*([a-zA-Z0-9_]+)\(\s*"([^"]+)"\.split\("([^"])"\)\s*\)', u)
        if not mc:
            return None
        dec_name, data_str, delim = mc.group(1), mc.group(2), mc.group(3)
        md = re.search(dec_name + r'\s*=\s*function\s*\([^)]*\)\s*\{([\s\S]*?)\n\};', u)
        b64ch, revch = '7', '3'
        if md:
            specials = re.findall(r"===\s*'([^']+)'", md.group(1))
            if len(specials) >= 2:
                b64ch, revch = specials[0], specials[1]
        return decode_hdfc_new(data_str.split(delim), b64ch, revch)
    except Exception:
        return None


def extract_rapidrame_stream(embed_url, referer):
    """Rapidrame /rplayer/ embed cozucu (packed JS + alternatif decoder)."""
    try:
        ehtml = fetch_html(embed_url, referer, timeout=7)
        if not ehtml:
            return None
        stream_url = None
        for pack in find_packed_blocks(ehtml):
            u = js_unpack_dean_edwards(pack)
            if not u:
                continue
            vname = sources_var_name(ehtml) or sources_var_name(u)
            if not vname:
                continue
            stream_url = decode_from_unpacked(u, vname) or decode_call_old(u, vname)
            if not stream_url:
                stream_url = eval_closeload_js(u)
            if stream_url and stream_url.startswith('http'):
                break
            stream_url = None
        if not stream_url:
            return None
        subtitles = []
        try:
            m_tracks = re.search(r'tracks:\s*(\[.*?\])\s*,', ehtml, re.S)
            blob = m_tracks.group(1) if m_tracks else ehtml
            for file_url, label in re.findall(r'"file"\s*:\s*"([^"]+)"[^}]*?"label"\s*:\s*"([^"]+)"', blob):
                file_url = file_url.replace('\\/', '/')
                try:
                    label = label.encode('utf-8').decode('unicode_escape')
                except Exception:
                    pass
                if file_url.startswith('/'):
                    file_url = BASE_URL.rstrip('/') + file_url
                if file_url.startswith('http'):
                    subtitles.append({'label': f"{label} (Rapidrame)", 'src': file_url})
        except Exception:
            pass
        return {'streamUrl': stream_url, 'subtitles': subtitles}
    except Exception:
        return None


def _is_cf(text):
    if not text:
        return True
    low = text[:2000].lower()
    return 'just a moment' in low or 'cf-chl' in low or 'challenge-platform' in low or '404 hata' in low


def fetch_html(url, referer, timeout=7, extra_headers=None, attempts=2):
    if _remaining() < 0.1:
        return ''
    timeout = max(0.1, min(float(timeout), _remaining(), 2))
    # curl birincil
    curled = _curl_fetch(url, referer, timeout)
    if curled and len(curled) > 200 and not _is_cf(curled):
        return curled
    for i in range(1):
        if _remaining() < 0.1:
            break
        timeout = max(0.1, min(timeout, _remaining()))
        try:
            headers = {'User-Agent': FULL_UA, 'Referer': referer}
            if extra_headers:
                headers.update(extra_headers)
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                data = resp.read().decode('utf-8', errors='ignore')
                if data and not _is_cf(data):
                    return data
        except Exception:
            if i < attempts - 1:
                try:
                    import time as _t
                    _t.sleep(0.3 + 0.3 * i)
                except Exception:
                    pass
    return curled if (curled and not _is_cf(curled)) else ''


def get_video_alternatives(page_html):
    """Alternative player butonlari: [(video_id, label)] — örn Close / Rapidrame."""
    out = []
    try:
        for m in re.finditer(r'<button[^>]*class="[^"]*alternative-link[^"]*"[^>]*>([\s\S]*?)</button>', page_html, re.I):
            btn_tag = m.group(0)
            label = re.sub(r'<[^>]+>', '', m.group(1)).strip()
            vid_m = re.search(r'data-video="(\d+)"', btn_tag, re.I)
            if vid_m:
                vid = vid_m.group(1)
                if vid and all(v[0] != vid for v in out):
                    out.append((vid, label or 'Player'))
    except Exception:
        pass
    return out


def resolve_video_embed(video_id, page_url):
    """GET /video/<id>/ -> (embed_url, iframe_class)."""
    try:
        base_match = re.match(r'(https?://[^/]+)', page_url or '')
        base = base_match.group(1) if base_match else BASE_URL
        body = fetch_html(f"{base}/video/{video_id}/", page_url,
                          extra_headers={'X-Requested-With': 'fetch', 'Content-Type': 'application/json'})
        data = json.loads(body or 'null')
        html = ((data or {}).get('data') or {}).get('html') or ''
        m = re.search(r'<iframe[^>]+class="([^"]*)"[^>]+(?:data-src|src)=["\']([^"\']+)["\']', html, re.I) or \
            re.search(r'<iframe[^>]+(?:data-src|src)=["\']([^"\']+)["\']', html, re.I)
        if not m:
            return None, ''
        if m.lastindex == 2:
            cls, url = m.group(1), m.group(2)
        else:
            cls, url = '', m.group(1)
        if url.startswith('//'):
            url = 'https:' + url
        return url, cls
    except Exception:
        return None, ''


def classify_provider(embed_url, iframe_class=''):
    url = (embed_url or '').lower()
    if '/rplayer/' in url:
        return 'Rapidrame'
    if '/video/embed/' in url or 'hdfilmcehennemi.mobi' in url:
        return 'CloseLoad'
    blob = (iframe_class or '').lower()
    if 'rapid' in blob:
        return 'Rapidrame'
    return 'CloseLoad'


REFS = {
    'CloseLoad': 'https://hdfilmcehennemi.mobi/',
    'Rapidrame': 'https://www.hdfilmcehennemi.nl/'
}


def proxied(raw, provider):
    return f"/api/hls_proxy?url={urllib.parse.quote(raw)}&ref={urllib.parse.quote(REFS.get(provider, BASE_URL + '/'))}"


PROVIDER_ORDER = {'CloseLoad': 0, 'Rapidrame': 1}


def _resolve_alt(args):
    vid, label, page_url = args
    try:
        embed_url, cls = resolve_video_embed(vid, page_url)
        if not embed_url:
            return None
        provider = classify_provider(embed_url, cls or label)
        if provider == 'Rapidrame':
            ext = extract_rapidrame_stream(embed_url, page_url)
        else:
            ext = extract_from_embed(embed_url, page_url)
        if ext and ext.get('streamUrl', '').startswith('http'):
            raw = ext['streamUrl']
            return {
                'provider': provider,
                'streamUrl': proxied(raw, provider),
                'rawStreamUrl': raw,
                'embedUrl': embed_url,
                'subtitles': ext.get('subtitles', [])
            }
    except Exception:
        pass
    return None


def collect_page_streams(page_html, page_url):
    """Sayfadaki tum alternatif player'lari coz (paralel): CloseLoad ustte."""
    results = []
    alts = get_video_alternatives(page_html)
    if alts:
        try:
            from concurrent.futures import ThreadPoolExecutor
            with ThreadPoolExecutor(max_workers=min(4, len(alts))) as ex:
                for r in ex.map(_resolve_alt, [(v, l, page_url) for v, l in alts]):
                    if r:
                        results.append(r)
        except Exception:
            for vid, label in alts:
                r = _resolve_alt((vid, label, page_url))
                if r:
                    results.append(r)
        results.sort(key=lambda s: PROVIDER_ORDER.get(s.get('provider'), 9))
        return results
    # Tek player fallback (alternatif butonu yoksa)
    m_iframe = re.search(r'<iframe[^>]+class="([^"]*)"[^>]+(?:data-src|src)=["\']([^"\']+)["\']', page_html, re.I) or \
               re.search(r'<iframe[^>]+(?:data-src|src)=["\']([^"\']+)["\']', page_html, re.I)
    if m_iframe:
        if m_iframe.lastindex == 2:
            cls, embed_url = m_iframe.group(1), m_iframe.group(2)
        else:
            cls, embed_url = '', m_iframe.group(1)
        if embed_url.startswith('//'):
            embed_url = 'https:' + embed_url
        provider = classify_provider(embed_url, cls)
        ext = extract_rapidrame_stream(embed_url, page_url) if provider == 'Rapidrame' else extract_from_embed(embed_url, page_url)
        if ext and ext.get('streamUrl', '').startswith('http'):
            raw = ext['streamUrl']
            results.append({
                'provider': provider,
                'streamUrl': proxied(raw, provider),
                'rawStreamUrl': raw,
                'embedUrl': embed_url,
                'subtitles': ext.get('subtitles', [])
            })
    return results


def extract_subtitles(ehtml):
    subtitles = []
    try:
        m_tracks = re.search(r'tracks:\s*(\[.*?\])\s*,?\s*\n?\s*captions:', ehtml, re.S)
        blob = m_tracks.group(1) if m_tracks else ehtml
        for file_url, label in re.findall(r'"file"\s*:\s*"([^"]+)"[^}]*?"label"\s*:\s*"([^"]+)"', blob):
            file_url = file_url.replace('\\/', '/')
            if file_url.startswith('http'):
                subtitles.append({'label': f"{label} (HDFC)", 'src': file_url})
    except Exception:
        pass
    return subtitles


def extract_from_embed(embed_url, referer):
    try:
        ehtml = fetch_html(embed_url, referer, timeout=7)
        if not ehtml:
            return None

        m_src = re.search(r'sources:\s*\[\{file:\s*([a-zA-Z0-9_]+)', ehtml)
        if not m_src:
            return None
        # Yorum satirindaki sahte eslesmeyi atla (Rapidrame'de //sources mevcut)
        vname = sources_var_name(ehtml) or m_src.group(1)
        stream_url = None

        # Yeni format: var <v> = <f>("aXbX...".split("X")) — ayrac her istekte doner
        m_new = re.search(r'var\s+' + vname + r'\s*=\s*([a-zA-Z0-9_]+)\(\s*"([^"]+)"\.split\("([^"])"\)\s*\)', ehtml) or \
                re.search(r"var\s+" + vname + r"\s*=\s*([a-zA-Z0-9_]+)\(\s*'([^']+)'\.split\('([^'])'\)\s*\)", ehtml)
        if m_new:
            dec_name, data_str, delim = m_new.group(1), m_new.group(2), m_new.group(3)
            arr = data_str.split(delim)
            b64ch, revch = '7', '3'
            m_dec = re.search(r'var\s+' + dec_name + r'\s*=\s*function\s*\([^)]*\)\s*\{([\s\S]*?)\n\};', ehtml)
            if m_dec:
                specials = re.findall(r"===\s*'([^']+)'", m_dec.group(1))
                if len(specials) >= 2:
                    b64ch, revch = specials[0], specials[1]
            stream_url = decode_hdfc_new(arr, b64ch, revch)

        if not stream_url:
            m_call = re.search(r'var\s+' + vname + r'\s*=\s*([a-zA-Z0-9_]+)\(\[(\s*[\"\'][^\]]+)\]\);', ehtml)
            if m_call:
                fname = m_call.group(1)
                arr_json = f"[{m_call.group(2)}]"
                arr = json.loads(arr_json)
                m_func = re.search(r'function\s+' + fname + r'\s*\([^)]*\)\s*\{([\s\S]*?)\n\}', ehtml)
                if m_func:
                    func_body = m_func.group(1)
                    strings = re.findall(r'var\s+[a-zA-Z0-9_]+\s*=\s*[\"\']([^\"\']+)[\"\'];', func_body)
                    if len(strings) >= 2:
                        stream_url = decode_hdfc(arr, strings[0], strings[1])
        if not stream_url:
            for sc in re.findall(r'<script[\s\S]*?<\/script>', ehtml, re.I):
                clean_sc = re.sub(r'<script[^>]*>', '', sc, flags=re.I)
                clean_sc = re.sub(r'<\/script>', '', clean_sc, flags=re.I).strip()
                if ('atob' in clean_sc or 'split(' in clean_sc) and ('([' in clean_sc or '.split(' in clean_sc):
                    stream_url = eval_closeload_js(clean_sc)
                    if stream_url and stream_url.startswith('http'):
                        break

        if not stream_url or not stream_url.startswith('http'):
            return None

        return {
            'streamUrl': stream_url,
            'subtitles': extract_subtitles(ehtml)
        }
    except Exception:
        return None

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
        'embedUrl': first['embedUrl'],
        'subtitles': first.get('subtitles', [])
    }

def resolve_hdfc_stream(title, original_title='', season=1, episode=1, is_tv=False, titles=None):
    global _REQUEST_DEADLINE
    _REQUEST_DEADLINE = time.monotonic() + 9
    bases = _ordered_bases()
    s_num = int(season or 1)
    ep_num = int(episode or 1)

    candidates = [title, original_title] + list(titles or [])
    clean_cands = []
    for c in candidates:
        if not c:
            continue
        raw = re.sub(r'\s*-\s*S\d+E\d+.*$', '', c, flags=re.I)
        raw = re.sub(r'\s*-\s*S\d+.*$', '', raw, flags=re.I)
        raw = re.sub(r'\s*\(\d{4}\).*$', '', raw).strip()
        if raw and raw not in clean_cands:
            clean_cands.append(raw)
            no_art = re.sub(r'^(the|a|an)\s+', '', raw, flags=re.I).strip()
            if no_art and no_art not in clean_cands:
                clean_cands.append(no_art)

    # The search endpoint is occasionally challenged on datacenter IPs. For
    # series, try the stable episode URL convention first so production does
    # not lose an otherwise valid HDFC stream.
    if is_tv:
        episode_urls = [
            f"{bases[0]}/dizi/{slugify(candidate)}-izle{suffix}/sezon-{s_num}/bolum-{ep_num}/"
            for candidate in clean_cands[:2] for suffix in ('-3', '')
        ]
        with ThreadPoolExecutor(max_workers=4) as executor:
            pages = list(executor.map(lambda url: fetch_html(url, bases[0] + '/', attempts=1), episode_urls))
        for episode_url, ep_html in zip(episode_urls, pages):
            if _remaining() < 0.1:
                break
            final = finalize_streams(collect_page_streams(ep_html, episode_url), episode_url) if ep_html else None
            if final:
                _mark_working(bases[0])
                return final

    # Search aliases and domains together; one blocked domain cannot hold up
    # the others. All HTTP stages share the same nine-second request budget.
    searches = [(query, base) for query in clean_cands[:2] for base in bases[:3]]
    def search(pair):
        query, base = pair
        return fetch_html(f"{base}/search?q={urllib.parse.quote(query)}", base + '/',
                          extra_headers={'X-Requested-With': 'fetch', 'Content-Type': 'application/json'},
                          timeout=2, attempts=1)
    with ThreadPoolExecutor(max_workers=6) as executor:
        bodies = list(executor.map(search, searches))
    for (query, base), body in zip(searches, bodies):
            if _remaining() < 0.1:
                break
            try:
                try:
                    data = json.loads(body or 'null')
                except Exception:
                    continue
                results = (data or {}).get('results', [])
                if results:
                    _mark_working(base)

                if not results:
                    continue

                # Sort results: if is_tv is True, prioritize /dizi/ URLs
                sorted_results = sorted(
                    results[:4],
                    key=lambda r: (1 if '/dizi/' in r else 0) if is_tv else (0 if '/dizi/' in r else 1),
                    reverse=True
                )

                for res_html in sorted_results:
                    m_link = (re.search(r'href=["\'](https://[^"\']*hdfilmcehennemi[^"\']+)["\']', res_html)
                              or re.search(r'href=["\']((?:/[^"\']+|https://[^"\']+))["\']', res_html))
                    if not m_link:
                        continue
                    page_url = m_link.group(1)
                    if page_url.startswith('/'):
                        page_url = f"{base}{page_url}"

                    p_html = fetch_html(page_url, f"{base}/", timeout=6)
                    if not p_html:
                        continue

                    # Check if it is a TV series page
                    if is_tv or '/dizi/' in page_url:
                        # Look for the specific season and episode link
                        ep_patterns = [
                            rf'href=["\'](https://[^"\']*hdfilmcehennemi[^"\']*dizi/[^"\']*sezon-{s_num}/bolum-{ep_num}[^"\']*)["\']',
                            rf'href=["\'](https://[^"\']*sezon-{s_num}/bolum-{ep_num}[^"\']*)["\']',
                            rf'href=["\']([^"\']*sezon-{s_num}/bolum-{ep_num}[^"\']*)["\']'
                        ]
                        ep_target_url = None
                        for pat in ep_patterns:
                            m_ep = re.search(pat, p_html, re.I)
                            if m_ep:
                                ep_target_url = m_ep.group(1)
                                if ep_target_url.startswith('/'):
                                    ep_target_url = f"{base}{ep_target_url}"
                                break

                        if not ep_target_url:
                            continue

                        # Fetch episode page
                        ep_html = fetch_html(ep_target_url, page_url)
                        if not ep_html:
                            continue
                        final = finalize_streams(collect_page_streams(ep_html, ep_target_url), ep_target_url)
                        if final:
                            return final
                    else:
                        # Movie page
                        streams = collect_page_streams(p_html, page_url)
                        final = finalize_streams(streams, page_url)
                        if final:
                            return final
            except Exception:
                continue

    # Anthology Fallback: Dogrudan aday slug sayfalarini dene (/hd-x-izle/, /1-x-izle-6/ vb.)
    if not is_tv:
        for cand in clean_cands:
            slug = slugify(cand)
            if not slug:
                continue
            slug_candidates = [
                slug,
                f"hd-{slug}-izle",
                f"1-{slug}-izle-6",
                f"1-{slug}-izle-7",
                f"1-{slug}-izle-8",
                f"1-{slug}-izle-10",
                f"{slug}-izle",
                f"{slug}-hdf",
                f"1-{slug}-film-izle-hdf-hdf-6",
                f"1-{slug}-film-izle-hdf-hdf-7"
            ]
            for cand_slug in slug_candidates:
                for base in bases[:2]:
                    if _remaining() < 0.1:
                        return {'success': False, 'error': 'Source lookup timed out (9s)'}
                    direct_url = f"{base}/{cand_slug}/"
                    try:
                        p_html = fetch_html(direct_url, f"{base}/", timeout=5)
                        if p_html and not _is_cf(p_html) and ('player' in p_html.lower() or 'alternative-link' in p_html):
                            streams = collect_page_streams(p_html, direct_url)
                            final = finalize_streams(streams, direct_url)
                            if final:
                                _mark_working(base)
                                return final
                    except Exception:
                        continue

    return {'success': False, 'error': 'Stream not found'}

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)

        query = params.get('query', [''])[0] or params.get('title', [''])[0]
        original_title = params.get('originalTitle', [''])[0]
        season = params.get('season', ['1'])[0]
        episode = params.get('episode', ['1'])[0]
        req_type = params.get('type', [''])[0]
        # Frontend her istekte season&episode gonderir (filmde bile 1/1),
        # o yuzden turu sadece `type` belirler; yoksa season/episode varligina bak.
        rt = (req_type or '').lower()
        is_tv = (rt != 'movie') if rt else bool(params.get('season') and params.get('episode'))

        result = resolve_hdfc_stream(query, original_title, season=season, episode=episode, is_tv=is_tv)

        body = json.dumps(result).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'public, max-age=900' if result.get('success') else 'no-store')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

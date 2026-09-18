import base64
import json
import re
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler

FULL_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
BASE_URL = 'https://www.hdfilmcehennemi.nl'

def decode_hdfc(arr, jmx, nsr1):
    try:
        m2mj = "".join(arr)
        sxio0 = 0
        vqc3v = 0
        for jnhzs, char in enumerate(jmx):
            pshql = ord(char)
            sxio0 = (sxio0 * 31 + pshql) % 251
            vqc3v = (vqc3v ^ (pshql + jnhzs)) & 255
        w5gx = (sxio0 + vqc3v) % 256
        mvcr5 = (sxio0 % 13) + 3
        vrxi = ((sxio0 * 256 + vqc3v) % 65521) + 1
        for mbr in reversed(nsr1):
            if mbr == 'b':
                m2mj = base64.b64decode(m2mj).decode('latin1')
            elif mbr == 'v':
                m2mj = m2mj[::-1]
            else:
                iec = (26 - ((ord(mbr) - 64) % 26)) % 26
                res = []
                for ch in m2mj:
                    c = ord(ch)
                    if 65 <= c <= 90:
                        res.append(chr((c - 65 + iec) % 26 + 65))
                    elif 97 <= c <= 122:
                        res.append(chr((c - 97 + iec) % 26 + 97))
                    else:
                        res.append(ch)
                m2mj = "".join(res)
        lpc7k = len(m2mj)
        ekhwp = [0] * lpc7k
        for jnhzs in range(lpc7k - 1, 0, -1):
            vrxi = (vrxi * 75 + 74) % 65537
            ekhwp[jnhzs] = vrxi % (jnhzs + 1)
        q0dkd = list(m2mj)
        for jnhzs in range(1, lpc7k):
            qcct = ekhwp[jnhzs]
            q0dkd[jnhzs], q0dkd[qcct] = q0dkd[qcct], q0dkd[jnhzs]
        m2mj = "".join(q0dkd)
        yog3 = w5gx
        l28 = []
        for char in m2mj:
            pshql = ord(char)
            yog3 = (yog3 + mvcr5) % 256
            l28.append(chr(pshql ^ yog3))
            yog3 = (yog3 + pshql) % 256
        return "".join(l28)
    except Exception:
        return None

def resolve_hdfc_stream(title, original_title=''):
    candidates = [title, original_title]
    # clean candidate titles
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

    for query in clean_cands:
        try:
            search_url = f"{BASE_URL}/search?q={urllib.parse.quote(query)}"
            headers = {
                'User-Agent': FULL_UA,
                'Referer': f"{BASE_URL}/",
                'X-Requested-With': 'fetch',
                'Content-Type': 'application/json'
            }
            req = urllib.request.Request(search_url, headers=headers)
            with urllib.request.urlopen(req, timeout=6) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                results = data.get('results', [])

            if not results:
                continue

            for res_html in results[:2]:
                m_link = re.search(r'href=["\'](https://www\.hdfilmcehennemi\.nl/[^"\']+)["\']', res_html)
                if not m_link:
                    continue
                movie_url = m_link.group(1)

                req_m = urllib.request.Request(movie_url, headers={'User-Agent': FULL_UA, 'Referer': f"{BASE_URL}/"})
                with urllib.request.urlopen(req_m, timeout=6) as resp_m:
                    mhtml = resp_m.read().decode('utf-8', errors='ignore')

                m_iframe = re.search(r'<iframe[^>]+(?:data-src|src)=["\']([^"\']*(?:embed|video|player)[^"\']*)["\']', mhtml, re.I) or re.search(r'<iframe[^>]+(?:data-src|src)=["\']([^"\']+)["\']', mhtml, re.I)
                if not m_iframe:
                    continue
                embed_url = m_iframe.group(1)
                if embed_url.startswith('//'):
                    embed_url = 'https:' + embed_url

                req_e = urllib.request.Request(embed_url, headers={'User-Agent': FULL_UA, 'Referer': movie_url})
                with urllib.request.urlopen(req_e, timeout=6) as resp_e:
                    ehtml = resp_e.read().decode('utf-8', errors='ignore')

                m_src = re.search(r'sources:\s*\[\{file:\s*([a-zA-Z0-9_]+)', ehtml)
                if not m_src:
                    continue
                vname = m_src.group(1)
                m_call = re.search(r'var\s+' + vname + r'\s*=\s*([a-zA-Z0-9_]+)\(\[(\s*[\"\'][^\]]+)\]\);', ehtml)
                if not m_call:
                    continue
                fname = m_call.group(1)
                arr_json = f"[{m_call.group(2)}]"
                arr = json.loads(arr_json)

                m_func = re.search(r'function\s+' + fname + r'\s*\([^)]*\)\s*\{([\s\S]*?)\n\}', ehtml)
                if not m_func:
                    continue
                func_body = m_func.group(1)
                m_jmx = re.search(r'var\s+[a-zA-Z0-9_]+\s*=\s*["\']([^"\']+)["\'];\s*var\s+[a-zA-Z0-9_]+\s*=\s*["\']([^"\']+)["\'];', func_body)
                if not m_jmx:
                    continue
                jmx = m_jmx.group(1)
                nsr1 = m_jmx.group(2)

                stream_url = decode_hdfc(arr, jmx, nsr1)
                if not stream_url or not stream_url.startswith('http'):
                    continue

                subtitles = []
                m_tracks = re.search(r'tracks:\s*(\[[^\]]+\])', ehtml)
                if m_tracks:
                    try:
                        tracks_data = json.loads(m_tracks.group(1))
                        for tr in tracks_data:
                            file_url = tr.get('file')
                            label = tr.get('label') or 'Altyazı'
                            if file_url:
                                subtitles.append({
                                    'label': f"{label} (HDFC)",
                                    'src': file_url
                                })
                    except Exception:
                        pass

                proxied_url = f"/api/hls_proxy?url={urllib.parse.quote(stream_url)}&ref={urllib.parse.quote('https://hdfilmcehennemi.mobi/')}"
                return {
                    'success': True,
                    'streamUrl': proxied_url,
                    'rawStreamUrl': stream_url,
                    'movieUrl': movie_url,
                    'embedUrl': embed_url,
                    'subtitles': subtitles
                }
        except Exception:
            continue

    return {'success': False, 'error': 'Stream not found'}

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)

        query = params.get('query', [''])[0] or params.get('title', [''])[0]
        original_title = params.get('originalTitle', [''])[0]

        result = resolve_hdfc_stream(query, original_title)

        body = json.dumps(result).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'public, max-age=3600')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

import base64
import json
import re
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler

FULL_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
BASE_URL = 'https://www.hdfilmcehennemi.nl'

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

def extract_from_embed(embed_url, referer):
    try:
        req_e = urllib.request.Request(embed_url, headers={'User-Agent': FULL_UA, 'Referer': referer})
        with urllib.request.urlopen(req_e, timeout=7) as resp_e:
            ehtml = resp_e.read().decode('utf-8', errors='ignore')

        m_src = re.search(r'sources:\s*\[\{file:\s*([a-zA-Z0-9_]+)', ehtml)
        if not m_src:
            return None
        vname = m_src.group(1)
        m_call = re.search(r'var\s+' + vname + r'\s*=\s*([a-zA-Z0-9_]+)\(\[(\s*[\"\'][^\]]+)\]\);', ehtml)
        if not m_call:
            return None
        fname = m_call.group(1)
        arr_json = f"[{m_call.group(2)}]"
        arr = json.loads(arr_json)

        m_func = re.search(r'function\s+' + fname + r'\s*\([^)]*\)\s*\{([\s\S]*?)\n\}', ehtml)
        if not m_func:
            return None
        func_body = m_func.group(1)
        strings = re.findall(r'var\s+[a-zA-Z0-9_]+\s*=\s*[\"\']([^\"\']+)[\"\'];', func_body)
        if len(strings) < 2:
            return None
        w601, f82d = strings[0], strings[1]

        stream_url = decode_hdfc(arr, w601, f82d)
        if not stream_url or not stream_url.startswith('http'):
            return None

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

        return {
            'streamUrl': stream_url,
            'subtitles': subtitles
        }
    except Exception:
        return None

def resolve_hdfc_stream(title, original_title='', season=1, episode=1, is_tv=False):
    s_num = int(season or 1)
    ep_num = int(episode or 1)
    
    candidates = [title, original_title]
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

            # Sort results: if is_tv is True, prioritize /dizi/ URLs
            sorted_results = sorted(
                results[:4],
                key=lambda r: (1 if '/dizi/' in r else 0) if is_tv else (0 if '/dizi/' in r else 1),
                reverse=True
            )

            for res_html in sorted_results:
                m_link = re.search(r'href=["\'](https://www\.hdfilmcehennemi\.nl/[^"\']+)["\']', res_html)
                if not m_link:
                    continue
                page_url = m_link.group(1)

                req_p = urllib.request.Request(page_url, headers={'User-Agent': FULL_UA, 'Referer': f"{BASE_URL}/"})
                with urllib.request.urlopen(req_p, timeout=6) as resp_p:
                    p_html = resp_p.read().decode('utf-8', errors='ignore')

                # Check if it is a TV series page
                if is_tv or '/dizi/' in page_url:
                    # Look for the specific season and episode link
                    ep_patterns = [
                        rf'href=["\'](https://www\.hdfilmcehennemi\.nl/dizi/[^"\']*sezon-{s_num}/bolum-{ep_num}[^"\']*)["\']',
                        rf'href=["\'](https://www\.hdfilmcehennemi\.nl/[^"\']*sezon-{s_num}/bolum-{ep_num}[^"\']*)["\']',
                        rf'href=["\']([^"\']*sezon-{s_num}/bolum-{ep_num}[^"\']*)["\']'
                    ]
                    ep_target_url = None
                    for pat in ep_patterns:
                        m_ep = re.search(pat, p_html, re.I)
                        if m_ep:
                            ep_target_url = m_ep.group(1)
                            if ep_target_url.startswith('/'):
                                ep_target_url = f"{BASE_URL}{ep_target_url}"
                            break

                    if not ep_target_url:
                        continue

                    # Fetch episode page
                    req_ep = urllib.request.Request(ep_target_url, headers={'User-Agent': FULL_UA, 'Referer': page_url})
                    with urllib.request.urlopen(req_ep, timeout=6) as resp_ep:
                        ep_html = resp_ep.read().decode('utf-8', errors='ignore')

                    m_iframe = re.search(r'<iframe[^>]+(?:data-src|src)=["\']([^"\']*(?:embed|video|player)[^"\']*)["\']', ep_html, re.I) or re.search(r'<iframe[^>]+(?:data-src|src)=["\']([^"\']+)["\']', ep_html, re.I)
                    if not m_iframe:
                        continue
                    embed_url = m_iframe.group(1)
                    if embed_url.startswith('//'):
                        embed_url = 'https:' + embed_url

                    extracted = extract_from_embed(embed_url, ep_target_url)
                    if extracted and extracted.get('streamUrl'):
                        raw_stream = extracted['streamUrl']
                        proxied_url = f"/api/hls_proxy?url={urllib.parse.quote(raw_stream)}&ref={urllib.parse.quote('https://hdfilmcehennemi.mobi/')}"
                        return {
                            'success': True,
                            'streamUrl': proxied_url,
                            'rawStreamUrl': raw_stream,
                            'movieUrl': ep_target_url,
                            'embedUrl': embed_url,
                            'subtitles': extracted.get('subtitles', [])
                        }
                else:
                    # Movie page
                    m_iframe = re.search(r'<iframe[^>]+(?:data-src|src)=["\']([^"\']*(?:embed|video|player)[^"\']*)["\']', p_html, re.I) or re.search(r'<iframe[^>]+(?:data-src|src)=["\']([^"\']+)["\']', p_html, re.I)
                    if not m_iframe:
                        continue
                    embed_url = m_iframe.group(1)
                    if embed_url.startswith('//'):
                        embed_url = 'https:' + embed_url

                    extracted = extract_from_embed(embed_url, page_url)
                    if extracted and extracted.get('streamUrl'):
                        raw_stream = extracted['streamUrl']
                        proxied_url = f"/api/hls_proxy?url={urllib.parse.quote(raw_stream)}&ref={urllib.parse.quote('https://hdfilmcehennemi.mobi/')}"
                        return {
                            'success': True,
                            'streamUrl': proxied_url,
                            'rawStreamUrl': raw_stream,
                            'movieUrl': page_url,
                            'embedUrl': embed_url,
                            'subtitles': extracted.get('subtitles', [])
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
        season = params.get('season', ['1'])[0]
        episode = params.get('episode', ['1'])[0]
        req_type = params.get('type', [''])[0]
        is_tv = (req_type == 'tv' or bool(params.get('season') and params.get('episode')))

        result = resolve_hdfc_stream(query, original_title, season=season, episode=episode, is_tv=is_tv)

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

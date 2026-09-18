#!/usr/bin/env python3
"""
CinePulse - HDFilmCehennemi Stream & Subtitle Extractor
Supports both Movies & TV Series (Seasons & Episodes)
Pure Python Cloudflare bypass & JS Deobfuscator
"""

import sys
import json
import re
import urllib.request
import urllib.parse
import base64

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
        m_jmx = re.search(r'var\s+[a-zA-Z0-9_]+\s*=\s*["\']([^"\']+)["\'];\s*var\s+[a-zA-Z0-9_]+\s*=\s*["\']([^"\']+)["\'];', func_body)
        if not m_jmx:
            return None
        jmx = m_jmx.group(1)
        nsr1 = m_jmx.group(2)

        stream_url = decode_hdfc(arr, jmx, nsr1)
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

                if is_tv or '/dizi/' in page_url:
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
                        return {
                            'success': True,
                            'streamUrl': extracted['streamUrl'],
                            'movieUrl': ep_target_url,
                            'embedUrl': embed_url,
                            'subtitles': extracted.get('subtitles', [])
                        }
                else:
                    m_iframe = re.search(r'<iframe[^>]+(?:data-src|src)=["\']([^"\']*(?:embed|video|player)[^"\']*)["\']', p_html, re.I) or re.search(r'<iframe[^>]+(?:data-src|src)=["\']([^"\']+)["\']', p_html, re.I)
                    if not m_iframe:
                        continue
                    embed_url = m_iframe.group(1)
                    if embed_url.startswith('//'):
                        embed_url = 'https:' + embed_url

                    extracted = extract_from_embed(embed_url, page_url)
                    if extracted and extracted.get('streamUrl'):
                        return {
                            'success': True,
                            'streamUrl': extracted['streamUrl'],
                            'movieUrl': page_url,
                            'embedUrl': embed_url,
                            'subtitles': extracted.get('subtitles', [])
                        }
        except Exception:
            continue

    return {'success': False, 'error': 'Stream not found'}

def main():
    if len(sys.argv) < 2:
        print(json.dumps({'success': False, 'error': 'Query required'}))
        sys.exit(1)

    query = sys.argv[1]
    original_title = sys.argv[2] if len(sys.argv) > 2 else ''
    season = int(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3].isdigit() else 1
    episode = int(sys.argv[4]) if len(sys.argv) > 4 and sys.argv[4].isdigit() else 1
    req_type = sys.argv[5] if len(sys.argv) > 5 else ''
    is_tv = (req_type == 'tv' or len(sys.argv) > 3)

    result = resolve_hdfc_stream(query, original_title, season=season, episode=episode, is_tv=is_tv)
    print(json.dumps(result))

if __name__ == '__main__':
    main()

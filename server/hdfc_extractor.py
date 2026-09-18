#!/usr/bin/env python3
"""
CinePulse - HDFilmCehennemi Stream & Subtitle Extractor
Bypasses Cloudflare WAF & Extracts direct 1080p HLS master streams
"""

import sys
import json
import re
import urllib.request
import urllib.parse
import subprocess
import os

NODE_PATH = os.environ.get('NODE_PATH') or '/home/cagatay/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
if not os.path.exists(NODE_PATH):
    NODE_PATH = 'node'

BASE_URL = 'https://www.hdfilmcehennemi.nl'

SEARCH_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Referer': f'{BASE_URL}/',
    'X-Requested-With': 'fetch',
    'Content-Type': 'application/json'
}

HTML_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Referer': f'{BASE_URL}/',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
}

def clean_title(title):
    if not title:
        return ''
    t = re.sub(r'\s*-\s*S\d+E\d+.*$', '', title, flags=re.I)
    t = re.sub(r'\s*-\s*S\d+.*$', '', t, flags=re.I)
    t = re.sub(r'\s*\(\d{4}\).*$', '', t)
    return t.strip()

def search_hdfc(query):
    try:
        url = f"{BASE_URL}/search?q={urllib.parse.quote(query)}"
        req = urllib.request.Request(url, headers=SEARCH_HEADERS)
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            results = data.get('results', [])
            return results
    except Exception as e:
        return []

def extract_stream_from_movie_page(movie_url):
    try:
        req = urllib.request.Request(movie_url, headers=HTML_HEADERS)
        with urllib.request.urlopen(req, timeout=8) as resp:
            mhtml = resp.read().decode('utf-8', errors='ignore')

        # Find embed iframe
        m_iframe = re.search(r'<iframe[^>]+(?:data-src|src)=[\"\']([^\"\']*(?:embed|video|player)[^\"\']*)[\"\']', mhtml, re.I)
        if not m_iframe:
            m_iframe = re.search(r'<iframe[^>]+(?:data-src|src)=[\"\']([^\"\']+)[\"\']', mhtml, re.I)
            if not m_iframe:
                return None

        embed_url = m_iframe.group(1)
        if embed_url.startswith('//'):
            embed_url = 'https:' + embed_url

        # Fetch embed HTML with Referer
        embed_headers = dict(HTML_HEADERS)
        embed_headers['Referer'] = movie_url
        req_embed = urllib.request.Request(embed_url, headers=embed_headers)
        with urllib.request.urlopen(req_embed, timeout=8) as resp_embed:
            ehtml = resp_embed.read().decode('utf-8', errors='ignore')

        # Find target var name from sources: [{file: VAR_NAME
        m_src = re.search(r'sources:\s*\[\{file:\s*([a-zA-Z0-9_]+)', ehtml)
        if not m_src:
            return None

        vname = m_src.group(1)
        m_call = re.search(r'var\s+' + vname + r'\s*=\s*([a-zA-Z0-9_]+)\(\[(\s*[\"\'][^\]]+)\]\);', ehtml)
        if not m_call:
            return None

        fname = m_call.group(1)
        arr_str = m_call.group(2)

        m_func = re.search(r'function\s+' + fname + r'\s*\([^)]*\)\s*\{[\s\S]*?\n\}', ehtml)
        if not m_func:
            return None

        func_code = m_func.group(0)
        js_code = f"""
        {func_code}
        const arr = [{arr_str}];
        try {{
          console.log({fname}(arr));
        }} catch(e) {{
          console.error(e);
        }}
        """

        proc = subprocess.run([NODE_PATH, '-e', js_code], capture_output=True, text=True, timeout=5)
        raw_stream = proc.stdout.strip()
        if not raw_stream or not raw_stream.startswith('http'):
            return None

        # Extract subtitles from tracks
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
            'streamUrl': raw_stream,
            'subtitles': subtitles,
            'embedUrl': embed_url
        }
    except Exception as e:
        return None

def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No query provided'}))
        sys.exit(1)

    query = sys.argv[1]
    candidates = [clean_title(query), query]
    if len(sys.argv) > 2 and sys.argv[2]:
        candidates.insert(0, clean_title(sys.argv[2]))
        candidates.insert(1, sys.argv[2])

    candidates = list(dict.fromkeys(c for c in candidates if c))
    
    for c in candidates:
        results = search_hdfc(c)
        if not results:
            continue

        for res_html in results[:3]:
            m_link = re.search(r'href=[\"\'](https://www\.hdfilmcehennemi\.nl/[^\"\']+)[\"\']', res_html)
            if not m_link:
                continue
            movie_url = m_link.group(1)
            stream_data = extract_stream_from_movie_page(movie_url)
            if stream_data and stream_data.get('streamUrl'):
                print(json.dumps({
                    'success': True,
                    'movieUrl': movie_url,
                    'streamUrl': stream_data['streamUrl'],
                    'subtitles': stream_data.get('subtitles', [])
                }))
                return

    print(json.dumps({'success': False, 'message': 'No stream found'}))

if __name__ == '__main__':
    main()

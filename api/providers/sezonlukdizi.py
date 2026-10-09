"""SezonlukDizi ozel resolver: sayfa -> bid -> alternatif player'lar -> embed.
Her player ayri kaynak; dogrulama gerektiren alternatifler de korunur."""
import sys
import os
import re

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from providers.base import (  # noqa: E402
    fetch_html, post_form, get_session_cookie, clean_title,
    proxied, finalize_streams,
)

BASE = 'https://sezonlukdizi.cc'
REF = BASE + '/'



def _slug(t):
    t = (t or '').lower().strip()
    for a, b in (('ğ', 'g'), ('ü', 'u'), ('ş', 's'), ('ı', 'i'), ('ö', 'o'), ('ç', 'c')):
        t = t.replace(a, b)
    t = re.sub(r'[^a-z0-9\s-]', '', t)
    return re.sub(r'-+', '-', re.sub(r'\s+', '-', t)).strip('-')


def _slugs(title, original_title, titles):
    out = []
    for t in [title, original_title] + list(titles or []):
        s = _slug(clean_title(t or ''))
        if not s:
            continue
        for cand in ([s] if s.endswith('-izle') else [s, f"{s}-izle"]):
            if cand not in out:
                out.append(cand)
        if s.startswith('the-') and s[4:] not in out:
            out.append(s[4:])
    return out


def _page_title_match(html, cands):
    m = re.search(r'<title>(.*?)</title>', html, re.S | re.I)
    import html as _htmlmod
    page = re.sub(r'\s+', ' ', _htmlmod.unescape(m.group(1) if m else '')).strip().lower()
    import unicodedata

    def norm(t):
        t = _htmlmod.unescape(unicodedata.normalize('NFKD', t or '').encode('ascii', 'ignore').decode('ascii').lower())
        return re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9\s]', ' ', t)).strip()

    for c in cands:
        n = norm(c)
        if n and (n == norm(page) or n in norm(page)):
            return True
    return False


def _extract_iframe(embed_html):
    m = re.search(r'src=["\']([^"\']+)["\']', embed_html or '', re.I)
    if not m:
        return ''
    u = m.group(1)
    if u.startswith('//'):
        u = 'https:' + u
    return u


def resolve_episode(title='', original_title='', titles=None, season=1, episode=1, want_dub=None):
    s_num, ep_num = int(season or 1), int(episode or 1)
    cands = [t for t in [title, original_title] + list(titles or []) if t and str(t).strip()]
    if not cands:
        return {'success': False, 'error': 'Query required'}
    # want_dub None ise once dublaj sonra altyazi dene (cift cagri yerine tek tur)
    dil_opts = ['0', '1'] if want_dub is None else (['0'] if want_dub else ['1'])
    cookie = get_session_cookie(BASE + '/')
    verification_page = None
    verification_sources = []
    for slug in _slugs(title, original_title, titles):
        page_url = f"{BASE}/{slug}/{s_num}-sezon-{ep_num}-bolum.html"
        html = fetch_html(page_url, REF)
        if not html or len(html) < 500 or not _page_title_match(html, cands):
            continue
        bid_m = (re.search(r'data-id=["\'](\d+)["\']', html, re.I)
                 or re.search(r'var\s+bid\s*=\s*["\']?(\d+)', html, re.I)
                 or re.search(r'bid\s*=\s*(\d+)', html, re.I))
        if not bid_m:
            continue
        for dil in dil_opts:
            alt_raw = post_form(f"{BASE}/ajax/dataAlternatif22.asp", page_url,
                                {'bid': bid_m.group(1), 'dil': dil}, session_cookie=cookie)
            try:
                import json
                alt = json.loads(alt_raw or 'null')
            except Exception:
                continue
            if not isinstance(alt, dict) or alt.get('status') != 'success' or not alt.get('data'):
                continue
            streams = []
            for item in alt['data']:
                if not isinstance(item, dict) or not item.get('id'):
                    continue
                if 'filemoon' in str(item.get('baslik') or '').lower():
                    continue
                em = post_form(f"{BASE}/ajax/dataEmbed22.asp", page_url,
                               {'id': str(item['id'])}, session_cookie=cookie)
                iframe = _extract_iframe(em)
                if not iframe or len(iframe) < 10:
                    continue
                low = iframe.lower() + str(item.get('baslik') or '').lower()
                if any(host in low for host in ('filemoon', 'bysejikuar', 'bysezoxexe')):
                    continue
                if 'recaptcha' in low:
                    verification_page = page_url
                    verification_sources.append({'id': str(item['id']), 'provider': str(item.get('baslik') or 'Player'), 'language': dil})
                    continue
                if not iframe.startswith(('https://', 'http://')):
                    continue
                prov = str(item.get('baslik') or 'Player')
                is_vidmoly = prov == 'VidMoly' or 'vidmoly' in iframe
                streams.append({
                    'provider': 'SZ VidMoly' if is_vidmoly else f"SZ {prov}",
                    'streamUrl': iframe,
                    'rawStreamUrl': iframe,
                    'embedUrl': iframe,
                    'subtitles': [],
                    'tag': str(item['id']),
                })
            if streams or verification_sources:
                result = dict(finalize_streams(streams, page_url), provider='SZ') if streams else {'success': False, 'error': 'Verification required'}
                result.update({'requiresVerification': bool(verification_sources), 'pageUrl': page_url, 'verificationSources': verification_sources})
                return result
    if verification_page:
        return {
            'success': False, 'error': 'Verification required',
            'requiresVerification': True, 'pageUrl': verification_page,
            'verificationSources': verification_sources,
        }
    return {'success': False, 'error': 'No playable source'}

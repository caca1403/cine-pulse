"""SetFilmizle ozel resolver: WP arama -> film sayfasi -> admin-ajax video.
FastPlay 1080p dogrudan HLS master playlisti (X-Sp kaniti ile) cikarir.
Dual Audio (Turkce Dublaj & Altyazili/Orijinal) HLS icinde yerlesiktir.
Not: SetPlay kopru URL'si (setplay.shop/...stfplay.php?t=) video degildir,
frame-ancestors ile uygulamaya kapali bir yukleyicidir; liste kirligi
olmamasi icin kaynaga eklenmez. HLS cozulemeyince ic FastPlay player
URL'si iframe yedegi olur."""
import sys
import os
import re
import time
import random
import base64
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from providers.base import fetch_html, post_form, clean_title, proxied, finalize_streams  # noqa: E402

BASE = 'https://www.setfilmizle.ltd'
REF = BASE + '/'
AJAX = BASE + '/wp-admin/admin-ajax.php'

# Cache dynamic domain check
_LAST_DOMAIN_SYNC = 0
_DOMAINS_URL = 'https://raw.githubusercontent.com/manitux-app/cs-plugins/main/domains.json'


def _sync_domain():
    global BASE, REF, AJAX, _LAST_DOMAIN_SYNC
    now = time.time()
    if now - _LAST_DOMAIN_SYNC < 1800:
        return
    _LAST_DOMAIN_SYNC = now
    try:
        raw = fetch_html(_DOMAINS_URL, timeout=4)
        if raw:
            import json
            data = json.loads(raw)
            d = data.get('setfilm') or data.get('SetFilm')
            if d and d.startswith('http'):
                BASE = d.rstrip('/')
                REF = BASE + '/'
                AJAX = BASE + '/wp-admin/admin-ajax.php'
    except Exception:
        pass


PLAYER_LABELS = {
    'setplay': 'SetPlay',
    'fastplay': 'FastPlay',
    'fast': 'FastPlay',
    'closeload': 'CloseLoad',
    'close': 'CloseLoad',
    'rapidrame': 'Rapidrame',
    'rapid': 'Rapidrame',
}


def _label(name):
    low = (name or '').strip().lower()
    if low in PLAYER_LABELS:
        return PLAYER_LABELS[low]
    clean = re.sub(r'[^a-z0-9]+', '', low)
    if clean in PLAYER_LABELS:
        return PLAYER_LABELS[clean]
    return (name or 'Player').strip()[:24] or 'Player'


def spg_decode(n, o):
    """SPG.cerceve(..., n, o) cozumu: atob(n) XOR atob(o) -> split('|')[0]"""
    try:
        a = base64.b64decode(n)
        b = base64.b64decode(o)
        s = ''.join(chr(a[i] ^ b[i % len(b)]) for i in range(len(a)))
        return s.split('|')[0]
    except Exception:
        return None


def make_x_sp(sp, sp_t):
    """X-Sp header kaniti: FNV-1a32(sp|spT|rand) -> 'spT.rand.hash'"""
    try:
        rnd = hex(random.randint(0, 0xffffffff))[2:]
        proof = f"{sp}|{sp_t}|{rnd}"
        h = 0x811c9dc5
        for ch in proof:
            h = ((h ^ ord(ch)) * 0x01000193) & 0xffffffff
        return f"{sp_t}.{rnd}.{hex(h)[2:]}"
    except Exception:
        return ""


def resolve_fastplay(setplay_url, page_ref=None):
    """SetPlay bridge sayfasini cozup FastPlay HLS master akisini ve altyazilarini dondurur."""
    try:
        sp_html = fetch_html(setplay_url, page_ref or REF, timeout=8)
        if not sp_html:
            return None

        # SPG.cerceve("...", n, o) veya SPG.cerceve(n, o)
        cer_match = re.search(r'SPG\.cerceve\(\s*"[^"]*"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\)', sp_html)
        if not cer_match:
            cer_match = re.search(r'SPG\.cerceve\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\)', sp_html)

        fastplay_url = None
        if cer_match:
            fastplay_url = spg_decode(cer_match.group(1), cer_match.group(2))

        if not fastplay_url:
            f_match = re.search(r'https?://fastplay\.[a-z]+/stfplay\.php\?[^"\'<>\s\\]+', sp_html)
            if f_match:
                fastplay_url = f_match.group(0).replace('\\', '')

        if not fastplay_url or not fastplay_url.startswith('http'):
            return None

        fp_html = fetch_html(fastplay_url, setplay_url, timeout=8)
        if not fp_html:
            return None

        sp_match = re.search(r'"sp"\s*:\s*"([^"]+)"', fp_html)
        spt_match = re.search(r'"spT"\s*:\s*(\d+)', fp_html)
        man_match = re.search(r'(?:src|stream)\s*:\s*"(/manifests/[^"]+)"', fp_html)

        if not man_match or not sp_match or not spt_match:
            return None

        sp = sp_match.group(1)
        spt = spt_match.group(1)
        man_path = man_match.group(1).replace('&amp;', '&')

        fp_origin = re.match(r'^(https?://[^/]+)', fastplay_url).group(1)
        manifest_url = man_path if man_path.startswith('http') else (fp_origin + man_path)
        x_sp = make_x_sp(sp, spt)

        # Altyazilari topla
        subs = []
        sub_block = re.search(r'subtitles\s*:\s*(\[[\s\S]*?\])', fp_html)
        if sub_block:
            try:
                import json
                arr = json.loads(sub_block.group(1))
                for item in arr:
                    if isinstance(item, dict) and item.get('file'):
                        l = item.get('lang') or 'tur'
                        label = item.get('label') or ('Türkçe' if l == 'tur' else 'İngilizce')
                        subs.append({'label': label, 'src': item['file']})
            except Exception:
                pass

        if not subs:
            for sm in re.finditer(r'"file"\s*:\s*"(https?:[^"]+\.vtt)"\s*,\s*"label"\s*:\s*"([^"]+)"', fp_html):
                subs.append({'label': sm.group(2), 'src': sm.group(1).replace('\\/', '/')})

        proxied_stream = f"/api/hls_proxy?url={urllib.parse.quote(manifest_url)}&ref={urllib.parse.quote('https://fastplay.mom/')}&xsp={urllib.parse.quote(x_sp)}"

        return {
            'manifest_url': manifest_url,
            'proxied_stream': proxied_stream,
            'x_sp': x_sp,
            'subtitles': subs,
            'fastplay_url': fastplay_url
        }
    except Exception:
        return None


def _extract_links(html):
    out = []
    for m in re.finditer(r'href="(https://www\.setfilmizle\.[a-z]+/(?:film|dizi)[^"]*)"', html):
        u = m.group(1)
        if re.match(r'^https://www\.setfilmizle\.[a-z]+/(film|dizi)/?$', u):
            continue
        if u not in out:
            out.append(u)
        if len(out) >= 6:
            break
    return out


def search(query):
    _sync_domain()
    queries = [query]
    words = (query or '').split()
    if len(words) > 1 and words[0].lower() not in ('the', 'a', 'an'):
        queries.append(words[0])
    elif len(words) > 1:
        queries.append(' '.join(words[:2]))
    for i, q in enumerate(queries):
        if i:
            time.sleep(0.5)
        html = fetch_html(f"{BASE}/?s={urllib.parse.quote(q)}", REF, timeout=8)
        if not html:
            continue
        out = _extract_links(html)
        if out:
            return out
    return []


def _page_info(page_url):
    html = fetch_html(page_url, REF, timeout=8)
    if not html:
        return None

    # AJAX URL ve Nonce
    ajax_m = re.search(r'window\.STF_AJAX\s*=\s*\{[^}]*url\s*:\s*"([^"]+)"[^}]*nonces\s*:\s*\{[^}]*video\s*:\s*"([^"]+)"', html)
    ajax_url = ajax_m.group(1).replace('\\/', '/') if ajax_m else AJAX
    nonce = ajax_m.group(2) if ajax_m else ''

    if not nonce:
        nm = re.search(r'data-nonce="([a-z0-9]+)"', html)
        if nm:
            nonce = nm.group(1)

    post_m = re.search(r'data-post-id="(\d+)"', html)
    tabs = []
    for b in re.finditer(r'<button[^>]*class="[^"]*src-tab[^"]*"[^>]*>', html):
        tag = b.group(0)
        nm = re.search(r'data-player-name="([^"]+)"', tag)
        pm = re.search(r'data-part-key="([^"]*)"', tag)
        if nm:
            tabs.append((nm.group(1), pm.group(1) if pm else ''))
    if not tabs:
        for m in re.finditer(r'data-player-name="([^"]+)"', html):
            pname = m.group(1)
            if (pname, '') not in tabs:
                tabs.append((pname, ''))

    if not post_m or not tabs:
        return None
    return {
        'post_id': post_m.group(1),
        'nonce': nonce,
        'ajax_url': ajax_url,
        'tabs': tabs[:6],
        'html': html,
    }


def _extract_episodes(series_html):
    """Cloudstream SetFilm load() mantigi: dizi sayfasindaki
    .season-panel a.fep[href] bolum linklerini S/E ile eslestir.
    Donus: [(season, episode, url)] listesi."""
    out = []
    if not series_html:
        return out
    # Sezon panellerini ayri ayri tara (data-season attribute'u en guvenilir)
    panel_re = re.compile(
        r'<div[^>]*class="[^"]*season-panel[^"]*"[^>]*data-season="(\d+)"[^>]*>(.*?)</div>\s*</div>',
        re.S | re.I)
    panels = panel_re.findall(series_html)
    if not panels:
        # Fallback: tum fep linklerini URL'deki X-sezon-Y-bolum deseninden coz
        for m in re.finditer(r'href="(https://www\.setfilmizle\.[a-z]+/bolum/[^"]+)"', series_html):
            u = m.group(1)
            sm = re.search(r'-(\d+)-sezon-(\d+)-bolum', u)
            if sm:
                out.append((int(sm.group(1)), int(sm.group(2)), u))
        return out
    for season_str, body in panels:
        try:
            s_num = int(season_str)
        except Exception:
            s_num = 1
        for m in re.finditer(r'href="(https://www\.setfilmizle\.[a-z]+/bolum/[^"]+)"', body):
            u = m.group(1)
            em = re.search(r'-(\d+)-sezon-(\d+)-bolum', u)
            if em:
                try:
                    out.append((int(em.group(1)), int(em.group(2)), u))
                except Exception:
                    pass
            else:
                # Desen yoksa panel sezon + sira no ile tahmin et
                out.append((s_num, len([x for x in out if x[0] == s_num]) + 1, u))
    # Duplikasyonlari kaldir (URL bazli)
    seen = set()
    uniq = []
    for s, e, u in out:
        if u not in seen:
            seen.add(u)
            uniq.append((s, e, u))
    return uniq


def _pick_episode(series_html, season, episode):
    eps = _extract_episodes(series_html)
    if not eps:
        return None
    try:
        s_num = int(season)
    except Exception:
        s_num = 1
    try:
        e_num = int(episode)
    except Exception:
        e_num = 1
    for s, e, u in eps:
        if s == s_num and e == e_num:
            return u
    # Ayni sezonun ilk bolumu yedegi (Cloudstream davranisi: en yakin bolum)
    same_season = [u for s, e, u in eps if s == s_num]
    if same_season:
        return same_season[0]
    return eps[0][2]


def _ajax_video(ajax_url, page_url, post_id, nonce, name, part):
    for attempt in range(2):
        raw = post_form(ajax_url or AJAX, page_url,
                        {'action': 'get_video_url', 'nonce': nonce,
                         'post_id': post_id, 'player_name': name,
                         'part_key': part or ''}, timeout=8)
        try:
            import json
            data = json.loads(raw or 'null')
        except Exception:
            data = None
        if isinstance(data, dict) and data.get('success') and isinstance(data.get('data'), dict):
            return data['data']
        time.sleep(0.4 + attempt * 0.4)
    return None


def _resolve_page(page_url, cands):
    info = _page_info(page_url)
    if not info:
        return []
    title_m = re.search(r'<title>(.*?)</title>', info['html'], re.S | re.I)
    import html as _htmlmod
    import unicodedata
    page_title = re.sub(r'\s+', ' ', _htmlmod.unescape(title_m.group(1) if title_m else '')).strip().lower()
    if page_title and cands:
        def norm(t):
            t = _htmlmod.unescape(unicodedata.normalize('NFKD', t or '').encode('ascii', 'ignore').decode('ascii').lower())
            return re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9\s]', ' ', t)).strip()

        if not any(n and (n == norm(page_title) or n in norm(page_title)) for n in [norm(c) for c in cands]):
            return []

    streams = []
    seen_urls = set()

    for name, part in info['tabs']:
        data = _ajax_video(info['ajax_url'], page_url, info['post_id'], info['nonce'], name, part)
        if not data or not isinstance(data.get('stream'), dict):
            continue
        st = data['stream']
        prov = _label(data.get('provider') or name)
        subs = []
        for s in data.get('subtitles') or []:
            if isinstance(s, dict) and s.get('src'):
                subs.append({'label': s.get('label') or f"Türkçe ({prov})", 'src': s['src']})
            elif isinstance(s, str) and s.startswith('http'):
                subs.append({'label': f"Türkçe ({prov})", 'src': s})

        setplay_url = st.get('url') or st.get('src')
        if st.get('type') == 'bridge' and setplay_url:
            if setplay_url in seen_urls:
                continue
            seen_urls.add(setplay_url)

            # 1. FastPlay direct HLS extraction (SPG.cerceve -> fastplay.mom master HLS)
            #    Bu birincil ve her yerde calisan kaynaktir (Cloudstream
            #    SetFilmPlayer.resolve ile ayni: kopru sayfa cozulup
            #    dogrudan M3U8 emit edilir, kopru URL asla oynatilmez).
            fp_info = resolve_fastplay(setplay_url, page_url)
            if fp_info and fp_info.get('proxied_stream'):
                all_subs = (fp_info.get('subtitles') or []) + subs
                streams.append({
                    'provider': 'FastPlay',
                    'streamUrl': fp_info['proxied_stream'],
                    'rawStreamUrl': fp_info['manifest_url'],
                    'embedUrl': setplay_url,
                    'isHls': True,
                    'subtitles': all_subs,
                    'isDual': True,  # HLS contains both Dub & Sub tracks
                    'headers': {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Referer': 'https://fastplay.mom/',
                        'X-Sp': fp_info['x_sp']
                    }
                })
                continue

            # 2. HLS cozulemedi: kopru URL degil, icerdeki FastPlay player
            #    URL'sini iframe yedegi yap. Kopru (setplay.shop) frame-ancestors
            #    ile sadece setfilmizle.ltd'ye izin verir, uygulamadan acilmaz;
            #    ic player (fastplay.mom) en azindan localhost'ta ve
            #    Cloudstream desteginde acilir.
            fallback_embed = None
            try:
                sp_html = fetch_html(setplay_url, page_url, timeout=8)
                if sp_html:
                    cer_match = re.search(r'SPG\.cerceve\(\s*"[^"]*"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\)', sp_html)
                    if not cer_match:
                        cer_match = re.search(r'SPG\.cerceve\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\)', sp_html)
                    if cer_match:
                        fallback_embed = spg_decode(cer_match.group(1), cer_match.group(2))
                    if not fallback_embed:
                        f_match = re.search(r'https?://fastplay\.[a-z]+/stfplay\.php\?[^"\'<>\s\\]+', sp_html)
                        if f_match:
                            fallback_embed = f_match.group(0).replace('\\', '')
            except Exception:
                fallback_embed = None
            if fallback_embed and fallback_embed.startswith('http'):
                streams.append({
                    'provider': 'FastPlay',
                    'streamUrl': fallback_embed,
                    'rawStreamUrl': fallback_embed,
                    'embedUrl': setplay_url,
                    'isIframe': True,
                    'subtitles': subs,
                })
            # Kopru URL'nin kendisi (setplay.shop/...stfplay.php?t=) video
            # degil yukleyicidir ve frame-ancestors disi oldugu icin
            # uygulamadan acilmaz -> liste kirligi olmamasi icin eklenmez.

        elif st.get('src') and str(st['src']).startswith('http'):
            raw = st['src']
            streams.append({
                'provider': prov,
                'streamUrl': proxied(raw, REF),
                'rawStreamUrl': raw,
                'embedUrl': page_url,
                'subtitles': subs,
            })

    return streams


def _candidates(title, original_title, titles):
    out = []
    for t in [title, original_title] + list(titles or []):
        c = clean_title(t or '')
        if c and c not in out:
            out.append(c)
    return out


def resolve_movie(title='', original_title='', titles=None):
    cands = _candidates(title, original_title, titles)
    if not cands:
        return {'success': False, 'error': 'Query required'}
    for q in cands[:3]:
        for page_url in search(q):
            if '/dizi/' in page_url:
                continue
            streams = _resolve_page(page_url, cands)
            if streams:
                return dict(finalize_streams(streams, page_url), provider='SET')
    return {'success': False, 'error': 'No playable source'}


def resolve_episode(title='', original_title='', titles=None, season=1, episode=1):
    """Cloudstream SetFilm load() mantigi:
    Film -> sayfadaki player sekmeleri direkt cozulur.
    Dizi -> /dizi/ sayfasindaki .season-panel a.fep[href] listesinden
    S/E'ye uyan /bolum/ URL'si secilir, AYNI loadLinks (_resolve_page)
    o bolum sayfasinda calistirilir. Boylece hem film hem dizi
    ayni FastPlay/SetPlay kaynaklarini gosterir."""
    cands = _candidates(title, original_title, titles)
    if not cands:
        return {'success': False, 'error': 'Query required'}
    for q in cands[:3]:
        for page_url in search(q):
            if '/film/' in page_url and '/dizi/' not in page_url:
                continue
            # Dizi ana sayfasi mi, direkt bolum sayfasi mi?
            if '/bolum/' in page_url:
                ep_url = page_url
            else:
                series_html = fetch_html(page_url, REF, timeout=8)
                if not series_html:
                    continue
                ep_url = _pick_episode(series_html, season, episode)
                if not ep_url:
                    continue
            streams = _resolve_page(ep_url, cands)
            if streams:
                return dict(finalize_streams(streams, ep_url), provider='SET')
    return {'success': False, 'error': 'No playable source'}

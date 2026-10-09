#!/usr/bin/env python3
"""
CinePulse - HDFilmCehennemi Stream & Subtitle Extractor (local mediaServer icin)
Gercek cozumleme api/hdfc_stream.py icindedir (CloseLoad + Rapidrame);
bu dosya ince bir sarmalayicidir, cift bakim yapilmaz.
"""

import sys
import os
import json

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'api'))

from hdfc_stream import (  # noqa: F401,E402
    resolve_hdfc_stream,
    collect_page_streams,
    extract_from_embed,
    extract_rapidrame_stream,
    BASE_URL,
)


def main():
    if len(sys.argv) < 2:
        print(json.dumps({'success': False, 'error': 'Query required'}))
        sys.exit(1)

    query = sys.argv[1]
    original_title = sys.argv[2] if len(sys.argv) > 2 else ''
    season = int(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3].isdigit() else 1
    episode = int(sys.argv[4]) if len(sys.argv) > 4 and sys.argv[4].isdigit() else 1
    req_type = (sys.argv[5] if len(sys.argv) > 5 else '').lower().strip()
    is_tv = req_type in ['tv', 'series', 'anime', 'show']

    result = resolve_hdfc_stream(query, original_title, season=season, episode=episode, is_tv=is_tv)
    print(json.dumps(result))


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""Python sağlayıcı katmanı — yerel hızlı tarama.
Cihaz gerekmez; bu makinenin ağı sağlayıcı sitelerine erişebiliyor.
Kullanım: python3 tests/providerSweepLocal.py [film|dizi]
"""
import sys, time, traceback
sys.path.insert(0, 'api')
from providers import (dizisol, sinewix, sezonlukdizi, diziyou,
                       setfilm, webteizle, selcukflix, fullhdfilmizlesene,
                       dizilla, filmekseni)

FILM = dict(title='Interstellar', original_title='Interstellar',
            titles=['Interstellar', 'Yıldızlararası'], tmdb_id='157336')
DIZI = dict(title='Stranger Things', original_title='Stranger Things',
            titles=['Stranger Things'], tmdb_id='66732')

def dene(ad, fn, *a, **kw):
    t = time.time()
    try:
        r = fn(*a, **kw) or {}
        n = len(r.get('streams') or [])
        durum = '✓' if (r.get('success') and n) else ('·' if r.get('success') else '✗')
        ilk = (r.get('streams') or [{}])[0].get('streamUrl', '') if n else ''
        print(f"  {durum} {ad:<16} {n:>2} kaynak {int((time.time()-t)*1000):>6}ms  {str(r.get('error') or '')[:34]:<34} {str(ilk)[:58]}")
        return n
    except Exception as e:
        print(f"  ! {ad:<16} HATA {int((time.time()-t)*1000):>6}ms  {str(e)[:70]}")
        if '--trace' in sys.argv: traceback.print_exc()
        return -1

mod = sys.argv[1] if len(sys.argv) > 1 else 'tumu'

print("═══ FİLM ═══")
if mod in ('tumu', 'film'):
    dene('setfilm', setfilm.resolve_movie, **{k: FILM[k] for k in ('title', 'original_title', 'titles')})
    dene('selcukflix', selcukflix.resolve_movie, **{k: FILM[k] for k in ('title', 'original_title', 'titles')})
    dene('fullhd', fullhdfilmizlesene.resolve_movie, **{k: FILM[k] for k in ('title', 'original_title', 'titles')})
    dene('webteizle', webteizle.resolve_movie, FILM['title'], FILM['original_title'], FILM['titles'], False)
    dene('filmekseni', filmekseni.resolve_movie, FILM['title'], FILM['original_title'], FILM['titles'])
    dene('dizisol', dizisol.resolve_movie, FILM['title'], FILM['original_title'], FILM['titles'], FILM['tmdb_id'])
    dene('sinewix', sinewix.resolve_movie, FILM['title'], FILM['original_title'], FILM['titles'], None, False)

print("═══ DİZİ (S1B3) ═══")
if mod in ('tumu', 'dizi'):
    dene('setfilm', setfilm.resolve_episode, title=DIZI['title'], original_title=DIZI['original_title'], titles=DIZI['titles'], season=1, episode=3)
    dene('selcukflix', selcukflix.resolve_episode, title=DIZI['title'], original_title=DIZI['original_title'], titles=DIZI['titles'], season=1, episode=3)
    dene('dizisol', dizisol.resolve_episode, DIZI['title'], DIZI['original_title'], DIZI['titles'], DIZI['tmdb_id'], 1, 3)
    dene('diziyou', diziyou.resolve_episode, DIZI['title'], DIZI['original_title'], DIZI['titles'], 1, 3)
    dene('sezonlukdizi', sezonlukdizi.resolve_episode, DIZI['title'], DIZI['original_title'], DIZI['titles'], 1, 3, False)
    dene('dizilla', dizilla.resolve_episode, DIZI['title'], DIZI['original_title'], DIZI['titles'], 1, 3)
    dene('filmekseni', filmekseni.resolve_episode, DIZI['title'], DIZI['original_title'], DIZI['titles'], 1, 3)
    dene('sinewix', sinewix.resolve_episode, DIZI['title'], DIZI['original_title'], DIZI['titles'], None, 1, 3, False)

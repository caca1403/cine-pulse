import urllib.request, re

for script in ['/assets/front/js/cehennem.js', '/dist/js/home.js', '/dist/js/main.js']:
    try:
        url = 'https://www.hdfilmcehennemi.nl' + script
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        content = urllib.request.urlopen(req, timeout=5).read().decode('utf-8', errors='ignore')
        print(script, 'length:', len(content))
        search_terms = re.findall(r'["\'](/[^"\']*(?:search|query|ara|suggest)[^"\']*)["\']', content, re.I)
        print('  endpoints:', set(search_terms[:15]))
    except Exception as e:
        print(script, 'error:', e)


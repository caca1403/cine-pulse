import sys, urllib.request, re, json
sys.path.insert(0, 'api')
import hdfc_stream

for base in hdfc_stream.BASE_URLS:
    print("Testing base:", base)
    for path in ['/search/?q=Deadpool', '/search?q=Deadpool', '/ara/?q=Deadpool', '/?s=Deadpool']:
        url = f"{base}{path}"
        try:
            req = urllib.request.Request(url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Referer': f"{base}/",
                'X-Requested-With': 'XMLHttpRequest'
            })
            resp = urllib.request.urlopen(req, timeout=5)
            content = resp.read().decode('utf-8', errors='ignore')
            print(f"  {path} -> Status: {resp.status}, Content-Type: {resp.headers.get('Content-Type')}, Length: {len(content)}")
            if 'json' in resp.headers.get('Content-Type', '').lower():
                print("  JSON:", content[:200])
            elif 'deadpool' in content.lower():
                print("  Found Deadpool in response!")
        except Exception as e:
            print(f"  {path} -> Error: {e}")


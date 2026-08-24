async function unpackFullRapid() {
  const { execSync } = await import('child_process');
  const embedUrl = 'https://rapid.filmmakinesi.to/embed-mfc3ts6wtlun/';
  const cmd = `curl.exe -s --max-time 8 -H "Referer: https://filmmakinesi.to/" -H "Origin: https://filmmakinesi.to" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" "${embedUrl}"`;
  const html = execSync(cmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });

  const evalRegex = /eval\(function\(p,a,c,k,e,d\)[\s\S]*?\.split\('\|'\),0,\{\}\)\)/;
  const match = html.match(evalRegex);
  if (match) {
    const codeToRun = match[0].replace(/^eval\(/, '(');
    const unpackedCode = (new Function(`return ${codeToRun}`))();
    
    // Evaluate in safe runner sandbox
    const runner = new Function('atob', 'btoa', 'String', 'Math', `
      let captured = null;
      // Mock jwplayer or player setup to capture sources
      const window = {
        location: { href: 'https://rapid.filmmakinesi.to/' },
        top: { location: { href: 'https://filmmakinesi.to/' } }
      };
      const document = {
        getElementById: () => ({ innerHTML: '' }),
        createElement: () => ({ appendChild: () => {} }),
        location: { href: 'https://rapid.filmmakinesi.to/' }
      };
      const jwplayer = function(id) {
        return {
          setup: function(config) {
            captured = config;
            return this;
          },
          on: function() { return this; }
        };
      };
      ${unpackedCode}
      return { captured, s: typeof s !== 'undefined' ? s : null };
    `);

    const res = runner(atob, btoa, String, Math);
    console.log('Captured result:', res);
  }
}

unpackFullRapid();

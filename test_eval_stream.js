async function testEvalStream() {
  const { execSync } = await import('child_process');
  const embedUrl = 'https://rapid.filmmakinesi.to/embed-mfc3ts6wtlun/';
  const cmd = `curl.exe -s --max-time 8 -H "Referer: https://filmmakinesi.to/" -H "Origin: https://filmmakinesi.to" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" "${embedUrl}"`;
  const html = execSync(cmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });

  const evalRegex = /eval\(function\(p,a,c,k,e,d\)[\s\S]*?\.split\('\|'\),0,\{\}\)\)/;
  const match = html.match(evalRegex);
  if (match) {
    const codeToRun = match[0].replace(/^eval\(/, '(');
    const unpackedCode = (new Function(`return ${codeToRun}`))();
    
    // Find var s_...
    const varMatch = unpackedCode.match(/var\s+(s_[a-zA-Z0-9_]+)\s*=/);
    if (varMatch) {
      const varName = varMatch[1];
      const runner = new Function('atob', 'btoa', 'String', 'Math', `
        ${unpackedCode}
        return ${varName};
      `);
      const streamUrl = runner(atob, btoa, String, Math);
      console.log('UNPACKED MASTER STREAM URL:', streamUrl);
    }
  }
}

testEvalStream();

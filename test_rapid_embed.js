async function testRapidEmbed() {
  const { execSync } = await import('child_process');
  const embedUrl = 'https://rapid.filmmakinesi.to/embed-mfc3ts6wtlun/';
  const cmd = `curl.exe -s --max-time 8 -H "Referer: https://filmmakinesi.to/" -H "Origin: https://filmmakinesi.to" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" "${embedUrl}"`;
  const html = execSync(cmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
  console.log('Embed length:', html.length);
  
  // Unpack rapid
  const evalRegex = /eval\(function\(p,a,c,k,e,d\)[\s\S]*?\.split\('\|'\),0,\{\}\)\)/;
  const match = html.match(evalRegex);
  if (match) {
    console.log('Eval found!');
    const codeToRun = match[0].replace(/^eval\(/, '(');
    const unpackedCode = (new Function(`return ${codeToRun}`))();
    console.log('Unpacked code (first 500 chars):\n', unpackedCode.substring(0, 500));
  }
}

testRapidEmbed();

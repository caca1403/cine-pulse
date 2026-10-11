/* /api/dzb isteğini [..all].js handler'ına yerelde ver: hangi dal işliyor? */
const mod = await import('../api/[...all].js');

function mockRes() {
  const r = {
    statusCode: 200, headers: {}, body: '', ended: false,
    setHeader(k, v) { this.headers[k.toLowerCase()] = v; return this; },
    getHeader(k) { return this.headers[k.toLowerCase()]; },
    status(c) { this.statusCode = c; return this; },
    send(b) { this.body = typeof b === 'string' ? b : JSON.stringify(b); this.ended = true; return this; },
    json(b) { this.body = JSON.stringify(b); this.ended = true; return this; },
    redirect(c, u) { this.statusCode = c; this.body = `redirect ${u}`; this.ended = true; return this; },
    end(b) { if (b) this.body = b; this.ended = true; return this; },
    write(c) { this.body += c; return true; },
    on() { return this; },
    once() { return this; },
    emit() { return false; }
  };
  return r;
}

async function try_(url) {
  const req = {
    url,
    method: 'GET',
    headers: { 'user-agent': 'Mozilla/5.0 Chrome/124', host: 'localhost' },
    socket: { remoteAddress: '127.0.0.1' },
    on() { return this; }, once() { return this; }, pipe() { return this; }
  };
  const res = mockRes();
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    await mod.default(req, res);
  } catch (e) {
    return { url, status: 'İSTİSNA', type: '', body: String(e.message).slice(0, 120) };
  } finally {
    clearTimeout(t);
  }
  return {
    url,
    status: res.statusCode,
    type: (res.headers['content-type'] || '').split(';')[0],
    body: (res.body || '').slice(0, 130)
  };
}

for (const u of [
  '/api/dzb?path=ara/oneri&q=kara',
  '/api/dzb/ara/oneri?q=kara',
  '/api/dzs?path=x',
  '/api/vod',
  '/api/rtv',
  '/api/kvip'
]) {
  const r = await try_(u);
  console.log(`${r.status === 'İSTİSNA' ? '!!' : String(r.status).padStart(3)}  ${r.type.padEnd(18)} ${u}`);
  console.log(`     ${r.body.replace(/\n/g, ' ')}`);
}
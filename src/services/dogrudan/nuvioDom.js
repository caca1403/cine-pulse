/* ==========================================================================
   CinePulse Studio — Nuvio motoru DOM/cheerio altkümesi (kullanıcı 2026-10-29)
   Nuvio'nun DomBridge.kt'si QuickJS'e cheerio.load() enjekte eder (host tarafı
   gerçek HTML parser). Bizde DOMParser var ama provider'ların beklediği API
   cheerio: load(html) → $(selector) → her bir metot. WebView'da DOMParser
   NATİF; Node test ortamında yok → aşağıdaki mini-parser devreye girer.
   Desteklenen çağrı yüzeyi, patr0n deposundaki gerçek kullanımın süperkümesidir:
   $(sel[, ctx]), .each, .text, .attr(name[,v]), .val, .html, .find, .first,
   .eq, .last, .length, .closest, .parent, .children, .is; $.html(el).
   Seçici altkümesi: etiket/#id/.class/[attr],[attr=v],[attr^=v$=v*=v], boşluk
   (soy), '>' (çocuk), virgül (ve-yada). Kütüphane kopyalanmaz — ~200 satır.
   ========================================================================== */

const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const RAW_TAGS = new Set(['script', 'style', 'textarea', 'title', 'noscript']);
// Kendiliğinden kapanma: YENİ açılan etiket (sol anahtar), açık üstteki
// etiketi (sağ taraf) kapatır — HTML standardının ördüğü desenler. tersine
// çevrildiğinde (p açılınca section kapanır!) ağaç çöker — ilk sürümde buydu.
const AUTO_CLOSE = {
  p: new Set(['p']),
  li: new Set(['li']),
  dt: new Set(['dt', 'dd']), dd: new Set(['dt', 'dd']),
  tr: new Set(['tr', 'td', 'th']), td: new Set(['td', 'th']), th: new Set(['td', 'th']),
  thead: new Set(['thead', 'tbody', 'tfoot']), tbody: new Set(['thead', 'tbody', 'tfoot']), tfoot: new Set(['thead', 'tbody', 'tfoot']),
  option: new Set(['option', 'optgroup']), optgroup: new Set(['option', 'optgroup']),
};
const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', ndash: '–', mdash: '—', laquo: '«', raquo: '»', hellip: '…', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', euro: '€', trade: '™', reg: '®', copy: '©', deg: '°', middot: '·', bull: '•', hellip2: '…' };

function decodeEntities(s) {
  return String(s).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, g) => {
    if (g[0] === '#') {
      const code = g[1] ? parseInt(g.slice(2), 16) : parseInt(g.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[g.toLowerCase()] ?? m;
  });
}

/* ── mini HTML parser (Node için güvence; WebView'da DOMParser kullanılır) ─ */
export function parseHtml(html) {
  const root = { nodeType: 9, nodeName: '#document', children: [], parent: null };
  const stack = [root];
  const src = String(html || '');
  let i = 0;
  const top = () => stack[stack.length - 1];
  const closeTag = (name) => {
    for (let k = stack.length - 1; k > 0; k--) {
      if (stack[k].tagName === name) { stack.length = k; return true; }
    }
    return false;
  };
  while (i < src.length) {
    const lt = src.indexOf('<', i);
    if (lt < 0) { const text = src.slice(i); if (text) top().children.push({ nodeType: 3, text: decodeEntities(text), parent: top() }); break; }
    if (lt > i) { const text = src.slice(i, lt); if (text.trim()) top().children.push({ nodeType: 3, text: decodeEntities(text), parent: top() }); }
    if (src.startsWith('<!--', lt)) { const end = src.indexOf('-->', lt); i = end < 0 ? src.length : end + 3; continue; }
    if (src.startsWith('<!', lt) || src.startsWith('<?', lt)) { const end = src.indexOf('>', lt); i = end < 0 ? src.length : end + 1; continue; }
    const closeMatch = /^<\/\s*([a-zA-Z][\w:-]*)\s*>/.exec(src.slice(lt));
    if (closeMatch) { closeTag(closeMatch[1].toLowerCase()); i = lt + closeMatch[0].length; continue; }
    const openMatch = /^<\s*([a-zA-Z][\w:-]*)([^>]*)>/.exec(src.slice(lt));
    if (!openMatch) { top().children.push({ nodeType: 3, text: '<', parent: top() }); i = lt + 1; continue; }
    const tagName = openMatch[1].toLowerCase();
    const attrsText = openMatch[2];
    const selfClose = /\/\s*$/.test(attrsText);
    // ham metin etiketleri: kapama etiketine kadar içeriği düz metin say
    if (RAW_TAGS.has(tagName)) {
      const closeIdx = src.toLowerCase().indexOf('</' + tagName, lt + openMatch[0].length);
      const inner = src.slice(lt + openMatch[0].length, closeIdx < 0 ? src.length : closeIdx);
      const el = makeEl(tagName, attrsText, top());
      if (inner.trim()) el.children.push({ nodeType: 3, text: inner, parent: el });
      if (!selfClose) { /* kapama aşağıda yenecek */ }
      i = closeIdx < 0 ? src.length : src.indexOf('>', closeIdx) + 1;
      continue;
    }
    const auto = AUTO_CLOSE[tagName];
    if (auto && auto.has(top().tagName)) stack.pop();
    const el = makeEl(tagName, attrsText, top());
    if (!selfClose && !VOID_TAGS.has(tagName)) stack.push(el);
    i = lt + openMatch[0].length;
  }
  return root;
}

function makeEl(tagName, attrsText, parent) {
  const el = { nodeType: 1, tagName, attrs: new Map(), children: [], parent };
  const re = /([a-zA-Z_:@][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  while ((m = re.exec(attrsText || ''))) {
    el.attrs.set(m[1].toLowerCase(), decodeEntities(m[2] ?? m[3] ?? m[4] ?? ''));
  }
  parent.children.push(el);
  return el;
}

/* ── Node tarafı: kendi parser'ımızdan, WebView'da: natif DOMParser'dan
   ortak ağaç modeline çevir. Böylece query/metot katmanı tek kod yolu. ───── */
function fromNativeDoc(doc) {
  const convert = (node, parent) => {
    if (node.nodeType === 3 || node.nodeType === 4) return { nodeType: 3, text: node.nodeValue || '', parent };
    if (node.nodeType !== 1) return null;
    const el = { nodeType: 1, tagName: node.tagName.toLowerCase(), attrs: new Map(), children: [], parent };
    if (node.attributes) for (const a of node.attributes) el.attrs.set(a.name.toLowerCase(), a.value);
    for (const child of node.childNodes) { const c = convert(child, el); if (c) el.children.push(c); }
    return el;
  };
  const body = doc.body || doc.documentElement;
  const root = { nodeType: 9, nodeName: '#document', children: [], parent: null };
  if (body) for (const child of body.childNodes) { const c = convert(child, root); if (c) root.children.push(c); }
  return root;
}

export function loadDocument(html) {
  if (typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(String(html || ''), 'text/html');
      return fromNativeDoc(doc);
    } catch (_) { /* mini parser'a düş */ }
  }
  return parseHtml(html);
}

/* ── seçici motoru: "div.a > b.c[x], #id" altkümesi ─────────────────────── */
function parseSelector(sel) {
  return String(sel).split(',').map(part => parseCompoundChain(part.trim())).filter(Boolean);
}
function parseCompoundChain(part) {
  const chain = [];
  const tokens = part.match(/>|\S+/g) || [];
  let combinator = 'descendant';
  for (const t of tokens) {
    if (t === '>') { combinator = 'child'; continue; }
    chain.push({ combinator, simple: parseSimple(t) });
    combinator = 'descendant';
  }
  return chain.length ? chain : null;
}
function parseSimple(text) {
  // Regex karakter-sınıfı tuzaklarına düşmeyen küçük tokenizer: '#', '.', '[..]'
  // sınırlarına göre parçala; düz metin = etiket veya '*'.
  const out = { tag: null, id: null, cls: [], attrs: [] };
  let rest = String(text);
  const attrRe = /^\[([\w-]+)\s*(?:([~^$*|]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]]*)))?\]/;
  while (rest.length) {
    if (rest[0] === '#') { const m = /^[#\w-]+/.exec(rest)[0]; out.id = m.slice(1); rest = rest.slice(m.length); continue; }
    if (rest[0] === '.') { const m = /^\.[\w-]+/.exec(rest)[0]; out.cls.push(m.slice(1)); rest = rest.slice(m.length); continue; }
    if (rest[0] === '[') {
      const m = attrRe.exec(rest);
      if (!m) { rest = rest.slice(1); continue; }
      const val = m[3] ?? m[4] ?? m[5];
      out.attrs.push({ name: m[1].toLowerCase(), op: m[2] || null, value: val != null ? decodeEntities(val) : null });
      rest = rest.slice(m[0].length);
      continue;
    }
    const m = /^[a-zA-Z_][\w:-]*|^\*/.exec(rest);
    if (!m) { rest = rest.slice(1); continue; }
    if (m[0] !== '*') out.tag = m[0].toLowerCase();
    rest = rest.slice(m[0].length);
  }
  return out;
}
function matchesSimple(el, s) {
  if (!el || el.nodeType !== 1) return false;
  if (s.tag && el.tagName !== s.tag) return false;
  if (s.id && el.attrs.get('id') !== s.id) return false;
  if (s.cls.length) {
    const classes = (el.attrs.get('class') || '').split(/\s+/);
    for (const c of s.cls) if (!classes.includes(c)) return false;
  }
  for (const a of s.attrs) {
    const v = el.attrs.get(a.name);
    if (v === undefined) return false;
    if (a.op && a.value != null) {
      if (a.op === '=' && v !== a.value) return false;
      if (a.op === '^=' && !v.startsWith(a.value)) return false;
      if (a.op === '$=' && !v.endsWith(a.value)) return false;
      if (a.op === '*=' && !v.includes(a.value)) return false;
      if (a.op === '~=' && !v.split(/\s+/).includes(a.value)) return false;
      if (a.op === '|=' && !(v === a.value || v.startsWith(a.value + '-'))) return false;
    }
  }
  return true;
}
function walk(el, fn) { for (const c of el.children) { if (c.nodeType === 1) { if (fn(c) === false) return false; if (walk(c, fn) === false) return false; } } return true; }
function chainMatches(el, chain, idx, root) {
  if (!matchesSimple(el, chain[idx].simple)) return false;
  if (idx === 0) return true;
  const step = chain[idx];
  if (step.combinator === 'child') {
    return el.parent && chainMatches(el.parent, chain, idx - 1, root) && el.parent.nodeType === 1;
  }
  for (let p = el.parent; p && p !== root.parent && p.nodeType === 1; p = p.parent) {
    if (chainMatches(p, chain, idx - 1, root)) return true;
  }
  return false;
}
function queryAll(root, sel) {
  const chains = parseSelector(sel);
  const res = [];
  walk(root, (el) => {
    for (const chain of chains) {
      if (chainMatches(el, chain, chain.length - 1, root)) { res.push(el); break; }
    }
  });
  return res;
}

/* ── cheerio sarmalayıcı ────────────────────────────────────────────────── */
function textOf(el) {
  let out = '';
  for (const c of el.children) out += c.nodeType === 3 ? c.text : textOf(c);
  return out;
}
function htmlOf(el) {
  let out = '';
  for (const c of el.children) {
    if (c.nodeType === 3) out += c.text;
    else {
      let attrs = '';
      for (const [k, v] of c.attrs) attrs += ` ${k}="${v.replace(/"/g, '&quot;')}"`;
      out += `<${c.tagName}${attrs}>${htmlOf(c)}</${c.tagName}>`;
    }
  }
  return out;
}

function wrap(root, els) {
  const $set = els.slice();
  Object.defineProperty($set, 'length', { value: els.length });
  $set.text = () => els.map(textOf).join('');
  $set.html = () => (els[0] ? htmlOf(els[0]) : '');
  $set.attr = (name, value) => {
    if (typeof name === 'object') return els[0] || null;
    if (value !== undefined) { for (const el of els) el.attrs.set(String(name).toLowerCase(), String(value)); return $set; }
    return els[0] ? (els[0].attrs.get(String(name).toLowerCase()) ?? undefined) : undefined;
  };
  $set.val = () => els[0] ? (els[0].attrs.get('value') ?? '') : '';
  $set.find = (sel) => { const found = []; for (const el of els) for (const q of queryAll(el, sel)) if (!found.includes(q)) found.push(q); return wrap(root, found); };
  $set.children = (sel) => { const kids = []; for (const el of els) for (const c of el.children) if (c.nodeType === 1 && (!sel || queryAll(el, sel).includes(c))) kids.push(c); return wrap(root, kids); };
  $set.parent = () => wrap(root, els.map(e => e.parent).filter(p => p && p.nodeType === 1));
  $set.closest = (sel) => {
    const out = [];
    for (const el of els) { for (let p = el; p && p.nodeType === 1; p = p.parent) { if (queryAll(p.parent || root, sel).includes(p) || matchesChain(p, sel, root)) { out.push(p); break; } } }
    return wrap(root, out);
  };
  $set.is = (sel) => els.some(el => matchesChain(el, sel, root));
  $set.first = () => wrap(root, els.slice(0, 1));
  $set.last = () => wrap(root, els.slice(-1));
  $set.eq = (n) => wrap(root, n < 0 ? els.slice(n) : els.slice(n, n + 1));
  $set.get = (n) => (n == null ? els.slice() : els[n < 0 ? els.length + n : n]);
  $set.toArray = () => els.slice();
  $set.each = (fn) => { els.forEach((el, i) => fn.call(el, i, el)); return $set; };
  $set.map = (fn) => els.map((el, i) => fn.call(el, i, el));
  $set.filter = (fn) => wrap(root, typeof fn === 'function' ? els.filter((el, i) => fn.call(el, i, el)) : els.filter(el => matchesChain(el, fn, root)));
  $set.remove = () => { for (const el of els) { const p = el.parent; if (p) p.children = p.children.filter(c => c !== el); } return $set; };
  return $set;
}
function matchesChain(el, sel, root) {
  for (const chain of parseSelector(sel)) if (chainMatches(el, chain, chain.length - 1, root)) return true;
  return false;
}

/** cheerio.load eşdeğeri. Dönen $, Nuvio JsBindings cheerioPolyfill'i ile
    aynı çağrı biçimlerini kabul eder ($(sel), $(sel, ctx), $(el), $.html). */
export function cheerioLoad(html) {
  const root = loadDocument(html);
  const $ = (sel, ctx) => {
    if (sel && typeof sel === 'object' && 'length' in sel) return sel;           // zaten set
    if (sel && typeof sel === 'object' && sel.nodeType) return wrap(root, [sel]); // tek ham eleman
    const base = ctx && typeof ctx === 'object' && 'length' in ctx && ctx.length ? ctx[0] : root;
    if (sel == null) return wrap(root, []);
    return wrap(root, queryAll(base || root, sel));
  };
  $.html = (el) => (el && 'length' in el && el[0]) ? htmlOf(el[0]) : (el && el.nodeType === 1 ? htmlOf(el) : htmlOf(root));
  $.text = (el) => (el && el.nodeType === 1) ? textOf(el) : textOf(root);
  $.root = () => wrap(root, root.children.filter(c => c.nodeType === 1));
  return $;
}

export const cheerio = { load: cheerioLoad };
cheerio.default = cheerio; // esbuild __toESM interop: require('cheerio').default
export default cheerio;

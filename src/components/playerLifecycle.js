// Resources belong to one playback instance, never to the lifetime of the page.
export function createPlayerScope() {
  const cleanups = new Set();
  let disposed = false;
  const add = (cleanup) => {
    if (disposed) cleanup();
    else cleanups.add(cleanup);
  };
  const on = (target, event, handler, options) => {
    if (disposed) return;
    target.addEventListener(event, handler, options);
    add(() => target.removeEventListener(event, handler, options));
  };
  const timers = new Map();
  const clear = (id) => {
    const cleanup = timers.get(id);
    if (cleanup) {
      cleanup();
      cleanups.delete(cleanup);
      timers.delete(id);
    }
  };
  const schedule = (callback, delay, repeat) => {
    if (disposed) return null;
    const id = globalThis[repeat ? 'setInterval' : 'setTimeout'](() => {
      if (!repeat) clear(id);
      if (!disposed) callback();
    }, delay);
    const cleanup = () => globalThis[repeat ? 'clearInterval' : 'clearTimeout'](id);
    timers.set(id, cleanup);
    add(cleanup);
    return id;
  };
  return {
    on, add,
    setTimeout: (callback, delay) => schedule(callback, delay, false),
    setInterval: (callback, delay) => schedule(callback, delay, true),
    clearTimeout: clear,
    clearInterval: clear,
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const cleanup of cleanups) cleanup();
      cleanups.clear();
      timers.clear();
    }
  };
}

// Lucide's global createIcons scans document; render only new placeholders here.
export function renderPlayerIcons(root) {
  const lucide = globalThis.window?.lucide;
  if (!root || !lucide?.createElement || !lucide.icons) return;
  for (const placeholder of root.querySelectorAll('[data-lucide]:not(svg)')) {
    const name = placeholder.getAttribute('data-lucide');
    const key = name.replace(/(^|-)(\w)/g, (_, __, letter) => letter.toUpperCase());
    const icon = lucide.icons[key];
    if (!icon) continue;
    const attrs = Object.fromEntries(Array.from(placeholder.attributes, a => [a.name, a.value]));
    attrs.class = `lucide lucide-${name} ${attrs.class || ''}`;
    const svg = lucide.createElement(icon);
    for (const [name, value] of Object.entries(attrs)) svg.setAttribute(name, value);
    placeholder.replaceWith(svg);
  }
}

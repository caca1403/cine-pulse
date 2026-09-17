// Render only fresh or renamed placeholders. Lucide's createIcons() searches the
// whole document and recreates SVGs on every call, which is costly on card grids.
export function renderIcons(root = document) {
  const lucide = window.lucide;
  if (!lucide?.icons || !lucide?.createElement || !root) return;
  const selector = '[data-lucide]:not(svg)';
  const icons = root.matches?.(selector)
    ? [root, ...root.querySelectorAll(selector)]
    : root.querySelectorAll(selector);
  for (const node of icons) {
    const name = node.getAttribute('data-lucide');
    const key = name.replace(/(^|-)(\w)/g, (_, __, letter) => letter.toUpperCase());
    const icon = lucide.icons[key];
    if (!icon) continue;
    const svg = lucide.createElement(icon);
    for (const { name: attr, value } of node.attributes) {
      if (attr !== 'class') svg.setAttribute(attr, value);
    }
    svg.classList.add('lucide', `lucide-${name}`);
    for (const cls of node.classList) {
      if (cls !== 'lucide' && !cls.startsWith('lucide-')) svg.classList.add(cls);
    }
    node.replaceWith(svg);
  }
}

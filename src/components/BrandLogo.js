// Use the site's shipped logo consistently; do not replace its brand artwork.
export function renderSiteLogo(className = '') {
  return `<img class="cp-site-logo ${className}" src="${import.meta.env.BASE_URL}icon-192.png" alt="" width="40" height="40" decoding="async" />`;
}

// Older saved profiles used the former amber default. Adapt its display only.
export function getProfileAccent(color) {
  return !color || /^#(?:f59e0b|fbbf24|e5a00d|eab308|f5c518|d97706)$/i.test(color) ? '#dfff76' : color;
}

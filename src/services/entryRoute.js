// Only a plain web visit opens the introduction. Explicit content links survive.
export function resolveEntryHash(hash, isApp, hasRoom = false) {
  if (isApp && hash === '#showcase') return '#home';
  return hash || (isApp || hasRoom ? '#home' : '#showcase');
}

// Web ve uygulama varsayılan olarak ana ekrana (#home) açılır. Yalnızca açıkça #showcase istendiğinde tanıtım gösterilir.
export function resolveEntryHash(hash, isApp, hasRoom = false) {
  if (isApp && hash === '#showcase') return '#home';
  return hash || '#home';
}

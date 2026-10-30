// Web girisleri dogrudan vitrin / tanitim sayfasina (#showcase) kilitlenir.
// Mobil uygulama ve masaustu ise dogrudan ana ekrana (#home) acilir.
export function resolveEntryHash(hash, isApp, hasRoom = false) {
  if (isApp && hash === '#showcase') return '#home';
  return hash || (isApp || hasRoom ? '#home' : '#showcase');
}

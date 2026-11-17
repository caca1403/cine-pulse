// WEB = SADECE VİTRİN (kullanıcı kararı 2026-11-18: "sitenin sonuna yazarak
// #home falan girişi de kapat"). Web girişi #home/#detail/#downloads her ne
// olursa olsun vitrine (#showcase) kilitli; uygulama rotaları tarayıcıda
// açılmaz. Uygulama (EXE/APK) #home ile açılmaya devam eder.
//
// GEÇMİŞ: 2026-11-10 kararında webde oynatma için giriş #home'a taşınmıştı;
// bu karar 2026-11-18'de kullanıcı talebiyle geri alındı — site tanıtım ve
// indirme merkezi, oynatma yalnızca paketlerde (bkz. ShowcaseView web-note).
export function resolveEntryHash(hash, isApp, hasRoom = false) {
  if (!isApp) return '#showcase';
  if (hash === '#showcase') return '#home';
  return hash || '#home';
}

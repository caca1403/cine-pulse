// Tum platformlar (web dahil) dogrudan ana ekrana (#home) acilir.
//
// DEGISIKLIK (kullanici karari 2026-11-10: "webde tam oynatma"):
// web girisi eskiden vitrine (#showcase) kilitliydi ve kullaniciya soyle
// sunuluyordu: "Web artik oynatma sunmuyor". OLCULU YANLIS: tarayicida
// #detail?type=movie&id=155 uzerinden kaynak taramasi 27 satir uretti ve
// secilen satir HLS.js ile GERCEKTEN oynadi (blob akis, sure 9133 sn,
// readyState 2, paused=false). Yani oynatici degil, giris kapisi kapaliydi.
// Vitrin artik yalnizca acikça #showcase isteyenler icin (indirme/tanitim
// sayfalari oradan yonlendiriyor); varsayilan her yerde #home.
export function resolveEntryHash(hash, isApp, hasRoom = false) {
  if (isApp && hash === '#showcase') return '#home';
  return hash || '#home';
}

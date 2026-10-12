/** Güncelleme uyarısı verilip verilmeyeceği — YANLIŞ UYARI VERMEZ.
 *
 * Kurallar (öncelik sırasıyla):
 * 1. Sürüm dizeleri EŞİTSE asla uyarı yok. Aynı sürüm = aynı yayın demektir;
 *    kodlar farklıysa verilerden biri bozuktur (örn. uzaktaki kod 1064000
 *    gibi uydurulmuş, ya da kurulu tarafta eski paket bilgisi 171 kalmış).
 *    Bu iki gerçek vaka da daha önce yanlış uyarıya yol açtı.
 * 2. İki kod da geçerli pozitif sayıysa kod karşılaştırılır (Android
 *    kurulu derleme numarası yetkilidir).
 * 3. Kodlar yoksa/geçersizse semver karşılaştırılır.
 * 4. Hiçbiri yoksa uyarı verilmez (sessiz kalmak, yanlış uyarmaktan iyidir).
 */
export function shouldOfferUpdate(remote, installed) {
  const parse = value => /^v?(\d+)\.(\d+)\.(\d+)$/.exec(String(value || ''))?.slice(1).map(Number);
  const r = parse(remote?.version), c = parse(installed?.version);
  // Kural 1: aynı sürüm dizesi = aynı yayın = uyarı YOK (kodlar ne derse desin).
  if (r && c && r[0] === c[0] && r[1] === c[1] && r[2] === c[2]) return false;
  // Kural 2: kodlar yetkilidir.
  const remoteCode = Number(remote?.versionCode);
  const installedCode = Number(installed?.versionCode);
  if (Number.isSafeInteger(remoteCode) && remoteCode > 0 && Number.isSafeInteger(installedCode) && installedCode > 0)
    return remoteCode > installedCode;
  // Kural 3: semver yedeği.
  if (!r || !c) return false;
  for (let i = 0; i < 3; i++) if (r[i] !== c[i]) return r[i] > c[i];
  return false;
}

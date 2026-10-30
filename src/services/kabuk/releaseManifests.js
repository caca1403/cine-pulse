/* ==========================================================================
   CinePulse Studio - Platform bazinda surum bildirimi (tek bump tuvali)
   Kural: APK ile masaustu AYRI manifest okur, site ikisini birlestirir.
   - APK:      /version.json            (android: surum + apk adresi)
   - Masaustu: /desktop-version.json   (windows/deb/appimage adresleri)
   Biri guncellenince oburu etkilenmez; eski kurulumlar kendi manifestini
   okumaya devam eder. Ag hatasinda derleme-anlik degerlere dusulur.
   ========================================================================== */

export function mergeManifests(local, remoteApk, remoteDesktop) {
  const pickNewer = (remoteVer, localVer, remoteCode, localCode) => {
    if (!remoteVer) return localVer || '';
    if (!localVer) return remoteVer;
    if (Number(localCode) > Number(remoteCode)) return localVer;
    const u = String(remoteVer).replace(/^v/i, '').split('.').map(Number);
    const y = String(localVer).replace(/^v/i, '').split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      if ((y[i] || 0) > (u[i] || 0)) return localVer;
      if ((u[i] || 0) > (y[i] || 0)) return remoteVer;
    }
    return remoteVer;
  };

  const apkVer = pickNewer(remoteApk?.version, local?.version, remoteApk?.versionCode, local?.versionCode);
  const apk = {
    version: apkVer,
    versionCode: Math.max(Number(remoteApk?.versionCode || 0), Number(local?.versionCode || 0)),
    url: remoteApk?.downloadUrl || remoteApk?.githubDownloadUrl || local?.apkUrl || '',
  };
  const d = remoteDesktop || {};
  const desktopVer = pickNewer(d.version, local?.desktopVersion || local?.version, d.versionCode, local?.desktopVersionCode || local?.versionCode);
  const desktop = {
    version: desktopVer,
    versionCode: Math.max(Number(d.versionCode || 0), Number(local?.desktopVersionCode || local?.versionCode || 0)),
    windows: d.windowsSetupUrl || local?.windowsUrl || '',
    deb: d.linuxDebUrl || local?.debUrl || '',
    flatpak: d.linuxFlatpakUrl || local?.flatpakUrl || '',
    appImage: d.linuxAppImageUrl || local?.appImageUrl || '',
  };
  return { apk, desktop };
}

async function fetchJson(url) {
  try {
    const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    return await res.json().catch(() => null);
  } catch (_) {
    return null;
  }
}

/** Canli manifestler + derleme-anlik yedek. Web disinda cagrilmaz.
 *
 *  Sıra: önce /api/release (GitHub Releases'ten OTOMATİK çeker), sonra
 *  depodaki statik dosyalar. Statik dosyalar elle güncellenmeye bağlı
 *  olduğu için unutulunca site eski sürümü gösteriyordu.
 */
export async function getReleaseInfo(local) {
  const canli = await fetchJson('/api/release');
  if (canli && canli.version) {
    return mergeManifests(local, canli, { ...canli, ...(canli.desktop || {}) });
  }
  const [apk, desktop] = await Promise.all([
    fetchJson('/version.json'),
    fetchJson('/desktop-version.json'),
  ]);
  return mergeManifests(local, apk, desktop);
}

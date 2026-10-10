/* ==========================================================================
   CinePulse Studio - Platform bazinda surum bildirimi (tek bump tuvali)
   Kural: APK ile masaustu AYRI manifest okur, site ikisini birlestirir.
   - APK:      /version.json            (android: surum + apk adresi)
   - Masaustu: /desktop-version.json   (windows/deb/appimage adresleri)
   Biri guncellenince oburu etkilenmez; eski kurulumlar kendi manifestini
   okumaya devam eder. Ag hatasinda derleme-anlik degerlere dusulur.
   ========================================================================== */

export function mergeManifests(local, remoteApk, remoteDesktop) {
  const apk = {
    version: remoteApk?.version || local?.version || '',
    versionCode: Number(remoteApk?.versionCode || local?.versionCode || 0),
    url: remoteApk?.downloadUrl || remoteApk?.githubDownloadUrl || local?.apkUrl || '',
  };
  const d = remoteDesktop || {};
  const desktop = {
    version: d.version || local?.desktopVersion || '',
    versionCode: Number(d.versionCode || local?.desktopVersionCode || 0),
    windows: d.windowsSetupUrl || local?.windowsUrl || '',
    deb: d.linuxDebUrl || local?.debUrl || '',
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

/** Canli manifestler + derleme-anlik yedek. Web disinda cagrilmaz. */
export async function getReleaseInfo(local) {
  const [apk, desktop] = await Promise.all([
    fetchJson('/version.json'),
    fetchJson('/desktop-version.json'),
  ]);
  return mergeManifests(local, apk, desktop);
}

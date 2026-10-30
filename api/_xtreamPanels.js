/* Xtream panel kimlikleri repodan çıkardı (öncesi: önyüz bundle'ında düz
   metin kullanıcı adı/şifre). Dağıtım env'inden okunur:
   XTREAM_PANELS='{"host":"panel.example:2095","panels":[{"id":"p1","label":"Panel 1","user":"...","pass":"..."}]}' */
export function xtreamPanelsFromEnv() {
  try {
    const raw = String(process.env.XTREAM_PANELS || '').trim();
    if (!raw) return null;
    const data = JSON.parse(raw);
    const panels = Array.isArray(data) ? data : (Array.isArray(data.panels) ? data.panels : []);
    if (!panels.length) return null;
    return { host: String(data.host || ''), panels };
  } catch (_) {
    return null;
  }
}

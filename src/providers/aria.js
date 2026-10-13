/* ==========================================================================
   ARIA — Anizium  (sıfırdan)

   ÖNEMLİ: ÖZEL OTURUM KİMLİKLERİ KORUNMUŞTUR (kaybetmeyelim):
     imza anahtarı : hlxjl1c2w281ax473rt1ofgrvhyjvi   (TOKEN_KEY)
     istemci anahtarı: 16ghkdz5qnwinkyebwopbd94b49xhs (CLIENT_KEY)
     user-session  : 035f0101... (aşağıda)
     user-profile  : 15632429
     user          : 38534241025665
   Cf-Control başlığı İstanbul saatine göre günlük üretilir.

   Akış:
     arama : api.anizium.co/page/search?value={q}
     kaynak: api.anizium.co/anime/source?id={ID}&site=main&plan=free[&season&episode]&server=1
     → groups[].items[] = { link, quality }  (doğrudan MP4 / m3u8)
   ========================================================================== */

import { izleyici, kaynak, medyaMi, m3u8eCevir } from './kit.js';
import { isStrictMediaTitleMatch } from '../services/mediaMatcher.js';

/* ── OTURUM (KORU) ───────────────────────────────────────────────────── */
const TOKEN_KEY = 'hlxjl1c2w281ax473rt1ofgrvhyjvi';
const CLIENT_KEY = '16ghkdz5qnwinkyebwopbd94b49xhs';
const ANIZIUM_SESSION = '035f01015659595301060601525f39060c094e03515b442d13590e1a1c405b085b55031c5c5b475d57035c5c54415a001b04071f4446';
const ANIZIUM_PROFILE = '15632429';
const ANIZIUM_USER_ID = '38534241025665';
const API = 'https://api.anizium.co';

export const kimlik = { id: 'anizium', alias: 'Aria', mediaTypes: ['anime'] };

function cfControlToken() {
  try {
    const gun = new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul', weekday: 'long' }).toLowerCase();
    const anahtar = `${TOKEN_KEY}_${gun}`;
    const rastgele = Array.from({ length: 6 }, () => (Math.random() + 1).toString(36)[2]).join('');
    const yuk = JSON.stringify({ [rastgele]: Date.now() });
    const enc = new TextEncoder();
    const a = enc.encode(yuk), i = enc.encode(anahtar);
    const r = new Uint8Array(a.length);
    for (let o = 0; o < a.length; o++) r[o] = a[o] ^ i[o % i.length];
    return Array.from(r).map((n) => n.toString(16).padStart(2, '0')).join('');
  } catch (_) { return ''; }
}

function basliklar() {
  return {
    'Cf-Control': cfControlToken(),
    device: 'browser',
    language: 'tr',
    site: 'main',
    'user-session': ANIZIUM_SESSION,
    'user-profile': ANIZIUM_PROFILE,
    user: ANIZIUM_USER_ID,
    Origin: 'https://anizium.co',
    Referer: 'https://anizium.co/',
    Accept: 'application/json, text/plain, */*',
  };
}

async function api(url, timeout = 6000, signal = null) {
  // Doğrudan (Anizium CORS'a izin verir) → gizli WebView → yedek
  const { istek } = await import('./kit.js');
  const ham = await istek(url, { ref: 'https://anizium.co/', headers: basliklar(), timeout, signal });
  try { return JSON.parse(ham); } catch (_) { return null; }
}

export async function coz({ type = 'anime', title = '', originalTitle = '', titles = [], season = 1, episode = 1, isDub = false, signal = null } = {}) {
  const trace = izleyici();
  const s = +season || 1, e = +episode || 1;
  const isFilm = type === 'movie';
  const adaylar = [...new Set([originalTitle, title, ...titles].filter((t) => t && String(t).trim().length > 1))];

  const kaynaklar = [];
  const gorulen = new Set();
  /* HIZ: Anizium'un iki turu var (arama → kaynak). Eskiden her aday için
     arama ve her eşleşme için kaynak isteği SIRAYLA bekliyordu; üç adayda
     6+ gidiş = 4-8 saniye. Artık arama turu ilk sonuçta durur, kaynak
     istekleri eşzamanlı yapılır ve zaman aşımları gerçek gecikmeye
     (ölçülen ~0,5-1,0 s) göre sıkılaştırılır. */
  for (const q of adaylar.slice(0, 2)) {
    const arama = await api(`${API}/page/search?value=${encodeURIComponent(q)}`, 3500, signal);
    const liste = arama?.page?.data || arama?.data || [];
    trace.koy('arama', { q, n: Array.isArray(liste) ? liste.length : 0 });
    if (!Array.isArray(liste) || !liste.length) continue;

    const eslesenler = liste.slice(0, 3).filter((item) => item?.ID &&
      isStrictMediaTitleMatch(String(item.name || item.name_tr || item.name_short || '').toLowerCase(), adaylar.map((x) => String(x).toLowerCase())));
    if (!eslesenler.length) continue;

    const istekler = eslesenler.slice(0, 2).map(async (item) => {
      const kaynakUrl = isFilm
        ? `${API}/anime/source?id=${item.ID}&site=main&plan=free&server=1`
        : `${API}/anime/source?id=${item.ID}&site=main&plan=free&season=${s}&episode=${e}&server=1`;
      return { item, d: await api(kaynakUrl, 4000, signal) };
    });
    for (const r of await Promise.allSettled(istekler)) {
      if (r.status !== 'fulfilled') continue;
      const { item, d } = r.value;
      if (!d?.success || !Array.isArray(d.groups) || !d.groups.length) { trace.koy('kaynak', { id: item.ID, sonuc: 'grup-yok' }); continue; }

      const altyazilar = Array.isArray(d.subtitles)
        ? d.subtitles.filter((x) => x?.link).map((x) => ({ label: x.name || (x.group === 'tr' ? 'Türkçe' : 'İngilizce'), src: x.link, url: x.link }))
        : [];

      const grup = isDub
        ? d.groups.find((g) => g.group === 'trdub' || (g.name || '').toLowerCase().includes('türk'))
        : (d.groups.find((g) => g.group === 'original' || g.group === 'trsub' || (g.name || '').toLowerCase().includes('japon'))
           || d.groups.find((g) => g.group !== 'trdub'));
      if (!grup?.items?.length) { trace.koy('kaynak', { id: item.ID, sonuc: 'grup-bos' }); continue; }

      const sirali = [...grup.items].sort((a, b) => (b.quality || 0) - (a.quality || 0));
      const hdVar = sirali.some((x) => (x.quality || 0) >= 720);
      for (const it of sirali) {
        if (!it?.link || gorulen.has(it.link)) continue;
        if ((it.quality || 0) < 720 && hdVar) continue;
        const u = m3u8eCevir(it.link);
        if (!medyaMi(u) && !/^https?:\/\//i.test(u)) continue;
        gorulen.add(it.link);
        const q = it.quality >= 2160 ? '4K UHD' : (it.quality ? `${it.quality}p` : '1080p');
        kaynaklar.push(kaynak({
          id: `az_${item.ID}_${isFilm ? 'mov' : `s${s}e${e}`}_${it.quality || 1080}_${isDub ? 'dub' : 'sub'}`,
          ad: `Aria ${q} ${isDub ? 'TR Dublaj' : 'TR Altyazı'}`,
          url: u,
          kategori: isDub ? 'dubbed' : 'subtitled',
          headers: { Referer: 'https://anizium.co/', Origin: 'https://anizium.co', 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124' },
          altyazilar: isDub ? [] : altyazilar,
          kalite: q,
        }));
      }
      if (kaynaklar.length) break;
    }
    if (kaynaklar.length) break;
  }
  trace.koy('sonuc', { n: kaynaklar.length });
  return { sources: kaynaklar, trace: trace.ozet() };
}

export default {
  apiVersion: 1,
  id: kimlik.id,
  name: kimlik.alias,
  mediaTypes: kimlik.mediaTypes,
  async resolve(args) { return (await coz(args)).sources; },
};

/* ==========================================================================
   CinePulse Studio - AniList / MAL Anime İzleme Senkron Servisi
   ==========================================================================
   traktService ile aynı desen: OAuth authorize adresi → saklanan token →
   API çağrıları. Fark: AniList REST yerine GraphQL konuşur ve anime
   ilerlemesi TMDB harici kimliği (mal_id) üzerinden haritalanır.

   - AniList: tam akış (authorize + token depolama + SaveMediaListEntry)
   - MAL: taslak; gerçek akış PKCE (code_verifier + code_challenge)
     gerektirir, v1.3'te tamamlanacak.
   - Simkl: v1.3'te planlandı — API adresi buraya eklenecek. Şimdilik
     karşılığı yok.
   Not: yer ve dosya adı sabitleri, traktService STORAGE_KEYS biçimindedir.
*/

import { tmdbHariciIdleriGetir } from './tmdbApi.js';

const ANILIST_GRAPHQL_URL = 'https://graphql.anilist.co';
const ANILIST_OAUTH_URL = 'https://anilist.co/api/v2/oauth';

const STORAGE_KEYS = {
  TOKEN: 'cp_anilist_token',
  USER: 'cp_anilist_user',
  CLIENT_ID: 'cp_anilist_custom_client_id',
  CLIENT_SECRET: 'cp_anilist_custom_client_secret'
};

/* TMDB'den mal_id çözümlendikten sonra AniList Media id'si için ön bellek:
   aynı seriyi her bölümde yeniden sorgulamamak için. */
const mediaIdOnbellegi = new Map();

/** Kullanıcının kendi AniList uygulaması (developer.anilist.co) bilgisi
    — secret'ın kod içine gömülmemesi Trakt tarafındaki yolla aynı. */
export function anilistClientIdGetir() {
  return localStorage.getItem(STORAGE_KEYS.CLIENT_ID) || '';
}

/** response_type=token: secret'a gerek olmayan anonim akış.
    Kullanıcı kendi secret'ını girmişse response_type=code (token takası). */
export function anilistAuthUrl(clientId = anilistClientIdGetir()) {
  const secret = localStorage.getItem(STORAGE_KEYS.CLIENT_SECRET) || '';
  const params = new URLSearchParams({ client_id: clientId, redirect_uri: anilistYonlendirmeAdresi() });
  params.set('response_type', secret ? 'code' : 'token');
  return `${ANILIST_OAUTH_URL}/authorize?${params}`;
}

function anilistYonlendirmeAdresi() {
  return typeof location !== 'undefined' ? location.origin + location.pathname : '';
}

function tokenOku() {
  try {
    const ham = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return ham ? JSON.parse(ham) : null;
  } catch (_) {
    return null;
  }
}

function tokenKaydet(token) {
  localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify({
    ...token,
    created_at: Math.floor(Date.now() / 1000)
  }));
}

/** Bağlantı durumu; kullanıcı profili yüklemesi (getStoredUser benzeri)
    v1.3'te eklenecek. */
export function anilistKimligi() {
  const token = tokenOku();
  return { bagli: Boolean(token?.access_token) };
}

/** AniList GraphQL istemcisi: yetkili POST + hata normalleştirme. */
export async function anilistSorgu(sorgu, degiskenler = {}) {
  const token = tokenOku();
  if (!token?.access_token) throw new Error('AniList hesabı bağlı değil');
  const res = await fetch(ANILIST_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.access_token}`
    },
    body: JSON.stringify({ query: sorgu, variables: degiskenler })
  });
  if (!res.ok) throw new Error(`AniList API hatası (${res.status})`);
  const cevap = await res.json();
  const hata = cevap?.errors?.[0]?.message;
  if (hata) throw new Error(`AniList sorgu hatası: ${hata}`);
  return cevap?.data ?? null;
}

/** AniList izleme durumları ↔ uygulamadaki Türkçe durumlar. */
const DURUM_ESLEME = {
  watching: 'WATCHING',
  paused: 'PAUSED',
  completed: 'COMPLETED'
};

export function anilistDurumu(durum) {
  return DURUM_ESLEME[durum] || 'WATCHING';
}

/** AniList token takası (response_type=code akışı). AniList erişim
    anahtarları ~1 yıl yaşar; yenileme anahtarı vermez, gerek yok. */
export async function anilistTokenAl(code) {
  const res = await fetch(`${ANILIST_OAUTH_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: anilistClientIdGetir(),
      client_secret: localStorage.getItem(STORAGE_KEYS.CLIENT_SECRET) || '',
      redirect_uri: anilistYonlendirmeAdresi(),
      code
    })
  });
  if (!res.ok) throw new Error(`AniList token hatası (${res.status})`);
  const token = await res.json();
  tokenKaydet(token);
  return token;
}

const ANILIST_MEDYA_SORGUSU = `query ($idMal: Int) {
  Media(idMal: $idMal, type: ANIME) { id }
}`;

/** mal_id → AniList Media id haritalaması (bir kez çöz, ön bellekte tut). */
export async function anilistMedyaIdGetir(idMal) {
  const malId = Number(idMal);
  const anahtar = `mal_${malId}`;
  if (mediaIdOnbellegi.has(anahtar)) return mediaIdOnbellegi.get(anahtar);
  const data = await anilistSorgu(ANILIST_MEDYA_SORGUSU, { idMal: malId });
  const mediaId = data?.Media?.id || null;
  if (mediaId) mediaIdOnbellegi.set(anahtar, mediaId);
  return mediaId;
}

const ANILIST_KAYIT_MUTASYONU = `mutation ($mediaId: Int, $progress: Int, $status: MediaListStatus) {
  SaveMediaListEntry(mediaId: $mediaId, progress: $progress, status: $status) {
    id status progress
  }
}`;

/** Scrobble: anime ilerlemesini liste girişine yaz (Trakt scrobble benzeri).
    durum: 'watching' | 'paused' | 'completed'; bolum 0/eksikse progress
    gönderilmez (anime filminde bölüm kavramı yoktur). */
export async function anilistIlerlet({ idMal, bolum, durum } = {}) {
  if (!anilistKimligi().bagli) return null;
  const mediaId = Number(idMal);
  if (!mediaId) return null;
  const degiskenler = {
    mediaId,
    progress: Number(bolum) > 0 ? Number(bolum) : undefined,
    status: anilistDurumu(durum)
  };
  await anilistSorgu(ANILIST_KAYIT_MUTASYONU, degiskenler);
  return true;
}

/** Oynatıcıdan (PlayerModal) tek çağrı yolu; anime olmayan içerikte
    servis yoluna girilmez (Trakt hattı aynen devam eder). */
export async function anilistScroble(media, tamamlandi, durakladi) {
  if (!media?.isAnime || !anilistKimligi().bagli) return null;
  const durum = tamamlandi ? 'completed' : (durakladi ? 'paused' : 'watching');
  let mediaId = Number(media.idMal) || null;
  if (!mediaId && media.tmdbId) {
    const harici = await tmdbHariciIdleriGetir(media.type === 'movie' ? 'movie' : 'tv', media.tmdbId);
    mediaId = await anilistMedyaIdGetir(harici?.mal_id || null);
  }
  return anilistIlerlet({ idMal: mediaId, bolum: media.episode || 0, durum });
}

/** Geri dönüş kontrolü: redirect'ten token ya da kod toplar, ayrıca
    bağlantı durumunu döndürür. Oynatıcı kahvası bunu bilmez; TraktModal
    ve ayar ekranı bunu bir kez çağırır. */
export async function anilistGeriDonusKontrolu() {
  let degismeOldu = false;
  if (typeof window !== 'undefined') {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    if (hashParams.get('access_token')) {
      tokenKaydet({
        access_token: hashParams.get('access_token'),
        token_type: hashParams.get('token_type') || 'Bearer',
        expires_in: Number(hashParams.get('expires_in')) || 0
      });
      degismeOldu = true;
    }
    const code = new URLSearchParams(window.location.search).get('code');
    if (code && anilistClientIdGetir()) {
      try {
        await anilistTokenAl(code);
        degismeOldu = true;
      } catch (err) {
        console.warn('AniList token alınamadı:', err);
      }
      degismeOldu = true; // kullanılan kod adres çubuğunda bırakılmasın
    }
    if (degismeOldu) window.history.replaceState(null, '', window.location.pathname);
  }
  const kimlik = { ...anilistKimligi(), degisti: degismeOldu };
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cinepulse_anilist_auth_changed', { detail: kimlik }));
  }
  return kimlik;
}

export function anilistBaglantiyiKes() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cinepulse_anilist_auth_changed', { detail: { connected: false, degisti: false } }));
  }
}

/* ==========================================================================
   MAL — taslak (v1.3'te tamamlanacak)
   ==========================================================================
   Aşağıdaki üç fonksiyon AniList akışının MAL karşılığıdır; MAL v1 OAuth2
   PKCE (code_verifier/code_challenge) zorunlu kılar, bu sürüm yalnızca
   gerçek adresleri ve gövde biçimini tutar — test edilmemiştir.
   Simkl entegrasyonu ise v1.3'te planlandı; bugün bu serviste yer yok.
*/

const MAL_API_URL = 'https://api.myanimelist.net/v2';
const MAL_OAUTH_URL = 'https://myanimelist.net/v1/oauth2';

/** response_type=code — MAL'ta PKCE zorunlu olduğundan этого çağrıyı
    v1.3'te code_verifier üretimiyle tamamlanacak. */
export function malAuthUrl(clientId) {
  const params = new URLSearchParams({ client_id: clientId, response_type: 'code' });
  return `${MAL_OAUTH_URL}/authorize?${params}`;
}

export async function malTokenAl(code) {
  const res = await fetch(`${MAL_OAUTH_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: localStorage.getItem('cp_mal_client_id') || '',
      client_secret: localStorage.getItem('cp_mal_client_secret') || '',
      code,
      grant_type: 'authorization_code',
      code_verifier: ''
    })
  });
  if (!res.ok) throw new Error(`MAL token hatası (${res.status})`);
  const token = await res.json();
  localStorage.setItem('cp_mal_token', JSON.stringify(token));
  return token;
}

/** Bölüm ilerlemesi: PUT anime/{id}/my_list_status — num_watched_episodes. */
export async function malGuncelle(animeId, bolum) {
  const ham = localStorage.getItem('cp_mal_token');
  const token = ham ? JSON.parse(ham) : null;
  if (!token?.access_token) throw new Error('MAL hesabı bağlı değil');
  const res = await fetch(`${MAL_API_URL}/anime/${animeId}/my_list_status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token.access_token}`
    },
    body: new URLSearchParams({ num_watched_episodes: String(Number(bolum) || 0) })
  });
  if (!res.ok) throw new Error(`MAL güncelleme hatası (${res.status})`);
  return res.json();
}

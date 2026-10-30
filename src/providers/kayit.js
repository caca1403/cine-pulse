/* ==========================================================================
   CinePulse — sağlayıcı KAYDI (43 vendor + 12 birinci taraf = 55 kayıt)
   --------------------------------------------------------------------------
   Kahraman kodu → { onek, dosya, turler, durum }
     kodAdı : arayüzde görünen tek isim; anahtarın kendisi (hero code name)
     onek   : kaynak id öneki (izleme etiketi bu önekten üretilir)
     dosya  : ./cekirdekler/<camelCase(kahraman)>.js
     turler : ['movie'] | ['tv'] | ['movie', 'tv']
     durum  : 'canli' | 'kapali' | 'bilinmiyor' — canlı ölçüm sonucu
     kimlik : 'tmdb' → vekil ilk denemede sayısal TMDB numarasını verir
               (bazı birinci taraf çekirdekler IMDb numarasıyla çalışmıyor)
   Gerçek site adı ne bu dosyada ne arayüzde bulunur.
   ========================================================================== */

import { apiUrl } from '../services/altyapi/apiOrigin.js';

/* Aria (Nightwing) Cf-Control XOR anahtarı bundle'da DEĞİL: açılışta
   sunucudan (api/aria_key.js — dağıtım env'i ARIA_CF_KEY) alınır ve
   globalThis'a konur; nightwing.js'in cfToken()'ı buradan okur.
   shortcut: anahtar gelmeden yapılan ilk aramada Aria 403 yer, yeniden
   denemede düzelir — kalıcı hale getirmek istenirse loader Promise'i
   nightwing yüklenmeden önce beklenebilir. */
try {
  fetch(apiUrl('/api/aria_key'))
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (d && d.key) globalThis.__cpAriaAnahtar = String(d.key);
      else console.warn('[kayit] aria anahtarı sunucudan alınamadı — Nightwing açılışta 403 yiyebilir (ikinci denemede düzelir)');
    })
    // Sessizlik bozuldu (D, 2026-10-29): anahtarın neden gelmediği hiç
    // görünmüyordu; uyarı davranışı değiştirmez, yalnız teşhis.
    .catch((h) => console.warn('[kayit] aria anahtarı isteği başarısız —', String(h?.message || h).slice(0, 120)));
} catch (h) { console.warn('[kayit] aria anahtarı başlatılamadı —', String(h?.message || h).slice(0, 120)); }

/** kahraman kodu -> kayit */
export const KAYIT = new Map([
  // ── birinci taraf çekirdekler (doğrulandı, canlı) ──
  ['Star-Lord', { onek: 'sp_starlord_', dosya: 'starLord.js', yukle: () => import('./cekirdekler/starLord.js'), turler: ['movie', 'tv'], durum: 'canli', kimlik: 'tmdb' }],
  ['Wolverine', { onek: 'sp_wolverine_', dosya: 'wolverine.js', yukle: () => import('./cekirdekler/wolverine.js'), turler: ['tv'], durum: 'canli', kimlik: 'tmdb' }],

  // ── birinci taraf TR-site çekirdekleri (2026-10-18; site adları yalnız yapılandırmada) ──
  // Spectre (2026-10-29): Cloudflare arkasındaki köklü TR arşivi; cihazın kendi
  // challenge oturumu + CapacitorHttp ile okunur, embed çözücüsü gerçek
  // TYPE=AUDIO "Turkish" kanıtıyla etiket basar (uydurma yok).
  ['Spectre', { onek: 'sp_spectre_', dosya: 'spectre.js', yukle: () => import('./cekirdekler/spectre.js'), turler: ['movie', 'tv'], durum: 'canli', kimlik: 'tmdb' }],
  // Green-Arrow: DiziSol API adapter; UI and IDs use the hero code name.
  ['Green-Arrow', { onek: 'sp_greenarrow_', dosya: 'dizisol.js', yukle: () => import('./cekirdekler/dizisol.js'), turler: ['movie', 'tv'], durum: 'canli', kimlik: 'tmdb' }],
  // Huntress (2026-10-29): FilmEkseni ailesi — tek API'de arama, videoPlayerData
  // şablonu → eksenload embed → jwplayer JSON → master. TR ses master'dan kanıtlı.
  ['Huntress', { onek: 'sp_huntress_', dosya: 'huntress.js', yukle: () => import('./cekirdekler/huntress.js'), turler: ['movie', 'tv'], durum: 'canli', kimlik: 'tmdb' }],
  // Brainiac (2026-10-29): DiziYou ailesi — dizi/bölüm HTML'i + `_tr` dublaj
  // medya yolu. Yalnız dizi verir.
  ['Brainiac', { onek: 'sp_brainiac_', dosya: 'brainiac.js', yukle: () => import('./cekirdekler/brainiac.js'), turler: ['tv'], durum: 'canli', kimlik: 'tmdb' }],
  // Nova (2026-10-30, cihazda dublaj KANITLI): DiziFilmizle — /api/search → flight
  // payload embed_player_url → vidmixi AES decryption (saf JS MD5) → master'da
  // LANGUAGE="tur". Cihaz ölçümü 1396 + Wednesday: canlı satır.
  ['Nova', { onek: 'sp_nova_', dosya: 'nova.js', yukle: () => import('./cekirdekler/nova.js'), turler: ['movie', 'tv'], durum: 'canli', kimlik: 'tmdb' }],
  // Vision (2026-10-30): SezonlukDizi — ajax arama + dataAlternatif22/dataEmbed22
  // → Byse AES-GCM (WebCrypto, uzaktan JS YOK) → sprintcdn. CF'li player'a
  // GİRİLMEDEN içerik tarafından çözülür. Dil rozeti kanıtla basılır (yoksa yok).
  ['Vision', { onek: 'sp_vision_', dosya: 'vision.js', yukle: () => import('./cekirdekler/vision.js'), turler: ['tv'], durum: 'canli', kimlik: 'tmdb' }],
  // Phyla (2026-10-30): DiziBal — /ara/oneri JSON → data-pv → pilavyer s.php
  // (Referer şart) → __PLAYER__ → JWT master + TR VTT. Ses orijinal kanıtlı;
  // rozet uydurmaz. stream.php yalnız gerçek istemci TLS'ine 200 verir (Node-fetch 403).
  ['Phyla', { onek: 'sp_phyla_', dosya: 'phyla.js', yukle: () => import('./cekirdekler/phyla.js'), turler: ['tv'], durum: 'canli', kimlik: 'tmdb' }],
  ['Cat-Woman', { onek: 'sp_catwoman_', dosya: 'catWoman.js', yukle: () => import('./cekirdekler/catWoman.js'), turler: ['movie', 'tv'], durum: 'canli', kimlik: 'tmdb' }],
  ['Bane', { onek: 'sp_bane_', dosya: 'bane.js', yukle: () => import('./cekirdekler/bane.js'), turler: ['movie'], durum: 'canli', kimlik: 'tmdb' }],
  ['Robin', { onek: 'sp_robin_', dosya: 'robin.js', yukle: () => import('./cekirdekler/robin.js'), turler: ['tv'], durum: 'bilinmiyor', tavaniMs: 26000, kimlik: 'tmdb' }],
  ['Raven', { onek: 'sp_raven_', dosya: 'raven.js', yukle: () => import('./cekirdekler/raven.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor', tavaniMs: 26000, kimlik: 'tmdb' }],
  ['Darkseid', { onek: 'sp_darkseid_', dosya: 'darkseid.js', yukle: () => import('./cekirdekler/darkseid.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor', tavaniMs: 26000, kimlik: 'tmdb' }],

  // ── birinci taraf TR-site çekirdekleri, ikinci dalga (2026-10-18) ──
  ['Bellatrix', { onek: 'sp_bellatrix_', dosya: 'bellatrix.js', yukle: () => import('./cekirdekler/bellatrix.js'), turler: ['movie', 'tv'], durum: 'canli', kimlik: 'tmdb' }],
  ['Lyra', { onek: 'sp_lyra_', dosya: 'lyra.js', yukle: () => import('./cekirdekler/lyra.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor', tavaniMs: 26000, kimlik: 'tmdb' }],
  ['Arcturus', { onek: 'sp_arcturus_', dosya: 'arcturus.js', yukle: () => import('./cekirdekler/arcturus.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor', tavaniMs: 65000, kimlik: 'tmdb' }],
  ['Sirius', { onek: 'sp_sirius_', dosya: 'sirius.js', yukle: () => import('./cekirdekler/sirius.js'), turler: ['movie'], durum: 'bilinmiyor', tavaniMs: 26000, kimlik: 'tmdb' }],

  // ── vendor çekirdekler (kapalı olarak işaretlendi) ──
  ['Spider-Man', { onek: 'sp_spiderman_', dosya: 'spiderMan.js', yukle: () => import('./cekirdekler/spiderMan.js'), turler: ['movie', 'tv'], durum: 'canli' }],
  ['Iron-Man', { onek: 'sp_ironman_', dosya: 'ironMan.js', yukle: () => import('./cekirdekler/ironMan.js'), turler: ['movie', 'tv'], durum: 'canli' }],
  ['Captain-America', { onek: 'sp_captainamerica_', dosya: 'captainAmerica.js', yukle: () => import('./cekirdekler/captainAmerica.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Thor', { onek: 'sp_thor_', dosya: 'thor.js', yukle: () => import('./cekirdekler/thor.js'), turler: ['tv'], durum: 'bilinmiyor' }],
  ['Hulk', { onek: 'sp_hulk_', dosya: 'hulk.js', yukle: () => import('./cekirdekler/hulk.js'), turler: ['movie'], durum: 'bilinmiyor' }],
  ['Black-Widow', { onek: 'sp_blackwidow_', dosya: 'blackWidow.js', yukle: () => import('./cekirdekler/blackWidow.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Hawkeye', { onek: 'sp_hawkeye_', dosya: 'hawkeye.js', yukle: () => import('./cekirdekler/hawkeye.js'), turler: ['movie', 'tv'], durum: 'canli' }],
  ['Black-Panther', { onek: 'sp_blackpanther_', dosya: 'blackPanther.js', yukle: () => import('./cekirdekler/blackPanther.js'), turler: ['movie'], durum: 'bilinmiyor' }],
  ['Doctor-Strange', { onek: 'sp_doctorstrange_', dosya: 'doctorStrange.js', yukle: () => import('./cekirdekler/doctorStrange.js'), turler: ['movie'], durum: 'bilinmiyor' }],
  ['Scarlet-Witch', { onek: 'sp_scarletwitch_', dosya: 'scarletWitch.js', yukle: () => import('./cekirdekler/scarletWitch.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Falcon', { onek: 'sp_falcon_', dosya: 'falcon.js', yukle: () => import('./cekirdekler/falcon.js'), turler: ['movie', 'tv'], durum: 'canli' }],
  ['Winter-Soldier', { onek: 'sp_wintersoldier_', dosya: 'winterSoldier.js', yukle: () => import('./cekirdekler/winterSoldier.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Loki', { onek: 'sp_loki_', dosya: 'loki.js', yukle: () => import('./cekirdekler/loki.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Deadpool', { onek: 'sp_deadpool_', dosya: 'deadpool.js', yukle: () => import('./cekirdekler/deadpool.js'), turler: ['tv'], durum: 'canli' }],
  ['Daredevil', { onek: 'sp_daredevil_', dosya: 'daredevil.js', yukle: () => import('./cekirdekler/daredevil.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Punisher', { onek: 'sp_punisher_', dosya: 'punisher.js', yukle: () => import('./cekirdekler/punisher.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Luke-Cage', { onek: 'sp_lukecage_', dosya: 'lukeCage.js', yukle: () => import('./cekirdekler/lukeCage.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Iron-Fist', { onek: 'sp_ironfist_', dosya: 'ironFist.js', yukle: () => import('./cekirdekler/ironFist.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Spider-Woman', { onek: 'sp_spiderwoman_', dosya: 'spiderWoman.js', yukle: () => import('./cekirdekler/spiderWoman.js'), turler: ['movie', 'tv'], durum: 'canli' }],
  ['Moon-Knight', { onek: 'sp_moonknight_', dosya: 'moonKnight.js', yukle: () => import('./cekirdekler/moonKnight.js'), turler: ['tv', 'anime'], durum: 'canli' }],
  ['Batman', { onek: 'sp_batman_', dosya: 'batman.js', yukle: () => import('./cekirdekler/batman.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Superman', { onek: 'sp_superman_', dosya: 'superman.js', yukle: () => import('./cekirdekler/superman.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Wonder-Woman', { onek: 'sp_wonderwoman_', dosya: 'wonderWoman.js', yukle: () => import('./cekirdekler/wonderWoman.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Flash', { onek: 'sp_flash_', dosya: 'flash.js', yukle: () => import('./cekirdekler/flash.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Aquaman', { onek: 'sp_aquaman_', dosya: 'aquaman.js', yukle: () => import('./cekirdekler/aquaman.js'), turler: ['movie', 'tv'], durum: 'canli' }],
  ['Cyborg', { onek: 'sp_cyborg_', dosya: 'cyborg.js', yukle: () => import('./cekirdekler/cyborg.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Harley-Quinn', { onek: 'sp_harleyquinn_', dosya: 'harleyQuinn.js', yukle: () => import('./cekirdekler/harleyQuinn.js'), turler: ['movie', 'tv', 'anime'], durum: 'bilinmiyor' }],
  ['Poison-Ivy', { onek: 'sp_poisonivy_', dosya: 'poisonIvy.js', yukle: () => import('./cekirdekler/poisonIvy.js'), turler: ['movie', 'tv', 'anime'], durum: 'canli' }],
  ['Nightwing', { onek: 'sp_nightwing_', dosya: 'nightwing.js', yukle: () => import('./cekirdekler/nightwing.js'), turler: ['tv', 'anime'], durum: 'bilinmiyor' }],
  ['Supergirl', { onek: 'sp_supergirl_', dosya: 'supergirl.js', yukle: () => import('./cekirdekler/supergirl.js'), turler: ['tv', 'anime'], durum: 'canli' }],
  ['Zatanna', { onek: 'sp_zatanna_', dosya: 'zatanna.js', yukle: () => import('./cekirdekler/zatanna.js'), turler: ['tv'], durum: 'canli' }],
  ['Aqualad', { onek: 'sp_aqualad_', dosya: 'aqualad.js', yukle: () => import('./cekirdekler/aqualad.js'), turler: ['movie', 'tv'], durum: 'canli' }],
  ['Beast-Boy', { onek: 'sp_beastboy_', dosya: 'beastBoy.js', yukle: () => import('./cekirdekler/beastBoy.js'), turler: ['movie', 'tv'], durum: 'canli' }],
  ['Constantine', { onek: 'sp_constantine_', dosya: 'constantine.js', yukle: () => import('./cekirdekler/constantine.js'), turler: ['movie', 'tv'], durum: 'canli' }],
  ['Black-Adam', { onek: 'sp_blackadam_', dosya: 'blackAdam.js', yukle: () => import('./cekirdekler/blackAdam.js'), turler: ['movie', 'tv'], durum: 'canli' }],
  ['Hawkman', { onek: 'sp_hawkman_', dosya: 'hawkman.js', yukle: () => import('./cekirdekler/hawkman.js'), turler: ['movie', 'tv'], durum: 'canli' }],
  ['Doctor-Fate', { onek: 'sp_doctorfate_', dosya: 'doctorFate.js', yukle: () => import('./cekirdekler/doctorFate.js'), turler: ['movie', 'tv'], durum: 'canli' }],
  ['Shazam', { onek: 'sp_shazam_', dosya: 'shazam.js', yukle: () => import('./cekirdekler/shazam.js'), turler: ['movie', 'tv'], durum: 'canli' }],
  ['Joker', { onek: 'sp_joker_', dosya: 'joker.js', yukle: () => import('./cekirdekler/joker.js'), turler: ['movie', 'tv'], durum: 'canli' }],
]);

/** Arayüz etiketi üretmek için. */
export function kodAdi(id) {
  return KAYIT.get(id) ? id : null;
}

/* BOZUK KAYIT KAPISI (ölçüm raporu D, 2026-10-29; kullanıcı: "sağlayıcılar
   sessizce düşüyor"). Elle düzenlemede zorunlu alanı yitiren bir kayıt
   (onek/dosya/yukle/turler) vekilde 'cekirdek-yok' ya da yükleme hatasıyla
   SESSİZCE eleniyordu — "bozuk/kaybolmuş kaydın taramaya yansımaması"nın en
   sık kökü buydu (kalıcı sicil de bir kez 'canlı'lenen kaydı temelli öne
   taşıdığı için düşüş hiç fark edilmiyordu). Açılışta her kayıt sözleşmeye
   karşı denetlenir; kusurlu varsa adıyla uyarılır. Davranış birebir korunur:
   hiçbir kayıt kaldırılmaz, sıralama/durum aynı; bütünlük testleri
   (tests/kahraman-kaynaklari.test.mjs) bu sözleşmeyi zaten kilitliyor. */
for (const [ad, k] of KAYIT) {
  const kusur = [];
  if (typeof k?.onek !== 'string' || !/^sp_[a-z0-9_]+$/.test(k.onek)) kusur.push('onek');
  if (typeof k?.dosya !== 'string' || !k.dosya.endsWith('.js')) kusur.push('dosya');
  if (typeof k?.yukle !== 'function') kusur.push('yukle');
  if (!Array.isArray(k?.turler) || !k.turler.length) kusur.push('turler');
  if (!['canli', 'kapali', 'bilinmiyor'].includes(k?.durum)) kusur.push('durum');
  if (kusur.length) console.warn(`[kayit] bozuk kayıt ${ad}: kusurlu alanlar ${kusur.join(', ')} — vekil bu sağlayıcıyı sessizce düşürür, kayit.js onarılmalı`);
}

/** Bu kayıt verilen türü destekliyor mu? (series, tv ile aynı havuz)
 *
 *  ÖLÇÜLEN HATA (2026-10-16): uygulama anime açılışında `tur:'anime'`
 *  gönderiyor, kayıt tablosunda 'anime' türü HİÇ yoktu → sağlayıcı listesi
 *  boş → tarama hiç başlamadan "kaynak bulunamadı" (kullanıcı: "sanki hiç
 *  taramıyor gibi"). Animeler sağlayıcılarda dizi gibi davranır; 'anime'
 *  artık tv havuzunu kapsar, anime etiketli çekirdekler sıralamada öne alınır.
 *  Çizgi film/çocuk içerikleri de aynı havuzdan yararlanır. */
export function turDestekler(kayit, tur) {
  if (!kayit?.turler?.length) return false;
  const t = String(tur || '').toLowerCase();
  if (kayit.turler.includes(t)) return true;
  if (t === 'series' || t === 'anime' || t === 'animeseries') return kayit.turler.includes('tv');
  if (t === 'cizgifilm' || t === 'cartoon' || t === 'animation' || t === 'kids') {
    return kayit.turler.includes('tv') || kayit.turler.includes('movie');
  }
  return false;
}

/** Canlı ölçümde doğrulanmış KAPALI kayıtlar (taramaya girmez). */
export const KAPALI = new Set(
  [...KAYIT.entries()].filter(([, k]) => k.durum === 'kapali').map(([ad]) => ad)
);

/** Ölçüm sonucu yaz: 'canli' | 'kapali' | 'bilinmiyor' */
export function durumAyarla(id, durum) {
  const k = KAYIT.get(id);
  if (!k) return false;
  if (durum === 'kapali') KAPALI.add(id); else KAPALI.delete(id);
  k.durum = durum;
  return true;
}

/** Ölçüm raporu: kaç kayıt canlı / kapalı / ölçülmemiş. */
export function durumOzeti() {
  const degerler = [...KAYIT.values()];
  return {
    toplam: degerler.length,
    canli: degerler.filter(k => k.durum === 'canli').length,
    kapali: degerler.filter(k => k.durum === 'kapali').length,
    bilinmiyor: degerler.filter(k => k.durum === 'bilinmiyor').length,
  };
}

/** Kayıtları türe göre süz (deterministik sıra: kahraman kodu).
 *  KAPALI kayıtlar listede çıkmaz. */
export function kayitlar(tur) {
  return [...KAYIT.entries()]
    .filter(([ad, k]) => turDestekler(k, tur) && !KAPALI.has(ad))
    .sort((a, b) => a[0].localeCompare(b, 'en'));
}

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

/** kahraman kodu -> kayit */
export const KAYIT = new Map([
  // ── birinci taraf çekirdekler (doğrulandı, canlı) ──
  ['Star-Lord', { onek: 'sp_starlord_', dosya: 'starLord.js', yukle: () => import('./cekirdekler/starLord.js'), turler: ['movie', 'tv'], durum: 'canli', kimlik: 'tmdb' }],
  ['Wolverine', { onek: 'sp_wolverine_', dosya: 'wolverine.js', yukle: () => import('./cekirdekler/wolverine.js'), turler: ['tv'], durum: 'canli', kimlik: 'tmdb' }],

  // ── birinci taraf TR-site çekirdekleri (2026-10-18; site adları yalnız yapılandırmada) ──
  ['Green-Arrow', { onek: 'sp_greenarrow_', dosya: 'greenArrow.js', yukle: () => import('./cekirdekler/greenArrow.js'), turler: ['movie', 'tv'], durum: 'canli', kimlik: 'tmdb' }],
  ['Cat-Woman', { onek: 'sp_catwoman_', dosya: 'catWoman.js', yukle: () => import('./cekirdekler/catWoman.js'), turler: ['movie', 'tv'], durum: 'canli', kimlik: 'tmdb' }],
  ['Bane', { onek: 'sp_bane_', dosya: 'bane.js', yukle: () => import('./cekirdekler/bane.js'), turler: ['movie'], durum: 'canli', kimlik: 'tmdb' }],
  ['Robin', { onek: 'sp_robin_', dosya: 'robin.js', yukle: () => import('./cekirdekler/robin.js'), turler: ['tv'], durum: 'bilinmiyor', tavaniMs: 26000, kimlik: 'tmdb' }],
  ['Raven', { onek: 'sp_raven_', dosya: 'raven.js', yukle: () => import('./cekirdekler/raven.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor', tavaniMs: 26000, kimlik: 'tmdb' }],
  ['Darkseid', { onek: 'sp_darkseid_', dosya: 'darkseid.js', yukle: () => import('./cekirdekler/darkseid.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor', tavaniMs: 26000, kimlik: 'tmdb' }],

  // ── birinci taraf TR-site çekirdekleri, ikinci dalga (2026-10-18) ──
  ['Bellatrix', { onek: 'sp_bellatrix_', dosya: 'bellatrix.js', yukle: () => import('./cekirdekler/bellatrix.js'), turler: ['movie', 'tv'], durum: 'canli', kimlik: 'tmdb' }],
  ['Lyra', { onek: 'sp_lyra_', dosya: 'lyra.js', yukle: () => import('./cekirdekler/lyra.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor', tavaniMs: 26000, kimlik: 'tmdb' }],
  ['Arcturus', { onek: 'sp_arcturus_', dosya: 'arcturus.js', yukle: () => import('./cekirdekler/arcturus.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor', tavaniMs: 26000, kimlik: 'tmdb' }],
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
  ['Ant-Man', { onek: 'sp_antman_', dosya: 'antMan.js', yukle: () => import('./cekirdekler/antMan.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Scarlet-Witch', { onek: 'sp_scarletwitch_', dosya: 'scarletWitch.js', yukle: () => import('./cekirdekler/scarletWitch.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Falcon', { onek: 'sp_falcon_', dosya: 'falcon.js', yukle: () => import('./cekirdekler/falcon.js'), turler: ['movie', 'tv'], durum: 'canli' }],
  ['Winter-Soldier', { onek: 'sp_wintersoldier_', dosya: 'winterSoldier.js', yukle: () => import('./cekirdekler/winterSoldier.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Loki', { onek: 'sp_loki_', dosya: 'loki.js', yukle: () => import('./cekirdekler/loki.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Thanos', { onek: 'sp_thanos_', dosya: 'thanos.js', yukle: () => import('./cekirdekler/thanos.js'), turler: ['movie', 'tv'], durum: 'canli' }],
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
  ['Green-Lantern', { onek: 'sp_greenlantern_', dosya: 'greenLantern.js', yukle: () => import('./cekirdekler/greenLantern.js'), turler: ['movie', 'tv'], durum: 'canli' }],
  ['Cyborg', { onek: 'sp_cyborg_', dosya: 'cyborg.js', yukle: () => import('./cekirdekler/cyborg.js'), turler: ['movie', 'tv'], durum: 'bilinmiyor' }],
  ['Harley-Quinn', { onek: 'sp_harleyquinn_', dosya: 'harleyQuinn.js', yukle: () => import('./cekirdekler/harleyQuinn.js'), turler: ['movie', 'tv', 'anime'], durum: 'bilinmiyor' }],
  ['Poison-Ivy', { onek: 'sp_poisonivy_', dosya: 'poisonIvy.js', yukle: () => import('./cekirdekler/poisonIvy.js'), turler: ['movie', 'tv', 'anime'], durum: 'canli' }],
  ['Nightwing', { onek: 'sp_nightwing_', dosya: 'nightwing.js', yukle: () => import('./cekirdekler/nightwing.js'), turler: ['tv', 'anime'], durum: 'bilinmiyor' }],
  ['Batgirl', { onek: 'sp_batgirl_', dosya: 'batgirl.js', yukle: () => import('./cekirdekler/batgirl.js'), turler: ['tv', 'anime'], durum: 'canli' }],
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

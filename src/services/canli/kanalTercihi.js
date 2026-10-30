/* ==========================================================================
   CinePulse Studio — Kanal tercihi (SOĞUK BAŞLANGIÇ / ilk kurulum)
   --------------------------------------------------------------------------
   Hiç izleme geçmişi olmayan kullanıcı için "temel analiz" kaynağı:
   kullanıcının ilk açılışta seçtiği kanal + tür zevkleri cihazda saklanır ve
   kanal programı bu tercihten kurulur. İzleme biriktikçe kişisel sinyaller
   tercihin ÖNÜNE geçer (tercih yalnızca tohum/taban katmanıdır).

   SAFLIK: DOM/ağ/localStorage'a doğrudan dokunmaz — depo parametreyle enjekte
   edilir. Böylece node --test ile ağsız sınanır.
   ========================================================================== */

/** Tercih kaydının şema sürümü. Alan yapısı değişirse artırılır. */
export const TERCIH_SURUMU = 1;
export const TERCIH_ANAHTAR = 'kanalim_tercih_v1';

/** Kullanıcıya en çok tanıdık gelen tür rafı (TMDB kimlikleri). */
export const TUR_RAF = Object.freeze([
  Object.freeze({ slug: 'aksiyon', ad: 'Aksiyon', turIdler: [28, 12, 10759], ikon: 'flame', renk: '#ff6b6b' }),
  Object.freeze({ slug: 'dram', ad: 'Dram', turIdler: [18, 10766], ikon: 'clapperboard', renk: '#b197fc' }),
  Object.freeze({ slug: 'komedi', ad: 'Komedi', turIdler: [35], ikon: 'laugh', renk: '#ffd43b' }),
  Object.freeze({ slug: 'gerilim', ad: 'Gerilim & Suç', turIdler: [53, 80, 9648], ikon: 'zap', renk: '#4dabf7' }),
  Object.freeze({ slug: 'bilimkurgu', ad: 'Bilim Kurgu & Fantastik', turIdler: [878, 14, 10765], ikon: 'orbit', renk: '#22d3ee' }),
  Object.freeze({ slug: 'korku', ad: 'Korku', turIdler: [27], ikon: 'ghost', renk: '#f783ac' }),
  Object.freeze({ slug: 'aile', ad: 'Aile & Çocuk', turIdler: [10751, 10762, 16], ikon: 'baby', renk: '#69db7c' }),
  Object.freeze({ slug: 'belgesel', ad: 'Belgesel', turIdler: [99, 36, 25], ikon: 'telescope', renk: '#38d9a9' }),
  Object.freeze({ slug: 'romantik', ad: 'Romantik', turIdler: [10749], ikon: 'heart', renk: '#ff8fab' }),
  Object.freeze({ slug: 'savas', ad: 'Savaş & Tarih', turIdler: [10752, 36, 10768], ikon: 'shield', renk: '#cbd5e1' }),
  Object.freeze({ slug: 'anime', ad: 'Anime', turIdler: [16, 10762], ikon: 'smile', renk: '#a78bfa', anime: true }),
  Object.freeze({ slug: 'western', ad: 'Western', turIdler: [37], ikon: 'sunset', renk: '#d4a373' })
]);

const TUR_SLUG = new Map(TUR_RAF.map((t) => [t.slug, t]));

/**
 * Slug arama anahtarı: Türkçe büyük "I" → "ı" dönüşümü yüzünden (tr-TR
 * locale) arama kaçabiliyordu; 'ı' → 'i' eşlenir ve küçük harfe indirilir.
 */
function slugAnahtar(s) {
  return String(s == null ? '' : s).trim().toLocaleLowerCase('tr-TR').replace(/ı/g, 'i');
}

/** Bir tür slug'ının tanımı (bilinmeyen → null). */
export function turRafTanimi(slug) {
  const anahtar = slugAnahtar(slug);
  if (!anahtar) return null;
  return TUR_SLUG.get(anahtar) || TUR_SLUG.get(anahtar.replace(/[^a-z0-9-]+/g, '')) || null;
}

/**
 * Tercih nesnesini doğrular/normalize eder. Bozuk alanlar sessizce temizlenir;
 * geçerli seçim yoksa null (kanal kurulmamış sayılır).
 *
 * @param {object|null} ham
 * @returns {{surum:number, slug:string, turler:string[], turIdler:number[], olusturmaTs:number, ad:string}|null}
 */
export function tercihGecerli(ham) {
  if (!ham || typeof ham !== 'object') return null;
  const slug = typeof ham.slug === 'string' && ham.slug.trim() ? ham.slug.trim() : 'kendi';
  const turler = [];
  const turIdler = [];
  for (const t of Array.isArray(ham.turler) ? ham.turler : []) {
    const tanim = turRafTanimi(t);
    if (!tanim || turler.includes(tanim.slug)) continue;
    turler.push(tanim.slug);
    for (const id of tanim.turIdler) if (!turIdler.includes(id)) turIdler.push(id);
  }
  // Serbest geçerli TMDB kimlikleri (örn. kayıtlı özel tercih) de kabul edilir.
  for (const id of Array.isArray(ham.turIdler) ? ham.turIdler : []) {
    const n = Number(id);
    if (Number.isFinite(n) && n > 0 && !turIdler.includes(n)) turIdler.push(n);
  }
  if (turler.length === 0 && turIdler.length === 0 && slug === 'kendi') return null;
  return {
    surum: TERCIH_SURUMU,
    slug,
    ad: String(ham.ad || '').slice(0, 80),
    turler,
    turIdler: turIdler.slice(0, 12),
    olusturmaTs: Number(ham.olusturmaTs) || 0
  };
}

/** Depodan tercihi okur (yoksa/bozuksa null). */
export function tercihOku(depo) {
  if (!depo || typeof depo.getItem !== 'function') return null;
  try {
    const ham = depo.getItem(TERCIH_ANAHTAR);
    if (!ham) return null;
    const j = JSON.parse(ham);
    if (!j || Number(j.surum) !== TERCIH_SURUMU) return null;
    return tercihGecerli(j);
  } catch (_) {
    return null;
  }
}

/** Tercihi yazar; geçersizse false (bozuk kayıt yazılmaz). */
export function tercihYaz(depo, tercih, simdiMs = Date.now()) {
  const t = tercihGecerli(tercih);
  if (!t || !depo || typeof depo.setItem !== 'function') return false;
  try {
    depo.setItem(TERCIH_ANAHTAR, JSON.stringify({ ...t, surum: TERCIH_SURUMU, olusturmaTs: Number(simdiMs) || Date.now() }));
    return true;
  } catch (_) {
    return false;
  }
}

/** Tercihi siler (yeniden kurulum). */
export function tercihTemizle(depo) {
  if (!depo || typeof depo.removeItem !== 'function') return false;
  try {
    depo.removeItem(TERCIH_ANAHTAR);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Birden çok TMDB sayfasını tekilleştirip sıralar. Aynı yapıt bir kez girer;
 * poster/backdrop'u olmayan kayıtlar elenir (kart boş görünmez).
 *
 * @param {Array<object[]>} listeler
 * @param {{enFazla?:number, haric?:Set<string>}} [secenek]
 * @returns {object[]}
 */
export function havuzBirlestir(listeler = [], { enFazla = 240, haric = null } = {}) {
  const gorulen = new Set();
  const out = [];
  for (const liste of Array.isArray(listeler) ? listeler : []) {
    for (const oge of Array.isArray(liste) ? liste : []) {
      if (!oge || oge.id == null) continue;
      const id = String(oge.id);
      if (gorulen.has(id)) continue;
      if (haric && typeof haric.has === 'function' && haric.has(id)) continue;
      if (!oge.poster_path && !oge.backdrop_path) continue;
      gorulen.add(id);
      out.push(oge);
      if (out.length >= Math.max(1, Number(enFazla) || 240)) return out;
    }
  }
  return out;
}

/**
 * Soğuk başlangıç programı için havuz girdisi: tercih türlerini taşıyan kayıtlar
 * öne alınır (scheduler'ın tür sayımını besler), kalanlar arkada durur.
 *
 * @param {object[]} havuz
 * @param {{turIdler?:number[]}} tercih
 * @returns {object[]}
 */
export function terciheGoreSirala(havuz = [], tercih = {}) {
  const izin = new Set((Array.isArray(tercih.turIdler) ? tercih.turIdler : []).map(Number));
  const uyan = [];
  const diger = [];
  for (const oge of Array.isArray(havuz) ? havuz : []) {
    if (!oge) continue;
    const idler = new Set([
      ...(Array.isArray(oge.genre_ids) ? oge.genre_ids.map(Number) : []),
      ...(Array.isArray(oge.genres) ? oge.genres.map((g) => Number(g && g.id)) : [])
    ]);
    let eslesti = false;
    for (const id of idler) if (izin.has(id)) { eslesti = true; break; }
    (eslesti ? uyan : diger).push(oge);
  }
  return [...uyan, ...diger];
}

/**
 * TMDB `with_genres` sorgusu: çoklu türde OR gerekir ("," AND demektir ve
 * 5+ türde sonuç SIFIR döner — soğuk başlangıç havuzunun boş kalmasının kökü).
 * @param {number[]} turIdler
 * @returns {string|null}
 */
export function turSorgusu(turIdler = []) {
  const idler = (Array.isArray(turIdler) ? turIdler : [])
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0);
  const benzersiz = [...new Set(idler)];
  if (benzersiz.length === 0) return null;
  return benzersiz.join('|');
}

/**
 * TMDB keşif isteklerini SINIRLI eşzamanlılıkla çalıştırır.
 *
 * Neden: 6 isteği birden atmak TMDB'de saniyelik hız sınırına takılıyor ve
 * istekler sessizce boş dönüyordu (kanal havuzu 0 başlık → boş program).
 * Sıralı/az eşzamanlı çekim hem limiti aşmaz hem de kısmi sonuçla devam eder.
 *
 * @template T
 * @param {(i:number) => Promise<T>} istek üreteci (sıra numarası verilir)
 * @param {number} adet
 * @param {{eszamanli?:number}} [secenek]
 * @returns {Promise<T[]>} başarısız istekler atlanır (atmaz)
 */
export async function kademeliCek(istek, adet, { eszamanli = 2 } = {}) {
  const toplam = Math.max(0, Math.trunc(Number(adet) || 0));
  const kova = Math.max(1, Math.trunc(Number(eszamanli) || 2));
  const out = [];
  let i = 0;
  async function isci() {
    while (i < toplam) {
      const benim = i;
      i += 1;
      try {
        out[benim] = await istek(benim);
      } catch (_) {
        out[benim] = null;
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(kova, toplam || 1) }, () => isci()));
  return out.filter((x) => x !== null && x !== undefined);
}

/**
 * Tercihten kanal kimliği: kullanıcının seçtiği preset slug'ı (bilinmeyen →
 * 'kendi'). Görünümde rozet/başlık bununla yazılır.
 */
export function tercihSlug(tercih) {
  const s = String(tercih?.slug || '').trim();
  return s || 'kendi';
}

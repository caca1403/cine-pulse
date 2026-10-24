/* Kalite filtresi — SAF modül (storage'dan ve DOM'dan bağımsız).
   Kullanıcı olayı: Netflix/Prime/Disney+ üçünde kalite seçimi var, bizde yok
   (notlar/parite-ve-farklilar.md #11). DÜRÜST çözüm: sahte kalite-switch
   YASAK (kaynak zaten ne veriyorsa o). Bunun yerine MEVCUT kaynak listesinde
   kalite ETİKETİYLE filtrele + kalite sırasına göre sırala + tercihi hatırla.
   Kalite tespiti yalnız mevcut etiket/metin alanlarından (quality, ad, URL)
   okunur; uydurma alan ÜRETİLMEZ. Etiket hiç olmayan kaynak 'diger' sayılır
   ve elemez (filtre 'hepsi' onu korur). */

// Metinden en yüksek kalite seviyesini okur (4k > 1080 > 720 öncelikli).
// providerAggregator.siralamaSkoru ile aynı dürüst sinyalleri kullanır.
export function kaliteSeviye(srv) {
  if (!srv || typeof srv !== 'object') return 'diger';
  const metin = [srv.quality, srv.displayName, srv.name, srv.streamUrl, srv.url]
    .filter(Boolean).join(' ').toLowerCase();
  if (/\b(4k|2160p?|uhd)\b/.test(metin)) return '4k';
  if (/\b(1080p?|full[\s-]?hd|fhd)\b/.test(metin)) return '1080';
  if (/\b(720p?|hd[\s-]?ready)\b/.test(metin)) return '720';
  return 'diger';
}

// tercih/filtre girdisini güvenli bir filtre anahtarına yuvarlar.
// Eski '1080p' gibi string'ler bozulmadan normalize edilir; bilinmeyen
// her değer 'hepsi'ye düşer (hiçbir kaynak gizlenmesin).
export function normalizeKaliteTercihi(raw) {
  if (raw === null || raw === undefined) return 'hepsi';
  const t = String(raw).trim().toLowerCase();
  if (t === '' || t === 'hepsi' || t === 'tümü' || t === 'tum' || t === 'all'
    || t === 'auto' || t === 'none' || t === 'yok') return 'hepsi';
  if (t === '4k' || t === '2160' || t === '2160p' || t === 'uhd') return '4k';
  if (t === '1080' || t === '1080p' || t === 'fullhd' || t === 'fhd') return '1080';
  if (t === '720' || t === '720p' || t === 'hd') return '720';
  const n = parseInt(t, 10);
  if (Number.isFinite(n)) {
    if (n >= 2160) return '4k';
    if (n >= 1080) return '1080';
    return '720'; // <720 (480/360) en yakın kullanılabilir seviyeye yuvarlanır
  }
  return 'hepsi';
}

// filtre 'hepsi' ise her şey geçer; değilse "en az bu kalite" mantığı:
// '4k'→{4k}, '1080'→{1080,4k}, '720'→{720,1080,4k}. 'diger' hiçbir
// kaliteli filtreye girmez ama 'hepsi'de korunur.
export function kaliteUyar(srv, filtre) {
  const f = normalizeKaliteTercihi(filtre);
  if (f === 'hepsi') return true;
  const s = kaliteSeviye(srv);
  if (f === '4k') return s === '4k';
  if (f === '1080') return s === '1080' || s === '4k';
  if (f === '720') return s === '720' || s === '1080' || s === '4k';
  return true;
}

const SIRA = { '4k': 0, '1080': 1, '720': 2, 'diger': 3 };

/* Girdi: kaynaklar[], filtre ('hepsi'|'4k'|'1080'|'720'), tercih? (filtre
   yoksa/gçersizse kullanılır). Çıktı: { kaynaklar, sayimlar, bosMu }.
   - kaynaklar: filtrelenmiş + kalite sırasına göre (4k>1080>720>diger)
     sıralanmış; aynı seviyede orijinal sıra korunur (kararlı).
   - sayimlar: TÜM girdinin seviye sayaçları {4k,1080,720,diger} — UI her
     çipin kaç kaynak göstereceğini bundan hesaplar.
   - bosMu: filtre sonucu 0 kaynak → true (UI o filtreyi pasif gösterir /
     "filtreyi temizle" sunar). */
export function kaliteFiltrele(kaynaklar, filtre, tercih) {
  const ham = Array.isArray(kaynaklar) ? kaynaklar : [];
  const sayimlar = { '4k': 0, '1080': 0, '720': 0, 'diger': 0 };
  for (const s of ham) {
    const v = kaliteSeviye(s);
    sayimlar[v] = (sayimlar[v] || 0) + 1;
  }
  const f = (filtre === null || filtre === undefined)
    ? normalizeKaliteTercihi(tercih)
    : normalizeKaliteTercihi(filtre);
  const filtreli = ham.filter(s => kaliteUyar(s, f));
  filtreli.sort((a, b) => SIRA[kaliteSeviye(a)] - SIRA[kaliteSeviye(b)]);
  return { kaynaklar: filtreli, sayimlar, bosMu: filtreli.length === 0 };
}

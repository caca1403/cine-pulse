/* ==========================================================================
   UÇTAN UCA: aggregator'ın GERÇEK giriş noktaları yayın döndürüyor mu?

   Kazıyıcıları doğrudan çağırmak kolaydı ve hep geçiyordu; asıl soru şuydu:
   bir başlık verildiğinde uygulamanın gerçekten kullandığı fonksiyon
   oynatılabilir bir yayın döndürüyor mu? Burada tam olarak o çağrı yapılır.
   ========================================================================== */

const SIDECAR = 'http://127.0.0.1:4000';
const nativeFetch = globalThis.fetch;
globalThis.fetch = (input, init) => {
  const url = typeof input === 'string' && input.startsWith('/') ? SIDECAR + input : input;
  return nativeFetch(url, init);
};

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
globalThis.window = { location: { hostname: '', protocol: 'https:' }, CinePulseDesktop: { isDesktop: true } };

let pass = 0, fail = 0;
const ok = (c, m) => { c ? (pass++, console.log(`  ✓ ${m}`)) : (fail++, console.log(`  ✗ ${m}`)); };

const oynatilabilir = (s) => s && typeof s.streamUrl === 'string' && s.streamUrl.length > 8;

console.log('\n═══ DİZİ — dizi77 (Corvus) ═══');
const { fetchDizi77Sources } = await import('../src/services/dizi77Scraper.js');
const d77 = await fetchDizi77Sources({ titles: ['The Walking Dead'], title: 'The Walking Dead', season: 1, episode: 1 });
ok(Array.isArray(d77) && d77.length > 0, `1.S1.B1 için ${d77.length} yayın döndü`);
ok(d77.length > 0 && oynatilabilir(d77[0]), 'yayın oynatılabilir bir streamUrl taşıyor');
if (d77[0]) {
  ok(d77[0].isIframe === true || d77[0].isDirectVideo || /\.(m3u8|mp4|mkv)/i.test(d77[0].streamUrl),
    'kaynak doğru biçimde işaretli (doğrudan yayın ya da gömülü oynatıcı)');
  ok(/^https:\/\//.test(d77[0].streamUrl), `iframe adresi geçerli: ${d77[0].streamUrl.slice(0, 58)}`);
  const menzile = await fetch(d77[0].streamUrl, { redirect: 'manual' }).catch(() => null);
  ok(!!menzile, `oynatıcı sunucusu yanıt veriyor (HTTP ${menzile ? menzile.status : 'yok'})`);
}
const d77b = await fetchDizi77Sources({ titles: ['Breaking Bad'], title: 'Breaking Bad', season: 1, episode: 1 });
ok(d77b.length > 0, `ikinci dizi de açılıyor (Breaking Bad: ${d77b.length})`);

console.log('\n═══ FİLM — Halcyon (temiz sağlayıcı) ═══');
const { coz: cozHalcyon } = await import('../src/providers/halcyon.js');
// Paw Patrol katalogda yoktu (0 yayın); Halcyon'un aramasıyla kanıtlanmış
// başlık (newSources.test.mjs) kullanılıyor.
const hal = await cozHalcyon({ type: 'movie', title: 'Interstellar', originalTitle: 'Interstellar', tmdbId: 157336 });
const smc = (hal && hal.sources) || [];
ok(smc.length > 0, `arşivden eşleşti, ${smc.length} yayın`);
// Temiz sağlayıcı sözleşmesi: url = doğrudan akış, etiket = kod adı
ok(smc.length > 0 && typeof smc[0].url === 'string' && smc[0].url.length > 8, 'yayın doğrudan akış adresi taşıyor');
if (smc[0]) {
  ok(smc[0].isIframe !== true, 'iframe değil (kural: gömülü oynatıcı listelenmez)');
  // kaynak() sözleşmesi: etiket name/source alanlarında (eski `ad` alanı kalktı)
  ok(/^Halcyon\b/.test(smc[0].name || smc[0].source || ''), 'etiket kod adıyla başlıyor (site adı sızmıyor)');
  const menzile = await fetch(smc[0].url, { headers: smc[0].headers || {}, redirect: 'follow' }).catch(() => null);
  ok(!!menzile && menzile.status < 400, `manifest sunucusu yanıt veriyor (HTTP ${menzile ? menzile.status : 'yok'})`);
  const govde = menzile ? (await menzile.text().catch(() => '')) : '';
  ok(/#EXTM3U/.test(govde) || /^.{0,64}(ftyp|EBMF|0{0,4}\x1aE\xdf\xa7)/s.test(govde), 'geçerli HLS/mp4 gövdesi');
}

console.log('\n═══ FİLM — toplu M3U (Pulsar) ═══');
const { fetchVodSources } = await import('../src/services/vodM3uSources.js');
await (await import('../src/services/vodM3uSources.js')).loadVodSource('jetfilm');
const vod = await fetchVodSources({ titles: ['Barbie'], title: 'Barbie' });
ok(vod.length > 0, `"Barbie" için ${vod.length} yayın`);
ok(vod.length > 0 && oynatilabilir(vod[0]), 'yayın oynatılabilir bir streamUrl taşıyor');
if (vod[0]) {
  ok(vod[0].streamUrl.includes('/api/hls_proxy'), 'oynatma proxy üzerinden geçiyor');
  // Katalog disaridan geliyor ve baglantilarin bir kismi silinmis; bu yuzden
  // TEK bir dosyaya degil, listeden EN AZ BIRinin sunulmasina bakiliyor.
  let servis = 0, denenen = 0;
  for (const s of vod.slice(0, 6)) {
    denenen++;
    const r = await fetch(SIDECAR + s.streamUrl, { redirect: 'manual' }).catch(() => null);
    if (r && r.status < 400) servis++;
  }
  ok(servis > 0, `proxy yayını sunuyor (${servis}/${denenen} dosya canlı — katalogda ölü bağlantılar var)`);
}

console.log('\n═══ Boş/çöp girdi güvenliği ═══');
const bos1 = await fetchDizi77Sources({ titles: [], title: '', season: 1, episode: 1 });
ok(bos1.length === 0, 'boş başlık dizi77\'de kaynak döndürmüyor');
const bos2 = (await cozHalcyon({ type: 'movie', title: '', originalTitle: '' }))?.sources || [];
ok(bos2.length === 0, 'boş başlık Halcyon\'da kaynak döndürmüyor');
const bos3 = await fetchVodSources({ titles: [], title: '' });
ok(bos3.length === 0, 'boş başlık film M3U\'da kaynak döndürmüyor');

console.log(`\n${fail === 0 ? 'TAMAM' : 'BAŞARISIZ'} — geçen: ${pass}, kalan: ${fail}`);
process.exit(fail === 0 ? 0 : 1);
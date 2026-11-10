/* ==========================================================================
   Oynatıcı bölüm-geçiş navigasyonu (PlayerModal)
   --------------------------------------------------------------------------
   Kullanıcı şikâyeti (birebir): "bölüme gitme, bir bölümden diğer bölüme
   gitme gibi seçenekler yok — bu çok temel bir özellik".

   Kaplanan davranışlar:
   1) TMDB bölüm sayısı belirsizken bile "Sonraki Bölüm" düğmesi çizilir
      (mevcut numara +1); B1'de "Önceki Bölüm" gizli, S>1'de prev-season
      dalı korunur (önceki sezon sayısı boşsa 1 varsayılır).
   2) Klavye eşlemesi: n/Shift+N sonraki, p önceki, s bölüm listesi,
      f tam ekran, m ses, ←/→ 5 sn sar — tek keydown dinleyicisi, input
      içi tuşlar eşlenmez.
   3) "Bölümler" düğmesi (#btn-open-episodes) mevcut seçici UI'a bağlanır;
      yeni oynatma mantığı YAZILMAZ (switchEpisodeInPlayer akışı döner).

   NOT: PlayerModal.js modül grafiği CSS öykünmeleri (import '../styles...)
   içerdiği için testte import EDİLEMEZ; yapılabilir tek dürüst doğrulama
   (a) saf fonksiyon kisaYolEylemi'ni kaynak kesiminden izole edip
   ÇALIŞTIRMAK, (b) closure'lu render/handler davranışlarını kaynak
   yapısal doğrulama ile sabitlemek.

   Çalıştır: node --test tests/oynatici-bolum-nav.test.mjs
   ========================================================================== */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const KOK = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const oku = (...p) => fs.readFileSync(path.join(KOK, ...p), 'utf8');

const KAYNAK = oku('src/components/PlayerModal.js');
const CSS = oku('src/styles/main.css');

/* ---------------------------------------------------------------- SAF EŞLEME FONKSİYONUNUN İZOLASYONU ---------------------------------- */

/** PlayerModal.js'ten kisaYolEylemi gövdesini kesip modül-dışı eval eder.
    Fonksiyon bilinçli olarak bağımlılıksız; gövdede string/yorum içinde
    süslü parantez bulunmadığı için küme sayımı (brace-count) güvenlidir. */
function kisaYolEylemiIzole() {
  const basEtiket = 'export function kisaYolEylemi';
  const bas = KAYNAK.indexOf(basEtiket);
  assert.ok(bas > -1, 'kisaYolEylemi modül seviyesinde export edilmiş olmalı');
  const govdeAcilis = KAYNAK.indexOf('{', bas);
  assert.ok(govdeAcilis > bas, 'fonksiyon gövdesi bulunmalı');
  let derinlik = 0;
  let son = -1;
  for (let i = govdeAcilis; i < KAYNAK.length; i++) {
    const k = KAYNAK[i];
    if (k === '{') derinlik++;
    else if (k === '}') {
      derinlik--;
      if (derinlik === 0) { son = i; break; }
    }
  }
  assert.ok(son > govdeAcilis, 'gövde kapanışı küme sayımıyla bulunmalı');
  const kesim = KAYNAK.slice(bas, son + 1).replace(/^export /, '');
  const fn = new Function(`${kesim}; return kisaYolEylemi;`)();
  assert.equal(typeof fn, 'function');
  return fn;
}

const kisaYolEylemi = kisaYolEylemiIzole();

const DIZI = { isSeries: true };
const FILM = {};
const DIZI_CEVREMDISI = { isSeries: true, isOfflinePlayback: true };
const INPUT_ICI = { girisOgesiIcinde: true, isSeries: true };

test('kisaYolEylemi: n / N / Shift+N sonraki bölmeyi eşler (yalnız dizi + çevrimiçi)', () => {
  assert.equal(kisaYolEylemi('n', DIZI), 'bolum-sonraki');
  assert.equal(kisaYolEylemi('N', DIZI), 'bolum-sonraki', 'Shift+N (e.key=N) aynı eylemi verir');
  assert.equal(kisaYolEylemi('n', FILM), null, 'filmde bölüm navigasyonu eşlenmez');
  assert.equal(kisaYolEylemi('n', DIZI_CEVREMDISI), null, 'çevrimdışı oynatmada bölüm değişimi yok');
});

test('kisaYolEylemi: p / P önceki bölümü eşler', () => {
  assert.equal(kisaYolEylemi('p', DIZI), 'bolum-onceki');
  assert.equal(kisaYolEylemi('P', DIZI), 'bolum-onceki');
  assert.equal(kisaYolEylemi('p', FILM), null);
});

test('kisaYolEylemi: s / S bölüm listesini açar (mevcut seçici UI)', () => {
  assert.equal(kisaYolEylemi('s', DIZI), 'bolum-listesi');
  assert.equal(kisaYolEylemi('S', DIZI), 'bolum-listesi');
  assert.equal(kisaYolEylemi('s', FILM), null);
});

test('kisaYolEylemi: f tam ekran, m ses — dizi/film ayrımı olmadan yerel', () => {
  assert.equal(kisaYolEylemi('f', FILM), 'tam-ekran-degistir');
  assert.equal(kisaYolEylemi('F', DIZI), 'tam-ekran-degistir');
  assert.equal(kisaYolEylemi('m', FILM), 'sesi-degistir');
  assert.equal(kisaYolEylemi('m', DIZI), 'sesi-degistir');
});

test('kisaYolEylemi: ←/→ sarma dalları (5 sn uygulaması handlerda) eşlenir', () => {
  assert.equal(kisaYolEylemi('ArrowRight', FILM), 'ileri-sar');
  assert.equal(kisaYolEylemi('ArrowLeft', FILM), 'geri-sar');
});

test('kisaYolEylemi: input/textarea/select içinde hiçbir tuş eşlenmez (e.target kararı)', () => {
  for (const tus of ['n', 'N', 'p', 'P', 's', 'S', 'f', 'F', 'm', 'ArrowRight', 'ArrowLeft']) {
    assert.equal(kisaYolEylemi(tus, INPUT_ICI), null, `INPUT_ICI içinde ${tus} eşlenmez`);
  }
});

test('kisaYolEylemi: bilinmeyen/boş tuş eşlenmez', () => {
  assert.equal(kisaYolEylemi('q', DIZI), null);
  assert.equal(kisaYolEylemi('', DIZI), null);
  assert.equal(kisaYolEylemi(null, DIZI), null);
  assert.equal(kisaYolEylemi('n'), null, 'hedef verilmeyince dizi varsayımı yapılmaz');
});

/* ---------------------------------------------------------------- GÖRÜNÜRLÜK: NAV DÜĞMELERİ (kaynak yapısal doğrulama) ----------------- */

test('renderFooterNavButtonsHTML: bölüm sayısı BELİRSİZSE Sonraki Bölüm düğmesi +1 ile GÖRÜNÜR', () => {
  const yedekEtiketi = 'title="Bölüm sayısı belirsiz"';
  const i = KAYNAK.indexOf(yedekEtiketi);
  assert.ok(i > -1, 'belirsiz sayı yedeği düğmesi çizilmeli');
  const pencere = KAYNAK.slice(Math.max(0, i - 400), i + 400);
  assert.ok(pencere.includes('data-action="next-ep"'), 'görünür düğme SONRAKİ BÖLÜM eylemini taşır');
  assert.ok(pencere.includes('currentEpisode + 1'), 'bölüm no mevcuttan +1 hesaplanır');
  assert.ok(pencere.includes('btn-next-episode'), 'button id handler bağlantısıyla uyumlu (btn-next-episode)');
});

test('renderFooterNavButtonsHTML: B1 + S>1 tarafında PREV-SEZON yolu KORUNUR ve sayı 1 yedeklenir', () => {
  const i = KAYNAK.indexOf('getSeasonEpisodeCount(currentSeason - 1) || 1');
  assert.ok(i > -1, 'önceki sezon sayısı bilinmiyorsa 1 varsayımı korunmalı');
  const pencere = KAYNAK.slice(Math.max(0, i - 600), i + 600);
  assert.ok(pencere.includes('data-action="prev-season"'), 'prev-season düğme yolu korunur');
  assert.ok(pencere.includes('data-prev-ep'), 'geri basım hedef bölümü verilmiştir');
});

/* ---------------------------------------------------------------- DÜĞME + MENÜ BAĞLANTISI: "Bölümler" -------------------------------- */

test("'Bölümler' düğmesi alt çubukta çizilir ve mevcut seçiciye (acBolumSecici) bağlanır", () => {
  assert.ok(KAYNAK.includes('id="btn-open-episodes"'), 'btn-open-episodes alt çubuk satırına eklenmeli');
  assert.ok(KAYNAK.includes('data-action="episodes"'), 'tıklama eylemini taşıyan button render edilir');
  const bağlan = KAYNAK.indexOf('const episodesBtn = document.getElementById', KAYNAK.indexOf('function attachFooterNavEvents'));
  assert.ok(bağlan > -1, 'attachFooterNavEvents düğmeyi bağlar');
  const çağrı = KAYNAK.slice(bağlan, bağlan + 300);
  assert.ok(çağrı.includes('acBolumSecici'), 'Bölüm listesi düğmesi acBolumSecici çağırır');
});

test('acBolumSecici: önce mevcut drawer, yoksa canlı sağ panel — YENİ oynatma MANTIĞI YOK', () => {
  const bas = KAYNAK.indexOf('function acBolumSecici');
  assert.ok(bas > -1);
  const govde = KAYNAK.slice(bas, bas + 1200);
  assert.ok(govde.includes('player-episode-drawer'), 'varsa drawer açılır');
  assert.ok(govde.includes('player-yt-sidebar'), 'yoksa mevcut sağ panel odaklanır');
  assert.ok(!govde.includes('getStreamingServers'), 'yeni kaynak-çözüm mantığı YAZILMAZ');
  assert.ok(!govde.includes('videoEl.play'), 'yeni oynatma mantığı YAZILMAZ');
});

/* ---------------------------------------------------------------- KLAVYE İŞLETİMİ VE TEK DİNLEYİCİ -------------------------------------- */

test('handleKeydown: S dalı (dizi + çevrimiçi) acBolumSecici çağırır; ikinci keydown dinleyicisi kurulmaz', () => {
  const dal = KAYNAK.indexOf("} else if (e.key === 's' || e.key === 'S') {");
  assert.ok(dal > -1, 'S tuşuna özel dal handleKeydown içinde eklendi');
  const pencere = KAYNAK.slice(dal, dal + 400);
  assert.ok(pencere.includes('acBolumSecici()'), 'dal seçiciyi açar');
  assert.ok(pencere.includes('isSeries'), 'S, dizi harici içerikte bölüm listesi açmaz');
  assert.ok(pencere.includes('isOfflinePlayback'), 'S, çevrimdışı oynatmada tetiklenmez');
  const bağlamaSayısı = KAYNAK.split("document.addEventListener('keydown', handleKeydown)").length - 1;
  assert.equal(bağlamaSayısı, 1, 'klavye için İKİNCİ keydown dinleyicisi kurulmamalı: tek bağlama');
});

test('handleKeydown: ←/→ 5 SN sarma', () => {
  const başlangıç = KAYNAK.indexOf('const handleKeydown');
  const sağ = KAYNAK.indexOf("} else if (e.key === 'ArrowRight') {", başlangıç);
  assert.ok(sağ > -1, 'var olan tek dinleyici içinde ok dalları korunur');
  const sağPencere = KAYNAK.slice(sağ, sağ + 500);
  assert.ok(sağPencere.includes('currentTime + 5'), '→ 5 saniye ileri sarar');
  const geri = KAYNAK.indexOf("e.key === 'ArrowLeft'", sağ);
  const geriPencere = KAYNAK.slice(geri, geri + 500);
  assert.ok(geriPencere.includes('currentTime - 5'), '← 5 saniye geri sarar');
});

test('kısayol kartı: 5 saniye + S satırı listelenir', () => {
  assert.ok(KAYNAK.includes('<span>5 Saniye İleri / Geri</span>'), 'kısayol kartında 5 sn metni');
  assert.ok(KAYNAK.includes('<kbd>S</kbd><span>Bölüm Listesi</span>'), 'kısayol kartında S satırı');
});

/* ---------------------------------------------------------------- CSS — DOKUNMATİK HEDEF >= 40px ---------------------------------------- */

test('main.css: nav düğmeleri ve bölüm kartları için 40px dokunmatik hedef tanımlı', () => {
  assert.ok(CSS.includes('min-height: 40px'), 'CSS 40px dokunmatik hedef tanımlar');
  assert.ok(CSS.includes('.btn-nav-episode'), '.btn-nav-episode hedefi CSS ile büyütülür');
  assert.ok(CSS.includes('#player-modal .quick-ep-card'), 'quick-ep-card hedefi CSS ile büyütülür');
  assert.ok(CSS.includes('bolum-liste-odak'), 'seçici vurgu sınıfı CSS ile birlikte tanımlı');
});

/* ---------------------------------------------------------------- BÖLÜMLER IZGARASI (kaynak modu) --------------------------------- */

/** PlayerModal.js'ten bolumSeciciPlan gövdesini kesip izole çalıştırır
    (kisaYolEylemi ile aynı brace-count pazarlığı). */
function bolumSeciciPlanIzole() {
  const basEtiket = 'export function bolumSeciciPlan';
  const bas = KAYNAK.indexOf(basEtiket);
  assert.ok(bas > -1, 'bolumSeciciPlan modül seviyesinde export edilmiş olmalı');
  const govdeAcilis = KAYNAK.indexOf('{', bas);
  let derinlik = 0;
  let son = -1;
  for (let i = govdeAcilis; i < KAYNAK.length; i++) {
    const k = KAYNAK[i];
    if (k === '{') derinlik++;
    else if (k === '}') { derinlik--; if (derinlik === 0) { son = i; break; } }
  }
  assert.ok(son > govdeAcilis, 'gövde kapanışı küme sayımıyla bulunmalı');
  const kesim = KAYNAK.slice(bas, son + 1).replace(/^export /, '');
  const fn = new Function(`${kesim}; return bolumSeciciPlan;`)();
  assert.equal(typeof fn, 'function');
  return fn;
}

const bolumSeciciPlan = bolumSeciciPlanIzole();

test('bolumSeciciPlan: bölüm sayısı bilinmiyorsa 24 varsayar, biliniyorsa onu kullanır', () => {
  const bilinmeyen = bolumSeciciPlan({ sezonSayisi: 3, mevcutSezon: 2, mevcutBolum: 5, sezonBolumSayilari: {} });
  assert.equal(bilinmeyen.bolumler.length, 24, 'TMDB suskunsa 24 bölüm gösterilir');
  assert.equal(bilinmeyen.aktifSezon, 2);
  assert.equal(bilinmeyen.aktifBolum, 5);
  assert.deepEqual(bilinmeyen.sezonlar, [1, 2, 3]);
  const bilinen = bolumSeciciPlan({ sezonSayisi: 3, mevcutSezon: 2, mevcutBolum: 5, sezonBolumSayilari: { 2: 13 } });
  assert.equal(bilinen.bolumler.length, 13);
  assert.equal(bilinen.bolumler[12], 13);
});

test('bolumSeciciPlan: sezon sayısı mevcut sezondan küçük kalamaz (TMDB geç/eksik verisi)', () => {
  const plan = bolumSeciciPlan({ sezonSayisi: 0, mevcutSezon: 4, mevcutBolum: 1, sezonBolumSayilari: {} });
  assert.deepEqual(plan.sezonlar, [1, 2, 3, 4], 'en az mevcut sezona kadar çip üretilir');
  const bos = bolumSeciciPlan();
  assert.deepEqual(bos.sezonlar, [1], 'girdisiz çağrıda tek sezon + 24 bölüm');
  assert.equal(bos.aktifBolum, 1);
});

test('acBolumSecici: sidebar GİZLİYSE oynatıcı içi ızgara overlay açılır (kör dal kapandı)', () => {
  const bas = KAYNAK.indexOf('function acBolumSecici');
  const govde = KAYNAK.slice(bas, KAYNAK.indexOf('function acBolumIzgaraOverlay'));
  assert.ok(govde.includes('sidebar.offsetHeight > 0'), 'görünürlük ölçülmeden sidebar’a dalınmaz');
  assert.ok(govde.includes('acBolumIzgaraOverlay()'), 'gizli sidebar yerine ızgara açılır');
  assert.ok(!govde.includes("showToast('Bölüm listesi bu bölümde kullanılamıyor.'"), 'ölü toast yolu kaldırıldı');
});

test('acBolumIzgaraOverlay: seçim switchEpisodeInPlayer’dan döner; ikinci dinleyici/ yeni oynatma yok', () => {
  const bas = KAYNAK.indexOf('function acBolumIzgaraOverlay');
  assert.ok(bas > -1);
  const govde = KAYNAK.slice(bas, bas + 4200);
  assert.ok(govde.includes("getElementById('bolum-secici-overlay')"), 'overlay tekil (toggle ile kapanır)');
  assert.ok(govde.includes('switchEpisodeInPlayer(seciliSezon, b)'), 'bölüm seçimi mevcut geçiş akışını çağırır');
  assert.ok(govde.includes("setAttribute('role', 'dialog')"), 'erişilebilirlik: dialog rolü');
  assert.ok(!govde.includes('getStreamingServers'), 'yeni kaynak-çözüm mantığı yazılmaz');
  assert.ok(!govde.includes('.play()'), 'yeni oynatma mantığı yazılmaz');
});

test('main.css: ızgara kart ve sezon çipleri 40px dokunmatik hedef + tema vurgusu', () => {
  assert.ok(CSS.includes('.bolum-secici-kart'), 'ızgara kartı tanımlı');
  assert.ok(CSS.includes('.bolum-secici-sezon.aktif'), 'aktif sezon çipi vurgusu tanımlı');
  const kart = CSS.slice(CSS.indexOf('.bolum-secici-kart {'), CSS.indexOf('.bolum-secici-kart {') + 300);
  assert.ok(kart.includes('min-height: 40px'), 'kartlar 40px hedef');
});

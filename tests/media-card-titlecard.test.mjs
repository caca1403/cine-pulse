/* ==========================================================================
   Kart başlığı kuralları (MediaCard) — kullanıcı isteği 2026-10-16 (v2)
   --------------------------------------------------------------------------
   KURAL: kart AFİŞİ TEMİZDİR — üstünde ne düz yazı, ne logo, ne tür/yıl.
   Eskiden afişin üstüne basılan başlık + logo + tür/yıl + hover metni birbirinin
   üstüne biniyordu; v2'de hepsi kartın ALTINDAKİ bilgi şeridine taşındı:
   sırayla özel başlık logosu (yoksa düz başlık) ve tür • yıl.
   Çalıştır: node --test tests/media-card-titlecard.test.mjs
   Ağ yok, DOM yok: renderMediaCard saf şablon üretir.
   ========================================================================== */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { renderMediaCard } from '../src/components/MediaCard.js';

const KOK = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const oku = (...p) => fs.readFileSync(path.join(KOK, ...p), 'utf8');

const KART = (baslik) => ({
  id: 550,
  title: baslik,
  poster_path: '/p.jpg',
  backdrop_path: '/b.jpg',
  release_date: '2024-05-01',
  vote_average: 7.5,
  overview: 'test'
});

/** Afiş bloğu (poster-wrapper) ile kart-altı bilgi bloğunu ayırır. */
function afisBolugu(html) {
  const bas = html.indexOf('card-poster-wrapper');
  const bit = html.indexOf('card-info');
  assert.ok(bas > -1 && bit > bas, 'afiş ve bilgi bloğu bulunmalı');
  return html.slice(bas, bit);
}

test('afişin üstünde başlık YOK: tipografik başlık-kartı kaldırıldı', () => {
  const html = renderMediaCard(KART('Paranormal Activity'), { skipProgressLookup: true });
  const afis = afisBolugu(html);
  assert.ok(!afis.includes('card-titlecard'), 'card-titlecard afişe dönememeli');
  assert.ok(!html.includes('card-titlecard'), 'başlık-kartı bütünüyle kalkmalı');
});

test('afiş TEMİZ (v2): ne başlık ne logo ne meta metni afişin üstünde', () => {
  const html = renderMediaCard(KART('Dune'), { skipProgressLookup: true });
  const afis = afisBolugu(html);
  // Bu yüzeylerin hepsi afişe metin/logo basıyordu ve birbirinin üstüne biniyordu.
  for (const kalinti of [
    'card-cinematic-title',
    'card-cinematic-meta',
    'card-title-logo',
    'card-hover-title',
    'card-fanart-logo'
  ]) {
    assert.ok(!afis.includes(kalinti), `${kalinti} afişe dönememeli — afiş temiz kalacak`);
  }
});

test('bilgi şeridi (v2): logo + başlık + tür • yıl afişin ALTINDA', () => {
  const html = renderMediaCard(KART('Dune'), { skipProgressLookup: true });
  const bilgi = html.slice(html.indexOf('card-info'));
  assert.match(bilgi, /class="card-title-logo"/, 'logo elemanı bilgi şeridinde olmalı');
  assert.match(bilgi, /class="card-meta"/, 'tür • yıl satırı bilgi şeridinde olmalı');
  assert.match(bilgi, /card-type-tag/, 'tür etiketi korunmalı');
  assert.match(bilgi, /card-year-tag/, 'yıl korunmalı');
  assert.ok(!afisBolugu(html).includes('card-title-logo'), 'logo afişe giremez');

  // Logo tembel yüklenir: şablonda src yok, görünürlükte IntersectionObserver verir.
  assert.ok(!/card-title-logo[^>]*\ssrc=/.test(html), 'logo şablon src ile gelmemeli');
  const kaynak = oku('src', 'components', 'MediaCard.js');
  assert.match(kaynak, /kartLogolariBagla/, 'kart logoları görünürlüğe bağlanmalı');
  assert.match(kaynak, /baslikLogosu\(/, 'logo TMDB/Fanart servisten alınmalı');
});

test('dokunmatikte hover katmanı yok (basışta takılıp afişi basıyordu)', () => {
  const css = oku('src', 'styles', 'main.css');
  assert.match(
    css,
    /@media \(hover: none\)\s*\{[\s\S]{0,160}\.card-hover-overlay/,
    'dokunmatik aygıtlarda hover katmanı kapatılmalı'
  );
  assert.match(
    css,
    /@media \(hover: hover\)[\s\S]{0,240}\.media-card:hover \.card-hover-overlay/,
    'hover yalnız gerçek imleçte açılmalı'
  );
  const html = renderMediaCard(KART('Dune'), { skipProgressLookup: true });
  assert.ok(!html.includes('card-hover-title'), 'hover katmanı başlığı tekrarlamamalı');
});

test('afişin üstünde içerik LOGOSU da YOK (logo bilgi şeridinde)', () => {
  const html = renderMediaCard(KART('Dune'), { skipProgressLookup: true });
  assert.ok(!html.includes('card-fanart-composite'), 'kart logo kompoziti kurulmamalı');
  assert.ok(!afisBolugu(html).includes('card-title-logo'), 'logo afiş bloğunda olamaz');
});

test('başlık kartın ALTINDA duruyor (erişilebilirlik + bulunabilirlik)', () => {
  const html = renderMediaCard(KART('Paranormal Activity'), { skipProgressLookup: true });
  const bilgi = html.slice(html.indexOf('card-info'));
  assert.match(bilgi, /class="card-title"[^>]*>Paranormal Activity</);

  // Afiş bloğunda kalıcı başlık metni olmamalı. Üzerine gelince çıkan
  // hızlı-izleme katmanı (hover) kalıcı değildir; o kural dışıdır.
  const afis = afisBolugu(html).replace(/<div class="card-hover-overlay"[\s\S]*?<\/div>\s*<\/div>/, '');
  assert.ok(!afis.includes('>Paranormal Activity<'), 'başlık metni afişe basılmamalı');
});

test('kart bilgi şeridi (v3): yıl + izleme durumu + puan afişin ALTINDA görünür', () => {
  const html = renderMediaCard(KART('Dune'), { skipProgressLookup: true });
  // v3 (kullanıcı isteği 2026-10-17): yıl/puan/izleme durumu artık afişin
  // ÜSTÜNDE değil, afişin altındaki tek bilgi satırında. Bilgi kaybolmadı;
  // yalnız afiş temiz kaldı ("resim güzel, alt taraf kötüydü" geri bildirimi).
  const bilgi = html.slice(html.indexOf('card-info'));
  assert.match(bilgi, /card-year-tag/, 'yıl bilgi şeridinde kalmalı');
  assert.match(bilgi, /card-rating-inline/, 'puan kendi chip’iyle bilgi şeridinde kalmalı');
  assert.ok(!html.includes('card-top-strip'), 'afiş üstü meta şeridi geri gelmemeli');
  assert.ok(!html.includes('card-top-year'), 'afiş üstü yıl chip’i geri gelmemeli');
  const css = oku('src', 'styles', 'main.css');
  assert.match(css, /\.card-info \.card-rating-inline\s*\{/, 'puan chip’i stillenmeli');
  assert.match(css, /\.card-info \.card-status-chip/, 'izleme durumu rozeti stillenmeli');
  assert.ok(!css.includes('.card-top-strip'), 'afiş üstü şeridin ölü CSS’i kalmamalı');
});

test('ölü CSS bırakılmadı: başlık-kartı ve sinematik başlık kuralları silindi', () => {
  const css = oku('src', 'styles', 'main.css');
  for (const secici of [
    '.card-titlecard',
    '.card-titlecard-text',
    '.card-cinematic-title',
    '.card-cinematic-meta',
    '.card-cinematic-type',
    '.card-cinematic-dot',
    '.card-cinematic-year',
    '.card-hover-title',
    '.cards-landscape .card-fanart-composite .card-fanart-logo'
  ]) {
    assert.ok(!css.includes(secici), `${secici} hâlâ CSS'te duruyor`);
  }
  // kart-altı başlık stilinin yaşıyor olması gerekir
  assert.ok(css.includes('.card-title'), 'kart-altı başlık stylingi korunmalı');
  // v2: bilgi şeridi görünür olmalı (eskiden display:none !important idi)
  assert.ok(!/\.card-info \{[^}]*display:\s*none\s*!important/.test(css), 'bilgi şeridi yine gizlenemez');
});

test('hero özel tasarımlı başlığı kullanabiliyor (logo + yazi yedeği)', () => {
  const kaynak = oku('src', 'components', 'HeroSlider.js');
  assert.match(kaynak, /hero-titleblock/, 'hero başlık bloğu olmalı');
  assert.match(kaynak, /hero-title-logo/, 'hero logo elemanı olmalı');
  assert.match(kaynak, /getBestBackdrop/, 'hero TMDB logosunu fanart servisten almalı');
  assert.match(kaynak, /hero-titleblock--logo/, 'logo gelince yazı gizlenmeli');
});

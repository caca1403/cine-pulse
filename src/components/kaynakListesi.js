/* ==========================================================================
   CinePulse Studio — detay sayfası kaynak listesi
   Kaynaklar oynatıcının içinden çıkarıldı (Stremio düzeni): tam sayfa kart
   listesi, üstte eklenti sekmeleri, altında kalite çipleri. Kart tıklanınca
   oynatıcı hazır havuz + seçilen kaynakla açılır; detay sayfası oynatıcı
   AÇMAZ. Tarama YALNIZ sekme ilk açıldığında başlar: detay sayfası açılışı
   hiçbir ağır tarama beklemez (55 çekirdek × 75 sn bütçe).
   ========================================================================== */

import { getStreamingServersProgressive } from '../services/kaynak/providerAggregator.js';
import { eklentilerdeAra, eklentiTabani } from '../services/dogrudan/eklentiServisi.js';
import { satiriDinle } from '../services/dogrudan/dublajKestirme.js';
import { anahtarOlustur, satirKimligi, onbellekten, onbellekYaz, onbellekDinle } from '../services/kaynak/kaynakOnbellek.js';
import { renderIcons } from '../services/kabuk/icons.js';
import '../styles/kaynak-listesi.css';

function kacis(deger) {
  return String(deger == null ? '' : deger)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Kalite rozeti: kaynağın kendi alanı; yoksa adlardan okunur. 'auto' gizlenir. */
function kaliteBul(kaynak) {
  const ham = String(kaynak.kalite || kaynak.quality || '').trim();
  if (ham && ham.toLowerCase() !== 'auto') return ham.toUpperCase();
  const metin = `${kaynak.displayName || ''} ${kaynak.name || ''} ${kaynak.baslik || ''}`;
  const es = metin.match(/\b(2160p|4k|1080p|720p|480p)\b/i);
  return es ? es[1].toUpperCase() : '';
}

/** Ülke kodunu regional-indicator bayrağına çevirir (🇹🇷 ↔ 'tr' — API verisi
 *  birebir aynı kod noktalarıyla yeniden üretilir; kopya görsel yok). */
function bayrakEmoji(kod) {
  return String(kod).toUpperCase().replace(/./g, harf => String.fromCodePoint(127397 + harf.charCodeAt(0)));
}

/** Dil bayrakları: eklenti satırı `diller`, sağlayıcı satırı trSes/trAltyazi.
 *  Madde 5 (kullanıcı 2026-10-28): iki harfli ülke kodları (bayrak çiftlerinden
 *  gelir) etikette BİREBİR bayrak emoji olarak gösterilir; sıra diller dizisinin
 *  (başlıktaki) sırasıdır. */
function dilEtiketleri(kaynak) {
  const diller = Array.isArray(kaynak.diller) ? kaynak.diller : [];
  const etiketler = [];
  const trEtiketi = kaynak.trSes ? '🇹🇷 Dublaj' : '🇹🇷 Türkçe';
  for (const dil of diller) {
    if (dil === 'tr') { if (!etiketler.includes(trEtiketi)) etiketler.push(trEtiketi); }
    // TR ses varsa "Dual" ayrıca yazılmaz — aynı bilgi iki kez görünmesin
    // (kullanıcı 2026-10-29: "🇹🇷 Dublaj Dual" tekrarı).
    else if (dil === 'dual') { if (!kaynak.trSes && !etiketler.includes('Dual')) etiketler.push('Dual'); }
    else if (dil === 'altyazi') etiketler.push('TR Altyazı');
    else if (/^[a-z]{2}$/.test(dil)) etiketler.push(bayrakEmoji(dil));
  }
  // Sağlayıcı satırları: diller dizisi yok, ipucu bayraklarda.
  if (!diller.includes('tr') && kaynak.trSes) etiketler.push(trEtiketi);
  if (!diller.includes('dual') && kaynak.isDual && !kaynak.trSes) etiketler.push('Dual');
  if (!diller.includes('altyazi') && kaynak.trAltyazi) etiketler.push('TR Altyazı');
  // ORİJİNAL (kullanıcı 2026-10-29): yalnız akışın Kendisi doğruladıysa
  // (dublajKestirme dilDurumu='orijinal' — master okundu, TR izlek yok).
  // ÇELİŞKİ YASAĞI: satırda TR/Altyazı/Dual rozeti varsa ORİJİNAL basılmaz —
  // "TR Altyazı + ORİJİNAL" aynı satırda görünüyordu (kullanıcı şikâyeti).
  const trRozetVar = etiketler.some(e => e.includes('🇹🇷') || e.includes('TR') || e === 'Dual');
  if (kaynak.dilDurumu === 'orijinal' && !kaynak.trSes && !kaynak.trAltyazi && !trRozetVar) etiketler.push('ORİJİNAL');
  return [...new Set(etiketler)];
}

/** Rozet rengi: dublaj / altyazı / orijinal ayrı tasarım — HER kaynakta aynı
 *  (kullanıcı 2026-10-29). Metne göre sınıf; bilinmeyen dil bayrakta nötr. */
function rozetSinifi(dil) {
  // Türkçe büyük İ/I küçültmede ASCII'ye dönmez ('ORİJİNAL'.includes('orijinal')
  // false); karşılaştırma tr yereline göre yapılır yoksa rozet sınıfsız kalıyordu.
  const d = String(dil || '').toLocaleLowerCase('tr');
  if (d.includes('🇹🇷') || d === 'dual') return 'kaynak-rozet--dil kaynak-rozet--dublaj';
  if (d.includes('altyaz')) return 'kaynak-rozet--dil kaynak-rozet--altyazi';
  if (d.includes('orijinal')) return 'kaynak-rozet--dil kaynak-rozet--orijinal';
  return 'kaynak-rozet--dil';
}

/** Tek kaynağı kart satırına çevirir. Alan adları eklenti ve sağlayıcı
 *  satırlarında farklı; ikisi de burada tek biçime iner. */
function satirYap(kaynak, tip) {
  const eklenti = tip === 'eklenti';
  // Eklenti satırları KENDİ eklenti adıyla gruplanır (kullanıcı 2026-10-29:
  // "birden fazla eklenti olursa her biri kendi başlığıyla gözüksün") —
  // satirDonustur source'a jenerik 'Eklenti' yazıyor, gerçek ad eklentiAdi'nde.
  const saglayiciAdi = String((eklenti ? kaynak.eklentiAdi : kaynak.source) || kaynak.source || kaynak.eklentiAdi) || 'Sağlayıcı';
  // Tüm kendi çekirdeklerimiz tek "CinePulse" sekmeli grup altında toplanır
  // (Torrentio eklenti satırlarının tek başlık altında durmasıyla aynı düzen);
  // kahraman/çekirdek adı dosya satırına eklenir, kimlik kaybolmasın.
  const grup = eklenti ? saglayiciAdi : 'CinePulse';
  const dosyaHam = (eklenti ? kaynak.baslik : `${saglayiciAdi} · ${kaynak.title || kaynak.displayName || 'Kaynak'}`);
  // KÖKEN ETİKETİ ROZETE TAŞINIR (kullanıcı 2026-10-29: "Türkçe altyazı ve
  // orijinal etiketi de özel tasarımda, hepsine yap"): satır adının sonundaki
  // "· Orijinal / · Altyazılı / · Dublaj" metni düz yazı olarak kalıyordu;
  // artık adı kirletmez, renkli rozet olur (dosya adı yalnız kaynak adı).
  let dosya = dosyaHam;
  const kokunEtiketleri = [];
  // Etiket adın ORTASINDA da olabilir ("Star-Lord · Altyazı 1080p") — eskiden
  // yalnız dizgi SONUNDA aranıyordu ve Flash/Star-Lord satırlarında eski düz
  // "Altyazı" metni kalıyordu (kullanıcı 2026-10-29). Artık ayrı kelime olarak
  // her yerde yakalanır ve addan ÇIKARILIR.
  // NOT: \b kullanılmaz — JS'te \b ASCII tabanlıdır ve "Altyazılı"nın sonundaki
  // 'ı' kelime karakteri sayılmadığı için eşleşme kaçıyordu (Flash/Star-Lord
  // satırlarının eski görünmesinin nedeni buydu). Sınır kontrolü açık lookahead.
  const KOKEN = '(Dublaj\\s*\\/\\s*Altyaz[ıi]l?[ıi]?|T[üu]rk[çc]e Dublaj|Dublaj|Altyaz[ıi]l?[ıi]?|Orijinal)(?=$|[\\s·|\\/,.)])';
  const kokunEs = dosya.match(new RegExp('\\s*[·|]\\s*' + KOKEN, 'i'))
    || dosya.match(new RegExp(KOKEN, 'i'));
  if (kokunEs) {
    const ham = kokunEs[1].toLocaleLowerCase('tr');
    if (ham.includes('dublaj')) kokunEtiketleri.push('🇹🇷 Dublaj');
    if (ham.includes('altyaz')) kokunEtiketleri.push('Altyazı');
    if (ham.includes('orijinal')) kokunEtiketleri.push('ORİJİNAL');
    dosya = (dosya.slice(0, kokunEs.index) + ' ' + dosya.slice(kokunEs.index + kokunEs[0].length))
      .replace(/\s*[·|]\s*(?=\s|$)/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }
  const metaParcalari = [];
  const seeder = Number(kaynak.seeders) || 0;
  if (seeder > 0) metaParcalari.push(`👤 ${seeder}`);
  if (kaynak.boyut) metaParcalari.push(`💾 ${kaynak.boyut}`);
  if (kaynak.saglayici) metaParcalari.push(`⚙ ${kaynak.saglayici}`);
  // Doğrulanmış ses dokumu (dublajKestirme): "🎧 en, tr, ru" — NE olduğu burada.
  // YERLİ tek zengin satırda ve zaten BAYRAK çipleri basılan satırlarda ham dil
  // listesi GÖSTERİLMEZ (kullanıcı 2026-10-29: bayraklı tasarım her kaynakta;
  // "hi, te, en, ta" metin duvarı gürültüydü). Bayrak yoksa metin bilgi kalır.
  const bayrakVarMi = Array.isArray(kaynak.diller) && kaynak.diller.some(d => /^[a-z]{2}$/.test(d));
  if (kaynak.sesDokumu && !kaynak.yerliTek && !bayrakVarMi) metaParcalari.push(`🎧 ${kaynak.sesDokumu}`);
  // DUBLAJ BAYRAĞI (kullanıcı 2026-10-29: "dublaj içeriği olanları her zaman
  // en üstte sırala"): 🇹🇷 Dublaj / Dual etiketi taşıyan satır listte öne alır.
  const diller = [...kokunEtiketleri, ...dilEtiketleri(kaynak)];
  // DUBLAJ = 🇹🇷 ses var. Üç kaynak birden sayılır: rozet (trSes), akıştan
  // doğrulanan dilDurumu ('dublaj') ve isDual. Yalnız rozete bakmak, geç
  // doğrulanan satırları sıralamada geride bırakıyordu.
  const dublajMi = diller.some(d => d.startsWith('🇹🇷') || d === 'Dual')
    || kaynak.dilDurumu === 'dublaj'
    || kaynak.isDual === true;
  return {
    grup: String(grup),
    dosya: String(dosya),
    kalite: kaliteBul(kaynak),
    meta: metaParcalari.join(' · '),
    diller,
    dublajMi,
    kaynakTipi: kaynak.kaynakTipi || '',
    ham: kaynak
  };
}

export function kaynakListesiOlustur({
  kok,
  tur = 'movie',
  tmdbId = null,
  imdbId = '',
  sezon = 1,
  bolum = 1,
  baslik = '',
  orijinalBaslik = '',
  onKaynakSec = null
} = {}) {
  if (!kok) return { baslat() {}, bolumAyarla() {}, kaynaklar() { return []; }, yokEt() {} };

  const durum = {
    satirlar: [],
    sekme: 'hepsi',
    kalite: 'hepsi',
    baslatildi: false,
    araniyor: false,
    saglayiciBitti: false,
    eklentiBitti: false,
    sezon: Number(sezon) || 1,
    bolum: Number(bolum) || 1,
    nesil: 0
  };

  // Eklenti kaldırılınca (EklentiYonetimModal → ekKaynakDusur) bu ekrandaki o
  // eklentinin satırları ANINDA düşer — önbellek zaten süzülmüştür (kullanıcı
  // 2026-10-29: "eklenti silindiğinde o önbellek silinmeli direkt").
  const dinleBirak = onbellekDinle((ekTaban) => {
    const once = durum.satirlar.length;
    durum.satirlar = durum.satirlar.filter(r => r.ekKaynak !== ekTaban);
    if (durum.satirlar.length !== once) ciz();
  });

  kok.innerHTML = `
    <div class="kaynak-arac"></div>
    <div class="kaynak-durum" role="status" aria-live="polite"></div>
    <div class="kaynak-liste" role="list" aria-label="Oynatma kaynakları"></div>
  `;
  const aracKok = kok.querySelector('.kaynak-arac');
  const durumKok = kok.querySelector('.kaynak-durum');
  const listeKok = kok.querySelector('.kaynak-liste');

  aracKok.addEventListener('click', (olay) => {
    const sekme = olay.target.closest('[data-sekme]');
    if (sekme) { durum.sekme = sekme.dataset.sekme; ciz(); return; }
    const cip = olay.target.closest('[data-kalite]');
    if (cip) { durum.kalite = cip.dataset.kalite; ciz(); }
  });

  // Kartın tamamı BUTTON: Enter/Space klavyeden zaten çalışır.
  listeKok.addEventListener('click', (olay) => {
    const kart = olay.target.closest('.kaynak-kart');
    if (!kart) return;
    const satir = durum.satirlar[Number(kart.dataset.index)];
    if (satir && typeof onKaynakSec === 'function') onKaynakSec(satir.ham);
  });

  function gruplar() {
    const sayac = new Map();
    for (const s of durum.satirlar) sayac.set(s.grup, (sayac.get(s.grup) || 0) + 1);
    return [...sayac.entries()];
  }

  function kaliteler() {
    return [...new Set(durum.satirlar.map(s => s.kalite).filter(Boolean))];
  }

  function suzulmus() {
    const filtre = durum.satirlar.filter(s =>
      (durum.sekme === 'hepsi' || s.grup === durum.sekme)
      && (durum.kalite === 'hepsi' || s.kalite === durum.kalite));
    // DUBLAJ ÖNCE (kullanıcı 2026-10-29): 🇹🇷/Dual rozetli satırlar listenin
    // en üstünde; aralarında GELİŞ SIRASI bozulmaz (sort stabil — V8/SC).
    // KULLANICI KARARI (2026-10-29): satır SAYISI KISILMAZ. Buradaki eski
    // "görsel mükerrer" filtresi aynı sağlayıcının FARKLI yayınlarını (aynı
    // ad+kalite+dil imzası) tek satıra indiriyordu; 23 kaynak 15'e düştü.
    // Tekilleştirme zaten `adres` (satırKimligi) düzeyinde yapılıyor.
    return filtre.sort((a, b) => (a.dublajMi ? 0 : 1) - (b.dublajMi ? 0 : 1));
  }

  function cizArac() {
    const sekmeler = gruplar();
    if (durum.sekme !== 'hepsi' && !sekmeler.some(([ad]) => ad === durum.sekme)) durum.sekme = 'hepsi';
    const secenekler = [['hepsi', `Tümü (${durum.satirlar.length})`], ...sekmeler.map(([ad, sayi]) => [ad, `${ad} (${sayi})`])];
    const kaliteListesi = kaliteler();
    if (durum.kalite !== 'hepsi' && !kaliteListesi.includes(durum.kalite)) durum.kalite = 'hepsi';
    aracKok.innerHTML = `
      <div class="kaynak-sekmeler" role="group" aria-label="Kaynak grupları">
        ${secenekler.map(([anahtar, etiket]) => `
          <button type="button" class="kaynak-sekme ${durum.sekme === anahtar ? 'is-active' : ''}"
            aria-pressed="${durum.sekme === anahtar}" data-sekme="${kacis(anahtar)}">${kacis(etiket)}</button>
        `).join('')}
      </div>
      ${kaliteListesi.length > 1 ? `
        <div class="kaynak-kalite-cipleri" role="group" aria-label="Kalite filtresi">
          <button type="button" class="kaynak-cip ${durum.kalite === 'hepsi' ? 'is-active' : ''}"
            aria-pressed="${durum.kalite === 'hepsi'}" data-kalite="hepsi">Hepsi</button>
          ${kaliteListesi.map(kalite => `
            <button type="button" class="kaynak-cip ${durum.kalite === kalite ? 'is-active' : ''}"
              aria-pressed="${durum.kalite === kalite}" data-kalite="${kacis(kalite)}">${kacis(kalite)}</button>
          `).join('')}
        </div>
      ` : ''}
    `;
  }

  function cizDurum(satirSayisi) {
    if (durum.araniyor && durum.satirlar.length === 0) {
      durumKok.innerHTML = `<span class="kaynak-tarama"><i data-lucide="loader-2" class="spin-loader"></i> Kaynaklar taranıyor…</span>`;
      return;
    }
    if (durum.araniyor) {
      durumKok.innerHTML = `<span class="kaynak-tarama"><i data-lucide="loader-2" class="spin-loader"></i> Taranıyor… ${satirSayisi} kaynak listelendi</span>`;
      return;
    }
    if (satirSayisi === 0) {
      const filtreli = durum.satirlar.length > 0;
      durumKok.innerHTML = `
        <div class="kaynak-bos">
          <i data-lucide="server-off"></i>
          <p>${filtreli ? 'Bu filtreye uyan kaynak yok.' : 'Bu içerik için oynatılabilir kaynak bulunamadı.'}</p>
        </div>`;
      return;
    }
    durumKok.innerHTML = `<span class="kaynak-sayi">${satirSayisi} kaynak</span>`;
  }

  function ciz() {
    cizArac();
    const liste = suzulmus();
    cizDurum(liste.length);
    listeKok.innerHTML = liste.map(satir => {
      const index = durum.satirlar.indexOf(satir);
      // Madde 5: dil rozetleri bölünmez (eskiden ilki başlıkta, kalanı alttaydı);
      // TÜMÜ tek satırda, CSS'te flex-wrap ile sarlar (kaynak-tarama.css).
      const kaliteRozet = satir.kalite ? `<span class="kaynak-rozet kaynak-rozet--kalite">${kacis(satir.kalite)}</span>` : '';
      // Aynı bayraklı tasarım HER kaynakta: çok dilli satırda ilk 8 bayrak +
      // "+N" (kullanıcı 2026-10-29 — dizi taşmasın, bilgi kaybolmasın).
      const dillerGorunen = satir.diller.slice(0, 8);
      const dilRozetleri = dillerGorunen
        .map(dil => `<span class="kaynak-rozet ${rozetSinifi(dil)}">${kacis(dil)}</span>`).join('')
        + (satir.diller.length > 8
          ? `<span class="kaynak-rozet kaynak-rozet--dil kaynak-rozet--dil-fazla">+${satir.diller.length - 8}</span>`
          : '');
      return `
        <div class="kaynak-satir" role="listitem">
          <button type="button" class="kaynak-kart" data-index="${index}"
            aria-label="${kacis(`${satir.grup} ${satir.kalite} ${satir.diller.join(' ')} ${satir.dosya}`)} — bu kaynakla oynat">
            <span class="kaynak-kart-baslik">
              <span class="kaynak-kart-ad">${kacis(satir.grup)}</span>
              ${kaliteRozet}
            </span>
            <span class="kaynak-kart-dosya">${kacis(satir.dosya)}${satir.kaynakTipi ? ` · ${kacis(satir.kaynakTipi)}` : ''}</span>
            ${satir.meta ? `<span class="kaynak-kart-meta">${kacis(satir.meta)}</span>` : ''}
            ${dilRozetleri ? `<span class="kaynak-kart-diller">${dilRozetleri}</span>` : ''}
          </button>
        </div>
      `;
    }).join('');
    renderIcons(kok);
  }

  function taramaAnahtari(s, b) {
    return anahtarOlustur({ tur, tmdbId, baslik, sezon: s, bolum: b });
  }

  function tara() {
    const s = durum.sezon;
    const b = durum.bolum;
    const anahtar = taramaAnahtari(s, b);
    const nesil = ++durum.nesil;
    durum.satirlar = [];
    durum.sekme = 'hepsi';
    durum.kalite = 'hepsi';
    durum.araniyor = true;
    durum.saglayiciBitti = false;
    durum.eklentiBitti = false;

    // Oturum ömürlü ortak önbellek (kaynakOnbellek; kullanıcı 2026-10-29):
    // tohumla → tarama her durumda devam eder → birleşim yazımı. Liste SADECE
    // BÜYÜR (12 cache + 13 tarama = 13); kimlik dedup'u yığılmayı engeller —
    // önbellekten gelen satır taramada yeniden eklenmez.
    const onbellekli = onbellekten(anahtar);
    if (onbellekli && Array.isArray(onbellekli.girisler) && onbellekli.girisler.length) {
      durum.satirlar = onbellekli.girisler
        .filter(g => g && g.ham)
        .map(g => ({ ...satirYap(g.ham, g.tip), adres: g.kimlik || '', ekKaynak: g.ekKaynak || '', kategori: g.kategori || '', tip: g.tip }));
    }

    const kaydetVeCiz = () => {
      if (nesil !== durum.nesil) return;
      ciz();
      onbellekYaz(anahtar, durum.satirlar.map(r => ({
        ham: r.ham, tip: r.tip, kimlik: r.adres, ekKaynak: r.ekKaynak || '', kategori: r.kategori || '',
      })), !durum.araniyor);
    };

    const satirEkle = (kaynak, tip, ek = null, kategori = '') => {
      if (nesil !== durum.nesil || !kaynak) return;
      const satir = satirYap(kaynak, tip);
      // Kimlik her satırda dolu: KARARLI satır kimliği (imzalı URL'nin sorgu
      // parçası soyulur — dönen `?tok=` aynı kaynağı ikinci satır yapmaz;
      // kullanıcı 2026-10-29) ya da deterministik imza — adresi boş kaynaklar
      // bile önbellek+tarama arasında ASLA yığılmaz.
      const adres = satirKimligi(kaynak) || `imzasiz:${tip}:${satir.grup}|${satir.dosya}`;
      if (durum.satirlar.some(x => x.adres === adres)) return;
      durum.satirlar.push({ ...satir, adres, ekKaynak: ek?.url ? eklentiTabani(ek.url) : '', kategori, tip });
      kaydetVeCiz();
      // DİL DOĞRULAMA (kullanıcı 2026-10-29): satırın master playlist'i
      // arka planda dinlenir; 🇹🇷 Dublaj / TR Altyazı / ORİJİNAL rozetleri
      // yalnız AKIŞIN KENDİ kanıtıyla son halini alır (uydurma etiket yok).
      // DUBLAJ AÇLIĞI (kullanıcı 2026-10-29: "kaynaklarda dublaj azlığı var"):
      // artık HER satır öncelikli kuyruğa girer — eskiden yalnız eklenti
      // satırları öncelikliydi, çekirdek satırlar kuyruğun sonunda 9 sn'lik
      // zaman aşımlarıyla bekliyor ve TR sesi olan satır çoğu zaman hiç
      // doğrulanmıyordu. Öncelikli kuyruk = TR işaretli satırlar üste çıkar.
      satiriDinle(kaynak, { oncelik: true }).then((dokum) => {
        if (!dokum || nesil !== durum.nesil) return;
        const i = durum.satirlar.findIndex(x => x.adres === adres);
        if (i < 0) return;
        const e = durum.satirlar[i];
        durum.satirlar[i] = { ...satirYap(kaynak, tip), adres, ekKaynak: e.ekKaynak, kategori: e.kategori, tip };
        ciz();
      }).catch(() => { /* doğrulanamayan satır etiketsiz kalır — doğru bu */ });
    };

    // Sağlayıcı havuzu — kademeli: satırlar geldikçe listeye eklenir.
    // imdbId BİLİNÇLİ OLARAK VERİLMEZ (/imdbId değişkeni yalnız eklenti
    // satırlarında kullanılır). vekil.js kayıtta imdb numarası varken çekirdeği
    // ÖNCE IMDb kimliğiyle dener (kimlik sırası tt → sayısal); yavaş IMDb adımı
    // kaydın tavanını yiyince sayısal TMDB yedeğine süre kalmıyor ve çekirdek
    // boş dönüyordu (cihaz 2026-10-27: liste 4 çekirdek, oynatıcı ~28).
    // Oynatıcının keşfi de tarama ANINDA imdb'siz başlar (PlayerModal:
    // currentImdbId henüz çözülmemiştir) — aynı sonucu almak için burada da
    // verilmez. Eklenti satırları imdb ile aranır (aşağıdaki çağrı).
    getStreamingServersProgressive({
      type: tur,
      tmdbId,
      title: baslik,
      seriesTitle: baslik,
      originalTitle: orijinalBaslik,
      season: s,
      episode: b,
      onUpdate: ({ dubbed = [], subtitled = [] } = {}) => {
        if (nesil !== durum.nesil) return;
        dubbed.forEach(kaynak => satirEkle(kaynak, 'saglayici', null, 'dubbed'));
        subtitled.forEach(kaynak => satirEkle(kaynak, 'saglayici', null, 'subtitled'));
      }
    }).catch(() => null).finally(() => {
      if (nesil !== durum.nesil) return;
      durum.saglayiciBitti = true;
      durum.araniyor = !durum.eklentiBitti;
      kaydetVeCiz();
    });

    // Eklenti satırları — kendi adlarıyla sekmeye düşer. baslik: CloudStream
    // csAra sorgusu başlıktan kurulur (additive param, kullanıcı 2026-10-29).
    eklentilerdeAra(
      { tur: tur === 'movie' ? 'movie' : 'series', imdbId, tmdbId, sezon: s, bolum: b, baslik },
      (satir, ek) => satirEkle(satir, 'eklenti', ek)
    ).catch(() => 0).finally(() => {
      if (nesil !== durum.nesil) return;
      durum.eklentiBitti = true;
      durum.araniyor = !durum.saglayiciBitti;
      kaydetVeCiz();
    });
  }

  return {
    baslat() {
      if (durum.baslatildi) return;
      durum.baslatildi = true;
      tara();
    },
    /** Oynatıcıya verilecek hazır havuz: o an listede olan tüm kaynaklar
     *  (sekmelerden bağımsız, filtresiz). */
    kaynaklar() {
      return durum.satirlar.map(satir => satir.ham);
    },
    bolumAyarla(yeniSezon, yeniBolum) {
      const s = Number(yeniSezon) || 1;
      const b = Number(yeniBolum) || 1;
      if (durum.baslatildi && s === durum.sezon && b === durum.bolum) return;
      durum.sezon = s;
      durum.bolum = b;
      durum.baslatildi = true;
      tara();
    },
    yokEt() {
      durum.nesil++;
      durum.satirlar = [];
      dinleBirak();
      kok.innerHTML = '';
    }
  };
}

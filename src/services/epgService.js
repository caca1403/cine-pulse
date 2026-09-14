/* ==========================================================================
   CinePulse Live TV - Electronic Program Guide (EPG) Engine
   Provides realistic, dynamic real-time broadcast schedules,
   calculating currently airing show, time range, and progress percentage.
   ========================================================================== */

// Curated typical schedules for Turkish broadcast channels
const CHANNEL_SCHEDULES = {
  // Ulusal Kanallar
  'ch_trt1': [
    { start: '06:00', end: '09:00', title: 'Sabahın Bereketi & Haber' },
    { start: '09:00', end: '10:30', title: 'Alişan ile Hayata Gülümse' },
    { start: '10:30', end: '13:00', title: 'Gönül Dağı (Tekrar)' },
    { start: '13:00', end: '14:00', title: 'TRT 1 Gün Ortası' },
    { start: '14:00', end: '17:45', title: 'Seksenler' },
    { start: '17:45', end: '19:00', title: 'Lingo Türkiye' },
    { start: '19:00', end: '20:00', title: 'TRT 1 Ana Haber' },
    { start: '20:00', end: '23:45', title: 'Kudüs Fatihi Selahaddin Eyyubi' },
    { start: '23:45', end: '02:00', title: 'Teşkilat' },
    { start: '02:00', end: '06:00', title: 'Gece Kuşağı' }
  ],
  'ch_atv': [
    { start: '07:00', end: '10:00', title: 'Kahvaltı Haberleri' },
    { start: '10:00', end: '13:00', title: 'Müge Anlı ile Tatlı Sert' },
    { start: '13:00', end: '14:00', title: 'Gün Ortası' },
    { start: '14:00', end: '16:00', title: 'Mutfak Bahane' },
    { start: '16:00', end: '18:45', title: 'Esra Erol\'da' },
    { start: '18:45', end: '20:00', title: 'ATV Ana Haber' },
    { start: '20:00', end: '23:45', title: 'Kuruluş Osman' },
    { start: '23:45', end: '02:00', title: 'Kim Milyoner Olmak İster?' },
    { start: '02:00', end: '07:00', title: 'Kardeşlerim (Tekrar)' }
  ],
  'ch_showtv': [
    { start: '06:00', end: '08:00', title: 'Kendine İyi Bak' },
    { start: '08:00', end: '10:00', title: 'Bu Sabah' },
    { start: '10:00', end: '12:30', title: 'Gelin Evi' },
    { start: '12:30', end: '15:00', title: 'Aslı Hünel ile Gelin Evi' },
    { start: '15:00', end: '18:45', title: 'Didem Arslan Yılmaz\'la Vazgeçme' },
    { start: '18:45', end: '20:00', title: 'Show Ana Haber' },
    { start: '20:00', end: '23:30', title: 'Kızılcık Şerbeti' },
    { start: '23:30', end: '02:00', title: 'Bahar (Tekrar)' },
    { start: '02:00', end: '06:00', title: 'Güldür Güldür Show' }
  ],
  'ch_nowtv': [
    { start: '07:30', end: '10:30', title: 'İlker Karagöz ile Çalar Saat' },
    { start: '10:30', end: '12:00', title: 'Çağla ile Yeni Bir Gün' },
    { start: '12:00', end: '13:30', title: 'Memet Özer ile Mutfakta' },
    { start: '13:30', end: '16:15', title: 'En Hamarat Benim' },
    { start: '16:15', end: '19:00', title: 'Kızıl Goncalar (Özet)' },
    { start: '19:00', end: '20:00', title: 'Selçuk Tepeli ile NOW Ana Haber' },
    { start: '20:00', end: '23:30', title: 'Kızıl Goncalar' },
    { start: '23:30', end: '02:00', title: 'Kirli Sepeti' },
    { start: '02:00', end: '07:30', title: 'Yasak Elma (Tekrar)' }
  ],
  'ch_startv': [
    { start: '07:00', end: '09:30', title: 'Güne Başlarken' },
    { start: '09:30', end: '13:00', title: 'Sabahın Sultanı Seda Sayan' },
    { start: '13:00', end: '16:00', title: 'Zahide Yetiş ile Yeniden Başlasak' },
    { start: '16:00', end: '19:00', title: 'Söz (Tekrar)' },
    { start: '19:00', end: '20:00', title: 'Star Ana Haber' },
    { start: '20:00', end: '23:45', title: 'Yalı Çapkını' },
    { start: '23:45', end: '02:30', title: 'Sakla Beni' },
    { start: '02:30', end: '07:00', title: 'Dizi Kuşağı' }
  ],
  'ch_kanald': [
    { start: '07:00', end: '09:00', title: 'Afili Aşk' },
    { start: '09:00', end: '11:00', title: 'Neler Oluyor Hayatta?' },
    { start: '11:00', end: '13:00', title: 'Camdaki Kız' },
    { start: '13:00', end: '16:00', title: 'Gelinim Mutfakta' },
    { start: '16:00', end: '19:00', title: 'Arka Sokaklar (Özel)' },
    { start: '19:00', end: '20:00', title: 'Kanal D Ana Haber' },
    { start: '20:00', end: '23:45', title: 'İnci Taneleri' },
    { start: '23:45', end: '02:00', title: 'Yargı' },
    { start: '02:00', end: '07:00', title: 'Poyraz Karayel' }
  ],
  'ch_tv8': [
    { start: '06:00', end: '08:00', title: 'Tuzak' },
    { start: '08:00', end: '10:00', title: 'Gel Konuşalım' },
    { start: '10:00', end: '12:30', title: 'Survivor Panorama' },
    { start: '12:30', end: '16:00', title: 'Zuhal Topal\'la Yemekteyiz' },
    { start: '16:00', end: '20:00', title: 'MasterChef Türkiye (Özet)' },
    { start: '20:00', end: '23:45', title: 'MasterChef Türkiye / Survivor All Star' },
    { start: '23:45', end: '02:00', title: 'Survivor Ekstra' },
    { start: '02:00', end: '06:00', title: 'Yemekteyiz Gece Kuşağı' }
  ],
  'ch_cnbce': [
    { start: '07:00', end: '10:00', title: 'Sabah Piyasaları & Finans' },
    { start: '10:00', end: '14:00', title: 'Piyasa Ekranı & Global Trendler' },
    { start: '14:00', end: '18:00', title: 'Kapanışa Doğru' },
    { start: '18:00', end: '20:00', title: 'The Simpsons' },
    { start: '20:00', end: '21:00', title: 'Mad Men' },
    { start: '21:00', end: '23:00', title: 'Game of Thrones Kuşağı' },
    { start: '23:00', end: '01:00', title: 'Late Night Show with Jimmy Fallon' },
    { start: '01:00', end: '07:00', title: 'Gece Finans & Belgesel' }
  ]
};

// Generic genre schedules for channels without an exact timetable
const GENRE_SCHEDULES = {
  sports: [
    { start: '06:00', end: '09:00', title: 'Spor Bülteni & Günün Manşetleri' },
    { start: '09:00', end: '12:00', title: 'Maç Özetleri & Goller Kuşağı' },
    { start: '12:00', end: '14:00', title: 'Öğle Sporu & Transfer Raporu' },
    { start: '14:00', end: '17:00', title: 'Uluslararası Ligler & Analiz' },
    { start: '17:00', end: '19:00', title: 'Maç Önü & Stüdyo Analizi' },
    { start: '19:00', end: '21:30', title: 'Canlı Karşılaşma / Canlı Yayın' },
    { start: '21:30', end: '23:45', title: 'Dev Maç Özel Yayını' },
    { start: '23:45', end: '02:00', title: 'Son Sayfa & Tartışma Programı' },
    { start: '02:00', end: '06:00', title: 'Gecenin Maçları (Tekrar)' }
  ],
  news: [
    { start: '06:00', end: '09:00', title: 'Güne Başlarken & Sabah Raporu' },
    { start: '09:00', end: '12:00', title: 'Ekonomi ve Politika Gündemi' },
    { start: '12:00', end: '14:00', title: 'Gün Ortası Bülteni' },
    { start: '14:00', end: '17:00', title: 'Sıcak Gelişmeler & Canlı Bağlantılar' },
    { start: '17:00', end: '19:00', title: 'Akşam Bülteni & Manşetler' },
    { start: '19:00', end: '20:30', title: 'Ana Haber Bülteni' },
    { start: '20:30', end: '23:30', title: 'Türkiye\'nin Nabzı & Açık Oturum' },
    { start: '23:30', end: '01:30', title: 'Gece Raporu & Dünya Basını' },
    { start: '01:30', end: '06:00', title: 'Gece Bülteni' }
  ],
  doc: [
    { start: '06:00', end: '09:00', title: 'Vahşi Yaşamın İzinde' },
    { start: '09:00', end: '12:00', title: 'Evrenin Gizemleri ve Uzay' },
    { start: '12:00', end: '15:00', title: 'Mega Yapılar & Mühendislik Harikaları' },
    { start: '15:00', end: '18:00', title: 'Tarihin Bilinmeyen Sayfaları' },
    { start: '18:00', end: '20:00', title: 'Okyanusların Derinlikleri' },
    { start: '20:00', end: '22:00', title: 'Büyük Kediler: Hayatta Kalma Savaşı' },
    { start: '22:00', end: '00:30', title: 'Dünyanın En Gizemli Keşifleri' },
    { start: '00:30', end: '06:00', title: 'Gece Belgesel Kuşağı' }
  ],
  kids: [
    { start: '06:00', end: '09:00', title: 'Sabah Neşesi Çizgi Filmler' },
    { start: '09:00', end: '12:00', title: 'Eğlenceli Maceralar & Kahramanlar' },
    { start: '12:00', end: '15:00', title: 'Sevimli Dostlar & Bilim Zamanı' },
    { start: '15:00', end: '18:00', title: 'Süper Kahramanlar Kuşağı' },
    { start: '18:00', end: '20:30', title: 'Akşam Aile Sineması' },
    { start: '20:30', end: '22:30', title: 'Fantastik Çizgi Dizi' },
    { start: '22:30', end: '06:00', title: 'Gece Masalları' }
  ],
  music: [
    { start: '06:00', end: '10:00', title: 'Güne Enerjik Başla (Top 20 Pop)' },
    { start: '10:00', end: '14:00', title: 'Hit Müzik & Radyo Şarkıları' },
    { start: '14:00', end: '18:00', title: 'Trendler & En Çok Dinlenenler' },
    { start: '18:00', end: '21:00', title: 'Akşam Ritimleri & Klip Kuşağı' },
    { start: '21:00', end: '23:30', title: 'Canlı Akustik & Popüler Klipler' },
    { start: '23:30', end: '02:00', title: 'Gece Chill & Deep House' },
    { start: '02:00', end: '06:00', title: 'Kesintisiz Gece Müziği' }
  ],
  national: [
    { start: '06:00', end: '09:00', title: 'Sabah Programı & Magazin' },
    { start: '09:00', end: '12:00', title: 'Gündüz Kuşağı Programı' },
    { start: '12:00', end: '14:00', title: 'Gün Ortası & Yemek Programı' },
    { start: '14:00', end: '17:00', title: 'Popüler Dizi Tekrar Kuşağı' },
    { start: '17:00', end: '19:00', title: 'Yarışma Kuşağı' },
    { start: '19:00', end: '20:00', title: 'Akşam Ana Haber' },
    { start: '20:00', end: '23:30', title: 'Prime Time Sinema / Dizi' },
    { start: '23:30', end: '02:00', title: 'Gece Sineması' },
    { start: '02:00', end: '06:00', title: 'Gece Kuşağı' }
  ]
};

function parseTimeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Get current EPG program for a given channel at current time
 * @param {Object} channel
 * @returns {Object} EPG item with title, timeRange, progress, remainingMin, nextTitle
 */
export function getChannelEpg(channel) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let schedule = CHANNEL_SCHEDULES[channel.id];
  if (!schedule) {
    schedule = GENRE_SCHEDULES[channel.category] || GENRE_SCHEDULES.national;
  }

  // Find slot that includes currentMinutes
  let activeSlot = null;
  let nextSlot = null;

  for (let i = 0; i < schedule.length; i++) {
    const slot = schedule[i];
    const startMin = parseTimeToMinutes(slot.start);
    let endMin = parseTimeToMinutes(slot.end);

    // Handle midnight crossing
    if (endMin <= startMin) {
      endMin += 24 * 60;
    }

    let compareMin = currentMinutes;
    if (startMin > endMin - 24 * 60 && currentMinutes < startMin && currentMinutes < (endMin % (24 * 60))) {
      compareMin += 24 * 60;
    }

    if (compareMin >= startMin && compareMin < endMin) {
      activeSlot = slot;
      nextSlot = schedule[(i + 1) % schedule.length];
      
      const totalDuration = endMin - startMin;
      const elapsed = compareMin - startMin;
      const progress = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
      const remainingMin = Math.max(1, endMin - compareMin);

      return {
        title: slot.title,
        timeRange: `${slot.start} - ${slot.end}`,
        start: slot.start,
        end: slot.end,
        progress,
        remainingMin,
        nextTitle: nextSlot ? nextSlot.title : 'Sonraki Program'
      };
    }
  }

  // Fallback if not matched
  return {
    title: `${channel.name} Canlı Yayın`,
    timeRange: 'Canlı Akış',
    start: '00:00',
    end: '23:59',
    progress: 50,
    remainingMin: 30,
    nextTitle: 'Yayın Akışı Devam Ediyor'
  };
}

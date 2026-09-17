/* ==========================================================================
   CinePulse Live TV - Electronic Program Guide (EPG) Engine
   Real-Time Turkish Broadcast Schedule Service
   Fetches and calculates actual live TV programs, progress percentages,
   and upcoming shows with automated live updates.
   ========================================================================== */

const STORAGE_CACHE_KEY = 'cinepulse_epg_live_cache';
const CACHE_MAX_AGE_MS = 30 * 60 * 1000; // 30 minutes

// In-memory live schedule map: { [channelId]: [ { startTs, endTs, start, end, title } ] }
let liveSchedules = null;
let lastFetchTime = 0;
let isFetching = false;
let refreshTimer = null;

// Fallback typical schedules for channels without live XMLTV feed
const FALLBACK_CHANNEL_SCHEDULES = {
  'ch_cnbce': [
    { start: '07:00', end: '10:00', title: 'Sabah Piyasaları & Finans' },
    { start: '10:00', end: '14:00', title: 'Piyasa Ekranı & Global Trendler' },
    { start: '14:00', end: '18:00', title: 'Kapanışa Doğru' },
    { start: '18:00', end: '20:00', title: 'The Simpsons' },
    { start: '20:00', end: '21:00', title: 'Mad Men' },
    { start: '21:00', end: '23:00', title: 'Game of Thrones Kuşağı' },
    { start: '23:00', end: '01:00', title: 'Late Night Show' },
    { start: '01:00', end: '07:00', title: 'Gece Finans & Belgesel' }
  ],
  'tvr_ch_141': [
    { start: '08:00', end: '11:00', title: 'İtalya Serie A Goller' },
    { start: '11:00', end: '14:00', title: 'EuroLeague Özel Kuşağı' },
    { start: '14:00', end: '17:00', title: 'La Liga Günlüğü & Özetler' },
    { start: '17:00', end: '20:00', title: 'Maç Önü & Canlı Stüdyo' },
    { start: '20:00', end: '23:00', title: 'Canlı Futbol / Basketbol Karşılaşması' },
    { start: '23:00', end: '02:00', title: 'Günün Analizi & Tartışma' },
    { start: '02:00', end: '08:00', title: 'Premier Maç Tekrarları' }
  ],
  'tvr_ch_140': [
    { start: '08:00', end: '12:00', title: 'Formula 1 Özel Kuşağı' },
    { start: '12:00', end: '15:00', title: 'NBA Action & En İyi Hareketler' },
    { start: '15:00', end: '19:00', title: 'Uluslararası Voleybol Ligi' },
    { start: '19:00', end: '22:00', title: 'Canlı Basketbol / Tenis Karşılaşması' },
    { start: '22:00', end: '01:00', title: 'Motorsporları Kuşağı' },
    { start: '01:00', end: '08:00', title: 'Gecenin Tekrarları' }
  ]
};

// Generic genre schedules
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
    { start: '12:00', end: '15:00', title: 'Mega Yapılar & Mühendislik' },
    { start: '15:00', end: '18:00', title: 'Tarihin Bilinmeyen Sayfaları' },
    { start: '18:00', end: '20:00', title: 'Okyanusların Derinlikleri' },
    { start: '20:00', end: '22:00', title: 'Büyük Kediler: Hayatta Kalma' },
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
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Load cached schedules from localStorage for instant 0ms start
 */
function loadLocalCache() {
  try {
    const raw = localStorage.getItem(STORAGE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.channels && (Date.now() - (parsed.updatedAt || 0) < 12 * 3600 * 1000)) {
      return parsed.channels;
    }
  } catch (e) {
    console.warn('[EPG] Failed to read local storage cache:', e);
  }
  return null;
}

/**
 * Save fresh schedules to localStorage
 */
function saveLocalCache(channels) {
  try {
    localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify({
      updatedAt: Date.now(),
      channels
    }));
  } catch (e) {
    // quota exceeded or private mode
  }
}

/**
 * Fetch latest live EPG from API or static json file
 */
export async function fetchLiveEpg(force = false) {
  const now = Date.now();
  if (!force && liveSchedules && (now - lastFetchTime < CACHE_MAX_AGE_MS)) {
    return liveSchedules;
  }
  if (isFetching) return liveSchedules;

  isFetching = true;
  try {
    // 1. Try Vercel Serverless / Local Dev API: /api/epg
    let res = null;
    try {
      res = await fetch('/api/epg');
    } catch (netErr) {
      console.warn('[EPG] /api/epg fetch failed, falling back to static seed:', netErr);
    }

    // 2. Fallback to /epg-data.json
    if (!res || !res.ok) {
      res = await fetch('/epg-data.json');
    }

    if (res && res.ok) {
      const data = await res.json();
      if (data && data.channels && Object.keys(data.channels).length > 0) {
        liveSchedules = data.channels;
        lastFetchTime = now;
        saveLocalCache(data.channels);
        window.dispatchEvent(new CustomEvent('epg-updated', { detail: { count: Object.keys(data.channels).length } }));
        console.log(`[EPG] Live TV schedules loaded successfully for ${Object.keys(data.channels).length} channels.`);
      }
    }
  } catch (err) {
    console.error('[EPG] Error fetching live schedule:', err);
  } finally {
    isFetching = false;
  }

  return liveSchedules;
}

/**
 * Initialize EPG service: loads local cache immediately and fetches live data
 */
export function initEpgService() {
  if (!liveSchedules) {
    const cached = loadLocalCache();
    if (cached) {
      liveSchedules = cached;
    }
  }

  // Trigger async fetch in background
  fetchLiveEpg();

  // Keep one refresh timer even if the Live TV view is mounted repeatedly.
  if (refreshTimer === null) {
    refreshTimer = setInterval(() => {
      fetchLiveEpg(true);
    }, CACHE_MAX_AGE_MS);
  }
}

export function stopEpgService() {
  if (refreshTimer !== null) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

/**
 * Get current EPG program for a given channel at current time
 * @param {Object} channel
 * @returns {Object} EPG item with title, timeRange, progress, remainingMin, nextTitle
 */
export function getChannelEpg(channel) {
  if (!channel) {
    return {
      title: 'Canlı Yayın',
      timeRange: 'Canlı Akış',
      start: '00:00',
      end: '23:59',
      progress: 50,
      remainingMin: 30,
      nextTitle: 'Yayın Akışı'
    };
  }

  const nowMs = Date.now();

  // 1. Check Real-Time Live TV schedule (if loaded)
  if (liveSchedules && liveSchedules[channel.id] && liveSchedules[channel.id].length > 0) {
    const list = liveSchedules[channel.id];

    // Find current active program
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (nowMs >= item.startTs && nowMs < item.endTs) {
        const totalDurationMin = Math.max(1, (item.endTs - item.startTs) / 60000);
        const elapsedMin = Math.max(0, (nowMs - item.startTs) / 60000);
        const progress = Math.min(100, Math.max(0, Math.round((elapsedMin / totalDurationMin) * 100)));
        const remainingMin = Math.max(1, Math.round((item.endTs - nowMs) / 60000));
        const nextItem = list[i + 1];

        return {
          title: item.title,
          timeRange: `${item.start} - ${item.end}`,
          start: item.start,
          end: item.end,
          progress,
          remainingMin,
          nextTitle: nextItem ? nextItem.title : 'Sonraki Program'
        };
      }
    }

    // If exact current slot not found (e.g. edge gap), find next upcoming program
    const upcoming = list.find(p => p.startTs > nowMs);
    if (upcoming) {
      return {
        title: upcoming.title,
        timeRange: `${upcoming.start} - ${upcoming.end}`,
        start: upcoming.start,
        end: upcoming.end,
        progress: 5,
        remainingMin: Math.max(1, Math.round((upcoming.endTs - nowMs) / 60000)),
        nextTitle: 'Yayın Başlamak Üzere'
      };
    }
  }

  // 2. Fallback to curated static timetables
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let schedule = FALLBACK_CHANNEL_SCHEDULES[channel.id];
  if (!schedule) {
    schedule = GENRE_SCHEDULES[channel.category] || GENRE_SCHEDULES.national;
  }

  for (let i = 0; i < schedule.length; i++) {
    const slot = schedule[i];
    const startMin = parseTimeToMinutes(slot.start);
    let endMin = parseTimeToMinutes(slot.end);

    if (endMin <= startMin) {
      endMin += 24 * 60;
    }

    let compareMin = currentMinutes;
    if (startMin > endMin - 24 * 60 && currentMinutes < startMin && currentMinutes < (endMin % (24 * 60))) {
      compareMin += 24 * 60;
    }

    if (compareMin >= startMin && compareMin < endMin) {
      const totalDuration = endMin - startMin;
      const elapsed = compareMin - startMin;
      const progress = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
      const remainingMin = Math.max(1, endMin - compareMin);
      const nextSlot = schedule[(i + 1) % schedule.length];

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

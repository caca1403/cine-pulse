/* ==========================================================================
   CinePulse Studio - "Kanalım" v2 stilleri
   --------------------------------------------------------------------------
   CSS bir JS modülü olarak taşınır: görünüm hem Vite'de hem de Node'da
   (import edilebilirlik testi/CDP doğrulaması) statik `import '.css'` kırılması
   yaşamaz. Görünüm bu metni <style data-kanalim> olarak bir kez enjekte eder.
   Koyu palet (mevcut koyu tema) + tek vurgu lime #dfff76, ikincil gri #94a3b8.
   Mobil öncelikli; iframe / harici varlık YOK.
   ========================================================================== */

/** "Kanalım" görünümünün tüm stilleri (tek kaynak). */
export const KANALIM_CSS = String.raw`
.kanalim-view {
  padding-top: 6.5rem;
  padding-bottom: 5rem;
}

/* ── Başlık ──────────────────────────────────────────────────────────── */
.kanalim-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.kanalim-baslik {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 5vw, 2.4rem);
  font-weight: 800;
  margin: 0.25rem 0 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.kanalim-baslik svg { width: 26px; height: 26px; color: var(--primary, #dfff76); }

.kanalim-kanal-rozet {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #0b0d12;
  background: var(--primary, #dfff76);
  border-radius: var(--radius-full, 9999px);
  padding: 0.2rem 0.7rem;
}

.kanalim-altbaslik {
  margin: 0.35rem 0 0;
  color: var(--text-muted, #808080);
  font-size: 0.95rem;
  max-width: 56ch;
}

.kanalim-eylemler {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.kanalim-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  border-radius: var(--radius-full, 9999px);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  background: var(--bg-card, #14161c);
  color: var(--text-sub, #b3b3b3);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
}

.kanalim-btn svg { width: 15px; height: 15px; }
.kanalim-btn:hover { color: var(--text-main, #f5f5f5); border-color: rgba(223, 255, 118, 0.45); }
.kanalim-btn.is-on { color: #0b0d12; background: var(--primary, #dfff76); border-color: transparent; }
.kanalim-btn[hidden] { display: none; }

/* ── Kanal şeridi (slug) ─────────────────────────────────────────────── */
.kanalim-serit {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 0.75rem;
  scrollbar-width: thin;
  scroll-snap-type: x proximity;
}

.kanalim-chip {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.95rem;
  border-radius: var(--radius-full, 9999px);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  background: var(--bg-card, #14161c);
  color: #94a3b8;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  scroll-snap-align: start;
  transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
}

.kanalim-chip svg { width: 15px; height: 15px; }
.kanalim-chip:hover { color: var(--text-main, #f5f5f5); }
.kanalim-chip.is-active {
  color: #0b0d12;
  background: var(--primary, #dfff76);
  border-color: transparent;
}

/* ── Ruh hali şeridi ─────────────────────────────────────────────────── */
.kanalim-ruh-satir {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}

.kanalim-ruh-etiket {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 700;
}

.kanalim-ruh {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: thin;
}

.kanalim-ruh-chip {
  flex: 0 0 auto;
  padding: 0.35rem 0.8rem;
  border-radius: var(--radius-full, 9999px);
  border: 1px dashed rgba(148, 163, 184, 0.35);
  background: transparent;
  color: #94a3b8;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
}

.kanalim-ruh-chip:hover { color: var(--text-main, #f5f5f5); }
.kanalim-ruh-chip.is-active {
  color: var(--primary, #dfff76);
  border-style: solid;
  border-color: var(--primary, #dfff76);
  background: rgba(223, 255, 118, 0.1);
}

.kanalim-ruh-not {
  margin: 0.4rem 0 0;
  font-size: 0.78rem;
  color: var(--text-muted, #808080);
}

/* ── ŞU AN YAYINDA ───────────────────────────────────────────────────── */
.kanalim-now {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
}

.kanalim-now-sol { flex: 1 1 260px; min-width: 0; }

.kanalim-canli {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  color: var(--text-muted, #808080);
  font-weight: 700;
}

.kanalim-nokta {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  animation: kanalim-nabiz 1.6s ease-in-out infinite;
}

@keyframes kanalim-nabiz {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}

.kanalim-now h2 {
  margin: 0.4rem 0 0.5rem;
  font-family: var(--font-heading);
  font-size: clamp(1.2rem, 3.4vw, 1.7rem);
  font-weight: 800;
  line-height: 1.2;
}

.kanalim-now-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.9rem;
  align-items: center;
  color: #94a3b8;
  font-size: 0.86rem;
}

.kanalim-now-meta span { display: inline-flex; align-items: center; gap: 0.3rem; }
.kanalim-now-meta svg { width: 13px; height: 13px; }

.kanalim-geri-sayim {
  color: var(--primary, #dfff76);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.kanalim-neden {
  margin: 0.7rem 0 0;
  font-size: 0.82rem;
  color: var(--text-muted, #808080);
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
}

.kanalim-neden svg { width: 13px; height: 13px; flex: 0 0 auto; margin-top: 2px; }

.kanalim-sonra {
  flex: 0 1 220px;
  min-width: 0;
  border-left: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.kanalim-sonra-etiket {
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  color: #94a3b8;
  font-weight: 700;
}

.kanalim-sonra-ad {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.kanalim-sonra-meta { font-size: 0.8rem; color: #94a3b8; }

/* ── EPG / kaçırdıklarım şeritleri ───────────────────────────────────── */
.kanalim-blok { margin-bottom: 1.5rem; }

.kanalim-blok-baslik {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.74rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #94a3b8;
  font-weight: 700;
  margin-bottom: 0.6rem;
}

.kanalim-blok-baslik svg { width: 14px; height: 14px; }

.kanalim-serit-kaydir {
  display: flex;
  gap: 0.65rem;
  overflow-x: auto;
  padding-bottom: 0.6rem;
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
}

/* Yatay şeritlerde ince, temiz kaydırma çubuğu (Chrome/WebKit). */
.kanalim-serit::-webkit-scrollbar,
.kanalim-ruh::-webkit-scrollbar,
.kanalim-serit-kaydir::-webkit-scrollbar { height: 4px; }

.kanalim-serit::-webkit-scrollbar-track,
.kanalim-ruh::-webkit-scrollbar-track,
.kanalim-serit-kaydir::-webkit-scrollbar-track { background: transparent; }

.kanalim-serit::-webkit-scrollbar-thumb,
.kanalim-ruh::-webkit-scrollbar-thumb,
.kanalim-serit-kaydir::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.35);
  border-radius: var(--radius-full, 9999px);
}

.channel-epg-item,
.kanalim-kacirdik-item {
  flex: 0 0 168px;
  scroll-snap-align: start;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  padding: 0.7rem 0.8rem;
  border-radius: var(--radius-md, 6px);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  background: var(--bg-card, #14161c);
  color: inherit;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.channel-epg-item:hover,
.kanalim-kacirdik-item:hover { border-color: rgba(223, 255, 118, 0.5); transform: translateY(-2px); }

.channel-epg-time {
  font-size: 0.72rem;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.channel-epg-title {
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.channel-epg-meta { font-size: 0.72rem; color: var(--text-muted, #808080); }

.channel-epg-item.is-now {
  border-color: var(--primary, #dfff76);
  box-shadow: inset 0 0 0 1px rgba(223, 255, 118, 0.25);
}

.kanalim-kacirdik-item { opacity: 0.62; flex-basis: 150px; }
.kanalim-kacirdik-item .kanalim-binge { color: var(--primary, #dfff76); }
.kanalim-binge { font-size: 0.68rem; color: var(--primary, #dfff76); font-weight: 700; }

/* ── İstatistik şeridi ───────────────────────────────────────────────── */
.kanalim-istatistik {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
  align-items: center;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md, 6px);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
  background: var(--bg-card, #14161c);
  font-size: 0.82rem;
  color: #94a3b8;
}

.kanalim-ist-oge { display: inline-flex; align-items: center; gap: 0.35rem; }
.kanalim-ist-oge svg { width: 13px; height: 13px; }
.kanalim-ist-oge strong { color: var(--text-main, #f5f5f5); font-variant-numeric: tabular-nums; }

.kanalim-tur-dagilim {
  display: flex;
  height: 6px;
  flex: 1 1 160px;
  min-width: 140px;
  border-radius: var(--radius-full, 9999px);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
}

.kanalim-tur-dagilim span { display: block; height: 100%; }
.kanalim-tur-dagilim span:nth-child(4n + 1) { background: #dfff76; }
.kanalim-tur-dagilim span:nth-child(4n + 2) { background: #94a3b8; }
.kanalim-tur-dagilim span:nth-child(4n + 3) { background: #b7d45c; }
.kanalim-tur-dagilim span:nth-child(4n) { background: #6b7280; }

/* ── Boş durum ───────────────────────────────────────────────────────── */
.kanalim-bos {
  padding: 3rem 1.5rem;
  text-align: center;
  color: var(--text-muted, #808080);
}

.kanalim-bos svg { width: 42px; height: 42px; margin-bottom: 1rem; opacity: 0.7; }
.kanalim-bos p { margin: 0 0 0.35rem; font-size: 1rem; }
.kanalim-bos small { color: #6d6d6e; }

/* ── Mobil ───────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .kanalim-view { padding-top: 5.5rem; }
  .kanalim-sonra {
    border-left: none;
    border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
    padding-left: 0;
    padding-top: 0.9rem;
    flex: 1 1 100%;
  }
  .channel-epg-item { flex-basis: 148px; }
  .kanalim-istatistik { gap: 0.4rem 0.85rem; font-size: 0.78rem; }
  .kanalim-btn { padding: 0.5rem 0.8rem; font-size: 0.8rem; }
}

@media (prefers-reduced-motion: reduce) {
  .kanalim-nokta { animation: none; }
  .channel-epg-item:hover,
  .kanalim-kacirdik-item:hover { transform: none; }
}`;

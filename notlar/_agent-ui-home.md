# _agent-ui-home — Ana Sayfa "Netflix sıcaklığı" görevi

- [başlangıç] Yetkilendirme: HomeView.js (minimal sınıf/structure), home-polish.css (üzerine ekle), yeni home-netflix.css. Yasak dosyalara dokunulmayacak.
- [keşif] `git status --short`: HomeView.js'te KULLANICI değişikliği mevcut (ddz_/dml_ kısa dizi → DramaView yönlendirmesi, 2 blok). ÜZERİNE EKLENECEK, geri alınmayacak. home-polish.css'te kullanıcı değişikliği yok.
- [keşif] Tokenlar (main.css :root, satır 10+): --primary #dfff76, --text-main #f5f5f5, --text-sub #b3b3b3, --text-muted #9ca3af, --bg-dark #000, --radius-lg 12px, --font-heading Inter. main.css DÜZENLENMEYECEK.
- [keşif] Hero yapısı (HeroSlider.js): .hero-slider > .hero-backdrop.cp-slide-swap + .hero-overlay-gradient + .container > .hero-content > .hero-badge-row / .hero-titleblock(.hero-title-logo+.hero-title) / .hero-overview / .hero-actions(.btn-primary.hero-btn-play, .btn-secondary.hero-btn-trailer, .hero-btn-list-icon) / .hero-dots-wrapper. Kenburns + progress-bar + fade-up stagger home-polish.css'te zaten VAR (iyi temel).
- [keşif] Dikkat: main.css sonunda !important'lı masaüstü hover kuralları var (scale 1.015 kart + img 1.025 ≈ birleşik ~1.04 — görevin istediği aralıkta). !important YASAK olduğundan bu katmana ÇAKIŞMAYAN zenginlikler (glow ring, brightness, tipografi, eyebrow, oklar) eklenecek.
- [durum] motion.css ve mobil breakpoint desenleri okunuyor.

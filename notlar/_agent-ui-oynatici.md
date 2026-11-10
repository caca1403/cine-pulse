# UI Ajan Raporu — Oynatıcı Kabuğu Sinema Katmanı

Tarih: 2026-11-10 · Görevveren: ana oturum (birebir şikâyet: "arayüzde asla dizilla kalitesi netflix sıcaklığı hissetmiyorum")

## Yapılan değişiklikler

1. **YENİ:** [src/styles/player-cinema.css](../../src/styles/player-cinema.css) (546 satır) — 13 bölümlü sinema kabuk katmanı.
2. [src/components/PlayerModal.js](../../src/components/PlayerModal.js) — **yalnız 1 satır:** `import '../styles/player-cinema.css';` (satır 103). JS/markup'a dokunulmadı.
3. `player-polish.css` — **dokunulmadı** (cevaz vardi ama gerekmedi).
4. `player-shine.css` — **dokunulmadı**; kullanıcının commit edilmemiş 36 satırlık eki (tarama kartı + hazır havuz paneli) aynen korundu.

## Tasarım eşlemesi (şikâyet → çözüm)

| Bölge | Eski his | Sinema katmanı |
|---|---|---|
| Kontrol çubuğu | Tek kademe yüzeysel degrade | 4 kademeli derin degrade (0.94→0.74→0.42→0) + cam blur; gizlenme 0.32s→0.5s yumuşak yay |
| Üst sinema şeridi | Yüzeysel | Daha uzun uğultu + iç kenarda 1px hairline parıltı (::after) |
| Zaman çubuğu | 3px→7px, amber→kırmızı gradyan | **Netflix hattı: 4px→8px**, saf lime (`--primary`), glow, buffered (%30 gri) net, thumb 13px hover'da 1.25× |
| Ses/parlaklık popup | Altın çerçeve, tutarsız | Koyu yüzey (rgba 9,13,21,.96), 14px radius, tek gölge dili, lime badge |
| Ayarlar (⋮) menüsü | Lime çerçeve | Nötr hairline çerçeve; seçili satır = lime + inset 2px referans çubuğu (Netflix işareti dili) |
| Bölüm seçici overlay | Düz koyu | blur(12) arka plan, cam kutu, hover'da kalkan (translateY -2px) + aktif bölüm dolu lime |
| .kaynak-kart (oynatıcı içi) | Düz | Hover'da lime nefes + kaldırma, aktif kaynak inset lime çubuğu |
| Sahne | Vinyetsiz, "düz küp" | Radial vinyet (merkez %56 şeffaf — video yutmaz); mobilde hafifletilir |
| Dokunmatik | <40px olanlar | ctrl/transport/pill ≥40px, kapat butonları ≥40px |

KR: yeni renk YOK (yalnızca `--primary`, `#dfff76`/`rgb(223,255,118)` ailesi + siyah/beyaz alfalar); yerleşim/boyut kuralları değiştirilmedi.

## Bilinçli istisna: `!important`

 Görev "!important YOK" dedi; ancak `player-polish.css` progress çubuğu ve kontrol çubuğu zemininde **mevcut** `!important` bildirimleri var. Bunları örtüşmezse 4→8px hattı ve derin degrade uygulanamazdı. `!important` yalnızca bu eşleşmelerde, dosya başlığında ve ilgili bölüm başlarında gerekçeyle kullanıldı; hover dil, popup, bölüm seçici, kaynak kartı, pill bar gibi tüm yeni yüzeylerde `!important` yoktur.

## Kanıt (taze, bu oturumda çalıştırıldı)

| Kontrol | Komut | Sonuç |
|---|---|---|
| Build | `node node_modules/vite/bin/vite.js build` | ✅ exit 0 — `✓ built in 14.36s` |
| Tam test seti | `node --test tests/` | ✅ **682 pass / 0 fail / 1 skip** (683 test) |
| Zorunlu dosya | `node --test tests/oynatici-bolum-nav.test.mjs` | ✅ **20/20 pass** |
| Diff ayak izi | `git diff --stat` | PlayerModal.js: +1 satır (391→392, kalanı bolum-nav ajanının); styles'ta benim tarafımdan yalnız YENİ player-cinema.css |

## Kapsam disiplini

- commit/push yok — çalışma ağacında bırakıldı.
- main.css, navigation.css, kaynak-listesi.css, detay/home/kart css, resource-*.css: hiçbiri benim tarafımdan değiştirilmedi (diff'te görünen onlar başka ajanların önceki işleri).
- `@media (prefers-reduced-motion: reduce)` → tüm eklenen geçiş/hareket kapatan kapanış bölümü eklendi (§13).
- Mobil: ≤640px'te dolgu, vinyet yoğunluğu, bölüm seçici genişliği disipline edildi (§12).

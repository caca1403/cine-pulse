# UI Hareket & Kalite Planı (ertelendi — kullanıcı onayıyla yapılacak)

Tarih: 2026-11-11. Kullanıcı: "Dizilla hissi" farkı için kabul edilen sıralı plan.

1. **Hareket geçişi (öncelik 1):** :root'a tek `--ease-out-premium` + süre değişkenleri
   (150/250/400ms). Ray/kart girişinde 30-40ms stagger, kart hover 250ms özel eğri,
   navbar kaydırınca yumuşak koyulaşma + blur. prefers-reduced-motion kapanışı.
2. **Boşluk/derinlik denetimi:** 4 ana ekranda (home/detay/kart/oynatıcı) tutarsız
   margin/gölge/radius; !important katmanlarını AZALTARAK toparla (ekleyerek değil).
3. **Vurgu rengi diyeti:** lime (#dfff76) yalnız ana eylem + aktif durum; chip/rozet/
   vurgu yazılarda nötr gri tonlarına çek.
4. **İmaj reçetesi:** hero degrade + poster oranı + boş-görsel durumu için tek tarif.

Kurallar: main.css'i azaltarak düzenle, yeni !important EKLEME, her adım build+test
geçidi, yan yana ekran görüntüsüyle kanıt.

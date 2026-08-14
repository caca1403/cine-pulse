# DiziBol Pro - GitHub Pages Uyumlu Dizi & Film Platformu

Bu proje, herhangi bir arka sunucuya (backend) veya veritabanına ihtiyaç duymadan, **GitHub Pages, Vercel, Netlify veya Cloudflare Pages** gibi ücretsiz statik hosting hizmetlerinde 7/24 kesintisiz çalışacak şekilde tasarlanmıştır.

---

## 🌟 Öne Çıkan Özellikler

- **100% Sunucusuz & Üyeliksiz**: Kullanıcı verileri, izleme geçmişi ve favoriler tarayıcının yerel depolama alanında (`localStorage`) saklanır.
- **JSON Yedekleme & Cihaz Aktarımı**: İzleme geçmişinizi tek tıkla `.json` dosyası olarak indirebilir, başka bir cihazda yükleyerek kaldığınız yerden devam edebilirsiniz.
- **TMDB API Entegrasyonu**: Trendler, posterler, arka plan görselleri, IMDb puanları ve bölüm detayları canlı çekilir.
- **Çoklu Oynatıcı Sunucuları**: SezonlukDizi, FilmMakinesi, HDFilmCehennemi, Dizipal, Sinewix ve DiziBol VIP HD sunucuları üzerinden kesintisiz yayın.

---

## 🚀 GitHub Pages'e Ücretsiz Yükleme Adımları

1. Bu projeyi GitHub hesabınızda yeni bir depoya (**repository**) push edin.
2. Reponuzun **Settings (Ayarlar)** -> **Pages** sekmesine gidin.
3. **Source (Kaynak)** seçeneğini **GitHub Actions** olarak ayarlayın.

Otomatik yayınlama iş akışı (`.github/workflows/deploy.yml`) kodları push ettiğiniz anda sitenizi `https://kullaniciadi.github.io/dizibol-web` adresinde canlıya alacaktır!

---

## 💻 Yerelde Çalıştırma

```bash
npm install
npm run dev
```

Derleme almak için:
```bash
npm run build
```

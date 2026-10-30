# Öneri Merkezi — kişisel içerik sıralaması

## Kullanıcı akışı

- Ana sayfa hero alanı en üstte kalır. Dikey/yatay kart seçici hero'nun hemen
  altındadır; mevcut kart tercihi tüm kartlarda uygulanır.
- Ana sayfa kişisel önerileri, devam eden izleme ve katalog satırlarından önce
  gösterilir. En az on yeni aday bulunmayan satır çizilmez.
- Her kişisel öneri rafı film, dizi, tamamlananlardan sonra ve favorilere yakın
  rafları dahil en fazla 40 başlık gösterir. Havuz yeterliyse her raf 40'a kadar
  dolar; tamamlanan/favori rafları eksikse ikinci TMDB öneri sayfası da çekilir.
- Film ve dizi havuzu 40'ın altındaysa zevk türlerine göre ek keşif sayfaları
  çağrılır. İzlenen kimlikler her durumda dışarıda kalır; yenileme veya yeni
  içerik sorgusu sonrasında boşalan yerler yeni uygun adaylarla doldurulur.
- Ana sayfa katalog önbelleği en geç 10 dakikada yenilenir; Öneri Merkezi'nde
  "Önerileri yenile" güncel katalog ve izleme verisiyle yeniden sıralar.
- `#kanalim` rotası artık Öneri Merkezi'dir; takvim, yayın saati ve EPG görünümü
  yoktur.
- Takipteki, favorideki, geçmişteki ve tamamlanmış yapımlar öneri kartı olarak
  gösterilmez. Tamamlananlar yalnızca benzer yeni yapım bulmak için tohumdur.

## Aday üretimi ve sıralama

`src/services/kisisel/recommendationEngine.js` birden fazla geçmiş, tamamlanan,
favori ve izleme listesi girdisinden TMDB öneri kenarları toplar. İstek eşzamanlılığı
üçle sınırlıdır. Adaylar profil güvenlik filtresinden geçirilir, izlenenlerle
tekilleştirilir ve tür/film-dizi çeşitliliği korunarak sıralanır. Ana sayfadaki
popüler katalog yalnızca genel kişisel rafı genişletir; tamamlanan/favori rafları
yalnızca kendi ilişkili önerilerini gösterir.

`#kanalim` görünümü ve ana sayfa aynı aday motorunu paylaşır. Ana sayfa hero ve
kart görünümü sırası korunur; öneri kartlarının gerçekten görünür kalması
negatif gösterim, açılması pozitif etkileşim olarak kaydedilir.

Öneri Merkezi, üretilen film/dizi sayısını, önerilerden çıkarılan eşsiz başlık
sayısını, eğitilmiş model bileşenlerini, gerçek doğrulama AUC değerini (varsa)
ve gerçek eğitim örneği sayısını gösterir. Doğrulama verisi yetersizse AUC
uydurulmaz; "Henüz ölçülmedi" olarak belirtilir.

## Cihaz içi modeller

- **Lojistik sıralayıcı**: gerçek gösterim/tıklama örneklerinden öğrenir.
- **MLP**: aynı gözlenmiş etiketleri, sınıf dengeli ve deterministik eğitimle
  sıralamaya dahil eder; sentetik etiket üretmez.
- **BPR**: izleme, favori ve liste sinyallerinden gizli zevk vektörü öğrenir.
- **Ürün benzerliği**: birlikte izleme ilişkisini aday sıralamasına katar.
- **Sıralı tür CNN'i**: kronolojik geçmişteki son tür vektörlerinden sonraki
  tür eğilimlerini öğrenir.

Etkin bileşenler kendi ağırlıklarıyla normalize edilir; eğitilmemiş model
kişiselleştirme iddiası üretmez. Yeni kaynak bağlamı özellikleri (tamamlanan ve
favori rafları) eklendiği için `MODEL_SURUMU=5` kullanılır; eski şemalı modeller
yüklenmez.

## Doğrulama

Otomatik testler MLP deterministikliğini ve skor sıralamasını, CNN şekil
doğrulamasını, kaynağa özel özellikleri, aday tekilleştirme/dışlamayı ve
tamamlananlardan yalnızca yeni ilişkili yapıt üretilmesini ve yeterli dizi
havuzu oluşmadığında tür bazlı keşif sayfalarının çağrılmasını kapsar.
Öneri motoru hedefli testleri bu değişiklikte 6/6 geçti; Vite üretim derlemesi
başarılı. Canlı ağdan kaç içerik döneceği katalog yanıtına ve
kullanıcının dışlama listesine bağlıdır.

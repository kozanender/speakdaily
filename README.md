# SpeakDaily, kurulum rehberi

Telefona ve bilgisayara uygulama olarak kurulan, internetsiz çalışan İngilizce konuşma pratiği uygulaması (PWA).

## Klasörde neler var

| Dosya | Ne işe yarar |
|-------|--------------|
| `index.html` | Uygulamanın kendisi (ekranlar, içerik, düzeltme motoru, mikrofon) |
| `whisper-worker.js` | Sesi yazıya çeviren Whisper modeli, telefonun içinde çalışır |
| `sw.js` | Uygulamanın internetsiz açılmasını sağlar |
| `content/meta.json` | Kütüphane ve uygulama sürümü (güncelleme denetimi için) |
| `content/sentences.json` | Cümle bankası (A2, B1, B2 seviyelerinde günlük konuşma cümleleri) |
| `manifest.webmanifest` | Uygulama adı, ikon ve renkler (ana ekrana ekleme için) |
| `icons/` | Uygulama ikonları |

## 1. Yayına alma (bir kez, yaklaşık 5 dakika)

Mikrofon ve internetsiz çalışma için uygulamanın **https** adresinde durması gerekir. En kolay iki yol:

### Yol A: Netlify Drop (en kolay)
1. Zip dosyasını aç, `speakdaily-app` klasörü çıksın.
2. Bilgisayardan https://app.netlify.com/drop adresine git (ücretsiz hesapla giriş yap).
3. `speakdaily-app` klasörünü sayfadaki kutuya sürükle bırak.
4. Netlify sana `https://…netlify.app` şeklinde bir adres verir. Site ayarlarından adı `speakdaily-ender` gibi bir şeyle değiştirebilirsin.

### Yol B: GitHub Pages
1. GitHub'da yeni bir repo aç (ör. `speakdaily`).
2. Klasördeki tüm dosyaları repoya yükle (Add file → Upload files).
3. Settings → Pages → Branch: `main`, klasör: `/ (root)` → Save.
4. Birkaç dakika sonra adres hazır olur: `https://<kullanıcı-adın>.github.io/speakdaily/`

## 2. Telefona kurma

**Android (Chrome):** Adresi aç → sağ üstteki ⋮ menüsü → **Uygulamayı yükle** (ya da "Ana ekrana ekle").

**iPhone (Safari):** Adresi aç → alttaki **Paylaş** tuşu → **Ana Ekrana Ekle**.

Bilgisayarda Chrome ya da Edge ile adres çubuğundaki yükle simgesine basman yeterli.

## 3. İlk açılış (bir kez, Wi-Fi'de)

1. Uygulamayı aç, üstteki **Şimdi indir** tuşuna bas. Ses tanıma modeli (yaklaşık 80 MB) indirilir.
2. İlk **Konuş** tuşuna bastığında mikrofon izni ister, **İzin ver** de.
3. **Özet** ekranından hatırlatma saatlerini seç ve **Takvim dosyasını indir**. Dosyayı açıp takvimine ekle. Her gün o saatlerde bildirim gelir.

Bundan sonra uygulama internet olmadan çalışır.

## Bu sürümde neler var

- Üst bantta her zaman görünen A2 / B1 / B2 seçimi: shadowing cümleleri, Listening ve Reading seçilen seviyeye göre gelir
- Günlük süre seçimi (20–60 dakika, Kütüphane sekmesinde); süre arttıkça günlük cümle sayısı da artar
- Kütüphane sekmesi: kütüphane ve uygulama sürümü, seviyelere göre içerik sayıları, ilerleme, güncelleme denetimi, sürüm geçmişi
- Aktif süre sayacı, seri (streak) takibi
- Cümle bankası: her gün seçilen seviyeden (A2, B1, B2 ya da sırayla) yeni cümleler, kaldığı yerden devam; Cümle Bankası ekranında seviye, konu ve arama ile istediğin cümleyi bugüne ekleyebilirsin
- Shadowing döngüsü: kelimeler (önce Türkçe, sonra İngilizce örnek) → dinle ve tekrarla → Türkçe → İngilizce → sonuç
- Gerçek mikrofon kaydı ve cihaz içinde ses tanıma (Whisper)
- Kelime kelime düzeltme ve Türkçe açıklamalar (artikel, edat, yardımcı fiil, kelime sırası)
- Listening (diyalog + sorular) ve Reading (sesli okuma + kelime kartları)
- Ses durdurma tuşu, yavaş dinleme, US/GB aksan seçimi
- Takvim hatırlatması

## Bilinen sınırlar ve sonraki adımlar

- **Sesler:** Şimdilik telefonun kendi okuma sesi kullanılıyor (Android'de Google, iPhone'da Apple sesi). Bir sonraki sürümde tüm cümleler Piper ile bilgisayarda bir kez seslendirilip uygulamaya eklenecek (Türkçe: fahrettin, İngilizce: lessac ve alan). Böylece ses kalitesi her telefonda aynı olacak.
- **İçerik:** Cümle bankasındaki cümlelerin kelime kartları henüz yok; bu cümlelerde shadowing doğrudan "Dinle ve tekrarla" adımından başlar. Listening ve Reading şimdilik birer örnek.
- **Telaffuz:** Şu an kelime düzeyinde kontrol ediliyor. Ses (fonem) düzeyinde kontrol sonraki fazda.
- **Eski telefonlar:** Ses tanıma yavaşsa Özet ekranından "Daha hızlı (tiny.en)" modelini seç.

## Güncelleme yayınlama

Dosyaları değiştirdikten sonra `sw.js` içindeki `VERSION` değerini, `content/meta.json` ile `index.html` içindeki sürüm numaralarını artır ve klasörü yeniden yükle. Telefondaki uygulama bir sonraki açılışta güncellenir.

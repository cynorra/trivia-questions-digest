# Trivia Questions Digest (triviaquestionsdigest.com)

Trivia + coğrafya sitesi (Map Quiz Daily bu siteye birleştirildi):
- Günlük trivia quiz'i (her gün herkese aynı 10 soru), 23 kategoride elle yazılmış 531 soru (4 şık + açıklama + kaynak), kaynaklı fun fact'ler ve günün bilgisi, rastgele soru üreticisi.
- Harita quizleri: 50 eyalet ve 195 ülke için haritaya tıklama, eyalet/dünya başkentleri, bayraklar, ülke silüetleri, günlük coğrafya quiz'i (`/daily-geography-quiz/`), 40 soruluk coğrafya trivia'sı, `/map-quizzes/` hub sayfası.
- Spirit animal quiz (`/spirit-animal-quiz/`): 10 soruluk kişilik eşleştirmesi, 8 hayvan; her hayvan cevaplarda eşit sıklıkta, beraberlik son cevaba göre bozuluyor (dağılım %11–14).
- Ülke bilgi sayfaları: `/facts-about-japan/`, `/facts-about-mexico/`, `/facts-about-canada/` (16'şar kaynaklı bilgi).
- Ana sayfada quiz yok (AdSense incelemesi için metin ağırlıklı hub); günlük quiz `/daily-trivia/` sayfasında.
- 31 rehber (16 trivia + 15 coğrafya).

> Marka/domain: `src/site.config.js` (domain henüz kesin değil; değişirse sadece burası). Görseller: `CHROME_PATH=... node scripts/make-images.mjs`.

## Çalıştırma

```bash
npm install
npm run dev
npm test                 # soru bankası: 4 farklı şık, tekrar eden soru yok, SSS/başlık tekilliği, günlük havuz tekrarsızlığı
npm run test:pipeline    # auto-blog kapılarının offline testi
npm run build
node scripts/check-links.mjs
PREVIEW_FUTURE=1 npm run build   # zamanı gelmemiş rehberleri de görmek için (deploy'da asla)
```

## İçerik

| Dosya | İçerik |
| --- | --- |
| `src/lib/trivia/bank-a.js` | Genel kültür, tarih, bilim, yemek |
| `src/lib/trivia/bank-b.js` | Spor, film/dizi, müzik, yetişkinler için (zor), seniors (1950–70'ler) |
| `src/lib/trivia/bank-c.js` | Christmas, Thanksgiving, Halloween, Bible (bölüm/ayet referanslı) |
| `src/lib/trivia/cats.js` | Her kategori sayfasının özgün metni, SSS'si, kaynakları; soru id'leri ve deterministik şık karıştırma |
| `src/lib/trivia/facts.js` | Kaynaklı fun fact'ler (doğrulanamayan "bilgiler" bilerek yok) |
| `src/components/trivia/daily-core.ts` | Günlük quiz takvimi: havuz karıştırılıp günde 10 dağıtılır, tüm havuz bitmeden soru tekrar etmez |

Kurallar: ilk şık her zaman doğru cevap (sayfada karıştırılır). Mevcut soruların sırası değiştirilmez (id'ler pozisyona bağlı); yeni soru sona eklenir. Değişebilen bilgiler "as of" ile yazılır; "şu anki şampiyon / gişe lideri" sorusu yok. Günlük havuzda tatil ve Bible soruları yok (kendi sayfalarında).

## Coğrafya verisi

| Dosya | İçerik |
| --- | --- |
| `src/lib/geo/us-states.js` | 50 eyalet, başkent, Census bölgesi |
| `src/lib/geo/countries.js` | 193 BM üyesi + 2 gözlemci; `countries-list` ve `world-countries` ile çapraz kontrol |
| `src/lib/geo/maps.js` | Build anında SVG harita (us-atlas, world-atlas / Natural Earth) |
| `src/lib/geo/pages.js` | Harita quiz sayfalarının elle yazılmış metni, ipuçları, SSS |
| `scripts/make-geo-assets.mjs` | `prebuild`: `public/flags` ve `public/outlines` üretir |

Trivia kategorileri ve harita sayfaları aynı `[slug].astro` rotasını kullanır (`components/trivia/CategoryPage.astro`, `components/geo/GeoPage.astro`); slug çakışması build'i durdurur. Harita sayfaları "How we make our maps", trivia sayfaları "How we write questions" yöntem sayfasına bağlanır.

## Scaled content önlemleri

- 23 kategori sayfasının her birinin gövdesi, host ipuçları ve 3 SSS'si elle yazıldı; testler SSS/H2 tekrarını ve 190 kelimenin altındaki gövdeyi build'i durduracak şekilde yakalar.
- Sayfa başına tek tip şablon metin yok; sayılar ve kategori adı dışında ortak cümle yok.
- Rehberler yazılmamış/yayınlanmamış rehbere link verirse link otomatik düz metne döner (`src/lib/live-links.js`), 404 link oluşmaz.
- Auto-blog: makale sitenin soru setini kullanmak zorunda (en az 4 cevap + sayfa linki, açıklamaları kopyalamak yasak), başkan sıra numarası iddiaları kontrol edilir, 7 farklı editoryal form döner. Cron kapalı; açılınca haftada 3.

## Auto-blog

`scripts/pipeline/`: konu bankası `topics.ts` (Keyword Planner verisinden 12 konu), veri `lib/evidence.ts`, gerçek kontrolü `lib/facts.ts`. Secrets: `GEMINI_API_KEY`, `FIREBASE_SERVICE_ACCOUNT`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Variables: `CLOUDFLARE_PAGES_PROJECT`, `FIREBASE_PROJECT_ID`. Service account sadece auto-blog job'unda; build sadece project ID ile okur. `.env` asla commit edilmez.

## Kurulum

1. Firebase projesi (Spark, kart yok) → Firestore → `firestore.rules` → service account JSON'u GitHub secret'ına.
2. Rehberleri Firestore'a bas: `.env`'e `FIREBASE_SERVICE_ACCOUNT` → `node scripts/push-guides.mjs`.
3. GitHub repo + secrets/variables → push. Cloudflare Pages + domain; Email Routing `hello@triviaquestionsdigest.com`.
4. Deploy her gün 13:05 UTC'de yeniden build alır (günlük quiz'in sunucu HTML'i ve zamanlanmış rehberler için).
5. Search Console + Bing; rehberler yayına girince AdSense'e başvur. `ads.txt` ilk günden yayında.

## Rehber takvimi

Trivia: 13 rehber 2 Kasım, `fun-facts-about-yourself` 4 Kasım, `fun-fact-of-the-day-for-work` 5 Kasım, `how-to-get-better-at-trivia` 9 Kasım. Coğrafya: 10 Kasım'da 5 rehber, sonra Pazar hariç her gün 1 (21 Kasım'a kadar). Kaydırmak için: `node scripts/reschedule.mjs YYYY-MM-DD`.

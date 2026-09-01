# ADO Design — Yapılanlar Özeti

## 🎨 Genel Tasarım Kararları
- **Renk Paleti**: Saf siyah arkaplan (`#000000`) + canlı neon portakal (`#FF5A1F`)
- **Çerçeve**: Tüm bölümler diagonal çizgili (`stripes`) arkaplan, portakal renkli animasyonlu pulslarla
- **Tipografi**: Modern, büyük ve bold font hiyerarşisi

## ✅ Sonradan Güncellenenler (Bağımsız Yapıldı)
- **WebP dönüşümü**: Tüm resimler `.jpg` → `.webp` formatına çevrildi, boyutlar küçüldü
- **Renkli resimler**: Dosya adlarına `-color` suffix eklendi, resimler artık orijinal renkli
- **Mobil desteği tamamlandı**: Her bölüm `variant: 'desktop' | 'mobile'` aldı
- **Touch olayları**: `onPointerDown / Up / Cancel` ile tüm hover efektleri parmakla da çalışıyor
- **Lamba efekti yeniden tasarlandı**: Radial gradient mücadelesi yerine fotoğraftaki dairesel elemanlara portakal **spinning sweep halkası** (`conic-gradient`) eklendi — çok daha temiz ve doğru
- **Uçak touch desteği**: `whileHover` yerine `state` tabanlı sisteme geçildi, telefonda parmakla da tetikleniyor

---

## 📸 Her Bölüme Eklenen Resimler & Efektler

### 01 · Über Mich (Hakkımda) — `AboutSection.tsx`
- **Resim**: Portakal rengi tavan lambası olan karanlık ofis fotoğrafı (`about-portrait.jpg`)
- **Efekt**: Fare üzerine gelince **TV Static Flashlight** — yüksek kontrastlı beyaz gürültü maskesi farenin etrafında parlıyor
- **🆕 Portakal Lamba Efekti**: CSS `mix-blend-multiply` ile tavan spotunun tam altına portakal rengi koni ışık eklendi. Titreyen (flicker) animasyonuyla gerçek bir floresan ampul hissi veriyor. Karanlık alanlar siyah kalıyor, sadece beyaz ışık portakala dönüşüyor.

---

### 02 · Projekte (Projeler) — `ProjectsSection.tsx`
- **Resim**: Siyah-beyaz portre (`projects-portrait.jpg`)
- **Efekt**: Fare üzerine gelince **Neon Turuncu Matrix/Grid** tarayıcı efekti — `maskImage` + `mix-blend-screen` ile piksel grid ızgarası parlıyor

---

### 03 · Werkzeuge (Yetenekler) — `SkillsSection.tsx`
- **Resim**: Takım fotoğrafı, ortada hizalı (`skills-team.jpg`)
- **Efekt**: **Sıvı/Akan Siyah Boya** efekti — fare hızına göre SVG `feDisplacementMap` ile resim distorte oluyor. Hızlı hareket = aşırı erime!

---

### 04 · Werdegang (Deneyim) — `ExperienceSection.tsx`
- **Resim**: Dedektif panosu (`experience-board.jpg`)
- **Efekt**: **Büyüteç** efekti — fare nerede olursa orada `scale: 1.5` zoom, `transformOrigin` farenin koordinatına göre dinamik hesaplanıyor

---

### 05 · Kontakt (İletişim) — `ContactSection.tsx`
- **Resim**: Karanlık ofis arkaplanı (`contact-bg.jpg`)
- **Efekt**: **Kağıt Uçak** efekti — fare üzerine gelince:
  1. Fotoğraf katlanıp kağıt uçağa dönüşüyor (`clipPath` ile üçgen şekil)
  2. Gölge overlay ile 3D katlama hissi
  3. Önce ters yöne (sağa) havalanıyor
  4. Sonra dönerek sola/merkeze geliyor
  5. Tam ortada arkasını dönüp sayfanın derinliğine (`scale: 0`) yok oluyor
  6. Toplam süre: **4.5 saniye**

> [!IMPORTANT]
> **İki uçak versiyonu mevcut — henüz karar verilmedi!**
>
> | Versiyon | Dosya | Uçuş Şekli |
> |----------|-------|------------|
> | ✅ **Aktif** | `ContactSection.tsx` | Zikzaklı: önce sağa, sonra sola döner, ortada sayfanın içine dalar |
> | 💾 **Yedek** | `ContactSection.backup.tsx` | Dümdüz sola uçup kayboluyor |
>
> Karar verildiğinde beğenilmeyen dosya silinecek.

---

## 🔧 Teknik Altyapı

### Pointer Events Hiyerarşisi (Kritik!)
Tüm bölümlerde `z-20` grid konteyneri `pointer-events-none`, içerik olan yarım `pointer-events-auto` — bu sayede boş yarım fareyi arka plandaki resme geçiriyor.

### Kullanılan Teknolojiler
| Teknoloji | Kullanım |
|-----------|----------|
| `framer-motion` | Animasyonlar, `useMotionValue`, `useSpring`, `variants` |
| `Tailwind CSS` | Layout, `mix-blend-*`, `clip-path` |
| `SVG Filters` | `feDisplacementMap` ile sıvı distorsiyon (Werkzeuge) |
| CSS `clip-path` | Kağıt uçak şekli, ışık konisi |
| CSS `mix-blend-multiply` | Portakal spot ışık efekti |
| `radial-gradient` | Yumuşak ışık konisi, fade-out |

---

## 💡 Portakal Lamba Efekti — Nasıl Çalışıyor?

```css
/* mix-blend-multiply: beyaz * portakal = portakal, siyah * portakal = siyah */
background: radial-gradient(ellipse 18% 58% at 32% 3%,
  #FF5A1F 0%,              /* Lambanın tam üzerinde: saf portakal */
  rgba(255,90,31,0.6) 35%, /* Aşağıya indikçe zayıflıyor */
  rgba(255,90,31,0.15) 65%,
  transparent 90%          /* Kenarlarda tamamen şeffaf */
)
```

Titreme (flicker) animasyonu:
```js
animate={{ opacity: [1, 0.88, 1, 0.92, 0.85, 1] }}
transition={{ duration: 0.3, repeat: Infinity, repeatType: "mirror" }}
```

---

## 📁 Değiştirilen Dosyalar

| Dosya | Yapılan Değişiklik |
|-------|--------------------|
| [`AboutSection.tsx`](file:///D:/repos/clor/src/components/AboutSection.tsx) | TV Static + Portakal Lamba efekti |
| [`ProjectsSection.tsx`](file:///D:/repos/clor/src/components/ProjectsSection.tsx) | Matrix Grid efekti |
| [`SkillsSection.tsx`](file:///D:/repos/clor/src/components/SkillsSection.tsx) | Sıvı distorsiyon efekti |
| [`ExperienceSection.tsx`](file:///D:/repos/clor/src/components/ExperienceSection.tsx) | Büyüteç efekti |
| [`ContactSection.tsx`](file:///D:/repos/clor/src/components/ContactSection.tsx) | Kağıt uçak efekti |
| `public/images/` | 5 resim eklendi (about, projects, skills, experience, contact) |

---

## ⏭️ Sıradaki Adımlar — Portakal Lamba Efektleri

### Hakkımda (About) — `about-portrait.jpg`
- [x] Tavan spot lambası → portakal efekti ✅ (yapıldı, ince ayar devam ediyor)
- [ ] Sol alt köşedeki **masa lambası** → portakal efekti

### Projekte (Projects) — `projects-portrait.jpg`
- [ ] Resimdeki lambalar → portakal efekti

### Werkzeuge (Skills) — `skills-team.jpg`
- [ ] Resimdeki lambalar → portakal efekti

### Werdegang (Experience) — `experience-board.jpg`
- [ ] Resimdeki lambalar → portakal efekti

### Kontakt (Contact) — `contact-bg.jpg`
- [ ] Resimdeki lambalar → portakal efekti

---

> **Not:** Lamba efektleri spinning sweep halkasına dönüştüğü için koordinat uğraşı ortadan kalktı. Tüm bölümlerde halkalar zaten aktif.

---

## 📱 Mobil Ayarları — ✅ TAMAMLANDI

- [x] Her bölüm `variant: 'desktop' | 'mobile'` aldı
- [x] Touch olayları (`onPointerDown / Up / Cancel`) eklendi
- [x] Resimler mobilde ayrı bir blok olarak görünüyor
- [x] Kağıt uçak efekti telefonda parmakla tetikleniyor
- [x] TV Static, Matrix, Büyüteç, Sıvı distorsiyon → touch destekli

---

## 🎯 Planlanan Easter Egg & Gelişmiş Özellikler

### 1. 🖥️ Gizli Terminal Modu
`~` tuşuna basınca alttan gerçek görünümlü bir terminal açılır.
- `whoami` → `Adnan Aydin`
- Birkaç sahte komut çalışır (`ls`, `ping`, `git log` vb.)
- ESC veya `exit` ile kapanır

### 2. ✨ Cursor Parçacık İzi
Fare hareket ederken arkasında turuncu kıvılcım/toz izi bırakır (sadece masaüstü).

### 3. 🟩 Logo'ya 5× Tıkla → Matrix Modu
Tüm site birden yeşil-siyah koda dönüşür, birkaç saniye sonra normale döner.

### 4. 🤖 Sahte AI Asistan Balonu
Sağ altta **"Adnan'ın botu"** — önceden yazılmış birkaç soruya (fiyat, süre, iletişim) cevap veriyormuş gibi yazar-siler animasyonuyla yanıt verir.

### 5. 🔢 Kod Satırı Sayacı (Açılışta)
Sayfa yüklenirken:
> *"47.382 satır yazıldı — 6.104 kahve içildi"*
gibi sahte-eğlenceli sayaç animasyonu.

### 6. 🎉 Konfeti Patlaması
"Nachricht senden" butonuna basınca ekranda parçacık kutlaması.

### 7. 📱 Gyroscope Tilt (Telefonda)
Telefonu eğdikçe kartlar/ışıklar gerçekten 3D eğiliyor. Mouse-tilt'in dokunmatik hâli, jiroskopla.

### 8. 🎮 Konami Kodu Easter Egg
`↑↑↓↓←→←→BA` yazınca gizli bir **"teşekkürler, gerçekten denedin"** ekranı/rozet çıkar.

### 9. 👁️ Canlı "Şu an kaç kişi bakıyor" Rozeti
Analytics'ten gerçek veri — header'da küçük yeşil nokta + sayı.

### 10. 🔊 Ses Tasarımı
Hover/tık'larda çok kısa terminal-klik sesi, sağ üstte sessize alma düğmesiyle.

---

> [!NOTE]
> Bu özellikler öncelik sırasına göre değil, hayal gücü sırasına göre listelenmiştir. Hangisinden başlanacağına birlikte karar verilecek.

---

## ⏸️ Ertelenen — Yarın Bakılacak

### 🌈 Tüm Site Rengi Tek Tıkla Değişsin (Rainbow Icon → Global Accent)
Header'a eklenen küçük rainbow ikon şu an sadece `.framed` bölüm çerçevesinin
(`border-color`) rengini değiştiriyor — `--frame-color` CSS değişkeni,
`src/index.css` + `src/components/Header.tsx`. Çalışıyor ama etkisi zayıf,
kullanıcı yeterince etkileyici bulmadı.

**İstenen:** Aynı ikon tıklanınca sitedeki **her** turuncu aynı anda değişsin
— buton, kenarlık, halka, ışıltı, terminal yazısı, kayan şeritler (scrolling
gradient strip'ler) dahil her yer.

**Neden ertelendi — kullanıcının uyarısı:**
> "kayan seritler var her yer ayni turuncu deyil daha hafif tutuncular var
> daha acik daha zayif tutuncular var — o kadar enginde hafifini güclüsünü
> ayarlamak lazim, kac dakikalik bir isten bahsediyoruz ve cok temiz kod
> yazilacak öyle icine atim calisiyor istemem"

Yani: turuncu tek ton değil — bazı yerlerde tam `#FF5A1F`, bazı yerlerde
düşük opacity'li/açık tonlar (rgba glow'lar, gradient stop'lar, kayan şerit
opacity katmanları). Basit bulup-değiştir (`#FF5A1F` → `var(--accent)`) bunu
kaçırır, ton hiyerarşisi bozulur.

**Kapsam (önceki analiz):** `#FF5A1F` / `#C23E10` toplam 61 yerde, 12 dosyada
(bkz. `AboutSection`, `ExperienceSection`, `Header`, `HeroSection`,
`MatrixMode`, `ProjectsSection`, `ScrollToTop`, `SecretTerminal`,
`SkillsSection`, `ui.tsx`, `index.css`, `app/duel/page.tsx`).

**Yarın yapılacak — düzgün plan:**
1. Önce kayan şeritler + tüm rgba/opacity varyasyonlarını tek tek çıkar,
   "güçlü / orta / zayıf" diye 3 seviyeye ayır (kaç ton gerçekten var, say).
2. Buna göre CSS değişkenleri: `--accent`, `--accent-dark`,
   `--accent-rgb` (rgba glow'lar için), gerekirse `--accent-soft` (zayıf ton).
3. 61 yeri tek tek, dosya dosya değiştir — build + görsel kontrol her adımda.
4. Süre tahmini ve "temiz kod" sözü: iş küçük görünüp aceleye getirilmeyecek,
   önce ton envanteri çıkmadan kod yazılmayacak.

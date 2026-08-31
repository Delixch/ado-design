# ADO Design — Yapılanlar Özeti

## 🎨 Genel Tasarım Kararları
- **Renk Paleti**: Saf siyah arkaplan (`#000000`) + canlı neon portakal (`#FF5A1F`)
- **Çerçeve**: Tüm bölümler diagonal çizgili (`stripes`) arkaplan, portakal renkli animasyonlu pulslarla
- **Tipografi**: Modern, büyük ve bold font hiyerarşisi

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

> **Not:** Her resimdeki lambanın koordinatı farklı olduğu için her birini ayrı ayrı piksel-piksel konumlandırmak gerekiyor. Bölüm bölüm gidilecek.

---

## 📱 Mobil Ayarları — YAPILMADI

> [!WARNING]
> Tüm hover efektleri ve resim yerleşimleri şu an **sadece masaüstü** için optimize edilmiştir. Mobil cihazlarda görüntü bozulabilir.

Kontrol edilip yapılacaklar:

- [ ] **AboutSection** — Resim ve TV static efekti mobilde gözüküyor mu?
- [ ] **ProjectsSection** — Matrix grid efekti mobilde çalışıyor mu?
- [ ] **SkillsSection** — Sıvı distorsiyon efekti mobilde performanslı mı?
- [ ] **ExperienceSection** — Büyüteç efekti mobilde touch ile çalışıyor mu?
- [ ] **ContactSection** — Kağıt uçak efekti mobilde touch ile tetikleniyor mu?
- [ ] Tüm resimlerin mobil `breakpoint`'lerde (`min-[1000px]:block`) doğru gizlenip göründüğü test edilecek
- [ ] Portakal lamba efektlerinin mobilde koordinatları kontrol edilecek
- [ ] Touch cihazlarda hover yerine `onTouchStart` / `onTouchMove` gerekip gerekmediği değerlendirilecek

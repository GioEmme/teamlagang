# Team La Gang · RcLandia

Sito ufficiale di **A.S. Team La Gang** e della pista RC indoor **RcLandia**.
Dominio: `teamlagang.it`

## Stack

- **Next.js 16** · App Router, Turbopack
- **React 19** · TypeScript
- **Tailwind CSS v4** · design system via `@theme` in `src/app/globals.css`
- **Framer Motion 12** · micro-interazioni, scroll reveals
- **React Three Fiber + drei** · hero 3D (RC car + pista animata)
- **Lenis** · smooth scroll
- **GSAP** · disponibile per animazioni avanzate

## Sviluppo

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run start
```

## Struttura

```
src/
├── app/                  # Route App Router
│   ├── layout.tsx        # Root: fonts, Lenis, cursor, nav, footer
│   ├── page.tsx          # Home
│   ├── pista/            # RcLandia info + regolamento
│   ├── team/             # Piloti
│   ├── categorie/        # 7 categorie RC
│   ├── eventi/           # Calendario + archivio
│   ├── news/             # Blog
│   ├── contatti/         # Form + info tesseramento
│   ├── globals.css       # Tailwind v4 theme
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── Navigation.tsx    # Header animato + mobile fullscreen
│   ├── Footer.tsx
│   ├── SmoothScroll.tsx  # Lenis provider
│   ├── CustomCursor.tsx  # Cursor custom (solo desktop pointer:fine)
│   ├── Hero3D.tsx        # Canvas R3F
│   ├── three/
│   │   ├── RcCar.tsx
│   │   ├── Track.tsx
│   │   └── SpeedParticles.tsx
│   ├── Reveal.tsx        # Scroll reveal + split text
│   ├── Marquee.tsx
│   ├── MagneticButton.tsx
│   ├── PageHero.tsx
│   └── sections/         # Sezioni home
│       ├── Hero.tsx
│       ├── IntroManifesto.tsx
│       ├── Categories.tsx
│       ├── TrackSection.tsx
│       ├── TeamPreview.tsx
│       ├── NewsPreview.tsx
│       └── CTA.tsx
└── lib/
    ├── site.ts           # Config: nav, categorie, social, copy
    └── cn.ts
```

## Personalizzazione

### Colori brand (`src/app/globals.css`)

```css
--color-yellow: #ffd500;     /* primario */
--color-yellow-hot: #fff100;
--color-red: #e63946;        /* accent Team La Gang */
--color-blue: #1e4d8b;       /* RcLandia */
--color-bg: #0a0a0a;
```

### Contenuti
- Navigazione + categorie + copy: `src/lib/site.ts`
- Piloti: `src/app/team/page.tsx`
- Eventi: `src/app/eventi/page.tsx`
- News: `src/app/news/page.tsx`
- Indirizzo / email / telefono: `src/app/contatti/page.tsx`

### Logo
Sostituire `public/teamlagang-logo.png` e `public/rclandia-logo.png` mantenendo i nomi.

## Performance

- Hero 3D disattiva shadows + particles su dispositivi `prefers-reduced-motion` o core < 4
- `dpr` canvas adattivo (max 2 desktop, 1.25 mobile)
- Cursor custom solo `pointer: fine`
- Smooth scroll Lenis lerp 0.1
- `next/font` con `display: swap`

## Deploy

Ottimale su **Vercel** (zero config).
Per altri provider: `npm run build` + `npm run start` (porta 3000).

## Todo per produzione

- [ ] Collegare form contatti a backend (Resend / Formspree / API route)
- [ ] Sostituire piloti / eventi / news mock con CMS (Sanity, Contentful) o MDX
- [ ] Aggiungere galleria foto/video pista
- [ ] OG image dedicata
- [ ] Cookie banner (GDPR)
- [ ] Analytics (Vercel Analytics o Plausible)

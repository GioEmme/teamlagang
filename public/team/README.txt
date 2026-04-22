TEAM PILOT IMAGES — public/team/
==================================

Una foto per pilota. Nome file = numero di gara del pilota.

Piloti attuali (vedi src/app/team/page.tsx):
  07.jpg    → Pilota 01 (Capitano, 1/10 Touring Mod)
  12.jpg    → Pilota 02 (Veterano, 1/12 Pancar)
  24.jpg    → Pilota 03 (Racing, Touring Stock)
  33.jpg    → Pilota 04 (Rookie, TT02)
  45.jpg    → Pilota 05 (Racing, 1/10 FWD)
  56.jpg    → Pilota 06 (Racing, 1/12 GT)

Formati accettati: .jpg, .jpeg, .png, .webp, .avif
Dimensione consigliata: 1200x1600 px (ratio 3:4 verticale), < 400 KB

Le foto appaiono:
- Come background card nei riquadri piloti della home (preview)
- Come background card nella pagina /team

Se la foto manca, resta la card con numero grande (fallback).

Quando aggiungi/modifichi piloti, aggiorna la lista in:
- src/app/team/page.tsx (const pilots)
- e/o src/components/sections/TeamPreview.tsx

TEAM PILOT IMAGES — public/team/
==================================

Una foto per pilota. Nome file = numero di gara del pilota.

Piloti attuali (vedi src/app/team/page.tsx):
  01.jpg    -> Alberto Montecchi
  02.jpg    -> Isacco Fornaciari
  03.jpg    -> Alberto Spadoni
  04.jpg    -> Roberto Petazzoni
  05.jpg    -> Alessandro Davoli
  06.jpg    -> Alessandro Lonardi
  07.jpg    -> Danilo Donadelli
  08.jpg    -> Enrico Rabitti
  09.jpg    -> Giovanni Mauramati

Non tutte le foto sono presenti: se manca, resta il fallback col numero grande.

Formati accettati: .jpg, .jpeg, .png, .webp, .avif
Dimensione consigliata: 1200x1600 px (ratio 3:4 verticale), < 400 KB

Le foto appaiono:
- Come background card nei riquadri piloti della home (preview)
- Come background card nella pagina /team

Se la foto manca, resta la card con numero grande (fallback).

Quando aggiungi/modifichi piloti, aggiorna la lista in:
- src/app/team/page.tsx (const pilots)
- e/o src/components/sections/TeamPreview.tsx

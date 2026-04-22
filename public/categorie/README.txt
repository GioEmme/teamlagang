CATEGORIE IMAGES — public/categorie/
======================================

Una foto per categoria. Nome file = slug della categoria.

Slug disponibili (vedi src/lib/site.ts):
  touring-gt.jpg         → 1/10 Touring GT
  touring-stock.jpg      → 1/10 Touring Stock
  touring-modificata.jpg → 1/10 Touring Modificata
  fwd.jpg                → 1/10 FWD
  gt12.jpg               → 1/12 GT
  pancar.jpg             → 1/12 Pancar
  tt02.jpg               → TT02

Formati accettati: .jpg, .jpeg, .png, .webp, .avif
Dimensione consigliata: 1200x1600 px (ratio 3:4 verticale), < 400 KB

Le foto appaiono:
- Come background delle card nello slider Categorie della home
- In testa ad ogni blocco della pagina /categorie

Se la foto manca, resta il gradiente attuale (comportamento di fallback).

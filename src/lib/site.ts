export const site = {
  name: "Team La Gang",
  fullName: "A.S. Team La Gang",
  track: "RcLandia",
  domain: "teamlagang.it",
  tagline: "Pista RC indoor. Moquette, piloti, divertimento.",
  description:
    "A.S. Team La Gang gestisce RcLandia, pista RC indoor aperta al pubblico. 1/10 Touring GT/Stock/Modificata, 1/10 FWD, 1/12 GT, 1/12 Pancar, TT02.",
  nav: [
    { label: "Pista", href: "/pista" },
    { label: "Team", href: "/team" },
    { label: "Categorie", href: "/categorie" },
    { label: "Eventi", href: "/eventi" },
    { label: "News", href: "/news" },
    { label: "Contatti", href: "/contatti" },
  ],
  categories: [
    {
      slug: "touring-gt",
      label: "1/10 Touring GT",
      short: "GT",
      blurb: "Gran turismo 1/10, assetto pista, gomme tyre.",
    },
    {
      slug: "touring-stock",
      label: "1/10 Touring Stock",
      short: "Stock",
      blurb: "Regolamento controllato. Scuola di guida pura.",
    },
    {
      slug: "touring-modificata",
      label: "1/10 Touring Modificata",
      short: "Modificata",
      blurb: "Niente limiti. Motori open, potenza totale.",
    },
    {
      slug: "fwd",
      label: "1/10 FWD",
      short: "FWD",
      blurb: "Trazione anteriore. Guida tecnica, divertimento garantito.",
    },
    {
      slug: "gt12",
      label: "1/12 GT",
      short: "1/12 GT",
      blurb: "Scala 1/12 formato GT. Leggere e precise.",
    },
    {
      slug: "pancar",
      label: "1/12 Pancar",
      short: "Pancar",
      blurb: "Telaio piatto, niente ammortizzatori. Icona storica.",
    },
    {
      slug: "tt02",
      label: "TT02",
      short: "TT02",
      blurb: "Tamiya TT02 monomarca. Categoria accessibile e spettacolare.",
    },
  ],
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  },
} as const;

export type NavItem = (typeof site.nav)[number];
export type Category = (typeof site.categories)[number];

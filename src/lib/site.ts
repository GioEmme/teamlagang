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
      blurb: "Gran turismo 1/10, 21.5T, Gomme Ride",
    },
    {
      slug: "touring-stock",
      label: "1/10 Touring Stock",
      short: "Stock",
      blurb: "Motore 17.5T",
    },
    {
      slug: "touring-modificata",
      label: "1/10 Touring Modificata",
      short: "Modificata",
      blurb: "",
    },
    {
      slug: "fwd",
      label: "1/10 FWD",
      short: "FWD",
      blurb: "Trazione anteriore. Motore 21.5T.",
    },
    {
      slug: "gt12",
      label: "1/12 GT",
      short: "1/12 GT",
      blurb: "Scala 1/12 carrozzerie GT & LM.",
    },
    {
      slug: "pancar",
      label: "1/12 Pancar",
      short: "Pancar",
      blurb: "",
    },
    {
      slug: "tt02",
      label: "TT02",
      short: "TT02",
      blurb: "Tamiya TT02, combo Hobbywing Justock 17.5, gomme Ride.",
    },
  ],
  social: {
    facebook: "https://www.facebook.com/p/RcLandia-100063565060634/",
    pullstart: "https://pullstart.tv/track/rc-landia?isUpcoming=0",
    myrcm: "https://www.myrcm.ch/myrcm/main?dId[O]=5244&pLa=it&hId[1]=org",
  },
} as const;

export type NavItem = (typeof site.nav)[number];
export type Category = (typeof site.categories)[number];

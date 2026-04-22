import type { Metadata, Viewport } from "next";
import { Anton, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { SocialRail, SocialFab } from "@/components/SocialRail";
import { site } from "@/lib/site";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.name} — ${site.track} · Pista RC indoor`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "RC",
    "radiocomandate",
    "pista indoor",
    "RcLandia",
    "Team La Gang",
    "1/10 touring",
    "1/12 pancar",
    "TT02",
  ],
  openGraph: {
    title: `${site.name} — ${site.track}`,
    description: site.tagline,
    type: "website",
    locale: "it_IT",
    url: `https://${site.domain}`,
  },
  icons: {
    icon: "/teamlagang-logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="it"
      className={`${anton.variable} ${grotesk.variable} ${mono.variable}`}
    >
      <body className="bg-bg text-ink antialiased">
        <div className="grain" aria-hidden />
        <SmoothScroll>
          <CustomCursor />
          <Navigation />
          <SocialRail />
          <SocialFab />
          <main className="relative">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}

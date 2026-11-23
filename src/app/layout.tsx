import type { Metadata, Viewport } from "next";
import { Anton, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SiteChrome } from "@/components/SiteChrome";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SocialRail, SocialFab } from "@/components/SocialRail";
import { site } from "@/lib/site";
import { getUpcomingEventTeasers, type UpcomingEventTeaser } from "@/lib/myrcm";
import { BannerPopup } from "@/components/BannerPopup";

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
    "vaschetta",
    "Italian Indoor Series",
  ],
  openGraph: {
    title: `${site.name} — ${site.track}`,
    description: site.tagline,
    type: "website",
    locale: "it_IT",
    url: `https://${site.domain}`,
  },
  // Favicon/icone gestite dalle file-convention in src/app:
  // favicon.ico, icon.png, apple-icon.png (logo Charity Race).
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

// Refresh the prerendered event list hourly (new events, changed dates).
export const revalidate = 3600;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Upcoming events for the pulsing countdown teaser; the rail/FAB pick the
  // one inside the countdown window using the visitor's date.
  // Failure here must not break the layout — fall back to no teaser.
  let upcomingEvents: UpcomingEventTeaser[] = [];
  try {
    upcomingEvents = await getUpcomingEventTeasers();
  } catch (err) {
    console.error("layout: getUpcomingEventTeasers failed", err);
  }

  return (
    <html
      lang="it"
      className={`${anton.variable} ${grotesk.variable} ${mono.variable}`}
    >
      <body className="bg-bg text-ink antialiased">
        <div className="grain" aria-hidden />
        <SmoothScroll>
          <SiteChrome
            nav={<Navigation />}
            rails={
              <>
                <SocialRail events={upcomingEvents} />
                <SocialFab events={upcomingEvents} />
                <BannerPopup />
              </>
            }
            footer={<Footer />}
          >
            {children}
          </SiteChrome>
        </SmoothScroll>
      </body>
    </html>
  );
}

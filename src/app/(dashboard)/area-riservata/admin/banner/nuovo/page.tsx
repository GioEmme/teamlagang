import type { Metadata } from "next";
import Link from "next/link";
import { BannerForm } from "@/components/admin/BannerForm";

export const metadata: Metadata = {
  title: "Nuovo banner",
  robots: { index: false, follow: false },
};

export default function NewBannerPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 md:px-10 py-16 md:py-24">
      <Link
        href="/area-riservata/admin/banner"
        className="inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint hover:text-yellow transition-colors mb-8"
      >
        ← Banner
      </Link>
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-yellow mb-3">
        Nuovo banner
      </div>
      <h1 className="text-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] mb-12">
        Annuncia.
      </h1>

      <BannerForm
        initial={{
          title: "",
          caption: "",
          imageUrl: "",
          linkUrl: "",
          showEveryVisit: false,
          active: true,
          startsAt: null,
          endsAt: null,
        }}
      />
    </section>
  );
}

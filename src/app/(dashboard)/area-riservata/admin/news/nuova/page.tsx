import type { Metadata } from "next";
import Link from "next/link";
import { NewsForm } from "@/components/admin/NewsForm";

export const metadata: Metadata = {
  title: "Nuova news",
  robots: { index: false, follow: false },
};

export default function NewNewsPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 md:px-10 py-16 md:py-24">
      <Link
        href="/area-riservata/admin/news"
        className="inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint hover:text-yellow transition-colors mb-8"
      >
        ← Articoli
      </Link>
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-yellow mb-3">
        Nuovo articolo
      </div>
      <h1 className="text-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] mb-12">
        Scrivi.
      </h1>

      <NewsForm
        initial={{
          title: "",
          slug: "",
          excerpt: "",
          body: "",
          coverImage: null,
          published: false,
        }}
      />
    </section>
  );
}

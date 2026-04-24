import type { Metadata } from "next";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Area riservata",
  robots: { index: false, follow: false },
};

export default async function AreaRiservataPage() {
  const session = await auth();
  // layout guarantees session, but TS needs the check
  if (!session) return null;

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-5 md:px-10 py-20 overflow-hidden">
      <div className="relative text-center max-w-6xl">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-yellow mb-6">
          Benvenuto / tessera {session.user.tesseraCode}
        </div>
        <h1 className="text-display text-[clamp(3rem,14vw,16rem)] leading-[0.85]">
          <span className="block text-ink">{session.user.firstName}</span>
          <span className="block text-yellow">{session.user.lastName}</span>
        </h1>
        <p className="mt-8 text-ink-dim max-w-lg mx-auto text-sm leading-relaxed">
          Questa è la tua area. Qui arriveranno prenotazioni, calendario gare,
          risultati e altro. Per ora puoi gestire i tuoi dati nel{" "}
          <a
            href="/area-riservata/profilo"
            className="text-yellow hover:underline"
          >
            profilo
          </a>
          .
        </p>
      </div>
    </section>
  );
}

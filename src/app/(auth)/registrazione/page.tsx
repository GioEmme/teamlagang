import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Registrazione",
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect("/area-riservata");

  return (
    <section className="min-h-screen flex items-center justify-center px-5 md:px-10 py-20">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint hover:text-yellow transition-colors mb-10"
        >
          ← Home
        </Link>

        <div className="font-mono text-xs uppercase tracking-[0.3em] text-yellow mb-3">
          Nuovo account
        </div>
        <h1 className="text-display text-[clamp(2.5rem,7vw,4rem)] leading-[0.9] mb-4">
          Registrati.
        </h1>
        <p className="text-ink-dim text-sm mb-8 leading-relaxed">
          Servono il tuo codice tessera (4 cifre) e un&apos;email. Se non sei
          ancora tesserato, passa dalla pista.
        </p>

        <RegisterForm />

        <div className="mt-8 pt-6 border-t border-white/10 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
          Hai già un account?{" "}
          <Link href="/login" className="text-yellow hover:underline">
            Accedi →
          </Link>
        </div>
      </div>
    </section>
  );
}

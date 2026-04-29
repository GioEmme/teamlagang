import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    registered?: string;
    error?: string;
    pwdchanged?: string;
  }>;
}) {
  const session = await auth();
  if (session) redirect("/area-riservata");

  const params = await searchParams;

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
          Box personale
        </div>
        <h1 className="text-display text-[clamp(2.5rem,7vw,4rem)] leading-[0.9] mb-8">
          Accedi.
        </h1>

        {params.registered === "1" && (
          <div className="mb-6 border border-yellow/40 bg-yellow/5 px-4 py-3 font-mono text-xs uppercase tracking-widest text-yellow">
            Registrazione completata. Ora accedi.
          </div>
        )}
        {params.pwdchanged === "1" && (
          <div className="mb-6 border border-yellow/40 bg-yellow/5 px-4 py-3 font-mono text-xs uppercase tracking-widest text-yellow">
            Password aggiornata. Accedi con la nuova.
          </div>
        )}

        <LoginForm />

        <div className="mt-8 pt-6 border-t border-white/10 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
          Non hai un account?{" "}
          <Link href="/registrazione" className="text-yellow hover:underline">
            Registrati →
          </Link>
        </div>
      </div>
    </section>
  );
}

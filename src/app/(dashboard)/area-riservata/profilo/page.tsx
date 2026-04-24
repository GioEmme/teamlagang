import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { AnagraficaSection } from "./AnagraficaSection";
import { PasswordSection } from "./PasswordSection";

export const metadata: Metadata = {
  title: "Profilo",
  robots: { index: false, follow: false },
};

export default async function ProfiloPage() {
  const session = await auth();
  if (!session) return null;

  const rows = await db
    .select({
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      tesseraCode: users.tesseraCode,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  const user = rows[0];
  if (!user) return null;

  return (
    <section className="mx-auto max-w-4xl px-5 md:px-10 py-16 md:py-24">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-yellow mb-3">
        Profilo
      </div>
      <h1 className="text-display text-[clamp(3rem,9vw,7rem)] leading-[0.9] mb-12 md:mb-20">
        I tuoi dati.
      </h1>

      <div className="space-y-16 md:space-y-24">
        <AnagraficaSection
          initial={{
            firstName: user.firstName,
            lastName: user.lastName,
          }}
          email={user.email}
          tesseraCode={user.tesseraCode}
        />
        <PasswordSection />
      </div>
    </section>
  );
}

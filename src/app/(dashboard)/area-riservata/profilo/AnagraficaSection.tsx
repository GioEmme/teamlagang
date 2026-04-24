"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  initial: { firstName: string; lastName: string };
  email: string;
  tesseraCode: string;
};

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "ok" }
  | { type: "error"; msg: string };

export function AnagraficaSection({ initial, email, tesseraCode }: Props) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const dirty =
    firstName.trim() !== initial.firstName ||
    lastName.trim() !== initial.lastName;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "loading" });

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus({ type: "error", msg: data.error ?? "Errore aggiornamento" });
      return;
    }

    setStatus({ type: "ok" });
    router.refresh();
    setTimeout(() => setStatus({ type: "idle" }), 2500);
  }

  return (
    <Section
      index="01"
      title="Anagrafica"
      description="Nome e cognome sono modificabili. Email e codice tessera sono bloccati — per modificarli contatta l'associazione."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Nome"
            value={firstName}
            onChange={setFirstName}
            required
            autoComplete="given-name"
          />
          <Field
            label="Cognome"
            value={lastName}
            onChange={setLastName}
            required
            autoComplete="family-name"
          />
        </div>

        <ReadonlyField label="Email" value={email} />
        <ReadonlyField label="Codice tessera" value={tesseraCode} />

        {status.type === "error" && (
          <div className="border border-red/40 bg-red/5 px-4 py-3 font-mono text-xs uppercase tracking-widest text-red">
            {status.msg}
          </div>
        )}
        {status.type === "ok" && (
          <div className="border border-yellow/40 bg-yellow/5 px-4 py-3 font-mono text-xs uppercase tracking-widest text-yellow">
            Salvato ✓
          </div>
        )}

        <button
          type="submit"
          disabled={!dirty || status.type === "loading"}
          className="px-6 py-3 bg-yellow text-bg font-mono text-xs uppercase tracking-widest font-semibold hover:bg-yellow-hot transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status.type === "loading" ? "Salvataggio…" : "Salva modifiche"}
        </button>
      </form>
    </Section>
  );
}

function Section({
  index,
  title,
  description,
  children,
}: {
  index: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-start border-t border-white/10 pt-10 md:pt-14">
      <div className="md:col-span-1">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-2">
          {index}
        </div>
        <h2 className="text-display text-3xl md:text-4xl mb-4">{title}</h2>
        <p className="text-sm text-ink-dim leading-relaxed max-w-xs">
          {description}
        </p>
      </div>
      <div className="md:col-span-2">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-2">
        {label}
      </span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg-soft border border-white/10 px-4 py-3 text-ink font-mono text-sm focus:border-yellow focus:outline-none transition-colors"
      />
    </label>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-2">
        {label}
      </span>
      <div className="w-full bg-bg-soft/50 border border-dashed border-white/10 px-4 py-3 text-ink-dim font-mono text-sm select-all">
        {value}
      </div>
    </div>
  );
}

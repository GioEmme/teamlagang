"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const body = {
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      email: form.get("email"),
      password: form.get("password"),
      tesseraCode: form.get("tesseraCode"),
      consent: form.get("consent") === "on",
    };

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Registrazione fallita.");
      return;
    }

    router.push("/login?registered=1");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nome" name="firstName" autoComplete="given-name" required />
        <Field label="Cognome" name="lastName" autoComplete="family-name" required />
      </div>
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        hint="Minimo 8 caratteri"
      />
      <Field
        label="Codice tessera"
        name="tesseraCode"
        type="text"
        inputMode="numeric"
        pattern="\d{4}"
        maxLength={4}
        required
        hint="4 cifre numeriche"
      />

      <label className="flex items-start gap-3 pt-2 cursor-pointer group">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 w-4 h-4 accent-yellow"
        />
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim leading-relaxed group-hover:text-ink transition-colors">
          Accetto{" "}
          <a href="/privacy" target="_blank" className="text-yellow hover:underline">
            Privacy
          </a>{" "}
          e{" "}
          <a href="/cookie" target="_blank" className="text-yellow hover:underline">
            Cookie policy
          </a>
        </span>
      </label>

      {error && (
        <div className="border border-red/40 bg-red/5 px-4 py-3 font-mono text-xs uppercase tracking-widest text-red">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-4 bg-yellow text-bg font-mono text-xs uppercase tracking-widest font-semibold hover:bg-yellow-hot transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Registrazione…" : "Crea account →"}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-2">
        {label}
      </span>
      <input
        {...props}
        className="w-full bg-bg-soft border border-white/10 px-4 py-3 text-ink font-mono text-sm focus:border-yellow focus:outline-none transition-colors"
      />
      {hint && (
        <span className="block mt-1 font-mono text-[9px] uppercase tracking-widest text-ink-faint">
          {hint}
        </span>
      )}
    </label>
  );
}

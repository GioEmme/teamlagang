"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "error"; msg: string };

export function PasswordSection() {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirm) {
      setStatus({ type: "error", msg: "Le password nuove non coincidono" });
      return;
    }
    if (newPassword.length < 8) {
      setStatus({ type: "error", msg: "Nuova password: minimo 8 caratteri" });
      return;
    }

    setStatus({ type: "loading" });

    const res = await fetch("/api/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus({ type: "error", msg: data.error ?? "Errore cambio password" });
      return;
    }

    // Logout globale dopo cambio password
    await signOut({ callbackUrl: "/login?registered=0&pwdchanged=1" });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-start border-t border-white/10 pt-10 md:pt-14">
      <div className="md:col-span-1">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-2">
          02
        </div>
        <h2 className="text-display text-3xl md:text-4xl mb-4">Sicurezza</h2>
        <p className="text-sm text-ink-dim leading-relaxed max-w-xs">
          Dopo il cambio password verrai disconnesso e dovrai rientrare con le
          nuove credenziali.
        </p>
      </div>
      <div className="md:col-span-2">
        <form onSubmit={onSubmit} className="space-y-4">
          <Field
            label="Password attuale"
            type="password"
            value={currentPassword}
            onChange={setCurrent}
            required
            autoComplete="current-password"
          />
          <Field
            label="Nuova password"
            type="password"
            value={newPassword}
            onChange={setNew}
            required
            minLength={8}
            autoComplete="new-password"
            hint="Minimo 8 caratteri"
          />
          <Field
            label="Conferma nuova password"
            type="password"
            value={confirm}
            onChange={setConfirm}
            required
            autoComplete="new-password"
          />

          {status.type === "error" && (
            <div className="border border-red/40 bg-red/5 px-4 py-3 font-mono text-xs uppercase tracking-widest text-red">
              {status.msg}
            </div>
          )}

          <button
            type="submit"
            disabled={
              status.type === "loading" ||
              !currentPassword ||
              !newPassword ||
              !confirm
            }
            className="px-6 py-3 bg-yellow text-bg font-mono text-xs uppercase tracking-widest font-semibold hover:bg-yellow-hot transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status.type === "loading" ? "Cambio in corso…" : "Cambia password"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
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
      {hint && (
        <span className="block mt-1 font-mono text-[9px] uppercase tracking-widest text-ink-faint">
          {hint}
        </span>
      )}
    </label>
  );
}

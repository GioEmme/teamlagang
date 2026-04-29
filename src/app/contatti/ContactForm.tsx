"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactState } from "./actions";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<ContactState, FormData>(
    sendContactMessage,
    null,
  );

  if (state?.ok) {
    return (
      <div className="border border-yellow/40 bg-yellow/5 p-6 md:p-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow mb-3">
          Messaggio ricevuto
        </div>
        <p className="text-display text-2xl md:text-3xl text-ink leading-tight">
          Grazie, ci sentiamo a breve.
        </p>
        <p className="mt-3 text-sm text-ink-dim">
          Ti risponderemo all'indirizzo che hai indicato.
        </p>
      </div>
    );
  }

  const fieldErrors =
    state && !state.ok ? (state.fieldErrors ?? {}) : ({} as Record<string, string[]>);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Honeypot — invisible to humans, bots fill it */}
      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          opacity: 0,
        }}
      />

      <Field label="Nome" name="name" error={fieldErrors.name?.[0]} />
      <Field
        label="Email"
        name="email"
        type="email"
        error={fieldErrors.email?.[0]}
      />
      <Field
        label="Categoria di interesse"
        name="category"
        placeholder="Es. 1/10 Stock, TT Club, GT12…"
        error={fieldErrors.category?.[0]}
      />
      <TextArea
        label="Messaggio"
        name="message"
        error={fieldErrors.message?.[0]}
      />

      {state && !state.ok && state.error ? (
        <p className="font-mono text-xs uppercase tracking-widest text-red">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        data-cursor="invia"
        className="mt-2 inline-flex items-center justify-center gap-3 px-8 py-4 bg-yellow text-bg font-mono text-xs uppercase tracking-widest font-semibold hover:bg-yellow-hot transition-colors self-start disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>Invio in corso…</>
        ) : (
          <>
            Invia messaggio <span>→</span>
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className={
          "bg-transparent border-b py-3 outline-none text-ink placeholder:text-ink-faint transition-colors " +
          (error
            ? "border-red focus:border-red"
            : "border-white/20 focus:border-yellow")
        }
      />
      {error ? (
        <span className="font-mono text-[10px] uppercase tracking-widest text-red">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function TextArea({
  label,
  name,
  error,
}: {
  label: string;
  name: string;
  error?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
        {label}
      </span>
      <textarea
        name={name}
        rows={5}
        className={
          "bg-transparent border-b py-3 outline-none text-ink resize-none transition-colors " +
          (error
            ? "border-red focus:border-red"
            : "border-white/20 focus:border-yellow")
        }
      />
      {error ? (
        <span className="font-mono text-[10px] uppercase tracking-widest text-red">
          {error}
        </span>
      ) : null}
    </label>
  );
}

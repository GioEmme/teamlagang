"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Initial = {
  id?: string;
  title: string;
  caption: string;
  imageUrl: string;
  linkUrl: string;
  showEveryVisit: boolean;
  active: boolean;
  startsAt: string | null; // ISO, null = nuovo banner
  endsAt: string | null; // ISO, null = nuovo banner
};

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "error"; msg: string };

// ISO → valore per <input type="datetime-local"> nell'ora locale del browser
function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(v: string) {
  return v ? new Date(v).toISOString() : "";
}

export function BannerForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const isEdit = Boolean(initial.id);

  const [title, setTitle] = useState(initial.title);
  const [caption, setCaption] = useState(initial.caption);
  const [imageUrl, setImageUrl] = useState(initial.imageUrl);
  const [linkUrl, setLinkUrl] = useState(initial.linkUrl);
  const [showEveryVisit, setShowEveryVisit] = useState(initial.showEveryVisit);
  const [active, setActive] = useState(initial.active);
  const [startsAt, setStartsAt] = useState(toLocalInput(initial.startsAt));
  const [endsAt, setEndsAt] = useState(toLocalInput(initial.endsAt));
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const fileRef = useRef<HTMLInputElement>(null);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "banner");

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus({ type: "error", msg: data.error ?? "Upload fallito" });
      return;
    }
    const data = await res.json();
    setImageUrl(data.url);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "loading" });

    const endpoint = isEdit
      ? `/api/admin/banner/${initial.id}`
      : "/api/admin/banner";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim() || null,
        caption: caption.trim() || null,
        imageUrl: imageUrl.trim() || null,
        linkUrl: linkUrl.trim() || null,
        showEveryVisit,
        active,
        startsAt: fromLocalInput(startsAt),
        endsAt: fromLocalInput(endsAt),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus({ type: "error", msg: data.error ?? "Salvataggio fallito" });
      return;
    }

    router.push("/area-riservata/admin/banner");
    router.refresh();
  }

  async function onDelete() {
    if (!isEdit) return;
    const ok = confirm(
      "Cancellare definitivamente questo banner? Operazione irreversibile.",
    );
    if (!ok) return;

    setStatus({ type: "loading" });
    const res = await fetch(`/api/admin/banner/${initial.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus({ type: "error", msg: data.error ?? "Cancellazione fallita" });
      return;
    }
    router.push("/area-riservata/admin/banner");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* IMAGE */}
      <Field label="Immagine" hint="Carica un file (max 5 MB) o incolla un URL pubblico.">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={onUpload}
              disabled={uploading}
              className="text-xs text-ink-dim file:mr-3 file:px-3 file:py-1.5 file:border file:border-white/20 file:bg-bg-soft file:text-ink file:font-mono file:text-[10px] file:uppercase file:tracking-widest file:cursor-pointer file:hover:border-yellow"
            />
            {uploading && (
              <span className="font-mono text-[10px] uppercase tracking-widest text-yellow">
                Upload…
              </span>
            )}
          </div>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Anteprima banner"
              className="max-h-64 border border-white/10"
            />
          )}
        </div>
      </Field>

      {/* TITLE */}
      <Field label="Titolo" hint="Facoltativo se c'è l'immagine.">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          className={inputClass}
        />
      </Field>

      {/* CAPTION */}
      <Field label="Didascalia" hint="Facoltativa. Testo breve sotto l'immagine.">
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          maxLength={1000}
          className={`${inputClass} resize-y`}
        />
      </Field>

      {/* LINK */}
      <Field
        label="Link"
        hint="Facoltativo. Es. pagina iscrizioni myrcm: compare un bottone 'Scopri di più'."
      >
        <input
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://..."
          className={inputClass}
        />
      </Field>

      {/* WINDOW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Inizio validità *">
          <input
            type="datetime-local"
            required
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Fine validità *">
          <input
            type="datetime-local"
            required
            min={startsAt || undefined}
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      {/* FREQUENCY */}
      <Field label="Ripetizione">
        <div className="space-y-2">
          <Radio
            checked={!showEveryVisit}
            onChange={() => setShowEveryVisit(false)}
            label="Una volta sola"
            hint="Chiuso una volta, non riappare più a quel visitatore (cookie)."
          />
          <Radio
            checked={showEveryVisit}
            onChange={() => setShowEveryVisit(true)}
            label="A ogni visita"
            hint="Riappare ogni volta che il visitatore torna sul sito."
          />
        </div>
      </Field>

      {/* ACTIVE */}
      <Field label="Stato" hint="Spento = non si vede anche se è nel periodo di validità. Se più banner sono validi insieme, si vede l'ultimo modificato.">
        <label className="inline-flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-4 h-4 accent-yellow"
          />
          <span className="font-mono text-xs uppercase tracking-widest text-ink">
            {active ? "Attivo" : "Disattivato"}
          </span>
        </label>
      </Field>

      {status.type === "error" && (
        <div className="border border-red/40 bg-red/5 px-4 py-3 font-mono text-xs uppercase tracking-widest text-red">
          {status.msg}
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
        <button
          type="submit"
          disabled={status.type === "loading" || uploading}
          className="px-6 py-3 bg-yellow text-bg font-mono text-xs uppercase tracking-widest font-semibold hover:bg-yellow-hot transition-colors disabled:opacity-40"
        >
          {status.type === "loading" ? "Salvataggio…" : "Salva"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={onDelete}
            className="ml-auto px-6 py-3 border border-red/50 text-red font-mono text-xs uppercase tracking-widest hover:bg-red hover:text-ink transition-colors"
          >
            Elimina
          </button>
        )}
      </div>
    </form>
  );
}

const inputClass =
  "w-full bg-bg-soft border border-white/10 px-4 py-3 text-ink font-mono text-sm focus:border-yellow focus:outline-none transition-colors [color-scheme:dark]";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-2">
        {label}
      </span>
      {children}
      {hint && (
        <span className="block mt-1.5 font-mono text-[9px] uppercase tracking-widest text-ink-faint">
          {hint}
        </span>
      )}
    </div>
  );
}

function Radio({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  hint: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 w-4 h-4 accent-yellow"
      />
      <span>
        <span className="block font-mono text-xs uppercase tracking-widest text-ink">
          {label}
        </span>
        <span className="block mt-0.5 text-xs text-ink-dim">{hint}</span>
      </span>
    </label>
  );
}

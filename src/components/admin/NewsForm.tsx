"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { slugify } from "@/lib/slugify";

type Initial = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  published: boolean;
};

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "error"; msg: string };

export function NewsForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const isEdit = Boolean(initial.id);

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEdit);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [body, setBody] = useState(initial.body);
  const [coverImage, setCoverImage] = useState(initial.coverImage ?? "");
  const [published, setPublished] = useState(initial.published);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const fileRef = useRef<HTMLInputElement>(null);

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugManuallyEdited) setSlug(slugify(v));
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus({ type: "error", msg: data.error ?? "Upload fallito" });
      return;
    }
    const data = await res.json();
    setCoverImage(data.url);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSubmit(e: React.FormEvent, forcePublished?: boolean) {
    e.preventDefault();
    setStatus({ type: "loading" });

    const publishedFinal =
      typeof forcePublished === "boolean" ? forcePublished : published;

    const endpoint = isEdit
      ? `/api/admin/news/${initial.id}`
      : "/api/admin/news";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        body,
        coverImage: coverImage.trim() || null,
        published: publishedFinal,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus({
        type: "error",
        msg: data.error ?? "Salvataggio fallito",
      });
      return;
    }

    router.push("/area-riservata/admin/news");
    router.refresh();
  }

  async function onDelete() {
    if (!isEdit) return;
    const ok = confirm(
      "Cancellare definitivamente questa news? Operazione irreversibile.",
    );
    if (!ok) return;

    setStatus({ type: "loading" });
    const res = await fetch(`/api/admin/news/${initial.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus({ type: "error", msg: data.error ?? "Cancellazione fallita" });
      return;
    }
    router.push("/area-riservata/admin/news");
    router.refresh();
  }

  return (
    <form onSubmit={(e) => onSubmit(e)} className="space-y-8">
      {/* TITLE */}
      <Field label="Titolo" required>
        <input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
          maxLength={200}
          className={inputClass}
        />
      </Field>

      {/* SLUG */}
      <Field
        label="Slug"
        hint="URL-safe. Auto da titolo, puoi sovrascrivere. Minuscole, numeri, trattini."
        required
      >
        <input
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugManuallyEdited(true);
          }}
          required
          pattern="[a-z0-9-]+"
          className={inputClass}
        />
      </Field>

      {/* EXCERPT */}
      <Field
        label="Sommario"
        hint="Visibile nelle card lista e homepage. Max 500 char."
        required
      >
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          rows={3}
          maxLength={500}
          className={`${inputClass} resize-y`}
        />
      </Field>

      {/* COVER IMAGE */}
      <Field label="Immagine copertina" hint="URL pubblica o carica file.">
        <div className="space-y-3">
          <input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
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
          {coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt="Anteprima cover"
              className="max-h-40 border border-white/10"
            />
          )}
        </div>
      </Field>

      {/* BODY + PREVIEW */}
      <Field
        label="Contenuto (Markdown)"
        hint="# titoli · **grassetto** · *corsivo* · [link](url) · ![alt](img-url) · ```code```"
        required
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={20}
            maxLength={50000}
            className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
          />
          <div className="min-h-[300px] bg-bg-soft border border-white/10 px-5 py-4 overflow-auto">
            <div className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-3 pb-2 border-b border-white/5">
              Anteprima
            </div>
            <article className="prose-news">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {body || "_Nulla da mostrare_"}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      </Field>

      {/* PUBLISHED */}
      <Field label="Stato">
        <label className="inline-flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 accent-yellow"
          />
          <span className="font-mono text-xs uppercase tracking-widest text-ink">
            {published ? "Pubblicata" : "Bozza"}
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
  "w-full bg-bg-soft border border-white/10 px-4 py-3 text-ink font-mono text-sm focus:border-yellow focus:outline-none transition-colors";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint mb-2">
        {label}
        {required && <span className="text-yellow ml-1">*</span>}
      </span>
      {children}
      {hint && (
        <span className="block mt-1.5 font-mono text-[9px] uppercase tracking-widest text-ink-faint">
          {hint}
        </span>
      )}
    </label>
  );
}

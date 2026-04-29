"use server";

import { Resend } from "resend";
import { contactInputSchema } from "@/lib/validation";

export type ContactState =
  | null
  | {
      ok: true;
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };

const CONTACT_TO = process.env.EMAIL_TO_CONTACT ?? "info@teamlagang.it";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot — bots fill every field. If "website" has any value, drop silently
  // and pretend success so they don't retry.
  const honey = String(formData.get("website") ?? "").trim();
  if (honey) return { ok: true };

  const parsed = contactInputSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    category: formData.get("category") ?? "",
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Compila correttamente i campi richiesti.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, category, message } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.error("Contact form: missing RESEND_API_KEY or EMAIL_FROM");
    return {
      ok: false,
      error: "Servizio email non configurato. Riprova più tardi.",
    };
  }

  const subject = `Nuovo messaggio dal sito · ${name}`;
  const htmlBody = `
    <p><strong>Da:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
    ${category ? `<p><strong>Categoria di interesse:</strong> ${escapeHtml(category)}</p>` : ""}
    <p><strong>Messaggio:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;
  const textBody = [
    `Da: ${name} <${email}>`,
    category ? `Categoria di interesse: ${category}` : null,
    "",
    "Messaggio:",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: CONTACT_TO,
      replyTo: email,
      subject,
      html: htmlBody,
      text: textBody,
    });
    if (error) {
      console.error("Resend send error", error);
      return {
        ok: false,
        error: "Errore durante l'invio. Riprova tra qualche minuto.",
      };
    }
  } catch (e) {
    console.error("Contact form unexpected error", e);
    return {
      ok: false,
      error: "Errore di rete. Riprova tra qualche minuto.",
    };
  }

  return { ok: true };
}

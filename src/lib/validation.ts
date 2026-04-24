import { z } from "zod";

export const emailSchema = z
  .string()
  .email("Indirizzo email non valido")
  .toLowerCase()
  .trim();

export const tesseraSchema = z
  .string()
  .regex(/^\d{4}$/, "Codice tessera: 4 cifre");

export const passwordSchema = z
  .string()
  .min(8, "Password: minimo 8 caratteri")
  .max(100, "Password troppo lunga");

export const registerSchema = z.object({
  firstName: z.string().min(1, "Nome richiesto").max(100).trim(),
  lastName: z.string().min(1, "Cognome richiesto").max(100).trim(),
  email: emailSchema,
  password: passwordSchema,
  tesseraCode: tesseraSchema,
  consent: z.literal(true, {
    message: "Devi accettare privacy e termini",
  }),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password richiesta"),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "Nome richiesto").max(100).trim(),
  lastName: z.string().min(1, "Cognome richiesto").max(100).trim(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Password attuale richiesta"),
  newPassword: passwordSchema,
});

export const slugSchema = z
  .string()
  .min(1, "Slug richiesto")
  .max(100)
  .regex(/^[a-z0-9-]+$/, "Slug: solo minuscole, numeri, trattini");

export const newsInputSchema = z.object({
  title: z.string().min(1, "Titolo richiesto").max(200).trim(),
  slug: slugSchema,
  excerpt: z.string().min(1, "Sommario richiesto").max(500).trim(),
  body: z.string().min(1, "Contenuto richiesto").max(50000),
  coverImage: z
    .string()
    .url("URL immagine non valido")
    .nullable()
    .optional()
    .or(z.literal("").transform(() => null)),
  published: z.boolean(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type NewsInput = z.infer<typeof newsInputSchema>;

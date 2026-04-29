import { Resend } from "resend";

let cached: Resend | null | undefined;

/**
 * Devuelve el cliente Resend si `RESEND_API_KEY` está seteado, o null.
 * El consumidor decide qué hacer si no hay cliente (típico: log + skip).
 */
export function getResend(): Resend | null {
  if (cached !== undefined) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    cached = null;
    return null;
  }
  cached = new Resend(key);
  return cached;
}

/** Sender por defecto. Sobreescribible con RESEND_FROM. */
export const FROM_DEFAULT =
  process.env.RESEND_FROM || "Atrio <onboarding@resend.dev>";

/** Email del equipo Atrio que recibe avisos cuando no hay agente asignado. */
export const NOTIFICATIONS_EMAIL =
  process.env.NOTIFICATIONS_EMAIL || "izuralucas@gmail.com";

/** URL base del sitio para armar links absolutos en los mails. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://atrio-omega.vercel.app";

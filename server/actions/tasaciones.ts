"use server";

import { createClient } from "@/lib/supabase/server";
import { tasacionSchema, type TasacionInput } from "@/lib/schemas/tasacion";
import { notifyTasacionRequested } from "@/lib/email/notifications";

export type CreateTasacionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createTasacion(
  input: TasacionInput
): Promise<CreateTasacionResult> {
  const parsed = tasacionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error:
        parsed.error.issues[0]?.message ?? "Revisá los datos del formulario.",
    };
  }

  const supabase = await createClient();
  const ambientes = parsed.data.ambientes
    ? parseInt(parsed.data.ambientes, 10)
    : null;
  const m2 = parsed.data.m2 ? parseInt(parsed.data.m2, 10) : null;

  const { error } = await supabase.from("tasaciones").insert({
    nombre: parsed.data.nombre,
    email: parsed.data.email,
    telefono: parsed.data.telefono,
    direccion: parsed.data.direccion,
    tipo: parsed.data.tipo,
    ambientes,
    m2,
    comentarios: parsed.data.comentarios ?? null,
  });

  if (error) {
    console.error("createTasacion insert error:", error.message);
    return {
      ok: false,
      error: "No pudimos guardar tu solicitud. Probá en unos minutos.",
    };
  }

  try {
    await notifyTasacionRequested({
      nombre: parsed.data.nombre,
      email: parsed.data.email,
      telefono: parsed.data.telefono,
      direccion: parsed.data.direccion,
      tipo: parsed.data.tipo,
      ambientes,
      m2,
      comentarios: parsed.data.comentarios ?? null,
    });
  } catch (err) {
    console.error("createTasacion email error:", err);
  }

  return { ok: true };
}

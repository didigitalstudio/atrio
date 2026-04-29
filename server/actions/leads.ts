"use server";

import { createClient } from "@/lib/supabase/server";
import { leadSchema, type LeadInput } from "@/lib/schemas/lead";

export type CreateLeadResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createLead(input: LeadInput): Promise<CreateLeadResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Revisá los datos del formulario.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    propiedad_id: parsed.data.propiedadId ?? null,
    nombre: parsed.data.nombre,
    email: parsed.data.email,
    telefono: parsed.data.telefono,
    mensaje: parsed.data.mensaje,
    canal: "web",
  });

  if (error) {
    console.error("createLead insert error:", error.message);
    return {
      ok: false,
      error: "No pudimos guardar tu mensaje. Probá en unos minutos.",
    };
  }

  return { ok: true };
}

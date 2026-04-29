"use server";

import { createClient } from "@/lib/supabase/server";
import { leadSchema, type LeadInput } from "@/lib/schemas/lead";
import { notifyLeadCreated } from "@/lib/email/notifications";

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

  // Mails: aviso al agente asignado de la propiedad (si hay) + confirmación al usuario.
  try {
    let propiedad: { titulo: string; slug: string } | null = null;
    let agentEmail: string | null = null;

    if (parsed.data.propiedadId) {
      const { data } = await supabase
        .from("propiedades")
        .select("titulo, slug, agente:agentes(email)")
        .eq("id", parsed.data.propiedadId)
        .maybeSingle();
      if (data) {
        propiedad = { titulo: data.titulo, slug: data.slug };
        const agente = data.agente as { email: string } | null;
        agentEmail = agente?.email ?? null;
      }
    }

    await notifyLeadCreated({
      lead: { ...parsed.data, canal: "web" },
      propiedad,
      agentEmail,
    });
  } catch (err) {
    console.error("createLead email error:", err);
  }

  return { ok: true };
}

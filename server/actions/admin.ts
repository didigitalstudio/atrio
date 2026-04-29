"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { Database } from "@/lib/supabase/types";
import {
  propiedadSchema,
  type PropiedadInput,
} from "@/lib/schemas/propiedad";
import { agenteSchema, type AgenteInput } from "@/lib/schemas/agente";
import {
  notifyClientPropertySubmitted,
  notifyPropertyApproved,
  notifyPropertyRejected,
} from "@/lib/email/notifications";

type PropiedadUpdate = Database["public"]["Tables"]["propiedades"]["Update"];

/** Para approve/reject: levanta email del submitter via service role. */
async function getSubmitterEmailFromPropiedadId(
  id: string
): Promise<string | null> {
  const supabase = await createClient();
  const { data: prop } = await supabase
    .from("propiedades")
    .select("submitted_by")
    .eq("id", id)
    .maybeSingle();
  if (!prop?.submitted_by) return null;

  try {
    const service = createServiceClient();
    const { data, error } = await service.auth.admin.getUserById(prop.submitted_by);
    if (error || !data.user?.email) return null;
    return data.user.email;
  } catch (err) {
    console.error("getSubmitterEmailFromPropiedadId error:", err);
    return null;
  }
}

const ESTADO_LEAD = [
  "nuevo",
  "contactado",
  "calificado",
  "descartado",
  "convertido",
] as const;

const ESTADO_TASACION = [
  "solicitada",
  "en_proceso",
  "completada",
  "descartada",
] as const;

const updateLeadSchema = z.object({
  id: z.string().uuid(),
  estado: z.enum(ESTADO_LEAD),
});

const updateTasacionSchema = z.object({
  id: z.string().uuid(),
  estado: z.enum(ESTADO_TASACION),
});

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateLeadStatus(
  formData: FormData
): Promise<ActionResult> {
  const parsed = updateLeadSchema.safeParse({
    id: formData.get("id"),
    estado: formData.get("estado"),
  });
  if (!parsed.success) return { ok: false, error: "Estado inválido." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ estado: parsed.data.estado })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("updateLeadStatus error:", error.message);
    return { ok: false, error: "No pudimos actualizar el lead." };
  }
  revalidatePath("/admin/leads");
  return { ok: true };
}

export async function updateTasacionStatus(
  formData: FormData
): Promise<ActionResult> {
  const parsed = updateTasacionSchema.safeParse({
    id: formData.get("id"),
    estado: formData.get("estado"),
  });
  if (!parsed.success) return { ok: false, error: "Estado inválido." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("tasaciones")
    .update({ estado: parsed.data.estado })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("updateTasacionStatus error:", error.message);
    return { ok: false, error: "No pudimos actualizar la tasación." };
  }
  revalidatePath("/admin/tasaciones");
  return { ok: true };
}

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(base: string): Promise<string> {
  const supabase = await createClient();
  let slug = base;
  let i = 2;
  while (true) {
    const { data, error } = await supabase
      .from("propiedades")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (error) {
      console.error("uniqueSlug check error:", error.message);
      return `${base}-${Date.now()}`;
    }
    if (!data) return slug;
    slug = `${base}-${i}`;
    i++;
    if (i > 50) return `${base}-${Date.now()}`;
  }
}

export type CreatePropiedadResult =
  | { ok: true; slug: string; pendingReview: boolean }
  | { ok: false; error: string };

export async function createPropiedad(
  input: PropiedadInput
): Promise<CreatePropiedadResult> {
  const parsed = propiedadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Revisá los datos.",
    };
  }

  const supabase = await createClient();

  // ¿Quién está creando esto? Si es agente activo → publicación interna
  // (estado='borrador'). Si es cliente sin agente → submission a revisar
  // (estado='en_revision', agente_id=null, submitted_by=user.id).
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Tenés que iniciar sesión." };
  }

  const { data: agente } = await supabase
    .from("agentes")
    .select("id")
    .eq("user_id", user.id)
    .eq("activo", true)
    .maybeSingle();

  const isAgentSubmission = !!agente;

  // Trae el barrio para el slug + nombre (para el mail).
  const { data: zona } = await supabase
    .from("zonas")
    .select("nombre, slug")
    .eq("id", parsed.data.zonaId)
    .maybeSingle();

  const baseSlug = slugify(`${parsed.data.titulo}-${zona?.slug ?? ""}`);
  const slug = await uniqueSlug(baseSlug || `propiedad-${Date.now()}`);

  const features = (parsed.data.features ?? "")
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  const fotos = parsed.data.fotoUrl
    ? [{ url: parsed.data.fotoUrl, alt: parsed.data.titulo, orden: 0 }]
    : [];

  const intOrNull = (v?: string) =>
    v && /^\d+$/.test(v) ? parseInt(v, 10) : null;

  const { error } = await supabase.from("propiedades").insert({
    titulo: parsed.data.titulo,
    slug,
    descripcion: parsed.data.descripcion ?? null,
    tipo: parsed.data.tipo,
    operacion: parsed.data.operacion,
    estado: isAgentSubmission ? "borrador" : "en_revision",
    direccion: parsed.data.direccion,
    zona_id: parsed.data.zonaId,
    agente_id: isAgentSubmission ? agente!.id : null,
    submitted_by: user.id,
    ambientes: parseInt(parsed.data.ambientes, 10),
    dormitorios: intOrNull(parsed.data.dormitorios) ?? 0,
    banos: intOrNull(parsed.data.banos) ?? 0,
    m2_cubiertos: intOrNull(parsed.data.m2Cubiertos),
    m2_totales: intOrNull(parsed.data.m2Totales),
    antiguedad: intOrNull(parsed.data.antiguedad),
    precio: parseInt(parsed.data.precio, 10),
    moneda: parsed.data.moneda,
    expensas: intOrNull(parsed.data.expensas),
    expensas_moneda: parsed.data.expensasMoneda ?? null,
    apto_credito: parsed.data.aptoCredito ?? false,
    features: features as unknown as never,
    fotos: fotos as unknown as never,
  });

  if (error) {
    console.error("createPropiedad insert error:", error.message);
    return { ok: false, error: "No pudimos guardar la propiedad." };
  }

  // Si es submission de cliente, mandar mails (admin + confirmación al cliente).
  if (!isAgentSubmission && user.email) {
    try {
      const submitterName =
        (user.user_metadata as { nombre?: string } | undefined)?.nombre ?? null;
      await notifyClientPropertySubmitted({
        titulo: parsed.data.titulo,
        direccion: parsed.data.direccion,
        zona: zona?.nombre ?? "—",
        submitterEmail: user.email,
        submitterName,
      });
    } catch (err) {
      console.error("createPropiedad email error:", err);
    }
  }

  revalidatePath("/admin/propiedades");
  return { ok: true, slug, pendingReview: !isAgentSubmission };
}

const updatePropiedadEstadoSchema = z.object({
  id: z.string().uuid(),
  estado: z.enum([
    "borrador",
    "activa",
    "reservada",
    "cerrada",
    "despublicada",
  ]),
});

export async function updatePropiedadEstado(
  formData: FormData
): Promise<ActionResult> {
  const parsed = updatePropiedadEstadoSchema.safeParse({
    id: formData.get("id"),
    estado: formData.get("estado"),
  });
  if (!parsed.success) return { ok: false, error: "Estado inválido." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("propiedades")
    .update({ estado: parsed.data.estado })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("updatePropiedadEstado error:", error.message);
    return { ok: false, error: "No pudimos actualizar la propiedad." };
  }
  revalidatePath("/admin/propiedades");
  return { ok: true };
}

// ---------- agentes ----------

export async function createAgente(
  input: AgenteInput
): Promise<ActionResult> {
  const parsed = agenteSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Revisá los datos.",
    };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("agentes").insert({
    nombre: parsed.data.nombre,
    email: parsed.data.email,
    telefono: parsed.data.telefono || null,
    whatsapp: parsed.data.whatsapp || null,
    matricula: parsed.data.matricula || null,
    foto_url: parsed.data.fotoUrl || null,
    bio: parsed.data.bio || null,
    activo: true,
  });

  if (error) {
    console.error("createAgente insert error:", error.message);
    return { ok: false, error: "No pudimos crear el agente." };
  }
  revalidatePath("/admin/equipo");
  return { ok: true };
}

const toggleActivoSchema = z.object({
  id: z.string().uuid(),
  activo: z.enum(["true", "false"]),
});

export async function toggleAgenteActivo(
  formData: FormData
): Promise<ActionResult> {
  const parsed = toggleActivoSchema.safeParse({
    id: formData.get("id"),
    activo: formData.get("activo"),
  });
  if (!parsed.success) return { ok: false, error: "Datos inválidos." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("agentes")
    .update({ activo: parsed.data.activo === "true" })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("toggleAgenteActivo error:", error.message);
    return { ok: false, error: "No pudimos actualizar el agente." };
  }
  revalidatePath("/admin/equipo");
  return { ok: true };
}

// ---------- review queue (client submissions) ----------

const reviewIdSchema = z.object({ id: z.string().uuid() });

/** Aprueba una submission: estado=activa + asigna agente al admin actual. */
export async function approvePropiedad(
  formData: FormData
): Promise<ActionResult> {
  const parsed = reviewIdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return { ok: false, error: "Id inválido." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Iniciá sesión primero." };

  const { data: agente } = await supabase
    .from("agentes")
    .select("id")
    .eq("user_id", user.id)
    .eq("activo", true)
    .maybeSingle();
  if (!agente) {
    return {
      ok: false,
      error: "Solo agentes activos pueden aprobar propiedades.",
    };
  }

  // Antes de actualizar, levantamos titulo/slug/submitter para el mail.
  const { data: before } = await supabase
    .from("propiedades")
    .select("titulo, slug")
    .eq("id", parsed.data.id)
    .maybeSingle();

  const { error } = await supabase
    .from("propiedades")
    .update({ estado: "activa", agente_id: agente.id })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("approvePropiedad error:", error.message);
    return { ok: false, error: "No pudimos aprobar la propiedad." };
  }

  // Aviso al submitter (cliente) que su propiedad ya está online.
  if (before) {
    try {
      const email = await getSubmitterEmailFromPropiedadId(parsed.data.id);
      if (email) {
        await notifyPropertyApproved({
          titulo: before.titulo,
          slug: before.slug,
          submitterEmail: email,
        });
      }
    } catch (err) {
      console.error("approvePropiedad email error:", err);
    }
  }

  revalidatePath("/admin/propiedades");
  revalidatePath("/admin");
  return { ok: true };
}

/** Rechaza una submission: estado=despublicada (recuperable después). */
export async function rejectPropiedad(
  formData: FormData
): Promise<ActionResult> {
  const parsed = reviewIdSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return { ok: false, error: "Id inválido." };

  const supabase = await createClient();

  const { data: before } = await supabase
    .from("propiedades")
    .select("titulo")
    .eq("id", parsed.data.id)
    .maybeSingle();

  const { error } = await supabase
    .from("propiedades")
    .update({ estado: "despublicada" })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("rejectPropiedad error:", error.message);
    return { ok: false, error: "No pudimos rechazar la propiedad." };
  }

  if (before) {
    try {
      const email = await getSubmitterEmailFromPropiedadId(parsed.data.id);
      if (email) {
        await notifyPropertyRejected({
          titulo: before.titulo,
          submitterEmail: email,
        });
      }
    } catch (err) {
      console.error("rejectPropiedad email error:", err);
    }
  }

  revalidatePath("/admin/propiedades");
  revalidatePath("/admin");
  return { ok: true };
}

// ---------- propiedades: full update (edit page) ----------

export async function updatePropiedad(
  id: string,
  input: PropiedadInput
): Promise<ActionResult> {
  const parsed = propiedadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Revisá los datos.",
    };
  }
  const supabase = await createClient();

  const features = (parsed.data.features ?? "")
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  const intOrNull = (v?: string) =>
    v && /^\d+$/.test(v) ? parseInt(v, 10) : null;

  // Conserva foto principal si está vacía no la cambia; si tiene URL nueva, reemplaza
  const updates: PropiedadUpdate = {
    titulo: parsed.data.titulo,
    descripcion: parsed.data.descripcion ?? null,
    tipo: parsed.data.tipo,
    operacion: parsed.data.operacion,
    direccion: parsed.data.direccion,
    zona_id: parsed.data.zonaId,
    ambientes: parseInt(parsed.data.ambientes, 10),
    dormitorios: intOrNull(parsed.data.dormitorios) ?? 0,
    banos: intOrNull(parsed.data.banos) ?? 0,
    m2_cubiertos: intOrNull(parsed.data.m2Cubiertos),
    m2_totales: intOrNull(parsed.data.m2Totales),
    antiguedad: intOrNull(parsed.data.antiguedad),
    precio: parseInt(parsed.data.precio, 10),
    moneda: parsed.data.moneda,
    expensas: intOrNull(parsed.data.expensas),
    expensas_moneda: parsed.data.expensasMoneda ?? null,
    apto_credito: parsed.data.aptoCredito ?? false,
    features: features as unknown as never,
  };
  if (parsed.data.fotoUrl) {
    updates.fotos = [
      { url: parsed.data.fotoUrl, alt: parsed.data.titulo, orden: 0 },
    ] as unknown as never;
  }

  const { error } = await supabase
    .from("propiedades")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("updatePropiedad error:", error.message);
    return { ok: false, error: "No pudimos actualizar la propiedad." };
  }
  revalidatePath("/admin/propiedades");
  revalidatePath(`/admin/propiedades/${id}/edit`);
  return { ok: true };
}

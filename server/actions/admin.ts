"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  propiedadSchema,
  type PropiedadInput,
} from "@/lib/schemas/propiedad";

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
  | { ok: true; slug: string }
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

  // Trae el barrio para el slug
  const { data: zona } = await supabase
    .from("zonas")
    .select("slug")
    .eq("id", parsed.data.zonaId)
    .maybeSingle();

  // Resolver agente_id: por ahora, el primer agente activo (TODO: linkear por user_id).
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let agenteId: string | null = null;
  if (user) {
    const { data: byUser } = await supabase
      .from("agentes")
      .select("id")
      .eq("user_id", user.id)
      .eq("activo", true)
      .maybeSingle();
    agenteId = byUser?.id ?? null;
  }
  if (!agenteId) {
    const { data: fallback } = await supabase
      .from("agentes")
      .select("id")
      .eq("activo", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    agenteId = fallback?.id ?? null;
  }
  if (!agenteId) {
    return {
      ok: false,
      error: "No hay agentes activos cargados. Cargá uno antes de publicar.",
    };
  }

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
    estado: "borrador",
    direccion: parsed.data.direccion,
    zona_id: parsed.data.zonaId,
    agente_id: agenteId,
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

  revalidatePath("/admin/propiedades");
  return { ok: true, slug };
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

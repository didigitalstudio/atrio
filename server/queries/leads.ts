import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
export type LeadEstado = Database["public"]["Enums"]["estado_lead"];

export type LeadWithProp = LeadRow & {
  propiedad: { titulo: string; slug: string } | null;
};

export async function getLeads(filter?: {
  estado?: LeadEstado;
}): Promise<LeadWithProp[]> {
  const supabase = await createClient();
  let q = supabase
    .from("leads")
    .select("*, propiedad:propiedades(titulo, slug)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (filter?.estado) q = q.eq("estado", filter.estado);

  const { data, error } = await q;
  if (error) {
    console.error("getLeads error:", error.message);
    return [];
  }
  return (data ?? []) as LeadWithProp[];
}

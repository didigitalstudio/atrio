import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type TasacionRow = Database["public"]["Tables"]["tasaciones"]["Row"];
export type TasacionEstado = Database["public"]["Enums"]["estado_tasacion"];

export async function getTasaciones(filter?: {
  estado?: TasacionEstado;
}): Promise<TasacionRow[]> {
  const supabase = await createClient();
  let q = supabase
    .from("tasaciones")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (filter?.estado) q = q.eq("estado", filter.estado);

  const { data, error } = await q;
  if (error) {
    console.error("getTasaciones error:", error.message);
    return [];
  }
  return data ?? [];
}

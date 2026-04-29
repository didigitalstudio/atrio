import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type AgenteResumen = Pick<
  Database["public"]["Tables"]["agentes"]["Row"],
  | "id"
  | "nombre"
  | "email"
  | "telefono"
  | "whatsapp"
  | "foto_url"
  | "matricula"
  | "bio"
>;

export async function getAgentes(): Promise<AgenteResumen[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agentes")
    .select("id, nombre, email, telefono, whatsapp, foto_url, matricula, bio")
    .eq("activo", true)
    .order("nombre", { ascending: true });

  if (error) {
    console.error("getAgentes error:", error.message);
    return [];
  }
  return data ?? [];
}

export type AgenteAdminRow = Database["public"]["Tables"]["agentes"]["Row"];

/** Admin: trae todos los agentes (activos e inactivos). */
export async function getAllAgentes(): Promise<AgenteAdminRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agentes")
    .select("*")
    .order("activo", { ascending: false })
    .order("nombre", { ascending: true });

  if (error) {
    console.error("getAllAgentes error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getAgenteById(
  id: string
): Promise<AgenteResumen | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("agentes")
    .select("id, nombre, email, telefono, whatsapp, foto_url, matricula, bio")
    .eq("id", id)
    .eq("activo", true)
    .maybeSingle();

  if (error) {
    console.error("getAgenteById error:", error.message);
    return null;
  }
  return data;
}

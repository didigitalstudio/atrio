import { createClient } from "@/lib/supabase/server";

/**
 * Devuelve el id del agente activo asociado al user logueado, o null si
 * no es agente (cliente común). Llamadas: layout admin, createPropiedad.
 */
export async function getCurrentAgenteId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("agentes")
    .select("id")
    .eq("user_id", user.id)
    .eq("activo", true)
    .maybeSingle();

  return data?.id ?? null;
}

export async function isAgent(): Promise<boolean> {
  return (await getCurrentAgenteId()) !== null;
}

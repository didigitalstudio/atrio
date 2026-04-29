import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import type { Foto, Propiedad } from "@/lib/types";

type PropiedadRow = Database["public"]["Tables"]["propiedades"]["Row"];
type ZonaResumenRow = Pick<
  Database["public"]["Tables"]["zonas"]["Row"],
  "id" | "nombre" | "slug"
>;

type PropiedadConZona = PropiedadRow & {
  zona: ZonaResumenRow | null;
};

export async function getFeaturedProperties(): Promise<Propiedad[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("propiedades")
    .select("*, zona:zonas(id, nombre, slug)")
    .eq("destacada", true)
    .eq("estado", "activa")
    .order("updated_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("getFeaturedProperties error:", error.message);
    return [];
  }

  return (data ?? []).map(toPropiedad);
}

function toPropiedad(row: PropiedadConZona): Propiedad {
  return {
    id: row.id,
    titulo: row.titulo,
    slug: row.slug,
    descripcion: row.descripcion,
    tipo: row.tipo,
    operacion: row.operacion,
    estado: row.estado,
    direccion: row.direccion,
    zona: row.zona
      ? { id: row.zona.id, nombre: row.zona.nombre, slug: row.zona.slug }
      : { id: "", nombre: "Sin zona", slug: "sin-zona" },
    ambientes: row.ambientes ?? 0,
    dormitorios: row.dormitorios ?? 0,
    banos: row.banos ?? 0,
    m2_cubiertos: numOrNull(row.m2_cubiertos),
    m2_totales: numOrNull(row.m2_totales),
    m2_terraza: numOrNull(row.m2_terraza),
    antiguedad: row.antiguedad,
    precio: Number(row.precio),
    moneda: row.moneda,
    expensas: numOrNull(row.expensas),
    expensas_moneda: row.expensas_moneda,
    abl_incluido: row.abl_incluido,
    apto_credito: row.apto_credito,
    destacada: row.destacada,
    features: Array.isArray(row.features) ? (row.features as string[]) : [],
    fotos: Array.isArray(row.fotos) ? (row.fotos as Foto[]) : [],
    agente_id: row.agente_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function numOrNull(v: number | string | null): number | null {
  if (v === null || v === undefined) return null;
  return typeof v === "number" ? v : Number(v);
}

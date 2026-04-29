import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import type {
  Foto,
  Moneda,
  Operacion,
  Propiedad,
  TipoPropiedad,
  ZonaResumen,
} from "@/lib/types";

type PropiedadRow = Database["public"]["Tables"]["propiedades"]["Row"];
type ZonaResumenRow = Pick<
  Database["public"]["Tables"]["zonas"]["Row"],
  "id" | "nombre" | "slug"
>;

type PropiedadConZona = PropiedadRow & {
  zona: ZonaResumenRow | null;
};

export const DEFAULT_PAGE_SIZE = 12;

export type PropertyFilters = {
  operacion?: Operacion;
  tipo?: TipoPropiedad;
  zonaSlug?: string;
  ambientesMin?: number;
  precioMin?: number;
  precioMax?: number;
  moneda?: Moneda;
  page?: number;
  pageSize?: number;
};

export type PropertiesPage = {
  data: Propiedad[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
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

export async function getProperties(
  filters: PropertyFilters = {}
): Promise<PropertiesPage> {
  const supabase = await createClient();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("propiedades")
    .select("*, zona:zonas!inner(id, nombre, slug)", { count: "exact" })
    .eq("estado", "activa");

  if (filters.operacion) query = query.eq("operacion", filters.operacion);
  if (filters.tipo) query = query.eq("tipo", filters.tipo);
  if (filters.moneda) query = query.eq("moneda", filters.moneda);
  if (filters.ambientesMin !== undefined)
    query = query.gte("ambientes", filters.ambientesMin);
  if (filters.precioMin !== undefined)
    query = query.gte("precio", filters.precioMin);
  if (filters.precioMax !== undefined)
    query = query.lte("precio", filters.precioMax);
  if (filters.zonaSlug) query = query.eq("zona.slug", filters.zonaSlug);

  query = query
    .order("destacada", { ascending: false })
    .order("updated_at", { ascending: false })
    .range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("getProperties error:", error.message);
    return { data: [], total: 0, page, pageSize, totalPages: 0 };
  }

  const total = count ?? 0;
  return {
    data: (data ?? []).map(toPropiedad),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getPropertyBySlug(
  slug: string
): Promise<Propiedad | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("propiedades")
    .select("*, zona:zonas(id, nombre, slug)")
    .eq("slug", slug)
    .in("estado", ["activa", "reservada"])
    .maybeSingle();

  if (error) {
    console.error("getPropertyBySlug error:", error.message);
    return null;
  }
  if (!data) return null;
  return toPropiedad(data);
}

export async function getZonas(): Promise<ZonaResumen[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("zonas")
    .select("id, nombre, slug")
    .order("orden", { ascending: true })
    .order("nombre", { ascending: true });

  if (error) {
    console.error("getZonas error:", error.message);
    return [];
  }
  return data ?? [];
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

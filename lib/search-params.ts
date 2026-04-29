import type { Moneda, Operacion, TipoPropiedad } from "@/lib/types";

export const TIPOS: TipoPropiedad[] = [
  "departamento",
  "casa",
  "ph",
  "terreno",
  "local",
  "oficina",
  "cochera",
  "emprendimiento",
];

export const OPERACIONES: Operacion[] = [
  "venta",
  "alquiler",
  "alquiler_temporario",
];

export const MONEDAS: Moneda[] = ["USD", "ARS"];

export type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseInt0(value: string | string[] | undefined): number | undefined {
  if (typeof value !== "string" || value === "") return undefined;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function parseEnum<T extends string>(
  value: string | string[] | undefined,
  allowed: readonly T[]
): T | undefined {
  if (typeof value !== "string") return undefined;
  return (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

export function parseString(
  value: string | string[] | undefined
): string | undefined {
  return typeof value === "string" && value !== "" ? value : undefined;
}

export type UserPropertyFilters = {
  operacion?: Operacion;
  zonaSlug?: string;
  tipo?: TipoPropiedad;
  ambientesMin?: number;
  precioMin?: number;
  precioMax?: number;
  moneda?: Moneda;
  page: number;
};

export function parseUserPropertyFilters(
  sp: RawSearchParams
): UserPropertyFilters {
  return {
    operacion: parseEnum<Operacion>(sp.op, OPERACIONES),
    zonaSlug: parseString(sp.zona),
    tipo: parseEnum<TipoPropiedad>(sp.tipo, TIPOS),
    ambientesMin: parseInt0(sp.ambientes_min),
    precioMin: parseInt0(sp.precio_min),
    precioMax: parseInt0(sp.precio_max),
    moneda: parseEnum<Moneda>(sp.moneda, MONEDAS),
    page: parseInt0(sp.page) ?? 1,
  };
}

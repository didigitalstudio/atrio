// Tipos de dominio compartidos.
// Cuando el proyecto Supabase esté generando types automáticos,
// los tipos de DB van a `lib/supabase/types.ts` y los de acá se
// derivan/extienden de aquellos para representar el shape "rich"
// que consume la UI (con joins ya resueltos).

export type Operacion = "venta" | "alquiler" | "alquiler_temporario";

export type TipoPropiedad =
  | "departamento"
  | "casa"
  | "ph"
  | "terreno"
  | "local"
  | "oficina"
  | "cochera"
  | "emprendimiento";

export type EstadoPropiedad =
  | "borrador"
  | "en_revision"
  | "activa"
  | "reservada"
  | "cerrada"
  | "despublicada";

export type Moneda = "USD" | "ARS";

export type Foto = {
  url: string;
  alt: string;
  orden: number;
};

export type ZonaResumen = {
  id: string;
  nombre: string;
  slug: string;
};

export type Propiedad = {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string | null;
  tipo: TipoPropiedad;
  operacion: Operacion;
  estado: EstadoPropiedad;
  direccion: string;
  zona: ZonaResumen;
  ambientes: number;
  dormitorios: number;
  banos: number;
  m2_cubiertos: number | null;
  m2_totales: number | null;
  m2_terraza: number | null;
  antiguedad: number | null;
  precio: number;
  moneda: Moneda;
  expensas: number | null;
  expensas_moneda: Moneda | null;
  abl_incluido: boolean;
  apto_credito: boolean;
  destacada: boolean;
  features: string[];
  fotos: Foto[];
  agente_id: string | null;
  created_at: string;
  updated_at: string;
};

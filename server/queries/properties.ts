import type { Propiedad } from "@/lib/types";

// MOCK de propiedades destacadas. Se reemplaza por una query a Supabase
// cuando el schema esté aplicado. El shape ya es el final, así que el
// reemplazo no debería requerir refactor en los componentes.
const PROPIEDADES_MOCK: Propiedad[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    titulo: "Piso alto con balcón aterrazado",
    slug: "piso-alto-balcon-aterrazado-caballito",
    descripcion:
      "Departamento luminoso de tres ambientes en piso alto, con balcón aterrazado al frente y vista despejada.",
    tipo: "departamento",
    operacion: "venta",
    estado: "activa",
    direccion: "Av. Rivadavia al 5400",
    zona: {
      id: "zone-caballito",
      nombre: "Caballito",
      slug: "caballito",
    },
    ambientes: 3,
    dormitorios: 2,
    banos: 1,
    m2_cubiertos: 68,
    m2_totales: 72,
    m2_terraza: 4,
    antiguedad: 12,
    precio: 165000,
    moneda: "USD",
    expensas: 285000,
    expensas_moneda: "ARS",
    abl_incluido: false,
    apto_credito: true,
    destacada: true,
    features: ["balcon", "luminoso", "vista_despejada"],
    fotos: [
      {
        url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=80",
        alt: "Piso alto con balcón aterrazado en Caballito",
        orden: 0,
      },
    ],
    agente_id: "agent-mock-1",
    created_at: "2026-04-22T10:00:00Z",
    updated_at: "2026-04-22T10:00:00Z",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    titulo: "Casa con jardín y quincho",
    slug: "casa-jardin-quincho-villa-devoto",
    descripcion:
      "Casa de 4 ambientes con jardín al fondo, quincho con parrilla y cochera para dos autos.",
    tipo: "casa",
    operacion: "alquiler",
    estado: "activa",
    direccion: "Mercedes 2300",
    zona: {
      id: "zone-villa-devoto",
      nombre: "Villa Devoto",
      slug: "villa-devoto",
    },
    ambientes: 4,
    dormitorios: 3,
    banos: 2,
    m2_cubiertos: 140,
    m2_totales: 220,
    m2_terraza: null,
    antiguedad: 35,
    precio: 850000,
    moneda: "ARS",
    expensas: null,
    expensas_moneda: null,
    abl_incluido: true,
    apto_credito: false,
    destacada: true,
    features: ["jardin", "quincho", "cochera", "parrilla"],
    fotos: [
      {
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80",
        alt: "Casa con jardín y quincho en Villa Devoto",
        orden: 0,
      },
    ],
    agente_id: "agent-mock-2",
    created_at: "2026-04-20T14:00:00Z",
    updated_at: "2026-04-20T14:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    titulo: "Monoambiente reciclado",
    slug: "monoambiente-reciclado-almagro",
    descripcion:
      "Monoambiente totalmente reciclado a nuevo, cocina integrada y baño completo.",
    tipo: "departamento",
    operacion: "venta",
    estado: "activa",
    direccion: "Bulnes 1100",
    zona: {
      id: "zone-almagro",
      nombre: "Almagro",
      slug: "almagro",
    },
    ambientes: 1,
    dormitorios: 0,
    banos: 1,
    m2_cubiertos: 38,
    m2_totales: 38,
    m2_terraza: null,
    antiguedad: 50,
    precio: 92500,
    moneda: "USD",
    expensas: 120000,
    expensas_moneda: "ARS",
    abl_incluido: false,
    apto_credito: true,
    destacada: true,
    features: ["reciclado", "cocina_integrada"],
    fotos: [
      {
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80",
        alt: "Monoambiente reciclado en Almagro",
        orden: 0,
      },
    ],
    agente_id: "agent-mock-1",
    created_at: "2026-04-25T09:30:00Z",
    updated_at: "2026-04-25T09:30:00Z",
  },
];

export async function getFeaturedProperties(): Promise<Propiedad[]> {
  return PROPIEDADES_MOCK;
}

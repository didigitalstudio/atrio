// Mapeo de keys snake_case (como vienen guardadas en propiedades.features
// jsonb) a labels lindos en español argentino para mostrar en la UI.
//
// Si una key no está en el mapa, formatFeature() la imprime capitalizando
// y reemplazando guiones bajos por espacios — fallback razonable mientras
// la sumamos al diccionario.

export const FEATURE_LABELS: Record<string, string> = {
  // Aptos
  apto_profesional: "Apto profesional",
  apto_mascotas: "Apto mascotas",
  apto_oficina: "Apto oficina",

  // Amenities (edificio)
  amenities: "Amenities completos",
  pileta: "Pileta",
  pileta_climatizada: "Pileta climatizada",
  gimnasio: "Gimnasio",
  sum: "SUM",
  solarium: "Solarium",
  seguridad_24: "Seguridad 24 hs",
  laundry: "Laundry",
  bicicletero: "Bicicletero",
  coworking: "Espacio coworking",
  spa: "Spa",
  sala_juegos: "Sala de juegos",

  // Outdoor (unidad)
  balcon: "Balcón",
  balcon_frances: "Balcón francés",
  terraza: "Terraza propia",
  patio: "Patio",
  jardin: "Jardín",
  parrilla: "Parrilla",
  quincho: "Quincho",

  // Comodidades
  cochera: "Cochera",
  cochera_doble: "Cochera doble",
  baulera: "Baulera",
  dependencia: "Dependencia de servicio",
  vestidor: "Vestidor",
  placards_empotrados: "Placards empotrados",
  lavadero: "Lavadero",

  // Instalaciones
  aire_acondicionado: "Aire acondicionado",
  calefaccion_central: "Calefacción central",
  losa_radiante: "Losa radiante",
  agua_caliente_central: "Agua caliente central",
  hogar: "Hogar a leña",

  // Cocina
  cocina_integrada: "Cocina integrada",
  cocina_isla: "Cocina con isla",
  desayunador: "Desayunador",

  // Estado
  a_estrenar: "A estrenar",
  reciclado: "Reciclado a nuevo",
  impecable: "Impecable",

  // Características
  luminoso: "Muy luminoso",
  vista_abierta: "Vista abierta",
  vista_despejada: "Vista despejada",
  vista_plaza: "Vista a la plaza",
  contrafrente: "Contrafrente",
  piso_alto: "Piso alto",
  techos_altos: "Techos altos",
  pinotea: "Pisos de pinotea",
  pisos_madera: "Pisos de madera",
  parquet: "Parquet",

  // Conectividad
  internet_fibra: "Internet por fibra",

  // Otros
  amoblado: "Amoblado",
  sin_expensas: "Sin expensas",
  planta_baja: "Planta baja",
  cerca_subte: "Cerca del subte",
  senorial: "Edificio señorial",
};

export function formatFeature(key: string): string {
  return (
    FEATURE_LABELS[key] ??
    key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

// Subset de features que merecen ser destacadas como banners/badges
// arriba de las chips genéricas.
export const PERK_FEATURES = [
  "apto_profesional",
  "apto_mascotas",
  "amenities",
] as const;

export type PerkFeature = (typeof PERK_FEATURES)[number];

export function isPerkFeature(key: string): key is PerkFeature {
  return (PERK_FEATURES as readonly string[]).includes(key);
}

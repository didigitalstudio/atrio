import { z } from "zod";

export const TIPOS_PROPIEDAD = [
  "departamento",
  "casa",
  "ph",
  "terreno",
  "local",
  "oficina",
  "cochera",
  "emprendimiento",
] as const;

export const OPERACIONES = [
  "venta",
  "alquiler",
  "alquiler_temporario",
] as const;

export const MONEDAS = ["USD", "ARS"] as const;

const optionalIntString = (min: number, max: number, msg: string) =>
  z
    .string()
    .optional()
    .refine((v) => !v || /^\d+$/.test(v), "Solo números enteros.")
    .refine(
      (v) => {
        if (!v) return true;
        const n = parseInt(v, 10);
        return Number.isFinite(n) && n >= min && n <= max;
      },
      msg
    );

export const propiedadSchema = z.object({
  titulo: z.string().min(8, "Mínimo 8 caracteres.").max(180),
  descripcion: z.string().max(4000).optional(),
  tipo: z.enum(TIPOS_PROPIEDAD),
  operacion: z.enum(OPERACIONES),
  direccion: z.string().min(5, "Calle y altura.").max(240),
  zonaId: z.string().uuid("Elegí una zona."),
  ambientes: z
    .string()
    .min(1, "Cantidad de ambientes.")
    .refine((v) => /^\d+$/.test(v), "Solo números.")
    .refine((v) => parseInt(v, 10) >= 1 && parseInt(v, 10) <= 40, "Entre 1 y 40."),
  dormitorios: optionalIntString(0, 40, "Entre 0 y 40."),
  banos: optionalIntString(0, 20, "Entre 0 y 20."),
  m2Cubiertos: optionalIntString(0, 100000, "Entre 0 y 100.000 m²."),
  m2Totales: optionalIntString(0, 100000, "Entre 0 y 100.000 m²."),
  antiguedad: optionalIntString(0, 200, "Entre 0 y 200 años."),
  precio: z
    .string()
    .min(1, "Precio requerido.")
    .refine((v) => /^\d+$/.test(v), "Solo números.")
    .refine((v) => parseInt(v, 10) > 0, "Mayor a 0."),
  moneda: z.enum(MONEDAS),
  expensas: optionalIntString(0, 100000000, "Número entero."),
  expensasMoneda: z.enum(MONEDAS).optional(),
  aptoCredito: z.boolean().optional(),
  features: z.string().optional(),
  fotoUrl: z
    .string()
    .url("URL inválida.")
    .optional()
    .or(z.literal("")),
});

export type PropiedadInput = z.infer<typeof propiedadSchema>;

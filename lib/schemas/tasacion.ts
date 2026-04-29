import { z } from "zod";

export const TIPOS_TASACION = [
  "departamento",
  "casa",
  "ph",
  "terreno",
  "local",
  "oficina",
] as const;

export type TipoTasacion = (typeof TIPOS_TASACION)[number];

const numericString = (
  min: number,
  max: number,
  rangeMsg: string
) =>
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
      rangeMsg
    );

export const tasacionSchema = z.object({
  nombre: z.string().min(2, "Tu nombre, por favor.").max(120),
  email: z.string().email("Necesitamos un email válido."),
  telefono: z
    .string()
    .min(6, "Necesitamos un teléfono donde llamarte.")
    .max(40),
  direccion: z
    .string()
    .min(5, "Decinos al menos calle y altura.")
    .max(240),
  tipo: z.enum(TIPOS_TASACION),
  ambientes: numericString(1, 40, "Entre 1 y 40 ambientes."),
  m2: numericString(10, 100000, "Entre 10 y 100.000 m²."),
  comentarios: z.string().max(2000).optional(),
});

export type TasacionInput = z.infer<typeof tasacionSchema>;

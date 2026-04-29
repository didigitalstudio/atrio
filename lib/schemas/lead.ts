import { z } from "zod";

export const leadSchema = z.object({
  nombre: z.string().min(2, "Tu nombre, por favor.").max(120),
  email: z.string().email("Necesitamos un email válido."),
  telefono: z
    .string()
    .min(6, "Necesitamos un teléfono donde llamarte.")
    .max(40),
  mensaje: z
    .string()
    .min(10, "Contanos un poco más, así te ayudamos mejor.")
    .max(2000),
  propiedadId: z.string().uuid().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

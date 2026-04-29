import { z } from "zod";

export const agenteSchema = z.object({
  nombre: z.string().min(2, "Nombre y apellido.").max(120),
  email: z.string().email("Email inválido."),
  telefono: z.string().min(6, "Teléfono.").max(40).optional().or(z.literal("")),
  whatsapp: z.string().min(6).max(40).optional().or(z.literal("")),
  matricula: z.string().min(2).max(40).optional().or(z.literal("")),
  fotoUrl: z.string().url("URL inválida.").optional().or(z.literal("")),
  bio: z.string().max(1000).optional().or(z.literal("")),
});

export type AgenteInput = z.infer<typeof agenteSchema>;

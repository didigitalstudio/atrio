import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Necesitamos un email válido."),
  password: z.string().min(8, "Mínimo 8 caracteres."),
});

export type LoginInput = z.infer<typeof loginSchema>;

import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Necesitamos un email válido."),
  password: z.string().min(8, "Mínimo 8 caracteres."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signUpSchema = z
  .object({
    nombre: z.string().min(2, "Tu nombre, por favor.").max(120),
    email: z.string().email("Necesitamos un email válido."),
    password: z.string().min(8, "Mínimo 8 caracteres."),
    passwordConfirm: z.string(),
    esInmobiliaria: z.boolean().optional(),
    nombreInmobiliaria: z.string().max(120).optional(),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "Las contraseñas no coinciden.",
    path: ["passwordConfirm"],
  })
  .refine((d) => !d.esInmobiliaria || (d.nombreInmobiliaria && d.nombreInmobiliaria.trim().length >= 2), {
    message: "Ingresá el nombre de tu inmobiliaria.",
    path: ["nombreInmobiliaria"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

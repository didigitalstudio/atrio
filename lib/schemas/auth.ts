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
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "Las contraseñas no coinciden.",
    path: ["passwordConfirm"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

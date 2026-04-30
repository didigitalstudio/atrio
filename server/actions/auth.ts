"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  signUpSchema,
  type LoginInput,
  type SignUpInput,
} from "@/lib/schemas/auth";

export type AuthResult = { ok: true } | { ok: false; error: string };

export async function signIn(
  input: LoginInput,
  next?: string
): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Revisá los datos.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return { ok: false, error: "Email o contraseña incorrectos." };
  }

  redirect(await safeNext(next, data.user.id));
}

export async function signUp(
  input: SignUpInput,
  next?: string
): Promise<AuthResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Revisá los datos.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { nombre: parsed.data.nombre },
    },
  });

  if (error) {
    return {
      ok: false,
      error: error.message.includes("already")
        ? "Ya existe una cuenta con ese email."
        : "No pudimos crear la cuenta. Probá de nuevo.",
    };
  }

  // Supabase no devuelve error cuando el email ya existe (para no leakear
  // qué cuentas hay registradas). En ese caso, data.user.identities llega
  // vacío. Lo detectamos para mostrar el mensaje correcto en lugar del
  // banner "te mandamos un mail" que confunde al usuario.
  if (data.user && (data.user.identities?.length ?? 0) === 0) {
    return { ok: false, error: "Ya existe una cuenta con ese email." };
  }

  // Si email confirmation está activado, no hay sesión todavía → mandalo a /login
  if (!data.session) {
    redirect(`/login?signup=ok${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  redirect(await safeNext(next, data.user?.id));
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

async function safeNext(
  next: string | undefined,
  userId: string | undefined
): Promise<string> {
  // next explícito gana, salvo que sea raro
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  // Default: si es agente → /admin; si es cliente → /publicar
  if (userId) {
    const supabase = await createClient();
    const { data: agente } = await supabase
      .from("agentes")
      .select("id")
      .eq("user_id", userId)
      .eq("activo", true)
      .maybeSingle();
    return agente ? "/admin" : "/publicar";
  }
  return "/admin";
}

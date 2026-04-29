"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";

export type SignInResult = { ok: true } | { ok: false; error: string };

export async function signIn(
  input: LoginInput,
  next?: string
): Promise<SignInResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Revisá los datos.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { ok: false, error: "Email o contraseña incorrectos." };
  }

  redirect(safeNext(next));
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

function safeNext(next: string | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/admin";
  return next;
}

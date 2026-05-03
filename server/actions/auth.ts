"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  loginSchema,
  signUpSchema,
  type LoginInput,
  type SignUpInput,
} from "@/lib/schemas/auth";

function slugify(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 48);
}

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

  const userId = data.user?.id;

  if (parsed.data.esInmobiliaria && parsed.data.nombreInmobiliaria && userId) {
    const inmoNombre = parsed.data.nombreInmobiliaria.trim();
    const slug = `${slugify(inmoNombre)}-${Math.random().toString(36).slice(2, 6)}`;
    const svc = createServiceClient();

    const { data: inmoRow } = await svc
      .from("inmobiliarias")
      .insert({ nombre: inmoNombre, slug, email_contacto: parsed.data.email, aprobada: false })
      .select("id")
      .single();

    if (inmoRow) {
      await svc.from("agentes").insert({
        user_id: userId,
        inmobiliaria_id: inmoRow.id,
        nombre: parsed.data.nombre,
        email: parsed.data.email,
        activo: false,
      });

      const webhookUrl = process.env.DI_ADMIN_WEBHOOK_URL;
      const webhookSecret = process.env.DI_ADMIN_WEBHOOK_SECRET;
      if (webhookUrl && webhookSecret) {
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${webhookSecret}` },
          body: JSON.stringify({
            proyecto: "atrio",
            entity_type: "inmobiliaria",
            entity_id: inmoRow.id,
            auth_user_id: userId,
            email: parsed.data.email,
            nombre: parsed.data.nombre,
            datos_extra: { inmo_nombre: inmoNombre },
          }),
        }).catch(() => {});
      }
    }

    if (!data.session) {
      redirect(`/login?signup=ok`);
    }
    redirect("/admin");
  }

  // Si email confirmation está activado, no hay sesión todavía → mandalo a /login
  if (!data.session) {
    redirect(`/login?signup=ok${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  redirect(await safeNext(next, userId));
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

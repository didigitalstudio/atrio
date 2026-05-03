import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { createClient } from "@/lib/supabase/server";
import { getInmoFeatures } from "@/lib/subscriptions";
import { AccountBlocked } from "@/components/account-blocked";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // El middleware ya redirige, pero protegemos a nivel layout también.
  if (!user) redirect("/login?next=/admin");

  // Buscar agente del usuario (activo o no). La RLS de 0006 permite ver el propio registro.
  const { data: agente } = await supabase
    .from("agentes")
    .select("id, activo, inmobiliaria_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!agente) redirect("/publicar");

  if (!agente.activo) {
    // Pendiente de aprobación: verificar columna aprobada de la inmobiliaria
    if (agente.inmobiliaria_id) {
      const { data: inmo } = await supabase
        .from("inmobiliarias")
        .select("aprobada")
        .eq("id", agente.inmobiliaria_id)
        .single();
      if (inmo && inmo.aprobada === false) {
        return <AccountBlocked variant="pending" />;
      }
    }
    // Si no tiene inmobiliaria_id o aprobada=true pero aún inactivo, redirigir
    redirect("/publicar");
  }

  // Gate paused
  if (agente.inmobiliaria_id) {
    const { data: subData } = await supabase
      .from("inmobiliaria_subscriptions")
      .select("estado")
      .eq("inmobiliaria_id", agente.inmobiliaria_id)
      .maybeSingle();
    if ((subData as { estado?: string } | null)?.estado === "paused") {
      return <AccountBlocked variant="paused" />;
    }
  }

  const features = await getInmoFeatures();

  return (
    <div className="grid min-h-full md:grid-cols-[260px_1fr]">
      <AdminSidebar userEmail={user.email ?? null} features={features} />
      <main className="flex-1 bg-white">{children}</main>
    </div>
  );
}

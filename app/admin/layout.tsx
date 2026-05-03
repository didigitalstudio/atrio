import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { createClient } from "@/lib/supabase/server";
import { getInmoFeatures } from "@/lib/subscriptions";

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

  // Solo los agentes activos ven el panel. Clientes van a /publicar.
  const { data: agente } = await supabase
    .from("agentes")
    .select("id")
    .eq("user_id", user.id)
    .eq("activo", true)
    .maybeSingle();
  if (!agente) redirect("/publicar");

  const features = await getInmoFeatures();

  return (
    <div className="grid min-h-full md:grid-cols-[260px_1fr]">
      <AdminSidebar userEmail={user.email ?? null} features={features} />
      <main className="flex-1 bg-white">{children}</main>
    </div>
  );
}

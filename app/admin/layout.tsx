import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { createClient } from "@/lib/supabase/server";

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

  return (
    <div className="grid min-h-full md:grid-cols-[260px_1fr]">
      <AdminSidebar userEmail={user.email ?? null} />
      <main className="flex-1 bg-white">{children}</main>
    </div>
  );
}

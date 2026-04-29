import Link from "next/link";
import {
  Building2,
  Home,
  Inbox,
  LogOut,
  Ruler,
  Users,
} from "lucide-react";
import { signOut } from "@/server/actions/auth";

const NAV = [
  { href: "/admin", label: "Inicio", icon: Home },
  { href: "/admin/propiedades", label: "Propiedades", icon: Building2 },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/tasaciones", label: "Tasaciones", icon: Ruler },
  { href: "/admin/equipo", label: "Equipo", icon: Users },
];

export function AdminSidebar({ userEmail }: { userEmail: string | null }) {
  return (
    <aside className="flex h-full flex-col border-r border-line bg-bg-soft">
      <div className="px-6 pt-7 pb-5">
        <Link href="/admin" className="text-2xl font-bold tracking-tight">
          Atrio<span className="text-brand">.</span>
        </Link>
        <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
          Panel
        </div>
      </div>

      <nav className="flex-1 px-3 py-2">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-white hover:text-ink"
            >
              <Icon className="h-4 w-4" strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line px-5 py-4">
        {userEmail && (
          <div className="mb-3 truncate text-xs text-ink-muted" title={userEmail}>
            {userEmail}
          </div>
        )}
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.8} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}

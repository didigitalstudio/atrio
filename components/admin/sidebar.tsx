'use client'

import Link from "next/link";
import { useState } from "react";
import {
  Building2,
  Home,
  Inbox,
  LogOut,
  Ruler,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "@/server/actions/auth";
import { ProModal } from "@/components/ui/pro-modal";

const NAV_ITEMS = [
  { href: "/admin", label: "Inicio", icon: Home, featureKey: null },
  { href: "/admin/propiedades", label: "Propiedades", icon: Building2, featureKey: null },
  { href: "/admin/leads", label: "Leads", icon: Inbox, featureKey: "leads" },
  { href: "/admin/tasaciones", label: "Tasaciones", icon: Ruler, featureKey: "tasaciones" },
  { href: "/admin/equipo", label: "Equipo", icon: Users, featureKey: null },
];

export function AdminSidebar({
  userEmail,
  features = {},
}: {
  userEmail: string | null;
  features?: Record<string, boolean>;
}) {
  const pathname = usePathname();
  const [proModal, setProModal] = useState<string | null>(null);

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
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const isLocked = item.featureKey !== null && !features[item.featureKey];

          if (isLocked) {
            return (
              <button
                key={item.href}
                onClick={() => setProModal(item.label)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-left text-ink-muted hover:bg-white hover:text-ink transition"
              >
                <Icon className="h-4 w-4" strokeWidth={1.8} />
                <span className="flex-1">{item.label}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand border border-brand/30 rounded px-1.5 py-0.5 bg-brand-soft">
                  Pro
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white hover:text-ink ${
                isActive ? "bg-white text-ink shadow-sm" : "text-ink-soft"
              }`}
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

      {proModal && <ProModal feature={proModal} onClose={() => setProModal(null)} />}
    </aside>
  );
}

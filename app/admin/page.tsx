import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  ClipboardCheck,
  Inbox,
  Plus,
  Ruler,
  Sparkles,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getInmoFeatures } from "@/lib/subscriptions";

export const metadata: Metadata = {
  title: "Panel · Atrio",
};

async function fetchCounts() {
  const supabase = await createClient();
  const [
    activas,
    borrador,
    enRevision,
    destacadas,
    leadsNuevos,
    leadsTotal,
    tasacionesPend,
    tasacionesTotal,
    agentes,
  ] = await Promise.all([
    supabase
      .from("propiedades")
      .select("id", { count: "exact", head: true })
      .eq("estado", "activa"),
    supabase
      .from("propiedades")
      .select("id", { count: "exact", head: true })
      .eq("estado", "borrador"),
    supabase
      .from("propiedades")
      .select("id", { count: "exact", head: true })
      .eq("estado", "en_revision"),
    supabase
      .from("propiedades")
      .select("id", { count: "exact", head: true })
      .eq("destacada", true)
      .eq("estado", "activa"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("estado", "nuevo"),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase
      .from("tasaciones")
      .select("id", { count: "exact", head: true })
      .eq("estado", "solicitada"),
    supabase.from("tasaciones").select("id", { count: "exact", head: true }),
    supabase
      .from("agentes")
      .select("id", { count: "exact", head: true })
      .eq("activo", true),
  ]);

  return {
    activas: activas.count ?? 0,
    borrador: borrador.count ?? 0,
    enRevision: enRevision.count ?? 0,
    destacadas: destacadas.count ?? 0,
    leadsNuevos: leadsNuevos.count ?? 0,
    leadsTotal: leadsTotal.count ?? 0,
    tasacionesPend: tasacionesPend.count ?? 0,
    tasacionesTotal: tasacionesTotal.count ?? 0,
    agentes: agentes.count ?? 0,
  };
}

export default async function AdminHomePage() {
  const [c, features] = await Promise.all([fetchCounts(), getInmoFeatures()]);

  return (
    <div className="px-6 py-10 md:px-10 md:py-12">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        Inicio
      </div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-light leading-tight tracking-tight md:text-4xl">
          Bienvenido <strong className="font-semibold">al panel.</strong>
        </h1>
        <Link
          href="/publicar"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Publicar nueva
        </Link>
      </div>

      {!features.reportes && (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <span className="text-sm text-amber-800">
            <strong>Plan Starter</strong> — Accedés a los conteos básicos. Actualizá a Pro para reportes avanzados.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          icon={ClipboardCheck}
          label="Submissions a revisar"
          value={c.enRevision}
          hint="De clientes que cargaron su propiedad"
          href="/admin/propiedades?estado=en_revision"
          highlight={c.enRevision > 0}
        />
        <Card
          icon={Inbox}
          label="Leads sin atender"
          value={c.leadsNuevos}
          hint={`${c.leadsTotal} en total`}
          href="/admin/leads?estado=nuevo"
          highlight={c.leadsNuevos > 0}
        />
        <Card
          icon={Ruler}
          label="Tasaciones pendientes"
          value={c.tasacionesPend}
          hint={`${c.tasacionesTotal} en total`}
          href="/admin/tasaciones?estado=solicitada"
          highlight={c.tasacionesPend > 0}
        />
        <Card
          icon={Building2}
          label="Propiedades activas"
          value={c.activas}
          hint={`${c.borrador} en borrador`}
          href="/admin/propiedades"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          icon={Sparkles}
          label="Destacadas en home"
          value={c.destacadas}
          href="/admin/propiedades"
        />
        <Card
          icon={Users}
          label="Agentes activos"
          value={c.agentes}
          href="/admin/equipo"
        />
      </div>
    </div>
  );
}

type IconType = React.ComponentType<{ className?: string; strokeWidth?: number }>;

function Card({
  icon: Icon,
  label,
  value,
  hint,
  href,
  highlight,
}: {
  icon: IconType;
  label: string;
  value: number;
  hint?: string;
  href?: string;
  highlight?: boolean;
}) {
  const inner = (
    <div
      className={
        "rounded-2xl border bg-white p-6 transition-all " +
        (highlight
          ? "border-brand/40 hover:border-brand"
          : "border-line hover:border-ink")
      }
    >
      <div
        className={
          "mb-5 flex h-10 w-10 items-center justify-center rounded-xl " +
          (highlight ? "bg-brand text-white" : "bg-brand-soft text-brand-deep")
        }
      >
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </div>
      <div className="mt-1 text-3xl font-light tracking-tight">
        <strong className="font-semibold">{value.toLocaleString("es-AR")}</strong>
      </div>
      {hint && <div className="mt-1 text-xs text-ink-muted">{hint}</div>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { InlineStatusForm } from "@/components/admin/inline-status-form";
import {
  parseEnum,
  type RawSearchParams,
} from "@/lib/search-params";
import { getLeads, type LeadEstado } from "@/server/queries/leads";
import { updateLeadStatus } from "@/server/actions/admin";
import { getInmoFeatures } from "@/lib/subscriptions";
import { FeatureGate } from "@/components/ui/feature-gate";

export const metadata: Metadata = { title: "Leads · Panel · Atrio" };

const ESTADO_OPTIONS: { value: LeadEstado; label: string }[] = [
  { value: "nuevo", label: "Nuevo" },
  { value: "contactado", label: "Contactado" },
  { value: "calificado", label: "Calificado" },
  { value: "descartado", label: "Descartado" },
  { value: "convertido", label: "Convertido" },
];

const ESTADOS: LeadEstado[] = [
  "nuevo",
  "contactado",
  "calificado",
  "descartado",
  "convertido",
];

const CANAL_LABEL: Record<string, string> = {
  web: "Web",
  whatsapp: "WhatsApp",
  telefono: "Teléfono",
  presencial: "Presencial",
  otro: "Otro",
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;
  const filterEstado = parseEnum<LeadEstado>(sp.estado, ESTADOS);
  const [features, items] = await Promise.all([
    getInmoFeatures(),
    getLeads(filterEstado ? { estado: filterEstado } : undefined),
  ]);

  return (
    <div className="px-6 py-10 md:px-10 md:py-12">
      <div className="mb-8">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Leads
        </div>
        <h1 className="text-3xl font-light leading-tight tracking-tight md:text-4xl">
          <strong className="font-semibold">{items.length}</strong>
          {filterEstado ? ` ${ESTADO_OPTIONS.find((e) => e.value === filterEstado)?.label.toLowerCase()}` : " en total"}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <FilterChip href="/admin/leads" active={!filterEstado} label="Todos" />
          {ESTADO_OPTIONS.map((e) => (
            <FilterChip
              key={e.value}
              href={`/admin/leads?estado=${e.value}`}
              active={filterEstado === e.value}
              label={e.label}
            />
          ))}
        </div>
      </div>

      <FeatureGate enabled={features.leads ?? false} message="Los Leads están disponibles en el plan Pro">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center text-sm text-ink-muted">
            {filterEstado
              ? "No hay leads en este estado."
              : "Cuando alguien complete el form de contacto o consulta, vas a verlo acá."}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-bg-soft">
                <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  <th className="px-5 py-3">Recibido</th>
                  <th className="px-5 py-3">Contacto</th>
                  <th className="px-5 py-3">Mensaje</th>
                  <th className="px-5 py-3">Propiedad</th>
                  <th className="px-5 py-3">Canal</th>
                  <th className="px-5 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {items.map((lead) => (
                  <tr key={lead.id} className="border-t border-line-soft align-top">
                    <td className="px-5 py-3 text-xs text-ink-muted whitespace-nowrap">
                      {format(new Date(lead.created_at), "d MMM HH:mm", {
                        locale: es,
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-ink">{lead.nombre}</div>
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-xs text-ink-muted hover:text-brand-deep"
                      >
                        {lead.email}
                      </a>
                      <div className="text-xs text-ink-muted">{lead.telefono}</div>
                    </td>
                    <td className="max-w-[360px] px-5 py-3 text-xs text-ink-soft">
                      <p className="line-clamp-3 leading-relaxed">{lead.mensaje}</p>
                    </td>
                    <td className="px-5 py-3 text-xs">
                      {lead.propiedad ? (
                        <Link
                          href={`/propiedades/${lead.propiedad.slug}`}
                          target="_blank"
                          className="text-brand-deep hover:underline"
                        >
                          {lead.propiedad.titulo}
                        </Link>
                      ) : (
                        <span className="text-ink-faint">general</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-ink-muted">
                      {CANAL_LABEL[lead.canal] ?? lead.canal}
                    </td>
                    <td className="px-5 py-3">
                      <InlineStatusForm
                        action={updateLeadStatus}
                        id={lead.id}
                        current={lead.estado}
                        options={ESTADO_OPTIONS}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FeatureGate>
    </div>
  );
}

function FilterChip({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={
        "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors " +
        (active
          ? "border-ink bg-ink text-white"
          : "border-line bg-white text-ink-soft hover:border-ink hover:text-ink")
      }
    >
      {label}
    </Link>
  );
}

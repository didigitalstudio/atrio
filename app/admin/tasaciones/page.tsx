import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { InlineStatusForm } from "@/components/admin/inline-status-form";
import {
  parseEnum,
  type RawSearchParams,
} from "@/lib/search-params";
import {
  getTasaciones,
  type TasacionEstado,
} from "@/server/queries/tasaciones";
import { updateTasacionStatus } from "@/server/actions/admin";

export const metadata: Metadata = { title: "Tasaciones · Panel · Atrio" };

const ESTADO_OPTIONS: { value: TasacionEstado; label: string }[] = [
  { value: "solicitada", label: "Solicitada" },
  { value: "en_proceso", label: "En proceso" },
  { value: "completada", label: "Completada" },
  { value: "descartada", label: "Descartada" },
];

const ESTADOS: TasacionEstado[] = [
  "solicitada",
  "en_proceso",
  "completada",
  "descartada",
];

const TIPO_LABEL: Record<string, string> = {
  departamento: "Depto",
  casa: "Casa",
  ph: "PH",
  terreno: "Terreno",
  local: "Local",
  oficina: "Oficina",
};

export default async function AdminTasacionesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;
  const filterEstado = parseEnum<TasacionEstado>(sp.estado, ESTADOS);
  const items = await getTasaciones(
    filterEstado ? { estado: filterEstado } : undefined
  );

  return (
    <div className="px-6 py-10 md:px-10 md:py-12">
      <div className="mb-8">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Tasaciones
        </div>
        <h1 className="text-3xl font-light leading-tight tracking-tight md:text-4xl">
          <strong className="font-semibold">{items.length}</strong>
          {filterEstado
            ? ` ${ESTADO_OPTIONS.find((e) => e.value === filterEstado)?.label.toLowerCase()}`
            : " en total"}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Chip href="/admin/tasaciones" active={!filterEstado} label="Todas" />
          {ESTADO_OPTIONS.map((e) => (
            <Chip
              key={e.value}
              href={`/admin/tasaciones?estado=${e.value}`}
              active={filterEstado === e.value}
              label={e.label}
            />
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center text-sm text-ink-muted">
          {filterEstado
            ? "Nada en este estado."
            : "Cuando alguien pida una tasación desde el form, aparece acá."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-bg-soft">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                <th className="px-5 py-3">Recibido</th>
                <th className="px-5 py-3">Contacto</th>
                <th className="px-5 py-3">Propiedad</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3 text-right">m² / Amb.</th>
                <th className="px-5 py-3 text-right">Estimado</th>
                <th className="px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id} className="border-t border-line-soft align-top">
                  <td className="px-5 py-3 text-xs text-ink-muted whitespace-nowrap">
                    {format(new Date(t.created_at), "d MMM HH:mm", {
                      locale: es,
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="font-medium text-ink">{t.nombre}</div>
                    <a
                      href={`mailto:${t.email}`}
                      className="text-xs text-ink-muted hover:text-brand-deep"
                    >
                      {t.email}
                    </a>
                    <div className="text-xs text-ink-muted">{t.telefono}</div>
                  </td>
                  <td className="max-w-[260px] px-5 py-3 text-xs text-ink-soft">
                    {t.direccion}
                    {t.comentarios && (
                      <div className="mt-1 line-clamp-2 text-[11px] text-ink-muted">
                        “{t.comentarios}”
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-ink-soft">
                    {t.tipo ? (TIPO_LABEL[t.tipo] ?? t.tipo) : "—"}
                  </td>
                  <td className="px-5 py-3 text-right text-xs tabular-nums text-ink-soft">
                    {t.m2 ?? "—"} m² / {t.ambientes ?? "—"} amb
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-semibold tabular-nums">
                    {t.valor_estimado
                      ? `USD ${new Intl.NumberFormat("es-AR").format(Number(t.valor_estimado))}`
                      : <span className="text-ink-faint font-normal">—</span>}
                  </td>
                  <td className="px-5 py-3">
                    <InlineStatusForm
                      action={updateTasacionStatus}
                      id={t.id}
                      current={t.estado}
                      options={ESTADO_OPTIONS}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Chip({
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

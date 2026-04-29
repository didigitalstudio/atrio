import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Pencil, Plus } from "lucide-react";
import { InlineStatusForm } from "@/components/admin/inline-status-form";
import { ReviewActions } from "@/components/admin/review-actions";
import {
  parseEnum,
  type RawSearchParams,
} from "@/lib/search-params";
import type { Database } from "@/lib/supabase/types";
import { getAdminProperties } from "@/server/queries/properties";
import { updatePropiedadEstado } from "@/server/actions/admin";

export const metadata: Metadata = { title: "Propiedades · Panel · Atrio" };

type EstadoPropiedad = Database["public"]["Enums"]["estado_propiedad"];

const ESTADO_OPTIONS: { value: EstadoPropiedad; label: string }[] = [
  { value: "borrador", label: "Borrador" },
  { value: "en_revision", label: "En revisión" },
  { value: "activa", label: "Activa" },
  { value: "reservada", label: "Reservada" },
  { value: "cerrada", label: "Cerrada" },
  { value: "despublicada", label: "Despublicada" },
];

const ESTADOS: EstadoPropiedad[] = [
  "borrador",
  "en_revision",
  "activa",
  "reservada",
  "cerrada",
  "despublicada",
];

const TIPO_LABEL: Record<string, string> = {
  departamento: "Depto",
  casa: "Casa",
  ph: "PH",
  terreno: "Terreno",
  local: "Local",
  oficina: "Oficina",
  cochera: "Cochera",
  emprendimiento: "Empr.",
};

const OP_LABEL: Record<string, string> = {
  venta: "Venta",
  alquiler: "Alquiler",
  alquiler_temporario: "Temporario",
};

function fmtPrice(precio: number, moneda: string): string {
  const fmt = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
  return moneda === "USD" ? `USD ${fmt.format(precio)}` : `$ ${fmt.format(precio)}`;
}

export default async function AdminPropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;
  const filterEstado = parseEnum<EstadoPropiedad>(sp.estado, ESTADOS);
  const all = await getAdminProperties();
  const items = filterEstado ? all.filter((p) => p.estado === filterEstado) : all;
  const enRevisionCount = all.filter((p) => p.estado === "en_revision").length;

  return (
    <div className="px-6 py-10 md:px-10 md:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Propiedades
          </div>
          <h1 className="text-3xl font-light leading-tight tracking-tight md:text-4xl">
            <strong className="font-semibold">{items.length}</strong>{" "}
            {filterEstado
              ? ESTADO_OPTIONS.find((e) => e.value === filterEstado)?.label.toLowerCase()
              : "en cartera"}
          </h1>
        </div>
        <Link
          href="/publicar"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Publicar nueva
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Chip href="/admin/propiedades" active={!filterEstado} label="Todas" />
        {ESTADO_OPTIONS.map((e) => (
          <Chip
            key={e.value}
            href={`/admin/propiedades?estado=${e.value}`}
            active={filterEstado === e.value}
            label={e.label}
            badge={
              e.value === "en_revision" && enRevisionCount > 0
                ? enRevisionCount
                : undefined
            }
          />
        ))}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center text-sm text-ink-muted">
          {filterEstado
            ? "Nada en este estado."
            : "No hay propiedades cargadas todavía."}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-bg-soft">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                <th className="px-5 py-3">Título</th>
                <th className="px-5 py-3">Zona</th>
                <th className="px-5 py-3">Tipo</th>
                <th className="px-5 py-3">Op.</th>
                <th className="px-5 py-3">Precio</th>
                <th className="px-5 py-3">Estado</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-line-soft">
                  <td className="px-5 py-3">
                    <div className="font-medium text-ink">{p.titulo}</div>
                    <div className="text-xs text-ink-muted">{p.direccion}</div>
                    {p.estado === "en_revision" && (
                      <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-amber-700">
                        Submission de cliente
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-ink-soft">
                    {p.zona?.nombre ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-ink-soft">
                    {TIPO_LABEL[p.tipo] ?? p.tipo}
                  </td>
                  <td className="px-5 py-3 text-ink-soft">
                    {OP_LABEL[p.operacion] ?? p.operacion}
                  </td>
                  <td className="px-5 py-3 font-semibold tabular-nums">
                    {fmtPrice(Number(p.precio), p.moneda)}
                  </td>
                  <td className="px-5 py-3">
                    <InlineStatusForm
                      action={updatePropiedadEstado}
                      id={p.id}
                      current={p.estado}
                      options={ESTADO_OPTIONS}
                    />
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    {p.estado === "en_revision" ? (
                      <ReviewActions id={p.id} />
                    ) : (
                      <div className="flex items-center justify-end gap-3 text-xs font-semibold">
                        <Link
                          href={`/admin/propiedades/${p.id}/edit`}
                          className="inline-flex items-center gap-1 text-ink-soft hover:text-ink"
                        >
                          <Pencil className="h-3 w-3" />
                          Editar
                        </Link>
                        {(p.estado === "activa" || p.estado === "reservada") && (
                          <Link
                            href={`/propiedades/${p.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-brand-deep hover:underline"
                          >
                            Ver
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    )}
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
  badge,
}: {
  href: string;
  active: boolean;
  label: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors " +
        (active
          ? "border-ink bg-ink text-white"
          : "border-line bg-white text-ink-soft hover:border-ink hover:text-ink")
      }
    >
      {label}
      {badge !== undefined && (
        <span
          className={
            "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold " +
            (active ? "bg-white text-ink" : "bg-brand text-white")
          }
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

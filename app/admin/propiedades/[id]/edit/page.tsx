import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PropiedadForm } from "@/components/forms/propiedad-form";
import type { PropiedadInput } from "@/lib/schemas/propiedad";
import { getPropertyById, getZonas } from "@/server/queries/properties";

export const metadata: Metadata = { title: "Editar propiedad · Atrio" };

type Params = Promise<{ id: string }>;

function rowToInput(row: NonNullable<Awaited<ReturnType<typeof getPropertyById>>>): Partial<PropiedadInput> {
  const fotos = Array.isArray(row.fotos) ? (row.fotos as Array<{ url?: string }>) : [];
  const features = Array.isArray(row.features) ? (row.features as string[]) : [];
  const numStr = (v: number | string | null | undefined) =>
    v === null || v === undefined ? "" : String(v);

  return {
    titulo: row.titulo,
    descripcion: row.descripcion ?? "",
    tipo: row.tipo,
    operacion: row.operacion,
    direccion: row.direccion,
    zonaId: row.zona_id,
    ambientes: numStr(row.ambientes),
    dormitorios: numStr(row.dormitorios),
    banos: numStr(row.banos),
    m2Cubiertos: numStr(row.m2_cubiertos),
    m2Totales: numStr(row.m2_totales),
    antiguedad: numStr(row.antiguedad),
    precio: numStr(row.precio),
    moneda: row.moneda,
    expensas: numStr(row.expensas),
    expensasMoneda: row.expensas_moneda ?? undefined,
    aptoCredito: row.apto_credito,
    features: features.join(", "),
    fotoUrl: fotos[0]?.url ?? "",
  };
}

export default async function EditPropiedadPage({ params }: { params: Params }) {
  const { id } = await params;
  const [propiedad, zonas] = await Promise.all([
    getPropertyById(id),
    getZonas(),
  ]);
  if (!propiedad) notFound();

  return (
    <section className="mx-auto max-w-[920px] px-6 py-12 md:px-10">
      <Link
        href="/admin/propiedades"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver al listado
      </Link>

      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        Editar
      </div>
      <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
        <h1 className="max-w-[640px] text-3xl font-light leading-tight tracking-tight md:text-4xl">
          {propiedad.titulo}
        </h1>
        {(propiedad.estado === "activa" || propiedad.estado === "reservada") && (
          <Link
            href={`/propiedades/${propiedad.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-deep hover:underline"
          >
            Ver pública
            <ExternalLink className="h-3 w-3" />
          </Link>
        )}
      </div>
      <p className="mt-2 text-sm text-ink-muted">
        Estado actual:{" "}
        <strong className="font-semibold capitalize">
          {propiedad.estado.replace("_", " ")}
        </strong>{" "}
        · {propiedad.zona?.nombre ?? "sin zona"}
      </p>

      <div className="mt-10">
        <PropiedadForm
          zonas={zonas}
          propiedadId={id}
          initialValues={rowToInput(propiedad)}
        />
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { PropiedadForm } from "@/components/forms/propiedad-form";
import { getZonas } from "@/server/queries/properties";

export const metadata: Metadata = {
  title: "Publicar propiedad · Atrio",
  description: "Cargar una propiedad nueva al panel.",
};

export default async function PublicarPage() {
  const zonas = await getZonas();

  return (
    <section className="mx-auto max-w-[920px] px-6 pt-16 pb-24 md:px-10 md:pt-20">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        Nueva propiedad
      </div>
      <h1 className="max-w-[640px] text-4xl font-light leading-tight tracking-tight md:text-5xl">
        Publicar <strong className="font-semibold">una propiedad.</strong>
      </h1>
      <p className="mt-4 max-w-[520px] text-sm text-ink-muted">
        Completá los datos. Se guarda como borrador y la activás desde el panel cuando esté revisada.
      </p>

      <div className="mt-10">
        <PropiedadForm zonas={zonas} />
      </div>
    </section>
  );
}

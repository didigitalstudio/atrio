import Image from "next/image";
import Link from "next/link";
import type { Operacion, Propiedad } from "@/lib/types";
import { FavoriteButton } from "./favorite-button";

function operationLabel(op: Operacion): string {
  switch (op) {
    case "venta":
      return "Venta";
    case "alquiler":
      return "Alquiler";
    case "alquiler_temporario":
      return "Temporario";
  }
}

function formatPrice(p: Propiedad): { main: string; suffix?: string } {
  const fmt = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
  const main =
    p.moneda === "USD"
      ? `USD ${fmt.format(p.precio)}`
      : `$ ${fmt.format(p.precio)}`;
  const suffix =
    p.operacion === "alquiler" || p.operacion === "alquiler_temporario"
      ? "/mes"
      : undefined;
  return { main, suffix };
}

export function PropertyCard({ propiedad }: { propiedad: Propiedad }) {
  const photo = propiedad.fotos[0];
  const price = formatPrice(propiedad);
  const opLabel = operationLabel(propiedad.operacion);

  return (
    <article className="group relative transition-transform duration-200 hover:-translate-y-1">
      <Link
        href={`/propiedades/${propiedad.slug}`}
        className="block"
      >
        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-bg-soft shadow-sm">
          {photo && (
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          )}
          <span className="absolute top-4 left-4 inline-flex items-center rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-ink shadow-xs">
            {opLabel}
          </span>
        </div>

        <div className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
          {propiedad.ambientes} amb · {propiedad.zona.nombre}
        </div>
        <h3 className="mb-1 text-xl font-medium leading-tight transition-colors group-hover:text-brand">
          {propiedad.titulo}
        </h3>
        <p className="mb-4 text-[13px] text-ink-muted">{propiedad.direccion}</p>

        <div className="flex items-center justify-between border-t border-line pt-3.5">
          <div className="text-[22px] font-bold tracking-tight text-ink">
            {price.main}
            {price.suffix && (
              <span className="ml-0.5 text-[13px] font-normal text-ink-muted">
                {price.suffix}
              </span>
            )}
          </div>
          <div className="flex gap-3.5 text-[13px] text-ink-soft">
            <span>{propiedad.m2_cubiertos ?? "—"} m²</span>
            {propiedad.dormitorios > 0 && (
              <>
                <span aria-hidden>·</span>
                <span>{propiedad.dormitorios} dorm</span>
              </>
            )}
          </div>
        </div>
      </Link>

      <FavoriteButton
        propiedadId={propiedad.id}
        className="absolute top-3.5 right-3.5"
      />
    </article>
  );
}

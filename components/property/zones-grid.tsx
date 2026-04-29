import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Grilla de regiones top-level del home. Counts hardcodeados hasta que
// el catálogo tenga volumen real (cuando lo tenga, se reemplaza por
// COUNT(*) en propiedades por región). Las regiones acá son las del
// enum region_zona; las zonas-barrio en DB tienen una FK a este enum.
const REGIONES = [
  {
    slug: "capital-federal",
    nombre: "Capital Federal",
    count: 684,
    foto: "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=1200&q=80",
  },
  {
    slug: "gba-norte",
    nombre: "Zona Norte",
    count: 312,
    foto: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
  {
    slug: "gba-oeste",
    nombre: "Zona Oeste",
    count: 158,
    foto: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  },
  {
    slug: "gba-sur",
    nombre: "Zona Sur",
    count: 93,
    foto: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
  },
  {
    slug: "costa-atlantica",
    nombre: "Costa Atlántica",
    count: 47,
    foto: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=800&q=80",
  },
];

export function ZonesGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-[280px_280px]">
      {REGIONES.map((region, i) => {
        const isFirst = i === 0;
        return (
          <Link
            key={region.slug}
            href={`/buscar?region=${region.slug}`}
            className={cn(
              "group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-ink shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md md:aspect-auto",
              isFirst && "md:row-span-2"
            )}
          >
            <Image
              src={region.foto}
              alt={region.nombre}
              fill
              sizes={
                isFirst
                  ? "(max-width: 768px) 100vw, 66vw"
                  : "(max-width: 768px) 100vw, 33vw"
              }
              className="object-cover opacity-90 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/0 to-transparent p-7 text-white">
              <div
                className={cn(
                  "leading-tight tracking-tight",
                  isFirst ? "text-4xl font-normal" : "text-2xl font-medium"
                )}
              >
                {region.nombre}
              </div>
              <div className="mt-1 text-[13px] opacity-85">
                {region.count} propiedades
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

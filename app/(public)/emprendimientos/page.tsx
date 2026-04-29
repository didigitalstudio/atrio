import type { Metadata } from "next";
import { PropertyListing } from "@/components/property/property-listing";
import {
  parseUserPropertyFilters,
  type RawSearchParams,
} from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Emprendimientos · Atrio",
  description:
    "Emprendimientos inmobiliarios en pozo y construcción en CABA y GBA. Información clara de avance, entrega y financiación.",
};

export default async function EmprendimientosPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const userFilters = parseUserPropertyFilters(await searchParams);

  return (
    <PropertyListing
      basePath="/emprendimientos"
      eyebrow="Emprendimientos"
      title={
        <>
          Proyectos <strong className="font-semibold">en pozo y construcción.</strong>
        </>
      }
      lockedFilters={{ tipo: "emprendimiento" }}
      userFilters={userFilters}
      hideTipoField
    />
  );
}

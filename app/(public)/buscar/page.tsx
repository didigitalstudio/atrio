import type { Metadata } from "next";
import { PropertyListing } from "@/components/property/property-listing";
import {
  parseUserPropertyFilters,
  type RawSearchParams,
} from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Buscar propiedades · Atrio",
  description:
    "Buscador unificado de propiedades de Atrio: venta, alquiler y temporario en CABA y GBA.",
};

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const userFilters = parseUserPropertyFilters(await searchParams);

  return (
    <PropertyListing
      basePath="/buscar"
      eyebrow="Resultados"
      title={
        <>
          Encontrá lo que <strong className="font-semibold">estás buscando.</strong>
        </>
      }
      lockedFilters={{}}
      userFilters={userFilters}
      showOperacionField
    />
  );
}

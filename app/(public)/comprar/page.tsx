import type { Metadata } from "next";
import { PropertyListing } from "@/components/property/property-listing";
import {
  parseUserPropertyFilters,
  type RawSearchParams,
} from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Propiedades en venta · Atrio",
  description:
    "Departamentos, casas, PHs y más en venta en CABA y GBA. Filtrá por zona, ambientes y precio.",
};

export default async function ComprarPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const userFilters = parseUserPropertyFilters(await searchParams);

  return (
    <PropertyListing
      basePath="/comprar"
      eyebrow="En venta"
      title={
        <>
          Propiedades <strong className="font-semibold">en venta.</strong>
        </>
      }
      lockedFilters={{ operacion: "venta" }}
      userFilters={userFilters}
    />
  );
}

import type { Metadata } from "next";
import { PropertyListing } from "@/components/property/property-listing";
import {
  parseUserPropertyFilters,
  type RawSearchParams,
} from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Propiedades en alquiler · Atrio",
  description:
    "Departamentos, casas y PHs en alquiler en CABA y GBA. Filtrá por zona, ambientes y precio.",
};

export default async function AlquilarPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const userFilters = parseUserPropertyFilters(await searchParams);

  return (
    <PropertyListing
      basePath="/alquilar"
      eyebrow="En alquiler"
      title={
        <>
          Propiedades <strong className="font-semibold">en alquiler.</strong>
        </>
      }
      lockedFilters={{ operacion: "alquiler" }}
      userFilters={userFilters}
    />
  );
}

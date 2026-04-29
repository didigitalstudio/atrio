import type { Metadata } from "next";
import { PropertyListing } from "@/components/property/property-listing";
import {
  parseUserPropertyFilters,
  type RawSearchParams,
} from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Alquiler temporario · Atrio",
  description:
    "Propiedades en alquiler temporario en CABA y GBA. Estadías cortas con dueño confiable.",
};

export default async function TemporarioPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const userFilters = parseUserPropertyFilters(await searchParams);

  return (
    <PropertyListing
      basePath="/temporario"
      eyebrow="Alquiler temporario"
      title={
        <>
          Estadías <strong className="font-semibold">por días o meses.</strong>
        </>
      }
      lockedFilters={{ operacion: "alquiler_temporario" }}
      userFilters={userFilters}
    />
  );
}

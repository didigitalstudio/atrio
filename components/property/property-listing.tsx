import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertyPagination } from "@/components/property/property-pagination";
import {
  getProperties,
  getZonas,
  type PropertyFilters as PropertyFiltersType,
} from "@/server/queries/properties";

type Props = {
  basePath: string;
  eyebrow: string;
  title: React.ReactNode;
  /**
   * Filtros que esta ruta impone y el usuario no puede cambiar
   * (ej: `operacion: 'venta'` en /comprar).
   */
  lockedFilters: Pick<PropertyFiltersType, "operacion" | "tipo">;
  /**
   * Filtros parseados desde la URL (lo que el usuario eligió en el form).
   */
  userFilters: Pick<
    PropertyFiltersType,
    | "operacion"
    | "zonaSlug"
    | "tipo"
    | "ambientesMin"
    | "precioMin"
    | "precioMax"
    | "moneda"
    | "page"
  >;
  /** En `/emprendimientos` el tipo está fijo, no mostramos el field. */
  hideTipoField?: boolean;
  /** En `/buscar` el usuario puede elegir operación. */
  showOperacionField?: boolean;
};

export async function PropertyListing({
  basePath,
  eyebrow,
  title,
  lockedFilters,
  userFilters,
  hideTipoField,
  showOperacionField,
}: Props) {
  const filters: PropertyFiltersType = {
    ...userFilters,
    ...lockedFilters,
  };

  const [{ data, total, page, totalPages }, zonas] = await Promise.all([
    getProperties(filters),
    getZonas(),
  ]);

  const preservedParams = buildPreservedParams(userFilters);

  return (
    <>
      {/* HEADER */}
      <section className="border-b border-line-soft bg-bg-soft">
        <div className="mx-auto max-w-[1320px] px-6 py-16 md:px-10 md:py-20">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            {eyebrow}
          </div>
          <h1 className="max-w-[760px] text-4xl font-light leading-tight tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            {total === 0
              ? "Sin resultados con los filtros actuales."
              : total === 1
                ? "1 propiedad encontrada"
                : `${total.toLocaleString("es-AR")} propiedades encontradas`}
          </p>
        </div>
      </section>

      {/* RESULTS + FILTERS */}
      <section className="mx-auto max-w-[1320px] px-6 py-12 md:px-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-[280px_1fr]">
          {/* Sidebar desktop */}
          <aside className="hidden md:block">
            <div className="sticky top-28">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">
                Filtros
              </h2>
              <PropertyFilters
                basePath={basePath}
                zonas={zonas}
                values={userFilters}
                hideTipoField={hideTipoField}
                showOperacionField={showOperacionField}
              />
            </div>
          </aside>

          {/* Filtros mobile (collapsible) */}
          <details className="md:hidden rounded-2xl border border-line bg-white p-5">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-ink">
              <span className="inline-flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
              </span>
              <span className="text-xs text-ink-muted">Tocá para abrir</span>
            </summary>
            <div className="mt-5">
              <PropertyFilters
                basePath={basePath}
                zonas={zonas}
                values={userFilters}
                hideTipoField={hideTipoField}
                showOperacionField={showOperacionField}
              />
            </div>
          </details>

          {/* Results */}
          <div>
            {data.length === 0 ? (
              <EmptyState basePath={basePath} />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
                  {data.map((p) => (
                    <PropertyCard key={p.id} propiedad={p} />
                  ))}
                </div>
                <PropertyPagination
                  basePath={basePath}
                  page={page}
                  totalPages={totalPages}
                  preservedParams={preservedParams}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function EmptyState({ basePath }: { basePath: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center">
      <h3 className="text-xl font-semibold text-ink">
        No encontramos propiedades con esos filtros
      </h3>
      <p className="mt-2 text-sm text-ink-muted">
        Probá relajando alguno de los filtros o limpiándolos para ver todas las opciones.
      </p>
      <Link
        href={basePath}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-ink px-7 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
      >
        Limpiar filtros
      </Link>
    </div>
  );
}

type UserFilters = Props["userFilters"];

function buildPreservedParams(filters: UserFilters): Record<string, string> {
  const out: Record<string, string> = {};
  if (filters.operacion) out.op = filters.operacion;
  if (filters.zonaSlug) out.zona = filters.zonaSlug;
  if (filters.tipo) out.tipo = filters.tipo;
  if (filters.ambientesMin !== undefined)
    out.ambientes_min = String(filters.ambientesMin);
  if (filters.precioMin !== undefined)
    out.precio_min = String(filters.precioMin);
  if (filters.precioMax !== undefined)
    out.precio_max = String(filters.precioMax);
  if (filters.moneda) out.moneda = filters.moneda;
  return out;
}

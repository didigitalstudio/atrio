import Link from "next/link";
import type { Operacion, TipoPropiedad, ZonaResumen } from "@/lib/types";

const TIPO_OPTIONS: { value: TipoPropiedad; label: string }[] = [
  { value: "departamento", label: "Departamento" },
  { value: "casa", label: "Casa" },
  { value: "ph", label: "PH" },
  { value: "terreno", label: "Terreno" },
  { value: "local", label: "Local" },
  { value: "oficina", label: "Oficina" },
  { value: "cochera", label: "Cochera" },
  { value: "emprendimiento", label: "Emprendimiento" },
];

const OPERACION_OPTIONS: { value: Operacion; label: string }[] = [
  { value: "venta", label: "Venta" },
  { value: "alquiler", label: "Alquiler" },
  { value: "alquiler_temporario", label: "Temporario" },
];

const AMBIENTES_OPTIONS = [1, 2, 3, 4, 5] as const;

const fieldClass =
  "h-11 w-full rounded-[10px] border border-line bg-white px-3 text-sm text-ink outline-none transition-colors hover:border-ink-faint focus:border-brand focus:ring-2 focus:ring-brand/15";
const labelClass =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted";

type Props = {
  basePath: string;
  zonas: ZonaResumen[];
  values: {
    operacion?: Operacion;
    zonaSlug?: string;
    tipo?: TipoPropiedad;
    ambientesMin?: number;
    precioMin?: number;
    precioMax?: number;
    moneda?: string;
  };
  hideTipoField?: boolean;
  showOperacionField?: boolean;
};

export function PropertyFilters({
  basePath,
  zonas,
  values,
  hideTipoField,
  showOperacionField,
}: Props) {
  return (
    <form method="get" action={basePath} className="space-y-5">
      {showOperacionField && (
        <div>
          <label htmlFor="filter-op" className={labelClass}>
            Operación
          </label>
          <select
            id="filter-op"
            name="op"
            defaultValue={values.operacion ?? ""}
            className={fieldClass}
          >
            <option value="">Cualquiera</option>
            {OPERACION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="filter-zona" className={labelClass}>
          Zona
        </label>
        <select
          id="filter-zona"
          name="zona"
          defaultValue={values.zonaSlug ?? ""}
          className={fieldClass}
        >
          <option value="">Todas las zonas</option>
          {zonas.map((z) => (
            <option key={z.id} value={z.slug}>
              {z.nombre}
            </option>
          ))}
        </select>
      </div>

      {!hideTipoField && (
        <div>
          <label htmlFor="filter-tipo" className={labelClass}>
            Tipo
          </label>
          <select
            id="filter-tipo"
            name="tipo"
            defaultValue={values.tipo ?? ""}
            className={fieldClass}
          >
            <option value="">Cualquier tipo</option>
            {TIPO_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="filter-amb" className={labelClass}>
          Ambientes mínimos
        </label>
        <select
          id="filter-amb"
          name="ambientes_min"
          defaultValue={values.ambientesMin ? String(values.ambientesMin) : ""}
          className={fieldClass}
        >
          <option value="">Cualquiera</option>
          {AMBIENTES_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} o más
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="filter-moneda" className={labelClass}>
          Moneda
        </label>
        <select
          id="filter-moneda"
          name="moneda"
          defaultValue={values.moneda ?? ""}
          className={fieldClass}
        >
          <option value="">Cualquiera</option>
          <option value="USD">USD</option>
          <option value="ARS">ARS</option>
        </select>
      </div>

      <div>
        <span className={labelClass}>Precio</span>
        <div className="flex gap-2">
          <input
            type="number"
            name="precio_min"
            inputMode="numeric"
            min={0}
            placeholder="Mín"
            defaultValue={values.precioMin ?? ""}
            className={fieldClass}
          />
          <input
            type="number"
            name="precio_max"
            inputMode="numeric"
            min={0}
            placeholder="Máx"
            defaultValue={values.precioMax ?? ""}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <button
          type="submit"
          className="h-11 rounded-full bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          Aplicar filtros
        </button>
        <Link
          href={basePath}
          className="h-11 inline-flex items-center justify-center rounded-full border border-line text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink"
        >
          Limpiar
        </Link>
      </div>
    </form>
  );
}

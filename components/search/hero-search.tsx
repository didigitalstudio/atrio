"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

type SearchTab = "comprar" | "alquilar" | "temporario" | "emprendimientos";

const TABS: { id: SearchTab; label: string }[] = [
  { id: "comprar", label: "Comprar" },
  { id: "alquilar", label: "Alquilar" },
  { id: "temporario", label: "Alquiler temporario" },
  { id: "emprendimientos", label: "Emprendimientos" },
];

const QUICK_SEARCHES = [
  { href: "/comprar?ambientes_min=2&zona=caballito", label: "2 ambientes en Caballito" },
  { href: "/comprar?tipo=casa&zona=villa-devoto", label: "Casas en Devoto" },
  { href: "/comprar?precio_max=100000&moneda=USD", label: "Hasta USD 100.000" },
  { href: "/alquilar?ambientes_min=3", label: "Alquiler 3+ ambientes" },
  { href: "/emprendimientos", label: "Emprendimientos" },
];

const TIPO_HINTS: { match: RegExp; value: string }[] = [
  { match: /depart|monoamb/i, value: "departamento" },
  { match: /casa/i, value: "casa" },
  { match: /\bph\b/i, value: "ph" },
  { match: /terreno|lote/i, value: "terreno" },
  { match: /local/i, value: "local" },
  { match: /oficin/i, value: "oficina" },
  { match: /cochera|garage/i, value: "cochera" },
  { match: /emprend/i, value: "emprendimiento" },
];

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePrecio(input: string): { max?: number; moneda?: "USD" | "ARS" } {
  const cleaned = input.replace(/[^\d.,a-zA-Z\s]/g, "");
  const num = Number.parseInt(cleaned.replace(/[^\d]/g, ""), 10);
  const max = Number.isFinite(num) && num > 0 ? num : undefined;
  let moneda: "USD" | "ARS" | undefined;
  if (/\busd\b|u\$s|d[oó]lar/i.test(input)) moneda = "USD";
  else if (/\bars\b|peso/i.test(input) || input.trim().startsWith("$"))
    moneda = "ARS";
  return { max, moneda };
}

function pickTipo(input: string): string | undefined {
  if (!input.trim()) return undefined;
  return TIPO_HINTS.find((h) => h.match.test(input))?.value;
}

const ROUTE_BY_TAB: Record<SearchTab, string> = {
  comprar: "/comprar",
  alquilar: "/alquilar",
  temporario: "/temporario",
  emprendimientos: "/emprendimientos",
};

export function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SearchTab>("comprar");
  const [donde, setDonde] = useState("");
  const [tipo, setTipo] = useState("");
  const [precio, setPrecio] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams();
    const dondeSlug = slugify(donde);
    if (dondeSlug) params.set("zona", dondeSlug);
    const tipoEnum = pickTipo(tipo);
    if (tipoEnum && activeTab !== "emprendimientos") params.set("tipo", tipoEnum);
    const { max, moneda } = parsePrecio(precio);
    if (max !== undefined) params.set("precio_max", String(max));
    if (moneda) params.set("moneda", moneda);

    const qs = params.toString();
    const url = `${ROUTE_BY_TAB[activeTab]}${qs ? `?${qs}` : ""}`;
    router.push(url);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-line-soft bg-white p-2 shadow-lg"
      >
        <div role="tablist" className="flex gap-1 px-2 pt-2">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "rounded-full px-[22px] py-3 text-sm font-semibold transition-colors",
                  active
                    ? "bg-brand-soft text-brand-deep"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-1 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-line md:grid-cols-[1.4fr_1fr_1.2fr_auto]">
          <label className="flex cursor-text flex-col gap-1 bg-white px-6 py-[18px] transition-colors hover:bg-bg-soft">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              ¿Dónde?
            </span>
            <input
              type="text"
              value={donde}
              onChange={(e) => setDonde(e.target.value)}
              placeholder="Barrio, ciudad o zona"
              className="w-full bg-transparent text-[15px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-faint"
            />
          </label>

          <label className="flex cursor-text flex-col gap-1 bg-white px-6 py-[18px] transition-colors hover:bg-bg-soft">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Tipo
            </span>
            <input
              type="text"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              placeholder="Departamento, casa, PH..."
              className="w-full bg-transparent text-[15px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-faint"
            />
          </label>

          <label className="flex cursor-text flex-col gap-1 bg-white px-6 py-[18px] transition-colors hover:bg-bg-soft">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
              Precio
            </span>
            <input
              type="text"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="Hasta USD 100.000"
              className="w-full bg-transparent text-[15px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-faint"
            />
          </label>

          <button
            type="submit"
            className="m-1.5 flex items-center justify-center gap-2.5 rounded-xl bg-brand px-9 text-[15px] font-semibold text-white transition-colors hover:bg-brand-deep"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={2} />
            Buscar
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-wrap items-center gap-2.5">
        <span className="mr-1 text-xs text-ink-muted">Búsquedas frecuentes:</span>
        {QUICK_SEARCHES.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            {q.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

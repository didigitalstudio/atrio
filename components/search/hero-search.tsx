"use client";

import { Search } from "lucide-react";
import Link from "next/link";
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
  { href: "/buscar?op=venta&amb=2&zona=caballito", label: "2 ambientes en Caballito" },
  { href: "/buscar?op=venta&tipo=casa&zona=devoto", label: "Casas en Devoto" },
  { href: "/buscar?op=venta&apto-credito=1", label: "Aptos crédito" },
  { href: "/buscar?op=venta&max=100000", label: "Hasta USD 100.000" },
  { href: "/buscar?op=venta&cochera=1", label: "Con cochera" },
];

export function HeroSearch() {
  const [activeTab, setActiveTab] = useState<SearchTab>("comprar");
  const [donde, setDonde] = useState("");
  const [tipo, setTipo] = useState("Departamentos, Casas");
  const [precio, setPrecio] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: navegar a /buscar con los params armados desde el form
    console.log("search submit", {
      tab: activeTab,
      donde,
      tipo,
      precio,
    });
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
              placeholder="Departamentos, Casas"
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
              placeholder="Hasta USD —"
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

import { ShieldCheck, MessageSquare, ListChecks } from "lucide-react";
import Link from "next/link";
import { PropertyCard } from "@/components/property/property-card";
import { ZonesGrid } from "@/components/property/zones-grid";
import { HeroSearch } from "@/components/search/hero-search";
import { getFeaturedProperties } from "@/server/queries/properties";

const METRICS = [
  { num: "1.247", label: "Propiedades activas" },
  { num: "23", label: "Agentes matriculados" },
  { num: "18", label: "Años en el mercado" },
  { num: "94%", label: "Operaciones cerradas en menos de 90 días" },
];

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Agentes matriculados",
    text: "Todo nuestro equipo está inscripto en el Colegio de Corredores. Cada operación tiene un responsable identificable.",
  },
  {
    icon: MessageSquare,
    title: "Respuesta en menos de 2 horas",
    text: "Cuando consultás por una propiedad, te contestamos rápido. Sin esperas de tres días ni mensajes que se pierden.",
  },
  {
    icon: ListChecks,
    title: "Información clara",
    text: "Expensas reales, ABL, antigüedad y estado del título publicados antes de que tengas que preguntar.",
  },
];

export default async function HomePage() {
  const propiedades = await getFeaturedProperties();

  return (
    <>
      {/* HERO + BUSCADOR */}
      <section className="mx-auto max-w-[1320px] px-6 pt-16 pb-16 md:px-10 md:pt-24">
        <div className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Inmobiliaria · Buenos Aires
        </div>
        <h1 className="mb-6 max-w-[880px] text-5xl font-light leading-[1.05] tracking-[-0.03em] md:text-7xl">
          Encontrá la casa <strong className="font-semibold">en la que querés vivir.</strong>
        </h1>
        <p className="mb-14 max-w-[540px] text-lg leading-relaxed text-ink-muted">
          Más de 1.200 propiedades en venta y alquiler en Capital y Gran Buenos Aires, gestionadas por agentes matriculados.
        </p>
        <HeroSearch />
      </section>

      {/* METRICS STRIP */}
      <section className="border-y border-line-soft bg-bg-soft">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-12 px-6 py-10 md:grid-cols-4 md:gap-16 md:px-10">
          {METRICS.map((m) => (
            <div key={m.label}>
              <div className="mb-2 text-4xl font-light leading-none tracking-tight">
                <strong className="font-semibold text-brand">{m.num}</strong>
              </div>
              <div className="text-[13px] leading-snug text-ink-muted">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DESTACADAS */}
      <section className="mx-auto max-w-[1320px] px-6 py-24 md:px-10">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-[680px]">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Destacadas
            </div>
            <h2 className="text-4xl font-light leading-tight tracking-tight md:text-[44px]">
              Una selección <strong className="font-semibold">de esta semana.</strong>
            </h2>
          </div>
          <Link
            href="/buscar"
            className="whitespace-nowrap border-b-[1.5px] border-ink pb-0.5 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
          >
            Ver todas las propiedades →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
          {propiedades.map((p) => (
            <PropertyCard key={p.id} propiedad={p} />
          ))}
        </div>
      </section>

      {/* ZONAS */}
      <section className="bg-bg-soft px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-[680px]">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                Por zona
              </div>
              <h2 className="text-4xl font-light leading-tight tracking-tight md:text-[44px]">
                Buscá <strong className="font-semibold">en el barrio que querés.</strong>
              </h2>
            </div>
            <Link
              href="/zonas"
              className="whitespace-nowrap border-b-[1.5px] border-ink pb-0.5 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
            >
              Ver todas las zonas →
            </Link>
          </div>
          <ZonesGrid />
        </div>
      </section>

      {/* SELL CTA */}
      <section className="relative overflow-hidden bg-brand-deep px-6 py-24 text-white md:px-10">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            ¿Tenés una propiedad?
          </div>
          <h2 className="mb-6 max-w-[680px] text-4xl font-light leading-tight tracking-tight md:text-5xl">
            Te ayudamos a <strong className="font-semibold">venderla o alquilarla.</strong>
          </h2>
          <p className="mb-8 max-w-[480px] text-base leading-relaxed text-white/75">
            Tasación sin cargo, fotografía profesional incluida y un agente matriculado dedicado durante todo el proceso. Sin sorpresas, sin letra chica.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/tasaciones"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Solicitar tasación gratis
            </Link>
            <Link
              href="/como-trabajamos"
              className="rounded-full border-[1.5px] border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/5"
            >
              Cómo trabajamos
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-[1320px] px-6 py-20 md:px-10">
        <div className="mb-10 max-w-[680px]">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Por qué Atrio
          </div>
          <h2 className="text-4xl font-light leading-tight tracking-tight md:text-[44px]">
            Una inmobiliaria <strong className="font-semibold">como tiene que ser.</strong>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-line bg-white p-8 transition-all hover:-translate-y-0.5 hover:border-brand"
              >
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-deep">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="mb-2.5 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

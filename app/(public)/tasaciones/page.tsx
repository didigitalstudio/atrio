import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { TasacionForm } from "@/components/forms/tasacion-form";

export const metadata: Metadata = {
  title: "Tasaciones gratuitas · Atrio",
  description:
    "Pedí una tasación sin cargo y sin compromiso. Te contactamos en menos de 48 horas.",
};

const BULLETS = [
  "Sin costo y sin compromiso de venta.",
  "Te respondemos en menos de 48 horas.",
  "Tasación basada en operaciones reales del barrio.",
  "Te explicamos cómo llegamos al número, sin letra chica.",
];

export default function TasacionesPage() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-[1320px] px-6 pt-20 pb-12 md:px-10 md:pt-28 md:pb-16">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Tasaciones
        </div>
        <h1 className="max-w-[820px] text-4xl font-light leading-[1.1] tracking-tight md:text-6xl">
          Tasación <strong className="font-semibold">gratuita y sin compromiso.</strong>
        </h1>
        <p className="mt-6 max-w-[560px] text-lg leading-relaxed text-ink-muted">
          Contanos los datos básicos y te decimos cuánto vale tu propiedad
          hoy, en valores reales del mercado.
        </p>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-[1320px] px-6 pb-24 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          <div className="rounded-2xl border border-line bg-white p-8 md:p-10">
            <h2 className="mb-2 text-2xl font-semibold">
              Pedí tu tasación
            </h2>
            <p className="mb-8 text-sm text-ink-muted">
              Cuanta más info nos pases, más precisa va a ser la tasación.
            </p>
            <TasacionForm />
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-line bg-bg-soft p-6">
              <h3 className="mb-4 text-lg font-semibold">Cómo trabajamos</h3>
              <ul className="space-y-3">
                {BULLETS.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-ink-soft">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                      strokeWidth={2}
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-brand-soft p-6">
              <p className="text-sm leading-relaxed text-brand-deep">
                Si después querés vender o alquilar con nosotros, perfecto. Si
                no, también. La tasación es tuya.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

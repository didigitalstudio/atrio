import type { Metadata } from "next";
import Link from "next/link";
import {
  Camera,
  Handshake,
  LineChart,
  MessageCircle,
  Ruler,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Vender tu propiedad · Atrio",
  description:
    "Vendé con Atrio. Tasación gratuita, fotografía profesional incluida y un agente matriculado dedicado durante todo el proceso. Sin letra chica.",
};

const STEPS = [
  {
    icon: Ruler,
    title: "Tasamos",
    text: "Nos pasás los datos básicos y en menos de 48 horas tenés un valor de mercado real, basado en operaciones recientes del barrio.",
  },
  {
    icon: Camera,
    title: "Producimos",
    text: "Visitamos la propiedad, sacamos fotos profesionales y armamos la ficha. Sin costo y sin que tengas que mover un dedo.",
  },
  {
    icon: LineChart,
    title: "Publicamos",
    text: "Tu propiedad sale en Atrio, en los principales portales y en nuestro pool de compradores activos. Un solo equipo, varios canales.",
  },
  {
    icon: Handshake,
    title: "Cerramos",
    text: "Filtramos las consultas, agendamos visitas, negociamos y te acompañamos hasta la escritura. Vos seguís con tu vida.",
  },
];

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Agentes matriculados",
    text: "Cada operación tiene un responsable identificable, inscripto en el Colegio de Corredores de CABA.",
  },
  {
    icon: MessageCircle,
    title: "Contestamos rápido",
    text: "Cada consulta se responde en menos de 2 horas en horario laboral. Las propiedades que tardan se enfrían.",
  },
  {
    icon: Sparkles,
    title: "Sin sorpresas",
    text: "Honorarios y condiciones claras desde el primer minuto. Lo que firmás es lo que pagás.",
  },
];

const STATS = [
  { num: "94%", label: "Operaciones cerradas en menos de 90 días" },
  { num: "48 hs", label: "Promedio para entregar la tasación" },
  { num: "0", label: "Costo de fotografía y producción" },
];

export default function VenderPage() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-[1320px] px-6 pt-20 pb-16 md:px-10 md:pt-28 md:pb-20">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Vender
        </div>
        <h1 className="max-w-[920px] text-5xl font-light leading-[1.05] tracking-[-0.03em] md:text-7xl">
          Vendé tu casa <strong className="font-semibold">sin sorpresas.</strong>
        </h1>
        <p className="mt-8 max-w-[580px] text-lg leading-relaxed text-ink-muted">
          Tasación gratuita, fotografía profesional incluida y un agente
          matriculado dedicado a tu operación. Vos seguís con tu vida; nosotros
          nos ocupamos del resto.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/publicar"
            className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-md"
          >
            Publicar mi propiedad
          </Link>
          <Link
            href="/tasaciones"
            className="rounded-full border-[1.5px] border-line bg-white px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
          >
            Pedir tasación gratis
          </Link>
        </div>
        <p className="mt-4 text-xs text-ink-muted">
          Para publicar te pedimos crear una cuenta. Tu propiedad va a revisión
          antes de salir online.
        </p>
      </section>

      {/* STATS */}
      <section className="border-y border-line-soft bg-bg-soft">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 py-12 md:grid-cols-3 md:gap-16 md:px-10">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="mb-2 text-4xl font-light leading-none tracking-tight md:text-5xl">
                <strong className="font-semibold text-brand">{s.num}</strong>
              </div>
              <div className="text-[13px] leading-snug text-ink-muted">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STEPS */}
      <section className="mx-auto max-w-[1320px] px-6 py-24 md:px-10">
        <div className="mb-14 max-w-[680px]">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Cómo trabajamos
          </div>
          <h2 className="text-4xl font-light leading-tight tracking-tight md:text-[44px]">
            Cuatro pasos, <strong className="font-semibold">sin vueltas.</strong>
          </h2>
        </div>
        <ol className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="rounded-2xl border border-line bg-white p-7">
                <div className="mb-5 flex items-center gap-4">
                  <span className="text-3xl font-light tabular-nums tracking-tight text-ink-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-deep">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{step.text}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* REASONS */}
      <section className="bg-bg-soft px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-12 max-w-[680px]">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Por qué Atrio
            </div>
            <h2 className="text-4xl font-light leading-tight tracking-tight md:text-[44px]">
              Una inmobiliaria <strong className="font-semibold">como tiene que ser.</strong>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {REASONS.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.title}
                  className="rounded-2xl border border-line bg-white p-8 transition-all hover:-translate-y-0.5 hover:border-brand"
                >
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-deep">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="mb-2.5 text-lg font-semibold">{r.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-muted">{r.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden bg-brand-deep px-6 py-24 text-white md:px-10">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            Empezá hoy
          </div>
          <h2 className="mb-6 max-w-[720px] text-4xl font-light leading-tight tracking-tight md:text-5xl">
            Cargá tu propiedad <strong className="font-semibold">en 5 minutos.</strong>
          </h2>
          <p className="mb-8 max-w-[480px] text-base leading-relaxed text-white/75">
            Creás tu cuenta, completás los datos y nuestro equipo la revisa.
            Si hace falta ajustar algo, te avisamos antes de publicar.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/publicar"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Publicar mi propiedad
            </Link>
            <Link
              href="/tasaciones"
              className="rounded-full border-[1.5px] border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/5"
            >
              Solo quiero tasación
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

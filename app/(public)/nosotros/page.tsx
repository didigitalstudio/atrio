import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Sparkles, Users } from "lucide-react";
import { getAgentes } from "@/server/queries/agentes";

export const metadata: Metadata = {
  title: "Nosotros · Atrio",
  description:
    "Quiénes somos en Atrio. Inmobiliaria de Buenos Aires con agentes matriculados, foco en transparencia y respuestas claras.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Información clara",
    text: "Publicamos expensas reales, ABL, antigüedad y estado del título antes de que tengas que preguntar.",
  },
  {
    icon: Users,
    title: "Equipo matriculado",
    text: "Cada agente está inscripto en el Colegio de Corredores. Toda operación tiene un responsable con nombre y matrícula.",
  },
  {
    icon: Sparkles,
    title: "Buen trato",
    text: "Te contestamos rápido, en simple y sin letra chica. Ni promesas vagas ni respuestas evasivas.",
  },
];

export default async function NosotrosPage() {
  const agentes = await getAgentes();

  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-[1320px] px-6 pt-20 pb-16 md:px-10 md:pt-28 md:pb-20">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Nosotros
        </div>
        <h1 className="max-w-[860px] text-5xl font-light leading-[1.05] tracking-[-0.03em] md:text-7xl">
          Una inmobiliaria <strong className="font-semibold">como tiene que ser.</strong>
        </h1>
        <p className="mt-8 max-w-[560px] text-lg leading-relaxed text-ink-muted">
          Atrio nació en Buenos Aires con una idea simple: tratar a quien busca
          o vende su casa con la honestidad y el cuidado que el momento merece.
          Sin sorpresas, sin presiones, sin letra chica.
        </p>
      </section>

      {/* VALUES */}
      <section className="border-y border-line-soft bg-bg-soft">
        <div className="mx-auto max-w-[1320px] px-6 py-20 md:px-10">
          <div className="mb-12 max-w-[680px]">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Cómo trabajamos
            </div>
            <h2 className="text-4xl font-light leading-tight tracking-tight md:text-[44px]">
              Tres principios <strong className="font-semibold">que no negociamos.</strong>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="rounded-2xl border border-line bg-white p-8"
                >
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-deep">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="mb-2.5 text-lg font-semibold">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-muted">{v.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="mx-auto max-w-[1320px] px-6 py-24 md:px-10">
        <div className="mb-12 max-w-[680px]">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Equipo
          </div>
          <h2 className="text-4xl font-light leading-tight tracking-tight md:text-[44px]">
            Quiénes te <strong className="font-semibold">van a atender.</strong>
          </h2>
        </div>
        {agentes.length === 0 ? (
          <p className="text-sm text-ink-muted">
            Estamos cargando el equipo. En breve, acá vas a ver al equipo de Atrio.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {agentes.map((a) => (
              <article key={a.id} className="group">
                <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-2xl bg-bg-soft">
                  {a.foto_url ? (
                    <Image
                      src={a.foto_url}
                      alt={a.nombre}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-faint text-3xl font-semibold text-brand-deep">
                      {a.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold">{a.nombre}</h3>
                {a.matricula && (
                  <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-ink-muted">
                    CUCICBA {a.matricula}
                  </p>
                )}
                {a.bio && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted line-clamp-3">
                    {a.bio}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-line-soft bg-bg-soft">
        <div className="mx-auto max-w-[1320px] px-6 py-16 md:px-10 md:py-20">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-[580px]">
              <h2 className="text-3xl font-light leading-tight tracking-tight md:text-4xl">
                ¿Querés <strong className="font-semibold">trabajar con nosotros?</strong>
              </h2>
              <p className="mt-3 text-sm text-ink-muted">
                Te respondemos en menos de 2 horas en horario laboral.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contacto"
                className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
              >
                Contactanos
              </Link>
              <Link
                href="/tasaciones"
                className="rounded-full border-[1.5px] border-line bg-white px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
              >
                Pedir tasación
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

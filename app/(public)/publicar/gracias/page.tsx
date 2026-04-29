import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Propiedad enviada · Atrio",
};

export default function GraciasPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[640px] flex-col items-center justify-center px-6 py-16 text-center md:px-10">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand-deep">
        <CheckCircle2 className="h-7 w-7" strokeWidth={1.8} />
      </div>
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        Recibido
      </div>
      <h1 className="text-4xl font-light leading-tight tracking-tight md:text-5xl">
        Tu propiedad está <strong className="font-semibold">en revisión.</strong>
      </h1>
      <p className="mt-5 max-w-[500px] text-base leading-relaxed text-ink-muted">
        Un agente de Atrio la revisa, ajusta lo que haga falta y se contacta
        con vos antes de publicarla. Si todo está en orden, la vas a ver online
        en menos de 48 horas.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/comprar"
          className="rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          Mientras tanto, mirá lo que hay
        </Link>
        <Link
          href="/contacto"
          className="rounded-full border-[1.5px] border-line bg-white px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
        >
          Hablar con alguien
        </Link>
      </div>
    </section>
  );
}

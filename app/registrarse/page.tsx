import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/forms/signup-form";
import type { RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Crear cuenta · Atrio",
  description:
    "Creá tu cuenta para publicar tu propiedad o seguir el estado de una operación.",
};

export default async function RegistrarsePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" ? sp.next : undefined;

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[480px] flex-col justify-center px-6 py-16 md:px-10">
      <div className="mb-10 text-center">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Cuenta nueva
        </div>
        <h1 className="text-3xl font-light leading-tight tracking-tight md:text-4xl">
          Creá tu <strong className="font-semibold">cuenta.</strong>
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          Vas a poder publicar tu propiedad y seguir el estado de la operación.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-white p-8">
        <SignUpForm next={next} />
      </div>

      <p className="mt-6 text-center text-xs text-ink-muted">
        ¿Ya tenés cuenta?{" "}
        <Link
          href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-brand-deep hover:underline"
        >
          Iniciar sesión
        </Link>
        .
      </p>
    </section>
  );
}

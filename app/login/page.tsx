import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
import type { RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Iniciar sesión · Atrio",
  description: "Acceso al panel para inmobiliarias y agentes de Atrio.",
};

export default async function LoginPage({
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
          Acceso
        </div>
        <h1 className="text-3xl font-light leading-tight tracking-tight md:text-4xl">
          Iniciar <strong className="font-semibold">sesión.</strong>
        </h1>
        <p className="mt-3 text-sm text-ink-muted">
          Acceso restringido para agentes de Atrio.
        </p>
      </div>

      <div className="rounded-2xl border border-line bg-white p-8">
        <LoginForm next={next} />
      </div>

      <p className="mt-6 text-center text-xs text-ink-muted">
        ¿No tenés cuenta?{" "}
        <Link href="/contacto" className="font-semibold text-brand-deep hover:underline">
          Hablemos
        </Link>
        .
      </p>
    </section>
  );
}

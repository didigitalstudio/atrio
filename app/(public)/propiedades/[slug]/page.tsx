import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  Home as HomeIcon,
  MapPin,
  MessageCircle,
  Ruler,
  Sparkles,
  CalendarClock,
} from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import type { Propiedad } from "@/lib/types";
import { getAgenteById } from "@/server/queries/agentes";
import { getPropertyBySlug } from "@/server/queries/properties";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPropertyBySlug(slug);
  if (!p) return { title: "Propiedad no encontrada · Atrio" };
  return {
    title: `${p.titulo} · Atrio`,
    description:
      p.descripcion?.slice(0, 160) ??
      `${p.titulo} en ${p.zona.nombre}. ${p.ambientes} amb · ${p.m2_cubiertos ?? "—"} m².`,
    openGraph: p.fotos[0]
      ? {
          images: [{ url: p.fotos[0].url, alt: p.fotos[0].alt }],
        }
      : undefined,
  };
}

function formatPrice(p: Propiedad): { main: string; suffix?: string } {
  const fmt = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
  const main =
    p.moneda === "USD"
      ? `USD ${fmt.format(p.precio)}`
      : `$ ${fmt.format(p.precio)}`;
  const suffix =
    p.operacion === "alquiler" || p.operacion === "alquiler_temporario"
      ? "/mes"
      : undefined;
  return { main, suffix };
}

function operacionLabel(op: Propiedad["operacion"]): string {
  return op === "venta"
    ? "Venta"
    : op === "alquiler"
      ? "Alquiler"
      : "Temporario";
}

function tipoLabel(tipo: Propiedad["tipo"]): string {
  const map: Record<Propiedad["tipo"], string> = {
    departamento: "Departamento",
    casa: "Casa",
    ph: "PH",
    terreno: "Terreno",
    local: "Local",
    oficina: "Oficina",
    cochera: "Cochera",
    emprendimiento: "Emprendimiento",
  };
  return map[tipo];
}

function whatsappHref(numero: string | null, propiedad: Propiedad): string | null {
  if (!numero) return null;
  const digits = numero.replace(/\D/g, "");
  if (!digits) return null;
  const msg = `Hola, me interesa la propiedad "${propiedad.titulo}" (${propiedad.zona.nombre}).`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}

export default async function PropiedadPage({ params }: { params: Params }) {
  const { slug } = await params;
  const propiedad = await getPropertyBySlug(slug);
  if (!propiedad) notFound();

  const agente = propiedad.agente_id
    ? await getAgenteById(propiedad.agente_id)
    : null;

  const price = formatPrice(propiedad);
  const fotos = propiedad.fotos.length > 0 ? propiedad.fotos : [];
  const wa = agente ? whatsappHref(agente.whatsapp ?? agente.telefono, propiedad) : null;

  return (
    <>
      {/* GALLERY */}
      <section className="border-b border-line-soft bg-bg-soft">
        <div className="mx-auto max-w-[1440px] px-2 py-2 md:px-4 md:py-4">
          {fotos.length === 0 ? (
            <div className="aspect-[16/7] rounded-2xl bg-bg-deep" aria-hidden />
          ) : (
            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto rounded-2xl scrollbar-thin md:gap-3">
              {fotos.map((f, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] w-[88vw] shrink-0 snap-start overflow-hidden rounded-2xl bg-bg-deep md:aspect-[16/9] md:w-[min(960px,80vw)]"
                >
                  <Image
                    src={f.url}
                    alt={f.alt}
                    fill
                    sizes="(max-width: 768px) 88vw, 80vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HEADER + BODY */}
      <section className="mx-auto max-w-[1320px] px-6 py-12 md:px-10 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          {/* MAIN */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-brand-deep">
                {operacionLabel(propiedad.operacion)}
              </span>
              <span className="inline-flex items-center rounded-full border border-line bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                {tipoLabel(propiedad.tipo)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                <MapPin className="h-3.5 w-3.5" />
                {propiedad.zona.nombre}
              </span>
            </div>

            <h1 className="text-3xl font-light leading-tight tracking-tight md:text-5xl">
              {propiedad.titulo}
            </h1>
            <p className="mt-2 text-sm text-ink-muted">{propiedad.direccion}</p>

            <div className="mt-6 flex items-baseline gap-2 border-y border-line py-6">
              <div className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
                {price.main}
              </div>
              {price.suffix && (
                <div className="text-base text-ink-muted">{price.suffix}</div>
              )}
              {propiedad.expensas !== null && (
                <div className="ml-auto text-right text-xs text-ink-muted">
                  Expensas
                  <div className="text-sm font-semibold text-ink">
                    {propiedad.expensas_moneda === "USD" ? "USD " : "$ "}
                    {new Intl.NumberFormat("es-AR").format(propiedad.expensas)}
                  </div>
                </div>
              )}
            </div>

            {/* QUICK FACTS */}
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              <Fact icon={HomeIcon} label="Ambientes" value={String(propiedad.ambientes)} />
              {propiedad.dormitorios > 0 && (
                <Fact icon={Building2} label="Dormitorios" value={String(propiedad.dormitorios)} />
              )}
              {propiedad.m2_cubiertos !== null && (
                <Fact icon={Ruler} label="m² cubiertos" value={String(propiedad.m2_cubiertos)} />
              )}
              {propiedad.m2_totales !== null && (
                <Fact icon={Ruler} label="m² totales" value={String(propiedad.m2_totales)} />
              )}
              {propiedad.antiguedad !== null && (
                <Fact
                  icon={CalendarClock}
                  label="Antigüedad"
                  value={`${propiedad.antiguedad} años`}
                />
              )}
              {propiedad.banos > 0 && (
                <Fact icon={Building2} label="Baños" value={String(propiedad.banos)} />
              )}
            </dl>

            {/* DESCRIPTION */}
            {propiedad.descripcion && (
              <div className="mt-12">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                  Descripción
                </h2>
                <p className="whitespace-pre-line text-base leading-relaxed text-ink-soft">
                  {propiedad.descripcion}
                </p>
              </div>
            )}

            {/* FEATURES */}
            {propiedad.features.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                  Características
                </h2>
                <div className="flex flex-wrap gap-2">
                  {propiedad.features.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] text-ink-soft"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-brand" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {propiedad.apto_credito && (
              <div className="mt-10 rounded-2xl border border-brand/20 bg-brand-faint p-5 text-sm text-brand-deep">
                <strong className="font-semibold">Apto crédito.</strong> Tenés
                escritura al día, sin deudas y con título perfecto para acceder
                a financiación bancaria.
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            {agente && (
              <div className="rounded-2xl border border-line bg-white p-6">
                <div className="flex items-center gap-4">
                  {agente.foto_url ? (
                    <Image
                      src={agente.foto_url}
                      alt={agente.nombre}
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-faint text-base font-semibold text-brand-deep">
                      {agente.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                      Te atiende
                    </div>
                    <div className="text-base font-semibold">{agente.nombre}</div>
                    {agente.matricula && (
                      <div className="text-xs text-ink-muted">
                        CUCICBA {agente.matricula}
                      </div>
                    )}
                  </div>
                </div>

                {wa && (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 flex h-11 items-center justify-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={2} />
                    WhatsApp directo
                  </a>
                )}
              </div>
            )}

            <div className="rounded-2xl border border-line bg-white p-6">
              <h3 className="mb-1 text-base font-semibold">Consultar online</h3>
              <p className="mb-5 text-sm text-ink-muted">
                Te respondemos en menos de 2 horas.
              </p>
              <ContactForm
                propiedadId={propiedad.id}
                defaultMensaje={`Hola, me interesa "${propiedad.titulo}" en ${propiedad.zona.nombre}. ¿Podemos coordinar una visita?`}
                submitLabel="Enviar consulta"
              />
            </div>

            <div className="rounded-2xl bg-bg-soft p-5 text-sm text-ink-muted">
              <strong className="font-semibold text-ink">Volver a buscar:</strong>{" "}
              <Link
                href="/comprar"
                className="text-brand-deep hover:underline"
              >
                comprar
              </Link>
              {" · "}
              <Link
                href="/alquilar"
                className="text-brand-deep hover:underline"
              >
                alquilar
              </Link>
              {" · "}
              <Link
                href="/temporario"
                className="text-brand-deep hover:underline"
              >
                temporario
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

type IconType = React.ComponentType<{ className?: string; strokeWidth?: number }>;

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: IconType;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="mb-1 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand-deep">
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </div>
      <div className="text-base font-semibold text-ink">{value}</div>
    </div>
  );
}

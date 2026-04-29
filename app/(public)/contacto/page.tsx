import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contacto · Atrio",
  description:
    "Escribinos. Te respondemos en menos de 2 horas en horario laboral.",
};

const CONTACT_BLOCKS = [
  {
    icon: MapPin,
    title: "Dónde estamos",
    text: "Av. Corrientes 1234, CABA",
    href: "https://maps.google.com/?q=Av.+Corrientes+1234,+CABA",
    cta: "Ver en mapa",
  },
  {
    icon: Phone,
    title: "Teléfono",
    text: "+54 11 4123 4567",
    href: "tel:+541141234567",
    cta: "Llamar",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    text: "+54 9 11 4123 4567",
    href: "https://wa.me/5491141234567",
    cta: "Escribir",
  },
  {
    icon: Mail,
    title: "Email",
    text: "hola@atrio.com.ar",
    href: "mailto:hola@atrio.com.ar",
    cta: "Enviar",
  },
];

export default function ContactoPage() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-[1320px] px-6 pt-20 pb-12 md:px-10 md:pt-28 md:pb-16">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Contacto
        </div>
        <h1 className="max-w-[820px] text-4xl font-light leading-[1.1] tracking-tight md:text-6xl">
          Escribinos y <strong className="font-semibold">te contestamos rápido.</strong>
        </h1>
        <p className="mt-6 max-w-[540px] text-lg leading-relaxed text-ink-muted">
          Sin formularios infinitos ni respuestas automáticas. Una persona del
          equipo te contesta en menos de 2 horas en horario laboral.
        </p>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-[1320px] px-6 pb-24 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_440px]">
          {/* FORM */}
          <div className="rounded-2xl border border-line bg-white p-8 md:p-10">
            <h2 className="mb-2 text-2xl font-semibold">Mandanos un mensaje</h2>
            <p className="mb-8 text-sm text-ink-muted">
              Todos los campos son obligatorios.
            </p>
            <ContactForm />
          </div>

          {/* INFO */}
          <aside className="space-y-4">
            {CONTACT_BLOCKS.map((b) => {
              const Icon = b.icon;
              return (
                <a
                  key={b.title}
                  href={b.href}
                  target={b.href.startsWith("http") ? "_blank" : undefined}
                  rel={b.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group flex items-start gap-4 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-ink"
                >
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-deep">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                      {b.title}
                    </div>
                    <div className="mt-0.5 text-sm font-medium text-ink">{b.text}</div>
                    <div className="mt-1 text-xs font-semibold text-brand-deep group-hover:text-brand">
                      {b.cta} →
                    </div>
                  </div>
                </a>
              );
            })}
          </aside>
        </div>
      </section>
    </>
  );
}

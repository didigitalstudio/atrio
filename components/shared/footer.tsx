import Link from "next/link";

const COLUMNS = [
  {
    title: "Propiedades",
    links: [
      { href: "/comprar", label: "Comprar" },
      { href: "/alquilar", label: "Alquilar" },
      { href: "/temporario", label: "Alquiler temporario" },
      { href: "/emprendimientos", label: "Emprendimientos" },
      { href: "/tasaciones", label: "Tasaciones" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/nosotros", label: "Nosotros" },
      { href: "/agentes", label: "Agentes" },
      { href: "/sumate", label: "Sumate al equipo" },
      { href: "/blog", label: "Blog" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
  {
    title: "Legales",
    links: [
      { href: "/legales/terminos", label: "Términos y condiciones" },
      { href: "/legales/privacidad", label: "Política de privacidad" },
      { href: "/legales/defensa-consumidor", label: "Defensa al consumidor" },
      { href: "/legales/matricula", label: "Matrícula CUCICBA" },
    ],
  },
];

const SEO_LINKS = [
  { href: "/buscar?op=venta&tipo=departamento&zona=caballito", label: "Departamentos en venta en Caballito" },
  { href: "/buscar?op=alquiler&tipo=departamento&zona=palermo", label: "Departamentos en alquiler en Palermo" },
  { href: "/buscar?op=venta&tipo=casa&zona=devoto", label: "Casas en venta en Devoto" },
  { href: "/buscar?op=venta&amb=2&zona=almagro", label: "2 ambientes en Almagro" },
  { href: "/buscar?op=venta&amb=3&zona=belgrano", label: "3 ambientes en Belgrano" },
  { href: "/buscar?op=alquiler&tipo=casa&zona=san-isidro", label: "Casas en alquiler en San Isidro" },
  { href: "/buscar?op=venta&apto-credito=1&zona=caba", label: "Departamentos aptos crédito en CABA" },
  { href: "/buscar?op=venta&tipo=ph&zona=villa-urquiza", label: "PH en venta en Villa Urquiza" },
  { href: "/buscar?op=venta&amb=1&zona=recoleta", label: "Monoambientes en Recoleta" },
  { href: "/buscar?op=venta&estrenar=1&zona=nunez", label: "Departamentos a estrenar en Núñez" },
  { href: "/buscar?op=venta&tipo=casa&cochera=1&zona=vicente-lopez", label: "Casas con cochera en Vicente López" },
  { href: "/buscar?op=venta&balcon=1&zona=villa-crespo", label: "Departamentos con balcón en Villa Crespo" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg-soft px-6 pt-16 pb-10 md:px-10">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-8 border-b border-line pb-12 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-12">
          <div>
            <div className="mb-4 text-[22px] font-bold tracking-tight">
              Atrio<span className="text-brand">.</span>
            </div>
            <p className="mb-6 max-w-[280px] text-sm leading-relaxed text-ink-soft">
              Inmobiliaria con base en Buenos Aires. Compra, venta y alquiler de propiedades en Capital y GBA.
            </p>
            <address className="text-[13px] leading-relaxed not-italic text-ink-soft">
              <strong className="mb-1 block font-semibold text-ink">
                Av. Corrientes 1234, CABA
              </strong>
              +54 11 4567-8900<br />
              hola@atrio.com.ar
            </address>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-ink">
                {col.title}
              </h4>
              <ul className="flex list-none flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-ink-soft transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-b border-line py-8">
          <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted">
            Búsquedas más frecuentes
          </h4>
          <div className="flex flex-wrap gap-x-[18px] gap-y-1.5">
            {SEO_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-ink-soft transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-6 text-xs text-ink-muted sm:flex-row sm:items-center">
          <div>© 2026 Atrio Inmobiliaria · CUCICBA Mat. 0000</div>
          <div className="flex gap-6">
            <Link href="/info-consumidor" className="hover:text-brand">
              Información al consumidor
            </Link>
            <Link href="/arrepentimiento" className="hover:text-brand">
              Botón de arrepentimiento
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

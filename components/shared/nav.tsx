import Link from "next/link";

const NAV_LINKS = [
  { href: "/comprar", label: "Comprar" },
  { href: "/alquilar", label: "Alquilar" },
  { href: "/vender", label: "Vender" },
  { href: "/emprendimientos", label: "Emprendimientos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-line-soft bg-white/[0.92] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-12 px-6 py-[18px] md:px-10">
        <Link
          href="/"
          className="text-[22px] font-bold tracking-tight"
          aria-label="Atrio · ir al inicio"
        >
          Atrio<span className="text-brand">.</span>
        </Link>

        <ul className="hidden flex-1 list-none gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-ink py-2.5 hidden sm:inline-block"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/publicar"
            className="rounded-full bg-ink px-[22px] py-[11px] text-sm font-semibold text-white transition-colors hover:bg-black"
          >
            Publicar propiedad
          </Link>
        </div>
      </div>
    </nav>
  );
}

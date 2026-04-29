import type { Metadata } from "next";
import Image from "next/image";
import { Plus } from "lucide-react";
import { AgenteForm } from "@/components/forms/agente-form";
import { InlineStatusForm } from "@/components/admin/inline-status-form";
import { getAllAgentes } from "@/server/queries/agentes";
import { toggleAgenteActivo } from "@/server/actions/admin";

export const metadata: Metadata = { title: "Equipo · Panel · Atrio" };

const ACTIVO_OPTIONS = [
  { value: "true", label: "Activo" },
  { value: "false", label: "Inactivo" },
];

export default async function AdminEquipoPage() {
  const items = await getAllAgentes();

  return (
    <div className="px-6 py-10 md:px-10 md:py-12">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        Equipo
      </div>
      <h1 className="text-3xl font-light leading-tight tracking-tight md:text-4xl">
        <strong className="font-semibold">{items.length}</strong>{" "}
        {items.length === 1 ? "agente" : "agentes"}
      </h1>

      <details className="group mt-8 rounded-2xl border border-line bg-white">
        <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-semibold">
          <span className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4 transition-transform group-open:rotate-45" strokeWidth={2} />
            Agregar agente
          </span>
          <span className="text-xs text-ink-muted">Tocá para abrir</span>
        </summary>
        <div className="border-t border-line p-6 md:p-8">
          <AgenteForm />
        </div>
      </details>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-white p-12 text-center text-sm text-ink-muted">
          Aún no hay agentes cargados.
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-bg-soft">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                <th className="px-5 py-3">Agente</th>
                <th className="px-5 py-3">Contacto</th>
                <th className="px-5 py-3">Matrícula</th>
                <th className="px-5 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className="border-t border-line-soft">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {a.foto_url ? (
                        <Image
                          src={a.foto_url}
                          alt={a.nombre}
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-faint text-xs font-semibold text-brand-deep">
                          {a.nombre
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-ink">{a.nombre}</div>
                        {a.bio && (
                          <div className="line-clamp-1 text-xs text-ink-muted max-w-[280px]">
                            {a.bio}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs">
                    <a
                      href={`mailto:${a.email}`}
                      className="block text-ink-muted hover:text-brand-deep"
                    >
                      {a.email}
                    </a>
                    {a.telefono && (
                      <a
                        href={`tel:${a.telefono}`}
                        className="block text-ink-muted hover:text-brand-deep"
                      >
                        {a.telefono}
                      </a>
                    )}
                  </td>
                  <td className="px-5 py-3 text-xs text-ink-soft">
                    {a.matricula ? `CUCICBA ${a.matricula}` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <InlineStatusForm
                      action={toggleAgenteActivo}
                      id={a.id}
                      current={String(a.activo)}
                      options={ACTIVO_OPTIONS}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

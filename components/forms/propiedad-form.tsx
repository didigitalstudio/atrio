"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MONEDAS,
  OPERACIONES,
  TIPOS_PROPIEDAD,
  propiedadSchema,
  type PropiedadInput,
} from "@/lib/schemas/propiedad";
import type { ZonaResumen } from "@/lib/types";
import { createPropiedad, updatePropiedad } from "@/server/actions/admin";

const TIPO_LABEL: Record<(typeof TIPOS_PROPIEDAD)[number], string> = {
  departamento: "Departamento",
  casa: "Casa",
  ph: "PH",
  terreno: "Terreno",
  local: "Local",
  oficina: "Oficina",
  cochera: "Cochera",
  emprendimiento: "Emprendimiento",
};

const OP_LABEL: Record<(typeof OPERACIONES)[number], string> = {
  venta: "Venta",
  alquiler: "Alquiler",
  alquiler_temporario: "Alquiler temporario",
};

const inputCls = "h-11 rounded-[10px] px-3 text-sm";
const selectCls =
  "h-11 w-full rounded-[10px] border border-line bg-white px-3 text-sm text-ink outline-none transition-colors hover:border-ink-faint focus:border-brand focus:ring-2 focus:ring-brand/15";

type Props = {
  zonas: ZonaResumen[];
  /** Si está presente, el form pasa a modo edición. */
  propiedadId?: string;
  initialValues?: Partial<PropiedadInput>;
};

export function PropiedadForm({ zonas, propiedadId, initialValues }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isEdit = Boolean(propiedadId);

  const form = useForm<PropiedadInput>({
    resolver: zodResolver(propiedadSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      tipo: "departamento",
      operacion: "venta",
      direccion: "",
      zonaId: zonas[0]?.id ?? "",
      ambientes: "",
      dormitorios: "",
      banos: "",
      m2Cubiertos: "",
      m2Totales: "",
      antiguedad: "",
      precio: "",
      moneda: "USD",
      expensas: "",
      expensasMoneda: undefined,
      aptoCredito: false,
      features: "",
      fotoUrl: "",
      ...initialValues,
    },
  });

  const onSubmit = (values: PropiedadInput) => {
    startTransition(async () => {
      const result = isEdit
        ? await updatePropiedad(propiedadId!, values)
        : await createPropiedad(values);

      if (!result.ok) {
        toast.error(
          isEdit ? "No pudimos guardar los cambios" : "No pudimos crear la propiedad",
          { description: result.error }
        );
        return;
      }

      if (isEdit) {
        toast.success("Cambios guardados", {
          description: "Listo. Los cambios ya están publicados.",
        });
        router.refresh();
        return;
      }

      // result viene de createPropiedad: trae pendingReview.
      if ("pendingReview" in result && result.pendingReview) {
        // Submission de cliente → pasa a revisión.
        router.push("/publicar/gracias");
        router.refresh();
      } else {
        toast.success("Propiedad creada", {
          description: "Está en estado borrador. Pasala a activa cuando esté lista.",
        });
        router.push("/admin/propiedades");
        router.refresh();
      }
    });
  };

  const numberInput = (name: keyof PropiedadInput, placeholder: string) =>
    function NumberRender({ field }: { field: { value: unknown; onChange: (v: string) => void; onBlur: () => void; name: string; ref: (instance: HTMLInputElement | null) => void } }) {
      return (
        <FormControl>
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder={placeholder}
            className={inputCls}
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            value={(field.value as string | undefined) ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
          />
        </FormControl>
      );
    };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-7"
        noValidate
      >
        {/* Datos básicos */}
        <Section title="Información básica">
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Departamento luminoso de 2 ambientes con balcón"
                    className={inputCls}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <select className={selectCls} {...field}>
                      {TIPOS_PROPIEDAD.map((t) => (
                        <option key={t} value={t}>
                          {TIPO_LABEL[t]}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="operacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operación</FormLabel>
                  <FormControl>
                    <select className={selectCls} {...field}>
                      {OPERACIONES.map((o) => (
                        <option key={o} value={o}>
                          {OP_LABEL[o]}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Calle y altura"
                    className={inputCls}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zonaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zona</FormLabel>
                <FormControl>
                  <select className={selectCls} {...field}>
                    {zonas.length === 0 && <option value="">— sin zonas —</option>}
                    {zonas.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.nombre}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="Texto que verá el comprador. Sé específico: orientación, ascensor, comodidades, particularidades."
                    className="rounded-[10px] px-3 py-2.5 text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Section>

        {/* Detalles */}
        <Section title="Detalles">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            <FormField
              control={form.control}
              name="ambientes"
              render={numberInput("ambientes", "3")}
            />
            <FormField
              control={form.control}
              name="dormitorios"
              render={numberInput("dormitorios", "2")}
            />
            <FormField
              control={form.control}
              name="banos"
              render={numberInput("banos", "1")}
            />
            <FormField
              control={form.control}
              name="antiguedad"
              render={numberInput("antiguedad", "12")}
            />
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="m2Cubiertos"
              render={numberInput("m2Cubiertos", "65")}
            />
            <FormField
              control={form.control}
              name="m2Totales"
              render={numberInput("m2Totales", "70")}
            />
          </div>
        </Section>

        {/* Precio */}
        <Section title="Precio">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_140px]">
            <FormField
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="165000"
                      className={inputCls}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="moneda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moneda</FormLabel>
                  <FormControl>
                    <select className={selectCls} {...field}>
                      {MONEDAS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_140px]">
            <FormField
              control={form.control}
              name="expensas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expensas (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="285000"
                      className={inputCls}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expensasMoneda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moneda</FormLabel>
                  <FormControl>
                    <select
                      className={selectCls}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value === "" ? undefined : e.target.value)
                      }
                    >
                      <option value="">—</option>
                      {MONEDAS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Section>

        {/* Extras */}
        <Section title="Extras">
          <FormField
            control={form.control}
            name="aptoCredito"
            render={({ field }) => (
              <FormItem>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-4 py-3">
                  <input
                    type="checkbox"
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 accent-brand"
                  />
                  <span className="text-sm font-medium">Apto crédito hipotecario</span>
                </label>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Características destacadas</FormLabel>
                <FormControl>
                  <Input
                    placeholder="balcon, luminoso, vista_despejada"
                    className={inputCls}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Separadas por coma. Aparecen como chips en el detalle.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fotoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foto principal (URL)</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://..."
                    className={inputCls}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Por ahora pegamos la URL directo. La carga a Storage queda para una iteración próxima.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Section>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="text-xs text-ink-muted">
            {isEdit
              ? "Los cambios se guardan al instante."
              : "Se guarda como "}
            {!isEdit && <strong className="font-semibold">borrador</strong>}
            {!isEdit && ". La activás desde el panel cuando esté lista."}
          </p>
          <button
            type="submit"
            disabled={pending}
            className="h-11 rounded-full bg-brand px-7 text-sm font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear propiedad"}
          </button>
        </div>
      </form>
    </Form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-6 md:p-8">
      <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

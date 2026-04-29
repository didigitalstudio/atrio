"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  TIPOS_TASACION,
  tasacionSchema,
  type TasacionInput,
} from "@/lib/schemas/tasacion";
import { createTasacion } from "@/server/actions/tasaciones";

const TIPO_LABEL: Record<(typeof TIPOS_TASACION)[number], string> = {
  departamento: "Departamento",
  casa: "Casa",
  ph: "PH",
  terreno: "Terreno",
  local: "Local",
  oficina: "Oficina",
};

const inputCls = "h-11 rounded-[10px] px-3 text-sm";
const selectCls =
  "h-11 w-full rounded-[10px] border border-line bg-white px-3 text-sm text-ink outline-none transition-colors hover:border-ink-faint focus:border-brand focus:ring-2 focus:ring-brand/15";

export function TasacionForm() {
  const [pending, startTransition] = useTransition();

  const form = useForm<TasacionInput>({
    resolver: zodResolver(tasacionSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
      tipo: "departamento",
      ambientes: "",
      m2: "",
      comentarios: "",
    },
  });

  const onSubmit = (values: TasacionInput) => {
    startTransition(async () => {
      const result = await createTasacion(values);
      if (result.ok) {
        toast.success("Solicitud enviada", {
          description: "Te contactamos en menos de 48 horas.",
        });
        form.reset();
      } else {
        toast.error("No pudimos enviar tu solicitud", {
          description: result.error,
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre y apellido</FormLabel>
              <FormControl>
                <Input
                  placeholder="Cómo te llamás"
                  className={inputCls}
                  autoComplete="name"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="vos@email.com"
                    className={inputCls}
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="11 1234 5678"
                    className={inputCls}
                    autoComplete="tel"
                    {...field}
                  />
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
              <FormLabel>Dirección de la propiedad</FormLabel>
              <FormControl>
                <Input
                  placeholder="Calle y altura, barrio"
                  className={inputCls}
                  autoComplete="street-address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <select className={selectCls} {...field}>
                    {TIPOS_TASACION.map((t) => (
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
            name="ambientes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ambientes</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    placeholder="3"
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
            name="m2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>m² aproximados</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={10}
                    placeholder="65"
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
        </div>

        <FormField
          control={form.control}
          name="comentarios"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentarios (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Antigüedad, estado de la propiedad, ABL al día, lo que quieras contarnos."
                  rows={4}
                  className="rounded-[10px] px-3 py-2.5 text-sm"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-full bg-brand px-7 text-sm font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Solicitar tasación"}
        </button>
      </form>
    </Form>
  );
}

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
import { agenteSchema, type AgenteInput } from "@/lib/schemas/agente";
import { createAgente } from "@/server/actions/admin";

const inputCls = "h-11 rounded-[10px] px-3 text-sm";

export function AgenteForm() {
  const [pending, startTransition] = useTransition();

  const form = useForm<AgenteInput>({
    resolver: zodResolver(agenteSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      whatsapp: "",
      matricula: "",
      fotoUrl: "",
      bio: "",
    },
  });

  const onSubmit = (values: AgenteInput) => {
    startTransition(async () => {
      const result = await createAgente(values);
      if (result.ok) {
        toast.success("Agente agregado");
        form.reset();
      } else {
        toast.error("No pudimos agregarlo", { description: result.error });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre y apellido</FormLabel>
                <FormControl>
                  <Input className={inputCls} placeholder="Nombre completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className={inputCls} placeholder="agente@atrio.com.ar" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input type="tel" className={inputCls} placeholder="11 1234 5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input type="tel" className={inputCls} placeholder="+54 9 11 1234 5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="matricula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matrícula CUCICBA</FormLabel>
                <FormControl>
                  <Input className={inputCls} placeholder="7654" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="fotoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto (URL)</FormLabel>
              <FormControl>
                <Input type="url" className={inputCls} placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  className="rounded-[10px] px-3 py-2.5 text-sm"
                  placeholder="Una línea o dos. Aparece en /nosotros."
                  {...field}
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
          {pending ? "Agregando…" : "Agregar agente"}
        </button>
      </form>
    </Form>
  );
}

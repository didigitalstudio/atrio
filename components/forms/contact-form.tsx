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
import { leadSchema, type LeadInput } from "@/lib/schemas/lead";
import { createLead } from "@/server/actions/leads";

type Props = {
  propiedadId?: string;
  /** Default mensaje (ej: "Quiero más info de Piso alto en Caballito"). */
  defaultMensaje?: string;
  submitLabel?: string;
};

export function ContactForm({
  propiedadId,
  defaultMensaje,
  submitLabel = "Enviar mensaje",
}: Props) {
  const [pending, startTransition] = useTransition();

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      mensaje: defaultMensaje ?? "",
      propiedadId,
    },
  });

  const onSubmit = (values: LeadInput) => {
    startTransition(async () => {
      const result = await createLead(values);
      if (result.ok) {
        toast.success("Mensaje enviado", {
          description: "Te contactamos en menos de 2 horas en horario laboral.",
        });
        form.reset({
          nombre: "",
          email: "",
          telefono: "",
          mensaje: defaultMensaje ?? "",
          propiedadId,
        });
      } else {
        toast.error("No pudimos enviar tu mensaje", {
          description: result.error,
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre y apellido</FormLabel>
              <FormControl>
                <Input
                  placeholder="Cómo te llamás"
                  className="h-11 rounded-[10px] px-3 text-sm"
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
                    className="h-11 rounded-[10px] px-3 text-sm"
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
                    className="h-11 rounded-[10px] px-3 text-sm"
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
          name="mensaje"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensaje</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Contanos qué estás buscando."
                  rows={5}
                  className="rounded-[10px] px-3 py-2.5 text-sm"
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
          {pending ? "Enviando…" : submitLabel}
        </button>
      </form>
    </Form>
  );
}

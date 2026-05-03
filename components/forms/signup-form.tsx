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
import { signUpSchema, type SignUpInput } from "@/lib/schemas/auth";
import { signUp } from "@/server/actions/auth";

const inputCls = "h-11 rounded-[10px] px-3 text-sm";

export function SignUpForm({ next }: { next?: string }) {
  const [pending, startTransition] = useTransition();

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      nombre: "",
      email: "",
      password: "",
      passwordConfirm: "",
      esInmobiliaria: false,
      nombreInmobiliaria: "",
    },
  });

  const esInmobiliaria = form.watch("esInmobiliaria");

  const onSubmit = (values: SignUpInput) => {
    startTransition(async () => {
      const result = await signUp(values, next);
      if (result && !result.ok) {
        toast.error("No pudimos crear tu cuenta", {
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
                  className={inputCls}
                  autoComplete="name"
                  autoFocus
                  {...field}
                />
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  className={inputCls}
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repetí la contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className={inputCls}
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="esInmobiliaria"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="esInmobiliaria"
                  checked={field.value ?? false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-brand"
                />
                <label htmlFor="esInmobiliaria" className="text-sm font-medium leading-none">
                  Soy una inmobiliaria que quiere usar Atrio
                </label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {esInmobiliaria && (
          <FormField
            control={form.control}
            name="nombreInmobiliaria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la inmobiliaria</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Inmobiliaria García"
                    className={inputCls}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <button
          type="submit"
          disabled={pending}
          className="h-11 w-full rounded-full bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Creando cuenta…" : "Crear mi cuenta"}
        </button>
      </form>
    </Form>
  );
}

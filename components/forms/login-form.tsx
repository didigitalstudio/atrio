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
import { loginSchema, type LoginInput } from "@/lib/schemas/auth";
import { signIn } from "@/server/actions/auth";

const inputCls = "h-11 rounded-[10px] px-3 text-sm";

export function LoginForm({ next }: { next?: string }) {
  const [pending, startTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginInput) => {
    startTransition(async () => {
      const result = await signIn(values, next);
      // Si signIn redirige, no llegamos acá. Solo manejamos el caso de error.
      if (result && !result.ok) {
        toast.error("No pudimos iniciarte sesión", {
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className={inputCls}
                  autoComplete="current-password"
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
          className="h-11 w-full rounded-full bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Entrando…" : "Iniciar sesión"}
        </button>
      </form>
    </Form>
  );
}

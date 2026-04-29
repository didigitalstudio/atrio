"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { ActionResult } from "@/server/actions/admin";

type Props = {
  action: (formData: FormData) => Promise<ActionResult>;
  id: string;
  current: string;
  options: { value: string; label: string }[];
  /** Tono visual: usa los tokens de marca por estado. */
  tone?: "neutral" | "brand";
};

const baseCls =
  "h-9 rounded-full border border-line bg-white px-3 pr-7 text-xs font-semibold uppercase tracking-[0.1em] outline-none transition-colors hover:border-ink focus:border-brand focus:ring-2 focus:ring-brand/15";

export function InlineStatusForm({
  action,
  id,
  current,
  options,
  tone = "neutral",
}: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        const newValue = formData.get("estado");
        if (newValue === current) return;
        startTransition(async () => {
          const result = await action(formData);
          if (result.ok) {
            toast.success("Estado actualizado");
          } else {
            toast.error("No pudimos actualizar", { description: result.error });
          }
        });
      }}
    >
      <input type="hidden" name="id" value={id} />
      <select
        name="estado"
        defaultValue={current}
        disabled={pending}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className={`${baseCls} ${
          tone === "brand" ? "text-brand-deep" : "text-ink-soft"
        } ${pending ? "opacity-60" : ""}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </form>
  );
}

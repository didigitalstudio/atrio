"use client";

import { Check, X } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  approvePropiedad,
  rejectPropiedad,
  type ActionResult,
} from "@/server/actions/admin";

export function ReviewActions({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  const wrap =
    (action: (formData: FormData) => Promise<ActionResult>, okMsg: string) =>
    () => {
      startTransition(async () => {
        const fd = new FormData();
        fd.set("id", id);
        const result = await action(fd);
        if (result.ok) {
          toast.success(okMsg);
        } else {
          toast.error("No pudimos hacerlo", { description: result.error });
        }
      });
    };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={wrap(approvePropiedad, "Propiedad publicada")}
        className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Check className="h-3 w-3" strokeWidth={2.5} />
        Aprobar
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={wrap(rejectPropiedad, "Propiedad rechazada")}
        className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        <X className="h-3 w-3" strokeWidth={2.5} />
        Rechazar
      </button>
    </div>
  );
}

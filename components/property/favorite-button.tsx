"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  propiedadId: string;
  initialFavorited?: boolean;
  className?: string;
};

export function FavoriteButton({
  propiedadId,
  initialFavorited = false,
  className,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setFavorited((v) => !v);
        // TODO: persistir a Supabase cuando estén auth + tabla favoritos
      }}
      aria-label={favorited ? "Quitar de favoritos" : "Guardar como favorito"}
      aria-pressed={favorited}
      data-propiedad-id={propiedadId}
      className={cn(
        "flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-110",
        className
      )}
    >
      <Heart
        className={cn(
          "h-[17px] w-[17px] transition-colors",
          favorited ? "fill-brand text-brand" : "text-ink"
        )}
        strokeWidth={1.8}
      />
    </button>
  );
}

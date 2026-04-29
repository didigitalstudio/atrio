import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  basePath: string;
  page: number;
  totalPages: number;
  /**
   * Searchparams ya parseados (sin `page`). Los re-aplicamos a cada link.
   */
  preservedParams: Record<string, string>;
};

function buildHref(
  basePath: string,
  preserved: Record<string, string>,
  page: number
): string {
  const params = new URLSearchParams(preserved);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

function pageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export function PropertyPagination({
  basePath,
  page,
  totalPages,
  preservedParams,
}: Props) {
  if (totalPages <= 1) return null;

  const items = pageRange(page, totalPages);
  const baseLink =
    "h-10 min-w-10 inline-flex items-center justify-center rounded-full border border-line bg-white px-3 text-sm font-medium transition-colors hover:border-ink";

  return (
    <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Paginación">
      {page > 1 ? (
        <Link
          href={buildHref(basePath, preservedParams, page - 1)}
          className={cn(baseLink, "text-ink-soft hover:text-ink")}
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className={cn(baseLink, "cursor-not-allowed text-ink-faint hover:border-line")}
          aria-disabled="true"
        >
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {items.map((item, i) =>
        item === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="px-2 text-sm text-ink-faint"
            aria-hidden
          >
            …
          </span>
        ) : item === page ? (
          <span
            key={item}
            aria-current="page"
            className="h-10 min-w-10 inline-flex items-center justify-center rounded-full bg-ink px-3 text-sm font-semibold text-white"
          >
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={buildHref(basePath, preservedParams, item)}
            className={cn(baseLink, "text-ink-soft hover:text-ink")}
          >
            {item}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link
          href={buildHref(basePath, preservedParams, page + 1)}
          className={cn(baseLink, "text-ink-soft hover:text-ink")}
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span
          className={cn(baseLink, "cursor-not-allowed text-ink-faint hover:border-line")}
          aria-disabled="true"
        >
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

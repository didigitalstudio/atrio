import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/types";

// Cliente Supabase para Server Components, Server Actions y Route Handlers.
// Lee/escribe cookies desde el request actual. En Server Components puros
// la escritura puede fallar silenciosamente (no hay response abierto),
// pero el middleware de auth se encarga del refresh — agregar cuando
// activemos auth.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Llamado desde un Server Component: ignorar.
          }
        },
      },
    }
  );
}

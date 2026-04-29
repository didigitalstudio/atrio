# CLAUDE.md — Atrio

Plataforma SaaS para inmobiliarias argentinas. Compra, alquiler, alquiler temporario, emprendimientos y tasaciones, con foco inicial en CABA y GBA.

> Este archivo es la fuente de verdad para sesiones futuras. Si lo que dice acá entra en conflicto con código viejo, **gana este archivo** y se actualiza el código.

---

## Stack

- **Next.js 16** con App Router, Turbopack, TypeScript estricto.
- **React 19** (incluido por Next).
- **Tailwind CSS 4** — tokens declarados con `@theme` dentro de `app/globals.css`. **No hay `tailwind.config.ts`**.
- **shadcn/ui** estilo `base-nova` (sucesor moderno de New York en la nueva arquitectura). Usa **Base UI** como primitiva (no Radix). Configurado en `components.json`. Los componentes viven en `components/ui/`.
- **Supabase** (Postgres + Auth + Storage). Org `didigitalstudio` (id `gcdhiqhjbpwxfbtftklk`), proyecto `atrio` en region **South America (São Paulo) · sa-east-1**.
- **Manrope** como tipografía única, vía `next/font/google` (weights 300/400/500/600/700). Variable CSS `--font-sans` cargada en `app/layout.tsx`.
- **react-hook-form + zod** para todos los formularios. Validación compartida cliente/servidor con el mismo schema.
- **lucide-react** para íconos.
- **date-fns** para fechas.
- **sonner** para toasts (vía `components/ui/sonner.tsx`).
- **Vercel** para hosting. Team `didigitalstudio` ("DI Digital Studio").
- **GitHub Actions** para CI: typecheck + lint en cada push y PR a `main`.

> ⚠️ Next 16 trae cambios de API. `params` y `searchParams` en pages/layouts son `Promise<...>` y hay que `await`. `PageProps<'/ruta'>` y `LayoutProps<'/ruta'>` son helpers globales (sin import). Antes de tocar APIs de Next, leé `node_modules/next/dist/docs/`.

---

## Sistema de diseño

### Paleta (declarada en `app/globals.css`)

| Token | Valor | Uso |
|---|---|---|
| `--bg` / `bg-bg` | `#FFFFFF` | Fondo principal |
| `--bg-soft` / `bg-bg-soft` | `#F7F7F5` | Bandas secundarias, hovers |
| `--bg-deep` / `bg-bg-deep` | `#EFEEE9` | Énfasis secundario |
| `--ink` / `text-ink` | `#1A1A1A` | Texto principal |
| `--ink-soft` / `text-ink-soft` | `#4A4A48` | Texto secundario |
| `--ink-muted` / `text-ink-muted` | `#6B6B68` | Texto silenciado, captions |
| `--ink-faint` / `text-ink-faint` | `#9A9893` | Placeholders |
| `--line` / `border-line` | `#E8E6E0` | Líneas, bordes inputs |
| `--line-soft` / `border-line-soft` | `#F0EEE8` | Separadores ultra sutiles |
| `--brand` / `bg-brand` | `#1B6B47` | Color de marca · CTAs · focus |
| `--brand-deep` / `bg-brand-deep` | `#0F4A2E` | Hover, fondos verdes amplios |
| `--brand-soft` / `bg-brand-soft` | `#E8F0EC` | Badges, callouts, fondos chips |
| `--brand-faint` / `bg-brand-faint` | `#F4F8F5` | Fondos verdosos muy lavados |
| `--whatsapp` / `bg-whatsapp` | `#25D366` | Solo botones de WhatsApp |

Los tokens shadcn (`--primary`, `--background`, `--border`, `--ring`, etc.) están **mapeados a la paleta Atrio** en `:root`. Eso significa que un componente shadcn que usa `bg-primary` pinta verde brand sin más configuración. **No mezclar paletas.**

### Tipografía

Manrope, una sola familia. Jerarquía por **peso**, no por familia.

| Estilo | Tailwind |
|---|---|
| Display 1 | `text-7xl font-light tracking-tighter` (72/72, -3%) |
| Display 2 | `text-5xl font-normal tracking-tight` (48/50, -2%) — `<strong>` queda 600 |
| H1 UI | `text-[28px] font-bold tracking-tight` (28/34) |
| H2 UI | `text-xl font-semibold` (20/26) |
| Body | `text-base font-normal text-ink-soft` (16/25) |
| Caption | `text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted` |

### Border radius

- **Cards e imágenes grandes**: `rounded-2xl` (16px en este sistema, vía `--radius` × 1.8 = 1.125rem ≈ 18px — dejamos `rounded-2xl` para que se sienta más amplio que `lg`).
- **Botones**: `rounded-full` (pill).
- **Inputs**: `rounded-[10px]` (matchea con `--radius: 0.625rem`).

> El `Button` de shadcn por default usa `rounded-lg`. Para los CTAs de Atrio hay que pasar `className="rounded-full"` o crear una variante. Dejar las decisiones de override centralizadas en el componente de botón compartido si se vuelve repetitivo.

### Sombras (override de Tailwind default)

| Token | Valor |
|---|---|
| `shadow-xs` | `0 1px 2px rgba(15,15,15,.04)` |
| `shadow-sm` | `0 1px 3px rgba(15,15,15,.06), 0 1px 2px rgba(15,15,15,.04)` |
| `shadow-md` | `0 4px 12px -2px rgba(15,15,15,.08), 0 2px 4px -1px rgba(15,15,15,.04)` |
| `shadow-lg` | `0 12px 32px -8px rgba(15,15,15,.12), 0 4px 12px -2px rgba(15,15,15,.06)` |

---

## Convenciones de código

- **Server components por defecto.** `"use client"` SOLO cuando hay interactividad real (hooks, eventos, estado).
- **Server actions** para mutaciones. No abrir API routes salvo para webhooks externos (Stripe, MercadoPago, Resend).
- **Forms = react-hook-form + zod siempre.** El schema de zod es la fuente de verdad de validación, compartido cliente/servidor.
- **Imágenes con `next/image`** (`images.unsplash.com` y `*.supabase.co/storage/...` ya autorizados en `next.config.ts`).
- **Imports absolutos** vía alias `@/`: `@/components`, `@/lib`, `@/server`.
- **Nombres de entidades de negocio en español argentino**: `propiedades`, `leads`, `interacciones`, `agentes`, `zonas`, `tasaciones`.
- **TypeScript estricto, sin `any`.** Si necesitás escapar el tipo, preferí `unknown` y narrow.
- **Toda la UI en español argentino. Usar "vos", no "tú".**
- **`html lang="es-AR"`** en el root layout.
- **`form` no está en el registry de shadcn base-nova.** Cuando lo necesitemos hay que armar a mano el wrapper RHF (FormField/FormItem/FormControl/FormMessage) — patrón de la doc original de shadcn, adaptado a Base UI.

### Estructura de carpetas

```
app/
  (public)/        → rutas públicas (búsqueda, detalle propiedad, etc.)
  (admin)/         → rutas protegidas para inmobiliarias
  page.tsx         → home pública (raíz)
  layout.tsx       → root layout (Manrope, Toaster, etc.)
  globals.css      → tokens Atrio + @theme inline
components/
  property/        → cards, galerías, mapas de propiedades
  search/          → buscador, filtros, resultados
  admin/           → UI de panel inmobiliaria
  shared/          → nav, footer, layout pieces
  ui/              → componentes shadcn (no editar manualmente salvo override)
lib/
  supabase/        → clientes y helpers de Supabase
  utils.ts         → cn() y otros utilitarios
server/
  actions/         → server actions ("use server")
  queries/         → queries (ej: getFeaturedProperties)
supabase/
  migrations/      → SQL versionado
mockups/           → specs visuales (HTML) — referencia, no código a copiar
```

---

## Modelo de datos (PROPUESTO — pendiente de aprobación)

> Este esquema es una propuesta inicial. Antes de escribir migrations en `supabase/migrations/`, validarlo con el dueño del proyecto. Todos los nombres en español, todos los timestamps `timestamptz default now()`, todas las PKs `uuid default gen_random_uuid()`.

### `propiedades`

- `id` uuid pk
- `titulo` text NOT NULL
- `slug` text UNIQUE — para SEO en URLs
- `descripcion` text
- `tipo` enum: `departamento | casa | ph | terreno | local | oficina | cochera | emprendimiento`
- `operacion` enum: `venta | alquiler | alquiler_temporario`
- `estado` enum: `borrador | activa | reservada | cerrada | despublicada` (default `borrador`)
- `direccion` text — string libre, "Av. Rivadavia al 5400"
- `zona_id` uuid FK → `zonas`
- `ambientes` int
- `dormitorios` int
- `baños` int
- `m2_cubiertos` numeric
- `m2_totales` numeric
- `m2_terraza` numeric
- `antiguedad` int — años
- `precio` numeric
- `moneda` enum: `USD | ARS`
- `expensas` numeric (nullable)
- `expensas_moneda` enum: `USD | ARS`
- `abl_incluido` bool default false
- `apto_credito` bool default false
- `destacada` bool default false
- `features` jsonb default `'[]'` — array de strings: `["cochera", "balcon", "amenities", "a_estrenar", ...]`
- `fotos` jsonb default `'[]'` — array de `{url, alt, orden}`
- `agente_id` uuid FK → `agentes`
- `ubicacion` geography(POINT, 4326) — para búsqueda en mapa (requiere extensión PostGIS)
- `created_at` timestamptz
- `updated_at` timestamptz

### `zonas`

- `id` uuid pk
- `nombre` text NOT NULL — "Caballito"
- `slug` text UNIQUE
- `region` enum: `capital_federal | gba_norte | gba_oeste | gba_sur | costa_atlantica | otros`
- `foto_url` text — para la grilla del home
- `orden` int default 0
- `created_at` / `updated_at`

### `agentes`

- `id` uuid pk
- `user_id` uuid FK → `auth.users` (Supabase Auth)
- `nombre` text NOT NULL
- `email` text NOT NULL
- `telefono` text
- `whatsapp` text
- `foto_url` text
- `matricula` text — número CUCICBA o equivalente
- `bio` text
- `activo` bool default true
- `created_at` / `updated_at`

### `leads`

- `id` uuid pk
- `propiedad_id` uuid FK → `propiedades` (nullable — un lead puede ser general)
- `nombre` text NOT NULL
- `email` text NOT NULL
- `telefono` text
- `mensaje` text
- `canal` enum: `web | whatsapp | telefono | presencial | otro`
- `estado` enum: `nuevo | contactado | calificado | descartado | convertido` (default `nuevo`)
- `agente_asignado_id` uuid FK → `agentes` (nullable)
- `created_at` / `updated_at`

### `interacciones`

- `id` uuid pk
- `lead_id` uuid FK → `leads`
- `agente_id` uuid FK → `agentes`
- `tipo` enum: `llamada | whatsapp | email | visita | nota`
- `contenido` text
- `created_at`

### `tasaciones`

- `id` uuid pk
- `nombre` text NOT NULL
- `email` text NOT NULL
- `telefono` text
- `direccion` text
- `tipo` enum (igual que `propiedades.tipo`, sin `emprendimiento`)
- `ambientes` int
- `m2` numeric
- `comentarios` text
- `estado` enum: `solicitada | en_proceso | completada | descartada` (default `solicitada`)
- `agente_asignado_id` uuid FK → `agentes` (nullable)
- `valor_estimado` numeric — lo completa el agente al cerrar
- `created_at` / `updated_at`

### Notas técnicas

- Todas las tablas con **RLS habilitado**. Policies por definir antes del primer release público.
- `propiedades.ubicacion` requiere `create extension if not exists postgis;` en la primer migration.
- `propiedades.fotos` se guarda como JSON pero los archivos viven en Supabase Storage (bucket `propiedades/{id}/...`).
- `slug` se genera a partir del título + barrio en una server action (no en el cliente).

---

## Mockups disponibles (en `mockups/`)

- `01-design-system-v2.html` — sistema de diseño completo: paleta, tipografía, botones, inputs, badges, card de propiedad. **Spec visual de tokens y componentes base.**
- `02-home-v2.html` — home pública: nav, hero con buscador (tabs Comprar/Alquilar/Temporario/Emprendimientos), métricas, propiedades destacadas, grilla de zonas, CTA "vendé tu propiedad", trust strip, footer con SEO links.

> Los mockups son **specs visuales**. El visual final debe coincidir lo más fielmente posible (proporciones, jerarquía, paleta), pero la implementación es **idiomática Next + Tailwind + shadcn**, no copia literal del CSS plano.

---

## Reglas críticas

1. **Nunca inventes** URLs, keys, IDs de Supabase, slugs, datos. Si no los tenés, pedímelos o usá un mock claramente marcado.
2. **Los mockups son specs visuales**, no código a copiar. Reimplementar en componentes server/client idiomáticos.
3. **Toda la UI en español argentino.** "Vos", no "tú". Precios con punto de miles ("USD 165.000"). Pesos con `$` y signo separado del número.
4. **Antes de tareas grandes, mostrar el plan al humano antes de codear.** Después codear pieza por pieza.
5. **Si algo del mockup parece técnicamente cuestionable, avisá** antes de implementarlo.
6. **No uses `any`.** Si necesitás escapar, usá `unknown` + narrowing.
7. **Server-first.** `"use client"` solo cuando hay interactividad real.
8. **No mezclar Tailwind 3 y 4.** Este proyecto es Tailwind 4 — los tokens van en `@theme`, no en `tailwind.config.ts`.
9. **Antes de leer/usar APIs de Next**, consultar `node_modules/next/dist/docs/` — Next 16 tiene breaking changes.

---

## Comandos útiles

```bash
npm run dev       # Next dev (Turbopack) en http://localhost:3000
npm run build     # production build (verifica antes de commitear cambios grandes)
npm run start     # production server local
npm run lint      # ESLint (Next + TypeScript rules)
npx tsc --noEmit  # typecheck sin emitir archivos

# shadcn — agregar nuevos componentes
npx shadcn@latest add <nombre>

# Supabase (cuando esté linkeado)
supabase link --project-ref <ref>
supabase db push                 # aplicar migrations locales al proyecto remoto
supabase gen types typescript --linked > lib/supabase/types.ts

# GitHub Actions
# CI corre automáticamente en push y pull_request a main.
# Ver: .github/workflows/ci.yml
```

---

## Checklist al final de cada cambio

- [ ] `npx tsc --noEmit` pasa sin errores.
- [ ] `npm run lint` pasa sin warnings nuevos.
- [ ] `npm run build` compila (correr antes de commits grandes o de tocar config).
- [ ] Si hay UI nueva o modificada, abrir en `http://localhost:3000` y revisar contra el mockup.
- [ ] Si hay estado del servidor nuevo (DB, env vars), está documentado acá o en `.env.example`.

# CLAUDE.md — Atrio

Plataforma SaaS para inmobiliarias argentinas. Compra, alquiler, alquiler temporario, emprendimientos y tasaciones, con foco inicial en CABA y GBA.

> Este archivo es la fuente de verdad para sesiones futuras. Si lo que dice acá entra en conflicto con código viejo, **gana este archivo** y se actualiza el código.

---

## TL;DR para quien abra esto

- **Producción**: https://atrio-omega.vercel.app — la home funciona y trae datos reales de Supabase.
- **Repo**: https://github.com/didigitalstudio/atrio (privado, default `main`, CI verde).
- **Stack**: Next 16 + React 19 + Tailwind 4 + shadcn/ui (base-nova) + Supabase (sa-east-1) + Manrope.
- **Hecho**: setup + design system + schema DB con 6 tablas + seed + **sitio público completo** (home, listings, búsqueda, detalle, institucional, formularios, `/vender`) + **auth + panel admin** (`/login`, `/registrarse` para clientes, middleware, `/admin` con dashboard, `/admin/propiedades` con filtros + cambio de estado + edit, `/admin/leads`, `/admin/tasaciones`, `/admin/equipo` CRUD, `/publicar` con flujo dual: agentes publican como `borrador`, clientes mandan a revisión `en_revision`) + **avisos transaccionales con Resend** (leads, tasaciones, submissions, approve/reject). Migraciones `0003` y `0004` aplicadas. María Pérez (agente seed) ya está vinculada a `auth.users` (`izuralucas@gmail.com`).
- **Falta**: bucket Supabase Storage + drag&drop de fotos, sitemap dinámico, OG dinámico, Mapbox en detalle, detalle de lead con timeline de interacciones. Pendientes de configuración (no de código): verificar dominio en Resend para mandar desde `noreply@atrio.com.ar`, configurar Supabase Auth Custom SMTP con Resend para emails de verificación, activar `RESEND_API_KEY` en Vercel.
- **Antes de codear**: leé este archivo entero (especialmente "Reglas críticas" y "Para el próximo dev").

---

## Stack

- **Next.js 16** con App Router, Turbopack, TypeScript estricto.
- **React 19** (incluido por Next).
- **Tailwind CSS 4** — tokens declarados con `@theme` dentro de `app/globals.css`. **No hay `tailwind.config.ts`**.
- **shadcn/ui** estilo `base-nova` (sucesor moderno de New York). Usa **Base UI** (no Radix). Configurado en `components.json`. Componentes en `components/ui/`.
- **Supabase** (Postgres + Auth + Storage). Proyecto `atrio` en region **South America (São Paulo) · sa-east-1**.
- **Manrope** como tipografía única, vía `next/font/google` (weights 300/400/500/600/700). Variable CSS `--font-sans` en `app/layout.tsx`.
- **react-hook-form + zod** para todos los formularios. Validación compartida cliente/servidor con el mismo schema.
- **lucide-react** para íconos.
- **date-fns** para fechas.
- **sonner** para toasts (vía `components/ui/sonner.tsx`).
- **Vercel** para hosting. Team `didigitalstudio` ("DI Digital Studio").
- **GitHub Actions** para CI: typecheck + lint en cada push y PR a `main`.

> ⚠️ Next 16 trae cambios de API. `params` y `searchParams` en pages/layouts son `Promise<...>` y hay que `await`. `PageProps<'/ruta'>` y `LayoutProps<'/ruta'>` son helpers globales (sin import). Antes de tocar APIs de Next, leé `node_modules/next/dist/docs/`.

---

## Sistema de diseño

### Paleta (en `app/globals.css`)

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

- **Cards e imágenes grandes**: `rounded-2xl`.
- **Botones**: `rounded-full` (pill).
- **Inputs**: `rounded-[10px]` (matchea con `--radius: 0.625rem`).

> El `Button` de shadcn por default usa `rounded-lg`. Para los CTAs de Atrio hay que pasar `className="rounded-full"`. Centralizar overrides si se vuelve repetitivo.

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
- **Toda la UI en español argentino. Usar "vos", no "tú".** Precios USD con punto de miles ("USD 165.000"). Pesos con `$` separado del número ("$ 850.000").
- **`html lang="es-AR"`** en el root layout.
- **Wrapper `Form` para RHF + zod en `components/ui/form.tsx`** (no viene en el registry de base-nova; está armado a mano siguiendo el patrón clásico de shadcn). Exports: `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `useFormField`. Uso típico documentado al inicio del archivo.

### Estructura de carpetas

```
app/
  (public)/        → home + listings (comprar/alquilar/temporario/emprendimientos),
                     buscar, propiedades/[slug], contacto, tasaciones, nosotros,
                     publicar. Tiene layout propio con Nav + Footer.
  admin/           → panel logueado (page = dashboard, propiedades, leads, tasaciones).
                     Layout propio con AdminSidebar y auth check server-side.
  login/           → form de login (sin Nav/Footer, root layout).
  layout.tsx       → root layout: Manrope + Toaster. NO incluye Nav/Footer.
  globals.css      → tokens Atrio + @theme inline + tokens shadcn mapeados
middleware.ts      → llama a updateSession() en cada request: refresca JWT,
                     redirige /admin* + /publicar a /login si no está logueado,
                     y mueve a /admin si entra a /login estando logueado.
components/
  property/        → property-card, favorite-button, zones-grid,
                     property-filters, property-listing, property-pagination
  search/          → hero-search (rutea por tab + parsea inputs)
  forms/           → contact-form, tasacion-form, login-form, propiedad-form
  admin/           → sidebar, inline-status-form (cliente que dispara update on change)
  shared/          → nav, footer
  ui/              → componentes shadcn (no editar manualmente salvo override)
lib/
  supabase/        → server.ts, client.ts (browser), middleware.ts (updateSession),
                     types.ts (tipos generados)
  schemas/         → lead.ts, tasacion.ts, auth.ts, propiedad.ts (zod, fuente de
                     verdad cliente+server)
  search-params.ts → parsers compartidos para URL searchParams
  types.ts         → types de dominio (Propiedad, enums)
  utils.ts         → cn() y otros utilitarios
server/
  actions/         → leads.ts (createLead), tasaciones.ts (createTasacion),
                     auth.ts (signIn, signOut), admin.ts (updateLeadStatus,
                     updateTasacionStatus, updatePropiedadEstado, createPropiedad)
  queries/         → properties.ts (getFeaturedProperties, getProperties,
                     getPropertyBySlug, getAdminProperties, getZonas),
                     agentes.ts, leads.ts, tasaciones.ts
supabase/
  migrations/      → 0001_initial_schema.sql, 0002_seed.sql,
                     0003_admin_policies.sql (RLS para authenticated)
mockups/           → 01-design-system-v2.html, 02-home-v2.html
```

---

## Modelo de datos (APLICADO en `supabase/migrations/`)

> Schema completo en migration `0001_initial_schema.sql`. Datos iniciales en `0002_seed.sql`. Ambas aplicadas al proyecto remoto. Re-aplicar con `supabase db push --password "<DB>" --yes`. Re-generar types con `supabase gen types typescript --linked > lib/supabase/types.ts` (limpiar a mano la basura del CLI al inicio/fin del archivo).

Todas las tablas tienen: PK `uuid default gen_random_uuid()`, `created_at`/`updated_at` `timestamptz default now()`, trigger `set_updated_at()` y **RLS habilitado**.

### `agentes`

`id`, `user_id` FK→`auth.users`, `nombre`, `email`, `telefono`, `whatsapp`, `foto_url`, `matricula`, `bio`, `activo bool default true`. Index en `user_id`. **Policy SELECT pública** (`activo = true`).

### `zonas`

`id`, `nombre`, `slug` UNIQUE, `region` enum (`capital_federal | gba_norte | gba_oeste | gba_sur | costa_atlantica | otros`), `foto_url`, `orden int default 0`. Index en `region`. **Policy SELECT pública** (true).

### `propiedades`

`id`, `titulo`, `slug` UNIQUE, `descripcion`, `tipo` enum (`departamento | casa | ph | terreno | local | oficina | cochera | emprendimiento`), `operacion` enum (`venta | alquiler | alquiler_temporario`), `estado` enum (`borrador | activa | reservada | cerrada | despublicada`, default `borrador`), `direccion`, `zona_id` FK→`zonas`, `ambientes`, `dormitorios`, `banos` (sin ñ), `m2_cubiertos`, `m2_totales`, `m2_terraza`, `antiguedad`, `precio numeric not null`, `moneda` enum (`USD | ARS`), `expensas`, `expensas_moneda`, `abl_incluido`, `apto_credito`, `destacada`, `features jsonb default '[]'`, `fotos jsonb default '[]'` (array de `{url, alt, orden}`), `agente_id` FK→`agentes`, `ubicacion extensions.geography(Point, 4326)` (PostGIS, opcional). Indexes en zona, agente, estado, destacada (parcial), operacion, ubicacion (GiST). **Policy SELECT pública** para `estado IN ('activa', 'reservada')`.

### `leads`

`id`, `propiedad_id` FK→`propiedades` nullable (lead general), `nombre`, `email`, `telefono`, `mensaje`, `canal` enum (`web | whatsapp | telefono | presencial | otro`, default `web`), `estado` enum (`nuevo | contactado | calificado | descartado | convertido`, default `nuevo`), `agente_asignado_id` FK→`agentes` nullable. Indexes en propiedad, estado, agente. **Policy INSERT pública** (true) para formularios anónimos. SELECT/UPDATE bloqueado para anon.

### `interacciones`

`id`, `lead_id` FK→`leads` (cascade delete), `agente_id` FK→`agentes`, `tipo` enum (`llamada | whatsapp | email | visita | nota`), `contenido`. Index en lead. **Sin policies** → totalmente bloqueado para anon (esperando sistema de roles).

### `tasaciones`

`id`, `nombre`, `email`, `telefono`, `direccion`, `tipo` enum tasacion (sin `emprendimiento`), `ambientes`, `m2`, `comentarios`, `estado` enum (`solicitada | en_proceso | completada | descartada`, default `solicitada`), `agente_asignado_id` FK→`agentes` nullable, `valor_estimado numeric`. Index en estado. **Policy INSERT pública** (true).

### Datos seed actuales (migration 0002)

- 3 zonas: Caballito, Villa Devoto, Almagro (todas `capital_federal`).
- 1 agente: María Pérez (`maria@atrio.com.ar`, CUCICBA 7654).
- 3 propiedades destacadas: "Piso alto con balcón aterrazado" en Caballito (USD 165k venta), "Casa con jardín y quincho" en Villa Devoto ($850k/mes alquiler), "Monoambiente reciclado" en Almagro (USD 92.5k venta). IDs UUID hardcodeados (estables para re-runs).

### Notas técnicas

- `propiedades.fotos` se guarda como JSONB pero los archivos van a Supabase Storage (bucket `propiedades/{id}/...` cuando lo creemos).
- `slug` se genera a partir de título + barrio en una server action (cuando hagamos el form de publicar). Por ahora los seeds tienen slugs hardcoded.
- Las policies de **escritura para agentes** se agregan cuando exista auth con roles. Hoy solo hay INSERT público en `leads` y `tasaciones`.

---

## Mockups disponibles (en `mockups/`)

- `01-design-system-v2.html` — sistema de diseño completo: paleta, tipografía, botones, inputs, badges, card de propiedad. **Spec visual de tokens y componentes base.**
- `02-home-v2.html` — home pública: nav, hero con buscador, métricas, propiedades destacadas, grilla de zonas, CTA "vendé tu propiedad", trust strip, footer con SEO links.

> Los mockups son **specs visuales**. El visual final debe coincidir lo más fielmente posible (proporciones, jerarquía, paleta), pero la implementación es **idiomática Next + Tailwind + shadcn**, no copia literal del CSS plano.

> Para las pages que **no tienen mockup todavía** (comprar, alquilar, contacto, etc.), usar el lenguaje visual del home como referencia: mismas medidas de container (`max-w-[1320px]`, `px-6 md:px-10`), mismas secciones con eyebrow + título display 2 + contenido, mismos cards con `shadow-sm` y `rounded-2xl`. Si tenés dudas de cómo se ve algo, **avisá** y lo definimos antes de codear.

---

## Conexiones de infra

### GitHub
- Repo: https://github.com/didigitalstudio/atrio (privado, default `main`).
- CI: `.github/workflows/ci.yml` — typecheck + lint en push y PR a `main`.
- Auto-deploy a Vercel: cada push a `main` dispara build automático.

### Supabase
- Project ref: `lbnslkasqfbufjkejovj`.
- Region: `sa-east-1` (São Paulo).
- Org: `gcdhiqhjbpwxfbtftklk` (didigitalstudio).
- Dashboard: https://supabase.com/dashboard/project/lbnslkasqfbufjkejovj
- URL: `https://lbnslkasqfbufjkejovj.supabase.co`.
- DB password: la tiene el dueño en su gestor de passwords (no commitear, no guardar en chats con persistencia). Para `supabase db push` necesitás pasarla con `--password`.

### Vercel
- Project ID: `prj_zSqZxwD6I7j8B6wqWFyzewuFy8PP`.
- Team: `team_wcxzkbclwcMqtfIWdewqVhDa` (slug `didigitalstudio`).
- Prod alias: **https://atrio-omega.vercel.app**.
- Repo conectado: auto-deploy en push a `main`. Preview en cada PR.
- Env vars seteadas en production / preview / development: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. `NEXT_PUBLIC_MAPBOX_TOKEN` y `RESEND_API_KEY` están vacías hasta que las activemos.

### Variables de entorno
- `.env.example` versionado con la lista.
- `.env.local` (gitignored) con los valores reales para dev local. Si lo perdés, regenerar con `vercel env pull --environment=development`.

---

## Reglas críticas

1. **Nunca inventes** URLs, keys, IDs de Supabase, slugs, datos. Si no los tenés, pedímelos o usá un mock claramente marcado.
2. **Los mockups son specs visuales**, no código a copiar. Reimplementar en componentes server/client idiomáticos.
3. **Toda la UI en español argentino.** "Vos", no "tú". Precios con punto de miles.
4. **Antes de tareas grandes, mostrar el plan al humano antes de codear.** Después codear pieza por pieza.
5. **Si algo del mockup parece técnicamente cuestionable, avisá** antes de implementarlo.
6. **No uses `any`.** Si necesitás escapar, usá `unknown` + narrowing.
7. **Server-first.** `"use client"` solo cuando hay interactividad real.
8. **No mezclar Tailwind 3 y 4.** Este proyecto es Tailwind 4 — los tokens van en `@theme`, no en `tailwind.config.ts`.
9. **Antes de leer/usar APIs de Next**, consultar `node_modules/next/dist/docs/` — Next 16 tiene breaking changes.
10. **El autor de los commits debe ser `info@didigitalstudio.com`** o un email asociado a la cuenta GitHub `didigitalstudio`. Si no, Vercel rechaza el deploy. El config local del repo ya está seteado, no lo cambies.

---

## ✅ Lo que está hecho

### Setup base e infra
- Repo, CI, Vercel y Supabase creados, linkeados, con env vars y auto-deploy desde `main`.
- Schema DB de 6 tablas + triggers + indexes + RLS, aplicado al remoto. Seeds con 3 propiedades, 3 zonas, 1 agente.
- Stack instalado: Next 16, React 19, TS estricto, Tailwind 4, shadcn base-nova, Manrope, Supabase SSR client, RHF, zod, sonner, lucide, date-fns.
- Tokens Atrio mapeados sobre shadcn en `app/globals.css` con `@theme inline`.
- `next.config.ts` con `remotePatterns` para Unsplash y `*.supabase.co`.
- `.env.example` con las 5 vars necesarias.
- `lang="es-AR"` en el root layout.

### Componentes
- `components/shared/nav.tsx` (server) — sticky con backdrop blur, logo Atrio., 6 links públicos, "Iniciar sesión" + "Publicar propiedad" pill.
- `components/shared/footer.tsx` (server) — brand+contacto, 3 columnas, SEO links, bottom bar con CUCICBA.
- `components/property/property-card.tsx` (server) — foto 4:3 con shadow-sm, badge operación, meta uppercase, título, address, precio Intl es-AR, features con punto separador, hover translate-y + scale en foto. Esconde "X dorm" cuando dormitorios = 0 (caso monoambiente).
- `components/property/favorite-button.tsx` (client) — toggle local del corazón. TODO: persistir cuando haya auth + tabla favoritos.
- `components/property/zones-grid.tsx` (server) — grilla de 5 regiones top-level con foto Unsplash, overlay gradient, count aproximado. Layout 3 cols × 2 rows con primera región doble row.
- `components/property/property-listing.tsx` (server) — orquestador de listing: header con conteo, sidebar de filtros sticky en desktop + collapsible en mobile (con `<details>`, sin JS), grid de cards, paginación, empty state. Configurable con `lockedFilters` (filtros que la ruta impone) y flags `hideTipoField` / `showOperacionField`.
- `components/property/property-filters.tsx` (server) — `<form method="get">` con `<select>` nativos para zona/tipo/ambientes/moneda + `<input type="number">` para precio min/max. Pure server, sin JS. Botones "Aplicar" y "Limpiar".
- `components/property/property-pagination.tsx` (server) — links prev/numerados/next, preserva todos los searchParams, ventana de 7 con elipsis cuando hay muchas páginas.
- `components/search/hero-search.tsx` (client) — tabs Comprar/Alquilar/Temporario/Emprendimientos. **Navega de verdad**: por tab a `/comprar`/`/alquilar`/`/temporario`/`/emprendimientos`. Slugifica el campo "¿Dónde?" → `?zona=`, matchea "Tipo" contra el enum (`/depart|monoamb/i` → departamento, etc), parsea "Precio" → `?precio_max=N` + detecta moneda. Quick searches apuntan a rutas reales con params.
- `components/forms/contact-form.tsx` (client) — RHF + zod. Reusable: opcionalmente recibe `propiedadId` y `defaultMensaje` para usar como "consultar por esta propiedad". Llama a `createLead` action, toast con sonner.
- `components/forms/tasacion-form.tsx` (client) — RHF + zod. Tipo en select nativo (`tipo_propiedad_tasacion` enum, sin emprendimiento ni cochera), ambientes y m² como string-validados (ver gotcha más abajo). Llama a `createTasacion`.
- `components/ui/form.tsx` — wrapper RHF clásico (Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, useFormField).
- shadcn instalados: button, card, dialog, input, label, select, textarea, table, tabs, sheet, badge, avatar, dropdown-menu, sonner, separator.

### Data layer
- `lib/types.ts` — type `Propiedad` con zona embebida + enums (`Operacion`, `TipoPropiedad`, `EstadoPropiedad`, `Moneda`, `Foto`, `ZonaResumen`).
- `lib/supabase/types.ts` — types generados de DB con `supabase gen types`.
- `lib/supabase/server.ts` — `createClient()` server-side con `@supabase/ssr` y cookies de `next/headers`.
- `lib/search-params.ts` — parsers reusables (`parseInt0`, `parseEnum`, `parseString`) + `parseUserPropertyFilters(sp)` que devuelve un objeto tipado a partir de cualquier `searchParams` (`?op=...&zona=...&tipo=...&ambientes_min=...&precio_min=...&precio_max=...&moneda=...&page=...`).
- `lib/schemas/lead.ts` — schema zod compartido cliente+server para crear leads (`nombre`, `email`, `telefono`, `mensaje`, `propiedadId?`).
- `lib/schemas/tasacion.ts` — schema zod compartido para tasaciones. Incluye `TIPOS_TASACION` y un helper `numericString(min, max, msg)` para validar enteros opcionales como string (ver gotcha de zod+RHF).
- `server/queries/properties.ts` — `getFeaturedProperties()`, `getProperties(filters)` (count + `.range()` paginado, todos los filtros del schema, `!inner` join con zonas para filtrar por slug), `getPropertyBySlug(slug)` (estados `activa` o `reservada`, retorna `null` si no existe), `getZonas()`. Mapper `toPropiedad` compartido.
- `server/queries/agentes.ts` — `getAgentes()` filtra `activo=true`, `getAgenteById(id)` para el detalle.
- `server/actions/leads.ts` — `createLead(input)` con validación zod en server, INSERT a `leads` con `canal='web'`. Retorna `{ ok: true } | { ok: false, error }`.
- `server/actions/tasaciones.ts` — `createTasacion(input)` análogo, INSERT a `tasaciones` con conversión string → number en `ambientes` y `m2`.

### Home pública (`app/page.tsx`)
- Hero con eyebrow + display 1 + subtitle + `HeroSearch` (que ahora rutea de verdad).
- Metrics strip (1.247 propiedades / 23 agentes / 18 años / 94% cierres < 90 días) — números hardcoded por ahora.
- Sección "Destacadas" con 3 `PropertyCard` desde `getFeaturedProperties()`.
- Sección "Por zona" con `ZonesGrid`.
- Sell CTA bg-brand-deep con botones "Solicitar tasación" + "Cómo trabajamos".
- Trust strip de 3 items (agentes matriculados, respuesta < 2h, info clara).

### Auth + Panel admin

- **Dos roles, un solo flujo de login**: un usuario auth es **agente** si tiene una fila en `agentes` con `user_id = auth.users.id` y `activo = true`. Si no, es **cliente**. El helper está en `lib/auth.ts` (`getCurrentAgenteId`, `isAgent`).
- **Middleware** (`middleware.ts` + `lib/supabase/middleware.ts`) — refresca el JWT con `supabase.auth.getUser()` en cada request, redirige `/admin*` y `/publicar` a `/login?next=...` si no hay sesión, y manda a `/admin` si un user logueado entra a `/login`. El matcher excluye assets estáticos.
- **`/login`** (`app/login/page.tsx`) — card centrada sin Nav/Footer. `<LoginForm>` (RHF + zod) llama a `signIn`. La action consulta el rol y redirige: agente → `next` o `/admin`; cliente → `next` o `/publicar`. Banner si llega con `?signup=ok`.
- **`/registrarse`** (`app/registrarse/page.tsx`) — signup para clientes (`<SignUpForm>`: nombre, email, password con confirmación). `signUp` action llama `supabase.auth.signUp`. Si email confirm está activado, redirige a `/login?signup=ok&next=...`.
- **`/admin`** (`app/admin/`) — layout propio con `<AdminSidebar>`. Doble auth check: usuario logueado **y** con agente activo. Clientes que llegan al panel rebotan a `/publicar`.
- **Dashboard** (`app/admin/page.tsx`) — 6 cards: submissions a revisar (highlight + badge en sidebar), leads sin atender, tasaciones pendientes, propiedades activas, destacadas, agentes activos. Highlight cuando valor > 0.
- **`/admin/propiedades`** — tabla con todas las propiedades, chips para filtrar por estado (incluye `en_revision` con badge numérico cuando hay submissions). Inline status select. Para items en `en_revision` se reemplaza el botón Editar/Ver por `<ReviewActions>` con botones Aprobar (estado=activa, asigna `agente_id` al admin actual) y Rechazar (estado=despublicada). Las submissions de cliente muestran un eyebrow "Submission de cliente".
- **`/admin/leads`** — tabla orden cronológica desc, chips para filtrar por `estado` (`?estado=...`), select inline para cambiar estado del lead. Muestra mensaje, propiedad linkeada (si aplica), canal.
- **`/admin/tasaciones`** — análogo a leads, con chips de filtro y status update. Muestra dirección, tipo, m²/ambientes, valor estimado.
- **`/publicar`** (`app/(public)/publicar/page.tsx`) — form completo (`<PropiedadForm>`). Server action `createPropiedad` decide según rol:
  - **Agente** logueado → `estado='borrador'`, `agente_id` = id del agente, redirect a `/admin/propiedades`.
  - **Cliente** logueado → `estado='en_revision'`, `agente_id=null`, `submitted_by=user.id`, redirect a `/publicar/gracias`.
  Genera slug único a partir de título + slug de zona.
- **`/publicar/gracias`** — pantalla post-submission para clientes ("Tu propiedad está en revisión, te contactamos en menos de 48h").
- **`/admin/equipo`** (`app/admin/equipo/page.tsx`) — tabla de todos los agentes, foto/iniciales, contacto, matrícula, toggle activo/inactivo via `<InlineStatusForm>`. Form de alta colapsable (`<details>`) con `<AgenteForm>` (RHF + zod, schema `lib/schemas/agente.ts`). Actions `createAgente`, `toggleAgenteActivo`.
- **`/admin/propiedades/[id]/edit`** — reusa `<PropiedadForm>` con `propiedadId` + `initialValues` mapeados desde `getPropertyById`. Action `updatePropiedad` actualiza el row, conserva fotos si la URL viene vacía.
- **Migraciones aplicadas al remoto**:
  - `0003_admin_policies.sql` — policies `to authenticated` para CRUD total en propiedades, leads, interacciones, tasaciones, agentes.
  - `0004_client_submissions.sql` — agrega `'en_revision'` al enum `estado_propiedad`, hace `agente_id` nullable, agrega columna `submitted_by uuid` (FK a `auth.users`, ON DELETE SET NULL) + índice. Las policies de anon quedan intactas (SELECT solo `activa`/`reservada`).

### Sitio público completo (`app/(public)/`)
- **`/comprar`, `/alquilar`, `/temporario`** — listings filtrados por `operacion`. Cada page parsea searchParams con `parseUserPropertyFilters` y delega a `<PropertyListing>` con su `lockedFilters`. Archivos de ~25 líneas.
- **`/emprendimientos`** — mismo template pero con `lockedFilters: { tipo: 'emprendimiento' }` y `hideTipoField` (no muestra el dropdown de tipo, ya está fijo).
- **`/buscar`** — listing unificado. `lockedFilters: {}` y `showOperacionField`: el usuario elige operación en el sidebar. Las QUICK_SEARCHES del HeroSearch apuntan acá o a `/comprar`/`/alquilar`/`/emprendimientos`.
- **`/propiedades/[slug]`** — detalle. `getPropertyBySlug` + `getAgenteById` en paralelo. `notFound()` si no existe. Galería con CSS scroll-snap horizontal (sin JS, sin lib externa). Header con badges de operación + tipo + zona, precio destacado con expensas opcionales, grid de quick-facts (ambientes, dormitorios, m² cubiertos, m² totales, antigüedad, baños), descripción, chips de features, banner "Apto crédito" si aplica. Sidebar con card del agente (foto + matrícula + WhatsApp directo a `wa.me/<digits>?text=...`), `<ContactForm>` con `propiedadId` y `defaultMensaje` pre-armado, links rápidos a otras búsquedas. `generateMetadata` con OG image desde `propiedad.fotos[0]`.
- **`/contacto`** — hero + grid 2 columnas: form `<ContactForm>` a la izquierda, 4 cards de contacto (dirección, teléfono, WhatsApp, email) a la derecha. La página es server component; el form es client.
- **`/tasaciones`** — hero + form `<TasacionForm>` + sidebar con bullets ("cómo trabajamos") y mensaje claro de no compromiso.
- **`/nosotros`** — hero institucional + 3 valores en cards (info clara / equipo matriculado / buen trato) + grid del equipo desde `getAgentes()` con foto/iniciales fallback / matrícula / bio. CTA al final hacia `/contacto` y `/tasaciones`.
- **`/vender`** — landing para vendedores. Hero con CTAs a `/publicar` (primario) y `/tasaciones` (secundario), strip de 3 stats, 4 pasos del proceso (tasamos → producimos → publicamos → cerramos), 3 razones (matriculados / contestamos rápido / sin sorpresas), CTA final con copy "cargá tu propiedad en 5 minutos".

### Mails transaccionales (Resend)

- **Cliente** (`lib/email/client.ts`): factory `getResend()` cacheado. **Sin `RESEND_API_KEY` el sistema loguea el envío y sigue** — los avisos no rompen la operación principal. Configurable: `RESEND_FROM` (default `Atrio <onboarding@resend.dev>` que es el sandbox de Resend, solo manda al email registrado en su cuenta), `NOTIFICATIONS_EMAIL` (default `izuralucas@gmail.com` — recibe avisos cuando no hay agente asignado), `NEXT_PUBLIC_SITE_URL` (default `https://atrio-omega.vercel.app` — para links absolutos).
- **Layout HTML compartido** en `lib/email/notifications.ts` (función `shell`): card centrada, brand `#1B6B47`, container max 560px, sin templating engine. `escapeHtml` y `nl2br` para sanitizar input de usuario.
- **Eventos cubiertos** (todos en `lib/email/notifications.ts`):
  - `notifyLeadCreated` — se dispara desde `createLead`. Manda **dos** mails: aviso al agente asignado de la propiedad consultada (con `replyTo: lead.email` para responder directo) y confirmación al usuario ("recibimos tu consulta").
  - `notifyTasacionRequested` — desde `createTasacion`. Aviso al equipo + confirmación al solicitante.
  - `notifyClientPropertySubmitted` — desde `createPropiedad` cuando el usuario es **cliente** (no agente). Aviso al equipo con CTA a `/admin/propiedades?estado=en_revision` + confirmación al cliente.
  - `notifyPropertyApproved` — desde `approvePropiedad`. Mail al cliente: "tu propiedad ya está online" con link al detalle público.
  - `notifyPropertyRejected` — desde `rejectPropiedad`. Mail al cliente: "necesitamos ajustar algunos datos".
- **Servicio role para mirar `auth.users`**: `lib/supabase/service.ts` exporta `createServiceClient()` con `SUPABASE_SERVICE_ROLE_KEY`. Lo uso solo para `auth.admin.getUserById(submitted_by)` cuando approve/reject necesita el email del cliente que mandó la submission. **NO se importa desde un Client Component** — `lib/supabase/service.ts` empieza con `import "server-only";` para que tsc rompa si alguien lo intenta.
- **Verificación de email en signup**: la maneja Supabase Auth, no nuestro código. Hasta que se configure Custom SMTP con Resend en el dashboard de Supabase, los mails de confirmación salen del relay de Supabase (3-4 mails/hora, marca `noreply@mail.app.supabase.io`). Steps en "Para activar Resend" más abajo.

---

## 🔨 Lo que falta — priorizado

> 🔥 La Alta prioridad (sitio público completo) y 🌑 la Media prioridad base (auth + dashboard admin con leads/tasaciones/propiedades + `/publicar` form) están cerradas. Lo que sigue son extensiones del admin y pulidos.

### 🌑 Media prioridad pendiente — extensión admin

#### `/admin/equipo`
- Link existe en el sidebar pero la ruta es 404. Listado + alta de agentes (CRUD) usando las policies que ya están en migración `0003`.

#### Vincular agente al usuario logueado
- `agentes.user_id` está en el schema pero hoy no se setea. `createPropiedad` cae al "primer agente activo" como stub. Pasos:
  1. Al crear un usuario auth nuevo, también crear su row en `agentes` con `user_id = auth.users.id`.
  2. Reemplazar el fallback en `server/actions/admin.ts` por: si no hay match por `user_id`, fallar con error claro en lugar de elegir cualquier agente.

#### Detalle de lead con timeline
- `/admin/leads/[id]` con timeline de `interacciones` (insert + listar). Sumar acciones rápidas: marcar como contactado, agregar nota, derivar a otro agente.

#### Editar propiedad (`/admin/propiedades/[id]/edit`)
- Reusar `<PropiedadForm>` con `defaultValues` traídos por `getPropertyById`. Action separada `updatePropiedad`.

### 🌱 Baja prioridad — pulidos

- Migrar fotos Unsplash a bucket Supabase Storage propio.
- Reemplazar counts hardcoded de `ZonesGrid` por counts reales por región (subquery o materialized view).
- Sitemap dinámico (`app/sitemap.ts`).
- Open Graph dinámico por propiedad.
- Botón flotante de WhatsApp en mobile.
- Búsqueda en mapa con Mapbox.
- Email transaccional con Resend (notif de nuevo lead al agente, confirm al usuario).

---

## 🧭 Para el próximo dev

### Antes de codear
1. **Leé los mockups** en `mockups/01-design-system-v2.html` y `mockups/02-home-v2.html` para ver el lenguaje visual.
2. **Mirá `app/page.tsx`, `components/property/property-card.tsx` y `components/search/hero-search.tsx`** — son ejemplares de cómo se aplica el design system.
3. **Antes de hacer un form**, leé el wrapper en `components/ui/form.tsx` (tiene un ejemplo de uso al inicio del archivo).
4. **Antes de tocar APIs de Next**, leé `node_modules/next/dist/docs/` — Next 16 tiene cambios sobre lo que pueda saber un modelo entrenado en Next 14/15.
5. **Antes de crear una page, mostrale el plan al humano** y esperá OK. Después codeás pieza por pieza.

### Workflow para una nueva página
1. Crear archivo en `app/(public)/<ruta>/page.tsx` (server component por default).
2. Si necesita data → query en `server/queries/<entidad>.ts`.
3. Si necesita mutación → server action en `server/actions/<accion>.ts` con `"use server"`.
4. Componentes específicos en `components/<dominio>/`.
5. Validación con un schema zod compartido entre cliente y server.
6. Antes del commit: `npx tsc --noEmit && npm run lint && npm run build`.
7. Commit con formato `feat: ...` / `fix: ...` / `chore: ...` / `docs: ...`.
8. Push a `main` → CI corre + Vercel deploya solo.

### Quirks y gotchas conocidos
- **Autor del git commit**: tiene que ser `info@didigitalstudio.com` o un email asociado a la cuenta GitHub `didigitalstudio`. Si no, Vercel rechaza el deploy con error vacío. El config local del repo ya está seteado — no lo cambies.
- **`supabase gen types`** vuelca basura al inicio (`Initialising login role...`) y al final (`A new version of Supabase CLI...`) del archivo generado. Limpiar a mano.
- **`vercel env add NAME preview --yes` falla** pidiendo git branch positional. Workaround: usar la API REST `POST /v10/projects/{id}/env?teamId=...` con `target: ["preview"]` sin `gitBranch`.
- **`tailwind.config.ts` no existe** — Tailwind 4 usa `@theme inline` dentro de `app/globals.css`. NO crear `tailwind.config.ts`.
- **`form` de shadcn** — no está en el registry base-nova. El wrapper está hecho a mano en `components/ui/form.tsx`.
- **Conexión DB desde CLI** — `supabase db push` necesita `--password`. Si la red no soporta IPv6, asegurate que `supabase link` haya quedado con pooler (re-link con `--password` lo arregla).
- **`params` y `searchParams` son `Promise`** en pages/layouts de Next 16. Hay que `await` antes de usar.
- **`z.coerce.number()` + `useForm` rompen los types**: el input type de `z.coerce` es `unknown` y el output es `number`, así el `Resolver` de RHF no calza con `useForm<TFieldValues>`. Workaround usado en `lib/schemas/tasacion.ts`: campos numéricos como `z.string().refine()` con un helper `numericString(min, max, msg)`, y el server action convierte con `parseInt(value, 10)` antes del INSERT. Si volvés a meter números en un form, copiá ese patrón en lugar de pelearte con `z.coerce`.
- **`getProperties` filtra por `zona.slug` con `!inner` join**: `supabase .select("*, zona:zonas!inner(...)")` + `.eq("zona.slug", value)`. Sin `!inner` el filtro no aplica al row principal.
- **No usar route group `(admin)`**: dos route groups con `page.tsx` en la raíz colisionan en `/`. Por eso admin vive en `app/admin/` (folder real, sin paréntesis) y `(public)` envuelve home + listings + forms.
- **`createPropiedad` decide rol mirando `agentes.user_id`**: si hay match con el usuario logueado → publicación interna (estado=borrador, agente_id=ese). Si no → submission de cliente (estado=en_revision, agente_id=null, submitted_by=user.id). El admin aprueba con `<ReviewActions>` y se asigna a sí mismo como agente.
- **El primer auth user (`izuralucas@gmail.com`) está vinculado a María Pérez** (`agentes.user_id`) vía script `bootstrap-admin-user.mjs` que ya se borró. Para más usuarios: o crear un nuevo agente con `user_id`, o usar el panel `/admin/equipo` (que crea agentes sin `user_id` por ahora — pendiente: linkear al crear).
- **CLI `supabase db push` sin `--password`** ya funciona en este repo porque `supabase link` quedó con credenciales cacheadas. Si en otra máquina pide password, ver Reglas críticas #10 / Comandos útiles.
- **Next 16 deprecó `middleware.ts`** a favor de `proxy.ts` con la misma API. El build muestra el warning. Cuando migremos, renombrar el archivo + actualizar el matcher; la lógica adentro (`updateSession`) no cambia.
- **Resend `onboarding@resend.dev`** solo manda al email registrado en la cuenta Resend (es el dominio sandbox). Si querés testear con otros destinatarios, primero verificá un dominio propio o vas a ver "You can only send testing emails to your own email address". Igual sin `RESEND_API_KEY` el código solo loguea — útil para dev sin riesgo de spam.
- **Avisos de mail son `await` (no fire-and-forget)** porque en serverless (Vercel) el proceso puede terminar antes que el envío si no se espera. El costo es ~200ms extra por action; vale la pena para no perder mails. Cada llamada está envuelta en try/catch — si Resend falla, la operación principal no se rompe.
- **`createServiceClient` solo en server**: `lib/supabase/service.ts` empieza con `import "server-only";`. Si lo importás desde un Client Component, tsc rompe en build con un mensaje claro.

### Estado actual de Resend (al 2026-04-29)

- **API key cargada** en Vercel (Production + Development) y en `.env.local`. Preview todavía no — quirk del CLI con `vercel env add NAME preview`.
- **Cuenta Resend** registrada bajo `desa.baires@gmail.com` (no `izuralucas@gmail.com`). Por eso `NOTIFICATIONS_EMAIL=desa.baires@gmail.com` está seteado en Vercel — sino los avisos al equipo no llegan.
- **Sandbox activo**: sin dominio verificado, Resend solo entrega mails al owner de la cuenta (`desa.baires@gmail.com`). Los mails de confirmación a leads, tasaciones y compradores SE INTENTAN MANDAR pero Resend los rechaza con `validation_error`. La operación principal (insert en DB) sigue OK porque cada `notify*` está en try/catch.
- **Para liberar el sandbox**: verificar `atrio.com.ar` (o el dominio que se elija) en Resend → Domains → Add → cargar SPF/DKIM/DMARC → esperar verificación. Después: setear `RESEND_FROM="Atrio <noreply@atrio.com.ar>"` en Vercel y los mails empiezan a llegar a cualquier destinatario.

### Para activar Resend (steps manuales que NO podés hacer desde código)

1. Crear cuenta en https://resend.com (free: 100 mails/día, 3000/mes — alcanza para arrancar).
2. **Verificar dominio** (recomendado, sino se manda solo al email de la cuenta Resend):
   - Resend → Domains → Add Domain → `atrio.com.ar` (o el que sea).
   - Agregar los 3 DNS records (SPF, DKIM, DMARC) que muestra Resend en el proveedor de DNS del dominio.
   - Esperar verificación (suele ser <30 min).
3. **Generar API key**: Resend → API Keys → Create. Copiar.
4. **Setear env vars en Vercel** (Production + Preview + Development):
   ```
   RESEND_API_KEY=<la-key>
   RESEND_FROM="Atrio <noreply@atrio.com.ar>"      # o "Atrio <onboarding@resend.dev>" para testear
   NOTIFICATIONS_EMAIL=hola@atrio.com.ar           # o el email del equipo
   NEXT_PUBLIC_SITE_URL=https://atrio-omega.vercel.app
   ```
5. **Replicar localmente**: `vercel env pull --environment=development` (regenera `.env.local`).
6. **Configurar Supabase Auth Custom SMTP** (para que los mails de verificación de signup salgan por Resend):
   - Supabase Dashboard → Project Settings → Auth → SMTP Settings → enable.
   - Host: `smtp.resend.com`, Port: `465` (SSL) o `587` (TLS).
   - Username: `resend`, Password: la API key de Resend.
   - Sender email: `noreply@atrio.com.ar` (o el que esté verificado).
   - Sender name: `Atrio`.
   - Guardar y testear con un signup real.

### Reglas del flujo de trabajo con humano
- Tareas grandes (página completa, refactor, migration nueva): mostrar **plan** primero, esperar OK, después codear pieza por pieza.
- Cosas chicas (un fix, un componente aislado): codeá directo y mostrá el diff.
- Dudas técnicas: **preguntar**, no inventar.
- Si el mockup tiene algo raro: **avisar**, no copiar el bug.
- Después de cada commit lógico: sugerir el mensaje antes de hacerlo.

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

# Supabase (proyecto ya linkeado: ref lbnslkasqfbufjkejovj, sa-east-1)
supabase db push --password "<DB_PASSWORD>" --yes        # aplicar migrations al remoto
supabase gen types typescript --linked > lib/supabase/types.ts
# ⚠️ El CLI vuelca un "Initialising login role..." al inicio del file
# generado y un mensaje de "new version available" al final. Borrar
# esas líneas a mano después de regenerar.

# Vercel
vercel env pull --environment=development        # bajar .env.local
vercel ls                                        # listar deploys
vercel deploy --prod --yes                       # deploy manual

# GitHub Actions
# CI corre automáticamente en push y pull_request a main.
# Ver: .github/workflows/ci.yml
```

---

## Checklist al final de cada cambio

- [ ] `npx tsc --noEmit` pasa sin errores.
- [ ] `npm run lint` pasa sin warnings nuevos.
- [ ] `npm run build` compila (correr antes de commits grandes o de tocar config).
- [ ] Si hay UI nueva o modificada, abrí http://localhost:3000 y revisá contra el mockup (o contra el design system del home si no hay mockup específico).
- [ ] Si hay estado del servidor nuevo (DB, env vars), está documentado acá o en `.env.example`.
- [ ] Si hay nueva migration, está en `supabase/migrations/` con número siguiente y se aplicó al remoto con `supabase db push`.
- [ ] Si hay nuevos types de DB, regeneraste `lib/supabase/types.ts` y limpiaste la basura del CLI.
- [ ] Commit message en formato `tipo(scope): descripción` (`feat`, `fix`, `chore`, `docs`).

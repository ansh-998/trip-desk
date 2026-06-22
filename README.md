# Nomichi Trip Desk

A full-stack CRM and public booking portal for Nomichi — a small-group travel company running slow-paced journeys across India. The public site lets travellers discover and enquire about trips. The admin panel helps the sales team track leads, manage properties, and move people from first enquiry to confirmed seat.

## What's inside

**Public side**
- Trip listing with search and category filters
- Trip detail pages with photo gallery, lightbox, and booking widget
- Enquiry form with real-time validation — submissions land directly in the CRM
- Dark mode support, persisted across sessions

**Admin side**
- Role-based login (admin vs. traveller — each lands on a different dashboard)
- Lead table with status pipeline and owner assignment
- Per-lead call log, AI vibe check, and WhatsApp message draft
- Trip and property management (create, edit, image uploads via Supabase Storage)

**AI features (Gemini)**
- Vibe check: rates how well a lead fits Nomichi's slow-travel philosophy
- Call log summariser: one-sentence summary of where a lead stands
- WhatsApp draft: writes the first outreach message in Nomichi's voice

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4, custom design tokens |
| Database | Supabase (Postgres + Auth + Storage) |
| Validation | Zod (shared between client and server) |
| AI | Gemini 2.0 Flash via REST API |
| Deployment | Vercel |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in your Supabase project URL, anon key, and Gemini API key. The Gemini key is server-side only — never prefix it with `NEXT_PUBLIC_`.

### 3. Set up the database

Run the SQL migrations in order against your Supabase project (SQL Editor or `supabase db push`):

```
supabase/migrations/
  0001_schema.sql                    — core tables (trips, leads, call_logs, profiles)
  0002_rls_policies.sql              — row-level security
  0003_properties_and_travellers.sql — properties table + traveller role
  0004_secure_rls_policies.sql       — hardened RLS using is_team_member() helper
  0005_owner_row_level_security.sql  — owner-scoped lead access for associates
  0006_trip_images.sql               — cover_image and gallery_images columns on trips
```

Then load demo data for development:

```
Paste contents of supabase/seed.sql into the Supabase SQL Editor
```

> **Schema cache tip:** If the API complains about missing columns after running migrations, reload PostgREST's schema cache:
> ```sql
> NOTIFY pgrst, 'reload schema';
> ```

### 4. Start the dev server

```bash
npm run dev
```

## Available scripts

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run type-check   # TypeScript (tsc --noEmit)
```

## Project structure

```
src/
├── app/
│   ├── (public)/        — public-facing pages (home, trip detail, enquiry success)
│   ├── admin/           — CRM pages (leads, trips, properties)
│   ├── api/             — route handlers (leads, AI endpoints, auth)
│   ├── dashboard/       — traveller dashboard
│   ├── login/           — shared login page (role-aware redirect)
│   └── signup/          — traveller self-registration
├── components/
│   ├── admin/           — CRM components (LeadTable, CallLogPanel, TripForm, etc.)
│   ├── public/          — public components (SiteHeader, TripGallery, BookingWidget, etc.)
│   └── ui/              — design system primitives (Button, Input, Card, Badge)
├── lib/
│   ├── actions/         — server actions for trips, leads, properties, and call logs
│   ├── ai/              — Gemini REST client
│   ├── auth/            — admin session guard
│   ├── supabase/        — browser, server, and middleware Supabase clients
│   └── validations/     — Zod schemas, shared between client and server
└── types/               — TypeScript interfaces for all domain models
supabase/
├── migrations/          — schema and RLS policies, in the order to run them
└── seed.sql             — demo trips and leads for development
```

## Key design decisions

**Leads are insert-only for anonymous users** — the public enquiry form can create a row in `leads` but never read, update, or delete. There is no way for a traveller to see other people's enquiries. The team gets full access through a separate `is_team_member()` RLS helper that checks `profiles.role`.

**Call logs are append-only** — `call_logs` has no UPDATE or DELETE policy. Every touchpoint is a permanent record of what actually happened, not a text blob you can rewrite later.

**Schema-first validation** — Zod schemas in `src/lib/validations/` are imported by both client components and server actions. The client validates for fast feedback; the server re-validates before touching the database.

**Image uploads go directly to Supabase Storage** — the admin's browser uploads photos straight to the `trip-images` bucket. The Next.js server never handles binary file data.

**Demo fallback** — `src/lib/trips.ts` checks for Supabase env variables at runtime and falls back to local demo data if they are missing. The public site is explorable without any database connection.

## Security

- All secrets are server-side only (no `NEXT_PUBLIC_` prefix on sensitive keys)
- Supabase RLS is enforced at the database level for every table
- AI and admin routes are guarded by `requireAdminSession()` which checks both authentication and `profiles.role`
- See [.github/SECURITY.md](./.github/SECURITY.md) for vulnerability reporting

## Deployment

See [prod.md](./prod.md) for full Vercel deployment instructions including environment variables, migration steps, and CI/CD setup.

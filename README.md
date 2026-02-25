# CRM Lite MVP (Mobile-First)

A classroom-friendly CRM app built with **Next.js 14 + TypeScript + Tailwind + Supabase**.

## Phase 1: Architecture + Folder Tree + SQL

### Architecture (simple)
- **UI**: Next.js App Router pages (`/dashboard`, `/leads`, `/contacts`, `/tasks`) optimized for phone layout.
- **API**: Route handlers under `/app/api/*` for CRUD and dashboard metrics.
- **Data**: Supabase Postgres tables (`contacts`, `leads`, `tasks`, `notes`) + indexes + seed data.
- **Auth**: Classroom shared password gate using secure HTTP-only cookie.

### Folder tree
```bash
app/
  api/
    auth/login/route.ts
    auth/logout/route.ts
    contacts/route.ts
    leads/route.ts
    tasks/route.ts
    notes/route.ts
    dashboard/route.ts
  contacts/page.tsx
  dashboard/page.tsx
  leads/page.tsx
  login/page.tsx
  tasks/page.tsx
  layout.tsx
  page.tsx
components/
  AddButton.tsx
  BottomNav.tsx
  LogoutButton.tsx
  PageShell.tsx
lib/
  auth.ts
  supabase-server.ts
  types.ts
middleware.ts
supabase/schema.sql
```

### Supabase SQL
Use `supabase/schema.sql` in Supabase SQL Editor.

## Phase 2: Core Pages + API Routes

### What students built
- Login page (`/login`) with shared class password.
- Contacts CRUD with quick notes timeline.
- Leads CRUD + one-tap stage updates.
- Tasks CRUD with todo/done toggle.
- Dashboard KPI summary cards.

### Copy-paste commands
```bash
npm install
npm run dev
```

## Phase 3: Mobile UX polish
- Bottom nav with 4 tabs: Dashboard, Leads, Contacts, Tasks.
- Sticky `+` add button on key pages.
- Large tap targets, one-handed spacing.
- Quick forms with optional fields hidden in `<details>`.

## Phase 4: Setup + Deploy (Vercel-ready)

### Local setup
1. Create Supabase project.
2. Run SQL from `supabase/schema.sql`.
3. Copy envs:
```bash
cp .env.example .env.local
```
4. Fill `.env.local` values.
5. Run app:
```bash
npm run dev
```

### Vercel deploy
1. Push repo to GitHub.
2. In Vercel: **New Project** → import repo.
3. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CLASSROOM_PASSWORD`
4. Deploy.

## Phase 5: Manual test checklist (15 tests)
1. Open `/login`, wrong password shows error.
2. Correct password redirects to dashboard.
3. Dashboard loads KPI numbers.
4. Bottom nav appears on mobile width.
5. Create contact with required field only.
6. Create contact with optional fields + tags.
7. Delete a contact.
8. Open a contact notes section.
9. Add note and see it in timeline.
10. Create lead linked to contact.
11. Tap stage buttons and confirm lead stage changes.
12. Delete lead.
13. Create task with due date.
14. Toggle task from todo to done.
15. Delete task.

## In-class demo script (10 minutes)
1. **(1 min)** Show login + explain classroom password gate.
2. **(2 min)** Add one contact quickly, then optional details.
3. **(2 min)** Create lead from that contact.
4. **(1 min)** Move lead across stages with one tap.
5. **(2 min)** Add follow-up task and mark done.
6. **(1 min)** Add quick contact note.
7. **(1 min)** Return to dashboard and read KPI impact.

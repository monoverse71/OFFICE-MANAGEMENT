# Office Management System

A React + Vite + Tailwind office administration app — Dashboard, Expenses,
Approvals, Inventory, Staff Directory, Tasks, Notifications, Activity Log,
and Settings — backed by **Supabase** (Postgres + Realtime) for storage
and cross-device sync.

## Contents

- [Environment variables](#environment-variables)
- [Database setup](#database-setup)
- [Running locally](#running-locally)
- [Deploying on Vercel](#deploying-on-vercel)
- [How the Supabase integration works](#how-the-supabase-integration-works)
- [SQL migrations](#sql-migrations)

## Environment variables

The app reads exactly two environment variables, both **safe to expose in
the browser** — they are the Supabase project URL and the
publishable/anon key, which rely on Row Level Security rather than
secrecy:

| Variable                  | Where to find it                                              |
|----------------------------|----------------------------------------------------------------|
| `VITE_SUPABASE_URL`        | Supabase Dashboard → Project Settings → API → Project URL      |
| `VITE_SUPABASE_ANON_KEY`   | Supabase Dashboard → Project Settings → API → anon/publishable key |

Copy `.env.example` to `.env.local` and fill in your own values:

```bash
cp .env.example .env.local
```

`.env.local` is git-ignored. **Never** put the Supabase **service role /
secret key** in this project — client-side code must only ever use the
anon/publishable key. There is no server component here that could keep a
secret key safe.

If these variables are not set, the app still runs — it falls back to
browser-only storage (the same `localStorage`-backed mode it used before
Supabase was introduced), so local development without a Supabase project
is still possible.

## Database setup

1. Create a Supabase project (or use the existing one).
2. Open **SQL Editor** in the Supabase Dashboard.
3. Paste and run the entire contents of
   [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql).
   It's safe to re-run — every statement is idempotent (`if not exists`,
   `drop ... if exists` before `create`, etc.).

That single file creates:

- All 11 tables (see [SQL migrations](#sql-migrations) below for the full list)
- UUID primary keys (`gen_random_uuid()`) everywhere
- `created_at` / `updated_at` on every table, with `updated_at` kept
  current by a shared trigger — the application never sets it manually
- Foreign keys with `on delete cascade` where a child record has no
  meaning without its parent (an approval without its expense, stock
  history without its inventory item)
- Row Level Security **enabled** on every table, with one permissive
  policy for now (see [Security model](#security-model-today-vs-future))
- Every table added to the `supabase_realtime` publication, so changes
  broadcast to every connected client

No other manual setup (no storage buckets, no Edge Functions) is required
for this update.

## Running locally

```bash
npm install
npm run dev
```

Open the printed URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Deploying on Vercel

1. Import the project into Vercel as normal (Framework Preset: **Vite**).
2. Under **Project Settings → Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   (You mentioned these are already configured — nothing else to do.)
3. Deploy. Vite inlines `VITE_*` env vars at build time, so Vercel's build
   step will pick them up automatically — no code changes needed between
   environments.

## How the Supabase integration works

### Migration from Local Storage (automatic, one-time)

The very first time the app loads against a Supabase project with no data
yet, `src/lib/migrateLocalStorage.js` runs once:

1. Checks whether the `expenses` table already has any rows. If it does,
   Supabase is already the source of truth (e.g. another device already
   migrated) — nothing is copied, and a local flag
   (`oams:migratedToSupabase`) is set so this check is skipped on future
   loads.
2. If Supabase is empty, it reads every existing `localStorage` collection
   (expenses, approvals, inventory + stock history, staff, tasks,
   notifications, activity log, item catalogue, company/system settings)
   and inserts it into Supabase, generating fresh UUIDs and rewriting
   foreign keys (e.g. an approval's `expense_id`) to match.
3. Only after every insert succeeds is the migration flag set. If
   anything fails partway through, the flag is **not** set, so the next
   load retries rather than silently losing records.

After this runs, **Supabase is the only source of truth** — the app reads
and writes Supabase directly from then on. `localStorage` is still used,
but only as an offline cache (see below), never as the primary store.

### Ongoing reads/writes

Every collection (Expenses, Approvals, Inventory, Staff, Tasks,
Notifications, Activity Log, Item Catalogue) is backed by
`useSupabaseCollection` (`src/hooks/useSupabaseCollection.js`), which:

- Loads the table's rows on mount
- Subscribes to Postgres Realtime changes for that table and merges
  incoming inserts/updates/deletes into local state as they arrive
- Exposes the exact same `[data, setData]` shape as a plain
  `useState`/the old `usePersistentState` — so every existing handler in
  `App.jsx` (add/update/delete expense, approve/reject, stock actions,
  etc.) is **completely unchanged**. The hook diffs whatever the handler
  just did against what was there before, and turns that diff into the
  right `insert` / `update` / `delete` calls under the hood.

Inventory is a special case (`useSupabaseInventory.js`): each item's stock
history is a separate table in the database (`inventory_stock_history`)
but the UI still works with it as an embedded `item.stock_history` array,
exactly as before — the hook stitches the two together when reading and
splits them apart when writing, so no Inventory component needed to
change.

Company Settings and System Settings are single-row tables, handled by
`useSupabaseSingleton.js`.

All database access goes through `src/services/collectionService.js` and
`src/services/settingsService.js` — no component or page ever imports
`supabase-js` directly, and no query is written more than once.

### Offline handling

`useOnlineStatus.js` tracks the browser's online/offline events. When
offline, a banner appears ("You're offline — changes are kept on this
device..."). Reads/writes that fail are caught, logged, and fall back to
the last-known local cache rather than crashing or silently discarding
data. The architecture (every write going through one diff function per
table) is deliberately structured so a future offline queue — replaying
failed writes once connectivity returns — can be added inside that one
function without touching any UI code.

### Security model: today vs. future

There is no login yet (by design, per this update's scope). Every table
has RLS **enabled**, with a single `"Pre-auth full access"` policy so the
app functions today using only the anon key. The migration file ends with
a `FUTURE AUTH` comment block describing the exact upgrade path: add a
`created_by uuid references auth.users(id)` column per table, then swap
each permissive policy for one that checks `auth.uid()`. No table needs to
be restructured to support that later.

## SQL migrations

| File | Purpose |
|---|---|
| `supabase/migrations/0001_init.sql` | Full initial schema: all 11 tables, indexes, `updated_at` triggers, RLS policies, and realtime publication membership. |

Tables created: `company_settings`, `system_settings`, `expenses`,
`expense_approvals`, `inventory_items`, `inventory_stock_history`,
`staff`, `tasks`, `notifications`, `activity_logs`, `item_catalogue`.

(`item_catalogue` isn't one of the modules in the sidebar — it's the
master Expense-Title → Category mapping the smart item picker uses. It's
real application data, so it's migrated and synced exactly like every
other table.)

## Notes on this environment

This project was built and build-tested (`npm install && npm run build`)
without live network access to the Supabase project itself, so the actual
database connection, migration, and realtime behavior could not be
executed end-to-end from here. The code follows standard, well-documented
`supabase-js` patterns throughout — once you run the migration SQL and the
app has your project's URL/key, it should connect and behave as described
above. If you hit anything unexpected, the browser console will show
`[supabase] ...` prefixed errors from the service layer, which is the
fastest place to start debugging.

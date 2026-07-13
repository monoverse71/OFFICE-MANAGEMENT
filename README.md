# Office Administration Management System — Dashboard

This is the first working slice of the system described in your database
design document: a **React + Vite + Tailwind** frontend, built against the
Version 1 schema (offices, users, expenses, approval_requests, tasks,
inventory_items, notifications, activity_logs, staff_directory).

Only the **Dashboard** module is built for now, using dummy data shaped
exactly like the tables in your spec (see `src/data/dummyData.js`) so that
swapping in real Supabase queries later is a drop-in replacement, not a
rewrite.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To produce a production build:

```bash
npm run build
npm run preview
```

## What's on the dashboard

- **KPI row** — this month's expense total, open approvals, low-stock
  items, and overdue tasks.
- **Recent Expenses** — a filterable ledger table (by status), reflecting
  the `expenses` + `expense_categories` tables.
- **Awaiting Approval** — live approve/reject buttons wired to local state,
  modeling the generic `approval_requests` engine. Buttons are disabled
  unless the role switcher (top right) is set to Chairman or Vice
  Chairman, matching your permission matrix.
- **Today's Tasks** — togglable checkboxes, modeling `tasks.status`.
- **Low Stock** — items at or below `low_stock_threshold`, from
  `inventory_items`.
- **Notifications** — an unread feed with mark-as-read, from
  `notifications`.
- **Activity Log** — a recent audit trail, from `activity_logs`.

## Design direction

The visual language is an "office register" — a navy/paper palette with a
brass accent, a serif display face for headers, and stamp-style status
badges — built to suit an audit-heavy, approval-driven office tool rather
than a generic SaaS dashboard template.

## Next steps

- Wire each panel to real Supabase queries scoped by `office_id` (RLS).
- Build out the remaining modules (Expenses, Approvals, Staff, Inventory,
  Documents, Tasks, Settings) as their own routed pages.
- Replace the role switcher with real auth + `permissions` table checks.

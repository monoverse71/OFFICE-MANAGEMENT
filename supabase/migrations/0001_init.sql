-- ============================================================================
-- Office Management System — Initial Schema
-- ============================================================================
-- Run this once in the Supabase SQL Editor (or via `supabase db push` if you
-- use the Supabase CLI) on a fresh project. Safe to re-run: every statement
-- is guarded with IF NOT EXISTS / OR REPLACE where possible.
--
-- Design notes:
--   • Every table uses a UUID primary key (gen_random_uuid(), from pgcrypto).
--   • created_at / updated_at are on every table; updated_at is maintained by
--     a shared trigger, not by the application.
--   • RLS is enabled on every table. Because there is no login yet, each
--     table currently has one permissive policy so the anon/publishable key
--     can read and write. This is intentional for this stage of the project
--     — see the "FUTURE AUTH" comments at the bottom for how to tighten it
--     later without any schema changes (just swap the policies).
--   • Foreign keys use ON DELETE CASCADE where a child record has no meaning
--     without its parent (approvals belong to an expense, stock history
--     belongs to an inventory item).
-- ============================================================================

create extension if not exists "pgcrypto";

-- Shared trigger function that keeps updated_at current on every UPDATE.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ----------------------------------------------------------------------------
-- Company Settings (singleton — the app always reads/writes the one row)
-- ----------------------------------------------------------------------------
create table if not exists company_settings (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My Company',
  logo text,
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  website text not null default '',
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_company_settings_updated_at on company_settings;
create trigger trg_company_settings_updated_at
  before update on company_settings
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- System Settings (singleton)
-- ----------------------------------------------------------------------------
create table if not exists system_settings (
  id uuid primary key default gen_random_uuid(),
  currency text not null default '৳',
  date_format text not null default 'DD MMM YYYY',
  time_format text not null default '24',
  timezone text not null default 'Asia/Dhaka',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_system_settings_updated_at on system_settings;
create trigger trg_system_settings_updated_at
  before update on system_settings
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Expenses
-- ----------------------------------------------------------------------------
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  amount numeric(14,2) not null,          -- Requested Amount — never overwritten
  quantity text,                           -- free text, e.g. "10 kg"
  expense_date date not null,
  status text not null default 'draft'
    check (status in ('draft','pending_approval','approved','rejected','paid','archived')),
  submitted_by text not null,              -- stores the active ROLE, not a person's name
  approved_amount numeric(14,2),           -- set only once approved — separate from amount
  payment_method text,
  payment_date date,
  approval_note text,
  approved_by text,                        -- stores the active ROLE
  approved_at timestamptz,
  rejected_reason text,
  attachment_file_name text,
  remarks text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_expenses_status on expenses (status);
create index if not exists idx_expenses_expense_date on expenses (expense_date);

drop trigger if exists trg_expenses_updated_at on expenses;
create trigger trg_expenses_updated_at
  before update on expenses
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Expense Approvals (one row per submission; history is never deleted)
-- ----------------------------------------------------------------------------
create table if not exists expense_approvals (
  id uuid primary key default gen_random_uuid(),
  expense_id uuid not null references expenses (id) on delete cascade,
  status text not null default 'pending_approval'
    check (status in ('pending_approval','approved','rejected')),
  requested_by text not null,              -- active ROLE at time of submission
  requested_at timestamptz not null default now(),
  decided_by text,                         -- active ROLE at time of decision
  decided_at timestamptz,
  comment text,
  rejection_reason text,
  approved_amount numeric(14,2),
  payment_method text,
  payment_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_expense_approvals_expense_id on expense_approvals (expense_id);
create index if not exists idx_expense_approvals_status on expense_approvals (status);

drop trigger if exists trg_expense_approvals_updated_at on expense_approvals;
create trigger trg_expense_approvals_updated_at
  before update on expense_approvals
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Inventory Items
-- ----------------------------------------------------------------------------
create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,               -- human-friendly "INV-2001" shown in the UI
  name text not null,
  category text not null,
  type text not null check (type in ('asset','consumable')),
  brand text,
  model text,
  unit text not null,
  quantity numeric(14,2) not null default 0, -- never written directly by the UI —
                                              -- only via the stock-movement functions
  location text not null,
  purchase_date date not null,
  notes text,
  status text,                             -- asset lifecycle: available/assigned/maintenance/disposed
  assigned_to uuid,                        -- reserved for future Staff assignment (no FK yet)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_inventory_items_category on inventory_items (category);
create index if not exists idx_inventory_items_type on inventory_items (type);

drop trigger if exists trg_inventory_items_updated_at on inventory_items;
create trigger trg_inventory_items_updated_at
  before update on inventory_items
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Inventory Stock History (permanent — never deleted, even if the item is)
-- ----------------------------------------------------------------------------
create table if not exists inventory_stock_history (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references inventory_items (id) on delete cascade,
  action text not null check (action in ('initial','add','remove','adjust')),
  added_quantity numeric(14,2),
  removed_quantity numeric(14,2),
  previous_quantity numeric(14,2) not null,
  current_quantity numeric(14,2) not null,
  notes text,
  performed_by text not null,              -- active ROLE, not a person's name
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_inventory_stock_history_item_id on inventory_stock_history (item_id);

-- ----------------------------------------------------------------------------
-- Staff Directory
-- ----------------------------------------------------------------------------
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,               -- human-friendly "EMP-1001" shown in the UI
  full_name text not null,
  mobile_number text not null,
  email text,
  designation text not null,
  department text not null,
  joining_date date not null,
  employment_status text not null default 'active'
    check (employment_status in ('active','on_leave','resigned')),
  address text,
  emergency_contact text,
  notes text,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_staff_department on staff (department);
create index if not exists idx_staff_employment_status on staff (employment_status);

drop trigger if exists trg_staff_updated_at on staff;
create trigger trg_staff_updated_at
  before update on staff
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Tasks
-- ----------------------------------------------------------------------------
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  assigned_to text,
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  due_date date,
  status text not null default 'todo' check (status in ('todo','in_progress','completed','overdue')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_tasks_updated_at on tasks;
create trigger trg_tasks_updated_at
  before update on tasks
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Notifications
-- ----------------------------------------------------------------------------
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_notifications_updated_at on notifications;
create trigger trg_notifications_updated_at
  before update on notifications
  for each row execute function set_updated_at();

-- ----------------------------------------------------------------------------
-- Activity Logs (append-only audit trail)
-- ----------------------------------------------------------------------------
create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor text not null,                     -- active ROLE, not a person's name
  action text not null,
  detail text not null,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_logs_occurred_at on activity_logs (occurred_at desc);

-- ----------------------------------------------------------------------------
-- Item Catalogue (the smart Expense Title → Category master mapping)
-- ----------------------------------------------------------------------------
create table if not exists item_catalogue (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  category text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_item_catalogue_updated_at on item_catalogue;
create trigger trg_item_catalogue_updated_at
  before update on item_catalogue
  for each row execute function set_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
-- RLS is ON for every table. There is no login yet, so for now each table
-- has one permissive policy scoped to the anon/publishable key. This keeps
-- the app fully working today while making the upgrade path explicit:
-- see "FUTURE AUTH" at the end of this file.

alter table company_settings       enable row level security;
alter table system_settings        enable row level security;
alter table expenses               enable row level security;
alter table expense_approvals      enable row level security;
alter table inventory_items        enable row level security;
alter table inventory_stock_history enable row level security;
alter table staff                  enable row level security;
alter table tasks                  enable row level security;
alter table notifications          enable row level security;
alter table activity_logs          enable row level security;
alter table item_catalogue         enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'company_settings','system_settings','expenses','expense_approvals',
    'inventory_items','inventory_stock_history','staff','tasks',
    'notifications','activity_logs','item_catalogue'
  ]
  loop
    execute format('drop policy if exists "Pre-auth full access" on %I;', t);
    execute format(
      'create policy "Pre-auth full access" on %I for all using (true) with check (true);', t
    );
  end loop;
end $$;

-- ============================================================================
-- REALTIME
-- ============================================================================
-- Adds every table to the supabase_realtime publication so changes made on
-- one device broadcast to every other connected client.

do $$
declare
  t text;
begin
  foreach t in array array[
    'company_settings','system_settings','expenses','expense_approvals',
    'inventory_items','inventory_stock_history','staff','tasks',
    'notifications','activity_logs','item_catalogue'
  ]
  loop
    begin
      execute format('alter publication supabase_realtime add table %I;', t);
    exception when duplicate_object then
      null; -- already added, ignore
    end;
  end loop;
end $$;

-- ============================================================================
-- FUTURE AUTH (do not run yet — reference only)
-- ============================================================================
-- When login is introduced, the recommended path is:
--   1. Add `created_by uuid references auth.users(id)` to each table.
--   2. Replace each "Pre-auth full access" policy with role-aware policies,
--      e.g.:
--        create policy "Read own office data" on expenses
--          for select using (auth.uid() = created_by or <role check>);
--   3. Keep using the anon key on the client — auth.uid() comes from the
--      user's JWT session, not from a different key.
-- No table structure above needs to change to support this later.

-- Before running: check that public.projects does not already exist, or that its
-- columns are compatible with this schema. This setup intentionally grants no
-- anonymous access; write and add the authenticated policies to
-- j6-hyrja-rls.sql before expecting app queries to succeed.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  description text,
  status text not null default 'Planned'
    check (status in ('In Progress', 'Completed', 'Delayed', 'Planned')),
  progress integer not null default 0
    check (progress between 0 and 100),
  budget numeric(12, 2) not null default 0
    check (budget >= 0),
  expenses numeric(12, 2) not null default 0
    check (expenses >= 0),
  created_at timestamptz not null default now(),
  is_demo boolean not null default false
);

alter table public.projects enable row level security;

drop policy if exists "Public can read demo projects" on public.projects;
drop policy if exists "Public can add demo projects" on public.projects;
revoke all on table public.projects from anon;

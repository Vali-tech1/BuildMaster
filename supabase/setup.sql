-- Before running: check that public.projects does not already exist, or that its
-- columns and RLS policies are compatible with this demo schema. Review and
-- remove any broader pre-existing SELECT policy; permissive policies are ORed.

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
create policy "Public can read demo projects"
  on public.projects
  for select
  to anon
  using (is_demo = true);

drop policy if exists "Public can add demo projects" on public.projects;
create policy "Public can add demo projects"
  on public.projects
  for insert
  to anon
  with check (is_demo = true);

grant select, insert on public.projects to anon;

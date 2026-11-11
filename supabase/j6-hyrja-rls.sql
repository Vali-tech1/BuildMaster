-- Hapi B: hiq qasjen publike demo të javës 5.
drop policy if exists "Public can read demo projects" on public.projects;
drop policy if exists "Public can add demo projects" on public.projects;
revoke all on table public.projects from anon;
alter table public.projects enable row level security;

-- Hapi C: shto pronësinë. Zëvendëso email-in më poshtë me llogarinë ekzistuese.
alter table public.projects
  add column if not exists pronari_id uuid references auth.users(id);

do $$
declare
  owner_user_id uuid;
begin
  if exists (
    select 1
    from public.projects
    where pronari_id is null
  ) then
    select id
      into owner_user_id
      from auth.users
      where email = 'EMAIL_I_LLOGARISE_EKZISTUESE';

    if owner_user_id is null then
      raise exception 'Replace EMAIL_I_LLOGARISE_EKZISTUESE with an existing account email.';
    end if;

    update public.projects
      set pronari_id = owner_user_id
      where pronari_id is null;
  end if;
end
$$;

alter table public.projects
  alter column pronari_id set default auth.uid(),
  alter column pronari_id set not null;

create index if not exists projects_pronari_id_idx
  on public.projects (pronari_id);

grant select, insert, update on table public.projects to authenticated;

-- Shkruaji vetë politikat SELECT, INSERT dhe UPDATE, sipas kërkesës së detyrës.

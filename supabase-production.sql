-- ClimaLink production data boundary. Run in the Supabase SQL editor before release.
alter table public.profiles add column if not exists organisation_id uuid;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists organisation text;
alter table public.profiles add column if not exists status text default 'active';
alter table public.profiles enable row level security;

create table if not exists public.portal_projects (
  id text primary key,
  organisation_id uuid not null,
  name text not null,
  status text not null default 'Draft',
  category text not null,
  primary_metric text,
  milestone text,
  public_reference text,
  released_fields jsonb not null default '[]'::jsonb,
  released_activity jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.portal_project_members (
  project_id text not null references public.portal_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  access_level text not null check (access_level in ('viewer','editor','approver')),
  primary key (project_id, user_id)
);

alter table public.portal_projects enable row level security;
alter table public.portal_project_members enable row level security;

drop policy if exists "profile self read" on public.profiles;
create policy "profile self read" on public.profiles for select to authenticated using (id = auth.uid());

drop policy if exists "scoped project read" on public.portal_projects;
create policy "scoped project read" on public.portal_projects for select to authenticated using (
  organisation_id = (select organisation_id from public.profiles where id = auth.uid())
  or exists (select 1 from public.portal_project_members m where m.project_id = id and m.user_id = auth.uid())
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','bd','projectlead','manager','developer','operations','finance','ceo'))
);

drop policy if exists "authorised project update" on public.portal_projects;
create policy "authorised project update" on public.portal_projects for update to authenticated using (
  exists (select 1 from public.portal_project_members m where m.project_id = id and m.user_id = auth.uid() and m.access_level in ('editor','approver'))
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','bd','projectlead','manager','developer','operations','finance'))
);

drop policy if exists "membership self read" on public.portal_project_members;
create policy "membership self read" on public.portal_project_members for select to authenticated using (
  user_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','bd'))
);

create or replace view public.portal_project_details with (security_invoker = true) as
select id, organisation_id, name, status, category, primary_metric, milestone, public_reference,
       released_fields, released_activity, updated_at from public.portal_projects;

grant select on public.portal_projects, public.portal_project_details, public.portal_project_members to authenticated;
grant update on public.portal_projects to authenticated;

do $$ begin
  alter publication supabase_realtime add table public.portal_projects;
exception when duplicate_object then null;
end $$;

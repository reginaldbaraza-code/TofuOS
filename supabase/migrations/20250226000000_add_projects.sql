-- Projects: one per user, each project has its own sources, insights, and chat
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Untitled Project',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sources belong to a project
alter table public.sources add column if not exists project_id uuid references public.projects(id) on delete cascade;

-- One row per project: last analyzed insights (JSON array)
create table if not exists public.project_insights (
  project_id uuid primary key references public.projects(id) on delete cascade,
  insights jsonb not null default '[]',
  updated_at timestamptz default now()
);

-- Chat messages per project
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_sources_project_id on public.sources(project_id);
create index if not exists idx_chat_messages_project_id on public.chat_messages(project_id);

-- RLS
alter table public.projects enable row level security;
alter table public.project_insights enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "Users can manage own projects" on public.projects;
create policy "Users can manage own projects" on public.projects for all using (auth.uid() = user_id);

drop policy if exists "Users can manage project_insights for own projects" on public.project_insights;
create policy "Users can manage project_insights for own projects" on public.project_insights for all
  using (exists (select 1 from public.projects p where p.id = project_insights.project_id and p.user_id = auth.uid()));

drop policy if exists "Users can manage chat_messages for own projects" on public.chat_messages;
create policy "Users can manage chat_messages for own projects" on public.chat_messages for all
  using (exists (select 1 from public.projects p where p.id = chat_messages.project_id and p.user_id = auth.uid()));

-- Optional: backfill existing sources into a default project per user (run once if you have existing data)
-- insert into public.projects (user_id, name)
-- select distinct user_id, 'Default Project' from public.sources where user_id is not null
-- on conflict do nothing;
-- update public.sources s set project_id = (select id from public.projects p where p.user_id = s.user_id limit 1)
-- where project_id is null and user_id is not null;

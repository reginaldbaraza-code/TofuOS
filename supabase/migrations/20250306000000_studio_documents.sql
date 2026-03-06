-- Studio generated documents per project (for list below buttons)
create table if not exists public.studio_documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  document_type text not null,
  label text not null,
  content text not null default '',
  source_count int not null default 0,
  created_at timestamptz default now()
);

create index if not exists idx_studio_documents_project_id on public.studio_documents(project_id);

alter table public.studio_documents enable row level security;

drop policy if exists "Users can manage studio_documents for own projects" on public.studio_documents;
create policy "Users can manage studio_documents for own projects" on public.studio_documents for all
  using (exists (select 1 from public.projects p where p.id = studio_documents.project_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.projects p where p.id = studio_documents.project_id and p.user_id = auth.uid()));

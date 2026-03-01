-- Jira OAuth: add columns to jira_configs for OAuth 2.0 (3LO) flow.
-- When access_token is set, app uses OAuth; otherwise uses domain/email/api_token (Basic).

alter table public.jira_configs add column if not exists access_token text;
alter table public.jira_configs add column if not exists refresh_token text;
alter table public.jira_configs add column if not exists token_expires_at timestamptz;
alter table public.jira_configs add column if not exists cloud_id text;
alter table public.jira_configs add column if not exists site_url text;

-- Make legacy Basic auth fields nullable so OAuth-only config is valid
alter table public.jira_configs alter column domain drop not null;
alter table public.jira_configs alter column email drop not null;
alter table public.jira_configs alter column api_token drop not null;

comment on column public.jira_configs.cloud_id is 'Atlassian cloud id for OAuth API base URL (api.atlassian.com/ex/jira/{cloud_id}/...)';
comment on column public.jira_configs.site_url is 'Jira site URL (e.g. https://your-site.atlassian.net) for display';

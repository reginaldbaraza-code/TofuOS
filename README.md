# tofuOS

AI-powered product management workspace: manage sources (documents, app reviews), get AI-driven insights, and create Jira tickets—all tied to your account.

---

## What You Need to Do (Summary)

| Who you are | What to do |
|-------------|------------|
| **Developer (local)** | Clone → install → copy `.env.example` to `.env.local` → add keys → run Supabase SQL → `npm run dev`. |
| **Deploying to Vercel** | Connect repo to Vercel → add env vars in Vercel → add production URL in Supabase redirect URLs → deploy. |
| **Project manager / stakeholder** | Use [docs/RESTRATEGY-AND-DEPLOYMENT.md](docs/RESTRATEGY-AND-DEPLOYMENT.md) for status, checklists, and deployment clarity. |

---

## Prerequisites

- **Node.js** 18.x or 20.x (`node -v`)
- **npm** (comes with Node)
- **Supabase** account ([supabase.com](https://supabase.com))
- **Optional:** Google Gemini API key and/or OpenAI API key for AI features; Jira Cloud for ticket creation

---

## Quick Start (Local)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd TofuOS
npm install
```

### 2. Environment variables

- Copy the example env file:
  ```bash
  cp .env.example .env.local
  ```
- Edit `.env.local` and set:
  - **Required:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from Supabase → Project Settings → API).
  - **Optional:** `GOOGLE_GEMINI_API_KEY`, `OPENAI_API_KEY` (for AI analysis/chat).

Do **not** commit `.env.local` or any file containing real keys.

### 3. Supabase setup (required for auth and data)

1. In the [Supabase Dashboard](https://supabase.com/dashboard), open your project.
2. Go to **SQL Editor** and run the following (creates tables and RLS).

**Table: `sources`** (for documents and app review sources):

```sql
create table if not exists sources (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  name text not null,
  type text not null,
  selected boolean default true,
  meta jsonb,
  user_id uuid references auth.users(id) on delete cascade not null
);

alter table sources enable row level security;
drop policy if exists "Users can manage their own sources" on sources;
create policy "Users can manage their own sources" on sources for all using (auth.uid() = user_id);
```

**Table: `jira_configs`** (saves Jira credentials per user):

```sql
create table if not exists jira_configs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  domain text not null,
  email text not null,
  api_token text not null,
  user_id uuid references auth.users(id) on delete cascade unique not null
);

alter table jira_configs enable row level security;
drop policy if exists "Users can manage their own jira config" on jira_configs;
create policy "Users can manage their own jira config" on jira_configs for all using (auth.uid() = user_id);
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with Supabase (e.g. Email or OAuth); add sources, run analysis, and create Jira tickets as needed.

---

## Deploying to Vercel

### Step 1: Connect the repo

- In [Vercel](https://vercel.com), create a new project (or use an existing one).
- Import your GitHub repository and select the branch you deploy from (e.g. `main`).

### Step 2: Set environment variables

In the Vercel project: **Settings → Environment Variables**. Add at least:

| Variable | Where to get it |
|----------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same as above |
| `GOOGLE_GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/) (if using Gemini) |
| `OPENAI_API_KEY` | [OpenAI API keys](https://platform.openai.com/api-keys) (if using OpenAI routes) |

Add these for **Production** (and optionally Preview/Development). Never commit real keys to the repo.

### Step 3: Allow redirect URLs in Supabase

- Supabase Dashboard → **Authentication → URL Configuration**.
- Under **Redirect URLs**, add:
  - Your production URL (e.g. `https://your-app.vercel.app`)
  - Optional: `https://*.vercel.app` for preview deployments.

### Step 4: Deploy

- Push to the connected branch; Vercel will build and deploy.
- If the build fails, check the build log and see [Troubleshooting](#troubleshooting) below and [docs/RESTRATEGY-AND-DEPLOYMENT.md](docs/RESTRATEGY-AND-DEPLOYMENT.md).

---

## Docs

- **[Restrategy, functionality & Vercel deployment](docs/RESTRATEGY-AND-DEPLOYMENT.md)** — Step-by-step restrategy checklist, functionality verification, Vercel deployment guidelines, and troubleshooting for developers and deployment owners.

---

## Tech Stack

| Area | Technology |
|------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 18, TypeScript, Tailwind CSS, shadcn/ui |
| Auth & database | Supabase (Auth + Postgres) |
| AI | Google Gemini and/or OpenAI (via API routes) |
| Ticketing | Jira Cloud API |

---

## Scripts

| Command | Purpose |
|---------|--------|
| `npm run dev` | Start development server (default port 3000) |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | Run ESLint |
| `npm run server` | Run standalone Express server in `server/` (optional; not used on Vercel) |

---

## Troubleshooting

- **Build fails with `Cannot find module './cjs/react.production.js'`**  
  Use React 18 in `package.json` (e.g. `"react": "^18.3.1"`, `"react-dom": "^18.3.1"`). Do not use React 19 with this Next.js setup until compatibility is confirmed.

- **Sign-in redirect fails**  
  Add the exact app URL (and preview URL if needed) to Supabase → Authentication → URL Configuration → Redirect URLs.

- **AI analysis or chat doesn’t work**  
  Ensure the correct API key is set in `.env.local` (local) or in Vercel Environment Variables (deployed), and that the variable name matches what the API route expects.

- **Jira ticket creation fails**  
  Configure Jira in the app (domain, email, API token). For Jira Cloud, create an API token at [Atlassian API tokens](https://id.atlassian.com/manage-profile/security/api-tokens). The app stores config in Supabase per user.

- **More detail (developers / deployment)**  
  See **[docs/RESTRATEGY-AND-DEPLOYMENT.md](docs/RESTRATEGY-AND-DEPLOYMENT.md)** for checklists, restrategy steps, verification, and deployment guidelines.

---

## License and Contributing

Private repository. For contribution or deployment questions, refer to the docs above and your team’s workflow.

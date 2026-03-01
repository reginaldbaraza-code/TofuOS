# What to do on Vercel and Supabase

Step-by-step checklist for deploying tofuOS (auth + Jira via API token).

---

## Supabase

### 1. Create / open your project

- Go to [supabase.com/dashboard](https://supabase.com/dashboard) and open your project (or create one).

### 2. Get API keys

- Go to **Project Settings** (gear) → **API**.
- Copy and save:
  - **Project URL** → use as `NEXT_PUBLIC_SUPABASE_URL`.
  - **anon public** key → use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### 3. Create tables (SQL Editor)

- Go to **SQL Editor** → **New query**.
- Run the SQL from the README for `sources` and `jira_configs` (see README – Supabase setup).
- Run the projects migration: `supabase/migrations/20250226000000_add_projects.sql`.

### 4. Redirect URLs (required for login to work)

- Go to **Authentication** → **URL Configuration**.
- Under **Redirect URLs**, add:
  - **Production:** `https://<your-vercel-app-domain>/`
  - **Preview (optional):** `https://*.vercel.app/`
- Use the exact domain Vercel gives you (e.g. `https://tofu-os.vercel.app`).
- Click **Save**.

---

## Vercel

### 1. Connect the repo

- Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
- Import your GitHub repo and select the branch you deploy from (e.g. `main`).

### 2. Build settings

- **Settings** → **General** (or **Build & Development**):
  - **Framework Preset:** Next.js (auto).
  - **Build Command:** `npm run build` (or leave default).
  - **Install Command:** `npm ci` (so installs match `package-lock.json`).
- Save if you changed anything.

### 3. Environment variables

- **Settings** → **Environment Variables**.
- Add these for **Production** (and for **Preview** if you use preview deployments):

| Variable | Required | Where to get it |
|----------|----------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase → Project Settings → API → anon public key |
| `GOOGLE_GEMINI_API_KEY` | For AI | [Google AI Studio](https://aistudio.google.com/) → Get API key |
| `OPENAI_API_KEY` | If using OpenAI | [OpenAI API keys](https://platform.openai.com/api-keys) |

- For each variable: **Key** = name above, **Value** = your value, select **Production** (and **Preview** if needed), then **Save**.

### 4. Deploy

- Push to the connected branch or use **Deployments** → **Redeploy**.
- After deploy, note your production URL and add it to Supabase Redirect URLs if not already done.

---

## Quick checklist

**Supabase**

- [ ] Project created; **Project URL** and **anon** key copied.
- [ ] Tables run (`sources`, `jira_configs`, projects migration).
- [ ] **Authentication → URL Configuration → Redirect URLs**: production URL (and optional `https://*.vercel.app`) added.

**Vercel**

- [ ] Repo connected; **Install Command** = `npm ci`.
- [ ] **Environment Variables**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`; optional: `GOOGLE_GEMINI_API_KEY`, `OPENAI_API_KEY`.
- [ ] Deploy; then add production URL to Supabase redirect URLs if not already done.

**Jira**

- [ ] Users configure Jira in the app (Settings → Integrations): domain, email, and [API token](https://id.atlassian.com/manage-profile/security/api-tokens). No OAuth.

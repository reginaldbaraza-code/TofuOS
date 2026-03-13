# Supabase + AI provider setup

This app uses **Supabase** for auth and database, and a configurable **AI provider** (OpenAI, Google Gemini, or Anthropic Claude) for personas, chat, and insights.

---

## 1. Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project (or use an existing one).
2. In the dashboard: **Project Settings → API**:
   - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. In **SQL Editor**, run the migration that creates tables and RLS:
   - Open `supabase/migrations/001_initial.sql` in this repo.
   - Copy its contents into the SQL Editor and run it.
   - This creates `profiles`, `personas`, `interviews`, `messages` and Row Level Security so users only see their own data.

---

## 2. Enable Email auth

- In Supabase: **Authentication → Providers → Email**.
- Ensure **Email** is enabled (default).
- Optional: turn on **Confirm email** if you want users to verify their address before signing in.

---

## 3. AI provider API key

Choose one provider and get an API key:

| Provider | Key variable | Where to get it |
|----------|-------------|-----------------|
| OpenAI (default) | `OPENAI_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| Google Gemini | `GOOGLE_GENERATIVE_AI_API_KEY` | [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |
| Anthropic Claude | `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |

Set `AI_PROVIDER` to `openai`, `google`, or `anthropic` (default: `openai`).
Optionally set `AI_MODEL` to override the default model.

---

## 4. Local env

Create `.env.local` (from `.env.example`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI Provider (default: openai)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

Run the app:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), then **Create one** to register. The trigger in the DB will create a `profiles` row with your name from signup.

---

## 5. Deploy to Vercel

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
2. In the Vercel project: **Settings → Environment Variables**. Add:

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `AI_PROVIDER` | `openai`, `google`, or `anthropic` |
   | `OPENAI_API_KEY` | Your provider API key |

3. Deploy. After the first deploy, in Supabase **Authentication → URL Configuration**, set **Site URL** to your Vercel URL (e.g. `https://your-app.vercel.app`) so redirects work.

---

## Summary

- **Auth & DB:** Supabase (Postgres + Auth).
- **AI:** Vercel AI SDK with multi-provider support; configured via `AI_PROVIDER` env var.
- **Build:** `pnpm build`.
